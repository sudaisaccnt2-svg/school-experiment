# ---- Film 312: All the trends & key points (textbook pp.86-87: Fig 3.9, Key Points) ----
# bsend.py common.py p2/lib.py u3/u3lib.py u3/f312_trends.py
start_film("312", "312 Trends and Key Points", 104.0)
END = scene.frame_end
SA, SB, SD, SE = Vector((0, 0, 0)), Vector((50, 0, 0)), Vector((90, 0, 0)), Vector((130, 0, 0))
TT = SA + Vector((0, 0, -2.0))

shot("Cam Table", 0, 30, TT, dist=30)
shot("Cam Atoms", 30, 44, SB + Vector((0, 0, -0.5)), dist=15)
shot("Cam ArK", 44, 54, SD + Vector((0, 0, -0.6)), dist=13)
shot("Cam Groups", 54, 62, TT, dist=30)
shot("Cam Blocks", 62, 86, SE + Vector((0, 0, -2.0)), dist=30)
shot("Cam Repeat", 86, None, TT, dist=30)
for name, t in (("Fig 3.9", 0), ("Why", 30), ("Key points", 44), ("Blocks", 62), ("Periodicity", 86)):
    act(name, sec(t))

caps([
    ("A1", "All the trends on one table", "Fig 3.9: what changes across a period and down a group", 0.1, 8),
    ("A2", "Across a period →", "Ionization energy, electron affinity, electronegativity all go UP", 8, 16),
    ("A3", "Down a group ↓", "Ionization energy, electron affinity, electronegativity all go DOWN", 16, 24),
    ("A4", "The two corners", "Cesium: biggest, loses electrons easily.  Fluorine: pulls hardest (EN 4.0)", 24, 30),
    ("B1", "Across: the nuclear charge wins", "Same shells, more protons → a smaller atom that holds on tighter", 30, 37),
    ("B2", "Down: the shielding wins", "A new shell → a bigger atom, the outer electron is held loosely", 37, 44),
    ("C1", "Mendeleev: by atomic WEIGHT", "Then potassium would come before argon … in the noble gas family ✗", 44, 49),
    ("C2", "Modern table: by atomic NUMBER", "Argon 18, potassium 19 ✓  (modern periodic law)", 49, 54),
    ("D", "7 periods and 8 main groups", "Rows are periods, the A-group columns are the main families", 54, 62),
    ("E1", "Blocks s, p, d, f", "Grouped by the outermost electrons and the electronic configuration", 62, 70),
    ("E2", "Transition elements: the d-block", "They show VARIABLE VALENCY: iron can make Fe²⁺ or Fe³⁺", 70, 78),
    ("E3", "Lanthanides and actinides", "They come after lanthanum (period 6) and actinium (period 7)", 78, 86),
    ("F1", "Periodicity of properties", "Properties repeat after a certain interval: every family behaves alike", 86, 96),
    ("G", "Next: Exercise, multiple choice  →", "Ten questions, answered with pictures", 96),
])

# ---- A. Fig 3.9 on the table ----
tb = Table("Tab", SA)
for z in tb.zs:
    appear(tb.T[z]["t"], sec(0.4) + place(z)[1] + place(z)[0] * 2, dur=6)
across = arrow("Across Arrow", 17.0, M["gold"], None, SA + Vector((-8.5, -0.3, 4.2)), r=0.07, head=0.5)
appear(across, sec(8.4), sec(29.8))
big("Lbl Up", "IE  EA  EN  ↑", SA + Vector((-2.0, -0.6, 2.2)), 9.0, 15.8, mat=M["gold"], size=1.0)
for k, z in enumerate(range(11, 19)):
    tb.pulse(z, sec(10.0 + 0.4 * k), 1.3, 12)
down = arrow("Down Arrow", 6.2, M["cyan"], None, SA + Vector((-11.0, -0.3, 3.2)), (0, math.pi / 2, 0), r=0.07,
             head=0.5)
