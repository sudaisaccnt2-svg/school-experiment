"""Drag-orbit test: for each shot of a film, screenshot the film view, then a half turn and a top view.
python scripts/test_orbit_shots.py 803  -> renders/player/orbit_<id>.jpg"""
import functools, http.server, os, sys, threading, time
from playwright.sync_api import sync_playwright
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); WEB = os.path.join(ROOT, "web"); OUT = os.path.join(ROOT, "renders", "player")
http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8770), functools.partial(http.server.SimpleHTTPRequestHandler, directory=WEB))
threading.Thread(target=srv.serve_forever, daemon=True).start()
fid = sys.argv[1]; W, H = 900, 560; rows = []
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    pg = b.new_page(viewport={"width": W, "height": H})
    pg.goto("http://127.0.0.1:8770/index.html?film=%s&dbg&test&frame=1" % fid)
    pg.wait_for_function("window._dbg && document.getElementById('loading').classList.contains('done')", timeout=90000)
    cuts = pg.evaluate("window._dbg.meta.cuts.map(c => c.frame)")
    for k, f in enumerate(cuts):
        pg.evaluate("f => { const s = document.getElementById('scrub'); s.value = f; s.dispatchEvent(new Event('input')); }", f + 60)
        time.sleep(1.2); row = []
        for name, dx, dy in (("film", 0, 0), ("half turn", 560, 0), ("from above", 0, 260)):
            if dx or dy:
                pg.mouse.move(W / 2, H / 2); pg.mouse.down()
                pg.mouse.move(W / 2 + dx, H / 2 + dy, steps=20); pg.mouse.up(); time.sleep(1.5)
            path = os.path.join(OUT, "o_%d_%s.png" % (k, name[:4])); pg.screenshot(path=path); row.append(path)
            if dx or dy: pg.mouse.dblclick(W / 2, H / 2); time.sleep(1.2)
        rows.append(row)
    b.close()
srv.shutdown()
s = Image.new("RGB", (3 * 300, len(rows) * 187))
for r, row in enumerate(rows):
    for c, path in enumerate(row): s.paste(Image.open(path).resize((300, 187)), (c * 300, r * 187))
s.save(os.path.join(OUT, "orbit_%s.jpg" % fid)); print("sheet", len(rows), "shots")
