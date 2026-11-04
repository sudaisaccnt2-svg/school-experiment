# ---- Film 703: Oxidation states (textbook p.185: 7.2 (i) oxidation number = the apparent charge on an atom in a  (v4 captions)
# molecule or ion; useful for names, formulas, balancing; Fig 7.1 chromium solutions blue +2, green +3, orange +6) ----
start_film("703", "703 Oxidation States", 46.5)
END = scene.frame_end
SA, SB, SC = (Vector((40 * k, 0, 0)) for k in range(3))

shot("Cam Ions", 0, 12, SA + Vector((0, 0, -0.6)), dist=12, pitch=0.08)
shot("Cam Water", 12, 26, SB + Vector((0, 0, -0.6)), dist=11, pitch=0.08)
shot("Cam Chromium", 26, None, SC + Vector((0, 0, -1.0)), dist=14, pitch=0.1)
for name, t in (("Real charges", 0), ("Apparent charges", 12), ("Colours", 26)):
    act(name, sec(t))

say('A1', 'Na⁺ and Cl⁻: real charges', 0.1, 12)
say('B1', 'Apparent charge: oxidation number', 12, 19)
say('B2', 'Pretend: O −2, H +1', 19, 26)
say('C1', 'Chromium changes colour', 26, 36)
say('C2', 'Blue +2, green +3, orange +6', 36, 46)

# ---- A. Na⁺ and Cl⁻ ----
a0 = SA + Vector((0, 0, -0.6))
molb("A", a0, [("Na", (-1.6, 0, 0), "+1"), ("Cl", (1.6, 0, 0), "−1")], 0.4, 3.0, step=0.8, bsize=0.5)
travel("A e", a0 + Vector((-1.0, -0.3, 0.3)), a0 + Vector((1.0, -0.3, 0.3)), 1.4, dur=1.4, r=0.13, mat=E_BLUE)

# ---- B. water: shared electrons pulled toward O ----
b0 = SB + Vector((0, 0, -0.6))
molb("B", b0, [("O", (0, 0, 0.2), "−2"), ("H", (-0.85, 0, -0.45), "+1"), ("H", (0.85, 0, -0.45), "+1")], 12.3, 20.0,
     step=0.6, k=1.3, bsize=0.45)
for k, sx in enumerate((-1, 1)):
    e = electron("B e %d" % k, None, b0 + Vector((0.6 * sx, -0.75, -0.1)), 0.12, mat=E_BLUE)
    appear(e, sec(14.5), s=tuple(e.scale))
    move(e, sec(17.0), sec(18.5), b0 + Vector((0.6 * sx, -0.75, -0.1)), b0 + Vector((0.3 * sx, -0.75, 0.15)))

# ---- C. three chromium flasks ----
c0 = SC + Vector((0, 0, -2.2))
cols = (("Cr Blue U7", (0.1, 0.35, 1.0), "+2", "blue"), ("Cr Green U7", (0.15, 0.75, 0.25), "+3", "green"),
        ("Cr Orange U7", (1.0, 0.55, 0.05), "+6", "orange"))
for k, (mn, col, bd, word) in enumerate(cols):
    x = -3.0 + 3.0 * k
    cflask("C %d" % k, c0 + Vector((x, 0, 0)), 26.5 + 1.0 * k, mat_emit(mn, col, 1.2, alpha=0.7))
    badge("C B%d" % k, bd, c0 + Vector((x, -1.2, 3.0)), 36.5 + 1.2 * k, size=0.6)
finish_film()
