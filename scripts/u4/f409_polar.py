# ---- Film 409: Polar and non-polar covalent bonds (textbook pp.106-108: Fig 4.14 H2/Cl2, Fig 4.15 HCl, 0.5 rule,  (v4 captions)
# Fig 4.16 H2O and NH3, Test Yourself table) ----
start_film("409", "409 Polar and Non-polar", 96.0)
END = scene.frame_end
SA, SB, SC, SD, SE = (Vector((40 * k, 0, 0)) for k in range(5))

shot("Cam Fair", 0, 16, SA + Vector((0, 0, -0.9)), dist=14)
shot("Cam HCl", 16, 34, SB + Vector((0, 0, -0.2)), dist=14)
shot("Cam Rule", 34, 52, SC + Vector((0, 0, -0.4)), dist=15)
shot("Cam Bent", 52, 70, SD + Vector((0, 0, -0.2)), dist=14)
shot("Cam Table", 70, None, SE + Vector((0, 0, -0.7)), dist=18)
for name, t in (("Fair sharing", 0), ("Unfair sharing", 16), ("The 0.5 rule", 34), ("Water and ammonia", 52),
                ("Test Yourself", 70)):
    act(name, sec(t))

say('A1', 'Same atoms pull equally', 0.1, 8)
say('A2', 'Fair sharing: non-polar', 8, 16)
say('B1', 'Chlorine pulls harder', 16, 24)
say('B2', 'The pair slides: δ+ and δ−', 24, 34)
say('C1', '0.5 or less: non-polar', 34, 41)
say('C2', 'More than 0.5: polar', 41, 46)
say('C3', 'More than 1.7: ionic', 46, 52)
say('D1', 'Water: oxygen pulls both pairs', 52, 61)
say('D2', 'Ammonia: nitrogen pulls three', 61, 70)
say('E1', 'Polar or non-polar?', 70, 84)
say('E2', 'Same atoms: non-polar', 84, None)

R = 1.1
# ---- A. H-H and Cl-Cl: the pair stays in the middle ----
HA = LRing("A HA", "H", SA + Vector((-3.4, 0, 1.4)), 1, 0.4, 15.8, r=0.8, angles=[0])
HB = LRing("A HB", "H", SA + Vector((3.4, 0, 1.4)), 1, 0.4, 15.8, r=0.8, emat=E_GOLD, angles=[180])
HA.move(1.6, 3.6, SA + Vector((-0.6, 0, 1.4)))
HB.move(1.6, 3.6, SA + Vector((0.6, 0, 1.4)))
pairs(HA, HB, [0], [0], 3.8)
CA = LRing("A CA", "Cl", SA + Vector((-0.875, 0, -1.2)), 7, 4.6, 15.8, r=R, angles=[76, 104, 256, 284, 166, 194, 0])
CB = LRing("A CB", "Cl", SA + Vector((0.875, 0, -1.2)), 7, 4.6, 15.8, r=R, emat=E_GOLD, angles=[76, 104, 256, 284, -14, 14, 180])
pairs(CA, CB, [6], [6], 5.6)
big("Lbl A Non", "non-polar", SA + Vector((3.6, -0.6, 0.1)), 8.4, 15.8, mat=M["cyan"], size=0.55)


def slide(ring, k, t0, w0, w1, dur=1.6):
    """Move ring electron k (already seated at world w0) on to world w1."""
    e = ring.es[k]
    for t, w in ((t0, w0), (t0 + dur, w1)):
        d = Vector(w) - ring.loc
        kf(e, "location", sec(t), Vector((d.x, d.z, 0.04)), 'BEZIER')


# ---- B. H-Cl: the pair slides toward chlorine ----
H = LRing("B H", "H", SB + Vector((-1.45, 0, 0.6)), 1, 16.4, None, r=0.95, angles=[0])
Cl = LRing("B Cl", "Cl", SB + Vector((0.6, 0, 0.6)), 7, 16.6, None, r=1.25, emat=E_GOLD)
mid = pairs(H, Cl, [0], [6], 18.0)
d = Vector((1, 0, 0))
for ring, k, s_ in ((H, 0, -1), (Cl, 6, 1)):
    w0 = mid + d * 0.13 * s_
    slide(ring, k, 24.6, w0, w0 + Vector((0.32, 0, 0)))
