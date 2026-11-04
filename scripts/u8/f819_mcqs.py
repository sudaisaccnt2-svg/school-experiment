# ---- Film 819: Unit 8 exercise, multiple choice questions (textbook pp.246-247) ----
# Same layout as films 515 / 617: card + options, 4 s to think, the answer lights green, then the reason and a small model.
# python scripts/v4_batch.py u8 819  (v4: card → answer → the card leaves → a model + one why line)
DUR, INTRO, HOLD = 16.0, 3.0, 2.4
T = [0] + [INTRO + DUR * (k + 1) for k in range(10)]
start_film("819", "819 Exercise MCQs", T[-1])
s = sec
END = scene.frame_end
PS, R, CAM = stations(T)
NUM = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"]
Q = [
    ("Bromine is a non-metal in:", ["Solid state", "Liquid state", "Gaseous state", "Plasma state"], 1, ""),
    ("Halogens react with metals to form:", ["Halides", "Oxides", "Halogen sulphides", "Hydrogenated compounds"], 0, ""),
    ("Alkali metals are:", ["Oxidising agents", "Dehydrating agents", "Reducing agents", "All the above"], 2, ""),
    ("Among the alkali metals, the metal with the highest ionization potential is:", ["Na", "Li", "Rb", "Cs"], 1, ""),
    ("The halogen present in the solid form is:", ["Chlorine", "Fluorine", "Iodine", "Bromine"], 2, ""),
    ("Tendency of a metal to lose electron is called:", ["Electronegativity", "Electropositivity", "Electroplating",
     "Electrolysis"], 1, ""),
    ("The word Alkali means:", ["Base", "Basic salt", "Acid", "Ashes"], 3, ""),
    ("The oxide of calcium CaO is:", ["Acidic", "Basic", "Amphoteric", "Neutral"], 1, ""),
    ("Which one of the following is not an alkali metal:", ["Francium", "Cesium", "Rubidium", "Radium"], 3, ""),
    ("Group IIA elements are named as Alkaline Earth Metals because:", ["Their oxides are basic",
     "Their oxide and hydroxides are water soluble", "They are found in earth", "All of these"], 3, ""),
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


# ---- the models (each starts when its card has left) ----
i = 0      # bromine: liquid and vapour in a jar
a = QA[i]
jb = jar("Q0 Jar", 0.8, 2.4, W(i, 0, -2.0), top=True)
appear(jb, s(a + 0.2), f1_(i))
lq = liquid("Q0 Liq", 0.77, 0.6, W(i, 0, -1.99), mat=mat_emit("Bromine Liq U8", (0.55, 0.12, 0.04), 1.2, alpha=0.9))
appear(lq, s(a + 0.4), f1_(i))
vp = liquid("Q0 Vap", 0.77, 1.75, W(i, 0, -1.37), mat=JAR["Br"])
appear(vp, s(a + 0.6), f1_(i))
big("Q0 L", "Br₂ liquid", W(i, 0, 1.0) + Vector((0, -0.9, 0)), a + 1.0, t1_(i), mat=M["gold"], size=0.5)

i = 1      # sodium burns in chlorine → a white halide
a = QA[i]
jar_of("Q1", W(i, 0, -2.0), "Cl", a + 0.2, r=0.9, h=2.5, t1=t1_(i))
nb = lump("Q1 Na", W(i, 0, -1.2) + Vector((0, -0.1, 0)), 0.35, NA_M, a + 0.4)
cflame("Q1 Fire", W(i, 0, -1.0) + Vector((0, -0.2, 0)), (1.0, 0.9, 0.6), a + 1.0, a + 3.5, s=0.7)
dissolve_out(nb, a + 2.4, 1.0)
lump("Q1 Salt", W(i, 0, -1.5) + Vector((0, -0.1, 0)), 0.5, SALT_W, a + 3.2, t1_(i), seed=4)
big("Q1 L", "NaCl: a halide", W(i, 0, 1.0) + Vector((0, -0.9, 0)), a + 3.6, t1_(i), mat=M["gold"], size=0.5)

i = 2      # sodium hands its electron away
a = QA[i]
lose("Q2", 11, W(i, -0.6, -0.6), a + 0.2, a + 1.4, "+", t1=t1_(i))

i = 3      # Table 8.2 bars: lithium highest
a = QA[i]
bars("Q3", W(i, -2.6, -2.0), [("Li", 520, "520"), ("Na", 496, "496"), ("K", 419, "419"), ("Rb", 403, "403"),
                              ("Cs", 376, "376")], a + 0.2, k=0.0055, step=0.25, t1=t1_(i))

i = 4      # chlorine gas, bromine liquid, iodine solid
a = QA[i]
for k, (sy, txt) in enumerate((("Cl", "gas"), ("Br", "liquid"), ("I", "solid"))):
    c = W(i, -2.6 + 2.6 * k, -2.0)
    jar_of("Q4 %s" % sy, c, sy, a + 0.2 + 0.3 * k, r=0.7, h=2.2, t1=t1_(i), fill=1.0 if k == 0 else 0.25)
    big("Q4 L%d" % k, "%s₂ %s" % (sy, txt), c + Vector((0, -0.9, 2.7)), a + 0.6 + 0.3 * k, t1_(i),
        mat=M["gold"] if k == 2 else M["white"], size=0.42)

i = 5      # calcium loses two electrons: electropositive
a = QA[i]
lose("Q5", 20, W(i, -0.6, -0.6), a + 0.2, a + 1.2, "2+", t1=t1_(i), scale=0.72)

i = 6      # plant ashes
a = QA[i]
ash = cyl("Q6 Ash", 1.3, 0.2, 0.9, mat_pbr("Ash U8", (0.35, 0.34, 0.33), roughness=0.95), W(i, 0, -1.6), None, base=True, segs=24)
appear(ash, s(a + 0.2), f1_(i), dur=12)
big("Q6 L", "al-qali: the ashes", W(i, 0, 0.3) + Vector((0, -0.9, 0)), a + 1.0, t1_(i), mat=M["gold"], size=0.5)

i = 7      # CaO in water turns red litmus blue
a = QA[i]
beaker("Q7", W(i, -0.8, -2.0), 1.0, 2.0, 1.4, a + 0.2)
for o in [ob for ob in bpy.data.objects if ob.name.startswith(N("Q7 Beaker")) or ob.name == N("Q7 Liquid")]:
    pop_out(o, f1_(i), 6, tuple(o.scale))
la, lb = litmus("Q7", W(i, 0.7, -0.6), a + 0.6, "red", "blue", a + 2.0, t1_(i))
big("Q7 L", "basic", W(i, 0, 1.0) + Vector((0, -0.9, 0)), a + 2.4, t1_(i), mat=M["cyan"], size=0.55)

i = 8      # group IA column vs radium in group IIA
a = QA[i]
for k, sy in enumerate(("Li", "Na", "K", "Rb", "Cs", "Fr")):
    tile("Q8 %s" % sy, sy, W(i, -1.0, 1.7 - 0.85 * k), "metal", a + 0.2 + 0.1 * k, t1_(i), size=0.45)
tile("Q8 Ra", "Ra", W(i, 1.2, 1.7 - 0.85 * 5), "metalloid", a + 1.2, t1_(i), size=0.45)
big("Q8 L", "IIA", W(i, 1.2, 1.7 - 0.85 * 4) + Vector((0, -0.6, 0)), a + 1.6, t1_(i), mat=M["gold"], size=0.45)

i = 9      # basic oxide, soluble, in the earth
a = QA[i]
la, lb = litmus("Q9", W(i, -2.6, -0.6), a + 0.2, "red", "blue", a + 1.0, t1_(i))
beaker("Q9", W(i, 0, -2.0), 0.8, 1.8, 1.2, a + 0.6)
earth = sphere("Q9 Earth", 0.9, gloss("Earth U8", (0.15, 0.45, 0.25), 0.4), W(i, 2.6, -0.6), None, 32, 16)
appear(earth, s(a + 1.0), None, s=(0.9,) * 3)
big("Q9 L", "all three", W(i, 0, 1.0) + Vector((0, -0.9, 0)), a + 2.0, None, mat=M["gold"], size=0.5)

for i, txt in enumerate(['Bromine: the one liquid non-metal', 'Metal + halogen → halide', 'They give electrons away',
                         'Lithium: smallest, hardest to ionize', 'Iodine is the solid halogen', 'Losing electrons: electropositivity',
                         "Alkali: Arabic for 'the ashes'", 'CaO + water: a base', 'Radium is in group IIA',
                         'Basic, soluble and in the earth']):
    say("Why %02d" % i, txt, MA[i], None if i == 9 else T[i + 1])
scene["ar_range"] = [s(QA[3]), s(T[4]) - 1]
finish_film()
