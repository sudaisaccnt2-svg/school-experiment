# ---- Film 603: Types of solution, gaseous and liquid solutions (textbook p.156: 6.3 nine types, 6.3.1 gas in gas,  (v4 captions)
# liquid in gas, solid in gas; Fig 6.3 CO₂ in water; 6.3.2 gas in liquid, liquid in liquid, solid in liquid) ----
start_film("603", "603 Gas and Liquid Solutions", 75.5)
END = scene.frame_end
SA, SB, SC = (Vector((40 * k, 0, 0)) for k in range(3))

shot("Cam Nine", 0, 14, SA + Vector((0, 0, -0.9)), dist=17, pitch=0.1)
shot("Cam Gas", 14, 42, SB + Vector((0, 0, -0.9)), dist=17, pitch=0.1)
shot("Cam Liquid", 42, None, SC + Vector((0, 0, -1.1)), dist=17, pitch=0.1)
for name, t in (("Nine types", 0), ("Gaseous solutions", 14), ("Liquid solutions", 42)):
    act(name, sec(t))

say('A1', 'Gas, liquid or solid', 0.1, 7)
say('A2', '3 × 3 = 9 types', 7, 14)
say('B1', 'Gas in gas: air', 14, 23)
say('B2', 'Liquid in gas: fog', 23, 32)
say('B3', 'Solid in gas: smoke', 32, 42)
say('C1', 'Gas in liquid: fizzy drink', 42, 53)
say('C2', 'Liquid in liquid: alcohol, water', 53, 64)
say('C3', 'Solid in liquid: sea water', 64, 75)

N2 = MOL["air"]
O2 = MOL["red"]


def pairs(key, n, lo, hi, t0, t1, mat, r=0.12, seed=1, f_in=None, speed=2.4):
    """Two-atom molecules (N₂, O₂, CO₂ look) flying in a box: gas() balls with a twin ball attached."""
    out = gas(key, n, lo, hi, t0, t1, speed=speed, r=r, mat=mat, seed=seed, f_in=f_in)
    for k, m in enumerate(out):
        sphere("%s Twin %d" % (key, k), 1.0, mat, (1.5, 0, 0), m, 12, 6)
    return out


# ---- A. three solvents; three kinds of solute go into each ----
SOLID_M = mat_pbr("Solvent Metal", (0.75, 0.6, 0.35), metallic=0.9, roughness=0.3)
for k, (nm, col) in enumerate((("gas", M["cyan"]), ("liquid", M["cyan"]), ("solid", M["gold"]))):
    c = SA + Vector((-4.6 + 4.6 * k, 0, -2.4))
    g = box_edges("A Box %d" % k, (3.2, 1.2, 2.8), c + Vector((0, 0, 1.4)))
    appear(g, sec(0.4 + 0.5 * k), dur=10)
    if k == 1:
        appear(box("A Water", (3.1, 1.1, 2.0), WATER, c + Vector((0, 0, 1.0))), sec(1.0), dur=10)
    if k == 2:
        appear(box("A Metal", (3.1, 1.1, 2.7), mat_emit("Solid Tint", (0.9, 0.7, 0.3), 0.3, alpha=0.25),
                   c + Vector((0, 0, 1.35))), sec(1.4), dur=10)
    big("Lbl A %d" % k, nm, c + Vector((0, -0.6, 3.4)), 0.8 + 0.5 * k, None, mat=col, size=0.55)
    for j, (m, t) in enumerate(((MOL["white"], 7.5), (MOL["purple"], 8.5), (SOLU, 9.5))):
        for i in range(3):
            p = c + Vector((-0.9 + 0.9 * i, -0.3, 0.5 + 0.8 * j))
            s = sphere("A Solute %d %d %d" % (k, j, i), 0.16, m, p, None, 12, 6)
            appear(s, sec(t + 0.1 * i + 0.15 * k), s=(0.16,) * 3)

