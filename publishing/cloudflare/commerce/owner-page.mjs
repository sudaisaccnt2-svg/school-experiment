import {viewer} from './api.mjs';
import markup from './owner-markup.mjs';
export async function ownerPage(request,env) {
  const headers=new Headers({'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex, nofollow',
    'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"});
  if(!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed',{status:405,headers});
  try {
    if(!env.DB) throw new Error('Not configured');
    const identity=await viewer(request,env);
    for(const cookie of identity.cookies)headers.append('Set-Cookie',cookie);
    if(identity.user?.owner) {
      headers.set('Content-Type','text/html; charset=utf-8');
      return new Response(request.method==='HEAD' ? null : markup,{headers});
    }
    headers.set('Location','/owner-sign-in');return new Response(null,{status:302,headers});
  } catch {
    headers.set('Location','/owner-sign-in');return new Response(null,{status:302,headers});
  }
}
