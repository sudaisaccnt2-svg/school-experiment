# ---- Film 308: Ionization energy (textbook pp.76-79: 3.2.2, Na/Mg equations, Table 3.2, factors, trends, Table 3.3,
# Example 3.2, Practice 3.3, Test Yourself) ----
# bsend.py common.py p2/lib.py u3/u3lib.py u3/f308_ionization.py
start_film("308", "308 Ionization Energy", 137.0)
END = scene.frame_end
SA, SB, SE, SC = Vector((0, 0, 0)), Vector((40, 0, 0)), Vector((80, 0, 0)), Vector((200, 0, 0))

shot("Cam Pull", 0, 12, SA + Vector((0, 0, -0.3)), dist=13)
shot("Cam NaMg", 12, 42, SB + Vector((0, 0, 0.2)), dist=17)
shot("Cam Na2", 42, 54, SB + Vector((-1.5, 0, 2.0)), dist=24)
shot("Cam Size", 54, 60, SE + Vector((0, 0, -0.5)), dist=14)
shot("Cam Charge", 60, 66, SE + Vector((30, 0, -0.5)), dist=14)
shot("Cam Full", 66, 70, SE + Vector((60, 0, -0.5)), dist=11)
shot("Cam City", 70, 92, SC + Vector((0, -1.2, 1.7)), dist=22, pitch=0.6)
shot("Cam Sets", 92, 122, SC + Vector((0, -1.2, 1.7)), dist=22, pitch=0.6)
shot("Cam Reactive", 122, None, SC + Vector((0, -1.2, 1.7)), dist=22, pitch=0.6)
for name, t in (("Pull one off", 0), ("Na and Mg", 12), ("2nd electron", 30), ("Factors", 54), ("Table 3.3", 70),
                ("Example 3.2", 92), ("Group I vs II", 122)):
    act(name, sec(t))

SETS = [("Example 3.2 (a): K, Ga, Se", "Se: the ionization energy gets larger to the RIGHT", [19, 31, 34], 34),
        ("Example 3.2 (b): O, S, Se", "O: it gets smaller DOWN a group", [8, 16, 34], 8),
        ("Example 3.2 (c): In, As, Cl", "Cl: larger to the right AND going up", [49, 33, 17], 17),
        ("Practice 3.3 (a): Be, C, N", "N: the farthest to the right", [4, 6, 7], 7),
        ("Practice 3.3 (b): Mg, Ca, Sr", "Mg: the highest up in the group", [12, 20, 38], 12),
        ("Practice 3.3 (c): Sn, Se, F", "F: top right wins", [50, 34, 9], 9)]
caps([
    ("A1", "Pulling an electron away", "It takes ENERGY to tear the outer electron off an atom", 0.1, 6),
    ("A2", "Ionization energy", "The least energy needed to remove the outer electron of a gas atom", 6, 12),
    ("B1", "Sodium: 496 kJ/mol", "Na → Na⁺ + e⁻.  The gold bar shows the energy it took.", 12, 21),
    ("B2", "Magnesium: 738 kJ/mol", "Mg → Mg⁺ + e⁻.  A taller bar: Mg holds on tighter.", 21, 30),
    ("C", "The 2nd electron is harder: 1450", "Mg⁺ → Mg²⁺ + e⁻.  The ion is positive, so it pulls harder.", 30, 42),
    ("D1", "Sodium's 2nd electron: 4562!", "Table 3.2: it must come out of the full inner shell", 42, 48),
    ("D2", "Full shells hold on very tightly", "That is why sodium only ever loses ONE electron", 48, 54),
    ("E1", "Bigger atom, more shielding → easier", "Potassium's outer electron is far away and screened", 54, 60),
    ("E2", "More protons → harder", "Same shells, but chlorine's nucleus pulls much harder than sodium's", 60, 66),
    ("E3", "Full shells → harder", "Neon's shells are full: it holds on very tight", 66, 70),
    ("F1", "Table 3.3: the energy city", "The taller the bar, the harder it is to pull an electron off", 70, 81),
    ("F2", "Across a period: UP.  Down a group: DOWN.", "Highest: helium (2372).  Lowest here: cesium (376).", 81, 92),
] + [("G%d" % k, q, a, 92 + 5 * k, 97 + 5 * k) for k, (q, a, _, _) in enumerate(SETS)] + [
    ("H1", "Why is group I more reactive than group II?", "Group I has the smaller ionization energy …", 122, 127),
    ("H2", "… so it loses its electron more easily", "Na 496 < Mg 738: sodium reacts more strongly", 127, 132),
    ("I", "Next: Electron affinity  →", "What happens when an atom TAKES an electron?", 132),
])
BAR = mat_pbr("Energy Bar", (1.0, 0.72, 0.3), metallic=0.8, roughness=0.25)
KJ = 1.6 / 1000                # kJ/mol -> bar height (units)


