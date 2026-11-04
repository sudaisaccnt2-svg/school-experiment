# ---- Film 812: Uses of magnesium and calcium (textbook p.235: (i) magnesium: light, tough alloys (duralumin: Al, Cu,
# Mg, Mn; magnalium: Al, Mg) for aircraft, cars, machine parts; flashlight powder, flames, fireworks; deoxidant in
# metallurgy, extraction of titanium and uranium; MgO with clay → refractory furnace bricks; MgSO₄ in textile, paper,
# soap, medicines; (ii) calcium: deoxidant in steel castings and copper alloys; making CaF₂ and CaH₂, extracting
# uranium; lime (CaO) on soil to lower acidity, water softening, pollution control, pulp, paper, sugar, glass; steel) (v4) ----
start_film("812", "812 Uses of Mg and Ca", 56.5)
END = scene.frame_end
S = [Vector((40 * k, 0, 0)) for k in range(7)]
for k in range(7):
    shot("Cam U%d" % k, 8 * k, None if k == 6 else 8 * (k + 1), S[k] + Vector((0, 0, -0.6)), dist=10, pitch=0.06)
for name, t in (("Uses of magnesium", 0), ("Uses of calcium", 40)):
    act(name, sec(t))

say('A', 'Light alloys build aircraft', 0.1, 8)
say('B', 'Flashes and fireworks', 8, 16)
say('C', 'Frees titanium and uranium', 16, 24)
say('D', 'MgO bricks line furnaces', 24, 32)
say('E', 'MgSO₄: paper, soap, medicine', 32, 40)
say('F', 'Calcium cleans steel', 40, 48)
say('G', 'Lime makes soil less acidic', 48, 56)

# 1 a small plane
p0 = S[0] + Vector((0, 0, -0.4))
pl = empty("A Plane", p0, rot=(-0.6, 0, 0.25))
body = mat_pbr("Duralumin U8", (0.8, 0.82, 0.86), metallic=0.9, roughness=0.25)
cyl("A Body", 0.32, 0.22, 4.0, body, (0, 0, 0), pl, rot=(0, math.pi / 2, 0))
box("A Wing", (0.8, 4.2, 0.08), body, (0.2, 0, 0), pl)
box("A Tail", (0.4, 1.4, 0.06), body, (-1.8, 0, 0.1), pl)
box("A Fin", (0.4, 0.06, 0.7), body, (-1.8, 0, 0.4), pl)
appear(pl, sec(0.4), dur=14)
move(pl, sec(0.4), sec(8.0), p0 + Vector((-1.0, 0, -0.3)), p0 + Vector((1.0, 0, 0.3)), 'LINEAR')
big("Lbl A", "Mg + Al alloy", S[0] + Vector((0, -0.8, 1.2)), 2.0, None, mat=M["gold"], size=0.5)

# 2 fireworks: white bursts
for k in range(6):
    c = S[1] + Vector((-2.4 + 1.0 * k, 0, -0.2 + 0.5 * ((k * 5) % 3)))
    flash("B Burst %d" % k, c, sec(9.0 + 0.9 * k), 0.7, dur=24)
    for j in range(6):
        ang = 2 * math.pi * j / 6
        energy_wave("B Spark %d %d" % (k, j), c, (math.cos(ang), 0, math.sin(ang)), 9.1 + 0.9 * k, dist=1.0, dur=1.6)

# 3 titanium freed
lump("C Ti", S[2] + Vector((0, 0, -1.0)), 0.8, mat_pbr("Titanium U8", (0.72, 0.73, 0.78), metallic=1.0, roughness=0.2), 16.6)
big("Lbl C", "Ti · U", S[2] + Vector((0, -0.8, 0.8)), 17.4, None, mat=M["gold"], size=0.55)

# 4 a furnace lined with white bricks
d0 = S[3] + Vector((0, 0, -1.8))
for r in range(4):
    for c in range(5):
        x = -2.2 + 1.1 * c + (0.55 if r % 2 else 0)
        if x > 2.4:
            continue
        b = box("D Brick %d %d" % (r, c), (1.0, 0.5, 0.48), CHALK, d0 + Vector((x, 0, 0.25 + 0.52 * r)))
        appear(b, sec(24.3 + 0.08 * (r * 5 + c)))
cflame("D Fire", d0 + Vector((0, -0.6, 0.3)), (1.0, 0.45, 0.1), 26.0, None, s=1.2)
big("Lbl D", "MgO", d0 + Vector((0, -0.9, 2.65)), 26.5, None, mat=M["gold"], size=0.55)

# 5 MgSO₄: paper, soap, a medicine bottle
e0 = S[4] + Vector((0, 0, -1.4))
paper = box("E Paper", (1.3, 0.04, 1.7), mat_pbr("Paper U8", (0.95, 0.95, 0.92), roughness=0.8), e0 + Vector((-2.6, 0, 0.6)))
appear(paper, sec(32.4))
soap = box("E Soap", (1.2, 0.6, 0.6), mat_pbr("Soap U8", (0.95, 0.75, 0.85), roughness=0.4), e0 + Vector((0, 0, 0.1)))
appear(soap, sec(32.8))
bt = cflask("E Med", e0 + Vector((2.6, 0, -0.2)), 33.2, mat_emit("Medicine U8", (0.6, 0.85, 1.0), 0.6, alpha=0.4), s=0.7)
big("Lbl E", "MgSO₄", S[4] + Vector((0, -0.8, 1.4)), 34.0, None, mat=M["gold"], size=0.55)

# 6 a steel ingot; calcium takes the oxygen out
f0 = S[5] + Vector((0, 0, -1.2))
ing = box("F Ingot", (3.0, 1.0, 0.9), mat_pbr("Steel Ingot U8", (0.55, 0.57, 0.6), metallic=0.9, roughness=0.35), f0)
appear(ing, sec(40.3), dur=12)
for k in range(5):
    p = f0 + Vector((-1.2 + 0.6 * k, -0.6, 0.1))
    o = sphere("F O %d" % k, 0.13, cpk_mat("O"), p, None, 12, 6)
    appear(o, sec(41.0 + 0.1 * k), s=(0.13,) * 3)
    move(o, sec(43.0 + 0.3 * k), sec(44.5 + 0.3 * k), p, f0 + Vector((2.6, -0.6, 1.4)))
lump("F Ca", f0 + Vector((2.7, -0.2, 1.4)), 0.35, mat_pbr("Calcium U8", (0.9, 0.9, 0.88), metallic=0.85, roughness=0.3), 42.0)
big("Lbl F", "Ca", f0 + Vector((2.7, -0.8, 2.2)), 42.4, None, mat=M["gold"], size=0.5)

# 7 lime on soil
g0 = S[6] + Vector((0, 0, -1.2))
soil = box("G Soil", (5.0, 2.0, 0.6), mat_pbr("Soil U8", (0.3, 0.18, 0.08), roughness=0.95), g0)
appear(soil, sec(48.3), dur=12)
rnd = random.Random(812)
for k in range(14):
    p = g0 + Vector((rnd.uniform(-2.0, 2.0), -0.3, 2.2 + rnd.uniform(0, 0.6)))
    d = sphere("G Lime %d" % k, 0.08, SALT_W, p, None, 10, 5)
    appear(d, sec(49.5 + 0.1 * k), s=(0.08,) * 3)
    move(d, sec(49.8 + 0.1 * k), sec(51.0 + 0.1 * k), p, Vector((p.x, p.y, g0.z + 0.35)))
big("Lbl G", "CaO", g0 + Vector((0, -0.9, 2.2)), 49.0, None, mat=M["gold"], size=0.55)
finish_film()
