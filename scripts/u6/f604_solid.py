# ---- Film 604: Solid solutions (textbook pp.157-158: 6.3.3 gas in solid, liquid in solid, solid in solid; Fig 6.4  (v4 captions)
# mercury amalgam; Fig 6.5 brass, sterling silver, bronze; Society, Technology and Science: solutions in daily life) ----
start_film("604", "604 Solid Solutions", 72.5)
END = scene.frame_end
SA, SB, SC, SD, SE = (Vector((40 * k, 0, 0)) for k in range(5))

shot("Cam Pd", 0, 11, SA + Vector((0, 0, -0.6)), dist=12, pitch=0.08)
shot("Cam Hg", 11, 22, SB + Vector((0, 0, -0.6)), dist=12, pitch=0.08)
shot("Cam Brass", 22, 33, SC + Vector((0, 0, -0.6)), dist=12, pitch=0.08)
shot("Cam Alloys", 33, 52, SD + Vector((0, 0, -0.8)), dist=14, pitch=0.1)
shot("Cam Daily", 52, None, SE + Vector((0, 0, -0.8)), dist=15, pitch=0.1)
for name, t in (("Gas in solid", 0), ("Liquid in solid", 11), ("Solid in solid", 22), ("Alloys", 33),
                ("Daily life", 52)):
    act(name, sec(t))

say('A1', 'Gas in solid: H₂ in palladium', 0.1, 11)
say('B1', 'Liquid in solid: amalgam', 11, 22)
say('C1', 'Solid in solid: brass', 22, 33)
say('D1', 'Brass: copper + zinc', 33, 40)
say('D2', 'Sterling silver: 92.5% silver', 40, 46)
say('D3', 'Bronze: copper + tin', 46, 52)
say('E1', 'Air: a gas solution', 52, 59)
say('E2', 'Drinks, vinegar, medicines', 59, 65)
say('E3', 'Gold mixed with copper', 65, 72)


def lattice(key, c, nx, nz, gap, mat, t0, r=0.3, skip=()):
    out = {}
    for i in range(nx):
        for j in range(nz):
            if (i, j) in skip:
                continue
            p = c + Vector(((i - (nx - 1) / 2) * gap, 0, (j - (nz - 1) / 2) * gap))
            s = sphere("%s %d %d" % (key, i, j), r, mat, p, None, 24, 12)
            appear(s, sec(t0 + 0.03 * (i + j)), s=(r,) * 3)
            out[(i, j)] = s
    return out


PD = mat_pbr("Palladium", (0.7, 0.72, 0.75), metallic=0.9, roughness=0.3)
AG = mat_pbr("Silver U6", (0.85, 0.86, 0.9), metallic=1.0, roughness=0.2)
CU = mat_pbr("Copper U6", (0.85, 0.45, 0.25), metallic=1.0, roughness=0.3)
ZN = mat_pbr("Zinc U6", (0.6, 0.65, 0.75), metallic=0.9, roughness=0.35)
HG = mat_emit("Mercury Liquid U6", (0.45, 0.75, 1.0), 1.3)
BRASS = mat_pbr("Brass U6", (0.85, 0.65, 0.25), metallic=1.0, roughness=0.3)
BRONZE = mat_pbr("Bronze U6", (0.65, 0.38, 0.2), metallic=1.0, roughness=0.35)

# ---- A. hydrogen slips into the gaps of palladium ----
cA = SA + Vector((0, 0, -0.3))
lattice("A Pd", cA, 6, 4, 0.8, PD, 0.3)
for k in range(8):
    i, j = k % 4, k // 4
    hole = cA + Vector(((i - 1.5) * 0.8, -0.1, (j - 0.5) * 0.8 + 0.0))
    start = cA + Vector(((i - 1.5) * 0.9, -0.1, 3.0 + 0.3 * j))
    h = sphere("A H %d" % k, 0.12, MOL["white"], start, None, 12, 6)
    t0 = 2.5 + 0.7 * k
    appear(h, sec(t0), s=(0.12,) * 3)
    move(h, sec(t0 + 0.2), sec(t0 + 1.6), start, hole)
big("Lbl A Pd", "palladium", cA + Vector((-2.8, -0.6, 0)), 1.0, None, mat=M["dim"], size=0.5, align='RIGHT')
big("Lbl A H", "hydrogen", cA + Vector((0, -0.6, 3.4)), 2.8, None, mat=M["white"], size=0.5)

# ---- B. mercury drops mix into silver ----
cB = SB + Vector((0, 0, -0.3))
skip = ((1, 1), (3, 2), (4, 0), (2, 3), (0, 2), (5, 1), (2, 0), (4, 3))
lattice("B Ag", cB, 6, 4, 0.75, AG, 11.3, r=0.33, skip=skip)
for k, (i, j) in enumerate(skip):
    p = cB + Vector(((i - 2.5) * 0.75, 0, (j - 1.5) * 0.75))
    start = cB + Vector(((i - 2.5) * 0.4, 0, 3.2))
    m = sphere("B Hg %d" % k, 0.33, HG, start, None, 24, 12)
    t0 = 13.0 + 0.6 * k
    appear(m, sec(t0), s=(0.33,) * 3)
    move(m, sec(t0 + 0.2), sec(t0 + 1.5), start, p)
