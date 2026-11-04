# ---- Unit 8 (Chemical Reactivity) helpers. Append after u7/u7lib.py and v4lib.py
#   (sh scripts/u8/b8.sh scripts/u8/f8NN_x.py, or python scripts/v4_batch.py u8 801 ...).
# Pictures: glossy metal lumps, a water trough, coloured flames, litmus strips, gas jars in the Fig 8.5 colours,
# flat Bohr atoms that lose (gold, trailed) or gain electrons, + / − signs, gold bars for numbers.
NA_M = mat_pbr("Sodium U8", (0.82, 0.83, 0.86), metallic=0.95, roughness=0.18)
TARNISH = mat_pbr("Tarnish U8", (0.42, 0.41, 0.39), metallic=0.3, roughness=0.85)
AU_M = mat_pbr("Gold U8", (1.0, 0.74, 0.3), metallic=1.0, roughness=0.15)
AG_M = mat_pbr("Silver U8", (0.93, 0.94, 0.96), metallic=1.0, roughness=0.1)
PT_M = mat_pbr("Platinum U8", (0.78, 0.78, 0.76), metallic=1.0, roughness=0.22)
MG_M = mat_pbr("Magnesium U8", (0.68, 0.7, 0.74), metallic=0.9, roughness=0.3)
CHALK = mat_pbr("Chalk U8", (0.92, 0.9, 0.86), roughness=0.9)
KERO = mat_emit("Kerosene U8", (1.0, 0.82, 0.35), 0.5, alpha=0.25)
LIT_RED = mat_emit("Litmus Red U8b", (1.0, 0.12, 0.15), 0.9)
LIT_BLUE = mat_emit("Litmus Blue U8b", (0.1, 0.3, 1.0), 0.9)
SALT_W = mat_emit("Salt White U8", (0.95, 0.95, 0.92), 0.9)
JAR = {"F": mat_emit("Fluorine Jar U8", (1.0, 0.95, 0.5), 0.8, alpha=0.25),
       "Cl": mat_emit("Chlorine Jar U8", (0.6, 1.0, 0.25), 0.9, alpha=0.35),
       "Br": mat_emit("Bromine Jar U8", (0.9, 0.32, 0.06), 1.0, alpha=0.5),
       "I": mat_emit("Iodine Jar U8", (0.6, 0.25, 0.9), 0.9, alpha=0.35)}
TILE = {"metal": gloss("Tile Metal U8b", (0.1, 0.22, 0.62)), "metalloid": gloss("Tile Metalloid U8b", (0.7, 0.28, 0.1)),
        "nonmetal": gloss("Tile Nonmetal U8b", (0.08, 0.45, 0.2))}
BAR_M = mat_pbr("Bar Gold U8", (1.0, 0.72, 0.3), metallic=0.8, roughness=0.25)


def lump(name, loc, r, mat, t0, t1=None, seed=0):
    """A glossy rough lump of metal (or rock)."""
    b = blob(name, (r, r * 0.8, r * 0.62), mat, loc, None, bump=0.14, seed=seed)
    appear(b, sec(t0), t1 and sec(t1))
    return b


def cflame(name, loc, rgb, t0, t1=None, s=1.0):
    """A flickering flame of one colour (red Li, yellow Na, lilac K, white Mg, brick-red Ca)."""
    g = empty(name, loc)
    m = mat_emit("Flame U8 %.2f %.2f %.2f" % tuple(rgb), rgb, 7.0)
    cyl(name + " Outer", 0.34 * s, 0.0, 1.1 * s, m, (0, 0, 0.55 * s), g)
    cyl(name + " Core", 0.16 * s, 0.0, 0.55 * s, mat_emit("Flame Core U8", (1.0, 0.95, 0.85), 8.0), (0, -0.05, 0.28 * s), g)
    rnd = random.Random(len(name))
    hide_until(g, sec(t0))
    t, end = t0, (t1 if t1 is not None else scene.frame_end / FPS)
    frames, vals = [], []
    while t < end:
        frames.append(sec(t))
        vals.append(Vector((1, 1, 0.8 + 0.4 * rnd.random())))
        t += 0.15
    if len(frames) > 1:
        keys_bulk(g, "scale", frames, vals, 'BEZIER')
    if t1 is not None:
        hide_from(g, sec(t1), (1, 1, 1))
    return g


def litmus(key, loc, t0, frm, to, t_change, t1=None):
    """A litmus strip that turns from one colour to the other at t_change ('red' / 'blue')."""
    mats = {"red": LIT_RED, "blue": LIT_BLUE}
    a = box(key + " Strip A", (0.35, 0.06, 1.6), mats[frm], loc)
    b = box(key + " Strip B", (0.35, 0.06, 1.6), mats[to], Vector(loc) + Vector((0, -0.01, 0)))
    appear(a, sec(t0))
    hide_from(a, sec(t_change), (1, 1, 1))
    hide_until(b, sec(t_change))
    if t1 is not None:
        hide_from(b, sec(t1), (1, 1, 1))
    pulse(b, t_change + 0.1, 1.15)
    return a, b


