# ---- Film 808: Chemical properties of sodium (textbook pp.230-231: strong reducing agent; i. 2Na + H₂ → 2NaH;
# ii. 4Na + O₂ → 2Na₂O (basic), Na₂O + H₂O → 2NaOH (why 'alkali'); iii. 2Na + 2H₂O → 2NaOH + H₂ + heat, the hydrogen
# catches fire; kept in kerosene oil or liquid paraffin; iv. 2Na + Cl₂ → 2NaCl, 2Na + Br₂ → 2NaBr; v. 2Na + S → Na₂S;
# vi. reducing agent: 2Na + MgO → Na₂O + Mg, 4Na + TiCl₄ → 4NaCl + Ti) (v4) ----
start_film("808", "808 Sodium Reacts", 80.5)
END = scene.frame_end
S = [Vector((40 * k, 0, 0)) for k in range(9)]

shot("Cam H", 0, 10, S[0] + Vector((0, 0, -0.6)), dist=10, pitch=0.04)
shot("Cam Burn", 10, 18, S[1] + Vector((0, 0, -0.6)), dist=8, pitch=0.08)
shot("Cam Alkali", 18, 26, S[2] + Vector((0, 0, -0.6)), dist=10, pitch=0.06)
shot("Cam Water", 26, 40, S[3] + Vector((0, 0, -0.6)), dist=9, pitch=0.08)
shot("Cam Kero", 40, 48, S[4] + Vector((0, 0, -0.6)), dist=9, pitch=0.08)
shot("Cam Salts", 48, 64, S[5] + Vector((0, 0, -0.6)), dist=11, pitch=0.06)
shot("Cam MgO", 64, 72, S[6] + Vector((0, 0, -0.6)), dist=10, pitch=0.04)
shot("Cam Ti", 72, None, S[7] + Vector((0, 0, -0.6)), dist=10, pitch=0.04)
for name, t in (("Hydrogen", 0), ("Oxygen", 10), ("Water", 26), ("Halogens, sulphur", 48), ("Reducing agent", 64)):
    act(name, sec(t))

say('A1', '2Na + H₂ → 2NaH', 0.1, 10)
say('B1', 'Burns in oxygen: Na₂O', 10, 18)
say('B2', 'Na₂O + water: NaOH', 18, 26)
say('C1', 'On water: fizz and heat', 26, 33)
say('C2', 'The hydrogen catches fire', 33, 40)
say('D1', 'So it sleeps in kerosene', 40, 48)
say('E1', 'With chlorine: NaCl', 48, 56)
say('E2', 'Bromine: NaBr · sulphur: Na₂S', 56, 64)
say('F1', 'Sodium takes oxygen from MgO', 64, 72)
say('F2', 'Sodium frees titanium', 72, 80)

# ---- A. 2Na + H₂ → 2NaH ----
a0 = S[0] + Vector((0, 0, -0.4))
na1 = A("A Na1", "Na", a0 + Vector((-3.2, 0, 0.9)), 0.4)
na2 = A("A Na2", "Na", a0 + Vector((-3.2, 0, -0.9)), 0.5)
h1 = A("A H1", "H", a0 + Vector((2.0, 0, 0.3)), 0.7)
h2 = A("A H2", "H", a0 + Vector((2.0, 0, -0.3)), 0.8)
mv(na1, 3.0, 5.0, a0 + Vector((-3.2, 0, 0.9)), a0 + Vector((-0.45, 0, 0.9)))
mv(na2, 3.0, 5.0, a0 + Vector((-3.2, 0, -0.9)), a0 + Vector((-0.45, 0, -0.9)))
mv(h1, 3.0, 5.0, a0 + Vector((2.0, 0, 0.3)), a0 + Vector((0.45, 0, 0.9)))
mv(h2, 3.0, 5.0, a0 + Vector((2.0, 0, -0.3)), a0 + Vector((0.45, 0, -0.9)))
big("Lbl A", "NaH", a0 + Vector((2.2, -0.8, 0)), 5.5, None, mat=M["gold"], size=0.55)