big("Lbl B Ag", "silver", cB + Vector((-2.6, -0.6, 0)), 11.8, None, mat=M["dim"], size=0.5, align='RIGHT')
big("Lbl B Hg", "mercury", cB + Vector((0, -0.6, 3.6)), 13.2, None, mat=M["cyan"], size=0.5)

# ---- C. zinc atoms swap in for some copper atoms ----
cC = SC + Vector((0, 0, -0.3))
cu = lattice("C Cu", cC, 6, 4, 0.75, CU, 22.3, r=0.33)
for k, key in enumerate(((1, 2), (4, 1), (2, 0), (5, 3), (0, 0), (3, 3))):
    old = cu[key]
    t = 25.0 + 0.9 * k
    hide_from(old, sec(t), (0.33,) * 3)
    z = sphere("C Zn %d" % k, 0.36, ZN, old.location, None, 24, 12)
    appear(z, sec(t), s=(0.36,) * 3)
big("Lbl C Cu", "copper", cC + Vector((-2.6, -0.6, 0)), 22.8, None, mat=CU, size=0.5, align='RIGHT')
big("Lbl C Zn", "zinc", cC + Vector((0, -0.6, 2.0)), 25.2, None, mat=M["dim"], size=0.5)

# ---- D. Fig 6.5: brass rods, sterling silver ring, bronze medal ----
cD = SD + Vector((0, 0, -1.0))
rods = empty("D Rods", cD + Vector((-4.2, 0, 0)))
for k, (x, z) in enumerate(((-0.45, 0), (0.45, 0), (0, 0.75), (-0.9, 0.75), (0.9, 0.75))):
    cyl("D Rod %d" % k, 0.38, 0.38, 2.4, BRASS, (x, 0, z), rods, rot=(math.pi / 2, 0, math.radians(20)), segs=32)
appear(rods, sec(33.4), dur=12)
ring = empty("D Ring", cD + Vector((0, 0, 0.4)))
ring_curve("D Band", 0.85, AG, ring, 0.14, 96).rotation_euler = (math.pi / 2, 0, 0)
sphere("D Gem", 0.3, mat_emit("Gem White", (0.85, 0.95, 1.0), 2.5), (0, 0, 1.0), ring, 24, 12)
appear(ring, sec(40.2), dur=12)
turn(ring, 40.0, 52.0, 0.5)
medal = cyl("D Medal", 1.05, 1.05, 0.16, BRONZE, cD + Vector((4.2, 0, 0.4)), None, rot=(math.pi / 2, 0, 0), segs=48)
appear(medal, sec(46.2), dur=12)
big("Lbl D Br", "brass", cD + Vector((-4.2, -0.6, 2.0)), 34.0, None, mat=BRASS, size=0.55)
big("Lbl D Ag", "sterling silver", cD + Vector((0, -0.6, 2.4)), 40.6, None, mat=M["white"], size=0.55)
big("Lbl D Bz", "bronze", cD + Vector((4.2, -0.6, 2.0)), 46.6, None, mat=BRONZE, size=0.55)

# ---- E. a gas, a liquid and a solid solution from daily life ----
cE = SE + Vector((0, 0, -2.4))
appear(box_edges("E Air", (3.2, 1.2, 3.2), cE + Vector((-4.6, 0, 1.6))), sec(52.3), dur=10)
lo, hi = cE + Vector((-6.2, -0.5, 0)), cE + Vector((-3.0, 0.5, 3.2))
gas("E N2", 8, lo, hi, 52.0, 76.0, speed=2.2, r=0.13, mat=MOL["air"], seed=1, f_in=sec(52.6))
gas("E O2", 3, lo, hi, 52.0, 76.0, speed=2.2, r=0.13, mat=MOL["red"], seed=2, f_in=sec(53.0))
bottle = empty("E Bottle", cE)
cyl("E Glass", 1.0, 1.0, 2.6, mat_emit("Bottle Glass", (0.45, 0.85, 0.6), 0.4, alpha=0.3), (0, 0, 1.3), bottle)
cyl("E Neck", 0.4, 0.4, 0.8, mat_emit("Bottle Glass", (0.45, 0.85, 0.6), 0.4, alpha=0.3), (0, 0, 3.0), bottle)
cyl("E Cap", 0.44, 0.44, 0.25, M["red"], (0, 0, 3.5), bottle)
cyl("E Liquid", 0.95, 0.95, 1.9, mat_emit("Medicine Liquid", (0.9, 0.35, 0.2), 0.7, alpha=0.5), (0, 0, 0.0), bottle,
    base=True)
appear(bottle, sec(59.3), dur=12)
jew = empty("E Jewel", cE + Vector((4.6, 0, 1.4)))
ring_curve("E Gold Ring", 0.95, mat_pbr("Gold 22k", (1.0, 0.72, 0.3), metallic=1.0, roughness=0.15), jew, 0.16,
           96).rotation_euler = (math.pi / 2, 0, 0)
appear(jew, sec(65.3), dur=12)
turn(jew, 65.0, 76.0, 0.5)
big("Lbl E A", "air", cE + Vector((-4.6, -0.6, 3.8)), 52.8, None, mat=M["cyan"], size=0.5)
big("Lbl E L", "medicine", cE + Vector((0, -0.6, 4.2)), 59.8, None, mat=M["white"], size=0.5)
big("Lbl E S", "gold + copper", cE + Vector((4.6, -0.6, 3.2)), 65.8, None, mat=M["gold"], size=0.5)
finish_film()
