# ---- Film 616: Key points (textbook pp.177-178): one short station per bullet, each with its picture ----
D = 4.5
KP = [
    ("Solution", "A homogeneous mixture of two or more substances"),
    ("Aqueous solution", "A substance dissolved in water"),
    ("Solute", "The part present in the smaller amount"),
    ("Solvent", "The part present in the larger amount"),
    ("Saturated", "Can't dissolve any more solute at that temperature"),
    ("Unsaturated", "Can still dissolve more solute at that temperature"),
    ("Supersaturated", "More solute than needed to saturate it"),
    ("Nine types", "Solutions in gas, liquid and solid states"),
    ("Concentration", "Amount of solute in a given amount of solvent or solution"),
    ("Dilute", "A small amount of solute dissolved"),
    ("Concentrated", "A large amount of solute dissolved"),
    ("Percentage", "Parts of solute in 100 parts of solution"),
    ("Universal solvent", "Water dissolves most compounds: strong pull on solute particles"),
    ("Molarity", "Moles of solute per dm³ (litre) of solution"),
    ("Solubility", "Grams that saturate 100 g of solvent at a given temperature"),
    ("Immiscible", "Liquids that don't dissolve in each other"),
    ("Completely miscible", "Liquids that mix in any proportion"),
    ("Colloids", "Particles between solutions and suspensions: 1–1000 nm"),
    ("Tyndall effect", "Colloid particles scatter light in a clear medium"),
    ("Suspension", "Big undissolved particles you can see"),
    ("Sedimentation", "Particles settling at the bottom"),
]
n = len(KP)
start_film("616", "616 Key Points", D * n + 0.5)
END = scene.frame_end
ST = [Vector((40 * k, 0, 0)) for k in range(n)]
SHORT = ['Solution: an even mix', 'Aqueous: dissolved in water', 'Solute: the smaller amount', 'Solvent: the larger amount', 'Saturated: no more fits', 'Unsaturated: room for more', 'Supersaturated: more than it should', 'Nine types of solution', 'Concentration: how much solute', 'Dilute: a little solute', 'Concentrated: lots of solute', 'Percentage: parts in 100', 'Water: the universal solvent', 'Molarity: moles per dm³', 'Solubility: grams in 100 g', 'Immiscible: two layers', 'Miscible: mix in any amount', 'Colloid: 1–1000 nm particles', 'Tyndall: the beam lights up', 'Suspension: particles you see', 'Sedimentation: particles settle']
for k, (h, b) in enumerate(KP):
    t0 = D * k
    shot("Cam KP %d" % k, t0, t0 + D, ST[k] + Vector((0, 0, -1.1)), dist=14, pitch=0.1)
    act(h, sec(t0))
    say("K%d" % k, SHORT[k], t0 + 0.1, t0 + D)          # v4: one short line per key point


def tk(k, dt=0.3):
    return D * k + dt


def span(k):
    return tk(k, 0.0), D * (k + 1) + 0.2


def bk(k, c, n_solv=10, n_solu=0, heap=0, r=1.6, h_liq=2.2, liq_mat=None, solu_r=0.12, solu_mat=None):
    """A beaker at c with wandering solvent / solute particles and an optional undissolved heap."""
    c = Vector(c)
    a, b = span(k)
    beaker("K%d B %d" % (k, int(c.x * 10)), c, r, h_liq + 0.6, h_liq, tk(k), liq_mat=liq_mat)
    lo, hi = inside(c, r, h_liq)
    if n_solv:
        gas("K%d V %d" % (k, int(c.x * 10)), n_solv, lo, hi, a, b, speed=0.8, r=0.1, mat=SOLV, seed=k + 1,
            f_in=sec(tk(k, 0.4)))
    if n_solu:
        gas("K%d U %d" % (k, int(c.x * 10)), n_solu, lo, hi, a, b, speed=0.8, r=solu_r, mat=solu_mat or SOLU,
            seed=k + 50, f_in=sec(tk(k, 0.6)))
    for j, s in enumerate(grid_pts(heap, 2, 0.28, c + Vector((0, -0.2, 0.14))) if heap else []):
        o = sphere("K%d Heap %d %d" % (k, int(c.x * 10), j), 0.13, solu_mat or SOLU, s, None, 12, 6)
        appear(o, sec(tk(k, 0.6)), s=(0.13,) * 3)
    return c


def lbl(k, text, loc, dt=1.0, mat=None, size=0.5, align='CENTER'):
    big("Lbl K%d %s" % (k, text[:8]), text, loc, tk(k, dt), D * (k + 1), mat=mat or M["gold"], size=size, align=align)


