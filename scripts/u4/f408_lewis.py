# ---- Film 408: Lewis structures (textbook p.105: Fig 4.13 water, Example 4.3 H2S, Practice 4.3 NH3,  (v4 captions)
# Test Yourself: electrons in single and double bonds) ----
start_film("408", "408 Lewis Structures", 66.5)
END = scene.frame_end
SA, SB, SC, SD = (Vector((40 * k, 0, 0)) for k in range(4))

shot("Cam Water", 0, 20, SA + Vector((0, 0, -0.1)), dist=12.5)
shot("Cam H2S", 20, 36, SB + Vector((0, 0, -0.1)), dist=12.5)
shot("Cam NH3", 36, 52, SC + Vector((0, 0, -0.6)), dist=12.5)
shot("Cam Count", 52, None, SD + Vector((0, 0, -0.3)), dist=14)
for name, t in (("Water", 0), ("Hydrogen sulphide", 20), ("Ammonia", 36), ("Counting electrons", 52)):
    act(name, sec(t))

say('A1', 'Only the outer electrons', 0.1, 7)
say('A2', 'Each shared pair becomes a line', 7, 13)
say('A3', 'Water: two lines, two lone pairs', 13, 20)
say('B1', 'Sulphur has 6, like oxygen', 20, 27)
say('B2', 'H–S–H with two lone pairs', 27, 36)
say('C1', 'Nitrogen has 5 outer electrons', 36, 43)
say('C2', 'Three lines, one lone pair', 43, 52)
say('D1', 'Single bond: 2 electrons', 52, 58)
say('D2', 'Double 4 · triple 6', 58, 66)

# ---- A. water: dots -> lines ----
lewis("A H2O", [("O", (0, 0.7)), ("H", (-1.5, -0.5)), ("H", (1.5, -0.5))], [(0, 1, 1), (0, 2, 1)],
      [(0, 60), (0, 120)], SA, 0.4, t_line=8.0, t1=19.8, size=0.9)
big("Lbl A Lone", "lone pairs", SA + Vector((0, -0.6, 2.4)), 13.4, 19.8, mat=M["gold"], size=0.5)

# ---- B. H2S ----
lewis("B H2S", [("H", (-1.6, 0)), ("S", (0, 0)), ("H", (1.6, 0))], [(0, 1, 1), (1, 2, 1)], [(1, 90), (1, 270)], SB, 20.4,
      t_line=28.0, t1=35.8, size=0.9)
big("Lbl B Dots", "H:S:H", SB + Vector((0, -0.6, 2.2)), 22.0, 27.8, mat=M["cyan"], size=0.55)
big("Lbl B Lines", "H–S–H", SB + Vector((0, -0.6, 2.2)), 28.4, 35.8, mat=M["gold"], size=0.55)

# ---- C. NH3 ----
lewis("C NH3", [("N", (0, 0.3)), ("H", (-1.6, 0.3)), ("H", (1.6, 0.3)), ("H", (0, -1.3))],
      [(0, 1, 1), (0, 2, 1), (0, 3, 1)], [(0, 90)], SC, 36.4, t_line=42.0, t1=51.8, size=0.9)
pulses("C Count", SC + Vector((0, -0.4, 0.3)), None, [45.0, 46.4], r=1.15, mat=M["green"])
big("Lbl C Eight", "8 ✓", SC + Vector((2.4, -0.6, 1.8)), 46.6, 51.8, mat=M["green"], size=0.6)

# ---- D. single / double / triple: count the dots, then see the lines ----
for k, (a, b, order, z, t) in enumerate((("Cl", "Cl", 1, 2.0, 52.6), ("O", "O", 2, 0.3, 58.4), ("N", "N", 3, -1.4, 61.4))):
    lewis("D %d" % k, [(a, (-2.4, z)), (b, (-0.6, z))], [(0, 1, order)], [], SD, t, t_line=t + 3.0, size=0.75)
    big("Lbl D %d" % k, ("2", "4", "6")[k] + " electrons", SD + Vector((2.2, -0.6, z)), t + 1.2, None,
        mat=(M["cyan"], M["gold"], M["green"])[k], size=0.5)
finish_film()
