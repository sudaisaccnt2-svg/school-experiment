"""Student-view evidence for all Chapter 7 lessons. No passing result is inferred from source comments.

python scripts/review_u7.py inventory
python scripts/review_u7.py capture [701 ...]   # whole lesson, 1.5-second frames, 24 per sheet
python scripts/review_u7.py screens [701 ...]   # all five required screen shapes
python scripts/review_u7.py flicker [701 ...]   # every three seconds and beat boundaries
python scripts/review_u7.py casters            # shared bench stations, original export algorithm
python scripts/review_u7.py bake               # bake the exported stations sequentially
Use U7_OLD=1 for unbaked draft previews. All output stays inside renders/u7-review/.
"""
import base64, functools, http.server, json, math, os, subprocess, sys, threading, time
from pathlib import Path
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
WEB=Path(os.environ.get('U7_WEB',str(ROOT/'web'))); OUT=ROOT/'renders'/'u7-review'; OUT.mkdir(parents=True,exist_ok=True)
MODE=sys.argv[1] if len(sys.argv)>1 else 'inventory'
IDS=sys.argv[2:] or [str(i) for i in range(701,720)]
OLD=os.environ.get('U7_OLD')=='1'
SIZES=[(1180,820),(1920,1080),(844,390),(390,844),(1600,600)]
SCREEN_ONLY={int(i) for i in os.environ.get('U7_SCREEN_ONLY','0,1,2,3,4').split(',')}

