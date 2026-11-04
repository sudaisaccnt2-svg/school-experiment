// Lesson 813 · Soft and hard metals (book pp. 235–236: 8.1.4 Soft and Hard Metals + Table 8.7 sodium vs iron), v1
// (2026-10-14). Built from SKILL §0 + the approved 804 v2 comparison layout and the 807 sodium tests: one steel knife
// as the hook, ONE question on a card, every test shows sodium AND iron, its result labelled on the thing.
// THE QUESTION: "Why is sodium soft but iron hard?" → card: knife · table · inside · melt, boil · float, sink · pull · react.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//   HOOK    a block of sodium and a block of iron on a tile. A steel knife slices the sodium like cheese; the knife is
//           steel (mostly iron!); on the iron block it only scrapes and throws sparks · both are metals, why so
//           different? → card (tick 1: the knife test).
//   TABLE   (dark) the periodic table: Na and Fe light up; group IA, IIA, the transition metals, the lanthanides and
//           actinides light up one by one: all metals · IA + IIA turn blue: soft metals (Na: alkali metal, atomic
//           number 11) · Cu, Ag, Fe turn gold: hard metals (Fe: transition metal, atomic number 26) (tick 2).
//   INSIDE  (dark) one sodium atom 2, 8, 1: only 1 outer electron · it shrinks into a little crystal of sodium atoms
//           with thin, dim links (weak metallic bonds) · the knife pushes in: the atoms slide apart (soft) · the iron
//           crystal: small atoms, thick bright links (strong metallic bonds) · the knife stops on top, the links
//           flash, nothing moves (hard) (tick 3).
//   HEAT    two burners: sodium in a dish beside a thermometer melts at 97.6 °C; an iron nail glows red but stays
//           solid · (dark) bars: melting points 97.6 vs 1538 °C, boiling points 880 vs 2862 °C (tick 4).
//   WATER   tongs drop sodium into water: it floats (0.927 g/cm³); an iron cube sinks and settles (7.874 g/cm³) · a
//           balance: one iron cube against same-size sodium cubes: 8½ of them balance it (tick 5).
//   PULL    the same weight hangs on a sodium wire (it stretches and snaps: low tensile strength) and on an iron wire
//           (it holds: high tensile strength) · so iron builds bridges (a car crosses) and buildings; it makes steel (tick 6).
//   AIR     fresh sodium dulls in seconds, an iron nail stays shiny; tongs put the sodium under kerosene oil · (dark)
//           why: sodium's outer electron leaves easily (a short gold bar: low ionization energy, very electropositive);
//           iron holds its electrons (a tall bar: high ionization energy, less electropositive) (tick 7).
//   END     back at the knife table: sodium = weak hold, soft metal; iron = strong hold, hard metal.
// Book points (all): IA, IIA, transition metals, lanthanides and actinides are all metals, with big differences ·
// IA and IIA metals are soft, very reactive, low ionization energies, very electropositive = soft metals · Cu, Ag, Fe
// less reactive, high ionization energies, less electropositive = hard / noble metals; much higher melting points,
// boiling points and densities · Table 8.7: alkali metal Z 11 | transition metal Z 26 · one outer electron, very soft,
// cut with a knife | hard, great energy to break · atoms less firmly held, metallic bonds | hard, tough, strong, strong
// metallic bonding · weak | strong attractive force between atoms · mp 97.6 | 1538 °C · bp 880 | 2862 °C · density
// 0.927 | 7.874 g/cm³ · floats | settles at the bottom of water · low tensile strength, not where stress is required |
// high: buildings, bridges, steel · very reactive, kept in kerosene oil | less reactive. Table 8.7 → 🎮 game (COVERAGE_U8).
// Book note: Table 8.7 prints sodium's density as 0.927 g/cm³ (Table 8.4: 0.971; real 0.968): shown as printed (NOTES.md).
// §1 CHECK (sheets renders/lesson/d813*.jpg, s813.jpg, scr813.jpg): nothing missing ✓ · one question + bridges ✓ ·
// familiar hook (a knife) paid off at the end ✓ · comparison side by side in every test (804 v2) ✓ · each test:
// question → before → visible cause (knife, burner, tongs, weight, air) → result labelled ✓ · numbers as things (bars,
// 8½ cubes on a balance) ✓ · ≤ 3 labels a shot ✓ · one place at a time ✓ · camera moves ≥ 2 s ✓ · baked tables, dark
// table/atoms/bars ✓ · substances own colours (silver sodium, dark iron, blue water, amber kerosene, gold weight) ✓ ·
// every screen ✓ · flicker 0 ✓.
import * as THREE from 'three';
import * as K from './kit.js';
import { place } from '../games/u3data.js';
const { M, span, ease, easeIn, back, lerp } = K;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

const TAN = Math.tan(16 * Math.PI / 180), ASP = 1.6, ADIR = [0, 0.45, 1], DDIR = [0, 0.12, 1], HDIR = [-0.5, 0.5, 1];   // the hook is seen from the left: the knife blade shows its face
let DOCK = 1e9;
/** a shot: the subject (look, w × h) seen along dir; the engine refits it to the real screen (fit = 6th element) */
function S(t, look, w, h, dir = ADIR, e) {
  h *= 1.14; look = [look[0], look[1] + 0.05 * h, look[2]];        // headroom: the caption floats just above the subject (capNear)
  const dk = t >= DOCK, d = V(...dir).normalize(), dist = Math.max(h / 2 / TAN, (dk ? w / (1 - K.DOCK_W) : w) / 2 / (TAN * ASP)) * 1.1;
  const pos = V(...look).addScaledVector(d, dist).toArray(), fit = { look, w, h, dir, dock: dk ? K.DOCK_W : 0 };
  return dk ? [t, ...K.dockShot(pos, look), undefined, e, fit] : [t, pos, look, undefined, e, fit];
}

// ---------------------------------------------------------------- places (stations 10 apart)
const KX = -0.38, FEX = 0.42, TT = 0.032, FEH = 0.2;                     // hook tile: sodium block · iron block (its height)
const TBX = 20, TP = 0.5, COL = (c) => TBX + (c - 9.5) * TP, TY = (r) => 4.6 - (r - 1) * TP - (r > 7 ? 0.25 : 0);   // the f rows stay above the floor   // the periodic table (dark)
const LX = 30, LY = 1.6, FX = 34.3, NG = 0.42, NR = 0.17, FG = 0.3, FR = 0.12;   // the sodium crystal, the iron crystal
const HA = 39.55, HB = 40.45, DISH = 0.752, BEAD = DISH + 0.016;         // heat: sodium rig, iron rig
const BXS = [49.2, 49.62, 50.48, 50.9], BY = 0.3, KV = 0.00095;           // bars: mp Na, Fe · bp Na, Fe
const WA = 59.55, WB = 60.15, BR = 0.2, Y0 = 0.055, SURF = Y0 + 0.3, BX = 61.8, CUBE = 0.06;   // water beakers · balance
const PA = 69.35, PB = 70.15, JAW = 0.8, WIRE = 0.36, BRX = 71.85, BLD = 72.7;   // stands (jaw at x + 0.3) · bridge · building
const GA = 79.6, GB = 80.2, KJ = 80.85;                                   // watch glasses · kerosene jar
const YNA = 89.0, YFE = 94.8, AY = 1.9;                                   // why: the two atoms

// ---------------------------------------------------------------- time (every camera move ≥ 2 s)
const T = { name: 0.6, fe: 1.8, kn: 3.4, steel: 8.6, ask: 16.4, card: 19.2 };
DOCK = T.card + 5.0;
const C0 = 5.2, KF = 12.0;                                                // the knife cuts the sodium · the knife reaches the iron
const TB0 = DOCK + 2.0, TEND = TB0 + 19;
const I0 = TEND, IN = I0 + 4.5, IK = I0 + 8.5, IF = I0 + 12.5, IFK = I0 + 16.5, IEND = I0 + 21;
const H0 = IEND, FIRE = H0 + 2.6, MP = H0 + 7.0, HEND = MP + 7.0;
const B0 = HEND, BB = B0 + 5.5, BEND = B0 + 12;
const W0 = BEND, WN = W0 + 0.8, WF = W0 + 4.8, WBAL = W0 + 10.6, WC = W0 + 12.6, WEND = W0 + 24.0;
const P0 = WEND, PW1 = P0 + 0.4, SNAP = P0 + 3.6, PW2 = P0 + 5.6, PBR = P0 + 10.4, PEND = P0 + 19;
const A0 = PEND, TARN = A0 + 2.6, AK = A0 + 8.2, AEND = A0 + 13.5;
const Y0T = AEND, YP = Y0T + 2.6, YF = Y0T + 9.6, YFP = YF + 2.2, YEND = Y0T + 20;
const END = YEND; T.done = END + 12.5;
const CUBES = Array.from({ length: 9 }, (_, i) => WC + 0.2 + i * 0.9);   // each: carry 0.55 s, back 0.35 s   // tongs carry the sodium cubes onto the pan
const INTRO = [T.card, DOCK];
const TICKS = [[DOCK + 1.2, 0], [TEND - 0.6, 1], [IEND - 0.6, 2], [BEND - 0.6, 3], [WEND - 0.6, 4], [PEND - 0.6, 5], [YEND - 0.6, 6]];
const dark = (t) => [[TB0, TEND], [I0, IEND], [B0, BEND], [Y0T, YEND]].some(([a, b]) => t >= a - 0.05 && t < b - 0.05);

