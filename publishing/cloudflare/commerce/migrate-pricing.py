"""Add pricing fields to the approved account3 database, preserving orders and business data."""
import json,os,subprocess
from datetime import datetime,timezone
from pathlib import Path
HERE=Path(__file__).resolve().parent.parent
target=json.loads((HERE/'account-target.json').read_text(encoding='utf-8'))
node=Path(os.environ.get('ProgramFiles','C:/Program Files'))/'nodejs/node.exe'
cli=HERE/'.npm-cache/_npx/c943b712072b77c4/node_modules/wrangler/bin/wrangler.js'
env=dict(os.environ,CLOUDFLARE_ACCOUNT_ID=target['accountID'])
def command(args):
    result=subprocess.run([str(node),str(cli),*args],cwd=HERE,env=env,capture_output=True,encoding='utf-8',errors='replace')
    if result.returncode:raise SystemExit('Cloudflare database operation failed; no private output was displayed.')
    return result.stdout
identity=json.loads(command(['whoami','--json']))
if identity.get('email','').lower()!=target['ownerEmail'] or target['accountID'] not in [a['id'] for a in identity.get('accounts',[])]:raise SystemExit('Migration must use the approved account3 owner.')
common=['--remote','--profile',target['authProfile']]
metadata=json.loads(command(['d1','execute','asawera-membership',*common,'--command','PRAGMA table_info(orders);','--json']))
columns={column['name'] for group in metadata for column in group['results']}
definitions={'plan_name':'TEXT','base_amount_paisa':'INTEGER','discount_paisa':'INTEGER NOT NULL DEFAULT 0','discount_label':"TEXT NOT NULL DEFAULT ''",'coupon_code':'TEXT','quote_expires_at':'INTEGER','cancelled_at':'INTEGER'}
missing=[name for name in definitions if name not in columns]
private=HERE/'private-migration';private.mkdir(exist_ok=True)
stamp=datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')
backup=private/f'before-pricing-{stamp}.sql'
command(['d1','export','asawera-membership',*common,'--output',str(backup)])
sql='\n'.join(f'ALTER TABLE orders ADD COLUMN {name} {definitions[name]};' for name in missing)+'\n'+(HERE/'commerce/schema.sql').read_text(encoding='utf-8')
migration=private/f'pricing-migration-{stamp}.sql';migration.write_text(sql,encoding='utf-8')
command(['d1','execute','asawera-membership',*common,'--file',str(migration)])
receipt={'accountID':target['accountID'],'databaseID':target['databaseID'],'backupFile':str(backup),'addedColumns':missing,'completedAtUTC':datetime.now(timezone.utc).isoformat(),'existingOrdersPreserved':True}
(HERE/'commerce/pricing-migration.json').write_text(json.dumps(receipt,indent=2)+'\n',encoding='utf-8')
print('Account3 database backed up. Pricing schema added without changing existing orders or payment settings.')
