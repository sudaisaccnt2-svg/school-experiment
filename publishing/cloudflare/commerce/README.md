## Account deletion and Google Play code - 14 October 2026

Student account deletion is published in `df3ccbf099ae`, including the external `/delete-account` page. Current password and explicit confirmation protect erasure; an unauthenticated suspended student can delete with valid credentials. Sign-in/recovery data, all sessions, school notes, Pro membership and unpaid orders are erased atomically. Paid references and used-code/purchase anti-replay history retain an unrelated deleted-account ID. Owner accounts cannot use this student erasure path. Temporary production verification account was deleted.

Native Android 1.0.1 includes Google Play Billing 9.1.0, current-price checkout, restore and subscription management. Server verification uses the Android Publisher API, exact HMAC account binding, the two owned product IDs, Google's entitlement states and expiry, server acknowledgement, encrypted tokens and authenticated Pub/Sub pushes. Manual website Pro remains independent of Google subscription expiry/refunds. A stale unavailable purchase check fails closed. Live Play purchases remain gated: no developer account/products/service-account connection has been created.

54 backend/security checks, desktop/mobile deletion/recovery checks, 8 website offline checks, 6 Android unit checks, 3 Android offline/native startup checks and live deletion/private-controls checks passed. All 302 protected lesson binaries from tested `101d9dbd8213` are unchanged. Do not rotate `CODE_PEPPER` as an unrelated publishing change: it protects existing authentication, codes, Play account bindings and encrypted receipts. No fees, real purchases, ad requests or provider approvals were fabricated.

The store package and six extra-provider onboarding drafts are local, not submitted. Google payment profile and two-step requirement are complete; Google account/site/app reviews and Play developer registration/identity/testing remain pending. Student receiving instructions remain for the owner to enter. The website's full monetization is not live.

## Current production result - 14 October 2026

Student signup, login, recovery, logout, owner student controls and Pro grants are live and verified on account3. Registration is open. The 40 backend tests, desktop/mobile signup and recovery checks, offline lesson checks and production checks passed. The temporary production test account was removed.

The real AdSense display slot is `4894305770`. Android banner/interstitial units and two paused Pakistan bidding groups are saved in AdMob; its default network lists 407 authorised buyers. The six website Prebid adapters are available, with zero approved partner accounts. Neither paid serving nor student checkout is enabled. Google now confirms that payment details have been submitted; account verification is pending. Money setup still needs receiving wallet or bank instructions for student purchases, provider approval, and Android store approval. Google Play account3 has passed its two-step verification requirement; developer registration, identity verification, store preparation and required testing are pending. Automatic merchant checkout is not implemented or connected.

The business change shipped in `9076c60be928`, preserving every model, AR scene, lighting and renderer binary from the lesson agent's tested `4ca21fa74b3c` snapshot. The lesson agent subsequently published `848251edcae9`; its business screens match the verified business implementation and the live signup settings remain open. Publishing rejects stale business screens paired with newer backend code.

# Accounts, Pro, Pakistan payments and the control room

