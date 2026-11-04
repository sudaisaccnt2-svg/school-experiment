"""Add student identity tables to account3 without changing prices, orders or memberships."""
import hashlib,json,os,subprocess
from datetime import datetime,timezone
from pathlib import Path
here=Path(__file__).resolve().parent.parent
target=json.loads((here/'account-target.json').read_text(encoding='utf-8'))
assert target['ownerEmail']=='sudaisaccnt3@gmail.com' and target['accountID']=='785d5ca0d4ce6d80478bb1328ab78f80'
node=Path(os.environ.get('ProgramFiles','C:/Program Files'))/'nodejs/node.exe'
cli=here/'.npm-cache/_npx/c943b712072b77c4/node_modules/wrangler/bin/wrangler.js'
env=dict(os.environ,CLOUDFLARE_ACCOUNT_ID=target['accountID'])
def command(args):
    result=subprocess.run([str(node),str(cli),*args],cwd=here,env=env,capture_output=True,encoding='utf-8',errors='replace')
    if result.returncode:raise SystemExit('Cloudflare operation failed; private command output was withheld.')
    return result.stdout
identity=json.loads(command(['whoami','--json']))
assert identity['email']==target['ownerEmail'] and target['accountID'] in [entry['id'] for entry in identity['accounts']]
common=['--remote','--profile',target['authProfile']]
def inspect():
    data=json.loads(command(['d1','execute','asawera-membership',*common,'--command',"SELECT (SELECT COUNT(*) FROM accounts) AS accounts,(SELECT COUNT(*) FROM orders) AS orders,(SELECT COUNT(*) FROM memberships) AS memberships,(SELECT value FROM settings WHERE id='public') AS commerce,(SELECT value FROM settings WHERE id='pricing') AS pricing;",'--json']))
    return data[0]['results'][0]
before=inspect()
private=here/'private-migration';private.mkdir(exist_ok=True)
stamp=datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')
backup=private/f'before-student-auth-{stamp}.sql'
command(['d1','export','asawera-membership',*common,'--output',str(backup)])
command(['d1','execute','asawera-membership',*common,'--file',str(here/'commerce/schema.sql')])
after=inspect();assert before==after,'Business records changed during migration; leave serving disabled and review.'
result={'owner':target['ownerEmail'],'accountID':target['accountID'],'databaseID':target['databaseID'],'studentTablesCreated':True,'existingAccountsOrdersMembershipsAndPricingPreserved':True,'backupFile':str(backup),'completedAtUTC':datetime.now(timezone.utc).isoformat()}
(here/'commerce/student-auth-migration.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print('Account3 database backed up. Student identity tables added; existing accounts, orders, memberships and pricing preserved.')
