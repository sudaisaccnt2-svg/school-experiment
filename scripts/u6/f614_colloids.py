# ---- Film 614: Colloids (textbook pp.173-174: 6.6.1 solution, 6.6.2 colloids 1-1000 nm, Tyndall effect, pass filter  (v4 captions)
# paper and don't settle, Fig 6.12 fog / milk / paints, Table 6.1 classes, Example 6.6, Practice 6.2) ----
start_film("614", "614 Colloids", 90.0)
END = scene.frame_end
SA, SB, SC, SD, SE, SF = (Vector((40 * k, 0, 0)) for k in range(6))

shot("Cam Size", 0, 14, SA + Vector((0, 0, -0.9)), dist=14, pitch=0.1)
shot("Cam Tyndall", 14, 30, SB + Vector((0, 0, -1.1)), dist=15, pitch=0.1)
shot("Cam Filter", 30, 42, SC + Vector((0, 0, -1.0)), dist=14, pitch=0.1)
shot("Cam Daily", 42, 54, SD + Vector((0, 0, -1.1)), dist=15, pitch=0.1)
shot("Cam Classes", 54, 74, SE + Vector((0, 0, -0.9)), dist=14, pitch=0.1)
shot("Cam Example", 74, None, SF + Vector((0, 0, -1.1)), dist=15, pitch=0.1)
for name, t in (("Particle size", 0), ("Tyndall effect", 14), ("Filter paper", 30), ("Daily life", 42),
                ("Table 6.1", 54), ("Example 6.6", 74)):
    act(name, sec(t))

say('A1', 'Solution: particles too tiny', 0.1, 5)
say('A2', 'Colloid: a bit bigger', 5, 10)
say('A3', 'Suspension: you can see them', 10, 14)
say('B1', 'Salt solution: beam unseen', 14, 22)
say('B2', 'Colloid: beam lights up', 22, 30)
say('C1', 'Passes the filter, never settles', 30, 42)
say('D1', 'Fog, milk, paints', 42, 54)
say('E1', 'In liquid: sol, emulsion, foam', 54, 61)
say('E2', 'In gas: aerosols', 61, 67)
say('E3', 'In solid: gel, cheese', 67, 74)
say('F1', 'Water dissolves in NH₃', 74, 79)
say('F2', 'C₆H₁₂ in benzene · AgCl in NH₃', 79, 84)
say('F3', 'CH₃OH is polar', 84, 90)

# ---- A. three sizes ----
for k, (nm, r, n, m, t0) in enumerate((("solution", 0.06, 9, SOLU, 0.5), ("colloid", 0.18, 5, MILK, 5.3),
                                       ("suspension", 0.5, 1, MUD, 10.3))):
    c = SA + Vector((-4.2 + 4.2 * k, 0, -1.6))
    appear(box_edges("A Box %d" % k, (2.6, 1.2, 2.6), c + Vector((0, 0, 1.3))), sec(t0), dur=10)
    rnd = random.Random(k)
    for j in range(n * n if k == 0 else n):
        p = c + Vector((rnd.uniform(-0.9, 0.9), -0.2, rnd.uniform(0.3, 2.3))) if k < 2 else c + Vector((0, -0.2, 1.0))
        s = sphere("A P %d %d" % (k, j), r, m, p, None, 16, 8)
        appear(s, sec(t0 + 0.4 + 0.02 * j), s=(r,) * 3)
    big("Lbl A %d" % k, nm, c + Vector((0, -0.6, 3.1)), t0 + 0.3, None, mat=M["white"], size=0.45)
big("Lbl A nm", "1 – 1000 nm", SA + Vector((0, -0.6, -2.2)), 6.0, None, mat=M["gold"], size=0.42)

# ---- B. Tyndall: torch → solution → colloid ----
cS, cK = SB + Vector((-1.4, 0, -2.2)), SB + Vector((3.2, 0, -2.2))
beaker("B S", cS, 1.4, 3.0, 2.4, 14.2)
beaker("B K", cK, 1.4, 3.0, 2.4, 14.4, liq_mat=mat_emit("Colloid Haze", (0.85, 0.85, 0.9), 0.3, alpha=0.22))
rnd = random.Random(7)
for j in range(40):
    p = cK + Vector((rnd.uniform(-1.1, 1.1), rnd.uniform(-0.4, 0.4), rnd.uniform(0.2, 2.2)))
    s = sphere("B Dot %d" % j, 0.05, MILK, p, None, 10, 5)
    appear(s, sec(14.8 + 0.01 * j), s=(0.05,) * 3)
