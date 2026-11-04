# ---- Film 07 (v4 "show, don't tell"): Electronic configuration of the first 18 elements + Test Yourself
# (textbook pp.51-52, Table 2.4). Beats: one atom grows from H to Ar, one proton and one electron at a time
# (s electrons blue, p electrons green; K fills, then L: 2s then 2p, then M: 3s then 3p) · Table 2.4 as tiles ·
# Test Yourself: Na (11 p → 11 e → 1s² 2s² 2p⁶ 3s¹), K (2, 8, 8, 1 → 19 e → 19 p), N, P, Ar.
# bsend.py common.py p2/lib.py u3/u3lib.py v4lib.py p2/f07_first18.py      (old: backups/f07_first18_v2.py)
start_film("07", "07 First 18 Elements", 96.0)
O, TB, Q1, Q2, Q3 = [Vector((40 * k, 0, 0)) for k in range(5)]
for name, t in (("H to Ar", 0), ("Table 2.4", 48), ("Test Yourself 1", 56), ("Test Yourself 2", 66),
                ("Test Yourself 3", 78)):
    act(name, sec(t))
EP = mat_emit("Electron p", (0.35, 1.0, 0.6), 6.0)       # p electrons glow green, s electrons stay blue
P_TRAIL = mat_emit("P Trail", (0.35, 1.0, 0.6), 2.4)
SYMS = ["H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K"]
FILL = [("1s", 0, 2), ("2s", 1, 2), ("2p", 1, 6), ("3s", 2, 2), ("3p", 2, 6), ("4s", 3, 2)]
SUP = str.maketrans("0123456789", "⁰¹²³⁴⁵⁶⁷⁸⁹")
RAD = [0.85, 1.5, 2.15, 2.8]
SEAT_S, SEAT_P = [0, 4], [2, 6, 1, 5, 3, 7]               # where s and p electrons sit on an 8-seat ring


def config(z):
    out, left = [], z
    for name, _, cap in FILL:
        if left <= 0:
            break
        k = min(cap, left)
        out.append(name + str(k).translate(SUP))
        left -= k
    return " ".join(out)


def seats(z):
    """For electrons 1..z: (shell index, local seat position, is p)."""
    res, left = [], z
    for name, sh, cap in FILL:
        for j in range(min(cap, left)):
            if sh == 0:
                a = 90 + 180 * j
            elif name[1] == "s":
                a = 90 + 45 * SEAT_S[j]
            else:
                a = 90 + 45 * SEAT_P[j]
            res.append((sh, Vector((RAD[sh] * math.cos(math.radians(a)), RAD[sh] * math.sin(math.radians(a)), 0)),
                        name[1] == "p"))
        left -= min(cap, left)
    return res


def atom(name, loc, z, t0, gap, t_out):
    """A flat atom whose z electrons fly in one by one from t0 (every `gap` s). Returns the group."""
    sh_n = max(s_[0] for s_ in seats(z)) + 1
    g, rgs = flat_rings(name, loc, RAD[:sh_n], t_in=[t0 - 0.6 + 0.15 * k for k in range(sh_n)])
    appear(g, sec(t0 - 0.8), sec(t_out), dur=8)
    nucleus_mesh(name + " Nucleus", z, neutrons(z), g, r=0.11, seed=z)
    for m, (sh, p, isp) in enumerate(seats(z)):
        e = electron("%s e%02d" % (name, m), g, p, 0.1, mat=EP if isp else None)
        land(e, t0 + gap * m, dur=0.7, k=2.0, tmat=P_TRAIL if isp else V4_BLUE_TRAIL)
    return g


# ---- 1. one atom grows from H to Ar ----
shot("Cam Build", 0, 48, O + Vector((-1.6, 0, -0.3)), dist=12.5, drift=0.25)
g, rgs = flat_rings("Build", O, RAD[:3])
STEP = 2.2
T0 = 4.0
t_ring = {0: T0, 1: T0 + 2 * STEP, 2: T0 + 10 * STEP}
for k, rg in enumerate(rgs):
    appear(rg, sec(t_ring[k] - 0.3), sec(47.8), dur=10)
for z in range(1, 19):
    t = T0 + STEP * (z - 1)
    t_next = t + STEP if z < 18 else 47.8
    nu = nucleus_mesh("Build Nuc %02d" % z, z, neutrons(z), g, r=0.11, seed=z)
    kf(nu, "scale", 0, (0, 0, 0), 'CONSTANT')
    kf(nu, "scale", sec(t), (1, 1, 1), 'CONSTANT')
    kf(nu, "scale", sec(t_next), (0, 0, 0), 'CONSTANT')
    sh, p, isp = seats(z)[-1]
    e = electron("Build e%02d" % z, g, p, 0.1, mat=EP if isp else None)
    land(e, t + 0.25, dur=0.75, k=2.0, tmat=P_TRAIL if isp else V4_BLUE_TRAIL)
    hide_from(e, sec(47.8))
    big("Sym %02d" % z, SYMS[z - 1], O + Vector((-4.7, -0.6, 1.2)), t, t_next, mat=M["white"], size=1.1)
    big("Cfg %02d" % z, config(z), O + Vector((-4.7, -0.6, -0.1)), t + 0.6, t_next, mat=M["gold"], size=0.42)
    big("Z %02d" % z, "%d electron%s" % (z, "" if z == 1 else "s"), O + Vector((-4.7, -0.6, -0.8)), t, t_next,
        mat=M["dim"], size=0.32)
