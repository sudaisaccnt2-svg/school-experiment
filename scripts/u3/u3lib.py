# ---- Unit 3 (Periodic Table) shared helpers. Append after p2/lib.py:
#   python scripts/bsend.py scripts/common.py scripts/p2/lib.py scripts/u3/u3lib.py scripts/u3/f301_table.py
# v3 layout (docs/STORYBOARD.md): one picture per shot, big and centred; ONE caption place (bottom centre, gold
# headline + one plain line); at most 3 big world labels; one thing moves at a time; ~8-12 s per idea.
# Book values are printed as in the book (exam answers); corrections live in docs/NOTES.md.

NAMES = ("H Hydrogen,He Helium,Li Lithium,Be Beryllium,B Boron,C Carbon,N Nitrogen,O Oxygen,F Fluorine,Ne Neon,"
         "Na Sodium,Mg Magnesium,Al Aluminium,Si Silicon,P Phosphorus,S Sulphur,Cl Chlorine,Ar Argon,K Potassium,"
         "Ca Calcium,Sc Scandium,Ti Titanium,V Vanadium,Cr Chromium,Mn Manganese,Fe Iron,Co Cobalt,Ni Nickel,"
         "Cu Copper,Zn Zinc,Ga Gallium,Ge Germanium,As Arsenic,Se Selenium,Br Bromine,Kr Krypton,Rb Rubidium,"
         "Sr Strontium,Y Yttrium,Zr Zirconium,Nb Niobium,Mo Molybdenum,Tc Technetium,Ru Ruthenium,Rh Rhodium,"
         "Pd Palladium,Ag Silver,Cd Cadmium,In Indium,Sn Tin,Sb Antimony,Te Tellurium,I Iodine,Xe Xenon,Cs Cesium,"
         "Ba Barium,La Lanthanum,Ce Cerium,Pr Praseodymium,Nd Neodymium,Pm Promethium,Sm Samarium,Eu Europium,"
         "Gd Gadolinium,Tb Terbium,Dy Dysprosium,Ho Holmium,Er Erbium,Tm Thulium,Yb Ytterbium,Lu Lutetium,"
         "Hf Hafnium,Ta Tantalum,W Tungsten,Re Rhenium,Os Osmium,Ir Iridium,Pt Platinum,Au Gold,Hg Mercury,"
         "Tl Thallium,Pb Lead,Bi Bismuth,Po Polonium,At Astatine,Rn Radon,Fr Francium,Ra Radium,Ac Actinium,"
         "Th Thorium,Pa Protactinium,U Uranium,Np Neptunium,Pu Plutonium,Am Americium,Cm Curium,Bk Berkelium,"
         "Cf Californium,Es Einsteinium,Fm Fermium,Md Mendelevium,No Nobelium,Lr Lawrencium,Rf Rutherfordium,"
         "Db Dubnium,Sg Seaborgium,Bh Bohrium,Hs Hassium,Mt Meitnerium,Ds Darmstadtium,Rg Roentgenium,"
         "Cn Copernicium,Nh Nihonium,Fl Flerovium,Mc Moscovium,Lv Livermorium,Ts Tennessine,Og Oganesson")
SYM, NAME = {}, {}
for _z, _p in enumerate(NAMES.split(","), 1):
    SYM[_z], NAME[_z] = _p.split(" ")
ZOF = {v: k for k, v in SYM.items()}


def period_of(z):
    return 1 if z <= 2 else 2 if z <= 10 else 3 if z <= 18 else 4 if z <= 36 else 5 if z <= 54 else 6 if z <= 86 else 7


def place(z):
    """(row, col) in the book's layout: rows 1-7 = periods, rows 8/9 = lanthanide / actinide rows (Ce-Lu, Th-Lr,
    columns 4-17, as on p.67: La and Ac stay in the main table)."""
    p = period_of(z)
    if p == 1:
        return 1, (1 if z == 1 else 18)
    if p in (2, 3):
        s0 = 3 if p == 2 else 11
        k = z - s0
        return p, (k + 1 if k < 2 else k + 11)
    if p in (4, 5):
        return p, z - (19 if p == 4 else 37) + 1
    if p == 6:
        if z <= 57:
            return 6, z - 54
        if z <= 71:
            return 8, z - 58 + 4
        return 6, z - 68
    if z <= 89:
        return 7, z - 86
    if z <= 103:
        return 9, z - 90 + 4
    return 7, z - 100


ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"]
GROUP_NAME = {1: "IA", 2: "IIA", 3: "IIIB", 4: "IVB", 5: "VB", 6: "VIB", 7: "VIIB", 8: "VIIIB", 9: "VIIIB",
              10: "VIIIB", 11: "IB", 12: "IIB", 13: "IIIA", 14: "IVA", 15: "VA", 16: "VIA", 17: "VIIA", 18: "VIIIA"}
