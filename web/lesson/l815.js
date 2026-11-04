// Lesson 815 · Non-metals (book pp. 238–240: 8.2 Non-Metals, Scientific Information, Table 8.8, 8.2.1 Electronegative
// Character), v1 (2026-10-14). Built from SKILL §0 + the approved 801 test pattern (question → before → visible cause →
// result labelled) and the 804 v2 comparison rule (the metal AND the non-metal in every test, side by side).
// THE QUESTION: "What makes a non-metal?" → card: shape · current, heat · oxide · states · gains e⁻ · acids · covalent · pull.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//   HOOK    copper and a lump of yellow sulphur on two anvils. A hammer flattens the copper; one blow and the sulphur
//           shatters into pieces · both are elements, why so different? sulphur is a non-metal → card.
//   PULL    copper in two clamps stretches into a long wire; a sulphur rod snaps · not malleable, not ductile (tick 1).
//   CURRENT a bulb circuit with a gap: copper closes it (bulb lights) · sulphur: the bulb stays off · graphite (pencil
//           carbon), also a non-metal, lights it: the exception · HEAT: wax beads under a copper rod and a sulphur rod,
//           flames under both: the copper's beads drop one by one, the sulphur's stay · non-conductors (tick 2).
//   OXIDE   sulphur heated in a spoon catches a blue flame, burns in a jar of oxygen; the jar is shaken, the oxide
//           dissolves in the water; blue litmus turns red: acidic · beside it, sodium oxide water turns red litmus blue:
//           a metal's oxide is basic (Table 8.8 row 4) (tick 3).
//   STATES  chlorine gas wisps out of its jar · a drop of bromine falls and gives off red-brown vapour: a liquid ·
//           tongs set sulphur, carbon and iodine down: solids · (dark) the table: the 27 non-metals light up group by
//           group in the book's order; most are gases, one liquid (bromine, m.p. 7.2 °C), a few solids; three metals
//           are liquids too (Hg 38.87, Ga 29.76, Cs 28.4 °C) (tick 4).
//   INSIDE  (dark) sodium 2, 8, 1 next to chlorine 2, 8, 7: the gold electron hops over → Cl⁻ (17 +, 18 −): a non-metal
//           GAINS an electron and forms an anion · sodium gives (electron donor, reducing agent), chlorine takes
//           (electron acceptor, oxidizing agent); + ion and − ion · electronegative · (dark) the board: a Cl₂ molecule
//           + 2 electrons → 2 chloride ions: balls, symbols, words (tick 5).
//   ACIDS   zinc dropped into acid fizzes (hydrogen); sulphur in acid: nothing · cannot replace hydrogen (tick 6).
//   COVALENT (dark) NaCl: two ions (ionic) beside H–Cl sharing a pair (covalent) · non-metals + hydrogen: H₂O, NH₃,
//           CH₄ (many stable covalent hydrides) · a metal hydride NaH: few, ionic (tick 7).
//   PULL e⁻ (dark) H–Cl: the shared pair slides toward chlorine: electronegativity = an atom's pull on a shared pair ·
//           the table: an arrow to the right corner, group VII glows: most electronegative (tick 8).
//   END     back at the anvils: copper gives electrons away (a metal); sulphur takes them (a non-metal).
// Book points (all): non-conductors of heat and electricity · neither malleable nor ductile · oxides and hydroxides
// are acids · all three states at room temperature · burns in oxygen → usually acidic oxide → acidic solution, blue
// litmus red · redefined: gains an electron, forms an anion (chlorine → Cl⁻) · electronegative, tendency to gain
// electrons · Cl₂ + 2e⁻ → 2Cl⁻ · Scientific Information (27 non-metals by group; gases, one liquid, few solids; liquid
// metals Hg, Ga, Cs; Br 7.2 °C) · Table 8.8 rows 1–8 · electronegativity definition · right corner, group VII.
// Memorize-only (→ 🎮 Metal or Non-metal? › Sort): Table 8.8 rows, the 27 non-metals, gases/liquid/solids lists.
// Book notes (NOTES.md): Hg m.p. printed 38.87 °C (real −38.83), Br 7.2 °C (real −7.2); "27" as printed.
// §1 CHECK (sheets renders/lesson/d815*.jpg, s815.jpg, scr815.jpg): nothing missing ✓ · one question + bridges ✓ ·
// familiar hook (a hammer) paid off at the end ✓ · metal AND non-metal side by side in every test ✓ · each test:
// question → before → visible cause (hammer, clamp, tongs, flame, shaking, dropper) → result labelled ✓ · formula
// built as balls → symbols → words ✓ · ≤ 3 labels a shot (equation board excepted) ✓ · one place at a time ✓ ·
// camera moves ≥ 2 s ✓ · baked tables, dark table/atoms ✓ · substances own colours (copper, yellow sulphur, black
// graphite, green chlorine, red-brown bromine, violet iodine) ✓ · every screen ✓ · flicker 0 ✓.
import * as THREE from 'three';
import * as K from './kit.js';
import { place, SYM } from '../games/u3data.js';
const { M, span, ease, easeIn, back, lerp, hash } = K;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

const TAN = Math.tan(16 * Math.PI / 180), ASP = 1.6, ADIR = [0, 0.5, 1], DDIR = [0, 0.12, 1];
let DOCK = 1e9;
/** a shot: the subject (look, w × h) seen along dir; the engine refits it to the real screen (fit = 6th element) */
function S(t, look, w, h, dir = ADIR, e) {
  h *= 1.14; look = [look[0], look[1] + 0.05 * h, look[2]];        // headroom: the caption floats just above the subject (capNear)
  const dk = t >= DOCK, d = V(...dir).normalize(), dist = Math.max(h / 2 / TAN, (dk ? w / (1 - K.DOCK_W) : w) / 2 / (TAN * ASP)) * 1.1;
  const pos = V(...look).addScaledVector(d, dist).toArray(), fit = { look, w, h, dir, dock: dk ? K.DOCK_W : 0 };
  return dk ? [t, ...K.dockShot(pos, look), undefined, e, fit] : [t, pos, look, undefined, e, fit];
}

// ---------------------------------------------------------------- places (stations 10+ apart)
const AX1 = -0.75, AX2 = 0.75, TOPA = 0.36, HL = 0.64;                    // hook: copper anvil · sulphur anvil · hammer pivot offset
const PX = 12, XC = PX - 1.5, XS = PX + 0.45, L0 = 0.3;                   // pull: copper clamps · sulphur clamps
const EX = 24, CX = EX - 1.35, RX = EX + 1.6, ZC = 0.17, ZS = -0.17;      // circuit · heat rods (copper in front, sulphur behind)
const OX = 36, BRN = OX - 1.0, JX = OX - 0.2, BKX = OX + 0.75;            // oxide: burner · oxygen jar · sodium oxide beaker
const SX = 48, CLJ = SX - 1.6, BRD = SX - 0.05, BRB = SX + 0.2, SOL = SX + 0.95;   // states: chlorine jar · bromine dish, bottle · solids tile
const TBX = 62, TP = 0.5, COL = (c) => TBX + (c - 9.5) * TP, TY = (r) => 4.6 - (r - 1) * TP - (r > 7 ? 0.25 : 0);   // the periodic table (dark)
const NAX = 75, CLX = 78.6, AY = 1.9;                                     // inside: sodium and chlorine atoms (dark)
const QX = 86;                                                            // Cl₂ + 2e⁻ → 2Cl⁻ (dark)
const ACX = 96, ZB = ACX - 0.38, SB = ACX + 0.38, BR = 0.2, AY0 = 0.055, SURF = AY0 + 0.24;   // acid beakers
const BDX = 104, NCX = BDX - 1.3, HCX = BDX + 1.3;                        // chlorides (dark)
const HYX = 113, NHX = HYX + 3.2;                                         // hydrides · NaH (dark)
const ENX = 122;                                                          // the shared pair (dark)

// ---------------------------------------------------------------- time (every camera move ≥ 2 s)
const T = { cu: 0.5, s: 1.2, hit1: 3.6, hit2: 4.6, hitS: 8.4, ask: 11.6, card: 14.2 };
DOCK = T.card + 5.0;
const P0 = DOCK + 0.4, PCU = P0 + 2.0, PS = P0 + 6.4, SNAP = PS + 1.6, PEND = P0 + 12;
const E0 = PEND, ECU = E0 + 1.4, ECO = E0 + 6.0, ES = E0 + 7.9, ESO = E0 + 12.0, EG = E0 + 13.9, EEND = E0 + 20;
const H0 = EEND, HOT = H0 + 2.4, HEND = H0 + 11.5;
const O0 = HEND, OEND = O0 + 28;
const S0 = OEND, SEND = S0 + 22.5;
const TB0 = SEND, TEND = TB0 + 29;
const I0 = TEND, IEND = I0 + 19;
const Q0 = IEND, QEND = Q0 + 13.5;
const A0 = QEND, AEND = A0 + 14;
const B0 = AEND, BH = B0 + 10.5, BEND = B0 + 22;
const N0 = BEND, N1 = N0 + 9, NEND = N1 + 9.5;
const Z0 = NEND; T.done = Z0 + 10.5;
const ROD0 = RX + 0.5, BEADX = [RX + 0.23, RX + 0.03, RX - 0.17, RX - 0.37], MELT = BEADX.map((x) => HOT + 0.7 + (ROD0 - x) * 3.2);
const INTRO = [T.card, DOCK];
const TICKS = [[PEND - 0.6, 0], [HEND - 0.6, 1], [OEND - 0.6, 2], [TEND - 0.6, 3], [QEND - 0.6, 4], [AEND - 0.6, 5], [BEND - 0.6, 6], [NEND - 0.6, 7]];
const dark = (t) => [[TB0, TEND], [I0, QEND], [B0, NEND]].some(([a, b]) => t >= a - 0.05 && t < b - 0.05);

