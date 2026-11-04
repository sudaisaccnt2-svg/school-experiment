"""Save real, public AdMob IDs while preserving every other business setting."""
import json,time
from pathlib import Path
from playwright.sync_api import sync_playwright
here=Path(__file__).resolve().parent
connection=json.loads((here.parents[2]/'android-app/admob-connection.json').read_text(encoding='utf-8'))
credentials=json.loads((here.parent/'private-migration/owner-login.json').read_text(encoding='utf-8'))
assert credentials['email']==connection['owner']=='sudaisaccnt3@gmail.com'
base=credentials['url'].removesuffix('/owner-sign-in');assert base=='https://asawera-chemistry-51y.pages.dev'
ids={'mobileAppId':connection['appId'],'mobileBannerId':connection['bannerId'],'mobileInterstitialId':connection['interstitialId']}
with sync_playwright() as p:
 browser=p.chromium.launch(channel='chrome',headless=True);context=browser.new_context();headers={'Origin':base}
 result=context.request.post(base+'/api/owner-password-login',headers=headers,data={'email':credentials['email'],'password':credentials['password']});assert result.status==200,result.status
 before=context.request.get(base+'/api/admin/overview').json()['settings']
 for field,value in ids.items():assert before.get(field,'') in ['',value],'Another app connection is already saved.'
 assert not before.get('mobileAdsEnabled') and not before.get('mobileAdsApproved'),'Preserve active app approval settings.'
 result=context.request.post(base+'/api/admin/settings',headers=headers,data={**before,**ids,'mobileAdsEnabled':False,'mobileAdsApproved':False});assert result.status==200,result.status
 after=context.request.get(base+'/api/admin/overview').json()['settings']
 assert all(after[key]==value for key,value in before.items() if key not in ids)
 assert all(after[key]==value for key,value in ids.items())
 sellers=context.request.get(base+'/app-ads.txt');assert sellers.status==200
 assert 'google.com, '+connection['publisherId']+', DIRECT, f08c47fec0942fa0' in sellers.text()
 context.request.post(base+'/api/logout',headers=headers,data={});browser.close()
(here/'admob-website-connection.json').write_text(json.dumps({'url':base,'owner':connection['owner'],**ids,'paidServing':False,'approvalClaimed':False,'otherBusinessSettingsPreserved':True,'appAdsTxtVerified':True,'recordedAtUTC':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())},indent=2)+'\n',encoding='utf-8')
print('Owner AdMob placements connected. app-ads.txt verified; web advertising, payments and pricing preserved. Paid app ads remain paused pending Google approval.')
