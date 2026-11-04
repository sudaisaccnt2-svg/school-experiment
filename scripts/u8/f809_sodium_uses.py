# ---- Film 809: Uses of sodium (textbook p.231: (c) i. making Na₂CO₃, NaHCO₃, NaOH, NaNH₂; ii. sodium vapour lamps
# (bright orange-yellow street lights); iii. coolant in nuclear reactors; iv. desulphurization of petroleum; v. reducing
# agent for titanium, zirconium; vi. alloys: sodium amalgam (with mercury) and with silver) (v4) ----
start_film("809", "809 Uses of Sodium", 48.5)
END = scene.frame_end
S = [Vector((40 * k, 0, 0)) for k in range(6)]
for k in range(6):
    shot("Cam U%d" % k, 8 * k, None if k == 5 else 8 * (k + 1), S[k] + Vector((0, 0, -0.6)), dist=10, pitch=0.06)
act("Uses of sodium", sec(0))

say('A', 'Makes Na₂CO₃, NaHCO₃, NaOH', 0.1, 8)
say('B', 'Street lamps glow orange-yellow', 8, 16)
say('C', 'Cools nuclear reactors', 16, 24)
say('D', 'Takes sulphur out of petrol', 24, 32)
say('E', 'Frees titanium and zirconium', 32, 40)
say('F', 'With mercury: sodium amalgam', 40, 48)

# 1 three jars of compounds
for k, f in enumerate(("Na₂CO₃", "NaHCO₃", "NaOH")):
    c = S[0] + Vector((-2.6 + 2.6 * k, 0, -1.6))
    j = jar("A Jar %d" % k, 0.65, 1.5, c, top=True)
    appear(j, sec(0.4 + 0.6 * k))
    lq = liquid("A Pow %d" % k, 0.6, 0.9, c + Vector((0, 0, 0.01)), mat=SALT_W)
    appear(lq, sec(0.6 + 0.6 * k))
    big("Lbl A %d" % k, f, c + Vector((0, -0.8, 2.1)), 0.8 + 0.6 * k, None, size=0.45)

# 2 a street lamp
b0 = S[1] + Vector((0, 0, -1.7))
cyl("B Post", 0.1, 0.1, 3.2, METAL, b0, None, base=True)
post = bpy.data.objects[N("B Post")]
appear(post, sec(8.3), dur=10)
arm = box("B Arm", (1.2, 0.12, 0.12), METAL, b0 + Vector((0.55, 0, 3.15)))
appear(arm, sec(8.4), dur=10)
lampg = sphere("B Glow", 0.35, mat_emit("Sodium Lamp U8", (1.0, 0.62, 0.12), 8.0), b0 + Vector((1.1, 0, 2.85)), None, 24, 12)
appear(lampg, sec(10.0), s=(0.35,) * 3)
cone = cyl("B Light", 1.6, 0.15, 2.6, mat_emit("Lamp Beam U8", (1.0, 0.65, 0.2), 1.2, alpha=0.18), b0 + Vector((1.1, 0, 1.4)),
           None)
appear(cone, sec(10.4), dur=12)

# 3 a reactor dome with liquid sodium running round a pipe
c0 = S[2] + Vector((-1.6, 0, -0.8))
dome = sphere("C Dome", 1.0, mat_pbr("Dome U8", (0.75, 0.77, 0.8), roughness=0.4), c0, None, 32, 16)
appear(dome, sec(16.3), s=(1.0, 1.0, 1.0))
loop = [c0 + Vector((1.0, -0.3, -0.6)), c0 + Vector((3.4, -0.3, -0.6)), c0 + Vector((3.4, -0.3, 1.0)),
        c0 + Vector((1.0, -0.3, 1.0)), c0 + Vector((1.0, -0.3, -0.6))]
wire("C Pipe", loop, 16.6)
flow("C Na", loop, 17.5, 24.0, n=10, speed=1.4, r=0.1, mat=mat_emit("Liquid Na U8", (1.0, 0.8, 0.3), 3.0))
big("Lbl C", "liquid Na", c0 + Vector((2.2, -0.8, 1.7)), 18.0, None, mat=M["gold"], size=0.45)

# 4 petrol drum: yellow sulphur balls leave into a sodium lump
d0 = S[3] + Vector((-1.6, 0, -1.8))
drum = cyl("D Drum", 0.9, 0.9, 2.2, mat_pbr("Drum U8", (0.15, 0.25, 0.6), metallic=0.6, roughness=0.4), d0, None, base=True)
appear(drum, sec(24.3), dur=12)
dn = lump("D Na", S[3] + Vector((2.0, 0, -1.2)), 0.5, NA_M, 24.6)
for k in range(5):
    p = d0 + Vector((-0.4 + 0.2 * k, -1.0, 1.6))
    s_ = sphere("D S %d" % k, 0.13, cpk_mat("S"), p, None, 12, 6)
    appear(s_, sec(25.0 + 0.2 * k), s=(0.13,) * 3)
    move(s_, sec(26.5 + 0.5 * k), sec(28.0 + 0.5 * k), p, S[3] + Vector((1.7 + 0.15 * k, -0.6, -1.0)))
big("Lbl D", "S", d0 + Vector((0, -1.2, 2.4)), 25.4, None, mat=M["gold"], size=0.5)

# 5 titanium: a shiny lump appears
ti = lump("E Ti", S[4] + Vector((0, 0, -1.0)), 0.8, mat_pbr("Titanium U8", (0.72, 0.73, 0.78), metallic=1.0, roughness=0.2),
          32.6)
turn(ti, 33.0, 40.0, 0.3)
big("Lbl E", "Ti · Zr", S[4] + Vector((0, -0.8, 0.8)), 33.5, None, mat=M["gold"], size=0.55)

# 6 a mercury drop and a sodium lump merge
f0 = S[5] + Vector((0, 0, -1.2))
hg = blob("F Hg", (0.6, 0.6, 0.45), AG_M, f0 + Vector((0.8, 0, 0)))
appear(hg, sec(40.3), dur=10)
fn = lump("F Na", f0 + Vector((-2.0, 0, 0)), 0.45, NA_M, 40.5)
move(fn, sec(42.0), sec(44.0), f0 + Vector((-2.0, 0, 0)), f0 + Vector((0.4, 0, 0)))
dissolve_out(fn, 44.0, 0.8)
pulse(hg, 44.5, 1.3)
big("Lbl F", "amalgam", f0 + Vector((0.8, -0.8, 1.2)), 45.0, None, mat=M["gold"], size=0.5)
finish_film()
