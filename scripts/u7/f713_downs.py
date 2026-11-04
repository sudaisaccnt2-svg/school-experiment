# ---- Film 713: Electrochemical industries and sodium from the Down cell (textbook pp.201-203: 7.6 uses: cells and  (v4 captions)
# batteries, electroplating, producing and refining metals, chemicals like NaOH; 7.6.1 Davy (book: "Davey") made sodium
# in 1807 from fused NaOH; Down cell, Fig 7.9: steel tank lined with firebrick, graphite anode in the centre under a dome,
# ring cathode of copper or iron, iron screen; NaCl melts at 801 °C, 1 NaCl : 3 CaCl₂ melts at 600 °C;
# 2Na⁺ + 2e⁻ → 2Na at the cathode, 2Cl⁻ → Cl₂ + 2e⁻ at the anode; 2NaCl → 2Na + Cl₂;
# Society: Al₂O₃ layer (4 nm) protects aluminium; iron oxides FeO, Fe₂O₃, Fe₃O₄; rust flakes, worse in salt water) ----
start_film("713", "713 Sodium from Down Cell", 82.5)
END = scene.frame_end
SA, SB, SC, SD = (Vector((40 * k, 0, 0)) for k in range(4))

shot("Cam Uses", 0, 14, SA + Vector((0, 0, -0.9)), dist=14, pitch=0.1)
shot("Cam Davy", 14, 22, SB + Vector((0, 0, -0.7)), dist=11, pitch=0.08)
shot("Cam Down", 22, 40, SC + Vector((0, 0, -1.6)), dist=15, pitch=0.12)
shot("Cam Work", 40, 64, SC + Vector((0.3, 0, -1.6)), dist=14.5, pitch=0.1)
shot("Cam Metals", 64, None, SD + Vector((0, 0, -0.9)), dist=13, pitch=0.1)
for name, t in (("Uses", 0), ("Davy", 14), ("Down cell", 22), ("Working", 40), ("Aluminium and rust", 64)):
    act(name, sec(t))

say('A1', 'Batteries for everything', 0.1, 5)
say('A2', 'Plating, refining, making sodium', 5, 10)
say('A3', 'NaOH by electrolysis', 10, 14)
say('B1', 'Davy, 1807: first sodium', 14, 22)
say('C1', 'The Down cell', 22, 28)
say('C2', 'Graphite anode, ring cathode', 28, 34)
say('C3', 'CaCl₂ lowers melting to 600 °C', 34, 40)
say('D1', 'Sodium floats up', 40, 48)
say('D2', 'Chlorine rises into the dome', 48, 56)
say('D3', 'The screen keeps them apart', 56, 64)
say('E1', "Aluminium's skin protects it", 64, 72)
say('E2', 'Rust flakes off iron', 72, 82)

# ---- A. four uses, one at a time ----
a0 = SA + Vector((0, 0, -1.4))
g = empty("A Cell", a0 + Vector((-3.6, 0, -0.2)))
cyl("A Cell Can", 0.4, 0.4, 1.4, mat_pbr("Cell Wrap U7", (0.12, 0.2, 0.55), roughness=0.4), (0, 0, 0), g, base=True)
cyl("A Cell Top", 0.4, 0.4, 0.2, mat_pbr("Cell Band U7", (0.85, 0.6, 0.15), metallic=0.6, roughness=0.3), (0, 0, 1.4), g,
    base=True)
appear(g, sec(0.6), dur=10)
sp = sphere("A Chrome", 0.65, CHROME, a0 + Vector((-1.2, 0, 0.5)), None, 32, 16)
appear(sp, sec(5.3), s=(0.65,) * 3)
blk = box("A Copper", (1.0, 0.6, 0.6), mat_pbr("Pure Copper U7", (0.95, 0.5, 0.3), metallic=1.0, roughness=0.2),
          a0 + Vector((1.2, 0, 0.3)))
appear(blk, sec(6.5), dur=10)
cflask("A Flask", a0 + Vector((3.6, 0, -0.2)), 10.3, mat_emit("NaOH U7", (0.85, 0.9, 1.0), 0.5, alpha=0.4), s=0.8)

# ---- B. Davy: a sodium bead pops out of molten NaOH ----
b0 = SB + Vector((0, 0, -1.6))
pool = cyl("B Melt", 1.6, 1.6, 0.5, MELT, b0, base=True, segs=40)
appear(pool, sec(14.3), dur=10)
bead = sphere("B Na", 0.35, SODIUM, b0 + Vector((0, 0, 0.3)), None, 24, 12)
appear(bead, sec(16.5), s=(0.35,) * 3)
move(bead, sec(16.6), sec(18.0), b0 + Vector((0, 0, 0.3)), b0 + Vector((0, 0, 1.1)))
badge("B Y", "1807", b0 + Vector((0, -0.6, 2.4)), 15.0, size=0.6)
big("Lbl B", "Na", b0 + Vector((1.0, -0.6, 1.1)), 18.2, None, mat=M["white"], size=0.45)

