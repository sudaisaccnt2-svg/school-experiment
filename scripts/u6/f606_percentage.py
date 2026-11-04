# ---- Film 606: Percentage composition (textbook pp.159-161: 6.4.1, (i) mass by mass, (ii) mass by volume,  (v4 captions)
# (iii) volume by mass, (iv) volume by volume, each with the book's 10 % example) ----
start_film("606", "606 Percentage", 82.5)
END = scene.frame_end
SA, SB, SC, SD, SE = (Vector((40 * k, 0, 0)) for k in range(5))

shot("Cam Hundred", 0, 12, SA + Vector((0, 0, -0.9)), dist=13.5, pitch=0.08)
shot("Cam MM", 12, 30, SB + Vector((0, 0, -1.0)), dist=14, pitch=0.1)
shot("Cam MV", 30, 46, SC + Vector((0, 0, -1.0)), dist=14, pitch=0.1)
shot("Cam VM", 46, 64, SD + Vector((0, 0, -1.0)), dist=14, pitch=0.1)
shot("Cam VV", 64, None, SE + Vector((0, 0, -1.0)), dist=14, pitch=0.1)
for name, t in (("Parts in 100", 0), ("Mass by mass", 12), ("Mass by volume", 30), ("Volume by mass", 46),
                ("Volume by volume", 64)):
    act(name, sec(t))

say('A1', '10 out of 100 = 10%', 0.1, 12)
say('B1', '10 g sugar + 90 g water', 12, 20)
say('B2', '10 g in 100 g: 10% m/m', 20, 30)
say('C1', '10 g salt to 100 cm³', 30, 39)
say('C2', '10% NaCl (m/v)', 39, 46)
say('D1', '10 cm³ alcohol to 100 g', 46, 55)
say('D2', '10% (v/m)', 55, 64)
say('E1', '10 cm³ alcohol to 100 cm³', 64, 72)
say('E2', '10% alcohol (v/v)', 72, 82)

# ---- A. 100 little cubes, 10 of them gold ----
cA = SA + Vector((0, 0, -0.2))
for i in range(10):
    for j in range(10):
        k = j * 10 + i
        gold = k < 10
        b = box("A Cube %d" % k, (0.32, 0.32, 0.32), SOLU if gold else SOLV,
                cA + Vector(((i - 4.5) * 0.4, 0, (4.5 - j) * 0.4)))
        appear(b, sec((3.0 + 0.15 * k) if gold else (0.3 + 0.012 * k)), s=(1, 1, 1))
big("Lbl A 100", "100 parts", cA + Vector((-2.6, -0.6, 0)), 1.5, None, mat=M["cyan"], size=0.5, align='RIGHT')
big("Lbl A 10", "10 parts = 10%", cA + Vector((2.6, -0.6, 1.8)), 4.8, None, mat=M["gold"], size=0.5, align='LEFT')

