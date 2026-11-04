"""Connect real Google publisher/slot IDs using the private owner API; never claims Google approval."""
import argparse,json,re,time,uuid
from pathlib import Path
from playwright.sync_api import sync_playwright
HERE=Path(__file__).resolve().parent
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--publisher',required=True);parser.add_argument('--slot');parser.add_argument('--select-adsense',action='store_true');args=parser.parse_args()
assert re.fullmatch(r'ca-pub-\d{16}',args.publisher)
assert args.slot is None or re.fullmatch(r'\d+',args.slot)
credentials=json.loads((HERE.parent/'private-migration/owner-login.json').read_text(encoding='utf-8'));assert credentials['email']=='sudaisaccnt3@gmail.com'
base=credentials['url'].removesuffix('/owner-sign-in');assert base=='https://asawera-chemistry-51y.pages.dev'
with sync_playwright() as p:
 browser=p.chromium.launch(channel='chrome',headless=True);context=browser.new_context();headers={'Origin':base}
 login=context.request.post(base+'/api/owner-password-login',headers=headers,data={'email':credentials['email'],'password':credentials['password']});assert login.status==200,login.status
 response=context.request.get(base+'/api/admin/overview');assert response.status==200;before=response.json()['settings']
 assert before['publisherId'] in ['',args.publisher],'Another publisher is already connected; leave it intact.'
 payload={**before,'publisherId':args.publisher}
 if args.slot:
  assert before['adSlot'] in ['',args.slot],'Another display slot is already connected; leave it intact.'
  payload['adSlot']=args.slot
 if args.select_adsense:
  assert not before['adsEnabled'] and not before['adsApproved'],'Preserve active provider configuration.'
  payload.update(adsProvider='adsense',openBiddingReady=False)
 saved=context.request.post(base+'/api/admin/settings',headers=headers,data=payload);assert saved.status==200,saved.status
 after=context.request.get(base+'/api/admin/overview').json()['settings'];assert after['publisherId']==args.publisher
 assert all(after[key]==before[key] for key in ['monthlyPaisa','yearlyPaisa','manualPayments','paymentInstructions','ageTreatment','adsEnabled','adsApproved','hbPartners'])
 text=context.request.get(base+'/ads.txt?verify='+uuid.uuid4().hex);assert text.status==200
 expected='google.com, '+args.publisher.replace('ca-','')+', DIRECT, f08c47fec0942fa0';assert expected in text.text()
 result={'url':base,'ownerEmail':credentials['email'],'publisherId':args.publisher,'publisherConnected':True,'displaySlot':after['adSlot'] or None,'advertisingMode':after['adsProvider'],'adsTxtVerified':True,'adsEnabled':after['adsEnabled'],'approvalClaimed':after['adsApproved'],'paymentPricingAndPartnerSettingsPreserved':True,'recordedAtUTC':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
 context.request.post(base+'/api/logout',headers=headers,data={});browser.close()
(HERE/'google-publisher-connection.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print('Real Google publisher connected; live ads.txt verified. Payment, pricing and provider settings preserved. Site approval is still required.')