const captions = [
  [0.3, T.hit1 - 0.6, 'Copper and sulphur: hit both with a hammer'],
  [T.hit1 - 0.6, T.hitS - 1.4, 'Copper goes flat'],
  [T.hitS - 1.4, T.ask, 'Sulphur shatters into pieces!'],
  [T.ask, T.card, 'Both are elements. Why so different?'],
  [T.card, DOCK, 'Sulphur is a non-metal. What makes a non-metal?'],
  [DOCK, PCU + 0.6, 'Now pull both'],
  [PCU + 0.6, PS, 'Copper stretches into a long wire'],
  [PS, SNAP + 0.3, 'Pull the sulphur rod…'],
  [SNAP + 0.3, PEND, 'It snaps: not malleable, not ductile ✓'],
  [E0, ECU + 1.4, 'Does a non-metal carry electricity?'],
  [ECU + 1.4, ES + 1.0, 'Copper closes the gap: the bulb lights'],
  [ES + 1.0, EG, 'Sulphur: the bulb stays off'],
  [EG, EG + 3.4, 'Graphite (pencil carbon) is a non-metal…'],
  [EG + 3.4, EEND, '…yet it lights the bulb: the exception'],
  [H0, HOT + 1.0, 'And heat? Wax beads on both rods'],
  [HOT + 1.0, MELT[3] + 0.6, 'Heat runs along the copper: the wax drops'],
  [MELT[3] + 0.6, HEND, 'Sulphur carries no heat ✓'],
  [O0, O0 + 3.4, 'Burn sulphur in oxygen'],
  [O0 + 3.4, O0 + 11, 'A blue flame: an oxide gas forms'],
  [O0 + 11, O0 + 16, 'Shake it: the oxide dissolves in the water'],
  [O0 + 16, O0 + 21, 'Blue litmus turns red: an acid ✓'],
  [O0 + 21, O0 + 25.4, 'A metal oxide turns red litmus blue'],
  [O0 + 25.4, OEND, 'Metal oxide: basic. Non-metal oxide: acidic ✓'],
  [S0, S0 + 5, 'Chlorine: a non-metal gas'],
  [S0 + 5, S0 + 11, 'Bromine: a non-metal liquid'],
  [S0 + 11, S0 + 19.6, 'Sulphur, carbon, iodine: non-metal solids'],
  [S0 + 19.6, SEND, 'Non-metals come in all three states'],
  [TB0, TB0 + 8, 'Where are the non-metals?'],
  [TB0 + 8, TB0 + 10.6, '27 non-metals in all'],
  [TB0 + 10.6, TB0 + 14, 'Most of them are gases'],
  [TB0 + 14, TB0 + 17.6, 'Only one is a liquid: bromine'],
  [TB0 + 17.6, TB0 + 20.8, 'A few are solids'],
  [TB0 + 20.8, TEND, 'And three metals are liquids too ✓'],
  [I0, I0 + 4, 'Inside: sodium (metal), chlorine (non-metal)'],
  [I0 + 4, I0 + 7.6, 'Chlorine takes sodium\'s outer electron'],
  [I0 + 7.6, I0 + 11.4, 'A non-metal gains an electron: an anion'],
  [I0 + 11.4, I0 + 15.8, 'Metals give electrons, non-metals take them'],
  [I0 + 15.8, IEND, 'Taking electrons: electronegative'],
  [Q0, Q0 + 4.2, 'A chlorine molecule takes 2 electrons'],
  [Q0 + 4.2, Q0 + 8, 'It becomes 2 chloride ions'],
  [Q0 + 8, QEND, 'In symbols: Cl₂ + 2e⁻ → 2Cl⁻ ✓'],
  [A0, A0 + 3.8, 'Drop zinc (a metal) into acid'],
  [A0 + 3.8, A0 + 6.6, 'Hydrogen bubbles: zinc pushes it out'],
  [A0 + 6.6, A0 + 10, 'Now sulphur (a non-metal)'],
  [A0 + 10, AEND, 'No gas: it can\'t replace hydrogen ✓'],
  [B0, B0 + 4.6, 'Metal + chlorine: an ionic chloride'],
  [B0 + 4.6, BH, 'Non-metal + chlorine: they share a pair'],
  [BH, BH + 7.4, 'Non-metals + hydrogen: many covalent hydrides'],
  [BH + 7.4, BEND, 'Metal hydrides: few, and ionic ✓'],
  [N0, N0 + 3.8, 'Who pulls the shared pair harder?'],
  [N0 + 3.8, N1, 'Chlorine does: electronegativity'],
  [N1, N1 + 4.0, 'The right corner: most electronegative'],
  [N1 + 4.0, NEND, 'Group VII: the most electronegative non-metals ✓'],
  [Z0, Z0 + 3.6, 'Copper gives electrons away: a metal'],
  [Z0 + 3.6, Z0 + 7.2, 'Sulphur takes electrons: a non-metal'],
  [Z0 + 7.2, T.done, 'A non-metal gains electrons ✓'],
];

// ---------------------------------------------------------------- camera
const HW = (t, k = 1, e) => S(t, [0.3, 0.42, 0], 2.95 * k, 0.95 * k, ADIR, e);
const AN = (t, x, k = 1, e) => S(t, [x + 0.2, 0.46, 0], 1.15 * k, 0.8 * k, ADIR, e);
const PW = (t, k = 1, e) => S(t, [PX - 0.25, 0.2, 0], 3.0 * k, 0.75 * k, ADIR, e);
const PC = (t, x, w, k = 1, e) => S(t, [x, 0.2, 0], w * k, 0.62 * k, ADIR, e);
const EC = (t, k = 1, e) => S(t, [CX, 0.42, 0.05], 2.5 * k, 1.2 * k, ADIR, e);
const HR = (t, k = 1, e) => S(t, [RX - 0.05, 0.52, 0], 1.75 * k, 1.2 * k, ADIR, e);
const OW = (t, x, w, k = 1, e) => S(t, [x, 0.5, 0], w * k, 1.15 * k, ADIR, e);
const SW = (t, x, w, k = 1, e) => S(t, [x, 0.4, 0], w * k, 1.05 * k, ADIR, e);
const TAB = (t, k = 1, e) => S(t, [TBX, 2.85, 0], 9.4 * k, 6.2 * k, DDIR, e);
const DK = (t, x, w, h, k = 1, e) => S(t, [x, AY, 0], w * k, h * k, DDIR, e);
const AC = (t, k = 1, e) => S(t, [ACX, 0.33, 0.12], 1.65 * k, 0.95 * k, ADIR, e);
const cams = [
  // HOOK: wide, close on the copper blows, over to the sulphur, wide for the question
  HW(0, 1.04), HW(1.4, 1.0), AN(T.hit1 - 0.2, AX1, 1.04), AN(T.hit2 + 1.0, AX1, 0.98), AN(T.hitS - 0.4, AX2, 1.02), AN(T.hitS + 1.6, AX2, 0.97),
  HW(T.ask + 0.4, 1.02), HW(T.card, 1.0), HW(DOCK, 1.02), HW(P0 - 0.05, 0.99),
  // PULL: wide, the copper, the sulphur, wide
  PW(P0, 1.04), PW(PCU - 0.3, 1.0), PC(PCU + 1.7, XC + 0.5, 1.6, 1.02), PC(PS - 0.6, XC + 0.5, 1.6, 0.98), PC(PS + 1.4, XS + 0.25, 1.15, 1.04), PC(SNAP + 1.4, XS + 0.25, 1.15, 0.98),
  PW(SNAP + 3.4, 1.02), PW(PEND - 0.05, 0.98),
  // CURRENT: the circuit, steady with a slow push · HEAT: the two rods
  EC(E0, 1.04), EC(ES - 0.2, 1.0), EC(EG - 0.2, 0.98), EC(EEND - 2.1, 0.95), HR(H0 + 0.2, 1.04), HR(HEND - 0.05, 0.96),
  // OXIDE: burner + jar, follow the spoon into the jar, close on the shaking jar and litmus, over to the second beaker, wide
  OW(O0, (BRN + JX) / 2, 1.6, 1.04), OW(O0 + 3.4, (BRN + JX) / 2, 1.6, 1.0), OW(O0 + 6.2, JX, 1.15, 1.02), OW(O0 + 15.6, JX, 1.15, 0.97),
  OW(O0 + 19.8, JX, 1.15, 0.95), OW(O0 + 22.0, (JX + BKX) / 2, 1.7, 1.02), OW(O0 + 25.2, (JX + BKX) / 2, 1.7, 1.0), OW(OEND - 0.05, (JX + BKX) / 2, 1.7, 0.97),
  // STATES: the chlorine jar, the bromine drop, the solids, wide
  S(S0, [CLJ, 0.5, 0], 1.25, 1.25, ADIR), S(S0 + 3.4, [CLJ, 0.5, 0], 1.2, 1.2, ADIR), SW(S0 + 5.6, BRD + 0.1, 0.95, 1.02), SW(S0 + 10.6, BRD + 0.1, 0.95, 0.97), SW(S0 + 12.6, SOL + 0.05, 1.2, 1.04), SW(S0 + 18.2, SOL + 0.05, 1.2, 0.98),
  SW(S0 + 20.4, SX - 0.3, 3.4, 1.02), SW(SEND - 0.05, SX - 0.3, 3.4, 0.99),
  // TABLE (dark)
  TAB(TB0, 1.04), TAB(TEND - 0.05, 0.98),
  // INSIDE (dark): both atoms, push to chlorine as it gains, wide again for the two roles
  DK(I0, (NAX + CLX) / 2, 5.6, 3.2, 1.04), DK(I0 + 5.4, (NAX + CLX) / 2, 5.6, 3.2, 1.0), DK(I0 + 7.6, CLX + 0.1, 3.1, 3.0, 1.0), DK(I0 + 9.6, CLX + 0.1, 3.1, 3.0, 0.97),
  DK(I0 + 11.6, (NAX + CLX) / 2, 5.8, 3.3, 1.02), DK(IEND - 0.05, (NAX + CLX) / 2, 5.8, 3.3, 0.98),
  // EQUATION (dark)
  S(Q0, [QX - 0.05, AY - 0.3, 0], 6.6, 3.0, DDIR), S(QEND - 0.05, [QX - 0.05, AY - 0.3, 0], 6.4, 2.9, DDIR),
  // ACIDS
  AC(A0, 1.04), AC(AEND - 0.05, 0.97),
  // COVALENT (dark): both chlorides side by side, then the hydrides, then NaH joins
  DK(B0, BDX, 5.2, 2.6, 1.04), DK(BH - 0.05, BDX, 5.2, 2.6, 0.97), DK(BH, HYX, 4.6, 2.4, 1.04), DK(BH + 7.0, HYX, 4.6, 2.4, 1.0), DK(BH + 9.2, (HYX + NHX) / 2 + 0.2, 6.4, 2.6, 1.02), DK(BEND - 0.05, (HYX + NHX) / 2 + 0.2, 6.4, 2.6, 0.99),
  // PULL e⁻ (dark), then the table again
  DK(N0, ENX, 3.6, 2.4, 1.04), DK(N1 - 0.05, ENX, 3.6, 2.4, 0.96), TAB(N1, 1.04), TAB(NEND - 0.05, 0.99),
  // END: the anvils again
  HW(Z0, 1.04), HW(T.done, 0.98),
];

