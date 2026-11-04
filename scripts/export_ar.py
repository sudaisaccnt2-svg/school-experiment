# Export animated USDZ files for AR Quick Look on iPad/iPhone (tap -> place the model in the camera view).
#   web/ar/experiment.usdz        the apparatus on its real-size bench, alpha stream + scintillations (loops)
#   web/ar/inside_the_foil.usdz   the gold-atom lattice with Coulomb-scattered alpha particles
#   web/ar/planetary_model.usdz   Rutherford's atom with orbiting electrons
#   web/ar/defects.usdz           act 5: the electron spirals into the nucleus (why Rutherford's model fails)
# Run:  blender -b "2 school experiment.blend" -S Scene --python scripts/export_ar.py
import bpy, os
HERE = os.path.dirname(os.path.abspath(__file__))
BLEND = bpy.data.filepath
OUT = os.path.join(os.environ.get("RUTHERFORD_ROOT") or os.path.dirname(BLEND), "web", "ar")
os.makedirs(OUT, exist_ok=True)

# name, zone test on world x, anchor (Blender units) that lands on the AR floor/table, scale to metres, frames
SCENES = [
    ("experiment", lambda x: x < 30, (-1.5, 0.0, -7.5), 0.1, (250, 610)),
    ("inside_the_foil", lambda x: 30 <= x < 90, (60.0, 0.0, 2.5), 0.1, (672, 880)),
    ("planetary_model", lambda x: 90 <= x < 150, (114.0, 0.0, 5.5), 0.12, (940, 1160)),
    ("defects", lambda x: x >= 150, (180.0, 0.0, 5.5), 0.12, None),
]
DROP = ("Floor", "Atomic Backdrop", "Model Backdrop", "D5 Backdrop")   # AR shows the real room instead
BIG_TEXTURES = ("wood_table_worn", "metal_plate_02")     # bench and lead block fill the view: keep 1024 px


