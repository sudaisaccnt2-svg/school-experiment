"""Prepare original store copy, disclosures and graphics from the existing app icon."""
import base64,json,struct
from datetime import datetime,timezone
from pathlib import Path
from xml.etree import ElementTree
from playwright.sync_api import sync_playwright
app=Path(__file__).resolve().parents[1];folder=app/'store-submission';folder.mkdir(exist_ok=True)
description='''Explore chemistry in a portable 3D lab.

Asawera Chemistry includes 110 lessons, interactive 3D models and practice games. The lesson library is bundled with the app so you can keep studying without Wi-Fi after installation.

LEARN IN 3D
Explore atoms, particles, reactions and other chemistry topics through the existing lesson animations and interactive scenes. Search the library or browse its chapters.

NATIVE CAMERA AR
On an ARCore-supported Android phone, place the included models on a table or floor using the camera. Google Play Services for AR and the device's AR setup must be installed first and can require an initial internet connection. Native camera AR depends on device support; the ordinary 3D lessons work independently.

PRACTICE OFFLINE
Use the bundled practice games and revisit lessons at your own pace. Downloaded lesson content stays on your phone.

OPTIONAL STUDENT ACCOUNTS
Create a student username and password when connected. Save the recovery code shown during signup so you can recover your account without email. Account deletion is available through the account screen and the website.

AD-FREE PRO
Optional Pro removes advertising when advertising is enabled. Google Play subscription prices, billing periods and renewal terms are shown in the app and at Google Play checkout. Manage or cancel Google Play subscriptions in Google Play. Account management and purchases require an internet connection.

Requires Android 8 or newer and a supported 64-bit ARM device. Camera AR additionally requires an ARCore-supported phone. Camera access is used for AR; camera images are not uploaded by Asawera.
'''
listing={'appName':'Asawera Chemistry','shortDescription':'Explore chemistry in 3D with offline lessons, practice games and native AR.','fullDescription':description,'category':'EDUCATION','supportEmail':'sudaisaccnt3@gmail.com','website':'https://asawera-chemistry-51y.pages.dev/','privacyURL':'https://asawera-chemistry-51y.pages.dev/privacy','deletionURL':'https://asawera-chemistry-51y.pages.dev/delete-account','packageName':'com.asawera.chemistry','version':'1.0.1','versionCode':2,'containsAds':True,'adsCurrentlyServing':False,'inAppPurchasesImplemented':True,'inAppPurchasesConnected':False,'submissionStatus':'Prepared locally; developer registration, product setup, testing and Google review remain pending'}
assert len(listing['appName'])<=30 and len(listing['shortDescription'])<=80 and len(description)<=4000
(folder/'listing-en.json').write_text(json.dumps(listing,indent=2)+'\n',encoding='utf-8')
(folder/'short-description.txt').write_text(listing['shortDescription']+'\n',encoding='utf-8');(folder/'full-description.txt').write_text(description,encoding='utf-8')
products=[{'productId':'asawera_pro_monthly','basePlanId':'monthly','billingPeriod':'P1M','title':'Monthly ad-free Pro'},{'productId':'asawera_pro_yearly','basePlanId':'yearly','billingPeriod':'P1Y','title':'Yearly ad-free Pro'}]
with sync_playwright() as p:
    client=p.request.new_context();prices=client.get('https://asawera-chemistry-51y.pages.dev/api/pricing').json();client.dispose()
    for product,tier_id in zip(products,['monthly','yearly']):
        tier=next((t for t in prices.get('tiers',[]) if t.get('id')==tier_id),None)
        product.update({'proposedCurrency':'PKR','proposedBasePricePaisa':tier.get('baseAmountPaisa') if tier else None,'actualPlayPrice':'Not configured; Google Play owns checkout prices','autoRenewing':True,'createdInGooglePlay':False})
    browser=p.chromium.launch(channel='chrome',headless=True);page=browser.new_page(viewport={'width':1024,'height':500},device_scale_factor=1)
    icon=ElementTree.parse(app/'app/src/main/res/drawable/ic_atom.xml').getroot();ns='{http://schemas.android.com/apk/res/android}'
    paths=[{key:node.get(ns+key) for key in ['pathData','fillColor','strokeColor','strokeWidth']} for node in icon]
    page.set_content('<canvas id="icon" width="512" height="512"></canvas>')
    url=page.evaluate('''paths=>{const canvas=document.getElementById('icon'),ctx=canvas.getContext('2d');ctx.scale(512/108,512/108);for(const p of paths){const path=new Path2D(p.pathData);if(p.fillColor && p.fillColor!=='#00000000'){ctx.fillStyle=p.fillColor;ctx.fill(path)}if(p.strokeColor){ctx.strokeStyle=p.strokeColor;ctx.lineWidth=Number(p.strokeWidth);ctx.stroke(path)}}return canvas.toDataURL('image/png')}''',paths)
    png=base64.b64decode(url.split(',')[1]);assert struct.unpack('>II',png[16:24])==(512,512);assert len(png)<1024*1024
    (folder/'app-icon-512.png').write_bytes(png)
    svg=''.join('<path d="'+p['pathData']+'" fill="'+('none' if p['fillColor']=='#00000000' else p['fillColor'] or 'none')+'"'+((' stroke="'+p['strokeColor']+'" stroke-width="'+p['strokeWidth']+'"') if p['strokeColor'] else '')+'/>' for p in paths)
    html='''<!doctype html><html><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;width:1024px;height:500px;overflow:hidden;background:#0c1019;color:#f0f4fa;font-family:Arial,sans-serif}.frame{height:500px;display:flex;align-items:center;padding:62px;gap:50px;background:radial-gradient(circle at 86% 30%,#253950 0,transparent 55%)}.copy{width:600px}.brand{font-size:18px;letter-spacing:5px;color:#f2c46d;font-weight:bold}h1{font-size:59px;line-height:1.08;margin:25px 0 22px;letter-spacing:-2px}p{font-size:23px;line-height:1.5;margin:0;color:#becadd}.tag{margin-top:26px;color:#f2c46d;font-size:17px;letter-spacing:1px}svg{width:245px;flex-shrink:0}</style><div class="frame"><div class="copy"><div class="brand">ASAWERA CHEMISTRY</div><h1>Chemistry you<br>can explore.</h1><p>110 lessons. Interactive 3D.<br>Saved on your phone.</p><div class="tag">NATIVE AR ON COMPATIBLE PHONES</div></div><svg viewBox="0 0 108 108">'''+svg+'</svg></div></html>'
    page.set_content(html);page.screenshot(path=str(folder/'feature-graphic-1024x500.png'));(folder/'feature-graphic-source.html').write_text(html,encoding='utf-8');browser.close()
