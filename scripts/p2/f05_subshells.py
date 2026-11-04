# ---- Film 05 (v4 "show, don't tell"): Shells and sub-shells s, p, d, f (textbook pp.49-50, Fig 2.8, Table 2.3) ----
# Book p.49: the electron revolves round the nucleus in a fixed shell; "a subshell is the area in which electron moves
# within a shell". Beats: a shell (Bohr ring) · inside it the electron moves in laps that slowly tilt (an area) · the
# laps fill a ball = a sub-shell · bigger shell, bigger area · s ball, p dumbbell, d clover, f complicated (one at a
# time, each traced by its electron) · Fig 2.8 row · p = three dumbbells · an orbital holds 2 → s 2, p 6, d 10, f 14 ·
# floors: K 1s = 2, L 2s + 2p = 8, M = 18, N = 32 (Table 2.3). One caption line per beat. Old v2: backups/.
# bsend.py common.py p2/lib.py u3/u3lib.py v4lib.py p2/f05_subshells.py
import bmesh
start_film("05", "05 Sub-shells s p d f", 128.0)
for name, t in (("Shell and area", 0), ("s p d f", 35), ("Three p orbitals", 68), ("2 per orbital", 80),
                ("Floors (Table 2.3)", 101)):
    act(name, sec(t))
rc = random.Random(11)
COL = {"s": (0.30, 0.62, 1.0), "p": (0.30, 1.0, 0.55), "d": (1.0, 0.62, 0.25), "f": (0.78, 0.45, 1.0)}
SKIN = {k: mat_emit("Area %s" % k, c, 1.0, 0.17) for k, c in COL.items()}      # the smooth area (Fig 2.8 look)
TRL = {k: mat_emit("Lap Trail %s" % k, c, 2.6) for k, c in COL.items()}        # the electron's trail
SOLID = {k: gloss("Sub Block %s" % k, tuple(0.55 * x for x in c)) for k, c in COL.items()}
TXT = {k: mat_emit("Sub Txt %s" % k, c, 3.0) for k, c in COL.items()}
R2 = 1.6


def shell_point(R, k=6, rmax=None):                # a point of an s area round shell distance R
    rmax = rmax or 1.6 * R + 0.3
    while True:
        r = rc.gammavariate(k, R / (k - 1))
        if r < rmax:
            return Vector((rc.gauss(0, 1), rc.gauss(0, 1), rc.gauss(0, 1))).normalized() * r


class Laps:
    """Book p.49: the electron revolves round the nucleus in its shell and moves within its sub-shell's area. So it
    goes round and round; each lap a little tilted and a little bigger or smaller, so the laps fill the area. s: laps
    round the nucleus. p: laps inside one lobe; now and then the loop shrinks and is carried close by the side of the
    nucleus to the other lobe. Never touches the nucleus. run(frames, w) = one position per frame (w = radians/s)."""

    def __init__(self, sample=None, lobes=None, c=0.0, rho=0.0, avoid=0.3, stretch=0.35, n=(0, 1, 0), u=(1, 0, 0),
                 r=None, calm=0.0):
        self.sample, self.lobes, self.c, self.rho, self.avoid, self.stretch = sample, lobes, c, rho, avoid, stretch
        self.n, self.u = Vector(n).normalized(), Vector(u).normalized()
        self.th, self.lobe, self.left, self.mv = 0.0, 0, 2 + 3 * rc.random(), None
        self.r = r if r is not None else self.pick()
        self.rT = self.r if calm else self.pick()
        self.calm = calm                              # seconds of plain Bohr laps first (no tilt, no size change)
        self.C = Vector(lobes[0]) * c if lobes else Vector((0, 0, 0))

    def pick(self):
        if self.lobes:
            return self.rho * (0.3 + 0.7 * rc.random())
        return max(self.sample().length, self.avoid + 0.08)

    def run(self, frames, w):
        out = []
        for _ in range(frames):
            dth = w / 30.0
            self.th += dth
            if self.calm > 0:
                self.calm -= 1 / 30.0
            else:
                self.r += (self.rT - self.r) * min(1.0, dth * 0.6)
                if abs(self.rT - self.r) < 0.02 * (self.rho or 1):
                    self.rT = self.pick()
                d = Vector((rc.gauss(0, 1), rc.gauss(0, 1), rc.gauss(0, 1))).normalized() * dth * 0.3
                self.n = (self.n + d).normalized()
            self.u = (self.u - self.n * self.u.dot(self.n)).normalized()
            v = self.n.cross(self.u)
            k = 1.0
            if self.lobes and len(self.lobes) > 1:
                self.left -= dth / (2 * math.pi)
                if self.left <= 0 and not self.mv:
                    nx = (self.lobe + 1 + rc.randrange(len(self.lobes) - 1)) % len(self.lobes)
                    a, b = Vector(self.lobes[self.lobe]), Vector(self.lobes[nx])
                    mid = a.cross(Vector((0, 1, 0))).normalized() if a.dot(b) < -0.5 else None
                    self.mv, self.lobe = [a, b, mid, 0.0], nx
                if self.mv:
                    a, b, mid, t = self.mv
                    t = min(1.0, t + dth / (3 * math.pi))
                    self.mv[3] = t
                    s_ = t * t * (3 - 2 * t)
                    d = (a.lerp(mid, s_ * 2) if s_ < 0.5 else mid.lerp(b, s_ * 2 - 1)) if mid else a.lerp(b, s_)
                    wv = math.sin(math.pi * s_)
                    self.C = d.normalized() * self.c * (1 - 0.62 * wv)
                    k = 1 - 0.85 * wv
                    if t >= 1:
                        self.mv, self.left = None, 2 + 3 * rc.random()
            q = (self.u * math.cos(self.th) + v * math.sin(self.th)) * self.r * k
            if self.lobes:
                dd = self.C.normalized()
                q = q + dd * q.dot(dd) * self.stretch
            q = q + self.C
            if q.length < self.avoid:
                q = q.normalized() * self.avoid
            out.append(q.copy())
        return out


