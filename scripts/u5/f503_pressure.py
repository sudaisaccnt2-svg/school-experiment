# ---- Film 503: Pressure, compressibility, mobility, density (textbook pp.125-126: v pressure P = F/A, 1 atm,  (v4 captions)
# vi compressibility, vii mobility, viii density, oxygen as gas / liquid / solid) ----
start_film("503", "503 Gas Pressure", 80.5)
END = scene.frame_end
SA, SB, SC, SD, SE = (Vector((40 * k, 0, 0)) for k in range(5))

shot("Cam Walls", 0, 20, SA + Vector((0, 0, -0.5)), dist=15, pitch=0.1)
shot("Cam Atm", 20, 36, SB + Vector((0, 0, -1.5)), dist=15)
shot("Cam Squeeze", 36, 50, SC + Vector((0, 0, -0.2)), dist=15, pitch=0.12)
shot("Cam Pipe", 50, 60, SD + Vector((0, 0, -0.6)), dist=17)
shot("Cam Density", 60, None, SE + Vector((0, 0, -0.6)), dist=16, pitch=0.1)
for name, t in (("Pressure", 0), ("1 atmosphere", 20), ("Compressibility", 36), ("Mobility", 50), ("Density", 60)):
    act(name, sec(t))

say('A1', 'Every hit is a push', 0.1, 7)
say('A2', 'Push on each area: pressure', 7, 13)
say('A3', 'P = F / A, in pascal', 13, 20)
say('B1', 'Air holds up 760 mm mercury', 20, 26)
say('B2', '1 atm = 760 mm Hg = 760 torr', 26, 31)
say('B3', '1 atm = 101.325 kPa', 31, 36)
say('C1', 'Empty space: easy to squeeze', 36, 43)
say('C2', 'Push harder: smaller volume', 43, 50)
say('D', 'Gases flow through pipes', 50, 60)
say('E1', 'Density = mass ÷ volume', 60, 67)
say('E2', 'Gas: very low density', 67, 80)

# ---- A. molecules hit the right wall: each hit flashes ----
W, D, H = 5.0, 1.6, 4.0
z0 = -2.0
appear(box_edges("A Box", (W, D, H), SA + Vector((0, 0, z0 + H / 2))), sec(0.2), dur=10)
wall = box("A Wall", (0.06, D, H), mat_emit("Wall Hot", (1.0, 0.72, 0.28), 1.2, alpha=0.35), SA + Vector((W / 2, 0, z0 + H / 2)))
appear(wall, sec(7.2), dur=10)
hits = []
gas("A Mol", 18, SA + Vector((-W / 2, -D / 2, z0)), SA + Vector((W / 2, D / 2, z0 + H)), 0.0, 20.0, speed=3.2, r=0.15,
    seed=3, f_in=sec(0.5), hits=hits)
hit_flashes("A Hit", hits, 0, 1, SA[0] + W / 2, 1.0, 20.0, limit=60)
big("Lbl A F", "F  (push)", SA + Vector((W / 2 + 0.4, -0.6, z0 + H - 0.4)), 3.0, None, mat=M["gold"], size=0.5, align='LEFT')
patch = box("A Area", (0.08, 1.0, 1.0), mat_emit("Area Patch", (0.3, 1.0, 0.5), 1.4, alpha=0.55),
            SA + Vector((W / 2 + 0.05, -0.2, z0 + 1.6)))
appear(patch, sec(9.0), dur=10)
big("Lbl A A", "A  (area)", SA + Vector((W / 2 + 0.4, -0.6, z0 + 1.6)), 9.4, None, mat=M["green"], size=0.5, align='LEFT')

# ---- B. the air holds up a 760 mm column of mercury ----
HG = mat_pbr("Mercury U5", (0.8, 0.82, 0.86), metallic=1.0, roughness=0.35)
dish = cyl("B Dish", 1.8, 1.8, 0.4, HG, SB + Vector((0, 0, -2.6)))
appear(dish, sec(20.2), dur=10)
appear(jar("B Dish Rim", 1.9, 0.6, SB + Vector((0, 0, -2.85))), sec(20.2), dur=10)
appear(jar("B Tube", 0.28, 4.2, SB + Vector((0, 0, -2.6)), top=False), sec(20.4), dur=10)
appear(cyl("B Tube Top", 0.29, 0.0, 0.25, GLASS, SB + Vector((0, 0, 1.7))), sec(20.4), dur=10)
col = cyl("B Hg", 0.24, 0.24, 3.6, HG, SB + Vector((0, 0, -2.6)), base=True)
kf(col, "scale", 0, (0, 0, 0), 'CONSTANT')
kf(col, "scale", sec(21.0), (1, 1, 0.02))
kf(col, "scale", sec(24.0), (1, 1, 1.0))
for k, x in enumerate((-3.6, -2.6, 2.6, 3.6)):
    a = arrow("B Push %d" % k, 1.2, M["cyan"], None, SB + Vector((x, -0.2, -0.9)), (0, math.pi / 2, 0), r=0.05, head=0.3)
    appear(a, sec(21.0 + 0.2 * k), dur=8)
gas("B Air", 16, SB + Vector((-5.5, -0.6, -2.3)), SB + Vector((-1.4, 0.6, 1.3)), 20.0, 36.0, speed=2.4, r=0.13, seed=8,
    f_in=sec(20.6))
gas("B Air R", 16, SB + Vector((1.4, -0.6, -2.3)), SB + Vector((5.5, 0.6, 1.3)), 20.0, 36.0, speed=2.4, r=0.13, seed=9,
    f_in=sec(20.6))
