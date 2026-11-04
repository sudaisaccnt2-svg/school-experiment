# ---- Film 03: Fundamental Particles of an Atom (textbook pp.47-48, Fig 2.7, Table 2.1) ----
# bsend.py common.py p2/lib.py p2/f03_particles.py
import bmesh, random
start_film("03", "03 Fundamental Particles", 102.0)
s = sec
END = scene.frame_end
O = Vector((0, 0, 0))
B = Vector((60, 0, 0))          # the balance lives in its own corner of the world

for name, t in (("Intro", 0), ("Fig 2.7", 9.5), ("Electron", 18), ("Proton", 34), ("Neutron", 46),
                ("Charges", 58), ("Proton vs electron", 68), ("Table 2.1", 84)):
    act(name, s(t))

camA = camera("Cam Atom", 40, (-1.5, -24, 0.6), (0.5, -21.5, 0.45), O, 1, s(34))
camN = camera("Cam Nucleus", 40, (-0.6, -8.2, 0.35), (0.3, -7.0, 0.25), O, s(34), s(58))
CH = Vector((30, 0, 0))         # the charges demo
camC = camera("Cam Charges", 40, CH + Vector((-0.6, -17, 0.3)), CH + Vector((0.6, -16, 0.2)), CH, s(58), s(68), shift=(0, 0))
camB = camera("Cam Balance", 40, B + Vector((-1.2, -19.5, 0.2)), B + Vector((0.6, -18.0, 0.0)), B + Vector((0, 0, -1.5)),
              s(68), s(84))
camT = camera("Cam Table", 40, (-2.0, -30, 0.6), (-0.5, -28.5, 0.5), O, s(84), END)
for f, c in ((1, camA), (s(34), camN), (s(58), camC), (s(68), camB), (s(84), camT)):
    cut(f, c)
for c, a, b in ((camA, 0.3, 33.7), (camN, 34.2, 57.7), (camC, 58.2, 67.7), (camB, 68.2, 83.7), (camT, 84.2, None)):
    hud("Title " + c.name[3:], "Fundamental Particles of an Atom", c, 0.5, 0.935, 0.056, s(a), b and s(b),
        M["gold"], align='CENTER')

# ---- Fig 2.7: beryllium-9 (4 protons + 5 neutrons, 2 + 2 electrons) ----
atom = bohr_atom("Atom", 4, 5, [2, 2], O, radii=[1.9, 3.3], f0=1, f1=END, period=4.5, nuc_r=0.3, e_r=0.15, seed=11)
refocus(atom["root"], [(1, s(34)), (s(58), END)])      # electrons wait during the nucleus close-up
appear(atom["nucleus"], s(1.0), dur=12)
for i, (ring, piv) in enumerate(zip(atom["rings"], atom["pivots"])):
    appear(ring, s(2.0 + 0.8 * i), dur=12)
    appear(piv, s(2.3 + 0.8 * i), dur=10)
nucleons = atom["nucleons"]
protons = [o for o in nucleons if " p" in o.name[-6:]]
neutrons = [o for o in nucleons if " n" in o.name[-6:]]
electrons = [e for sh in atom["electrons"] for e in sh]
bpy.context.view_layer.update()
front = lambda obs: min(obs, key=lambda o: o.matrix_world.translation.y)      # the one nearest the camera
wp = front(protons).matrix_world.translation.copy()
wn = front(neutrons).matrix_world.translation.copy()

hud("Intro", "What is an atom made of?", camA, 0.735, 0.82, 0.046, s(1.0), s(9.2), M["gold"], align='CENTER',
    weight="semibold")
hud("Intro 2", "Three tiny particles matter most to chemists:\nPROTON, NEUTRON and ELECTRON,\n"
               "the FUNDAMENTAL PARTICLES.", camA, 0.735, 0.74, 0.031, s(1.6), s(9.2), align='CENTER', valign='TOP')

label("Lbl Nucleus", "nucleus", (-2.3, -0.4, 1.35), 0.3, s(10.0), s(17.6), anchor=(-0.55, 0, 0.35))
label("Lbl Protons", "protons (p⁺)", (2.2, -0.4, 1.0), 0.28, s(10.8), s(17.6), mat=M["red"], anchor=tuple(wp))
label("Lbl Neutrons", "neutrons (n⁰)", (2.0, -0.4, -1.05), 0.28, s(11.6), s(17.6), mat=M["dim"], anchor=tuple(wn))
label("Lbl Electrons", "electrons (e⁻) in orbits", (-2.2, -0.4, -3.75), 0.28, s(12.4), s(17.6), mat=M["cyan"])
hud("Fig27", "Fig 2.7  Structure of an Atom", camA, 0.735, 0.82, 0.046, s(10.0), s(17.6), M["gold"], align='CENTER',
    weight="semibold")
