# ---- Film 507: Vapour pressure (textbook pp.135-136: iii vapour pressure Fig 5.11, equilibrium, factors:  (v4 captions)
# a nature, b intermolecular forces, c size (pentane / decane), d temperature, Table 5.1) ----
start_film("507", "507 Vapour Pressure", 74.5)
END = scene.frame_end
SA, SB, SC, SD, SE = (Vector((40 * k, 0, 0)) for k in range(5))

shot("Cam Jar", 0, 22, SA + Vector((0.8, 0, -0.6)), dist=14, pitch=0.1)
shot("Cam Amount", 22, 34, SB + Vector((0, 0, -0.6)), dist=15, pitch=0.1)
shot("Cam Table", 34, 50, SC + Vector((0, 0, -0.2)), dist=16)
shot("Cam Size", 50, 62, SD + Vector((0, 0, -0.6)), dist=15, pitch=0.1)
shot("Cam Heat", 62, None, SE + Vector((0.8, 0, -0.6)), dist=15, pitch=0.1)
for name, t in (("Closed jar", 0), ("Amount", 22), ("Table 5.1", 34), ("Size", 50), ("Temperature", 62)):
    act(name, sec(t))

say('A1', 'Molecules escape in a closed jar', 0.1, 7)
say('A2', 'Some come back: condensation', 7, 13)
say('A3', 'Leaving = returning: equilibrium', 13, 18)
say('A4', 'The dial stops: vapour pressure', 18, 22)
say('B', "Amount doesn't matter", 22, 34)
say('C1', 'Each liquid is different', 34, 42)
say('C2', 'Strong forces: low pressure', 42, 50)
say('D', 'Small molecules escape easier', 50, 62)
say('E', 'Hotter: higher vapour pressure', 62, 74)

# ---- A. Fig 5.11: escape, return, equilibrium; a dial on the lid ----
closed_jar("A", SA + Vector((0, 0, -2.4)), 4.6, 1.4, 4.4, 1.4, 30, 0.0, 22.0,
           esc=[1.5 + 0.55 * k for k in range(24)], ret=[7.5 + 0.55 * k for k in range(18)], seed=3)
nd = gauge("A Gauge", SA + Vector((3.4, -0.1, 0.8)))
appear(nd.parent, sec(0.6), dur=10)
pcurve("A Gauge Pipe", [SA + Vector((2.3, 0, 1.6)), SA + Vector((3.4, 0, 1.6))], METAL, 0.05, "Models")
needle_keys(nd, [(0, 0.0), (1.5, 0.0), (8, 0.35), (13, 0.5), (22, 0.5)])
big("Lbl A V", "vapour", SA + Vector((-3.0, -0.6, 1.0)), 4.0, None, mat=M["cyan"], size=0.5, align='RIGHT')
big("Lbl A L", "liquid", SA + Vector((-3.0, -0.6, -1.8)), 1.0, None, size=0.5, align='RIGHT')

# ---- B. little or lots of liquid: the dials agree ----
for k, (x, hl) in enumerate(((-3.0, 0.6), (3.0, 1.8))):
    c = SB + Vector((x - 0.8, 0, -2.2))
    closed_jar("B%d" % k, c, 3.0, 1.2, 3.6, hl, 10 + int(16 * hl), 22.0, 34.0, vap0=9, esc=[23.0 + 1.1 * j for j in range(10)],
               ret=[23.5 + 1.1 * j for j in range(10)], seed=10 + k)
    g = gauge("B Gauge %d" % k, c + Vector((2.4, -0.1, 3.0)), r=0.6)
    appear(g.parent, sec(22.6), dur=10)
    needle_to(g, 0, 0.5)
big("Lbl B", "same dial reading", SB + Vector((0, -0.6, 2.6)), 25.0, None, mat=M["gold"], size=0.55)

# ---- C. Table 5.1 as bars (heights from the book; glycerol is too small to see) ----
rows = (("chloroform", "CHCl₃", 170), ("carbon tetrachloride", "CCl₄", 87), ("water", "H₂O", 18), ("glycerol", "C₃H₈O₃", 0.00016))
for k, (nm, f, v) in enumerate(rows):
    x = -4.2 + 2.8 * k
    h = max(0.04, 4.0 * v / 170)
    ebar("C Bar %d" % k, SC + Vector((x, 0, -1.3)), h, 34.6 + 0.8 * k, text=("%g" % v), mat=MOL["air"] if k != 2 else M["cyan"],
         lsize=0.48, w=1.2)
    lb = shadow(_text("C Name %d" % k, f, SC + Vector((x, -0.6, -1.85)), 0.42, M["white"], weight="semibold"))
    appear(lb, sec(34.8 + 0.8 * k))
big("Lbl C Unit", "mm Hg at 298 K", SC + Vector((2.6, -0.6, 2.4)), 35.0, None, mat=M["dim"], size=0.45)

# ---- D. pentane (5 C) vs decane (10 C): chains above, jars below ----
CARB = mat_emit("Chain C", (0.75, 0.78, 0.85), 1.2)
for k, (x, nC, esc_n, nm) in enumerate(((-3.2, 5, 14, "pentane"), (3.2, 10, 3, "decane"))):
    c = SD + Vector((x, 0, -2.2))
    closed_jar("D%d" % k, c, 3.4, 1.2, 3.0, 1.0, 20, 50.0, 62.0, esc=[51.0 + 9.5 * j / esc_n for j in range(esc_n)],
               seed=20 + k, r=0.15 if k == 0 else 0.15)
    for j in range(nC):
        p = c + Vector(((j - (nC - 1) / 2) * 0.32, -0.3, 3.7 + (0.12 if j % 2 else -0.12)))
        appear(sphere("D C %d %d" % (k, j), 0.13, CARB, p, None, 12, 6), sec(50.6 + 0.08 * j), s=(0.13,) * 3)
    big("Lbl D %d" % k, nm, c + Vector((0, -0.6, 4.4)), 51.0 + 0.4 * k, None, mat=(M["green"], M["dim"])[k], size=0.5)

# ---- E. heat the jar: more vapour, the dial climbs ----
closed_jar("E", SE + Vector((0, 0, -1.9)), 4.6, 1.4, 4.4, 1.4, 30, 62.0, 78.0, vap0=8,
           esc=[62.5 + 0.35 * k for k in range(30)], ret=[63.0 + 0.6 * k for k in range(14)], speed=1.6, vspeed=3.6, seed=31)
flame("E Flame", SE + Vector((0, 0, -2.75)), 63.0, None, s=0.8)
nd = gauge("E Gauge", SE + Vector((3.4, -0.1, 1.3)))
appear(nd.parent, sec(62.6), dur=10)
pcurve("E Gauge Pipe", [SE + Vector((2.3, 0, 2.1)), SE + Vector((3.4, 0, 2.1))], METAL, 0.05, "Models")
needle_keys(nd, [(0, 0.5), (63, 0.5), (73, 0.9)])
big("Lbl E", "vapour pressure up", SE + Vector((-2.6, -0.6, 1.2)), 66.0, None, mat=M["red"], size=0.48, align='RIGHT')
finish_film()
