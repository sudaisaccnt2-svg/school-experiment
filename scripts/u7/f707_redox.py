# ---- Film 707: Redox reactions (textbook pp.190-191: Table 7.1 oxidizing / reducing agents; ozone; 7.4 redox =  (v4 captions)
# oxidation and reduction together, CuSO₄ + Zn → ZnSO₄ + Cu, ionic Cu²⁺ + Zn → Zn²⁺ + Cu; half reactions
# 2Na → 2Na⁺ + 2e⁻ and I₂ + 2e⁻ → 2I⁻; Fig 7.2 tests: KI colourless → brown, acidified K₂Cr₂O₇ orange → green) ----
start_film("707", "707 Redox Reactions", 80.5)
END = scene.frame_end
SA, SB, SC, SD, SE = (Vector((40 * k, 0, 0)) for k in range(5))

shot("Cam Oxidizers", 0, 13, SA + Vector((0, 0, -0.8)), dist=13, pitch=0.08)
shot("Cam Reducers", 13, 22, SB + Vector((0, 0, -0.8)), dist=13, pitch=0.08)
shot("Cam Zinc", 22, 40, SC + Vector((0, 0, -0.9)), dist=12, pitch=0.08)
shot("Cam Halves", 40, 62, SD + Vector((0, 0, -0.9)), dist=13, pitch=0.08)
shot("Cam Tests", 62, None, SE + Vector((0, 0, -1.0)), dist=13, pitch=0.1)
for name, t in (("Oxidizing agents", 0), ("Reducing agents", 13), ("Zinc in copper sulphate", 22),
                ("Half reactions", 40), ("Tests", 62)):
    act(name, sec(t))

say('A1', 'Oxidizing agents', 0.1, 8)
say('A2', 'Ozone: very strong', 8, 13)
say('B1', 'Reducing agents', 13, 22)
say('C1', 'Zinc in copper sulphate', 22, 30)
say('C2', 'Zinc gives, copper takes', 30, 40)
say('D1', 'Split into two halves', 40, 46)
say('D2', 'Losing: oxidation half', 46, 54)
say('D3', 'Gaining: reduction half', 54, 62)
say('E1', 'Oxidizer turns KI brown', 62, 70)
say('E2', 'Reducer turns dichromate green', 70, 80)

# ---- A. oxidizers: Cl₂, O₂, Br₂, then O₃ ----
a0 = SA + Vector((0, 0, -0.4))
molb("A Cl", a0, [("Cl", (-3.3, 0, 0.6), None), ("Cl", (-2.3, 0, 0.6), None)], 0.4, 0)
molb("A O", a0, [("O", (-0.4, 0, 0.6), None), ("O", (0.4, 0, 0.6), None)], 1.0, 0, k=1.2)
molb("A Br", a0, [("Br", (2.3, 0, 0.6), None), ("Br", (3.3, 0, 0.6), None)], 1.6, 0)
molb("A O3", a0, [("O", (-0.75, 0, -1.2), None), ("O", (0, 0, -0.8), None), ("O", (0.75, 0, -1.2), None)], 8.3, 0,
     k=1.1)
big("Lbl A", "takers", a0 + Vector((0, -0.6, 2.1)), 2.4, None, mat=M["gold"], size=0.5)

# ---- B. reducers: C, H₂, CO ----
b0 = SB + Vector((0, 0, -0.4))
molb("B C", b0, [("C", (-2.8, 0, 0), None)], 13.3, 0, k=1.3)
molb("B H", b0, [("H", (-0.35, 0, 0), None), ("H", (0.35, 0, 0), None)], 13.8, 0, k=1.5)
molb("B CO", b0, [("C", (2.4, 0, 0), None), ("O", (3.25, 0, 0), None)], 14.3, 0, k=1.1)
big("Lbl B", "givers", b0 + Vector((0, -0.6, 1.5)), 15.2, None, mat=M["cyan"], size=0.5)

