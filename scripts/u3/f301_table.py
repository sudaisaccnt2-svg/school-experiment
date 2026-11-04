# ---- Film 301: The Modern Periodic Table (textbook pp.66-67, Moseley, periodic law, Scientific Information) ----
# bsend.py common.py p2/lib.py u3/u3lib.py u3/f301_table.py
start_film("301", "301 Modern Periodic Table", 99.0)
END = scene.frame_end
rnd = random.Random(3)

tb = Table("Tab", (0, 0, 0), numbers=True)
ALL = tb.zs

# ---- shots ----
camA = shot("Cam Cloud", 0, 9, (0, 0, -0.8), dist=27)
SB = Vector((60, 0, 0))
camB = shot("Cam Moseley", 9, 21, SB + Vector((0, 0, -0.35)), dist=13)
TT = (0, 0, -2.45)
camC = shot("Cam Order", 21, 33, TT, dist=25)
camD = shot("Cam Periods", 33, 44, TT, dist=25)
camE = shot("Cam Groups", 44, 55, TT, dist=25)
camF = shot("Cam Law", 55, 67, TT, dist=25)
camG = shot("Cam Metals", 67, 80, TT, dist=25)
camH = shot("Cam Facts", 80, 92, (3.2, 0, -0.95), dist=18)
camI = shot("Cam End", 92, None, TT, dist=25)
for name, t in (("Intro", 0), ("Moseley", 9), ("Order", 21), ("Periods", 33), ("Groups", 44), ("Periodic law", 55),
                ("Metals", 67), ("Fun facts", 80)):
    act(name, sec(t))

caps([
    ("A", "The Periodic Table", "118 elements. How can we put them in a sensible order?", 0.1, 9),
    ("B", "Moseley's idea", "Henry Moseley (an English physicist): order them by ATOMIC NUMBER", 9, 15),
    ("B2", "Atomic number = number of protons", "Each next element has ONE more proton: 1, 2, 3 …", 15, 21),
    ("C", "In that order, they make a table", "1, 2, 3 … 118, row after row: the MODERN periodic table", 21, 33),
    ("D", "The rows are PERIODS", "7 rows across, numbered 1 to 7", 33, 44),
    ("E", "The columns are GROUPS", "Simple form: 8 main groups going down, IA to VIIIA", 44, 55),
    ("F", "The modern periodic law", "Properties depend on the ATOMIC NUMBER, and they repeat", 55, 61),
    ("F2", "Same column → alike", "Li, Na, K, Rb, Cs, Fr: they all react in the same way", 61, 67),
    ("G", "Most elements are METALS", "Metals fill the left and the middle", 67, 71.5),
    ("G2", "Non-metals: top right", "Carbon, oxygen, the halogens and the noble gases", 71.5, 75.8),
    ("G3", "Metalloids: in between", "A staircase of elements that are half metal, half non-metal", 75.8, 80),
    ("H", "Fun fact: no letter J!", "J is the only letter that is not on the periodic table", 80, 86),
    ("H2", "The rarest natural element: astatine", "All of Earth's crust holds only about 28 g of it", 86, 92),
    ("I", "Next: Periods  →", "We look at the rows of the table, one by one", 92),
])

# ---- A. the cloud: tiles float jumbled, then fly into place in atomic-number order ----
F_FLY, FLY_DUR = sec(21.8), 8.5
for i, z in enumerate(ALL):
    t = tb.T[z]["t"]
    home = tb.xy(z)
    cloud = Vector((rnd.uniform(-13, 13), rnd.uniform(-6.5, 4.0), rnd.uniform(-9, 2.5)))
    drift = Vector((rnd.uniform(-0.6, 0.6), rnd.uniform(-0.4, 0.4), rnd.uniform(-0.5, 0.5)))
    rot0 = Euler((rnd.uniform(-1.2, 1.2), rnd.uniform(-1.2, 1.2), rnd.uniform(-0.8, 0.8)))
    rot1 = Euler((rot0.x + rnd.uniform(-0.5, 0.5), rot0.y + rnd.uniform(-0.5, 0.5), rot0.z))
    f = F_FLY + int(i * FLY_DUR * FPS / len(ALL))
    t.location = cloud
    kf(t, "location", 1, cloud, 'LINEAR')
    kf(t, "location", sec(9), cloud + drift, 'BEZIER')
    kf(t, "location", f, cloud + drift, 'BEZIER')
    kf(t, "location", f + 20, home, 'BEZIER')
    kf(t, "rotation_euler", 1, rot0, 'LINEAR')
    kf(t, "rotation_euler", sec(9), rot1, 'BEZIER')
    kf(t, "rotation_euler", f, rot1, 'BEZIER')
    kf(t, "rotation_euler", f + 20, Euler((0, 0, 0)), 'BEZIER')
    appear(t, 2 + int(rnd.uniform(0, 40)), dur=8)

