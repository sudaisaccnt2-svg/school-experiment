# Shared helpers for the Rutherford experiment scene (prepended to every build script).
import bpy, bmesh, math, random
from mathutils import Vector, Euler

scene = bpy.context.scene


def coll(name):
    c = bpy.data.collections.get(name)
    if c is None:
        c = bpy.data.collections.new(name)
        scene.collection.children.link(c)
    return c


def link(obj, cname):
    for c in obj.users_collection:
        c.objects.unlink(obj)
    coll(cname).objects.link(obj)
    return obj


def kf(target, path, frame, value=None, interp='BEZIER', index=-1):
    """Insert a keyframe with a given interpolation (applies to the segment after this key)."""
    if value is not None:
        setattr(target, path, value)
    target.keyframe_insert(path, frame=frame, index=index)
    # the user-preference default is ignored for Python inserts, so set the new keys explicitly
    for fc in _fcurves(target):
        if fc.data_path == path:
            for k in fc.keyframe_points:
                if abs(k.co.x - frame) < 1e-4:
                    k.interpolation = interp


def _fcurves(idblock):
    ad = idblock.animation_data
    if not ad or not ad.action:
        return []
    try:
        return list(ad.action.fcurves)
    except Exception:
        out = []
        for layer in ad.action.layers:
            for strip in layer.strips:
                cb = strip.channelbag(ad.action_slot)
                if cb:
                    out += list(cb.fcurves)
        return out


def _new_mat(name):
    m = bpy.data.materials.get(name)
    if m:
        return m, False
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    return m, True


def mat_pbr(name, color, metallic=0.0, roughness=0.5, bump=0.0, bump_scale=40.0, rough_var=0.0,
            coat=0.0, alpha=1.0, transmission=0.0):
    m, new = _new_mat(name)
    if not new:
        return m
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Metallic"].default_value = metallic
    b.inputs["Roughness"].default_value = roughness
    b.inputs["Coat Weight"].default_value = coat
    b.inputs["Transmission Weight"].default_value = transmission
    if alpha < 1.0:
        b.inputs["Alpha"].default_value = alpha
        m.surface_render_method = 'BLENDED'
    if bump > 0 or rough_var > 0:
        tc = nt.nodes.new("ShaderNodeTexCoord")
        noise = nt.nodes.new("ShaderNodeTexNoise")
        noise.inputs["Scale"].default_value = bump_scale
        noise.inputs["Detail"].default_value = 8
        nt.links.new(tc.outputs["Object"], noise.inputs["Vector"])
        if bump > 0:
            bn = nt.nodes.new("ShaderNodeBump")
            bn.inputs["Strength"].default_value = bump
            bn.inputs["Distance"].default_value = 0.02
            nt.links.new(noise.outputs["Fac"], bn.inputs["Height"])
            nt.links.new(bn.outputs["Normal"], b.inputs["Normal"])
        if rough_var > 0:
            mr = nt.nodes.new("ShaderNodeMapRange")
            mr.inputs["To Min"].default_value = roughness - rough_var
            mr.inputs["To Max"].default_value = roughness + rough_var
            nt.links.new(noise.outputs["Fac"], mr.inputs["Value"])
            nt.links.new(mr.outputs["Result"], b.inputs["Roughness"])
    return m


def mat_emit(name, color, strength=10.0, alpha=1.0):
    m, new = _new_mat(name)
    if not new:
        return m
    nt = m.node_tree
    nt.nodes.remove(nt.nodes["Principled BSDF"])
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = (*color, 1)
    e.inputs["Strength"].default_value = strength
    out = nt.nodes["Material Output"]
    if alpha < 1.0:
        tr = nt.nodes.new("ShaderNodeBsdfTransparent")
        mix = nt.nodes.new("ShaderNodeMixShader")
        mix.inputs[0].default_value = alpha
        nt.links.new(tr.outputs[0], mix.inputs[1])
        nt.links.new(e.outputs[0], mix.inputs[2])
        nt.links.new(mix.outputs[0], out.inputs["Surface"])
        m.surface_render_method = 'BLENDED'
    else:
        nt.links.new(e.outputs[0], out.inputs["Surface"])
    return m


