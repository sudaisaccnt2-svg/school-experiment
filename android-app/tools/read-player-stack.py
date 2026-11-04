from pathlib import Path
lines=(Path(__file__).resolve().parents[1]/'emulator-logcat.log').read_text(encoding='utf-8',errors='replace').splitlines()
starts=[i for i,line in enumerate(lines) if 'THREAD_STATE' in line and 'Thread[main,' in line]
for start in starts[-1:]:print('\n'.join(lines[start:start+32]))
