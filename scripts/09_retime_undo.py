# ---- undo 09_retime (restores original animation speed; never changes the current frame) ----
import ast
if not scene.get("retime_applied"):
    print("no retime to undo")
else:
    SEG = ast.literal_eval(scene["retime_applied"])

    def forward(f):
        if f <= SEG[0][0]:
            return f
        out = SEG[0][0]
        for a, b, k in SEG:
            if f <= b:
                return out + (f - a) * k
            out += (b - a) * k
        return out + (f - SEG[-1][1]) * SEG[-1][2]

    def inverse(g):            # forward() is piecewise linear and increasing: invert per segment
        if g <= SEG[0][0]:
            return g
        out = SEG[0][0]
        for a, b, k in SEG:
            span = (b - a) * k
            if g <= out + span:
                return a + (g - out) / k
            out += span
        return SEG[-1][1] + (g - out) / SEG[-1][2]

    def all_fcurves(act):
        for layer in act.layers:
            for strip in layer.strips:
                for cb in strip.channelbags:
                    yield from cb.fcurves

    n = 0
    for act in bpy.data.actions:
        for fc in all_fcurves(act):
            for k in fc.keyframe_points:
                g = k.co.x
                x = inverse(g)
                slope = (inverse(g + 1e-3) - x) / 1e-3
                k.handle_left.x = x + (k.handle_left.x - g) * slope
                k.handle_right.x = x + (k.handle_right.x - g) * slope
                k.co.x = x
                n += 1
            fc.update()
    for m in scene.timeline_markers:
        m.frame = round(inverse(m.frame))
    scene.frame_end = round(inverse(scene.frame_end))
    del scene["retime_applied"]
    print("undone: %d keyframes back to original speed; film %d frames" % (n, scene.frame_end))
    print("cuts:", [(m.frame, m.camera.name) for m in sorted(scene.timeline_markers, key=lambda m: m.frame) if m.camera])
