# ---- Film 508: Boiling point and freezing point (textbook pp.137-139: iv boiling point Fig 5.12, constant temperature,  (v4 captions)
# Fig 5.13, a nature of liquid, b external pressure (hills, vacuum distillation, pressure cooker), v freezing point,
# STS Torricelli / Boyle J-tube / manometer, Table 5.2) ----
import random as _r
start_film("508", "508 Boiling and Freezing", 98.5)
END = scene.frame_end
SA, SB, SC, SD, SE, SF = (Vector((40 * k, 0, 0)) for k in range(6))

shot("Cam Boil", 0, 24, SA + Vector((0.6, 0, -0.3)), dist=16.5, pitch=0.1)
shot("Cam Curves", 24, 40, SB + Vector((0, 0, -0.1)), dist=15.5)
shot("Cam Pressure", 40, 58, SC + Vector((0, 0, -0.5)), dist=16, pitch=0.08)
shot("Cam Freeze", 58, 72, SD + Vector((0.6, 0, -0.5)), dist=14, pitch=0.1)
shot("Cam Torricelli", 72, 84, SE + Vector((0, 0, -1.2)), dist=15)
shot("Cam Table", 84, None, SF + Vector((0.4, 0, -0.3)), dist=16)
for name, t in (("Boiling", 0), ("Fig 5.13", 24), ("Outside pressure", 40), ("Freezing", 58), ("Barometer", 72),
                ("Table 5.2", 84)):
    act(name, sec(t))

say('A1', 'Heat: vapour pressure rises', 0.1, 7)
say('A2', 'Equals air pressure: it boils', 7, 13)
say('A3', 'That temperature: boiling point', 13, 19)
say('A4', 'Boiling: temperature stays the same', 19, 24)
say('B1', 'Ether, ethanol, water curves', 24, 32)
say('B2', 'Each boils at 760 mm Hg', 32, 40)
say('C1', 'On a hill: boils lower', 40, 47)
say('C2', 'Vacuum distillation uses this', 47, 52)
say('C3', 'Pressure cooker: boils higher', 52, 58)
say('D1', 'Cool it: molecules slow', 58, 64)
say('D2', 'Liquid and solid together: freezing', 64, 72)
say('E1', 'Torricelli: air holds 760 mm', 72, 78)
say('E2', 'Bent into a J: manometer', 78, 84)
say('F1', "Each bar: where it's liquid", 84, 92)
say('F2', 'Water 0 → 100 °C', 92, 98)


def bubbles(key, c, w, h_liq, t0, t1, rate=0.25, seed=1, r=0.09):
    rnd = _r.Random(seed)
    BUB = mat_emit("Bubble", (0.85, 0.92, 1.0), 1.2, alpha=0.55)
    t, k = t0, 0
    while t < t1:
        p0 = Vector(c) + Vector((rnd.uniform(-w / 2 + 0.3, w / 2 - 0.3), rnd.uniform(-0.3, 0.3), 0.15))
        b = sphere("%s %d" % (key, k), r, BUB, p0, None, 12, 6)
        hide_until(b, sec(t))
        kf(b, "scale", sec(t), (r * 0.5,) * 3, 'LINEAR')
        kf(b, "scale", sec(t + 1.0), (r * 1.8,) * 3, 'LINEAR')
        move(b, sec(t), sec(t + 1.0), p0, p0 + Vector((rnd.uniform(-0.15, 0.15), 0, h_liq - 0.15)), 'LINEAR')
        hide_from(b, sec(t + 1.0) + 1, (r * 1.8,) * 3)
        t += rate * (0.6 + 0.8 * rnd.random())
        k += 1


def stand(key, c, t_in):
    """A tripod stand under a beaker whose base is at c."""
    c = Vector(c)
    appear(box(key + " Gauze", (3.6, 1.8, 0.08), DARK, c + Vector((0, 0, -0.06))), sec(t_in), dur=10)
    for k, x in enumerate((-1.5, 1.5)):
        appear(cyl("%s Leg %d" % (key, k), 0.06, 0.06, 1.5, METAL, c + Vector((x, 0, -0.85))), sec(t_in), dur=10)


