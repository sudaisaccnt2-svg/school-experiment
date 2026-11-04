"""Pack opaque Chapter 7 light maps as JPEG; preserve every alpha texture and mesh byte.

These are diffuse light maps, not labels. The original bakes remain in renders/u7-review/bake-originals.
"""
from pathlib import Path
import io, json, struct
from PIL import Image

root=Path(__file__).resolve().parent.parent
backup=root/'renders/u7-review/bake-originals';backup.mkdir(exist_ok=True)
before=after=0
for path in sorted((root/'web/lesson/bake').glob('u7_*.glb')):
    data=path.read_bytes();before+=len(data)
    size=struct.unpack_from('<I',data,12)[0];doc=json.loads(data[20:20+size]);raw=data[28+size:]
    images={im['bufferView']:im for im in doc.get('images',[]) if im.get('mimeType')=='image/png'}
    packed=bytearray();changed=False
    for i,view in enumerate(doc.get('bufferViews',[])):
        start=view.get('byteOffset',0);blob=raw[start:start+view['byteLength']]
        if i in images:
            im=Image.open(io.BytesIO(blob))
            opaque='A' not in im.getbands() or im.getchannel('A').getextrema()==(255,255)
            if opaque:
                output=io.BytesIO();im.convert('RGB').save(output,format='JPEG',quality=87,subsampling=0,optimize=True)
                if len(output.getvalue())<len(blob):blob=output.getvalue();images[i]['mimeType']='image/jpeg';changed=True
        while len(packed)%4:packed.append(0)
        view['byteOffset']=len(packed);view['byteLength']=len(blob);packed.extend(blob)
    if changed:
        if not (backup/path.name).exists():(backup/path.name).write_bytes(data)
        doc['buffers'][0]['byteLength']=len(packed)
        while len(packed)%4:packed.append(0)
        js=json.dumps(doc,separators=(',',':'),ensure_ascii=False).encode('utf8')
        while len(js)%4:js+=b' '
        result=struct.pack('<4sII',b'glTF',2,28+len(js)+len(packed))+struct.pack('<I4s',len(js),b'JSON')+js+struct.pack('<I4s',len(packed),b'BIN\0')+packed
        path.write_bytes(result)
    after+=path.stat().st_size
print(f'Chapter 7 bakes: {before/1e6:.1f} MB -> {after/1e6:.1f} MB; transparent textures and geometry preserved.')
