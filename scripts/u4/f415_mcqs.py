# ---- Film 415: Unit 4 exercise, multiple choice questions (textbook pp.118-119) ----
# Same layout as film 12: card + options, 4 s to think, the answer lights green, then the reason and a small model.
# bsend.py common.py p2/lib.py u3/u3lib.py u4/u4lib.py u4/f415_mcqs.py
DUR, INTRO, HOLD = 16.0, 3.0, 2.4
T = [0] + [INTRO + DUR * (k + 1) for k in range(10)]
start_film("415", "415 Exercise MCQs", T[-1])
s = sec
END = scene.frame_end
PS, R, CAM = stations(T)
NUM = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"]
Q = [
    ("An atom with a charge is called:", ["an electron", "a molecule", "a metal", "an ion"], 3,
     "An atom that has lost or gained electrons\ncarries a charge: it is an ion (Na⁺, Cl⁻)."),
    ("An element X is in group VI of the periodic table.\nThe ion will be represented by:", ["X⁺", "X⁻", "X²⁻", "X²⁺"], 2,
     "Group VI = 6 outer electrons. It gains 2 more\nto make 8, so it becomes X²⁻ (like O²⁻)."),
    ("Which pair of elements will join to form a\ncompound with one to one ratio:",
     ["Magnesium and Chlorine", "Sodium and Oxygen", "Potassium and Fluorine", "Lithium and Sulphur"], 2,
     "K gives 1 electron, F needs exactly 1:\nK⁺F⁻, one to one (KF)."),
    ("When calcium atom become a Calcium ion (Ca²⁺):",
     ["it loses an electron", "it loses two electrons", "it gains electron", "gains two electrons"], 1,
     "Ca is 2, 8, 8, 2. It loses its 2 outer electrons:\ncharge +2."),
    ("Which two elements will form a covalent compound?",
     ["Sodium and Oxygen", "Copper and Oxygen", "Carbon and Oxygen", "Magnesium and Oxygen"], 2,
     "Two non-metals share electrons: carbon and\noxygen make CO₂ (O=C=O)."),
    ("In the formation of an ionic bond, the atoms taking part:",
     ["only gain electrons", "share electrons", "lose and gain of electrons", "only lose electrons"], 2,
     "One atom loses (the metal) and the other gains\n(the non-metal): Na⁺ and Cl⁻."),
    ("Fluorine has an electronic configuration 2, 7 and Oxygen\n2, 6. The formula of fluorine oxide will be:",
     ["FO", "F₂O", "FO₂", "F₂O₂"], 1,
     "O needs 2, each F needs 1: one O shares with\ntwo F atoms: F–O–F, so F₂O."),
    ("Which of these statements about covalent bonds\nis incorrect?",
     ["HCl contains one pair of shared electron", "CCl₄ contains four pairs of shared electrons",
      "H₂O contains three pairs of shared electrons", "NH₃ contains three pairs of shared electrons"], 2,
     "Water has only TWO shared pairs (two O–H bonds),\nso statement (c) is wrong."),
    ("Which of the following ions do not have the\nelectronic configuration of an argon atom?",
     ["Ca²⁺", "S²⁻", "K⁺", "O²⁻"], 3,
     "Ca²⁺, S²⁻ and K⁺ are 2, 8, 8 like argon.\nO²⁻ is 2, 8: like neon."),
    ("Which one of the groups below contains only ionic\ncompounds?",
     ["CaO, HCl, MgO", "CaO, MgO, NaCl", "CO₂, CuSO₄, HCl", "CuSO₄, CH₄, NaCl"], 1,
     "Each is a metal with a non-metal: CaO, MgO, NaCl.\n(HCl, CO₂ and CH₄ are covalent.)"),
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


def ion_lbl(i, name, txt, off, t, col):
    return L(i, name, txt, off, t, 0.5, mat_emit("Q Ion %s" % name, col, 2.5))


PLUS, MINUS = (0.8, 0.6, 1.0), (0.45, 1.0, 0.55)
# i: sodium loses an electron -> Na+, an ion
i = 0
g, rr, oo = vatom("Q0 Na", 11, W(i), sec(QA[i]), [], r0=0.55, dr=0.6, e_r=0.12, nuc_r=0.09)
e = oo[0]
home = e.location.copy()
kf(e, "location", sec(QA[i] + 1.0), home, 'BEZIER')
kf(e, "location", sec(QA[i] + 2.2), home * 2.6, 'BEZIER')
hide_from(e, sec(QA[i] + 2.2))
drop_ring("Q0 Na", 2, QA[i] + 2.4)
ion_lbl(i, "Q0 Lbl", "Na⁺: an ion", (0, -0.6, -2.4), 2.6, PLUS)
# ii: group VI gains 2 -> X2-
i = 1
O = LRing("Q1 X", "X", W(i), 6, QA[i], None, r=1.3, angles=[76, 104, -14, 14, 166, 256])
for k, a in enumerate((194, 284)):
    p = O.loc + Vector((1.3 * math.cos(math.radians(a)), 0, 1.3 * math.sin(math.radians(a))))
    travel("Q1 In %d" % k, p + (p - O.loc).normalized() * 2.5, p, QA[i] + 1.2 + 0.7 * k, dur=1.1, lift=0.2)
    st = dot("Q1 Seat %d" % k, 0.11, E_GOLD, O.g, (1.3 * math.cos(math.radians(a)), 1.3 * math.sin(math.radians(a)), 0.02))
    hide_until(st, sec(QA[i] + 2.3 + 0.7 * k))
ion_lbl(i, "Q1 Lbl", "6 + 2 = 8 → X²⁻", (0, -0.6, -2.2), 3.2, MINUS)
# iii: K gives 1, F takes 1 -> K+ F-, 1 : 1
i = 2
K = LRing("Q2 K", "K", W(i, -1.9), 1, QA[i], None, r=1.0, angles=[0])
F = LRing("Q2 F", "F", W(i, 1.9), 7, QA[i], None, r=1.0, emat=E_GOLD)
K.seat(0, QA[i] + 1.2, W(i, 0.9 - 0.0) + Vector((-0.0, 0, 0)), dur=1.0)
hide_from(K.es[0], sec(QA[i] + 2.2))
st = dot("Q2 Seat", 0.11, E_BLUE, F.g, (-1.0, 0, 0.02))
hide_until(st, sec(QA[i] + 2.2))
ion_lbl(i, "Q2 K", "K⁺", (-1.9, -0.6, -1.6), 2.6, PLUS)
ion_lbl(i, "Q2 F", "F⁻", (1.9, -0.6, -1.6), 2.8, MINUS)
L(i, "Q2 Ratio", "1 : 1", (0, -0.6, 1.8), 3.2, 0.5, M["gold"])
# iv: calcium loses two
i = 3
g, rr, oo = vatom("Q3 Ca", 20, W(i), sec(QA[i]), [], r0=0.4, dr=0.45, e_r=0.1, nuc_r=0.08, ring_depth=0.013)
for j in range(2):
    e = oo[j]
    home = e.location.copy()
    kf(e, "location", sec(QA[i] + 1.0 + 0.3 * j), home, 'BEZIER')
    kf(e, "location", sec(QA[i] + 2.2 + 0.3 * j), home * 2.4, 'BEZIER')
    hide_from(e, sec(QA[i] + 2.2 + 0.3 * j))
drop_ring("Q3 Ca", 3, QA[i] + 2.8)
ion_lbl(i, "Q3 Lbl", "Ca²⁺", (0, -0.6, -2.4), 3.0, PLUS)
# v: O=C=O
i = 4
lewis("Q4 CO2", [("O", (-1.8, 0)), ("C", (0, 0)), ("O", (1.8, 0))], [(0, 1, 2), (1, 2, 2)],
      [(0, 90), (0, 270), (2, 90), (2, 270)], W(i), QA[i], t_line=QA[i] + 2.6, size=0.85)
# vi: lose and gain
i = 5
Na = LRing("Q5 Na", "Na", W(i, -1.9), 1, QA[i], None, r=1.0, angles=[0])
Cl = LRing("Q5 Cl", "Cl", W(i, 1.9), 7, QA[i], None, r=1.0, emat=E_GOLD)
Na.seat(0, QA[i] + 1.2, W(i, 0.9), dur=1.0)
hide_from(Na.es[0], sec(QA[i] + 2.2))
st = dot("Q5 Seat", 0.11, E_BLUE, Cl.g, (-1.0, 0, 0.02))
hide_until(st, sec(QA[i] + 2.2))
L(i, "Q5 Lose", "loses", (-1.9, -0.6, 1.6), 2.4, 0.45, M["red"])
L(i, "Q5 Gain", "gains", (1.9, -0.6, 1.6), 2.6, 0.45, M["cyan"])
# vii: F-O-F
i = 6
lewis("Q6 F2O", [("F", (-1.7, 0)), ("O", (0, 0)), ("F", (1.7, 0))], [(0, 1, 1), (1, 2, 1)],
      [(0, 90), (0, 180), (0, 270), (1, 90), (1, 270), (2, 90), (2, 0), (2, 270)], W(i), QA[i], t_line=QA[i] + 2.6,
      size=0.85)
# viii: water has two shared pairs
i = 7
lewis("Q7 H2O", [("H", (-1.6, 0)), ("O", (0, 0)), ("H", (1.6, 0))], [(0, 1, 1), (1, 2, 1)], [(1, 90), (1, 270)], W(i),
      QA[i], size=0.85)
pulses("Q7 P0", W(i, -0.8) + Vector((0, -0.4, 0)), None, [QA[i] + 1.6], r=0.4, mat=M["green"])
pulses("Q7 P1", W(i, 0.8) + Vector((0, -0.4, 0)), None, [QA[i] + 2.2], r=0.4, mat=M["green"])
L(i, "Q7 Two", "2 shared pairs, not 3", (0, -0.6, -1.6), 2.6, 0.42, M["red"])
# ix: O2- is 2,8 (neon), argon is 2,8,8
i = 8
vatom("Q8 O", 8, W(i, -2.2), sec(QA[i]), [], counts=[2, 8], r0=0.5, dr=0.6, e_r=0.1, nuc_r=0.08)
vatom("Q8 Ar", 18, W(i, 2.2), sec(QA[i] + 0.4), [], r0=0.45, dr=0.5, e_r=0.1, nuc_r=0.08)
ion_lbl(i, "Q8 O", "O²⁻: 2, 8 ✗", (-2.2, -0.6, -2.0), 1.4, MINUS)
L(i, "Q8 Ar", "Ar: 2, 8, 8", (2.2, -0.6, -2.0), 1.6, 0.42, M["gold"])
# x: metal + non-metal
i = 9
for k, f in enumerate(("CaO", "MgO", "NaCl")):
    L(i, "Q9 F%d" % k, f + " ✓", (0, -0.6, 1.4 - 1.2 * k), 1.0 + 0.5 * k, 0.55, M["green"])

scene["ar_range"] = [s(QA[4]), s(T[5]) - 1]      # AR: O=C=O
scene["ar_scale"] = 0.05
for i, txt in enumerate(['Lost or gained electrons: an ion', 'Group VI gains 2: X²⁻', 'K gives 1, F takes 1: KF', 'Calcium loses two electrons', 'Two non-metals share: CO₂', 'One loses, one gains', 'O shares with two F: F₂O', 'Water has only 2 shared pairs', 'O²⁻ is 2, 8: like neon', 'Metal + non-metal: all ionic']):
    say("Why %02d" % i, txt, MA[i], None if i == 9 else T[i + 1])
finish_film()
