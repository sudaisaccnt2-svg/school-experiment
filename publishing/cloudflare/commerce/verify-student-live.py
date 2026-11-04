"""Open approved student registration and verify a temporary account; clean up only that account."""
import json,os,re,subprocess,time,uuid
from pathlib import Path
from playwright.sync_api import sync_playwright
here=Path(__file__).resolve().parent
target=json.loads((here.parent/'account-target.json').read_text(encoding='utf-8'))
credentials=json.loads((here.parent/'private-migration/owner-login.json').read_text(encoding='utf-8'))
base=credentials['url'].removesuffix('/owner-sign-in')
assert credentials['email']==target['ownerEmail']=='sudaisaccnt3@gmail.com' and base=='https://asawera-chemistry-51y.pages.dev'
name='live_check_'+uuid.uuid4().hex[:12];password='Temporary private test '+uuid.uuid4().hex;new_password='Replacement private test '+uuid.uuid4().hex
student_id=None
def clean_student():
    if student_id is None:return
    assert re.fullmatch(r'student:[a-f0-9-]{36}',student_id) and re.fullmatch(r'live_check_[a-f0-9]{12}',name)
    node=Path(os.environ.get('ProgramFiles','C:/Program Files'))/'nodejs/node.exe'
    cli=here.parent/'.npm-cache/_npx/c943b712072b77c4/node_modules/wrangler/bin/wrangler.js'
    env=dict(os.environ,CLOUDFLARE_ACCOUNT_ID=target['accountID'])
    def command(args):
        result=subprocess.run([str(node),str(cli),*args],cwd=here.parent,env=env,capture_output=True,encoding='utf-8',errors='replace')
        if result.returncode:raise RuntimeError('Temporary test-account cleanup failed; private output withheld.')
        return result.stdout
    identity=json.loads(command(['whoami','--json']));assert identity['email']==target['ownerEmail'] and target['accountID'] in [a['id'] for a in identity['accounts']]
    common=['d1','execute','asawera-membership','--remote','--profile',target['authProfile']]
    rows=json.loads(command([*common,'--command',f"SELECT user_id FROM student_credentials WHERE username='{name}';",'--json']))[0]['results']
    assert len(rows)==1 and rows[0]['user_id']==student_id
    statements='\n'.join(f"DELETE FROM {table} WHERE {key}='{student_id}';" for table,key in [('student_sessions','user_id'),('account_controls','user_id'),('memberships','user_id'),('student_credentials','user_id'),('accounts','id')])
    path=here.parent/'private-migration'/f'cleanup-student-check-{name}.sql';path.write_text(statements,encoding='utf-8')
    command([*common,'--file',str(path)])
    remaining=json.loads(command([*common,'--command',f"SELECT COUNT(*) AS n FROM accounts WHERE id='{student_id}';",'--json']))[0]['results'][0]['n'];assert remaining==0
try:
  with sync_playwright() as p:
    browser=p.chromium.launch(channel='chrome',headless=True);owner=browser.new_context();student=browser.new_context();headers={'Origin':base}
    health=owner.request.get(base+'/api/health').json();assert health['accountsReady'] and health['studentAuthMode']=='username'
    login=owner.request.post(base+'/api/owner-password-login',headers=headers,data={'email':credentials['email'],'password':credentials['password']});assert login.status==200,login.status
    before=owner.request.get(base+'/api/admin/overview').json();website={**before['website'],'registrationsOpen':True}
    result=owner.request.post(base+'/api/admin/website',headers=headers,data=website);assert result.status==200,result.status
    assert owner.request.get(base+'/api/admin/overview').json()['settings']==before['settings'],'Payment and advertising settings changed unexpectedly.'
    created=student.request.post(base+'/api/signup',headers=headers,data={'username':name,'password':password});assert created.status==200,created.status
    recovery=created.json()['recoveryCode']
    state=student.request.get(base+'/api/session').json();student_id=state['user']['id'];assert state['user']['email']==name and not state['membership']['pro'] and not state['membership']['owner']
    assert student.request.get(base+'/api/admin/overview').status==403
    private=student.request.get(base+'/control-room',max_redirects=0);assert private.status==302
    room=owner.request.get(base+'/control-room');assert room.status==200 and 'Student username or email' in room.text()
    page=student.new_page();errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
    page.goto(base+'/account',wait_until='load');page.wait_for_selector('#signedIn:not([hidden])');assert page.locator('#identity').inner_text()==name
    granted=owner.request.post(base+'/api/admin/membership',headers=headers,data={'email':name,'action':'grant','days':1,'note':'Temporary deployment verification; account removed after check'});assert granted.status==200
    assert student.request.get(base+'/api/session').json()['membership']['pro']
    reset=student.request.post(base+'/api/student-recover',headers=headers,data={'username':name,'recoveryCode':recovery,'password':new_password});assert reset.status==200,reset.status
    assert reset.json()['recoveryCode']!=recovery and student.request.get(base+'/api/session').json()['membership']['pro']
    assert student.request.post(base+'/api/logout',headers=headers,data={}).status==200
    assert student.request.get(base+'/api/session').json()['user'] is None
    assert student.request.post(base+'/api/login',headers=headers,data={'username':name,'password':new_password}).status==200
    page.reload(wait_until='load');page.wait_for_selector('#signedIn:not([hidden])');assert 'Pro' in page.locator('#status').inner_text();assert not errors,errors
    assert student.request.post(base+'/api/logout',headers=headers,data={}).status==200
    assert owner.request.get(base+'/api/admin/overview').json()['settings']==before['settings']
    owner.request.post(base+'/api/logout',headers=headers,data={});browser.close()
finally:
  clean_student()
result={'url':base,'owner':target['ownerEmail'],'studentAuthMode':'username','registrationsOpen':True,'signupLoginLogoutRecoveryVerified':True,'studentCannotAccessControlRoom':True,'ownerProGrantVerified':True,'accountPageVerified':True,'temporaryTestAccountDeleted':True,'paymentAndAdvertisingSettingsPreserved':True,'realPaymentOrdersCreated':0,'recordedAtUTC':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
(here/'student-auth-live-verification.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print('Live student signup, login, recovery, logout, owner controls and Pro verified. Registration is open. Temporary test account removed; payment and ad settings preserved.')
