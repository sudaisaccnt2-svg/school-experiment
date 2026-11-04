# ---- Film 413: Bonding and properties (textbook pp.114-116: H-bond properties, 4.5.1 ionic, MgO 2800 °C,  (v4 captions)
# 4.5.2 covalent, 4.5.3 metals, Fig 4.21 copper wire, Activity 4.4) ----
import random
start_film("413", "413 Properties", 96.5)
END = scene.frame_end
SA, SB, SC, SD, SE = (Vector((40 * k, 0, 0)) for k in range(5))

shot("Cam Ladder", 0, 12, SA + Vector((0, 0, -0.3)), dist=14)
shot("Cam Ionic", 12, 36, SB + Vector((0, 0, 0.0)), dist=16, pitch=0.2)
shot("Cam Covalent", 36, 54, SC + Vector((0, 0, 0.0)), dist=16)
shot("Cam Metal", 54, 84, SD + Vector((0, 0, -0.1)), dist=13)
shot("Cam Uses", 84, None, SE + Vector((0, 0, -0.5)), dist=16)
for name, t in (("Strength ladder", 0), ("Ionic compounds", 12), ("Covalent compounds", 36), ("Metals", 54),
                ("Activity 4.4", 84)):
    act(name, sec(t))

say('A1', 'Covalent > hydrogen bond > dipole', 0.1, 6)
say('A2', 'Hydrogen bond: in between', 6, 12)
say('B1', 'Ionic: strong pulls everywhere', 12, 20)
say('B2', 'MgO melts at 2800 °C', 20, 27)
say('B3', 'Free ions conduct electricity', 27, 36)
say('C1', 'Covalent: weak pulls between molecules', 36, 44)
say('C2', 'Low melting · no conducting', 44, 49)
say('C3', 'Like dissolves like', 49, 54)
say('D1', 'Metals hammer into sheets', 54, 59)
say('D2', 'Metals draw into wires', 59, 64)
say('D3', 'Metals conduct', 64, 70)
say('D4', 'Metals shine and ring', 70, 78)
say('D5', 'Mercury: the liquid metal', 78, 84)
say('E1', 'Property, name, use', 84, 96)

# ---- A. strength ladder (steps, not to scale) ----
for k, (txt, h, col) in enumerate((("covalent", 3.2, M["red"]), ("hydrogen bond", 1.6, M["gold"]),
                                   ("dipole-dipole", 0.6, M["cyan"]))):
    x = -4.0 + 4.0 * k
    piv = empty("A Step %d" % k, SA + Vector((x, 0.2, -1.6)))
    box("A Step %d Box" % k, (2.6, 0.8, h), mat_pbr("A Step %d M" % k, ((0.7, 0.3, 0.3), (0.7, 0.55, 0.25), (0.25, 0.5, 0.7))[k],
        roughness=0.5), (0, 0, h / 2), piv)
    kf(piv, "scale", 0, (1, 1, 0), 'CONSTANT')
    kf(piv, "scale", sec(0.6 + 0.8 * k), (1, 1, 0.001), 'BEZIER')
    kf(piv, "scale", sec(2.0 + 0.8 * k), (1, 1, 1), 'BEZIER')
    big("Lbl A %d" % k, txt, SA + Vector((x, -0.6, -1.4 + h + 0.4)), 2.2 + 0.8 * k, None, mat=col, size=0.5)

# ---- B. ionic lattice: shivers when hot, then the ions break free (molten) ----
IONP = mat_emit("Ion Plus", (0.75, 0.5, 1.0), 1.3)
IONM = mat_emit("Ion Minus", (0.4, 0.95, 0.5), 1.3)
random.seed(7)
G = 1.3
k = 0
for i in range(-1, 2):
    for j in range(-1, 2):
        for l in range(-1, 2):
            plus = (i + j + l) % 2 == 0
            r = 0.26 if plus else 0.38
            p = SB + Vector((i * G, j * G, l * G + 0.5))
            s = sphere("B Ion %d %d %d" % (i, j, l), r, IONP if plus else IONM, p, None, 24, 12)
            appear(s, sec(12.4) + 2 * k, dur=8, s=(r,) * 3)
            for t in range(22, 28):       # hot: shiver in place
                kf(s, "location", sec(t), p, 'BEZIER')
                kf(s, "location", sec(t + 0.5), p + Vector([(random.random() - 0.5) * 0.25 for _ in range(3)]), 'BEZIER')
            kf(s, "location", sec(28), p, 'BEZIER')
            q = p
            for t in (30.0, 32.0, 34.0, 35.9):   # molten: they wander
                q = SB + Vector(((random.random() - 0.5) * 6.5, (random.random() - 0.5) * 2, (random.random() - 0.5) * 4 + 0.4))
                kf(s, "location", sec(t), q, 'BEZIER')
            k += 1
for kk, d in enumerate(((1, 0, 1), (-1, 0, 1), (1, 0, -0.7), (-1, 0, -0.7))):
    energy_wave("B Heat %d" % kk, SB + Vector((0, -0.6, 0.5)) + Vector(d).normalized() * 3.0, d, 21.0 + 0.3 * kk)
big("Lbl B MgO", "MgO: 2800 °C", SB + Vector((0, -0.6, 2.8)), 21.4, 27.8, mat=M["red"], size=0.6)
big("Lbl B Free", "ions move → conducts", SB + Vector((0, -0.6, 2.8)), 30.0, 35.8, mat=M["gold"], size=0.55)

