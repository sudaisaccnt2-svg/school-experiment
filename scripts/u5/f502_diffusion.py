# ---- Film 502: Diffusion and effusion (textbook pp.123-124: iii diffusion, Fig 5.1 perfume, Graham 1833,  (v4 captions)
# iv effusion, Fig 5.2 onion, Fig 5.3, Activity 5.1 bromine, Point to Ponder balloon) ----
start_film("502", "502 Diffusion and Effusion", 86.5)
END = scene.frame_end
SA, SB, SC, SD, SE = (Vector((40 * k, 0, 0)) for k in range(5))

shot("Cam Perfume", 0, 22, SA + Vector((0, 0, -0.6)), dist=17.5, pitch=0.1)
shot("Cam Graham", 22, 34, SB + Vector((0, 0, -0.4)), dist=16)
shot("Cam Effusion", 34, 52, SC + Vector((0, 0, -0.5)), dist=16, pitch=0.1)
shot("Cam Bromine", 52, 70, SD + Vector((0, 0, -0.8)), dist=15.5, pitch=0.08)
shot("Cam Balloon", 70, None, SE + Vector((0, 0, -0.4)), dist=14)
for name, t in (("Diffusion", 0), ("Graham", 22), ("Effusion", 34), ("Activity 5.1", 52), ("Point to Ponder", 70)):
    act(name, sec(t))

say('A1', 'Perfume crowded in one corner', 0.1, 7)
say('A2', 'Crowded to less crowded: diffusion', 7, 15)
say('A3', 'Evenly mixed: flow stops', 15, 22)
say('B', 'Graham: lighter gas is faster', 22, 34)
say('C1', 'One by one through a hole: effusion', 34, 44)
say('C2', 'Onion smell escapes the bag', 44, 52)
say('D1', 'Bromine jar on air jar', 52, 58)
say('D2', 'The brown spreads down', 58, 70)
say('E1', 'Why does a balloon sink?', 70, 78)
say('E2', 'Gas effuses out: it shrinks', 78, 86)

# ---- A. perfume spreads through the air of a room ----
W, D, H = 9.0, 1.6, 4.2
z0 = -2.1
lo = SA + Vector((-W / 2, -D / 2, z0))
hi = SA + Vector((W / 2, D / 2, z0 + H))
appear(box_edges("A Room", (W, D, H), SA + Vector((0, 0, z0 + H / 2))), sec(0.2), dur=10)
gas("A Air", 26, lo, hi, 0.0, 22.0, speed=2.2, r=0.15, seed=2, f_in=sec(0.4))
bx = SA + Vector((-W / 2 + 1.0, 0, z0))
jar("A Bottle", 0.55, 1.2, bx)
grow = lambda t: 0.0 if t < 4 else min(1.0, (t - 4) / 12)
hi_p = lambda t: (bx + Vector((0.5, 0.3, 1.15)) if t < 4 else
                  bx + Vector((0.5 + (W - 1.5) * grow(t), D / 2 - 0.1, 1.15 + (H - 1.2) * grow(t))))
lo_p = lambda t: bx + Vector((-0.5, -0.3, 0.05)) if t < 4 else SA + Vector((-W / 2, -D / 2 + 0.1, z0))
gas("A Perfume", 16, lo_p, hi_p, 0.0, 22.0, speed=2.2, r=0.13, mat=MOL["gold"], seed=3, f_in=sec(1.0))
big("Lbl A Crowded", "crowded", bx + Vector((0.9, -0.6, 1.9)), 2.0, 12.0, mat=M["gold"], size=0.5)
big("Lbl A Less", "less crowded", SA + Vector((2.2, -0.6, z0 + H + 0.5)), 7.0, 15.0, size=0.5)
big("Lbl A Even", "evenly mixed", SA + Vector((0, -0.6, z0 + H + 0.5)), 16.0, 22.0, mat=M["green"], size=0.55)

# ---- B. Graham: a light gas and a heavy gas race down two tubes ----
L = 10.0
for k, (z, nm, r, mat, v) in enumerate(((1.2, "light gas", 0.1, MOL["gold"], 0.62), (-1.2, "heavy gas", 0.2, MOL["red"], 0.22))):
    c = SB + Vector((0, 0, z))
    appear(box_edges("B Tube %d" % k, (L, 1.0, 1.1), c), sec(22.2 + 0.3 * k), dur=10)
    front = lambda t, v=v: min(L - 0.1, 1.2 + v * L * max(0, t - 24) / 10 * 1.4)
    gas("B Gas %d" % k, 12, SB + Vector((-L / 2, -0.4, z - 0.5)), lambda t, z=z, f=front: SB + Vector((-L / 2 + f(t), 0.4, z + 0.5)),
        22.0, 34.0, speed=4.0 if k == 0 else 1.6, r=r, mat=mat, seed=40 + k, f_in=sec(22.6 + 0.3 * k))
    big("Lbl B %d" % k, nm, SB + Vector((-L / 2 - 0.2, -0.6, z + 0.95)), 23.0, None, mat=mat, size=0.5, align='LEFT')

