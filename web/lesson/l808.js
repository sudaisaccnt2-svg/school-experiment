// Lesson 808 · Sodium reacts (book pp. 230–231: (b) chemical properties i–vi, kept in kerosene oil), v2 (2026-10-15: brought up to
// the 817 v4 reference: 3 formula boards instead of 9, gas jars = faint tint + drifting wisps, wide halogen shots). v1 in backups/l808_v1.js.
// Built from SKILL §0 + the approved 805 v3 / 806 / 804 pattern: a hook on a baked table, ONE question on a card, each
// reaction a real experiment (question → before → visible cause → result on the thing), then its formula on a slate:
// words fly up from the things, atom balls swap partners (count them), symbols last (kit.reactionBoard).
// THE QUESTION: "Why is sodium kept under oil?" → card: Sodium meets… · The answer · It reacts with even more.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//   HOOK    a jar of kerosene oil with sodium lumps at the bottom; tongs lift one out onto a tile: in seconds it goes dull
//           · why keep it under oil? → card · "let it meet hydrogen, oxygen and water".
//   H₂      a jar of hydrogen; sodium heated in a spoon over a burner, lowered in: a white powder grows on it = sodium
//           hydride ✓ on the spoon (tick 1; its equation → game).
//   O₂      a jar of oxygen; heated sodium burns with a bright yellow flame → white sodium oxide (a basic oxide) → board
//           4Na + O₂ → 2Na₂O · the spoon goes into water, the oxide dissolves, red litmus turns blue = an alkali → board
//           Na₂O + H₂O → 2NaOH · alkali makers: that is why they are called alkali metals (tick 2).
//   WATER   tongs drop sodium on water: it races, fizzing (hydrogen); a thermometer rises (heat given out:
//           exothermic); the hydrogen catches fire → board 2Na + 2H₂O → 2NaOH + H₂ + heat (tick 3).
//   ANSWER  back at the jar: tongs put the dull lump back under the oil; oxygen and water from the air bounce off the
//           oil and never reach it → kept in kerosene oil or liquid paraffin (tick 4).
//   MORE    chlorine jar: bright flame, white salt → 2Na + Cl₂ → 2NaCl · bromine (red-brown liquid) → white NaBr · sulphur
//           ground with sodium in a mortar: sparks → Na₂S (tick 5) · a powerful reducing agent: heated with magnesium
//           oxide, shiny magnesium is set free · titanium chloride drips onto molten sodium, titanium is set free (tick 6).
//           Boards only for O₂, oxide + water, water; Cl₂/Br₂/S/MgO/TiCl₄/H₂ equations → 🎮 game.
//   END     back at the jar under oil: it reacts with almost everything, so it lives under oil.
// Book points (all): very reactive alkali metal, strong reducing agent · i 2Na + H₂ → 2NaH (sodium hydride) · ii basic
// oxide Na₂O, with water the alkali NaOH, the characteristic reaction behind the name "alkali metals": 4Na + O₂ → 2Na₂O,
// Na₂O + H₂O → 2NaOH · iii reacts vigorously with water, hydrogen liberated, exothermic, the hydrogen catches fire:
// 2Na + 2H₂O → 2NaOH + H₂ + heat · kept in kerosene oil or liquid paraffin to avoid air (oxygen and water) · iv sodium
// halides: 2Na + Cl₂ → 2NaCl, 2Na + Br₂ → 2NaBr · v 2Na + S → Na₂S (sodium sulphide) · vi reduces most oxides and halides:
// 2Na + MgO → Na₂O + Mg, 4Na + TiCl₄ → 4NaCl + Ti. Equations to memorize → 🎮 game (COVERAGE_U8).
// §1 CHECK (sheets renders/lesson/d808*.jpg, 808_screens.jpg): nothing missing ✓ · one question + bridges ✓ · real-life
// hook (sodium dulls in air) paid off by the answer ✓ · each experiment: question → before → visible cause (spoon, tongs,
// pestle, dropper) → result on the thing ✓ · formulas: words → balls → symbols ✓ · substances own colours (amber oil,
// yellow-green chlorine, red-brown bromine, yellow sulphur, white products, blue water) ✓ · one place at a time ✓ ·
// camera moves ≥ 2 s ✓ · ≤ 3 labels a shot ✓ · baked tables ✓ · every screen ✓ · flicker 0 ✓.
// v2 CHECK (renders/lesson/s808_0..2.jpg, s808h.jpg, 2026-10-15): one text at a time (text_check 0) · hydride ends on its
// ✓ label (~14 s) · 3 boards (o2 ~30 s, o2b ~50 s, wat ~95 s), each right after its experiment · chlorine/bromine jars read
// as gas (109–126 s), both jars + labels whole in the wide shot · flicker 0.
import * as THREE from 'three';
import * as K from './kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

const TAN = Math.tan(16 * Math.PI / 180), ASP = 1.6, ADIR = [0, 0.45, 1], BDIR = [0, 0.12, 1];
let DOCK = 1e9;
/** a shot: the subject (look, w × h) seen along dir; the engine refits it to the real screen (fit = 6th element) */
function S(t, look, w, h, dir = ADIR, e) {
  h *= 1.14; look = [look[0], look[1] + 0.05 * h, look[2]];        // headroom: the caption floats just above the subject (capNear)
  const dk = t >= DOCK, d = V(...dir).normalize(), dist = Math.max(h / 2 / TAN, (dk ? w / (1 - K.DOCK_W) : w) / 2 / (TAN * ASP)) * 1.1;
  const pos = V(...look).addScaledVector(d, dist).toArray(), fit = { look, w, h, dir, dock: dk ? K.DOCK_W : 0 };
  return dk ? [t, ...K.dockShot(pos, look), undefined, e, fit] : [t, pos, look, undefined, e, fit];
}

// ---------------------------------------------------------------- places (stations 10 apart)
const JV = -0.35, JT = 0.35, OIL = 0.03 + 0.4;                           // the oil jar · the tile · the oil surface
const BY = 2.0, BZ = -0.45;                                              // the formula slate hangs behind each set-up
const HX = 10, OX = 20, WX = 30, LX = 40, SX = 50, RX = 60;
const OBK = OX + 1.8, OSURF = 0.055 + 0.34;                             // the water beaker of the oxygen test
const LEVEL = 0.3, THX = WX + 0.15;                                      // trough water surface · thermometer in it
const MX = RX - 0.7, TX = RX + 0.7, CRU = 0.632, CDIR = [0, 1.2, 1];                        // magnesium oxide set · titanium chloride set · crucible bottom

// ---------------------------------------------------------------- time (every camera move ≥ 2 s)
// nb: no formula board (only 3 boards in the lesson: oxygen, oxide + water, water; the other equations go to the game)
const SP = (t0, nb = false) => ({ t0, nb, h0: t0 + 1.2, h1: t0 + 2.4, lift: t0 + 3.8, over: t0 + 5.0, in: t0 + 5.8, done: t0 + 8.6, b0: nb ? t0 + 11.4 : t0 + 10.8, end: nb ? t0 + 11.4 : t0 + 18.5 });
const T = { out: 2.6, tarn: 6.2, ask: 10.0, card: 13.5 };
DOCK = T.card + 5.0;
const H2 = SP(DOCK + 3.0, true), O2 = SP(H2.end);
Object.assign(T, { w0: O2.end, p0: O2.end + 4.5 });
const B2 = T.p0 + 6.6, NAME = B2 + 7.9;
const WT = NAME + 4.0, WL = WT + 2.75, FIRE = WT + 6.5, WB = WT + 12.8, WEND = WT + 21;
const AN = WEND, MOL0 = AN + 4.6, AEND = AN + 12.5;
const CL = SP(AEND, true), BR = SP(CL.end, true);
const SU = BR.end, SEND = SU + 12;
const RM = SEND, RB1 = RM + 11.5, RT = RM + 12.5, RB2 = RT + 9.4, REND = RT + 13.5;
const END = REND; T.done = END + 13;
const INTRO = [T.card, DOCK];
const TICKS = [[H2.end - 0.6, 0], [NAME + 3.0, 1], [WEND - 0.6, 2], [AEND - 1.0, 3], [SEND - 0.6, 4], [REND - 0.8, 5]];

