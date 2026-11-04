# ---- Film 304: Blocks s, p, d, f (textbook pp.70-71: Fig 3.3, Example 3.1, Practice 3.2, Scientific Information) ----
# bsend.py common.py p2/lib.py u3/u3lib.py u3/f304_blocks.py
start_film("304", "304 Blocks s p d f", 118.0)
END = scene.frame_end
BK = lambda z: block(z, book=True)
tb = Table("Tab", (0, 0, 0), color=lambda z: "b_" + BK(z))
ALL = tb.zs
TT = (0, 0, -2.45)
SG = Vector((60, 0, 0))

shot("Cam Blocks", 0, 12, (0, 0, -2.75), dist=27)
shot("Cam SP", 12, 24, TT, dist=25)
shot("Cam DF", 24, 34, TT, dist=25)
shot("Cam Rep", 34, 40, TT, dist=25)
shot("Cam Example", 40, 94, TT, dist=25)
shot("Cam Practice", 94, 100, TT, dist=25)
shot("Cam Facts", 100, 106, SG + Vector((0, 0, -0.6)), dist=14)
shot("Cam Air", 106, 114, SG + Vector((30, 0, 0.35)), dist=19)
shot("Cam End", 114, None, TT, dist=25)
for name, t in (("Four blocks", 0), ("s and p", 12), ("d and f", 24), ("Example 3.1", 40), ("Practice 3.2", 94),
                ("Fun facts", 100)):
    act(name, sec(t))

EX = [("(i) The 5th element of the 1st transition series", "Sc, Ti, V, Cr, Mn → manganese (Mn)", [21, 22, 23, 24, 25]),
      ("(ii) The period 4 element in group VB", "Row 4, column VB → vanadium (V)", [19, 20, 21, 22, 23]),
      ("(iii) The last lanthanide", "Ce, Pr, Nd … Lu → lutetium (Lu)", list(range(58, 72))),
      ("(iv) The 7th transition element", "Sc, Ti, V, Cr, Mn, Fe, Co → cobalt (Co)", list(range(21, 28))),
      ("(v) The second actinide", "Th, then Pa → protactinium (Pa)", [90, 91]),
      ("(vi) The first element of group VIIIA", "Helium (He)", [10, 2]),
      ("(vii) The third halogen", "F, Cl, Br → bromine (Br)", [9, 17, 35]),
      ("(viii) The first alkaline earth metal", "Beryllium (Be)", [4]),
      ("(ix) The first coinage metal", "Copper (Cu)   (then silver and gold below it)", [29])]
ET0, EDT = 40.0, 6.0
caps([
    ("A", "Four blocks: s, p, d, f", "Each block is named after the sub-shell that is filling up", 0.1, 12),
    ("B1", "s-block: groups IA and IIA", "The outer s sub-shell is filling. It holds only 2: so just 2 groups!", 12, 18),
    ("B2", "p-block: groups IIIA to VIIIA", "The outer p sub-shell is filling. It holds 6: so 6 groups", 18, 24),
    ("C1", "d-block: the transition elements", "The d sub-shell holds 10: so 10 columns", 24, 29),
    ("C2", "f-block: lanthanides and actinides", "The f sub-shell holds 14: so 14 in each row", 29, 34),
    ("D", "Representative elements", "s-block + p-block together", 34, 40),
] + [("E%d" % k, "Example 3.1 " + q, a, ET0 + EDT * k, ET0 + EDT * (k + 1)) for k, (q, a, _) in enumerate(EX)] + [
    ("P", "Practice 3.2: the second noble gas", "Helium first, then neon (Ne)", 94, 100),
    ("G1", "Hydrogen and fluorine", "H: the lightest gas.  F: the most reactive and most electronegative.", 100, 106),
    ("G2", "Air: 78 % nitrogen, 21 % oxygen", "Out of every 100 bits of air. Below 16 % oxygen is unsafe for people.", 106, 114),
    ("H", "Next: Reading the table  →", "Test yourself: find any element", 114),
])

# ---- A. the blocks slide apart; a big letter on each ----
SHIFT = {"s": Vector((-1.6, 0, 0)), "p": Vector((1.6, 0, 0)), "d": Vector((0, 0, 0)), "f": Vector((0, -0.35, 0))}
for z in ALL:
    t = tb.T[z]["t"]
    p = tb.xy(z)
    appear(t, sec(0.2) + 2 * place(z)[1], dur=8)
    off = SHIFT[BK(z)]
    if off.length:
        for f, v in ((sec(2.6), p), (sec(3.8), p + off), (sec(38.6), p + off), (sec(39.6), p)):
            kf(t, "location", f, v, 'BEZIER')
LET = {"s": (-9.5, 0.3), "d": (-2.0, -1.2), "p": (7.5, 0.8), "f": (10.6, -4.3)}
for k, (b, (x, y)) in enumerate(LET.items()):
    m = mat_emit("Block Letter %s" % b, BLOCK_RGB[b], 4.5)
    lt = _text("Letter %s" % b, b, (x, y - 0.6, 1.2), 2.6 if b != "f" else 1.9, m, rot=(0, 0, 0), weight="semibold")
    lt.parent = tb.root
    shadow(lt)
    appear(lt, sec(4.4 + 0.9 * k), sec(11.8), dur=8)

