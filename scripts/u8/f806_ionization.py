# ---- Film 806: Ionization energy (textbook pp.226-228: the minimum energy to remove the valence electron from a gaseous
# atom; (a) alkali metals: Na → Na⁺ + e⁻, ΔE = 496 kJ/mol; Li smallest, highest; down the group the radius grows and the
# energy falls (Table 8.2: 520, 496, 419, 403, 376); (b) alkaline earth metals: ns², extra nuclear charge, smaller,
# higher energies (Table 8.3: 899, 738, 590, 549, 503); Mg first 737.7, second 1450.7 kJ/mol; beryllium behaves
# differently; lower energies make group IA more reactive than IIA) (v4) ----
start_film("806", "806 Ionization Energy", 72.5)
END = scene.frame_end
S = [Vector((40 * k, 0, 0)) for k in range(6)]

shot("Cam Pull", 0, 12, S[0] + Vector((0, 0, -0.6)), dist=11, pitch=0.06)
shot("Cam Size", 12, 20, S[1] + Vector((0, 0, -0.6)), dist=13, pitch=0.04)
shot("Cam IA", 20, 30, S[2] + Vector((0, 0, -0.6)), dist=13, pitch=0.04)
shot("Cam IIA", 30, 40, S[3] + Vector((0, 0, -0.6)), dist=13, pitch=0.04)
shot("Cam Mg", 40, 58, S[4] + Vector((0, 0, -0.6)), dist=12, pitch=0.04)
shot("Cam Compare", 58, None, S[5] + Vector((0, 0, -0.6)), dist=11, pitch=0.04)
for name, t in (("Ionization energy", 0), ("Down group IA", 12), ("Group IIA", 30), ("Second electron", 40),
                ("IA vs IIA", 58)):
    act(name, sec(t))

say('A1', 'Energy pulls the electron off', 0.1, 6)
say('A2', 'That energy: ionization energy', 6, 12)
say('B1', 'Atoms grow down group IA', 12, 20)
say('B2', 'Energy falls: 520 → 376', 20, 30)
say('C1', 'Group IIA: 899 → 503', 30, 40)
say('D1', 'Mg first electron: 737.7', 40, 49)
say('D2', 'Second electron: 1450.7', 49, 58)
say('E1', 'Na 496 · Mg 738', 58, 65)
say('E2', 'Lower energy: more reactive', 65, 72)

# ---- A. energy (gold wave) hits sodium; its outer electron leaves ----
a0 = S[0] + Vector((-0.4, 0, -0.5))
for k in range(2):
    energy_wave("A Wave %d" % k, a0 + Vector((-4.2, -0.3, 0.3 * k)), (1, 0, 0), 1.4 + 0.4 * k, dist=2.4, dur=0.9)
lose("A", 11, a0, 0.3, 2.6, "+")
big("Lbl A", "496 kJ/mol", S[0] + Vector((0, -0.8, 1.3)), 7.0, None, mat=M["gold"], size=0.55)

# ---- B. the atoms grow: Li, Na, K, Rb, Cs (Table 8.2 radii) ----
b0 = S[1] + Vector((-4.4, 0, -0.6))
xs = [0.0]
RAD = (1.55, 1.86, 2.27, 2.48, 2.65)
for k, rr in enumerate(RAD[1:]):
    xs.append(xs[-1] + 0.36 * (RAD[k] + rr) + 0.25)
for k, (sy, rr) in enumerate(zip(("Li", "Na", "K", "Rb", "Cs"), RAD)):
    sp = sphere("B %s" % sy, 0.36 * rr, gloss("Atom Shell U8", (0.3, 0.55, 1.0), 0.3), b0 + Vector((xs[k], 0.3, 0)), None, 32, 16)
    appear(sp, sec(12.4 + 0.7 * k), s=(0.36 * rr,) * 3)
    big("Lbl B %s" % sy, sy, b0 + Vector((xs[k], -0.8, 0)), 12.6 + 0.7 * k, None, size=0.45)

# ---- B2. Table 8.2 energies as bars ----
bars("C", S[2] + Vector((-2.6, 0, -1.6)), [("Li", 520, "520"), ("Na", 496, "496"), ("K", 419, "419"), ("Rb", 403, "403"),
                                            ("Cs", 376, "376")], 20.4, k=0.0055)
# ---- C. Table 8.3 ----
bars("D", S[3] + Vector((-2.6, 0, -1.6)), [("Be", 899, "899"), ("Mg", 738, "738"), ("Ca", 590, "590"), ("Sr", 549, "549"),
                                            ("Ba", 503, "503")], 30.4, k=0.0032)

# ---- D. magnesium: the second electron costs twice as much ----
m0 = S[4] + Vector((-2.0, 0, -0.5))
nm = "M Mg"
g, radii, outer = atom_ring(12, m0, 40.3, name=nm)
for j, (t, txt, h) in enumerate(((42.0, "737.7", 1.4), (51.0, "1450.7", 2.75))):
    a = seat_world(m0, radii[-1], j, 2)
    hide_from(outer[j], sec(t))
    energy_wave("M Wave %d" % j, m0 + Vector((-3.2, -0.3, 0.2)), (1, 0, 0), t - 0.9, dist=1.4, dur=0.8)
    travel("M Fly %d" % j, a, a + (a - m0).normalized() * 2.2 + Vector((0, -0.2, 0)), t, dur=1.3, lift=0.25)
    ebar("M Bar %d" % j, S[4] + Vector((2.0 + 1.6 * j, 0, -1.6)), h, t + 1.5, txt, BAR_M)
drop_ring(nm, 2, 53.0)
charge("M Sign", "2+", m0 + Vector((1.2, -0.5, 1.2)), 53.4, None, size=0.8)

# ---- E. sodium vs magnesium ----
e0 = S[5] + Vector((-1.2, 0, -1.1))
ebar("E Na", e0, 1.6, 58.4, "496", BAR_M, w=0.9)
ebar("E Mg", e0 + Vector((2.4, 0, 0)), 2.4, 59.2, "738", BAR_M, w=0.9)
big("Lbl E Na", "Na", e0 + Vector((0, -0.8, -0.35)), 58.4, None, size=0.5)
big("Lbl E Mg", "Mg", e0 + Vector((2.4, -0.8, -0.35)), 59.2, None, size=0.5)
cflame("E Fire", e0 + Vector((0, -0.6, 2.3)), (1.0, 0.8, 0.15), 65.4, None, s=0.6)
big("Lbl E", "more reactive", e0 + Vector((-1.9, -0.8, 1.0)), 65.8, None, mat=M["gold"], size=0.45)
finish_film()
