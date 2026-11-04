import {test} from 'node:test';
import assert from 'node:assert/strict';
import {setup} from './test-api.mjs';
import {handle} from './api.mjs';
import {STUDENT_COOKIE} from './student-auth.mjs';
const password='Four unusual words for school 731!';
const replacement='A new private school phrase 829!';
const cookieOf=result=>result.headers.getSetCookie().findLast(value=>value.startsWith(STUDENT_COOKIE+'=') && !value.startsWith(STUDENT_COOKIE+'=;'))?.split(';')[0] || '';
export async function fixture(open=true){
  const f=setup();f.env.STUDENT_AUTH_MODE='username';
  if(open)assert.equal((await f.call('admin/website','owner',{siteTitle:'Asawera test',contactEmail:'',announcement:'',registrationsOpen:true})).status,200);
  async function call(path,cookie='',input,origin='https://site.example',ip='192.0.2.3'){
    const request=new Request('https://site.example/api/'+path,{method:input===undefined ? 'GET':'POST',headers:{Cookie:cookie,'CF-Connecting-IP':ip,...(input===undefined ? {} : {'Content-Type':'application/json',Origin:origin})},...(input===undefined ? {} : {body:JSON.stringify(input)})});
    Object.defineProperty(request,'cf',{value:{country:'PK'}});
    const response=await handle(request,f.env);return {status:response.status,headers:response.headers,body:await response.json()};
  }
  const signup=name=>call('signup','',{email:name,password});
  return {...f,request:call,signup};
}
test('local registration stays closed until the owner opens it; no email provider is needed',async()=>{
  const f=await fixture(false);delete f.env.SUPABASE_URL;delete f.env.SUPABASE_PUBLISHABLE_KEY;
  assert.equal((await f.request('health')).body.accountsReady,true);
  assert.equal((await f.signup('learner01')).status,403);
  assert.equal(f.database.prepare('SELECT COUNT(*) AS n FROM student_credentials').get().n,0);
});
test('usernames reject owner identity and email impersonation; weak passwords are rejected server-side',async()=>{
  const f=await fixture();
  for(const name of ['owner','admin','owner@example.com','ab','123student','space name'])assert.equal((await f.request('signup','',{username:name,password},'https://site.example','192.0.2.'+(10+Math.floor(Math.random()*100)))).status,400);
  assert.equal((await f.request('signup','',{username:'learner01',password:'short'})).status,400);
  assert.equal(f.database.prepare('SELECT COUNT(*) AS n FROM student_credentials').get().n,0);
});
test('signup uses secret-protected password hashes and opaque secure sessions; it never grants owner or Pro',async()=>{
  const f=await fixture(),result=await f.request('signup','',{username:'Learner01',password,owner:true,pro:true,id:'owner-id'});
  assert.equal(result.status,200);assert.match(result.body.recoveryCode,/^ASR-[A-Za-z0-9_-]{32}$/);
  const cookie=cookieOf(result);assert.match(cookie,new RegExp('^'+STUDENT_COOKIE+'=[A-Za-z0-9_-]{43}$'));
  const header=result.headers.getSetCookie().at(-1);for(const value of ['Secure','HttpOnly','SameSite=Strict','Path=/'])assert.ok(header.includes(value));
  const row=f.database.prepare('SELECT * FROM student_credentials').get();assert.notEqual(row.password_hash,password);assert.notEqual(row.recovery_hash,result.body.recoveryCode);
  const stored=f.database.prepare('SELECT * FROM student_sessions').get();assert.notEqual(stored.token_hash,cookie.split('=')[1]);
  assert.equal(JSON.stringify(f.database.prepare('SELECT * FROM student_credentials').all()).includes(password),false);
  const state=await f.request('session',cookie);assert.equal(state.body.user.email,'learner01');assert.equal(state.body.membership.owner,false);assert.equal(state.body.membership.pro,false);
  assert.equal(state.headers.get('cache-control'),'private, no-store');assert.equal(JSON.stringify(state.body).includes(row.password_hash),false);
  assert.equal((await f.request('admin/overview',cookie)).status,403);
});
test('student login, logout, expiry and forged session cookies are checked by the server',async()=>{
  const f=await fixture(),created=await f.signup('learner01'),cookie=cookieOf(created);
  assert.equal((await f.request('login','',{username:'LEARNER01',password})).status,200);
  assert.equal((await f.request('login','',{username:'learner01',password:'wrong password'})).status,401);
  assert.equal((await f.request('logout',cookie,{})).status,200);
  assert.equal((await f.request('session',cookie)).body.user,null);
  const login=await f.request('login','',{username:'learner01',password}),next=cookieOf(login);
  f.database.prepare('UPDATE student_sessions SET expires_at=1').run();assert.equal((await f.request('session',next)).body.user,null);
  assert.equal((await f.request('session',STUDENT_COOKIE+'='+'A'.repeat(43))).body.user,null);
});
test('all state-changing local-auth routes require the website origin',async()=>{
  const f=await fixture();
  for(const path of ['signup','login','student-recover'])assert.equal((await f.request(path,'',{username:'learner01',password},'https://attacker.example')).status,403);
  assert.equal(f.database.prepare('SELECT COUNT(*) AS n FROM student_credentials').get().n,0);
});
test('duplicate concurrent registrations create one identity and no orphaned account',async()=>{
  const f=await fixture(),before=f.database.prepare('SELECT COUNT(*) AS n FROM accounts').get().n;
  const results=await Promise.all([f.signup('learner01'),f.signup('learner01')]);assert.deepEqual(results.map(r=>r.status).sort(),[200,409]);
  assert.equal(f.database.prepare('SELECT COUNT(*) AS n FROM accounts').get().n,before+1);
  assert.equal(f.database.prepare('SELECT COUNT(*) AS n FROM student_credentials').get().n,1);
});
test('password recovery invalidates old passwords, sessions and recovery codes while preserving Pro',async()=>{
  const f=await fixture(),created=await f.signup('learner01'),oldCookie=cookieOf(created);
  await f.call('admin/membership','owner',{email:'learner01',action:'grant',days:30});
  const reset=await f.request('student-recover','',{username:'learner01',recoveryCode:created.body.recoveryCode,password:replacement});assert.equal(reset.status,200);
  assert.notEqual(reset.body.recoveryCode,created.body.recoveryCode);assert.equal((await f.request('session',oldCookie)).body.user,null);
  assert.equal((await f.request('login','',{username:'learner01',password})).status,401);
  const state=await f.request('session',cookieOf(reset));assert.equal(state.body.membership.pro,true);assert.equal(state.body.membership.owner,false);
  assert.equal((await f.request('student-recover','',{username:'learner01',recoveryCode:created.body.recoveryCode,password})).status,401);
});
test('concurrent use of a recovery code succeeds once without revoking the winning session',async()=>{
  const f=await fixture(),created=await f.signup('learner01'),input={username:'learner01',recoveryCode:created.body.recoveryCode,password:replacement};
  const results=await Promise.all([f.request('student-recover','',input),f.request('student-recover','',input)]);
  assert.equal(results.filter(r=>r.status===200).length,1);assert.ok(results.some(r=>[401,409].includes(r.status)));
  const winner=results.find(r=>r.status===200);assert.equal((await f.request('session',cookieOf(winner))).body.user.email,'learner01');
});
test('password changes require the current password and cannot target another student',async()=>{
  const f=await fixture(),first=await f.signup('learner01'),second=await f.signup('learner02');
  assert.equal((await f.request('student-change-password',cookieOf(first),{currentPassword:'wrong',password:replacement})).status,401);
  const changed=await f.request('student-change-password',cookieOf(first),{username:'learner02',currentPassword:password,password:replacement});assert.equal(changed.status,200);assert.equal(changed.body.username,'learner01');
  assert.equal((await f.request('session',cookieOf(first))).body.user,null);assert.equal((await f.request('session',cookieOf(second))).body.user.email,'learner02');
  assert.equal((await f.request('login','',{username:'learner02',password})).status,200);
  assert.equal((await f.request('student-change-password','',{currentPassword:password,password:replacement})).status,401);
});
test('suspension blocks student sign-in, recovery, purchases and active Pro immediately',async()=>{
  const f=await fixture(),created=await f.signup('learner01'),cookie=cookieOf(created),id=(await f.request('session',cookie)).body.user.id;
  await f.call('admin/membership','owner',{email:'learner01',action:'grant',days:30});
  assert.equal((await f.call('admin/student','owner',{id,status:'suspended',name:'Test student',classLabel:'Test class',note:''})).status,200);
  assert.equal((await f.request('session',cookie)).body.membership.pro,false);assert.equal((await f.request('orders',cookie)).status,403);
  assert.equal((await f.request('login','',{username:'learner01',password})).status,403);
  assert.equal((await f.request('student-recover','',{username:'learner01',recoveryCode:created.body.recoveryCode,password:replacement})).status,403);
  await f.call('admin/student','owner',{id,status:'active'});assert.equal((await f.request('session',cookie)).body.membership.pro,true);
});
test('local students can redeem real server-issued Pro codes and use the existing verified payment workflow',async()=>{
  const f=await fixture(),created=await f.signup('learner01'),cookie=cookieOf(created);
  const code=await f.call('admin/codes','owner',{days:7});assert.equal((await f.request('redeem',cookie,{code:code.body.code})).status,200);
  assert.equal((await f.request('session',cookie)).body.membership.pro,true);
  const cfg=(await f.call('admin/overview','owner')).body.settings;
  await f.call('admin/settings','owner',{...cfg,monthlyPaisa:50000,manualPayments:true,paymentInstructions:'Fixture-only receiving instructions'});
  const order=await f.request('orders',cookie,{plan:'monthly',method:'raast'});assert.equal(order.status,201);
  await f.request('orders/report',cookie,{id:order.body.id,reference:'FIXTURE-PAYMENT-001'});
  assert.equal((await f.request('admin/payment',cookie,{id:order.body.id,action:'approve',receivedPaisa:50000})).status,403);
  assert.equal((await f.call('admin/payment','owner',{id:order.body.id,action:'approve',receivedPaisa:50000})).status,200);
});
test('brute-force attempts are limited and each student has at most five device sessions',async()=>{
  const f=await fixture();await f.signup('learner01');
  for(let index=0;index<7;index++)assert.equal((await f.request('login','',{username:'learner01',password})).status,200);
  assert.equal(f.database.prepare('SELECT COUNT(*) AS n FROM student_sessions').get().n,5);
  assert.equal((await f.request('login','',{username:'learner01',password:'incorrect'})).status,401);
  assert.equal((await f.request('login','',{username:'learner01',password})).status,429);
});
