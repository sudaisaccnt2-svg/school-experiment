# ---- Film 311: Electronegativity (textbook pp.83-85: 3.2.5, polar / non-polar, factors, Pauling scale, Fig 3.8,
# Test Yourself, Example 3.3, Practice 3.4) ----
# bsend.py common.py p2/lib.py u3/u3lib.py u3/f311_electroneg.py
start_film("311", "311 Electronegativity", 106.0)
END = scene.frame_end
SA, SB, SF, SD, SC = (Vector((0, 0, 0)), Vector((40, 0, 0)), Vector((80, 0, 0)), Vector((120, 0, 0)),
                      Vector((170, 0, 0)))

shot("Cam HH", 0, 14, SA + Vector((0, 0, -0.1)), dist=13)
shot("Cam HCl", 14, 28, SB + Vector((0, 0, -0.2)), dist=14)
shot("Cam FCs", 28, 40, SF + Vector((0, 0, -0.4)), dist=15)
shot("Cam Scale", 40, 52, SD + Vector((0, 0, -0.6)), dist=15)
shot("Cam City", 52, 100, SC + Vector((0, -0.6, 0.4)), dist=16.5, pitch=1.0)
shot("Cam End", 100, None, SC + Vector((0, -0.6, 0.4)), dist=16.5, pitch=1.0)
for name, t in (("Tug of war", 0), ("Polar bond", 14), ("Strong pullers", 28), ("Pauling scale", 40), ("Fig 3.8", 52),
                ("Example 3.3", 80)):
    act(name, sec(t))

caps([
    ("A1", "Electronegativity: a tug of war", "How strongly an atom pulls the SHARED pair of electrons to itself", 0.1, 7),
    ("A2", "Equal pull → a non-polar bond", "In H₂ both atoms pull the same: the pair stays in the middle", 7, 14),
    ("B1", "H–Cl: chlorine pulls harder", "The shared pair slides toward chlorine …", 14, 21),
    ("B2", "Unequal pull → a polar bond", "Different electronegativities make a POLAR covalent bond (HCl)", 21, 28),
    ("C1", "What makes a strong puller?", "More protons, a smaller atom, less shielding (and stable full shells)", 28, 34),
    ("C2", "Fluorine against cesium", "Small fluorine wins easily; big, well-shielded cesium hardly pulls", 34, 40),
    ("D1", "Pauling's scale", "He gave every element a number from bond energies", 40, 46),
    ("D2", "F 4.0 is the highest, Cs 0.7 the lowest", "Oxygen is 3.5", 46, 52),
    ("E1", "Fig 3.8: electronegativity as bars", "Taller bar = pulls shared electrons harder", 52, 62),
    ("E2", "Across a period: UP.  Down a group: DOWN.", "Smaller atoms pull harder; new shells shield and pull less", 62, 70),
    ("E3", "Test Yourself: where is cesium (0.7)?", "Bottom left: the least electronegative", 70, 75),
    ("E4", "Which group is highest?", "Group VIIA, the halogens: the top right corner (F 4.0)", 75, 80),
    ("F1", "Example 3.3: which set is more alike?", "(a) N, P, As      or      (b) Li, C, F", 80, 86),
    ("F2", "Answer: (a) N, P, As", "They are in the SAME GROUP (VA). Li, C, F are only in the same period.", 86, 93),
    ("F3", "Practice 3.4: S like Se or like Cl?", "Like selenium: S and Se are in the same group (VIA)", 93, 100),
    ("G", "Next: All the trends & key points  →", "The whole chapter on one table", 100),
])
PULL = mat_emit("Pull Red", (1.0, 0.3, 0.25), 3.0)
PAIR = M["Valence"] if "Valence" in M else mat_emit("Valence Electron", (1.0, 0.75, 0.3), 4.0)
NUC = mat_emit("Nucleus Dot", (1.0, 0.35, 0.3), 3.0)


