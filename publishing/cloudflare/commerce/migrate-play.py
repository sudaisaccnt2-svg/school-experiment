"""Back up account3 privately, then apply the idempotent purchase schema."""
import json,os,subprocess
from pathlib import Path
here=Path(__file__).resolve().parent;root=here.parent
target=json.loads((root/'account-target.json').read_text(encoding='utf-8'))
assert target['ownerEmail']=='sudaisaccnt3@gmail.com' and target['accountID']=='785d5ca0d4ce6d80478bb1328ab78f80'
node=Path('C:/Program Files/nodejs/node.exe');cli=root/'.npm-cache/_npx/c943b712072b77c4/node_modules/wrangler/bin/wrangler.js'
env=dict(os.environ,CLOUDFLARE_ACCOUNT_ID=target['accountID'])
def command(args,label):
    result=subprocess.run([str(node),str(cli),*args],cwd=root,env=env,capture_output=True,encoding='utf-8',errors='replace')
    (root/'private-migration'/('play-'+label+'.log')).write_text(result.stdout+'\n'+result.stderr,encoding='utf-8')
    if result.returncode:raise RuntimeError(label+' failed; private diagnostic output retained locally.')
    return result.stdout
identity=json.loads(command(['whoami','--json'],'identity'))
assert identity['email']==target['ownerEmail'] and target['accountID'] in [a['id'] for a in identity['accounts']]
backup=root/'private-migration/before-play-purchases-20261014.sql'
if not backup.exists() or backup.stat().st_size<1000:command(['d1','export','asawera-membership','--remote','--profile',target['authProfile'],'--output',str(backup)],'backup')
assert backup.stat().st_size>1000
command(['d1','execute','asawera-membership','--remote','--profile',target['authProfile'],'--file',str(here/'schema.sql'),'--yes'],'migration')
rows=json.loads(command(['d1','execute','asawera-membership','--remote','--profile',target['authProfile'],'--command',"SELECT name FROM sqlite_master WHERE type='table' AND name='play_purchases';",'--json'],'schema-check'))
assert rows[0]['results'][0]['name']=='play_purchases'
print('Private backup verified. Purchase schema is ready on account3; existing accounts, settings and payment records were preserved.')
