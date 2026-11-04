import {api,session,money,message,textCell} from './client.js';
import {configureStudentAccount,showStudentRecovery} from './student-account.js';
const $=id=>document.getElementById(id);
let orderId=null,selectedQuote=null,quoteSequence=0;
const fragment=new URLSearchParams(location.hash.slice(1));
const recovery=fragment.get('type') === 'recovery' ? {accessToken:fragment.get('access_token'),refreshToken:fragment.get('refresh_token'),nonce:new URLSearchParams(location.search).get('recovery_nonce')} : null;
if(location.hash && location.hash!=='#delete-account') history.replaceState(null,'',location.pathname+location.search);
const playApp=new URLSearchParams(location.search).get('channel')==='google-play';
const state=await session;
$('setup').hidden=state.config.accountsReady;
if(!navigator.onLine){$('setup').querySelector('h2').textContent='Connect to view your account';$('setup').querySelector('p').textContent='You can continue with saved lessons. Sign-in and purchases need an internet connection.';}
$('signIn').hidden=!state.config.accountsReady || Boolean(state.user) || Boolean(recovery);
$('signedIn').hidden=!state.user || Boolean(recovery);
$('adminLink').hidden=!state.membership.owner;
$('signup').hidden=!state.config.website?.registrationsOpen;
if(state.user) {
  $('identity').textContent=state.user.email;
  $('status').textContent=state.user.suspended ? 'Account suspended · contact the website owner' : state.membership.owner ? 'Owner · Pro is active' : state.membership.pro ? 'Pro · ad-free' : 'Free account';
  $('expiry').textContent=state.membership.owner ? 'Your owner account always has Pro.' : state.membership.proUntil ? 'Pro until '+new Date(state.membership.proUntil).toLocaleDateString() : 'Upgrade or redeem a code to remove ads.';
  $('redeemPanel').hidden=!state.config.codesReady || state.user.suspended || state.membership.owner;
  $('ordersPanel').hidden=false;
  try {for(const row of (await api('orders')).orders){const tr=document.createElement('tr');textCell(tr,(row.plan_name || row.plan)+' · '+row.id.slice(0,8));textCell(tr,money(row.amount_paisa)+(row.discount_paisa ? '\nSaved '+money(row.discount_paisa) : ''));const status=row.cancelled_at ? 'cancelled' : row.status==='pending' && row.quote_expires_at && row.quote_expires_at<Date.now() ? 'expired' : row.status;const cell=textCell(tr,status);if(row.status==='pending'){const cancel=document.createElement('button');cancel.type='button';cancel.textContent='Cancel unpaid order';cancel.onclick=()=>run(async()=>{await api('orders/cancel',{id:row.id});location.replace('/account');});cell.append(cancel);}$('orders').append(tr);}} catch(error){message(error.message);}
}
async function run(action) {try {await action();}catch(error){message(error.message);}}
$('authForm').onsubmit=event=>{event.preventDefault();run(async()=>{await api('login',{email:$('email').value,password:$('password').value});location.replace('/account');});};
$('signup').onclick=()=>run(async()=>{if(!$('authForm').reportValidity())return;const result=await api('signup',{email:$('email').value,password:$('password').value});if(result.recoveryCode){HTMLFormElement.prototype.reset.call($('authForm'));$('signIn').hidden=true;showStudentRecovery(result);}else if(result.ok)location.replace('/account');else message(result.message);});
$('reset').onclick=()=>run(async()=>{const result=await api('reset',{email:$('email').value});message(result.message);});
configureStudentAccount(state);
$('logout').onclick=()=>run(async()=>{const result=await api('logout',{});location.replace(result.logoutUrl || '/account');});
$('redeemForm').onsubmit=event=>{event.preventDefault();run(async()=>{await api('redeem',{code:$('code').value});location.replace('/account');});};
if(recovery){$('recovery').hidden=false;message('Enter your new password. This reset must finish in the browser where you requested it.');}
$('recoveryForm').onsubmit=event=>{event.preventDefault();run(async()=>{await api('password-reset',{...recovery,password:$('newPassword').value});location.replace('/account');});};
const pricing=state.config.pricing || {tiers:[['monthly','Monthly Pro',30,state.config.monthlyPaisa],['yearly','Yearly Pro',365,state.config.yearlyPaisa]].filter(row=>row[3]).map(([id,name,days,amountPaisa])=>({id,name,days,amountPaisa,baseAmountPaisa:amountPaisa,discountPaisa:0})),purchasesOpen:state.config.manualPayments};
for(const tier of pricing.tiers){
  const card=document.createElement('article');card.className='price-card';const title=document.createElement('h3');title.textContent=tier.name;const description=document.createElement('p');description.textContent=tier.description || 'Ad-free Pro';const duration=document.createElement('p');duration.textContent=tier.days+' days of Pro';duration.className='muted';card.append(title,description,duration);
  if(tier.discountPaisa){const original=document.createElement('s');original.textContent=money(tier.baseAmountPaisa);const badge=document.createElement('span');badge.className='badge';badge.textContent=tier.discountLabel;card.append(original,badge);}
  const amount=document.createElement('strong');amount.className='price-amount';amount.textContent=money(tier.amountPaisa);card.append(amount);$('customerTiers').append(card);
}
$('proInfo').textContent=!pricing.tiers.length ? 'Prices will appear when the owner publishes the tiers.' : !pricing.purchasesOpen ? 'These tiers are available to view. Purchases have not opened yet.' : 'Choose your Pro tier. Prices include the current sale; a valid promo code can give a better discount.';
function showQuote(result){selectedQuote=result;$('quoteSummary').textContent=money(result.amountPaisa)+' · '+result.days+' days'+(result.discountPaisa ? ' · Save '+money(result.discountPaisa)+' ('+result.discountLabel+')' : '')+(result.note ? ' · '+result.note : '');}
async function updateQuote(){
  const tier=pricing.tiers.find(tier=>tier.id===$('plan').value);if(!tier)return;
  const sequence=++quoteSequence;selectedQuote=null;$('quoteSummary').textContent='Checking the current price…';$('applyCoupon').disabled=true;
  try{const result=await api('quote',{plan:tier.id,coupon:$('coupon').value});if(sequence===quoteSequence)showQuote(result);}catch(error){if(sequence!==quoteSequence)return;$('quoteSummary').textContent=error.message;throw error;}finally{if(sequence===quoteSequence)$('applyCoupon').disabled=false;}
}
if(!playApp && pricing.purchasesOpen && pricing.tiers.length) {
  if(state.user && !state.membership.owner && !state.user.suspended) {
    $('purchaseForm').hidden=false;
    for(const tier of pricing.tiers) {
      const option=document.createElement('option');option.value=tier.id;option.textContent=tier.name+' · '+tier.days+' days · '+money(tier.amountPaisa);$('plan').append(option);
    }
    await run(updateQuote);
  } else if(!state.user) $('proInfo').textContent+=' · Sign in to purchase.';
}
$('plan').onchange=()=>run(updateQuote);$('applyCoupon').onclick=()=>run(updateQuote);$('coupon').oninput=()=>{quoteSequence++;selectedQuote=null;$('applyCoupon').disabled=false;$('quoteSummary').textContent='Apply this code to check the final price.';};
$('purchaseForm').onsubmit=event=>{event.preventDefault();run(async()=>{if(!selectedQuote)await updateQuote();if(!selectedQuote)throw new Error('Review the current price before creating your order.');const order=await api('orders',{plan:$('plan').value,method:$('method').value,coupon:$('coupon').value,expectedAmountPaisa:selectedQuote.amountPaisa});orderId=order.id;$('order').hidden=false;$('orderAmount').textContent='Send '+money(order.amountPaisa)+' for '+order.planName+' · '+order.days+' days of Pro.'+(order.discountPaisa ? ' You save '+money(order.discountPaisa)+'.' : '')+' Order '+order.id+'. Report payment by '+new Date(order.expiresAt).toLocaleString()+'.';$('instructions').textContent=order.instructions;});};
$('reportForm').onsubmit=event=>{event.preventDefault();run(async()=>{const result=await api('orders/report',{id:orderId,reference:$('reference').value});message(result.message);$('order').hidden=true;});};

if(playApp){$('proPurchasePanel').hidden=true;}
