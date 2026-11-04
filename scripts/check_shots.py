# Verify the cinematography on a snapshot copy (run in background Blender; frame changes are harmless there):
#   blender -b <snapshot.blend> --python scripts/check_shots.py
import bpy
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

s = bpy.context.scene
SUBJ = {"CamMain": Vector((-2.2, 0, 0.8)), "CamSource": Vector((-4.9, 0, 0.8)),
        "CamAtomic": Vector((60, 0, 10)), "CamModel": Vector((114, 0, 10))}
cuts = sorted((m.frame, m.camera.name) for m in s.timeline_markers if m.camera)
ends = [c[0] for c in cuts[1:]] + [s.frame_end + 1]


def rect(ob, cam):
    pts = [world_to_camera_view(s, cam, ob.matrix_world @ Vector(c)) for c in ob.bound_box]
    if any(p.z <= 0 for p in pts):
        return None
    return min(p.x for p in pts), max(p.x for p in pts), min(p.y for p in pts), max(p.y for p in pts)


problems = []
for (f0, name), f1 in zip(cuts, ends):
    cam = bpy.data.objects[name]
    track, prev, speeds = [], None, []
    for f in range(f0, f1, 6):
        s.frame_set(f)
        p = world_to_camera_view(s, cam, SUBJ[name])
        track.append((round(p.x, 3), round(p.y, 3)))
        pos = cam.matrix_world.translation.copy()
        if prev is not None:
            speeds.append((pos - prev).length)
        prev = pos
        labels = [o for o in bpy.data.collections["Labels"].objects if o.type == 'FONT' and o.parent is None
                  and o.matrix_world.to_scale().length > 0.5]
        for o in labels:
            r = rect(o, cam)
            if r is None or r[1] < 0 or r[0] > 1 or r[3] < 0 or r[2] > 1:
                continue      # other zone / behind camera
            if r[0] < 0.01 or r[1] > 0.99 or r[2] < 0.01 or r[3] > 0.99:
                problems.append((f, name, o.name, tuple(round(v, 2) for v in r)))
    xs, ys = [t[0] for t in track], [t[1] for t in track]
    print("%-9s %4d-%4d subject screen x %.3f-%.3f y %.3f-%.3f | speed/6fr min %.3f max %.3f" % (
        name, f0, f1 - 1, min(xs), max(xs), min(ys), max(ys), min(speeds or [0]), max(speeds or [0])))
seen = set()
for f, cam, lab, r in problems:
    if (cam, lab) not in seen:
        seen.add((cam, lab))
        print("CLIPPED", f, cam, lab, r)
print("clipped labels:", len(seen))