def tug(name, c, ra, rb, rgba, rgbb, t0, t1, shift_t=None, shift=0.0, pa=0.04, pb=0.04, sa="", sb=""):
    """Two overlapping atoms A (left) and B (right) with the shared pair between them; red arrows show each pull.
    At shift_t the pair slides `shift` units toward B and B's arrow thickens."""
    c = Vector(c)
    d = (ra + rb) * 0.78
    pa_c, pb_c = c + Vector((-d / 2, 0, 0)), c + Vector((d / 2, 0, 0))
    for tag, p, r, rgb, t in (("A", pa_c, ra, rgba, t0), ("B", pb_c, rb, rgbb, t0 + 0.4)):
        s = sphere("%s %s" % (name, tag), r, mat_emit("%s %s Cloud" % (name, tag), rgb, 1.1, alpha=0.38),
                   p + Vector((0, 0.3, 0)), None, 48, 24)
        appear(s, sec(t), sec(t1), dur=10, s=(r,) * 3)
        n = sphere("%s %s Nuc" % (name, tag), 0.1, NUC, p + Vector((0, -r * 0.7, 0)), None, 12, 6)
        appear(n, sec(t), sec(t1), s=(0.1,) * 3)
    mid = (pa_c + pb_c) / 2 + Vector((0, -max(ra, rb) - 0.2, 0))
    pair = empty(name + " Pair", mid)
    for k in (-1, 1):
        e = sphere("%s Pair e%d" % (name, k + 1), 0.13, PAIR, (0, 0, 0.17 * k), pair, 16, 8)
    appear(pair, sec(t0 + 1.0), sec(t1), dur=8)
    arrows = []
    for tag, p, th, sgn in (("A", pa_c, pa, -1), ("B", pb_c, pb, 1)):
        L = abs((p - mid).x) - 0.25
        a = arrow("%s Pull %s" % (name, tag), max(L, 0.4), PULL, pair, (0, 0, 0.45), (0, 0, 0 if sgn > 0 else math.pi),
                  r=th, head=0.2 + 2 * th)
        appear(a, sec(t0 + 1.6), sec(t1), dur=8)
        arrows.append(a)
    if shift_t is not None:
        kf(pair, "location", sec(shift_t), mid, 'BEZIER')
        kf(pair, "location", sec(shift_t + 1.6), mid + Vector((shift, 0, 0)), 'BEZIER')
    for tag, s_, p in (("A", sa, pa_c), ("B", sb, pb_c)):
        if s_:
            r = ra if tag == "A" else rb
            t = _text("%s %s Sym" % (name, tag), s_, p + Vector((0, -r - 0.4, -r - 0.55)), 0.6, M["white"],
                      weight="semibold")
            shadow(t)
            appear(t, sec(t0 + 0.4), sec(t1))
    return pair, arrows


# ---- A. H-H: equal pull ----
tug("HH", SA + Vector((0, 0, 0.6)), 1.25, 1.25, (0.35, 0.65, 1.0), (0.35, 0.65, 1.0), 0.4, 13.8, pa=0.07, pb=0.07,
    sa="H", sb="H")
big("Lbl Equal", "equal pull", SA + Vector((0, -0.6, 2.45)), 8.0, 13.8, mat=M["green"], size=0.5)
# ---- B. H-Cl: the pair slides toward Cl ----
pair, arr = tug("HCl", SB + Vector((-0.3, 0, 0.6)), 0.95, 1.55, (0.35, 0.65, 1.0), (0.45, 0.95, 0.5), 14.4, 27.8,
                shift_t=17.0, shift=0.9, pa=0.03, pb=0.1, sa="H", sb="Cl")
big("Lbl Polar", "polar", SB + Vector((0.5, -0.6, 2.75)), 21.6, 27.8, mat=M["gold"], size=0.55)
# ---- C. F vs Cs: the pair goes almost all the way to fluorine ----
tug("FCs", SF + Vector((0.6, 0, 0.6)), 0.85, 1.7, (0.75, 0.95, 0.55), (1.0, 0.45, 0.35), 28.4, 39.8, shift_t=31.0,
    shift=-1.2, pa=0.11, pb=0.025, sa="F", sb="Cs")

