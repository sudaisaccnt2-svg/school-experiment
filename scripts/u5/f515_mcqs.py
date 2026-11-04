# ---- Film 515: Unit 5 exercise, multiple choice questions (textbook pp.149-150) ----
# Same layout as film 12: card + options, 4 s to think, the answer lights green, then the reason and a small model.
# bsend.py common.py p2/lib.py u3/u3lib.py u4/u4lib.py u5/u5lib.py u5/f515_mcqs.py
DUR, INTRO, HOLD = 16.0, 3.0, 2.4
T = [0] + [INTRO + DUR * (k + 1) for k in range(10)]
start_film("515", "515 Exercise MCQs", T[-1])
s = sec
END = scene.frame_end
PS, R, CAM = stations(T)
NUM = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"]
Q = [
    ("The spontaneous mixing of particles is called:", ["evaporation", "sublimation", "diffusion", "boiling"], 2,
     "Particles mix by themselves, from crowded to\nless crowded: that is diffusion."),
    ("Which statement for the particles of solid is\nnot correct?", ["they move at great speed", "they are arranged in regular pattern",
     "there is a very little space between the particles", "the force of attraction between the particles are strong"], 0,
     "Solid particles only vibrate in place.\nThey do NOT move at great speed."),
    ("A liquid boils when its vapour pressure becomes\nequal to:", ["760cm of Hg", "1 Pascal", "101.325 kilo Pascal", "0.1 atm"], 2,
     "Boiling: vapour pressure = air pressure,\n1 atm = 101.325 kPa (760 mm of Hg, not cm)."),
    ("The vapour pressure of a liquid increases with the:", ["increase of pressure", "increase of temperature",
     "increase of intermolecular forces", "increase of polarity of molecules"], 1,
     "Hotter molecules move faster, more escape:\nhigher vapour pressure."),
    ("Water normally boils at 100°C but it is possible to\nboil at 50°C which variable would you have to\nchange to do this?",
     ["increase external pressure", "decrease external pressure", "increase surface area", "decrease surface area"], 1,
     "Less pressure on the surface → it boils at a\nlower temperature (like on a hill)."),
    ("The vapour pressure of a liquid in a closed\ncontainer depends upon:", ["amount of liquid", "surface area of the liquid",
     "temperature", "both (b) and (c)"], 2,
     "Not the amount, not the surface area:\nonly the temperature (and the liquid itself)."),
    ("Which one of the following is not an example of\namorphous solid?", ["rubber", "glass", "glucose", "plastic"], 2,
     "Glucose forms crystals with a regular pattern.\nRubber, glass and plastic are amorphous."),
    ("At freezing point which one of the following\ncoexists in dynamic equilibrium?", ["gas and solid", "liquid and gas",
     "liquid and solid", "all of these"], 2,
     "At the freezing point, liquid and solid\nexist together in equilibrium."),
    ("Ink spreads in water because of:", ["vapour pressure", "expansion", "diffusion", "compressibility of water"], 2,
     "Ink particles move from crowded to less\ncrowded through the water: diffusion."),
    ("What will be the pressure of a gas, if the volume\nof the gas at 2 atmospheres is increased from\n1.5 dm³ to 3 dm³?",
     ["1 atmosphere", "1.5 atmosphere", "2 atmosphere", "2.5 atmosphere"], 0,
     "Boyle: P₁V₁ = P₂V₂ → 2 × 1.5 = P₂ × 3\nP₂ = 1 atm (volume doubles, pressure halves)."),
]
FILL = mat_emit("Answer Fill", (0.2, 0.9, 0.4), 0.5, alpha=0.22)
hud("Choose", "Choose the correct option.", CAM[0], 0.5, 0.5, 0.06, s(0.3), s(2.8), M["white"], align='CENTER',
    weight="semibold")
Q0, QA, MA = [], [], []                      # question start / answer time (s)
for i, (qt, opts, ans, why) in enumerate(Q):
    q0 = T[i] + (INTRO if i == 0 else 0.0)
    qa = q0 + 7.2
    Q0.append(q0), QA.append(qa), MA.append(qa + HOLD)
    f1 = s(qa + HOLD)                     # v4: the card leaves; the model shows why
    act("MCQ %s" % NUM[i], s(q0))
    cam = CAM[i]
    hud("Title %d" % i, "Exercise: Multiple Choice Questions", cam, 0.5, 0.935, 0.05, s(T[i]) + 6, f1, M["gold"],
        align='CENTER')
    mcq_card(i, cam, NUM[i], qt, opts, ans, why, q0, qa, f1, FILL)
    for ob in [o for o in bpy.data.objects if o.name.startswith(N("Why %d" % i))]:
        bpy.data.objects.remove(ob, do_unlink=True)          # the reason is shown by the model instead
    shot("Cam %d Model" % i, qa + HOLD, None if i == 9 else T[i + 1], PS[i] + Vector((6.0, 0, 0.2)) + Vector((0, 0, -0.7)),
         dist=14, drift=0.2)
    for n in range(4):                 # 4 s to think
        hud("Count %d %d" % (i, n), str(4 - n), cam, 0.8, 0.5, 0.14, s(q0 + 3.0 + n), s(q0 + 3.9 + n),
            M["dim"] if n < 3 else M["gold"], align='CENTER', weight="semibold")
    hud("Think %d" % i, "Think …", cam, 0.8, 0.66, 0.04, s(q0 + 3.0), s(q0 + 6.9), M["cyan"], align='CENTER')


