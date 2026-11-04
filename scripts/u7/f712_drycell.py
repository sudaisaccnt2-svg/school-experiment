# ---- Film 712: Batteries and the dry cell (textbook pp.199-200: battery = galvanic cells joined in series; a car  (v4 captions)
# battery has six or more; Fig 7.7 common dry cells; dry cell by Leclanché 1887, Fig 7.8: zinc case = anode, graphite
# rod = cathode, paste of NH₄Cl, MnO₂ and carbon, sealed with wax, 1.25 V (as printed); Zn → Zn²⁺ + 2e⁻;
# 2MnO₂ + 2NH₄⁺ + 2e⁻ → Mn₂O₃ + 2NH₃ + H₂O; Zn²⁺ + 2Cl⁻ → ZnCl₂) ----
start_film("712", "712 Batteries and Dry Cell", 66.5)
END = scene.frame_end
SA, SB = Vector((0, 0, 0)), Vector((40, 0, 0))

shot("Cam Battery", 0, 18, SA + Vector((0, 0, -0.9)), dist=14, pitch=0.1)
shot("Cam Dry", 18, 44, SB + Vector((0, 0, -1.1)), dist=14.5, pitch=0.1)
shot("Cam Work", 44, None, SB + Vector((1.6, 0, -1.3)), dist=15.5, pitch=0.1)
for name, t in (("Battery", 0), ("Dry cell", 18), ("Working", 44)):
    act(name, sec(t))

say('A1', 'Cells in a row: battery', 0.1, 8)
say('A2', 'More cells, more push', 8, 18)
say('B1', 'The dry cell', 18, 26)
say('B2', 'Zinc case, graphite rod', 26, 34)
say('B3', 'A moist paste inside', 34, 44)
say('C1', 'The zinc case is eaten', 44, 52)
say('C2', 'MnO₂ takes the electrons', 52, 60)
say('C3', '1.25 V', 60, 66)

# ---- A. cells in a row light a bulb; then six cells ----
def drycell(key, loc, t0, s=1.0, rot=(0, 0, 0), t1=None):
    g = empty(key, loc, rot=rot)
    cyl(key + " Can", 0.45 * s, 0.45 * s, 1.6 * s, mat_pbr("Cell Wrap U7", (0.12, 0.2, 0.55), roughness=0.4),
        (0, 0, 0), g, base=True, segs=32)
    cyl(key + " Top", 0.45 * s, 0.45 * s, 0.25 * s, mat_pbr("Cell Band U7", (0.85, 0.6, 0.15), metallic=0.6,
        roughness=0.3), (0, 0, 1.6 * s), g, base=True, segs=32)
    cyl(key + " Nub", 0.14 * s, 0.14 * s, 0.14 * s, METAL, (0, 0, 1.85 * s), g, base=True, segs=16)
    appear(g, sec(t0), t1 and sec(t1), dur=10)
    return g

a0 = SA + Vector((0, 0, -0.9))
for k in range(3):
    drycell("A Cell %d" % k, a0 + Vector((-3.0 + 2.05 * k, 0, 0)), 0.4 + 0.4 * k, rot=(0, math.pi / 2, 0), t1=8.0)
_, gl = bulb("A", a0 + Vector((3.6, 0, -0.45)), 1.8, 1.0, 8.0)
wire("A W", [a0 + Vector((-3.1, 0, 0)), a0 + Vector((-3.1, 0, 1.4)), a0 + Vector((3.6, 0, 1.4)), a0 + Vector((3.6, 0, 0.8))],
     1.8, 8.0)
flow("A e", [a0 + Vector((3.6, -0.05, 0.8)), a0 + Vector((3.6, -0.05, 1.4)), a0 + Vector((-3.1, -0.05, 1.4)),
             a0 + Vector((-3.1, -0.05, 0))], 2.8, 8.0, n=6, speed=1.5)