def energy_bar(name, loc, kj, t0, dur=1.2, t_out=None, label=True, lsize=0.4):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector((v.co.x * 0.7, v.co.y * 0.7, v.co.z + 0.5))
    b = mesh_from_bm(name, bm, BAR, loc=loc)
    kf(b, "scale", 0, (0, 0, 0), 'CONSTANT')
    kf(b, "scale", sec(t0), (1, 1, 0.02), 'BEZIER')
    kf(b, "scale", sec(t0 + dur), (1, 1, kj * KJ), 'BEZIER')
    if t_out:
        pop_out(b, sec(t_out), 6, (1, 1, kj * KJ))
    if label:
        tx = _text(name + " Val", str(kj), Vector(loc) + Vector((0, -0.5, kj * KJ + 0.35)), lsize, M["gold"],
                   weight="semibold")
        shadow(tx)
        appear(tx, sec(t0 + dur), t_out and sec(t_out))
    return b


def pull(e, t0, dist=4.0, dur=1.4):
    """The (still) electron flies straight out and is gone."""
    home = e.location.copy()
    kf(e, "location", sec(t0), home, 'BEZIER')
    kf(e, "location", sec(t0 + dur), home * dist, 'BEZIER')
    s = tuple(e.scale)
    kf(e, "scale", sec(t0 + dur) - 1, s, 'CONSTANT')
    kf(e, "scale", sec(t0 + dur), (0, 0, 0), 'CONSTANT')


def eobj(name, k, j):
    return bpy.data.objects[N("%s e%d %d" % (name, k, j))]


# ---- A. sodium loses its outer electron ----
g, radii, out = vatom("A Na", 11, SA + Vector((-1.0, 0, 0.5)), sec(0.4), [(sec(0.4), sec(6.4))], r0=0.6, dr=0.55,
                      e_r=0.13, nuc_r=0.09, rate=0.02)
halo(out[0], (6.6,))
pull(out[0], 7.6)
energy_bar("A Bar", SA + Vector((3.6, 0, -1.4)), 496, 7.6)
big("Lbl A Ion", "Na⁺", SA + Vector((-4.2, -0.6, 1.6)), 9.2, 11.8, mat=M["gold"], size=0.6)
big("Lbl A Energy", "energy", SA + Vector((3.6, -0.6, -1.95)), 7.8, 11.8, mat=M["gold"], size=0.4)

# ---- B-D. sodium and magnesium side by side ----
NA, MG = SB + Vector((-5.2, 0, 0.6)), SB + Vector((2.2, 0, 0.6))
_, rn, on = vatom("B Na", 11, NA, sec(12.4), [(sec(12.4), sec(15.4))], r0=0.6, dr=0.55, e_r=0.12, nuc_r=0.09, rate=0.02)
_, rm, om = vatom("B Mg", 12, MG, sec(13.0), [(sec(21.2), sec(24.2))], r0=0.6, dr=0.55, e_r=0.12, nuc_r=0.09, rate=0.02)
for nm, p, t0 in (("Na", NA, 12.6), ("Mg", MG, 13.2)):
    sy = _text("B %s Sym" % nm, nm, p + Vector((0, -0.3, -2.45)), 0.6, M["white"], weight="semibold")
    shadow(sy)
    appear(sy, sec(t0))
pull(on[0], 16.4)
energy_bar("B Na Bar1", SB + Vector((-2.0, 0, -1.9)), 496, 16.4)
pull(om[0], 25.2)
energy_bar("B Mg Bar1", SB + Vector((5.3, 0, -1.9)), 738, 25.2)
pull(om[1], 33.0)
energy_bar("B Mg Bar2", SB + Vector((6.5, 0, -1.9)), 1450, 33.0)
big("Lbl Mg2", "Mg²⁺", MG + Vector((0, -0.6, 2.2)), 34.4, 41.8, mat=M["gold"], size=0.55)
big("Lbl Na1", "Na⁺", NA + Vector((0, -0.6, 2.2)), 17.8, 41.8, mat=M["gold"], size=0.55)
# sodium's 2nd: an electron of the full L shell; the bar shoots up
e2 = eobj("B Na", 1, 0)
halo(e2, (43.0,))
pull(e2, 44.2, dist=3.0)
energy_bar("B Na Bar2", SB + Vector((-0.8, 0, -1.9)), 4562, 44.2, dur=2.2, lsize=0.55)
big("Lbl Full", "full shell!", NA + Vector((-2.6, -0.6, 2.3)), 45.0, 53.8, mat=M["red"], size=0.55)

# ---- E. the factors: pull arrows (red) from the outer electron toward the nucleus ----
PULL = mat_emit("Pull Red", (1.0, 0.3, 0.25), 3.0)


