# ---- Film 412: Intermolecular forces (textbook pp.110-113: 4.4, 464 vs 19 kJ/mol, Fig 4.19 dipole-dipole in HCl,  (v4 captions)
# 4.4.2 hydrogen bonding, Fig 4.20 water, Example/Practice 4.4, epoxy and glues) ----
start_film("412", "412 Intermolecular Forces", 80.5)
END = scene.frame_end
SA, SB, SC, SD, SE = (Vector((40 * k, 0, 0)) for k in range(5))

shot("Cam Bars", 0, 14, SA + Vector((0, 0, -0.1)), dist=14)
shot("Cam Dipole", 14, 32, SB + Vector((0, 0, 0.1)), dist=17.5)
shot("Cam Water", 32, 50, SC + Vector((0, 0, -0.1)), dist=20.5)
shot("Cam Which", 50, 70, SD + Vector((0, 0, -0.7)), dist=18)
shot("Cam Glue", 70, None, SE + Vector((0, 0, 0.2)), dist=13)
for name, t in (("Inside vs between", 0), ("Dipole-dipole", 14), ("Hydrogen bonds", 32), ("Which ones?", 50),
                ("Glue", 70)):
    act(name, sec(t))

say('A1', 'Inside water: 464 kJ/mol', 0.1, 7)
say('A2', 'Between molecules: only 19', 7, 14)
say('B1', 'δ+ attracts δ−: dipole-dipole', 14, 23)
say('B2', 'Weak: HCl is a gas', 23, 32)
say('C1', 'H on F, O or N', 32, 40)
say('C2', "Grabs a neighbour's pair: hydrogen bond", 40, 50)
say('D1', 'Who forms hydrogen bonds?', 50, 58)
say('D2', 'HF yes · the others no', 58, 64)
say('D3', 'H₂O, CH₃OH, NH₃: yes', 64, 70)
say('E1', 'Glues stick this way', 70, 80)


def dashes(name, a, b, t0, t1=None, mat=None, n=5, r=0.035):
    """A dotted line from a to b (an intermolecular pull)."""
    a, b = Vector(a), Vector(b)
    d = b - a
    rot = d.to_track_quat('Z', 'Y').to_euler()
    L = d.length / (2 * n - 1)
    for i in range(n):
        c = cyl("%s %d" % (name, i), r, r, L, mat or M["gold"], a + d * ((2 * i + 0.5) / (2 * n - 1)), None, rot, segs=8)
        appear(c, sec(t0) + 2 * i, t1 and sec(t1), dur=6)


# ---- A. 464 vs 19: two bars ----
for k, (val, x, col, t) in enumerate(((464, -2.0, M["red"], 1.0), (19, 2.0, M["cyan"], 7.4))):
    h = max(0.06, 3.2 * val / 464)
    piv = empty("A Bar %d" % k, SA + Vector((x, 0.2, -1.6)))
    box("A Bar %d Box" % k, (1.6, 0.6, h), mat_emit("A Bar %d M" % k, (1.0, 0.4, 0.35) if k == 0 else (0.35, 0.8, 1.0), 1.4),
        (0, 0, h / 2), piv)
    kf(piv, "scale", 0, (1, 1, 0), 'CONSTANT')
    kf(piv, "scale", sec(t), (1, 1, 0.001), 'BEZIER')
    kf(piv, "scale", sec(t + 1.6), (1, 1, 1), 'BEZIER')
    big("Lbl A %d" % k, ("inside: 464", "between: 19")[k], SA + Vector((x, -0.6, -1.4 + h + 0.5)), t + 1.4, None, mat=col,
        size=0.5)

# ---- B. HCl dipoles in a grid, dotted pulls H...Cl ----
HCL = ([("H", (-0.65, 0, 0)), ("Cl", (0.65, 0, 0))], [(0, 1, 1)])
pos = {}
for i in range(3):
    for j in range(3):
        p = SB + Vector(((i - 1) * 2.7, 0, (j - 1) * 1.9 + 0.4))
        bstick("B HCl %d %d" % (i, j), *HCL, p, 14.4 + 0.15 * (i * 3 + j), None, scale=0.9)
        pos[i, j] = p
for i in range(2):
    for j in range(3):
        dashes("B Pull %d %d" % (i, j), pos[i, j] + Vector((1.15, -0.1, 0)), pos[i + 1, j] + Vector((-0.9, -0.1, 0)), 18.0 + 0.3 * j)
big("Lbl B Plus", "δ+", pos[0, 2] + Vector((-0.6, -0.6, 0.75)), 16.6, None, mat=M["red"], size=0.5)
big("Lbl B Minus", "δ−", pos[0, 2] + Vector((0.6, -0.6, 0.85)), 16.9, None, mat=M["cyan"], size=0.5)
big("Lbl B Boil", "−85 °C", SB + Vector((5.4, -0.6, 0.4)), 26.0, None, mat=M["gold"], size=0.55)

