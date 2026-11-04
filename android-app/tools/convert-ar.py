"""Run inside isolated Blender background processes. Read USDZ; export only Android copies."""
import bpy,json,sys,hashlib
from pathlib import Path
jobfile=Path(sys.argv[sys.argv.index('--')+1]);jobs=json.loads(jobfile.read_text(encoding='utf-8'))
for job in jobs:
 source=Path(job['source']);output=Path(job['output']);output.parent.mkdir(parents=True,exist_ok=True)
 if output.exists() and output.stat().st_size>100:continue
 bpy.ops.wm.read_factory_settings(use_empty=True)
 bpy.ops.wm.usd_import(filepath=str(source))
 meshes=[obj for obj in bpy.context.scene.objects if obj.type=='MESH'];assert meshes,'Empty AR scene: '+str(source)
 bpy.ops.export_scene.gltf(filepath=str(output),export_format='GLB',export_animations=False,export_cameras=False,export_lights=False,export_yup=True)
 assert output.read_bytes()[:4]==b'glTF'
 print('ANDROID_AR_READY '+output.name+' '+str(output.stat().st_size),flush=True)
