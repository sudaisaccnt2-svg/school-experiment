# ---- Film 817: Chemical reactivity of halogens (textbook pp.242-245: strongly electronegative, diatomic, single
# covalent bond; i. hydrogen: F₂ violently, Cl₂ in sunlight, Br₂ on heating, I₂ reversibly; HF is a liquid (hydrogen
# bonding); ii. oxygen: O₂ + 2F₂ → 2OF₂, O₂ + F₂ → O₂F₂ (others: Cl₂O₇, Br₃O₄, I₂O₅); iii. metals → ionic halides:
# Cu + Br₂ → CuBr₂, 2K + I₂ → 2KI; iv. non-metals → covalent halides: 2P + 3Cl₂ → 2PCl₃, 2P + 5Cl₂ → 2PCl₅;
# v. other compounds: H₂S + Cl₂ → 2HCl + S, 2NH₃ + 3Cl₂ → 6HCl + N₂, Ca(OH)₂ + Cl₂ → CaOCl₂ + H₂O (bleaching powder);
# vi. displacement: F > Cl > Br > I, 2NaBr + Cl₂ → 2NaCl + Br₂; Test Yourself: Br₂ + 2KI → I₂ + 2KBr; the period-3
# element that displaces iodine, a greenish gas denser than air, used in swimming pools = chlorine) (v4) ----
start_film("817", "817 Halogens React", 92.5)
END = scene.frame_end
S = [Vector((40 * k, 0, 0)) for k in range(14)]

shot("Cam F", 0, 6, S[0] + Vector((0, 0, -0.6)), dist=10, pitch=0.04)
shot("Cam Cl", 6, 12, S[1] + Vector((0, 0, -0.6)), dist=10, pitch=0.04)
shot("Cam Br", 12, 18, S[2] + Vector((0, 0, -0.6)), dist=10, pitch=0.04)
shot("Cam I", 18, 24, S[3] + Vector((0, 0, -0.6)), dist=10, pitch=0.04)
shot("Cam O", 24, 32, S[4] + Vector((0, 0, -0.6)), dist=10, pitch=0.04)
shot("Cam Metals", 32, 44, S[5] + Vector((0, 0, -0.6)), dist=10, pitch=0.06)
shot("Cam P", 44, 52, S[6] + Vector((0, 0, -0.6)), dist=10, pitch=0.04)
shot("Cam H2S", 52, 58, S[7] + Vector((0, 0, -0.6)), dist=10, pitch=0.04)
shot("Cam Bleach", 58, 64, S[8] + Vector((0, 0, -0.7)), dist=10, pitch=0.06)
shot("Cam Order", 64, 70, S[9] + Vector((0, 0, -0.6)), dist=11, pitch=0.04)
shot("Cam NaBr", 70, 78, S[10] + Vector((0, 0, -0.7)), dist=10, pitch=0.06)
shot("Cam KI", 78, 85, S[11] + Vector((0, 0, -0.7)), dist=10, pitch=0.06)
shot("Cam Pool", 85, None, S[12] + Vector((0, 0, -0.6)), dist=10, pitch=0.1)
for name, t in (("With hydrogen", 0), ("With oxygen", 24), ("With metals", 32), ("With non-metals", 44),
                ("With compounds", 52), ("Displacement", 64), ("Test yourself", 78)):
    act(name, sec(t))

say('A1', 'H₂ + F₂: violent', 0.1, 6)
say('A2', 'H₂ + Cl₂ needs sunlight', 6, 12)
say('A3', 'H₂ + Br₂ needs heat', 12, 18)
say('A4', 'H₂ + I₂ goes both ways', 18, 24)
say('B1', 'Fluorine + oxygen: OF₂', 24, 32)
say('C1', 'Cu + Br₂ → CuBr₂', 32, 38)
say('C2', '2K + I₂ → 2KI', 38, 44)
say('D1', 'Phosphorus: PCl₃ and PCl₅', 44, 52)
say('E1', 'Chlorine pulls H from H₂S', 52, 58)
say('E2', 'Lime water: bleaching powder', 58, 64)
say('F1', 'F > Cl > Br > I', 64, 70)
say('F2', 'Chlorine pushes out bromine', 70, 78)
say('G1', 'Bromine pushes out iodine', 78, 85)
say('G2', 'Pool germ-killer: chlorine', 85, 92)


