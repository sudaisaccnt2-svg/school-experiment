"""Screenshots of film frames in the real player (fx, caption fitting, safe area included).
python scripts/shot_at.py 803:470 804:60 ...  -> renders/player/at_sheet.jpg"""
import functools, http.server, os, sys, threading, time
from playwright.sync_api import sync_playwright
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); WEB = os.path.join(ROOT, "web"); OUT = os.path.join(ROOT, "renders", "player")
http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8771), functools.partial(http.server.SimpleHTTPRequestHandler, directory=WEB))
threading.Thread(target=srv.serve_forever, daemon=True).start()
paths = []; errs = []
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    pg = b.new_page(viewport={"width": 1280, "height": 760})
    pg.on("pageerror", lambda e: errs.append(str(e)))
    for arg in sys.argv[1:]:
        fid, fr = arg.split(":")
        pg.goto("http://127.0.0.1:8771/index.html?film=%s&frame=%s&test" % (fid, fr))
        pg.wait_for_function("document.title === 'READY'", timeout=120000); time.sleep(1.2)
        path = os.path.join(OUT, "at_%s_%s.png" % (fid, fr)); pg.screenshot(path=path); paths.append(path)
    b.close()
srv.shutdown()
cols = 2; s = Image.new("RGB", (cols * 640, ((len(paths) + 1) // cols) * 380))
for i, path in enumerate(paths): s.paste(Image.open(path).resize((640, 380)), ((i % cols) * 640, (i // cols) * 380))
s.save(os.path.join(OUT, "at_sheet.jpg")); print("ERRORS:", errs or "none")
