# ---- Film 305: Reading the table (textbook p.72: Scientific Information + Test Yourself, all answered) ----
# bsend.py common.py p2/lib.py u3/u3lib.py u3/f305_reading.py
start_film("305", "305 Reading the Table", 92.0)
END = scene.frame_end
tb = Table("Tab", (0, 0, 0))
ALL = tb.zs
TT = (0, 0, -2.45)
SK, SM, SC, SX = Vector((60, 0, 0)), Vector((90, 0, 0)), Vector((120, 0, 0)), Vector((150, 0, 0))

shot("Cam K", 0, 12, SK + Vector((0, 0, -0.4)), dist=13)
shot("Cam Find K", 12, 22, TT, dist=25)
shot("Cam As", 22, 30, TT, dist=25)
shot("Cam Ti", 30, 38, TT, dist=25)
shot("Cam Sort", 38, 58, SM + Vector((0, 0, -0.2)), dist=17)
shot("Cam Ca", 58, 72, SC + Vector((0, 0, -0.4)), dist=13)
shot("Cam X", 72, 84, SX + Vector((0, 0, -0.2)), dist=15)
shot("Cam End", 84, None, TT, dist=25)
for name, t in (("Two rules", 0), ("Potassium", 12), ("Arsenic", 22), ("Titanium", 30), ("Metal or not", 38),
                ("Calcium", 58), ("Element X", 72)):
    act(name, sec(t))

caps([
    ("A1", "Rule 1: count the shells", "Potassium has 4 shells → period 4", 0.1, 7),
    ("A2", "Rule 2: count the outer electrons", "It has 1 outer electron → group IA", 7, 12),
    ("B", "Row 4 + column IA = potassium", "Test Yourself: potassium belongs to group IA", 12, 22),
    ("C", "Arsenic (As): which period?", "Its row is row 4 → period 4", 22, 30),
    ("D", "Titanium (Ti): which group?", "Its column is IVB → group IVB (a transition metal)", 30, 38),
    ("E1", "Metal or non-metal?", "Cesium, boron, selenium, phosphorus, astatine, osmium", 38, 44),
    ("E2", "Metals: cesium and osmium", "Non-metals: selenium and phosphorus", 44, 51),
    ("E3", "Boron and astatine: metalloids", "Half-way elements, closer to the non-metals", 51, 58),
    ("F1", "Calcium: how many shells?", "4 shells", 58, 65),
    ("F2", "… and how many valence electrons?", "2 outer (valence) electrons: group IIA", 65, 72),
    ("G1", "Element X: period 3, group IIA", "Period 3 → 3 shells.   Group IIA → 2 outer electrons.", 72, 78),
    ("G2", "So X is 2, 8, 2: answer C", "That is magnesium (Mg)", 78, 84),
    ("H", "Next: Atomic size  →", "Why atoms get bigger and smaller across the table", 84),
])

GLOW = mat_emit("Ring Count Glow", (1.0, 0.85, 0.5), 5.0)


def count_rings(name, g, radii, t0, dt, t1, numbers=True):
    """Each shell glows in turn (inside out) with its number beside it."""
    for k, r in enumerate(radii):
        rg = ring_curve("%s Glow %d" % (name, k), r, GLOW, g, depth=0.045)
        appear(rg, sec(t0 + dt * k), sec(t1), dur=6)
        if numbers:
            a = -28 * DEG
            n = _text("%s Num %d" % (name, k), str(k + 1), (r * math.cos(a) + 0.32, r * math.sin(a) - 0.1, 0.05), 0.42,
                      M["gold"], rot=(0, 0, 0), weight="semibold")
            n.parent = g
            shadow(n)
            appear(n, sec(t0 + dt * k + 0.1), sec(t1), dur=6)


# ---- A. potassium: 4 shells, 1 outer electron ----
gK, rK, oK = vatom("K", 19, SK + Vector((0, 0, 0.6)), sec(0.4), [(sec(0.4), sec(11.8))], r0=0.55, dr=0.5, e_r=0.12,
                   nuc_r=0.085, rate=0.02)
