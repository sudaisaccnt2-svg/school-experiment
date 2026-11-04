"""Verify the real Prebid core with local bidder responses. No paid ad requests or impressions."""
import argparse,http.server,json,threading,time
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright
HERE=Path(__file__).resolve().parent
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--report',type=Path,required=True);args=parser.parse_args()
report=json.loads(args.report.read_text(encoding='utf-8'));release=Path(report['releaseDirectory']);state={'mode':'home'}
partners=[{'code':'pubmatic','publisherId':'12345','homeId':'home','lessonId':'lesson','approved':True,'restrictedApproved':True,'enabled':True,'sellers':'pubmatic.com, 12345, DIRECT'}, {'code':'ix','homeId':'12345','lessonId':'67890','approved':True,'restrictedApproved':True,'enabled':True,'sellers':'indexexchange.com, 12345, DIRECT'}]
config={'adsProvider':'prebid','adsEnabled':True,'adsApproved':True,'adsLocationEligible':True,'adsOnHome':True,'adsOnLessonEnd':True,'ageTreatment':1,'hbPartners':partners,'hbTimeoutMs':500,'hbHomeFloorUsd':0.25,'hbLessonFloorUsd':0.25}
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw):super().__init__(*a,directory=str(release),**kw)
 def do_GET(self):
  if urlsplit(self.path).path in ['/home','/index']:
   mode=state['mode'];cfg=dict(config,adsLocationEligible=mode!='outside-pk',adsOnHome=mode!='placement-off',hbHomeFloorUsd=3 if mode=='floor' else 0.25,hbPartners=partners[:1] if mode=='one-provider' else partners)
   identity={'membership':{'pro':mode=='pro'},'config':cfg}
   body=f'''<!doctype html><meta name="viewport" content="width=device-width"><style>body{{margin:16px}}#cards{{height:1100px}}[hidden]{{display:none!important}}</style><div id="cards">Local auction verification</div><section id="intro"><div id="introEnd" hidden>Lesson ended</div></section><script type="module">import {{mountAdvertising}} from '/commerce/ads.js';mountAdvertising({json.dumps(identity)});</script>'''.encode()
   self.send_response(200);self.send_header('Content-Type','text/html');self.end_headers();self.wfile.write(body);return
  super().do_GET()
 def do_POST(self):
  if urlsplit(self.path).path.startswith('/__local_bid/'):
   time.sleep(1.2);self.send_response(200);self.send_header('Content-Type','application/json');self.end_headers()
   try:self.wfile.write(b'{}')
   except (BrokenPipeError,ConnectionResetError,ConnectionAbortedError):pass
  else:self.send_error(404)
 def log_message(self,*_):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
