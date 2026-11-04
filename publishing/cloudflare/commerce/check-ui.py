"""Verify account/control screens and zero ad-network requests for Pro using local fixtures only."""
import http.server
import argparse
import json
import threading
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

HERE=Path(__file__).resolve().parent
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--report',type=Path,default=HERE.parent/'latest.json');options=parser.parse_args()
report=json.loads(options.report.read_text(encoding='utf-8'))
release=Path(report['releaseDirectory'])
state={'mode':'owner'}
website={'siteTitle':'Asawera Science','contactEmail':'','announcement':'','registrationsOpen':True}
student={'id':'fixture-student','email':'student@example.com','created_at':1770000000000,'status':'active','student_name':'Test student','class_label':'Class 9','private_note':'','last_seen':1770000000000,'pro_until':0}
config={'accountsReady':True,'codesReady':True,'monthlyPaisa':29900,'yearlyPaisa':199900,'manualPayments':True,
        'paymentInstructions':'Test-only instructions','adsEnabled':True,'adsApproved':True,
        'publisherId':'ca-pub-1234567890123456','adSlot':'1234567890','ageTreatment':1,'adsLocationEligible':True,'website':website}

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*a,**kw):super().__init__(*a,directory=str(release),**kw)
    def do_GET(self):
        path=urlsplit(self.path).path
        if path in ('/control-room','/control-room.html'):
            if state['mode']!='owner':self.send_response(302);self.send_header('Location','/owner-sign-in');self.end_headers();return
            raw=(HERE/'control-room.html').read_bytes();self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Cache-Control','private, no-store');self.send_header('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'");self.end_headers();self.wfile.write(raw);return
        if path.startswith('/api/'):
            if path=='/api/session':
                if state['mode']=='unavailable':self.send_error(503);return
                owner=state['mode']=='owner';pro=state['mode'] in ('owner','pro')
                data={'user':{'email':'test@example.com','id':'test-user'},'membership':{'owner':owner,'pro':pro,'proUntil':None},'config':dict(config,adsLocationEligible=state['mode']!='outside-pk')}
            elif path=='/api/orders':data={'orders':[]}
            elif path=='/api/admin/overview':data={'settings':config,'website':website,'readiness':{'studentSignIn':True,'ownerAccess':False,'codes':True},'metrics':{'accounts':2,'students':1,'suspended':int(student['status']=='suspended'),'pro':0,'revenuePaisa':29900},'orders':[],'codes':[],'audit':[]}
            elif path=='/api/admin/students':data={'students':[student],'nextCursor':None}
            elif path=='/api/admin/pricing':data={'tiers':[{'id':'monthly','name':'Monthly Pro','description':'Ad-free Pro','days':30,'pricePaisa':config['monthlyPaisa'],'enabled':True,'sale':None}],'coupons':[]}
            elif path=='/api/admin/reports':data={'rows':[student],'nextCursor':None}
            elif path=='/api/owner-login':data={'ownerAccessReady':False,'accountsReady':True,'loginUrl':None}
            else:self.send_error(404);return
            raw=json.dumps(data).encode();self.send_response(200);self.send_header('Content-Type','application/json');self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(raw);return
        super().do_GET()
    def do_POST(self):
        data=json.loads(self.rfile.read(int(self.headers.get('Content-Length','0'))));path=urlsplit(self.path).path
        if path=='/api/quote':
            price=config['monthlyPaisa'] if data['plan']=='monthly' else config['yearlyPaisa'];raw=json.dumps({'plan':data['plan'],'planName':'Pro','days':30 if data['plan']=='monthly' else 365,'baseAmountPaisa':price,'amountPaisa':price,'discountPaisa':0,'discountLabel':'','couponCode':None}).encode();self.send_response(200);self.send_header('Content-Type','application/json');self.end_headers();self.wfile.write(raw);return
        if state['mode']!='owner':self.send_error(403);return
        if path=='/api/admin/website':website.update(data)
        elif path=='/api/admin/student':student.update(status=data['status'],student_name=data['name'],class_label=data['classLabel'],private_note=data['note'])
        elif path=='/api/admin/settings':config.update(data)
        elif path=='/api/logout':pass
        else:self.send_error(404);return
        raw=json.dumps({'ok':True}).encode();self.send_response(200);self.send_header('Content-Type','application/json');self.end_headers();self.wfile.write(raw)
    def translate_path(self,path):
        result=super().translate_path(path)
        if not Path(result).is_file() and Path(result+'.html').is_file():return result+'.html'
        return result
    def log_message(self,*_):pass