zb = 1.4
torch("B Torch", SB + Vector((-5.6, 0, -2.2 + zb)), 15.0)
FAINT = mat_emit("Beam Faint", (1.0, 0.95, 0.7), 0.6, alpha=0.15)
beam("B Beam 1", SB + Vector((-5.5, 0, -2.2 + zb)), cS + Vector((-1.4, 0, zb)), 16.0, r=0.05, mat=FAINT)
beam("B Beam 2", cS + Vector((1.4, 0, zb)), cK + Vector((-1.4, 0, zb)), 16.2, r=0.05, mat=FAINT)
beam("B Beam K", cK + Vector((-1.38, 0, zb)), cK + Vector((1.38, 0, zb)), 22.4, r=0.16)
for j in range(10):
    p = cK + Vector((-1.1 + 0.24 * j, -0.05, zb + (0.15 if j % 2 else -0.15)))
    sp = sphere("B Spark %d" % j, 0.06, mat_emit("Spark U6", (1.0, 0.95, 0.7), 6.0), p, None, 10, 5)
    appear(sp, sec(23.0 + 0.1 * j), s=(0.06,) * 3)
big("Lbl B S", "solution", cS + Vector((0, -0.6, 3.4)), 15.0, None, mat=M["cyan"], size=0.45)
big("Lbl B K", "colloid", cK + Vector((0, -0.6, 3.4)), 15.2, None, mat=M["white"], size=0.45)
big("Lbl B T", "Tyndall effect", cK + Vector((0, -0.6, 4.1)), 24.0, None, mat=M["gold"], size=0.5)

# ---- C. through the filter paper; nothing settles ----
cC = SC + Vector((0, 0, -2.4))
beaker("C", cC, 1.3, 2.4, 0.0, 30.2)
fun = cyl("C Funnel", 0.15, 1.2, 1.3, GLASS, cC + Vector((0, 0, 3.3)), None, segs=32)
paper = cyl("C Paper", 0.12, 1.1, 1.15, mat_emit("Filter Paper", (0.95, 0.95, 0.9), 0.4, alpha=0.5),
            cC + Vector((0, 0, 3.36)), None, segs=32)
stem = cyl("C Stem", 0.12, 0.12, 0.9, GLASS, cC + Vector((0, 0, 2.3)), None, segs=16)
for o in (fun, paper, stem):
    appear(o, sec(30.4), dur=10)
lqC = liquid("C Liq", 1.26, 1.6, cC, mat_emit("Colloid Haze 2", (0.85, 0.85, 0.9), 0.3, alpha=0.22))
hide_until(lqC, sec(31.5))
kf(lqC, "scale", sec(31.5), (1, 1, 0.05))
kf(lqC, "scale", sec(37.0), (1, 1, 1))
lo, hi = inside(cC, 1.3, 1.6)
for j in range(14):
    t0 = 31.0 + 0.4 * j
    top = cC + Vector((-0.5 + 0.08 * j, -0.2, 3.9))
    s = life("C P %d" % j, top, t0, [("to", cC + Vector((0, -0.2, 2.6)), t0 + 0.8), ("to", cC + Vector((0, -0.2, 1.4)),
                                                                                         t0 + 1.2),
                                     ("box", lo, hi, 42.0, 0.7)], r=0.1, mat=MILK, seed=60 + j, f_in=sec(t0))
big("Lbl C 1", "passes through", cC + Vector((1.6, -0.6, 3.3)), 32.0, None, mat=M["white"], size=0.45, align='LEFT')
big("Lbl C 2", "doesn't settle", cC + Vector((1.6, -0.6, 0.8)), 38.0, None, mat=M["gold"], size=0.45, align='LEFT')

# ---- D. fog, milk, paints ----
cD = SD + Vector((0, 0, -2.2))
rnd = random.Random(3)
for j in range(4):
    post = cyl("D Post %d" % j, 0.1, 0.1, 2.6, DARK, cD + Vector((-5.6 + 0.7 * j, 0.6, 1.3)), None, segs=12)
    appear(post, sec(42.3), dur=10)
for j in range(36):
    p = cD + Vector((rnd.uniform(-6.4, -3.0), rnd.uniform(-0.6, 0.2), rnd.uniform(0.3, 2.8)))
    s = sphere("D Fog %d" % j, 0.16, mat_emit("Fog U6", (0.9, 0.92, 1.0), 0.5, alpha=0.4), p, None, 10, 5)
    appear(s, sec(43.0 + 0.02 * j), s=(0.16,) * 3)
beaker("D Milk", cD, 1.0, 2.4, 2.0, 45.5, liq_mat=mat_emit("Milk Liquid", (0.95, 0.95, 0.92), 1.0, alpha=0.9))
for j, col in enumerate(((1.0, 0.3, 0.3), (0.3, 0.6, 1.0), (0.4, 1.0, 0.4))):
    c = cD + Vector((3.4 + 1.25 * j, 0, 0))
    tin = cyl("D Tin %d" % j, 0.55, 0.55, 1.2, METAL, c + Vector((0, 0, 0.6)), None, segs=32)
    top = cyl("D Paint %d" % j, 0.5, 0.5, 0.05, mat_emit("Paint %d U6" % j, col, 1.5), c + Vector((0, -0.0, 1.22)),
              None, segs=32)
    appear(tin, sec(48.0 + 0.3 * j), dur=10)
    appear(top, sec(48.2 + 0.3 * j), dur=10)
