# ---- Film 801: Metals (textbook pp.218-219: introduction: sodium catches fire in air, iron rusts in moist air, gold
# and platinum do neither; 8.1 metals conduct heat and electricity, are malleable and ductile, their oxides and
# hydroxides are bases (basic oxide + water → alkaline solution, red litmus → blue); a metal loses an electron and
# forms a cation: Na → Na⁺) (v4) ----
start_film("801", "801 Metals", 66.5)
END = scene.frame_end
S = [Vector((40 * k, 0, 0)) for k in range(8)]

shot("Cam Na", 0, 6, S[0] + Vector((0, 0, -0.6)), dist=8, pitch=0.08)
shot("Cam Fe", 6, 11, S[1] + Vector((0, 0, -0.6)), dist=8, pitch=0.08)
shot("Cam Au", 11, 16, S[2] + Vector((0, 0, -0.6)), dist=8, pitch=0.08)
shot("Cam Wire", 16, 23, S[3] + Vector((0, 0, -0.9)), dist=12, pitch=0.06)
shot("Cam Hammer", 23, 30, S[4] + Vector((0, 0, -0.6)), dist=10, pitch=0.06)
shot("Cam Pull", 30, 37, S[5] + Vector((0, 0, -0.6)), dist=10, pitch=0.06)
shot("Cam Litmus", 37, 50, S[6] + Vector((0, 0, -0.7)), dist=10, pitch=0.06)
shot("Cam Ion", 50, None, S[7] + Vector((0, 0, -0.6)), dist=10, pitch=0.06)
for name, t in (("Three metals", 0), ("Conduct", 16), ("Malleable", 23), ("Ductile", 30), ("Basic oxide", 37),
                ("Metals lose electrons", 50)):
    act(name, sec(t))

say('A1', 'Sodium in air catches fire', 0.1, 6)
say('A2', 'Iron in moist air rusts', 6, 11)
say('A3', 'Gold stays shiny', 11, 16)
say('B1', 'Metals carry electricity', 16, 23)
say('C1', 'Hammered flat: malleable', 23, 30)
say('D1', 'Pulled into wire: ductile', 30, 37)
say('E1', 'Metal oxide in water', 37, 43)
say('E2', 'Red litmus turns blue', 43, 50)
say('F1', 'A metal loses an electron', 50, 58)
say('F2', 'Sodium becomes Na⁺', 58, 66)

# ---- A. sodium burns, iron rusts, gold stays shiny ----
na = lump("A Na", S[0] + Vector((0, 0, -0.9)), 0.7, NA_M, 0.3)
cflame("A Fire", S[0] + Vector((0, -0.1, -0.6)), (1.0, 0.78, 0.15), 2.0, None, s=0.7)
big("Lbl A Na", "Na", S[0] + Vector((0, -0.8, 0.75)), 0.8, None, size=0.55)
nail = box("A Nail", (3.0, 0.3, 0.3), IRON, S[1] + Vector((0, 0, -0.6)))
appear(nail, sec(6.3), dur=10)
hd = cyl("A Nail Head", 0.4, 0.4, 0.12, IRON, S[1] + Vector((-1.55, 0, -0.6)), None, rot=(0, math.pi / 2, 0))
appear(hd, sec(6.3), dur=10)
rnd = random.Random(801)
for k in range(9):
    rr = 0.12 + 0.06 * rnd.random()
    sp = sphere("A Rust %d" % k, rr, RUST, S[1] + Vector((-1.2 + 0.32 * k, -0.15, -0.45 + 0.08 * (k % 2))), None, 12, 6)
    appear(sp, sec(7.5 + 0.25 * k), s=(rr,) * 3)
big("Lbl A Fe", "Fe", S[1] + Vector((0, -0.8, 0.6)), 6.8, None, size=0.55)
ring = ring_curve("A Ring", 0.8, AU_M, None, depth=0.16, loc=S[2] + Vector((0, 0, -0.5)))
ring.rotation_euler = (math.pi / 2, 0, 0)
appear(ring, sec(11.3), dur=10)
turn(ring, 11.5, 16.0, 0.5, axis=1)
flash("A Shine", S[2] + Vector((0.55, -0.3, 0.05)), sec(13.0), 0.25)
big("Lbl A Au", "Au", S[2] + Vector((0, -0.8, 0.75)), 11.8, None, size=0.55)

# ---- B. a metal bar closes the circuit: the bulb lights ----
b0 = S[3]
battery("B", b0 + Vector((-3.0, 0, -0.8)), 16.3)
bar = box("B Bar", (2.0, 0.4, 0.4), AG_M, b0 + Vector((0, 0, 0.6)))
appear(bar, sec(16.5), dur=10)
w1 = [b0 + Vector((-2.34, 0, -0.8)), b0 + Vector((-1.6, 0, -0.8)), b0 + Vector((-1.6, 0, 0.6)), b0 + Vector((-1.0, 0, 0.6))]
w2 = [b0 + Vector((1.0, 0, 0.6)), b0 + Vector((3.0, 0, 0.6)), b0 + Vector((3.0, 0, 0.05))]
w3 = [b0 + Vector((3.0, 0, -1.2)), b0 + Vector((3.0, 0, -1.5)), b0 + Vector((-3.9, 0, -1.5)), b0 + Vector((-3.9, 0, -0.8)),
      b0 + Vector((-3.66, 0, -0.8))]