def sheet(frames,path,cols=4):
    tw,th=420,292
    out=Image.new('RGB',(tw*cols,th*math.ceil(len(frames)/cols)),(12,15,22))
    for i,(t,p) in enumerate(frames):
        im=Image.open(p);im.thumbnail((tw,th));x=(i%cols)*tw;y=(i//cols)*th
        out.paste(im,(x+(tw-im.width)//2,y));ImageDraw.Draw(out).text((x+7,y+5),f'{t:.2f}s',fill='#ff8c74')
    out.save(path,quality=90)

if MODE=='bake':
    stations=json.loads((OUT/'stations.json').read_text(encoding='utf8'))
    for name in stations:
        asset=WEB/'lesson'/'bake'/f'u7_{name}.glb';caster=ROOT/'renders'/'bake'/f'u7_{name}_casters.glb'
        if asset.exists() and asset.stat().st_mtime>=caster.stat().st_mtime:
            print('BAKE',name,'CURRENT',flush=True);continue
        tmp=OUT/'tmp';tmp.mkdir(exist_ok=True)
        env={**os.environ,'LESSON':'u7','STATION':name,'ENV':'0.25','SAMPLES':'128','TEMP':str(tmp),'TMP':str(tmp)}
        log=OUT/f'bake-{name}.log'
        with log.open('w',encoding='utf8') as f:
            result=subprocess.run([r'C:\Program Files\Blender Foundation\Blender 4.5\blender.exe','-b','--factory-startup','--python',str(ROOT/'scripts'/'bake_set.py')],env=env,stdout=f,stderr=subprocess.STDOUT)
        good=result.returncode==0 and 'BAKED u7 '+name in log.read_text(encoding='utf8')
        print('BAKE',name,'PASS' if good else 'FAIL',flush=True)
        if not good:raise RuntimeError(log.read_text(encoding='utf8')[-4000:])
    sys.exit(0)

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*a,**kw):super().__init__(*a,directory=str(WEB),**kw)
    def log_message(self,*a):pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler)
threading.Thread(target=srv.serve_forever,daemon=True).start()

def seek(page,t):
    page.evaluate('async t=>{window._lesson.seek(t);await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);}',t)

report={};stations={};risk_count=0
with sync_playwright() as p:
    browser=p.chromium.launch(channel='chrome',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
    if MODE=='games':
        pg=browser.new_page(viewport={'width':1180,'height':820},service_workers='block');errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto(f'http://127.0.0.1:{srv.server_port}/games.html?game=recall7&part=explore')
        pg.wait_for_function("document.title==='READY'",timeout=60000)
        count=pg.evaluate('async()=>(await import("./games/recall7-data.js")).RECALL7.length')
        for k in range(count):
            pg.evaluate('k=>window._g.game.load(0,k)',k);pg.wait_for_timeout(80)
            if k%10==0:print('GAME Explore',k,'/',count,flush=True)
            if errs:raise RuntimeError(f'Game item {k}: {errs}')
        for part in range(1,7):
            pg.evaluate('p=>window._g.game.load(p,0)',part)
            pg.locator('#ch button[data-k="0"]').click();pg.wait_for_timeout(8500)
            pg.screenshot(path=str(OUT/f'game-part-{part}.png'))
        pg.set_viewport_size({'width':390,'height':844});pg.evaluate('()=>window._g.game.load(4,0)');pg.wait_for_timeout(1000);pg.screenshot(path=str(OUT/'game-phone.png'))
        print('GAME ITEMS',count,'ERRORS',errs or 'none',flush=True)
        (OUT/'games.json').write_text(json.dumps({'items':count,'parts':6,'errors':errs}),encoding='utf8')
        browser.close();srv.shutdown();sys.exit(1 if errs else 0)
    for lid in IDS:
        pg=browser.new_page(viewport={'width':1180,'height':820},service_workers='block');errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.on('response',lambda r: errs.append(f'{r.status} {r.url}') if r.status>=400 and 'favicon' not in r.url and '/api/' not in r.url else None)
        if MODE=='casters':
            exporter=(ROOT/'tools'/'three'/'GLTFExporter.js').read_text(encoding='utf8')
            pg.route('**/_tools/GLTFExporter.js',lambda r:r.fulfill(body=exporter,content_type='text/javascript'))
        pg.goto(f'http://127.0.0.1:{srv.server_port}/lesson/index.html?id={lid}&t=0'+('&look=old' if OLD or MODE=='casters' else ''))
        try:pg.wait_for_function('window._ready===true',timeout=60000)
        except Exception:raise RuntimeError(f'{lid} not ready: {errs}')
        definition=pg.evaluate('async id=>(await import("./u7.js")).getDefinition(id)',lid)
        beats=[];total=0
        for b in definition['beats']:
            b={**b,'start':total};total+=b['duration'];b['end']=total;beats.append(b)
        row={'question':definition['question'],'duration':round(total,3),'beats':beats,'errors':errs}
        print(lid,MODE,round(total,1),'s',len(beats),'beats',flush=True)
        if MODE=='capture':
            ts=sorted({round(t*1.5,3) for t in range(math.ceil(total/1.5))}|{round(b['start']+.02,3) for b in beats}|{round(total-.1,3)})
            frames=[]
            for j,t in enumerate(ts):
                seek(pg,t);pg.wait_for_timeout(300)
                path=OUT/f'{lid}-{t:.2f}.jpg';pg.screenshot(path=str(path),type='jpeg',quality=76);frames.append((t,path))
                if len(frames)==24 or j==len(ts)-1:sheet(frames,OUT/f'{lid}-dense-{j//24+1}.jpg');frames=[]
            row['frames']=len(ts)
        elif MODE in ('screens','layout'):
            row['screenSizes']=[list(size) for i,size in enumerate(SIZES) if i in SCREEN_ONLY]
            times=[t for b in beats for t in ([b['start']+b['cardTime']-1,b['start']+b['cardTime']+6] if b['type']=='mcq' else [b['start']+min(6,b['duration']-.3)])]
            row['layout']=[]
            for si,(w,h) in enumerate(SIZES):
                if si not in SCREEN_ONLY:continue
                pg.set_viewport_size({'width':w,'height':h});frames=[]
                for j,t in enumerate(times):
                    seek(pg,t);pg.wait_for_timeout(300)
                    faults=pg.evaluate('''()=>{const faults=[],cap=document.querySelector('#cap span').getBoundingClientRect(),bar=document.querySelector('#bar').getBoundingClientRect(),q=document.querySelector('.u7-question');if(cap.bottom>bar.top+2)faults.push('caption overlaps controls');if(q&&!q.hidden&&q.scrollHeight>q.clientHeight+1)faults.push('question needs scrolling');return faults;}''')
                    if faults:row['layout'].append({'size':[w,h],'t':t,'faults':faults})
                    if MODE=='screens':
                        path=OUT/f'{lid}-{w}x{h}-{j}.png';pg.screenshot(path=str(path));frames.append((t,path))
                if MODE=='screens':sheet(frames,OUT/f'{lid}-screen-{si}.jpg')
            if row['layout']:print('LAYOUT',row['layout'],flush=True)
        elif MODE=='flicker':
            ts=sorted(set(range(0,math.ceil(total),3))|{round(b['start']+.4,3) for b in beats})
            found={}
            for t in ts:
                seek(pg,t)
                for risk in pg.evaluate('async()=>(await import("./zcheck.js")).zcheck(window._lesson.scene)'):found.setdefault(risk,t)
            row['flicker']=found;risk_count+=len(found)
            print('FLICKER RISKS:',len(found),flush=True)
        elif MODE=='casters':
            micro={'reaction','transfer','charge','rule','numbers','sharing','carbonNumbers','waterIons'}
            # Reuse the existing per-station still-object exporter, including its glass/material handling.
            code=(ROOT/'scripts'/'export_casters.py').read_text(encoding='utf8')
            js=code.split('JS = """',1)[1].split('"""',1)[0]
            for b in beats:
                d=b.get('proof',b)
                if d['type'] in micro:continue
                name='cell'+d.get('metal','Cu')+d.get('target','Fe') if d['type']=='cell' else 'industrial'+d['kind'] if d['type']=='industrial' else 'protect'+d['kind'] if d['type']=='protect' else 'rustNoAir' if d.get('noAir') else d['type']
                if name in stations:continue
                start=b['start']+b.get('cardTime',0)
                span=b['end']-start
                ts=[start+.05,start+span*.3,start+span*.6,b['end']-.1]
                n,data=pg.evaluate(js,ts)
                dest=ROOT/'renders'/'bake'/f'u7_{name}_casters.glb';dest.parent.mkdir(exist_ok=True);blob=base64.b64decode(data)
                if not dest.exists() or dest.read_bytes()!=blob:dest.write_bytes(blob)
                stations[name]={'lesson':lid,'times':ts,'meshes':n};print('CASTERS',name,n,flush=True)
        row['errors']=errs;report[lid]=row
        if errs:print('ERRORS',errs[:6],flush=True)
        pg.close()
    browser.close()
srv.shutdown()
report_path=OUT/f'{MODE}.json'
if MODE=='screens' and report_path.exists():
    previous=json.loads(report_path.read_text(encoding='utf8'))
    for lid,row in report.items():
        old=previous.get(lid,{})
        touched=row.get('screenSizes',[list(size) for size in SIZES])
        row['layout']=[r for r in old.get('layout',[]) if r['size'] not in touched]+row.get('layout',[])
        row['screenSizes']=sorted({tuple(size) for size in old.get('screenSizes',[list(size) for size in SIZES] if old else [])+touched})
    previous.update(report);report=previous
elif MODE in ('capture','flicker') and report_path.exists():
    previous=json.loads(report_path.read_text(encoding='utf8'));previous.update(report);report=previous
report_path.write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding='utf8')
if MODE=='casters':(OUT/'stations.json').write_text(json.dumps(stations,indent=2),encoding='utf8')
if MODE=='flicker':print('TOTAL FLICKER RISKS:',risk_count,flush=True)
if any(r['errors'] or r.get('layout') for r in report.values()) or risk_count:sys.exit(1)