big("Lbl B Plus", "δ+", SB + Vector((-1.6, -0.6, 2.0)), 26.6, None, mat=M["red"], size=0.7)
big("Lbl B Minus", "δ−", SB + Vector((0.7, -0.6, 2.3)), 27.0, None, mat=M["cyan"], size=0.7)
big("Lbl B Bond", "H–Cl", SB + Vector((-0.4, -0.6, -1.6)), 28.4, None, mat=M["gold"], size=0.7)

# ---- C. the ruler: non-polar | polar | ionic ----
X0, U = -6.0, 3.6
ruler = box("C Ruler", (2.6 * U, 0.3, 0.16), M["dim"], SC + Vector((X0 + 1.3 * U, 0.2, 0.2)))
appear(ruler, sec(34.4), dur=10)
for k, v in enumerate((0.5, 1.7)):
    cut = box("C Cut %d" % k, (0.08, 0.3, 1.4), M["gold"], SC + Vector((X0 + v * U, 0.1, 0.2)))
    appear(cut, sec(34.8 + 0.3 * k), dur=10)
for k, (txt, v, col) in enumerate((("non-polar", 0.25, M["cyan"]), ("polar", 1.1, M["gold"]), ("ionic", 2.15, M["red"]))):
    big("Lbl C %d" % k, txt, SC + Vector((X0 + v * U, -0.6, 1.5)), 35.4 + 0.3 * k, None, mat=col, size=0.5)
mk = sphere("C Marker", 0.28, M["white"], SC + Vector((X0, -0.2, 0.2)), None, 24, 12)
appear(mk, sec(36.6), s=(0.28,) * 3)
for t, v0, v1 in ((38.6, 0.0, 0.4), (41.6, 0.4, 0.9), (46.6, 0.9, 2.1)):
    move(mk, sec(t), sec(t + 1.4), SC + Vector((X0 + v0 * U, -0.2, 0.2)), SC + Vector((X0 + v1 * U, -0.2, 0.2)))

# ---- D. water then ammonia, ball and stick ----
w, _ = bstick("D H2O", *SHAPES["H2O"][:2], SD + Vector((-3.4, 0, 0.6)), 52.4, None, scale=1.5, lone=SHAPES["H2O"][2])
a, _ = bstick("D NH3", *SHAPES["NH3"][:2], SD + Vector((3.4, 0, 0.4)), 61.0, None, scale=1.5, lone=SHAPES["NH3"][2])
a.rotation_euler = (math.radians(10), 0, math.radians(30))
big("Lbl D O", "δ−", SD + Vector((-4.6, -0.6, 1.4)), 54.6, None, mat=M["cyan"], size=0.6)
big("Lbl D H", "δ+", SD + Vector((-3.4, -0.6, -1.4)), 55.2, None, mat=M["red"], size=0.6)
big("Lbl D N", "δ−", SD + Vector((2.2, -0.6, 1.4)), 62.6, None, mat=M["cyan"], size=0.6)
turn(a, 63.6, 69.8, turns=0.25)

# ---- E. Test Yourself table: ten cards into two bins ----
BIN_M = mat_pbr("Sort Bin", (0.05, 0.06, 0.09), roughness=0.7)
for nm, x in (("Pol", -3.6), ("Non", 3.6)):
    appear(box("E Bin %s" % nm, (6.0, 0.12, 4.4), BIN_M, SE + Vector((x, 0.8, 0.2))), sec(70.4), dur=10)
big("Lbl E Pol", "polar", SE + Vector((-3.6, -0.6, 3.0)), 70.8, None, mat=M["gold"], size=0.6)
big("Lbl E Non", "non-polar", SE + Vector((3.6, -0.6, 3.0)), 71.0, None, mat=M["cyan"], size=0.6)
used = {"Pol": 0, "Non": 0}
for k, (txt, kind) in enumerate((("NH₃", "Pol"), ("H₂O", "Pol"), ("HCl", "Pol"), ("N₂", "Non"), ("O₂", "Non"),
                                 ("CH₄", "Non"), ("H₂", "Non"), ("PH₃", "Non"), ("SO₂", "Pol"), ("Cl₂", "Non"))):
    t = 72.0 + 1.3 * k
    n = used[kind]
    used[kind] += 1
    x = (-3.6 if kind == "Pol" else 3.6) + (n % 3 - 1) * 1.9
    z = 1.4 - 1.3 * (n // 3)
    top = SE + Vector((0, -1.0, 4.4))
    c = big("Card %d" % k, txt, top, t, None, mat=M["white"], size=0.55)
    move(c, sec(t + 0.4), sec(t + 1.1), top, SE + Vector((x, -1.0, z - 0.2)))
finish_film()
