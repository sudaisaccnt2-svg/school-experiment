"""Copy a tested release into the APK; website source and snapshots remain untouched."""
from pathlib import Path
import hashlib,json,re,argparse
HERE=Path(__file__).resolve().parents[1];WORK=HERE.parent
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--release',default='5300af60fa6b');args=parser.parse_args()
release=WORK/'publishing/cloudflare/releases'/args.release;dest=HERE/'app/src/main/assets/site';dest.mkdir(parents=True,exist_ok=True)
excluded={'sw.js','offline.js','account.html','owner-sign-in.html','privacy.html','404.html','_headers','_routes.json','manifest.webmanifest'}
copied=[]
for source in release.rglob('*'):
 if not source.is_file():continue
 relative=source.relative_to(release)
 if relative.as_posix().startswith(('commerce/','ar/')) or relative.as_posix() in excluded:continue
 content=source.read_bytes()
 if source.suffix=='.html':
  text=content.decode('utf-8');text=re.sub(r'<script\b[^>]*src=["\'][^"\']*(?:offline\.js|commerce/runtime\.js)["\'][^>]*>\s*</script>','',text)
  text=re.sub(r'<link\b[^>]*rel=["\']manifest["\'][^>]*>','',text)
  if relative.as_posix()=='index.html':text=text.replace('</body>', '<script src="native-bridge.js"></script></body>')
  content=text.encode('utf-8')
 (dest/relative).parent.mkdir(parents=True,exist_ok=True);(dest/relative).write_bytes(content);copied.append({'path':relative.as_posix(),'sha256':hashlib.sha256(content).hexdigest(),'bytes':len(content)})
for overlay in (HERE/'lesson-overlays').glob('*.js'):
 (dest/overlay.name).write_bytes(overlay.read_bytes())
films=json.loads((release/'films.json').read_text(encoding='utf-8'));ar=[];seen=set()
for film in films['films']:
 meta=json.loads((release/film['meta']).read_text(encoding='utf-8'))
 film['arZones']=[]
 for zone in meta.get('zones',[]):
  source=zone.get('ar')
  if not source:continue
  filename=hashlib.sha256(source.encode()).hexdigest()[:20]+'.glb';output=HERE/'app/src/main/assets/native-ar'/filename
  film['arZones'].append({'name':zone['name'],'source':source,'asset':'native-ar/'+filename})
  if source not in seen:ar.append({'source':str(release/source),'output':str(output)});seen.add(source)
 (dest/film['meta']).write_bytes((release/film['meta']).read_bytes())
(HERE/'app/src/main/assets/catalog.json').write_text(json.dumps(films,ensure_ascii=False),encoding='utf-8')
(HERE/'ar-conversion-jobs.json').write_text(json.dumps(ar,indent=2),encoding='utf-8')
(HERE/'asset-manifest.json').write_text(json.dumps({'release':args.release,'lessonCount':len(films['films']),'arSceneCount':len(ar),'sourceLessonBytesUnchanged':True,'embeddedFiles':copied,'nativeArJobs':ar},indent=2),encoding='utf-8')
print('Embedded '+str(len(films['films']))+' lessons; prepared '+str(len(ar))+' native AR conversions. Google web ad scripts excluded.')
