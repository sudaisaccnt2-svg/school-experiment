# ---- Film 509: More properties of liquids (textbook pp.139-140: vi diffusion Fig 5.14 ink, vii mobility,  (v4 captions)
# viii density, Table 5.3, Activity 5.3 bromine) ----
start_film("509", "509 Liquid Properties", 74.5)
END = scene.frame_end
SA, SB, SC, SD, SE = (Vector((40 * k, 0, 0)) for k in range(5))

shot("Cam Ink", 0, 22, SA + Vector((0, 0, -0.5)), dist=13.5, pitch=0.08)
shot("Cam Flow", 22, 34, SB + Vector((0, 0, -0.1)), dist=16)
shot("Cam Table", 34, 54, SC + Vector((0, 0, -0.2)), dist=16.5)
shot("Cam Float", 54, 64, SD + Vector((0, 0, -0.5)), dist=13, pitch=0.08)
shot("Cam Bromine", 64, None, SE + Vector((0, 0, -0.5)), dist=13, pitch=0.08)
for name, t in (("Ink in water", 0), ("Mobility", 22), ("Table 5.3", 34), ("Oil on water", 54), ("Activity 5.3", 64)):
    act(name, sec(t))

say('A1', 'A drop of ink in water', 0.1, 7)
say('A2', 'The ink starts spreading', 7, 14)
say('A3', 'Evenly spread, but slower', 14, 22)
say('B', 'Warmer liquids flow easier', 22, 34)
say('C1', 'Liquids are much denser', 34, 42)
say('C2', 'Water 1.00 is heaviest here', 42, 54)
say('D', 'Oil floats on water', 54, 64)
say('E', 'Bromine vapour fills the jar', 64, 74)

# ---- A. Fig 5.14: ink spreads slowly through water ----
cA = SA + Vector((0, 0, -2.3))
dish("A Glass", cA, 4.0, 1.4, 3.6, 3.2, 40, 0.0, 22.0, speed=0.7, r=0.13, seed=2, f_in=sec(0.3))
INK = mat_emit("Mol Ink", (0.45, 0.2, 1.0), 1.6)
sp = zpath([(0, 0.0), (3, 0.0), (20, 1.0)])
gas("A Ink", 14, lambda t: cA + Vector((-0.5 - 1.5 * sp(t), -0.3, 2.2 - 2.2 * sp(t))),
    lambda t: cA + Vector((0.5 + 1.5 * sp(t), 0.3, 3.2)), 0.0, 22.0, speed=0.8, r=0.13, mat=INK, seed=3, f_in=sec(1.0))
for k in range(3):
    d = sphere("A Drop %d" % k, 0.13, INK, cA + Vector((0, -0.1, 5.0)), None, 12, 6)
    hide_until(d, sec(0.6 + 0.3 * k))
    move(d, sec(0.6 + 0.3 * k), sec(1.2 + 0.3 * k), cA + Vector((0, -0.1, 5.0)), cA + Vector((0, -0.1, 3.0)), 'LINEAR')
    hide_from(d, sec(1.25 + 0.3 * k))
big("Lbl A Ink", "ink", cA + Vector((2.6, -0.6, 3.4)), 1.0, None, mat=INK, size=0.5, align='LEFT')

# ---- B. cold liquid drips, warm liquid runs ----
import random as _r
for k, (x, gap, dur, nm, mat) in enumerate(((-3.0, 0.7, 2.4, "cold", M["cyan"]), (3.0, 0.18, 1.2, "warm", M["red"]))):
    top = SB + Vector((x, 0, 1.2))
    appear(box_edges("B Tank %d" % k, (2.4, 1.2, 1.4), top + Vector((0, 0, 0.7))), sec(22.2), dur=10)
    appear(box("B Tank Water %d" % k, (2.3, 1.1, 1.1), WATER, top + Vector((0, 0, 0.6))), sec(22.3), dur=10)
    appear(box_edges("B Cup %d" % k, (2.4, 1.2, 1.6), SB + Vector((x, 0, -1.3))), sec(22.2), dur=10)
    rr = _r.Random(k)
    t, j = 23.0, 0
    while t < 34.0:
        a = top + Vector((rr.uniform(-0.1, 0.1), 0, 0))
        b = SB + Vector((x + rr.uniform(-0.3, 0.3), 0, -1.95))
        m = sphere("B Drop %d %d" % (k, j), 0.12, MOL["air"], a, None, 12, 6)
        hide_until(m, sec(t))
        move(m, sec(t), sec(t + dur), a, b, 'LINEAR')
        t += gap
        j += 1
    big("Lbl B %d" % k, nm, top + Vector((0.5, -0.6, -1.2)), 22.6 + 0.3 * k, None, mat=mat, size=0.55, align='LEFT')