def nuc(key, grp, r=0.09):
    return nucleus("%s Nuc" % key, 2, 2, grp, r=r, seed=3)


def ring_up(key, grp, r, t, mat=None):
    """A Bohr ring facing the camera (ring_curve lies in XY; the holder turns it up into XZ)."""
    h = empty("%s Holder" % key, (0, 0, 0), grp, rot=(90 * DEG, 0, 0))
    rg = ring_curve("%s Ring" % key, r, mat or M["orbit"], h)
    appear(rg, sec(t), dur=10)
    return h, rg


def lap_trail(key, e, grp, path, f0, mat, depth=0.011):
    """Key the electron along path (one key per frame from f0); its glowing trail stays and fills the area."""
    for k, q in enumerate(path):
        kf(e, "location", f0 + k, q, 'LINEAR')
    tr = pcurve("%s Trail" % key, path, mat, depth=depth, cname="Models", parent=grp)
    cu = tr.data
    kf(cu, "bevel_factor_end", 0, 0.0, 'CONSTANT')
    kf(cu, "bevel_factor_end", f0, 0.0, 'LINEAR')
    kf(cu, "bevel_factor_end", f0 + len(path) - 1, 1.0, 'LINEAR')
    tr["trail_of"] = e.name
    return tr


def lobes(name, dirs, c, h, w, mat, parent):
    """Smooth area: one soft ellipsoid lobe per direction (half-length h along it, half-width w), centre at c."""
    bm = bmesh.new()
    for d in dirs:
        d = Vector(d).normalized()
        q = d.to_track_quat('Z', 'Y').to_matrix().to_4x4()
        bmesh.ops.create_uvsphere(bm, u_segments=28, v_segments=14, radius=1.0,
                                  matrix=Matrix.Translation(d * c) @ q @ Matrix.Diagonal((w, w, h, 1)))
    ob = mesh_from_bm(name, bm, mat, parent=parent)
    for pl in ob.data.polygons:
        pl.use_smooth = True
    return ob


def ball_skin(name, r, mat, parent):
    s = sphere(name, r, mat, (0, 0, 0), parent, 32, 16)
    return s


# ---- the shapes (Fig 2.8), facing the camera: p along z, d in the picture plane, f = complicated (8 lobes) ----
D_P = [(0, 0, 1), (0, 0, -1)]
D_D = [(1, 0, 1), (-1, 0, 1), (1, 0, -1), (-1, 0, -1)]
D_F = [(sx, sy, sz) for sx in (1, -1) for sy in (1, -1) for sz in (1, -1)]
SHAPE = {"p": (D_P, 0.95, 0.85, 0.6, 0.48), "d": (D_D, 1.05, 0.75, 0.42, 0.34), "f": (D_F, 1.05, 0.62, 0.33, 0.27)}


