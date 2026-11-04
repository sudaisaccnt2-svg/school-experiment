"""Test-build Unit 8 films on scratch_u8.blend (main file busy) and render a preview sheet per film.
python scripts/u8/t8all.py 802 803 ...   (sheet frames = the middle of every say() beat)"""
import glob, os, re, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
S = lambda *p: os.path.join(ROOT, "scripts", *p)
env = dict(os.environ, BGSEND_BLEND=os.path.join(ROOT, "scratch_u8.blend"), TEMP=r"D:\_Asawera art\tmp", TMP=r"D:\_Asawera art\tmp")
LIBS = ["common.py", "p2/lib.py", "u3/u3lib.py", "u4/u4lib.py", "u5/u5lib.py", "u6/u6lib.py", "u7/u7lib.py", "v4lib.py", "u8/u8lib.py"]
for fid in sys.argv[1:]:
    f = glob.glob(S("u8", "f%s_*.py" % fid))[0]
    src = open(f, encoding="utf-8").read()
    r = subprocess.run([sys.executable, S("bgsend.py")] + [S(x) for x in LIBS] + [f], capture_output=True, text=True,
                       encoding="utf-8", errors="replace", env=env)
    ok = r.returncode == 0
    print(fid, "OK" if ok else "FAILED")
    if not ok:
        print("\n".join(l for l in r.stdout.splitlines() if "keentools" not in l)[-1500:])
        continue
    scene = re.search(r'start_film\("[^"]+", "([^"]+)"', src).group(1)
    times = [(float(a), float(b)) for a, b in re.findall(r"say\('[^']*', '[^']*', ([\d.]+), ([\d.]+)\)", src)]
    frames = sorted(1 + int(30 * ((a + b) / 2 + 0.6)) for a, b in times)[:14] or [60, 500, 1000, 1500, 2000]
    if "MA.append" in src:
        frames = [466 + 480 * k for k in range(10)]
    subprocess.run([sys.executable, S("p2", "preview.py"), scene, *map(str, frames), "--pct", "30", "--out", "u" + fid],
                   capture_output=True, env=env)
