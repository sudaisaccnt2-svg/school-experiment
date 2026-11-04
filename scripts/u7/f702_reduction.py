# ---- Film 702: Reduction and redox (textbook pp.184-185: reduction (a) removal of oxygen 2HgO → 2Hg + O₂, (b) addition  (v4 captions)
# of hydrogen N₂ + 3H₂ → 2NH₃, (c) addition of electrons Sn⁴⁺ + 2e⁻ → Sn²⁺; Na + Cl redox 2Na + Cl₂ → 2NaCl; firefly) ----
start_film("702", "702 Reduction", 68.5)
END = scene.frame_end
SA, SB, SC, SD, SE = (Vector((40 * k, 0, 0)) for k in range(5))

shot("Cam Oxygen", 0, 16, SA + Vector((0, 0, -0.5)), dist=14, pitch=0.08)
shot("Cam Hydrogen", 16, 30, SB + Vector((0, 0, -0.6)), dist=12, pitch=0.08)
shot("Cam Electrons", 30, 44, SC + Vector((0, 0, -0.6)), dist=11, pitch=0.08)
shot("Cam Redox", 44, 60, SD + Vector((0, 0, -0.6)), dist=12, pitch=0.08)
shot("Cam Firefly", 60, None, SE + Vector((0, 0, -0.6)), dist=11, pitch=0.08)
for name, t in (("Lose oxygen", 0), ("Gain hydrogen", 16), ("Gain electrons", 30), ("Redox", 44), ("Firefly", 60)):
    act(name, sec(t))

say('A1', 'Heat mercury oxide', 0.1, 8)
say('A2', 'Oxygen leaves: reduced to Hg', 8, 16)
say('B1', 'Nitrogen gains hydrogen', 16, 23)
say('B2', 'Reduced to ammonia: NH₃', 23, 30)
say('C1', 'Sn⁴⁺ takes two electrons', 30, 37)
say('C2', 'Gaining electrons: Sn²⁺, reduced', 37, 44)
say('D1', 'Sodium gives chlorine one', 44, 52)
say('D2', 'Both at once: redox', 52, 60)
say('E1', 'Fireflies glow by oxidation', 60, 68)

# ---- A. HgO pairs over a flame; the O atoms leave as O₂ ----
a0 = SA + Vector((0, 0, -0.9))
flame("A Flame", a0 + Vector((0, 0, -1.25)), 2.0, 16.0, s=0.6)
hg = [A("A Hg%d" % k, "Hg", a0 + Vector((-1.5 + 3.0 * k, 0, 0)), 0.4 + 0.3 * k) for k in range(2)]
ox = [A("A O%d" % k, "O", a0 + Vector((-0.66 + 3.0 * k, 0, 0)), 0.6 + 0.3 * k) for k in range(2)]
for k in range(2):
    mv(ox[k], 5.0, 7.5, a0 + Vector((-0.66 + 3.0 * k, 0, 0)), a0 + Vector((-0.38 + 0.76 * k, 0, 1.2)))
    mv(hg[k], 5.5, 7.5, a0 + Vector((-1.5 + 3.0 * k, 0, 0)), a0 + Vector((-2.4 + 4.8 * k, 0, -0.3)))
big("Lbl A O", "O₂ leaves", a0 + Vector((0, -0.6, 2.1)), 8.0, None, mat=M["white"], size=0.45)
big("Lbl A Hg", "Hg: reduced", a0 + Vector((-2.4, -0.6, 0.9)), 9.0, None, mat=M["gold"], size=0.45)

# ---- B. N₂ + 3H₂ → 2NH₃ ----
b0 = SB + Vector((0, 0, -0.6))
nA = A("B N0", "N", b0 + Vector((-0.4, 0, 0)), 16.3)
nB = A("B N1", "N", b0 + Vector((0.4, 0, 0)), 16.3)
mv(nA, 19.0, 21.0, b0 + Vector((-0.4, 0, 0)), b0 + Vector((-2.0, 0, 0)))
mv(nB, 19.0, 21.0, b0 + Vector((0.4, 0, 0)), b0 + Vector((2.0, 0, 0)))
offs = ((-0.65, 0, 0.45), (0.65, 0, 0.45), (0, 0, -0.75))
for side, cx in ((0, -2.0), (1, 2.0)):
    for k, v in enumerate(offs):
        start = b0 + Vector((cx * 1.6, 0, 1.6 - 1.1 * k))
        h = A("B H%d%d" % (side, k), "H", start, 16.8 + 0.2 * k)
        mv(h, 20.5 + 0.4 * k, 22.0 + 0.4 * k, start, b0 + Vector((cx, 0, 0)) + Vector(v))