for k, w in enumerate((w1, w2, w3)):
    wire("B Wire %d" % k, w, 16.6)
bulb("B", b0 + Vector((3.0, 0, -1.2)), 18.0, 1.0)
flow("B e", w1 + [b0 + Vector((1.0, 0, 0.6))] + w2[1:], 18.4, 23.0, n=8, speed=1.6, mat=E_BLUE)
big("Lbl B", "metal", b0 + Vector((0, -0.6, 1.3)), 17.0, None, size=0.5)

# ---- C. hammered flat ----
c0 = S[4] + Vector((0, 0, -1.0))
blk = box("C Block", (1.6, 0.9, 0.8), AG_M, c0 + Vector((0, 0, 0.4)))
appear(blk, sec(23.3), dur=10)
hm = empty("C Hammer", c0 + Vector((0, 0, 3.4)))
box("C Head", (1.0, 0.6, 0.6), IRON, (0, 0, 0), hm)
cyl("C Handle", 0.08, 0.08, 1.8, mat_pbr("Wood U8", (0.45, 0.28, 0.12), roughness=0.7), (0, 0, 1.2), hm)
appear(hm, sec(23.6), dur=10)
for k, (t, sz) in enumerate(((25.2, 0.65), (27.0, 0.42))):
    top = c0.z + 0.8 * (1.0 if k == 0 else 0.65) + 0.3
    kf(hm, "location", sec(t - 0.9), c0 + Vector((0, 0, 3.4)), 'BEZIER')
    kf(hm, "location", sec(t), Vector((c0.x, c0.y, top)), 'LINEAR')
    kf(hm, "location", sec(t + 0.8), c0 + Vector((0, 0, 3.4)), 'BEZIER')
    prev = (1.0, 1.0, 1.0) if k == 0 else (1.35, 1.15, 0.65)
    new = (1.35, 1.15, 0.65) if k == 0 else (1.8, 1.3, 0.42)
    kf(blk, "scale", sec(t), prev, 'BEZIER')
    kf(blk, "scale", sec(t + 0.2), new, 'BEZIER')
    kf(blk, "location", sec(t), c0 + Vector((0, 0, 0.4 * prev[2])), 'BEZIER')
    kf(blk, "location", sec(t + 0.2), c0 + Vector((0, 0, 0.4 * new[2])), 'BEZIER')
big("Lbl C", "malleable", c0 + Vector((0, -0.8, 2.2)), 27.6, None, mat=M["gold"], size=0.55)

# ---- D. pulled into a wire ----
d0 = S[5] + Vector((0, 0, -0.4))
rod = cyl("D Rod", 0.3, 0.3, 1.2, COPPER, d0, None, rot=(0, math.pi / 2, 0))
appear(rod, sec(30.3), dur=10)
kf(rod, "scale", sec(31.5), (1, 1, 1), 'BEZIER')
kf(rod, "scale", sec(34.5), (0.3, 0.3, 5.0), 'BEZIER')
for s_ in (-1, 1):
    cl = box("D Clamp %d" % s_, (0.35, 0.8, 0.8), IRON, d0 + Vector((0.75 * s_, 0, 0)))
    appear(cl, sec(30.6), dur=10)
    move(cl, sec(31.5), sec(34.5), d0 + Vector((0.75 * s_, 0, 0)), d0 + Vector((3.15 * s_, 0, 0)))
big("Lbl D", "ductile", d0 + Vector((0, -0.8, 1.4)), 34.6, None, mat=M["gold"], size=0.55)

# ---- E. the oxide dissolves; red litmus turns blue ----
e0 = S[6] + Vector((-0.9, 0, -1.7))
beaker("E", e0, 1.0, 2.0, 1.4, 37.3)
pw = []
for k in range(8):
    p = e0 + Vector((-0.4 + 0.12 * k, -0.2, 2.35 + 0.1 * (k % 3)))
    d = sphere("E Oxide %d" % k, 0.1, SALT_W, p, None, 12, 6)
    appear(d, sec(38.0), s=(0.1,) * 3)
    move(d, sec(39.0 + 0.1 * k), sec(40.2 + 0.1 * k), p, e0 + Vector((-0.4 + 0.12 * k, -0.2, 0.9)))
    hide_from(d, sec(41.5 + 0.1 * k), (0.1,) * 3)
big("Lbl E Ox", "Na₂O", e0 + Vector((0, -0.8, 2.95)), 38.2, 43.0, size=0.5)
lp = e0 + Vector((2.3, 0, 2.2))
a, b = litmus("E", lp, 43.3, "red", "blue", 46.0)
for o in (a, b):
    move(o, sec(44.0), sec(45.4), lp, e0 + Vector((0.55, -0.1, 1.2)))
big("Lbl E", "alkali", e0 + Vector((0, -0.8, 2.95)), 46.6, None, mat=M["cyan"], size=0.55)

# ---- F. Na → Na⁺ + e⁻ ----
f0 = S[7] + Vector((-0.6, 0, -0.4))
lose("F", 11, f0, 50.3, 53.0, "+")
big("Lbl F", "Na → Na⁺ + e⁻", S[7] + Vector((0, -0.8, 1.5)), 58.5, None, mat=M["white"], size=0.5)
finish_film()
