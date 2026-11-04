# ---- Film 02: Niels Bohr's Atomic Theory (textbook pp.45-46, Fig 2.6, Activity 2.1) ----
# bsend.py common.py p2/lib.py p2/f02_bohr.py
# v3 layout (user: "too complicated and disorganized"): ONE picture per shot, big and centred; ONE caption place at
# the bottom (gold headline + one plain line); at most 3 big labels, no pointer lines; one thing moves at a time.
EQ_X = 16.0                     # rule 4: the equation explained piece by piece (new, after old 59.5 s)
SPIN_X = 19.0                   # the spin demo (rule 6a) is 19 s longer than the old shot: later acts shift
start_film("02", "02 Bohr's Atomic Theory", 126.0 + EQ_X + SPIN_X)


def s(t):
    """Old act times (seconds) -> frames; from 59.5 s on everything comes EQ_X later, from 77 s on also SPIN_X."""
    return sec(t + (EQ_X if t >= 59.5 else 0) + (SPIN_X if t >= 77 else 0))


def sr(t):
    """Spin-demo times (written as 70-96 s) -> frames."""
    return sec(t + EQ_X)


END = scene.frame_end
O = Vector((0, 0, 0))
RK, RL, RM = 1.45, 2.6, 3.75
RAD = {"K": RK, "L": RL, "M": RM}
FACE = (90 - 14) * DEG          # atom seen nearly face-on
CAKE = 28 * DEG                 # atom laid back so shells can stack up by energy
HGT = {"K": 0.0, "L": 1.7, "M": 2.4}     # shell height in the "energy cake" (outer = higher)
UP = Vector((0, math.sin(CAKE), math.cos(CAKE)))   # world +Z in the laid-back atom's local space

ST = Vector((40, 0, -1.6))      # stairs (rule 5)
BK = Vector((60, 0, 0))         # gold blocks (rule 6)
DM = Vector((80, 0, 0))         # spin demo (rule 6a)

camA = camera("Cam Atom", 40, (-0.8, -22.5, -0.6), (0.8, -21.5, -0.6), (0, 0, -0.9), 1, END, shift=(0, 0))
camB = camera("Cam Cake", 50, (-0.6, -22.5, 1.4), (0.6, -21.5, 1.4), (0, 0, 1.2), s(21), s(60), shift=(0, 0))
camC = camera("Cam Stairs", 40, ST + Vector((-0.5, -13.5, 1.3)), ST + Vector((0.5, -12.8, 1.3)),
              ST + Vector((0, 0, 1.35)), s(60), s(70), shift=(0, 0))
camD = camera("Cam Blocks", 40, BK + Vector((-0.5, -14.5, -0.8)), BK + Vector((0.5, -13.8, -0.8)),
              BK + Vector((0, 0, -0.85)), s(77), s(90), shift=(0, 0))
camS = camera("Cam Spin", 40, DM + Vector((-0.3, -15.5, 0.3)), DM + Vector((0.3, -15.0, 0.3)), DM + Vector((0, 0, 0.3)),
              sr(70), sr(96), shift=(0, 0))
camE = camera("Cam Spectrum", 34, (-0.6, -22.5, -2.4), (0.6, -21.5, -2.4), (0, 0, -2.5), s(100), END, shift=(0, 0))
for t, c in ((0, camA), (21, camB), (60, camC), (70, camS), (77, camD), (90, camA), (100, camE)):
    cut(max(1, s(t)), c)
for name, t in (("Intro", 0), ("Orbits", 8), ("Energy", 18), ("No loss", 30), ("Jumps", 38), ("Between", 60),
                ("mvr", 70), ("Fig 2.6", 90), ("Line spectrum", 100)):
    act(name, s(t))

# ---- the one caption place: bottom centre, gold headline + one plain line ----
SHOT_CAM = ((0, camA), (21, camB), (60, camC), (70, camS), (77, camD), (90, camA), (100, camE))


def cam_at(t):
    c = camA
    for t0, cc in SHOT_CAM:
        if t >= t0:
            c = cc
    return c