const captions = [
  [0.3, T.out, 'Sodium is kept under kerosene oil'],
  [T.out, T.tarn, 'Take a piece out, into the air…'],
  [T.tarn, T.ask, '…in seconds it goes dull'],
  [T.ask, T.card, 'Why must chemists keep it under oil?'],
  [T.card, DOCK, 'Why is sodium kept under oil?'],
  [DOCK, H2.t0, 'Let it meet hydrogen, oxygen and water'],
  [H2.t0, H2.in, 'Hot sodium meets hydrogen gas'],
  [H2.in, H2.done, 'A white powder grows on it'],
  [O2.t0, O2.in, 'Hot sodium meets oxygen gas'],
  [O2.in, O2.done, 'It burns with a bright yellow flame'],
  [O2.done, O2.b0, 'A white solid: sodium oxide, a basic oxide'],
  [O2.b0, O2.end, 'Sodium + oxygen → sodium oxide'],
  [T.w0, T.p0, 'Put the oxide in water: it dissolves'],
  [T.p0, B2 - 1.6, 'Red litmus turns blue: an alkali'],
  [B2 - 1.6, NAME, 'Sodium oxide + water → sodium hydroxide'],
  [NAME, WT, 'It makes alkalies: the alkali metals ✓'],
  [WT, WL, 'Now sodium meets water'],
  [WL, FIRE, 'It races, fizzing: hydrogen gas'],
  [FIRE, FIRE + 2.8, 'So hot, the hydrogen catches fire!'],
  [FIRE + 2.8, WB, 'It gives out heat (exothermic) ✓'],
  [WB, WEND, 'Sodium + water → sodium hydroxide + hydrogen'],
  [AN, MOL0, 'So back under the oil it goes'],
  [MOL0, AN + 9.6, 'Oxygen and water can’t reach it there'],
  [AN + 9.6, AEND, 'Kerosene oil or liquid paraffin keeps it safe ✓'],
  [CL.t0, CL.in, 'It reacts with even more: chlorine'],
  [CL.in, CL.done, 'A bright flame and white smoke'],
  [CL.done, CL.end, 'Sodium chloride: table salt'],
  [BR.t0, BR.in, 'Bromine: a red-brown liquid'],
  [BR.in, BR.done, 'Hot sodium reacts with it too'],
  [SU, SU + 3.6, 'Sulphur: a yellow powder'],
  [SU + 3.6, SU + 8.6, 'Grind them together: sparks fly'],
  [SU + 8.6, SEND, 'Sodium sulphide (Na₂S) ✓'],
  [RM, RM + 3.6, 'Sodium can even steal oxygen'],
  [RM + 3.6, RM + 7.4, 'Heat it with magnesium oxide…'],
  [RM + 7.4, RB1, '…shiny magnesium is set free'],
  [RT, RT + 2.6, 'It steals chlorine too'],
  [RT + 2.6, RT + 7.4, 'Titanium chloride drips onto molten sodium'],
  [RT + 7.4, RB2, 'Titanium metal is set free'],
  [RB2, REND, 'Sodium is a strong reducing agent ✓'],
  [END, END + 4.5, 'Oxygen, water, hydrogen, chlorine, sulphur…'],
  [END + 4.5, END + 8.5, 'Sodium reacts with almost everything'],
  [END + 8.5, T.done, 'So it lives under oil'],
];

// ---------------------------------------------------------------- camera (the board shots are re-framed in build() with the board's real size)
const CAMS = [], BCAM = {};
const at = (...k) => CAMS.push(...k);
const bshot = (key, t, k) => { (BCAM[key] ||= []).push([CAMS.length, t, k]); CAMS.push(S(t, [0, BY, BZ], 3, 1.5, BDIR)); };
const JW = (t, k = 1, e) => S(t, [-0.12, 0.3, 0.02], 1.75 * k, 0.9 * k, ADIR, e);
const JA = (t, k = 1, e) => S(t, [JV, 0.5, 0], 0.8 * k, 0.95 * k, ADIR, e);
const JC = (t, x, k = 1, e) => S(t, [x, 0.2, 0.02], 0.75 * k, 0.55 * k, ADIR, e);
const STN = (t, x, k = 1, e) => S(t, [x, 0.55, 0], 1.6 * k, 1.3 * k, ADIR, e);
const CLOSE = (t, x, k = 1, e) => S(t, [x, 0.5, 0], 0.95 * k, 0.95 * k, ADIR, e);
const spoonCams = (P, key, sx, jx, w = 1) => { at(STN(P.t0, sx, 1.04 * w), STN(P.lift - 0.2, sx, w), CLOSE(P.in, jx, 1.04), CLOSE(P.done + 0.6, jx, 0.97)); if (P.nb) at(CLOSE(P.end - 0.05, jx, 0.94)); else { bshot(key, P.b0 + 1.5, 1); bshot(key, P.end - 0.05, 0.96); } };
// HOOK: the jar, closer to the tile while it dulls, wide again for the question
at(JW(0, 1.05), JW(T.out + 1.0, 1.0), JC(T.tarn - 0.6, JT, 1.05), JC(T.ask, JT, 0.98), JW(T.ask + 2.2, 1.02), JW(T.card, 1.0), JW(H2.t0 - 0.05, 0.96));
spoonCams(H2, 'h2', HX - 0.12, HX + 0.25);
spoonCams(O2, 'o2', OX - 0.12, OX + 0.25);
at(S(T.w0, [OX + 1.0, 0.55, 0], 2.35, 1.3), S(T.w0 + 2.4, [OBK, 0.5, 0], 1.0, 1.0), S(T.p0 + 1.2, [OBK - 0.05, 0.48, 0], 0.9, 0.95), S(B2 - 2.0, [OBK - 0.05, 0.48, 0], 0.86, 0.9));
bshot('o2b', B2 + 1.5, 1); bshot('o2b', NAME - 0.05, 0.97);
at(S(NAME, [OBK - 0.05, 0.48, 0], 1.0, 1.0), S(WT - 0.05, [OBK - 0.05, 0.48, 0], 0.95, 0.95));
// WATER: the trough, push in on the racing sodium, then the board
at(S(WT, [WX, 0.32, -0.05], 1.6, 0.9), S(WL - 0.2, [WX, 0.32, -0.05], 1.55, 0.86), S(FIRE - 0.5, [WX - 0.15, 0.3, 0], 1.0, 0.62), S(WB - 2.4, [WX - 0.05, 0.3, 0], 1.1, 0.64));
bshot('wat', WB + 1.5, 1); bshot('wat', WEND - 0.05, 0.96);
// ANSWER: back at the jar, close on the oil
at(JW(AN, 1.04), JW(AN + 2.4, 1.0), JA(MOL0, 1.04), JA(AEND - 0.05, 0.98));
// MORE: chlorine, bromine (one burner between the jars), sulphur, the two crucibles
spoonCams(CL, 'cl', LX, LX - 0.8, 1.65);
spoonCams(BR, 'br', LX, LX + 0.8, 1.65);                        // wide enough that both jars + labels are whole
at(S(SU, [SX, 0.2, 0], 1.1, 0.75), S(SU + 3.6, [SX, 0.15, 0], 0.85, 0.58), S(SU + 8.8, [SX, 0.15, 0], 0.8, 0.55));
at(S(SEND - 0.05, [SX, 0.15, 0], 0.76, 0.52));
at(S(RM, [MX, 0.55, 0], 1.0, 1.25), S(RM + 4.0, [MX, CRU + 0.07, 0], 0.6, 0.5, CDIR), S(RB1 - 2.4, [MX, CRU + 0.07, 0], 0.56, 0.47, CDIR));
at(S(RT - 0.05, [MX, CRU + 0.07, 0], 0.54, 0.45, CDIR));
at(S(RT + 0.0, [TX, 0.62, 0], 1.0, 1.2), S(RT + 2.4, [TX, CRU + 0.12, 0], 0.62, 0.62, CDIR), S(RB2 - 2.2, [TX, CRU + 0.1, 0], 0.58, 0.56, CDIR));