# ---- C. covalent: CH4 molecules drift apart with a little heat ----
for k in range(6):
    p0 = SC + Vector((-2.4 + 2.4 * (k % 3), 0, 1.4 - 2.2 * (k // 3) + 0.2))
    g, _ = bstick("C CH4 %d" % k, *SHAPES["CH4"][:2], p0, 36.4 + 0.3 * k, None, scale=0.7)
    p1 = p0 + (p0 - SC - Vector((0, 0, 0.3))) * 0.45
    move(g, sec(44.6), sec(47.0), p0, p1)
    turn(g, 44.6, 53.8, turns=0.3)
big("Lbl C Low", "low melting point", SC + Vector((0, -0.6, 3.4)), 45.0, 53.8, mat=M["cyan"], size=0.55)

# ---- D. metals: one picture after another ----
METAL = mat_pbr("Shiny Metal", (0.95, 0.65, 0.45), metallic=1.0, roughness=0.12)
blk = box("D Block", (2.4, 1.6, 1.6), METAL, SD + Vector((0, 0.2, 0.4)))
appear(blk, sec(54.4), dur=10)
kf(blk, "scale", sec(56.0), (1, 1, 1), 'BEZIER')
for k, t in enumerate((56.6, 57.2, 57.8)):
    kf(blk, "scale", sec(t), (1.0 + 0.45 * (k + 1), 1.0 + 0.2 * (k + 1), 1.0 / (1 + 0.9 * (k + 1))), 'BEZIER')
kf(blk, "scale", sec(59.6), (2.35, 1.6, 0.27), 'BEZIER')
kf(blk, "scale", sec(61.8), (4.2, 0.12, 0.1), 'BEZIER')       # drawn into a wire
kf(blk, "scale", sec(63.4), (4.2, 0.12, 0.1), 'BEZIER')
kf(blk, "scale", sec(63.8), (0, 0, 0), 'BEZIER')
big("Lbl D Sheet", "sheet", SD + Vector((0, -0.6, 2.2)), 58.0, 59.4, mat=M["gold"], size=0.55)
big("Lbl D Wire", "wire", SD + Vector((0, -0.6, 2.2)), 61.8, 63.6, mat=M["gold"], size=0.55)
wire = cyl("D Wire", 0.16, 0.16, 9.0, METAL, SD + Vector((0, 0.1, 0.4)), None, (0, math.pi / 2, 0), segs=24)
appear(wire, sec(64.0), sec(69.8), dur=8)
for k in range(10):
    e = electron("D Flow %d" % k, None, SD + Vector((-4.5 + 0.8 * k, -0.15, 0.4)), 0.11)
    appear(e, sec(64.4), sec(69.8), dur=6, s=tuple(e.scale))
    kf(e, "location", sec(65.0), SD + Vector((-4.5 + 0.8 * k, -0.15, 0.4)), 'LINEAR')
    kf(e, "location", sec(69.6), SD + Vector((-4.5 + 0.8 * k + 1.6, -0.15, 0.4)), 'LINEAR')
big("Lbl D Flow", "electrons flow →", SD + Vector((0, -0.6, 1.6)), 65.2, 69.8, mat=M["cyan"], size=0.5)
bell = sphere("D Bell", 1.3, METAL, SD + Vector((0, 0.3, 0.5)), None, 48, 24)
appear(bell, sec(70.2), sec(77.8), dur=10, s=(1.3,) * 3)
turn(bell, 70.4, 74.0, turns=0.5)
pulses("D Ring", SD + Vector((0, -0.4, 0.5)), None, [74.6, 75.4, 76.2], r=1.6, mat=M["gold"])
big("Lbl D Shine", "shiny + rings", SD + Vector((3.6, -0.6, 0.5)), 71.0, 77.8, mat=M["gold"], size=0.5)
HG = mat_pbr("Mercury", (0.8, 0.82, 0.86), metallic=1.0, roughness=0.05)
for k in range(5):
    d = sphere("D Hg %d" % k, 0.5 - 0.07 * k, HG, SD + Vector((-1.6 + 0.8 * k, 0.2, -0.2 + 0.05 * k)), None, 32, 16)
    d.scale = ((0.5 - 0.07 * k), (0.5 - 0.07 * k), (0.5 - 0.07 * k) * 0.6)
    appear(d, sec(78.4 + 0.2 * k), dur=10, s=tuple(d.scale))
big("Lbl D Hg", "Hg: liquid", SD + Vector((0, -0.6, 1.4)), 79.2, None, mat=M["white"], size=0.55)

# ---- E. Activity 4.4: property -> name -> use ----
ROWS = [("drawn into wires", "ductile", "electric wires"), ("bent into shape", "malleable", "car bodies, foil"),
        ("reflect light", "lustrous", "jewellery, mirrors"), ("ring when struck", "sonorous", "bells"),
        ("let electricity pass", "conductor", "cables"), ("heavy for their volume", "dense", "weights"),
        ("transfer heat well", "heat conductor", "cooking pots")]
for k, (prop, nm, use) in enumerate(ROWS):
    z = 2.9 - 0.85 * k
    t = 84.6 + 1.5 * k
    big("Lbl E P%d" % k, prop, SE + Vector((-4.6, -0.6, z)), t, None, mat=M["white"], size=0.4)
    big("Lbl E N%d" % k, nm, SE + Vector((0.2, -0.6, z)), t + 0.5, None, mat=M["gold"], size=0.42)
    big("Lbl E U%d" % k, use, SE + Vector((4.6, -0.6, z)), t + 1.0, None, mat=M["cyan"], size=0.4)
finish_film()