The owner is **sudaisaccnt3@gmail.com**. `../account-target.json` pins the verified account3 deployment.
Live dashboard: [asawera-chemistry-51y.pages.dev/control-room](https://asawera-chemistry-51y.pages.dev/control-room).
Owner sign-in uses a separate website password with a salted PBKDF2 verifier stored in Cloudflare secrets;
the provisioned password has 256 bits of random entropy. Owner sessions are opaque, hashed in D1, expire after
eight hours and are revoked on logout or password-verifier rotation. Cookies are Secure, HttpOnly, host-only and
SameSite=Strict. The owner always has ad-free Pro. Anonymous and forged requests cannot receive private HTML.
The private login file is local to this computer, restricted to the Windows user, and excluded from publishing.
The live owner-login, private API, dashboard tabs, mobile layout, logout and zero owner ad requests were verified.

The previous account2 production and preview sites remain available but are no longer the publishing destination.
The latest lesson release `9c8e5a417237` was preserved byte for byte while adding owner login.
The account3 D1 schema, owner identity and code-hash secret are configured for production.
Student registration is **live** with website-managed usernames, passwords and recovery codes. Live ads and customer purchases are still disabled while payment details and provider approvals are incomplete.
`status.json` records the ready features and remaining external setup. Security, UI, offline regression and
actual preview/database checks passed on 2026-10-13.

This is an isolated publishing overlay. It does not edit the other agent's lesson files. Use the last published
snapshot as the input while that agent is working:

```powershell
python publishing/cloudflare/prepare.py --from-release publishing/cloudflare/releases/773b4cf736d7
```

## What is implemented

- **Pricing & discounts**: editable Pro tiers with names, descriptions, durations, PKR prices and availability.
  Each grants ad-free Pro for its configured duration. Scheduled automatic sales and promo codes support percent
  or fixed discounts, start/end dates, minimum standard prices, eligible tiers, total uses and per-student limits.
  The best eligible offer applies without stacking. Completely free Pro is issued with the existing access codes.
  Coupons are owner-only data; public pricing contains available tiers and current sale prices.
- A 24-hour order freezes its tier name, duration, base price and actual discount. A timely payment report keeps
  that quote while the owner verifies funds. Coupon slots reserve atomically at order creation, become used on
  verified approval, and release on rejection, unpaid cancellation or unpaid expiry. A price change between
  preview and order creation requires reviewing the new price; customer-supplied amounts never set the price.
- Existing monthly/yearly settings remain compatible until the owner saves the new tier catalogue. The pricing
  migration backs up the account3 database and adds fields without deleting orders or changing payment availability.

- `/account`: username/password signup and sign-in, one-time recovery codes, password changes, account status, Pro codes and purchase history. Passwords require at least 15 characters. Student identities cannot claim owner access.
- `/control-room` and `/control-room.html`: server-protected private HTML, not public/offline assets. Anonymous
  visitors and students are redirected to `/owner-sign-in`; every admin API separately verifies owner identity.
  The business dashboard includes searchable students and classes, account suspension/reactivation, private notes,
  Pro grants/revocations, prices, payment instructions, payment review, one-use/revocable codes, public notices,
  support contact, registration controls, paginated CSV exports, and an owner audit history.
- Owner sign-in supports Cloudflare Access with RS256 signature verification against the configured issuer,
  audience, expiry, and the exact owner email. A caller-supplied email header is never accepted as authentication.
  Access's signed cookie also authenticates the same-origin API outside edge-protected paths.
- Website-managed student identities live in D1. Native WebCrypto uses salted PBKDF2-SHA256 at the Workers-supported 100,000 iterations, followed by a domain-separated server-secret HMAC. Plain passwords and recovery codes are never stored. Sessions are opaque, hashed, Secure/HttpOnly/SameSite=Strict, expire after 30 days and are revoked on logout; recovery and password changes revoke older sessions and recovery codes. An optional legacy Supabase adapter remains available for already-issued verified-email sessions.
- Your verified `OWNER_EMAIL` account always has ad-free Pro. A browser flag cannot upgrade a customer.
- Suspension disables account operations and Pro on every API request, including already-issued sessions.
  It does not revoke public lessons downloaded offline. Student lesson progress is not tracked; last seen is
  online account activity. No account deletion, refund automation, lesson editing, or source deployment is offered.
- D1 stores the settings, memberships, orders and hashed access codes. Code redemption and payment fulfillment
  are atomic; a second request cannot extend Pro twice. Codes have 128 bits of randomness and are hashed with a
  server-only pepper.
- Manual Pakistan payments: Easypaisa, JazzCash, or Raast/bank transfer. The server quotes PKR prices; the customer
  reports a transaction reference. Pro activates only when the owner checks actual receipt and approves the
  exact order amount. Duplicate confirmed references are rejected. These are prepaid 30/365-day periods,
  not recurring bank debits.
- Ads load only for non-Pro visitors after a successful membership check, an enabled approved publisher/slot,
  an eligible location and the visitor's opt-in. No ad code is fetched for Pro, offline sessions, unknown
  membership status or denied opt-in. Placements are on home and existing lesson end cards, not during lessons.
- `/ads.txt` derives the public seller entry from owner settings; no secret keys are exposed there.

## Advertising auctions

The private Ads & payouts tab supports AdSense, Google Ad Manager and a six-provider Prebid auction.
Google retains control of its advertiser/unified auctions and external Open Bidding relationships.
The Prebid display mode supports PubMatic, Magnite/Rubicon, Index Exchange, OpenX, Sovrn and Microsoft/Xandr.
Each connection stores public account/placement IDs and seller entries, with owner confirmation of site and
restricted-audience approval. No provider credentials or arbitrary executable ad tags are accepted.

Prebid 11.41.0 is pinned, bundled locally from the official npm package, and loaded only for an eligible free
visitor after provider-specific opt-in and a viewable home or lesson-end placement. It is excluded from the
service-worker manifest and all offline downloads. Auctions run on the visitor device, collect actual bids,
compare positive net USD banner CPMs and render the highest eligible unexpired matching-size bid. No simulated
production bids, revenue counters, timed refresh, or arbitrary endpoint configuration exist. Timeouts (500?3000
ms) and separate home/lesson USD floors are owner-editable. At least two approved providers are required per
enabled placement. A missing/expired bid, library failure or timeout collapses the placement.

The display-only bundle includes six adapters and the static price-floor module. Prebid device access, user
syncing, user IDs and shared transaction IDs are disabled. School requests conservatively set COPPA restrictions
for both configured school audience options; each bidder must explicitly approve that inventory. Google's
current TFAT child/teen configuration remains separate. Child-directed Google traffic does not use Open Bidding.

The owner remains ad-free Pro. A labelled local placement preview allows checking layout without a paid
impression. The diagnostics panel distinguishes missing IDs, unconfirmed approval, disabled serving, provider
readiness and owner Pro. Provider approval and payout verification remain external requirements. The actual account3 AdSense publisher and responsive display unit are connected. Ownership was verified and site review was requested. Google payment-profile completion and provider approval remain pending; no live revenue is claimed.

Rebuild the ad bundle with `node commerce/auction-build/build.mjs` after installing the pinned dependencies in
that isolated build directory. `auction-build-verification.json` records package version, modules and SHA-256.
`check-provider-auction.py` uses the actual Prebid core with local bidder adapters; it never contacts paid demand.
`check-ad-editor.py` verifies persisted owner settings against a local database and makes no production changes.

## Setup still required

Student sign-in, ads and payments must not be represented as active before these are connected:

Owner password login is already active and does not need Zero Trust billing. The following is optional if the
owner later chooses Cloudflare Access as an additional identity connection:

1. [Protect the Pages preview](https://developers.cloudflare.com/pages/configuration/preview-deployments/):
   Workers & Pages → `asawera-chemistry` → Settings → General → Enable access policy. This protects previews,
   not the public production website. Restrict the policy to the owner's verified email; no Everyone rule.
2. Set `CF_ACCESS_TEAM_DOMAIN` (e.g. `your-team.cloudflareaccess.com`) and `CF_ACCESS_AUD` (the application's
   64-character Audience tag) in the preview environment. `OWNER_EMAIL` is already configured privately.
   These two Access identifiers are public configuration, not passwords. The policy must enforce identity
   verification; one-time PIN is an option. Keep session durations appropriate for a business dashboard.
3. Configure the production application's Access paths `/control-room` and `/control-room.html` when promoting
   the release. Do not put the entire public lesson site behind an owner-only policy. Server checks also protect
   direct deployment URLs which aren't covered by the edge policy. Authentication on the real service still
   needs an owner sign-in test; local signature tests alone are not a completed Cloudflare Access setup.

Student sign-in and monetization are separate connections:

1. A Supabase project URL and **publishable key** for sign-in. The default auth email sender only sends to project
   team members, so configure [custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp) before public signup.
   Set its Site URL to `https://asawera-chemistry-51y.pages.dev` and permit `/account` redirects including recovery
   query parameters. Keep email confirmation on. Owner sign-in may instead use the Access connection above.
2. Cloudflare D1 binding `DB`, with `schema.sql` applied. Set `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `OWNER_EMAIL`
   and a random server-only `CODE_PEPPER` in Pages environment settings. Never place secrets under `commerce/public`.
3. Actual Pro prices and the receiving wallet/bank's payment instructions, chosen by the owner. Purchases default
   to disabled with no prices. Verify transfers through the receiving payment account, not submitted screenshots.
4. AdSense account, publisher ID, ad slot and site approval. Ads default to disabled. This initial integration
   serves only visitors whose Cloudflare country is Pakistan; other locations are skipped until the appropriate
   certified consent setup is added. Age treatment defaults to child restricted and can be set to teen restricted.
   This uses Google's [age-restricted ad-request fields](https://support.google.com/adsense/answer/3248194?hl=en).
   Bank details for ad payouts are entered in [Google AdSense Payments](https://support.google.com/adsense/answer/1714397?hl=en),
   not this database. The dashboard's publisher/slot IDs connect the website to that account; saving them does
   not grant Google approval. The displayed approval flag is explicitly the owner's confirmation, not an API
   check of Google approval or earnings. AdSense account ownership and settlement stay with Google.

Current student registration uses the website-managed username service; no Supabase project or SMTP sender is required for it. Supabase setup below applies only if an external verified-email sign-in option is added later.

## Automatic payment gateway

This release implements **owner-verified transfers and access codes**, not automatic gateway checkout or webhooks.
Automated payment needs an approved Pakistan merchant account and its actual integration credentials. Provider
documentation and the available payment methods must be checked for that merchant before selecting an adapter;
Safepay and PayFast are not treated as interchangeable. A browser redirect, screenshot or unsignatured webhook must
never mark an order paid. Gateway fees are separate from free website hosting.

## Hosting and quotas

Keep static paths on Pages and invoke Functions only for `/api/*`, `/ads.txt`, and the two private owner page paths
(`_routes.json`). Static asset
delivery stays on the free CDN. Functions and D1 have [separate usage limits](https://developers.cloudflare.com/pages/functions/pricing/).
Supabase currently includes [50,000 monthly active auth users](https://supabase.com/pricing), not 50,000 simultaneous
users or an unlimited production email sender. Do not promise that all account and payment workloads are free.

## Tests

```powershell
& 'C:/Program Files/nodejs/node.exe' publishing/cloudflare/commerce/test-api.mjs
python publishing/cloudflare/commerce/check-ui.py --report publishing/cloudflare/releases/773b4cf736d7.json
python publishing/cloudflare/check.py --report publishing/cloudflare/releases/773b4cf736d7.json
python publishing/cloudflare/verify_live.py https://asawera-chemistry-51y.pages.dev --report publishing/cloudflare/releases/773b4cf736d7.json
```

The API tests use real SQLite transactions with an injected auth-provider test fixture; they do not fake a Pro flag.
The UI tests abort ad-network requests, so no actual test impressions are sent to Google. Real auth confirmation,
SMTP delivery, merchant settlement and provider approval still require the connected services.
