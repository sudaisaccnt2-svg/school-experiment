# ---- Film 12: Exercise, multiple choice questions (textbook pp.60-61) ----
# v4: each question: card + options, 4 s to think, the answer lights green; then the card goes and the model fills the
# screen, showing WHY, with one short caption line (no reason paragraph, no "Next" card).
# bsend.py common.py p2/lib.py u3/u3lib.py v4lib.py p2/f12_mcqs.py      (old v2: backups/f12_mcqs_v2.py)
DUR, INTRO, HOLD = 16.0, 3.0, 2.4
T = [0] + [INTRO + DUR * (k + 1) for k in range(10)]
start_film("12", "12 Exercise MCQs", T[-1])
s = sec
END = scene.frame_end
P, R, CAM = stations(T)
NUM = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"]
Q = [
    ("The maximum number of electrons in third energy level is:", ["10", "18", "32", "64"], 1,
     "Shell number n holds 2 × n × n electrons.\nThe third shell (M): 2 × 3 × 3 = 18."),
    ("Mass of an atom is mostly due to its", ["nucleus", "neutrons", "electrons", "protons"], 0,
     "Protons and neutrons are heavy, and both are in the nucleus.\nElectrons are very light."),
    ("If Rutherford had used neutrons instead of alpha particles in his\nscattering experiment, the neutrons would",
     ["not deflect because they have no charge", "have deflected more often",
      "have been attracted to the nucleus easily", "have given the same results"], 0,
     "Neutrons have no charge, so the nucleus does not repel them:\nthey pass straight through without being deflected."),
    ("Electron in its ground state does not", ["spin", "revolve", "radiate energy", "reside in orbit"], 2,
     "In the ground state the electron stays in a fixed orbit with\nfixed energy, so it does not radiate energy."),
    (None, ["they are isotopes", "they are the same elements", "they have the same number of electrons",
            "they have the same number of neutrons"], 3,
     "Both have 6 protons and 6 electrons (isotopes of one element),\nbut X has 12 − 6 = 6 neutrons and Y has 14 − 6 = 8."),
    ("The neutron particle", ["has a mass equal to that of a electron",
                              "has a mass approximately equal to that of a proton",
                              "has charge equal to but opposite to that of an electron", "has a positive charge"], 1,
     "A neutron has no charge, and its mass is\napproximately equal to the mass of a proton."),
    ("Isotopes of the same element have", ["the same number of protons", "the same number of neutrons",
                                           "different number of electrons", "the same mass number"], 0,
     "Isotopes have the same number of protons (same atomic\nnumber) but different numbers of neutrons."),
    ("Which one is the lightest?", ["an alpha particle", "a hydrogen atom", "an electron", "a proton"], 2,
     "An electron is 1837 times lighter than a proton. The alpha\nparticle, hydrogen atom and proton are much heavier."),
    ("The nucleus of an atom has all of the following characteristics\nexcept that it",
     ["is positively charged", "is very dense", "contains nearly all of the atom's mass",
      "contains nearly all of the atom's volume"], 3,
     "The nucleus is positive, very dense and holds nearly all the\nmass, but it is tiny: an atom is mostly empty space."),
    ("L-shell has sub-shell(s)", ["s", "s and p", "s, p and d", "s, p, d and f"], 1,
     "The L shell (n = 2) has two sub-shells: s and p.\n(K has only s; M has s, p and d.)"),
]
FILL = mat_emit("Answer Fill", (0.2, 0.9, 0.4), 0.5, alpha=0.22)
hud("Choose", "Choose the correct option.", CAM[0], 0.5, 0.5, 0.06, s(0.3), s(2.8), M["white"], align='CENTER',
    weight="semibold")
