# ---- Film 611: Solubility (textbook pp.166-168: 6.5 solubility, factors (i) nature of solvent, (ii) nature of solute,  (v4 captions)
# like dissolves like (i, ii, iii), Fig 6.7 LiCl crystal: hydrated Li⁺ and Cl⁻, (ii) ionic compounds in non-polar
# solvents) ----
start_film("611", "611 Solubility", 87.5)
END = scene.frame_end
SA, SB, SC, SD, SE, SF, SG = (Vector((40 * k, 0, 0)) for k in range(7))

shot("Cam Solubility", 0, 14, SA + Vector((0, 0, -1.1)), dist=14, pitch=0.1)
shot("Cam Factors", 14, 24, SB + Vector((0, 0, -0.6)), dist=14, pitch=0.1)
shot("Cam Solvent", 24, 34, SC + Vector((0, 0, -1.1)), dist=15, pitch=0.1)
shot("Cam Solute", 34, 46, SF + Vector((0, 0, -1.1)), dist=15, pitch=0.1)
shot("Cam Like", 46, 62, SD + Vector((0, 0, -1.1)), dist=16, pitch=0.1)
shot("Cam Hydration", 62, 80, SE + Vector((0, 0, -0.4)), dist=13, pitch=0.08)
shot("Cam Benzene", 80, None, SG + Vector((0, 0, -1.1)), dist=13, pitch=0.1)
for name, t in (("Solubility", 0), ("Factors", 14), ("Solvent and solute", 24), ("Like dissolves like", 46),
                ("Hydration", 62)):
    act(name, sec(t))

say('A1', 'Grams in 100 g solvent', 0.1, 7)
say('A2', 'NaNO₃ lots · AgCl hardly', 7, 14)
say('B1', 'Solvent and solute', 14, 19)
say('B2', 'Pressure and temperature', 19, 24)
say('C1', 'Salt: water yes, benzene no', 24, 34)
say('C2', 'Different solute, different amount', 34, 46)
say('D1', 'Like dissolves like', 46, 51)
say('D2', 'Benzene and water stay apart', 51, 56)
say('D3', 'Grease dissolves in petrol', 56, 62)
say('E1', 'Water pulls ions out', 62, 70)
say('E2', 'Wrapped in water: hydration', 70, 80)
say('E3', "Benzene can't pull", 80, 87)

