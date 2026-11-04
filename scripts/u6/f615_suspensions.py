# ---- Film 615: Suspensions (textbook pp.175-176: 6.6.3 suspension (turbidity), mud settles = sedimentation, decant,  (v4 captions)
# filter paper keeps the particles, chalk water, Fig 6.13; shake medicines; Table 6.2 + Fig 6.14 salt water / milk /
# flour water) ----
start_film("615", "615 Suspensions", 76.5)
END = scene.frame_end
SA, SB, SC, SD = (Vector((40 * k, 0, 0)) for k in range(4))

shot("Cam Mud", 0, 16, SA + Vector((0, 0, -1.1)), dist=14, pitch=0.1)
shot("Cam Filter", 16, 28, SB + Vector((0, 0, -1.0)), dist=14, pitch=0.1)
shot("Cam Medicine", 28, 38, SC + Vector((0, 0, -1.1)), dist=13, pitch=0.1)
shot("Cam Compare", 38, None, SD + Vector((0, 0, -1.0)), dist=15, pitch=0.1)
for name, t in (("Sedimentation", 0), ("Filtration", 16), ("Shake well", 28), ("Table 6.2", 38)):
    act(name, sec(t))

say('A1', 'Big particles: suspension', 0.1, 6)
say('A2', 'They settle: sedimentation', 6, 12)
say('A3', 'Pour off the clear top', 12, 16)
say('B1', 'The filter keeps them', 16, 28)
say('C1', 'Medicines: shake before use', 28, 38)
say('D1', 'Salt water, milk, flour water', 38, 44)
say('D2', 'Uniform? Only the solution', 44, 50)
say('D3', 'Settles? Only the suspension', 50, 56)
say('D4', 'Filters? Only the suspension', 56, 62)
say('D5', 'Beam lights up? The colloid', 62, 69)
say('D6', 'See particles? Only the suspension', 69, 76)

MUDDY = mat_emit("Muddy Water", (0.42, 0.28, 0.12), 0.5, alpha=0.6)
MUDP = mat_emit("Mud Particle", (0.5, 0.33, 0.16), 1.0)

# ---- A. mud settles ----
cA = SA + Vector((0, 0, -2.2))
beaker("A", cA, 1.8, 3.2, 2.6, 0.3)
murk = liquid("A Murk", 1.76, 2.6, cA + Vector((0, 0, 0.01)), MUDDY)
appear(murk, sec(1.0), dur=10)
kf(murk, "scale", sec(6.5), (1, 1, 1))
kf(murk, "scale", sec(11.5), (1, 1, 0.12))
lo, hi = inside(cA, 1.8, 2.6)
seats = grid_pts(6, 2, 0.4, cA + Vector((0, -0.2, 0.14)))
for k, s in enumerate(seats):
    life("A Mud %d" % k, lo.lerp(hi, 0.5), 0.0, [("box", lo, hi, 6.5 + 0.2 * k, 1.2), ("to", s, 9.0 + 0.2 * k)],
         r=0.15, mat=MUDP, seed=k + 1, f_in=sec(1.2))
big("Lbl A C", "clear", cA + Vector((2.2, -0.6, 2.0)), 12.0, None, mat=M["cyan"], size=0.45, align='LEFT')
big("Lbl A S", "sediment", cA + Vector((2.2, -0.6, 0.2)), 10.5, None, mat=MUDP, size=0.45, align='LEFT')

# ---- B. filter paper keeps the particles ----
cB = SB + Vector((0, 0, -2.4))
beaker("B", cB, 1.3, 2.4, 0.0, 16.2)
for o in (cyl("B Funnel", 0.15, 1.2, 1.3, GLASS, cB + Vector((0, 0, 3.3)), None, segs=32),
          cyl("B Paper", 0.12, 1.1, 1.15, mat_emit("Filter Paper", (0.95, 0.95, 0.9), 0.4, alpha=0.5),
              cB + Vector((0, 0, 3.36)), None, segs=32),
          cyl("B Stem", 0.12, 0.12, 0.9, GLASS, cB + Vector((0, 0, 2.3)), None, segs=16)):
    appear(o, sec(16.4), dur=10)
clr = liquid("B Clear", 1.26, 1.4, cB, WATER)
hide_until(clr, sec(18.0))
kf(clr, "scale", sec(18.0), (1, 1, 0.05))
kf(clr, "scale", sec(26.0), (1, 1, 1))
for j in range(12):
    t0 = 17.0 + 0.5 * j
    top = cB + Vector((-0.6 + 0.1 * j, -0.2, 4.6))
    stay = cB + Vector((-0.55 + 0.1 * j, -1.15, 3.7 + 0.15 * (j % 2)))
    life("B Mud %d" % j, top, t0, [("to", stay, t0 + 0.8)], r=0.13, mat=MUDP, seed=30 + j, f_in=sec(t0))
for j in range(8):
    d = sphere("B Drop %d" % j, 0.07, WATER, cB + Vector((0, -0.1, 1.85)), None, 10, 5)
    t0 = 18.5 + 0.9 * j
    hide_until(d, sec(t0))
    move(d, sec(t0), sec(t0 + 0.5), cB + Vector((0, -0.1, 1.85)), cB + Vector((0, -0.1, 0.9)), 'LINEAR')
    hide_from(d, sec(t0 + 0.5), (0.07,) * 3)
