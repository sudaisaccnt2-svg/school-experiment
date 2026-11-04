"""Read-only checks on the actual Cloudflare preview, using Chrome's normal browser connection."""
import hashlib
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright
HERE=Path(__file__).resolve().parent
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--report',type=Path,default=HERE.parent/'latest.json');parser.add_argument('--deployment-url');options=parser.parse_args()
report=json.loads(options.report.read_text(encoding='utf-8'))
release=Path(report['releaseDirectory'])
base='https://commerce-setup.asawera-chemistry.pages.dev'
with sync_playwright() as p:
    browser=p.chromium.launch(channel='chrome',headless=True)
    context=browser.new_context(viewport={'width':1180,'height':820})
    page=context.new_page();errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
    page.goto(base+'/owner-sign-in',wait_until='load',timeout=60000)
    page.wait_for_function("() => !document.querySelector('#ownerLoginStatus').textContent.includes('Checking')")
    assert 'needs to be connected' in page.locator('#ownerLoginStatus').inner_text()
    results=page.evaluate("""async () => {
      const out={};for(const path of ['/api/health','/api/session','/api/admin/overview','/api/admin/students','/api/admin/reports?kind=students','/api/owner-login','/ads.txt','/sw.js']){
        const response=await fetch(path,{cache:'no-store'});out[path]={status:response.status,cache:response.headers.get('Cache-Control'),text:await response.text()};
      }return out;
    }""")
    health=json.loads(results['/api/health']['text']);assert health['databaseReady'] and not health['accountsReady'] and not health['ownerAccessReady']
    session=json.loads(results['/api/session']['text']);assert session['user'] is None and not session['membership']['pro'];assert not session['config']['adsEnabled'] and session['config']['monthlyPaisa'] is None;assert not session['config']['website']['registrationsOpen']
    for path in ['/api/admin/overview','/api/admin/students','/api/admin/reports?kind=students']:assert results[path]['status']==401
    assert 'Advertising is not configured' in results['/ads.txt']['text']
    assert session['config']['adsProvider']=='adsense' and not session['config']['openBiddingReady']
    assert hashlib.sha256(results['/sw.js']['text'].encode()).hexdigest()==hashlib.sha256((release/'sw.js').read_bytes()).hexdigest()
    assert '"url": "control-room.html"' not in results['/sw.js']['text']
    for path in ['/control-room','/control-room.html']:
        response=page.goto(base+path,wait_until='load');page.wait_for_url('**/owner-sign-in');assert page.locator('#room').count()==0
        chain=response.request.redirected_from;assert chain is not None
        denied=chain.response();assert denied.status==302 and 'no-store' in denied.headers.get('cache-control','')
    assert not errors,errors
    page.screenshot(path=str(HERE/'live-owner-sign-in.png'))
    production=context.new_page();production.goto('https://asawera-chemistry.pages.dev/home',wait_until='load',timeout=60000)
    public=production.evaluate("""async () => {const out={};for(const path of ['/sw.js','/api/health','/api/session','/control-room']){const response=await fetch(path,{cache:'no-store'});out[path]={status:response.status,url:response.url,text:await response.text()};}return out;}""")
    production_unchanged=hashlib.sha256(public['/sw.js']['text'].encode()).hexdigest()==hashlib.sha256((HERE.parent/'releases/deb00aaf85dd/sw.js').read_bytes()).hexdigest()
    public_status={'unchangedFromOriginal':production_unchanged,'serviceWorkerHash':hashlib.sha256(public['/sw.js']['text'].encode()).hexdigest(),'privatePageRedirectsToOwnerSignIn':public['/control-room']['url'].endswith('/owner-sign-in'),'privatePageStatus':public['/control-room']['status'],'privatePageURL':public['/control-room']['url'],'healthStatus':public['/api/health']['status'],'sessionStatus':public['/api/session']['status'],'health':json.loads(public['/api/health']['text']) if public['/api/health']['status']==200 else None,'session':json.loads(public['/api/session']['text']) if public['/api/session']['status']==200 else None}
    assert public_status['privatePageRedirectsToOwnerSignIn'] and public_status['health']['databaseReady']
    assert not public_status['session']['config']['adsEnabled'] and not public_status['session']['config']['openBiddingReady']
    production.goto('https://asawera-chemistry.pages.dev/privacy',wait_until='load',timeout=60000);production.wait_for_function("() => document.querySelector('#advertisingStatus').textContent.includes('switched off')");assert production.locator('#denyAds').is_visible();production.locator('#denyAds').click();assert production.evaluate("localStorage.getItem('asawera.ads-choice')")=='deny'
    summary={'previewURL':base,'deploymentURL':options.deployment_url,'version':report['version'],'databaseReady':True,'ownerPageProtected':True,'adminAPIsProtected':True,'ownerAuthenticationConnected':False,'studentAuthenticationConnected':False,'adsActive':False,'purchasesActive':False,'productionUnchanged':production_unchanged,'productionStatus':public_status,'privatePageInOfflineCatalog':False,'javascriptErrors':errors}
    (HERE/'preview-verification.json').write_text(json.dumps(summary,indent=2),encoding='utf-8')
    print(json.dumps(summary,indent=2))
    browser.close()
