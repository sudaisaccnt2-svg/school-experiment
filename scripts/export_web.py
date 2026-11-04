# Export film 01 (scene "Scene") for the web/iPad/VR viewer:  web/models/rutherford.glb, web/env.hdr, web/scene.json
# Run:  blender -b "2 school experiment.blend" -S Scene --python scripts/export_web.py
# (topic films 02-14 are exported by scripts/p2/export_topics.py with the same helpers from export_prep.py)
import bpy, os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "export_prep.py"), encoding="utf-8").read())

WEB = os.path.join(ROOT, "web")
os.makedirs(os.path.join(WEB, "models"), exist_ok=True)
assert scene.name == "Scene", "open film 01: blender -b <file> -S Scene"

cuts, camera_subject, camera_dof, camera_shift = camera_info()
prep_common()
bake_cameras()
prep_labels()
downscale_images(1024)
bake_color_adjustments()
world = world_info(os.path.join(WEB, "env.hdr"))
export_glb(os.path.join(WEB, "models", "rutherford.glb"), draco=True)   # geometry 17 MB -> ~3 MB


def zone(b):  # blender (x, y, z) -> three.js (x, z, -y)
    return [b[0], b[2], -b[1]]


cut_of = lambda cam: next(f for f, n in cuts if n == cam)
acts = [
    {"name": "Intro", "frame": scene.frame_start, "zone": 0},
    {"name": "The Experiment", "frame": cut_of("CamSource"), "zone": 0},
    {"name": "Inside the Foil", "frame": cut_of("CamAtomic"), "zone": 1},
    {"name": "Planetary Model", "frame": cut_of("CamModel"), "zone": 2},
]
# min_height: the viewer never lets your orbit go lower than this below the shot's subject (bench top = 0.2)
zones = [
    {"name": "Apparatus", "center": zone((-1.0, 0, 0.8)), "orbit_distance": 12, "vr_anchor": zone((-1.5, 0, 0)),
     "min_height": 0.2, "ar": "ar/experiment.usdz"},
    {"name": "Atomic view", "center": zone((60, 0, 10)), "orbit_distance": 26, "vr_anchor": zone((60, 0, 10)),
     "min_height": -6, "ar": "ar/inside_the_foil.usdz"},
    {"name": "Planetary model", "center": zone((118, 0, 10)), "orbit_distance": 24, "vr_anchor": zone((120, 0, 10)),
     "min_height": -6, "ar": "ar/planetary_model.usdz"},
]
if scene.get("act5_start"):   # act 5, p.44 (scripts/p2/defects.py)
    acts.append({"name": "Defects", "frame": int(scene["act5_start"]), "zone": 3})
    zones.append({"name": "Defects", "center": zone((180, 0, 10)), "orbit_distance": 24,
                  "vr_anchor": zone((180, 0, 10)), "min_height": -6, "ar": "ar/defects.usdz"})

meta = {
    "id": "01", "title": "Rutherford's Atomic Model", "glb": "models/rutherford.glb",
    "fps": FPS, "frame_start": scene.frame_start, "frame_end": scene.frame_end,
    "cuts": [{"frame": f, "camera": n} for f, n in cuts],
    "acts": acts, "zones": zones,
    # lens shift (glTF cameras have none): puts every shot's subject on the same eye-trace point
    "camera_dof": camera_dof, "camera_subject": camera_subject, "camera_shift": camera_shift,
    **world,
}
json.dump(meta, open(os.path.join(WEB, "scene.json"), "w"), indent=1)
