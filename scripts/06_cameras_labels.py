# ---- 06: cameras, camera cuts, titles, labels, leader lines; saves the .blend ----
for ob in list(coll("Cameras").objects):
    bpy.data.objects.remove(ob, do_unlink=True)
L = "Labels"
m_txt = mat_emit("Label White", (1.0, 1.0, 1.0), 1.6)
m_head = mat_emit("Label Gold", (1.0, 0.72, 0.28), 3.0)
m_green = mat_emit("Label Green", (0.3, 1.0, 0.5), 2.0)
m_line = mat_emit("Leader Line", (0.8, 0.85, 0.9), 1.2)
m_shadow_core = mat_emit("Label Shadow Core", (0, 0, 0), 0.0, alpha=0.8)
m_shadow_soft = mat_emit("Label Shadow Soft", (0, 0, 0), 0.0, alpha=0.4)


def add_shadow(t):
    """Soft drop shadow: two dark, thickened copies of the text, offset down-right and just behind it.
    Parented to the label, so it follows its pop-in scale and billboard rotation."""
    size = t.data.size
    for tag, mat, grow, alpha_off in (("Shadow", m_shadow_core, 0.05, 0.08), ("Shadow Soft", m_shadow_soft, 0.13, 0.10)):
        cu = t.data.copy()
        cu.materials.clear(); cu.materials.append(mat)
        cu.offset = size * grow
        sh = bpy.data.objects.new(t.name + " " + tag, cu)
        link(sh, L)
        sh.parent = t
        sh.location = (size * alpha_off, -size * alpha_off, -size * (0.02 if tag == "Shadow" else 0.035))
        overlay_only(sh)


def camera(name, lens, loc, target, fstop=None):
    cd = bpy.data.cameras.new(name); cd.lens = lens; cd.clip_end = 300
    cam = bpy.data.objects.new(name, cd); cam.location = loc; link(cam, "Cameras")
    tgt = bpy.data.objects.new(name + " Target", None); tgt.location = target; link(tgt, "Cameras")
    c = cam.constraints.new('TRACK_TO'); c.target = tgt; c.track_axis = 'TRACK_NEGATIVE_Z'; c.up_axis = 'UP_Y'
    if fstop:
        cd.dof.use_dof = True; cd.dof.focus_object = tgt; cd.dof.aperture_fstop = fstop
    return cam, tgt


def label(name, body, loc, size, frame, cam, mat=m_txt, anchor=None, align='CENTER', out=None):
    t = text_obj(name, body, loc, size, L, mat, align=align)
    overlay_only(t)
    add_shadow(t)
    if cam:
        c = t.constraints.new('TRACK_TO'); c.target = cam; c.track_axis = 'TRACK_Z'; c.up_axis = 'UP_Y'
    pop_in(t, frame, 8)
    if out:
        pop_out(t, out, 6, (1, 1, 1))
    if anchor:
        start = Vector(loc) + (Vector(anchor) - Vector(loc)).normalized() * size * 0.9
        ln = poly_curve(name + " Line", [start, anchor], L, m_line, depth=0.006 * size / 0.25, mapping='RESOLUTION')
        overlay_only(ln)
        draw_on(ln, frame + 4, 10)
        if out:
            kf(ln.data, "bevel_factor_end", out, 1.0, 'BEZIER')
            kf(ln.data, "bevel_factor_end", out + 6, 0.0, 'CONSTANT')
    return t


# ---------- cameras ----------
cam_main, tgt_main = camera("CamMain", 30, (1.0, -15.0, 2.2), (-1.0, 0, 2.6))
kf(cam_main, "location", 1, None, 'BEZIER'); kf(tgt_main, "location", 1, None, 'BEZIER')
kf(cam_main, "location", 70, None, 'BEZIER'); kf(tgt_main, "location", 70, None, 'BEZIER')
kf(cam_main, "location", 215, (3.5, -8.5, 6.5), 'LINEAR'); kf(tgt_main, "location", 215, (-1.4, 0, 0.3), 'LINEAR')
kf(cam_main, "location", 340, (3.5, -8.5, 6.5), 'BEZIER'); kf(tgt_main, "location", 340, (-1.4, 0, 0.3), 'BEZIER')
kf(cam_main, "location", 660, (3.1, -9.2, 6.9), "BEZIER"); kf(tgt_main, "location", 660, (-1.0, 0.3, 0.5), "BEZIER")

# close-up holds still (framing chosen in Blender at frame 252)
cam_src, tgt_src = camera("CamSource", 50, (-3.291, -2.689, 1.396), (-4.4, 0, 0.8), fstop=2.8)

cam_at, _ = camera("CamAtomic", 40, (60, -27, 10), (60, 0, 10))
kf(cam_at, "location", 660, None, 'BEZIER')
kf(cam_at, "location", 960, (60, -24.5, 10), 'BEZIER')

cam_md, tgt_md = camera("CamModel", 40, (120, -24, 10), (120, 0, 10))
kf(cam_md, "location", 960, None, 'BEZIER')
kf(cam_md, "location", 1260, (119.5, -22, 10.5), 'BEZIER')

scene.camera = cam_main
for f, cam in ((1, cam_main), (250, cam_src), (340, cam_main), (660, cam_at), (960, cam_md)):
    mk = scene.timeline_markers.new(cam.name, frame=f); mk.camera = cam

