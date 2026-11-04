# ---- Film 816: Halogens (textbook pp.241-242: 8.2.2 group VII: F, Cl, Br, I, At; 'halogen' = salt-forming (Greek);
# found only as ions or compounds; F and Cl gases, Br liquid, I and At solids; reactivity falls from F to At; F the most
# electronegative; At radioactive; ns²np⁵: gain one electron → halide ion, X₂ + 2e⁻ → 2X⁻ (Cl₂ + 2e⁻ → 2Cl⁻);
# Fig 8.5 chlorine gas (green), bromine liquid and vapour (red-brown), iodine solid and vapour (purple); (a) only group
# with all three states; poor conductors; Table 8.9: atomic radius 71, 99, 114, 133, 150 pm; electronegativity
# 4.0, 3.0, 2.8, 2.5, 2.2) (v4) ----
start_film("816", "816 Halogens", 62.5)
END = scene.frame_end
S = [Vector((40 * k, 0, 0)) for k in range(7)]

shot("Cam Group", 0, 10, S[0] + Vector((0, 0, -0.3)), dist=15, pitch=0.04)
shot("Cam Salt", 10, 16, S[1] + Vector((0, 0, -0.6)), dist=9, pitch=0.08)
shot("Cam Gain", 16, 26, S[2] + Vector((0, 0, -0.6)), dist=10, pitch=0.06)
shot("Cam Split", 26, 34, S[3] + Vector((0, 0, -0.6)), dist=10, pitch=0.04)
shot("Cam Jars", 34, 48, S[4] + Vector((0, 0, -0.6)), dist=12, pitch=0.06)
shot("Cam Radius", 48, 55, S[5] + Vector((0, 0, -0.6)), dist=13, pitch=0.04)
shot("Cam EN", 55, None, S[6] + Vector((0, 0, -0.6)), dist=13, pitch=0.04)
for name, t in (("Group VII", 0), ("Gain one", 16), ("Fig 8.5", 34), ("Down the group", 48)):
    act(name, sec(t))

say('A1', 'Group VII: the halogens', 0.1, 10)
say('A2', "Halogen means 'salt-forming'", 10, 16)
say('B1', 'Seven outer: gain one', 16, 26)
say('B2', 'Cl₂ + 2e⁻ → 2Cl⁻', 26, 34)
say('C1', 'Green gas, red-brown liquid', 34, 41)
say('C2', 'Iodine: black solid, purple vapour', 41, 48)
say('D1', 'Atoms grow: 71 → 150 pm', 48, 55)
say('D2', 'Electronegativity falls: 4.0 → 2.2', 55, 62)

for k, sy in enumerate(("F", "Cl", "Br", "I", "At")):
    tile("A %s" % sy, sy, S[0] + Vector((0, 0, 2.0 - 0.95 * k)), "nonmetal", 0.4 + 0.6 * k)
big("Lbl A", "VII", S[0] + Vector((0, -0.6, 2.75)), 0.4, None, mat=M["gold"], size=0.45)

NA = mat_emit("Ion Na U8", (0.6, 0.35, 1.0), 1.6)
CLI = mat_emit("Ion Cl U8", (0.3, 1.0, 0.45), 1.3)
lat = empty("A2 Lattice", S[1] + Vector((0, 0, -0.6)), rot=(0.3, 0, 0.5))
q = 0
for i in range(3):
    for j in range(3):
        for kz in range(3):
            na = (i + j + kz) % 2 == 0
            r = 0.2 if na else 0.3
            s_ = sphere("A2 Ion %d" % q, r, NA if na else CLI, ((i - 1) * 0.75, (j - 1) * 0.75, (kz - 1) * 0.75), lat, 16, 8)
            appear(s_, sec(10.3) + q, s=(r,) * 3)
            q += 1
turn(lat, 11.0, 16.0, 0.25)
big("Lbl A2", "NaCl", S[1] + Vector((0, -0.9, 1.2)), 11.5, None, mat=M["gold"], size=0.55)

gain("B", 17, S[2] + Vector((0.7, 0, -0.4)), 16.3, 18.0, 1, "−")
big("Lbl B", "7 + 1 = 8", S[2] + Vector((-2.4, -0.8, 1.2)), 22.0, None, mat=M["gold"], size=0.5)

