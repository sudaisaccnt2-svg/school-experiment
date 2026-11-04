# ---- 02: apparatus (bench, lead collimator, polonium, gold foil, ZnS screen, room, lights) ----
C = "Apparatus"
BEAM_Z = 0.8
RING_R = 3.0
GAP = math.radians(22)   # half-width of the opening toward the source

# --- materials ---
# Poly Haven scanned textures for the big surfaces, measured PBR values for the metals.
m_lead = mat_tex("Lead", "metal_plate_02", tile=12.0, maps=("Diffuse", "nor_gl", "Rough"), desat=0.15,
                 tint=(0.95, 0.96, 1.0), rough_mul=1.3, normal=0.5, metallic=0.35)
m_gold = mat_pbr("Gold Foil", (1.0, 0.766, 0.336), metallic=1.0, roughness=0.22, bump=0.08, bump_scale=60)
m_brass = mat_pbr("Brass", (0.91, 0.78, 0.42), metallic=1.0, roughness=0.3)
m_zns = mat_pbr("ZnS Phosphor", (0.55, 0.58, 0.52), roughness=0.85, bump=0.05, bump_scale=120)
m_frame = mat_pbr("Dark Steel", (0.05, 0.055, 0.06), metallic=1.0, roughness=0.4)
m_wood = mat_tex("Wood Bench", "wood_table_worn", tile=5.5, normal=0.8, rough_mul=1.35)
m_po = mat_emit("Polonium Glow", (1.0, 0.35, 0.25), 18.0)

# --- room / bench (real proportions: 1 BU = 10 cm -> 1.8 m x 1.0 m bench, 75 cm high) ---
BENCH_X, BENCH_W, BENCH_D, BENCH_H = -1.5, 18.0, 10.0, 7.5


def box_mesh(name, size, loc, mat, uv_unit=1.0):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1)
    bmesh.ops.scale(bm, vec=size, verts=bm.verts)
    box_uv(bm, uv_unit)
    ob = mesh_obj(name, bm, C, mat)
    ob.location = loc
    return ob


# (no floor: removed by hand in Blender; the camera sees the world's studio backdrop instead)

bench = box_mesh("Bench Top", (BENCH_W, BENCH_D, 0.4), (BENCH_X, 0, -0.2), m_wood)
bev = bench.modifiers.new("Bevel", 'BEVEL'); bev.width = 0.04; bev.segments = 3
for sx in (-1, 1):
    for sy in (-1, 1):
        leg = box_mesh("Bench Leg", (0.5, 0.5, BENCH_H - 0.4), (BENCH_X + sx * (BENCH_W / 2 - 0.6), sy * (BENCH_D / 2 - 0.6), -(BENCH_H + 0.4) / 2), m_wood)
        leg.modifiers.new("Bevel", 'BEVEL').width = 0.03

# --- lead container with collimator hole ---
box = box_mesh("Lead Container", (1.2, 1.2, 1.2), (-5.5, 0, 0.6), m_lead)
bev = box.modifiers.new("Bevel", 'BEVEL'); bev.width = 0.03; bev.segments = 3; bev.limit_method = 'ANGLE'
bm = bmesh.new()
bmesh.ops.create_cone(bm, cap_ends=True, segments=32, radius1=0.09, radius2=0.09, depth=1.0)
cutter = mesh_obj("Collimator Cutter", bm, C)
cutter.location = (-4.85, 0, BEAM_Z)
cutter.rotation_euler = (0, math.radians(90), 0)
cutter.hide_render = True
cutter.hide_viewport = True
boo = box.modifiers.new("Collimator", 'BOOLEAN'); boo.object = cutter; boo.operation = 'DIFFERENCE'

# polonium sample at the back of the hole + a real light cast
po = obj_from_mesh("Polonium", sphere_mesh("PoSphere", 0.075), C, (-5.33, 0, BEAM_Z), m_po)
ld = bpy.data.lights.new("Polonium Light", 'POINT')
ld.energy = 6.0; ld.color = (1.0, 0.4, 0.3); ld.shadow_soft_size = 0.03
pl = bpy.data.objects.new("Polonium Light", ld); pl.location = (-5.1, 0, BEAM_Z); link(pl, C)