# ---- A. Fig 5.12: heat → vapour pressure arrow grows to meet the air arrow → boiling, thermometer stops at 100 ----
cA = SA + Vector((0, 0, -1.2))
stand("A Stand", cA, 0.2)
flame("A Flame", cA + Vector((0, 0, -1.55)), 1.0, None, s=0.9)
dish("A Beaker", cA, 3.2, 1.4, 2.6, 1.8, 26, 0.0, 24.0, speed=lambda t: 0.8 + 1.4 * min(1, t / 8), r=0.13, seed=3,
     f_in=sec(0.4))
bubbles("A Bub", cA, 3.2, 1.8, 8.0, 24.0, seed=4)
for k, x in enumerate((-0.9, 0.9)):
    a = arrow("A Air %d" % k, 1.3, M["red"], None, cA + Vector((x - 0.35, -0.75, 3.35)), (0, math.pi / 2, 0), r=0.05, head=0.3)
    appear(a, sec(1.0 + 0.2 * k), dur=8)
    v = arrow("A VP %d" % k, 1.3, M["cyan"], None, cA + Vector((x + 0.35, -0.75, 2.0)), (0, -math.pi / 2, 0), r=0.05,
              head=0.3)
    kf(v, "scale", 0, (0, 0, 0), 'CONSTANT')
    kf(v, "scale", sec(2.0), (0.2, 1, 1), 'BEZIER')
    kf(v, "scale", sec(8.0), (1, 1, 1), 'BEZIER')
big("Lbl A Air", "air pressure", cA + Vector((-2.0, -0.6, 4.1)), 1.5, None, mat=M["red"], size=0.45, align='RIGHT')
big("Lbl A VP", "vapour pressure", cA + Vector((2.0, -0.6, 4.1)), 2.5, None, mat=M["cyan"], size=0.45, align='LEFT')
col = thermo("A Thermo", cA + Vector((1.1, -0.8, 0.3)), h=3.4)
appear(col.parent, sec(0.6), dur=10)
level(col, 0, 0.3)
level(col, 8, 0.85, 'LINEAR')
level(col, 24, 0.85)
big("Lbl A 100", "100 °C", cA + Vector((2.0, -0.6, 3.3)), 8.2, None, mat=M["gold"], size=0.5, align='LEFT')

# ---- B. Fig 5.13 curves and the 760 line ----
o = axes("B Ax", SB + Vector((-5.0, 0, -2.2)), 9.6, 4.6, "T (°C)", "vapour pressure (torr)", 24.2, size=0.45)
sx, sz = 9.0 / 100, 4.2 / 800
plot("B 760", [o + Vector((0, 0, 760 * sz)), o + Vector((100 * sx, 0, 760 * sz))], 24.6, 1.0, mat=M["dim"], r=0.03,
     every=0.25)
big("Lbl B 760", "760", o + Vector((-0.45, -0.6, 760 * sz)), 25.0, None, mat=M["dim"], size=0.4)
for k, (tb, kk, mat, txt) in enumerate(((34.6, 0.041, M["gold"], "34.6 °C"), (78.3, 0.049, M["green"], "78.3 °C"),
                                        (100.0, 0.047, M["cyan"], "100 °C"))):
    pts = []
    for i in range(41):
        T_ = 2.5 * i
        P_ = 760 * math.exp(kk * (T_ - tb))
        if P_ > 800:
            break
        pts.append(o + Vector((T_ * sx, 0, P_ * sz)))
    plot("B Curve %d" % k, pts, 26.0 + 1.6 * k, 2.0, mat=mat, r=0.045)
    p = o + Vector((tb * sx, -0.05, 760 * sz))
    appear(sphere("B Cross %d" % k, 0.13, mat, p, None, 16, 8), sec(32.4 + 1.0 * k), s=(0.13,) * 3)
    big("Lbl B %d" % k, txt, p + Vector((0, -0.6, 0.5 + 0.0 * k)), 32.6 + 1.0 * k, None, mat=mat, size=0.4)

