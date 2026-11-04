# ---- Film 612: Liquid solutes and solvents, pressure (textbook pp.168-170: (iii) immiscible benzene + water Fig 6.8,  (v4 captions)
# miscible benzene + CCl₄, ethanol + water Fig 6.9 (hydrogen bonds), (iii) effect of pressure: soda bottle,
# Activity 6.2, Point to Ponder) ----
start_film("612", "612 Liquid Mixtures and Pressure", 87.5)
END = scene.frame_end
SA, SB, SC, SD, SE, SF = (Vector((40 * k, 0, 0)) for k in range(6))

shot("Cam Layers", 0, 26, SA + Vector((0, 0, -1.1)), dist=15, pitch=0.1)
shot("Cam Ethanol", 26, 42, SB + Vector((0, 0, -1.1)), dist=15, pitch=0.1)
shot("Cam Soda", 42, 58, SC + Vector((0, 0, -0.6)), dist=15, pitch=0.1)
shot("Cam Activity", 58, 74, SD + Vector((0, 0, -1.0)), dist=16, pitch=0.1)
shot("Cam Ponder", 74, None, SE + Vector((0, 0, -1.0)), dist=14, pitch=0.1)
for name, t in (("Immiscible", 0), ("Miscible", 14), ("Ethanol and water", 26), ("Pressure", 42),
                ("Activity 6.2", 58), ("Point to Ponder", 74)):
    act(name, sec(t))

say('A1', 'Two layers: immiscible', 0.1, 14)
say('A2', 'Mix in any amount: miscible', 14, 26)
say('B1', "Ethanol's –OH end is polar", 26, 34)
say('B2', 'Hydrogen bonds join them', 34, 42)
say('C1', 'More pressure: more gas dissolves', 42, 50)
say('C2', 'Open the soda: CO₂ escapes', 50, 58)
say('D1', 'Salt and vinegar dissolve', 58, 64)
say('D2', 'Iodine: spirit yes, water no', 64, 74)
say('E1', '500 + 500: less than a litre', 74, 82)
say('E2', 'Ions fit between water molecules', 82, 87)

BENZ = mat_emit("Benzene Liquid", (0.95, 0.85, 0.3), 0.5, alpha=0.2)
BENZ_M = mat_emit("Mol Benzene", (0.95, 0.85, 0.35), 1.2)
CCL4_M = mat_emit("Mol CCl4", (0.35, 1.0, 0.45), 1.2)
ALC_M = mat_emit("Mol Alcohol", (0.85, 0.5, 1.0), 1.4)

# ---- A. two layers; then one mixed phase ----
cA = SA + Vector((-3.2, 0, -2.2))
beaker("A L", cA, 1.8, 3.4, 0.0, 0.3)
appear(liquid("A Water", 1.75, 1.3, cA), sec(0.8), dur=10)
appear(liquid("A Benz", 1.75, 1.3, cA + Vector((0, 0, 1.3)), BENZ), sec(3.0), dur=10)
gas("A W", 12, cA + Vector((-1.4, -0.4, 0)), cA + Vector((1.4, 0.4, 1.3)), 0.0, 26.0, speed=0.8, r=0.13, mat=SOLV,
    seed=1, f_in=sec(1.0))
gas("A B", 10, cA + Vector((-1.4, -0.4, 1.3)), cA + Vector((1.4, 0.4, 2.6)), 0.0, 26.0, speed=0.8, r=0.15,
    mat=BENZ_M, seed=2, f_in=sec(3.2))
big("Lbl A B", "benzene", cA + Vector((0, -0.6, 4.0)), 3.4, None, mat=BENZ_M, size=0.5)
big("Lbl A W", "water", cA + Vector((2.2, -0.6, 0.6)), 1.4, 14.0, mat=M["cyan"], size=0.5, align='LEFT')
cB = SA + Vector((3.2, 0, -2.2))
beaker("A R", cB, 1.8, 3.4, 2.6, 14.3, liq_mat=mat_emit("Mixed Liquid", (0.6, 0.9, 0.4), 0.4, alpha=0.18))
lo, hi = inside(cB, 1.8, 2.6)
gas("A Bz2", 10, lo, hi, 14.0, 26.0, speed=0.8, r=0.15, mat=BENZ_M, seed=3, f_in=sec(14.6))
gas("A CCl", 10, lo, hi, 14.0, 26.0, speed=0.8, r=0.15, mat=CCL4_M, seed=4, f_in=sec(15.0))
big("Lbl A M", "benzene + CCl₄", cB + Vector((0, -0.6, 4.0)), 15.0, None, mat=CCL4_M, size=0.5)

