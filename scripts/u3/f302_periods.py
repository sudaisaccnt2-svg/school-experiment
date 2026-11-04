# ---- Film 302: Periods, the rows (textbook pp.66, 68-69: Fig 3.1, period lengths, Scientific Information,
# valence electrons across a period, metallic -> non-metallic, Practice Problem 3.1) ----
# bsend.py common.py p2/lib.py u3/u3lib.py u3/f302_periods.py
start_film("302", "302 Periods", 106.0)
END = scene.frame_end
tb = Table("Tab", (0, 0, 0))
ALL = tb.zs
TT = (0, 0, -2.45)
SB, SE, SF = Vector((60, 0, 0)), Vector((100, 0, 0)), Vector((140, 0, 0))

shot("Cam Rows", 0, 10, TT, dist=25)
shot("Cam Shells", 10, 20, SB + Vector((0, 0, -0.2)), dist=15)
shot("Cam Row1", 20, 36.2, TT, dist=25)
shot("Cam Wide", 36.2, 44, (7.0, 0, -1.4), dist=37.5)
shot("Cam Row7", 44, 50, TT, dist=25)
shot("Cam Kinds", 50, 64, TT, dist=25)
shot("Cam Valence", 64, 80, SE + Vector((0, 0, -0.5)), dist=27)
shot("Cam Metal", 80, 92, SF + Vector((0, 0, -0.6)), dist=16)
shot("Cam Practice", 92, None, TT, dist=25)
for name, t in (("Rows", 0), ("Fig 3.1", 10), ("Lengths", 20), ("Kinds", 50), ("Valence e⁻", 64), ("Metal → non-metal", 80),
                ("Practice 3.1", 92)):
    act(name, sec(t))

caps([
    ("A", "Periods: the rows", "7 rows. What do the elements in one row share?", 0.1, 10),
    ("B", "Period number = number of shells", "H: 1 shell → period 1.  Li: 2 shells → period 2.  Na: 3 shells → period 3.", 10, 20),
    ("C1", "Period 1: only 2 elements", "Hydrogen and helium: the SHORTEST period", 20, 25.6),
    ("C2", "Periods 2 and 3: 8 each", "These are the SHORT periods", 25.6, 30.8),
    ("C3", "Periods 4 and 5: 18 each", "8 representative + 10 transition elements (Sc → Zn, Y → Cd)", 30.8, 36.2),
    ("C4", "Period 6: 32 elements!", "8 representative + 10 transition + 14 LANTHANIDES (they live below)", 36.2, 44),
    ("C5", "Period 7: like period 6", "Its 14 ACTINIDES sit in the bottom row", 44, 50),
    ("D1", "Representative elements", "All the s-block and p-block elements (the 8 main groups)", 50, 54.6),
    ("D2", "Transition elements", "The middle block: they show VARIABLE valency", 54.6, 59.2),
    ("D3", "Lanthanides and actinides", "14 after lanthanum (Ce → Lu) and 14 after actinium (Th → Lr)", 59.2, 64),
    ("E1", "Across a period: +1 outer electron", "Lithium has 1 outer (valence) electron …", 64, 69),
    ("E2", "… one more at every step", "Li 1, Be 2, B 3, C 4, N 5, O 6, F 7, Ne 8", 69, 80),
    ("F1", "Metal → non-metal", "Across a period, metallic properties fall and non-metallic ones rise", 80, 86),
    ("F2", "Period 3, left to right", "Na, Mg, Al are metals … P, S, Cl are non-metals", 86, 92),
    ("G1", "Practice 3.1: the second period", "First element: lithium (Li).  Last element: neon (Ne).", 92, 98.5),
    ("G2", "How many elements in period 2?", "Count them: 8", 98.5, 103),
    ("H", "Next: Groups  →", "The columns, and why their elements behave alike", 103),
])

# ---- A. the table builds row by row; period numbers on the left ----
for z in ALL:
    r = place(z)[0]
    appear(tb.T[z]["t"], sec(0.3 + (0.75 * (r - 1) if r <= 7 else 6.0)) + place(z)[1], dur=8)