def cap(key, head, body, t0, t1=None):
    c = cam_at(t0)
    hud("Cap " + key, head, c, 0.5, 0.185, 0.072, s(t0 + 0.2), None if t1 is None else s(t1 - 0.2), M["gold"],
        align='CENTER', weight="semibold")
    if body:
        hud("Cap " + key + " b", body, c, 0.5, 0.09, 0.046, s(t0 + 0.5), None if t1 is None else s(t1 - 0.2),
            align='CENTER')


cap("Intro", "Bohr's Atom (1913)", "Niels Bohr's model of HYDROGEN: 1 proton + 1 electron", 0.1, 8)
cap("R1", "Rule 1: fixed paths", "The electron moves only on fixed circles, called SHELLS: K, L, M", 8, 18)
cap("R2", "Rule 2: farther = more energy", "Each shell is an energy level. The farther out, the higher it is.", 18, 30)
cap("R3", "Rule 3: no energy lost on a shell", "While it stays on its shell, its energy stays the same.", 30, 38)
cap("R4a", "Rule 4: jump UP = takes in energy", "It catches light and jumps to a higher shell.", 38, 46)
cap("R4b", "Jump DOWN = gives out light", "A SMALL drop (M → L) gives out red light.", 46, 52)
# no bare formula (user rule): the drops are drawn as arrows by the energy scale first, the book's symbols come last,
# each one pinned to the arrow or level it names
cap("R4c", "A BIGGER drop gives bluer light", "Bigger drop → more energy → here: ultraviolet", 52, 56.6)
cap("R4d", "Light carries the energy of the drop", "The book writes this as an equation. Let's read it piece by piece.", 56.6, 59.4)
cap("R5", "Rule 5: never in between", "Like stairs: always ON a step, never between two steps.", 60, 70)


def cap_raw(key, head, body, t0, t1, c, tf=sr):
    """Caption on its own clock (tf): sr for the spin demo, sec for the equation part."""
    hud("Cap " + key, head, c, 0.5, 0.185, 0.072, tf(t0 + 0.2), tf(t1 - 0.2), M["gold"], align='CENTER',
        weight="semibold")
    hud("Cap " + key + " b", body, c, 0.5, 0.09, 0.046, tf(t0 + 0.5), tf(t1 - 0.2), align='CENTER')


# rule 6a as a demo: a ball on a string, a gold "spin meter"; change ONE thing at a time and watch the bar grow
cap_raw("S0", "Rule 6: the amount of spin", "Anything going round has some spin. The gold bar shows how much.", 70, 74.6, camS)
cap_raw("S1", "A HEAVIER ball → more spin", "m = mass", 74.6, 79.6, camS)
cap_raw("S2", "FASTER → more spin", "v = speed (the gold arrow)", 79.6, 84.6, camS)
cap_raw("S3", "A WIDER circle → more spin", "r = radius (the blue line)", 84.6, 89.6, camS)
cap_raw("S4", "Spin = m × v × r", "The book calls the amount of spin ANGULAR MOMENTUM:  mvr", 89.6, 93.6, camS)
cap_raw("S5", "Bohr: not every amount is allowed", "The electron's spin comes only in whole blocks …", 93.6, 96.0, camS)
cap("R6b", "Spin comes in whole blocks", "1 block = shell K,   2 blocks = shell L,   3 blocks = shell M", 77, 84)
cap("R6b1", "Never half a block", "1½ blocks? There is no shell there, so the electron can't be there.", 84, 87.4)
cap("R6b2", "Shell number n = number of blocks", "Book: mvr = nh/2π    (one block = h/2π, a tiny fixed amount)", 87.4, 90)
cap("Fig", "Fig 2.6: Bohr's atomic model", "K (n=1), L (n=2), M (n=3).  K is nearest, with the least energy.", 90, 100)
cap("Pay1", "Each drop = one exact colour", "That is why hydrogen gives sharp LINES of light.", 100, 109)
cap("Pay2", "4 drops → 4 lines", "Drops from higher shells (N, O, P) down to L make the other colours.", 109, 118)
cap("End", "Bohr fixed Rutherford's problems", "✓ the atom is stable     ✓ hydrogen gives sharp lines", 118, 122.5)
cap("Next", "Next: Fundamental Particles  →", "Activity 2.1: build Bohr's atom for your class (tip: tap AR)", 122.5)

