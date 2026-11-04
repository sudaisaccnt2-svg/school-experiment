// Isolated UI fixture: real student auth and SQLite, fixture owner identity only.
import {createServer} from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {handle} from './api.mjs';
import {ownerPage} from './owner-page.mjs';
const release=resolve(process.argv[2]),database=new DatabaseSync(':memory:');
database.exec(readFileSync(new URL('./schema.sql',import.meta.url),'utf8'));
database.prepare("UPDATE settings SET value=? WHERE id='website'").run(JSON.stringify({siteTitle:'Fixture classroom',contactEmail:'',announcement:'',registrationsOpen:true}));
let mode='student',queue=Promise.resolve();
const DB={prepare(sql){let values=[];return {bind(...input){values=input;return this;},async first(){return database.prepare(sql).get(...values)||null;},async all(){return {results:database.prepare(sql).all(...values)};},async run(){return {meta:{changes:Number(database.prepare(sql).run(...values).changes)}};}};},async batch(statements){const old=queue;let unlock;queue=new Promise(done=>unlock=done);await old;database.exec('BEGIN');try{const result=[];for(const query of statements)result.push(await query.run());database.exec('COMMIT');return result;}catch(error){database.exec('ROLLBACK');throw error;}finally{unlock();}}};
const env={DB,OWNER_EMAIL:'owner@example.com',STUDENT_AUTH_MODE:'username',CODE_PEPPER:'fixture-only-private-secret',SUPABASE_URL:'https://fixture.supabase.co',SUPABASE_PUBLISHABLE_KEY:'fixture-only',AUTH_FETCH:async(url,options)=>{const owner=options.headers.Authorization==='Bearer fixture-owner';return new Response(JSON.stringify(owner ? {id:'fixture-owner',email:'owner@example.com',email_confirmed_at:'2026-01-01'}:{}),{status:owner ? 200:401});}};
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json'};
const server=createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://'+req.headers.host),chunks=[];for await(const chunk of req)chunks.push(chunk);const body=Buffer.concat(chunks);
    if(url.pathname==='/__test__/mode'){mode=JSON.parse(body).mode;res.writeHead(200,{'Content-Type':'application/json'});res.end('{}');return;}
    const headers=new Headers(req.headers);
    if(mode==='owner')headers.set('Cookie','__Host-asawera_access=fixture-owner');
    const request=new Request(url,{method:req.method,headers,...(!['GET','HEAD'].includes(req.method)?{body}:{})});
    Object.defineProperty(request,'cf',{value:{country:'PK'}});
    let response;
    if(url.pathname.startsWith('/api/'))response=await handle(request,env);
    else if(['/control-room','/control-room.html'].includes(url.pathname))response=await ownerPage(request,env);
    else{
      let path=resolve(release,'.'+decodeURIComponent(url.pathname));if(!path.startsWith(release+sep))throw new Error('Outside fixture');
      if(!extname(path))path+='.html';response=new Response(readFileSync(path),{headers:{'Content-Type':types[extname(path)]||'application/octet-stream'}});
    }
    const outgoing=Object.fromEntries(response.headers);if(response.headers.getSetCookie().length)outgoing['set-cookie']=response.headers.getSetCookie();
    res.writeHead(response.status,outgoing);res.end(Buffer.from(await response.arrayBuffer()));
  }catch{res.writeHead(500);res.end('Fixture request failed');}
});
server.listen(0,'127.0.0.1',()=>process.stdout.write(JSON.stringify({url:'http://127.0.0.1:'+server.address().port})+'\n'));
