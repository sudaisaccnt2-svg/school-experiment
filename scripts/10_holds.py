# ---- 10: longer shots without slow motion (run last; applied once; never changes the current frame) ----
# Inserts "holds" at calm moments (only the slow camera drift is moving there, found by checking every fcurve),
# so nothing else changes speed: particles, text pops and orbits run at their normal pace.
HOLDS = [          # (insert after this original frame, extra frames)
    (236, 45),     # end of intro: time to read the apparatus labels
    (615, 90),     # end of the experiment: the finished scatter pattern + result labels
    (910, 90),     # inside the foil: time to read the three conclusions
]
MODEL_EXTRA = 120  # planetary model: electrons keep orbiting (at normal speed) for 4 s more


def shift(x):
    return x + sum(d for f, d in HOLDS if x > f)


def all_fcurves(act):
    for layer in act.layers:
        for strip in layer.strips:
            for cb in strip.channelbags:
                yield from cb.fcurves


if scene.get("holds_applied"):
    print("holds already applied:", scene["holds_applied"])
elif scene.get("retime_applied"):
    print("undo the slow-motion retime first (09_retime_undo.py)")
else:
    n = 0
    for act in bpy.data.actions:
        for fc in all_fcurves(act):
            for k in fc.keyframe_points:
                d = shift(k.co.x) - k.co.x
                if d:
                    k.co.x += d; k.handle_left.x += d; k.handle_right.x += d
                    n += 1
            fc.update()
    for m in scene.timeline_markers:
        m.frame = round(shift(m.frame))
    total = sum(d for f, d in HOLDS)

    # planetary model: continue each electron's orbit (same formula and speed as 05_model.py)
    F0 = 940 + total
    a, b = 3.4, 1.5
    last = None
    for oi in range(3):
        speed = 2 * math.pi / (110 + 25 * oi)
        for ei in range(2):
            e = bpy.data.objects.get("Electron %d%d" % (oi, ei))
            if not e:
                continue
            ph = ei * math.pi + oi * 0.9
            fcs = [fc for act in [e.animation_data.action] for fc in all_fcurves(act) if fc.data_path == "location"]
            last = int(max(k.co.x for k in fcs[0].keyframe_points))
            for fr in range(last + 2, last + MODEL_EXTRA + 1, 2):
                t = ph + speed * (fr - F0)
                kf(e, "location", fr, (a * math.cos(t), b * math.sin(t), 0), 'LINEAR')
    nuc = bpy.data.objects.get("Nucleus")
    if nuc:   # nucleus keeps its slow linear spin
        fcs = [fc for fc in all_fcurves(nuc.animation_data.action) if fc.data_path == "rotation_euler"]
        for fc in fcs:
            k0, k1 = fc.keyframe_points[0], fc.keyframe_points[-1]
            rate = (k1.co.y - k0.co.y) / (k1.co.x - k0.co.x)
            fc.keyframe_points.insert(k1.co.x + MODEL_EXTRA, k1.co.y + rate * MODEL_EXTRA).interpolation = 'LINEAR'
            fc.update()
    scene.frame_end = 1260 + total + MODEL_EXTRA
    scene["holds_applied"] = str(HOLDS) + " +%d" % MODEL_EXTRA
    print("holds: shifted %d keys; film is now %d frames (%.1f s)" % (n, scene.frame_end, scene.frame_end / scene.render.fps))
    print("cuts:", [(m.frame, m.camera.name) for m in sorted(scene.timeline_markers, key=lambda m: m.frame) if m.camera])