# ---- C. a hill (boils below 100) and a pressure cooker (above 100) ----
HILL = mat_pbr("Hill Dark", (0.06, 0.14, 0.07), roughness=0.95)
hill = cyl("C Hill", 2.3, 0.45, 2.6, HILL, SC + Vector((-3.6, 0.6, -0.5)), segs=7)
appear(hill, sec(40.2), dur=10)
POT = mat_pbr("Pot", (0.6, 0.62, 0.66), metallic=0.9, roughness=0.3)
appear(cyl("C Pot", 0.45, 0.45, 0.5, POT, SC + Vector((-3.6, 0.2, 1.05))), sec(40.6), dur=10)
flame("C Hill Flame", SC + Vector((-3.6, 0.2, 0.62)), 41.0, None, s=0.4)
gas("C Air Hill", 5, SC + Vector((-6.0, -0.4, 1.4)), SC + Vector((-1.4, 0.4, 3.0)), 40.0, 58.0, speed=2.0, r=0.1, seed=5,
    f_in=sec(41.0))
big("Lbl C Hill", "below 100 °C", SC + Vector((-3.6, -0.8, 2.0)), 42.0, None, mat=M["cyan"], size=0.5)
cooker = empty("C Cooker", SC + Vector((3.6, 0, -1.8)))
cyl("C Cooker Body", 1.4, 1.4, 1.8, POT, (0, 0, 0.9), cooker, segs=40)
cyl("C Cooker Lid", 1.5, 1.2, 0.3, POT, (0, 0, 1.95), cooker, segs=40)
cyl("C Cooker Weight", 0.18, 0.12, 0.4, DARK, (0, 0, 2.3), cooker)
box("C Cooker Handle", (1.6, 0.25, 0.15), DARK, (2.1, 0, 1.95), cooker)
appear(cooker, sec(52.2), dur=10)
flame("C Cooker Flame", SC + Vector((3.6, 0, -2.6)), 52.6, None, s=0.8)
for k in range(3):
    pf = SC + Vector((3.6, -0.3, 0.9))
    s_ = sphere("C Steam %d" % k, 0.12, MOL["white"], pf, None, 12, 6)
    hide_until(s_, sec(54.0 + 0.9 * k))
    move(s_, sec(54.0 + 0.9 * k), sec(55.5 + 0.9 * k), pf, pf + Vector((0.2 * (k - 1), 0, 1.6)), 'LINEAR')
    hide_from(s_, sec(55.5 + 0.9 * k))
big("Lbl C Cooker", "above 100 °C", SC + Vector((3.6, -0.8, 2.3)), 53.2, None, mat=M["red"], size=0.5)

# ---- D. freezing: liquid molecules slow and lock into a solid grid; thermometer down to 0 °C ----
cD = SD + Vector((0, 0, -2.2))
appear(box_edges("D Jar", (3.6, 1.4, 2.8), cD + Vector((0, 0, 1.4)), top=False), sec(58.2), dur=10)
grid = grid_pts(6, 3, 0.42, cD + Vector((0, 0, 0.6)))
lo, hi = cD + Vector((-1.8, -0.4, 0)), cD + Vector((1.8, 0.4, 1.4))
liqD = []
for i, gp in enumerate(grid):
    rnd = _r.Random(70 + i)
    start = Vector([lo[j] + 0.15 + rnd.random() * (hi[j] - lo[j] - 0.3) for j in range(3)])
    liqD.append(life("D Liq %d" % i, start, 58.0, [("box", lo, hi, 64.5, 1.0), ("to", gp, 66.5)], r=0.15, seed=80 + i,
                     f_in=sec(58.6)))
sol = shake("D Sol", grid, 66.5, 72.0, amp=0.03, r=0.15, seed=90)
swap(liqD, sol, 66.5)
col = thermo("D Thermo", cD + Vector((2.6, -0.2, 0.0)), h=3.2)
appear(col.parent, sec(58.4), dur=10)
level(col, 58, 0.6)
level(col, 66, 0.25)
big("Lbl D 0", "0 °C", cD + Vector((3.2, -0.6, 1.0)), 66.5, None, mat=M["cyan"], size=0.5, align='LEFT')
big("Lbl D S", "solid ↔ liquid", cD + Vector((0, -0.6, 3.4)), 67.0, None, mat=M["gold"], size=0.5)