# --- gold foil in a brass holder on a stand ---
bm = bmesh.new()
bmesh.ops.create_grid(bm, x_segments=48, y_segments=48, size=0.45)
foil = mesh_obj("Gold Foil", bm, C, m_gold)
foil.location = (0, 0, BEAM_Z)
foil.rotation_euler = (0, math.radians(90), 0)
tex = bpy.data.textures.new("FoilWrinkle", 'CLOUDS'); tex.noise_scale = 0.12
dm = foil.modifiers.new("Wrinkle", 'DISPLACE'); dm.texture = tex; dm.strength = 0.012; dm.mid_level = 0.5
foil.modifiers.new("Solidify", 'SOLIDIFY').thickness = 0.002
smooth(foil)

def bar(name, loc, dims, mat):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1)
    ob = mesh_obj(name, bm, C, mat)
    ob.location = loc; ob.scale = dims
    b = ob.modifiers.new("Bevel", 'BEVEL'); b.width = 0.008; b.segments = 2
    return ob

t = 0.06
for i, (dy, dz, sy, sz) in enumerate(((0, 0.48, 1.02, t), (0, -0.48, 1.02, t), (0.48, 0, t, 1.02), (-0.48, 0, t, 1.02))):
    bar("Foil Frame %d" % i, (0, dy, BEAM_Z + dz), (0.05, sy, sz), m_brass)
bm = bmesh.new()
bmesh.ops.create_cone(bm, cap_ends=True, segments=24, radius1=0.035, radius2=0.035, depth=0.3)
rod = mesh_obj("Foil Stand Rod", bm, C, m_brass); rod.location = (0, 0, 0.16); smooth(rod)
bm = bmesh.new()
bmesh.ops.create_cone(bm, cap_ends=True, segments=48, radius1=0.25, radius2=0.22, depth=0.04)
base = mesh_obj("Foil Stand Base", bm, C, m_brass); base.location = (0, 0, 0.02); smooth(base)

# --- zinc sulphide ring screen (open toward the source) ---
def ring_band(name, r_in, r_out, z0, z1, mat, segs=160):
    bm = bmesh.new()
    a0, a1 = -math.pi + GAP, math.pi - GAP
    rows = []
    for i in range(segs + 1):
        a = a0 + (a1 - a0) * i / segs
        c, s = math.cos(a), math.sin(a)
        rows.append([bm.verts.new((r * c, r * s, z)) for r, z in ((r_in, z0), (r_in, z1), (r_out, z1), (r_out, z0))])
    for i in range(segs):
        for k in range(4):
            bm.faces.new((rows[i][k], rows[i][(k + 1) % 4], rows[i + 1][(k + 1) % 4], rows[i + 1][k]))
    bm.faces.new(rows[0][::-1]); bm.faces.new(rows[-1])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    ob = mesh_obj(name, bm, C, mat)
    ob.data.materials.append(m_frame)
    # outer face and caps dark steel, inner face phosphor
    for p in ob.data.polygons:
        n = Vector(p.normal); ctr = Vector(p.center)
        radial = Vector((ctr.x, ctr.y, 0)).normalized()
        p.material_index = 0 if n.dot(radial) < -0.7 else 1
        p.use_smooth = abs(n.z) < 0.5
    b = ob.modifiers.new("Bevel", 'BEVEL'); b.width = 0.01; b.segments = 2; b.limit_method = 'ANGLE'
    return ob

ring_band("ZnS Screen", RING_R, RING_R + 0.08, 0.05, 1.45, m_zns)
ring_band("Screen Base Rail", RING_R - 0.04, RING_R + 0.12, 0.0, 0.06, m_frame)

# --- lights (three-point + practicals) ---
def area(name, loc, target, energy, size, color):
    ld = bpy.data.lights.new(name, 'AREA'); ld.energy = energy; ld.size = size; ld.color = color
    ld.shape = 'DISK'
    ob = bpy.data.objects.new(name, ld); ob.location = loc; link(ob, "Lights")
    d = Vector(target) - Vector(loc)
    ob.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    return ob

area("Key Light", (-4, -7, 8), (-1, 0, 0.5), 1400, 5.0, (1.0, 0.9, 0.78))
area("Fill Light", (6, -6, 3), (-1, 0, 0.5), 250, 6.0, (0.75, 0.85, 1.0))
area("Rim Light", (2, 8, 5), (-1, 0, 0.8), 900, 3.0, (0.6, 0.75, 1.0))
area("Atomic Rim", (60, 12, 18), (60, 0, 10), 600, 8.0, (0.7, 0.8, 1.0))
area("Model Key", (112, -14, 18), (114, 0, 10), 900, 6.0, (1.0, 0.95, 0.9))
area("Model Rim", (118, 10, 14), (114, 0, 10), 500, 5.0, (0.6, 0.75, 1.0))
print("apparatus ok")
