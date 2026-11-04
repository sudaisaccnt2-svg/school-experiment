# ---- Film 601: Solution, aqueous solution, solute and solvent (textbook pp.152-154: introduction, 6.1 (i) solution,  (v4 captions)
# binary solution, Test Yourself, (ii) aqueous solution, universal solvent, (iii) solute and solvent, Fig 6.1) ----
start_film("601", "601 Solutions", 81.5)
END = scene.frame_end
SA, SB, SC, SD, SE = (Vector((40 * k, 0, 0)) for k in range(5))

shot("Cam Mix", 0, 20, SA + Vector((0, 0, -1.2)), dist=13.5, pitch=0.1)
shot("Cam Water", 20, 36, SB + Vector((0, 0, -1.1)), dist=15, pitch=0.1)
shot("Cam Amounts", 36, 50, SC + Vector((0, 0, -1.2)), dist=13.5, pitch=0.1)
shot("Cam Drink", 50, 64, SD + Vector((0, 0, -1.2)), dist=13.5, pitch=0.1)
shot("Cam Test", 64, None, SE + Vector((0, 0, -1.2)), dist=14, pitch=0.1)
for name, t in (("Solution", 0), ("Aqueous", 20), ("Solute and solvent", 36), ("Soft drink", 50), ("Test Yourself", 64)):
    act(name, sec(t))

say('A1', 'A solution: an even mix', 0.1, 8)
say('A2', 'Solute spreads through the solvent', 8, 15)
say('A3', 'Two parts: binary solution', 15, 20)
say('B1', 'Water solvent: aqueous solution', 20, 28)
say('B2', 'Water: the universal solvent', 28, 36)
say('C1', 'Solute less · solvent more', 36, 43)
say('C2', 'Sugar solute · water solvent', 43, 50)
say('D1', 'A soft drink: water solvent', 50, 57)
say('D2', 'Sugar, CO₂, flavours: solutes', 57, 64)
say('E1', 'Pure or solution? Boil dry', 64, 72)
say('E2', 'Solution leaves a crust', 72, 81)

# ---- A. a crystal drops into water and spreads out ----
cA = SA + Vector((0, 0, -2.2))
beaker("A", cA, 2.0, 3.2, 2.4, 0.3)
lo, hi = inside(cA, 2.0, 2.4)
gas("A Solv", 26, lo, hi, 0.0, 20.0, speed=0.8, r=0.13, mat=SOLV, seed=2, f_in=sec(0.6))
seats = grid_pts(3, 3, 0.32, cA + Vector((0, -0.2, 0.5)), ny=2)
dissolve("A Salt", seats, lo, hi, 8.0, 10.0, 20.0, r=0.15, speed=0.7, seed=3, f_in=sec(8.0), drop=(0, 0, 3.6),
         t_land=9.0)
big("Lbl A Solv", "solvent", cA + Vector((-3.4, -0.6, 1.4)), 2.0, None, mat=M["cyan"], size=0.5, align='RIGHT')
big("Lbl A Solu", "solute", cA + Vector((0, -0.6, 3.7)), 8.0, 10.5, mat=M["gold"], size=0.5)
big("Lbl A Sol", "solution", cA + Vector((0, -0.6, 3.8)), 13.5, None, mat=M["white"], size=0.6)

# ---- B. three aqueous solutions ----
cols = (("salt", MOL["white"]), ("sugar", SOLU), ("copper sulphate", mat_emit("Mol CuSO4", (0.15, 0.55, 1.0), 2.0)))
for k, (nm, m) in enumerate(cols):
    c = SB + Vector((-4.2 + 4.2 * k, 0, -2.2))
    beaker("B %d" % k, c, 1.5, 2.8, 2.0, 20.3 + 0.3 * k)
    lo, hi = inside(c, 1.5, 2.0)
    gas("B Solv %d" % k, 12, lo, hi, 20.0, 36.0, speed=0.8, r=0.11, mat=SOLV, seed=10 + k, f_in=sec(20.6 + 0.3 * k))
    dissolve("B Solu %d" % k, grid_pts(2, 2, 0.28, c + Vector((0, -0.2, 0.3)), ny=2), lo, hi, 21.5 + 1.2 * k,
             23.0 + 1.2 * k, 36.0, r=0.13, mat=m, seed=20 + k, f_in=sec(21.5 + 1.2 * k), drop=(0, 0, 3.2),
             t_land=22.4 + 1.2 * k)
big("Lbl B W", "water + …", SB + Vector((0, -0.6, 1.7)), 21.0, None, mat=M["cyan"], size=0.55)

