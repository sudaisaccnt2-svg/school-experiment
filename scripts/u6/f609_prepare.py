# ---- Film 609: Preparing a molar solution (textbook p.164 Activity 6.1: 0.5000 M CuSO₄·5H₂O in a 1.0 dm³ volumetric  (v4 captions)
# flask, 7 steps; p.154 Skill Development: 2 M NaOH (20 g in 250 mL), 0.1 M NaCl (5.85 g in 1000 mL)) ----
start_film("609", "609 Making a Molar Solution", 82.5)
END = scene.frame_end
SA, SB = (Vector((40 * k, 0, 0)) for k in range(2))

shot("Cam Activity", 0, 64, SA + Vector((0, 0, -0.5)), dist=15, pitch=0.1)
shot("Cam Skill", 64, None, SB + Vector((0.4, 0, -0.9)), dist=16, pitch=0.1)
for name, t in (("Weigh", 0), ("Dissolve", 9), ("Rinse", 18), ("Shake", 27), ("Fill to the mark", 35), ("Invert", 43),
                ("Result", 53), ("Skill Development", 64)):
    act(name, sec(t))

say('A1', 'Weigh 124.8 g', 0.1, 9)
say('A2', 'Dissolve, pour into the flask', 9, 18)
say('A3', 'Rinse in, add water', 18, 27)
say('A4', 'Stopper and shake', 27, 35)
say('A5', 'Fill to the mark', 35, 43)
say('A6', 'Turn it over 10 times', 43, 53)
say('A7', '0.5000 mol in 1 dm³', 53, 64)
say('B1', '20 g to 250 mL: 2 M', 64, 74)
say('B2', '5.85 g to 1000 mL: 0.1 M', 74, 82)

CRY = mat_emit("CuSO4 Crystal", (0.15, 0.5, 1.0), 2.2)
cF = SA + Vector((1.4, 0, -2.6))
fl, lb, ln = flask("A", cF, R=1.1, neck=1.8, t_in=0.4, fill=BLUE_SOL)
# liquid grows: a little after step 2, more after step 3, full neck at step 5
lb.scale = (0.001,) * 3
for t, s in ((13.0, 0.001), (16.0, 0.55), (21.0, 0.55), (25.0, 0.97), (60.0, 0.97)):
    kf(lb, "scale", sec(t), (s,) * 3)
for t, s in ((0.0, 0.001), (24.0, 0.001), (26.0, 0.25), (37.0, 0.25), (41.0, 1.0)):
    kf(ln, "scale", sec(t), (1, 1, s))
