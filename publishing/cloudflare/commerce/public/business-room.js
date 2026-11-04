import {api,session,money,message,textCell} from './client.js';
import {AD_DEFAULTS,sellerText} from './ad-config.js';
import {initPricingEditor} from './pricing-editor.js';
import {readyPartners} from './bidder-config.js';
import {renderAdPartners,auctionInput,advertisingDiagnostics,initAdEditor} from './ad-editor.js';
const $=id=>document.getElementById(id), state=await session;
let config={}, selectedStudent=null, cursor=null, students=[];
const tabTitles={overview:'Overview',students:'Students',pricing:'Pricing & discounts',payments:'Payments & Pro',advertising:'Ads & payouts',website:'Website settings',records:'Records & history'};
async function run(task){try{await task();}catch(error){message(error.message);}}
function tab(name,updateURL=true){
  if(!Object.hasOwn(tabTitles,name))return;
  const target=document.querySelector('[data-section="'+name+'"]');if(!target)return;
  document.querySelectorAll('[data-section]').forEach(section=>section.hidden=section!==target);
  document.querySelectorAll('.sidebar [data-tab]').forEach(button=>button.classList.toggle('selected',button.dataset.tab===name));
  $('pageTitle').textContent=tabTitles[name];if(updateURL)history.replaceState(null,'',location.pathname+'#'+name);
}
document.querySelectorAll('[data-tab]').forEach(button=>button.onclick=()=>tab(button.dataset.tab));
window.addEventListener('hashchange',()=>tab(location.hash.slice(1) || 'overview',false));
function button(label,click){const item=document.createElement('button');item.type='button';item.textContent=label;item.onclick=click;return item;}
async function refresh(){
  const data=await api('admin/overview');$('locked').hidden=true;$('room').hidden=false;config={...AD_DEFAULTS,...data.settings};
  $('metrics').replaceChildren();
  for(const [label,value] of [['Student accounts',data.metrics.students ?? data.metrics.accounts],['Active paid / code Pro',data.metrics.pro],['Suspended accounts',data.metrics.suspended],['Confirmed Pro payments',money(data.metrics.revenuePaisa)]]){
    const card=document.createElement('div');card.className='stat';const number=document.createElement('strong'),caption=document.createElement('span');number.textContent=value;caption.textContent=label;card.append(number,caption);$('metrics').append(card);
  }
  $('readiness').replaceChildren();const connected=config.adsProvider==='prebid' ? (config.adsOnHome || config.adsOnLessonEnd) && (!config.adsOnHome || readyPartners(config,'home').length>=2) && (!config.adsOnLessonEnd || readyPartners(config,'lesson').length>=2) : config.adsProvider==='admanager' ? Boolean(config.gamNetworkCode && (config.gamHomeUnit || config.gamLessonUnit)) : Boolean(config.publisherId && config.adSlot);
  for(const [label,ready,detail] of [['Owner access',true,'Your verified owner session is active'],['Student sign-in',data.readiness.studentSignIn,'Connect student sign-in'],['Advertising',config.adsEnabled && config.adsApproved && connected,'Connect publisher ID and ad slot; confirm Google approval'],['Pro purchases',config.manualPayments,'Set prices and payment instructions, then open purchases'],['Pro access codes',data.readiness.codes,'Connect the private access-code signing secret']]){
    const item=document.createElement('div');item.className='setup-item';const name=document.createElement('strong'),status=document.createElement('span');name.textContent=label;status.textContent=ready ? 'Ready' : detail;status.className=ready ? 'ready' : 'muted';item.append(name,status);$('readiness').append(item);
  }
  for(const key of ['manualPayments','adsEnabled','adsApproved','openBiddingReady','adsOnHome','adsOnLessonEnd'])$(key).checked=Boolean(config[key]);
  for(const key of ['paymentInstructions','publisherId','adSlot','adsProvider','gamNetworkCode','gamHomeUnit','gamLessonUnit','adsSellers'])$(key).value=config[key] || '';
  $('ageTreatment').value=config.ageTreatment || 1;
  for(const key of ['mobileAdsEnabled','mobileAdsApproved'])$(key).checked=Boolean(config[key]);
  for(const key of ['mobileAppId','mobileBannerId','mobileInterstitialId'])$(key).value=config[key] || '';
  $('mobileAdStatus').textContent=config.mobileAdsEnabled && config.mobileAdsApproved ? 'Android placements enabled for eligible free accounts. Google controls fill and earnings.' : 'Android paid serving is paused. The connected app needs Google account and app approval.';
  renderAdPartners(config);advertisingDiagnostics(config,state);
  adFormState();
  for(const key of ['siteTitle','contactEmail','announcement'])$(key).value=data.website[key] || '';
  $('registrationsOpen').checked=Boolean(data.website.registrationsOpen);
  $('adStatus').textContent=!connected ? 'Paid ads cannot serve yet: approved account connections and placement IDs are missing.' : !config.adsApproved ? 'Connections saved. Site approval has not been confirmed.' : !config.adsEnabled ? 'Approval recorded by owner. Paid serving is switched off.' : config.adsProvider==='prebid' ? 'Multi-provider auctions are enabled for eligible free visitors. Only actual eligible bids can fill a placement.' : 'Google ads are enabled for eligible free visitors. Google controls ad availability and auction results.';
  $('adChecks').replaceChildren();
  const connectionChecks=config.adsProvider==='prebid' ? ['Prebid: actual parallel provider bids; highest eligible net USD CPM wins','Ready home providers: '+readyPartners(config,'home').length,'Ready lesson end providers: '+readyPartners(config,'lesson').length,'School audience: child restrictions sent; device storage and user syncing disabled'] : [config.adsProvider==='admanager' ? 'Google Ad Manager network: '+(config.gamNetworkCode || 'missing') : 'AdSense automatic advertiser auction',config.publisherId ? 'Publisher: '+config.publisherId : 'Own publisher ID not supplied',config.adsProvider==='admanager' ? 'Open Bidding account setup: '+(config.openBiddingReady ? 'confirmed by owner' : 'not confirmed') : 'AdSense slot: '+(config.adSlot || 'missing'),config.ageTreatment===1 ? 'Child treatment: Google Open Bidding partners are excluded' : 'Teen treatment: restricted Google ad requests'];
  for(const line of [...connectionChecks,sellerText(config) ? 'Public ads.txt seller entries configured' : 'Authorised seller entries missing','Ad SDKs for Pro: zero','One viewable auction per page; no timed refresh']){const item=document.createElement('li');item.textContent=line;$('adChecks').append(item);}
  $('playBillingStatus').textContent=data.readiness.playBilling ? 'Google Play checkout is connected. Google verifies purchases and subscription status.' : 'Google Play checkout code is ready. The developer account, published products and private purchase-verification connection still need to be completed.';
  $('payments').replaceChildren();$('codes').replaceChildren();$('audit').replaceChildren();$('paymentsEmpty').hidden=data.orders.length>0;
  for(const order of data.orders){
    const row=document.createElement('tr');textCell(row,order.email+' · '+order.id.slice(0,8)+'\n'+(order.plan_name || order.plan)+' · '+order.days+' days');textCell(row,`${money(order.amount_paisa)} · ${order.method} · ${order.reference || 'no reference yet'}`+(order.discount_paisa ? '\nSaved '+money(order.discount_paisa)+' · '+order.discount_label : ''));textCell(row,order.cancelled_at ? 'cancelled' : order.status==='pending' && order.quote_expires_at && order.quote_expires_at<Date.now() ? 'expired' : order.status);const cell=textCell(row,'');
    if(order.status==='reported'){
      const form=document.createElement('form'),amount=document.createElement('input');amount.type='number';amount.min='0.01';amount.step='0.01';amount.placeholder='Received amount · PKR';amount.setAttribute('aria-label','Amount actually received in PKR');amount.required=true;form.append(amount);
      const checked=document.createElement('input');checked.type='checkbox';checked.required=true;const label=document.createElement('label');label.append(checked,document.createTextNode(' Funds confirmed in wallet / bank'));form.append(label);
      const approve=document.createElement('button');approve.textContent='Approve';form.append(approve);
      form.onsubmit=event=>{event.preventDefault();run(async()=>{await api('admin/payment',{id:order.id,action:'approve',receivedPaisa:Math.round(Number(amount.value)*100),note:'Funds confirmed by owner'});await refresh();message('Payment confirmed; Pro activated.');});};
      form.append(button('Reject',()=>run(async()=>{await api('admin/payment',{id:order.id,action:'reject',note:'Payment not confirmed'});await refresh();message('Payment rejected.');})));cell.append(form);
    }
    $('payments').append(row);
  }
  for(const code of data.codes){const row=document.createElement('tr');textCell(row,code.id.slice(0,8));textCell(row,code.days);textCell(row,new Date(code.expires_at).toLocaleDateString());textCell(row,code.redeemed_by ? 'Used' : code.expires_at<Date.now() ? 'Expired' : 'Unused');const cell=textCell(row,'');if(!code.redeemed_by && code.expires_at>Date.now())cell.append(button('Revoke',()=>run(async()=>{await api('admin/code-revoke',{id:code.id});await refresh();message('Unused code revoked.');})));$('codes').append(row);}
  for(const item of data.audit){const row=document.createElement('tr');textCell(row,new Date(item.created_at).toLocaleString());textCell(row,item.action);textCell(row,item.note || item.target);$('audit').append(row);}
}
function adFormState(){const provider=$('adsProvider').value,gam=provider==='admanager';$('gamFields').hidden=!gam;$('adsenseFields').hidden=provider!=='adsense';$('googleFields').hidden=provider==='prebid';$('hbFields').hidden=provider!=='prebid';$('ageBiddingNote').textContent=provider==='prebid' ? 'Each provider must approve the school audience. Device storage and user syncing are disabled in Prebid; child restrictions are sent to all connected bidders.' : Number($('ageTreatment').value)===1 ? 'Google excludes child-directed requests from Open Bidding partners. The audience setting must reflect your real students.' : 'Teen restrictions are sent on every Google request. Partner eligibility and approval are controlled by Google.';}
$('adsProvider').onchange=()=>{$('adsApproved').checked=false;$('adsEnabled').checked=false;$('openBiddingReady').checked=false;adFormState();};$('ageTreatment').onchange=()=>{if(Number($('ageTreatment').value)===1)$('openBiddingReady').checked=false;adFormState();};
async function loadStudents(append=false){
  const query=new URLSearchParams({q:$('studentQuery').value});if(append && cursor)query.set('cursor',cursor);
  const data=await api('admin/students?'+query);students=append ? students.concat(data.students) : data.students;cursor=data.nextCursor;
  $('studentRows').replaceChildren();$('studentEmpty').hidden=students.length>0;$('moreStudents').hidden=!cursor;
  for(const student of students){
    const row=document.createElement('tr');textCell(row,student.email+(student.student_name ? '\n'+student.student_name : ''));textCell(row,student.class_label || 'Unassigned');textCell(row,student.status+' · '+(student.pro_until>Date.now() && student.status==='active' ? 'Pro until '+new Date(student.pro_until).toLocaleDateString() : 'Free'));textCell(row,student.last_seen ? new Date(student.last_seen).toLocaleString() : 'Not recorded');
    textCell(row,'').append(button('Manage',()=>{selectedStudent=student;$('studentHeading').textContent='Manage '+student.email;$('studentName').value=student.student_name;$('studentClass').value=student.class_label;$('studentStatus').value=student.status;$('studentNote').value=student.private_note;$('studentEditor').hidden=false;$('studentEditor').scrollIntoView({behavior:'smooth',block:'start'});}));$('studentRows').append(row);
  }
}
async function saveCommerce(text,candidate=config){await api('admin/settings',candidate);await refresh();message(text);}
$('paymentSettingsForm').onsubmit=event=>{event.preventDefault();run(async()=>{config={...config,manualPayments:$('manualPayments').checked,paymentInstructions:$('paymentInstructions').value};await saveCommerce('Purchase settings saved.');});};
$('adSettingsForm').onsubmit=event=>{event.preventDefault();run(async()=>{const fields={...auctionInput(),ageTreatment:Number($('ageTreatment').value)};for(const key of ['publisherId','adSlot','adsProvider','gamNetworkCode','gamHomeUnit','gamLessonUnit','adsSellers'])fields[key]=$(key).value;for(const key of ['adsApproved','adsEnabled','openBiddingReady','adsOnHome','adsOnLessonEnd'])fields[key]=$(key).checked;await saveCommerce('Advertising and auction settings saved. Provider account approvals are recorded separately.',{...config,...fields});});};
$('checkAdReadiness').onclick=()=>run(async()=>{await refresh();message('Saved advertising connections checked. The status above explains what can serve.');});
$('mobileAdSettingsForm').onsubmit=event=>{event.preventDefault();run(async()=>{const fields={};for(const key of ['mobileAppId','mobileBannerId','mobileInterstitialId'])fields[key]=$(key).value;for(const key of ['mobileAdsEnabled','mobileAdsApproved'])fields[key]=$(key).checked;await saveCommerce('Android advertising settings saved.',{...config,...fields});});};
initAdEditor();
$('websiteForm').onsubmit=event=>{event.preventDefault();run(async()=>{await api('admin/website',{siteTitle:$('siteTitle').value,contactEmail:$('contactEmail').value,announcement:$('announcement').value,registrationsOpen:$('registrationsOpen').checked});await refresh();message('Website settings saved.');});};
$('membershipForm').onsubmit=event=>{event.preventDefault();run(async()=>{await api('admin/membership',{email:$('memberEmail').value,action:$('action').value,days:Number($('days').value),note:$('note').value});await refresh();await loadStudents();message('Pro access updated.');});};
$('codeForm').onsubmit=event=>{event.preventDefault();run(async()=>{const result=await api('admin/codes',{days:Number($('codeDays').value),validityDays:Number($('validityDays').value)});$('newCode').textContent=result.code;$('newCode').hidden=false;await refresh();message('Copy this code now. It is displayed only once.');});};
$('studentSearch').onsubmit=event=>{event.preventDefault();run(()=>loadStudents());};$('moreStudents').onclick=()=>run(()=>loadStudents(true));
$('studentForm').onsubmit=event=>{event.preventDefault();if(!selectedStudent)return;run(async()=>{await api('admin/student',{id:selectedStudent.id,name:$('studentName').value,classLabel:$('studentClass').value,status:$('studentStatus').value,note:$('studentNote').value});await loadStudents();await refresh();message('Student account updated.');});};
$('studentPro').onclick=()=>{if(selectedStudent){$('memberEmail').value=selectedStudent.email;tab('payments');$('memberEmail').focus();}};
// Prevent exported spreadsheet cells from executing formulas, including leading whitespace.
const csv=value=>'"'+String(value ?? '').replace(/^[\s]*[=+\-@]/,match=>"'"+match).replace(/"/g,'""')+'"';
async function download(kind,trigger){
  trigger.disabled=true;try {
    let next='',rows=[];do{const data=await api('admin/reports?'+new URLSearchParams({kind,cursor:next}));rows.push(...data.rows);next=data.nextCursor;}while(next);
    if(!rows.length){message('No records to export yet.');return;}
    const columns=Object.keys(rows[0]),content='\ufeff'+columns.map(csv).join(',')+'\r\n'+rows.map(row=>columns.map(key=>csv(row[key])).join(',')).join('\r\n');
    const url=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download='asawera-'+kind+'-'+new Date().toISOString().slice(0,10)+'.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);message(rows.length+' records downloaded. Keep this file private.');
  }finally{trigger.disabled=false;}
}
$('exportStudents').onclick=()=>run(()=>download('students',$('exportStudents')));$('exportPayments').onclick=()=>run(()=>download('payments',$('exportPayments')));
$('refreshRoom').onclick=()=>run(async()=>{await refresh();await loadStudents();message('Dashboard refreshed.');});
$('ownerLogout').onclick=()=>run(async()=>{const result=await api('logout',{});location.replace(result.logoutUrl || '/owner-sign-in');});
if(state.membership.owner)await run(async()=>{tab(location.hash.slice(1) || 'overview',false);await refresh();await loadStudents();await initPricingEditor();});else location.replace('/owner-sign-in');
