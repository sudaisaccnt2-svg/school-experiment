# Compute label positions that stay inside the frame for the shots they appear in (run on a snapshot copy):
#   blender -b <snapshot.blend> --python scripts/fit_labels.py   -> prints LABEL_POS json
import bpy, json
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

s = bpy.context.scene
M = 0.03   # safe margin (fraction of frame)
cuts = sorted((m.frame, m.camera.name) for m in s.timeline_markers if m.camera)
ends = [c[0] for c in cuts[1:]] + [s.frame_end + 1]


def cam_at(f):
    return bpy.data.objects[[n for (a, n), b in zip(cuts, ends) if a <= f < b][0]]


labels = [o for o in bpy.data.collections["Labels"].objects if o.type == 'FONT' and o.parent is None]
moved = {}
for it in range(6):
    worst = {}
    for f in range(1, s.frame_end + 1, 4):
        s.frame_set(f)
        cam = cam_at(f)
        for o in labels:
            if o.matrix_world.to_scale().length < 0.5:
                continue
            pts = [world_to_camera_view(s, cam, o.matrix_world @ Vector(c)) for c in o.bound_box]
            if any(p.z <= 0 for p in pts):
                continue
            x0, x1 = min(p.x for p in pts), max(p.x for p in pts)
            y0, y1 = min(p.y for p in pts), max(p.y for p in pts)
            if x1 < 0 or x0 > 1 or y1 < 0 or y0 > 1:
                continue
            dx = max(0, M - x0) - max(0, x1 - (1 - M))
            dy = max(0, M - y0) - max(0, y1 - (1 - M))
            if dx or dy:
                w = worst.setdefault(o.name, [0, 0, f, cam.name, pts[0].z])
                if abs(dx) > abs(w[0]): w[0], w[2], w[3], w[4] = dx, f, cam.name, pts[0].z
                if abs(dy) > abs(w[1]): w[1] = dy
    if not worst:
        break
    for name, (dx, dy, f, cname, depth) in worst.items():
        s.frame_set(f)
        cam = bpy.data.objects[cname]
        fr = [cam.matrix_world @ v for v in cam.data.view_frame(scene=s)]
        # frame size in world units at distance 1 (view_frame is at the sensor plane in camera space)
        vf = cam.data.view_frame(scene=s)
        width1 = (vf[0] - vf[3]).length / abs(vf[0].z)
        height1 = (vf[0] - vf[1]).length / abs(vf[0].z)
        R = cam.matrix_world.to_3x3()
        o = bpy.data.objects[name]
        o.location += R @ Vector((dx * width1 * depth * 1.1, dy * height1 * depth * 1.1, 0))
        moved[name] = [round(v, 3) for v in o.location]
    print("pass", it, "fixed", len(worst))
print("LABEL_POS=" + json.dumps(moved))
