# ---- Unit 7 (Electrochemistry) helpers. Append after u6/u6lib.py (sh scripts/u7/b7.sh scripts/u7/f7NN_x.py).
# Pictures: electrons = small glowing blue balls that hop between atoms or run along wires; cations orange (+),
# anions green (−); oxidation numbers = gold badges; cells = glass tanks with metal plates and white wires.
CAT = mat_emit("Cation U7", (1.0, 0.55, 0.15), 1.6)
ANI = mat_emit("Anion U7", (0.3, 1.0, 0.45), 1.3)
COPPER = mat_pbr("Copper U7", (0.85, 0.42, 0.25), metallic=0.9, roughness=0.35)
ZINC = mat_pbr("Zinc U7", (0.62, 0.66, 0.72), metallic=0.9, roughness=0.4)
GRAPHITE = mat_pbr("Graphite U7", (0.08, 0.08, 0.1), roughness=0.6)
IRON = mat_pbr("Iron U7", (0.42, 0.43, 0.46), metallic=0.8, roughness=0.5)
RUST = mat_pbr("Rust U7", (0.5, 0.2, 0.07), roughness=0.95)
TIN = mat_pbr("Tin U7", (0.82, 0.84, 0.86), metallic=0.95, roughness=0.25)
CHROME = mat_pbr("Chrome U7", (0.9, 0.92, 0.95), metallic=1.0, roughness=0.08)
SODIUM = mat_emit("Sodium Metal U7", (0.85, 0.85, 0.8), 0.8)
CL_GAS = mat_emit("Chlorine Gas U7", (0.75, 1.0, 0.3), 1.4)
H_GAS = mat_emit("Hydrogen Gas U7", (0.9, 0.95, 1.0), 1.2)
CU_SOL = mat_emit("CuSO4 Sol U7", (0.1, 0.45, 1.0), 0.8, alpha=0.35)
ZN_SOL = mat_emit("ZnSO4 Sol U7", (0.75, 0.85, 0.95), 0.5, alpha=0.18)
MELT = mat_emit("Molten Salt U7", (1.0, 0.55, 0.2), 0.9, alpha=0.35)
GLOW = mat_emit("Bulb Glow U7", (1.0, 0.85, 0.4), 6.0)
WIRE = M["white"]


def atom(name, sym, loc, t0, r=0.45, mat=None, t1=None, size=None):
    """A ball with its symbol in front. Returns (ball, label)."""
    loc = Vector(loc)
    b = sphere(name, r, mat or MOL["white"], loc, None, 24, 12)
    appear(b, sec(t0), t1 and sec(t1), s=(r,) * 3)
    lb = big(name + " Sym", sym, loc + Vector((0, -r - 0.15, -0.15)), t0 + 0.2, t1, mat=M["white"], size=size or r * 0.95)
    return b, lb


def badge(name, text, loc, t0, t1=None, mat=None, size=0.42):
    """A gold oxidation-number badge (a world label)."""
    return big(name, text, loc, t0, t1, mat=mat or M["gold"], size=size)


def tank(key, c, w, h, h_liq, t_in, liq_mat=None, d=1.4):
    """An open glass tank standing at c with liquid up to h_liq. Returns (edges, liquid)."""
    c = Vector(c)
    g = box_edges(key + " Tank", (w, d, h), c + Vector((0, 0, h / 2)), top=False)
    appear(g, sec(t_in), dur=10)
    lq = None
    if h_liq > 0:
        lq = box(key + " Liquid", (w - 0.06, d - 0.06, h_liq), liq_mat or WATER, c + Vector((0, 0, h_liq / 2)))
        appear(lq, sec(t_in + 0.2), dur=10)
    return g, lq


def plate(name, c, h, mat, t0, w=0.5, t=0.12, t1=None):
    """An electrode plate standing on c (bottom), h tall."""
    c = Vector(c)
    p = box(name, (w, t, h), mat, c + Vector((0, 0, h / 2)))
    appear(p, sec(t0), t1 and sec(t1), dur=10)
    return p


def wire(name, pts, t0, t1=None):
    w = pcurve(name, [Vector(p) for p in pts], WIRE, 0.025, "Models")
    hide_until(w, sec(t0))
    if t1 is not None:
        hide_from(w, sec(t1))
    return w