# ---- B. burns yellow → white Na₂O; dissolves → NaOH turns red litmus blue ----
b0 = S[1] + Vector((0, 0, -1.1))
nb = lump("B Na", b0, 0.55, NA_M, 10.3)
cflame("B Fire", b0 + Vector((0, -0.1, 0.25)), (1.0, 0.8, 0.15), 11.2, 16.0, s=0.75)
dissolve_out(nb, 14.5, 1.5)
lump("B Ox", b0 + Vector((0, 0, -0.15)), 0.5, SALT_W, 15.5, seed=3)
big("Lbl B", "Na₂O", b0 + Vector((0, -0.8, 1.6)), 16.0, None, mat=M["white"], size=0.55)
c0 = S[2] + Vector((-0.9, 0, -1.7))
beaker("C", c0, 1.0, 2.0, 1.4, 18.3)
for k in range(6):
    p = c0 + Vector((-0.3 + 0.12 * k, -0.2, 2.35))
    d = sphere("C Ox %d" % k, 0.1, SALT_W, p, None, 12, 6)
    appear(d, sec(18.6), s=(0.1,) * 3)
    move(d, sec(19.4 + 0.1 * k), sec(20.4 + 0.1 * k), p, c0 + Vector((-0.3 + 0.12 * k, -0.2, 0.9)))
    hide_from(d, sec(21.2 + 0.1 * k), (0.1,) * 3)
lp = c0 + Vector((2.3, 0, 2.2))
la, lb = litmus("C", lp, 21.0, "red", "blue", 23.2)
for o in (la, lb):
    move(o, sec(21.6), sec(22.8), lp, c0 + Vector((0.55, -0.1, 1.2)))
big("Lbl C", "NaOH", c0 + Vector((0, -0.8, 2.95)), 23.5, None, mat=M["cyan"], size=0.55)

# ---- C. on water: fizz, then the hydrogen catches fire ----
d0 = S[3] + Vector((0, 0, -1.6))
surf = trough("D", d0, 26.3, w=5.0, h=1.6)
nw = lump("D Na", surf + Vector((0, 0, 1.3)), 0.35, NA_M, 26.6)
move(nw, sec(27.0), sec(27.8), surf + Vector((0, 0, 1.3)), surf + Vector((0, 0, 0.08)))
t, j = 28.0, 0
while t < 38.0:
    kf(nw, "location", sec(t), surf + Vector((0.7 * math.sin(j * 1.7), 0, 0.08)), 'BEZIER')
    t += 0.7
    j += 1
fizz("D", surf + Vector((0, 0, 0.1)), 28.0, 39.0, n=10, period=0.7, spread=0.8)
big("Lbl D", "H₂", S[3] + Vector((-2.0, -0.8, 0.6)), 29.0, None, mat=M["cyan"], size=0.5)
fire = cflame("D Fire", surf + Vector((0, -0.1, 0.15)), (1.0, 0.6, 0.15), 33.4, 40.0, s=0.6)
kf(fire, "location", sec(33.4), surf + Vector((0, -0.1, 0.15)), 'BEZIER')
t, j = 33.4, 0
while t < 38.0:
    kf(fire, "location", sec(t), surf + Vector((0.7 * math.sin((j + 8) * 1.7), -0.1, 0.15)), 'BEZIER')
    t += 0.7
    j += 1

# ---- D. kerosene ----
kero_jar("E", S[4] + Vector((0, 0, -1.4)), 40.3)
big("Lbl E", "kerosene", S[4] + Vector((1.1, -0.8, 1.0)), 42.0, None, mat=M["gold"], size=0.5, align='LEFT')

