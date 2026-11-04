import {session} from './client.js';

const link=document.createElement('a'); link.id='memberLink'; link.href='/account'; link.textContent='Account / Pro';
link.title='Your account and ad-free Pro access';
link.style.cssText='font:12px system-ui;padding:6px 10px;border:1px solid #ffffff33;border-radius:9px;color:#e8eefc;background:#121923;text-decoration:none;white-space:nowrap';
const parent=document.querySelector('header') || document.querySelector('#top') || document.querySelector('#topright');
if (parent) parent.append(link);

const state=await session;
if (state.membership.pro) link.textContent=state.membership.owner ? 'Owner · Pro' : 'Pro · no ads';
else if (state.user) link.textContent='Your account';
// A failed membership check never loads ad code. An offline visitor makes no ad requests either.
const config=state.config;
if(/\/home(?:\.html)?$/.test(location.pathname)){
  const privacy=document.createElement('a');privacy.href='/privacy';privacy.textContent='Privacy & ad choices';privacy.style.cssText='display:block;padding:14px;text-align:center;color:#aebed4;font:12px system-ui';document.body.append(privacy);
}
if(config.website?.announcement) {
  const notice=document.createElement('aside');notice.id='websiteNotice';notice.textContent=config.website.announcement;
  notice.style.cssText='position:relative;z-index:80;padding:12px 18px;background:#292416;color:#fff3d4;font:14px system-ui;text-align:center';
  document.body.prepend(notice);
}
if(config.website?.contactEmail && /\/home(?:\.html)?$/.test(location.pathname)) {
  const contact=document.createElement('a');contact.textContent='Contact '+config.website.siteTitle;contact.href='mailto:'+config.website.contactEmail;
  contact.style.cssText='display:block;padding:20px;text-align:center;color:#c5d1e6;font:13px system-ui';document.body.append(contact);
}
if(!state.membership.pro && navigator.onLine && config.adsEnabled && config.adsApproved && config.adsLocationEligible) {
  const {mountAdvertising}=await import('./ads.js');
  mountAdvertising(state);
}
