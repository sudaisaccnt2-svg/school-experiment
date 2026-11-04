# ---- Unit 5 (Physical States of Matter) helpers. Append after u4/u4lib.py:
#   python scripts/bsend.py scripts/common.py scripts/p2/lib.py scripts/u3/u3lib.py scripts/u4/u4lib.py scripts/u5/u5lib.py scripts/u5/f501_gases.py
# Pictures: molecules as glowing balls that move (gas: fast and far apart, liquid: close and sliding, solid: shaking in
# place), glass made of thin glowing edges (it reads in the web app), piston cylinders, dial gauges, thermometers and
# graphs whose line is drawn dot by dot (curve animation does not reach the web app).
import random

GLASS = mat_emit("Glass Edge", (0.55, 0.75, 1.0), 1.2)
MOL = {"air": mat_emit("Mol Air", (0.12, 0.42, 1.0), 1.5), "red": mat_emit("Mol Red", (1.0, 0.16, 0.1), 1.4),
       "gold": mat_emit("Mol Gold", (1.0, 0.62, 0.15), 1.5), "green": mat_emit("Mol Green", (0.25, 1.0, 0.35), 1.2),
       "brown": mat_emit("Mol Bromine", (0.8, 0.22, 0.05), 1.4), "white": mat_emit("Mol White", (0.85, 0.88, 1.0), 1.4),
       "purple": mat_emit("Mol Purple", (0.6, 0.25, 1.0), 1.5)}
for _m, _k in ((MOL["air"], ((0.12, 0.42, 1.0), 1.5)), (MOL["red"], ((1.0, 0.16, 0.1), 1.4)),
               (MOL["gold"], ((1.0, 0.62, 0.15), 1.5)), (MOL["green"], ((0.25, 1.0, 0.35), 1.2)),
               (MOL["brown"], ((0.8, 0.22, 0.05), 1.4)), (MOL["white"], ((0.85, 0.88, 1.0), 1.4)),
               (MOL["purple"], ((0.6, 0.25, 1.0), 1.5))):      # keep colours in step if the .blend has old ones
    _e = _m.node_tree.nodes.get("Emission")
    if _e:
        _e.inputs["Color"].default_value = (*_k[0], 1)
        _e.inputs["Strength"].default_value = _k[1]
WATER = mat_emit("Water Body 2", (0.15, 0.4, 0.9), 0.6, alpha=0.2)
HOT = mat_emit("Hot Red", (1.0, 0.25, 0.12), 3.0)
METAL = mat_pbr("Steel", (0.62, 0.64, 0.68), metallic=0.9, roughness=0.3)
DARK = mat_pbr("Dark Plate", (0.05, 0.06, 0.09), roughness=0.7)


def keys_bulk(ob, path, frames, values, interp='LINEAR'):
    """Many location/scale keys at once (kf() is slow for hundreds of keys)."""
    kf(ob, path, frames[0], values[0], interp)
    fcs = [fc for fc in _fcurves(ob) if fc.data_path == path]
    fcs.sort(key=lambda fc: fc.array_index)
    for fc in fcs:
        i = fc.array_index
        n0 = len(fc.keyframe_points)
        fc.keyframe_points.add(len(frames) - 1)
        for k, (f, v) in enumerate(zip(frames[1:], values[1:])):
            p = fc.keyframe_points[n0 + k]
            p.co = (f, v[i])
            p.interpolation = interp
        fc.update()


def box_edges(name, size, loc, mat=None, parent=None, depth=0.03, top=True):
    """A glass box drawn as its 12 glowing edges (open top if top=False). Returns an empty that holds them."""
    g = empty(name, loc, parent)
    sx, sy, sz = (s / 2 for s in size)
    c = [Vector((x, y, z)) for z in (-sz, sz) for y in (-sy, sy) for x in (-sx, sx)]
    loops = [[c[0], c[1], c[3], c[2], c[0]]] + ([[c[4], c[5], c[7], c[6], c[4]]] if top else [])
    for k, lp in enumerate(loops):
        pcurve("%s Loop %d" % (name, k), lp, mat or GLASS, depth, "Models", parent=g)
    for k in range(4):
        pcurve("%s Edge %d" % (name, k), [c[k], c[k + 4]], mat or GLASS, depth, "Models", parent=g)
    return g