def battery(key, loc, t0, t1=None):
    """A battery lying along x: + on the left, − on the right."""
    g = empty(key + " Battery", loc)
    box(key + " Body", (1.2, 0.5, 0.5), DARK, (0, 0, 0), g)
    box(key + " Cap", (0.12, 0.25, 0.25), METAL, (-0.66, 0, 0), g)
    appear(g, sec(t0), t1 and sec(t1), dur=10)
    loc = Vector(loc)
    big(key + " Plus", "+", loc + Vector((-0.4, -0.35, 0.45)), t0 + 0.2, t1, mat=M["red"], size=0.45)
    big(key + " Minus", "−", loc + Vector((0.4, -0.35, 0.45)), t0 + 0.2, t1, mat=M["cyan"], size=0.45)
    return g


def _along(pts, s):
    """Point at distance s along a polyline."""
    for a, b in zip(pts, pts[1:]):
        L = (b - a).length
        if s <= L or b is pts[-1]:
            return a.lerp(b, min(1.0, s / max(L, 1e-6)))
        s -= L
    return pts[-1]


def flow(name, pts, t0, t1, n=8, speed=1.4, r=0.09, mat=None):
    """Electrons running along a wire (polyline pts) from start to end, again and again, between t0 and t1."""
    pts = [Vector(p) for p in pts]
    L = sum((b - a).length for a, b in zip(pts, pts[1:]))
    out = []
    for k in range(n):
        e = electron("%s %d" % (name, k), None, pts[0], r, mat=mat)
        frames, vals, prev = [], [], None
        f = sec(t0)
        while f <= sec(t1):
            s = (k * L / n + speed * (f - sec(t0)) / FPS) % L
            if prev is not None and s < prev:
                frames.append(f - 1)
                vals.append(pts[-1].copy())
            frames.append(f)
            vals.append(_along(pts, s))
            prev = s
            f += 3
        keys_bulk(e, "location", frames, vals)
        hide_until(e, sec(t0))
        hide_from(e, sec(t1))
        out.append(e)
    return out


def bubbles(name, x0, x1, z0, z1, y, t0, t1, n=8, r=0.09, mat=None, period=1.6):
    """Gas bubbles rising again and again from z0 to z1 between x0 and x1."""
    rnd = random.Random(len(name))
    out = []
    for k in range(n):
        x = x0 + (x1 - x0) * rnd.random()
        b = sphere("%s %d" % (name, k), r, mat or H_GAS, (x, y, z0), None, 12, 6)
        frames, vals = [], []
        t = t0 + period * k / n
        while t + period <= t1:
            frames += [sec(t), sec(t + period) - 1]
            vals += [Vector((x, y, z0)), Vector((x, y, z1))]
            t += period
        if len(frames) > 1:
            keys_bulk(b, "location", frames, vals)
        hide_until(b, sec(t0 + period * k / n))
        hide_from(b, sec(t1), (r,) * 3)
        out.append(b)
    return out


def bulb(key, loc, t0, level, t1=None):
    """A light bulb on a socket; level 0..1 = how brightly it glows (from t0 + 1)."""
    loc = Vector(loc)
    g = empty(key + " Bulb", loc)
    sphere(key + " Glass", 0.5, mat_emit("Bulb Glass U7", (0.8, 0.9, 1.0), 0.4, alpha=0.25), (0, 0, 0.75), g, 24, 12)
    cyl(key + " Socket", 0.25, 0.25, 0.4, METAL, (0, 0, 0.2), g, segs=20)
    appear(g, sec(t0), t1 and sec(t1), dur=10)
    gl = None
    if level > 0:
        rr = 0.12 + 0.3 * level
        gl = sphere(key + " Glow", rr, GLOW, loc + Vector((0, 0, 0.75)), None, 20, 10)
        appear(gl, sec(t0 + 1.0), t1 and sec(t1), s=(rr,) * 3)
    return g, gl


def ion(name, mat, loc, t0, t1=None, r=0.2):
    s = sphere(name, r, mat, loc, None, 16, 8)
    appear(s, sec(t0), t1 and sec(t1), s=(r,) * 3)
    return s


CPK.update({"Fe": (0.8, 0.45, 0.3), "Hg": (0.8, 0.82, 0.88), "Sn": (0.75, 0.78, 0.82), "Zn": (0.62, 0.66, 0.72),
            "Cu": (0.92, 0.5, 0.3), "I": (0.6, 0.25, 0.75), "P": (1.0, 0.55, 0.2), "Mn": (0.75, 0.5, 0.85),
            "K": (0.6, 0.4, 0.95), "Ag": (0.85, 0.86, 0.9), "Cr": (0.55, 0.9, 0.7), "Al": (0.75, 0.7, 0.8),
            "As": (0.6, 0.85, 0.5)})