# balance with a weighing beaker of blue crystals
bal, _ = scale_bal("A", cF + Vector((-5.0, 0, 0)), 0.3, "124.8 g", t1=9.5)
cup = empty("A Cup", cF + Vector((-5.0, 0, 0.56)))
jar("A Cup Glass", 0.6, 0.9, (0, 0, 0), parent=cup)
crys = [box("A Cry %d" % k, (0.18, 0.18, 0.14), CRY, ((k % 4 - 1.5) * 0.2, -0.05, 0.1 + 0.15 * (k // 4)), cup)
        for k in range(8)]
appear(cup, sec(1.5), dur=10)
# step 2: the cup flies over the funnel and tips
funnel = cyl("A Funnel", 0.65, 0.12, 0.7, GLASS, cF + Vector((0, 0, 2 * 1.1 + 1.8 + 0.35)), None, segs=32)
hide_until(funnel, sec(10.0))
hide_from(funnel, sec(26.5))
above = cF + Vector((-0.9, 0, 2 * 1.1 + 1.8 + 1.3))
move(cup, sec(11.0), sec(12.5), cF + Vector((-5.0, 0, 0.56)), above)
kf(cup, "rotation_euler", sec(12.5), (0, 0, 0))
kf(cup, "rotation_euler", sec(13.5), (0, math.radians(110), 0))
kf(cup, "rotation_euler", sec(16.5), (0, math.radians(110), 0))
kf(cup, "rotation_euler", sec(17.5), (0, 0, 0))
kf(cup, "rotation_euler", sec(20.0), (0, 0, 0))
kf(cup, "rotation_euler", sec(21.0), (0, math.radians(110), 0))
kf(cup, "rotation_euler", sec(23.0), (0, math.radians(110), 0))
kf(cup, "rotation_euler", sec(24.0), (0, 0, 0))
move(cup, sec(24.0), sec(25.5), above, cF + Vector((-5.0, 0, 0.56)))
for cr in crys:
    hide_from(cr, sec(13.6))
# step 4 + 6: stopper, shake, invert
stop = cyl("A Stopper", 0.36, 0.28, 0.4, mat_pbr("Stopper", (0.9, 0.9, 0.92), roughness=0.4),
           (0, 0, 2 * 1.1 + 1.8 + 0.15), fl, segs=24)
hide_until(stop, sec(27.5))
hide_from(stop, sec(35.0))
stop2 = cyl("A Stopper 2", 0.36, 0.28, 0.4, mat_pbr("Stopper", (0.9, 0.9, 0.92), roughness=0.4),
            (0, 0, 2 * 1.1 + 1.8 + 0.15), fl, segs=24)
hide_until(stop2, sec(43.3))
kf(fl, "rotation_euler", 1, (0, 0, 0))
kf(fl, "rotation_euler", sec(28.0), (0, 0, 0))
for k, t in enumerate([28.5 + 0.5 * j for j in range(10)]):
    kf(fl, "rotation_euler", sec(t), (0, math.radians(14 if k % 2 else -14), 0))
kf(fl, "rotation_euler", sec(34.0), (0, 0, 0))
kf(fl, "rotation_euler", sec(44.0), (0, 0, 0))
for k in range(5):
    t = 44.5 + 1.6 * k
    kf(fl, "rotation_euler", sec(t + 0.8), (0, math.pi, 0))
    kf(fl, "rotation_euler", sec(t + 1.6), (0, 0, 0))
kf(fl, "location", sec(44.0), cF)
for k in range(5):
    t = 44.5 + 1.6 * k
    kf(fl, "location", sec(t + 0.8), cF + Vector((0, 0, 4.0)))
    kf(fl, "location", sec(t + 1.6), cF)
# step 5: a dropper adds the last drops
drop = empty("A Dropper", cF + Vector((0, 0, 2 * 1.1 + 1.8 + 1.2)))
cyl("A Dropper Glass", 0.08, 0.08, 0.9, GLASS, (0, 0, 0), drop, segs=12)
sphere("A Dropper Bulb", 0.18, M["red"], (0, 0, 0.55), drop, 16, 8)
hide_until(drop, sec(36.0))
hide_from(drop, sec(42.0))
big("Lbl A W", "124.8 g", cF + Vector((-5.0, -0.6, 2.2)), 1.0, 9.5, mat=M["gold"], size=0.5)
big("Lbl A F", "1.0 dm³ flask", cF + Vector((-2.4, -0.6, 1.3)), 10.5, 26.0, mat=M["cyan"], size=0.5, align='RIGHT')
big("Lbl A Mk", "mark", cF + Vector((0.6, -0.6, 2 * 1.1 + 1.8 * 0.55)), 36.0, 43.0, mat=M["white"], size=0.45,
    align='LEFT')
big("Lbl A R", "0.5000 M", cF + Vector((-5.0, -0.6, 2.6)), 54.0, None, mat=M["gold"], size=0.8)

# ---- B. Skill Development: two flasks ----
for k, (g_, v, r_, fill_scale, t0) in enumerate((("20 g NaOH", "250 mL", "2 M", 0.6, 64.0),
                                                 ("5.85 g NaCl", "1000 mL", "0.1 M", 1.0, 74.0))):
    c = SB + Vector((-3.4 + 7.4 * k, 0, -2.4))
    R = 1.3 * fill_scale ** (1 / 3)
    flask("B %d" % k, c, R=R, neck=1.8, t_in=t0 + 0.3, fill=WATER)
    big("Lbl B G %d" % k, g_, c + Vector((-R - 0.5, -0.6, R)), t0 + 1.0, None, mat=M["gold"], size=0.5, align='RIGHT')
    big("Lbl B V %d" % k, v, c + Vector((0, -0.6, -0.45)), t0 + 2.0, None, mat=M["cyan"], size=0.45)
    big("Lbl B R %d" % k, r_, c + Vector((R + 0.6, -0.6, R)), t0 + 4.0, None, mat=M["white"], size=0.6, align='LEFT')
finish_film()
