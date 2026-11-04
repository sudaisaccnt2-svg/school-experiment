import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {handle} from './api.mjs';
import {ownerPage} from './owner-page.mjs';
import {accessOwner} from './owner-access.mjs';
import {passwordOwner,ownerPasswordReady} from './owner-password.mjs';
import {quote as pricingQuote,createPricedOrder} from './pricing.mjs';
import {onRequestGet as adsText} from '../functions/ads.txt.js';
import {partnerBids,winningBid} from './public/bidder-config.js';

export function setup(){
  const database=new DatabaseSync(':memory:');database.exec(readFileSync(new URL('./schema.sql',import.meta.url),'utf8'));
  let batchQueue=Promise.resolve();
  const DB={prepare(sql){let values=[];return {bind(...input){values=input;return this;},async first(){return database.prepare(sql).get(...values) || null;},async all(){return {results:database.prepare(sql).all(...values)};},async run(){const row=database.prepare(sql).run(...values);return {meta:{changes:Number(row.changes)}};}};},async batch(statements){const previous=batchQueue;let unlock;batchQueue=new Promise(resolve=>unlock=resolve);await previous;database.exec('BEGIN');try{const result=[];for(const query of statements)result.push(await query.run());database.exec('COMMIT');return result;}catch(error){database.exec('ROLLBACK');throw error;}finally{unlock();}}};
  const users={owner:{id:'owner-id',email:'owner@example.com',email_confirmed_at:'2026-01-01'},student:{id:'student-id',email:'student@example.com',email_confirmed_at:'2026-01-01'},other:{id:'other-id',email:'other@example.com',email_confirmed_at:'2026-01-01'},fakeOwner:{id:'fake-id',email:'owner@example.com',email_confirmed_at:null}};
  const env={DB,SUPABASE_URL:'https://example.supabase.co',SUPABASE_PUBLISHABLE_KEY:'public-test-key',OWNER_EMAIL:'owner@example.com',CODE_PEPPER:'test-only-pepper-not-used-in-production',
    AUTH_FETCH:async(url,options)=>{const key=(options.headers.Authorization || '').replace('Bearer ','');return new Response(JSON.stringify(users[key] || {}),{status:users[key] ? 200 : 401,headers:{'Content-Type':'application/json'}});}};
  async function call(path,user,body,origin='https://site.example'){
    const request=new Request('https://site.example/api/'+path,{method:body===undefined ? 'GET' : 'POST',headers:{Cookie:user ? '__Host-asawera_access='+user : '',...(body===undefined ? {} : {'Content-Type':'application/json',Origin:origin})},...(body===undefined ? {} : {body:JSON.stringify(body)})});
    Object.defineProperty(request,'cf',{value:{country:'PK'}});
    const response=await handle(request,env);return {status:response.status,headers:response.headers,body:await response.json()};
  }
  return {database,env,call};
}
const priceConfig={monthlyPaisa:29900,yearlyPaisa:199900,manualPayments:true,paymentInstructions:'Test-only wallet instructions',adsEnabled:false,adsApproved:false,publisherId:'',adSlot:'',ageTreatment:1};
const biddingConfig={...priceConfig,adsProvider:'admanager',publisherId:'ca-pub-1234567890123456',adsApproved:true,adsEnabled:true,ageTreatment:2,gamNetworkCode:'12345',gamHomeUnit:'/12345/asawera_home',gamLessonUnit:'/12345/asawera_end',openBiddingReady:true,adsOnHome:true,adsOnLessonEnd:true,adsSellers:'example.net, seller_123, RESELLER, 1234567890abcdef'};
const providerFixture=()=>[
  {code:'pubmatic',publisherId:'12345',homeId:'home_tag',lessonId:'end_tag',approved:true,restrictedApproved:true,enabled:true,sellers:'pubmatic.com, 12345, DIRECT, 5d62403b186f2ace'},
  {code:'ix',homeId:'12345',lessonId:'67890',approved:true,restrictedApproved:true,enabled:true,sellers:'indexexchange.com, 12345, DIRECT, 50b1c356f2c5c8fc'},
];
const providerConfig=()=>({...priceConfig,adsProvider:'prebid',adsEnabled:true,adsApproved:true,hbPartners:providerFixture(),hbTimeoutMs:1500,hbHomeFloorUsd:0.25,hbLessonFloorUsd:0.10});
test('multi-provider settings require actual connections and approvals for each enabled placement',async()=>{
  const {call}=setup(),cfg=providerConfig();
  assert.equal((await call('admin/settings','student',cfg)).status,403);
  assert.equal((await call('admin/settings','owner',cfg,'https://evil.example')).status,403);
  for(const update of [{hbPartners:[cfg.hbPartners[0]]},{hbTimeoutMs:100},{hbHomeFloorUsd:-1},{hbLessonFloorUsd:0.001},{hbPartners:[{...cfg.hbPartners[0],restrictedApproved:false},cfg.hbPartners[1]]},{hbPartners:[{...cfg.hbPartners[0],sellers:''},cfg.hbPartners[1]]},{hbPartners:[{...cfg.hbPartners[0],lessonId:''},cfg.hbPartners[1]]},{hbPartners:[cfg.hbPartners[0],{...cfg.hbPartners[1],code:'unknown'}]},{hbPartners:[cfg.hbPartners[0],cfg.hbPartners[0]]}])assert.equal((await call('admin/settings','owner',{...cfg,...update})).status,400,JSON.stringify(update));
  assert.equal((await call('admin/settings','owner',cfg)).status,200);
  const state=(await call('session')).body;assert.equal(state.config.hbPartners.length,2);assert.equal(state.config.hbHomeFloorUsd,0.25);
});
test('provider IDs reject scripts and arbitrary endpoints; pauses preserve approved seller entries',async()=>{
  const {call,env}=setup(),cfg=providerConfig();
  for(const partner of [{code:'openx',delDomain:'evil.example',homeId:'123'},{code:'rubicon',accountId:'javascript:alert(1)'},{code:'sovrn',homeId:'<script>'},{code:'pubmatic',publisherId:'9007199254740993'}])assert.equal((await call('admin/settings','owner',{...cfg,adsEnabled:false,hbPartners:[partner]})).status,400);
  assert.equal((await call('admin/settings','owner',{...cfg,adsEnabled:false,hbPartners:cfg.hbPartners.map(row=>({...row,enabled:false}))})).status,200);
  const text=await (await adsText({env})).text();assert.ok(text.includes('pubmatic.com, 12345, DIRECT'));assert.ok(text.includes('indexexchange.com, 12345, DIRECT'));
});
test('supported bidder parameters use the saved placement and restrict OpenX requests',()=>{
  const config=providerConfig(),home=partnerBids(config,'home'),lesson=partnerBids(config,'lesson');
  assert.deepEqual(home[0],{bidder:'pubmatic',params:{publisherId:'12345',adSlot:'home_tag'}});assert.equal(lesson[1].params.siteId,'67890');
  config.hbPartners.push({code:'openx',delDomain:'owner-d.openx.net',homeId:'100',lessonId:'200',approved:true,restrictedApproved:true,enabled:true,sellers:'openx.com, owner, DIRECT'});
  assert.deepEqual(partnerBids(config,'lesson')[2].params,{delDomain:'owner-d.openx.net',unit:'200',doNotTrack:true,coppa:true});
  config.hbPartners[0].approved=false;assert.equal(partnerBids(config,'home').some(row=>row.bidder==='pubmatic'),false);
});
test('winning bids compare real net USD CPM and reject expired, wrong-size and unrelated bids',()=>{
  const base={adUnitCode:'slot',bidderCode:'ix',currency:'USD',netRevenue:true,cpm:1,adId:'valid',mediaType:'banner',width:300,height:250,responseTimestamp:1000,ttl:60},rules={code:'slot',sizes:[[300,250]],bidders:['ix','pubmatic'],floor:0.5,now:2000};
  const bids=[base,{...base,bidderCode:'pubmatic',cpm:2,adId:'winner'},...[{currency:'PKR'},{netRevenue:false},{width:728},{ttl:0},{responseTimestamp:0,ttl:1},{adUnitCode:'other'},{bidderCode:'unapproved'},{mediaType:'video'},{cpm:0.49}].map(update=>({...base,...update,cpm:update.cpm ?? 100}))];
  assert.equal(winningBid(bids,rules).adId,'winner');assert.equal(winningBid(bids,{...rules,floor:200}),null);
});

