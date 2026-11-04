# Storyboard: Unit 02 Structure of an Atom (pp. 44–62)

Read only the section you are working on. Source photos: p.44 = `Downloads\IMG_9900.jpeg`; pp.45–62 =
`Downloads\New folder (4)\IMG_9901..9919.jpeg` (9907 duplicates p.50). IMG_9920–9923 are out of scope.
Rules: follow the book's wording and values, and record any book error in `docs/NOTES.md`. One Blender scene per film.
Text-heavy cards are HUD text parented to the camera. 3D models live in world space, with short billboard labels.

| # | Film (Blender scene) | Pages | Photo |
|---|---|---|---|
| 01 | `Scene`: Rutherford film + **Act 5 Defects** | 41–44 | 9900 |
| 02 | `02 Bohr's Atomic Theory` | 45–46 | 9901, 9902 |
| 03 | `03 Fundamental Particles` | 47–48 | 9903, 9904 |
| 04 | `04 Shells & Electronic Configuration` | 48 | 9904 |
| 05 | `05 Sub-shells s p d f` | 49–50 | 9905, 9906 |
| 06 | `06 Aufbau Principle` | 50 | 9906 |
| 07 | `07 First 18 Elements` (+ Test Yourself) | 51–52 | 9908, 9909 |
| 08 | `08 Isotopes of Hydrogen` | 52–53 | 9909, 9910 |
| 09 | `09 Isotopes of C, Cl, U` | 54–56 | 9911–9913 |
| 10 | `10 Uses of Isotopes` | 57–58 | 9914, 9915 |
| 11 | `11 Key Points` | 59 | 9916 |
| 12 | `12 Exercise MCQs` | 60–61 | 9917, 9918 |
| — | Short / Long Questions: in the games (web/games.html) | 61–62 | 9918, 9919 |

## v2 style (user request 2026-10-08): visual first, kid-friendly
- One idea per shot. On screen: a gold headline (≤ 6 words) + one or two short plain lines. No paragraphs; the book's
  exact wording only as a short recap card/table at the end of an act (exam answers).
- Every number becomes something you can count or compare (seats, dots, marbles, blocks, balances, bars).
- Every formula is acted out by objects: 2n² = two n × n dot squares; n = A − Z = marbles minus red ones;
  ΔE = hν = jump size → light colour; mvr = nh/2π = whole gold blocks (no half steps); A = p + n = balls in a bag.
- NO bare formula ever (user rule, films AND games): picture first, then plain words, then the book's symbols LAST,
  each pinned to the thing it names (e.g. E₂/E₁ on the energy-scale ticks, ΔE beside the drop arrow). Avoid 10⁻²⁷-style
  numbers outside the book tables.
- Everyday pictures: stairs vs ramp (allowed orbits), seats (shell capacity), lowest shelf first (Aufbau), jars of
  100 marbles (abundance %), balance (masses).
- Camera moves with purpose (push in, pull back to reveal); electrons have comet trails; bloom stays soft.
- **One place moves at a time** (user, 2026-10-08). When several atoms or demos share the screen, only the one being
  explained moves; the others wait, still (`lib.refocus(root, spans)` / `lib.focus_spin`). Side-by-side
  comparisons pulse left to right, one after another, never all at once. Check with
  `python scripts/bsend.py scripts/p2/audit_focus.py` → renders/p2/audit_focus.txt (lines with R2+ = two subjects
  moving together; R1 lines are one atom/object and are fine).
- The exercise lives in the games (web/games.html); films 13/14 are not needed.

## v3 layout (user, 2026-10-08: "too complicated and disorganized"). Pilot: film 02; apply to 03-12 once approved
- ONE picture per shot, big and centred (`camera(..., shift=(0, 0))`); a new idea = a new shot (cut), not a new panel.
- ONE caption place: bottom centre, gold headline (hud size 0.072, v 0.185) + one plain line (0.046, v 0.09).
  See `cap()` in f02_bohr.py. No other HUD text, no side panels, no top title.
- At most 3 world labels per shot, big (0.5-0.6 at 22 units away), no leader lines; captions stay inside one shot.
- Slower: about 8-12 s per idea. Moving light/objects must not cross the caption (f02 `back()` times the drops).

## 01 Act 5: Defects in Rutherford's Model (p.44), zone x=180 in the Rutherford scene
1. Title. An electron orbits a nucleus. HUD point 1: the model is based on laws of motion and gravitation, which apply to
   neutral bodies (planets), not to charged bodies.
2. Point 2 (Maxwell): an orbiting charge emits energy continuously. Light rings pulse out, the orbit shrinks into a spiral
   (Fig 2.5, with the velocity arrow v), the electron falls into the nucleus and flashes. "This does not happen: atoms are stable."
3. Point 3: an expected continuous (rainbow) spectrum against the observed line spectrum (H: 410/434/486/656 nm).
4. Point 4: no explanation of the chemical properties of elements.
5. STS box: the model stood for a time; Bohr (1913) used Planck's quantum theory to explain stability and line spectra.

## 02 Bohr's Atomic Theory (pp.45–46)
Acts: Intro (Bohr 1913, H atom as model) · P1 fixed circular orbits = shells = energy levels · P2 energy grows with
distance (energy ladder) · P3 no energy change while in an orbit · P4 jump down emits a photon, jump up absorbs one;
ΔE = E₂ − E₁ = hν (h = 6.626×10⁻³⁴ J s) · P5 electron in an orbit, never in between · P6 mvr = nh/2π ·
Fig 2.6 shells K L M (n=1,2,3; K least energy, nearest) · Payoff: jumps emit definite frequencies, so a line spectrum
and a stable atom (fixes defects 2 and 3). Activity 2.1 note. v3 (126 s): the atom lays back into an "energy cake"
(outer shells higher) for rules 2-4; stairs alone for rule 5; gold blocks alone for rule 6; spectrum strip under the atom.

