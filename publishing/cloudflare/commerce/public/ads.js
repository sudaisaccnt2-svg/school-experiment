import {placementReady} from './ad-config.js';

// One viewable auction per page. No timed refresh or simulated production bids.
export function mountAdvertising(state){
  const config=state.config, home=/\/home(?:\.html)?$/.test(location.pathname), placement=home ? 'home' : 'lesson';
  const end=document.querySelector('#introEnd') || document.querySelector('#end'), intro=document.querySelector('#intro');
  if(state.membership.pro || !navigator.onLine || !placementReady(config,placement) || (!home && !end))return;
  let choice=null;try{choice=localStorage.getItem('asawera.ads-choice');}catch{}
  // An old AdSense choice does not silently consent to the broader Ad Manager auction.
  const providerChoice=config.adsProvider==='prebid' ? 'prebid-v1-'+(config.hbPartners ?? []).filter(row=>row.enabled).map(row=>row.code).sort().join(',') : config.adsProvider==='admanager' ? 'admanager-v1' : 'adsense-v1';
  if((config.adsProvider || 'adsense')!=='adsense' && choice==='allow')try{if(localStorage.getItem('asawera.ads-provider-choice')!==providerChoice)choice=null;}catch{choice=null;}
  if(choice==='deny')return;
  let started=false, closed=false, visible=false, timer=null;
  const panel=document.createElement('section');panel.id='asaweraAd';panel.setAttribute('aria-label','Advertisement');
  panel.style.cssText='padding:12px;margin:24px auto;max-width:900px;width:100%;box-sizing:border-box;flex-shrink:0;border:1px solid #ffffff22;border-radius:12px;background:#101722;color:#dce5f4;font:14px system-ui;text-align:center;';
  const label=document.createElement('div');label.textContent='Advertisement';label.style.cssText='font:11px system-ui;color:#9facbf;margin-bottom:8px';panel.append(label);
  const available=()=>!closed && choice==='allow' && visible && navigator.onLine && !document.hidden && (home || (!end.hidden && !intro?.hidden));
  const collapse=()=>{closed=true;clearTimeout(timer);panel.dataset.status='unfilled';panel.remove();observer.disconnect();};
  const sizes=()=>{const width=panel.clientWidth-26;return home ? [[728,90],[320,100],[300,250]].filter(size=>size[0]<=width) : [[728,90],[468,60],[320,100]].filter(size=>size[0]<=width);};
  function script(url,ready){
    const item=document.createElement('script');item.id='asaweraAdScript';item.async=true;item.crossOrigin='anonymous';item.src=url;item.onload=()=>{if(!closed)ready();};item.onerror=collapse;
    timer=setTimeout(collapse,15000);document.head.append(item);
  }
  function start(){
    if(started || !available())return;const dimensions=sizes();if(!dimensions.length){collapse();return;}started=true;panel.dataset.status='loading';
    panel.replaceChildren(label);
    if((config.adsProvider || 'adsense')==='adsense'){
      const ad=document.createElement('ins');ad.className='adsbygoogle';ad.style.cssText='display:block;min-height:100px;';
      ad.dataset.adClient=config.publisherId;ad.dataset.adSlot=config.adSlot;ad.dataset.tagForAgeTreatment=String(config.ageTreatment || 1);
      if(home){ad.dataset.adFormat='auto';ad.dataset.fullWidthResponsive='true';}else{ad.style.cssText='display:inline-block;width:'+dimensions[0][0]+'px;height:'+dimensions[0][1]+'px;';}panel.append(ad);
      const status=new MutationObserver(()=>{if(ad.dataset.adStatus==='unfilled')collapse();else if(ad.dataset.adStatus==='filled'){clearTimeout(timer);panel.dataset.status='filled';}});status.observe(ad,{attributes:true,attributeFilter:['data-ad-status']});
      window.adsbygoogle=window.adsbygoogle || [];window.adsbygoogle.requestNonPersonalizedAds=1;
      script('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+encodeURIComponent(config.publisherId),()=>{if(!available()){collapse();return;}window.adsbygoogle.push({});});
    }else if(config.adsProvider==='prebid'){
      import('./auction.js').then(({runProviderAuction})=>{
        if(!available()){collapse();return;}
        runProviderAuction({config,placement,sizes:dimensions,panel,available,collapse,loadScript:script,filled:()=>{clearTimeout(timer);panel.dataset.status='filled';}});
      }).catch(collapse);
    }else{
      const element=document.createElement('div');element.id='asaweraGamSlot';element.style.cssText='min-height:'+Math.max(...dimensions.map(size=>size[1]))+'px;display:flex;justify-content:center;';panel.append(element);
      window.googletag=window.googletag || {cmd:[]};
      window.googletag.cmd.push(()=>{
        if(!available()){collapse();return;}const tag=window.googletag, service=tag.pubads();
        tag.setConfig({disableInitialLoad:true});service.setPrivacySettings({nonPersonalizedAds:true,tagForAgeTreatment:Number(config.ageTreatment || 1)});
        const slot=tag.defineSlot(home ? config.gamHomeUnit : config.gamLessonUnit,dimensions,element.id);if(!slot){collapse();return;}slot.addService(service);
        service.addEventListener('slotRenderEnded',event=>{if(event.slot!==slot)return;clearTimeout(timer);if(event.isEmpty)collapse();else panel.dataset.status='filled';});
        tag.enableServices();tag.display(element.id);if(available())service.refresh([slot]);
      });
      script('https://securepubads.g.doubleclick.net/tag/js/gpt.js',()=>{});
    }
  }
  if(choice!=='allow'){
    const ask=document.createElement('span');ask.textContent=config.adsProvider==='prebid' ? 'Allow ads from the connected advertising providers to support free lessons? ' : config.adsProvider==='admanager' ? 'Allow non-personalized ads from Google and eligible approved auction partners? ' : 'Allow non-personalized Google ads to support free lessons? ';
    const details=document.createElement('a');details.href='/privacy';details.textContent='Privacy & ad choices';details.style.cssText='display:block;color:#b8cbed;margin:8px;';
    const yes=document.createElement('button'),no=document.createElement('button');yes.type=no.type='button';yes.textContent='Allow ads';no.textContent='No thanks';
    for(const item of [yes,no])item.style.cssText='margin:4px;padding:8px 12px;border-radius:8px;cursor:pointer;';
    yes.onclick=()=>{choice='allow';try{localStorage.setItem('asawera.ads-choice',choice);localStorage.setItem('asawera.ads-provider-choice',providerChoice);}catch{}start();};no.onclick=()=>{choice='deny';try{localStorage.setItem('asawera.ads-choice',choice);}catch{}collapse();};panel.append(ask,details,yes,no);
  }
  const observer=new IntersectionObserver(entries=>{visible=entries.some(entry=>entry.isIntersecting && entry.intersectionRatio>=0.5);start();},{threshold:[0,0.5]});
  function place(){
    if(closed)return;
    if(home){const cards=document.querySelector('#cards');if(cards)cards.after(panel);else document.body.append(panel);}
    else if(end.hidden || intro?.hidden){panel.remove();return;}else if(!panel.isConnected)end.append(panel);
    observer.observe(panel);start();
  }
  if(!home){new MutationObserver(place).observe(end,{attributes:true,attributeFilter:['hidden']});if(intro)new MutationObserver(place).observe(intro,{attributes:true,attributeFilter:['hidden']});}
  document.addEventListener('visibilitychange',start);window.addEventListener('online',start);window.addEventListener('pagehide',()=>{closed=true;clearTimeout(timer);observer.disconnect();},{once:true});place();
  window.addEventListener('storage',event=>{if(event.key==='asawera.ads-choice' && event.newValue==='deny'){choice='deny';collapse();}});
}
