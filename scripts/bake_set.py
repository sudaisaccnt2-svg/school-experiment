# Cycles-bake one station of a code lesson, standing on a studio photo's floor (user 2026-10-13: "use a studio HDRI,
# bake the lighting"; earlier: "not a floating ball, a transition"). Input: renders/bake/<lesson>_<station>_casters.glb
# from scripts/export_casters.py (BENCH = where the table goes; GLASS_/SOLID_ = still things that cast shadows).
#   set LESSON=804 STATION=water [HDRI=studio_small_09_2k.hdr ROLL=0.0 ENV=1.0 SAMPLES=512]
#   "C:\Program Files\Blender Foundation\Blender 4.5\blender.exe" -b --factory-startup --python scripts/bake_set.py
# Writes web/lesson/bake/<lesson>_<station>.glb (table with baked light, × 0.5 + "Shadow" plane: black, alpha = shadow)
# and web/lesson/bake/studio.hdr (the photo, turned by ROLL; the app uses the same file for the dome and reflections).
# Coordinates: three (x, y, z) = Blender (x, -z, y). The floor of the photo is at three y = G.
import bpy, math, os
import numpy as np
from mathutils import Vector

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "web", "lesson", "bake"); os.makedirs(OUT, exist_ok=True)
E = os.environ; LESSON, STATION = E.get("LESSON", "804"), E.get("STATION", "water")
HDRI, ROLL, ENV, SAMPLES = E.get("HDRI", "studio_small_09_2k.hdr"), float(E.get("ROLL", "0")), float(E.get("ENV", "1.0")), int(E.get("SAMPLES", "512"))
G, HEAD = -3.1, 0.5                                 # floor height (three y); baked light stored × 0.5 (three.js shows × 2)
for o in list(bpy.data.objects): bpy.data.objects.remove(o)
sc = bpy.context.scene; sc.render.engine = 'CYCLES'
cp = bpy.context.preferences.addons["cycles"].preferences; cp.compute_device_type = 'OPTIX'; cp.get_devices()
for d in cp.devices: d.use = d.type == 'OPTIX'
sc.cycles.device = 'GPU'; sc.cycles.samples = SAMPLES; sc.cycles.use_denoising = False
sc.cycles.max_bounces = 12; sc.cycles.transmission_bounces = 12
def P(x, y, z): return Vector((x, -z, y))           # three → Blender
def srgb(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]; return [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in c]

# ---- the photo: turned by ROLL (a fraction of a full turn), saved for the app -------------------------------------
img = bpy.data.images.load(os.path.join(ROOT, "assets", "polyhaven", "hdri", HDRI)); w_, h_ = img.size
a = np.empty(w_ * h_ * 4, np.float32); img.pixels.foreach_get(a); a = a.reshape(h_, w_, 4)
a = np.roll(a, int(round(ROLL * w_)), axis=1); img.pixels.foreach_set(a.ravel()); img.update()
web_hdr = os.path.join(OUT, "studio.hdr"); img.filepath_raw = web_hdr; img.file_format = 'HDR'; img.save()
w = bpy.data.worlds.new("W"); sc.world = w; w.use_nodes = True
env = w.node_tree.nodes.new("ShaderNodeTexEnvironment"); env.image = img
w.node_tree.links.new(env.outputs["Color"], w.node_tree.nodes["Background"].inputs["Color"]); w.node_tree.nodes["Background"].inputs["Strength"].default_value = ENV

# ---- materials ---------------------------------------------------------------------------------------------------
def mat(name):
    m = bpy.data.materials.new(name); m.use_nodes = True; return m, m.node_tree, m.node_tree.nodes["Principled BSDF"]
def see_through_shadow(m, tint):                    # glass lets light through: its shadow is faint and tinted, not black
    nt = m.node_tree; out = nt.nodes["Material Output"]; bsdf = nt.nodes["Principled BSDF"]
    lp = nt.nodes.new("ShaderNodeLightPath"); tr = nt.nodes.new("ShaderNodeBsdfTransparent"); tr.inputs["Color"].default_value = (*tint, 1)
    mx = nt.nodes.new("ShaderNodeMixShader"); nt.links.new(lp.outputs["Is Shadow Ray"], mx.inputs[0]); nt.links.new(bsdf.outputs[0], mx.inputs[1])
    nt.links.new(tr.outputs[0], mx.inputs[2]); nt.links.new(mx.outputs[0], out.inputs["Surface"])
