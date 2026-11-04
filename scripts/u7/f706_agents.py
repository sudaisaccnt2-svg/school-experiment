# ---- Film 706: Oxidizing and reducing agents (textbook pp.188-189: 7.3 an oxidizing agent oxidizes another and is  (v4 captions)
# itself reduced (KMnO₄, K₂Cr₂O₇, HNO₃, Cl₂); Example 7.4 Zn + CuO → ZnO + Cu (CuO is the oxidizing agent); Example 7.5
# Sn²⁺ + Cl₂ → Sn⁴⁺ + 2Cl⁻ (Cl₂); a reducing agent reduces another and is itself oxidized (H₂S, SO₂, Na, Al, Mg);
# Br₂ + H₂S → 2HBr + S (H₂S is the reducing agent)) ----
start_film("706", "706 Oxidizing and Reducing Agents", 74.5)
END = scene.frame_end
SA, SB, SC, SD, SE = (Vector((40 * k, 0, 0)) for k in range(5))

shot("Cam Oxidizer", 0, 14, SA + Vector((0, 0, -0.9)), dist=12, pitch=0.08)
shot("Cam CuO", 14, 32, SB + Vector((0, 0, -0.9)), dist=12, pitch=0.08)
shot("Cam Tin", 32, 48, SC + Vector((0, 0, -0.9)), dist=12, pitch=0.08)
shot("Cam Reducer", 48, 60, SD + Vector((0, 0, -0.9)), dist=12, pitch=0.08)
shot("Cam H2S", 60, None, SE + Vector((0, 0, -0.9)), dist=12, pitch=0.08)
for name, t in (("Oxidizing agent", 0), ("Example 7.4", 14), ("Example 7.5", 32), ("Reducing agent", 48),
                ("H₂S", 60)):
    act(name, sec(t))

say('A1', 'Takes electrons: oxidizing agent', 0.1, 7)
say('A2', 'KMnO₄, HNO₃, Cl₂', 7, 14)
say('B1', 'Oxygen moves to zinc', 14, 23)
say('B2', 'Cu reduced: CuO oxidizes', 23, 32)
say('C1', 'Tin gives chlorine two', 32, 40)
say('C2', 'Cl reduced: Cl₂ oxidizes', 40, 48)
say('D1', 'Gives electrons: reducing agent', 48, 54)
say('D2', 'H₂S, Na, Al, Mg', 54, 60)
say('E1', 'H₂S gives hydrogen to bromine', 60, 67)
say('E2', 'S oxidized: H₂S reduces', 67, 74)

# ---- A. Cl takes an electron from Na; Cl wears a "taker" badge ----
a0 = SA + Vector((0, 0, -0.6))
A("A Na", "Na", a0 + Vector((-2.0, 0, 0)), 0.3)
A("A Cl", "Cl", a0 + Vector((2.0, 0, 0)), 0.5)
travel("A e", a0 + Vector((-1.4, -0.3, 0.3)), a0 + Vector((1.4, -0.3, 0.3)), 2.0, dur=1.6, r=0.13, mat=E_BLUE)
badge("A B", "oxidizing agent", a0 + Vector((2.0, -0.7, 1.4)), 4.0, size=0.42)
big("Lbl A", "reduced", a0 + Vector((2.0, -0.7, -1.05)), 5.0, None, mat=M["white"], size=0.4)

# ---- B. Zn + CuO → ZnO + Cu ----
b0 = SB + Vector((0, 0, -0.6))
zn = A("B Zn", "Zn", b0 + Vector((-2.6, 0, 0)), 14.3)
cu = A("B Cu", "Cu", b0 + Vector((1.2, 0, 0)), 14.6)
ox = A("B O", "O", b0 + Vector((2.25, 0, 0)), 14.8)
badge("B Cu2", "+2", b0 + Vector((1.2, -0.7, 1.05)), 16.0, 23.0)
mv(ox, 18.0, 20.5, b0 + Vector((2.25, 0, 0)), b0 + Vector((-1.55, 0, 0)))
mv(cu, 18.5, 20.5, b0 + Vector((1.2, 0, 0)), b0 + Vector((2.0, 0, 0)))
badge("B Cu0", "0", b0 + Vector((2.0, -0.7, 1.05)), 23.3)
badge("B Ag", "oxidizing agent: CuO", b0 + Vector((0, -0.7, 2.0)), 25.0, size=0.42)