def trough(key, c, t_in, w=4.4, h=1.5, t1=None):
    """A wide glass trough of water (bottom at c). Water surface at c.z + h * 0.7."""
    g, lq = tank(key, c, w, h, h * 0.7, t_in)
    if t1 is not None:
        for o in (g, lq):
            hide_from(o, sec(t1), tuple(o.scale))
    return Vector(c) + Vector((0, 0, h * 0.7))


def atom_ring(z, loc, t0, t1=None, counts=None, scale=0.9, name=None):
    """vatom standing still (no spin) — the electrons can be handed on. Returns (group, radii, outer electrons)."""
    return vatom(name or "At %s %d" % (SYM[z], int(t0 * 10)), z, loc, sec(t0), [], scale=scale, counts=counts,
                 r0=0.5, dr=0.5, e_r=0.11, nuc_r=0.1, f_out=t1 and sec(t1))


def seat_world(loc, rad, j, n):
    """World position of seat j of n on a vatom ring of radius rad (the vatom faces the camera)."""
    a = 2 * math.pi * j / n
    return Vector(loc) + Vector((rad * math.cos(a), 0, rad * math.sin(a)))


def lose(key, z, loc, t0, t_go, sign, t1=None, scale=0.9, away=(3.2, 0, 1.6)):
    """An atom whose whole outer shell flies off (gold, trailed) at t_go; the empty ring goes and a + sign pops on.
    Returns the vatom group."""
    nm = "%s %s" % (key, SYM[z])
    g, radii, outer = atom_ring(z, loc, t0, t1, scale=scale, name=nm)
    n = len(outer)
    for j, e in enumerate(outer):
        a = seat_world(loc, radii[-1], j, n)
        hide_from(e, sec(t_go + 0.35 * j))
        out = (a - Vector(loc)).normalized()
        travel("%s Fly %d" % (key, j), a, a + out * 2.6 + Vector((0, -0.2, 0)), t_go + 0.35 * j, dur=1.3, lift=0.25)
    drop_ring(nm, len(radii) - 1, t_go + 0.35 * n + 1.0)
    charge(key + " Sign", sign, Vector(loc) + Vector((radii[-1] * 0.9, -0.5, radii[-1] * 0.9)), t_go + 0.35 * n + 1.3, t1,
           size=0.9)
    return g


def gain(key, z, loc, t0, t_go, k, sign, t1=None, scale=0.9, frm=(-3.4, 0, 1.6)):
    """An atom that takes k electrons (gold, trailed) into the gaps of its outer shell; a − sign pops on."""
    nm = "%s %s" % (key, SYM[z])
    cnt = shells_of(z)
    cnt = cnt[:-1] + [cnt[-1] + k]
    g, radii, outer = atom_ring(z, loc, t0, t1, counts=cnt, scale=scale, name=nm)
    n = len(outer)
    for i in range(k):
        j = n - 1 - i
        b = seat_world(loc, radii[-1], j, n)
        out = (b - Vector(loc)).normalized()
        travel("%s In %d" % (key, i), b + out * 2.6 + Vector((0, -0.2, 0)), b, t_go + 0.5 * i, dur=1.3, lift=0.25)
        hide_until(outer[j], sec(t_go + 0.5 * i + 1.3))
    ring_flash(nm + " Full", g, radii[-1], t_go + 0.5 * k + 1.4)
    charge(key + " Sign", sign, Vector(loc) + Vector((radii[-1] * 0.9, -0.5, radii[-1] * 0.9)), t_go + 0.5 * k + 1.6, t1,
           size=0.9)
    return g


def tile(name, sym, loc, kind, t0, t1=None, size=0.52):
    """A periodic-table tile standing up, facing the camera: kind = metal / metalloid / nonmetal."""
    loc = Vector(loc)
    b = box(name, (0.92, 0.18, 0.92), TILE[kind], loc)
    appear(b, sec(t0), t1 and sec(t1))
    big(name + " Sym", sym, loc + Vector((0, -0.25, -0.05)), t0 + 0.1, t1, size=size)
    return b


def bars(key, base, items, t0, k=1.0, step=0.4, w=0.6, gap=1.3, lsize=0.36, mat=None, t1=None):
    """Gold bars side by side from `base` (left foot): items = [(name under, height units, value text)]."""
    base = Vector(base)
    out = []
    for i, (nm, h, txt) in enumerate(items):
        p = base + Vector((gap * i, 0, 0))
        out.append(ebar("%s Bar %d" % (key, i), p, h * k, t0 + step * i, txt, mat or BAR_M, t_out=t1, lsize=lsize, w=w))
        big("%s Name %d" % (key, i), nm, p + Vector((0, -0.5, -0.4)), t0 + step * i, t1, size=0.42)
    return out


