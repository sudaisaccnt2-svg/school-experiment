"""Vendor the three.js modules the web viewer needs (and their imports) into web/lib/three/.
Run: python scripts/fetch_threejs.py"""
import os, re, urllib.request

VER = "0.170.0"
BASE = "https://cdn.jsdelivr.net/npm/three@%s/" % VER
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "web", "lib", "three")
ENTRY = ["build/three.module.js",
         "examples/jsm/loaders/GLTFLoader.js",
         "examples/jsm/loaders/RGBELoader.js",
         "examples/jsm/controls/OrbitControls.js",
         "examples/jsm/webxr/VRButton.js",
         "examples/jsm/postprocessing/EffectComposer.js",
         "examples/jsm/postprocessing/RenderPass.js",
         "examples/jsm/postprocessing/UnrealBloomPass.js",
         "examples/jsm/postprocessing/OutputPass.js",
         "examples/jsm/postprocessing/BokehPass.js",
         "examples/jsm/loaders/DRACOLoader.js"]
BINARY = ["examples/jsm/libs/draco/gltf/draco_decoder.wasm",      # Draco-compressed GLB meshes (topic films)
          "examples/jsm/libs/draco/gltf/draco_wasm_wrapper.js"]

seen = set()


def fetch(rel):
    if rel in seen:
        return
    seen.add(rel)
    src = urllib.request.urlopen(BASE + rel).read().decode("utf-8")
    dest = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    open(dest, "w", encoding="utf-8").write(src)
    for spec in re.findall(r"""(?:import|export)[^'"]*?from\s*['"]([^'"]+)['"]""", src):
        if spec == "three":
            continue
        fetch(os.path.normpath(os.path.join(os.path.dirname(rel), spec)).replace("\\", "/"))


for e in ENTRY:
    fetch(e)
for b in BINARY:
    dest = os.path.join(OUT, b)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    open(dest, "wb").write(urllib.request.urlopen(BASE + b).read())
    seen.add(b)
print(len(seen), "files ->", OUT)
