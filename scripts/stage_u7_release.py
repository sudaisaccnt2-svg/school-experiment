"""Stage only reviewed Chapter 7 changes over the current live, tested release.

This preserves unrelated lesson work in the shared web tree. prepare.py generates the public worker afterwards.
"""
from pathlib import Path
import json, shutil

root=Path(__file__).resolve().parent.parent
base=root/'publishing/cloudflare/releases/136fadbaff0e'
dest=root/'publishing/cloudflare/work/u7-student-review'
if not dest.exists():shutil.copytree(base,dest)
files=['app.js','lesson/kit.js','lesson/engine.js','lesson/index.html','lesson/u7.js','lesson/electrochem-kit.js',
       'games/main.js','games/games.css','games/recall7.js','games/recall7-data.js','games/oxlab.js',
       'games/redoxsort.js','games/celllab.js','games/quiz7.js']
files += [f'lesson/l{i}.js' for i in range(701,720)]
files += [p.relative_to(root/'web').as_posix() for p in (root/'web/lesson/bake').glob('u7_*.glb')]
for rel in files:
    target=dest/rel;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/'web'/rel,target)
films=json.loads((base/'films.json').read_text(encoding='utf8'))
next(f for f in films['films'] if f['id']=='718')['game']='recall7'
(dest/'films.json').write_text(json.dumps(films,ensure_ascii=False,indent=1),encoding='utf8')
print('Staged',len(files),'Chapter 7/shared files over live release 136fadbaff0e:',dest)
