import subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[1]
adb=r'C:\Users\Sudais\AppData\Local\Android\Sdk\platform-tools\adb.exe'
for file in ['app/build/outputs/apk/debug/app-debug.apk','app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk']:
 result=subprocess.run([adb,'-s','emulator-5580','install','-r',str(root/file)],capture_output=True,text=True,timeout=180)
 assert result.returncode==0,result.stdout+result.stderr
 print(Path(file).name+': installed.')