MC = Vector((6.0, 0, 0.2))           # model centre (right half of the frame)
QA = MA                              # v4: every model starts when the card has left


def fend(i):
    return END if i == 9 else s(T[i + 1])


def f1_(i):
    return None if i == 9 else s(T[i + 1] - 0.4)


def L(i, name, body, off, t=0.6, size=0.3, mat=None):
    return label(name, body, PS[i] + MC + Vector(off), size, s(QA[i] + t), f1_(i), mat=mat or M["white"])


def W(i, x=0.0, z=0.0):
    return PS[i] + MC + Vector((x, 0, z))




def tw(i):
    return QA[i], fend(i) / FPS


# i: two gases mix by themselves
i = 0
a, b = tw(i)
c = W(i)
appear(box_edges("Q0 Box", (4.0, 1.2, 2.6), c), sec(a), dur=8)
gp = zpath([(a, 0.0), (a + 0.8, 0.0), (a + 4.5, 1.0)])
gas("Q0 A", 8, c - Vector((2, 0.6, 1.3)), lambda t: c + Vector((-0.1 + 2.1 * gp(t), 0.6, 1.3)), a, b, speed=2.2, r=0.13, seed=1,
    f_in=sec(a + 0.2))
gas("Q0 B", 8, lambda t: c + Vector((0.1 - 2.1 * gp(t), -0.6, -1.3)), c + Vector((2, 0.6, 1.3)), a, b, speed=2.2, r=0.13,
    mat=MOL["gold"], seed=2, f_in=sec(a + 0.2))
L(i, "Q0 L", "diffusion", (0, -0.6, 1.9), 1.0, 0.45, M["gold"])
# ii: solid particles only vibrate
i = 1
a, b = tw(i)
ms = shake("Q1 S", grid_pts(5, 4, 0.44, W(i)), a, b, amp=0.04, r=0.17, seed=3)
for k, m in enumerate(ms):
    appear(m, sec(a + 0.2) + k, s=(0.17,) * 3)
L(i, "Q1 L", "only vibrate", (0, -0.6, 1.6), 1.2, 0.45, M["cyan"])
L(i, "Q1 X", "great speed ✗", (0, -0.6, -1.6), 2.0, 0.45, M["red"])
# iii: boiling: bubbles when VP = 101.325 kPa
i = 2
a, b = tw(i)
c = W(i, 0, -1.2)
dish("Q2", c, 3.2, 1.2, 2.0, 1.4, 16, a, b, speed=2.0, seed=4, f_in=sec(a))
BUB = mat_emit("Bubble", (0.85, 0.92, 1.0), 1.2, alpha=0.55)
for k in range(10):
    p0 = c + Vector((-1.2 + 0.27 * k, 0, 0.15))
    bb = sphere("Q2 Bub %d" % k, 0.11, BUB, p0, None, 12, 6)
    t0 = a + 1.0 + 0.35 * k
    hide_until(bb, sec(t0))
    move(bb, sec(t0), sec(t0 + 1.0), p0, p0 + Vector((0, 0, 1.25)), 'LINEAR')
    hide_from(bb, sec(t0 + 1.0) + 1)
L(i, "Q2 L", "101.325 kPa = 760 mm Hg", (0, -0.6, 1.5), 1.4, 0.4, M["gold"])
# iv: hotter → more vapour (closed jar on a flame)
i = 3
a, b = tw(i)
c = W(i, 0, -1.8)
closed_jar("Q3", c, 3.4, 1.2, 3.2, 1.0, 18, a, b, vap0=3, esc=[a + 0.6 + 0.3 * k for k in range(14)], speed=1.6, vspeed=3.4,
           seed=5, f_in=sec(a))
flame("Q3 Flame", c + Vector((0, 0, -0.8)), a + 0.4, b, s=0.7)
L(i, "Q3 L", "hotter → more vapour", (0, -0.6, 1.9), 1.6, 0.42, M["red"])
# v: less outside pressure → boils at a lower temperature
i = 4
a, b = tw(i)
c = W(i, 0, -1.2)
dish("Q4", c, 3.2, 1.2, 2.0, 1.4, 16, a, b, speed=1.8, seed=6, f_in=sec(a))
for k, x in enumerate((-0.8, 0.8)):
    ar = arrow("Q4 Air %d" % k, 1.0, M["red"], None, c + Vector((x, -0.7, 3.1)), (0, math.pi / 2, 0), r=0.04, head=0.25)
    appear(ar, sec(a + 0.4), dur=8)
    kf(ar, "scale", sec(a + 1.2), (1, 1, 1))
    kf(ar, "scale", sec(a + 2.6), (0.35, 0.35, 0.35))