def set_mat(obj, m):
    obj.data.materials.clear()
    obj.data.materials.append(m)
    return obj


def smooth(obj):
    for p in obj.data.polygons:
        p.use_smooth = True
    return obj


def mesh_obj(name, bm, cname, mat=None):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    link(ob, cname)
    if mat:
        set_mat(ob, mat)
    return ob


def sphere_mesh(name, radius=1.0, segs=24, rings=12):
    me = bpy.data.meshes.get(name)
    if me:
        return me
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=segs, v_segments=rings, radius=radius)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    return me


def obj_from_mesh(name, me, cname, loc=(0, 0, 0), mat=None):
    ob = bpy.data.objects.new(name, me)
    ob.location = loc
    link(ob, cname)
    if mat and not me.materials:
        me.materials.append(mat)
    return ob


def text_obj(name, body, loc, size, cname, mat, align='CENTER', rot=(math.radians(90), 0, 0), extrude=0.0):
    cu = bpy.data.curves.new(name, 'FONT')
    cu.body = body
    cu.size = size
    cu.align_x = align
    cu.align_y = 'CENTER'
    cu.extrude = extrude
    cu.space_line = 1.1
    ob = bpy.data.objects.new(name, cu)
    ob.location = loc
    ob.rotation_euler = rot
    link(ob, cname)
    cu.materials.append(mat)
    return ob