Z = -2.2
# 1 solution
bk(0, ST[0] + Vector((0, 0, Z)), 12, 6)
# 2 aqueous
bk(1, ST[1] + Vector((-1.6, 0, Z)), 12, 5)
water("K1 Water", ST[1] + Vector((2.8, 0, -0.4)), tk(1, 0.8), scale=0.9)
lbl(1, "water", ST[1] + Vector((2.8, -0.6, 0.8)), mat=M["cyan"])
# 3 solute / 4 solvent
c = bk(2, ST[2] + Vector((0, 0, Z)), 14, 3, solu_r=0.18)
lbl(2, "solute: less", c + Vector((0, -0.6, 3.4)))
c = bk(3, ST[3] + Vector((0, 0, Z)), 14, 3, solu_r=0.18)
lbl(3, "solvent: more", c + Vector((0, -0.6, 3.4)), mat=M["cyan"])
# 5 saturated, 6 unsaturated, 7 supersaturated
c = bk(4, ST[4] + Vector((0, 0, Z)), 8, 10, heap=4)
lbl(4, "some stays", c + Vector((2.0, -0.6, 0.3)), align='LEFT')
c = bk(5, ST[5] + Vector((0, 0, Z)), 10, 3)
lbl(5, "room for more", c + Vector((0, -0.6, 3.4)), mat=M["cyan"])
c = bk(6, ST[6] + Vector((0, 0, Z)), 6, 18)
lbl(6, "extra!", c + Vector((0, -0.6, 3.4)))
# 8 nine types: 3 × 3 small tanks
for i, (med, mm) in enumerate((("gas", None), ("liquid", WATER), ("solid", mat_emit("Medium Solid", (0.95, 0.8, 0.4),
                                                                                         0.4, alpha=0.35)))):
    for j in range(3):
        cc = ST[7] + Vector((-2.4 + 2.4 * j, 0, -2.4 + 1.45 * (2 - i)))
        appear(box_edges("K7 Box %d %d" % (i, j), (1.6, 0.8, 1.15), cc + Vector((0, 0, 0.58))), sec(tk(7, 0.2 + 0.1 * (3 * i + j))),
               dur=6)
        if mm:
            appear(box("K7 Fill %d %d" % (i, j), (1.55, 0.75, 1.1), mm, cc + Vector((0, 0, 0.58))),
                   sec(tk(7, 0.3 + 0.1 * (3 * i + j))), dur=6)
        dm = (MOL["white"], MOL["air"], SOLU)[j]
        for q in range(3):
            o = sphere("K7 D %d %d %d" % (i, j, q), 0.12, dm, cc + Vector((-0.4 + 0.4 * q, -0.45, 0.65)), None, 12, 6)
            appear(o, sec(tk(7, 0.5 + 0.1 * (3 * i + j))), s=(0.12,) * 3)
# 9 concentration, 10 dilute, 11 concentrated
bk(8, ST[8] + Vector((-2.4, 0, Z)), 10, 3, r=1.4)
bk(8, ST[8] + Vector((2.4, 0, Z)), 10, 14, r=1.4)
c = bk(9, ST[9] + Vector((0, 0, Z)), 14, 3)
lbl(9, "dilute", c + Vector((0, -0.6, 3.4)), mat=M["cyan"])
c = bk(10, ST[10] + Vector((0, 0, Z)), 8, 18)
lbl(10, "concentrated", c + Vector((0, -0.6, 3.4)))
# 12 percentage: 100 little cubes, 10 of them gold
for i in range(10):
    for j in range(10):
        m = SOLU if (i < 10 and j == 0) else mat_emit("Cube Dim U6", (0.3, 0.45, 0.8), 0.5)
        o = box("K11 C %d %d" % (i, j), (0.34, 0.34, 0.34), m, ST[11] + Vector((-1.8 + 0.4 * i, 0, -2.4 + 0.4 * j)))
        appear(o, sec(tk(11, 0.2 + 0.02 * (i + j))), dur=4)
