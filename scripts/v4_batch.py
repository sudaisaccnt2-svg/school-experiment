"""Build films in Blender's background mode and render a preview still per caption beat.
Usage: python scripts/v4_batch.py u4 401 402 ...   (unit libs are chosen from the unit; uses bgsend.py + preview.py)"""
import os, re, subprocess, sys, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = lambda *p: os.path.join(ROOT, "scripts", *p)
LIBS = {"u4": ["u3/u3lib.py", "u4/u4lib.py"], "u5": ["u3/u3lib.py", "u4/u4lib.py", "u5/u5lib.py"],
        "u6": ["u3/u3lib.py", "u4/u4lib.py", "u5/u5lib.py", "u6/u6lib.py"],
        "u7": ["u3/u3lib.py", "u4/u4lib.py", "u5/u5lib.py", "u6/u6lib.py", "u7/u7lib.py"],
        "u8": ["u3/u3lib.py", "u4/u4lib.py", "u5/u5lib.py", "u6/u6lib.py", "u7/u7lib.py"],
        "u3": ["u3/u3lib.py"]}
unit, ids = sys.argv[1], sys.argv[2:]
for fid in ids:
    f = glob.glob(S(unit, "f%s_*.py" % fid))[0]
    src = open(f, encoding="utf-8").read()
    files = [S("common.py"), S("p2", "lib.py")] + [S(x) for x in LIBS[unit]] + [S("v4lib.py")] + ([S("u8", "u8lib.py")] if unit == "u8" else []) + [f]
    r = subprocess.run([sys.executable, S("bgsend.py")] + files, capture_output=True, text=True, encoding="utf-8", errors="replace")
    ok = [l for l in r.stdout.splitlines() if "FILM OK" in l or "Error" in l or "Traceback" in l or "line " in l]
    print(fid, "BUILD", "ok" if r.returncode == 0 else "FAILED", *ok[-6:], sep="\n  ")
    if r.returncode:
        print(r.stdout[-3000:])
        continue
    scene = re.search(r'start_film\("[^"]+", "([^"]+)"', src).group(1)
    times = [(float(a), None if b == "None" else float(b)) for a, b in re.findall(r"say\('[^']*', '[^']*', ([\d.]+), ([\d.]+|None)\)", src)]
    times += [(float(a), None if b == "None" else float(b)) for a, b in re.findall(r'say\("[^"]*", "[^"]*", ([\d.]+), ([\d.]+|None)\)', src)]
    times.sort()
    frames = [1 + int(30 * ((a + (b if b else a + 4)) / 2 + 0.6)) for a, b in times][:12]
    if "MA.append" in src:                      # MCQ films: the model + why line of each question
        frames = [466 + 480 * k for k in range(10)]
    if not frames:
        frames = [60, 600, 1200, 1800]
    subprocess.run([sys.executable, S("p2", "preview.py"), scene, *map(str, frames), "--pct", "30", "--out", "u" + fid],
                   capture_output=True)
    print("  sheet renders/p2/u%s_sheet.jpg" % fid)
