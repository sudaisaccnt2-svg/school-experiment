# ---- Film 11: Key points (textbook p.59): one short station per bullet, each with its model ----
# v4: one short caption line per point (no paragraphs, no "Next" card); labels sit on the models.
# bsend.py common.py p2/lib.py u3/u3lib.py v4lib.py p2/f11_keypoints.py      (old v2: backups/f11_keypoints_v2.py)
D = [6, 6.5, 6.5, 9, 7.5, 7, 9, 6.5, 7.5, 9, 6.5, 8]
T = [0]
for d in D:
    T.append(T[-1] + d)
start_film("11", "11 Key Points", T[-1])
s = sec
END = scene.frame_end
P, R, CAM = [], [], []
for i in range(12):                                  # one station per point, its own close camera
    p = Vector((30.0 * i, 0, 0))
    r = empty("Station %d" % i, p)
    if i:
        hide_until(r, s(T[i]))
    if i < 11:
        hide_from(r, s(T[i + 1]))
    P.append(p), R.append(r)
    CAM.append(shot("Cam %d" % i, T[i], None if i == 11 else T[i + 1], p + Vector((0, 0, -0.6)), dist=16, drift=0.25))
SAY = [[("Greeks: matter is made of atoms", 0)], [("Dalton: atoms are indivisible particles", 0)],
       [("Electrons, protons and neutrons", 0)],
       [("Rutherford: a positive nucleus", 0), ("Electrons revolve; mostly empty space", 4.5)],
       [("Bohr: electrons in fixed shells", 0)], [("This arrangement: electronic configuration", 0)],
       [("Each shell has a fixed energy", 0), ("Shells are also energy levels", 4.5)],
       [("Shells are named K, L, M, N", 0)], [("Most electrons in a shell: 2n²", 0)],
       [("Shells split into sub-shells", 0), ("s, p, d and f", 4.0)],
       [("Isotopes: same element, different neutrons", 0)],
       [("Used in chemical, medical, agricultural research", 0)]]
ACTS = ["Greeks", "Dalton", "Particles", "Rutherford", "Bohr", "Configuration", "Energy levels", "K L M N", "2n²",
        "Sub-shells", "Isotopes", "Uses"]
for i in range(12):
    act(ACTS[i], s(T[i]))
for i in range(12):
    for k, (txt, dt) in enumerate(SAY[i]):
        t1 = SAY[i][k + 1][1] if k + 1 < len(SAY[i]) else D[i]
        say("P%02d %d" % (i, k), txt, T[i] + dt, None if (i == 11 and k + 1 == len(SAY[i])) else T[i] + t1)


def lab(i, name, body, off, t, size=0.3, mat=None, anchor=None, align='CENTER', weight="regular"):
    f1 = None if i == 11 else s(T[i + 1] - 0.4)
    return label(name, body, P[i] + Vector(off), min(0.62, size * 1.9), s(T[i] + t), f1, mat=mat or M["white"], align=align,
                 weight=weight, anchor=anchor and P[i] + Vector(anchor))


def flat_atom(name, i, loc, radii, counts, Z, Nn, t, nuc_r=0.16, e_r=0.12, ring_mat=None):
    g = empty(name, loc, R[i], rot=(90 * DEG, 0, 0))
    nucleus_mesh(name + " Nucleus", Z, Nn, g, r=nuc_r, seed=Z + Nn)
    for k, (rad, n) in enumerate(zip(radii, counts)):
        ring_curve("%s Ring %d" % (name, k), rad, ring_mat or M["orbit"], g, depth=0.018)
        piv = empty("%s Piv %d" % (name, k), (0, 0, 0), g)
        spin(piv, s(T[i]), s(T[i + 1]) if i < 11 else END, D[i] / (2.5 + 1.5 * k), phase=k)
        for j in range(n):
            a = 2 * math.pi * j / n
            electron("%s e%d %d" % (name, k, j), piv, (rad * math.cos(a), rad * math.sin(a), 0), e_r)
    appear(g, s(T[i] + t), dur=12)
    return g


GREYP = mat_pbr("Atom Grey", (0.6, 0.62, 0.68), metallic=0.3, roughness=0.35)
COL = {"s": (0.30, 0.62, 1.0), "p": (0.30, 1.0, 0.55), "d": (1.0, 0.62, 0.25), "f": (0.78, 0.45, 1.0)}
SM = {k: mat_emit("Sub %s" % k, c, 3.0) for k, c in COL.items()}

