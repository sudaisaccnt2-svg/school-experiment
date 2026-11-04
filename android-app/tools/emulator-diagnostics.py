"""Read only the isolated test emulator; never touch another device."""
import subprocess,sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]
adb=r'C:\Users\Sudais\AppData\Local\Android\Sdk\platform-tools\adb.exe'
def run(*args):
 return subprocess.run([adb,'-s','emulator-5580',*args],capture_output=True,timeout=30)
if '--launch' in sys.argv:
 run('shell','wm','size','720x1560')
 run('shell','wm','density','280')
 run('shell','am','force-stop','com.google.android.apps.nexuslauncher')
 run('shell','am','start','-W','-n','com.asawera.chemistry/.MainActivity')
shot=run('exec-out','screencap','-p')
if shot.returncode==0 and shot.stdout.startswith(b'\x89PNG'):
 (root/'emulator-screen.png').write_bytes(shot.stdout);print('Saved emulator screenshot.')
logs=run('logcat','-d','-v','brief').stdout.decode('utf-8',errors='replace')
(root/'emulator-logcat.log').write_text(logs,encoding='utf-8')
lines=logs.splitlines()
starts=[i for i,line in enumerate(lines) if 'THREAD_STATE' in line and 'Thread[main,' in line]
for start in starts[-1:]:
 print('\n'.join(lines[start:start+24]))
for line in logs.splitlines()[-3000:]:
 if any(marker in line for marker in ('chromium','AndroidRuntime','asawera','FATAL','ANR','filament')):print(line[:600])
