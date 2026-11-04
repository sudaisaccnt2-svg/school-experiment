# ---- Film 814: Noble metals (textbook pp.236-239: 8.1.5 transition metals have high ionization energies, low
# reactivity; noble metals resist oxidation and corrosion in moist air: Ru, Rh, Pd, Ag, Os, Ir, Pt, Au (some include Hg,
# Re, Cu), Fig 8.4; relatively inert, found free; valuable for inertness, rarity, use; commercial value: (i) silver:
# soft white, mixed with copper for coins, jewellery, tableware, silver halides in photography, best conductor and
# reflector; (ii) platinum 'little silver', 72nd most common, heavy, soft, malleable, m.p. 1770 °C, catalytic
# converters, jewellery, dental fillings, surgical tools; (iii) gold: lustre, colour, too soft pure → alloyed with Cu,
# Ag, Pt; coins of old, computers, dental crowns; STS: coins usually Cu–Ni alloy) (v4) ----
start_film("814", "814 Noble Metals", 80.5)
END = scene.frame_end
S = [Vector((40 * k, 0, 0)) for k in range(10)]

shot("Cam Row", 0, 10, S[0] + Vector((0, 0, -0.4)), dist=12, pitch=0.04)
shot("Cam Rust", 10, 18, S[1] + Vector((0, 0, -0.6)), dist=10, pitch=0.06)
shot("Cam Silver", 18, 26, S[2] + Vector((0, 0, -0.6)), dist=9, pitch=0.08)
shot("Cam Mirror", 26, 34, S[3] + Vector((0, 0, -0.6)), dist=10, pitch=0.06)
shot("Cam Exhaust", 34, 42, S[4] + Vector((0, 0, -0.6)), dist=10, pitch=0.06)
shot("Cam Pt Ring", 42, 48, S[5] + Vector((0, 0, -0.6)), dist=8, pitch=0.08)
shot("Cam Gold Bend", 48, 56, S[6] + Vector((0, 0, -0.6)), dist=9, pitch=0.06)
shot("Cam Gold Mix", 56, 64, S[7] + Vector((0, 0, -0.6)), dist=9, pitch=0.06)
shot("Cam Chip", 64, 72, S[8] + Vector((0, 0, -0.6)), dist=9, pitch=0.12)
shot("Cam Coin", 72, None, S[9] + Vector((0, 0, -0.6)), dist=8, pitch=0.06)
for name, t in (("Noble metals", 0), ("Silver", 18), ("Platinum", 34), ("Gold", 48), ("Coins", 72)):
    act(name, sec(t))

say('A1', 'Eight noble metals', 0.1, 10)
say('B1', 'Iron rusts, gold does not', 10, 18)
say('C1', 'Silver: coins and jewellery', 18, 26)
say('C2', 'Best conductor, best mirror', 26, 34)
say('D1', 'Platinum cleans car exhaust', 34, 42)
say('D2', 'Platinum rings and tools', 42, 48)
say('E1', 'Pure gold is too soft', 48, 56)
say('E2', 'Add copper: stronger gold', 56, 64)
say('E3', 'Gold wires in computers', 64, 72)
say('F1', 'Coins: copper-nickel alloy', 72, 80)