# 1 Greeks: a piece of matter is made of tiny particles
i, r = 0, R[0]
cube = box("Matter", (2.0, 2.0, 2.0), mat_pbr("Matter Gold", (0.75, 0.55, 0.25), metallic=0.6, roughness=0.3),
           (0, 0, 0.2), r)
cube.rotation_euler = (0, 0, 30 * DEG)
appear(cube, 1, s(2.4))
k = 0
for x in (-1, 0, 1):
    for y in (-1, 0, 1):
        for z in (-1, 0, 1):
            a = Vector((x, y, z)) * 0.68 + Vector((0, 0, 0.2))
            b = Vector((x, y, z)) * 1.05 + Vector((0, 0, 0.2))
            o = dot("Greek Atom %d" % k, 0.27, GREYP, r, a)
            appear(o, s(2.4) + k, dur=6, s=(0.27,) * 3)
            move(o, s(2.8), s(4.6), a, b)
            k += 1
lab(i, "Lbl Matter", "matter", (0, -0.6, 1.9), 0.0, mat=M["dim"])
lab(i, "Lbl Atoms", "tiny particles: atoms", (0, -0.6, -1.75), 2.8, 0.34, M["gold"], weight="semibold")

# 2 Dalton: small, solid, indivisible spheres
i, r = 1, R[1]
for k, (x, rad, col) in enumerate(((-2.6, 1.0, (0.8, 0.2, 0.2)), (0.0, 0.8, (0.25, 0.45, 0.85)),
                                   (2.3, 0.65, (0.85, 0.75, 0.3)))):
    o = sphere("Dalton %d" % k, rad, mat_pbr("Dalton %d" % k, col, metallic=0.2, roughness=0.2), (x, 0, 0.3), r)
    appear(o, s(T[i] + 0.5 + 0.4 * k), dur=10, s=(rad,) * 3)
lab(i, "Lbl Dalton", "small, solid, indivisible particles", (0, -0.6, -1.5), 1.8, 0.34, M["gold"], weight="semibold")

# 3 fundamental particles
i, r = 2, R[2]
for k, (x, rad, mat, nm, ch, cm) in enumerate(((-3.2, 0.25, M["electron"], "electron", "e⁻  negative", M["cyan"]),
                                               (0.0, 0.65, M["proton"], "proton", "p⁺  positive", M["red"]),
                                               (3.2, 0.65, M["neutron"], "neutron", "n⁰  neutral", M["dim"]))):
    o = sphere("Particle %d" % k, rad, mat, (x, 0, 0.3), r)
    appear(o, s(T[i] + 0.6 + 0.5 * k), dur=10, s=(rad,) * 3)
    lab(i, "Lbl P%d" % k, nm, (x, -0.6, 1.45), 0.8 + 0.5 * k, 0.36, M["white"], weight="semibold")
    lab(i, "Lbl C%d" % k, ch, (x, -0.6, -0.85), 1.2 + 0.5 * k, 0.3, cm)

# 4 Rutherford: positive nucleus, planetary electrons, mostly empty space
i, r = 3, R[3]
g = empty("Ruth", (0, 0, 0.2), r)
nucleus_mesh("Ruth Nucleus", 3, 4, g, r=0.18, seed=3)
for k, rz in enumerate((0, 58, -58)):
    o = empty("Ruth Orbit %d" % k, (0, 0, 0), g, rot=(78 * DEG, 0, rz * DEG))
    ring_curve("Ruth Ring %d" % k, 2.4, M["orbit"], o, depth=0.016)
    piv = empty("Ruth Piv %d" % k, (0, 0, 0), o)
    spin(piv, s(T[i]), s(T[i + 1]), 2.0 + 0.4 * k, phase=k * 2.1)
    electron("Ruth e%d" % k, piv, (2.4, 0, 0), 0.13)
appear(g, s(T[i] + 0.5), dur=12)
lab(i, "Lbl RNuc", "positive nucleus", (3.6, -0.6, 1.9), 1.5, 0.3, M["red"], anchor=(0.25, -0.6, 0.35))
lab(i, "Lbl RPlan", "electrons revolve like planets around the sun", (0, -0.6, 2.9), 3.0, 0.3, M["cyan"])
lab(i, "Lbl REmpty", "mostly empty space", (3.9, -0.6, -1.8), 5.0, 0.3, M["gold"])

