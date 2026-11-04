# ---- Unit 4 (Structure of Molecules) helpers. Append after u3/u3lib.py:
#   python scripts/bsend.py scripts/common.py scripts/p2/lib.py scripts/u3/u3lib.py scripts/u4/u4lib.py scripts/u4/f401_why.py
# Pictures: flat Bohr atoms (vatom) for ions, book-style "dot and cross" rings (lring) for sharing, ball-and-stick
# molecules (bstick) for shapes and forces. Atom A's electrons are blue, atom B's gold (the book's dots and crosses).

CPK = {"H": (0.92, 0.94, 1.0), "C": (0.22, 0.24, 0.3), "O": (0.95, 0.25, 0.22), "N": (0.3, 0.45, 1.0),
       "Cl": (0.35, 0.9, 0.4), "F": (0.7, 1.0, 0.55), "S": (1.0, 0.85, 0.3), "B": (1.0, 0.6, 0.7), "Na": (0.7, 0.45, 1.0),
       "Ca": (0.85, 0.85, 0.75), "Mg": (0.55, 0.85, 0.35), "Br": (0.7, 0.2, 0.15)}
CPK_R = {"H": 0.3, "C": 0.45, "O": 0.44, "N": 0.45, "Cl": 0.6, "F": 0.4, "S": 0.58, "B": 0.48, "Na": 0.55, "Br": 0.62}
E_BLUE = mat_emit("Electron Dot Blue", (0.35, 0.65, 1.0), 4.0)
E_GOLD = mat_emit("Electron Dot Gold", (1.0, 0.75, 0.3), 4.0)
BOND_M = mat_pbr("Bond Stick", (0.85, 0.87, 0.92), metallic=0.3, roughness=0.3)


def cpk_mat(sym):
    return mat_pbr("CPK " + sym, CPK.get(sym, (0.8, 0.8, 0.8)), roughness=0.3)


def wpos(ob, t):
    """World position of `ob` at time t (seconds): evaluates the animation (pivots must be keyed already)."""
    scene.frame_set(sec(t))
    p = ob.matrix_world.translation.copy()
    scene.frame_set(1)
    return p


def travel(name, a, b, t0, dur=1.4, r=0.11, mat=None, lift=0.9):
    """A free electron flying from world point a to b in an arc (ionic transfer), visible only while it flies."""
    a, b = Vector(a), Vector(b)
    e = electron(name, None, a, r, mat=mat or E_GOLD)
    hide_until(e, sec(t0))
    kf(e, "location", sec(t0), a, 'BEZIER')
    kf(e, "location", sec(t0 + dur / 2), (a + b) / 2 + Vector((0, -0.4, lift)), 'BEZIER')
    kf(e, "location", sec(t0 + dur), b, 'BEZIER')
    hide_from(e, sec(t0 + dur) + 1)
    return e


