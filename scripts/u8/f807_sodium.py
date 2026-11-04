# ---- Film 807: Sodium (textbook pp.229-230: from alkali to alkaline earth metals melting/boiling points, density and
# hardness increase, electropositivity, conductivity, reducing power and atomic radii decrease; sodium is too reactive
# to be free: in the sea as NaCl, NaBr, NaI and in rock salt; Fig 8.2 freshly cut alkali metal is shiny and silvery and
# tarnishes quickly; (a) atomic number 11, period 3, group IA (three shells, one valence electron); Table 8.4: silvery
# white, soft (knife), 0.971 g cm⁻³, m.p. 97.6 °C, b.p. 880 °C, floats on water, malleable, conducts) (v4) ----
start_film("807", "807 Sodium", 62.5)
END = scene.frame_end
S = [Vector((40 * k, 0, 0)) for k in range(7)]

shot("Cam Size", 0, 10, S[0] + Vector((0, 0, -0.6)), dist=10, pitch=0.06)
shot("Cam Sea", 10, 18, S[1] + Vector((0, 0, -0.6)), dist=10, pitch=0.1)
shot("Cam Cut", 18, 32, S[2] + Vector((0, 0, -0.6)), dist=8, pitch=0.1)
shot("Cam Table", 32, 38, S[3] + Vector((0, 0, 0.5)), dist=13, pitch=0.02)
shot("Cam Atom", 38, 44, S[4] + Vector((0, 0, -0.6)), dist=10, pitch=0.06)
shot("Cam Float", 44, 52, S[5] + Vector((0, 0, -0.6)), dist=10, pitch=0.08)
shot("Cam Melt", 52, None, S[6] + Vector((0, 0, -0.6)), dist=9, pitch=0.08)
for name, t in (("IA vs IIA", 0), ("Sea salt", 10), ("Soft and shiny", 18), ("Its place", 32), ("Properties", 44)):
    act(name, sec(t))

say('A1', 'Group IIA atoms are smaller', 0.1, 10)
say('B1', 'Sodium lives in sea salt', 10, 18)
say('C1', 'Soft: a knife cuts it', 18, 25)
say('C2', 'Shiny, then it tarnishes', 25, 32)
say('D1', 'Period 3, group IA', 32, 38)
say('D2', 'Three shells, one outer electron', 38, 44)
say('E1', 'Lighter than water: it floats', 44, 52)
say('F1', 'Melts at only 97.6 °C', 52, 62)

a0 = S[0] + Vector((0, 0, -0.5))
for k, (sy, rr, x) in enumerate((("Na", 1.86, -1.6), ("Mg", 1.60, 1.6))):
    sp = sphere("A %s" % sy, 0.6 * rr, gloss("Atom Shell U8", (0.3, 0.55, 1.0), 0.3), a0 + Vector((x, 0.3, 0)), None, 32, 16)
    appear(sp, sec(0.5 + 1.2 * k), s=(0.6 * rr,) * 3)
    big("Lbl A %s" % sy, sy, a0 + Vector((x, -1.3, 0)), 0.8 + 1.2 * k, None, size=0.6)
big("Lbl A", "IA → IIA", a0 + Vector((0, -0.8, 1.9)), 4.0, None, mat=M["gold"], size=0.5)

b0 = S[1] + Vector((0, 0, -1.2))
sea = box("B Sea", (6.0, 2.0, 0.8), WATER, b0)
appear(sea, sec(10.3), dur=12)
salt = box("B Salt", (1.1, 1.1, 1.1), SALT_W, b0 + Vector((0, 0, 1.0)))
salt.rotation_euler = (0.4, 0.3, 0.6)
appear(salt, sec(11.5), dur=12)
turn(salt, 12.0, 18.0, 0.25)
big("Lbl B", "NaCl", b0 + Vector((0, -0.9, 2.2)), 12.5, None, mat=M["white"], size=0.55)

c0 = S[2] + Vector((0, 0, -1.2))
L = blob("C Left", (0.6, 0.55, 0.5), TARNISH, c0 + Vector((-0.6, 0, 0)), None, bump=0.12, seed=2)
R = blob("C Right", (0.6, 0.55, 0.5), TARNISH, c0 + Vector((0.6, 0, 0)), None, bump=0.12, seed=3)
for o in (L, R):
    appear(o, sec(18.3), dur=12)
