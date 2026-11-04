# ---- Film 708: Electrochemical cells and electrolytes (textbook pp.191-193: 7.5 electrochemical cell = electrical ↔  (v4 captions)
# chemical energy, two types (electrolytic, voltaic/galvanic); 7.5.1 electrolyte ionizes and conducts (NaCl → Na⁺ + Cl⁻);
# strong / weak / non-electrolytes, Fig 7.3 bulbs; electrodes: anode + (anions gather, leave electrons), cathode −
# (cations gather, gain electrons); gold and silver conduct best, wires are copper and aluminium) ----
start_film("708", "708 Electrolytes", 76.5)
END = scene.frame_end
SA, SB, SC, SD = (Vector((40 * k, 0, 0)) for k in range(4))

shot("Cam Types", 0, 14, SA + Vector((0, 0, -1.1)), dist=15, pitch=0.1)
shot("Cam Ions", 14, 28, SB + Vector((0, 0, -1.1)), dist=12, pitch=0.1)
shot("Cam Bulbs", 28, 52, SC + Vector((0, 0, -1.1)), dist=16, pitch=0.1)
shot("Cam Electrodes", 52, None, SD + Vector((0, 0, -1.1)), dist=14, pitch=0.1)
for name, t in (("Two kinds of cell", 0), ("Electrolyte", 14), ("Strong, weak, none", 28), ("Electrodes", 52)):
    act(name, sec(t))

say('A1', 'Electricity ↔ chemical energy', 0.1, 7)
say('A2', 'Electrolytic and voltaic cells', 7, 14)
say('B1', 'Salt splits into ions', 14, 21)
say('B2', 'Moving ions carry current', 21, 28)
say('C1', 'Sugar: no ions, dark bulb', 28, 35)
say('C2', 'Acetic acid: dim glow', 35, 42)
say('C3', 'Salt: bright bulb', 42, 52)
say('D1', 'Electrodes: where electrons pass', 52, 60)
say('D2', 'Anions → anode · cations → cathode', 60, 76)

# ---- A. electrolytic (battery on top) and voltaic (bulb on top) ----
a0 = SA + Vector((0, 0, -2.4))
cA = cell("A1", a0 + Vector((-2.6, 0, 0)), 0.4, w=3.2, h=2.0, gap=0.9)
cB = cell("A2", a0 + Vector((2.6, 0, 0)), 1.0, w=3.2, h=2.0, gap=0.9, top="bulb", level=0.8, pa=ZINC, pc=COPPER)
flow("A1 e", cA["up_r"][::-1], 2.0, 14.0, n=3, speed=1.2)
flow("A2 e", cB["up_l"], 2.0, 14.0, n=3, speed=1.2)
big("Lbl A1", "electrolytic", a0 + Vector((-2.6, -1.0, 2.35)), 7.3, None, mat=M["white"], size=0.42)
big("Lbl A2", "voltaic", a0 + Vector((2.6, -1.0, 2.35)), 7.8, None, mat=M["white"], size=0.42)

# ---- B. a salt crystal in water comes apart into moving ions ----
b0 = SB + Vector((0, 0, -2.4))
tank("B", b0, 4.4, 2.6, 2.2, 14.3)
pts = grid_pts(3, 3, 0.42, b0 + Vector((0, -0.1, 1.0)))
for k, p in enumerate(pts):
    ion("B X%d" % k, CAT if k % 2 == 0 else ANI, p, 14.8 + 0.05 * k, 18.0, r=0.19)
lo, hi = b0 + Vector((-2.0, -0.5, 0.1)), b0 + Vector((2.0, 0.3, 2.1))
gas("B Na", 5, lo, hi, 18.0, 28.0, speed=0.9, r=0.19, mat=CAT, pos=pts[0::2], f_in=sec(18.0), seed=3)
gas("B Cl", 4, lo, hi, 18.0, 28.0, speed=0.9, r=0.19, mat=ANI, pos=pts[1::2], f_in=sec(18.0), seed=4)
big("Lbl B 1", "Na⁺", b0 + Vector((-1.3, -1.0, 3.0)), 21.5, None, mat=M["orange"] if "orange" in M else M["gold"], size=0.5)
big("Lbl B 2", "Cl⁻", b0 + Vector((1.3, -1.0, 3.0)), 22.0, None, mat=M["green"] if "green" in M else M["white"], size=0.5)