hud("Fig27 b", "Beryllium: 4 protons + 5 neutrons in the nucleus,\n4 electrons moving around it.", camA, 0.735, 0.74,
    0.031, s(10.4), s(17.6), align='CENTER', valign='TOP')


def pulse(obs, f, k=1.45, dur=16):
    for o in obs:
        base = tuple(o.scale)
        kf(o, "scale", f, base, 'BEZIER')
        kf(o, "scale", f + dur // 2, tuple(v * k for v in base), 'BEZIER')
        kf(o, "scale", f + dur, base, 'BEZIER')


def card(cam, key, head, body, t0, t1, mat, facts=""):
    """Headline + two short lines; the book's exact numbers in one small dim line under them."""
    g = hud_group(key + " Card", cam, 0.735, 0.66, s(t0), s(t1))
    u = hud_unit(cam)
    panel(key + " Card Panel", g, 0.0, 0.0, 0.84 * u, 0.36 * u)
    hud(key + " Head", head, cam, 0.735, 0.8, 0.05, s(t0), s(t1), mat, align='CENTER', weight="semibold")
    hud(key + " Body", body, cam, 0.735, 0.72, 0.034, s(t0 + 0.6), s(t1), align='CENTER', valign='TOP')
    if facts:
        hud(key + " Facts", facts, cam, 0.735, 0.58, 0.024, s(t0 + 1.4), s(t1), M["dim"], align='CENTER', valign='TOP')


# ---- 1. electron ----
pulse(electrons, s(18.8))
pulse(electrons, s(24.0))
card(camA, "Electron", "1. Electron  e⁻", "NEGATIVE charge (−) · very light\nmoves around the nucleus in orbits",
     18.3, 33.6, M["cyan"], "the lightest of the three")
label("Lbl Light", "very light: almost no mass", (-2.6, -0.4, -4.2), 0.28, s(25.0), s(33.4), mat=M["cyan"])

# ---- 2. proton, 3. neutron (close-up of the nucleus) ----
pulse(protons, s(35.5))
pulse(protons, s(40.5))
pulse(neutrons, s(47.5))
pulse(neutrons, s(52.5))
card(camN, "Proton", "2. Proton  p⁺", "POSITIVE charge (+) · heavy\nlives in the nucleus",
     34.3, 45.7, M["red"], "1 proton weighs as much as 1837 electrons")
label("Lbl P", "proton  p⁺  (+1)", (-1.0, -0.6, 1.5), 0.17, s(35.2), s(45.6), mat=M["red"], anchor=tuple(wp))
card(camN, "Neutron", "3. Neutron  n⁰", "NO charge (neutral) · heavy\nlives in the nucleus",
     46.3, 57.7, M["white"], "a tiny bit heavier than a proton")
label("Lbl N", "neutron  n⁰  (no charge)", (-0.9, -0.6, -1.5), 0.17, s(47.2), s(57.6), mat=M["white"], anchor=tuple(wn))

# ---- charges: opposites attract, like charges repel, the neutron feels nothing ----
def charged(name, mat, r, sign, loc, sign_mat):
    g = empty(name, loc)
    sphere(name + " Ball", r, mat, (0, 0, 0), g)
    tg = empty(name + " Sign", (0, -r - 0.05, 0), g, rot=(90 * DEG, 0, 0), cname="Labels")
    child_text(name + " Sign T", sign, tg, 0.0, 0.0, r * 1.5, sign_mat, align='CENTER', weight="semibold")
    return g


T0 = 58.0
pp = charged("Ch P", M["proton"], 0.55, "+", CH + Vector((-3.0, 0, 1.6)), M["white"])
pe = charged("Ch E", M["electron"], 0.3, "−", CH + Vector((3.0, 0, 1.6)), M["white"])
for g_, a_, b_ in ((pp, -3.0, -0.55), (pe, 3.0, 0.32)):
    appear(g_, s(T0 + 0.4), dur=10)
    move(g_, s(T0 + 1.2), s(T0 + 2.6), CH + Vector((a_, 0, 1.5)), CH + Vector((b_, 0, 1.5)), 'BEZIER')
flash("Ch Snap", CH + Vector((-0.1, -0.3, 1.5)), s(T0 + 2.6), size=0.5)
label("Lbl Attract", "opposite charges ATTRACT  + −", CH + Vector((0, -0.6, 0.65)), 0.3, s(T0 + 2.4), s(67.6),
      mat=M["green"], weight="semibold")
e1 = charged("Ch E1", M["electron"], 0.3, "−", CH + Vector((-0.45, 0, -0.6)), M["white"])
e2 = charged("Ch E2", M["electron"], 0.3, "−", CH + Vector((0.45, 0, -0.6)), M["white"])
for g_, a_, b_ in ((e1, -0.45, -3.2), (e2, 0.45, 3.2)):
    appear(g_, s(T0 + 3.4), dur=10)
    move(g_, s(T0 + 4.2), s(T0 + 5.4), CH + Vector((a_, 0, -0.6)), CH + Vector((b_, 0, -0.6)), 'BEZIER')
label("Lbl Repel", "same charges REPEL  − −", CH + Vector((0, -0.6, -1.4)), 0.3, s(T0 + 4.4), s(67.6), mat=M["red"],
      weight="semibold")
nn = charged("Ch N", M["neutron"], 0.55, "0", CH + Vector((-4.5, 0, -2.6)), M["shadow"])
pc = charged("Ch P2", M["proton"], 0.55, "+", CH + Vector((0, 0, -2.6)) + Vector((0, 0.9, 0)), M["white"])
appear(pc, s(T0 + 5.6), dur=10)
appear(nn, s(T0 + 5.8), dur=10)
move(nn, s(T0 + 6.2), s(T0 + 8.6), CH + Vector((-4.5, -0.9, -2.6)), CH + Vector((4.5, -0.9, -2.6)), 'LINEAR')
label("Lbl Neutral", "neutron: no charge, no push or pull", CH + Vector((0, -0.6, -3.45)), 0.28, s(T0 + 6.6), s(67.6),
      mat=M["dim"])
hud("Charges", "Charges: why electrons stay", camC, 0.5, 0.86, 0.046, s(T0 + 0.3), s(67.6), M["gold"], align='CENTER',
    weight="semibold")
hud("Charges 2", "The + nucleus pulls the − electrons, so they stay around it.", camC, 0.5, 0.8, 0.032, s(T0 + 3.0),
    s(67.6), M["white"], align='CENTER')

# ---- a proton balanced by 1837 electrons ----
steel = mat_pbr("Balance Steel", (0.62, 0.64, 0.68), metallic=0.9, roughness=0.32)
brass = mat_pbr("Balance Brass", (0.85, 0.62, 0.28), metallic=1.0, roughness=0.28)
bal = empty("Balance", B)
L = 3.0
DROP = 2.2


def cyl(name, r, h, z, mat, parent, segs=32):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=segs, radius1=r, radius2=r, depth=h,
                          matrix=Matrix.Translation((0, 0, z)))
    return mesh_from_bm(name, bm, mat, parent=parent)


