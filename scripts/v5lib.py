# ---- v5 helpers (SKILL 2026-10-11): animation principles, real 3D objects, shared library models, effects.
# Append after the unit libs (and v4lib.py, u8lib.py …). Used by the v5 rebuilds (pilot: film 803).
#   pop()     pops in with overshoot and settle (never a linear grow)
#   fall()    real free fall (gravity), a heavy landing with a small bounce, a soft one squashes
#   glide()   a move with anticipation (a small wind-up back) and a settle past the target
#   splash()  a ripple ring + droplets on arcs where something hits water
#   atom3d()  the book's Bohr atom, but solid: glass shells you can turn round, real electron spheres
#   lib_obj() a model from the shared library (assets/library/asawera_library.blend), LINKED, never copied
#   fire()    a flame marker (the app draws the real fire: web/fx.js upgradeFlames)
import os
LIB_PATH = os.path.join(os.path.dirname(bpy.data.filepath), "assets", "library", "asawera_library.blend")
G_UNITS = 98.0 * 0.6          # gravity in scene units (1 unit = 10 cm), slowed a little so the eye can follow
SHELL_GLASS = mat_emit("Shell Glass V5", (0.45, 0.65, 1.0), 0.35, alpha=0.07)


def pop(ob, t, s=None, dur=0.45):
    """Pop in with overshoot: 0 → 112 % → 97 % → 100 % (lively, then it settles)."""
    s = Vector(s or ob.scale)
    f, n = sec(t), max(5, int(dur * FPS))
    kf(ob, "scale", 0, (0, 0, 0), 'CONSTANT')
    kf(ob, "scale", f, (0, 0, 0), 'BEZIER')
    kf(ob, "scale", f + int(n * 0.6), s * 1.12, 'BEZIER')
    kf(ob, "scale", f + int(n * 0.82), s * 0.97, 'BEZIER')
    kf(ob, "scale", f + n, s, 'BEZIER')
    return ob


def fall(ob, t0, a, b, bounce=0.06, soft=False):
    """Free fall from a to b (gravity: slow start, fast end), then the landing. Heavy things barely bounce and stop
    dead; soft things (soft=True) squash on impact and spring back. Returns the impact time (s)."""
    a, b = Vector(a), Vector(b)
    h = max(0.01, a.z - b.z)
    T = math.sqrt(2 * h / G_UNITS)
    f0, n = sec(t0), max(2, int(T * FPS))
    for k in range(n + 1):
        u = k / n
        p = a.lerp(b, u)
        p.z = a.z - 0.5 * G_UNITS * (u * T) ** 2
        kf(ob, "location", f0 + k, p, 'LINEAR')
    f = f0 + n
    if bounce > 0:                                   # one small hop, then still
        hb, Tb = h * bounce, math.sqrt(2 * h * bounce / G_UNITS)
        m = max(2, int(2 * Tb * FPS))
        for k in range(1, m + 1):
            u = k / m
            kf(ob, "location", f + k, b + Vector((0, 0, 4 * hb * u * (1 - u))), 'LINEAR')
        f += m
    kf(ob, "location", f, b, 'CONSTANT')
    if soft:
        s0 = Vector(ob.scale)
        kf(ob, "scale", f0 + n - 1, s0, 'BEZIER')
        kf(ob, "scale", f0 + n + 1, Vector((s0.x * 1.18, s0.y * 1.18, s0.z * 0.72)), 'BEZIER')
        kf(ob, "scale", f0 + n + 6, s0, 'BEZIER')
    return t0 + T


def glide(ob, t0, t1, a, b, antic=0.06, over=0.03):
    """Move a → b with anticipation (a small wind-up the other way) and a settle just past the target."""
    a, b = Vector(a), Vector(b)
    f0, f1 = sec(t0), sec(t1)
    d = b - a
    kf(ob, "location", f0, a, 'BEZIER')
    kf(ob, "location", f0 + max(2, int((f1 - f0) * 0.18)), a - d * antic, 'BEZIER')
    kf(ob, "location", f1 - max(2, int((f1 - f0) * 0.12)), b + d * over, 'BEZIER')
    kf(ob, "location", f1, b, 'BEZIER')


