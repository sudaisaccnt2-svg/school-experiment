# ---- Film 08 (v4 "show, don't tell"): Isotopes; isotopes of hydrogen (textbook pp.52-53, Tables 2.5 and 2.6) ----
# Beats: one hydrogen atom (1 p, 1 e) = protium · a neutron flies in = deuterium · another = tritium · the three side
# by side: same proton (same element), different neutrons = isotopes · scales weigh them (A = 1, 2, 3) · 20,000 dots,
# 3 gold = 0.015 % deuterium · 1 electron each = same chemistry · H₂O against D₂O on a balance, Table 2.6 row by row.
# bsend.py common.py p2/lib.py u3/u3lib.py v4lib.py p2/f08_isotopes_h.py      (old v2: backups/f08_isotopes_h_v2.py)
import bmesh
start_film("08", "08 Isotopes of Hydrogen", 100.0)
O, S, WG, GR, W = [Vector((40 * k, 0, 0)) for k in range(5)]
for name, t in (("Protium", 0), ("Deuterium", 10), ("Tritium", 21), ("Isotopes", 32), ("Weigh them", 44),
                ("How common?", 56), ("Same chemistry", 70), ("H₂O and D₂O", 80)):
    act(name, sec(t))
NPOS = [Vector((0.42, 0.16, 0.08)), Vector((-0.2, 0.42, 0.12))]      # where the 1st and 2nd neutron sit
ISO = [("Protium (H)", 0), ("Deuterium (D)", 1), ("Tritium (T)", 2)]


def show(ob, spans, s=None, dur=8):
    """Visible only inside the given (t0, t1) spans: pops in at t0, gone at t1."""
    s = tuple(s or ob.scale)
    kf(ob, "scale", 0, (0, 0, 0), 'CONSTANT')
    for a, b in spans:
        kf(ob, "scale", sec(a), (0, 0, 0), 'BEZIER')
        kf(ob, "scale", sec(a) + dur, s, 'CONSTANT')
        kf(ob, "scale", sec(b) - 1, s, 'CONSTANT')
        kf(ob, "scale", sec(b), (0, 0, 0), 'CONSTANT')


def hatom(name, loc, nn, R):
    """A flat hydrogen atom: 1 proton (+ nn neutrons) and 1 electron on its shell. Returns (group, p, ns, e)."""
    g, _ = flat_rings(name, loc, [R])
    p = sphere(name + " p", 0.28, M["proton"], (0, 0, 0), g)
    ns = [sphere(name + " n%d" % k, 0.28, M["neutron"], NPOS[k], g) for k in range(nn)]
    e = electron(name + " e", g, (-R, 0, 0), 0.14)
    return g, p, ns, e


# ---- 1-3. one atom: protium, then a neutron flies in (deuterium), then another (tritium) ----
shot("Cam Solo", 0, 32, O + Vector((-1.5, 0, -0.2)), dist=12, drift=0.25)
G, rg = flat_rings("Solo", O + Vector((0, 0, 0.3)), [1.6], t_in=[0.6])
hide_from(G, sec(32))
pr = sphere("Solo p", 0.28, M["proton"], (0, 0, 0), G)
appear(pr, sec(1.2), dur=10, s=(0.28,) * 3)
spn = empty("Solo Spin", (0, 0, 0), G)
e = electron("Solo e", spn, (-1.6, 0, 0), 0.14)
land(e, 2.6, dur=1.0, k=2.0)
spin(spn, sec(4.4), sec(9.6), 2)                                   # its one electron goes round the nucleus
for k, t in enumerate((11.5, 22.5)):                               # each neutron flies in from the right
    n = sphere("Solo n%d" % k, 0.28, M["neutron"], NPOS[k], G)
    land(n, t, dur=1.4, frm=(3.6, 1.8, 0), tmat=V4_TRAIL)
    ring_flash("Solo Flash %d" % k, G, 0.75, t + 1.45)
    big("Solo New %d" % k, "+1 neutron", O + Vector((2.6, -0.6, 2.4)), t - 0.4, t + 3.0, mat=M["gold"], size=0.42)
