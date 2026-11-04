// Lesson 814 · Noble metals (book pp. 236–239: 8.1.5 Inertness of Noble Metals, Fig. 8.4, commercial value of silver,
// platinum and gold, Society box), v1 (2026-10-14). Built from SKILL §0 + the approved 804/805/813 patterns.
// THE QUESTION: "Why does gold never rust?" → card: damp air · inside · noble, found free · valuable · silver · platinum · gold.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//   HOOK    a slice of old ground: tongs pull out an old iron nail (eaten by rust) and an old gold coin (still shining)
//           · same ground, same years: why so different? → card.
//   AIR     a new nail and a gold ring go into a glass box over water (damp air); day 1, 2, 3: the nail rusts, the ring
//           stays shiny · noble metals resist corrosion in moist air, unlike most metals (tick 1).
//   WHY     (dark) to react, a metal gives away electrons: sodium lets go at once (short bar, reacts in seconds), iron
//           harder (rusts in days), gold holds on (tall bar: high ionization energy, low reactivity) (tick 2).
//   TABLE   (dark) gold among the transition metals; the 8 noble metals Ru Rh Pd Ag Os Ir Pt Au light up; some chemists
//           add Hg, Re, Cu.
//   GROUND  a slice of the ground: pure gold, platinum, silver sit in the rock (found free) · tiny bits: rare (tick 3).
//   VALUE   board (high technology), necklace (jewellery, art), bars (metallurgy) · silver, platinum, gold bars:
//           precious metals, high value (tick 4).
//   SILVER  back in the ground: silver's four forms (pure, in a mineral, natural alloy, a little in other ores) · pure
//           silver dents under a hammer · melted with copper → alloy: hardly dents · coins, jewellery, tableware · film
//           (AgCl + AgBr) darkens in light · hammered into a sheet, drawn into a wire · carries heat (wax melts),
//           electricity (bulb), reflects light (mirror) best of all metals (tick 5).
//   PLAT    platinum beside silver: "platina" = little silver · (dark) 72 elements by how common: platinum 72nd → rare,
//           expensive · heavy (lands hard), soft and malleable (hammer), ductile (drawn into a wire), red hot in a flame
//           but melts only at 1770 °C · acid: zinc fizzes, platinum nothing · two cars: dirty smoke vs the catalytic
//           converter (palladium a cheaper alternate) · a turntable of uses: jewellery, dental fillings, surgical tools,
//           lab apparatus, electrical industry, lasers, photographic materials (tick 6).
//   GOLD    a necklace: luster, colour, never tarnishes · hammered into a sheet, drawn into a wire · pure gold dents ·
//           melted with Cu, Ag, Pt and cast: lasts longer · gold coins → paper money · computers: gold contacts carry
//           signals · dentistry: a gold crown (inert, non-allergic, easy to work) (tick 7).
//   SOCIETY (dark) the table again: gold and silver best known; the platinum group as printed (Re, Rh, Pd, Os, Ir, Pt),
//           platinum most traded; Pu and U precious · old coins of Cu, Ag, Au (luster, malleable); copper the common
//           coin metal; coins today: Cu–Ni alloy.
//   END     back at the dug-up nail and coin: iron gives electrons away and rusts, gold holds them and never rusts.
// Book note: the Society box lists rhenium in the platinum group (it is ruthenium): shown as printed (NOTES.md).
// §1 CHECK (sheets renders/lesson/o814*.jpg, s814*.jpg, scr814.jpg): nothing missing (8.1.5, Fig. 8.4, silver, platinum, gold,
// Society box) ✓ · one question + bridges ✓ · familiar hook (a rusty nail, a gold coin) paid off at the end ✓ · comparisons
// side by side (nail/ring, pure/alloy, zinc/platinum, two cars) ✓ · each test: before → visible cause (tongs, damp box, hammer,
// lamp, flame, acid) → labelled result ✓ · numbers as things (bars, 72 bars) ✓ · ≤ 3 labels a shot ✓ · one place at a time ✓ ·
// camera moves ≥ 2 s ✓ · baked tables, dark atoms/tables/bars ✓ · own colours (gold, silver, rust, blue water, green acid) ✓ ·
// every screen ✓ · flicker 0 ✓.
import * as THREE from 'three';
import * as K from './kit.js';
import { place } from '../games/u3data.js';
const { M, span, ease, easeIn, back, lerp } = K;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

const TAN = Math.tan(16 * Math.PI / 180), ASP = 1.6, ADIR = [0, 0.45, 1], DDIR = [0, 0.12, 1];
let DOCK = 1e9;
/** a shot: the subject (look, w × h) seen along dir; the engine refits it to the real screen (fit = 6th element) */
function S(t, look, w, h, dir = ADIR, e) {
  h *= 1.14; look = [look[0], look[1] + 0.05 * h, look[2]];        // headroom: the caption floats just above the subject (capNear)
  const dk = t >= DOCK, d = V(...dir).normalize(), dist = Math.max(h / 2 / TAN, (dk ? w / (1 - K.DOCK_W) : w) / 2 / (TAN * ASP)) * 1.1;
  const pos = V(...look).addScaledVector(d, dist).toArray(), fit = { look, w, h, dir, dock: dk ? K.DOCK_W : 0 };
  return dk ? [t, ...K.dockShot(pos, look), undefined, e, fit] : [t, pos, look, undefined, e, fit];
}

// ---------------------------------------------------------------- places (stations ~10 apart)
const EX = -0.4, TLX = 0.5, TT = 0.03, EH = 0.36;                          // hook: slice of ground · white tile
const AX = 10, AL = 0.07, BLK = 0.14;                                      // damp-air box (water level) · stone blocks inside
const YNA = 20, YFE = 24.9, YAU = 30.0, AY = 1.9;                          // why: three atoms
const TBX = 40, TP = 0.5, COL = (c) => TBX + (c - 9.5) * TP, TY = (r) => 4.6 - (r - 1) * TP - (r > 7 ? 0.25 : 0);
const GX = 52, GW = 1.8, GH = 0.8, GD = 0.5, FACE = GD / 2;               // the slice of the ground
const POCK = { au: [-0.55, 0.58], pt: [0, 0.58], ag: [0.55, 0.58], min: [-0.55, 0.25], mix: [0, 0.25], ore: [0.55, 0.25] };
const VX = 62;                                                             // value: board, necklace, three bars
const SX = 72;                                                             // silver
const QX = 84;                                                             // 72 elements (dark)
const PX = 95;                                                             // platinum
const GDX = 106;                                                           // gold
const CX0 = 116;                                                           // coins

// ---------------------------------------------------------------- time (every camera move ≥ 2 s)
const T = { name: 0.6, m1: 2.6, m2: 6.4, ask: 12.4, card: 15.0 };
DOCK = T.card + 5.0;
const A0 = DOCK + 2.0, MN = A0 + 2.4, MR = A0 + 5.6, LID = A0 + 9.0, DAYS = [A0 + 11.0, A0 + 12.6, A0 + 14.2], AEND = A0 + 19.5;
const Y0 = AEND, YP = Y0 + 2.2, YF = Y0 + 9.0, YA = Y0 + 15.6, YW = Y0 + 19.5, YEND = Y0 + 24;
const TB0 = YEND, TEND = TB0 + 13;
const G0 = TEND, GEND = G0 + 12;
const V0 = GEND, VEND = V0 + 16;
const S0 = VEND, OPEN = [S0 + 2.0, S0 + 4.0, S0 + 6.0], SEND = S0 + 9.5;
const SV0 = SEND, SV1 = SV0 + 22, SV2 = SV1 + 7, SV3 = SV2 + 8, SVEND = SV3 + 16.5;
const P0 = SVEND, P0E = P0 + 6;
const Q0 = P0E, QEND = Q0 + 8;
const P2 = QEND, P3 = P2 + 14, P4 = P3 + 8.5, P5 = P4 + 10, PEND = P5 + 17.5;
const GD0 = PEND, GDEND = GD0 + 35;
const TB2 = GDEND, TB2E = TB2 + 14;
const C0 = TB2E, CEND = C0 + 10.5;
const END = CEND; T.done = END + 9;
const INTRO = [T.card, DOCK];
const TICKS = [[AEND - 0.6, 0], [YEND - 0.6, 1], [GEND - 0.6, 2], [VEND - 0.6, 3], [SVEND - 0.6, 4], [PEND - 0.6, 5], [GDEND - 0.6, 6]];
const dark = (t) => [[Y0, YEND], [TB0, TEND], [Q0, QEND], [TB2, TB2E]].some(([a, b]) => t >= a - 0.05 && t < b - 0.05);

const captions = [
  [0.3, T.m1, 'Dug up from old ground'],
  [T.m1, T.m2 - 0.2, 'An iron nail: eaten by rust'],
  [T.m2 - 0.2, T.ask, 'A gold coin: still shining!'],
  [T.ask, T.card, 'Same ground, same years. Why?'],
  [T.card, DOCK, 'Why does gold never rust?'],
  [DOCK, A0, 'Let\'s test it in damp air'],
  [A0, MN, 'A new iron nail and a gold ring'],
  [MN, LID, 'Both go into a box of damp air'],
  [LID, DAYS[2] + 1.0, 'Wait a few days…'],
  [DAYS[2] + 1.0, A0 + 16.4, 'The iron rusts'],
  [A0 + 16.4, AEND, 'The gold stays shiny: a noble metal ✓'],
  [Y0, YP, 'To react, a metal gives away electrons'],
  [YP, Y0 + 6.5, 'Sodium lets go at once: reacts in seconds'],
  [Y0 + 6.5, Y0 + 13.0, 'Iron lets go harder: rusts in days'],
  [Y0 + 13.0, YW, 'Gold holds on: high ionization energy'],
  [YW, YEND, 'It holds its electrons: low reactivity ✓'],
  [TB0, TB0 + 4, 'Gold is a transition metal'],
  [TB0 + 4, TB0 + 9, 'Eight noble metals: they resist rust'],
  [TB0 + 9, TEND, 'Some chemists add mercury, rhenium, copper'],
  [G0, G0 + 6.4, 'In the ground they are found pure'],
  [G0 + 6.4, G0 + 8.8, 'Found free in nature ✓'],
  [G0 + 8.8, GEND, 'Only tiny bits in a lot of rock: rare'],
  [V0, V0 + 3.2, 'So why are noble metals so valuable?'],
  [V0 + 3.2, V0 + 9, 'They last, they are rare, and useful'],
  [V0 + 9, V0 + 12.5, 'Silver, platinum, gold: precious metals'],
  [V0 + 12.5, VEND, 'Expensive: great economic value ✓'],
  [S0, OPEN[0], 'Silver: a soft white metal'],
  [OPEN[0], SEND, 'In nature it hides four ways'],
  [SV0, SV0 + 3.2, 'Pure silver is very soft'],
  [SV0 + 3.2, SV0 + 8.4, 'Melt it with a little copper'],
  [SV0 + 8.4, SV0 + 11.6, 'Poured out: an alloy'],
  [SV0 + 11.6, SV0 + 17.5, 'The alloy is harder ✓'],
  [SV0 + 17.5, SV1, 'Coins, jewellery and tableware'],
  [SV1, SV1 + 4.4, 'Camera film: silver chloride + silver bromide'],
  [SV1 + 4.4, SV2, 'Light darkens it: a photo ✓'],
  [SV2, SV2 + 3.4, 'Silver hammers into sheets…'],
  [SV2 + 3.4, SV3, '…and draws into wires'],
  [SV3, SV3 + 5.8, 'Silver carries heat best'],
  [SV3 + 5.8, SV3 + 9.4, '…and electricity'],
  [SV3 + 9.4, SV3 + 12.6, 'It reflects light best of all'],
  [SV3 + 12.6, SVEND, 'Better than any other metal ✓'],
  [P0, P0 + 3, 'Platinum looks like silver'],
  [P0 + 3, P0E, 'Its name: platina, "little silver"'],
  [Q0, Q0 + 4, 'Elements, from most common to rarest'],
  [Q0 + 4, QEND, 'Platinum is only 72nd: rare, so expensive ✓'],
  [P2, P2 + 3.2, 'Platinum is heavy'],
  [P2 + 3.2, P2 + 5, 'soft and malleable'],
  [P2 + 5, P2 + 8.6, 'ductile: easy to draw into wires'],
  [P2 + 8.6, P3, 'It melts only at 1770 °C'],
  [P3, P3 + 3, 'Acid on zinc and on platinum'],
  [P3 + 3, P3 + 6, 'Zinc fizzes'],
  [P3 + 6, P4, 'Platinum: no reaction, not even with oxygen ✓'],
  [P4, P4 + 2.8, 'Car exhaust smoke pollutes the air'],
  [P4 + 2.8, P4 + 7, 'Platinum in a converter cleans it ✓'],
  [P4 + 7, P5, 'Palladium is a cheaper alternate'],
  [P5, P5 + 5, 'Easy to shape, strong, never tarnishes'],
  [P5 + 5, P5 + 12, 'Unreactive: safe in teeth, tools and labs'],
  [P5 + 12, PEND, 'Also wires, lasers and photo materials ✓'],
  [GD0, GD0 + 4.5, 'Gold: shiny, golden, never tarnishes'],
  [GD0 + 4.5, GD0 + 7.5, 'It hammers into sheets…'],
  [GD0 + 7.5, GD0 + 10.5, '…and draws into wires'],
  [GD0 + 10.5, GD0 + 12.6, 'But pure gold is too soft'],
  [GD0 + 12.6, GD0 + 15.6, 'Melt it with copper, silver, platinum'],
  [GD0 + 15.6, GD0 + 18.2, 'Cast into shapes'],
  [GD0 + 18.2, GD0 + 20.5, 'The alloy lasts longer ✓'],
  [GD0 + 20.5, GD0 + 23, 'Long ago, coins were gold'],
  [GD0 + 23, GD0 + 25, 'Then paper money took over'],
  [GD0 + 25, GD0 + 29.5, 'Computers: gold carries signals reliably ✓'],
  [GD0 + 29.5, GDEND, 'Teeth: gold is inert and non-allergic ✓'],
  [TB2, TB2 + 3.5, 'Noble metals: rare, lasting, valuable'],
  [TB2 + 3.5, TB2 + 8.5, 'Precious too: the platinum group metals'],
  [TB2 + 8.5, TB2 + 11, 'Plutonium and uranium: precious as well'],
  [TB2 + 11, TB2E, 'Noble: less reactive than most metals ✓'],
  [C0, C0 + 4, 'Old coins: copper, silver and gold'],
  [C0 + 4, C0 + 6, 'Copper: the common coin metal'],
  [C0 + 6, CEND, 'Coins today: copper–nickel alloy ✓'],
  [END, END + 4, 'Iron gives electrons away: it rusts'],
  [END + 4, T.done, 'Gold holds them: it never rusts ✓'],
];