for r in range(1, 8):
    num = _text("Period %d" % r, str(r), (-10.15, 4 - r, 0.1), 0.55, M["gold"], rot=(0, 0, 0), weight="semibold")
    num.parent = tb.root
    appear(num, sec(0.6 + 0.75 * (r - 1)), sec(35.9), dur=6)

# ---- B. Fig 3.1: H, Li, Na side by side; shells pop in, only the newest atom turns ----
for k, z in enumerate((1, 3, 11)):
    t0 = 10.6 + 2.6 * k
    vatom("Fig %s" % SYM[z], z, SB + Vector(((k - 1) * 4.6, 0, 0.6)), sec(t0), [(sec(t0), sec(t0 + 2.6 if k < 2 else 19.8))],
          r0=0.6, dr=0.5, e_r=0.13, nuc_r=0.12, gold_outer=False)
    big("Lbl Fig %d" % k, "%d shell%s" % (k + 1, "" if k == 0 else "s"), SB + Vector(((k - 1) * 4.6, -0.6, -1.75)),
        t0 + 0.8, 19.8, mat=M["cyan"], size=0.5)

# ---- C. row lengths: the chosen row stays big, the rest step back; a count on the right ----
R = {r: [z for z in ALL if place(z)[0] == r] for r in range(1, 10)}
spans = [(set(R[1]), sec(20.4), sec(25.6)), (set(R[2] + R[3]), sec(25.6), sec(30.8)),
         (set(R[4] + R[5]), sec(30.8), sec(36.2)), (set(R[6] + R[8]), sec(36.2), sec(44)),
         (set(R[7] + R[9]), sec(44), sec(49.7))]
# ---- D. the kinds of elements ----
REP = [z for z in ALL if block(z) in "sp"]
TRN = [z for z in ALL if block(z) == "d"]
FBL = [z for z in ALL if block(z) == "f"]
spans += [(set(REP), sec(50.2), sec(54.6)), (set(TRN), sec(54.6), sec(59.2)), (set(FBL), sec(59.2), sec(63.7)),
          (set(R[2]), sec(98.6), sec(102.9))]
table_focus(tb, spans)
for txt, r, t0, t1 in (("2", 1, 20.8, 25.5), ("8", 2, 26.0, 30.7), ("8", 3, 26.4, 30.7), ("18", 4, 31.2, 36.0),
                       ("18", 5, 31.6, 36.0), ("32", 7, 44.4, 49.6)):
    big("Lbl Count %d" % r, txt, Vector((10.4, -0.6, 4 - r - 0.15)), t0, t1, mat=M["gold"], size=0.6)
# period 6 unfolds: Hf → Rn slide right by 14 places, the lanthanides rise into the gap
for z in range(72, 87):
    t = tb.T[z]["t"]
    p = tb.xy(z)
    kf(t, "location", sec(37.0), p, 'BEZIER')
    kf(t, "location", sec(38.2), p + Vector((14 * P, 0, 0)), 'BEZIER')
    kf(t, "location", sec(42.6), p + Vector((14 * P, 0, 0)), 'BEZIER')
    kf(t, "location", sec(43.6), p, 'BEZIER')
for i, z in enumerate(range(58, 72)):
    t = tb.T[z]["t"]
    p = tb.xy(z)
    f = sec(38.4) + i
    kf(t, "location", f, p, 'BEZIER')
    kf(t, "location", f + 18, Vector((p.x, -2 * P, 0)), 'BEZIER')
    kf(t, "location", sec(42.4) + i, Vector((p.x, -2 * P, 0)), 'BEZIER')
    kf(t, "location", sec(42.4) + i + 18, p, 'BEZIER')
big("Lbl Count 6", "32 in one row", Vector((15.5, -0.6, 0.6)), 39.4, 42.6, mat=M["gold"], size=1.0)
big("Lbl Lanth", "14 lanthanides", Vector((3.5, -0.6, -0.8)), 39.6, 42.6, mat=mat_emit("Lbl Pink", CAT_RGB["lanthanide"], 2.4),
    size=0.9)