# ---- C. solute (few) vs solvent (many): sugar solution ----
cC = SC + Vector((0, 0, -2.2))
beaker("C", cC, 2.0, 3.2, 2.4, 36.2)
lo, hi = inside(cC, 2.0, 2.4)
gas("C Solv", 30, lo, hi, 36.0, 50.0, speed=0.8, r=0.13, mat=SOLV, seed=31, f_in=sec(36.5))
gas("C Solu", 6, lo, hi, 36.0, 50.0, speed=0.8, r=0.16, mat=SOLU, seed=32, f_in=sec(38.5))
big("Lbl C Few", "solute: few (sugar)", cC + Vector((-2.4, -0.6, 3.7)), 38.6, None, mat=M["gold"], size=0.48)
big("Lbl C Many", "solvent: many (water)", cC + Vector((2.4, -0.6, 3.7)), 40.0, None, mat=M["cyan"], size=0.48)

# ---- D. a soft drink: water + sugar + CO₂ + flavour ----
cD = SD + Vector((0, 0, -2.3))
beaker("D", cD, 1.6, 3.6, 3.0, 50.2, liq_mat=mat_emit("Soda Brown", (0.45, 0.18, 0.06), 0.6, alpha=0.35))
lo, hi = inside(cD, 1.6, 3.0)
gas("D Solv", 18, lo, hi, 50.0, 64.0, speed=0.8, r=0.12, mat=SOLV, seed=41, f_in=sec(50.6))
gas("D Sugar", 5, lo, hi, 50.0, 64.0, speed=0.8, r=0.15, mat=SOLU, seed=42, f_in=sec(57.2))
gas("D Flav", 4, lo, hi, 50.0, 64.0, speed=0.8, r=0.15, mat=MOL["red"], seed=43, f_in=sec(58.6))
for k in range(10):
    x = -1.0 + 0.22 * k
    b = sphere("D Bubble %d" % k, 0.1, MOL["white"], cD + Vector((x, -0.5, 0.2)), None, 12, 6)
    t0 = 57.8 + 0.55 * k
    hide_until(b, sec(t0))
    move(b, sec(t0), sec(t0 + 2.0), cD + Vector((x, -0.5, 0.2)), cD + Vector((x, -0.5, 3.0)), 'LINEAR')
    hide_from(b, sec(t0 + 2.0))
big("Lbl D W", "water", cD + Vector((-2.6, -0.6, 2.0)), 51.0, None, mat=M["cyan"], size=0.5, align='RIGHT')
big("Lbl D S", "sugar · CO₂ · flavour", cD + Vector((0, -0.6, 4.4)), 57.5, None, mat=M["gold"], size=0.5)

# ---- E. boil dry: pure water vs a solution ----
for k, (nm, crust) in enumerate((("pure water", False), ("salt water", True))):
    c = SE + Vector((-3.2 + 6.4 * k, 0, -2.0))
    g, lq = beaker("E %d" % k, c, 1.6, 2.4, 1.6, 64.2 + 0.3 * k)
    flame("E Flame %d" % k, c + Vector((0, 0, -0.95)), 66.0, None, s=0.8)
    kf(lq, "scale", sec(66.5), (1, 1, 1))
    kf(lq, "scale", sec(73.0), (1, 1, 0.001))
    hide_from(lq, sec(73.2), (1, 1, 0.001))
    for j in range(8):
        x = -1.0 + 0.28 * j
        st = sphere("E Steam %d %d" % (k, j), 0.12, MOL["white"], c + Vector((x, -0.4, 1.6)), None, 12, 6)
        t0 = 66.8 + 0.7 * j
        hide_until(st, sec(t0))
        move(st, sec(t0), sec(t0 + 2.2), c + Vector((x, -0.4, 1.4 - 0.15 * j)), c + Vector((x, -0.4, 3.6)), 'LINEAR')
        hide_from(st, sec(t0 + 2.2))
    if crust:
        for j in range(12):
            cr = box("E Crust %d" % j, (0.2, 0.2, 0.14), MOL["white"],
                     c + Vector((-1.1 + 0.2 * j, -0.2 + 0.1 * (j % 3), 0.08)))
            cr.rotation_euler = (0, 0, 0.4 * j)
            appear(cr, sec(73.0 + 0.1 * j), s=(1, 1, 1))
    big("Lbl E %d" % k, nm, c + Vector((0, -0.6, 3.1)), 64.6 + 0.3 * k, None, mat=M["cyan"] if k == 0 else M["white"],
        size=0.5)
big("Lbl E R", "salt left behind", SE + Vector((3.2, -0.6, -0.9)), 74.0, None, mat=M["gold"], size=0.45)
finish_film()