def glass(hexc):
    m, nt, b = mat("G" + hexc); c = srgb(hexc); clear = hexc == "dff0ff"
    b.inputs["Base Color"].default_value = (1, 1, 1, 1) if clear else (*c, 1); b.inputs["Transmission Weight"].default_value = 1.0
    b.inputs["Roughness"].default_value = 0.03; b.inputs["IOR"].default_value = 1.45 if clear else 1.33
    see_through_shadow(m, (0.92, 0.95, 0.97) if clear else tuple(0.45 + 0.55 * v for v in c)); return m
def solid(hexc):
    m, nt, b = mat("S" + hexc); b.inputs["Base Color"].default_value = (*srgb(hexc), 1); b.inputs["Roughness"].default_value = 0.5; return m
def wood():                                          # walnut (the bench the user liked): long grain along x, satin finish
    m, nt, b = mat("Wood"); l = nt.links.new
    tc = nt.nodes.new("ShaderNodeTexCoord"); mp = nt.nodes.new("ShaderNodeMapping"); mp.inputs["Scale"].default_value = (1.0, 14.0, 1.0)
    wv = nt.nodes.new("ShaderNodeTexWave"); wv.wave_type = 'BANDS'; wv.bands_direction = 'Y'; wv.inputs["Scale"].default_value = 2.2
    wv.inputs["Distortion"].default_value = 9.0; wv.inputs["Detail"].default_value = 6.0; wv.inputs["Detail Scale"].default_value = 1.5
    ns = nt.nodes.new("ShaderNodeTexNoise"); ns.inputs["Scale"].default_value = 40.0
    ramp = nt.nodes.new("ShaderNodeValToRGB"); ramp.color_ramp.elements[0].color = (0.03, 0.014, 0.006, 1); ramp.color_ramp.elements[1].color = (0.095, 0.045, 0.02, 1)   # warm walnut (the white studio bounce pales it)
    mix = nt.nodes.new("ShaderNodeMath"); mix.operation = 'MULTIPLY_ADD'; mix.inputs[1].default_value = 0.85
    l(tc.outputs["Object"], mp.inputs["Vector"]); l(mp.outputs["Vector"], wv.inputs["Vector"]); l(tc.outputs["Object"], ns.inputs["Vector"])
    l(wv.outputs["Fac"], mix.inputs[0]); l(ns.outputs["Fac"], mix.inputs[2]); l(mix.outputs[0], ramp.inputs["Fac"]); l(ramp.outputs["Color"], b.inputs["Base Color"])
    b.inputs["Roughness"].default_value = 0.62; b.inputs["Specular IOR Level"].default_value = 0.25; return m   # matte: a varnish mirrors the white studio and goes pale

# ---- the still things of this station (shadow casters only; the app draws them live) ------------------------------
bpy.ops.import_scene.gltf(filepath=os.path.join(ROOT, "renders", "bake", "%s_%s_casters.glb" % (LESSON, STATION)))
casters, bench = [], None
for o in list(bpy.data.objects):
    if o.type != 'MESH': continue
    if o.name.startswith("BENCH"): bench = o; continue
    hexc = o.name.split("_")[1][:6]; o.data.materials.clear(); o.data.materials.append(glass(hexc) if o.name.startswith("GLASS") else solid(hexc)); casters.append(o)
bb = [bench.matrix_world @ Vector(c) for c in bench.bound_box]
X0, X1 = min(v.x for v in bb), max(v.x for v in bb); Z0, Z1 = min(-v.y for v in bb), max(-v.y for v in bb)   # three x / z range
CX, CZ, W, D = (X0 + X1) / 2, (Z0 + Z1) / 2, X1 - X0, Z1 - Z0; bpy.data.objects.remove(bench)

# ---- the table: top + legs + apron, standing on the floor ---------------------------------------------------------
def box(cx, cy, cz, sx, sy, sz):                     # three centre + three size
    bpy.ops.mesh.primitive_cube_add(size=1, location=P(cx, cy, cz)); o = bpy.context.object; o.scale = (sx, sz, sy)
    bpy.ops.object.transform_apply(scale=True); return o
