# ---- Film 309: Electron affinity (textbook pp.80-81: 3.2.3, Cl and O equations, factors, trends, Table 3.4) ----
# bsend.py common.py p2/lib.py u3/u3lib.py u3/f309_affinity.py
start_film("309", "309 Electron Affinity", 90.0)
END = scene.frame_end
SA, SO, SF, SC = Vector((0, 0, 0)), Vector((40, 0, 0)), Vector((80, 0, 0)), Vector((140, 0, 0))

shot("Cam Catch", 0, 22, SA + Vector((0, 0, -0.5)), dist=14)
shot("Cam Oxygen", 22, 36, SO + Vector((0, 0, 0.0)), dist=16)
shot("Cam Size", 36, 48, SF + Vector((0, 0, -0.3)), dist=17)
shot("Cam City", 48, 82, SC + Vector((0, -1.0, 0.9)), dist=17.5, pitch=0.6)
shot("Cam End", 82, None, SC + Vector((0, -1.0, 0.9)), dist=17.5, pitch=0.6)
for name, t in (("Taking an electron", 0), ("Oxygen", 22), ("Factors", 36), ("Table 3.4", 48), ("+ values", 74)):
    act(name, sec(t))

caps([
    ("A1", "Electron affinity", "When a gas atom TAKES an extra electron, energy is given out", 0.1, 7),
    ("A2", "Chlorine catches one", "Cl + e⁻ → Cl⁻.  A burst of energy flies out.", 7, 14),
    ("B", "Chlorine: −348.8 kJ/mol", "The minus sign means the energy is GIVEN OUT (released)", 14, 22),
    ("C1", "Oxygen takes 1 electron: −141", "Energy is given out, and O⁻ forms", 22, 29),
    ("C2", "The 2nd electron: +844!", "O⁻ is negative and pushes it away: energy must be PUT IN", 29, 36),
    ("D1", "What makes it high?", "A small atom, a big nuclear charge and little shielding", 36, 42),
    ("D2", "Chlorine 349 vs iodine 295", "Iodine is bigger: its outer shell is far from the nucleus", 42, 48),
    ("E1", "Table 3.4 as bars", "Gold = energy given out.  Taller = it takes an electron more eagerly.", 48, 58),
    ("E2", "Across a period: MORE", "Smaller atoms with more protons pull the new electron harder", 58, 66),
    ("E3", "Down a group: LESS", "From chlorine down: 349, 325, 295, 270. New shells shield.", 66, 74),
    ("F1", "Red bars: energy is NEEDED (+)", "Group IIA and the noble gases: full shells don't want one more", 74, 82),
    ("G", "Next: Shielding effect  →", "Why inner electrons make outer ones easy to lose", 82),
])
GOLDM = mat_pbr("Energy Bar", (1.0, 0.72, 0.3), metallic=0.8, roughness=0.25)
REDM = mat_pbr("Energy Bar Red", (1.0, 0.28, 0.22), metallic=0.4, roughness=0.35)
REDW = mat_emit("Energy Wave Red", (1.0, 0.35, 0.3), 6.0)
K = 2.6 / 349                  # kJ/mol -> bar height

# ---- A/B. chlorine catches its 8th outer electron; energy flies out ----
CL = SA + Vector((-1.6, 0, 0.5))
g, rr, out = vatom("Cl", 17, CL, sec(0.4), [(sec(0.4), sec(7.6))], counts=[2, 8, 8], r0=0.6, dr=0.6, e_r=0.13,
                   nuc_r=0.09, rate=0.02)
fly_in(out[0], 8.0)
for k, d in enumerate(((1, 0, 0.7), (-0.6, 0, 1), (0.9, 0, -0.5), (-1, 0, -0.2))):
    energy_wave("Cl Wave %d" % k, CL + Vector(d).normalized() * 1.9 + Vector((0, -0.4, 0)), d, 9.6 + 0.12 * k)
pulses("Cl Burst", CL + Vector((0, -0.3, 0)), None, [9.6], r=2.0, mat=M["gold"])
big("Lbl Cl Ion", "Cl⁻", CL + Vector((-3.2, -0.6, 1.7)), 10.6, 21.8, mat=M["gold"], size=0.65)
ebar("Cl Bar", SA + Vector((3.8, 0, -1.6)), 348.8 * K, 14.4, "−348.8", GOLDM)
big("Lbl Out", "energy OUT", SA + Vector((3.8, -0.6, -2.15)), 14.8, 21.8, mat=M["gold"], size=0.4)

# ---- C. oxygen: the 1st electron gives energy out, the 2nd needs energy in ----
OX = SO + Vector((-1.6, 0, 0.5))
go, ro, oo = vatom("O", 8, OX, sec(22.4), [(sec(22.4), sec(23.6))], counts=[2, 8], r0=0.65, dr=0.75, e_r=0.13,
                   nuc_r=0.09, rate=0.02, gold_outer=True)
