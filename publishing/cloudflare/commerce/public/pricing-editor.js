import {api,money,message} from './client.js';
import {tierPrice} from './price-math.js';
const $=id=>document.getElementById(id);
function node(tag,text='',className=''){const el=document.createElement(tag);el.textContent=text;if(className)el.className=className;return el;}
function field(container,label,key,value='',options={}) {
  const wrap=node('label',label),input=node(options.tag || 'input');input.dataset.field=key;
  if(input.tagName==='INPUT')input.type=options.type || 'text';
  if(options.choices)for(const [id,name] of options.choices){const option=node('option',name);option.value=id;input.append(option);}
  for(const [key,value] of Object.entries(options))if(!['tag','type','choices'].includes(key))input.setAttribute(key,value);
  if(input.type==='checkbox')input.checked=Boolean(value);else input.value=value ?? '';
  wrap.append(input);container.append(wrap);return input;
}
const get=(row,key)=>row.querySelector('[data-field="'+key+'"]');
const moneyValue=value=>value==='' ? null : Math.round(Number(value)*100);
const dateValue=value=>value ? new Date(value).getTime() : null;
function localDate(stamp) {
  if(!stamp)return '';
  const date=new Date(stamp),pad=value=>String(value).padStart(2,'0');
  return date.getFullYear()+'-'+pad(date.getMonth()+1)+'-'+pad(date.getDate())+'T'+pad(date.getHours())+':'+pad(date.getMinutes());
}
function discountFields(row,offer,coupon=false) {
  const details=node('details');details.append(node('summary',coupon?'Schedule and usage limits':'Sale price and dates'));
  const grid=node('div','','pricing-fields');
  const choices=[['percent','Percentage off'],['fixed','PKR amount off']];if(!coupon)choices.unshift(['none','No sale']);
  const type=field(grid,'Discount type','type',offer?.type || (coupon?'percent':'none'),{tag:'select',choices});
  const value=field(grid,'Discount value','value',offer?.value ? (offer.type==='fixed'?offer.value/100:offer.value) : '',{type:'number',min:'0.01',step:'0.01'});
  const update=()=>{value.required=type.value!=='none';value.disabled=type.value==='none';value.step=type.value==='percent'?'1':'0.01';value.min=type.value==='percent'?'1':'0.01';if(type.value==='percent')value.max='99';else value.removeAttribute('max');value.parentElement.firstChild.textContent=type.value==='fixed'?'Amount off · PKR':'Percentage off · 1–99';};type.onchange=update;update();
  field(grid,'Starts at · optional','startsAt',localDate(offer?.startsAt),{type:'datetime-local'});
  field(grid,'Ends at · optional','endsAt',localDate(offer?.endsAt),{type:'datetime-local'});
  if(coupon){
    field(grid,'Minimum standard tier price · PKR','minPaisa',(offer?.minPaisa || 0)/100,{type:'number',min:'0',step:'0.01'});
    field(grid,'Total uses · blank means unlimited','maxUses',offer?.maxUses ?? '',{type:'number',min:'1',step:'1'});
    field(grid,'Uses per student · blank means unlimited','perUserLimit',offer?.perUserLimit===undefined ? 1 : offer.perUserLimit ?? '',{type:'number',min:'1',step:'1'});
    const scopes=field(grid,'Eligible tiers · no selection means all','tierIds','',{tag:'select',multiple:'multiple',size:'4'});scopes.dataset.selected=JSON.stringify(offer?.tierIds || []);
  }
  details.append(grid,node('p','Offer dates use your device’s timezone.','muted'));row.append(details);
  if(coupon || offer?.type)details.open=true;
  details.querySelectorAll('input').forEach(input=>input.addEventListener('invalid',()=>{details.open=true;}));
}
function readDiscount(row) {
  const type=get(row,'type').value;if(type==='none')return null;
  return {type,value:type==='fixed'?moneyValue(get(row,'value').value):Number(get(row,'value').value),startsAt:dateValue(get(row,'startsAt').value),endsAt:dateValue(get(row,'endsAt').value)};
}
function tierData(row) {return {id:row.dataset.id,name:get(row,'name').value,description:get(row,'description').value,days:Number(get(row,'days').value),pricePaisa:moneyValue(get(row,'pricePaisa').value),enabled:get(row,'enabled').checked,sale:readDiscount(row)};}
function couponData(row) {return {code:get(row,'code').value.toUpperCase(),...readDiscount(row),active:get(row,'active').checked,minPaisa:moneyValue(get(row,'minPaisa').value) ?? 0,maxUses:get(row,'maxUses').value ? Number(get(row,'maxUses').value) : null,perUserLimit:get(row,'perUserLimit').value ? Number(get(row,'perUserLimit').value) : null,tierIds:Array.from(get(row,'tierIds').selectedOptions,option=>option.value)};}
function syncScopes(){
  const tiers=Array.from($('tierRows').children,tierData);
  for(const row of $('couponRows').children){const select=get(row,'tierIds'),selected=select.dataset.selected ? JSON.parse(select.dataset.selected) : Array.from(select.selectedOptions,option=>option.value);delete select.dataset.selected;select.replaceChildren();for(const tier of tiers){const option=node('option',tier.name || 'Unnamed tier');option.value=tier.id;option.selected=selected.includes(tier.id);select.append(option);}}
}
function preview(){
  $('pricingPreview').replaceChildren();
  for(const row of $('tierRows').children){
    const tier=tierData(row);if(!tier.enabled || !Number.isFinite(tier.pricePaisa) || tier.pricePaisa<100)continue;
    const price=tierPrice(tier),card=node('article','','price-card');card.append(node('h3',tier.name || 'Untitled tier'),node('p',tier.description || 'Ad-free Pro'),node('p',tier.days+' days of Pro','muted'));
    if(price.discountPaisa)card.append(node('s',money(price.baseAmountPaisa)),node('span',price.discountLabel,'badge'));
    card.append(node('strong',money(price.amountPaisa),'price-amount'));$('pricingPreview').append(card);
  }
  $('pricingPreviewEmpty').hidden=$('pricingPreview').children.length>0;
}
function addTier(tier={}) {
  const row=node('section','','panel tier-editor');row.dataset.id=tier.id || 'pro-'+crypto.randomUUID().slice(0,8);
  const heading=node('div','','editor-heading');heading.append(node('h3',tier.name || 'New Pro tier'));
  const duplicate=node('button','Duplicate'),remove=node('button','Remove');duplicate.type=remove.type='button';duplicate.onclick=()=>{if($('tierRows').children.length>=20)return message('You can configure up to 20 tiers.');const copy=tierData(row);delete copy.id;copy.name=copy.name+' copy';addTier(copy);};remove.onclick=()=>{if(Array.from($('couponRows').children).some(coupon=>Array.from(get(coupon,'tierIds').selectedOptions).some(option=>option.value===row.dataset.id)))return message('Update or archive the promo codes assigned to this tier before removing it.');row.remove();syncScopes();preview();};heading.append(duplicate,remove);row.append(heading);
  const grid=node('div','','pricing-fields');
  field(grid,'Tier name','name',tier.name || '',{required:'required',maxlength:'60',placeholder:'e.g. Term Pro'});
  field(grid,'Price · PKR','pricePaisa',tier.pricePaisa ? tier.pricePaisa/100 : '',{type:'number',required:'required',min:'1',max:'1000000',step:'0.01'});
  field(grid,'Days of Pro','days',tier.days || 30,{type:'number',required:'required',min:'1',max:'3650',step:'1'});
  field(grid,'Description','description',tier.description || '',{maxlength:'240',placeholder:'What this offer includes'});
  field(grid,'Show this tier to customers','enabled',tier.enabled ?? true,{type:'checkbox'});row.append(grid);discountFields(row,tier.sale);row.oninput=()=>{heading.querySelector('h3').textContent=get(row,'name').value || 'New Pro tier';syncScopes();preview();};row.onchange=preview;
  $('tierRows').append(row);syncScopes();preview();
}
function addCoupon(coupon={}) {
  const row=node('section','','panel coupon-editor'),heading=node('div','','editor-heading');heading.append(node('h3',coupon.code || 'New promo code'));
  const remove=node('button','Archive');remove.type='button';remove.onclick=()=>row.remove();heading.append(remove);row.append(heading);
  const grid=node('div','','pricing-fields');field(grid,'Promo code','code',coupon.code || '',{required:'required',maxlength:'32',pattern:'[A-Za-z0-9][A-Za-z0-9_-]{2,31}',placeholder:'e.g. SCHOOL20'});field(grid,'Allow this code','active',coupon.active ?? true,{type:'checkbox'});row.append(grid);
  row.append(node('p',(coupon.usedCount || 0)+' paid uses · '+(coupon.reservedCount || 0)+' pending reservations','muted'));discountFields(row,coupon,true);
  row.oninput=()=>heading.querySelector('h3').textContent=get(row,'code').value.toUpperCase() || 'New promo code';$('couponRows').append(row);syncScopes();
}
export async function initPricingEditor() {
  if(!$('pricingForm'))return;
  $('addTier').onclick=()=>{if($('tierRows').children.length>=20)return message('You can configure up to 20 tiers.');addTier();};
  $('addCoupon').onclick=()=>{if($('couponRows').children.length>=50)return message('You can configure up to 50 coupon campaigns.');addCoupon();};
  const render=data=>{$('tierRows').replaceChildren();$('couponRows').replaceChildren();for(const tier of data.tiers)addTier(tier);for(const coupon of data.coupons)addCoupon(coupon);preview();};
  $('pricingForm').onsubmit=async event=>{
    event.preventDefault();$('savePricing').disabled=true;
    try{const result=await api('admin/pricing',{tiers:Array.from($('tierRows').children,tierData),coupons:Array.from($('couponRows').children,couponData)});render(result.pricing);message('Pricing tiers and discounts saved. New orders use these prices; existing orders keep their quoted price.');}
    catch(error){message(error.message);}finally{$('savePricing').disabled=false;}
  };
  try{render(await api('admin/pricing'));}catch(error){message(error.message);$('pricingEditorStatus').textContent='Pricing could not be loaded. Refresh before making changes.';return;}
  $('pricingEditorStatus').textContent='All tiers grant ad-free Pro for their chosen duration. Your preview updates as you edit; Save publishes the changes.';
}
