# ---- Film 617: Unit 6 exercise, multiple choice questions (textbook p.179) ----
# Same layout as film 515: card + options, 4 s to think, the answer lights green, then the reason and a small model.
# sh scripts/u6/b6.sh scripts/u6/f617_mcqs.py
DUR, INTRO, HOLD = 16.0, 3.0, 2.4
T = [0] + [INTRO + DUR * (k + 1) for k in range(10)]
start_film("617", "617 Exercise MCQs", T[-1])
s = sec
END = scene.frame_end
PS, R, CAM = stations(T)
NUM = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"]
Q = [
    ("Which of the following solution is more dilute?", ["1.0M", "0.5M", "0.05M", "0.005M"], 3,
     "Fewest moles in each litre: 0.005 M\nis the weakest (most dilute)."),
    ("Milk is an example of:", ["Compound", "Saturated solution", "Colloids", "Suspension"], 2,
     "Milk particles are 1–1000 nm: they scatter\nlight but never settle. A colloid."),
    ("Water droplet in air is an example of solution:", ["Gas in gas", "Gas in liquid", "Colloids", "Liquid in Gas"], 3,
     "Tiny liquid water drops spread in air:\nliquid in gas."),
    ("When there is a low concentration of solute in a\nsolution, it is known as:", ["dilute solution",
     "saturated solution", "concentrated solution", "super saturated solution"], 0,
     "A little solute in a lot of solvent:\na dilute solution."),
    ("What is the molarity of a NaNO₃ solution made by\ndiluting 250.0 cm³ of a 1.60 M solution to a final\nvolume of 400 cm³?",
     ["1.20 M", "1.00 M", "0.200 M", "0.160 M"], 1,
     "M₁V₁ = M₂V₂ → 1.60 × 250 = M₂ × 400\nM₂ = 400 ÷ 400 = 1.00 M"),
    ("What is the concentration, in % mass by volume\n(m/v) of a solution containing 15.0 g KCl in\n600.0 cm³ solution?",
     ["5.00%", "2.00%", "0.200%", "2.50%"], 3,
     "15.0 g ÷ 600.0 cm³ × 100\n= 2.50 %"),
    ("When KCl dissolves in water, the following will be\nproduced:", ["K and Cl", "K⁺ and Cl⁻", "K and Cl₂", "K⁺ and Cl₂"], 1,
     "Water pulls the ionic crystal apart\ninto K⁺ and Cl⁻ ions."),
    ("2 moles of Na₂SO₄ are dissolved in one dm³ of\nsolution. Molarity of solution is:", ["1 M", "2 M", "3 M", "0.5 M"], 1,
     "2 mol ÷ 1 dm³ = 2 M"),
    ("Molarity is the number of moles of solute\ndissolved in:", ["1 kg of solvent", "1 kg of solution", "1 dm³ of solvent",
     "1 dm³ of solution"], 3,
     "Molarity counts moles in one dm³ (litre)\nof the whole solution."),
    ("The molarity of a NaOH solution by dissolving 4 g\nof it in 250 ml water is:", ["0.4 M", "0.8 M", "0.2 M", "0.1 M"], 0,
     "4 g ÷ 40 g = 0.1 mol, 250 mL = 0.25 dm³\n0.1 ÷ 0.25 = 0.4 M"),
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


# i: 1.0 M crowded vs 0.005 M almost empty
i = 0
a, b = tw(i)
for k, (x, nsol, nm, m) in enumerate(((-1.4, 14, "1.0 M", M["white"]), (1.4, 1, "0.005 M ✓", M["green"]))):
    c = W(i, x, -1.8)
    beaker("Q0 %d" % k, c, 1.1, 2.6, 2.1, a)
    lo, hi = inside(c, 1.1, 2.1, depth=0.3)
    gas("Q0 U %d" % k, nsol, lo, hi, a, b, speed=0.8, r=0.13, mat=SOLU, seed=1 + k, f_in=sec(a + 0.3))
    L(i, "Q0 L %d" % k, nm, (x, -0.6, 1.3), 1.0 + 0.6 * k, 0.4, m)
# ii: milk: colloid particles, a beam lights them
i = 1
a, b = tw(i)
c = W(i, 0.4, -1.8)
beaker("Q1", c, 1.4, 2.8, 2.3, a, liq_mat=mat_emit("Colloid Haze", (0.85, 0.85, 0.9), 0.3, alpha=0.22))
rnd = random.Random(2)
for k in range(20):
    o = sphere("Q1 P %d" % k, 0.07, MILK, c + Vector((rnd.uniform(-1.1, 1.1), rnd.uniform(-0.4, 0.4), rnd.uniform(0.2, 2.1))),
               None, 10, 5)
    appear(o, sec(a + 0.3), f1_(i), s=(0.07,) * 3)
beam("Q1 Beam", c + Vector((-1.38, 0, 1.2)), c + Vector((1.38, 0, 1.2)), a + 1.2, T[2] - 0.4, r=0.12)
L(i, "Q1 L", "colloid", (0.4, -0.6, 1.4), 1.6, 0.45, M["gold"])
# iii: liquid drops in air
i = 2
a, b = tw(i)
c = W(i)
appear(box_edges("Q2 Box", (4.0, 1.2, 2.6), c), sec(a), f1_(i), dur=8)
gas("Q2 Air", 12, c - Vector((2, 0.6, 1.3)), c + Vector((2, 0.6, 1.3)), a, b, speed=1.8, r=0.1, mat=MOL["air"], seed=3,
    f_in=sec(a + 0.2))
gas("Q2 Drop", 5, c - Vector((2, 0.6, 1.3)), c + Vector((2, 0.6, 1.3)), a, b, speed=0.6, r=0.24, mat=WATER, seed=4,
    f_in=sec(a + 0.6))
L(i, "Q2 L", "liquid in gas", (0, -0.6, 1.8), 1.2, 0.45, M["gold"])
# iv: dilute: a little solute
i = 3
a, b = tw(i)
c = W(i, 0, -1.8)
beaker("Q3", c, 1.5, 2.8, 2.3, a)
lo, hi = inside(c, 1.5, 2.3)
gas("Q3 V", 14, lo, hi, a, b, speed=0.8, r=0.1, mat=SOLV, seed=5, f_in=sec(a + 0.3))
gas("Q3 U", 3, lo, hi, a, b, speed=0.8, r=0.13, mat=SOLU, seed=6, f_in=sec(a + 0.6))
L(i, "Q3 L", "dilute", (0, -0.6, 1.5), 1.2, 0.45, M["cyan"])
# v: same moles spread from 250 to 400 cm³
i = 4
a, b = tw(i)
c1, c2 = W(i, -1.5, -1.8), W(i, 1.3, -1.8)
appear(box_edges("Q4 S", (1.4, 1.0, 1.6), c1 + Vector((0, 0, 0.8))), sec(a), f1_(i), dur=8)
appear(box_edges("Q4 B", (1.8, 1.0, 2.6), c2 + Vector((0, 0, 1.3))), sec(a + 1.4), f1_(i), dur=8)
gas("Q4 M1", 8, c1 + Vector((-0.6, -0.4, 0.1)), c1 + Vector((0.6, 0.4, 1.5)), a, a + 1.4, speed=0.8, r=0.13, mat=SOLU,
    seed=7, f_in=sec(a + 0.3))
gas("Q4 M2", 8, c2 + Vector((-0.8, -0.4, 0.1)), c2 + Vector((0.8, 0.4, 2.5)), a + 1.4, b, speed=0.8, r=0.13, mat=SOLU,
    seed=8, f_in=sec(a + 1.6))
L(i, "Q4 L1", "250 cm³", (-1.5, -0.6, -2.1), 0.8, 0.36, M["cyan"])
L(i, "Q4 L2", "400 cm³", (1.3, -0.6, -2.1), 1.6, 0.36, M["cyan"])
L(i, "Q4 L3", "1.00 M", (0, -0.6, 1.4), 2.6, 0.5, M["gold"])
# vi: 15.0 g on a balance; a 600 cm³ flask
i = 5
a, b = tw(i)
scale_bal("Q5", W(i, -1.5, -1.6), a, "15.0 g", t1=T[6] - 0.4)
flask("Q5", W(i, 1.4, -1.9), R=0.9, neck=1.3, t_in=a + 0.6, fill=WATER)
L(i, "Q5 L", "2.50 %", (0, -0.6, 1.6), 1.6, 0.5, M["gold"])
# vii: KCl → K⁺ and Cl⁻
i = 6
a, b = tw(i)
c = W(i)
for k, (m, sgn, nm) in enumerate(((ION_P, -1, "K⁺"), (ION_N, 1, "Cl⁻"))):
    rr = 0.38 if k else 0.32
    o = sphere("Q6 Ion %d" % k, rr, m, c + Vector((0.35 * sgn, -0.2, 0)), None, 24, 12)
    appear(o, sec(a + 0.2), f1_(i), s=(rr,) * 3)
    move(o, sec(a + 1.0), sec(a + 2.4), c + Vector((0.35 * sgn, -0.2, 0)), c + Vector((1.5 * sgn, -0.2, 0)))
    L(i, "Q6 L %d" % k, nm, (1.5 * sgn, -0.6, 0.8), 2.4, 0.5, m)
for k in range(4):
    water("Q6 W %d" % k, c + Vector((-2.3 + 1.5 * k, 0.4, -1.3)), a + 0.6, scale=0.45)
# viii: 2 marbles in a 1 dm³ cube
i = 7
a, b = tw(i)
c = W(i, 0, -1.6)
appear(box_edges("Q7 Cube", (2.6, 2.6, 2.6), c + Vector((0, 0, 1.3))), sec(a), f1_(i), dur=8)
for k in range(2):
    o = sphere("Q7 Mol %d" % k, 0.36, SOLU, c + Vector((-0.5 + 1.0 * k, -0.4, 1.3)), None, 24, 12)
    appear(o, sec(a + 0.6 + 0.4 * k), f1_(i), s=(0.36,) * 3)
L(i, "Q7 L", "2 mol in 1 dm³ = 2 M", (0, -0.6, 1.5), 1.6, 0.42, M["gold"])
# ix: 1 dm³ of solution (solute + solvent together)
i = 8
a, b = tw(i)
c = W(i, 0, -1.6)
appear(box_edges("Q8 Cube", (2.6, 2.6, 2.6), c + Vector((0, 0, 1.3))), sec(a), f1_(i), dur=8)
appear(box("Q8 Fill", (2.55, 2.55, 2.55), mat_emit("Cube Fill U6", (0.15, 0.4, 0.9), 0.4, alpha=0.18),
           c + Vector((0, 0, 1.3))), sec(a + 0.2), f1_(i), dur=8)
gas("Q8 U", 6, c + Vector((-1.1, -0.4, 0.2)), c + Vector((1.1, 0.4, 2.4)), a, b, speed=0.8, r=0.14, mat=SOLU, seed=9,
    f_in=sec(a + 0.4))
L(i, "Q8 L", "1 dm³ of solution", (0, -0.6, 1.5), 1.2, 0.42, M["gold"])
# x: 0.1 mol in a quarter litre
i = 9
a, b = tw(i)
c = W(i, 0, -1.6)
appear(box_edges("Q9 Cube", (2.6, 2.6, 2.6), c + Vector((0, 0, 1.3)), mat=M["dim"]), sec(a), dur=8)
appear(box("Q9 Fill", (2.55, 2.55, 0.65), mat_emit("Cube Fill U6", (0.15, 0.4, 0.9), 0.4, alpha=0.18),
           c + Vector((0, 0, 0.33))), sec(a + 0.4), dur=8)
o = sphere("Q9 Mol", 0.2, SOLU, c + Vector((0, -0.6, 2.0)), None, 20, 10)
appear(o, sec(a + 0.8), s=(0.2,) * 3)
move(o, sec(a + 1.6), sec(a + 2.4), c + Vector((0, -0.6, 2.0)), c + Vector((0, -0.6, 0.33)))
L(i, "Q9 L1", "0.1 mol", (2.1, -0.6, -1.3), 1.2, 0.36, M["gold"])
L(i, "Q9 L2", "0.25 dm³", (-2.2, -0.6, -1.3), 1.6, 0.36, M["cyan"])
L(i, "Q9 L3", "× 4 → 0.4 M", (0, -0.6, 1.5), 3.0, 0.45, M["gold"])

scene["ar_range"] = [s(QA[7]), s(T[8]) - 1]      # AR: the litre cube with 2 moles
scene["ar_scale"] = 0.05
for i, txt in enumerate(['Fewest moles: 0.005 M', 'Milk is a colloid', 'Water drops in air: liquid in gas', 'Little solute: dilute', '1.60 × 250 = M₂ × 400: 1.00 M', '15.0 ÷ 600.0 × 100 = 2.50 %', 'Water pulls out K⁺ and Cl⁻', '2 mol in 1 dm³: 2 M', 'Moles in 1 dm³ of solution', '0.1 mol ÷ 0.25 dm³ = 0.4 M']):
    say("Why %02d" % i, txt, MA[i], None if i == 9 else T[i + 1])
finish_film()
