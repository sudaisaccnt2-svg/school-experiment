# ---- Film 401: Why atoms bond (textbook pp.92-93: 4.1 lower energy, H + H, octet & duplet rules, Fig 4.1) ----  (v4 captions)
start_film("401", "401 Why Atoms Bond", 82.5)
END = scene.frame_end
SA, SB, SC, SD, SE, SF = (Vector((40 * k, 0, 0)) for k in range(6))

shot("Cam Hill", 0, 14, SA + Vector((0, 0, -0.4)), dist=14)
shot("Cam H2", 14, 30, SB + Vector((0, 0, -0.4)), dist=13)
shot("Cam Noble", 30, 48, SC + Vector((0, 0, -0.5)), dist=21)
shot("Cam Octet", 48, 62, SD + Vector((0, 0, -0.5)), dist=12)
shot("Cam Duplet", 62, 72, SE + Vector((0, 0, -0.5)), dist=12)
shot("Cam Ways", 72, None, SF + Vector((0, 0, -0.4)), dist=16)
for name, t in (("Downhill", 0), ("H + H", 14), ("Noble gases", 30), ("Octet", 48), ("Duplet", 62), ("Lose, gain, share", 72)):
    act(name, sec(t))

say('A1', 'Things roll down to low energy', 0.1, 7)
say('A2', 'Low energy means stable', 7, 14)
say('B1', 'Two hydrogen atoms meet', 14, 21)
say('B2', 'They share and give out energy', 21, 30)
say('C1', 'Noble gases join no one', 30, 39)
say('C2', 'Full outer shells: 2 or 8', 39, 48)
say('D1', 'Oxygen has 6 outer electrons', 48, 55)
say('D2', '2 more make 8: octet rule', 55, 62)
say('E', 'Hydrogen needs just 2: duplet', 62, 72)
say('F1', 'Atoms lose, gain or share', 72, 82)

# ---- A. a ball rolls down a hill (energy goes down) ----
ramp = box("Ramp", (8.0, 1.2, 0.18), mat_pbr("Ramp", (0.25, 0.32, 0.45), roughness=0.6), SA + Vector((0, 0.3, -0.5)))
ramp.rotation_euler = (0, math.radians(18), 0)
appear(ramp, sec(0.4), sec(13.8), dur=10)
ball = sphere("Ball", 0.45, mat_pbr("Ball", (1.0, 0.55, 0.25), metallic=0.4, roughness=0.3), SA, None, 32, 16)
top, bot = SA + Vector((-3.6, 0.3, -0.5 + 3.6 * math.tan(math.radians(18)) + 0.55)), SA + Vector((3.6, 0.3, -0.5 - 3.6 * math.tan(math.radians(18)) + 0.55))
ball.location = top
appear(ball, sec(1.0), sec(13.8), s=(0.45,) * 3)
move(ball, sec(3.0), sec(6.0), top, bot, 'BEZIER')
kf(ball, "rotation_euler", sec(3.0), (0, 0, 0), 'BEZIER')
kf(ball, "rotation_euler", sec(6.0), (0, 16, 0), 'BEZIER')
big("Lbl High", "high energy", SA + Vector((-3.6, -0.6, 2.1)), 1.6, 13.8, mat=M["red"], size=0.5)
big("Lbl Low", "low energy ✓", SA + Vector((3.2, -0.6, 0.3)), 6.2, 13.8, mat=M["green"], size=0.5)

# ---- B. H + H -> H2, energy given out ----
A = LRing("B HA", "H", SB + Vector((-3.4, 0, 0.6)), 1, 14.4, 29.8, r=1.0, emat=E_BLUE, angles=[0])
Bh = LRing("B HB", "H", SB + Vector((3.4, 0, 0.6)), 1, 14.8, 29.8, r=1.0, emat=E_GOLD, angles=[180])
A.move(17.0, 20.0, SB + Vector((-0.75, 0, 0.6)))
Bh.move(17.0, 20.0, SB + Vector((0.75, 0, 0.6)))
share(A, Bh, 0, 0, 20.4)
for k, d in enumerate(((1, 0, 1), (-1, 0, 1), (1, 0, -0.6), (-1, 0, -0.6))):
    energy_wave("B Wave %d" % k, SB + Vector((0, -0.5, 0.6)) + Vector(d).normalized() * 1.6, d, 21.4 + 0.15 * k)
pulses("B Burst", SB + Vector((0, -0.4, 0.6)), None, [21.4], r=1.8, mat=M["gold"])
big("Lbl H2", "H₂", SB + Vector((0, -0.6, 2.4)), 22.4, 29.8, mat=M["gold"], size=0.7)
big("Lbl Energy", "energy out", SB + Vector((0, -0.6, -1.4)), 22.0, 29.8, mat=M["gold"], size=0.45)

