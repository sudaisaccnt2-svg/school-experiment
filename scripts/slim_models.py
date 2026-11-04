"""Shrink web/models/*.glb: drop repeated animation keys (strict tolerance = looks identical) and re-pack with Draco.
Blender writes one key per frame for every object; this cuts the app from ~550 MB to ~116 MB.
Only files changed since the last run are processed (stamp file). Needs Node + ../tmp/node_modules/@gltf-transform/cli.
python scripts/slim_models.py [--all]"""
import json, os, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS = os.path.join(ROOT, "web", "models"); TMP = os.path.join(os.path.dirname(ROOT), "tmp")
GT = os.path.join(TMP, "node_modules", ".bin", "gltf-transform.cmd" if os.name == "nt" else "gltf-transform")
STAMP = os.path.join(MODELS, ".slim.json")
env = dict(os.environ, TEMP=TMP, TMP=TMP, PATH=r"C:\Program Files\nodejs" + os.pathsep + os.environ["PATH"])
if not os.path.exists(GT):
    subprocess.run("npm i --silent @gltf-transform/cli@4", cwd=TMP, shell=True, check=True, env=env)
done = {} if "--all" in sys.argv or not os.path.exists(STAMP) else json.load(open(STAMP))
a = os.path.join(TMP, "slim_a.glb")
for n in sorted(os.listdir(MODELS)):
    p = os.path.join(MODELS, n)
    if not n.endswith(".glb") or done.get(n) == os.path.getmtime(p): continue
    before = os.path.getsize(p)
    subprocess.run([GT, "resample", "--tolerance", "0.000001", p, a], check=True, env=env, capture_output=True)
    subprocess.run([GT, "draco", a, p], check=True, env=env, capture_output=True)
    done[n] = os.path.getmtime(p)
    print("%-16s %6.1f MB -> %5.1f MB" % (n, before / 1e6, os.path.getsize(p) / 1e6))
json.dump(done, open(STAMP, "w"))
