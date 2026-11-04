# ---- Film 09 (v4 "show, don't tell"): Isotopes of carbon, chlorine and uranium (pp.54-56, Tables 2.7-2.9) ----
# Each element: one atom; neutrons fly into its nucleus one by one, turning it into the next isotope (name, symbol and
# p/n counts change on the left) · then a glass case of 100 marbles pours in (C 99 : 1, Cl 76 : 24, U 99 : 1) with the
# book's percentages · summary: the isotope symbols, one element row at a time.
# bsend.py common.py p2/lib.py u3/u3lib.py v4lib.py p2/f09_isotopes_ccu.py      (old v2: backups/f09_isotopes_ccu_v2.py)
start_film("09", "09 Isotopes of C, Cl, U", 100.0)
C0, CL, UU, JC, JL, JU, SM = [Vector((40 * k, 0, 0)) for k in range(7)]
for name, t in (("Carbon", 0), ("100 carbon atoms", 22), ("Chlorine", 31), ("100 chlorine atoms", 47),
                ("Uranium", 56), ("100 uranium atoms", 80), ("Summary", 90)):
    act(name, sec(t))


def element(key, X, Z, sym, word, isos, radii, counts, times, nuc_r, cam_dist=12.0, e_note=None):
    """One flat atom; at each new isotope its extra neutrons fly into the nucleus (the nucleus swaps to the bigger
    one). isos = [(A, n)], times = start of each isotope (+ end time). Labels: name, symbol, p/n counts."""
    t_end = times[-1]
    shot("Cam " + key, times[0], t_end, X + Vector((-1.6, 0, -0.2)), dist=cam_dist, drift=0.25)
    g, rgs = flat_rings(key, X + Vector((0.4, 0, 0.3)), radii, t_in=[times[0] + 0.3 + 0.2 * k for k in range(len(radii))])
    hide_from(g, sec(t_end))
    for k, (r, n) in enumerate(zip(radii, counts)):
        for j in range(n):
            e = electron("%s e%d %02d" % (key, k, j), g, seat_pos(r, n, j), 0.11)
            appear(e, sec(times[0] + 0.6 + 0.2 * k) + j, dur=6, s=tuple(e.scale))
    def swap_t(i):
        if i >= len(isos):
            return t_end
        return times[i] + (0.0 if i == 0 else 0.6 + 0.55 * (isos[i][1] - isos[i - 1][1]) + 0.9)

    for i, (A, nn) in enumerate(isos):
        a, b = times[i], times[i + 1]
        nu = nucleus_mesh("%s Nuc %d" % (key, A), Z, nn, g, r=nuc_r, seed=Z + i)
        t_swap = swap_t(i)
        kf(nu, "scale", 0, (0, 0, 0), 'CONSTANT')
        if i == 0:
            kf(nu, "scale", sec(a + 0.4), (0, 0, 0), 'BEZIER')
            kf(nu, "scale", sec(a + 0.4) + 10, (1, 1, 1), 'CONSTANT')
        else:
            kf(nu, "scale", sec(t_swap), (1, 1, 1), 'CONSTANT')
        kf(nu, "scale", sec(swap_t(i + 1)), (0, 0, 0), 'CONSTANT')     # stays until the next one replaces it
        R = nucleus_radius(Z + nn, nuc_r)
        if i > 0:                                   # the extra neutrons fly in, one after another
            extra = nn - isos[i - 1][1]
            for m in range(extra):
                ang = math.radians(20 + 40 * m)
                seat = Vector((R * math.cos(ang), R * math.sin(ang), 0.15))
                nb = sphere("%s n %d %d" % (key, A, m), nuc_r, M["neutron"], seat, g)
                t = a + 0.6 + 0.55 * m
                land(nb, t, dur=1.1, frm=(3.8, 1.9 + 0.3 * m, 0), tmat=V4_TRAIL)
                hide_from(nb, sec(t_swap))
            ring_flash("%s Flash %d" % (key, A), g, R + 0.25, t_swap)
            big("%s Plus %d" % (key, A), "+%d neutron%s" % (extra, "" if extra == 1 else "s"),
                X + Vector((-4.9, -0.6, -1.85)), a + 0.2, a + 3.6, mat=M["cyan"], size=0.42)
        lt = a + (0.5 if i == 0 else 2.2)
        big("%s Name %d" % (key, A), "%s-%d" % (word, A), X + Vector((-4.9, -0.6, 1.4)), lt, b, mat=M["gold"], size=0.5)
        nsym("%s %d" % (key, A), sym, A, Z, X + Vector((-4.9, -0.6, 0.15)), lt + 0.3, sec(b), size=0.85)
        big("%s PN %d" % (key, A), "%d p⁺   %d n" % (Z, nn), X + Vector((-4.9, -0.6, -1.1)), lt + 0.6, b,
            mat=M["white"], size=0.38)
    if e_note:
        big(key + " e note", e_note, X + Vector((0.4, -0.6, 0.3 + radii[-1] + 0.45)), times[0] + 1.2, t_end,
            mat=M["cyan"], size=0.4)
    return g


