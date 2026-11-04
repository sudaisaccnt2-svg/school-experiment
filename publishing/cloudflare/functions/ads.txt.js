import {sellerText} from '../commerce/public/ad-config.js';
export async function onRequestGet({env}) {
  let config={};
  if (env.DB) {
    const row=await env.DB.prepare("SELECT value FROM settings WHERE id='public'").first();
    if (row) config=JSON.parse(row.value);
  }
  let text;try{text=sellerText(config) || '# Advertising is not configured.\n';}catch{text='# Advertising seller entries need correction.\n';}
  return new Response(text,{headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'public, max-age=60'}});
}