Q0, QA, MA = [], [], []              # question start / answer time / model time (s)
MC = Vector((6.0, 0, 0.2))           # model centre (right of the card, seen by its own close camera)
for i, (qt, opts, ans, why) in enumerate(Q):
    q0 = T[i] + (INTRO if i == 0 else 0.0)
    qa = q0 + 7.2
    Q0.append(q0), QA.append(qa), MA.append(qa + HOLD)
    f1 = s(qa + HOLD)
    act("MCQ %s" % NUM[i], s(q0))
    cam = CAM[i]
    def qv(g, y, sz):
        child_text("Q%d a" % i, "v. Which statement about", g, 0.0, y - 0.5 * sz, sz, M["white"], weight="semibold")
        y2 = y - 1.9 * sz
        nuclide("Q%d X" % i, "X", 12, 6, g, 0.7 * sz, y2, sz)
        child_text("Q%d b" % i, "and", g, 1.65 * sz, y2, sz, M["white"], weight="semibold")
        nuclide("Q%d Y" % i, "Y", 14, 6, g, 4.2 * sz, y2, sz)
        child_text("Q%d c" % i, "is false?", g, 5.1 * sz, y2, sz, M["white"], weight="semibold")
    mcq_card(i, cam, NUM[i], qt, opts, ans, why, q0, qa, f1, FILL, qdraw=qv)
    for n in range(4):                 # 4 s to think
        hud("Count %d %d" % (i, n), str(4 - n), cam, 0.8, 0.5, 0.14, s(q0 + 3.0 + n), s(q0 + 3.9 + n),
            M["dim"] if n < 3 else M["gold"], align='CENTER', weight="semibold")
    for ob in [o for o in bpy.data.objects if o.name.startswith(N("Why %d" % i))]:
        bpy.data.objects.remove(ob, do_unlink=True)          # the reason is shown by the model instead
    shot("Cam %d Model" % i, qa + HOLD, None if i == 9 else T[i + 1], P[i] + MC + Vector((0, 0, -0.7)), dist=14,
         drift=0.2)



def L(i, name, body, off, t=0.6, size=0.28, mat=None, anchor=None, align='CENTER'):
    f1 = None if i == 9 else s(T[i + 1] - 0.4)
    return label(name, body, P[i] + MC + Vector(off), size * 1.35, s(MA[i] + t), f1, mat=mat or M["white"], align=align,
                 anchor=anchor and P[i] + MC + Vector(anchor))


def fend(i):
    return END if i == 9 else s(T[i + 1])


# i: shells K, L, M hold 2, 8, 18
i = 0
flat_atom("A18", R[i], MC, [0.8, 1.5, 2.3], [2, 8, 18], 18, 22, s(MA[i]), fend(i), nuc_r=0.12, e_r=0.1)
hm = empty("A18 Hi", MC, R[i], rot=(90 * DEG, 0, 0))
ring_curve("A18 M Ring", 2.3, M["gold"], hm, depth=0.035)
appear(hm, s(MA[i] + 1.0))

# ii: nearly all the mass is in the nucleus
i = 1
flat_atom("Mass", R[i], MC, [2.3], [2], 6, 6, s(MA[i]), fend(i), nuc_r=0.3, e_r=0.09, ring_mat=M["orbit_dim"])
L(i, "Lbl MassE", "electrons: very light", (0, -0.6, 2.3), 1.2, 0.28, M["cyan"])

# iii: neutrons fly straight past gold nuclei
i = 2
GOLD = gloss("Gold Nucleus", (1.0, 0.72, 0.28), rough=0.25)
for k, z in enumerate((-1.5, 0.0, 1.5)):
    appear(dot("Au %d" % k, 0.3, GOLD, R[i], MC + Vector((0, 0, z))), s(MA[i]), dur=8, s=(0.3,) * 3)
for rep in range(2):
    for k, z in enumerate((-2.1, -1.2, -0.45, 0.25, 0.9, 1.7, 2.3)):
        n = dot("Neutron %d %d" % (rep, k), 0.12, M["neutron"], R[i])
        f = s(MA[i] + 0.4 + 2.2 * rep) + 5 * k
        a, b = MC + Vector((-3.0, 0, z)), MC + Vector((3.0, 0, z))
        appear(n, f, f + 50, dur=4, s=(0.12,) * 3)
        move(n, f, f + 50, a, b, 'LINEAR')
L(i, "Lbl Au", "gold nuclei (+)", (0, -0.6, -2.05), 0.6, 0.28, M["gold"])
L(i, "Lbl Neut", "neutrons (no charge) go straight", (0, -0.6, 2.3), 1.2, 0.28, M["white"])

