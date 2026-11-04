"""Verify signup, recovery, Pro and owner controls against real isolated student-auth handlers."""
import argparse,json,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
here=Path(__file__).resolve().parent
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--report',type=Path,required=True);args=parser.parse_args()
report=json.loads(args.report.read_text(encoding='utf-8'))
server=subprocess.Popen(['C:/Program Files/nodejs/node.exe',str(here/'student-fixture.mjs'),report['releaseDirectory']],stdout=subprocess.PIPE,stderr=subprocess.DEVNULL,text=True,encoding='utf-8')
base=json.loads(server.stdout.readline())['url']
try:
  with sync_playwright() as p:
    browser=p.chromium.launch(channel='chrome',headless=True)
    context=browser.new_context(viewport={'width':390,'height':844},accept_downloads=True);page=context.new_page();errors=[];paid=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    for domain in ['googlesyndication.com','doubleclick.net','admob.com']:
      context.route('**/*'+domain+'/**',lambda route:(paid.append(route.request.url),route.abort()))
    page.goto(base+'/account');page.wait_for_selector('#signIn:not([hidden])');assert page.locator('#email').get_attribute('type')=='text'
    page.locator('#email').fill('ui_learner');page.locator('#password').fill('Four unusual words for school 731!');page.locator('#signup').click()
    try:page.wait_for_selector('#saveRecovery:not([hidden])',timeout=10000)
    except Exception:
      print(json.dumps({'fixtureMessage':page.locator('#message').inner_text(),'javascriptErrors':errors,'validity':page.locator('#authForm').evaluate("form=>Array.from(form.elements).filter(el=>el.validity).map(el=>({id:el.id,valid:el.validity.valid,message:el.validationMessage}))")},indent=2));raise
    recovery=page.locator('#savedRecoveryCode').input_value();assert recovery.startswith('ASR-')
    assert page.locator('#continueAccount').is_disabled()
    with page.expect_download() as pending:page.locator('#downloadRecovery').click()
    downloaded=pending.value;assert downloaded.suggested_filename=='asawera-recovery-ui_learner.txt'
    page.locator('#recoverySaved').check();page.locator('#continueAccount').click();page.wait_for_selector('#signedIn:not([hidden])')
    assert 'Free account' in page.locator('#status').inner_text();assert page.locator('#identity').inner_text()=='ui_learner';assert page.locator('#adminLink').is_hidden()
    page.goto(base+'/control-room');page.wait_for_url('**/owner-sign-in')
    context.request.post(base+'/__test__/mode',data={'mode':'owner'});page.goto(base+'/control-room');page.wait_for_selector('#room:not([hidden])')
    page.locator('aside [data-tab="students"]').click();page.wait_for_selector('#studentRows button');assert 'ui_learner' in page.locator('#studentRows').inner_text()
    page.locator('#studentRows button').click();page.locator('#studentClass').fill('Class 9');page.locator('#studentForm button.primary').click();page.wait_for_function("() => document.querySelector('#message').textContent==='Student account updated.'")
    page.locator('aside [data-tab="payments"]').click();page.locator('#memberEmail').fill('ui_learner');page.locator('#membershipForm button').click();page.wait_for_function("() => document.querySelector('#message').textContent==='Pro access updated.'")
    context.request.post(base+'/__test__/mode',data={'mode':'student'});page.goto(base+'/account');page.wait_for_selector('#signedIn:not([hidden])');assert 'Pro' in page.locator('#status').inner_text()
    page.locator('#logout').click();page.wait_for_selector('#signIn:not([hidden])');page.locator('#reset').click();page.locator('#recoveryUsername').fill('ui_learner');page.locator('#studentRecoveryCode').fill(recovery);page.locator('#recoveryPassword').fill('A new private school phrase 829!');page.locator('#studentRecoveryForm button').click();page.wait_for_selector('#saveRecovery:not([hidden])')
    assert page.locator('#savedRecoveryCode').input_value()!=recovery;page.locator('#recoverySaved').check();page.locator('#continueAccount').click();page.wait_for_selector('#signedIn:not([hidden])');assert 'Pro' in page.locator('#status').inner_text()
    page.locator('#changeStudentPassword').click();page.locator('#currentStudentPassword').fill('A new private school phrase 829!');page.locator('#nextStudentPassword').fill('Another private student phrase 391!');page.locator('#studentPasswordForm button').click();page.wait_for_selector('#saveRecovery:not([hidden])');page.locator('#recoverySaved').check();page.locator('#continueAccount').click();page.wait_for_selector('#signedIn:not([hidden])')

    context.request.post(base+'/__test__/mode',data={'mode':'owner'})
    settings=context.request.get(base+'/api/admin/overview').json()['settings']
    context.request.post(base+'/api/admin/settings',headers={'Origin':base},data={**settings,'monthlyPaisa':150000,'yearlyPaisa':890000,'manualPayments':True,'paymentInstructions':'Fixture-only bank instructions'})
    context.request.post(base+'/__test__/mode',data={'mode':'student'})
    page.goto(base+'/account?channel=google-play');page.wait_for_selector('#signedIn:not([hidden])')
    assert page.locator('#proPurchasePanel').is_hidden() and page.locator('#purchaseForm').is_hidden()
    page.locator('#showDeleteAccount').click();page.locator('#deletePassword').fill('incorrect');page.locator('#deleteUsername').fill('ui_learner');page.locator('#deleteSubscriptionConfirmed').check();page.locator('#deleteAccountForm button.primary').click()
    page.wait_for_function("() => document.querySelector('#message').textContent.includes('password is incorrect')")
    page.locator('#deletePassword').fill('Another private student phrase 391!');page.locator('#deleteAccountForm button.primary').click();page.wait_for_url('**/delete-account?deleted=1')
    assert context.request.get(base+'/api/session').json()['user'] is None
    assert context.request.post(base+'/api/login',headers={'Origin':base},data={'username':'ui_learner','password':'Another private student phrase 391!'}).status==401
    created=context.request.post(base+'/api/signup',headers={'Origin':base},data={'username':'external_learner','password':'External private student phrase 927!'})
    assert created.status==200;context.request.post(base+'/api/logout',headers={'Origin':base},data={})
    page.goto(base+'/delete-account');page.locator('#externalDeleteUsername').fill('external_learner');page.locator('#externalDeletePassword').fill('External private student phrase 927!');page.locator('#externalDeleteConfirmed').check();page.locator('#externalDeleteForm button').click()
    page.wait_for_function("() => document.querySelector('#externalDeleteForm').hidden")
    assert 'have been deleted' in page.locator('#message').inner_text()
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1');assert not errors,errors;assert not paid,paid
    result={'version':report['version'],'accountDeletionVerified':True,'externalDeletionVerified':True,'playViewHidesBankCheckout':True,'signupAndSecureSessionVerified':True,'recoveryDownloadVerified':True,'recoveryAndPasswordChangeVerified':True,'studentCannotAccessOwnerDashboard':True,'ownerStudentAndProControlsVerified':True,'mobileLayoutVerified':True,'realPaidRequests':0,'javascriptErrors':errors}
    (here/'student-ui-verification.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8');print(json.dumps(result,indent=2));browser.close()
finally:
  server.terminate();server.wait(timeout=10)
