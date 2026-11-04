# Status (update this file whenever a step finishes)

Legend: [x] done · [~] in progress · [ ] to do

## User direction (2026-10-08)
More visual, fun, kid-friendly films (less textbook text); realistic models; formulas shown as demos; the exercise as
interactive games the player chooses (build/fix 3D models); softer bloom; must stay an offline web app (a game engine
may come later). Style rules for films: see "v2 style" in docs/STORYBOARD.md.

## Film 01 Rutherford (scene `Scene`) + Act 5 Defects (p.44)
- [x] Electron Trails (web/games/cloud.js, unit 2, simplified 2026-10-09 after 'overwhelming' feedback): smooth Fig 2.8 shapes sized to fit inside rings K L M, ONE electron per shape with a short comet tail moving in calm laps (cloud3d.js laps()/Mover; never pops, never crosses the nucleus). Parts ?part=look|shell|shape: 🔭 Look (chips 1s…3d; tick K L M), 🏠 Which shell? 5 rounds (tap({shell:2})), 🔷 Which shape? 6 rounds (tail traces s/p/d; last = dumbbell nearly end-on). Old 4-part version: backups/cloud_trails_v2.js. Film 05 act 'Clouds' (30–82 s): Bohr laps → laps fill s ball → p laps → K/L/M sizes → 2s+2p (Python class Laps, trail_of curves).
- [x] Acts 1–5, iPad app, AR, offline; re-exported with act 5 (the app has no bloom, so the bloom change needs no export)

## Part 2 films (one Blender scene each): all built, v2, exported (2026-10-08)
- [x] Bloom softened in every scene (glare threshold 1.0, strength 0.35, size 0.6; lib._compositor matches)
- [x] lib: electron comet trails (bohr_atom, flat_atom), shape helpers (blob/cyl/box/dot/along/pulses/nsym/stations/
      flat_atom/text_width)
- [x] 02 Bohr: ramp vs stairs ("never in between"); rule 6a = spin demo (ball on a string + gold spin meter: heavier, faster, wider circle → bar ×2 ×4 ×8 → "spin = m × v × r", book name last; film now 145 s, `s()` in f02 shifts old times ≥ 77 s by SPIN_X); rule 6b = whole blocks, each stack has its shell ring above it, "1½ blocks" bounces in the gap, nh/2π only in the last caption; rule 4 drops drawn as arrows on the energy scale, then a 16 s equation part (EQ_X): E₂/E₁ = the two shells glow, ΔE = the drop arrow pulses, hν = slow red vs fast UV wave, then the full line; film now 161 s
- [x] 03 Particles: short cards (book values small); charges demo (attract / repel / neutron ignored); 1837 balance
- [x] 04 Shells: shells ripple out; 2n² seats + countable dot squares; Na builds 2, 8, 1
- [x] 05 Sub-shells: dot-cloud orbitals; orbital = box of 2; shells = floors, sub-shells = rooms → 2n²
- [x] 06 Aufbau: shelf opening (lowest first); K's 19th e⁻ refused by 3d, drops into 4s; diagonal chart
- [x] 07 First 18 (shorter Test Yourself answers) · [x] 10 Uses · [x] 11 Key points · [x] 12 MCQ film
- [x] 08 H isotopes: scales (A = p + n); 20,000 dots with 3 gold = 0.015 %; H₂O vs D₂O on a balance
- [x] 09 C/Cl/U: glass case of 100 marbles per element (C 99:1, Cl 76:24, U 99:1)
- Films 13/14 dropped: the exercise lives in the games (removed from films.py)
- [x] "One place moves at a time" pass (audit_focus.py): 02 electron waits during side demos, blocks after jumps,
      fixed a slow M→K slide (now a drop with light at 84.6 s); 03 electrons wait in the nucleus close-up; 05 only the
      newest orbital shape turns; 07/08/09/11 only the atom being explained moves; 08 rings + pulses one at a time,
      water still; 10 smoke story before the oil well, drum before the gauge; 12 pulses one at a time.
      Film 01 (Rutherford) not changed: the audit finds nothing there (check by eye if the user names a shot).
- [x] Exported: `python scripts/rebuild_ipad.py 02 03 04 05 06 07 08 09 10 11 12` (offline cache 126.5 MB)
- [x] 02 Bohr rebuilt with the v3 layout (STORYBOARD "v3 layout"), exported, checked in the app
- [x] v4 "show, don't tell" rebuild of Unit 2 films 04-12 (2026-10-09; helpers `scripts/v4lib.py`, old builders in
      `backups/*_v2.py`). One caption line per beat, only that beat's objects on screen, results shown physically:
      04 shells ripple, energy steps, seats fill, 2 × 3 × 3 squares, Na 2,8,1 · 05 laps → area → s p d f, capacity
      boxes, floors · 06 staircase, K's 19th electron · 07 one atom H→Ar, Table 2.4, Test Yourself · 08 neutrons fly
      into one H atom (P→D→T), scales, 3 gold in 20,000, H₂O/D₂O balance + Table 2.6 rows · 09 neutrons fly into C, Cl,
      U, then a case of 100 marbles each, symbol summary · 10 same models, one shot per use, paragraphs removed ·
      11 one close shot per key point, one line each · 12 card → 4 s → green answer → card leaves, the model shows why.
