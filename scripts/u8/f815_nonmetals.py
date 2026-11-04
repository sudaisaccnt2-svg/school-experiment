# ---- Film 815: Non-metals (textbook pp.238-240: 8.2 non-conductors, neither malleable nor ductile; oxides and
# hydroxides are acids; exist in all three states; oxide usually acidic, turns blue litmus red; a non-metal gains an
# electron and forms an anion: Cl₂ + 2e⁻ → 2Cl⁻; Scientific Information: 27 non-metals, most gases, bromine the one
# liquid, a few solids (C, I, P, Se, Si, S); liquid metals Hg 38.87, Ga 29.76, Cs 28.4 (book's m.p. values); Table 8.8
# metals vs non-metals (electron donors / acceptors, + / − ions, basic / acidic oxides, ionic / covalent chlorides,
# solids / often gases, conductors / poor conductors except graphite); 8.2.1 electronegativity: the right corner of
# the periodic table, group VII, is the most electronegative) (v4) ----
start_film("815", "815 Non-metals", 78.5)
END = scene.frame_end
S = [Vector((40 * k, 0, 0)) for k in range(10)]

shot("Cam Bulb", 0, 8, S[0] + Vector((0, 0, -0.9)), dist=12, pitch=0.06)
shot("Cam Shatter", 8, 14, S[1] + Vector((0, 0, -0.6)), dist=9, pitch=0.06)
shot("Cam Litmus", 14, 26, S[2] + Vector((0, 0, -0.7)), dist=10, pitch=0.06)
shot("Cam Gain", 26, 34, S[3] + Vector((0, 0, -0.6)), dist=10, pitch=0.06)
shot("Cam States", 34, 44, S[4] + Vector((0, 0, -0.6)), dist=11, pitch=0.06)
shot("Cam Liquid", 44, 52, S[5] + Vector((0, 0, -0.6)), dist=10, pitch=0.08)
shot("Cam Give Take", 52, 60, S[6] + Vector((0, 0, -0.6)), dist=12, pitch=0.04)
shot("Cam Oxides", 60, 68, S[7] + Vector((0, 0, -0.6)), dist=10, pitch=0.04)
shot("Cam Corner", 68, None, S[8] + Vector((5.0, 0, 0.6)), dist=14, pitch=0.02)
for name, t in (("Non-metals", 0), ("Acidic oxide", 14), ("Gain electrons", 26), ("States", 34), ("Metals vs non-metals", 52),
                ("Electronegativity", 68)):
    act(name, sec(t))

say('A1', 'Sulphur: the bulb stays dark', 0.1, 8)
say('B1', 'Hit it: it shatters', 8, 14)
say('C1', 'Non-metal oxide in water', 14, 20)
say('C2', 'Blue litmus turns red', 20, 26)
say('D1', 'Chlorine gains an electron', 26, 34)
say('E1', 'Gases, one liquid, some solids', 34, 44)
say('F1', 'Liquid metals: Hg, Ga, Cs', 44, 52)
say('G1', 'Metals give, non-metals take', 52, 60)
say('G2', 'Basic oxide · acidic oxide', 60, 68)
say('H1', 'Top right: most electronegative', 68, 78)

b0 = S[0]
battery("A", b0 + Vector((-3.0, 0, -0.8)), 0.3)
bar = box("A Bar", (2.0, 0.4, 0.4), cpk_mat("S"), b0 + Vector((0, 0, 0.6)))
appear(bar, sec(0.5), dur=10)
w1 = [b0 + Vector((-2.34, 0, -0.8)), b0 + Vector((-1.6, 0, -0.8)), b0 + Vector((-1.6, 0, 0.6)), b0 + Vector((-1.0, 0, 0.6))]
w2 = [b0 + Vector((1.0, 0, 0.6)), b0 + Vector((3.0, 0, 0.6)), b0 + Vector((3.0, 0, 0.05))]
w3 = [b0 + Vector((3.0, 0, -1.2)), b0 + Vector((3.0, 0, -1.5)), b0 + Vector((-3.9, 0, -1.5)), b0 + Vector((-3.9, 0, -0.8)),
      b0 + Vector((-3.66, 0, -0.8))]
for k, w in enumerate((w1, w2, w3)):
    wire("A Wire %d" % k, w, 0.6)
bulb("A", b0 + Vector((3.0, 0, -1.2)), 1.0, 0.0)
big("Lbl A", "S", b0 + Vector((0, -0.6, 1.3)), 1.0, None, mat=M["gold"], size=0.55)