// ---------------------------------------------------------------- camera
const HW = (t, k = 1, e) => S(t, [0.02, 0.3, 0.05], 1.9 * k, 1.0 * k, ADIR, e);
const HC = (t, k = 1, e) => S(t, [TLX + 0.13, 0.1, 0.06], 0.85 * k, 0.45 * k, ADIR, e);
const AW = (t, k = 1, e) => S(t, [AX, 0.24, 0.18], 1.45 * k, 0.78 * k, ADIR, e);
const AC = (t, k = 1, e) => S(t, [AX, 0.24, 0], 1.4 * k, 0.65 * k, ADIR, e);
const AT = (t, x, k = 1, e) => S(t, [x + 0.5, AY + 0.05, 0], 3.3 * k, 3.1 * k, DDIR, e);
const TAB = (t, k = 1, e) => S(t, [TBX, 2.65, 0], 9.4 * k, 5.9 * k, DDIR, e);
const GG = (t, k = 1, e) => S(t, [GX, 0.45, FACE], 2.0 * k, 1.0 * k, [0, 0.25, 1], e);
const GL = (t, k = 1, e) => S(t, [GX, 0.3, FACE], 1.85 * k, 0.6 * k, [0, 0.25, 1], e);
const SH = (t, x, y, w, h, k = 1, e) => S(t, [x, y, 0], w * k, h * k, ADIR, e);
const cams = [
  HW(0, 1.04), HW(T.m2 + 2.0, 0.98), HC(T.m2 + 3.4, 1.04), HC(T.ask - 0.2, 0.97), HW(T.ask + 1.8, 1.02), HW(T.card, 1.0), HW(DOCK, 1.02), HW(A0 - 0.05, 0.99),
  AW(A0, 1.04), AW(LID - 0.6, 0.98), AC(LID + 1.6, 1.02), AC(AEND - 0.05, 0.96),
  AT(Y0, YNA, 1.04), AT(Y0 + 6.4, YNA, 0.99), AT(Y0 + 8.6, YFE, 1.02), AT(Y0 + 13.0, YFE, 0.98), AT(Y0 + 15.2, YAU, 1.06), AT(YW - 1.6, YAU, 1.0),
  S(YW + 0.6, [(YNA + YAU) / 2 + 0.7, AY + 0.05, 0], 13.4, 4.0, DDIR), S(YEND - 0.05, [(YNA + YAU) / 2 + 0.7, AY + 0.05, 0], 13.0, 3.9, DDIR),
  TAB(TB0, 1.04), TAB(TEND - 0.05, 0.98),
  GG(G0, 1.05), GG(GEND - 0.05, 0.97),
  SH(V0, VX + 0.16, 0.1, 1.75, 0.5, 1.04), SH(V0 + 8.6, VX + 0.16, 0.1, 1.75, 0.5, 0.98), SH(V0 + 10.8, VX + 0.56, 0.08, 0.72, 0.38, 1.04), SH(VEND - 0.05, VX + 0.56, 0.08, 0.72, 0.38, 0.97),
  GG(S0, 1.0), GG(OPEN[0] - 0.3, 0.98), GL(OPEN[0] + 1.8, 1.02), GL(SEND - 0.05, 0.98),
  SH(SV0, SX - 1.28, 0.07, 0.62, 0.3, 1.04), SH(SV0 + 2.8, SX - 1.28, 0.07, 0.62, 0.3, 0.98), SH(SV0 + 4.8, SX - 0.45, 0.13, 0.9, 0.42, 1.02), SH(SV0 + 12.0, SX - 0.45, 0.13, 0.9, 0.42, 0.98),
  SH(SV0 + 14.4, SX - 1.15, 0.07, 0.72, 0.32, 1.02), SH(SV0 + 17.2, SX - 1.15, 0.07, 0.72, 0.32, 0.97), SH(SV0 + 19.4, SX + 0.5, 0.08, 0.8, 0.36, 1.04), SH(SV1 - 0.05, SX + 0.5, 0.08, 0.8, 0.36, 0.98),
  SH(SV1, SX + 1.6, 0.14, 0.7, 0.42, 1.04), SH(SV2 - 0.05, SX + 1.6, 0.14, 0.7, 0.42, 0.97),
  SH(SV2, SX + 2.62, 0.08, 1.3, 0.45, 1.04), SH(SV3 - 0.05, SX + 2.62, 0.08, 1.3, 0.45, 0.98),
  SH(SV3, SX + 3.6, 0.14, 0.8, 0.38, 1.04), SH(SV3 + 3.8, SX + 3.6, 0.14, 0.8, 0.38, 0.98), SH(SV3 + 5.8, SX + 4.4, 0.16, 0.72, 0.4, 1.02), SH(SV3 + 7.4, SX + 4.4, 0.16, 0.72, 0.4, 0.98),
  SH(SV3 + 9.4, SX + 5.05, 0.16, 0.8, 0.4, 1.02), SH(SV3 + 11.6, SX + 5.05, 0.16, 0.8, 0.4, 0.98), SH(SV3 + 13.6, SX + 4.4, 0.18, 2.2, 0.55, 1.02), SH(SVEND - 0.05, SX + 4.4, 0.18, 2.2, 0.55, 0.98),
  SH(P0, PX - 1.5, 0.07, 0.62, 0.32, 1.04), SH(P0E - 0.05, PX - 1.5, 0.07, 0.62, 0.32, 0.96),
  S(Q0, [QX, 1.25, 0], 5.6, 2.9, DDIR), S(QEND - 0.05, [QX, 1.25, 0], 5.3, 2.75, DDIR),
  SH(P2, PX - 0.92, 0.1, 0.8, 0.4, 1.04), SH(P2 + 7.8, PX - 0.92, 0.1, 0.8, 0.4, 0.98), SH(P2 + 9.8, PX - 0.12, 0.5, 0.65, 0.92, 1.04), SH(P3 - 0.05, PX - 0.12, 0.5, 0.65, 0.92, 0.98),
  SH(P3, PX + 0.5, 0.18, 0.72, 0.46, 1.04), SH(P4 - 0.05, PX + 0.5, 0.18, 0.72, 0.46, 0.97),
  SH(P4, PX + 1.95, 0.18, 1.7, 0.55, 1.04), SH(P5 - 0.05, PX + 1.95, 0.18, 1.7, 0.55, 0.98),
  SH(P5, PX + 3.8, 0.2, 1.15, 0.58, 1.04), SH(PEND - 0.05, PX + 3.8, 0.2, 1.15, 0.58, 0.97),
  SH(GD0, GDX - 1.4, 0.06, 0.55, 0.32, 1.04), SH(GD0 + 4.3, GDX - 1.4, 0.06, 0.55, 0.32, 0.98), SH(GD0 + 6.5, GDX - 0.55, 0.07, 1.05, 0.38, 1.04), SH(GD0 + 10.2, GDX - 0.55, 0.07, 1.05, 0.38, 0.98),
  SH(GD0 + 12.4, GDX + 0.5, 0.12, 1.2, 0.46, 1.04), SH(GD0 + 20.3, GDX + 0.5, 0.12, 1.2, 0.46, 0.98),
  SH(GD0 + 22.5, GDX + 1.4, 0.08, 0.62, 0.36, 1.04), SH(GD0 + 24.8, GDX + 1.4, 0.08, 0.62, 0.36, 0.98), SH(GD0 + 27.0, GDX + 2.15, 0.06, 0.62, 0.36, 1.04), SH(GD0 + 29.3, GDX + 2.15, 0.06, 0.62, 0.36, 0.98),
  SH(GD0 + 31.5, GDX + 2.85, 0.16, 0.55, 0.42, 1.04), SH(GDEND - 0.05, GDX + 2.85, 0.16, 0.55, 0.42, 0.97),
  TAB(TB2, 1.04), TAB(TB2E - 0.05, 0.98),
  SH(C0, CX0 + 0.12, 0.07, 1.0, 0.36, 1.04), SH(CEND - 0.05, CX0 + 0.12, 0.07, 1.0, 0.36, 0.97),
  HW(END, 1.04), HW(T.done, 0.98),
];

