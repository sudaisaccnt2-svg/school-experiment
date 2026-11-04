# ---- Film 717: Electroplating (textbook pp.210-212: 7.7.2 a thin layer of one metal deposited on another by  (v4 captions)
# electrolysis; purposes: protection (Ni, Cr on iron), repair, decoration (gold, silver); procedure: clean with sand, NaOH,
# water; object = cathode, pure metal = anode, salt of that metal = electrolyte; (i) tin: Sn → Sn²⁺ + 2e⁻,
# Sn²⁺ + 2e⁻ → Sn (Fig 7.13); (ii) zinc in ZnSO₄; (iii) chromium in H₂CrO₄: Cr³⁺ + 3e⁻ → Cr; Society: silver is soft and
# tarnishes, sterling silver 92.5 % Ag + 7.5 % Cu; food acids attack iron cans, so cans are tin-plated) ----
start_film("717", "717 Electroplating", 82.5)
END = scene.frame_end
SA, SB, SC, SD, SE, SF = (Vector((40 * k, 0, 0)) for k in range(6))

shot("Cam Why", 0, 12, SA + Vector((0, 0, -0.9)), dist=13, pitch=0.1)
shot("Cam Clean", 12, 22, SB + Vector((0, 0, -0.9)), dist=11, pitch=0.1)
shot("Cam Tin", 22, 44, SC + Vector((0, 0, -1.1)), dist=14, pitch=0.1)
shot("Cam Zinc", 44, 56, SD + Vector((0, 0, -1.1)), dist=14, pitch=0.1)
shot("Cam Chrome", 56, 66, SE + Vector((0, 0, -1.1)), dist=14, pitch=0.1)
shot("Cam Cans", 66, None, SF + Vector((0, 0, -0.9)), dist=13, pitch=0.1)
for name, t in (("Why plate?", 0), ("Cleaning", 12), ("Tin", 22), ("Zinc", 44), ("Chromium", 56), ("Cans and silver", 66)):
    act(name, sec(t))

say('A1', 'Current lays a metal coat', 0.1, 5)
say('A2', 'Protect, repair, beautify', 5, 12)
say('B1', 'Clean the object first', 12, 22)
say('C1', 'Object −, tin +', 22, 30)
say('C2', 'The tin bar dissolves', 30, 36)
say('C3', 'A tin coat grows', 36, 44)
say('D1', 'Zinc plating', 44, 56)
say('E1', 'Chromium: bright and hard', 56, 66)
say('F1', 'Tin cans keep food safe', 66, 74)
say('F2', 'Sterling silver: 92.5 % silver', 74, 82)

# ---- A. protect, repair, decorate ----
a0 = SA + Vector((0, 0, -1.0))
bolt = sphere("A Chrome", 0.7, CHROME, a0 + Vector((-3.2, 0, 0.3)), None, 32, 16)
appear(bolt, sec(5.3), s=(0.7,) * 3)
gear = cyl("A Gear", 0.8, 0.8, 0.35, IRON, a0 + Vector((0, 0, 0.3)), rot=(math.pi / 2, 0, 0), segs=12)
appear(gear, sec(6.3), dur=10)
GOLD_M = mat_pbr("Gold U7", (1.0, 0.72, 0.25), metallic=1.0, roughness=0.2)
ring = ring_curve("A Ring", 0.6, GOLD_M, None, 0.14, 64, loc=a0 + Vector((3.2, 0, 0.3)))
ring.rotation_euler = (math.pi / 2, 0, 0)
appear(ring, sec(7.3), dur=10)
big("Lbl A1", "protect", a0 + Vector((-3.2, -0.6, 1.5)), 5.6, None, mat=M["white"], size=0.42)
big("Lbl A2", "repair", a0 + Vector((0, -0.6, 1.5)), 6.6, None, mat=M["white"], size=0.42)
big("Lbl A3", "decorate", a0 + Vector((3.2, -0.6, 1.5)), 7.6, None, mat=M["gold"], size=0.42)

# ---- B. a dirty spoon-like strip gets clean ----
b0 = SB + Vector((0, 0, -0.9))
obj = box("B Object", (3.0, 0.3, 1.0), IRON, b0)
appear(obj, sec(12.3), dur=10)
dirt = box("B Dirt", (3.05, 0.34, 1.05), mat_pbr("Grease U7", (0.25, 0.18, 0.08), roughness=1.0, alpha=0.8), b0)
appear(dirt, sec(12.5), dur=8)
kf(dirt, "scale", sec(14.0), (1, 1, 1))
kf(dirt, "scale", sec(20.0), (0.001, 1, 1))
for k, word in enumerate(("sand", "NaOH", "water")):
    big("Lbl B %d" % k, word, b0 + Vector((-2.4 + 2.4 * k, -0.6, 1.2)), 14.5 + 2.0 * k, None, mat=M["white"], size=0.42)

