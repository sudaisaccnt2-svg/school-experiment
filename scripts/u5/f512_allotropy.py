# ---- Film 512: Allotropy (textbook p.145: 5.6 allotropy, three reasons (carbon forms, O₂ / O₃, sulphur S₈  (v4 captions)
# arrangements), same chemical properties, transition temperature: sulphur 95.5 °C, tin 13.2 °C, KNO₃ 128.5 °C) ----
start_film("512", "512 Allotropy", 68.5)
END = scene.frame_end
SA, SB, SC, SD, SE = (Vector((40 * k, 0, 0)) for k in range(5))

shot("Cam Carbon", 0, 14, SA + Vector((0, 0, -0.3)), dist=13, pitch=0.12)
shot("Cam Oxygen", 14, 28, SB + Vector((0, 0, -0.2)), dist=12)
shot("Cam Sulphur", 28, 46, SC + Vector((0, 0, -0.3)), dist=14, pitch=0.1)
shot("Cam Transition", 46, 60, SD + Vector((0, 0, -0.3)), dist=14)
shot("Cam Burn", 60, None, SE + Vector((0, 0, -0.4)), dist=13, pitch=0.1)
for name, t in (("Carbon forms", 0), ("O₂ and O₃", 14), ("Sulphur", 28), ("Transition temperatures", 46),
                ("Same chemistry", 60)):
    act(name, sec(t))

say('A1', 'One element, many forms: allotropes', 0.1, 7)
say('A2', 'Diamond, graphite: all carbon', 7, 14)
say('B1', 'Oxygen O₂: 2 atoms', 14, 21)
say('B2', 'Ozone O₃: 3 atoms', 21, 28)
say('C1', 'Sulphur: same rings, two packings', 28, 36)
say('C2', 'They swap at 95.5 °C', 36, 46)
say('D1', 'Grey ↔ white tin: 13.2 °C', 46, 53)
say('D2', 'KNO₃ swaps at 128.5 °C', 53, 60)
say('E1', 'Look different, react the same', 60, 68)

# ---- A. three carbon forms ----
GEM = mat_emit("Diamond Glow", (0.8, 0.95, 1.0), 1.6)
GRAPH = mat_pbr("Graphite", (0.12, 0.12, 0.14), metallic=0.6, roughness=0.35)
CHAR = mat_pbr("Charcoal", (0.05, 0.05, 0.05), roughness=0.95)
dia = empty("A Diamond", SA + Vector((-3.6, 0, 0)))
cyl("A Dia Top", 1.0, 0.0, 1.0, GEM, (0, 0, 0.5), dia, segs=8)
cyl("A Dia Bot", 1.0, 0.0, 1.4, GEM, (0, 0, -0.7), dia, rot=(math.pi, 0, 0), segs=8)
appear(dia, sec(7.2), dur=10)
turn(dia, 7.0, 14.0, 0.5)
gr = empty("A Graphite", SA + Vector((0, 0, -0.6)))
for k in range(6):
    box("A Gr Layer %d" % k, (2.2, 1.4, 0.12), GRAPH, (0.06 * k, 0, 0.22 * k), gr)
appear(gr, sec(7.6), dur=10)
appear(blob("A Charcoal", (1.1, 0.8, 0.8), CHAR, SA + Vector((3.6, 0, -0.1)), bump=0.35, seed=2), sec(8.0), dur=10)
for k, (x, nm) in enumerate(((-3.6, "diamond"), (0.0, "graphite"), (3.6, "charcoal"))):
    big("Lbl A %d" % k, nm, SA + Vector((x, -0.6, 1.9)), 8.4 + 0.4 * k, None, size=0.5)
big("Lbl A C", "all carbon", SA + Vector((0, -0.6, -2.2)), 1.0, 7.0, mat=M["gold"], size=0.6)

# ---- B. O₂ and O₃ ----
OX = mat_pbr("CPK O", (0.95, 0.25, 0.22), roughness=0.3)
o2 = empty("B O2", SB + Vector((-2.6, 0, 0)))
sphere("B O2 a", 0.55, OX, (-0.45, 0, 0), o2, 32, 16)
sphere("B O2 b", 0.55, OX, (0.45, 0, 0), o2, 32, 16)
appear(o2, sec(14.3), dur=10)
o3 = empty("B O3", SB + Vector((2.6, 0, -0.2)))
for k, (x, z) in enumerate(((-0.75, -0.3), (0, 0.3), (0.75, -0.3))):
    sphere("B O3 %d" % k, 0.55, OX, (x, 0, z), o3, 32, 16)
appear(o3, sec(21.2), dur=10)
turn(o2, 14.0, 28.0, 0.6)
turn(o3, 21.0, 28.0, 0.4)
big("Lbl B O2", "O₂ oxygen", SB + Vector((-2.6, -0.6, 1.4)), 15.0, None, mat=M["cyan"], size=0.55)
big("Lbl B O3", "O₃ ozone", SB + Vector((2.6, -0.6, 1.4)), 21.6, None, mat=M["gold"], size=0.55)

# ---- C. sulphur S₈ rings: neat rows (rhombic) → slanted rows (monoclinic) at 95.5 °C ----
SUL = mat_emit("Sulphur", (1.0, 0.85, 0.25), 1.2)