at(S(RB2, [RX, 0.78, 0], 1.95, 1.0), S(REND - 0.05, [RX, 0.78, 0], 1.88, 0.96));
// END: the jar
at(JW(END, 1.06), JA(END + 4.5, 1.04), JA(T.done, 0.98));
CAMS.sort((a, b) => a[0] - b[0]);
// (sorting moves the board placeholders: remember them by time, not index)
for (const k in BCAM) BCAM[k] = BCAM[k].map(([, t, f]) => [CAMS.findIndex((c) => c[0] === t), t, f]);

// ---------------------------------------------------------------- the formulas
const M1 = (mol, n, react = false) => ({ mol, n, react });
const EQ = {
  h2: { terms: [M1('M', 2, true), M1('H2', 1, true), M1('MH', 2)], ops: ['+', '→'], words: ['sodium', 'hydrogen', 'sodium\nhydride'], syms: ['2Na', 'H₂', '2NaH'] },
  o2: { terms: [M1('M', 4, true), M1('O2', 1, true), M1('M2O', 2)], ops: ['+', '→'], words: ['sodium', 'oxygen', 'sodium\noxide'], syms: ['4Na', 'O₂', '2Na₂O'] },
  o2b: { terms: [M1('M2O', 1, true), M1('H2O', 1, true), M1('MOH', 2)], ops: ['+', '→'], words: ['sodium\noxide', 'water', 'sodium\nhydroxide'], syms: ['Na₂O', 'H₂O', '2NaOH'] },
  wat: { terms: [M1('M', 2, true), M1('H2O', 2, true), M1('MOH', 2), M1('H2', 1)], ops: ['+', '→', '+'], words: ['sodium', 'water', 'sodium\nhydroxide', 'hydrogen'], syms: ['2Na', '2H₂O', '2NaOH', 'H₂'] },
  cl: { terms: [M1('M', 2, true), M1('Cl2', 1, true), M1('MCl', 2)], ops: ['+', '→'], words: ['sodium', 'chlorine', 'sodium\nchloride'], syms: ['2Na', 'Cl₂', '2NaCl'] },
  br: { terms: [M1('M', 2, true), M1('Br2', 1, true), M1('MBr', 2)], ops: ['+', '→'], words: ['sodium', 'bromine', 'sodium\nbromide'], syms: ['2Na', 'Br₂', '2NaBr'] },
  s: { terms: [M1('M', 2, true), M1('S', 1, true), M1('M2S', 1)], ops: ['+', '→'], words: ['sodium', 'sulphur', 'sodium\nsulphide'], syms: ['2Na', 'S', 'Na₂S'] },
  mg: { terms: [M1('M', 2, true), M1('MgO', 1, true), M1('M2O', 1), M1('Mg', 1)], ops: ['+', '→', '+'], words: ['sodium', 'magnesium\noxide', 'sodium\noxide', 'magnesium'], syms: ['2Na', 'MgO', 'Na₂O', 'Mg'] },
  ti: { terms: [M1('M', 4, true), M1('TiCl4', 1, true), M1('MCl', 4), M1('Ti', 1)], ops: ['+', '→', '+'], words: ['sodium', 'titanium\nchloride', 'sodium\nchloride', 'titanium'], syms: ['4Na', 'TiCl₄', '4NaCl', 'Ti'] },
};