# ---- C. the Down cell, cut open ----
c0 = SC + Vector((0, 0, -2.6))
tk = jar("C Tank", 2.6, 3.0, c0, mat=METAL)
appear(tk, sec(22.3), dur=10)
fb = cyl("C Brick", 2.6, 2.6, 0.18, mat_pbr("Firebrick U7", (0.55, 0.25, 0.15), roughness=0.9), c0, base=True)
appear(fb, sec(22.6), dur=10)
melt = cyl("C Melt", 2.5, 2.5, 2.3, MELT, c0 + Vector((0, 0, 0.18)), base=True, segs=48)
appear(melt, sec(34.3), dur=12)
an = cyl("C Anode", 0.38, 0.38, 2.2, GRAPHITE, c0 + Vector((0, 0, -0.4)), base=True, segs=24)
appear(an, sec(28.3), dur=10)
scr = cyl("C Screen", 0.9, 0.9, 2.0, mat_pbr("Iron Screen U7", (0.4, 0.42, 0.45), metallic=0.7, roughness=0.5, alpha=0.3),
          c0 + Vector((0, 0, 0.3)), base=True, segs=40)
appear(scr, sec(29.5), dur=10)
for k, sx in enumerate((-1, 1)):
    p = plate("C Cathode %d" % k, c0 + Vector((1.7 * sx, 0, 0.4)), 1.6, IRON, 29.0, w=0.3)
dome = cyl("C Dome", 1.0, 0.3, 0.8, mat_pbr("Dome U7", (0.45, 0.47, 0.5), metallic=0.8, roughness=0.4),
           c0 + Vector((0, 0, 2.3)), base=True, segs=32)
appear(dome, sec(30.0), dur=10)
pipe = cyl("C Pipe", 0.3, 0.3, 1.2, METAL, c0 + Vector((0, 0, 3.1)), base=True, segs=20)
appear(pipe, sec(30.0), dur=10)
badge("C T", "600 °C", c0 + Vector((-3.7, -0.8, 2.2)), 36.0, size=0.5)

# ---- D. working: Na⁺ to the ring, sodium floats up; Cl⁻ to the anode, Cl₂ into the dome ----
for k, sx in enumerate((-1, 1)):
    for j in range(2):
        a = c0 + Vector((1.05 * sx, -0.6, 0.7 + 0.6 * j))
        b = c0 + Vector((1.5 * sx, -0.6, 0.7 + 0.6 * j))
        na = ion("D Na %d%d" % (k, j), CAT, a, 40.3, r=0.17)
        move(na, sec(41.0 + 0.5 * j), sec(43.0 + 0.5 * j), a, b)
        hide_from(na, sec(44.0 + 0.5 * j), (0.17,) * 3)
    lay = box("D Na Layer %d" % k, (1.4, 1.0, 0.25), SODIUM, c0 + Vector((1.75 * sx, -0.2, 2.35)))
    appear(lay, sec(44.5), dur=20)
    tap = cyl("D Tap %d" % k, 0.13, 0.13, 1.0, METAL, c0 + Vector((2.55 * sx, 0, 2.35)), rot=(0, math.pi / 2, 0))
    appear(tap, sec(45.0), dur=10)
for j in range(3):
    a = c0 + Vector((-0.6 + 0.6 * j, -0.95, 0.8 + 0.3 * j))
    cl = ion("D Cl %d" % j, ANI, a, 48.3, r=0.17)
    move(cl, sec(49.0 + 0.4 * j), sec(50.5 + 0.4 * j), a, c0 + Vector((0.25 * (j - 1), -0.45, 1.0 + 0.3 * j)))
    hide_from(cl, sec(51.0 + 0.4 * j), (0.17,) * 3)
bubbles("D Cl2", c0.x - 0.3, c0.x + 0.3, c0.z + 1.9, c0.z + 4.2, -0.5, 51.0, END / FPS, n=6, r=0.12, mat=CL_GAS)
big("Lbl D Na", "Na", c0 + Vector((3.6, -0.8, 2.35)), 45.5, None, mat=M["white"], size=0.5)
big("Lbl D Cl", "Cl₂", c0 + Vector((0.9, -0.8, 4.0)), 52.0, None, mat=M["green"] if "green" in M else M["white"],
    size=0.5)

# ---- E. aluminium with a glowing skin; iron with rust flakes ----
e0 = SD + Vector((0, 0, -1.2))
al = box("E Al", (2.4, 1.0, 1.2), mat_pbr("Aluminium U7", (0.8, 0.82, 0.85), metallic=0.9, roughness=0.3),
         e0 + Vector((-2.4, 0, 0)))
appear(al, sec(64.3), dur=10)
skin = box("E Skin", (2.5, 1.1, 1.3), mat_emit("Oxide Skin U7", (0.6, 0.85, 1.0), 0.8, alpha=0.25), e0 + Vector((-2.4, 0, 0)))
appear(skin, sec(66.5), dur=15)
big("Lbl E Al", "Al₂O₃ skin", e0 + Vector((-2.4, -0.8, 1.2)), 67.0, None, mat=M["cyan"], size=0.42)
fe = box("E Fe", (2.4, 1.0, 1.2), IRON, e0 + Vector((2.4, 0, 0)))
appear(fe, sec(72.3), dur=10)
for k in range(7):
    p0 = e0 + Vector((1.5 + 0.3 * k, -0.52, 0.2 + 0.15 * (k % 3)))
    fl = box("E Flake %d" % k, (0.35, 0.06, 0.28), RUST, p0)
    appear(fl, sec(73.0 + 0.4 * k), dur=8)
    if k % 2 == 0:
        move(fl, sec(77.0 + 0.3 * k), sec(79.0 + 0.3 * k), p0, p0 + Vector((0.1, -0.3, -1.0 - 0.1 * k)))
big("Lbl E Fe", "rust flakes", e0 + Vector((2.4, -0.8, 1.2)), 74.0, None, mat=M["white"], size=0.42)
finish_film()