# iv: fixed orbit, fixed energy: no radiation
i = 3
flat_atom("Ground", R[i], MC, [1.5], [1], 1, 0, s(MA[i]), fend(i), nuc_r=0.3, e_r=0.14)
sq = squiggle("No Wave", M["red"], length=1.6, waves=4, amp=0.14, r=0.025, parent=R[i])
sq.location, sq.rotation_euler = MC + Vector((1.2, -0.2, 1.1)), (0, -35 * DEG, 0)
appear(sq, s(MA[i] + 1.0))
L(i, "Lbl NoE", "✗ no energy radiated", (1.8, -0.6, 2.4), 1.2, 0.28, M["red"])

# v: X-12 and Y-14: same protons, different neutrons
i = 4
for k, (nn, A, el) in enumerate(((6, 12, "X"), (8, 14, "Y"))):
    c = MC + Vector(((k - 0.5) * 3.4, 0, 0.7))
    appear(nucleus_mesh("Iso5 %s" % el, 6, nn, R[i], loc=c, r=0.24, seed=40 + k), s(MA[i]), dur=10)
    nsym("Iso5 %s" % el, el, A, 6, P[i] + c + Vector((0, -0.6, -1.3)), MA[i] + 0.4, s(T[i + 1] - 0.4), size=0.5)
    L(i, "Lbl Iso5 %s" % el, "6 p⁺   %d n⁰" % nn, ((k - 0.5) * 3.4, -0.6, -1.65), 0.8, 0.3,
      M["gold"] if k else M["white"])

# vi: neutron ≈ proton on a balance
i = 5
cyl("Pivot", 0.45, 0.0, 0.9, M["line"], MC + Vector((0, 0, -1.9)), R[i], base=True, segs=3)
beam = empty("Beam", MC + Vector((0, 0, -0.95)), R[i])
box("Beam Bar", (4.4, 0.25, 0.1), M["line"], (0, 0, 0), beam)
for k, (x, mat) in enumerate(((-1.9, M["proton"]), (1.9, M["neutron"]))):
    sphere("Bal %d" % k, 0.5, mat, (x, 0, 0.55), beam)
for k, a in enumerate((9, -6, 3, 0)):
    kf(beam, "rotation_euler", s(MA[i]) + 10 * k, (0, a * DEG, 0), 'BEZIER')
appear(beam, s(MA[i]), dur=8)
L(i, "Lbl BalP", "proton (+)", (-1.9, -0.6, 1.0), 0.6, 0.28, M["red"])
L(i, "Lbl BalN", "neutron (no charge)", (1.9, -0.6, 1.0), 0.6, 0.28, M["dim"])
L(i, "Lbl BalEq", "mass ≈ the same", (0, -0.6, 2.1), 1.4, 0.32, M["gold"])

# vii: hydrogen isotopes: same protons
i = 6
for k in range(3):
    c = MC + Vector(((k - 1) * 2.2, 0, 0.5))
    appear(nucleus_mesh("Iso7 %d" % k, 1, k, R[i], loc=c, r=0.3, seed=50 + k), s(MA[i] + 0.2 * k), dur=10)
    pulses("Iso7 Pulse %d" % k, c + Vector((0, -0.4, 0)), R[i], (MA[i] + 1.0 + 0.7 * k,), r=0.7, mat=M["red"])   # one nucleus at a time
    L(i, "Lbl Iso7 %d" % k, "1 p⁺  %d n⁰" % k, ((k - 1) * 2.2, -0.6, -0.75), 0.6 + 0.2 * k, 0.26)
L(i, "Lbl Iso7", "same protons ✓", (0, -0.6, 1.9), 1.0, 0.32, M["green"])
L(i, "Lbl Iso7b", "neutrons differ", (0, -0.6, -1.6), 1.6, 0.28, M["dim"])