A_COLS = [1, 2, 13, 14, 15, 16, 17, 18]          # the 8 "A" groups of the book (IA ... VIIIA)
METALLOID = {5, 14, 32, 33, 51, 52}
NONMETAL = {1, 6, 7, 8, 15, 16, 34}
HALOGEN = {9, 17, 35, 53, 85, 117}


def category(z):
    r, c = place(z)
    if r == 8:
        return "lanthanide"
    if r == 9:
        return "actinide"
    if c == 18:
        return "noble"
    if z in HALOGEN:
        return "halogen"
    if z in NONMETAL:
        return "nonmetal"
    if z in METALLOID:
        return "metalloid"
    if c == 1:
        return "alkali"
    if c == 2:
        return "alkaline"
    if 3 <= c <= 12:
        return "transition"
    return "metal"


def block(z, book=False):
    """s/p/d/f. book=True follows the book (p.70): helium sits in group VIIIA, so it counts as p-block."""
    r, c = place(z)
    if book and z == 2:
        return "p"
    if r >= 8:
        return "f"
    if z == 2 or c <= 2:
        return "s"
    return "d" if c <= 12 else "p"


CAT_RGB = {"alkali": (1.0, 0.42, 0.32), "alkaline": (1.0, 0.68, 0.25), "transition": (0.32, 0.58, 1.0),
           "metal": (0.35, 0.82, 0.86), "metalloid": (0.62, 0.9, 0.35), "nonmetal": (0.3, 1.0, 0.55),
           "halogen": (1.0, 0.92, 0.35), "noble": (0.74, 0.5, 1.0), "lanthanide": (1.0, 0.45, 0.78),
           "actinide": (0.95, 0.32, 0.45)}
CAT_LABEL = {"alkali": "Alkali metals", "alkaline": "Alkaline earth metals", "transition": "Transition metals",
             "metal": "Other metals", "metalloid": "Metalloids", "nonmetal": "Non-metals", "halogen": "Halogens",
             "noble": "Noble gases", "lanthanide": "Lanthanides", "actinide": "Actinides"}
BLOCK_RGB = {"s": (1.0, 0.45, 0.35), "p": (0.35, 1.0, 0.55), "d": (0.35, 0.6, 1.0), "f": (1.0, 0.5, 0.85)}

# ---- book tables (as printed) ----
_R = ("H .37 He .49 Li 1.23 Be .89 B .80 C .77 N .74 O .74 F .72 Ne .51 Na 1.35 Mg 1.36 Al 1.25 Si 1.17 P 1.10 "
      "S 1.04 Cl .99 Ar .88 K 2.03 Ca 1.74 Ga 1.25 Ge 1.22 As 1.21 Se 1.17 Br 1.14 Kr 1.03 Rb 2.16 Sr 1.91 In 1.59 "
      "Sn 1.41 Sb 1.41 Te 1.37 I 1.53 Xe 1.24 Cs 2.35 Ba 1.98 Tl 1.55 Pb 1.54 Bi 1.52 Po 1.53 At 1.63 Rn 1.34")
_IE = ("H 1312 He 2372 Li 520 Be 899 B 801 C 1086 N 1402 O 1314 F 1681 Ne 2081 Na 496 Mg 738 Al 578 Si 786 P 1012 "
       "S 1000 Cl 1251 Ar 1521 K 419 Ca 590 Ga 579 Ge 762 As 947 Se 941 Br 1140 Kr 1351 Rb 403 Sr 549 In 558 Sn 709 "
       "Sb 834 Te 869 I 1008 Xe 1170 Cs 376 Ba 502 Tl 589 Pb 716 Bi 703 Po 812 At 1002 Rn 1038")