for _s in ("Fe", "Hg", "Sn", "Zn", "Cu", "I", "P", "Mn", "K", "Ag", "Cr", "Al", "As", "Ca", "Mg"):
    CPK_R.setdefault(_s, 0.58)


def A(name, sym, loc, t0, t1=None, k=1.0):
    """A CPK-coloured atom with its symbol. Returns (ball, label)."""
    return atom(name, sym, loc, t0, CPK_R.get(sym, 0.5) * k, cpk_mat(sym), t1)


def mv(at, t0, t1, a, b, interp='BEZIER'):
    """Move an atom (ball + its label) from a to b."""
    ball, lb = at
    off = lb.location.copy() - ball.location.copy()
    a, b = Vector(a), Vector(b)
    move(ball, sec(t0), sec(t1), a, b, interp)
    move(lb, sec(t0), sec(t1), a + off, b + off, interp)


def gone(at, t):
    """Hide an atom (ball + label) from t."""
    for o in at:
        hide_from(o, sec(t))


def molb(key, base, items, t0, tb, t1=None, step=0.3, k=1.0, bsize=0.38):
    """Atoms with gold oxidation-number badges over them. items = [(sym, offset, badge text or None)]."""
    out = []
    for i, (sym, off, bd) in enumerate(items):
        p = Vector(base) + Vector(off)
        out.append(A("%s %s%d" % (key, sym, i), sym, p, t0 + 0.12 * i, t1, k=k))
        if bd:
            r = CPK_R.get(sym, 0.5) * k
            badge("%s B%d" % (key, i), bd, p + Vector((0, -0.7, r + 0.4)), tb + step * i, t1, size=bsize)
    return out


def cflask(key, c, t_in, fill, t1=None, s=1.0):
    """A conical (Erlenmeyer) flask standing on c with coloured liquid in its lower half."""
    g = empty(key + " CFlask", c)
    cyl(key + " Glass", 0.95 * s, 0.28 * s, 1.7 * s, GLASS_FILL, (0, 0, 0), g, base=True, segs=40)
    cyl(key + " Neck", 0.28 * s, 0.28 * s, 0.7 * s, GLASS_FILL, (0, 0, 1.7 * s), g, base=True, segs=24)
    cyl(key + " Liq", 0.9 * s, 0.55 * s, 0.85 * s, fill, (0, 0, 0.02), g, base=True, segs=40)
    appear(g, sec(t_in), t1 and sec(t1), dur=10)
    return g


def cell(key, c, t0, w=4.0, h=2.6, liq=None, top="battery", level=1.0, pa=None, pc=None, gap=1.2, t1=None,
         pw=0.45):
    """A glass tank (bottom at c) with two plates and wires up to a battery (+ left) or a bulb on top.
    Left plate = anode, right plate = cathode. Returns dict: L, R (plates), up_l / up_r (wire points from each
    plate top to the device), top (device loc), glow (bulb glow or None)."""
    c = Vector(c)
    tank(key, c, w, h, h * 0.8, t0, liq_mat=liq)
    L = plate(key + " Anode", c + Vector((-gap, 0, 0.2)), h + 0.2, pa or GRAPHITE, t0 + 0.3, w=pw, t1=t1)
    R = plate(key + " Cathode", c + Vector((gap, 0, 0.2)), h + 0.2, pc or GRAPHITE, t0 + 0.3, w=pw, t1=t1)
    zt = h + 1.3
    top_loc = c + Vector((0, 0, zt))
    glow = None
    if top == "battery":
        battery(key, top_loc, t0 + 0.5, t1)
        el, er = top_loc + Vector((-0.72, 0, 0)), top_loc + Vector((0.6, 0, 0))
    else:
        top_loc = c + Vector((0, 0, zt - 0.4))
        _, glow = bulb(key, top_loc, t0 + 0.5, level, t1)
        el, er = top_loc + Vector((-0.25, 0, 0.2)), top_loc + Vector((0.25, 0, 0.2))
    up_l = [c + Vector((-gap, 0, h + 0.4)), Vector((c.x - gap, c.y, el.z)), el]
    up_r = [c + Vector((gap, 0, h + 0.4)), Vector((c.x + gap, c.y, er.z)), er]
    wire(key + " Wire L", up_l, t0 + 0.6, t1)
    wire(key + " Wire R", up_r, t0 + 0.6, t1)
    return {"L": L, "R": R, "up_l": up_l, "up_r": up_r, "top": top_loc, "glow": glow}