## 03 Fundamental Particles (pp.47–48)
Fig 2.7 atom (4 p, 5 n, 4 e: beryllium-9), zoom to the nucleus · electron / proton / neutron cards (charge, amu, kg,
location; proton 1837×, neutron 1842× the electron) · v2: charges demo (+ − attract, − − repel, neutron ignored) ·
balance: 1 proton against a pile of 1837 electrons · Table 2.1.

## 04 Shells & Electronic Configuration (p.48)
Definition · shells n=1..5 = K L M N O · 2n² fill counter (2, 8, 18, 32, 50) · Table 2.2.

## 05 Sub-shells (pp.49–50)
Shell recap (n up, then distance and energy up) · sub-shell definition · s, p, d, f = sharp, principal, diffused,
fundamental · orbital shapes (s sphere, p dumbbells x/y/z, d cloverleaf ×5, f has 7 orbitals) · capacity s2 p6 d10 f14 ·
Table 2.3 (K: s; L: s,p; M: s,p,d; N: s,p,d,f). v2: orbitals as dot clouds; capacity = boxes of 2 electrons;
shells = floors, sub-shells = rooms (2 + 6 + 10 + 14 → 2n²).

## 06 Aufbau Principle (p.50)
Energy staircase 1s<2s<2p<3s<3p<4s<3d · definition · diagonal-rule diagram drawn arrow by arrow · demo: fill potassium
(19 e) to show 4s before 3d. v2: opens with balls filling a shelf from the bottom (one tries the top, falls back);
the 19th electron tries 3d, is refused, drops into 4s.

## 07 First 18 Elements (pp.51–52)
One atom builds from H to Ar: protons and neutrons pop in, electrons fill K/L/M, colour-coded s and p. HUD shows the
element, Z, configuration and shell numbers, with an H..Ar strip highlight (Table 2.4). Test Yourself: Na (2,8,1;
1s² 2s² 2p⁶ 3s¹), K 2,8,8,1 (19 protons, structure), N, P, Ar.

## 08 Isotopes of Hydrogen (pp.52–53)
Definition (same Z, different A, from different neutron counts; same chemical properties, different physical ones) ·
protium / deuterium / tritium models, symbols, neutron counts and abundance (99.985, 0.015, very rare) · H₂O against
D₂O molecules and Table 2.6. v2: scales weigh H, D, T (A = 1 + n); 20,000 dots with 3 gold = 0.015 %; H₂O vs D₂O
on a balance.

## 09 Isotopes of C, Cl, U (pp.54–56)
Carbon 12/13/14 (6 p; 6/7/8 n; 98.98 %, 1.109 %, 1 ppt) · chlorine 35/37 (17 p; 18/20 n; 75.53 / 24.47 %) ·
uranium 234/235/238 (92 p; 142/143/146 n; 0.05 / 0.75 / 99.245 %). v2: after each element, a glass case of 100
marbles pours in (C 99:1, Cl 76:24, U 99:1).

## 10 Uses of Isotopes (pp.57–58)
STS carbon dating (C-14 decays; uranium to lead) · I-131 thyroid/goitre · I-123 brain imaging · tracers (D, C-13,
N-15, O-18, I-131) · radium and Co-60 against cancer · Na-24 blood circulation · C-14 in photosynthesis · Am-241 smoke
detectors and oil wells · Cf-252 soil moisture and luggage checks · Kr-85 dust and pollutant levels.

## 11 Key Points (p.59)
Recap montage of every bullet on p.59, each with its model.

## 12 MCQs (pp.60–61). Each question: card, 4 s to think, the answer turns green, then a one-line reason and a mini model
i b 18 · ii a nucleus · iii a no charge, so no deflection · iv c radiate energy · v d same neutrons (false: 6 vs 8) ·
vi b mass ≈ proton · vii a same protons · viii c electron · ix d volume · x b s and p.

## 13 Short Questions (p.61)
i Al-27: 13p 14n 13e, 2,8,3, 1s² 2s² 2p⁶ 3s² 3p¹ · ii K<L energy (different) · iii H isotopes · iv a Na(11) b Cl(17)
c Ca(20) · v p⁺ = e⁻, so neutral · vi p and n (heavy) are in the nucleus; e mass negligible · vii same electrons gives the
same chemistry; different neutrons give a different mass, so different physical properties · viii C-12/13/14 with p, n, e ·
ix K2 L8 M18 N32 · x Li 1s² 2s¹; C 1s² 2s² 2p²; Mg 1s² 2s² 2p⁶ 3s² · xi ³₁H, ²₁H, ¹₁H.

## 14 Long Questions (p.62)
i Rutherford's model and gold-foil summary (schematic) · ii defect → Bohr postulate table · iii completed table:
a ¹³¹₅₄Xe 54/131/54/54/77 · b ⁵⁹₂₇Co 27/59/27/27/32 · c ¹⁴⁴₆₀Nd 60/144/60/60/84 · d ⁴⁸₂₂Ti 22/48/22/22/26 ·
e ¹⁷⁸₇₂Hf 72/178/72/72/106 · F ¹²⁸₅₂Te 52/128/52/52/76 · g ⁴⁰₁₈Ar 18/40/18/18/22 (n = A − Z; neutral, so e = p = Z) ·
iv (a) energy level and sub-energy level (b) H 1s¹, He 1s², Li 1s² 2s¹, Be 1s² 2s² · Project-work note.
