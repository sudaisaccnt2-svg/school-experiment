# ---- Film 10 (v4 "show, don't tell"): Uses of isotopes (textbook pp.57-58: STS carbon dating, uses 1-9) ----
# One use per shot, its model only, one caption line: carbon dating (C-14 decays in remains; uranium turns into lead in
# rock) · I-131 thyroid / goiter, I-123 brain imaging · tracers (D, C-13, N-15, O-18, I-131) find a blockage · radium
# and Co-60 shrink a tumor · Na-24 finds a blood blockage · C-14 traces photosynthesis · Am-241 smoke detector, oil
# wells · Cf-252 soil moisture, luggage · Kr-85 cloth washers (dust and pollutants).
# bsend.py common.py p2/lib.py u3/u3lib.py v4lib.py p2/f10_uses.py      (old v2: backups/f10_uses_v2.py)
from mathutils import noise
start_film("10", "10 Uses of Isotopes", 108.0)
s = sec
END = scene.frame_end
T = [0, 20, 40, 50, 59, 67, 76, 85, 95, 108]          # station start times (s)
ACTS = ["Carbon dating", "Iodine-131 and -123", "Tracers", "Cancer treatment", "Sodium-24", "Carbon-14",
        "Americium-241", "Californium-252", "Krypton-85"]
P, R = [], []
for i, nm in enumerate(ACTS):
    act(nm, s(T[i]))
    p = Vector((30.0 * i, 0, 0))
    f0, f1 = (1 if i == 0 else s(T[i])), (END if i == 8 else s(T[i + 1]))
    r = empty("Station %d" % i, p)
    if i:
        hide_until(r, f0)
    if i < 8:
        hide_from(r, f1)
    P.append(p), R.append(r)
    if i:
        shot("Cam %d" % i, T[i], None if i == 8 else T[i + 1], p + Vector((0, 0, -0.5)), dist=20, drift=0.3)
shot("Cam 0 Bone", 0, 13.2, P[0] + Vector((-4.2, 0, -0.3)), dist=10.5, drift=0.2)
shot("Cam 0 Rock", 13.2, 20, P[0] + Vector((4.4, 0, -0.5)), dist=10.5, drift=0.2)


def sym(key, el, A, Z, loc, t0, t1, size=0.85):
    g = empty("Sym %s" % key, loc + Vector((-0.45 * size, 0, 0)), rot=(90 * DEG, 0, 0), cname="Labels")
    nuclide("Nuc %s" % key, el, A, Z, g, 0.0, 0.0, size)
    appear(g, s(t0), t1)
    return g


GLASS = glow("Body Glass", (0.35, 0.55, 0.9), 0.35, alpha=0.2)
BONE = mat_pbr("Bone", (0.85, 0.8, 0.68), roughness=0.6)
GREY = mat_pbr("Grey Metal", (0.45, 0.47, 0.5), metallic=0.8, roughness=0.35)
WHITE_P = mat_pbr("White Plastic", (0.85, 0.87, 0.9), roughness=0.4)
C14 = glow("C14 Glow", (0.3, 1.0, 0.55), 3.0)
RED = glow("Clot Red", (0.85, 0.15, 0.2), 1.2)
rnd = random.Random(10)

# ==== 0 STS: carbon dating ====
p, r = P[0], R[0]
bone = empty("Bone", (-4.2, 0, 0), r)
cyl("Bone Shaft", 0.26, 0.26, 3.6, BONE, (0, 0, 0), bone, rot=(0, 90 * DEG, 0))
for k, (x, z) in enumerate(((-1.85, 0.25), (-1.85, -0.25), (1.85, 0.25), (1.85, -0.25))):
    blob("Bone Knob %d" % k, (0.42, 0.38, 0.4), BONE, (x, 0, z), bone)