def hx(key, X, c, t0, cond=None, back=False):
    """H–H and X–X meet and swap partners: H–X, H–X (back=True: they swap back again)."""
    a = [A("%s H%d" % (key, k), "H", c + Vector((-2.4, 0, 0.5 - 1.0 * k)), t0 + 0.2, k=0.9) for k in range(2)]
    b = [A("%s X%d" % (key, k), X, c + Vector((2.4, 0, 0.55 - 1.1 * k)), t0 + 0.3, k=0.75) for k in range(2)]
    t = t0 + 2.2
    for k in range(2):
        mv(a[k], t, t + 1.4, c + Vector((-2.4, 0, 0.5 - 1.0 * k)), c + Vector((-0.55, 0, 0.6 - 1.2 * k)))
        mv(b[k], t, t + 1.4, c + Vector((2.4, 0, 0.55 - 1.1 * k)), c + Vector((0.45, 0, 0.6 - 1.2 * k)))
    if back:
        for k in range(2):
            mv(a[k], t + 2.4, t + 3.4, c + Vector((-0.55, 0, 0.6 - 1.2 * k)), c + Vector((-1.6, 0, 0.5 - 1.0 * k)))
            mv(b[k], t + 2.4, t + 3.4, c + Vector((0.45, 0, 0.6 - 1.2 * k)), c + Vector((1.6, 0, 0.55 - 1.1 * k)))
    big("Lbl %s" % key, "H%s" % X, c + Vector((0, -0.8, 1.6)), t + 1.5, None, mat=M["gold"], size=0.5)


hx("A", "F", S[0] + Vector((0, 0, -0.4)), 0.0)
flash("A Bang", S[0] + Vector((0, -0.6, -0.4)), sec(3.6), 1.4)
hx("B", "Cl", S[1] + Vector((0, 0, -0.4)), 6.0)
sun = sphere("B Sun", 0.5, mat_emit("Sun U8", (1.0, 0.85, 0.35), 6.0), S[1] + Vector((-3.6, 0, 1.4)), None, 24, 12)
appear(sun, sec(6.3), s=(0.5,) * 3)
for k in range(3):
    energy_wave("B Ray %d" % k, S[1] + Vector((-3.0, -0.3, 1.1 - 0.3 * k)), (1, 0, -0.5), 6.8 + 0.4 * k, dist=2.2, dur=1.0)
hx("C", "Br", S[2] + Vector((0, 0, -0.4)), 12.0)
cflame("C Heat", S[2] + Vector((0, 0, -2.0)), (1.0, 0.5, 0.12), 12.5, 18.0, s=0.5)
hx("D", "I", S[3] + Vector((0, 0, -0.4)), 18.0, back=True)
big("Lbl D ⇄", "↔", S[3] + Vector((0, -0.8, -1.6)), 21.0, None, mat=M["white"], size=0.6)

e0 = S[4] + Vector((0, 0, -0.4))
ox = A("E O", "O", e0 + Vector((-2.6, 0, 0)), 24.3)
f1 = A("E F1", "F", e0 + Vector((2.4, 0, 0.6)), 24.5)
f2 = A("E F2", "F", e0 + Vector((2.4, 0, -0.6)), 24.6)
mv(ox, 26.0, 27.6, e0 + Vector((-2.6, 0, 0)), e0)
mv(f1, 26.0, 27.6, e0 + Vector((2.4, 0, 0.6)), e0 + Vector((-0.75, 0, 0.6)))
mv(f2, 26.0, 27.6, e0 + Vector((2.4, 0, -0.6)), e0 + Vector((0.75, 0, 0.6)))
big("Lbl E", "OF₂", e0 + Vector((0, -0.8, 1.7)), 28.0, None, mat=M["gold"], size=0.55)

