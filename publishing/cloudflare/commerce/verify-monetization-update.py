"""Verify live deletion and private controls using one temporary account; never print credentials."""
import json,time,uuid
from pathlib import Path
from playwright.sync_api import sync_playwright
here=Path(__file__).resolve().parent;base='https://asawera-chemistry-51y.pages.dev'
credentials=json.loads((here.parent/'private-migration/owner-login.json').read_text(encoding='utf-8'))
assert credentials['email']=='sudaisaccnt3@gmail.com'
username='release_check_'+uuid.uuid4().hex[:10];password='Private temporary test '+uuid.uuid4().hex
with sync_playwright() as p:
    owner=p.request.new_context(base_url=base);student=p.request.new_context(base_url=base);headers={'Origin':base}
    assert owner.post('/api/owner-password-login',headers=headers,data={'email':credentials['email'],'password':credentials['password']}).status==200
    before=owner.get('/api/admin/overview').json();created=False
    try:
        health=student.get('/api/health').json();assert health['studentAuthMode']=='username' and health['accountsReady']
        response=student.post('/api/signup',headers=headers,data={'username':username,'password':password});assert response.status==200;created=True
        assert student.get('/api/admin/overview').status==403
        assert student.get('/api/play/config').json()['ready'] is False
        assert student.post('/api/play/verify',headers=headers,data={'purchaseToken':'no-real-purchase-made'}).status==503
        assert 'Delete your Asawera Chemistry account' in student.get('/delete-account').text()
        assert 'id="showDeleteAccount"' in student.get('/account?channel=google-play').text()
        room=owner.get('/control-room');assert room.status==200 and 'id="playBillingStatus"' in room.text()
        assert before['readiness']['playBilling'] is False
        deleted=student.post('/api/student-delete-account',headers=headers,data={'currentPassword':password,'confirmation':username,'confirmSubscription':True});assert deleted.status==200;created=False
        assert student.get('/api/session').json()['user'] is None
        assert student.post('/api/login',headers=headers,data={'username':username,'password':password}).status==401
        after=owner.get('/api/admin/overview').json();assert before['settings']==after['settings'] and before['website']==after['website'];assert before['metrics']==after['metrics']
        assert not any(username==row['email'] for row in owner.get('/api/admin/students').json()['students'])
    finally:
        if created:
            response=student.post('/api/student-delete-account',headers=headers,data={'username':username,'currentPassword':password,'confirmation':username,'confirmSubscription':True});assert response.status==200,'Temporary verification account needs cleanup.'
        owner.post('/api/logout',headers=headers,data={});owner.dispose();student.dispose()
result={'url':base,'accountDeletionLiveVerified':True,'temporaryVerificationAccountRemoved':True,'oldPasswordAndSessionRevoked':True,'privateDashboardVerified':True,'studentCannotAccessOwnerApi':True,'playVerificationRoutesPresent':True,'livePlayConnectionReady':False,'realPurchasesMade':0,'paymentAndAdSettingsPreserved':True,'checkedAtUTC':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
(here/'monetization-update-live-verification.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8');print(json.dumps(result,indent=2))