s0 = S[1] + Vector((0, 0, -1.0))
pieces = []
for k in range(6):
    off = Vector(((k % 3 - 1) * 0.42, 0, (k // 3) * 0.4))
    pc = box("B Piece %d" % k, (0.42, 0.6, 0.4), cpk_mat("S"), s0 + off)
    appear(pc, sec(8.3), dur=10)
    move(pc, sec(10.6), sec(11.6), s0 + off, s0 + off * 3.5 + Vector((0, -0.3, 0.3)))
    kf(pc, "rotation_euler", sec(10.6), (0, 0, 0), 'BEZIER')
    kf(pc, "rotation_euler", sec(11.6), (0.8 * k, 0.5, 0.3 * k), 'BEZIER')
hm = empty("B Hammer", s0 + Vector((0, 0, 3.0)))
box("B Head", (1.0, 0.6, 0.6), IRON, (0, 0, 0), hm)
cyl("B Handle", 0.08, 0.08, 1.8, mat_pbr("Wood U8", (0.45, 0.28, 0.12), roughness=0.7), (0, 0, 1.2), hm)
appear(hm, sec(8.6), dur=10)
kf(hm, "location", sec(9.6), s0 + Vector((0, 0, 3.0)), 'BEZIER')
kf(hm, "location", sec(10.6), s0 + Vector((0, 0, 1.1)), 'LINEAR')
kf(hm, "location", sec(11.6), s0 + Vector((0, 0, 3.0)), 'BEZIER')

c0 = S[2] + Vector((-0.9, 0, -1.7))
beaker("C", c0, 1.0, 2.0, 1.4, 14.3)
bubbles("C Gas", c0.x - 0.4, c0.x + 0.4, c0.z + 0.2, c0.z + 1.35, c0.y - 0.2, 15.0, 20.5, n=8, r=0.08,
        mat=mat_emit("CO2 Gas U8", (0.8, 0.85, 0.9), 1.0))
big("Lbl C Ox", "CO₂", c0 + Vector((0, -0.8, 2.95)), 15.2, 20.0, size=0.5)
lp = c0 + Vector((2.3, 0, 2.2))
la, lb = litmus("C", lp, 20.0, "blue", "red", 22.6)
for o in (la, lb):
    move(o, sec(20.6), sec(22.0), lp, c0 + Vector((0.55, -0.1, 1.2)))
big("Lbl C", "acid", c0 + Vector((0, -0.8, 2.95)), 23.0, None, mat=M["red"], size=0.55)

gain("D", 17, S[3] + Vector((0.7, 0, -0.4)), 26.3, 27.8, 1, "−")
big("Lbl D", "Cl⁻", S[3] + Vector((0.7, -0.8, 1.4)), 31.5, None, size=0.5)

e0 = S[4] + Vector((0, 0, -1.7))
jar_of("E O", e0 + Vector((-3.0, 0, 0)), "F", 34.3, r=0.7, h=2.0)
j = jar("E Br Jar", 0.7, 2.0, e0, top=True)
appear(j, sec(34.9))
lq = liquid("E Br Liq", 0.67, 0.6, e0 + Vector((0, 0, 0.01)), mat=mat_emit("Bromine Liq U8", (0.55, 0.12, 0.04), 1.2, alpha=0.9))
appear(lq, sec(35.1))
vp = liquid("E Br Vap", 0.67, 1.35, e0 + Vector((0, 0, 0.62)), mat=JAR["Br"])
appear(vp, sec(35.3))
lump("E S", e0 + Vector((3.0, 0, 0.45)), 0.55, cpk_mat("S"), 35.6)
for k, (txt, x, t) in enumerate((("O₂ gas", -3.0, 35.0), ("Br liquid", 0.0, 35.6), ("S solid", 3.0, 36.2))):
    big("Lbl E %d" % k, txt, e0 + Vector((x, -0.9, 2.6)), t, None, size=0.45)

f0 = S[5] + Vector((0, 0, -1.2))
for k, sy in enumerate(("Hg", "Ga", "Cs")):
    p = f0 + Vector((-2.4 + 2.4 * k, 0, 0))
    d = blob("F %s" % sy, (0.6, 0.6, 0.35), AG_M if sy != "Cs" else AU_M, p, None, bump=0.04, seed=k)
    appear(d, sec(44.4 + 0.6 * k), dur=12)
    big("Lbl F %s" % sy, sy, p + Vector((0, -0.9, 0.9)), 44.6 + 0.6 * k, None, size=0.5)

g0 = S[6] + Vector((0, 0, -0.5))
gna, rna, ona = atom_ring(11, g0 + Vector((-2.6, 0, 0)), 52.3, scale=0.8, name="G Na")
gcl, rcl, ocl = atom_ring(17, g0 + Vector((2.6, 0, 0)), 52.5, counts=[2, 8, 8], scale=0.8, name="G Cl")
a = seat_world(g0 + Vector((-2.6, 0, 0)), rna[-1], 0, 1)
b = seat_world(g0 + Vector((2.6, 0, 0)), rcl[-1], 4, 8)
hide_from(ona[0], sec(54.0))
travel("G Hop", a, b, 54.0, dur=1.6, lift=1.0)
hide_until(ocl[4], sec(55.6))
drop_ring("G Na", 2, 56.0)
charge("G S Na", "+", g0 + Vector((-1.8, -0.5, 1.0)), 56.3, None, size=0.8)
charge("G S Cl", "−", g0 + Vector((3.8, -0.5, 1.6)), 56.5, None, size=0.8)
big("Lbl G M", "metal", g0 + Vector((-2.6, -0.8, -1.8)), 56.8, None, mat=M["cyan"], size=0.45)
big("Lbl G N", "non-metal", g0 + Vector((2.6, -0.8, -1.8)), 57.0, None, mat=M["green"], size=0.45)

h0 = S[7] + Vector((0, 0, -0.8))
litmus("H M", h0 + Vector((-1.6, 0, 0)), 60.3, "red", "blue", 62.5)
litmus("H N", h0 + Vector((1.6, 0, 0)), 60.5, "blue", "red", 63.5)
big("Lbl H M", "Na₂O", h0 + Vector((-1.6, -0.8, 1.3)), 60.6, None, mat=M["cyan"], size=0.5)
big("Lbl H N", "SO₂", h0 + Vector((1.6, -0.8, 1.3)), 60.8, None, mat=M["red"], size=0.5)

tb = Table("I Table", S[8], zs=range(1, 55), numbers=False, f_in=sec(68.2), order_dur=1.2)
tb.focus([9, 17, 35, 53], sec(70.0), None)
tb.lift([9, 17, 35, 53], sec(70.0), None, dz=1.0)
tb.pulse(9, sec(72.0), k=1.5)
big("Lbl I", "F: 4.0", tb.world(9, 1.2) + Vector((-1.6, -0.6, 0.4)), 72.5, None, mat=M["gold"], size=0.6)
finish_film()
