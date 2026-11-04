"""Verify signed artifacts, preserve model bytes, and stage a streamed public APK download."""
import hashlib,json,shutil,struct,subprocess,zipfile,re
from pathlib import Path
from xml.etree import ElementTree
app=Path(__file__).resolve().parents[1];work=app.parent;publishing=work/'publishing/cloudflare'
apk=app/'app/build/outputs/apk/release/app-release.apk';bundle=app/'app/build/outputs/bundle/release/app-release.aab'
assert apk.is_file() and bundle.is_file()
signer=Path(r'C:\Users\Sudais\AppData\Local\Android\Sdk\build-tools\37.0.0\apksigner.bat')
result=subprocess.run([str(signer),'verify','--verbose','--print-certs',str(apk)],capture_output=True,text=True)
assert result.returncode==0,result.stdout+result.stderr
manifest=json.loads((app/'asset-manifest.json').read_text(encoding='utf-8'));source=publishing/'releases'/manifest['release'];catalog=json.loads((app/'app/src/main/assets/catalog.json').read_text(encoding='utf-8'))
assert len(catalog['films'])==110
models={path.relative_to(source).as_posix() for path in source.rglob('*.glb') if not path.relative_to(source).as_posix().startswith('commerce/')}
for film in catalog['films']:
 meta=json.loads((source/film['meta']).read_text(encoding='utf-8'));models.add(meta.get('glb','models/rutherford.glb'))
for relative in models:assert (source/relative).read_bytes()==(app/'app/src/main/assets/site'/relative).read_bytes(),relative
ar_files=list((app/'app/src/main/assets/native-ar').glob('*.glb'));assert len(ar_files)==113
for path in ar_files:
 data=path.read_bytes();magic,version,length=struct.unpack('<4sII',data[:12]);assert magic==b'glTF' and version==2 and length==len(data),path.name
 size,kind=struct.unpack('<I4s',data[12:20]);assert kind==b'JSON';document=json.loads(data[20:20+size]);assert document.get('meshes'),path.name
 for entry in document.get('buffers',[])+document.get('images',[]):assert 'uri' not in entry or entry['uri'].startswith('data:'),path.name
with zipfile.ZipFile(apk) as archive:
 names=archive.namelist();assert json.loads(archive.read('assets/catalog.json'))==catalog
 assert all(name.startswith('lib/arm64-v8a/') for name in names if name.startswith('lib/') and name.endswith('.so')),'Build the default ARM64 release before public packaging; the emulator screenshot build is not the phone artifact.'
 assert len([name for name in names if name.startswith('assets/native-ar/') and name.endswith('.glb')])==113
 assert not any(marker in name.lower() for name in names for marker in ['private-signing','private-migration','owner-login.json','signing.properties','asawera.p12','owner-markup','prebid-'])
tests=[]
for report in (app/'app/build/test-results/testDebugUnitTest').glob('TEST-*.xml'):
 root=ElementTree.parse(report).getroot();assert root.get('failures')=='0' and root.get('errors')=='0';tests.append(int(root.get('tests')))
assert sum(tests)==6
test_log=(app/'emulator-commerce-test.log').read_bytes();test_text=test_log.decode('utf-16' if test_log.startswith(b'\xff\xfe') else 'utf-8');assert 'OK (3 tests)' in test_text
version_name=re.search(r'versionName\s*=\s*"([^"]+)"',(app/'app/build.gradle.kts').read_text()).group(1)
dist=app/'dist';dist.mkdir(exist_ok=True);digest=hashlib.sha256(apk.read_bytes()).hexdigest();filename='asawera-chemistry-'+version_name+'-'+digest[:12]+'.apk'
shutil.copyfile(apk,dist/('asawera-chemistry-'+version_name+'.apk'));shutil.copyfile(bundle,dist/('asawera-chemistry-'+version_name+'.aab'))
public=app/'hosting/staging';parts_folder=public/'files';parts_folder.mkdir(parents=True,exist_ok=True);part_size=16*1024*1024;parts=[]
with apk.open('rb') as stream:
 index=0
 while chunk:=stream.read(part_size):
  name=digest[:12]+'-'+str(index).zfill(3)+'.bin';(parts_folder/name).write_bytes(chunk);parts.append({'path':'/android/files/'+name,'bytes':len(chunk),'sha256':hashlib.sha256(chunk).hexdigest()});index+=1
artifact={'version':version_name,'packageName':'com.asawera.chemistry','filename':filename,'bytes':apk.stat().st_size,'sha256':digest,'partSize':part_size,'parts':parts,'minAndroid':'8.0','architecture':'arm64-v8a','downloadPath':'/android/download/'+filename}
(public/'artifact.json').write_text(json.dumps(artifact,indent=2)+'\n',encoding='utf-8')
(app/'hosting/android-artifact.mjs').write_text('export default '+json.dumps(artifact)+';\n',encoding='utf-8')
receipt={**artifact,'signedApkVerified':True,'apkCertificateVerification':result.stdout.splitlines(),'lessonCount':110,'nativeArSceneCount':113,'originalLessonModelsPreserved':len(models),'unitTestsPassed':sum(tests),'offlinePlaybackAndNativeArStartupTestsPassed':3,'physicalCameraPlacementVerified':False,'paidServing':False,'googlePaymentProfileSubmitted':True,'googleAccountAndStoreApprovalPending':True,'nativePlayBillingImplemented':True,'livePlayBillingConnected':False,'privateCredentialsPackaged':False,'sourceRelease':manifest['release']}
(dist/'verification.json').write_text(json.dumps(receipt,indent=2)+'\n',encoding='utf-8')
print('Verified signed APK and AAB. Preserved '+str(len(models))+' lesson models; validated 113 embedded AR scenes; 6 unit and 3 offline/native startup tests passed.')
print('APK size: '+str(apk.stat().st_size)+' bytes. Public download staged in '+str(len(parts))+' static parts.')
