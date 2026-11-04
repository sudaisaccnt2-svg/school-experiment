# ---- Film 715: Corrosion and rusting (textbook pp.206-208: 7.7 corrosion = slow eating away of a metal by its  (v4 captions)
# surroundings, a spontaneous redox change; Society: photographic film (light makes silver grains); 7.7.1 rusting needs
# both water and air; Fig 7.11: a water drop on iron: anodic site 2Fe → 2Fe²⁺ + 4e⁻, electrons flow through the metal to the
# cathodic site, 2H₂O + O₂ + 4e⁻ → 4OH⁻; Fe²⁺ → Fe³⁺ + e⁻, Fe³⁺ + 3OH⁻ → Fe(OH)₃ = rust (Fe₂O₃·xH₂O), soft and porous) ----
start_film("715", "715 Corrosion and Rusting", 76.5)
END = scene.frame_end
SA, SB, SC, SD = (Vector((40 * k, 0, 0)) for k in range(4))

shot("Cam Corrosion", 0, 10, SA + Vector((0, 0, -0.8)), dist=12, pitch=0.1)
shot("Cam Photo", 10, 18, SB + Vector((0, 0, -0.8)), dist=12, pitch=0.12)
shot("Cam Needs", 18, 28, SC + Vector((0, 0, -1.0)), dist=14, pitch=0.1)
shot("Cam Drop", 28, 66, SD + Vector((0, 0, -1.7)), dist=13, pitch=0.12)
shot("Cam Rust", 66, None, SD + Vector((0, 0, -1.5)), dist=11, pitch=0.15)
for name, t in (("Corrosion", 0), ("Photography", 10), ("Water and air", 18), ("Rusting", 28), ("Porous rust", 66)):
    act(name, sec(t))

say('A1', 'Metal eaten away: corrosion', 0.1, 5)
say('A2', "Iron's corrosion: rust", 5, 10)
say('B1', 'Light makes silver grains', 10, 18)
say('C1', 'Dry air or no air: no rust', 18, 23)
say('C2', 'Water + air: rust', 23, 28)
say('D1', 'A drop of water on iron', 28, 34)
say('D2', 'Iron dissolves under the middle', 34, 41)
say('D3', 'Electrons run to the edge', 41, 47)
say('D4', 'Oxygen and water take them', 47, 55)
say('D5', 'Fe³⁺ meets OH⁻: rust', 55, 66)
say('E1', 'Rust flakes off', 66, 76)

# ---- A. a shiny bar gathers rust ----
a0 = SA + Vector((0, 0, -0.8))
bar = box("A Bar", (4.0, 0.8, 0.8), IRON, a0)
appear(bar, sec(0.4), dur=10)
rnd = random.Random(7)
for k in range(14):
    p = a0 + Vector((rnd.uniform(-1.8, 1.8), -0.42, rnd.uniform(-0.3, 0.3)))
    rs = rnd.uniform(0.12, 0.24)
    sp = sphere("A Rust %d" % k, rs, RUST, p, None, 12, 6)
    sp.scale = (rs, rs * 0.4, rs)
    appear(sp, sec(2.5 + 0.35 * k), s=(rs, rs * 0.4, rs))
big("Lbl A", "rust", a0 + Vector((0, -0.6, 1.0)), 6.0, None, mat=M["white"], size=0.45)

# ---- B. a film strip: light makes silver grains ----
b0 = SB + Vector((0, 0, -1.2))
film = box("B Film", (4.2, 2.4, 0.08), mat_pbr("Film U7", (0.5, 0.45, 0.35), roughness=0.5), b0)
appear(film, sec(10.3), dur=10)
beam("B Beam", b0 + Vector((-1.0, 0, 3.0)), b0 + Vector((-1.0, 0, 0.1)), 11.5, 15.0, r=0.18)
for k in range(12):
    p = b0 + Vector((-1.0 + rnd.uniform(-0.45, 0.45), rnd.uniform(-0.45, 0.45), 0.06))
    g = sphere("B Ag %d" % k, 0.1, mat_pbr("Silver Grain U7", (0.05, 0.05, 0.06), roughness=0.4), p, None, 8, 4)
    appear(g, sec(12.5 + 0.15 * k), s=(0.1,) * 3)
big("Lbl B", "Ag", b0 + Vector((1.2, -0.6, 0.8)), 14.5, None, mat=M["white"], size=0.45)

