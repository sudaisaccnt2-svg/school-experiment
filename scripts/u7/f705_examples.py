# ---- Film 705: Oxidation number examples (textbook pp.187-188: Example 7.1 PCl₅ P = +5; Example 7.2 NO₂⁻ N = +3;  (v4 captions)
# Practice 7.1 C in CO (+2), S in SO₃²⁻ (+4); transition metals show variable oxidation states: Fe II/III, Cu I/II/III,
# Mn +2 … +7) ----
start_film("705", "705 Oxidation Number Examples", 64.5)
END = scene.frame_end
SA, SB, SC, SD = (Vector((40 * k, 0, 0)) for k in range(4))

shot("Cam PCl5", 0, 18, SA + Vector((0, 0, -0.9)), dist=13, pitch=0.08)
shot("Cam Nitrite", 18, 34, SB + Vector((0, 0, -0.7)), dist=12, pitch=0.08)
shot("Cam Practice", 34, 52, SC + Vector((0, 0, -0.7)), dist=13, pitch=0.08)
shot("Cam Metals", 52, None, SD + Vector((0, 0, -0.9)), dist=13, pitch=0.08)
for name, t in (("Example 7.1", 0), ("Example 7.2", 18), ("Practice 7.1", 34), ("Transition metals", 52)):
    act(name, sec(t))

say('A1', 'PCl₅: each Cl is −1', 0.1, 8)
say('A2', 'Five chlorines make −5', 8, 13)
say('A3', 'So P is +5', 13, 18)
say('B1', 'NO₂⁻: each O is −2', 18, 26)
say('B2', 'x − 4 = −1: N is +3', 26, 34)
say('C1', 'CO: carbon is +2', 34, 42)
say('C2', 'SO₃²⁻: sulphur is +4', 42, 52)
say('D1', 'Iron +2 or +3', 52, 58)
say('D2', 'Manganese: six states', 58, 64)

# ---- A. PCl₅: five Cl around P ----
a0 = SA + Vector((0, 0, -0.4))
items = [("P", (0, 0, 0), None)]
for k in range(5):
    ang = math.pi / 2 + 2 * math.pi * k / 5
    items.append(("Cl", (1.45 * math.cos(ang), 0, 1.3 * math.sin(ang)), "−1"))
molb("A", a0, items, 0.4, 3.5, step=0.6, k=0.8, bsize=0.36)
badge("A Q", "P = ?", a0 + Vector((2.9, -0.9, 0.0)), 8.0, 13.2, size=0.5)
badge("A X", "P = +5", a0 + Vector((2.9, -0.9, 0.0)), 13.4, size=0.55)

# ---- B. NO₂⁻ ----
b0 = SB + Vector((0, 0, -0.5))
molb("B", b0, [("N", (0, 0, 0.3), None), ("O", (-1.0, 0, -0.35), "−2"), ("O", (1.0, 0, -0.35), "−2")], 18.3, 20.5,
     step=0.6, k=1.3, bsize=0.45)
big("Lbl B", "charge −1", b0 + Vector((2.9, -0.6, 0.6)), 22.5, None, mat=M["cyan"], size=0.45)
badge("B Q", "?", b0 + Vector((0, -0.8, 1.3)), 26.0, 30.0, size=0.5)
badge("B X", "+3", b0 + Vector((0, -0.8, 1.3)), 30.2, size=0.55)

# ---- C. CO (left) then SO₃²⁻ (right) ----
c0 = SC + Vector((0, 0, -0.5))
molb("C CO", c0, [("C", (-2.8, 0, 0), None), ("O", (-1.95, 0, 0), "−2")], 34.3, 35.5, k=1.1)
badge("C Q1", "?", c0 + Vector((-2.8, -0.8, 0.95)), 36.5, 39.0, size=0.5)
badge("C X1", "+2", c0 + Vector((-2.8, -0.8, 0.95)), 39.2, size=0.5)
molb("C S", c0, [("S", (2.0, 0, 0.2), None), ("O", (2.0, 0, 1.35), "−2"), ("O", (1.0, 0, -0.5), "−2"),
                 ("O", (3.0, 0, -0.5), "−2")], 42.3, 43.5, step=0.4, bsize=0.36)
badge("C Q2", "S = ?", c0 + Vector((2.0, -1.0, -1.4)), 46.0, 49.0, size=0.45)
badge("C X2", "S = +4", c0 + Vector((2.0, -1.0, -1.4)), 49.2, size=0.5)

# ---- D. Mn with its six badges in an arc; Fe and Cu beside ----
d0 = SD + Vector((0, 0, -0.9))
A("D Fe", "Fe", d0 + Vector((-3.3, 0, 0)), 52.3)
A("D Cu", "Cu", d0 + Vector((3.3, 0, 0)), 52.6)
badge("D Fe B", "+2 / +3", d0 + Vector((-3.3, -0.7, 1.05)), 53.5, size=0.4)
badge("D Cu B", "+1 / +2 / +3", d0 + Vector((3.3, -0.7, 1.05)), 54.3, size=0.4)
A("D Mn", "Mn", d0, 58.2, k=1.3)
for k, txt in enumerate(("+2", "+3", "+4", "+5", "+6", "+7")):
    ang = math.pi * (0.95 - 0.9 * k / 5)
    badge("D Mn B%d" % k, txt, d0 + Vector((1.45 * math.cos(ang), -0.7, 0.2 + 1.45 * math.sin(ang))), 59.0 + 0.5 * k,
          size=0.38)
finish_film()
