// Local browser test server. Never deploy; identities and database exist only in memory.
import {createServer} from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {handle} from './api.mjs';
import {ownerPage} from './owner-page.mjs';
const release=resolve(process.argv[2]),database=new DatabaseSync(':memory:');database.exec(readFileSync(new URL('./schema.sql',import.meta.url),'utf8'));
let mode='owner',queue=Promise.resolve();
const DB={prepare(sql){let values=[];return {bind(...args){values=args;return this;},async first(){return database.prepare(sql).get(...values) || null;},async all(){return {results:database.prepare(sql).all(...values)};},async run(){const result=database.prepare(sql).run(...values);return {meta:{changes:Number(result.changes)}};}};},async batch(statements){const before=queue;let unlock;queue=new Promise(resolve=>unlock=resolve);await before;database.exec('BEGIN');try{const results=[];for(const query of statements)results.push(await query.run());database.exec('COMMIT');return results;}catch(error){database.exec('ROLLBACK');throw error;}finally{unlock();}}};
const env={DB,OWNER_EMAIL:'owner@example.com',SUPABASE_URL:'https://fixture.supabase.co',SUPABASE_PUBLISHABLE_KEY:'fixture-only',CODE_PEPPER:'fixture-only',AUTH_FETCH:async(url,options)=>{const user=options.headers.Authorization==='Bearer owner' ? {id:'owner-id',email:'owner@example.com'} : options.headers.Authorization==='Bearer student' ? {id:'student-id',email:'student@example.com'} : null;return new Response(JSON.stringify(user ? {...user,email_confirmed_at:'2026-01-01'} : {}),{status:user?200:401});}};
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json'};
const server=createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://'+req.headers.host),chunks=[];for await(const chunk of req)chunks.push(chunk);const body=Buffer.concat(chunks);
    if(url.pathname==='/__test__/mode'){mode=JSON.parse(body).mode;res.writeHead(200,{'Content-Type':'application/json'});res.end('{}');return;}
    const headers=new Headers(req.headers);if(mode==='anonymous')headers.delete('Cookie');else headers.set('Cookie','__Host-asawera_access='+mode);
    const request=new Request(url,{method:req.method,headers,...(!['GET','HEAD'].includes(req.method)?{body}: {})});
    let response;
    if(url.pathname.startsWith('/api/'))response=await handle(request,env);
    else if(['/control-room','/control-room.html'].includes(url.pathname))response=await ownerPage(request,env);
    else{
      let path=resolve(release,'.'+decodeURIComponent(url.pathname));if(!path.startsWith(release+sep))throw new Error('Outside release');
      if(!extname(path))path+='.html';const data=readFileSync(path);response=new Response(data,{headers:{'Content-Type':types[extname(path)] || 'application/octet-stream'}});
    }
    res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  }catch{res.writeHead(500);res.end('Local fixture error');}
});
server.listen(0,'127.0.0.1',()=>process.stdout.write(JSON.stringify({url:'http://127.0.0.1:'+server.address().port})+'\n'));