def jar(name, r, h, loc, mat=None, parent=None, depth=0.03, top=False):
    """A glass cylinder (beaker / jar) from rings and side lines; its base sits at loc."""
    g = empty(name, loc, parent)
    for k, z in enumerate((0, h) if True else ()):
        ring_curve("%s Ring %d" % (name, k), r, mat or GLASS, g, depth, 96, loc=(0, 0, z))
    for k, a in enumerate((0, math.pi)):
        pcurve("%s Side %d" % (name, k), [(r * math.cos(a), 0, 0), (r * math.cos(a), 0, h)], mat or GLASS, depth,
               "Models", parent=g)
    if top:
        cyl(name + " Lid", r * 1.03, r * 1.03, 0.08, DARK, (0, 0, h + 0.04), g)
    return g


def liquid(name, r, h, loc, mat=None, parent=None):
    """The liquid inside a jar: a cylinder whose base sits at loc; animate its scale z to change the level."""
    return cyl(name, r, r, h, mat or WATER, loc, parent, base=True, segs=48)


def gas(name, n, lo, hi, t0, t1, speed=3.0, r=0.12, mat=None, parent=None, seed=1, step=0.3, pos=None, f_in=None,
        f_out=None, hits=None):
    """n molecules flying in straight lines and bouncing off the walls of the box lo..hi (local coords).
    lo / hi / speed may be functions of time t (piston moving, gas heated). pos: optional start points.
    hits: a list that collects (t, point, axis, side) for every bounce off a wall (for flashes).
    Returns the molecule objects (spheres; scale = r)."""
    rnd = random.Random(seed)
    lo_f = lo if callable(lo) else (lambda t, v=Vector(lo): v)
    hi_f = hi if callable(hi) else (lambda t, v=Vector(hi): v)
    sp_f = speed if callable(speed) else (lambda t, v=speed: v)
    out = []
    for i in range(n):
        a, b = lo_f(t0), hi_f(t0)
        p = Vector(pos[i]) if pos else Vector([a[j] + r + rnd.random() * max(0.01, b[j] - a[j] - 2 * r) for j in range(3)])
        d = Vector((rnd.uniform(-1, 1), rnd.uniform(-0.35, 0.35), rnd.uniform(-1, 1))).normalized()
        m = sphere("%s %d" % (name, i), r, mat or MOL["air"], p, parent, 12, 6)
        frames, vals, t = [], [], t0
        while True:
            frames.append(sec(t))
            vals.append(p.copy())
            if t >= t1:
                break
            t = min(t1, t + step)
            a, b = lo_f(t), hi_f(t)
            p = p + d * sp_f(t) * step
            hh = []
            for j in range(3):
                if p[j] < a[j] + r:
                    hh.append((j, 0))
                    p[j] = min(2 * (a[j] + r) - p[j], b[j] - r)
                    d[j] = abs(d[j])
                elif p[j] > b[j] - r:
                    hh.append((j, 1))
                    p[j] = max(2 * (b[j] - r) - p[j], a[j] + r)
                    d[j] = -abs(d[j])
            if hits is not None:
                for j, side in hh:
                    hits.append((t, p.copy(), j, side))
            if rnd.random() < 0.08:                       # a collision now and then: new direction
                d = (d + Vector((rnd.uniform(-1, 1), rnd.uniform(-0.3, 0.3), rnd.uniform(-1, 1)))).normalized()
        keys_bulk(m, "location", frames, vals)
        if f_in is not None or f_out is not None:
            appear(m, f_in, f_out, s=(r,) * 3)
        out.append(m)
    return out


