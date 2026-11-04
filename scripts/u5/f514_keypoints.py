# ---- Film 514: Key points (textbook pp.148-149): one short station per bullet, each with its picture (v4) ----
import random as _r
D = 5.0
KP = [
    ("Three states", "Matter exists as solid, liquid and gas"),
    ("Gas: most energy", "The gas state has the highest energy"),
    ("Diffusion", "Gases mix by themselves: crowded → less crowded"),
    ("Effusion", "Escape one by one through a hole of molecular size"),
    ("Pressure", "Force of the gas on each unit of area: P = F / A"),
    ("Compressibility", "Change in volume per unit change in pressure"),
    ("Density", "Mass per unit volume"),
    ("Boyle's law", "More pressure → less volume (temperature constant)"),
    ("Charles's law", "Volume grows with absolute temperature (pressure constant)"),
    ("Absolute temperature", "The Kelvin scale: K = °C + 273"),
    ("Evaporation", "A liquid turns into vapour by itself"),
    ("Vapour pressure", "Pressure of the vapour when leaving = returning"),
    ("Boiling point", "Vapour pressure = outside pressure"),
    ("Freezing point", "Liquid and solid in equilibrium"),
    ("Melting point", "The solid starts melting; solid and liquid in equilibrium"),
    ("Amorphous solid", "No ordered arrangement of particles"),
    ("Crystalline solid", "Particles in a regular 3D pattern"),
    ("Allotropy", "One element in more than one form"),
    ("Transition temperature", "Where one allotrope changes into another"),
]
n = len(KP)
start_film("514", "514 Key Points", D * n + 0.5)
END = scene.frame_end
ST = [Vector((40 * k, 0, 0)) for k in range(n)]
SHORT = ['Solid, liquid and gas', 'Gas has the most energy', 'Diffusion: gases mix themselves', 'Effusion: out one by one', 'Pressure: P = F / A', 'Squeeze: volume changes', 'Density: mass per volume', 'Boyle: more pressure, less volume', 'Charles: hotter, bigger volume', 'K = °C + 273', 'Evaporation: liquid to vapour', 'Vapour pressure: leaving = returning', 'Boils: vapour = outside pressure', 'Freezing: liquid and solid together', 'Melting: solid and liquid together', 'Amorphous: no order', 'Crystalline: a regular pattern', 'Allotropy: one element, many forms', 'Allotropes swap at transition temperature']
for k, (h, b) in enumerate(KP):
    t0 = D * k
    zc = -1.0 if k in (5, 7, 8, 9, 11, 12, 13, 14) else -0.8
    shot("Cam KP %d" % k, t0, t0 + D, ST[k] + Vector((0, 0, zc)), dist=15, pitch=0.08)
    act(h, sec(t0))
    say("K%d" % k, SHORT[k], t0 + 0.1, t0 + D)          # v4: one short line per key point


def tk(k, dt=0.3):
    return D * k + dt


def span(k):
    return tk(k, 0.0), D * (k + 1) + 0.2


def boxgas(name, c, size, nmol, k, speed=2.4, mat=None, r=0.14, liq=None, hits=None):
    c = Vector(c)
    appear(box_edges(name + " Box", size, c), sec(tk(k)), dur=8)
    lo, hi = c - Vector(size) / 2, c + Vector(size) / 2
    if liq:
        hi = Vector((hi[0], hi[1], lo[2] + liq))
    a, b = span(k)
    return gas(name, nmol, lo, hi, a, b, speed=speed, r=r, mat=mat, seed=len(name) + k, f_in=sec(tk(k, 0.4)), hits=hits)


