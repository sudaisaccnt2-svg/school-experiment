# ---- Unit 6 (Solutions) helpers. Append after u5/u5lib.py:
#   python scripts/bsend.py scripts/common.py scripts/p2/lib.py scripts/u3/u3lib.py scripts/u4/u4lib.py scripts/u5/u5lib.py scripts/u6/u6lib.py scripts/u6/f601_solutions.py
# Pictures: solvent = small blue balls, solute = gold balls (Fig 6.1), ions purple (+) / green (−). A crystal is a
# neat block of balls that leave one by one and wander into the liquid (= dissolving). Moles = gold marbles.
SOLV = MOL["air"]
SOLU = MOL["gold"]
ION_P = mat_emit("Ion Plus U6", (0.65, 0.35, 1.0), 1.6)
ION_N = mat_emit("Ion Minus U6", (0.3, 1.0, 0.45), 1.3)
BLUE_SOL = mat_emit("CuSO4 Blue", (0.1, 0.45, 1.0), 0.9, alpha=0.45)
GLASS_FILL = mat_emit("Glass Fill U6", (0.55, 0.75, 1.0), 0.25, alpha=0.08)
BEAM = mat_emit("Light Beam", (1.0, 0.95, 0.7), 4.0, alpha=0.6)
MUD = mat_pbr("Mud", (0.32, 0.2, 0.1), roughness=0.9)
MILK = mat_emit("Milk White", (0.92, 0.92, 0.88), 0.5, alpha=0.85)


def beaker(key, c, r, h, h_liq, t_in, mat=None, liq_mat=None):
    """An open glass beaker (base at c) with liquid up to h_liq. Returns (glass group, liquid)."""
    c = Vector(c)
    g = jar(key + " Beaker", r, h, c, mat=mat)
    appear(g, sec(t_in), dur=10)
    lq = None
    if h_liq > 0:
        lq = liquid(key + " Liquid", r * 0.97, h_liq, c, liq_mat or WATER)
        appear(lq, sec(t_in + 0.2), dur=10)
    return g, lq


def inside(c, r, h_liq, depth=0.45, z0=0.02):
    """lo / hi of the box the particles wander in, inside a beaker of radius r (base c)."""
    c = Vector(c)
    return c + Vector((-r * 0.82, -depth, z0)), c + Vector((r * 0.82, depth, h_liq))


def dissolve(name, seats, lo, hi, t0, t_go, t1, r=0.14, mat=None, speed=0.9, seed=1, f_in=None, gap=0.35, drop=None,
             t_land=None):
    """Particles sit in a neat crystal (seats, world points) from t0 and leave one by one, outermost first: particle
    k leaves at t_go + gap*k (or t_go[k] if a list), then wanders in lo..hi until t1. drop = offset the crystal
    starts at (it falls into place by t_land). Returns the objects."""
    seats = [Vector(s) for s in seats]
    n = len(seats)
    if isinstance(t_go, (list, tuple)):
        times = list(t_go)
        order = list(range(n))
    else:
        mid = sum(seats, Vector()) / n
        order = sorted(range(n), key=lambda i: (-seats[i].z, -(seats[i] - mid).length))
        times = [t_go + gap * k for k in range(n)]
    out = [None] * n
    for k, i in enumerate(order):
        tk = times[k]
        ph = [("to", seats[i], tk), ("box", lo, hi, t1, speed)]
        start = seats[i]
        if drop is not None:
            start = seats[i] + Vector(drop)
            ph = [("to", seats[i], t_land)] + ph
        out[i] = life("%s %d" % (name, i), start, t0, ph, r=r, mat=mat or SOLU, seed=seed * 50 + i, f_in=f_in)
    return out


