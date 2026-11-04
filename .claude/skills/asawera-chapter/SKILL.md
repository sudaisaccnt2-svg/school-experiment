---
name: asawera-chapter
description: How to build or refine a textbook chapter for the Asawera "Chemistry IX in 3D" iPad app (Blender films + three.js games) in the user's style. Use for any new unit, any film or game change, and whenever the user gives taste feedback (then update the Refinement log below).
---

# Asawera chapter skill (living file: refine it)

The user is an artist/teacher, not a coder: answer in plain, short words. They send book photos; the job is to
turn every page (book order, nothing outside the given pages) into animated 3D films plus games, offline on iPad.

**This file is meant to grow.** Whenever the user corrects taste or workflow ("too much text", "don't instruct in
the game", "make it bigger" …), add one dated line to the *Refinement log* at the bottom (what + why), and fix the
rule above if it changes. Keep it short: rules, not stories.

## 0. Read first, every time (user 2026-10-13: "the skill was to automate this so you don't need me for each lesson")
This file is loaded into every session through CLAUDE.md. The user must NEVER have to point out a mistake this file
already describes. Work on your own: plan → build → review against ALL of §0 + §1 + §4 → fix → publish → next lesson.
Don't wait for approval between lessons; the user reviews whenever they like. A first version that breaks a written
rule is a failure.

**THE REFERENCE LESSON: Halogens React (817 v4, web/lesson/l817.js, LOCKED; user 2026-10-15: "much better, I can
fully understand it, every part is linked").** Before showing any lesson, put its sheet next to 817's and match it:
the book's own question on a card that docks and ticks · a real-life hook (bleach on a red cloth) paid off at the end ·
every experiment = question → named before, held → visible cause → result ✓ on the thing · a dark close-up only as a
dive INTO the thing just made, then back · one text at a time, beside the action · each act ends on a bridge to the
next. The user should get THIS quality in the first version, not after four rounds.

**The three goals of every lesson (in this order):**
1. **Nothing from the book is missing.** Every sentence, figure, table, box and equation of the pages lands in the
   lesson (or, for things to memorize, in a game, written in docs/COVERAGE_UN.md). NEVER shorten a lesson to make it
   simple: length is whatever the book needs. "Simple" means each SHOT is clear, not that the lesson is short.
2. **The lesson has a reason.** It opens with ONE big question the student cares about (the page's own question, e.g.
   "Why are they called alkaline earth metals?"), every beat answers a piece of it, a bridge line links each part to
   the next ("So they make alkalies. But where are they found?"), and the end answers the question. A row of facts or
   objects shown one after another with no question behind them ("random things going on") is not allowed.
   **Never invent a framing the book doesn't use** (user 2026-10-14, 817 v2 "doesn't make any sense, extremely
   worse"): I turned a list of reactions into a made-up contest ("who pulls electrons hardest?", rounds, 1-2-3-4 rank
   numbers) and the lesson lost its sense. The question and the thread come from the book's own words. When the user
   says a lesson is boring, keep everything that made sense and change the least (Modify, don't rewrite); ask what
   to change before rebuilding a whole lesson.
3. **It is interesting.** Start with a hook from real life that makes the student curious (something surprising they
   know: chalk, bones, a leaf, fireworks…), then pay it off. Real experiments with visible cause and effect, motion,
   surprise, a satisfying reveal at the end. Never a slideshow of labelled objects.

**Mistakes the user already had to correct (check EVERY one before publishing):**
too much at once in one shot (802 v2) · no overall point / random facts (801 v2, 805 v1) · lesson made shorter, book
points dropped (805 v1) · can't tell what's happening in an experiment (801 v1) · things appear from nowhere · small
subject in a big empty frame · flat/unrecognizable models · not interesting (805 v1) · formulas not understood (804) ·
camera pumping in/out · labels overlapping or cut at the edges · pauses after animations · naming the next topic ·
things the student doesn't recognise (805 v2: minerals on plinths in a museum row) · camera too fast to follow (805 v2) ·
framed for one screen only (805 v2) · plain un-baked light where a set could be baked (805 v2) · a slideshow of formula boards (small balls + words on an
empty dark floor, empty frames between them) instead of things happening (817 v1) · a "§1 CHECK ✓" written from
the code without looking at the pictures (817 v1) · dark interludes of balls between experiments, gas that looks
like juice, effects too short to see, pacing that swings from a 30 s still shot to 6 s rushes (817 v3).

**Things a student knows, or a context that explains them (805 v2: "I don't understand these things you made").**
Open with objects from the student's own life (bones, egg shells, a leaf, sea water, chalk, a coin). Things they
don't know (minerals like gypsum, barite, beryl) appear only where they really are, in a picture that explains them
(crystals growing inside a cut-open piece of ground), big and close, with a plain name. Never an abstract row of
specimens on museum stands.

**The camera must be easy to follow (805 v2: "follows very fast, not enough in-between frames").** Every move takes
at least 2 s and passes at most one object per 2 s; no gliding along a row of things; a new shot holds still ≥ 1 s
before the next move. Keep the frame rate high: instancing for repeated balls (nuclei, grains), no shadows from
hundreds of small parts.

**Every screen (805 v2: "this should work on any screens").** Phones (portrait and landscape), tablets, laptops and
wide monitors. Frame with S() (it passes the subject size to the engine, which refits each shot to the real screen
shape) and check the sheet at 5 sizes: 1180×820, 1920×1080, 844×390, 390×844, 1600×600 (`scripts/shot_screens.py`).
Upright phones: the question card docks at the TOP (kit DOCK_TOP), the subject below it. A long row of things on a
table gets small there: keep labels short and well apart so they don't touch when the shot widens.

**Baked light (user 2026-10-13: "bake lighting on this to get beautiful lighting").** Every lesson whose things stand
on a table gets the baked photo studio (K.studio + export_casters.py → bake_set.py), not only the lab lessons.

## 1. Taste (the user's rules)
- **THE rule: faithful to the book.** Extra explanation only where the book itself is confusing, built from the
  book's own pictures. No new topics beyond that.
- **Every experiment explains itself (user 2026-10-13, 801 v1: "can't tell what's happening").** For each test:
  the caption ASKS the question first → the BEFORE is shown and named ("a gap", "bulb off", "copper ball") and held
  ~2 s → a VISIBLE cause does it (tongs carry, a flame is lit, a hammer swings, a clamp pulls, "day 1/2/3" labels for
  time) → the RESULT gets a ✓ label on the thing and is held. Never let things change, appear or fall by themselves.
  ~9–10 s per test. Odd props a student doesn't know (draw plate) → replace with obvious ones (two clamps pulling).
- **One big question per lesson, on screen (user 2026-10-13, 801 v2: "the parts make sense but I don't get the overall
  meaning").** Find the page's main question (801: "What is a metal?", answered 3 ways). `K.checklist`: the full
  card in the middle once (the plan), then it glides to the left edge as a slim panel that STAYS and ticks one row per
  test (user: never a pop-up after each experiment). Frame every later shot with S()+`K.dockShot` so the subject sits
  right of the panel. Use the card when the lesson answers its question in several parts; the QUESTION itself
  (§0 goal 2) is mandatory in every lesson, card or not.
- **Less is more PER SHOT, never fewer book points (user 2026-10-13, 802 v2: "too much going on"; 805 v1: "I never
  asked to make the lessons shorter").** A shot shows ONE thing (one atom, one bar chart, one table) and at most ~3 labels. Never a bench of 16 samples,
  rows of atoms that spread and close, stairs, colour keys and a checklist in one lesson. If the book's point is a
  pattern (a trend, a rule), show it on ONE simple picture (the periodic table + one moving arrow), not on many props.
  Repeated beats (three atoms losing electrons) get shorter each time (7 s, 5 s, 5 s). Before showing a lesson, write
  the §4 C5 pass/fail list for EVERY §1 rule in the lesson header (user: "why don't you use skill.md in every lesson?").
- **Known confusion: shells vs sub-shells** (film 05 act "Clouds", game Electron Trails). Use the book's words only
  (p.49): the electron revolves round the nucleus in a fixed shell (fixed energy); "a subshell is the area in which
  electron moves within a shell". Picture: the electron goes round and round, lap after lap, each lap a little tilted
  and bigger/smaller; its glowing trail fills the area (s ball; p/d: laps inside a lobe, carried close by the side of
  the nucleus to the next lobe). NEVER popping/snapshots/measurement, never "Bohr was wrong", never a random scribble,
  never a path over or through the nucleus. Bigger shell = bigger area; 2s and 2p share shell L; 2 e⁻ per orbital.
- **Visual first, kid-friendly.** Picture → plain words → book symbols last, each symbol pinned to what it names.
  Never a bare formula. Every number becomes something countable/comparable (dots, marbles, bars, balances, sizes).
- **v4 "show, don't tell" (films, ALL of them; replaces v3).** A film is a row of beats; each beat teaches ONE idea:
  1. only the objects of this beat are on screen (everything else pops OUT, not just stands still);
  2. ONE action happens, big and close (push in for the key moment, but only onto things that hold up close; the
     moving thing is gold and leaves a glowing trail);
  3. the RESULT is shown physically with ONE label on it (a full shell flashes, a +/− sign pops onto the ion, the
     shared pair glows, a bar grows…), held about 1 s, then the next beat starts.
  Caption = ONE short gold line (≤ 9 words) that repeats what the picture already shows; no second line. If a beat needs a sentence to be
  understood, the picture is wrong: redesign the picture. Numbers become countable things, not text. Solid, lit,
  glossy models (true sizes, e.g. Na⁺ small, Cl⁻ big); labels sit on the thing.
  **No waiting:** the user dislikes any pause after an animation. No still moment > 1–2 s (a slow reveal is fine while
  something moves); the player also
  plays any still stretch > 1 s at 8× (app.js `findStills`, camera drift doesn't count as action).
  **Never name the next topic** (no "Next:" card in a film; the player's end card says only "Next lesson ▸").
  When the user asks to fix "the lessons", apply it to EVERY film, unit by unit, not just one.
- **Nothing missing (length = whatever the book needs).** Before calling a film done, tick every point of its book
  pages (definitions, tables, figures, examples, Test Yourself, Activities) against its beats. Never trim to look simple.
- **Student prerequisite pass (2026-10-15).** Review every lesson in chapter order as a first-time student. Before
  each action, the picture must establish its starting objects, their names, where particles came from, why they
  move, and how the result follows. Count atoms/electrons before and after; work calculations through visibly.
  A coverage table or a code review alone cannot certify that a student understands the lesson.
- **Player (all films, app.js): minimal and modern.** No start card with chips/buttons (user: distracting). A lesson
  opens straight into the scene with a short title moment (title fades in and out over ~2 s, then it plays). Chrome
  is icons only and hides itself while playing (shows on pause / pointer move). Behaves like a video (tap = pause/play,
  double-tap left/right = 5 s back/forward, middle = film view) while drag orbits, pinch zooms, two fingers slide.
  The orbit centre is the middle of the shot. Ends on a tiny end bar (↺ · 🎮 · ▸), never the next topic's name.
- **Clean frame (user, repeated).** Text never overlaps a 3D object or other text: captions sit in their own clear
  band, labels beside (not on top of) other things. Nothing is cut at the frame edges: every object and word stays
  inside the central 90 % (title-safe). The player fits the whole 16:9 frame inside a safe area clear of its buttons
  (app.js SAFE); builders must still keep the frame itself clean. Check every beat's preview for overlaps and edges.
- **The scene is never empty.** Frame 1 already shows the lesson's subject (no empty stage while things pop in).
  Atoms, molecules and props are real 3D (spheres, shells, tubes), never flat discs or cards that face the camera:
  the student must be able to turn round every object and see more of it.
- **ONE place on screen at a time.** Nothing may move in two different parts of the picture at once (the eye can only
  follow one). Never a still moment either: every second something is happening, but only in one place.
- **Cinematography: lead the eye (user 2026-10-11).** Know where the viewer is looking at every moment. A new thing
  appears WHERE the eye already is, or the eye is LED there: the camera pans/pushes toward it, or a moving thing
  (an electron, a falling lump, a glow travelling along a wire) carries the eye across. Nothing pops up in another
  corner. Cut on action (the cut happens during a movement, the movement continues in the new shot); a new shot puts
  its subject where the old shot's subject was on screen (eye-trace match).
- **Professional pacing.** Shot grammar: establish (wide, the whole setup) → medium (the action) → close-up (the key
  moment); widen again only when a NEW thing must enter (never in-out-in inside one beat). Every camera move is motivated (it follows or reveals something); slow push-in on the key
  result. Shot lengths vary with what happens (2–6 s), never one fixed rhythm; no dead air, no rushed stacking.
- **Pleasing, realistic light (user 2026-10-12, after 804 v2 "fully understood, only the art style and lighting
  don't look good yet").** The picture must look beautiful AND make the message clearer: realistic soft light, real
  shadows and bounce light (Cycles-baked lighting for everything that stands still), glass and water that look like
  glass and water. Keep our 2D effects and the thin line art (liked). Try a new look on ONE shot first (look-dev
  sheet: before / after), get the user's yes, then roll out.
- **Baked photo studio (user 2026-10-13: "use a studio HDRI, bake the lighting, complete the whole lesson").** Lab
  lessons stand on a real wooden table in a bright photo studio (HDRI studio_small_09, white curved wall behind):
  the photo's lower half is a real floor the table legs stand on (kit.photoDome), the table's light and its shadow on
  the floor are Cycles-baked per station (scripts/export_casters.py → scripts/bake_set.py → kit.bakedSet), the same
  photo lights the live glass. Never a photo behind the set like wallpaper ("floating ball"). Labels get a stronger
  halo there (K.LOOK.halo = 2). Atom / micro scenes keep the dark studio (glow needs dark).
  **Easy on the eyes (user 2026-10-13):** figure / ground: the wall stays clearly DARKER than the set (warm pool of
  light behind it, darker edges); filmic colour (ACES, exposure 0.9) not AgX (washed out); glass = studioGlass v2:
  invisible body, thin crisp dark silhouette line, sharp softbox highlights (never broad grey bands = smoky
  plastic); liquids clear and saturated (no milky white top). Light design: close warm key left, cool rim behind.
  **Build it with `K.studio({scene, R}, '<id>', {dark: (t) => …})`** first thing in build(): it sets the whole look,
  `bake(group, station, x, w, d)` puts each station's baked table (plain bench with ?look=old for export_casters),
  `dark(t)` brings the dark studio back for atom scenes. Bench labels keep one size on screen (l801 `tag()`).
  Polished metal needs its own env map (scene.environment ignores envMapIntensity, so bars go black: l801 shinyMetal).
- **ONE art style (user 2026-10-11).** Every model, material, liquid, bubble, effect and light belongs to the same
  look (chosen style in web/style/stylelab.js: one glass family for all glass and bubbles, one metal, one matte, one
  lighting rig, fog-melted studio floor). Never mix a photo-scanned model with simple procedural shapes in one shot;
  library models are re-surfaced into the house style first. Text = clean bright letters with a soft blurred dark halo (never a hard offset copy).
- **Recognizable materials.** Test every thing against the real one: ash = dull warm-grey powder heap with burnt
  black sticks glowing in their cracks and smoke, not a white blob.
- **Animation principles (always).** Ease in/out on every move (no linear slides); weight: heavy things start slow,
  land hard, settle with a small bounce or dust; light things float and flutter; anticipation before a big action,
  follow-through after; overshoot-and-settle on pops; squash/stretch on soft/bouncy things only; arcs, not straight
  lines, for thrown or dropped things; timing tells mass (a lead block falls fast and stops dead, a feather drifts).
- **Recognizable effects.** Fire = flickering layered flame shape with a bright core, rising sparks and heat shimmer, in
  the book's flame colour; water = surface with ripples and splash; gas = soft coloured wisps that drift; fizz =
  bubbles that rise and pop at the surface; explosion = flash, shock ring, sparks, smoke. Test: a child names it with
  no label. Simple glowing blobs are not allowed.
- **High-quality reusable models.** One shared asset library (beaker, flask, test tube, gas jar, trough, burner,
  metal lumps, litmus, atoms, ions, lamp, coins…) modelled once with real detail and glass/metal materials, LINKED or
  instanced into every scene (never copied); the web app loads each shared model once and reuses it. A new prop goes
  into the library, never into one film only.
- **Fast everywhere (phones, tablets, laptops, any browser).** Shared models + textures cached once; instancing for
  repeated objects; compressed geometry (Draco/meshopt) and KTX2 textures; no work while idle; one draw per material
  where possible; measure on a mid phone before calling it done.
- **Book coverage is complete.** Short lessons are good, but every book point must land somewhere: concepts in the
  film, things to memorize (tables, values, lists, equations) in a game. A per-unit checklist (docs/COVERAGE_UN.md)
  maps every point to film or game; nothing may stay unmapped.
- **UNDERSTOOD WITHOUT THE CAPTION (user review of 803, 2026-10-12: the most important test).** The eye is on the
  experiment, not on the bottom text: the student must understand every scene from the PICTURE alone. So:
  - **No bottom caption band (user 2026-10-15: "the focus is always in the 3D scene so no one reads the bottom
    text; put the text where our eyes are").** Code lessons set `capNear: true`: each caption line floats IN the
    picture as a gold line right beside the thing it talks about (4th caption item = its anchor point or (t) → point,
    the text sits just above it and follows it); a line that only repeats a label already on that spot is dropped.
    Never two texts on one spot: the caption anchor and the 3D labels are planned together, shot by shot.
  - **ONE text at a time (user 2026-10-15: "which text should I look at, the top or the bottom? I can't look at
    everything at once").** Code lessons set `oneText: true`: the engine lets the caption and the 3D labels take turns
    (each keeps the screen for its reading time, then the newer one replaces it; a replaced text never comes back).
    Letters on atoms and single signs are part of the picture; labels read together (an equation, the two names of
    one experiment, a result row) get one `userData.group`. Drop every caption that only repeats a label: the label on
    the thing says it; captions are only for the question, the bridges and claims with no thing to sit on.
    Check: `python scripts/text_check.py <id>` must print `MOMENTS WITH >1 TEXT: 0`; read its LOG=1 timeline as a
    student (does every text show long enough, in a sensible order?).
  - **Meaning sits where the eye is.** Key words are short 3D labels ON/next to the thing at the moment it matters
    ("zinc", "acid", "cathode −", "Zn²⁺"); the caption only repeats. A verdict ("metal ✓") appears on the thing it
    judges, never floating in empty space.
  - **Every object is named the moment it enters,** and must look like what it is (a zinc granule, not a "stone").
    Nothing unexplained: no "?" marks, no unlabelled spheres, no props whose reason isn't shown.
  - **A verdict word says what it is about** (user, 804: "what happens quickly?"): "reacts quickly", not "quickly";
    every label is a tiny full phrase with its verb.
  - **Formulas are explained three ways, stacked** (user, 804: "I don't understand the formulas"): plain WORDS first
    (they fly up from the things), then ATOMS as small balls over each word that really swap partners (the student
    counts them: that is what the big numbers mean), then the SYMBOLS between balls and words ("2Li" over the 2
    lithium balls). Next sample = same board, only the metal balls/words/symbols swap and the reaction replays
    (`kit.reactionBoard`). Never symbols alone.
  - **Formulas are BUILT from the objects, never shown bare.** Each symbol first appears on its thing (Zn on the
    granule, HCl on the acid, H₂ on the bubbles, ZnCl₂ in the solution), then the symbols slide together into the
    equation. If a student can't point at what each symbol is, the formula is not allowed yet.
  - **Particles (ions, electrons) must be tied to where they came from** (show them leaving the zinc / splitting from
    ZnCl₂, labelled) and WHY they move (the − pole pulls the + ions). Coloured balls with no story mean nothing.
  - **Abstract things need their context first.** A periodic-table column is meaningless alone: show the whole table,
    then pick out the group. An indicator needs its meaning (red litmus → blue = alkali, labelled on the strip).
  - **A figure from the book is not a story.** Unrelated props side by side (a metal lump next to bananas, metals in
    sealed tubes) confuse unless each one's point is shown: sodium is so soft a knife cuts it (close, bright fresh
    cut); Rb/Cs are sealed in glass because they react with air (show it: a bit of air reaches the metal → it
    tarnishes/burns). If the point can't be shown clearly, leave the prop out (cover the fact in the game).
- **Physically believable, always.** Things rest ON something and touch what they act on: a sample in a circuit
  bridges BOTH clips (a lump hovering between clips can't carry or block current); wood lies on the dish and the ash
  grows where the wood burns away (not wood floating while ash rises from below). Effects look like the real thing
  (water ripples are faint and small, not big glass hoops). Ask: "would this happen on a real lab bench?"
- **Camera: one clear move per beat.** No in-out-in pumping. Each beat has at most ONE push-in, toward its key
  moment, and the camera never reverses direction inside a beat. Transitions between beats are one smooth move.
  Never zoom close onto a simple prop that doesn't hold up close (low detail, flat material).
- **Micro ↔ macro transitions must keep ONE object continuous and centred** (the crystal we leave is the same one,
  same place on screen, we arrive at; it stays labelled), and should be slow enough to follow. A zoom out that jumps
  to an unrelated-looking pile is confusing.
- **No overlapping surfaces, check every vessel:** a liquid's bottom must not sit on the vessel's inner floor, two
  panes must not meet face to face, layers (litmus colours, labels on tiles) need a real gap. Look for flicker at the
  bases of beakers, troughs and jars in every preview.
- **Keep what works:** the 803 atom close-ups (K 2,8,8,1, the gold electron leaving, going to Cl) and the falling-
  lump animation were praised: that is the standard for clarity and motion.
- **No childish extras** (mascots, cartoon guides, gimmicks: user rejected). Fun = serious, beautiful, real-looking
  science with sound effects and great motion; lessons should feel deep, not simple.
- **Text: as little as possible, and it should feel good.** Only topic words, short; modern, warm, confident tone
  (it should feel new and reassuring), never textbook-dry. Same for the whole theme.
- **Big text, always.** Letters at least ~5 % of the picture height (hud body ≥ 0.045, headline ≥ 0.056; world
  labels sized so they read the same from the camera). No small dim footnotes. Wrap long lines instead of shrinking.
  MCQ films use `lib.mcq_card()` (big, wrapped, stacked). The player (`app.js boostText`) enlarges any text that is
  still small, but build it big from the start.
- **Pictures must make physical sense to a child.** Every atom/orbital picture shows its nucleus. A sub-shell is the area the
  electron's laps fill (book p.49), shown by its glowing trail.
  Flat shapes stay face-on (edge-on they look like ∞ signs). Avoid symbols a child can't read as a real thing.
- **"I don't understand" means EXPLAIN, never bend the science.** Keep the correct (book) picture and add a short
  build-up shot that answers the confusion (e.g. sub-shells: Bohr laps that slowly tilt and fill a ball).
  Build every new idea FROM what the student already saw (e.g. clouds grow out of the Bohr rings); a new picture
  with no link to the old one (or an unrelated analogy like a plucked string) confuses more. Check the science before changing
  any diagram the user questions.
- **Look:** dark studio, glowing blue electrons with comet trails, red protons, grey neutrons, gold titles, white
  labels (clean letters, soft dark halo so they read on any background), labels pop in one at a time, soft bloom.
- **Book values as printed** (exam answers); real values + book mistakes go to `docs/NOTES.md`.
- **Exercise = games** (MCQs also get a short film in the film-12/313 layout). Every short/long question should be
  covered by a film or a game ("covers" line on each game card).
- **Games:** hands-on 3D (tap/drag things), no side-panel text, one slim bottom goal line (`kit.goalBar`) with as few
  words as possible; no text hints; highlights subtle (no gold rings, no bright bands); after a right answer the 3D
  scene shows WHY. Wrong = shake + buzz.
- **Games run easy → hard across the whole game AND inside each part.** First part = 🔍 Explore: tap around, nothing
  is wrong, every tap shows what the thing is (the student meets EVERYTHING before any test). Then parts in order of
  difficulty. Beginner rounds give a gentle VISUAL hint when the student is stuck for a few seconds (e.g. the row
  lights, later the column); later rounds give no hints. No countdowns while learning (if a timer is used before the
  end it is ≥ 20 s, `rounds.js` enforces it); a last ⚡ Speed part may use 10 s per round (`g.timer(10, f, true)`),
  once everything is known. After a right answer go straight on (≈ 0.5 s, a soft sound, no confetti). After 3 wrong tries the
  answer shows itself (green) and the game moves on (counts as not first try; `g.reveal(f)` / timer onOut).
- **Games must be exciting (2026-10-11, very important).** Memorize/sort games run with the arcade layer
  (`runGame({ excite: true })`, arcade.js): score × streak, ⚡ fast bonus, a climbing ding, LEVEL UP by itself when a
  pass is ≥ 90 % right and quick (a checkbox per level turns it off), a timed session (5 min default) ending on a
  results card with a personal best. All of it is non-blocking: the next question still comes at once.
- **Otherwise the student chooses when it gets harder.** No celebration and no pop-ups: a finished level simply starts again
  (practice) and a "Next level →" button waits at the top right; only that button moves on (rounds.js `part.steps`,
  default halves). Levels are long (≈ 10 questions). Answer options are ALWAYS in random order (also models and bins).
- **Big things to memorize are learned in chunks** (e.g. the periodic table: periods 1-3, period 4, main groups,
  transition + f rows). Each chunk opens with a LOOK (everything shown, the student hides it to start), a short
  automatic look again halfway (a rest), learned chunks stay visible but faint. A right answer shows what the thing
  BELONGS to in the book's terms (e.g. its family with its members), not just coordinates. Keep the KINDS visible
  while learning (periodic table: tiles keep their category colour even when hidden, with a small colour key).
- **MEMORIZE = GAME (very important, every chapter, even if the user doesn't point it out).** Any part of the book a
  student would otherwise learn by heart (tables like Table 2.1 particle charges/masses, symbols and names, shell and
  sub-shell capacities, filling order, isotope tables and abundances, lists of uses, group/period names, trends,
  who-discovered-what) MUST get a game where it is learned by playing: match, sort, build, order, "which is bigger",
  spot-the-mistake, speed rounds. A film alone is never enough for memorized content.
- **Technical or boring lessons → games too** (e.g. writing electronic configurations, lists of uses): the film shows
  it once; the game makes the student FLUENT (many short rounds, easy → harder → tricky traps such as 4s before 3d,
  then a timed round). Plan games per chapter by scanning every page for: tables, lists, rules with exceptions,
  numbers to recall, procedures to practise.
- **Every rule with an exception is shown visually AND in a game** (4s below 3d on the energy stairs; the 19th
  electron goes to 4s). Energy must be visible in the picture itself (higher = more energy), not only told.
- **Motion is always continuous and calm** (things glide, never pop out of nothing), and follows the book's own
  words; if the book gives no path, use the simplest picture that fits its words (laps round the nucleus), not
  modern-physics ideas the book doesn't teach.
- **Modify, don't rewrite:** when asked to change something the user likes, change only that. Bigger new mechanics:
  describe in 1–2 sentences and ask first.
- Keep docs short; save session usage (concise reports, no long recaps).

## 2. Pipeline (one chapter = unit N, film ids N01…)
1. Save book photos to `assets/book_uN/` (`pXX-YY.jpg`). Read every page; write `docs/STORYBOARD_UN.md` (table: film,
   pages, what the picture does) and plan the games (which questions each covers).
2. `scripts/p2/films.py`: add the chapter to `CHAPTERS` + `CHAPTER_INFO` (pages, one-line blurb, icon) and the films
   to `FILMS` (`unit_of` maps 3-digit ids to `u<first digit>`).
3. Builders in `scripts/uN/`: a `uNlib.py` (extends `scripts/u3/u3lib.py`: `shot()`, `caps()`, `big()`, `vatom()`,
   `Table`, `ebar()`, `halo()`, `energy_wave()`) and one `fN0K_*.py` per film:
   `python scripts/bsend.py scripts/common.py scripts/p2/lib.py scripts/u3/u3lib.py [scripts/uN/uNlib.py] scripts/uN/fNNN_x.py`
   (Blender must be open with BlenderMCP on :9876; each builder rebuilds its own scene and saves the .blend).
4. Preview every film: `python scripts/p2/preview.py "<scene>" <frames…> --pct 30 --out uNNN` → look at
   `renders/p2/uNNN_sheet.jpg` (frame = 1 + 30·seconds). Fix framing before moving on.
5. Games: `web/games/<id>.js`, registered in `web/games/main.js` `GAMES` with `unit: N`; MCQ quiz = data + demos
   using `quiz.js runQuiz`; memorize games use `rounds.js runGame` (parts = tabs, rounds with dots, `g.right/miss`, `g.timer`; answer tiles above y ≈ -1.8 so the goal bar never covers them; test at iPad aspect); shared pieces `u3data.js`, `table3d.js`, `atom.js`, `kit.js`. Test headless:
   `python scripts/test_games.py "games.html?game=<id>@@<js>"` (+ `--portrait`) → `renders/games/sheet.jpg`.
6. Export: `python scripts/rebuild_ipad.py <ids…>` (GLB + USDZ + `build_pwa.py`), then `python scripts/test_offline.py`.
7. Docs: STATUS.md section, NOTES.md book errors, IPAD_APP_GUIDE.md, this skill's log.

## 3. Gotchas (learned the hard way)
- Never re-run `scripts/01_setup.py` (wipes the file). Animate transforms only (no material/bevel animation).
- HUD text = direct child of a camera; world labels have no parent; Unicode super/subscripts; ✓ ✗ (not ✔ ✘ ∝).
- `mat_emit` reuses a material by name: a new colour needs a new name.
- Keys at the same frame overwrite; use a CONSTANT hold key to stop BEZIER drift between moves.
- Scaling an electron scales its trail: use `halo()`. `lib.sphere(r)` sets r by scale: pop with `appear(s=(r,)*3)`.
- `view_layer.update()` (every `Table()`) re-evaluates animation: read scales/locations before it, or guard (see
  `Table.pulse`).
- In u3/uN builders never assign a global `P` (u3lib's tile pitch) — `stations()` results go to `PS, R, CAM`.
- Bash heredocs through the tool mangle `\n` and quotes: write patches with the Write/Edit tools or `chr(92)`.
- Stations sit far apart on X (40+ units) so other shots never leak into a frame.
- Lib has one-letter functions `N()` and `C()`: never name a global N, C, P or T in a builder.
- A pop-in and pop-out less than ~1 s apart can leave an object stuck visible: keep them well apart.
- `electron(r)` stores r in the scale: pop it in with `appear(e, f, s=tuple(e.scale))`.
- rebuild_ipad runs Blender copies in parallel; "FAILED" from the Poliigon add-on config race: re-run those ids.
- Sort-into-bins shots (Activities, Test Yourself tables) read well: cards drop one by one into dark bins.
- Font has no ∝ or ⇌: write words or ↔. Material names are global across scenes ("Mercury" was film 01's
  texture): pick unique names (e.g. "Mercury U5").
- Framing: lowering a shot's target z moves the subject UP on screen; the caption covers the bottom ~1.8 units.
- `re.sub` replacement strings turn backslash-n into a real newline: use a lambda; write files with newline='
'.
- Games: gas3d.js `Molecules` (box bounce, or `seats` to shake in place) covers any particle picture.
- Patch scripts: order the replacements so an earlier one can't eat a later one's text; assert each old string.
- lib.cyl(r1, r2): r1 is the BOTTOM radius (a funnel is cyl(0.15, 1.2, …)); lib.arrow points along local +X.
- `mat_pbr` reuses by name too: to change alpha or colour, give the material a new name ("Tarnish Dark U7").
- Cells: put plate labels in the gap between the tank rim and the bulb/battery, or outside the tank; below the
  tank they hit the caption.
- Game tag classes: big, huge, gold, red, green, blue (there is no cyan).
- Bench labels sized as a share of the picture HEIGHT (`tag()`) overflow upright phones: shrink them by
  `min(1, (cam.aspect / 1.5) ** 0.7)` (l801, l807). test_offline.py can time out when the PC is busy: rerun it.
- Player changes: test while PLAYING (`@@document.getElementById('playBtn').click()##6` in test_games), not only
  stills. three.js only rewrites an animated value when it changes, so per-frame scale tweaks compound (text grew
  every frame). Change geometry once instead.
- Glowing THREE.Points that fade: use additive blending that leaves the canvas alpha alone (cloud3d.js glowPoints);
  plain AdditiveBlending paints black specks over the CSS backdrop as dots fade.
- Every game round must make sense to someone who has not seen the film: show the thing first (the moving electron, its
  trail), then ask in plain words. Bare targets with no context = "I don't understand".
- Check simulated results really teach the truth (run the round, read the counts): a net around the nucleus once
  caught more than the lobe net because it was too big. Count only inside what the player sees.
- Code lessons: the app player runs every beat once with t < 0 before the clock starts (shot_lesson seeks t ≥ 0, so
  sheets hide it): helpers must accept negative t (kit.pulses crashed 814 in the app). Test with index.html?film=<id>.
- Patch scripts: never append a `// comment` to a line that has more code after it (kit lines are long one-liners: the
  comment silently disables the rest of the line).
- test_offline stuck at "saving 99 %" = a file changed after build_pwa (often ANOTHER session working on web/):
  wait until web/ has been quiet ~5 min, then build_pwa → test → publish (never publish their half-done files).
- C: drive is nearly full: run exports with `TEMP`/`TMP` set to `D:/_Asawera art/tmp` (else USDZ/GLB fail with
  "No space left" / "Couldn't move usdz").

## 4. Code lessons (web/lesson/: the way every lesson is built now)
Files: `engine.js` (player), `kit.js` (house-style models, motion, labels), `l<id>.js` (one lesson). Preview:
`python scripts/shot_lesson.py <id> <seconds…>`. app.js `CODE_LESSONS` sends the film id to the code lesson.

**A. Write the beat sheet BEFORE any code** (in the lesson's header comment or docs/COVERAGE_UN.md), one row per beat:
what is on screen · what the student concludes · why the next beat follows · the question a student would ask and
where the SCREEN answers it. Check the logic, not just the look:
- **Story spine first.** Take the argument from the book's own words and order (read the page again; e.g. p.222 box:
  conductance test, then "the" electrolysis test: dissolve in acid → + ions go to the − pole → metal). Write ONE
  sentence per act that answers "so what?", and say it on screen at every act boundary as a question/answer bridge
  ("So metals give electrons away. Who does it best?" → group IA … "Why so fast? Look inside" … "That's why they are
  never found free"). End on the point of the whole lesson, not on the last fact.
- **Plain words.** Captions use words a 14-year-old already knows; the book term goes in brackets or a small label
  ("easy to pull off (low ionization energy)", "oxygen (group VIA)" as a 3D label). Never two new terms in one caption.
- **Few formula boards (817 v1: "I don't understand when looking at the video").** At most ~3 boards in a lesson,
  each right after the real thing it describes; every other equation goes to the game. A claim ("HF is a liquid",
  "less ionic", "reducing agent") is shown on a thing or left to the game, never only written. No frame with only
  words on an empty floor.
- **No random events (817 v3).** A dark atom close-up exists only as a push INTO the substance just made on the bench
  (the white KI powder → K⁺ I⁻; the orange tube → Br₂), and returns to the bench. Never a separate dark stage of balls
  between experiments; at most one bright → dark → bright trip per act. Every experiment is the full §1 pattern
  (question → named before, held → visible cause → result ✓ ON the thing with its verb, held); a 0.5 s effect is not
  seen: a bang = flash + jolt + lid flying + smoke, ~1.5 s, close.
- **Gas looks like gas (817 v3: jars read as "juice").** Faint tint + slow drifting wisps, no solid coloured cylinder;
  a colourless gas (hydrogen) gets its label on the jar and is shown by what it does.
- **One thing at a time.** A formula is built token by token (each name leaves its object and becomes its symbol);
  few molecules (3, not 6) and a close-up on ONE of them, alone in frame, when the key change happens (electrons hop).
- every test shows its comparison (metal lights the bulb AND non-metal doesn't), every verdict shows its proof on screen
  (zinc gives 2 electrons → Zn²⁺ moves to the − pole and glows → "metal ✓");
- every prop enters when it is needed and for a visible reason (the battery rig is lowered in when it is used, not
  standing there from frame 1); no shared hidden wiring between two set-ups;
- keep the same object across scenes (if the water test uses sodium, say why we now look inside potassium);
- a sign/charge/name appears only when it is true (K gets + only after its electron left);
- a claim word (electropositive, mono-positive, 2.4 %) gets a picture (19 + / 18 −, 24 glowing grains in 1000).

**B. Build rules**
- Frame every shot with `S(t, look, w, h, dir)` (fits a w × h subject for 16:9 AND iPad); never guess camera
  positions. The subject + its labels fit inside; neighbours are whole or out of frame.
- Nothing appears from nowhere: a new thing is born from something on screen (ZnCl₂ forms on the zinc; a table tile
  flies down and becomes its sample; an atom shrinks into its ion ball) or moves in from outside the frame.
- Transitions: ≤ ~2 s of travel with something in frame the whole way. Micro↔macro = one continuous push: into the
  object until its surface fills the screen (camera key ease 'in'), cut on the motion to a matching picture (a wall
  of grey atoms), keep pushing and settle (ease 'out'). Never a fade.
- Labels: `kit.label` draws on top of everything; size for the shot (≥ ~5 % of frame height), never on another label,
  never on a rod/wire; the label sits ON its thing.
- Every second something moves; no still > 2 s, also at the end.
- Models must read as the real thing to a stranger. Bad examples already made: flat grey square for "crystal", smooth
  potato for "mineral", lantern-like ampoule for "lab", big glass hoops for ripples, a pancake for sulphur, a red box
  for litmus paper (now `kit.paperStrip`: thin, curled across, paper grain, hung over a rim, colour soaks up).
- **No light hacks.** Never an emissive face or a glow sprite to fake "shiny". Use a real material (polished:
  MeshPhysical clearcoat, low roughness; a full mirror in our dark studio just looks dark) and, for style, 2D twinkle
  stars (`kit.sparkle`). Glow only for things that really emit (bulb, electrons, flame).
- **No two faces in one plane, anywhere** (flicker). Not just the example the user showed: every model. Caps meet caps
  (battery band vs body top, prism vs tip), walls meet floors (tank, box), heaps meet dishes, two halves before a cut
  (use one whole mesh until the cut), coincident particles. Inset by ≥ 2 mm or leave the cap off (openEnded).
- **Label swaps never overlap**: the old name is fully gone (pop-out 0.3 s) before the new one pops in (Cl → Cl⁻).
- **Praised = locked.** When the user praises an animation, mark its code `LOCKED` with the date and never rewrite it;
  later changes go around it (backups/l<id>_v<n>.js keep the old code).
- Captions stay in their own strip; on-screen 3D labels get the soft halo from `kit.label`.
- **Reuse the kit** (web/lesson/kit.js): `equation(scene, {slots, starts, src, away})` builds a formula from the
  labels on the objects and, for the next sample, swaps only the tokens that change ("same pattern"); `tank`,
  `burner`, `spoon`, `gasJar`, `tongs`, `tripod`, `dish`, `bench`, `paperStrip`, `sparkle`, `vial`, `lump`, `splash`, `bubbles`, `makeFire`. A new prop
  goes into the kit, not into one lesson.
- **Comparison lessons** (user rejected 804 v1; 804 v2 layout praised "fully understood" 2026-10-12: keep it): the student must SEE the comparison,
  not remember it. Put the samples side by side in ONE frame (three small beakers, not one long tank), start them
  one after another so the eye follows, let the earlier ones keep going gently, then end each test on all three
  results together with a visible ranking (1 · 2 · 3 on the things). No tray travelling through every shot, no
  foreground props at the frame edges.
- **Every substance has its own look** (user: "materials all the same, can't tell the liquids"): water = clear
  blue with a bright surface line, oil/kerosene = amber, chlorine = strong yellow-green, products = bright white,
  metals = shiny silver; glass is only an edge; the floor is darker and warmer than any liquid. Test: blur the
  frame; every substance must still be a different colour from its neighbours and from the floor.
- **The action is the picture.** At every key moment the reacting thing fills about half the frame height, the
  camera is steady (still, or a slow push-in), and nothing else moves. A tiny fizz inside a big set-up is not a shot.
- **Camera from a good height.** Slightly above, looking down ~20–30° onto the bench, so liquids show their surface
  and things don't stand in front of each other. No sideways slides through the set; few, long, calm shots.

**C. The check before showing the user (mandatory, every version)**
0. `python scripts/zcheck_lesson.py <id> <every ~3 s, plus each cut/splash/build moment>` must print `FLICKER RISKS: 0`
   (finds faces sharing a plane in the live scene; fix the model in kit.js so every lesson gets the fix).
1. `SEEK=1 W=1180 H=820 SHEET=dense<k>.jpg python scripts/shot_lesson.py <id> <every 1.5 s…>` over the WHOLE lesson.
2. Look at every frame and describe it literally, as a student who never saw the code ("a grey square", not "the KCl
   crystal"). List: empty or half-empty frames, things cut at the edges, things appearing from nowhere, labels not
   on their thing / hidden / overlapping, captions that don't match the picture, holds > 2 s, logic jumps,
   things that don't look like what they are.
3. Read the captions alone, top to bottom: do they tell the whole argument and end on its point? If a student
   would ask "but why are we doing this?", add the bridge line.
4. Fix, re-shoot the changed part, repeat until a full pass finds nothing. Only then show the user.
5. **Quality, not only errors** (steps 0–4 only catch mistakes). Write the pass/fail WHILE LOOKING at the sheet and
   give the frame times for each rule; a ✓ with no frame time doesn't count. Go through EVERY rule of §1 (taste) one by one
   against the sheet and write pass/fail for each (cinematography, pacing, animation principles, art style,
   recognizable materials and effects, …); 804 v1 broke several that were already written here. Then put the new lesson's sheet next to 803's: is
   every key moment as big, clear and good-looking? Could a student explain each test in one sentence from the
   pictures alone? Are the substances different colours? If not, redesign; don't polish.

## Refinement log (newest last; one line each)
- 2026-10-08 v3 layout adopted ("too complicated and disorganized").
- 2026-10-08 Games must not instruct; subtle highlights only; no side text.
- 2026-10-08 Modify, don't rewrite (Energy Stairs rewrite was rejected).
- 2026-10-08 No bare equations: picture → words → symbols.
- 2026-10-08 Each unit is its own chapter (tabs in Topics + games hub); home page lists chapters (web/home.html).
- 2026-10-09 Unit 4 built the same way (15 films, 4 games); chapters home page added; this skill created.
- 2026-10-09 Unit 5 built the same way (15 films, 4 games: quiz, gas law lab, state sorter, why lab).
- 2026-10-09 Unit 6 built the same way (17 films, 4 games: quiz, molarity lab, mixture sorter, solution lab).
- 2026-10-09 Unit 7 built the same way (19 films, 4 games: quiz, oxidation number lab, redox detective, cell lab).
- 2026-10-09 "Text extremely small": big-text rule + player auto-grows small text (all films); MCQ cards rebuilt big.
- 2026-10-09 Orbital lobes "infinity logos" crossing the nucleus confused the user: show the nucleus, gap around it, face-on.
- 2026-10-09 Text flickered and grew toward the camera during playback (my per-frame scale bug): fixed; test playback.
- 2026-10-09 User wants memorization turned into mini-games (tables, symbols, scales): play, don't memorize.
- 2026-10-09 Orbital gap was WRONG science (lobes do meet at the nucleus): reverted; added 3 explaining shots in film 05.
- 2026-10-09 Clouds looked random vs "fixed shells": rebuilt from Bohr ring → dots crowd at the shell → p lobes in shell 2 → outline = book shape. String analogy dropped.
- 2026-10-09 "Goes against Bohr?": say it plainly (Bohr right about energy levels, wrong about the fixed path); added game Electron Camera (cloud.js) so the idea is played, not memorized.
- 2026-10-09 User's one rule: faithful to the book; extras only for the book's confusing parts. Clouds act rebuilt (6 shots, 52 s); Electron Camera +3 'which shell' rounds.
- 2026-10-09 Electron Camera → 4 parts (Live atom 3D, Snap, Catch 3D, Turn 3D), harder each round; film 05: 'always moving, not on a planet track'.
- 2026-10-09 Catch round confusing (bare balls): now the cloud shows first, gold nets, 'Which net will catch the most snapshots?'; hints fade by round.
- 2026-10-09 "Do electrons really pop up?": each dot = one measurement; nobody can watch it in between (film 05 + Live atom say so).
- 2026-10-09 "Why are you popping electrons? Not faithful, too hard": removed all snapshot/measurement/'Bohr was wrong' material. Game renamed Electron Trails (✨ Trail tab); the electron glides and its trail fills the area.
- 2026-10-09 "Does it move randomly and overlap the nucleus?": random scribble replaced by calm laps round the nucleus (cloud3d.js laps(), film 05 class Laps); lobes switch by passing close by the side of the nucleus.
- 2026-10-09 "Still extremely overwhelming, visually cluttered, didn't help": Electron Trails cut to 3 calm parts (Look / Which shell? / Which shape?), smooth book shapes + ONE electron with a short comet tail; no dot clouds, percentages, nets. Rule: one idea per screen, few objects, show before asking.
- 2026-10-09 "Lessons are confusing, text not visuals, cheap, multiple things at once; update ALL lessons, not one": v4 'show, don't tell' rule; only film 02 had ever got v3. Rebuilding every film: Unit 2 film 04 onwards first (user: "chapter 2, lesson 4 and afterwards").
- 2026-10-09 v4 applied to Unit 2 films 04-12 in one pass. MCQ pattern: card + 4 s + green answer, then the card LEAVES and the model fills the screen with one 'why' line (never card + paragraph + model together). Long-text films (uses, key points): keep the models, cut paragraphs to one line, one close camera per item.
- 2026-10-09 "Memorization parts always become games" (Table 2.1, Aufbau, isotopes, uses, lesson 7 too technical): rule MEMORIZE = GAME; shared web/games/rounds.js; Unit 2 got 6 such games, Unit 3 got 4 (symbols, families, metals, trends). Film 04 shows energy as height (stadium + ruler).
- 2026-10-09 "Navigation very hard, panning doesn't work, Films button on the other side": film view keeps your turn/zoom across camera cuts (pan restarts), pan range 0.6, mouse right/middle/shift-drag pans; games bar = ⌂ · 🎬 Films · ← Games (same place as 🎮 Games in the films).
- 2026-10-09 Film 04: "camera angle not right, too bright looking down, show electron energy, don't drop lesson content": lower closer camera, matte steps, sparks into the climbing electron + outer electrons glow more; restored every p.48 point (energy levels, n = 1-5, K nearest/least energy, configuration definition, Table 2.2 with 2n²). Rule: a simpler rebuild must keep every book point of the old film (diff the old captions first).
- 2026-10-09 Table Builder liked: "celebration too long, 10 s too short for hard levels, explore everything first, hints for beginners when stuck, 10 s only once it is all known": rounds.js celebration ≈ 1 s, timers ≥ 20 s (exact 10 s only in a final ⚡ Speed part), parts easy → hard with 🔍 Explore first; beginner hints after a few seconds. Table Builder grew to 9 parts (Explore, Symbols, Numbers, Periods, Place, Build, Missing, History, Speed).
- 2026-10-09 "When it's time to increase the difficulty, bring a menu so they enter the next level themselves, or stay and practise": rounds.js stepMenu at part.steps (all memorize games).
- 2026-10-09 Place (Table Builder): "learn in chunks, show the table first and let me hide it, reveal it again for a rest, highlight the family instead of row/column": 4 chunks × 6 with peeks; family glow on a right tap.
- 2026-10-09 "Move on as soon as it's right; reveal after 3–4 failed tries; show the kinds (metals, gases …) while learning the chunks": right → 0.5 s; 3 wrong → auto-reveal (rounds.js GIVE_UP); Place tiles keep category colours + key.
- 2026-10-09 "Options random, sessions a bit longer, no celebration, only a Next button": all options shuffled; Table Builder 157 rounds (levels of ~10); finished level repeats with a waiting 'Next level →' (no modal, no confetti).
- 2026-10-09 Place 'not helping to practise': memorize games reveal only a FEW new items per level (meet → ask each → one more look → ask again + 2 old ones); unlearned = blank grey, no kind colours/key; dots show only the current level.
- 2026-10-09 'Next question instantly; show their hand getting better': no wait after a right answer; typing-test stats chip in every rounds game (accuracy %, s per answer, little line per finished pass, green when better).
- 2026-10-09 Level end must not stop the game (practice continues, intro not repeated; Next button appears); let the right-answer animation play (~0.6 s); stats change only when a pass ends; new items come in a window with names + 'Go'; mid-session look is a checkbox.
- 2026-10-09 'Select instantly, only the tapped option's animation completes': next question loads at once; the tapped object becomes a ghost (rounds.js ghost(): keeps its tweens, lifts, fades 0.7 s) over the new round.
- 2026-10-09 'No way to resume or pick a level': rounds games reopen where the student left off (games.resume.<id>) and a 'Level n of N ▾' chip opens a level window (best accuracy on finished levels).
- 2026-10-10 "Apply the fine-tuned skill to chapter 4 and beyond": Units 4–7 games moved to rounds.js (levels, instant next, ghost, stats, resume; first level shows the aid, labs tap-to-go-on); all films 401–719 got v4 one-line captions, no Next cards, MCQ films in the film-12 pattern.
- 2026-10-11 "Brief wait after animations, can't orbit every part, don't name the next topic, empty start screen, want video controls": holds ≤ 1 s + player speeds through stills; orbit centre = middle of the shot (topic films had (0,0,0)); start/end cards; tap/double-tap video gestures. Every film must be checked page by page for missing points (short is fine).
- 2026-10-11 "Table Builder isn't fun anymore; excitement is very important": arcade.js (score × streak, ⚡ fast bonus, LEVEL UP by itself when fast + accurate with a per-level off checkbox, timed session → results card). Non-blocking only; turned on for Table Builder and all Unit 8 games. Unit 8 page check → docs/COVERAGE_U8.md (template for the other units).
- 2026-10-11 "Models more basic and hard to understand, no animation rules (heavy doesn't feel heavy), fire not recognizable, start card distracting, still waits and two things at once, want minimal modern player and emotional minimal text, optimized reusable high-quality models, nothing from the book missing": rules above (player minimal, one place at a time, animation principles, recognizable effects, shared asset library, speed, coverage map, text tone).
- 2026-10-11 "Mascot ideas childish, lessons too simple; orbit can't go round objects (they are flat/billboards); Practise opens the gallery; scene empty at the start; text overlaps / things cut at edges": no mascots; real 3D objects; Practise opens the lesson's own game (films.py FILM_GAME); player starts at the first non-empty frame; safe-area framing; clean-frame rule. Audio narration paused (Kokoro rejected); reusable sound effects wanted.
- 2026-10-11 "You don't follow my prompts: empty start, fire not realistic, 2D text over 3D": verify each complaint on the user's own screenshot/setup before calling it fixed. Player now fits each shot clear of captions (shotFit) and swaps cone flames for web/fx.js fire; v5 pilot 803 (v5lib.py) built for approval before rolling out.
- 2026-10-11 "Text shadow fake; animation amateur; pacing unprofessional; no eye-trace; ash not ash; beaker/water/bubbles in different art styles (one style, maybe a game engine)": shadows removed in the player; rules lead-the-eye, pacing, ONE art style, recognizable materials; style lab web/style/ with two house-style candidates (A soft studio, B illustrated) for the user to choose before any more rebuilding.
- 2026-10-11 "Work on ONE lesson only until it is perfect, write everything here, then use this skill for the rest" + "style your choice, just the same for everything" + "Unity or Godot": pilot = 803 only; house style = A soft studio for every model/material/light; engine = Unity 6 (already installed). No rollout until the user approves the pilot.
- 2026-10-11 "This look is good, no game engine needed if we reach it; app too big; free website in balance; apps depend on the website": stay three.js (supersedes Unity line above). Every export is slimmed by scripts/slim_models.py (in rebuild_ipad.py): 549 → 116 MB, picture identical. Plan in docs/PRODUCT_PLAN.md.
- 2026-10-11 House style = the style-lab picture the user liked: web/house.js (player side, so Blender + library models end up alike): all glass → one clear rim-lit glass, liquids → tinted see-through, solids → soft key/cool rim light + thin dark outline, glowing things unchanged, electron shells faint without shine. On for 803 only (HOUSE set) until approved; `?house` tests any lesson.
- 2026-10-11 "I don't like it (the 803 house-style patch); I already listed every mistake": stop patching exported films. Lesson 803 rebuilt as CODE in the house style (web/lesson/: engine.js = video player + light rig, kit.js = shared house-style models/effects/motion, l803.js = the lesson). Rules it encodes: one lab bench, camera travels station to station led by a moving thing; the 3D picture ends ABOVE the caption band (text can never cover 3D); every move eased, drops use gravity + bounce, splash on impact, anticipation before lifts; organic shapes use merged (smooth) geometry. app.js CODE_LESSONS hands 803 to it. Preview: python scripts/shot_lesson.py 803 <seconds…>.
- 2026-10-12 "Too short, worried things are missing; sliding sideways scene to scene breaks immersion and gets confusing; overlapping polygons flicker; the story isn't immersive, later we forget why each scene exists, can't connect the dots": (1) STORY SPINE: a lesson is one story with a question at the start and a cause → effect chain; every scene answers the question the previous scene raised, and the next question is visible on screen before we go there. One recurring hero thread (e.g. the alkali metal's lone outer electron) ties every scene together. (2) Prefer transitions that are journeys INTO / OUT OF things (dive into the metal to see its atom, pull out of the KCl crystal into the salt deposit); a sideways move is fine when the story needs it (following something that travels), just not as the only way to change scene. Don't over-apply user feedback literally: apply its intent with judgement. (3) The end returns to the opening picture and shows how everything connects. (4) Read the book photo line by line before building; every sentence, equation and figure object gets a moment, or (if its point can't be shown clearly) goes to the game. (5) No two surfaces in the same place (z-fighting flicker): offset or open-end overlapping parts.
- 2026-10-12 "Length doesn't matter, but cover EVERYTHING in the topic, smartly; things to memorize go to the games": film = every idea/sentence/figure of the pages; memorize-only items (e.g. Fig. 8.1 atomic numbers and masses) are listed for the lesson's game in docs/COVERAGE_UN.md.
- 2026-10-12 803 review (10 screenshots): flicker at beaker base; formula + "stone into water" not understood; camera in-out-in; "metal ✓" and particles not understood (eye was on the experiment, not the caption); sulphur hovering between clips; IA column alone meaningless; Fig. 8.1 props (lump + bananas, tubes, "?") confusing; ash: wood floating, ash from below; zoom-outs confusing. Praised: atom scenes, the falling-lump animation. → new rules "UNDERSTOOD WITHOUT THE CAPTION", "Physically believable", "one clear camera move per beat", "micro↔macro continuity", "check every vessel for overlaps".
- 2026-10-12 803 v8 "a lot better, but some shots still not good, not perfect": SELF-REVIEW before showing: shoot a sheet every ~3 s of the whole lesson and fix: (1) no empty frame while the camera travels: a dive's target must be in or next to the current shot (put a sample there), never fly across the set; (2) labels readable on a phone: ≥ ~5 % of frame height (wide shots need 0.18–0.24 units); never on top of a rod/wire/other label; titles must be inside the frame; (3) the subject fills the frame (whole periodic table edge to edge, a row of samples shows 2–3 whole objects, never half objects at the edges); (4) assembling things (crystals) build in a readable order (layer by layer, falling into place), not a swarm from everywhere; (5) old objects leave before new ones arrive in the same space.
- 2026-10-12 "You still haven't checked what you created": my checks were from memory of the code, at 16:9, every ~3 s. Real check = `SEEK=1 W=1180 H=820 SHEET=denseN.jpg python scripts/shot_lesson.py <id> <every 1.5 s>` (iPad size, whole lesson), then describe each frame LITERALLY ("a grey square", not "the KCl crystal") as a student who never saw the code, and list: empty/cut frames, dead holds > 2 s, things appearing from nowhere, labels not on their thing, captions not matching the picture, logic jumps.
- 2026-10-12 "Update the skill so these mistakes never happen; fix them all; the zoom into the atom is still a lazy fade": new §4 Code lessons (beat sheet with logic checks before code, S() framing, nothing from nowhere, push-through cut instead of fades, literal frame-by-frame check at iPad size before showing). Contradictions removed (close-ups, caption length, holds, in-out).
- 2026-10-12 "Light inside the sodium; ZnCl₂ crowded, formula all at once; metal argument unclear; text unreadable; battery top flickers (you only fixed my example); litmus not paper; detach worse than the praised first one; Cl/Cl⁻ overlap; hard words; crystal confusing; no overall point": root causes were missing RULES, not effort: no automatic flicker scan (now zcheck, step C0), hacks allowed (no-light-hacks rule), story taken from my memory not the book's argument (story spine + bridges), "no shadows" rule hurt legibility (soft halo), praised work not locked, no plain-words rule, label swaps unchecked, frames checked but not the meaning of the whole (caption read-through, C3). 803 v10 rebuilt with all of it.
- 2026-10-12 "Much better. Can the skill make this quality by itself? Try the next lecture": 804 built only from this file (book page read first, story spine, beat sheet in the header, zcheck, dense iPad check). New lessons learned went to §4 B (kit list incl. the equation helper; comparison-lesson layout: tray beside each set-up, its path behind the stands; equations step aside during close-ups).
- 2026-10-12 804 v1 "didn't like the camera work or the animation, didn't understand the lecture, materials all look the same, can't tell the liquids apart": the taste rules (camera, pacing, animation, materials) were all here; I did not apply them and my check only looked for errors (user: "I asked for a lot of rules, not only mistakes"). Added: comparison side by side with a ranking, every substance its own look, the action is the picture, camera height, check step 5 (quality vs 803).
- 2026-10-12 804 v2 rebuilt by going through every §1 rule: comparison side by side per test (tongs bring each piece in, one steady close-up each, wide result with the book's words and < signs between the names), distinct substance colours on a warm wooden bench, cuts between tests instead of slides, each set-up shown only in its own time. Close-ups need set-ups ≥ 1.2 apart or the neighbours peek in at the edges.
- 2026-10-12 804 v2: "much better, I fully understood the lesson". Revisions: verdict labels need their verb ("reacts quickly"); formulas not understood → words, then atom balls that rearrange, then symbols (reactionBoard); art style/lighting not pleasing yet → ask for Cycles-baked realistic light, keep 2D effects + line art, look-dev on one shot first.
- 2026-10-13 Cycles-baked studio light on the 804 water test: "yes i like the results" → bake approved. Then: "can we use outdoor/nature background? so we don't get dark background all the time" → park look-dev (scripts/lookdev_bake.py PARK=1, web/lesson/bake/park_bg.jpg, ?look=park|studio|old). Lessons: an outdoor bake needs a sun (sky alone = dark), varnish bakes the blue sky into the wood, a camera looking down sees only grass unless the photo is tilted.
- 2026-10-13 park background: "doesn't look good" → studio stays the default. Showed 4 bright options (lab, glass room, summer garden, bright studio; ?bg=vintage|glasshouse|meadow|bright). Note: glass, water and white labels are tuned for a dark room; on bright backgrounds they wash out, so a bright look also needs darker glass edges + darker label halos.
- 2026-10-13 "I just don't like using HDRI because it's a floating ball; if we could make some transition": a photo background must never sit behind the set like a wallpaper. The set stands ON the photo's own ground (lower half of the HDRI flattened into a real floor, legs touching it, Cycles-baked shadow of the set on that ground, sun matched to the sun in the photo). ?look=garden on 804 water test (PARK=1 HDRI=meadow_2k.hdr SUN=3.5 SUNDIR=<photo sun> lookdev_bake.py).
- 2026-10-13 "use another HDRI, maybe of a studio, then bake the lighting and complete all of the lesson": 804 every station baked in studio_small_09 (white cyc behind). Pipeline is generic: export_casters.py (still things per station) → bake_set.py (table + floor shadow) → kit.bakedSet + kit.photoDome. Gotcha: a baked PNG must be sRGB-encoded (Blender byte images take the numbers as sRGB) or mid-tones go black.
- 2026-10-13 "the lighting doesn't look good on models": the live models still had the dark-room rig (fake white glow glass, blue fill/rim). In a photo studio the models must be lit BY THE PHOTO: glass = studioGlass (reflects the HDRI, Fresnel, thin darker edge), lights placed where the photo's softboxes/lamps are, no blue fill, environmentIntensity 1. Formulas on white walls go on a dark slate that rolls down (motivated, not a floating panel).
- 2026-10-13 "did you really bake the Cycles lighting? it looks flat": only the table + floor shadow were baked, and only with the soft studio photo (even light from everywhere = flat). Fix = a LIGHT DESIGN, not more baking: one close warm key softbox (light side / shade side, falloff across the table), cool rim behind, photo only as weak fill (ENV 0.25), matte wood (varnish mirrors a white studio), a pool of light on the wall behind the set, glass with dark refracted edges. Always render a real Cycles reference through the app's camera (bake_set.py REFCAM=…) and match the app to it before showing.
- 2026-10-13 "ok lets finish this lesson so we can move forward": 804 finished with the light design on all four stations (bake_set.py ENV=0.25 KEY=1100). New code lessons start from this look: per station export_casters → bake_set → kit.bakedSet + photoDome, LOOK.photo glass, slate for formulas.
- 2026-10-13 "not happy with the lighting and glass shader, it doesn't look good on the eyes; finish the rest of the lessons": AgX + bright grey wall = washed, no figure/ground; glass v1 = smoky grey bands. Fixed (on 804 first): ACES 0.9, wall darker than the set with a warm pool, glass v2 (thin line + sharp highlights), clear saturated liquids. Then Unit 8 lessons in book order as code lessons.
- 2026-10-13 801 v1 shown (sheet renders/lesson/show801.jpg): "extremely bad, I didn't understand the picture at all". Asked which part; fix before any roll-out.
- 2026-10-13 801 v1 answer: watched in the app, "can't tell what's happening". Cause: effects with no visible cause, no question/before, ~5 s per test. Rule added in §1 (question → before → visible cause → ✓ result, held). 801 rebuilt as v2 (backups/l801_v1.js kept).
- 2026-10-13 801 v2: "I still didn't get the overall point" (parts OK). Added the "What is a metal?" checklist card (plan → tick after each test → full card + definition). Rule in §1.
- 2026-10-13 801 v2 + checklist card: "much better, now let's complete the rest of the lessons in this chapter". Approved: look v2 + clarity rules + one-question checklist card are the pattern for 802, 805–819.
- 2026-10-13 "Don't pop the checkbox up after each experiment: it comes at the beginning, moves to the side and stays, checkboxes add up; don't add it to lessons that don't need it": K.checklist rewritten (intro → dock → ticks), shots shifted with K.dockShot.
- 2026-10-13 802 v2: "extremely bad, too much going on, too complicated; the pacing was not great; why don't you use skill.md in every lesson?" I had used the skill only to catch errors, not its taste rules. Rule "Less is more" added; 802 rebuilt as v3 (one atom at a time, one bar chart, one table with an arrow, no samples/stairs/key/checklist; 84 s instead of 126 s) with a written §1 pass/fail in its header.
- 2026-10-13 "Don't remove ☰ from any lessons; move the speed icon next to play/pause; next updates go to the live website, not the server; what do you mean by 802?": the code-lesson player got ⌂ ☰ 🎮 + speed beside play (film player too); every update is published to asawera-chemistry.pages.dev (publishing/cloudflare/README.md); in reports name lessons by title ("Metallic Character"), not by id.
- 2026-10-13 "this lesson is good" (Metallic Character, 802 v3): the simple style is approved: one thing per shot, ≤ 3 labels, a pattern on ONE simple picture. (Not "short": see the next line.)
- 2026-10-13 805 v2: "I don't understand these things you made; the camera follows very fast, not enough in-between frames; not built for iPad screens, should work on any screen; bake the lighting". → §0 rules: things students know (minerals only inside the ground), slow camera (≥ 2 s a move), every screen (engine refits per screen + 5-size check), baked studio for table scenes. v3 built that way (table of familiar things, ground slice with crystal pockets, every screen fitted, 801–804 too).
- 2026-10-13 805 v1 "not happy": I made it short and it was a slideshow of objects with no reason; also "you need to read skill.md each time, put it where you always read it; I shouldn't have to pin-point every lesson". → §0 added (3 goals: nothing missing, a reason, interesting; past-mistakes list; work on your own), SKILL.md imported in CLAUDE.md so it is always loaded.
- 2026-10-13 "i'm happy with the lesson" (Alkaline Earth Metals, 805 v3): approved pattern = familiar things on a baked table as the hook, a question card, one experiment, dark atom close-ups, the unknown things shown where they really are (crystal pockets in a slice of the ground), back to the opening table, end on the chart; camera moves ≥ 2 s; every screen fitted. Build 806–819 this way.
- 2026-10-13 "the ionization lesson is good now; don't complete only the next lesson but all the lessons not done in this chapter": 806 approved (hook → dark atoms with a gold bar per pulled electron → bar charts → back to the bench). Build 807–819 in one go, publish each. Reports: give the DIRECT lesson link (…/index.html?film=<id>), name the lesson by title, say plainly done / not done; after publishing, check the lesson file is really live (another session can publish over you).
- 2026-10-14 817 v1 (Halogens React): "i didn't like this lesson" → "boring / no point" (a list question, 12 formula boards, 267 s). Rule in §0 goal 2: WHY/HOW question + one scoreboard that grows round by round; repeat-pattern equations to the game. 817 rebuilt as v2 (backups/l817_v1.js).
- 2026-10-14 817 v2 (contest of five rounds, 4 boards) published: "now it doesn't make any sense, lesson has gone extremely worse". Back to v1 at once (v2 in backups/l817_v2.js). The contest rule I added was wrong and is replaced by: never invent a framing; when 'boring', change the least and ask first.
- 2026-10-14 817 v1 "still extremely bad, I don't understand when looking at the video; did you check it?": no. Its
  header said "§1 CHECK ✓" but I never looked: half the lesson was 12 formula boards of small balls on an empty dark
  floor, empty frames between them, a tiny unreadable panel, claims with no picture. Rules: few boards (§4 A), the
  check is written while looking, with frame times (§4 C5).
- 2026-10-15 817 v3: "somewhat makes sense but very hard to understand, lots of random events, each event is missing
  something or something's wrong, pacing still wrong; read the skill fully, not a choice". Looking frame by frame:
  bright table ↔ dark ball stage switched 10 times (6 dark interludes of balls from nowhere = random events); gas jars
  read as juice; hydrogen never seen; a 0.5 s "bang" in a bright room; verdicts without verbs; burner in front of the
  table; labels shrinking to dots; one 30 s still wide shot then 6 s rushed ones. Rules: §4 A "dark close-ups only as
  a push INTO the thing just seen", "gas looks like gas", §0 list. v4 keeps the question, order and experiments.
- 2026-10-15 "the focus is always in the 3D scene so no one reads the bottom text; we need to put the text where our
  eyes are": engine capNear mode (caption floats beside its thing, no bottom band); pilot on 817, then every lesson.
- 2026-10-15 817 capNear still had a caption AND labels on screen together ("which text should I look at? I can't look
  at everything at once"): engine oneText (texts take turns), repeated captions dropped, scripts/text_check.py.
- 2026-10-15 "this is so much better, why aren't all lessons like this?" (817 with the text by the action, one at a time):
  APPROVED. Rolled out to 801–816 (scripts/near_on.py; equations/word boards stay as picture, the floating line lifts
  above any label or moves under the subject, waits while the question card is up). Every new lesson starts this way.
- 2026-10-15 "I mean the whole video, not only the text: I can fully understand it, every part is linked. Why aren't all
  lessons made like this in one shot?" 817 v4 = reference lesson (§0, LOCKED). Honest cause of 4 rounds: the rules
  arrived one complaint at a time, and in v1–v3 I checked my code instead of watching as a student. Next: bring the
  other lessons up to it (807–816 first: never reviewed by the user).
- 2026-10-15 Chapter 7 student review: a correct coverage list is not enough. Establish particle sources and signs,
  count atoms/electrons, show the calculation, and inspect the complete playback plus phone layouts before reporting a pass.
- 2026-11-04 "Check chapters 4–6 against skill.md … why did you not fix it?": an audit alone is not the job; fix it. Unit 4 rebuilt as code lessons (u4kit.js) + games. Gotchas: a label's grow/pop must keep its own scale (setScalar(1) made signs huge); a lesson header may only name a game that really holds those items.
- 2026-11-04 Unit 6 rebuilt as code lessons (u6kit.js) + 🧠 Solutions Practice; every Unit 4–6 game opens with 🔍 Explore. Gotcha: a stage's result label must share the group of the working lines above it (oneText), or the sum vanishes when its answer appears.
