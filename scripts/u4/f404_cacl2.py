# ---- Film 404: Calcium chloride and ions (textbook pp.96-97: Fig 4.3 CaCl2, AlCl3, Test Yourself 1-4) ----  (v4 captions)
start_film("404", "404 Calcium Chloride", 74.5)
END = scene.frame_end
SA, SB, SC = Vector((0, 0, 0)), Vector((40, 0, 0)), Vector((80, 0, 0))

shot("Cam CaCl2", 0, 30, SA + Vector((0, 0, -0.5)), dist=19)
shot("Cam Ions", 30, 58, SB + Vector((0, 0, -0.5)), dist=21.5)
shot("Cam MgO", 58, None, SC + Vector((0, 0, -0.5)), dist=16)
for name, t in (("Calcium gives two", 0), ("Ions", 30), ("Magnesium oxide", 58)):
    act(name, sec(t))

say('A1', 'Calcium has 2 outer electrons', 0.1, 8)
say('A2', 'One to each chlorine', 8, 18)
say('A3', 'Ca²⁺ + 2Cl⁻ → CaCl₂', 18, 30)
say('B1', 'Which ions form?', 30, 37)
say('B2', 'Ca → Ca²⁺ · F → F⁻', 37, 44)
say('B3', 'Li → Li⁺ · O → O²⁻', 44, 51)
say('B4', 'Every ion has a full shell', 51, 58)
say('C1', 'Magnesium meets oxygen', 58, 66)
say('C2', 'Mg²⁺ and O²⁻: MgO', 66, 74)

# ---- A. Cl - Ca - Cl ----
CA_P = SA + Vector((0, 0, 0.5))
gca, rca, oca = vatom("Ca", 20, CA_P, sec(0.4), [(sec(0.4), sec(7.6))], r0=0.35, dr=0.38, e_r=0.09, nuc_r=0.08,
                      ring_depth=0.013)
cls = []
for k, x in enumerate((-5.6, 5.6)):
    cls.append(vatom("Cl%d" % k, 17, SA + Vector((x, 0, 0.5)), sec(1.0 + 0.4 * k), [(sec(3.0), sec(7.6))],
                     counts=[2, 8, 8], r0=0.4, dr=0.42, e_r=0.09, nuc_r=0.08, ring_depth=0.013))
# the electrons nearest each other change hands: Ca's two go left and right
hand(oca[1], cls[0][2][-1], 9.0, "Hop L", dur=1.8)
hand(oca[0], cls[1][2][-1], 11.4, "Hop R", dur=1.8)
drop_ring("Ca", 3, 13.8)
for nm, x, t0, t1 in (("Ca", 0, 0.6, 14.2), ("Cl", -5.6, 1.0, 10.6), ("Cl", 5.6, 1.4, 13.0)):
    sy = _text("A %s %d Sym" % (nm, x), nm, SA + Vector((x, -0.3, -1.9)), 0.55, M["white"], weight="semibold")
    shadow(sy)
    appear(sy, sec(t0), sec(t1))
for nm, txt, x, t0, t1, col in (("Ca", "Ca²⁺", 0, 14.4, 29.8, (0.85, 0.75, 1.0)), ("Cl0", "Cl⁻", -5.6, 10.8, 29.8, (0.45, 1.0, 0.55)),
                                ("Cl1", "Cl⁻", 5.6, 13.2, 29.8, (0.45, 1.0, 0.55))):
    big("Lbl %s" % nm, txt, SA + Vector((x, -0.6, -1.9)), t0, t1, mat=mat_emit("Lbl %s Col" % nm, col, 2.5), size=0.6)

# ---- B. four atoms become ions ----
ROW = [(20, -7.2, "lose", 2, "Ca²⁺", 38.0), (9, -2.4, "gain", 1, "F⁻", 41.0), (3, 2.4, "lose", 1, "Li⁺", 45.0),
       (8, 7.2, "gain", 2, "O²⁻", 48.0)]
for z, x, mode, n, ion, t in ROW:
    p = SB + Vector((x, 0, 0.6))
    counts = shells_of(z)
    if mode == "gain":
        counts = counts[:-1] + [counts[-1] + n]
    g, rr, oo = vatom("B %s" % SYM[z], z, p, sec(30.4), [], counts=counts, r0=0.35, dr=0.38, e_r=0.085, nuc_r=0.07,
                      ring_depth=0.012)
    sy = _text("B %s Sym" % SYM[z], SYM[z], p + Vector((0, -0.3, -2.0)), 0.55, M["white"], weight="semibold")
    shadow(sy)
    appear(sy, sec(30.6), sec(t + 1.6))
    for j in range(n):
        e = oo[-1 - j]
        home = e.location.copy()
        if mode == "lose":
            kf(e, "location", sec(t + 0.3 * j), home, 'BEZIER')
            kf(e, "location", sec(t + 1.3 + 0.3 * j), home * 3.0, 'BEZIER')
            hide_from(e, sec(t + 1.3 + 0.3 * j))
        else:
            fly_in(e, t + 0.3 * j, dist=3.0, dur=1.3)
    if mode == "lose":
        drop_ring("B %s" % SYM[z], len(rr) - 1, t + 1.6)
    big("Lbl B %s" % SYM[z], ion, p + Vector((0, -0.6, -2.0)), t + 1.7, 57.8,
        mat=M["cyan"] if mode == "lose" else M["green"], size=0.6)

# ---- C. MgO: magnesium hands two electrons to oxygen ----
MG_P, O_P = SC + Vector((-3.4, 0, 0.5)), SC + Vector((3.4, 0, 0.5))
gmg, rmg, omg = vatom("Mg", 12, MG_P, sec(58.4), [(sec(58.4), sec(60.0))], r0=0.45, dr=0.5, e_r=0.1, nuc_r=0.08)
go, ro, oo = vatom("O", 8, O_P, sec(58.8), [(sec(58.8), sec(60.0))], counts=[2, 8], r0=0.5, dr=0.6, e_r=0.1, nuc_r=0.08)
hand(omg[0], oo[-1], 61.0, "Mg Hop 0", dur=1.6)
hand(omg[1], oo[-2], 62.8, "Mg Hop 1", dur=1.6)
drop_ring("Mg", 2, 64.8)
for nm, txt, p, t, col in (("Mg", "Mg²⁺", MG_P, 65.0, (0.85, 0.75, 1.0)), ("O", "O²⁻", O_P, 65.4, (0.45, 1.0, 0.55))):
    big("Lbl C %s" % nm, txt, p + Vector((0, -0.6, -2.0)), t, None, mat=mat_emit("Lbl C %s Col" % nm, col, 2.5), size=0.6)
finish_film()
