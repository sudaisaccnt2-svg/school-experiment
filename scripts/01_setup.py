# ---- 01: clean scene + render / world / compositor settings (Cycles) ----
for ob in list(bpy.data.objects):
    bpy.data.objects.remove(ob, do_unlink=True)
for c in list(bpy.data.collections):
    bpy.data.collections.remove(c)
for _ in range(3):  # appended models leave nested orphans
    for blk in (bpy.data.meshes, bpy.data.curves, bpy.data.materials, bpy.data.lights, bpy.data.cameras,
                bpy.data.actions, bpy.data.textures, bpy.data.images, bpy.data.armatures, bpy.data.node_groups):
        for d in list(blk):
            if d.users == 0:
                blk.remove(d)
for m in list(scene.timeline_markers):
    scene.timeline_markers.remove(m)

scene.frame_start = 1
scene.frame_end = 1260
scene.render.fps = 30
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100
scene.render.use_motion_blur = True
scene.render.motion_blur_shutter = 0.5
scene.sync_mode = 'FRAME_DROP'      # real-time playback/scrubbing: drop frames instead of slow motion

# --- Cycles on the GPU ---
scene.render.engine = 'CYCLES'
cprefs = bpy.context.preferences.addons["cycles"].preferences
for backend in ('OPTIX', 'CUDA', 'HIP', 'ONEAPI', 'METAL'):
    try:
        cprefs.compute_device_type = backend
        cprefs.get_devices()
        if any(d.type == backend for d in cprefs.devices):
            break
    except TypeError:
        continue
for d in cprefs.devices:
    d.use = d.type != 'CPU'
cy = scene.cycles
cy.device = 'GPU'
cy.samples = 128  # frame time is dominated by per-frame sync, not samples
cy.adaptive_threshold = 0.02
cy.use_denoising = True
cy.denoiser = 'OPENIMAGEDENOISE'
cy.denoising_input_passes = 'RGB_ALBEDO_NORMAL'
cy.denoising_prefilter = 'ACCURATE'
try:
    cy.denoising_use_gpu = True
except AttributeError:
    pass
cy.preview_samples = 32
cy.use_preview_denoising = True
cy.max_bounces = 8
cy.diffuse_bounces = 3
cy.glossy_bounces = 4
cy.transmission_bounces = 6
cy.volume_bounces = 0
cy.transparent_max_bounces = 16
cy.caustics_reflective = False
cy.caustics_refractive = False
cy.sample_clamp_indirect = 8.0
cy.use_light_tree = True
scene.render.use_persistent_data = True
print("cycles device:", cprefs.compute_device_type, [d.name for d in cprefs.devices if d.use])

# EEVEE settings (used by Material Preview in the viewport)
ee = scene.eevee
ee.taa_samples = 8
ee.use_raytracing = False

vs = scene.view_settings
vs.view_transform = 'AgX'
try:
    vs.look = 'AgX - Medium High Contrast'
except Exception:
    pass

# --- World: Poly Haven HDRI of a vintage measuring lab ---
# Full strength for lighting and reflections, dimmed for camera rays (darkened room, flashes stay visible).
w = bpy.data.worlds.get("World") or bpy.data.worlds.new("World")
scene.world = w
w.use_nodes = True
nt = w.node_tree
# the sky is hand-tuned in Blender: never rebuild a world that already has its HDRI set up
KEEP_WORLD = any(n.type == 'TEX_ENVIRONMENT' for n in nt.nodes)
if not KEEP_WORLD:
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputWorld")
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Rotation"].default_value = (0, 0, math.radians(200))
    env = nt.nodes.new("ShaderNodeTexEnvironment")
    env.image = bpy.data.images.load(PH + "hdri/vintage_measuring_lab_4k.hdr", check_existing=True)
    bg_light = nt.nodes.new("ShaderNodeBackground"); bg_light.inputs["Strength"].default_value = 2.95
    bg_cam = nt.nodes.new("ShaderNodeBackground"); bg_cam.inputs["Strength"].default_value = 1.0
    bg_cam.inputs["Color"].default_value = (0.14, 0.177, 0.257, 1)  # HDRI hidden from camera: blue-grey studio backdrop
    lp = nt.nodes.new("ShaderNodeLightPath")
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(tc.outputs["Generated"], mp.inputs["Vector"])
    nt.links.new(mp.outputs["Vector"], env.inputs["Vector"])
    nt.links.new(env.outputs["Color"], bg_light.inputs["Color"])
    nt.links.new(lp.outputs["Is Camera Ray"], mix.inputs[0])
    nt.links.new(bg_light.outputs[0], mix.inputs[1])
    nt.links.new(bg_cam.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs["Surface"])
else:
    print("world kept as tuned in Blender")

# --- Compositor: bloom + a touch of lens dispersion ---
scene.use_nodes = True
ct = scene.node_tree
ct.nodes.clear()
rl = ct.nodes.new("CompositorNodeRLayers")
glare = ct.nodes.new("CompositorNodeGlare")
try:
    glare.glare_type = 'BLOOM'
except Exception:
    glare.glare_type = 'FOG_GLOW'
try:
    glare.quality = 'MEDIUM'
except Exception:
    pass
for sock, val in (("Threshold", 0.8), ("Strength", 0.9), ("Size", 0.8)):
    if sock in glare.inputs:
        glare.inputs[sock].default_value = val
lens = ct.nodes.new("CompositorNodeLensdist")
lens.inputs["Dispersion"].default_value = 0.012
lens.use_fit = True
comp = ct.nodes.new("CompositorNodeComposite")
ct.links.new(rl.outputs["Image"], glare.inputs["Image"])
ct.links.new(glare.outputs["Image"], lens.inputs["Image"])
ct.links.new(lens.outputs["Image"], comp.inputs["Image"])
print("setup ok")
