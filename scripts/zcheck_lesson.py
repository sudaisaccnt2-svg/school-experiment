"""Flicker check for a code lesson: python scripts/zcheck_lesson.py 803 <seconds…>  (lists coplanar overlapping faces)"""
import functools, http.server, os, sys, threading, time
sys.stdout.reconfigure(encoding="utf-8")
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); WEB = os.path.join(ROOT, "web")
http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8774), functools.partial(http.server.SimpleHTTPRequestHandler, directory=WEB))
threading.Thread(target=srv.serve_forever, daemon=True).start()
lid, ts = sys.argv[1], sys.argv[2:]; seen = {}
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    pg = b.new_page(viewport={"width": 640, "height": 360})
    pg.goto("http://127.0.0.1:8774/lesson/index.html?id=%s&t=0%s" % (lid, os.environ.get("Q", ""))); pg.wait_for_function("window._ready === true", timeout=120000)
    for t in ts:
        pg.evaluate("t => window._lesson.seek(t)", float(t)); time.sleep(0.3)
        for h in pg.evaluate("async () => (await import('./zcheck.js')).zcheck(window._lesson.scene)"):
            seen.setdefault(h, t)
    b.close()
srv.shutdown()
for h, t in seen.items(): print("t=%s  %s" % (t, h))
print("FLICKER RISKS:", len(seen))
