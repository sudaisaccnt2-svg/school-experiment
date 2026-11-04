# ---- Film 714: NaOH from brine: the Nelson cell (textbook pp.204-205: 7.6.2 concentrated NaCl solution (brine);  (v4 captions)
# Fig 7.10: perforated U-shaped steel tube = cathode, lined with asbestos; graphite anode hangs inside; Cl₂ at the anode,
# H₂ at the cathode, NaOH drips into the catch basin; 2NaCl → 2Na⁺ + 2Cl⁻, H₂O ⇌ H⁺ + OH⁻; H⁺ is reduced (not Na⁺):
# 2H⁺ + 2e⁻ → H₂; Na⁺ + OH⁻ → NaOH; 2Cl⁻ → Cl₂ + 2e⁻; overall 2NaCl + 2H₂O → 2NaOH + H₂ + Cl₂; asbestos is toxic and is
# being replaced by polymers) ----
start_film("714", "714 Nelson Cell", 72.5)
END = scene.frame_end
S0 = Vector((0, 0, 0))

shot("Cam Wide", 0, 14, S0 + Vector((0, 0, -1.0)), dist=15, pitch=0.1)
shot("Cam Ions", 14, 24, S0 + Vector((0, 0, -1.0)), dist=13, pitch=0.1)
shot("Cam Cathode", 24, 44, S0 + Vector((0, 0, -1.3)), dist=13.5, pitch=0.1)
shot("Cam Anode", 44, 54, S0 + Vector((0, 0, -1.2)), dist=13.5, pitch=0.1)
shot("Cam End", 54, None, S0 + Vector((0, 0, -1.0)), dist=15, pitch=0.1)
for name, t in (("Nelson cell", 0), ("Ions", 14), ("Cathode", 24), ("Anode", 44), ("Overall", 54)):
    act(name, sec(t))

say('A1', 'NaOH from brine', 0.1, 7)
say('A2', 'U-tube cathode, graphite anode', 7, 14)
say('B1', 'Brine is full of ions', 14, 24)
say('C1', 'H⁺ win the electrons', 24, 32)
say('C2', 'Hydrogen bubbles out', 32, 38)
say('C3', 'Caustic soda drips down', 38, 44)
say('D1', 'Chlorine leaves the top', 44, 54)
say('E1', 'Three products at once', 54, 62)
say('E2', 'Asbestos harms the lungs', 62, 72)

c0 = S0 + Vector((0, 0, -1.8))
# outer steel-mesh container (open box) with brine
tank("A", c0 + Vector((0, 0, -0.6)), 5.0, 3.4, 0, 0.3)
STEEL_U = mat_pbr("Perforated Steel U7", (0.55, 0.57, 0.6), metallic=0.8, roughness=0.4)
ASB = mat_pbr("Asbestos U7", (0.8, 0.78, 0.7), roughness=0.95)
u_pts = [c0 + Vector((-1.6, 0, 2.6))]
for k in range(13):
    a = math.pi * k / 12
    u_pts.append(c0 + Vector((-1.6 * math.cos(a), 0, 0.9 - 1.3 * math.sin(a))))
u_pts.append(c0 + Vector((1.6, 0, 2.6)))
u = pcurve("A U Tube", u_pts, STEEL_U, 0.14, "Models")
hide_until(u, sec(7.3))
lin = pcurve("A U Lining", [p + Vector((0, -0.05, 0)) * 1.0 for p in [q.lerp(c0 + Vector((0, 0, q.z - c0.z)), 0.08) for q in u_pts]], ASB, 0.09, "Models")
hide_until(lin, sec(8.0))
brine = box("A Brine", (2.9, 0.9, 2.2), mat_emit("Brine U7", (0.6, 0.8, 1.0), 0.4, alpha=0.3), c0 + Vector((0, 0, 0.95)))
appear(brine, sec(1.0), dur=12)
an = box("A Anode", (0.5, 0.4, 3.4), GRAPHITE, c0 + Vector((0, 0, 1.6)))
appear(an, sec(9.0), dur=10)
basin = box("A Basin", (4.6, 1.2, 0.3), mat_emit("NaOH Pool U7", (0.85, 0.9, 1.0), 0.5, alpha=0.5), c0 + Vector((0, 0, -0.45)))
appear(basin, sec(10.0), dur=10)
big("Lbl A C", "cathode −", c0 + Vector((-2.6, -1.0, 2.9)), 8.5, None, mat=M["cyan"], size=0.42)
big("Lbl A A", "anode +", c0 + Vector((1.1, -1.0, 3.6)), 9.5, None, mat=M["red"], size=0.42)