def poly_curve(name, pts, cname, mat, depth=0.01, mapping='SEGMENTS'):
    cu = bpy.data.curves.new(name, 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = depth
    cu.bevel_resolution = 2
    cu.use_fill_caps = True
    cu.bevel_factor_mapping_start = mapping
    cu.bevel_factor_mapping_end = mapping
    sp = cu.splines.new('POLY')
    sp.points.add(len(pts) - 1)
    for p, co in zip(sp.points, pts):
        p.co = (co[0], co[1], co[2], 1)
    ob = bpy.data.objects.new(name, cu)
    link(ob, cname)
    cu.materials.append(mat)
    return ob


def pop_in(ob, frame, dur=8, target=None):
    """Scale an object up from 0 to its current scale starting at `frame`."""
    s = tuple(target or ob.scale)
    kf(ob, "scale", 0, (0, 0, 0), 'CONSTANT')
    kf(ob, "scale", frame, (0, 0, 0), 'BEZIER')
    kf(ob, "scale", frame + dur, s, 'BEZIER')


def pop_out(ob, frame, dur=8, s=None):
    s = tuple(s or ob.scale)
    kf(ob, "scale", frame, s, 'BEZIER')
    kf(ob, "scale", frame + dur, (0, 0, 0), 'CONSTANT')


def draw_on(curve_ob, frame, dur=10):
    cu = curve_ob.data
    kf(cu, "bevel_factor_end", 0, 0.0, 'CONSTANT')
    kf(cu, "bevel_factor_end", frame, 0.0, 'BEZIER')
    kf(cu, "bevel_factor_end", frame + dur, 1.0, 'BEZIER')


# ---------------- realism helpers (Poly Haven assets, Cycles) ----------------
PH = "//assets/polyhaven/"


def box_uv(bm, unit=1.0):
    """World-size box-projection UVs (1 UV unit = `unit` Blender units). Survives glTF/USD export."""
    uv = bm.loops.layers.uv.verify()
    for f in bm.faces:
        n = f.normal
        ax = max(range(3), key=lambda i: abs(n[i]))
        a, b = [(1, 2), (0, 2), (0, 1)][ax]
        for l in f.loops:
            l[uv].uv = (l.vert.co[a] / unit, l.vert.co[b] / unit)


def mat_tex(name, asset, tile, maps=("Diffuse", "nor_gl", "Rough"), tint=None, desat=None,
            rough_mul=1.0, normal=1.0, metallic=None, coat=0.0):
    """Principled material from Poly Haven 2k maps; UVs are in Blender units, `tile` = texture size in BU."""
    m, new = _new_mat(name)
    if not new:
        return m
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    uvn = nt.nodes.new("ShaderNodeUVMap")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (1 / tile, 1 / tile, 1)
    nt.links.new(uvn.outputs["UV"], mp.inputs["Vector"])

    def img(mapname, noncolor):
        t = nt.nodes.new("ShaderNodeTexImage")
        t.image = bpy.data.images.load(PH + "textures/%s/%s_%s_2k.jpg" % (asset, asset, mapname), check_existing=True)
        if noncolor:
            t.image.colorspace_settings.name = 'Non-Color'
        nt.links.new(mp.outputs["Vector"], t.inputs["Vector"])
        return t

    if "Diffuse" in maps:
        col = img("Diffuse", False).outputs["Color"]
        if desat is not None:
            hs = nt.nodes.new("ShaderNodeHueSaturation")
            hs.inputs["Saturation"].default_value = desat
            nt.links.new(col, hs.inputs["Color"]); col = hs.outputs["Color"]
        if tint is not None:
            mx = nt.nodes.new("ShaderNodeMix"); mx.data_type = 'RGBA'; mx.blend_type = 'MULTIPLY'
            mx.inputs["Factor"].default_value = 1.0
            mx.inputs[7].default_value = (*tint, 1)
            nt.links.new(col, mx.inputs[6]); col = mx.outputs[2]
        nt.links.new(col, b.inputs["Base Color"])
    if "Rough" in maps:
        r = img("Rough", True).outputs["Color"]
        if rough_mul != 1.0:
            mm = nt.nodes.new("ShaderNodeMath"); mm.operation = 'MULTIPLY'; mm.inputs[1].default_value = rough_mul
            nt.links.new(r, mm.inputs[0]); r = mm.outputs[0]
        nt.links.new(r, b.inputs["Roughness"])
    if "nor_gl" in maps:
        nm = nt.nodes.new("ShaderNodeNormalMap"); nm.inputs["Strength"].default_value = normal
        nt.links.new(img("nor_gl", True).outputs["Color"], nm.inputs["Color"])
        nt.links.new(nm.outputs["Normal"], b.inputs["Normal"])
    if "Metal" in maps:
        nt.links.new(img("Metal", True).outputs["Color"], b.inputs["Metallic"])
    if metallic is not None:
        b.inputs["Metallic"].default_value = metallic
    b.inputs["Coat Weight"].default_value = coat
    return m


def append_model(asset, cname, loc, rot_z=0.0, scale=10.0, skip=("wdg_", "Sphere_stash")):
    """Append a Poly Haven model (metres) under an empty; scale 10 converts to scene units (1 BU = 10 cm)."""
    path = bpy.path.abspath(PH + "models/%s/%s_2k.blend" % (asset, asset))
    with bpy.data.libraries.load(path, link=False, relative=True) as (src, dst):
        dst.objects = [n for n in src.objects if not n.startswith(skip)]
    root = bpy.data.objects.new(asset, None)
    link(root, cname)
    for ob in dst.objects:
        if ob is None:
            continue
        link(ob, cname)
        if ob.parent is None:
            ob.parent = root
    root.scale = (scale, scale, scale)
    root.location = loc
    root.rotation_euler = (0, 0, rot_z)
    return root


def overlay_only(ob):
    """Labels/leader lines: visible to the camera only (no light, shadows or reflections in Cycles)."""
    for attr in ("visible_diffuse", "visible_glossy", "visible_transmission", "visible_volume_scatter", "visible_shadow"):
        setattr(ob, attr, False)
