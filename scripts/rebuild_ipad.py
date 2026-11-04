"""Re-export everything the iPad app uses (GLB, USDZ, film list, offline cache).
Run:  python scripts/rebuild_ipad.py                 every film (film 01 includes a few-minute Cycles light bake)
      python scripts/rebuild_ipad.py 02 03           only these films (01 = the Rutherford scene)
      python scripts/rebuild_ipad.py --no-ar ...     skip the AR (USDZ) files

If Blender is open with the BlenderMCP socket (port 9876), exports use a snapshot of the *live* file, including
unsaved tweaks, saved as a copy in %TEMP% (your .blend and its unsaved state are left untouched).
Otherwise the saved '2 school experiment.blend' is used."""
import json, os, socket, subprocess, sys, tempfile
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "scripts", "p2"))
from films import FILMS

BLENDER = r"C:\Program Files\Blender Foundation\Blender 4.5\blender.exe"
BLEND = os.path.join(ROOT, "2 school experiment.blend")
SCRIPTS = os.path.join(ROOT, "scripts")


def snapshot_live_scene():
    path = os.path.join(tempfile.gettempdir(), "rutherford_export_snapshot.blend").replace("\\", "/")
    code = ("import bpy\n"
            "bpy.ops.wm.save_as_mainfile(filepath=%r, copy=True, relative_remap=True)\n"
            "print('snapshot ok')" % path)
    try:
        s = socket.create_connection(("localhost", 9876), timeout=5)
    except OSError:
        return None
    s.settimeout(300)
    s.sendall(json.dumps({"type": "execute_code", "params": {"code": code}}).encode())
    data = b""
    while True:
        c = s.recv(65536)
        if not c:
            break
        data += c
        try:
            json.loads(data)
            break
        except ValueError:
            pass
    return path if b"snapshot ok" in data else None


def scenes_in(blend):
    out = subprocess.run([BLENDER, "-b", blend, "--python-expr",
                          "import bpy; print('SCENES', '|'.join(s.name for s in bpy.data.scenes))"],
                         capture_output=True, text=True, encoding="utf-8", errors="replace")
    line = next(l for l in out.stdout.splitlines() if l.startswith("SCENES "))
    return line[len("SCENES "):].split("|")


def run(label, blend, scene, script, *args):
    cmd = [BLENDER, "-b", blend, "-S", scene, "--python", script] + (["--", *args] if args else [])
    out = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", env=env)
    lines = [l for l in out.stdout.splitlines()
             if l.startswith(("EXPORTED", "BAKED")) or "Traceback" in l or "Error:" in l]
    ok = (out.returncode == 0 and "Traceback" not in out.stdout + out.stderr
          and any(l.startswith(("EXPORTED", "BAKED")) for l in lines))
    print("==", label, "OK" if ok else "FAILED")
    print("\n".join(lines))
    if not ok:
        print(out.stdout[-2500:], out.stderr[-2500:])
    return ok


args = sys.argv[1:]
want_ar = "--no-ar" not in args
picked = [a for a in args if not a.startswith("--")]
src = snapshot_live_scene()
print("exporting from", "live Blender file (snapshot)" if src else "saved .blend")
src = src or BLEND
env = dict(os.environ, RUTHERFORD_ROOT=ROOT)
present = set(scenes_in(src))
todo = [f for f in FILMS if f[1] in present and (not picked or f[0] in picked)]
print("films:", " ".join(f[0] for f in todo))
failed = []

if any(f[0] == "01" for f in todo):
    # film 01: bake the Cycles lighting into lightmaps (GPU, a few minutes) -> the web export reads the baked copy
    baked = os.path.join(tempfile.gettempdir(), "rutherford_baked.blend")
    env["RUTHERFORD_BAKED"] = baked
    if not run("01 bake_lighting", src, "Scene", os.path.join(SCRIPTS, "bake_lighting.py")):
        sys.exit("bake failed")
    if not run("01 web", baked, "Scene", os.path.join(SCRIPTS, "export_web.py")):
        failed.append("01 web")
    if want_ar and not run("01 AR", src, "Scene", os.path.join(SCRIPTS, "export_ar.py")):
        failed.append("01 AR")

jobs = []
for fid, scene, *_ in [f for f in todo if f[0] != "01"]:
    jobs.append(("%s web" % fid, src, scene, os.path.join(SCRIPTS, "p2", "export_topics.py")))
    if want_ar:
        jobs.append(("%s AR" % fid, src, scene, os.path.join(SCRIPTS, "p2", "export_topics.py"), "ar"))
with ThreadPoolExecutor(4) as pool:
    for job, ok in zip(jobs, pool.map(lambda j: run(*j), jobs)):
        if not ok:
            failed.append(job[0])

subprocess.run([sys.executable, os.path.join(SCRIPTS, "slim_models.py")], check=True)
subprocess.run([sys.executable, os.path.join(SCRIPTS, "build_pwa.py")], check=True)
if failed:
    sys.exit("FAILED: " + ", ".join(failed))
