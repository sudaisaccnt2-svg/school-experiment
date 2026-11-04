# ---- Film 803: Alkali metals — v5 PILOT (SKILL 2026-10-11): the scene is never empty (frame 1 shows the metals),
# one place on screen at a time, holds ≤ 1 s, animation principles (gravity, weight, anticipation, overshoot),
# real fire (app fx), real 3D atom, shared library models, every book point of pp.222–223:
#   Scientific Information: metals conduct, non-metals insulate EXCEPT graphite; the electrolysis test (dissolve in
#   acid, pass a current: a metal's ions are positive and go to the cathode; Zn + 2HCl → ZnCl₂ + H₂);
#   8.1.2: group IA except hydrogen = alkali metals; 'alkali' (Arabic) = the ashes (first found in plant ashes; or:
#   with water they make strong alkalies); Li Na K Rb Cs Fr; one valence electron in an s sub-shell, lost → M⁺;
#   ionic compounds with groups VIA and VIIA; occurrence: too reactive to be free, Li in spodumene LiAl(SiO₃)₂,
#   Na and K 2.4 % of the crust, Rb and Cs in potassium salt deposits, francium is not natural: made in the lab.
# Old v4 builder: backups/v4/f803_alkali_v4.py.  Build: sh scripts/u8/b8.sh (appends v5lib.py)
start_film("803", "803 Alkali Metals", 74.0)
S = [Vector((40 * k, 0, 0)) for k in range(11)]
SYMS = ("Li", "Na", "K", "Rb", "Cs", "Fr")

shot("Cam Metals", 0, 6, S[0] + Vector((0, 0, -1.0)), dist=9.5, pitch=0.12)
shot("Cam Acid", 6, 11, S[1] + Vector((0, 0, -0.9)), dist=5.6, pitch=0.16)
shot("Cam Test", 11, 16, S[2] + Vector((0, 0, -0.6)), dist=12, pitch=0.06)
shot("Cam Graphite", 16, 20, S[3] + Vector((-0.3, 0, -1.2)), dist=6.5, pitch=0.08)
shot("Cam Ash", 20, 27, S[4] + Vector((0, 0, -0.9)), dist=8, pitch=0.14)
shot("Cam Water", 27, 33, S[5] + Vector((0, 0, -0.9)), dist=9, pitch=0.18)
shot("Cam Group", 33, 39, S[6] + Vector((-0.5, 0, 0.6)), dist=9.5, pitch=0.04)
shot("Cam Atom", 39, 48, S[7] + Vector((0, 0, 0)), dist=10.5, pitch=0.05)
shot("Cam Bond", 48, 53, S[8] + Vector((0, 0, 0)), dist=6.5, pitch=0.05)
shot("Cam Earth", 53, 68, S[9] + Vector((0, 0, -0.5)), dist=9, pitch=0.16)
shot("Cam Lab", 68, None, S[10] + Vector((0, 0, -0.5)), dist=8.5, pitch=0.1)
for name, t in (("Alkali metals", 0), ("Metal test", 6), ("The ashes", 20), ("Group IA", 33), ("One s electron", 39),
                ("Where found", 53)):
    act(name, sec(t))

say('A1', 'Group IA: the alkali metals', 0.1, 6)
say('B1', 'Zinc dissolves in acid', 6, 11)
say('C1', 'Metal ions go to the − side', 11, 16)
say('D1', 'No current, except graphite', 16, 20)
say('E1', "Alkali: Arabic for 'the ashes'", 20, 27)
say('F1', 'With water: strong alkalies', 27, 33)
say('G1', 'Group IA, except hydrogen', 33, 39)
say('H1', 'One s electron leaves: K⁺', 39, 48)
say('I1', 'With VIA, VIIA: ionic compounds', 48, 53)
say('J1', 'Lithium hides in spodumene', 53, 58)
say('J2', 'Na, K: 2.4 % of the crust', 58, 63)
say('J3', 'Rb, Cs: in potassium salts', 63, 68)
say('K1', 'Francium: made only in labs', 68, 74)