# ---- C. effusion: one molecule at a time through a pinhole ----
appear(box_edges("C Box", (8.0, D, 3.6), SC + Vector((0, 0, -0.4))), sec(34.2), dur=10)
WALL = mat_emit("Wall Glow", (0.55, 0.75, 1.0), 1.5, alpha=0.5)
appear(box("C Wall Lo", (0.1, D, 1.6), WALL, SC + Vector((0, 0, -1.4))), sec(34.4), dur=10)
appear(box("C Wall Hi", (0.1, D, 1.6), WALL, SC + Vector((0, 0, 0.6))), sec(34.4), dur=10)
hole = SC + Vector((0, 0, -0.4))
ring = ring_curve("C Hole", 0.24, M["gold"], None, 0.035, loc=hole + Vector((0, -0.85, 0)))
ring.rotation_euler = (0, math.pi / 2, 0)
lo1, hi1 = SC + Vector((-4.0, -D / 2, -2.2)), SC + Vector((-0.05, D / 2, 1.4))
lo2, hi2 = SC + Vector((0.05, -D / 2, -2.2)), SC + Vector((4.0, D / 2, 1.4))
gas("C Gas", 16, lo1, hi1, 34.0, 52.0, speed=2.6, r=0.14, seed=51, f_in=sec(34.6))
for k in range(7):
    escape("C Esc %d" % k, lo1, hi1, hole, lo2, hi2, 34.0, 37.0 + 2.0 * k, 52.0, r=0.14, seed=60 + k, f_in=sec(34.6))
big("Lbl C Hole", "← tiny hole", hole + Vector((0.35, -0.9, 0)), 36.0, 44.0, mat=M["gold"], size=0.45, align='LEFT')
big("Lbl C One", "one at a time", SC + Vector((2.0, -0.9, 1.9)), 39.0, None, size=0.5)

# ---- D. Activity 5.1: bromine jar upside down on a jar of air ----
JR, JH = 1.1, 2.4
appear(jar("D Jar Lo", JR, JH, SD + Vector((0, 0, -2.4))), sec(52.2), dur=10)
appear(jar("D Jar Hi", JR, JH, SD + Vector((0, 0, 0.0))), sec(52.4), dur=10)
appear(cyl("D Lid", JR * 1.05, JR * 1.05, 0.1, DARK, SD + Vector((0, 0, JH + 0.05))), sec(52.4), dur=10)
appear(cyl("D Plate", JR * 1.4, JR * 1.4, 0.12, DARK, SD + Vector((0, 0, -2.46))), sec(52.2), dur=10)
q = lambda t: 0 if t < 58 else min(1.0, (t - 58) / 8)
gas("D Br", 18, lambda t: SD + Vector((-0.7, -0.4, 0.1 - 2.3 * q(t))), SD + Vector((0.7, 0.4, JH - 0.1)), 52.0, 70.0,
    speed=1.6, r=0.14, mat=MOL["brown"], seed=71, f_in=sec(52.8))
gas("D Air", 12, SD + Vector((-0.7, -0.4, -2.3)), lambda t: SD + Vector((0.7, 0.4, -0.1 + 2.3 * q(t))), 52.0, 70.0,
    speed=1.8, r=0.14, seed=72, f_in=sec(53.0))
big("Lbl D Br", "bromine", SD + Vector((-1.6, -0.6, 1.2)), 53.0, None, mat=MOL["brown"], size=0.5, align='RIGHT')
big("Lbl D Air", "air", SD + Vector((-1.6, -0.6, -1.2)), 53.4, None, size=0.5, align='RIGHT')

# ---- E. the balloon: gas leaks out through the rubber, it shrinks and sinks ----
BAL = mat_emit("Balloon Skin", (1.0, 0.3, 0.45), 0.8, alpha=0.3)
bal = empty("E Balloon", SE + Vector((0, 0, 0.8)))
skin = sphere("E Skin", 1.6, BAL, (0, 0, 0), bal, 40, 20)
appear(skin, sec(70.3), s=(1.6,) * 3)
pcurve("E String", [(0, 0, -1.0), (0.075, 0, -1.3), (-0.05, 0, -1.6)], mat_emit("String", (0.9, 0.9, 0.9), 1.0), 0.01,
       "Models", parent=skin)
sz = lambda t: 1.0 if t < 78 else max(0.62, 1.0 - 0.38 * (t - 78) / 7)
gas("E Gas", 14, lambda t: Vector((-0.95,) * 3) * sz(t), lambda t: Vector((0.95,) * 3) * sz(t), 70.0, 90.0, speed=2.2,
    r=0.12, mat=MOL["gold"], parent=bal, seed=81, f_in=sec(70.6))
kf(skin, "scale", sec(78), (1.6,) * 3)
kf(skin, "scale", sec(85), (1.0,) * 3)
move(bal, sec(78), sec(86), SE + Vector((0, 0, 0.8)), SE + Vector((0, 0, 0.1)))
for k in range(5):
    a = math.radians(30 + 70 * k)
    p0 = Vector((1.5 * math.cos(a), 0, 1.5 * math.sin(a)))
    e = sphere("E Leak %d" % k, 0.12, MOL["gold"], p0, bal, 12, 6)
    hide_until(e, sec(78.5 + 1.2 * k))
    move(e, sec(78.5 + 1.2 * k), sec(81 + 1.2 * k), p0, p0 * 1.7, 'LINEAR')
    hide_from(e, sec(81.2 + 1.2 * k))
big("Lbl E", "gas leaks out", SE + Vector((2.4, -0.6, 2.0)), 79.0, None, mat=M["gold"], size=0.5)
finish_film()
