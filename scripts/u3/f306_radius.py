# ---- Film 306: Periodicity, atomic size and atomic radius (textbook pp.72-74: 3.2, 3.2.1, Fig 3.4, Table 3.1) ----
# bsend.py common.py p2/lib.py u3/u3lib.py u3/f306_radius.py
start_film("306", "306 Atomic Radius", 94.0)
END = scene.frame_end
SA, SB, SC, SD, SE = (Vector((0, 0, 0)), Vector((40, 0, 0)), Vector((80, 0, 0)), Vector((120, 0, 0)),
                      Vector((160, 0, 0)))

shot("Cam Pattern", 0, 13, SA + Vector((0, 0, 2.4)), dist=25, pitch=0.1)
shot("Cam Radius", 13, 25, SB + Vector((0, 0, -0.8)), dist=14)
shot("Cam Down", 25, 45, SC + Vector((0, 0, -0.4)), dist=20.5)
shot("Cam Across", 45, 65, SD + Vector((0, 0, -0.5)), dist=24)
shot("Cam Table", 65, 87, SE + Vector((0, 0, -1.35)), dist=26)
shot("Cam End", 87, None, SE + Vector((0, 0, -1.35)), dist=26)
for name, t in (("Periodicity", 0), ("Atomic radius", 13), ("Down a group", 25), ("Across a period", 45),
                ("Table 3.1", 65)):
    act(name, sec(t))

caps([
    ("A1", "Periodicity: a pattern that repeats", "Properties come back again and again, like the days of the week", 0.1, 7),
    ("A2", "Here: the size of atoms 1 to 20", "Big, then smaller and smaller … then big again in the next period", 7, 13),
    ("B1", "Atomic radius", "The distance from the nucleus to the outer (valence) shell", 13, 19),
    ("B2", "Atoms have no hard edge", "Their size even changes when they join other atoms. Units: pm, nm or Å.", 19, 25),
    ("C1", "Down a group: BIGGER", "Each step down adds one more shell", 25, 35),
    ("C2", "More shells, more shielding", "The outer electrons sit farther out and are held less tightly", 35, 45),
    ("D1", "Across a period: SMALLER", "Same number of shells, but more protons in the nucleus …", 45, 55),
    ("D2", "… so the pull gets stronger", "The shells are pulled in nearer to the nucleus", 55, 65),
    ("E1", "Table 3.1: atomic radii (Å)", "Each ball is drawn to the size printed in the book", 65, 76),
    ("E2", "Biggest: bottom left.  Smallest: top right.", "Cs 2.35 Å is the biggest here;  He 0.49 Å the smallest", 76, 87),
    ("F", "Next: Covalent radius  →", "How we measure atoms that are joined together", 87),
])

# ---- A. the radius of elements 1-20 as a row of bars: the pattern repeats ----
lbl_m = tile_mats()["sym"]
PEAKS = (3, 11, 19)
for z in range(1, 21):
    x = (z - 10.5) * 1.0
    cat = category(z)
    b = bpy.data.objects.new(N("Bar %s" % SYM[z]), tile_mesh(cat))
    put(b, "Models")
    b.location = SA + Vector((x, 0, -0.2))
    h = RADIUS[SYM[z]] * 3.0
    f0 = sec(0.6 + 0.3 * z)
    kf(b, "scale", 0, (0, 0, 0), 'CONSTANT')
    kf(b, "scale", f0, (1, 1, 0.05), 'BEZIER')
    kf(b, "scale", f0 + 14, (1, 1, h), 'BEZIER')
    if z in PEAKS:
        for t in (7.6 + 1.0 * PEAKS.index(z), 11.0):
            kf(b, "scale", sec(t), (1, 1, h), 'BEZIER')
            kf(b, "scale", sec(t) + 8, (1.25, 1.25, h * 1.08), 'BEZIER')
            kf(b, "scale", sec(t) + 16, (1, 1, h), 'BEZIER')
    tx = _text("Bar %s Sym" % SYM[z], SYM[z], SA + Vector((x, -0.5, -0.65)), 0.42, lbl_m, weight="semibold")
    appear(tx, f0, dur=6)
