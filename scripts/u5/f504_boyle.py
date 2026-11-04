# ---- Film 504: Boyle's law (textbook pp.126-129: 1662 Boyle, V ∝ 1/P, PV = Kb, P1V1 = P2V2, Fig 5.4 apparatus,  (v4 captions)
# Fig 5.5 curve, Fig 5.6 diagram, Example 5.1, Practice 5.1) ----
start_film("504", "504 Boyles Law", 100.5)
END = scene.frame_end
SA, SB, SC, SD, SE, SF = (Vector((40 * k, 0, 0)) for k in range(6))

shot("Cam Squeeze", 0, 30, SA + Vector((0.9, 0, -0.3)), dist=15, pitch=0.1)
shot("Cam Graph", 30, 48, SB + Vector((0, 0, -0.1)), dist=15.5)
shot("Cam PV", 48, 62, SC + Vector((0, 0, -0.4)), dist=16, pitch=0.08)
shot("Cam Fig 5.6", 62, 70, SF + Vector((0, 0, -0.2)), dist=15)
shot("Cam Example", 70, 86, SD + Vector((0.9, 0, -0.3)), dist=15, pitch=0.1)
shot("Cam Practice", 86, None, SE + Vector((0.9, 0, -0.3)), dist=15, pitch=0.1)
for name, t in (("Squeeze", 0), ("Graph", 30), ("PV = k", 48), ("Fig 5.6", 62), ("Example 5.1", 70), ("Practice 5.1", 86)):
    act(name, sec(t))

say('A1', 'Boyle: gas, dial, same temperature', 0.1, 7)
say('A2', 'Double pressure: half volume', 7, 15)
say('A3', 'Four times: a quarter', 15, 22)
say('A4', 'Pressure up, volume down', 22, 30)
say('B1', 'The points make a curve', 30, 39)
say('B2', 'P × V never changes', 39, 48)
say('C1', 'PV = Kb', 48, 55)
say('C2', 'P₁V₁ = P₂V₂', 55, 62)
say('C3', 'Less pressure, more volume', 62, 70)
say('D1', '530 dm³ at 800 → 400?', 70, 77)
say('D2', 'Half pressure: 1060 dm³', 77, 86)
say('E1', '70.4 cm³ at 3 atm → 1.20?', 86, 92)
say('E2', 'Less pressure: 176 cm³', 92, 100)

R, Hc = 1.3, 4.0
Z0 = -2.2


def gas_in(name, pz, t0, t1, n=16, seed=1, f_in=None, base=SA):
    """Molecules in the rig at `base`, roof = piston (pz(t) is the piston's local z)."""
    return gas(name, n, base + Vector((-R + 0.35, -0.5, Z0)), lambda t: base + Vector((R - 0.35, 0.5, Z0 + pz(t) - 0.1)),
               t0, t1, speed=2.6, r=0.13, seed=seed, f_in=f_in)


def vol_label(key, txt, base, pz_val, t0, t1, mat=None):
    big(key, txt, base + Vector((-R - 0.4, -0.6, Z0 + pz_val / 2)), t0, t1, mat=mat or M["cyan"], size=0.5, align='RIGHT')


def p_label(key, txt, base, t0, t1):
    big(key, txt, base + Vector((2.7, -0.6, Z0 + 2.25)), t0, t1, mat=M["red"], size=0.5)


# ---- A. squeeze: P × 2 → V ÷ 2, P × 4 → V ÷ 4, and back ----
cg, pis, nd = rig("A Rig", SA + Vector((0, 0, Z0)), R, Hc, 0.2)
KA = [(0, 3.2), (8, 3.2), (10, 1.6), (16, 1.6), (18, 0.8), (24, 0.8), (27, 3.2)]
key_piston(pis, KA)
needle_keys(nd, [(0, 0.2), (8, 0.2), (10, 0.4), (16, 0.4), (18, 0.8), (24, 0.8), (27, 0.2)])
gas_in("A Mol", zpath(KA), 0.0, 30.0, seed=2, f_in=sec(0.6))
col = thermo("A Thermo", SA + Vector((4.5, -0.1, Z0)), h=3.0)
level(col, 0, 0.45)
appear(col.parent, sec(0.4), dur=10)
for key, txt, z, t0, t1 in (("P1", "1 atm", 3.2, 1.0, 9.6), ("P2", "2 atm", 1.6, 10.0, 17.6), ("P4", "4 atm", 0.8, 18.0, 26.0)):
    p_label("Lbl A " + key, txt, SA, t0, t1)
for key, txt, z, t0, t1 in (("V1", "4 L", 3.2, 1.0, 8.0), ("V2", "2 L", 1.6, 10.2, 16.0), ("V4", "1 L", 0.8, 18.2, 24.0)):
    vol_label("Lbl A " + key, txt, SA, z, t0, t1)

