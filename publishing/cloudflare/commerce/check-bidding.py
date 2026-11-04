"""Exercise actual ad-loader code against a local GPT fixture. No real auctions or impressions."""
import argparse
import http.server
import json
import threading
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

HERE=Path(__file__).resolve().parent
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--report',type=Path,required=True);args=parser.parse_args()
report=json.loads(args.report.read_text(encoding='utf-8'));release=Path(report['releaseDirectory'])
state={'mode':'home'}
config={'adsProvider':'admanager','gamNetworkCode':'12345','gamHomeUnit':'/12345/asawera_home','gamLessonUnit':'/12345/asawera_end','adsEnabled':True,'adsApproved':True,'adsLocationEligible':True,'adsOnHome':True,'adsOnLessonEnd':True,'ageTreatment':2}
class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*a,**kw):super().__init__(*a,directory=str(release),**kw)
    def do_GET(self):
        if urlsplit(self.path).path in ['/home','/index']:
            mode=state['mode'];cfg=dict(config,adsLocationEligible=mode!='outside-pk',adsOnHome=mode!='placement-off',ageTreatment=1 if mode=='child' else 2)
            identity={'membership':{'pro':mode=='pro'},'config':cfg}
            content=f'''<!doctype html><meta name="viewport" content="width=device-width"><style>body{{margin:16px}}#intro{{width:100%;max-width:900px}}#cards{{height:1100px}}[hidden]{{display:none!important}}</style><div id="cards">Local verification fixture</div><section id="intro"><div id="introEnd" hidden>Lesson finished</div></section><script type="module">import {{mountAdvertising}} from '/commerce/ads.js';mountAdvertising({json.dumps(identity)});</script>'''.encode()
            self.send_response(200);self.send_header('Content-Type','text/html');self.end_headers();self.wfile.write(content);return
        super().do_GET()
    def log_message(self,*_):pass
fixture="""window.__gptCalls=[];const calls=window.__gptCalls;let listener=null,slot=null;const service={setPrivacySettings(x){calls.push(['privacy',x]);},addEventListener(event,fn){listener=fn;},refresh(slots){calls.push(['request',slots.length]);if(window.__empty)listener({slot,isEmpty:true});}};const tag=window.googletag;tag.setConfig=x=>calls.push(['config',x]);tag.pubads=()=>service;tag.defineSlot=(path,sizes,id)=>{calls.push(['slot',path,sizes,id]);slot={addService(){return slot;}};return slot;};tag.enableServices=()=>calls.push(['enable']);tag.display=id=>calls.push(['display',id]);const queue=tag.cmd;tag.cmd={push:fn=>fn()};queue.forEach(fn=>fn());"""
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
checks=[]
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(channel='chrome',headless=True)
  for mode in ['home','lesson','pro','outside-pk','placement-off','deny','new-provider','child','empty','sdk-failure','offline']:
   state['mode']=mode;ctx=browser.new_context(viewport={'width':390,'height':844});attempts=[];errors=[]
   ctx.add_init_script("localStorage.setItem('asawera.ads-choice',"+json.dumps('deny' if mode=='deny' else 'allow')+");localStorage.setItem('asawera.ads-provider-choice',"+json.dumps('adsense-v1' if mode=='new-provider' else 'admanager-v1')+");window.__empty="+('true' if mode=='empty' else 'false')+";")
   if mode=='offline':ctx.add_init_script("Object.defineProperty(navigator,'onLine',{get:()=>false});")
   def sdk(route):
    attempts.append(route.request.url)
    if mode=='sdk-failure':route.abort()
    else:route.fulfill(status=200,content_type='text/javascript',body=fixture)
   ctx.route('https://securepubads.g.doubleclick.net/**',sdk)
   ctx.route('https://pagead2.googlesyndication.com/**',lambda route:route.abort())
   page=ctx.new_page();page.on('pageerror',lambda error:errors.append(str(error)));page.goto(base+('/index' if mode=='lesson' else '/home'),wait_until='load');page.wait_for_timeout(150)
   assert not attempts,(mode,'loaded before viewable placement')
   if mode in ['pro','outside-pk','placement-off','deny','offline']:assert page.locator('#asaweraAd').count()==0
   else:
    if mode=='lesson':page.evaluate("document.querySelector('#cards').remove();document.querySelector('#introEnd').hidden=false")
    page.locator('#asaweraAd').scroll_into_view_if_needed();page.wait_for_timeout(150)
    if mode=='new-provider':
     assert not attempts;page.locator('#asaweraAd button').filter(has_text='Allow ads').click()
    if mode in ['empty','sdk-failure']:page.wait_for_function("() => !document.querySelector('#asaweraAd')")
    else:
     page.wait_for_function("() => window.__gptCalls?.some(row=>row[0]==='request')")
     calls=page.evaluate('window.__gptCalls');assert [row for row in calls if row[0]=='request']==[['request',1]],(mode,calls)
     privacy=[row[1] for row in calls if row[0]=='privacy'][0];assert privacy=={'nonPersonalizedAds':True,'tagForAgeTreatment':1 if mode=='child' else 2}
     assert calls.index(['config',{'disableInitialLoad':True}])<calls.index(['enable'])
     slot=[row for row in calls if row[0]=='slot'][0];assert slot[1]==('/12345/asawera_end' if mode=='lesson' else '/12345/asawera_home');assert all(size[0]<=364 for size in slot[2])
     page.evaluate("document.dispatchEvent(new Event('visibilitychange'));window.dispatchEvent(new Event('online'))");page.wait_for_timeout(100);assert len(page.evaluate("window.__gptCalls.filter(row=>row[0]==='request')"))==1
     assert len(attempts)==1
   assert not errors,(mode,errors);print('PASS:',mode,flush=True);checks.append(mode);ctx.close()
  browser.close()
 (HERE/'bidding-verification.json').write_text(json.dumps({'version':report['version'],'realAdRequests':0,'localFixtureChecks':checks},indent=2),encoding='utf-8')
finally:server.shutdown();server.server_close()
