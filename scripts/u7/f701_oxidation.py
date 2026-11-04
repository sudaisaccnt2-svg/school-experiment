# ---- Film 701: Electrochemistry and oxidation (textbook pp.182-184: introduction, 7.1 oxidation: (a) addition of  (v4 captions)
# oxygen C + O₂ → CO₂, (b) removal of hydrogen 2NH₃ + 3Cl₂ → N₂ + 6HCl, (c) removal of electrons Fe²⁺ → Fe³⁺ + e⁻) ----
start_film("701", "701 Oxidation", 72.5)
END = scene.frame_end
SA, SB, SC, SD, SE = (Vector((40 * k, 0, 0)) for k in range(5))

shot("Cam Intro", 0, 16, SA + Vector((0, 0, -0.9)), dist=14, pitch=0.1)
shot("Cam Pair", 16, 26, SB + Vector((0, 0, -0.6)), dist=12, pitch=0.08)
shot("Cam Oxygen", 26, 40, SC + Vector((0, 0, -0.6)), dist=12, pitch=0.08)
shot("Cam Hydrogen", 40, 56, SD + Vector((0, 0, -0.6)), dist=12, pitch=0.08)
shot("Cam Electron", 56, None, SE + Vector((0, 0, -0.6)), dist=11, pitch=0.08)
for name, t in (("Electrochemistry", 0), ("Lost = gained", 16), ("Gain oxygen", 26), ("Lose hydrogen", 40),
                ("Lose electrons", 56)):
    act(name, sec(t))

say('A1', 'Electricity ↔ chemical change', 0.1, 8)
say('A2', 'Rust, fire, food: moving electrons', 8, 16)
say('B1', 'Lost by one = gained by other', 16, 26)
say('C1', 'Gaining oxygen: C + O₂ → CO₂', 26, 40)
say('D1', 'Ammonia loses its hydrogen', 40, 48)
say('D2', 'Nitrogen left over: oxidized', 48, 56)
say('E1', 'Fe²⁺ gives one electron', 56, 64)
say('E2', 'Losing electrons: Fe³⁺, oxidized', 64, 72)

# ---- A. a battery lights a bulb; rust, flame, food ----
cA = SA + Vector((0, 0, -1.6))
battery("A", cA + Vector((-2.2, 0, 0.3)), 0.4, 8.0)
bulb("A", cA + Vector((2.2, 0, -0.1)), 0.6, 1.0, 8.0)
loop = [cA + Vector((-2.85, -0.05, 0.3)), cA + Vector((-2.85, -0.05, 2.4)), cA + Vector((2.2, -0.05, 2.4)),
        cA + Vector((2.2, -0.05, 1.25))]
loop2 = [cA + Vector((2.2, -0.05, -0.1)), cA + Vector((2.2, -0.05, -0.5)), cA + Vector((-1.55, -0.05, -0.5)),
         cA + Vector((-1.55, -0.05, 0.3))]
wire("A Wire 1", loop, 0.8, 8.0)
wire("A Wire 2", loop2, 0.8, 8.0)
flow("A e", loop2[::-1] + loop[::-1], 2.0, 8.0, n=10, speed=1.6)  # out of −, through the bulb, back to +
nail = box("A Nail", (2.6, 0.3, 0.3), IRON, cA + Vector((-2.8, 0, 1.0)))
appear(nail, sec(8.3), dur=10)
for k in range(5):
    rr = 0.12 + 0.04 * (k % 3)
    sp = sphere("A Rust %d" % k, rr, RUST, cA + Vector((-3.8 + 0.5 * k, -0.18, 1.0 + 0.1 * (k % 2))), None, 12, 6)
    appear(sp, sec(9.0 + 0.3 * k), s=(rr,) * 3)
flame("A Flame", cA + Vector((0, 0, 0.4)), 10.0, None, s=1.4)
apple = sphere("A Apple", 0.6, mat_pbr("Apple U7", (0.75, 0.1, 0.08), roughness=0.4), cA + Vector((2.8, 0, 1.0)),
               None, 24, 12)
appear(apple, sec(11.0), s=(0.6,) * 3)
big("Lbl A R", "rust", cA + Vector((-2.8, -0.6, 2.0)), 9.4, None, mat=M["white"], size=0.45)
big("Lbl A F", "fire", cA + Vector((0, -0.6, 2.0)), 10.4, None, mat=M["white"], size=0.45)
big("Lbl A M", "food", cA + Vector((2.8, -0.6, 2.0)), 11.4, None, mat=M["white"], size=0.45)

