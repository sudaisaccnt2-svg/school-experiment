# ---- 07: render optimisation + iPad-ready output settings ----
# Each object only renders during the act whose zone it sits in (apparatus x<30, atomic x<90, model beyond),
# so lights, shadows and geometry of the other zones cost nothing.
ZONES = ((1, 659), (660, 959), (960, scene.frame_end))
scene.frame_set(1)
counts = [0, 0, 0]
for ob in scene.objects:
    if ob.type == 'CAMERA' or ob.name.endswith(" Target") or ob.hide_render or ob.hide_get():  # keep hidden things hidden
        continue
    x = ob.matrix_world.translation.x
    z = 0 if x < 30 else (1 if x < 90 else 2)
    counts[z] += 1
    for i, (f0, _) in enumerate(ZONES):
        kf(ob, "hide_render", f0, i != z, 'CONSTANT')
print("objects per act:", counts)

# Output: PNG sequence (crash-safe and resumable), encoded to MP4 afterwards by encode_mp4.py
r = scene.render
r.image_settings.file_format = 'PNG'
r.image_settings.color_mode = 'RGB'
r.image_settings.color_depth = '8'
r.image_settings.compression = 15
r.filepath = "//renders/frames/frame_"
r.use_file_extension = True
r.use_overwrite = False     # re-running the render skips frames that already exist
r.use_placeholder = True    # lets several Blender instances share the work
scene.frame_set(1)
bpy.ops.outliner.orphans_purge(do_recursive=True)
if bpy.data.filepath:
    bpy.ops.wm.save_mainfile()
print("optimize ok")
