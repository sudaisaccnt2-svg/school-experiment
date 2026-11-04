# ---- Film 506: The liquid state and evaporation (textbook pp.133-135: liquid state, 5.3 i volume and shape,  (v4 captions)
# ii evaporation Fig 5.10, cooling, factors: a surface area, b temperature, c intermolecular force) ----
start_film("506", "506 Liquids and Evaporation", 76.5)
END = scene.frame_end
SA, SB, SC, SD, SE = (Vector((40 * k, 0, 0)) for k in range(5))

shot("Cam Liquid", 0, 18, SA + Vector((0, 0, -0.4)), dist=15, pitch=0.1)
shot("Cam Evaporation", 18, 40, SB + Vector((0, 0, -0.7)), dist=13.5, pitch=0.1)
shot("Cam Surface", 40, 52, SC + Vector((0, 0, -0.4)), dist=15, pitch=0.1)
shot("Cam Temperature", 52, 62, SD + Vector((0, 0, -0.4)), dist=15, pitch=0.1)
shot("Cam Forces", 62, None, SE + Vector((0, 0, -0.4)), dist=15, pitch=0.1)
for name, t in (("Liquid state", 0), ("Evaporation", 18), ("Surface area", 40), ("Temperature", 52), ("Forces", 62)):
    act(name, sec(t))

say('A1', 'Liquid: close, still sliding', 0.1, 9)
say('A2', 'Fixed volume, takes the shape', 9, 18)
say('B1', 'Fastest ones break free', 18, 26)
say('B2', 'Evaporation: no boiling needed', 26, 33)
say('B3', 'Fast ones leave: it cools', 33, 40)
say('C', 'More surface: faster', 40, 52)
say('D', 'Warmer: faster', 52, 62)
say('E1', 'Alcohol beats water', 62, 70)
say('E2', 'Water holds on tighter', 70, 76)

# ---- A. the same liquid in a tall box and a wide box ----
dish("A Tall", SA + Vector((-3.2, 0, -2.2)), 1.6, 1.2, 4.0, 2.6, 24, 0.0, 18.0, speed=0.9, r=0.15, seed=3, f_in=sec(0.4))
dish("A Wide", SA + Vector((2.6, 0, -2.2)), 4.6, 1.2, 2.0, 0.9, 24, 0.0, 18.0, speed=0.9, r=0.15, seed=4, f_in=sec(9.4))
big("Lbl A Same", "same amount", SA + Vector((0, -0.6, 2.4)), 10.5, None, mat=M["gold"], size=0.55)

# ---- B. Fig 5.10: fast molecules leave the surface; the thermometer drops ----
liq, esc = dish("B Beaker", SB + Vector((0, 0, -1.5)), 5.0, 1.4, 2.6, 1.6, 34, 18.0, 40.0,
                esc=[20.0 + 0.9 * k for k in range(20)], speed=1.1, r=0.14, seed=11)
col = thermo("B Thermo", SB + Vector((1.9, -0.75, -1.3)), h=3.4)
appear(col.parent, sec(18.4), dur=10)
level(col, 18, 0.6)
level(col, 33, 0.6)
level(col, 39, 0.35)
big("Lbl B Fast", "fast ones escape", SB + Vector((-2.2, -0.6, 1.9)), 21.0, None, mat=M["gold"], size=0.5)
big("Lbl B Cool", "colder", SB + Vector((3.4, -0.6, 1.9)), 35.0, None, mat=M["cyan"], size=0.5)

# ---- C. narrow vs wide surface ----
dish("C Narrow", SC + Vector((-3.6, 0, -2.0)), 1.6, 1.2, 2.6, 2.0, 18, 40.0, 52.0, esc=[42.0, 46.0, 50.0], seed=21)
dish("C Wide", SC + Vector((2.4, 0, -2.0)), 5.0, 1.2, 1.4, 0.7, 18, 40.0, 52.0,
     esc=[41.4 + 0.75 * k for k in range(13)], seed=22)
big("Lbl C S", "small surface", SC + Vector((-3.6, -0.6, 1.6)), 40.8, None, size=0.48)
big("Lbl C B", "big surface", SC + Vector((2.4, -0.6, 1.6)), 41.2, None, mat=M["gold"], size=0.48)

# ---- D. cold vs warm ----
dish("D Cold", SD + Vector((-3.0, 0, -1.6)), 3.4, 1.2, 1.8, 1.1, 20, 52.0, 62.0, esc=[54.0, 58.5], speed=0.7, seed=31)
dish("D Warm", SD + Vector((3.0, 0, -1.6)), 3.4, 1.2, 1.8, 1.1, 20, 52.0, 62.0,
     esc=[53.0 + 0.6 * k for k in range(14)], speed=1.8, seed=32)
flame("D Flame", SD + Vector((3.0, 0, -2.4)), 52.4, None, s=0.7)
big("Lbl D C", "cool", SD + Vector((-3.0, -0.6, 2.5)), 52.8, None, mat=M["cyan"], size=0.5)
big("Lbl D W", "warm", SD + Vector((3.0, -0.6, 2.5)), 53.2, None, mat=M["red"], size=0.5)

# ---- E. water vs alcohol ----
ALC = mat_emit("Mol Alcohol", (0.85, 0.5, 1.0), 1.4)
dish("E Water", SE + Vector((-3.0, 0, -1.6)), 3.4, 1.2, 1.8, 1.1, 20, 62.0, 80.0, esc=[64.0, 69.0, 74.0], seed=41)
dish("E Alcohol", SE + Vector((3.0, 0, -1.6)), 3.4, 1.2, 1.8, 1.1, 20, 62.0, 80.0, mat=ALC,
     esc=[63.0 + 0.7 * k for k in range(22)], seed=42)
big("Lbl E W", "water", SE + Vector((-3.0, -0.6, 2.5)), 62.8, None, mat=M["cyan"], size=0.5)
big("Lbl E A", "alcohol", SE + Vector((3.0, -0.6, 2.5)), 63.2, None, mat=ALC, size=0.5)
finish_film()
