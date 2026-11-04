"""Render preview stills of a scene from a snapshot of the live Blender session, plus one contact sheet.
Usage:  python scripts/p2/preview.py "<scene name>" 120 480 900 [--pct 40] [--out name]
Writes renders/p2/<out>_<frame>.jpg and renders/p2/<out>_sheet.jpg (look at the sheet)."""
import json, os, socket, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BLENDER = r"C:\Program Files\Blender Foundation\Blender 4.5\blender.exe"
OUT = os.path.join(ROOT, "renders", "p2")


def snapshot():
    path = os.path.join(tempfile.gettempdir(), "p2_preview_snapshot.blend").replace("\\", "/")
    code = "import bpy\nbpy.ops.wm.save_as_mainfile(filepath=%r, copy=True, relative_remap=True)\nprint('snapshot ok')" % path
    try:
        s = socket.create_connection(("localhost", 9876), timeout=10)
    except OSError:                       # no live Blender: render from the saved working file (bgsend.py saves it)
        return os.environ.get("BGSEND_BLEND") or os.path.join(ROOT, "2 school experiment.blend")
    s.settimeout(600)
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
    if b"snapshot ok" not in data:
        sys.exit("snapshot failed: " + data.decode()[:500])
    return path


def main():
    args = sys.argv[1:]
    scene = args.pop(0)
    pct, out = 40, None
    if "--pct" in args:
        i = args.index("--pct"); pct = int(args[i + 1]); del args[i:i + 2]
    if "--out" in args:
        i = args.index("--out"); out = args[i + 1]; del args[i:i + 2]
    frames = [int(a) for a in args]
    out = out or "".join(ch if ch.isalnum() else "_" for ch in scene)[:24]
    os.makedirs(OUT, exist_ok=True)
    snap = snapshot()
    expr = f"""
import bpy, os
sc = bpy.context.scene
r = sc.render
r.resolution_percentage = {pct}
r.use_motion_blur = False
if r.engine == 'CYCLES':
    sc.cycles.samples = 24
    sc.cycles.use_adaptive_sampling = True
else:
    sc.eevee.taa_render_samples = 12
r.image_settings.file_format = 'JPEG'
r.image_settings.quality = 85
for f in {frames}:
    sc.frame_set(f)
    r.filepath = os.path.join(r'{OUT}', '{out}_%04d.jpg' % f)
    bpy.ops.render.render(write_still=True)
    print('RENDERED', f)
"""
    p = subprocess.run([BLENDER, "-b", snap, "-S", scene, "--python-expr", expr], capture_output=True, text=True,
                       encoding="utf-8", errors="replace")
    done = [l for l in p.stdout.splitlines() if l.startswith("RENDERED")]
    if len(done) != len(frames):
        print(p.stdout[-3000:], p.stderr[-2000:])
    from PIL import Image, ImageDraw
    ims = []
    for f in frames:
        fp = os.path.join(OUT, "%s_%04d.jpg" % (out, f))
        if os.path.exists(fp):
            im = Image.open(fp).convert("RGB")
            im.thumbnail((960, 540))
            ImageDraw.Draw(im).text((8, 6), str(f), fill=(255, 80, 80))
            ims.append(im)
    if ims:
        cols = 2 if len(ims) > 1 else 1
        w, h = ims[0].size
        rows = (len(ims) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * w, rows * h))
        for i, im in enumerate(ims):
            sheet.paste(im, ((i % cols) * w, (i // cols) * h))
        sp = os.path.join(OUT, out + "_sheet.jpg")
        sheet.save(sp, quality=82)
        print("SHEET", sp, sheet.size)


if __name__ == "__main__":
    main()
