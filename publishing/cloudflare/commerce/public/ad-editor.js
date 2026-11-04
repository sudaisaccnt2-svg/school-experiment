import {BIDDER_PROVIDERS,readyPartners} from './bidder-config.js';
const $=id=>document.getElementById(id);
function element(tag,text,className){const node=document.createElement(tag);if(text)node.textContent=text;if(className)node.className=className;return node;}
export function renderAdPartners(config){
  const root=$('bidderRows');root.replaceChildren();
  $('hbTimeoutMs').value=config.hbTimeoutMs ?? 1500;$('hbHomeFloorUsd').value=config.hbHomeFloorUsd ?? 0;$('hbLessonFloorUsd').value=config.hbLessonFloorUsd ?? 0;
  for(const provider of BIDDER_PROVIDERS){
    const saved=(config.hbPartners ?? []).find(row=>row.code===provider.code) ?? {},card=element('article',null,'panel bidder-card');card.dataset.bidder=provider.code;
    const heading=element('div',null,'editor-heading');heading.append(element('h3',provider.name));const link=element('a','Provider website ↗','button');link.href=provider.url;link.target='_blank';link.rel='noopener noreferrer';heading.append(link);card.append(heading);
    card.append(element('p',saved.enabled && saved.approved && saved.restrictedApproved ? 'Approval recorded by owner. Readiness depends on placement IDs and seller entries.' : saved.approved ? 'Approval recorded; finish the connection before enabling.' : 'Account / site approval not recorded.','muted'));
    const grid=element('div',null,'grid');
    for(const [key,label,kind] of provider.fields){const box=element('div'),id='bidder-'+provider.code+'-'+key,input=element('input');input.id=id;input.dataset.field=key;input.value=saved[key] ?? '';input.maxLength=100;if(kind==='number')input.inputMode='numeric';const name=element('label',label);name.htmlFor=id;box.append(name,input);grid.append(box);}card.append(grid);
    for(const [key,label] of [['approved','Site approved in this provider account'],['restrictedApproved','Provider approved this child / teen audience with restricted advertising'],['enabled','Include this provider in the auction']]){const row=element('label'),check=element('input');check.type='checkbox';check.dataset.field=key;check.checked=Boolean(saved[key]);row.append(check,document.createTextNode(' '+label));card.append(row);}
    const id='bidder-'+provider.code+'-sellers',sellerLabel=element('label','Authorised ads.txt entries from this provider'),sellers=element('textarea');sellerLabel.htmlFor=id;sellers.id=id;sellers.dataset.field='sellers';sellers.maxLength=1500;sellers.value=saved.sellers ?? '';sellers.placeholder='Exact entries supplied by your approved account';card.append(sellerLabel,sellers);root.append(card);
  }
  updateAuctionSummary();
}
export function readAdPartners(){
  return [...$('bidderRows').children].map(card=>{const row={code:card.dataset.bidder};for(const input of card.querySelectorAll('[data-field]'))row[input.dataset.field]=input.type==='checkbox' ? input.checked : input.value;return row;});
}
export function auctionInput(){return {hbPartners:readAdPartners(),hbTimeoutMs:Number($('hbTimeoutMs').value),hbHomeFloorUsd:Number($('hbHomeFloorUsd').value),hbLessonFloorUsd:Number($('hbLessonFloorUsd').value)};}
export function updateAuctionSummary(){
  const draft=auctionInput(),home=readyPartners(draft,'home').length,lesson=readyPartners(draft,'lesson').length;
  $('auctionSummary').textContent=home+' ready home providers · '+lesson+' ready lesson end providers. The highest eligible net USD bid wins. The auction closes after '+draft.hbTimeoutMs+' ms. Minimum bids: home $'+draft.hbHomeFloorUsd.toFixed(2)+' CPM, lesson end $'+draft.hbLessonFloorUsd.toFixed(2)+' CPM. Save publishes changes.';
}
export function advertisingDiagnostics(config,state){
  const lines=['Your signed-in owner account has ad-free Pro. Paid ads are requested only for eligible free visitors.'];
  if(!config.adsEnabled)lines.push('Paid serving is switched off.');
  if(!config.adsApproved)lines.push('Site approval has not been confirmed in the selected provider.');
  if(config.adsProvider==='prebid'){
    for(const placement of ['home','lesson'])if(config[placement==='home' ? 'adsOnHome' : 'adsOnLessonEnd'])lines.push((placement==='home' ? 'Home' : 'Lesson end')+': '+readyPartners(config,placement).length+' of the minimum 2 connected, approved providers.');
  }else if(config.adsProvider==='admanager'){
    if(!config.gamNetworkCode)lines.push('Ad Manager network code is missing.');
    if(config.adsOnHome && !config.gamHomeUnit)lines.push('Home ad unit path is missing.');
    if(config.adsOnLessonEnd && !config.gamLessonUnit)lines.push('Lesson end ad unit path is missing.');
  }else{
    if(!config.publisherId)lines.push('AdSense publisher ID is missing.');if(!config.adSlot)lines.push('AdSense display ad slot is missing.');
  }
  if(!config.adsOnHome && !config.adsOnLessonEnd)lines.push('Both placements are switched off.');
  if(!state.config.adsLocationEligible)lines.push('This connection is outside the supported Pakistan ad region.');
  lines.push('Visitors must allow the current providers and bring the placement into view. Ad blockers or no available bid can prevent an ad.');
  const root=$('adDiagnostics');root.replaceChildren();for(const line of lines)root.append(element('li',line));
}
export function initAdEditor(){
  $('bidderRows').addEventListener('input',updateAuctionSummary);for(const id of ['hbTimeoutMs','hbHomeFloorUsd','hbLessonFloorUsd'])$(id).addEventListener('input',updateAuctionSummary);
  $('previewAdPlacement').onclick=()=>{$('adPlacementPreview').hidden=!$('adPlacementPreview').hidden;};
}