# car battery: a box with six cells inside
case = box_edges("A Car", (6.0, 1.6, 2.0), a0 + Vector((0, 0, 0.2)))
appear(case, sec(8.4), dur=10)
for k in range(6):
    c = box("A Car Cell %d" % k, (0.85, 1.3, 1.7), mat_pbr("Car Cell U7", (0.2, 0.22, 0.26), roughness=0.5),
            a0 + Vector((-2.5 + 1.0 * k, 0, 0.2)))
    appear(c, sec(9.0 + 0.3 * k), dur=8)
big("Lbl A", "6 cells", a0 + Vector((0, -1.2, 1.8)), 11.0, None, mat=M["gold"], size=0.5)

# ---- B. dry cell cut open: ghost zinc case, paste, rod, cap ----
b0 = SB + Vector((0, 0, -2.6))
ZG = mat_pbr("Zinc Ghost U7", (0.62, 0.66, 0.72), metallic=0.6, roughness=0.4, alpha=0.3)
can = cyl("B Zinc", 1.1, 1.1, 3.4, ZG, b0, base=True, segs=48)
appear(can, sec(18.3), dur=10)
paste = cyl("B Paste", 0.98, 0.98, 2.9, mat_pbr("Dry Paste Clear U7", (0.75, 0.62, 0.18), roughness=0.9, alpha=0.55), b0 + Vector((0, 0, 0.1)),
            base=True, segs=40)
appear(paste, sec(27.0), dur=10)
rod = cyl("B Rod", 0.18, 0.18, 3.9, GRAPHITE, b0 + Vector((0, 0, 0.3)), base=True, segs=20)
appear(rod, sec(26.5), dur=10)
wax = cyl("B Wax", 1.02, 1.02, 0.3, mat_pbr("Wax U7", (0.5, 0.15, 0.1), roughness=0.6), b0 + Vector((0, 0, 3.0)),
          base=True, segs=40)
appear(wax, sec(35.0), dur=10)
cap = cyl("B Cap", 0.3, 0.3, 0.2, METAL, b0 + Vector((0, 0, 4.2)), base=True, segs=20)
appear(cap, sec(26.8), dur=10)
big("Lbl B Zn", "zinc case (−)", b0 + Vector((-2.8, -1.2, 1.2)), 27.0, 44.0, mat=M["cyan"], size=0.42)
big("Lbl B Rod", "graphite rod (+)", b0 + Vector((2.9, -1.2, 3.6)), 28.0, 44.0, mat=M["red"], size=0.42)
big("Lbl B P", "paste", b0 + Vector((2.6, -1.2, 1.2)), 35.5, 44.0, mat=M["gold"], size=0.42)

# ---- C. working: zinc ions leave the case; electrons go out through a bulb and back into the rod ----
for k in range(4):
    p = b0 + Vector((-1.0 + 0.05 * (k % 2), -0.6, 0.6 + 0.6 * k))
    zi = ion("C Zn2 %d" % k, CAT, p, 45.0 + 0.5 * k, r=0.13)
    move(zi, sec(45.5 + 0.5 * k), sec(48.0 + 0.5 * k), p, p + Vector((0.45, 0, 0.1)))
_, gl2 = bulb("C", b0 + Vector((4.4, 0, 2.6)), 47.0, 0.8)
loop = [b0 + Vector((-1.15, 0, 3.0)), b0 + Vector((-1.15, 0, 4.9)), b0 + Vector((4.4, 0, 4.9)), b0 + Vector((4.4, 0, 3.85))]
back = [b0 + Vector((4.4, 0, 2.6)), b0 + Vector((4.4, 0, 2.2)), b0 + Vector((2.0, 0, 2.2)), b0 + Vector((2.0, 0, 4.5)),
        b0 + Vector((0, 0, 4.5)), b0 + Vector((0, 0, 4.4))]
wire("C W1", loop, 47.0)
wire("C W2", back, 47.0)
flow("C e", loop + back, 48.0, END / FPS, n=10, speed=1.4)
big("Lbl C V", "1.25 V", b0 + Vector((6.2, -1.0, 3.4)), 60.5, None, mat=M["gold"], size=0.45)
finish_film()
