"""Render the style-lab samples: python scripts/style_frames.py -> renders/style/style_sheet.jpg"""
import functools, http.server, os, threading, time
from playwright.sync_api import sync_playwright
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); WEB = os.path.join(ROOT, "web"); OUT = os.path.join(ROOT, "renders", "style")
os.makedirs(OUT, exist_ok=True)
http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8772), functools.partial(http.server.SimpleHTTPRequestHandler, directory=WEB))
threading.Thread(target=srv.serve_forever, daemon=True).start()
shots, errs = [], []
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    pg = b.new_page(viewport={"width": 960, "height": 600})
    pg.on("pageerror", lambda e: errs.append(str(e)))
    for style in "AB":
        for sc in ("beaker", "ash"):
            pg.goto("http://127.0.0.1:8772/style/index.html?style=%s&scene=%s&t=2.3" % (style, sc))
            pg.wait_for_function("document.title === 'READY'", timeout=120000); time.sleep(1)
            path = os.path.join(OUT, "%s_%s.png" % (style, sc)); pg.screenshot(path=path); shots.append(path)
    b.close()
srv.shutdown()
s = Image.new("RGB", (1920, 1200))
for i, path in enumerate(shots): s.paste(Image.open(path), ((i % 2) * 960, (i // 2) * 600))
s.save(os.path.join(OUT, "style_sheet.jpg")); print("ERRORS:", errs or "none")
