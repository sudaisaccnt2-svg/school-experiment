# ---- Film 501: Three states and the gas state (textbook pp.122-123: introduction, other states, gaseous state,  (v4 captions)
# 5.1 i indefinite volume, ii indefinite shape) ----
start_film("501", "501 States and Gases", 80.5)
END = scene.frame_end
SA, SB, SC, SD = (Vector((40 * k, 0, 0)) for k in range(4))

shot("Cam States", 0, 44, SA + Vector((0.6, 0, -0.9)), dist=17.5, pitch=0.1)
shot("Cam Plasma", 44, 54, SB + Vector((0, 0, -0.5)), dist=14)
shot("Cam Gas", 54, 72, SC + Vector((0, 0, -0.2)), dist=15, pitch=0.12)
shot("Cam Shape", 72, None, SD + Vector((0, 0, -0.2)), dist=16, pitch=0.12)
for name, t in (("Solid, liquid, gas", 0), ("Other states", 44), ("Gas state", 54), ("No fixed shape", 72)):
    act(name, sec(t))

say('A1', 'Matter has mass, takes space', 0.1, 7)
say('A2', 'Solid: molecules only shake', 7, 13)
say('A3', 'Heat it: liquid, molecules slide', 13, 25)
say('A4', 'More heat: gas flies apart', 25, 36)
say('A5', 'Solid ↔ liquid ↔ gas', 36, 44)
say('B', 'Also plasma: lightning, the Sun', 44, 54)
say('C1', 'Gas: far apart, very fast', 54, 63)
say('C2', 'No fixed volume: fills all', 63, 72)
say('D1', 'No fixed shape', 72, 80)

# ---- A. one box: solid → liquid → gas as the flame heats it ----
W, D, H = 4.4, 1.6, 4.0
z0 = -2.0
appear(box_edges("A Box", (W, D, H), SA + Vector((0, 0, z0 + H / 2))), sec(0.2), dur=10)
appear(box("A Plate", (W + 0.6, D + 0.6, 0.15), DARK, SA + Vector((0, 0, z0 - 0.1))), sec(0.2), dur=10)
pts = grid_pts(6, 5, 0.42, SA + Vector((0, 0, z0 + 0.2 + 2 * 0.42)))
solid = shake("A Mol S", pts, 0.0, 16.0, r=0.17, amp_f=lambda t: 0.03 if t < 12 else 0.03 + 0.03 * (t - 12))
for k, m in enumerate(solid):
    appear(m, sec(0.6) + k, s=(0.17,) * 3)
# liquid: the block slumps and spreads along the floor
lo_l = lambda t: SA + Vector((-W / 2 + 0.05 + max(0, 1.1 * (1 - (t - 16) / 2)) if t < 18 else -W / 2 + 0.05, -0.3, z0))
hi_l = lambda t: SA + Vector((W / 2 - 0.05 - max(0, 1.1 * (1 - (t - 16) / 2)) if t < 18 else W / 2 - 0.05, 0.3,
                              z0 + 1.3 + max(0, 1.0 * (1 - (t - 16) / 2))))
liq = gas("A Mol L", len(pts), lo_l, hi_l, 16.0, 26.0, speed=1.0, r=0.17, pos=[pos_at(m, 16.0) for m in solid], seed=5)
swap(solid, liq, 16.0)
# gas: they fly to every corner
lo_g = SA + Vector((-W / 2, -D / 2 + 0.1, z0))
hi_g = lambda t: SA + Vector((W / 2, D / 2 - 0.1, z0 + min(H, 1.3 + 1.6 * (t - 26))))
gasm = gas("A Mol G", len(pts), lo_g, hi_g, 26.0, 44.0, speed=lambda t: min(3.5, 1.0 + 1.2 * (t - 26)), r=0.17,
           pos=[pos_at(m, 26.0) for m in liq], seed=6)
