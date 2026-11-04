// Owner-only login independent of student sign-in and paid identity services.
// Provisioning generates a 256-bit random password. Only its salted verifier is deployed.
export const OWNER_COOKIE = '__Host-asawera_owner';
const HOURS = 8 * 3600;
const encode = bytes => btoa(String.fromCharCode(...bytes)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
const decode = value => Uint8Array.from(atob(value.replace(/-/g,'+').replace(/_/g,'/')), char=>char.charCodeAt(0));
const digest = async value => encode(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))));
function verifier(env) {
  if (!env.OWNER_EMAIL || typeof env.OWNER_PASSWORD_HASH !== 'string') return null;
  const parts = env.OWNER_PASSWORD_HASH.split('.');
  if(parts.length!==4 || parts[0]!=='pbkdf2-sha256' || parts[1]!=='100000'
    || !/^[A-Za-z0-9_-]{43}$/.test(parts[2]) || !/^[A-Za-z0-9_-]{43}$/.test(parts[3])) return null;
  return parts;
}
export const ownerPasswordReady = env => Boolean(env.DB && verifier(env));
function savedToken(request) {
  const raw=(request.headers.get('Cookie') || '').split(';').map(part=>part.trim()).find(part=>part.startsWith(OWNER_COOKIE+'='));
  const token=raw?.slice(OWNER_COOKIE.length+1);
  return token && /^[A-Za-z0-9_-]{43}$/.test(token) ? token : null;
}
const query = (env,sql,...values) => env.DB.prepare(sql).bind(...values);
const tag = env => digest(env.OWNER_EMAIL.toLowerCase()+'\n'+env.OWNER_PASSWORD_HASH);
export function ownerCookie(token='',age=0) {
  return `${OWNER_COOKIE}=${token}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=${age}`;
}
export async function verifyOwnerPassword(env,email,password) {
  const config=verifier(env);
  if(!config || typeof email!=='string' || typeof password!=='string' || password.length>128 || !password.length) return false;
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
  const actual=new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:decode(config[2]),iterations:100000},key,256));
  const expected=decode(config[3]);let difference=0;
  for(let index=0;index<32;index++) difference|=actual[index]^expected[index];
  return difference===0 && email.trim().toLowerCase()===env.OWNER_EMAIL.toLowerCase();
}
export async function startOwnerSession(env) {
  const token=encode(crypto.getRandomValues(new Uint8Array(32))), stamp=Date.now();
  await query(env,'DELETE FROM owner_sessions WHERE expires_at<=?',stamp).run();
  await query(env,'INSERT INTO owner_sessions(token_hash,credential_tag,email,expires_at,created_at) VALUES(?,?,?,?,?)',
    await digest(token),await tag(env),env.OWNER_EMAIL.toLowerCase(),stamp+HOURS*1000,stamp).run();
  return ownerCookie(token,HOURS);
}
export async function passwordOwner(request,env) {
  if(!ownerPasswordReady(env)) return null;
  const token=savedToken(request);if(!token) return null;
  const row=await query(env,'SELECT email FROM owner_sessions WHERE token_hash=? AND credential_tag=? AND expires_at>?',await digest(token),await tag(env),Date.now()).first();
  if(!row || row.email!==env.OWNER_EMAIL.toLowerCase()) return null;
  return {id:'website-owner:'+row.email,email:row.email,owner:true};
}
export async function endOwnerSession(request,env) {
  const token=savedToken(request);
  if(env.DB && token) await query(env,'DELETE FROM owner_sessions WHERE token_hash=?',await digest(token)).run();
}
