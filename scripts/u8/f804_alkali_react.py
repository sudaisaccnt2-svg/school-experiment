# ---- Film 804: Reactivity of alkali metals (textbook pp.224-225: Table 8.1, order lithium < sodium < potassium;
# air: Li red flame → Li₂O, Na bright yellow → Na₂O, K violent lilac → K₂O (white solids); water: all float, Li quickly,
# Na very quickly, K very violently (explodes) → hydroxide + hydrogen; chlorine: bright flame → white chloride;
# Scientific Information: potassium is stored in kerosene oil) (v4) ----
start_film("804", "804 Alkali Metals React", 76.5)
END = scene.frame_end
S = [Vector((40 * k, 0, 0)) for k in range(8)]

shot("Cam Li", 0, 6, S[0] + Vector((0, 0, -0.6)), dist=8, pitch=0.08)
shot("Cam Na", 6, 12, S[1] + Vector((0, 0, -0.6)), dist=8, pitch=0.08)
shot("Cam K", 12, 18, S[2] + Vector((0, 0, -0.6)), dist=8, pitch=0.08)
shot("Cam Water", 18, 42, S[3] + Vector((0, 0, -0.6)), dist=11, pitch=0.08)
shot("Cam Chlorine", 42, 54, S[4] + Vector((0, 0, -0.6)), dist=9, pitch=0.06)
shot("Cam Order", 54, 66, S[5] + Vector((0, 0, -0.6)), dist=11, pitch=0.06)
shot("Cam Kerosene", 66, None, S[6] + Vector((0, 0, -0.6)), dist=9, pitch=0.08)
for name, t in (("In air", 0), ("In water", 18), ("In chlorine", 42), ("Order", 54), ("Kerosene", 66)):
    act(name, sec(t))

say('A1', 'Lithium burns red', 0.1, 6)
say('A2', 'Sodium burns bright yellow', 6, 12)
say('A3', 'Potassium burns lilac', 12, 18)
say('B1', 'Lithium floats and fizzes', 18, 26)
say('B2', 'Sodium fizzes faster', 26, 34)
say('B3', 'Potassium explodes', 34, 42)
say('C1', 'In chlorine: white chloride', 42, 48)
say('C2', '2Na + Cl₂ → 2NaCl', 48, 54)
say('D1', 'Lithium < sodium < potassium', 54, 66)
say('E1', 'Potassium is kept in kerosene', 66, 76)

# ---- A. three flames, three white oxides ----
for k, (sy, rgb, ox, sz) in enumerate((("Li", (1.0, 0.12, 0.1), "Li₂O", 0.55), ("Na", (1.0, 0.8, 0.15), "Na₂O", 0.75),
                                         ("K", (0.75, 0.45, 1.0), "K₂O", 0.95))):
    c = S[k] + Vector((0, 0, -1.1))
    t0 = 6.0 * k
    lump("A %s" % sy, c, 0.55, NA_M, t0 + 0.3, seed=k)
    cflame("A Fire %s" % sy, c + Vector((0, -0.1, 0.25)), rgb, t0 + 1.5, None, s=sz)
    big("Lbl A %s" % sy, sy, c + Vector((-1.6, -0.8, 1.0)), t0 + 0.6, None, size=0.55)
    big("Lbl A Ox %s" % sy, ox, c + Vector((1.7, -0.8, 1.0)), t0 + 3.5, None, mat=M["white"], size=0.5)

# ---- B. one trough: Li, Na, K in turn ----
b0 = S[3] + Vector((0, 0, -2.0))
surf = trough("B", b0, 18.3, w=6.0, h=1.6)
for k, (sy, t0, n, per, dart) in enumerate((("Li", 19.0, 4, 1.4, 0.2), ("Na", 27.0, 8, 0.8, 0.9), ("K", 35.0, 12, 0.5, 1.4))):
    x = -2.0 + 2.0 * k
    lm = lump("B %s" % sy, Vector((b0.x + x, b0.y, surf.z + 1.6)), 0.3, NA_M, t0, seed=k + 3)
    move(lm, sec(t0 + 0.3), sec(t0 + 1.2), Vector((b0.x + x, b0.y, surf.z + 1.6)), Vector((b0.x + x, b0.y, surf.z + 0.05)))
    t = t0 + 1.4
    j = 0
    while t < t0 + 6.0:
        q = Vector((b0.x + x + dart * (0.5 if j % 2 else -0.5) * (j % 3) / 2, b0.y, surf.z + 0.05 + (0.05 if j % 2 else 0)))
        kf(lm, "location", sec(t), q, 'BEZIER')
        t += 0.6
        j += 1
    dissolve_out(lm, t0 + 6.3, 1.2)
    fizz("B %s" % sy, Vector((b0.x + x, b0.y, surf.z + 0.1)), t0 + 1.4, t0 + 7.0, n=n, period=per)
    big("Lbl B %s" % sy, sy, Vector((b0.x + x, b0.y - 0.8, surf.z + 2.3)), t0 + 0.2, t0 + 7.6, size=0.5)
big("Lbl B H", "hydrogen", Vector((b0.x - 2.0, b0.y - 0.8, surf.z + 1.7)), 21.0, 26.0, mat=M["cyan"], size=0.42)
cflame("B Boom", Vector((b0.x + 2.0, b0.y - 0.1, surf.z)), (0.75, 0.45, 1.0), 37.0, 41.0, s=0.9)
flash("B Bang", Vector((b0.x + 2.0, b0.y - 0.4, surf.z + 0.4)), sec(37.0), 1.0)

# ---- C. sodium burns in a jar of chlorine: a white salt is left ----
c0 = S[4] + Vector((0, 0, -1.7))
jar_of("C", c0, "Cl", 42.3, r=0.9, h=2.5)
spoon = lump("C Na", c0 + Vector((0, -0.1, 0.8)), 0.35, NA_M, 42.8)
cflame("C Fire", c0 + Vector((0, -0.2, 1.0)), (1.0, 0.9, 0.6), 44.0, 47.5, s=0.7)
dissolve_out(spoon, 46.0, 1.5)
salt = lump("C Salt", c0 + Vector((0, -0.1, 0.5)), 0.5, SALT_W, 47.0, seed=4)
big("Lbl C", "NaCl", c0 + Vector((1.8, -0.8, 1.2)), 48.4, None, mat=M["white"], size=0.55)

# ---- D. the order: bigger reaction each step ----
d0 = S[5] + Vector((-2.6, 0, -1.1))
for k, (sy, h) in enumerate((("Li", 0.8), ("Na", 1.5), ("K", 2.3))):
    ebar("D Bar %d" % k, d0 + Vector((2.6 * k, 0, 0)), h, 55.0 + 1.0 * k, None, BAR_M, w=0.9)
    big("Lbl D %s" % sy, sy, d0 + Vector((2.6 * k, -0.8, -0.35)), 55.0 + 1.0 * k, None, size=0.5)
big("Lbl D", "more reactive →", S[5] + Vector((0, -0.8, 1.75)), 58.5, None, mat=M["gold"], size=0.5)

# ---- E. potassium under kerosene ----
kero_jar("E", S[6] + Vector((0, 0, -1.4)), 66.3)
big("Lbl E", "kerosene", S[6] + Vector((1.1, -0.8, 1.0)), 68.0, None, mat=M["gold"], size=0.5, align='LEFT')
finish_film()