g0 = S[5] + Vector((0, 0, -1.6))
jb = jar("G Br Jar", 0.85, 2.2, g0 + Vector((-1.4, 0, 0)))
appear(jb, sec(32.3))
lq = liquid("G Br Liq", 0.82, 0.7, g0 + Vector((-1.4, 0, 0.01)), mat=mat_emit("Bromine Liq U8", (0.55, 0.12, 0.04), 1.2, alpha=0.9))
appear(lq, sec(32.5))
cu = lump("G Cu", g0 + Vector((-1.4, 0, 2.6)), 0.3, COPPER, 32.8)
move(cu, sec(33.6), sec(34.6), g0 + Vector((-1.4, 0, 2.6)), g0 + Vector((-1.4, 0, 0.45)))
dissolve_out(cu, 35.0, 1.5)
lump("G CuBr2", g0 + Vector((1.6, 0, 0.4)), 0.45, mat_pbr("CuBr2 U8", (0.15, 0.12, 0.1), roughness=0.6), 36.0)
big("Lbl G", "CuBr₂", g0 + Vector((1.6, -0.8, 1.3)), 36.3, 38.0, size=0.5)
k1 = lump("G K", g0 + Vector((-1.6, 0, 1.0)), 0.35, NA_M, 38.3)
for k in range(3):
    cr = box("G I %d" % k, (0.22, 0.22, 0.12), mat_pbr("Iodine Solid U8", (0.08, 0.06, 0.1), metallic=0.6, roughness=0.3),
             g0 + Vector((1.2 + 0.3 * k, 0, 1.0)))
    appear(cr, sec(38.5 + 0.1 * k))
    move(cr, sec(39.5), sec(40.6), g0 + Vector((1.2 + 0.3 * k, 0, 1.0)), g0 + Vector((-1.2, 0, 1.0)))
    hide_from(cr, sec(40.8), (1, 1, 1))
dissolve_out(k1, 40.6, 0.8)
lump("G KI", g0 + Vector((-1.4, 0, 0.9)), 0.45, SALT_W, 41.2, seed=5)
big("Lbl G2", "KI", g0 + Vector((-1.4, -0.8, 1.8)), 41.4, None, size=0.5)

h0 = S[6] + Vector((0, 0, -0.4))
pA = A("H P", "P", h0 + Vector((-2.2, 0, 0)), 44.3)
for k in range(3):
    ang = math.radians(90 + 120 * k)
    A("H3 Cl%d" % k, "Cl", h0 + Vector((-2.2 + 1.05 * math.cos(ang), 0, 1.05 * math.sin(ang))), 45.0 + 0.3 * k, k=0.7)
pB = A("H P5", "P", h0 + Vector((2.2, 0, 0)), 47.6)
for k in range(5):
    ang = math.radians(90 + 72 * k)
    A("H5 Cl%d" % k, "Cl", h0 + Vector((2.2 + 1.05 * math.cos(ang), 0, 1.05 * math.sin(ang))), 48.0 + 0.3 * k, k=0.7)
big("Lbl H3", "PCl₃", h0 + Vector((-2.2, -0.8, -1.55)), 46.2, None, mat=M["gold"], size=0.45)
big("Lbl H5", "PCl₅", h0 + Vector((2.2, -0.8, -1.55)), 49.8, None, mat=M["gold"], size=0.45)

i0 = S[7] + Vector((0, 0, -0.4))
sA = A("I S", "S", i0 + Vector((-1.4, 0, 0)), 52.3)
hs = [A("I H%d" % k, "H", i0 + Vector((-1.4 + 0.75 * (k * 2 - 1), 0, -0.55)), 52.4, k=0.8) for k in range(2)]
cls = [A("I Cl%d" % k, "Cl", i0 + Vector((2.6, 0, 0.6 - 1.2 * k)), 52.6, k=0.75) for k in range(2)]
for k in range(2):
    mv(hs[k], 54.0 + 0.3 * k, 55.2 + 0.3 * k, i0 + Vector((-1.4 + 0.75 * (k * 2 - 1), 0, -0.55)), i0 + Vector((1.85, 0, 0.6 - 1.2 * k)))
big("Lbl I", "S left", i0 + Vector((-1.4, -0.8, 1.2)), 55.8, None, mat=M["gold"], size=0.45)