# ---- C. three nails: air only, water only (no air), water + air ----
c0 = SC + Vector((0, 0, -2.2))
setups = ((-3.4, None, "dry air"), (0, WATER, "no air"), (3.4, WATER, "water + air"))
for k, (x, liq, word) in enumerate(setups):
    cc = c0 + Vector((x, 0, 0))
    j = jar("C Jar %d" % k, 0.9, 2.6, cc)
    appear(j, sec(18.3 + 0.4 * k), dur=10)
    if liq:
        lq = liquid("C Liq %d" % k, 0.86, 1.6 if k == 1 else 1.2, cc, liq)
        appear(lq, sec(18.5 + 0.4 * k), dur=10)
    if k == 1:
        oil = cyl("C Oil", 0.86, 0.86, 0.15, mat_emit("Oil Layer U7", (1.0, 0.8, 0.3), 0.6, alpha=0.6), cc + Vector((0, 0, 1.6)),
                  base=True)
        appear(oil, sec(19.2), dur=10)
    nl = box("C Nail %d" % k, (0.14, 0.14, 1.8), IRON, cc + Vector((0, 0, 1.2)))
    appear(nl, sec(18.8 + 0.4 * k), dur=10)
    big("Lbl C %d" % k, word, cc + Vector((0, -1.1, 3.1)), 19.5 + 0.6 * k, None, mat=M["white"], size=0.4)
for k in range(5):
    p = c0 + Vector((3.4 + 0.09 * (k % 2), -0.1, 0.6 + 0.25 * k))
    sp = sphere("C Rust %d" % k, 0.1, RUST, p, None, 10, 5)
    appear(sp, sec(23.5 + 0.4 * k), s=(0.1,) * 3)

# ---- D. Fig 7.11: a drop on an iron plate ----
d0 = SD + Vector((0, 0, -1.8))
slab = box("D Iron", (8.0, 1.6, 1.2), IRON, d0 + Vector((0, 0, -0.6)))
appear(slab, sec(28.3), dur=10)
drop = sphere("D Drop", 1.0, WATER, d0, None, 40, 20)
drop.scale = (2.6, 0.75, 1.1)
appear(drop, sec(29.0), s=(2.6, 0.75, 1.1))
big("Lbl D A", "anodic site", d0 + Vector((0, -1.0, -0.6)), 31.0, None, mat=M["cyan"], size=0.4)
big("Lbl D C", "cathodic site", d0 + Vector((2.9, -1.0, -0.6)), 42.0, None, mat=M["red"], size=0.4)
for k in range(2):
    a = d0 + Vector((-0.25 + 0.5 * k, -0.6, 0.05))
    fe = ion("D Fe2 %d" % k, CAT, a, 35.0 + 0.5 * k, r=0.17)
    move(fe, sec(35.2 + 0.5 * k), sec(37.5 + 0.5 * k), a, d0 + Vector((-0.25 + 0.5 * k, -0.6, 0.7)))
    move(fe, sec(56.0), sec(58.5), d0 + Vector((-0.25 + 0.5 * k, -0.6, 0.7)), d0 + Vector((-0.1 + 0.2 * k, -0.6, 0.35)))
    hide_from(fe, sec(59.0), (0.17,) * 3)
for k in range(4):
    a, b = d0 + Vector((-0.3 + 0.2 * k, -0.85, -0.3)), d0 + Vector((2.4, -0.85, -0.25))
    e = electron("D e %d" % k, None, a, 0.11, mat=E_BLUE)
    appear(e, sec(41.0 + 0.4 * k), s=tuple(e.scale))
    move(e, sec(42.0 + 0.5 * k), sec(45.0 + 0.5 * k), a, b, 'LINEAR')
    hide_from(e, sec(48.5))
ohs = []
for k in range(3):
    p = d0 + Vector((2.2 + 0.25 * (k % 2), -0.6, 0.15 + 0.25 * k))
    oh = ion("D OH %d" % k, ANI, p, 48.5 + 0.4 * k, r=0.15)
    move(oh, sec(56.0), sec(58.5), p, d0 + Vector((0.4 + 0.2 * k, -0.6, 0.4)))
    hide_from(oh, sec(59.0), (0.15,) * 3)
rust = sphere("D Rust", 1.0, mat_pbr("Rust Lump U7", (0.3, 0.1, 0.03), roughness=0.95), d0 + Vector((0, -0.2, 0.25)), None, 24, 12)
appear(rust, sec(59.0), dur=30, s=(0.9, 0.5, 0.45))
big("Lbl D R", "rust", d0 + Vector((0, -1.0, 1.6)), 60.0, None, mat=M["gold"], size=0.45)

# ---- E. flakes fall off, the iron below rusts again ----
for k in range(5):
    p0 = d0 + Vector((-0.6 + 0.3 * k, -0.6, 0.6))
    fl = box("E Flake %d" % k, (0.3, 0.06, 0.22), RUST, p0)
    appear(fl, sec(67.0 + 0.3 * k), dur=6)
    move(fl, sec(68.0 + 0.4 * k), sec(70.0 + 0.4 * k), p0, p0 + Vector((1.5 * (k - 2) * 0.5, -0.4, -1.5)))
    hide_from(fl, sec(71.0 + 0.4 * k))
finish_film()
