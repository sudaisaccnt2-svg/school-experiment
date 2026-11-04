# ---- Film 313: Unit 3 exercise, multiple choice questions (textbook p.88) ----
# Same layout as film 12: card + options, 4 s to think, the answer lights green, then the reason and a small model.
# bsend.py common.py p2/lib.py u3/u3lib.py u3/f313_mcqs.py
DUR, INTRO = 13.0, 3.0
T = [0] + [INTRO + DUR * (k + 1) for k in range(10)]
start_film("313", "313 Exercise MCQs", T[-1])
s = sec
END = scene.frame_end
PS, R, CAM = stations(T)
NUM = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"]
Q = [
    ("Which of the following elements is in the\nsame family as fluorine?",
     ["silicon", "antimony", "iodine", "arsenic"], 2,
     "Fluorine and iodine are both in group VIIA,\nthe halogen family."),
    ("Which of the following would have the\nsmallest ionization energy?", ["K", "P", "S", "Ca"], 0,
     "Potassium is the biggest atom here and in group IA:\nits one outer electron is lost most easily (419)."),
    ("An element has configuration 2, 8, 1. It belongs to",
     ["group I and III period", "group III and I period", "group I and VII period", "group VII and III period"], 0,
     "3 shells → period III.  1 outer electron → group I.\n(It is sodium.)"),
    ("Which of the following elements would be\nmost similar to carbon?",
     ["nitrogen", "boron", "oxygen", "silicon"], 3,
     "Silicon is just below carbon in group IVA:\nthe same number of outer electrons (4)."),
    ("s-block elements are:", ["metals", "non-metals", "metalloids", "transition"], 0,
     "Groups IA and IIA (alkali and alkaline earth metals)\nare all metals (hydrogen is the one exception)."),
    ("Which of the following would have the\nlargest ionization energy?", ["Na", "Al", "H", "He"], 3,
     "Helium has a full, tiny shell held very tightly:\n2372 kJ/mol, the largest of all."),
    ("Elements in a ______ have similar chemical properties:",
     ["period", "group", "both a and b", "neither a nor b"], 1,
     "Elements in a group have the same number of outer\nelectrons, so they behave alike."),
    ("An element has 8 electrons in its valence shell.\nIt is a member of:",
     ["alkali family", "halogen family", "noble family", "carbon family"], 2,
     "8 outer electrons = a full shell: the noble gases\n(group VIIIA) like neon and argon."),
    ("The modern periodic table is based on:",
     ["atomic number", "mass number", "neutron number", "isotope number"], 0,
     "Modern periodic law: properties depend on the\natomic number (the number of protons)."),
    ("Shielding effect is due to:", ["neutron", "proton", "proton and neutron", "electron"], 3,
     "The inner ELECTRONS screen the outer electrons\nfrom the pull of the nucleus."),
]
FILL = mat_emit("Answer Fill", (0.2, 0.9, 0.4), 0.5, alpha=0.22)
hud("Choose", "Choose the correct option.", CAM[0], 0.5, 0.5, 0.06, s(0.3), s(2.8), M["white"], align='CENTER',
    weight="semibold")
Q0, QA = [], []                      # question start / answer time (s)
for i, (qt, opts, ans, why) in enumerate(Q):
    q0 = T[i] + (INTRO if i == 0 else 0.0)
    qa = q0 + 7.2
    Q0.append(q0), QA.append(qa)
    f1 = None if i == 9 else s(T[i + 1] - 0.4)
    act("MCQ %s" % NUM[i], s(q0))
    cam = CAM[i]
    hud("Title %d" % i, "Exercise: Multiple Choice Questions", cam, 0.5, 0.935, 0.05, s(T[i]) + 6, f1, M["gold"],
        align='CENTER')
    mcq_card(i, cam, NUM[i], qt, opts, ans, why, q0, qa, f1, FILL)
    for n in range(4):                 # 4 s to think
        hud("Count %d %d" % (i, n), str(4 - n), cam, 0.8, 0.5, 0.14, s(q0 + 3.0 + n), s(q0 + 3.9 + n),
            M["dim"] if n < 3 else M["gold"], align='CENTER', weight="semibold")
    hud("Think %d" % i, "Think …", cam, 0.8, 0.66, 0.04, s(q0 + 3.0), s(q0 + 6.9), M["cyan"], align='CENTER')


MC = Vector((6.0, 0, 0.2))           # model centre (right half of the frame)


def fend(i):
    return END if i == 9 else s(T[i + 1])


def f1_(i):
    return None if i == 9 else s(T[i + 1] - 0.4)


def L(i, name, body, off, t=0.6, size=0.3, mat=None):
    return label(name, body, PS[i] + MC + Vector(off), size, s(QA[i] + t), f1_(i), mat=mat or M["white"])


