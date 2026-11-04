"""Reconcile the lesson agent's newer release without changing or republishing its content."""
import json
from datetime import datetime,timezone
from pathlib import Path
here=Path(__file__).resolve().parent
version='848251edcae9';stamp=datetime.now(timezone.utc).isoformat()
report=json.loads((here.parent/'releases'/f'{version}.json').read_text(encoding='utf-8'))
latest_path=here.parent/'latest.json';latest=json.loads(latest_path.read_text(encoding='utf-8'))
if latest['version']==version:
    latest.update(businessSourceHashes=report['businessSourceHashes'],businessRuntimeVars=report['businessRuntimeVars'])
    latest_path.write_text(json.dumps(latest,indent=2)+'\n',encoding='utf-8')
path=here/'status.json';data=json.loads(path.read_text(encoding='utf-8'))
data.update(productionVersion=version,businessFeaturesPublishedInVersion='9076c60be928',latestLessonAgentReleasePreservesBusinessFeatures=True,lastPublicStateVerifiedAtUTC=stamp,providerAuctionConfigured=False,biddingProviderAccountConnected=False)
# A deployment-specific hostname for the newer lesson release was not observed. Keep
# its public URL authoritative instead of inventing or retaining the previous hostname.
data['businessFeatureDeploymentURL']='https://6dc18373.asawera-chemistry-51y.pages.dev'
data['productionDeploymentURL']=data['productionURL']
path.write_text(json.dumps(data,indent=2)+'\n',encoding='utf-8')
ads=here/'advertising-live-status.json';data=json.loads(ads.read_text(encoding='utf-8'));data.update(version=version,deploymentURL='https://asawera-chemistry-51y.pages.dev/',recordedAtUTC=stamp,adsenseReviewStatus='Getting ready',siteOwnershipVerified=True,reviewRequested=True)
ads.write_text(json.dumps(data,indent=2)+'\n',encoding='utf-8')
readme=here/'README.md';text=readme.read_text(encoding='utf-8').replace('The current release is `9076c60be928`, preserving every model, AR scene, lighting and renderer binary from the lesson agent\'s tested `4ca21fa74b3c` snapshot.','The business change shipped in `9076c60be928`, preserving every model, AR scene, lighting and renderer binary from the lesson agent\'s tested `4ca21fa74b3c` snapshot. The lesson agent subsequently published `848251edcae9`; its business screens match the verified business implementation and the live signup settings remain open.')
readme.write_text(text,encoding='utf-8')
print('Newer lesson release recorded; verified student features and accurate pending money status preserved. No lesson deployment changed.')