for k in range(12):
    loc = (-4.2 + rnd.uniform(-2.4, 2.4), -0.55, rnd.uniform(-1.2, 1.3))
    a = dot("C14 %d" % k, 0.15, C14, r, loc)
    appear(a, s(3.0 + 0.17 * k), dur=6, s=(0.15,) * 3)
    if k < 9:                                     # decay one by one: fewer C-14 atoms = older remains
        f = s(7.5 + 0.6 * k)
        flash("C14 Decay %d" % k, loc, f, size=0.35, parent=r)
        hide_from(a, f + 2)
label("Lbl C14", "C-14 atoms", p + Vector((-4.2, -0.6, 1.95)), 0.51, s(3.2), s(19.6), mat=M["green"],
      weight="semibold")
rock = blob("Rock", (1.9, 1.0, 1.25), mat_pbr("Rock", (0.32, 0.28, 0.25), roughness=0.85), (4.4, 0, -0.2), r,
            bump=0.12, seed=3)
hide_until(rock, s(13.4))
U_M = glow("U Glow", (1.0, 0.85, 0.2), 3.0)
PB_M = mat_pbr("Lead Grey", (0.55, 0.57, 0.62), metallic=0.9, roughness=0.3)
for k in range(10):
    dx, dz = rnd.uniform(-1.3, 1.3), rnd.uniform(-0.75, 0.75)
    y = -1.0 * math.sqrt(max(0.05, 1 - (dx / 1.9) ** 2 - (dz / 1.25) ** 2)) - 0.1
    loc = (4.4 + dx, y, -0.2 + dz)
    u = dot("U %d" % k, 0.16, U_M, r, loc)
    appear(u, s(13.8 + 0.1 * k), dur=6, s=(0.16,) * 3)
    if k < 6:
        f = s(15.2 + 0.55 * k)
        hide_from(u, f)
        pb = dot("Pb %d" % k, 0.16, PB_M, r, loc)
        appear(pb, f, dur=6, s=(0.16,) * 3)
        flash("U Decay %d" % k, loc, f, size=0.3, parent=r)
label("Lbl UPb", "uranium (U) → lead (Pb)", p + Vector((4.4, -0.6, 1.55)), 0.51, s(14.4), s(19.6), mat=M["gold"],
      weight="semibold")

# ==== 1 iodine-131 (thyroid) and iodine-123 (brain) ====
p, r = P[1], R[1]
blob("Shoulders", (2.7, 1.0, 0.85), GLASS, (0, 0, -3.0), r)
cyl("Neck", 0.6, 0.6, 1.7, GLASS, (0, 0, -1.5), r)
blob("Head", (1.2, 1.3, 1.5), GLASS, (0, 0, 0.75), r)
blob("Brain", (0.92, 1.0, 0.72), glow("Brain Pink", (0.95, 0.55, 0.65), 0.6), (0, 0, 1.05), r, bump=0.06, seed=1)
TH = glow("Thyroid", (0.85, 0.3, 0.35), 0.9)
I131 = glow("I131 Glow", (0.78, 0.45, 1.0), 4.0)
I123 = glow("I123 Glow", (0.35, 0.8, 1.0), 4.0)
for k, (x, r3) in enumerate(((-0.24, (0.2, 0.12, 0.36)), (0.24, (0.2, 0.12, 0.36)), (0.0, (0.18, 0.1, 0.09)))):
    z = -1.65 if k == 2 else -1.55
    blob("Thyroid %d" % k, r3, TH, (x, -0.52, z), r)
    appear(blob("Thyroid Glow %d" % k, tuple(v * 1.12 for v in r3), I131, (x, -0.52, z), r), s(30.5), dur=12)
appear(blob("Brain Glow", (0.96, 1.04, 0.76), I123, (0, 0, 1.05), r, bump=0.06, seed=1), s(37.2), dur=14)
for k in range(14):
    a = (rnd.uniform(-2.2, 2.2), -0.7, -3.4)
    b = (rnd.choice((-0.24, 0.24)) + rnd.uniform(-0.1, 0.1), -0.62, -1.55 + rnd.uniform(-0.3, 0.3))
    e = dot("I131 %d" % k, 0.06, I131, r, a)
    f = s(26.0) + 6 * k
    appear(e, f, dur=5, s=(0.06,) * 3)
    move(e, f, f + 40, a, b)
