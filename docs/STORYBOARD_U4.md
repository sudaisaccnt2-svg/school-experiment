# Storyboard: Unit 4 Structure of Molecules (pp. 92–120)

Book photos: `assets/book_u4/p92-93.jpg` … `p120.jpg`. Builders: `scripts/u4/f4NN_*.py` (+ `u4lib.py`, appended after
`u3lib.py`). Same v3 layout as Units 2–3: one big picture, one caption place, ≤ 3 world labels, stations 40 units apart.
Pictures: flat Bohr atoms (`vatom`) for ions, book dot-and-cross rings (`LRing`, `pairs()`, `hand()`) for bonds,
`lewis()` for dots → lines, `bstick()` + `SHAPES` for 3D molecules. Atom A's electrons blue, atom B's gold.

| Film | Pages | What the picture does |
|---|---|---|
| 401 Why Atoms Bond | 92–93 | ball rolls downhill; H + H share, energy out; Fig 4.1 He/Ne/Ar/Kr; octet (O 6 + 2); duplet; lose / gain / share |
| 402 Valence and Bond Types | 94 | Na/Cl valence shells; Cl bonding vs lone pairs; σ end-to-end and π side-by-side clouds; the four bond types |
| 403 Ionic Bond NaCl | 95–96 | Na hands its electron to Cl; Na⁺ Cl⁻ attract; Fig 4.2 lattice turns |
| 404 Calcium Chloride | 96–97 | Cl–Ca–Cl two handovers; Test Yourself ions (Ca²⁺ F⁻ Li⁺ O²⁻); MgO |
| 405 Covalent Bond | 98–99 | H–H shared pair → dash; Example 4.1 H–Cl lone pairs; Practice 4.1 H–O–H |
| 406 Single Double Triple | 99–102 | Cl–Cl, CH₄; O=O, O=C=O; N≡N; EN-difference ruler (1.7 rule); Activity 4.1 sort |
| 407 Dative Bond | 103–104 | Example/Practice 4.2 bins (atoms, molecules, ions); NH₃ + H⁺ → NH₄⁺; NH₃ → BCl₃ |
| 408 Lewis Structures | 105 | water, H₂S (Example 4.3), NH₃ (Practice 4.3): dots → lines; 2 / 4 / 6 electrons per bond |
| 409 Polar and Non-polar | 106–108 | H₂ and Cl₂ fair; HCl pair slides to Cl (δ+ δ−); 0.5 / 1.7 ruler; H₂O and NH₃; Test Yourself table sort |
| 410 Metallic Bond | 108–109 | metal atoms let electrons go → + ions in a sea; Activity 4.3 home items into 3 bins |
| 411 Shapes of Molecules | 109–110 | Fig 4.18: CO₂, SO₂, BCl₃, H₂O, CH₄, NH₃ one by one (name + angle), then all six |
| 412 Intermolecular Forces | 110–113 | 464 vs 19 kJ/mol bars; HCl dipole grid (3.3 kJ, −85 °C); Fig 4.20 water H-bonds; Example/Practice 4.4 bins; glue |
| 413 Properties | 113–116 | strength ladder; ionic lattice shivers (MgO 2800 °C) then melts; covalent molecules drift apart; metal: sheet, wire, current, shine/ring, Hg; Activity 4.4 table |
| 414 Key Points | 117 | 12 stations, one per bullet, each with its picture |
| 415 Exercise MCQs | 118–119 | f12/313 layout; answers d c c b c c b c d b |

Games (unit 4 tab): Quiz Quest (`quiz4.js`), Bond Builder (`bondbuild.js`: tap electrons to give / share until all
shells are full), Bond Sorter (`bondsort.js`: ionic / polar / non-polar + EN ruler), Shape Lab (`shapelab.js`: name the
shape, then polar? with bond-pull arrows). Shared 3D kit: `mol3d.js`.