big("Lbl Repeat", "the pattern repeats!", SA + Vector((0, -0.6, 7.6)), 8.0, 12.8, mat=M["gold"], size=0.65)
for k, z in enumerate(PEAKS):
    big("Lbl Peak %d" % k, SYM[z], SA + Vector(((z - 10.5), -0.6, RADIUS[SYM[z]] * 3.0 - 0.2 + 0.55)),
        7.6 + 1.0 * k, 12.8, mat=M["gold"], size=0.5)

# ---- B. Fig 3.4: one atom, the radius line from the nucleus to the outer shell ----
gR, rR, _ = vatom("Fig", 11, SB + Vector((0, 0, 0.5)), sec(13.3), [(sec(13.3), sec(24.8))], r0=0.75, dr=0.6, e_r=0.12,
                  nuc_r=0.09, rate=0.015)
rl = cyl("Radius Line", 0.04, 0.04, 1.0, M["gold"], (0, 0, 0), gR, rot=(0, math.pi / 2, 0), base=True, segs=12)
kf(rl, "scale", 0, (0, 0, 0), 'CONSTANT')
kf(rl, "scale", sec(14.4), (1, 1, 0.01), 'BEZIER')
kf(rl, "scale", sec(14.4) + 20, (1, 1, rR[-1]), 'BEZIER')
big("Lbl r", "r", SB + Vector((rR[-1] * 0.5, -0.6, 0.95)), 15.2, 24.8, mat=M["gold"], size=0.7)
# the fuzzy edge: a faint cloud of dots around the outer shell
cloud = empty("Cloud", SB + Vector((0, 0.3, 0.5)), rot=(90 * DEG, 0, 0))
rc = random.Random(5)
cm = mat_emit("Cloud Dot", (0.35, 0.65, 1.0), 1.4, alpha=0.5)
for i in range(160):
    a = rc.uniform(0, 2 * math.pi)
    rr = rR[-1] + rc.gauss(0, 0.32)
    dot("Cloud %03d" % i, 0.035, cm, cloud, (rr * math.cos(a), rr * math.sin(a), rc.uniform(-0.3, 0.3)))
appear(cloud, sec(19.4), sec(24.8), dur=14)

# ---- C. down group IA: Li, Na, K, Rb, Cs side by side, each a shell bigger ----
DOWN = [3, 11, 19, 37, 55]
xs = [-7.4, -5.1, -1.9, 2.0, 6.6]
for k, (z, x) in enumerate(zip(DOWN, xs)):
    t0 = 25.4 + 1.4 * k
    nxt = 25.4 + 1.4 * (k + 1) if k < 4 else 44.8
    vatom("Down %s" % SYM[z], z, SC + Vector((x, 0, 0.6)), sec(t0), [(sec(t0), sec(nxt))], r0=0.28, dr=0.34,
          e_r=0.075, nuc_r=0.055, rate=0.03, ring_depth=0.012)
    sy = _text("Down %s Sym" % SYM[z], SYM[z], SC + Vector((x, -0.3, -2.0)), 0.55, M["white"], weight="semibold")
    appear(sy, sec(t0 + 0.2), sec(44.8))
    vl = _text("Down %s Val" % SYM[z], "%.2f Å" % RADIUS[SYM[z]], SC + Vector((x, -0.3, -2.7)), 0.4, M["gold"])
    appear(vl, sec(t0 + 0.5), sec(44.8))
ar = arrow("Down Arrow", 13.6, M["gold"], None, SC + Vector((-6.8, -0.3, 3.2)), r=0.045, head=0.35)
appear(ar, sec(32.2), sec(44.8))
big("Lbl Bigger", "bigger →", SC + Vector((0, -0.6, 3.75)), 32.6, 44.8, mat=M["gold"], size=0.5)