def shake(name, pts, t0, t1, amp=0.05, r=0.16, mat=None, parent=None, seed=3, step=0.12, f_in=None, f_out=None,
          amp_f=None):
    """Molecules fixed at pts, vibrating in place (a solid). amp_f(t) can grow the shaking (heating)."""
    rnd = random.Random(seed)
    out = []
    for i, p0 in enumerate(pts):
        p0 = Vector(p0)
        m = sphere("%s %d" % (name, i), r, mat or MOL["air"], p0, parent, 12, 6)
        frames, vals, t = [], [], t0
        while t <= t1:
            A = amp_f(t) if amp_f else amp
            frames.append(sec(t))
            vals.append(p0 + Vector((rnd.uniform(-A, A), rnd.uniform(-A, A) * 0.4, rnd.uniform(-A, A))))
            t += step
        keys_bulk(m, "location", frames, vals, 'BEZIER')
        if f_in is not None or f_out is not None:
            appear(m, f_in, f_out, s=(r,) * 3)
        out.append(m)
    return out


def grid_pts(nx, nz, gap, centre, ny=1):
    c = Vector(centre)
    return [c + Vector(((i - (nx - 1) / 2) * gap, (k - (ny - 1) / 2) * gap, (j - (nz - 1) / 2) * gap))
            for i in range(nx) for j in range(nz) for k in range(ny)]


def piston_cyl(name, r, h, loc, parent=None):
    """An upright glass cylinder (base at loc) with a steel piston + rod. Returns (group, piston); move the piston's
    z (local to the group) with move()."""
    g = jar(name, r, h, loc, parent=parent)
    pis = empty(name + " Piston", (0, 0, h * 0.8), g)
    cyl(name + " Disc", r * 0.97, r * 0.97, 0.18, METAL, (0, 0, 0), pis, segs=48)
    cyl(name + " Rod", 0.07, 0.07, 1.4, METAL, (0, 0, 0.7), pis, segs=16)
    cyl(name + " Knob", 0.35, 0.35, 0.12, METAL, (0, 0, 1.45), pis, segs=32)
    return g, pis


def gauge(name, loc, parent=None, r=0.75, label_txt=None, mat=None):
    """A round dial (faces the camera) with a needle. needle_to(needle, t, frac) turns it (0 = left, 1 = right)."""
    g = empty(name, loc, parent)
    face = cyl(name + " Face", r, r, 0.06, DARK, (0, 0, 0), g, rot=(math.pi / 2, 0, 0), segs=48)
    ring_curve(name + " Rim", r, mat or GLASS, g, 0.035, 96).rotation_euler = (math.pi / 2, 0, 0)
    for k in range(9):
        a = math.radians(210 - 30 * k)
        pcurve("%s Tick %d" % (name, k), [(0.78 * r * math.cos(a), -0.05, 0.78 * r * math.sin(a)),
                                         (0.93 * r * math.cos(a), -0.05, 0.93 * r * math.sin(a))], M["white"], 0.012,
               "Models", parent=g)
    piv = empty(name + " Needle", (0, -0.07, 0), g)
    nd = arrow(name + " Arrow", 0.78 * r, M["red"], piv, r=0.02, head=0.12)
    dot(name + " Hub", 0.07, METAL, g, (0, -0.08, 0))
    if label_txt:
        big(name + " Lbl", label_txt, Vector(loc) + Vector((0, -0.3, -r - 0.45)), 0, None, size=0.38)
    piv.rotation_euler = (0, -math.radians(210), 0)
    return piv


def needle_to(piv, t, frac, interp='BEZIER'):
    """Needle angle: frac 0 → 210° (lower left) … 1 → -30° (lower right). Rotation about -Y faces the camera."""
    kf(piv, "rotation_euler", sec(t), (0, -math.radians(210 - 240 * frac), 0), interp)


