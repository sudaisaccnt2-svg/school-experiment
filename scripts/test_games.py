"""Screenshot the games page headless and report JS errors.
python scripts/test_games.py "games.html" "games.html?game=lab&level=5@@for(let i=0;i<13;i++)_g.game.add('p')"
Each argument: <url>[@@<js run after READY>][##<wait seconds>]. Writes renders/games/g_<k>.png and a contact sheet."""
import http.server, threading, sys, os, functools, time
from playwright.sync_api import sync_playwright
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEB, OUT = os.path.join(ROOT, "web"), os.path.join(ROOT, "renders", "games")
os.makedirs(OUT, exist_ok=True)
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=WEB)
http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8766), H)
threading.Thread(target=srv.serve_forever, daemon=True).start()
size = (1180, 820)
if sys.argv[1:2] == ["--portrait"]:
    size = (820, 1180)
    sys.argv.pop(1)
shots = []
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    pg = b.new_page(viewport={"width": size[0], "height": size[1]})
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
    for k, arg in enumerate(sys.argv[1:]):
        wait = 1.6
        if "##" in arg:
            arg, w = arg.split("##"); wait = float(w)
        url, _, js = arg.partition("@@")
        pg.goto("http://127.0.0.1:8766/" + url)
        pg.wait_for_function("document.title === 'READY'", timeout=60000)
        time.sleep(0.8)
        if js:
            for part in js.split(";;"):
                pg.evaluate("async () => { " + part + " }")
                time.sleep(0.5)
        time.sleep(wait)
        path = os.path.join(OUT, "g_%d.png" % k)
        pg.screenshot(path=path)
        err = pg.eval_on_selector("#error", "e => e.hidden ? '' : e.textContent")
        shots.append(path)
        print("SHOT", k, url[:60], err[:300])
    print("ERRORS", errs[:6])
    b.close()
ims = [Image.open(s) for s in shots]
w, h = ims[0].width // 2, ims[0].height // 2
cols = 2 if len(ims) > 1 else 1
rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (w * cols, h * rows))
for i, im in enumerate(ims):
    sheet.paste(im.resize((w, h)), ((i % cols) * w, (i // cols) * h))
sheet.save(os.path.join(OUT, "sheet.jpg"), quality=72)
print("SHEET", os.path.join(OUT, "sheet.jpg"), sheet.size)
