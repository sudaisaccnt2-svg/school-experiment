"""Open a lesson the way the user does (the running server, http quick view, their window size) and screenshot the
first seconds. python scripts/test_user_view.py 803 [url-base]"""
import os, sys, time
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); OUT = os.path.join(ROOT, "renders", "player")
fid = sys.argv[1]; base = sys.argv[2] if len(sys.argv) > 2 else "http://127.0.0.1:8000/app/"
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    pg = b.new_page(viewport={"width": 1919, "height": 917}); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
    pg.goto(base + "index.html?film=" + fid)
    pg.wait_for_function("document.getElementById('loading').classList.contains('done')", timeout=120000)
    for t in (0.3, 1.5, 4):
        time.sleep(t if t < 1 else t - 0.3)
        pg.screenshot(path=os.path.join(OUT, "user_%s_%ss.png" % (fid, t)))
        print(t, "s:", pg.evaluate("document.getElementById('clock').textContent"), "| playing:", pg.evaluate("document.getElementById('playBtn').textContent") != "▶")
    print("practise link:", pg.evaluate("document.getElementById('practiseBtn').getAttribute('href')"), "| games icon:", pg.evaluate("document.getElementById('gamesBtn').getAttribute('href')"))
    print("app.js has firstContentFrame:", pg.evaluate("fetch('app.js',{cache:'no-store'}).then(r=>r.text()).then(t=>t.includes('firstContentFrame'))"))
    print("ERRORS:", errs or "none"); b.close()