cyl("Balance Base", 1.2, 0.16, -3.35, steel, bal)
cyl("Balance Post", 0.09, 3.3, -1.65, steel, bal, 16)
beam = empty("Balance Beam", (0, 0, 0), bal)
bm = bmesh.new()
bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Diagonal((2 * L + 0.3, 0.16, 0.14, 1)))
mesh_from_bm("Balance Bar", bm, brass, parent=beam)
cyl("Balance Knob", 0.16, 0.22, 0.0, brass, beam, 24).rotation_euler = (90 * DEG, 0, 0)


def pan(name, x):
    p = empty(name, (x, 0, 0), bal)
    cyl(name + " Dish", 1.0, 0.07, -DROP, brass, p, 40)
    bm = bmesh.new()
    for a in (90, 210, 330):
        rim = Vector((0.92 * math.cos(a * DEG), 0.92 * math.sin(a * DEG), -DROP + 0.03))
        d = rim.length
        m = Matrix.Translation(rim / 2) @ (rim.to_track_quat('Z', 'Y').to_matrix().to_4x4())
        bmesh.ops.create_cone(bm, cap_ends=True, segments=6, radius1=0.012, radius2=0.012, depth=d, matrix=m)
    mesh_from_bm(name + " Strings", bm, M["line"], parent=p)
    return p


panL, panR = pan("Pan L", -L), pan("Pan R", L)
for ob in (bal,):
    appear(ob, s(68.5), dur=12)


def tilt(f, deg):
    th = deg * DEG
    kf(beam, "rotation_euler", f, (0, th, 0), 'BEZIER')
    kf(panL, "location", f, (-L * math.cos(th), 0, L * math.sin(th)), 'BEZIER')
    kf(panR, "location", f, (L * math.cos(th), 0, -L * math.sin(th)), 'BEZIER')