# 5 Bohr: fixed circular orbits = shells
i, r = 4, R[4]
flat_atom("Bohr", i, (0, 0, 0.2), [1.1, 2.0, 2.85], [2, 4, 0], 6, 6, 0.5)
for k, rad in enumerate((1.1, 2.0, 2.85)):
    lab(i, "Lbl n%d" % k, "n = %d" % (k + 1), (-rad * 0.71 - 0.12, -0.6, 0.2 + rad * 0.71 + 0.12), 1.8 + 0.5 * k, 0.28,
        M["gold"], align='RIGHT')
lab(i, "Lbl Shells", "fixed circular orbits: shells", (0, -0.6, 3.05), 3.4, 0.3, M["dim"])

# 6 electronic configuration: Na 2, 8, 1
i, r = 5, R[5]
flat_atom("Na", i, (-2.0, 0, 0.2), [0.9, 1.6, 2.3], [2, 8, 1], 11, 12, 0.5)
lab(i, "Lbl Na", "sodium (Na)", (-2.0, -0.6, 2.85), 0.8, 0.32, M["gold"], weight="semibold")
lab(i, "Lbl KLM", "K    L    M", (3.3, -0.6, 1.0), 1.6, 0.34, M["dim"])
lab(i, "Lbl Cfg", "2,   8,   1", (3.3, -0.6, 0.2), 2.2, 0.56, M["gold"], weight="semibold")

# 7 each shell has a fixed energy: energy levels
i, r = 6, R[6]
g_el = flat_atom("EL", i, (-3.0, 0, 0.2), [0.8, 1.4, 2.0, 2.6], [1, 0, 0, 0], 1, 0, 0.5, nuc_r=0.2)
refocus(g_el, [(s(T[i] + 3.8), s(T[i + 1]))])        # the electron waits while the energy levels build
LZ = [-2.2, -0.7, 0.4, 1.2]
for k, z in enumerate(LZ):
    o = box("Level %d" % k, (2.4, 0.12, 0.07), M["gold"] if k == 0 else M["line"], (2.6, 0, z), r)
    appear(o, s(T[i] + 1.5 + 0.5 * k), dur=8)
    lab(i, "Lbl E%d" % k, "%s   n = %d" % ("KLMN"[k], k + 1), (1.2, -0.6, z), 1.6 + 0.5 * k, 0.26, M["white"],
        align='RIGHT')
ar = arrow("Energy Arrow", 4.2, M["line"], r, (4.3, 0, -2.4), (0, -90 * DEG, 0), r=0.03, head=0.22)
appear(ar, s(T[i] + 1.2))
lab(i, "Lbl Energy", "energy", (4.85, -0.6, 0.0), 1.4, 0.28, M["dim"], align='LEFT')

# 8 K, L, M, N
i, r = 7, R[7]
g = empty("KLMN", (-0.8, 0, 0.2), r, rot=(90 * DEG, 0, 0))
nucleus_mesh("KLMN Nucleus", 6, 6, g, r=0.16, seed=12)
appear(g, s(T[i] + 0.3), dur=8)
for k, rad in enumerate((0.9, 1.5, 2.1, 2.7)):
    o = ring_curve("KLMN Ring %d" % k, rad, M["orbit"], g, depth=0.02)
    appear(o, s(T[i] + 0.8 + 0.7 * k), dur=10)
    lab(i, "Lbl KLMN %d" % k, "KLMN"[k], (-0.8 + rad + 0.25, -0.6, 0.2), 1.0 + 0.7 * k, 0.42, M["gold"], align='LEFT',
        weight="semibold")
lab(i, "Lbl Etc", "… and so on", (3.4, -0.6, -1.4), 4.0, 0.3, M["dim"], align='LEFT')

# 9 2n²
i, r = 8, R[8]
g = empty("TwoN", (-3.4, 0, 0.2), r, rot=(90 * DEG, 0, 0))
nucleus_mesh("TwoN Nucleus", 6, 6, g, r=0.14, seed=13)
appear(g, s(T[i] + 0.3), dur=8)
for k, rad in enumerate((0.7, 1.2, 1.7, 2.2)):
    ring_curve("TwoN Ring %d" % k, rad, M["orbit"], g, depth=0.018)
    n = k + 1
    lab(i, "Lbl TwoN %d" % k, "%s   n = %d    2 × %d² = %d" % ("KLMN"[k], n, n, 2 * n * n),
        (0.2, -0.6, 1.1 - 0.75 * k), 1.6 + 0.8 * k, 0.32, M["white"], align='LEFT')
