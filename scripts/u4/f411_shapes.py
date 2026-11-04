# ---- Film 411: Shapes of molecules (textbook pp.109-110: Fig 4.18 CO2, SO2, BCl3, H2O, CH4, NH3) ----  (v4 captions)
start_film("411", "411 Shapes of Molecules", 72.5)
END = scene.frame_end
ROWS = [  # key, formula, shape name, angle text, t0
    ("CO2", "CO₂", "linear", "180°", 0),
    ("SO2", "SO₂", "bent", "119.5°", 10),
    ("BCl3", "BCl₃", "trigonal planar", "120°", 20),
    ("H2O", "H₂O", "bent (angular)", "104.5°", 30),
    ("CH4", "CH₄", "tetrahedral", "109.5°", 40),
    ("NH3", "NH₃", "trigonal pyramidal", "106.7°", 50),
]
ST = [Vector((40 * k, 0, 0)) for k in range(7)]
for k, (key, f, nm, ang, t0) in enumerate(ROWS):
    shot("Cam %s" % key, t0, t0 + 10, ST[k] + Vector((0, 0, -0.1)), dist=15)
    act(f, sec(t0))
shot("Cam All", 60, None, ST[6] + Vector((0, 0, -0.3)), dist=19)
act("All six", sec(60))

say('A1', 'CO₂: linear, 180°', 0.1, 10)
say('A2', 'SO₂: bent', 10, 20)
say('A3', 'BCl₃: trigonal planar, 120°', 20, 30)
say('A4', 'Water: bent, 104.5°', 30, 40)
say('A5', 'Methane: tetrahedral, 109.5°', 40, 50)
say('A6', 'Ammonia: trigonal pyramidal, 107°', 50, 60)
say('B1', 'Lone pairs push bonds closer', 60, 72)

for k, (key, f, nm, ang, t0) in enumerate(ROWS):
    atoms, bonds, lone = SHAPES[key]
    g, _ = bstick("M %s" % key, atoms, bonds, ST[k] + Vector((0, 0, 0.5)), t0 + 0.4, None, scale=1.4, lone=lone)
    if key == "CH4":
        g.rotation_euler = (math.radians(15), 0, math.radians(20))
    turn(g, t0 + 2.0, t0 + 9.8, turns=0.5 if key in ("CH4", "NH3") else 0.12)
    big("Lbl %s F" % key, f, ST[k] + Vector((0, -0.6, 2.7)), t0 + 0.8, t0 + 9.8, mat=M["white"], size=0.6)
    big("Lbl %s N" % key, nm, ST[k] + Vector((0, -0.6, -1.5)), t0 + 1.6, t0 + 9.8, mat=M["gold"], size=0.55)
    big("Lbl %s A" % key, ang, ST[k] + Vector((3.4, -0.6, 0.5)), t0 + 2.4, t0 + 9.8, mat=M["cyan"], size=0.5)

# ---- B. all six side by side ----
for k, (key, f, nm, ang, t0) in enumerate(ROWS):
    atoms, bonds, lone = SHAPES[key]
    x, z = -5.0 + 5.0 * (k % 3), 1.5 - 3.6 * (k // 3) - (0.4 if key == "BCl3" else 0)
    g, _ = bstick("All %s" % key, atoms, bonds, ST[6] + Vector((x, 0, z)), 60.4 + 0.5 * k, None, scale=1.05, lone=lone)
    turn(g, 64.0, 79.8, turns=0.3)
    sy = _text("All %s Sym" % key, f, ST[6] + Vector((x, -0.4, z - 1.55)), 0.5, M["white"], weight="semibold")
    shadow(sy)
    appear(sy, sec(60.6 + 0.5 * k))
finish_film()
