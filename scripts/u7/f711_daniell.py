# ---- Film 711: Galvanic (voltaic) cell: the Daniell cell (textbook pp.196-199: 7.5.3 a spontaneous redox reaction  (v4 captions)
# makes electricity; Fig 7.6 Zn in 1 M ZnSO₄ (anode), Cu in 1 M CuSO₄ (cathode), voltmeter 1.10 V; salt bridge (U-tube of
# K₂SO₄ / Na₂SO₄ gel): contact, no mixing, neutrality; working: Zn loses e⁻, they run through the wire to Cu, Cu²⁺ plate
# out; Zn → Zn²⁺ + 2e⁻, Cu²⁺ + 2e⁻ → Cu, Zn + Cu²⁺ → Zn²⁺ + Cu; Table 7.2 galvanic vs electrolytic) ----
start_film("711", "711 Daniell Cell", 82.5)
END = scene.frame_end
S0, ST = Vector((0, 0, 0)), Vector((40, 0, 0))

shot("Cam Cell", 0, 12, S0 + Vector((0, 0, -1.0)), dist=15, pitch=0.1)
shot("Cam Bridge", 12, 24, S0 + Vector((0, 0, -0.8)), dist=13, pitch=0.12)
shot("Cam Work", 24, 44, S0 + Vector((0, 0, -1.0)), dist=14, pitch=0.1)
shot("Cam Ions", 44, 56, S0 + Vector((0, 0, -1.2)), dist=12, pitch=0.1)
shot("Cam Sum", 56, 68, S0 + Vector((0, 0, -1.0)), dist=15, pitch=0.1)
shot("Cam Table", 68, None, ST + Vector((0, 0, -1.1)), dist=15, pitch=0.1)
for name, t in (("Daniell cell", 0), ("Salt bridge", 12), ("Electrons flow", 24), ("Ions in the bridge", 44),
                ("Cell reaction", 56), ("Galvanic vs electrolytic", 68)):
    act(name, sec(t))

say('A1', 'A reaction makes electricity', 0.1, 6)
say('A2', 'Daniell cell: two half cells', 6, 12)
say('B1', 'The salt bridge joins them', 12, 18)
say('B2', 'Joins, separates, keeps neutral', 18, 24)
say('C1', 'Zinc gives electrons: anode', 24, 32)
say('C2', 'Through the wire: 1.10 V', 32, 38)
say('C3', 'Copper ions take them: cathode', 38, 44)
say('D1', 'Ions drift in the bridge', 44, 56)
say('E1', 'Zn + Cu²⁺ → Zn²⁺ + Cu', 56, 62)
say('E2', 'Every battery works this way', 62, 68)
say('F1', 'Galvanic: chemical → electrical', 68, 75)
say('F2', 'Electrolytic: electrical → chemical', 75, 82)

# ---- the two half cells ----
zl, cr = S0 + Vector((-2.4, 0, -2.6)), S0 + Vector((2.4, 0, -2.6))
tank("Zn", zl, 2.8, 2.4, 1.9, 0.4, liq_mat=ZN_SOL)
tank("Cu", cr, 2.8, 2.4, 1.9, 0.8, liq_mat=CU_SOL)
plate("Zn Plate", zl + Vector((-0.6, 0, 0.3)), 2.7, ZINC, 1.0, w=0.45)
plate("Cu Plate", cr + Vector((0.6, 0, 0.3)), 2.7, COPPER, 1.2, w=0.45)
big("Lbl Zn", "zinc  (−)", zl + Vector((-2.6, -1.0, 2.2)), 7.0, None, mat=M["cyan"], size=0.42)
big("Lbl Cu", "copper  (+)", cr + Vector((2.7, -1.0, 2.2)), 7.5, None, mat=M["red"], size=0.42)
# wire over the top through a voltmeter
vm_loc = S0 + Vector((0, 0, 1.6))
vm = box("Meter", (1.3, 0.3, 0.8), DARK, vm_loc)
appear(vm, sec(1.5), dur=10)
path = [zl + Vector((-0.6, 0, 3.0)), Vector((zl.x - 0.6, 0, vm_loc.z)), vm_loc + Vector((-0.65, 0, 0)),
        vm_loc + Vector((0.65, 0, 0)), Vector((cr.x + 0.6, 0, vm_loc.z)), cr + Vector((0.6, 0, 3.0))]