tilt(s(69.4), 0)
p1 = sphere("Heavy Proton", 0.6, M["proton"], (0, 0, 4.0), panL)
appear(p1, s(69.4), dur=8, s=(0.6,) * 3)
move(p1, s(69.4), s(70.2), (0, 0, 2.0), (0, 0, -DROP + 0.035 + 0.6), 'BEZIER')
tilt(s(70.2), 0)
tilt(s(71.0), -12)

# 1837 electrons: one mesh per quarter so the pile grows in four steps
rnd = random.Random(5)
pts = []
while len(pts) < 1837:
    x, y = rnd.uniform(-0.9, 0.9), rnd.uniform(-0.9, 0.9)
    r = math.hypot(x, y)
    if r > 0.9:
        continue
    pts.append(Vector((x, y, rnd.uniform(0, 0.95 * (1 - (r / 0.92) ** 2)))))
pts.sort(key=lambda v: v.z)
heap_mat = M["electron"]
for q in range(4):
    bm = bmesh.new()
    for v in pts[q * 460:(q + 1) * 460 if q < 3 else None]:
        bmesh.ops.create_icosphere(bm, subdivisions=1, radius=0.06, matrix=Matrix.Translation(v))
    h = mesh_from_bm("Heap %d" % q, bm, heap_mat, parent=panR, loc=(0, 0, -DROP + 0.1))
    f = s(62.0 + 1.5 * q)
    appear(h, f, dur=10)
    tilt(f + 4, -12 + 3 * (q + 1))
label("Lbl One", "1 proton", B + Vector((-L, -0.6, 0.9)), 0.36, s(71.0), s(83.6), mat=M["red"])
label("Lbl Many", "1837 electrons", B + Vector((L, -0.6, 0.9)), 0.36, s(77.6), s(83.6), mat=M["cyan"])
label("Lbl Level", "balanced: same mass", B + Vector((0, -0.6, -4.25)), 0.32, s(78.4), s(83.6), mat=M["green"])
hud("Heavy 1", "How heavy is a proton?", camB, 0.5, 0.86, 0.046, s(69.0), s(83.6), M["gold"], align='CENTER',
    weight="semibold")
hud("Heavy 2", "1 proton = 1837 electrons on the balance!", camB, 0.5, 0.8, 0.034, s(69.6), s(83.6), align='CENTER')
hud("Heavy 3", "Protons and neutrons (1842 ×) carry almost all the mass of an atom.", camB, 0.5, 0.06, 0.03, s(79.0),
    s(83.6), M["dim"], align='CENTER')

# ---- Table 2.1 (the atom steps aside) ----
hide_from(atom["root"], s(84.0))
U = hud_unit(camT)
tg = hud_group("Table", camT, 0.5, 0.52, s(84.6))      # big enough to read on an iPad (user: "too small")
panel("Table Panel", tg, 0.0, 0.01 * U, 1.74 * U, 0.68 * U, edge=M["panel_edge"], fill=M["panel_solid"])
child_text("Table Title", "Table 2.1   Summary of the subatomic particles", tg, 0.0, 0.28 * U, 0.055 * U, M["gold"],
           align='CENTER', weight="semibold")
cols = [(0.24 * U, 'LEFT'), (0.16 * U, 'CENTER'), (0.17 * U, 'CENTER'), (0.42 * U, 'CENTER'), (0.33 * U, 'CENTER'),
        (0.36 * U, 'CENTER')]
rows = [["Particle", "Symbol", "Charge", "Charge (C)", "Mass (amu)", "Mass (kg)"],
        ["Electron", "e⁻", "−1", "−1.6022 × 10⁻¹⁹", "0.00054859", "9.11 × 10⁻³¹"],
        ["Proton", "p⁺", "+1", "+1.6022 × 10⁻¹⁹", "1.0072766", "1.6726 × 10⁻²⁷"],
        ["Neutron", "n⁰", "0", "0", "1.0086654", "1.6749 × 10⁻²⁷"]]
table("T21", tg, -0.84 * U, 0.17 * U, cols, rows, 0.048 * U, 0.13 * U, f_in=s(85.6), stagger=s(1.6) - 1)
hud("Table Note", "Protons and neutrons are nearly equal in mass; an electron is ~1840 times lighter.",
    camT, 0.5, 0.1, 0.034, s(92.0), None, M["dim"], align='CENTER')
hud("Next", "Next: Shells & Electronic Configuration  →", camT, 0.78, 0.035, 0.034, s(97.0), None, M["gold"],
    align='CENTER')

scene["ar_range"] = [1, s(34)]       # AR: the atom of Fig 2.7 turning
finish_film()
