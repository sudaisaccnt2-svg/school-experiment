"""Test a prepared snapshot with Pages-style routes, on-demand loading, offline AR, and full saves.
Run: python publishing/cloudflare/check.py
Only uses an isolated local server and browser profile; never edits web/.
"""
import base64
import argparse
import hashlib
import http.server
import json
import re
import sys
import threading
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--report',type=Path,default=HERE/'latest.json')
    options=parser.parse_args()
    report = json.loads(options.report.read_text(encoding='utf-8'))
    release = Path(report['releaseDirectory'])
    sw = (release / 'sw.js').read_text(encoding='utf-8')
    catalog = json.loads(re.search(r'const CATALOG = (\[.*?\]);', sw, re.S).group(1))
    for asset in catalog:
        rel = urlsplit(asset['url']).path
        content = (release / rel).read_bytes()
        assert len(content) == asset['size'], rel
        assert hashlib.sha256(content).hexdigest() == asset['hash'], rel
    assert not list(release.rglob('*.key')) and not list(release.rglob('*.crt'))
    assert not (release / 'serve.py').exists() and not (release / 'start.html').exists()
    assert not (release / 'functions').exists() and not (release / '_worker.js').exists()
    requests, blocked, overrides = [], set(), {}

    class Handler(http.server.SimpleHTTPRequestHandler):
        extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, '.js': 'text/javascript',
                          '.usdz': 'model/vnd.usdz+zip', '.glb': 'model/gltf-binary',
                          '.wasm': 'application/wasm', '.hdr': 'application/octet-stream'}

        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(release), **kwargs)

        def do_GET(self):
            split = urlsplit(self.path)
            path = split.path
            requests.append(path)
            if path in blocked:
                self.send_error(503)
                return
            if path in overrides:
                content = overrides[path]
                self.send_response(200)
                self.send_header('Content-Type', 'text/javascript')
                self.send_header('Content-Length', str(len(content)))
                self.end_headers(); self.wfile.write(content)
                return
            if path.endswith('.html'):
                canonical = path[:-len('index.html')] if path.endswith('/index.html') else path[:-5]
                self.send_response(302)
                self.send_header('Location', urlunsplit(('', '', canonical, split.query, '')))
                self.end_headers()
                return
            if not path.endswith('/') and (release / path.lstrip('/') / 'index.html').is_file():
                self.send_response(302)
                self.send_header('Location', urlunsplit(('', '', path + '/', split.query, '')))
                self.end_headers()
                return
            super().do_GET()

        def translate_path(self, path):
            candidate = super().translate_path(path)
            if not Path(candidate).is_file() and Path(candidate + '.html').is_file():
                return candidate + '.html'
            return candidate

        def end_headers(self):
            self.send_header('Cache-Control', 'no-cache')
            super().end_headers()

        def log_message(self, *_):
            pass

    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}/'
    checks = []

    def passed(message):
        checks.append(message)
        print('PASS:', message, flush=True)

    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(channel='chrome', headless=True,
                args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
            context = browser.new_context(viewport={'width': 1180, 'height': 820})
            # Only feature support is simulated; the native Quick Look camera needs a real iPad.
            context.add_init_script("""const supports = DOMTokenList.prototype.supports;
              DOMTokenList.prototype.supports = function(token) { return token === 'ar' || supports.call(this, token); };""")
            errors = []
            context.on('page', lambda page: page.on('pageerror', lambda error: errors.append(str(error))))
            page = context.new_page()
            page.goto(base, wait_until='load')
            page.wait_for_url('**/home')
            page.wait_for_function("document.querySelector('#offlineBadge')?.dataset.shellReady === 'true'", timeout=90000)
            assert page.locator('#cards .card').count() >= 3
            assert not any(path.endswith(('.glb', '.hdr', '.usdz')) for path in requests), requests
            assert page.locator('#offlineBadge').get_attribute('data-ready') == 'false'
            passed('Pages-style home route opens; no model, AR or lighting downloads on home')

            page.goto(base + 'index.html?film=01&test=1', wait_until='load')
            page.wait_for_function("document.querySelector('#loading').classList.contains('done')", timeout=90000)
            page.wait_for_function("document.querySelector('#arBtn').href.startsWith('blob:')", timeout=60000)
            assert not page.locator('#error').is_visible(), page.locator('#error').inner_text()
            ar = page.evaluate("""async () => {
              const r = await fetch(document.querySelector('#arBtn').href);
              return {type:r.headers.get('Content-Type'), size:(await r.arrayBuffer()).byteLength};
            }""")
            assert ar['type'] == 'model/vnd.usdz+zip' and ar['size'] > 100000
            assert page.locator('#arBtn').get_attribute('download').endswith('.usdz')
            assert '/models/02.glb' not in requests and '/ar/02.usdz' not in requests
            passed('A selected film renders and its AR opens from a local blob; unopened film stays unloaded')

            context.set_offline(True)
            page.close(); page = context.new_page()
            page.goto(base + '?film=01&test=1', wait_until='load')
            page.wait_for_function("document.querySelector('#loading').classList.contains('done')", timeout=90000)
            page.wait_for_function("document.querySelector('#arBtn').href.startsWith('blob:')", timeout=30000)
            page.locator('#playBtn').click()
            page.wait_for_function("document.querySelector('#scrub').value !== '1'")
            page.locator('#playBtn').click()
            page.goto(base + 'home', wait_until='load')
            page.wait_for_function("document.querySelectorAll('#cards .card').length >= 3", timeout=30000)
            assert page.locator('#cards .card').count() >= 3
            page.goto(base + 'games?unit=2', wait_until='load')
            page.wait_for_selector('#hub:not([hidden])', timeout=30000)
            assert page.locator('#cards').inner_text().strip()
            passed('Saved film, AR, canonical home and game menu reopen with the network disabled')

            missing = page.evaluate("""async () => {
              const response = await fetch('models/02.glb');
              return {status:response.status,text:await response.text()};
            }""")
            assert missing['status'] == 503 and 'Reconnect' in missing['text']
            passed('An unopened lesson reports that it needs a connection instead of a false offline badge')

            context.set_offline(False)
            page.goto(base + 'home', wait_until='load')
            page.wait_for_function("document.querySelector('#offlineBadge')?.dataset.shellReady === 'true'")
            blocked.add('/ar/experiment.usdz')
            # Use an asset not already saved, so interruption happens before the full save finishes.
            first_missing = next(asset for asset in catalog if not asset['core'] and asset['url'].startswith('ar/02.'))
            blocked.clear(); blocked.add('/' + first_missing['url'])
            page.locator('#saveAllOffline').click()
            page.wait_for_function("document.querySelector('#saveAllOffline').disabled === false && document.querySelector('#saveAllOffline').textContent.includes('Resume')", timeout=60000)
            assert page.locator('#offlineBadge').get_attribute('data-ready') == 'false'
            blocked.clear()
            page.locator('#saveAllOffline').click()
            page.wait_for_function("document.querySelector('#offlineBadge').dataset.ready === 'true'", timeout=180000)
            passed('Save all pauses on a failed download, resumes, and reports ready only when every file is saved')

            context.set_offline(True)
            hashes = page.evaluate("""async assets => {
              for (const asset of assets) {
                const response = await fetch('/' + asset.url);
                if (!response.ok) return 'failed: ' + asset.url;
                const bytes = await response.arrayBuffer();
                const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
                if ('sha256-' + btoa(String.fromCharCode(...hash)) !== asset.integrity) return 'wrong bytes: ' + asset.url;
              }
              return 'all match';
            }""", catalog)
            assert hashes == 'all match', hashes
            page.goto(base + 'lesson/?id=803&t=7', wait_until='load')
            page.wait_for_selector('canvas', timeout=30000)
            assert page.locator('#scrub').get_attribute('max') != '0'
            page.wait_for_function("document.querySelector('#offlineBadge')?.dataset.ready === 'true'")
            passed('Full library byte hashes match offline; nested code lesson route also opens offline')

            # A code update must not redownload previously saved, unchanged models.
            context.set_offline(False)
            update_version = 'asawera-test-update'
            overrides['/sw.js'] = sw.replace("'asawera-" + report['version'] + "'", "'" + update_version + "'").encode('utf-8')
            before_binary = sum(path.endswith(('.glb', '.hdr', '.usdz')) for path in requests)
            page.evaluate("navigator.serviceWorker.getRegistration().then(reg => reg.update())")
            page.wait_for_function("document.querySelector('#offlineBadge')?.dataset.version === 'asawera-test-update'", timeout=90000)
            after_binary = sum(path.endswith(('.glb', '.hdr', '.usdz')) for path in requests)
            assert before_binary == after_binary
            context.set_offline(True)
            page.goto(base + '?film=02&frame=300&test=1', wait_until='load')
            page.wait_for_function("document.querySelector('#loading').classList.contains('done')", timeout=90000)
            page.wait_for_function("document.querySelector('#scrub').value === '300'")
            page.wait_for_timeout(500)
            passed('Code updates preserve downloaded models and AR without another full-library download')
            assert not errors, errors
            page.screenshot(path=str(HERE / 'releases' / (report['version'] + '-verified.png')))
            browser.close()
        report['browserTests'] = 'passed'
        report['checks'] = checks
        report['nativeARCameraVerified'] = False
        # Other agents may create a release while this test is running. Never overwrite their pointer.
        if options.report.resolve() != (HERE/'latest.json').resolve() or json.loads((HERE/'latest.json').read_text(encoding='utf-8'))['version']==report['version']:
            options.report.write_text(json.dumps(report, indent=2), encoding='utf-8')
        (HERE / 'releases' / (report['version'] + '.json')).write_text(json.dumps(report, indent=2), encoding='utf-8')
        passed('No JavaScript errors; publishing snapshot verified')
    finally:
        server.shutdown(); server.server_close()


if __name__ == '__main__':
    main()
