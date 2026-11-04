# ---- Film 310: Shielding effect (textbook pp.82-83: 3.2.4, Fig 3.7 Li Na Cs, trends in groups and periods) ----
# bsend.py common.py p2/lib.py u3/u3lib.py u3/f310_shielding.py
start_film("310", "310 Shielding Effect", 76.0)
END = scene.frame_end
SA, SB, SC, SD, SE = (Vector((0, 0, 0)), Vector((40, 0, 0)), Vector((80, 0, 0)), Vector((120, 0, 0)),
                      Vector((160, 0, 0)))

shot("Cam Li", 0, 12, SA + Vector((0, 0, -0.6)), dist=13)
shot("Cam Fig37", 12, 30, SB + Vector((0, 0, -0.4)), dist=17)
shot("Cam Remove", 30, 44, SC + Vector((0, 0, -0.2)), dist=17)
shot("Cam Period", 44, 58, SD + Vector((0, 0, -0.4)), dist=14)
shot("Cam Sum", 58, None, SE + Vector((0, 0, -2.45)), dist=25)
for name, t in (("The curtain", 0), ("Fig 3.7", 12), ("Easier to remove", 30), ("Across a period", 44),
                ("Summary", 58)):
    act(name, sec(t))

caps([
    ("A1", "Shielding effect", "The inner electrons stand between the nucleus and the outer electron", 0.1, 6),
    ("A2", "Like a curtain", "They screen the outer electron from the pull of the nucleus", 6, 12),
    ("B1", "Fig 3.7: lithium, sodium, cesium", "Going down group I, more and more inner shells …", 12, 21),
    ("B2", "… so more and more shielding", "The red arrow = the pull the outer electron feels: weaker and weaker", 21, 30),
    ("C1", "Easier to pull away", "Cesium's outer electron leaves with less energy than lithium's", 30, 37),
    ("C2", "Down a group", "Ionization energy and electron affinity become smaller", 37, 44),
    ("D1", "Across a period: shielding stays the same", "Lithium and fluorine both have just one inner shell …", 44, 51),
    ("D2", "… but the nucleus gets stronger", "More protons: the pull wins, so the atom holds on tighter", 51, 58),
    ("E1", "Shielding grows down every group", "That is why the outer electrons are lost more easily lower down", 58, 66),
    ("E2", "It affects size, IE, EA and EN", "Atomic radius, ionization energy, electron affinity, electronegativity", 66, 72),
    ("F", "Next: Electronegativity  →", "A tug of war for shared electrons", 72),
])
SHIELD = mat_emit("Shield Blue", (0.3, 0.6, 1.0), 1.1, alpha=0.28)
SHIELD_EDGE = mat_emit("Shield Edge", (0.45, 0.75, 1.0), 2.5)
PULL = mat_emit("Pull Red", (1.0, 0.3, 0.25), 3.0)


def disc(name, r, mat, parent, z=-0.02):
    bm = bmesh.new()
    bmesh.ops.create_circle(bm, cap_ends=True, segments=64, radius=r)
    return mesh_from_bm(name, bm, mat, parent=parent, loc=(0, 0, z))


def shielded(name, z, loc, t0, t1, pull_r, spans=(), scale=1.0, shield_t=None, **kw):
    """Still atom: blue shield disc over the inner shells, a red pull arrow from the outer electron inward."""
    g, radii, out = vatom(name, z, loc, sec(t0), list(spans), scale=scale, f_out=sec(t1) if t1 else None, **kw)
    th = 55 * DEG
    piv = bpy.data.objects[N("%s Piv %d" % (name, len(radii) - 1))]
    piv.rotation_euler = (0, 0, th)
    r = radii[-1]
    if len(radii) > 1:
        rs = radii[-2] + 0.16 * scale
        d = disc(name + " Shield", rs, SHIELD, g)
        appear(d, sec(shield_t or t0 + 0.8), dur=10)
        e = ring_curve(name + " Shield Edge", rs, SHIELD_EDGE, g, depth=0.02)
        appear(e, sec(shield_t or t0 + 0.8), dur=10)
    a = arrow(name + " Pull", r - 0.32, PULL, g, ((r - 0.12) * math.cos(th), (r - 0.12) * math.sin(th), 0.06),
              (0, 0, th + math.pi), r=pull_r, head=0.26)
    appear(a, sec(t0 + 1.4), dur=8)
    sy = _text(name + " Sym", SYM[z], Vector(loc) + Vector((0, -0.3, -r - 0.6)), 0.55, M["white"], weight="semibold")
    appear(sy, sec(t0 + 0.3), sec(t1) if t1 else None)
    return g, radii, out