swap(liq, gasm, 26.0)
flame("A Flame", SA + Vector((0, 0, z0 - 0.95)), 12.0, 36.0, s=1.0)
cyl("A Burner", 0.3, 0.4, 0.4, METAL, SA + Vector((0, 0, z0 - 1.2)))
col = thermo("A Thermo", SA + Vector((3.4, -0.2, z0)), h=3.6)
level(col, 0, 0.15)
level(col, 12, 0.15)
level(col, 16, 0.4)
level(col, 25, 0.5)
level(col, 30, 0.85)
big("Lbl A S", "solid", SA + Vector((0, -0.6, z0 + H + 0.6)), 7.2, 15.8, mat=M["cyan"], size=0.6)
big("Lbl A L", "liquid", SA + Vector((0, -0.6, z0 + H + 0.6)), 16.2, 25.8, mat=M["cyan"], size=0.6)
big("Lbl A G", "gas", SA + Vector((0, -0.6, z0 + H + 0.6)), 26.2, 43.8, mat=M["cyan"], size=0.6)

# ---- B. plasma: a glowing ball of charged bits ----
ring = ring_curve("B Ball", 2.3, mat_emit("Plasma Rim", (0.7, 0.45, 1.0), 2.0), None, 0.04, loc=SB)
ring.rotation_euler = (math.pi / 2, 0, 0)
appear(ring, sec(44.2), dur=10)
gas("B Ion", 10, SB + Vector((-1.4, -0.4, -1.4)), SB + Vector((1.4, 0.4, 1.4)), 44.0, 54.0, speed=2.0, r=0.2,
    mat=MOL["purple"], seed=11, f_in=sec(44.5))
gas("B El", 22, SB + Vector((-1.5, -0.4, -1.5)), SB + Vector((1.5, 0.4, 1.5)), 44.0, 54.0, speed=6.0, r=0.08,
    mat=M["electron"], seed=12, f_in=sec(44.8))
big("Lbl B", "plasma", SB + Vector((0, -0.6, 2.75)), 45.0, None, mat=MOL["purple"], size=0.6)

# ---- C. gas state: a wall comes away, the gas fills the whole box ----
W2 = 6.0
appear(box_edges("C Box", (W2, D, 3.0), SC + Vector((0, 0, 0))), sec(54.2), dur=10)
wall = box("C Wall", (0.08, D, 3.0), mat_emit("Wall Glow", (0.55, 0.75, 1.0), 1.5, alpha=0.5), SC)
appear(wall, sec(54.4), dur=10)
move(wall, sec(64.0), sec(65.2), SC, SC + Vector((0, 0, 3.4)))
hide_from(wall, sec(65.4))
hi_c = lambda t: SC + Vector((-0.06 if t < 64.6 else W2 / 2, D / 2 - 0.1, 1.5))
gas("C Mol", 18, SC + Vector((-W2 / 2, -D / 2 + 0.1, -1.5)), hi_c, 54.0, 72.0, speed=3.0, r=0.15, seed=21,
    f_in=sec(55.0))
big("Lbl C", "empty space", SC + Vector((1.5, -0.6, 2.2)), 56.0, 64.0, mat=M["dim"], size=0.48)

# ---- D. three containers, three shapes ----
for k, (sz, x, n) in enumerate((((1.4, 1.2, 4.0), -4.0, 9), ((3.2, 1.2, 1.4), 0.0, 9), ((2.2, 1.2, 2.2), 4.0, 9))):
    c = SD + Vector((x, 0, -0.4))
    appear(box_edges("D Box %d" % k, sz, c), sec(72.3 + 0.4 * k), dur=10)
    gas("D Mol %d" % k, n, c - Vector(sz) / 2, c + Vector(sz) / 2, 72.0, 84.0, speed=2.6, r=0.14, seed=30 + k,
        f_in=sec(72.8 + 0.4 * k))
big("Lbl D", "same gas, three shapes", SD + Vector((0, -0.6, 2.4)), 74.0, None, mat=M["gold"], size=0.55)
finish_film()
