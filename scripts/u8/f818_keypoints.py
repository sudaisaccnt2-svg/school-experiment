# ---- Film 818: Key points (textbook p.245), one short station per point, each with its small picture (v4) ----
D = 5.0
SHORT = ["IA, IIA, d-block: all metals", "Metals are electropositive", "Non-metals are electronegative",
         "IA alkali · IIA alkaline earth", "Alkali metals give electrons easily", "Alkali metals: only in compounds",
         "Group VIIA: the halogens", "Halogens grab electrons", "Halogens: only in compounds", "Sodium soft, iron hard",
         "Noble metals resist rust", "Silver, platinum, gold: precious"]
n = len(SHORT)
start_film("818", "818 Key Points", D * n + 0.5)
END = scene.frame_end
ST = [Vector((40 * k, 0, 0)) for k in range(n)]
for k in range(n):
    shot("Cam KP %d" % k, D * k, None if k == n - 1 else D * (k + 1), ST[k] + Vector((0, 0, -0.6)), dist=11, pitch=0.06)
    act(SHORT[k], sec(D * k))
    say("K%d" % k, SHORT[k], D * k + 0.1, D * (k + 1))


def tk(k, dt=0.3):
    return D * k + dt


# 1 metals
for j, sy in enumerate(("Na", "Mg", "Fe")):
    tile("K0 %s" % sy, sy, ST[0] + Vector((-1.6 + 1.6 * j, 0, -0.4)), "metal", tk(0, 0.3 + 0.4 * j))
# 2 sodium loses
lose("K1", 11, ST[1] + Vector((-0.6, 0, -0.5)), tk(1), tk(1, 1.2), "+")
# 3 chlorine gains
gain("K2", 17, ST[2] + Vector((0.6, 0, -0.5)), tk(2), tk(2, 1.0), 1, "−")
# 4 two columns
for j, sy in enumerate(("Li", "Na", "K")):
    tile("K3 A %s" % sy, sy, ST[3] + Vector((-0.6, 0, 1.0 - 1.0 * j)), "metal", tk(3, 0.3 + 0.2 * j))
for j, sy in enumerate(("Be", "Mg", "Ca")):
    tile("K3 B %s" % sy, sy, ST[3] + Vector((0.6, 0, 1.0 - 1.0 * j)), "metal", tk(3, 0.9 + 0.2 * j))
big("Lbl K3 A", "IA", ST[3] + Vector((-0.6, -0.6, 1.75)), tk(3, 0.3), None, mat=M["gold"], size=0.42)
big("Lbl K3 B", "IIA", ST[3] + Vector((0.6, -0.6, 1.75)), tk(3, 0.9), None, mat=M["gold"], size=0.42)
# 5 potassium loses its electron
lose("K4", 19, ST[4] + Vector((-0.8, 0, -0.5)), tk(4), tk(4, 1.0), "+", scale=0.68)
# 6 rock salt
salt = box("K5 Salt", (1.3, 1.3, 1.3), SALT_W, ST[5] + Vector((0, 0, -0.6)))
salt.rotation_euler = (0.4, 0.3, 0.6)
appear(salt, sec(tk(5)), dur=12)
turn(salt, tk(5, 0.5), D * 6, 0.2)
big("Lbl K5", "NaCl", ST[5] + Vector((0, -0.9, 1.0)), tk(5, 1.0), None, mat=M["gold"], size=0.55)
# 7 halogen column
for j, sy in enumerate(("F", "Cl", "Br", "I")):
    tile("K6 %s" % sy, sy, ST[6] + Vector((0, 0, 1.4 - 0.92 * j)), "nonmetal", tk(6, 0.3 + 0.4 * j))
# 8 fluorine gains
gain("K7", 9, ST[7] + Vector((0.6, 0, -0.5)), tk(7), tk(7, 1.0), 1, "−")
# 9 Cl⁻ ions in the sea
sea = box("K8 Sea", (5.0, 1.6, 1.2), WATER, ST[8] + Vector((0, 0, -1.0)))
appear(sea, sec(tk(8)), dur=12)
for j in range(8):
    ion("K8 Cl %d" % j, ANI, ST[8] + Vector((-2.0 + 0.57 * j, -0.85, -1.2 + 0.4 * (j % 2))), tk(8, 0.6 + 0.15 * j), r=0.16)
big("Lbl K8", "Cl⁻", ST[8] + Vector((0, -0.9, 0.3)), tk(8, 1.5), None, mat=M["green"], size=0.55)
# 10 knife into sodium, iron beside it
lump("K9 Na", ST[9] + Vector((-1.6, 0, -1.2)), 0.55, NA_M, tk(9))
knife("K9", ST[9] + Vector((-1.6, 0, -1.2)), tk(9, 0.4), tk(9, 2.0), depth=0.9)
fe = box("K9 Fe", (1.4, 0.8, 0.8), IRON, ST[9] + Vector((1.8, 0, -1.2)))
appear(fe, sec(tk(9, 0.6)), dur=10)
big("Lbl K9 Na", "soft", ST[9] + Vector((-1.6, -0.8, 1.0)), tk(9, 2.4), None, mat=M["cyan"], size=0.5)
big("Lbl K9 Fe", "hard", ST[9] + Vector((1.8, -0.8, 1.0)), tk(9, 2.6), None, mat=M["gold"], size=0.5)
# 11 gold and platinum shining
lump("K10 Au", ST[10] + Vector((-1.2, 0, -0.8)), 0.6, AU_M, tk(10))
lump("K10 Pt", ST[10] + Vector((1.2, 0, -0.8)), 0.6, PT_M, tk(10, 0.3), seed=3)
for j in range(2):
    flash("K10 Shine %d" % j, ST[10] + Vector((-1.0 + 2.4 * j, -0.7, -0.5)), sec(tk(10, 1.5 + 1.2 * j)), 0.3)
# 12 three precious lumps
for j, (mat, sy) in enumerate(((AG_M, "Ag"), (PT_M, "Pt"), (AU_M, "Au"))):
    p = ST[11] + Vector((-2.4 + 2.4 * j, 0, -0.8))
    lump("K11 %s" % sy, p, 0.55, mat, tk(11, 0.3 + 0.4 * j), seed=j)
    big("Lbl K11 %s" % sy, sy, p + Vector((0, -0.8, 1.1)), tk(11, 0.5 + 0.4 * j), None, size=0.5)
finish_film()