def thermo(name, loc, h=3.0, parent=None):
    """A thermometer standing at loc; returns the red column (scale z 0..1 = empty..full)."""
    g = empty(name, loc, parent)
    cyl(name + " Tube", 0.13, 0.13, h, mat_emit("Thermo Glass", (0.7, 0.85, 1.0), 0.5, alpha=0.35), (0, 0, h / 2), g)
    sphere(name + " Bulb", 0.24, HOT, (0, 0, -0.05), g, 20, 10)
    col = cyl(name + " Col", 0.07, 0.07, h * 0.95, HOT, (0, -0.01, 0.1), g, base=True, segs=16)
    col.scale = (1, 1, 0.2)
    return col


def level(ob, t, frac, interp='BEZIER'):
    """Scale-z keyframe (thermometer column, liquid level, bar)."""
    kf(ob, "scale", sec(t), (ob.scale[0], ob.scale[1], frac), interp)


def flame(name, loc, t0, t1=None, parent=None, s=1.0):
    """A small burner flame that flickers from t0 to t1."""
    g = empty(name, loc, parent)
    cyl(name + " Outer", 0.28 * s, 0.0, 0.9 * s, mat_emit("Flame Orange", (1.0, 0.45, 0.1), 6.0), (0, 0, 0.45 * s), g)
    cyl(name + " Inner", 0.15 * s, 0.0, 0.5 * s, mat_emit("Flame Blue", (0.3, 0.55, 1.0), 6.0), (0, -0.05, 0.25 * s), g)
    rnd = random.Random(len(name))
    hide_until(g, sec(t0))
    t, end = t0, (t1 if t1 is not None else scene.frame_end / FPS)
    frames, vals = [], []
    while t < end:
        frames.append(sec(t))
        vals.append(Vector((1, 1, 0.85 + 0.3 * rnd.random())))
        t += 0.15
    if len(frames) > 1:
        keys_bulk(g, "scale", frames, vals, 'BEZIER')
    if t1 is not None:
        hide_from(g, sec(t1), (1, 1, 1))
    return g


def axes(name, origin, w, h, xlab, ylab, t0, t1=None, parent=None, size=0.42):
    """Graph axes (x right, y up) in the picture plane, with their names. Returns the origin Vector."""
    o = Vector(origin)
    ax = arrow(name + " X", w, M["white"], parent, o, r=0.025, head=0.22)
    ay = arrow(name + " Y", h, M["white"], parent, o, (0, -math.pi / 2, 0), r=0.025, head=0.22)
    for a in (ax, ay):
        appear(a, sec(t0), t1 and sec(t1))
    big(name + " XL", xlab, o + Vector((w + 0.3, -0.2, 0)), t0 + 0.3, t1, size=size, align='LEFT')
    big(name + " YL", ylab, o + Vector((0, -0.2, h + 0.45)), t0 + 0.3, t1, size=size)
    return o


def plot(name, pts, t0, dur, mat=None, r=0.06, t1=None, parent=None, every=0.12):
    """Draw a graph line dot by dot: pts (world) are resampled every `every` units and pop in over `dur` seconds."""
    pts = [Vector(p) for p in pts]
    dense = [pts[0]]
    for a, b in zip(pts, pts[1:]):
        L = (b - a).length
        k = max(1, int(L / every))
        dense += [a.lerp(b, (i + 1) / k) for i in range(k)]
    out = []
    for i, p in enumerate(dense):
        d = dot("%s %d" % (name, i), r, mat or M["gold"], parent, p)
        appear(d, sec(t0 + dur * i / max(1, len(dense) - 1)), t1 and sec(t1), dur=4, s=(r,) * 3)
        out.append(d)
    return out