# ---- C. Fig 4.1: He, Ne, Ar, Kr with full outer shells ----
for k, (z, x) in enumerate(((2, -7.0), (10, -3.3), (18, 1.4), (36, 6.8))):
    t0 = 30.4 + 1.6 * k
    vatom("C %s" % SYM[z], z, SC + Vector((x, 0, 0.6)), sec(t0), [(sec(t0), sec(t0 + 1.4))], r0=0.35, dr=0.42, e_r=0.085,
          nuc_r=0.07, ring_depth=0.012)
    sy = _text("C %s Sym" % SYM[z], SYM[z], SC + Vector((x, -0.3, -2.2)), 0.6, M["white"], weight="semibold")
    shadow(sy)
    appear(sy, sec(t0 + 0.3))
big("Lbl Two", "2", SC + Vector((-7.0, -0.6, 2.3)), 39.4, None, mat=M["gold"], size=0.65)
big("Lbl Eight", "8      8      8", SC + Vector((1.9, -0.6, 3.4)), 40.4, None, mat=M["gold"], size=0.65)

# ---- D. octet: oxygen 6 + 2 = 8 ----
O = LRing("D O", "O", SD + Vector((0, 0, 0.6)), 6, 48.4, 61.8, r=1.25, emat=E_BLUE, angles=[76, 104, -14, 14, 166, 256])
for k, a in enumerate((194, 284)):
    p = O.loc + Vector((1.25 * math.cos(math.radians(a)), 0, 1.25 * math.sin(math.radians(a))))
    e = travel("D In %d" % k, p + (p - O.loc).normalized() * 3.5, p, 54.6 + 0.8 * k, dur=1.3, lift=0.2)
    st = dot("D Seat %d" % k, 0.11, E_GOLD, O.g, (1.25 * math.cos(math.radians(a)), 1.25 * math.sin(math.radians(a)), 0.02))
    hide_until(st, sec(55.9 + 0.8 * k))
big("Lbl Six", "6", SD + Vector((-2.4, -0.6, 2.0)), 50.0, 54.4, mat=M["cyan"], size=0.6)
big("Lbl Eight O", "8 ✓", SD + Vector((-2.4, -0.6, 2.0)), 57.6, 61.8, mat=M["green"], size=0.6)

# ---- E. duplet: H gets a second electron, like helium ----
Hd = LRing("E H", "H", SE + Vector((-1.8, 0, 0.6)), 1, 62.4, 71.8, r=0.95, angles=[0])
p = Hd.loc + Vector((-0.95, 0, 0))
travel("E In", p + Vector((-3.0, 0, 0.4)), p, 64.6, dur=1.2, lift=0.3)
st = dot("E Seat", 0.11, E_GOLD, Hd.g, (-0.95, 0, 0.02))
hide_until(st, sec(65.8))
vatom("E He", 2, SE + Vector((2.4, 0, 0.6)), sec(63.0), [(sec(63.0), sec(64.0))], r0=0.95, e_r=0.11, nuc_r=0.08)
big("Lbl Like", "2 = like helium ✓", SE + Vector((0, -0.6, 2.0)), 66.4, 71.8, mat=M["green"], size=0.5)

# ---- F. lose, gain, share ----
for k, (txt, x, col) in enumerate((("lose", -5.0, M["red"]), ("gain", 0.0, M["cyan"]), ("share", 5.0, M["gold"]))):
    big("Lbl Way %d" % k, txt, SF + Vector((x, -0.6, 2.4)), 73.4 + 2.0 * k, None, mat=col, size=0.6)
L1 = LRing("F Lose", "Na", SF + Vector((-5.0, 0, 0.4)), 1, 72.6, None, r=1.0, angles=[0])
L1.seat(0, 73.8, SF + Vector((-2.8, 0, 0.9)), dur=1.2)
L2 = LRing("F Gain", "Cl", SF + Vector((0, 0, 0.4)), 7, 72.9, None, r=1.0, emat=E_GOLD)
p = SF + Vector((-1.0 * math.cos(math.radians(14)), 0, 0.4 - 1.0 * math.sin(math.radians(14))))
travel("F In", SF + Vector((-2.2, 0, 1.4)), p, 75.8, dur=1.0, lift=0.2)
st = dot("F Seat", 0.11, E_BLUE, L2.g, (-math.cos(math.radians(14)), -math.sin(math.radians(14)), 0.02))
hide_until(st, sec(76.8))
S1 = LRing("F S1", "H", SF + Vector((3.6, 0, 0.4)), 1, 73.2, None, r=0.8, angles=[0])
S2 = LRing("F S2", "H", SF + Vector((6.4, 0, 0.4)), 1, 73.2, None, r=0.8, emat=E_GOLD, angles=[180])
S1.move(77.6, 79.2, SF + Vector((4.4, 0, 0.4)))
S2.move(77.6, 79.2, SF + Vector((5.6, 0, 0.4)))
share(S1, S2, 0, 0, 79.4)
ring_flash("D Full", O.g, 1.25, 57.4)                 # v4: the full shell flashes
ring_flash("E Full", Hd.g, 0.95, 66.2)
finish_film()