fixture=r"""
pbjs.que.push(function(){
 window.__bidderRequests=[];
 for(const code of ['pubmatic','ix'])pbjs.registerBidAdapter(null,code,{
  code,supportedMediaTypes:['banner'],isBidRequestValid:()=>true,
  buildRequests(bids,request){window.__bidderRequests.push({code,coppa:request.ortb2.regs.coppa,bids:bids.map(bid=>({bidder:bid.bidder,params:bid.params,floor:bid.getFloor?.({currency:'USD',mediaType:'banner',size:'*'})}))});return {method:'POST',url:location.origin+'/__local_bid/'+code,data:JSON.stringify(bids.map(bid=>({requestId:bid.bidId,width:bid.mediaTypes.banner.sizes[0][0],height:bid.mediaTypes.banner.sizes[0][1]}))),options:{contentType:'application/json'}};},
  interpretResponse(response,request){return JSON.parse(request.data).map(bid=>({...bid,creativeId:'fixture-'+code,cpm:window.__empty ? 0 : code==='ix' ? 2 : 1,ad:'<html><body style="margin:0;background:#162332;color:white">LOCAL '+code+' WINNER - NO PAID IMPRESSION</body></html>',currency:'USD',netRevenue:true,ttl:60,meta:{advertiserDomains:['local.example']}}));}
 });
});
"""
checks=[]
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(channel='chrome',headless=True)
  for mode in ['home','lesson','pro','deny','offline','outside-pk','placement-off','new-provider','one-provider','floor','empty','sdk-failure','late']:
   state['mode']=mode;ctx=browser.new_context(viewport={'width':390,'height':844});errors=[];bundle=[];bids=[];external=[];console=[]
   choice='deny' if mode=='deny' else 'allow';provider='adsense-v1' if mode=='new-provider' else 'prebid-v1-ix,pubmatic'
   ctx.add_init_script("localStorage.setItem('asawera.ads-choice',"+json.dumps(choice)+");localStorage.setItem('asawera.ads-provider-choice',"+json.dumps(provider)+");window.__empty="+str(mode=='empty').lower()+";")
   if mode=='offline':ctx.add_init_script("Object.defineProperty(navigator,'onLine',{get:()=>false});")
   def route_all(route):
    url=route.request.url
    if not url.startswith(base+'/'):external.append(url);route.abort();return
    if urlsplit(url).path=='/commerce/prebid-11.41.0.js':
     bundle.append(url)
     if mode=='sdk-failure':route.abort()
     else:route.fulfill(status=200,content_type='text/javascript',body=(release/'commerce/prebid-11.41.0.js').read_text(encoding='utf-8')+'\n'+fixture)
    elif '/__local_bid/' in url:
     bids.append(url)
     if mode!='late':route.fulfill(status=200,content_type='application/json',body='{}')
     else:route.continue_()
    else:route.continue_()
   ctx.route('**/*',route_all);page=ctx.new_page();page.on('pageerror',lambda error:errors.append(str(error)));page.on('console',lambda message:console.append(message.text));page.goto(base+('/index' if mode=='lesson' else '/home'),wait_until='load');page.wait_for_timeout(150)
   assert not bundle,(mode,'ad bundle loaded before visibility')
   if mode in ['pro','deny','offline','outside-pk','placement-off','one-provider']:assert page.locator('#asaweraAd').count()==0
   else:
    if mode=='lesson':page.evaluate("document.querySelector('#cards').remove();document.querySelector('#introEnd').hidden=false")
    page.locator('#asaweraAd').scroll_into_view_if_needed();page.wait_for_timeout(150)
    if mode=='new-provider':assert not bundle;page.locator('#asaweraAd button').filter(has_text='Allow ads').click()
    if mode in ['floor','empty','sdk-failure','late']:
     page.wait_for_function("() => !document.querySelector('#asaweraAd')")
     if mode=='late':page.wait_for_timeout(1500);assert page.locator('#asaweraAd').count()==0
    else:
     try:page.wait_for_function("() => document.querySelector('#asaweraAd')?.dataset.status==='filled'",timeout=10000)
     except Exception:
      print(json.dumps({'mode':mode,'bundle':bundle,'bids':bids,'errors':errors,'external':external,'console':console[-25:],'prebid':page.evaluate("({requests:window.__bidderRequests,responses:window.pbjs?.getBidResponses?.(),rejected:window.pbjs?.getEvents?.().filter(e=>e.eventType==='bidRejected').map(e=>e.args)})")},indent=2),flush=True);raise
     assert 'LOCAL ix WINNER' in page.frame_locator('#asaweraAd > iframe').frame_locator('iframe').locator('body').inner_text()
     assert len(bundle)==1 and len(bids)==2,(mode,bundle,bids)
     requests=page.evaluate('window.__bidderRequests');assert all(request['coppa']==1 for request in requests)
     assert page.evaluate("pbjs.getConfig('deviceAccess')") is False;assert page.evaluate("pbjs.getConfig('userSync.syncEnabled')") is False
     assert all(row['floor']['floor']==0.25 for request in requests for row in request['bids'])
     page.evaluate("document.dispatchEvent(new Event('visibilitychange'));window.dispatchEvent(new Event('online'))");page.wait_for_timeout(100);assert len(bids)==2
   assert not external,(mode,external);assert not errors,(mode,errors);print('PASS:',mode,flush=True);checks.append(mode);ctx.close()
  browser.close()
 (HERE/'provider-auction-verification.json').write_text(json.dumps({'version':report['version'],'realAdRequests':0,'officialPrebidCoreTested':True,'checks':checks},indent=2)+'\n',encoding='utf-8')
finally:server.shutdown();server.server_close()