def marbles(name, n, c, t0, gap=0.42, cols=5, r=0.17, mat=None, step=0.12, parent=None):
    """n gold marbles (= moles) in neat rows from c (bottom-left), popping in one by one. Returns them."""
    out = []
    c = Vector(c)
    for k in range(n):
        p = c + Vector(((k % cols) * gap, 0, (k // cols) * gap))
        m = sphere("%s %d" % (name, k), r, mat or SOLU, p, parent, 16, 8)
        appear(m, sec(t0 + step * k), s=(r,) * 3)
        out.append(m)
    return out


def flask(key, c, R=1.2, neck=1.8, t_in=0.0, fill=None, mark=True):
    """Volumetric flask (Activity 6.1): round bulb (centre above c by R) + long neck with a mark ring.
    fill = material for the liquid (None = empty). Returns (group, liquid bulb or None, neck liquid or None)."""
    c = Vector(c)
    g = empty(key + " Flask", c)
    zc = R
    ring_curve(key + " Eq", R, GLASS, g, 0.03, 96, loc=(0, 0, zc))
    ring_curve(key + " Side", R, GLASS, g, 0.03, 96, loc=(0, 0, zc)).rotation_euler = (math.pi / 2, 0, 0)
    sphere(key + " Shell", R, GLASS_FILL, (0, 0, zc), g, 32, 16)
    nr = R * 0.22
    for k, x in enumerate((-nr, nr)):
        pcurve("%s Neck %d" % (key, k), [(x, 0, zc + R * 0.97), (x, 0, zc + R + neck)], GLASS, 0.03, "Models", parent=g)
    ring_curve(key + " Lip", nr, GLASS, g, 0.03, 48, loc=(0, 0, zc + R + neck))
    if mark:
        ring_curve(key + " Mark", nr * 1.05, M["white"], g, 0.02, 48, loc=(0, 0, zc + R + neck * 0.55))
    appear(g, sec(t_in), dur=10)
    lb = ln = None
    if fill is not None:
        lb = sphere(key + " Liq", R * 0.95, fill, (0, 0, zc), g, 32, 16)
        ln = cyl(key + " Liq Neck", nr * 0.9, nr * 0.9, neck * 0.55 + R * 0.05, fill, (0, 0, zc + R * 0.92), g,
                 base=True, segs=24)
    return g, lb, ln


def beam(name, a, b, t0, t1=None, r=0.06, mat=None):
    """A straight light beam from a to b (a glowing rod)."""
    a, b = Vector(a), Vector(b)
    d = b - a
    rot = d.to_track_quat('Z', 'Y').to_euler()
    o = cyl(name, r, r, d.length, mat or BEAM, (a + b) / 2, None, rot, segs=16)
    hide_until(o, sec(t0))
    if t1 is not None:
        hide_from(o, sec(t1))
    return o


def torch(name, loc, t0, aim=(1, 0, 0)):
    """A small torch (box + lens) pointing along aim."""
    g = empty(name, loc)
    box(name + " Body", (0.9, 0.4, 0.4), METAL, (-0.45, 0, 0), g)
    cyl(name + " Lens", 0.26, 0.26, 0.08, mat_emit("Torch Lens", (1.0, 0.95, 0.75), 5.0), (0.02, 0, 0), g,
        rot=(0, math.pi / 2, 0))
    d = Vector(aim)
    g.rotation_euler = (0, -math.atan2(d.z, d.x), 0)
    appear(g, sec(t0), dur=10)
    return g


def water(name, loc, t0, scale=0.5, rot=(0, 0, 0), parent=None):
    """A small bent water molecule (CPK)."""
    g, _ = bstick(name, [("O", (0, 0, 0)), ("H", (-0.76, 0, -0.59)), ("H", (0.76, 0, -0.59))],
                  [(0, 1, 1), (0, 2, 1)], loc, t0, scale=scale, parent=parent)
    g.rotation_euler = rot
    return g


def scale_bal(key, c, t0, reading, size=0.42, t1=None):
    """A digital balance (base at c) with its reading as a world label in front."""
    c = Vector(c)
    g = empty(key + " Balance", c)
    box(key + " Base", (2.4, 1.4, 0.5), DARK, (0, 0, 0.25), g)
    cyl(key + " Pan", 0.95, 0.95, 0.06, METAL, (0, 0, 0.53), g, segs=40)
    box(key + " Screen", (1.0, 0.04, 0.26), mat_emit("Balance Screen", (0.08, 0.35, 0.15), 1.5), (0, -0.71, 0.27), g)
    appear(g, sec(t0), dur=10)
    lbl = big(key + " Read", reading, c + Vector((0, -0.95, 0.27)), t0 + 0.4, t1, mat=M["green"], size=size)
    return g, lbl


def cylinder_glass(key, c, r, h, h_liq, t_in, liq_mat=None, ticks=5):
    """A measuring cylinder (thin tall jar) with tick marks."""
    g, lq = beaker(key, c, r, h, h_liq, t_in, liq_mat=liq_mat)
    for k in range(1, ticks + 1):
        z = h * k / (ticks + 1)
        pcurve("%s Tick %d" % (key, k), [(-r, -0.02, z), (-r + 0.25, -0.02, z)], M["white"], 0.012, "Models", parent=g)
    return g, lq


def stack_bars(name, base, vals, w, t0, mat, scale=1.0, gap=None, step=0.3, labels=None, lsize=0.42):
    """Bars standing on base (left end), heights vals*scale, popping in one by one; optional labels under them."""
    base = Vector(base)
    gap = gap or w * 1.6
    out = []
    for k, v in enumerate(vals):
        b = cyl("%s %d" % (name, k), w / 2, w / 2, max(0.01, v * scale), mat if not isinstance(mat, list) else mat[k],
                base + Vector((k * gap, 0, 0)), None, base=True, segs=24)
        b.scale = (1, 1, 0.001)
        kf(b, "scale", sec(t0 + step * k), (1, 1, 0.001))
        kf(b, "scale", sec(t0 + step * k + 1.0), (1, 1, 1))
        if labels:
            big("%s L%d" % (name, k), labels[k], base + Vector((k * gap, -0.6, -0.45)), t0 + step * k, None, size=lsize)
        out.append(b)
    return out
