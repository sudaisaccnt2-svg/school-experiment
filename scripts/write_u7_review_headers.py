"""Copy the written, literal review evidence into each lesson header (skill §4 C5)."""
from pathlib import Path
root=Path(__file__).resolve().parent.parent
doc=(root/'docs/COVERAGE_U7.md').read_text(encoding='utf8')
audit=doc.split('## Skill quality audit',1)[1].split('## Verification results',1)[0]
checks=[]
for line in audit.splitlines():
    if line.startswith('|') and not line.startswith('|---') and not line.startswith('|Skill requirement'):
        key,value=line.strip('|').split('|',1)
        state='UNVERIFIED ON HARDWARE' if key.startswith('Fast everywhere') else 'N/A' if key.startswith('Shell/') else 'REVIEWED'
        checks.append(f'{state} — {key}: {value}')
for i in range(701,720):
    path=root/f'web/lesson/l{i}.js';body=path.read_text(encoding='utf8');body=body[body.index('import '):]
    evidence=next(line.strip('|').split('|',1)[1] for line in doc.splitlines() if line.startswith(f'|{i} '))
    header='/* Student-view review, 2026-10-15. Book pp.182–217; full evidence: docs/COVERAGE_U7.md.\n'
    header+='Literal observations and times: '+evidence+'\n\n§1 review (these notes do not replace the rendered checks):\n'
    header+='\n'.join('- '+item for item in checks)+'\n*/\n'
    path.write_text(header+body,encoding='utf8')
print('Written review evidence in all 19 Chapter 7 lesson headers.')