_EA = ("H -72.8 He +21 Li -59.6 Be +241 B -26.7 C -122 N 0 O -141 F -328 Ne +29 Na -52.9 Mg +230 Al -42.5 Si -134 "
       "P -72.0 S -200 Cl -349 Ar +34 K -48.4 Ca +156 Ga -28.9 Ge -119 As -78.2 Se -195 Br -325 Kr +39 Rb -46.9 "
       "Sr +167 In -28.9 Sn -107 Sb -103 Te -190 I -295 Xe +40 Cs -45.5 Ba +52 Tl -19.3 Pb -35.1 Bi -91.3 Po -183 "
       "At -270 Rn +41")
_EN = ("H 2.1 Li 1.0 Be 1.6 B 2.0 C 2.5 N 3.0 O 3.5 F 4.0 Na 0.9 Mg 1.2 Al 1.5 Si 1.8 P 2.1 S 2.5 Cl 3.0 K 0.8 "
       "Ca 1.0 Sc 1.3 Ti 1.5 V 1.6 Cr 1.6 Mn 1.5 Fe 1.8 Co 1.9 Ni 1.9 Cu 1.9 Zn 1.6 Ga 1.6 Ge 1.8 As 2.0 Se 2.4 "
       "Br 2.8 Rb 0.8 Sr 1.0 Y 1.2 Zr 1.4 Nb 1.6 Mo 1.8 Tc 1.9 Ru 2.2 Rh 2.2 Pd 2.2 Ag 1.9 Cd 1.7 In 1.7 Sn 1.8 "
       "Sb 1.9 Te 2.1 I 2.5 Cs 0.7 Ba 0.9 La 1.0 Hf 1.3 Ta 1.5 W 1.7 Re 1.9 Os 2.2 Ir 2.2 Pt 2.2 Au 2.4 Hg 1.9 "
       "Tl 1.8 Pb 1.9 Bi 1.9 Po 2.0 At 2.1")


def _table(s, cast=float):
    t = s.split()
    return {t[i]: cast(t[i + 1]) for i in range(0, len(t), 2)}


RADIUS, IE1, EA, EN = _table(_R), _table(_IE, int), _table(_EA), _table(_EN)

AUFBAU = [(1, 2), (2, 2), (2, 6), (3, 2), (3, 6), (4, 2), (3, 10), (4, 6), (5, 2), (4, 10), (5, 6), (6, 2), (4, 14),
          (5, 10), (6, 6), (7, 2), (5, 14), (6, 10), (7, 6)]


def shells_of(z):
    """Electrons per shell K, L, M ... by the Aufbau order (fine for the elements the films use)."""
    out = [0] * 7
    left = z
    for n, cap in AUFBAU:
        k = min(cap, left)
        out[n - 1] += k
        left -= k
        if not left:
            break
    while out and out[-1] == 0:
        out.pop()
    return out


# ---------------------------------------------------------------- the v3 caption + shots
SHOTS = []          # (t0, camera) sorted


def shot(name, t0, t1, target, dist=22.0, lens=40, up=0.0, drift=0.6, pitch=0.0, cut_here=True):
    """One shot = one camera that drifts slowly to the right. target = what it looks at; pitch = how much it looks
    down (camera raised by dist*pitch). Cuts at t0. Returns the camera."""
    tg = Vector(target)
    eye = tg + Vector((0, -dist, dist * pitch + up))
    f0, f1 = (1 if t0 <= 0 else sec(t0)), (scene.frame_end if t1 is None else sec(t1))
    cam = camera(name, lens, eye + Vector((-drift, 0, 0)), eye + Vector((drift, dist * 0.03, 0)), tg, f0, f1,
                 shift=(0, 0))
    if cut_here:
        cut(f0, cam)
        SHOTS.append((t0, cam))
        SHOTS.sort(key=lambda x: x[0])
    return cam


def cam_at(t):
    c = SHOTS[0][1]
    for t0, cc in SHOTS:
        if t >= t0 - 1e-6:
            c = cc
    return c