def jar_of(key, c, sym, t0, r=0.55, h=2.2, t1=None, fill=1.0):
    """A gas jar filled with a halogen's colour (Fig 8.5)."""
    j = jar(key + " Jar", r, h, c, top=True)
    appear(j, sec(t0), t1 and sec(t1))
    lq = liquid(key + " Fill", r * 0.96, h * fill, Vector(c) + Vector((0, 0, 0.01)), mat=JAR[sym])
    appear(lq, sec(t0 + 0.3), t1 and sec(t1))
    return j, lq


def dissolve_out(ob, t, dur=1.2):
    """A solid slowly shrinks away (eaten, dissolved, burnt)."""
    s0 = tuple(ob.scale)
    kf(ob, "scale", sec(t), s0, 'BEZIER')
    kf(ob, "scale", sec(t + dur), (0, 0, 0), 'BEZIER')


CPK.update({"Li": (0.85, 0.5, 0.95), "Ti": (0.7, 0.72, 0.78), "Ba": (0.4, 0.85, 0.5), "Sr": (0.95, 0.6, 0.4),
            "Ca": (0.9, 0.9, 0.8), "Mg": (0.55, 0.85, 0.35)})
for _s in ("Li", "Ti", "Ba", "Sr"):
    CPK_R.setdefault(_s, 0.58)


def knife(key, loc, t0, t_cut, depth=1.0, t1=None):
    """A knife blade that comes down and cuts `depth` units at t_cut."""
    loc = Vector(loc)
    g = empty(key + " Knife", loc + Vector((0, -0.3, 1.6)))
    box(key + " Blade", (0.06, 1.0, 1.2), mat_pbr("Blade U8", (0.85, 0.87, 0.9), metallic=1.0, roughness=0.1), (0, 0, 0), g)
    box(key + " Grip", (0.16, 1.0, 0.9), mat_pbr("Grip U8", (0.15, 0.1, 0.08), roughness=0.6), (0, 0, 1.05), g)
    appear(g, sec(t0), t1 and sec(t1), dur=10)
    kf(g, "location", sec(t_cut - 0.8), loc + Vector((0, -0.3, 1.6)), 'BEZIER')
    kf(g, "location", sec(t_cut), loc + Vector((0, -0.3, 1.6 - depth)), 'BEZIER')
    return g


def bob(ob, z0, t0, t1, amp=0.06, period=1.2):
    """An object floats: gentle up-and-down on the water from t0 to t1."""
    p = ob.location.copy()
    t, k = t0, 0
    while t <= t1:
        kf(ob, "location", sec(t), Vector((p.x, p.y, z0 + (amp if k % 2 else -amp))), 'BEZIER')
        t += period / 2
        k += 1


def fizz(key, loc, t0, t1, n=6, spread=0.35, rise=1.4, period=1.1, r=0.07):
    """Hydrogen bubbles rising from a point (a reacting metal)."""
    loc = Vector(loc)
    return bubbles(key + " Fizz", loc.x - spread, loc.x + spread, loc.z, loc.z + rise, loc.y - 0.3, t0, t1, n=n, r=r,
                   period=period)


def kero_jar(key, c, t0, t1=None, mat=None, n=3):
    """A lidded jar of kerosene with metal lumps sitting in it (alkali metals are kept like this)."""
    c = Vector(c)
    j = jar(key + " Jar", 0.9, 2.0, c, top=True)
    appear(j, sec(t0), t1 and sec(t1))
    lq = liquid(key + " Oil", 0.86, 1.5, c + Vector((0, 0, 0.01)), mat=KERO)
    appear(lq, sec(t0 + 0.2), t1 and sec(t1))
    for k in range(n):
        lump("%s Lump %d" % (key, k), c + Vector((-0.4 + 0.4 * k, -0.1, 0.3 + 0.12 * (k % 2))), 0.25, mat or NA_M,
             t0 + 0.4 + 0.2 * k, t1, seed=k)
    return j


def swap(a, b, t):
    """a disappears and b appears in its place at t (a colour/state change done with two objects)."""
    hide_from(a, sec(t), tuple(a.scale))
    hide_until(b, sec(t))


def rock(name, loc, r, rgb, t0, t1=None, seed=1):
    return lump(name, loc, r, mat_pbr("Rock U8 %s" % name, rgb, roughness=0.85), t0, t1, seed=seed)


def molecule(key, items, t0, t1=None, k=0.8):
    """CPK atoms (ball + symbol) at world points: items = [(sym, loc)]. Returns the atom list."""
    return [A("%s %s%d" % (key, s, i), s, p, t0 + 0.1 * i, t1, k=k) for i, (s, p) in enumerate(items)]
