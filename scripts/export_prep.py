# Shared preparation for the web (glTF) and AR (USDZ) exports.
# Runs inside a background Blender that opened "school experiment.blend"; the .blend is never saved.
import bpy, os, math
from mathutils import Matrix, Vector

ROOT = os.environ.get("RUTHERFORD_ROOT") or os.path.dirname(bpy.data.filepath)
scene = bpy.context.scene
FPS = scene.render.fps


def fcurves_of(idblock):
    ad = getattr(idblock, "animation_data", None)
    if not ad or not ad.action:
        return []
    act = ad.action
    try:
        return list(act.fcurves)
    except Exception:
        out = []
        for layer in act.layers:
            for strip in layer.strips:
                cb = strip.channelbag(ad.action_slot)
                if cb:
                    out += list(cb.fcurves)
        return out


def remove_fcurves(idblock, data_path):
    ad = getattr(idblock, "animation_data", None)
    if not ad or not ad.action:
        return
    act = ad.action
    try:
        coll = act.fcurves
        for fc in [f for f in coll if f.data_path == data_path]:
            coll.remove(fc)
        empty = len(coll) == 0
    except Exception:
        empty = False
        for layer in act.layers:
            for strip in layer.strips:
                cb = strip.channelbag(ad.action_slot)
                if cb:
                    for fc in [f for f in cb.fcurves if f.data_path == data_path]:
                        cb.fcurves.remove(fc)
                    empty = len(cb.fcurves) == 0
    if empty:
        idblock.animation_data_clear()


def select_only(obs):
    for o in bpy.context.view_layer.objects:
        if o is not None:
            o.select_set(False)
    for o in obs:
        o.select_set(True)
    if obs:
        bpy.context.view_layer.objects.active = obs[0]


def convert_to_mesh(obs):
    obs = [o for o in obs if o.type in ('CURVE', 'FONT', 'MESH')]
    if obs:
        # converting against a popped-out (scale 0) parent corrupts the child's local transform: keep it
        xf = {o.name: (o.location.copy(), o.rotation_mode, o.rotation_euler.copy(), o.rotation_quaternion.copy(),
                       o.scale.copy(), o.matrix_parent_inverse.copy()) for o in obs if o.parent is not None}
        select_only(obs)
        bpy.ops.object.convert(target='MESH', keep_original=False)
        for n, (loc, mode, eul, quat, sca, pinv) in xf.items():
            o = bpy.data.objects.get(n)
            if o:
                o.location, o.rotation_mode, o.scale, o.matrix_parent_inverse = loc, mode, sca, pinv
                o.rotation_euler, o.rotation_quaternion = eul, quat


def emission_info(m):
    """(color, strength, alpha) for our mat_emit materials, else None."""
    if not m or not m.node_tree:
        return None
    em = next((n for n in m.node_tree.nodes if n.type == 'EMISSION'), None)
    if not em:
        return None
    mix = next((n for n in m.node_tree.nodes if n.type == 'MIX_SHADER'), None)
    alpha = mix.inputs[0].default_value if mix else 1.0
    return tuple(em.inputs["Color"].default_value[:3]), em.inputs["Strength"].default_value, alpha


