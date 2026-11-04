# ---- Film 802: Electropositive (metallic) character (textbook pp.220-221: 8.1.1 the tendency to lose electrons and
# form cations: Na → Na⁺ + e⁻, Ca → Ca²⁺ + 2e⁻, Al → Al³⁺ + 3e⁻; low ionization energy = metal; non-metals accept
# electrons: F + e⁻ → F⁻, Cl + e⁻ → Cl⁻, O + 2e⁻ → O²⁻; (i) metallic character decreases across a period (period 2
# and 3: metals, metalloid, non-metals); (ii) increases down a group (groups IV and V)) (v4) ----
start_film("802", "802 Metallic Character", 64.5)
END = scene.frame_end
S = [Vector((40 * k, 0, 0)) for k in range(7)]

shot("Cam Na", 0, 7, S[0] + Vector((0, 0, -0.6)), dist=10, pitch=0.06)
shot("Cam Ca", 7, 14, S[1] + Vector((0, 0, -0.6)), dist=11, pitch=0.06)
shot("Cam Al", 14, 21, S[2] + Vector((0, 0, -0.6)), dist=10, pitch=0.06)
shot("Cam Cl", 21, 28, S[3] + Vector((0, 0, -0.6)), dist=10, pitch=0.06)
shot("Cam O", 28, 35, S[4] + Vector((0, 0, -0.6)), dist=10, pitch=0.06)
shot("Cam Period", 35, 50, S[5] + Vector((0, 0, -0.4)), dist=13, pitch=0.04)
shot("Cam Group", 50, None, S[6] + Vector((0, 0, -0.3)), dist=15.5, pitch=0.04)
for name, t in (("Metals lose", 0), ("Non-metals gain", 21), ("Across a period", 35), ("Down a group", 50)):
    act(name, sec(t))

say('A1', 'Sodium loses one', 0.1, 7)
say('A2', 'Calcium loses two', 7, 14)
say('A3', 'Aluminium loses three', 14, 21)
say('B1', 'Chlorine gains one', 21, 28)
say('B2', 'Oxygen gains two', 28, 35)
say('C1', 'Period 2: metals to non-metals', 35, 42)
say('C2', 'Period 3: the same', 42, 50)
say('D1', 'Down a group: more metallic', 50, 64)

lose("A", 11, S[0] + Vector((-0.6, 0, -0.4)), 0.3, 2.2, "+")
lose("B", 20, S[1] + Vector((-0.8, 0, -0.4)), 7.3, 9.0, "2+", scale=0.72)
lose("C", 13, S[2] + Vector((-0.7, 0, -0.4)), 14.3, 15.8, "3+")
big("Lbl A", "Na⁺", S[0] + Vector((-0.6, -0.8, 1.4)), 5.6, None, mat=M["white"], size=0.5)
big("Lbl B", "Ca²⁺", S[1] + Vector((-0.8, -0.8, 1.9)), 12.6, None, mat=M["white"], size=0.5)
big("Lbl C", "Al³⁺", S[2] + Vector((-0.7, -0.8, 1.4)), 19.6, None, mat=M["white"], size=0.5)
gain("D", 17, S[3] + Vector((0.7, 0, -0.4)), 21.3, 22.8, 1, "−")
gain("E", 8, S[4] + Vector((0.7, 0, -0.4)), 28.3, 29.8, 2, "2−")
big("Lbl D", "Cl⁻", S[3] + Vector((0.7, -0.8, 1.4)), 26.2, None, mat=M["white"], size=0.5)
big("Lbl E", "O²⁻", S[4] + Vector((0.7, -0.8, 1.1)), 33.0, None, mat=M["white"], size=0.5)

# ---- periods 2 and 3: metals → metalloid → non-metals ----
KIND = {"Li": "metal", "Be": "metal", "B": "metalloid", "C": "nonmetal", "N": "nonmetal", "O": "nonmetal", "F": "nonmetal",
        "Ne": "nonmetal", "Na": "metal", "Mg": "metal", "Al": "metal", "Si": "metalloid", "P": "nonmetal", "S": "nonmetal",
        "Cl": "nonmetal", "Ar": "nonmetal"}
p0 = S[5]
for row, (syms, z, t) in enumerate(((("Li", "Be", "B", "C", "N", "O", "F", "Ne"), 1.4, 35.5),
                                    (("Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar"), 0.3, 42.5))):
    for k, sy in enumerate(syms):
        tile("P%d %s" % (row, sy), sy, p0 + Vector((-3.5 + k, 0, z)), KIND[sy], t + 0.35 * k)
for k, (txt, x, mat) in enumerate((("metals", -3.0, M["cyan"]), ("metalloid", -1.5, M["gold"]),
                                   ("non-metals", 1.5, M["green"]))):
    big("Lbl P %d" % k, txt, p0 + Vector((x, -0.6, 2.35)), 38.8 + 0.4 * k, None, mat=mat, size=0.42)
ar = arrow("P Arrow", 6.4, M["white"], None, p0 + Vector((-3.2, -0.2, -0.6)), r=0.03, head=0.22)
appear(ar, sec(45.5))
big("Lbl P Ar", "less metallic →", p0 + Vector((0, -0.6, -1.05)), 45.8, None, mat=M["gold"], size=0.42)

# ---- groups IV and V: non-metal on top, metal at the bottom ----
g0 = S[6]
for col, (syms, x) in enumerate(((("C", "Si", "Ge", "Sn", "Pb"), -0.6), (("N", "P", "As", "Sb", "Bi"), 0.6))):
    kinds = ("nonmetal", "metalloid", "metalloid", "metal", "metal") if col == 0 else \
            ("nonmetal", "nonmetal", "metalloid", "metalloid", "metal")
    for k, sy in enumerate(syms):
        tile("G%d %s" % (col, sy), sy, g0 + Vector((x, 0, 2.2 - 0.95 * k)), kinds[k], 50.4 + 0.7 * k + 0.2 * col)
big("Lbl G IV", "IV", g0 + Vector((-0.6, -0.6, 2.95)), 50.5, None, size=0.4)
big("Lbl G V", "V", g0 + Vector((0.6, -0.6, 2.95)), 50.7, None, size=0.4)
ad = arrow("G Arrow", 3.6, M["gold"], None, g0 + Vector((1.6, -0.2, 2.0)), rot=(0, math.pi / 2, 0), r=0.03, head=0.22)
appear(ad, sec(55.5))
big("Lbl G Ar", "more metallic", g0 + Vector((1.9, -0.6, 0.2)), 56.0, None, mat=M["gold"], size=0.42, align='LEFT')
finish_film()
