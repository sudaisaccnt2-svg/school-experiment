# ---- preview: render stills at given frames to renders/preview_<frame>.png ----
# Set PREVIEW_FRAMES / PREVIEW_PCT before appending this file, or use defaults.
import os
_frames = globals().get("PREVIEW_FRAMES", [scene.frame_current])
_pct = globals().get("PREVIEW_PCT", 50)
_outdir = os.path.join(os.path.dirname(bpy.data.filepath) or "D:/_Asawera art/school experiment", "renders")
os.makedirs(_outdir, exist_ok=True)
import time
_old = (scene.render.resolution_percentage, scene.cycles.samples, scene.render.filepath)
scene.render.resolution_percentage = _pct
scene.cycles.samples = globals().get("PREVIEW_SAMPLES", 64)
for f in _frames:
    scene.frame_set(f)
    scene.render.filepath = os.path.join(_outdir, "preview_%04d.png" % f)
    _t = time.time()
    bpy.ops.render.render(write_still=True)
    print("rendered %s in %.1f s" % (scene.render.filepath, time.time() - _t))
scene.render.resolution_percentage, scene.cycles.samples, scene.render.filepath = _old
