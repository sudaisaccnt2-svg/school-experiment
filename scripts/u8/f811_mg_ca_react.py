# ---- Film 811: Chemical properties of magnesium and calcium (textbook pp.233-234: i. with hydrogen on heating:
# Mg + H₂ → MgH₂, Ca + H₂ → CaH₂; ii. burn in air: magnesium with a dazzling flame → MgO (magnesia), calcium with a
# brick-red flame → CaO; the oxides dissolve in water → basic Mg(OH)₂, Ca(OH)₂; iii. with nitrogen on heating:
# 3Mg + N₂ → Mg₃N₂, 3Ca + N₂ → Ca₃N₂; iv. with acids → hydrogen (Mg + 2HCl → MgCl₂ + H₂, also H₂SO₄); v. with
# halogens: MgCl₂, MgBr₂, CaCl₂, CaBr₂) (v4) ----
start_film("811", "811 Mg and Ca React", 70.5)
END = scene.frame_end
S = [Vector((40 * k, 0, 0)) for k in range(8)]

shot("Cam H", 0, 8, S[0] + Vector((0, 0, -0.6)), dist=10, pitch=0.04)
shot("Cam Mg Burn", 8, 16, S[1] + Vector((0, 0, -0.6)), dist=8, pitch=0.08)
shot("Cam Ca Burn", 16, 24, S[2] + Vector((0, 0, -0.6)), dist=8, pitch=0.08)
shot("Cam Basic", 24, 34, S[3] + Vector((0, 0, -0.6)), dist=10, pitch=0.06)
shot("Cam N", 34, 42, S[4] + Vector((0, 0, -0.6)), dist=10, pitch=0.04)
shot("Cam Acid", 42, 56, S[5] + Vector((0, 0, -0.6)), dist=9, pitch=0.06)
shot("Cam Halogen", 56, None, S[6] + Vector((0, 0, -0.6)), dist=9, pitch=0.06)
for name, t in (("Hydrogen", 0), ("Burning", 8), ("Basic oxides", 24), ("Nitrogen", 34), ("Acids", 42), ("Halogens", 56)):
    act(name, sec(t))

say('A1', 'Heated with hydrogen: MgH₂', 0.1, 8)
say('B1', 'Magnesium: dazzling white flame', 8, 16)
say('B2', 'Calcium: brick-red flame', 16, 24)
say('C1', 'Their oxides make bases', 24, 34)
say('D1', 'With nitrogen: Mg₃N₂', 34, 42)
say('E1', 'Acid: hydrogen bubbles', 42, 49)
say('E2', 'Mg + 2HCl → MgCl₂ + H₂', 49, 56)
say('F1', 'With chlorine: MgCl₂', 56, 63)
say('F2', 'Also CaCl₂, MgBr₂, CaBr₂', 63, 70)

a0 = S[0] + Vector((0, 0, -0.4))
mg = A("A Mg", "Mg", a0 + Vector((-2.6, 0, 0)), 0.4)
h1 = A("A H1", "H", a0 + Vector((2.2, 0, 0.35)), 0.6)
h2 = A("A H2", "H", a0 + Vector((2.2, 0, -0.35)), 0.7)
cflame("A Heat", a0 + Vector((0, 0, -1.6)), (1.0, 0.5, 0.12), 1.0, 5.0, s=0.5)
mv(mg, 2.5, 4.3, a0 + Vector((-2.6, 0, 0)), a0)
mv(h1, 2.5, 4.3, a0 + Vector((2.2, 0, 0.35)), a0 + Vector((-0.85, 0, 0.0)))
mv(h2, 2.5, 4.3, a0 + Vector((2.2, 0, -0.35)), a0 + Vector((0.85, 0, 0.0)))
big("Lbl A", "MgH₂", a0 + Vector((0, -0.8, 1.3)), 4.8, None, mat=M["gold"], size=0.55)

for k, (key, mat, rgb, ox, t0) in enumerate((("B", MG_M, (1.0, 1.0, 1.0), "MgO", 8.0),
                                              ("C", mat_pbr("Calcium U8", (0.9, 0.9, 0.88), metallic=0.85, roughness=0.3),
                                               (0.9, 0.22, 0.08), "CaO", 16.0))):
    c = S[1 + k] + Vector((0, 0, -1.1))
    lm = lump(key + " Lump", c, 0.55, mat, t0 + 0.3, seed=k)
    cflame(key + " Fire", c + Vector((0, -0.1, 0.25)), rgb, t0 + 1.4, t0 + 6.0, s=0.85)
    if k == 0:
        for j in range(3):
            flash("B Flash %d" % j, c + Vector((0, -0.4, 0.6)), sec(t0 + 1.6 + 1.2 * j), 0.6)
    dissolve_out(lm, t0 + 4.5, 1.2)
    lump(key + " Ox", c + Vector((0, 0, -0.15)), 0.45, SALT_W, t0 + 5.5, seed=k + 4)
    big("Lbl %s" % key, ox, c + Vector((0, -0.8, 1.6)), t0 + 6.0, None, mat=M["white"], size=0.55)