# ---- E. period 2: Li → Ne, the gold outer electrons go 1, 2, 3 … 8 (only the newest atom turns) ----
for k, z in enumerate(range(3, 11)):
    t0 = 64.5 + (0 if k == 0 else 4.5 + 1.25 * k)
    nxt = 64.5 + 4.5 + 1.25 * (k + 1) if k < 7 else 79.8
    x = (k - 3.5) * 2.75
    vatom("Per2 %s" % SYM[z], z, SE + Vector((x, 0, 0.9)), sec(t0), [(sec(t0), sec(nxt))], r0=0.42, dr=0.5,
          e_r=0.11, nuc_r=0.09)
    sy = _text("Per2 %s Sym" % SYM[z], SYM[z], SE + Vector((x, -0.3, -0.75)), 0.55, M["white"], weight="semibold")
    appear(sy, sec(t0 + 0.2), sec(79.8))
    nm = _text("Per2 %s Cnt" % SYM[z], str(k + 1), SE + Vector((x, -0.3, -1.55)), 0.6, M["gold"], weight="semibold")
    appear(nm, sec(t0 + 0.6), sec(79.8))

# ---- F. period 3 as a line of tiles: shiny metals on the left, non-metals on the right ----
row3 = Table("Row3", SF, zs=list(range(11, 19)))
for k, z in enumerate(range(11, 19)):
    t = row3.T[z]["t"]
    t.location = Vector(((k - 3.5) * 1.55, 0.55, 0))
    t.scale = (1.4,) * 3
    appear(t, sec(80.4 + 0.25 * k), dur=8, s=(1.4,) * 3)
grad = mat_emit("Metal To Nonmetal", (0.6, 0.75, 0.9), 1.4)
ar = arrow("Across Arrow", 11.2, grad, None, SF + Vector((-5.6, -0.2, -1.1)), r=0.05, head=0.4)
appear(ar, sec(82.0))
big("Lbl Metals", "metals", SF + Vector((-4.3, -0.6, 2.1)), 86.4, 91.8, mat=M["cyan"], size=0.55)
big("Lbl Nonmetals", "non-metals", SF + Vector((4.1, -0.6, 2.1)), 87.4, 91.8, mat=M["green"], size=0.55)
# shiny metal ball (left) and a dull yellow sulphur lump (right) under the arrow
shiny = sphere("Metal Ball", 0.42, mat_pbr("Shiny Metal", (0.85, 0.87, 0.9), metallic=1.0, roughness=0.12),
               SF + Vector((-4.3, 0, -2.0)), None, 32, 16)
appear(shiny, sec(86.6), s=(0.42,) * 3)
lump = blob("Sulphur Lump", (0.5, 0.42, 0.38), mat_pbr("Sulphur", (0.9, 0.78, 0.15), roughness=0.9),
            SF + Vector((4.3, 0, -2.0)), bump=0.25, seed=4)
appear(lump, sec(87.6))
for k, z in enumerate(range(11, 14)):
    row3.pulse(z, sec(86.4 + 0.35 * k))
for k, z in enumerate(range(15, 18)):
    row3.pulse(z, sec(87.4 + 0.35 * k))

# ---- G. Practice 3.1: the frame finds Li, then Ne; period 2 is counted tile by tile ----
walker(tb, "Practice Frame", [3, 10], 92.6, step=2.8, t_out=98.4)
for k, z in enumerate(R[2]):
    tb.pulse(z, sec(99.0 + 0.4 * k), 1.4, 12)
    n = _text("Count2 %d" % k, str(k + 1), tb.xy(z) + Vector((0, 0.66, 0.1)), 0.42, M["gold"], rot=(0, 0, 0),
              weight="semibold")
    n.parent = tb.root
    appear(n, sec(99.0 + 0.4 * k), sec(102.8), dur=6)
finish_film()