# ---- C. Sn²⁺ gives 2 e⁻ to Cl₂ ----
c0 = SC + Vector((0, 0, -0.6))
A("C Sn", "Sn", c0 + Vector((-2.2, 0, 0)), 32.3, k=1.2)
badge("C S2", "2+", c0 + Vector((-2.2, -0.7, 1.2)), 33.0, 37.8)
cl = [A("C Cl%d" % k, "Cl", c0 + Vector((1.6 + 0.9 * k, 0, 0)), 32.6) for k in range(2)]
for k in range(2):
    mv(cl[k], 34.5, 35.8, c0 + Vector((1.6 + 0.9 * k, 0, 0)), c0 + Vector((1.4 + 1.6 * k, 0, 0)))
    travel("C e %d" % k, c0 + Vector((-1.5, -0.4, 0.3)), c0 + Vector((1.4 + 1.6 * k, -0.7, 0.3)), 36.0 + 0.6 * k,
           dur=1.4, r=0.13, mat=E_BLUE)
badge("C S4", "4+", c0 + Vector((-2.2, -0.7, 1.2)), 38.0)
for k in range(2):
    badge("C Cm%d" % k, "−1", c0 + Vector((1.4 + 1.6 * k, -0.7, 1.05)), 39.0 + 0.3 * k)
big("Lbl C", "oxidizing agent: Cl₂", c0 + Vector((2.2, -0.7, -1.05)), 41.0, None, mat=M["gold"], size=0.42)

# ---- D. Na gives its electron away: reducing agent ----
d0 = SD + Vector((0, 0, -0.6))
A("D Na", "Na", d0 + Vector((-2.0, 0, 0)), 48.3)
A("D Cl", "Cl", d0 + Vector((2.0, 0, 0)), 48.5)
travel("D e", d0 + Vector((-1.4, -0.3, 0.3)), d0 + Vector((1.4, -0.3, 0.3)), 50.0, dur=1.6, r=0.13, mat=E_BLUE)
badge("D B", "reducing agent", d0 + Vector((-2.0, -0.7, 1.4)), 52.0, size=0.42, mat=M["cyan"])
big("Lbl D", "oxidized", d0 + Vector((-2.0, -0.7, -1.05)), 53.0, None, mat=M["white"], size=0.4)

# ---- E. Br₂ + H₂S → 2HBr + S ----
e0 = SE + Vector((0, 0, -0.6))
A("E S", "S", e0 + Vector((-2.0, 0, 0)), 60.3, k=1.1)
hh = [A("E H%d" % k, "H", e0 + Vector((-2.0, 0, 0)) + Vector((0.75 * (2 * k - 1), 0, -0.6)), 60.5) for k in range(2)]
br = [A("E Br%d" % k, "Br", e0 + Vector((2.0, 0, 0.6 - 1.2 * k)), 60.8) for k in range(2)]
badge("E Sm", "−2", e0 + Vector((-2.0, -0.7, 1.15)), 62.0, 67.8)
for k in range(2):
    mv(hh[k], 63.0 + 0.6 * k, 64.6 + 0.6 * k, e0 + Vector((-2.0, 0, 0)) + Vector((0.75 * (2 * k - 1), 0, -0.6)),
       e0 + Vector((1.1, 0, 0.6 - 1.2 * k)))
badge("E S0", "0", e0 + Vector((-2.0, -0.7, 1.15)), 68.0)
big("Lbl E", "reducing agent: H₂S", e0 + Vector((-2.0, -0.7, -1.1)), 69.0, None, mat=M["cyan"], size=0.42)
finish_film()
