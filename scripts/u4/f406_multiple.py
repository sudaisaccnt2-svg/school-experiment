# ---- Film 406: Single, double and triple bonds (textbook pp.99-102: Fig 4.6 Cl2, 4.7 CH4, 4.8 O2, 4.9 CO2,  (v4 captions)
# 4.10 N2, Scientific Information 1.7 rule, Activity 4.1) ----
start_film("406", "406 Single Double Triple", 100.0)
END = scene.frame_end
SA, SB, SC, SD, SE, SF, SG = (Vector((40 * k, 0, 0)) for k in range(7))

shot("Cam Cl2", 0, 13, SA + Vector((0, 0, -0.4)), dist=12)
shot("Cam CH4", 13, 28, SB + Vector((0, 0, 0.3)), dist=15.5)
shot("Cam O2", 28, 41, SC + Vector((0, 0, -0.4)), dist=12)
shot("Cam CO2", 41, 54, SD + Vector((0, 0, -0.4)), dist=13)
shot("Cam N2", 54, 66, SE + Vector((0, 0, -0.4)), dist=12)
shot("Cam Rule", 66, 80, SF + Vector((0, 0, -0.4)), dist=14)
shot("Cam Sort", 80, None, SG + Vector((0, 0, -0.7)), dist=18)
for name, t in (("Single: Cl2", 0), ("Single: CH4", 13), ("Double: O2", 28), ("Double: CO2", 41), ("Triple: N2", 54),
                ("The 1.7 rule", 66), ("Activity 4.1", 80)):
    act(name, sec(t))

say('A1', 'One shared pair: single bond', 0.1, 7)
say('A2', 'Both have 8: Cl–Cl', 7, 13)
say('B1', 'Carbon needs 4 more', 13, 20)
say('B2', 'Four single bonds: CH₄', 20, 28)
say('C1', 'Two shared pairs: double bond', 28, 35)
say('C2', 'Two lines: O=O', 35, 41)
say('D1', 'Carbon shares with two oxygens', 41, 48)
say('D2', 'Two double bonds: O=C=O', 48, 54)
say('E1', 'Three shared pairs: triple bond', 54, 60)
say('E2', 'Three lines: N≡N', 60, 66)
say('F1', 'Share or give? Subtract', 66, 70)
say('F2', 'H–H: 0 · covalent', 70, 73.5)
say('F3', 'H–Cl: 0.9 · covalent', 73.5, 76.5)
say('F4', 'Na–Cl: 2.1 · ionic', 76.5, 80)
say('G1', 'Covalent or ionic?', 80, 90)
say('G2', 'NaCl, MgCl₂ ionic · rest covalent', 90, None)

RR = 1.1
# ---- XA. Cl-Cl ----
XA = LRing("A ClA", "Cl", SA + Vector((-3.4, 0, 0.6)), 7, 0.4, 12.8, r=RR, angles=[76, 104, 256, 284, 166, 194, 0])
XB = LRing("A ClB", "Cl", SA + Vector((3.4, 0, 0.6)), 7, 0.8, 12.8, r=RR, emat=E_GOLD, angles=[76, 104, 256, 284, -14, 14, 180])
XA.move(2.4, 5.0, SA + Vector((-0.875, 0, 0.6)))
XB.move(2.4, 5.0, SA + Vector((0.875, 0, 0.6)))
pairs(XA, XB, [6], [6], 5.4)
big("Lbl A Dash", "Cl–Cl", SA + Vector((0, -0.6, -1.5)), 7.6, 12.8, mat=M["gold"], size=0.75)

# ---- XB. CH4: carbon in the middle, four hydrogens ----
XC = LRing("B C", "C", SB + Vector((0, 0, 0.6)), 4, 13.4, 27.8, r=1.2, angles=[90, 0, 270, 180])
for k, (dx, dz, a) in enumerate(((0, 1, 270), (1, 0, 180), (0, -1, 90), (-1, 0, 0))):
    far = SB + Vector((0, 0, 0.6)) + Vector((dx, 0, dz)) * 4.2
    Hk = LRing("B H%d" % k, "H", far, 1, 14.4 + 0.3 * k, 27.8, r=0.75, emat=E_GOLD, angles=[a])
    t = 16.6 + 1.6 * k
    Hk.move(t, t + 1.2, SB + Vector((0, 0, 0.6)) + Vector((dx, 0, dz)) * 1.75)
    pairs(Hk, XC, [0], [k], t + 1.3)
big("Lbl B Count", "8 ✓", SB + Vector((2.6, -0.6, 2.4)), 23.6, 27.8, mat=M["green"], size=0.6)

# ---- XC. O=O ----
XA = LRing("C OA", "O", SC + Vector((-3.4, 0, 0.6)), 6, 28.4, 40.8, r=RR, angles=[76, 104, 166, 194, 14, -14])
XB = LRing("C OB", "O", SC + Vector((3.4, 0, 0.6)), 6, 28.8, 40.8, r=RR, emat=E_GOLD, angles=[76, 104, -14, 14, 166, 194])
XA.move(30.6, 33.0, SC + Vector((-0.875, 0, 0.6)))
XB.move(30.6, 33.0, SC + Vector((0.875, 0, 0.6)))
pairs(XA, XB, [5, 4], [5, 4], 33.4)
big("Lbl C Dash", "O=O", SC + Vector((0, -0.6, -1.5)), 35.6, 40.8, mat=M["gold"], size=0.75)