const captions = [
  [0.3, T.kn, 'Two metals: sodium and iron'],
  [T.kn, C0 + 0.8, 'Can a steel knife cut them?'],
  [C0 + 0.8, T.steel, 'Sodium is so soft a knife cuts it'],
  [T.steel, KF - 0.4, 'Yet the knife is steel: mostly iron!'],
  [KF - 0.4, T.ask, 'Iron is hard: the knife can\'t cut it'],
  [T.ask, T.card, 'Both are metals. Why so different?'],
  [T.card, DOCK, 'Why is sodium soft but iron hard?'],
  [DOCK, TB0, 'The knife test: soft and hard ✓'],
  [TB0, TB0 + 3.5, 'Where are sodium and iron?'],
  [TB0 + 3.5, TB0 + 9.5, 'IA, IIA, transition metals, lanthanides, actinides: metals'],
  [TB0 + 9.5, TB0 + 14, 'Groups IA and IIA: soft metals'],
  [TB0 + 14, TEND, 'Copper, silver, iron: hard metals ✓'],
  [I0, IN, 'Inside sodium: only 1 outer electron'],
  [IN, IK, 'Its atoms hold each other weakly'],
  [IK, IF, 'The knife pushes the atoms apart: soft ✓'],
  [IF, IFK, 'Iron atoms hold each other strongly'],
  [IFK, IEND, 'The knife can\'t part them: hard ✓'],
  [H0, FIRE + 0.4, 'Heat both: which melts first?'],
  [FIRE + 0.4, MP, 'Watch the thermometer'],
  [MP, MP + 3.4, 'Sodium melts at only 97.6 °C'],
  [MP + 3.4, HEND, 'Iron glows red but stays solid'],
  [B0, BB, 'Iron melts only at 1538 °C'],
  [BB, BEND, 'Boiling: 880 °C against 2862 °C ✓'],
  [W0, WF - 0.8, 'Into water: float or sink?'],
  [WF - 0.8, WF + 2.4, 'Sodium floats: lighter than water'],
  [WF + 2.4, WBAL, 'Iron sinks to the bottom: heavy'],
  [WBAL, WC + 1.0, 'Same-size cubes: which is heavier?'],
  [WC + 1.0, CUBES[8] + 0.6, 'Count the sodium cubes…'],
  [CUBES[8] + 0.6, WEND, '8½ sodium cubes balance 1 iron cube ✓'],
  [P0, SNAP - 1.0, 'Hang the same weight on each wire'],
  [SNAP - 1.0, PW2 + 1.4, 'Sodium snaps: low tensile strength'],
  [PW2 + 1.4, PBR, 'Iron holds: high tensile strength ✓'],
  [PBR, PBR + 4.4, 'So iron builds bridges and buildings'],
  [PBR + 4.4, PEND, 'It is also used to make steel ✓'],
  [A0, TARN, 'Leave both in the air'],
  [TARN, TARN + 3.0, 'Sodium dulls in seconds: very reactive'],
  [TARN + 3.0, AK, 'Iron stays shiny: less reactive'],
  [AK, AEND, 'So sodium is kept under kerosene oil'],
  [Y0T, YP + 0.4, 'Why is sodium so reactive?'],
  [YP + 0.4, Y0T + 7.0, 'Its outer electron leaves easily'],
  [Y0T + 7.0, YF, 'Very electropositive: a soft metal'],
  [YF, YFP + 3.6, 'Iron holds its electrons tightly'],
  [YFP + 3.6, YEND, 'Less electropositive, less reactive: a hard metal ✓'],
  [END, END + 4.0, 'Sodium: atoms held weakly, a soft metal'],
  [END + 4.0, END + 8.0, 'Iron: atoms held strongly, a hard metal'],
  [END + 8.0, T.done, 'Soft or hard: it is the hold inside ✓'],
];

// ---------------------------------------------------------------- camera
const HW = (t, k = 1, e) => S(t, [0.05, 0.3, 0.05], 1.85 * k, 0.85 * k, HDIR, e);
const KB = (t, k = 1, e) => S(t, [KX, 0.26, 0.02], 1.15 * k, 0.86 * k, HDIR, e);
const FB = (t, k = 1, e) => S(t, [FEX, 0.26, 0.02], 1.1 * k, 0.82 * k, HDIR, e);
const TAB = (t, k = 1, e) => S(t, [TBX, 2.65, 0], 9.4 * k, 5.9 * k, DDIR, e);
const LAT = (t, x, k = 1, e) => S(t, [x, LY, 0], 2.5 * k, 2.1 * k, DDIR, e);
const HT = (t, k = 1, e) => S(t, [(HA + HB) / 2 - 0.1, 0.68, 0], 1.75 * k, 1.35 * k, ADIR, e);
const HC = (t, x, k = 1, e) => S(t, [x, 0.95, 0], 0.85 * k, 0.6 * k, ADIR, e);
const BARS = (t, x, w, k = 1, e) => S(t, [x, BY + 1.3, 0], w * k, 3.5 * k, DDIR, e);
const WW = (t, k = 1, e) => S(t, [(WA + WB) / 2, 0.35, 0.1], 1.3 * k, 0.98 * k, ADIR, e);
const BAL = (t, k = 1, e) => S(t, [BX - 0.22, 0.3, 0], 1.2 * k, 0.72 * k, ADIR, e);
const PL = (t, k = 1, e) => S(t, [(PA + PB) / 2 + 0.3, 0.52, 0], 1.5 * k, 1.15 * k, ADIR, e);
const BRG = (t, k = 1, e) => S(t, [(BRX + BLD) / 2 - 0.05, 0.3, 0], 1.55 * k, 0.75 * k, ADIR, e);
const AIR = (t, x, w, k = 1, e) => S(t, [x, 0.22, 0], w * k, 0.62 * k, ADIR, e);
const AT1 = (t, x, k = 1, e) => S(t, [x, AY + 0.05, 0], 3.2 * k, 3.1 * k, DDIR, e);
const cams = [
  // HOOK: wide, the knife on the sodium, the knife on the iron, wide for the question
  HW(0, 1.04), HW(T.kn - 0.6, 1.0), KB(C0 - 0.4, 1.04), KB(KF - 1.6, 0.98), FB(KF + 0.4, 1.04), FB(T.ask - 0.2, 0.98), HW(T.ask + 2.2, 1.02), HW(T.card, 1.0), HW(DOCK, 1.02), HW(TB0 - 0.05, 0.99),
  // TABLE (dark)
  TAB(TB0, 1.04), TAB(TEND - 0.05, 0.98),
  // INSIDE (dark): the atom, its crystal, the iron crystal
  S(I0, [LX, LY, 0], 2.9, 2.6, DDIR), S(IN - 0.1, [LX, LY, 0], 2.8, 2.5, DDIR), LAT(IN + 2.0, LX, 1.04), LAT(IF - 0.1, LX, 0.98), LAT(IF + 2.2, FX, 1.02), LAT(IEND - 0.05, FX, 0.96),
  // HEAT: both rigs, push to the sodium dish, then to the iron
  HT(H0, 1.04), HT(MP - 2.6, 1.0), HC(MP - 0.4, HA, 1.04), HC(MP + 3.0, HA, 0.98), HC(MP + 5.2, HB, 1.02), HC(HEND - 0.05, HB, 0.98),
  // BARS (dark): melting points, then boiling points beside them
  S(B0, [(BXS[0] + BXS[1]) / 2, BY + 0.95, 0], 2.0, 2.4, DDIR), S(BB - 0.2, [(BXS[0] + BXS[1]) / 2, BY + 0.95, 0], 1.95, 2.35, DDIR), BARS(BB + 2.0, (BXS[0] + BXS[3]) / 2, 2.9, 1.02), BARS(BEND - 0.05, (BXS[0] + BXS[3]) / 2, 2.9, 0.98),
  // WATER: both beakers, follow each drop, then the balance
  WW(W0, 1.06), WW(WN + 0.6, 1.02), WW(WF + 2.4, 0.94), WW(WBAL - 0.1, 0.9), BAL(WBAL + 2.0, 1.04), BAL(WEND - 0.05, 0.97),
  // PULL: both wires, then the bridge and the building
  PL(P0, 1.04), PL(PBR - 0.1, 0.97), BRG(PBR + 2.2, 1.04), BRG(PEND - 0.05, 0.97),
  // AIR: both watch glasses, then the kerosene jar
  AIR(A0, (GA + GB) / 2, 1.2, 1.04), AIR(AK - 0.2, (GA + GB) / 2, 1.2, 0.98), AIR(AK + 2.0, (GB + KJ) / 2, 1.35, 1.04), AIR(AEND - 0.05, (GB + KJ) / 2, 1.35, 0.98),
  // WHY (dark): the sodium atom, then the iron atom, then both bars
  AT1(Y0T, YNA + 0.5, 1.04), AT1(YF - 0.1, YNA + 0.5, 0.98), AT1(YF + 2.1, YFE + 0.55, 1.02), AT1(YEND - 2.4, YFE + 0.55, 0.98), S(YEND - 0.2, [(YNA + YFE) / 2 + 0.6, AY + 0.1, 0], 8.6, 3.8, DDIR),
  // END: the knife table again
  HW(END, 1.04), HW(T.done, 0.98),
];

