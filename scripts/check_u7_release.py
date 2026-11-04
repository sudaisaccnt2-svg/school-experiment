"""Open every reviewed Chapter 7 route/beat and game with the network disabled.
Usage: python scripts/check_u7_release.py <release-directory>
"""
from pathlib import Path
import functools, http.server, json, sys, threading
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parent.parent
web=Path(sys.argv[1]).resolve();out=root/'renders/u7-review'
class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*a,**kw):super().__init__(*a,directory=str(web),**kw)
    def log_message(self,*a):pass
    def end_headers(self):self.send_header('Cache-Control','no-store');super().end_headers()
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler)
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/';errors=[];failed=[];network_only=[];report={}
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(channel='chrome',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        context=browser.new_context(viewport={'width':1180,'height':820})
        pg=context.new_page();pg.on('pageerror',lambda e:errors.append(str(e)))
        pg.goto(base+'home.html');pg.wait_for_function("document.querySelector('#offlineBadge')?.dataset.shellReady==='true'",timeout=90000)
        pg.locator('#saveAllOffline').click()
        pg.wait_for_function("document.querySelector('#offlineBadge')?.dataset.ready==='true'",timeout=240000)
        print('PASS full release saved',flush=True);context.set_offline(True)
        # Session/advertising APIs require a connection and are deliberately outside the lesson cache.
        def request_failed(r):
            if 'ERR_ABORTED' in (r.failure or ''):return
            (network_only if '/api/' in r.url else failed).append(r.url)
        pg.on('requestfailed',request_failed)
        pg.on('response',lambda r:failed.append(f'{r.status} {r.url}') if r.status>=400 and 'favicon' not in r.url and '/api/' not in r.url else None)
        for lid in map(str,range(701,720)):
            pg.goto(base+f'index.html?film={lid}&test=1');pg.wait_for_function('window._ready===true',timeout=90000)
            assert '/lesson/' in pg.url,pg.url
            definition=pg.evaluate('async id=>(await import("./u7.js")).getDefinition(id)',lid)
            t=0;times=[]
            for beat in definition['beats']:
                times.extend([t+.2,t+beat['duration']-.2]);t+=beat['duration']
            for point in times:
                pg.evaluate('async t=>{window._lesson.seek(t);await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)}',point)
            assert not errors and not failed,(lid,errors,failed)
            if lid=='718':assert 'recall7' in pg.locator('#practise').get_attribute('href')
            if lid=='701':
                pg.evaluate('()=>window._lesson.seek(2)')
                if pg.locator('body').evaluate("el=>el.classList.contains('paused')"):pg.locator('#play').dispatch_event('click')
                pg.wait_for_function("Number(document.querySelector('#scrub').value)>2",timeout=15000)
                pg.locator('#play').dispatch_event('click');pg.locator('#speed').dispatch_event('click');assert pg.locator('#speed').inner_text()=='2×'
            report[lid]={'beats':len(definition['beats']),'offline':True};print('PASS offline',lid,flush=True)
        for game in ['recall7','oxlab','redoxsort','celllab','quiz7']:
            pg.goto(base+'games.html?game='+game);pg.wait_for_function("document.title==='READY'",timeout=90000)
            assert not errors and not failed,(game,errors,failed)
            report[game]={'offline':True};print('PASS offline game',game,flush=True)
        pg.goto(base+'games.html?game=recall7&part=explore');pg.wait_for_function("document.title==='READY'")
        text=pg.locator('#goal').inner_text();assert 'oxidation' in text and '0' in text,text
        # Reveal is the same shared three-miss path used by the older labs.
        pg.evaluate('()=>{window._g.game.load(1,0);window._g.game.g.wrong();window._g.game.g.wrong();window._g.game.g.wrong();}')
        pg.wait_for_timeout(500);assert pg.locator('#ch button.on').count()==1
        pg.evaluate('()=>window._g.game.load(7,0)');assert 'sources' in pg.locator('#goal').inner_text().lower()
        report['errors']=errors;report['failedRequests']=failed;report['expectedNetworkOnlyRequests']=sorted(set(network_only))
        (out/'release-offline.json').write_text(json.dumps(report,indent=2),encoding='utf8')
        browser.close()
finally:server.shutdown();server.server_close()
