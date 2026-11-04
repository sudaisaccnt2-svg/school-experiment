# ---- Film 513: Allotropes of carbon (textbook pp.146-147: Fig 5.17, crystalline vs amorphous carbon, i diamond  (v4 captions)
# Fig 5.18, ii graphite Fig 5.19, iii buckyball Fig 5.20) ----
import itertools
start_film("513", "513 Carbon Allotropes", 82.5)
END = scene.frame_end
SA, SB, SC, SD = (Vector((40 * k, 0, 0)) for k in range(4))

shot("Cam Forms", 0, 10, SA + Vector((0, 0, -0.3)), dist=13)
shot("Cam Diamond", 10, 34, SB + Vector((1.0, 0, -0.1)), dist=14.5, pitch=0.12)
shot("Cam Graphite", 34, 60, SC + Vector((1.0, 0, -0.3)), dist=14.5, pitch=0.4)
shot("Cam Buckyball", 60, None, SD + Vector((0, 0, -0.3)), dist=14, pitch=0.1)
for name, t in (("Carbon forms", 0), ("Diamond", 10), ("Graphite", 34), ("Buckyball", 60)):
    act(name, sec(t))

say('A', "Carbon's allotropes", 0.1, 10)
say('B1', 'Diamond: 4 bonds each', 10, 18)
say('B2', 'Locked tight: very hard', 18, 26)
say('B3', 'No free electrons: no current', 26, 34)
say('C1', 'Graphite: 3 bonds, flat sheets', 34, 42)
say('C2', 'Sheets slide: soft, slippery', 42, 51)
say('C3', 'Free electrons: conducts', 51, 60)
say('D1', 'Buckyball: a hollow cage', 60, 68)
say('D2', 'Shaped like a football', 68, 75)
say('D3', 'Lubricants, semiconductors', 75, 82)

CAT = mat_pbr("Carbon Atom", (0.2, 0.22, 0.27), metallic=0.3, roughness=0.3)
BND = mat_pbr("Carbon Bond", (0.75, 0.78, 0.85), metallic=0.3, roughness=0.35)


def bond(name, a, b, parent, r=0.05, mat=None):
    a, b = Vector(a), Vector(b)
    d = b - a
    c = cyl(name, r, r, d.length, mat or BND, (a + b) / 2, parent, segs=10)
    c.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
    return c


def net(name, pts, bonds, loc, t0, r=0.17, br=0.05, parent=None, step=1):
    g = empty(name, loc, parent)
    for i, p in enumerate(pts):
        s_ = sphere("%s A %d" % (name, i), r, CAT, p, g, 16, 8)
        appear(s_, sec(t0) + step * i, s=(r,) * 3)
    for k, (i, j) in enumerate(bonds):
        b = bond("%s B %d" % (name, k), pts[i], pts[j], g, br)
        hide_until(b, sec(t0) + step * max(i, j) + 4)
    return g


def neighbours(pts, d0, tol=0.08):
    return [(i, j) for i in range(len(pts)) for j in range(i + 1, len(pts)) if abs((pts[i] - pts[j]).length - d0) < tol]


def bulb(name, loc, t_on=None, t_in=0.0):
    g = empty(name, loc)
    cyl(name + " Base", 0.22, 0.22, 0.3, METAL, (0, 0, -0.45), g)
    off = sphere(name + " Off", 0.42, mat_emit("Bulb Off", (0.25, 0.28, 0.33), 0.4), (0, 0, 0), g, 24, 12)
    appear(g, sec(t_in), dur=10)
    if t_on is not None:
        on = sphere(name + " On", 0.48, mat_emit("Bulb On", (1.0, 0.85, 0.4), 12.0), (0, 0, 0), g, 24, 12)
        hide_until(on, sec(t_on))
    return g


