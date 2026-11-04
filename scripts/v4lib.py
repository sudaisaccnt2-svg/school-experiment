# ---- v4 "show, don't tell" helpers (SKILL.md). Append after the unit libs (needs u3lib's shot/cap/big):
#   python scripts/bsend.py scripts/common.py scripts/p2/lib.py scripts/u3/u3lib.py scripts/u4/u4lib.py scripts/v4lib.py f.py
# A beat = only its own objects on screen, ONE action (the moving thing gold, with a glowing trail), the result shown
# physically (flash, sign, bar) and held, ONE short caption line.
V4_GOLD = mat_emit("V4 Gold Electron", (1.0, 0.75, 0.3), 4.5)
V4_TRAIL = mat_emit("V4 Gold Trail", (1.0, 0.72, 0.28), 2.6)
V4_FLASH = mat_emit("V4 Flash Ring", (1.0, 0.82, 0.4), 5.0)
V4_PLUS = mat_emit("V4 Plus", (1.0, 0.35, 0.3), 3.0)
V4_MINUS = mat_emit("V4 Minus", (0.35, 0.65, 1.0), 3.0)


def say(key, head, t0, t1=None):
    """The one caption: a single short gold line (≤ 6 words) naming what you see."""
    cap(key, head, None, t0, t1)


def gold_fly(name, a, b, t0, dur=2.0, lift=1.2, r=0.12, parent=None, lag=14):
    """A gold electron flies from a to b (world, or parent-local) in a smooth arc, leaving a glowing comet trail that
    follows it and fades behind (the app rebuilds the trail from the motion). Visible only while it flies."""
    a, b = Vector(a), Vector(b)
    mid = (a + b) / 2 + Vector((0, -0.4, lift))
    e = electron(name, parent, a, r, mat=V4_GOLD)
    f0, n = sec(t0), max(2, int(dur * FPS))
    pts = []
    for k in range(n + 1):
        u = k / n
        s_ = u * u * (3 - 2 * u)
        q = a * (1 - s_) ** 2 + mid * 2 * (1 - s_) * s_ + b * s_ * s_
        kf(e, "location", f0 + k, q, 'LINEAR')
        pts.append(q)
    hide_until(e, f0)
    hide_from(e, f0 + n + 1)
    tr = pcurve(name + " Trail", pts, V4_TRAIL, depth=0.022, cname="Models", parent=parent)
    cu = tr.data
    kf(cu, "bevel_factor_end", 0, 0.0, 'CONSTANT')
    kf(cu, "bevel_factor_end", f0, 0.0, 'LINEAR')
    kf(cu, "bevel_factor_end", f0 + n, 1.0, 'LINEAR')
    kf(cu, "bevel_factor_start", 0, 0.0, 'CONSTANT')
    kf(cu, "bevel_factor_start", f0 + lag, 0.0, 'LINEAR')
    kf(cu, "bevel_factor_start", f0 + n + lag, 1.0, 'LINEAR')
    tr["trail_of"] = e.name
    return e


def ring_flash(name, parent, rad, t, k=1.18, mat=None):
    """A bright ring flashes over a shell (e.g. 'now full'): pops in, swells, fades out. parent = a vatom group."""
    rg = ring_curve(name, rad, mat or V4_FLASH, parent, depth=0.045)
    f = sec(t)
    kf(rg, "scale", 0, (0, 0, 0), 'CONSTANT')
    kf(rg, "scale", f, (0.92,) * 3, 'BEZIER')
    kf(rg, "scale", f + 8, (1.0,) * 3, 'BEZIER')
    kf(rg, "scale", f + 30, (k,) * 3, 'BEZIER')
    kf(rg, "scale", f + 36, (0, 0, 0), 'CONSTANT')
    return rg


def pulse(ob, t, k=1.25, dur=12):
    """One soft swell of an object (draws the eye to it), back to its own size."""
    s0 = Vector(ob.scale)
    f = sec(t)
    kf(ob, "scale", f, tuple(s0), 'BEZIER')
    kf(ob, "scale", f + dur // 2, tuple(s0 * k), 'BEZIER')
    kf(ob, "scale", f + dur, tuple(s0), 'BEZIER')


def charge(name, txt, loc, t0, t1=None, size=0.95):
    """A charge sign (+ red, − blue) pops onto an ion."""
    return big(name, txt, loc, t0, t1, mat=V4_PLUS if "+" in txt else V4_MINUS, size=size)


def gloss(name, rgb, rough=0.22):
    """Solid, lit, glossy model material (no flat pastel)."""
    return mat_pbr(name, rgb, metallic=0.05, roughness=rough, coat=0.6)


V4_BLUE_TRAIL = mat_emit("V4 Blue Trail", (0.3, 0.62, 1.0), 2.4)


def land(e, t0, dur=0.9, frm=None, k=2.3, lag=10, tmat=None):
    """An electron (hidden until t0) flies in an arc from `frm` (parent space; default: k × its seat, straight out)
    to its seat, with a glowing trail behind it. Its parent must be still while it flies."""
    home = e.location.copy()
    a = Vector(frm) if frm is not None else home * k
    side = Vector((-(home - a).y, (home - a).x, 0)) * 0.25
    mid = (a + home) / 2 + side
    f0, n = sec(t0), max(2, int(dur * FPS))
    pts = []
    for j in range(n + 1):
        u = j / n
        s_ = u * u * (3 - 2 * u)
        q = a * (1 - s_) ** 2 + mid * 2 * (1 - s_) * s_ + home * s_ * s_
        kf(e, "location", f0 + j, q, 'LINEAR')
        pts.append(q)
    hide_until(e, f0)
    tr = pcurve(e.name[len(PFX) + 1:] + " Trail", pts, tmat or V4_BLUE_TRAIL, depth=0.016, cname="Models",
                parent=e.parent)
    cu = tr.data
    kf(cu, "bevel_factor_end", 0, 0.0, 'CONSTANT')
    kf(cu, "bevel_factor_end", f0, 0.0, 'LINEAR')
    kf(cu, "bevel_factor_end", f0 + n, 1.0, 'LINEAR')
    kf(cu, "bevel_factor_start", 0, 0.0, 'CONSTANT')
    kf(cu, "bevel_factor_start", f0 + lag, 0.0, 'LINEAR')
    kf(cu, "bevel_factor_start", f0 + n + lag, 1.0, 'LINEAR')
    tr["trail_of"] = e.name
    return e


def flat_rings(name, loc, radii, t_in=None, mat=None, parent=None):
    """A flat atom frame facing the camera: group rotated 90° about X, so local (x, y) = world (x, z).
    Returns (group, rings). Rings appear at t_in[k] (seconds) if given."""
    g = empty(name, loc, parent, rot=(90 * DEG, 0, 0))
    rings = []
    for k, r in enumerate(radii):
        rg = ring_curve("%s Ring %d" % (name, k), r, mat or M["orbit"], g, depth=0.02)
        if t_in is not None:
            appear(rg, sec(t_in[k]), dur=12)
        rings.append(rg)
    return g, rings


def seat_pos(r, n, j, a0=90.0):
    """Seat j of n evenly round a ring of radius r (local x, y), starting at the top."""
    a = math.radians(a0) + 2 * math.pi * j / n
    return Vector((r * math.cos(a), r * math.sin(a), 0))


def travel(name, a, b, t0, dur=1.4, r=0.11, mat=None, lift=0.9):
    """v4: a moving electron is gold and leaves a glowing trail (replaces u4lib's plain travel)."""
    return gold_fly(name, a, b, t0, dur=dur, lift=lift, r=r)
