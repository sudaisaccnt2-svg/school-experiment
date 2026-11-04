// Only public publisher/placement identifiers belong here. No provider passwords or API keys.
export const BIDDER_PROVIDERS=Object.freeze([
  {code:'pubmatic',name:'PubMatic',url:'https://pubmatic.com/',fields:[['publisherId','Publisher ID','number'],['homeId','Home ad slot','text'],['lessonId','Lesson end ad slot','text']]},
  {code:'rubicon',name:'Magnite',url:'https://www.magnite.com/',fields:[['accountId','Account ID','number'],['siteId','Site ID','number'],['homeId','Home zone ID','number'],['lessonId','Lesson end zone ID','number']]},
  {code:'ix',name:'Index Exchange',url:'https://www.indexexchange.com/',fields:[['homeId','Home site / placement ID','number'],['lessonId','Lesson end site / placement ID','number']]},
  {code:'openx',name:'OpenX',url:'https://www.openx.com/',fields:[['delDomain','Delivery domain supplied by OpenX','domain'],['homeId','Home ad unit ID','number'],['lessonId','Lesson end ad unit ID','number']]},
  {code:'sovrn',name:'Sovrn',url:'https://www.sovrn.com/',fields:[['homeId','Home tag ID','number'],['lessonId','Lesson end tag ID','number']]},
  {code:'appnexus',name:'Microsoft / Xandr',url:'https://about.ads.microsoft.com/',fields:[['homeId','Home placement ID','number'],['lessonId','Lesson end placement ID','number']]},
]);
export const AUCTION_DEFAULTS=Object.freeze({hbPartners:[],hbTimeoutMs:1500,hbHomeFloorUsd:0,hbLessonFloorUsd:0});
const definition=code=>BIDDER_PROVIDERS.find(provider=>provider.code===code);
export function partnerFields(input,parseSellers){
  if(!Array.isArray(input ?? []) || (input ?? []).length>BIDDER_PROVIDERS.length)throw new Error('Use the supported advertising providers.');
  const seen=new Set();
  return (input ?? []).map(row=>{
    if(!row || typeof row!=='object' || Array.isArray(row))throw new Error('Invalid advertising provider.');
    const provider=definition(row.code);if(!provider || seen.has(row.code))throw new Error('Choose each supported provider once.');seen.add(row.code);
    const result={code:row.code};
    for(const key of ['enabled','approved','restrictedApproved']){result[key]=row[key] ?? false;if(typeof result[key]!=='boolean')throw new Error('Invalid provider switch.');}
    for(const [key,label,kind] of provider.fields){
      const value=row[key] ?? '';if(typeof value!=='string' || value.length>100)throw new Error('Invalid '+provider.name+' '+label+'.');result[key]=value.trim();
      if(result[key] && (kind==='number' && (!/^[1-9]\d{0,14}$/.test(result[key]) || !Number.isSafeInteger(Number(result[key]))) || kind==='domain' && !/^[a-z0-9-]+\.openx\.net$/i.test(result[key]) || kind==='text' && !/^[a-zA-Z0-9_.:-]{1,100}$/.test(result[key])))throw new Error('Enter the '+label+' supplied by '+provider.name+'.');
    }
    if(typeof (row.sellers ?? '')!=='string' || (row.sellers ?? '').length>1500)throw new Error('Invalid provider seller entries.');
    result.sellers=parseSellers(row.sellers ?? '').join('\n');
    if(result.enabled && (!result.approved || !result.restrictedApproved || !result.sellers))throw new Error(provider.name+' needs confirmed site and restricted-audience approval plus its authorised ads.txt entries.');
    return result;
  });
}
export function auctionFields(input,parseSellers){
  const out={hbPartners:partnerFields(input.hbPartners,parseSellers),hbTimeoutMs:input.hbTimeoutMs ?? 1500};
  if(!Number.isInteger(out.hbTimeoutMs) || out.hbTimeoutMs<500 || out.hbTimeoutMs>3000)throw new Error('Use an auction timeout between 500 and 3000 milliseconds.');
  for(const key of ['hbHomeFloorUsd','hbLessonFloorUsd']){
    const value=input[key] ?? 0;if(typeof value!=='number' || !Number.isFinite(value) || value<0 || value>1000 || Math.abs(value*100-Math.round(value*100))>0.000001)throw new Error('Use a USD CPM floor from 0 to 1000 with up to two decimal places.');out[key]=value;
  }
  return out;
}
export function readyPartners(config,placement){
  const key=placement==='home' ? 'homeId' : 'lessonId';
  return (config.hbPartners ?? []).filter(row=>{
    const provider=definition(row.code);return provider && row.enabled && row.approved && row.restrictedApproved && row.sellers && row[key] && provider.fields.filter(([field])=>!['homeId','lessonId'].includes(field)).every(([field])=>Boolean(row[field]));
  });
}
export function partnerBids(config,placement){
  return readyPartners(config,placement).map(row=>{
    const id=row[placement==='home' ? 'homeId' : 'lessonId'];let params;
    switch(row.code){
      case 'pubmatic':params={publisherId:row.publisherId,adSlot:id};break;
      case 'rubicon':params={accountId:Number(row.accountId),siteId:Number(row.siteId),zoneId:Number(id)};break;
      case 'ix':params={siteId:id};break;
      case 'openx':params={delDomain:row.delDomain,unit:id,doNotTrack:true,coppa:true};break;
      case 'sovrn':params={tagid:id};break;
      case 'appnexus':params={placementId:Number(id),usePaymentRule:true};break;
    }
    return {bidder:row.code,params};
  });
}
// Compare actual net bids in the same currency. Reject stale, wrong-size and unapproved responses.
export function winningBid(responses,{code,sizes,bidders,floor=0,now=Date.now()}){
  return responses.filter(bid=>bid.adUnitCode===code && bidders.includes(bid.bidderCode) && bid.currency==='USD' && bid.netRevenue===true && Number.isFinite(bid.cpm) && bid.cpm>0 && bid.cpm>=floor && typeof bid.adId==='string' && bid.adId && bid.mediaType==='banner' && sizes.some(([w,h])=>w===bid.width && h===bid.height) && Number.isFinite(bid.responseTimestamp) && Number.isFinite(bid.ttl) && bid.ttl>0 && bid.responseTimestamp+bid.ttl*1000>now)
    .sort((a,b)=>b.cpm-a.cpm || a.responseTimestamp-b.responseTimestamp)[0] ?? null;
}
