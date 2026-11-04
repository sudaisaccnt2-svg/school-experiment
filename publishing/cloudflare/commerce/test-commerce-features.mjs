import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fixture} from './test-student-auth.mjs';
import {playAccountId} from './play-billing.mjs';
import {handle} from './api.mjs';
const password='Four unusual words for school 731!';
const cookieOf=result=>result.headers.getSetCookie().findLast(v=>v.startsWith('__Host-asawera_student=') && !v.startsWith('__Host-asawera_student=;'))?.split(';')[0] || '';
const confirmation={currentPassword:password,confirmation:'learner01',confirmSubscription:true};
async function learner(){const f=await fixture();const created=await f.signup('learner01');f.cookie=cookieOf(created);f.id=(await f.request('session',f.cookie)).body.user.id;return f;}
test('deletion requires the current password, explicit confirmation and the same origin; owner cannot erase a student',async()=>{
  const f=await learner();
  for(const input of [{...confirmation,currentPassword:'wrong'},{...confirmation,confirmation:'other01'},{...confirmation,confirmSubscription:false}])assert.ok((await f.request('student-delete-account',f.cookie,input)).status>=400);
  assert.equal((await f.request('student-delete-account',f.cookie,confirmation,'https://evil.example')).status,403);
  assert.equal((await f.call('student-delete-account','owner',{...confirmation,username:'learner01'})).status,403);
  assert.equal(f.database.prepare('SELECT COUNT(*) AS n FROM student_credentials').get().n,1);
});
test('deletion revokes all sessions, password and recovery while preserving another student and the owner',async()=>{
  const f=await learner(),second=await f.request('login','',{username:'learner01',password});
  await f.signup('learner02');assert.equal((await f.request('student-delete-account',f.cookie,confirmation)).status,200);
  for(const cookie of [f.cookie,cookieOf(second)])assert.equal((await f.request('session',cookie)).body.user,null);
  assert.equal((await f.request('login','',{username:'learner01',password})).status,401);
  assert.equal(f.database.prepare('SELECT COUNT(*) AS n FROM accounts WHERE id=?').get(f.id).n,0);
  assert.equal(f.database.prepare('SELECT COUNT(*) AS n FROM accounts WHERE id LIKE ?').get('deleted:%').n,0);
  assert.equal((await f.request('login','',{username:'learner02',password})).status,200);
  assert.equal((await f.call('admin/overview','owner')).status,200);
});
test('suspended students can erase their own profile without obtaining a sign-in session',async()=>{
  const f=await learner();f.database.prepare("UPDATE account_controls SET status='suspended' WHERE user_id=?").run(f.id);
  assert.equal((await f.request('login','',{username:'learner01',password})).status,403);
  assert.equal((await f.request('student-delete-account','',{...confirmation,username:'learner01',id:'owner-id'})).status,200);
  assert.equal(f.database.prepare('SELECT COUNT(*) AS n FROM student_credentials WHERE user_id=?').get(f.id).n,0);
});
test('deletion removes school/private/unpaid data but preserves anonymised paid references and used-code protection',async()=>{
  const f=await learner(),stamp=Date.now();
  f.database.prepare('UPDATE account_controls SET student_name=?,class_label=?,private_note=? WHERE user_id=?').run('Private student name','Secret class','Private school note',f.id);
  f.database.prepare('INSERT INTO memberships(user_id,pro_until) VALUES(?,?)').run(f.id,stamp+86400000);
  for(const [id,status] of [['paid-one','paid'],['pending-one','pending']])f.database.prepare('INSERT INTO orders(id,user_id,plan,amount_paisa,days,method,status,reference,created_at) VALUES(?,?,?,?,?,?,?,?,?)').run(id,f.id,'monthly',150000,30,'raast',status,id==='paid-one'?'BANK-REF-ONE':null,stamp);
  f.database.prepare('INSERT INTO access_codes(id,code_hash,days,expires_at,redeemed_by,redeemed_at,created_at) VALUES(?,?,?,?,?,?,?)').run('used-code','used-hash',30,stamp+86400000,f.id,stamp,stamp);
  f.database.prepare('INSERT INTO audit(actor,action,target,note,created_at) VALUES(?,?,?,?,?)').run('owner-id','student',f.id,'learner01 Private school note',stamp);
  assert.equal((await f.request('student-delete-account',f.cookie,confirmation)).status,200);
  const order=f.database.prepare('SELECT * FROM orders WHERE id=?').get('paid-one');assert.equal(order.reference,'BANK-REF-ONE');assert.equal(order.amount_paisa,150000);assert.match(order.user_id,/^deleted:/);
  assert.equal(f.database.prepare('SELECT email FROM accounts WHERE id=?').get(order.user_id).email,'Deleted account');
  assert.equal(f.database.prepare('SELECT redeemed_by FROM access_codes WHERE id=?').get('used-code').redeemed_by,order.user_id);
  for(const table of ['student_credentials','student_sessions','account_controls','memberships'])assert.equal(f.database.prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE user_id=?`).get(f.id).n,0);
  assert.equal(f.database.prepare('SELECT COUNT(*) AS n FROM orders WHERE id=?').get('pending-one').n,0);
  const admin=(await f.call('admin/students','owner')).body;assert.ok(!JSON.stringify(admin).includes('Deleted account'));
  assert.equal((await f.call('admin/overview','owner')).body.metrics.students,0);
  assert.equal(f.database.prepare('SELECT COUNT(*) AS n FROM audit WHERE note LIKE ?').get('%learner01%').n,0);
});
test('a concurrent password/recovery change aborts the complete erasure without losing membership',async()=>{
  const f=await learner();f.database.prepare('INSERT INTO memberships(user_id,pro_until) VALUES(?,?)').run(f.id,Date.now()+86400000);
  const original=f.env.DB.batch.bind(f.env.DB);f.env.DB.batch=async statements=>{if(statements.length===14)f.database.prepare('UPDATE student_credentials SET recovery_hash=? WHERE user_id=?').run('changed-recovery-version',f.id);return original(statements);};
  assert.equal((await f.request('student-delete-account',f.cookie,confirmation)).status,409);
  assert.equal(f.database.prepare('SELECT COUNT(*) AS n FROM accounts WHERE id=?').get(f.id).n,1);
  assert.equal(f.database.prepare('SELECT COUNT(*) AS n FROM memberships WHERE user_id=?').get(f.id).n,1);
});
test('database errors roll back all deletion statements',async()=>{
  const f=await learner(),original=f.env.DB.prepare.bind(f.env.DB);
  f.env.DB.prepare=text=>{const query=original(text);if(text.startsWith('DELETE FROM account_controls'))query.run=async()=>{throw new Error('Fixture failure');};return query;};
  assert.equal((await f.request('student-delete-account',f.cookie,confirmation)).status,503);
  assert.equal(f.database.prepare('SELECT COUNT(*) AS n FROM student_credentials WHERE user_id=?').get(f.id).n,1);
  assert.equal(f.database.prepare('SELECT COUNT(*) AS n FROM account_controls WHERE user_id=?').get(f.id).n,1);
});
const keyPromise=crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify']);
const b64=value=>Buffer.from(value).toString('base64url');
async function playFixture(){
  const f=await learner(),keys=await keyPromise,pem=Buffer.from(await crypto.subtle.exportKey('pkcs8',keys.privateKey)).toString('base64');
  f.env.PLAY_SERVICE_ACCOUNT=JSON.stringify({client_email:'fixture-'+crypto.randomUUID()+'@fixture.iam.gserviceaccount.com',private_key:'-----BEGIN PRIVATE KEY-----\n'+pem+'\n-----END PRIVATE KEY-----'});
  f.env.PLAY_BILLING_ENABLED='true';f.env.PLAY_RTDN_AUDIENCE='https://site.example/api/play/notifications';f.env.PLAY_RTDN_SERVICE_EMAIL='push@fixture.iam.gserviceaccount.com';
  f.token='fixture-purchase-token-'+crypto.randomUUID();f.calls=[];f.receipt={externalAccountIdentifiers:{obfuscatedExternalAccountId:await playAccountId(f.env,f.id)},lineItems:[{productId:'asawera_pro_monthly',expiryTime:new Date(Date.now()+30*86400000).toISOString()}],subscriptionState:'SUBSCRIPTION_STATE_ACTIVE',acknowledgementState:'ACKNOWLEDGEMENT_STATE_PENDING'};
  f.env.PLAY_FETCH=async(url,options={})=>{f.calls.push(String(url));if(f.unavailable && String(url).includes('androidpublisher'))return new Response('{}',{status:503});
    if(String(url).includes('oauth2.googleapis.com/token'))return Response.json({access_token:'fixture-token',expires_in:3600});
    if(String(url).includes('oauth2/v3/certs'))return Response.json({keys:[{...await crypto.subtle.exportKey('jwk',keys.publicKey),kid:'fixture-key',alg:'RS256'}]});
    assert.ok(String(url).startsWith('https://androidpublisher.googleapis.com/androidpublisher/v3/applications/com.asawera.chemistry/'));
    assert.equal(options.headers.Authorization,'Bearer fixture-token');
    if(options.method==='POST'){f.receipt.acknowledgementState='ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED';return new Response('',{status:200});}
    return Response.json(f.receipt);
  };
  f.push=async(overrides={})=>{const stamp=Math.floor(Date.now()/1000),head=b64(JSON.stringify({alg:'RS256',kid:'fixture-key'})),body=b64(JSON.stringify({iss:'https://accounts.google.com',aud:f.env.PLAY_RTDN_AUDIENCE,email:f.env.PLAY_RTDN_SERVICE_EMAIL,email_verified:true,iat:stamp,exp:stamp+3600,...overrides}));const signature=b64(await crypto.subtle.sign('RSASSA-PKCS1-v1_5',keys.privateKey,new TextEncoder().encode(head+'.'+body)));const request=new Request('https://site.example/api/play/notifications',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+head+'.'+body+'.'+signature},body:JSON.stringify({message:{data:b64(JSON.stringify({packageName:'com.asawera.chemistry',subscriptionNotification:{purchaseToken:f.token,notificationType:12}}))}})});return handle(request,f.env);};
  return f;
}
test('Play checkout stays closed without a real enabled server connection; no client Pro flag is honoured',async()=>{
  const f=await learner();assert.equal((await f.request('play/config',f.cookie)).body.ready,false);
  assert.equal((await f.request('play/verify',f.cookie,{purchaseToken:'invented-token',pro:true,expiresAt:9999999999999})).status,503);
  assert.equal((await f.request('session',f.cookie)).body.membership.pro,false);
});
test('Google verifies the bound account, product and expiry, acknowledges once and never extends on retry',async()=>{
  const f=await playFixture();assert.equal((await f.request('play/config',f.cookie)).body.ready,true);
  const result=await f.request('play/verify',f.cookie,{purchaseToken:f.token,days:99999,price:1});assert.equal(result.status,200);assert.equal(result.body.membership.pro,true);
  const expiry=result.body.membership.proUntil;assert.equal((await f.request('play/verify',f.cookie,{purchaseToken:f.token})).body.membership.proUntil,expiry);
  assert.equal(f.calls.filter(url=>url.endsWith(':acknowledge')).length,1);
  const row=f.database.prepare('SELECT * FROM play_purchases').get();assert.ok(!row.token_cipher.includes(f.token));assert.notEqual(row.token_hash,f.token);
});
test('a token from another account or an unrelated Google product never grants Pro',async()=>{
  const f=await playFixture();f.receipt.externalAccountIdentifiers.obfuscatedExternalAccountId='another-account';assert.equal((await f.request('play/verify',f.cookie,{purchaseToken:f.token})).status,403);
  f.receipt.externalAccountIdentifiers.obfuscatedExternalAccountId=await playAccountId(f.env,f.id);f.receipt.lineItems[0].productId='unrelated_product';assert.equal((await f.request('play/verify',f.cookie,{purchaseToken:f.token})).status,400);
  assert.equal(f.database.prepare('SELECT COUNT(*) AS n FROM play_purchases').get().n,0);
});
test('pending, on-hold, paused and expired purchases do not grant Pro; cancelled subscriptions retain only their paid term',async()=>{
  const f=await playFixture();for(const state of ['SUBSCRIPTION_STATE_PENDING','SUBSCRIPTION_STATE_ON_HOLD','SUBSCRIPTION_STATE_PAUSED','SUBSCRIPTION_STATE_EXPIRED']){f.receipt.subscriptionState=state;const result=await f.request('play/verify',f.cookie,{purchaseToken:f.token});assert.equal(result.status,200);assert.equal(result.body.membership.pro,false);}
  f.receipt.subscriptionState='SUBSCRIPTION_STATE_CANCELED';assert.equal((await f.request('play/verify',f.cookie,{purchaseToken:f.token})).body.membership.pro,true);
  f.receipt.lineItems[0].expiryTime=new Date(Date.now()-1000).toISOString();assert.equal((await f.request('play/verify',f.cookie,{purchaseToken:f.token})).body.membership.pro,false);
});
test('Google outages never grant Pro and stale verification fails closed rather than allowing an ad request',async()=>{
  const f=await playFixture();await f.request('play/verify',f.cookie,{purchaseToken:f.token});f.database.prepare('UPDATE play_purchases SET verified_at=0').run();f.unavailable=true;
  assert.equal((await f.request('session',f.cookie)).status,503);
  assert.equal((await f.request('play/verify',f.cookie,{purchaseToken:f.token})).status,503);
});
test('token association cannot move to another student or be reused after account deletion',async()=>{
  const f=await playFixture();await f.request('play/verify',f.cookie,{purchaseToken:f.token});const other=cookieOf(await f.signup('learner02'));
  assert.equal((await f.request('play/verify',other,{purchaseToken:f.token})).status,409);
  await f.request('student-delete-account',f.cookie,confirmation);assert.equal((await f.call('admin/overview','owner')).body.metrics.pro,0);const replacement=cookieOf(await f.signup('learner01'));
  assert.equal((await f.request('play/verify',replacement,{purchaseToken:f.token})).status,409);
});
test('unauthenticated or wrongly signed refund pushes are rejected; verified Google state revokes only Play entitlement',async()=>{
  const f=await playFixture();await f.request('play/verify',f.cookie,{purchaseToken:f.token});
  assert.equal((await f.push({aud:'https://evil.example'})).status,401);assert.equal((await f.push({email:'attacker@fixture.iam.gserviceaccount.com'})).status,401);assert.equal((await f.push({exp:1})).status,401);
  f.receipt.subscriptionState='SUBSCRIPTION_STATE_EXPIRED';assert.equal((await f.push()).status,200);assert.equal((await f.request('session',f.cookie)).body.membership.pro,false);
  f.database.prepare('INSERT INTO memberships(user_id,pro_until) VALUES(?,?)').run(f.id,Date.now()+86400000);assert.equal((await f.push()).status,200);assert.equal((await f.request('session',f.cookie)).body.membership.pro,true);
});
test('purchase verification requires origin, a student session and server configuration',async()=>{
  const f=await playFixture();assert.equal((await f.request('play/verify',f.cookie,{purchaseToken:f.token},'https://evil.example')).status,403);
  assert.equal((await f.request('play/verify','',{purchaseToken:f.token})).status,401);
  assert.equal((await f.call('play/verify','owner',{purchaseToken:f.token})).status,400);
  assert.equal(f.database.prepare('SELECT COUNT(*) AS n FROM play_purchases').get().n,0);
});
