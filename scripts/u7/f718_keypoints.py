# ---- Film 718: Key points (textbook pp.213-214), one small picture per point (v4) ----
start_film("718", "718 Key Points", 80.5)
END = scene.frame_end
D = 5.0
PTS = [
    ("Electrochemistry", "Electrical energy ↔ chemical energy"),
    ("Oxidation", "Gain oxygen, lose hydrogen or lose electrons"),
    ("Reduction", "Lose oxygen, gain hydrogen or gain electrons"),
    ("Oxidation state", "The apparent charge on an atom"),
    ("Oxidizing agent", "Oxidizes another and is itself reduced"),
    ("Reducing agent", "Reduces another and is itself oxidized"),
    ("Redox reaction", "Oxidation and reduction at the same time"),
    ("Electrochemical cell", "A device that swaps electrical and chemical energy"),
    ("Electrolytes and non-electrolytes", "Ions carry current; no ions, no current"),
    ("Electrolysis", "Current breaks up a molten or dissolved electrolyte"),
    ("Electrodes", "Anode is +, cathode is −"),
    ("Voltaic cell", "A reaction that happens by itself makes current"),
    ("Down cell", "Sodium from molten NaCl"),
    ("Nelson cell", "NaOH, H₂ and Cl₂ from brine"),
    ("Electroplating", "One metal coated on another by electrolysis"),
    ("Corrosion", "Slow eating away of a metal by its surroundings"),
]
ST = [Vector((40 * k, 0, 0)) for k in range(len(PTS))]
SHORT = ['Electricity ↔ chemical energy', 'Oxidation: lose electrons', 'Reduction: gain electrons', 'Oxidation state: apparent charge', 'Oxidizing agent gets reduced', 'Reducing agent gets oxidized', 'Redox: both at once', 'Cell: swaps the two energies', 'Ions carry current', 'Electrolysis: current splits it', 'Anode +, cathode −', 'Voltaic: reaction makes current', 'Down cell: sodium from salt', 'Nelson cell: NaOH from brine', 'Electroplating: a metal coat', 'Corrosion: metal eaten away']
for k, (h, b) in enumerate(PTS):
    t0, t1 = 0.1 + D * k, D * (k + 1)
    shot("Cam %d" % k, D * k, t1 if k + 1 < len(PTS) else None, ST[k] + Vector((0, 0, -1.0)), dist=13, pitch=0.1)
    act(h, sec(D * k))
    say("K%d" % k, SHORT[k], t0, t1)          # v4: one short line per key point


def T(k, dt=0.4):
    return D * k + dt


# 0 battery lights a bulb
s = ST[0] + Vector((0, 0, -1.6))
battery("K0", s + Vector((-1.8, 0, 0.3)), T(0))
bulb("K0", s + Vector((1.8, 0, -0.1)), T(0), 1.0)
lp = [s + Vector((-1.2, 0, 0.3)), s + Vector((-1.2, 0, -0.5)), s + Vector((1.8, 0, -0.5)), s + Vector((1.8, 0, -0.1))]
lp2 = [s + Vector((1.8, 0, 1.25)), s + Vector((1.8, 0, 2.0)), s + Vector((-2.5, 0, 2.0)), s + Vector((-2.5, 0, 0.3))]
wire("K0 W1", lp, T(0, 0.6))
wire("K0 W2", lp2, T(0, 0.6))
flow("K0 e", lp + lp2, T(0, 1.2), D * 1, n=8, speed=1.6)
# 1 Fe²⁺ → Fe³⁺: electron leaves
s = ST[1] + Vector((0, 0, -0.8))
A("K1 Fe", "Fe", s + Vector((-1.0, 0, 0)), T(1), k=1.3)
travel("K1 e", s + Vector((-0.2, -0.5, 0.3)), s + Vector((2.4, -0.5, 0.3)), T(1, 1.5), dur=1.5, r=0.13, mat=E_BLUE)
badge("K1 B", "oxidized", s + Vector((-1.0, -0.8, 1.3)), T(1, 3.0))
# 2 Sn gains 2 e⁻
s = ST[2] + Vector((0, 0, -0.8))
A("K2 Sn", "Sn", s + Vector((1.0, 0, 0)), T(2), k=1.3)
for j in range(2):
    travel("K2 e %d" % j, s + Vector((-2.6, -0.5, 0.3 * j)), s + Vector((0.2, -0.8, 0.3 * j)), T(2, 1.2 + 0.5 * j), dur=1.4,
           r=0.13, mat=E_BLUE)