appear(down, sec(16.4), sec(29.8))
big("Lbl Down", "IE  EA  EN  ↓", SA + Vector((-2.0, -0.6, 2.2)), 17.0, 23.8, mat=M["cyan"], size=1.0)
for k, z in enumerate((3, 11, 19, 37, 55, 87)):
    tb.pulse(z, sec(18.0 + 0.5 * k), 1.3, 12)
table_focus(tb, [({55, 9}, sec(24.2), sec(29.8))], small=0.45)
big("Lbl Cs", "Cs ↑", SA + Vector((-8.5, -0.6, -4.3)), 24.8, 29.8, mat=M["cyan"], size=0.8)
big("Lbl F", "F: pulls hardest →", SA + Vector((-1.0, -0.6, 2.2)), 25.6, 29.8, mat=M["gold"], size=0.8)

# ---- B. why: Na -> Cl (more protons, smaller), then Na vs K (new shell, bigger) ----
vatom("B Na", 11, SB + Vector((-3.6, 0, 0.5)), sec(30.4), [], r0=0.45, dr=0.55, e_r=0.11, nuc_r=0.07, f_out=sec(43.8))
vatom("B Cl", 17, SB + Vector((3.6, 0, 0.5)), sec(31.6), [], r0=0.4, dr=0.42, e_r=0.11, nuc_r=0.08, f_out=sec(36.8))
vatom("B K", 19, SB + Vector((3.6, 0, 0.5)), sec(37.4), [], r0=0.45, dr=0.55, e_r=0.1, nuc_r=0.07, f_out=sec(43.8))
for nm, txt, x, t0, t1, mat in (("Na", "11 protons", -3.6, 30.8, 43.8, M["white"]),
                                ("Cl", "17 protons", 3.6, 32.0, 36.8, M["gold"]),
                                ("K", "a new shell", 3.6, 37.8, 43.8, M["cyan"])):
    t = _text("B %s Sym" % nm, nm, SB + Vector((x, -0.3, -2.0)), 0.6, M["white"], weight="semibold")
    shadow(t)
    appear(t, sec(t0), sec(t1))
    big("Lbl B %s" % nm, txt, SB + Vector((x, -0.6, 2.75)), t0 + 0.4, t1, mat=mat, size=0.45)

# ---- C. Mendeleev (atomic weight) vs modern (atomic number): argon and potassium swap ----
ak = Table("AK", SD, zs=[18, 19], numbers=False)
pos = {19: Vector((-1.6, 0.6, 0)), 18: Vector((1.6, 0.6, 0))}
for k, z in enumerate((19, 18)):
    t = ak.T[z]["t"]
    t.location = pos[z]
    appear(t, sec(44.4 + 0.5 * k), dur=8, s=(2.2,) * 3)
    w = _text("AK %s W" % SYM[z], "%.1f" % (39.1 if z == 19 else 39.9), SD + Vector((pos[z].x, -0.3, -1.3)), 0.55,
              M["white"], weight="semibold")
    appear(w, sec(45.0 + 0.5 * k), sec(48.8))
    end = pos[37 - z]
    mid = (pos[z] + end) / 2 + Vector((0, 1.8 if z == 19 else -1.8, 0.6))
    kf(t, "location", sec(49.2), pos[z], 'BEZIER')
    kf(t, "location", sec(50.0), mid, 'BEZIER')
    kf(t, "location", sec(50.8), end, 'BEZIER')
    n = _text("AK %s N" % SYM[z], str(z), SD + Vector((end.x, -0.3, -1.3)), 0.6, M["gold"], weight="semibold")
    appear(n, sec(51.2 + 0.3 * k))
big("Lbl Wrong", "✗", SD + Vector((0, -0.6, 2.9)), 46.6, 48.8, mat=M["red"], size=0.8)
big("Lbl Right", "✓", SD + Vector((0, -0.6, 2.9)), 51.8, 53.8, mat=M["green"], size=0.8)