# ---- C. three cells: none, weak, strong ----
c0 = SC + Vector((0, 0, -2.4))
specs = ((-3.6, 0.0, 28.3, "none"), (0.0, 0.25, 35.3, "weak"), (3.6, 1.0, 42.3, "strong"))
for k, (x, lev, t, word) in enumerate(specs):
    cc = c0 + Vector((x, 0, 0))
    cell("C%d" % k, cc, t, w=3.0, h=2.0, gap=0.9, top="bulb", level=lev)
    lo, hi = cc + Vector((-0.55, -0.4, 0.15)), cc + Vector((0.55, 0.3, 1.5))
    if k == 0:
        gas("C%d Sugar" % k, 6, lo, hi, t, END / FPS, speed=0.4, r=0.17, mat=MOL["white"], f_in=sec(t + 0.5), seed=5)
    elif k == 1:
        gas("C%d Mol" % k, 5, lo, hi, t, END / FPS, speed=0.4, r=0.17, mat=MOL["white"], f_in=sec(t + 0.5), seed=6)
        gas("C%d P" % k, 1, lo, hi, t, END / FPS, speed=0.7, r=0.15, mat=CAT, f_in=sec(t + 0.5), seed=7)
        gas("C%d N" % k, 1, lo, hi, t, END / FPS, speed=0.7, r=0.15, mat=ANI, f_in=sec(t + 0.5), seed=8)
    else:
        gas("C%d P" % k, 5, lo, hi, t, END / FPS, speed=0.8, r=0.15, mat=CAT, f_in=sec(t + 0.5), seed=9)
        gas("C%d N" % k, 5, lo, hi, t, END / FPS, speed=0.8, r=0.15, mat=ANI, f_in=sec(t + 0.5), seed=10)
    big("Lbl C%d" % k, word, cc + Vector((0, -1.0, 2.35)), t + 1.0, None, mat=M["white"], size=0.4)

# ---- D. ions walk to the electrodes; electrons run in the wires ----
d0 = SD + Vector((0, 0, -2.4))
cD = cell("D", d0, 52.3, w=4.4, h=2.4, gap=1.5)
flow("D e R", cD["up_r"][::-1], 60.0, 76.0, n=4, speed=1.0)
flow("D e L", cD["up_l"], 60.0, 76.0, n=4, speed=1.0)
for k in range(3):
    z = 0.6 + 0.6 * k
    a = ion("D An%d" % k, ANI, d0 + Vector((0.6 - 0.3 * k, -0.2, z)), 53.5, r=0.2)
    move(a, sec(60.5 + 0.6 * k), sec(64.5 + 0.6 * k), d0 + Vector((0.6 - 0.3 * k, -0.2, z)),
         d0 + Vector((-1.15, -0.2, z)))
    cat = ion("D Ca%d" % k, CAT, d0 + Vector((-0.5 + 0.3 * k, -0.2, z + 0.3)), 53.7, r=0.2)
    move(cat, sec(60.8 + 0.6 * k), sec(64.8 + 0.6 * k), d0 + Vector((-0.5 + 0.3 * k, -0.2, z + 0.3)),
         d0 + Vector((1.15, -0.2, z + 0.3)))
big("Lbl D A", "anode +", d0 + Vector((-0.8, -1.0, 2.85)), 61.0, None, mat=M["red"], size=0.45)
big("Lbl D C", "cathode −", d0 + Vector((0.8, -1.0, 2.85)), 61.6, None, mat=M["cyan"], size=0.45)
finish_film()
