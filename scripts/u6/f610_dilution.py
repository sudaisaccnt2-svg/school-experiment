# ---- Film 610: Dilution (textbook p.165: Scientific Information M₁V₁ = M₂V₂, Example 6.4 (30 cm³ of 2.5 M → 280 cm³:  (v4 captions)
# 0.267 M), Example 6.5 (85 cm³ of 3.5 M → 0.41 M: V₂ = 725.60 cm³, add 640.60 cm³)) ----
start_film("610", "610 Dilution", 78.5)
END = scene.frame_end
SA, SB, SC = (Vector((40 * k, 0, 0)) for k in range(3))

shot("Cam Idea", 0, 22, SA + Vector((0, 0, -1.0)), dist=15, pitch=0.1)
shot("Cam Ex4", 22, 50, SB + Vector((0, 0, -1.0)), dist=15, pitch=0.1)
shot("Cam Ex5", 50, None, SC + Vector((0, 0, -1.0)), dist=15, pitch=0.1)
for name, t in (("Same moles, more water", 0), ("Example 6.4", 22), ("Example 6.5", 50)):
    act(name, sec(t))

say('A1', 'Add water to stock', 0.1, 8)
say('A2', 'Same particles, more liquid', 8, 15)
say('A3', 'M₁V₁ = M₂V₂', 15, 22)
say('B1', '30 cm³ of 2.5 M → 280', 22, 30)
say('B2', '9 times the volume', 30, 40)
say('B3', '9 times weaker: 0.267 M', 40, 50)
say('C1', '85 cm³ of 3.5 M → 0.41 M', 50, 58)
say('C2', 'Final volume: 725.60 cm³', 58, 67)
say('C3', 'Add 640.60 cm³ water', 67, 78)

DEEP = mat_emit("Stock Deep", (0.1, 0.35, 1.0), 1.4, alpha=0.7)

# ---- A. 6 marbles in a small tank → the same 6 in a big tank ----
cA = SA + Vector((-0.5, 0, -2.2))
small = cA + Vector((-3.8, 0, 0))
big_c = cA + Vector((2.6, 0, 0))
appear(box_edges("A Small", (1.6, 1.2, 2.0), small + Vector((0, 0, 1.0))), sec(0.3), dur=10)
appear(box("A Small Fill", (1.55, 1.15, 1.95), mat_emit("Stock Light A", (0.1, 0.35, 1.0), 0.8, alpha=0.3), small + Vector((0, 0, 1.0))), sec(0.5), dur=10)
gas("A M1", 6, small + Vector((-0.8, -0.4, 0)), small + Vector((0.8, 0.4, 2.0)), 0.0, 22.0, speed=0.8, r=0.2,
    seed=1, mat=SOLU, f_in=sec(1.0))
appear(box_edges("A Big", (4.8, 1.2, 3.0), big_c + Vector((0, 0, 1.5))), sec(8.3), dur=10)
appear(box("A Big Fill", (4.75, 1.15, 2.95), WATER, big_c + Vector((0, 0, 1.5))), sec(8.5), dur=10)
gas("A M2", 6, big_c + Vector((-2.4, -0.4, 0)), big_c + Vector((2.4, 0.4, 3.0)), 8.0, 22.0, speed=0.8, r=0.2,
    seed=2, mat=SOLU, f_in=sec(9.0))
big("Lbl A 1", "6 mol", small + Vector((0, -0.6, 2.7)), 2.0, None, mat=M["gold"], size=0.5)
big("Lbl A 2", "still 6 mol", big_c + Vector((0, -0.6, 3.7)), 10.0, None, mat=M["gold"], size=0.5)
big("Lbl A E", "M₁V₁ = M₂V₂", cA + Vector((-0.6, -0.6, 4.3)), 16.0, None, mat=M["white"], size=0.6)


def cyl_pour(key, c_small, c_big, h_small, h_big_total, h_big_final, r_s, r_b, t0, t_pour, t_add0, t_add1, h_stock_in_big):
    """A small measuring cylinder of stock pours into a big one; water then fills the big one."""
    g1, l1 = cylinder_glass(key + " S", c_small, r_s, h_small + 0.6, h_small, t0, liq_mat=DEEP, ticks=3)
    kf(l1, "scale", sec(t_pour), (1, 1, 1))
    kf(l1, "scale", sec(t_pour + 1.5), (1, 1, 0.001))
    hide_from(l1, sec(t_pour + 1.6), (1, 1, 0.001))
    g2, _ = cylinder_glass(key + " B", c_big, r_b, h_big_total, 0.0, t0 + 0.3, ticks=7)
    st = liquid(key + " Stock", r_b * 0.97, h_stock_in_big, c_big, DEEP)
    hide_until(st, sec(t_pour + 0.3))
    kf(st, "scale", sec(t_pour + 0.3), (1, 1, 0.05))
    kf(st, "scale", sec(t_pour + 1.5), (1, 1, 1))
    wt = liquid(key + " Water", r_b * 0.97, h_big_final, c_big, WATER)
    hide_until(wt, sec(t_add0))
    kf(wt, "scale", sec(t_add0), (1, 1, h_stock_in_big / h_big_final))
    kf(wt, "scale", sec(t_add1), (1, 1, 1))
    hide_from(st, sec(t_add1))
    return g1, g2


# ---- B. Example 6.4 ----
cB = SB + Vector((0, 0, -2.4))
cyl_pour("B", cB + Vector((-3.6, 0, 0)), cB + Vector((1.4, 0, 0)), 0.45, 4.6, 4.2, 0.5, 1.2, 22.2, 26.0, 31.0, 36.0,
         0.45 * (0.5 / 1.2) ** 2)
big("Lbl B 1", "30 cm³ · 2.5 M", cB + Vector((-3.6, -0.6, 1.6)), 23.0, None, mat=M["cyan"], size=0.45)
big("Lbl B 2", "280 cm³", cB + Vector((3.0, -0.6, 4.2)), 36.2, None, mat=M["cyan"], size=0.5, align='LEFT')
big("Lbl B R", "0.267 M", cB + Vector((-3.6, -0.6, 3.6)), 41.0, None, mat=M["white"], size=0.7)

# ---- C. Example 6.5 ----
cC = SC + Vector((0, 0, -2.4))
cyl_pour("C", cC + Vector((-3.6, 0, 0)), cC + Vector((1.4, 0, 0)), 0.9, 4.6, 4.2, 0.5, 1.2, 50.2, 53.0, 68.0, 73.0,
         0.9 * (0.5 / 1.2) ** 2 * 1.0)
big("Lbl C 1", "85 cm³ · 3.5 M", cC + Vector((-3.6, -0.6, 2.1)), 51.0, None, mat=M["cyan"], size=0.45)
big("Lbl C V", "725.60 cm³", cC + Vector((3.0, -0.6, 4.2)), 60.0, None, mat=M["white"], size=0.5, align='LEFT')
big("Lbl C W", "+ 640.60 cm³ water", cC + Vector((3.0, -0.6, 1.4)), 68.5, None, mat=M["cyan"], size=0.5,
    align='LEFT')
mark = pcurve("C Target", [cC + Vector((0.1, -0.05, 4.2)), cC + Vector((2.7, -0.05, 4.2))], M["gold"], 0.03, "Models")
hide_until(mark, sec(60.0))
finish_film()