const tierFixture=()=>[
  {id:'month',name:'Monthly classroom Pro',description:'Ad-free Pro',days:30,pricePaisa:50000,enabled:true,sale:{type:'percent',value:20,startsAt:null,endsAt:null}},
  {id:'term',name:'School term Pro',description:'Ad-free Pro for the term',days:90,pricePaisa:150000,enabled:true,sale:null},
  {id:'draft',name:'Unpublished tier',description:'Private draft',days:7,pricePaisa:9900,enabled:false,sale:null},
];
const couponFixture=(code='SCHOOL25',update={})=>({code,type:'percent',value:25,active:true,startsAt:null,endsAt:null,minPaisa:0,maxUses:null,perUserLimit:1,tierIds:[],...update});
async function pricedSetup(coupons=[couponFixture()]) {
  const result=setup();await result.call('admin/pricing','owner',{tiers:tierFixture(),coupons});await result.call('admin/settings','owner',priceConfig);return result;
}
test('custom tiers, sale prices and coupon settings are owner-only; public pricing never exposes private codes or draft tiers',async()=>{
  const {call}=await pricedSetup();
  assert.equal((await call('admin/pricing')).status,401);assert.equal((await call('admin/pricing','student')).status,403);
  assert.equal((await call('admin/pricing','student',{tiers:tierFixture(),coupons:[]})).status,403);
  assert.equal((await call('admin/pricing','owner',{tiers:tierFixture(),coupons:[]},'https://evil.example')).status,403);
  const publicState=(await call('session')).body;assert.equal(publicState.config.pricing.tiers.length,2);assert.equal(publicState.config.pricing.tiers[0].amountPaisa,40000);
  assert.equal(JSON.stringify(publicState).includes('SCHOOL25'),false);assert.equal(JSON.stringify(publicState).includes('Unpublished tier'),false);
  assert.equal((await call('orders','student',{plan:'draft',method:'raast'})).status,400);
});
test('quotes use the best eligible sale or code without stacking; dates, minimum prices and tier scope are enforced',async()=>{
  const {call}=await pricedSetup([couponFixture(),couponFixture('FLAT200',{type:'fixed',value:20000}),couponFixture('SMALL10',{value:10}),couponFixture('NEXT25',{startsAt:Date.now()+86400000}),couponFixture('PAST25',{endsAt:1}),couponFixture('TERM50',{value:50,tierIds:['term']}),couponFixture('MIN1000',{minPaisa:100000}),couponFixture('TOOBIG',{type:'fixed',value:100000})]);
  const quote=(plan,coupon)=>call('quote','student',{plan,coupon});
  assert.equal((await quote('month','school25')).body.amountPaisa,37500);
  assert.equal((await quote('month','FLAT200')).body.amountPaisa,30000);
  const smaller=(await quote('month','SMALL10')).body;assert.equal(smaller.amountPaisa,40000);assert.equal(smaller.couponCode,null);assert.match(smaller.note,/already gives/);
  for(const code of ['NEXT25','PAST25','TERM50','MIN1000','TOOBIG','UNKNOWN'])assert.equal((await quote('month',code)).status,400,code);
  assert.equal((await quote('term','TERM50')).body.amountPaisa,75000);
});
test('discounted orders freeze name, price and duration; client overrides and later catalogue edits cannot alter fulfillment',async()=>{
  const {call,database}=await pricedSetup();
  const order=(await call('orders','student',{plan:'month',method:'jazzcash',coupon:'SCHOOL25',amountPaisa:1,days:3650,discountPaisa:49999})).body;
  assert.equal(order.amountPaisa,37500);assert.equal(order.days,30);assert.equal(order.discountPaisa,12500);
  const stored=database.prepare('SELECT * FROM orders WHERE id=?').get(order.id);assert.equal(stored.base_amount_paisa,50000);assert.equal(stored.coupon_code,'SCHOOL25');assert.equal(stored.plan_name,'Monthly classroom Pro');
  const tiers=tierFixture();tiers[0].pricePaisa=90000;tiers[0].days=90;tiers[0].name='Updated name';
  await call('admin/pricing','owner',{tiers,coupons:[]});await call('orders/report','student',{id:order.id,reference:'FROZEN-PRICE'});
  assert.equal((await call('admin/payment','owner',{id:order.id,action:'approve',receivedPaisa:90000})).status,400);
  const before=Date.now();assert.equal((await call('admin/payment','owner',{id:order.id,action:'approve',receivedPaisa:37500})).status,200);
  assert.ok((await call('session','student')).body.membership.proUntil-before<31*86400000);
  assert.equal(database.prepare('SELECT state FROM coupon_redemptions').get().state,'used');
});
test('the last coupon slot is reserved atomically even when both customers already have valid quotes',async()=>{
  const {call,env,database}=await pricedSetup([couponFixture('LASTONE',{maxUses:1})]);await call('session','student');await call('session','other');
  const input={plan:'month',method:'raast',coupon:'LASTONE'},student={id:'student-id'},other={id:'other-id'};
  const first=await pricingQuote(env,student,input),second=await pricingQuote(env,other,input);
  const results=await Promise.allSettled([createPricedOrder(env,student,input,first),createPricedOrder(env,other,input,second)]);
  assert.equal(results.filter(row=>row.status==='fulfilled').length,1);assert.equal(results.find(row=>row.status==='rejected').reason.status,409);
  assert.equal(database.prepare('SELECT COUNT(*) AS n FROM orders').get().n,1);assert.equal(database.prepare('SELECT COUNT(*) AS n FROM coupon_redemptions').get().n,1);
});
test('coupon reservations expire or release on unpaid cancellation and rejection; reported payments retain their slot until review',async()=>{
  const {call,database}=await pricedSetup([couponFixture('LIMITED',{maxUses:1})]);
  const input={plan:'month',method:'raast',coupon:'LIMITED'},order=(await call('orders','student',input)).body;
  assert.equal((await call('orders','other',input)).status,400);assert.equal((await call('orders/cancel','other',{id:order.id})).status,409);
  assert.equal((await call('orders/cancel','student',{id:order.id})).status,200);
  const next=(await call('orders','other',input)).body;await call('orders/report','other',{id:next.id,reference:'REVIEW-ME'});
  database.prepare("UPDATE coupon_redemptions SET expires_at=1 WHERE order_id=?").run(next.id);
  assert.equal((await call('orders','student',input)).status,400);
  await call('admin/payment','owner',{id:next.id,action:'reject'});
  const expires=(await call('orders','student',input)).body;database.prepare('UPDATE orders SET quote_expires_at=1 WHERE id=?').run(expires.id);database.prepare('UPDATE coupon_redemptions SET expires_at=1 WHERE order_id=?').run(expires.id);
  assert.equal((await call('orders/report','student',{id:expires.id,reference:'TOO-LATE'})).status,409);assert.equal((await call('orders','other',input)).status,201);
});
test('paid coupon uses and personal limits persist; a smaller unused code does not consume quota',async()=>{
  const {call,database}=await pricedSetup([couponFixture('ONCE',{maxUses:3}),couponFixture('SMALL10',{value:10,maxUses:1})]);
  const input={plan:'month',method:'easypaisa',coupon:'ONCE'},order=(await call('orders','student',input)).body;
  await call('orders/report','student',{id:order.id,reference:'ONLY-ONCE'});await call('admin/payment','owner',{id:order.id,action:'approve',receivedPaisa:order.amountPaisa});
  assert.equal((await call('orders','student',input)).status,400);assert.equal((await call('orders','other',input)).status,201);
  const smaller=(await call('orders','student',{...input,coupon:'SMALL10'})).body;assert.equal(smaller.amountPaisa,40000);assert.equal(smaller.couponCode,null);
  assert.equal(database.prepare("SELECT COUNT(*) AS n FROM coupon_redemptions WHERE code='SMALL10'").get().n,0);
  const admin=(await call('admin/pricing','owner')).body;assert.equal(admin.coupons.find(c=>c.code==='ONCE').usedCount,1);
});
test('changed quotes fail instead of charging more, and invalid pricing cannot save or enable an empty catalogue',async()=>{
  const {call,env,database}=await pricedSetup();await call('session','student');const input={plan:'month',method:'raast',coupon:'SCHOOL25'},user={id:'student-id'},stale=await pricingQuote(env,user,input);
  assert.equal((await call('orders','student',{...input,expectedAmountPaisa:1})).status,409);
  const changed=tierFixture();changed[0].pricePaisa=60000;await call('admin/pricing','owner',{tiers:changed,coupons:[couponFixture()]});
  await assert.rejects(()=>createPricedOrder(env,user,input,stale),error=>error.status===409);assert.equal(database.prepare('SELECT COUNT(*) AS n FROM orders').get().n,0);
  for(const tiers of [[],[{...tierFixture()[0],pricePaisa:1}],[{...tierFixture()[0],days:0}],[{...tierFixture()[0],sale:{type:'percent',value:100}}],[tierFixture()[0],tierFixture()[0]]])assert.equal((await call('admin/pricing','owner',{tiers,coupons:[]})).status,400);
  assert.equal((await call('admin/pricing','owner',{tiers:tierFixture(),coupons:[couponFixture(),couponFixture('school25')]})).status,400);
  assert.equal((await call('admin/pricing','owner',{tiers:tierFixture(),coupons:[couponFixture('INVALID',{tierIds:['missing']})]})).status,400);
});