count_rings("K", gK, rK, 1.6, 1.0, 6.8)
big("Lbl K Shells", "4 shells", SK + Vector((3.6, -0.6, 2.3)), 5.6, 6.8, mat=M["gold"])
big("Lbl K Outer", "1 outer electron", SK + Vector((3.9, -0.6, 2.3)), 7.6, 11.8, mat=M["gold"], size=0.5)
halo(oK[0], (8.2, 9.8))

# ---- B-D. on the table: row and column bars cross at the answer ----
for z in ALL:
    appear(tb.T[z]["t"], sec(12.1) + place(z)[1], dur=6)


def row_bar(name, r, t0, t1):
    b = empty(name, (0, 4 - r, TH + 0.06), tb.root)
    frame_box(name + " Box", 18.4, 1.04, parent=b, depth=0.04)
    appear(b, sec(t0), sec(t1), dur=6)


def col_bar(name, c, t0, t1):
    b = empty(name, ((c - 9.5) * P, 0, TH + 0.06), tb.root)
    frame_box(name + " Box", 1.04, 7.1, parent=b, depth=0.04)
    appear(b, sec(t0), sec(t1), dur=6)


def grow(z, t0, t1, k=1.5):
    t = tb.T[z]["t"]
    for f, v in ((sec(t0), 1), (sec(t0) + 10, k), (sec(t1), k), (sec(t1) + 10, 1)):
        kf(t, "scale", f, (v,) * 3, 'BEZIER')


row_bar("Row K", 4, 13.0, 21.6)
col_bar("Col K", 1, 14.6, 21.6)
grow(19, 16.2, 21.4)
big("Lbl Period4", "period 4", Vector((-3.5, -0.6, 2.4)), 13.4, 21.6, mat=M["gold"])
big("Lbl GroupIA", "group IA", Vector((-3.5, -0.6, 1.4)), 15.0, 21.6, mat=M["gold"])
walker(tb, "As Frame", [33], 22.6, t_out=29.6)
row_bar("Row As", 4, 24.4, 29.6)
grow(33, 24.6, 29.4)
big("Lbl As", "period 4", Vector((-3.5, -0.6, 2.4)), 25.0, 29.6, mat=M["gold"])
walker(tb, "Ti Frame", [22], 30.6, t_out=37.6)
col_bar("Col Ti", 4, 32.2, 37.6)
grow(22, 32.4, 37.4)
big("Lbl Ti", "group IVB", Vector((-3.5, -0.6, 2.4)), 32.8, 37.6, mat=M["gold"])

# ---- E. six tiles; metals to the left tray, non-metals to the right, metalloids next to them ----
SIX = [55, 5, 34, 15, 85, 76]
st = Table("Six", SM, zs=SIX, numbers=True)
row_pos = {z: Vector(((k - 2.5) * 2.0, 2.6, 0)) for k, z in enumerate(SIX)}
DEST = {55: (-4.6, -0.45), 76: (-2.8, -0.45), 34: (2.6, -0.45), 15: (4.4, -0.45), 5: (2.6, 1.2), 85: (4.4, 1.2)}
TMOVE = {55: 44.6, 76: 45.8, 34: 47.4, 15: 48.6, 5: 51.6, 85: 53.0}
for k, z in enumerate(SIX):
    t = st.T[z]["t"]
    t.scale = (1.5,) * 3
    a, b = row_pos[z], Vector((*DEST[z], 0))
    t.location = a
    appear(t, sec(38.6 + 0.4 * k), dur=8, s=(1.5,) * 3)
    kf(t, "location", sec(TMOVE[z]), a, 'BEZIER')
    kf(t, "location", sec(TMOVE[z]) + 18, b, 'BEZIER')
TRAY = mat_emit("Tray", (0.35, 0.6, 1.0), 1.2)
for name, x, mat, t0, txt in (("Metal", -3.7, M["cyan"], 44.2, "METALS"), ("Nonmetal", 3.5, M["green"], 47.0,
                                                                             "NON-METALS")):
    tr = empty("Tray %s" % name, SM + Vector((x, 0, -1.6)))
    frame_box("Tray %s Box" % name, 4.3, 0.3, mat=mat, depth=0.05, parent=tr)
    tr.rotation_euler = (90 * DEG, 0, 0)
    appear(tr, sec(t0), dur=8)
    big("Lbl Tray %s" % name, txt, SM + Vector((x, -0.6, -2.2)), t0 + 0.2, 57.8, mat=mat, size=0.5)