# ---- A. lithium: one inner shell = the curtain ----
shielded("A Li", 3, SA + Vector((0, 0, 0.5)), 0.4, None, 0.06, r0=0.7, dr=0.9, e_r=0.14, nuc_r=0.1, shield_t=6.4)
big("Lbl Shield", "shield", SA + Vector((-2.9, -0.6, 0.9)), 6.8, 11.8, mat=M["cyan"], size=0.5)
big("Lbl Pull", "pull", SA + Vector((2.4, -0.6, 2.1)), 2.2, 11.8, mat=M["red"], size=0.5)

# ---- B. Fig 3.7: Li, Na, Cs, the shield grows and the pull gets thinner ----
for k, (z, x, pr, sc) in enumerate(((3, -5.6, 0.06, 1.0), (11, -1.3, 0.04, 1.0), (55, 4.6, 0.018, 1.0))):
    t0 = 12.4 + 2.0 * k
    shielded("B %s" % SYM[z], z, SB + Vector((x, 0, 0.6)), t0, None, pr, r0=0.38, dr=0.33 if z == 55 else 0.45,
             e_r=0.08 if z == 55 else 0.11, nuc_r=0.055, ring_depth=0.012)

# ---- C. remove the outer electron from Li and Cs: the bars show the energy ----
for k, (z, x, kj) in enumerate(((3, -3.6, 520), (55, 2.6, 376))):
    p = SC + Vector((x, 0, 0.6))
    g, radii, out = shielded("C %s" % SYM[z], z, p, 30.4 + 0.6 * k, None, 0.06 if z == 3 else 0.018,
                             r0=0.38, dr=0.6 if z == 3 else 0.33, e_r=0.11 if z == 3 else 0.08, nuc_r=0.055,
                             ring_depth=0.012)
    e = out[0]
    home = e.location.copy()
    t = 32.6 + 2.4 * k
    kf(e, "location", sec(t), home, 'BEZIER')
    kf(e, "location", sec(t + 1.3), home * 3.2, 'BEZIER')
    hide_from(e, sec(t + 1.3))
    ebar("C %s Bar" % SYM[z], p + Vector((radii[-1] + 0.9, 0, -1.6)), kj * 1.6 / 1000 * 1.6, t, str(kj))

# ---- D. across a period: Li and F, the same one-shell curtain, a stronger nucleus ----
shielded("D Li", 3, SD + Vector((-3.0, 0, 0.6)), 44.4, None, 0.03, r0=0.6, dr=0.8, e_r=0.12, nuc_r=0.08)
shielded("D F", 9, SD + Vector((3.0, 0, 0.6)), 45.4, None, 0.085, r0=0.6, dr=0.8, e_r=0.12, nuc_r=0.08)
big("Lbl D Same", "same shield", SD + Vector((0, -0.6, 2.35)), 46.2, 57.8, mat=M["cyan"], size=0.5)

# ---- E. the table: shielding grows down every group ----
tb = Table("Tab", SE)
for z in tb.zs:
    appear(tb.T[z]["t"], sec(58.2) + place(z)[1] + place(z)[0] * 2, dur=6)
ar = arrow("Shield Arrow", 6.4, M["cyan"], None, SE + Vector((-10.4, -0.3, 3.2)), (0, math.pi / 2, 0), r=0.07, head=0.45)
appear(ar, sec(59.6))
big("Lbl More", "more shielding ↓", SE + Vector((-2.5, -0.6, 2.4)), 60.0, None, mat=M["cyan"], size=0.55)
for k, c in enumerate(A_COLS):
    for z in [z for z in tb.zs if place(z)[1] == c and place(z)[0] <= 7]:
        tb.pulse(z, sec(61.0 + 0.5 * k + 0.12 * place(z)[0]), 1.25, 10)
finish_film()