export default {
  capNear: true, oneText: true,
  duration: T.done,
  fog: [18, 40],                                                        // the wide table shot stays clear
  captions,
  cams,

  build({ scene, cam, R }) {
    const beats = [], fires = [];
    const ST = K.studio({ scene, R }, '813', { dark });                 // FIRST: models read the look
    beats.push((t) => ST.update(t));
    let root = scene;
    const add = (o, x = 0, y = 0, z = 0) => { o.position.set(x, y, z); root.add(o); return o; };
    const stage = (show) => { root = new THREE.Group(); scene.add(root); const g = root; beats.push((t) => { g.visible = show(t); }); return g; };
    const lbl = (text, h, color, x, y, z = 0, w = 700) => add(K.label(text, h, color, w), x, y, z);
    const tags = [], tag = (text, h, color, x, y, z = 0, w = 700) => { const l = lbl(text, 0.1, color, x, y, z, w); l.userData.frac = h * 1.8; tags.push(l); return l; };
    const shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
    const naMat = () => new THREE.MeshPhysicalMaterial({ color: 0xc9c6bd, metalness: 0.35, roughness: 0.55, clearcoat: 0.3 });   // sodium in air: dull silver
    const feMat = () => new THREE.MeshPhysicalMaterial({ color: 0x8a9098, metalness: 0.85, roughness: 0.32, clearcoat: 0.4, emissive: 0xff4a10, emissiveIntensity: 0 });
    /** tongs bring something down from above to `to` (arrive m0+1.2), let go at m0+1.4, rise away by m0+2.4 */
    const carry = (tg, t, m0, to, gap = 0.03) => {
      const on = t > m0 && t < m0 + 2.4; if (!on) return false;
      const top = to.clone().add(V(0, 1.1, 0));
      tg.position.copy(t < m0 + 1.2 ? top.lerp(to, 1 - (1 - span(t, m0, m0 + 1.2)) ** 2) : t < m0 + 1.5 ? to.clone() : to.clone().lerp(top, easeIn(span(t, m0 + 1.5, m0 + 2.4))));
      tg.userData.set(lerp(gap, gap + 0.05, span(t, m0 + 1.35, m0 + 1.5))); return true;
    };
    /** tongs move a thing from a to b: down to a (t0 … t0+0.8), lift and swing over in an arc (… t0+1.9), down and let go
     *  at t0+2.4, then rise away (… t0+3.2). Returns where the thing is (null = not held) */
    const move = (tg, t, t0, a, b, gap = 0.03, lift = 0.35) => {
      const on = t > t0 && t < t0 + 3.2; tg.visible = on; if (!on) return null;
      const A = a.clone().add(V(0, 0.9, 0)), Ab = a.clone().add(V(0, lift, 0)), Bb = b.clone().add(V(0, lift, 0)), Bt = b.clone().add(V(0, 0.9, 0));
      let p, held = true;
      if (t < t0 + 0.8) { p = A.lerp(a, 1 - (1 - span(t, t0, t0 + 0.8)) ** 2); held = false; }
      else if (t < t0 + 1.1) p = a.clone().lerp(Ab, ease(span(t, t0 + 0.85, t0 + 1.1)));
      else if (t < t0 + 1.9) p = K.arc(Ab, Bb, 0.12, ease(span(t, t0 + 1.1, t0 + 1.9)));
      else if (t < t0 + 2.4) p = Bb.clone().lerp(b, ease(span(t, t0 + 1.9, t0 + 2.35)));
      else { p = b.clone().lerp(Bt, easeIn(span(t, t0 + 2.45, t0 + 3.2))); held = false; }
      tg.position.copy(p); tg.userData.set(held ? gap : gap + 0.05); return held ? p : null;
    };
    const sparkBurst = (n = 8) => Array.from({ length: n }, (_, i) => ({ s: add(K.sparkle(0xfff2c0, 0.06)), a: K.hash(i, 7) * 6.283, v: 0.5 + K.hash(i, 8) * 0.6 }));
    const burst = (sp, t, t0, at, on = true) => sp.forEach((q, i) => {
      const k = span(t, t0 + i * 0.03, t0 + 0.45 + i * 0.03); q.s.visible = on && k > 0 && k < 1;
      if (q.s.visible) { q.s.position.copy(at).add(V(Math.cos(q.a) * q.v * 0.25 * k, 0.12 * k * (1.4 - k) * q.v, Math.sin(q.a) * q.v * 0.18 * k)); q.s.scale.setScalar(Math.max(1e-4, 0.06 * (1 - k))); }
    });

    // ================================================================ HOOK / END · the knife on sodium, then on iron
    {
      stage((t) => t < TB0 - 0.05 || t >= END - 0.05); ST.bake(root, 'hook', 0, 2.2, 1.2);
      add(K.solid(new THREE.BoxGeometry(1.5, 0.03, 0.62), M.gloss(0xf2f0ea)), 0.02, 0.015, 0.04);   // a white tile
      const na = add(K.sodiumBlock(0.5, 0.24, 0.3), KX, TT + 0.002, 0);
      const { shine } = na.userData, fresh = new THREE.Color(0xf4f6f8), dullC = new THREE.Color(0x6f6b64);
      if (ST.on) K.photoEnv('bake/studio.hdr').then((tx) => { shine.envMap = tx; shine.envMapIntensity = 1.7; shine.needsUpdate = true; });
      const fe = add(K.solid(new THREE.BoxGeometry(0.42, FEH, 0.28).translate(0, FEH / 2, 0), feMat()), FEX, TT + 0.002, 0);
      const kn = add(K.knife()); kn.rotation.y = Math.PI / 2;
      const sp = sparkBurst(10), sp2 = sparkBurst(10);
      const lNa = tag('sodium', 0.05, '#ffffff', KX, 0.42, 0.1), lFe = tag('iron', 0.05, '#ffffff', FEX, 0.42, 0.1);
      const lSoft = tag('soft: a knife cuts it ✓', 0.05, '#f3e7c0', KX + 0.05, 0.62, 0.1), lSteel = tag('steel knife: mostly iron', 0.05, '#ffffff', KX + 0.05, 0.92, 0.1);
      const lHard = tag('hard: the knife can\'t cut it ✓', 0.05, '#ffffff', FEX, 0.6, 0.1);
      const lS2 = tag('soft', 0.055, '#9ec0ff', KX - 0.05, 0.42, 0.1), lH2 = tag('hard', 0.055, '#ffd27a', FEX + 0.1, 0.48, 0.1);
      const lS3 = tag('weak hold: a soft metal', 0.05, '#9ec0ff', KX - 0.1, 0.52, 0.1), lH3 = tag('strong hold: a hard metal', 0.05, '#ffd27a', FEX + 0.1, 0.7, 0.1);
      beats.push((t) => {
        // the knife: down onto the sodium, a lift, then through it; up; over to the iron; it presses, scrapes, sparks
        const up = Math.sin(Math.PI * span(t, C0, C0 + 0.3)) * 0.12, cut = easeIn(span(t, C0 + 0.3, C0 + 0.75));
        let y = lerp(1.6, 0.62, ease(span(t, C0 - 1.4, C0))) + up - 0.6 * cut + 0.6 * ease(span(t, C0 + 1.4, C0 + 2.2));
        const over = ease(span(t, KF - 1.4, KF)), x = lerp(KX, FEX, over);
        y += 0.1 * 4 * over * (1 - over);
        const press = ease(span(t, KF, KF + 0.5)), bump = 0.02 * Math.sin(Math.PI * span(t, KF + 0.5, KF + 0.75));
        if (t > KF) y = lerp(0.62, FEH + 0.003, press) + bump;
        const scr = t > KF + 0.7 && t < KF + 2.4 ? 0.06 * Math.sin((t - KF - 0.7) / 1.7 * Math.PI * 4) : 0;
        y += 1.4 * easeIn(span(t, KF + 2.8, KF + 3.6));
        kn.position.set(x, TT + 0.002 + y, 0.35 + scr); kn.visible = t > C0 - 1.4 && t < KF + 3.6;
        burst(sp, t, KF + 0.5, V(FEX, TT + FEH + 0.01, 0.05)); burst(sp2, t, KF + 1.4, V(FEX + 0.02, TT + FEH + 0.01, -0.03));
        na.userData.split(t > C0 + 0.74); na.userData.open(ease(span(t, C0 + 0.75, C0 + 1.2))); na.userData.a.rotation.y = -0.7 * ease(span(t, C0 + 0.9, C0 + 1.8));
        const tar = t >= END - 0.05 ? 1 : 0;                                // by the end, the air has dulled the cut face
        shine.color.copy(fresh).lerp(dullC, tar); shine.metalness = lerp(ST.on ? 0.6 : 0.3, 0.1, tar); shine.roughness = lerp(0.28, 0.95, tar); shine.clearcoat = 1 - tar;
        K.popIn(lNa, t, T.name, T.kn + 0.6); K.popIn(lFe, t, T.fe, T.kn + 0.6);
        K.popIn(lSoft, t, C0 + 0.9, T.steel - 0.2); K.popIn(lSteel, t, T.steel + 0.2, KF - 1.5); K.popIn(lHard, t, KF + 1.6, T.ask - 0.3);
        K.popIn(lS2, t, T.ask + 0.4, TB0 - 0.1); K.popIn(lH2, t, T.ask + 1.0, TB0 - 0.1);
        K.popIn(lS3, t, END + 0.6, 1e9); K.popIn(lH3, t, END + 4.4, 1e9);
      });
    }

    // ================================================================ TABLE (dark) · all metals; soft IA, IIA; hard Cu, Ag, Fe
    {
      stage((t) => t >= TB0 - 0.05 && t < TEND);
      const key = new THREE.DirectionalLight(0xfff2e0, 2.2); key.position.set(TBX - 3, TY(4) + 4, 6); key.target.position.set(TBX, TY(4), 0); root.add(key, key.target);
      const own = { 11: 'Na', 26: 'Fe', 29: 'Cu', 47: 'Ag' }, rest = [];
      const cat = (z, r, c) => (r > 7 ? 'F' : c === 1 && z !== 1 ? 'IA' : c === 2 ? 'IIA' : c >= 3 && c <= 12 ? 'TM' : 'rest');
      for (let z = 1; z <= 118; z++) { const [r, c] = place(z); if (!own[z]) rest.push({ r, c, k: cat(z, r, c) }); }
      const GREY = new THREE.Color(0x4a4f58), MET = new THREE.Color(0x8fa6c4), SOFT = new THREE.Color(0x3f7fe0), HARD = new THREE.Color(0xe0a63a);
      const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(0.44, 0.44, 0.06), M.gloss(0xffffff), rest.length); root.add(inst);
      const m4 = new THREE.Matrix4(); rest.forEach(({ r, c }, i) => { m4.makeTranslation(COL(c), TY(r), 0); inst.setMatrixAt(i, m4); inst.setColorAt(i, GREY); });
      const tiles = Object.entries(own).map(([z, s]) => { const [r, c] = place(+z); const tl = K.tile(s, 0xffffff, 0.44, 0.44, 0.08); tl.position.set(COL(c), TY(r), 0.01); root.add(tl); return { s, tl, k: cat(+z, r, c) }; });
      const ON = { IA: TB0 + 3.6, IIA: TB0 + 4.8, TM: TB0 + 6.0, F: TB0 + 7.2 }, SF = TB0 + 9.6, HD = TB0 + 14.0;
      const col = new THREE.Color();
      const colorOf = (k, s, t) => {                                        // grey → metal (one area at a time) → soft blue / hard gold
        col.copy(GREY);
        if (ON[k]) col.lerp(MET, ease(span(t, ON[k], ON[k] + 0.5)));
        const soft = k === 'IA' || k === 'IIA';
        col.lerp(soft ? SOFT : GREY, ease(span(t, SF, SF + 0.6)));
        if (s && s !== 'Na') col.lerp(HARD, ease(span(t, HD, HD + 0.6)));
        return col;
      };
      const flash = (s, t) => (s === 'Na' ? Math.sin(Math.PI * span(t, TB0 + 1.0, TB0 + 1.8)) : s === 'Fe' ? Math.sin(Math.PI * span(t, TB0 + 2.0, TB0 + 2.8)) : 0);
      const H = 0.5, Y2 = TY(2.2), Y3 = TY(3.1), YT = TY(1) + 0.75;
      const lA = [lbl('group IA', H, '#ffffff', COL(1.6), TY(1) + 0.55), lbl('group IIA', H, '#ffffff', COL(2.6), TY(2) + 0.55), lbl('transition metals', H, '#ffffff', COL(7.5), Y2 + 0.05),
        lbl('lanthanides and actinides', 0.45, '#ffffff', COL(10.5), TY(9) - 0.55)];
      const lAll = lbl('all of them are metals ✓', 0.5, '#ffe08a', COL(9.5), YT);
      const lSoft = lbl('soft metals: IA and IIA', 0.5, '#9ec0ff', COL(9.5), YT), lNa = [lbl('sodium: alkali metal', 0.42, '#ffffff', COL(7.5), Y2 + 0.05), lbl('atomic number 11', 0.42, '#ffffff', COL(7.5), Y3)];
      const lHard = lbl('hard metals: Cu, Ag, Fe', 0.5, '#ffd27a', COL(9.5), YT), lFe = [lbl('iron: transition metal', 0.42, '#ffffff', COL(7.5), Y2 + 0.05), lbl('atomic number 26', 0.42, '#ffffff', COL(7.5), Y3)];
      beats.push((t) => {
        if (!shown(inst)) return;
        rest.forEach(({ k }, i) => inst.setColorAt(i, colorOf(k, null, t))); inst.instanceColor.needsUpdate = true;
        tiles.forEach(({ s, tl, k }) => { const m = tl.userData.body.material; m.color.copy(colorOf(k, s, t)); const f = flash(s, t); tl.position.z = 0.01 + 0.08 * f; m.emissive.set(0xf0b030); m.emissiveIntensity = 0.6 * f; });
        const ends = [ON.IIA - 0.1, ON.TM - 0.1, ON.F - 0.1, ON.F + 1.4];
        lA.forEach((l, i) => K.popIn(l, t, Object.values(ON)[i] + 0.1, ends[i]));
        K.popIn(lAll, t, ON.F + 1.8, SF - 0.1);
        K.popIn(lSoft, t, SF + 0.6, HD - 0.1); lNa.forEach((l, i) => K.popIn(l, t, SF + 2.0 + i * 0.5, HD - 0.1));
        K.popIn(lHard, t, HD + 0.6, 1e9); lFe.forEach((l, i) => K.popIn(l, t, HD + 2.0 + i * 0.5, 1e9));
      });
    }

    // ================================================================ INSIDE (dark) · weak hold vs strong hold
    {
      stage((t) => t >= I0 - 0.05 && t < IEND);
      const RN = 1.0, A = K.atom([2, 8, 1], 11, 12, 0.45, (RN - 0.45) / 2); A.group.position.set(LX, LY, 0); root.add(A.group);
      const gold = M.glow(0xffc04d, 2.6), x1 = A.electrons.find((e) => e.shell === 2);
      x1.e.material = gold; x1.e.children[0].material = x1.e.children[0].material.clone(); x1.e.children[0].material.color.set(0xffc04d);
      const naBall = new THREE.MeshPhysicalMaterial({ color: 0xc9ccd2, metalness: 0.6, roughness: 0.3, clearcoat: 0.6 });
      const feBall = new THREE.MeshPhysicalMaterial({ color: 0x7d838c, metalness: 0.75, roughness: 0.3, clearcoat: 0.6 });
      const naLink = new THREE.MeshBasicMaterial({ color: 0x4f86d8, transparent: true, opacity: 0.45, toneMapped: false });
      const feLink = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x59a8ff, emissiveIntensity: 2.2 });
      const na = add(K.metalLattice(5, 3, 2, NR, NG, naBall, 0.012, naLink), LX, LY, 0), fe = add(K.metalLattice(5, 3, 2, FR, FG, feBall, 0.034, feLink), FX, LY, 0);
      const mid = na.userData.balls.find((b) => b.userData.home.length() < 1e-6);
      const knife = (s) => { const g = add(new THREE.Group()), k = K.knife(); k.rotation.z = -Math.PI / 2; k.scale.setScalar(s); g.add(k); return g; };   // the tip at the group's origin side, blade hanging down
      const kNa = knife(1.6), kFe = knife(1.6), BL = 0.7 * 1.6, BW = 0.14 * 1.6;
      const lAtom = lbl('sodium atom: 2, 8, 1', 0.2, '#ffffff', LX, LY + RN + 0.3), lOne = lbl('only 1 outer electron', 0.18, '#ffd27a', LX, LY - RN - 0.3);
      const lWeak = lbl('weak metallic bonds', 0.18, '#9ec0ff', LX, LY - NG - NR - 0.28), lApart = lbl('atoms slide apart ✓', 0.2, '#ffffff', LX, LY - NG - NR - 0.28);
      const lStrong = lbl('strong metallic bonds', 0.18, '#9ec0ff', FX, LY - FG - FR - 0.28), lStay = lbl('they stay together ✓', 0.2, '#ffffff', FX, LY - FG - FR - 0.28);
      const lNaC = lbl('sodium', 0.2, '#ffffff', LX - 1.3, LY + NG + NR + 0.22), lFeC = lbl('iron', 0.2, '#ffffff', FX - 0.95, LY + FG + FR + 0.22);
      const GAPX = NG / 2, FGAPX = FG / 2;                                   // the knife goes in between the 3rd and 4th columns
      beats.push((t) => {
        if (!shown(na)) return;
        // the lone atom: its outer electron glows gold, then the atom shrinks into its place in the crystal
        const shrink = ease(span(t, IN, IN + 1.6));
        A.group.visible = shrink < 0.98; A.update(t); A.group.scale.setScalar(Math.max(1e-4, lerp(1, NR / RN, shrink)));
        x1.e.scale.setScalar(1 + 0.6 * Math.sin(Math.PI * span(t, I0 + 1.5, I0 + 2.4)));
        na.userData.balls.forEach((b) => {
          const d = b.userData.home.length(), p = back(span(t, IN + 1.2 + d * 0.6, IN + 1.6 + d * 0.6));
          b.scale.setScalar(Math.max(1e-4, b === mid ? (shrink > 0.97 ? 1 : 1e-4) : p)); b.visible = b === mid ? shrink > 0.97 : p > 0.01;
          // the knife's wedge pushes the two sides apart; the top rows open most
          const [i, j] = b.userData.ijk, side = i <= 2 ? -1 : 1, open = cutNa(t);
          b.position.copy(b.userData.home).add(V(side * 0.24 * open * (0.45 + 0.55 * j / 2), 0, 0));
        });
        na.userData.update();
        fe.userData.balls.forEach((b) => { b.position.copy(b.userData.home); });
        fe.userData.update();
        feLink.emissiveIntensity = 2.2 + 3.0 * Math.sin(Math.PI * span(t, IFK + 1.0, IFK + 1.8));
        // the knives: sodium (goes in deep), iron (stops on top, bounces)
        const topNa = LY + NG + NR, tipNa = lerp(topNa + 1.6, topNa, ease(span(t, IK, IK + 1.0))) - (topNa - (LY - NG)) * ease(span(t, IK + 1.0, IK + 2.6)) + 2.4 * easeIn(span(t, IF - 1.0, IF + 0.2));
        kNa.position.set(LX + GAPX - BW / 2, tipNa + BL, 0.05); kNa.visible = t > IK && t < IF + 0.2;
        const topFe = LY + FG + FR + 0.005, bounce = 0.05 * Math.sin(Math.PI * span(t, IFK + 1.0, IFK + 1.4));
        const tipFe = lerp(topFe + 1.6, topFe, ease(span(t, IFK, IFK + 1.0))) + bounce + 2.4 * easeIn(span(t, IEND - 1.6, IEND - 0.4));
        kFe.position.set(FX + FGAPX - BW / 2, tipFe + BL, 0.05); kFe.visible = t > IFK && t < IEND - 0.4;
        K.popIn(lAtom, t, I0 + 0.5, IN - 0.2); K.popIn(lOne, t, I0 + 1.8, IN + 0.4);
        K.popIn(lNaC, t, IN + 2.4, IF); K.popIn(lWeak, t, IN + 2.6, IK + 1.0); K.popIn(lApart, t, IK + 2.4, IF);
        K.popIn(lFeC, t, IF + 1.6, IEND); K.popIn(lStrong, t, IF + 2.2, IFK + 1.3); K.popIn(lStay, t, IFK + 1.8, IEND);
      });
      function cutNa(t) { return ease(span(t, IK + 1.0, IK + 2.6)); }
    }

    // ================================================================ HEAT · sodium melts at 97.6 °C, iron glows but stays solid
    {
      stage((t) => t >= H0 - 0.05 && t < HEND); ST.bake(root, 'heat', (HA + HB) / 2 - 0.25, 2.2, 1.2);
      const flames = [HA, HB].map((x) => { add(K.tripod(0.74, 0.16), x, 0, 0); add(K.dish(0.15), x, DISH, 0); const b = add(K.burner(), x, 0, 0); fires.push(b.userData.flame); return b.userData.flame; });
      add(K.stand(1.1, 0.57), HA - 0.62, 0, -0.02);
      const th = add(K.thermometer(0.45, 120), HA - 0.05, BEAD + 0.02, -0.02);
      const pm = naMat(), pc = add(K.lump(0.06, pm, 8, 0.75, 0.3), HA + 0.05, BEAD + 0.035, 0.01);
      const nail = add(K.nail(0.26, 0.014), HB + 0.13, BEAD + 0.022, 0.0); nail.rotation.z = Math.PI / 2 - 0.08;
      const nm = feMat(); nail.children[0].material = nm;
      const dullC = new THREE.Color(0xc9c6bd), brightC = new THREE.Color(0xeef0f2), feC = new THREE.Color(0x8a9098), hotC = new THREE.Color(0x7a3a20);
      const temp = (t) => lerp(25, 97.6, ease(span(t, FIRE + 0.6, MP))) + 4 * ease(span(t, MP + 0.8, HEND));
      const lPc = tag('sodium', 0.05, '#ffffff', HA + 0.2, BEAD + 0.16, 0.1), lNail = tag('iron nail', 0.05, '#ffffff', HB + 0.12, BEAD + 0.16, 0.1);
      const lRead = tag('97.6 °C', 0.05, '#ff9f96', HA + 0.16, BEAD + th.userData.y(97.6) + 0.02, 0.05), lMp = tag('melts ✓', 0.055, '#ffffff', HA + 0.28, BEAD + 0.2, 0.1);
      const lSolid = tag('red hot, still solid ✓', 0.055, '#ffd27a', HB, BEAD + 0.22, 0.1);
      beats.push((t) => {
        flames.forEach((f, i) => { const on = back(span(t, FIRE + i * 0.4, FIRE + 0.4 + i * 0.4)); f.visible = on > 0.01; f.scale.setScalar(Math.max(1e-4, 0.5 * on)); });
        th.userData.set(temp(t));
        const m = ease(span(t, MP - 0.3, MP + 1.0));                        // the solid piece slumps into a shiny liquid bead
        pc.scale.set(1 + 0.45 * m, 1 - 0.5 * m, 1 + 0.45 * m); pc.position.y = BEAD + 0.035 - 0.02 * m;
        pm.color.copy(dullC).lerp(brightC, m); pm.metalness = lerp(0.35, 0.85, m); pm.roughness = lerp(0.55, 0.12, m); pm.clearcoat = lerp(0.3, 1, m);
        const hot = ease(span(t, FIRE + 1.0, MP + 4.0)); nm.color.copy(feC).lerp(hotC, hot); nm.emissiveIntensity = 0.9 * hot * (1 + 0.05 * Math.sin(t * 9));
        K.popIn(lPc, t, H0 + 0.6, MP - 0.6); K.popIn(lNail, t, H0 + 1.3, MP + 4.6);
        K.popIn(lRead, t, MP - 0.1, MP + 3.6); K.popIn(lMp, t, MP + 0.6, MP + 3.6); K.popIn(lSolid, t, MP + 5.0, HEND);
      });
    }

    // ================================================================ BARS (dark) · melting and boiling points
    {
      stage((t) => t >= B0 - 0.05 && t < BEND);
      const key = new THREE.DirectionalLight(0xfff2e0, 2.0); key.position.set(50 - 2, 4, 5); key.target.position.set(50, 1, 0); root.add(key, key.target);
      add(K.solid(new THREE.BoxGeometry(2.4, 0.04, 0.4), M.matte(0x3a3f48, 0.6)), (BXS[0] + BXS[3]) / 2, BY - 0.02, 0);
      const VALS = [97.6, 1538, 880, 2862], COLS = [0xb9c8de, 0xd0643a, 0xb9c8de, 0xd0643a], NAMES = ['Na', 'Fe', 'Na', 'Fe'];
      const bars = BXS.map((x, i) => add(K.solid(new THREE.BoxGeometry(0.3, 1, 0.22).translate(0, 0.5, 0), M.gloss(COLS[i])), x, BY + 0.003, 0));
      const nums = BXS.map((x, i) => lbl(`${NAMES[i]}: ${VALS[i]} °C`, 0.2, i % 2 ? '#ffb08a' : '#d8e6ff', x, BY + VALS[i] * KV + 0.18, 0.12));
      const titles = [lbl('melting point', 0.2, '#ffe08a', (BXS[0] + BXS[1]) / 2, BY - 0.25, 0.2), lbl('boiling point', 0.2, '#ffe08a', (BXS[2] + BXS[3]) / 2, BY - 0.25, 0.2)];
      const GROW = [[B0 + 0.6, B0 + 1.2], [B0 + 1.6, B0 + 4.0], [BB + 0.4, BB + 1.6], [BB + 1.8, BB + 4.2]];
      beats.push((t) => {
        bars.forEach((b, i) => { const g = ease(span(t, ...GROW[i])); b.scale.y = Math.max(1e-4, VALS[i] * KV * g); b.visible = g > 0.001; });
        nums.forEach((l, i) => K.popIn(l, t, GROW[i][1] - 0.1, 1e9));
        K.popIn(titles[0], t, B0 + 0.3, 1e9); K.popIn(titles[1], t, BB + 0.1, 1e9);
      });
    }

    // ================================================================ WATER · floats / sinks · the balance: 8½ sodium cubes
    {
      stage((t) => t >= W0 - 0.05 && t < WEND); ST.bake(root, 'water', (WA + BX) / 2 - 0.05, 2.9, 1.2);
      [WA, WB].forEach((x) => { add(K.beaker(BR, 0.46), x, 0, 0); add(K.liquid(BR - 0.01, 0.3, 0x5aa0d8, 0.38), x, Y0, 0); });
      add(K.solid(new THREE.BoxGeometry(0.5, 0.02, 0.2), M.gloss(0xf2f0ea)), (WA + WB) / 2, 0.01, 0.4);
      const PN = V(WA + 0.18, 0.02 + 0.03, 0.4), PF = V(WB - 0.14, 0.02 + 0.036, 0.4);
      const pc = add(K.lump(0.045, naMat(), 5, 0.75, 0.3)), cu = add(K.solid(new THREE.BoxGeometry(0.07, 0.07, 0.07), feMat()));
      const tg = add(K.tongs(0.6)), fz = add(K.bubbles(14, V(), SURF + 0.04, 0.08, 0.008)), spN = add(K.splash(0xffffff, 0.2), WA, SURF, 0), spF = add(K.splash(0xffffff, 0.2), WB, SURF, 0);
      const lW = tag('water', 0.045, '#bfe0ff', (WA + WB) / 2, 0.62, 0), lPc = tag('sodium', 0.05, '#ffffff', PN.x - 0.12, 0.08, 0.5), lCu = tag('iron', 0.05, '#ffffff', PF.x + 0.12, 0.08, 0.5);
      const lFl = tag('floats: 0.927 g/cm³', 0.05, '#ffffff', WA - 0.05, 0.66, 0.1), lSk = tag('sinks: 7.874 g/cm³', 0.05, '#ffffff', WB + 0.05, 0.66, 0.1);
      beats.push((t) => {
        // the sodium: tongs carry it over the first beaker and let go: it lands on the water and floats, fizzing
        const pn = t < WF ? move(tg, t, WN, PN, V(WA, SURF + 0.2, 0), 0.025) : null;
        const fN = K.drop(t, WN + 2.4, SURF + 0.2, SURF + 0.006, 0.25, 0.008), u = Math.max(0, t - WN - 2.65);
        pc.position.copy(t < WN + 0.85 ? PN : pn ?? V(WA + 0.05 * Math.sin(1.4 * u) * ease(span(u, 0.3, 1.2)), fN.y + 0.003 * Math.sin(t * 5), 0.04 * Math.sin(1.9 * u + 0.4) * ease(span(u, 0.3, 1.2))));
        pc.rotation.y = u * 1.1; spN.userData.update(t - WN - 2.65); fz.visible = u > 0.2; fz.userData.update(t, 0.5, pc.position.clone().add(V(0, -0.02, 0)));
        // the iron cube: carried over the second beaker, let go: a splash, it sinks and settles on the bottom
        const pf = t >= WF ? move(tg, t, WF, PF, V(WB, SURF + 0.2, 0), 0.04) : null;
        const t1 = WF + 2.4, fall = t < t1 ? 0 : t < t1 + 0.12 ? (t - t1) / 0.12 * 0.2 : 0.2 + (SURF - Y0 - 0.04) * ease(span(t, t1 + 0.12, t1 + 0.9));
        const settle = 0.006 * Math.sin(Math.PI * span(t, t1 + 0.9, t1 + 1.15));
        cu.position.copy(t < WF + 0.85 ? PF : pf ?? V(WB, SURF + 0.2 - fall + settle, 0)); cu.rotation.y = 0.4 * span(t, t1, t1 + 0.9);
        spF.userData.update(t - t1 - 0.12);
        K.popIn(lW, t, W0 + 0.4, WN + 1.4); K.popIn(lPc, t, W0 + 0.6, WN + 0.8); K.popIn(lCu, t, W0 + 1.2, WF + 0.8);
        K.popIn(lFl, t, WN + 3.2, WBAL); K.popIn(lSk, t, t1 + 1.2, WBAL);
      });
      // the balance: an iron cube on the right pan; tongs bring same-size sodium cubes onto the left pan, one by one
      const bal = add(K.balance(0.6, 0.42), BX, 0, 0), [pl, pr] = bal.userData.pans;
      const cube = (mat, h = CUBE) => K.solid(new THREE.BoxGeometry(CUBE, h, CUBE).translate(0, h / 2, 0), mat);
      const fc = cube(feMat()); fc.position.y = 0.012; pr.add(fc);
      const nMat = naMat(), SEAT = (i) => (i < 8 ? V(((i % 2) - 0.5) * (CUBE + 0.004), 0.012 + Math.floor(i / 4) * (CUBE + 0.003), ((Math.floor(i / 2) % 2) - 0.5) * (CUBE + 0.004)) : V(0, 0.012 + 2 * (CUBE + 0.003), 0));
      const SRC = (i) => V(BX - 0.72 + ((i % 3) - 1) * 0.085, 0.02, ((Math.floor(i / 3)) - 1) * 0.085);
      add(K.solid(new THREE.BoxGeometry(0.3, 0.02, 0.3), M.gloss(0xf2f0ea)), BX - 0.72, 0.01, 0);
      const src = Array.from({ length: 9 }, (_, i) => add(cube(nMat, i < 8 ? CUBE : CUBE / 2), ...SRC(i).toArray()));
      const onPan = Array.from({ length: 9 }, (_, i) => { const c = cube(nMat, i < 8 ? CUBE : CUBE / 2); c.position.copy(SEAT(i)); c.visible = false; pl.add(c); return c; });
      const tg2 = add(K.tongs(0.55)), carried = add(cube(nMat));
      const lIron = tag('1 iron cube', 0.05, '#ffffff', BX + 0.12, 0.6, 0.05), lNa = tag('sodium cubes, same size', 0.05, '#ffffff', BX - 0.72, 0.2, 0.2);
      const counts = ['1', '2', '3', '4', '5', '6', '7', '8', '8½'].map((s) => tag(s, 0.07, '#ffe08a', BX - 0.3, 0.52, 0.05));
      const lOk = tag('8½ sodium = 1 iron ✓', 0.06, '#ffe08a', BX, 0.62, 0.05);
      beats.push((t) => {
        let n = 0;
        CUBES.forEach((t0, i) => { n += ease(span(t, t0 + 0.45, t0 + 0.6)) * (i < 8 ? 1 : 0.5); });
        bal.userData.tilt(0.24 * (1 - Math.min(1, n / 8.5))); bal.updateMatrixWorld(true);
        const seatW = (i) => pl.localToWorld(SEAT(i).clone()).add(V(0, i < 8 ? 0.03 : 0.015, 0)), srcW = (i) => SRC(i).add(V(0, 0.03, 0));
        let tp = null, cp = null, which = -1;
        CUBES.forEach((t0, i) => {
          src[i].visible = t < t0 + 0.05; onPan[i].visible = t >= t0 + 0.55;
          const u = span(t, t0, t0 + 0.55), r = span(t, t0 + 0.55, t0 + 0.9);
          if (u > 0 && u < 1) { cp = K.arc(srcW(i), seatW(i), 0.25, ease(u)); tp = cp; which = i; }
          else if (r > 0 && r < 1 && i < 8) tp = K.arc(seatW(i), srcW(i + 1), 0.2, ease(r));
        });
        const into = ease(span(t, WC - 0.6, WC + 0.2)), outT = ease(span(t, CUBES[8] + 0.55, CUBES[8] + 1.4));
        if (!tp && t > WC - 0.6 && t < WC + 0.2) tp = srcW(0).add(V(0, 1.0 * (1 - into), 0));
        if (!tp && t > CUBES[8] + 0.55 && t < CUBES[8] + 1.4) tp = seatW(8).add(V(0, 1.0 * outT, 0));
        tg2.visible = !!tp; carried.visible = !!cp;
        if (tp) { tg2.position.copy(tp).add(V(0, 0.03, 0)); tg2.userData.set(cp ? 0.065 : 0.11); }
        if (cp) { carried.position.copy(cp).add(V(0, -0.03, 0)); carried.scale.y = which < 8 ? 1 : 0.5; }
        K.popIn(lIron, t, WBAL + 1.8, WC + 2.4); K.popIn(lNa, t, WBAL + 2.4, WC + 1.4);
        counts.forEach((l, i) => K.popIn(l, t, CUBES[i] + 0.55, i < 8 ? CUBES[i + 1] + 0.5 : CUBES[8] + 1.6));
        K.popIn(lOk, t, CUBES[8] + 1.8, WEND);
      });
    }

    // ================================================================ PULL · sodium wire snaps, iron wire holds · bridge, building, steel
    {
      stage((t) => t >= P0 - 0.05 && t < PEND); ST.bake(root, 'pull', (PA + BLD) / 2 + 0.05, 3.9, 1.2);
      const JX = [PA + 0.3, PB + 0.3], TOP = JAW - 0.035, BOT = TOP - WIRE;
      [PA, PB].forEach((x) => add(K.stand(JAW, 0.3), x, 0, 0));
      const wNa = naMat(), wFe = feMat(), wGeo = new THREE.CylinderGeometry(0.006, 0.006, 1, 12).translate(0, -0.5, 0);
      const wire = (mat, x) => { const piv = add(new THREE.Group(), x, TOP, 0), w = K.solid(wGeo, mat, { outline: false }); w.scale.y = WIRE; piv.add(w);
        const loop = K.solid(new THREE.TorusGeometry(0.012, 0.003, 8, 20), mat, { outline: false }); loop.position.y = -WIRE - 0.012; piv.add(loop); return { piv, w, loop }; };
      const N = wire(wNa, JX[0]), F = wire(wFe, JX[1]);
      const wts = [add(K.hangWeight()), add(K.hangWeight())], WB0 = -K.hangWeight().userData.bottom;
      const stub = add(K.solid(wGeo, wNa, { outline: false }));                 // the broken lower end, it falls with the weight
      const tg = add(K.tongs(0.55));
      const lN = tag('sodium wire', 0.05, '#ffffff', JX[0] + 0.2, 0.6, 0.05), lF = tag('iron wire', 0.05, '#ffffff', JX[1] + 0.18, 0.6, 0.05);
      const lSnap = tag('snaps: low tensile strength', 0.05, '#ffd27a', JX[0] + 0.05, 0.95, 0.05), lHold = tag('holds: high tensile strength ✓', 0.05, '#ffffff', JX[1] - 0.3, 0.95, 0.05);
      beats.push((t) => {
        // weight 1 onto the sodium wire: it stretches, thins and snaps; the weight and the lower end fall
        const st = ease(span(t, PW1 + 1.6, SNAP)), L = WIRE * (1 + 0.35 * st), r = 1 - 0.5 * st, broke = t > SNAP;
        N.w.scale.set(r, broke ? L * 0.45 : L, r); N.loop.position.y = -L - 0.012; N.loop.visible = !broke;
        const hang1 = V(JX[0], TOP - L - 0.024, 0);
        let p1 = hang1.clone();
        const c1 = carry(tg, t, PW1, hang1.clone().add(V(0, 0.025, 0))); if (t < PW1 + 1.4) p1 = tg.position.clone().add(V(0, -0.025, 0));
        if (broke) { const f = K.drop(t, SNAP, hang1.y, WB0, 0.32, 0.015); p1.y = f.y; }
        wts[0].position.copy(p1); wts[0].visible = t > PW1; wts[0].rotation.z = broke ? -0.25 * ease(span(t, SNAP + 0.3, SNAP + 0.5)) : 0;
        stub.visible = broke; if (broke) { stub.scale.set(r, L * 0.55, r); stub.position.copy(p1).add(V(0, 0.024 + L * 0.55, 0)); stub.rotation.z = wts[0].rotation.z; }
        // weight 2 onto the iron wire: it holds and swings a little
        const hang2 = V(JX[1], BOT - 0.024, 0);
        const c2 = carry(tg, t, PW2, hang2.clone().add(V(0, 0.025, 0))); tg.visible = c1 || c2;
        const held2 = t > PW2 + 1.4, sw = held2 ? 0.08 * Math.sin((t - PW2 - 1.4) * 3.2) * Math.exp(-(t - PW2 - 1.4) * 0.8) : 0;
        F.piv.rotation.z = sw;
        if (held2) { wts[1].position.copy(F.piv.localToWorld(V(0, -WIRE - 0.024, 0))); wts[1].rotation.z = sw; }
        else if (t > PW2) wts[1].position.copy(tg.position).add(V(0, -0.025, 0));
        wts[1].visible = t > PW2;
        K.popIn(lN, t, P0 + 0.4, SNAP - 0.4); K.popIn(lF, t, P0 + 1.0, PW2 + 1.2); K.popIn(lSnap, t, SNAP + 0.4, PW2 + 1.2); K.popIn(lHold, t, PW2 + 2.0, PBR);
      });
      // the bridge (a car drives over) and a building's steel skeleton
      const br = add(K.trussBridge(0.9), BRX, 0, 0), car = add(K.toyCar(0xc8302a, 0.55)); add(K.steelFrame(), BLD, 0, 0);
      const lBr = tag('a bridge', 0.05, '#ffffff', BRX - 0.15, 0.5, 0.05), lBd = tag('a building', 0.05, '#ffffff', BLD, 0.76, 0.05), lSt = tag('steel: made from iron ✓', 0.055, '#ffe08a', BRX + 0.1, 0.5, 0.05);
      beats.push((t) => {
        const u = ease(span(t, PBR + 1.6, PBR + 4.6)); car.position.set(BRX - 0.33 + 0.66 * u, br.userData.road + 0.004, 0); car.rotation.y = Math.PI; car.visible = t > PBR - 1.5;
        K.popIn(lBr, t, PBR + 2.0, PBR + 4.6); K.popIn(lBd, t, PBR + 3.0, PEND); K.popIn(lSt, t, PBR + 5.0, PEND);
      });
    }

    // ================================================================ AIR · sodium dulls, iron stays shiny · kerosene
    {
      stage((t) => t >= A0 - 0.05 && t < AEND); ST.bake(root, 'air', (GA + KJ) / 2, 2.2, 1.2);
      add(K.watchGlass(0.16), GA, 0, 0); add(K.watchGlass(0.16), GB, 0, 0);
      const sm = new THREE.MeshPhysicalMaterial({ color: 0xf4f6f8, metalness: 0.6, roughness: 0.25, clearcoat: 1 }), pc = add(K.lump(0.05, sm, 6, 0.75, 0.3), GA, 0.03, 0);
      if (ST.on) K.photoEnv('bake/studio.hdr').then((tx) => { sm.envMap = tx; sm.envMapIntensity = 1.5; sm.needsUpdate = true; });
      const nail = add(K.nail(0.24, 0.013), GB + 0.12, 0.034, 0); nail.rotation.z = Math.PI / 2 - 0.08;
      const jar = add(K.vial(0.12, 0.42), KJ, 0, 0); add(K.liquid(0.105, 0.3, 0xe0952a, 0.62), KJ, 0.03, 0);
      const tg = add(K.tongs(0.6)), dullC = new THREE.Color(0x6f6b64), fresh = new THREE.Color(0xf4f6f8);
      const stars = [0, 1, 2].map((i) => add(K.sparkle(0xffffff, 0.08)));
      const lNa = tag('freshly cut sodium', 0.05, '#ffffff', GA, 0.2, 0.1), lFe = tag('iron nail', 0.05, '#ffffff', GB, 0.2, 0.1);
      const lDull = tag('dull in seconds', 0.055, '#d8d4cc', GA, 0.2, 0.1), lShiny = tag('still shiny', 0.055, '#ffffff', GB, 0.2, 0.1);
      const lKero = tag('kerosene oil', 0.05, '#ffd48a', KJ - 0.08, 0.56, 0.05), lOk = tag('kept safe from air ✓', 0.055, '#ffffff', KJ - 0.2, 0.56, 0.05);
      beats.push((t) => {
        pc.visible = t > A0 + 0.25; pc.scale.setScalar(Math.max(1e-4, back(span(t, A0 + 0.25, A0 + 0.6))));
        const tar = ease(span(t, TARN, TARN + 2.0));
        sm.color.copy(fresh).lerp(dullC, tar); sm.metalness = lerp(0.6, 0.1, tar); sm.roughness = lerp(0.25, 0.95, tar); sm.clearcoat = 1 - tar;
        stars.forEach((s, i) => { const k = ((t - A0 - i * 0.5) % 1.5 + 1.5) % 1.5, on = (i === 2 ? true : tar < 0.5) && t > A0 + 0.5 && k < 0.7;
          s.visible = on; s.position.copy(i < 2 ? V(GA + (i ? 0.03 : -0.03), 0.07, 0.04) : V(GB + 0.05, 0.05, 0.03)); s.scale.setScalar(Math.max(1e-4, 0.08 * Math.sin(Math.PI * k / 0.7))); });
        const p = move(tg, t, AK, V(GA, 0.05, 0), V(KJ, 0.1, 0), 0.03, 0.6);
        if (p) pc.position.copy(p); else if (t > AK + 2.4) pc.position.set(KJ, 0.06, 0);
        tg.visible = t > AK && t < AK + 3.2;
        K.popIn(lNa, t, A0 + 0.5, TARN + 1.0); K.popIn(lFe, t, A0 + 1.2, TARN + 3.0); K.popIn(lDull, t, TARN + 1.6, AK + 0.4); K.popIn(lShiny, t, TARN + 3.4, AEND);
        K.popIn(lKero, t, AK + 0.8, AK + 3.4); K.popIn(lOk, t, AK + 3.8, AEND);
      });
    }

    // ================================================================ WHY (dark) · low vs high ionization energy
    {
      stage((t) => t >= Y0T - 0.05 && t < YEND);
      const atomAt = (x, shells, p, n, r0, Rr) => { const A = K.atom(shells, p, n, r0, (Rr - r0) / (shells.length - 1)); A.group.position.set(x, AY, 0); root.add(A.group); return A; };
      const NA = atomAt(YNA, [2, 8, 1], 11, 12, 0.45, 1.0), FE = atomAt(YFE, [2, 8, 14, 2], 26, 30, 0.32, 0.92);
      const gold = M.glow(0xffc04d, 2.6), mk = (A, s) => { const x = A.electrons.find((e) => e.shell === s); x.e.material = gold; x.e.children[0].material = x.e.children[0].material.clone(); x.e.children[0].material.color.set(0xffc04d); return x; };
      const xN = mk(NA, 2), xF = mk(FE, 3);
      const key = new THREE.DirectionalLight(0xfff2e0, 2.0); key.position.set(YNA - 1, 5, 6); key.target.position.set(YNA + 2, AY, 0); root.add(key, key.target);
      const bar = (x, h) => { const b = add(K.solid(new THREE.BoxGeometry(0.28, 1, 0.2).translate(0, 0.5, 0), M.gloss(0xf0b040)), x, AY - 1.0, 0); b.userData.h = h; return b; };
      const bN = bar(YNA + 1.45, 0.45), bF = bar(YFE + 1.45, 1.75);
      const pull = (A, x, t0, t1) => (t) => {                              // the gold electron is pulled out to the right, then flies off
        if (t < t0) { x.free = false; x.e.visible = true; return; }
        x.free = true; const ring = A.rings[x.shell], a = x.a0 + t0 * x.w;
        const home = ring.localToWorld(V(Math.cos(a) * x.R, 0, Math.sin(a) * x.R)), far = A.group.localToWorld(V(x.R + 0.45, 0.3, 0.3));
        const k = ease(span(t, t0, t1)), go = easeIn(span(t, t1, t1 + 0.8));
        x.e.position.copy(ring.worldToLocal(home.lerp(far, k).add(V(1.6 * go, 0.9 * go, 0)))); x.e.visible = go < 0.98;
      };
      const pN = pull(NA, xN, YP, YP + 1.4), pF = pull(FE, xF, YFP, YFP + 3.4);
      const lNa = lbl('sodium atom', 0.22, '#ffffff', YNA, AY + 1.35), lLow = lbl('low ionization energy', 0.19, '#ffd27a', YNA + 0.9, AY - 1.22);
      const lEp = lbl('very electropositive', 0.2, '#9ec0ff', YNA, AY + 1.3);
      const lFe = lbl('iron atom', 0.22, '#ffffff', YFE, AY + 1.3), lHigh = lbl('high ionization energy', 0.19, '#ffd27a', YFE + 0.9, AY - 1.22);
      const lLess = lbl('less electropositive', 0.2, '#9ec0ff', YFE, AY + 1.3);
      beats.push((t) => {
        if (!shown(NA.group)) return;
        NA.update(t); FE.update(t); pN(t); pF(t);
        bN.scale.y = Math.max(1e-4, bN.userData.h * ease(span(t, YP, YP + 1.4))); bN.visible = t > YP;
        bF.scale.y = Math.max(1e-4, bF.userData.h * ease(span(t, YFP, YFP + 3.4))); bF.visible = t > YFP;
        K.popIn(lNa, t, Y0T + 0.5, Y0T + 6.8); K.popIn(lLow, t, YP + 1.5, 1e9); K.popIn(lEp, t, Y0T + 7.2, 1e9);
        K.popIn(lFe, t, YF + 1.6, YFP + 3.5); K.popIn(lHigh, t, YFP + 3.5, 1e9); K.popIn(lLess, t, YFP + 3.9, 1e9);
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Why is sodium soft but iron hard?', intro: INTRO, ticks: TICKS,
      rows: [[0, 'sodium · iron'], [1, 'a knife cuts sodium, not iron'], [1, 'soft IA, IIA · hard Cu, Ag, Fe'], [1, 'inside: a weak hold · a strong hold'], [1, 'melts, boils: low · high'],
        [1, 'in water: floats · sinks'], [1, 'pulled: snaps · holds'], [1, 'very reactive · less reactive']],
      short: ['knife', 'table', 'inside', 'melt, boil', 'float, sink', 'pull', 'react'] }));
    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));
    beats.push(() => { const nar = Math.min(1, (cam.aspect / 1.5) ** 0.7); tags.forEach((l) => { if (l.visible) l.scale.multiplyScalar(cam.position.distanceTo(l.position) * 2 * TAN * l.userData.frac * nar / 0.1); }); });

    return (t, dt) => { for (const b of beats) b(t, dt); };
  },
};