knife("C", c0, 18.6, 21.2, depth=1.1, t1=24.0)
move(L, sec(21.6), sec(22.6), c0 + Vector((-0.6, 0, 0)), c0 + Vector((-1.2, 0, 0)))
move(R, sec(21.6), sec(22.6), c0 + Vector((0.6, 0, 0)), c0 + Vector((1.2, 0, 0)))
for s_, ob in ((-1, L), (1, R)):
    face = box("C Face %d" % s_, (0.06, 0.95, 0.85), NA_M, c0 + Vector((-0.62 * s_ + 1.2 * s_ * 0 + (-0.0), -0.0, 0)))
    face.parent = ob
    face.location = (-0.58 * s_, 0, 0)
    hide_until(face, sec(21.6))
    dull = box("C Dull %d" % s_, (0.06, 0.95, 0.85), TARNISH, (0, 0, 0))
    dull.parent = ob
    dull.location = (-0.57 * s_, 0, 0)
    hide_until(dull, sec(28.0))
    hide_from(face, sec(28.0), (1, 1, 1))
L.rotation_euler = (0, 0, 0.5)
R.rotation_euler = (0, 0, -0.5)
flash("C Shine", c0 + Vector((-0.75, -0.6, 0.2)), sec(23.0), 0.3)
big("Lbl C", "shiny", c0 + Vector((0, -0.9, 1.5)), 23.0, 28.0, mat=M["white"], size=0.5)
big("Lbl C2", "tarnished", c0 + Vector((0, -0.9, 1.5)), 28.3, None, mat=M["dim"], size=0.5)

# period 3 (a row) crossing group IA (a column) at sodium
for k, (sy, kind) in enumerate((("Na", "metal"), ("Mg", "metal"), ("Al", "metal"), ("Si", "metalloid"), ("P", "nonmetal"),
                                ("S", "nonmetal"), ("Cl", "nonmetal"), ("Ar", "nonmetal"))):
    tile("D R %s" % sy, sy, S[3] + Vector((-3.5 + k, 0, 0.5)), kind, 32.3 + 0.15 * k)
for k, (sy, kind) in enumerate((("H", "nonmetal"), ("Li", "metal"), ("K", "metal"))):
    tile("D C %s" % sy, sy, S[3] + Vector((-3.5, 0, (2.5, 1.5, -0.5)[k])), kind, 33.6 + 0.2 * k)
big("Lbl D G", "IA", S[3] + Vector((-3.5, -0.6, 3.3)), 33.6, None, mat=M["gold"], size=0.45)
big("Lbl D P", "3", S[3] + Vector((-4.6, -0.6, 0.35)), 32.3, None, mat=M["gold"], size=0.45)
flash("D Na", S[3] + Vector((-3.5, -0.6, 0.5)), sec(34.8), 0.35)

lose_free = atom_ring(11, S[4] + Vector((0, 0, -0.5)), 38.3, name="E Na")
big("Lbl E", "2, 8, 1", S[4] + Vector((2.4, -0.8, 0.2)), 39.5, None, mat=M["gold"], size=0.55, align='LEFT')

f0 = S[5] + Vector((0, 0, -1.6))
surf = trough("F", f0, 44.3, w=5.0, h=1.6)
fl = lump("F Na", surf + Vector((0, 0, 1.2)), 0.45, NA_M, 44.6)
move(fl, sec(45.0), sec(46.0), surf + Vector((0, 0, 1.2)), surf + Vector((0, 0, 0.12)))
bob(fl, surf.z + 0.12, 46.2, 52.0)
big("Lbl F", "0.971 g cm⁻³", S[5] + Vector((0, -0.8, 1.2)), 46.5, None, mat=M["gold"], size=0.5)

g0 = S[6] + Vector((-0.8, 0, -0.5))
mlt = lump("G Na", g0, 0.6, NA_M, 52.3)
kf(mlt, "scale", sec(55.0), (1, 1, 1), 'BEZIER')
kf(mlt, "scale", sec(57.5), (1.8, 1.4, 0.25), 'BEZIER')
kf(mlt, "location", sec(55.0), g0, 'BEZIER')
kf(mlt, "location", sec(57.5), g0 + Vector((0, 0, -0.3)), 'BEZIER')
cflame("G Burner", g0 + Vector((0, 0, -1.05)), (1.0, 0.5, 0.12), 53.0, None, s=0.5)
col = thermo("G T", S[6] + Vector((1.6, 0, -1.4)), h=2.6)
appear(col.parent, sec(52.5), dur=10)
level(col, 53.0, 0.15)
level(col, 57.0, 0.5)
big("Lbl G", "97.6 °C", S[6] + Vector((2.0, -0.8, 0.0)), 57.2, None, mat=M["gold"], size=0.5, align='LEFT')
finish_film()