# ---- A. the six alkali metals, already on screen at frame 1 (kept under oil, in glass vials) ----
OIL = mat_emit("Vial Oil V5", (1.0, 0.85, 0.45), 0.35, alpha=0.18)
METAL_M = {s: mat_pbr("Alkali %s V5" % s, c, metallic=0.95, roughness=r) for s, c, r in
           (("Li", (0.78, 0.79, 0.8), 0.25), ("Na", (0.86, 0.87, 0.89), 0.15), ("K", (0.8, 0.82, 0.88), 0.18),
            ("Rb", (0.84, 0.82, 0.8), 0.2), ("Cs", (0.92, 0.8, 0.5), 0.15))}
for k, sy in enumerate(SYMS):
    c = S[0] + Vector((-4.0 + 1.6 * k, 0, -1.6))
    jar("A Vial %s" % sy, 0.55, 1.7, c, top=True)
    if sy != "Fr":
        liquid("A Oil %s" % sy, 0.5, 1.15, c + Vector((0, 0, 0.02)), mat=OIL)
        blob("A Lump %s" % sy, (0.34, 0.29, 0.22), METAL_M[sy], c + Vector((0, 0, 0.22)), None, bump=0.12, seed=k)
    else:                                            # francium: not in nature, only a faint glow of lab-made atoms
        g = sphere("A Fr Glow", 0.16, mat_emit("Fr Glow V5", (1.0, 0.75, 0.3), 3.0), c + Vector((0, 0, 0.5)), None, 16, 8)
        pulse(g, 3.5, 1.4)
    lb = label("A Lbl %s" % sy, sy, c + Vector((0, -0.75, -0.5)), 0.55, None, None, mat=M["white"], weight="semibold")  # there at frame 1
    pulse(lb, 0.8 + 0.35 * k, 1.25)                 # the names light up one after another (one place at a time)

# ---- B. the test, part 1: zinc falls into acid and dissolves (fizz) ----
b0 = S[1] + Vector((0, 0, -2.2))
lib_obj("B Beaker", "chemistry_set_beaker_med", b0, size=1.9)
liquid("B Acid", 0.82, 1.15, b0 + Vector((0, 0, 0.04)), mat=ZN_SOL)
zn = blob("B Zinc", (0.2, 0.17, 0.14), mat_pbr("Zinc V5", (0.62, 0.66, 0.72), metallic=0.9, roughness=0.35), b0, None,
          bump=0.15, seed=3)
top = b0 + Vector((0, 0, 1.2))
t_hit = fall(zn, 6.3, top + Vector((0.1, 0, 2.4)), top + Vector((0.1, 0, -0.95)), bounce=0.04)
splash("B", top, t_hit - 0.15, r=0.55)
fizz("B Zn", b0 + Vector((0.1, -0.1, 0.3)), t_hit, 11.0, n=10, spread=0.28, rise=0.9, period=0.9, r=0.05)
dissolve_out(zn, 9.0, 1.8)
big("B Lbl", "Zn + 2HCl → ZnCl₂ + H₂", b0 + Vector((0, -1.0, 3.0)), 7.6, None, mat=M["gold"], size=0.34)

# ---- C. the test, part 2: current through the solution, the zinc ions walk to the cathode (−) ----
c0 = S[2] + Vector((0, 0, -2.3))
cell("C", c0, 11.0, w=4.4, h=2.2, liq=ZN_SOL, gap=1.5)
big("C Lbl −", "cathode −", c0 + Vector((1.5, -1.0, 3.75)), 11.6, None, mat=M["cyan"], size=0.38)
for k in range(4):
    p = c0 + Vector((-0.9 + 0.5 * k, -0.25, 0.55 + 0.38 * (k % 2)))
    z = ion("C Zn %d" % k, CAT, p, 11.3 + 0.12 * k, r=0.2)
    glide(z, 12.6 + 0.45 * k, 14.2 + 0.45 * k, p, c0 + Vector((1.18, -0.25, 0.45 + 0.4 * k)))
