# ---- Film 719: Unit 7 exercise, multiple choice questions (textbook pp.215-216) ----
# Same layout as films 515 / 617: card + options, 4 s to think, the answer lights green, then the reason and a small model.
# sh scripts/u7/b7.sh scripts/u7/f719_mcqs.py
DUR, INTRO, HOLD = 16.0, 3.0, 2.4
T = [0] + [INTRO + DUR * (k + 1) for k in range(10)]
start_film("719", "719 Exercise MCQs", T[-1])
s = sec
END = scene.frame_end
PS, R, CAM = stations(T)
NUM = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"]
Q = [
    ("The oxidation number of nitrogen N₂ is:", ["+1", "0", "+3", "−3"], 1,
     "N₂ is a free element: every free element\nhas oxidation number 0 (rule i)."),
    ("What is the oxidation number of C in CH₃OH?", ["−2", "0", "−1", "+1"], 0,
     "4 H = +4, O = −2. The molecule adds up to 0:\nC + 4 − 2 = 0, so C = −2."),
    ("A cation is", ["neutral.", "negatively charged.", "without charge.", "positively charged."], 3,
     "A cation has lost electrons:\nit carries a + charge (Na⁺, Cu²⁺)."),
    ("Electrons are lost by the", ["reducing agent as it undergoes oxidation.",
     "reducing agent as it undergoes reduction.", "oxidizing agent as it undergoes oxidation.",
     "oxidizing agent as it undergoes reduction."], 0,
     "The reducing agent gives electrons away,\nso it is oxidized itself."),
    ("What is the oxidation number assigned to\nmanganese in KMnO₄?", ["+7", "+3", "+2", "+4"], 0,
     "K = +1, 4 O = −8. Sum = 0:\n1 + Mn − 8 = 0, so Mn = +7."),
    ("In a particular redox reaction, the oxidation number\nof phosphorus changed from −3 to 0. Phosphorus:",
     ["Lost 3 electrons and was reduced.", "Lost 3 electrons and was oxidized.", "Gained 3 electrons and was reduced.",
      "Gained 3 electrons and was oxidized."], 1,
     "−3 → 0 goes up: 3 electrons lost.\nLosing electrons = oxidation."),
    ("Which statement is true for an electrochemical cell?", ["Oxidation occurs at the anode only.",
     "Reduction occurs at the anode only.", "Oxidation occurs at both the anode and cathode.",
     "Reduction occurs at both the anode and cathode."], 0,
     "Anode: oxidation.  Cathode: reduction.\nEvery cell, every time."),
    ("In which of the following does sulphur have an\noxidation number of +7?", ["HSO₃⁻", "SO₃", "H₂SO₄", "H₂S₂O₈"], 3,
     "The book's answer is H₂S₂O₈ (the others are\n+4, +6, +6). See NOTES: really +6 with O–O."),
    ("What happens to the reducing agent in an\noxidation-reduction reaction?", ["It is oxidized as it gains electrons.",
     "It is oxidized as it loses electrons", "It is reduced as it gains electrons.", "It is reduced as it loses electrons."], 1,
     "The reducing agent gives its electrons away:\nit loses them and is oxidized."),
    ("In an electrochemical cell, electrons travel in\nwhich direction?", ["From the anode to the cathode through\nthe external circuit.",
     "From the anode to the cathode through\nthe salt bridge.", "From the cathode to the anode through\nthe external circuit.",
     "From the cathode to the anode through\nthe salt bridge."], 0,
     "Electrons run in the wire, anode → cathode.\nOnly ions move in the salt bridge."),
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


def t1_(i):
    return None if i == 9 else T[i + 1] - 0.4


def L(i, name, body, off, t=0.6, size=0.3, mat=None):
    return label(name, body, PS[i] + MC + Vector(off), size, s(QA[i] + t), f1_(i), mat=mat or M["white"])


def W(i, x=0.0, z=0.0):
    return PS[i] + MC + Vector((x, 0, z))


def tw(i):
    return QA[i], fend(i) / FPS


def mb(i, key, items, dt=0.3, tb=1.2, k=1.0, bsize=0.36):
    a = QA[i]
    return molb("Q%d %s" % (i, key), W(i), items, a + dt, a + tb, t1_(i), k=k, bsize=bsize)


# i: N₂, both atoms 0
i = 0
mb(i, "N2", [("N", (-0.45, 0, 0), "0"), ("N", (0.45, 0, 0), "0")], k=1.3, bsize=0.45)
L(i, "Q0 L", "free element", (0, -0.6, -1.2), 2.0, 0.42, M["gold"])
# ii: CH₃OH, C = −2
i = 1
mb(i, "M", [("C", (-0.5, 0, 0), "−2"), ("O", (0.55, 0, 0), "−2"), ("H", (-0.9, 0, 0.75), None),
            ("H", (-1.3, 0, -0.2), None), ("H", (-0.6, 0, -0.85), None), ("H", (1.15, 0, 0.5), None)], tb=1.5)
L(i, "Q1 L", "H +1 each", (0, -0.6, -1.5), 2.2, 0.38, M["white"])
# iii: a cation: an atom loses an electron and turns orange (+)
i = 2
a, b = tw(i)
A("Q2 Na", "Na", W(i, -0.8), a + 0.2, t1_(i), k=1.2)
travel("Q2 e", W(i, -0.1, 0.4) + Vector((0, -0.5, 0)), W(i, 1.8, 0.4) + Vector((0, -0.5, 0)), a + 0.8, dur=1.2, r=0.13,
       mat=E_BLUE)
badge("Q2 B", "Na⁺ = cation", W(i, -0.8, 1.4) + Vector((0, -0.8, 0)), a + 2.0, t1_(i), size=0.45)
# iv: the reducing agent (Na) gives its electron to Cl
i = 3
a, b = tw(i)
A("Q3 Na", "Na", W(i, -1.6), a + 0.2, t1_(i))
A("Q3 Cl", "Cl", W(i, 1.6), a + 0.4, t1_(i))
travel("Q3 e", W(i, -1.0, 0.3) + Vector((0, -0.3, 0)), W(i, 1.0, 0.3) + Vector((0, -0.3, 0)), a + 1.0, dur=1.4, r=0.13,
       mat=E_BLUE)
L(i, "Q3 L", "reducing agent: oxidized", (-0.6, -0.6, 1.3), 2.4, 0.38, M["cyan"])
# v: KMnO₄
i = 4
mb(i, "K", [("Mn", (0, 0, 0), "+7"), ("O", (-0.95, 0, 0.7), "−2"), ("O", (0.95, 0, 0.7), "−2"),
            ("O", (-0.95, 0, -0.7), "−2"), ("O", (0.95, 0, -0.7), "−2"), ("K", (2.2, 0, 0), "+1")], k=0.9, bsize=0.32)
# vi: P loses 3 electrons: −3 → 0
i = 5
a, b = tw(i)
A("Q5 P", "P", W(i, -0.8), a + 0.2, t1_(i), k=1.3)
badge("Q5 B1", "−3", W(i, -0.8, 1.3) + Vector((0, -0.8, 0)), a + 0.5, a + 2.8, size=0.45)
for k in range(3):
    travel("Q5 e %d" % k, W(i, 0.0, 0.5 - 0.4 * k) + Vector((0, -0.6, 0)), W(i, 2.4, 0.5 - 0.4 * k) + Vector((0, -0.6, 0)),
           a + 0.8 + 0.4 * k, dur=1.2, r=0.12, mat=E_BLUE)
badge("Q5 B2", "0", W(i, -0.8, 1.3) + Vector((0, -0.8, 0)), a + 3.0, t1_(i), size=0.45)
L(i, "Q5 L", "lost 3 e⁻: oxidized", (0.4, -0.6, -1.4), 3.2, 0.38, M["gold"])
# vii: at the anode an anion leaves its electron: oxidation
i = 6
a, b = tw(i)
pl = plate("Q6 Anode", W(i, -1.2, -1.4), 2.6, GRAPHITE, a + 0.2, t1=t1_(i))
an = ion("Q6 Cl", ANI, W(i, 1.2, 0), a + 0.3, t1_(i), r=0.25)
move(an, s(a + 0.8), s(a + 2.0), W(i, 1.2, 0), W(i, -0.75, 0))
travel("Q6 e", W(i, -0.75, 0) + Vector((0, -0.4, 0)), W(i, -1.2, 1.0) + Vector((0, -0.4, 0)), a + 2.1, dur=1.0, r=0.12,
       mat=E_BLUE, lift=0.4)
L(i, "Q6 L", "anode: oxidation", (-0.4, -0.6, 1.6), 2.6, 0.42, M["gold"])
# viii: H₂S₂O₈, the book's answer
i = 7
mb(i, "S", [("S", (-0.6, 0, 0), "+7"), ("S", (0.6, 0, 0), "+7")], k=1.2, bsize=0.42)
L(i, "Q7 L", "H₂S₂O₈ (book)", (0, -0.6, -1.3), 2.0, 0.42, M["white"])
# ix: the reducing agent (Zn) loses 2 electrons
i = 8
a, b = tw(i)
A("Q8 Zn", "Zn", W(i, -0.8), a + 0.2, t1_(i), k=1.3)
for k in range(2):
    travel("Q8 e %d" % k, W(i, 0.1, 0.3 - 0.4 * k) + Vector((0, -0.6, 0)), W(i, 2.4, 0.3 - 0.4 * k) + Vector((0, -0.6, 0)),
           a + 0.8 + 0.5 * k, dur=1.3, r=0.12, mat=E_BLUE)
L(i, "Q8 L", "loses e⁻: oxidized", (-0.2, -0.6, 1.4), 2.4, 0.42, M["gold"])
# x: electrons in the wire from anode to cathode
i = 9
a, b = tw(i)
c = W(i, 0, -1.6)
plate("Q9 Zn", c + Vector((-1.5, 0, 0)), 2.0, ZINC, a + 0.2)
plate("Q9 Cu", c + Vector((1.5, 0, 0)), 2.0, COPPER, a + 0.3)
wp = [c + Vector((-1.5, 0, 2.0)), c + Vector((-1.5, 0, 3.0)), c + Vector((1.5, 0, 3.0)), c + Vector((1.5, 0, 2.0))]
wire("Q9 W", wp, a + 0.4)
flow("Q9 e", wp, a + 1.0, b, n=5, speed=1.2)
L(i, "Q9 L1", "anode", (-1.5, -0.6, -2.0), 1.2, 0.38, M["cyan"])
L(i, "Q9 L2", "cathode", (1.5, -0.6, -2.0), 1.5, 0.38, M["red"])

scene["ar_range"] = [s(QA[4]), s(T[5]) - 1]      # AR: KMnO₄ with its badges
scene["ar_scale"] = 0.05
for i, txt in enumerate(['Free element: 0', 'C + 4 − 2 = 0: C is −2', 'Cation: lost electrons, +', 'Reducing agent loses electrons', '1 + Mn − 8 = 0: Mn is +7', '−3 → 0: lost 3, oxidized', 'Anode: oxidation', 'Book answer: H₂S₂O₈', 'Reducing agent is oxidized', 'Electrons: anode → cathode']):
    say("Why %02d" % i, txt, MA[i], None if i == 9 else T[i + 1])
finish_film()