badge("K2 B", "reduced", s + Vector((1.0, -0.8, 1.3)), T(2, 3.2))
# 3 water with badges
s = ST[3] + Vector((0, 0, -0.8))
molb("K3", s, [("O", (0, 0, 0.2), "−2"), ("H", (-0.85, 0, -0.45), "+1"), ("H", (0.85, 0, -0.45), "+1")], T(3), T(3, 1.5),
     k=1.3, bsize=0.45)
# 4 / 5 Na gives, Cl takes
for k, (lbl, who) in ((4, ("oxidizing agent", 1)), (5, ("reducing agent", 0))):
    s = ST[k] + Vector((0, 0, -0.8))
    A("K%d Na" % k, "Na", s + Vector((-1.8, 0, 0)), T(k))
    A("K%d Cl" % k, "Cl", s + Vector((1.8, 0, 0)), T(k, 0.6))
    travel("K%d e" % k, s + Vector((-1.2, -0.3, 0.3)), s + Vector((1.2, -0.3, 0.3)), T(k, 1.4), dur=1.4, r=0.13, mat=E_BLUE)
    badge("K%d B" % k, lbl, s + Vector((1.8 if who else -1.8, -0.8, 1.3)), T(k, 3.0), mat=M["gold"] if who else M["cyan"])
# 6 Zn gives 2 e⁻ to Cu²⁺
s = ST[6] + Vector((0, 0, -0.8))
A("K6 Zn", "Zn", s + Vector((-1.8, 0, 0)), T(6))
A("K6 Cu", "Cu", s + Vector((1.8, 0, 0)), T(6, 0.3))
for j in range(2):
    travel("K6 e %d" % j, s + Vector((-1.2, -0.4, 0.3 * j)), s + Vector((1.2, -0.4, 0.3 * j)), T(6, 1.3 + 0.6 * j), dur=1.4,
           r=0.13, mat=E_BLUE)
big("Lbl K6 a", "oxidized", s + Vector((-1.8, -0.8, 1.3)), T(6, 3.2), None, mat=M["cyan"], size=0.42)
big("Lbl K6 b", "reduced", s + Vector((1.8, -0.8, 1.3)), T(6, 3.4), None, mat=M["gold"], size=0.42)
# 7 cell with a bulb
s = ST[7] + Vector((0, 0, -2.4))
c7 = cell("K7", s, T(7), w=3.6, h=2.2, gap=1.0, top="bulb", level=0.9, pa=ZINC, pc=COPPER, liq=CU_SOL)
flow("K7 e", c7["up_l"], T(7, 1.5), D * 8, n=3, speed=1.2)
# 8 strong vs non-electrolyte
s = ST[8] + Vector((0, 0, -2.4))
for j, (x, lev) in enumerate(((-2.4, 1.0), (2.4, 0.0))):
    cc = s + Vector((x, 0, 0))
    cell("K8 %d" % j, cc, T(8), w=3.0, h=2.0, gap=0.9, top="bulb", level=lev)
    lo, hi = cc + Vector((-0.5, -0.4, 0.15)), cc + Vector((0.5, 0.3, 1.5))
    if j == 0:
        gas("K8 P", 4, lo, hi, T(8), D * 9, speed=0.8, r=0.15, mat=CAT, f_in=sec(T(8, 0.6)), seed=31)
        gas("K8 N", 4, lo, hi, T(8), D * 9, speed=0.8, r=0.15, mat=ANI, f_in=sec(T(8, 0.6)), seed=32)
    else:
        gas("K8 S", 5, lo, hi, T(8), D * 9, speed=0.4, r=0.16, mat=MOL["white"], f_in=sec(T(8, 0.6)), seed=33)
# 9 electrolysis of molten salt / 10 electrodes (same rig, new labels)
for k in (9, 10):
    s = ST[k] + Vector((0, 0, -2.4))
    cc = cell("K%d" % k, s, T(k), w=4.0, h=2.2, liq=MELT, gap=1.3)
    flow("K%d eL" % k, cc["up_l"], T(k, 1.0), D * (k + 1), n=3, speed=1.0)
    flow("K%d eR" % k, cc["up_r"][::-1], T(k, 1.0), D * (k + 1), n=3, speed=1.0)
    for j in range(2):
        a = ion("K%d An%d" % (k, j), ANI, s + Vector((0.3, -0.25, 0.6 + 0.6 * j)), T(k, 0.6), r=0.18)
        move(a, sec(T(k, 1.5)), sec(T(k, 3.5)), s + Vector((0.3, -0.25, 0.6 + 0.6 * j)), s + Vector((-1.0, -0.25, 0.6 + 0.6 * j)))
        c = ion("K%d Ca%d" % (k, j), CAT, s + Vector((-0.3, -0.25, 0.9 + 0.6 * j)), T(k, 0.6), r=0.18)
        move(c, sec(T(k, 1.5)), sec(T(k, 3.5)), s + Vector((-0.3, -0.25, 0.9 + 0.6 * j)), s + Vector((1.0, -0.25, 0.9 + 0.6 * j)))
    if k == 10:
        big("Lbl K10 A", "anode +", s + Vector((-0.75, -1.0, 2.7)), T(10, 1.0), None, mat=M["red"], size=0.4)
        big("Lbl K10 C", "cathode −", s + Vector((0.75, -1.0, 2.7)), T(10, 1.3), None, mat=M["cyan"], size=0.4)