# ---- 100 marbles in a glass case: each marble = one atom, coloured by isotope ----
GLASS = mat_emit("Case Glass", (0.55, 0.7, 1.0), 0.25, alpha=0.1)
METAL = gloss("Case Metal", (0.5, 0.53, 0.6), rough=0.3)
MCOL = {"blue": (0.25, 0.5, 1.0), "green": (0.3, 0.95, 0.45), "orange": (1.0, 0.55, 0.15), "dim": (0.6, 0.6, 0.65)}
MARB = {k: gloss("Marble %s" % k, c, rough=0.12) for k, c in MCOL.items()}
LBL = {k: mat_emit("Marble Lbl %s" % k, c, 2.2) for k, c in MCOL.items()}


def jar(key, J, groups, t0, t1, seed):
    """groups: [(text, marbles, colour)], majority first. Marbles pour in row by row; the few odd ones swell; the
    labels (book %) pop in one by one beside the case."""
    shot("Cam " + key, t0, t1, J + Vector((2.2, 0, -0.2)), dist=14.5, drift=0.2)
    case = empty(key + " Case", J)
    box(key + " Glass", (4.75, 0.7, 4.75), GLASS, (0, 0, 0.2), case)
    box(key + " Floor", (5.0, 0.9, 0.14), METAL, (0, 0, -2.25), case)
    appear(case, sec(t0 + 0.2), sec(t1), dur=10)
    rnd = random.Random(seed)
    colour = [groups[0][2]] * 100
    free, minority = list(range(100)), []
    for text, cnt, col in groups[1:]:
        for i in rnd.sample(free, cnt):
            colour[i] = col
            free.remove(i)
            minority.append(i)
    for i in range(100):
        r, c = divmod(i, 10)
        seat = J + Vector(((c - 4.5) * 0.44, 0, -1.96 + r * 0.44))
        m = sphere("%s M%02d" % (key, i), 0.2, MARB[colour[i]], seat, None, 16, 8)
        f = sec(t0 + 0.6) + r * 5 + int(c * 0.6)
        appear(m, f, sec(t1), dur=3, s=(0.2,) * 3)
        kf(m, "location", f, seat + Vector((0, 0, 3.0 + 0.2 * r)), 'BEZIER')
        kf(m, "location", f + 10, seat, 'BEZIER')
        if i in minority:                           # the odd ones swell once
            f = sec(t0 + 4.4)
            kf(m, "scale", f, (0.2,) * 3, 'BEZIER')
            kf(m, "scale", f + 8, (0.34,) * 3, 'BEZIER')
            kf(m, "scale", f + 16, (0.2,) * 3, 'BEZIER')
    for k, (text, cnt, col) in enumerate(groups):
        big("%s Key %d" % (key, k), text, J + Vector((2.95, -0.6, 1.2 - 0.8 * k)), t0 + 3.4 + 1.0 * k, t1,
            mat=LBL[col], size=0.4, align='LEFT')


