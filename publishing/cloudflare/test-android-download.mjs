import test from 'node:test';
import assert from 'node:assert/strict';
import {requestedRange,serveArtifact} from '../../android-app/hosting/functions/android/download/[filename].js';
test('APK ranges support resume and suffixes, rejecting invalid or multiple ranges',()=>{
 assert.deepEqual(requestedRange('bytes=3-8',20),{start:3,end:8,partial:true});
 assert.deepEqual(requestedRange('bytes=18-',20),{start:18,end:19,partial:true});
 assert.deepEqual(requestedRange('bytes=-4',20),{start:16,end:19,partial:true});
 for(const value of ['bytes=20-','bytes=8-3','bytes=-0','bytes=1-2,4-5'])assert.equal(requestedRange(value,20),null);
});
test('APK stream preserves bytes across static parts; HEAD and ranges have exact headers',async()=>{
 const bytes=Uint8Array.from({length:23},(_,i)=>i),meta={filename:'app.apk',version:'1',bytes:23,partSize:8,sha256:'abc',parts:[{path:'/0'},{path:'/1'},{path:'/2'}]};
 const env={ASSETS:{fetch:async request=>{const i=Number(new URL(request.url).pathname.slice(1)),part=bytes.slice(i*8,Math.min(23,(i+1)*8)),range=requestedRange(request.headers.get('Range'),part.length);return new Response(part.slice(range.start,range.end+1),{status:range.partial ? 206 : 200});}}};
 const call=(range,method='GET',filename='app.apk')=>serveArtifact({env,params:{filename},request:new Request('https://site.example/android/download/app.apk',{method,headers:range ? {Range:range} : {}})},meta);
 for(const [range,start,end] of [[null,0,23],['bytes=6-18',6,19],['bytes=17-',17,23],['bytes=-3',20,23]]){
  const result=await call(range);assert.equal(result.status,range ? 206 : 200);assert.equal(result.headers.get('Content-Length'),String(end-start));assert.deepEqual(new Uint8Array(await result.arrayBuffer()),bytes.slice(start,end));
 }
 const head=await call(null,'HEAD');assert.equal(head.body,null);assert.equal(head.headers.get('Content-Length'),'23');
 const wholeParts={ASSETS:{fetch:async request=>{const i=Number(new URL(request.url).pathname.slice(1));return new Response(bytes.slice(i*8,Math.min(23,(i+1)*8)));}}};
 const boundary=await serveArtifact({env:wholeParts,params:{filename:'app.apk'},request:new Request('https://site.example/android/download/app.apk',{headers:{Range:'bytes=6-18'}})},meta);assert.deepEqual(new Uint8Array(await boundary.arrayBuffer()),bytes.slice(6,19));
 assert.equal((await call('bytes=23-')).status,416);assert.equal((await call(null,'GET','unknown.apk')).status,404);
});
