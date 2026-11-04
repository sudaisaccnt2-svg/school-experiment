import json
from pathlib import Path
from playwright.sync_api import sync_playwright
app=Path(__file__).resolve().parents[1];publishing=app.parent/'publishing/cloudflare'
credentials=json.loads((publishing/'private-migration/owner-login.json').read_text(encoding='utf-8'));assert credentials['email']=='sudaisaccnt3@gmail.com'
connection=json.loads((app/'admob-connection.json').read_text(encoding='utf-8'));base=credentials['url'].removesuffix('/owner-sign-in')
with sync_playwright() as p:
 browser=p.chromium.launch(channel='chrome',headless=True);context=browser.new_context();headers={'Origin':base}
 login=context.request.post(base+'/api/owner-password-login',headers=headers,data={'email':credentials['email'],'password':credentials['password']});assert login.status==200,login.status
 session=context.request.get(base+'/api/session').json();assert session['membership']['owner'] and session['membership']['pro']
 page=context.new_page();page.goto(base+'/control-room#advertising',wait_until='load');page.wait_for_selector('#room:not([hidden])')
 for field,key in [('mobileAppId','appId'),('mobileBannerId','bannerId'),('mobileInterstitialId','interstitialId')]:assert page.locator('#'+field).input_value()==connection[key]
 assert not page.locator('#mobileAdsEnabled').is_checked() and not page.locator('#mobileAdsApproved').is_checked()
 context.request.post(base+'/api/logout',headers=headers,data={});browser.close()
print('Live private dashboard verified: account3 real AdMob app and both placements saved; owner is ad-free Pro; paid serving remains paused pending Google approval.')