for k in range(14):
    x = rnd.uniform(-0.35, 0.35)
    tgt = Vector((rnd.uniform(-0.7, 0.7), rnd.uniform(-0.75, -0.5), 1.05 + rnd.uniform(-0.5, 0.5)))
    e = dot("I123 %d" % k, 0.06, I123, r, (x, -0.7, -2.6))
    f = s(33.6) + 5 * k
    appear(e, f, dur=5, s=(0.06,) * 3)
    along(e, [(x, -0.7, -2.6), (x * 0.5, -0.65, -0.5), tgt], f, 0.09)
sym("I131", "I", 131, 53, p + Vector((-3.4, -0.6, -1.4)), 26.0, s(39.6))
sym("I123", "I", 123, 53, p + Vector((-3.4, -0.6, 1.4)), 33.6, s(39.6))
label("Lbl Thyroid", "thyroid gland", p + Vector((2.6, -0.6, -1.2)), 0.48, s(26.0), s(39.6), mat=M["white"],
      anchor=p + Vector((0.45, -0.6, -1.5)))
label("Lbl Brain", "brain", p + Vector((2.6, -0.6, 2.0)), 0.48, s(33.6), s(39.6), mat=M["white"],
      anchor=p + Vector((0.75, -0.6, 1.4)))

# ==== 2 tracers ====
p, r = P[2], R[2]
PIPE = [(-8, 0, 1.4), (-4, 0, 1.4), (-2.2, 0, -0.6), (1.6, 0, -0.6), (3.4, 0, 1.2), (8, 0, 1.2)]
line("Pipe", PIPE, GLASS, depth=0.42, parent=r)
blob("Blockage", (0.36, 0.45, 0.42), RED, (0.9, 0, -0.6), r, bump=0.15, seed=4)
TR = glow("Tracer Glow", (1.0, 0.8, 0.3), 3.5)
stop0 = 4.0 + math.hypot(1.8, 2.0) + (0.9 - 0.36 - 0.12 + 2.2)
for k in range(16):
    e = dot("Tracer %d" % k, 0.1, TR, r, PIPE[0])
    f = s(41.0) + 9 * k
    appear(e, f, dur=5, s=(0.1,) * 3)
    along(e, PIPE, f, 0.12, stop0 - 0.22 * k)
box("Detector", (1.0, 0.5, 0.5), GREY, (0.9, 0, -2.3), r)
pulses("Tracer Pulse", (0.9, -0.35, -0.6), r, (45.0, 46.0, 47.0, 48.0))
for k, t in enumerate(("D", "C-13", "N-15", "O-18", "I-131")):
    label("Lbl Tr %d" % k, t, p + Vector((-7.0 + 1.6 * k, -0.6, 2.45)), 0.5, s(40.8 + 0.3 * k), s(49.6),
          mat=M["gold"], weight="semibold")
label("Lbl Block", "blocked part", p + Vector((-2.6, -0.6, -2.1)), 0.48, s(44.5), s(49.6), mat=M["red"],
      anchor=p + Vector((0.6, -0.6, -0.8)))
label("Lbl Det", "detector", p + Vector((2.6, -0.6, -2.3)), 0.45, s(44.5), s(49.6), mat=M["dim"], align='LEFT')