# ---- B. ions in the brine ----
lo, hi = c0 + Vector((-1.1, -0.5, -0.1)), c0 + Vector((-0.35, 0.3, 2.0))
lo2, hi2 = c0 + Vector((0.35, -0.5, -0.1)), c0 + Vector((1.1, 0.3, 2.0))
for side, (l, h) in enumerate(((lo, hi), (lo2, hi2))):
    gas("B Na %d" % side, 2, l, h, 14.3, 24.0, speed=0.5, r=0.15, mat=CAT, f_in=sec(14.3), f_out=sec(24.0), seed=11 + side)
    gas("B Cl %d" % side, 2, l, h, 14.3, 24.0, speed=0.5, r=0.15, mat=ANI, f_in=sec(14.8), f_out=sec(24.0), seed=21 + side)

# ---- C. H⁺ to the tube wall → H₂ bubbles; NaOH drips ----
HP = mat_emit("H Plus U7", (1.0, 0.85, 0.6), 1.6)
for k, sx in enumerate((-1, 1)):
    for j in range(2):
        a = c0 + Vector((0.7 * sx, -0.4, 0.4 + 0.7 * j))
        b = c0 + Vector((1.35 * sx, -0.4, 0.4 + 0.7 * j))
        h = ion("C H %d%d" % (k, j), HP, a, 24.5, r=0.11)
        move(h, sec(26.0 + 0.6 * j), sec(28.5 + 0.6 * j), a, b)
        hide_from(h, sec(30.0 + 0.6 * j), (0.11,) * 3)
    bubbles("C H2 %d" % k, c0.x + 1.75 * sx - 0.1, c0.x + 1.75 * sx + 0.1, c0.z + 0.3, c0.z + 3.0, -0.3, 32.0, END / FPS,
            n=5, r=0.1, mat=H_GAS)
for k in range(6):
    x = -1.2 + 0.5 * k
    p0 = c0 + Vector((x, -0.2, -0.25 if abs(x) < 0.9 else 0.4))
    d = sphere("C Drip %d" % k, 0.08, mat_emit("NaOH Drop U7", (0.85, 0.9, 1.0), 1.2), p0, None, 10, 5)
    frames, vals = [], []
    t = 38.5 + 0.3 * k
    while t + 1.0 <= END / FPS:
        frames += [sec(t), sec(t + 1.0) - 1]
        vals += [p0, c0 + Vector((x, -0.2, -0.4))]
        t += 1.6
    keys_bulk(d, "location", frames, vals)
    hide_until(d, sec(38.5 + 0.3 * k))
big("Lbl C H", "H₂", c0 + Vector((-2.6, -1.0, 2.0)), 33.0, None, mat=M["white"], size=0.45)
big("Lbl C N", "NaOH", c0 + Vector((2.9, -1.0, -0.45)), 39.0, None, mat=M["gold"], size=0.45)

# ---- D. Cl⁻ to the anode → Cl₂ up the middle ----
for j in range(3):
    a = c0 + Vector((-0.8 + 0.8 * j, -0.5, 0.5 + 0.4 * j))
    cl = ion("D Cl %d" % j, ANI, a, 44.3, r=0.15)
    move(cl, sec(45.0 + 0.4 * j), sec(46.5 + 0.4 * j), a, c0 + Vector((0.3 * (j - 1), -0.35, 0.6 + 0.4 * j)))
    hide_from(cl, sec(47.0 + 0.4 * j), (0.15,) * 3)
bubbles("D Cl2", c0.x - 0.35, c0.x + 0.35, c0.z + 0.6, c0.z + 3.2, -0.35, 47.0, END / FPS, n=6, r=0.11, mat=CL_GAS)
big("Lbl D", "Cl₂", c0 + Vector((1.2, -1.0, 2.6)), 48.0, None, mat=M["green"] if "green" in M else M["white"], size=0.45)
finish_film()