# ---- carbon: 6 protons; 6, 7, 8 neutrons ----
element("Carbon", C0, 6, "C", "Carbon", [(12, 6), (13, 7), (14, 8)], [0.95, 1.65], [2, 4], [0, 8, 15, 22], 0.12)
say("A1", "Carbon has 6 protons", 0.3, 4.0)
say("A2", "Carbon-12 has 6 neutrons", 4.0, 8.0)
say("A3", "Add one: carbon-13", 8.0, 15.0)
say("A4", "One more: carbon-14", 15.0, 22.0)
jar("Carbon Jar", JC, [("carbon-12   98.98 %", 99, "blue"), ("carbon-13   1.109 %", 1, "green"),
                       ("carbon-14   1 ppt", 0, "dim")], 22, 31, 3)
say("B1", "Take 100 carbon atoms", 22, 25.6)
say("B2", "99 carbon-12, 1 carbon-13", 25.6, 28.6)
say("B3", "Carbon-14: 1 in a trillion", 28.6, 31)

# ---- chlorine: 17 protons; 18, 20 neutrons ----
element("Chlorine", CL, 17, "Cl", "Chlorine", [(35, 18), (37, 20)], [0.85, 1.45, 2.05], [2, 8, 7], [31, 39, 47],
        0.1, cam_dist=13)
say("C1", "Chlorine has 17 protons", 31.3, 35.0)
say("C2", "Chlorine-35 has 18 neutrons", 35.0, 39.0)
say("C3", "Add two: chlorine-37", 39.0, 47.0)
jar("Chlorine Jar", JL, [("chlorine-35   75.53 %", 76, "blue"), ("chlorine-37   24.47 %", 24, "green")], 47, 56, 7)
say("D1", "Take 100 chlorine atoms", 47, 50.6)
say("D2", "76 chlorine-35, 24 chlorine-37", 50.6, 53.6)
say("D3", "About 3 in 4 are chlorine-35", 53.6, 56)

# ---- uranium: 92 protons; 142, 143, 146 neutrons (the book draws one shell, e = 92) ----
element("Uranium", UU, 92, "U", "Uranium", [(234, 142), (235, 143), (238, 146)], [1.75], [1], [56, 64, 71, 80],
        0.07, cam_dist=12.5, e_note="92 e⁻")
say("E1", "Uranium has 92 protons", 56.3, 60.0)
say("E2", "Uranium-234 has 142 neutrons", 60.0, 64.0)
say("E3", "Add one: uranium-235", 64.0, 71.0)
say("E4", "Add three: uranium-238", 71.0, 80.0)
jar("Uranium Jar", JU, [("uranium-238   99.245 %", 99, "blue"), ("uranium-235   0.75 %", 1, "orange"),
                        ("uranium-234   0.05 %", 0, "dim")], 80, 90, 11)
say("F1", "Take 100 uranium atoms", 80, 83.6)
say("F2", "99 uranium-238, 1 uranium-235", 83.6, 87.0)
say("F3", "Uranium-234: less than one", 87.0, 90)

# ---- summary: same protons, different neutrons; one element row at a time ----
shot("Cam Summary", 90, None, SM + Vector((0, 0, -0.3)), dist=13, drift=0.2)
for r, (sym, Z, As) in enumerate((("C", 6, (12, 13, 14)), ("Cl", 17, (35, 37)), ("U", 92, (234, 235, 238)))):
    t = 90.6 + 1.6 * r
    z = 2.0 - 1.7 * r
    big("Sum Z %d" % r, "%d p⁺" % Z, SM + Vector((-4.6, -0.6, z)), t, None, mat=M["red"], size=0.45)
    for k, A in enumerate(As):
        nsym("Sum %d %d" % (r, k), sym, A, Z, SM + Vector((-1.6 + 2.6 * k, -0.6, z)), t + 0.3 + 0.25 * k, None,
             size=0.75)
say("G1", "Same protons, different neutrons", 90, None)
scene["ar_range"] = [sec(15), sec(22) - 1]      # AR: carbon-14
scene["ar_scale"] = 0.04
finish_film()