def area(key, sub, grp, t_skin, t_e, t_end, w=8.0, scale=1.0, s_r=1.45):
    """A sub-shell area in grp: its electron moves in laps from t_e (trail fills the shape), the smooth skin pops in
    at t_skin. Returns the electron."""
    if sub == "s":
        sk = ball_skin("%s Skin" % key, s_r * scale, SKIN["s"], grp)
        L = Laps(sample=lambda: shell_point(0.85 * s_r * scale, 6, 1.0 * s_r * scale), avoid=0.25)
    else:
        dirs, c, h, ww, rho = SHAPE[sub]
        sk = lobes("%s Skin" % key, dirs, c * scale, h * scale, ww * scale, SKIN[sub], grp)
        L = Laps(lobes=[Vector(d).normalized() for d in dirs], c=c * scale, rho=rho * scale, avoid=0.25, stretch=0.4)
    appear(sk, sec(t_skin), dur=14, s=tuple(sk.scale))
    f0, f1 = sec(t_e), sec(t_end)
    path = L.run(f1 - f0, w)
    e = electron("%s e" % key, grp, path[0], 0.11)
    appear(e, f0, f1, s=tuple(e.scale))
    lap_trail(key, e, grp, path, f0, TRL[sub], 0.009)
    return e


A, KLM, SS, SP, SD, SF, ROW, P3, CAPS, FL = [Vector((40 * k, 0, 0)) for k in range(10)]

# ---- 1. a shell: a fixed path with a fixed energy (book p.49) ----
shot("Cam Shell", 0, 9, A + Vector((0, 0, -0.4)), dist=9.5, drift=0.2)
shot("Cam Area", 9, 27, A + Vector((0, 0, -0.7)), dist=13, drift=0.25)
g1 = empty("Shell L", A)
appear(g1, sec(0.3), sec(26.8), dur=8)
nuc("Shell L", g1)
h1, rg1 = ring_up("Shell L", g1, R2, 0.6)
piv = empty("Orbit Piv", (0, 0, 0), h1)
spin(piv, sec(0.8), sec(9.0), 2.0)
eo = electron("Orbiter", piv, (R2, 0, 0), 0.12)
appear(eo, sec(0.8), sec(9.0), s=tuple(eo.scale))
big("Lbl L", "shell L", A + Vector((R2 + 0.35, -0.6, 0.35)), 1.4, 21.0, mat=M["cyan"], size=0.42, align='LEFT')
say("A1", "A shell: a fixed path", 0.2, 9)

# ---- 2. inside it the electron moves in an area: laps that slowly tilt (trail stays) ----
LS = Laps(sample=lambda: shell_point(R2, 6, 2.1), r=R2, calm=2.0)
slow = LS.run(sec(19.0) - sec(9.2), 2.6)
fast = LS.run(sec(24.6) - sec(19.0), 8.0)
ew = electron("Wanderer", g1, slow[0], 0.12)
appear(ew, sec(9.2), sec(24.6), s=tuple(ew.scale))
lap_trail("Wander", ew, g1, slow + fast, sec(9.2), TRL["s"], 0.01)
hide_from(rg1, sec(21.0))
bs = ball_skin("Ball Area", 2.15, SKIN["s"], g1)
appear(bs, sec(23.4), dur=14, s=tuple(bs.scale))
say("B1", "Inside it, the electron moves in an area", 9, 19)
say("B2", "That area is a sub-shell", 19, 27)

# ---- 3. bigger shell, bigger area: K, L, M side by side ----
shot("Cam KLM", 27, 35, KLM + Vector((-0.6, 0, -0.5)), dist=15, drift=0.25)
for k, (r, x) in enumerate(((0.5, -4.6), (0.95, -1.7), (1.5, 2.4))):
    t = 27.3 + 1.4 * k
    gk = empty("Size %s" % "KLM"[k], KLM + Vector((x, 0, 0)))
    appear(gk, sec(t), sec(34.8), dur=8)
    nuc("Size %s" % "KLM"[k], gk, 0.07)
    area("Size %s" % "KLM"[k], "s", gk, t + 2.2, t + 0.3, 34.6, w=8.0, s_r=r * 1.25)
    big("Lbl Size %s" % "KLM"[k], "KLM"[k], KLM + Vector((x, -0.6, -r * 1.25 - 0.55)), t + 0.4, 34.6, mat=M["cyan"],
        size=0.5)