T = 0.07; parts = [box(CX, -0.002 - T / 2, CZ, W, T, D)]
bev = parts[0].modifiers.new("b", 'BEVEL'); bev.width = 0.008; bev.segments = 3
bpy.context.view_layer.objects.active = parts[0]; bpy.ops.object.modifier_apply(modifier="b")
LH = -0.002 - T - G
for sx_ in (-1, 1):
    for sz_ in (-1, 1): parts.append(box(CX + sx_ * (W / 2 - 0.12), -0.002 - T - LH / 2, CZ + sz_ * (D / 2 - 0.12), 0.1, LH, 0.1))
for sz_ in (-1, 1): parts.append(box(CX, -0.002 - T - 0.12, CZ + sz_ * (D / 2 - 0.12), W - 0.24, 0.24, 0.04))
for sx_ in (-1, 1): parts.append(box(CX + sx_ * (W / 2 - 0.12), -0.002 - T - 0.12, CZ, 0.04, 0.24, D - 0.24))
WOOD = wood()
for o in parts: o.data.materials.append(WOOD)
bpy.ops.object.select_all(action='DESELECT')
for o in parts: o.select_set(True)
table = parts[0]; bpy.context.view_layer.objects.active = table; bpy.ops.object.join(); table.name = "Table"

# ---- a real light design on top of the photo (user 2026-10-13: "it looks flat"): one big warm softbox from the
# front-left (light side / shade side, shadows fall back-right where the camera sees them) + a cool rim from behind-right.
KEY = float(E.get("KEY", "0"))
def area(name, loc, size, power, color, aim):
    ld = bpy.data.lights.new(name, 'AREA'); ld.shape = 'RECTANGLE'; ld.size = size; ld.size_y = size * 0.7; ld.energy = power; ld.color = color
    o = bpy.data.objects.new(name, ld); sc.collection.objects.link(o); o.location = loc; o.rotation_euler = (aim - loc).to_track_quat('-Z', 'Y').to_euler()
if KEY > 0:
    # the rig of the studio bake the user approved ("yes i like the results"): key left & a little behind, so shadows fall right/forward, in view
    area("Key", P(CX - 2.8, 3.0, CZ - 0.5), 1.6, KEY, (1.0, 0.93, 0.84), P(CX + 0.4, 0.2, CZ))   # close + smaller: light falls off across the table (not flat)
    area("Rim", P(CX + 3.5, 3.2, CZ - 4.5), 2.4, KEY * 0.62, (0.72, 0.84, 1.0), P(CX, 0.3, CZ))
    area("Fill", P(CX + 1.5, 2.0, CZ + 5.0), 4.0, KEY * 0.125, (0.9, 0.95, 1.0), P(CX, 0.3, CZ))

# ---- bake the table's light -------------------------------------------------------------------------------------
bpy.ops.object.select_all(action='DESELECT'); table.select_set(True); bpy.context.view_layer.objects.active = table
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.uv.smart_project(island_margin=0.01); bpy.ops.object.mode_set(mode='OBJECT')
ti = bpy.data.images.new("t", 2048, 2048, float_buffer=True); nt = WOOD.node_tree; tn = nt.nodes.new("ShaderNodeTexImage"); tn.image = ti; nt.nodes.active = tn
sc.render.bake.margin = 8; bpy.ops.object.bake(type='COMBINED')
px = np.empty(2048 * 2048 * 4, np.float32); ti.pixels.foreach_get(px); px = px.reshape(-1, 4); px[:, 3] = 1
c = np.clip(px[:, :3] * HEAD, 0, 1); px[:, :3] = np.where(c <= 0.0031308, 12.92 * c, 1.055 * c ** (1 / 2.4) - 0.055)   # a PNG holds sRGB values (three decodes them)
to = bpy.data.images.new("to", 2048, 2048); to.pixels.foreach_set(px.ravel()); tpath = os.path.join(ROOT, "renders", "bake", "%s_%s_table.png" % (LESSON, STATION))
to.filepath_raw = tpath; to.file_format = 'PNG'; to.save(); nt.nodes.remove(tn)