# ---- D. O=C=O ----
OL = LRing("D OL", "O", SD + Vector((-4.6, 0, 0.6)), 6, 41.8, None, r=RR, emat=E_GOLD, angles=[76, 104, 166, 194, 14, -14])
Cc = LRing("D C", "C", SD + Vector((0, 0, 0.6)), 4, 41.4, None, r=RR, angles=[14, -14, 166, 194])
OR = LRing("D OR", "O", SD + Vector((4.6, 0, 0.6)), 6, 42.1, None, r=RR, emat=E_GOLD, angles=[76, 104, -14, 14, 166, 194])
OL.move(43.6, 45.4, SD + Vector((-1.75, 0, 0.6)))
pairs(OL, Cc, [5, 4], [3, 2], 45.6)
OR.move(46.4, 48.2, SD + Vector((1.75, 0, 0.6)))
pairs(Cc, OR, [1, 0], [5, 4], 48.4)
big("Lbl D Dash", "O=C=O", SD + Vector((0, -0.6, -1.5)), 50.0, None, mat=M["gold"], size=0.75)

# ---- E. N≡N ----
XA = LRing("E NA", "N", SE + Vector((-3.4, 0, 0.6)), 5, 54.4, None, r=RR, angles=[166, 194, 36, 0, -36])
XB = LRing("E NB", "N", SE + Vector((3.4, 0, 0.6)), 5, 54.8, None, r=RR, emat=E_GOLD, angles=[-14, 14, 144, 180, 216])
XA.move(56.4, 58.8, SE + Vector((-0.8, 0, 0.6)))
XB.move(56.4, 58.8, SE + Vector((0.8, 0, 0.6)))
pairs(XA, XB, [4, 3, 2], [4, 3, 2], 59.2, step=0.34)
big("Lbl E Dash", "N≡N", SE + Vector((0, -0.6, -1.5)), 61.4, None, mat=M["gold"], size=0.75)

# ---- F. the 1.7 rule: one marker slides along an electronegativity-difference ruler ----
X0, U = -5.0, 3.0           # ruler from difference 0 (x = -5) to 3.3, 3 units per 1.0
ruler = box("F Ruler", (3.3 * U, 0.3, 0.16), M["dim"], SF + Vector((X0 + 1.65 * U, 0.2, 0.2)))
appear(ruler, sec(66.4), dur=10)
cut = box("F Cut", (0.08, 0.3, 1.4), M["gold"], SF + Vector((X0 + 1.7 * U, 0.1, 0.2)))
appear(cut, sec(67.0), dur=10)
for nm, txt, x, col in (("Cov", "covalent", X0 + 0.85 * U, M["cyan"]), ("Ion", "ionic", X0 + 2.5 * U, M["red"])):
    big("Lbl F %s" % nm, txt, SF + Vector((x, -0.6, 1.4)), 67.6, None, mat=col, size=0.55)
big("Lbl F Cut", "1.7", SF + Vector((X0 + 1.7 * U, -0.6, -1.1)), 67.2, None, mat=M["gold"], size=0.5)
mk = sphere("F Marker", 0.28, M["gold"], SF + Vector((X0, -0.2, 0.2)), None, 24, 12)
appear(mk, sec(70.2), s=(0.28,) * 3)
for t, v0, v1 in ((73.6, 0.0, 0.9), (76.6, 0.9, 2.1)):
    move(mk, sec(t), sec(t + 1.4), SF + Vector((X0 + v0 * U, -0.2, 0.2)), SF + Vector((X0 + v1 * U, -0.2, 0.2)))

# ---- G. Activity 4.1: six cards drop into two bins ----
BIN_M = mat_pbr("Sort Bin", (0.05, 0.06, 0.09), roughness=0.7)
for nm, x in (("Cov", -3.6), ("Ion", 3.6)):
    bin_ = box("G Bin %s" % nm, (5.2, 0.12, 4.6), BIN_M, SG + Vector((x, 0.8, -0.2)))
    appear(bin_, sec(80.4), dur=10)
big("Lbl G Cov", "covalent", SG + Vector((-3.6, -0.6, 2.7)), 80.8, None, mat=M["cyan"], size=0.6)
big("Lbl G Ion", "ionic", SG + Vector((3.6, -0.6, 2.7)), 81.0, None, mat=M["red"], size=0.6)
slots = {"Cov": [(-5.0, 1.0), (-2.2, 1.0), (-5.0, -1.0), (-2.2, -1.0)], "Ion": [(3.6, 1.0), (3.6, -1.0)]}
used = {"Cov": 0, "Ion": 0}
for k, (txt, kind) in enumerate((("CO₂", "Cov"), ("NaCl", "Ion"), ("H₂O", "Cov"), ("C₆H₆", "Cov"), ("MgCl₂", "Ion"),
                                 ("HCl", "Cov"))):
    t = 82.0 + 1.5 * k
    x, z = slots[kind][used[kind]]
    used[kind] += 1
    c = big("Card %d" % k, txt, SG + Vector((0, -1.0, 3.6)), t, None, mat=M["white"], size=0.6)
    move(c, sec(t + 0.5), sec(t + 1.3), SG + Vector((0, -1.0, 3.6)), SG + Vector((x, -1.0, z - 0.2)))
finish_film()
