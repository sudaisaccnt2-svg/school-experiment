# ---- Film 810: Magnesium and calcium (textbook pp.232-233: magnesium only in compounds: dolomite CaCO₃·MgCO₃,
# kieserite MgSO₄, Epsom salt MgSO₄·7H₂O, talc, asbestos; in sea water as chlorides and bromides; causes permanent
# hardness of water; part of chlorophyll; (a) Z = 12, period 3, group IIA; Table 8.5: silvery grey, 1.74 g/cm³,
# m.p. 651 °C, b.p. 1106 °C; calcium: limestone, marble, chalk (CaCO₃), gypsum (CaSO₄), Fig 8.3; (a) Z = 20, period 4,
# group IIA; Table 8.6: silvery white, 1.55 g cm⁻³, m.p. 851 °C, b.p. 1487 °C) (v4) ----
start_film("810", "810 Magnesium and Calcium", 66.5)
END = scene.frame_end
S = [Vector((40 * k, 0, 0)) for k in range(7)]

shot("Cam Mg Ores", 0, 10, S[0] + Vector((0, 0, -0.6)), dist=11, pitch=0.08)
shot("Cam Mg Sea", 10, 18, S[1] + Vector((0, 0, -0.6)), dist=10, pitch=0.1)
shot("Cam Mg Atom", 18, 28, S[2] + Vector((0, 0, -0.6)), dist=10, pitch=0.06)
shot("Cam Mg Lump", 28, 38, S[3] + Vector((0, 0, -0.6)), dist=9, pitch=0.08)
shot("Cam Ca Ores", 38, 48, S[4] + Vector((0, 0, -0.6)), dist=11, pitch=0.08)
shot("Cam Ca Atom", 48, 56, S[5] + Vector((0, 0, -0.6)), dist=11, pitch=0.06)
shot("Cam Ca Lump", 56, None, S[6] + Vector((0, 0, -0.6)), dist=9, pitch=0.08)
for name, t in (("Magnesium", 0), ("Calcium", 38)):
    act(name, sec(t))

say('A1', 'Magnesium: only in compounds', 0.1, 10)
say('B1', 'Also in sea water', 10, 18)
say('C1', 'Period 3, group IIA', 18, 28)
say('D1', 'Silvery grey, melts 651 °C', 28, 38)
say('E1', 'Calcium: limestone, marble, chalk', 38, 48)
say('F1', 'Period 4, group IIA', 48, 56)
say('G1', 'Silvery white, melts 851 °C', 56, 66)

for k, (nm, rgb) in enumerate((("dolomite", (0.82, 0.78, 0.72)), ("Epsom salt", (0.9, 0.93, 0.96)), ("talc", (0.75, 0.82, 0.78)))):
    p = S[0] + Vector((-3.0 + 3.0 * k, 0, -1.1))
    rock("A %d" % k, p, 0.85, rgb, 0.4 + 0.8 * k, seed=k + 11)
    big("Lbl A %d" % k, nm, p + Vector((0, -0.9, 1.35)), 0.8 + 0.8 * k, None, size=0.45)

b0 = S[1] + Vector((0, 0, -1.1))
sea = box("B Sea", (6.0, 2.0, 1.2), WATER, b0)
appear(sea, sec(10.3), dur=12)
for k in range(10):
    p = b0 + Vector((-2.4 + 0.53 * k, -1.05, -0.3 + 0.4 * (k % 3) / 2))
    io = ion("B Mg %d" % k, cpk_mat("Mg"), p, 11.0 + 0.2 * k, r=0.15)
big("Lbl B", "Mg²⁺", b0 + Vector((0, -0.9, 1.3)), 13.0, None, mat=M["gold"], size=0.55)

atom_ring(12, S[2] + Vector((-0.8, 0, -0.5)), 18.3, name="C Mg")
big("Lbl C", "2, 8, 2", S[2] + Vector((1.6, -0.8, 0.2)), 19.5, None, mat=M["gold"], size=0.55, align='LEFT')

def lump_temp(key, c, mat, t0, mp, frac):
    lump(key + " Lump", c + Vector((-1.0, 0, 0.2)), 0.7, mat, t0)
    col = thermo(key + " T", c + Vector((1.4, 0, -0.6)), h=2.6)
    appear(col.parent, sec(t0 + 0.3), dur=10)
    level(col, t0 + 1.0, 0.12)
    level(col, t0 + 4.0, frac)
    big("Lbl %s" % key, mp, c + Vector((1.8, -0.8, 1.0)), t0 + 4.2, None, mat=M["gold"], size=0.5, align='LEFT')

lump_temp("D", S[3] + Vector((0, 0, -1.0)), MG_M, 28.3, "651 °C", 0.6)

for k, (nm, rgb) in enumerate((("limestone", (0.8, 0.76, 0.66)), ("marble", (0.92, 0.9, 0.92)), ("chalk", (0.97, 0.97, 0.95)))):
    p = S[4] + Vector((-3.0 + 3.0 * k, 0, -1.1))
    rock("E %d" % k, p, 0.85, rgb, 38.4 + 0.8 * k, seed=k + 21)
    big("Lbl E %d" % k, nm, p + Vector((0, -0.9, 1.35)), 38.8 + 0.8 * k, None, size=0.45)
big("Lbl E", "CaCO₃", S[4] + Vector((0, -0.9, 1.7)), 42.0, None, mat=M["gold"], size=0.5)

atom_ring(20, S[5] + Vector((-1.0, 0, -0.5)), 48.3, scale=0.75, name="F Ca")
big("Lbl F", "2, 8, 8, 2", S[5] + Vector((1.6, -0.8, 0.2)), 49.5, None, mat=M["gold"], size=0.55, align='LEFT')

lump_temp("G", S[6] + Vector((0, 0, -1.0)), mat_pbr("Calcium U8", (0.9, 0.9, 0.88), metallic=0.85, roughness=0.3), 56.3,
          "851 °C", 0.75)
finish_film()
