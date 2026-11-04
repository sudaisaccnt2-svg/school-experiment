# ---- Film 06 (v4 "show, don't tell"): The Aufbau principle (textbook p.50: sub-shell energy order, diagonal rule) ----
# Beats: a staircase of sub-shells by energy (1s … 3d), 4s sits below 3d · lowest first: an electron that tries a
# higher step slides back · potassium's 19 electrons fill the steps from the bottom; the 19th looks at 3d and drops
# into 4s · K = 1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹ · the diagonal chart drawn arrow by arrow, each cell glowing in filling order.
# bsend.py common.py p2/lib.py u3/u3lib.py v4lib.py p2/f06_aufbau.py      (old v2: backups/f06_aufbau_v2.py)
start_film("06", "06 Aufbau Principle", 64.0)
L, D = Vector((0, 0, 0)), Vector((40, 0, 0))
for name, t in (("Energy steps", 0), ("Lowest first", 8), ("Potassium", 16), ("Diagonal rule", 48)):
    act(name, sec(t))
COL = {"s": (0.30, 0.62, 1.0), "p": (0.30, 1.0, 0.55), "d": (1.0, 0.62, 0.25), "f": (0.78, 0.45, 1.0)}
SOLID = {k: gloss("Step %s" % k, tuple(0.5 * x for x in c)) for k, c in COL.items()}
TXT = {k: mat_emit("Step Txt %s" % k, c, 3.0) for k, c in COL.items()}

# ---- the staircase: one step per sub-shell, height = energy, width = its seats (2, 6, 10) ----
STEPS = [("1s", 0.0), ("2s", 0.75), ("2p", 1.2), ("3s", 1.95), ("3p", 2.4), ("4s", 3.15), ("3d", 3.5)]
SEATS = {"s": 2, "p": 6, "d": 10}
X0, GAP, PER = -4.3, 0.18, 0.26              # left edge, gap between steps, width per electron seat
shot("Cam Steps", 0, 48, L + Vector((0, 0, 1.15)), dist=13.5, drift=0.3)
seat_at, step_ob, step_lbl = {}, {}, {}
x = X0
for k, (nm, z) in enumerate(STEPS):
    n = SEATS[nm[1]]
    w = n * PER + 0.12
    c = Vector((x + w / 2, 0, z - 0.6))
    b = box("Step %s" % nm, (w, 0.8, 0.22), SOLID[nm[1]], L + c)
    appear(b, sec(0.6 + 0.5 * k), dur=8)
    step_ob[nm] = b
    step_lbl[nm] = big("Lbl Step %s" % nm, nm, L + c + Vector((0, -0.6, -0.42)), 0.9 + 0.5 * k, None, mat=TXT[nm[1]],
                       size=0.4)
    seat_at[nm] = [L + Vector((x + 0.06 + PER * (j + 0.5), -0.05, z - 0.6 + 0.11 + 0.11)) for j in range(n)]
    x += w + GAP
ea = arrow("Energy Up", 4.2, V4_GOLD, None, L + Vector((X0 - 0.7, 0, -0.9)), (0, -math.pi / 2, 0), r=0.04, head=0.28)
appear(ea, sec(3.8), sec(47.8))
big("Lbl Energy", "energy", L + Vector((X0 - 0.7, -0.6, 3.6)), 4.0, 47.8, mat=M["gold"], size=0.4)
say("A1", "Sub-shells, lowest energy at the bottom", 0.3, 5.0)
pulse(step_ob["4s"], 5.4, 1.15)
pulse(step_ob["3d"], 6.2, 1.15)
say("A2", "4s sits below 3d", 5.0, 8.0)

# ---- lowest first: an electron tries 2p while 1s is empty, slides back down into 1s ----
cheeky = electron("Cheeky", None, seat_at["1s"][0], 0.11, mat=V4_GOLD)
up = seat_at["2p"][2] + Vector((0, 0, 0.25))
start = L + Vector((X0 + 0.4, -0.05, 4.4))
hide_until(cheeky, sec(8.6))
kf(cheeky, "location", sec(8.6), start, 'BEZIER')
kf(cheeky, "location", sec(9.6), up, 'BEZIER')
kf(cheeky, "location", sec(10.4), up, 'BEZIER')
big("Lbl No", "✗", up + Vector((0.1, -0.6, 0.55)), 10.0, 11.4, mat=M["red"], size=0.7)
land(cheeky, 11.0, dur=1.2, frm=up, tmat=V4_TRAIL)
kf(cheeky, "scale", sec(8.6), tuple(cheeky.scale), 'CONSTANT')     # visible from 8.6 (land hid it until 11.0)
hide_from(cheeky, sec(15.8))
say("B1", "Electrons fill the lowest step first", 8, 13)
say("B2", "This is the Aufbau principle", 13, 16)

