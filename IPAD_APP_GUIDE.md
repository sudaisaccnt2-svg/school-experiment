# Chemistry IX in 3D (Units 2, 3 and 4, all films + games): iPad app

Everything the app needs is in `web/`, including three.js, the films of all three units (12 + 13 + 15), the games, lighting, icons, and **all AR
scenes**. The app saves about **127 MB** on each device. **✓ offline** appears only when every required file is saved and the
offline app is active. Saving resumes after an interrupted connection; an incomplete update keeps the previous
working version.

## One link
1. On the PC, double-click **`start_ipad_server.bat`**. It prints a single address:

   ```
   http://192.168.100.198:8000
   ```
2. On the iPad (same Wi-Fi), open that address in **Safari**. It's the only link you need:
   - **First time on this iPad:** the page walks you through the one-time certificate setup: download, then
     *Settings › Profile Downloaded › Install*, then *Settings › General › About › Certificate Trust Settings*, switch on
     **Asawera Classroom CA**. Then tap **I've done it: open the app**.
     (Or tap **Just view it now** to use it straight away without the offline install.)
   - **Once set up:** the same link opens the app directly.
3. In the HTTPS app, wait for **✓ offline**, then **Share ⬆︎ › Add to Home Screen**. Open the new Home Screen icon
   **while still connected** and wait for **✓ offline** there too. Then it can reopen with **no Wi-Fi or internet**,
   and the PC can be off. Use the Home Screen icon offline: the initial HTTP certificate/setup page needs the PC.

**iPad on this PC's Mobile Hotspot?** Then the address is always `http://192.168.137.1:8000`. The server window shows
it automatically when the hotspot is on. A firewall rule "Rutherford 3D (PC hotspot)" lets hotspot devices reach
ports 8000/8443 only.

Only one server may run at a time; if you start it twice, the second window says so and closes.

## Using it
| Control | What it does |
|---|---|
| Topics menu | Tabs at the top: **Unit 2** (Structure of an Atom, 12 films), **Unit 3** (Periodic Table, 13 films, pp. 66–90) **Unit 4** (Structure of Molecules, 15 films, pp. 92–120) **Unit 5** (Physical States of Matter, 15 films, pp. 122–151) **Unit 6** (Solutions, 17 films, pp. 152–181) and **Unit 7** (Electrochemistry, 19 films, pp. 182–217). Films are in book order; the last entry opens that unit's games. |
| ⌂ Home | The first page: one card per chapter (Unit 2, 3, 4) with ▶ Films and 🎮 Games, plus ▶ Continue (the last film watched). |
| 🎮 Games | The exercise as games. The player chooses one: Quiz Quest (the MCQs, with 3D "why" demos), Atom Lab (build and fix atoms and isotopes), Energy Stairs (fill sub-shells in the right order), Neutron Counter (n = A − Z with marbles), Model Match (Rutherford or Bohr?), Light Jumps (make light with electron jumps: ΔE = hν), plus memory games: Particle Cards (Table 2.1), Shell Seats (K L M N O, 2n², s p d f), Aufbau Climb (filling order, 4s before 3d), Config Writer (write configurations), Isotope Twins (isotopes and heavy water), Isotope Jobs (uses of isotopes). Unit 3 tab: Quiz Quest, Element Finder (tap where an atom lives), Trend Duel (which atom is bigger / holds electrons tighter), Block Painter (paint s, p, d, f), Table Builder (symbols, places, periods, history), Family Names (halogens, noble gases …), Metal or Not, Trend Arrows (which way each trend goes). Unit 4 tab: Quiz Quest, Bond Builder (tap electrons to give or share until every shell is full), Bond Sorter (ionic, polar or non-polar?), Shape Lab (name the shape, then polar or not). Unit 5 tab: Quiz Quest, Gas Law Lab (a piston and a dial: where does it go?), State Sorter (solid, liquid or gas; crystal or amorphous), Why? Lab (small experiments for the short questions). Unit 6 tab: Quiz Quest, Molarity Lab (grams on a balance, a litre cube: find the molarity), Mixture Sorter (solution, colloid or suspension; pure or mixture), Solution Lab (small experiments for the short and long questions). Unit 7 tab: Quiz Quest, Oxidation Number Lab (find the missing number; + and − beads cancel to show the charge), Redox Detective (watch electrons hop: who is oxidized, who is reduced?), Cell Lab (small cells for the short and long questions). Stars are saved on the iPad. |
| ▶ / timeline | Play, pause, and drag to scrub. The gold ticks mark the acts. ½× / 1× / 2× sets speed. |
| Act buttons | Jump to an act of the current film. |
| The 3D view | Always follows the film's animated cameras. **One finger:** orbit around what the shot is looking at. **Two fingers:** pinch to zoom, drag to pan. The camera can't go under the bench or lose the subject, and it snaps back to the film framing at every camera cut. **↺ Film view** (or double-tap) returns immediately. |
| 📱 AR app | Opens the current scene in the iPad's native AR viewer (Apple AR Quick Look): it stands on your floor or table and you can walk around it. |