for k, (nm, nn) in enumerate(ISO):
    t0, t1 = (0.8, 13.2, 24.2)[k], (10.0, 21.0, 32.0)[k]
    big("Solo Name %d" % k, nm, O + Vector((-4.6, -0.6, 1.3)), t0 + 0.6, t1, mat=M["gold"], size=0.5)
    nsym("Solo %d" % k, "H", 1 + nn, 1, O + Vector((-4.6, -0.6, 0.0)), t0 + 1.0, sec(t1), size=0.9)
    big("Solo Count %d" % k, "%d neutron%s" % (nn, "" if nn == 1 else "s"), O + Vector((-4.6, -0.6, -1.2)), t0 + 1.4,
        t1, mat=M["white"], size=0.36)
say("A1", "Hydrogen: 1 proton, 1 electron", 0.3, 6.0)
say("A2", "This is protium", 6.0, 10.0)
say("B1", "Add one neutron", 10.0, 14.0)
say("B2", "Now it is deuterium", 14.0, 21.0)
say("C1", "Add another neutron", 21.0, 25.0)
say("C2", "Now it is tritium", 25.0, 32.0)

# ---- 4. side by side: same proton, different neutrons = isotopes (shown again in beat 7) ----
shot("Cam Three", 32, 44, S + Vector((0, 0, -0.3)), dist=15, drift=0.2)
trio = []
for k, (nm, nn) in enumerate(ISO):
    c = S + Vector((-4.8 + 4.8 * k, 0, 0.5))
    g, p, ns, e = hatom("Trio %d" % k, c, nn, 1.3)
    show(g, [(32.3 + 0.5 * k, 44), (70, 80)], dur=10)
    trio.append((g, p, ns, e))
    big("Trio Name %d" % k, nm, c + Vector((0, -0.6, 1.9)), 32.6 + 0.5 * k, 44, mat=M["gold"], size=0.42)
    big("Trio Name2 %d" % k, nm, c + Vector((0, -0.6, 1.9)), 70.2, 80, mat=M["gold"], size=0.42)
    nsym("Trio %d" % k, "H", 1 + nn, 1, c + Vector((0, -0.6, -1.75)), 33.0 + 0.5 * k, sec(44), size=0.6)
    big("Trio n %d" % k, "%d n" % nn, c + Vector((0, -0.6, -2.5)), 37.6 + 0.7 * k, 44, mat=M["white"], size=0.42)
    pulse(p, 34.4, 1.6, dur=16)
    for nb in ns:
        pulse(nb, 37.4 + 0.7 * k, 1.5, dur=16)
say("D1", "Same proton: same element", 32, 37)
say("D2", "Different neutrons", 37, 40.5)
say("D3", "These are isotopes", 40.5, 44)

# ---- 5. weigh them: each neutron adds about one unit (A = 1, 2, 3) ----
shot("Cam Scales", 44, 56, WG + Vector((0, 0, -0.9)), dist=16, drift=0.2)
METAL = gloss("Scale Metal", (0.6, 0.62, 0.68), rough=0.3)
DARK = gloss("Scale Dark", (0.08, 0.09, 0.11), rough=0.4)
for k, (nm, nn) in enumerate(ISO):
    c = WG + Vector(((k - 1) * 4.6, 0, -2.2))
    t = 45.4 + 2.6 * k
    sc = empty("Scale %d" % k, c)
    cyl("Scale %d Base" % k, 1.15, 1.0, 0.7, DARK, (0, 0, 0), sc, base=True)
    plat = empty("Scale %d Plat" % k, (0, 0, 1.1), sc)
    cyl("Scale %d Top" % k, 1.0, 1.0, 0.1, METAL, (0, 0, 0), plat)
    cyl("Scale %d Post" % k, 0.12, 0.12, 0.6, METAL, (0, 0, -0.35), plat)
    appear(sc, sec(44.3 + 0.3 * k), sec(55.8), dur=10)
    load = empty("Scale %d Load" % k, (0, 0, 2.4), plat)
    nucleus("Scale %d Nuc" % k, 1, nn, load, r=0.3, seed=50 + k)
    hide_until(load, sec(t))
    f_land = sec(t) + 18
    kf(load, "location", sec(t), (0, 0, 2.4), 'BEZIER')
    kf(load, "location", f_land, (0, 0, 0.45), 'BEZIER')
    kf(plat, "location", f_land, (0, 0, 1.1), 'BEZIER')
    kf(plat, "location", f_land + 12, (0, 0, 1.1 - 0.15 * (1 + nn)), 'BEZIER')
    big("Scale Name %d" % k, "HDT"[k], c + Vector((0, -0.6, 3.9)), 44.6 + 0.3 * k, 55.8, mat=M["white"], size=0.55)
    big("Scale A %d" % k, "A = %d" % (1 + nn), c + Vector((0, -1.3, -0.25)), t + 1.2, 55.8, mat=M["gold"], size=0.5)
