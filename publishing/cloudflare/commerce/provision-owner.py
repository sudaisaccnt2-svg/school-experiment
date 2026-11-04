"""Provision the single website owner; never print a password or read Cloudflare credentials."""
import argparse,base64,hashlib,json,os,secrets,subprocess
from pathlib import Path
HERE=Path(__file__).resolve().parent.parent
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--rotate',action='store_true')
options=parser.parse_args()
target=json.loads((HERE/'account-target.json').read_text(encoding='utf-8'))
private=HERE/'private-migration';private.mkdir(exist_ok=True)
credentials=private/'owner-login.json'
if credentials.exists() and not options.rotate:raise SystemExit('Owner already provisioned; explicit --rotate is required.')
node=Path(os.environ.get('ProgramFiles','C:/Program Files'))/'nodejs/node.exe'
cli=HERE/'.npm-cache/_npx/c943b712072b77c4/node_modules/wrangler/bin/wrangler.js'
env=dict(os.environ,CLOUDFLARE_ACCOUNT_ID=target['accountID'])
identity=subprocess.run([str(node),str(cli),'whoami','--json'],cwd=HERE,env=env,capture_output=True,encoding='utf-8',errors='replace',check=True)
identity=json.loads(identity.stdout)
if identity.get('email','').lower()!=target['ownerEmail'] or target['accountID'] not in [a['id'] for a in identity.get('accounts',[])]:raise SystemExit('Owner/account identity does not match approved account3.')
password=secrets.token_urlsafe(32);salt=secrets.token_bytes(32)
enc=lambda value:base64.urlsafe_b64encode(value).decode().rstrip('=')
verifier='pbkdf2-sha256.100000.'+enc(salt)+'.'+enc(hashlib.pbkdf2_hmac('sha256',password.encode(),salt,100000))
result=subprocess.run([str(node),str(cli),'pages','secret','put','OWNER_PASSWORD_HASH','--project-name',target['projectName'],'--profile',target['authProfile']],input=verifier+'\n',cwd=HERE,env=env,capture_output=True,encoding='utf-8',errors='replace')
if result.returncode:raise SystemExit('Cloudflare did not accept the private owner verifier; no password file was created.')
url='https://asawera-chemistry-51y.pages.dev/owner-sign-in'
credentials.write_text(json.dumps({'email':target['ownerEmail'],'password':password,'url':url},indent=2)+'\n',encoding='utf-8')
instructions=private/'PRIVATE-OWNER-LOGIN.txt'
instructions.write_text('PRIVATE WEBSITE OWNER LOGIN\n\nWebsite: '+url+'\nOwner email: '+target['ownerEmail']+'\nWebsite owner password: '+password+'\n\nKeep this file private. The owner account includes ad-free Pro.\nThis password belongs only to your website. Your Cloudflare and Google passwords remain unchanged.\n',encoding='utf-8')
print('Owner configured for '+target['ownerEmail']+'. Private login saved locally; password was not printed or published.')