# ---- D. across period 2: Li → Ne get smaller (drawn to the book's radii) ----
ACROSS = list(range(3, 11))
for k, z in enumerate(ACROSS):
    t0 = 45.4 + 1.1 * k
    nxt = 45.4 + 1.1 * (k + 1) if k < 7 else 64.8
    x = (k - 3.5) * 2.45
    sc = RADIUS[SYM[z]] * 1.05 / 1.2
    vatom("Acr %s" % SYM[z], z, SD + Vector((x, 0, 0.6)), sec(t0), [(sec(t0), sec(nxt))], scale=sc, r0=0.45, dr=0.75,
          e_r=0.08, nuc_r=0.05 + 0.004 * z, rate=0.03, ring_depth=0.013)
    sy = _text("Acr %s Sym" % SYM[z], SYM[z], SD + Vector((x, -0.3, -1.5)), 0.55, M["white"], weight="semibold")
    appear(sy, sec(t0 + 0.2), sec(64.8))
    vl = _text("Acr %s Val" % SYM[z], "%.2f" % RADIUS[SYM[z]], SD + Vector((x, -0.3, -2.2)), 0.42, M["gold"])
    appear(vl, sec(t0 + 0.5), sec(64.8))
ar2 = arrow("Across Arrow", 18.0, M["gold"], None, SD + Vector((-9.0, -0.3, 2.6)), r=0.045, head=0.35)
appear(ar2, sec(54.4), sec(64.8))
big("Lbl Smaller", "smaller →", SD + Vector((0, -0.6, 3.15)), 54.8, 64.8, mat=M["gold"], size=0.5)
big("Lbl Pull", "more protons pull harder", SD + Vector((0, -0.6, -3.0)), 56.0, 64.8, mat=M["red"], size=0.45)

# ---- E. Table 3.1: a ball for every element, sized to the book value ----
GLASS = mat_emit("Radius Glass Dark", (0.07, 0.16, 0.38), 1.0, alpha=0.6)
GX, GY, GZ = 1.9, 1.5, 3.8
CORE = mat_emit("Radius Core", (1.0, 0.35, 0.3), 3.0)
rows = [[1, 2], list(range(3, 11)), list(range(11, 19)), [19, 20, 31, 32, 33, 34, 35, 36], [37, 38] + list(range(49, 55)),
        [55, 56] + list(range(81, 87))]
for r, row in enumerate(rows):
    for z in row:
        c = 0 if z == 1 else 7 if z == 2 else row.index(z)
        p = SE + Vector(((c - 3.5) * GX, 0, GZ - GY * r))
        rad = RADIUS[SYM[z]] * 0.3
        t0 = 65.6 + 0.9 * r + 0.06 * c
        ball = sphere("T31 %s" % SYM[z], rad, GLASS, p + Vector((0, 0.15, 0)), None, 32, 16)
        appear(ball, sec(t0), dur=8, s=(rad,) * 3)
        sy = _text("T31 %s Sym" % SYM[z], SYM[z], p + Vector((0, -0.4, 0.17)), 0.42, M["white"], weight="semibold")
        appear(sy, sec(t0 + 0.1))
        vl = _text("T31 %s Val" % SYM[z], "%.2f" % RADIUS[SYM[z]], p + Vector((0, -0.4, -0.3)), 0.34, M["gold"])
        appear(vl, sec(t0 + 0.2))
for name, z, t0 in (("Big", 55, 76.6), ("Small", 2, 78.0)):
    r = 5 if z == 55 else 0
    c = 0 if z == 55 else 7
    fr = empty("T31 %s Frame" % name, SE + Vector(((c - 3.5) * GX, -0.5, GZ - GY * r)), rot=(90 * DEG, 0, 0))
    frame_box("T31 %s Box" % name, 1.8, 1.45, parent=fr, mat=M["gold"] if z == 55 else M["cyan"])
    appear(fr, sec(t0), sec(86.8), dur=8)
finish_film()
