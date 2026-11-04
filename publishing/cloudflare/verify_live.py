"""Check the actual published origin, its byte integrity, and a fresh offline reopen.
Usage: python publishing/cloudflare/verify_live.py https://asawera-chemistry.pages.dev
"""
import hashlib
import argparse
import json
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('url');parser.add_argument('--report',type=Path,default=HERE/'latest.json')
    options=parser.parse_args()
    base = options.url.rstrip('/') + '/'
    report = json.loads(options.report.read_text(encoding='utf-8'))
    release = Path(report['releaseDirectory'])
    results = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel='chrome', headless=True,
            args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
        context = browser.new_context(viewport={'width': 1180, 'height': 820})
        context.add_init_script("""const supports = DOMTokenList.prototype.supports;
          DOMTokenList.prototype.supports = function(token) {return token === 'ar' || supports.call(this, token);};""")
        errors = []
        context.on('page', lambda page: page.on('pageerror', lambda error: errors.append(str(error))))
        page = context.new_page()
        page.goto(base, wait_until='load', timeout=90000)
        page.wait_for_url('**/home', timeout=60000)
        page.wait_for_function("document.querySelector('#offlineBadge')?.dataset.shellReady === 'true'", timeout=180000)
        assert page.locator('#cards .card').count() >= 3
        names = ['sw.js', 'offline.js', 'app.js', 'films.json', 'manifest.webmanifest']
        live = page.evaluate("""async names => {
          const results = [];
          for (const name of names) {
            const response = await fetch('/' + name);
            const bytes = await response.arrayBuffer();
            const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
            results.push({name,status:response.status,hash:Array.from(hash).map(b => b.toString(16).padStart(2,'0')).join('')});
          }
          return results;
        }""", names)
        for item in live:
            assert item['status'] == 200 and item['hash'] == hashlib.sha256((release / item['name']).read_bytes()).hexdigest(), item
            results.append('Published bytes match: ' + item['name'])
        print('PASS: published worker, app, catalog and manifest match the tested release', flush=True)
        results.append('Home opens; small app installed on actual Cloudflare origin')
        print('PASS: public homepage and small app installation', flush=True)

        page.goto(base + 'index.html?film=02&frame=300&test=1', wait_until='load', timeout=60000)
        page.wait_for_function("document.querySelector('#loading').classList.contains('done')", timeout=120000)
        page.wait_for_function("document.querySelector('#arBtn').href.startsWith('blob:')", timeout=90000)
        assert not page.locator('#error').is_visible(), page.locator('#error').inner_text()
        ar = page.evaluate("""async () => {
          const response = await fetch(document.querySelector('#arBtn').href);
          return {type:response.headers.get('Content-Type'), size:(await response.arrayBuffer()).byteLength};
        }""")
        assert ar['type'] == 'model/vnd.usdz+zip' and ar['size'] > 1000
        results.append('Published 3D film renders and native AR data is available as a local USDZ blob')
        print('PASS: published 3D film and locally saved AR data', flush=True)

        context.set_offline(True)
        page.close(); page = context.new_page()
        page.goto(base + '?film=02&frame=300&test=1', wait_until='load', timeout=60000)
        page.wait_for_function("document.querySelector('#loading').classList.contains('done')", timeout=90000)
        page.wait_for_function("document.querySelector('#arBtn').href.startsWith('blob:')", timeout=30000)
        page.screenshot(path=str(HERE / 'live-offline.png'))
        page.goto(base + 'home', wait_until='load', timeout=30000)
        assert page.locator('#cards .card').count() >= 3
        page.goto(base + 'games?unit=2', wait_until='load', timeout=30000)
        page.wait_for_selector('#hub:not([hidden])', timeout=30000)
        assert page.locator('#cards').inner_text().strip()
        results.append('Fresh offline page reopens saved film, AR, home and game menu')
        print('PASS: fresh offline reopen of the live website, AR files and games menu', flush=True)

        context.set_offline(False)
        page.goto(base + 'lesson/index.html?id=803&t=7', wait_until='load', timeout=60000)
        page.wait_for_selector('canvas', timeout=60000)
        assert page.locator('#scrub').get_attribute('max') != '0'
        results.append('Nested code lesson opens through actual Pages HTML redirect')
        assert not errors, errors
        print('PASS: nested code lesson; no JavaScript errors', flush=True)
        browser.close()
    receipt = {'url': base, 'releaseVersion': report['version'], 'verifiedAtUTC': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
               'checks': results, 'nativeARCameraVerified': False}
    (HERE / 'live-verification.json').write_text(json.dumps(receipt, indent=2), encoding='utf-8')


if __name__ == '__main__':
    main()
