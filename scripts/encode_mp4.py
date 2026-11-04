# Encode renders/frames/*.png into an iPad-compatible MP4 using Blender's built-in FFmpeg.
# Run:  blender -b --factory-startup --python scripts/encode_mp4.py
# Output: H.264 (High profile, yuv420p), MP4 container, 1920x1080 @ 30 fps, no audio.
# Plays natively in iPad Photos/Files/Keynote.
import bpy, os, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
frames = sorted(glob.glob(os.path.join(ROOT, "renders", "frames", "frame_*.png")))
frames = [f for f in frames if os.path.getsize(f) > 0]   # skip placeholders of unfinished frames
assert frames, "no rendered frames found"

s = bpy.context.scene
s.render.resolution_x, s.render.resolution_y, s.render.resolution_percentage = 1920, 1080, 100
s.render.fps = 30
s.view_settings.view_transform = 'Standard'   # frames are already tone-mapped; don't apply AgX twice
se = s.sequence_editor_create()
strip = se.strips.new_image("frames", frames[0], channel=1, frame_start=1) if hasattr(se, "strips") \
    else se.sequences.new_image("frames", frames[0], channel=1, frame_start=1)
for f in frames[1:]:
    strip.elements.append(os.path.basename(f))
s.frame_start, s.frame_end = 1, len(frames)

r = s.render
r.image_settings.file_format = 'FFMPEG'
r.ffmpeg.format = 'MPEG4'
r.ffmpeg.codec = 'H264'
r.ffmpeg.constant_rate_factor = 'HIGH'
r.ffmpeg.ffmpeg_preset = 'GOOD'
r.ffmpeg.gopsize = 30
r.ffmpeg.audio_codec = 'NONE'
r.filepath = os.path.join(ROOT, "Rutherford_Gold_Foil_Experiment_iPad.mp4")
r.use_file_extension = False
bpy.ops.render.render(animation=True)
print("wrote", r.filepath, "frames:", len(frames))