say("C1", "Bigger shell, bigger area", 27, 35)

# ---- 4. the four shapes, one at a time, each traced by its electron (Fig 2.8) ----
for sub, loc, t0, t1, word, head in (("s", SS, 35, 41, "sharp", "s: a ball"), ("p", SP, 41, 48, "principal", "p: a dumbbell"),
                                     ("d", SD, 48, 55, "diffused", "d: a clover"),
                                     ("f", SF, 55, 61, "fundamental", "f: a complicated shape")):
    shot("Cam %s" % sub, t0, t1, loc + Vector((0, 0, -0.5)), dist=10, drift=0.2)
    g = empty("Shape %s" % sub, loc)
    appear(g, sec(t0 + 0.2), sec(t1 - 0.2), dur=8)
    nuc("Shape %s" % sub, g)
    area("Shape %s" % sub, sub, g, t0 + 3.2, t0 + 0.5, t1 - 0.3, w=8.0)
    top = 2.25 if sub != "s" else 1.85
    big("Lbl %s" % sub, sub, loc + Vector((-2.4, -0.6, 0.9)), t0 + 0.4, t1 - 0.2, mat=TXT[sub], size=1.0)
    big("Lbl %s w" % sub, word, loc + Vector((-2.4, -0.6, 0.15)), t0 + 1.0, t1 - 0.2, mat=M["white"], size=0.36)
    say("D " + sub, head, t0, t1)

# ---- 5. Fig 2.8 as a row: s, p, d, f ----
shot("Cam Row", 61, 68, ROW + Vector((0, 0, -0.6)), dist=15, drift=0.25)
for k, sub in enumerate("spdf"):
    gk = empty("Row %s" % sub, ROW + Vector((-5.1 + 3.4 * k, 0, 0)))
    appear(gk, sec(61.3 + 0.5 * k), sec(67.8), dur=10)
    nuc("Row %s" % sub, gk, 0.06)
    if sub == "s":
        ball_skin("Row s Skin", 1.2, SKIN["s"], gk)
    else:
        dirs, c, h, ww, rho = SHAPE[sub]
        lobes("Row %s Skin" % sub, dirs, c * 0.8, h * 0.8, ww * 0.8, SKIN[sub], gk)
    big("Lbl Row %s" % sub, sub, ROW + Vector((-5.1 + 3.4 * k, -0.6, -2.1)), 61.6 + 0.5 * k, 67.8, mat=TXT[sub],
        size=0.7)
say("E1", "Fig 2.8: s, p, d, f", 61, 68)

# ---- 6. p has three dumbbells: along z, then x, then y (seen from a little above) ----
shot("Cam P3", 68, 76, P3 + Vector((0, 0, -0.2)), dist=11, pitch=0.35, drift=0.25)
g6 = empty("P Three", P3)
appear(g6, sec(68.2), sec(75.8), dur=8)
nuc("P Three", g6)
PSH = [mat_emit("P Area %d" % k, c, 1.1, 0.26) for k, c in enumerate(((0.3, 1.0, 0.55), (0.55, 1.0, 0.3), (0.3, 0.9, 0.85)))]
for k, (d, nm, t) in enumerate((((0, 0, 1), "z", 68.6), ((1, 0, 0), "x", 70.6), ((0, 1, 0), "y", 72.6))):
    dv = Vector(d)
    lb = lobes("P3 %s" % nm, [dv, -dv], 0.95, 0.85, 0.5, PSH[k], g6)
    appear(lb, sec(t), dur=14)
    big("Lbl P3 %s" % nm, "p" + nm, P3 + dv * 2.25 + Vector((0, -0.6, 0.2 if nm != "z" else 0.0)), t + 0.5, 75.8,
        mat=TXT["p"], size=0.42)
say("F1", "p has three dumbbells", 68, 76)

