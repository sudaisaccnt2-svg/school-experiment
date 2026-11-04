# ---- Film 704: Rules for oxidation numbers (textbook p.186, rules i–x: free elements 0; simple ions = charge; H +1  (v4 captions)
# (NaH −1); O −2 (H₂O₂ −1, OF₂ +2); groups I, II, III +1 +2 +3; halogens −1; neutral sum 0 (H₂SO₄ S +6); ion sum =
# charge (MnO₄⁻ Mn +7); more electronegative atom negative; same element different numbers (CO +2, CO₂ +4)) ----
start_film("704", "704 Oxidation Number Rules", 88.5)
END = scene.frame_end
ST = [Vector((40 * k, 0, 0)) for k in range(8)]
TS = (0, 12, 24, 36, 47, 60, 72, 82)

names = ("Free elements", "Hydrogen", "Oxygen", "Groups", "Neutral sum", "Ion sum", "Electronegative", "Same element")
for k, t in enumerate(TS):
    shot("Cam %d" % k, t, TS[k + 1] if k + 1 < len(TS) else None, ST[k] + Vector((0, 0, -0.6)), dist=13, pitch=0.08)
    act(names[k], sec(t))

say('A1', 'Free element 0 · ion: its charge', 0.1, 12)
say('B1', 'H is +1 · in NaH −1', 12, 24)
say('C1', 'O is −2 · H₂O₂ −1', 24, 36)
say('D1', 'Groups I–III: +1 to +3', 36, 47)
say('E1', 'A molecule adds to 0', 47, 54)
say('E2', '2 − 8 + 6 = 0: S is +6', 54, 60)
say('F1', 'An ion adds to its charge', 60, 66)
say('F2', '7 − 8 = −1: Mn is +7', 66, 72)
say('G1', 'Greedier atom is negative', 72, 82)
say('H1', 'CO +2 · CO₂ +4', 82, 88)

# ---- A. free H₂ = 0; ions Na⁺ Ca²⁺ Al³⁺ Br⁻ ----
s = ST[0] + Vector((0, 0, 0.1))
molb("A H2", s, [("H", (-2.3, 0, 1.0), "0"), ("H", (-1.7, 0, 1.0), None)], 0.4, 2.0, k=1.3)
molb("A Na", s, [("Na", (1.9, 0, 1.0), "0")], 0.8, 2.6)
molb("A I", s, [("Na", (-3.3, 0, -1.4), "+1"), ("Ca", (-1.1, 0, -1.4), "+2"), ("Al", (1.1, 0, -1.4), "+3"),
                ("Br", (3.3, 0, -1.4), "−1")], 5.0, 7.0, step=0.7, k=0.9)

# ---- B. H₂O (H +1) and NaH (H −1) ----
s = ST[1] + Vector((0, 0, -0.6))
molb("B W", s, [("O", (-2.2, 0, 0.2), None), ("H", (-3.0, 0, -0.35), "+1"), ("H", (-1.4, 0, -0.35), "+1")], 12.3, 14.0)
molb("B N", s, [("Na", (1.8, 0, 0), "+1"), ("H", (2.75, 0, 0), "−1")], 17.0, 18.5, step=0.8)
big("Lbl B", "metal hydride", s + Vector((2.2, -0.6, -1.3)), 19.0, None, mat=M["white"], size=0.4)

# ---- C. H₂O (O −2), H₂O₂ (O −1), OF₂ (O +2) ----
s = ST[2] + Vector((0, 0, -0.6))
molb("C W", s, [("O", (-3.2, 0, 0.2), "−2"), ("H", (-3.95, 0, -0.35), None), ("H", (-2.45, 0, -0.35), None)], 24.3, 25.5)
molb("C P", s, [("O", (-0.4, 0, 0.1), "−1"), ("O", (0.4, 0, 0.1), "−1"), ("H", (-1.0, 0, -0.45), None),
                ("H", (1.0, 0, 0.6), None)], 28.0, 29.5, step=0.4)
molb("C F", s, [("O", (3.2, 0, 0.2), "+2"), ("F", (2.5, 0, -0.4), None), ("F", (3.9, 0, -0.4), None)], 31.5, 33.0)

# ---- D. Na +1, Mg +2, Al +3; Cl −1 in NaCl ----
s = ST[3] + Vector((0, 0, -0.6))
molb("D G", s, [("Na", (-2.6, 0, 1.2), "+1"), ("Mg", (0, 0, 1.2), "+2"), ("Al", (2.6, 0, 1.2), "+3")], 36.3, 37.5,
     step=0.7, k=0.85)
molb("D H", s, [("Na", (-0.5, 0, -0.8), None), ("Cl", (0.6, 0, -0.8), "−1")], 41.0, 42.0, k=0.85)

# ---- E. H₂SO₄: badges, S unknown, then +6 ----
s = ST[4] + Vector((0, 0, -0.6))
molb("E", s, [("S", (0, 0, 0), None), ("O", (-1.0, 0, 0.7), "−2"), ("O", (1.0, 0, 0.7), "−2"),
              ("O", (-1.0, 0, -0.7), "−2"), ("O", (1.0, 0, -0.7), "−2"), ("H", (-1.75, 0, -1.2), "+1"),
              ("H", (1.75, 0, -1.2), "+1")], 47.3, 49.0, step=0.4, bsize=0.34)
badge("E Q", "?", s + Vector((0, -0.8, 0.95)), 50.0, 54.0, size=0.5)
badge("E S", "+6", s + Vector((0, -0.8, 0.95)), 54.3, size=0.5)

# ---- F. MnO₄⁻: Mn = +7 ----
s = ST[5] + Vector((0, 0, -0.6))
molb("F", s, [("Mn", (0, 0, 0), None), ("O", (-1.0, 0, 0.75), "−2"), ("O", (1.0, 0, 0.75), "−2"),
              ("O", (-1.0, 0, -0.75), "−2"), ("O", (1.0, 0, -0.75), "−2")], 60.3, 61.5, step=0.4, bsize=0.34)
badge("F Q", "?", s + Vector((0, -0.8, 1.0)), 62.5, 66.0, size=0.5)
badge("F S", "+7", s + Vector((0, -0.8, 1.0)), 66.3, size=0.5)
big("Lbl F", "charge −1", s + Vector((2.6, -0.6, 0)), 63.0, None, mat=M["cyan"], size=0.42)

# ---- G. HCl: the shared pair slides to Cl ----
s = ST[6] + Vector((0, 0, -0.6))
molb("G", s, [("H", (-0.7, 0, 0), "+1"), ("Cl", (0.5, 0, 0), "−1")], 72.3, 77.0, step=0.6, k=1.4)
for k in range(2):
    e = electron("G e %d" % k, None, s + Vector((-0.15, -1.1, 0.12 - 0.24 * k)), 0.12, mat=E_BLUE)
    appear(e, sec(73.5), s=tuple(e.scale))
    move(e, sec(75.0), sec(76.5), s + Vector((-0.15, -1.1, 0.12 - 0.24 * k)), s + Vector((0.35, -1.1, 0.12 - 0.24 * k)))

# ---- H. CO and CO₂ ----
s = ST[7] + Vector((0, 0, -0.6))
molb("H A", s, [("C", (-2.6, 0, 0), "+2"), ("O", (-1.75, 0, 0), None)], 82.3, 83.5)
molb("H B", s, [("O", (1.15, 0, 0), None), ("C", (2.0, 0, 0), "+4"), ("O", (2.85, 0, 0), None)], 84.0, 85.2)
finish_film()