export default {
  capNear: true, oneText: true,
  duration: T.done,
  fog: [18, 40],
  captions,
  cams,

  build({ scene, cam, R }) {
    const beats = [], fires = [];
    const ST = K.studio({ scene, R }, '814', { dark });
    beats.push((t) => ST.update(t));
    let root = scene;
    const add = (o, x = 0, y = 0, z = 0) => { o.position.set(x, y, z); root.add(o); return o; };
    const stage = (show) => { root = new THREE.Group(); scene.add(root); const g = root; beats.push((t) => { g.visible = show(t); }); return g; };
    const lbl = (text, h, color, x, y, z = 0, w = 700) => add(K.label(text, h, color, w), x, y, z);
    const tags = [], tag = (text, h, color, x, y, z = 0, w = 700) => { const l = lbl(text, 0.1, color, x, y, z, w); l.userData.frac = h * 1.8; tags.push(l); return l; };
    const shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
    const NB = K.NOBLE, metal = (c, r) => K.nobleMat(c, r);
    /** tongs bring something down from above to `to` (arrive m0+1.2), let go at m0+1.4, rise away by m0+2.4 */
    const carry = (tg, t, m0, to, gap = 0.03) => {
      const on = t > m0 && t < m0 + 2.4; if (!on) return false;
      const top = to.clone().add(V(0, 1.1, 0));
      tg.position.copy(t < m0 + 1.2 ? top.lerp(to, 1 - (1 - span(t, m0, m0 + 1.2)) ** 2) : t < m0 + 1.5 ? to.clone() : to.clone().lerp(top, easeIn(span(t, m0 + 1.5, m0 + 2.4))));
      tg.userData.set(lerp(gap, gap + 0.05, span(t, m0 + 1.35, m0 + 1.5))); return true;
    };
    /** tongs move a thing from a to b (down, lift, arc, down, let go at t0+2.4, rise by t0+3.2). Returns where it is (null = not held) */
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
    /** a hammer that strikes DOWN on `at` (lying things) or INTO a wall facing +z ('face'); hits = strike times */
    const HS = 0.6;
    const hammer = (face = false) => {
      const piv = add(new THREE.Group()), mid = new THREE.Group(), h = K.hammer(0.3); h.rotation.z = -Math.PI / 2; h.scale.setScalar(HS);
      if (face) mid.rotation.x = Math.PI / 2; mid.add(h); piv.add(mid); piv.visible = false; piv.userData.face = face; return piv;
    };
    const swing = (piv, t, hits, at) => {
      const on = t > hits[0] - 0.9 && t < hits[hits.length - 1] + 0.8; piv.visible = on; if (!on) return;
      let a = 0.5; const i = hits.findLastIndex((h) => t > h - 0.75);
      if (i >= 0) { const h = hits[i]; a = t < h - 0.15 ? lerp(0.5, 1.0, ease(span(t, h - 0.75, h - 0.15))) : t < h ? lerp(1.0, 0, easeIn(span(t, h - 0.15, h))) : 0.16 * Math.sin(Math.PI * span(t, h, h + 0.25)) + 0.6 * ease(span(t, h + 0.25, h + 0.7)); }
      else a = 0.5;
      const L = 0.32 * HS, F = 0.179 * HS;
      if (piv.userData.face) { piv.position.set(at.x - L, at.y, at.z + F); piv.rotation.set(0, -a, 0); }
      else { piv.position.set(at.x - L, at.y + F, at.z); piv.rotation.set(0, 0, a); }
    };
    const hitK = (t, h, size = 1) => ease(span(t, h - 0.02, h + 0.08)) * size;   // how far a strike has dented
    /** a bar lying on the table, its origin at the bottom of its LEFT end (for sheets and wires) or its centre */
    const bar = (mat, w = 0.2, h = 0.04, d = 0.08, left = false) => {
      const g = add(new THREE.Group()), m = K.solid(new THREE.BoxGeometry(w, h, d).translate(left ? w / 2 : 0, h / 2, 0), mat); g.add(m); g.userData = { m, w, h, d }; return g;
    };
    const sparkBurst = (n = 8, col = 0xfff2c0) => Array.from({ length: n }, (_, i) => ({ s: add(K.sparkle(col, 0.05)), a: K.hash(i, 7) * 6.283, v: 0.5 + K.hash(i, 8) * 0.6 }));
    const burst = (sp, t, t0, at) => sp.forEach((q, i) => {
      const k = span(t, t0 + i * 0.02, t0 + 0.4 + i * 0.02); q.s.visible = k > 0 && k < 1;
      if (q.s.visible) { q.s.position.copy(at).add(V(Math.cos(q.a) * q.v * 0.18 * k, 0.1 * k * (1.4 - k) * q.v, Math.sin(q.a) * q.v * 0.12 * k)); q.s.scale.setScalar(Math.max(1e-4, 0.05 * (1 - k))); }
    });
    /** twinkle stars on a shiny thing (2D style, no fake glow) */
    const twinkle = (at, k, size = 0.07, on = () => true) => { const s = add(K.sparkle(0xffffff, size)); s.position.copy(at); beats.push((t) => { const a = Math.max(0, Math.sin(t * 1.3 + k * 2.1)) ** 10; s.visible = on(t) && a > 0.02 && shown(s.parent); s.scale.setScalar(Math.max(1e-4, size * a)); s.material.rotation = t * 0.4; }); return s; };
    /** a glowing straight stream / beam between two points */
    const beam = (mat, r = 0.006) => { const m = add(new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 10).translate(0, 0.5, 0), mat)); m.visible = false; return m; };
    const UP = V(0, 1, 0), Q = new THREE.Quaternion();
    const stretch = (m, a, b) => { const d = b.clone().sub(a), L = d.length(); m.position.copy(a); m.quaternion.copy(Q.setFromUnitVectors(UP, d.normalize())); m.scale.set(1, Math.max(1e-4, L), 1); };
    /** melt pieces in a crucible on a hot plate and pour them into a mould: an alloy bar forms and cools */
    const meltPour = (cx, color, pieces, P, name) => {
      const hp = add(K.hotPlate(), cx, 0, 0), Y = 0.103, r = 0.08;
      const piv = add(new THREE.Group(), cx + 0.75 * r, Y + 0.004, 0), cr = K.crucible(r, 0.1); cr.position.x = -0.75 * r; piv.add(cr);
      const pool = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.8, r * 0.7, 1, 32).translate(0, 0.5, 0), M.glow(0xffa040, 2.2)); pool.position.set(-0.75 * r, 0.014, 0); piv.add(pool);
      const mo = add(K.ingotMould(), cx + 0.32, 0, 0), am = new THREE.MeshPhysicalMaterial({ color, metalness: 1, roughness: 0.22, clearcoat: 0.5, emissive: 0xff7a20, emissiveIntensity: 0 });
      const alloy = add(K.solid(new THREE.BoxGeometry(0.2, 0.03, 0.08).translate(0, 0.015, 0), am), cx + 0.32, mo.userData.floor + 0.003, 0);
      const st = beam(M.glow(0xffa040, 2.6), 0.007), tg = add(K.tongs(0.55));
      const IN = V(cx, Y + 0.06, 0);
      beats.push((t) => {
        hp.userData.on(ease(span(t, pieces[0].t - 0.6, pieces[0].t)));
        let busy = false;
        pieces.forEach((p) => {
          const c = carry(tg, t, p.t, IN.clone().add(V(0, 0.05, 0)), 0.035); busy = busy || c;
          const fall = K.drop(t, p.t + 1.4, IN.y + 0.04, Y + 0.03, 0.15, 0.004).y, melt = ease(span(t, p.t + 1.8, p.t + 3.0));
          p.o.visible = t > p.t && melt < 0.98; p.o.scale.setScalar(Math.max(1e-4, 1 - melt));
          if (t < p.t + 1.4) p.o.position.copy(tg.position).add(V(0, -0.04, 0)); else p.o.position.set(cx + (p.dx || 0), fall, p.dz || 0);
        });
        tg.visible = busy;
        const fill = ease(span(t, pieces[0].t + 1.8, pieces[pieces.length - 1].t + 3.0)), tilt = ease(span(t, P, P + 0.8)) * (1 - ease(span(t, P + 2.4, P + 3.2)));
        piv.rotation.z = -1.15 * tilt; const out = ease(span(t, P + 0.7, P + 2.2));
        pool.visible = fill > 0.01 && out < 0.99; pool.scale.y = Math.max(1e-4, 0.05 * fill * (1 - out));
        const flow = t > P + 0.6 && t < P + 2.3; st.visible = flow;
        if (flow) { piv.updateMatrixWorld(true); const lip = piv.localToWorld(V(0.25 * r, 0.1, 0)); stretch(st, V(cx + 0.27, mo.userData.floor + 0.01, 0), lip); }
        alloy.visible = out > 0.02; alloy.scale.y = Math.max(1e-4, out);
        am.emissiveIntensity = 1.6 * (1 - ease(span(t, P + 2.4, P + 4.2)));
      });
      if (name) { const l = tag(name, 0.05, '#ffffff', cx + 0.12, 0.26, 0.05); beats.push((t) => K.popIn(l, t, P + 3.0, P + 5.2)); }
      return { alloy, mould: mo, hp };
    };

    // ================================================================ HOOK / END · an old nail and an old coin dug up
    {
      stage((t) => t < A0 - 0.05 || t >= END - 0.05); ST.bake(root, 'hook', 0.05, 2.0, 1.1);
      add(K.earthBlock(0.9, EH, 0.5), EX, 0, 0);
      add(K.solid(new THREE.BoxGeometry(0.6, TT, 0.45), M.gloss(0xf2f0ea)), TLX, TT / 2, 0.02);
      const nail = add(K.nail(0.3, 0.014)); nail.userData.rust(1); nail.children[0].visible = false;   // rusted through: only the rust shell shows
      const nailP = add(new THREE.Group()); nailP.add(nail); nail.rotation.z = Math.PI / 2; nail.position.x = 0.15;   // lying along x, its middle at the group's origin
      const coinG = add(new THREE.Group()), coin = K.coin(0.07, NB.gold, 0.01); coinG.add(coin);
      const N0 = V(EX - 0.18, EH - 0.004, 0.08), N1 = V(TLX - 0.08, TT + 0.014, 0.08), C0P = V(EX + 0.2, EH - 0.03, -0.02), C1 = V(TLX + 0.2, TT + 0.001, 0.02);
      const tg = add(K.tongs(0.6)), crumbs = Array.from({ length: 6 }, (_, i) => add(K.lump(0.012, M.matte(0x5a3e2a, 0.9), i + 3, 0.7, 0.5)));
      const lOld = tag('old ground', 0.05, '#ffffff', EX, EH + 0.2, 0.1);
      const lNail = tag('old iron nail: rusted', 0.05, '#ffd0b0', N1.x + 0.1, 0.1, 0.25), lCoin = tag('old gold coin: shines ✓', 0.05, '#ffe08a', C1.x + 0.04, 0.2, 0.0);
      const lI = tag('iron: rusts', 0.055, '#ffd0b0', N1.x, 0.12, 0.3), lG = tag('gold: never rusts ✓', 0.055, '#ffe08a', C1.x - 0.12, 0.36, 0.0);
      twinkle(C1.clone().add(V(0.03, 0.02, 0.03)), 0, 0.07, (t) => t > T.m2 + 2.6);
      twinkle(C1.clone().add(V(-0.03, 0.015, -0.02)), 1.5, 0.05, (t) => t > T.m2 + 2.6);
      beats.push((t) => {
        // the nail: half buried, lying; the tongs lift it out and lay it on the tile
        const pn = move(tg, t, T.m1, N0.clone().add(V(0, 0.01, 0)), N1.clone().add(V(0, 0.01, 0)), 0.03, 0.25);
        nailP.position.copy(t < T.m1 + 0.85 ? N0 : pn ? pn.clone().add(V(0, -0.01, 0)) : N1);
        // the coin: standing on its edge in the soil; lifted, it turns flat and lands on the tile; soil crumbs fall off
        const pc = move(tg, t, T.m2, C0P.clone().add(V(0, 0.07, 0)), C1.clone().add(V(0, 0.03, 0)), 0.02, 0.25);
        coinG.position.copy(t < T.m2 + 0.85 ? C0P : pc ? pc.clone().add(V(0, -0.07 * (1 - ease(span(t, T.m2 + 1.1, T.m2 + 1.9))) - 0.03 * ease(span(t, T.m2 + 1.1, T.m2 + 1.9)), 0)) : C1);
        const flat = t < T.m2 + 1.1 ? 0 : ease(span(t, T.m2 + 1.1, T.m2 + 1.9)); coin.rotation.x = Math.PI / 2 * (1 - flat); coin.position.y = 0.07 * (1 - flat);
        tg.visible = (t > T.m1 && t < T.m1 + 3.2) || (t > T.m2 && t < T.m2 + 3.2);
        crumbs.forEach((c, i) => { const t0 = T.m2 + 0.95 + i * 0.05, u = span(t, t0, t0 + 0.45); c.visible = u > 0 && u < 1; c.position.set(C0P.x + 0.04 * Math.cos(i * 2.3), lerp(C0P.y + 0.06, EH, u * u), C0P.z + 0.03 * Math.sin(i * 2.3)); });
        K.popIn(lOld, t, T.name, T.m1 + 0.6); K.popIn(lNail, t, T.m1 + 2.6, T.ask - 0.3); K.popIn(lCoin, t, T.m2 + 2.8, T.ask - 0.3);
        K.popIn(lI, t, END + 0.6, 1e9); K.popIn(lG, t, END + 4.2, 1e9);
      });
    }

    // ================================================================ AIR · a new nail and a gold ring in damp air
    {
      stage((t) => t >= A0 - 0.05 && t < AEND); ST.bake(root, 'air', AX, 1.6, 1.3);
      add(K.tank(1.1, 0.5, 0.42, AL), AX, 0, 0);
      [-0.25, 0.25].forEach((dx, i) => add(K.stoneBlock(0.18, BLK - 0.03, 0.14, 0xe9e6df, 0xc9c4ba, i + 2), AX + dx, 0.03, 0));
      add(K.solid(new THREE.BoxGeometry(0.62, 0.02, 0.2), M.gloss(0xf2f0ea)), AX, 0.01, 0.45);
      const nail = add(K.nail(0.24, 0.012)), nm = nail.children[0].material = M.metal(0x9aa0a8, 0.32), nP = add(new THREE.Group()); nP.add(nail); nail.rotation.z = Math.PI / 2; nail.position.x = 0.12;
      const ring = add(K.ring(0.05, 0.012));
      const N0 = V(AX - 0.2, 0.02 + 0.012, 0.45), N1 = V(AX - 0.25, BLK + 0.012, 0), R0 = V(AX + 0.18, 0.02, 0.45), R1 = V(AX + 0.25, BLK, 0);
      const lid = add(K.solid(new THREE.BoxGeometry(1.14, 0.012, 0.54), M.glass(), { outline: false }));
      const mist = add(K.smoke(10, 0xffffff), AX, AL, 0); mist.scale.setScalar(0.14);
      const tg = add(K.tongs(0.6)), rustC = new THREE.Color(0x7a4a32), ironC = new THREE.Color(0x9aa0a8);
      const lN = tag('a new iron nail', 0.05, '#ffffff', N0.x - 0.12, 0.16, 0.5), lR = tag('a gold ring', 0.05, '#ffe08a', R0.x + 0.12, 0.16, 0.5);
      const lD = tag('damp air inside', 0.05, '#bfe0ff', AX, 0.56, 0), days = ['day 1', 'day 2', 'day 3'].map((s) => tag(s, 0.06, '#ffffff', AX, 0.56, 0));
      const lRust = tag('iron: rusts', 0.055, '#ffb08a', N1.x, 0.34, 0.05), lOk = tag('gold: no rust ✓', 0.055, '#ffe08a', R1.x, 0.34, 0.05);
      twinkle(R1.clone().add(V(0.03, 0.03, 0.04)), 2, 0.06, (t) => t > DAYS[2] + 1.6);
      beats.push((t) => {
        const pn = move(tg, t, MN, N0, N1, 0.03, 0.6); nP.position.copy(t < MN + 0.85 ? N0 : pn ?? N1);
        const pr = move(tg, t, MR, R0.clone().add(V(0, 0.012, 0)), R1.clone().add(V(0, 0.012, 0)), 0.03, 0.6); ring.position.copy(t < MR + 0.85 ? R0 : pr ? pr.clone().add(V(0, -0.012, 0)) : R1);
        tg.visible = (t > MN && t < MN + 3.2) || (t > MR && t < MR + 3.2);
        lid.position.set(AX + 1.3 * (1 - ease(span(t, LID, LID + 1.0))), 0.433, 0); lid.visible = t > LID;
        mist.visible = t > LID + 0.6; mist.userData.update(t, ease(span(t, LID + 0.6, LID + 1.6)));
        const r = ease(span(t, DAYS[0], DAYS[2] + 1.0)); nail.userData.rust(r); nm.color.copy(ironC).lerp(rustC, r * 0.8);
        K.popIn(lN, t, A0 + 0.4, MN + 0.8); K.popIn(lR, t, A0 + 1.0, MR + 0.8); K.popIn(lD, t, LID + 1.2, DAYS[0] - 0.1);
        days.forEach((l, i) => K.popIn(l, t, DAYS[i], i < 2 ? DAYS[i + 1] - 0.1 : A0 + 16.0));
        K.popIn(lRust, t, DAYS[2] + 1.0, 1e9); K.popIn(lOk, t, A0 + 16.4, 1e9);
      });
    }

    // ================================================================ WHY (dark) · who gives electrons away?
    {
      stage((t) => t >= Y0 - 0.05 && t < YEND);
      const atomAt = (x, shells, p, n, r0, Rr) => { const A = K.atom(shells, p, n, r0, (Rr - r0) / (shells.length - 1)); A.group.position.set(x, AY, 0); root.add(A.group); return A; };
      const NA = atomAt(YNA, [2, 8, 1], 11, 12, 0.45, 1.0), FE = atomAt(YFE, [2, 8, 14, 2], 26, 30, 0.34, 1.0), AU = atomAt(YAU, [2, 8, 18, 32, 18, 1], 79, 118, 0.38, 1.18);
      const gold = M.glow(0xffc04d, 2.6), mk = (A, s) => { const x = A.electrons.find((e) => e.shell === s); x.e.material = gold; x.e.children[0].material = x.e.children[0].material.clone(); x.e.children[0].material.color.set(0xffc04d); return x; };
      const xN = mk(NA, 2), xF = mk(FE, 3), xA = mk(AU, 5);
      const key = new THREE.DirectionalLight(0xfff2e0, 2.0); key.position.set(YNA - 1, 5, 6); key.target.position.set(YFE, AY, 0); root.add(key, key.target);
      const bar = (x, h) => { const b = add(K.solid(new THREE.BoxGeometry(0.28, 1, 0.2).translate(0, 0.5, 0), M.gloss(0xf0b040)), x, AY - 1.1, 0); b.userData.h = h; return b; };
      const bN = bar(YNA + 1.5, 0.62), bF = bar(YFE + 1.5, 0.95), bA = bar(YAU + 1.65, 1.12);
      /** the gold electron is pulled out to the right; if `off`, it flies away, otherwise it snaps back home */
      const pull = (A, x, t0, t1, off = true) => (t) => {
        if (t < t0) { x.free = false; x.e.visible = true; return; }
        const ring = A.rings[x.shell], a = x.a0 + t0 * x.w, home = ring.localToWorld(V(Math.cos(a) * x.R, 0, Math.sin(a) * x.R)), far = A.group.localToWorld(V(x.R + 0.45, 0.3, 0.3));
        if (off) { x.free = true; const k = ease(span(t, t0, t1)), go = easeIn(span(t, t1, t1 + 0.8)); x.e.position.copy(ring.worldToLocal(home.lerp(far, k).add(V(1.6 * go, 0.9 * go, 0)))); x.e.visible = go < 0.98; return; }
        const k = 0.55 * ease(span(t, t0, t1)) * (1 - easeIn(span(t, t1 + 0.2, t1 + 0.5))) + 0.03 * Math.sin(t * 40) * (t < t1 ? 1 : 0);
        x.free = t < t1 + 0.5; if (x.free) x.e.position.copy(ring.worldToLocal(home.lerp(far, k)));
      };
      const pN = pull(NA, xN, YP, YP + 1.0), pF = pull(FE, xF, YF, YF + 2.0), pA = pull(AU, xA, YA, YA + 2.6, false);
      const lNa = lbl('sodium atom', 0.28, '#ffffff', YNA, AY + 1.35), lNs = lbl('reacts in seconds', 0.26, '#9ec0ff', YNA + 0.9, AY - 1.45);
      const lFe = lbl('iron atom', 0.28, '#ffffff', YFE, AY + 1.35), lFs = lbl('rusts in days', 0.26, '#ffb08a', YFE + 0.9, AY - 1.45);
      const lAu = lbl('gold atom', 0.28, '#ffffff', YAU, AY + 1.55), lHold = lbl('holds on tight', 0.26, '#ffe08a', YAU + 1.1, AY + 1.3), lHigh = lbl('high ionization energy', 0.24, '#ffd27a', YAU + 0.9, AY - 1.45);
      const lNo = lbl('never rusts ✓', 1.0, '#ffe08a', YAU + 0.9, AY - 1.95), wNs = lbl('reacts in seconds', 1.0, '#9ec0ff', YNA + 0.9, AY - 1.95), wFs = lbl('rusts in days', 1.0, '#ffb08a', YFE + 0.9, AY - 1.95);
      beats.push((t) => {
        if (!shown(NA.group)) return;
        NA.update(t); FE.update(t); AU.update(t); pN(t); pF(t); pA(t);
        bN.scale.y = Math.max(1e-4, bN.userData.h * ease(span(t, YP, YP + 1.0))); bN.visible = t > YP;
        bF.scale.y = Math.max(1e-4, bF.userData.h * ease(span(t, YF, YF + 2.0))); bF.visible = t > YF;
        bA.scale.y = Math.max(1e-4, bA.userData.h * ease(span(t, YA, YA + 2.6))); bA.visible = t > YA;
        K.popIn(lNa, t, Y0 + 0.5, Y0 + 6.4); K.popIn(lNs, t, YP + 1.4, YW); K.popIn(wNs, t, YW + 0.7, 1e9); K.popIn(wFs, t, YW + 0.7, 1e9);
        K.popIn(lFe, t, Y0 + 8.4, Y0 + 13.0); K.popIn(lFs, t, YF + 2.4, YW);
        K.popIn(lAu, t, Y0 + 14.8, YA + 1.0); K.popIn(lHold, t, YA + 1.2, YW); K.popIn(lHigh, t, YA + 2.8, YW + 0.2); K.popIn(lNo, t, YW + 0.6, 1e9);
      });
    }

    // ================================================================ TABLE (dark, twice) · the noble metals · the Society box
    {
      stage((t) => (t >= TB0 - 0.05 && t < TEND) || (t >= TB2 - 0.05 && t < TB2E));
      const key = new THREE.DirectionalLight(0xfff2e0, 2.2); key.position.set(TBX - 3, TY(4) + 4, 6); key.target.position.set(TBX, TY(4), 0); root.add(key, key.target);
      const own = { 29: 'Cu', 44: 'Ru', 45: 'Rh', 46: 'Pd', 47: 'Ag', 75: 'Re', 76: 'Os', 77: 'Ir', 78: 'Pt', 79: 'Au', 80: 'Hg', 92: 'U', 94: 'Pu' }, rest = [];
      const isTM = (r, c) => r <= 7 && c >= 3 && c <= 12;
      for (let z = 1; z <= 118; z++) { const [r, c] = place(z); if (!own[z]) rest.push({ r, c, tm: isTM(r, c) }); }
      const GREY = new THREE.Color(0x4a4f58), TMC = new THREE.Color(0x6f86a8), GOLD = new THREE.Color(0xe0a63a), PALE = new THREE.Color(0xc9b98a), PGM = new THREE.Color(0xdfe4ec), ORA = new THREE.Color(0xe07a3a);
      const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(0.44, 0.44, 0.06), M.gloss(0xffffff), rest.length); root.add(inst);
      const m4 = new THREE.Matrix4(); rest.forEach(({ r, c }, i) => { m4.makeTranslation(COL(c), TY(r), 0); inst.setMatrixAt(i, m4); inst.setColorAt(i, GREY); });
      const NOB = ['Ru', 'Rh', 'Pd', 'Ag', 'Os', 'Ir', 'Pt', 'Au'], ADD = ['Hg', 'Re', 'Cu'], PG = ['Re', 'Rh', 'Pd', 'Os', 'Ir', 'Pt'];
      const tiles = Object.entries(own).map(([z, s]) => { const [r, c] = place(+z); const tl = K.tile(s, 0xffffff, 0.44, 0.44, 0.08); tl.position.set(COL(c), TY(r), 0.01); root.add(tl); return { s, tl, tm: isTM(r, c) }; });
      const col = new THREE.Color();
      const colorOf = (s, tm, t) => {
        col.copy(GREY);
        if (t < TEND) {                                                     // window 1: transition metals → the 8 noble metals → 3 more
          if (tm) col.lerp(TMC, ease(span(t, TB0 + 1.0, TB0 + 1.6)));
          const i = NOB.indexOf(s); if (i >= 0) col.lerp(GOLD, ease(span(t, TB0 + 4.0 + i * 0.45, TB0 + 4.4 + i * 0.45)));
          if (ADD.includes(s)) col.lerp(PALE, ease(span(t, TB0 + 9.0, TB0 + 9.6)));
        } else {                                                            // window 2: Au, Ag · platinum group · Pu, U
          if (s === 'Au' || s === 'Ag') col.lerp(GOLD, ease(span(t, TB2 + 0.6, TB2 + 1.2)) * (1 - ease(span(t, TB2 + 3.4, TB2 + 3.9))));
          const j = PG.indexOf(s); if (j >= 0) col.lerp(PGM, ease(span(t, TB2 + 4.0 + j * 0.35, TB2 + 4.4 + j * 0.35)));
          if (s === 'Pu' || s === 'U') col.lerp(ORA, ease(span(t, TB2 + 8.6, TB2 + 9.2)));
        }
        return col;
      };
      const flash = (s, t) => (s === 'Au' ? Math.sin(Math.PI * span(t, TB0 + 0.4, TB0 + 1.2)) : s === 'Pt' ? Math.sin(Math.PI * span(t, TB2 + 6.4, TB2 + 7.4)) : 0);
      const H = 0.75, Y2 = TY(2.2), YT = TY(1) + 0.85;
      const lTM = lbl('transition metals', H, '#ffffff', COL(7.5), Y2 + 0.05), lNob = lbl('the noble metals: they resist rust', H, '#ffe08a', COL(9.5), YT);
      const lAdd = lbl('some chemists add Hg, Re, Cu', H, '#e9dcb0', COL(9.5), YT);
      const lBest = lbl('best known: gold and silver', H, '#ffe08a', COL(9.5), YT), lPG = lbl('platinum group (as printed)', H, '#ffffff', COL(9.5), YT);
      const lPt = lbl('platinum: most traded', 0.75, '#ffffff', COL(7.5), Y2 + 0.05), lPU = lbl('plutonium, uranium: precious too', 0.6, '#ffb08a', COL(10.5), TY(9) - 0.55);
      const lLess = lbl('less reactive than most metals ✓', H, '#ffe08a', COL(9.5), YT);
      beats.push((t) => {
        if (!shown(inst)) return;
        rest.forEach(({ tm }, i) => inst.setColorAt(i, colorOf(null, tm, t))); inst.instanceColor.needsUpdate = true;
        tiles.forEach(({ s, tl, tm }) => { const m = tl.userData.body.material; m.color.copy(colorOf(s, tm, t)); const f = flash(s, t); tl.position.z = 0.01 + 0.08 * f; m.emissive.set(0xf0b030); m.emissiveIntensity = 0.6 * f; });
        K.popIn(lTM, t, TB0 + 1.4, TB0 + 4.0); K.popIn(lNob, t, TB0 + 5.0, TB0 + 8.8); K.popIn(lAdd, t, TB0 + 9.6, TEND);
        K.popIn(lBest, t, TB2 + 1.0, TB2 + 3.6); K.popIn(lPG, t, TB2 + 4.2, TB2 + 6.2); K.popIn(lPt, t, TB2 + 6.4, TB2 + 8.4);
        K.popIn(lPU, t, TB2 + 9.0, TB2 + 11.0); K.popIn(lLess, t, TB2 + 11.2, 1e9);
      });
    }

    // ================================================================ GROUND · found free, rare · later: silver's four forms
    {
      stage((t) => (t >= G0 - 0.05 && t < GEND) || (t >= S0 - 0.05 && t < SEND)); ST.bake(root, 'ground', GX, 2.3, 1.1);
      add(K.earthBlock(GW, GH, GD), GX, 0, 0);
      const holeM = M.matte(0x1c1611, 0.95), lipM = M.matte(0x6e665c, 0.9);
      const hollow = ([x, y], rx = 0.2, ry = 0.13) => {
        const g = add(new THREE.Group(), GX + x, y, FACE);
        const m = new THREE.Mesh(new THREE.CircleGeometry(1, 40), holeM); m.position.z = 0.006; m.scale.set(rx, ry, 1); g.add(m);
        const lip = K.solid(new THREE.TorusGeometry(1, 0.09, 10, 40), lipM, { outline: false }); lip.position.z = 0.004; lip.scale.set(rx, ry, 0.25); g.add(lip); return g;
      };
      const P = Object.fromEntries(Object.keys(POCK).map((k) => [k, hollow(POCK[k])]));
      const at = (k, o, dx = 0, dy = 0, dz = 0.02) => { o.position.set(dx * 1.5, dy * 1.5, dz); o.scale.multiplyScalar(1.6); P[k].add(o); return o; };
      const grX = K.goldRock(0.07, 4); grX.scale.setScalar(0.9); at('au', grX, 0, -0.03, 0.03);
      [[-0.04, 0, 0.012], [0.03, 0.02, 0.01], [0.01, -0.03, 0.009]].forEach(([x, y, s], i) => at('pt', K.lump(s * 1.6, metal(NB.plat, 0.3), i + 4, 0.8, 0.4), x, y, 0.015));
      const wire = K.nativeWire(0.11, 3); at('ag', wire, 0, 0, 0.03);
      [[-0.04, 0.0, 0.018], [0.03, 0.015, 0.014], [0.02, -0.03, 0.012]].forEach(([x, y, s], i) => at('min', K.lump(s * 1.5, new THREE.MeshPhysicalMaterial({ color: 0x3c4046, metalness: 0.7, roughness: 0.35 }), i + 7, 0.7, 0.45), x, y, 0.015));
      at('mix', K.lump(0.04, metal(0xe6dba6, 0.28), 11, 0.75, 0.4), 0, -0.005, 0.015);
      const ore = K.rock(0.05, 0x4f8a6a, 0x7a5a3a, 9); ore.scale.set(1.3, 0.85, 0.6); at('ore', ore, 0, 0, 0.012);
      ['min', 'mix', 'ore'].forEach((k) => { P[k].visible = false; });
      const hm = hammer(true), chips = ['min', 'mix', 'ore'].map(() => sparkBurst(7, 0xd8cfc0));
      const glints = [0, 1, 2].map((i) => { const s = K.sparkle(0xffffff, 0.04); s.position.set(-0.03 + i * 0.03, 0.02 - i * 0.01, 0.06); P.ore.add(s); return s; });
      const PT = (k, dy = 0.21, dx = 0) => [GX + POCK[k][0] + dx, POCK[k][1] + dy, FACE + 0.05];
      const lDeep = tag('a slice of the ground', 0.05, '#ffffff', GX, GH + 0.12, FACE);
      const lAu = tag('gold', 0.055, '#ffe08a', ...PT('au')), lPt = tag('platinum', 0.055, '#ffffff', ...PT('pt')), lAg = tag('silver', 0.055, '#ffffff', ...PT('ag'));
      const lFree = tag('found free: not joined to anything ✓', 0.05, '#ffe08a', GX, GH + 0.12, FACE), lRare = tag('tiny bits in a lot of rock: rare', 0.05, '#ffffff', GX, GH + 0.12, FACE);
      const lAg2 = tag('pure silver (native)', 0.05, '#ffffff', ...PT('ag')), lMin = tag('in a silver mineral', 0.05, '#ffffff', ...PT('min', -0.2));
      const lMix = tag('natural alloy', 0.05, '#ffffff', ...PT('mix', -0.2)), lOre = tag('a little in other ores', 0.05, '#ffffff', ...PT('ore', -0.2, -0.05));
      twinkle(V(GX + POCK.au[0] + 0.02, POCK.au[1] + 0.02, FACE + 0.08), 3, 0.06, (t) => t > G0 + 1.6);
      twinkle(V(GX + POCK.ag[0] - 0.02, POCK.ag[1] + 0.01, FACE + 0.07), 5, 0.05, (t) => t > G0 + 1.6);
      beats.push((t) => {
        const op = ['min', 'mix', 'ore'];
        op.forEach((k, i) => {
          const o = ease(span(t, OPEN[i], OPEN[i] + 0.5)), on = t >= S0 - 0.05 && o > 0.01; P[k].visible = on;
          if (on) P[k].scale.setScalar(Math.max(1e-4, o)); burst(chips[i], t, OPEN[i], V(GX + POCK[k][0], POCK[k][1], FACE + 0.04));
        });
        glints.forEach((s, i) => { const a = Math.max(0, Math.sin(t * 1.6 + i * 2.1)) ** 8; s.visible = a > 0.02; s.scale.setScalar(Math.max(1e-4, 0.04 * a)); });
        swing(hm, t, OPEN, (() => { const i = OPEN.findLastIndex((h) => t > h - 0.75); const k = op[Math.max(0, i)]; return V(GX + POCK[k][0], POCK[k][1], FACE + 0.01); })());
        K.popIn(lDeep, t, G0 + 0.4, G0 + 1.8); K.popIn(lAu, t, G0 + 2.0, G0 + 6.2); K.popIn(lPt, t, G0 + 3.2, G0 + 6.2); K.popIn(lAg, t, G0 + 4.4, G0 + 6.2);
        K.popIn(lFree, t, G0 + 6.6, G0 + 8.6); K.popIn(lRare, t, G0 + 9.0, GEND);
        K.popIn(lAg2, t, S0 + 0.6, OPEN[1]); K.popIn(lMin, t, OPEN[0] + 0.6, OPEN[1] + 0.3); K.popIn(lMix, t, OPEN[1] + 0.6, OPEN[2] + 0.3); K.popIn(lOre, t, OPEN[2] + 0.6, SEND);
      });
    }

    // ================================================================ VALUE · high technology, jewellery, metallurgy · precious metals
    {
      stage((t) => t >= V0 - 0.05 && t < VEND); ST.bake(root, 'value', VX + 0.1, 2.2, 1.1);
      const bd = add(K.circuitBoard(0.36, 0.22), VX - 0.5, 0, 0); bd.rotation.y = 0.15;
      const sig = bd.userData.fingers.filter((_, i) => i % 3 === 1).map((x) => add(K.pulses(new THREE.CatmullRomCurve3([V(x, 0.016, -0.06), V(x, 0.016, 0.1)]), 3)));
      sig.forEach((p) => { bd.remove(p); bd.add(p); p.position.set(0, 0, 0); p.children.forEach((c) => c.scale.setScalar(0.035)); });
      add(K.necklace(0.12, NB.gold, 72), VX - 0.04, 0, 0.02);
      const IX = [VX + 0.36, VX + 0.56, VX + 0.76], IC = [NB.silver, NB.plat, NB.gold];
      const ing = IX.map((x, i) => add(K.ingot(metal(IC[i], 0.2), 0.16, 0.06, 0.09), x, 0, 0));
      twinkle(V(VX + 0.02, 0.02, 0.1), 1, 0.06, (t) => t > V0 + 4.6); twinkle(V(VX - 0.14, 0.02, -0.04), 2.4, 0.05, (t) => t > V0 + 4.6);
      const lHi = tag('high technology', 0.05, '#ffffff', VX - 0.5, 0.12, 0.2), lJw = tag('jewellery, art', 0.05, '#ffe08a', VX - 0.04, 0.24, 0.0), lMe = tag('metallurgy', 0.05, '#ffffff', VX + 0.56, 0.12, 0.15);
      const lN = ['silver', 'platinum', 'gold'].map((s, i) => tag(s, 0.05, i === 2 ? '#ffe08a' : '#ffffff', IX[i], 0.12 + (i % 2) * 0.08, 0.05));
      const lPr = tag('precious metals: high value ✓', 0.055, '#ffe08a', VX + 0.56, 0.2, 0.05);
      beats.push((t) => {
        sig.forEach((p, i) => { p.visible = t > V0 + 3.4; p.userData.update(t + i * 0.3, 1, 1); });
        ing.forEach((g, i) => { const k = Math.sin(Math.PI * span(t, V0 + 9.4 + i * 0.6, V0 + 10.0 + i * 0.6)); g.position.y = 0.03 * k; });
        K.popIn(lHi, t, V0 + 3.6, V0 + 8.6); K.popIn(lJw, t, V0 + 5.2, V0 + 8.6); K.popIn(lMe, t, V0 + 6.8, V0 + 9.2);
        lN.forEach((l, i) => K.popIn(l, t, V0 + 9.6 + i * 0.6, V0 + 12.4)); K.popIn(lPr, t, V0 + 12.8, 1e9);
      });
    }

    // ================================================================ SILVER · soft, alloy, things, film, sheets and wires, best conductor
    {
      stage((t) => t >= SV0 - 0.05 && t < SVEND); ST.bake(root, 'silver', SX + 1.95, 7.4, 1.1);
      const AGM = () => metal(NB.silver, 0.2);
      // pure silver dents; melted with copper → an alloy that hardly dents
      const pure = bar(AGM(), 0.2, 0.04, 0.08); pure.position.set(SX - 1.3, 0, 0);
      const ag = add(K.lump(0.03, AGM(), 3, 0.7, 0.3)), cu = add(K.lump(0.022, metal(NB.copper, 0.25), 5, 0.7, 0.3));
      const MP = meltPour(SX - 0.62, 0xe0dcd6, [{ o: ag, t: SV0 + 3.4 }, { o: cu, t: SV0 + 5.6, dx: 0.01 }], SV0 + 8.2, 'an alloy');
      const tg = add(K.tongs(0.55)), hm = hammer(), H1 = SV0 + 1.6, H2 = SV0 + 15.6;
      const AL0 = MP.alloy.position.clone(), AL1 = V(SX - 1.0, 0, 0);
      const lPure = tag('pure silver', 0.05, '#ffffff', SX - 1.3, 0.16, 0.05), lSoft = tag('dents easily: very soft', 0.05, '#ffd0b0', SX - 1.3, 0.16, 0.05);
      const lAgP = tag('silver', 0.05, '#ffffff', SX - 0.7, 0.36, 0.05), lCuP = tag('copper', 0.05, '#ffb08a', SX - 0.5, 0.36, 0.05);
      const lHard = tag('alloy: hardly dents ✓', 0.05, '#ffffff', SX - 0.95, 0.2, 0.05);
      // coins, jewellery, tableware made of the alloy
      const PX0 = SX + 0.2;
      const cn = add(K.coin(0.075, 0xe6e2da, 0.011), PX0 + 0.02, 0, 0.02), rg = add(K.ring(0.065, 0.014, 0xe6e2da), PX0 + 0.27, 0, 0.0);
      const sp = add(K.tableSpoon(0.32), PX0 + 0.6, 0, 0.0); sp.rotation.y = 0.5;
      const lCn = tag('coins', 0.05, '#ffffff', PX0, 0.13, 0.05), lRg = tag('jewellery', 0.05, '#ffffff', PX0 + 0.25, 0.17, 0.05), lSp = tag('tableware', 0.05, '#ffffff', PX0 + 0.6, 0.13, 0.05);
      [cn, rg, sp].forEach((o, i) => twinkle(o.position.clone().add(V(0.02, 0.03, 0.03)), i * 1.7, 0.05, (t) => t > SV0 + 18));
      // camera film darkens in light
      const FX = SX + 1.6, film = add(K.filmStrip(4, 0.08), FX, 0, 0.06), lamp = add(K.bulb(), FX, 0, -0.18); lamp.scale.setScalar(0.4);
      const lFilm = tag('silver chloride + silver bromide', 0.05, '#ffffff', FX, 0.06, 0.25), lPhoto = tag('light darkens it: a photo ✓', 0.05, '#ffe08a', FX, 0.06, 0.25);
      // sheets and wires
      const WX = SX + 2.3, sheet = bar(AGM(), 0.16, 0.04, 0.08); sheet.position.set(WX + 0.08, 0, -0.1);
      const wbar = bar(AGM(), 0.14, 0.03, 0.05, true); wbar.position.set(WX + 0.2, 0, 0.12); const vise = add(K.solid(new THREE.BoxGeometry(0.06, 0.06, 0.08).translate(0, 0.03, 0), M.matte(0x2b2f38, 0.6)), WX + 0.17, 0, 0.12);
      const hm2 = hammer(), tg2 = add(K.tongs(0.5)), HSH = [SV2 + 0.9, SV2 + 1.7, SV2 + 2.5];
      const lSheet = tag('hammered into a sheet', 0.05, '#ffffff', WX + 0.08, 0.16, -0.05), lWire = tag('drawn into a wire', 0.05, '#ffffff', WX + 0.55, 0.14, 0.15);
      // the best conductor: heat (wax melts along a rod), electricity (a bulb), light (a mirror)
      const RX = SX + 3.6, hp = add(K.hotPlate(), RX + 0.25, 0, 0);
      add(K.solid(new THREE.BoxGeometry(0.06, 0.103, 0.07), M.matte(0x5a5550, 0.7)), RX - 0.27, 0.0515, 0);
      add(K.solid(new THREE.CylinderGeometry(0.016, 0.016, 0.6, 20).rotateZ(Math.PI / 2), AGM()), RX, 0.103 + 0.016, -0.01);
      const BEADX = [RX + 0.08, RX - 0.02, RX - 0.12, RX - 0.22], MELT = BEADX.map((_, i) => SV3 + 1.2 + i * 0.45);
      const wax = BEADX.map((bx, i) => { const m = M.matte(0xf3e9c8, 0.5); return [add(K.lump(0.02, m, i + 5, 1.0, 0.25), bx, 0.135 + 0.014, -0.01), m]; });
      const BX = SX + 4.4, bat = add(K.battery(), BX - 0.24, 0, -0.04); bat.scale.setScalar(0.42); const bl = add(K.bulb(), BX + 0.2, 0, -0.04); bl.scale.setScalar(0.35);
      const sw = add(K.wire([[BX - 0.24, 0.335, -0.04], [BX - 0.12, 0.2, 0.05], [BX, 0.02, 0.09], [BX + 0.12, 0.02, 0.05], [BX + 0.2, 0.03, -0.0]], 0xdfe3e8, 0.008));
      add(K.wire([[BX + 0.2, 0.01, -0.09], [BX, 0.006, -0.16], [BX - 0.2, 0.006, -0.13], [BX - 0.24, 0.01, -0.08]], 0x2b2f38, 0.007));
      const pu = add(K.pulses(sw.userData.curve, 4)); pu.scale.setScalar(1);
      const MX = SX + 5.15, mir = add(K.mirrorStand(0.1), MX, 0, -0.05), MC = mir.userData.c.clone().add(V(MX, 0, -0.05));
      const pen = add(K.laserPen(0.16), MX - 0.32, MC.y - 0.013, 0.24); add(K.stoneBlock(0.14, MC.y - 0.013, 0.08, 0xe9e6df, 0xc9c4ba, 6), MX - 0.32, 0, 0.24);
      const dIn = MC.clone().sub(pen.position.clone().add(V(0, 0.013, 0))); pen.rotation.y = -Math.atan2(dIn.z, dIn.x);
      const LIN = dIn.length() - 0.08, refl = beam(M.glow(0xff2a2a, 4), 0.003), dot = add(K.glowSprite(0xff4a3a, 0.08)); dot.visible = false;
      const lHeat = tag('carries heat best', 0.05, '#ffb27a', RX, 0.3, 0.05), lEl = tag('carries electricity best', 0.05, '#ffe08a', BX, 0.36, 0.05), lRef = tag('reflects light best', 0.05, '#ffffff', MX, 0.36, 0.05);
      const lBest = tag('better than any other metal ✓', 0.06, '#ffe08a', BX, 0.5, 0.05);
      beats.push((t) => {
        // pure bar: one strike → a deep dent
        swing(hm, t, t < SV0 + 10 ? [H1] : [H2], t < SV0 + 10 ? V(SX - 1.3, 0.04, 0) : V(AL1.x, 0.03 + 0.017, 0));
        const d1 = hitK(t, H1); pure.userData.m.scale.set(1 + 0.3 * d1, 1 - 0.45 * d1, 1 + 0.2 * d1);
        // the alloy bar: tongs lift it out of the mould and lay it beside the pure bar; it hardly dents
        const p = move(tg, t, SV0 + 11.6, AL0.clone().add(V(0, 0.03, 0)), AL1.clone().add(V(0, 0.03, 0)), 0.035, 0.3);
        if (t > SV0 + 11.6) MP.alloy.position.copy(t < SV0 + 12.45 ? AL0 : p ? p.clone().add(V(0, -0.03, 0)) : AL1);
        tg.visible = t > SV0 + 11.6 && t < SV0 + 14.8;
        const d2 = hitK(t, H2, 0.12); if (t > H2 - 0.1) MP.alloy.scale.set(1 + 0.3 * d2, Math.max(1e-4, 1 - 0.45 * d2), 1 + 0.2 * d2);
        // film: the lamp comes on, the frames darken one by one
        const on = ease(span(t, SV1 + 1.4, SV1 + 1.8)); lamp.userData.set(on * (t < SV2 ? 1 : 0));
        [0, 1, 2, 3].forEach((i) => film.userData.expose(i, ease(span(t, SV1 + 1.9 + i * 0.6, SV1 + 2.8 + i * 0.6))));
        // sheet: three strikes flatten it; wire: tongs pull the bar out of the vise into a long thin wire
        swing(hm2, t, HSH, V(WX + 0.08, 0.02, -0.1));
        const f = HSH.reduce((s, h) => s + hitK(t, h, 1 / 3), 0); sheet.userData.m.scale.set(1 + 0.9 * f, 1 - 0.8 * f, 1 + 0.9 * f);
        const pw = ease(span(t, SV2 + 4.0, SV2 + 6.2)); wbar.userData.m.scale.set(1 + 2.4 * pw, 1 - 0.75 * pw, 1 - 0.75 * pw);
        tg2.visible = t > SV2 + 3.2 && t < SV2 + 7.0; tg2.rotation.z = Math.PI / 2;
        if (tg2.visible) { const end = V(WX + 0.2 + 0.14 * (1 + 2.4 * pw) + 0.02, 0.015, 0.12), u = 1 - ease(span(t, SV2 + 3.2, SV2 + 3.9)) + easeIn(span(t, SV2 + 6.4, SV2 + 7.0)); tg2.position.copy(end).add(V(0.5 + 0.4 * u, 0, 0)); tg2.userData.set(u > 0.05 ? 0.06 : 0.012); }
        // conductors
        hp.userData.on(ease(span(t, SV3 + 0.4, SV3 + 0.9)));
        wax.forEach(([w, m], i) => { const u = ease(span(t, MELT[i] - 0.2, MELT[i] + 0.4)); w.scale.set(1 + 0.7 * u, Math.max(0.15, 1 - 0.75 * u), 1 + 0.5 * u); m.color.set(0xf3e9c8).lerp(new THREE.Color(0xd8c48e), u); m.roughness = lerp(0.5, 0.12, u); });
        const li = ease(span(t, SV3 + 6.0, SV3 + 6.4)); bl.userData.set(li); pu.visible = li > 0.01; pu.userData.update(t, 1, li);
        const b1 = ease(span(t, SV3 + 9.6, SV3 + 10.1)), b2 = ease(span(t, SV3 + 10.1, SV3 + 10.6));
        pen.userData.beam(b1, LIN); refl.visible = b2 > 0.01;
        if (refl.visible) { const o = V(0.31, 0.0, 0.29).normalize().multiplyScalar(0.36 * b2); stretch(refl, MC, MC.clone().add(o)); dot.visible = true; dot.position.copy(MC).add(o); } else dot.visible = false;
        K.popIn(lPure, t, SV0 + 0.3, H1 - 0.6); K.popIn(lSoft, t, H1 + 0.4, SV0 + 3.4);
        K.popIn(lAgP, t, SV0 + 3.6, SV0 + 5.6); K.popIn(lCuP, t, SV0 + 5.8, SV0 + 8.0); K.popIn(lHard, t, H2 + 0.5, SV0 + 17.4);
        K.popIn(lCn, t, SV0 + 18.2, SV1 - 0.2); K.popIn(lRg, t, SV0 + 18.9, SV1 - 0.2); K.popIn(lSp, t, SV0 + 19.6, SV1 - 0.2);
        K.popIn(lFilm, t, SV1 + 0.4, SV1 + 4.2); K.popIn(lPhoto, t, SV1 + 4.6, SV2 - 0.2);
        K.popIn(lSheet, t, HSH[2] + 0.5, SV3 - 0.2); K.popIn(lWire, t, SV2 + 6.3, SV3 - 0.2);
        K.popIn(lHeat, t, MELT[3] + 0.4, SV3 + 5.0); K.popIn(lEl, t, SV3 + 6.6, SV3 + 8.6); K.popIn(lRef, t, SV3 + 10.8, SV3 + 12.8); K.popIn(lBest, t, SV3 + 13.8, 1e9);
      });
    }

    // ================================================================ 72 ELEMENTS (dark) · platinum is only the 72nd most common
    {
      stage((t) => t >= Q0 - 0.05 && t < QEND);
      const key = new THREE.DirectionalLight(0xfff2e0, 2.0); key.position.set(QX - 2, 5, 6); key.target.position.set(QX, 1, 0); root.add(key, key.target);
      const NQ = 72, DX = 0.07, X0 = QX - (NQ - 1) * DX / 2, BY = 0.2, hOf = (i) => 2.2 * Math.pow(0.935, i) + 0.05;
      add(K.solid(new THREE.BoxGeometry(NQ * DX + 0.2, 0.03, 0.3), M.matte(0x3a3f48, 0.6)), QX, BY - 0.015, 0);
      const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, 1, 0.12).translate(0, 0.5, 0), M.gloss(0x8fa6c4), NQ - 1); root.add(inst);
      const pt = add(K.solid(new THREE.BoxGeometry(0.05, 1, 0.12).translate(0, 0.5, 0), M.gloss(0xdfe4ec)), X0 + (NQ - 1) * DX, BY, 0);
      const ptm = pt.material; ptm.emissive = new THREE.Color(0xffd27a);
      const m4 = new THREE.Matrix4(), sc = new THREE.Vector3(), pos = new THREE.Vector3(), q = new THREE.Quaternion();
      const front = add(K.glowSprite(0xffd27a, 0.25));
      const l1 = lbl('1st: most common', 0.45, '#ffffff', X0 + 0.3, BY + hOf(0) + 0.2), l72 = lbl('72nd: platinum', 0.45, '#ffe08a', X0 + (NQ - 1) * DX - 0.5, BY + 0.6);
      const lRare = lbl('rare, so expensive ✓', 0.5, '#ffe08a', QX + 0.8, BY + 1.4);
      beats.push((t) => {
        if (!shown(inst)) return;
        const g = (i) => ease(span(t, Q0 + 0.6 + i * 0.045, Q0 + 0.9 + i * 0.045));
        for (let i = 0; i < NQ - 1; i++) { pos.set(X0 + i * DX, BY, 0); sc.set(1, Math.max(1e-4, hOf(i) * g(i)), 1); m4.compose(pos, q, sc); inst.setMatrixAt(i, m4); }
        inst.instanceMatrix.needsUpdate = true;
        pt.scale.y = Math.max(1e-4, hOf(NQ - 1) * g(NQ - 1)); pt.visible = g(NQ - 1) > 0.01;
        ptm.emissiveIntensity = 1.2 * ease(span(t, Q0 + 4.2, Q0 + 4.6)) * (1 + 0.15 * Math.sin(t * 5));
        const fi = Math.min(NQ - 1, Math.max(0, (t - Q0 - 0.6) / 0.045)), on = t > Q0 + 0.6 && t < Q0 + 4.4; front.visible = on;
        if (on) front.position.set(X0 + fi * DX, BY + hOf(Math.floor(fi)) + 0.06, 0.08);
        K.popIn(l1, t, Q0 + 1.0, 1e9); K.popIn(l72, t, Q0 + 4.4, 1e9); K.popIn(lRare, t, Q0 + 5.6, 1e9);
      });
    }

    // ================================================================ PLATINUM · little silver · heavy, soft, ductile, 1770 °C · acids · converter · uses
    {
      stage((t) => (t >= P0 - 0.05 && t < P0E) || (t >= P2 - 0.05 && t < PEND)); ST.bake(root, 'plat', PX + 1.3, 6.4, 1.2);
      const PTM = () => metal(NB.plat, 0.24);
      add(K.lump(0.045, PTM(), 4, 0.75, 0.35), PX - 1.62, 0, 0.0).position.y = 0.03; add(K.lump(0.045, metal(NB.silver, 0.2), 7, 0.75, 0.35), PX - 1.38, 0.03, 0.0);
      const lP = tag('platinum', 0.05, '#ffffff', PX - 1.62, 0.13, 0.05), lS = tag('silver', 0.05, '#ffffff', PX - 1.38, 0.13, 0.05), lName = tag('platina: "little silver" ✓', 0.055, '#ffe08a', PX - 1.5, 0.2, 0.05);
      // heavy (lands hard), soft and malleable (a hammer dents it), ductile (drawn into a wire)
      const ib = bar(PTM(), 0.16, 0.035, 0.07, true), IB = V(PX - 1.15, 0, 0), tg = add(K.tongs(0.5)), hm = hammer(), HIT = P2 + 3.4;
      const vise = add(K.solid(new THREE.BoxGeometry(0.06, 0.06, 0.08).translate(0, 0.03, 0), M.matte(0x2b2f38, 0.6)), IB.x - 0.04, 0, 0); vise.visible = false;
      const dust = sparkBurst(8, 0xd8cfc0);
      const lHeavy = tag('heavy: lands with a thud', 0.05, '#ffffff', IB.x + 0.1, 0.16, 0.05), lMal = tag('soft, malleable', 0.05, '#ffffff', IB.x + 0.1, 0.16, 0.05), lDuc = tag('ductile: drawn into a wire', 0.05, '#ffffff', IB.x + 0.3, 0.14, 0.05);
      // the flame: the tongs hold a piece in it; it glows red hot but does not melt
      const FBX = PX - 0.12, bn = add(K.burner(), FBX, 0, 0); fires.push(bn.userData.flame); bn.userData.flame.visible = false;
      const hotM = new THREE.MeshPhysicalMaterial({ color: NB.plat, metalness: 1, roughness: 0.24, emissive: 0xff5a1a, emissiveIntensity: 0 }), hp = add(K.lump(0.03, hotM, 9, 0.7, 0.3)), tgF = add(K.tongs(0.5));
      const lFl = tag('red hot, still solid', 0.05, '#ffb27a', FBX + 0.1, 0.9, 0.05), lMp = tag('melts only at 1770 °C ✓', 0.055, '#ffe08a', FBX + 0.1, 0.9, 0.05);
      // acid: zinc fizzes, platinum does nothing
      const TX = [PX + 0.38, PX + 0.62];
      TX.forEach((x) => { add(K.vial(0.06, 0.26), x, 0, 0); add(K.liquid(0.051, 0.12, 0xd9e89a, 0.36), x, 0.02, 0); });
      const zn = add(K.lump(0.022, M.metal(0x9aa3ad, 0.45), 3, 0.8, 0.4)), pz = add(K.lump(0.022, PTM(), 6, 0.8, 0.4)), tgA = add(K.tongs(0.5));
      const fz = add(K.bubbles(16, V(), 0.14, 0.05, 0.006));
      const lAc = tag('acid', 0.05, '#e6f0b0', PX + 0.5, 0.36, 0.05), lZn = tag('zinc fizzes', 0.05, '#ffffff', TX[0] - 0.05, 0.36, 0.05), lNo = tag('platinum: no reaction ✓', 0.05, '#ffe08a', TX[1] + 0.05, 0.36, 0.05);
      // two cars: one without a converter (dirty smoke), one with a platinum catalytic converter (clean)
      const CAX = PX + 1.45, CBX = PX + 2.45;
      const carA = add(K.toyCar(0x3d6fc4, 1), CAX, 0, 0), carB = add(K.toyCar(0xc8302a, 1), CBX, 0, 0);
      const cv = add(K.converter(0.34), CBX - 0.175 - 0.19, 0, 0); cv.rotation.y = Math.PI; cv.scale.setScalar(0.62);
      const smA = add(K.smoke(16, 0x2e2c2a), CAX - 0.2, 0.05, 0), smB = add(K.smoke(10, 0xe8eef2), CBX - 0.175 - 0.19 - 0.2, 0.066, 0);
      smA.scale.setScalar(0.2); smB.scale.setScalar(0.16);
      const lDirty = tag('no converter: dirty smoke', 0.05, '#ffd0b0', CAX + 0.15, 0.3, 0.05), lCv = tag('catalytic converter: platinum inside', 0.05, '#ffffff', CBX - 0.36, 0.22, 0.1);
      const lClean = tag('cleaner exhaust ✓', 0.05, '#ffe08a', CBX, 0.32, 0.05), lPd = tag('palladium: a cheaper alternate', 0.05, '#ffffff', CBX - 0.36, 0.22, 0.1);
      // a turntable of uses
      const TTX = PX + 3.8, TTR = 0.3, disc = add(new THREE.Group(), TTX, 0, 0);
      disc.add(K.solid(new THREE.CylinderGeometry(0.44, 0.45, 0.03, 64).translate(0, 0.015, 0), M.gloss(0x2a2d33)));
      const tooth = K.tooth(0.06); const fill = K.lump(0.022, PTM(), 2, 0.4, 0.3); fill.position.y = 0.06 * 2.1; tooth.add(fill);
      const cr = K.crucible(0.06, 0.08); cr.material = PTM();
      const film = K.filmStrip(3, 0.07); film.userData.expose(1, 0.8);
      const laser = K.laserPen(0.16);
      const ITEMS = [[K.gemRing(0.05), 'jewellery, gem setting'], [tooth, 'dental fillings'], [K.scalpel(0.22), 'surgical tools'], [cr, 'lab apparatus'],
        [K.ribbonCoil(0.05, 6, PTM()), 'electrical industry'], [laser, 'lasers'], [film, 'photographic materials']];
      const NI = ITEMS.length, STEP = 2.4, ST0 = P5 + 0.6;
      const itemLbl = ITEMS.map(([o, s], i) => { const a = i / NI * Math.PI * 2; o.position.set(Math.sin(a) * TTR, 0.03, Math.cos(a) * TTR); o.rotation.y = a; disc.add(o); return tag(s, 0.055, '#ffffff', TTX, 0.32, TTR + 0.1); });
      beats.push((t) => {
        // the ingot: carried down, let go a little above the table: falls fast, stops dead
        const c = carry(tg, t, P2 + 0.2, IB.clone().add(V(0.08, 0.2, 0)), 0.03);
        if (t < P2 + 1.6) ib.position.copy(c ? tg.position.clone().add(V(-0.08, -0.035, 0)) : IB.clone().add(V(0, 1.2, 0)));
        else ib.position.set(IB.x, K.drop(t, P2 + 1.6, 0.17, 0, 0.16, 0.002).y, 0);
        ib.visible = t > P2 + 0.2; burst(dust, t, P2 + 1.78, V(IB.x + 0.08, 0.005, 0.03));
        swing(hm, t, [HIT], V(IB.x + 0.08, 0.035, 0)); const d = hitK(t, HIT), pw = ease(span(t, P2 + 5.4, P2 + 7.4));
        ib.userData.m.scale.set((1 + 0.15 * d) * (1 + 2.6 * pw), (1 - 0.3 * d) * (1 - 0.7 * pw), (1 + 0.1 * d) * (1 - 0.7 * pw));
        vise.visible = t > P2 + 4.6 && t < P3;
        const pull = t > P2 + 4.6 && t < P2 + 8.2; if (pull) { tg.visible = true; tg.rotation.z = Math.PI / 2; const end = V(IB.x + 0.16 * (1 + 0.15 * d) * (1 + 2.6 * pw) + 0.02, 0.012, 0), u = 1 - ease(span(t, P2 + 4.6, P2 + 5.3)) + easeIn(span(t, P2 + 7.6, P2 + 8.2)); tg.position.copy(end).add(V(0.5 + 0.4 * u, 0, 0)); tg.userData.set(u > 0.05 ? 0.06 : 0.01); }
        else { tg.rotation.z = 0; tg.visible = t > P2 + 0.2 && t < P2 + 2.6; }
        // the flame
        const fl = back(span(t, P2 + 8.8, P2 + 9.2)); bn.userData.flame.visible = fl > 0.01 && t < P3; bn.userData.flame.scale.setScalar(Math.max(1e-4, 0.5 * fl));
        const inF = ease(span(t, P2 + 9.2, P2 + 10.2)), FP = V(FBX, 0.78, 0); tgF.visible = t > P2 + 9.2 && t < P3; hp.visible = tgF.visible;
        if (tgF.visible) { tgF.rotation.z = Math.PI / 2; tgF.position.copy(FP).add(V(0.5 + 0.4 * (1 - inF), 0, 0)); tgF.userData.set(0.03); hp.position.copy(FP).add(V(0.4 * (1 - inF), 0, 0)); }
        hotM.emissiveIntensity = 1.3 * ease(span(t, P2 + 10.2, P2 + 11.6)) * (1 + 0.05 * Math.sin(t * 9));
        // the acid tubes
        const a1 = carry(tgA, t, P3 + 0.8, V(TX[0], 0.27, 0), 0.03), a2 = carry(tgA, t, P3 + 3.4, V(TX[1], 0.27, 0), 0.03); tgA.visible = a1 || a2;
        const zy = K.drop(t, P3 + 2.2, 0.24, 0.032, 0.25, 0.004).y, py = K.drop(t, P3 + 4.8, 0.24, 0.032, 0.25, 0.004).y;
        zn.visible = t > P3 + 0.8; zn.position.copy(t < P3 + 2.2 ? tgA.position.clone().add(V(0, -0.03, 0)) : V(TX[0], zy, 0));
        pz.visible = t > P3 + 3.4; pz.position.copy(t < P3 + 4.8 ? tgA.position.clone().add(V(0, -0.03, 0)) : V(TX[1], py, 0));
        fz.visible = t > P3 + 2.6 && t < P4; fz.userData.update(t, ease(span(t, P3 + 2.6, P3 + 3.2)), V(TX[0], 0.04, 0));
        // the cars: smoke from both; the converter's side is clean
        const run = t > P4 + 0.6; [carA, carB].forEach((cc, i) => { cc.position.y = run ? 0.003 * Math.sin(t * 30 + i) : 0; });
        smA.visible = run; smA.userData.update(t, 2.6 * ease(span(t, P4 + 0.6, P4 + 1.4))); smB.visible = t > P4 + 3.4; smB.userData.update(t, 0.9 * ease(span(t, P4 + 3.4, P4 + 4.2)));
        // the turntable stops at each use in turn
        let k = 0; for (let i = 1; i < NI; i++) k += ease(span(t, ST0 + i * STEP - 1.0, ST0 + i * STEP));
        disc.rotation.y = -k / NI * Math.PI * 2; laser.userData.beam(t > ST0 + 5 * STEP - 0.2 && t < ST0 + 6 * STEP - 0.9 ? 1 : 0, 0.3);
        K.popIn(lP, t, P0 + 0.4, P0 + 3.0); K.popIn(lS, t, P0 + 1.0, P0 + 3.0); K.popIn(lName, t, P0 + 3.3, P0E);
        K.popIn(lHeavy, t, P2 + 2.0, HIT - 0.6); K.popIn(lMal, t, HIT + 0.4, P2 + 5.2); K.popIn(lDuc, t, P2 + 7.5, P2 + 8.8);
        K.popIn(lFl, t, P2 + 10.6, P2 + 11.8); K.popIn(lMp, t, P2 + 12.0, P3);
        K.popIn(lAc, t, P3 + 0.3, P3 + 2.6); K.popIn(lZn, t, P3 + 3.0, P4); K.popIn(lNo, t, P3 + 5.8, P4);
        K.popIn(lDirty, t, P4 + 1.0, P4 + 2.6); K.popIn(lCv, t, P4 + 2.8, P4 + 4.8); K.popIn(lClean, t, P4 + 5.0, P4 + 6.8); K.popIn(lPd, t, P4 + 7.0, P5);
        itemLbl.forEach((l, i) => K.popIn(l, t, ST0 + i * STEP + 0.15, ST0 + (i + 1) * STEP - 1.05));
      });
    }

    // ================================================================ GOLD · shine · sheets, wires · alloy, cast · coins → paper · computers · teeth
    {
      stage((t) => t >= GD0 - 0.05 && t < GDEND); ST.bake(root, 'gold', GDX + 0.75, 5.2, 1.1);
      const AUM = () => metal(NB.gold, 0.18);
      add(K.necklace(0.12, NB.gold, 64), GDX - 1.4, 0, 0.0);
      [[0.06, 0.07], [-0.08, -0.04], [0.02, -0.1]].forEach(([x, z], i) => twinkle(V(GDX - 1.4 + x, 0.02, z), i * 1.3, 0.05, (t) => t > GD0 + 0.4));
      const lShine = tag('shiny, golden colour', 0.05, '#ffe08a', GDX - 1.4, 0.14, 0.05), lTarn = tag('never tarnishes ✓', 0.05, '#ffffff', GDX - 1.4, 0.14, 0.05);
      // sheet and wire
      const WX = GDX - 0.9, sheet = bar(AUM(), 0.14, 0.035, 0.07); sheet.position.set(WX + 0.07, 0, -0.1);
      const wbar = bar(AUM(), 0.12, 0.028, 0.045, true); wbar.position.set(WX + 0.16, 0, 0.12); add(K.solid(new THREE.BoxGeometry(0.06, 0.06, 0.08).translate(0, 0.03, 0), M.matte(0x2b2f38, 0.6)), WX + 0.13, 0, 0.12);
      const hm = hammer(), tg = add(K.tongs(0.5)), HSH = [GD0 + 5.2, GD0 + 6.0], HP = GD0 + 11.2, HA = GD0 + 18.6;
      const lSheet = tag('hammered into a sheet', 0.05, '#ffffff', WX + 0.07, 0.15, -0.05), lWire = tag('drawn into a wire', 0.05, '#ffffff', WX + 0.45, 0.13, 0.15);
      // pure gold dents; melted with copper, silver, platinum and cast: lasts longer
      const pureX = GDX - 0.05, pure = bar(AUM(), 0.16, 0.035, 0.07); pure.position.set(pureX, 0, 0.0);
      const trio = add(new THREE.Group()); [[NB.copper, -0.02], [NB.silver, 0.0], [NB.plat, 0.02]].forEach(([c, x], i) => { const l = K.lump(0.016, metal(c, 0.25), i + 2, 0.7, 0.3); l.position.set(x, 0, (i - 1) * 0.012); trio.add(l); });
      const MP = meltPour(GDX + 0.4, 0xf0c060, [{ o: trio, t: GD0 + 12.6 }], GD0 + 15.0, null);
      const lPure = tag('pure gold: too soft', 0.05, '#ffd0b0', pureX, 0.15, 0.05), lMix = tag('+ copper, silver, platinum', 0.05, '#ffffff', GDX + 0.4, 0.36, 0.05);
      const lCast = tag('cast into a shape', 0.05, '#ffffff', GDX + 0.72, 0.18, 0.05), lDur = tag('gold alloy: lasts longer ✓', 0.05, '#ffe08a', GDX + 0.7, 0.2, 0.05);
      // coins → paper money
      const KX = GDX + 1.4, stack = Array.from({ length: 5 }, (_, i) => add(K.coin(0.055, NB.gold, 0.01), KX - 0.1 + 0.004 * Math.sin(i * 2), i * 0.0102, 0.004 * Math.cos(i * 3)));
      const note = add(K.banknote(0.26, 0.13));
      const lOld = tag('long ago: gold coins', 0.05, '#ffe08a', KX - 0.1, 0.14, 0.05), lNote = tag('then paper money', 0.05, '#ffffff', KX + 0.13, 0.12, 0.05);
      // computers: signals run along the gold contacts
      const bd = add(K.circuitBoard(0.36, 0.22), GDX + 2.15, 0, 0);
      const sig = bd.userData.fingers.map((x, i) => { const p = K.pulses(new THREE.CatmullRomCurve3([V(x, 0.016, -0.04), V(x, 0.016, 0.1)]), 2); p.children.forEach((c) => c.scale.setScalar(0.03)); bd.add(p); return p; });
      const lPc = tag('computers: gold contacts', 0.05, '#ffffff', GDX + 2.15, 0.14, 0.05), lSig = tag('fast, reliable signals ✓', 0.05, '#ffe08a', GDX + 2.15, 0.14, 0.05);
      // teeth: a gold crown slides down onto a tooth
      const TS = 0.08, tth = add(K.tooth(TS), GDX + 2.85, 0, 0), crown = add(K.toothCrown(TS));
      const lCrown = tag('a gold crown', 0.05, '#ffe08a', GDX + 2.85, 0.32, 0.05), lInert = tag('inert, non-allergic ✓', 0.05, '#ffffff', GDX + 2.85, 0.32, 0.05), lEasy = tag('easy for the dentist to work', 0.05, '#ffffff', GDX + 2.85, 0.06, 0.18);
      beats.push((t) => {
        swing(hm, t, t < GD0 + 9 ? HSH : t < GD0 + 15 ? [HP] : [HA], t < GD0 + 9 ? V(WX + 0.07, 0.02, -0.1) : t < GD0 + 15 ? V(pureX, 0.035, 0) : V(MP.alloy.position.x, MP.alloy.position.y + 0.03, 0));
        const f = HSH.reduce((s, h) => s + hitK(t, h, 0.5), 0); sheet.userData.m.scale.set(1 + 0.9 * f, 1 - 0.8 * f, 1 + 0.9 * f);
        const pw = ease(span(t, GD0 + 7.6, GD0 + 9.6)); wbar.userData.m.scale.set(1 + 4 * pw, 1 - 0.75 * pw, 1 - 0.75 * pw);
        tg.visible = t > GD0 + 6.9 && t < GD0 + 10.4; tg.rotation.z = Math.PI / 2;
        if (tg.visible) { const end = V(WX + 0.16 + 0.12 * (1 + 4 * pw) + 0.02, 0.014, 0.12), u = 1 - ease(span(t, GD0 + 6.9, GD0 + 7.5)) + easeIn(span(t, GD0 + 9.8, GD0 + 10.4)); tg.position.copy(end).add(V(0.5 + 0.4 * u, 0, 0)); tg.userData.set(u > 0.05 ? 0.06 : 0.012); }
        const d1 = hitK(t, HP); pure.userData.m.scale.set(1 + 0.3 * d1, 1 - 0.45 * d1, 1 + 0.2 * d1);
        const d2 = hitK(t, HA, 0.12); if (t > HA - 0.1) MP.alloy.scale.set(1 + 0.3 * d2, Math.max(1e-4, 1 - 0.45 * d2), 1 + 0.2 * d2);
        // the banknote flutters down beside the coins
        const nu = ease(span(t, GD0 + 22.6, GD0 + 24.2)); note.visible = t > GD0 + 22.6;
        note.position.set(KX + 0.13 + 0.04 * Math.sin(nu * 7) * (1 - nu), lerp(0.6, 0.001, nu), 0.02); note.rotation.set(0.35 * Math.sin(nu * 9) * (1 - nu), 0.3, 0.25 * Math.sin(nu * 6 + 1) * (1 - nu));
        sig.forEach((p, i) => { p.visible = t > GD0 + 25.4; p.userData.update(t * 1.6 + i * 0.13, 1, 1); });
        const cu = ease(span(t, GD0 + 30.0, GD0 + 31.4)); crown.visible = t > GD0 + 29.6; crown.position.set(GDX + 2.85, TS * 1.28 + 0.35 * (1 - cu), 0); { const k = Math.max(1e-4, back(span(t, GD0 + 29.6, GD0 + 30.0))); crown.scale.set(1.08 * k, 1.22 * k, 1.08 * k); }
        K.popIn(lShine, t, GD0 + 0.6, GD0 + 2.2); K.popIn(lTarn, t, GD0 + 2.4, GD0 + 4.4);
        K.popIn(lSheet, t, HSH[1] + 0.5, GD0 + 10.2); K.popIn(lWire, t, GD0 + 9.7, GD0 + 10.2);
        K.popIn(lPure, t, HP + 0.4, GD0 + 12.4); K.popIn(lMix, t, GD0 + 13.4, GD0 + 15.4); K.popIn(lCast, t, GD0 + 16.4, HA - 0.5); K.popIn(lDur, t, HA + 0.5, GD0 + 20.4);
        K.popIn(lOld, t, GD0 + 20.8, GD0 + 23.8); K.popIn(lNote, t, GD0 + 24.0, GD0 + 25.0);
        K.popIn(lPc, t, GD0 + 25.6, GD0 + 27.4); K.popIn(lSig, t, GD0 + 27.6, GD0 + 29.4);
        K.popIn(lCrown, t, GD0 + 30.2, GD0 + 32.0); K.popIn(lInert, t, GD0 + 32.2, 1e9); K.popIn(lEasy, t, GD0 + 33.0, 1e9);
      });
    }

    // ================================================================ COINS · copper, silver, gold · the copper–nickel coin of today
    {
      stage((t) => t >= C0 - 0.05 && t < CEND); ST.bake(root, 'coins', CX0 + 0.15, 1.4, 1.0);
      add(K.solid(new THREE.BoxGeometry(0.7, 0.02, 0.3), M.matte(0x5a1a22, 0.9)), CX0 - 0.05, 0.01, 0);
      const KC = [[NB.copper, 'copper'], [NB.silver, 'silver'], [NB.gold, 'gold']];
      const old = KC.map(([c], i) => add(K.coin(0.065, c, 0.01), CX0 - 0.25 + i * 0.2, 0.02, 0));
      old.forEach((o, i) => twinkle(o.position.clone().add(V(0.02, 0.012, 0.03)), i * 1.9, 0.05, (t) => t > C0 + 2.0));
      const lOld = tag('old coins: copper, silver, gold', 0.05, '#ffffff', CX0 - 0.05, 0.14, 0.05), lLus = tag('shiny and easy to shape', 0.05, '#ffe08a', CX0 - 0.05, 0.14, 0.05);
      const lCu = tag('copper: the common coin metal', 0.05, '#ffb08a', CX0 - 0.05, 0.14, 0.05);
      const nw = add(new THREE.Group()), nc = K.coin(0.06, NB.cuni, 0.01); nw.add(nc);
      const lNew = tag('coins today: copper–nickel alloy ✓', 0.055, '#ffffff', CX0 + 0.12, 0.2, 0.05);
      beats.push((t) => {
        const r = ease(span(t, C0 + 6.0, C0 + 7.4)), x = lerp(CX0 + 0.85, CX0 + 0.45, r), tip = ease(span(t, C0 + 7.4, C0 + 8.0));
        nw.visible = t > C0 + 5.9; nw.position.set(x, 0.06 * (1 - tip), 0.0); nw.rotation.z = -(x - CX0 - 0.85) / 0.06 * (1 - tip);
        nc.rotation.x = Math.PI / 2 * (1 - tip) + 0.06 * Math.sin(Math.PI * span(t, C0 + 8.0, C0 + 8.4)); nc.position.y = 0;
        old[0].position.y = 0.02 + 0.015 * Math.sin(Math.PI * span(t, C0 + 4.0, C0 + 4.6));
        K.popIn(lOld, t, C0 + 0.5, C0 + 2.2); K.popIn(lLus, t, C0 + 2.4, C0 + 3.9); K.popIn(lCu, t, C0 + 4.2, C0 + 6.0); K.popIn(lNew, t, C0 + 7.8, 1e9);
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Why does gold never rust?', intro: INTRO, ticks: TICKS,
      rows: [[0, 'iron · gold'], [1, 'damp air: iron rusts, gold doesn\'t'], [1, 'inside: gold holds its electrons'], [1, 'noble metals: found free, rare'],
        [1, 'valuable: inert, rare, useful'], [1, 'silver: coins, film, best conductor'], [1, 'platinum: converters, jewellery, labs'], [1, 'gold: jewellery, computers, teeth']],
      short: ['damp air', 'inside', 'noble', 'valuable', 'silver', 'platinum', 'gold'] }));
    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));
    beats.push(() => { const nar = Math.min(1, (cam.aspect / 1.5) ** 0.7); tags.forEach((l) => { if (l.visible) l.scale.multiplyScalar(cam.position.distanceTo(l.position) * 2 * TAN * l.userData.frac * nar / 0.1); }); });
    // polished noble metals mirror the studio photo (scene.environment alone leaves them black)
    if (ST.on) K.photoEnv('bake/studio.hdr').then((tx) => scene.traverse((o) => { const m = o.material; if (m && !Array.isArray(m) && m.metalness === 1) { m.envMap = tx; m.envMapIntensity = 1.6; m.needsUpdate = true; } }));

    return (t, dt) => { for (const b of beats) b(t, dt); };
  },
};
