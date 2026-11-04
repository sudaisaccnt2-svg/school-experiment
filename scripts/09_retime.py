# ---- 09: retime the film (run last; applied once, never changes the current frame) ----
# Stretches each act by its own factor by remapping EVERY keyframe (objects, curve/trail data, labels, cameras),
# the camera-cut markers and the scene length. Breakpoints are the act boundaries, so no particle flight straddles
# two factors: particles, their trails and scintillations stay exactly in sync, and camera moves stay linear.
SEGMENTS = [      # (start frame, end frame, stretch factor), in the original 1260-frame timing
    (1, 250, 1.3),      # intro: title and apparatus labels get time to be read
    (250, 660, 1.8),    # the experiment: close-up + alpha stream (the fastest part)
    (660, 960, 1.8),    # inside the foil: Coulomb scattering + conclusions
    (960, 1260, 1.5),   # planetary model: the five points
]


def remap(f):
    if f <= SEGMENTS[0][0]:
        return f
    out = SEGMENTS[0][0]
    for a, b, k in SEGMENTS:
        if f <= b:
            return out + (f - a) * k
        out += (b - a) * k
    a, b, k = SEGMENTS[-1]
    return out + (f - b) * k


def all_fcurves(act):
    try:
        found = False
        for layer in act.layers:
            for strip in layer.strips:
                for cb in strip.channelbags:
                    found = True
                    yield from cb.fcurves
        if found:
            return
    except AttributeError:
        pass
    yield from act.fcurves


if scene.get("retime_applied"):
    print("retime already applied:", scene["retime_applied"])
else:
    n = 0
    for act in bpy.data.actions:
        for fc in all_fcurves(act):
            for k in fc.keyframe_points:
                x = k.co.x
                nx = remap(x)
                # handles keep their offsets scaled by the local factor
                k.handle_left.x = nx + (k.handle_left.x - x) * (remap(x + 1e-3) - nx) / 1e-3
                k.handle_right.x = nx + (k.handle_right.x - x) * (remap(x + 1e-3) - nx) / 1e-3
                k.co.x = nx
                n += 1
            fc.update()
    for m in scene.timeline_markers:
        m.frame = round(remap(m.frame))
    scene.frame_end = round(remap(scene.frame_end))
    scene["retime_applied"] = str(SEGMENTS)
    print("retimed %d keyframes; film is now %d frames (%.1f s)" % (n, scene.frame_end, scene.frame_end / scene.render.fps))
    print("cuts:", [(m.frame, m.camera.name) for m in sorted(scene.timeline_markers, key=lambda m: m.frame) if m.camera])