# ---- B/C/D. spotlight one block at a time; its sub-shell seats appear at the top ----
S = {b: {z for z in ALL if BK(z) == b} for b in "spdf"}
table_focus(tb, [(S["s"], sec(12.2), sec(18)), (S["p"], sec(18), sec(24)), (S["d"], sec(24), sec(29)),
                 (S["f"], sec(29), sec(34)), (S["s"] | S["p"], sec(34), sec(39.4))])
for k, (b, n, t0, t1) in enumerate((("s", 2, 12.6, 17.8), ("p", 6, 18.6, 23.8), ("d", 10, 24.6, 28.8),
                                    ("f", 14, 29.6, 33.8))):
    g = empty("Seats %s" % b, (-2.0, 2.2, 0.3), tb.root)
    m = mat_emit("Seat %s" % b, BLOCK_RGB[b], 3.0)
    for j in range(n):
        d = sphere("Seat %s %d" % (b, j), 0.2, m, ((j - (n - 1) / 2) * 0.62, 0, 0), g, 16, 8)
        appear(d, sec(t0 + 0.5 + 0.08 * j), s=(0.2,) * 3)
    appear(g, sec(t0), sec(t1), dur=6)
    big("Lbl Seats %s" % b, "%s holds %d" % (b, n), Vector((-2.0, -0.6, 3.1)), t0 + 0.2, t1, mat=m, size=0.55)

# ---- E. Example 3.1: one gold frame walks to each answer; the answer tile grows ----
fr = empty("Ex Frame", tb.xy(21) + Vector((0, 0, TH + 0.05)), tb.root)
frame_box("Ex Frame Box", 1.06, 1.06, parent=fr, depth=0.045)
appear(fr, sec(ET0 + 0.6), sec(99.8), dur=6)
for k, (_, _, path) in enumerate(EX + [("", "", [2, 10])]):
    t0 = ET0 + EDT * k + 0.8 if k < len(EX) else 94.8
    step = min(0.55, 3.0 / max(len(path), 1))
    kf(fr, "location", sec(t0), tb.xy(path[0]) + Vector((0, 0, TH + 0.05)), 'CONSTANT')
    for i, z in enumerate(path[1:], 1):
        kf(fr, "location", sec(t0 + step * i), tb.xy(z) + Vector((0, 0, TH + 0.05)), 'BEZIER')
    t_next = ET0 + EDT * (k + 1) + 0.8 if k < len(EX) - 1 else (94.8 if k == len(EX) - 1 else 99.7)
    kf(fr, "location", sec(t_next) - 1, tb.xy(path[-1]) + Vector((0, 0, TH + 0.05)), 'CONSTANT')
    ans = tb.T[path[-1]]["t"]
    ta = t0 + step * (len(path) - 1) + 0.3
    kf(ans, "scale", sec(ta), (1, 1, 1), 'BEZIER')
    kf(ans, "scale", sec(ta) + 10, (1.5, 1.5, 1.5), 'BEZIER')
    kf(ans, "scale", sec(ta + 1.6), (1.5, 1.5, 1.5), 'BEZIER')
    kf(ans, "scale", sec(ta + 1.6) + 10, (1, 1, 1), 'BEZIER')

# ---- G1. hydrogen and fluorine tiles, big ----
facts = Table("Fact", SG, zs=[1, 9], numbers=True, color="cat")
for k, (z, txt, mat) in enumerate(((1, "lightest gas", M["green"]), (9, "most reactive", M["gold"]))):
    t = facts.T[z]["t"]
    t.location = Vector(((k - 0.5) * 5.0, 0.6, 0))
    t.scale = (2.4,) * 3
    appear(t, sec(100.4 + 0.8 * k), dur=10, s=(2.4,) * 3)
    big("Lbl Fact %d" % k, txt, SG + Vector(((k - 0.5) * 5.0, -0.6, -1.7)), 101.0 + 0.8 * k, 105.8, mat=mat, size=0.6)

# ---- G2. air: a glass case of 100 marbles: 78 nitrogen (blue), 21 oxygen (red), 1 other ----
SA = SG + Vector((30, 0, 0))
case = box("Air Case", (5.5, 0.7, 5.5), mat_emit("Air Glass", (0.4, 0.6, 0.9), 0.4, alpha=0.12), SA + Vector((0, 0.2, 1.05)))
appear(case, sec(106.3), dur=10)
MN = mat_pbr("Marble N", (0.25, 0.5, 1.0), roughness=0.15)
MO = mat_pbr("Marble O", (1.0, 0.28, 0.22), roughness=0.15)
MX = mat_pbr("Marble X", (0.7, 0.7, 0.72), roughness=0.15)
for i in range(100):
    r, c = divmod(i, 10)
    m = MN if i < 78 else MO if i < 99 else MX
    t0 = 106.8 + (i * 0.035 if i < 78 else 2.9 + (i - 78) * 0.06 if i < 99 else 4.6)
    mb = sphere("Air Marble %02d" % i, 0.22, m, SA + Vector(((c - 4.5) * 0.5, 0, -1.2 + r * 0.5)), None, 16, 8)
    appear(mb, sec(t0), dur=6, s=(0.22,) * 3)
big("Lbl Air N", "78 nitrogen", SA + Vector((-4.7, -0.6, 0.6)), 108.6, 113.8, mat=M["cyan"], size=0.5)
big("Lbl Air O", "21 oxygen", SA + Vector((-4.7, -0.6, 2.8)), 110.4, 113.8, mat=M["red"], size=0.5)
big("Lbl Air X", "1 other", SA + Vector((4.3, -0.6, 3.3)), 111.6, 113.8, mat=M["dim"], size=0.45)
finish_film()
