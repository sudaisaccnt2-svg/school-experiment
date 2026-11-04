# Bake the Cycles lighting (soft shadows, bounce light, lamp pool, HDRI) into lightmap textures for the web app.
# Runs in background Blender on a snapshot copy; writes a baked copy for export_web.py. Your .blend is never saved.
#   blender -b <snapshot.blend> --python scripts/bake_lighting.py      (env RUTHERFORD_BAKED = output .blend path)
import bpy, bmesh, os, math, time
import numpy as np

OUT = os.environ["RUTHERFORD_BAKED"]
SAMPLES = int(os.environ.get("BAKE_SAMPLES", "384"))
TEXELS_PER_UNIT = 110          # lightmap resolution (1 Blender unit = 10 cm)
HEADROOM = 0.5                 # stored = radiance * 0.5 (so lit areas up to 2x brighter than white survive 8-bit)
# painted metal / mostly non-metal Poly Haven materials whose diffuse bakes well
ALLOW = {"book_encyclopedia_set_01_cover", "desk_lamp_arm_01", "desk_lamp_arm_01_light"}

scene = bpy.context.scene
scene.render.engine = 'CYCLES'
cp = bpy.context.preferences.addons["cycles"].preferences
cp.compute_device_type = 'OPTIX'
cp.get_devices()
for d in cp.devices:
    d.use = d.type == 'OPTIX'
scene.cycles.device = 'GPU'
scene.cycles.samples = SAMPLES
scene.cycles.use_adaptive_sampling = False
scene.frame_set(1)


def metallic(m):
    b = next((n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None) if m and m.node_tree else None
    if not b:
        return 0.0
    i = b.inputs["Metallic"]
    return 1.0 if i.is_linked else i.default_value


def bakeable(m):
    return m is not None and (m.name in ALLOW or metallic(m) <= 0.5)


def animated(o):
    ad = o.animation_data
    if not ad or not ad.action:
        return False
    for layer in ad.action.layers:
        for strip in layer.strips:
            for cb in strip.channelbags:
                if any(fc.data_path in ("location", "rotation_euler", "rotation_quaternion", "scale") for fc in cb.fcurves):
                    return True
    return False


def select_only(o):
    for x in bpy.context.view_layer.objects:
        x.select_set(False)
    o.select_set(True)
    bpy.context.view_layer.objects.active = o


targets = []
for o in scene.objects:
    if o.type not in ('MESH', 'FONT') or o.hide_get() or o.hide_render:
        continue
    if o.matrix_world.translation.x > 30 or animated(o) or "wire" in o.name or o.name.startswith("cur_"):
        continue
    if any(c.name in ("Labels", "Alpha Stream") or c.name.endswith(" Labels") for c in o.users_collection)             or o.name == "Polonium" or o.name.startswith("D5 "):          # D5 = act 5 (p.44), x≈180: not baked
        continue
    mats = [s.material for s in o.material_slots] or [None]
    if not any(bakeable(m) for m in mats):
        continue
    targets.append(o)
print("bake targets:", len(targets))

t_all = time.time()
for o in targets:
    select_only(o)
    if o.type == 'FONT' or o.modifiers:
        bpy.ops.object.convert(target='MESH')          # apply bevel / boolean so the UVs match the baked surface
    if o.data.users > 1:
        o.data = o.data.copy()
    # lightmap UVs
    uv = o.data.uv_layers.get("BakeUV") or o.data.uv_layers.new(name="BakeUV")
    o.data.uv_layers.active = uv
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.02, correct_aspect=True)
    bpy.ops.object.mode_set(mode='OBJECT')

    # lightmap size from surface area
    area = sum(p.area for p in o.data.polygons) * max(o.matrix_world.to_scale()) ** 2
    side = int(np.clip(2 ** math.ceil(math.log2(max(math.sqrt(area) * TEXELS_PER_UNIT, 1))), 128, 2048))
    img = bpy.data.images.new("bakeraw_" + o.name, side, side, float_buffer=True)

    # every material slot needs its own copy with an active image node pointing at this object's lightmap
    originals = []
    for s in o.material_slots:
        m0 = s.material
        originals.append(m0)
        if m0 is None:
            continue
        m = m0.copy()
        s.material = m
        n = m.node_tree.nodes.new("ShaderNodeTexImage")
        n.image = img
        m.node_tree.nodes.active = n
    t0 = time.time()
    bpy.ops.object.bake(type='COMBINED', pass_filter={'DIRECT', 'INDIRECT', 'DIFFUSE', 'TRANSMISSION', 'EMIT'},
                        margin=6, use_clear=True, uv_layer="BakeUV", target='IMAGE_TEXTURES')

    # float radiance -> 8-bit sRGB with headroom
    px = np.empty(side * side * 4, dtype=np.float32)
    img.pixels.foreach_get(px)
    px = px.reshape(-1, 4)
    lin = np.clip(px[:, :3] * HEADROOM, 0, 1)
    srgb = np.where(lin <= 0.0031308, lin * 12.92, 1.055 * np.power(lin, 1 / 2.4) - 0.055)
    out = bpy.data.images.new("bake_" + o.name, side, side, alpha=False)
    out.colorspace_settings.name = 'sRGB'
    px[:, :3] = srgb; px[:, 3] = 1
    out.pixels.foreach_set(px.ravel())
    out.pack()
    bpy.data.images.remove(img)

    # export materials: baked (non-metal) slots show the lightmap, metal slots get their original material back
    for s, m0 in zip(o.material_slots, originals):
        m = s.material
        if m is None:
            continue
        if not bakeable(m0):
            bpy.data.materials.remove(m)
            s.material = m0
            continue
        nt = m.node_tree
        b = next((n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'), None)
        for n in [n for n in nt.nodes if n.type == 'TEX_IMAGE' and n.image and n.image.name.startswith("bakeraw_")]:
            nt.nodes.remove(n)
        uvn = nt.nodes.new("ShaderNodeUVMap"); uvn.uv_map = "BakeUV"
        tex = nt.nodes.new("ShaderNodeTexImage"); tex.image = out
        nt.links.new(uvn.outputs["UV"], tex.inputs["Vector"])
        if b:
            nt.links.new(tex.outputs["Color"], b.inputs["Base Color"])
        m["baked"] = 1
    print("  baked %-45s %4dpx %5.1fs" % (o.name, side, time.time() - t0))

print("baked %d objects in %.0f s" % (len(targets), time.time() - t_all))
bpy.ops.wm.save_as_mainfile(filepath=OUT, copy=True)
print("BAKED", OUT)
