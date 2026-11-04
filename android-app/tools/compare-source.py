import hashlib,json
from pathlib import Path
app=Path(__file__).resolve().parents[1];releases=app.parent/'publishing/cloudflare/releases';old=releases/'5300af60fa6b';new=releases/'c85d85d213c1'
changed=[]
for path in new.rglob('*'):
 if not path.is_file() or path.suffix not in {'.glb','.usdz','.hdr'}:continue
 relative=path.relative_to(new)
 if not (old/relative).exists() or hashlib.sha256(path.read_bytes()).digest()!=hashlib.sha256((old/relative).read_bytes()).digest():changed.append(relative.as_posix())
ar=[name for name in changed if name.endswith('.usdz')]
data={'previousRelease':'5300af60fa6b','currentRelease':'c85d85d213c1','changedModelFiles':len([name for name in changed if name.endswith('.glb')]),'changedArSources':ar,'changedAssets':changed}
(app/'source-rebase.json').write_text(json.dumps(data,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'changedModelFiles':data['changedModelFiles'],'changedArSceneCount':len(ar),'changedAssetCount':len(changed)}))
