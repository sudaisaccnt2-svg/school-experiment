@echo off
rem Renders the whole film with Cycles on the NVIDIA GPU (OptiX) into renders\frames\ (resumable),
rem then encodes the iPad MP4. Safe to close and re-run: finished frames are skipped.
cd /d "%~dp0\.."
"C:\Program Files\Blender Foundation\Blender 4.5\blender.exe" -b "school experiment.blend" --python-expr "import bpy; p=bpy.context.preferences.addons['cycles'].preferences; p.compute_device_type='OPTIX'; p.get_devices(); [setattr(d,'use',d.type=='OPTIX') for d in p.devices]" -a
"C:\Program Files\Blender Foundation\Blender 4.5\blender.exe" -b --factory-startup --python scripts\encode_mp4.py
