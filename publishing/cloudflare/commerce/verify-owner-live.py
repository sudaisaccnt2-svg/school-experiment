"""Verify the real private owner login. Never print passwords or session tokens."""
import argparse,json,time
from pathlib import Path
from playwright.sync_api import sync_playwright
HERE=Path(__file__).resolve().parent
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--report',type=Path,required=True);options=parser.parse_args()
report=json.loads(options.report.read_text(encoding='utf-8'))
credentials=json.loads((HERE.parent/'private-migration/owner-login.json').read_text(encoding='utf-8'))
base=credentials['url'].removesuffix('/owner-sign-in')
with sync_playwright() as p:
    browser=p.chromium.launch(channel='chrome',headless=True)
    context=browser.new_context(viewport={'width':1180,'height':820})
    page=context.new_page();errors=[];ad_requests=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.on('request',lambda request:ad_requests.append(request.url) if any(host in request.url for host in ['googlesyndication.com','securepubads.g.doubleclick.net']) else None)
    page.goto(base+'/control-room',wait_until='load',timeout=60000);page.wait_for_url('**/owner-sign-in')
    page.wait_for_selector('#ownerPasswordForm:not([hidden])');assert page.locator('#room').count()==0
    assert context.request.get(base+'/api/admin/overview').status==401
    assert context.request.get(base+'/api/admin/pricing').status==401
    private=context.request.get(base+'/control-room',max_redirects=0);assert private.status==302 and 'no-store' in private.headers.get('cache-control','')
    assert context.request.post(base+'/api/owner-password-login',headers={'Origin':'https://invalid.example'},data={'email':credentials['email'],'password':'incorrect'}).status==403
    page.locator('#ownerEmail').fill(credentials['email']);page.locator('#ownerPassword').fill(credentials['password'])
    page.locator('#ownerPasswordSubmit').click();page.wait_for_url('**/control-room',timeout=60000)
    page.wait_for_selector('#room:not([hidden])',timeout=60000)
    state=context.request.get(base+'/api/session').json();assert state['user']['email']==credentials['email'] and state['membership']['owner'] and state['membership']['pro']
    owner_cookie=next(item for item in context.cookies() if item['name']=='__Host-asawera_owner');assert owner_cookie['httpOnly'] and owner_cookie['secure'] and owner_cookie['sameSite']=='Strict'
    assert context.request.get(base+'/api/admin/overview').status==200
    assert context.request.get(base+'/api/admin/students').status==200
    assert context.request.get(base+'/api/admin/reports?kind=students').status==200
    assert context.request.get(base+'/api/admin/pricing').status==200
    page.screenshot(path=str(HERE/'live-owner-dashboard.png'))
    for tab in ['students','pricing','payments','advertising','website','records']:
        page.locator('aside [data-tab="'+tab+'"]').click();page.wait_for_selector('[data-section="'+tab+'"]:not([hidden])')
        if tab=='pricing':
            page.wait_for_function("() => !document.querySelector('#pricingEditorStatus').textContent.includes('Loading')")
            assert page.locator('#addTier').is_visible() and page.locator('#addCoupon').is_visible()
            assert 'chosen duration' in page.locator('#pricingEditorStatus').inner_text()
        if tab=='advertising':
            assert page.locator('#adDiagnostics').is_visible()
            assert page.locator('#bidderRows article').count()==6
            page.locator('#previewAdPlacement').click();assert page.locator('#adPlacementPreview').is_visible()
            page.locator('#adsProvider').select_option('prebid');assert page.locator('#hbFields').is_visible()
            assert page.locator('#hbTimeoutMs').is_visible() and page.locator('#hbHomeFloorUsd').is_visible()
    page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
    page.screenshot(path=str(HERE/'live-owner-dashboard-mobile.png'))
    page.goto(base+'/home',wait_until='load',timeout=60000);page.wait_for_function("document.querySelector('#memberLink')?.textContent.includes('Owner')")
    assert not ad_requests
    # A deliberately malformed owner cookie cannot render private HTML in another browser context.
    attacker=browser.new_context();attacker.add_cookies([{'name':'__Host-asawera_owner','value':'A'*43,'url':base,'secure':True,'httpOnly':True,'sameSite':'Strict'}])
    assert attacker.request.get(base+'/api/admin/overview').status==401;assert attacker.request.get(base+'/api/admin/pricing').status==401;attacker.close()
    logout=context.request.post(base+'/api/logout',headers={'Origin':base},data={});assert logout.status==200
    assert context.request.get(base+'/api/admin/overview').status==401
    assert not errors,errors
    assert credentials['password'] not in json.dumps(state)
    result={'url':base,'version':report['version'],'ownerEmail':credentials['email'],'ownerLoginVerified':True,'anonymousAndForgedSessionsDenied':True,'logoutRevokesSession':True,'ownerIsAdFreePro':True,'dashboardTabsVerified':True,'mobileDashboardVerified':True,'adNetworkRequests':len(ad_requests),'javascriptErrors':errors,'checkedAtUTC':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
    (HERE/'owner-live-verification.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(result,indent=2));browser.close()
