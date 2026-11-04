# ---- 02b: Poly Haven props, practical lamp light, "Asawera" lettering on the bench ----
C = "Props"


def face(src, dst):
    """Z rotation that turns a model's front (-Y) from src toward dst."""
    return math.atan2(dst[1] - src[1], dst[0] - src[0]) + math.pi / 2


# Geiger counted the scintillations through a microscope aimed at the screen
mic_pos = (3.4, 4.3, 0)
append_model("vintage_microscope", C, mic_pos, face(mic_pos, (0, 0)))

# Articulated desk lamp at the back-left, lighting the lead container
lamp_pos = (-9.4, 4.0, 0)
append_model("desk_lamp_arm_01", C, lamp_pos, face(lamp_pos, (-5.5, 0)) + math.radians(55))  # model arm is offset ~55 deg from its -Y front
append_model("book_encyclopedia_set_01", C, (-5.4, 4.3, 0), 0.0)
# keep 8 volumes so the set does not wall off the background
for i in range(9, 21):
    ob = bpy.data.objects.get("book_encyclopedia_set_01_book%02d" % i)
    if ob:
        bpy.data.objects.remove(ob, do_unlink=True)
append_model("round_spectacles", C, (-8.4, -3.4, 0), math.radians(25))

bpy.context.view_layer.update()
head = bpy.data.objects.get("geo_lamp-head")
if head:
    corners = [head.matrix_world @ Vector(c) for c in head.bound_box]
    hc = sum(corners, Vector()) / 8
    ld = bpy.data.lights.new("Desk Lamp Bulb", 'SPOT')
    ld.energy = 450; ld.color = (1.0, 0.74, 0.48); ld.spot_size = math.radians(75); ld.spot_blend = 0.5
    ld.shadow_soft_size = 0.25
    lo = bpy.data.objects.new("Desk Lamp Bulb", ld); link(lo, C)
    target = Vector((-5.5, 0.5, 0.0))
    lo.location = hc + (target - hc).normalized() * 0.35
    lo.rotation_euler = (target - hc).to_track_quat('-Z', 'Y').to_euler()
    print("lamp head at", tuple(round(v, 2) for v in hc))

# "Asawera" in polished brass letters standing on the bench, front-left
# "Asawera" in the bench's own wood. Text objects get tiny per-glyph UVs, so project the texture in object
# space (1 unit = 1 BU) at the bench's tile size: same grain scale as the table, running along the word.
# Lifted brightness so the letters read against the darker bench.
m_letters, new = _new_mat("Asawera Wood")
if new:
    nt = m_letters.node_tree
    b = nt.nodes["Principled BSDF"]
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (1 / 5.5, 1 / 5.5, 1 / 5.5)
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])

    def wood_img(mapname, noncolor):
        t = nt.nodes.new("ShaderNodeTexImage")
        t.image = bpy.data.images.load(PH + "textures/wood_table_worn/wood_table_worn_%s_2k.jpg" % mapname, check_existing=True)
        if noncolor:
            t.image.colorspace_settings.name = 'Non-Color'
        t.projection = 'BOX'
        t.projection_blend = 0.3
        nt.links.new(mp.outputs["Vector"], t.inputs["Vector"])
        return t

    hs = nt.nodes.new("ShaderNodeHueSaturation")
    hs.inputs["Value"].default_value = 1.6        # lighter than the bench so the lettering reads
    hs.inputs["Saturation"].default_value = 0.95
    nt.links.new(wood_img("Diffuse", False).outputs["Color"], hs.inputs["Color"])
    nt.links.new(hs.outputs["Color"], b.inputs["Base Color"])
    rm = nt.nodes.new("ShaderNodeMath"); rm.operation = 'MULTIPLY'; rm.inputs[1].default_value = 1.2
    nt.links.new(wood_img("Rough", True).outputs["Color"], rm.inputs[0])
    nt.links.new(rm.outputs[0], b.inputs["Roughness"])
    nm = nt.nodes.new("ShaderNodeNormalMap"); nm.inputs["Strength"].default_value = 0.8
    nt.links.new(wood_img("nor_gl", True).outputs["Color"], nm.inputs["Color"])
    nt.links.new(nm.outputs["Normal"], b.inputs["Normal"])
cu = bpy.data.curves.new("Asawera", 'FONT')
cu.body = "Asawera"
font_path = "C:/Windows/Fonts/palab.ttf"
try:
    cu.font = bpy.data.fonts.load(font_path, check_existing=True)
except Exception as e:
    print("font fallback:", e)
cu.size = 0.95
cu.align_x = 'CENTER'
cu.align_y = 'BOTTOM_BASELINE'  # sit on the bench (BOTTOM leaves room for descenders)
cu.extrude = 0.08
cu.bevel_depth = 0.012
cu.bevel_resolution = 3
cu.materials.append(m_letters)
txt = bpy.data.objects.new("Asawera", cu)
txt.location = (-5.23, 3.105, 0.014)   # placed by hand in Blender
txt.rotation_euler = (math.radians(90), 0, 0.054)
link(txt, C)
print("props ok")