big("Lbl B P", "stays on the paper", cB + Vector((1.5, -0.6, 3.6)), 19.0, None, mat=MUDP, size=0.45, align='LEFT')
big("Lbl B C", "clear liquid", cB + Vector((1.6, -0.6, 0.7)), 22.0, None, mat=M["cyan"], size=0.45, align='LEFT')

# ---- C. shake the medicine bottle ----
cC = SC + Vector((0, 0, -2.2))
bot = empty("C Bottle", cC)
GLM = mat_emit("Medicine Glass", (0.75, 0.45, 0.2), 0.4, alpha=0.2)
cyl("C Body", 0.9, 0.9, 2.4, GLM, (0, 0, 1.2), bot, segs=40)
cyl("C Neck", 0.9, 0.35, 0.6, GLM, (0, 0, 2.7), bot, segs=40)
cyl("C Cap", 0.4, 0.4, 0.4, M["white"], (0, 0, 3.2), bot, segs=32)
liquid("C Liq", 0.86, 2.2, (0, 0, 0.01), mat_emit("Medicine Liquid", (0.95, 0.8, 0.85), 0.4, alpha=0.25), bot)
appear(bot, sec(28.2), dur=10)
lo, hi = Vector((-0.7, -0.3, 0.15)), Vector((0.7, 0.3, 2.1))
for k, s in enumerate(grid_pts(5, 2, 0.26, Vector((0, -0.1, 0.12)))):
    b = sphere("C Pow %d" % k, 0.11, MOL["white"], s, bot, 12, 6)
    appear(b, sec(28.6), s=(0.11,) * 3)
    rnd = random.Random(k)
    p2 = Vector((rnd.uniform(lo.x, hi.x), rnd.uniform(lo.y, hi.y), rnd.uniform(lo.z, hi.z)))
    move(b, sec(31.5), sec(33.0), s, p2)
kf(bot, "rotation_euler", sec(31.0), (0, 0, 0))
for k in range(8):
    kf(bot, "rotation_euler", sec(31.3 + 0.25 * k), (0, math.radians(18 if k % 2 else -18), 0))
kf(bot, "rotation_euler", sec(33.4), (0, 0, 0))
big("Lbl C 1", "settled", cC + Vector((1.4, -0.6, 0.2)), 29.4, 31.0, mat=M["white"], size=0.45, align='LEFT')
big("Lbl C 2", "shake well!", cC + Vector((1.6, -0.6, 2.4)), 31.2, None, mat=M["gold"], size=0.5, align='LEFT')

# ---- D. three glasses, six questions ----
FLOUR = mat_emit("Flour Water", (0.9, 0.88, 0.8), 0.5, alpha=0.4)
glasses = []
for k, (nm, lm, t0) in enumerate((("salt water", WATER, 38.2), ("milk", mat_emit("Milk Liquid", (0.95, 0.95, 0.92),
                                                                                    1.0, alpha=0.9), 38.6),
                                  ("flour water", FLOUR, 39.0))):
    c = SD + Vector((-4.2 + 4.2 * k, 0, -2.0))
    beaker("D %d" % k, c, 1.1, 2.6, 2.1, t0, liq_mat=lm)
    big("Lbl D N %d" % k, nm, c + Vector((0, -0.6, -0.5)), t0 + 0.3, None, mat=M["white"], size=0.42)
    glasses.append(c)
cS, cK, cU = glasses
lo, hi = inside(cS, 1.1, 2.1, depth=0.3)
gas("D Salt", 12, lo, hi, 38.0, END / FPS, speed=0.8, r=0.05, mat=MOL["white"], seed=41, f_in=sec(38.6))
lo, hi = inside(cU, 1.1, 2.1, depth=0.3)
seats = grid_pts(5, 2, 0.3, cU + Vector((0, -0.4, 0.12)))
for k, s in enumerate(seats):
    life("D Flour %d" % k, lo.lerp(hi, 0.5), 38.0, [("box", lo, hi, 51.0 + 0.15 * k, 0.9), ("to", s, 53.5 + 0.15 * k)],
         r=0.14, mat=mat_emit("Flour Lump", (0.95, 0.92, 0.82), 1.2), seed=50 + k, f_in=sec(39.4))
# the light beam (row 5)
zb = 1.3
hide_from(torch("D Torch", SD + Vector((-6.0, 0, -2.0 + zb)), 62.2), sec(69.0))
FAINT = mat_emit("Beam Faint", (1.0, 0.95, 0.7), 0.6, alpha=0.15)
beam("D Beam 0", SD + Vector((-5.9, 0, -2.0 + zb)), cU + Vector((1.1, 0, zb)), 62.8, 69.0, r=0.05, mat=FAINT)
beam("D Beam K", cK + Vector((-1.08, -0.6, zb)), cK + Vector((1.08, -0.6, zb)), 63.4, 69.0, r=0.12)
beam("D Beam U", cU + Vector((-1.08, -0.6, zb)), cU + Vector((0.1, -0.6, zb)), 64.0, 69.0, r=0.1)
rows = [(44.4, 50.0, (1, 0, 0)), (50.4, 56.0, (0, 0, 1)), (56.4, 62.0, (0, 0, 1)), (62.4, 69.0, (0, 1, 1)),
        (69.4, None, (0, 0, 1))]
for i, (t0, t1, marks) in enumerate(rows):
    for k, ok in enumerate(marks):
        big("Lbl D M %d %d" % (i, k), "✓" if ok else "✗", glasses[k] + Vector((0, -0.6, 3.1)), t0 + 0.4 * k, t1,
            mat=M["green"] if ok else M["red"], size=0.75)
finish_film()
