# Look-dev (user 2026-10-12: "can we use Cycles-baked lighting?"): bake realistic studio light for the STILL parts of
# one code-lesson set (804 water test: wooden bench + studio backdrop), lit by soft area lights and shadowed by the
# real glass beakers with water. Moving things, glass, water and 2D effects stay live in three.js.
#   "C:\Program Files\Blender Foundation\Blender 4.5\blender.exe" -b --factory-startup --python scripts/lookdev_bake.py
# Writes web/lesson/bake/set804w.glb (unlit, baked textures). Coordinates: three (x, y, z) = Blender (x, -z, y).
import bpy, bmesh, math, os
from mathutils import Vector

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "web", "lesson", "bake"); os.makedirs(OUT, exist_ok=True)
PARK = os.environ.get("PARK") == "1"
HDRI = os.environ.get("HDRI", "eilenriede_park_4k.hdr"); NAME = HDRI.split("_2k")[0].split("_4k")[0]   # PARK=1 HDRI=meadow_2k.hdr SUN=0: light only from the photo (it holds the real sun)
G = -3.1                                             # outdoors: the ground the table legs stand on (three y)                  # user 2026-10-13: outdoor/nature background instead of the dark studio
SAMPLES, HEAD = 512, 0.5                           # stored = radiance × 0.5 (three.js multiplies by 2)
for o in list(bpy.data.objects): bpy.data.objects.remove(o)
sc = bpy.context.scene; sc.render.engine = 'CYCLES'
cp = bpy.context.preferences.addons["cycles"].preferences; cp.compute_device_type = 'OPTIX'; cp.get_devices()
for d in cp.devices: d.use = d.type == 'OPTIX'
sc.cycles.device = 'GPU'; sc.cycles.samples = SAMPLES; sc.cycles.use_denoising = False
sc.cycles.max_bounces = 12; sc.cycles.transmission_bounces = 12; sc.cycles.caustics_refractive = True

def P(x, y, z): return Vector((x, -z, y))           # three → Blender

def mat(name, build):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; build(nt, nt.nodes["Principled BSDF"]); return m

# ---- materials -----------------------------------------------------------------------------------------------
def wood(nt, b):                                    # warm walnut: long grain along x, darker streaks, satin finish
    tc = nt.nodes.new("ShaderNodeTexCoord"); mp = nt.nodes.new("ShaderNodeMapping"); mp.inputs["Scale"].default_value = (1.0, 14.0, 1.0)
    wv = nt.nodes.new("ShaderNodeTexWave"); wv.wave_type = 'BANDS'; wv.bands_direction = 'Y'; wv.inputs["Scale"].default_value = 2.2
    wv.inputs["Distortion"].default_value = 9.0; wv.inputs["Detail"].default_value = 6.0; wv.inputs["Detail Scale"].default_value = 1.5
    ns = nt.nodes.new("ShaderNodeTexNoise"); ns.inputs["Scale"].default_value = 40.0
    ramp = nt.nodes.new("ShaderNodeValToRGB"); ramp.color_ramp.elements[0].color = (0.028, 0.019, 0.014, 1); ramp.color_ramp.elements[1].color = (0.085, 0.058, 0.04, 1)
    mix = nt.nodes.new("ShaderNodeMath"); mix.operation = 'MULTIPLY_ADD'; mix.inputs[1].default_value = 0.85
    l = nt.links.new; l(tc.outputs["Object"], mp.inputs["Vector"]); l(mp.outputs["Vector"], wv.inputs["Vector"]); l(tc.outputs["Object"], ns.inputs["Vector"])
    l(wv.outputs["Fac"], mix.inputs[0]); l(ns.outputs["Fac"], mix.inputs[2]); l(mix.outputs[0], ramp.inputs["Fac"]); l(ramp.outputs["Color"], b.inputs["Base Color"])
    b.inputs["Roughness"].default_value = 0.42; b.inputs["Coat Weight"].default_value = 0.35; b.inputs["Coat Roughness"].default_value = 0.2
    if PARK:                                         # outdoors: lighter matte garden-table wood (a varnish would bake the blue sky in)
        ramp.color_ramp.elements[0].color = (0.075, 0.045, 0.026, 1); ramp.color_ramp.elements[1].color = (0.24, 0.15, 0.085, 1)
        b.inputs["Roughness"].default_value = 0.75; b.inputs["Coat Weight"].default_value = 0.0; b.inputs["Specular IOR Level"].default_value = 0.2
