"""Like bsend.py, but without a live Blender: concatenates the files and runs them in Blender's background mode on the
working file (`2 school experiment.blend`). The builders save the .blend themselves (finish_film).
Usage: python scripts/bgsend.py scripts/common.py scripts/p2/lib.py ... scripts/u4/f401_why.py
Close the Blender window first (two Blenders writing the same file would clash)."""
import os, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLENDER = r"C:\Program Files\Blender Foundation\Blender 4.5\blender.exe"
BLEND = os.environ.get("BGSEND_BLEND") or os.path.join(ROOT, "2 school experiment.blend")   # BGSEND_BLEND = a scratch copy for tests

code = "\n\n".join(open(p, encoding="utf-8").read() for p in sys.argv[1:])
code = "import bpy\n" + code + "\n\nprint('BGSEND DONE')\n"
fd, path = tempfile.mkstemp(suffix=".py", dir=os.environ.get("TEMP"))
with os.fdopen(fd, "w", encoding="utf-8") as f:
    f.write(code)
r = subprocess.run([BLENDER, "-b", BLEND, "--python-exit-code", "1", "--python", path], capture_output=True, text=True,
                   encoding="utf-8", errors="replace")
out = r.stdout + r.stderr
keep = [l for l in out.splitlines() if not l.startswith(("Fra:", "Read blend", "Blender ", "Warning: ")) and l.strip()]
print("\n".join(keep[-60:]))
os.remove(path)
sys.exit(0 if "BGSEND DONE" in out else 1)