# ---- hydrogen atom: 1 proton, 1 electron; shells K L M ----
root = empty("Atom", O, rot=(FACE, 0, 0))
proton = sphere("Proton", 0.42, M["proton"], (0, 0, 0), root)
appear(proton, s(1.0), dur=10, s=(0.42,) * 3)
rings = {}
for i, (k, r) in enumerate(RAD.items()):
    rg = ring_curve("Ring " + k, r, M["orbit"], root, depth=0.02)
    appear(rg, s(9.0 + 1.2 * i), dur=12)
    rings[k] = rg

# the atom lays back (still on camA), the camera cuts closer, then L and M rise: an "energy cake"
for f, a in ((s(18.6), FACE), (s(20.6), CAKE), (s(60.4), CAKE), (s(60.5), FACE)):
    kf(root, "rotation_euler", f, Euler((a, 0, 0)), 'BEZIER')
for k, t in (("L", 22.0), ("M", 23.4)):
    kf(rings[k], "location", s(t), (0, 0, 0), 'BEZIER')
    kf(rings[k], "location", s(t) + 24, UP * HGT[k], 'BEZIER')
    kf(rings[k], "location", s(60.4), UP * HGT[k], 'CONSTANT')
    kf(rings[k], "location", s(60.5), (0, 0, 0), 'CONSTANT')

# electron on a pivot; it waits while something else is being shown
F_E = s(2.0)
PER = 120.0
piv = empty("Pivot", (0, 0, 0), root)
angle_e = focus_spin(piv, [(F_E, s(18.4)), (s(24.6), s(107.0)), (s(115.5), END)], 2 * math.pi / PER)
e = electron("Electron", piv, (RK, 0, 0), 0.17)
appear(e, F_E, dur=8, s=tuple(e.scale))
kf(e, "location", F_E, (RK, 0, 0), 'CONSTANT')
kf(piv, "location", F_E, (0, 0, 0), 'CONSTANT')


def back(t):
    """First time from t on when the electron is at the back right (its light then flies up, clear of the caption)."""
    for k in range(int(PER)):
        if 0.6 < (angle_e(s(t) + k) % (2 * math.pi)) < 1.2:
            return t + k / scene.render.fps
    return t


def jump(t, a, b, lifted=False, dur=8):
    f = s(t)
    kf(e, "location", f, (RAD[a], 0, 0), 'BEZIER')
    kf(e, "location", f + dur, (RAD[b], 0, 0), 'BEZIER')
    if lifted:
        kf(piv, "location", f, UP * HGT[a], 'BEZIER')
        kf(piv, "location", f + dur, UP * HGT[b], 'BEZIER')
    return f


