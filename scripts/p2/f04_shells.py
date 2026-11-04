# ---- Film 04 (v6 "energy stadium"): Shells and electronic configuration (textbook p.48, Table 2.2) ----
# The atom is a stadium of glowing steps for the WHOLE film: each shell ring sits on its own terrace, the farther the
# shell the higher its step (cool blue K at the bottom → warm gold O at the top), so "farther = more energy" is seen,
# not told. An energy ruler on the left carries n, the shell letters, 2n² and the counts (the atom stays clean).
# Beats (all book points of p.48): shells K L M N O = n 1-5 · shells are energy levels · K nearest, least energy ·
# a gold electron climbs K → O, taking in a spark of energy at every step (it glows more) · seats fill K 2, L 8, M 18
# (outer electrons glow brighter: more energy) · 18 = two 3 × 3 squares = 2n² · N 32, O 50 · sodium 2, 8, 1 = its
# electronic configuration · Table 2.2 on the ruler (n, name, 2n², electrons).
# v6 (user): lower, closer camera; matte steps (glare when looking down); electrons show energy.
# bsend.py common.py p2/lib.py u3/u3lib.py v4lib.py p2/f04_shells.py      (v5: backups/f04_shells_v5.py)
start_film("04", "04 Shells & Electronic Configuration", 106.0)
O, NA = Vector((0, 0, 0)), Vector((40, 0, 0))
for name, t in (("Shells", 0), ("Energy", 12), ("Seats 2n²", 30), ("Configuration", 78), ("Table 2.2", 98)):
    act(name, sec(t))

R = [0.9, 1.55, 2.2, 2.85, 3.5]
H = [0.0, 0.38, 0.76, 1.14, 1.52]                     # terrace heights: farther shell = higher step
CAP = [2, 8, 18, 32, 50]
SCOL = [(0.25, 0.45, 1.0), (0.3, 0.75, 0.95), (0.4, 0.95, 0.6), (1.0, 0.8, 0.35), (1.0, 0.5, 0.3)]
RING = [mat_emit("Shell Glow %d" % k, c, 3.2) for k, c in enumerate(SCOL)]
STEP = [mat_pbr("Shell Slab Matte %d" % k, tuple(0.22 * x for x in c), metallic=0.0, roughness=0.75)
        for k, c in enumerate(SCOL)]                  # matte: no white glare when you look down on it
TXT = [mat_emit("Shell Txt %d" % k, c, 3.0) for k, c in enumerate(SCOL)]
GLOW = [mat_emit("Shell e Glow %d" % k, c, 2.5, alpha=0.28) for k, c in enumerate(SCOL)]
RX = -5.5                                            # the energy ruler (x)
PITCH, DIST = 0.4, 13.5                              # a bit lower and closer than v5: steps read as tiers


