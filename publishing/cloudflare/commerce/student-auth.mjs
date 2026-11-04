// Student usernames are not verified email addresses. Local identities never grant owner access.
// Native WebCrypto is used at Workers' supported PBKDF2 work factor, followed by a
// domain-separated server-secret HMAC. Neither plain passwords nor recovery codes are stored.
export const STUDENT_COOKIE='__Host-asawera_student';
const AGE=30*86400, VERSION='pbkdf2-sha256-100000-hmac-v1';
const bytes=value=>new TextEncoder().encode(value);
const encode=value=>btoa(String.fromCharCode(...value)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
const decode=value=>Uint8Array.from(atob(value.replace(/-/g,'+').replace(/_/g,'/')),char=>char.charCodeAt(0));
const random=size=>encode(crypto.getRandomValues(new Uint8Array(size)));
const digest=async value=>encode(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes(value))));
const sql=(env,text,...values)=>env.DB.prepare(text).bind(...values);
export class StudentAuthError extends Error {constructor(status,message){super(message);this.status=status;}}
const fail=(status,message)=>{throw new StudentAuthError(status,message);};
export const studentAuthReady=env=>Boolean(env.DB && env.CODE_PEPPER && env.STUDENT_AUTH_MODE==='username');
export function studentCookie(token='',age=0){return `${STUDENT_COOKIE}=${token}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=${age}`;}
function savedToken(request){
  const raw=(request.headers.get('Cookie') || '').split(';').map(value=>value.trim()).find(value=>value.startsWith(STUDENT_COOKIE+'='));
  const token=raw?.slice(STUDENT_COOKIE.length+1);
  return /^[A-Za-z0-9_-]{43}$/.test(token || '') ? token : null;
}
async function mac(env,domain,value){
  const key=await crypto.subtle.importKey('raw',bytes(env.CODE_PEPPER),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const payload=new Uint8Array(bytes('student:'+domain+'\0').length+value.length);
  payload.set(bytes('student:'+domain+'\0'));payload.set(value,bytes('student:'+domain+'\0').length);
  return encode(new Uint8Array(await crypto.subtle.sign('HMAC',key,payload)));
}
async function passwordHash(env,password,salt){
  const key=await crypto.subtle.importKey('raw',bytes(password),'PBKDF2',false,['deriveBits']);
  const result=new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:decode(salt),iterations:100000},key,256));
  return mac(env,'password',result);
}
const tag=row=>digest(row.password_hash+':'+row.recovery_hash);
function username(input){
  if(typeof input!=='string')fail(400,'Enter a username.');
  const value=input.trim().toLowerCase();
  if(!/^[a-z][a-z0-9_-]{2,31}$/.test(value))fail(400,'Use 3–32 letters, numbers, underscores or hyphens. Start with a letter.');
  return value;
}
function password(input,newPassword=false){
  if(typeof input!=='string' || input.length>(128) || input.length<(newPassword ? 15 : 1))fail(400,newPassword ? 'Use a password with at least 15 characters.' : 'Enter your password.');
  return input;
}
function constantEqual(actual,expected){
  if(!/^[A-Za-z0-9_-]{43}$/.test(expected || ''))return false;
  const a=decode(actual),b=decode(expected);let difference=0;
  for(let index=0;index<32;index++)difference|=a[index]^b[index];
  return difference===0;
}
const recoveryHash=(env,code)=>mac(env,'recovery',bytes(code));
// Every erasure statement checks the same credential version inside D1's atomic batch.
export async function deleteStudentAccount(env,user,input){
  if(!user && studentAuthReady(env)){
    const name=username(input.username);
    const identity=await sql(env,'SELECT user_id FROM student_credentials WHERE username=?',name).first();
    user={id:identity?.user_id || '',username:name,owner:false};
  }
  if(!studentAuthReady(env) || user.owner || !user.username)fail(403,'Only a student can delete their own student account.');
  if(input.confirmation!==user.username || input.confirmSubscription!==true)fail(400,'Confirm your username and review subscription cancellation before deleting.');
  const row=await sql(env,'SELECT * FROM student_credentials WHERE user_id=?',user.id).first();
  const actual=await passwordHash(env,password(input.currentPassword),row?.password_salt || 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  if(!row || row.hash_version!==VERSION || !constantEqual(actual,row.password_hash))fail(401,'Your current password is incorrect.');
  const removed='deleted:'+crypto.randomUUID();
  const guard='EXISTS(SELECT 1 FROM student_credentials WHERE user_id=? AND password_hash=? AND recovery_hash=?)';
  const guarded=(text,...values)=>sql(env,text,...values,user.id,row.password_hash,row.recovery_hash);
  const result=await env.DB.batch([
    guarded(`INSERT INTO accounts(id,email,created_at) SELECT ?,'Deleted account',? WHERE ${guard}`,removed,Date.now()),
    guarded(`DELETE FROM audit WHERE (actor=? OR target=? OR target IN (SELECT id FROM orders WHERE user_id=?)) AND ${guard}`,user.id,user.id,user.id),
    guarded(`DELETE FROM coupon_redemptions WHERE user_id=? AND order_id IN (SELECT id FROM orders WHERE user_id=? AND status<>'paid') AND ${guard}`,user.id,user.id),
    guarded(`DELETE FROM orders WHERE user_id=? AND status<>'paid' AND ${guard}`,user.id),
    guarded(`UPDATE coupon_redemptions SET user_id=? WHERE user_id=? AND ${guard}`,removed,user.id),
    guarded(`UPDATE orders SET user_id=? WHERE user_id=? AND ${guard}`,removed,user.id),
    guarded(`UPDATE access_codes SET redeemed_by=? WHERE redeemed_by=? AND ${guard}`,removed,user.id),
    guarded(`UPDATE play_purchases SET user_id=? WHERE user_id=? AND ${guard}`,removed,user.id),
    guarded(`DELETE FROM memberships WHERE user_id=? AND ${guard}`,user.id),
    guarded(`DELETE FROM account_controls WHERE user_id=? AND ${guard}`,user.id),
    guarded(`DELETE FROM student_sessions WHERE user_id=? AND ${guard}`,user.id),
    sql(env,'DELETE FROM student_credentials WHERE user_id=? AND password_hash=? AND recovery_hash=?',user.id,row.password_hash,row.recovery_hash),
    sql(env,'DELETE FROM accounts WHERE id=? AND NOT EXISTS(SELECT 1 FROM student_credentials WHERE user_id=?)',user.id,user.id),
    sql(env,'DELETE FROM accounts WHERE id=? AND NOT EXISTS(SELECT 1 FROM orders WHERE user_id=?) AND NOT EXISTS(SELECT 1 FROM access_codes WHERE redeemed_by=?) AND NOT EXISTS(SELECT 1 FROM play_purchases WHERE user_id=?) AND NOT EXISTS(SELECT 1 FROM coupon_redemptions WHERE user_id=?)',removed,removed,removed,removed,removed),
  ]);
  if(!result[11].meta.changes)fail(409,'Account details changed. Sign in again before deleting.');
  return {ok:true,message:'Your account, sign-in details, sessions, Pro access and school records have been deleted. Paid transaction records remain without your username or school profile. Cancel Google Play subscriptions separately in Google Play.'};
}
async function sessionValues(env,userId,credentialTag){
  const token=random(32),stamp=Date.now();
  return {token,query:sql(env,'INSERT INTO student_sessions(token_hash,user_id,credential_tag,expires_at,created_at) VALUES(?,?,?,?,?)',await digest(token),userId,credentialTag,stamp+AGE*1000,stamp)};
}
export async function endStudentSession(request,env){
  const token=savedToken(request);
  if(studentAuthReady(env) && token)await sql(env,'DELETE FROM student_sessions WHERE token_hash=?',await digest(token)).run();
}
export async function studentViewer(request,env){
  if(!studentAuthReady(env))return null;
  const token=savedToken(request);if(!token)return null;
  const row=await sql(env,'SELECT c.user_id,c.username,c.password_hash,c.recovery_hash,s.credential_tag,COALESCE(a.status,\'active\') AS status FROM student_sessions s JOIN student_credentials c ON c.user_id=s.user_id LEFT JOIN account_controls a ON a.user_id=c.user_id WHERE s.token_hash=? AND s.expires_at>?',await digest(token),Date.now()).first();
  if(!row || row.credential_tag!==await tag(row))return {user:null,cookies:[studentCookie()]};
  return {user:{id:row.user_id,email:row.username,username:row.username,owner:false,suspended:row.status==='suspended'},cookies:[]};
}
export async function studentAuthAction(env,path,input){
  if(!studentAuthReady(env))fail(503,'Student sign-in is unavailable.');
  const name=username(input.username ?? input.email);
  if(path==='signup'){
    const reserved=new Set(['owner','admin','administrator','root','support','sudaisaccnt3',(env.OWNER_EMAIL || '').split('@')[0].toLowerCase()]);
    if(reserved.has(name))fail(400,'Choose a student username. Owner sign-in is separate.');
    const pass=password(input.password,true),id='student:'+crypto.randomUUID(),salt=random(32),code='ASR-'+random(24),stamp=Date.now();
    const row={password_hash:await passwordHash(env,pass,salt),recovery_hash:await recoveryHash(env,code)};
    const session=await sessionValues(env,id,await tag(row));
    try {
      await env.DB.batch([
        sql(env,'INSERT INTO accounts(id,email,created_at) VALUES(?,?,?)',id,name,stamp),
        sql(env,'INSERT INTO student_credentials(user_id,username,password_salt,password_hash,hash_version,recovery_hash,updated_at) VALUES(?,?,?,?,?,?,?)',id,name,salt,row.password_hash,VERSION,row.recovery_hash,stamp),
        sql(env,'INSERT INTO account_controls(user_id,last_seen) VALUES(?,?)',id,stamp),session.query,
      ]);
    } catch(error){if(/UNIQUE constraint failed: student_credentials.username/.test(error.message || ''))fail(409,'That username is unavailable. Choose another.');throw error;}
    return {body:{ok:true,username:name,recoveryCode:code,message:'Save your recovery code. It lets you reset your password without email.'},cookie:studentCookie(session.token,AGE)};
  }
  const row=await sql(env,'SELECT c.*,COALESCE(a.status,\'active\') AS status FROM student_credentials c LEFT JOIN account_controls a ON a.user_id=c.user_id WHERE c.username=?',name).first();
  if(path==='login'){
    const pass=password(input.password),salt=row?.password_salt || 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    const actual=await passwordHash(env,pass,salt);
    if(!row || row.hash_version!==VERSION || !constantEqual(actual,row.password_hash))fail(401,'Username or password is incorrect.');
    if(row.status==='suspended')fail(403,'Your account is suspended. Contact the website owner.');
    const session=await sessionValues(env,row.user_id,await tag(row));
    await env.DB.batch([
      session.query,
      sql(env,'DELETE FROM student_sessions WHERE user_id=? AND token_hash NOT IN (SELECT token_hash FROM student_sessions WHERE user_id=? ORDER BY created_at DESC,token_hash DESC LIMIT 5)',row.user_id,row.user_id),
    ]);
    return {body:{ok:true},cookie:studentCookie(session.token,AGE)};
  }
  if(['student-recover','student-change-password'].includes(path)){
    if(path==='student-recover'){
      const code=typeof input.recoveryCode==='string' ? input.recoveryCode.trim() : '';
      if(!/^ASR-[A-Za-z0-9_-]{32}$/.test(code))fail(401,'Username or recovery code is incorrect.');
      const expected=await recoveryHash(env,code);
      if(!row || !constantEqual(expected,row.recovery_hash))fail(401,'Username or recovery code is incorrect.');
    } else {
      const actual=await passwordHash(env,password(input.currentPassword),row?.password_salt || 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      if(!row || row.hash_version!==VERSION || !constantEqual(actual,row.password_hash))fail(401,'Your current password is incorrect.');
    }
    const expected=row.recovery_hash;
    if(row.status==='suspended')fail(403,'Your account is suspended. Contact the website owner.');
    const pass=password(input.password,true),salt=random(32),replacement='ASR-'+random(24),stamp=Date.now();
    const next={password_hash:await passwordHash(env,pass,salt),recovery_hash:await recoveryHash(env,replacement)};
    const credentialTag=await tag(next),token=random(32),tokenHash=await digest(token);
    const result=await env.DB.batch([
      sql(env,'UPDATE student_credentials SET password_salt=?,password_hash=?,hash_version=?,recovery_hash=?,updated_at=? WHERE user_id=? AND recovery_hash=?',salt,next.password_hash,VERSION,next.recovery_hash,stamp,row.user_id,expected),
      sql(env,'DELETE FROM student_sessions WHERE user_id=? AND EXISTS(SELECT 1 FROM student_credentials WHERE user_id=? AND recovery_hash=?)',row.user_id,row.user_id,next.recovery_hash),
      sql(env,'INSERT INTO student_sessions(token_hash,user_id,credential_tag,expires_at,created_at) SELECT ?,user_id,?,?,? FROM student_credentials WHERE user_id=? AND recovery_hash=?',tokenHash,credentialTag,stamp+AGE*1000,stamp,row.user_id,next.recovery_hash),
    ]);
    if(!result[0].meta.changes)fail(409,'This recovery code was already used.');
    return {body:{ok:true,username:name,recoveryCode:replacement,message:'Password reset. Save the replacement recovery code; the previous code and old sessions no longer work.'},cookie:studentCookie(token,AGE)};
  }
  fail(404,'Not found.');
}