# ==== 3 radium and cobalt-60 against cancer ====
p, r = P[3], R[3]
blob("Tissue", (3.0, 1.2, 2.0), glow("Tissue Glass", (0.9, 0.5, 0.55), 0.3, alpha=0.18), (0, 0, -0.4), r)
TUM = Vector((0.2, 0, -0.5))
tum = blob("Tumor", (0.9, 0.9, 0.9), RED, TUM, r, bump=0.22, seed=5)
scale_to(tum, s(52.8), s(57.6), (1, 1, 1), (0.25, 0.25, 0.25))
BEAM = glow("Beam Gold", (1.0, 0.75, 0.3), 4.0, alpha=0.7)
SRC = []
for k, a in enumerate((165, 110, 40)):
    pos = TUM + Vector((5.5 * math.cos(a * DEG), 0, 2.8 * math.sin(a * DEG)))
    rot = (TUM - pos).normalized().to_track_quat('Z', 'Y').to_euler()
    src = cyl("Source %d" % k, 0.42, 0.42, 1.0, GREY, pos, r, rot=rot)
    appear(src, s(50.6 + 0.3 * k))
    L = (TUM - pos).length - 0.95
    bm_ = cyl("Beam %d" % k, 0.12, 0.05, L, BEAM, pos, r, rot=rot, base=True)
    f = s(51.4) + 8 * k
    kf(bm_, "scale", 0, (0, 0, 0), 'CONSTANT')
    kf(bm_, "scale", f, (1, 1, 0.02), 'BEZIER')
    kf(bm_, "scale", f + 12, (1, 1, 1), 'BEZIER')
    kf(bm_, "scale", s(58.0), (1, 1, 1), 'CONSTANT')
    kf(bm_, "scale", s(58.0) + 1, (0, 0, 0), 'CONSTANT')
    SRC.append(pos)
label("Lbl Radium", "radium", p + SRC[0] + Vector((0, -0.6, -0.95)), 0.48, s(51.0), s(58.6), mat=M["gold"])
sym("Co60", "Co", 60, 27, p + SRC[2] + Vector((1.25, -0.6, 0.55)), 51.4, s(58.6), size=0.5)
label("Lbl Cobalt", "cobalt-60", p + SRC[2] + Vector((1.2, -0.6, -0.5)), 0.45, s(51.6), s(58.6), mat=M["gold"])
label("Lbl Tumor", "tumor (cancer cells)", p + Vector((2.9, -0.6, -2.5)), 0.48, s(51.0), s(58.6), mat=M["red"],
      anchor=p + TUM + Vector((0.5, -0.6, -0.5)))

# ==== 4 sodium-24: blood circulation ====
p, r = P[4], R[4]
CEN, RAD = Vector((0, 0, -0.4)), 2.8
loop = empty("Vessel Loop", CEN, r, rot=(90 * DEG, 0, 0))
ring_curve("Vessel", RAD, glow("Vessel Red", (0.75, 0.15, 0.2), 0.6, alpha=0.5), loop, depth=0.2)
heart = blob("Heart", (0.75, 0.55, 0.7), mat_pbr("Heart", (0.7, 0.08, 0.1), roughness=0.4), CEN + Vector((0, 0, RAD)),
             r, bump=0.08, seed=6)
for t in range(59, 67):
    kf(heart, "scale", s(t), (1, 1, 1), 'BEZIER')
    kf(heart, "scale", s(t) + 6, (1.12, 1.12, 1.12), 'BEZIER')
    kf(heart, "scale", s(t) + 14, (1, 1, 1), 'BEZIER')
BLK = -35
blob("Clot", (0.3, 0.32, 0.3), RED, CEN + RAD * Vector((math.cos(BLK * DEG), 0, math.sin(BLK * DEG))), r, bump=0.2,
     seed=7)
NA = glow("Na24 Glow", (1.0, 0.62, 0.25), 4.0)
for k in range(12):
    stop_a = BLK + 9 + 5 * k
    pts = [CEN + RAD * Vector((math.cos(a * DEG), -0.05, math.sin(a * DEG))) for a in range(90, stop_a - 1, -5)]
    e = dot("Na24 %d" % k, 0.1, NA, r, pts[0])
    f = s(59.8) + 10 * k
    appear(e, f, dur=5, s=(0.1,) * 3)
    along(e, pts, f, 0.1)
pulses("Na Pulse", CEN + RAD * Vector((math.cos(BLK * DEG), -0.35, math.sin(BLK * DEG))), r, (63.5, 64.5, 65.5))
sym("Na24", "Na", 24, 11, p + Vector((-4.8, -0.6, 1.4)), 59.8, s(66.6))
label("Lbl Heart", "heart", p + Vector((-1.9, -0.6, 2.9)), 0.45, s(60.0), s(66.6), mat=M["dim"])
label("Lbl Clot", "blocked blood vessel", p + Vector((4.6, -0.6, -3.0)), 0.48, s(63.0), s(66.6), mat=M["red"],
      anchor=p + CEN + Vector((2.6, -0.6, -1.9)))