c0 = S[3] + Vector((0, 0, -0.4))
c1 = A("C Cl1", "Cl", c0 + Vector((-0.55, 0, 0)), 26.3)
c2 = A("C Cl2", "Cl", c0 + Vector((0.55, 0, 0)), 26.3)
mv(c1, 27.5, 29.0, c0 + Vector((-0.55, 0, 0)), c0 + Vector((-2.4, 0, 0)))
mv(c2, 27.5, 29.0, c0 + Vector((0.55, 0, 0)), c0 + Vector((2.4, 0, 0)))
for k, s_ in enumerate((-1, 1)):
    travel("C e%d" % k, c0 + Vector((3.8 * s_, -0.3, 1.8)), c0 + Vector((2.4 * s_ + 0.2, -0.3, 0.6)), 29.2 + 0.3 * k, dur=1.2)
    charge("C S%d" % k, "−", c0 + Vector((2.4 * s_ + 0.7, -0.5, 0.75)), 30.6 + 0.3 * k, None, size=0.8)

j0 = S[4] + Vector((0, 0, -1.9))
jar_of("D Cl", j0 + Vector((-2.6, 0, 0)), "Cl", 34.3, r=0.8, h=2.6)
jb = jar("D Br Jar", 0.8, 2.6, j0, top=True)
appear(jb, sec(35.0))
lq = liquid("D Br Liq", 0.77, 0.6, j0 + Vector((0, 0, 0.01)), mat=mat_emit("Bromine Liq U8", (0.55, 0.12, 0.04), 1.2, alpha=0.9))
appear(lq, sec(35.2))
vp = liquid("D Br Vap", 0.77, 1.95, j0 + Vector((0, 0, 0.62)), mat=JAR["Br"])
appear(vp, sec(35.6))
ji = jar("D I Jar", 0.8, 2.6, j0 + Vector((2.6, 0, 0)), top=True)
appear(ji, sec(41.3))
for k in range(5):
    cr = box("D I Crystal %d" % k, (0.22, 0.22, 0.12), mat_pbr("Iodine Solid U8", (0.08, 0.06, 0.1), metallic=0.6, roughness=0.3),
             j0 + Vector((2.3 + 0.15 * k, -0.1 * (k % 2), 0.08)))
    appear(cr, sec(41.5 + 0.1 * k))
iv = liquid("D I Vap", 0.77, 2.4, j0 + Vector((2.6, 0, 0.15)), mat=JAR["I"])
kf(iv, "scale", 0, (0, 0, 0), 'CONSTANT')
kf(iv, "scale", sec(42.5), (1, 1, 0.02), 'BEZIER')
kf(iv, "scale", sec(45.5), (1, 1, 1), 'BEZIER')
for k, (txt, x, t) in enumerate((("Cl₂", -2.6, 34.6), ("Br₂", 0.0, 35.8), ("I₂", 2.6, 41.8))):
    big("Lbl D %d" % k, txt, j0 + Vector((x, -1.0, 3.2)), t, None, size=0.5)

e0 = S[5] + Vector((-4.4, 0, -0.4))
x = 0.0
prev = None
for k, (sy, rr) in enumerate((("F", 71), ("Cl", 99), ("Br", 114), ("I", 133), ("At", 150))):
    r = rr * 0.0075
    if prev is not None:
        x += prev + r + 0.35
    sp = sphere("E %s" % sy, r, gloss("Halogen Atom U8", (0.25, 0.75, 0.4), 0.3), e0 + Vector((x, 0.3, 0)), None, 32, 16)
    appear(sp, sec(48.4 + 0.6 * k), s=(r,) * 3)
    big("Lbl E %s" % sy, "%s %d" % (sy, rr), e0 + Vector((x, -1.3, -1.45)), 48.6 + 0.6 * k, None, size=0.42)
    prev = r
bars("F", S[6] + Vector((-2.6, 0, -1.6)), [("F", 4.0, "4.0"), ("Cl", 3.0, "3.0"), ("Br", 2.8, "2.8"), ("I", 2.5, "2.5"),
                                            ("At", 2.2, "2.2")], 55.4, k=0.75)
finish_film()