# ---- C. water: a middle molecule and four neighbours ----
S = 1.2
OC = SC + Vector((0, 0, 0.8))
bstick("C Mid", *SHAPES["H2O"][:2], OC, 32.4, None, scale=S, lone=SHAPES["H2O"][2])
hx, hz = 0.79 * S, -0.61 * S
for k, sx in enumerate((-1, 1)):
    # below: our H points at a neighbour's O
    hp = OC + Vector((sx * hx, 0, hz))
    u = Vector((sx * 0.79, 0, -0.61)).normalized()
    on = hp + u * 2.0 * S
    bstick("C Low %d" % k, *SHAPES["H2O"][:2], on, 34.0 + 0.4 * k, None, scale=S)
    dashes("C HB Low %d" % k, hp + u * 0.35 * S + Vector((0, -0.1, 0)), on - u * 0.5 * S + Vector((0, -0.1, 0)), 40.6 + 0.4 * k)
    # above: a neighbour's H points at our lone pair
    u = Vector((sx * 0.6, 0, 1)).normalized()
    tip = OC + u * 1.9 * S
    on = tip - Vector((-sx * hx, 0, hz))
    bstick("C High %d" % k, *SHAPES["H2O"][:2], on, 34.8 + 0.4 * k, None, scale=S)
    dashes("C HB High %d" % k, OC + u * 0.85 * S + Vector((0, -0.1, 0)), tip - u * 0.35 * S + Vector((0, -0.1, 0)), 42.0 + 0.4 * k)
big("Lbl C HB", "hydrogen bonds", SC + Vector((5.0, -0.6, 0.3)), 43.0, None, mat=M["gold"], size=0.5)

# ---- D. Example 4.4 + Practice 4.4: two bins ----
BIN_M = mat_pbr("Sort Bin", (0.05, 0.06, 0.09), roughness=0.7)
for nm, x in (("Yes", -3.6), ("No", 3.6)):
    appear(box("D Bin %s" % nm, (6.0, 0.12, 4.2), BIN_M, SD + Vector((x, 0.8, 0.2))), sec(50.4), dur=10)
big("Lbl D Yes", "hydrogen bonds ✓", SD + Vector((-3.6, -0.6, 2.9)), 50.8, None, mat=M["green"], size=0.55)
big("Lbl D No", "no ✗", SD + Vector((3.6, -0.6, 2.9)), 51.0, None, mat=M["red"], size=0.55)
used = {"Yes": 0, "No": 0}
for k, (txt, kind, t) in enumerate((("HF", "Yes", 52.0), ("C₂H₄", "No", 53.4), ("HBr", "No", 54.8), ("NH₄⁺", "No", 56.2),
                                    ("H₂", "No", 57.6), ("H₂O", "Yes", 64.4), ("CH₃OH", "Yes", 65.8), ("NH₃", "Yes", 67.2))):
    n = used[kind]
    used[kind] += 1
    x = (-3.6 if kind == "Yes" else 3.6) + (n % 2 - 0.5) * 2.4
    z = 1.4 - 1.2 * (n // 2)
    top = SD + Vector((0, -1.0, 4.4))
    c = big("Card %d" % k, txt, top, t, None, mat=M["white"], size=0.55)
    move(c, sec(t + 0.4), sec(t + 1.1), top, SD + Vector((x, -1.0, z - 0.2)))

# ---- E. glue: two plates pressed onto a layer of molecules ----
PLATE = mat_pbr("Glue Plate", (0.45, 0.5, 0.58), metallic=0.6, roughness=0.35)
top = box("E Top", (7.0, 1.6, 0.4), PLATE, SE + Vector((0, 0.3, 3.6)))
bot = box("E Bot", (7.0, 1.6, 0.4), PLATE, SE + Vector((0, 0.3, -1.6)))
for o, t in ((top, 70.4), (bot, 70.6)):
    appear(o, sec(t), dur=10)
GLUE = mat_emit("Glue Molecule", (1.0, 0.8, 0.35), 1.2)
for i in range(7):
    s = sphere("E Glue %d" % i, 0.32, GLUE, SE + Vector((-3.0 + i, 0.3, 0.6 + 0.25 * (i % 2))), None, 20, 10)
    appear(s, sec(71.6) + 2 * i, dur=8, s=(0.32,) * 3)
move(top, sec(74.0), sec(76.0), SE + Vector((0, 0.3, 3.6)), SE + Vector((0, 0.3, 1.75)))
move(bot, sec(74.0), sec(76.0), SE + Vector((0, 0.3, -1.6)), SE + Vector((0, 0.3, -0.45)))
for i in range(7):
    x = -3.0 + i
    z = 0.6 + 0.25 * (i % 2)
    dashes("E Up %d" % i, SE + Vector((x, -0.3, z + 0.34)), SE + Vector((x, -0.3, 1.52)), 76.4 + 0.1 * i, n=2, r=0.03)
    dashes("E Dn %d" % i, SE + Vector((x, -0.3, z - 0.34)), SE + Vector((x, -0.3, -0.22)), 76.6 + 0.1 * i, n=2, r=0.03)
finish_film()
