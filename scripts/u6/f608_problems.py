# ---- Film 608: Problems involving molarity (textbook p.163: Example 6.2 NaCl, Example 6.3 CH₃OH, Practice 6.1 CaCl₂).  (v4 captions)
# Each one: grams on a balance → ÷ molar mass → moles (a marble) → into the volume (part of a 1 dm³ cube) → M ----
start_film("608", "608 Molarity Problems", 80.5)
END = scene.frame_end
SA, SB, SC = (Vector((40 * k, 0, 0)) for k in range(3))

shot("Cam NaCl", 0, 28, SA + Vector((0, 0, -0.9)), dist=15, pitch=0.1)
shot("Cam Methanol", 28, 56, SB + Vector((0, 0, -0.9)), dist=15, pitch=0.1)
shot("Cam CaCl2", 56, None, SC + Vector((0, 0, -0.9)), dist=15, pitch=0.1)
for name, t in (("Example 6.2", 0), ("Example 6.3", 28), ("Practice 6.1", 56)):
    act(name, sec(t))

say('A1', '5.85 g NaCl in 500 cm³', 0.1, 7)
say('A2', '5.85 ÷ 58.5 = 0.1 mol', 7, 14)
say('A3', '500 cm³ = 0.5 dm³', 14, 20)
say('A4', '0.1 ÷ 0.5 = 0.2 M', 20, 28)
say('B1', '7.50 g CH₃OH in 50.0 cm³', 28, 35)
say('B2', '7.50 ÷ 32.0 = 0.2344 mol', 35, 42)
say('B3', '50.0 cm³ = 0.0500 dm³', 42, 48)
say('B4', '0.2344 ÷ 0.0500 = 4.69 M', 48, 56)
say('C1', '0.750 g CaCl₂ in 11.6 cm³', 56, 64)
say('C2', '0.00676 mol in 0.0116 dm³', 64, 72)
say('C3', '≈ 0.582 M', 72, 80)

CUBE_FILL = mat_emit("Cube Fill U6", (0.15, 0.4, 0.9), 0.4, alpha=0.18)


def problem(key, S, t0, grams, divide, mol, r_mol, vol, frac, res, t_res, t_div, t_mol, t_vol):
    c = S + Vector((0, 0, -2.0))
    scale_bal(key, c + Vector((-4.4, 0, 0)), t0 + 0.2, grams)
    for k in range(6):
        g = sphere("%s Grain %d" % (key, k), 0.13, MOL["white"], c + Vector((-4.4 + (k % 3 - 1) * 0.28, -0.2,
                                                                                 0.72 + 0.26 * (k // 3))), None, 12, 6)
        appear(g, sec(t0 + 0.5 + 0.05 * k), s=(0.13,) * 3)
    big(key + " Div", divide, c + Vector((-2.2, -0.6, 1.6)), t_div, None, mat=M["cyan"], size=0.5)
    m = sphere(key + " Mole", r_mol, SOLU, c + Vector((0, -0.3, 1.2)), None, 24, 12)
    appear(m, sec(t_mol), s=(r_mol,) * 3)
    big(key + " Mol", mol, c + Vector((0, -0.6, 2.3)), t_mol + 0.3, t_res - 1.2, mat=M["gold"], size=0.5)
    w = 2.4
    cube = box_edges(key + " Litre", (w, w, w), c + Vector((3.8, 0, w / 2)), mat=M["dim"])
    appear(cube, sec(t_vol), dur=10)
    h = max(0.06, w * frac)
    fill = box(key + " Fill", (w - 0.05, w - 0.05, h), CUBE_FILL, c + Vector((3.8, 0, h / 2)))
    appear(fill, sec(t_vol + 0.3), dur=10)
    big(key + " Vol", vol, c + Vector((3.8, -0.6, 3.0)), t_vol + 0.4, None, mat=M["cyan"], size=0.5)
    move(m, sec(t_res - 1.2), sec(t_res - 0.2), c + Vector((0, -0.3, 1.2)), c + Vector((3.8, -0.9, max(0.3, h / 2))))
    big(key + " Res", res, c + Vector((0, -0.6, 4.0)), t_res, None, mat=M["white"], size=0.7)


problem("A", SA, 0.0, "5.85 g", "÷ 58.5", "0.1 mol", 0.22, "0.5 dm³", 0.5, "0.2 M", 21.0, 8.0, 10.5, 14.5)
problem("B", SB, 28.0, "7.50 g", "÷ 32.0", "0.2344 mol", 0.28, "0.0500 dm³", 0.05, "4.69 M", 49.0, 35.5, 37.5, 42.5)
problem("C", SC, 56.0, "0.750 g", "÷ 111", "0.00676 mol", 0.1, "0.0116 dm³", 0.0116, "≈ 0.582 M", 73.0, 63.0, 65.0,
        68.0)
finish_film()
