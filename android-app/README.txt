Asawera Chemistry Android 1.0.1

Signed production APK: dist/asawera-chemistry-1.0.1.apk
Signed Play bundle: dist/asawera-chemistry-1.0.1.aab
Public download: https://asawera-chemistry-android.pages.dev/
Store submission assets and copy: store-submission/

This release adds native Google Play Pro checkout, restore and subscription management. The private server verifies Google product, account binding, state, expiry and acknowledgement. Purchase tokens are encrypted; authenticated Google refund/renewal notifications refresh entitlement. Live purchases are still closed until developer registration, product setup and the private Android Publisher connection are complete. Tests use mock Google receipts; no real purchase was charged.

Account deletion is live in Account and at https://asawera-chemistry-51y.pages.dev/delete-account. Password confirmation, session revocation and school/profile deletion were verified. Paid records lose the website username and school profile while accounting and fraud references remain. Google subscriptions must be cancelled separately.

110 lessons, 137 original model files and 113 native AR models remain bundled from tested source c85d85d213c1. The current website artwork is newer; app lesson updates require another app release. 54 backend/security checks, 6 Android unit checks and 3 current offline/native startup tests passed. Physical camera placement is not verified. AR requires an ARCore-compatible phone and initially configured Google Play Services for AR. Plain offline 3D lessons work separately.

Real AdMob app/banner/interstitial IDs are connected. Account verification, supported store listing and app approval remain pending. Paid ads are off. Owners, Pro accounts, offline visits and unavailable membership checks receive no ads. Two Google bidding groups are configured but paused; extra partners are unapproved. Income is not guaranteed.

The connected phone originally had a debug-signed app. Its matching test build was updated to 1.0.1 without clearing data. The production download uses the private production signing key, so it cannot replace the debug-signed installation directly. Phone launch/playback was not verified because the app was not foreground. No phone camera, network or account settings were changed.

Keep private-signing/, private-testing/, owner login files and service-account keys private. No private business credentials are packaged in public APK assets.
