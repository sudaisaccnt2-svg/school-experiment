# Asawera school project: Grade IX Chemistry in 3D (Unit 2 "Structure of an Atom", Unit 3 "Periodic Table")

These are animated 3D explainers of textbook pages, built in **Blender 4.5** and delivered as an **offline iPad web app**
(three.js PWA plus AR Quick Look USDZ). The user is an artist or teacher, not a coder. Keep the wording simple.

**Skill (always loaded, imported below):** the user's taste + the lesson pipeline. Follow §0 first. Whenever the user
corrects something, fix the rule in it AND add a Refinement-log line, in the same turn.

@.claude/skills/asawera-chapter/SKILL.md

**Read next, only as needed:** `docs/STATUS.md` (what is done and what is next: always read it), `docs/STORYBOARD.md`
(content per film; read only your film's section), `docs/NOTES.md` (book errors and science notes),
`IPAD_APP_GUIDE.md` (for the user), and `Rutherford_Experiment_Blender_Report.md` (science and render background for film 01).

## Requirements from the user
- Explain every page in book order. Scope: p.44 (Downloads\IMG_9900) through p.62 (Downloads\New folder (4)\IMG_9919).
  Nothing beyond 9919. Page-to-photo map: `docs/STORYBOARD.md`.
- Use the same quality and style as the Rutherford film: dark studio, glowing blue electrons, red protons and grey
  neutrons, gold titles, white labels with drop shadows, labels pop in one at a time, slow camera drift to the right.
- The exercise (MCQs, short and long questions) must be answered *and* explained visually.
- Must keep working offline on iPad. Keep these docs short; another AI must be able to continue cheaply.

## Files
- `2 school experiment.blend`: **the working file** (open in Blender; `school experiment.blend` is older).
  Scene `Scene` = film 01, Rutherford (acts at camera markers). Every other scene is one topic film (02–14).
  Backups are in `backups/`.
- `scripts/`: film 01 build steps `01_setup.py`..`10_holds.py` (the scene is already built; **never re-run 01_setup**,
  because it wipes the file). Exports: `export_web.py`, `export_ar.py`, `bake_lighting.py`, `rebuild_ipad.py`, `build_pwa.py`.
- `scripts/p2/`: Part 2 builders. `lib.py` holds the shared helpers; `defects.py` is film 01 act 5; `f02_bohr.py` ..
  `f14_long.py` are one per film; `export_topics.py` exports the GLB, JSON and USDZ for each topic scene.
- `scripts/u3/`: Unit 3 (Periodic Table, pp. 66–90, films 301–313). Build: `python scripts/bsend.py scripts/common.py
  scripts/p2/lib.py scripts/u3/u3lib.py scripts/u3/f3NN_*.py`. Book photos: `assets/book_u3/`. Storyboard:
  `docs/STORYBOARD_U3.md`. In u3 builders never name a global `P` (u3lib's tile pitch).
- `scripts/u4/`: Unit 4 (Structure of Molecules, pp. 92–120, films 401–415). Build: append `scripts/u4/u4lib.py`
  after u3lib.py. Book photos: `assets/book_u4/`. Storyboard: `docs/STORYBOARD_U4.md`. Never name a global `N`, `C`
  (lib functions), `P` or `T`.
- `scripts/u5/`: Unit 5 (Physical States of Matter, pp. 122–151, films 501–515). Build: append `scripts/u5/u5lib.py`
  after u4lib.py. Book photos: `assets/book_u5/`. Storyboard: `docs/STORYBOARD_U5.md`. Also never name a global `win`.
- `scripts/u6/`: Unit 6 (Solutions, pp. 152–181, films 601–617). Build: `sh scripts/u6/b6.sh scripts/u6/f6NN_*.py`
  (appends `scripts/u6/u6lib.py` after u5lib.py). Book photos: `assets/book_u6/`. Storyboard: `docs/STORYBOARD_U6.md`.
- `scripts/u7/`: Unit 7 (Electrochemistry, pp. 182–217, films 701–719). Build: `sh scripts/u7/b7.sh scripts/u7/f7NN_*.py`
  (appends `scripts/u7/u7lib.py` after u6lib.py). Book photos: `assets/book_u7/`. Storyboard: `docs/STORYBOARD_U7.md`.
- `web/`: the app. `films.json` lists the films; `films/<id>.json` holds per-film metadata; `models/*.glb`; `ar/*.usdz`.

## How to work
- Blender live: BlenderMCP socket on **localhost:9876**. `python scripts/bsend.py a.py b.py` concatenates the files and
  runs them in Blender. Part 2 builders are run as `python scripts/bsend.py scripts/p2/lib.py scripts/p2/fNN_*.py`.
  Each builder deletes and rebuilds its own scene (idempotent), then saves the .blend.
- Previews: `python scripts/p2/preview.py "<scene>" 120 480 900` renders EEVEE stills at 50 % from a snapshot into
  `renders/p2/`. Look at the stills before calling a film done.
- iPad build: `python scripts/rebuild_ipad.py` exports everything (film 01 bake + GLB + USDZ, all topics) and then runs
  `build_pwa.py`. After editing only web code, run `python scripts/build_pwa.py`. Test with `python scripts/test_offline.py`.
- Serve: `start_ipad_server.bat` (LAN) or `start_offline_link.bat` (https tunnel for installing).

## Conventions (break these and the web export breaks)
- 1 Blender unit = 10 cm. Topic scenes: subject near the origin; the camera looks along +Y; 30 fps, 1920×1080, EEVEE.
- Animate objects only (location, rotation, scale). Pop-in/out is done with scale keys. Curve bevel animation and
  material animation don't reach the web app.
- HUD text must be a direct child of a camera, with identity rotation and scale-only animation. World labels have no
  parent (they billboard in the app). A leader line is the curve named `<label> Line`.
- Text: use Unicode superscripts and subscripts (Bfont/Inter has them). Use ✓ ✗, but not ✔ ✘ ∝.
  Nuclide symbols use `lib.nuclide()`, which stacks A over Z.
- Book values are shown as printed (exam answers); corrections go to `docs/NOTES.md`.