def circuit(key, left, right, top_z, t_in, lit):
    """Battery and bulb above a sample, wires down to its two ends."""
    mid = (Vector(left) + Vector(right)) / 2
    bulb(key + " Bulb", Vector((mid.x + 1.4, mid.y, top_z)), t_in + 1.5 if lit else None, t_in)
    bat = box(key + " Battery", (1.0, 0.5, 0.5), mat_pbr("Battery", (0.15, 0.3, 0.7), roughness=0.4), Vector((mid.x - 1.4, mid.y, top_z)))
    appear(bat, sec(t_in), dur=10)
    W = mat_emit("Wire", (0.9, 0.55, 0.2), 1.0)
    for k, pts in enumerate(([Vector(left), Vector((left[0], mid.y, top_z)), Vector((mid.x - 1.9, mid.y, top_z))],
                             [Vector((mid.x - 0.9, mid.y, top_z)), Vector((mid.x + 0.95, mid.y, top_z))],
                             [Vector((mid.x + 1.85, mid.y, top_z)), Vector((right[0], mid.y, top_z)), Vector(right)])):
        w = pcurve("%s Wire %d" % (key, k), pts, W, 0.03, "Models")
        hide_until(w, sec(t_in))


# ---- A. the family: three crystalline forms + amorphous carbon ----
GEM = mat_emit("Diamond Glow", (0.8, 0.95, 1.0), 1.6)
GRAPH = mat_pbr("Graphite", (0.12, 0.12, 0.14), metallic=0.6, roughness=0.35)
dA = empty("A Diamond", SA + Vector((-3.8, 0, 0.2)))
cyl("A Dia Top", 0.8, 0.0, 0.8, GEM, (0, 0, 0.4), dA, segs=8)
cyl("A Dia Bot", 0.8, 0.0, 1.1, GEM, (0, 0, -0.55), dA, rot=(math.pi, 0, 0), segs=8)
appear(dA, sec(0.4), dur=10)
gA = empty("A Graphite", SA + Vector((-1.2, 0, -0.4)))
for k in range(5):
    box("A Gr %d" % k, (1.6, 1.2, 0.1), GRAPH, (0.05 * k, 0, 0.2 * k), gA)
appear(gA, sec(0.8), dur=10)
appear(sphere("A Bucky", 0.8, CAT, SA + Vector((1.4, 0, 0.2)), None, 12, 6), sec(1.2), s=(0.8,) * 3)
appear(blob("A Soot", (0.9, 0.6, 0.5), mat_pbr("Charcoal", (0.05, 0.05, 0.05), roughness=0.95), SA + Vector((4.0, 0, 0.0)),
            bump=0.4, seed=5), sec(1.6), dur=10)
big("Lbl A X", "crystalline", SA + Vector((-1.2, -0.6, 2.0)), 2.0, None, mat=M["gold"], size=0.5)
big("Lbl A Am", "amorphous", SA + Vector((4.0, -0.6, 2.0)), 2.6, None, mat=M["dim"], size=0.5)

# ---- B. diamond: one cubic cell of the tetrahedral network; then a dark bulb ----
a = 2.6
fcc = [Vector(p) for p in itertools.product((0, 1), repeat=3)] + [Vector(p) for p in
       ((0.5, 0.5, 0), (0.5, 0.5, 1), (0.5, 0, 0.5), (0.5, 1, 0.5), (0, 0.5, 0.5), (1, 0.5, 0.5))]
inner = [Vector(p) for p in ((0.25, 0.25, 0.25), (0.75, 0.75, 0.25), (0.75, 0.25, 0.75), (0.25, 0.75, 0.75))]
dpts = [(p - Vector((0.5, 0.5, 0.5))) * a for p in fcc + inner]
dn = net("B Net", dpts, neighbours(dpts, a * math.sqrt(3) / 4), SB + Vector((0, 0, -0.4)), 10.3, r=0.2, br=0.06, step=2)
dn.rotation_euler = (math.radians(10), 0, math.radians(20))
kf(dn, "rotation_euler", sec(10), (math.radians(10), 0, math.radians(20)), 'LINEAR')
kf(dn, "rotation_euler", sec(34), (math.radians(10), 0, math.radians(20 + 200)), 'LINEAR')
big("Lbl B 4", "4 bonds each", SB + Vector((3.0, -0.6, 0.0)), 13.0, None, mat=M["cyan"], size=0.5, align='LEFT')
circuit("B", SB + Vector((-1.9, -0.3, -0.4)), SB + Vector((1.9, -0.3, -0.4)), 2.2, 26.4, lit=False)
big("Lbl B Off", "no current", SB + Vector((3.0, -0.6, 1.2)), 28.0, None, mat=M["dim"], size=0.5, align='LEFT')

