# ---- Film 410: Metallic bond (textbook pp.108-109: 4.3.5, Fig 4.17 electron sea, Activity 4.3) ----  (v4 captions)
import random
start_film("410", "410 Metallic Bond", 58.5)
END = scene.frame_end
SA, SB = Vector((0, 0, 0)), Vector((40, 0, 0))

shot("Cam Sea", 0, 36, SA + Vector((0, 0, 0.0)), dist=17)
shot("Cam Home", 36, None, SB + Vector((0, 0, -0.5)), dist=21.5)
for name, t in (("Metal atoms", 0), ("Electron sea", 8), ("Activity 4.3", 36)):
    act(name, sec(t))

say('A1', 'Metal atoms packed tight', 0.1, 8)
say('A2', 'Each atom lets electrons go', 8, 16)
say('A3', 'A sea of electrons', 16, 26)
say('A4', 'The sea holds the ions: metallic bond', 26, 36)
say('B1', 'Ionic, covalent or metallic?', 36, 50)
say('B2', 'Metals, salts, the rest covalent', 50, 58)

# ---- A. a grid of metal atoms; their outer electrons leave and form a sea ----
IONP = mat_emit("Metal Ion", (0.42, 0.28, 0.75), 1.0)
random.seed(4)
NX, NZ, G = 6, 4, 1.4
X0, Z0 = -(NX - 1) * G / 2, -(NZ - 1) * G / 2 + 0.6
k = 0
for i in range(NX):
    for j in range(NZ):
        p = SA + Vector((X0 + i * G, 0.2, Z0 + j * G))
        s = sphere("A Ion %d %d" % (i, j), 0.3, IONP, p, None, 24, 12)
        appear(s, sec(0.4) + 2 * k, dur=8, s=(0.3,) * 3)
        rg = ring_curve("A Shell %d %d" % (i, j), 0.55, M["orbit"], None, depth=0.012)
        rg.location, rg.rotation_euler = p, (math.pi / 2, 0, 0)
        appear(rg, sec(0.6) + 2 * k, sec(9.0) + k, dur=8)
        e = electron("A Sea %d" % k, None, p + Vector((0.55, -0.1, 0)), 0.12)
        appear(e, sec(0.8) + 2 * k, dur=6, s=tuple(e.scale))
        pl = _text("A Plus %d" % k, "+", p + Vector((0, -0.35, -0.12)), 0.45, M["white"], weight="semibold")
        appear(pl, sec(9.4) + k)
        t, cur = 9.0 + 0.03 * k, e.location.copy()
        kf(e, "location", sec(t), cur, 'BEZIER')
        while t < 64:
            t += 1.6 + random.random()
            cur = SA + Vector((X0 - 0.4 + random.random() * (NX * G - 0.6), -0.3, Z0 - 0.5 + random.random() * (NZ * G - 0.4)))
            kf(e, "location", sec(t), cur, 'BEZIER')
        k += 1
pulses("A Pull", SA + Vector((X0 + 2 * G, -0.3, Z0 + G)), None, [27.0, 28.4, 29.8], r=0.9, mat=M["gold"])
big("Lbl A Ions", "+ ions", SA + Vector((X0 - 1.6, -0.6, Z0 + 3 * G + 0.6)), 10.4, 35.8, mat=mat_emit("Ion Plus Lbl", (0.8, 0.6, 1.0), 2.5),
    size=0.55)
big("Lbl A Sea", "sea of electrons", SA + Vector((2.2, -0.6, Z0 + 3 * G + 0.6)), 17.0, 35.8, mat=M["cyan"], size=0.55)

# ---- B. Activity 4.3: ten things at home into three bins ----
BIN_M = mat_pbr("Sort Bin", (0.05, 0.06, 0.09), roughness=0.7)
BX = {"ionic": -6.0, "covalent": 0.0, "metallic": 6.0}
for k, (nm, col) in enumerate((("ionic", M["red"]), ("covalent", M["gold"]), ("metallic", M["cyan"]))):
    appear(box("B Bin %s" % nm, (5.4, 0.12, 4.2), BIN_M, SB + Vector((BX[nm], 0.8, 0.2))), sec(36.4 + 0.2 * k), dur=10)
    big("Lbl B %s" % nm, nm, SB + Vector((BX[nm], -0.6, 2.9)), 36.8 + 0.2 * k, None, mat=col, size=0.6)
used = {kk: 0 for kk in BX}
for k, (txt, kind) in enumerate((("salt", "ionic"), ("copper wire", "metallic"), ("water", "covalent"),
                                 ("sugar", "covalent"), ("iron nail", "metallic"), ("baking soda", "ionic"),
                                 ("cooking gas", "covalent"), ("foil (Al)", "metallic"), ("chalk", "ionic"),
                                 ("gold ring", "metallic"))):
    t = 38.4 + 1.6 * k
    n = used[kind]
    used[kind] += 1
    z = 1.5 - 1.0 * n
    top = SB + Vector((0, -1.0, 4.4))
    c = big("Card %d" % k, txt, top, t, None, mat=M["white"], size=0.48)
    move(c, sec(t + 0.4), sec(t + 1.2), top, SB + Vector((BX[kind], -1.0, z - 0.2)))
finish_film()