# ==== 5 carbon-14 in photosynthesis ====
p, r = P[5], R[5]
PX = 1.5
cyl("Pot", 0.75, 1.05, 1.3, mat_pbr("Terracotta", (0.62, 0.3, 0.18), roughness=0.7), (PX, 0, -2.6), r)
blob("Soil", (1.0, 1.0, 0.08), mat_pbr("Soil", (0.22, 0.14, 0.08), roughness=0.9), (PX, 0, -1.97), r)
STEM = [(PX, 0, -1.95), (PX - 0.05, 0, -0.5), (PX + 0.05, 0, 1.0), (PX, 0, 2.0)]
LEAF = mat_pbr("Leaf", (0.15, 0.55, 0.15), roughness=0.5)
line("Stem", STEM, LEAF, depth=0.07, parent=r)
LEAVES = [(-0.8, -0.7, -25), (0.8, -0.1, 25), (-0.75, 0.7, -20), (0.75, 1.3, 20), (0.0, 2.15, 0)]
LG = glow("Leaf Glow", (0.4, 1.0, 0.45), 1.1, alpha=0.55)
for k, (dx, z, a) in enumerate(LEAVES):
    loc = (PX + dx, 0, z)
    blob("Leaf %d" % k, (0.9 if dx else 0.45, 0.07, 0.34 if dx else 0.45), LEAF, loc, r, rot=(0, a * DEG, 0))
    appear(blob("Leaf Glow %d" % k, (0.95 if dx else 0.5, 0.08, 0.38 if dx else 0.5), LG, loc, r,
                rot=(0, a * DEG, 0)), s(71.8 + 0.2 * k), dur=10)
blob("Sun", (0.8, 0.8, 0.8), glow("Sun", (1.0, 0.75, 0.3), 3.0), (-6.5, 0, 2.0), r)
label("Lbl Sun", "sunlight", p + Vector((-6.5, -0.6, 0.85)), 0.42, s(67.5), s(75.6), mat=M["dim"])
O_M = mat_pbr("Oxygen Red", (0.85, 0.16, 0.12), roughness=0.35)
for k in range(6):
    g = empty("CO2 %d" % k, (0, 0, 0), r)
    dot("CO2 %d C" % k, 0.17, C14, g)
    for j, sx in enumerate((-0.3, 0.3)):
        dot("CO2 %d O%d" % (k, j), 0.14, O_M, g, (sx, 0, 0))
    a = Vector((rnd.uniform(-6.2, -3.4), -0.3, rnd.uniform(-2.6, 0.6)))
    dx, z, _ = LEAVES[k % 5]
    b = Vector((PX + dx * 0.8, -0.2, z))
    f = s(67.8) + 12 * k
    appear(g, f, f + 70)
    move(g, f, f + 70, a, b)
for k in range(8):
    dx, z, _ = LEAVES[k % 5]
    e = dot("C14 Path %d" % k, 0.08, C14, r, (PX + dx * 0.8, -0.25, z))
    f = s(72.6) + 8 * k
    appear(e, f, dur=5, s=(0.08,) * 3)
    along(e, [(PX + dx * 0.8, -0.25, z), (PX, -0.25, z - 0.3), (PX, -0.25, -1.9)], f, 0.08)
label("Lbl CO2", "CO₂ containing C-14", p + Vector((-4.6, -0.6, -3.0)), 0.48, s(68.2), s(75.6), mat=M["green"])
sym("C14", "C", 14, 6, p + Vector((5.0, -0.6, 1.3)), 68.0, s(75.6))
label("Lbl Agri", "Agricultural research\n(carbon-14, phosphorus-32)", p + Vector((5.2, -0.6, -1.6)), 0.42, s(73.0),
      s(75.6), mat=M["dim"])