async function passwordSetup() {
  const fixture=setup(),password='test-only-random-owner-password-6e3eada29df765f8';
  const salt=crypto.getRandomValues(new Uint8Array(32)),key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
  const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt,iterations:100000},key,256);
  fixture.env.OWNER_PASSWORD_HASH='pbkdf2-sha256.100000.'+Buffer.from(salt).toString('base64url')+'.'+Buffer.from(bits).toString('base64url');
  fixture.env.SUPABASE_URL='';
  fixture.send=(path,data,cookie='',origin='https://site.example')=>handle(new Request('https://site.example/api/'+path,{method:data===undefined?'GET':'POST',headers:{Cookie:cookie,...(data===undefined?{}:{Origin:origin,'Content-Type':'application/json'})},...(data===undefined?{}:{body:JSON.stringify(data)})}),fixture.env);
  fixture.password=password;return fixture;
}
test('private password login works without an external billing account; a forged email or password grants nothing',async()=>{
  const {env,database,send,password}=await passwordSetup();assert.equal(ownerPasswordReady(env),true);
  assert.equal((await send('owner-password-login',{email:'other@example.com',password})).status,401);
  assert.equal((await send('owner-password-login',{email:env.OWNER_EMAIL,password:'wrong'})).status,401);
  assert.equal((await send('owner-password-login',{email:env.OWNER_EMAIL,password},'','https://evil.example')).status,403);
  const response=await send('owner-password-login',{email:env.OWNER_EMAIL,password});assert.equal(response.status,200);
  const header=response.headers.getSetCookie().at(-1);assert.match(header,/Secure; HttpOnly; SameSite=Strict; Max-Age=28800/);
  const cookie=header.split(';')[0],token=cookie.split('=')[1];
  assert.notEqual(database.prepare('SELECT token_hash FROM owner_sessions').get().token_hash,token);
  const session=await (await send('session',undefined,cookie)).json();assert.equal(session.user.email,env.OWNER_EMAIL);assert.equal(session.membership.owner,true);assert.equal(session.membership.pro,true);
  assert.equal(JSON.stringify(session).includes(env.OWNER_PASSWORD_HASH),false);assert.equal(JSON.stringify(session).includes(password),false);
  const page=await ownerPage(new Request('https://site.example/control-room',{headers:{Cookie:cookie}}),env);assert.equal(page.status,200);assert.match(page.headers.get('Cache-Control'),/no-store/);
  assert.equal((await send('admin/overview',undefined,cookie)).status,200);
});
test('owner session tampering, expiry, credential rotation and logout all deny previously valid access',async()=>{
  const {env,database,send,password}=await passwordSetup();
  const response=await send('owner-password-login',{email:env.OWNER_EMAIL,password}),cookie=response.headers.getSetCookie().at(-1).split(';')[0];
  const request=value=>new Request('https://site.example/control-room',{headers:{Cookie:value}});
  const token=cookie.split('=')[1],tampered=cookie.split('=')[0]+'='+(token[0]==='A'?'B':'A')+token.slice(1);
  assert.equal(await passwordOwner(request(tampered),env),null);
  const savedHash=env.OWNER_PASSWORD_HASH;env.OWNER_PASSWORD_HASH=savedHash.slice(0,-1)+(savedHash.endsWith('A')?'B':'A');assert.equal(await passwordOwner(request(cookie),env),null);env.OWNER_PASSWORD_HASH=savedHash;
  database.prepare('UPDATE owner_sessions SET expires_at=1').run();assert.equal(await passwordOwner(request(cookie),env),null);
  const next=await send('owner-password-login',{email:env.OWNER_EMAIL,password}),fresh=next.headers.getSetCookie().at(-1).split(';')[0];
  assert.equal((await send('logout',{},fresh)).status,200);assert.equal(await passwordOwner(request(fresh),env),null);assert.equal((await send('admin/overview',undefined,fresh)).status,401);
  env.OWNER_EMAIL='other@example.com';assert.equal(await passwordOwner(request(cookie),env),null);
});
test('owner login is disabled without provisioning and rate limits repeated guesses',async()=>{
  const basic=setup();assert.equal((await basic.call('owner-password-login',null,{email:'owner@example.com',password:'test'})).status,503);
  const {env,send,password}=await passwordSetup();
  for(let attempt=0;attempt<5;attempt++)assert.equal((await send('owner-password-login',{email:env.OWNER_EMAIL,password:'wrong'})).status,401);
  assert.equal((await send('owner-password-login',{email:env.OWNER_EMAIL,password})).status,429);
});
test('Ad Manager activation needs real connection fields; child-directed Open Bidding cannot be claimed ready',async()=>{
  const {call}=setup();
  assert.equal((await call('admin/settings','student',biddingConfig)).status,403);
  for(const update of [{gamNetworkCode:''},{gamHomeUnit:'/99999/another_network'},{gamLessonUnit:''},{adsApproved:false},{ageTreatment:1},{adsSellers:'<script>alert(1)</script>'},{adsOnHome:false,adsOnLessonEnd:false}])assert.equal((await call('admin/settings','owner',{...biddingConfig,...update})).status,400,JSON.stringify(update));
  assert.equal((await call('admin/settings','owner',biddingConfig)).status,200);
  const cfg=(await call('session')).body.config;assert.equal(cfg.adsProvider,'admanager');assert.equal(cfg.gamHomeUnit,biddingConfig.gamHomeUnit);assert.equal(cfg.monthlyPaisa,priceConfig.monthlyPaisa);
  assert.equal((await call('admin/settings','owner',{...biddingConfig,ageTreatment:1,openBiddingReady:false})).status,200);
});
test('ads.txt includes only the owner-supplied seller entries and own publisher, never made-up partner IDs',async()=>{
  const {call,env}=setup();await call('admin/settings','owner',biddingConfig);
  const response=await adsText({env}), text=await response.text();assert.equal(response.status,200);
  assert.match(text,/google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0/);assert.match(text,/example.net, seller_123, RESELLER, 1234567890abcdef/);assert.equal(text.split('\n').filter(Boolean).length,2);
});

