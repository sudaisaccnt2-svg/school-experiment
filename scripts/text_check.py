"""One text at a time? Lists every moment where more than one text is on screen in a code lesson.
python scripts/text_check.py 817 [step=0.5]   (W/H env = screen size, default 1180x820)"""
import functools, http.server, os, sys, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); WEB = os.path.join(ROOT, "web")
http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8773), functools.partial(http.server.SimpleHTTPRequestHandler, directory=WEB))
threading.Thread(target=srv.serve_forever, daemon=True).start()
lid = sys.argv[1]; step = float(sys.argv[2]) if len(sys.argv) > 2 else 0.5
W, H = int(os.environ.get("W", 1180)), int(os.environ.get("H", 820))
JS = """t => { const L = window._lesson; L.seek(t); const cam = L.cam, out = [];
  const cap = document.getElementById('cap'), s = cap.textContent.trim();
  if (s && cap.classList.contains('on') && !cap.classList.contains('hush')) out.push('CAP: ' + s);
  cam.updateMatrixWorld();
  L.scene.traverseVisible(o => { if (!o.isSprite || o.userData.text === undefined) return;
    if (o.scale.y < 0.5 * (o.userData.s0 ? o.userData.s0.y : o.userData.h)) return;
    if (o.material.userData.op0 !== undefined && o.material.opacity < 0.3 * o.material.userData.op0) return;
    if (window._MARK && !o.userData.group && (o.userData.mark || window._MARK.test(o.userData.text))) return;
    const p = o.getWorldPosition(o.position.clone()).project(cam); if (Math.abs(p.x) > 1 || Math.abs(p.y) > 1 || p.z > 1) return;
    if (window._MARK && /^(eq|rb)[0-9]/.test(o.userData.group || '')) return;   // equations / boards are part of the picture
    if (o.userData.group) { const g = '[' + o.userData.group + ']'; if (!out.includes(g)) out.push(g); return; }
    out.push(o.userData.text); });
  return out; }"""
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    pg = b.new_page(viewport={"width": W, "height": H})
    pg.goto("http://127.0.0.1:8773/lesson/index.html?id=%s&t=0" % lid); pg.wait_for_function("window._ready === true", timeout=90000)
    if os.environ.get("ALL") != "1": pg.evaluate("() => { window._MARK = /^([A-Z][a-z]?[⁺⁻²³]*|[+−>])$/; }")   # letters on atoms are part of the picture
    dur = pg.evaluate("() => window._lesson.duration || 0") or float(os.environ.get("DUR", 300))
    t, bad, last = 0.0, 0, None
    while t <= dur:
        texts = pg.evaluate(JS, t); pg.wait_for_timeout(260); texts = pg.evaluate(JS, t)
        key = " | ".join(texts)
        if key != last:
            if len(texts) > 1: bad += 1
            if len(texts) > 1 or os.environ.get("LOG") == "1": print("%6.1f %s %s" % (t, "!!" if len(texts) > 1 else "  ", key or "-"))
        last = key; t += step
    b.close()
print("MOMENTS WITH >1 TEXT:", bad)