def wobble(ob, t, amp=0.18, dur=0.6):
    """Anticipation before a big action: a quick swell-and-shiver (scale), back to normal."""
    s0, f, n = Vector(ob.scale), sec(t), max(6, int(dur * FPS))
    for k, m in enumerate((1.0, 1 + amp, 1 - amp * 0.5, 1 + amp * 0.6, 1.0)):
        kf(ob, "scale", f + int(n * k / 4), s0 * m, 'BEZIER')


def splash(key, loc, t, r=1.0, n=7):
    """Something hits water: a ripple ring spreads and fades, droplets jump out on arcs and fall back."""
    loc, f = Vector(loc), sec(t)
    rg = ring_curve(key + " Ripple", 1.0, mat_emit("Ripple V5", (0.7, 0.9, 1.0), 1.2, alpha=0.6), None, depth=0.02,
                    loc=loc + Vector((0, 0, 0.02)))
    kf(rg, "scale", 0, (0, 0, 0), 'CONSTANT')
    kf(rg, "scale", f, (0.15 * r,) * 3, 'BEZIER')
    kf(rg, "scale", f + 18, (1.3 * r, 1.3 * r, 1), 'BEZIER')
    kf(rg, "scale", f + 24, (0, 0, 0), 'CONSTANT')
    drop_m = mat_emit("Droplet V5", (0.75, 0.9, 1.0), 1.5, alpha=0.8)
    rnd = random.Random(int(t * 100))
    for k in range(n):
        d = sphere("%s Drop %d" % (key, k), 0.05 * r, drop_m, loc, None, 10, 6)
        ang = 2 * math.pi * k / n + rnd.random() * 0.5
        vx, vy, vz = math.cos(ang) * 1.6 * r, math.sin(ang) * 0.6 * r, (3.0 + rnd.random() * 1.5) * r
        T = 2 * vz / G_UNITS
        m = max(4, int(T * FPS))
        hide_until(d, f)
        for j in range(m + 1):
            tt = T * j / m
            kf(d, "location", f + j, loc + Vector((vx * tt, vy * tt, vz * tt - 0.5 * G_UNITS * tt * tt)), 'LINEAR')
        hide_from(d, f + m + 1)


def atom3d(name, z, loc, t_in, spin_until=None, scale=1.0, f_out=None):
    """The book's Bohr atom (shells K, L, M …, outer electrons gold), built solid: each shell is also a faint glass
    sphere, so turning round it always shows a real 3D atom. Spins until spin_until (s). Returns (group, radii, outer)."""
    end = sec(spin_until) if spin_until is not None else scene.frame_end
    g, radii, outer = vatom(name, z, loc, sec(t_in), [(sec(t_in), end)], scale=scale, r0=0.5, dr=0.48, e_r=0.11,
                            nuc_r=0.11, f_out=f_out and sec(f_out))
    for k, rad in enumerate(radii):
        sphere("%s Glass %d" % (name, k), rad, SHELL_GLASS, (0, 0, 0), g, 32, 16)
    return g, radii, outer


def lib_obj(name, src, loc, size=1.0, rot=(0, 0, 0), parent=None):
    """A model from the shared library, LINKED (one copy of its mesh and textures for every lesson; improve it once in
    the library file and every lesson gets it). src = object name in the library; the library is in metres, so
    size 1.0 = real size (1 unit = 10 cm)."""
    src_ob = next((o for o in bpy.data.objects if o.name == src and o.library), None)
    if src_ob is None:
        with bpy.data.libraries.load(LIB_PATH, link=True) as (lib_in, lib_out):
            lib_out.objects = [src]
        src_ob = next(o for o in bpy.data.objects if o.name == src and o.library)
    ob = bpy.data.objects.new(N(name), src_ob.data)
    put(ob, "Models")
    ob.location, ob.rotation_euler, ob.scale = loc, rot, (10 * size,) * 3
    if parent:
        ob.parent = parent
    return ob


def fire(name, loc, rgb, t0, t1=None, s=1.0):
    """A flame of one colour. Blender keeps a simple marker; the app replaces it with the real fire (web/fx.js)."""
    return cflame(name, loc, rgb, t0, t1, s)
