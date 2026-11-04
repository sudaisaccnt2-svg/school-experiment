"""Restore only our temporary publishing pointer; preserve other agents' changes."""
import json
from pathlib import Path
root=Path(__file__).resolve().parents[2]/'publishing/cloudflare'
pointer=root/'latest.json';current=json.loads(pointer.read_text(encoding='utf-8'))
if current['version'] in {'31b8d4b5ce34','802c5470e33e','b73a95cf48e1'}:
 latest=json.loads((root/'releases/c85d85d213c1.json').read_text(encoding='utf-8'));pointer.write_text(json.dumps(latest,indent=2)+'\n',encoding='utf-8')
 print('Restored the main website publishing pointer to the current lesson release.')
else:print('Another agent has updated the publishing pointer; it was preserved.')
