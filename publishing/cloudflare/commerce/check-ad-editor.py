"""Verify the owner ad editor against a local database. Never changes production settings."""
import argparse,json,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
HERE=Path(__file__).resolve().parent
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--report',type=Path,required=True);args=parser.parse_args();report=json.loads(args.report.read_text(encoding='utf-8'))
server=subprocess.Popen([r'C:\Program Files\nodejs\node.exe',str(HERE/'pricing-fixture.mjs'),report['releaseDirectory']],stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
try:
 base=json.loads(server.stdout.readline())['url'];errors=[];sdk=[]
 with sync_playwright() as p:
  browser=p.chromium.launch(channel='chrome',headless=True);context=browser.new_context(viewport={'width':1280,'height':900})
  def guard(route):
   if not route.request.url.startswith(base+'/') or 'prebid-' in route.request.url:sdk.append(route.request.url);route.abort()
   else:route.continue_()
  context.route('**/*',guard);page=context.new_page();page.on('pageerror',lambda error:errors.append(str(error)));page.goto(base+'/control-room#advertising',wait_until='load');page.wait_for_selector('#room:not([hidden])');assert page.locator('#adDiagnostics').is_visible()
  assert 'publisher ID is missing' in page.locator('#adDiagnostics').inner_text()
  page.locator('#previewAdPlacement').click();assert page.locator('#adPlacementPreview').is_visible();assert 'not a paid ad' in page.locator('#adPlacementPreview').inner_text().lower()
  page.locator('#adsProvider').select_option('prebid');assert page.locator('#bidderRows article').count()==6
  for code,fields in [('pubmatic',{'publisherId':'12345','homeId':'home_slot','lessonId':'end_slot','sellers':'pubmatic.com, 12345, DIRECT, 5d62403b186f2ace'}),('ix',{'homeId':'12345','lessonId':'67890','sellers':'indexexchange.com, 12345, DIRECT, 50b1c356f2c5c8fc'})]:
   card=page.locator('[data-bidder="'+code+'"]')
   for key,value in fields.items():card.locator('[data-field="'+key+'"]').fill(value)
   for key in ['approved','restrictedApproved','enabled']:card.locator('[data-field="'+key+'"]').check()
  page.locator('#hbTimeoutMs').fill('2000');page.locator('#hbHomeFloorUsd').fill('0.25');page.locator('#hbLessonFloorUsd').fill('0.10')
  page.locator('#adsApproved').check();page.locator('#adsEnabled').check();page.locator('#adSettingsForm button.primary').click();page.wait_for_function("() => document.querySelector('#message').textContent.includes('Advertising and auction settings saved')")
  saved=context.request.get(base+'/api/admin/overview').json()['settings'];assert saved['adsProvider']=='prebid' and saved['hbHomeFloorUsd']==0.25 and saved['hbTimeoutMs']==2000 and len(saved['hbPartners'])==6
  page.reload(wait_until='load');page.wait_for_selector('#hbFields:not([hidden])');assert page.locator('#hbTimeoutMs').input_value()=='2000';assert page.locator('[data-bidder="pubmatic"] [data-field="enabled"]').is_checked();assert '2 ready home' in page.locator('#auctionSummary').inner_text()
  page.locator('[data-bidder="ix"] [data-field="enabled"]').uncheck();page.locator('#adSettingsForm button.primary').click();page.wait_for_function("() => document.querySelector('#message').textContent.includes('at least two approved')");assert next(row for row in context.request.get(base+'/api/admin/overview').json()['settings']['hbPartners'] if row['code']=='ix')['enabled'] is True
  page.locator('[data-bidder="ix"] [data-field="enabled"]').check();page.screenshot(path=str(HERE/'ad-editor.png'),full_page=True);page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1');page.screenshot(path=str(HERE/'ad-editor-mobile.png'),full_page=True)
  mobile={'mobileAppId':'ca-app-pub-1234567890123456~1234567890','mobileBannerId':'ca-app-pub-1234567890123456/1234567890','mobileInterstitialId':'ca-app-pub-1234567890123456/2345678901'}
  for field,value in mobile.items():page.locator('#'+field).fill(value)
  page.locator('#mobileAdsEnabled').check();page.locator('#mobileAdSettingsForm button.primary').click();page.wait_for_function("() => document.querySelector('#message').textContent.includes('confirm Google account and app approval')")
  page.locator('#mobileAdsEnabled').uncheck();page.locator('#mobileAdSettingsForm button.primary').click();page.wait_for_function("() => document.querySelector('#message').textContent.includes('Android advertising settings saved')")
  mobile_saved=context.request.get(base+'/api/admin/overview').json()['settings'];assert all(mobile_saved[key]==value for key,value in mobile.items());assert not mobile_saved['mobileAdsEnabled'] and not mobile_saved['mobileAdsApproved'];assert mobile_saved['hbPartners']==saved['hbPartners']
  assert not sdk,sdk;assert not errors,errors;browser.close()
 result={'version':report['version'],'sixProviderControls':True,'settingsPersisted':True,'incompleteAuctionRejected':True,'androidControlsPersisted':True,'unapprovedAndroidServingRejected':True,'desktopAndMobileVerified':True,'ownerPreviewAdRequests':0,'productionSettingsChanged':False,'javascriptErrors':errors};(HERE/'ad-editor-verification.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8');print(json.dumps(result,indent=2))
finally:server.terminate();server.wait(timeout=10)
