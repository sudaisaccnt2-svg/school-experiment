# ---- Film 303: Groups, the families (textbook pp.69-70: Fig 3.2, the 8 families, halogens, noble gases) ----
# bsend.py common.py p2/lib.py u3/u3lib.py u3/f303_groups.py
start_film("303", "303 Groups and Families", 88.0)
END = scene.frame_end
tb = Table("Tab", (0, 0, 0))
ALL = tb.zs
TT = (0, 0, -2.45)
SB, SB2, SD, SE = Vector((60, 0, 0)), Vector((90, 0, 0)), Vector((120, 0, 0)), Vector((150, 0, 0))

shot("Cam Columns", 0, 9, TT, dist=25)
shot("Cam Group1", 9, 15.5, SB + Vector((0, 0, -0.6)), dist=17)
shot("Cam Group7", 15.5, 21, SB2 + Vector((0, 0, -0.6)), dist=13)
shot("Cam Families", 21, 55, (0, 0, -0.95), dist=22)
shot("Cam Halogen", 55, 68, SD + Vector((0, 0, -0.75)), dist=14)
shot("Cam Noble", 68, 81, SE + Vector((0, 0, -0.9)), dist=13)
shot("Cam End", 81, None, (0, 0, -0.95), dist=22)
for name, t in (("Columns", 0), ("Fig 3.2", 9), ("Families", 21), ("Halogens", 55), ("Noble gases", 68)):
    act(name, sec(t))

FAM = [(1, "Alkali metals", "1 outer electron", "Very reactive metals: Li, Na, K … (hydrogen is not one of them)"),
       (2, "Alkaline earth metals", "2 outer electrons", "Be, Mg, Ca …: less reactive than the alkali metals"),
       (13, "Boron family", "3 outer electrons", "Group IIIA: B, Al, Ga …"),
       (14, "Carbon family", "4 outer electrons", "Group IVA: C, Si, Ge …"),
       (15, "Nitrogen family", "5 outer electrons", "Group VA: N, P, As …"),
       (16, "Oxygen family", "6 outer electrons", "Group VIA: O, S, Se …"),
       (17, "Halogens", "7 outer electrons", "They need just ONE more. Very electronegative non-metals."),
       (18, "Noble gases", "full outer shell", "8 outer electrons (helium 2): they hardly react at all")]
FT0, FDT = 21.4, 4.15
caps([
    ("A", "Groups: the columns", "The 8 main groups are numbered IA to VIIIA", 0.1, 9),
    ("B", "Same group = same outer electrons", "Group IA: H, Li, Na, K each have 1 outer (valence) electron", 9, 15.5),
    ("B2", "Group number = outer electrons", "Group VIIA: fluorine and chlorine each have 7", 15.5, 21),
] + [("F%d" % k, "%s: %s" % (GROUP_NAME[c], name), line, FT0 + FDT * k - 0.4, FT0 + FDT * (k + 1) - 0.4)
     for k, (c, name, cnt, line) in enumerate(FAM)] + [
    ("D1", "Halogens grab one electron", "Chlorine has 7 outer electrons. One more fills the shell …", 55, 61.5),
    ("D2", "7 + 1 = 8: a full outer shell", "Now it is a chloride ion, Cl⁻", 61.5, 68),
    ("E1", "Noble gases are already full", "Neon has 8 outer electrons: there is no room", 68, 74.5),
    ("E2", "So they hardly ever react", "That is why the noble gases are called INERT", 74.5, 81),
    ("G", "Next: Blocks s, p, d, f  →", "The table cut into four colourful blocks", 81),
])

# ---- A. a tall frame visits the 8 main columns; IA ... VIIIA on top ----
for z in ALL:
    appear(tb.T[z]["t"], sec(0.2) + place(z)[1] + 2 * place(z)[0], dur=8)
cb = empty("Col Bar", (tb.xy(1).x, 0, TH + 0.06), tb.root)
frame_box("Col Bar Box", 1.04, 7.1, parent=cb, depth=0.04)
appear(cb, sec(1.6), sec(8.8), dur=6)
for k, c in enumerate(A_COLS):
    t0 = 2.0 + 0.8 * k
    x = (c - 9.5) * P
    kf(cb, "location", sec(t0), (x, 0, TH + 0.06), 'BEZIER')
    kf(cb, "location", sec(t0) + 12, (x, 0, TH + 0.06), 'BEZIER')
    g = _text("Group %d" % c, GROUP_NAME[c], (x, 4 - (1 if c in (1, 18) else 2) + 0.74, 0.1), 0.44, M["gold"],
              rot=(0, 0, 0), weight="semibold")
    g.parent = tb.root
    appear(g, sec(t0 + 0.2), sec(54.8), dur=6)

