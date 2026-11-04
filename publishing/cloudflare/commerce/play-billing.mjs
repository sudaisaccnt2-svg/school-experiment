// Google Play alone supplies purchase state and expiry. Device claims never grant Pro.
const PACKAGE='com.asawera.chemistry', CACHE_MS=300000;
const PRODUCTS=['asawera_pro_monthly','asawera_pro_yearly'];
const encode=value=>btoa(String.fromCharCode(...value)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
const decode=value=>Uint8Array.from(atob(value.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
const bytes=value=>new TextEncoder().encode(value);
const digest=async value=>encode(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes(value))));
const sql=(env,text,...values)=>env.DB.prepare(text).bind(...values);
export class PlayError extends Error{constructor(status,message){super(message);this.status=status;}}
const fail=(status,message)=>{throw new PlayError(status,message);};
let oauthCache=null,jwksCache=null;
function credentials(env){try{const c=JSON.parse(env.PLAY_SERVICE_ACCOUNT || '{}');return /@[^@]+\.iam\.gserviceaccount\.com$/.test(c.client_email || '') && /^-----BEGIN PRIVATE KEY-----/.test(c.private_key || '') ? c:null;}catch{return null;}}
export const playReady=env=>Boolean(env.DB && env.CODE_PEPPER && env.PLAY_BILLING_ENABLED==='true' && credentials(env));
export async function playAccountId(env,userId){
  const key=await crypto.subtle.importKey('raw',bytes(env.CODE_PEPPER),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,bytes('play-account:'+userId)))).map(v=>v.toString(16).padStart(2,'0')).join('');
}
export async function playConfig(env,user){return {ready:playReady(env) && !user.owner,owner:Boolean(user.owner),accountId:!user.owner ? await playAccountId(env,user.id):null,packageName:PACKAGE,productIds:playReady(env) && !user.owner ? PRODUCTS:[],manageURL:'https://play.google.com/store/account/subscriptions?package='+PACKAGE};}
async function encryptionKey(env){return crypto.subtle.importKey('raw',await crypto.subtle.digest('SHA-256',bytes('play-token:'+env.CODE_PEPPER)),{name:'AES-GCM'},false,['encrypt','decrypt']);}
async function seal(env,token){const iv=crypto.getRandomValues(new Uint8Array(12));return encode(iv)+'.'+encode(new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},await encryptionKey(env),bytes(token))));}
async function unseal(env,value){const [iv,data]=value.split('.');return new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(iv)},await encryptionKey(env),decode(data)));}
function purchaseToken(value){if(typeof value!=='string' || !/^[A-Za-z0-9._~+\/-]{10,4096}$/.test(value))fail(400,'Invalid Google Play purchase token.');return value;}
const fetcher=env=>env.PLAY_FETCH || fetch;
async function oauth(env){
  const c=credentials(env);if(!c)fail(503,'Google Play purchases are not available yet.');
  const fingerprint=await digest(env.PLAY_SERVICE_ACCOUNT);
  if(oauthCache?.fingerprint===fingerprint && oauthCache.expires>Date.now()+60000)return oauthCache.token;
  const stamp=Math.floor(Date.now()/1000),header=encode(bytes(JSON.stringify({alg:'RS256',typ:'JWT'})));
  const claim=encode(bytes(JSON.stringify({iss:c.client_email,scope:'https://www.googleapis.com/auth/androidpublisher',aud:'https://oauth2.googleapis.com/token',iat:stamp,exp:stamp+3600})));
  const pem=c.private_key.replace(/-----[^-]+-----|\s/g,'');
  const key=await crypto.subtle.importKey('pkcs8',decode(pem),{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['sign']);
  const signature=encode(new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5',key,bytes(header+'.'+claim))));
  const response=await fetcher(env)('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:header+'.'+claim+'.'+signature}),signal:AbortSignal.timeout(10000)});
  const data=await response.json().catch(()=>({}));if(!response.ok || typeof data.access_token!=='string' || !Number.isFinite(data.expires_in))fail(503,'Google Play verification is temporarily unavailable.');
  oauthCache={fingerprint,token:data.access_token,expires:Date.now()+Math.min(data.expires_in,3600)*1000};return data.access_token;
}
async function google(env,path,post=false){
  const response=await fetcher(env)('https://androidpublisher.googleapis.com/androidpublisher/v3/applications/'+PACKAGE+'/purchases/'+path,{method:post ? 'POST':'GET',headers:{Authorization:'Bearer '+await oauth(env),'Content-Type':'application/json'},...(post?{body:'{}'}:{}),signal:AbortSignal.timeout(10000)});
  if(!response.ok)fail(response.status===404 || response.status===400 ? 400:503,response.status===404 || response.status===400 ? 'Google could not verify this purchase.':'Google Play verification is temporarily unavailable.');
  return post ? {}:response.json();
}
async function verify(env,token,binding){
  const data=await google(env,'subscriptionsv2/tokens/'+encodeURIComponent(token));
  if(data.externalAccountIdentifiers?.obfuscatedExternalAccountId!==binding)fail(403,'This purchase belongs to a different student account.');
  const items=data.lineItems;
  if(!Array.isArray(items) || items.length!==1 || !PRODUCTS.includes(items[0].productId))fail(400,'This purchase is not an Asawera Pro subscription.');
  const expiry=Date.parse(items[0].expiryTime);
  const state=data.subscriptionState;
  if(!Number.isFinite(expiry))fail(400,'Google returned an invalid subscription expiry.');
  const entitled=['SUBSCRIPTION_STATE_ACTIVE','SUBSCRIPTION_STATE_IN_GRACE_PERIOD','SUBSCRIPTION_STATE_CANCELED'].includes(state) && expiry>Date.now();
  let acknowledged=data.acknowledgementState==='ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED';
  if(entitled && !acknowledged){
    if(data.acknowledgementState!=='ACKNOWLEDGEMENT_STATE_PENDING')fail(400,'Google returned an invalid purchase acknowledgement.');
    await google(env,'subscriptions/'+encodeURIComponent(items[0].productId)+'/tokens/'+encodeURIComponent(token)+':acknowledge',true);acknowledged=true;
  }
  return {product:items[0].productId,state,expiry:entitled && acknowledged ? expiry:0,acknowledged};
}
export async function verifyPlayPurchase(env,user,input){
  if(!playReady(env))fail(503,'Google Play purchases are not available yet.');
  if(user.owner || !user.username || user.suspended)fail(403,'Use an active student account for Google Play purchases.');
  const token=purchaseToken(input.purchaseToken),hash=await digest(token),binding=await playAccountId(env,user.id);
  const old=await sql(env,'SELECT user_id FROM play_purchases WHERE token_hash=?',hash).first();
  if(old && old.user_id!==user.id)fail(409,'This purchase is already associated with another account.');
  const verified=await verify(env,token,binding),stamp=Date.now();
  const result=await sql(env,'INSERT INTO play_purchases(token_hash,user_id,token_cipher,product_id,account_binding,state,expires_at,acknowledged,verified_at,created_at) SELECT ?,?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM student_credentials WHERE user_id=?) ON CONFLICT(token_hash) DO UPDATE SET state=excluded.state,expires_at=excluded.expires_at,acknowledged=excluded.acknowledged,verified_at=excluded.verified_at WHERE play_purchases.user_id=excluded.user_id',hash,user.id,await seal(env,token),verified.product,binding,verified.state,verified.expiry,verified.acknowledged?1:0,stamp,stamp,user.id).run();
  if(!result.meta.changes)fail(409,'Account or purchase association changed. Sign in again.');
  return {ok:true,active:verified.expiry>stamp,expiresAt:verified.expiry || null,message:verified.expiry>stamp ? 'Google verified your Pro subscription.':'Your Google Play subscription is not active yet.'};
}
async function refresh(env,row){
  let verified;
  try{verified=await verify(env,await unseal(env,row.token_cipher),row.account_binding);}
  catch(error){if(!(error instanceof PlayError) || error.status!==400)throw error;verified={state:'UNVERIFIABLE',expiry:0,acknowledged:false};}
  await sql(env,'UPDATE play_purchases SET state=?,expires_at=?,acknowledged=?,verified_at=? WHERE token_hash=?',verified.state,verified.expiry,verified.acknowledged?1:0,Date.now(),row.token_hash).run();
  return verified.expiry;
}
export async function playUntil(env,user){
  // Existing accounts work when Play hasn't been connected. Previously purchased
  // subscriptions fail closed if verification is unavailable, suppressing app ads.
  const rows=(await sql(env,"SELECT * FROM play_purchases WHERE user_id=? AND state IN ('SUBSCRIPTION_STATE_ACTIVE','SUBSCRIPTION_STATE_IN_GRACE_PERIOD','SUBSCRIPTION_STATE_CANCELED') ORDER BY created_at DESC LIMIT 10",user.id).all()).results;
  if(!rows.length)return 0;
  if(!playReady(env))fail(503,'Subscription verification is temporarily unavailable.');
  let expiry=0;for(const row of rows){expiry=Math.max(expiry,Date.now()-row.verified_at<CACHE_MS ? row.expires_at:await refresh(env,row));}return expiry;
}
async function verifiedPush(request,env){
  if(!env.PLAY_RTDN_AUDIENCE || !env.PLAY_RTDN_SERVICE_EMAIL)fail(503,'Google Play notifications are not connected.');
  const jwt=(request.headers.get('Authorization') || '').replace(/^Bearer /,'');
  if(jwt.length>12000 || jwt.split('.').length!==3)fail(401,'Invalid notification identity.');
  try{
    const [head,body,signature]=jwt.split('.'),header=JSON.parse(new TextDecoder().decode(decode(head))),claim=JSON.parse(new TextDecoder().decode(decode(body))),stamp=Date.now()/1000;
    if(header.alg!=='RS256' || !['https://accounts.google.com','accounts.google.com'].includes(claim.iss) || claim.aud!==env.PLAY_RTDN_AUDIENCE || claim.email!==env.PLAY_RTDN_SERVICE_EMAIL || claim.email_verified!==true || !(claim.exp>stamp) || !(claim.iat<=stamp+60) || claim.exp-claim.iat>3700)fail(401,'Invalid notification identity.');
    if(!jwksCache || jwksCache.expires<Date.now() || !jwksCache.keys.some(k=>k.kid===header.kid)){
      const response=await fetcher(env)('https://www.googleapis.com/oauth2/v3/certs',{signal:AbortSignal.timeout(10000)});if(!response.ok)fail(503,'Notification verification is unavailable.');
      const keys=(await response.json()).keys;if(!Array.isArray(keys))fail(503,'Notification verification is unavailable.');jwksCache={keys,expires:Date.now()+3600000};
    }
    const jwk=jwksCache.keys.find(k=>k.kid===header.kid);if(!jwk)fail(401,'Invalid notification identity.');
    const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
    if(!await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,decode(signature),bytes(head+'.'+body)))fail(401,'Invalid notification identity.');
  }catch(error){if(error instanceof PlayError)throw error;fail(401,'Invalid notification identity.');}
}
export async function playNotification(request,env,input){
  if(!playReady(env))fail(503,'Google Play notifications are not connected.');
  await verifiedPush(request,env);
  let data;try{data=JSON.parse(new TextDecoder().decode(decode(input.message?.data || '')));}catch{fail(400,'Invalid Google notification.');}
  if(data.packageName!==PACKAGE)fail(400,'Unexpected notification package.');
  if(data.testNotification)return {ok:true};
  const token=purchaseToken(data.subscriptionNotification?.purchaseToken || data.voidedPurchaseNotification?.purchaseToken);
  const row=await sql(env,'SELECT * FROM play_purchases WHERE token_hash=?',await digest(token)).first();
  if(row)await refresh(env,row);return {ok:true};
}