hide_until(oo[1], sec(29.6))
fly_in(oo[0], 24.0)
for k, d in enumerate(((1, 0, 0.7), (-0.8, 0, 0.9))):
    energy_wave("O Wave %d" % k, OX + Vector(d).normalized() * 1.6 + Vector((0, -0.4, 0)), d, 25.6 + 0.12 * k)
K2 = 2.0 / 349
ebar("O Bar1", SO + Vector((3.2, 0, -1.6)), 141 * K2, 25.8, "−141", GOLDM)
big("Lbl O1", "O⁻", OX + Vector((-3.0, -0.6, 1.7)), 26.4, 29.4, mat=M["gold"], size=0.6)
# the 2nd electron: comes in, bounces off, then is pushed in by energy (red)
e2 = oo[1]
home = e2.location.copy()
for t, v in ((29.6, home * 4.0), (31.0, home * 1.45), (31.8, home * 3.2), (33.0, home * 3.2), (34.2, home)):
    kf(e2, "location", sec(t), v, 'BEZIER')
pulses("O Bounce", OX + Vector((0, -0.3, 0)), None, [31.0], r=1.6, mat=M["red"])
for k in range(3):
    energy_wave("O Push %d" % k, OX + Vector((-4.6 + 0.0 * k, -0.4, -1.2 + 0.5 * k)), (1, 0, 0.35), 32.6 + 0.2 * k,
                mat=REDW, dist=2.6, dur=0.9)
ebar("O Bar2", SO + Vector((4.4, 0, -1.6)), 844 * K2, 33.0, "+844", REDM, lmat=M["red"])
big("Lbl O2", "O²⁻", OX + Vector((-3.0, -0.6, 1.7)), 34.6, 35.8, mat=M["red"], size=0.6)
big("Lbl In", "energy IN", SO + Vector((4.4, -0.6, -2.15)), 33.4, 35.8, mat=M["red"], size=0.4)

# ---- D. small vs big: chlorine and iodine, each takes an electron; compare the energy given out ----
for k, (z, x, val, t0) in enumerate(((17, -4.6, 349, 36.6), (53, 2.2, 295, 42.6))):
    p = SF + Vector((x, 0, 0.6))
    counts = shells_of(z)
    counts[-1] += 1
    g, rad, ou = vatom("D %s" % SYM[z], z, p, sec(t0), [(sec(t0), sec(t0 + 1.4))], counts=counts,
                       r0=0.4 if z == 17 else 0.35, dr=0.42 if z == 17 else 0.36, e_r=0.09, nuc_r=0.06, rate=0.03,
                       ring_depth=0.012)
    fly_in(ou[0], t0 + 1.6)
    sy = _text("D %s Sym" % SYM[z], SYM[z], p + Vector((0, -0.3, -rad[-1] - 0.6)), 0.55, M["white"], weight="semibold")
    appear(sy, sec(t0 + 0.3))
    ebar("D %s Bar" % SYM[z], p + Vector((rad[-1] + 1.0, 0, -1.6)), val * K, t0 + 3.2, "−%d" % val, GOLDM)

# ---- E/F. Table 3.4 as a city: gold bars = energy out, red bars = energy needed ----
REP = [z for z in range(1, 87) if SYM[z] in EA]
city = Table("City", SC, orient='floor', zs=REP,
             color=lambda z: "goldt" if EA[SYM[z]] < 0 else ("warn" if EA[SYM[z]] > 0 else "plain"))
GX = 1.3
for z in REP:
    r, c = place(z)
    t = city.T[z]["t"]
    t.location = Vector(((A_COLS.index(c) - 3.5) * GX, (3.5 - r) * GX, 0))
    appear(t, sec(48.2) + r * 3, dur=6)
    h = max(abs(EA[SYM[z]]) * K * 1.3, TH)
    city.bar(z, sec(49.0 + 0.8 * (r - 1) + 0.04 * c), sec(50.6 + 0.8 * (r - 1) + 0.04 * c), h)
ROW3 = {11, 12, 13, 14, 15, 16, 17}
HAL = {17, 35, 53, 85}
REDS = {z for z in REP if EA[SYM[z]] > 0}
table_focus(city, [(ROW3, sec(58.2), sec(66)), (HAL, sec(66), sec(74)), (REDS, sec(74), sec(81.8))], small=0.35)
for k, z in enumerate(sorted(ROW3)):
    city.pulse(z, sec(59.4 + 0.4 * k), 1.25, 12)
for k, z in enumerate(sorted(HAL)):
    city.pulse(z, sec(67.2 + 0.6 * k), 1.3, 14)
big("Lbl Gold", "gold = energy out", SC + Vector((-4.6, -4.0, 4.6)), 50.0, 57.8, mat=M["gold"], size=0.5)
big("Lbl Red", "red = energy needed", SC + Vector((4.6, -4.0, 4.6)), 51.0, 57.8, mat=M["red"], size=0.5)
finish_film()