test('private owner HTML is withheld from visitors, students, and offline/public assets',async()=>{
  const {env}=setup();
  for(const identity of ['','student','fakeOwner']){
    const response=await ownerPage(new Request('https://site.example/control-room',{headers:{Cookie:'__Host-asawera_access='+identity}}),env);
    assert.equal(response.status,302);assert.equal(response.headers.get('Location'),'/owner-sign-in');assert.equal(await response.text(),'');assert.match(response.headers.get('Cache-Control'),/no-store/);
  }
  const response=await ownerPage(new Request('https://site.example/control-room',{headers:{Cookie:'__Host-asawera_access=owner'}}),env);
  assert.equal(response.status,200);assert.match(await response.text(),/Student accounts/);assert.match(response.headers.get('Content-Security-Policy'),/frame-ancestors 'none'/);
});
test('student management is owner-only; suspension takes effect with an already-issued token',async()=>{
  const {call}=setup();await call('session','student');await call('admin/membership','owner',{email:'student@example.com',action:'grant',days:30});
  const change={id:'student-id',name:'A student',classLabel:'Class 9',note:'Private test note',status:'suspended'};
  assert.equal((await call('admin/student','other',change)).status,403);
  assert.equal((await call('admin/student','owner',change)).status,200);
  const state=(await call('session','student')).body;assert.equal(state.user.suspended,true);assert.equal(state.membership.pro,false);assert.equal(JSON.stringify(state).includes('Private test note'),false);
  assert.equal((await call('orders','student',{plan:'monthly',method:'raast'})).status,403);
  const rows=(await call('admin/students?q=Class%209','owner')).body.students;assert.equal(rows.length,1);assert.equal(rows[0].private_note,change.note);
  assert.equal((await call('admin/students?q=%25','owner')).body.students.length,0);
  assert.equal((await call('admin/student','owner',{...change,status:'active'})).status,200);assert.equal((await call('session','student')).body.membership.pro,true);
  assert.equal((await call('admin/student','owner',{...change,id:'owner-id'})).status,400);
});
test('website settings are public only as intended; student reports are private and paginated',async()=>{
  const {call,database}=setup();
  const cfg={siteTitle:'Science school',contactEmail:'support@example.com',announcement:'Next class is Monday',registrationsOpen:false};
  assert.equal((await call('admin/website','student',cfg)).status,403);
  assert.equal((await call('admin/website','owner',cfg)).status,200);assert.deepEqual((await call('session')).body.config.website,cfg);
  for(let i=0;i<55;i++)database.prepare('INSERT INTO accounts(id,email,created_at) VALUES(?,?,?)').run('sample-'+String(i).padStart(3,'0'),'student'+i+'@example.com',Date.now());
  const page=(await call('admin/students','owner')).body;assert.equal(page.students.length,50);assert.ok(page.nextCursor);
  const next=(await call('admin/students?cursor='+encodeURIComponent(page.nextCursor),'owner')).body;assert.equal(next.students.length,6);assert.equal(next.nextCursor,null);
  assert.equal((await call('admin/reports?kind=students','student')).status,403);
  const report=(await call('admin/reports?kind=students','owner')).body;assert.equal(report.rows.some(row=>row.email==='owner@example.com'),false);assert.ok(report.rows.length>50);
});
test('Cloudflare owner identity requires a valid signature, exact audience, issuer, email, and expiry',async()=>{
  const {env}=setup(), pair=await crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify']);
  const jwk=await crypto.subtle.exportKey('jwk',pair.publicKey);jwk.kid='fixture-owner-key';
  Object.assign(env,{CF_ACCESS_TEAM_DOMAIN:'fixture-owner.cloudflareaccess.com',CF_ACCESS_AUD:'a'.repeat(64),ACCESS_FETCH:async()=>new Response(JSON.stringify({keys:[jwk]}))});
  const encode=value=>Buffer.from(JSON.stringify(value)).toString('base64url'), base={iss:'https://'+env.CF_ACCESS_TEAM_DOMAIN,aud:[env.CF_ACCESS_AUD],email:env.OWNER_EMAIL,sub:'verified-owner',exp:Math.floor(Date.now()/1000)+300};
  async function token(claim){const data=encode({alg:'RS256',kid:jwk.kid})+'.'+encode(claim),signature=await crypto.subtle.sign('RSASSA-PKCS1-v1_5',pair.privateKey,new TextEncoder().encode(data));return data+'.'+Buffer.from(signature).toString('base64url');}
  const request=value=>new Request('https://site.example/api/admin/overview',{headers:{'Cf-Access-Jwt-Assertion':value}});
  const valid=await token(base);assert.equal((await accessOwner(request(valid),env)).owner,true);
  assert.equal((await accessOwner(new Request('https://site.example/api/session',{headers:{Cookie:'CF_Authorization='+valid}}),env)).owner,true);
  for(const change of [{email:'other@example.com'},{aud:['b'.repeat(64)]},{iss:'https://attacker.example'},{exp:1}])assert.equal(await accessOwner(request(await token({...base,...change})),env),null);
  const parts=valid.split('.');parts[1]=encode({...base,exp:base.exp+60});assert.equal(await accessOwner(request(parts.join('.')),env),null);
  assert.equal((await handle(request(valid),env)).status,200);
});