export default {
  capNear: true, oneText: true,
  duration: T.done,
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const beats = [], fires = [];
    const ST = K.studio({ scene, R }, '808');                            // FIRST: models read the look (no dark scenes in this lesson)
    beats.push((t) => ST.update(t));
    let root = scene;
    const add = (o, x = 0, y = 0, z = 0) => { o.position.set(x, y, z); root.add(o); return o; };
    const stage = (show) => { root = new THREE.Group(); scene.add(root); const g = root; beats.push((t) => { g.visible = show(t); }); return g; };
    const lbl = (text, h, color, x, y, z = 0, w = 700) => add(K.label(text, h, color, w), x, y, z);
    const tags = [], tag = (text, h, color, x, y, z = 0, w = 700) => { const l = lbl(text, 0.1, color, x, y, z, w); l.userData.frac = h * 1.8; tags.push(l); return l; };
    const shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
    const fire = (tint, size, opts) => { const f = K.makeFire(tint, size, opts); fires.push(f); return f; };
    const silver = new THREE.Color(0xe6eaf0), dullC = new THREE.Color(0x8f8b82), whiteC = new THREE.Color(0xf4f3ee);
    const naMat = () => new THREE.MeshPhysicalMaterial({ color: 0xe6eaf0, metalness: 0.6, roughness: 0.25, clearcoat: 0.6, emissive: 0xff6a1a, emissiveIntensity: 0 });
    /** tongs bring something down from above to `to` (arrive m0+1.2) and let go at m0+1.4, rise away by m0+2.4 */
    const carry = (tg, t, m0, to) => {
      tg.visible = t > m0 && t < m0 + 2.4; if (!tg.visible) return;
      const top = to.clone().add(V(0, 1.1, 0));
      tg.position.copy(t < m0 + 1.2 ? top.lerp(to, 1 - (1 - span(t, m0, m0 + 1.2)) ** 2) : t < m0 + 1.5 ? to.clone() : to.clone().lerp(top, easeIn(span(t, m0 + 1.5, m0 + 2.4))));
      tg.userData.set(lerp(0.03, 0.08, span(t, m0 + 1.35, m0 + 1.5)));
    };
    /** the formula on a dark slate that rolls down behind the set-up (words → balls → symbols) */
    const board = (key, sx, b0, t1, from, extra = 0) => {
      const q = EQ[key], bd = K.reactionBoard(scene, { x: sx, y: BY, z: BZ, h: 0.26, k: 2.0, terms: q.terms, ops: q.ops, metals: ['Na'], words: [q.words], syms: [q.syms], from, t0: b0 - 0.05, starts: [b0], t1 });
      beats.push(bd);
      const bw = bd.width + 0.15, bh = bd.top - bd.bottom + 0.25, cy = (bd.top + bd.bottom) / 2;
      const sw = bw + 0.45 + extra, shh = bh + 0.35, scx = sx + extra / 2;
      BCAM[key].forEach(([i, t, k]) => { CAMS[i] = S(t, [scx, cy, BZ], (sw + 0.2) * k, (shh + 0.2) * k, BDIR); });
      const top = cy + shh / 2, slate = add(new THREE.Group(), scx, top, BZ - 0.14);
      const cloth = new THREE.Mesh(new THREE.PlaneGeometry(sw, shh).translate(0, -shh / 2, 0), M.matte(0x1c2626, 0.92)); slate.add(cloth);
      const roller = K.solid(new THREE.CylinderGeometry(0.045, 0.045, sw + 0.12, 24).rotateZ(Math.PI / 2), M.metal(0x9aa0a8, 0.4)); roller.position.set(0, 0.03, -0.02); slate.add(roller);
      const bar = K.solid(new THREE.BoxGeometry(sw + 0.04, 0.04, 0.04), M.matte(0x3a3f48, 0.6)); slate.add(bar);
      for (const k of [-1, 1]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 12, 6), M.matte(0x2a2e34, 0.8)); c.position.set(k * (sw / 2 - 0.1), 6.05, -0.02); slate.add(c); }   // hangs from the ceiling
      beats.push((t) => { slate.visible = t > b0 - 1.7 && t < t1; const k = ease(span(t, b0 - 1.6, b0 - 0.1)); cloth.visible = k > 0.002; cloth.scale.y = Math.max(1e-3, k); bar.position.y = -shh * k; });
      return bd;
    };
    /** a spoon test: sodium heated in a spoon over a burner, lowered into a gas jar; it reacts; then its formula */
    const spoonTest = (P, key, { burnX, jarX, gas, gasOp, fade = 0, gasName, gasCol, flame, flSize = 0.3, crust, prod, prodCol = '#ffffff', burner = true, liquid, bx }) => {
      if (burner) { const brn = add(K.burner(), burnX, 0, 0); brn.userData.flame.scale.setScalar(0.45); fires.push(brn.userData.flame); }
      const jar = add(K.gasJar(gas, 0.17, 0.7), jarX, 0, 0), gm = jar.userData.gas; gm.opacity = 0.08 + 0.15 * gasOp;   // faint tint + wisps = gas, not juice (817 v3)
      const wisp = K.gasCloud(gas, 14); jar.add(wisp);
      if (liquid) add(K.solid(new THREE.CylinderGeometry(0.135, 0.135, 0.03, 32), new THREE.MeshPhysicalMaterial({ color: liquid, roughness: 0.15, clearcoat: 1, transmission: 0.2 }), { outline: false }), jarX, 0.068, 0);
      const lid = jar.userData.lid, lid0 = lid.position.clone();
      const sp = add(K.spoon(0.6)), mat = naMat(), na = K.lump(0.045, mat, 7, 0.7); na.position.y = -0.03; sp.add(na);
      const f = flame ? add(fire(flame, flSize, { core: 0xfff3c4 })) : null, sm = add(K.smoke(6, 0xffffff)); sm.scale.setScalar(0.08);
      const A = V(burnX + 0.02, 1.7, 0), HH = V(burnX, 0.8, 0), UP = V(jarX, 1.05, 0), IN = V(jarX, 0.38, 0);
      const lGas = tag(gasName, 0.05, gasCol, jarX, 0.86, 0.05), lNa = tag('sodium, heated', 0.05, '#ffffff', 0, 0, 0), lProd = tag(prod, 0.05, prodCol, jarX, 0.86, 0.05);
      const crustC = new THREE.Color(crust);
      beats.push((t) => {
        let p;
        if (t < P.h1) p = A.clone().lerp(HH, ease(span(t, P.h0, P.h1)));
        else if (t < P.lift) p = HH.clone();
        else if (t < P.over) p = K.arc(HH, UP, 0.15, ease(span(t, P.lift, P.over)));
        else p = UP.clone().lerp(IN, ease(span(t, P.over, P.in)));
        sp.position.copy(p); sp.visible = t > P.h0;
        const lu = ease(span(t, P.lift - 0.4, P.lift)); lid.position.set(lid0.x, lid0.y - (lid0.y - 0.006) * easeIn(span(t, P.lift - 0.1, P.lift + 0.2)), lid0.z - 0.42 * lu);
        const heat = ease(span(t, P.h1 - 0.3, P.lift)), on = back(span(t, P.in, P.in + 0.35)) * (1 - ease(span(t, P.done - 0.6, P.done + 0.3))), cr = ease(span(t, P.in + 0.4, P.done));
        mat.color.copy(silver).lerp(crustC, cr); mat.metalness = 0.6 * (1 - cr); mat.roughness = lerp(0.25, 0.92, cr); mat.clearcoat = 0.6 * (1 - cr);
        mat.emissiveIntensity = (0.55 * heat + 0.6 * on) * (1 - cr);
        na.scale.set(1 + 0.15 * heat + 0.55 * cr, 1 - 0.15 * heat + 0.35 * cr, 1 + 0.15 * heat + 0.55 * cr);
        if (f) { f.visible = on > 0.01; f.position.copy(p).add(V(0, -0.01, 0)); f.scale.setScalar(Math.max(1e-4, on * (1 + 0.15 * Math.sin(t * 17) + 0.08 * Math.sin(t * 29)))); }
        sm.visible = flame && t > P.in && t < P.done + 1; sm.position.copy(p).add(V(0, 0.02, 0)); sm.userData.update(t, on);
        const gk = 1 - fade * ease(span(t, P.in, P.done)); gm.opacity = (0.08 + 0.15 * gasOp) * gk; wisp.userData.update(t, liquid ? 0.12 : 0.07, 0.62, 0.15, gk * (jar.visible ? 1 : 0));
        lNa.position.copy(p).add(V(-0.25, 0.12, 0.1)); K.popIn(lNa, t, P.h1 - 0.2, P.lift);
        K.popIn(lGas, t, P.t0 + 0.6, P.in); K.popIn(lProd, t, P.done - 0.2, P.b0 - 0.3);
      });
      if (!P.nb) board(key, bx ?? (burnX + jarX) / 2, P.b0, P.end, [IN.clone().add(V(0, 0.1, 0)), V(jarX, 0.6, 0), V(jarX, 0.5, 0)]);
      return { sp, na, mat };
    };

    // ================================================================ HOOK / ANSWER / END · the oil jar and a tile
    {
      stage((t) => t < H2.t0 || (t >= AN - 0.05 && t < AEND) || t >= END - 0.05); ST.bake(root, 'jar', -0.12, 2.3, 1.2);
      const vl = add(new THREE.Group(), JV, 0, 0); vl.add(K.vial(0.16, 0.62)); const cap = vl.children[0].children[1];
      const oil = K.liquid(0.14, 0.4, 0xd99a2a, 0.55); oil.position.y = 0.03; vl.add(oil);
      const kept = K.lump(0.06, new THREE.MeshPhysicalMaterial({ color: 0xc9c6bd, metalness: 0.35, roughness: 0.5 }), 3, 0.7); kept.position.set(0.04, 0.075, -0.03); vl.add(kept);
      add(K.solid(new THREE.BoxGeometry(0.5, 0.025, 0.36), M.gloss(0xf2f0ea)), JT, 0.0125, 0.02);
      const mat = naMat(), pc = add(K.lump(0.06, mat, 9, 0.7), 0, 0, 0), tg = add(K.tongs(0.6)), sh = add(K.contactShadow(0.08), JT, 0.03, 0.02);
      const P0 = V(JV - 0.03, 0.08, 0.03), TILE = V(JT, 0.025 + 0.045, 0.02), cap0 = cap.position.clone();
      const lOil = tag('kerosene oil', 0.05, '#ffd58a', JV, 0.3, 0.2), lNa = tag('sodium', 0.05, '#ffffff', JV + 0.32, 0.12, 0.2);
      const lAir = tag('in the air', 0.05, '#ffffff', JT, 0.36, 0.05), lDull = tag('dull in seconds', 0.05, '#d8d4cc', JT, 0.36, 0.05);
      const lSink = tag('sinks under the oil', 0.05, '#ffffff', JV, 0.8, 0.05), lSafe = tag('air and water can’t reach it ✓', 0.05, '#ffffff', JV, 0.8, 0.05);
      const lPar = tag('kerosene oil or liquid paraffin', 0.05, '#ffd58a', JV, 0.8, 0.05);
      // the hook: the cap comes off, tongs lift a lump out of the oil onto the tile; later they put it back
      const pick = (t) => {                                              // [tongs at, piece at, gripped]
        if (t < T.out + 2.4) {
          if (t < T.out) return [P0.clone().setY(1.3), P0, false];
          const u = span(t, T.out, T.out + 2.4);
          const p = u < 0.35 ? P0.clone().setY(lerp(1.3, P0.y, ease(u / 0.35))) : u < 0.45 ? P0.clone() : K.arc(P0, TILE, 0.55, ease((u - 0.45) / 0.55));
          return [p, u < 0.4 ? P0 : p, u >= 0.4 && u < 0.98];
        }
        if (t < AN + 0.8) return [TILE.clone().setY(1.2), TILE, false];
        const u = span(t, AN + 0.8, AN + 3.4);
        const D = V(JV + 0.02, 0.62, 0.0);
        const p = u < 0.3 ? TILE.clone().setY(lerp(1.0, TILE.y, ease(u / 0.3))) : u < 0.4 ? TILE.clone() : K.arc(TILE, D, 0.35, ease((u - 0.4) / 0.6));
        return [p, u < 0.35 ? TILE : p, u >= 0.35];
      };
      beats.push((t) => {
        const capOff = ease(span(t, 1.0, 2.2)) * (1 - ease(span(t, AN + 11.0, AN + 12.2)));
        cap.position.set(cap0.x - 0.4 * capOff, cap0.y + 0.15 * Math.sin(Math.PI * capOff) - (cap0.y - 0.045) * span(capOff, 0.6, 1), cap0.z + 0.05 * capOff);
        const [tp, pp, grip] = pick(t);
        tg.visible = (t > T.out && t < T.out + 3.3) || (t > AN + 0.8 && t < AN + 4.6);
        tg.position.copy(tg.visible && !grip && t > T.out + 2.3 && t < AN ? tp.clone().setY(tp.y + 1.2 * easeIn(span(t, T.out + 2.4, T.out + 3.3))) : tp);
        if (t > AN + 3.4) tg.position.copy(V(JV + 0.02, 0.62 + 1.0 * easeIn(span(t, AN + 3.5, AN + 4.6)), 0));
        tg.userData.set(grip ? 0.045 : 0.075);
        // the piece: in the oil → on the tile (dulls) → back into the oil (sinks to the bottom)
        if (t >= AN + 3.4) { const k = ease(span(t, AN + 3.4, AN + 4.6)); pc.position.set(JV + 0.02 - 0.06 * k, lerp(0.62, 0.11, k) , 0.0); }
        else pc.position.copy(pp);
        pc.visible = t > T.out - 0.1 && !(t > END - 0.1);
        const dull = ease(span(t, T.tarn, T.tarn + 1.8)); mat.color.copy(silver).lerp(dullC, dull); mat.metalness = 0.6 * (1 - dull); mat.roughness = lerp(0.25, 0.85, dull);
        sh.visible = t > T.out + 2.3 && t < AN + 2.4;
        K.popIn(lOil, t, 0.6, T.out); K.popIn(lNa, t, 1.2, T.out + 0.4);
        K.popIn(lAir, t, T.out + 2.6, T.tarn); K.popIn(lDull, t, T.tarn + 1.2, T.card);
        K.popIn(lSink, t, AN + 4.0, MOL0 + 0.4);
        if (t < END) { K.popIn(lSafe, t, MOL0 + 4.0, AEND); K.popIn(lPar, t, 1e9); } else { K.popIn(lPar, t, END + 0.6, END + 8.4); K.popIn(lSafe, t, END + 8.8, 1e9); }
      });
      // oxygen and water from the air fall toward the jar, bounce off the oil and float away
      const red = M.gloss(0xe0483c), wht = M.gloss(0xf4f4f4), ball = new THREE.SphereGeometry(0.022, 16, 12);
      const mols = Array.from({ length: 6 }, (_, i) => {
        const g = add(new THREE.Group()), water = i % 2;
        if (water) { const o = new THREE.Mesh(ball, red); g.add(o); [-1, 1].forEach((s) => { const h = new THREE.Mesh(ball, wht); h.scale.setScalar(0.65); h.position.set(s * 0.022, -0.016, 0); g.add(h); }); }
        else [-1, 1].forEach((s) => { const o = new THREE.Mesh(ball, red); o.position.x = s * 0.02; g.add(o); });
        return { g, x: JV + (i / 5 - 0.5) * 0.18, z: (i % 3 - 1) * 0.05, t0: MOL0 + i * 0.55 };
      });
      const lO = tag('oxygen and water', 0.045, '#ffd0c8', JV + 0.36, 0.62, 0.05);
      beats.push((t) => {
        mols.forEach((m) => {
          const u = t - m.t0; m.g.visible = u > 0 && u < 3.6 && t < AEND;
          if (!m.g.visible) return;
          const down = OIL + 0.03, y = u < 1.3 ? lerp(0.95, down, easeIn(u / 1.3)) : down + 0.5 * (u - 1.3) - 0.12 * (u - 1.3) ** 2;   // falls, bounces off the oil surface
          m.g.position.set(m.x + 0.08 * Math.max(0, u - 1.3), y, m.z); m.g.rotation.set(u * 1.3, u * 0.9, 0); m.g.scale.setScalar(1 - 0.8 * span(u, 2.6, 3.6));
        });
        K.popIn(lO, t, MOL0 + 0.6, MOL0 + 3.8);
      });
    }

    // ================================================================ i · HYDROGEN
    stage((t) => t >= H2.t0 - 0.05 && t < H2.end); ST.bake(root, 'h2', HX - 0.12, 2.0, 1.2);
    spoonTest(H2, 'h2', { burnX: HX - 0.5, jarX: HX + 0.25, gas: 0xeaf4ff, gasOp: 0.06, gasName: 'hydrogen gas (H₂)', gasCol: '#cfe8ff', crust: 0xf2f1ec, prod: 'white sodium hydride (NaH) ✓' });

    // ================================================================ ii · OXYGEN → oxide → in water → litmus blue
    {
      stage((t) => t >= O2.t0 - 0.05 && t < WT); ST.bake(root, 'o2', OX + 0.6, 3.4, 1.2);
      const o = spoonTest(O2, 'o2', { burnX: OX - 0.5, jarX: OX + 0.25, gas: 0xeaf4ff, gasOp: 0.06, gasName: 'oxygen gas (O₂)', gasCol: '#cfe8ff', flame: 0xffc21a, flSize: 0.34, crust: 0xf4f3ee, prod: 'sodium oxide: a basic oxide' });
      add(K.beaker(0.24, 0.5), OBK, 0, 0); add(K.liquid(0.23, 0.34, 0x5aa0d8, 0.38), OBK, 0.055, 0);
      const paper = add(K.paperStrip([[0, 0], [0.2, 0], [0.42, 0]], 0.06, 0xd9606c, 0x4a6fd0, 0.006)), ptg = add(K.tongs(0.6));
      const IN = V(OX + 0.25, 0.38, 0), UP = V(OX + 0.25, 1.0, 0), OVER = V(OBK - 0.08, 1.0, 0), WET = V(OBK - 0.08, 0.27, 0), PAT = V(OBK + 0.1, 0.12, 0);
      const lWater = tag('water', 0.05, '#bfe0ff', OBK + 0.2, 0.32, 0.3), lDis = tag('it dissolves', 0.05, '#ffffff', OBK - 0.05, 0.72, 0.1);
      const lRed = tag('red litmus paper', 0.05, '#ff9aa4', OBK + 0.05, 0.86, 0), lBlue = tag('turns blue: an alkali ✓', 0.05, '#9ec0ff', OBK + 0.05, 0.86, 0);
      const lName = tag('alkali makers: the alkali metals', 0.055, '#ffe08a', OBK, 0.75, 0.05);
      beats.push((t) => {
        const W0 = T.w0;
        if (t >= W0) {
          let p;
          if (t < W0 + 0.8) p = IN.clone().lerp(UP, ease(span(t, W0, W0 + 0.8)));
          else if (t < W0 + 1.8) p = K.arc(UP, OVER, 0.12, ease(span(t, W0 + 0.8, W0 + 1.8)));
          else if (t < W0 + 4.2) p = OVER.clone().lerp(WET, ease(span(t, W0 + 1.8, W0 + 2.6)));
          else p = WET.clone().lerp(V(WET.x, 1.6, 0), easeIn(span(t, W0 + 4.2, W0 + 5.2)));
          o.sp.position.copy(p); o.sp.visible = t < W0 + 5.2;
          const dis = ease(span(t, W0 + 2.6, W0 + 4.2));
          o.na.position.set(0.04 * dis, -0.03 - 0.12 * dis, 0); o.na.scale.multiplyScalar(Math.max(1e-4, 1 - dis)); o.na.visible = dis < 0.99;
        } else o.na.position.set(0, -0.03, 0);
        const P0 = T.p0, top = PAT.clone().add(V(0, 0.42, 0)), pTop = V(top.x, top.y + 1.0, 0);
        const pp = t < P0 + 1.4 ? pTop.clone().lerp(top, 1 - (1 - span(t, P0, P0 + 1.4)) ** 2) : top;
        paper.position.copy(pp).add(V(0, -0.42, 0)); paper.visible = t > P0; ptg.position.copy(pp).add(V(0, -0.02, 0)); ptg.visible = t > P0; ptg.userData.set(0.012);
        paper.userData.wet(0.36 * ease(span(t, P0 + 1.9, P0 + 4.2)));
        K.popIn(lWater, t, W0 + 1.6, W0 + 4.4); K.popIn(lDis, t, W0 + 3.0, P0 + 0.2);
        K.popIn(lRed, t, P0 + 0.5, P0 + 3.6); K.popIn(lBlue, t, P0 + 3.9, B2 - 1.8); K.popIn(lName, t, NAME + 0.4, WT);
      });
      board('o2b', OBK, B2, NAME, [WET.clone(), V(OBK + 0.15, 0.3, 0), V(OBK, 0.25, 0)]);
    }

    // ================================================================ iii · WATER: it races, fizzes, the hydrogen catches fire
    {
      stage((t) => t >= WT - 0.05 && t < WEND); ST.bake(root, 'wat', WX, 2.2, 1.7);
      add(K.tank(1.3, 0.6, 0.42, LEVEL), WX, 0, 0);
      const sd = add(K.stand(0.52, 0.52), THX, 0, -0.65); sd.rotation.y = -Math.PI / 2;
      const th = add(K.thermometer(0.45, 50), THX, 0.115, -0.13);
      const mat = naMat(), na = add(K.lump(0.05, mat, 2, 0.72)), tg = add(K.tongs(0.6)), HN = V(WX - 0.3, 0.8, 0);
      const fz = add(K.bubbles(24, V(), LEVEL + 0.05, 0.1, 0.012)), sp = add(K.splash(0xffffff, 0.26), WX - 0.3, LEVEL, 0);
      const fl = add(fire(0xffa21a, 0.26, { core: 0xfff0c0 }));
      const hiss = Array.from({ length: 3 }, () => { const r = add(new THREE.Mesh(new THREE.TorusGeometry(1, 0.03, 6, 40), M.bubble())); r.rotation.x = Math.PI / 2; return r; });
      const path = (t) => { const u = Math.max(0, t - WL), r = ease(span(u, 0.3, 1.0)); return V(WX - 0.3 + 0.28 * Math.sin(1.3 * u) * r, LEVEL + 0.008 + 0.003 * Math.sin(t * 6), 0.15 * Math.sin(2.1 * u + 0.5) * r); };
      const lNa = tag('sodium', 0.05, '#ffffff', WX - 0.55, 0.62, 0), lW = tag('water', 0.05, '#bfe0ff', WX + 0.25, 0.16, 0.36);
      const lH = tag('hydrogen bubbles', 0.05, '#ffffff', WX - 0.3, 0.55, 0.1), lF = tag('hydrogen catches fire!', 0.055, '#ffd27a', WX - 0.3, 0.6, 0.1);
      const lT = tag('warmer: heat given out', 0.05, '#ff9f96', THX - 0.08, 0.56, -0.1);
      beats.push((t) => {
        const tp = HN.clone().setY(HN.y + 1.6 * (1 - ease(span(t, WT + 0.6, WT + 1.8))) + 1.6 * easeIn(span(t, WT + 2.7, WT + 3.8)));
        tg.position.copy(tp); tg.visible = t > WT + 0.6 && t < WT + 3.8; tg.userData.set(0.035 + 0.04 * ease(span(t, WT + 2.25, WT + 2.45)));
        const fall = K.drop(t, WT + 2.4, HN.y - 0.04, LEVEL + 0.01, 0.3, 0.02);
        const pos = t > WL ? path(t) : t < WT + 2.4 ? tp.clone().add(V(0, -0.04, 0)) : V(HN.x, fall.y, 0);
        na.position.copy(pos); na.visible = t > WT + 0.6;
        const ball = ease(span(t, WL + 0.2, WL + 0.9)), shrink = 1 - 0.35 * span(t, WL, WEND);
        na.scale.set(shrink * (1 - 0.15 * ball), shrink * (1 + 0.4 * ball), shrink * (1 - 0.15 * ball)); na.rotation.y = t * 2;
        mat.emissiveIntensity = 0.5 * ease(span(t, FIRE - 0.6, FIRE));
        sp.userData.update(t - WL);
        fz.visible = t > WL + 0.2; fz.userData.update(t, 1, pos.clone().add(V(0, -0.03, 0)));
        hiss.forEach((r, k) => { const per = 0.5, age = ((t + k * per / 3) % per), born = t - age; r.visible = born > WL; if (!r.visible) return; r.position.copy(path(born)).setY(LEVEL + 0.003 + k * 0.004); const s = 0.03 + age * 0.12; r.scale.set(s, s, s * 0.3); r.material.opacity = 0.5 * (1 - age / per); });
        lF.position.set(pos.x, 0.62, 0.1); const on = back(span(t, FIRE, FIRE + 0.4)); fl.visible = on > 0.01; fl.position.copy(pos).add(V(0, 0.01, 0)); fl.scale.setScalar(Math.max(1e-4, on * (1 + 0.15 * Math.sin(t * 15))));
        th.userData.set(lerp(25, 34, ease(span(t, WL + 1.0, FIRE + 3.0))));
        K.popIn(lNa, t, WT + 1.0, WT + 2.6); K.popIn(lW, t, WT + 0.4, WL + 1.0);
        K.popIn(lH, t, WL + 1.4, FIRE - 0.2); K.popIn(lF, t, FIRE + 0.3, FIRE + 2.6); K.popIn(lT, t, FIRE + 2.8, WB - 0.3);
      });
      const bw = board('wat', WX, WB, WEND, [V(WX - 0.3, 0.4, 0), V(WX + 0.3, LEVEL, 0), V(WX, LEVEL, 0), V(WX - 0.3, 0.5, 0)], 0.7);
      const heat = lbl('+ heat', 0.26, '#ff9f96', WX + bw.width / 2 + 0.35, BY, BZ);
      beats.push((t) => K.popIn(heat, t, WB + 6.8, WEND));
    }

    // ================================================================ iv · HALOGENS: chlorine, bromine (one burner between the jars)
    stage((t) => t >= CL.t0 - 0.05 && t < BR.end); ST.bake(root, 'hal', LX, 2.7, 1.2);
    spoonTest(CL, 'cl', { burnX: LX, jarX: LX - 0.8, gas: 0xc4f02c, gasOp: 0.42, fade: 0.75, gasName: 'chlorine gas (Cl₂)', gasCol: '#d8f08a', flame: 0xffd21a, flSize: 0.32, crust: 0xf6f5f0, prod: 'white sodium chloride (NaCl) ✓', bx: LX - 0.4 });
    spoonTest(BR, 'br', { burnX: LX, jarX: LX + 0.8, gas: 0xa8452c, gasOp: 0.36, fade: 0.4, gasName: 'bromine', gasCol: '#ffb08a', flame: 0xff9a2a, flSize: 0.22, crust: 0xf1ede6, prod: 'white sodium bromide (NaBr) ✓', burner: false, liquid: 0x6a1a10, bx: LX + 0.4 });

    // ================================================================ v · SULPHUR: ground together in a mortar
    {
      stage((t) => t >= SU - 0.05 && t < SEND); ST.bake(root, 's', SX, 1.6, 1.0);
      add(K.mortar(0.2), SX, 0, 0);
      const sm = new THREE.MeshStandardMaterial({ color: 0xe8c94a, roughness: 0.95 }), heap = add(K.lump(0.13, sm, 4, 0.32, 0.55), SX, 0.04, 0);
      const mat = naMat(), na = add(K.lump(0.04, mat, 6, 0.75)), tg = add(K.tongs(0.6)), ps = add(K.pestle(0.32));
      const stars = Array.from({ length: 6 }, (_, i) => add(K.sparkle(0xffe2a0, 0.12)));
      const fl = add(fire(0xffb43a, 0.14, { core: 0xfff3c4, light: false }), SX, 0.08, 0);
      const yel = new THREE.Color(0xe8c94a), pale = new THREE.Color(0xf2ead0);
      const lS = tag('sulphur (yellow powder)', 0.05, '#ffe38a', SX, 0.32, 0.1), lNa = tag('sodium', 0.05, '#ffffff', SX + 0.3, 0.3, 0.1);
      const lG = tag('grinding: sparks', 0.05, '#ffd27a', SX, 0.36, 0.1), lP = tag('sodium sulphide ✓', 0.055, '#ffffff', SX, 0.32, 0.1);
      const D = V(SX + 0.03, 0.42, 0.02);
      beats.push((t) => {
        const m0 = SU + 1.2;
        carry(tg, t, m0, D.clone().setY(D.y + 0.04));
        const f = K.drop(t, m0 + 1.4, D.y, 0.085, 0.28, 0.01), mix = ease(span(t, SU + 6.0, SU + 8.6));
        na.position.set(D.x - 0.03 * mix, t < m0 + 1.4 ? (t < m0 + 1.2 ? lerp(D.y + 1.1, D.y, 1 - (1 - span(t, m0, m0 + 1.2)) ** 2) : D.y) : f.y - 0.03 * mix, D.z);
        na.visible = t > m0; na.scale.setScalar(Math.max(1e-4, 1 - mix));
        // the pestle comes down and grinds round and round
        const g = span(t, SU + 4.6, SU + 8.4), a = g * Math.PI * 7, r = 0.06 * Math.sin(Math.PI * Math.min(1, g * 1.4));
        const come = ease(span(t, SU + 3.6, SU + 4.6)), go = easeIn(span(t, SU + 8.4, SU + 9.4));
        ps.position.set(SX + Math.cos(a) * r, 0.09 + 0.9 * (1 - come) + 0.9 * go, Math.sin(a) * r); ps.rotation.set(0.25 * Math.sin(a), 0, -0.35 * Math.cos(a) * (g > 0 ? 1 : 0.3));
        ps.visible = t > SU + 3.6 && t < SU + 9.4;
        stars.forEach((s, i) => { const k = ((t - SU - 6.0 - i * 0.23) % 0.7 + 0.7) % 0.7, on = t > SU + 6.0 && t < SU + 8.2; s.visible = on && k < 0.4; s.position.set(SX + 0.08 * Math.cos(i * 2.3), 0.1 + 0.15 * k, 0.08 * Math.sin(i * 2.3)); s.scale.setScalar(0.12 * Math.sin(Math.PI * k / 0.4) + 1e-4); });
        const fo = Math.sin(Math.PI * span(t, SU + 6.4, SU + 7.8)); fl.visible = fo > 0.01; fl.scale.setScalar(Math.max(1e-4, fo));
        sm.color.copy(yel).lerp(pale, mix);
        K.popIn(lS, t, SU + 0.6, SU + 3.4); K.popIn(lNa, t, m0 + 1.6, SU + 4.6); K.popIn(lG, t, SU + 6.2, SU + 8.4); K.popIn(lP, t, SU + 8.8, SEND);
      });
    }

    // ================================================================ vi · REDUCING AGENT: magnesium oxide → magnesium; titanium chloride → titanium
    {
      stage((t) => t >= RM - 0.05 && t < REND); ST.bake(root, 'red', RX, 3.0, 1.2);
      const set = (x) => { add(K.tripod(0.62, 0.15), x, 0, 0); add(K.crucible(0.13, 0.11), x, CRU, 0); const b = add(K.burner(), x, 0, 0); b.userData.flame.scale.setScalar(0.45); fires.push(b.userData.flame); return b.userData.flame; };
      const f1 = set(MX), f2 = set(TX);
      // magnesium oxide: white powder; sodium lumps go in; heated it glows; shiny magnesium beads appear in it
      const powM = new THREE.MeshStandardMaterial({ color: 0xf2f1ec, roughness: 0.95, emissive: 0xff5a10, emissiveIntensity: 0 });
      add(K.lump(0.075, powM, 11, 0.4, 0.5), MX, CRU + 0.035, 0);
      const naM = naMat(), nas = [[-0.03, 0.02], [0.035, -0.02]].map(([dx, dz], i) => add(K.lump(0.026, naM, 20 + i, 0.75), MX + dx, CRU + 0.065, dz));
      const beads = Array.from({ length: 6 }, (_, i) => add(K.solid(new THREE.SphereGeometry(0.014 + 0.004 * (i % 3), 16, 12), M.metal(0xdfe3e8, 0.12), { outline: false }), MX + 0.05 * Math.cos(i * 1.9), CRU + 0.062, 0.045 * Math.sin(i * 1.9)));
      const tg = add(K.tongs(0.6));
      const lMgO = tag('magnesium oxide (white)', 0.05, '#ffffff', MX, CRU + 0.3, 0.05), lNa = tag('sodium', 0.05, '#ffffff', MX + 0.3, CRU + 0.2, 0.05);
      const lMg = tag('magnesium metal set free ✓', 0.05, '#ffffff', MX, CRU + 0.3, 0.05), lTook = tag('sodium took the oxygen', 0.05, '#ffd27a', MX, CRU + 0.3, 0.05);
      // titanium chloride: molten sodium in the crucible; a dropper drips the clear liquid; grey spongy titanium grows, white salt round it
      const pool = add(K.solid(new THREE.CylinderGeometry(0.075, 0.07, 0.02, 32), new THREE.MeshPhysicalMaterial({ color: 0xe8ecf0, metalness: 0.8, roughness: 0.12, emissive: 0xff6a1a, emissiveIntensity: 0.25 }), { outline: false }), TX, CRU + 0.024, 0);
      const spg = add(K.lump(0.055, M.matte(0x7d8288, 0.9), 13, 0.7, 0.8), TX, CRU + 0.05, 0), salt = add(K.lump(0.08, M.matte(0xf4f3ee, 0.9), 14, 0.35, 0.5), TX, CRU + 0.03, 0);
      const dr = add(K.dropper(0.34)), drops = Array.from({ length: 4 }, () => add(new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 8), M.bubble())));
      const fumes = add(K.smoke(6, 0xffffff), TX, CRU + 0.1, 0); fumes.scale.setScalar(0.08);
      const lPool = tag('molten sodium', 0.05, '#ffffff', TX, CRU + 0.3, 0.05), lTi = tag('titanium chloride (TiCl₄)', 0.05, '#cfe8ff', TX + 0.05, CRU + 0.62, 0.05);
      const lTiM = tag('titanium metal set free ✓', 0.05, '#ffffff', TX, CRU + 0.32, 0.05), lRed = tag('a strong reducing agent', 0.055, '#ffe08a', RX, CRU + 0.42, 0.05);
      beats.push((t) => {
        carry(tg, t, RM + 1.2, V(MX + 0.0, CRU + 0.1, 0));
        nas.forEach((n, i) => { const f = K.drop(t, RM + 2.6 + i * 0.05, CRU + 0.1, CRU + 0.065, 0.15, 0.005); n.position.y = t < RM + 2.6 ? CRU + 0.1 + 1.1 * (1 - ease(span(t, RM + 1.2, RM + 2.4))) : f.y; n.visible = t > RM + 1.2 && t < RM + 7.6; n.scale.setScalar(Math.max(1e-4, 1 - ease(span(t, RM + 6.2, RM + 7.6)))); });
        const on1 = back(span(t, RM + 3.6, RM + 4.0)); f1.visible = on1 > 0.01; f1.scale.setScalar(Math.max(1e-4, 0.45 * on1));
        const glow = ease(span(t, RM + 4.2, RM + 6.5)) * (1 - 0.7 * ease(span(t, RM + 8.0, RM + 10.0)));
        powM.emissiveIntensity = 0.6 * glow; naM.emissiveIntensity = 0.8 * glow;
        beads.forEach((b, i) => { b.visible = t > RM + 6.6; b.scale.setScalar(Math.max(1e-4, back(span(t, RM + 6.6 + i * 0.12, RM + 7.2 + i * 0.12)))); });
        K.popIn(lMgO, t, RM + 0.6, RM + 3.6); K.popIn(lNa, t, RM + 2.8, RM + 4.4); K.popIn(lMg, t, RM + 7.6, RM + 9.6); K.popIn(lTook, t, RM + 10.0, RB1 - 0.2);
        // titanium
        const on2 = t > RT - 0.2 ? 1 : 0; f2.visible = on2 > 0; f2.scale.setScalar(0.45);
        const dIn = ease(span(t, RT + 1.4, RT + 2.4)) * (1 - easeIn(span(t, RT + 5.2, RT + 6.2)));
        dr.position.set(TX + 0.02, CRU + 0.2 + 1.0 * (1 - dIn), 0); dr.visible = dIn > 0.01;
        drops.forEach((d, i) => { const t0 = RT + 2.8 + i * 0.55, u = span(t, t0, t0 + 0.35); d.visible = u > 0 && u < 1; d.position.set(TX + 0.02, lerp(CRU + 0.2, CRU + 0.04, u * u), 0); });
        const grow = ease(span(t, RT + 3.2, RT + 6.8));
        spg.scale.setScalar(Math.max(1e-4, grow)); spg.visible = grow > 0.01; salt.scale.set(Math.max(1e-4, grow), Math.max(1e-4, grow), Math.max(1e-4, grow)); salt.visible = grow > 0.01;
        pool.scale.set(1 - 0.4 * grow, 1, 1 - 0.4 * grow);
        fumes.visible = t > RT + 2.9 && t < RT + 8; fumes.userData.update(t, 0.8 * (1 - span(t, RT + 6.5, RT + 8)));
        K.popIn(lPool, t, RT + 0.6, RT + 2.4); K.popIn(lTi, t, RT + 2.6, RT + 6.6); K.popIn(lTiM, t, RT + 7.4, RB2 - 0.2); K.popIn(lRed, t, RB2 + 1.6, REND);
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Why is sodium kept under oil?', intro: INTRO, ticks: TICKS,
      rows: [[0, '1 · Sodium meets…'], [1, 'hydrogen: sodium hydride'], [1, 'oxygen: an oxide, then an alkali'], [1, 'water: fizzing, then fire'],
        [0, '2 · The answer'], [1, 'oil keeps air and water away'], [0, '3 · It reacts with even more'], [1, 'chlorine, bromine, sulphur'], [1, 'it frees other metals (reducing agent)']],
      short: ['hydrogen → NaH', 'oxygen → alkali', 'water → fire', 'kept under oil', 'Cl₂, Br₂, S', 'reducing agent'] }));
    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));
    beats.push(() => { const nar = Math.min(1, (cam.aspect / 1.5) ** 0.7); tags.forEach((l) => { if (l.visible) l.scale.multiplyScalar(cam.position.distanceTo(l.position) * 2 * TAN * l.userData.frac * nar / 0.1); }); });

    return (t, dt) => { for (const b of beats) b(t, dt); };
  },
};
