"""Screenshots of a code lesson (web/lesson/) at given seconds -> renders/lesson/sheet.jpg
python scripts/shot_lesson.py 803 0 8.5 15 22.5 ..."""
import functools, http.server, os, sys, threading, time
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); WEB = os.path.join(ROOT, "web"); OUT = os.path.join(ROOT, "renders", "lesson")
os.makedirs(OUT, exist_ok=True)
http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8772), functools.partial(http.server.SimpleHTTPRequestHandler, directory=WEB))
threading.Thread(target=srv.serve_forever, daemon=True).start()
lid, ts = sys.argv[1], sys.argv[2:]; paths = []; errs = []
W, H = int(os.environ.get("W", 1280)), int(os.environ.get("H", 720))
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    pg = b.new_page(viewport={"width": W, "height": H})
    pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: m.type == "error" and errs.append(m.text)); pg.on("response", lambda r: r.status >= 400 and errs.append("%d %s" % (r.status, r.url)))
    fast = os.environ.get("SEEK") == "1"                     # SEEK=1: load once, jump in place (much faster)
    if fast:
        pg.goto("http://127.0.0.1:8772/lesson/index.html?id=%s&t=0%s" % (lid, os.environ.get("Q", "")))   # Q="&look=old" adds query options
        try: pg.wait_for_function("window._ready === true", timeout=60000)
        except Exception: print("PAGE NEVER READY:", errs); sys.exit(1)
    if ts == ["all"] and fast:                              # "all": a frame every EVERY s (default 4) over the whole lesson
        dur = pg.evaluate("() => window._lesson.duration"); ev = float(os.environ.get("EVERY", 4))
        ts = ["%g" % round(k * ev, 2) for k in range(int(dur / ev) + 1)]
    for t in ts:
        if fast: pg.evaluate("t => window._lesson.seek(t)", float(t)); time.sleep(0.6)
        else:
            pg.goto("http://127.0.0.1:8772/lesson/index.html?id=%s&t=%s" % (lid, t))
            pg.wait_for_function("window._ready === true", timeout=120000); time.sleep(1.0)
        path = os.path.join(OUT, "%s_%s.png" % (lid, t)); pg.screenshot(path=path); paths.append((t, path))
    b.close()
srv.shutdown()
cols = 3; tw, th = 560, int(560 * H / W)
s = Image.new("RGB", (cols * tw, ((len(paths) + cols - 1) // cols) * th))
for i, (t, path) in enumerate(paths):
    im = Image.open(path).resize((tw, th)); ImageDraw.Draw(im).text((8, 6), "t=" + t, fill=(255, 80, 80)); s.paste(im, ((i % cols) * tw, (i // cols) * th))
s.save(os.path.join(OUT, os.environ.get("SHEET", "sheet.jpg"))); print("ERRORS:", errs or "none")
