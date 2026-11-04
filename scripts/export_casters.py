"""Copy the STILL objects of one station of a code lesson into a GLB, so Blender can bake their real shadows.
python scripts/export_casters.py 804 water 47 52 58 64 70 76 85      (station name, then seconds inside its time window)
An object counts as still when it is visible at every given second, in the same place. Glow, labels, flames and other
unlit (MeshBasic) things are skipped. Glass / liquids are named "GLASS_<hex>" (their shadow is see-through, tinted),
everything else "SOLID_<hex>". Writes renders/bake/<lesson>_<station>_casters.glb (world coordinates, three.js)."""
import base64, functools, http.server, os, sys, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); WEB = os.path.join(ROOT, "web")
OUT = os.path.join(ROOT, "renders", "bake"); os.makedirs(OUT, exist_ok=True)
http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8776), functools.partial(http.server.SimpleHTTPRequestHandler, directory=WEB))
threading.Thread(target=srv.serve_forever, daemon=True).start()
lid, name, ts = sys.argv[1], sys.argv[2], [float(x) for x in sys.argv[3:]]
EXPORTER = open(os.path.join(ROOT, "tools", "three", "GLTFExporter.js"), encoding="utf-8").read()
JS = """async (ts) => {
  const THREE = await import('three'); const { GLTFExporter } = await import('./_tools/GLTFExporter.js');
  const L = window._lesson, seen = new Map();
  const shown = (o) => { for (let p = o; p; p = p.parent) if (!p.visible) return false; return true; };
  for (let k = 0; k < ts.length; k++) {
    L.seek(ts[k]); for (let f = 0; f < 3; f++) await new Promise((r) => requestAnimationFrame(r)); L.scene.updateMatrixWorld(true);   // the engine applies a seek on the next frame
    L.scene.traverse((o) => {
      if (!o.isMesh || o.isInstancedMesh || o.name === 'floor' || o.material.isMeshBasicMaterial || (o.material.isShaderMaterial && !o.material.uniforms?.uC) || !shown(o)) return;   // uC = the house rim glass
      const m = o.matrixWorld.elements.map((v) => Math.round(v * 1e4) / 1e4).join(',');
      const s = seen.get(o) || { n: 0, m }; if (s.m === m) s.n++; seen.set(o, s);
    });
  }
  const out = new THREE.Scene(), bench = [...seen.keys()].find((o) => o.name === 'bench' && seen.get(o).n === ts.length);
  const bx = bench ? new THREE.Vector3().setFromMatrixPosition(bench.matrixWorld).x : 0, half = bench ? Math.max(2.6, new THREE.Box3().setFromObject(bench).getSize(new THREE.Vector3()).x / 2 + 0.1) : 2.6;   // wide tables keep all their things
  for (const [o, s] of seen) {
    if (s.n !== ts.length || Math.abs(new THREE.Vector3().setFromMatrixPosition(o.matrixWorld).x - bx) > half) continue;   // only this station's table
    const mt = o.material, glass = mt.isShaderMaterial || (mt.transmission || 0) > 0.05 || (mt.transparent && mt.opacity < 0.95);
    const c = new THREE.Mesh(o.geometry, new THREE.MeshStandardMaterial({ color: mt.color || mt.uniforms?.uC?.value || 0xffffff }));
    c.name = o.name === 'bench' ? 'BENCH' : (glass ? 'GLASS_' : 'SOLID_') + (mt.color || mt.uniforms?.uC?.value || new THREE.Color(1, 1, 1)).getHexString();   // BENCH: Blender puts its table there
    c.material.name = c.name; o.matrixWorld.decompose(c.position, c.quaternion, c.scale); out.add(c);
  }
  const buf = await new GLTFExporter().parseAsync(out, { binary: true });
  let bin = ''; const u8 = new Uint8Array(buf); for (let i = 0; i < u8.length; i += 32768) bin += String.fromCharCode(...u8.subarray(i, i + 32768));
  return [out.children.length, btoa(bin)];
}"""
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    pg = b.new_page(viewport={"width": 640, "height": 360})
    pg.route("**/_tools/GLTFExporter.js", lambda r: r.fulfill(body=EXPORTER, content_type="text/javascript"))
    pg.goto("http://127.0.0.1:8776/lesson/index.html?id=%s&t=0&look=old" % lid); pg.wait_for_function("window._ready === true", timeout=120000)
    n, data = pg.evaluate(JS, ts)
    b.close()
srv.shutdown()
path = os.path.join(OUT, "%s_%s_casters.glb" % (lid, name)); open(path, "wb").write(base64.b64decode(data))
print("CASTERS", name, n, "objects ->", path)
