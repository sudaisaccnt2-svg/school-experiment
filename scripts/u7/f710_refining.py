# ---- Film 710: Refining copper (textbook pp.195-196: (iv) electrolytic purification: impure (blister) copper anode,  (v4 captions)
# thin pure copper cathode, CuSO₄ + H₂SO₄ electrolyte, 50 °C, about 0.3 V, 160–400 A/m²; anode Cu → Cu²⁺ + 2e⁻,
# cathode Cu²⁺ + 2e⁻ → Cu; Zn, Fe dissolve; Au, Ag fall as anode sludge; up to 99.99 % pure; Fig 7.5) ----
start_film("710", "710 Refining Copper", 62.5)
END = scene.frame_end
S0 = Vector((0, 0, 0))

shot("Cam Wide", 0, 14, S0 + Vector((0, 0, -1.1)), dist=14, pitch=0.1)
shot("Cam Work", 14, 40, S0 + Vector((0, 0, -1.3)), dist=12, pitch=0.1)
shot("Cam Sludge", 40, 52, S0 + Vector((-0.8, 0, -1.6)), dist=10, pitch=0.12)
shot("Cam End", 52, None, S0 + Vector((0, 0, -1.1)), dist=14, pitch=0.1)
for name, t in (("Refining", 0), ("Copper moves", 14), ("Anode sludge", 40), ("99.99 %", 52)):
    act(name, sec(t))

say('A1', 'Wires need pure copper', 0.1, 7)
say('A2', 'Impure anode, pure cathode', 7, 14)
say('B1', 'The impure block dissolves', 14, 24)
say('B2', 'Pure copper builds up', 24, 40)
say('C1', 'Gold, silver fall: sludge', 40, 46)
say('C2', 'Zinc, iron stay dissolved', 46, 52)
say('D1', '99.99 % pure', 52, 62)

c0 = S0 + Vector((0, 0, -2.6))
cc = cell("A", c0, 0.4, w=4.4, h=2.4, liq=CU_SOL, gap=1.4, pa=COPPER, pc=COPPER, pw=0.25)
# the impure block (thick, with dark specks) over the left plate; it shrinks
blk = box("A Block", (0.9, 0.5, 2.2), mat_pbr("Blister Copper U7", (0.55, 0.28, 0.16), metallic=0.7, roughness=0.6),
          c0 + Vector((-1.4, 0, 1.4)))
appear(blk, sec(0.8), s=(1, 1, 1))
kf(blk, "scale", sec(14.0), (1, 1, 1))
kf(blk, "scale", sec(52.0), (0.45, 0.8, 0.85))
# the pure sheet thickens
pure = box("A Pure", (0.3, 0.5, 2.2), mat_pbr("Pure Copper U7", (0.95, 0.5, 0.3), metallic=1.0, roughness=0.2),
           c0 + Vector((1.4, 0, 1.4)))
appear(pure, sec(1.0), s=(1, 1, 1))
kf(pure, "scale", sec(14.0), (1, 1, 1))
kf(pure, "scale", sec(52.0), (2.6, 1.05, 1.02))
big("Lbl A 1", "impure", c0 + Vector((-1.0, -1.0, 2.95)), 7.3, None, mat=M["white"], size=0.4)
big("Lbl A 2", "pure", c0 + Vector((1.0, -1.0, 2.95)), 7.8, None, mat=M["gold"], size=0.4)

# Cu²⁺ ions cross from block to sheet again and again
for k in range(6):
    z = 0.6 + 0.3 * k
    a, b = c0 + Vector((-0.85, -0.35, z)), c0 + Vector((1.1, -0.35, z + 0.1))
    frames, vals = [], []
    t = 15.0 + 0.6 * k
    while t + 3.0 <= 52.0:
        frames += [sec(t), sec(t + 3.0) - 1]
        vals += [a, b]
        t += 3.6
    s = sphere("A Cu2 %d" % k, 0.17, CAT, a, None, 16, 8)
    keys_bulk(s, "location", frames, vals)
    hide_until(s, sec(15.0 + 0.6 * k))
    hide_from(s, sec(52.0), (0.17,) * 3)
flow("A e L", cc["up_l"], 15.0, END / FPS, n=4, speed=0.9)
flow("A e R", cc["up_r"][::-1], 15.0, END / FPS, n=4, speed=0.9)
big("Lbl B", "Cu²⁺", c0 + Vector((0, -1.0, 2.95)), 16.0, 40.0, mat=M["gold"], size=0.42)

# sludge: gold and silver specks drop from the block
AU = mat_emit("Gold Speck U7", (1.0, 0.75, 0.2), 1.5)
AG = mat_emit("Silver Speck U7", (0.85, 0.88, 0.95), 1.0)
for k in range(8):
    x = -1.75 + 0.1 * k
    p0 = c0 + Vector((x, -0.3, 1.0 + 0.2 * (k % 4)))
    p1 = c0 + Vector((x + 0.05 * (k % 3), -0.3, 0.12 + 0.05 * (k % 2)))
    sp = sphere("A Sludge %d" % k, 0.08, AU if k % 2 == 0 else AG, p0, None, 10, 5)
    appear(sp, sec(41.0 + 0.4 * k), s=(0.08,) * 3)
    move(sp, sec(41.5 + 0.4 * k), sec(43.5 + 0.4 * k), p0, p1)
big("Lbl C", "sludge: Au, Ag", c0 + Vector((-3.5, -1.0, 0.5)), 44.0, 52.0, mat=M["gold"], size=0.36)
big("Lbl D", "99.99 %", c0 + Vector((3.7, -1.0, 2.0)), 53.0, None, mat=M["gold"], size=0.55)
finish_film()
