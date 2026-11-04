# ---- Film 813: Soft and hard metals (textbook pp.235-236: 8.1.4 groups IA and IIA are soft, very reactive, low
# ionization energies; copper, silver, iron are hard / noble: less reactive, high ionization energies, high melting
# points, boiling points and densities; Table 8.7 sodium vs iron: knife cuts Na, iron needs great energy to break;
# metallic bonding weak vs strong; m.p. 97.6 vs 1538 °C, b.p. 880 vs 2862 °C; density 0.927 vs 7.874 g/cm³: Na floats,
# Fe sinks; low vs high tensile strength (buildings, bridges, steel); Na stored in kerosene, iron less reactive) (v4) ----
start_film("813", "813 Soft and Hard Metals", 58.5)
END = scene.frame_end
S = [Vector((40 * k, 0, 0)) for k in range(6)]

shot("Cam Kinds", 0, 10, S[0] + Vector((0, 0, -0.6)), dist=11, pitch=0.06)
shot("Cam Knife", 10, 24, S[1] + Vector((0, 0, -0.6)), dist=10, pitch=0.08)
shot("Cam Water", 24, 34, S[2] + Vector((0, 0, -0.6)), dist=10, pitch=0.08)
shot("Cam Melt", 34, 44, S[3] + Vector((0, 0, -0.3)), dist=11, pitch=0.04)
shot("Cam Bridge", 44, None, S[4] + Vector((0, 0, -0.6)), dist=12, pitch=0.08)
for name, t in (("Soft and hard", 0), ("Knife test", 10), ("Float or sink", 24), ("Melting points", 34), ("Strength", 44)):
    act(name, sec(t))

say('A1', 'IA and IIA: soft metals', 0.1, 5)
say('A2', 'Copper, silver, iron: hard', 5, 10)
say('B1', 'A knife cuts sodium', 10, 17)
say('B2', 'Iron does not give', 17, 24)
say('C1', 'Sodium floats, iron sinks', 24, 34)
say('D1', 'Melts: 97.6 °C vs 1538 °C', 34, 44)
say('E1', 'Strong iron builds bridges', 44, 58)

a0 = S[0] + Vector((0, 0, -1.0))
lump("A Na", a0 + Vector((-3.4, 0, 0)), 0.55, NA_M, 0.4)
lump("A Mg", a0 + Vector((-2.0, 0, 0)), 0.5, MG_M, 0.7, seed=2)
big("Lbl A S", "soft", a0 + Vector((-2.7, -0.8, 1.2)), 1.2, None, mat=M["cyan"], size=0.5)
for k, (mat, sd) in enumerate(((COPPER, 3), (AG_M, 4), (IRON, 5))):
    lump("A H%d" % k, a0 + Vector((1.2 + 1.3 * k, 0, 0)), 0.5, mat, 5.3 + 0.4 * k, seed=sd)
big("Lbl A H", "hard", a0 + Vector((2.5, -0.8, 1.2)), 6.4, None, mat=M["gold"], size=0.5)

b0 = S[1] + Vector((-2.0, 0, -1.2))
L = blob("B NaL", (0.5, 0.5, 0.45), NA_M, b0 + Vector((-0.5, 0, 0)), None, bump=0.12, seed=2)
R = blob("B NaR", (0.5, 0.5, 0.45), NA_M, b0 + Vector((0.5, 0, 0)), None, bump=0.12, seed=3)
for o in (L, R):
    appear(o, sec(10.3), dur=12)
