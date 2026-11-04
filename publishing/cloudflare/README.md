# Publish Chemistry 3D on a permanent free website

Live website: **[asawera-chemistry-51y.pages.dev](https://asawera-chemistry-51y.pages.dev/)**.
Owner: **sudaisaccnt3@gmail.com**, account `785d5ca0d4ce6d80478bb1328ab78f80`.
The account3 website, D1 business database and private owner login are live and verified. The previous account2
site remains available for existing visitors and downloaded lessons; it is no longer the publishing destination.
`account-target.json` pins the account, actual URL and separate `asawera-owner3` login. `deployment.json` records
the published snapshot. The project is named `asawera-chemistry`; Cloudflare assigned the public hostname above.

Private business dashboard: `/control-room`. A separate random website owner password was provisioned without
reading the owner's Google/Cloudflare password. Private local login files are excluded from Git and publishing,
and restricted to the current Windows user. Live security checks verify owner-only access, ad-free Pro and logout.

This folder owns only publishing files and isolated release snapshots. The other agent can keep editing `web/`,
Blender files and the chapter scripts. Neither `prepare.py` nor `check.py` writes to those files. Do not run
`scripts/rebuild_ipad.py` or `scripts/build_pwa.py` as part of this publishing workflow: those change the shared app.
The release is a point-in-time copy; regenerate it after the other agent finishes a lesson to include that lesson's
latest changes. A snapshot can detect files changing while it copies; it cannot judge whether unfinished art is ready.

## What is prepared

- A purely static Cloudflare Pages site. The visitor's phone renders the 3D scenes and runs the games.
- A permanent HTTPS `your-project.pages.dev` address. The computer and tunnel can be switched off after publishing.
- The small app is saved first; models, lighting and AR are fetched and saved when their lesson is opened.
- **Save all offline** explicitly downloads the whole library. **✓ all saved offline** appears only when every
  required file is present. A failed download can resume. The existing classroom app keeps its original behavior.
- Cloudflare's extensionless page routes are supported offline, including `/home`, `/games` and `/lesson/`.
- Only website assets are packaged: local server code, certificates, private keys and the local setup page are excluded.

The prepared release contains around 305 MB, 110 films and 452 files; the initial saved app is around 3.4 MB.
The generated `latest.json` has the exact figures for the current snapshot. A lesson downloads only its own resources;
some code lessons have several baked models and lighting files, so their download can be larger than one GLB.

## Publish

The Cloudflare account belongs to you. The first release has been published through the locally authorized Wrangler
tool. You do not need to send a password or token in this chat. The steps below are for a new project or manual updates.

1. Sign in to [Cloudflare](https://dash.cloudflare.com/) or create a free account.
2. Open **Workers & Pages**, choose **Create application**, then the **Pages / upload assets** option.
3. Choose a project name, for example `asawera-chemistry` if available.
4. Upload the ZIP named in this folder's `latest.json`, or drag in its `releaseDirectory`.
5. Deploy and open the permanent `pages.dev` address.

Cloudflare [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) supports a folder
or ZIP in the dashboard. Its dashboard limit is 1,000 files; Wrangler supports 20,000. Both have a 25 MiB per-file limit.
The snapshot is checked against those limits. Publish the snapshot, not the whole project folder.

If you prefer the command line, from the project root:

```powershell
python publishing/cloudflare/prepare.py
python publishing/cloudflare/check.py
& .\publishing\cloudflare\publish.ps1 -ProjectName asawera-chemistry -Login -CreateProject
```

For this published site, omit `-CreateProject`. Use it only when creating a different project for the first time;
use `-Login` only when authentication is needed. The helper creates Pages projects directly rather than migrating
this prepared release to Workers.
The helper publishes only a snapshot whose browser tests passed. If the snapshot changes, regenerate and test it.
For dashboard updates, use **Create a new deployment** on the same project. Keep the same project name and URL so
installed phones can receive updates. A custom domain is optional and domain registration usually costs money.

## Capacity and cost

Cloudflare currently documents [free, unlimited static requests](https://developers.cloudflare.com/pages/functions/pricing/)
and [unlimited Pages bandwidth](https://www.cloudflare.com/developer-platform/products/pages/).
That is why this architecture is a reasonable fit for 50,000 visitors without a paid rendering server. CDN servers
still deliver the bytes; rendering on a phone does not remove bandwidth. This is a hosting architecture, not a measured
guarantee of 50,000 simultaneous users, and a free plan's future terms can change.

For scale: 50,000 fresh downloads of a 3.4 MB app are about 170 GB, plus selected lessons. If every person explicitly
saves a 305 MB library, delivery is about 15.3 TB. On-demand loading avoids downloading that library for a visitor who
only opens one chapter. These are arithmetic estimates, not usage measurements.

The lesson files are static. The account and private business dashboard now use Pages Functions and D1, which have
separate request quotas; a request limit is not a user limit. Student authentication, AdSense approval,
prices, and payment instructions still need their external setup. See [commerce/README.md](commerce/README.md).

## Verification

`check.py` launches an isolated Chrome profile and a localhost server that mimics Pages HTML redirects. It checks:

- home opens without downloading models, AR or lighting;
- an opened 3D film and its local AR handoff work after the network is disabled;
- canonical home, games and nested lesson routes work offline;
- unopened lessons do not falsely claim to be saved;
- Save all recovers from an interrupted download and every saved file matches its published SHA-256 hash;
- a code update preserves downloaded models without another full-library download.

Native AR camera placement is not simulated by Chrome. After deployment, test Safari on the actual iPad/iPhone,
then use Airplane Mode to reopen an opened lesson, and test the whole library after **✓ all saved offline**.
The lesson artwork and gameplay are snapshots of the other agent's work and are not changed by these hosting tests.

## Ads later

No real ads or purchases are enabled until the owner connects and configures them. AdSense placement and Pro controls
are implemented in the private dashboard. Bidding can be added after the public site is established,
without moving the 3D rendering to a server. Higher bids depend on demand, audience and ad placement; user count alone
does not guarantee a high rate. Live ad auctions need a connection. Third-party ad requests are not included in the
offline asset catalog and will not be saved as lessons. Provider approval and actual payout setup remain external.

## Business dashboard deployments

Use Wrangler from this publishing folder so it includes `functions/` and the D1 binding. A static-only ZIP upload
does not deploy the dashboard API. `publish.ps1` now selects the publishing directory itself and can pin a tested
snapshot with `-ReleaseVersion`, avoiding another agent's concurrent changes to `latest.json`. Its database-backed
configuration must stay with the matching project. Create a separate configuration before deploying another project.

```powershell
./publishing/cloudflare/publish.ps1 -ProjectName asawera-chemistry -ReleaseVersion 773b4cf736d7
```
