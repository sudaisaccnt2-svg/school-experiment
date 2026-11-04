// Shared, public configuration validation. Advertising account IDs are not credentials.
import {AUCTION_DEFAULTS,auctionFields,readyPartners} from './bidder-config.js';
export const AD_DEFAULTS=Object.freeze({...AUCTION_DEFAULTS,adsProvider:'adsense',gamNetworkCode:'',gamHomeUnit:'',gamLessonUnit:'',openBiddingReady:false,adsOnHome:true,adsOnLessonEnd:true,adsSellers:'',mobileAdsEnabled:false,mobileAdsApproved:false,mobileAppId:'',mobileBannerId:'',mobileInterstitialId:''});
export function adFields(input){
  const result={};
  for(const field of ['mobileAdsEnabled','mobileAdsApproved']){result[field]=input[field] ?? false;if(typeof result[field]!=='boolean')throw new Error('Invalid Android advertising switch.');}
  for(const field of ['mobileAppId','mobileBannerId','mobileInterstitialId']){
    const value=input[field] ?? '';if(typeof value!=='string' || value.length>64)throw new Error('Invalid AdMob ID.');result[field]=value.trim();
    const pattern=field==='mobileAppId' ? /^ca-app-pub-\d{16}~\d{10}$/ : /^ca-app-pub-\d{16}\/\d{10}$/;
    if(result[field] && (!pattern.test(result[field]) || result[field].startsWith('ca-app-pub-3940256099942544')))throw new Error('Copy a real AdMob app or ad unit ID from your account.');
  }
  const mobilePublisher=result.mobileAppId.split('~')[0];
  for(const field of ['mobileBannerId','mobileInterstitialId'])if(result[field] && result[field].split('/')[0]!==mobilePublisher)throw new Error('AdMob units must belong to the connected app publisher.');
  if(result.mobileAdsEnabled && (!result.mobileAdsApproved || !result.mobileAppId || !result.mobileBannerId || !result.mobileInterstitialId))throw new Error('Connect both Android placements and confirm Google account and app approval before enabling paid app ads.');
  result.adsProvider=input.adsProvider ?? 'adsense';if(!['adsense','admanager','prebid'].includes(result.adsProvider))throw new Error('Choose AdSense, Ad Manager or the multi-provider auction.');
  Object.assign(result,auctionFields(input,parseSellers));
  for(const field of ['gamNetworkCode','gamHomeUnit','gamLessonUnit','adsSellers']){
    const value=input[field] ?? '';if(typeof value!=='string' || value.length>(field==='adsSellers' ? 3000 : 160))throw new Error('Invalid advertising configuration.');result[field]=value.trim();
  }
  for(const field of ['openBiddingReady','adsOnHome','adsOnLessonEnd']){result[field]=input[field] ?? AD_DEFAULTS[field];if(typeof result[field]!=='boolean')throw new Error('Invalid advertising switch.');}
  if(result.gamNetworkCode && !/^\d{1,20}$/.test(result.gamNetworkCode))throw new Error('Enter the numeric Ad Manager network code.');
  for(const field of ['gamHomeUnit','gamLessonUnit'])if(result[field] && (!/^\/\d{1,20}\/[a-zA-Z0-9_./-]{1,130}$/.test(result[field]) || result[field].includes('..') || !result[field].startsWith('/'+result.gamNetworkCode+'/')))throw new Error('Copy an ad-unit path belonging to your Ad Manager network.');
  result.adsSellers=parseSellers(result.adsSellers).join('\n');
  if(result.openBiddingReady && (result.adsProvider!=='admanager' || (input.ageTreatment ?? 1)===1))throw new Error('Open Bidding needs Ad Manager and eligible non-child-directed inventory. Keep the audience setting accurate.');
  if(input.adsEnabled){
    if(!input.adsApproved)throw new Error('Confirm approval from Google before enabling ads.');
    if(!result.adsOnHome && !result.adsOnLessonEnd)throw new Error('Choose at least one advertising placement.');
    if(result.adsProvider==='adsense' && (!/^ca-pub-\d{16}$/.test(input.publisherId || '') || !/^\d+$/.test(input.adSlot || '')))throw new Error('Connect your approved AdSense publisher and ad slot.');
    if(result.adsProvider==='admanager' && (!result.gamNetworkCode || (result.adsOnHome && !result.gamHomeUnit) || (result.adsOnLessonEnd && !result.gamLessonUnit)))throw new Error('Set Ad Manager ad-unit paths for each enabled placement.');
    if(result.adsProvider==='admanager' && !input.publisherId && !result.adsSellers)throw new Error('Add the ads.txt seller entries supplied by your Google account or publishing partner.');
    if(result.adsProvider==='prebid')for(const placement of ['home','lesson'])if(result[placement==='home' ? 'adsOnHome' : 'adsOnLessonEnd'] && readyPartners(result,placement).length<2)throw new Error('Connect at least two approved providers for each enabled auction placement.');
  }
  return result;
}
export function parseSellers(text){
  const rows=text.split(/\r?\n/).map(row=>row.trim()).filter(row=>row && !row.startsWith('#'));if(rows.length>20)throw new Error('Use up to 20 authorised seller entries.');
  const result=[];for(const row of rows){
    const fields=row.split(',').map(field=>field.trim());
    if(fields.length<3 || fields.length>4 || !/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(fields[0]) || !/^[a-zA-Z0-9_.:-]{1,80}$/.test(fields[1]) || !/^(DIRECT|RESELLER)$/i.test(fields[2]) || (fields[3] && !/^[a-f0-9]{16}$/i.test(fields[3])))throw new Error('Paste valid ads.txt seller entries supplied by the advertising provider.');
    fields[0]=fields[0].toLowerCase();fields[2]=fields[2].toUpperCase();result.push(fields.join(', '));
  }
  return [...new Set(result)];
}
export function sellerText(config){
  const rows=parseSellers(config.adsSellers || '');if(/^ca-pub-\d{16}$/.test(config.publisherId || ''))rows.unshift('google.com, '+config.publisherId.replace('ca-','')+', DIRECT, f08c47fec0942fa0');
  for(const partner of config.hbPartners ?? [])if(partner.approved)rows.push(...parseSellers(partner.sellers || ''));
  return [...new Set(rows)].join('\n')+(rows.length ? '\n' : '');
}
export function placementReady(config,placement){
  if(!config.adsEnabled || !config.adsApproved || !config.adsLocationEligible || config[placement==='home' ? 'adsOnHome' : 'adsOnLessonEnd']===false)return false;
  if((config.adsProvider || 'adsense')==='adsense')return /^ca-pub-\d{16}$/.test(config.publisherId || '') && /^\d+$/.test(config.adSlot || '');
  if(config.adsProvider==='prebid')return readyPartners(config,placement).length>=2;
  const unit=config[placement==='home' ? 'gamHomeUnit' : 'gamLessonUnit'];return config.adsProvider==='admanager' && /^\d{1,20}$/.test(config.gamNetworkCode || '') && typeof unit==='string' && unit.startsWith('/'+config.gamNetworkCode+'/');
}
