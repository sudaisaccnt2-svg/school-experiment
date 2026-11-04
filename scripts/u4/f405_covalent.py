# ---- Film 405: Covalent bond (textbook pp.98-99: 4.3.2 sharing, H2, the dash, Example 4.1 HCl, Practice 4.1 H2O) ----  (v4 captions)
start_film("405", "405 Covalent Bond", 70.5)
END = scene.frame_end
SA, SB, SC = Vector((0, 0, 0)), Vector((40, 0, 0)), Vector((80, 0, 0))

shot("Cam H2", 0, 26, SA + Vector((0, 0, -0.4)), dist=13)
shot("Cam HCl", 26, 52, SB + Vector((0, 0, -0.4)), dist=13)
shot("Cam H2O", 52, None, SC + Vector((0, 0, -0.4)), dist=14)
for name, t in (("Sharing", 0), ("Hydrogen chloride", 26), ("Water", 52)):
    act(name, sec(t))

say('A1', 'Each hydrogen puts in one', 0.1, 8)
say('A2', 'The pair belongs to both', 8, 17)
say('A3', 'One shared pair = one line', 17, 26)
say('B1', 'Hydrogen meets chlorine', 26, 34)
say('B2', 'They share one pair', 34, 43)
say('B3', 'Three lone pairs on chlorine', 43, 52)
say('C1', 'Oxygen needs 2 more', 52, 60)
say('C2', 'Two shared pairs: H–O–H', 60, 70)

# ---- A. H + H share a pair -> H-H ----
HA = LRing("A HA", "H", SA + Vector((-3.4, 0, 0.6)), 1, 0.4, 25.8, r=1.0, angles=[0])
HB = LRing("A HB", "H", SA + Vector((3.4, 0, 0.6)), 1, 0.8, 25.8, r=1.0, emat=E_GOLD, angles=[180])
HA.move(3.0, 6.0, SA + Vector((-0.75, 0, 0.6)))
HB.move(3.0, 6.0, SA + Vector((0.75, 0, 0.6)))
share(HA, HB, 0, 0, 6.4)
pulses("A Pair", SA + Vector((0, -0.4, 0.6)), None, [9.0, 10.4], r=0.5, mat=M["gold"])
big("Lbl A Two", "2 ✓      2 ✓", SA + Vector((0, -0.6, 2.4)), 10.0, 25.8, mat=M["green"], size=0.55)
big("Lbl A Dash", "H–H", SA + Vector((0, -0.6, -1.6)), 18.4, 25.8, mat=M["gold"], size=0.75)

# ---- B. Example 4.1: H-Cl, 3 lone pairs on chlorine ----
H = LRing("B H", "H", SB + Vector((-3.6, 0, 0.6)), 1, 26.4, None, r=0.95, angles=[0])
Cl = LRing("B Cl", "Cl", SB + Vector((3.0, 0, 0.6)), 7, 26.8, None, r=1.25, emat=E_GOLD)   # seat 6 = the left single
H.move(30.0, 33.0, SB + Vector((-1.45, 0, 0.6)))
Cl.move(30.0, 33.0, SB + Vector((0.6, 0, 0.6)))
share(H, Cl, 0, 6, 33.4)
big("Lbl B Count", "2 ✓          8 ✓", SB + Vector((-0.3, -0.6, 2.5)), 36.0, 51.8, mat=M["green"], size=0.55)
pulses("B Lone", Cl.loc + Vector((0, -0.4, 0)), None, [44.0, 45.4], r=1.6, mat=M["gold"])
big("Lbl B Lone", "lone pairs", SB + Vector((3.3, -0.6, 0.6)), 44.2, None, mat=M["gold"], size=0.45)
big("Lbl B Dash", "H–Cl", SB + Vector((-0.4, -0.6, -1.7)), 47.0, None, mat=M["gold"], size=0.75)

# ---- C. Practice 4.1: H-O-H ----
O = LRing("C O", "O", SC + Vector((0, 0, 0.6)), 6, 52.4, None, r=1.25, angles=[76, 104, 256, 284, 0, 180])
HL = LRing("C HL", "H", SC + Vector((-4.2, 0, 0.6)), 1, 55.0, None, r=0.95, emat=E_GOLD, angles=[0])
HR = LRing("C HR", "H", SC + Vector((4.2, 0, 0.6)), 1, 55.4, None, r=0.95, emat=E_GOLD, angles=[180])
HL.move(60.2, 62.6, SC + Vector((-2.05, 0, 0.6)))
HR.move(63.2, 65.6, SC + Vector((2.05, 0, 0.6)))
share(HL, O, 0, 5, 62.8)
share(HR, O, 0, 4, 65.8)
big("Lbl C Six", "6 + 2 = 8 ✓", SC + Vector((0, -0.6, 2.6)), 67.0, None, mat=M["green"], size=0.55)
big("Lbl C Dash", "H–O–H", SC + Vector((0, -0.6, -1.7)), 68.0, None, mat=M["gold"], size=0.75)
finish_film()
