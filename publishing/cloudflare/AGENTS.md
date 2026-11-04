# Publishing and business website

- The owner is sudaisaccnt3@gmail.com, account 785d5ca0d4ce6d80478bb1328ab78f80. Never publish this project to account2.
- The live website is https://asawera-chemistry-51y.pages.dev/. Project name and hostname differ; read account-target.json.
- Publish tested, pinned snapshots with publish.ps1. Its working directory compiles the Functions backend and preserves the account3 D1 binding. A direct deployment from the workspace root can omit that backend.
- The publish guard checks that the snapshot's business screens match the current backend. Rebuild an older lesson snapshot with prepare.py --from-release and retest it instead of publishing stale account screens. Use --no-latest while preparing isolated business changes alongside the lesson agent.
- Live student accounts use STUDENT_AUTH_MODE="username" and the existing CODE_PEPPER secret. Preserve both while publishing lesson changes; do not replace student sign-in configuration as part of artwork work.
- Keep lesson artwork and shared web/ files owned by the other lesson agent. Publishing overlays belong here.
- Never print, publish, or copy the private-migration credentials into a release. Do not read Cloudflare's raw authentication files; let Wrangler manage its authorized login.
- Owner password provisioning generates a separate random website credential and stores only its verifier in Cloudflare. A credential rotation requires explicit --rotate, then a production redeployment; it revokes prior owner sessions.
- Pricing controls must support editable Pro tiers, scheduled sales and scoped/limited promo codes. Preserve existing quoted order amounts and durations; never trust a customer's supplied discount or price. Keep coupon codes in owner-only API responses.