say("A1", "One electron more each time", 0.3, T0)
say("A2", "K holds 2: H, He", T0, T0 + 2 * STEP)
say("A3", "L fills: 2s, then 2p", T0 + 2 * STEP, T0 + 10 * STEP)
say("A4", "M fills: 3s, then 3p", T0 + 10 * STEP, T0 + 18 * STEP)
say("A5", "Argon: 2, 8, 8", T0 + 18 * STEP, 48)

# ---- 2. Table 2.4 as tiles: symbol + configuration, two rows of nine ----
shot("Cam Table", 48, 56, TB + Vector((0, 0, -0.1)), dist=15, drift=0.15)
for z in range(1, 19):
    r, c = divmod(z - 1, 9)
    p = TB + Vector((-5.4 + 1.35 * c, 0, 1.9 - 2.5 * r))
    t = 48.3 + 0.18 * z
    big("T Sym %02d" % z, SYMS[z - 1], p + Vector((0, -0.6, 0.35)), t + 0.1, 55.8, mat=M["white"], size=0.55)
    for j, part in enumerate(config(z).split(" ")):
        big("T Cfg %02d %d" % (z, j), part, p + Vector((0, -0.6, -0.15 - 0.3 * j)), t + 0.2, 55.8,
            mat=M["gold"] if part[1] == "s" else EP, size=0.27)
say("B1", "Table 2.4: the first 18", 48, 56)

# ---- 3. Test Yourself 1: sodium, 11 protons and 12 neutrons ----
shot("Cam Q1", 56, 66, Q1 + Vector((-1.4, 0, -0.3)), dist=12.5, drift=0.2)
atom("Na", Q1, 11, 58.6, 0.38, 65.8)
big("Q1 Nuc", "11 p⁺", Q1 + Vector((-4.6, -0.6, 1.0)), 56.6, 65.8, mat=M["red"], size=0.6)
big("Q1 e", "→ 11 e⁻", Q1 + Vector((-4.6, -0.6, 0.2)), 57.6, 65.8, mat=M["cyan"], size=0.5)
big("Q1 Cfg", "1s² 2s² 2p⁶ 3s¹", Q1 + Vector((-4.6, -0.6, -0.8)), 63.2, 65.8, mat=M["gold"], size=0.42)
say("C1", "Sodium: 11 protons, so 11 electrons", 56, 63)
say("C2", "Its configuration", 63, 66)

# ---- 4. Test Yourself 2: potassium 2, 8, 8, 1 → 19 electrons → 19 protons ----
shot("Cam Q2", 66, 78, Q2 + Vector((-1.6, 0, -0.6)), dist=15.5, drift=0.2)
atom("K", Q2, 19, 66.8, 0.3, 77.8)
for k, (n, dt) in enumerate(((2, 0.3), (8, 2.7), (8, 5.1), (1, 5.4))):
    big("Q2 n%d" % k, str(n), Q2 + Vector((RAD[k] * math.cos(math.radians(205)) - 0.2, -0.6,
                                            RAD[k] * math.sin(math.radians(205)))), 67.4 + dt, 77.8, mat=M["gold"],
        size=0.42, align='RIGHT')
big("Q2 Sum", "2 + 8 + 8 + 1 = 19", Q2 + Vector((-5.0, -0.6, 0.9)), 73.2, 77.8, mat=M["gold"], size=0.42)
big("Q2 Nuc", "19 p⁺", Q2 + Vector((-5.0, -0.6, 0.0)), 74.8, 77.8, mat=M["red"], size=0.6)
say("D1", "Potassium: 2, 8, 8, 1", 66, 73)
say("D2", "19 electrons, so 19 protons", 73, 78)

# ---- 5. Test Yourself 3: N, P, Ar one at a time ----
shot("Cam Q3", 78, None, Q3 + Vector((0, 0, -0.2)), dist=16.5, drift=0.2)
for k, (sym, z, t0) in enumerate((("N", 7, 78.4), ("P", 15, 83.4), ("Ar", 18, 89.0))):
    loc = Q3 + Vector((-4.8 + 4.8 * k, 0, 0.9))
    atom("Q3 %s" % sym, loc, z, t0 + 0.6, 0.22, 95.8)
    big("Q3 Sym %s" % sym, sym, loc + Vector((-1.9, -0.6, 1.9)), t0, None, mat=M["white"], size=0.6)
    big("Q3 Cfg %s" % sym, config(z), loc + Vector((0, -0.6, -2.6)), t0 + 0.8 + 0.22 * z, None, mat=M["gold"],
        size=0.36)
say("E1", "Nitrogen: 7 electrons", 78, 83.4)
say("E2", "Phosphorus: 15 electrons", 83.4, 89)
say("E3", "Argon: 18 electrons", 89, None)
scene["ar_range"] = [sec(44), sec(48) - 1]
finish_film()
