# ---- Film 605: Concentration of solution (textbook pp.158-159: 6.4, (i) dilute, (ii) concentrated, Fig 6.6 dilution,  (v4 captions)
# 5 g vs 8 g sugar in 100 cm³, standard solution, two units: percentage and molarity) ----
start_film("605", "605 Concentration", 70.5)
END = scene.frame_end
SA, SB, SC, SD = (Vector((40 * k, 0, 0)) for k in range(4))

shot("Cam Compare", 0, 14, SA + Vector((0, 0, -1.1)), dist=14, pitch=0.1)
shot("Cam Add", 14, 30, SB + Vector((0, 0, -1.5)), dist=17, pitch=0.1)
shot("Cam Sugar", 30, 46, SC + Vector((0, 0, -1.1)), dist=14, pitch=0.1)
shot("Cam Standard", 46, None, SD + Vector((0, 0, -0.6)), dist=15, pitch=0.1)
for name, t in (("Dilute and concentrated", 0), ("Add solvent", 14), ("5 g vs 8 g", 30), ("Standard solution", 46)):
    act(name, sec(t))

say('A1', 'More solute: more concentrated', 0.1, 7)
say('A2', 'Few: dilute · many: concentrated', 7, 14)
say('B1', 'Add more solvent', 14, 23)
say('B2', 'Spread out: more dilute', 23, 30)
say('C1', '5 g and 8 g sugar', 30, 38)
say('C2', '8 g is more concentrated', 38, 46)
say('D1', 'Known exactly: standard solution', 46, 55)
say('D2', 'Percentage or molarity', 55, 70)

# ---- A. same beaker size: few vs many solute particles ----
for k, (n, nm) in enumerate(((4, "dilute"), (16, "concentrated"))):
    c = SA + Vector((-3.0 + 6.0 * k, 0, -2.2))
    beaker("A %d" % k, c, 1.8, 3.0, 2.3, 0.3 + 0.3 * k)
    lo, hi = inside(c, 1.8, 2.3)
    gas("A Solv %d" % k, 18, lo, hi, 0.0, 14.0, speed=0.8, r=0.12, mat=SOLV, seed=1 + k, f_in=sec(0.6 + 0.3 * k))
    gas("A Solu %d" % k, n, lo, hi, 0.0, 14.0, speed=0.8, r=0.16, mat=SOLU, seed=5 + k, f_in=sec(7.2 + 0.3 * k))
    big("Lbl A %d" % k, nm, c + Vector((0, -0.6, 3.6)), 7.6 + 0.4 * k, None, mat=(M["cyan"], M["gold"])[k], size=0.55)

# ---- B. pour in more water: the liquid rises, the gold particles spread ----
cB = SB + Vector((0, 0, -2.4))
g, lq = beaker("B", cB, 1.9, 4.0, 1.4, 14.2)
hz = zpath([(16.0, 1.4), (22.0, 3.6)])
kf(lq, "scale", sec(16.0), (1, 1, 1))
kf(lq, "scale", sec(22.0), (1, 1, 3.6 / 1.4))
lo = cB + Vector((-1.9 * 0.82, -0.45, 0.02))
hi = lambda t: cB + Vector((1.9 * 0.82, 0.45, hz(t)))
gas("B Solu", 12, lo, hi, 14.0, 30.0, speed=0.8, r=0.16, mat=SOLU, seed=11, f_in=sec(14.6))
gas("B Solv", 10, lo, lambda t: cB + Vector((1.9 * 0.82, 0.45, 1.4)), 14.0, 30.0, speed=0.8, r=0.12, mat=SOLV,
    seed=12, f_in=sec(14.6))
gas("B Solv2", 14, cB + Vector((-1.55, -0.45, 1.4)), hi, 16.0, 30.0, speed=0.8, r=0.12, mat=SOLV, seed=13,
    f_in=sec(16.5))
stream = cyl("B Stream", 0.12, 0.12, 1.2, WATER, cB + Vector((0.8, 0, 3.9)), None, base=True)
hide_until(stream, sec(16.0))
hide_from(stream, sec(22.0))
big("Lbl B", "add solvent", cB + Vector((1.3, -0.6, 4.6)), 15.5, 23.0, mat=M["cyan"], size=0.5, align="LEFT")
big("Lbl B2", "more dilute", cB + Vector((0, -0.6, 4.8)), 23.5, None, mat=M["white"], size=0.55)

# ---- C. 5 g vs 8 g of sugar ----
for k, (n, nm) in enumerate(((5, "5 g"), (8, "8 g"))):
    c = SC + Vector((-3.0 + 6.0 * k, 0, -2.2))
    beaker("C %d" % k, c, 1.8, 3.0, 2.3, 30.3 + 0.3 * k)
    lo, hi = inside(c, 1.8, 2.3)
    gas("C Solv %d" % k, 16, lo, hi, 30.0, 46.0, speed=0.8, r=0.12, mat=SOLV, seed=21 + k, f_in=sec(30.6))
    seats = [c + Vector(((j % 4 - 1.5) * 0.36, -0.2, 3.9 + 0.36 * (j // 4))) for j in range(n)]
    for j, s in enumerate(seats):
        tk = 31.5 + 2.2 * k + 0.12 * j
        life("C Sugar %d %d" % (k, j), s, 31.0, [("to", s, tk), ("to", c + Vector((s.x - c.x, -0.2, 1.8)), tk + 0.8),
                                                   ("box", lo, hi, 46.0, 0.8)], r=0.16, mat=SOLU, seed=30 + 10 * k + j,
             f_in=sec(31.0 + 2.2 * k))
    big("Lbl C %d" % k, nm, c + Vector((0, -0.6, 3.4)), 31.2 + 2.2 * k, None, mat=M["gold"], size=0.6)
big("Lbl C W", "100 cm³ water each", SC + Vector((0, -0.6, 1.6)), 32.0, 37.5, mat=M["cyan"], size=0.42)

# ---- D. a standard solution: a flask with an exact label; then % and M ----
cD = SD + Vector((0, 0, -2.4))
flask("D", cD, R=1.4, neck=2.0, t_in=46.2, fill=BLUE_SOL)
big("Lbl D", "known exactly", cD + Vector((1.2, -0.6, 4.0)), 47.5, 55.0, mat=M["white"], size=0.5, align='LEFT')
big("Lbl D P", "%", cD + Vector((-3.6, -0.6, 1.6)), 56.0, None, mat=M["gold"], size=1.4)
big("Lbl D M", "M", cD + Vector((3.6, -0.6, 1.6)), 57.0, None, mat=M["gold"], size=1.4)
finish_film()
