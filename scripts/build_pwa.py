"""Make web/ an installable, offline Progressive Web App.
Writes app icons, manifest.webmanifest and sw.js (precaches every file the viewer needs, versioned by content hash).
Re-run after every export:  python scripts/build_pwa.py"""
import base64, hashlib, json, math, os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

WEB = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "web")
ICONS = os.path.join(WEB, "icons")
os.makedirs(ICONS, exist_ok=True)


def icon(size, maskable=False):
    s = 4 * size  # supersample
    img = Image.new("RGB", (s, s), (9, 10, 14))
    glow = Image.new("RGB", (s, s), (0, 0, 0))
    d = ImageDraw.Draw(glow)
    for r in range(int(s * 0.62), 0, -8):  # warm radial glow
        t = r / (s * 0.62)
        d.ellipse([s / 2 - r, s / 2 - r, s / 2 + r, s / 2 + r], fill=(int(60 * (1 - t) ** 1.5), int(40 * (1 - t) ** 1.5), int(18 * (1 - t) ** 1.5)))
    img = Image.blend(img, glow, 0.9)
    d = ImageDraw.Draw(img)
    pad = 0.18 if maskable else 0.08
    cx = cy = s / 2
    rx, ry = s * (0.5 - pad), s * (0.5 - pad) * 0.42
    w = max(2, int(s * 0.012))
    for ang in (0, 60, 120):  # three orbits
        pts = []
        for k in range(181):
            t = 2 * math.pi * k / 180
            x, y = rx * math.cos(t), ry * math.sin(t)
            a = math.radians(ang)
            pts.append((cx + x * math.cos(a) - y * math.sin(a), cy + x * math.sin(a) + y * math.cos(a)))
        d.line(pts, fill=(120, 170, 255), width=w, joint="curve")
    for ang, t in ((0, 0.3), (60, 2.2), (120, 4.1)):  # electrons
        a = math.radians(ang)
        x, y = rx * math.cos(t), ry * math.sin(t)
        ex, ey = cx + x * math.cos(a) - y * math.sin(a), cy + x * math.sin(a) + y * math.cos(a)
        r = s * 0.028
        d.ellipse([ex - r, ey - r, ex + r, ey + r], fill=(190, 225, 255))
    r = s * 0.11  # golden nucleus with alpha symbol
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(242, 196, 109))
    try:
        f = ImageFont.truetype("C:/Windows/Fonts/palab.ttf", int(s * 0.16))
    except OSError:
        f = ImageFont.load_default()
    d.text((cx, cy - s * 0.01), "\u03b1", font=f, fill=(40, 26, 8), anchor="mm")
    img = img.filter(ImageFilter.SMOOTH)
    return img.resize((size, size), Image.LANCZOS)


for size in (192, 512):
    icon(size).save(os.path.join(ICONS, "icon-%d.png" % size))
    icon(size, maskable=True).save(os.path.join(ICONS, "icon-maskable-%d.png" % size))
icon(180).save(os.path.join(ICONS, "apple-touch-icon.png"))

import sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "p2"))
from films import CHAPTER, CHAPTERS, CHAPTER_INFO, FILMS, unit_of, FILM_GAME

manifest = {
    "name": "Chemistry IX in 3D · Asawera",
    "short_name": "Chem 3D",
    "description": "Interactive 3D / AR explainers for Grade IX Chemistry: Unit 2 Structure of an Atom, Unit 3 Periodic Table.",
    "start_url": "./", "scope": "./", "display": "fullscreen", "orientation": "landscape",
    "background_color": "#07080b", "theme_color": "#07080b",
    "icons": [
        {"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png"},
        {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png"},
        {"src": "icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
    ],
}
json.dump(manifest, open(os.path.join(WEB, "manifest.webmanifest"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)

# ---- film list + model versions: the app requests models/<film>.glb?v=<hash>, so a new build is never served from
# an old cache
def file_hash(path):
    mh = hashlib.sha1()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            mh.update(chunk)
    return mh.hexdigest()[:10]


VERSIONED = {}       # "models/x.glb" -> version
film_list = []
for fid, _scene, title, pages in FILMS:
    meta_rel = "scene.json" if fid == "01" else "films/%s.json" % fid
    meta_path = os.path.join(WEB, meta_rel)
    if not os.path.exists(meta_path):
        continue
    meta = json.load(open(meta_path, encoding="utf-8"))
    glb = meta.get("glb", "models/rutherford.glb")
    if not os.path.exists(os.path.join(WEB, glb)):
        continue
    v = file_hash(os.path.join(WEB, glb))
    VERSIONED[glb] = v
    if meta.get("model_version") != v:
        meta["model_version"] = v
        json.dump(meta, open(meta_path, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    film_list.append({"id": fid, "title": title, "pages": pages, "meta": meta_rel, "unit": unit_of(fid), "game": FILM_GAME.get(fid)})
json.dump({"chapter": CHAPTER, "chapters": [{"id": u, "title": t, "pages": CHAPTER_INFO[u][0], "blurb": CHAPTER_INFO[u][1], "icon": CHAPTER_INFO[u][2]} for u, t in CHAPTERS], "films": film_list}, open(os.path.join(WEB, "films.json"), "w", encoding="utf-8"),
          indent=1, ensure_ascii=False)

# ---- service worker: precache everything the viewer loads ----
skip_dirs = {"__pycache__"}
skip_files = {"sw.js", "serve.py"}
files, assets, h = [], [], hashlib.sha256()
for dirpath, dirs, names in os.walk(WEB):
    dirs[:] = sorted(d for d in dirs if d not in skip_dirs)
    for n in sorted(names):
        if n in skip_files or n == "start.html" or n.endswith((".py", ".pem", ".bat", ".crt", ".key")):
            continue
        p = os.path.join(dirpath, n)
        rel = os.path.relpath(p, WEB).replace("\\", "/")
        if rel.startswith("models/") and rel not in VERSIONED:
            continue          # a film that is no longer in the list
        files.append(rel)
        digest = hashlib.sha256()
        with open(p, "rb") as source:
            for chunk in iter(lambda: source.read(1 << 20), b""):
                digest.update(chunk)
        integrity = "sha256-" + base64.b64encode(digest.digest()).decode("ascii")
        url = rel + "?v=" + VERSIONED[rel] if rel in VERSIONED else rel
        assets.append({"url": url, "size": os.path.getsize(p), "integrity": integrity})
        h.update(rel.encode()); h.update(digest.digest())
template_path = os.path.join(os.path.dirname(__file__), "sw-template.js")
with open(template_path, encoding="utf-8") as source:
    template = source.read()
h.update(template.encode())
version = h.hexdigest()[:10]
index = next(asset for asset in assets if asset["url"] == "index.html")
assets.insert(0, {**index, "url": "./"})
sw = template.replace("__VERSION__", version).replace("__ASSETS__", json.dumps(assets, indent=1))
open(os.path.join(WEB, "sw.js"), "w", encoding="utf-8").write(sw)
total = sum(os.path.getsize(os.path.join(WEB, f)) for f in files)
print("PWA built: version %s, %d films, %d files, %.1f MB cached for offline use (including all AR scenes)" % (version, len(film_list), len(assets), total / 1e6))