def photon_mat(nm):
    return mat_emit("Photon %d" % int(nm // 10 * 10), wavelength_rgb(min(max(nm, 400), 690)), 9.0)


def photon(name, f, r, nm, inward, h=0.0, dist=3.0, dur=30):
    ph = squiggle(name, photon_mat(nm), 1.4, 3, 0.16, 0.045, root)
    th = angle_e(f)
    d = Vector((math.cos(th), math.sin(th), 0))
    ph.rotation_euler = (0, 0, th)
    off = UP * h
    kf(ph, "scale", 0, (0, 0, 0), 'CONSTANT')
    if inward:
        kf(ph, "scale", f - dur, (1, 1, 1), 'CONSTANT')
        kf(ph, "scale", f, (0, 0, 0), 'CONSTANT')
        move(ph, f - dur, f, off + d * (r + dist), off + d * (r + 0.25), 'LINEAR')
    else:
        kf(ph, "scale", f, (1, 1, 1), 'CONSTANT')
        kf(ph, "scale", f + dur, (0, 0, 0), 'CONSTANT')
        move(ph, f, f + dur, off + d * (r + 0.3), off + d * (r + 0.3 + dist), 'LINEAR')
    return ph


# ---- A. intro: two big labels, nothing else ----
label("Lbl Proton", "proton (+)", (0, -0.6, -0.95), 0.48, s(2.5), s(7.6), mat=M["red"])
label("Lbl Electron", "electron (−)", (0, -0.6, 2.25), 0.55, s(3.5), s(7.6), mat=M["cyan"])


# shell letters in the face-on view (one set per shot that needs them)
def shell_letters(tag, t0, t1, fmt="%s", stagger=0.0):
    a = -35 * DEG
    for i, (k, r) in enumerate(RAD.items()):
        x = (r + 0.55) * math.cos(a)
        z = (r + 0.55) * math.sin(a) * math.sin(FACE)
        label("Shell %s %s" % (k, tag), fmt % (k, i + 1) if "%d" in fmt else fmt % k, (x, -0.6, z), 0.6,
              s(t0 + stagger * i), s(t1), mat=M["cyan"], weight="semibold")


shell_letters("R1", 9.3, 17.6, stagger=1.2)

# ---- B. rule 2: energy cake, with one big "more energy" arrow ----
ea = arrow("Energy Arrow", 4.4, M["gold"], None, (-5.0, -0.2, -0.5), (0, -math.pi / 2, 0), r=0.06, head=0.4)
appear(ea, s(25.0), s(59.8))
label("Lbl Energy", "more energy", (-5.0, -0.6, 4.4), 0.5, s(25.4), s(59.8), mat=M["gold"], weight="semibold")
for i, k in enumerate("KLM"):
    label("Shell %s Cake" % k, k, (RAD[k] + 0.65, -0.6, HGT[k]), 0.55, s(22.0 + 1.4 * i), s(59.8), mat=M["cyan"],
          weight="semibold")

# ---- C. rule 3: the electron just goes round on K; K glows ----
glow_m = mat_emit("Orbit Glow", (0.5, 0.8, 1.0), 6.0)
gk = ring_curve("Ring Glow K Steady", RK, glow_m, root, depth=0.04)
appear(gk, s(30.8), s(37.6), dur=10)

# ---- D. rule 4: up (absorb), down (red), bigger drop (ultraviolet) ----
f1 = jump(41.0, "K", "M", lifted=True)
photon("Photon In", f1, RK, 420, True)
f2 = jump(back(47.5), "M", "L", lifted=True)
photon("Photon Red", f2, RM, 656, False, HGT["M"])
f3 = jump(back(54.0), "L", "K", lifted=True)
photon("Photon UV", f3, RL, 400, False, HGT["L"])
# the size of each drop, drawn beside the energy arrow (ticks = the levels K, L, M)
for k in "KLM":
    tk = line("Tick " + k, [(-5.3, -0.2, HGT[k]), (-4.7, -0.2, HGT[k])], M["gold"], depth=0.03)
    appear(tk, s(25.6), s(59.8))
drops = {}
for nm, a, b, f in ((656, "M", "L", f2), (400, "L", "K", f3)):
    da = arrow("Drop %s%s" % (a, b), HGT[a] - HGT[b], photon_mat(nm), None, (-4.35, -0.2, HGT[a]), (0, math.pi / 2, 0),
               r=0.05, head=0.25)
    appear(da, f + 4, s(59.8))
    drops[a + b] = da
label("Lbl E2", "E₂", (-5.8, -0.6, HGT["L"]), 0.55, s(56.8), s(59.8), mat=M["gold"], weight="semibold")
label("Lbl E1", "E₁", (-5.8, -0.6, HGT["K"]), 0.55, s(57.3), s(59.8), mat=M["gold"], weight="semibold")
EQ = [("EQ1", "E₂ and E₁: the energy of each shell", "E₂ = the higher shell (L)      E₁ = the lower shell (K)", 59.6, 63.6),
      ("EQ2", "ΔE = E₂ − E₁: the size of the drop", "Higher energy minus lower energy = the energy it loses", 63.6, 67.6),
      ("EQ3", "hν: the energy of the light", "h = a fixed number (Planck's constant)      ν = how fast the light wave wiggles", 67.6, 71.6),
      ("EQ4", "ΔE = E₂ − E₁ = hν", "Energy lost in the drop = energy of the light: bigger drop → faster wiggles → bluer", 71.6, 75.6)]
for key, head, body, t0, t1 in EQ:
    cap_raw(key, head, body, t0, t1, camB, tf=sec)
# E₂ / E₁: the two shells light up, one after the other
for k, t0 in (("L", 60.0), ("K", 61.4)):
    gl = ring_curve("Ring Glow %s Eq" % k, RAD[k], glow_m, rings[k], depth=0.045)
    appear(gl, sec(t0), sec(63.4), dur=8)
# ΔE: the drop arrow pulses twice
for t0 in (64.2, 65.4):
    d = drops["LK"]
    kf(d, "scale", sec(t0), (1, 1, 1), 'BEZIER')
    kf(d, "scale", sec(t0) + 7, (1, 2.2, 2.2), 'BEZIER')
    kf(d, "scale", sec(t0) + 14, (1, 1, 1), 'BEZIER')
# hν: a slow red wave (small drop) and a fast ultraviolet wave (big drop)
for nm, waves, z, txt, t0 in ((656, 2, 2.3, "slow wiggles", 68.2), (400, 6, 0.5, "fast wiggles", 69.2)):
    wv = squiggle("Wave %d" % nm, photon_mat(nm), 2.0, waves, 0.24, 0.045)
    wv.location = (6.0, -0.2, z)
    wv.rotation_euler = (math.pi / 2, 0, 0)
    appear(wv, sec(t0), sec(75.6), dur=10)
    label("Lbl Wave %d" % nm, txt, (6.0, -0.6, z - 0.62), 0.32, sec(t0 + 0.4), sec(75.6), mat=photon_mat(nm),
          weight="semibold")
label("Lbl dE", "ΔE = the drop", (-3.0, -0.6, 0.3), 0.5, s(57.8), s(59.8), mat=photon_mat(400), weight="semibold")

# ---- E. rule 5: stairs, alone. A ball hops ON the steps ✓; a ghost ball between steps ✗ ----
STEP = mat_pbr("Step Metal", (0.5, 0.55, 0.65), metallic=0.7, roughness=0.3)
stairs = empty("Stairs", ST)
SW_, SH_ = 1.3, 0.8
for k in range(3):
    bx = bmesh.new()
    bmesh.ops.create_cube(bx, size=1.0)
    for v in bx.verts:
        v.co = Vector((v.co.x * SW_, v.co.y * 1.2, (v.co.z + 0.5) * SH_ * (k + 1))) + Vector(((k - 1) * SW_, 0, 0))
    mesh_from_bm("Step %d" % k, bx, STEP, parent=stairs)
appear(stairs, s(60.3), dur=10)
BR = 0.3


def top(k):
    return Vector(((k - 1) * SW_, -0.2, SH_ * (k + 1) + BR))


sb = sphere("Stairs Ball", BR, M["electron"], top(0), stairs, 24, 12)
appear(sb, s(61.0), dur=8, s=(BR,) * 3)
kf(sb, "location", s(61.0), top(0), 'CONSTANT')
for k, t in ((0, 62.0), (1, 63.4)):
    a, b = top(k), top(k + 1)
    kf(sb, "location", s(t), a, 'BEZIER')
    kf(sb, "location", s(t) + 7, (a + b) / 2 + Vector((0, 0, 0.9)), 'BEZIER')
    kf(sb, "location", s(t) + 14, b, 'BEZIER')
label("Lbl On", "✓  ON a step", ST + Vector((SW_, -0.8, 3 * SH_ + 1.0)), 0.36, s(64.4), s(69.6), mat=M["green"],
      weight="semibold")
gh = sphere("Stairs Ghost", BR, mat_emit("Ghost Red", (1.0, 0.3, 0.25), 1.6, alpha=0.5),
            Vector((top(0).x + 0.1, -0.2, (top(0).z + top(1).z) / 2 + 0.15)), stairs, 24, 12)
appear(gh, s(66.0), s(69.4), dur=8, s=(BR,) * 3)
label("Lbl Between", "✗  never in between", ST + Vector((-1.9, -0.8, 2.3)), 0.36, s(66.4), s(69.6), mat=M["red"],
      weight="semibold")

BLK = mat_pbr("Block Gold", (1.0, 0.72, 0.3), metallic=0.8, roughness=0.25)
# ---- F. rule 6a: spin demo. Ball on a string (face-on), gold spin meter on the right ----
SC = DM + Vector((-0.6, 0, 1.15))                 # centre of the circle
R0, R1 = 0.95, 1.9
spin = empty("Spin Root", SC, rot=(math.pi / 2, 0, 0))   # local XY faces the camera
hubm = sphere("Spin Hub", 0.12, M["dim"], (0, 0, 0), spin, 16, 8)
appear(hubm, sr(70.2), sr(95.8), s=(0.12,) * 3)
guide = ring_curve("Spin Path", R0, M["orbit"], spin, depth=0.012)
appear(guide, sr(70.2), sr(95.8), dur=10)
arm = empty("Spin Arm", (0, 0, 0), spin)
holder = empty("Spin Holder", (R0, 0, 0), arm)
ball = sphere("Spin Ball", 0.24, M["electron"], (0, 0, 0), holder, 24, 12)
appear(ball, sr(70.4), sr(95.8), s=(0.24,) * 3)
string = cyl("Spin String", 0.035, 0.035, 1.0, M["cyan"], (0, 0, 0), arm, rot=(0, math.pi / 2, 0), base=True, segs=12)
appear(string, sr(70.4), sr(95.8), s=(1, 1, R0 - 0.22))
varrow = arrow("Spin Speed", 1.0, M["gold"], holder, (0, 0.4, 0), (0, 0, math.pi / 2), r=0.05, head=0.28)
appear(varrow, sr(70.8), sr(95.8))

# turning: one turn per 3 s; twice as fast for "faster"; same SPEED on the wider circle = half the turns
W0 = 2 * math.pi / 90
spans = [(sr(70.2), sr(80.2), W0), (sr(80.2), sr(85.2), 2 * W0), (sr(85.2), sr(96.0), W0)]
ang = 0.0
for f0, f1, w in spans:
    kf(arm, "rotation_euler", f0, Euler((0, 0, ang)), 'LINEAR')
    ang += w * (f1 - f0)
    kf(arm, "rotation_euler", f1, Euler((0, 0, ang)), 'LINEAR')

# 1. heavier: the ball grows
kf(ball, "scale", sr(75.2), (0.24,) * 3, 'BEZIER')
kf(ball, "scale", sr(75.2) + 18, (0.36,) * 3, 'BEZIER')
kf(ball, "scale", sr(95.8), (0.36,) * 3, 'BEZIER')
pop_out(ball, sr(95.8), 6, (0.36,) * 3)
# 2. faster: the speed arrow doubles
kf(varrow, "scale", sr(80.2), (1, 1, 1), 'BEZIER')
kf(varrow, "scale", sr(80.2) + 15, (2, 1, 1), 'BEZIER')
kf(varrow, "scale", sr(95.8), (2, 1, 1), 'BEZIER')
pop_out(varrow, sr(95.8), 6, (2, 1, 1))
# 3. wider: the ball moves out, the string and the path grow (speed arrow stays the same length)
kf(holder, "location", sr(85.2), (R0, 0, 0), 'BEZIER')
kf(holder, "location", sr(85.2) + 30, (R1, 0, 0), 'BEZIER')
kf(string, "scale", sr(85.2), (1, 1, R0 - 0.22), 'BEZIER')
kf(string, "scale", sr(85.2) + 30, (1, 1, R1 - 0.22), 'BEZIER')
kf(string, "scale", sr(95.8), (1, 1, R1 - 0.22), 'BEZIER')
pop_out(string, sr(95.8), 6, (1, 1, R1 - 0.22))
kf(guide, "scale", sr(85.2), (1, 1, 1), 'BEZIER')
kf(guide, "scale", sr(85.2) + 30, (R1 / R0,) * 3, 'BEZIER')
kf(guide, "scale", sr(95.8), (R1 / R0,) * 3, 'BEZIER')
pop_out(guide, sr(95.8), 6, (R1 / R0,) * 3)

# the spin meter: 1 → ×2 → ×4 → ×8, one change at a time
MB = DM + Vector((4.3, 0, -1.3))
mb = bmesh.new()
bmesh.ops.create_cube(mb, size=1.0)
for v in mb.verts:
    v.co = Vector((v.co.x * 0.8, v.co.y * 0.8, v.co.z + 0.5))
meter = mesh_from_bm("Spin Meter", mb, BLK, loc=MB)   # same gold as the blocks of the next shot
H = [0.5, 1.0, 2.0, 4.0]
appear(meter, sr(71.6), sr(95.8), s=(1, 1, H[0]))
for i, t in ((1, 75.8), (2, 80.8), (3, 85.8)):
    kf(meter, "scale", sr(t), (1, 1, H[i - 1]), 'BEZIER')
    kf(meter, "scale", sr(t) + 15, (1, 1, H[i]), 'BEZIER')
kf(meter, "scale", sr(95.8), (1, 1, H[3]), 'BEZIER')
pop_out(meter, sr(95.8), 6, (1, 1, H[3]))
label("Lbl Spin Amount", "amount of spin", MB + Vector((0, -0.6, -0.5)), 0.34, sr(71.8), sr(95.8), mat=M["gold"],
      weight="semibold")
for i, (txt, t0, t1) in enumerate((("1", 72.2, 75.8), ("× 2", 76.4, 80.8), ("× 4", 81.4, 85.8), ("× 8", 86.6, 95.8))):
    label("Lbl Spin Times%d" % i, txt, MB + Vector((0.75, -0.6, H[i] - 0.1)), 0.42, sr(t0), sr(t1), mat=M["gold"],
          align='LEFT', weight="semibold")
# the list on the left grows: what makes more spin
for txt, z, mat, t0 in (("m  heavier", 2.4, M["white"], 75.4), ("v  faster", 1.6, M["gold"], 80.4),
                        ("r  wider", 0.8, M["cyan"], 85.4)):
    label("Lbl Spin " + txt[0], txt, DM + Vector((-5.9, -0.6, z + 0.4)), 0.42, sr(t0), sr(95.8), mat=mat, align='LEFT',
          weight="semibold")
label("Lbl mvr", "m × v × r", MB + Vector((0, -0.6, H[3] + 0.55)), 0.5, sr(90.0), sr(95.8), mat=M["gold"],
      weight="semibold")

# ---- G. rule 6b: whole gold blocks of h/2π (K 1, L 2, M 3); a half block bounces off ----
BZ = -1.9
for n, t in ((1, 78.2), (2, 80.6), (3, 83.0)):
    x = BK.x + 2.2 * (n - 2)
    for k in range(n):
        cb = bmesh.new()
        bmesh.ops.create_cube(cb, size=0.7)
        blk = mesh_from_bm("Block %d %d" % (n, k), cb, BLK, loc=(x, 0, BZ + 0.35 + 0.74 * k))
        appear(blk, s(t + 0.4 * k), dur=8)
    label("Lbl Block %d" % n, "%s: %d block%s" % ("KLM"[n - 1], n, "" if n == 1 else "s"), (x, -0.6, BZ - 0.5), 0.36,
          s(t), None, mat=M["cyan"], weight="semibold")
    # the shell it buys: more blocks = a bigger shell (a small ring with its electron above each stack)
    rr = 0.25 + 0.15 * n
    mini = empty("Block Shell %d" % n, (x, 0, BZ + 0.74 * n + 0.3 + rr), rot=(math.pi / 2, 0, 0))
    rg = ring_curve("Block Ring %d" % n, rr, M["orbit"], mini, depth=0.02)
    appear(rg, s(t + 0.4 * n + 0.4), dur=10)
    me = electron("Block e %d" % n, mini, (rr * 0.7071, rr * 0.7071, 0), 0.1)
    appear(me, s(t + 0.4 * n + 0.8), dur=8, s=tuple(me.scale))
hc = bmesh.new()
bmesh.ops.create_cube(hc, size=1.0)
for v in hc.verts:
    v.co = Vector((v.co.x * 0.7, v.co.y * 0.7, v.co.z * 0.35))
HX = BK.x - 1.1                 # in the gap between 1 and 2 blocks: "1½" has no shell
hb = mesh_from_bm("Half Block", hc, mat_emit("Half Block Red", (1.0, 0.3, 0.25), 1.5), loc=(HX, 0, 2.2))
kf(hb, "location", s(84.2), (HX, 0, 2.2), 'BEZIER')
kf(hb, "location", s(84.2) + 14, (HX, 0, BZ + 0.9), 'BEZIER')
kf(hb, "location", s(84.2) + 30, (HX, 0, BZ + 1.3), 'BEZIER')
appear(hb, s(84.0), s(87.2), dur=5)
label("Lbl Half", "✗  1½ blocks", (HX, -0.6, 2.85), 0.36, s(84.6), s(87.4), mat=M["red"], weight="semibold")

# ---- H. Fig 2.6: shells glow one at a time with K, L, M (n = 1, 2, 3) ----
shell_letters("Fig", 90.6, 99.6, stagger=1.4)
for i, k in enumerate("KLM"):
    hl = ring_curve("Ring Glow " + k, RAD[k], glow_m, root, depth=0.04)
    t0 = s(90.6 + 1.4 * i)
    kf(hl, "scale", 0, (0, 0, 0), 'CONSTANT')
    kf(hl, "scale", t0, (1, 1, 1), 'CONSTANT')
    kf(hl, "scale", t0 + 36, (1, 1, 1), 'CONSTANT')
    kf(hl, "scale", t0 + 37, (0, 0, 0), 'CONSTANT')

# ---- I. payoff: each drop lands as one coloured line on a strip under the atom ----
SW, SH, ZS = 7.6, 0.72, -4.45
X0 = -SW / 2
bm = bmesh.new()
bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=0.5)
strip = mesh_from_bm("Strip", bm, mat_emit("Strip Dark", (0.02, 0.02, 0.03), 1.0))
strip.location = (0, 0, ZS)
strip.rotation_euler = (math.radians(90), 0, 0)
strip.scale = (SW, SH, 1)
overlay_only(strip)
appear(strip, s(100.8), dur=10, s=(SW, SH, 1))
WORLD = Euler((FACE, 0, 0)).to_matrix()


def spectral_line(name, nm, f_land, start_world, tag, row=0):
    x = X0 + SW * (nm - 380) / 320
    c = wavelength_rgb(nm)
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=0.5)
    ln = mesh_from_bm("Line %d" % nm, bm, mat_emit("Line %d" % nm, c, 6.0))
    ln.location = (x, -0.02, ZS)
    ln.rotation_euler = (math.radians(90), 0, 0)
    ln.scale = (0.08, SH * 0.96, 1)
    overlay_only(ln)
    appear(ln, f_land, dur=5, s=(0.08, SH * 0.96, 1))
    label("Lbl Line %d" % nm, tag, (x, -0.6, ZS - 0.75 - 0.55 * row), 0.48, f_land + 4, None,
          mat=mat_emit("Lbl Line %d" % nm, c, 2.4))
    ph = squiggle(name, photon_mat(nm), 1.2, 3, 0.14, 0.04)
    a = Vector(start_world)
    b = Vector((x, -0.05, ZS + 0.3))
    d = b - a
    ph.rotation_euler = (math.radians(90), 0, 0)
    ph.rotation_euler.rotate(Euler((0, -math.atan2(d.z, d.x), 0)))
    kf(ph, "scale", 0, (0, 0, 0), 'CONSTANT')
    kf(ph, "scale", f_land - 30, (1, 1, 1), 'CONSTANT')
    kf(ph, "scale", f_land, (0, 0, 0), 'CONSTANT')
    move(ph, f_land - 30, f_land, a, b, 'LINEAR')
    return ln


fa = jump(102.5, "K", "M")
photon("Photon In 2", fa, RK, 420, True)
fd = jump(105.5, "M", "L")
th = angle_e(fd)
spectral_line("Photon H-alpha", 656.3, fd + 30, WORLD @ Vector((RM * math.cos(th), RM * math.sin(th), 0)), "M → L")
# the other visible lines: drops to L from higher shells N, O, P (n = 4, 5, 6), one at a time
for i, (nm, tag) in enumerate(((486.1, "N → L"), (434.0, "O → L"), (410.2, "P → L"))):
    a = -90 * DEG + (i - 1) * 25 * DEG
    start = WORLD @ (Vector((math.cos(a), math.sin(a), 0)) * (RL + 0.8))
    spectral_line("Photon %d" % int(nm), nm, s(110.5 + 1.6 * i), start, tag, row=i == 1)
finish_film()
