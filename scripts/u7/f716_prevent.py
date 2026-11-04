# ---- Film 716: Preventing corrosion (textbook pp.208-209: six ways: (a) remove stains, (b) paints and coatings  (v4 captions)
# (stabilizers), (c) alloying: stainless steel = iron + chromium + nickel, (d) metallic coating or plating: galvanizing
# (zinc by dipping), nickel, chromium, tin plating, (e) corrosion inhibitors (glycine, polyethylene), (f) cathodic
# protection: magnesium or zinc wired to buried pipes and tanks gives up its electrons instead of iron; ships: titanium
# bars on the hull (as printed), Fig 7.12) ----
start_film("716", "716 Preventing Corrosion", 80.5)
END = scene.frame_end
ST = [Vector((40 * k, 0, 0)) for k in range(7)]
TS = (0, 11, 22, 34, 46, 56, 70)

names = ("Stains", "Paint", "Alloys", "Metal coating", "Inhibitors", "Cathodic protection", "Ships")
for k, t in enumerate(TS):
    shot("Cam %d" % k, t, TS[k + 1] if k + 1 < len(TS) else None, ST[k] + Vector((0, 0, -1.0)), dist=13, pitch=0.12)
    act(names[k], sec(t))

say('A1', 'Clean off stains', 0.1, 11)
say('B1', 'Paint keeps water and air out', 11, 22)
say('C1', 'Stainless steel resists rust', 22, 34)
say('D1', 'Zinc coat: galvanizing', 34, 41)
say('D2', 'Nickel, chromium, tin plating', 41, 46)
say('E1', 'Inhibitors cover the surface', 46, 56)
say('F1', 'Magnesium wired to the pipe', 56, 62)
say('F2', 'Magnesium dissolves, iron is safe', 62, 70)
say('G1', 'Bars on ships rust instead', 70, 80)

# ---- A. stain wiped off ----
s = ST[0] + Vector((0, 0, -1.2))
pl = box("A Plate", (4.0, 0.3, 2.0), IRON, s)
appear(pl, sec(0.3), dur=10)
st = sphere("A Stain", 1.0, RUST, s + Vector((0.3, -0.17, 0.1)), None, 24, 12)
appear(st, sec(1.0), s=(0.7, 0.05, 0.45))
cloth = box("A Cloth", (0.8, 0.2, 0.6), mat_pbr("Cloth U7", (0.9, 0.9, 0.85), roughness=0.9), s + Vector((-1.6, -0.35, 0.1)))
appear(cloth, sec(4.0), dur=8)
keys_bulk(cloth, "location", [sec(5.0), sec(6.0), sec(7.0), sec(8.0)],
          [s + Vector((-1.6, -0.35, 0.1)), s + Vector((1.0, -0.35, 0.2)), s + Vector((-0.4, -0.35, 0.0)), s + Vector((0.9, -0.35, 0.1))], 'BEZIER')
hide_from(st, sec(8.0), (0.7, 0.05, 0.45))
hide_from(cloth, sec(9.5))

# ---- B. paint flows over ----
s = ST[1] + Vector((0, 0, -1.2))
pl = box("B Plate", (4.0, 0.3, 2.0), IRON, s)
appear(pl, sec(11.3), dur=10)
paint = box("B Paint", (4.05, 0.34, 2.05), mat_pbr("Paint U7", (0.1, 0.45, 0.9), roughness=0.35), s)
kf(paint, "scale", 0, (0.001, 1, 1))
kf(paint, "scale", sec(13.5), (0.001, 1, 1))
kf(paint, "scale", sec(16.5), (1, 1, 1))
for k in range(4):
    d = sphere("B Drop %d" % k, 0.12, WATER, s + Vector((-1.2 + 0.8 * k, -0.6, 2.4)), None, 12, 6)
    appear(d, sec(17.0 + 0.2 * k), s=(0.12,) * 3)
    move(d, sec(17.5 + 0.2 * k), sec(18.5 + 0.2 * k), s + Vector((-1.2 + 0.8 * k, -0.6, 2.4)), s + Vector((-1.2 + 0.8 * k, -0.6, 1.15)))
    move(d, sec(18.6 + 0.2 * k), sec(19.6 + 0.2 * k), s + Vector((-1.2 + 0.8 * k, -0.6, 1.15)), s + Vector((-1.6 + 1.0 * k, -0.9, 2.2)))
big("Lbl B", "paint", s + Vector((0, -0.6, 1.6)), 16.5, None, mat=M["white"], size=0.45)

# ---- C. stainless steel: a grid of Fe with Cr and Ni ----
s = ST[2] + Vector((0, 0, -0.6))
k = 0
for iz in range(3):
    for ix in range(5):
        sym = "Cr" if (ix + iz) % 4 == 1 else ("Ni" if (ix + 2 * iz) % 5 == 3 else "Fe")
        col = {"Fe": IRON, "Cr": cpk_mat("Cr"), "Ni": mat_pbr("CPK Ni", (0.6, 0.85, 0.6), roughness=0.3)}[sym]
        sp = sphere("C %s %d" % (sym, k), 0.42, col, s + Vector((-1.8 + 0.9 * ix, 0, -0.9 + 0.9 * iz)), None, 20, 10)
        appear(sp, sec(22.3 + 0.08 * k), s=(0.42,) * 3)
        k += 1