def lewis_angles(n):
    """Seat angles (degrees) for n valence electrons: one per side first (top, right, bottom, left), then pairs."""
    sides = [90, 0, 270, 180]
    out = []
    for k in range(n):
        s = sides[k % 4]
        out.append((s, k // 4))
    res = []
    for s in sides:
        here = [o for o in out if o[0] == s]
        if len(here) == 1:
            res.append(s)
        elif len(here) == 2:
            res += [s - 14, s + 14]
    return res


class LRing:
    """Book-style dot-and-cross atom: a ring, its symbol and its valence electrons (children of the ring group).
    The ring group is rotated 90° about X: local (x, y) = world (x, z)."""

    def __init__(self, name, sym, loc, n, t0, t1=None, r=1.0, emat=None, ring_mat=None, size=0.62, angles=None):
        self.name, self.r, self.loc = name, r, Vector(loc)
        self.g = empty(name, self.loc, rot=(90 * DEG, 0, 0))
        ring_curve(name + " Ring", r, ring_mat or M["orbit"], self.g, depth=0.022)
        self.t = _text(name + " Sym", sym, self.loc + Vector((0, -0.1, 0)), size, M["white"], weight="semibold")
        shadow(self.t)
        self.es = []
        for k, a in enumerate(angles if angles is not None else lewis_angles(n)):
            e = dot("%s e%d" % (name, k), 0.11, emat or E_BLUE, self.g, (r * math.cos(a * DEG), r * math.sin(a * DEG), 0.02))
            self.es.append(e)
        appear(self.g, sec(t0), t1 and sec(t1), dur=10)
        appear(self.t, sec(t0), t1 and sec(t1))

    def move(self, t0, t1, to):
        to = Vector(to)
        move(self.g, sec(t0), sec(t1), self.loc, to)
        move(self.t, sec(t0), sec(t1), self.loc + Vector((0, -0.1, 0)), to + Vector((0, -0.1, 0)))
        self.loc = to

    def seat(self, k, t0, world, dur=0.8):
        """Slide electron k to a world point (e.g. into the overlap between two rings)."""
        e = self.es[k]
        home = e.location.copy()
        d = Vector(world) - self.loc
        kf(e, "location", sec(t0), home, 'BEZIER')
        kf(e, "location", sec(t0 + dur), Vector((d.x, d.z, 0.04)), 'BEZIER')


def share(A, B, ka, kb, t0, dz=0.0, gap=0.17):
    """A's electron ka and B's electron kb slide into the overlap of the two rings as one shared pair."""
    mid = (A.loc + B.loc) / 2 + Vector((0, 0, dz))
    A.seat(ka, t0, mid + Vector((0, 0, gap)))
    B.seat(kb, t0 + 0.2, mid + Vector((0, 0, -gap)))
    return mid


def bstick(name, atoms, bonds, loc, t0, t1=None, scale=1.0, parent=None, lone=()):
    """Ball-and-stick molecule. atoms = [(sym, (x, y, z))], bonds = [(i, j, order)], lone = [(atom index, dir)]
    lone pairs (two gold dots). Returns (group, atom spheres)."""
    g = empty(name, loc, parent)
    objs = []
    for k, (sym, p) in enumerate(atoms):
        s = sphere("%s %s%d" % (name, sym, k), CPK_R.get(sym, 0.5) * scale, cpk_mat(sym), Vector(p) * scale, g, 32, 16)
        objs.append(s)
    for i, j, order in bonds:
        a, b = Vector(atoms[i][1]) * scale, Vector(atoms[j][1]) * scale
        d = b - a
        side = d.cross(Vector((0, -1, 0)))
        side = (side if side.length > 1e-4 else d.cross(Vector((1, 0, 0)))).normalized()
        rot = d.to_track_quat('Z', 'Y').to_euler()
        for m in range(order):
            off = side * (m - (order - 1) / 2) * 0.17 * scale
            cyl("%s Bond %d-%d %d" % (name, i, j, m), 0.06 * scale, 0.06 * scale, d.length, BOND_M, (a + b) / 2 + off, g,
                rot, segs=12)
    for k, (i, dvec) in enumerate(lone):
        d = Vector(dvec).normalized()
        c = Vector(atoms[i][1]) * scale + d * (CPK_R.get(atoms[i][0], 0.5) + 0.32) * scale
        side = d.cross(Vector((0, -1, 0)))
        side = (side if side.length > 1e-4 else Vector((1, 0, 0))).normalized()
        for s_ in (-1, 1):
            dot("%s Lone %d %d" % (name, k, s_), 0.09 * scale, E_GOLD, g, c + side * 0.12 * s_ * scale)
    appear(g, sec(t0), t1 and sec(t1), dur=12)
    return g, objs


def turn(ob, t0, t1, turns=1.0, axis=2):
    """Slow spin of `ob` between t0 and t1 (seconds), one thing moving at a time."""
    focus_spin(ob, [(sec(t0), sec(t1))], 2 * math.pi * turns / max(1, sec(t1) - sec(t0)), axis=axis)


# ball-and-stick coordinates (book Fig 4.18 angles), units ≈ 1 Å
def _bent(sym, x, ang, L):
    h = math.radians(ang / 2)
    return [(sym, (0, 0, 0)), (x, (-L * math.sin(h), 0, -L * math.cos(h))), (x, (L * math.sin(h), 0, -L * math.cos(h)))]


_T = [Vector(v).normalized() for v in ((1, -1, 1), (-1, 1, 1), (1, 1, -1), (-1, -1, -1))]
SHAPES = {
    "CO2": ([("C", (0, 0, 0)), ("O", (-1.25, 0, 0)), ("O", (1.25, 0, 0))], [(0, 1, 2), (0, 2, 2)], []),
    "SO2": (_bent("S", "O", 119.5, 1.45), [(0, 1, 2), (0, 2, 2)], [(0, (0, 0, 1))]),
    "BCl3": ([("B", (0, 0, 0))] + [("Cl", (1.75 * math.cos(math.radians(a)), 0, 1.75 * math.sin(math.radians(a))))
                                 for a in (90, 210, 330)], [(0, 1, 1), (0, 2, 1), (0, 3, 1)], []),
    "H2O": (_bent("O", "H", 104.5, 1.0), [(0, 1, 1), (0, 2, 1)], [(0, (-0.6, 0, 1)), (0, (0.6, 0, 1))]),
    "CH4": ([("C", (0, 0, 0))] + [("H", tuple(v * 1.1)) for v in _T], [(0, k, 1) for k in range(1, 5)], []),
    "NH3": ([("N", (0, 0, 0))] + [("H", (1.0 * math.cos(math.radians(a)), 1.0 * math.sin(math.radians(a)), -0.38))
                                for a in (90, 210, 330)], [(0, 1, 1), (0, 2, 1), (0, 3, 1)], [(0, (0, 0, 1))]),
}


def hand(e_from, e_to, t, name, dur=1.8, lift=1.2):
    """Ionic handover: electron e_from (in one vatom) flies to the seat of e_to (hidden until it lands) in another.
    Both atoms must be still at time t."""
    a, b = wpos(e_from, t), wpos(e_to, t)
    hide_from(e_from, sec(t))
    travel(name, a, b, t, dur=dur, lift=lift)
    hide_until(e_to, sec(t + dur))


def drop_ring(atom_name, k, t):
    """Pop out ring k of a vatom (its shell is empty after the electrons left)."""
    ring = bpy.data.objects[N("%s Ring %d" % (atom_name, k))]
    pop_out(ring, sec(t), 10, tuple(ring.scale))


def pairs(A, B, kas, kbs, t0, step=0.38, off=0.13):
    """n shared pairs between rings A and B (any direction): A's electrons kas and B's kbs line up in rows across
    the overlap, A's on its own side. 1 row = single bond, 2 = double, 3 = triple."""
    d = (B.loc - A.loc).normalized()
    p = Vector((-d.z, 0, d.x))
    mid = (A.loc + B.loc) / 2
    n = len(kas)
    for i, (ka, kb) in enumerate(zip(kas, kbs)):
        row = mid + p * (i - (n - 1) / 2) * step
        A.seat(ka, t0 + 0.25 * i, row - d * off)
        B.seat(kb, t0 + 0.25 * i + 0.1, row + d * off)
    return mid


def lewis(name, atoms, bonds, lone, loc, t0, t_line=None, t1=None, size=0.75, step=0.3):
    """Flat Lewis structure. atoms = [(sym, (x, z))], bonds = [(i, j, order)], lone = [(i, angle°)] lone pairs.
    Each shared pair is a blue + gold dot; at t_line the pairs pop out and turn into lines (–, =, ≡)."""
    loc = Vector(loc)
    W = lambda x, z, y=0.0: loc + Vector((x, y, z))
    out = {"dots": [], "lines": []}
    for k, (sym, (x, z)) in enumerate(atoms):
        t = _text("%s A%d" % (name, k), sym, W(x, z + 0.02, -0.1), size, M["white"], weight="semibold")
        shadow(t)
        appear(t, sec(t0 + 0.15 * k), t1 and sec(t1))
    for b, (i, j, order) in enumerate(bonds):
        a, c = Vector((atoms[i][1][0], 0, atoms[i][1][1])), Vector((atoms[j][1][0], 0, atoms[j][1][1]))
        d = (c - a).normalized()
        p = Vector((-d.z, 0, d.x))
        mid = (a + c) / 2
        for m in range(order):
            off = (m - (order - 1) / 2) * step
            for s_, mat in ((-1, E_BLUE), (1, E_GOLD)):
                q = mid + p * 0.11 * s_ if order == 1 else mid + p * off + d * 0.11 * s_
                e = dot("%s B%d %d %d" % (name, b, m, s_), 0.08, mat, None, loc + Vector((q.x, -0.3, q.z)))
                appear(e, sec(t0 + 0.6 + 0.2 * b), sec(t_line) if t_line else (t1 and sec(t1)), s=(0.08,) * 3)
                out["dots"].append(e)
            if t_line:
                L = (c - a).length - 0.85 * size
                rot = d.to_track_quat('Z', 'Y').to_euler()
                ln = cyl("%s L%d %d" % (name, b, m), 0.045, 0.045, L, M["white"], loc + mid + p * off * 0.6 + Vector((0, -0.3, 0)),
                         None, rot, segs=10)
                appear(ln, sec(t_line + 0.3), t1 and sec(t1))
                out["lines"].append(ln)
    for k, (i, ang) in enumerate(lone):
        x, z = atoms[i][1]
        u = Vector((math.cos(math.radians(ang)), 0, math.sin(math.radians(ang))))
        c = Vector((x, 0, z)) + u * 0.48 * size / 0.75
        side = Vector((-u.z, 0, u.x))
        for s_ in (-1, 1):
            q = c + side * 0.11 * s_
            e = dot("%s Lone %d %d" % (name, k, s_), 0.08, E_GOLD, None, loc + Vector((q.x, -0.3, q.z)))
            appear(e, sec(t0 + 1.0 + 0.1 * k), t1 and sec(t1), s=(0.08,) * 3)
    return out
