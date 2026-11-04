"""Capture genuine release screens on the isolated emulator only."""
import json,re,subprocess,time
from pathlib import Path
from xml.etree import ElementTree as E
app=Path(__file__).resolve().parents[1];folder=app/'store-submission';folder.mkdir(exist_ok=True)
adb='C:/Users/Sudais/AppData/Local/Android/Sdk/platform-tools/adb.exe'
def run(*args):
    result=subprocess.run([adb,'-s','emulator-5580',*args],capture_output=True,timeout=40)
    if result.returncode:raise RuntimeError('Isolated emulator command failed.')
    return result.stdout
def nodes():
    run('shell','uiautomator','dump','/data/local/tmp/asawera-store-ui.xml')
    return list(E.fromstring(run('shell','cat','/data/local/tmp/asawera-store-ui.xml')).iter('node'))
def wait(text,seconds=45):
    end=time.monotonic()+seconds
    while time.monotonic()<end:
        tree=nodes()
        found=next((n for n in tree if n.get('text')==text),None)
        if found is not None:return found,tree
        time.sleep(.5)
    raise AssertionError('The release screen did not show '+text)
run('shell','wm','size','720x1280');run('shell','wm','density','280')
run('shell','am','force-stop','com.asawera.chemistry');run('shell','am','start','-W','-n','com.asawera.chemistry/.MainActivity')
_,tree=wait('Your chemistry lab');assert not any('test ad' in n.get('text','').lower() for n in tree)
time.sleep(2);(folder/'phone-01-library.png').write_bytes(run('exec-out','screencap','-p'))
lesson,_=wait("Rutherford's Atomic Model");left,top,right,bottom=map(int,re.findall(r'\d+',lesson.get('bounds')))
run('shell','input','tap',str((left+right)//2),str((top+bottom)//2))
wait("Rutherford's Atomic Model")
deadline=time.monotonic()+90
while time.monotonic()<deadline:
    tree=nodes()
    button=next((n for n in tree if n.get('resource-id','').endswith('playBtn') or n.get('text') in ['▶','►']),None)
    if button is not None:
        l,t,r,b=map(int,re.findall(r'\d+',button.get('bounds')));run('shell','input','tap',str((l+r)//2),str((t+b)//2));break
    time.sleep(.5)
else:raise AssertionError('The release lesson did not finish loading its play control.')
time.sleep(8)
tree=nodes();assert not any('cannot load' in n.get('text','').lower() for n in tree)
(folder/'phone-02-3d-lesson.png').write_bytes(run('exec-out','screencap','-p'))
status=json.loads((folder/'package-status.json').read_text(encoding='utf-8'));status.update(nativeScreenshotsPending=False,screenshots=['phone-01-library.png','phone-02-3d-lesson.png'],screenshotsFrom='Signed release build on the isolated emulator',screenshotDimensions=[720,1280],debugControlsShown=False);(folder/'package-status.json').write_text(json.dumps(status,indent=2)+'\n',encoding='utf-8')
print('Captured two genuine signed-release phone screens; debug ad controls are absent. Physical AR placement is not claimed.')
