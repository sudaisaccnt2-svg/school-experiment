"""Update the existing app only if its signing certificate matches; never uninstall."""
import json,re,subprocess
from pathlib import Path
app=Path(__file__).resolve().parents[1];folder=app/'private-testing';folder.mkdir(exist_ok=True)
adb='C:/Users/Sudais/AppData/Local/Android/Sdk/platform-tools/adb.exe';serial='06116250AR000286'
signer='C:/Users/Sudais/AppData/Local/Android/Sdk/build-tools/37.0.0/apksigner.bat'
def command(args):
    result=subprocess.run(args,capture_output=True,timeout=180)
    if result.returncode:raise RuntimeError('Phone compatibility check failed; existing app data preserved.')
    return result.stdout.decode('utf-8',errors='replace')
remote=command([adb,'-s',serial,'shell','pm','path','com.asawera.chemistry']).strip().splitlines()[0].removeprefix('package:')
assert remote.startswith('/data/app/') and remote.endswith('/base.apk')
installed=folder/'installed-asawera.apk';command([adb,'-s',serial,'pull',remote,str(installed)])
def certificate(path):
    value=command([signer,'verify','--print-certs',str(path)]);return re.search(r'certificate SHA-256 digest: ([a-f0-9]{64})',value).group(1)
current=certificate(installed);release=app/'dist/asawera-chemistry-1.0.1.apk';debug=app/'app/build/outputs/apk/debug/app-debug.apk'
variant='release' if certificate(release)==current else 'debug' if certificate(debug)==current else None
result={'deviceModel':'Infinix X682B','existingSigningKeyMatchesRelease':variant=='release','existingSigningKeyMatchesDebug':variant=='debug','appDataPreserved':True,'uninstallPerformed':False,'updated':False,'physicalArPlacementVerified':False}
if variant:
    command([adb,'-s',serial,'install','-r',str(release if variant=='release' else debug)])
    result.update(updated=True,installedVersion='1.0.1',installedVariant=variant)
    try:command([adb,'-s',serial,'shell','am','start','-W','-n','com.asawera.chemistry/.MainActivity'])
    except (subprocess.TimeoutExpired,RuntimeError):result['launchVerified']=False
(app/'connected-device-update.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print(json.dumps(result))
