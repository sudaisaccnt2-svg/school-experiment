// Same-origin Pages API. Auth is verified with Supabase; Pro and payments live in private D1 tables.
import {accessOwner,accessReady} from './owner-access.mjs';
import {passwordOwner,ownerPasswordReady,verifyOwnerPassword,startOwnerSession,endOwnerSession,ownerCookie} from './owner-password.mjs';
import {PricingError,catalog,publicPricing,legacyTiers,validatePricing,adminPricing,savePricing,quote,publicQuote,createPricedOrder} from './pricing.mjs';
import {AD_DEFAULTS,adFields} from './public/ad-config.js';
import {StudentAuthError,studentAuthReady,studentAuthAction,studentViewer,studentCookie,endStudentSession,deleteStudentAccount} from './student-auth.mjs';
import {PlayError,playReady,playConfig,playUntil,verifyPlayPurchase,playNotification} from './play-billing.mjs';
const ACCESS = '__Host-asawera_access', REFRESH = '__Host-asawera_refresh', RECOVERY = '__Host-asawera_recovery';
const DAY = 86400000;
class HTTPError extends Error { constructor(status, message) { super(message); this.status = status; } }
const fail = (status, message) => { throw new HTTPError(status, message); };
const statement = (env, sql, ...values) => env.DB.prepare(sql).bind(...values);
const now = () => Date.now();
const integer = (value, min, max) => { if (!Number.isSafeInteger(value) || value < min || value > max) fail(400, 'Enter a valid whole number.'); return value; };
const short = (value, max = 300) => { if (typeof value !== 'string' || value.length > max) fail(400, 'Invalid text.'); return value.trim(); };
const json = (data, status = 200, cookies = []) => {
  const headers = new Headers({'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'});
  for (const cookie of cookies) headers.append('Set-Cookie', cookie);
  return new Response(JSON.stringify(data), {status, headers});
};
const cookie = (name, value, age) => `${name}=${encodeURIComponent(value)}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${age}`;
const clearCookies = () => [cookie(ACCESS, '', 0), cookie(REFRESH, '', 0), cookie(RECOVERY,'',0),ownerCookie(),studentCookie()];
const sessionCookies = (session) => [cookie(ACCESS, session.access_token, Math.min(session.expires_in || 3600, 3600)), cookie(REFRESH, session.refresh_token, 2592000)];
function cookies(request) {
  const pairs = (request.headers.get('Cookie') || '').split(';').map(part => part.trim().split('='));
  return Object.fromEntries(pairs.map(([key, ...value]) => { try { return [key, decodeURIComponent(value.join('='))]; } catch { return [key, '']; } }));
}
async function body(request,limit=8192) {
  const reader = request.body?.getReader(); if (!reader) fail(400, 'Missing request.');
  const chunks = []; let length = 0;
  while (true) {
    const part = await reader.read(); if (part.done) break;
    length += part.value.byteLength; if (length > limit) { await reader.cancel(); fail(413, 'Request too large.'); }
    chunks.push(part.value);
  }
  const bytes = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { const parsed = JSON.parse(new TextDecoder().decode(bytes)); if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') fail(400, 'Invalid request.'); return parsed; }
  catch { fail(400, 'Invalid request.'); }
}
function requireOrigin(request) {
  if (request.headers.get('Origin') !== new URL(request.url).origin) fail(403, 'This request must come from the website.');
  if (!(request.headers.get('Content-Type') || '').startsWith('application/json')) fail(415, 'Use JSON.');
}
const authReady = env => Boolean(env.SUPABASE_URL && env.SUPABASE_PUBLISHABLE_KEY);
const accountsReady = env => studentAuthReady(env) || authReady(env);
async function auth(env, path, options = {}) {
  if (!authReady(env)) fail(503, 'Sign-in is being set up. Lessons are still available.');
  const url = new URL(path, env.SUPABASE_URL + '/auth/v1/');
  if (url.protocol !== 'https:' || url.origin !== new URL(env.SUPABASE_URL).origin) fail(503, 'Sign-in is unavailable.');
  const response = await (env.AUTH_FETCH || fetch)(url, {
    ...options, signal: AbortSignal.timeout(10000),
    headers: {apikey: env.SUPABASE_PUBLISHABLE_KEY, 'Content-Type':'application/json', ...options.headers},
  });
  const data = await response.json().catch(() => ({}));
  return {ok: response.ok, data};
}
async function rate(env, key, limit = 10) {
  const window = Math.floor(now() / 300000);
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key + ':' + window));
  const id = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
  const result = await statement(env, 'INSERT INTO rate_limits(id,count,expires_at) VALUES(?,1,?) ON CONFLICT(id) DO UPDATE SET count=count+1 RETURNING count', id, now() + 600000).first();
  if (result.count > limit) fail(429, 'Please wait a few minutes before trying again.');
}
export async function viewer(request, env) {
  const owner = await passwordOwner(request,env) || await accessOwner(request,env);
  if (owner) { await remember(env,owner); return {user:owner,cookies:[]}; }
  const local=await studentViewer(request,env);
  if(local?.user){await remember(env,local.user);return local;}
  const saved = cookies(request);
  if (!saved[ACCESS] && !saved[REFRESH]) return local || {user:null, cookies:[]};
  let token = saved[ACCESS], setCookies = [];
  let result = token ? await auth(env, 'user', {headers:{Authorization:'Bearer ' + token}}) : {ok:false};
  if (!result.ok && saved[REFRESH]) {
    const refreshed = await auth(env, 'token?grant_type=refresh_token', {method:'POST', body:JSON.stringify({refresh_token:saved[REFRESH]})});
    if (refreshed.ok && refreshed.data.access_token && refreshed.data.refresh_token) {
      token = refreshed.data.access_token; setCookies = sessionCookies(refreshed.data);
      result = await auth(env, 'user', {headers:{Authorization:'Bearer ' + token}});
    }
  }
  if (!result.ok || !result.data.id || !result.data.email_confirmed_at) return {user:null, cookies:clearCookies()};
  const user = {id: result.data.id, email: result.data.email,
    owner: Boolean(env.OWNER_EMAIL) && result.data.email.toLowerCase() === env.OWNER_EMAIL.toLowerCase()};
  await remember(env,user);
  const control=await statement(env,'SELECT status FROM account_controls WHERE user_id=?',user.id).first();
  user.suspended=control?.status === 'suspended';
  return {user, cookies:setCookies};
}
async function remember(env,user) {
  if(user.username){
    await env.DB.batch([
      statement(env,'INSERT INTO accounts(id,email,created_at) SELECT ?,?,? WHERE EXISTS(SELECT 1 FROM student_credentials WHERE user_id=? AND username=?) ON CONFLICT(id) DO NOTHING',user.id,user.email,now(),user.id,user.username),
      statement(env,'INSERT INTO account_controls(user_id,last_seen) SELECT ?,? WHERE EXISTS(SELECT 1 FROM student_credentials WHERE user_id=? AND username=?) ON CONFLICT(user_id) DO UPDATE SET last_seen=excluded.last_seen WHERE account_controls.last_seen<?',user.id,now(),user.id,user.username,now()-3600000),
    ]);return;
  }
  await env.DB.batch([
    statement(env,'INSERT INTO accounts(id,email,created_at) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET email=excluded.email WHERE accounts.email<>excluded.email',user.id,user.email,now()),
    statement(env,'INSERT INTO account_controls(user_id,last_seen) VALUES(?,?) ON CONFLICT(user_id) DO UPDATE SET last_seen=excluded.last_seen WHERE account_controls.last_seen<?',user.id,now(),now()-3600000),
  ]);
}
async function settings(env) { const row = await statement(env, "SELECT value FROM settings WHERE id='public'").first(); return {...AD_DEFAULTS,...JSON.parse(row.value)}; }
async function website(env) { const row=await statement(env,"SELECT value FROM settings WHERE id='website'").first(); return row ? JSON.parse(row.value) : {siteTitle:'Asawera Science',contactEmail:'',announcement:'',registrationsOpen:false}; }
async function membership(env, user) {
  if (!user) return {pro:false, owner:false, proUntil:null};
  const row = await statement(env, 'SELECT pro_until FROM memberships WHERE user_id=?', user.id).first();
  const expiry=user.owner || user.suspended ? row?.pro_until || 0 : Math.max(row?.pro_until || 0,await playUntil(env,user));
  return {pro:user.owner || (!user.suspended && expiry > now()), owner:user.owner, proUntil:user.owner ? null : expiry || null};
}
async function codeHash(env, code) {
  if (!env.CODE_PEPPER) fail(503, 'Access codes are being set up.');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.CODE_PEPPER), {name:'HMAC',hash:'SHA-256'}, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(code.replace(/[\s-]/g,'').toUpperCase()));
  return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2,'0')).join('');
}
const audit = (env, user, action, target, note = '') => statement(env, 'INSERT INTO audit(actor,action,target,note,created_at) VALUES(?,?,?,?,?)', user.id, action, target, note, now());
const extend = (env, id, days) => statement(env, 'INSERT INTO memberships(user_id,pro_until) VALUES(?,?) ON CONFLICT(user_id) DO UPDATE SET pro_until=MAX(memberships.pro_until,?)+?', id, now() + days*DAY, now(), days*DAY);
function checkSettings(input,tiers) {
  const out = {};
  for (const field of ['monthlyPaisa','yearlyPaisa']) out[field] = input[field] == null ? null : integer(input[field], 100, 100000000);
  for (const field of ['manualPayments','adsEnabled','adsApproved']) { if (typeof input[field] !== 'boolean') fail(400,'Invalid setting.'); out[field] = input[field]; }
  out.paymentInstructions = short(input.paymentInstructions, 1500);
  out.publisherId = short(input.publisherId, 40); out.adSlot = short(input.adSlot, 30);
  out.ageTreatment = integer(input.ageTreatment ?? 1,1,2);
  if (out.publisherId && !/^ca-pub-\d{16}$/.test(out.publisherId)) fail(400,'Enter the AdSense publisher ID.');
  if (out.adSlot && !/^\d+$/.test(out.adSlot)) fail(400,'Enter a valid ad slot.');
  try { Object.assign(out,adFields({...input,...out})); } catch(error){fail(400,error.message);}
  if (out.manualPayments && (!out.paymentInstructions || !(tiers ?? legacyTiers(out)).some(tier=>tier.enabled))) fail(400,'Set payment instructions and an available pricing tier before opening purchases.');
  return out;
}