test('owner is automatically Pro; unconfirmed email cannot claim owner; member cannot use control room',async()=>{
  const {call}=setup();const owner=await call('session','owner');assert.equal(owner.body.membership.owner,true);assert.equal(owner.body.membership.pro,true);
  assert.equal((await call('session','fakeOwner')).body.user,null);
  assert.equal((await call('admin/overview','student')).status,403);
  assert.equal((await call('admin/overview')).status,401);
});
test('same-origin writes are required and no client flag or supplied price activates Pro',async()=>{
  const {call}=setup();assert.equal((await call('admin/settings','owner',priceConfig,'https://evil.example')).status,403);
  await call('admin/settings','owner',priceConfig);
  const order=await call('orders','student',{plan:'monthly',method:'easypaisa',amountPaisa:1,pro:true,status:'paid'});
  assert.equal(order.status,201);assert.equal(order.body.amountPaisa,29900);assert.equal((await call('session','student')).body.membership.pro,false);
  assert.equal((await call('admin/settings','owner',{...priceConfig,adsEnabled:true})).status,400);
});
test('access code is stored hashed, can be redeemed once, and SQL input cannot select other codes',async()=>{
  const {call,database}=setup();await call('session','student');await call('session','other');
  const issued=await call('admin/codes','owner',{days:30});assert.equal(issued.status,201);
  assert.notEqual(database.prepare('SELECT code_hash FROM access_codes').get().code_hash,issued.body.code);
  assert.equal((await call('redeem','student',{code:issued.body.code})).body.membership.pro,true);
  assert.equal((await call('redeem','other',{code:issued.body.code})).status,409);
  assert.equal((await call('redeem','other',{code:"' OR 1=1 --"})).status,409);
  assert.equal((await call('session','other')).body.membership.pro,false);
});
test('unused codes can be revoked; retries create no false history and revoked codes cannot activate Pro',async()=>{
  const {call,database}=setup();await call('session','student');const issued=(await call('admin/codes','owner',{days:30})).body;
  assert.equal((await call('admin/code-revoke','student',{id:issued.id})).status,403);
  assert.equal((await call('admin/code-revoke','owner',{id:issued.id})).status,200);
  assert.equal((await call('admin/code-revoke','owner',{id:issued.id})).status,409);
  assert.equal(database.prepare("SELECT COUNT(*) AS count FROM audit WHERE action='revoke-code'").get().count,1);
  assert.equal((await call('redeem','student',{code:issued.code})).status,409);
});
test('payment is only fulfilled after owner checks exact amount; repeated approval does not extend twice',async()=>{
  const {call}=setup();await call('admin/settings','owner',priceConfig);
  const order=(await call('orders','student',{plan:'monthly',method:'jazzcash'})).body;
  assert.equal((await call('orders/report','other',{id:order.id,reference:'TX1234'})).status,409);
  await call('orders/report','student',{id:order.id,reference:'TX1234'});
  assert.equal((await call('session','student')).body.membership.pro,false);
  assert.equal((await call('admin/payment','owner',{id:order.id,action:'approve',receivedPaisa:1})).status,400);
  assert.equal((await call('admin/payment','owner',{id:order.id,action:'approve',receivedPaisa:29900})).status,200);
  const expiry=(await call('session','student')).body.membership.proUntil;
  assert.equal((await call('admin/payment','owner',{id:order.id,action:'approve',receivedPaisa:29900})).status,409);
  assert.equal((await call('session','student')).body.membership.proUntil,expiry);
});
test('a reused payment reference rolls back the entire second fulfillment',async()=>{
  const {call}=setup();await call('admin/settings','owner',priceConfig);
  for(const person of ['student','other']){
    const order=(await call('orders',person,{plan:'monthly',method:'raast'})).body;
    await call('orders/report',person,{id:order.id,reference:'ONE-PAYMENT'});
    const reviewed=await call('admin/payment','owner',{id:order.id,action:'approve',receivedPaisa:29900});
    assert.equal(reviewed.status,person==='student' ? 200 : 409);
  }
  assert.equal((await call('session','other')).body.membership.pro,false);
});
test('prices are unconfigured by default, missing provider is reported, settings do not expose code pepper',async()=>{
  const {call,env}=setup();assert.equal((await call('orders','student',{plan:'monthly',method:'easypaisa'})).status,503);
  const result=await call('session');assert.equal(result.headers.get('Cache-Control'),'private, no-store');assert.equal(JSON.stringify(result.body).includes(env.CODE_PEPPER),false);
  env.SUPABASE_URL='';assert.equal((await call('health')).body.accountsReady,false);
});