def cards(name, items, top, bins, t0, gap=1.6, size=0.48, dz=0.95, z0=1.5):
    """Cards drop from `top` into bins: items = [(text, bin key)], bins = {key: x}. Returns the card objects."""
    used = {k: 0 for k in bins}
    out = []
    for k, (txt, key) in enumerate(items):
        t = t0 + gap * k
        n = used[key]
        used[key] += 1
        c = big("%s %d" % (name, k), txt, top, t, None, size=size)
        move(c, sec(t + 0.4), sec(t + 1.2), top, Vector((bins[key], top[1], z0 - dz * n)))
        out.append(c)
    return out


def pos_at(ob, t):
    """Local location of ob at time t (seconds), read from its keys."""
    fcs = {fc.array_index: fc for fc in _fcurves(ob) if fc.data_path == "location"}
    return Vector([fcs[i].evaluate(sec(t)) if i in fcs else ob.location[i] for i in range(3)])


def swap(old, new, t):
    """Hand over from one set of molecules to another at time t (same places, so it looks like one set)."""
    for o in old:
        hide_from(o, sec(t))
    for n in new:
        hide_until(n, sec(t))


def escape(name, lo, hi, hole, lo2, hi2, t0, tk, t1, r=0.13, mat=None, speed=2.5, seed=1, f_in=None, dur=0.6):
    """One molecule wanders in box lo..hi, slips through `hole` at time tk, then wanders in box lo2..hi2."""
    a = gas(name + " A", 1, lo, hi, t0, tk - dur, speed=speed, r=r, mat=mat, seed=seed, f_in=f_in)[0]
    kf(a, "location", sec(tk), Vector(hole), 'LINEAR')
    b = gas(name + " B", 1, lo2, hi2, tk, t1, speed=speed, r=r, mat=mat, seed=seed + 50, pos=[hole])[0]
    swap([a], [b], tk + 0.05)
    return a, b


def hit_flashes(name, hits, axis, side, wall, t0, t1, r=0.22, mat=None, parent=None, limit=40):
    """Little gold flashes where molecules hit one wall (axis 0/1/2, side 0 = low, 1 = high) at coordinate `wall`."""
    sel = [h for h in hits if h[2] == axis and h[3] == side and t0 <= h[0] <= t1][:limit]
    for k, (t, p, _, _) in enumerate(sel):
        q = p.copy()
        q[axis] = wall
        f = dot("%s %d" % (name, k), r, mat or M["gold"], parent, q)
        kf(f, "scale", 0, (0, 0, 0), 'CONSTANT')
        kf(f, "scale", sec(t), (r * 0.3,) * 3, 'LINEAR')
        kf(f, "scale", sec(t) + 3, (r,) * 3, 'LINEAR')
        kf(f, "scale", sec(t) + 9, (0, 0, 0), 'CONSTANT')


def zpath(keys):
    """keys = [(t, value), …] → f(t), eased like Blender's default Bézier keys (smoothstep between keys)."""
    def f(t):
        if t <= keys[0][0]:
            return keys[0][1]
        for (ta, va), (tb, vb) in zip(keys, keys[1:]):
            if t <= tb:
                u = (t - ta) / max(1e-6, tb - ta)
                return va + (vb - va) * u * u * (3 - 2 * u)
        return keys[-1][1]
    return f


def key_piston(pis, keys):
    """Key the piston's local z at each (t, z)."""
    for t, z in keys:
        kf(pis, "location", sec(t), (0, 0, z))


def needle_keys(piv, keys):
    for t, fr in keys:
        needle_to(piv, t, fr)


def rig(name, loc, r=1.3, h=4.0, t_in=0.0, gauge_dx=2.7):
    """Boyle / Charles set-up (Fig 5.4): glass cylinder + piston and a pressure gauge joined by a pipe.
    Returns (group, piston, needle)."""
    cg, pis = piston_cyl(name, r, h, loc)
    appear(cg, sec(t_in), dur=10)
    g = Vector(loc) + Vector((gauge_dx, -0.1, 1.0))
    nd = gauge(name + " Gauge", g)
    appear(nd.parent, sec(t_in + 0.3), dur=10)
    pp = pcurve(name + " Pipe", [Vector(loc) + Vector((r * 0.7, 0, 0.15)), Vector((g.x, loc[1], loc[2] + 0.15)),
                                 g + Vector((0, 0.1, -0.75))], METAL, 0.06, "Models")
    hide_until(pp, sec(t_in + 0.3))
    return cg, pis, nd