for k, sy in enumerate(("Ru", "Rh", "Pd", "Ag", "Os", "Ir", "Pt", "Au")):
    tile("A %s" % sy, sy, S[0] + Vector((-3.0 + 2.0 * (k % 4), 0, 0.9 - 1.6 * (k // 4))), "metal", 0.4 + 0.5 * k)
    mat = AU_M if sy == "Au" else AG_M if sy in ("Ag", "Pd", "Rh") else PT_M
    lump("A L %s" % sy, S[0] + Vector((-3.0 + 2.0 * (k % 4), -0.3, 0.9 - 1.6 * (k // 4) - 0.75)), 0.22, mat, 0.6 + 0.5 * k,
         seed=k)

b0 = S[1] + Vector((0, 0, -1.0))
nail = box("B Nail", (2.4, 0.3, 0.3), IRON, b0 + Vector((-1.8, 0, 0)))
appear(nail, sec(10.3), dur=10)
rnd = random.Random(814)
for k in range(8):
    rr = 0.12 + 0.05 * rnd.random()
    sp = sphere("B Rust %d" % k, rr, RUST, b0 + Vector((-2.8 + 0.28 * k, -0.15, 0.12 * (k % 2))), None, 12, 6)
    appear(sp, sec(11.5 + 0.3 * k), s=(rr,) * 3)
gold = lump("B Au", b0 + Vector((1.8, 0, 0)), 0.55, AU_M, 10.6, seed=4)
for k in range(3):
    flash("B Shine %d" % k, b0 + Vector((2.0, -0.6, 0.3)), sec(12.0 + 2.0 * k), 0.25)
big("Lbl B Fe", "Fe", b0 + Vector((-1.8, -0.8, 1.2)), 10.6, None, size=0.5)
big("Lbl B Au", "Au", b0 + Vector((1.8, -0.8, 1.2)), 10.8, None, size=0.5)

c0 = S[2] + Vector((0, 0, -0.9))
coin = cyl("C Coin", 0.7, 0.7, 0.1, AG_M, c0 + Vector((-1.3, 0, 0)), None, rot=(math.pi / 2, 0, 0))
appear(coin, sec(18.3), dur=10)
turn(coin, 18.5, 26.0, 1.0, axis=1)
ring = ring_curve("C Ring", 0.55, AG_M, None, depth=0.12, loc=c0 + Vector((1.4, 0, 0)))
ring.rotation_euler = (math.pi / 2, 0, 0)
appear(ring, sec(19.0), dur=10)
big("Lbl C", "Ag + Cu", c0 + Vector((0, -0.8, 1.4)), 20.0, None, mat=M["gold"], size=0.5)

m0 = S[3] + Vector((1.0, 0, -0.6))
mir = box("M Mirror", (0.15, 1.4, 2.2), AG_M, m0)
mir.rotation_euler = (0, 0, 0.6)
appear(mir, sec(26.3), dur=12)
beam("M In", S[3] + Vector((-3.6, -0.2, 0.6)), m0 + Vector((-0.1, -0.2, 0.0)), 27.5, None, r=0.05)
beam("M Out", m0 + Vector((-0.1, -0.2, 0.0)), S[3] + Vector((-3.0, -0.2, -2.0)), 28.5, None, r=0.05)
big("Lbl M", "Ag", m0 + Vector((0, -0.8, 1.6)), 27.0, None, mat=M["gold"], size=0.5)

e0 = S[4] + Vector((0, 0, -0.6))
pipe = cyl("E Pipe", 0.35, 0.35, 5.6, METAL, e0, None, rot=(0, math.pi / 2, 0))
appear(pipe, sec(34.3), dur=12)
cat_ = box("E Converter", (1.4, 1.0, 1.0), PT_M, e0)
appear(cat_, sec(34.6), dur=12)
dirty = mat_emit("Smoke U8", (0.25, 0.22, 0.2), 0.6)
clean = mat_emit("Clean Gas U8", (0.75, 0.9, 1.0), 1.5)
for k in range(8):
    t = 35.5 + 0.7 * k
    a = e0 + Vector((-2.8, -0.5, 0.1 * (k % 3) - 0.1))
    sm = sphere("E Smoke %d" % k, 0.15, dirty, a, None, 12, 6)
    hide_until(sm, sec(t))
    move(sm, sec(t), sec(t + 1.6), a, e0 + Vector((-0.4, -0.5, 0)), 'LINEAR')
    hide_from(sm, sec(t + 1.6), (1, 1, 1))
    cl = sphere("E Clean %d" % k, 0.12, clean, e0 + Vector((0.4, -0.5, 0)), None, 12, 6)
    hide_until(cl, sec(t + 1.6))
    move(cl, sec(t + 1.6), sec(t + 3.2), e0 + Vector((0.4, -0.5, 0)), e0 + Vector((3.2, -0.5, 0.1 * (k % 3))), 'LINEAR')
    hide_from(cl, sec(t + 3.2), (1, 1, 1))
big("Lbl E", "Pt", e0 + Vector((0, -0.8, 0.95)), 35.0, None, mat=M["gold"], size=0.5)

pr = ring_curve("P Ring", 0.7, PT_M, None, depth=0.15, loc=S[5] + Vector((0, 0, -0.5)))
pr.rotation_euler = (math.pi / 2, 0, 0)
appear(pr, sec(42.3), dur=10)
turn(pr, 42.5, 48.0, 0.5, axis=1)
flash("P Shine", S[5] + Vector((0.5, -0.3, 0.0)), sec(44.0), 0.25)

g0 = S[6] + Vector((0, 0, -0.6))
gl = empty("G Left", g0 + Vector((-0.02, 0, 0)))
gr = empty("G Right", g0 + Vector((0.02, 0, 0)))
box("G L Bar", (1.5, 0.5, 0.4), AU_M, (-0.75, 0, 0), gl)
box("G R Bar", (1.5, 0.5, 0.4), AU_M, (0.75, 0, 0), gr)
for o in (gl, gr):
    appear(o, sec(48.3), dur=12)
kf(gl, "rotation_euler", sec(50.0), (0, 0, 0), 'BEZIER')
kf(gl, "rotation_euler", sec(52.5), (0, -0.35, 0), 'BEZIER')
kf(gr, "rotation_euler", sec(50.0), (0, 0, 0), 'BEZIER')
kf(gr, "rotation_euler", sec(52.5), (0, 0.35, 0), 'BEZIER')
big("Lbl G", "24 carat: soft", g0 + Vector((0, -0.8, 1.3)), 50.5, None, mat=M["gold"], size=0.5)

h0 = S[7] + Vector((0, 0, -0.8))
ga = lump("H Au", h0 + Vector((-1.6, 0, 0)), 0.55, AU_M, 56.3)
gc = lump("H Cu", h0 + Vector((1.6, 0, 0)), 0.4, COPPER, 56.5, seed=3)
move(ga, sec(57.5), sec(59.0), h0 + Vector((-1.6, 0, 0)), h0 + Vector((-0.3, 0, 0)))
move(gc, sec(57.5), sec(59.0), h0 + Vector((1.6, 0, 0)), h0 + Vector((0.3, 0, 0)))
for o in (ga, gc):
    dissolve_out(o, 59.2, 0.6)
alloy = box("H Alloy", (2.0, 0.6, 0.45), mat_pbr("Rose Gold U8", (1.0, 0.62, 0.38), metallic=1.0, roughness=0.15), h0)
appear(alloy, sec(59.6), dur=12)
big("Lbl H", "Au + Cu", h0 + Vector((0, -0.8, 1.2)), 60.0, None, mat=M["gold"], size=0.5)

c8 = S[8] + Vector((0, 0, -0.4))
chip = box("I Chip", (2.4, 2.4, 0.25), mat_pbr("Chip U8", (0.08, 0.1, 0.12), roughness=0.4), c8)
chip.rotation_euler = (0.9, 0, 0)
appear(chip, sec(64.3), dur=12)
for k in range(6):
    for s_ in (-1, 1):
        pin = box("I Pin %d %d" % (k, s_), (0.12, 0.5, 0.05), AU_M, (-1.0 + 0.4 * k, 1.3 * s_, 0))
        pin.parent = chip
        appear(pin, sec(65.0 + 0.1 * k))
big("Lbl I", "Au", c8 + Vector((0, -1.4, 1.4)), 66.0, None, mat=M["gold"], size=0.55)

cn = cyl("J Coin", 0.9, 0.9, 0.12, mat_pbr("CuNi U8", (0.78, 0.7, 0.6), metallic=1.0, roughness=0.25), S[9] + Vector((0, 0, -0.5)),
         None, rot=(math.pi / 2, 0, 0))
appear(cn, sec(72.3), dur=10)
turn(cn, 72.5, 80.0, 1.0, axis=1)
big("Lbl J", "Cu + Ni", S[9] + Vector((0, -0.8, 0.85)), 73.5, None, mat=M["gold"], size=0.5)
finish_film()