# ---- E. Torricelli's barometer and Boyle's J-tube ----
HG = mat_pbr("Mercury U5", (0.8, 0.82, 0.86), metallic=1.0, roughness=0.35)
cE = SE + Vector((-3.0, 0, -2.6))
appear(cyl("E Dish", 1.3, 1.3, 0.35, HG, cE + Vector((0, 0, 0.18))), sec(72.2), dur=10)
appear(jar("E Dish Rim", 1.4, 0.5, cE), sec(72.2), dur=10)
appear(jar("E Tube", 0.22, 4.4, cE + Vector((0, 0, 0.2))), sec(72.4), dur=10)
colE = cyl("E Hg", 0.18, 0.18, 3.6, HG, cE + Vector((0, 0, 0.2)), base=True)
kf(colE, "scale", 0, (0, 0, 0), 'CONSTANT')
kf(colE, "scale", sec(72.8), (1, 1, 0.02))
kf(colE, "scale", sec(75.0), (1, 1, 1))
big("Lbl E 760", "760 mm", cE + Vector((0.5, -0.6, 3.8)), 75.2, None, mat=M["gold"], size=0.5, align='LEFT')
cJ = SE + Vector((2.6, 0, -2.4))
jpts = [cJ + Vector((-0.6, 0, 4.0))] + [cJ + Vector((-0.6 * math.cos(math.pi * i / 12), 0, -0.6 * math.sin(math.pi * i / 12)))
                                        for i in range(13)] + [cJ + Vector((0.6, 0, 1.6))]
jt = pcurve("E J Tube", jpts, mat_emit("J Glass", (0.55, 0.75, 1.0), 0.8, alpha=0.25), 0.2, "Models")
hide_until(jt, sec(78.2))
hgJ = pcurve("E J Hg", [cJ + Vector((-0.6, 0, 1.0))] + jpts[1:-1] + [cJ + Vector((0.6, 0, 0.3))], HG, 0.14, "Models")
hide_until(hgJ, sec(78.6))
big("Lbl E J", "J-tube", cJ + Vector((0, -0.6, 4.4)), 78.8, None, mat=M["cyan"], size=0.5)

# ---- F. Table 5.2 as liquid ranges on a temperature line ----
rows = (("water", 0.0, 100.0), ("acetic acid", 16.6, 118.1), ("benzene", 5.5, 80.2), ("phenol", 43.0, 181.0),
        ("chloroform", -63.5, 61.2), ("ethanol", -114.7, 78.4))
sxF = 10.4 / 310
x0 = SF + Vector((-5.0, 0, 0))
X = lambda T_: x0 + Vector(((T_ + 120) * sxF, 0, 0))
axl = arrow("F Axis", 10.8, M["white"], None, X(-120) + Vector((0, 0, -2.6)), r=0.025, head=0.22)
appear(axl, sec(84.2), dur=8)
for T_ in (-100, 0, 100):
    pcurve("F Tick %d" % T_, [X(T_) + Vector((0, 0, -2.7)), X(T_) + Vector((0, 0, -2.5))], M["white"], 0.02, "Models")
    big("Lbl F T %d" % T_, "%d °C" % T_, X(T_) + Vector((0, -0.4, -3.05)), 84.4, None, mat=M["dim"], size=0.36)
pcurve("F Zero", [X(0) + Vector((0, 0.2, -2.5)), X(0) + Vector((0, 0.2, 2.2))], M["orbit_dim"], 0.012, "Models")
LIQ = mat_emit("Liquid Range", (0.15, 0.45, 1.0), 1.0)
for k, (nm, fp, bp) in enumerate(rows):
    z = 1.7 - 0.72 * k
    w = (bp - fp) * sxF
    b = box("F Bar %d" % k, (w, 0.3, 0.5), LIQ, (X(fp) + X(bp)) / 2 + Vector((0, 0, z)))
    kf(b, "scale", 0, (0, 0, 0), 'CONSTANT')
    kf(b, "scale", sec(85.0 + 0.8 * k), (0.02, 1, 1))
    kf(b, "scale", sec(85.8 + 0.8 * k), (1, 1, 1))
    t = shadow(_text("F Name %d" % k, nm, (X(fp) + X(bp)) / 2 + Vector((0, -0.25, z)), 0.3, M["white"], weight="semibold"))
    appear(t, sec(85.6 + 0.8 * k))
    for j, (T_, al) in enumerate(((fp, 'RIGHT'), (bp, 'LEFT'))):
        v = shadow(_text("F Val %d %d" % (k, j), ("%g" % T_).replace("-", "−"), X(T_) + Vector((-0.1 if j == 0 else 0.1, -0.25, z)),
                         0.28, M["cyan"] if j == 0 else M["red"], align=al))
        appear(v, sec(86.0 + 0.8 * k))
finish_film()