# ---- 7. one orbital holds 2 electrons: s 1 box → 2, p 3 → 6, d 5 → 10, f 7 → 14 ----
shot("Cam Caps", 76, 97, CAPS + Vector((0.6, 0, -0.1)), dist=12.5, drift=0.25)
SEAT_BOX = gloss("Orbital Box", (0.08, 0.1, 0.16), 0.3)
for r_, (sub, n, t0, t1, head) in enumerate((("s", 1, 76, 83, "One orbital holds 2 electrons"), ("p", 3, 83, 88, "p: 3 orbitals hold 6"),
                                             ("d", 5, 88, 93, "d: 5 orbitals hold 10"), ("f", 7, 93, 97, "f: 7 orbitals hold 14"))):
    z = 1.75 - 1.1 * r_
    big("Cap Lbl %s" % sub, sub, CAPS + Vector((-3.4, -0.6, z - 0.05)), t0 + 0.2, 96.8, mat=TXT[sub], size=0.7)
    gap = (t1 - t0 - 2.4) / max(1, n)
    for j in range(n):
        x = -2.5 + 0.78 * j
        loc = CAPS + Vector((x, 0, z))
        b = box("Orb %s%d" % (sub, j), (0.66, 0.3, 0.6), SOLID[sub], loc)
        appear(b, sec(t0 + 0.3 + 0.12 * j), sec(96.8), dur=8)
        for s_ in (-1, 1):
            e = electron("Orb %s%d e%d" % (sub, j, s_), None, loc + Vector((0.15 * s_, -0.25, 0)), 0.1)
            land(e, t0 + 1.0 + gap * j + (0.25 if s_ > 0 else 0), dur=0.6, frm=loc + Vector((0.15 * s_, -0.25, 1.4)))
            hide_from(e, sec(96.8))
    big("Cap Sum %s" % sub, str(2 * n), CAPS + Vector((-2.5 + 0.78 * n + 0.1, -0.6, z - 0.05)), t1 - 1.0, 96.8,
        mat=M["gold"], size=0.6, align='LEFT')
    say("G " + sub, head, t0, t1)

# ---- 8. floors: each shell is a floor, its sub-shells are rooms: K 2, L 2 + 6, M 2 + 6 + 10, N … = 32 ----
shot("Cam Floors", 97, None, FL + Vector((0.5, 0, -0.4)), dist=17, drift=0.25)
SLAB = gloss("Floor Slab", (0.28, 0.3, 0.36), 0.4)
ORB = {"s": 1, "p": 3, "d": 5, "f": 7}
for n, (t0, t1, head, tot) in enumerate(((97, 101, "K: 1s holds 2", "2"), (101, 106, "L: 2s + 2p = 8", "2 + 6 = 8"),
                                          (106, 112, "M: 3s + 3p + 3d = 18", "2 + 6 + 10 = 18"),
                                          (112, 118, "N: 4s + 4p + 4d + 4f = 32", "2 + 6 + 10 + 14 = 32")), start=1):
    z = -1.7 + 1.2 * (n - 1)
    subs = "spdf"[:n]
    x = -4.3
    widths = [ORB[c] * 0.5 for c in subs]
    tw = sum(widths) + 0.12 * (n - 1)
    slab = box("Slab %d" % n, (tw + 0.3, 0.8, 0.08), SLAB, FL + Vector((x + tw / 2, 0, z - 0.42)))
    appear(slab, sec(t0 + 0.2), dur=8)
    big("Lbl Floor %d" % n, SHELL_NAMES[n - 1], FL + Vector((x - 0.6, -0.6, z)), t0 + 0.3, None, mat=M["cyan"], size=0.5,
        align='RIGHT')
    for j, (c, wdt) in enumerate(zip(subs, widths)):
        cx = x + wdt / 2
        rb = box("Room %d%s" % (n, c), (wdt - 0.04, 0.6, 0.72), SOLID[c], FL + Vector((cx, 0, z)))
        appear(rb, sec(t0 + 0.6 + 0.5 * j), dur=8)
        big("Lbl Room %d%s" % (n, c), "%d%s" % (n, c), FL + Vector((cx, -0.7, z)), t0 + 0.8 + 0.5 * j, None,
            mat=M["white"], size=0.34)
        x += wdt + 0.12
    big("Lbl Tot %d" % n, tot, FL + Vector((x + 0.25, -0.6, z)), t0 + 0.9 + 0.5 * n, None, mat=M["gold"], size=0.42,
        align='LEFT')
    say("H %d" % n, head, t0, t1)
say("H T", "Table 2.3: sub-shells of each shell", 118, None)
scene["ar_range"] = [sec(55), sec(61) - 1]
finish_film()