def mini(i, rows, sc=0.75, color="cat", numbers=False, extra=()):
    """A small wall table of only the 8 main (A) groups, rows 1..rows, in the right half of station i."""
    zs = [z for z in range(1, 87) if place(z)[0] <= rows and place(z)[1] in A_COLS] + list(extra)
    tb = Table("Q%d Tab" % i, (0, 0, 0), zs=zs, color=color, numbers=numbers)
    for z in zs:
        r, c = place(z)
        tb.T[z]["t"].location = Vector((A_COLS.index(c) - 3.5, (rows + 1) / 2 - r, 0))
    tb.root.parent = R[i]
    tb.root.location = MC + Vector((0.6, 0, -0.3))
    appear(tb.root, s(QA[i]), dur=10, s=(sc,) * 3)
    return tb


def bars(i, vals, win, K=1.5 / 1000):
    """Ionization-energy bars (book Table 3.3); the winner is green."""
    for k, sym in enumerate(vals):
        x = (k - (len(vals) - 1) / 2) * 1.6
        ebar("Q%d Bar %s" % (i, sym), PS[i] + MC + Vector((x, 0, -1.9)), IE1[sym] * K, QA[i] + 0.3 + 0.3 * k,
             str(IE1[sym]), M["green"] if sym == win else None, t_out=T[i + 1] - 0.4 if i < 9 else None)
        L(i, "Lbl Q%d %s" % (i, sym), sym, (x, -0.6, -2.4), 0.4 + 0.3 * k, 0.36, M["green"] if sym == win else None)


# i: the halogen column lights up
i = 0
tb = mini(i, 5, sc=0.65)
tb.focus(HALOGEN, s(QA[i] + 1.0), None, small=0.4)
L(i, "Lbl Hal", "F and I: group VIIA", (0, -0.6, 2.5), 1.2, 0.34, M["gold"])
# ii, vi: ionization-energy bars
bars(1, ["K", "Ca", "P", "S"], "K")
bars(5, ["Na", "Al", "H", "He"], "He", K=1.2 / 1000)
# iii: 2, 8, 1 = sodium
i = 2
flat_atom("Na281", R[i], MC, [0.7, 1.4, 2.2], [2, 8, 1], 11, 12, s(QA[i]), fend(i), nuc_r=0.14, e_r=0.11)
L(i, "Lbl Shells", "3 shells → period III", (0, -0.6, 2.75), 1.0, 0.32, M["gold"])
L(i, "Lbl Out1", "1 outer e⁻ → group I", (0, -0.6, -2.75), 1.8, 0.32, M["cyan"])
# iv: carbon and silicon in one column
i = 3
tb = mini(i, 3)
tb.focus({6, 14}, s(QA[i] + 1.0), None, small=0.4)
L(i, "Lbl CSi", "C and Si: group IVA", (0, -0.6, 2.4), 1.2, 0.34, M["gold"])
# v: s-block = metals
i = 4
tb = mini(i, 4, color=lambda z: "b_" + block(z, book=True))
tb.focus({3, 4, 11, 12, 19, 20}, s(QA[i] + 1.0), None, small=0.4)
L(i, "Lbl sMet", "s-block: metals", (0, -0.6, 2.5), 1.2, 0.34, M["gold"])
# vii: a group (column) vs a period (row)
i = 6
tb = mini(i, 3)
tb.focus({1, 3, 11}, s(QA[i] + 1.0), None, small=0.4)
L(i, "Lbl Grp", "same group ✓", (0, -0.6, 2.4), 1.2, 0.34, M["green"])
# viii: neon, 8 outer electrons
i = 7
flat_atom("Ne28", R[i], MC, [0.9, 1.9], [2, 8], 10, 10, s(QA[i]), fend(i), nuc_r=0.14, e_r=0.12)
hm = empty("Ne28 Hi", MC, R[i], rot=(90 * DEG, 0, 0))
ring_curve("Ne28 Full", 1.9, M["gold"], hm, depth=0.035)
appear(hm, s(QA[i] + 1.0))
L(i, "Lbl Full8", "8 outer e⁻: full, noble gas", (0, -0.6, -2.75), 1.2, 0.32, M["gold"])
# ix: tiles in atomic-number order
i = 8
tb = mini(i, 3, numbers=True)
for z in range(1, 19):
    tb.pulse(z, s(QA[i] + 0.8) + 4 * z, 1.35, 10)
L(i, "Lbl AtNo", "1, 2, 3 … protons", (0, -0.6, 2.4), 1.0, 0.34, M["gold"])
# x: inner electrons shield the outer electron
i = 9
flat_atom("Shield", R[i], MC, [0.7, 1.4, 2.2], [2, 8, 1], 11, 12, s(QA[i]), fend(i), nuc_r=0.14, e_r=0.11)
hs = empty("Shield Hi", MC, R[i], rot=(90 * DEG, 0, 0))
for k, rr in enumerate((0.7, 1.4)):
    ring_curve("Shield Ring %d" % k, rr, M["cyan"], hs, depth=0.04)
appear(hs, s(QA[i] + 1.0))
L(i, "Lbl Inner", "inner electrons = the shield", (0, -0.6, -2.75), 1.2, 0.32, M["cyan"])
hud("Next", "Next: Unit 3 games  →", CAM[9], 0.5, 0.04, 0.034, s(QA[9] + 4.0), None, M["gold"], align='CENTER')

scene["ar_range"] = [s(QA[5]), s(T[6]) - 1]      # AR: the ionization bars of question vi
scene["ar_scale"] = 0.05
finish_film()
