# ---- 08: cinematography pass (run after 06; safe to re-run, never changes the current frame) ----
# Rules:
#  1. Eye trace: every shot's subject sits on the SAME screen point (rule-of-thirds spot taken from the hand-framed
#     close-up: where the collimator hole is in CamSource), so the eye never has to jump at a cut.
#     Cameras track their subject and a lens shift moves it from frame centre onto that point.
#  2. One direction: every camera trucks to its right (plus a slight push-in), so screen motion always flows the same way.
#  3. Linear motion: straight-line paths with LINEAR keys (constant speed, no easing).
#  4. Focus: depth of field focuses on the subject.
from bpy_extras.object_utils import world_to_camera_view
if scene.get("retime_applied") or scene.get("holds_applied"):
    raise SystemExit("08 uses the original 1260-frame timing: rebuild (01..08) before 09_retime, don't re-run it on a retimed scene")


def clear_path(ob, path):
    ad = ob.animation_data
    if not ad or not ad.action:
        return
    try:
        coll = ad.action.fcurves
        for fc in [f for f in coll if f.data_path == path]:
            coll.remove(fc)
    except Exception:
        for layer in ad.action.layers:
            for strip in layer.strips:
                cb = strip.channelbag(ad.action_slot)
                if cb:
                    for fc in [f for f in cb.fcurves if f.data_path == path]:
                        cb.fcurves.remove(fc)


bpy.context.view_layer.update()
aspect = scene.render.resolution_x / scene.render.resolution_y
src = bpy.data.objects["CamSource"]
HOLE = Vector((-4.9, 0.0, 0.8))                     # mouth of the collimator hole
F = world_to_camera_view(scene, src, HOLE)          # the film's eye-trace point (0..1 screen coords)
FX, FY = round(F.x, 4), round(F.y, 4)
print("eye-trace point (from the close-up):", FX, FY)


def shot(name, subject, start, end, f0, f1, fstop=None, shift=True):
    cam = bpy.data.objects[name]
    tgt = bpy.data.objects[name + " Target"]
    for ob in (cam, tgt):
        clear_path(ob, "location")
    tgt.location = subject
    cam.data.shift_x = (0.5 - FX) if shift else 0.0
    cam.data.shift_y = ((0.5 - FY) / aspect) if shift else 0.0
    kf(cam, "location", f0, Vector(start), 'LINEAR')
    kf(cam, "location", f1, Vector(end), 'LINEAR')
    cam.location = Vector(start)
    cam.data.dof.use_dof = fstop is not None
    if fstop:
        cam.data.dof.focus_object = tgt
        cam.data.dof.aperture_fstop = fstop


def orbit(s, d, el, az):
    s = Vector(s); el, az = math.radians(el), math.radians(az)
    return s + d * Vector((math.cos(el) * math.cos(az), math.cos(el) * math.sin(az), math.sin(el)))


# Apparatus overview (frames 1-660, the close-up cuts in between): subject = the alpha beam in flight.
# Azimuth increases = camera trucks to its right around the bench.
S_BEAM = (-2.2, 0.0, 0.8)
shot("CamMain", S_BEAM, orbit(S_BEAM, 12.5, 32, -76), orbit(S_BEAM, 11.0, 32, -60), 1, 660, fstop=8.0)

# Close-up (250-340): keeps the hand-set framing; trucks right and eases in a little. No shift: it defines the point.
right = (src.matrix_world.to_3x3() @ Vector((1, 0, 0))).normalized()
fwd = (src.matrix_world.to_3x3() @ Vector((0, 0, -1))).normalized()
P0 = Vector((-3.291, -2.689, 1.396))
shot("CamSource", tuple(bpy.data.objects["CamSource Target"].location), P0, P0 + right * 0.3 + fwd * 0.12, 250, 340,
     fstop=2.8, shift=False)

# Inside the foil (660-960): subject = the gold lattice where the scattering happens.
shot("CamAtomic", (60.0, 0.0, 10.0), (58.5, -26.0, 10.6), (61.5, -23.0, 10.3), 660, 960, fstop=None)

# Planetary model (960-1260): subject = the nucleus.
shot("CamModel", (114.0, 0.0, 10.0), (112.5, -24.0, 10.6), (115.5, -21.5, 10.3), 960, 1260, fstop=None)
print("cinematography applied")

# Labels re-fitted to the new framings (computed by scripts/fit_labels.py on a snapshot); leader lines re-attached.
LABEL_POS = {
    "Lbl Lead": (-4.661, 0.214, 2.3), "Lbl Po": (-4.0, -1.4, 0.5), "Obs Straight": (3.626, -2.628, 2.634),
    "Atomic Cloud": (55.656, -0.171, 13.9), "Atomic Title": (60.0, -0.011, 14.762), "Model Title": (120.0, -0.006, 14.36),
    "Conclusion 1": (54.7, 0.0, 6.1), "Conclusion 2": (54.7, 0.0, 5.48), "Conclusion 3": (54.7, 0.0, 4.86),
}
for n, p in LABEL_POS.items():
    o = bpy.data.objects.get(n)
    if not o:
        continue
    o.location = p
    ln = bpy.data.objects.get(n + " Line")
    if ln and ln.type == 'CURVE':
        pts = ln.data.splines[0].points
        anchor = Vector(pts[-1].co[:3])
        start = Vector(p) + (anchor - Vector(p)).normalized() * o.data.size * 0.9
        pts[0].co = (*start, 1)
print("labels re-fitted:", len(LABEL_POS))

# The polonium label sits where the close-up camera looks: cut it (and its leader line) out exactly on the cuts.
po, po_line = bpy.data.objects.get("Lbl Po"), bpy.data.objects.get("Lbl Po Line")
if po and not po.get("closeup_cut"):
    kf(po, "scale", 249, (1, 1, 1), 'BEZIER')
    kf(po, "scale", 250, (0, 0, 0), 'CONSTANT')
    kf(po, "scale", 340, (1, 1, 1), 'BEZIER')
    if po_line:
        kf(po_line.data, "bevel_factor_end", 249, 1.0, 'BEZIER')
        kf(po_line.data, "bevel_factor_end", 250, 0.0, 'CONSTANT')
        kf(po_line.data, "bevel_factor_end", 340, 1.0, 'BEZIER')
    po["closeup_cut"] = 1