big("Lbl D F", "fog", cD + Vector((-4.7, -0.6, 3.3)), 43.5, None, mat=M["white"], size=0.5)
big("Lbl D M", "milk", cD + Vector((0, -0.6, 3.0)), 46.0, None, mat=M["white"], size=0.5)
big("Lbl D P", "paints", cD + Vector((4.65, -0.6, 2.1)), 49.0, None, mat=M["white"], size=0.5)

# ---- E. Table 6.1: tanks of a medium with something dispersed in it ----
LIQ_MED = mat_emit("Medium Liquid", (0.15, 0.4, 0.9), 0.4, alpha=0.25)
SOL_MED = mat_emit("Medium Solid", (0.95, 0.8, 0.4), 0.4, alpha=0.35)
DOT_S = mat_emit("Disp Solid", (0.6, 0.4, 0.25), 1.2)
DOT_L = mat_emit("Disp Liquid", (0.95, 0.95, 0.92), 1.4)
DOT_G = mat_emit("Disp Gas", (0.9, 0.95, 1.0), 0.8, alpha=0.5)
groups = [
    (54.3, 61.0, LIQ_MED, [("sol", DOT_S, "cube"), ("emulsion", DOT_L, "ball"), ("foam", DOT_G, "big")]),
    (61.3, 67.0, None, [("smoke", DOT_S, "cube"), ("fog", DOT_L, "ball")]),
    (67.3, None, SOL_MED, [("gel", DOT_L, "ball"), ("cheese", DOT_L, "ball")]),
]
for g_i, (t0, t1, med, items) in enumerate(groups):
    n = len(items)
    for k, (nm, dm, kind) in enumerate(items):
        c = SE + Vector((-4.0 * (n - 1) / 2 + 4.0 * k, 0, -2.0))
        t = t0 + 1.0 * k
        edges = box_edges("E Box %d %d" % (g_i, k), (2.6, 1.2, 2.6), c + Vector((0, 0, 1.3)))
        appear(edges, sec(t), t1 and sec(t1), dur=10)
        if med is not None:
            fill = box("E Fill %d %d" % (g_i, k), (2.55, 1.15, 2.55), med, c + Vector((0, 0, 1.3)))
            appear(fill, sec(t + 0.2), t1 and sec(t1), dur=10)
        rnd = random.Random(10 * g_i + k)
        for j in range(12 if kind != "big" else 6):
            p = c + Vector((rnd.uniform(-1.0, 1.0), -0.4, rnd.uniform(0.3, 2.3)))
            if kind == "cube":
                o = box("E D %d %d %d" % (g_i, k, j), (0.2, 0.2, 0.2), dm, p)
            else:
                rr = 0.32 if kind == "big" else 0.13
                o = sphere("E D %d %d %d" % (g_i, k, j), rr, dm, p, None, 12, 6)
            sc = (1, 1, 1) if kind == "cube" else (rr,) * 3
            appear(o, sec(t + 0.4 + 0.03 * j), t1 and sec(t1), s=sc)
        big("Lbl E %d %d" % (g_i, k), nm, c + Vector((0, -0.6, 3.1)), t + 0.3, t1, mat=M["white"], size=0.45)

# ---- F. Example 6.6 + Practice 6.2: cards drop into the right beaker ----
cP, cN = SF + Vector((-3.0, 0, -2.2)), SF + Vector((3.0, 0, -2.2))
beaker("F P", cP, 1.5, 2.2, 1.6, 74.2)
beaker("F N", cN, 1.5, 2.2, 1.6, 74.4, liq_mat=mat_emit("Benzene Liquid", (0.95, 0.85, 0.3), 0.5, alpha=0.2))
big("Lbl F P", "NH₃  polar", cP + Vector((0, -0.6, -0.55)), 74.6, None, mat=M["cyan"], size=0.45)
big("Lbl F N", "C₆H₆  non-polar", cN + Vector((0, -0.6, -0.55)), 74.8, None, mat=M["gold"], size=0.45)
cards("F Card", [("H₂O", "p"), ("C₆H₁₂", "n"), ("AgCl", "p"), ("CH₃OH", "p")], SF + Vector((0, -0.6, 1.9)),
      {"p": cP.x, "n": cN.x}, 76.0, gap=3.0, size=0.5, dz=0.55, z0=cP.z + 4.0)
finish_film()