# ---- C. a zinc strip in blue CuSO₄: Cu²⁺ ions take electrons and turn to copper ----
c0 = SC + Vector((0, 0, -2.3))
tank("C", c0, 5.0, 3.0, 2.4, 22.3, liq_mat=CU_SOL)
plate("C Zn", c0 + Vector((-1.2, 0, 0.2)), 3.2, ZINC, 22.6, w=0.6)
cu_pos = [c0 + Vector((0.6 + 0.9 * (k % 2), -0.1, 0.7 + 0.8 * k)) for k in range(2)]
for k, p in enumerate(cu_pos):
    ion("C Cu2 %d" % k, CAT, p, 23.5 + 0.3 * k, 37.0, r=0.28)
    cu = sphere("C Cu %d" % k, 0.3, mat_emit("Copper Bead U7", (0.95, 0.42, 0.15), 1.2), p, None, 20, 10)
    appear(cu, sec(37.0), s=(0.3,) * 3)
    move(cu, sec(37.5), sec(39.0), p, c0 + Vector((-0.75, -0.1, 0.9 + 0.65 * k)))
for k in range(4):
    p = cu_pos[k // 2]
    travel("C e %d" % k, c0 + Vector((-0.85, -0.6, 1.2 + 0.3 * k)), p + Vector((0, -0.35, 0.1 * (k % 2))),
           31.0 + 0.8 * k, dur=1.4, r=0.11, mat=E_BLUE, lift=0.5)
big("Lbl C Zn", "Zn → Zn²⁺", c0 + Vector((-1.2, -0.9, 3.7)), 33.0, None, mat=M["cyan"], size=0.42)
big("Lbl C Cu", "Cu²⁺ → Cu", c0 + Vector((1.2, -0.9, 3.7)), 35.0, None, mat=M["gold"], size=0.42)

# ---- D. Na half (left) gives 2 e⁻ into the middle; I₂ half (right) takes them ----
d0 = SD + Vector((0, 0, -0.5))
for k in range(2):
    A("D Na%d" % k, "Na", d0 + Vector((-3.0, 0, 0.7 - 1.4 * k)), 40.3 + 0.2 * k)
ia = [A("D I%d" % k, "I", d0 + Vector((2.6 + 0.95 * k, 0, 0)), 40.8) for k in range(2)]
pool = [d0 + Vector((-0.2 + 0.4 * k, -0.4, 0.0)) for k in range(2)]
for k in range(2):
    e = electron("D e %d" % k, None, d0 + Vector((-2.4, -0.4, 0.7 - 1.4 * k)), 0.13, mat=E_BLUE)
    appear(e, sec(46.5), s=tuple(e.scale))
    move(e, sec(48.0 + 0.5 * k), sec(50.0 + 0.5 * k), d0 + Vector((-2.4, -0.4, 0.7 - 1.4 * k)), pool[k])
    move(e, sec(55.5 + 0.5 * k), sec(57.5 + 0.5 * k), pool[k], d0 + Vector((2.6 + 0.95 * k, -0.75, 0.3)))
    hide_from(e, sec(59.0))
for k in range(2):
    mv(ia[k], 57.0, 58.5, d0 + Vector((2.6 + 0.95 * k, 0, 0)), d0 + Vector((2.3 + 1.6 * k, 0, 0)))
badge("D Bn", "Na⁺  Na⁺", d0 + Vector((-3.0, -0.7, 1.55)), 51.0, size=0.42, mat=M["cyan"])
badge("D Bi", "I⁻   I⁻", d0 + Vector((3.1, -0.7, 1.0)), 59.0, size=0.42)

# ---- E. two flasks change colour ----
e0 = SE + Vector((0, 0, -2.2))
for k, (x, c_a, c_b, t) in enumerate(((-2.2, (0.85, 0.9, 0.95), (0.45, 0.17, 0.02), 66.0),
                                       (2.2, (1.0, 0.5, 0.05), (0.08, 0.8, 0.2), 75.0))):
    cflask("E F%d" % k, e0 + Vector((x, 0, 0)), 62.3 + 1.0 * k, mat_emit("Test A%d U7" % k, c_a, 0.6, alpha=0.4))
    nl = cyl("E New %d" % k, 0.92, 0.56, 0.87, mat_emit("Test B%d U7" % k, c_b, 1.0, alpha=0.85),
             e0 + Vector((x, 0, 0.015)), base=True, segs=40)
    appear(nl, sec(t), dur=20)
    for ob in list(scene.objects):
        if ob.name.endswith("E F%d Liq" % k):
            hide_from(ob, sec(t) + 10)
big("Lbl E 1", "KI: colourless → brown", e0 + Vector((-2.2, -1.2, 3.0)), 66.5, None, mat=M["white"], size=0.4)
big("Lbl E 2", "orange → green", e0 + Vector((2.2, -1.2, 3.0)), 75.5, None, mat=M["white"], size=0.4)
finish_film()