# ---- B. the graph: three points, then the curve; P × V = 4 each time ----
o = axes("B Ax", SB + Vector((-5.0, 0, -2.2)), 9.0, 4.8, "P (atm)", "V (L)", 30.2, size=0.5)
sx, sz = 2.0, 1.1
pts = [(1, 4), (2, 2), (4, 1)]
for k, (p, v) in enumerate(pts):
    d = sphere("B Pt %d" % k, 0.16, M["gold"], o + Vector((p * sx, -0.05, v * sz)), None, 16, 8)
    appear(d, sec(31.0 + 1.2 * k), s=(0.16,) * 3)
plot("B Curve", [o + Vector((p * sx, 0, (4.0 / p) * sz)) for p in [0.9 + 0.1 * i for i in range(35)]], 35.0, 3.5, r=0.05)
for k, (p, v) in enumerate(pts):
    big("Lbl B %d" % k, "%d × %d = 4" % (p, v), o + Vector((p * sx + 0.5, -0.6, v * sz + 0.45)), 39.5 + 1.2 * k, 48.0,
        mat=M["green"], size=0.42, align='LEFT')

# ---- C. before and after: P₁V₁ and P₂V₂, then Fig 5.6 letters ----
for k, (x, pz, lab, fr) in enumerate(((-3.5, 3.2, "P₁ V₁", 0.2), (3.5, 1.6, "P₂ V₂", 0.4))):
    b = SC + Vector((x - 1.0, 0, 0))
    cg2, pis2, nd2 = rig("C Rig %d" % k, b + Vector((0, 0, Z0)), R, Hc, 48.2 + 0.4 * k)
    pis2.location = (0, 0, pz)
    needle_to(nd2, 0, fr)
    gas_in("C Mol %d" % k, lambda t, pz=pz: pz, 48.0, 62.0, seed=10 + k, f_in=sec(48.8 + 0.4 * k), base=b)
    big("Lbl C %d" % k, lab, b + Vector((1.0, -0.6, 2.9)), 55.2 + 0.6 * k, 61.8, mat=M["gold"], size=0.65)
# Fig 5.6: P letters shrink while V letters grow
for k in range(4):
    x = -4.5 + 3.0 * k
    ps, vs = 1.6 - 0.35 * k, 0.55 + 0.35 * k
    lp = _text("C Fig P %d" % k, "P", SF + Vector((x - 0.5, -0.3, 0.6)), ps, M["red"], weight="semibold")
    lv = _text("C Fig V %d" % k, "V", SF + Vector((x + 0.5, -0.3, -1.4)), vs, M["cyan"], weight="semibold")
    shadow(lp)
    shadow(lv)
    appear(lp, sec(62.6 + 0.8 * k))
    appear(lv, sec(63.0 + 0.8 * k))

# ---- D. Example 5.1: 800 → 400 mm Hg, 530 → 1060 dm³ ----
cg, pis, nd = rig("D Rig", SD + Vector((0, 0, Z0)), R, Hc, 70.2)
KD = [(0, 1.6), (78, 1.6), (81, 3.2)]
key_piston(pis, KD)
needle_keys(nd, [(0, 0.8), (78, 0.8), (81, 0.4)])
gas_in("D Mol", zpath(KD), 70.0, 86.0, seed=21, f_in=sec(70.6), base=SD)
p_label("Lbl D P1", "800 mm Hg", SD, 70.8, 79.0)
p_label("Lbl D P2", "400 mm Hg", SD, 79.4, None)
vol_label("Lbl D V1", "530 dm³", SD, 1.6, 71.2, 78.0)
vol_label("Lbl D V2", "1060 dm³", SD, 3.2, 81.2, None, mat=M["green"])

# ---- E. Practice 5.1: 3 atm, 70.4 cm³ → 1.20 atm, 176 cm³ ----
cg, pis, nd = rig("E Rig", SE + Vector((0, 0, Z0)), R, Hc, 86.2)
KE = [(0, 1.28), (93, 1.28), (96, 3.2)]
key_piston(pis, KE)
needle_keys(nd, [(0, 0.75), (93, 0.75), (96, 0.3)])
gas_in("E Mol", zpath(KE), 86.0, 104.0, seed=31, f_in=sec(86.6), base=SE)
p_label("Lbl E P2", "3 atm", SE, 86.8, 94.0)
p_label("Lbl E P1", "1.20 atm", SE, 94.4, None)
vol_label("Lbl E V2", "70.4 cm³", SE, 1.28, 87.2, 93.0)
vol_label("Lbl E V1", "176 cm³", SE, 3.2, 96.2, None, mat=M["green"])
finish_film()
