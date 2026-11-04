"""v4 caption pass for v3 builders (SKILL 'show, don't tell').
  dump:  python scripts/v4_caps.py dump scripts/u4/f4*.py          → prints every caps() row (key, head, body, t0, t1)
  apply: python scripts/v4_caps.py apply docs/v4caps_u4.txt         → rewrites the builders
The text file has one block per film:   == scripts/u4/f401_why.py
                                        A1 | Things roll down to low energy
                                        G  | -            (a dash drops the row; a dropped last 'Next' row ends the film)
Each kept row becomes say(key, text, t0, t1). If the film's last row is dropped, the film ends at the previous row's t1
(start_film length is cut) and that row keeps its end. Old builders are copied to backups/v3/."""
import ast, os, re, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def find_caps(s):
    i = s.index("caps([")
    j = i + len("caps(")
    depth, k = 0, j
    while True:
        c = s[k]
        if c == "[":
            depth += 1
        elif c == "]":
            depth -= 1
            if depth == 0:
                break
        k += 1
    end = s.index(")", k) + 1
    return i, end, ast.literal_eval(s[j:k + 1])


def dump(paths):
    for p in paths:
        s = open(p, encoding="utf-8").read()
        if "caps([" not in s:
            print("== %s  (no caps)" % p)
            continue
        _, _, rows = find_caps(s)
        m = re.search(r'start_film\("[^"]+", "[^"]+", ([\d.]+)', s)
        print("== %s  (%.0f s)" % (p.replace("\\", "/"), float(m.group(1)) if m else -1))
        for r in rows:
            key, head, body, t0 = r[:4]
            t1 = r[4] if len(r) > 4 else None
            print("%-4s %5.1f-%-5s | %s || %s" % (key, t0, "" if t1 is None else "%.1f" % t1, head, body or ""))


def apply(spec):
    blocks = {}
    cur = None
    for line in open(spec, encoding="utf-8"):
        line = line.rstrip("\n")
        if line.startswith("== "):
            cur = line[3:].split()[0]
            blocks[cur] = {}
        elif "|" in line and cur:
            k, t = line.split("|", 1)
            blocks[cur][k.strip()] = t.strip()
    for rel, new in blocks.items():
        p = os.path.join(ROOT, rel)
        s = open(p, encoding="utf-8").read()
        i, end, rows = find_caps(s)
        os.makedirs(os.path.join(ROOT, "backups", "v3"), exist_ok=True)
        bk = os.path.join(ROOT, "backups", "v3", os.path.basename(p))
        if not os.path.exists(bk):
            shutil.copy(p, bk)
        out, last_end = [], None
        for n, r in enumerate(rows):
            key, head, body, t0 = r[:4]
            t1 = r[4] if len(r) > 4 else None
            txt = new.get(key)
            assert txt is not None, (rel, key)
            if txt == "-":
                if n == len(rows) - 1:
                    last_end = t0
                continue
            out.append([key, txt, t0, t1])
        if last_end is not None and out and out[-1][3] is None:
            out[-1][3] = last_end
        lines = ["say(%r, %r, %s, %s)" % (k, t, t0, "None" if t1 is None else t1) for k, t, t0, t1 in out]
        s = s[:i] + "\n".join(lines) + s[end:]
        if last_end is not None:
            s = re.sub(r'(start_film\("[^"]+", "[^"]+", )([\d.]+)', lambda m: m.group(1) + "%.1f" % (last_end + 0.5), s, count=1)
            s = s.replace("END = scene.frame_end", "END = scene.frame_end")
        if "v4" not in s.split("\n")[0]:
            s = s.replace("\n", "  (v4 captions)\n", 1) if s.startswith("#") else s
        open(p, "w", encoding="utf-8", newline="\n").write(s)
        print("ok", rel, len(out), "captions", "end %.1f" % (last_end + 0.5) if last_end is not None else "")


if __name__ == "__main__":
    {"dump": lambda: dump(sys.argv[2:]), "apply": lambda: apply(sys.argv[2])}[sys.argv[1]]()