# ---- B. Fig 3.2: H, Li, Na, K: one gold outer electron each; then F and Cl: seven each ----
for k, (z, x) in enumerate(((1, -6.2), (3, -3.3), (11, 0.4), (19, 4.7))):
    t0 = 9.4 + 1.2 * k
    vatom("G1 %s" % SYM[z], z, SB + Vector((x, 0, 0.5)), sec(t0), [(sec(t0), sec(t0 + 1.2 if k < 3 else 15.4))],
          r0=0.42, dr=0.42, e_r=0.12, nuc_r=0.085)
    sy = _text("G1 %s Sym" % SYM[z], SYM[z], SB + Vector((x, -0.3, -1.75)), 0.6, M["white"], weight="semibold")
    appear(sy, sec(t0 + 0.3), sec(15.4))
big("Lbl One", "1 outer electron each", SB + Vector((-0.8, -0.6, 3.0)), 11.0, 15.4, mat=M["gold"], size=0.6)
for k, (z, x) in enumerate(((9, -2.4), (17, 2.2))):
    t0 = 15.9 + 1.4 * k
    vatom("G7 %s" % SYM[z], z, SB2 + Vector((x, 0, 0.5)), sec(t0), [(sec(t0), sec(t0 + 1.4 if k == 0 else 20.8))],
          r0=0.42, dr=0.5, e_r=0.12, nuc_r=0.085)
    sy = _text("G7 %s Sym" % SYM[z], SYM[z], SB2 + Vector((x, -0.3, -1.55)), 0.55, M["white"], weight="semibold")
    appear(sy, sec(t0 + 0.3), sec(20.8))
big("Lbl Seven", "7 outer electrons each", SB2 + Vector((0, -0.6, 2.05)), 17.2, 20.8, mat=M["gold"], size=0.5)

# ---- C. the families, one column at a time ----
spans = []
for k, (c, name, cnt, line) in enumerate(FAM):
    t0 = FT0 + FDT * k
    zs = {z for z in ALL if place(z)[1] == c and place(z)[0] <= 7 and not (c == 1 and z == 1)}
    spans.append((zs, sec(t0), sec(t0 + FDT)))
    big("Lbl Fam %d" % k, name, Vector((0, -0.6, 2.9)), t0 + 0.2, t0 + FDT - 0.5, mat=tile_mats()[category(sorted(zs)[1])][1],
        size=0.75)
    big("Lbl Cnt %d" % k, cnt, Vector((0, -0.6, 1.85)), t0 + 0.6, t0 + FDT - 0.5, mat=M["gold"], size=0.5)
    for i, z in enumerate(sorted(zs)):
        tb.pulse(z, sec(t0 + 0.8 + 0.18 * i), 1.25, 10)
spans[-1] = (spans[-1][0], spans[-1][1], sec(54.6))
MAIN = [z for z in ALL if place(z)[0] <= 7]
table_focus(tb, spans, zs=MAIN)
for z in ALL:                    # the lanthanide / actinide rows are not part of this story: they leave
    if place(z)[0] >= 8:
        pop_out(tb.T[z]["t"], sec(20.4) + (z % 20), 8, (1, 1, 1))

# ---- D. chlorine (2, 8, 7) catches the 8th outer electron ----
g, radii, outer = vatom("Cl", 17, SD + Vector((0, 0, 0.55)), sec(55.4), [(sec(55.4), sec(67.8))], counts=[2, 8, 8],
                        r0=0.62, dr=0.62, e_r=0.15, nuc_r=0.1, rate=0.02)
inc = outer[0]
home = inc.location.copy()
hide_until(inc, sec(58.6))
kf(inc, "location", sec(58.6), home * 4.2, 'BEZIER')
kf(inc, "location", sec(60.6), home, 'BEZIER')
flash("Cl Flash", SD + Vector((0, -0.6, 0.55)), sec(60.6), 2.6)
big("Lbl Cl Ion", "Cl⁻", SD + Vector((2.9, -0.6, 1.9)), 61.8, 67.8, mat=M["gold"], size=0.8)
big("Lbl Cl 8", "7 + 1 = 8  ✓", SD + Vector((0, -0.6, -2.0)), 62.4, 67.8, mat=M["green"], size=0.55)

# ---- E. neon (2, 8): an electron comes in and bounces off ----
vatom("Ne", 10, SE + Vector((0, 0, 0.55)), sec(68.4), [(sec(68.4), sec(80.8))], r0=0.8, dr=0.75, e_r=0.15, nuc_r=0.1,
      rate=0.02)
b = electron("Ne Visitor", None, SE + Vector((-6, -0.3, 1.8)), 0.15)
hide_until(b, sec(70.6))
for t, p in ((70.6, (-6.0, -0.3, 1.8)), (72.0, (-1.75, -0.3, 1.25)), (73.4, (-5.5, -0.3, 3.4)), (74.4, (-8, -0.3, 4.4))):
    kf(b, "location", sec(t), SE + Vector(p), 'BEZIER' if t != 72.0 else 'LINEAR')
pulses("Ne Bounce", SE + Vector((-1.6, -0.3, 1.2)), None, [72.0], r=0.5, mat=M["red"])
big("Lbl Ne Full", "full  ✓", SE + Vector((2.3, -0.6, 2.4)), 72.6, 80.8, mat=M["green"], size=0.6)
big("Lbl Ne No", "✗ no room", SE + Vector((-3.6, -0.6, -1.4)), 72.4, 76.0, mat=M["red"], size=0.5)
finish_film()