# ---- A. NaNO₃ dissolves a lot, AgCl hardly ----
for k, (nm, n_dis, n_stay, m) in enumerate((("NaNO₃", 12, 0, SOLU), ("AgCl", 1, 8, MOL["white"]))):
    c = SA + Vector((-3.2 + 6.4 * k, 0, -2.2))
    beaker("A %d" % k, c, 1.8, 3.0, 2.3, 0.3 + 0.3 * k)
    lo, hi = inside(c, 1.8, 2.3)
    gas("A Solv %d" % k, 14, lo, hi, 0.0, 14.0, speed=0.8, r=0.11, mat=SOLV, seed=1 + k, f_in=sec(0.6))
    seats = grid_pts(4, 3, 0.3, c + Vector((0, -0.2, 0.5)), ny=1)[:n_dis + n_stay]
    dissolve("A Sol %d" % k, seats[:n_dis], lo, hi, 7.0, 8.5, 14.0, r=0.14, mat=m, seed=5 + k, f_in=sec(7.0),
             drop=(0, 0, 3.2), t_land=7.9, gap=0.3)
    for j, s in enumerate(seats[n_dis:]):
        b = sphere("A Stay %d %d" % (k, j), 0.14, m, s + Vector((0, 0, 3.2)), None, 12, 6)
        appear(b, sec(7.0), s=(0.14,) * 3)
        sp = Vector((s.x, s.y, c.z + 0.16 + 0.28 * (j // 4)))
        move(b, sec(7.1), sec(7.9), s + Vector((0, 0, 3.2)), sp, 'LINEAR')
    big("Lbl A %d" % k, nm, c + Vector((0, -0.6, 3.6)), 7.4 + 0.3 * k, None, mat=(M["gold"], M["white"])[k], size=0.55)

# ---- B. four factor icons ----
cB = SB + Vector((0, 0, -0.6))
ic = [empty("B Icon %d" % k, cB + Vector((-5.1 + 3.4 * k, 0, 0))) for k in range(4)]
jar("B Solvent", 0.8, 1.4, (0, 0, -0.7), parent=ic[0])
cyl("B Solvent Liq", 0.77, 0.77, 1.0, WATER, (0, 0, -0.7), ic[0], base=True)
for k in range(8):
    box("B Cry %d" % k, (0.36, 0.36, 0.36), SOLU, ((k % 2 - 0.5) * 0.4, (k // 4 - 0.5) * 0.4, ((k // 2) % 2 - 0.5) * 0.4),
        ic[1])
pg, pp = piston_cyl("B Piston", 0.7, 1.6, (0, 0, -0.8), parent=ic[2])
thermo("B Thermo", (0, 0, -0.8), h=1.8, parent=ic[3])
for k, t in enumerate((14.5, 16.0, 19.2, 20.6)):
    appear(ic[k], sec(t), dur=12)
turn(ic[1], 14.0, 24.0, 0.5)

# ---- C. salt in water vs salt in benzene; then two solutes ----
BENZ = mat_emit("Benzene Liquid", (0.95, 0.85, 0.3), 0.5, alpha=0.2)
BENZ_M = mat_emit("Mol Benzene", (0.95, 0.85, 0.35), 1.2)
for k, (nm, liq_m, mol_m, dis) in enumerate((("water", WATER, SOLV, True), ("benzene", BENZ, BENZ_M, False))):
    c = SC + Vector((-3.4 + 6.8 * k, 0, -2.2))
    beaker("C %d" % k, c, 1.8, 3.0, 2.3, 24.3 + 0.3 * k, liq_mat=liq_m)
    lo, hi = inside(c, 1.8, 2.3)
    gas("C Solv %d" % k, 14, lo, hi, 24.0, 34.0, speed=0.8, r=0.12, mat=mol_m, seed=11 + k, f_in=sec(24.6))
    seats = grid_pts(3, 2, 0.3, c + Vector((0, -0.2, 0.17)), ny=2)
    if dis:
        dissolve("C Salt %d" % k, seats, lo, hi, 25.5, 27.0, 34.0, r=0.14, mat=MOL["white"], seed=15, f_in=sec(25.5),
                 drop=(0, 0, 3.2), t_land=26.4)
    else:
        for j, s in enumerate(seats):
            b = sphere("C Stay %d" % j, 0.14, MOL["white"], s + Vector((0, 0, 3.2)), None, 12, 6)
            appear(b, sec(25.5), s=(0.14,) * 3)
            move(b, sec(25.6), sec(26.4), s + Vector((0, 0, 3.2)), s, 'LINEAR')
    big("Lbl C %d" % k, nm, c + Vector((0, -0.6, 3.6)), 24.8 + 0.3 * k, None, mat=(M["cyan"], BENZ_M)[k], size=0.55)
big("Lbl C S", "salt", SC + Vector((0, -0.6, 1.2)), 26.0, 34.0, mat=M["white"], size=0.5)
big("Lbl C X", "✓  ✗", SC + Vector((0, -0.6, -0.4)), 29.0, 34.0, mat=M["gold"], size=0.6)

# ---- D. like dissolves like: three beakers ----
OIL = mat_emit("Oil Layer", (0.95, 0.75, 0.2), 0.6, alpha=0.45)
for k, (txt, ok, t0) in enumerate((("polar in polar", True, 46.0), ("non-polar + polar", False, 51.0),
                                   ("non-polar in non-polar", True, 56.0))):
    c = SD + Vector((-4.8 + 4.8 * k, 0, -2.2))
    lm = BENZ if k == 2 else WATER
    beaker("D %d" % k, c, 1.4, 2.8, 2.0 if k != 1 else 1.2, t0 + 0.2, liq_mat=lm)
    lo, hi = inside(c, 1.4, 2.0 if k != 1 else 1.2)
    if k == 1:
        oil = liquid("D Oil", 1.36, 0.8, c + Vector((0, 0, 1.2)), OIL)
        appear(oil, sec(t0 + 1.0), dur=10)
    else:
        gas("D Sol %d" % k, 8, lo, hi, t0, 62.0, speed=0.8, r=0.13, mat=(SOLU, None, MOL["brown"])[k] or SOLU,
            seed=20 + k, f_in=sec(t0 + 1.0))
    big("Lbl D %d" % k, ("✓", "✗", "✓")[k], c + Vector((0, -0.6, 3.3)), t0 + 1.5, None,
        mat=M["green"] if ok else M["red"], size=0.8)

# ---- E. Fig 6.7: water pulls Li⁺ and Cl⁻ out of the crystal ----
cE = SE + Vector((-1.6, 0, -0.4))
G = 0.62
ions = {}
for i in range(4):
    for j in range(4):
        li = (i + j) % 2 == 0
        p = cE + Vector(((i - 1.5) * G, 0, (j - 1.5) * G))
        if (i, j) in ((3, 3), (3, 2)):
            continue
        s = sphere("E Ion %d %d" % (i, j), 0.17 if li else 0.3, ION_P if li else ION_N, p, None, 20, 10)
        appear(s, sec(62.3 + 0.04 * (i + j)), s=((0.17 if li else 0.3),) * 3)
for k, ((i, j), li, t0, out) in enumerate((((3, 3), False, 66.0, Vector((3.4, 0, 0.5))),
                                           ((3, 2), True, 71.0, Vector((3.8, 0, -1.2))))):
    p = cE + Vector(((i - 1.5) * G, 0, (j - 1.5) * G))
    cl = empty("E Cluster %d" % k, p)
    sphere("E Free Ion %d" % k, 0.17 if li else 0.3, ION_P if li else ION_N, (0, 0, 0), cl, 20, 10)
    appear(cl, sec(62.5), dur=8)
    for w in range(6):
        a = 2 * math.pi * w / 6
        d = Vector((math.cos(a), 0, math.sin(a)))
        rr = 0.62 if li else 0.78
        near, far = d * rr, d * 3.0
        rot = ((-d) if li else d).to_track_quat('Z', 'Y').to_euler()
        wm = water("E W %d %d" % (k, w), far, t0 - 2.0 + 0.2 * w, scale=0.32, rot=rot, parent=cl)
        move(wm, sec(t0 - 2.0 + 0.2 * w), sec(t0 + 0.3 * w), far, near)
    move(cl, sec(t0 + 2.0), sec(t0 + 4.5), p, p + out)
big("Lbl E Li", "Li⁺", cE + Vector((-1.6, -0.6, 1.7)), 63.0, None, mat=ION_P, size=0.55)
big("Lbl E Cl", "Cl⁻", cE + Vector((0.0, -0.6, 1.7)), 63.3, None, mat=ION_N, size=0.55)
big("Lbl E H", "hydrated", cE + Vector((5.2, -0.6, 0.2)), 72.0, None, mat=M["cyan"], size=0.5)

# ---- C2. the solute matters: the book's example, salt and sugar in water ----
for k, (nm, n_dis, n_stay, m) in enumerate((("salt", 10, 0, MOL["white"]), ("sugar", 5, 5, SOLU))):
    c = SF + Vector((-3.2 + 6.4 * k, 0, -2.2))
    beaker("F %d" % k, c, 1.8, 3.0, 2.3, 34.3 + 0.3 * k)
    lo, hi = inside(c, 1.8, 2.3)
    gas("F Solv %d" % k, 14, lo, hi, 34.0, 46.0, speed=0.8, r=0.11, mat=SOLV, seed=81 + k, f_in=sec(34.6))
    seats = grid_pts(5, 2, 0.3, c + Vector((0, -0.2, 0.17)))
    dissolve("F Sol %d" % k, seats[:n_dis], lo, hi, 36.0, 37.5, 46.0, r=0.14, mat=m, seed=85 + k, f_in=sec(36.0),
             drop=(0, 0, 3.2), t_land=36.9, gap=0.4)
    for j, s_ in enumerate(seats[n_dis:n_dis + n_stay]):
        b = sphere("F Stay %d %d" % (k, j), 0.14, m, s_ + Vector((0, 0, 3.2)), None, 12, 6)
        appear(b, sec(36.0), s=(0.14,) * 3)
        move(b, sec(36.1), sec(36.9), s_ + Vector((0, 0, 3.2)), s_, 'LINEAR')
    big("Lbl F %d" % k, nm, c + Vector((0, -0.6, 3.6)), 34.8 + 0.3 * k, None, mat=(M["white"], M["gold"])[k], size=0.55)

# ---- E3. LiCl in benzene: the crystal just sits there ----
cG = SG + Vector((0, 0, -2.2))
beaker("G", cG, 2.0, 3.2, 2.4, 80.2, liq_mat=BENZ)
lo, hi = inside(cG, 2.0, 2.4)
gas("G Benz", 16, lo, hi, 80.0, 90.0, speed=0.9, r=0.13, mat=BENZ_M, seed=91, f_in=sec(80.5))
for i in range(4):
    for j in range(3):
        li = (i + j) % 2 == 0
        sp = sphere("G Ion %d %d" % (i, j), 0.12 if li else 0.2, ION_P if li else ION_N,
                    cG + Vector(((i - 1.5) * 0.42, -0.3, 0.25 + 0.42 * j)), None, 16, 8)
        appear(sp, sec(81.0 + 0.04 * (i + j)), s=((0.12 if li else 0.2),) * 3)
big("Lbl G", "LiCl stays solid", cG + Vector((0, -0.6, 3.7)), 81.5, None, mat=M["white"], size=0.5)
finish_film()
