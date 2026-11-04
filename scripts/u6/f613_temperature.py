# ---- Film 613: Effect of temperature on solubility (textbook pp.171-172: gases less soluble when hot, Fig 6.10;  (v4 captions)
# solids (i) rise KNO₃, CaCl₂, Pb(NO₃)₂ (ii) fall Ce₂(SO₄)₃, Li₂CO₃, CaO (iii) nearly flat NaCl, KBr (iv) Na₂SO₄
# rises to a peak at 32.4 °C then falls, Fig 6.11) ----
start_film("613", "613 Temperature and Solubility", 74.5)
END = scene.frame_end
SA, SB, SC, SD = (Vector((40 * k, 0, 0)) for k in range(4))

shot("Cam Gas", 0, 14, SA + Vector((0, 0, -1.1)), dist=14, pitch=0.1)
shot("Cam Gas Graph", 14, 30, SB + Vector((0, 0, -0.9)), dist=15, pitch=0.1)
shot("Cam Salt", 30, 42, SC + Vector((0, 0, -1.1)), dist=14, pitch=0.1)
shot("Cam Salt Graph", 42, None, SD + Vector((0, 0, -0.9)), dist=15.5, pitch=0.1)
for name, t in (("Gases", 0), ("Fig 6.10", 14), ("Solids", 30), ("Fig 6.11", 42)):
    act(name, sec(t))

say('A1', 'Warm drink: gas escapes', 0.1, 14)
say('B1', 'Hotter: less gas dissolves', 14, 24)
say('B2', 'Helium stays low', 24, 30)
say('C1', 'Most solids: more when hot', 30, 42)
say('D1', 'Rises: KNO₃', 42, 51)
say('D2', 'Falls: Ce₂(SO₄)₃', 51, 58)
say('D3', 'Hardly changes: NaCl', 58, 64)
say('D4', 'Na₂SO₄ peaks at 32.4 °C', 64, 74)

RISE = mat_emit("Curve Rise", (0.35, 1.0, 0.45), 2.0)
FALL = mat_emit("Curve Fall", (1.0, 0.3, 0.3), 2.0)
FLAT = mat_emit("Curve Flat", (0.3, 0.8, 1.0), 2.0)
PEAK = M["gold"]

# ---- A. a warm drink loses its gas ----
cA = SA + Vector((-0.6, 0, -1.9))
beaker("A", cA, 1.6, 2.6, 2.0, 0.3)
lo, hi = inside(cA, 1.6, 2.0)
gas("A Solv", 10, lo, hi, 0.0, 14.0, speed=0.8, r=0.11, mat=SOLV, seed=1, f_in=sec(0.6))
for k in range(10):
    tk = 5.0 + 0.6 * k
    rnd = random.Random(k)
    top = cA + Vector((rnd.uniform(-1.2, 1.2), -0.3, 4.6))
    g = life("A Gas %d" % k, lo.lerp(hi, 0.5), 0.0, [("box", lo, hi, tk, 1.4 if k < 10 else 0.8), ("to", top, tk + 1.2)],
             r=0.13, mat=MOL["white"], seed=10 + k, f_in=sec(1.0))
    hide_from(g, sec(tk + 1.2))
flame("A Flame", cA + Vector((0, 0, -0.95)), 3.0, 14.0, s=1.0)
col = thermo("A Thermo", cA + Vector((2.6, -0.2, 0.2)), h=2.8)
appear(col.parent, sec(1.0), dur=10)
level(col, 3.0, 0.2)
level(col, 11.0, 0.85)
big("Lbl A G", "gas escapes", cA + Vector((-1.8, -0.6, 3.6)), 6.0, None, mat=M["white"], size=0.45, align='RIGHT')

# ---- B. Fig 6.10: solubility of gases vs temperature ----
oB = axes("B Ax", SB + Vector((-4.6, 0, -2.4)), 8.6, 4.2, "°C", "solubility", 14.2, size=0.45)
sx, sz = 8.0 / 50, 4.0 / 2.5
for k, t in enumerate((10, 20, 30, 40, 50)):
    big("B Tick %d" % k, str(t), oB + Vector((t * sx, -0.2, -0.45)), 14.6, None, mat=M["dim"], size=0.32)
