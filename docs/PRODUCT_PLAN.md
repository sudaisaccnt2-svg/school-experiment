# Product plan: hosting, accounts, licence, payments, ads, energy (updated 2026-10-11)
Decisions (user): **no game engine**, stay with the three.js web app (same look on website, phones, computers).
**Website is free** (with ads + energy) so new students can try it; paying removes limits. Store apps (iPhone/iPad,
Android) are thin shells around the same website code and **depend on the website server** for the licence.
Students in Pakistan. Ads: rewarded + between lessons. Nothing below is built yet; 🔑 = an account only you can open.

## 1. The balance: free website vs paid
| | Free (website or app) | Paid |
|---|---|---|
| Lessons | all lessons watchable, 5 energy a day (1 per lesson) | unlimited |
| Inside a lesson | play/pause only | scrub, skip, orbit freely, AR |
| Games | first level of each game | all levels + arcade sessions |
| Ads | rewarded (+1 energy) and one between lessons | none |
| Offline | lessons you opened are cached (streamed) | download all lessons for offline |
Free visitors no longer download the whole app: they stream each lesson (1–4 MB). Only paid users get "Download
everything for offline" (≈260 MB today, ≈130 MB without AR).

## 2. Hosting for thousands of users, free
- **Cloudflare Pages** 🔑 for app files: free, unlimited bandwidth. Largest lesson file is now 3.8 MB (was 21.6 MB).
- **Supabase** 🔑 free tier: accounts, purchases, devices (≈50,000 monthly users).
- **Cloudflare Worker**: licence server (100,000 requests a day free).
- **Cloudflare R2**: paid lesson packs (10 GB free, no download fees).

## 3. Licence: the app depends on the website server
Nothing that runs on a student's phone is truly unhackable; this makes copying hard and useless.
1. **Free content is public; paid content is encrypted.** Paid packs (full navigation data, game levels, offline
   bundle) are stored in R2 encrypted per user; they cannot be used without a key from our server.
2. **Login → signed licence token** from the Worker: account, device ID, plan, expiry, server time. The app checks the
   signature (works offline), and keys for paid packs only come with a valid token.
3. **Re-check** when the app opens and every ~15 min at a random second while online. Token valid **7 days offline**,
   then one online check. Change the clock → token still uses server time.
4. **Max 2 devices** per account; a third logs the oldest out. Shared accounts get noticed (too many devices/cities).
5. **Store apps** are a thin shell that loads the same code and asks the same server; store purchases are verified by
   the server with Apple/Google (receipt check) before a token is issued; a fake "paid" switch inside the app does nothing.
6. Watermark with the student's name on lessons (faint, moving), so leaked recordings are traceable.

## 4. Purchases in Pakistan (what students actually use)
- **Website:** one gateway 🔑 that takes **JazzCash, Easypaisa and debit cards**: **Safepay** or **PayFast**
  (both need a registered business + bank account; JazzCash/Easypaisa direct merchant accounts need the same).
  Flow: student taps Buy → pays in JazzCash/Easypaisa/card → gateway tells our server → server marks the account paid
  → token updates within seconds.
- **Access codes (easiest start, no gateway needed):** sell printed or digital codes through schools/bookshops or
  your own JazzCash/Easypaisa number; the student types the code once → paid. Schools can buy codes for a class.
- **Android app:** Google Play Billing (Google keeps 15 %); in Pakistan it supports **Jazz/Zong/Telenor carrier
  billing** and cards. **iPhone app:** Apple in-app purchase (15 %), cards only.
- One account works everywhere: bought on the website → works in the apps (allowed when the same plan is also sold
  inside the app).
- Suggested prices (your call): Rs 299 a month, Rs 1,999 a year, school code packs cheaper per student.

## 5. Ads process (free users)
1. 🔑 Open **Google AdSense** (website) and **Google AdMob** (apps) with the business details; add the website domain
   and the app IDs; set content as education, audience **13+** (non-personalized ads for under-16s where required).
2. **Website:** AdSense first (simple). When traffic grows (≈50k+ visits a month) move to **Google Ad Manager +
   Prebid.js header bidding** so many ad buyers bid and the highest price wins.
3. **Apps:** **AdMob bidding** (or **AppLovin MAX**) with networks such as Meta, Unity Ads and AppLovin bidding
   together for every slot.
4. Placements only: **rewarded** "+1 energy" button (best paying, by choice), and **one interstitial after a finished
   lesson**, at most once every 5 minutes. Never during a lesson or a game.
5. Paid accounts: the server token says "paid" → no ad code loads at all.

## 6. Screen capture
- Website: browsers can't block recording → watermark (above).
- iPhone/iPad app: screenshots allowed; recording is detected → lesson blanks after a few seconds.
- Android app: FLAG_SECURE blocks screenshots and recording together on lesson screens.

## 7. Control room (user idea, 2026-10-11)
A private page only for the owner: prices, payment methods on/off, create/track access codes, free limits
(energy, free game levels), ads on/off + frequency, students/paid/devices. Needs the Supabase + Worker server.

## 8. Build order (after the visual pilot, lesson 803, is approved)
1. Streaming for free visitors + "download all" for paid · 2. accounts + licence token (Supabase + Worker) ·
3. energy + free/paid limits · 4. access codes, then gateway · 5. ads on the website · 6. Capacitor apps + store
billing + AdMob + recording protection · 7. Cloudflare Pages launch.