def terrace(name, r0, r1, h, mat, parent, thick=0.12, n=96):
    """A thin floating ring-slab (one step): top at height h."""
    bm = bmesh.new()
    rings = []
    for r, z in ((r0, h), (r1, h), (r1, h - thick), (r0, h - thick)):
        rings.append([bm.verts.new((r * math.cos(2 * math.pi * i / n), r * math.sin(2 * math.pi * i / n), z))
                      for i in range(n)])
    for a, b in ((0, 1), (1, 2), (2, 3), (3, 0)):    # top, outer edge, bottom, inner edge
        for i in range(n):
            j = (i + 1) % n
            bm.faces.new((rings[a][i], rings[a][j], rings[b][j], rings[b][i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return mesh_from_bm(name, bm, mat, "Models", parent)


def stadium(name, loc, radii, heights, t_rise):
    """Group (z up) with one terrace + glowing ring per shell; terrace k rises from below at t_rise[k]."""
    g = empty(name, loc)
    rings = []
    for k, (r, h) in enumerate(zip(radii, heights)):
        r0 = 0.32 if k == 0 else (radii[k - 1] + r) / 2 + 0.04
        r1 = (r + radii[k + 1]) / 2 - 0.04 if k + 1 < len(radii) else r + 0.32
        st = empty("%s Step %d" % (name, k), (0, 0, 0), g)
        terrace("%s Terrace %d" % (name, k), r0, r1, h, STEP[k], st)
        rg = ring_curve("%s Ring %d" % (name, k), r, RING[k], st, depth=0.03, loc=(0, 0, h + 0.02))
        kf(st, "location", 0, (0, 0, -2.4), 'CONSTANT')
        kf(st, "location", sec(t_rise[k]), (0, 0, -2.4), 'BEZIER')
        kf(st, "location", sec(t_rise[k]) + 24, (0, 0, 0), 'BEZIER')
        hide_until(st, sec(t_rise[k]))
        rings.append(rg)
    return g, rings


def seat(r, h, n, j):
    p = seat_pos(r, n, j)
    return Vector((p.x, p.y, h + 0.12))


def glow(e, k, size=0.1):
    """A soft glow round an electron on shell k: the farther the shell, the bigger and warmer (more energy)."""
    world = size * (1.3 + 0.45 * k)
    return sphere(e.name[len(PFX) + 1:] + " Glow", world / e.scale.x, GLOW[k], (0, 0, 0), e, 12, 6)


def ruler(name, loc, heights, t_in, t_out, ns=True):
    """Energy ruler: gold arrow up, 'n = k' and the shell letter at each step's height."""
    ar = arrow(name + " Arrow", heights[-1] + 1.4, V4_GOLD, None, loc + Vector((0, 0, -0.5)), (0, -math.pi / 2, 0),
               r=0.04, head=0.26)
    appear(ar, sec(t_in), t_out and sec(t_out))
    big(name + " Energy", "energy", loc + Vector((0, -0.6, heights[-1] + 1.25)), t_in + 0.2, t_out, mat=M["gold"],
        size=0.42)
    for k, h in enumerate(heights):
        big("%s L%d" % (name, k), SHELL_NAMES[k], loc + Vector((-0.3, -0.6, h)), t_in + 0.3 + 0.5 * k, t_out,
            mat=TXT[k], size=0.42, align='RIGHT')
        if ns:
            big("%s N%d" % (name, k), "n = %d" % (k + 1), loc + Vector((-0.95, -0.6, h)), t_in + 0.4 + 0.5 * k, t_out,
                mat=M["white"], size=0.3, align='RIGHT')


def stadium_shot(name, t0, t1, drift=0.2):
    shot(name, t0, t1, O + Vector((-1.1, 0, 0.5)), dist=DIST, pitch=PITCH, drift=drift)


# ---- 1. the terraces rise; the ruler names them K L M N O = n 1..5 ----
shot("Cam K", 0, 6.5, O + Vector((0, 0, 0.3)), dist=7.5, pitch=PITCH, drift=0.15)
stadium_shot("Cam Stadium", 6.5, 56, drift=0.25)
T_RISE = [0.6, 7.0, 7.5, 8.0, 8.5]
G, rings = stadium("Atom", O, R, H, T_RISE)
nuc = nucleus_mesh("Atom Nucleus", 8, 8, G, loc=(0, 0, 0.3), r=0.12, seed=3)
appear(nuc, sec(0.3), dur=12)
ruler("Ruler", O + Vector((RX, 0, 0)), H, 7.2, 77.6)
for k, h in enumerate(H):
    ln = line("Ledge %d" % k, [O + Vector((RX + 0.15, 0, h)), O + Vector((-R[k] - 0.3, 0, h))], RING[k], depth=0.012)
    appear(ln, sec(7.6 + 0.5 * k), sec(77.6))
say("A1", "Electrons move in shells", 0.3, 6.5)
say("A2", "Shells K, L, M, N, O", 6.5, 12)

# ---- 2. energy levels: each step is one energy level; K is nearest and lowest ----
for k in range(5):
    pulse(rings[k], 12.4 + 0.5 * k, 1.05, dur=12)
say("B1", "Shells are energy levels", 12, 17)
pulse(rings[0], 17.6, 1.12, dur=16)
pulse(nuc, 17.6, 1.25, dur=16)
say("B2", "K: nearest, least energy", 17, 22)

# ---- 3. a gold electron climbs K → O; at every step it takes in a spark of energy and glows more ----
climb = electron("Climber", G, seat(R[0], H[0], 4, 3), 0.13, mat=V4_GOLD)
hide_until(climb, sec(22.2))
cglow = sphere("Climber Glow", 1.0, mat_emit("Climber Glow", (1.0, 0.8, 0.35), 3.0, alpha=0.3), (0, 0, 0), climb, 16, 8)
kf(cglow, "scale", 0, (0, 0, 0), 'CONSTANT')
G0, GK = 0.17 / climb.scale.x, 0.07 / climb.scale.x          # glow radius (world) 0.17, +0.07 per step
f = sec(22.8)
kf(climb, "location", f, seat(R[0], H[0], 4, 3), 'BEZIER')
kf(cglow, "scale", f, (G0,) * 3, 'BEZIER')
for k in range(1, 5):                                 # spark in → hop up one step (front of the stadium)
    t_hop = 22.8 + 1.4 * k
    p0, p = seat(R[k - 1], H[k - 1], 4, 3), seat(R[k], H[k], 4, 3)
    energy_wave("Spark %d" % k, O + p0 + Vector((-1.7, 0, 1.25)), (1.0, 0, -0.74), t_hop - 0.75, dist=2.0, dur=0.6)
    fh = sec(t_hop)
    kf(climb, "location", fh - 4, p0, 'BEZIER')
    kf(climb, "location", fh + 8, (p + p0) / 2 + Vector((0, 0, 0.55)), 'BEZIER')
    kf(climb, "location", fh + 18, p, 'BEZIER')
    kf(cglow, "scale", fh - 2, (G0 + GK * (k - 1),) * 3, 'BEZIER')
    kf(cglow, "scale", fh + 2, (G0 + GK * (k + 1.5),) * 3, 'BEZIER')   # flash as the energy arrives …
    kf(cglow, "scale", fh + 14, (G0 + GK * k,) * 3, 'BEZIER')          # … and it stays brighter one step up
    pulse(rings[k], t_hop + 0.6, 1.04, dur=10)
hide_from(climb, sec(29.8))
say("B3", "Farther out, more energy", 22, 30)

# ---- 4. seats: K 2, L 8, M 18 — each electron drops in; outer electrons glow more (more energy) ----
SEAT = mat_emit("Seat Ghost", (0.5, 0.7, 1.0), 0.6, alpha=0.2)
T_FILL = [(30.6, 0.7), (37.4, 0.42), (45.4, 0.33)]
for k in range(3):
    t0, gap = T_FILL[k]
    for j in range(CAP[k]):
        p = seat(R[k], H[k], CAP[k], j)
        sg = sphere("Seat %s%02d" % (SHELL_NAMES[k], j), 0.07, SEAT, p, G, 8, 4)
        appear(sg, sec(t0) + j % 6, sec(t0 + 1.0 + gap * j + 0.8), dur=6, s=(0.07,) * 3)
        e = electron("e %s%02d" % (SHELL_NAMES[k], j), G, p, 0.1)
        glow(e, k)
        land(e, t0 + 1.0 + gap * j, dur=0.7, frm=p + Vector((0, 0, 1.3)))
    t_full = t0 + 1.0 + gap * CAP[k] + 0.6
    ring_flash("Full %s" % SHELL_NAMES[k], empty("Flash %d" % k, (0, 0, H[k] + 0.02), G), R[k], t_full)
    big("Count %s" % SHELL_NAMES[k], str(CAP[k]), O + Vector((RX + 0.3, -0.6, H[k])), t_full + 0.2, 77.6,
        mat=M["gold"], size=0.42, align='LEFT')
say("C1", "K holds 2", 30, 37)
say("C2", "L holds 8", 37, 45)
say("C3", "M holds 18", 45, 56)

# ---- 5. 18 = 2 × 3 × 3: copies of M's electrons fly into two 3 × 3 squares (book: 2n²) ----
shot("Cam Squares", 56, 73, O + Vector((0.3, 0, 0.6)), dist=18.0, pitch=0.3, drift=0.25)
pulse(rings[2], 56.8, 1.06)
SQ = Vector((6.0, 0, 1.4))
for j in range(18):
    hlf, q = divmod(j, 9)
    row, col = divmod(q, 3)
    goal = SQ + Vector(((-1.45 if hlf == 0 else 0.35) + col * 0.55, -0.1, 0.55 - row * 0.55))
    c = electron("Copy %02d" % j, None, goal, 0.1)
    land(c, 60.0 + 0.16 * j, dur=0.9, frm=seat(R[2], H[2], 18, j), tmat=V4_TRAIL)
    hide_from(c, sec(72.8))
big("Lbl Sq", "2 × 3 × 3 = 18", SQ + Vector((-0.3, -0.6, -1.25)), 63.6, 72.8, mat=M["gold"], size=0.48)
say("D1", "M is shell 3", 56, 60)
say("D2", "Two squares of 3 × 3", 60, 66)
say("D3", "Seats = 2n²", 66, 73)
stadium_shot("Cam NO", 73, 78)
for k in (3, 4):                                      # N and O: their counts only
    t = 73.3 + 1.6 * (k - 3)
    ring_flash("Full %s" % SHELL_NAMES[k], empty("Flash %d" % k, (0, 0, H[k] + 0.02), G), R[k], t)
    big("Count %s" % SHELL_NAMES[k], str(CAP[k]), O + Vector((RX + 0.3, -0.6, H[k])), t + 0.2, 77.6,
        mat=M["gold"], size=0.42, align='LEFT')
say("D4", "N holds 32, O holds 50", 73, 78)

# ---- 6. sodium: 11 gold electrons wait above the atom, then fill from the lowest step up: 2, 8, 1 ----
shot("Cam Sodium", 78, 98, NA + Vector((-0.6, 0, 0.9)), dist=11.5, pitch=PITCH, drift=0.25)
RN, HN = R[:3], H[:3]
GN, nrings = stadium("Na", NA, RN, HN, [78.2, 78.4, 78.6])
appear(nucleus_mesh("Na Nucleus", 11, 12, GN, loc=(0, 0, 0.3), r=0.12, seed=11), sec(78.2), dur=12)
ruler("Na Ruler", NA + Vector((-3.6, 0, 0)), HN, 78.8, 97.6, ns=False)
order = [(0, 2, j) for j in range(2)] + [(1, 8, j) for j in range(8)] + [(2, 1, 0)]
for m, (k, n, j) in enumerate(order):
    p = seat(RN[k], HN[k], n, j)
    e = electron("Na e%02d" % m, GN, p, 0.11, mat=V4_GOLD)
    hp = Vector((-0.5 + 0.34 * (m % 4), 0.0, 3.0 + 0.32 * (m // 4)))      # the waiting cluster above the atom
    t = 82.6 + 0.62 * m
    land(e, t, dur=0.85, frm=hp, tmat=V4_TRAIL)
    kf(e, "location", sec(79.0), hp, 'CONSTANT')
    kf(e, "scale", sec(79.0) - 1, (0, 0, 0), 'CONSTANT')
    kf(e, "scale", sec(79.0) + 6, tuple(e.scale), 'BEZIER')
    if (k, j) in ((0, 1), (1, 7), (2, 0)):
        tf = t + 1.0
        ring_flash("Na Full %d" % k, empty("Na Flash %d" % k, (0, 0, HN[k] + 0.02), GN), RN[k], tf)
        big("Na Count %d" % k, str(n), NA + Vector((-3.3, -0.6, HN[k])), tf + 0.2, 97.6, mat=M["gold"], size=0.42,
            align='LEFT')
big("Lbl Na", "Na", NA + Vector((2.8, -0.6, 2.6)), 78.6, 97.6, mat=M["white"], size=0.6)
big("Lbl Cfg", "2, 8, 1", NA + Vector((2.9, -0.6, 1.7)), 92.6, 97.6, mat=M["gold"], size=0.6, align='LEFT')
say("E1", "Sodium has 11 electrons", 78, 82.4)
say("E2", "Lowest steps fill first", 82.4, 92.4)
say("E3", "This is its electronic configuration", 92.4, 98)

# ---- 7. Table 2.2 on the ruler: n, name, 2n², electrons ----
stadium_shot("Cam Table", 98, None)
for k in range(5):
    n = k + 1
    big("T22 N%d" % k, "n = %d" % n, O + Vector((RX - 0.95, -0.6, H[k])), 98.2 + 0.4 * k, None, mat=M["white"],
        size=0.3, align='RIGHT')
    big("T22 L%d" % k, SHELL_NAMES[k], O + Vector((RX - 0.3, -0.6, H[k])), 98.2 + 0.4 * k, None, mat=TXT[k],
        size=0.42, align='RIGHT')
    big("T22 %s" % SHELL_NAMES[k], "2×%d² = %d" % (n, CAP[k]), O + Vector((RX + 0.3, -0.6, H[k])), 98.4 + 0.4 * k,
        None, mat=M["gold"], size=0.36, align='LEFT')
say("F1", "Table 2.2: 2, 8, 18, 32, 50", 98, None)
scene["ar_range"] = [sec(98), sec(106) - 1]
finish_film()
