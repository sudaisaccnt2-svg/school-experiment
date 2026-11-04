# ---- Film 01, Act 5: Defects in Rutherford's Atomic Model (textbook p.44, Fig 2.5) ----
# Runs inside the Rutherford scene ("Scene"), appended after common.py + p2/lib.py. Re-runnable: removes its own
# "D5 ..." objects first and keeps the earlier acts untouched (only frame_end, one marker and render-visibility keys).
use_scene("Scene")
PFX = "D5"
clear_film_objects()
for m in [m for m in scene.timeline_markers if m.name.startswith("D5 ")]:
    scene.timeline_markers.remove(m)

F5 = scene.get("act5_start") or (scene.frame_end + 1)          # 1606: right after the planetary model
scene["act5_start"] = F5
DUR = 64.0
scene.frame_end = F5 + int(DUR * FPS) - 1
s = lambda t: sec(t, F5)
O = Vector((180.0, 0.0, 10.0))
R0 = 3.4

# ---- render visibility: earlier acts off from F5 (Cycles optimisation; ignored by the web export) ----
for ob in scene.objects:
    if ob.name.startswith("D5 ") or ob.type == 'CAMERA':
        continue
    ad = ob.animation_data
    if ad and ad.action and any(fc.data_path == "hide_render" for fc in _fcurves(ob)):
        kf(ob, "hide_render", F5, True, 'CONSTANT')

# ---- camera (same lens / eye-trace shift / drift as the planetary-model shot) ----
cam = camera("CamDefects", 40, O + Vector((-1.5, -24, 0.6)), O + Vector((1.5, -21.5, 0.3)), O, F5, scene.frame_end)
cut(F5, cam)

# ---- backdrop (as in the other atomic zones) ----
bd = bpy.data.objects.new(N("Backdrop"), bpy.data.objects["Model Backdrop"].data)
put(bd, "Models")
bd.location = O + Vector((6, 6, 0))
bd.rotation_euler = (math.radians(90), 0, 0)

# ---- titles ----
label("Title", "Defects in Rutherford's Atomic Model", O + Vector((5.0, 0, 4.36)), 0.55, s(0.2), mat=M["gold"])

# ---- the atom: nucleus + orbit, in the plane facing the camera (slightly tilted) ----
root = empty("Atom", O, rot=((90 - 14) * DEG, 0, 0))
appear(root, s(0.6), dur=12)
nuc, _ = nucleus("Nucleus", 6, 6, root, seed=3)
spin(nuc, F5, scene.frame_end, 0.35, axis=2)
ring = ring_curve("Orbit", R0, M["orbit_dim"], root)

# electron A: steady orbit, then (Maxwell) it radiates and spirals in (Fig 2.5)
grpA = empty("Spiral Group", (0, 0, 0), root)
eA = electron("Electron A", grpA, (R0, 0, 0), 0.15)
v_arrow = arrow("Velocity", 0.95 / (0.15 / 0.11), M["cyan"], eA, (0, 0, 0), (0, 0, math.pi / 2), r=0.035, head=0.2)
w0 = 2 * math.pi / 90.0                    # one turn per 3 s
t_rad, t_spiral, t_hit = 12.5, 14.0, 24.0
fa, fs, fh = s(0.6), s(t_spiral), s(t_hit)
theta, r = 0.0, R0
path, rad_frames = [], []
for f in range(fa, fh + 1):
    if f > fs:
        u = (f - fs) / (fh - fs)
        r = max(R0 * (1 - u) ** (1 / 3), 0.55)      # classical radiation collapse: r^3 falls linearly
    w = min(w0 * (R0 / r) ** 1.5, 0.55)
    theta += w
    pos = (r * math.cos(theta), r * math.sin(theta), 0)
    step = 1 if f >= fs - 2 else 2
    if (f - fa) % step == 0 or f == fh:
        kf(eA, "location", f, pos, 'LINEAR')
        kf(eA, "rotation_euler", f, (0, 0, theta), 'LINEAR')
    if f >= fs:
        path.append(pos)
    rad_frames.append((f, theta, r))
kf(eA, "scale", fh, tuple(eA.scale), 'CONSTANT')
kf(eA, "scale", fh + 1, (0, 0, 0), 'CONSTANT')

# the spiral trail (draws on with the electron; the app rebuilds it from the electron's motion)
trail = pcurve("Spiral Trail", path, mat_emit("Spiral Trail", (0.25, 0.6, 1.0), 2.5), depth=0.018, cname="Models",
               parent=grpA)
