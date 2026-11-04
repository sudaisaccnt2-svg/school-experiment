# ---- Film 511: Crystalline and amorphous solids (textbook pp.143-144: 5.5 types of solids, 5.5.1 amorphous Fig 5.15,  (v4 captions)
# 5.5.2 crystalline Fig 5.16 NaCl, Activity 5.4, STS salt curing) ----
import random as _r
start_film("511", "511 Crystalline and Amorphous", 78.5)
END = scene.frame_end
SA, SB, SC, SD = (Vector((40 * k, 0, 0)) for k in range(4))

shot("Cam Amorphous", 0, 20, SA + Vector((0.6, 0, -0.8)), dist=13.5, pitch=0.1)
shot("Cam Crystal", 20, 40, SB + Vector((0, 0, -0.4)), dist=12, pitch=0.15)
shot("Cam Sort", 40, 64, SC + Vector((0, 0, -0.2)), dist=17)
shot("Cam Salt", 64, None, SD + Vector((0, 0, -0.6)), dist=12.5, pitch=0.1)
for name, t in (("Amorphous", 0), ("Crystalline", 20), ("Activity 5.4", 40), ("Salt curing", 64)):
    act(name, sec(t))

say('A1', 'Amorphous: jumbled particles', 0.1, 7)
say('A2', 'Glass, wax, plastic, rubber', 7, 13)
say('A3', 'They soften slowly', 13, 20)
say('B1', 'Crystalline: a regular pattern', 20, 28)
say('B2', 'Flat faces, fixed angles', 28, 34)
say('B3', 'One sharp melting point', 34, 40)
say('C1', 'Crystalline or amorphous?', 40, 52)
say('C2', 'Salt crystalline · glass amorphous', 52, 64)
say('D1', 'Salt pulls water out', 64, 71)
say('D2', 'No water: no bacteria', 71, 78)

# ---- A. a jumbled block that softens slowly as it is heated ----
cA = SA + Vector((0, 0, -1.4))
blk = empty("A Block", cA)
rnd = _r.Random(3)
pts = []
while len(pts) < 34:
    p = Vector((rnd.uniform(-1.6, 1.6), rnd.uniform(-0.4, 0.4), rnd.uniform(0.2, 2.4)))
    if all((p - q).length > 0.36 for q in pts):
        pts.append(p)
GLASSP = mat_emit("Mol Glass", (0.55, 0.85, 0.95), 1.3)
ps = shake("A P", pts, 0.0, 20.0, r=0.17, mat=GLASSP, parent=blk, seed=4,
           amp_f=lambda t: 0.03 if t < 13 else 0.03 + 0.012 * (t - 13))
for k, o in enumerate(ps):
    appear(o, sec(0.3) + k, s=(0.17,) * 3)
kf(blk, "scale", sec(14.0), (1, 1, 1))
kf(blk, "scale", sec(20.0), (1.25, 1, 0.7))
appear(box("A Plate", (4.4, 1.4, 0.12), DARK, cA + Vector((0, 0, -0.06))), sec(0.2), dur=10)
flame("A Flame", cA + Vector((0, 0, -0.9)), 13.4, None, s=0.7)
col = thermo("A Thermo", cA + Vector((2.9, -0.2, 0)), h=3.2)
appear(col.parent, sec(0.4), dur=10)
level(col, 0, 0.2)
level(col, 13.4, 0.2)
level(col, 20, 0.75, 'LINEAR')
big("Lbl A", "no pattern", cA + Vector((0, -0.6, 3.2)), 2.0, 13.0, mat=M["cyan"], size=0.5)
big("Lbl A2", "softens slowly", cA + Vector((0, -0.6, 3.2)), 15.0, None, mat=M["gold"], size=0.5)

# ---- B. Fig 5.16: the NaCl lattice turns ----
NA = mat_emit("Ion Na", (0.6, 0.35, 1.0), 1.6)
CL = mat_emit("Ion Cl", (0.3, 1.0, 0.45), 1.3)
lat = empty("B Lattice", SB + Vector((0, 0, 0.0)))
G3 = 1.0
k = 0
for i in range(3):
    for j in range(3):
        for kz in range(3):
            p = Vector(((i - 1) * G3, (j - 1) * G3, (kz - 1) * G3))
            na = (i + j + kz) % 2 == 0
            s_ = sphere("B Ion %d" % k, 0.2 if na else 0.3, NA if na else CL, p, lat, 20, 10)
            appear(s_, sec(20.3) + 2 * k, s=((0.2 if na else 0.3),) * 3)
            k += 1