# ---- the table's shadow on the floor: floor light with and without the set; shadow = 1 - ratio ----------------------
GW, GD = W + 6, D + 6
bpy.ops.mesh.primitive_plane_add(size=1, location=P(CX, G, CZ)); gnd = bpy.context.object; gnd.name = "Shadow"; gnd.scale = (GW, GD, 1)
bpy.ops.object.transform_apply(scale=True); gm, gnt, gb = mat("Floor"); gb.inputs["Base Color"].default_value = (0.8, 0.8, 0.8, 1); gb.inputs["Roughness"].default_value = 1.0
gnd.data.materials.append(gm)
bk = sc.render.bake; bk.use_pass_direct = True; bk.use_pass_indirect = True; bk.use_pass_color = False; sc.cycles.samples = max(128, SAMPLES // 2)
RW, RH = 1024, max(256, int(1024 * GD / GW))
def gbake():
    bpy.ops.object.select_all(action='DESELECT'); gnd.select_set(True); bpy.context.view_layer.objects.active = gnd
    im = bpy.data.images.new("g", RW, RH, float_buffer=True); tn = gnt.nodes.new("ShaderNodeTexImage"); tn.image = im; gnt.nodes.active = tn
    bpy.ops.object.bake(type='DIFFUSE'); b_ = np.empty(RW * RH * 4, np.float32); im.pixels.foreach_get(b_); gnt.nodes.remove(tn)
    return b_.reshape(RH, RW, 4)[:, :, :3].mean(2)
lit = gbake()
for o in [table] + casters: o.hide_render = True
free = gbake()
for o in [table] + casters: o.hide_render = False
al = np.clip(1 - lit / np.maximum(free, 1e-5), 0, 1); sh = np.zeros((RH, RW, 4), np.float32); sh[:, :, 3] = al
si = bpy.data.images.new("s", RW, RH, alpha=True); si.pixels.foreach_set(sh.ravel()); spath = os.path.join(ROOT, "renders", "bake", "%s_%s_shadow.png" % (LESSON, STATION))
si.filepath_raw = spath; si.file_format = 'PNG'; si.save()

# ---- optional: a full Cycles render through the app's camera (the target look) --------------------------------------
if "REFCAM" in E:
    cx, cy, cz, dx, dy, dz, fov, asp = map(float, E["REFCAM"].split(","))
    cd = bpy.data.cameras.new("Ref"); cd.sensor_fit = 'VERTICAL'; cd.angle = math.radians(fov); co = bpy.data.objects.new("Ref", cd); sc.collection.objects.link(co)
    co.location = P(cx, cy, cz); co.rotation_euler = P(dx, dy, dz).to_track_quat('-Z', 'Y').to_euler(); sc.camera = co
    sc.render.resolution_x, sc.render.resolution_y = 1180, int(1180 / asp); sc.cycles.samples = 256; sc.cycles.use_denoising = True
    sc.view_settings.view_transform = 'AgX'; sc.view_settings.exposure = math.log2(0.85)
    sc.render.filepath = os.path.join(ROOT, "renders", "bake", "ref_%s_%s.png" % (STATION, E.get("REFNAME", "a"))); bpy.ops.render.render(write_still=True)

# ---- export: unlit table + shadow plane -----------------------------------------------------------------------------
for o, path in ((table, tpath), (gnd, spath)):
    m = bpy.data.materials.new(o.name + " baked"); m.use_nodes = True; n2 = m.node_tree; n2.nodes.clear()
    t2 = n2.nodes.new("ShaderNodeTexImage"); t2.image = bpy.data.images.load(path); em = n2.nodes.new("ShaderNodeEmission"); on = n2.nodes.new("ShaderNodeOutputMaterial")
    n2.links.new(t2.outputs["Color"], em.inputs["Color"]); n2.links.new(em.outputs["Emission"], on.inputs["Surface"])
    o.data.materials.clear(); o.data.materials.append(m)
for o in casters: bpy.data.objects.remove(o)
for o in bpy.data.objects: o.select_set(o.name in ("Table", "Shadow"))
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, "%s_%s.glb" % (LESSON, STATION)), use_selection=True, export_yup=True, export_apply=True)
print("BAKED", LESSON, STATION, "table %.2f x %.2f at x %.2f" % (W, D, CX), "shadow max %.2f" % al.max())
