import {AD_DEFAULTS} from './public/ad-config.js';
import {discountAmount,tierPrice} from './public/price-math.js';
export class PricingError extends Error {constructor(status,message){super(message);this.status=status;}}
const fail=(message,status=400)=>{throw new PricingError(status,message);};
const q=(env,sql,...values)=>env.DB.prepare(sql).bind(...values);
const text=(value,max,label)=>{if(typeof value!=='string' || value.length>max)fail('Enter a valid '+label+'.');return value.trim();};
const number=(value,min,max,label)=>{if(!Number.isSafeInteger(value) || value<min || value>max)fail('Enter a valid '+label+'.');return value;};
const date=value=>value==null ? null : number(value,1,8640000000000000,'offer date');
function window(input) {
  const startsAt=date(input.startsAt),endsAt=date(input.endsAt);
  if(startsAt && endsAt && endsAt<=startsAt)fail('The offer end must be after its start.');
  return {startsAt,endsAt};
}
function discount(input,base=null) {
  if(!input || input.type==='none')return null;
  if(!['percent','fixed'].includes(input.type))fail('Choose percentage or fixed-amount discount.');
  const value=number(input.value,1,input.type==='percent'?99:99999999,'discount');
  if(base!==null && discountAmount(base,{type:input.type,value})>=base)fail('A sale price must remain positive. For free Pro, issue an access code.');
  return {type:input.type,value,...window(input)};
}
export function validatePricing(input) {
  if(!Array.isArray(input.tiers) || input.tiers.length>20 || !Array.isArray(input.coupons) || input.coupons.length>50)fail('Use up to 20 tiers and 50 coupon campaigns.');
  const ids=new Set(),codes=new Set();
  const tiers=input.tiers.map(item=>{
    if(!item || typeof item!=='object' || Array.isArray(item))fail('Enter a valid pricing tier.');
    const id=text(item.id,40,'tier'),name=text(item.name,60,'tier name');
    if(!/^[a-z0-9][a-z0-9_-]{1,39}$/.test(id) || ids.has(id) || !name || typeof item.enabled!=='boolean')fail('Each tier needs a unique identifier, name and availability.');ids.add(id);
    const pricePaisa=number(item.pricePaisa,100,100000000,'PKR price');
    return {id,name,description:text(item.description || '',240,'description'),days:number(item.days,1,3650,'Pro duration'),pricePaisa,enabled:item.enabled,sale:discount(item.sale,pricePaisa)};
  });
  const coupons=input.coupons.map(item=>{
    if(!item || typeof item!=='object' || Array.isArray(item))fail('Enter a valid promo code.');
    const code=text(item.code,32,'promo code').toUpperCase();
    if(!/^[A-Z0-9][A-Z0-9_-]{2,31}$/.test(code) || codes.has(code) || typeof item.active!=='boolean')fail('Each coupon needs a unique code of 3–32 letters, numbers, dashes or underscores.');codes.add(code);
    const offer=discount(item);if(!offer)fail('Choose a coupon discount.');
    if(!Array.isArray(item.tierIds) || item.tierIds.length>20 || item.tierIds.some(id=>!ids.has(id)) || new Set(item.tierIds).size!==item.tierIds.length)fail('Choose existing tiers for the coupon.');
    return {code,...offer,active:item.active,minPaisa:number(item.minPaisa ?? 0,0,100000000,'minimum price'),maxUses:item.maxUses==null ? null : number(item.maxUses,1,1000000,'coupon usage limit'),perUserLimit:item.perUserLimit==null ? null : number(item.perUserLimit,1,1000,'per-student limit'),tierIds:item.tierIds};
  });
  return {tiers,coupons};
}
export function legacyTiers(cfg) {
  return [['monthly','Monthly Pro',30,cfg.monthlyPaisa],['yearly','Yearly Pro',365,cfg.yearlyPaisa]].filter(row=>row[3]).map(([id,name,days,pricePaisa])=>({id,name,description:'Ad-free Pro',days,pricePaisa,enabled:true,sale:null}));
}
export async function catalog(env) {
  const publicRow=await q(env,"SELECT value FROM settings WHERE id='public'").first();
  const row=await q(env,"SELECT value FROM settings WHERE id='pricing'").first();
  const cfg={...AD_DEFAULTS,...JSON.parse(publicRow.value)};
  return {cfg,publicValue:publicRow.value,pricingValue:row?.value ?? null,tiers:row ? JSON.parse(row.value).tiers : legacyTiers(cfg)};
}
export const catalogGuard="EXISTS(SELECT 1 FROM settings WHERE id='public' AND value=?) AND ((? IS NULL AND NOT EXISTS(SELECT 1 FROM settings WHERE id='pricing')) OR EXISTS(SELECT 1 FROM settings WHERE id='pricing' AND value=?))";
export const guardValues=book=>[book.publicValue,book.pricingValue,book.pricingValue];
export function publicPricing(book,stamp=Date.now()) {
  return {tiers:book.tiers.filter(tier=>tier.enabled).map(tier=>({id:tier.id,name:tier.name,description:tier.description,days:tier.days,...tierPrice(tier,stamp)})),purchasesOpen:Boolean(book.cfg.manualPayments),currency:'PKR',discountsStack:false};
}
const held="(state IN ('used','reported') OR (state='reserved' AND expires_at>?))";
export async function adminPricing(env) {
  const book=await catalog(env),stamp=Date.now();
  const rows=await q(env,`SELECT c.*, (SELECT COUNT(*) FROM coupon_redemptions r WHERE r.code=c.code AND r.state='used') AS used_count, (SELECT COUNT(*) FROM coupon_redemptions r WHERE r.code=c.code AND (r.state='reported' OR (r.state='reserved' AND r.expires_at>?))) AS reserved_count FROM coupons c WHERE listed=1 ORDER BY rowid LIMIT 50`,stamp).all();
  return {tiers:book.tiers,coupons:rows.results.map(row=>({code:row.code,type:row.type,value:row.value,active:Boolean(row.active),startsAt:row.starts_at,endsAt:row.ends_at,minPaisa:row.min_paisa,maxUses:row.max_uses,perUserLimit:row.per_user_limit,tierIds:JSON.parse(row.tier_ids),usedCount:row.used_count,reservedCount:row.reserved_count})),currency:'PKR',discountsStack:false};
}
export async function savePricing(env,pricing,actor) {
  const current=await catalog(env);
  if(current.cfg.manualPayments && !pricing.tiers.some(tier=>tier.enabled))fail('Keep an available tier, or close purchases before removing all tiers.');
  const statements=[q(env,"INSERT INTO settings(id,value) VALUES('pricing',?) ON CONFLICT(id) DO UPDATE SET value=excluded.value",JSON.stringify({tiers:pricing.tiers})),q(env,'UPDATE coupons SET active=0,listed=0,version=?',crypto.randomUUID())];
  for(const coupon of pricing.coupons)statements.push(q(env,`INSERT INTO coupons(code,type,value,active,starts_at,ends_at,min_paisa,max_uses,per_user_limit,tier_ids,version,listed) VALUES(?,?,?,?,?,?,?,?,?,?,?,1) ON CONFLICT(code) DO UPDATE SET type=excluded.type,value=excluded.value,active=excluded.active,starts_at=excluded.starts_at,ends_at=excluded.ends_at,min_paisa=excluded.min_paisa,max_uses=excluded.max_uses,per_user_limit=excluded.per_user_limit,tier_ids=excluded.tier_ids,version=excluded.version,listed=1`,coupon.code,coupon.type,coupon.value,Number(coupon.active),coupon.startsAt,coupon.endsAt,coupon.minPaisa,coupon.maxUses,coupon.perUserLimit,JSON.stringify(coupon.tierIds),crypto.randomUUID()));
  statements.push(q(env,"INSERT INTO audit(actor,action,target,note,created_at) VALUES(?,'pricing-settings','pricing',?,?)",actor,pricing.tiers.length+' tiers, '+pricing.coupons.length+' coupons',Date.now()));
  await env.DB.batch(statements);return adminPricing(env);
}
export async function quote(env,user,input,stamp=Date.now()) {
  const book=await catalog(env);
  if(!book.cfg.manualPayments)fail('Purchases will open when payment details are ready.',503);
  const tier=book.tiers.find(tier=>tier.id===input.plan && tier.enabled);if(!tier)fail('This tier is unavailable. Refresh the current prices.');
  const price=tierPrice(tier,stamp);
  const code=text(input.coupon || '',32,'promo code').toUpperCase();let coupon=null,note='';
  if(code) {
    const row=await q(env,'SELECT * FROM coupons WHERE code=? AND active=1 AND listed=1',code).first();
    const unavailable=()=>fail('This promo code is unavailable for this order.');
    if(!row || (row.starts_at && row.starts_at>stamp) || (row.ends_at && row.ends_at<=stamp) || tier.pricePaisa<row.min_paisa)unavailable();
    const scopes=JSON.parse(row.tier_ids);if(scopes.length && !scopes.includes(tier.id))unavailable();
    const offer={type:row.type,value:row.value},savings=discountAmount(tier.pricePaisa,offer);if(savings>=tier.pricePaisa)unavailable();
    if(row.max_uses!==null) {const count=await q(env,`SELECT COUNT(*) AS total FROM coupon_redemptions WHERE code=? AND ${held}`,code,stamp).first();if(count.total>=row.max_uses)unavailable();}
    if(row.per_user_limit!==null) {const count=await q(env,`SELECT COUNT(*) AS personal FROM coupon_redemptions WHERE code=? AND user_id=? AND ${held}`,code,user.id,stamp).first();if(count.personal>=row.per_user_limit)unavailable();}
    if(savings>price.discountPaisa) {price.discountPaisa=savings;price.amountPaisa=tier.pricePaisa-savings;price.discountLabel=code+(row.type==='percent'?' · '+row.value+'% off':'');coupon=row;}
    else note='The current sale already gives you an equal or better price. This code will not be used.';
  }
  return {book,tier,coupon,price,note,stamp};
}
export function publicQuote(result) {return {plan:result.tier.id,planName:result.tier.name,days:result.tier.days,...result.price,couponCode:result.coupon?.code || null,note:result.note,currency:'PKR',discountsStack:false};}
export async function createPricedOrder(env,user,input,result) {
  if(!['easypaisa','jazzcash','raast'].includes(input.method))fail('Choose an available payment method.');
  if(input.expectedAmountPaisa!==undefined && input.expectedAmountPaisa!==result.price.amountPaisa)fail('The price changed. Review the current price before creating your order.',409);
  const id=crypto.randomUUID(),expiresAt=result.stamp+86400000,{tier,price,book,coupon}=result;
  const insert=`INSERT INTO orders(id,user_id,plan,amount_paisa,days,method,status,created_at,plan_name,base_amount_paisa,discount_paisa,discount_label,coupon_code,quote_expires_at) SELECT ?,?,?,?,?,?,'pending',?,?,?,?,?,?,? WHERE `;
  const values=[id,user.id,tier.id,price.amountPaisa,tier.days,input.method,result.stamp,tier.name,price.baseAmountPaisa,price.discountPaisa,price.discountLabel,coupon?.code || null,expiresAt];
  let results;
  if(coupon) {
    results=await env.DB.batch([
      q(env,`INSERT INTO coupon_redemptions(order_id,code,user_id,state,expires_at) SELECT ?,c.code,?,'reserved',? FROM coupons c WHERE c.code=? AND c.version=? AND c.active=1 AND c.listed=1 AND (c.starts_at IS NULL OR c.starts_at<=?) AND (c.ends_at IS NULL OR c.ends_at>?) AND (c.max_uses IS NULL OR (SELECT COUNT(*) FROM coupon_redemptions r WHERE r.code=c.code AND ${held})<c.max_uses) AND (c.per_user_limit IS NULL OR (SELECT COUNT(*) FROM coupon_redemptions r WHERE r.code=c.code AND r.user_id=? AND ${held})<c.per_user_limit) AND ${catalogGuard}`,id,user.id,expiresAt,coupon.code,coupon.version,result.stamp,result.stamp,result.stamp,user.id,result.stamp,...guardValues(book)),
      q(env,insert+'EXISTS(SELECT 1 FROM coupon_redemptions WHERE order_id=? AND state=\'reserved\')',...values,id),
    ]);
    if(!results[0].meta.changes || !results[1].meta.changes)fail('The offer changed or its usage limit was reached. Refresh your quote.',409);
  } else {
    const inserted=await q(env,insert+catalogGuard,...values,...guardValues(book)).run();if(!inserted.meta.changes)fail('The price changed. Refresh your quote.',409);
  }
  return {id,...publicQuote(result),instructions:book.cfg.paymentInstructions,status:'pending',expiresAt};
}