# ---- B. Moseley: nuclei with 1, 2, 3 protons above the tiles H, He, Li ----
mini = Table("Mos", SB, zs=[1, 2, 3], numbers=True)
for k, z in enumerate((1, 2, 3)):
    d = mini.T[z]["t"]
    d.location = Vector(((k - 1) * 3.2, -1.15, 0))
    d.scale = (1.5, 1.5, 1.5)
    appear(d, sec(9.6 + 1.6 * k), dur=8, s=(1.5,) * 3)
    nroot, _ = nucleus("Mos Nuc %d" % z, z, {1: 0, 2: 2, 3: 4}[z], loc=SB + Vector(((k - 1) * 3.2, 0, 1.05)), r=0.3,
                       seed=z)
    appear(nroot, sec(10.0 + 1.6 * k), dur=10)
    spin(nroot, sec(10.0), sec(21), 0.25 * (1 if k % 2 else -1))
for k, (txt) in enumerate(("1 proton", "2 protons", "3 protons")):
    big("Lbl Mos %d" % k, txt, SB + Vector(((k - 1) * 3.2, -0.6, 2.3)), 15.4 + 1.2 * k, 20.8, mat=M["red"], size=0.42)
for k in range(2):
    a = arrow("Mos Plus %d" % k, 1.2, M["gold"], None, SB + Vector(((k - 1) * 3.2 + 1.0, -0.4, -1.15)), r=0.04,
              head=0.25)
    appear(a, sec(16.2 + 1.2 * k), sec(20.8))
    big("Lbl Mos Plus %d" % k, "+1", SB + Vector(((k - 1) * 3.2 + 1.6, -0.6, -0.6)), 16.4 + 1.2 * k, 20.8,
        mat=M["gold"], size=0.42)

# ---- D. periods: a gold bar steps down the rows; the period numbers appear at the left ----
rb = empty("Row Bar", (0, 3, TH + 0.06), tb.root)
frame_box("Row Bar Box", 18.4, 1.04, parent=rb, depth=0.04)
appear(rb, sec(33.6), sec(43.6), dur=6)
for r in range(1, 8):
    t0 = 34.0 + 1.25 * (r - 1)
    kf(rb, "location", sec(t0), (0, 4 - r, TH + 0.06), 'BEZIER')
    kf(rb, "location", sec(t0) + 18, (0, 4 - r, TH + 0.06), 'BEZIER')
    num = _text("Period %d" % r, str(r), (-10.15, 4 - r, 0.1), 0.55, M["gold"], rot=(0, 0, 0), weight="semibold")
    num.parent = tb.root
    appear(num, sec(t0 + 0.2), sec(54.6), dur=6)

# ---- E. groups: a tall frame visits the 8 main columns; IA ... VIIIA appear on top ----
cb = empty("Col Bar", (tb.xy(1).x, 0, TH + 0.06), tb.root)
frame_box("Col Bar Box", 1.04, 7.1, parent=cb, depth=0.04)
appear(cb, sec(44.6), sec(54.4), dur=6)
for k, c in enumerate(A_COLS):
    t0 = 45.0 + 1.1 * k
    x = (c - 9.5) * P
    kf(cb, "location", sec(t0), (x, 0, TH + 0.06), 'BEZIER')
    kf(cb, "location", sec(t0) + 16, (x, 0, TH + 0.06), 'BEZIER')
    top_row = 1 if c in (1, 18) else 2
    g = _text("Group %d" % c, GROUP_NAME[c], (x, 4 - top_row + 0.74, 0.1), 0.44, M["gold"], rot=(0, 0, 0),
              weight="semibold")
    g.parent = tb.root
    appear(g, sec(t0 + 0.2), sec(54.6), dur=6)

# ---- F. periodic law: the alkali metals step forward one after another (hydrogen is not one of them) ----
ALK = [3, 11, 19, 37, 55, 87]
for k, z in enumerate(ALK):
    t = tb.T[z]["t"]
    f = sec(61.2 + 0.55 * k)
    kf(t, "scale", f, (1, 1, 1), 'BEZIER')
    kf(t, "scale", f + 10, (1.3, 1.3, 1.3), 'BEZIER')
    kf(t, "scale", sec(66.4), (1.3, 1.3, 1.3), 'BEZIER')
    kf(t, "scale", sec(66.4) + 10, (1, 1, 1), 'BEZIER')
big("Lbl Alike", "alike!", Vector((-6.0, -0.6, 3.0)), 62.0, 66.6, mat=M["gold"], size=0.6)
# the repeat: a spark runs along the elements in order; every time it reaches the first column it flashes
spark = sphere("Spark", 0.16, M["flash"], tb.xy(1) + Vector((0, 0, TH + 0.2)), tb.root, 16, 8)
appear(spark, sec(55.6), sec(60.8), s=(0.16,) * 3)
path = [1, 2, 3, 10, 11, 18, 19, 36, 37, 54, 55]
tt = 55.8
for a, b in zip(path, path[1:]):
    kf(spark, "location", sec(tt), tb.xy(a) + Vector((0, 0, TH + 0.2)), 'LINEAR')
    tt += 0.25 if place(a)[0] != place(b)[0] else 0.42
    kf(spark, "location", sec(tt), tb.xy(b) + Vector((0, 0, TH + 0.2)), 'LINEAR')
    if place(b)[1] == 1:
        tb.pulse(b, sec(tt), 1.35, 12)

