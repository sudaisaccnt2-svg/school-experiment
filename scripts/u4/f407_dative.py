# ---- Film 407: Atoms, molecules, ions and the dative bond (textbook pp.103-104: Example/Practice 4.2,  (v4 captions)
# 4.3.3 coordinate covalent bond, Fig 4.11 NH4+, Fig 4.12 NH3-BCl3) ----
start_film("407", "407 Dative Bond", 70.5)
END = scene.frame_end
SA, SB, SC = Vector((0, 0, 0)), Vector((40, 0, 0)), Vector((80, 0, 0))

shot("Cam Sort", 0, 24, SA + Vector((0, 0, -0.7)), dist=19)
shot("Cam NH4", 24, 52, SB + Vector((0, 0, -0.6)), dist=16)
shot("Cam BCl3", 52, None, SC + Vector((0, 0, -0.3)), dist=16.5)
for name, t in (("Atoms, molecules, ions", 0), ("Ammonium ion", 24), ("Addition compound", 52)):
    act(name, sec(t))

say('A1', 'Noble gases stay single atoms', 0.1, 8)
say('A2', 'Molecules share · metal salts make ions', 8, 16)
say('A3', 'He atoms · H₂, HCl molecules · HgO ions', 16, 24)
say('B1', 'Ammonia has a spare pair', 24, 32)
say('B2', 'H⁺ has no electrons', 32, 40)
say('B3', 'Nitrogen gives both: dative bond', 40, 46)
say('B4', 'Now it is NH₄⁺', 46, 52)
say('C1', 'Boron is 2 short', 52, 60)
say('C2', 'Nitrogen gives its pair: N → B', 60, 70)

# ---- A. three bins: atoms, molecules, ions ----
BIN_M = mat_pbr("Sort Bin", (0.05, 0.06, 0.09), roughness=0.7)
BX = {"atoms": -5.6, "molecules": 0.0, "ions": 5.6}
for k, (nm, col) in enumerate((("atoms", M["cyan"]), ("molecules", M["gold"]), ("ions", M["red"]))):
    appear(box("A Bin %s" % nm, (4.8, 0.12, 3.4), BIN_M, SA + Vector((BX[nm], 0.8, 0.4))), sec(0.4 + 0.2 * k), dur=10)
    big("Lbl A %s" % nm, nm, SA + Vector((BX[nm], -0.6, 2.7)), 0.8 + 0.2 * k, None, mat=col, size=0.6)
used = {k: 0 for k in BX}
for k, (txt, kind, t) in enumerate((("O₂", "molecules", 3.0), ("Ne", "atoms", 4.4), ("NO₂", "molecules", 5.8),
                                    ("KCl", "ions", 9.0), ("Na₂O", "ions", 10.4),
                                    ("H₂", "molecules", 16.6), ("He", "atoms", 18.0), ("HCl", "molecules", 19.4),
                                    ("HgO", "ions", 20.8))):
    n = used[kind]
    used[kind] += 1
    x = BX[kind] + (-1.1 if n % 2 == 0 else 1.1)
    z = 1.2 - 1.2 * (n // 2)
    top = SA + Vector((0, -1.0, 4.4))
    c = big("Card %d" % k, txt, top, t, None, mat=M["white"], size=0.55)
    move(c, sec(t + 0.5), sec(t + 1.3), top, SA + Vector((x, -1.0, z - 0.2)))

# ---- B. NH3 + H+ -> NH4+ ----
NC = SB + Vector((0, 0, 0))
NA = LRing("B N", "N", NC, 5, 24.4, None, r=1.2, angles=[76, 104, 180, 270, 0])
for k, (dx, dz, a, kn) in enumerate(((-1, 0, 0, 2), (0, -1, 90, 3), (1, 0, 180, 4))):
    Hk = LRing("B H%d" % k, "H", NC + Vector((dx, 0, dz)) * 1.75, 1, 24.8 + 0.3 * k, None, r=0.75, emat=E_GOLD, angles=[a])
    pairs(Hk, NA, [0], [kn], 26.4 + 0.5 * k)
Hp = LRing("B Hp", "H⁺", NC + Vector((0, 0, 5.0)), 0, 32.4, None, r=0.75, angles=[])
Hp.move(36.0, 38.6, NC + Vector((0, 0, 1.75)))
mid = NC + Vector((0, 0, 0.875))
NA.seat(0, 40.4, mid + Vector((-0.13, 0, 0)))
NA.seat(1, 40.6, mid + Vector((0.13, 0, 0)))
dart = arrow("B Dative", 0.9, M["gold"], None, NC + Vector((-0.5, -0.5, 0.35)), (0, -math.pi / 2, 0), r=0.05, head=0.25)
appear(dart, sec(42.0))
big("Lbl B Donor", "donor", NC + Vector((-3.4, -0.6, 0.4)), 33.0, 45.8, mat=M["cyan"], size=0.5)
big("Lbl B Acc", "acceptor", NC + Vector((2.9, -0.6, 1.75)), 33.6, 45.8, mat=M["gold"], size=0.5)
big("Lbl B NH4", "NH₄⁺", NC + Vector((3.0, -0.6, 1.75)), 46.4, None, mat=M["gold"], size=0.75)

# ---- C. NH3 -> BCl3 addition compound ----
pair = empty("C Pair", SC + Vector((0, 0, 0.3)))
nh3, _ = bstick("C NH3", *SHAPES["NH3"][:2], (-4.6, 0, 0), 52.4, None, scale=1.2, parent=pair, lone=SHAPES["NH3"][2])
nh3.rotation_euler = (0, math.pi / 2, 0)
bcl, _ = bstick("C BCl3", *SHAPES["BCl3"][:2], (2.2, 0, 0), 52.8, None, scale=1.2, parent=pair)
bcl.rotation_euler = (0, 0, math.radians(35))
move(nh3, sec(61.0), sec(64.0), (-4.6, 0, 0), (-0.7, 0, 0))
dart = arrow("C Dative", 0.7, M["gold"], pair, (0.45, -0.6, 0.55), r=0.05, head=0.22)
appear(dart, sec(64.4))
big("Lbl C Donor", "donor", SC + Vector((-4.6, -0.6, 2.4)), 56.0, 69.8, mat=M["cyan"], size=0.5)
big("Lbl C Acc", "acceptor", SC + Vector((2.2, -0.6, 2.8)), 56.6, 64.8, mat=M["gold"], size=0.5)
big("Lbl C Add", "H₃N→BCl₃", SC + Vector((0.6, -0.6, -2.3)), 65.0, None, mat=M["gold"], size=0.65)
turn(pair, 70.4, 83.8, turns=0.15)
finish_film()