LL = mat_emit("Lattice Line", (0.7, 0.75, 0.85), 1.0)
for a in range(3):
    for u in range(3):
        for v in range(3):
            p0, p1 = [0, 0, 0], [0, 0, 0]
            p0[a], p1[a] = -G3, G3
            o = [b for b in range(3) if b != a]
            p0[o[0]] = p1[o[0]] = (u - 1) * G3
            p0[o[1]] = p1[o[1]] = (v - 1) * G3
            ln = pcurve("B Line %d %d %d" % (a, u, v), [p0, p1], LL, 0.018, "Models", parent=lat)
            hide_until(ln, sec(22.0))
lat.rotation_euler = (math.radians(15), 0, math.radians(25))
kf(lat, "rotation_euler", sec(20.0), (math.radians(15), 0, math.radians(25)), 'LINEAR')
kf(lat, "rotation_euler", sec(40.0), (math.radians(15), 0, math.radians(25 + 300)), 'LINEAR')
big("Lbl B Na", "Na⁺", SB + Vector((-2.6, -0.6, 1.4)), 23.0, None, mat=NA, size=0.55)
big("Lbl B Cl", "Cl⁻", SB + Vector((2.6, -0.6, 1.4)), 23.5, None, mat=CL, size=0.55)

# ---- C. Activity 5.4: ten solids into two bins ----
BIN_M = mat_pbr("Sort Bin", (0.05, 0.06, 0.09), roughness=0.7)
BX = {"crystalline": -3.8, "amorphous": 3.8}
for k, (nm, col_) in enumerate((("crystalline", NA), ("amorphous", GLASSP))):
    appear(box("C Bin %s" % nm, (6.4, 0.12, 5.0), BIN_M, SC + Vector((BX[nm], 0.8, 0.15))), sec(40.3 + 0.2 * k), dur=10)
    big("Lbl C %s" % nm, nm, SC + Vector((BX[nm], -0.6, 3.0)), 40.6 + 0.2 * k, None, mat=col_, size=0.6)
items = (("table salt", "crystalline"), ("glass", "amorphous"), ("baking soda", "crystalline"), ("candle wax", "amorphous"),
         ("lead pencil", "crystalline"), ("plastic", "amorphous"), ("marbles", "amorphous"), ("eraser", "amorphous"),
         ("rubber", "amorphous"), ("charcoal", "amorphous"))
used = {kk: 0 for kk in BX}
for k, (txt, kind) in enumerate(items):
    t = 42.0 + 2.0 * k
    n = used[kind]
    used[kind] += 1
    x = BX[kind] + (-1.5 if n % 2 == 0 else 1.5) if kind == "amorphous" else BX[kind]
    z = 1.9 - 0.85 * (n // 2 if kind == "amorphous" else n)
    top = SC + Vector((0, -1.0, 4.0))
    c = big("Card %d" % k, txt, top, t, None, mat=M["white"], size=0.48)
    move(c, sec(t + 0.4), sec(t + 1.2), top, SC + Vector((x, -1.0, z)))

# ---- D. salt curing: salt crystals on a piece of meat; water molecules leave ----
cD = SD + Vector((0, 0, -1.6))
MEAT = mat_pbr("Meat", (0.55, 0.12, 0.1), roughness=0.6)
appear(box("D Meat", (5.0, 1.6, 1.4), MEAT, cD + Vector((0, 0, 0.7))), sec(64.2), dur=10)
SALT = mat_emit("Salt Crystal", (0.95, 0.97, 1.0), 1.4)
rr = _r.Random(7)
for k in range(16):
    p = cD + Vector((rr.uniform(-2.3, 2.3), rr.uniform(-0.6, 0.2), 1.5))
    b = box("D Salt %d" % k, (0.22, 0.22, 0.22), SALT, p)
    b.rotation_euler = (0, 0, rr.uniform(0, 1.5))
    hide_until(b, sec(65.0 + 0.12 * k))
for k in range(18):
    a = cD + Vector((rr.uniform(-2.2, 2.2), -0.85, rr.uniform(0.2, 1.2)))
    w = sphere("D Water %d" % k, 0.12, MOL["air"], a, None, 12, 6)
    t0 = 66.5 + 0.5 * k
    hide_until(w, sec(t0))
    move(w, sec(t0), sec(t0 + 2.5), a, a + Vector((rr.uniform(-0.8, 0.8), -0.4, 2.4)), 'LINEAR')
    hide_from(w, sec(t0 + 2.5))
big("Lbl D S", "salt", cD + Vector((-3.4, -0.6, 1.6)), 65.5, None, size=0.5, align='RIGHT')
big("Lbl D W", "water leaves", cD + Vector((3.0, -0.6, 3.4)), 67.5, None, mat=M["cyan"], size=0.5)
finish_film()