for k, (nm, pts, m, t0, dz) in enumerate((
        ("CH₄", [(5, 2.3), (15, 1.85), (25, 1.5), (35, 1.2), (45, 0.98)], FALL, 15.5, 0.25),
        ("O₂", [(5, 2.05), (15, 1.66), (25, 1.36), (35, 1.12), (45, 0.94)], mat_emit("Curve O2", (1.0, 0.45, 0.8), 2.0),
         17.5, 0.0),
        ("CO", [(5, 1.6), (15, 1.3), (25, 1.05), (35, 0.86), (45, 0.7)], FLAT, 19.5, -0.1),
        ("He", [(5, 0.45), (25, 0.42), (45, 0.4)], M["white"], 24.2, 0.15))):
    plot("B %s" % k, [oB + Vector((x * sx, -0.1, y * sz)) for x, y in pts], t0, 1.8, mat=m, r=0.05)
    big("B L %d" % k, nm, oB + Vector((pts[0][0] * sx - 0.25, -0.2, pts[0][1] * sz + dz)), t0, None, mat=m, size=0.4,
        align='RIGHT')

# ---- C. a salt dissolves more when the water is heated ----
cC = SC + Vector((-0.4, 0, -1.9))
beaker("C", cC, 1.6, 2.6, 2.0, 30.2)
lo, hi = inside(cC, 1.6, 2.0)
gas("C Solv", 10, lo, hi, 30.0, 42.0, speed=0.8, r=0.11, mat=SOLV, seed=21, f_in=sec(30.6))
seats = sorted(grid_pts(4, 3, 0.28, cC + Vector((0, -0.1, 0.16))), key=lambda p: (-p.z, abs(p.x)))
times = [31.6, 32.2, 32.8] + [36.0 + 0.45 * k for k in range(9)]
dissolve("C Salt", seats, lo, hi, 30.4, times, 42.0, r=0.13, mat=SOLU, seed=22, f_in=sec(30.6))
flame("C Flame", cC + Vector((0, 0, -0.95)), 34.5, 42.0, s=1.0)
col = thermo("C Thermo", cC + Vector((2.6, -0.2, 0.2)), h=2.8)
appear(col.parent, sec(30.8), dur=10)
level(col, 34.5, 0.2)
level(col, 39.0, 0.85)
big("Lbl C 1", "cold: some stays", cC + Vector((-1.8, -0.6, 2.9)), 33.4, 35.5, mat=M["cyan"], size=0.45,
    align='RIGHT')
big("Lbl C 2", "hot: all dissolves", cC + Vector((-1.8, -0.6, 2.9)), 40.0, None, mat=M["gold"], size=0.45,
    align='RIGHT')

# ---- D. Fig 6.11: four kinds of curve ----
oD = axes("D Ax", SD + Vector((-4.8, 0, -2.4)), 9.4, 4.4, "°C", "g per 100 g water", 42.2, size=0.45)
sx, sz = 9.0 / 100, 4.2 / 100
for k, t in enumerate((20, 40, 60, 80, 100)):
    big("D Tick %d" % k, str(t), oD + Vector((t * sx, -0.2, -0.45)), 42.6, None, mat=M["dim"], size=0.32)


def P2(x, y):
    return oD + Vector((x * sx, -0.1, y * sz))


curves = [
    ([(0, 13), (10, 21), (20, 32), (30, 46), (40, 64), (50, 85), (55, 100)], RISE, 43.5),
    ([(0, 59), (10, 65), (20, 74), (30, 90), (35, 100)], RISE, 44.5),
    ([(0, 38), (20, 54), (40, 72), (60, 91), (70, 100)], RISE, 45.5),
    ([(0, 20), (10, 14), (20, 10), (40, 6), (60, 4), (100, 3)], FALL, 52.0),
    ([(0, 35.7), (50, 37), (100, 39.8)], FLAT, 59.0),
    ([(0, 5), (10, 9), (20, 19), (32.4, 36)], PEAK, 65.0),
    ([(32.4, 36), (40, 31), (60, 25), (80, 23), (100, 23)], PEAK, 67.0),
]
for k, (pts, m, t0) in enumerate(curves):
    plot("D C %d" % k, [P2(x, y) for x, y in pts], t0, 1.6, mat=m, r=0.05)
big("Lbl D R", "rises", P2(78, 86), 47.0, 51.0, mat=RISE, size=0.5, align='LEFT')
big("Lbl D F", "falls", P2(40, 16), 53.6, 58.0, mat=FALL, size=0.5)
big("Lbl D N", "flat: NaCl", P2(102, 40), 60.4, 64.0, mat=FLAT, size=0.45, align='LEFT')
pk = sphere("D Peak", 0.14, PEAK, P2(32.4, 36) + Vector((0, -0.2, 0)), None, 20, 10)
appear(pk, sec(68.8), s=(0.14,) * 3)
vl = pcurve("D Peak Line", [P2(32.4, 0) + Vector((0, -0.05, 0)), P2(32.4, 36) + Vector((0, -0.05, 0))], PEAK, 0.02,
            "Models")
hide_until(vl, sec(69.2))
big("Lbl D P", "32.4 °C", P2(37, 44), 69.4, None, mat=PEAK, size=0.5, align='LEFT')
finish_film()