# ---- C. Table 5.3 as bars (height = density) ----
rows = (("acetone", 0.792), ("ethyl alcohol", 0.791), ("methyl alcohol", 0.810), ("olive oil", 0.918),
        ("castor oil", 0.969), ("linseed oil", 0.942), ("water", 1.00))
OIL = mat_emit("Mol Oil", (1.0, 0.75, 0.2), 1.4)
for k, (nm, v) in enumerate(rows):
    x = -5.4 + 1.8 * k
    ebar("C Bar %d" % k, SC + Vector((x, 0, -1.6)), 3.6 * v, 42.4 + 0.6 * k, text="%.3f" % v if v < 1 else "1.00",
         mat=MOL["air"] if nm == "water" else OIL if "oil" in nm else MOL["purple"], lsize=0.4, w=1.1)
    t = shadow(_text("C Name %d" % k, nm, SC + Vector((x, -0.6, -2.05)), 0.3, M["white"], weight="semibold"))
    appear(t, sec(42.6 + 0.6 * k))
# first: one gas box vs one liquid box (C1)
for k, (x, n, liq) in enumerate(((-2.4, 4, False), (2.4, 26, True))):
    c = SC + Vector((x, 0, -0.4))
    bx = box_edges("C Cmp %d" % k, (3.0, 1.2, 3.0), c)
    appear(bx, sec(34.3 + 0.3 * k), dur=10)
    kf(bx, "scale", sec(41.6), (1, 1, 1))
    kf(bx, "scale", sec(42.0), (0, 0, 0), 'CONSTANT')
    ms = gas("C Cmp Mol %d" % k, n, c - Vector((1.5, 0.6, 1.5)),
             c + Vector((1.5, 0.6, -1.5 + (1.8 if liq else 3.0))), 34.0, 42.0, speed=0.8 if liq else 2.4, r=0.15,
             seed=40 + k, f_in=sec(34.8 + 0.3 * k))
    for m in ms:
        hide_from(m, sec(42.0))
    big("Lbl C Cmp %d" % k, ("liquid" if liq else "gas"), c + Vector((0, -0.6, 2.0)), 35.0 + 0.3 * k, 41.8,
        mat=M["cyan"] if liq else M["dim"], size=0.5)

# ---- D. oil floats on water ----
cD = SD + Vector((0, 0, -2.2))
appear(box_edges("D Jar", (3.6, 1.4, 4.0), cD + Vector((0, 0, 2.0)), top=False), sec(54.2), dur=10)
appear(box("D Water", (3.5, 1.3, 2.0), WATER, cD + Vector((0, 0, 1.0))), sec(54.3), dur=10)
appear(box("D Oil", (3.5, 1.3, 1.0), mat_emit("Oil Body", (1.0, 0.7, 0.15), 0.6, alpha=0.2), cD + Vector((0, 0, 2.5))),
       sec(54.6), dur=10)
gas("D W", 26, cD + Vector((-1.8, -0.5, 0)), cD + Vector((1.8, 0.5, 2.0)), 54.0, 64.0, speed=0.8, r=0.14, seed=51,
    f_in=sec(54.5))
gas("D O", 12, cD + Vector((-1.8, -0.5, 2.0)), cD + Vector((1.8, 0.5, 3.0)), 54.0, 64.0, speed=0.8, r=0.14, mat=OIL,
    seed=52, f_in=sec(54.8))
big("Lbl D O", "olive oil 0.918", cD + Vector((2.2, -0.6, 2.5)), 55.5, None, mat=OIL, size=0.45, align='LEFT')
big("Lbl D W", "water 1.00", cD + Vector((2.2, -0.6, 1.0)), 56.0, None, mat=M["cyan"], size=0.45, align='LEFT')

# ---- E. Activity 5.3: a little liquid bromine; its vapour climbs the jar ----
cE = SE + Vector((0, 0, -2.2))
appear(box_edges("E Jar", (3.2, 1.4, 4.2), cE + Vector((0, 0, 2.1))), sec(64.2), dur=10)
appear(box("E Br Liquid", (3.1, 1.3, 0.4), mat_emit("Bromine Body", (0.6, 0.12, 0.03), 0.9, alpha=0.6),
           cE + Vector((0, 0, 0.2))), sec(64.3), dur=10)
up = zpath([(0, 0.0), (65, 0.0), (73, 1.0)])
gas("E Br", 20, cE + Vector((-1.6, -0.5, 0.4)), lambda t: cE + Vector((1.6, 0.5, 0.9 + 3.3 * up(t))), 64.0, 78.0,
    speed=1.6, r=0.13, mat=MOL["brown"], seed=61, f_in=sec(64.6))
big("Lbl E", "bromine vapour", cE + Vector((2.0, -0.6, 3.2)), 68.0, None, mat=MOL["brown"], size=0.45, align='LEFT')
finish_film()