big("Lbl Metalloid", "metalloids", SM + Vector((3.5, -0.6, 2.35)), 52.0, 57.8, mat=mat_emit("Lbl Lime", CAT_RGB["metalloid"], 2.2),
    size=0.45)

# ---- F. calcium: 4 shells, 2 valence electrons ----
gC, rC, oC = vatom("Ca", 20, SC + Vector((0, 0, 0.6)), sec(58.4), [(sec(58.4), sec(71.8))], r0=0.55, dr=0.5, e_r=0.12,
                   nuc_r=0.085, rate=0.02)
count_rings("Ca", gC, rC, 59.6, 1.0, 64.8)
big("Lbl Ca Shells", "4 shells", SC + Vector((3.6, -0.6, 2.3)), 63.6, 71.8, mat=M["gold"])
big("Lbl Ca Outer", "2 valence electrons", SC + Vector((3.9, -0.6, 1.5)), 65.6, 71.8, mat=M["gold"], size=0.5)
for e in oC:
    halo(e, (66.2, 67.8))

# ---- G. element X: the four answer cards; the atom builds 2, 8, 2; card C wins ----
CARD = mat_emit("Card Fill", (0.03, 0.035, 0.05), 1.0)
for k, (letter, txt) in enumerate((("A", "2, 2"), ("B", "2, 3"), ("C", "2, 8, 2"), ("D", "2, 8, 3"))):
    cg = empty("Card %s" % letter, SX + Vector(((k - 1.5) * 3.0, 0, 3.0)), rot=(90 * DEG, 0, 0))
    cb = box("Card %s Body" % letter, (2.6, 1.0, 0.08), CARD, parent=cg)
    frame_box("Card %s Edge" % letter, 2.6, 1.0, mat=(M["green"] if letter == "C" else M["line"]), depth=0.025,
              parent=cg).location = (0, 0, 0.06)
    tx = _text("Card %s Text" % letter, "%s.  %s" % (letter, txt), (0, 0, 0.07), 0.42, M["white"], rot=(0, 0, 0),
               weight="semibold")
    tx.parent = cg
    appear(cg, sec(72.4 + 0.3 * k), dur=8)
    if letter == "C":
        for f, v in ((sec(78.6), 1), (sec(78.6) + 10, 1.25), (sec(83.6), 1.25)):
            kf(cg, "scale", f, (v,) * 3, 'BEZIER')
    else:
        for f, v in ((sec(78.6), 1), (sec(78.6) + 10, 0.8)):
            kf(cg, "scale", f, (v,) * 3, 'BEZIER')
gX = empty("X", SX + Vector((0, 0, 0.2)), rot=(90 * DEG, 0, 0))
nucleus_mesh("X Nucleus", 12, 12, gX, r=0.085, seed=12)
appear(gX, sec(73.0), dur=8)
for k, (n, t0) in enumerate(((2, 74.6), (8, 75.4), (2, 76.6))):
    rad = 0.55 + 0.5 * k
    last = k == 2
    rg = ring_curve("X Ring %d" % k, rad, M["orbit_gold"] if last else M["orbit"], gX, depth=0.018)
    appear(rg, sec(t0), dur=8)
    piv = empty("X Piv %d" % k, (0, 0, 0), gX)
    focus_spin(piv, [(sec(t0), sec(83.8))], 0.02 / (1 + 0.6 * k), phase=k)
    for j in range(n):
        a = 2 * math.pi * j / n
        e = electron("X e%d %d" % (k, j), piv, (rad * math.cos(a), rad * math.sin(a), 0), 0.12,
                     mat=M["Valence"] if last else None)
        appear(e, sec(t0 + 0.3 + 0.05 * j), dur=6, s=tuple(e.scale))
big("Lbl X", "X = Mg", SX + Vector((3.3, -0.6, 0.2)), 79.2, 83.8, mat=M["green"], size=0.6)
finish_film()