big("Lbl C Fe", "Fe", s + Vector((-3.0, -0.6, 0.5)), 24.0, None, mat=M["white"], size=0.45)
big("Lbl C Cr", "Cr", s + Vector((3.0, -0.6, 0.9)), 24.6, None, mat=M["green"] if "green" in M else M["white"], size=0.45)
big("Lbl C Ni", "Ni", s + Vector((3.0, -0.6, -0.4)), 25.2, None, mat=M["white"], size=0.45)

# ---- D. dip in zinc ----
s = ST[3] + Vector((0, 0, -2.2))
tank("D", s, 3.6, 1.8, 1.4, 34.3, liq_mat=mat_emit("Molten Zinc U7", (0.75, 0.8, 0.85), 0.5, alpha=0.6))
rod = box("D Rod", (0.6, 0.3, 2.4), IRON, s + Vector((0, 0, 4.0)))
appear(rod, sec(34.6), dur=10)
move(rod, sec(36.0), sec(37.5), s + Vector((0, 0, 4.0)), s + Vector((0, 0, 1.0)))
move(rod, sec(38.5), sec(40.0), s + Vector((0, 0, 1.0)), s + Vector((0, 0, 3.4)))
coat = box("D Coat", (0.66, 0.36, 2.44), ZINC, s + Vector((0, 0, 3.4)))
appear(coat, sec(40.0), dur=6)
big("Lbl D", "zinc coat", s + Vector((1.9, -0.6, 3.6)), 40.3, None, mat=M["white"], size=0.42)

# ---- E. inhibitor molecules settle on the surface ----
s = ST[4] + Vector((0, 0, -1.2))
pl = box("E Plate", (4.6, 1.2, 0.4), IRON, s)
appear(pl, sec(46.3), dur=10)
for k in range(9):
    a = s + Vector((-2.0 + 0.5 * k, -0.2, 2.2 + 0.3 * (k % 3)))
    b = s + Vector((-2.0 + 0.5 * k, -0.2, 0.38))
    m = sphere("E Inh %d" % k, 0.2, mat_emit("Inhibitor U7", (0.6, 1.0, 0.7), 1.2), a, None, 14, 7)
    appear(m, sec(47.0 + 0.15 * k), s=(0.2,) * 3)
    move(m, sec(48.5 + 0.2 * k), sec(50.0 + 0.2 * k), a, b)
big("Lbl E", "protective film", s + Vector((0, -0.8, 1.2)), 51.5, None, mat=M["gold"], size=0.42)

# ---- F. buried pipe + Mg block ----
s = ST[5] + Vector((0, 0, -1.6))
soil = box("F Soil", (8.0, 1.6, 2.6), mat_pbr("Soil U7", (0.28, 0.16, 0.08), roughness=1.0), s + Vector((0, 0.9, 0.3)))
appear(soil, sec(56.3), dur=10)
pipe = cyl("F Pipe", 0.45, 0.45, 6.0, IRON, s + Vector((-0.6, 0, 0)), rot=(0, math.pi / 2, 0))
appear(pipe, sec(56.6), dur=10)
mg = box("F Mg", (0.9, 0.7, 0.9), mat_pbr("Magnesium U7", (0.85, 0.85, 0.82), metallic=0.8, roughness=0.3),
         s + Vector((3.4, 0, 1.3)))
appear(mg, sec(57.5), dur=10)
kf(mg, "scale", sec(63.0), (1, 1, 1))
kf(mg, "scale", sec(70.0), (0.55, 0.55, 0.55))
wpts = [s + Vector((3.4, -0.1, 1.3)), s + Vector((1.6, -0.1, 1.3)), s + Vector((1.6, -0.1, 0.45))]
wire("F Wire", wpts, 58.0)
flow("F e", wpts, 62.5, 70.0, n=4, speed=0.9)
big("Lbl F Mg", "Mg", s + Vector((3.4, -0.8, 2.3)), 58.5, None, mat=M["white"], size=0.45)
big("Lbl F P", "iron pipe", s + Vector((-1.4, -0.8, 0.9)), 57.5, None, mat=M["white"], size=0.42)

# ---- G. ship hull with bars in the sea ----
s = ST[6] + Vector((0, 0, -1.2))
sea = box("G Sea", (9.0, 3.0, 1.6), mat_emit("Sea U7", (0.1, 0.35, 0.7), 0.4, alpha=0.5), s + Vector((0, 0.6, -0.6)))
appear(sea, sec(70.3), dur=10)
hull = box("G Hull", (5.0, 1.4, 1.6), mat_pbr("Hull U7", (0.25, 0.27, 0.3), metallic=0.6, roughness=0.5), s + Vector((0, 0, 0)))
appear(hull, sec(70.6), dur=10)
deck = box("G Deck", (3.0, 1.2, 0.8), mat_pbr("Deck U7", (0.9, 0.9, 0.88), roughness=0.5), s + Vector((-0.4, 0, 1.2)))
appear(deck, sec(70.8), dur=10)
for k in range(3):
    bb = box("G Bar %d" % k, (0.6, 0.12, 0.25), TIN, s + Vector((-1.5 + 1.5 * k, -0.76, -0.45)))
    appear(bb, sec(72.0 + 0.4 * k), dur=8)
big("Lbl G", "bars on the hull", s + Vector((0, -1.0, 2.3)), 73.5, None, mat=M["gold"], size=0.42)
finish_film()