def optimize_usdz(path):
    """Make the USDZ small so AR Quick Look opens it quickly (the exporter writes ~4 MB PNGs for every map):
    JPEG textures (small props at 512 px), 8-bit alpha masks, and UV lookups that point at the real UV set."""
    import shutil, tempfile, zipfile
    import numpy as np
    from pxr import Sdf, Usd, UsdGeom, UsdShade, UsdUtils, Vt
    work = tempfile.mkdtemp(prefix="usdz_opt_")
    with zipfile.ZipFile(path) as z:
        z.extractall(work)
    layer = os.path.join(work, next(n for n in os.listdir(work) if n.endswith(".usdc")))
    stage = Usd.Stage.Open(layer)
    done = {}
    for prim in stage.Traverse():
        mesh = UsdGeom.Mesh(prim)
        if mesh:
            # Blender's leftover attributes (bevel weights, colour IDs, ...) mean nothing to AR Quick Look
            for pv in UsdGeom.PrimvarsAPI(prim).GetPrimvars():
                if pv.GetPrimvarName() not in ("st", "displayColor", "displayOpacity"):
                    prim.RemoveProperty(pv.GetAttr().GetName())
            # one normal per corner -> one per vertex wherever the surface is smooth there (same look, far less data)
            na = mesh.GetNormalsAttr()
            if na.HasAuthoredValue() and not na.GetNumTimeSamples() and mesh.GetNormalsInterpolation() == UsdGeom.Tokens.faceVarying:
                idx = np.asarray(mesh.GetFaceVertexIndicesAttr().Get())
                nrm = np.asarray(na.Get(), dtype=np.float32)
                per = np.zeros((len(mesh.GetPointsAttr().Get()), 3), np.float32)
                per[idx] = nrm
                if len(idx) == len(nrm) and np.abs(per[idx] - nrm).max() < 1e-3:
                    na.Set(Vt.Vec3fArray.FromNumpy(per))
                    mesh.SetNormalsInterpolation(UsdGeom.Tokens.vertex)
            continue
        sh = UsdShade.Shader(prim)
        if not sh:
            continue
        sid = sh.GetIdAttr().Get()
        if sid == "UsdPrimvarReader_float2" and sh.GetInput("varname").Get() == "_":
            sh.GetInput("varname").Set("st")          # Blender writes "_" for an unnamed UV Map node
        if sid != "UsdUVTexture" or not sh.GetInput("file"):
            continue
        rel = sh.GetInput("file").Get().path          # ./textures/name.png
        if rel not in done:
            src = os.path.join(work, rel)
            base, _ = os.path.splitext(os.path.basename(rel))
            alpha = "alpha" in base.lower()
            size = 1024 if base.startswith(BIG_TEXTURES) else 512
            img = bpy.data.images.load(src)
            img.colorspace_settings.name = "Non-Color"   # copy the values as they are, no colour conversion
            w, h = img.size
            if max(w, h) > size:
                img.scale(max(1, w * size // max(w, h)), max(1, h * size // max(w, h)))
            new_rel = "./textures/%s.%s" % (base, "png" if alpha else "jpg")
            img.file_format = "PNG" if alpha else "JPEG"
            img.save(filepath=os.path.join(work, new_rel), quality=88)
            bpy.data.images.remove(img)
            if os.path.normcase(new_rel) != os.path.normcase(rel):
                os.remove(src)
            done[rel] = new_rel
        sh.GetInput("file").Set(Sdf.AssetPath(done[rel]))
    fresh = os.path.join(work, "_optimized.usdc")   # Save() would only append the edits to the old file
    stage.GetRootLayer().Export(fresh)
    del stage
    os.replace(fresh, layer)
    os.remove(path)
    if not UsdUtils.CreateNewARKitUsdzPackage(Sdf.AssetPath(layer), path):
        raise RuntimeError("could not repackage " + path)
    shutil.rmtree(work, ignore_errors=True)

# time ranges follow the camera-cut markers (so retiming / holds in Blender carry over)
_s = bpy.context.scene
_cuts = {m.camera.name: m.frame for m in _s.timeline_markers if m.camera}
RANGES = {"experiment": (_cuts["CamSource"], _cuts["CamAtomic"] - 1),
          "inside_the_foil": (_cuts["CamAtomic"], _cuts["CamModel"] - 1),
          "planetary_model": (_cuts["CamModel"], (_s.get("act5_start") or _s.frame_end + 1) - 1)}
if _s.get("act5_start"):
    RANGES["defects"] = (_s["act5_start"], _s.frame_end)
_scene_name = _s.name
for name, in_zone, anchor, scale, _unused in SCENES:
    if name not in RANGES:
        continue
    f0, f1 = RANGES[name]
    bpy.ops.wm.open_mainfile(filepath=BLEND)
    if bpy.context.scene.name != _scene_name:      # keep film 01 active (the file holds every film's scene)
        bpy.context.window_manager.windows[0].scene = bpy.data.scenes[_scene_name]
    exec(open(os.path.join(HERE, "export_prep.py"), encoding="utf-8").read())
    prep_common()
    bake_color_adjustments()   # USDZ textures are downscaled by the exporter (usdz_downscale_size)
    # AR Quick Look reads PNG/JPEG: re-save the Poly Haven EXR maps (normal/rough/metal) as PNG
    import tempfile
    tmp = tempfile.mkdtemp(prefix="ar_tex_")
    for img in bpy.data.images:
        if img.source == 'FILE' and img.filepath.lower().endswith(".exr"):
            img.pixels[0]  # force the EXR to load before re-pointing the file path
            img.filepath_raw = os.path.join(tmp, os.path.splitext(os.path.basename(img.filepath))[0] + ".png")
            img.file_format = 'PNG'
            img.save()

    # labels are camera-facing overlays and cameras/lights are replaced by AR Quick Look's own
    for o in list(scene.objects):
        if o.type in ('CAMERA', 'LIGHT') or o.name.endswith(" Target") or o.name in DROP                 or any(c.name == "Labels" or c.name.endswith(" Labels") for c in o.users_collection):
            bpy.data.objects.remove(o, do_unlink=True)
    convert_to_mesh([o for o in scene.objects if o.type in ('CURVE', 'FONT')])

    bpy.context.view_layer.update()
    keep = [o for o in scene.objects if o.parent is None and in_zone(o.matrix_world.translation.x)]
    for o in list(scene.objects):
        if o.parent is None and o not in keep:
            bpy.data.objects.remove(o, do_unlink=True)

    root = bpy.data.objects.new("Rutherford_" + name, None)
    scene.collection.objects.link(root)
    for o in keep:
        o.parent = root                      # root sits at the origin, so no parent-inverse needed
    root.scale = (scale,) * 3
    root.location = tuple(-a * scale for a in anchor)

    # ground it: the lowest point over the whole animation goes exactly onto the floor / table
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
    print("  %s grounded (lowest point was %.3f m)" % (name, low or 0))

    scene.frame_start, scene.frame_end = f0, f1
    scene.frame_set(f0)
    for o in scene.objects:
        o.select_set(True)
    path = os.path.join(OUT, name + ".usdz")
    bpy.ops.wm.usd_export(
        filepath=path, selected_objects_only=True, export_animation=True, export_materials=True,
        generate_preview_surface=True, export_textures=True, export_uvmaps=True, export_normals=True,
        export_lights=False, export_cameras=False, export_custom_properties=False,
        convert_orientation=True, export_global_forward_selection='NEGATIVE_Z', export_global_up_selection='Y',
        usdz_downscale_size='1024', evaluation_mode='RENDER', triangulate_meshes=True)
    optimize_usdz(path)
    print("EXPORTED", path, round(os.path.getsize(path) / 1e6, 1), "MB", len(keep), "objects")