big("C Lbl Zn", "Zn²⁺", c0 + Vector((-1.4, -1.0, 2.0)), 11.8, 12.6, mat=CAT, size=0.42)

# ---- D. non-metals are insulators, except graphite: the bulb stays dark, then lights with a graphite rod ----
d0 = S[3] + Vector((0, 0, -1.6))
battery("D", d0 + Vector((-2.2, 0, 0)), 16.0)
wire("D Wire A", [d0 + Vector((-1.5, 0, 0)), d0 + Vector((-0.75, 0, 0))], 16.1)
wire("D Wire B", [d0 + Vector((0.75, 0, 0)), d0 + Vector((1.6, 0, 0)), d0 + Vector((1.6, 0, 0.6))], 16.1)
bulb("D Off", d0 + Vector((1.6, 0, 0.6)), 16.1, 0.0, 18.0)
s_l = blob("D Sulphur", (0.42, 0.24, 0.22), mat_pbr("Sulphur V5", (0.95, 0.82, 0.15), roughness=0.85), d0, None, bump=0.2, seed=5)
pop(s_l, 16.2)
glide(s_l, 17.2, 17.8, d0, d0 + Vector((0, 4.0, 0.6)), antic=0.1)        # taken away backwards, not through the caption
rod = cyl("D Graphite", 0.16, 0.16, 1.5, mat_pbr("Graphite V5", (0.12, 0.12, 0.14), metallic=0.5, roughness=0.3),
          d0 + Vector((-0.75, 0, 0)), None, rot=(0, math.pi / 2, 0), segs=16)
hide_until(rod, sec(17.6))
glide(rod, 17.6, 18.0, d0 + Vector((-0.75, 0, 3.0)), d0 + Vector((-0.75, 0, 0)), antic=0.08)
bulb("D On", d0 + Vector((1.6, 0, 0.6)), 17.8, 1.0)

# ---- E. 'alkali' = the ashes: plant twigs burn down to a heap of white ash ----
e0 = S[4] + Vector((0, 0, -1.8))
dish = cyl("E Dish", 1.5, 1.2, 0.25, mat_pbr("Stone Dish V5", (0.3, 0.29, 0.28), roughness=0.9), e0, None, base=True, segs=40)
for k in range(5):
    tw = cyl("E Twig %d" % k, 0.06, 0.04, 1.6, mat_pbr("Twig V5", (0.32, 0.2, 0.1), roughness=0.85),
             e0 + Vector((-0.5 + 0.25 * k, 0.1 * (k % 2), 0.75)), None, rot=(0.25 * (k - 2), 0.5 * (k - 2), 0), segs=10)
    dissolve_out(tw, 23.0 + 0.25 * k, 1.8)
fire("E Fire", e0 + Vector((0, -0.1, 0.35)), (1.0, 0.5, 0.12), 20.4, 25.2, s=1.15)
ash = blob("E Ash", (1.0, 0.9, 0.45), mat_pbr("Plant Ash V5", (0.72, 0.71, 0.68), roughness=0.95), e0 + Vector((0, 0, 0.25)),
           None, bump=0.25, seed=9)
kf(ash, "scale", 0, (0, 0, 0), 'CONSTANT')
kf(ash, "scale", sec(22.6), (0.3, 0.3, 0.1), 'BEZIER')
kf(ash, "scale", sec(25.4), (1, 1, 1), 'BEZIER')
big("E Lbl", "ashes", e0 + Vector((0, -1.2, 1.7)), 25.4, None, mat=M["gold"], size=0.5)