export default {
  capNear: true, oneText: true,
  duration: T.done,
  fog: [18, 40],
  captions,
  cams,

  build({ scene, cam, R }) {
    const beats = [], fires = [];
    const ST = K.studio({ scene, R }, '815', { dark });                 // FIRST: models read the look
    beats.push((t) => ST.update(t));
    let root = scene;
    const add = (o, x = 0, y = 0, z = 0) => { o.position.set(x, y, z); root.add(o); return o; };
    const stage = (show) => { root = new THREE.Group(); scene.add(root); const g = root; beats.push((t) => { g.visible = show(t); }); return g; };
    const lbl = (text, h, color, x, y, z = 0, w = 700) => add(K.label(text, h, color, w), x, y, z);
    const tags = [], tag = (text, h, color, x, y, z = 0, w = 700) => { const l = lbl(text, 0.1, color, x, y, z, w); l.userData.frac = h * 1.8; tags.push(l); return l; };
    const shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
    const fire = (tint, size, opts) => { const f = K.makeFire(tint, size, opts); fires.push(f); return f; };
    const shinyMetal = (c, r = 0.28) => { const m = new THREE.MeshPhysicalMaterial({ color: c, metalness: 1, roughness: r, envMapIntensity: ST.on ? 1.6 : 1 }); if (ST.on) K.photoEnv('bake/studio.hdr').then((tx) => { m.envMap = tx; m.needsUpdate = true; }); return m; };
    const sulMat = () => M.matte(0xe8c43a, 0.75);                          // sulphur: dull lemon yellow
    const goldE = M.glow(0xffc04d, 2.6);
    const electron = (r = 0.055) => { const e = add(new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), goldE)); e.add(K.glowSprite(0xffc04d, r * 7)); return e; };
    /** tongs bring something down from above to `to` (arrive m0+1.2), let go at m0+1.4, rise away by m0+2.4 */
    const carry = (tg, t, m0, to, gap = 0.03) => {
      const on = t > m0 && t < m0 + 2.4; if (!on) return false;
      const top = to.clone().add(V(0, 1.1, 0));
      tg.position.copy(t < m0 + 1.2 ? top.lerp(to, 1 - (1 - span(t, m0, m0 + 1.2)) ** 2) : t < m0 + 1.5 ? to.clone() : to.clone().lerp(top, easeIn(span(t, m0 + 1.5, m0 + 2.4))));
      tg.userData.set(lerp(gap, gap + 0.05, span(t, m0 + 1.35, m0 + 1.5))); return true;
    };
    /** tongs bring a thing down from above onto `rest` at tIn (… tIn+1.2), let go and rise; at tOut they come back, grip it and
     *  lift it out of the picture (… tOut+1.8). Returns true while the tongs are seen. */
    const visit = (o, tg, t, tIn, tOut, rest, gap = 0.03) => {
      o.visible = t > tIn && t < tOut + 1.8; if (!o.visible) return false;
      const top = rest.clone().add(V(0, 1.1, 0));
      let p = rest.clone(), tp = null, held = false;
      if (t < tIn + 1.2) { p = top.clone().lerp(rest, 1 - (1 - span(t, tIn, tIn + 1.2)) ** 2); tp = p; held = true; }
      else if (t < tIn + 2.4) { tp = rest.clone().lerp(top, easeIn(span(t, tIn + 1.5, tIn + 2.4))); held = t < tIn + 1.35; }
      else if (t > tOut && t < tOut + 0.9) { tp = top.clone().lerp(rest, 1 - (1 - span(t, tOut, tOut + 0.8)) ** 2); held = t > tOut + 0.8; }
      else if (t >= tOut + 0.9) { p = rest.clone().lerp(top, ease(span(t, tOut + 0.9, tOut + 1.8))); tp = p; held = true; }
      o.position.copy(p);
      if (tp) { tg.position.copy(tp).add(V(0, 0.012, 0)); tg.userData.set(held ? gap : gap + 0.05); }
      return !!tp;
    };
    /** tongs move a thing from a to b: down to a, lift, arc over, down and let go at t0+2.4, rise away (… t0+3.2) */
    const move = (tg, t, t0, a, b, gap = 0.03, lift = 0.35) => {
      const on = t > t0 && t < t0 + 3.2; if (!on) return null;
      const A = a.clone().add(V(0, 0.9, 0)), Ab = a.clone().add(V(0, lift, 0)), Bb = b.clone().add(V(0, lift, 0)), Bt = b.clone().add(V(0, 0.9, 0));
      let p, held = true;
      if (t < t0 + 0.8) { p = A.lerp(a, 1 - (1 - span(t, t0, t0 + 0.8)) ** 2); held = false; }
      else if (t < t0 + 1.1) p = a.clone().lerp(Ab, ease(span(t, t0 + 0.85, t0 + 1.1)));
      else if (t < t0 + 1.9) p = K.arc(Ab, Bb, 0.12, ease(span(t, t0 + 1.1, t0 + 1.9)));
      else if (t < t0 + 2.4) p = Bb.clone().lerp(b, ease(span(t, t0 + 1.9, t0 + 2.35)));
      else { p = b.clone().lerp(Bt, easeIn(span(t, t0 + 2.45, t0 + 3.2))); held = false; }
      tg.position.copy(p); tg.userData.set(held ? gap : gap + 0.05); return held ? p : null;
    };
    /** little pieces flung from `at` at t0: each flies on an arc and lands on the anvil top (inside the box) or on the table */
    const shards = (n, mat, at, box, seed = 0, sz = 0.03) => Array.from({ length: n }, (_, i) => {
      const a = hash(i, 1 + seed) * 6.283, sp = 0.3 + hash(i, 2 + seed) * 0.45, r = sz * (0.5 + 0.5 * hash(i, 4 + seed));
      const v = V(Math.cos(a) * sp, 0.5 + hash(i, 3 + seed) * 0.9, Math.sin(a) * sp * 0.55), p0 = at.clone().add(V((hash(i, 5) - 0.5) * 0.06, 0, (hash(i, 6) - 0.5) * 0.05));
      const land = (yl) => (v.y + Math.sqrt(v.y * v.y + 19.6 * Math.max(0, p0.y - yl))) / 9.8;
      let yl = box.y + r * 0.6, tl = land(yl); const xl = p0.x + v.x * tl, zl = p0.z + v.z * tl;
      if (Math.abs(xl - box.x) > box.w || Math.abs(zl) > box.d) { yl = r * 0.6; tl = land(yl); }
      const m = add(K.lump(r, mat, i + 20 + seed, 0.75, 0.55)); m.visible = false;
      return { m, p0, v, tl, yl, spin: (hash(i, 7) - 0.5) * 14 };
    });
    const flyShards = (S, t, t0) => S.forEach(({ m, p0, v, tl, yl, spin }) => {
      const k = t - t0; m.visible = k > 0; if (!m.visible) return;
      const u = Math.min(k, tl); m.position.set(p0.x + v.x * u, u < tl ? p0.y + v.y * u - 4.9 * u * u : yl, p0.z + v.z * u); m.rotation.set(spin * u, spin * 0.6 * u, 0);
    });

    // ================================================================ HOOK / END · a hammer on copper, then on sulphur
    {
      stage((t) => t < P0 - 0.05 || t >= Z0 - 0.05); ST.bake(root, 'hook', 0.3, 3.2, 1.1);
      add(K.anvil(TOPA), AX1, 0, 0); add(K.anvil(TOPA), AX2, 0, 0);
      const cuM = shinyMetal(0xc8763f, 0.3), cu = add(K.lump(0.075, cuM, 4, 0.8, 0.3), AX1, TOPA + 0.06, 0);
      const sM = sulMat(), su = add(K.lump(0.085, sM, 6, 0.85, 0.45), AX2, TOPA + 0.072, 0);
      const bits = shards(14, sM, V(AX2, TOPA + 0.07, 0), { x: AX2, y: TOPA, w: 0.24, d: 0.1 }, 0, 0.032);
      const dust = add(K.smoke(8, 0xf0dc8a), AX2, TOPA + 0.05, 0); dust.scale.setScalar(0.1);
      const hm = add(K.hammer(0.62));
      const HITS = [T.hit1, T.hit2, T.hitS], UP = Math.PI / 2 - 0.8;
      const flatK = (t) => (ease(span(t, T.hit1, T.hit1 + 0.08)) + ease(span(t, T.hit2, T.hit2 + 0.08))) / 2;
      const lCu = tag('copper', 0.05, '#ffd9b8', AX1, TOPA + 0.3, 0.1), lS = tag('sulphur', 0.05, '#fff0a0', AX2, TOPA + 0.3, 0.1);
      const lFlat = tag('goes flat', 0.05, '#ffffff', AX1, TOPA + 0.24, 0.1), lShat = tag('shatters!', 0.055, '#ffffff', AX2, TOPA + 0.3, 0.1);
      const lMet = tag('a metal', 0.05, '#ffd9b8', AX1, TOPA + 0.24, 0.1), lNon = tag('a non-metal', 0.05, '#fff0a0', AX2, TOPA + 0.3, 0.1);
      const lGive = tag('gives electrons', 0.05, '#ffd9b8', AX1 + 0.1, TOPA + 0.24, 0.1), lTake = tag('takes electrons', 0.05, '#fff0a0', AX2, TOPA + 0.3, 0.1);
      beats.push((t) => {
        const f = flatK(t), sy = 1 - 0.68 * f, sxz = 1 + 0.9 * f;
        cu.scale.set(sxz, sy, sxz * 0.9); cu.position.y = TOPA + 0.06 * sy;
        // the hammer: comes down raised, two blows on the copper, lifts and moves over, one blow on the sulphur, lifts away
        let a = UP, k = 0;
        for (const h of HITS) if (t > h - 0.95) k = h;
        if (k) {
          const up = ease(span(t, k - 0.95, k - 0.3)), down = easeIn(span(t, k - 0.3, k)), reb = t > k ? 0.12 * Math.sin(Math.PI * span(t, k, k + 0.25)) : 0;
          const prev = k === T.hit2 ? Math.PI / 2 : UP;
          a = t < k - 0.3 ? lerp(prev, UP, up) : lerp(UP, Math.PI / 2, down) - reb;
        }
        const mv = ease(span(t, T.hit2 + 0.7, T.hitS - 1.2));
        if (t > T.hit2 + 0.3 && t < T.hitS - 0.95) a = lerp(Math.PI / 2 - 0.12, UP, ease(span(t, T.hit2 + 0.3, T.hit2 + 0.9)));
        const surf = mv < 1 ? TOPA + 0.12 * (1 - 0.68 * flatK(Math.max(t, k || 0) + 0.1)) : TOPA + 0.144;
        hm.rotation.z = a; hm.position.set(lerp(AX1, AX2, mv) + HL, surf + 0.18 + 0.25 * Math.sin(Math.PI * mv), 0);
        const enter = 1 - ease(span(t, T.hit1 - 2.0, T.hit1 - 1.2)), leave = ease(span(t, T.hitS + 0.9, T.hitS + 1.8));
        if (t > T.hitS + 0.3) hm.rotation.z = lerp(Math.PI / 2 - 0.12, UP, ease(span(t, T.hitS + 0.3, T.hitS + 0.9)));
        hm.position.y += 1.2 * enter + 1.5 * leave; hm.visible = t > T.hit1 - 2.0 && t < T.hitS + 1.8;
        // the sulphur breaks into pieces at the blow (a puff of yellow dust)
        su.visible = t < T.hitS; flyShards(bits, t, T.hitS);
        dust.visible = t > T.hitS && t < T.hitS + 2.5; dust.userData.update(t - T.hitS, 1 - span(t, T.hitS + 0.8, T.hitS + 2.5));
        K.popIn(lCu, t, T.cu, T.hit1 - 0.4); K.popIn(lS, t, T.s, T.hit2 + 1.2);
        K.popIn(lFlat, t, T.hit2 + 0.3, T.ask); K.popIn(lShat, t, T.hitS + 0.4, T.ask);
        K.popIn(lMet, t, T.ask + 0.4, T.card - 0.2); K.popIn(lNon, t, T.ask + 1.0, T.card - 0.2);
        K.popIn(lGive, t, Z0 + 0.8, 1e9); K.popIn(lTake, t, Z0 + 4.0, 1e9);
      });
    }

    // ================================================================ PULL · copper stretches into wire, sulphur snaps
    {
      stage((t) => t >= P0 - 0.05 && t < PEND); ST.bake(root, 'pull', PX - 0.3, 3.2, 1.0);
      const R0 = 0.035;
      add(K.vise(), XC - 0.05, 0, 0); const vr = add(K.vise(), XC + L0 + 0.05, 0, 0);
      const wire = add(K.solid(new THREE.CylinderGeometry(R0, R0, 1, 32).rotateZ(Math.PI / 2), shinyMetal(0xc8763f, 0.3)), XC + L0 / 2, 0.12, 0);
      add(K.vise(), XS - 0.05, 0, 0); const vs = add(K.vise(), XS + L0 + 0.05, 0, 0);
      const sM = sulMat(), rod = add(K.solid(new THREE.CylinderGeometry(R0, R0, L0, 32).rotateZ(Math.PI / 2), sM), XS + L0 / 2, 0.12, 0);
      const half = (s) => add(K.solid(new THREE.CylinderGeometry(R0, R0, L0 / 2 - 0.006, 32).rotateZ(Math.PI / 2), sM), XS + L0 / 4 + s * L0 / 4, 0.12, 0);
      const hL = half(-1), hR = half(1);
      const crumbs = shards(7, sM, V(XS + L0 / 2, 0.12, 0), { x: 0, y: 0, w: 0, d: 0 }, 3, 0.012);
      const lCu = tag('copper rod', 0.05, '#ffd9b8', XC + 0.15, 0.36, 0.05), lS = tag('sulphur rod', 0.05, '#fff0a0', XS + 0.15, 0.36, 0.05);
      const lWire = tag('a long thin wire', 0.05, '#ffffff', XC + 0.5, 0.36, 0.05), lSnap = tag('snaps ✓', 0.055, '#ffffff', XS + 0.2, 0.36, 0.05);
      const lNot = tag('not malleable, not ductile', 0.05, '#fff0a0', XS + 0.15, 0.36, 0.05);
      beats.push((t) => {
        const k = ease(span(t, PCU, PCU + 3.0)), L = lerp(L0, 1.0, k), r = Math.sqrt(L0 / L);   // same copper, longer and thinner
        vr.position.x = XC + L + 0.05; wire.scale.set(L, r, r); wire.position.x = XC + L / 2;
        // sulphur: the clamp strains a little (anticipation), then the rod snaps and the clamp jerks away
        const strain = 0.012 * ease(span(t, PS, SNAP)), jerk = t > SNAP ? 0.2 * (1 - Math.exp(-(t - SNAP) * 7)) : 0;
        vs.position.x = XS + L0 + 0.05 + strain + jerk;
        rod.visible = t < SNAP; hL.visible = hR.visible = t >= SNAP;
        hR.position.x = XS + L0 * 3 / 4 + strain + jerk; hR.rotation.z = -0.06 * Math.min(1, (t - SNAP) * 4) * (t > SNAP ? 1 : 0);
        flyShards(crumbs, t, SNAP);
        K.popIn(lCu, t, P0 + 0.4, PCU + 1.2); K.popIn(lS, t, P0 + 1.0, SNAP - 0.2);
        K.popIn(lWire, t, PCU + 3.2, PEND); K.popIn(lSnap, t, SNAP + 0.3, SNAP + 2.6); K.popIn(lNot, t, SNAP + 3.0, PEND);
      });
    }

    // ================================================================ CURRENT · the bulb circuit · HEAT · two rods
    {
      stage((t) => t >= E0 - 0.05 && t < HEND); ST.bake(root, 'elec', EX, 5.4, 1.4);
      for (const s of [-1, 1]) { add(K.solid(new THREE.BoxGeometry(0.12, 0.08, 0.12), M.matte(0x22252b, 0.6)), CX + s * 0.25, 0.04, 0); add(K.solid(new THREE.BoxGeometry(0.13, 0.03, 0.13), M.metal(0xb9bec6, 0.3)), CX + s * 0.25, 0.096, 0); }
      add(K.battery(), CX - 0.85, 0, -0.05);
      const inW = add(K.wire([[CX - 0.85, 0.87, -0.05], [CX - 0.8, 0.95, 0.0], [CX - 0.55, 0.42, 0.12], [CX - 0.4, 0.12, 0.06], [CX - 0.31, 0.1, 0]]));
      const outW = add(K.wire([[CX + 0.31, 0.1, 0], [CX + 0.48, 0.07, 0.05], [CX + 0.64, 0.06, 0.03], [CX + 0.72, 0.08, 0]]));
      const backW = add(K.wire([[CX + 0.86, 0.04, -0.09], [CX + 0.5, 0.024, -0.32], [CX - 0.5, 0.024, -0.32], [CX - 0.72, 0.024, -0.14]], 0x2b2f38));
      const lamp = add(K.bulb(), CX + 0.8, 0.0, 0);
      const stripC = new THREE.CatmullRomCurve3([V(CX - 0.3, 0.14, 0), V(CX + 0.3, 0.14, 0)]);
      const pI = add(K.pulses(inW.userData.curve, 5)), pO = add(K.pulses(outW.userData.curve, 3)), pS = add(K.pulses(stripC, 4)), pB = add(K.pulses(backW.userData.curve, 6));
      const TOPC = 0.111;
      const cuS = add(K.solid(new THREE.BoxGeometry(0.72, 0.022, 0.12), shinyMetal(0xc8763f, 0.3)));
      const sS = add(K.solid(new THREE.BoxGeometry(0.72, 0.04, 0.08), sulMat()));
      const gS = add(K.solid(new THREE.CylinderGeometry(0.02, 0.02, 0.72, 20).rotateZ(Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: 0x34373d, metalness: 0.35, roughness: 0.4, clearcoat: 0.4 })));
      const tg = add(K.tongs(0.7));
      const lGap = tag('a gap', 0.05, '#ffffff', CX, 0.3, 0.1), lOff = tag('bulb off', 0.05, '#cfd6e2', CX + 0.8, 0.9, 0);
      const lCu = tag('copper (metal)', 0.05, '#ffd9b8', CX, 0.0, 0.42), lLit = tag('bulb lights', 0.05, '#ffe2a0', CX + 0.8, 0.95, 0);
      const lS = tag('sulphur (non-metal)', 0.05, '#fff0a0', CX, 0.0, 0.42), lNo = tag('no current ✓', 0.055, '#ffffff', CX + 0.8, 0.95, 0);
      const lG = tag('graphite (carbon)', 0.05, '#e6e8ec', CX, 0.0, 0.42), lEx = tag('lights: the exception', 0.055, '#ffe2a0', CX + 0.75, 0.95, 0);
      beats.push((t) => {
        let on = visit(cuS, tg, t, ECU, ECO, V(CX, TOPC + 0.014, 0));
        on = visit(sS, tg, t, ES, ESO, V(CX, TOPC + 0.023, 0), 0.045) || on;
        on = visit(gS, tg, t, EG, 1e9, V(CX, TOPC + 0.02, 0), 0.03) || on;
        tg.visible = on;
        const lit = Math.max(ease(span(t, ECU + 1.45, ECU + 1.75)) * (1 - span(t, ECO + 0.9, ECO + 1.0)), ease(span(t, EG + 1.45, EG + 1.75)));
        lamp.userData.set(lit);
        [pI, pO, pS, pB].forEach((p) => p.userData.update(t, lit, lit > 0.01 ? 1 : 0));
        K.popIn(lGap, t, E0 + 0.5, ECU + 1.0); K.popIn(lOff, t, E0 + 1.0, ECU + 1.4);
        K.popIn(lCu, t, ECU + 1.2, ECO); K.popIn(lLit, t, ECU + 1.9, ECO + 0.9);
        K.popIn(lS, t, ES + 1.2, ESO); K.popIn(lNo, t, ES + 2.0, ESO + 0.6);
        K.popIn(lG, t, EG + 1.2, EEND - 1.6); K.popIn(lEx, t, EG + 2.2, EEND - 1.6);
      });
      // heat: a copper rod (front) and a sulphur rod (behind), wax beads stuck under both, a flame under each far end
      const heatTex = (() => { const c = document.createElement('canvas'); c.width = 4; c.height = 256; const x = c.getContext('2d'); const gr = x.createLinearGradient(0, 256, 0, 0); gr.addColorStop(0.44, '#000'); gr.addColorStop(0.56, '#fff'); x.fillStyle = gr; x.fillRect(0, 0, 4, 256); const tx = new THREE.CanvasTexture(c); tx.wrapT = THREE.ClampToEdgeWrapping; return tx; })();
      const rodM = new THREE.MeshStandardMaterial({ color: 0xc8763f, metalness: 0.9, roughness: 0.28, emissive: 0xff4a10, emissiveIntensity: 0, emissiveMap: heatTex });
      const burners = [ZC, ZS].map((z, i) => {
        add(K.stand(0.72, 0.32), RX - 0.8, 0, z);
        add(K.solid(new THREE.CylinderGeometry(i ? 0.024 : 0.02, i ? 0.024 : 0.02, 1.0, 24).rotateZ(-Math.PI / 2), i ? sulMat() : rodM), RX, 0.72, z);
        const b = add(K.burner(), RX + 0.38, 0, z); fires.push(b.userData.flame); return b;
      });
      const waxM = M.matte(0xf3e9c8, 0.45);
      const wax = BEADX.map((x, i) => add(K.lump(0.028, waxM, i + 5, 1.0, 0.25), x, 0.668, ZC));
      BEADX.forEach((x, i) => add(K.lump(0.028, waxM, i + 9, 1.0, 0.25), x, 0.664, ZS));
      const lRod = tag('copper', 0.05, '#ffd9b8', RX - 0.62, 0.62, ZC + 0.05), lRodS = tag('sulphur', 0.05, '#fff0a0', RX - 0.62, 0.86, ZS);
      const lWax = tag('wax beads', 0.05, '#f3e9c8', RX - 0.07, 0.5, ZC + 0.1);
      const lDrop = tag('the wax drops', 0.05, '#ffffff', RX - 0.1, 0.5, ZC + 0.1), lStay = tag('stays: no heat ✓', 0.055, '#ffffff', RX - 0.05, 0.92, ZS);
      beats.push((t) => {
        burners.forEach((b, i) => { const f = back(span(t, HOT + i * 0.3, HOT + 0.4 + i * 0.3)); b.userData.flame.scale.setScalar(Math.max(1e-4, 0.75 * f)); b.userData.flame.visible = f > 0.01; });
        const front = Math.min(1, Math.max(0, (t - HOT - 0.5) / 3.2));
        heatTex.offset.y = (0.06 + 0.94 * front) - 0.5; rodM.emissiveIntensity = 0.9 * span(t, HOT + 0.3, HOT + 1.0);
        wax.forEach((w, i) => {
          const m = MELT[i], sag = ease(span(t, m - 0.6, m));
          const d = K.drop(t, m, 0.668 - 0.014 * sag, 0.014, 0.33, 0), splat = ease(span(t, m + 0.33, m + 0.45));
          w.position.y = d.y; w.scale.set(1 + 0.7 * splat, Math.max(0.1, 1 + 0.4 * sag - 0.95 * splat), 1 + 0.7 * splat);
        });
        K.popIn(lRod, t, H0 + 0.6, MELT[0] - 0.4); K.popIn(lRodS, t, H0 + 1.2, MELT[0] - 0.4); K.popIn(lWax, t, H0 + 1.8, HOT + 1.2);
        K.popIn(lDrop, t, MELT[0] + 0.4, HEND); K.popIn(lStay, t, MELT[3] + 0.8, HEND);
      });
    }

    // ================================================================ OXIDE · sulphur burns in oxygen → acid; sodium oxide → base
    {
      stage((t) => t >= O0 - 0.05 && t < OEND); ST.bake(root, 'ox', OX - 0.1, 2.9, 1.2);
      const brn = add(K.burner(), BRN, 0, 0); fires.push(brn.userData.flame); brn.userData.flame.scale.setScalar(0.75);
      const jg = add(new THREE.Group(), JX, 0, 0), jar = K.gasJar(0xf2f2ea, 0.17, 0.7); jg.add(jar);
      const gas = jar.userData.gas, lid = jar.userData.lid, lid0 = lid.position.clone(); gas.opacity = 0.03;
      const water = K.liquid(0.15, 0.07, 0x5aa0d8, 0.4); water.position.y = 0.056; jg.add(water);
      add(K.beaker(0.2, 0.45), BKX, 0, 0); add(K.liquid(0.19, 0.28, 0x5aa0d8, 0.38), BKX, 0.055, 0);
      const sp = add(K.spoon(0.6)), sM = new THREE.MeshStandardMaterial({ color: 0xe8c43a, roughness: 0.8, emissive: 0xff5a10, emissiveIntensity: 0 });
      const heap = K.lump(0.03, sM, 41, 0.5, 0.5); heap.position.y = -0.04; sp.add(heap);
      const fl = add(fire(0x3d6bff, 0.32, { core: 0xa8c8ff, embers: false }));
      const blue = add(K.paperStrip([[0, 0], [0.2, 0], [0.42, 0]], 0.06, 0x4a6fd0, 0xd9606c, 0.006)), red = add(K.paperStrip([[0, 0], [0.2, 0], [0.42, 0]], 0.06, 0xd9606c, 0x4a6fd0, 0.006));
      const ptg = add(K.tongs(0.6));
      const white = new THREE.Color(0xf2f2ea);
      const IN = V(JX, 0.42, 0), FL = V(BRN, 0.74, 0), UP = V(BRN, 1.2, 0), OVER = V(JX, 1.2, 0);
      const o = (k) => O0 + k;
      const lJar = tag('oxygen, a little water', 0.05, '#cfe8ff', JX, 0.86, 0.05), lSul = tag('sulphur', 0.05, '#fff0a0', 0, 0, 0);
      const lFlame = tag('burns with a blue flame', 0.05, '#bcd4ff', JX, 0.86, 0.05), lOx = tag('an oxide gas', 0.05, '#ffffff', JX, 0.86, 0.05);
      const lBlue = tag('blue litmus', 0.05, '#9ec0ff', JX, 0.92, 0.05), lAcid = tag('red: acidic ✓', 0.055, '#ff9aa4', JX, 0.92, 0.05);
      const lNaO = tag('sodium oxide water', 0.05, '#ffffff', BKX + 0.05, 0.84, 0.05), lBase = tag('blue: basic', 0.055, '#9ec0ff', BKX + 0.05, 0.84, 0.05);
      beats.push((t) => {
        // the spoon: down into the burner flame, the sulphur melts and catches; over into the jar; out again
        let p;
        if (t < o(2.0)) p = V(BRN, lerp(1.9, FL.y, ease(span(t, o(0.6), o(2.0)))), 0);
        else if (t < o(4.0)) p = FL.clone();
        else if (t < o(4.6)) p = FL.clone().lerp(UP, ease(span(t, o(4.0), o(4.6))));
        else if (t < o(5.4)) p = K.arc(UP, OVER, 0.1, ease(span(t, o(4.6), o(5.4))));
        else if (t < o(10.8)) p = OVER.clone().lerp(IN, ease(span(t, o(5.4), o(6.2))));
        else p = IN.clone().lerp(V(JX, 2.0, 0), easeIn(span(t, o(10.8), o(12.2))));
        sp.position.copy(p); sp.visible = t > o(0.6) && t < o(12.2);
        const melt = ease(span(t, o(2.2), o(3.2))), burnt = ease(span(t, o(6.2), o(10.6)));
        sM.color.set(0xe8c43a).lerp(new THREE.Color(0x8a2a12), melt); sM.emissiveIntensity = 0.5 * melt * (1 - burnt);
        heap.scale.set(1 + 0.2 * melt, Math.max(0.05, (1 - 0.5 * melt) * (1 - 0.9 * burnt)), 1 + 0.2 * melt);
        const small = back(span(t, o(3.0), o(3.4))) * 0.45, big = ease(span(t, o(5.9), o(6.5))) * (1 - ease(span(t, o(10.2), o(10.8))));
        const fk = Math.max(small * (1 - span(t, o(5.9), o(6.2))), big) * (1 + 0.1 * Math.sin(t * 17));
        fl.visible = fk > 0.01; fl.position.copy(p).add(V(0, -0.01, 0)); fl.scale.setScalar(Math.max(1e-4, fk));
        // the lid slides off for the spoon, back on, the jar is shaken; off again for the litmus
        const off = ease(span(t, o(3.4), o(4.0))) * (1 - ease(span(t, o(11.8), o(12.4)))) + ease(span(t, o(15.0), o(15.6)));
        lid.position.set(lid0.x + 0.42 * off, lid0.y - (lid0.y - 0.006) * easeIn(span(off, 0.6, 1)), lid0.z);
        const sh = span(t, o(12.8), o(15.0)); jg.rotation.z = 0.13 * Math.sin(sh * Math.PI * 6) * Math.sin(Math.PI * sh);
        gas.color.copy(white); gas.opacity = 0.03 + 0.5 * ease(span(t, o(6.4), o(10.6))) * (1 - 0.85 * ease(span(t, o(12.8), o(15.0))));
        // the litmus: blue paper into the jar's water → red; red paper into the sodium oxide water → blue
        const dip = (paper, x, bottom, t0) => {
          const top = V(x, bottom + 0.42, 0), from = top.clone().add(V(0, 1.0, 0));
          const pp = t < t0 + 1.4 ? from.lerp(top, 1 - (1 - span(t, t0, t0 + 1.4)) ** 2) : top;
          paper.position.copy(pp).add(V(0, -0.42, 0)); paper.visible = t > t0;
          paper.userData.wet(0.3 * ease(span(t, t0 + 1.6, t0 + 3.4)));
          if (t > t0 && t < t0 + 4.4) { ptg.position.copy(pp).add(V(0, -0.02, 0)); ptg.userData.set(0.012); return true; }
          return false;
        };
        const a = dip(blue, JX - 0.04, 0.07, o(16.0)), b = dip(red, BKX - 0.06, 0.1, o(21.4));
        ptg.visible = a || b;
        lSul.position.copy(p).add(V(-0.24, 0.1, 0.1)); K.popIn(lSul, t, o(1.2), o(4.6));
        K.popIn(lJar, t, o(0.4), o(5.6)); K.popIn(lFlame, t, o(6.4), o(9.4)); K.popIn(lOx, t, o(9.6), o(15.6));
        K.popIn(lBlue, t, o(16.6), o(18.6)); K.popIn(lAcid, t, o(18.9), OEND);
        K.popIn(lNaO, t, o(21.0), o(24.0)); K.popIn(lBase, t, o(24.3), OEND);
      });
    }

    // ================================================================ STATES · chlorine gas, bromine liquid, three solids
    {
      stage((t) => t >= S0 - 0.05 && t < SEND); ST.bake(root, 'states', SX - 0.25, 3.5, 1.1);
      const s = (k) => S0 + k;
      const jar = add(K.gasJar(0xa8e020, 0.17, 0.7), CLJ, 0, 0), lid = jar.userData.lid, lid0 = lid.position.clone();
      jar.userData.gas.opacity = 0.5; const wisp = add(K.smoke(8, 0xb4ec30), CLJ, 0.72, 0); wisp.scale.setScalar(0.2);
      add(K.beaker(0.08, 0.22), BRB, 0, -0.14); add(K.liquid(0.07, 0.09, 0x6a120a, 0.85), BRB, 0.03, -0.14);
      add(K.watchGlass(0.15), BRD, 0, 0.12);
      const dp = add(K.dropper(0.3)), brM = new THREE.MeshPhysicalMaterial({ color: 0x5a0e06, roughness: 0.1, clearcoat: 1, transparent: true, opacity: 0.92 });
      const dropB = add(new THREE.Mesh(new THREE.SphereGeometry(0.02, 16, 12), brM)), pool = add(K.lump(0.045, brM, 3, 0.25, 0.08), BRD, 0.009, 0.12);
      const vap = add(K.smoke(8, 0xb5502a), BRD, 0.03, 0.12); vap.scale.setScalar(0.09);
      add(K.solid(new THREE.BoxGeometry(0.95, 0.03, 0.34), M.gloss(0xf2f0ea)), SOL, 0.015, 0.02);
      const sol = [
        [K.lump(0.06, sulMat(), 7, 0.8, 0.45), -0.32, 0.045],
        [K.lump(0.06, M.matte(0x1d1e21, 0.95), 11, 0.75, 0.6), 0, 0.042],
        [(() => { const g = new THREE.Group(), im = new THREE.MeshPhysicalMaterial({ color: 0x3a2f4a, metalness: 0.55, roughness: 0.3, clearcoat: 0.6 });
          [[0, 0, 0, 0.026], [0.035, -0.004, 0.02, 0.02], [-0.03, -0.006, 0.018, 0.018], [0.01, -0.005, -0.03, 0.02], [-0.02, 0.012, -0.012, 0.016]].forEach(([x, y, z, r], i) => { const c = K.solid(new THREE.BoxGeometry(r * 1.6, r * 0.5, r), im); c.position.set(x, y + 0.006, z); c.rotation.set(0.1 * i, i * 1.3, 0.15); g.add(c); }); return g; })(), 0.32, 0.022],
      ].map(([m, dx, y]) => { add(m); return { m, at: V(SOL + dx, 0.03 + y, 0.02) }; });
      const SOLT = [s(11.4), s(13.4), s(15.4)];
      const tg = add(K.tongs(0.6));
      const lCl = tag('chlorine: a gas', 0.05, '#d8f590', CLJ, 0.98, 0.05), lBr = tag('bromine: a liquid', 0.05, '#ffb09a', BRD + 0.05, 0.5, 0.15);
      const lVap = tag('its red-brown vapour', 0.05, '#ffc0a0', BRD + 0.05, 0.5, 0.15);
      const names = [tag('sulphur', 0.045, '#fff0a0', SOL - 0.32, 0.03, 0.32), tag('carbon', 0.045, '#e6e8ec', SOL, 0.03, 0.32), tag('iodine', 0.045, '#d8c8ff', SOL + 0.32, 0.03, 0.32)];
      const lSol = tag('solids', 0.055, '#ffffff', SOL, 0.3, 0.1);
      const lAll = [tag('gas', 0.055, '#d8f590', CLJ, 0.98, 0.05), tag('liquid', 0.055, '#ffb09a', BRD + 0.05, 0.5, 0.15), tag('solids', 0.055, '#ffffff', SOL, 0.3, 0.1)];
      beats.push((t) => {
        // chlorine: the lid is lifted, yellow-green wisps curl out, the lid goes back
        const up = ease(span(t, s(1.0), s(1.6))) * (1 - ease(span(t, s(4.0), s(4.6))));
        lid.position.set(lid0.x + 0.08 * up, lid0.y + 0.12 * up, lid0.z); lid.rotation.z = -0.35 * up;
        wisp.visible = t > s(1.4) && t < s(6.0); wisp.userData.update(t - s(1.4), up * 1.4 + 0.6 * span(t, s(1.4), s(2.0)) * (1 - span(t, s(4.0), s(6.0))));
        // bromine: the dropper dips into the bottle, moves over the dish, one dark-red drop falls; red-brown vapour rises
        const B0p = V(BRB, 0.1, -0.14), Bt = V(BRB, 0.5, -0.14), Dt = V(BRD, 0.3, 0.12);
        let dpos;
        if (t < s(5.8)) dpos = V(BRB, lerp(1.6, B0p.y, ease(span(t, s(4.8), s(5.8)))), -0.14);
        else if (t < s(6.4)) dpos = B0p.clone().lerp(Bt, ease(span(t, s(6.0), s(6.4))));
        else if (t < s(7.0)) dpos = K.arc(Bt, Dt, 0.05, ease(span(t, s(6.4), s(7.0))));
        else dpos = Dt.clone().add(V(0, 1.4 * easeIn(span(t, s(8.0), s(9.0))), 0));
        dp.position.copy(dpos); dp.visible = t > s(4.8) && t < s(9.0);
        const grow = ease(span(t, s(7.0), s(7.3))), d = K.drop(t, s(7.35), Dt.y - 0.02, 0.025, 0.3, 0);
        dropB.visible = t > s(7.0) && !d.landed; dropB.position.set(BRD, d.y, 0.12); dropB.scale.setScalar(Math.max(1e-4, grow));
        const spread = ease(span(t, s(7.6), s(8.2))); pool.visible = spread > 0.01; pool.scale.set(Math.max(1e-4, spread), Math.max(1e-4, spread), Math.max(1e-4, spread));
        vap.visible = t > s(7.7); vap.userData.update(t - s(7.7), span(t, s(7.7), s(8.6)) * (1 - 0.6 * span(t, s(17), s(22))));
        // the solids: tongs set each one down on the tile
        let on = false;
        sol.forEach(({ m, at }, i) => {
          m.visible = t > SOLT[i];
          const c = carry(tg, t, SOLT[i], at.clone().add(V(0, 0.012, 0)), 0.05); on = on || c;
          m.position.copy(t < SOLT[i] + 1.2 ? tg.position.clone().add(V(0, -0.012, 0)) : at);
        });
        tg.visible = on;
        K.popIn(lCl, t, s(0.5), s(4.8)); K.popIn(lBr, t, s(7.6), s(9.0)); K.popIn(lVap, t, s(9.2), s(10.6));
        names.forEach((l, i) => K.popIn(l, t, SOLT[i] + 1.3, s(18.4)));
        K.popIn(lSol, t, s(18.6), s(20.1)); lAll.forEach((l, i) => K.popIn(l, t, s(20.6) + i * 0.3, 1e9));
      });
    }

    // ================================================================ TABLE (dark) · the 27 non-metals, their states, liquid metals; later the pull arrow
    {
      stage((t) => (t >= TB0 - 0.05 && t < TEND) || (t >= N1 - 0.05 && t < NEND));
      const key = new THREE.DirectionalLight(0xfff2e0, 2.2); key.position.set(TBX - 3, TY(4) + 4, 6); key.target.position.set(TBX, TY(4), 0); root.add(key, key.target);
      const NM = { 1: 'IA', 5: 'IIIA', 6: 'IVA', 14: 'IVA', 7: 'VA', 15: 'VA' };
      [8, 16, 34, 52, 84, 116].forEach((z) => { NM[z] = 'VIA'; }); [9, 17, 35, 53, 85, 117].forEach((z) => { NM[z] = 'VIIA'; }); [2, 10, 18, 36, 54, 86, 118].forEach((z) => { NM[z] = 'VIIIA'; });
      const GAS = [18, 17, 9, 1, 2, 36, 10, 7, 8, 86, 54], SOLID = [6, 53, 15, 34, 14, 16], LM = { 80: 0, 31: 1, 55: 2 };
      const ON = { IA: 1.0, IIIA: 2.0, IVA: 3.0, VA: 4.0, VIA: 5.0, VIIA: 6.0, VIIIA: 7.0 };
      const own = [], rest = [];
      for (let z = 1; z <= 118; z++) { const [r, c] = place(z); (NM[z] || LM[z] !== undefined ? own : rest).push({ z, r, c }); }
      const GREY = new THREE.Color(0x4a4f58), GREEN = new THREE.Color(0x3fae6a), GASC = new THREE.Color(0x7fc4ff), LIQ = new THREE.Color(0xc0442a), SOLC = new THREE.Color(0xd8a83a);
      const SILV = new THREE.Color(0xd8dde4), GOLDC = new THREE.Color(0xe0a63a);
      const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(0.44, 0.44, 0.06), M.gloss(0xffffff), rest.length); root.add(inst);
      const m4 = new THREE.Matrix4(); rest.forEach(({ r, c }, i) => { m4.makeTranslation(COL(c), TY(r), 0); inst.setMatrixAt(i, m4); inst.setColorAt(i, GREY); });
      const tiles = own.map(({ z, r, c }) => { const tl = K.tile(SYM[z], 0xffffff, 0.44, 0.44, 0.08); tl.position.set(COL(c), TY(r), 0.01); root.add(tl); return { z, tl }; });
      const col = new THREE.Color();
      const colorOf = (z, t) => {
        col.copy(GREY);
        if (t >= N1 - 0.1) {                                                   // the pull: non-metals green, group VII gold
          if (NM[z]) col.copy(GREEN).lerp(GOLDC, NM[z] === 'VIIA' ? ease(span(t, N1 + 3.6, N1 + 4.2)) : 0);
          return col;
        }
        if (NM[z]) col.lerp(GREEN, ease(span(t, TB0 + ON[NM[z]], TB0 + ON[NM[z]] + 0.5)));
        if (GAS.includes(z)) col.lerp(GASC, ease(span(t, TB0 + 10.8, TB0 + 11.4)));
        if (z === 35) col.lerp(LIQ, ease(span(t, TB0 + 14.2, TB0 + 14.8)));
        if (SOLID.includes(z)) col.lerp(SOLC, ease(span(t, TB0 + 17.8, TB0 + 18.4)));
        if (LM[z] !== undefined) col.lerp(SILV, ease(span(t, TB0 + 21 + 2 * LM[z], TB0 + 21.5 + 2 * LM[z])));
        return col;
      };
      const flash = (z, t) => (z === 35 ? Math.sin(Math.PI * span(t, TB0 + 14.2, TB0 + 15.2)) : LM[z] !== undefined ? Math.sin(Math.PI * span(t, TB0 + 21 + 2 * LM[z], TB0 + 22 + 2 * LM[z])) : 0);
      const H = 0.75, YT = TY(1) + 0.8;
      const l27 = lbl('27 non-metals', H, '#9ff0b8', COL(9.5), YT), lGas = lbl('most are gases', H, '#bfe2ff', COL(9.5), YT);
      const lLiq = lbl('one liquid: bromine, m.p. 7.2 °C', 0.65, '#ffb09a', COL(9.5), YT), lSol = lbl('a few solids', H, '#ffd88a', COL(9.5), YT);
      const lLM = lbl('liquid metals', H, '#e6ebf2', COL(9.5), YT);
      const lHg = ['mercury: m.p. 38.87 °C', 'gallium: m.p. 29.76 °C', 'cesium: m.p. 28.4 °C'].map((s) => lbl(s, 0.55, '#ffffff', COL(7.5), TY(2.2)));
      const lCorner = lbl('right corner: most electronegative', 0.65, '#ffe08a', COL(7.0), YT), lVII = lbl('group VII: the most electronegative', 0.65, '#ffd27a', COL(9.5), YT);
      const arrow = new THREE.Group(); root.add(arrow);
      const aM = M.glow(0xffc04d, 1.6), shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1, 16).translate(0, 0.5, 0), aM), head = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.42, 24), aM);
      arrow.add(shaft, head);
      const A1 = V(COL(9), TY(6.5), 0.4), A2 = V(COL(16.6), TY(1.6), 0.4), AL = A1.distanceTo(A2);
      arrow.position.copy(A1); arrow.rotation.z = -Math.atan2(A2.x - A1.x, A2.y - A1.y);
      beats.push((t) => {
        if (!shown(inst)) return;
        rest.forEach(({ z }, i) => inst.setColorAt(i, colorOf(z, t))); inst.instanceColor.needsUpdate = true;
        tiles.forEach(({ z, tl }) => { const m = tl.userData.body.material; m.color.copy(colorOf(z, t)); const f = t < N1 - 0.1 ? flash(z, t) : 0; tl.position.z = 0.01 + 0.08 * f; m.emissive.set(0xf0b030); m.emissiveIntensity = 0.6 * f; });
        K.popIn(l27, t, TB0 + 8.0, TB0 + 10.6); K.popIn(lGas, t, TB0 + 11.2, TB0 + 14.0); K.popIn(lLiq, t, TB0 + 14.6, TB0 + 17.6);
        K.popIn(lSol, t, TB0 + 18.2, TB0 + 20.8); K.popIn(lLM, t, TB0 + 21.0, TEND);
        lHg.forEach((l, i) => K.popIn(l, t, TB0 + 21.4 + 2 * i, i < 2 ? TB0 + 23.2 + 2 * i : TEND));
        const g = ease(span(t, N1 + 1.0, N1 + 3.0)), L = Math.max(1e-4, AL * g - 0.42);
        arrow.visible = t >= N1 - 0.05 && g > 0.01; shaft.scale.y = L; head.position.y = L + 0.2;
        K.popIn(lCorner, t, N1 + 1.8, N1 + 4.0); K.popIn(lVII, t, N1 + 4.4, 1e9);
      });
    }

    // ================================================================ INSIDE (dark) · chlorine gains sodium's electron: an anion
    {
      stage((t) => t >= I0 - 0.05 && t < IEND);
      const key = new THREE.DirectionalLight(0xfff2e0, 2.0); key.position.set(NAX, 5, 6); key.target.position.set(CLX, AY, 0); root.add(key, key.target);
      const NA = K.atom([2, 8, 1], 11, 12, 0.45, 0.3), CL = K.atom([2, 8, 7], 17, 18, 0.45, 0.3);
      add(NA.group, NAX, AY, 0); add(CL.group, CLX, AY, 0);
      const x1 = NA.electrons.find((e) => e.shell === 2); x1.e.material = goldE; x1.e.children[0].material = x1.e.children[0].material.clone(); x1.e.children[0].material.color.set(0xffc04d);
      CL.electrons.filter((e) => e.shell === 2).forEach((e, k) => { e.a0 = k / 8 * Math.PI * 2; });
      const cR = CL.electrons.find((e) => e.shell === 2), cTilt = CL.rings[2];
      const fly = electron(0.055), tr = Array.from({ length: 10 }, () => add(K.glowSprite(0xffc04d, 0.16)));
      const i = (k) => I0 + k;
      const lNa = lbl('sodium (metal)', 0.4, '#ffffff', NAX, AY + 1.5), lCl = lbl('chlorine (non-metal)', 0.4, '#ffffff', CLX, AY + 1.5);
      const lNaP = lbl('Na⁺', 0.45, '#ffd9b8', NAX, AY + 1.5, 0, 700), lClM = lbl('Cl⁻ (chloride ion)', 0.4, '#bff0c8', CLX, AY + 1.5, 0, 700); const lNaP2 = lbl('Na⁺', 0.45, '#ffd9b8', NAX, AY + 1.5, 0, 700);
      const l7 = lbl('7 outer electrons', 0.36, '#a8ccff', CLX, AY - 1.45), lAn = lbl('17 +, 18 −: an anion', 0.36, '#bff0c8', CLX, AY - 1.45);
      const lDon = lbl('donor: reducing agent', 0.33, '#ffd9b8', NAX, AY - 1.45), lAcc = lbl('acceptor: oxidizing agent', 0.33, '#bff0c8', CLX, AY - 1.45);
      const lPos = lbl('a + ion', 0.36, '#ffd9b8', NAX, AY - 1.45), lNeg = lbl('a − ion', 0.36, '#bff0c8', CLX, AY - 1.45);
      const lEN = lbl('electronegative: it gains', 0.38, '#ffe08a', CLX, AY - 1.98);
      let hist = [], lastT = -1;
      beats.push((t) => {
        if (!shown(NA.group)) return;
        NA.update(t); CL.update(t);
        // sodium's gold outer electron is pulled out and flies over into chlorine's empty place
        const t0 = i(4.0), t1 = i(5.2), t2 = i(7.2);
        x1.free = t > t0;
        NA.group.updateMatrixWorld(true); CL.group.updateMatrixWorld(true);
        const ring = NA.rings[2], a = x1.a0 + t0 * x1.w, home = ring.localToWorld(V(Math.cos(a) * x1.R, 0, Math.sin(a) * x1.R)), out = NA.group.localToWorld(V(x1.R + 0.35, 0.2, 0.2));
        const pulled = home.clone().lerp(out, ease(span(t, t0, t1)));
        if (x1.free) x1.e.position.copy(ring.worldToLocal(pulled.clone()));
        x1.e.visible = t < t1;
        NA.rings[2].children[0].material.opacity = 0.55 * (1 - span(t, t1, t1 + 0.8));
        const sa = 7 / 8 * Math.PI * 2 + t * cR.w, slot = cTilt.localToWorld(V(Math.cos(sa) * cR.R, 0, Math.sin(sa) * cR.R));
        fly.visible = t > t1; fly.position.copy(t < t2 ? K.arc(pulled, slot, 0.8, ease(span(t, t1, t2))) : slot);
        if (t < lastT || Math.abs(t - lastT) > 0.2) hist = []; lastT = t;
        hist.unshift(fly.position.clone()); hist.length = Math.min(hist.length, 30);
        tr.forEach((s, k) => { s.position.copy(hist[Math.min(hist.length - 1, k * 2)]); s.visible = t > t1 && t < t2; s.material.opacity = 0.6 * (1 - k / tr.length); });
        cTilt.children[0].material.opacity = 0.55 + 0.4 * Math.sin(Math.PI * span(t, t2, t2 + 0.8));   // the full shell flashes
        K.popIn(lNa, t, i(0.4), i(5.4)); K.popIn(lCl, t, i(1.0), i(7.2)); K.popIn(l7, t, i(2.0), i(4.6));
        K.popIn(lNaP, t, i(5.8), i(7.0)); K.popIn(lNaP2, t, i(11.4), 1e9); K.popIn(lClM, t, i(7.6), 1e9); K.popIn(lAn, t, i(8.0), i(11.2));
        K.popIn(lDon, t, i(11.6), i(14.6)); K.popIn(lAcc, t, i(12.6), i(14.6));
        K.popIn(lPos, t, i(14.9), 1e9); K.popIn(lNeg, t, i(15.3), 1e9); K.popIn(lEN, t, i(16.0), 1e9);
      });
    }

    // ================================================================ THE BOARD (dark) · Cl₂ + 2e⁻ → 2Cl⁻ as balls, symbols, words
    {
      stage((t) => t >= Q0 - 0.05 && t < QEND);
      const key = new THREE.DirectionalLight(0xfff2e0, 2.0); key.position.set(QX - 2, 5, 6); key.target.position.set(QX, AY, 0); root.add(key, key.target);
      const q = (k) => Q0 + k, BY = AY + 0.4, clM = M.gloss(0x86d24e);
      const mol = (x) => { const g = add(new THREE.Group(), x, BY, 0); [-0.33, 0.33].forEach((dx) => { const b = K.solid(new THREE.SphereGeometry(0.37, 32, 20), clM); b.position.x = dx; g.add(b); }); return g; };
      const m0 = mol(QX - 2.4), m1 = mol(QX - 2.4);                        // m1 is the one that reacts and travels
      const es = [0, 1].map(() => electron(0.075)), eTr = [0, 1].map(() => electron(0.075));
      const ions = [0, 1].map(() => add(K.ion(0.48, 0x4fc46a, '−')));
      const arrow = add(new THREE.Group(), QX - 0.25, BY, 0), aM = M.glow(0xf6d48f, 1.2);
      arrow.add(Object.assign(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.55, 12).rotateZ(Math.PI / 2).translate(0.275, 0, 0), aM)), Object.assign(new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 16).rotateZ(-Math.PI / 2).translate(0.62, 0, 0), aM)));
      const WY = AY - 1.12, SY = AY - 0.45;
      const words = [['chlorine', -2.4, 0.6], ['+', -1.75, 3.2], ['2 electrons', -1.0, 3.0], ['2 chloride ions', 1.75, 6.8]].map(([s, x, k]) => ({ l: lbl(s, 0.34, '#ffffff', QX + x, WY), k }));
      const syms = [['Cl₂', -2.4, 8.2], ['+', -1.75, 8.6], ['2e⁻', -1.0, 9.0], ['→', 0.12, 9.4], ['2Cl⁻', 1.75, 9.8]].map(([s, x, k]) => ({ l: lbl(s, 0.44, '#f6d48f', QX + x, SY, 0, 700), k }));
      const EP = [V(QX - 1.15, BY, 0), V(QX - 0.85, BY, 0)];
      beats.push((t) => {
        // two electrons fly in from the left (from a metal) and wait beside the molecule
        es.forEach((e, k) => { const u = ease(span(t, q(1.4 + 0.3 * k), q(2.6 + 0.3 * k))); e.visible = u > 0.01; e.position.copy(K.arc(V(QX - 3.4, BY + 0.8, 0), EP[k], 0.3, u)).add(V(0, 0.03 * Math.sin(t * 3 + k), 0)); });
        // a copy of the molecule and its two electrons travels along the arrow and splits into two bigger chloride ions
        const go = ease(span(t, q(4.4), q(5.8))), sp = ease(span(t, q(5.8), q(6.6)));
        m1.visible = t > q(4.4) && sp < 0.6; m1.position.x = lerp(QX - 2.4, QX + 1.75, go);
        eTr.forEach((e, k) => { e.visible = m1.visible; e.position.copy(EP[k]).lerp(V(QX + 1.75 + (k ? 0.33 : -0.33), BY + 0.4, 0), go); });
        ions.forEach((o, k) => { o.visible = sp > 0.3; o.position.set(QX + 1.75 + (k ? 1 : -1) * lerp(0.33, 0.56, sp), BY, 0); o.scale.setScalar(Math.max(1e-4, back(span(t, q(5.9), q(6.5))))); });
        arrow.visible = t > q(4.2); arrow.scale.setScalar(Math.max(1e-4, back(span(t, q(4.2), q(4.6)))));
        words.forEach(({ l, k }) => K.popIn(l, t, q(k), 1e9)); syms.forEach(({ l, k }) => K.popIn(l, t, q(k), 1e9));
      });
    }

    // ================================================================ ACIDS · zinc pushes hydrogen out, sulphur can't
    {
      stage((t) => t >= A0 - 0.05 && t < AEND); ST.bake(root, 'acid', ACX, 1.9, 1.2);
      [ZB, SB].forEach((x) => { add(K.beaker(BR, 0.42), x, 0, 0); add(K.liquid(BR - 0.01, 0.24, 0xcfe9e6, 0.28), x, AY0, 0); });
      add(K.solid(new THREE.BoxGeometry(0.62, 0.02, 0.18), M.gloss(0xf2f0ea)), ACX, 0.01, 0.42);
      const PZ = V(ZB + 0.12, 0.02 + 0.03, 0.42), PSu = V(SB - 0.12, 0.02 + 0.035, 0.42);
      const zn = add(K.lump(0.04, M.metal(0x9aa3ad, 0.4), 5, 0.8, 0.5)), su = add(K.lump(0.045, sulMat(), 8, 0.8, 0.45));
      const tg = add(K.tongs(0.6)), fz = add(K.bubbles(18, V(), SURF + 0.01, 0.08, 0.009)), spZ = add(K.splash(0xffffff, 0.16), ZB, SURF, 0), spS = add(K.splash(0xffffff, 0.16), SB, SURF, 0);
      const a = (k) => A0 + k;
      const lAcid = tag('dilute acid', 0.05, '#d8f0ec', ACX, 0.72, 0), lZn = tag('zinc', 0.05, '#ffffff', PZ.x, 0.12, 0.45), lSu = tag('sulphur', 0.05, '#fff0a0', PSu.x, 0.12, 0.45);
      const lH = tag('hydrogen gas ✓', 0.055, '#ffffff', ZB - 0.05, 0.62, 0.05), lNo = tag('no gas ✗', 0.055, '#ffffff', SB + 0.05, 0.62, 0.05);
      const sink = (t, t1, y0) => (t < t1 ? 0 : (y0 - AY0 - 0.04) * ease(span(t, t1 + 0.08, t1 + 0.9)));
      beats.push((t) => {
        const pz = t < a(5) ? move(tg, t, a(1.2), PZ, V(ZB, SURF + 0.18, 0), 0.03) : null;
        const tz = a(3.6); zn.position.copy(t < a(2.05) ? PZ : pz ?? V(ZB, SURF + 0.18 - (t > tz ? Math.min(0.18, (t - tz) * 1.6) : 0) - sink(t, tz + 0.11, SURF), 0));
        spZ.userData.update(t - tz - 0.11);
        fz.visible = t > tz + 0.8; fz.userData.update(t, ease(span(t, tz + 0.8, tz + 1.6)), V(ZB, AY0 + 0.05, 0));
        const ps = t >= a(6.6) ? move(tg, t, a(6.6), PSu, V(SB, SURF + 0.18, 0), 0.035) : null;
        const ts = a(9.0); su.position.copy(t < a(7.45) ? PSu : ps ?? V(SB, SURF + 0.18 - (t > ts ? Math.min(0.18, (t - ts) * 1.6) : 0) - sink(t, ts + 0.11, SURF), 0));
        spS.userData.update(t - ts - 0.11);
        tg.visible = (t > a(1.2) && t < a(4.4)) || (t > a(6.6) && t < a(9.8));
        K.popIn(lAcid, t, a(0.3), a(3.0)); K.popIn(lZn, t, a(0.6), a(2.4)); K.popIn(lH, t, tz + 1.4, AEND);
        K.popIn(lSu, t, a(6.2), a(8.0)); K.popIn(lNo, t, ts + 1.4, AEND);
      });
    }

    // ================================================================ COVALENT (dark) · ionic vs covalent chlorides · hydrides
    {
      stage((t) => t >= B0 - 0.05 && t < N0);
      const key = new THREE.DirectionalLight(0xfff2e0, 2.0); key.position.set(BDX, 5, 6); key.target.position.set(BDX + 5, AY, 0); root.add(key, key.target);
      const b = (k) => B0 + k;
      const ball = (r, c, x, y = AY) => add(K.solid(new THREE.SphereGeometry(r, 32, 20), M.gloss(c)), x, y, 0);
      // NaCl: two ions pull together (nothing shared) · HCl: an H atom joins a Cl atom; one electron from each makes the pair
      const na = add(K.ion(0.3, 0xe58a3a, '+')), cl = add(K.ion(0.5, 0x4fc46a, '−'));
      const h = ball(0.22, 0xf4f4f4, 0), c2 = ball(0.42, 0x86d24e, HCX + 0.3);
      const pair = [electron(0.05), electron(0.05)];
      const lI = lbl('NaCl: ionic', 0.36, '#ffd9b8', NCX, AY - 0.95), lC = lbl('HCl: covalent', 0.36, '#bff0c8', HCX, AY - 0.95), lP = lbl('a shared pair', 0.32, '#ffe08a', HCX - 0.25, AY + 0.66);
      // hydrides: H₂O, NH₃, CH₄ (one H at a time, each bond gets its shared pair) · NaH: ions
      const mols = [[HYX - 1.5, 0xe0483c, 0.27, 'H₂O', [[-0.3, -0.22, 0], [0.3, -0.22, 0]]], [HYX, 0x4a7be0, 0.27, 'NH₃', [[-0.32, -0.16, 0.05], [0.32, -0.16, 0.05], [0, -0.2, -0.32]]],
        [HYX + 1.5, 0x3a3d42, 0.27, 'CH₄', [[0, 0.38, 0], [-0.34, -0.14, 0.12], [0.34, -0.14, 0.12], [0, -0.14, -0.36]]]].map(([x, c, r, s, hs], m) => ({
        core: ball(r, c, x), hs: hs.map((p) => ({ s: ball(0.15, 0xf4f4f4, x), at: V(x, AY, 0).add(V(...p)) })), x, l: lbl(s, 0.42, '#ffffff', x, AY - 0.85, 0, 700), m }));
      const nah = [add(K.ion(0.3, 0xe58a3a, '+')), add(K.ion(0.34, 0xf4f4f4, '−'))];
      const lHy = lbl('many covalent hydrides', 0.38, '#bff0c8', HYX, AY + 0.95), lNaH = lbl('NaH: ionic (few)', 0.4, '#ffd9b8', NHX, AY - 0.85, 0, 700);
      beats.push((t) => {
        if (!shown(na)) return;
        const pull = easeIn(span(t, b(0.6), b(1.8))), jolt = t > b(1.8) ? 0.04 * Math.exp(-(t - b(1.8)) * 6) * Math.sin((t - b(1.8)) * 18) : 0;
        na.position.set(lerp(NCX - 0.8, NCX - 0.4, pull) - jolt, AY, 0); cl.position.set(lerp(NCX + 0.75, NCX + 0.4, pull) + jolt, AY, 0);
        const hj = ease(span(t, b(5.0), b(6.4))); h.position.set(lerp(HCX - 1.0, HCX - 0.62, hj), AY, 0); h.visible = t > b(4.6); h.scale.setScalar(Math.max(1e-4, back(span(t, b(4.6), b(5.0)))));
        const join = ease(span(t, b(6.4), b(7.4))), mid = V(HCX - 0.26, AY, 0.05);
        pair.forEach((e, k) => {
          const from = k ? c2.position.clone().add(V(-0.3, 0.32, 0.2)) : h.position.clone().add(V(0.05, 0.25, 0.15));
          e.visible = t > b(5.6) && t < BH + 0.2; e.position.copy(from.lerp(mid.clone().add(V(0, (k ? -1 : 1) * 0.08, 0)), join));
          e.scale.setScalar(1 + 0.4 * Math.sin(Math.PI * span(t, b(7.4), b(8.2))));
        });
        K.popIn(lI, t, b(2.0), BH); K.popIn(lC, t, b(7.6), BH); K.popIn(lP, t, b(8.2), BH);
        mols.forEach(({ hs, x, l, m }) => {
          hs.forEach(({ s, at }, k) => { const u = ease(span(t, BH + 0.6 + m * 1.8 + k * 0.45, BH + 1.0 + m * 1.8 + k * 0.45)); s.visible = u > 0.01; s.position.copy(V(x, AY, 0).add(at.clone().sub(V(x, AY, 0)).multiplyScalar(1 + 1.6 * (1 - u)))); });
          K.popIn(l, t, BH + 1.6 + m * 1.8, BH + 8.6);
        });
        const nj = easeIn(span(t, BH + 9.4, BH + 10.4));
        nah[0].position.set(lerp(NHX - 0.9, NHX - 0.32, nj), AY, 0); nah[1].position.set(lerp(NHX + 0.9, NHX + 0.32, nj), AY, 0);
        nah.forEach((o) => { o.visible = t > BH + 8.8; o.scale.setScalar(Math.max(1e-4, back(span(t, BH + 8.8, BH + 9.3)))); });
        K.popIn(lHy, t, BH + 6.2, BH + 8.6); K.popIn(lNaH, t, BH + 10.6, 1e9);
      });
    }

    // ================================================================ PULL e⁻ (dark) · chlorine pulls the shared pair: electronegativity
    {
      stage((t) => t >= N0 - 0.05 && t < N1);
      const key = new THREE.DirectionalLight(0xfff2e0, 2.0); key.position.set(ENX - 2, 5, 6); key.target.position.set(ENX, AY, 0); root.add(key, key.target);
      const n = (k) => N0 + k;
      add(K.solid(new THREE.SphereGeometry(0.3, 32, 20), M.gloss(0xf4f4f4)), ENX - 1.05, AY, 0);
      add(K.solid(new THREE.SphereGeometry(0.55, 40, 24), M.gloss(0x86d24e)), ENX + 0.75, AY, 0);
      const stick = add(new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.0, 12).rotateZ(Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x6f9fe8, transparent: true, opacity: 0.5, toneMapped: false })), ENX - 0.25, AY, 0);
      const pair = [electron(0.07), electron(0.07)];
      const lH = lbl('H', 0.3, '#ffffff', ENX - 1.05, AY + 0.62, 0, 700), lCl = lbl('Cl', 0.3, '#ffffff', ENX + 0.75, AY + 0.95, 0, 700);
      const lP = lbl('the shared pair', 0.3, '#ffe08a', ENX - 0.4, AY - 0.66), lPull = lbl('chlorine pulls it closer', 0.3, '#bff0c8', ENX - 0.1, AY - 0.66);
      const lDef = lbl('electronegativity: the pull on a shared pair', 0.27, '#ffe08a', ENX - 0.15, AY - 1.06);
      beats.push((t) => {
        const k = ease(span(t, n(2.0), n(4.0))), x = lerp(ENX - 0.4, ENX + 0.04, k);
        pair.forEach((e, i) => { const a = t * 2.2 + i * Math.PI; e.position.set(x + 0.05 * Math.cos(a), AY + 0.1 * Math.sin(a), 0.12 * Math.cos(a)); });
        void stick;
        K.popIn(lH, t, n(0.3), 1e9); K.popIn(lCl, t, n(0.6), 1e9);
        K.popIn(lP, t, n(1.0), n(3.6)); K.popIn(lPull, t, n(4.0), 1e9); K.popIn(lDef, t, n(5.4), 1e9);
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'What makes a non-metal?', intro: INTRO, ticks: TICKS,
      rows: [[0, 'copper · sulphur'], [1, 'not malleable, not ductile'], [1, 'no current, no heat (but graphite)'], [1, 'acidic oxide: blue litmus → red'], [1, 'a gas, a liquid or a solid'],
        [1, 'gains electrons: an anion'], [1, 'can\'t push hydrogen out of acids'], [1, 'covalent chlorides, hydrides'], [1, 'pulls shared pairs']],
      short: ['shape', 'current, heat', 'oxide', 'states', 'gains e⁻', 'acids', 'covalent', 'pull'] }));
    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));
    beats.push(() => { const nar = Math.min(1, (cam.aspect / 1.5) ** 0.7); tags.forEach((l) => { if (l.visible) l.scale.multiplyScalar(cam.position.distanceTo(l.position) * 2 * TAN * l.userData.frac * nar / 0.1); }); });

    return (t, dt) => { for (const b of beats) b(t, dt); };
  },
};
