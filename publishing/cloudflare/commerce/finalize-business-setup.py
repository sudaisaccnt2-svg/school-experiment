"""Record actual deployment and monetization state without claiming external approval."""
import hashlib,json,re
from datetime import datetime,timezone
from pathlib import Path
here=Path(__file__).resolve().parent;hosting=here.parent;root=hosting.parent.parent
version='9076c60be928';source_version='4ca21fa74b3c';stamp=datetime.now(timezone.utc).isoformat()
report_path=hosting/'releases'/f'{version}.json';report=json.loads(report_path.read_text(encoding='utf-8'))
source=hosting/'releases'/source_version;release=Path(report['releaseDirectory'])
protected=[p for p in source.rglob('*') if p.is_file() and p.suffix in {'.glb','.usdz','.hdr','.wasm','.bin','.ktx2'}]
for path in protected:
    target=release/path.relative_to(source)
    assert target.exists() and hashlib.sha256(path.read_bytes()).digest()==hashlib.sha256(target.read_bytes()).digest(),str(path.relative_to(source))
assert report['browserTests']=='passed'
assert json.loads((here/'student-auth-live-verification.json').read_text(encoding='utf-8'))['temporaryTestAccountDeleted']
report.update(published=True,deploymentURL='https://6dc18373.asawera-chemistry-51y.pages.dev',publicURL='https://asawera-chemistry-51y.pages.dev/',businessSourceLessonVersion=source_version,lessonAndArBinaryHashesPreserved=True,protectedLessonBinaryFiles=len(protected),studentAccountsVerifiedLive=True,studentRegistrationsOpen=True,publishedAtUTC=stamp)
report_path.write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
pointer=hosting/'latest.json';current=json.loads(pointer.read_text(encoding='utf-8'))
if current['version']==source_version:pointer.write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
groups={'owner':'sudaisaccnt3@gmail.com','publisherId':'pub-7035355195474246','appId':'ca-app-pub-7035355195474246~4152516857','country':'PK','groups':[{'id':'4315360138','name':'Asawera Android Home Bidding PK','format':'banner','adUnitId':'ca-app-pub-7035355195474246/9484734584','status':'paused'},{'id':'2729811021','name':'Asawera Android Lesson Bidding PK','format':'interstitial','adUnitId':'ca-app-pub-7035355195474246/9093852340','status':'paused'}],'googleAuthorizedBuyersObserved':407,'googleNetworkConfiguredForBidding':True,'additionalPartnershipsSubmitted':0,'paidServing':False,'savedAndVerifiedAtUTC':stamp,'waitingFor':['Legal payee name and mailing address','Payment profile verification','Supported store listing and app approval','Additional partner agreements and inventory approval']}
(root/'android-app/admob-mediation.json').write_text(json.dumps(groups,indent=2)+'\n',encoding='utf-8')
status_path=here/'status.json';status=json.loads(status_path.read_text(encoding='utf-8'))
status.update(productionVersion=version,productionDeploymentURL=report['deploymentURL'],productionLessonFilesPreserved=True,studentAuthenticationConnected=True,studentAuthenticationMode='username and password with recovery codes',studentRegistrationsOpen=True,adsActive=False,purchasesActive=False,advertisingMode='adsense',googleDisplayAdSlot='4894305770',androidMediationGroupsCreated=True,androidMediationGroupsPaused=True,androidAdditionalProviderPartnershipsActive=0,googlePlayDeveloperRegistrationBlockedByTwoStepVerification=True)
status['waitingFor']=['Legal payee name and full Pakistan mailing address for the Google payment profile and partner onboarding','Receiving wallet/account title and payment number or bank/IBAN instructions before student purchases can open','Google AdSense site approval','Supported Android store listing and AdMob app approval; Google Play currently requires account3 two-step verification','Approved bidding provider accounts and actual publisher/placement IDs; provider audience and traffic eligibility also apply','Approved Pakistan merchant account and actual credentials for automatic gateway checkout']
status['studentAccountChecks']={'backendAndSecurity':'40 passed','signupRecoveryPasswordChangeAndOwnerUi':'passed','liveProductionSignupRecoveryLogoutProAndOwnerProtection':'passed','temporaryTestAccountRemoved':True,'lessonOfflineRegression':'passed'}
status_path.write_text(json.dumps(status,indent=2)+'\n',encoding='utf-8')
ads_path=here/'advertising-live-status.json';ads=json.loads(ads_path.read_text(encoding='utf-8'))
ads.update(version=version,deploymentURL=report['deploymentURL'],controlRoomMode='adsense',displaySlot='4894305770',admobMediationGroupsSaved=2,admobGoogleAuthorizedBuyersObserved=407,additionalNativePartnershipsActive=0,providerAccountsApproved=0,liveAdsServing=False,recordedAtUTC=stamp)
ads_path.write_text(json.dumps(ads,indent=2)+'\n',encoding='utf-8')
readme=here/'README.md';text=readme.read_text(encoding='utf-8')
text=text.replace('Student registration, live ads and customer purchases are **not active** until their separate setup is complete.','Student registration is **live** with website-managed usernames, passwords and recovery codes. Live ads and customer purchases are still disabled while payment details and provider approvals are incomplete.')
text=text.replace('- `/account`: sign-in, verified-email signup, password reset, account status, Pro codes and purchase history.','- `/account`: username/password signup and sign-in, one-time recovery codes, password changes, account status, Pro codes and purchase history. Passwords require at least 15 characters. Student identities cannot claim owner access.')
text=text.replace('- Supabase verifies identities; session and refresh tokens are in Secure, HttpOnly, SameSite cookies. Passwords\n  are sent to the auth provider and are not stored in this application. Email confirmation is required.','- Website-managed student identities live in D1. Native WebCrypto uses salted PBKDF2-SHA256 at the Workers-supported 100,000 iterations, followed by a domain-separated server-secret HMAC. Plain passwords and recovery codes are never stored. Sessions are opaque, hashed, Secure/HttpOnly/SameSite=Strict, expire after 30 days and are revoked on logout; recovery and password changes revoke older sessions and recovery codes. An optional legacy Supabase adapter remains available for already-issued verified-email sessions.')
text=text.replace('The current\nGoogle account has no AdSense account; signup is prepared while the owner confirms adult eligibility and the\nPakistan payment country. Do not claim live revenue or activate fabricated publisher IDs.','The actual account3 AdSense publisher and responsive display unit are connected. Ownership was verified and site review was requested. Google payment-profile completion and provider approval remain pending; no live revenue is claimed.')
text=text.replace('The account/auth choice is prepared around Supabase pending the user\'s answer. It is not a completed signup service\nuntil a real auth project and production email sender are configured. No Supabase secret service-role key is needed\nfor this adapter.','Current student registration uses the website-managed username service; no Supabase project or SMTP sender is required for it. Supabase setup below applies only if an external verified-email sign-in option is added later.')
text='''## Current production result - 14 October 2026

Student signup, login, recovery, logout, owner student controls and Pro grants are live and verified on account3. Registration is open. The 40 backend tests, desktop/mobile signup and recovery checks, offline lesson checks and production checks passed. The temporary production test account was removed.

The real AdSense display slot is `4894305770`. Android banner/interstitial units and two paused Pakistan bidding groups are saved in AdMob; its default network lists 407 authorised buyers. The six website Prebid adapters are available, with zero approved partner accounts. Neither paid serving nor student checkout is enabled. Money setup still needs the legal payee/address, receiving wallet or bank instructions, provider approval, and Android store approval. Google Play account3 registration is currently blocked by its two-step verification requirement. Automatic merchant checkout is not implemented or connected.

The current release is `9076c60be928`, preserving every model, AR scene, lighting and renderer binary from the lesson agent's tested `4ca21fa74b3c` snapshot. Publishing rejects stale business screens paired with newer backend code.

'''+text
readme.write_text(text,encoding='utf-8')
android_readme=root/'android-app/README.txt';text=android_readme.read_text(encoding='utf-8')
text+='\nSTUDENT ACCOUNTS - 14 October 2026\nThe live website account screen now supports student usernames, 15-character passwords and recovery codes without email setup. The Android account WebView uses the same live screen and secure membership cookies. No APK rebuild is needed for this hosted account change. Two real Pakistan AdMob bidding groups are saved but paused; extra partner accounts, payment verification and a supported store listing remain pending. Google Play account3 registration currently requires two-step verification. Paid ads remain off.\n'
android_readme.write_text(text,encoding='utf-8')
print('Published business result recorded. All '+str(len(protected))+' protected lesson/AR binaries preserved. Student accounts are live; money setup remains accurately marked pending.')
