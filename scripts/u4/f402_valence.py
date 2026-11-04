# ---- Film 402: Valence electrons and types of bonds (textbook p.94: valence electrons/shell, bonding and  (v4 captions)
# non-bonding electrons, orbital concept sigma/pi, 4.2 chemical bond, 4.3 four types) ----
start_film("402", "402 Valence and Bond Types", 70.5)
END = scene.frame_end
SA, SB, SC, SD = (Vector((40 * k, 0, 0)) for k in range(4))

shot("Cam Valence", 0, 14, SA + Vector((0, 0, -0.5)), dist=15)
shot("Cam Pairs", 14, 24, SB + Vector((0, 0, -0.5)), dist=11)
shot("Cam Overlap", 24, 42, SC + Vector((0, 0, -0.5)), dist=15)
shot("Cam Types", 42, None, SD + Vector((0, 0, -0.5)), dist=23)
for name, t in (("Valence electrons", 0), ("Bonding pairs", 14), ("Overlap", 24), ("Four bonds", 42)):
    act(name, sec(t))

say('A1', 'Outer electrons: valence electrons', 0.1, 7)
say('A2', 'Only these take part in bonds', 7, 14)
say('B1', "Chlorine's single electron bonds", 14, 19)
say('B2', 'The pairs stay home: lone pairs', 19, 24)
say('C1', 'End to end: sigma bond', 24, 33)
say('C2', 'Side by side: pi bond', 33, 42)
say('D1', 'A bond holds atoms together', 42, 51)
say('D2', 'Ionic gives, covalent shares', 51, 60)
say('D3', 'Dative and metallic bonds', 60, 70)

# ---- A. Na and Cl: gold outer shell = valence electrons ----
vatom("A Na", 11, SA + Vector((-3.6, 0, 0.6)), sec(0.4), [(sec(0.4), sec(6.8))], r0=0.5, dr=0.55, e_r=0.11, nuc_r=0.08)
vatom("A Cl", 17, SA + Vector((3.6, 0, 0.6)), sec(1.2), [(sec(7.0), sec(13.8))], r0=0.5, dr=0.55, e_r=0.11, nuc_r=0.09)
for nm, x, t in (("Na", -3.6, 0.8), ("Cl", 3.6, 1.6)):
    sy = _text("A %s Sym" % nm, nm, SA + Vector((x, -0.3, -1.9)), 0.6, M["white"], weight="semibold")
    shadow(sy)
    appear(sy, sec(t))
big("Lbl Valence", "valence shell", SA + Vector((0, -0.6, 2.6)), 3.0, 13.8, mat=M["gold"], size=0.55)

# ---- B. chlorine dot picture: 1 bonding electron, 3 lone pairs ----
Cl = LRing("B Cl", "Cl", SB + Vector((0, 0, 0.5)), 7, 14.4, 23.8, r=1.25, emat=E_GOLD)
lone = [e for e in Cl.es]
single = Cl.es[-1]             # the 7th seat is the left single
for k, e in enumerate(Cl.es):
    if e is single:
        continue
pulses("B Single", Cl.loc + Vector((-1.25, -0.3, 0)), None, [16.4, 17.6], r=0.45, mat=M["green"])
big("Lbl Bonding", "bonding", SB + Vector((-3.4, -0.6, 0.5)), 16.4, 23.8, mat=M["green"], size=0.5)
big("Lbl Lone", "non-bonding pairs", SB + Vector((0, -0.6, 2.4)), 19.4, 23.8, mat=M["gold"], size=0.5)

# ---- C. sigma (end to end) and pi (side by side) ----
CLOUD_A = mat_emit("Cloud A", (0.35, 0.65, 1.0), 1.1, alpha=0.4)
CLOUD_B = mat_emit("Cloud B", (1.0, 0.7, 0.3), 1.1, alpha=0.4)
for k, (x0, x1, m) in enumerate(((-4.6, -1.1, CLOUD_A), (4.6, 1.1, CLOUD_B))):
    c = sphere("C Sigma %d" % k, 0.85, m, SC + Vector((x0, 0.2, 1.7)), None, 40, 20)
    appear(c, sec(24.4 + 0.3 * k), sec(41.8), dur=10, s=(0.85,) * 3)
    move(c, sec(26.0), sec(28.4), SC + Vector((x0, 0.2, 1.7)), SC + Vector((x1 * 0.64, 0.2, 1.7)))
