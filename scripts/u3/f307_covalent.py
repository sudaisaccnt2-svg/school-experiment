# ---- Film 307: Covalent radius (textbook pp.75-76: Fig 3.5 H2, bond length A-B, Fig 3.6 halogens) ----
# bsend.py common.py p2/lib.py u3/u3lib.py u3/f307_covalent.py
start_film("307", "307 Covalent Radius", 80.0)
END = scene.frame_end
SH, SAB, SX = Vector((0, 0, 0)), Vector((40, 0, 0)), Vector((80, 0, 0))

shot("Cam H2", 0, 24, SH + Vector((0, 0, -0.75)), dist=13)
shot("Cam AB", 24, 34, SAB + Vector((0, 0, -0.6)), dist=15.5)
shot("Cam Halogens", 34, None, SX + Vector((0, 0, -0.6)), dist=24)
for name, t in (("H₂", 0), ("r = d/2", 12), ("Bond A–B", 24), ("Halogens", 34)):
    act(name, sec(t))

caps([
    ("A1", "Atoms in a molecule overlap", "Two hydrogen atoms come together and share their electrons …", 0.1, 6),
    ("A2", "… and make one H₂ molecule", "Now the atom has no clear edge to measure", 6, 12),
    ("B1", "Measure nucleus to nucleus", "This distance d is the BOND LENGTH", 12, 18),
    ("B2", "Covalent radius = half of it", "Cut d in half:  covalent radius  r = d / 2", 18, 24),
    ("C", "Bond length A–B", "= the average of the lengths A–A and B–B", 24, 34),
    ("D1", "Fluorine, F₂", "Bond length 143 pm → covalent radius 72 pm", 34, 41),
    ("D2", "Chlorine, Cl₂", "Bond length 199 pm → covalent radius 100 pm", 41, 48),
    ("D3", "Bromine, Br₂", "Bond length 228 pm → covalent radius 114 pm", 48, 55),
    ("D4", "Iodine, I₂", "Bond length 266 pm → covalent radius 133 pm", 55, 62),
    ("D5", "Down the group: bigger atoms", "… so the bonds get longer (pm = picometre, a tiny unit)", 62, 70),
    ("E", "Next: Ionization energy  →", "How hard is it to pull an electron away?", 70),
])
NUC = mat_emit("Nucleus Dot", (1.0, 0.35, 0.3), 3.0)


def dim_arrow(name, a, b, mat, t0, t1, r=0.03):
    """Double-headed measuring arrow from a to b (world points in one vertical plane facing the camera)."""
    a, b = Vector(a), Vector(b)
    m = (a + b) / 2
    out = []
    for tag, end in (("L", a), ("R", b)):
        d = end - m
        ang = math.atan2(d.z, d.x)
        ar = arrow("%s %s" % (name, tag), d.length, mat, None, m, (0, -ang, 0), r=r, head=min(0.3, d.length * 0.4))
        appear(ar, sec(t0), None if t1 is None else sec(t1))
        out.append(ar)
    return out


def molecule(name, c, rcov, rgb, t0, t1=None, ra=1.35, alpha=0.4):
    """Two overlapping atoms (radius ra*rcov) whose nuclei are 2*rcov apart, centred on c. Returns nucleus points."""
    m = mat_emit("%s Cloud" % name, rgb, 1.2, alpha=alpha)
    pts = []
    for k, sgn in enumerate((-1, 1)):
        p = Vector(c) + Vector((sgn * rcov, 0.15, 0))
        s = sphere("%s Atom %d" % (name, k), ra * rcov, m, p, None, 48, 24)
        appear(s, sec(t0 + 0.3 * k), None if t1 is None else sec(t1), dur=10, s=(ra * rcov,) * 3)
        n = sphere("%s Nuc %d" % (name, k), 0.07, NUC, p + Vector((0, -ra * rcov * 0.95, 0)), None, 12, 6)
        appear(n, sec(t0 + 0.3 * k), None if t1 is None else sec(t1), s=(0.07,) * 3)
        pts.append(p + Vector((0, -ra * rcov - 0.1, 0)))
    return pts


# ---- A/B. two hydrogen atoms come together; d, then r = d/2 ----
RH = 0.85
HM = mat_emit("H Cloud", (0.35, 0.65, 1.0), 1.2, alpha=0.4)
hs = []
for k, sgn in enumerate((-1, 1)):
    a = sphere("H Atom %d" % k, RH * 1.35, HM, SH + Vector((sgn * 4.0, 0.15, 0.5)), None, 48, 24)
    appear(a, sec(0.4 + 0.4 * k), dur=10, s=(RH * 1.35,) * 3)
    n = sphere("H Nuc %d" % k, 0.09, NUC, (0, 0, 0), a, 12, 6)
    n.location = (0, -0.97, 0)
    n.scale = (0.09 / (RH * 1.35),) * 3
    move(a, sec(2.4), sec(5.6), SH + Vector((sgn * 4.0, 0.15, 0.5)), SH + Vector((sgn * RH, 0.15, 0.5)))
    hs.append(a)
