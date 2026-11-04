"""Exercise the pricing editor and checkout against the real API with a private local SQLite fixture."""
import argparse,json,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
HERE=Path(__file__).resolve().parent
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--report',type=Path,required=True);options=parser.parse_args()
report=json.loads(options.report.read_text(encoding='utf-8'))
server=subprocess.Popen(['C:/Program Files/nodejs/node.exe',str(HERE/'pricing-fixture.mjs'),report['releaseDirectory']],stdout=subprocess.PIPE,stderr=subprocess.DEVNULL,text=True,encoding='utf-8')
base=json.loads(server.stdout.readline())['url']
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(channel='chrome',headless=True);context=browser.new_context(viewport={'width':1280,'height':900},timezone_id='Asia/Karachi');page=context.new_page();errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
        # Never make real advertising requests during a test.
        context.route('**/*googlesyndication.com/**',lambda route:route.abort());context.route('**/*doubleclick.net/**',lambda route:route.abort())
        page.goto(base+'/control-room',wait_until='load');page.wait_for_selector('#room:not([hidden])');page.locator('aside [data-tab="pricing"]').click();page.wait_for_function("() => !document.querySelector('#pricingEditorStatus').textContent.includes('Loading')")
        page.locator('#addTier').click();row=page.locator('#tierRows > section').nth(0)
        row.locator('[data-field="name"]').fill('Classroom monthly');row.locator('[data-field="pricePaisa"]').fill('499.50');row.locator('[data-field="days"]').fill('30');row.locator('summary').click();row.locator('[data-field="type"]').select_option('percent');row.locator('[data-field="value"]').fill('20')
        page.locator('#addTier').click();term=page.locator('#tierRows > section').nth(1);term.locator('[data-field="name"]').fill('Term Pro');term.locator('[data-field="pricePaisa"]').fill('1200.25');term.locator('[data-field="days"]').fill('90')
        page.locator('#addCoupon').click();coupon=page.locator('#couponRows > section').nth(0);coupon.locator('[data-field="code"]').fill('SCHOOL25');coupon.locator('[data-field="value"]').fill('25');coupon.locator('[data-field="maxUses"]').fill('10');coupon.locator('[data-field="perUserLimit"]').fill('1')
        page.locator('#addCoupon').click();fixed=page.locator('#couponRows > section').nth(1);fixed.locator('[data-field="code"]').fill('TERM200');fixed.locator('[data-field="type"]').select_option('fixed');fixed.locator('[data-field="value"]').fill('200');fixed.locator('[data-field="minPaisa"]').fill('1000');term_id=term.get_attribute('data-id');fixed.locator('[data-field="tierIds"]').select_option([term_id])
        assert '399.60' in page.locator('#pricingPreview').inner_text(),{'preview':page.locator('#pricingPreview').inner_text(),'errors':errors}
        term.locator('.editor-heading button').last.click();assert page.locator('#tierRows > section').count()==2;assert 'assigned to this tier' in page.locator('#message').inner_text()
        page.locator('#savePricing').click();page.wait_for_function("() => document.querySelector('#message').textContent.startsWith('Pricing tiers and discounts saved')")
        saved=context.request.get(base+'/api/admin/pricing').json();assert saved['tiers'][0]['pricePaisa']==49950;assert saved['coupons'][1]['value']==20000 and saved['coupons'][1]['tierIds']==[term_id]
        page.reload(wait_until='load');page.locator('aside [data-tab="pricing"]').click();page.wait_for_selector('#tierRows > section');assert page.locator('#tierRows [data-field="pricePaisa"]').first.input_value()=='499.5'
        page.screenshot(path=str(HERE/'pricing-editor.png'),full_page=True)
        page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1');page.screenshot(path=str(HERE/'pricing-editor-mobile.png'),full_page=True);page.set_viewport_size({'width':1280,'height':900})
        page.locator('aside [data-tab="payments"]').click();page.locator('#paymentInstructions').fill('Local fixture only. Do not transfer money.');page.locator('#manualPayments').check();page.locator('#paymentSettingsForm button.primary').click();page.wait_for_function("() => document.querySelector('#message').textContent==='Purchase settings saved.'")
        context.request.post(base+'/__test__/mode',data={'mode':'student'});page.goto(base+'/account',wait_until='load');page.wait_for_function("() => document.querySelector('#quoteSummary').textContent.includes('399.60')");assert page.locator('#customerTiers article').count()==2
        assert 'SCHOOL25' not in json.dumps(context.request.get(base+'/api/pricing').json())
        page.locator('#coupon').fill('school25');page.locator('#applyCoupon').click();page.wait_for_function("() => document.querySelector('#quoteSummary').textContent.includes('374.63')")
        page.locator('#purchaseForm button.primary').click();page.wait_for_selector('#order:not([hidden])');assert '374.63' in page.locator('#orderAmount').inner_text()
        order=context.request.get(base+'/api/orders').json()['orders'][0];assert order['amount_paisa']==37463 and order['discount_paisa']==12487 and order['days']==30 and order['coupon_code']=='SCHOOL25'
        page.screenshot(path=str(HERE/'pricing-checkout.png'),full_page=True)
        page.reload(wait_until='load');page.wait_for_selector('#orders button');page.locator('#orders button',has_text='Cancel unpaid order').click();page.wait_for_function("() => document.querySelector('#orders').textContent.includes('cancelled')")
        page.locator('#plan').select_option(term_id);page.wait_for_function("() => document.querySelector('#quoteSummary').textContent.includes('1,200.25')");page.locator('#coupon').fill('TERM200');page.locator('#applyCoupon').click();page.wait_for_function("() => document.querySelector('#quoteSummary').textContent.includes('1,000.25')")
        page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1');page.screenshot(path=str(HERE/'pricing-checkout-mobile.png'),full_page=True)
        assert not errors,errors
        result={'version':report['version'],'ownerEditorPersistsTiersAndCoupons':True,'percentAndFixedDiscountsVerified':True,'customerQuoteAndOrderVerified':True,'unpaidCancellationVerified':True,'mobileLayoutsVerified':True,'realPaymentRequests':0,'javascriptErrors':errors}
        (HERE/'pricing-ui-verification.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8');print(json.dumps(result,indent=2));browser.close()
finally:
    server.terminate();server.wait(timeout=10)