def solid_block(name, c, k, nx=5, nz=4, gap=0.42, r=0.16, amp=0.03):
    a, b = span(k)
    ms = shake(name, grid_pts(nx, nz, gap, c), a, b, amp=amp, r=r, seed=k)
    for i, m in enumerate(ms):
        appear(m, sec(tk(k, 0.3)) + i // 2, s=(r,) * 3)
    return ms


# 1 three states
c0 = ST[0]
solid_block("K0 S", c0 + Vector((-4.0, 0, -0.4)), 0)
boxgas("K0 L", c0 + Vector((0, 0, -0.4)), (2.6, 1.0, 2.4), 18, 0, speed=0.8, liq=1.1)
boxgas("K0 G", c0 + Vector((4.0, 0, -0.4)), (2.6, 1.0, 2.4), 6, 0)
for j, (x, nm) in enumerate(((-4.0, "solid"), (0.0, "liquid"), (4.0, "gas"))):
    big("Lbl K0 %d" % j, nm, c0 + Vector((x, -0.6, 1.6)), tk(0, 0.6 + 0.3 * j), D, mat=M["cyan"], size=0.5)
# 2 gas: fast molecules
boxgas("K1", ST[1] + Vector((0, 0, -0.4)), (5.0, 1.4, 3.4), 14, 1, speed=5.0)
big("Lbl K1", "fastest", ST[1] + Vector((0, -0.6, 1.9)), tk(1, 1.0), D * 2, mat=M["gold"], size=0.55)
# 3 diffusion
c2 = ST[2] + Vector((0, 0, -0.4))
appear(box_edges("K2 Box", (6.0, 1.4, 3.2), c2), sec(tk(2)), dur=8)
a, b = span(2)
gas("K2 Air", 14, c2 - Vector((3, 0.7, 1.6)), c2 + Vector((3, 0.7, 1.6)), a, b, speed=2.4, r=0.13, seed=21, f_in=sec(tk(2, 0.4)))
gp = zpath([(a, 0.0), (a + 1.0, 0.0), (b - 0.5, 1.0)])
gas("K2 P", 10, c2 - Vector((3, 0.7, 1.6)), lambda t: c2 + Vector((-2.0 + 5.0 * gp(t), 0.7, 1.6)), a, b, speed=2.4, r=0.13,
    mat=MOL["gold"], seed=22, f_in=sec(tk(2, 0.4)))
# 4 effusion
c3 = ST[3] + Vector((0, 0, -0.4))
appear(box_edges("K3 Box", (6.0, 1.4, 3.0), c3), sec(tk(3)), dur=8)
WALL = mat_emit("Wall Glow", (0.55, 0.75, 1.0), 1.5, alpha=0.5)
appear(box("K3 W Lo", (0.1, 1.4, 1.3), WALL, c3 + Vector((0, 0, -0.85))), sec(tk(3)), dur=8)
appear(box("K3 W Hi", (0.1, 1.4, 1.3), WALL, c3 + Vector((0, 0, 0.85))), sec(tk(3)), dur=8)
a, b = span(3)
lo1, hi1 = c3 + Vector((-3, -0.7, -1.5)), c3 + Vector((-0.05, 0.7, 1.5))
lo2, hi2 = c3 + Vector((0.05, -0.7, -1.5)), c3 + Vector((3, 0.7, 1.5))
gas("K3 G", 12, lo1, hi1, a, b, speed=2.4, r=0.13, seed=31, f_in=sec(tk(3, 0.4)))
for j in range(3):
    escape("K3 E %d" % j, lo1, hi1, c3, lo2, hi2, a, tk(3, 1.5 + 1.1 * j), b, seed=33 + j, f_in=sec(tk(3, 0.4)))
# 5 pressure: hits flash on the right wall
hits = []
boxgas("K4", ST[4] + Vector((0, 0, -0.4)), (5.0, 1.4, 3.4), 14, 4, speed=3.2, hits=hits)
hit_flashes("K4 Hit", hits, 0, 1, ST[4][0] + 2.5, tk(4, 0.5), D * 5, limit=30)
# 6 compressibility: piston pushes down
c5 = ST[5] + Vector((0, 0, -2.2))
cg, pis = piston_cyl("K5 Cyl", 1.4, 3.8, c5)
appear(cg, sec(tk(5)), dur=8)
K5 = [(0, 3.0), (tk(5, 1.5), 3.0), (tk(5, 3.5), 1.3)]
key_piston(pis, K5)
pz5 = zpath(K5)
a, b = span(5)
gas("K5 G", 12, c5 + Vector((-1.0, -0.5, 0)), lambda t: c5 + Vector((1.0, 0.5, pz5(t) - 0.1)), a, b, speed=2.4, r=0.13, seed=51,
    f_in=sec(tk(5, 0.4)))
# 7 density: same box, gas vs solid
boxgas("K6 G", ST[6] + Vector((-2.6, 0, -0.4)), (3.0, 1.2, 3.0), 4, 6)
appear(box_edges("K6 S Box", (3.0, 1.2, 3.0), ST[6] + Vector((2.6, 0, -0.4))), sec(tk(6)), dur=8)
solid_block("K6 S", ST[6] + Vector((2.6, 0, -0.4)), 6, nx=6, nz=6, gap=0.44)
big("Lbl K6", "m ÷ V", ST[6] + Vector((0, -0.6, 1.8)), tk(6, 1.2), D * 7, mat=M["gold"], size=0.55)
# 8 Boyle: push → small volume, dial up
c7 = ST[7] + Vector((-0.8, 0, -2.2))
cg, pis, nd = rig("K7", c7, 1.3, 3.8, tk(7))
K7 = [(0, 3.0), (tk(7, 1.2), 3.0), (tk(7, 3.2), 1.5)]
key_piston(pis, K7)
needle_keys(nd, [(0, 0.25), (tk(7, 1.2), 0.25), (tk(7, 3.2), 0.5)])
pz7 = zpath(K7)
a, b = span(7)
gas("K7 G", 12, c7 + Vector((-0.9, -0.5, 0)), lambda t: c7 + Vector((0.9, 0.5, pz7(t) - 0.1)), a, b, speed=2.4, r=0.13, seed=71,
    f_in=sec(tk(7, 0.4)))
# 9 Charles: heat → piston rises
c8 = ST[8] + Vector((-0.8, 0, -1.6))
cg, pis, nd = rig("K8", c8, 1.3, 3.4, tk(8))
K8 = [(0, 1.6), (tk(8, 1.2), 1.6), (tk(8, 3.4), 2.8)]
key_piston(pis, K8)
needle_to(nd, 0, 0.35)
flame("K8 Flame", c8 + Vector((0, 0, -0.75)), tk(8, 0.8), D * 9 + 0.2, s=0.7)
pz8 = zpath(K8)
a, b = span(8)
gas("K8 G", 12, c8 + Vector((-0.9, -0.5, 0)), lambda t: c8 + Vector((0.9, 0.5, pz8(t) - 0.1)), a, b,
    speed=lambda t: 1.6 if t < tk(8, 1.2) else 3.4, r=0.13, seed=81, f_in=sec(tk(8, 0.4)))
# 10 Kelvin thermometer
col = thermo("K9 T", ST[9] + Vector((0, -0.1, -2.3)), h=4.0)
appear(col.parent, sec(tk(9)), dur=8)
level(col, tk(9, 0.3), 0.1)
level(col, tk(9, 2.0), 0.74)
big("Lbl K9", "0 °C = 273 K", ST[9] + Vector((0.6, -0.6, 0.5)), tk(9, 2.0), D * 10, mat=M["gold"], size=0.55, align='LEFT')
# 11 evaporation
a, b = span(10)
dish("K10", ST[10] + Vector((0, 0, -2.0)), 4.6, 1.4, 2.2, 1.3, 22, a, b, esc=[tk(10, 0.8 + 0.4 * j) for j in range(9)], seed=101,
     f_in=sec(tk(10)))
# 12 vapour pressure: closed jar
a, b = span(11)
closed_jar("K11", ST[11] + Vector((0, 0, -2.2)), 4.4, 1.4, 4.0, 1.3, 22, a, b, vap0=6, esc=[tk(11, 0.5 + 0.4 * j) for j in range(10)],
           ret=[tk(11, 0.7 + 0.4 * j) for j in range(10)], seed=111, f_in=sec(tk(11)))
# 13 boiling
a, b = span(12)
c12 = ST[12] + Vector((0, 0, -1.6))
dish("K12", c12, 3.6, 1.4, 2.4, 1.7, 22, a, b, speed=2.0, seed=121, f_in=sec(tk(12)))
flame("K12 Flame", c12 + Vector((0, 0, -0.9)), tk(12, 0.4), D * 13 + 0.2, s=0.8)
BUB = mat_emit("Bubble", (0.85, 0.92, 1.0), 1.2, alpha=0.55)
rb = _r.Random(12)
for j in range(14):
    p0 = c12 + Vector((rb.uniform(-1.4, 1.4), rb.uniform(-0.3, 0.3), 0.15))
    bb = sphere("K12 Bub %d" % j, 0.12, BUB, p0, None, 12, 6)
    t0 = tk(12, 0.8 + 0.28 * j)
    hide_until(bb, sec(t0))
    move(bb, sec(t0), sec(t0 + 1.0), p0, p0 + Vector((0, 0, 1.55)), 'LINEAR')
    hide_from(bb, sec(t0 + 1.0) + 1)
big("Lbl K12", "100 °C", c12 + Vector((2.6, -0.6, 2.2)), tk(12, 1.0), D * 13, mat=M["gold"], size=0.5)
# 14 freezing: liquid → grid
c13 = ST[13] + Vector((0, 0, -1.8))
appear(box_edges("K13 Box", (3.4, 1.2, 2.4), c13 + Vector((0, 0, 1.2)), top=False), sec(tk(13)), dur=8)
grid = grid_pts(6, 3, 0.42, c13 + Vector((0, 0, 0.6)))
lo, hi = c13 + Vector((-1.7, -0.4, 0)), c13 + Vector((1.7, 0.4, 1.3))
liq = []
for i, gpnt in enumerate(grid):
    rr = _r.Random(130 + i)
    st = Vector([lo[j] + 0.15 + rr.random() * (hi[j] - lo[j] - 0.3) for j in range(3)])
    liq.append(life("K13 L %d" % i, st, tk(13, 0.0), [("box", lo, hi, tk(13, 2.0), 1.0), ("to", gpnt, tk(13, 3.0))], r=0.15,
                    seed=140 + i, f_in=sec(tk(13, 0.3))))
swap(liq, shake("K13 S", grid, tk(13, 3.0), D * 14 + 0.2, r=0.15, seed=13), tk(13, 3.0))
big("Lbl K13", "0 °C", c13 + Vector((2.4, -0.6, 1.2)), tk(13, 3.0), D * 14, mat=M["cyan"], size=0.5, align='LEFT')
# 15 melting: grid → liquid
c14 = ST[14] + Vector((0, 0, -1.8))
appear(box_edges("K14 Box", (3.4, 1.2, 2.4), c14 + Vector((0, 0, 1.2)), top=False), sec(tk(14)), dur=8)
grid = grid_pts(6, 3, 0.42, c14 + Vector((0, 0, 0.6)))
s14 = shake("K14 S", grid, tk(14, 0.0), tk(14, 2.5), r=0.15, seed=14, amp_f=lambda t: 0.03 + 0.05 * max(0, t - tk(14, 0.8)))
for i, m in enumerate(s14):
    appear(m, sec(tk(14, 0.3)) + i, s=(0.15,) * 3)
l14 = gas("K14 L", len(grid), c14 + Vector((-1.7, -0.4, 0)), c14 + Vector((1.7, 0.4, 1.0)), tk(14, 2.5), D * 15 + 0.2, speed=1.0,
          r=0.15, pos=[pos_at(m, tk(14, 2.5)) for m in s14], seed=15)
swap(s14, l14, tk(14, 2.5))
flame("K14 Flame", c14 + Vector((0, 0, -0.9)), tk(14, 0.4), D * 15 + 0.2, s=0.7)
# 16 amorphous: jumbled
ra = _r.Random(16)
pts = []
while len(pts) < 26:
    p = Vector((ra.uniform(-1.6, 1.6), 0, ra.uniform(-1.4, 1.2)))
    if all((p - q).length > 0.38 for q in pts):
        pts.append(p)
a, b = span(15)
for i, m in enumerate(shake("K15 P", [ST[15] + p for p in pts], a, b, r=0.17, mat=mat_emit("Mol Glass", (0.55, 0.85, 0.95), 1.3),
                            seed=16)):
    appear(m, sec(tk(15, 0.3)) + i, s=(0.17,) * 3)
big("Lbl K15", "glass, wax, rubber", ST[15] + Vector((0, -0.6, 1.9)), tk(15, 1.5), D * 16, size=0.5)
# 17 crystalline: small NaCl cube
NA = mat_emit("Ion Na", (0.6, 0.35, 1.0), 1.6)
CL = mat_emit("Ion Cl", (0.3, 1.0, 0.45), 1.3)
lat = empty("K16 Lattice", ST[16] + Vector((0, 0, -0.2)))
q = 0
for i in range(3):
    for j in range(3):
        for kz in range(3):
            na = (i + j + kz) % 2 == 0
            s_ = sphere("K16 Ion %d" % q, 0.18 if na else 0.27, NA if na else CL, ((i - 1) * 0.9, (j - 1) * 0.9, (kz - 1) * 0.9), lat, 16, 8)
            appear(s_, sec(tk(16, 0.3)) + q, s=((0.18 if na else 0.27),) * 3)
            q += 1
lat.rotation_euler = (math.radians(15), 0, math.radians(20))
kf(lat, "rotation_euler", sec(tk(16, 0)), (math.radians(15), 0, math.radians(20)), 'LINEAR')
kf(lat, "rotation_euler", sec(D * 17), (math.radians(15), 0, math.radians(110)), 'LINEAR')
big("Lbl K16", "NaCl", ST[16] + Vector((0, -0.6, 2.0)), tk(16, 1.2), D * 17, mat=M["gold"], size=0.55)
# 18 allotropy: diamond and graphite
GEM = mat_emit("Diamond Glow", (0.8, 0.95, 1.0), 1.6)
GRAPH = mat_pbr("Graphite", (0.12, 0.12, 0.14), metallic=0.6, roughness=0.35)
d17 = empty("K17 Diamond", ST[17] + Vector((-2.4, 0, 0)))
cyl("K17 Dia Top", 0.8, 0.0, 0.8, GEM, (0, 0, 0.4), d17, segs=8)
cyl("K17 Dia Bot", 0.8, 0.0, 1.1, GEM, (0, 0, -0.55), d17, rot=(math.pi, 0, 0), segs=8)
appear(d17, sec(tk(17)), dur=8)
g17 = empty("K17 Graphite", ST[17] + Vector((2.4, 0, -0.5)))
for j in range(5):
    box("K17 Gr %d" % j, (1.8, 1.2, 0.1), GRAPH, (0.05 * j, 0, 0.2 * j), g17)
appear(g17, sec(tk(17, 0.4)), dur=8)
big("Lbl K17", "both pure carbon", ST[17] + Vector((0, -0.6, 1.8)), tk(17, 1.0), D * 18, mat=M["gold"], size=0.5)
# 19 transition temperature: sulphur rings shift at 95.5 °C
SUL = mat_emit("Sulphur", (1.0, 0.85, 0.25), 1.2)
for i in range(3):
    for j in range(3):
        g = empty("K18 S8 %d %d" % (i, j), ST[18] + Vector(((i - 1) * 1.15, 0, (j - 1) * 0.85 - 0.2)))
        rp = []
        for u in range(8):
            ang = 2 * math.pi * u / 8
            p = (0.42 * math.cos(ang), 0.21 * math.sin(ang), 0.1 if u % 2 else -0.1)
            sphere("K18 S %d %d %d" % (i, j, u), 0.11, SUL, p, g, 12, 6)
            rp.append(p)
        pcurve("K18 Ring %d %d" % (i, j), rp + [rp[0]], SUL, 0.025, "Models", parent=g)
        appear(g, sec(tk(18, 0.3)) + 2 * (3 * i + j), dur=8)
        a0 = g.location.copy()
        move(g, sec(tk(18, 2.4)), sec(tk(18, 3.6)), a0, a0 + Vector(((j - 1) * 0.55, 0, (j - 1) * 0.1)))
        kf(g, "rotation_euler", sec(tk(18, 2.4)), (0, 0, 0))
        kf(g, "rotation_euler", sec(tk(18, 3.6)), (0, math.radians(30), 0))
big("Lbl K18", "95.5 °C", ST[18] + Vector((0, -0.6, 1.8)), tk(18, 2.4), None, mat=M["red"], size=0.55)
finish_film()
