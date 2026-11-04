"""A code lesson on 5 screen shapes (phone portrait + landscape, tablet, laptop, wide monitor) at given seconds.
python scripts/shot_screens.py 805 2 20 45 80 130        -> renders/lesson/<id>_screens.jpg (one row per second)
Q="&look=old" adds query options. Every frame must show its subject whole, labels uncut, the card clear of it."""
import functools, http.server, os, sys, threading, time
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); WEB = os.path.join(ROOT, "web"); OUT = os.path.join(ROOT, "renders", "lesson")
os.makedirs(OUT, exist_ok=True)
http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8773), functools.partial(http.server.SimpleHTTPRequestHandler, directory=WEB))
threading.Thread(target=srv.serve_forever, daemon=True).start()
SIZES = [(1180, 820), (1920, 1080), (844, 390), (390, 844), (1600, 600)]
lid, ts = sys.argv[1], sys.argv[2:]; errs = []; shots = {}
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    for W, H in SIZES:
        pg = b.new_page(viewport={"width": W, "height": H})
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto("http://127.0.0.1:8773/lesson/index.html?id=%s&t=0%s" % (lid, os.environ.get("Q", "")))
        try: pg.wait_for_function("window._ready === true", timeout=90000)
        except Exception: print("PAGE NEVER READY", W, H, errs); continue
        for t in ts:
            pg.evaluate("t => window._lesson.seek(t)", float(t)); time.sleep(0.8)
            path = os.path.join(OUT, "%s_%dx%d_%s.png" % (lid, W, H, t)); pg.screenshot(path=path); shots[(W, H, t)] = path
        pg.close()
    b.close()
srv.shutdown()
RH = 300                                                     # each shot scaled to the same height, a row per second
rows = []
for t in ts:
    ims = [Image.open(shots[(W, H, t)]).resize((int(RH * W / H), RH)) for W, H in SIZES if (W, H, t) in shots]
    row = Image.new("RGB", (sum(i.width for i in ims) + 8 * len(ims), RH), (40, 40, 40)); x = 0
    for i in ims: row.paste(i, (x, 0)); x += i.width + 8
    ImageDraw.Draw(row).text((8, 6), "t=" + t, fill=(255, 80, 80)); rows.append(row)
sheet = Image.new("RGB", (max(r.width for r in rows), len(rows) * (RH + 8)), (40, 40, 40))
for k, r in enumerate(rows): sheet.paste(r, (0, k * (RH + 8)))
sheet.save(os.path.join(OUT, os.environ.get("SHEET", "%s_screens.jpg" % lid))); print("ERRORS:", errs or "none")
