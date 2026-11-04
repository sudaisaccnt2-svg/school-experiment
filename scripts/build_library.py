"""Build the shared model library assets/library/asawera_library.blend from the downloaded CC0 models.
Each model = one collection LIB_<name>, marked as an asset (Blender's Asset Browser), so every lesson can LINK it
(one copy in memory, edits in one place). Re-run after adding models to fetch_polyhaven.py.
blender -b --factory-startup --python scripts/build_library.py"""
import bpy, glob, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "polyhaven", "models")
OUT = os.path.join(ROOT, "assets", "library", "asawera_library.blend")
for c in list(bpy.data.collections): bpy.data.collections.remove(c)
for o in list(bpy.data.objects): bpy.data.objects.remove(o)
x = 0.0
for blend in sorted(glob.glob(os.path.join(SRC, "*", "*_2k.blend"))):
    name = os.path.basename(os.path.dirname(blend))
    with bpy.data.libraries.load(blend, link=False) as (src, dst):
        dst.objects = [n for n in src.objects]
    col = bpy.data.collections.new("LIB_" + name); bpy.context.scene.collection.children.link(col)
    obs = [o for o in dst.objects if o is not None and o.type in ('MESH', 'EMPTY', 'CURVE')]
    for o in obs:
        col.objects.link(o)
        if o.parent is None: o.location.x += x          # side by side in the file, so all can be seen at once
    x += 1.5
    col.asset_mark(); col.asset_data.description = "Poly Haven CC0: " + name
    col.asset_data.tags.new("asawera"); col.asset_generate_preview()
    tris = sum(len(o.data.polygons) for o in obs if o.type == 'MESH')
    print("LIB", name, len(obs), "objects", tris, "faces")
bpy.ops.file.make_paths_relative()
bpy.ops.wm.save_as_mainfile(filepath=OUT, relative_remap=True)
print("SAVED", OUT)
