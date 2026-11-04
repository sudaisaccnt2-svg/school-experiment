"""Size breakdown of a .glb: images / geometry / animation, biggest meshes and animations.
Usage: python scripts/glb_stats.py web/models/rutherford.glb"""
import json, struct, sys
from collections import Counter

data = open(sys.argv[1], "rb").read()
jlen = struct.unpack("<I", data[12:16])[0]
g = json.loads(data[20:20 + jlen])
bv = g["bufferViews"]
acc = g.get("accessors", [])
cat = Counter()
img_bytes = sum(bv[i["bufferView"]]["byteLength"] for i in g.get("images", []) if "bufferView" in i)
cat["images"] = img_bytes
mesh_sizes = Counter()
geo_acc = set()
for m in g.get("meshes", []):
    for p in m["primitives"]:
        ids = list(p["attributes"].values()) + ([p["indices"]] if "indices" in p else [])
        for a in ids:
            geo_acc.add(a)
            mesh_sizes[m["name"]] += bv[acc[a]["bufferView"]]["byteLength"] if "bufferView" in acc[a] else 0
cat["geometry"] = sum(bv[acc[a]["bufferView"]]["byteLength"] for a in geo_acc if "bufferView" in acc[a])
anim_sizes = Counter()
anim_acc = set()
for an in g.get("animations", []):
    for s in an["samplers"]:
        for a in (s["input"], s["output"]):
            if a not in anim_acc and "bufferView" in acc[a]:
                anim_acc.add(a)
                anim_sizes[an["name"]] += acc[a]["count"] * {"SCALAR": 1, "VEC3": 3, "VEC4": 4}[acc[a]["type"]] * 4
cat["animation"] = sum(anim_sizes.values())
print("total %.1f MB" % (len(data) / 1e6))
for k, v in cat.items():
    print("  %-10s %.1f MB" % (k, v / 1e6))
print("nodes", len(g["nodes"]), "meshes", len(g.get("meshes", [])), "materials", len(g.get("materials", [])),
      "images", len(g.get("images", [])), "animations", len(g.get("animations", [])))
print("top meshes:", [(n, round(s / 1e6, 2)) for n, s in mesh_sizes.most_common(8)])
print("top animations:", [(n, round(s / 1e6, 2)) for n, s in anim_sizes.most_common(5)])
print("images:", [(i.get("name"), round(bv[i["bufferView"]]["byteLength"] / 1e6, 2)) for i in g.get("images", [])][:30])