lab(i, "Lbl 2n2", "maximum electrons = 2n²", (2.4, -0.6, 2.2), 0.8, 0.4, M["gold"], weight="semibold")

# 10 sub-shells s p d f
i, r = 9, R[9]
g = empty("Split", (-2.4, 0, 0.2), r, rot=(90 * DEG, 0, 0))
nucleus_mesh("Split Nucleus", 6, 6, g, r=0.14, seed=14)
appear(g, s(T[i] + 0.3), dur=8)
one = ring_curve("Split Shell", 2.0, M["orbit"], g, depth=0.03)
appear(one, s(T[i] + 0.4), s(T[i] + 2.2))
for k, l in enumerate("spdf"):
    o = ring_curve("Split %s" % l, 1.3 + 0.5 * k, SM[l], g, depth=0.02)
    appear(o, s(T[i] + 2.3 + 0.4 * k), dur=10)
    lab(i, "Lbl Sub %s" % l, "%s   (%s)" % (l, ("sharp", "principal", "diffused", "fundamental")[k]),
        (1.9, -0.6, 1.2 - 0.8 * k), 2.6 + 0.4 * k, 0.36, SM[l], align='LEFT', weight="semibold")

# 11 isotopes: same element, different number of neutrons
i, r = 10, R[10]
for k, (nm, sym) in enumerate((("protium", "H"), ("deuterium", "D"), ("tritium", "T"))):
    x = (k - 1) * 3.6
    g_iso = flat_atom("Iso %d" % k, i, (x, 0, 0.3), [1.25], [1], 1, k, 0.4 + 0.4 * k, nuc_r=0.3)
    refocus(g_iso, [(s(T[i] + 0.8 + 1.8 * k), s(T[i] + 2.6 + 1.8 * k) if k < 2 else s(T[i + 1]))])   # one at a time
    lab(i, "Lbl Iso %d" % k, "%s (%s)" % (nm, sym), (x, -0.6, 2.0), 0.6 + 0.4 * k, 0.32, M["gold"], weight="semibold")
    nsym("Iso %d" % k, "H", 1 + k, 1, P[i] + Vector((x, -0.6, -1.6)), T[i] + 1.0 + 0.4 * k, s(T[i + 1] - 0.4))

# 12 uses: chemical, medical, agricultural research
i, r = 11, R[11]
fl = empty("Flask", (-3.6, 0, -0.6), r)
cyl("Flask Body", 0.95, 0.25, 1.6, mat_emit("Flask Glass", (0.6, 0.8, 1.0), 0.4, alpha=0.3), (0, 0, 0), fl, base=True)
cyl("Flask Neck", 0.24, 0.24, 0.8, mat_emit("Flask Glass", (0.6, 0.8, 1.0), 0.4, alpha=0.3), (0, 0, 1.55), fl,
    base=True)
cyl("Flask Liquid", 0.85, 0.5, 0.7, mat_emit("Flask Liquid", (0.3, 1.0, 0.55), 2.0), (0, 0, 0.05), fl, base=True)
blob("Heart", (0.85, 0.65, 0.8), mat_pbr("Heart", (0.7, 0.08, 0.1), roughness=0.4), (0, 0, 0.3), r, bump=0.08, seed=6)
blob("Leaf", (1.0, 0.08, 0.45), mat_pbr("Leaf", (0.15, 0.55, 0.15), roughness=0.5), (3.6, 0, 0.3), r,
     rot=(0, 30 * DEG, 0))
for k, ob in enumerate((fl, bpy.data.objects[N("Heart")], bpy.data.objects[N("Leaf")])):
    appear(ob, s(T[i] + 0.6 + 0.6 * k), dur=10)
for k, (nm, x) in enumerate((("chemical", -3.6), ("medical", 0.0), ("agricultural", 3.6))):
    lab(i, "Lbl Use %d" % k, nm, (x, -0.6, -1.5), 1.0 + 0.6 * k, 0.36, M["gold"], weight="semibold")

scene["ar_range"] = [s(T[3]), s(T[4]) - 1]      # AR: Rutherford's planetary atom
scene["ar_scale"] = 0.05
finish_film()