def cap(key, head, body, t0, t1=None):
    """The ONE caption place: gold headline + one plain line, bottom centre, on the camera live at t0."""
    c = cam_at(t0 + 0.01)
    hud("Cap " + key, head, c, 0.5, 0.185, 0.072, sec(t0 + 0.2), None if t1 is None else sec(t1 - 0.2), M["gold"],
        align='CENTER', weight="semibold")
    if body:
        hud("Cap " + key + " b", body, c, 0.5, 0.09, 0.046, sec(t0 + 0.5), None if t1 is None else sec(t1 - 0.2),
            align='CENTER')


def caps(rows):
    """rows of (key, head, body, t0, t1): one caption after another."""
    for r in rows:
        cap(*r)


def big(name, body, loc, t0, t1=None, mat=None, size=0.55, align='CENTER'):
    """Big world label (≤ 3 per shot), no leader line."""
    return label(name, body, loc, size, sec(t0), None if t1 is None else sec(t1), mat=mat or M["white"],
                 align=align, weight="semibold")


# ---------------------------------------------------------------- periodic table tiles
P = 1.0             # tile pitch (one tile + gap)
TS = 0.86           # tile size
TH = 0.14           # tile thickness (bars scale this)
_TM = {}


def tile_mats():
    if _TM:
        return _TM
    for cat, rgb in list(CAT_RGB.items()) + [("b_" + k, v) for k, v in BLOCK_RGB.items()] + \
            [("plain", (0.55, 0.62, 0.75)), ("goldt", (1.0, 0.72, 0.28)), ("warn", (1.0, 0.3, 0.25))]:
        face = mat_emit("U3 Tile %s" % cat, tuple(0.22 * c for c in rgb), 1.0)
        rim = mat_emit("U3 Rim %s" % cat, rgb, 1.6)
        _TM[cat] = (face, rim)
    _TM["sym"] = mat_emit("U3 Tile Symbol", (0.95, 0.97, 1.0), 1.4)
    return _TM


def tile_mesh(cat):
    """Unit-height rounded box (z 0..1, scaled by TH) on a bright rim plate: one shared mesh per colour."""
    key = "U3 TileMesh " + cat
    me = bpy.data.meshes.get(key)
    if me:
        return me
    face, rim = tile_mats()[cat]
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector((v.co.x * TS * 0.92, v.co.y * TS * 0.92, v.co.z + 0.5))
    bmesh.ops.bevel(bm, geom=[e for e in bm.edges if abs(e.verts[0].co.z - e.verts[1].co.z) > 0.5],
                    offset=0.07, segments=3, affect='EDGES')
    nf = len(bm.faces)
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=TS / 2, matrix=Matrix.Translation((0, 0, 0.003)))
    bm.faces.ensure_lookup_table()
    for f in bm.faces[nf:]:
        f.material_index = 1
    for f in bm.faces[:nf]:
        f.smooth = False
    me = bpy.data.meshes.new(key)
    bm.to_mesh(me)
    bm.free()
    me.materials.append(face)
    me.materials.append(rim)
    return me


