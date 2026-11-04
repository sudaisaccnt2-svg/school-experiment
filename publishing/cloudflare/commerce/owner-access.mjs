// Verify Access signatures at the origin as well as at the edge. A supplied email/header alone grants nothing.
let cached = null;
export function accessReady(env) {
  return Boolean(env.OWNER_EMAIL && /^[a-z0-9-]+\.cloudflareaccess\.com$/.test(env.CF_ACCESS_TEAM_DOMAIN || '')
    && /^[a-f0-9]{64}$/.test(env.CF_ACCESS_AUD || ''));
}
const decode = value => Uint8Array.from(atob(value.replace(/-/g,'+').replace(/_/g,'/')), c => c.charCodeAt(0));
export async function accessOwner(request, env) {
  if (!accessReady(env)) return null;
  // Access forwards the assertion on protected paths. Its signed cookie also authenticates same-origin APIs.
  const saved=(request.headers.get('Cookie') || '').split(';').map(part=>part.trim()).find(part=>part.startsWith('CF_Authorization='));
  const token = request.headers.get('Cf-Access-Jwt-Assertion') || saved?.slice('CF_Authorization='.length);
  if (!token || token.length > 12000) return null;
  try {
    const parts = token.split('.'); if(parts.length !== 3) return null;
    const header = JSON.parse(new TextDecoder().decode(decode(parts[0])));
    const claim = JSON.parse(new TextDecoder().decode(decode(parts[1])));
    const issuer = 'https://' + env.CF_ACCESS_TEAM_DOMAIN, stamp = Math.floor(Date.now()/1000);
    if(header.alg !== 'RS256' || !header.kid || claim.iss !== issuer || !Array.isArray(claim.aud)
      || !claim.aud.includes(env.CF_ACCESS_AUD) || !Number.isFinite(claim.exp) || claim.exp <= stamp
      || (claim.nbf && claim.nbf > stamp) || !claim.sub || typeof claim.email !== 'string'
      || claim.email.toLowerCase() !== env.OWNER_EMAIL.toLowerCase()) return null;
    if(!cached || cached.issuer !== issuer || cached.until <= Date.now() || !cached.keys.some(key=>key.kid===header.kid)) {
      const response = await (env.ACCESS_FETCH || fetch)(issuer + '/cdn-cgi/access/certs', {signal:AbortSignal.timeout(10000)});
      if(!response.ok) return null;
      const jwks = await response.json(); if(!Array.isArray(jwks.keys)) return null;
      cached = {issuer, until:Date.now()+300000, keys:jwks.keys};
    }
    const jwk = cached.keys.find(key=>key.kid===header.kid && key.kty==='RSA'); if(!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', jwk, {name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'}, false, ['verify']);
    if(!await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, decode(parts[2]), new TextEncoder().encode(parts[0]+'.'+parts[1]))) return null;
    return {id:'access:'+claim.sub, email:claim.email.toLowerCase(), owner:true};
  } catch { return null; }
}
