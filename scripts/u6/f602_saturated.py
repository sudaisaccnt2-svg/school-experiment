# ---- Film 602: Saturated, unsaturated and supersaturated solutions (textbook pp.154-155: 6.2 (i) saturated,  (v4 captions)
# (ii) unsaturated, (iii) supersaturated, the crystal test, Fig 6.2) ----
import random as _r
start_film("602", "602 Saturated Solutions", 77.5)
END = scene.frame_end
SA, SB, SC, SD = (Vector((40 * k, 0, 0)) for k in range(4))

shot("Cam Sugar", 0, 24, SA + Vector((0, 0, -1.2)), dist=13.5, pitch=0.1)
shot("Cam Unsat", 24, 36, SB + Vector((0, 0, -1.2)), dist=13.5, pitch=0.1)
shot("Cam Super", 36, 52, SC + Vector((0, 0, -1.2)), dist=13.5, pitch=0.1)
shot("Cam Test", 52, None, SD + Vector((0, 0, -1.1)), dist=16, pitch=0.1)
for name, t in (("Saturated", 0), ("Unsaturated", 24), ("Supersaturated", 36), ("Crystal test", 52)):
    act(name, sec(t))

say('A1', 'A little sugar dissolves', 0.1, 6)
say('A2', 'Some more still dissolves', 6, 13)
say('A3', 'Now some stays on the bottom', 13, 19)
say('A4', 'No more fits: saturated', 19, 24)
say('B1', 'Room for more: unsaturated', 24, 30)
say('B2', 'More dissolves', 30, 36)
say('C1', 'Heat: the rest dissolves', 36, 44)
say('C2', 'Too much held: supersaturated', 44, 52)
say('D1', 'Drop in one crystal', 52, 58)
say('D2', 'Dissolves: unsaturated · stays: saturated', 58, 68)
say('D3', 'It grows: supersaturated', 68, 77)