# ---- B. air, fog, smoke ----
for k, (nm, t0) in enumerate((("air", 14.0), ("fog", 23.0), ("smoke", 32.0))):
    c = SB + Vector((-4.6 + 4.6 * k, 0, -2.4))
    appear(box_edges("B Box %d" % k, (3.6, 1.2, 3.6), c + Vector((0, 0, 1.8))), sec(t0 + 0.2), dur=10)
    lo, hi = c + Vector((-1.8, -0.5, 0)), c + Vector((1.8, 0.5, 3.6))
    pairs("B N2 %d" % k, 9, lo, hi, t0, 80.0, N2, seed=10 + k, f_in=sec(t0 + 0.5))
    pairs("B O2 %d" % k, 3 if k == 0 else 2, lo, hi, t0, 80.0, O2, seed=20 + k, f_in=sec(t0 + 1.5))
    if k == 1:
        for i in range(5):
            drop = gas("B Drop %d" % i, 1, lo, hi, t0, 80.0, speed=0.5, r=0.26, mat=WATER, seed=30 + i,
                       f_in=sec(t0 + 2.5 + 0.3 * i))[0]
            sphere("B Drop Core %d" % i, 0.55, mat_emit("Drop Edge", (0.5, 0.8, 1.0), 1.4), (0, 0, 0), drop, 16, 8)
    if k == 2:
        gas("B Soot", 7, lo, hi, t0, 80.0, speed=0.6, r=0.2, mat=mat_emit("Soot Grey", (0.32, 0.3, 0.28), 0.6),
            seed=40, f_in=sec(t0 + 2.5))
    big("Lbl B %d" % k, nm, c + Vector((0, -0.6, 4.2)), t0 + 0.6, None, mat=(M["cyan"], M["white"], M["dim"])[k],
        size=0.55)

# ---- C. soda, alcohol in water, salt water ----
ALC = mat_emit("Mol Alcohol", (0.85, 0.5, 1.0), 1.4)
for k, (nm, t0) in enumerate((("fizzy drink", 42.0), ("alcohol + water", 53.0), ("sea water", 64.0))):
    c = SC + Vector((-4.6 + 4.6 * k, 0, -2.4))
    beaker("C %d" % k, c, 1.6, 3.2, 2.6, t0 + 0.2)
    lo, hi = inside(c, 1.6, 2.6)
    gas("C Solv %d" % k, 14, lo, hi, t0, 80.0, speed=0.8, r=0.12, mat=SOLV, seed=50 + k, f_in=sec(t0 + 0.5))
    if k == 0:
        pairs("C CO2", 5, lo, hi, t0, 80.0, MOL["white"], r=0.11, seed=55, f_in=sec(t0 + 1.5), speed=0.8)
        for i in range(10):
            x = -1.0 + 0.22 * i
            b = sphere("C Bub %d" % i, 0.1, MOL["white"], c + Vector((x, -0.5, 0.2)), None, 12, 6)
            tb = t0 + 2.0 + 0.8 * i
            hide_until(b, sec(tb))
            move(b, sec(tb), sec(tb + 2.0), c + Vector((x, -0.5, 0.2)), c + Vector((x, -0.5, 2.6)), 'LINEAR')
            hide_from(b, sec(tb + 2.0))
    if k == 1:
        for i in range(8):
            start = c + Vector((-0.4 + 0.1 * i, -0.2, 4.0))
            life("C Alc %d" % i, start, t0 + 1.5, [("to", c + Vector((-0.4 + 0.1 * i, -0.2, 2.4)), t0 + 2.5 + 0.2 * i),
                                                    ("box", lo, hi, 80.0, 0.8)], r=0.14, mat=ALC, seed=60 + i,
                 f_in=sec(t0 + 1.5 + 0.2 * i))
    if k == 2:
        dissolve("C Salt", grid_pts(3, 2, 0.3, c + Vector((0, -0.2, 0.2)), ny=2), lo, hi, t0 + 1.5, t0 + 3.0, 80.0,
                 r=0.14, mat=MOL["white"], seed=70, f_in=sec(t0 + 1.5), drop=(0, 0, 3.4), t_land=t0 + 2.4)
    big("Lbl C %d" % k, nm, c + Vector((0, -0.6, 3.9)), t0 + 0.6, None, mat=(M["white"], ALC, M["cyan"])[k], size=0.5)
finish_film()
