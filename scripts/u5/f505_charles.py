# ---- Film 505: Charles's law (textbook pp.129-133: 1787 Charles, V ∝ T, V/T = Kc, V1/T1 = V2/T2, Fig 5.7 apparatus,  (v4 captions)
# K = °C + 273, Fig 5.8 line, Fig 5.9 diagram, Example 5.2, Activity 5.2 balloon) ----
start_film("505", "505 Charles Law", 96.5)
END = scene.frame_end
SA, SB, SC, SD, SE, SF = (Vector((40 * k, 0, 0)) for k in range(6))

shot("Cam Heat", 0, 26, SA + Vector((0.9, 0, -0.2)), dist=15.5, pitch=0.1)
shot("Cam Kelvin", 26, 40, SB + Vector((0, 0, -1.1)), dist=15)
shot("Cam Graph", 40, 56, SC + Vector((0, 0, -0.1)), dist=15.5)
shot("Cam Fig 5.9", 56, 64, SD + Vector((0, 0, -0.2)), dist=15)
shot("Cam Example", 64, 80, SE + Vector((0.9, 0, -0.2)), dist=15.5, pitch=0.1)
shot("Cam Balloon", 80, None, SF + Vector((0, 0, 0.0)), dist=15)
for name, t in (("Heat the gas", 0), ("Kelvin", 26), ("Graph", 40), ("Fig 5.9", 56), ("Example 5.2", 64),
                ("Activity 5.2", 80)):
    act(name, sec(t))

say('A1', 'Charles: piston, same pressure', 0.1, 6)
say('A2', 'Heat: molecules push harder', 6, 13)
say('A3', 'Hotter: bigger volume', 13, 20)
say('A4', 'Cooler: smaller volume', 20, 26)
say('B1', 'K = °C + 273', 26, 33)
say('B2', 'Gas laws use kelvin', 33, 40)
say('C1', 'Volume vs kelvin: straight line', 40, 46)
say('C2', 'V / T = Kc', 46, 51)
say('C3', 'V₁/T₁ = V₂/T₂', 51, 56)
say('D', 'Temperature up, volume up', 56, 64)
say('E1', '3 dm³ at 300 K → 400 K?', 64, 71)
say('E2', '3 × 400 ÷ 300 = 4 dm³', 71, 80)
say('F1', 'Balloon on a heated flask', 80, 86)
say('F2', 'The balloon grows', 86, 96)

R, Hc, Z0 = 1.3, 3.6, -1.5


def heated_rig(key, base, KP, t_in, t_fire, t_out_fire, speed):
    cg, pis, nd = rig(key + " Rig", base + Vector((0, 0, Z0)), R, Hc, t_in)
    key_piston(pis, KP)
    needle_to(nd, 0, 0.35)
    flame(key + " Flame", base + Vector((0, 0, Z0 - 0.75)), t_fire, t_out_fire, s=0.7)
    appear(cyl(key + " Burner", 0.22, 0.3, 0.3, METAL, base + Vector((0, 0, Z0 - 0.9))), sec(t_in), dur=10)
    pz = zpath(KP)
    gas(key + " Mol", 14, base + Vector((-R + 0.35, -0.5, Z0)), lambda t: base + Vector((R - 0.35, 0.5, Z0 + pz(t) - 0.1)),
        t_in, END / FPS, speed=speed, r=0.13, seed=len(key), f_in=sec(t_in + 0.5))
    return cg, pis, nd


def side_label(key, txt, base, z, t0, t1, mat):
    big(key, txt, base + Vector((-R - 0.4, -0.6, Z0 + z)), t0, t1, mat=mat, size=0.5, align='RIGHT')


# ---- A. heat → piston rises, cool → it falls; the dial stays still ----
KA = [(0, 1.8), (7, 1.8), (13, 3.0), (20, 3.0), (24, 1.8)]
heated_rig("A", SA, KA, 0.2, 6.0, 20.0, lambda t: 1.6 if t < 6 else (1.6 + 2.4 * min(1, (t - 6) / 6) if t < 20 else
                                                                    max(1.6, 4.0 - 2.4 * (t - 20) / 4)))
col = thermo("A Thermo", SA + Vector((4.5, -0.1, Z0)), h=3.0)
appear(col.parent, sec(0.4), dur=10)
for t, v in ((0, 0.3), (6, 0.3), (13, 0.8), (20, 0.8), (24, 0.3)):
    level(col, t, v)
side_label("Lbl A V1", "small V", SA, 0.9, 1.0, 7.5, M["cyan"])
side_label("Lbl A V2", "big V", SA, 1.5, 13.0, 20.0, M["green"])
big("Lbl A Hot", "hot", SA + Vector((4.5, -0.6, Z0 + 3.6)), 13.0, 20.0, mat=M["red"], size=0.5)

# ---- B. the Kelvin scale next to Celsius ----
TB = thermo("B Thermo", SB + Vector((0, -0.1, -2.4)), h=4.0)
appear(TB.parent, sec(26.2), dur=10)
level(TB, 26, 0.05)
level(TB, 29, 0.74)
level(TB, 33, 0.99)
for k, (z, txt, t0) in enumerate(((-2.2, "−273 °C = 0 K", 33.4), (0.51, "0 °C = 273 K", 27.0), (1.5, "100 °C = 373 K", 30.0))):
    pcurve("B Tick %d" % k, [SB + Vector((-0.35, -0.2, z)), SB + Vector((0.35, -0.2, z))], M["white"], 0.025, "Models")
    big("Lbl B %d" % k, txt, SB + Vector((0.7, -0.6, z)), t0, None, mat=(M["cyan"], M["white"], M["red"])[k], size=0.5,
        align='LEFT')