big("Lbl B 1", "NH₃", b0 + Vector((-2.0, -0.6, 1.4)), 23.5, None, mat=M["white"], size=0.45)
big("Lbl B 2", "N gained H → reduced", b0 + Vector((0, -0.6, 2.4)), 24.0, None, mat=M["gold"], size=0.45)

# ---- C. Sn⁴⁺ + 2e⁻ → Sn²⁺ ----
c0 = SC + Vector((0, 0, -0.6))
A("C Sn", "Sn", c0 + Vector((0.8, 0, 0)), 30.3, k=1.4)
badge("C B4", "4+", c0 + Vector((0.8, -0.6, 1.3)), 31.0, 39.2)
for k in range(2):
    el = electron("C e %d" % k, None, c0 + Vector((-3.0, -0.4, 0.3 * k)), 0.13, mat=E_BLUE)
    appear(el, sec(32.0 + 0.3 * k), s=tuple(el.scale))
    move(el, sec(35.5 + 0.6 * k), sec(37.5 + 0.6 * k), c0 + Vector((-3.0, -0.4, 0.3 * k)),
         c0 + Vector((0.0, -0.75, 0.3 * k)))
    hide_from(el, sec(38.6))
big("Lbl C e", "2e⁻", c0 + Vector((-3.0, -0.6, 1.0)), 32.6, 35.5, mat=M["cyan"], size=0.5)
badge("C B2", "2+", c0 + Vector((0.8, -0.6, 1.3)), 39.4, None)

# ---- D. Na hands one electron to Cl; Na⁺ and Cl⁻ ----
d0 = SD + Vector((0, 0, -0.6))
A("D Na", "Na", d0 + Vector((-2.0, 0, 0)), 44.3)
A("D Cl", "Cl", d0 + Vector((2.0, 0, 0)), 44.5)
travel("D e", d0 + Vector((-1.4, -0.3, 0.3)), d0 + Vector((1.4, -0.3, 0.3)), 47.5, dur=1.6, r=0.13, mat=E_BLUE)
badge("D Bn", "Na⁺ oxidized", d0 + Vector((-2.0, -0.6, 1.3)), 50.0, None, mat=M["cyan"])
badge("D Bc", "Cl⁻ reduced", d0 + Vector((2.0, -0.6, 1.3)), 50.8, None)

# ---- E. a firefly: its tail lights up as oxygen arrives ----
e0 = SE + Vector((0, 0, -0.6))
body = mat_pbr("Firefly Body U7", (0.12, 0.08, 0.05), roughness=0.5)
fly = empty("E Fly", e0)
sphere("E Head", 0.35, body, (-1.3, 0, 0.1), fly, 20, 10)
sphere("E Chest", 0.45, body, (-0.6, 0, 0.05), fly, 20, 10)
wing = mat_emit("Wing U7", (0.7, 0.8, 1.0), 0.3, alpha=0.3)
for k, sx in enumerate((-1, 1)):
    w = sphere("E Wing %d" % k, 1.0, wing, (-0.3, 0.2 * sx, 0.55), fly, 16, 8)
    w.scale = (0.9, 0.12, 0.3)
    w.rotation_euler = (0, -0.3, 0.25 * sx)
appear(fly, sec(60.3), dur=10)
tail = sphere("E Tail", 0.6, body, e0 + Vector((0.5, 0, 0)), None, 24, 12)
tail.scale = (0.9, 0.6, 0.6)
appear(tail, sec(60.3), s=(0.9, 0.6, 0.6))
lit = sphere("E Light", 0.62, mat_emit("Firefly Light U7", (0.75, 1.0, 0.25), 2.2), e0 + Vector((0.5, 0, 0)), None, 24, 12)
appear(lit, sec(64.0), s=(0.92, 0.62, 0.62))
for k in range(3):
    o = A("E O%d" % k, "O", e0 + Vector((3.6, 0, 1.4 - 1.0 * k)), 61.0 + 0.3 * k, t1=64.2, k=0.6)
    mv(o, 62.5, 64.0, e0 + Vector((3.6, 0, 1.4 - 1.0 * k)), e0 + Vector((1.0, 0, 0.2 * (k - 1))))
big("Lbl E", "oxidation → light", e0 + Vector((0.2, -0.6, 1.4)), 64.5, None, mat=M["gold"], size=0.45)
finish_film()