# viii: mass bars (proton = 1)
i = 7
for k, (nm, h, txt) in enumerate((("α", 3.2, "4"), ("H atom", 0.8, "1"), ("proton", 0.8, "1"),
                                  ("electron", 0.02, "1/1837"))):
    x = (k - 1.5) * 1.6
    base = empty("Bar %d" % k, MC + Vector((x, 0, -1.3)), R[i])
    box("Bar %d Box" % k, (0.8, 0.5, h), M["green"] if k == 3 else M["panel_edge"], (0, 0, h / 2), base)
    kf(base, "scale", 0, (0, 0, 0), 'CONSTANT')
    kf(base, "scale", s(MA[i]), (1, 1, 0.01), 'BEZIER')
    kf(base, "scale", s(MA[i]) + 15 + 4 * k, (1, 1, 1), 'BEZIER')
    L(i, "Lbl Bar %d" % k, nm, (x, -0.6, -1.7), 0.2 + 0.15 * k, 0.26, M["green"] if k == 3 else M["white"])
    L(i, "Lbl BarV %d" % k, txt, (x, -0.6, -1.0 + h), 0.8 + 0.15 * k, 0.26, M["gold"])
L(i, "Lbl Lightest", "lightest!", (2.4, -0.6, -0.6), 1.6, 0.32, M["green"])
L(i, "Lbl Units", "mass (proton = 1)", (0, -0.6, 2.35), 0.6, 0.26, M["dim"])

# ix: tiny nucleus, huge empty atom
i = 8
appear(blob("Atom Volume", (2.3, 2.3, 2.3), mat_emit("Atom Volume", (0.35, 0.55, 0.9), 0.3, alpha=0.12), MC,
            R[i]), s(MA[i]), dur=12)
appear(dot("Tiny Nucleus", 0.1, M["proton"], R[i], MC), s(MA[i]), dur=8, s=(0.1,) * 3)
for k in range(6):
    a = k * 60 * DEG
    appear(electron("Cloud e%d" % k, R[i], MC + Vector((2.0 * math.cos(a), -0.2, 2.0 * math.sin(a))), 0.09),
           s(MA[i] + 0.2), dur=8, s=(0.09,) * 3)
L(i, "Lbl Tiny", "nucleus: tiny", (2.2, -0.6, 2.2), 0.8, 0.28, M["red"], anchor=(0.15, -0.6, 0.15))

# x: L shell = s and p
i = 9
COL = {"s": (0.30, 0.62, 1.0), "p": (0.30, 1.0, 0.55)}
SM = {k: mat_emit("Sub %s" % k, c, 3.0) for k, c in COL.items()}
g = empty("LShell", MC, R[i], rot=(90 * DEG, 0, 0))
nucleus_mesh("LShell Nucleus", 6, 6, g, r=0.13, seed=60)
ring_curve("LShell K", 0.75, SM["s"], g, depth=0.02)
whole = ring_curve("LShell L", 1.8, M["orbit"], g, depth=0.03)
appear(g, s(MA[i]), dur=10)
appear(whole, s(MA[i]), s(MA[i] + 1.4))
for k, (l, rad) in enumerate((("s", 1.5), ("p", 2.15))):
    appear(ring_curve("LShell 2%s" % l, rad, SM[l], g, depth=0.022), s(MA[i] + 1.5 + 0.4 * k), dur=10)
    L(i, "Lbl 2%s" % l, "2%s" % l, (rad + 0.2, -0.6, 0.0), 1.8 + 0.4 * k, 0.34, SM[l], align='LEFT')
L(i, "Lbl 1s", "1s", (0.0, -0.6, 0.95), 0.6, 0.26, SM["s"])

for i, txt in enumerate(("M shell: 2 × 3² = 18", "Protons and neutrons: in the nucleus",
                        "No charge, so no deflection", "Fixed orbit: no energy radiated", "X: 6 neutrons, Y: 8",
                        "Neutron mass ≈ proton mass", "Isotopes: same protons", "Electron: 1837 times lighter",
                        "Tiny nucleus: atom mostly empty", "L shell: s and p")):
    say("Why %02d" % i, txt, MA[i], None if i == 9 else T[i + 1])
scene["ar_range"] = [s(MA[7]), s(T[8]) - 1]      # AR: the mass bars of question viii
scene["ar_scale"] = 0.05
finish_film()