# ---- potassium: 19 electrons wait, then fill from the bottom; the 19th looks at 3d and drops into 4s ----
heap = [L + Vector((2.6 + 0.3 * (m % 5), -0.05, -0.75 + 0.3 * (m // 5))) for m in range(19)]
order = [("1s", 0), ("1s", 1), ("2s", 0), ("2s", 1)] + [("2p", j) for j in range(6)] + [("3s", 0), ("3s", 1)] + \
        [("3p", j) for j in range(6)]
els = []
for m in range(19):
    if m < 18:
        nm, j = order[m]
        e = electron("K e%02d" % m, None, seat_at[nm][j], 0.1)
        t = 21.0 + 0.42 * m
        land(e, t, dur=0.7, frm=heap[m], tmat=V4_BLUE_TRAIL)
    else:
        e = electron("K e18", None, seat_at["4s"][0], 0.11, mat=V4_GOLD)
        hover = seat_at["3d"][4] + Vector((0, 0, 0.35))
        land(e, 33.6, dur=1.3, frm=hover, tmat=V4_TRAIL)
        kf(e, "location", sec(30.2), heap[m], 'BEZIER')
        kf(e, "location", sec(31.2), hover, 'BEZIER')
        kf(e, "location", sec(33.6), hover, 'BEZIER')
        big("Lbl No 3d", "✗ higher", hover + Vector((-1.3, -0.6, 0.2)), 31.6, 33.4, mat=M["red"], size=0.42)
    kf(e, "location", sec(16.4), heap[m], 'CONSTANT')
    kf(e, "scale", 0, (0, 0, 0), 'CONSTANT')
    kf(e, "scale", sec(16.4), (0, 0, 0), 'CONSTANT')
    kf(e, "scale", sec(16.4) + 6, tuple(e.scale), 'BEZIER')
    hide_from(e, sec(47.8))
    els.append(e)
pulse(step_ob["4s"], 34.9, 1.15)
big("Lbl K", "K", L + Vector((4.4, -0.6, -0.3)), 16.4, 29.6, mat=M["white"], size=0.6)
big("Lbl Cfg", "1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹", L + Vector((0, -0.6, 4.5)), 39.2, 47.8, mat=M["gold"], size=0.5)
say("C1", "Potassium has 19 electrons", 16, 20.6)
say("C2", "Each takes the lowest free seat", 20.6, 29.8)
say("C3", "The 19th: 3d or 4s?", 29.8, 34.6)
say("C4", "4s is lower, so it goes there", 34.6, 39)
say("C5", "Potassium's configuration", 39, 48)

# ---- the diagonal rule: coloured tiles; each arrow (behind the tiles, seen in the gaps) is drawn, then a gold ball runs along it ----
shot("Cam Chart", 48, None, D + Vector((2.4, 0, -0.25)), dist=17, drift=0.15)
ROWS = {1: "s", 2: "sp", 3: "spd", 4: "spdf", 5: "spdf", 6: "spd", 7: "sp"}
CX, CY = 1.6, 0.85
cells, tiles = {}, {}
for n, ls in ROWS.items():
    for li, l in enumerate(ls):
        nm = "%d%s" % (n, l)
        p = D + Vector((li * CX, 0, 3.3 - (n - 1) * CY))
        cells[nm] = p
        tl = box("Tile %s" % nm, (1.15, 0.2, 0.55), SOLID[l], p)
        appear(tl, sec(48.3 + 0.15 * n + 0.05 * li), dur=8)
        tiles[nm] = tl
        big("Cell %s" % nm, nm, p + Vector((0, -0.6, 0)), 48.4 + 0.15 * n + 0.05 * li, None, mat=M["white"], size=0.42)
DIAG = [["1s"], ["2s"], ["2p", "3s"], ["3p", "4s"], ["3d", "4p", "5s"], ["4d", "5p", "6s"], ["4f", "5d", "6p", "7s"]]
T_AR, STEP_D = 51.0, 1.7
for k, d in enumerate(DIAG):
    a, b = cells[d[0]], cells[d[-1]]
    u = (b - a).normalized() if len(d) > 1 else Vector((-CX, 0, -CY)).normalized()
    p0, p1 = a - u * 0.55, b + u * 0.75
    ar = arrow("Diag %d" % k, (p1 - p0).length, V4_GOLD, None, p0 + Vector((0, 0.35, 0)), (0, math.atan2(-u.z, u.x), 0),
               r=0.045, head=0.26)
    t = T_AR + STEP_D * k
    kf(ar, "scale", 0, (0, 1, 1), 'CONSTANT')
    kf(ar, "scale", sec(t), (0, 1, 1), 'BEZIER')
    kf(ar, "scale", sec(t) + 12, (1, 1, 1), 'BEZIER')
    for i, nm in enumerate(d):                       # the gold ball reaches each tile in turn: the tile swells
        pulse(tiles[nm], t + 0.45 + 0.3 * i, 1.3, dur=12)
    gold_fly("Runner %d" % k, a - u * 0.3 + Vector((0, -0.3, 0)), b + u * 0.3 + Vector((0, -0.3, 0)), t + 0.3,
             dur=0.35 + 0.3 * len(d), lift=0.0, r=0.11, lag=10)
say("D1", "The diagonal rule", 48, T_AR)
say("D2", "Follow the arrows: the filling order", T_AR, None)
scene["ar_range"] = [sec(48), scene.frame_end]
finish_film()