knife("B1", b0, 10.6, 13.0, depth=1.0, t1=17.0)
move(L, sec(13.3), sec(14.3), b0 + Vector((-0.5, 0, 0)), b0 + Vector((-0.9, 0, 0)))
move(R, sec(13.3), sec(14.3), b0 + Vector((0.5, 0, 0)), b0 + Vector((0.9, 0, 0)))
big("Lbl B Na", "Na", b0 + Vector((0, -0.8, 1.5)), 10.8, None, size=0.55)
f0 = S[1] + Vector((2.2, 0, -1.2))
fe = box("B Fe", (1.6, 0.8, 0.8), IRON, f0)
appear(fe, sec(17.3), dur=12)
kn = knife("B2", f0, 17.6, 20.0, depth=0.15)
kf(kn, "location", sec(20.4), f0 + Vector((0, -0.3, 1.9)), 'BEZIER')
flash("B Spark", f0 + Vector((0, -0.5, 0.45)), sec(20.0), 0.35)
big("Lbl B Fe", "Fe", f0 + Vector((0, -0.8, 1.5)), 17.6, None, size=0.55)

c0 = S[2] + Vector((0, 0, -1.6))
surf = trough("C", c0, 24.3, w=5.0, h=2.0)
nl = lump("C Na", surf + Vector((-1.2, 0, 1.4)), 0.35, NA_M, 24.6)
move(nl, sec(25.2), sec(26.2), surf + Vector((-1.2, 0, 1.4)), surf + Vector((-1.2, 0, 0.1)))
bob(nl, surf.z + 0.1, 26.4, 34.0)
fb = box("C Fe", (0.7, 0.5, 0.5), IRON, surf + Vector((1.2, 0, 1.4)))
appear(fb, sec(24.8), dur=10)
move(fb, sec(26.6), sec(29.0), surf + Vector((1.2, 0, 1.4)), c0 + Vector((1.2, 0, 0.28)))
big("Lbl C Na", "0.927", surf + Vector((-1.2, -0.8, 1.2)), 27.0, None, mat=M["cyan"], size=0.45)
big("Lbl C Fe", "7.874", surf + Vector((1.2, -0.8, 1.2)), 29.4, None, mat=M["gold"], size=0.45)

d0 = S[3] + Vector((-1.5, 0, -1.2))
ebar("D Na", d0, 0.25, 34.6, "97.6 °C", BAR_M, w=0.9)
ebar("D Fe", d0 + Vector((3.0, 0, 0)), 3.0, 35.6, "1538 °C", BAR_M, w=0.9, dur=2.0)
big("Lbl D Na", "Na", d0 + Vector((0, -0.8, -0.35)), 34.6, None, size=0.5)
big("Lbl D Fe", "Fe", d0 + Vector((3.0, -0.8, -0.35)), 35.6, None, size=0.5)

e0 = S[4] + Vector((0, 0, -1.6))
deck = box("E Deck", (8.0, 1.2, 0.25), IRON, e0 + Vector((0, 0, 1.2)))
appear(deck, sec(44.3), dur=12)
for k, x in enumerate((-3.6, 0.0, 3.6)):
    pier = box("E Pier %d" % k, (0.4, 0.8, 1.1), IRON, e0 + Vector((x, 0, 0.55)))
    appear(pier, sec(44.5 + 0.2 * k))
for k in range(8):
    x0 = -3.6 + 0.9 * k
    up = k % 2 == 0
    ln = [e0 + Vector((x0, -0.4, 1.3)), e0 + Vector((x0 + 0.9, -0.4, 2.4))] if up else \
         [e0 + Vector((x0, -0.4, 2.4)), e0 + Vector((x0 + 0.9, -0.4, 1.3))]
    tr = pcurve("E Truss %d" % k, ln, IRON, 0.06, "Models")
    appear(tr, sec(45.5 + 0.15 * k))
top = pcurve("E Top", [e0 + Vector((-3.6, -0.4, 2.4)), e0 + Vector((3.6, -0.4, 2.4))], IRON, 0.06, "Models")
appear(top, sec(46.8))
car = box("E Car", (1.0, 0.6, 0.45), mat_pbr("Car U8", (0.8, 0.15, 0.1), metallic=0.5, roughness=0.3), e0 + Vector((-3.6, 0, 1.55)))
appear(car, sec(48.0))
move(car, sec(48.5), sec(56.0), e0 + Vector((-3.6, 0, 1.55)), e0 + Vector((3.6, 0, 1.55)), 'LINEAR')
finish_film()