L(i, "Q4 L", "less pressure → boils at 50 °C", (0, -0.6, 2.6), 2.6, 0.4, M["cyan"])
# vi: two jars, different amounts, same reading
i = 5
a, b = tw(i)
for k, (x, hl) in enumerate(((-1.6, 0.5), (1.6, 1.4))):
    closed_jar("Q5 %d" % k, W(i, x, -1.6), 2.4, 1.0, 2.8, hl, 6 + int(10 * hl), a, b, vap0=5, esc=[a + 0.5 + 0.8 * j for j in range(5)],
               ret=[a + 0.9 + 0.8 * j for j in range(5)], seed=7 + k, f_in=sec(a))
L(i, "Q5 L", "same temperature → same VP", (0, -0.6, 1.8), 1.6, 0.4, M["gold"])
# vii: glucose is crystalline: a regular little lattice
i = 6
a, b = tw(i)
lat = empty("Q6 Lat", W(i))
for k, p in enumerate(grid_pts(3, 3, 0.8, (0, 0, 0), ny=3)):
    appear(sphere("Q6 P %d" % k, 0.2, MOL["white"], p, lat, 16, 8), sec(a + 0.2) + k, s=(0.2,) * 3)
kf(lat, "rotation_euler", sec(a), (0.3, 0, 0.3), 'LINEAR')
kf(lat, "rotation_euler", sec(b), (0.3, 0, 1.6), 'LINEAR')
L(i, "Q6 L", "glucose: crystalline", (0, -0.6, 1.9), 1.4, 0.42, M["green"])
# viii: half solid, half liquid
i = 7
a, b = tw(i)
c = W(i, 0, -1.4)
appear(box_edges("Q7 Box", (4.0, 1.2, 2.2), c + Vector((0, 0, 1.1)), top=False), sec(a), dur=8)
ms = shake("Q7 S", grid_pts(4, 3, 0.42, c + Vector((-1.15, 0, 0.6))), a, b, r=0.16, seed=9)
for k, m in enumerate(ms):
    appear(m, sec(a + 0.2) + k, s=(0.16,) * 3)
gas("Q7 L", 12, c + Vector((0.1, -0.4, 0)), c + Vector((2.0, 0.4, 1.3)), a, b, speed=1.0, r=0.16, seed=10, f_in=sec(a + 0.3))
L(i, "Q7 L1", "solid", (-1.15, -0.6, 1.0), 1.2, 0.4, M["cyan"])
L(i, "Q7 L2", "liquid", (1.05, -0.6, 1.0), 1.4, 0.4, M["cyan"])
# ix: ink spreads in water
i = 8
a, b = tw(i)
c = W(i, 0, -1.6)
dish("Q8", c, 3.2, 1.2, 2.8, 2.5, 22, a, b, speed=0.7, seed=11, f_in=sec(a))
sp = zpath([(a, 0.0), (a + 0.6, 0.0), (a + 5.0, 1.0)])
gas("Q8 Ink", 8, lambda t: c + Vector((-0.4 - 1.2 * sp(t), -0.3, 1.8 - 1.8 * sp(t))), lambda t: c + Vector((0.4 + 1.2 * sp(t), 0.3, 2.5)),
    a, b, speed=0.8, r=0.13, mat=mat_emit("Mol Ink", (0.45, 0.2, 1.0), 1.6), seed=12, f_in=sec(a + 0.2))
# x: Boyle: volume doubles, pressure halves
i = 9
a, b = tw(i)
c = W(i, -0.8, -2.0)
cg, pis, nd = rig("Q9", c, 1.1, 3.6, a)
K9 = [(0, 1.4), (a + 1.0, 1.4), (a + 3.0, 2.8)]
key_piston(pis, K9)
needle_keys(nd, [(0, 0.6), (a + 1.0, 0.6), (a + 3.0, 0.3)])
pz9 = zpath(K9)
gas("Q9 G", 10, c + Vector((-0.75, -0.4, 0)), lambda t: c + Vector((0.75, 0.4, pz9(t) - 0.1)), a, b, speed=2.2, r=0.12, seed=13,
    f_in=sec(a + 0.2))
L(i, "Q9 L", "2 atm → 1 atm", (0, -0.6, 2.3), 3.0, 0.42, M["gold"])

scene["ar_range"] = [s(QA[6]), s(T[7]) - 1]      # AR: the little crystal
scene["ar_scale"] = 0.05
for i, txt in enumerate(['Mixing by itself: diffusion', 'Solid particles only vibrate', 'Boils at 101.325 kPa', 'Hotter: more escape', 'Less pressure: boils lower', 'Only temperature matters', 'Glucose forms crystals', 'Liquid and solid together', 'Ink spreads: diffusion', 'Volume doubles: 1 atm']):
    say("Why %02d" % i, txt, MA[i], None if i == 9 else T[i + 1])
finish_film()