export async function handle(request, env) {
  let outgoing = [];
  try {
    const path = new URL(request.url).pathname.replace(/^\/api\/?/, '');
    if(path==='play/notifications' && request.method==='POST')return json(await playNotification(request,env,await body(request,32768)));
    if (path === 'health') return json({ok:true, accountsReady:accountsReady(env),studentAuthMode:studentAuthReady(env) ? 'username' : 'email', ownerAccessReady:accessReady(env),ownerPasswordReady:ownerPasswordReady(env), databaseReady:Boolean(env.DB)});
    if(path==='pricing' && request.method==='GET') {
      if(!env.DB) fail(503,'Pricing is unavailable.');
      return json(publicPricing(await catalog(env)));
    }
    if(path === 'owner-login' && request.method === 'GET') {
      const url=new URL(request.url), login=accessReady(env) ? new URL('/cdn-cgi/access/login/'+url.host,'https://'+env.CF_ACCESS_TEAM_DOMAIN) : null;
      if(login) login.searchParams.set('redirect_url',new URL('/control-room',url).href);
      return json({ownerAccessReady:accessReady(env),ownerPasswordReady:ownerPasswordReady(env),accountsReady:accountsReady(env),loginUrl:login?.href || null});
    }
    if (!env.DB) fail(503, 'Accounts and purchases are being set up. Lessons are still available.');
    if (request.method !== 'GET') { if (request.method !== 'POST') fail(405,'Use GET or POST.'); requireOrigin(request); }
    if (path === 'logout' && request.method === 'POST') {
      await endOwnerSession(request,env);
      await endStudentSession(request,env);
      return json({ok:true,logoutUrl:await accessOwner(request,env) ? 'https://'+env.CF_ACCESS_TEAM_DOMAIN+'/cdn-cgi/access/logout' : null},200,clearCookies());
    }
    if(studentAuthReady(env) && ['login','signup','student-recover'].includes(path) && request.method==='POST'){
      const input=await body(request),ip=request.headers.get('CF-Connecting-IP') || 'unknown';
      await statement(env,'DELETE FROM rate_limits WHERE id IN (SELECT id FROM rate_limits WHERE expires_at<? LIMIT 50)',now()).run();
      await rate(env,'student-auth:'+ip,40);
      const identifier=typeof (input.username ?? input.email)==='string' ? (input.username ?? input.email).trim().toLowerCase().slice(0,32) : '';
      await rate(env,'student-auth:'+path+':'+ip+':'+identifier,path==='signup' ? 3 : 8);
      if(path==='signup' && !(await website(env)).registrationsOpen)fail(403,'New student registration is currently closed.');
      const result=await studentAuthAction(env,path,input);
      await endStudentSession(request,env);
      return json(result.body,200,[...clearCookies(),result.cookie]);
    }
    if(path==='owner-password-login' && request.method==='POST') {
      if(!ownerPasswordReady(env)) fail(503,'Owner sign-in is not connected.');
      await rate(env,'owner-login:'+(request.headers.get('CF-Connecting-IP') || 'unknown'),5);
      const input=await body(request);
      if(!await verifyOwnerPassword(env,short(input.email,254),input.password)) fail(401,'Owner email or password is incorrect.');
      return json({ok:true},200,[...clearCookies(),await startOwnerSession(env)]);
    }
    if (path === 'password-reset' && request.method === 'POST') {
      const input=await body(request), expected=cookies(request)[RECOVERY];
      if (!expected || input.nonce !== expected) fail(403,'Start the reset from this browser again.');
      if (typeof input.password !== 'string' || input.password.length < 12 || input.password.length > 128) fail(400,'Use at least 12 characters.');
      const identity=await auth(env,'user',{headers:{Authorization:'Bearer '+short(input.accessToken,5000)}});
      if (!identity.ok || !identity.data.email_confirmed_at) fail(401,'This reset link is invalid or expired.');
      const refreshed=await auth(env,'token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:short(input.refreshToken,5000)})});
      if (!refreshed.ok || refreshed.data.user?.id !== identity.data.id) fail(401,'This reset link is invalid or expired.');
      const updated=await auth(env,'user',{method:'PUT',headers:{Authorization:'Bearer '+refreshed.data.access_token},body:JSON.stringify({password:input.password})});
      if (!updated.ok) fail(400,'The password could not be updated. Request a new link.');
      return json({ok:true},200,[...sessionCookies(refreshed.data),cookie(RECOVERY,'',0)]);
    }
    if (['login','signup','reset'].includes(path) && request.method === 'POST') {
      await rate(env, 'auth:' + (request.headers.get('CF-Connecting-IP') || 'unknown'));
      const input = await body(request), email = short(input.email,254).toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(400,'Enter a valid email.');
      if (path === 'reset') {
        const nonce=crypto.randomUUID(), redirect=new URL('/account',request.url); redirect.searchParams.set('recovery_nonce',nonce);
        await auth(env, 'recover?redirect_to='+encodeURIComponent(redirect.href), {method:'POST',body:JSON.stringify({email})});
        return json({message:'If this account exists, a reset email will arrive. Open it in this browser.'},200,[cookie(RECOVERY,nonce,900)]);
      }
      const password = input.password;
      if(path === 'signup' && !(await website(env)).registrationsOpen) fail(403,'New student registration is currently closed.');
      if (typeof password !== 'string' || password.length < (path==='signup' ? 12 : 1) || password.length > 128) fail(400,'Use a password with at least 12 characters.');
      const result = await auth(env, path === 'login' ? 'token?grant_type=password' : 'signup', {method:'POST',body:JSON.stringify({email,password})});
      if (!result.ok) fail(path === 'login' ? 401 : 400, path === 'login' ? 'Email or password is incorrect, or the email is not confirmed.' : 'Could not create the account. Try signing in or resetting your password.');
      if (!result.data.access_token) return json({message:'Check your email to confirm the account, then sign in.'});
      return json({ok:true},200,sessionCookies(result.data));
    }
    const identity = await viewer(request, env); outgoing = identity.cookies; const user = identity.user;
    if (path === 'session' && request.method === 'GET') {
      const book=await catalog(env);
      return json({user:user ? {email:user.email,id:user.id,suspended:Boolean(user.suspended)} : null,
        membership:await membership(env,user), config:{...AD_DEFAULTS,...book.cfg,pricing:publicPricing(book),website:await website(env), accountsReady:accountsReady(env),studentAuthMode:studentAuthReady(env) ? 'username' : 'email', ownerAccessReady:accessReady(env),codesReady:Boolean(env.CODE_PEPPER),
          ownerPasswordReady:ownerPasswordReady(env),adsLocationEligible:request.cf?.country === 'PK'}},200,outgoing);
    }
    if(path==='student-delete-account' && request.method==='POST'){
      await rate(env,'student-delete:'+(request.headers.get('CF-Connecting-IP') || 'unknown'),5);
      const result=await deleteStudentAccount(env,user,await body(request));
      return json(result,200,clearCookies());
    }
    if (!user) fail(401,studentAuthReady(env) ? 'Sign in to continue.' : 'Sign in with a confirmed email to continue.');
    if (path.startsWith('admin/') && !user.owner) fail(403,'This page is only for the website owner.');
    if(user.suspended && !user.owner) fail(403,'Your account is suspended. Contact the website owner.');
    if(path==='play/config' && request.method==='GET')return json({...await playConfig(env,user),membership:await membership(env,user)},200,outgoing);
    if(path==='play/verify' && request.method==='POST'){
      if(user.owner)fail(400,'Your owner account already has ad-free Pro.');
      await rate(env,'play-verify:'+user.id,15);
      const result=await verifyPlayPurchase(env,user,await body(request));
      return json({...result,membership:await membership(env,user)},200,outgoing);
    }
    if(path==='student-change-password' && request.method==='POST'){
      if(!studentAuthReady(env) || !user.username || user.owner)fail(400,'Use the password settings for your sign-in method.');
      await rate(env,'student-password:'+user.id,5);
      const result=await studentAuthAction(env,path,{...await body(request),username:user.username});
      return json(result.body,200,[...clearCookies(),result.cookie]);
    }
    if(path==='quote' && request.method==='POST') {
      await rate(env,'quote:'+user.id,30);
      return json(publicQuote(await quote(env,user,await body(request))),200,outgoing);
    }
    if (path === 'orders' && request.method === 'GET') {
      const rows = await statement(env, 'SELECT id,plan,plan_name,amount_paisa,base_amount_paisa,discount_paisa,discount_label,coupon_code,quote_expires_at,cancelled_at,days,method,status,reference,created_at FROM orders WHERE user_id=? ORDER BY created_at DESC LIMIT 30', user.id).all();
      return json({orders:rows.results},200,outgoing);
    }
    if (path === 'orders' && request.method === 'POST') {
      await rate(env,'order:'+user.id,10); const input=await body(request);
      return json(await createPricedOrder(env,user,input,await quote(env,user,input)),201,outgoing);
    }
    if (path === 'orders/report' && request.method === 'POST') {
      const input=await body(request), reference=short(input.reference,100).toUpperCase(); if (reference.length < 4) fail(400,'Enter the transaction reference.');
      const id=short(input.id,50),nonce=crypto.randomUUID();
      const result=await env.DB.batch([
        statement(env,"UPDATE orders SET reference=?,status='reported',fulfillment_nonce=? WHERE id=? AND user_id=? AND status='pending' AND (quote_expires_at IS NULL OR quote_expires_at>?)",reference,nonce,id,user.id,now()),
        statement(env,"UPDATE coupon_redemptions SET state='reported' WHERE order_id=? AND EXISTS(SELECT 1 FROM orders WHERE id=? AND fulfillment_nonce=?)",id,id,nonce),
      ]);
      if (!result[0].meta.changes) fail(409,'This order expired, was cancelled, or has already been reported. Create a new order for the current price.');
      return json({message:'Payment submitted for owner verification. Pro starts after the payment is confirmed.'},200,outgoing);
    }
    if(path==='orders/cancel' && request.method==='POST') {
      const input=await body(request),id=short(input.id,50),nonce=crypto.randomUUID(),stamp=now();
      const result=await env.DB.batch([
        statement(env,"UPDATE orders SET status='rejected',cancelled_at=?,fulfillment_nonce=? WHERE id=? AND user_id=? AND status='pending'",stamp,nonce,id,user.id),
        statement(env,"UPDATE coupon_redemptions SET state='released' WHERE order_id=? AND EXISTS(SELECT 1 FROM orders WHERE id=? AND fulfillment_nonce=?)",id,id,nonce),
        statement(env,"INSERT INTO audit(actor,action,target,note,created_at) SELECT ?,'cancel-order',id,'Unpaid order cancelled',? FROM orders WHERE fulfillment_nonce=?",user.id,stamp,nonce),
      ]);
      if(!result[0].meta.changes)fail(409,'Only your unpaid, unreported orders can be cancelled.');
      return json({ok:true,message:'Unpaid order cancelled. Its promo-code reservation has been released.'},200,outgoing);
    }
    if (path === 'redeem' && request.method === 'POST') {
      await rate(env,'code:'+user.id,8); const input=await body(request), hash=await codeHash(env,short(input.code,100)), nonce=crypto.randomUUID(), stamp=now();
      const batch=await env.DB.batch([
        statement(env,'UPDATE access_codes SET redeemed_by=?,redeemed_at=?,redemption_nonce=? WHERE code_hash=? AND redeemed_by IS NULL AND expires_at>?',user.id,stamp,nonce,hash,stamp),
        statement(env,'INSERT INTO memberships(user_id,pro_until) SELECT ?,?+days*? FROM access_codes WHERE redemption_nonce=? ON CONFLICT(user_id) DO UPDATE SET pro_until=MAX(memberships.pro_until,?)+(SELECT days*? FROM access_codes WHERE redemption_nonce=?)',user.id,stamp,DAY,nonce,stamp,DAY,nonce),
        statement(env,"INSERT INTO audit(actor,action,target,note,created_at) SELECT ?,'redeem',id,'',? FROM access_codes WHERE redemption_nonce=?",user.id,stamp,nonce),
      ]);
      if (!batch[0].meta.changes) fail(409,'This code is invalid, expired, or already used.');
      return json({membership:await membership(env,user)},200,outgoing);
    }
    if (path === 'admin/overview' && request.method === 'GET') {
      const [accounts, paid, orders, codes, history] = await Promise.all([
        statement(env,"SELECT COUNT(*) AS count FROM accounts WHERE id NOT LIKE 'deleted:%'").first(),
        statement(env,"SELECT COALESCE(SUM(amount_paisa),0) AS total FROM orders WHERE status='paid'").first(),
        statement(env,'SELECT o.*,a.email FROM orders o JOIN accounts a ON a.id=o.user_id ORDER BY o.created_at DESC LIMIT 100').all(),
        statement(env,'SELECT id,days,expires_at,redeemed_by,created_at FROM access_codes ORDER BY created_at DESC LIMIT 100').all(),
        statement(env,'SELECT * FROM audit ORDER BY id DESC LIMIT 50').all(),
      ]);
      const suspended=await statement(env,"SELECT COUNT(*) AS count FROM account_controls WHERE status='suspended'").first();
      const studentCount=await statement(env,"SELECT COUNT(*) AS count FROM accounts WHERE id NOT LIKE 'deleted:%' AND lower(email)<>lower(?)",env.OWNER_EMAIL || '').first();
      const activePro=await statement(env,"SELECT COUNT(*) AS count FROM accounts a LEFT JOIN memberships m ON m.user_id=a.id LEFT JOIN account_controls c ON c.user_id=a.id WHERE MAX(COALESCE(m.pro_until,0),COALESCE((SELECT MAX(p.expires_at) FROM play_purchases p WHERE p.user_id=a.id),0))>? AND COALESCE(c.status,'active')='active' AND a.id NOT LIKE 'deleted:%' AND lower(a.email)<>lower(?)",now(),env.OWNER_EMAIL || '').first();
      return json({settings:await settings(env),website:await website(env),readiness:{studentSignIn:accountsReady(env),studentAuthMode:studentAuthReady(env) ? 'username' : 'email',ownerAccess:accessReady(env),ownerPassword:ownerPasswordReady(env),codes:Boolean(env.CODE_PEPPER),playBilling:playReady(env)},metrics:{accounts:accounts.count,students:studentCount.count,suspended:suspended.count,pro:activePro.count,revenuePaisa:paid.total},orders:orders.results,codes:codes.results,audit:history.results},200,outgoing);
    }
    if(path === 'admin/website' && request.method === 'POST') {
      const input=await body(request), cfg={siteTitle:short(input.siteTitle,80),contactEmail:short(input.contactEmail,254),announcement:short(input.announcement,700),registrationsOpen:input.registrationsOpen};
      if(!cfg.siteTitle || (cfg.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cfg.contactEmail)) || typeof cfg.registrationsOpen !== 'boolean') fail(400,'Enter a website name, valid contact email, and registration setting.');
      if(cfg.registrationsOpen && !accountsReady(env)) fail(400,'Connect student sign-in before opening registration.');
      await env.DB.batch([statement(env,"INSERT INTO settings(id,value) VALUES('website',?) ON CONFLICT(id) DO UPDATE SET value=excluded.value",JSON.stringify(cfg)),audit(env,user,'website-settings','website')]);
      return json({website:cfg},200,outgoing);
    }
    if(path==='admin/pricing' && request.method==='GET')return json(await adminPricing(env),200,outgoing);
    if(path==='admin/pricing' && request.method==='POST')return json({pricing:await savePricing(env,validatePricing(await body(request,65536)),user.id)},200,outgoing);
    if(path === 'admin/students' && request.method === 'GET') {
      const query=new URL(request.url).searchParams, search=short(query.get('q') || '',100), cursor=short(query.get('cursor') || '',100);
      const pattern='%'+search.replace(/[\\%_]/g,char=>'\\'+char)+'%';
      const rows=await statement(env,"SELECT a.id,a.email,a.created_at,COALESCE(c.status,'active') AS status,COALESCE(c.student_name,'') AS student_name,COALESCE(c.class_label,'') AS class_label,COALESCE(c.private_note,'') AS private_note,COALESCE(c.last_seen,0) AS last_seen,MAX(COALESCE(m.pro_until,0),COALESCE((SELECT MAX(p.expires_at) FROM play_purchases p WHERE p.user_id=a.id),0)) AS pro_until FROM accounts a LEFT JOIN account_controls c ON c.user_id=a.id LEFT JOIN memberships m ON m.user_id=a.id WHERE a.id NOT LIKE 'deleted:%' AND a.id>? AND lower(a.email)<>lower(?) AND (a.email LIKE ? ESCAPE '\\' OR c.student_name LIKE ? ESCAPE '\\' OR c.class_label LIKE ? ESCAPE '\\') ORDER BY a.id LIMIT 51",cursor,env.OWNER_EMAIL || '',pattern,pattern,pattern).all();
      return json({students:rows.results.slice(0,50),nextCursor:rows.results.length>50 ? rows.results[49].id : null},200,outgoing);
    }
    if(path === 'admin/student' && request.method === 'POST') {
      const input=await body(request), id=short(input.id,100), account=await statement(env,'SELECT email FROM accounts WHERE id=?',id).first();
      if(!account) fail(404,'Student account not found.');
      if(account.email.toLowerCase()===(env.OWNER_EMAIL || '').toLowerCase()) fail(400,'The owner account cannot be changed here.');
      if(!['active','suspended'].includes(input.status)) fail(400,'Choose active or suspended.');
      const name=short(input.name || '',100), group=short(input.classLabel || '',100), note=short(input.note || '',500);
      await env.DB.batch([statement(env,'INSERT INTO account_controls(user_id,status,student_name,class_label,private_note) VALUES(?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET status=excluded.status,student_name=excluded.student_name,class_label=excluded.class_label,private_note=excluded.private_note',id,input.status,name,group,note),audit(env,user,'student-'+input.status,id,group)]);
      return json({ok:true},200,outgoing);
    }
    if(path === 'admin/reports' && request.method === 'GET') {
      const query=new URL(request.url).searchParams, kind=query.get('kind'), cursor=short(query.get('cursor') || '',100);
      let result;
      if(kind === 'students') result=await statement(env,"SELECT a.id,a.email,a.created_at,COALESCE(c.status,'active') AS status,COALESCE(c.student_name,'') AS student_name,COALESCE(c.class_label,'') AS class_label,COALESCE(c.last_seen,0) AS last_seen,MAX(COALESCE(m.pro_until,0),COALESCE((SELECT MAX(p.expires_at) FROM play_purchases p WHERE p.user_id=a.id),0)) AS pro_until FROM accounts a LEFT JOIN account_controls c ON c.user_id=a.id LEFT JOIN memberships m ON m.user_id=a.id WHERE a.id NOT LIKE 'deleted:%' AND a.id>? AND lower(a.email)<>lower(?) ORDER BY a.id LIMIT 501",cursor,env.OWNER_EMAIL || '').all();
      else if(kind === 'payments') result=await statement(env,'SELECT o.id,a.email,o.plan,o.plan_name,o.base_amount_paisa,o.discount_paisa,o.discount_label,o.coupon_code,o.amount_paisa,o.method,o.status,o.reference,o.created_at,o.paid_at FROM orders o JOIN accounts a ON a.id=o.user_id WHERE o.id>? ORDER BY o.id LIMIT 501',cursor).all();
      else fail(400,'Choose students or payments.');
      return json({rows:result.results.slice(0,500),nextCursor:result.results.length>500 ? result.results[499].id : null},200,outgoing);
    }
    if(path === 'admin/code-revoke' && request.method === 'POST') {
      const input=await body(request), id=short(input.id,50), stamp=now(), nonce=crypto.randomUUID();
      const result=await env.DB.batch([
        statement(env,'UPDATE access_codes SET expires_at=?,redemption_nonce=? WHERE id=? AND redeemed_by IS NULL AND expires_at>?',stamp,nonce,id,stamp),
        statement(env,"INSERT INTO audit(actor,action,target,note,created_at) SELECT ?,'revoke-code',id,'',? FROM access_codes WHERE redemption_nonce=? AND redeemed_by IS NULL",user.id,stamp,nonce),
      ]);
      if(!result[0].meta.changes) fail(409,'This code is used, expired, or unavailable.');
      return json({ok:true},200,outgoing);
    }
    if (path === 'admin/settings' && request.method === 'POST') {
      const current=await catalog(env),cfg=checkSettings(await body(request,32768),current.pricingValue===null ? undefined : current.tiers);
      await env.DB.batch([statement(env,"UPDATE settings SET value=? WHERE id='public'",JSON.stringify(cfg)),audit(env,user,'settings','public')]);
      return json({settings:cfg},200,outgoing);
    }
    if (path === 'admin/codes' && request.method === 'POST') {
      const input=await body(request), days=integer(input.days,1,3650), validity=integer(input.validityDays ?? 365,1,3650);
      const random=Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();
      const code='ASW-'+random.match(/.{1,8}/g).join('-'), id=crypto.randomUUID(), hash=await codeHash(env,code);
      await env.DB.batch([statement(env,'INSERT INTO access_codes(id,code_hash,days,expires_at,created_at) VALUES(?,?,?,?,?)',id,hash,days,now()+validity*DAY,now()),audit(env,user,'issue-code',id)]);
      return json({id,code,days,message:'Copy this code now. Only its hash is stored; it cannot be displayed again.'},201,outgoing);
    }
    if (path === 'admin/membership' && request.method === 'POST') {
      const input=await body(request), email=short(input.email,254).toLowerCase(), account=await statement(env,'SELECT id FROM accounts WHERE email=?',email).first();
      if (!account) fail(404,'This person must sign in to the website first.');
      if (!['grant','revoke'].includes(input.action)) fail(400,'Choose grant or revoke.');
      const change=input.action === 'grant' ? extend(env,account.id,integer(input.days,1,3650)) : statement(env,'UPDATE memberships SET pro_until=0 WHERE user_id=?',account.id);
      await env.DB.batch([change,audit(env,user,input.action+'-pro',account.id,short(input.note || ''))]);
      return json({ok:true},200,outgoing);
    }
    if (path === 'admin/payment' && request.method === 'POST') {
      const input=await body(request), id=short(input.id,50), order=await statement(env,"SELECT * FROM orders WHERE id=? AND status='reported'",id).first();
      if (!order) fail(409,'This payment has already been reviewed or has not been reported.');
      const note=short(input.note || ''), nonce=crypto.randomUUID(), stamp=now();
      if (input.action === 'reject') {
        const reviewed=await env.DB.batch([
          statement(env,"UPDATE orders SET status='rejected',fulfillment_nonce=? WHERE id=? AND status='reported'",nonce,id),
          statement(env,"UPDATE coupon_redemptions SET state='released' WHERE order_id=? AND EXISTS(SELECT 1 FROM orders WHERE id=? AND fulfillment_nonce=?)",id,id,nonce),
          statement(env,"INSERT INTO audit(actor,action,target,note,created_at) SELECT ?,'reject-payment',id,?,? FROM orders WHERE fulfillment_nonce=?",user.id,note,stamp,nonce),
        ]);
        if (!reviewed[0].meta.changes) fail(409,'This payment was already reviewed.');
      } else if (input.action === 'approve') {
        if (integer(input.receivedPaisa,1,100000000) !== order.amount_paisa) fail(400,'The received amount must match the order. Verify it in your payment account.');
        const batch=await env.DB.batch([
          statement(env,"UPDATE orders SET status='paid',paid_at=?,fulfillment_nonce=? WHERE id=? AND status='reported'",stamp,nonce,id),
          statement(env,"UPDATE coupon_redemptions SET state='used' WHERE order_id=? AND EXISTS(SELECT 1 FROM orders WHERE id=? AND fulfillment_nonce=?)",id,id,nonce),
          statement(env,"INSERT INTO memberships(user_id,pro_until) SELECT user_id,?+days*? FROM orders WHERE fulfillment_nonce=? ON CONFLICT(user_id) DO UPDATE SET pro_until=MAX(memberships.pro_until,?)+(SELECT days*? FROM orders WHERE fulfillment_nonce=?)",stamp,DAY,nonce,stamp,DAY,nonce),
          statement(env,"INSERT INTO audit(actor,action,target,note,created_at) SELECT ?,'approve-payment',id,?,? FROM orders WHERE fulfillment_nonce=?",user.id,note,stamp,nonce),
        ]);
        if (!batch[0].meta.changes) fail(409,'This payment was already reviewed.');
      } else fail(400,'Choose approve or reject.');
      return json({ok:true},200,outgoing);
    }
    fail(404,'Not found.');
  } catch (error) {
    if (error instanceof HTTPError || error instanceof PricingError || error instanceof StudentAuthError || error instanceof PlayError) return json({error:error.message},error.status,outgoing);
    if (/UNIQUE constraint failed: orders\.method, orders\.reference/.test(error.message || '')) return json({error:'This transaction reference has already been used for a confirmed payment.'},409,outgoing);
    // Do not expose database rows, gateway credentials, or auth-provider errors.
    return json({error:'This request could not be completed. Please try again.'},503,outgoing);
  }
}