# ---- C/D/E. a plating cell: metal anode (left, +), iron object (right, −) ----
def plating(key, c0, t0, anode_mat, coat_mat, liq, t_ion, t_end, ion_mat=CAT):
    cc = cell(key, c0, t0, w=4.4, h=2.4, liq=liq, gap=1.4, pa=anode_mat, pc=IRON, pw=0.5)
    coat = box(key + " Coat", (0.58, 0.2, 2.2), coat_mat, c0 + Vector((1.4, 0, 1.4)))
    kf(coat, "scale", 0, (0.001, 0.001, 0.001))
    kf(coat, "scale", sec(t_ion + 2.0), (0.001, 0.001, 0.001))
    kf(coat, "scale", sec(t_ion + 2.1), (0.9, 0.3, 0.98))
    kf(coat, "scale", sec(t_end), (1.0, 1.0, 1.0))
    for k in range(5):
        z = 0.6 + 0.35 * k
        a, b = c0 + Vector((-1.05, -0.35, z)), c0 + Vector((1.05, -0.35, z + 0.1))
        frames, vals = [], []
        t = t_ion + 0.5 * k
        while t + 2.5 <= t_end:
            frames += [sec(t), sec(t + 2.5) - 1]
            vals += [a, b]
            t += 3.0
        s = sphere(key + " Ion %d" % k, 0.15, ion_mat, a, None, 14, 7)
        keys_bulk(s, "location", frames, vals)
        hide_until(s, sec(t_ion + 0.5 * k))
        hide_from(s, sec(t_end), (0.15,) * 3)
    flow(key + " eL", cc["up_l"], t_ion, t_end, n=3, speed=0.9)
    flow(key + " eR", cc["up_r"][::-1], t_ion, t_end, n=3, speed=0.9)
    return cc

c0 = SC + Vector((0, 0, -2.6))
plating("C", c0, 22.3, TIN, TIN, mat_emit("Stannate U7", (0.8, 0.85, 0.9), 0.4, alpha=0.25), 30.5, 44.0)
big("Lbl C A", "tin (+)", c0 + Vector((-3.3, -1.0, 2.0)), 24.0, None, mat=M["red"], size=0.4)
big("Lbl C C", "iron object (−)", c0 + Vector((3.6, -1.0, 2.0)), 24.6, None, mat=M["cyan"], size=0.4)
big("Lbl C I", "Sn²⁺", c0 + Vector((0, -1.0, 2.85)), 31.0, None, mat=M["gold"], size=0.45)
d0 = SD + Vector((0, 0, -2.6))
plating("D", d0, 44.3, ZINC, ZINC, ZN_SOL, 46.0, 56.0)
big("Lbl D I", "Zn²⁺", d0 + Vector((0, -1.0, 2.85)), 46.5, None, mat=M["gold"], size=0.45)
e0 = SE + Vector((0, 0, -2.6))
plating("E", e0, 56.3, CHROME, CHROME, mat_emit("Chromic Acid U7", (1.0, 0.55, 0.1), 0.5, alpha=0.3), 58.0, 66.0)
big("Lbl E I", "Cr³⁺", e0 + Vector((0, -1.0, 2.85)), 58.5, None, mat=M["gold"], size=0.45)

# ---- F. a tin can and a sterling silver ball ----
f0 = SF + Vector((0, 0, -1.6))
can = cyl("F Can", 0.9, 0.9, 2.2, TIN, f0 + Vector((-2.4, 0, 0)), base=True, segs=40)
appear(can, sec(66.3), dur=10)
lab = cyl("F Label", 0.92, 0.92, 1.0, mat_pbr("Can Label U7", (0.85, 0.15, 0.1), roughness=0.5), f0 + Vector((-2.4, 0, 0.6)),
          base=True, segs=40)
appear(lab, sec(66.6), dur=10)
big("Lbl F C", "tin coat", f0 + Vector((-2.4, -1.2, 2.7)), 68.0, None, mat=M["white"], size=0.42)
ag = sphere("F Silver", 0.9, mat_pbr("Silver U7", (0.92, 0.93, 0.95), metallic=1.0, roughness=0.15), f0 + Vector((2.4, 0, 1.0)),
            None, 32, 16)
appear(ag, sec(74.3), s=(0.9,) * 3)
tar = sphere("F Tarnish", 0.93, mat_pbr("Tarnish Dark U7", (0.1, 0.09, 0.08), roughness=0.6),
             f0 + Vector((2.4, 0, 1.0)), None, 32, 16)
appear(tar, sec(76.0), dur=30, s=(0.93,) * 3)
badge("F B", "92.5 % Ag + 7.5 % Cu", f0 + Vector((2.4, -1.2, 2.6)), 78.0, size=0.4)
finish_film()