(folder/'play-product-drafts.json').write_text(json.dumps(products,indent=2)+'\n',encoding='utf-8')
data={'draft':True,'encryptedInTransit':True,'accountCreation':'Username and password; optional for public offline lessons','accountDeletion':listing['deletionURL'],'dataTypes':[{'type':'Personal info / User IDs','collected':True,'optional':True,'purpose':['Account management','App functionality'],'details':'Student username and an opaque Google Play account binding; password and recovery verifiers remain on the private server.'},{'type':'Personal info / Name','collected':True,'optional':True,'purpose':['Account management'],'details':'School owner can optionally record a student name and class; these are deleted with the profile.'},{'type':'Financial info / Purchase history','collected':True,'optional':True,'purpose':['App functionality','Fraud prevention'],'details':'Pro expiry and transaction/purchase references; paid records are anonymised on account deletion.'},{'type':'Approximate location','collected':True,'shared':True,'optional':True,'purpose':['Advertising','Fraud prevention'],'details':'Ad SDK may derive location from IP during eligible ad requests; no precise-location permission is requested.'},{'type':'App activity / App interactions','collected':True,'shared':True,'optional':True,'purpose':['Advertising','Analytics','Fraud prevention'],'details':'Ad interactions when advertising is enabled; lesson-by-lesson progress is not tracked by Asawera.'},{'type':'App info and performance / Diagnostics','collected':True,'shared':True,'optional':True,'purpose':['Analytics','Fraud prevention'],'details':'Google Mobile Ads SDK diagnostics during advertising.'},{'type':'Device or other IDs','collected':True,'shared':True,'optional':True,'purpose':['Advertising','Fraud prevention'],'details':'Advertising-ID permission is removed, but the Google SDK can use other identifiers.'}],'camera':'Local AR processing; camera images are not uploaded by app code','sdkSource':'https://developers.google.com/admob/android/privacy/play-data-disclosure','needsFinalConsoleReview':True,'liveAdRequestsDuringChecks':0}
(folder/'data-safety-draft.json').write_text(json.dumps(data,indent=2)+'\n',encoding='utf-8')
(folder/'release-notes.txt').write_text('1.0.1\nStudent account deletion in the app and on the website. Native Google Play Pro checkout, restore purchases and subscription management. Website bank-transfer checkout is excluded from the Play account view. Server verifies purchase ownership and expiry. Offline lesson and AR assets are preserved. Paid serving and live purchases remain pending Google account/store setup.\n',encoding='utf-8')
(folder/'submission-steps.txt').write_text('''Prepared for sudaisaccnt3@gmail.com / account3.
1. Complete the Google Play developer registration, US$25 registration fee and identity/device checks. No registration fee has been charged by this work.
2. Create com.asawera.chemistry, enable Play App Signing, upload the verified 1.0.1 AAB and use listing-en.json, graphics and native screenshots here.
3. Complete Data safety, privacy/deletion URLs, ads and content-rating declarations using the audited app behavior. The disclosure file is a draft for console review, not a submitted declaration.
4. Create the monthly/yearly subscription products in play-product-drafts.json and activate their base plans and regional prices. Website coupons do not change Play checkout prices.
5. Grant an Android Publisher service account purchase/subscription permissions. Store its JSON only in the Cloudflare PLAY_SERVICE_ACCOUNT secret; never in the APK or this folder. Enable PLAY_BILLING_ENABLED=true only after products and verification are connected.
6. Connect authenticated Pub/Sub real-time developer notifications to https://asawera-chemistry-51y.pages.dev/api/play/notifications. Set PLAY_RTDN_AUDIENCE to that exact URL and PLAY_RTDN_SERVICE_EMAIL to the authorised push service account. Google signed identity and current Google purchase state are checked on every notification.
7. Configure license testers and perform real sandbox purchase, acknowledgement, cancellation, renewal, refund and restore checks. Current automated purchase checks use a mock Google service; no real charges were made.
8. Run the required closed test with 12 real opted-in testers for 14 consecutive days for a new personal account, then apply for production access and publish when accepted.
9. Link the published store listing in AdMob and wait for account/app approval. Then enable native ad serving and eligible mediation groups. Website AdSense has its own pending site review.
10. Physical camera placement needs a compatible Android phone; emulator native AR startup is checked but does not establish physical tracking quality.
''',encoding='utf-8')
(folder/'package-status.json').write_text(json.dumps({'preparedAtUTC':datetime.now(timezone.utc).isoformat(),'titleAndDescriptionLimitsVerified':True,'iconDimensions':[512,512],'iconPngColorType':png[25],'featureGraphicDimensions':[1024,500],'nativeScreenshotsPending':True,'consoleSubmissionPending':True,'productsCreated':False,'liveBillingVerified':False},indent=2)+'\n',encoding='utf-8')
print('Prepared store copy, native-icon graphics, disclosure draft, product drafts and submission package. No console submission or real billing connection is claimed.')