big("Lbl Sigma", "σ  end to end", SC + Vector((4.3, -0.6, 1.7)), 28.6, 41.8, mat=M["cyan"], size=0.5)
for k, (x0, x1, m) in enumerate(((-3.0, -0.36, CLOUD_A), (3.0, 0.36, CLOUD_B))):
    g = empty("C Pi %d" % k, SC + Vector((x0, 0.2, -0.7)))
    for s_ in (-1, 1):
        lobe = sphere("C Pi %d Lobe %d" % (k, s_), 1.0, m, (0, 0, 0.62 * s_), g, 32, 16)
        lobe.scale = (0.42, 0.42, 0.62)
    appear(g, sec(33.4 + 0.3 * k), sec(41.8), dur=10)
    move(g, sec(35.0), sec(37.4), SC + Vector((x0, 0.2, -0.7)), SC + Vector((x1, 0.2, -0.7)))
big("Lbl Pi", "π  side by side", SC + Vector((4.3, -0.6, -0.7)), 37.6, 41.8, mat=M["gold"], size=0.5)

# ---- D. the four types ----
IONP = mat_emit("Ion Plus", (0.75, 0.5, 1.0), 1.3)
IONM = mat_emit("Ion Minus", (0.4, 0.95, 0.5), 1.3)
# ionic: Na+ and Cl- balls pulled together
na = sphere("D Na", 0.7, IONP, SD + Vector((-9.0, 0.2, 0.6)), None, 32, 16)
cl = sphere("D Cl", 1.0, IONM, SD + Vector((-5.6, 0.2, 0.6)), None, 32, 16)
for o, r, t in ((na, 0.7, 42.6), (cl, 1.0, 43.0)):
    appear(o, sec(t), dur=10, s=(r,) * 3)
move(na, sec(52.0), sec(53.4), SD + Vector((-9.0, 0.2, 0.6)), SD + Vector((-7.5, 0.2, 0.6)))
for k, (txt, x) in enumerate((("+", -7.5), ("−", -5.6))):
    t = _text("D Ion %d" % k, txt, SD + Vector((x, -1.2, 0.6)), 0.8, M["white"], weight="semibold")
    appear(t, sec(53.6))
# covalent: two overlapping rings sharing a pair
CA = LRing("D CA", "Cl", SD + Vector((-2.2, 0, 0.6)), 1, 43.4, None, r=1.0, angles=[0])
CB = LRing("D CB", "Cl", SD + Vector((0.4, 0, 0.6)), 1, 43.4, None, r=1.0, emat=E_GOLD, angles=[180])
CA.move(54.4, 55.8, SD + Vector((-1.6, 0, 0.6)))
CB.move(54.4, 55.8, SD + Vector((-0.2, 0, 0.6)))
share(CA, CB, 0, 0, 56.0)
# dative: an arrow from a lone pair to an empty seat
NL = LRing("D N", "N", SD + Vector((3.0, 0, 0.6)), 2, 43.8, None, r=0.9, angles=[-12, 12])
Hp = LRing("D H", "H⁺", SD + Vector((5.4, 0, 0.6)), 0, 43.8, None, r=0.7, angles=[])
dart = arrow("D Dative", 0.9, M["gold"], None, SD + Vector((3.95, -0.4, 0.6)), r=0.05, head=0.25)
appear(dart, sec(61.0))
# metallic: + ions in a grid with blue electrons drifting between
for i in range(3):
    for j in range(3):
        p = SD + Vector((7.6 + 0.85 * i, 0.2, -0.25 + 0.85 * j))
        appear(sphere("D Metal %d %d" % (i, j), 0.28, IONP, p, None, 20, 10), sec(44.2 + 0.05 * (i + j)), dur=8, s=(0.28,) * 3)
for k in range(8):
    e = electron("D Sea %d" % k, None, SD + Vector((7.2 + 0.62 * (k % 4), -0.4, -0.5 + 0.85 * (k // 3))), 0.1)
    a, b = e.location.copy(), e.location.copy() + Vector((0.9 * (-1) ** k, 0, 0.5 * (-1) ** (k // 2)))
    kf(e, "location", sec(62.0), a, 'BEZIER')
    kf(e, "location", sec(64.0), b, 'BEZIER')
    kf(e, "location", sec(66.0), a, 'BEZIER')
    appear(e, sec(44.4), dur=6, s=tuple(e.scale))
for k, (txt, x, t0, t1) in enumerate((("ionic", -7.3, 52.0, 59.8), ("covalent", -0.9, 52.6, 59.8),
                                     ("dative", 4.2, 60.4, None), ("metallic", 8.45, 61.0, None))):
    big("Lbl Type %d" % k, txt, SD + Vector((x, -0.6, 2.3)), t0, t1, mat=M["gold"], size=0.62)
finish_film()