# ---- G. metals / non-metals / metalloids: the others step back ----
METALS = [z for z in ALL if category(z) in ("alkali", "alkaline", "transition", "metal", "lanthanide", "actinide")]
NONMET = [z for z in ALL if category(z) in ("nonmetal", "halogen", "noble")]
MLOID = [z for z in ALL if category(z) == "metalloid"]


def focus_seq(spans, small=0.45, dur=10):
    for z in ALL:
        t = tb.T[z]["t"]
        prev = 1.0
        for zs, f0, f1 in spans:
            want = 1.0 if z in zs else small
            kf(t, "scale", f0, (prev,) * 3, 'BEZIER')
            kf(t, "scale", f0 + dur, (want,) * 3, 'BEZIER')
            prev = want
        kf(t, "scale", spans[-1][2], (prev,) * 3, 'BEZIER')
        kf(t, "scale", spans[-1][2] + dur, (1,) * 3, 'BEZIER')


focus_seq([(set(METALS), sec(67.6), sec(71.5)), (set(NONMET), sec(71.5), sec(75.8)), (set(MLOID), sec(75.8), sec(79.6))])
big("Lbl Metals", "METALS", Vector((-2.5, -0.6, 2.2)), 68.2, 71.4, mat=M["cyan"], size=0.7)
big("Lbl Nonmetals", "NON-METALS", Vector((2.6, -0.6, 3.1)), 72.2, 75.7, mat=M["green"], size=0.6)
big("Lbl Metalloids", "METALLOIDS", tb.world(14) + Vector((-4.2, -0.5, 1.0)), 76.4, 79.5,
    mat=mat_emit("Lbl Lime", CAT_RGB["metalloid"], 2.2), size=0.6)

# ---- H. fun facts: a J tile looks for a place and falls away; astatine glows ----
jt = empty("J Tile", (-2.0, 0.2, 2.0), tb.root)
jb = bpy.data.objects.new(N("J Tile Body"), tile_mesh("plain"))
put(jb, "Models")
jb.parent = jt
jb.scale = (1, 1, TH)
js = _text("J Tile Sym", "J", (0, 0, TH + 0.01), 0.46, tile_mats()["sym"], rot=(0, 0, 0), weight="semibold")
js.parent = jt
appear(jt, sec(80.6), sec(85.8), dur=8, s=(1.6,) * 3)
for t, p, r in ((80.6, (-6.0, 4.5, 1.5), 0.0), (82.0, (-2.0, 2.0, 1.5), 0.0), (83.0, (2.0, 2.0, 1.5), 0.0),
                (84.0, (0.0, 2.2, 1.5), 0.0), (84.8, (0.4, -2.0, 2.5), -1.2), (85.8, (0.8, -7.0, 3.0), -2.6)):
    kf(jt, "location", sec(t), p, 'BEZIER')
    kf(jt, "rotation_euler", sec(t), (0, 0, r), 'BEZIER')
big("Lbl NoJ", "✗  no place for J", (0, -0.6, 3.6), 82.4, 85.8, mat=M["red"], size=0.55)
fr, _ = walker(tb, "At Frame", [85], 86.4, t_out=91.8)
kf(tb.T[85]["t"], "scale", sec(86.6), (1, 1, 1), 'BEZIER')
kf(tb.T[85]["t"], "scale", sec(86.6) + 12, (1.5, 1.5, 1.5), 'BEZIER')
kf(tb.T[85]["t"], "scale", sec(91.6), (1.5, 1.5, 1.5), 'BEZIER')
kf(tb.T[85]["t"], "scale", sec(91.6) + 10, (1, 1, 1), 'BEZIER')
big("Lbl At", "Astatine (At): only ~28 g on Earth", Vector((-1.6, -0.6, 2.4)), 87.0, 91.8, mat=M["gold"],
    size=0.5)
# the lanthanide / actinide rows hide during the close shot (they would sit under the caption)
for z in ALL:
    if place(z)[0] >= 8:
        t = tb.T[z]["t"]
        kf(t, "scale", sec(80) - 1, (1, 1, 1), 'CONSTANT')
        kf(t, "scale", sec(80), (0, 0, 0), 'CONSTANT')
        kf(t, "scale", sec(92) - 1, (0, 0, 0), 'CONSTANT')
        kf(t, "scale", sec(92), (1, 1, 1), 'CONSTANT')
finish_film()