cu = trail.data
kf(cu, "bevel_factor_end", 0, 0.0, 'CONSTANT')
kf(cu, "bevel_factor_end", fs, 0.0, 'LINEAR')
kf(cu, "bevel_factor_end", fs + len(path) - 1, 1.0, 'LINEAR')
trail["trail_of"] = eA.name
hide_from(grpA, s(29.0))

# radiation: a photon leaves the electron every 8 frames; its colour climbs from red to violet as the orbit
# speeds up (Maxwell: the light would change continuously -> a continuous spectrum)
k = 0
for f, th, rr in rad_frames:
    if f < s(t_rad) or (f - s(t_rad)) % 8:
        continue
    u = min(1.0, (f - s(t_rad)) / (fh - s(t_rad)))
    nm = 690 - 290 * u
    pm = mat_emit("Photon %d" % int(nm // 10 * 10), wavelength_rgb(int(nm // 10 * 10)), 9.0)
    ph = squiggle("Photon %02d" % k, pm, length=0.9, waves=3, amp=0.1, r=0.03, parent=root)
    d = Vector((math.cos(th), math.sin(th), 0))
    p0 = d * (rr + 0.25)
    p1 = d * (rr + 3.6)
    ph.rotation_euler = (0, 0, th)
    kf(ph, "scale", 0, (0, 0, 0), 'CONSTANT')
    kf(ph, "scale", f, (1, 1, 1), 'CONSTANT')
    kf(ph, "scale", f + 26, (1, 1, 1), 'CONSTANT')
    kf(ph, "scale", f + 27, (0, 0, 0), 'CONSTANT')
    move(ph, f, f + 26, p0, p1, 'LINEAR')
    k += 1
print("photons:", k)
flash("Collapse Flash", (0, 0, 0), fh, 1.3, root, dur=16)

# electron B: real atoms are stable (respawns on the orbit)
pivB = empty("Pivot B", (0, 0, 0), root)
eB = electron("Electron B", pivB, (R0, 0, 0), 0.15)
hide_until(pivB, s(27.0))
spin(pivB, s(27.0), scene.frame_end, (scene.frame_end - s(27.0)) / 90.0)
flash("Respawn Flash", (R0, 0, 0), s(27.0) - 2, 0.45, root, dur=10)

# labels around the atom (out before the atom moves)
label("Lbl Nucleus", "nucleus (+)", O + Vector((1.3, -0.3, -4.7)), 0.3, s(1.6), s(14.0), anchor=O + Vector((0.15, 0, -0.65)))
label("Lbl Electron", "electron (−) revolving\naround the nucleus", O + Vector((-4.0, -0.3, 4.3)), 0.3, s(2.2), s(14.0),
      anchor=O + Vector((-1.7, 0.71, 2.85)))
label("Lbl Fig", "Fig 2.5: losing energy, the electron\nspirals into the nucleus", O + Vector((0, -0.3, -4.85)), 0.3,
      s(15.0), s(24.0), mat=M["cyan"])
label("Lbl Collapse", "✗  the atom would collapse", O + Vector((0, -0.3, -4.7)), 0.34, s(24.4), s(27.2), mat=M["red"])
label("Lbl Stable", "✓  but real atoms are stable", O + Vector((0, -0.3, -4.7)), 0.34, s(27.6), s(31.0), mat=M["green"])

# ---- point 3: expected vs observed spectrum (the atom moves up and shrinks to make room) ----
for f, loc, sc_ in ((s(31.0), O, 1.0), (s(32.6), O + Vector((0, 0, 1.25)), 0.62)):
    kf(root, "location", f, loc, 'BEZIER')
    kf(root, "scale", f, (sc_,) * 3, 'BEZIER')
nms = [380 + 320 * x / 511 for x in range(512)]
cont = image_from_rgb("Spectrum Continuous", [[wavelength_rgb(n) for n in nms]] * 4)
lines_nm = (410.2, 434.0, 486.1, 656.3)
row = []
for n in nms:
    near = min(lines_nm, key=lambda L: abs(L - n))
    a = max(0.0, 1 - abs(near - n) / 1.6)
    c = wavelength_rgb(near)
    row.append((c[0] * a, c[1] * a, c[2] * a))
obs = image_from_rgb("Spectrum Lines H", [row] * 4)
SW, SH = 7.6, 0.72
X0 = O.x - SW / 2


def strip(name, img, z, f_in):
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=0.5)
    uv = bm.loops.layers.uv.verify()
    for fc in bm.faces:
        for l in fc.loops:
            l[uv].uv = (l.vert.co.x + 0.5, l.vert.co.y + 0.5)
    ob = mesh_from_bm(name, bm, mat_emit_image("D5 " + name, img, 2.2), "Models")
    ob.location = (O.x, O.y, z)
    ob.rotation_euler = (math.radians(90), 0, 0)
    ob.scale = (SW, SH, 1)
    overlay_only(ob)
    kf(ob, "scale", 0, (0, 0, 0), 'CONSTANT')
    kf(ob, "scale", f_in, (SW, 0, 1), 'BEZIER')
    kf(ob, "scale", f_in + 10, (SW, SH, 1), 'BEZIER')
    pop_out(ob, s(51.0), 6, (SW, SH, 1))
    return ob


Z1, Z2 = O.z - 2.75, O.z - 4.75
strip("Strip Continuous", cont, Z1, s(33.5))
label("Lbl Expected", "Expected from Rutherford's model: a continuous spectrum", Vector((X0, -0.3, Z1 + 0.68)), 0.26,
      s(33.0), s(51.0), align='LEFT')
strip("Strip Lines", obs, Z2, s(37.0))
label("Lbl Observed", "Actually observed (hydrogen): a LINE spectrum", Vector((X0, -0.3, Z2 + 0.68)), 0.26, s(36.5),
      s(51.0), align='LEFT')
label("Mark Expected", "✗", Vector((X0 + SW + 0.45, -0.3, Z1)), 0.55, s(40.0), s(51.0), mat=M["red"])
label("Mark Observed", "✓", Vector((X0 + SW + 0.45, -0.3, Z2)), 0.55, s(40.6), s(51.0), mat=M["green"])
for i, n in enumerate((400, 500, 600, 700)):
    label("Tick %d" % n, "%d nm" % n, Vector((X0 + SW * (n - 380) / 320, -0.3, Z2 - 0.66)), 0.21, s(37.6), s(51.0),
          mat=M["dim"])

# ---- the four defects (screen-space text, right half) ----
PTS = [
    (3.0, "1. It is based on the laws of motion and gravitation,\n    which apply to neutral bodies, not to charged\n    particles like electrons."),
    (11.0, "2. Maxwell's theory: a charged particle moving in a\n    circle gives out energy continuously. The electron\n    should lose energy and fall into the nucleus.\n    This does not happen: atoms are stable."),
    (31.0, "3. Continuous loss of energy should give a\n    continuous spectrum, but a LINE spectrum is\n    actually obtained."),
    (45.0, "4. It does not explain the chemical properties\n    of the elements."),
]
v = 0.80
for i, (t, body) in enumerate(PTS):
    hud("Point %d" % (i + 1), body, cam, 0.495, v, 0.033, s(t), s(51.0), valign='TOP')
    v -= 0.041 * (body.count("\n") + 1) + 0.032

# ---- Society, Technology and Science box, then the hand-over to Bohr ----
g = hud_group("STS", cam, 0.735, 0.53, s(51.6), None)
U = hud_unit(cam)
panel("STS Panel", g, 0, 0, 0.48 * ASPECT * U, 0.5 * U, edge=M["gold_edge"])
child_text("STS Head", "Society, Technology and Science", g, 0, 0.198 * U, 0.042 * U, M["gold"], align='CENTER')
child_text("STS Body", "Rutherford proposed his model in 1911. It stood\n"
           "unchallenged for a long time, but it could not explain\n"
           "why an atom is stable, or why it gives a line spectrum.\n\n"
           "In 1913 Niels Bohr overcame this difficulty using\n"
           "Max Planck's quantum theory of radiation, which\n"
           "explains both. New experiments help chemists to\n"
           "build new explanations and theories.",
           g, -0.22 * ASPECT * U, 0.14 * U, 0.032 * U, align='LEFT', valign='TOP')
hud("Next", "Next: Niels Bohr's Atomic Theory  →", cam, 0.735, 0.2, 0.04, s(57.5), None, M["gold"], align='CENTER')

for ob in scene.objects:          # render visibility for this act only (matches 07_optimize)
    if ob.name.startswith("D5 ") and ob.type != 'CAMERA':
        kf(ob, "hide_render", 1, True, 'CONSTANT')
        kf(ob, "hide_render", F5, False, 'CONSTANT')
finish_film()
print("defects act: frames", F5, "-", scene.frame_end)
