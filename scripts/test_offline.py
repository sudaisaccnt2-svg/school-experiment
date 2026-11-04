"""Offline browser checks, including all AR assets and interrupted-update recovery.

python scripts/test_offline.py              # isolated localhost server, including fault injection
python scripts/test_offline.py https://...  # check an existing installation URL

Quick Look feature support is simulated. Its native camera viewer still needs a real iPad test.
"""
import base64
import hashlib
import http.server
import json
import re
import sys
import threading
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "web"
SW = (WEB / "sw.js").read_text(encoding="utf-8")
ASSETS = json.loads(re.search(r"const ASSETS = (\[.*?\]);", SW, re.S).group(1))
VERSION = re.search(r"const CACHE = '([^']+)'", SW).group(1)
state = {"blocked": set(), "worker": None, "app": None, "served": []}


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      ".js": "text/javascript", ".usdz": "model/vnd.usdz+zip",
                      ".webmanifest": "application/manifest+json"}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WEB), **kwargs)

    def do_GET(self):
        path = urlsplit(self.path).path.lstrip("/")
        state["served"].append(path)
        if path in state["blocked"]:
            self.send_error(503)
            return
        override = state["worker"] if path == "sw.js" else state["app"] if path == "app.js" else None
        if override is not None:
            data = override.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/javascript")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        super().do_GET()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, *_):
        pass


def saved(page):
    page.wait_for_function("document.querySelector('#offlineBadge').dataset.ready === 'true'", timeout=180000)
    page.wait_for_function("document.querySelector('#loading')?.classList.contains('done')", timeout=90000)
    assert not page.locator("#error").is_visible(), page.locator("#error").inner_text()


def status(page):
    return page.evaluate("""() => new Promise(resolve => {
      const receive = event => {
        if (event.data?.type !== 'cache-status' || event.source !== navigator.serviceWorker.controller) return;
        navigator.serviceWorker.removeEventListener('message', receive);
        resolve(event.data);
      };
      navigator.serviceWorker.addEventListener('message', receive);
      navigator.serviceWorker.controller.postMessage('cache-status');
    })""")


def check_ar(page):
    found = {}
    for index, filename in enumerate(["experiment.usdz", "experiment.usdz", "inside_the_foil.usdz", "planetary_model.usdz"]):
        page.locator("#acts button").nth(index).dispatch_event("click")   # act buttons are hidden in the minimal player
        page.wait_for_function("document.querySelector('#arBtn').href.startsWith('blob:')", timeout=30000)
        link = page.locator("#arBtn")
        assert link.get_attribute("download") == filename
        assert link.get_attribute("rel") == "ar"
        data = page.evaluate("""async () => {
          const response = await fetch(document.querySelector('#arBtn').href);
          const bytes = await response.arrayBuffer();
          const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
          return { size: bytes.byteLength, type: response.headers.get('Content-Type'),
            integrity: 'sha256-' + btoa(String.fromCharCode(...hash)) };
        }""")
        expected = next(asset for asset in ASSETS if asset["url"] == "ar/" + filename)
        assert data == {"size": expected["size"], "type": "model/vnd.usdz+zip", "integrity": expected["integrity"]}
        found[filename] = link.get_attribute("href")
    assert len(found) == 3
    return found


server = None
if len(sys.argv) > 1:
    url = sys.argv[1].rstrip("/") + "/"