# ---- B. on a balance: 10 g sugar + 90 g water = 100 g ----
cB = SB + Vector((0, 0, -2.4))
scale_bal("B", cB, 12.2, "0 g", t1=14.5)
kB, _ = beaker("B", cB + Vector((0, 0, 0.56)), 1.1, 2.0, 0.0, 12.4)
w = liquid("B Water", 1.06, 1.3, cB + Vector((0, 0, 0.56)))
appear(w, sec(14.5), dur=12)
pile = [cB + Vector(((k % 3 - 1) * 0.28, -0.2, 0.75 + 0.28 * (k // 3))) for k in range(6)]
lo, hi = inside(cB + Vector((0, 0, 0.56)), 1.1, 1.3, depth=0.3)
dissolve("B Sugar", pile, lo, hi, 17.0, 18.5, 30.0, r=0.14, seed=3, f_in=sec(16.8), drop=(0, 0, 2.8), t_land=17.8)
for nm, txt, t0, t1 in (("B R1", "90 g", 14.6, 17.5), ("B R2", "100 g", 17.6, None)):
    big("Lbl " + nm, txt, cB + Vector((0, -0.95, 0.27)), t0, t1, mat=M["green"], size=0.42)
big("Lbl B S", "10 g sugar", cB + Vector((2.0, -0.6, 3.6)), 16.8, None, mat=M["gold"], size=0.5, align='LEFT')
big("Lbl B P", "10 g ÷ 100 g × 100 = 10%", cB + Vector((0, -0.6, 4.0)), 23.0, None, mat=M["white"], size=0.5)

# ---- C. 10 g salt, water to the 100 cm³ mark ----
cC = SC + Vector((0, 0, -2.4))
g, lq = cylinder_glass("C", cC, 0.9, 4.0, 3.2, 30.2, ticks=4)
hide_until(lq, sec(33.0))
kf(lq, "scale", sec(33.0), (1, 1, 0.05))
kf(lq, "scale", sec(37.0), (1, 1, 1))
pcurve("C Mark", [(-0.9, -0.03, 3.2), (0.9, -0.03, 3.2)], M["white"], 0.02, "Models", parent=g)
lo, hi = inside(cC, 0.9, 3.2, depth=0.3)
dissolve("C Salt", grid_pts(3, 2, 0.26, cC + Vector((0, -0.2, 0.15))), lo, hi, 31.0, 34.0, 46.0, r=0.13,
         mat=MOL["white"], seed=5, f_in=sec(31.0), drop=(0, 0, 4.0), t_land=31.9)
big("Lbl C S", "10 g salt", cC + Vector((-1.4, -0.6, 0.6)), 31.4, None, mat=M["white"], size=0.5, align='RIGHT')
big("Lbl C V", "100 cm³", cC + Vector((1.4, -0.6, 3.2)), 37.2, None, mat=M["cyan"], size=0.5, align='LEFT')
big("Lbl C P", "10 g in 100 cm³ = 10%", cC + Vector((0, -0.6, 4.3)), 39.5, None, mat=M["white"], size=0.5)

# ---- D. 10 cm³ alcohol into a beaker on a balance; water until 100 g ----
ALC = mat_emit("Alcohol Liquid", (0.75, 0.45, 1.0), 0.8, alpha=0.4)
cD = SD + Vector((0, 0, -2.4))
scale_bal("D", cD, 46.2, "0 g", t1=54.5)
beaker("D", cD + Vector((0, 0, 0.56)), 1.1, 2.4, 0.0, 46.4)
a = liquid("D Alc", 1.06, 0.3, cD + Vector((0, 0, 0.56)), ALC)
appear(a, sec(48.0), dur=12)
wd = liquid("D Water", 1.06, 1.5, cD + Vector((0, 0, 0.86)))
hide_until(wd, sec(50.5))
kf(wd, "scale", sec(50.5), (1, 1, 0.05))
kf(wd, "scale", sec(54.5), (1, 1, 1))
for nm, txt, t0, t1 in (("D R1", "100 g", 54.6, None),):
    big("Lbl " + nm, txt, cD + Vector((0, -0.95, 0.27)), t0, t1, mat=M["green"], size=0.42)
big("Lbl D A", "10 cm³ alcohol", cD + Vector((-1.6, -0.6, 1.0)), 48.2, None, mat=ALC, size=0.5, align='RIGHT')
big("Lbl D P", "10 cm³ in 100 g = 10%", cD + Vector((0, -0.6, 3.8)), 56.0, None, mat=M["white"], size=0.5)

# ---- E. 10 cm³ alcohol + water to 100 cm³ ----
cE = SE + Vector((0, 0, -2.4))
g, _ = cylinder_glass("E", cE, 0.9, 4.0, 0.0, 64.2, ticks=9)
ea = liquid("E Alc", 0.87, 0.32, cE, ALC)
appear(ea, sec(65.5), dur=12)
ew = liquid("E Water", 0.87, 2.88, cE + Vector((0, 0, 0.32)))
hide_until(ew, sec(68.0))
kf(ew, "scale", sec(68.0), (1, 1, 0.03))
kf(ew, "scale", sec(71.5), (1, 1, 1))
big("Lbl E A", "10 cm³ alcohol", cE + Vector((-1.4, -0.6, 0.2)), 65.8, None, mat=ALC, size=0.5, align='RIGHT')
big("Lbl E V", "100 cm³", cE + Vector((1.4, -0.6, 3.2)), 71.6, None, mat=M["cyan"], size=0.5, align='LEFT')
big("Lbl E P", "10 cm³ in 100 cm³ = 10%", cE + Vector((0, -0.6, 4.3)), 73.0, None, mat=M["white"], size=0.5)
finish_film()
