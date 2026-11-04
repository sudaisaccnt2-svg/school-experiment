# ---- Film 607: Molarity (textbook pp.161-162: 6.4.2 molarity, mole = mass ÷ molar mass, Example 6.1,  (v4 captions)
# Scientific Information 1 dm³ = 1 litre = 1000 cm³, 6.4.3 1 M glucose (180 g), 1 M NaOH (40 g), 20 g → 0.5 M,
# 80 g → 2 M) ----
start_film("607", "607 Molarity", 82.5)
END = scene.frame_end
SA, SB, SC, SD, SE = (Vector((40 * k, 0, 0)) for k in range(5))

shot("Cam Litre", 0, 14, SA + Vector((0, 0, -0.9)), dist=13, pitch=0.1)
shot("Cam Units", 14, 26, SB + Vector((0, 0, -0.9)), dist=13, pitch=0.1)
shot("Cam Example", 26, 46, SC + Vector((0, 0, -0.9)), dist=14, pitch=0.1)
shot("Cam NaOH", 46, 72, SD + Vector((0, 0, -1.0)), dist=16, pitch=0.1)
shot("Cam Grams", 72, None, SE + Vector((0, 0, -0.9)), dist=14, pitch=0.1)
for name, t in (("Molarity", 0), ("dm³ and litre", 14), ("Example 6.1", 26), ("NaOH", 46), ("Grams to moles", 72)):
    act(name, sec(t))

say('A1', 'Moles in 1 dm³: molarity', 0.1, 7)
say('A2', '1 mole in 1 dm³ = 1 M', 7, 14)
say('B1', '1 dm³ = 1 litre', 14, 20)
say('B2', '= 1000 cm³', 20, 26)
say('C1', '7.50 mol in 1.50 dm³', 26, 34)
say('C2', '1 dm³ holds 5.0 mol', 34, 40)
say('C3', '7.50 ÷ 1.50 = 5.0 M', 40, 46)
say('D1', '40 g NaOH in 1 dm³: 1 M', 46, 54)
say('D2', '20 g: 0.5 M', 54, 62)
say('D3', '80 g: 2 M', 62, 72)
say('E1', 'Mass ÷ molar mass = moles', 72, 82)

CUBE_FILL = mat_emit("Cube Fill U6", (0.15, 0.4, 0.9), 0.4, alpha=0.18)


def litre(key, c, t0, w=2.6, fill=True):
    """A 1 dm³ cube of solution, base at c (w = side)."""
    g = box_edges(key + " Cube", (w, w, w), c + Vector((0, 0, w / 2)))
    appear(g, sec(t0), dur=10)
    if fill:
        appear(box(key + " Fill", (w - 0.05, w - 0.05, w - 0.05), CUBE_FILL, c + Vector((0, 0, w / 2))), sec(t0 + 0.2),
               dur=10)
    return g


# ---- A. one mole in one litre ----
cA = SA + Vector((0, 0, -1.8))
litre("A", cA, 0.3)
mA = sphere("A Mole", 0.4, SOLU, cA + Vector((0, -0.3, 1.3)), None, 24, 12)
appear(mA, sec(7.4), s=(0.4,) * 3)
big("Lbl A V", "1 dm³", cA + Vector((-2.0, -0.6, 1.3)), 1.0, None, mat=M["cyan"], size=0.55, align='RIGHT')
big("Lbl A M", "1 mol", cA + Vector((2.0, -0.6, 1.3)), 7.8, None, mat=M["gold"], size=0.55, align='LEFT')
big("Lbl A R", "= 1 M", cA + Vector((0, -0.6, 3.3)), 10.0, None, mat=M["white"], size=0.65)

# ---- B. the cube cut into centimetre slices ----
cB = SB + Vector((0, 0, -1.8))
litre("B", cB, 14.2)
w = 2.6
for k in range(1, 10):
    x = -w / 2 + w * k / 10
    for j, (a, b) in enumerate((((x, -w / 2 - 0.01, 0), (x, -w / 2 - 0.01, w)), ((-w / 2, -w / 2 - 0.01, x + w / 2),
                                                                                 (w / 2, -w / 2 - 0.01, x + w / 2)))):
        ln = pcurve("B Grid %d %d" % (k, j), [cB + Vector(a), cB + Vector(b)], M["dim"], 0.008, "Models")
        hide_until(ln, sec(20.0 + 0.08 * k))
big("Lbl B L", "1 dm³ = 1 L", cB + Vector((0, -0.6, 3.3)), 14.8, None, mat=M["cyan"], size=0.55)
big("Lbl B S", "10 cm", cB + Vector((0, -0.6, -0.45)), 16.0, None, mat=M["white"], size=0.42)
big("Lbl B C", "= 1000 cm³", cB + Vector((2.0, -0.6, 1.3)), 20.6, None, mat=M["gold"], size=0.55, align='LEFT')