# ---- D. 7 periods, 8 A groups (back on the big table) ----
for r in range(1, 8):
    t = _text("Per %d" % r, str(r), SA + Vector((-10.4, -0.3, 4 - r)), 0.75, M["gold"], weight="semibold")
    appear(t, sec(54.6 + 0.3 * r), sec(61.8))
for k, c in enumerate(A_COLS):
    t = _text("Grp %d" % k, GROUP_NAME[c], SA + Vector((c - 9.5, -0.3, 4.1)), 0.5,
              M["cyan"], weight="semibold")
    appear(t, sec(57.2 + 0.3 * k), sec(61.8))
    for z in [z for z in tb.zs if place(z)[1] == c and place(z)[0] <= 7]:
        tb.pulse(z, sec(57.4 + 0.3 * k + 0.08 * place(z)[0]), 1.25, 10)

# ---- E. blocks, transition elements, lanthanides & actinides ----
BK = lambda z: block(z, book=True)
bt = Table("Blk", SE, color=lambda z: "b_" + BK(z))
for z in bt.zs:
    appear(bt.T[z]["t"], sec(62.2) + place(z)[1] + place(z)[0] * 2, dur=6)
for k, (b, txt, p) in enumerate((("s", "s", (-8.5, -0.6, 4.4)), ("p", "p", (6.0, -0.6, 4.4)),
                                 ("d", "d", (-2.0, -0.6, 2.0)), ("f", "f", (-7.6, -0.6, -4.9)))):
    big("Lbl Blk %s" % b, txt, SE + Vector(p), 63.8 + 1.4 * k, 69.8, mat=mat_emit("Blk Lbl %s" % b, BLOCK_RGB[b], 2.6),
        size=1.2)
D_ZS = {z for z in bt.zs if BK(z) == "d"}
F_ZS = {z for z in bt.zs if place(z)[0] >= 8}
BLK = [{z for z in bt.zs if BK(z) == b} for b in "spdf"]
table_focus(bt, [(BLK[k], sec(63.6 + 1.4 * k), sec(65.0 + 1.4 * k)) for k in range(4)] + [(set(bt.zs), sec(69.2), sec(69.6)), (D_ZS, sec(70.2), sec(78)), (F_ZS | {57, 89}, sec(78), sec(85.8))], small=0.45)
bt.pulse(26, sec(72.4), 1.6, 20)
big("Lbl Fe", "Fe²⁺   Fe³⁺", SE + Vector((-2.0, -0.6, 2.2)), 72.6, 77.8, mat=M["gold"], size=0.9)
for z in (57, 89):
    bt.pulse(z, sec(79.0 + 1.2 * (z == 89)), 1.5, 16)
big("Lbl Lan", "lanthanides", SE + Vector((-8.4, -0.6, -4.45)), 79.4, 85.8, mat=M["gold"], size=0.55)
big("Lbl Act", "actinides", SE + Vector((-8.4, -0.6, -5.45)), 80.6, 85.8, mat=M["gold"], size=0.55)

# ---- F. periodicity: families light up one after another ----
FAM = [(3, 11, 19, 37, 55), (9, 17, 35, 53), (2, 10, 18, 36, 54)]
table_focus(tb, [(set(FAM[0]), sec(86.4), sec(89.6)), (set(FAM[1]), sec(89.6), sec(92.8)),
                 (set(FAM[2]), sec(92.8), sec(95.8))], small=0.45)
for k, fam in enumerate(FAM):
    for j, z in enumerate(fam):
        tb.pulse(z, sec(87.6 + 3.2 * k + 0.3 * j), 1.3, 10)
big("Lbl Alike", "same family, alike ✓", SA + Vector((-2.0, -0.6, 2.2)), 87.0, 95.8, mat=M["green"], size=0.85)
finish_film()