lbl(11, "10 in 100 = 10 %", ST[11] + Vector((2.6, -0.6, -2.3)), dt=1.6, align='LEFT')
# 13 universal solvent: a water molecule pulling ions
water("K12 Water", ST[12] + Vector((0, 0, -0.6)), tk(12, 0.3), scale=1.2)
for j, (m, p) in enumerate(((ION_P, (-3.0, 0, -1.6)), (ION_N, (3.0, 0, -1.6)), (ION_P, (-2.6, 0, 0.6)),
                            (ION_N, (2.6, 0, 0.6)))):
    o = sphere("K12 Ion %d" % j, 0.3, m, ST[12] + Vector(p) * 1.3, None, 20, 10)
    appear(o, sec(tk(12, 0.8 + 0.2 * j)), s=(0.3,) * 3)
    move(o, sec(tk(12, 1.8)), sec(tk(12, 3.2)), ST[12] + Vector(p) * 1.3, ST[12] + Vector(p) * 0.85)
# 14 molarity: a 1 dm³ cube holding one mole
cc = ST[13] + Vector((0, 0, -2.4))
appear(box_edges("K13 Cube", (2.8, 2.8, 2.8), cc + Vector((0, 0, 1.4))), sec(tk(13)), dur=6)
appear(box("K13 Fill", (2.75, 2.75, 2.75), mat_emit("Cube Fill U6", (0.15, 0.4, 0.9), 0.4, alpha=0.18),
           cc + Vector((0, 0, 1.4))), sec(tk(13, 0.2)), dur=6)
mo = sphere("K13 Mole", 0.4, SOLU, cc + Vector((0, -0.4, 1.4)), None, 24, 12)
appear(mo, sec(tk(13, 0.8)), s=(0.4,) * 3)
lbl(13, "1 mol in 1 dm³ = 1 M", cc + Vector((0, -0.6, 3.4)), dt=1.4)
# 15 solubility
c = bk(14, ST[14] + Vector((0, 0, Z)), 8, 10, heap=3)
lbl(14, "g per 100 g", c + Vector((0, -0.6, 3.4)))
# 16 immiscible, 17 miscible
BENZ = mat_emit("Benzene Liquid", (0.95, 0.85, 0.3), 0.5, alpha=0.2)
c = ST[15] + Vector((0, 0, Z))
beaker("K15", c, 1.6, 3.0, 0.0, tk(15))
appear(liquid("K15 W", 1.55, 1.2, c), sec(tk(15, 0.4)), dur=6)
appear(liquid("K15 O", 1.55, 1.2, c + Vector((0, 0, 1.2)), BENZ), sec(tk(15, 0.8)), dur=6)
lbl(15, "two layers", c + Vector((0, -0.6, 3.4)))
bk(16, ST[16] + Vector((0, 0, Z)), 10, 10, solu_mat=mat_emit("Mol Alcohol", (0.85, 0.5, 1.0), 1.4))
# 18 colloids
c = ST[17] + Vector((0, 0, -2.0))
appear(box_edges("K17 Box", (3.0, 1.2, 2.8), c + Vector((0, 0, 1.4))), sec(tk(17)), dur=6)
rnd = random.Random(17)
for j in range(10):
    o = sphere("K17 P %d" % j, 0.18, MILK, c + Vector((rnd.uniform(-1.1, 1.1), -0.2, rnd.uniform(0.3, 2.5))), None, 14, 7)
    appear(o, sec(tk(17, 0.4 + 0.05 * j)), s=(0.18,) * 3)
lbl(17, "1 – 1000 nm", c + Vector((0, -0.6, 3.3)))
# 19 Tyndall
c = ST[18] + Vector((1.2, 0, Z))
beaker("K18", c, 1.5, 3.0, 2.4, tk(18), liq_mat=mat_emit("Colloid Haze", (0.85, 0.85, 0.9), 0.3, alpha=0.22))
torch("K18 Torch", ST[18] + Vector((-4.4, 0, Z + 1.4)), tk(18, 0.3))
beam("K18 Beam A", ST[18] + Vector((-4.3, 0, Z + 1.4)), c + Vector((-1.5, 0, 1.4)), tk(18, 0.9), r=0.05,
     mat=mat_emit("Beam Faint", (1.0, 0.95, 0.7), 0.6, alpha=0.15))
beam("K18 Beam K", c + Vector((-1.48, 0, 1.4)), c + Vector((1.48, 0, 1.4)), tk(18, 1.4), r=0.15)
# 20 suspension, 21 sedimentation
MUDP = mat_emit("Mud Particle", (0.5, 0.33, 0.16), 1.0)
bk(19, ST[19] + Vector((0, 0, Z)), 6, 8, solu_r=0.26, solu_mat=MUDP)
c = bk(20, ST[20] + Vector((0, 0, Z)), 8, 0, heap=6, solu_mat=MUDP)
lbl(20, "sediment", c + Vector((2.0, -0.6, 0.3)), mat=MUDP, align='LEFT')
finish_film()