# ---- E. with chlorine: the electron moves; then NaBr and Na₂S ----
f0 = S[5] + Vector((0, 0, -0.5))
gna, rna, ona = atom_ring(11, f0 + Vector((-2.4, 0, 0)), 48.3, 56.0, scale=0.8, name="F Na")
cl_cnt = [2, 8, 8]
gcl, rcl, ocl = atom_ring(17, f0 + Vector((2.4, 0, 0)), 48.5, 56.0, counts=cl_cnt, scale=0.8, name="F Cl")
a = seat_world(f0 + Vector((-2.4, 0, 0)), rna[-1], 0, 1)
b = seat_world(f0 + Vector((2.4, 0, 0)), rcl[-1], 4, 8)
hide_from(ona[0], sec(50.0))
travel("F Hop", a, b, 50.0, dur=1.6, lift=1.0)
hide_until(ocl[4], sec(51.6))
drop_ring("F Na", 2, 52.2)
charge("F S Na", "+", f0 + Vector((-1.6, -0.5, 1.0)), 52.6, 56.0, size=0.8)
charge("F S Cl", "−", f0 + Vector((3.6, -0.5, 1.6)), 52.8, 56.0, size=0.8)
for k, (f, rgb) in enumerate((("NaCl", (0.95, 0.95, 0.92)), ("NaBr", (0.95, 0.92, 0.85)), ("Na₂S", (0.95, 0.9, 0.55)))):
    p = S[5] + Vector((-3.0 + 3.0 * k, 0, -1.2))
    lump("F Salt %d" % k, p, 0.6, mat_pbr("Salt U8 %d" % k, rgb, roughness=0.6), 56.3 + 0.8 * k, seed=k)
    big("Lbl F %d" % k, f, p + Vector((0, -0.9, 1.1)), 56.6 + 0.8 * k, None, size=0.5)

# ---- F. reducing agent: 2Na + MgO → Na₂O + Mg ----
g0 = S[6] + Vector((0, 0, -0.4))
mg = A("G Mg", "Mg", g0 + Vector((1.0, 0, 0)), 64.3)
ox = A("G O", "O", g0 + Vector((2.6, 0, 0)), 64.4)
n1 = A("G Na1", "Na", g0 + Vector((-3.4, 0, 0.7)), 64.6)
n2 = A("G Na2", "Na", g0 + Vector((-3.4, 0, -0.7)), 64.7)
mv(n1, 66.0, 67.5, g0 + Vector((-3.4, 0, 0.7)), g0 + Vector((-1.0, 0, 0.7)))
mv(n2, 66.0, 67.5, g0 + Vector((-3.4, 0, -0.7)), g0 + Vector((-1.0, 0, -0.7)))
mv(ox, 67.8, 69.3, g0 + Vector((2.6, 0, 0)), g0 + Vector((-0.1, 0, 0)))
big("Lbl G", "Mg left alone", g0 + Vector((1.0, -0.8, 1.4)), 69.6, None, mat=M["gold"], size=0.45)

# ---- F2. 4Na + TiCl₄ → 4NaCl + Ti ----
h0 = S[7] + Vector((0, 0, -0.4))
ti = A("H Ti", "Ti", h0 + Vector((1.4, 0, 0)), 72.3)
cls = []
for k, v in enumerate(((0, 0, 1.0), (1.0, 0, 0), (0, 0, -1.0), (-1.0, 0, 0))):
    cls.append((A("H Cl%d" % k, "Cl", h0 + Vector((1.4, 0, 0)) + Vector(v) * 0.95, 72.5, k=0.7), Vector(v)))
nas = [A("H Na%d" % k, "Na", h0 + Vector((-4.0, 0, 1.2 - 0.8 * k)), 72.8, k=0.7) for k in range(4)]
for k in range(4):
    mv(nas[k], 74.0, 75.5, h0 + Vector((-4.0, 0, 1.2 - 0.8 * k)), h0 + Vector((-2.6, 0, 1.2 - 0.8 * k)))
    at, v = cls[k]
    mv(at, 75.8 + 0.3 * k, 77.0 + 0.3 * k, h0 + Vector((1.4, 0, 0)) + v * 0.95, h0 + Vector((-1.75, 0, 1.2 - 0.8 * k)))
big("Lbl H", "titanium", h0 + Vector((1.4, -0.8, 1.2)), 78.5, None, mat=M["gold"], size=0.45)
finish_film()