else:
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    url = f"http://127.0.0.1:{server.server_port}/"

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True,
                                    args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
        context = browser.new_context(viewport={"width": 1180, "height": 820})
        context.add_init_script("""const supports = DOMTokenList.prototype.supports;
          DOMTokenList.prototype.supports = function(token) {
            return token === 'ar' || supports.call(this, token);
          };""")
        errors = []
        context.on("page", lambda page: page.on("pageerror", lambda error: errors.append(str(error))))
        page = context.new_page()
        page.goto(url + "?test=1", wait_until="load", timeout=120000)
        saved(page)
        first_ar = check_ar(page)
        ready = status(page)
        assert ready["ready"] and ready["cached"] == ready["total"]
        print("PASS: complete first installation, including every AR file", flush=True)

        context.set_offline(True)
        page.close()
        page = context.new_page()
        page.goto(url + "index.html?frame=620&test=1", wait_until="load", timeout=60000)
        saved(page)
        reopened_ar = check_ar(page)
        assert all(reopened_ar[name] != first_ar[name] for name in first_ar)
        hashes = page.evaluate("""async assets => {
          const results = [];
          for (const asset of assets) {
            const response = await fetch(asset.url);
            const bytes = await response.arrayBuffer();
            const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
            results.push({url: asset.url, ok: response.ok, size: bytes.byteLength,
              integrity: 'sha256-' + btoa(String.fromCharCode(...hash))});
          }
          return results;
        }""", ASSETS)
        for expected, actual in zip(ASSETS, hashes):
            assert actual == {**expected, "ok": True}, actual
        page.locator("#acts button").first.dispatch_event("click")
        initial_frame = page.locator("#scrub").input_value()
        page.locator("#playBtn").dispatch_event("click")
        page.wait_for_function("document.querySelector('#scrub').value !== '1'")
        page.locator("#playBtn").dispatch_event("click")
        assert page.locator("#scrub").input_value() != initial_frame
        page.locator("#speedBtn").dispatch_event("click")
        assert page.locator("#speedBtn").inner_text() == "2×"
        page.locator("#scrub").evaluate("el => {el.value = 700; el.dispatchEvent(new Event('input'));}")
        assert page.locator("#scrub").input_value() == "700"
        page.mouse.move(500, 350)
        page.mouse.down()
        page.mouse.move(580, 390, steps=5)
        page.mouse.up()
        page.locator("#resetBtn").dispatch_event("click")
        print("PASS: new page with network disabled; all file hashes, playback, acts, scrub, speed, orbit and AR blobs", flush=True)

        # Every film and every game must open with the network off: no failed file, no script error.
        films = [f["id"] for f in json.loads((WEB / "films.json").read_text(encoding="utf-8"))["films"]]
        games = re.findall(r"\{ id: '([a-z0-9]+)'", (WEB / "games" / "main.js").read_text(encoding="utf-8"))
        failed = []
        page.on("requestfailed", lambda request: "ERR_ABORTED" not in (request.failure or "") and failed.append(f"{request.url} {request.failure}"))
        page.on("response", lambda response: response.status >= 400 and failed.append(f"{response.status} {response.url}"))
        for path in [f"index.html?film={i}&test=1" for i in films] + ["games.html"] + [f"games.html?game={g}" for g in games]:
            before = len(errors); failed.clear(); print("open", path, flush=True)
            page.goto(url + path, wait_until="load", timeout=60000)
            if "film=" in path:
                page.wait_for_function("document.querySelector('#loading')?.classList.contains('done') || window._ready === true", timeout=120000)  # code lessons (web/lesson/) set window._ready
            page.wait_for_timeout(2500)
            assert not failed and len(errors) == before, (path, failed, errors[before:])
        print(f"PASS: offline, all {len(films)} films and all {len(games)} games open with no missing file or error", flush=True)
        page.goto(url + "index.html?film=01&frame=620&test=1", wait_until="load", timeout=60000)
        saved(page)

        ranges = page.evaluate("""async () => {
          const results = [];
          for (const range of ['bytes=0-127', 'bytes=-128', 'bytes=999999999-', 'bytes=4-3']) {
            const response = await fetch('ar/experiment.usdz', {headers: {Range: range}});
            results.push({status: response.status, size: (await response.arrayBuffer()).byteLength,
              range: response.headers.get('Content-Range')});
          }
          return results;
        }""")
        assert [result["status"] for result in ranges] == [206, 206, 416, 416], ranges
        assert [result["size"] for result in ranges] == [128, 128, 0, 0], ranges
        print("PASS: offline binary byte-range requests", flush=True)

        if server:
            # Replacing a required file with an unrelated entry must never claim offline readiness.
            page.evaluate("""async version => {
              const cache = await caches.open(version);
              await cache.delete(new URL('ar/experiment.usdz', location.href));
              await cache.put(new URL('unrelated.txt', location.href), new Response('extra entry'));
            }""", VERSION)
            incomplete = status(page)
            assert not incomplete["ready"] and incomplete["cached"] == incomplete["total"] - 1
            page.wait_for_function("document.querySelector('#offlineBadge').dataset.ready === 'false'")
            context.set_offline(False)
            page.evaluate("dispatchEvent(new Event('online'))")
            saved(page)
            print("PASS: missing AR is detected despite an extra cache entry, then repaired online", flush=True)

            original_app = (WEB / "app.js").read_bytes()
            state["app"] = original_app.decode("utf-8") + "\n// changed on server during a visit\n"
            cached_hash = page.evaluate("""async () => {
              const bytes = await (await fetch('app.js')).arrayBuffer();
              return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)))
                .map(byte => byte.toString(16).padStart(2, '0')).join('');
            }""")
            assert cached_hash == hashlib.sha256(original_app).hexdigest()
            state["app"] = None
            page.evaluate("caches.open('other-app-data').then(c => c.put('/notes', new Response('keep me')))")

            update_version = "rutherford-offline-test-update"
            # The update changes only app.js: every other file must be copied from the old offline copy.
            changed_app = original_app + b"\n// changed in the update\n"
            app_entry = '"url": "app.js",\n  "size": %d,\n  "integrity": "%s"' % (len(changed_app),
                "sha256-" + base64.b64encode(hashlib.sha256(changed_app).digest()).decode())
            state["worker"] = re.sub(r'"url": "app\.js",\s*"size": \d+,\s*"integrity": "[^"]+"', lambda _: app_entry,
                                     SW.replace(f"const CACHE = '{VERSION}'", f"const CACHE = '{update_version}'"), count=1)
            assert app_entry in state["worker"]
            state["blocked"] = {"app.js"}
            page.evaluate("navigator.serviceWorker.getRegistration().then(r => r.update())")
            page.wait_for_function("""async version => {
              const reg = await navigator.serviceWorker.getRegistration();
              return (await caches.keys()).includes(version) && !reg.installing;
            }""", arg=update_version, timeout=120000)
            assert VERSION in page.evaluate("caches.keys()")
            context.set_offline(True)
            page.close()
            page = context.new_page()
            page.goto(url + "?test=1", wait_until="load")
            saved(page)
            assert status(page)["version"] == VERSION
            check_ar(page)
            print("PASS: interrupted update preserves the previous complete website and AR offline", flush=True)

            context.set_offline(False)
            state["blocked"] = set(); state["app"] = changed_app.decode("utf-8"); state["served"] = []
            page.evaluate("navigator.serviceWorker.getRegistration().then(r => r.update())")
            page.wait_for_function("""async version => {
              const names = await caches.keys();
              return names.includes(version) && names.includes('other-app-data') && names.length === 2;
            }""", arg=update_version, timeout=120000)
            page.wait_for_function("""version => document.querySelector('#offlineBadge').dataset.version === version
              && document.querySelector('#offlineBadge').dataset.ready === 'true'""", arg=update_version)
            saved(page)
            assert status(page)["version"] == update_version
            context.set_offline(True)
            page.reload(wait_until="load")
            saved(page)
            check_ar(page)
            fetched = {path for path in state["served"] if path.startswith(("models/", "ar/", "env.hdr"))}
            assert not fetched, fetched
            print("PASS: update resumes, activates only when complete, and preserves unrelated caches", flush=True)
            print("PASS: the update downloaded only the changed file; films, models and AR were reused", flush=True)

        assert not errors, errors
        output = ROOT / "renders" / "offline_test.png"
        page.screenshot(path=str(output))
        print("PASS: no JavaScript errors; native Quick Look camera placement needs real iPad verification", flush=True)
        browser.close()
finally:
    if server:
        server.shutdown()
        server.server_close()