server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler)
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/'
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(channel='chrome',headless=True,args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        for mode in ['owner','pro','free','outside-pk','unavailable']:
            state['mode']=mode
            ctx=browser.new_context(viewport={'width':1180,'height':820})
            ctx.add_init_script("localStorage.setItem('asawera.ads-choice','allow');localStorage.setItem('pro','true');")
            attempted=[];errors=[]
            # Fulfill locally: no real AdSense script, ad auction or impression is requested.
            ctx.route('**/pagead2.googlesyndication.com/**',lambda route: (attempted.append(route.request.url),route.fulfill(status=200,content_type='text/javascript',body='// local fixture; no ad network')))
            page=ctx.new_page();page.on('pageerror',lambda error:errors.append(str(error)))
            page.goto(base+'home',wait_until='load');page.wait_for_selector('#memberLink');page.wait_for_timeout(300)
            if mode=='free':page.locator('#asaweraAd').scroll_into_view_if_needed();page.wait_for_selector('#asaweraAdScript',state='attached');page.wait_for_timeout(100)
            assert bool(attempted)==(mode=='free'),(mode,attempted)
            if mode in ('owner','pro'):assert 'Pro' in page.locator('#memberLink').inner_text()
            if mode=='free':assert page.locator('#asaweraAdScript').count()==1
            page.goto(base+'account',wait_until='load')
            if mode=='owner':
                page.wait_for_selector('#signedIn:not([hidden])');assert 'Owner' in page.locator('#status').inner_text();assert page.locator('#adminLink').is_visible()
                page.screenshot(path=str(HERE/'owner-account.png'))
                page.goto(base+'control-room',wait_until='load');page.wait_for_selector('#room:not([hidden])');page.wait_for_selector('#tierRows [data-field="pricePaisa"]',state='attached');assert page.locator('#tierRows [data-field="pricePaisa"]').input_value()=='299'
                page.screenshot(path=str(HERE/'control-room.png'))
                page.locator('.sidebar [data-tab="students"]').click();page.locator('#studentRows button').click();page.locator('#studentClass').fill('Class 10');page.locator('#studentStatus').select_option('suspended');page.locator('#studentForm button.primary').click();page.wait_for_function("() => document.querySelector('#message').textContent==='Student account updated.'");assert student['status']=='suspended';assert student['class_label']=='Class 10'
                page.locator('.sidebar [data-tab="website"]').click();page.locator('#announcement').fill('Local verification notice');page.locator('#websiteForm button').click();page.wait_for_function("() => document.querySelector('#message').textContent==='Website settings saved.'");assert website['announcement']=='Local verification notice'
                page.locator('.sidebar [data-tab="advertising"]').click();assert 'enabled' in page.locator('#adStatus').inner_text();assert page.locator('#adChecks').inner_text().find('ca-pub-1234567890123456')>=0
                page.locator('.sidebar [data-tab="records"]').click()
                with page.expect_download() as export:page.locator('#exportStudents').click()
                export.value.save_as(str(HERE/'test-students.csv'));assert 'student@example.com' in (HERE/'test-students.csv').read_text(encoding='utf-8-sig')
                page.set_viewport_size({'width':390,'height':844});page.locator('.sidebar [data-tab="students"]').click();assert page.locator('#studentSearch').is_visible();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
                page.screenshot(path=str(HERE/'control-room-mobile.png'))
            elif mode=='free':
                page.wait_for_selector('#signedIn:not([hidden])');assert 'Free' in page.locator('#status').inner_text();assert page.locator('#adminLink').is_hidden()
                page.screenshot(path=str(HERE/'account.png'))
                page.goto(base+'control-room',wait_until='load');page.wait_for_url('**/owner-sign-in');assert page.locator('#room').count()==0
            elif mode=='unavailable':page.wait_for_selector('#setup:not([hidden])')
            assert not errors,errors
            print('PASS:',mode,'account state; ad requests suppressed or enabled as expected',flush=True)
            ctx.close()
        browser.close()
finally:server.shutdown();server.server_close()