def studio(nt, b): b.inputs["Base Color"].default_value = (0.03, 0.036, 0.05, 1); b.inputs["Roughness"].default_value = 0.9
def glass(nt, b): b.inputs["Transmission Weight"].default_value = 1.0; b.inputs["Roughness"].default_value = 0.02; b.inputs["IOR"].default_value = 1.5
def water(nt, b): b.inputs["Base Color"].default_value = (0.35, 0.62, 0.95, 1); b.inputs["Transmission Weight"].default_value = 1.0; b.inputs["Roughness"].default_value = 0.0; b.inputs["IOR"].default_value = 1.33
WOOD, STUDIO, GLASS, WATER = mat("Wood 804", wood), mat("Studio 804", studio), mat("Glass 804", glass), mat("Water 804", water)
def see_through_shadow(m, tint):                    # glass lets light through: its shadow is faint and tinted, not black
    nt = m.node_tree; out = nt.nodes["Material Output"]; bsdf = nt.nodes["Principled BSDF"]
    lp = nt.nodes.new("ShaderNodeLightPath"); tr = nt.nodes.new("ShaderNodeBsdfTransparent"); tr.inputs["Color"].default_value = tint
    mx = nt.nodes.new("ShaderNodeMixShader"); nt.links.new(lp.outputs["Is Shadow Ray"], mx.inputs[0]); nt.links.new(bsdf.outputs[0], mx.inputs[1])
    nt.links.new(tr.outputs[0], mx.inputs[2]); nt.links.new(mx.outputs[0], out.inputs["Surface"])
see_through_shadow(GLASS, (0.9, 0.93, 0.95, 1)); see_through_shadow(WATER, (0.62, 0.8, 1.0, 1))

def mesh(name, verts, faces, m, uvs=None):
    me = bpy.data.meshes.new(name); me.from_pydata(verts, [], faces); me.update()
    if uvs:
        uv = me.uv_layers.new(name="UVMap")
        for poly in me.polygons:
            for li in poly.loop_indices: uv.data[li].uv = uvs[me.loops[li].vertex_index]
    o = bpy.data.objects.new(name, me); sc.collection.objects.link(o); o.data.materials.append(m)
    for p in me.polygons: p.use_smooth = True
    return o

# ---- bench (same size as kit.bench(3.9, 1.5) at the water station; its top at y = -0.002) ----------------------
W, D, T, Z0 = 3.9, 1.5, 0.07, 0.1
bpy.ops.mesh.primitive_cube_add(size=1, location=P(0, -0.002 - T / 2, Z0)); bench = bpy.context.object; bench.name = "Bench 804"
bench.scale = (W, D, T); bpy.ops.object.transform_apply(scale=True)
bev = bench.modifiers.new("b", 'BEVEL'); bev.width = 0.008; bev.segments = 3; bpy.ops.object.modifier_apply(modifier="b")
bench.data.materials.append(WOOD)
if PARK:                                             # outdoors the bench is a table: legs + apron going down out of view
    parts = [bench]
    for (lx, lz) in ((-1.85, -0.55), (1.85, -0.55), (-1.85, 0.75), (1.85, 0.75)):
        bpy.ops.mesh.primitive_cube_add(size=1, location=P(lx, -1.6, Z0 + lz * 0.95)); o = bpy.context.object; o.scale = (0.1, 0.1, 3.0); parts.append(o)
    for (ax, az, sx, sz) in ((0, 0.6, 3.6, 0.04), (0, -0.4, 3.6, 0.04)):
        bpy.ops.mesh.primitive_cube_add(size=1, location=P(ax, -0.2, Z0 + az * 1.1)); o = bpy.context.object; o.scale = (sx, sz, 0.25); parts.append(o)
    for o in parts[1:]: bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o; bpy.ops.object.transform_apply(scale=True); o.data.materials.append(WOOD)
    bpy.ops.object.select_all(action='DESELECT')
    for o in parts: o.select_set(True)
    bpy.context.view_layer.objects.active = bench; bpy.ops.object.join()
# ---- studio backdrop: floor that curves up into a wall behind (one seamless cyc) --------------------------------
prof = []                                            # (z, y) along the profile, floor first
for k in range(25): prof.append((4.0 - k * (5.0 / 24), -0.075))
for k in range(1, 17): a = k / 16 * math.pi / 2; prof.append((-1.0 - 1.4 * math.sin(a), -0.075 + 1.4 * (1 - math.cos(a))))
for k in range(1, 9): prof.append((-2.4, 1.325 + k * 0.45))
L = [0];
for k in range(1, len(prof)): L.append(L[-1] + math.dist(prof[k], prof[k - 1]))
NX, X0, X1 = 41, -6.0, 6.0
verts, uvs, faces = [], [], []
for k, (z, y) in enumerate(prof):
    for i in range(NX): x = X0 + (X1 - X0) * i / (NX - 1); verts.append(P(x, y, z)); uvs.append((i / (NX - 1), L[k] / L[-1]))
