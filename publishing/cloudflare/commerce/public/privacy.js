import {session,message} from './client.js';
const $=id=>document.getElementById(id),state=await session;
$('advertisingStatus').textContent=state.config.adsEnabled ? 'Advertising is configured for eligible free visits. No ad SDK is loaded on this privacy page.' : 'Live advertising is currently switched off. No ad SDK is loaded on this privacy page.';
function show(){try{$('choiceStatus').textContent='This browser: '+({allow:'ads allowed',deny:'ads declined'}[localStorage.getItem('asawera.ads-choice')] || 'ask before loading ads');}catch{$('choiceStatus').textContent='Your browser is not saving advertising preferences.';}}
function change(value){try{if(value)localStorage.setItem('asawera.ads-choice',value);else localStorage.removeItem('asawera.ads-choice');localStorage.removeItem('asawera.ads-provider-choice');show();message('Preference saved. Reload any other open lesson tabs to apply it there.');}catch{message('Your browser could not save this preference.');}}
$('denyAds').onclick=()=>change('deny');$('resetAds').onclick=()=>change(null);show();
if(state.config.website?.contactEmail){const link=document.createElement('a');link.href='mailto:'+state.config.website.contactEmail;link.textContent=state.config.website.contactEmail;$('privacyContact').replaceChildren('For questions or account data requests: ',link);}