# ==== 6 americium-241: smoke detectors, oil wells ====
p, r = P[6], R[6]
box("Ceiling", (7.0, 2.0, 0.2), mat_pbr("Ceiling", (0.3, 0.31, 0.34), roughness=0.8), (-1.0, 0, 2.5), r)
cyl("Smoke Detector", 1.1, 1.0, 0.35, WHITE_P, (-1.5, 0, 2.22), r)
dot("LED", 0.08, mat_pbr("LED Off", (0.3, 0.05, 0.05), roughness=0.3), r, (-1.5, -1.02, 2.15))
led = dot("LED On", 0.13, glow("LED Red", (1.0, 0.1, 0.08), 10.0), r, (-1.5, -1.05, 2.15))
kf(led, "scale", 0, (0, 0, 0), 'CONSTANT')
for t in (79.6, 80.4, 81.2, 82.0):
    kf(led, "scale", s(t), (0.13,) * 3, 'CONSTANT')
    kf(led, "scale", s(t) + 12, (0, 0, 0), 'CONSTANT')
flame = cyl("Flame", 0.25, 0.0, 0.75, glow("Flame", (1.0, 0.5, 0.12), 5.0), (-1.5, 0, -2.75), r, base=True)
for k, t in enumerate(range(76, 83)):
    kf(flame, "scale", s(t), (1, 1, 1.0 if k % 2 else 1.25), 'BEZIER')
cyl("Candle", 0.18, 0.18, 0.8, WHITE_P, (-1.5, 0, -3.2), r)
SMOKE = glow("Smoke", (0.55, 0.55, 0.6), 0.4, alpha=0.5)
for k in range(6):
    pf = blob("Smoke %d" % k, (0.3 + 0.03 * k,) * 3, SMOKE, (0, 0, 0), r, bump=0.2, seed=20 + k, segs=12, rings=6)
    a = (-1.5 + rnd.uniform(-0.2, 0.2), -0.2, -1.9)
    b = (-1.5 + rnd.uniform(-1.3, 1.3), -0.2, 1.65)
    f = s(77.5) + 14 * k
    appear(pf, f, f + 60)
    move(pf, f, f + 60, a, b, 'LINEAR')
label("Lbl Beep", "BEEP!", p + Vector((0.6, -0.6, 1.3)), 0.62, s(79.6), s(84.6), mat=M["red"], weight="semibold")
label("Lbl Det6", "smoke detector", p + Vector((-4.6, -0.6, 2.0)), 0.45, s(76.8), s(84.6), mat=M["dim"])
der = empty("Derrick", (4.8, 0, -3.0), r)
for k, pts in enumerate(([(-0.9, 0, 0), (0, 0, 3.4)], [(0.9, 0, 0), (0, 0, 3.4)], [(-0.62, 0, 1.0), (0.62, 0, 1.0)],
                         [(-0.35, 0, 2.1), (0.35, 0, 2.1)], [(-0.62, 0, 1.0), (0.35, 0, 2.1)],
                         [(-2.0, 0, 0), (2.0, 0, 0)])):
    line("Derrick %d" % k, pts, GREY if k < 5 else M["dim"], depth=0.05, parent=der)
appear(der, s(82.6))
label("Lbl Oil", "oil well", p + Vector((4.8, -0.6, 1.0)), 0.45, s(82.8), s(84.6), mat=M["dim"])
sym("Am241", "Am", 241, 95, p + Vector((-5.4, -0.6, 0.6)), 76.6, s(84.6))