pcurve("B Mark", [(0.4, -0.3, 1.0), (0.9, -0.3, 1.0)], M["gold"], 0.03, "Models").location = SB
big("Lbl B 760", "760 mm", SB + Vector((1.1, -0.6, 1.0)), 24.2, None, mat=M["gold"], size=0.55, align='LEFT')
big("Lbl B Air", "air pushes", SB + Vector((-3.4, -0.6, 1.4)), 21.5, None, mat=M["cyan"], size=0.5)

# ---- C. squeeze: the piston goes down, the molecules crowd together ----
cg, pis = piston_cyl("C Cyl", 1.5, 4.0, SC + Vector((0, 0, -2.2)))
appear(cg, sec(36.2), dur=10)
ptop = lambda t: 3.2 if t < 43 else (3.2 - 1.9 * min(1.0, (t - 43) / 2.5))
kf(pis, "location", sec(43.0), (0, 0, 3.2))
kf(pis, "location", sec(45.5), (0, 0, 1.3))
pis.location = (0, 0, 3.2)
kf(pis, "location", 1, (0, 0, 3.2))
gas("C Mol", 16, SC + Vector((-1.0, -0.5, -2.2)), lambda t: SC + Vector((1.0, 0.5, -2.2 + ptop(t) - 0.1)), 36.0, 50.0,
    speed=2.6, r=0.14, seed=12, f_in=sec(36.6))
a = arrow("C Push", 1.2, M["red"], None, SC + Vector((0, -0.3, 2.9)), (0, math.pi / 2, 0), r=0.06, head=0.3)
appear(a, sec(42.6), dur=8)
move(a, sec(43.0), sec(45.5), SC + Vector((0, -0.3, 2.9)), SC + Vector((0, -0.3, 1.0)))
lp = big("Lbl C Push", "push", SC + Vector((0.6, -0.6, 2.7)), 42.8, None, mat=M["red"], size=0.5, align='LEFT')
move(lp, sec(43.0), sec(45.5), SC + Vector((0.6, -0.6, 2.7)), SC + Vector((0.6, -0.6, 0.9)))
big("Lbl C Space", "empty space", SC + Vector((2.4, -0.6, 0.0)), 37.5, 43.0, mat=M["dim"], size=0.48, align='LEFT')

# ---- D. a pipe: gas flows from the tank to the house ----
TANK = mat_pbr("Gas Tank", (0.15, 0.35, 0.6), metallic=0.6, roughness=0.35)
appear(cyl("D Tank", 1.0, 1.0, 3.0, TANK, SD + Vector((-5.0, 0, -1.4))), sec(50.2), dur=10)
appear(box("D House", (2.0, 2.0, 2.4), mat_pbr("House", (0.5, 0.35, 0.25), roughness=0.8), SD + Vector((5.2, 0, -1.6))),
       sec(50.2), dur=10)
appear(cyl("D Roof", 1.75, 0.0, 1.2, mat_pbr("Roof", (0.6, 0.15, 0.12), roughness=0.7), SD + Vector((5.2, 0, 0.2)), segs=4,
           rot=(0, 0, math.pi / 4)), sec(50.2), dur=10)
appear(box_edges("D Pipe", (8.4, 0.8, 0.8), SD + Vector((0, 0, -1.4))), sec(50.4), dur=10)
import random as _r
rr = _r.Random(5)
for k in range(26):
    t0 = 50.6 + 0.33 * k
    zz, yy = rr.uniform(-0.25, 0.25), rr.uniform(-0.2, 0.2)
    m = sphere("D Mol %d" % k, 0.13, MOL["air"], SD + Vector((-4.2, yy, -1.4 + zz)), None, 12, 6)
    hide_until(m, sec(t0))
    move(m, sec(t0), sec(t0 + 3.2), SD + Vector((-4.2, yy, -1.4 + zz)), SD + Vector((4.2, -yy, -1.4 - zz)), 'LINEAR')
    hide_from(m, sec(t0 + 3.2) + 1)
big("Lbl D", "flows along", SD + Vector((0, -0.6, -0.4)), 51.5, None, mat=M["cyan"], size=0.5)

# ---- E. one oxygen box per state: same size, very different packing ----
for k, (x, nm, val) in enumerate(((-5.0, "gas", "0.00142 g/cm³"), (0.0, "liquid", "1.149 g/cm³"),
                                  (5.0, "solid", "1.42 g/cm³"))):
    c = SE + Vector((x, 0, -0.6))
    appear(box_edges("E Box %d" % k, (3.0, 1.2, 3.0), c), sec(60.3 + 0.3 * k), dur=10)
    lo, hi = c - Vector((1.5, 0.6, 1.5)), c + Vector((1.5, 0.6, 1.5))
    if k == 0:
        gas("E Gas", 4, lo, hi, 60.0, 84.0, speed=2.4, r=0.16, seed=31, f_in=sec(60.8))
    elif k == 1:
        gas("E Liq", 26, lo, Vector((hi[0], hi[1], lo[2] + 1.9)), 60.0, 84.0, speed=0.7, r=0.16, seed=32, f_in=sec(61.3))
    else:
        for i, m in enumerate(shake("E Sol", grid_pts(6, 6, 0.46, c, ny=1), 60.0, 84.0, r=0.17, seed=33)):
            appear(m, sec(61.8) + i // 2, s=(0.17,) * 3)
    big("Lbl E %d" % k, nm + "\n" + val, c + Vector((0, -0.6, 2.3)), 68.0 + 1.0 * k, None,
        mat=(M["cyan"], M["white"], M["gold"])[k], size=0.45)
finish_film()