wire("Wire 1", path[:3], 1.6)
wire("Wire 2", path[3:], 1.6)
big("Lbl V", "1.10 V", vm_loc + Vector((0, -0.4, -0.1)), 33.0, None, mat=M["gold"], size=0.4)

# salt bridge: a fat U-tube of gel
GEL = mat_emit("Salt Bridge Gel U7", (0.85, 0.9, 1.0), 0.6, alpha=0.35)
ub = [zl + Vector((0.6, 0.15, 0.9)), zl + Vector((0.6, 0.15, 2.9)), cr + Vector((-0.6, 0.15, 2.9)),
      cr + Vector((-0.6, 0.15, 0.9))]
bridge = pcurve("Bridge", ub, GEL, 0.22, "Models")
hide_until(bridge, sec(12.5))
big("Lbl Br", "salt bridge", S0 + Vector((0, -1.0, 0.9)), 13.5, 24.0, mat=M["white"], size=0.4)

# ---- working: Zn²⁺ leave the zinc plate, electrons run, Cu forms ----
for k in range(3):
    z = 0.8 + 0.45 * k
    a = zl + Vector((-0.3, -0.3, z))
    zi = ion("Zn2 %d" % k, CAT, a, 25.0 + 0.8 * k, r=0.18)
    move(zi, sec(25.2 + 0.8 * k), sec(27.5 + 0.8 * k), a, zl + Vector((0.2 + 0.25 * k, -0.3, z - 0.2)))
flow("e Wire", path, 28.0, 68.0, n=8, speed=1.3)
for k in range(3):
    z = 0.8 + 0.45 * k
    p0 = cr + Vector((-0.2 + 0.2 * k, -0.3, z))
    ci = ion("Cu2 %d" % k, CAT, p0, 24.5, r=0.18)
    move(ci, sec(38.5 + 0.7 * k), sec(40.5 + 0.7 * k), p0, cr + Vector((0.32, -0.3, z)))
    hide_from(ci, sec(41.0 + 0.7 * k), (0.18,) * 3)
    cu = sphere("Cu Atom %d" % k, 0.16, mat_emit("Copper Bead U7", (0.95, 0.42, 0.15), 1.2), cr + Vector((0.34, -0.3, z)),
                None, 16, 8)
    appear(cu, sec(41.0 + 0.7 * k), s=(0.16,) * 3)

# ---- ions in the bridge ----
for k in range(2):
    s = sphere("Br SO4 %d" % k, 0.15, ANI, ub[2], None, 16, 8)
    keys_bulk(s, "location", [sec(45.0 + 2 * k), sec(48.0 + 2 * k), sec(52.0 + 2 * k)], [ub[2] + Vector((-0.3, 0, 0)), ub[1] + Vector((0.3, 0, 0)), ub[0] + Vector((0, 0, 0.6))])
    hide_until(s, sec(45.0 + 2 * k))
    n = sphere("Br Na %d" % k, 0.15, CAT, ub[1], None, 16, 8)
    keys_bulk(n, "location", [sec(45.5 + 2 * k), sec(48.5 + 2 * k), sec(52.5 + 2 * k)], [ub[1] + Vector((0.3, 0, -0.15)), ub[2] + Vector((-0.3, 0, -0.15)), ub[3] + Vector((0, 0, 0.6))])
    hide_until(n, sec(45.5 + 2 * k))

# ---- Table 7.2: galvanic (bulb) beside electrolytic (battery) ----
t0 = ST + Vector((0, 0, -2.4))
cell("TG", t0 + Vector((-2.8, 0, 0)), 68.3, w=3.4, h=2.0, gap=1.0, top="bulb", level=0.8, pa=ZINC, pc=COPPER,
     liq=CU_SOL)
cell("TE", t0 + Vector((2.8, 0, 0)), 75.3, w=3.4, h=2.0, gap=1.0, liq=MELT)
big("Lbl TG", "galvanic", t0 + Vector((-2.8, -1.0, 2.35)), 69.0, None, mat=M["white"], size=0.4)
big("Lbl TE", "electrolytic", t0 + Vector((2.8, -1.0, 2.35)), 76.0, None, mat=M["white"], size=0.4)
finish_film()