class Table:
    """The periodic table as 3D tiles under one root. orient='wall' stands it up facing the camera (-Y);
    'floor' lays it down (rows go away from the camera, bars rise up). Each tile: T[z] = dict(t=empty, body, sym, num).
    Local tile coordinates: x = column, y = up the page, z = toward the viewer."""

    def __init__(self, name, loc=(0, 0, 0), orient='wall', zs=None, numbers=False, color="cat", f_in=None,
                 order_dur=0.0, frow_gap=0.45, names=False):
        tile_mats()
        self.name = name
        self.root = empty(name, loc, rot=((90 * DEG, 0, 0) if orient == 'wall' else (0, 0, 0)))
        self.T = {}
        self.zs = list(zs or range(1, 119))
        self.frow_gap = frow_gap
        for z in self.zs:
            cat = (color(z) if callable(color) else category(z) if color == "cat" else
                   ("b_" + block(z) if color == "block" else color))
            t = empty("%s %s" % (name, SYM[z]), self.xy(z), self.root)
            body = bpy.data.objects.new(N("%s %s Body" % (name, SYM[z])), tile_mesh(cat))
            put(body, "Models")
            body.parent = t
            body.scale = (1, 1, TH)
            sym = _text("%s %s Sym" % (name, SYM[z]), SYM[z], (0, -0.04 if numbers else 0, TH + 0.01),
                        0.40 * (0.85 if len(SYM[z]) > 1 else 1.0), _TM["sym"], rot=(0, 0, 0), weight="semibold")
            sym.parent = t
            d = {"t": t, "body": body, "sym": sym, "cat": cat, "num": None, "h": TH}
            if numbers:
                num = _text("%s %s Num" % (name, SYM[z]), str(z), (-0.33, 0.27, TH + 0.01), 0.17,
                            tile_mats()[cat][1], align='LEFT', rot=(0, 0, 0))
                num.parent = t
                d["num"] = num
            self.T[z] = d
        if f_in is not None:
            for i, z in enumerate(self.zs):
                appear(self.T[z]["t"], f_in + int(i * order_dur * FPS / max(len(self.zs), 1)), dur=6)
        bpy.context.view_layer.update()

    def xy(self, z):
        r, c = place(z)
        y = (4 - r) * P if r <= 7 else (4 - r) * P - self.frow_gap
        return Vector(((c - 9.5) * P, y, 0))

    def world(self, z, up=0.0):
        """World position of tile z's face centre (up = extra distance toward the viewer)."""
        return self.root.matrix_world @ (self.xy(z) + Vector((0, 0, TH + up)))

    def center(self, rows=7):
        return self.root.matrix_world @ Vector((0, (4 - (1 + rows) / 2) * P, 0))

    # ---- motion helpers (all transform-only) ----
    def bar(self, z, f0, f1, h, interp='BEZIER'):
        """Grow tile z into a bar of height h (local z), symbol riding on top."""
        d = self.T[z]
        kf(d["body"], "scale", f0, (1, 1, d["h"]), interp)
        kf(d["body"], "scale", f1, (1, 1, h), interp)
        for o in (d["sym"], d["num"]):
            if o is not None:
                p = o.location.copy()
                kf(o, "location", f0, Vector((p.x, p.y, d["h"] + 0.01)), interp)
                kf(o, "location", f1, Vector((p.x, p.y, h + 0.01)), interp)
        d["h"] = h

    def lift(self, zs, f0, f1, dz=0.6, back=None, dur=10):
        """Tiles step toward the viewer (and back at `back`)."""
        for z in zs:
            t = self.T[z]["t"]
            p = self.xy(z)
            kf(t, "location", f0, p, 'BEZIER')
            kf(t, "location", f0 + dur, p + Vector((0, 0, dz)), 'BEZIER')
            if back:
                kf(t, "location", back, p + Vector((0, 0, dz)), 'BEZIER')
                kf(t, "location", back + dur, p, 'BEZIER')

    def focus(self, zs, f0, f1, small=0.5, dur=10):
        """Every tile NOT in zs shrinks to `small` from f0 until f1, so the chosen ones stand out."""
        keep = set(zs)
        for z in self.zs:
            if z in keep:
                continue
            t = self.T[z]["t"]
            s0 = tuple(t.scale)
            kf(t, "scale", f0, s0, 'BEZIER')
            kf(t, "scale", f0 + dur, (small,) * 3, 'BEZIER')
            if f1 is not None:
                kf(t, "scale", f1, (small,) * 3, 'BEZIER')
                kf(t, "scale", f1 + dur, s0, 'BEZIER')

    def pulse(self, z, f, k=1.35, dur=14):
        t = self.T[z]["t"]
        s0 = Vector(t.scale)
        if s0.length < 1e-3:           # a view_layer.update() can leave it at an earlier, popped-out frame
            s0 = Vector((1, 1, 1))
        kf(t, "scale", f, s0, 'BEZIER')
        kf(t, "scale", f + dur // 2, s0 * k, 'BEZIER')
        kf(t, "scale", f + dur, s0, 'BEZIER')


def frame_box(name, w, h, mat=None, depth=0.035, parent=None):
    """Glowing rectangular outline (in the parent's local XY), centred on the origin."""
    pts = [(-w / 2, -h / 2, 0), (w / 2, -h / 2, 0), (w / 2, h / 2, 0), (-w / 2, h / 2, 0), (-w / 2, -h / 2, 0)]
    ob = pcurve(name, pts, mat or M["gold"], depth=depth, cname="Models", parent=parent)
    return ob


def walker(tb, name, path, t0, step=0.7, hold=None, t_out=None, w=1.06, h=1.06):
    """A gold frame that walks from tile to tile (path = list of Z), arriving at the last one.
    Returns the frame empty and the arrival time (seconds)."""
    fr = empty(name, tb.xy(path[0]) + Vector((0, 0, TH + 0.05)), tb.root)
    frame_box(name + " Box", w * P, h * P, parent=fr, depth=0.045)
    appear(fr, sec(t0), None if t_out is None else sec(t_out), dur=6)
    t = t0
    kf(fr, "location", sec(t), tb.xy(path[0]) + Vector((0, 0, TH + 0.05)), 'BEZIER')
    for z in path[1:]:
        t += step
        kf(fr, "location", sec(t), tb.xy(z) + Vector((0, 0, TH + 0.05)), 'BEZIER')
    return fr, t


def atom_for(name, z, loc, f_in, f_end, scale=1.0, parent=None, nuc=True, turns=1.2, ring_mat=None, e_r=0.11,
             r0=0.55, dr=0.42, counts=None):
    """Flat Bohr atom of element z (shells by Aufbau), facing the camera. Returns (group, radii)."""
    counts = counts or shells_of(z)
    radii = [(r0 + dr * i) * scale for i in range(len(counts))]
    neut = {1: 0, 2: 2, 3: 4, 4: 5, 5: 6, 6: 6, 7: 7, 8: 8, 9: 10, 10: 10, 11: 12, 12: 12, 17: 18, 18: 22, 19: 20,
            20: 20}.get(z, int(round(z * 1.3)))
    g = flat_atom(name, parent, loc, radii, counts, z if nuc else 0, neut if nuc else 0, f_in, f_end,
                  nuc_r=0.13 * scale ** 0.5, e_r=e_r * scale ** 0.4, ring_mat=ring_mat, turns=turns)
    return g, radii


print("u3lib ok")


# ---------------------------------------------------------------- more helpers (film 302 on)
MASS = {1: 1, 2: 4, 3: 7, 4: 9, 5: 11, 6: 12, 7: 14, 8: 16, 9: 19, 10: 20, 11: 23, 12: 24, 13: 27, 14: 28, 15: 31,
        16: 32, 17: 35, 18: 40, 19: 39, 20: 40, 31: 70, 33: 75, 34: 79, 35: 80, 37: 85, 53: 127, 55: 133}


def neutrons(z):
    return MASS.get(z, int(round(z * 2.3))) - z


def table_focus(tb, spans, small=0.45, dur=10, zs=None):
    """Spotlight: during each (chosen Z set, f0, f1) span the other tiles shrink to `small`; back to full after."""
    for z in (zs or tb.zs):
        t = tb.T[z]["t"]
        prev = 1.0
        for chosen, f0, f1 in spans:
            want = 1.0 if z in chosen else small
            kf(t, "scale", f0, (prev,) * 3, 'BEZIER')
            kf(t, "scale", f0 + dur, (want,) * 3, 'BEZIER')
            prev = want
        kf(t, "scale", spans[-1][2], (prev,) * 3, 'BEZIER')
        kf(t, "scale", spans[-1][2] + dur, (1,) * 3, 'BEZIER')


def vatom(name, z, loc, f_in, spans, scale=1.0, parent=None, rate=0.035, r0=0.5, dr=0.42, e_r=0.1, counts=None,
          nuc_r=0.11, gold_outer=True, f_out=None, ring_depth=0.018):
    """Flat Bohr atom facing the camera; the outer shell and its electrons are gold (valence electrons).
    It turns only inside `spans` (one thing moves at a time). Returns (group, radii, outer electrons)."""
    counts = counts or shells_of(z)
    if "Valence" not in M:
        M["Valence"] = mat_emit("Valence Electron", (1.0, 0.75, 0.3), 4.0)
        M["orbit_gold"] = mat_emit("Orbit Gold", (1.0, 0.72, 0.28), 1.3)
    g = empty(name, loc, parent, rot=(90 * DEG, 0, 0))
    nucleus_mesh(name + " Nucleus", z, neutrons(z), g, r=nuc_r, seed=z)
    radii, outer = [], []
    for k, n in enumerate(counts):
        rad = (r0 + dr * k) * scale
        radii.append(rad)
        last = gold_outer and k == len(counts) - 1
        ring_curve("%s Ring %d" % (name, k), rad, M["orbit_gold"] if last else M["orbit"], g, depth=ring_depth)
        piv = empty("%s Piv %d" % (name, k), (0, 0, 0), g)
        focus_spin(piv, spans, rate / (1 + 0.6 * k), phase=k * 0.7)
        for j in range(n):
            a = 2 * math.pi * j / n
            e = electron("%s e%d %d" % (name, k, j), piv, (rad * math.cos(a), rad * math.sin(a), 0), e_r,
                         mat=M["Valence"] if last else None)
            trail(e, rad, span=min(0.85, 2.2 / n))
            if last:
                outer.append(e)
    appear(g, f_in, f_out, dur=12)
    return g, radii, outer


def halo(e, times, k=2.6, mat=None, hold=0.5):
    """A soft gold glow around a (moving) electron that swells at each time in `times` (seconds). The electron
    itself is not scaled (its comet trail would grow too)."""
    mat = mat or mat_emit("Halo Gold", (1.0, 0.8, 0.35), 3.0, alpha=0.35)
    h = sphere(e.name[len(PFX) + 1:] + " Halo", 1.0, mat, (0, 0, 0), e, 16, 8)
    kf(h, "scale", 0, (0, 0, 0), 'CONSTANT')
    for t in times:
        f = sec(t)
        kf(h, "scale", f, (0, 0, 0), 'BEZIER')
        kf(h, "scale", f + 8, (k * 0.11,) * 3, "BEZIER")
        kf(h, "scale", f + 8 + int(hold * FPS), (k * 0.11,) * 3, "BEZIER")
        kf(h, "scale", f + 16 + int(hold * FPS), (0, 0, 0), 'BEZIER')
    return h


def ebar(name, loc, h, t0, text=None, mat=None, dur=1.2, t_out=None, lsize=0.42, w=0.7, lmat=None):
    """A bar that grows from the floor to height h (units) at t0, with its value on top."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector((v.co.x * w, v.co.y * w, v.co.z + 0.5))
    b = mesh_from_bm(name, bm, mat or mat_pbr("Energy Bar", (1.0, 0.72, 0.3), metallic=0.8, roughness=0.25), loc=loc)
    kf(b, "scale", 0, (0, 0, 0), 'CONSTANT')
    kf(b, "scale", sec(t0), (1, 1, 0.02), 'BEZIER')
    kf(b, "scale", sec(t0 + dur), (1, 1, h), 'BEZIER')
    if t_out:
        pop_out(b, sec(t_out), 6, (1, 1, h))
    if text:
        tx = _text(name + " Val", text, Vector(loc) + Vector((0, -0.5, h + 0.35)), lsize, lmat or M["gold"],
                   weight="semibold")
        shadow(tx)
        appear(tx, sec(t0 + dur), t_out and sec(t_out))
    return b


def fly_in(e, t0, dist=4.0, dur=1.6):
    """Hidden electron (child of a still pivot) flies in from far out to its seat."""
    home = e.location.copy()
    hide_until(e, sec(t0))
    kf(e, "location", sec(t0), home * dist, 'BEZIER')
    kf(e, "location", sec(t0 + dur), home, 'BEZIER')


def energy_wave(name, start, direction, t0, mat=None, dist=3.5, dur=1.0, parent=None):
    """A little gold wave (energy) flying from `start` along `direction` (world, in the picture plane)."""
    d = Vector(direction).normalized()
    w = squiggle(name, mat or mat_emit("Energy Wave", (1.0, 0.8, 0.35), 6.0), 1.2, 3, 0.14, 0.04, parent)
    w.rotation_euler = (math.pi / 2, 0, 0)
    w.rotation_euler.rotate(Euler((0, -math.atan2(d.z, d.x), 0)))
    kf(w, "scale", 0, (0, 0, 0), 'CONSTANT')
    kf(w, "scale", sec(t0), (1, 1, 1), 'CONSTANT')
    kf(w, "scale", sec(t0 + dur), (0, 0, 0), 'CONSTANT')
    move(w, sec(t0), sec(t0 + dur), Vector(start), Vector(start) + d * dist, 'LINEAR')
    return w