for k in range(len(prof) - 1):
    for i in range(NX - 1): a = k * NX + i; faces.append((a, a + 1, a + NX + 1, a + NX))
cyc = None if PARK else mesh("Studio 804", verts, faces, STUDIO, uvs)
# ---- the three beakers with water (only to cast real glass shadows on the bench; not exported) ----------------
def lathe(name, prof2, m, x):
    N = 64; vs, fs = [], []
    for (r, y) in prof2:
        for i in range(N): a = i / N * 2 * math.pi; vs.append(P(x + r * math.cos(a), y, r * math.sin(a)))
    for k in range(len(prof2) - 1):
        for i in range(N): a = k * N + i; b = k * N + (i + 1) % N; fs.append((a, b, b + N, a + N))
    return mesh(name, vs, fs, m)
R, H = 0.27, 0.52
bprof = [(0, 0), (R, 0), (R + 0.04, 0.03), (R + 0.04, H), (R + 0.08, H + 0.05), (R + 0.1, H + 0.07), (R + 0.07, H + 0.07), (R + 0.01, H + 0.01), (R + 0.01, 0.05), (0, 0.05)]
casters = []
for i in range(3):
    x = (i - 1) * 1.22
    casters.append(lathe(f"Beaker {i}", bprof, GLASS, x))
    casters.append(lathe(f"Water {i}", [(0, 0.058), (R, 0.058), (R, 0.358), (0, 0.358)], WATER, x))
# ---- light: one big warm softbox (key, same side as the live key light), a cool rim, a little sky -------------
def area(name, loc, size, power, color):
    ld = bpy.data.lights.new(name, 'AREA'); ld.shape = 'RECTANGLE'; ld.size = size; ld.size_y = size * 0.7; ld.energy = power; ld.color = color
    o = bpy.data.objects.new(name, ld); sc.collection.objects.link(o); o.location = loc
    d = Vector((0, 0, 0.3)) - o.location; o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler(); return o
if not PARK: area("Key", P(-4.2, 4.6, -0.6), 3.0, 2400, (1.0, 0.93, 0.84))   # from the left, a little behind: shadows fall to the right, in view
if not PARK: area("Rim", P(3.5, 3.2, -4.5), 2.4, 1500, (0.72, 0.84, 1.0))
if not PARK: area("Fill", P(1.5, 2.0, 5.0), 4.0, 300, (0.9, 0.95, 1.0))
if PARK and float(os.environ.get("SUN", "4.0")) > 0:   # a soft sun from the same side as the studio key (shadows fall right, in view)
    sd = bpy.data.lights.new("Sun", 'SUN'); sd.energy = float(os.environ.get("SUN", "4.0")); sd.angle = math.radians(6); sd.color = (1.0, 0.95, 0.86)
    so = bpy.data.objects.new("Sun", sd); sc.collection.objects.link(so); so.rotation_euler = (P(*map(float, os.environ["SUNDIR"].split(","))) if "SUNDIR" in os.environ else P(-4.2, 4.6, -0.6)).to_track_quat('Z', 'Y').to_euler()
w = bpy.data.worlds.new("W804"); sc.world = w; w.use_nodes = True
env = w.node_tree.nodes.new("ShaderNodeTexEnvironment"); env.image = bpy.data.images.load(os.path.join(ROOT, "assets", "polyhaven", "hdri", HDRI) if PARK else os.path.join(ROOT, "web", "env.hdr"))
w.node_tree.links.new(env.outputs["Color"], w.node_tree.nodes["Background"].inputs["Color"]); w.node_tree.nodes["Background"].inputs["Strength"].default_value = float(os.environ.get("ENV", "1.4")) if PARK else 0.25