say("E1", "Each neutron adds weight", 44, 52.4)
say("E2", "Mass numbers 1, 2, 3", 52.4, 56)

# ---- 6. how common? 20,000 hydrogen atoms, 3 gold ones are deuterium (0.015 %) ----
shot("Cam Count", 56, 70, GR + Vector((0, 0, 0.3)), dist=20, drift=0.15)
DOT = mat_emit("H Dot", (0.55, 0.68, 0.95), 0.55)
SP, Q = 0.06, 0.042
bm = bmesh.new()
for i in range(10):
    for j in range(10):
        x, z = (i + 0.5) * SP, -(j + 0.5) * SP
        vs = [bm.verts.new((x + a * Q / 2, 0, z + b * Q / 2)) for a, b in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
        bm.faces.new(vs)
tile = mesh_from_bm("Grid Tile", bm, DOT, loc=GR)
hide_from(tile, 1)
for blk, bx in enumerate((-6.3, 0.3)):
    blk_g = empty("Grid Block %d" % blk, GR + Vector((bx, 0, 3.6)))
    for ti in range(10):
        for tj in range(10):
            ob = bpy.data.objects.new(N("Grid %d %d %d" % (blk, ti, tj)), tile.data)
            put(ob, "Models")
            ob.parent = blk_g
            ob.location = (ti * 10 * SP, 0, -tj * 10 * SP)
    appear(blk_g, sec(56.4 + 0.6 * blk), sec(69.8), dur=14)
GOLD = mat_emit("D Dot", (1.0, 0.75, 0.25), 6.0)
for k, (blk, i, j) in enumerate(((0, 37, 62), (1, 12, 25), (1, 81, 70))):
    p = GR + Vector(((-6.3, 0.3)[blk] + (i + 0.5) * SP, -0.05, 3.6 - (j + 0.5) * SP))
    d = sphere("D Dot %d" % k, 0.07, GOLD, p, None, 12, 6)
    appear(d, sec(60.4 + 1.2 * k), sec(69.8), dur=6, s=(0.07,) * 3)
    ring_flash("D Ring %d" % k, empty("D Ring %d G" % k, p + Vector((0, -0.05, 0)), rot=(90 * DEG, 0, 0)), 0.3,
               60.4 + 1.2 * k, k=1.6)
big("Count 20000", "20,000 atoms", GR + Vector((0, -0.6, 4.2)), 57.4, 64.2, mat=M["white"], size=0.6)
big("Count D", "3 deuterium = 0.015 %", GR + Vector((0, -0.6, 4.2)), 64.4, 69.8, mat=M["gold"], size=0.6)
say("F1", "20,000 hydrogen atoms", 56, 60.2)
say("F2", "Only 3 are deuterium", 60.2, 64.2)
say("F3", "3 in 20,000", 64.2, 67.4)
say("F4", "Tritium is very rare", 67.4, 70)

# ---- 7. same chemistry: one electron each; different weight: different physical properties ----
shot("Cam Three 2", 70, 80, S + Vector((0, 0, -0.3)), dist=15, drift=0.2)
for k, (g, p, ns, e) in enumerate(trio):
    pulse(e, 71.2, 1.8, dur=18)
    ring_flash("Trio Flash %d" % k, g, 1.3, 71.2)
    for nb in [p] + ns:
        pulse(nb, 75.8, 1.5, dur=16)
say("G1", "1 electron each: same chemistry", 70, 75.4)
say("G2", "Different weight: different physical properties", 75.4, 80)

# ---- 8. H₂O and D₂O on a balance, then Table 2.6 row by row ----
shot("Cam Water", 80, None, W + Vector((0, 0, -0.3)), dist=18, drift=0.2)
O_M = gloss("Oxygen Red", (0.85, 0.16, 0.12), rough=0.35)
H_M = gloss("Hydrogen White", (0.92, 0.92, 0.95), rough=0.35)
D_M = gloss("Deuterium Gold", (0.95, 0.78, 0.35), rough=0.35)
ANG = 104.5 * DEG / 2
beam = empty("Beam", W + Vector((0, 0, -0.05)))
box("Beam Bar", (8.8, 0.45, 0.1), METAL, (0, 0, -0.05), beam)
fulc = cyl("Fulcrum", 0.55, 0.05, 0.7, DARK, W + Vector((0, 0, -0.45)))
appear(beam, sec(80.4), dur=10)
appear(fulc, sec(80.4), dur=10)


def water(name, c, hm, hr):
    g = empty(name, c, beam)
    for k, sgn in enumerate((-1, 1)):
        d = Vector((math.sin(ANG) * sgn, 0, -math.cos(ANG)))
        sphere(name + " H%d" % k, hr, hm, d * 0.95, g)
    sphere(name + " O", 0.72, O_M, (0, 0, 0), g)
    return g


h2o = water("H2O", (-3.6, 0, 1.65), H_M, 0.42)
d2o = water("D2O", (3.6, 0, 1.65), D_M, 0.5)
appear(h2o, sec(80.8), dur=12)
appear(d2o, sec(81.4), dur=12)
kf(beam, "rotation_euler", sec(82.6), (0, 0, 0), 'BEZIER')
kf(beam, "rotation_euler", sec(84.0), (0, 6 * DEG, 0), 'BEZIER')
big("Lbl H2O", "H₂O", W + Vector((-3.6, -0.6, 3.0)), 81.0, None, mat=M["white"], size=0.55)
big("Lbl D2O", "D₂O heavy water", W + Vector((3.6, -0.6, 3.15)), 81.6, None, mat=M["gold"], size=0.5)
ROWS = [("Molecular mass (a.m.u.)", "mass", "18.02", "20.03"), ("Density at 0 °C (g cm⁻³)", "density", "1.000", "1.105"),
        ("Melting point (°C)", "m.p.", "0.00", "3.82"), ("Boiling point (°C)", "b.p.", "100.00", "101.42")]
for k, (prop, short, a, b) in enumerate(ROWS):
    t = 85.0 + 3.0 * k
    z = -1.0 - 0.45 * k
    big("Row %d Name" % k, short, W + Vector((0, -0.6, z)), t, None, mat=M["dim"], size=0.34)
    big("Row %d H" % k, a, W + Vector((-3.6, -0.6, z)), t, None, mat=M["white"], size=0.42)
    vb = big("Row %d D" % k, b, W + Vector((3.6, -0.6, z)), t + 0.6, None, mat=M["gold"], size=0.42)
    pulse(vb, t + 1.2, 1.3)
    say("H%d" % (k + 1), prop, t, t + 3.0)
say("H0", "D₂O is heavier", 80, 85)
say("H5", "Table 2.6: H₂O and D₂O", 97, None)
scene["ar_range"] = [sec(32), sec(44) - 1]      # AR: the three hydrogen isotopes side by side
scene["ar_scale"] = 0.04
finish_film()