def batch(key, c, lo, hi, n, t_drop, t1, seed, stay=False, gap=0.3):
    """A spoonful (n gold particles) falls in; it dissolves, or (stay) lies on the bottom."""
    seats = [c + Vector(((k % 3 - 1) * 0.3 + (0.3 if k >= 3 else 0), -0.2, 0.17 + 0.3 * (k // 3))) for k in range(n)]
    if stay:
        out = []
        for k, s in enumerate(seats):
            m = sphere("%s %d" % (key, k), 0.15, SOLU, s + Vector((0, 0, 3.4)), None, 12, 6)
            appear(m, sec(t_drop), s=(0.15,) * 3)
            move(m, sec(t_drop + 0.1), sec(t_drop + 1.0), s + Vector((0, 0, 3.4)), s, 'LINEAR')
            out.append(m)
        return out
    return dissolve(key, seats, lo, hi, t_drop, t_drop + 1.2, t1, r=0.15, speed=0.8, seed=seed, f_in=sec(t_drop),
                    drop=(0, 0, 3.4), t_land=t_drop + 0.9, gap=gap)


# ---- A. spoon after spoon until some stays ----
cA = SA + Vector((0, 0, -2.2))
beaker("A", cA, 1.8, 3.2, 2.4, 0.2)
lo, hi = inside(cA, 1.8, 2.4)
gas("A Solv", 22, lo, hi, 0.0, 24.0, speed=0.8, r=0.12, mat=SOLV, seed=1, f_in=sec(0.5))
for k, t in enumerate((2.0, 6.5, 10.0)):
    batch("A Sugar %d" % k, cA, lo, hi, 5, t, 24.0, seed=10 + k)
batch("A Stay", cA, lo, hi, 6, 14.5, 24.0, seed=19, stay=True)
big("Lbl A D", "dissolves", cA + Vector((0, -0.6, 3.9)), 2.6, 13.8, mat=M["gold"], size=0.5)
big("Lbl A S", "stays on the bottom", cA + Vector((2.4, -0.6, 0.4)), 16.0, None, mat=M["gold"], size=0.45,
    align='LEFT')
big("Lbl A Sat", "saturated", cA + Vector((0, -0.6, 3.9)), 19.5, None, mat=M["white"], size=0.6)

# ---- B. unsaturated: a few particles, then a spoonful still dissolves ----
cB = SB + Vector((0, 0, -2.2))
beaker("B", cB, 1.8, 3.2, 2.4, 24.2)
lo, hi = inside(cB, 1.8, 2.4)
gas("B Solv", 22, lo, hi, 24.0, 36.0, speed=0.8, r=0.12, mat=SOLV, seed=21, f_in=sec(24.5))
gas("B Few", 4, lo, hi, 24.0, 36.0, speed=0.8, r=0.15, mat=SOLU, seed=22, f_in=sec(24.8))
batch("B Sugar", cB, lo, hi, 5, 30.5, 36.0, seed=23)
big("Lbl B", "room for more", cB + Vector((0, -0.6, 3.9)), 26.0, None, mat=M["cyan"], size=0.55)

# ---- C. heat the saturated solution: the bottom pile dissolves ----
cC = SC + Vector((0, 0, -2.2))
beaker("C", cC, 1.8, 3.2, 2.4, 36.2)
lo, hi = inside(cC, 1.8, 2.4)
gas("C Solv", 22, lo, hi, 36.0, 52.0, speed=lambda t: 0.8 if t < 38 else 1.5, r=0.12, mat=SOLV, seed=31,
    f_in=sec(36.5))
gas("C Sol", 15, lo, hi, 36.0, 52.0, speed=lambda t: 0.8 if t < 38 else 1.5, r=0.15, mat=SOLU, seed=32,
    f_in=sec(36.6))
pile = [cC + Vector(((k % 3 - 1) * 0.3 + (0.15 if k >= 3 else 0), -0.2, 0.17 + 0.3 * (k // 3))) for k in range(6)]
dissolve("C Pile", pile, lo, hi, 36.0, 40.0, 52.0, r=0.15, speed=1.4, seed=33, f_in=sec(36.7), gap=0.6)
flame("C Flame", cC + Vector((0, 0, -0.95)), 38.0, 48.0, s=0.8)
big("Lbl C H", "hot: more dissolves", cC + Vector((0, -0.6, 3.9)), 39.0, 44.0, mat=M["red"], size=0.5)
big("Lbl C S", "supersaturated", cC + Vector((0, -0.6, 3.9)), 44.5, None, mat=M["white"], size=0.6)

# ---- D. Fig 6.2: one crystal in each ----
CRY = mat_emit("Crystal Bright", (1.0, 0.9, 0.55), 4.0)
for k, (n_sol, kind, txt) in enumerate(((5, "dis", "dissolves"), (14, "stay", "stays"), (20, "grow", "grows"))):
    c = SD + Vector((-4.6 + 4.6 * k, 0, -2.2))
    beaker("D %d" % k, c, 1.4, 2.8, 2.1, 52.2 + 0.3 * k)
    lo, hi = inside(c, 1.4, 2.1)
    gas("D Solv %d" % k, 12, lo, hi, 52.0, 82.0, speed=0.8, r=0.11, mat=SOLV, seed=40 + k, f_in=sec(52.6 + 0.3 * k))
    gas("D Sol %d" % k, n_sol, lo, hi, 52.0, 82.0, speed=0.8, r=0.13, mat=SOLU, seed=50 + k, f_in=sec(52.8 + 0.3 * k))
    td = 56.0 + 4.0 * k
    seats = grid_pts(2, 2, 0.27, c + Vector((0, -0.2, 0.15)))
    if kind == "dis":
        dissolve("D Cr %d" % k, seats, lo, hi, td, td + 1.4, 82.0, r=0.15, mat=CRY, seed=60 + k, f_in=sec(td), drop=(0, 0, 3.0),
                 t_land=td + 0.9, gap=0.5)
    else:
        for j, s in enumerate(seats):
            m = sphere("D Cr %d %d" % (k, j), 0.15, CRY, s + Vector((0, 0, 3.0)), None, 12, 6)
            appear(m, sec(td), s=(0.15,) * 3)
            move(m, sec(td + 0.1), sec(td + 0.9), s + Vector((0, 0, 3.0)), s, 'LINEAR')
        if kind == "grow":
            rnd = _r.Random(7)
            extra = [c + Vector((x * 0.27, -0.2, 0.15 + z * 0.27)) for x, z in
                     ((-1.5, -0.5), (1.5, -0.5), (-1.5, 0.5), (1.5, 0.5), (-0.5, 1.5), (0.5, 1.5), (-1.5, 1.5),
                      (1.5, 1.5))]
            for j, s in enumerate(extra):
                tk = 69.0 + 0.8 * j
                start = Vector([lo[i] + 0.2 + rnd.random() * (hi[i] - lo[i] - 0.4) for i in range(3)])
                life("D Grow %d" % j, start, 52.0, [("box", lo, hi, tk - 0.7, 0.8), ("to", s, tk)], r=0.13, mat=SOLU,
                     seed=70 + j, f_in=sec(52.8 + 0.6))
    big("Lbl D %d" % k, txt, c + Vector((0, -0.6, 3.5)), td + 2.5 if k < 2 else 69.5, None,
        mat=(M["cyan"], M["white"], M["gold"])[k], size=0.5)
finish_film()