test('Android ads require owner-only configuration, real matching IDs and explicit approval',async()=>{
 const {call}=setup();assert.equal((await call('session')).body.config.mobileAdsEnabled,false);
 const ids={mobileAppId:'ca-app-pub-1234567890123456~1234567890',mobileBannerId:'ca-app-pub-1234567890123456/1234567890',mobileInterstitialId:'ca-app-pub-1234567890123456/2345678901'};
 const cfg={...priceConfig,...ids,mobileAdsEnabled:false,mobileAdsApproved:false};
 assert.equal((await call('admin/settings','student',cfg)).status,403);
 assert.equal((await call('admin/settings','owner',{...cfg,mobileAdsEnabled:true})).status,400);
 assert.equal((await call('admin/settings','owner',{...cfg,mobileBannerId:'ca-app-pub-3940256099942544/9214589741'})).status,400);
 assert.equal((await call('admin/settings','owner',{...cfg,mobileInterstitialId:'ca-app-pub-6543210987654321/2345678901'})).status,400);
 assert.equal((await call('admin/settings','owner',cfg)).status,200);
 const session=(await call('session')).body;assert.equal(session.config.mobileAppId,ids.mobileAppId);assert.equal(session.config.mobileAdsApproved,false);
 assert.equal((await call('admin/settings','owner',{...cfg,mobileAdsEnabled:true,mobileAdsApproved:true})).status,200);
});
