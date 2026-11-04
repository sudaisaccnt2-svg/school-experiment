# Export ONE topic film (the scene opened with -S) for the iPad app:
#   web/models/<id>.glb + web/films/<id>.json          blender -b <file> -S "<scene>" --python scripts/p2/export_topics.py
#   web/ar/<id>.usdz (models only, for AR Quick Look)   ... --python scripts/p2/export_topics.py -- ar
# rebuild_ipad.py runs both for every topic scene. Optional scene properties set by a film script:
#   ar_range [f0, f1] (default: the whole film), ar_scale (Blender units -> metres, default 0.05)
import bpy, os, sys, json
P2 = os.path.dirname(os.path.abspath(__file__))
SCRIPTS = os.path.dirname(P2)
sys.path[:0] = [SCRIPTS, P2]
exec(open(os.path.join(SCRIPTS, "export_prep.py"), encoding="utf-8").read())
from films import BY_SCENE

fid, _, title, pages = BY_SCENE[scene.name]
WEB = os.path.join(ROOT, "web")
AR_MODE = "ar" in sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else False


def under_camera(o):
    while o is not None:
        if o.type == 'CAMERA':
            return True
        o = o.parent
    return False


if not AR_MODE:
    os.makedirs(os.path.join(WEB, "models"), exist_ok=True)
    os.makedirs(os.path.join(WEB, "films"), exist_ok=True)
    cuts, camera_subject, camera_dof, camera_shift = camera_info()
    prep_common()
    bake_cameras()
    prep_labels()
    downscale_images(1024)
    world = world_info()
    glb = "models/%s.glb" % fid
    export_glb(os.path.join(WEB, glb), draco=True)   # text meshes compress ~8x
    first = cuts[0][1] if cuts else None
    center = camera_subject.get(first, [0.0, 0.0, 0.0])
    meta = {
        "id": fid, "title": title, "pages": pages, "glb": glb,
        "fps": FPS, "frame_start": scene.frame_start, "frame_end": scene.frame_end,
        "cuts": [{"frame": f, "camera": n} for f, n in cuts],
        "acts": acts_from_markers() or [{"name": title, "frame": scene.frame_start, "zone": 0}],
        "zones": [{"name": title, "center": center, "orbit_distance": 24, "vr_anchor": center, "min_height": -6,
                   "ar": "ar/%s.usdz" % fid}],
        "camera_dof": camera_dof, "camera_subject": camera_subject, "camera_shift": camera_shift,
        **world,
    }
    json.dump(meta, open(os.path.join(WEB, "films", fid + ".json"), "w", encoding="utf-8"), indent=1,
              ensure_ascii=False)
else:
    # AR: the 3D models only (text, cameras and lights are replaced by the real room and AR Quick Look's own)
    exec(open(os.path.join(SCRIPTS, "export_ar.py"), encoding="utf-8").read().split("# time ranges follow")[0])
    f0, f1 = scene.get("ar_range", (scene.frame_start, scene.frame_end))
    scale = scene.get("ar_scale", 0.05)
    prep_common()
    labels = set(label_objects())
    for o in list(scene.objects):
        if o.type in ('CAMERA', 'LIGHT') or o.name.endswith(" Target") or o in labels or under_camera(o) \
                or "Backdrop" in o.name:
            bpy.data.objects.remove(o, do_unlink=True)
    convert_to_mesh([o for o in scene.objects if o.type in ('CURVE', 'FONT')])
    bpy.context.view_layer.update()
    keep = [o for o in scene.objects if o.parent is None]
    root = bpy.data.objects.new("Asawera_" + fid, None)
    scene.collection.objects.link(root)
    for o in keep:
        o.parent = root
    root.scale = (scale,) * 3
    from mathutils import Vector as _V
    low = None
    for fr in range(f0, f1 + 1, 10):
        scene.frame_set(fr)
        for o in root.children_recursive:
            if o.type != 'MESH' or o.matrix_world.to_scale().length < 1e-6:
                continue
            z = min((o.matrix_world @ _V(c)).z for c in o.bound_box)
            low = z if low is None else min(low, z)
    if low is not None:
        root.location.z -= low
    scene.frame_start, scene.frame_end = f0, f1
    scene.frame_set(f0)
    os.makedirs(OUT, exist_ok=True)
    for o in scene.objects:
        o.select_set(True)
    path = os.path.join(OUT, fid + ".usdz")
    bpy.ops.wm.usd_export(
        filepath=path, selected_objects_only=True, export_animation=True, export_materials=True,
        generate_preview_surface=True, export_textures=True, export_uvmaps=True, export_normals=True,
        export_lights=False, export_cameras=False, export_custom_properties=False,
        convert_orientation=True, export_global_forward_selection='NEGATIVE_Z', export_global_up_selection='Y',
        usdz_downscale_size='1024', evaluation_mode='RENDER', triangulate_meshes=True)
    optimize_usdz(path)
    print("EXPORTED", path, round(os.path.getsize(path) / 1e6, 1), "MB", len(keep), "objects")