# ==== 7 californium-252: soil moisture, luggage ====
p, r = P[7], R[7]
box("Soil Block", (3.6, 1.8, 1.7), mat_pbr("Soil Block", (0.35, 0.22, 0.12), roughness=0.9), (-3.6, 0, -1.6), r)
box("Grass", (3.6, 1.8, 0.1), mat_pbr("Grass", (0.18, 0.45, 0.12), roughness=0.8), (-3.6, 0, -0.7), r)
probe = cyl("Probe", 0.08, 0.08, 2.2, GREY, (-3.6, 0, 1.4), r)
move(probe, s(85.8), s(87.4), (-3.6, 0, 1.4), (-3.6, 0, -0.4))
pulses("Soil Pulse", (-3.6, -0.95, -1.5), r, (87.6, 88.4, 89.2), r=0.8, mat=M["cyan"])
WATER = glow("Water Drop", (0.35, 0.8, 1.0), 3.0)
for k in range(8):
    d = dot("Drop %d" % k, 0.13, WATER, r, (-3.6 + rnd.uniform(-1.5, 1.5), -0.95, -1.6 + rnd.uniform(-0.65, 0.6)))
    appear(d, s(88.0 + 0.2 * k), dur=6, s=(0.13,) * 3)
label("Lbl Soil", "moisture in the soil", p + Vector((-3.6, -0.6, -3.0)), 0.45, s(88.0), s(94.6), mat=M["cyan"])
box("Suitcase", (2.8, 0.9, 1.9), mat_pbr("Suitcase", (0.12, 0.2, 0.4), roughness=0.5), (3.6, 0, -1.4), r)
hd = empty("Handle", (3.6, 0, -0.45), r, rot=(90 * DEG, 0, 0))
ring_curve("Handle Ring", 0.32, GREY, hd, depth=0.05)
item = box("Hidden Item", (0.7, 0.2, 0.4), glow("Hidden Red", (1.0, 0.2, 0.15), 3.0), (3.9, -0.5, -1.5), r)
appear(item, s(91.1), dur=8)
flash("Item Flash", (3.9, -0.6, -1.5), s(91.1), size=0.6, parent=r)
scan = empty("Scanner", (1.2, 0, -1.3), r)
for k, (loc, d3) in enumerate((((0, 0, -0.1), (0.14, 1.4, 2.8)), ((0, 0, 1.4), (0.14, 1.4, 0.16)))):
    box("Scanner %d" % k, d3, GREY, loc, scan)
box("Scan Light", (0.04, 1.2, 2.6), glow("Scan Light", (0.35, 0.8, 1.0), 2.5, alpha=0.5), (0, 0, -0.1), scan)
appear(scan, s(89.0))
move(scan, s(89.5), s(92.5), (1.2, 0, -1.3), (6.4, 0, -1.3), 'LINEAR')
label("Lbl Item", "hidden explosive", p + Vector((3.9, -0.6, 0.9)), 0.48, s(91.4), s(94.6), mat=M["red"],
      anchor=p + Vector((3.9, -0.6, -1.2)))
label("Lbl Bag", "airplane luggage", p + Vector((3.6, -0.6, -3.0)), 0.45, s(89.0), s(94.6), mat=M["dim"])
sym("Cf252", "Cf", 252, 98, p + Vector((-0.2, -0.6, 1.6)), 85.6, s(94.6))

# ==== 8 krypton-85: cloth washers ====
p, r = P[8], R[8]
box("Washer", (2.8, 2.4, 3.2), WHITE_P, (-2.2, 0, -0.9), r)
box("Washer Panel", (2.82, 2.42, 0.4), mat_pbr("Washer Panel", (0.2, 0.22, 0.26), roughness=0.5), (-2.2, 0, 0.55), r)
door = empty("Door", (-2.2, -1.34, -1.2), r, rot=(90 * DEG, 0, 0))
ring_curve("Door Ring", 0.95, GREY, door, depth=0.09)
blob("Door Glass", (0.9, 0.04, 0.9), glow("Door Glass", (0.35, 0.6, 0.9), 0.4, alpha=0.3), (-2.2, -1.3, -1.2), r)
drum = empty("Drum", (-2.2, -1.26, -1.2), r)
for k, col in enumerate(((0.8, 0.2, 0.2), (0.2, 0.4, 0.8), (0.9, 0.8, 0.2), (0.3, 0.7, 0.3))):
    a = k * 90 * DEG
    blob("Cloth %d" % k, (0.32, 0.06, 0.22), mat_pbr("Cloth %d" % k, col, roughness=0.8),
         (0.45 * math.cos(a), 0, 0.45 * math.sin(a)), drum, rot=(0, -a, 0), segs=12, rings=6)