# ---- F. with water they make strong alkalies: sodium drops in, darts and fizzes, red litmus turns blue ----
f0 = S[5] + Vector((0, 0, -2.2))
w_top = trough("F", f0, 27.0, w=4.2, h=1.5)
na = blob("F Na", (0.22, 0.18, 0.13), METAL_M["Na"], f0, None, bump=0.12, seed=2)
t_hit = fall(na, 27.6, w_top + Vector((-0.6, -0.2, 2.6)), w_top + Vector((-0.6, -0.2, 0.05)), bounce=0.0, soft=True)
splash("F", w_top + Vector((-0.6, -0.2, 0)), t_hit - 0.1, r=0.7)
glide(na, t_hit + 0.3, t_hit + 2.2, w_top + Vector((-0.6, -0.2, 0.05)), w_top + Vector((0.7, -0.2, 0.05)), antic=0.0, over=0.05)
fizz("F Na", w_top + Vector((0.0, -0.3, -0.05)), t_hit + 0.1, 33.0, n=9, spread=0.7, rise=0.8, period=0.8, r=0.05)
litmus("F Lit", w_top + Vector((1.55, -0.4, 0.2)), 29.2, "red", "blue", 31.0)

# ---- G. the group IA column: hydrogen sits on top but is NOT an alkali metal ----
g0 = S[6]
h_tile = tile("G H", "H", g0 + Vector((0, 0, 3.15)), "nonmetal", 33.1)
glide(h_tile, 34.0, 34.8, g0 + Vector((0, 0, 3.15)), g0 + Vector((-1.9, 0, 3.15)))
glide(bpy.data.objects[N("G H Sym")], 34.0, 34.8, g0 + Vector((0, -0.25, 3.1)), g0 + Vector((-1.9, -0.25, 3.1)))
for k, sy in enumerate(SYMS):
    tile("G %s" % sy, sy, g0 + Vector((0, 0, 2.2 - 0.95 * k)), "metal", 34.9 + 0.3 * k)
big("G Lbl", "IA", g0 + Vector((1.0, -0.6, 2.2)), 36.8, None, mat=M["gold"], size=0.5)

# ---- H. potassium (2, 8, 8, 1): its one outer electron, in an s sub-shell, leaves → K⁺ ----
h0 = S[7]
ga, radii, outer = atom3d("H K", 19, h0, 39.1, spin_until=42.6, scale=0.8)
scene.frame_set(sec(43.0))
e = outer[0]
ep = e.matrix_world.translation.copy()
big("H Lbl s", "s", ep + Vector((0.35, -0.3, 0.35)), 43.0, 45.4, mat=M["gold"], size=0.42)
halo(e, [43.0])
wobble(e, 44.2, amp=0.25, dur=0.5)                  # anticipation: it shivers, then goes
hide_from(e, sec(44.8))
travel("H Fly", ep, ep + (ep - h0).normalized() * 3.2 + Vector((0, -0.3, 0.4)), 44.8, dur=1.2, lift=0.3)
drop_ring("H K", len(radii) - 1, 46.0)
charge("H Sign", "+", h0 + Vector((radii[-2] * 0.95 + 0.2, -0.5, radii[-2] * 0.9)), 46.4, None, size=0.95)

# ---- I. K⁺ (small) meets Cl⁻ (big): they pull together into KCl (ionic) ----
i0 = S[8]
kp = sphere("I K+", 0.55, gloss("K Ion V5", (1.0, 0.5, 0.12)), i0 + Vector((-2.6, 0, 0)), None, 32, 16)
cl = sphere("I Cl-", 0.85, gloss("Cl Ion V5", (0.25, 0.85, 0.35)), i0 + Vector((2.6, 0, 0)), None, 32, 16)
pop(kp, 48.2, (0.55,) * 3)
pop(cl, 48.5, (0.85,) * 3)
charge("I S K", "+", i0 + Vector((-2.6, -0.6, 0.75)), 48.4, 50.0, size=0.7)
charge("I S Cl", "−", i0 + Vector((2.6, -0.9, 1.05)), 48.7, 50.0, size=0.7)
glide(kp, 50.0, 51.2, i0 + Vector((-2.6, 0, 0)), i0 + Vector((-0.7, 0, 0)), antic=0.08)
glide(cl, 50.0, 51.2, i0 + Vector((2.6, 0, 0)), i0 + Vector((0.68, 0, 0)), antic=0.08)
big("I Lbl", "KCl", i0 + Vector((0, -1.0, 1.4)), 51.4, None, mat=M["gold"], size=0.55)