# ---- C. Example 6.1: 15 half-mole marbles in 1.5 dm³; the 1 dm³ part holds 10 ----
cC = SC + Vector((0, 0, -1.8))
tank = box_edges("C Tank", (3.9, 2.6, 2.6), cC + Vector((0.65, 0, 1.3)))
appear(tank, sec(26.2), dur=10)
appear(box("C Fill", (3.85, 2.55, 2.55), CUBE_FILL, cC + Vector((0.65, 0, 1.3))), sec(26.4), dur=10)
for k in range(15):
    col, row = k % 5 if k < 10 else 5 + (k - 10) % 2, k // 5 if k < 10 else (k - 10) // 2
    x = -1.05 + 0.52 * (k % 5) if k < 10 else 1.65 + 0.52 * ((k - 10) % 2)
    z = 0.5 + 0.6 * ((k // 5) if k < 10 else (k - 10) // 2)
    m = sphere("C Mol %d" % k, 0.2, SOLU, cC + Vector((x, -0.5, z)), None, 16, 8)
    appear(m, sec(28.0 + 0.15 * k), s=(0.2,) * 3)
div = pcurve("C Divide", [cC + Vector((1.3, -1.32, 0)), cC + Vector((1.3, -1.32, 2.6))], M["gold"], 0.03, "Models")
hide_until(div, sec(34.5))
big("Lbl C V", "1.50 dm³", cC + Vector((0.65, -0.6, 3.3)), 26.8, 34.3, mat=M["cyan"], size=0.55)
big("Lbl C 1", "1 dm³: 5.0 mol", cC + Vector((0, -0.6, 3.3)), 35.0, None, mat=M["gold"], size=0.55)
big("Lbl C R", "5.0 M", cC + Vector((-2.4, -0.6, 1.3)), 40.5, None, mat=M["white"], size=0.7, align='RIGHT')

# ---- D. NaOH: 40 g, 20 g, 80 g in 1 dm³ ----
for k, (txt, n, half, res, t0) in enumerate((("40 g", 1, False, "1 M", 46.0), ("20 g", 0, True, "0.5 M", 54.0),
                                             ("80 g", 2, False, "2 M", 62.0))):
    c = SD + Vector((-4.6 + 4.6 * k, 0, -2.0))
    litre("D %d" % k, c, t0 + 0.2, w=2.4)
    for j in range(n):
        m = sphere("D Mol %d %d" % (k, j), 0.36, SOLU, c + Vector((-0.45 + 0.9 * j if n == 2 else 0, -0.3, 1.2)), None,
                   24, 12)
        appear(m, sec(t0 + 1.5 + 0.3 * j), s=(0.36,) * 3)
    if half:
        m = sphere("D Half %d" % k, 0.36 * 0.5 ** (1 / 3), SOLU, c + Vector((0, -0.3, 1.2)), None, 24, 12)
        appear(m, sec(t0 + 1.5), s=(0.36 * 0.5 ** (1 / 3),) * 3)
    big("Lbl D %d" % k, txt, c + Vector((0, -0.6, 3.0)), t0 + 0.6, None, mat=M["gold"], size=0.55)
    big("Lbl D R %d" % k, res, c + Vector((0, -0.6, -0.5)), t0 + 3.0, None, mat=M["white"], size=0.55)

# ---- E. 40 g on a balance → 1 mole marble ----
cE = SE + Vector((0, 0, -2.2))
scale_bal("E", cE + Vector((-2.4, 0, 0)), 72.2, "40 g")
pile = [cE + Vector((-2.4 + (k % 3 - 1) * 0.25, -0.2, 0.7 + 0.25 * (k // 3))) for k in range(9)]
for k, p in enumerate(pile):
    s = sphere("E Grain %d" % k, 0.12, MOL["white"], p, None, 12, 6)
    appear(s, sec(72.6 + 0.05 * k), s=(0.12,) * 3)
    move(s, sec(76.0), sec(77.2), p, cE + Vector((2.4, -0.2, 1.4)))
    hide_from(s, sec(77.3), (0.12,) * 3)
mE = sphere("E Mole", 0.45, SOLU, cE + Vector((2.4, -0.2, 1.4)), None, 24, 12)
appear(mE, sec(77.2), s=(0.45,) * 3)
big("Lbl E G", "grams", cE + Vector((-2.4, -0.6, 2.4)), 73.0, None, mat=M["white"], size=0.5)
big("Lbl E M", "moles", cE + Vector((2.4, -0.6, 2.4)), 77.4, None, mat=M["gold"], size=0.5)
big("Lbl E D", "÷ 40", cE + Vector((0, -0.6, 1.4)), 75.5, None, mat=M["cyan"], size=0.6)
finish_film()