# ---- B. ethanol + water, then one hydrogen bond close-up ----
cBx = SB + Vector((-3.4, 0, -2.2))
beaker("B", cBx, 1.7, 3.2, 2.4, 26.2)
lo, hi = inside(cBx, 1.7, 2.4)
gas("B W", 12, lo, hi, 26.0, 42.0, speed=0.8, r=0.13, mat=SOLV, seed=11, f_in=sec(26.6))
gas("B E", 10, lo, hi, 26.0, 42.0, speed=0.8, r=0.15, mat=ALC_M, seed=12, f_in=sec(27.4))
big("Lbl B", "ethanol + water", cBx + Vector((0, -0.6, 3.8)), 27.0, None, mat=ALC_M, size=0.5)
et, _ = bstick("B Ethanol", [("C", (-1.3, 0, 0)), ("C", (0, 0, 0.4)), ("O", (1.2, 0, 0)), ("H", (2.0, 0, 0.45)),
                             ("H", (-1.6, 0, -0.9)), ("H", (-2.0, 0, 0.6)), ("H", (-1.2, -0.8, 0.3)),
                             ("H", (0, 0, 1.4)), ("H", (0.2, -0.85, 0.2))],
               [(0, 1, 1), (1, 2, 1), (2, 3, 1), (0, 4, 1), (0, 5, 1), (0, 6, 1), (1, 7, 1), (1, 8, 1)],
               SB + Vector((1.6, 0, 0.2)), 34.0, scale=0.55)
wt = water("B Water", SB + Vector((4.6, 0, 0.0)), 34.6, scale=0.55, rot=(0, math.radians(-110), 0))
hb = []
a, b = SB + Vector((1.6 + 2.0 * 0.55, -0.1, 0.2 + 0.45 * 0.55)), SB + Vector((4.6, -0.1, 0.0))
for k in range(7):
    d = dot("B HBond %d" % k, 0.04, M["gold"], None, a.lerp(b, (k + 0.5) / 7))
    appear(d, sec(36.0 + 0.08 * k), s=(0.04,) * 3)
big("Lbl B H", "hydrogen bond", SB + Vector((3.2, -0.6, 1.3)), 36.4, None, mat=M["gold"], size=0.45)

# ---- C. soda bottle: closed (CO₂ dissolved), open (bubbles) ----
cC = SC + Vector((0, 0, -2.4))
GLB = mat_emit("Soda Glass", (0.4, 0.85, 0.55), 0.4, alpha=0.18)
bot = empty("C Bottle", cC)
cyl("C Body", 1.2, 1.2, 3.0, GLB, (0, 0, 1.5), bot, segs=40)
cyl("C Neck", 1.2, 0.45, 0.8, GLB, (0, 0, 3.4), bot, segs=40)
cyl("C Top", 0.45, 0.45, 0.5, GLB, (0, 0, 4.05), bot, segs=32)
cap_ = cyl("C Cap", 0.5, 0.5, 0.25, M["red"], cC + Vector((0, 0, 4.4)), None, segs=32)
appear(bot, sec(42.2), dur=10)
appear(cap_, sec(42.4), dur=10)
move(cap_, sec(50.2), sec(51.0), cC + Vector((0, 0, 4.4)), cC + Vector((1.6, 0, 5.2)))
hide_from(cap_, sec(51.2))
appear(liquid("C Soda", 1.15, 2.8, cC, mat_emit("Soda Brown", (0.45, 0.18, 0.06), 0.6, alpha=0.35)), sec(42.5), dur=10)
lo, hi = cC + Vector((-0.9, -0.4, 0.1)), cC + Vector((0.9, 0.4, 2.7))
gas("C CO2", 14, lo, hi, 42.0, 58.0, speed=0.9, r=0.11, mat=MOL["white"], seed=21, f_in=sec(43.0))
for k in range(16):
    x = -0.8 + 0.1 * k
    bb = sphere("C Bub %d" % k, 0.1, MOL["white"], cC + Vector((x, -0.5, 0.3)), None, 12, 6)
    t0 = 51.0 + 0.4 * k
    hide_until(bb, sec(t0))
    move(bb, sec(t0), sec(t0 + 1.6), cC + Vector((x, -0.5, 0.3)), cC + Vector((x * 0.4, -0.5, 4.8)), 'LINEAR')
    hide_from(bb, sec(t0 + 1.6))
for k in range(3):
    ar = arrow("C Push %d" % k, 0.7, M["white"], None, cC + Vector((-0.6 + 0.6 * k, -0.6, 5.4)), (0, math.pi / 2, 0),
               r=0.03, head=0.15)
    appear(ar, sec(44.0 + 0.2 * k), sec(50.2))