def prep_common():
    scene.frame_set(1)
    # respect what's hidden in Blender (eye icon), e.g. the floor
    hidden = [o for o in scene.objects if o.hide_get() and not o.name.startswith("Collimator Cutter")]
    for o in hidden:
        bpy.data.objects.remove(o, do_unlink=True)
    bpy.context.view_layer.update()
    print("left out (hidden in Blender):", len(hidden))
    # per-act render visibility is a render-farm optimisation only
    for ob in scene.objects:
        remove_fcurves(ob, "hide_render")
        if not ob.name.startswith("Collimator Cutter"):
            ob.hide_render = False

    # trails: keep their timing as custom properties on the particle, the viewer redraws them live
    trails = 0
    for ob in list(scene.objects):
        if ob.type != 'CURVE':
            continue
        if ob.get("trail_of"):
            pname = ob["trail_of"]
        elif ob.name.startswith("Trail "):
            pname = "Alpha " + ob.name[len("Trail "):]
        elif ob.name.startswith("Atomic Path "):
            pname = "Atomic Alpha " + ob.name[len("Atomic Path "):]
        else:
            continue
        p = bpy.data.objects.get(pname)
        fcs = {f.data_path: f for f in fcurves_of(ob.data)}
        end = fcs.get("bevel_factor_end")
        if p and end:
            ks = sorted(k.co.x for k in end.keyframe_points)
            start = fcs.get("bevel_factor_start")
            p["trail_f0"] = float(ks[1])
            p["trail_f1"] = float(ks[-1])
            p["trail_lag"] = float(sorted(k.co.x for k in start.keyframe_points)[1] - ks[1]) if start else 0.0
            p["trail_r"] = float(ob.data.bevel_depth)
            info = emission_info(ob.data.materials[0])
            p["trail_color"] = [c * info[1] for c in info[0]] if info else [1.0, 0.3, 0.1]
            trails += 1
        bpy.data.objects.remove(ob, do_unlink=True)
    print("trail metadata:", trails)

    # lead container: bake the collimator boolean, drop the cutter
    lead = scene.objects.get("Lead Container")
    if lead:
        convert_to_mesh([lead])
    cut = scene.objects.get("Collimator Cutter")
    if cut:
        bpy.data.objects.remove(cut, do_unlink=True)

    # Poly Haven props: flatten rigs/hierarchies into plain meshes with world transforms
    props = bpy.data.collections.get("Props")
    if props and props in scene.collection.children_recursive:
        bpy.context.view_layer.update()
        geo = [o for o in props.all_objects if o.type in ('MESH', 'CURVE', 'FONT')]
        # the lamp's cables are rig-driven (hooks + array/curve/geometry-nodes, 1.5M verts) and don't survive
        # flattening; leave them out of the web/AR exports (the Cycles render keeps them)
        for o in list(geo):
            if o.name.startswith("cur_") or (o.name.startswith("geo_") and o.name.endswith("_wire")):
                geo.remove(o)
                bpy.data.objects.remove(o, do_unlink=True)
        for o in geo:  # modest tessellation for web/AR
            if o.type in ('CURVE', 'FONT'):
                o.data.resolution_u = min(o.data.resolution_u, 4)
                o.data.render_resolution_u = 0
                o.data.bevel_resolution = min(o.data.bevel_resolution, 2)
        worlds = {o.name: o.matrix_world.copy() for o in geo}
        convert_to_mesh(geo)
        for o in list(props.all_objects):
            if o.type == 'MESH' and o.name in worlds:
                o.parent = None
                o.matrix_world = worlds[o.name]
        for o in list(props.all_objects):
            if o.type in ('ARMATURE', 'EMPTY') or (o.type == 'MESH' and o.name not in worlds):
                bpy.data.objects.remove(o, do_unlink=True)

    # other curves (orbit lines, atom rings, leader lines) -> meshes
    convert_to_mesh([o for o in scene.objects if o.type == 'CURVE' and not o.name.endswith(" Line")])

    # emission materials -> Principled (black base + emission) so glTF/USD carry them
    for m in bpy.data.materials:
        info = emission_info(m)
        if not info:
            continue
        col, strength, alpha = info
        nt = m.node_tree
        nt.nodes.clear()
        out = nt.nodes.new("ShaderNodeOutputMaterial")
        b = nt.nodes.new("ShaderNodeBsdfPrincipled")
        b.inputs["Base Color"].default_value = (0, 0, 0, 1)
        b.inputs["Roughness"].default_value = 1.0
        b.inputs["Emission Color"].default_value = (*col, 1)
        b.inputs["Emission Strength"].default_value = strength
        if alpha < 1.0:
            b.inputs["Alpha"].default_value = alpha
            m.surface_render_method = 'BLENDED'
        nt.links.new(b.outputs[0], out.inputs["Surface"])

    # base colour chains (hue/sat, multiply) -> plug the image in directly
    for m in bpy.data.materials:
        if not m.node_tree:
            continue
        b = next((n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
        if not b or not b.inputs["Base Color"].is_linked:
            continue
        src = b.inputs["Base Color"].links[0].from_node
        if src.type == 'TEX_IMAGE':
            continue
        stack, img = [src], None
        while stack and not img:
            n = stack.pop()
            for i in n.inputs:
                for l in i.links:
                    if l.from_node.type == 'TEX_IMAGE':
                        img = l.from_node
                    else:
                        stack.append(l.from_node)
        if img:
            m.node_tree.links.new(img.outputs["Color"], b.inputs["Base Color"])


def downscale_images(max_size):
    for img in bpy.data.images:
        if img.source != 'FILE' or img.name.endswith(".hdr") or img.name.startswith("bake_") or img.size[0] == 0:
            continue
        w, h = img.size
        if max(w, h) > max_size:
            f = max_size / max(w, h)
            img.scale(max(1, int(w * f)), max(1, int(h * f)))


def bake_color_adjustments():
    """Colour tweaks glTF/USD can't carry (hue/sat, object-space projection), baked into textures/UVs."""
    # Lead: its Blender material desaturates + tints the scanned metal plate (colour nodes glTF can't carry).
    # Bake that adjustment into a copy of the diffuse map.
    import numpy as np
    lead = bpy.data.materials.get("Lead")
    if lead:
        for n in lead.node_tree.nodes:
            if n.type == 'TEX_IMAGE' and n.image and "Diffuse" in n.image.name:
                img = n.image.copy()
                px = np.empty(len(img.pixels), dtype=np.float32); img.pixels.foreach_get(px)
                px = px.reshape(-1, 4)
                grey = (px[:, :3] @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32))[:, None]
                px[:, :3] = np.clip((grey + 0.15 * (px[:, :3] - grey)) * np.array([0.95, 0.96, 1.0], dtype=np.float32), 0, 1)
                img.pixels.foreach_set(px.ravel()); img.name = "lead_plate_grey"; img.pack()
                n.image = img

    # "Asawera" lettering: glTF can't do object-space box projection, so give it world-size box UVs and a copy of
    # the bench material with a lightened diffuse map (same look as the Blender material).
    asa = bpy.data.objects.get("Asawera")
    bench_mat = bpy.data.materials.get("Wood Bench")
    if asa and asa.type == 'MESH' and bench_mat:
        import bmesh, numpy as np
        bm = bmesh.new(); bm.from_mesh(asa.data)
        bm.normal_update()
        uv = bm.loops.layers.uv.verify()
        for f in bm.faces:
            ax = max(range(3), key=lambda i: abs(f.normal[i]))
            a, b = [(1, 2), (0, 2), (0, 1)][ax]
            for l in f.loops:
                l[uv].uv = (l.vert.co[a], l.vert.co[b])
        bm.to_mesh(asa.data); bm.free()
        m = bench_mat.copy(); m.name = "Asawera Wood"
        for n in m.node_tree.nodes:
            if n.type == 'TEX_IMAGE' and n.image and "Diffuse" in n.image.name:
                img = n.image.copy()
                px = np.empty(len(img.pixels), dtype=np.float32); img.pixels.foreach_get(px)
                px = px.reshape(-1, 4); px[:, :3] = np.clip(px[:, :3] * 1.24, 0, 1)   # ~1.6x in linear light
                img.pixels.foreach_set(px.ravel()); img.name = "asawera_wood_light"; img.pack()
                n.image = img
        asa.data.materials.clear(); asa.data.materials.append(m)



# ---------------------------------------------------------------- shared by export_web.py and p2/export_topics.py
def label_objects():
    """Everything in this scene's label collections ('Labels' for film 01, '<id> Labels' for the others)."""
    obs = set()
    for c in [scene.collection] + list(scene.collection.children_recursive):
        if c.name == "Labels" or c.name.endswith(" Labels"):
            obs.update(c.all_objects)
    return [o for o in obs if scene.objects.get(o.name) is o]


def camera_info():
    """Cuts, Track-To subjects and depth of field: read before bake_cameras() removes the constraints."""
    cuts = sorted((m.frame, m.camera.name) for m in scene.timeline_markers if m.camera)
    subject, dof = {}, {}
    for c in [o for o in scene.objects if o.type == 'CAMERA']:
        t = next((k.target for k in c.constraints if k.type == 'TRACK_TO' and k.target), None)
        if t:
            w = t.matrix_world.translation
            subject[c.name] = [w.x, w.z, -w.y]
        if c.data.dof.use_dof:
            d = c.data.dof
            fo = d.focus_object
            dof[c.name] = {"fstop": d.aperture_fstop, "lens": c.data.lens, "sensor": c.data.sensor_width,
                           "focus": ([fo.matrix_world.translation.x, fo.matrix_world.translation.z,
                                      -fo.matrix_world.translation.y] if fo else None),
                           "focus_distance": d.focus_distance}
    shift = {c.name: [c.data.shift_x, c.data.shift_y] for c in scene.objects if c.type == 'CAMERA'}
    return cuts, subject, dof, shift


def bake_cameras(step=2):
    """Track-To constraints -> plain keyframes (glTF carries keyframes only)."""
    cams = [o for o in scene.objects if o.type == 'CAMERA']
    samples = {c.name: [] for c in cams}
    for f in range(scene.frame_start, scene.frame_end + 1, step):
        scene.frame_set(f)
        for c in cams:
            samples[c.name].append((f, c.matrix_world.copy()))
    for c in cams:
        for con in list(c.constraints):
            c.constraints.remove(con)
        c.animation_data_clear()
        c.rotation_mode = 'QUATERNION'
        for f, mw in samples[c.name]:
            loc, rot, _ = mw.decompose()
            c.location, c.rotation_quaternion = loc, rot
            c.keyframe_insert("location", frame=f)
            c.keyframe_insert("rotation_quaternion", frame=f)
        for fc in fcurves_of(c):
            for k in fc.keyframe_points:
                k.interpolation = 'LINEAR'
    for o in [o for o in scene.objects if o.name.endswith(" Target")]:
        bpy.data.objects.remove(o, do_unlink=True)


def prep_labels():
    """Text -> meshes the viewer can handle: world labels billboard, camera children are HUD captions,
    drop shadows are merged into their label, leader lines show while their label is visible."""
    import bmesh
    labels = label_objects()
    fonts = [o for o in labels if o.type == 'FONT']
    lines = [o for o in labels if o.type == 'CURVE' and o.name.endswith(" Line")]
    for o in fonts:
        for con in list(o.constraints):
            o.constraints.remove(con)
        if o.parent is None:
            o["billboard"] = 1
    for o in scene.objects:
        if o.parent is not None and o.parent.type == 'CAMERA' and o.type != 'CAMERA':
            # on-screen captions: the exporter mis-rotates children of cameras, the viewer re-applies this pose
            o["hud"] = list(o.location)
            o["hud_cam"] = o.parent.name
    for o in lines:
        o["show_with"] = o.name[:-len(" Line")]
        # bevel-factor draw-on can't be exported: show the full line while its label is visible
        o.data.animation_data_clear()
        o.data.bevel_factor_start, o.data.bevel_factor_end = 0.0, 1.0
    for o in scene.objects:      # glyph outlines: 3 steps per curve segment is plenty on a tablet (default 12)
        if o.type == 'FONT':
            o.data.resolution_u = min(o.data.resolution_u, 3)
    convert_to_mesh(fonts + lines)
    # one mesh per label: its drop shadow becomes a second material of the label's mesh (fewer nodes)
    kids = [c for c in fonts if c.parent is not None and c.parent in fonts]
    for o in [f for f in fonts if f not in kids]:
        mine = [c for c in kids if c.parent == o]
        if not mine:
            continue
        bm = bmesh.new(); bm.from_mesh(o.data)
        for c in mine:
            me = c.data.copy()
            me.transform(c.matrix_parent_inverse @ c.matrix_basis)   # into the label's local space
            base = len(o.data.materials)
            for m in me.materials:
                o.data.materials.append(m)
            nf = len(bm.faces)
            bm.from_mesh(me)
            bm.faces.ensure_lookup_table()
            for f in bm.faces[nf:]:
                f.material_index += base
            bpy.data.meshes.remove(me)
        bm.to_mesh(o.data); bm.free()
    keep = [f.name for f in fonts if f not in kids]
    for c in kids:
        if c.children:
            continue
        bpy.data.objects.remove(c, do_unlink=True)
    print("label shadows merged:", len(kids))
    fonts = [bpy.data.objects[n] for n in keep]
    for o in fonts:
        if o.parent is None:
            # text lies in local XY facing +Z; rotate the mesh so it lies in XZ facing -Y (-> glTF +Z)
            R = o.rotation_euler.to_matrix().to_4x4()
            o.data.transform(R)
            o.rotation_euler = (0, 0, 0)
    convert_to_mesh([o for o in scene.objects if o.type == 'FONT'])
    return fonts


def world_info(env_path=None):
    """Background colour and HDRI lighting settings for the viewer (optionally writes the HDRI to env_path)."""
    w = scene.world
    env = next((n.image for n in w.node_tree.nodes if n.type == 'TEX_ENVIRONMENT' and n.image), None)
    mp = next((n for n in w.node_tree.nodes if n.type == 'MAPPING'), None)
    if env and env_path:
        env.scale(1024, 512)
        env.filepath_raw = env_path
        env.file_format = 'HDR'
        env.save()
    bgs = [n for n in w.node_tree.nodes if n.type == 'BACKGROUND']
    lit = next((n for n in bgs if n.inputs["Color"].is_linked), None)          # HDRI -> lighting
    cam_bg = next((n for n in bgs if not n.inputs["Color"].is_linked), None)   # plain colour seen by the camera
    bg = list(cam_bg.inputs["Color"].default_value[:3]) if cam_bg else [0.006, 0.007, 0.009]
    k = cam_bg.inputs["Strength"].default_value if cam_bg else 1.0
    return {"env_rotation": mp.inputs["Rotation"].default_value[2] if (env and mp) else 0.0,
            "env_strength": lit.inputs["Strength"].default_value if lit else 1.0,
            "background_color": [c * k for c in bg]}


def export_glb(path, draco=False):
    import gltf_fix
    gltf_fix.patch()
    scene.frame_set(1)
    bpy.ops.export_scene.gltf(
        filepath=path, export_format='GLB', use_visible=False, use_renderable=False, use_active_scene=True,
        export_apply=True, export_extras=True, export_cameras=True, export_lights=True,
        export_yup=True, export_image_format='JPEG', export_jpeg_quality=85,
        export_animations=True, export_animation_mode='ACTIONS', export_force_sampling=True, export_frame_step=1,
        export_optimize_animation_size=True, export_anim_slide_to_zero=False,
        export_skins=False, export_morph=False,
        export_draco_mesh_compression_enable=draco, export_draco_mesh_compression_level=6)
    print("EXPORTED", path, round(os.path.getsize(path) / 1e6, 1), "MB")


def acts_from_markers(zone_of=lambda frame: 0):
    """Acts are the timeline markers named 'ACT <name>'."""
    acts = sorted((m.frame, m.name[4:]) for m in scene.timeline_markers if m.name.startswith("ACT "))
    return [{"name": n, "frame": f, "zone": zone_of(f)} for f, n in acts]