# ---- bake ---------------------------------------------------------------------------------------------------
def bake(o, res, uv_ready):
    for x in bpy.context.view_layer.objects: x.select_set(False)
    o.select_set(True); bpy.context.view_layer.objects.active = o
    if not uv_ready:
        bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.uv.smart_project(island_margin=0.01); bpy.ops.object.mode_set(mode='OBJECT')
    img = bpy.data.images.new(o.name + " bake", res[0], res[1], float_buffer=True)
    nt = o.data.materials[0].node_tree; tn = nt.nodes.new("ShaderNodeTexImage"); tn.image = img; nt.nodes.active = tn
    sc.cycles.bake_type = 'COMBINED'; sc.render.bake.margin = 8
    bpy.ops.object.bake(type='COMBINED')
    px = list(img.pixels); px = [v * HEAD if (k % 4) != 3 else 1.0 for k, v in enumerate(px)]
    out = bpy.data.images.new(o.name + " out", res[0], res[1]); out.pixels = px
    path = os.path.join(OUT, o.name.replace(" ", "_").lower() + ("_" + NAME if PARK else "") + ".png"); out.filepath_raw = path; out.file_format = 'PNG'; out.save()
    nt.nodes.remove(tn); return path
pb = bake(bench, (2048, 2048) if PARK else (2048, 1024), False); pc = None if PARK else bake(cyc, (2048, 2048), True)
if PARK:                                             # the table's real shadow on the ground (user: "no floating ball, a transition"):
    import numpy as np                               # bake the ground's light with and without the table; shadow = 1 - ratio
    bpy.ops.mesh.primitive_plane_add(size=1, location=P(0, G, Z0)); gnd = bpy.context.object; gnd.name = "Ground 804"; gnd.scale = (14, 10, 1)
    bpy.ops.object.transform_apply(scale=True); gm = bpy.data.materials.new("Ground"); gm.use_nodes = True
    gm.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.8, 0.8, 0.8, 1); gm.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 1.0; gnd.data.materials.append(gm)
    bk = sc.render.bake; bk.use_pass_direct = True; bk.use_pass_indirect = True; bk.use_pass_color = False
    def gbake():
        for x in bpy.data.objects: x.select_set(False)
        gnd.select_set(True); bpy.context.view_layer.objects.active = gnd
        img = bpy.data.images.new("g", 1024, 768, float_buffer=True); nt = gm.node_tree; tn = nt.nodes.new("ShaderNodeTexImage"); tn.image = img; nt.nodes.active = tn
        bpy.ops.object.bake(type='DIFFUSE'); a = np.empty(1024 * 768 * 4, np.float32); img.pixels.foreach_get(a); nt.nodes.remove(tn); return a.reshape(768, 1024, 4)[:, :, :3].mean(2)
    lit = gbake()
    for o in [bench] + casters: o.hide_render = True
    free = gbake()
    for o in [bench] + casters: o.hide_render = False
    al = np.clip(1 - lit / np.maximum(free, 1e-5), 0, 1); out = np.zeros((768, 1024, 4), np.float32); out[:, :, 3] = al
    sim = bpy.data.images.new("gs", 1024, 768, alpha=True); sim.pixels.foreach_set(out.ravel()); sim.filepath_raw = os.path.join(OUT, "ground_804_" + NAME + ".png"); sim.file_format = 'PNG'; sim.save()
    bpy.data.objects.remove(gnd); print("GROUND", al.max(), al.mean())
# ---- export the baked pieces as unlit meshes (three.js shows the baked light as it is) --------------------------
for o, path in ((bench, pb),) if PARK else ((bench, pb), (cyc, pc)):
    m = bpy.data.materials.new(o.name + " baked"); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
    tn = nt.nodes.new("ShaderNodeTexImage"); tn.image = bpy.data.images.load(path); em = nt.nodes.new("ShaderNodeEmission"); outn = nt.nodes.new("ShaderNodeOutputMaterial")
    nt.links.new(tn.outputs["Color"], em.inputs["Color"]); nt.links.new(em.outputs["Emission"], outn.inputs["Surface"])
    o.data.materials.clear(); o.data.materials.append(m)
for o in casters: bpy.data.objects.remove(o)
for x in bpy.data.objects: x.select_set(x.type == 'MESH')
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, "set804w_" + NAME + ".glb" if PARK else "set804w.glb"), use_selection=True, export_yup=True, export_apply=True)
print("BAKED", pb, pc)
if PARK:                                             # the background photo for three.js: tone-mapped, slightly blurred later (PIL)
    import numpy as np
    im = env.image; w_, h_ = im.size; a = np.empty(w_ * h_ * 4, np.float32); im.pixels.foreach_get(a); a = a.reshape(h_, w_, 4)[::-1, :, :3]
    np.save(os.path.join(ROOT, "..", "tmp", "park.npy"), a[::2, ::2].astype(np.float16)); print("SAVED park.npy", a.shape)
