# ---- Film 805: Alkaline earth metals (textbook pp.225-226: 8.1.3 group IIA, named because they make alkalies and are
# spread in the earth's crust; two valence electrons (s), lost → M²⁺; Be Mg Ca Sr Ba Ra; often found as sulphates:
# gypsum (CaSO₄), epsom (MgSO₄), barite (BaSO₄); occurrence: beryl; Mg in sea water and chlorophyll; Ca phosphate and
# fluoride, Ca in bones, teeth, egg shells; radium is rare and radioactive) (v4) ----
start_film("805", "805 Alkaline Earth Metals", 64.5)
END = scene.frame_end
S = [Vector((40 * k, 0, 0)) for k in range(7)]

shot("Cam Group", 0, 8, S[0] + Vector((0, 0, -0.3)), dist=15, pitch=0.04)
shot("Cam Ion", 8, 18, S[1] + Vector((0, 0, -0.6)), dist=11, pitch=0.06)
shot("Cam Rocks", 18, 34, S[2] + Vector((0, 0, -0.6)), dist=11, pitch=0.08)
shot("Cam Leaf", 34, 44, S[3] + Vector((0, 0, -0.6)), dist=9, pitch=0.08)
shot("Cam Bone", 44, 54, S[4] + Vector((0, 0, -0.6)), dist=9, pitch=0.08)
shot("Cam Radium", 54, None, S[5] + Vector((0, 0, -0.6)), dist=10, pitch=0.06)
for name, t in (("Group IIA", 0), ("Two electrons", 8), ("Sulphates", 18), ("Living things", 34), ("Radium", 54)):
    act(name, sec(t))

say('A1', 'Group IIA: Be to Ra', 0.1, 8)
say('B1', 'Two electrons leave: Mg²⁺', 8, 18)
say('C1', 'Found as sulphates', 18, 26)
say('C2', 'Gypsum, Epsom salt, barite', 26, 34)
say('D1', 'Magnesium in chlorophyll', 34, 44)
say('E1', 'Calcium in bones and eggs', 44, 54)
say('F1', 'Radium is radioactive', 54, 64)

c0 = S[0]
for k, sy in enumerate(("Be", "Mg", "Ca", "Sr", "Ba", "Ra")):
    tile("A %s" % sy, sy, c0 + Vector((0, 0, 2.2 - 0.95 * k)), "metal", 0.4 + 0.6 * k)
big("Lbl A", "IIA", c0 + Vector((0, -0.6, 2.95)), 0.4, None, mat=M["gold"], size=0.45)

lose("B", 12, S[1] + Vector((-0.8, 0, -0.5)), 8.3, 10.3, "2+")

r0 = S[2] + Vector((0, 0, -1.2))
for k, (nm, rgb, f) in enumerate((("gypsum", (0.9, 0.88, 0.82), "CaSO₄"), ("Epsom salt", (0.85, 0.9, 0.95), "MgSO₄"),
                                  ("barite", (0.75, 0.68, 0.62), "BaSO₄"))):
    p = r0 + Vector((-3.0 + 3.0 * k, 0, 0))
    rock("C %d" % k, p, 0.85, rgb, 18.4 + 0.8 * k, seed=k + 5)
    big("Lbl C F %d" % k, f, p + Vector((0, -0.9, 1.3)), 19.0 + 0.8 * k, 26.0, mat=M["gold"], size=0.45)
    big("Lbl C N %d" % k, nm, p + Vector((0, -0.9, 1.3)), 26.3 + 0.8 * k, None, size=0.45)

l0 = S[3] + Vector((0, 0, -0.7))
leaf = blob("D Leaf", (1.9, 0.12, 1.0), gloss("Leaf U8", (0.12, 0.55, 0.15)), l0, None, bump=0.05, seed=2, rot=(0, 0.3, 0))
appear(leaf, sec(34.3), dur=12)
mg = sphere("D Mg", 0.3, cpk_mat("Mg"), l0 + Vector((0, -0.4, 0)), None, 24, 12)
appear(mg, sec(36.0), s=(0.3,) * 3)
pulse(mg, 37.5, 1.4)
big("Lbl D", "Mg", l0 + Vector((0, -0.9, 0.7)), 36.4, None, mat=M["gold"], size=0.55)

b0 = S[4] + Vector((-1.4, 0, -0.8))
bone = empty("E Bone", b0, rot=(0, 0.4, 0))
cyl("E Shaft", 0.18, 0.18, 2.2, CHALK, (0, 0, 0), bone, rot=(0, math.pi / 2, 0))
for s_ in (-1, 1):
    for dz in (-0.17, 0.17):
        sphere("E Knob %d %.1f" % (s_, dz), 0.26, CHALK, (1.15 * s_, 0, dz), bone, 20, 10)
appear(bone, sec(44.3), dur=12)
egg = blob("E Egg", (0.6, 0.6, 0.8), mat_pbr("Egg U8", (0.95, 0.9, 0.8), roughness=0.5), S[4] + Vector((1.8, 0, -0.8)))
appear(egg, sec(45.0), dur=12)
big("Lbl E", "Ca", S[4] + Vector((0, -0.9, 0.9)), 46.5, None, mat=M["gold"], size=0.55)

f0 = S[5] + Vector((0, 0, -0.1))
tile("F Ra", "Ra", f0, "metal", 54.3)
for k in range(8):
    ang = 2 * math.pi * k / 8
    d = Vector((math.cos(ang), 0, math.sin(ang)))
    energy_wave("F Ray %d" % k, f0 + d * 0.7 + Vector((0, -0.3, 0)), d, 56.0 + 0.5 * k, dist=1.0, dur=1.2)
    energy_wave("F Ray2 %d" % k, f0 + d * 0.7 + Vector((0, -0.3, 0)), d, 60.0 + 0.4 * k, dist=1.0, dur=1.2)
finish_film()