# ---- B. one atom hands two electrons to another ----
gA = A("B Giver", "Zn", SB + Vector((-2.2, 0, -0.6)), 16.3)
gB = A("B Taker", "Cu", SB + Vector((2.2, 0, -0.6)), 16.5)
for k in range(2):
    travel("B e %d" % k, SB + Vector((-1.6, -0.3, -0.4 + 0.3 * k)), SB + Vector((1.6, -0.3, -0.4 + 0.3 * k)), 18.5 + 0.8 * k,
           dur=1.4, r=0.12, mat=E_BLUE)
big("Lbl B L", "loses 2 e⁻", SB + Vector((-2.2, -0.6, 0.6)), 20.6, None, mat=M["cyan"], size=0.45)
big("Lbl B G", "gains 2 e⁻", SB + Vector((2.2, -0.6, 0.6)), 21.2, None, mat=M["gold"], size=0.45)

# ---- C. C + O₂ → CO₂ ----
c0 = SC + Vector((0, 0, -0.6))
cc = A("C C", "C", c0 + Vector((-2.4, 0, 0)), 26.3)
o1 = A("C O1", "O", c0 + Vector((1.8, 0, 0)), 26.6)
o2 = A("C O2", "O", c0 + Vector((2.66, 0, 0)), 26.6)
mv(cc, 29.0, 31.0, c0 + Vector((-2.4, 0, 0)), c0)
mv(o1, 29.0, 31.0, c0 + Vector((1.8, 0, 0)), c0 + Vector((-0.86, 0, 0)))
mv(o2, 29.0, 31.0, c0 + Vector((2.66, 0, 0)), c0 + Vector((0.86, 0, 0)))
big("Lbl C 1", "C + O₂", c0 + Vector((0, -0.6, 1.4)), 27.2, 31.0, mat=M["white"], size=0.5)
big("Lbl C 2", "CO₂: carbon gained oxygen", c0 + Vector((0, -0.6, 1.4)), 31.6, None, mat=M["gold"], size=0.5)

# ---- D. NH₃ loses its hydrogens to chlorine; N₂ left ----
d0 = SD + Vector((0, 0, -0.6))
nn = A("D N", "N", d0 + Vector((-1.2, 0, 0)), 40.3)
hs = [A("D H%d" % k, "H", d0 + Vector((-1.2, 0, 0)) + Vector(v), 40.5) for k, v in
      enumerate(((-0.7, 0, 0.5), (0.7, 0, 0.5), (0, 0, -0.8)))]
cls = [A("D Cl%d" % k, "Cl", d0 + Vector((2.2, 0, 1.2 - 1.2 * k)), 41.0) for k in range(3)]
for k, h in enumerate(hs):
    a = d0 + Vector((-1.2, 0, 0)) + Vector(((-0.7, 0, 0.5), (0.7, 0, 0.5), (0, 0, -0.8))[k])
    mv(h, 43.5 + 0.8 * k, 44.7 + 0.8 * k, a, d0 + Vector((1.4, 0, 1.2 - 1.2 * k)))
n2 = A("D N2", "N", d0 + Vector((-3.4, 0, 0)), 48.5)
mv(n2, 49.0, 50.5, d0 + Vector((-3.4, 0, 0)), d0 + Vector((-2.1, 0, 0)))
big("Lbl D 1", "lost H → oxidized", d0 + Vector((-1.7, -0.6, 1.4)), 51.0, None, mat=M["gold"], size=0.45)
big("Lbl D 2", "HCl", d0 + Vector((1.8, -0.6, 2.2)), 46.5, None, mat=M["white"], size=0.45)

# ---- E. Fe²⁺ → Fe³⁺ + e⁻ ----
e0 = SE + Vector((0, 0, -0.6))
fe = A("E Fe", "Fe", e0 + Vector((-1.0, 0, 0)), 56.3, k=1.4)
badge("E B2", "2+", e0 + Vector((-1.0, -0.6, 1.3)), 57.0, 63.0)
el = electron("E e", None, e0 + Vector((-0.1, -0.4, 0.4)), 0.13, mat=E_BLUE)
appear(el, sec(57.5), s=tuple(el.scale))
move(el, sec(60.0), sec(62.0), e0 + Vector((-0.1, -0.4, 0.4)), e0 + Vector((2.6, -0.4, 0.4)))
badge("E B3", "3+", e0 + Vector((-1.0, -0.6, 1.3)), 63.2, None)
big("Lbl E e", "e⁻", e0 + Vector((2.6, -0.6, 1.0)), 62.2, None, mat=M["cyan"], size=0.5)
finish_film()