def dish(key, c, w, d, h_wall, h_liq, n, t0, t1, esc=(), speed=1.0, r=0.13, mat=None, esc_mat=None, seed=1, f_in=None,
         rise=2.6, fill=True, top=None):
    """An open glass dish (base centre c) holding a liquid of n sliding molecules; at each time in `esc` one fast
    molecule (esc_mat, gold) leaves the surface and floats up and away. Returns (liquid molecules, escapers)."""
    c = Vector(c)
    g = box_edges(key + " Dish", (w, d, h_wall), c + Vector((0, 0, h_wall / 2)), top=False)
    appear(g, sec(t0 + 0.2) if f_in is None else f_in, dur=10)
    if fill:
        wb = box(key + " Water", (w - 0.06, d - 0.06, h_liq), WATER, c + Vector((0, 0, h_liq / 2)))
        appear(wb, sec(t0 + 0.3) if f_in is None else f_in, dur=10)
    lo, hi = c + Vector((-w / 2, -d / 2 + 0.1, 0)), c + Vector((w / 2, d / 2 - 0.1, h_liq))
    liq = gas(key + " Liq", n, lo, hi, t0, t1, speed=speed, r=r, mat=mat, seed=seed,
              f_in=sec(t0 + 0.5) if f_in is None else f_in)
    rnd = random.Random(seed + 7)
    out = []
    for k, tk in enumerate(esc):
        hole = c + Vector((rnd.uniform(-w / 2 + 0.4, w / 2 - 0.4), 0, h_liq))
        a = gas("%s Esc %d" % (key, k), 1, lo, hi, t0, tk - 0.5, speed=speed, r=r, mat=esc_mat or MOL["gold"],
                seed=seed + 100 + k, f_in=sec(t0 + 0.5) if f_in is None else f_in)[0]
        kf(a, "location", sec(tk), hole, 'LINEAR')
        kf(a, "location", sec(tk + 2.4), hole + Vector((rnd.uniform(-1.2, 1.2), 0, rise)), 'LINEAR')
        hide_from(a, sec(tk + 2.4))
        out.append(a)
    return liq, out


def life(name, start, t0, phases, r=0.13, mat=None, seed=1, f_in=None, parent=None, step=0.3):
    """One molecule's whole story as one object: phases = ("box", lo, hi, t_end, speed) to wander and bounce,
    or ("to", point, t_arrive) to fly straight to a point (through a surface, a hole …)."""
    rnd = random.Random(seed)
    p, t = Vector(start), t0
    d = Vector((rnd.uniform(-1, 1), rnd.uniform(-0.35, 0.35), rnd.uniform(-1, 1))).normalized()
    frames, vals = [sec(t)], [p.copy()]
    for ph in phases:
        if ph[0] == "to":
            p, t = Vector(ph[1]), ph[2]
            frames.append(sec(t))
            vals.append(p.copy())
            d = Vector((rnd.uniform(-1, 1), rnd.uniform(-0.35, 0.35), rnd.uniform(-1, 1))).normalized()
            continue
        _, lo, hi, t_end, sp = ph
        lo, hi = Vector(lo), Vector(hi)
        while t < t_end - 1e-6:
            t = min(t_end, t + step)
            p = p + d * sp * step
            for j in range(3):
                if p[j] < lo[j] + r:
                    p[j] = min(2 * (lo[j] + r) - p[j], hi[j] - r)
                    d[j] = abs(d[j])
                elif p[j] > hi[j] - r:
                    p[j] = max(2 * (hi[j] - r) - p[j], lo[j] + r)
                    d[j] = -abs(d[j])
            if rnd.random() < 0.08:
                d = (d + Vector((rnd.uniform(-1, 1), rnd.uniform(-0.3, 0.3), rnd.uniform(-1, 1)))).normalized()
            if sec(t) > frames[-1]:
                frames.append(sec(t))
                vals.append(p.copy())
    m = sphere(name, r, mat or MOL["air"], vals[0], parent, 12, 6)
    keys_bulk(m, "location", frames, vals)
    if f_in is not None:
        appear(m, f_in, s=(r,) * 3)
    return m