# ---- D. Pauling's scale: a ruler 0-4 with Cs, O and F riding to their values ----
RU = SD + Vector((-5.0, 0, -0.4))
L = 10.0
rul = box("Ruler", (L + 0.6, 0.25, 0.18), mat_pbr("Ruler", (0.7, 0.75, 0.85), metallic=0.6, roughness=0.3),
          RU + Vector((L / 2, 0, 0)))
appear(rul, sec(40.4), dur=10)
for v in range(5):
    tk = box("Tick %d" % v, (0.05, 0.27, 0.5), M["gold"], RU + Vector((v * L / 4, -0.02, 0.25)))
    appear(tk, sec(40.8 + 0.2 * v))
    t = _text("Tick %d Num" % v, str(v), RU + Vector((v * L / 4, -0.3, -0.75)), 0.5, M["gold"], weight="semibold")
    appear(t, sec(40.9 + 0.2 * v))
scl = Table("Scale", SD, zs=[55, 8, 9], numbers=False)
for k, z in enumerate((55, 8, 9)):
    t = scl.T[z]["t"]
    t.scale = (1.3,) * 3
    x = RU.x - SD.x + EN[SYM[z]] * L / 4
    a, b = Vector((-6.5, 2.0 + 0.0 * k, 0)), Vector((x, 1.6, 0))
    t.location = a
    appear(t, sec(41.8 + 0.6 * k), dur=8, s=(1.3,) * 3)
    kf(t, "location", sec(43.0 + 1.2 * k), a, 'BEZIER')
    kf(t, "location", sec(44.4 + 1.2 * k), b, 'BEZIER')
    v = _text("Scale %s Val" % SYM[z], "%.1f" % EN[SYM[z]], SD + Vector((x, -0.3, 2.75)), 0.5, M["white"],
              weight="semibold")
    appear(v, sec(44.6 + 1.2 * k))
    ln = line("Scale %s Drop" % SYM[z], [SD + Vector((x, -0.1, 0.9)), SD + Vector((x, -0.1, -0.2))], M["gold"], depth=0.025)
    appear(ln, sec(44.6 + 1.2 * k))

# ---- E/F. Fig 3.8 as a city of bars (book layout, values as printed) ----
ZS = [z for z in range(1, 87) if SYM[z] in EN]
city = Table("City", SC, orient='floor', zs=ZS)
for z in ZS:
    r, c = place(z)
    appear(city.T[z]["t"], sec(52.2) + r * 2 + c, dur=6)
    city.bar(z, sec(53.0 + 0.7 * (r - 1) + 0.03 * c), sec(54.6 + 0.7 * (r - 1) + 0.03 * c), EN[SYM[z]] * 0.8)
SET_A, SET_B = {7, 15, 33}, {3, 6, 9}
table_focus(city, [({55}, sec(70.2), sec(75)), ({9, 17, 35, 53, 85}, sec(75), sec(80)), (SET_A, sec(80.4), sec(83.2)),
                   (SET_B, sec(83.2), sec(86)), (SET_A, sec(86), sec(93)), ({16, 34, 17}, sec(93.2), sec(99.8))],
            small=0.35)
for k, z in enumerate((9, 17, 35, 53, 85)):
    city.pulse(z, sec(76.0 + 0.4 * k), 1.3, 12)
fr = empty("Se Frame", city.xy(34) + Vector((0, 0, EN["Se"] * 0.8 + 0.2)), city.root)
frame_box("Se Frame Box", 1.15, 1.15, parent=fr, depth=0.05)
appear(fr, sec(96.0), sec(99.8), dur=6)
big("Lbl Cs", "Cs 0.7", SC + Vector((-7.3, -4.0, 1.4)), 71.0, 74.8, mat=M["cyan"], size=0.6)
big("Lbl F", "F 4.0", SC + Vector((7.5, 1.0, 4.2)), 76.0, 79.8, mat=M["gold"], size=0.6)
big("Lbl SameGroup", "same group ✓", SC + Vector((2.2, -2.5, 3.0)), 87.0, 92.8, mat=M["green"], size=0.55)
finish_film()