The small badge next to the scene name shows the offline state: **✓ offline** = the complete website and all AR files
are saved on this device; **saving …% — includes AR** = still downloading; **reconnect to finish saving** = files are
missing; **online only** = you opened the quick-view (`http`) version, which can't be saved on an iPad.

### AR without Wi-Fi

The AR button reads the current scene from the saved copy and passes a local USDZ file to Apple AR Quick Look.
It prepares all three scenes after installation and prepares them again whenever the app reopens. A scene that is
still preparing may say **AR ready — tap AR again**; tap again to open it. The final tap stays a direct user gesture.
This uses Apple's [documented blob URL and USDZ filename handoff](https://developer.apple.com/videos/play/wwdc2019/612/).

AR uses Safari / the Home Screen app on a compatible iPad or iPhone. Check the actual device once after installation:

1. Wait for **✓ offline** inside the Home Screen app.
2. Turn on **Airplane Mode** and make sure Wi-Fi is off. Close the app, then open its Home Screen icon again.
3. Play and scrub the film, orbit the view, and select every act.
4. Open AR in **The Experiment**, **Inside the Foil**, and **Planetary Model**. Place each scene on a table or floor,
   then return to the app.

Clearing Safari/app website data removes the saved copy. If the badge says files are missing, reconnect to save them.

### Getting it to work offline (easiest: the https link)
1. On the PC (with internet), double-click **`start_offline_link.bat`**. It starts the server and shows a line like
   `https://something.trycloudflare.com`. That link is public while the window is open, and it changes every time.
2. Open that link on the iPad in **Safari**. Wait until the badge next to the scene name shows **✓ offline** (a few
   minutes: it saves ~127 MB).
3. Tap **Share › Add to Home Screen**, then open the new icon once (still online) and wait for **✓ offline** again.
   The Home Screen app keeps its own copy.
4. Done: the icon now works with no Wi-Fi or internet. You can close the link window.

After changing the scene, run `rebuild_ipad.py`. The https link is different every time, and a Home Screen app installed
from an old link can never reach the new one, so it keeps the old version. **Delete the old Home Screen icon**, then do
steps 1–4 again.

## Rebuild after changing the Blender scene
```
python scripts/rebuild_ipad.py
```
This runs `export_web.py` (GLB), `export_ar.py` (USDZ), and `build_pwa.py` (offline cache version). Installed iPads
pick up the new version the next time they open the app while on the PC's Wi-Fi.

After changing only website code, run `python scripts/build_pwa.py`; the Blender exports do not need to run again.
Run `python scripts/test_offline.py` to test installation, reopening without a network, every file's contents,
the three local AR handoffs, missing-file recovery, and interrupted updates in Chrome. This test simulates Quick Look
support and does **not** verify the native AR camera viewer; use the iPad Airplane Mode checklist above for that.

## Files
- `web/index.html`, `app.js`, `style.css`: the viewer
- `web/offline.js`: offline setup, progress, and reconnect recovery
- `web/ar.js`: native AR links using the locally saved USDZ files
- `web/models/rutherford.glb`: film 01 scene and animation (about 23 MB); `web/models/NN.glb` and
  `web/films/NN.json`: films 02–12
- `web/games.html`, `web/games/*.js`: the five games (three.js only, offline)
- `web/ar/*.usdz`: AR Quick Look models
- `web/env.hdr`: lighting environment
- `web/sw.js`, `manifest.webmanifest`, `icons/`: offline web-app
- `scripts/sw-template.js`: source for the generated service worker
- `certs/`: private keys for the local HTTPS. **Don't share these.** `asawera-ca.*` are unused leftovers from a first
  attempt and can be deleted.
