# ---- Focus audit: find moments where things move in two or more separate parts of the screen ----
# Run:  python scripts/bsend.py scripts/p2/audit_focus.py            (all topic scenes + "Scene")
# Set AUDIT_SCENES = ["05 Sub-shells s p d f"] before this file to limit it. Prints windows (seconds) and the
# names of what moves in each screen region. HUD text (camera children) is ignored; only world objects count.
import bpy, os
LINES = []
_print = print
print = lambda *a: LINES.append(" ".join(str(x) for x in a))
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

STEP, DT, GAP = 6, 2, 0.2          # sample every 6 frames; motion = change over 2 frames; regions > 20 % apart

try:
    SCENES = AUDIT_SCENES
except NameError:
    SCENES = [s.name for s in bpy.data.scenes]


def under_camera(ob):
    p = ob.parent
    while p:
        if p.type == 'CAMERA':
            return True
        p = p.parent
    return False


def state(sc, obs):
    out = {}
    for ob in obs:
        m = ob.matrix_world
        out[ob.name] = (m.translation.copy(), m.to_scale().length, m.to_quaternion())
    return out


def is_label(ob):
    return (ob.type == 'FONT' or "Shadow" in ob.name or ob.name.split(" ", 1)[-1].startswith("Lbl")
            or any("Labels" in c.name for c in ob.users_collection))


def root_of(ob):
    while ob.parent and ob.parent.type != 'CAMERA':
        ob = ob.parent
    return ob.name.split(" ", 1)[-1]


def audit(sc):
    bpy.context.window.scene = sc
    obs = [o for o in sc.objects if o.type in ('MESH', 'CURVE', 'FONT') and not under_camera(o)
           and "Trail" not in o.name and not is_label(o)]
    report, f = [], sc.frame_start
    while f < sc.frame_end - DT:
        sc.frame_set(f)
        cam = sc.camera
        a = state(sc, obs)
        sc.frame_set(f + DT)
        b = state(sc, obs)
        pts = []
        for ob in obs:
            (p0, s0, q0), (p1, s1, q1) = a[ob.name], b[ob.name]
            turned = q0.rotation_difference(q1).angle > 0.01 and ob.dimensions.length > 0.3
            if s1 < 1e-4 or ((p1 - p0).length < 0.004 and abs(s1 - s0) < 0.004 and not turned):
                continue
            v = world_to_camera_view(sc, cam, p1)
            if v.z <= 0 or not (-0.05 < v.x < 1.05 and -0.05 < v.y < 1.05):
                continue
            pts.append((v.x, v.y, root_of(ob)))
        groups = []
        for x, y, n in pts:
            hit = [g for g in groups if any(abs(x - gx) < GAP and abs(y - gy) < GAP for gx, gy, _ in g)]
            merged = [(x, y, n)]
            for g in hit:
                merged += g
                groups.remove(g)
            groups.append(merged)
        roots = sorted({n for _, _, n in pts})
        if len(roots) > 1 or len(groups) > 1:
            report.append((f, ["R%d C%d" % (len(roots), len(groups))] + [sorted({n for _, _, n in g})[:5] for g in groups]))
        f += STEP
    # merge consecutive samples into windows
    fps = sc.render.fps
    wins = []
    for f, gs in report:
        if wins and f - wins[-1][1] <= STEP:
            wins[-1][1] = f
        else:
            wins.append([f, f, gs])
    print("== %s: %d busy windows" % (sc.name, len(wins)))
    for f0, f1, gs in wins:
        if f1 == f0:            # one sample only: things popping in/out together at a cut
            continue
        print("  %5.1f-%5.1f s  %s" % (f0 / fps, f1 / fps, " | ".join(g if isinstance(g, str) else ", ".join(g) for g in gs)))


win = bpy.context.window
orig = win.scene
for name in SCENES:
    if name in bpy.data.scenes:
        audit(bpy.data.scenes[name])
win.scene = orig
OUT = os.path.join(os.path.dirname(bpy.data.filepath), "renders", "p2", "audit_focus.txt")
open(OUT, "w", encoding="utf-8").write(chr(10).join(LINES) + chr(10))
_print("AUDIT", OUT, len(LINES))
