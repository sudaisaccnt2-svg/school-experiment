"""Debug: what does the orbit centre land on in each shot of a film? python scripts/probe_orbit.py 803"""
import functools, http.server, os, sys, threading, json
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); WEB = os.path.join(ROOT, "web")
http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8769), functools.partial(http.server.SimpleHTTPRequestHandler, directory=WEB))
threading.Thread(target=srv.serve_forever, daemon=True).start()
fid = sys.argv[1]
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    pg = b.new_page(viewport={"width": 1180, "height": 820})
    pg.goto("http://127.0.0.1:8769/index.html?film=%s&dbg&test&frame=1" % fid)
    pg.wait_for_function("window._dbg && document.getElementById('loading').classList.contains('done')", timeout=90000)
    out = pg.evaluate("""() => { const { THREE, filmCams, root, meta } = window._dbg; const res = [];
      const scrub = document.getElementById('scrub');
      for (const c of meta.cuts) { const f = c.frame + 45; scrub.value = f; scrub.dispatchEvent(new Event('input'));
        root.updateMatrixWorld(true);
        const cam = filmCams[THREE.PropertyBinding.sanitizeNodeName(c.camera)]; cam.updateMatrixWorld(true);
        const r = new THREE.Raycaster(); r.setFromCamera({x:0,y:0}, cam);
        const hits = r.intersectObject(root, true).slice(0, 4).map(h => h.object.name + '@' + h.distance.toFixed(1));
        res.push(c.camera + ' f' + f + ': ' + hits.join(' | ')); }
      return res; }""")
    print("\n".join(out))
    b.close()
srv.shutdown()
