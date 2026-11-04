"""Download the Poly Haven (CC0) assets used by the scene into assets/polyhaven/.
Run with normal Python:  python scripts/fetch_polyhaven.py
Re-running skips files that already exist."""
import json, os, urllib.request

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "polyhaven")
UA = {"User-Agent": "asawera-school-experiment"}

HDRIS = {"vintage_measuring_lab": "4k"}
TEXTURES = {"wood_table_worn": ["Diffuse", "nor_gl", "Rough"],
            "old_wood_floor": ["Diffuse", "nor_gl", "Rough"],
            "metal_plate_02": ["Diffuse", "nor_gl", "Rough", "Metal"]}
MODELS = ["vintage_microscope", "desk_lamp_arm_01", "book_encyclopedia_set_01", "round_spectacles"]
# shared asset library (docs/ASSET_LIBRARY.md): lab and everyday props for every lesson, all CC0
MODELS += ["chemistry_set", "bunsen_burner", "lightbulb_01", "magnifying_glass_01", "industrial_microscope",
           "retro_multimeter", "cross_pein_hammer", "pliers", "street_lamp_01", "circuit_board", "vintage_pocket_watch",
           "rock_07", "stone_01", "moon_rock_01", "lantern_01", "propane_torch", "metal_jug", "wooden_bowl_01",
           "standing_chalkboard_01", "SchoolDesk_01"]


def get_json(url):
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA)))


def download(url, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA)) as r, open(dest + ".part", "wb") as f:
        f.write(r.read())
    os.replace(dest + ".part", dest)
    print("  got", os.path.relpath(dest, ROOT))


for a, res in HDRIS.items():
    f = get_json("https://api.polyhaven.com/files/" + a)
    download(f["hdri"][res]["hdr"]["url"], os.path.join(ROOT, "hdri", "%s_%s.hdr" % (a, res)))

for a, maps in TEXTURES.items():
    f = get_json("https://api.polyhaven.com/files/" + a)
    for m in maps:
        e = f[m]["2k"]
        fmt = "jpg" if "jpg" in e else "png"
        download(e[fmt]["url"], os.path.join(ROOT, "textures", a, "%s_%s_2k.%s" % (a, m, fmt)))

for a in MODELS:
    try:
        f = get_json("https://api.polyhaven.com/files/" + a)
    except Exception as e:                      # renamed / removed on Poly Haven: skip it
        print("  skipped", a, e)
        continue
    b = f["blend"]["2k"]["blend"]
    d = os.path.join(ROOT, "models", a)
    download(b["url"], os.path.join(d, os.path.basename(b["url"])))
    for rel, inc in b.get("include", {}).items():
        download(inc["url"], os.path.join(d, rel))
print("done:", ROOT)