# ---- C. Fig 5.8: a straight line; 300 K → 3 dm³, 400 K → 4 dm³ ----
o = axes("C Ax", SC + Vector((-5.0, 0, -2.2)), 9.0, 4.6, "T (K)", "V (dm³)", 40.2, size=0.5)
sx, sz = 8.0 / 500, 4.0 / 5
plot("C Line", [o, o + Vector((480 * sx, 0, 4.8 * sz))], 41.0, 3.0, r=0.05)
for k, (T_, V_) in enumerate(((300, 3), (400, 4))):
    p = o + Vector((T_ * sx, -0.05, V_ * sz))
    appear(sphere("C Pt %d" % k, 0.16, M["gold"], p, None, 16, 8), sec(44.2 + 0.8 * k), s=(0.16,) * 3)
    big("Lbl C %d" % k, "%d ÷ %d = 0.01" % (V_, T_), p + Vector((0.4, -0.6, -0.6 + 0.0 * k)), 46.5 + 1.0 * k, 56.0,
        mat=M["green"], size=0.42, align='LEFT')

# ---- D. Fig 5.9: T letters and V letters both grow ----
for k in range(4):
    x = -4.5 + 3.0 * k
    s = 0.55 + 0.35 * k
    lt = shadow(_text("D Fig T %d" % k, "T", SD + Vector((x - 0.5, -0.3, -1.4)), s, M["red"], weight="semibold"))
    lv = shadow(_text("D Fig V %d" % k, "V", SD + Vector((x + 0.5, -0.3, 0.6)), s, M["cyan"], weight="semibold"))
    appear(lt, sec(56.6 + 0.8 * k))
    appear(lv, sec(57.0 + 0.8 * k))

# ---- E. Example 5.2: 300 K → 400 K, 3 dm³ → 4 dm³ ----
KE = [(0, 1.8), (72, 1.8), (76, 2.4)]
heated_rig("E", SE, KE, 64.2, 71.5, None, lambda t: 1.8 if t < 72 else 2.4)
col = thermo("E Thermo", SE + Vector((4.5, -0.1, Z0)), h=3.0)
appear(col.parent, sec(64.4), dur=10)
level(col, 64, 0.45)
level(col, 72, 0.45)
level(col, 76, 0.6)
big("Lbl E T1", "300 K", SE + Vector((4.5, -0.6, Z0 + 3.6)), 64.8, 72.5, mat=M["red"], size=0.5)
big("Lbl E T2", "400 K", SE + Vector((4.5, -0.6, Z0 + 3.6)), 72.8, None, mat=M["red"], size=0.5)
side_label("Lbl E V1", "3 dm³", SE, 0.9, 65.2, 72.0, M["cyan"])
side_label("Lbl E V2", "4 dm³", SE, 1.2, 76.2, None, M["green"])

# ---- F. Activity 5.2: a balloon on a flask on a hot plate ----
c = SF + Vector((0, 0, -0.65))
fl = ring_curve("F Flask", 1.3, GLASS, None, 0.035, loc=c)
fl.rotation_euler = (math.pi / 2, 0, 0)
appear(fl, sec(80.2), dur=10)
for k, sx_ in enumerate((-1, 1)):
    n = pcurve("F Neck %d" % k, [c + Vector((0.32 * sx_, -0.05, 1.26)), c + Vector((0.32 * sx_, -0.05, 2.0))], GLASS, 0.035,
               "Models")
    hide_until(n, sec(80.3))
plate = box("F Plate", (3.4, 2.2, 0.4), DARK, c + Vector((0, 0, -1.55)))
appear(plate, sec(80.2), dur=10)
glow_top = box("F Plate Hot", (2.6, 1.8, 0.04), HOT, c + Vector((0, 0, -1.33)))
hide_until(glow_top, sec(85.5))
BAL = mat_emit("Balloon Skin", (1.0, 0.3, 0.45), 0.8, alpha=0.3)
bal = sphere("F Balloon", 0.45, BAL, c + Vector((0, 0, 2.35)), None, 32, 16)
appear(bal, sec(81.0), s=(0.45, 0.45, 0.4))
kf(bal, "scale", sec(87.0), (0.45, 0.45, 0.4))
kf(bal, "scale", sec(94.0), (1.1, 1.1, 1.0))
kf(bal, "location", sec(87.0), c + Vector((0, 0, 2.35)))
kf(bal, "location", sec(94.0), c + Vector((0, 0, 2.95)))
hot = lambda t: 1.4 if t < 86 else 3.0
gas("F Air", 12, c + Vector((-0.85, -0.4, -0.85)), c + Vector((0.85, 0.4, 0.85)), 80.0, 100.0, speed=hot, r=0.12, seed=91,
    f_in=sec(81.5))
bz = zpath([(0, 0.0), (87, 0.0), (94, 1.0)])
gas("F Bal", 4, lambda t: c + Vector((-0.25 - 0.6 * bz(t), -0.2, 2.15 - 0.0 * bz(t) + 0.9 * bz(t) - 0.9 * bz(t))),
    lambda t: c + Vector((0.25 + 0.6 * bz(t), 0.2, 2.55 + 1.2 * bz(t))), 80.0, 100.0, speed=hot, r=0.12, seed=92,
    f_in=sec(87.0))
big("Lbl F Hot", "hot plate", c + Vector((2.0, -1.4, -1.55)), 85.6, None, mat=M["red"], size=0.45, align='LEFT')
finish_film()
