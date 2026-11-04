"""Check the film player like a user: start card, tap = pause/play, double-tap left/right = skip, still stretches
play fast, drag = orbit around the shot's subject, end card. Screenshots -> renders/player/.
python scripts/test_player.py 702"""
import functools, http.server, os, sys, threading, time
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEB, OUT = os.path.join(ROOT, "web"), os.path.join(ROOT, "renders", "player")
os.makedirs(OUT, exist_ok=True)
http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8767), functools.partial(http.server.SimpleHTTPRequestHandler, directory=WEB))
threading.Thread(target=srv.serve_forever, daemon=True).start()
fid = sys.argv[1] if len(sys.argv) > 1 else "702"
W, H = 1180, 820
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    pg = b.new_page(viewport={"width": W, "height": H})
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
    pg.goto("http://127.0.0.1:8767/index.html?film=%s&dbg" % fid)
    pg.wait_for_function("document.getElementById('loading').classList.contains('done')", timeout=90000)
    time.sleep(1.4)
    pg.screenshot(path=os.path.join(OUT, "1_start_card.png"))      # the title moment
    clock = lambda: pg.evaluate("document.getElementById('clock').textContent")
    time.sleep(2.6)
    print("plays by itself after the title:", pg.evaluate("document.getElementById('playBtn').textContent") != "▶")
    time.sleep(3); pg.screenshot(path=os.path.join(OUT, "1b_playing_idle.png"))
    print("controls hidden while playing:", pg.evaluate("document.body.classList.contains('idle')"))
    pg.evaluate("document.getElementById('scrub').value = 700; document.getElementById('scrub').dispatchEvent(new Event('input'))")   # just before a long still part (702: 730-895)
    print("card hidden after play:", pg.evaluate("document.getElementById('intro').hidden || document.getElementById('intro').classList.contains('out')"))
    t0 = time.time(); c0 = clock(); time.sleep(6); print("6 s of playing:", c0, "->", clock(), "(more than 6 s = still parts sped up)")
    cx, cy = W // 2, H // 2
    pg.mouse.click(cx, cy); time.sleep(0.6)
    print("tap -> play button shows:", pg.evaluate("document.getElementById('playBtn').textContent"), "(▶ = paused)")
    a = clock(); pg.mouse.dblclick(W * 0.9, cy); time.sleep(0.5); print("double-tap right:", a, "->", clock())
    a = clock(); pg.mouse.dblclick(W * 0.1, cy); time.sleep(0.5); print("double-tap left:", a, "->", clock())
    pg.screenshot(path=os.path.join(OUT, "2_paused.png"))
    pg.mouse.move(cx, cy); pg.mouse.down(); pg.mouse.move(cx + 260, cy + 40, steps=12); pg.mouse.up(); time.sleep(1)
    pg.screenshot(path=os.path.join(OUT, "3_orbited.png"))
    print("still paused after drag:", pg.evaluate("document.getElementById('playBtn').textContent") == "▶")
    pg.evaluate("document.getElementById('scrub').value = document.getElementById('scrub').max - 20; document.getElementById('scrub').dispatchEvent(new Event('input'))")
    pg.click("#playBtn"); time.sleep(1.5)
    pg.screenshot(path=os.path.join(OUT, "4_end_card.png"))
    print("end card:", pg.evaluate("!document.getElementById('intro').hidden && !document.getElementById('introEnd').hidden"))
    print("ERRORS:", errs or "none")
    b.close()
srv.shutdown()