def still_atom(name, z, loc, t0, t1, thick, counts=None, **kw):
    g, radii, out = vatom(name, z, loc, sec(t0), [], **kw, counts=counts)
    r = radii[-1]
    th = 55 * DEG                      # turn the outer shell so its first electron sits up-right, clear of the others
    bpy.data.objects[N("%s Piv %d" % (name, len(radii) - 1))].rotation_euler = (0, 0, th)
    a = arrow(name + " Pull", r - 0.35, PULL, g, ((r - 0.15) * math.cos(th), (r - 0.15) * math.sin(th), 0.05),
              (0, 0, th + math.pi), r=thick, head=0.28)
    appear(a, sec(t0 + 0.8), sec(t1))
    sy = _text(name + " Sym", SYM[z], Vector(loc) + Vector((0, -0.3, -radii[-1] - 0.6)), 0.55, M["white"],
               weight="semibold")
    appear(sy, sec(t0 + 0.3), sec(t1))
    return g


still_atom("E Li", 3, SE + Vector((-3.0, 0, 0.6)), 54.4, 59.8, 0.07, r0=0.55, dr=0.55, e_r=0.12, nuc_r=0.08)
still_atom("E K", 19, SE + Vector((2.8, 0, 0.6)), 55.0, 59.8, 0.022, r0=0.45, dr=0.45, e_r=0.11, nuc_r=0.07)
still_atom("E Na", 11, SE + Vector((27.0, 0, 0.6)), 60.4, 65.8, 0.025, r0=0.55, dr=0.5, e_r=0.12, nuc_r=0.08)
still_atom("E Cl", 17, SE + Vector((33.0, 0, 0.6)), 61.0, 65.8, 0.075, r0=0.55, dr=0.5, e_r=0.12, nuc_r=0.08)
gN, rN, oN = vatom("E Ne", 10, SE + Vector((60, 0, 0.6)), sec(66.3), [], r0=0.65, dr=0.65, e_r=0.13, nuc_r=0.09)
for i, e in enumerate(oN):
    halo(e, (67.0 + 0.1 * i,), k=1.7, hold=1.6)

# ---- F. Table 3.3 as a city of bars ----
REP = [z for z in range(1, 87) if SYM[z] in IE1]
city = Table("City", SC, orient='floor', zs=REP)
GX = 1.3
for z in REP:
    r, c = place(z)
    t = city.T[z]["t"]
    t.location = Vector(((A_COLS.index(c) - 3.5) * GX, (3.5 - r) * GX, 0))
    appear(t, sec(70.2) + r * 3, dur=6)
    h = IE1[SYM[z]] / 2372 * 5.5
    city.bar(z, sec(71.0 + 0.9 * (r - 1) + 0.04 * c), sec(72.6 + 0.9 * (r - 1) + 0.04 * c), h)
big("Lbl He", "He 2372", SC + Vector((3.5 * GX + 1.9, 2.5 * GX - 0.4, 5.2)), 82.0, 91.8, mat=M["gold"], size=0.55)
big("Lbl Cs", "Cs 376", SC + Vector((-3.5 * GX, -2.5 * GX - 0.4, 1.9)), 83.0, 91.8, mat=M["cyan"], size=0.55)

# ---- G/H. the sets: the three chosen bars stay, the rest step back; the tallest gets the frame ----
spans = [(set(zs), sec(92.2 + 5 * k), sec(97 + 5 * k)) for k, (_, _, zs, _) in enumerate(SETS)]
spans.append(({3, 4, 11, 12, 19, 20, 37, 38, 55, 56}, sec(122.2), sec(131.8)))
table_focus(city, spans, small=0.35)
for k, (_, _, zs, win) in enumerate(SETS):
    t0 = 92.2 + 5 * k
    fr = empty("Set Frame %d" % k, Vector((0, 0, 0)), city.root)
    frame_box("Set Frame %d Box" % k, 1.2, 1.2, parent=fr, depth=0.05)
    fr.location = city.T[win]["t"].location + Vector((0, 0, IE1[SYM[win]] / 2372 * 5.5 + 0.2))
    appear(fr, sec(t0 + 2.0), sec(t0 + 4.7), dur=6)
    city.pulse(win, sec(t0 + 2.0), 1.3, 16)
for k, (a, b) in enumerate(((3, 4), (11, 12), (19, 20), (37, 38), (55, 56))):
    city.pulse(a, sec(127.4 + 0.5 * k), 1.35, 14)
big("Lbl Group1", "group I: lower", SC + Vector((-3.5 * GX - 0.4, -2.0 * GX, 3.6)), 127.4, 131.8, mat=M["cyan"], size=0.5)
finish_film()