spin(drum, s(95), END, 8, axis=1)
refocus(drum, [(s(95), s(98.3))])
DUST = mat_pbr("Dust", (0.45, 0.4, 0.33), roughness=0.9)
for k in range(14):
    d = dot("Dust %d" % k, 0.07, DUST, r, (-2.2 + rnd.uniform(-2.0, 2.0), -1.6, rnd.uniform(-2.6, 1.6)))
    appear(d, s(95.6 + 0.1 * k), s(97.0 + 0.1 * k), dur=6, s=(0.07,) * 3)
G = Vector((3.0, -0.2, 0.0))
gauge = empty("Gauge", G, r)
for k, (a0, a1, mat) in enumerate(((180, 90, M["green"]), (90, 0, M["red"]))):
    pts = [(1.4 * math.cos(a * DEG), 0, 1.4 * math.sin(a * DEG)) for a in range(a0, a1 - 1, -10)]
    line("Gauge Arc %d" % k, pts, mat, depth=0.06, parent=gauge)
needle = empty("Needle", (0, -0.05, 0), gauge)
arrow("Needle Arrow", 1.25, M["gold"], needle, r=0.03, head=0.15)
kf(needle, "rotation_euler", s(98.5), (0, -30 * DEG, 0), 'BEZIER')
kf(needle, "rotation_euler", s(102.5), (0, -150 * DEG, 0), 'BEZIER')
needle.rotation_euler = (0, -30 * DEG, 0)
dot("Gauge Hub", 0.12, GREY, gauge)
appear(gauge, s(96.0))
label("Lbl Gauge", "dust and pollutants level", p + G + Vector((0, -0.4, -0.75)), 0.45, s(96.4), None, mat=M["dim"])
label("Lbl High", "high", p + G + Vector((1.55, -0.4, 0.35)), 0.38, s(96.6), None, mat=M["red"], align='LEFT')
label("Lbl Low", "low", p + G + Vector((-1.55, -0.4, 0.35)), 0.38, s(96.6), None, mat=M["green"], align='RIGHT')
sym("Kr85", "Kr", 85, 36, p + G + Vector((0, -0.4, 2.1)), 95.8, None, size=0.5)

# ---- the one caption line per beat ----
for k, (txt, a, b) in enumerate((
        ("Remains hold carbon-14 atoms", 0.3, 6.6), ("Carbon-14 slowly decays", 6.6, 10.0),
        ("Fewer C-14 atoms: older remains", 10.0, 13.2), ("Uranium slowly turns into lead", 13.2, 16.5),
        ("More lead: older rock", 16.5, 20.0),
        ("Isotopes help find and treat disease", 20.0, 25.6), ("Iodine-131 collects in the thyroid", 25.6, 30.0),
        ("It cures goiter", 30.0, 33.2), ("Iodine-123: brain imaging", 33.2, 40.0),
        ("Tracers flow along the path", 40.0, 44.4), ("They pile up at the blockage", 44.4, 50.0),
        ("Radium and cobalt-60 rays", 50.0, 54.0), ("Cancer cells die, the tumor shrinks", 54.0, 59.0),
        ("Sodium-24 travels in the blood", 59.0, 63.0), ("It finds the blocked vessel", 63.0, 67.0),
        ("Plants take in C-14 in CO₂", 67.0, 71.6), ("C-14 traces photosynthesis", 71.6, 76.0),
        ("Americium-241: smoke detectors", 76.0, 82.4), ("It also finds oil wells", 82.4, 85.0),
        ("Californium-252: soil moisture", 85.0, 89.3), ("It checks luggage for explosives", 89.3, 95.0),
        ("Krypton-85 in cloth washers", 95.0, 99.0), ("It measures dust and pollutants", 99.0, None))):
    say("S%02d" % k, txt, a, b)

scene["ar_range"] = [s(25), s(40) - 1]      # AR: iodine-131 in the thyroid, iodine-123 in the brain
scene["ar_scale"] = 0.05
finish_film()
