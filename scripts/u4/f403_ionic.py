# ---- Film 403: Ionic bond, sodium chloride (textbook pp.95-96: 4.3.1, Na 2,8,1 -> Na+, Cl 2,8,7 -> Cl-,  (v4 captions)
# attraction, Fig 4.2 crystal lattice) ----
start_film("403", "403 Ionic Bond NaCl", 64.5)
END = scene.frame_end
SA, SB = Vector((0, 0, 0)), Vector((40, 0, 0))

shot("Cam Atoms", 0, 40, SA + Vector((0, 0, -0.5)), dist=16)
shot("Cam Crystal", 40, None, SB + Vector((0, 0, -0.3)), dist=15, pitch=0.25)
for name, t in (("Two atoms", 0), ("The handover", 10), ("Attraction", 26), ("Crystal", 40)):
    act(name, sec(t))

say('A1', 'Sodium meets chlorine', 0.1, 5)
say('A2', 'Sodium 2, 8, 1 · chlorine 2, 8, 7', 5, 10)
say('B1', 'Sodium hands over one electron', 10, 17)
say('B2', 'Now Na⁺ and Cl⁻: both full', 17, 26)
say('C1', 'Plus and minus attract', 26, 33)
say('C2', 'Na⁺ + Cl⁻ → NaCl', 33, 40)
say('D1', 'Billions of ions stack up', 40, 52)
say('D2', 'A crystal lattice: salt', 52, 64)
NA_P, CL_P = SA + Vector((-3.8, 0, 0.6)), SA + Vector((3.8, 0, 0.6))
gna, rna, ona = vatom("Na", 11, NA_P, sec(0.4), [(sec(0.4), sec(9.6))], r0=0.5, dr=0.55, e_r=0.11, nuc_r=0.08)
gcl, rcl, ocl = vatom("Cl", 17, CL_P, sec(1.0), [(sec(5.0), sec(9.6))], counts=[2, 8, 8], r0=0.5, dr=0.55, e_r=0.11,
                      nuc_r=0.09)
e_na, e_cl = ona[0], ocl[-1]
T = 11.6
a, b = wpos(e_na, T), wpos(e_cl, T)
hide_from(e_na, sec(T))
travel("Hop", a, b, T, dur=2.2, lift=1.4)
hide_until(e_cl, sec(T + 2.2))
ring = bpy.data.objects[N("Na Ring 2")]
pop_out(ring, sec(T + 2.6), 10, tuple(ring.scale))
for nm, txt, p, t, col in (("Na", "Na", NA_P, 0.6, M["white"]), ("Cl", "Cl", CL_P, 1.2, M["white"])):
    sy = _text("%s Sym" % nm, txt, p + Vector((0, -0.3, -2.3)), 0.6, col, weight="semibold")
    shadow(sy)
    appear(sy, sec(t), sec(17.6))
big("Lbl NaIon", "Na⁺", NA_P + Vector((0, -0.6, -2.3)), 17.8, 39.8, mat=mat_emit("Ion Plus Lbl", (0.8, 0.6, 1.0), 2.5), size=0.7)
big("Lbl ClIon", "Cl⁻", CL_P + Vector((0, -0.6, -2.3)), 18.2, 39.8, mat=mat_emit("Ion Minus Lbl", (0.45, 1.0, 0.55), 2.5), size=0.7)
# the ions pull together a little
move(gna, sec(27.0), sec(29.0), NA_P, NA_P + Vector((1.6, 0, 0)))
move(gcl, sec(27.0), sec(29.0), CL_P, CL_P - Vector((1.6, 0, 0)))
for k, (x, d) in enumerate(((-0.9, 1), (0.9, -1))):
    ar = arrow("Pull %d" % k, 0.6, M["red"], None, SA + Vector((x - 0.3 * d, -0.6, 2.4)), (0, 0, 0 if d > 0 else math.pi),
               r=0.05, head=0.25)
    appear(ar, sec(29.2), sec(39.8))
big("Lbl Attract", "attract", SA + Vector((0, -0.6, 3.0)), 29.4, 39.8, mat=M["red"], size=0.45)

# ---- D. the crystal: alternating Na+ (small, violet) and Cl- (big, green) on a cube grid ----
IONP = mat_emit("Ion Plus", (0.75, 0.5, 1.0), 1.3)
IONM = mat_emit("Ion Minus", (0.4, 0.95, 0.5), 1.3)
lat = empty("Lattice", SB + Vector((0, 0, 0.5)))
G = 1.4
k = 0
for i in range(-1, 2):
    for j in range(-1, 2):
        for l in range(-1, 2):
            plus = (i + j + l) % 2 == 0
            s = sphere("Ion %d %d %d" % (i, j, l), 0.24 if plus else 0.38, IONP if plus else IONM, (i * G, j * G, l * G), lat,
                       24, 12)
            kf(s, "scale", 0, (0, 0, 0), 'CONSTANT')
            f = sec(40.4) + 3 * k
            r = 0.24 if plus else 0.38
            kf(s, "scale", f, (0.01,) * 3, 'BEZIER')
            kf(s, "scale", f + 8, (r,) * 3, 'BEZIER')
            k += 1
for i in range(-1, 2):
    for j in range(-1, 2):
        for ax in range(3):
            p = [0, 0, 0]
            q = [i * G, j * G]
            p = (q[0], q[1], 0) if ax == 2 else (q[0], 0, q[1]) if ax == 1 else (0, q[0], q[1])
            rot = (0, 0, 0) if ax == 2 else (math.pi / 2, 0, 0) if ax == 1 else (0, math.pi / 2, 0)
            c = cyl("Rod %d %d %d" % (i, j, ax), 0.035, 0.035, 2 * G, M["dim"], p, lat, rot, segs=8)
            appear(c, sec(48.0), dur=10)
turn(lat, 44.0, 63.8, turns=0.35)
big("Lbl Plus", "Na⁺", SB + Vector((-3.6, -0.6, 0.5)), 46.0, None, mat=mat_emit("Ion Plus Lbl", (0.8, 0.6, 1.0), 2.5), size=0.55)
big("Lbl Minus", "Cl⁻", SB + Vector((3.6, -0.6, 0.5)), 46.6, None, mat=mat_emit("Ion Minus Lbl", (0.45, 1.0, 0.55), 2.5), size=0.55)
big("Lbl NaCl", "NaCl", SB + Vector((0, -0.6, 2.9)), 53.0, None, mat=M["gold"], size=0.6)
finish_film()