big("Lbl C P", "high pressure", cC + Vector((-1.4, -0.6, 4.9)), 44.2, 50.2, mat=M["white"], size=0.45, align='RIGHT')
big("Lbl C O", "fizz!", cC + Vector((1.6, -0.6, 4.0)), 51.4, None, mat=M["gold"], size=0.55, align='LEFT')

# ---- D. Activity 6.2: four test tubes ----
IOD = mat_emit("Mol Iodine", (0.55, 0.15, 0.6), 1.6)
for k, (solu_m, liq_m, ok, t0) in enumerate(((MOL["white"], WATER, True, 58.5), (MOL["red"], WATER, True, 60.5),
                                             (IOD, WATER, False, 64.2), (IOD, mat_emit("Spirit", (0.8, 0.6, 1.0), 0.4,
                                                                                         alpha=0.2), True, 66.4))):
    c = SD + Vector((-5.4 + 3.6 * k, 0, -2.3))
    beaker("D %d" % k, c, 0.75, 3.4, 2.6, t0, liq_mat=liq_m)
    lo, hi = inside(c, 0.75, 2.6, depth=0.25)
    seats = grid_pts(2, 2, 0.24, c + Vector((0, -0.1, 0.15)))
    if ok:
        dissolve("D Sol %d" % k, seats, lo, hi, t0 + 0.6, t0 + 1.8, 74.0, r=0.11, mat=solu_m, seed=30 + k,
                 f_in=sec(t0 + 0.6), drop=(0, 0, 3.0), t_land=t0 + 1.4)
    else:
        for j, s in enumerate(seats):
            b = sphere("D Stay %d" % j, 0.11, solu_m, s + Vector((0, 0, 3.0)), None, 12, 6)
            appear(b, sec(t0 + 0.6), s=(0.11,) * 3)
            move(b, sec(t0 + 0.7), sec(t0 + 1.4), s + Vector((0, 0, 3.0)), s, 'LINEAR')
    big("Lbl D %d" % k, "✓" if ok else "✗", c + Vector((0, -0.6, 3.9)), t0 + 2.4, None,
        mat=M["green"] if ok else M["red"], size=0.7)

# ---- E. Point to Ponder: big + small balls take less room than the two piles apart ----
cE = SE + Vector((0, 0, -2.4))
for k, (r_, m, x) in enumerate(((0.3, SOLV, -4.0), (0.12, ALC_M, -1.4))):
    g = box_edges("E Box %d" % k, (1.8, 0.9, 2.0), cE + Vector((x, 0, 1.0)))
    appear(g, sec(74.3 + 0.3 * k), dur=10)
    n = 3 if k == 0 else 7
    for i in range(n):
        for j in range(n):
            p = cE + Vector((x - 0.9 + (i + 0.5) * 1.8 / n, -0.1, (j + 0.5) * 2.0 / n))
            s = sphere("E P %d %d %d" % (k, i, j), r_, m, p, None, 12, 6)
            appear(s, sec(74.6 + 0.3 * k), s=(r_,) * 3)
mixg = box_edges("E Mix", (1.8, 0.9, 4.0), cE + Vector((2.6, 0, 2.0)))
appear(mixg, sec(76.5), dur=10)
for i in range(3):
    for j in range(3):
        p = cE + Vector((2.6 - 0.9 + (i + 0.5) * 0.6, -0.1, (j + 0.5) * 0.667))
        s = sphere("E MB %d %d" % (i, j), 0.3, SOLV, p, None, 12, 6)
        appear(s, sec(77.0), s=(0.3,) * 3)
for i in range(7):
    for j in range(7):
        p = cE + Vector((2.6 - 0.9 + (i + 0.5) * 1.8 / 7, -0.4, 0.1 + (j + 0.5) * 1.75 / 7))
        s = sphere("E MS %d %d" % (i, j), 0.12, ALC_M, p, None, 12, 6)
        appear(s, sec(77.6 + 0.01 * (i + j)), s=(0.12,) * 3)
lv = pcurve("E Level", [cE + Vector((1.5, -0.5, 4.0)), cE + Vector((3.7, -0.5, 4.0))], M["red"], 0.025, "Models")
hide_until(lv, sec(78.5))
big("Lbl E L", "expected", cE + Vector((4.0, -0.6, 4.0)), 78.6, None, mat=M["red"], size=0.42, align='LEFT')
big("Lbl E A", "less!", cE + Vector((4.0, -0.6, 2.0)), 79.5, None, mat=M["gold"], size=0.55, align='LEFT')
finish_film()