j0 = S[8] + Vector((0, 0, -1.8))
beaker("J", j0, 1.0, 2.0, 1.4, 58.3, liq_mat=MILK)
bubbles("J Cl", j0.x - 0.4, j0.x + 0.4, j0.z + 0.2, j0.z + 1.35, j0.y - 0.2, 59.0, 64.0, n=8, r=0.09, mat=CL_GAS)
big("Lbl J1", "Ca(OH)₂", j0 + Vector((-2.4, -0.8, 1.0)), 58.6, None, size=0.45)
big("Lbl J2", "CaOCl₂", j0 + Vector((0, -0.8, 2.8)), 61.5, None, mat=M["gold"], size=0.5)

k0 = S[9] + Vector((-2.4, 0, -1.4))
for k, sy in enumerate(("F", "Cl", "Br", "I")):
    tile("K %s" % sy, sy, k0 + Vector((1.6 * k, 0, 2.4 - 0.75 * k)), "nonmetal", 64.3 + 0.5 * k)
big("Lbl K", "most reactive", k0 + Vector((0, -0.6, 3.25)), 66.5, None, mat=M["gold"], size=0.42)


def push(key, c, t0, liq0, liq1, gas_mat, label0, label1, label_gas):
    beaker(key, c, 1.0, 2.0, 0.0, t0)
    a = liquid(key + " L0", 0.97, 1.4, c, mat=liq0)
    b = liquid(key + " L1", 0.97, 1.4, c + Vector((0, -0.01, 0)), mat=liq1)
    appear(a, sec(t0 + 0.2))
    hide_until(b, sec(t0 + 4.5))
    hide_from(a, sec(t0 + 4.5), (1, 1, 1))
    bubbles(key + " Gas", c.x - 0.4, c.x + 0.4, c.z + 0.2, c.z + 1.35, c.y - 0.25, t0 + 1.0, t0 + 4.6, n=8, r=0.09, mat=gas_mat)
    big("Lbl %s 0" % key, label0, c + Vector((-2.4, -0.8, 1.0)), t0 + 0.4, None, size=0.45)
    big("Lbl %s G" % key, label_gas, c + Vector((0, -0.8, 2.8)), t0 + 1.0, t0 + 4.4, mat=M["green"], size=0.45)
    big("Lbl %s 1" % key, label1, c + Vector((0, -0.8, 2.8)), t0 + 4.8, None, mat=M["gold"], size=0.5)


push("L", S[10] + Vector((0, 0, -1.8)), 70.3, mat_emit("NaBr Sol U8", (0.8, 0.9, 1.0), 0.3, alpha=0.15), JAR["Br"], CL_GAS,
     "NaBr", "Br₂ freed", "Cl₂")
push("M", S[11] + Vector((0, 0, -1.8)), 78.3, mat_emit("KI Sol U8", (0.8, 0.9, 1.0), 0.3, alpha=0.15),
     mat_emit("Iodine Sol U8", (0.45, 0.15, 0.35), 0.9, alpha=0.55), mat_emit("Br Drops U8", (0.9, 0.35, 0.08), 2.0),
     "KI", "I₂ freed", "Br₂")

n0 = S[12] + Vector((0, 0, -1.2))
pool = box("N Pool", (6.0, 2.6, 0.9), mat_emit("Pool U8", (0.1, 0.6, 0.9), 0.8, alpha=0.4), n0)
appear(pool, sec(85.3), dur=12)
edge = box_edges("N Edge", (6.1, 2.7, 1.0), n0, mat=M["white"], top=False)
appear(edge, sec(85.3), dur=12)
tile("N Cl", "Cl", n0 + Vector((0, -0.4, 1.8)), "nonmetal", 86.5)
for k in range(6):
    gm = blob("N Germ %d" % k, (0.15, 0.15, 0.12), mat_emit("Germ U8", (0.6, 0.9, 0.2), 1.5),
              n0 + Vector((-2.2 + 0.9 * k, -1.35, 0.1 * (k % 2))))
    appear(gm, sec(85.6), dur=8)
    dissolve_out(gm, 88.0 + 0.3 * k, 0.6)
big("Lbl N", "period 3 · greenish gas", n0 + Vector((0, -0.9, 2.65)), 87.0, None, mat=M["gold"], size=0.42)
finish_film()
