"""Prepare the owner's empty advertising connection for the requested multi-provider auction."""
import json,time
from pathlib import Path
from playwright.sync_api import sync_playwright
HERE=Path(__file__).resolve().parent
credentials=json.loads((HERE.parent/'private-migration/owner-login.json').read_text(encoding='utf-8'))
assert credentials['email']=='sudaisaccnt3@gmail.com'
base=credentials['url'].removesuffix('/owner-sign-in');assert base=='https://asawera-chemistry-51y.pages.dev'
with sync_playwright() as p:
 browser=p.chromium.launch(channel='chrome',headless=True);context=browser.new_context()
 headers={'Origin':base};login=context.request.post(base+'/api/owner-password-login',headers=headers,data={'email':credentials['email'],'password':credentials['password']});assert login.status==200
 response=context.request.get(base+'/api/admin/overview');assert response.status==200;before=response.json()['settings']
 configured=bool(before['publisherId'] or before['adSlot'] or before.get('gamNetworkCode') or before['adsEnabled'] or before['adsApproved'] or any(row.get('enabled') or row.get('approved') or row.get('homeId') or row.get('lessonId') for row in before.get('hbPartners',[])))
 if configured:
  result={'prepared':False,'existingProviderConfigurationPreserved':True,'reason':'An advertising connection already contains account identifiers or serving settings; left intact.'}
 else:
  partners=[]
  for code,fields in [('pubmatic',['publisherId','homeId','lessonId']),('rubicon',['accountId','siteId','homeId','lessonId']),('ix',['homeId','lessonId']),('openx',['delDomain','homeId','lessonId']),('sovrn',['homeId','lessonId']),('appnexus',['homeId','lessonId'])]:
   partners.append(dict(code=code,enabled=False,approved=False,restrictedApproved=False,sellers='',**{key:'' for key in fields}))
  payload={**before,'adsProvider':'prebid','adsEnabled':False,'adsApproved':False,'openBiddingReady':False,'hbTimeoutMs':1500,'hbHomeFloorUsd':0,'hbLessonFloorUsd':0,'hbPartners':partners}
  saved=context.request.post(base+'/api/admin/settings',headers=headers,data=payload);assert saved.status==200,saved.status
  after=context.request.get(base+'/api/admin/overview').json()['settings']
  assert after['adsProvider']=='prebid' and not after['adsEnabled'] and not after['adsApproved']
  assert all(after[key]==before[key] for key in ['monthlyPaisa','yearlyPaisa','manualPayments','paymentInstructions','ageTreatment'])
  result={'prepared':True,'mode':'prebid','providerConnections':6,'approvedProviders':0,'liveAdsActive':False,'timeoutMs':1500,'homeFloorUsd':0,'lessonFloorUsd':0,'paymentAndAudienceSettingsPreserved':True,'approvalRequiredBeforeServing':True}
 context.request.post(base+'/api/logout',headers=headers,data={});browser.close()
result.update(url=base,recordedAtUTC=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()))
(HERE/'provider-settings-preparation.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8');print(json.dumps(result,indent=2))