# ---------- act 1: title + apparatus labels ----------
t1 = label("Title", "Rutherford's Gold Foil Experiment", (-1.0, 0.5, 3.6), 0.62, 5, cam_main, m_head, out=125)
t2 = label("Subtitle", "Discovery of the Nucleus  (Geiger & Marsden, 1909-1911)", (-1.0, 0.5, 2.85), 0.26, 20, cam_main, out=125)

A = 540  # apparatus labels leave before the result labels arrive
label("Lbl Lead", "Lead container\n(absorbs stray alpha-particles)", (-6.2, -0.4, 2.3), 0.22, 160, cam_main, anchor=(-5.6, 0, 1.25), out=A)
label("Lbl Po", "Polonium\n(radioactive element)", (-6.6, -2.2, 0.55), 0.22, 172, cam_main, anchor=(-4.95, -0.05, 0.8), out=A)
label("Lbl Stream", "Stream of α-particles", (-2.6, -1.6, 1.75), 0.22, 184, cam_main, anchor=(-2.4, 0, 0.85), out=A)
label("Lbl Foil", "Thin gold foil\n(~0.0004 mm)", (0.5, -1.3, 2.7), 0.26, 196, cam_main, anchor=(0, -0.35, 1.25), out=A)
label("Lbl Screen", "Zinc sulphide screen\n(α-particle detector: flashes when hit)", (-1.6, 4.2, 2.7), 0.24, 208, cam_main,
      anchor=(-1.0, 2.8, 1.45), out=A)

label("Lbl Microscope", "Microscope\n(Geiger counted each flash by eye)", (2.0, 2.2, 2.9), 0.22, 220, cam_main,
      anchor=(3.3, 4.0, 3.3), out=A)

# close-up labels: parented to CamSource (screen-space captions, always framed)
for name, body, xy, f in (("Lbl Alpha", "α-particle = helium nucleus\n2 protons + 2 neutrons, charge +2", (0.36, 0.38), 272),
                          ("Lbl Beam", "Lead absorbs α-particles, so only a\nnarrow beam escapes through the hole", (0.42, -0.44), 290)):
    t = text_obj(name, body, (xy[0], xy[1], -2.8), 0.064, L, m_txt, rot=(0, 0, 0))
    t.parent = cam_src
    overlay_only(t)
    add_shadow(t)
    pop_in(t, f, 8)
    pop_out(t, 334, 5, (1, 1, 1))

# ---------- act 2: observations ----------
label("Obs Straight", "Most pass\nstraight through", (3.9, -3.0, 1.9), 0.19, 548, cam_main, m_green, anchor=(3.05, -0.3, 1.1))
label("Obs Small", "Some are deflected", (1.6, 3.4, 2.5), 0.24, 568, cam_main, m_green, anchor=(2.3, 1.9, 1.35))
label("Obs Back", "Very few bounce back!", (-2.9, 3.6, 2.5), 0.24, 588, cam_main, m_green, anchor=(-2.45, 1.7, 1.35))
label("Obs Ratio", "(really only ~1 in 8000; exaggerated here)", (-2.9, 3.6, 2.1), 0.16, 596, cam_main)

# ---------- act 3: atomic view ----------
AO = Vector((60, 0, 10))
label("Atomic Title", "Zoom inside the gold foil  (not to scale)", AO + Vector((0, 0, 5.3)), 0.55, 668, None, m_head)
label("Atomic Nucleus", "gold nucleus (+79)\ntiny, dense, positive", AO + Vector((4.6, -0.2, 3.6)), 0.3, 690, None,
      anchor=AO + Vector((1.5, 0, 3.0)))
label("Atomic Cloud", "electrons:\nmostly empty space", AO + Vector((-4.8, -0.2, 3.9)), 0.3, 700, None,
      anchor=AO + Vector((-1.8, 0, 3.2)))
concl = ["1. Most α-particles pass straight: the atom is mostly EMPTY SPACE",
         "2. Some are deflected: the positive charge is CONCENTRATED",
         "3. ~1 in 8000 bounce back: a tiny, dense, positive NUCLEUS"]
for i, s in enumerate(concl):
    label("Conclusion %d" % (i + 1), s, AO + Vector((-9.8, 0, -3.9 - 0.62 * i)), 0.34, 790 + 45 * i, None, align='LEFT')

# ---------- act 4: planetary model ----------
MO = Vector((120, 0, 10))
label("Model Title", "Rutherford's Planetary Model of the Atom", MO + Vector((0, 0, 4.7)), 0.55, 968, None, m_head)
label("Model Nucleus", "nucleus\n(protons + neutrons)", MO + Vector((-6.0, -0.5, -3.0)), 0.3, 985, None,
      anchor=MO + Vector((-6.2, 0, -0.5)))
label("Model Electron", "electrons revolve like\nplanets around the sun", MO + Vector((-6.0, -0.5, 3.6)), 0.3, 995, None)
points = ["1. Atom has a positively charged centre,\n    the NUCLEUS.",
          "2. Electrons revolve around the nucleus\n    at very high speed, like planets.",
          "3. Nucleus is very small; most of the\n    atom's volume is empty.",
          "4. Atom is neutral: number of electrons\n    = number of protons (here 6 = 6).",
          "5. Nucleus is responsible for the\n    mass of the atom."]
for i, s in enumerate(points):
    label("Point %d" % (i + 1), s, MO + Vector((-0.2, 0, 3.0 - 1.45 * i)), 0.33, 1010 + 45 * i, None, align='LEFT')

scene.frame_set(1)
if bpy.data.filepath:
    bpy.ops.wm.save_mainfile()
print("cameras + labels ok; saved:", bpy.data.filepath)