- [ ] v4 for film 02/03 and Unit 3 (Units 4–7 done 2026-10-10, see below)

## Games (web/games.html, web/games/*.js; three.js only, offline)
- [x] Hub (player chooses) + 6 games, stars saved in localStorage, linked from the film app (🎮 Games, Topics menu):
  Quiz Quest (MCQ i–x, 3D "why" demos) · Atom Lab (19 levels: build, isotopes, fix-it, who-am-I, 2n² seats) ·
  Energy Stairs (Aufbau, 8 elements; v2: one solid staircase in energy order, electrons hop up from a pad, too-high picks roll back down, "Show me" = 1 star; no side card: '↺ again' / '▶ show me' are tags by the pad; a Bohr atom (K L M N) behind fills as you place; rapid taps allowed (seat booked at the tap, several electrons fly at once); a mini periodic table (Z 1–20) lights each finished element, localStorage games.stairsBuilt). A full rewrite (try/game/quiz, flat shelf, who-am-I) was REJECTED by the user: keep this game, change only what is asked) · Neutron Counter (long Q iii, marbles: n = A − Z) · Model Match
  (Rutherford vs Bohr) · Light Jumps (ΔE = hν; 4 parts: 💡 explore = interactive prism bench (web/games/prism.js, Light Explorer badge, bottom strip = live screen) · shell colours follow the electron (user's rule): below it n = 1 grey-violet (UV), n = 2 = the visible colour of that fall (only bright ring), n = 3+ grey (a red tint read as 'makes red light'); above it grey; game target = a dashed slot in the spectrum strip (UV box pulses for UV rounds); no take-in rounds (a round/step only counts once light comes OUT); part tabs at the top; 4 visible H lines have pushed-apart colours (HCOL), UV/IR shells dim; no side card: goals in one slim line above the bottom strip (`kit.goalBar`; the 3D `kit.board()` was too distracting); Try opens with a demo jump; the next shell to tap breathes (no gold ring: too distracting), white/hydrogen switch is a tag on the lamp, quiz answers in `.qpanel2`; emission: the electron spirals down until its path points at the strip, then the light leaves straight ahead; the board shrinks to fit its text) · 🎨 Try teaches every move with a breathing-shell 'tap' hint (2 colours by falling, catch light = jump up, fall to n = 1 = UV); 🎮 game = 13 rounds in 3 stages, NO hints ever (user: the game must not instruct): warm-up, some shells grey, no colours; take-in rounds colour the shells ABOVE; one reward at the end · 🏆 quiz = 7 questions. Light = small wave with energy sparks; energy swirls into / out of the electron; the electron slows (never stops) while light travels)
- [x] Spin Blocks (web/games/spin.js, mvr = nh/2π, p.46): ball on a string + gold spin bar + live line m × v × r = …; TAP ball = m (1-3), DRAG ball = r (rings 1-3), STRETCH gold arrow = v (1-4). Parts like Light Jumps: 💡 explore (3 ticks) · 🎨 try (6 steps with breathing hint: m, v, r, reach 12, locked missing piece, Bohr electron to 2 blocks) · 🎮 game 11 rounds, no hints: reach the line (8, 18, 24) · missing piece (bar hidden, ✓ check tag, wrong = bar shows real value) · Bohr electron: r free, v = 1.2/√r so spin = √(r/0.4) blocks; release on a whole block (±0.13) = shell K/L/M appears, else it slides back · 🏆 quiz 8 tricky MCQs, each acted out after answering. Test hooks: _g.game.goRound(i), parkAt(r), change(k, x). Extra tabs (after Game): Twin (5 rounds, same spin as a green ghost ball but not a copy; ghost + 2nd bar), Quick (45 s: silver/same/green, which spins more, bars only revealed after answering, 30 % tricky equal pairs), Climb (Bohr electron hops L→M→L→K→M against a clock, stars by time and misses). main.js total = 7.
- [ ] User rule (2026-10-08): no side-panel text anywhere; goals go in a slim bottom goal bar (`kit.goalBar`), buttons next to
      what they do. Done in Light Jumps, Energy Stairs, Atom Lab and Neutron Counter (counter: no table; one atom at a time: the jar fills with A marbles, tap the jar → Z red protons hop to the dish, no maths: the jar (grey), dish (red) and electrons (blue) show live counts, then one question per atom (neutrons / protons / electrons / mass number) answered by tapping one of 3 number bubbles; fireworks, next atom by itself. Atom Lab: live A/Z symbol tag beside the atom, big goal line above the level dots, hints as toasts; no win pop-up: fireworks then the next level starts by itself; ↺ reset button in the tray; electrons have userData.pickFirst so a tap on one removes it (the fat ring tap-torus used to catch it); shared periodic table web/games/ptable.js, gold frame walks one tile per proton, finished elements stay lit, localStorage games.ptBuilt shared with Energy Stairs); still to do: Quiz Quest, Model Match
- [x] 2026-10-09 "memorize = game" set (shared frame web/games/rounds.js: part tabs, rounds easy → hard → timed,
      g.right/miss show WHY in 3D; tile(), arrow3d()): Particle Cards (particles.js, Table 2.1) · Shell Seats (seats.js,
      K–O, 2n², s p d f, Table 2.3) · Aufbau Climb (aufbau.js, 4s below 3d, diagonal rule) · Config Writer (configs.js,
      Table 2.4, film 07) · Isotope Twins (isotopes.js, Tables 2.5–2.9, heavy water) · Isotope Jobs (isouses.js, pp.57–58).
      Films 04 (v6 energy stadium: n, energy levels, glow = energy, Table 2.2 with 2n²) and 06 (diagonal chart) rebuilt.
- [x] App navigation (2026-10-09): orbit/zoom kept across cuts, wider pan, mouse pan; games bar ⌂ · Films · ← Games.
- Test: `python scripts/test_games.py "games.html?game=lab&level=5@@<js>"` → renders/games/sheet.jpg (headless Chrome)

## Unit 3 Periodic Table (pp. 66–90), separate chapter (2026-10-08)
- [x] Films 301–313 built (scripts/u3, u3lib.py; storyboard docs/STORYBOARD_U3.md), previews checked
- [x] App: films.py CHAPTERS + unit_of(); films.json has `chapters` + per-film `unit`; Topics menu has unit tabs;
      "Next" stays inside a unit; games link = games.html?unit=N
- [x] Games (unit 3 tab in the hub, main.js `unit` field): Quiz Quest (quiz3.js, uses quiz.js runQuiz) · Element
      Finder (finder.js) · Trend Duel (duel.js) · Block Painter (blocks.js). Shared: u3data.js (book tables), table3d.js
- [x] Export `python scripts/rebuild_ipad.py 301 … 313`, then test_offline.py
- [x] 2026-10-09 memorize-games: Table Builder (ptbuild.js: symbols, place, periods, history) · Family Names
  - 2026-10-09 Place = 13 small levels (2-6 new elements each: meet, ask, look again, ask + 2 old); blank grey until learned.
  - rounds.js: next question at once; the tapped answer finishes its animation as a fading ghost; stats chip updates per finished pass (localStorage games.stats.*); part.loopFrom skips intro rounds on repeat. Place: 'new elements' window + Go; look checkbox (ptbuild.look). Resume (games.resume.<id>) + level picker chip in all rounds games.
      (families.js) · Metal or Not (metalsort.js) · Trend Arrows (trends.js, Fig 3.9). table3d has `label` + relabel().
- [ ] Unit 3 films still v3 (paragraph captions): rebuild to v4 'show, don't tell' like Unit 2
- [ ] Waiting for the user's look at Unit 3

## Unit 4 Structure of Molecules (pp. 92–120) + chapters home page (2026-10-09)
- [x] Films 401–415 built (scripts/u4, u4lib.py; storyboard docs/STORYBOARD_U4.md), previews checked
- [x] Home page web/home.html (chapter cards from films.json `chapters`: pages, blurb, icon from films.py CHAPTER_INFO);
      index.html with no query string redirects there; ⌂ button in the film view and games hub
- [x] Games (unit 4 tab): Quiz Quest (quiz4.js) · Bond Builder (bondbuild.js) · Bond Sorter (bondsort.js) · Shape Lab
      (shapelab.js). Shared 3D kit: mol3d.js (molecules, dot-and-cross atoms, ions, EN ruler)
- [x] Export 401–415 + build_pwa + test_offline
- [x] Project skill .claude/skills/asawera-chapter/SKILL.md (taste + pipeline; every session appends to its log)
- [x] 2026-11-04 SKILL rebuild: all 15 lessons are now CODE lessons (web/lesson/l401–l415.js, shared u4kit.js; app.js
      CODE_LESSONS). Each has its beat sheet in the header; zcheck 0 flicker risks, text_check 0 moments with 2 texts.
      Audit of the old films: docs/AUDIT_U4_U6.md. Coverage: docs/COVERAGE_U4.md.
- [x] Games: 🔍 Explore first + arcade in Bond Builder, Bond Sorter, Shape Lab; new 💡 Bond Reasons (why4.js: Key
      Points, facts, Short Q v ix x, Long Q i–v incl. Lewis counts).
- [ ] Baked tables: done 401–412 + 413 hook/melt/cond; 413 (2 more) + 414 queued (CPU Cycles, ~10 min each)
- [ ] Not pushed: GitHub refused (Claude GitHub App not installed); branch chapter-4-6-skill-rebuild is local only
- [ ] Not published to the live site from this cloud session
- [ ] Waiting for the user's look at Unit 4 (code lessons)

## Unit 5 Physical States of Matter (pp. 122–151) (2026-10-09)
- [x] Films 501–515 built (scripts/u5, u5lib.py: gas boxes, piston rig, gauge, thermometer, flame, dish/jar
      evaporation; storyboard docs/STORYBOARD_U5.md), previews checked
- [x] Games (unit 5 tab): Quiz Quest (quiz5.js) · Gas Law Lab (gaslab.js: Examples 5.1, 5.2, Practice 5.1,
      numericals i–v) · State Sorter (statesort.js) · Why? Lab (whylab.js: Short Q i–vi, Long Q ii).
      Shared 3D kit: gas3d.js (Molecules, edgeBox, jar, pistonCyl, gauge, thermo, flame, arrow3)
- [x] Export 501–515 + build_pwa + test_offline
- [ ] Waiting for the user's look at Unit 5

- [x] 2026-11-04 SKILL rebuild: all 15 lessons are now CODE lessons (web/lesson/l501–l515.js, shared u5kit.js; app.js
      CODE_LESSONS). zcheck 0, text_check 0 each. Coverage: docs/COVERAGE_U5.md. Games: Explore + arcade in State
      Sorter and Why? Lab; new 🧠 Matter Practice (recall5.js: Key Points, Tables 5.1–5.3, dates, Long Q iii, iv).
- [ ] Baked tables for 505–513 still in the CPU queue; dense 1.5 s + five-screen pass for 503–515 still to do

## Unit 6 Solutions (pp. 152–181) (2026-10-09)
- [x] Films 601–617 built (scripts/u6, u6lib.py: beaker, inside, dissolve, flask, beam/torch, water, scale_bal,
      cylinder_glass; build with `sh scripts/u6/b6.sh scripts/u6/f6NN_x.py`; storyboard docs/STORYBOARD_U6.md), previews checked
- [x] Games (unit 6 tab): Quiz Quest (quiz6.js) · Molarity Lab (molarlab.js: Examples 6.1–6.5, Practice 6.1,
      Skill Development, numericals i–v) · Mixture Sorter (mixsort.js: Short Q iii, Long Q i, Project Work) ·
      Solution Lab (sollab.js: Short Q i, ii, iv, v, Long Q iii, iv, Activity 6.2, Example 6.6, Point to Ponder)
- [x] Export 601–617 + build_pwa + test_offline
- [ ] Waiting for the user's look at Unit 6

## Unit 7 Electrochemistry (pp. 182–217) (2026-10-09)
- [x] Films 701–719 built (scripts/u7, u7lib.py: atom, badge, tank, plate, wire, battery, flow, bubbles, bulb, ion,
      molb, cflask, cell; build with `sh scripts/u7/b7.sh scripts/u7/f7NN_x.py`; storyboard docs/STORYBOARD_U7.md), previews checked
- [x] Games (unit 7 tab, kit chem7.js): Quiz Quest (quiz7.js) · Oxidation Number Lab (oxlab.js: Short Q ii, vii,
      Examples 7.1–7.2, Practice 7.1) · Redox Detective (redoxsort.js: Short Q i, vi, Examples 7.4–7.5, Long Q II) ·
      Cell Lab (celllab.js: Short Q iii, iv, v, viii, ix, x, Long Q I, III, V)
- [x] Export 701–719 + build_pwa + test_offline
- [x] 2026-10-15 student-view audit of every book spread and all 19 lessons: current code lessons in
      `web/lesson/l701.js`–`l719.js`, shared `u7.js` / `electrochem-kit.js`. Corrected charge/atom counts,
      particle sources, worked calculations, circuit/bridge connections, control tests, plating preparation,
      reading time and phone text. Current skill's capNear explanations sit in the picture. Full coverage,
      literal timed observations and the §1 audit are in `docs/COVERAGE_U7.md` and each lesson header.
- [x] Chapter 7 Practice (`recall7`): 208 Explore/recall items, six practice sections, project prompt;
      old labs also start with Explore. All 208 items load without JavaScript errors. Opaque light maps packed:
      151.6 → 39.1 MB, preserving alpha textures and mesh bytes. Whole-chapter zcheck: zero surface risks.
- [~] Final five-screen/dense capture and isolated release/offline verification; results in COVERAGE_U7.md.
      Release is based on live `136fadbaff0e`, preserving other chapters' live versions during concurrent edits.
- [ ] Real iPad/midrange-phone playback and native AR remain hardware checks, not desktop-browser certifications.

## Units 4–7: SKILL rules applied (2026-10-10)
- [x] Games rewritten on rounds.js (old copies `backups/*_v1.js`): levels easy → hard (first level shows the aid:
      ruler, particles, arrows; next from memory), instant next + ghost + one-line why toast, labs use `keep:'tap'`
      (worked answer, then "Tap anywhere to go on"), stats chip, resume + level picker. New helpers in rounds.js:
      `choose()` (3D answer tiles, `column` option) and `chooseText()` (long answers). quiz.js: no confetti/stars/hints,
      3 misses show the answer. bondsort, bondbuild, shapelab, gaslab, statesort, whylab, mixsort, molarlab, sollab,
      celllab, oxlab, redoxsort.
- [x] Films v4: captions → one gold line ≤ 6 words (`scripts/v4_caps.py dump|apply docs/v4caps_uN.txt`), "Next:" rows
      dropped (film ends sooner); key-points films 414/514/616/718 one short line per point; MCQ films 415/515/617/719
      in the film-12 pattern (card → answer → card leaves → model + one why line; `tmp/conv_mcq.py`). Old builders in
      `backups/v3/`. Without a Blender window: `scripts/bgsend.py` (background build) and
      `python scripts/v4_batch.py uN ids…` (build + preview sheet `renders/p2/u<id>_sheet.jpg`).
- [ ] Export all 401–719 (`rebuild_ipad.py`), build_pwa, test_offline
- [ ] Unit 3 films and Unit 2 films 02/03 still v3

## Unit 8 Chemical Reactivity (pp. 218–248) (2026-10-10 / 11)
- [x] Films 801–819 built (scripts/u8, u8lib.py; storyboard docs/STORYBOARD_U8.md) into the main .blend, previews checked
- [x] Games (unit 8 tab, kit chem8.js): Quiz Quest (quiz8.js) · Metal Reactions Lab (reactlab.js) · Halogen Duel
      (halolab.js) · Metal or Non-metal? (metalprops.js); all with the arcade layer
- [x] Export 401–819 (Units 4–7 now with their v4 captions, no "Next:" cards) + build_pwa + test_offline (110 films, 42 games)
- [x] Coverage check page by page: docs/COVERAGE_U8.md (missing book points per film; films not yet extended)
- [ ] Add the missing points to films 801–817 (waiting for the user's go)

## Player + games (2026-10-11)
- [x] Player: start card (chapter, title, pages, act chips), end card (Watch again · Practise · Next lesson ▸, no next
      title), tap = pause/play, double-tap sides = ±5 s, middle = film view; stills > 1 s play at 8× (findStills);
      orbit centre = middle of the shot (shotDepth raycast; topic films had (0,0,0)), wider zoom/pan. Test: scripts/test_player.py
- [x] Arcade layer web/games/arcade.js (runGame `excite: true`): score × streak, fast bonus, auto level-up (≥ 90 %,
      ≤ part.fastS s, checkbox per level), timed session 5/3/10 min/off → results card + personal best. On: Table
      Builder + Unit 8 games. Test: scripts/test_arcade.py
- [ ] Coverage checks for Units 2–7 (like COVERAGE_U8.md); Unit 3 films + Unit 2 films 02/03 still v3 ("Next:" cards)

## Big rebuild (user 2026-10-11): quality, motion, effects, sound, product
- [x] Player: minimal icons, auto-hide, starts at the first non-empty frame (firstContentFrame), safe-area framing
      (fitCamera SAFE), 🎮 opens the lesson's own game (films.py FILM_GAME → films.json `game`)
- [x] Shared model library assets/library/asawera_library.blend (23 CC0 models, scripts/build_library.py);
      workflow + shopping list docs/ASSET_LIBRARY.md (user retopologizes + bakes)
- [x] Product plan docs/PRODUCT_PLAN.md (hosting, licence token, capture, payments PK, ads, energy) — nothing built yet
- [x] Player: captions drawn in their own pass, each shot's 3D picture fitted clear of the caption band and the frame
      edges (shotFit); old cone flames → real fire everywhere (web/fx.js upgradeFlames)
- [~] Pilot 803 rebuilt v5 (scripts/v5lib.py: pop/fall/glide/wobble/splash/atom3d/lib_obj/fire; all pp.222–223 points;
      old: backups/v4/f803_alkali_v4.py); sheet renders/player/pilot_803_sheet.jpg — waiting for the user's verdict
- [~] 803 is now a code lesson web/lesson/l803.js v10 (2026-10-12; backups/l803_v*.js): book-order argument, story
      spine, plain words, zcheck 0 risks, dense iPad check done. Waiting for the user's verdict, then roll out (SKILL §4).
- [x] 804 code lesson web/lesson/l804.js v2 (2026-10-12): v1 rejected (camera, animation, not understood, materials
      alike; backups/l804_v1.js). v2: each test = three set-ups side by side on a wooden bench, tongs bring each piece,
      one steady close-up per metal, wide result with book words + "<" signs, equation built from labels; every
      substance its own colour. New kit: tongs, tripod, dish, bench. zcheck 0, dense iPad check.
      User 2026-10-12: v2 "fully understood". Added: verdict words name what they mean; formula board
      (kit.reactionBoard: words → atom balls swap partners → symbols, replayed per metal).
      Look-dev (2026-10-13): Cycles-baked bench + studio for the WATER test only (scripts/lookdev_bake.py →
      web/lesson/bake/set804w.glb; ?look=old = old look; sheet renders/lesson/lookdev_804_water.jpg).
      User 2026-10-13: bake approved; park/garden photo backgrounds rejected ("floating ball"); studio photo chosen;
      "looks flat" → light design. FINAL LOOK (all stations): HDRI studio_small_09 as a dome whose floor the table
      stands on (kit.photoDome, dim = ENV 0.25, light pool behind the set); per station export_casters.py →
      bake_set.py (ENV=0.25 KEY=1100: close warm key left, cool rim, small fill; matte walnut) → bake/804_<st>.glb;
      live lights = bake rig; glass = house.js studioGlass (dark edges); formulas on a roll-down slate.
      Cycles reference of a shot: bake_set.py REFCAM=… → renders/bake/ref_*.png. ?look=old = before.
- [x] Look v2 "easy on the eyes" (2026-10-13): ACES 0.9, wall darker than the set, studioGlass v2, clear liquids;
      shared as kit.studio() (dark mode for atom scenes). 804 uses it.
- [~] 801 code lesson web/lesson/l801.js (2026-10-13): pp. 218–219 complete (intro, 8.1 tests, basic oxide + litmus,
      Na → Na⁺, hydrogen exception, Tidbit table rule by rule). 5 baked stations (intro, elec, shape, state, ox);
      new kit props: ingot, ring, nail (rusts), hammer, anvil, stand, drawPlate, watchGlass, dropper. zcheck 0, dense
      iPad sheet checked. Game Metal or Non-metal? got the Tidbit part (🧱 In the table). v1 rejected ("can't tell
      what's happening"); v2 = every test asks first, shows the before, a visible cause, a held ✓ result (vise, contactShadow
      in kit). v2 "no overall point" → checklist card "What is a metal?" ticks after each test (3:20).
      User: "much better" (2026-10-13) → pattern approved. Checklist is now K.checklist: big card at the start, then it
      docks at the left edge and ticks (user: no pop-up after each test; only lessons that need it). Shots after the dock
      use S() with K.dockShot.
- [x] 802 v3 (simple: one atom at a time, one bar chart, one table + arrow; no checklist): user "this lesson is good"
- [x] Text by the action, one at a time (2026-10-15, user: "so much better"): engine capNear + oneText on 801–817
  (scripts/near_on.py turns it on; scripts/text_check.py <id> must say 0 moments with >1 text). Units 2–7 code lessons not yet.
- [x] 817 v4 Halogens React (2026-10-15; v3 "somewhat makes sense, very hard to understand, random events, pacing
      wrong"): same book order and experiments; every test = question → named before → visible cause (tongs, sunlight
      beam, hot plate, flame, dropper, tap) → ✓ label on the thing; dark scenes only as a dive INTO the thing just made
      (HF liquid, KI powder, white fumes, orange water); gas = drifting wisps; formulas built from the labels. 220 s.
      §1 check (sheets renders/lesson/v817a-e, 1.5 s apart, 1180×820; screens 817_screens.jpg): question card 12–20 s ✓ ·
      jars: names held 26, plate pulled 27, bang 28.5, "bangs at once ✓" 30, formula from the names 33–35 ✓; sunlight
      beam 42, "needs sunlight ✓" 45 ✓; hot plate glows + "hot plate on" 51, "needs heat ✓" 54 ✓; iodine back and forth
      60–63 ✓; wide results + arrow 66–68 ✓ · no neighbour peeking in close-ups (spacing 1.8) 39–63 ✓ · HF liquid in the
      jar 72, dive → hydrogen bonds 74–80 ✓ · oxides one at a time, never an empty frame 81–99 ✓ · copper: bromine named
      101, copper 103, black + "copper bromide forms ✓" 105 ✓ · spoon + flame 112, KI 118 ✓ · phosphorus fire 133, fumes
      135, PCl₃/PCl₅ counted 140–144 ✓ · sulphur 152–156 + formula 158–161 ✓ · tap, gas runs, bubbles, powder 163–171 ✓ ·
      tubes: dropper leaves before the formula 179–182, orange/brown 177/187 ✓ · Cl₂ pulls electrons 193–198 ✓ · order
      tiles hop in turn 203–206 (no still) ✓ · riddle → chlorine 208–219 ✓ · ≤ 3 labels a shot ✓ · one place moves at
      a time ✓ · shots 2–9 s, no 30 s still ✓ · flicker 0 ✓ · 5 screens ✓ (1600×600 shows whole neighbours at the
      sides; upright phone small, as in every lesson).
- [x] 817 v3 (old) Halogens React (2026-10-14; v1 "still extremely bad, I don't understand", v2 contest rejected): real
      things instead of 12 boards (3 boards left): four hydrogen jars, HF vs HCl, oxides built from balls, copper in
      bromine, K + I₂ spoon, K → I electron, phosphorus burns in chlorine + PCl₃/PCl₅ counted, sulphur, bleaching powder,
      two tubes, Cl₂ vs Br⁻, order, chlorine riddle. 218 s. Bigger side panel (kit checklist dockTitle).
      §1 check (sheets renders/lesson/x817a/b.jpg, 1.5 s apart; screens 817_screens.jpg): question on screen 16–20 s,
      panel readable all through ✓ · each experiment asks → before → cause → ✓ label (jars 23–50, copper 89–98,
      spoon 98–106, phosphorus 115–125, sulphur 137–143, lime water 146–152, tubes 166–179) ✓ · ≤ 3 labels a shot
      (results one at a time 26, 34, 40, 46) ✓ · no empty frame (boards start before the cut 52, 155, 190; oxide cut
      80) ✓ · one place moves at a time ✓ · camera: one push-in on the jars 20–24, wide again only for the arrow 48 ✓ ·
      baked tables (hook, hyd, metal, nonm, comp, disp), dark atom scenes ✓ · flicker 0 ✓ · 5 screens ✓ (upright
      phone small, as in every lesson). Published.
- [x] 816 v1 Halogens (2026-10-14): salt shaker + sodium burns in chlorine → card → (dark) group VII → five jars
      (gas, gas, liquid, solid + purple vapour, solid) → iodine bulb test → (dark) Cl 2,8,7, row of five atoms, Na gives
      Cl its electron → board X₂ + 2e⁻ → 2X⁻ → salt crystal (never free) → Cl₂ shared pair → Table 8.9 bars → salt.
      190 s. Published.
- [x] 815 v1 Non-metals (2026-10-14): hammer on copper vs sulphur → card → pull (wire / snaps) → bulb (copper yes,
      sulphur no, graphite the exception) → heat (wax drops / stays) → sulphur burns in oxygen, blue litmus red vs
      sodium oxide red → blue → chlorine, bromine, solids → (dark) table: 27 non-metals, states, liquid metals → (dark)
      Na gives Cl an electron → Cl⁻; Cl₂ + 2e⁻ → 2Cl⁻ board → zinc vs sulphur in acid → (dark) NaCl vs HCl, hydrides,
      NaH → (dark) shared pair pulled, table arrow, group VII → anvils. 240 s. Published.
- [x] 814 v1 Noble Metals (2026-10-14): dug-up rusted nail vs shining gold coin → card → damp-air box → (dark)
      who gives electrons away (Na, Fe, Au bars) → (dark) table: 8 noble metals (+Hg, Re, Cu) → ground slice: found
      free, rare → valuable, precious → silver (4 forms, alloy, film, sheet/wire, best conductor/reflector) → (dark)
      72nd → platinum (heavy, malleable, ductile, 1770 °C, acid, converter, uses turntable) → gold (sheet, wire, cast
      alloy, coins → paper, computers, crown) → (dark) Society box → coins → nail and coin. kit: coin, banknote,
      circuitBoard, converter, gemRing, necklace, nativeWire, filmStrip, goldRock, scalpel, laserPen, mirrorStand,
      toothCrown, ingotMould, tableSpoon. export_casters keeps wide tables whole. 302 s. Published.
- [x] 813 v1 Soft and Hard Metals (2026-10-14): one knife cuts sodium, not iron → card → (dark) table: all metals,
      soft IA/IIA, hard Cu Ag Fe → (dark) atoms: weak vs strong metallic bonds, the knife parts / can't part them →
      melts (thermometer), bars mp/bp → floats/sinks + balance 8½ : 1 → wires snap/hold, bridge, building, steel → air,
      kerosene → (dark) low vs high ionization energy → knife table. kit: trussBridge, steelFrame, hangWeight,
      metalLattice (toyCar hub fix). 181 s. Published.
- [x] 812 v1 Uses of Magnesium and Calcium (2026-10-14): hook table (aeroplane, sparkler, sugar, glass) → balance +
      alloys → sparkler + flash powder (dark) → deoxidant, Ti, U → MgO furnace bricks → MgSO₄ users → Ca cleans steel and
      copper, steel making → CaF₂, CaH₂, U → lime on acidic soil + lime's jobs → table ✓. kit: balance, toyPlane, toyCar,
      gear, sparkler, furnace, clothRoll, paperStack, medicineBottle, factory, sugarCubes, glassBottle. 186 s. Published.
- [x] 811 v1 Magnesium and Calcium React (2026-10-14): two crucibles burn (white / brick red) → H₂, O₂ (+ water,
      litmus), N₂, HCl + H₂SO₄, Cl₂ + Br₂; every board first Mg then only the metal ball swaps to Ca ("twins") → back to
      the crucibles. kit: MOL MH2, MO, MOH2, N2, M3N2, HCl, MCl2, MBr2, H2SO4, MSO4; ATOM Ca, N, SO4. 218 s. Published.
- [x] 810 v1 Magnesium and Calcium (2026-10-14): table hook (chalk, marble, leaf, sea water) → ground slice with Mg
      mineral pockets → sea water + soap test → chlorophyll dive → Mg atom → periodic table → Ca rocks, gypsum, pure Ca
      → Ca atom → table → Tables 8.5/8.6 as bars, hammer, circuit → table. kit: chalkSticks, marbleSlab, chlorophyll,
      ribbonCoil, stoneBlock, crystal kinds dolomite/kieserite/talc/asbestos. 155 s. Published.
- [x] 809 v1 Uses of Sodium (2026-10-14): familiar table hook (lamp, soap, baking soda, petrol can) → four compound
      jars filled by a gold sodium ball → street lamp at night (dark studio) → reactor coolant loop → petroleum
      desulphurization → Ti / Zr crucibles → mercury amalgam + silver alloy → table ✓. kit: printBox, soapBar, jerryCan,
      streetLamp, compoundJar, coolantLoop. 135 s. Published.
- [x] 808 v1 Sodium Reacts (2026-10-13): oil-jar hook (dulls in air) → spoon tests H₂ / O₂ (+ water, litmus) → water
      race + fire + thermometer → back under the oil → Cl₂, Br₂ (one burner, two jars) → sulphur in a mortar → MgO and
      TiCl₄ crucibles (reducing agent) → jar. Formula slates (kit.reactionBoard; tall stacks now grow upward).
      kit: mortar, pestle, crucible, ATOM Br S Mg Ti, MOL MH Br2 MBr S M2S MgO Mg TiCl4 Ti. 225 s. Published.
- [x] 807 v1 Sodium (2026-10-13): salt table hook (baked) → knife cut → dark atom + periodic table + chlorine takes the
      electron (salt) → float · melt (thermometer, kit.thermometer) · hammer / pull / snap · bulb + hot-plate rod
      (kit.hotPlate) → back to the salt. kit: saltHeap, rockSalt, thermometer, hotPlate. 163 s. Published.
- [x] 806 v1 Ionization Energy APPROVED ("the ionization lesson is good now"; backups/l806_v1_approved.js) (2026-10-13): hook sodium races / magnesium sinks (baked bench), dark atoms + bar charts
      (Table 8.2, Mg 737.7/1450.7, Table 8.3 pairs, IA vs IIA rows), back to the bench + IA → IIA list (p.229 top). 133 s.
      Engine: lesson `fog: [near, far]`; zcheck ignores on-top HUD planes. Published.
- [x] 805 v3 APPROVED by the user ("i'm happy with the lesson"; backups/l805_v3_approved.js). (2026-10-13; v2 rejected: "don't understand these things", camera too fast, one screen only, bake the light).
      v3 = baked studio: life table (bone, tooth, egg shell, leaf, sea water + chart) · Ca in water · dark atoms · a cut-open
      slice of the ground with crystal pockets (kit.crystals base:false) · back to the table · chart. Moves ≥ 2 s; 137.6 s.
      Bakes: 805_life/water/ground. Engine: every key refits to the real screen (S() passes fit; hand-placed keys get one
      derived), upright screens put the card at the TOP (kit DOCK_TOP); 801–804 also fitted. Checked with shot_screens.py.
- [x] 805 v2 (2026-10-13; v1 rejected "not happy": short, no reason). v2 = question card + real-life hook (gallery → tiles fly
      into column IIA) + Ca in water + inside the atom + gallery explained; 135 s. Old v1 note:: table → Ca in water + litmus → earth block → Mg atom → M²⁺ →
      ions grow into gypsum → specimen row on plinths (new kit: plinth, crystals, epsom, leaf, bone, tooth, eggShell,
      radiumVial, earthBlock). zcheck 0, dense iPad check. Published. Next: 806 Ionization Energy … 819
      is it?"; game part 🌍 In the earth (Scientific Information).
- [ ] Next code lessons, book order: 802, 805–819 (same look, same checks).
- [ ] Pilot lesson in the new quality (library models, real 3D atoms, animation principles, recognizable effects,
      reusable sound effects, one place at a time, no waits, no overlaps) → user approval → roll out unit by unit
- [ ] Book coverage maps for Units 2–7; add missing points (Unit 8 list: docs/COVERAGE_U8.md)
- [ ] Home page + theme: minimal, modern text

## App / pipeline
- [x] Multi-film app, export_topics.py, rebuild_ipad.py, build_pwa.py (precaches everything in web/, games included)
- [x] test_offline.py passes (2026-10-08; now also opens all 12 films + 7 games with the network off); updates reuse unchanged files from the old offline copy (sw-template reuse(), hash-checked), so an update only downloads what changed; offline.js offlineGuard() shows a 'not finished saving' note instead of Safari's error when a link is tapped offline without a complete copy; IPAD_APP_GUIDE.md has the Topics menu + Games; docs/NOTES.md written
- [ ] Check on the real iPad: install from the https link, Airplane Mode, play a few films + games, AR

## Ideas / next (optional)
- Smaller download: topic GLBs are mostly sampled animation (09: 12.9 of 14.7 MB). `export_frame_step=2` in
  export_prep.export_glb (topic films only) would roughly halve them.
- MP4 renders of the films (scripts/encode_mp4.py) if the teacher wants videos too.

## Known issues / decisions
- Book tables (03 T2.1, 04 T2.2, 05 T2.3, 07 T2.4, 08 T2.6): text ≥ 3.1 % of frame height (4–5 % where room), solid panel (M["panel_solid"]); 04 hides the Na atom under its table.
- Working file is `2 school experiment.blend`. Backup: `backups/*.before-part2.blend`. v1 builders of 05/06/08/09
  were not kept in the repo (v2 replaced them).
- Film view: the canvas sits between the title bar and the play bar (app.js viewTop/viewH) and fitCamera always shows the whole 16:9 frame (no caption hides behind a bar; AR stays full screen).
- Orbit trails: the Blender comet arcs ("… Trail" children of electrons) are hidden in the app; app.js draws live tails from the electron's real path over the last 16 frames (evaluated from the animation tracks, max length 2.5 units).
- Name clash: a text/mesh "X" splits into parts "X_0, X_1…" in the app; an object named "X 1" used to lose its animation to that part (labels vanished). app.js now renames the parts ("X~part1") before binding; still prefer distinct names.
- Web check without an iPad: serve web/ and open `?film=02&frame=1300&test`; `&dbg` exposes `window._dbg`.
- lib.sphere(r) sets r through object scale: pop it in with appear(ob, f, s=(r,)*3).
- Keyframing location changes the object: copy `home = ob.location.copy()` BEFORE kf(..., far).
- camera() shifts the subject left by default (room for HUD text on the right); centred shots pass shift=(0, 0).
- Put text in front of panels (z>0) and decorations behind (z<0). Long Python patches: use the Edit tool or a .py file
  written with the Write tool (bash heredocs mangle quotes, `\n` and non-ASCII).
- rebuild_ipad may print "FAILED: NN AR" from a Poliigon add-on temp-file error although the USDZ was written: check
  that web/ar/NN.usdz has a fresh time stamp.