d0 = S[3] + Vector((-0.9, 0, -1.7))
beaker("D", d0, 1.0, 2.0, 1.4, 24.3)
for k in range(6):
    p = d0 + Vector((-0.3 + 0.12 * k, -0.2, 2.35))
    d = sphere("D Ox %d" % k, 0.1, SALT_W, p, None, 12, 6)
    appear(d, sec(24.6), s=(0.1,) * 3)
    move(d, sec(25.4 + 0.1 * k), sec(26.4 + 0.1 * k), p, d0 + Vector((-0.3 + 0.12 * k, -0.2, 0.9)))
    hide_from(d, sec(27.2 + 0.1 * k), (0.1,) * 3)
lp = d0 + Vector((2.3, 0, 2.2))
la, lb = litmus("D", lp, 27.0, "red", "blue", 29.4)
for o in (la, lb):
    move(o, sec(27.6), sec(29.0), lp, d0 + Vector((0.55, -0.1, 1.2)))
big("Lbl D", "Mg(OH)₂", d0 + Vector((0, -0.8, 2.95)), 29.8, None, mat=M["cyan"], size=0.5)

e0 = S[4] + Vector((0, 0, -0.4))
mgs = [A("E Mg%d" % k, "Mg", e0 + Vector((-3.0, 0, 1.0 - 1.0 * k)), 34.3 + 0.1 * k, k=0.8) for k in range(3)]
nn = [A("E N%d" % k, "N", e0 + Vector((2.6, 0, 0.35 - 0.7 * k)), 34.6, k=0.8) for k in range(2)]
cflame("E Heat", e0 + Vector((0, 0, -1.7)), (1.0, 0.5, 0.12), 35.0, 39.0, s=0.5)
for k in range(3):
    mv(mgs[k], 36.0, 37.8, e0 + Vector((-3.0, 0, 1.0 - 1.0 * k)), e0 + Vector((-0.9 + 0.9 * k, 0, 0.75 if k != 1 else 0.95)))
for k in range(2):
    mv(nn[k], 36.0, 37.8, e0 + Vector((2.6, 0, 0.35 - 0.7 * k)), e0 + Vector((-0.45 + 0.9 * k, 0, -0.35)))
big("Lbl E", "Mg₃N₂", e0 + Vector((0, -0.8, 1.7)), 38.3, None, mat=M["gold"], size=0.55)

f0 = S[5] + Vector((0, 0, -1.5))
beaker("F", f0, 1.1, 2.2, 1.6, 42.3, liq_mat=mat_emit("Acid U8", (0.85, 1.0, 0.7), 0.4, alpha=0.2))
rib = box("F Ribbon", (0.9, 0.08, 0.25), MG_M, f0 + Vector((0, -0.1, 0.4)))
appear(rib, sec(43.0), dur=10)
fizz("F", f0 + Vector((0, 0, 0.5)), 43.6, 56.0, n=10, spread=0.45, rise=1.2, period=0.9)
dissolve_out(rib, 49.0, 5.0)
big("Lbl F", "H₂", f0 + Vector((1.9, -0.8, 2.0)), 45.0, None, mat=M["cyan"], size=0.55)
big("Lbl F2", "HCl", f0 + Vector((0, -0.8, 2.75)), 43.0, None, mat=M["white"], size=0.45)

g0 = S[6] + Vector((0, 0, -1.7))
jar_of("G", g0, "Cl", 56.3, r=0.9, h=2.5)
gm = lump("G Mg", g0 + Vector((0, -0.1, 0.8)), 0.35, MG_M, 56.8)
cflame("G Fire", g0 + Vector((0, -0.2, 1.0)), (1.0, 1.0, 1.0), 58.0, 61.5, s=0.7)
dissolve_out(gm, 60.0, 1.5)
lump("G Salt", g0 + Vector((0, -0.1, 0.5)), 0.5, SALT_W, 61.0, seed=4)
big("Lbl G", "MgCl₂", g0 + Vector((1.8, -0.8, 1.6)), 61.5, None, mat=M["white"], size=0.55)
for k, f in enumerate(("CaCl₂", "MgBr₂", "CaBr₂")):
    big("Lbl G %d" % k, f, g0 + Vector((-2.3, -0.8, 2.3 - 0.7 * k)), 63.4 + 0.6 * k, None, mat=M["dim"], size=0.42)
finish_film()
