# Check of Chapters 4, 5, 6 against SKILL.md (2026-11-04)

**Result: Chapters 4, 5 and 6 do not meet the skill.** All 47 lessons (401–415, 501–515, 601–617) are still the
old Blender films from 2026-10-09/10. They were made before most of the skill's rules existed, were never rebuilt as
code lessons like Chapters 7 and 8, and STATUS.md still says "Waiting for the user's look" for all three chapters.

How this was checked: every film was opened in the real app player (1180×820, iPad size) and a frame was taken every
5 s (689 frames). A script checked every frame for empty frames and tiny subjects. I looked at the frame sheets of 9
films by eye (401, 403, 409, 411, 413, 504, 506, 608, 614); the chapter-wide failures below are true for all 47 because
they come from how the films are built. Exercise pages (pp. 118–120, 150–151, 180–181) were read against the games'
"covers" lists.

## Rules every one of the 47 lessons breaks

| Skill rule | What the films do now |
|---|---|
| §4 "the way every lesson is built now": code lessons in `web/lesson/` | All 47 are exported Blender films (not in `CODE_LESSONS` in app.js) |
| §0 goal 2: ONE big question from the book, on a card, answered at the end | No question card in any film; captions are a list of facts |
| §0 goal 3: real-life hook, paid off at the end | Films open straight on atoms, boxes or a gauge (e.g. 401 opens on a ramp, 403 on two atoms) |
| §0 reference lesson 817: bridges between acts | No bridge lines; acts just follow each other |
| §1 "No bottom caption band" (capNear) + "ONE text at a time" (oneText) | Every film has a bottom caption, often repeating a label already on screen (411: "CO₂ linear 180°" label + the same caption) |
| §1 real 3D objects, never flat discs | Chapter 4 atoms are flat rings with dots (401–409) |
| §0 / §1 baked photo studio for things on a table | No table, no baked light anywhere; beakers and boxes float on a dark floor (504, 506, 608, 614) |
| §1 every experiment: question → named before → visible cause → ✓ result | Things change by themselves: "Metals hammer into sheets" with no hammer (413); molecules grow out of a dot (411) |
| §0 goal 1 + §1 "Book coverage is complete": `docs/COVERAGE_UN.md` | No COVERAGE_U4/U5/U6.md exists (STATUS: "Book coverage maps for Units 2–7" not done) |
| §1 "Games must be exciting" (arcade, `excite: true`) and 🔍 Explore first | None of the 9 Chapter 4–6 practice games has `excite` or an Explore part |

## Problems seen in particular films (frame times)

- **401 Why Atoms Bond**: empty frame at 30.5 s; "..." placeholder over the atoms at 40.5 s; tiny "gain" label at 75.5 s.
- **403 Ionic Bond NaCl**: almost empty frame at 40.5 s (one dot); the electron handover can't be seen at 10–15 s;
  Na⁺/Cl⁻ labels float far from the crystal at 50–60 s.
- **404, 408, 412**: empty frames at 30.5 s, 20.5 s and 70.5 s (script).
- **409 Polar & Non-polar**: unreadable "non-polar" label on the ruler at 35.5 s; two grey boxes with no names at 70.5 s;
  the sorting bins are flat grey cards.
- **411 Shapes of Molecules**: every molecule pops in from a dot (10.5, 20.5, 30.5, 40.5, 50.5, 60.5 s); caption says
  107° while the label says 106.7°; "Lone pairs push bonds closer" but nothing pushes.
- **413 Properties**: "Like dissolves like" over molecules with no solvent; "Metals hammer into sheets" with no hammer;
  85–95 s is only a table of words on an empty floor (the 817 v1 mistake).
- **414, 514, 616 Key Points**: several empty or tiny frames (414: 25.5, 35.5, 45.5 s; 514: 50.5, 75.5, 80.5, 90.5 s;
  616: 40.5, 85.5 s).
- **504 Boyle's Law**: 65.5 s is just letters P and V with no objects (bare formula).
- **506 Evaporation**: "Alcohol beats water" (contest wording; the verdict has no verb); no familiar hook (wet clothes, sweat).
- **512, 513**: empty frames at 5.5 s (512) and 10.5, 60.5 s (513).
- **608 Molarity Problems**: three sums done as floating numbers next to a small scale; the subject stays small (script
  flags 6 frames); no beaker, flask or real solution.
- **614 Colloids**: "Suspension: you can see them" over an empty box at 10.5 s; fog = sticks with balls, paints = three
  grey cylinders (not recognisable); Example 6.6 starts at 75 s with no bridge from the colloids.

## Exercise questions with no game (MEMORIZE = GAME / "covers" rule)

- **Chapter 4**: Short Q v, ix, x · Long Q i–v · Project Work (Linus Pauling)
- **Chapter 5**: Long Q iii (allotropy, three forms of carbon)
- **Chapter 6**: Long Q ii (solubility factors), Long Q v (percentage composition, molarity)

## What it would take

Bring each chapter up to the 817 standard the same way Chapters 7 and 8 were done: book page first → beat sheet with
one question → code lesson in `web/lesson/l4NN.js` … with the kit, baked studio, capNear + oneText → zcheck, dense
iPad sheet, five screens → COVERAGE_UN.md → games get Explore + arcade + the missing questions. Per the skill, start with
one lesson for the user to approve, then the rest of the chapter.