# ---- J. where they are found: never free (one place at a time across the shot) ----
j0 = S[9] + Vector((0, 0, -1.6))
rk = lib_obj("J Rock", "rock_07_LOD2", j0 + Vector((-0.2, 0, 0)), size=1.0, rot=(0, 0, 1.2))
pop(rk, 53.1, tuple(rk.scale))
for k in range(5):
    q = j0 + Vector((-0.7 + 0.35 * k, -1.4, 0.6 + 0.12 * ((k * 7) % 3)))
    d = sphere("J Li %d" % k, 0.09, CAT, q, None, 12, 6)
    pop(d, 54.0 + 0.18 * k, (0.09,) * 3)
big("J Lbl", "LiAl(SiO₃)₂", j0 + Vector((0, -1.2, 2.4)), 55.0, 58.0, mat=M["gold"], size=0.45)
hide_from(rk, sec(58.0), tuple(rk.scale))
# the crust: 1,000 grains, 24 of them sodium and potassium (2.4 %)
grain = mat_pbr("Crust Grain V5", (0.42, 0.36, 0.3), roughness=0.9)
gold_grain = mat_emit("Crust NaK V5", (1.0, 0.72, 0.3), 2.5)
rnd = random.Random(24)
slab = empty("J Slab", j0 + Vector((0, 0, 0.4)))
gold_idx = set(rnd.sample(range(200), 5))           # 200 shown, 5 lit (≈ 2.4 %)
for k in range(200):
    x, z = (k % 20) * 0.22 - 2.1, (k // 20) * 0.22 - 1.0
    b = box("J G %d" % k, (0.19, 0.19, 0.19), gold_grain if k in gold_idx else grain, (x, 0, z), slab)
hide_until(slab, sec(58.0))
pop(slab, 58.0, (1, 1, 1))
for n, k in enumerate(sorted(gold_idx)):
    pulse(bpy.data.objects[N("J G %d" % k)], 59.2 + 0.25 * n, 1.6)
hide_from(slab, sec(63.0), (1, 1, 1))
# potassium salt deposit: white cubic salt crystals, a few rubidium / caesium grains among them
dep = empty("J Deposit", j0 + Vector((0, 0, 0.3)))
for k in range(26):
    x, z = (k % 9) * 0.5 - 2.0 + rnd.random() * 0.1, (k // 9) * 0.5 - 0.3
    s_ = 0.3 + rnd.random() * 0.12
    cr = box("J Salt %d" % k, (s_, s_, s_), SALT_W, (x, 0, z), dep)
    cr.rotation_euler = (rnd.random() * 0.4, rnd.random() * 0.6, rnd.random() * 0.4)
for k, (sy, x, z) in enumerate((("Rb", -0.6, 0.55), ("Cs", 1.0, 0.1))):
    gr = sphere("J %s" % sy, 0.16, mat_emit("Grain %s V5" % sy, (1.0, 0.55, 0.75), 2.5), (x, -0.35, z), dep, 16, 8)
    big("J Lbl %s" % sy, sy, j0 + Vector((x, -1.0, z + 0.9)), 64.8 + 0.6 * k, 68.0, size=0.42)
hide_until(dep, sec(63.0))
pop(dep, 63.0, (1, 1, 1))
hide_from(dep, sec(68.0), (1, 1, 1))

# ---- K. francium: not found in nature, made in the laboratory ----
k0 = S[10] + Vector((0, 0, -1.8))
lib_obj("K Beaker", "chemistry_set_beaker_large", k0, size=0.9)
lib_obj("K Burner", "bunsen_burner", k0 + Vector((-2.2, 0.3, 0)), size=1.6)
fr = sphere("K Fr", 0.14, mat_emit("Fr Atom V5", (1.0, 0.75, 0.3), 4.0), k0 + Vector((0, 0, 1.4)), None, 16, 8)
pop(fr, 69.0, (0.14,) * 3)
halo(fr, [69.6, 71.6])
tile("K Tile", "Fr", k0 + Vector((2.0, -0.2, 1.6)), "metal", 70.2)
finish_film()
