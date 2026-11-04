"""Check the arcade layer (arcade.js) in Table Builder: a quick, accurate level pass levels up by itself, the streak
grows, and a session ends on the results card. Uses a fake clock. Screenshots -> renders/games/arc_sheet.jpg
python scripts/test_arcade.py"""
import functools, http.server, os, threading, time
from playwright.sync_api import sync_playwright
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEB, OUT = os.path.join(ROOT, "web"), os.path.join(ROOT, "renders", "games")
http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8768), functools.partial(http.server.SimpleHTTPRequestHandler, directory=WEB))
threading.Thread(target=srv.serve_forever, daemon=True).start()
shots = []
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    pg = b.new_page(viewport={"width": 1180, "height": 820}); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.clock.install()
    pg.goto("http://127.0.0.1:8768/games.html?game=ptbuild&part=sym&level=0&sess=20")
    pg.add_init_script("localStorage.clear()")
    pg.clock.run_for(4000)
    shot = lambda n: (pg.screenshot(path=os.path.join(OUT, n + ".png")), shots.append(n))
    for k in range(10):
        pg.evaluate("_g.game.g.clock()"); pg.clock.run_for(1200)
        pg.evaluate("k => _g.game.g.right(k, true, '')", k); pg.clock.run_for(250)
        if k == 6: shot("arc_1_streak")
    pg.clock.run_for(300); shot("arc_2_levelup")
    print("after a quick, perfect level:", pg.evaluate("document.getElementById('lvPick').textContent"))
    pg.clock.run_for(12000); time.sleep(0.5); shot("arc_3_results")
    print("results card shown:", pg.evaluate("!document.getElementById('arCard').hidden"))
    print("ERRORS:", errs or "none")
    b.close()
srv.shutdown()
s = Image.new("RGB", (1180, 820))
for i, n in enumerate(shots):
    s.paste(Image.open(os.path.join(OUT, n + ".png")).resize((590, 410)), ((i % 2) * 590, (i // 2) * 410))
s.save(os.path.join(OUT, "arc_sheet.jpg"))
