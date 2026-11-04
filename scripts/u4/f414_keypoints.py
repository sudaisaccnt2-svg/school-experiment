# ---- Film 414: Key points (textbook p.117): one short station per bullet, each with its picture ----
start_film("414", "414 Key Points", 84.5)
END = scene.frame_end
D = 7.0
ST = [Vector((40 * k, 0, 0)) for k in range(12)]
KP = [
    ("Chemical bond", "The force that holds atoms together in a compound"),
    ("Valence electrons", "The electrons in the outer (valence) shell"),
    ("Ionic (electrovalent) bond", "Electrons move over completely from one atom to another"),
    ("Covalent bond", "Electrons are shared between two atoms"),
    ("Single, double or triple", "1, 2 or 3 shared pairs"),
    ("Dative (coordinate) bond", "ONE atom gives both electrons of the shared pair"),
    ("Polar covalent bond", "Sharing between DIFFERENT atoms: unequal"),
    ("Non-polar covalent bond", "Sharing between SIMILAR atoms: equal"),
    ("Metallic bond", "+ metal ions held by a sea of electrons"),
    ("Shapes", "CO₂ linear,  H₂O angular,  NH₃ trigonal pyramidal"),
    ("Intermolecular forces", "Pulls BETWEEN the molecules of a compound"),
    ("Hydrogen bond", "δ+ H of one molecule pulls a lone pair on F, O or N of another"),
]
rows = []
SHORT = ["Bond: holds atoms together", "Valence electrons: the outer ones", "Ionic: electrons move over",
         "Covalent: electrons are shared", "1, 2 or 3 shared pairs", "Dative: one atom gives both", "Polar: unequal sharing",
         "Non-polar: equal sharing", "Metallic: ions in electron sea", "Shapes: linear, angular, pyramidal",
         "Pulls between molecules", "Hydrogen bond: δ+ H grabs a pair"]
for k, (h, b) in enumerate(KP):
    t0 = D * k
    shot("Cam KP %d" % k, t0, t0 + D, ST[k] + Vector((0, 0, -0.3)), dist=13)
    act(h, sec(t0))
    say("K%d" % k, SHORT[k], t0 + 0.1, t0 + D)          # v4: one short line per key point


def tk(k, dt=0.4):
    return D * k + dt


# 1 chemical bond: H + H share
A = LRing("K0 A", "H", ST[0] + Vector((-2.6, 0, 0.6)), 1, tk(0), None, r=1.0, angles=[0])
B = LRing("K0 B", "H", ST[0] + Vector((2.6, 0, 0.6)), 1, tk(0), None, r=1.0, emat=E_GOLD, angles=[180])
A.move(tk(0, 1.5), tk(0, 3.0), ST[0] + Vector((-0.75, 0, 0.6)))
B.move(tk(0, 1.5), tk(0, 3.0), ST[0] + Vector((0.75, 0, 0.6)))
pairs(A, B, [0], [0], tk(0, 3.2))

# 2 valence electrons: chlorine, the 7 gold ones
vatom("K1 Cl", 17, ST[1] + Vector((0, 0, 0.6)), sec(tk(1)), [(sec(tk(1, 1.5)), sec(tk(1, 6.8)))], r0=0.5, dr=0.55, e_r=0.11,
      nuc_r=0.09)
big("Lbl K1", "7", ST[1] + Vector((2.6, -0.6, 2.0)), tk(1, 2.0), D * 2, mat=M["gold"], size=0.6)

# 3 ionic: Na hands its electron to Cl
gna, _, ona = vatom("K2 Na", 11, ST[2] + Vector((-3.4, 0, 0.6)), sec(tk(2)), [], r0=0.45, dr=0.5, e_r=0.1, nuc_r=0.08)
gcl, _, ocl = vatom("K2 Cl", 17, ST[2] + Vector((3.4, 0, 0.6)), sec(tk(2)), [], counts=[2, 8, 8], r0=0.45, dr=0.5, e_r=0.1,
                    nuc_r=0.08)
hand(ona[0], ocl[-1], tk(2, 1.6), "K2 Hop", dur=1.6)
drop_ring("K2 Na", 2, tk(2, 3.6))
big("Lbl K2 Na", "Na⁺", ST[2] + Vector((-3.4, -0.6, -1.9)), tk(2, 3.8), D * 3, mat=mat_emit("K Ion Plus", (0.8, 0.6, 1.0), 2.5), size=0.6)
big("Lbl K2 Cl", "Cl⁻", ST[2] + Vector((3.4, -0.6, -1.9)), tk(2, 4.0), D * 3, mat=mat_emit("K Ion Minus", (0.45, 1.0, 0.55), 2.5), size=0.6)

# 4 covalent: H-Cl Lewis, dots -> line
lewis("K3 HCl", [("H", (-1.0, 0.4)), ("Cl", (1.0, 0.4))], [(0, 1, 1)], [(1, 90), (1, 0), (1, 270)], ST[3], tk(3), t_line=tk(3, 3.6),
      size=0.9)

# 5 single, double, triple
for k, (a, order, z) in enumerate((("Cl", 1, 2.0), ("O", 2, 0.5), ("N", 3, -1.0))):
    lewis("K4 %d" % k, [(a, (-0.9, z)), (a, (0.9, z))], [(0, 1, order)], [], ST[4], tk(4, 0.6 * k), t_line=tk(4, 3.0 + 0.4 * k),
          size=0.7)

