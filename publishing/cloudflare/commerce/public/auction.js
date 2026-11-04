import {partnerBids,winningBid} from './bidder-config.js';
export const PREBID_BUNDLE='/commerce/prebid-11.41.0.js';
// This module and the advertising library are loaded only after an eligible free visitor opts in.
export function runProviderAuction({config,placement,sizes,panel,available,collapse,filled,loadScript}){
  const bids=partnerBids(config,placement),code='asaweraPrebidSlot';
  if(bids.length<2 || !available()){collapse();return;}
  const timeout=config.hbTimeoutMs ?? 1500,floor=config[placement==='home' ? 'hbHomeFloorUsd' : 'hbLessonFloorUsd'] ?? 0;
  window.pbjs=window.pbjs || {que:[]};let completed=false,watchdog;
  const fail=()=>{if(completed)return;completed=true;clearTimeout(watchdog);collapse();};
  loadScript(PREBID_BUNDLE,()=>{
    const pb=window.pbjs;
    pb.que.push(()=>{
      if(!available()){fail();return;}
      try{
        pb.setConfig({bidderTimeout:timeout,bidderSequence:'random',deviceAccess:false,enableTIDs:false,coppa:true,userSync:{syncEnabled:false},useBidCache:false,eventHistoryTTL:30,floors:{enforcement:{enforceJS:true,floorDeals:true,bidAdjustment:true},data:{currency:'USD',skipRate:0,schema:{fields:['mediaType']},values:{banner:floor}}},ortb2:{regs:{coppa:1},site:{content:{language:'en'}}}});
        pb.removeAdUnit(code);
        const getFloor=()=>({currency:'USD',floor});
        const unit={code,mediaTypes:{banner:{sizes}},bids:bids.map(bid=>({...bid,getFloor})),getFloor};
        watchdog=setTimeout(fail,timeout+350);
        pb.requestBids({adUnits:[unit],timeout,bidsBackHandler:responses=>{
          if(completed)return;
          if(!available()){fail();return;}
          const winner=winningBid(responses?.[code]?.bids ?? [],{code,sizes,bidders:bids.map(bid=>bid.bidder),floor});
          if(!winner){fail();return;}
          const frame=document.createElement('iframe');frame.title='Advertisement';frame.width=winner.width;frame.height=winner.height;
          frame.style.cssText='border:0;display:block;margin:auto;max-width:100%;';frame.setAttribute('scrolling','no');
          frame.sandbox.add('allow-forms','allow-popups','allow-popups-to-escape-sandbox','allow-same-origin','allow-scripts','allow-top-navigation-by-user-activation');
          const rendered=event=>{if(event.adId!==winner.adId)return;completed=true;clearTimeout(watchdog);pb.offEvent('adRenderSucceeded',rendered);pb.offEvent('adRenderFailed',failed);filled();};
          const failed=event=>{if(event.adId!==winner.adId && event.bid?.adId!==winner.adId)return;pb.offEvent('adRenderSucceeded',rendered);pb.offEvent('adRenderFailed',failed);fail();};
          pb.onEvent('adRenderSucceeded',rendered);pb.onEvent('adRenderFailed',failed);
          panel.append(frame);pb.renderAd(frame.contentWindow.document,winner.adId);
        }});
      }catch{fail();}
    });
  });
}