big("Lbl H2", "H₂", SH + Vector((0, -0.6, 2.05)), 6.4, 23.8, mat=M["gold"], size=0.7)
L = SH + Vector((-RH, -1.9, 0.5))
R_ = SH + Vector((RH, -1.9, 0.5))
dim_arrow("H d", L, R_, M["gold"], 12.6, 18.0)
big("Lbl d", "d", SH + Vector((0, -2.1, 0.95)), 13.0, 17.9, mat=M["gold"], size=0.65)
dim_arrow("H r", L, SH + Vector((0, -1.9, 0.5)), M["cyan"], 18.6, 23.8)
big("Lbl r", "r", SH + Vector((-RH / 2, -2.1, 0.95)), 19.0, 23.8, mat=M["cyan"], size=0.65)
mid = line("H Mid", [SH + Vector((0, -1.9, -1.4)), SH + Vector((0, -1.9, 2.0))], M["dim"], depth=0.015)
appear(mid, sec(18.6), sec(23.8))
big("Lbl r is half", "r = d / 2", SH + Vector((0, -0.6, -2.1)), 20.6, 23.8, mat=M["cyan"], size=0.5)

# ---- C. A-A, B-B and A-B ----
AA = molecule("AA", SAB + Vector((-4.6, 0, 0.9)), 0.55, (0.4, 0.8, 1.0), 24.4, 33.8)
BB = molecule("BB", SAB + Vector((4.2, 0, 0.9)), 0.95, (1.0, 0.55, 0.35), 25.2, 33.8)
ma, mb = mat_emit("AB Cloud A", (0.4, 0.8, 1.0), 1.2, alpha=0.4), mat_emit("AB Cloud B", (1.0, 0.55, 0.35), 1.2, alpha=0.4)
for k, (rc, m, x) in enumerate(((0.55, ma, -0.75), (0.95, mb, 0.75))):
    s = sphere("AB Atom %d" % k, 1.35 * rc, m, SAB + Vector((x, 0.15, -1.2)), None, 48, 24)
    appear(s, sec(27.0 + 0.4 * k), sec(33.8), dur=10, s=(1.35 * rc,) * 3)
for name, txt, p, t0 in (("AA", "A–A", (-4.6, -0.6, 2.0), 24.8), ("BB", "B–B", (4.2, -0.6, 2.4), 25.6),
                         ("AB", "A–B: in between", (4.4, -0.6, -1.2), 27.6)):
    big("Lbl %s" % name, txt, SAB + Vector(p), t0, 33.8, mat=M["gold"], size=0.5)

# ---- D. the halogens, left to right: F2, Cl2, Br2, I2 (drawn to the book's radii) ----
K = 0.0075                     # pm -> Blender units
HAL = [("F₂", 72, 143, (0.75, 0.95, 0.55)), ("Cl₂", 100, 199, (0.45, 0.95, 0.5)), ("Br₂", 114, 228, (0.95, 0.45, 0.3)),
       ("I₂", 133, 266, (0.7, 0.35, 0.95))]
widths = [4 * 1.35 * r * K for _, r, _, _ in HAL]
gap = 0.9
x = -(sum(widths) + gap * 3) / 2
for k, ((nm, rc, bl, rgb), w) in enumerate(zip(HAL, widths)):
    cx = x + w / 2
    x += w + gap
    t0 = 34.4 + 7.0 * k
    c = SX + Vector((cx, 0, 0.9))
    a, b = molecule("Hal %d" % k, c, rc * K, rgb, t0)
    big("Lbl Hal %d" % k, nm, c + Vector((0, -0.6, 1.35 * rc * K + 0.55)), t0 + 0.4, None, mat=mat_emit("Lbl Hal %d" % k, rgb, 2.4),
        size=0.6)
    dim_arrow("Hal %d d" % k, a, b, M["gold"], t0 + 1.4, None, r=0.025)
    v = _text("Hal %d Bond" % k, "%d pm" % bl, c + Vector((0, -2.0, -1.35 * rc * K - 0.5)), 0.42, M["gold"],
              weight="semibold")
    appear(v, sec(t0 + 1.6))
    v2 = _text("Hal %d Rad" % k, "r = %d pm" % rc, c + Vector((0, -2.0, -1.35 * rc * K - 1.15)), 0.38, M["cyan"])
    appear(v2, sec(t0 + 2.6))
ar = arrow("Hal Trend", 17.0, M["gold"], None, SX + Vector((-8.5, -0.4, 3.4)), r=0.04, head=0.35)
appear(ar, sec(62.4))
big("Lbl Hal Trend", "bigger atoms, longer bonds →", SX + Vector((0, -0.6, 3.95)), 62.8, None, mat=M["gold"], size=0.5)
finish_film()