def s8(name, loc, parent=None):
    g = empty(name, loc, parent)
    pts = []
    for i in range(8):
        a = 2 * math.pi * i / 8
        p = (0.42 * math.cos(a), 0.42 * math.sin(a) * 0.5, 0.1 if i % 2 else -0.1)
        sphere("%s %d" % (name, i), 0.11, SUL, p, g, 12, 6)
        pts.append(p)
    pcurve(name + " Ring", pts + [pts[0]], SUL, 0.025, "Models", parent=g)
    return g


cC = SC + Vector((0, 0, -0.4))
for i in range(3):
    for j in range(3):
        a = cC + Vector(((i - 1) * 1.15, 0, (j - 1) * 0.85))
        b = cC + Vector(((i - 1) * 1.15 + (j - 1) * 0.55, 0, (j - 1) * 0.95))
        r = s8("C S8 %d %d" % (i, j), a)
        appear(r, sec(28.3) + 3 * (3 * i + j), dur=10)
        move(r, sec(39.0), sec(41.0), a, b)
        kf(r, "rotation_euler", sec(39.0), (0, 0, 0))
        kf(r, "rotation_euler", sec(41.0), (0, math.radians(30), 0))
col = thermo("C Thermo", SC + Vector((3.6, -0.2, -2.2)), h=3.6)
appear(col.parent, sec(28.5), dur=10)
level(col, 28, 0.35)
level(col, 36, 0.35)
level(col, 39, 0.6)
big("Lbl C R", "rhombic", cC + Vector((0, -0.6, 1.9)), 29.0, 38.8, mat=SUL, size=0.55)
big("Lbl C M", "monoclinic", cC + Vector((0, -0.6, 1.9)), 41.0, None, mat=SUL, size=0.55)
big("Lbl C T", "95.5 °C", SC + Vector((4.2, -0.6, 0.0)), 38.6, None, mat=M["red"], size=0.5, align='LEFT')

# ---- D. a temperature line with three transition points ----
o = SD + Vector((-3.0, 0, -2.2))
appear(arrow("D Axis", 4.6, M["white"], None, o, (0, -math.pi / 2, 0), r=0.03, head=0.25), sec(46.2), dur=8)
zT = lambda T_: o + Vector((0, 0, 0.3 + T_ * 0.03))
for k, (T_, txt, mat, t0) in enumerate(((13.2, "13.2 °C  grey tin ↔ white tin", M["cyan"], 46.8),
                                        (95.5, "95.5 °C  rhombic ↔ monoclinic S₈", SUL, 49.0),
                                        (128.5, "128.5 °C  KNO₃ forms switch", M["red"], 53.4))):
    appear(sphere("D Pt %d" % k, 0.14, mat, zT(T_), None, 16, 8), sec(t0), s=(0.14,) * 3)
    big("Lbl D %d" % k, txt, zT(T_) + Vector((0.4, -0.6, 0)), t0 + 0.2, None, mat=mat, size=0.42, align='LEFT')

# ---- E. diamond and graphite both burn to CO₂ ----
CO = mat_pbr("CPK C", (0.22, 0.24, 0.3), roughness=0.3)
d2 = empty("E Diamond", SE + Vector((-2.8, 0, -0.4)))
cyl("E Dia Top", 0.8, 0.0, 0.8, GEM, (0, 0, 0.4), d2, segs=8)
cyl("E Dia Bot", 0.8, 0.0, 1.1, GEM, (0, 0, -0.55), d2, rot=(math.pi, 0, 0), segs=8)
appear(d2, sec(60.2), dur=10)
g2 = empty("E Graphite", SE + Vector((2.8, 0, -0.9)))
for k in range(5):
    box("E Gr %d" % k, (1.8, 1.2, 0.1), GRAPH, (0.05 * k, 0, 0.2 * k), g2)
appear(g2, sec(60.4), dur=10)
for k, x in enumerate((-2.8, 2.8)):
    flame("E Flame %d" % k, SE + Vector((x, 0, -2.4)), 61.0, None, s=0.8)
    for j in range(3):
        c = empty("E CO2 %d %d" % (k, j), SE + Vector((x, -0.2, 0.6)))
        sphere("E CO2 C %d %d" % (k, j), 0.16, CO, (0, 0, 0), c, 16, 8)
        sphere("E CO2 Oa %d %d" % (k, j), 0.15, OX, (-0.3, 0, 0), c, 16, 8)
        sphere("E CO2 Ob %d %d" % (k, j), 0.15, OX, (0.3, 0, 0), c, 16, 8)
        t0 = 62.0 + 1.6 * j + 0.5 * k
        hide_until(c, sec(t0))
        move(c, sec(t0), sec(t0 + 2.4), SE + Vector((x, -0.2, 0.9)), SE + Vector((x + 0.8 * (j - 1), -0.2, 2.6)), 'LINEAR')
        hide_from(c, sec(t0 + 2.4))
big("Lbl E", "both → CO₂", SE + Vector((0, -0.6, 2.4)), 63.0, None, mat=M["gold"], size=0.55)
finish_film()