# 11 voltaic: zinc and copper, bulb glows
s = ST[11] + Vector((0, 0, -2.4))
c11 = cell("K11", s, T(11), w=3.6, h=2.2, gap=1.0, top="bulb", level=1.0, pa=ZINC, pc=COPPER, liq=ZN_SOL)
flow("K11 e", c11["up_l"], T(11, 1.5), D * 12, n=3, speed=1.2)
big("Lbl K11", "Zn → Cu", s + Vector((0, -1.0, 2.6)), T(11, 2.0), None, mat=M["cyan"], size=0.4)
# 12 Down cell: sodium beads and chlorine bubbles
s = ST[12] + Vector((0, 0, -2.4))
tank("K12", s, 4.0, 2.4, 1.9, T(12), liq_mat=MELT)
an = cyl("K12 Anode", 0.3, 0.3, 2.3, GRAPHITE, s, base=True)
appear(an, sec(T(12, 0.3)), dur=8)
bubbles("K12 Cl2", s.x - 0.25, s.x + 0.25, s.z + 1.0, s.z + 3.4, -0.4, T(12, 1.0), D * 13, n=5, r=0.11, mat=CL_GAS)
for j in range(3):
    b = sphere("K12 Na %d" % j, 0.18, SODIUM, s + Vector((1.2 + 0.25 * (j % 2), -0.4, 1.7)), None, 14, 7)
    appear(b, sec(T(12, 1.5 + 0.5 * j)), s=(0.18,) * 3)
big("Lbl K12 a", "Na", s + Vector((2.6, -1.0, 1.7)), T(12, 2.2), None, mat=M["white"], size=0.45)
big("Lbl K12 b", "Cl₂", s + Vector((0.8, -1.0, 3.3)), T(12, 2.5), None, mat=M["white"], size=0.45)
# 13 Nelson: bubbles both sides, drips below
s = ST[13] + Vector((0, 0, -2.0))
tank("K13", s, 4.0, 2.4, 1.9, T(13), liq_mat=mat_emit("Brine U7", (0.6, 0.8, 1.0), 0.4, alpha=0.3))
for j, (x, m) in enumerate(((-1.2, H_GAS), (0.0, CL_GAS))):
    bubbles("K13 G%d" % j, s.x + x - 0.2, s.x + x + 0.2, s.z + 0.3, s.z + 3.2, -0.4, T(13, 0.8), D * 14, n=5, r=0.1, mat=m)
big("Lbl K13 a", "H₂", s + Vector((-1.2, -1.0, 3.2)), T(13, 1.5), None, mat=M["white"], size=0.45)
big("Lbl K13 b", "Cl₂", s + Vector((0.4, -1.0, 3.2)), T(13, 1.8), None, mat=M["white"], size=0.45)
big("Lbl K13 c", "NaOH", s + Vector((1.4, -1.0, 1.0)), T(13, 2.4), None, mat=M["gold"], size=0.45)
# 14 a coat grows on an object
s = ST[14] + Vector((0, 0, -0.9))
ob = box("K14 Obj", (2.6, 0.4, 1.4), IRON, s)
appear(ob, sec(T(14)), dur=8)
coat = box("K14 Coat", (2.7, 0.5, 1.5), CHROME, s)
kf(coat, "scale", 0, (0.001, 1, 1))
kf(coat, "scale", sec(T(14, 1.0)), (0.001, 1, 1))
kf(coat, "scale", sec(T(14, 3.5)), (1, 1, 1))
# 15 rust spots
s = ST[15] + Vector((0, 0, -0.9))
bar = box("K15 Bar", (3.6, 0.7, 0.7), IRON, s)
appear(bar, sec(T(15)), dur=8)
rnd = random.Random(15)
for j in range(10):
    p = s + Vector((rnd.uniform(-1.6, 1.6), -0.37, rnd.uniform(-0.25, 0.25)))
    rs = rnd.uniform(0.1, 0.2)
    sp = sphere("K15 R %d" % j, rs, RUST, p, None, 12, 6)
    appear(sp, sec(T(15, 0.8 + 0.25 * j)), s=(rs, rs * 0.4, rs))
finish_film()