# 6 dative: NH3 lone pair -> H+
lewis("K5 NH3", [("N", (-0.6, 0.4)), ("H", (-2.2, 0.4)), ("H", (-0.6, -1.2))], [(0, 1, 1), (0, 2, 1)], [(0, 90)], ST[5], tk(5),
      t_line=tk(5, 2.2), size=0.8)
hp = _text("K5 Hp", "H⁺", ST[5] + Vector((2.6, -0.1, 0.4)), 0.8, M["white"], weight="semibold")
shadow(hp)
appear(hp, sec(tk(5, 0.6)))
dart = arrow("K5 Arrow", 1.5, M["gold"], None, ST[5] + Vector((0.2, -0.3, 0.45)), r=0.06, head=0.3)
appear(dart, sec(tk(5, 2.6)))

# 7 polar: H-Cl with δ+ δ-
lewis("K6 HCl", [("H", (-1.0, 0.4)), ("Cl", (1.0, 0.4))], [(0, 1, 1)], [], ST[6], tk(6), t_line=tk(6, 2.0), size=0.9)
big("Lbl K6 P", "δ+", ST[6] + Vector((-1.0, -0.6, 1.6)), tk(6, 2.0), D * 7, mat=M["red"], size=0.6)
big("Lbl K6 M", "δ−", ST[6] + Vector((1.0, -0.6, 1.6)), tk(6, 2.4), D * 7, mat=M["cyan"], size=0.6)

# 8 non-polar: Cl-Cl, pair in the middle
A = LRing("K7 A", "Cl", ST[7] + Vector((-0.875, 0, 0.6)), 7, tk(7), None, r=1.1, angles=[76, 104, 256, 284, 166, 194, 0])
B = LRing("K7 B", "Cl", ST[7] + Vector((0.875, 0, 0.6)), 7, tk(7), None, r=1.1, emat=E_GOLD, angles=[76, 104, 256, 284, -14, 14, 180])
pairs(A, B, [6], [6], tk(7, 1.6))

# 9 metallic: + ions and a sea of electrons
IONP = mat_emit("Metal Ion", (0.42, 0.28, 0.75), 1.0)
import random
random.seed(11)
for i in range(5):
    for j in range(3):
        p = ST[8] + Vector((-2.8 + 1.4 * i, 0.2, -0.8 + 1.4 * j))
        appear(sphere("K8 Ion %d %d" % (i, j), 0.3, IONP, p, None, 20, 10), sec(tk(8)) + 2 * (i + j), dur=8, s=(0.3,) * 3)
for k in range(12):
    e = electron("K8 Sea %d" % k, None, ST[8] + Vector((-3 + random.random() * 6, -0.3, -1 + random.random() * 3)), 0.12)
    appear(e, sec(tk(8, 1.0)), dur=6, s=tuple(e.scale))
    t, cur = tk(8, 1.2), e.location.copy()
    kf(e, "location", sec(t), cur, 'BEZIER')
    while t < D * 9:
        t += 1.2 + random.random()
        kf(e, "location", sec(t), ST[8] + Vector((-3 + random.random() * 6, -0.3, -1 + random.random() * 3)), 'BEZIER')

# 10 shapes: CO2, H2O, NH3
for k, key in enumerate(("CO2", "H2O", "NH3")):
    atoms, bonds, lone = SHAPES[key]
    g, _ = bstick("K9 %s" % key, atoms, bonds, ST[9] + Vector((-3.6 + 3.6 * k, 0, 0.6)), tk(9, 0.5 * k), None, scale=0.9,
                  lone=lone)
    turn(g, tk(9, 2.0), D * 10, turns=0.2)

# 11 intermolecular: HCl ... HCl
HCL = ([("H", (-0.65, 0, 0)), ("Cl", (0.65, 0, 0))], [(0, 1, 1)])
for k in range(3):
    bstick("K10 HCl %d" % k, *HCL, ST[10] + Vector((-2.8 + 2.8 * k, 0, 0.6)), tk(10, 0.3 * k), None, scale=0.9)
for k in range(2):
    a, b = ST[10] + Vector((-2.8 + 2.8 * k + 1.15, -0.1, 0.6)), ST[10] + Vector((-2.8 + 2.8 * (k + 1) - 0.9, -0.1, 0.6))
    for i in range(3):
        c = dot("K10 Dash %d %d" % (k, i), 0.05, M["gold"], None, a + (b - a) * ((i + 0.5) / 3))
        appear(c, sec(tk(10, 2.0)) + 3 * i, dur=6, s=(0.05,) * 3)

# 12 hydrogen bond: two waters
S = 1.1
O1 = ST[11] + Vector((-1.4, 0, 0.9))
bstick("K11 W1", *SHAPES["H2O"][:2], O1, tk(11), None, scale=S, lone=SHAPES["H2O"][2])
hp = O1 + Vector((0.79 * S, 0, -0.61 * S))
u = Vector((0.79, 0, -0.61)).normalized()
bstick("K11 W2", *SHAPES["H2O"][:2], hp + u * 2.0 * S, tk(11, 0.4), None, scale=S, lone=SHAPES["H2O"][2])
for i in range(4):
    c = dot("K11 Dash %d" % i, 0.05, M["gold"], None, hp + u * (0.35 + 0.33 * i) * S + Vector((0, -0.1, 0)))
    appear(c, sec(tk(11, 2.0)) + 3 * i, dur=6, s=(0.05,) * 3)
big("Lbl K11", "hydrogen bond", ST[11] + Vector((2.8, -0.6, 1.2)), tk(11, 2.6), None, mat=M["gold"], size=0.5)
finish_film()