# ---- C. graphite: three hexagon sheets; the top one slides; electrons run along; the bulb lights ----
def honeycomb(rad, bl=0.55):
    pts = []
    for i in range(-6, 7):
        for j in range(-6, 7):
            for s_ in (0, 1):
                x = bl * math.sqrt(3) * (i + 0.5 * j)
                y = bl * 1.5 * j + (bl if s_ else 0)
                p = Vector((x, y, 0))
                if p.length < rad:
                    pts.append(p)
    return pts


hp = honeycomb(2.3)
hb = neighbours(hp, 0.55)
layers = []
for k in range(3):
    L = net("C Sheet %d" % k, hp, hb, SC + Vector((0, 0, -1.6 + 1.25 * k)), 34.3 + 0.8 * k, r=0.11, br=0.035, step=0)
    layers.append(L)
DASH = mat_emit("Weak Link", (0.5, 0.6, 0.8), 0.8)
for k in range(2):
    for j, p in enumerate(hp[::9]):
        d = pcurve("C Link %d %d" % (k, j), [SC + p + Vector((0, 0, -1.6 + 1.25 * k + 0.15)), SC + p + Vector((0, 0, -1.6 + 1.25 * (k + 1) - 0.15))],
                   DASH, 0.012, "Models")
        hide_until(d, sec(42.2))
        hide_from(d, sec(44.0))
top = layers[2]
move(top, sec(44.0), sec(46.5), SC + Vector((0, 0, 0.9)), SC + Vector((1.4, 0, 0.9)))
move(top, sec(47.5), sec(50.0), SC + Vector((1.4, 0, 0.9)), SC + Vector((0, 0, 0.9)))
for k in range(8):
    e = electron("C Free %d" % k, None, SC + Vector((-2.2, -0.2 + 0.1 * (k % 3), -1.6 + 1.25 * (k % 3) + 0.15)), 0.1)
    hide_until(e, sec(52.0 + 0.4 * k))
    move(e, sec(52.0 + 0.4 * k), sec(55.5 + 0.4 * k), e.location.copy(), e.location + Vector((4.4, 0, 0)), 'LINEAR')
    hide_from(e, sec(55.6 + 0.4 * k))
circuit("C", SC + Vector((-2.4, -0.2, -0.35)), SC + Vector((2.4, -0.2, -0.35)), 2.3, 51.2, lit=True)
big("Lbl C 3", "3 bonds each", SC + Vector((3.0, -0.6, 1.4)), 36.0, 43.8, mat=M["cyan"], size=0.5, align='LEFT')
big("Lbl C S", "sheets slide", SC + Vector((3.0, -0.6, 1.4)), 44.2, 51.0, mat=M["gold"], size=0.5, align='LEFT')

# ---- D. buckyball C₆₀: a hollow cage of pentagons and hexagons ----
phi = (1 + 5 ** 0.5) / 2
base = [(0, 1, 3 * phi), (1, 2 + phi, 2 * phi), (phi, 2, 2 * phi + 1)]
bp = set()
for b in base:
    for perm in ((0, 1, 2), (1, 2, 0), (2, 0, 1)):
        for sg in itertools.product((1, -1), repeat=3):
            v = tuple(round(sg[i] * b[perm[i]], 6) for i in range(3))
            bp.add(v)
bpts = [Vector(v) * 0.42 for v in sorted(bp)]
bk = net("D Ball", bpts, neighbours(bpts, 2 * 0.42, 0.02), SD + Vector((0, 0, 0.25)), 60.3, r=0.15, br=0.045, step=1)
kf(bk, "rotation_euler", sec(60), (0.3, 0, 0), 'LINEAR')
kf(bk, "rotation_euler", sec(86), (0.3, 0, math.radians(260)), 'LINEAR')
big("Lbl D 60", "C₆₀", SD + Vector((0, -0.6, 2.95)), 62.0, None, mat=M["gold"], size=0.6)
big("Lbl D H", "hollow inside", SD + Vector((2.6, -0.6, 0.8)), 64.0, 75.0, mat=M["cyan"], size=0.48, align='LEFT')
finish_film()