def closed_jar(key, c, w, d, h, h_liq, n, t0, t1, esc=(), ret=(), speed=1.0, vspeed=2.6, r=0.13, mat=None, seed=1,
               f_in=None, vap0=0, lid=True):
    """A closed glass box: a liquid of n molecules below, vapour above. At each time in `esc` a liquid molecule leaves
    the surface; at each time in `ret` the oldest vapour molecule comes back (condensation). vap0 vapour molecules
    are there from the start. Returns the list of every molecule."""
    c = Vector(c)
    rnd = random.Random(seed)
    fi = sec(t0 + 0.4) if f_in is None else f_in
    appear(box_edges(key + " Jar", (w, d, h), c + Vector((0, 0, h / 2))), fi - 4, dur=10)
    appear(box(key + " Water", (w - 0.06, d - 0.06, h_liq), WATER, c + Vector((0, 0, h_liq / 2))), fi - 2, dur=10)
    loL, hiL = c + Vector((-w / 2, -d / 2 + 0.1, 0)), c + Vector((w / 2, d / 2 - 0.1, h_liq))
    loV, hiV = c + Vector((-w / 2, -d / 2 + 0.1, h_liq + 0.05)), c + Vector((w / 2, d / 2 - 0.1, h))
    surf = lambda: c + Vector((rnd.uniform(-w / 2 + 0.3, w / 2 - 0.3), 0, h_liq))
    rand_in = lambda lo, hi: Vector([lo[j] + r + rnd.random() * (hi[j] - lo[j] - 2 * r) for j in range(3)])
    # who leaves when, who comes back when (first out, first back)
    n_esc = len(esc)
    stories = []
    vap_queue = []
    for k in range(vap0):
        stories.append([("V", t0)])
        vap_queue.append(len(stories) - 1)
    leavers = list(range(len(stories), len(stories) + n_esc))
    for k in range(n):
        stories.append([("L", t0)])
    events = sorted([(t, "esc") for t in esc] + [(t, "ret") for t in ret])
    nxt = 0
    for t, kind in events:
        if kind == "esc" and nxt < n:
            i = vap0 + nxt
            nxt += 1
            stories[i].append(("V", t))
            vap_queue.append(i)
        elif kind == "ret" and vap_queue:
            i = vap_queue.pop(0)
            stories[i].append(("L", t))
    out = []
    for i, st in enumerate(stories):
        state0 = st[0][0]
        start = rand_in(loV, hiV) if state0 == "V" else rand_in(loL, hiL)
        phases = []
        for (s_a, ta), nx in zip(st, st[1:] + [(None, t1)]):
            tb = nx[1]
            if nx[0] is None:
                phases.append(("box", loV if s_a == "V" else loL, hiV if s_a == "V" else hiL, tb,
                               vspeed if s_a == "V" else speed))
            else:
                phases.append(("box", loV if s_a == "V" else loL, hiV if s_a == "V" else hiL, tb - 0.5,
                               vspeed if s_a == "V" else speed))
                phases.append(("to", surf(), tb))
        out.append(life("%s Mol %d" % (key, i), start, t0, phases, r=r, mat=mat, seed=seed * 100 + i, f_in=fi))
    return out
