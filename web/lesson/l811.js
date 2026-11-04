// Lesson 811 · Magnesium and calcium react (book pp. 233–234: (b) chemical properties of magnesium and calcium i–v),
// v1 (2026-10-14). Built from SKILL §0 + the approved 808 pattern (each reaction a real experiment, then its formula on a
// slate: words fly up from the things, atom balls swap partners, symbols last), with 804's "same board, swap the metal".
// THE QUESTION: "Are magnesium and calcium twins?" → card: Same partners? (hydrogen, oxygen, nitrogen, acids, halogens)
// · The answer (same formulas: one family).
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//   HOOK    two crucibles on tripods: a coil of magnesium ribbon, a few grains of calcium. A burner lights under each:
//           magnesium burns with a dazzling white flame, calcium with a brick red flame; white ash stays in both → two
//           metals of one family, but do they behave alike? → card · "give them the same partners".
//   i H₂    hot magnesium on a spoon goes into a jar of hydrogen: a white powder grows (magnesium hydride) → board
//           Mg + H₂ → MgH₂, then only the metal ball swaps: Ca + H₂ → CaH₂ (tick 1).
//   ii O₂   back at the crucibles: the white ash IS the oxide (magnesium oxide, "magnesia"; calcium oxide) → board
//           2Mg + O₂ → 2MgO / 2CaO · a spoon of the ash goes into water, it dissolves, red litmus turns blue = a basic
//           solution → board MgO + H₂O → Mg(OH)₂ / Ca(OH)₂ (tick 2). (Book prints 2MgO + H₂O → 2Mg(OH)₂, unbalanced:
//           the balls must count, so the balanced form is shown; NOTES.md.)
//   iii N₂  hot magnesium in a jar of nitrogen: a yellow-green powder (magnesium nitride) → 3Mg + N₂ → Mg₃N₂ / Ca₃N₂ (tick 3).
//   iv ACID a magnesium ribbon dropped into hydrochloric acid fizzes (hydrogen) → Mg + 2HCl → MgCl₂ + H₂ / Ca · a grain
//           of calcium in sulphuric acid fizzes too → Ca + H₂SO₄ → CaSO₄ + H₂ / Mg (tick 4).
//   v HAL   hot magnesium in chlorine → white magnesium chloride → Mg + Cl₂ → MgCl₂ / CaCl₂ · hot calcium over bromine →
//           white calcium bromide → Ca + Br₂ → CaBr₂ / MgBr₂ (tick 5).
//   END     back at the two crucibles: same partners, same formulas → twins of group IIA; only their flames differ (tick 6).
// Book points (all): i Mg + H₂ → MgH₂, Ca + H₂ → CaH₂ (heating) · ii burn in air: Mg dazzling flame → MgO (magnesia),
// Ca brick red flame → CaO: 2Mg + O₂ → 2MgO, 2Ca + O₂ → 2CaO · oxides dissolve in water → basic solutions: Mg(OH)₂,
// Ca(OH)₂ · iii 3Mg + N₂ → Mg₃N₂, 3Ca + N₂ → Ca₃N₂ (heating) · iv Mg + 2HCl → MgCl₂ + H₂, Mg + H₂SO₄ → MgSO₄ + H₂,
// Ca + 2HCl → CaCl₂ + H₂, Ca + H₂SO₄ → CaSO₄ + H₂ · v Mg + Cl₂ → MgCl₂, Mg + Br₂ → MgBr₂, Ca + Cl₂ → CaCl₂,
// Ca + Br₂ → CaBr₂. Equations to memorize → 🎮 game (COVERAGE_U8).
// §1 CHECK (sheets renders/lesson/d811*.jpg, s811*.jpg, scr811*.jpg): nothing missing ✓ · one question + bridges ✓ ·
// hook (the two flames) paid off at the end ✓ · each experiment: question → before → visible cause (burner, spoon,
// tongs) → result on the thing ✓ · formulas: words → balls → symbols, then only the metal swaps ✓ · substances own
// colours (white flame / brick red, blue water, pale acids, yellow-green chlorine, red-brown bromine, yellow-green
// nitride) ✓ · one place at a time ✓ · camera moves ≥ 2 s ✓ · ≤ 3 labels a shot ✓ · baked tables ✓ · every screen ✓.
import * as THREE from 'three';
import * as K from './kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

const TAN = Math.tan(16 * Math.PI / 180), ASP = 1.6, ADIR = [0, 0.45, 1], BDIR = [0, 0.12, 1], CDIR = [0, 1.0, 1];
let DOCK = 1e9;
/** a shot: the subject (look, w × h) seen along dir; the engine refits it to the real screen (fit = 6th element) */
function S(t, look, w, h, dir = ADIR, e) {
  h *= 1.14; look = [look[0], look[1] + 0.05 * h, look[2]];        // headroom: the caption floats just above the subject (capNear)
  const dk = t >= DOCK, d = V(...dir).normalize(), dist = Math.max(h / 2 / TAN, (dk ? w / (1 - K.DOCK_W) : w) / 2 / (TAN * ASP)) * 1.1;
  const pos = V(...look).addScaledVector(d, dist).toArray(), fit = { look, w, h, dir, dock: dk ? K.DOCK_W : 0 };
  return dk ? [t, ...K.dockShot(pos, look), undefined, e, fit] : [t, pos, look, undefined, e, fit];
}

// ---------------------------------------------------------------- places (stations 10 apart)
const CX = [-0.5, 0.5], CRU = 0.632, BKX = -2.1, SURF = 0.055 + 0.34;   // the two crucibles (Mg, Ca) · the water beaker
const BY = 2.0, BZ = -0.45;                                              // the formula slate hangs behind each set-up
const HX = 10, NX = 20, AX = 30, LX = 40;
const AC = [AX - 0.6, AX + 0.6], ALEV = 0.05 + 0.24;                     // the two acid beakers · their surface

// ---------------------------------------------------------------- time (every camera move ≥ 2 s)
const SP = (t0) => ({ t0, h0: t0 + 1.2, h1: t0 + 2.4, lift: t0 + 3.8, over: t0 + 5.0, in: t0 + 5.8, done: t0 + 8.6, b0: t0 + 10.8, b1: t0 + 19.3, end: t0 + 24.5 });
const T = { mg: 2.8, ca: 7.6, ask: 11.6, card: 14.5 };
DOCK = T.card + 5.0;
const H = SP(DOCK + 3.0);
const OB0 = H.end, OB = OB0 + 5.0, OB1 = OB + 8.5, OEND = OB1 + 5.2;
const W0 = OEND, LIT = W0 + 5.4, WB = W0 + 11.0, WB1 = WB + 8.5, WEND = WB1 + 5.2;
const N = SP(WEND);
const A0 = N.end, AB1 = A0 + 7.0, A2 = AB1 + 13.7, AB2 = A2 + 7.0, AEND = AB2 + 13.7;
const CL = SP(AEND), BR = SP(CL.end);
const END = BR.end; T.done = END + 12.5;
const INTRO = [T.card, DOCK];
const TICKS = [[H.end - 0.6, 0], [WEND - 0.6, 1], [N.end - 0.6, 2], [AEND - 0.6, 3], [BR.end - 0.6, 4], [END + 8.2, 5]];

const spoonCaps = (P, gas, grows, prod, other) => [
  [P.t0, P.in, `Hot ${P.metal} meets ${gas}`], [P.in, P.done, grows], [P.done, P.b0, `${prod} ✓`],
  [P.b0, P.b1, P.eq], [P.b1, P.end, `${other}: the same → ${P.prod2} ✓`],
];
Object.assign(H, { metal: 'magnesium', eq: 'Magnesium + hydrogen → magnesium hydride', prod2: 'calcium hydride' });
Object.assign(N, { metal: 'magnesium', eq: 'Magnesium + nitrogen → magnesium nitride', prod2: 'calcium nitride' });
Object.assign(CL, { metal: 'magnesium', eq: 'Magnesium + chlorine → magnesium chloride', prod2: 'calcium chloride' });
Object.assign(BR, { metal: 'calcium', eq: 'Calcium + bromine → calcium bromide', prod2: 'magnesium bromide' });
const captions = [
  [0.3, T.mg - 1.0, 'Magnesium and calcium: one family'],
  [T.mg - 1.0, T.ca - 1.0, 'Heat magnesium: a dazzling white flame'],
  [T.ca - 1.0, T.ask, 'Heat calcium: a brick red flame'],
  [T.ask, T.card, 'Do these two metals behave alike?'],
  [T.card, DOCK, 'Are magnesium and calcium twins?'],
  [DOCK, H.t0, 'Give them the same partners'],
  ...spoonCaps(H, 'hydrogen gas', 'A white powder grows on it', 'Magnesium hydride', 'Calcium'),
  [OB0, OB, 'The flames: that was oxygen of the air'],
  [OB, OB1, 'Magnesium + oxygen → magnesium oxide'],
  [OB1, OEND, 'Calcium: the same → calcium oxide ✓'],
  [W0, W0 + 3.6, 'Now put the oxide in water'],
  [W0 + 3.6, LIT, 'It dissolves'],
  [LIT, LIT + 4.4, 'Red litmus turns blue…'],
  [LIT + 4.4, WB, '…a basic solution ✓'],
  [WB, WB1, 'Magnesium oxide + water → magnesium hydroxide'],
  [WB1, WEND, 'Calcium oxide: the same → calcium hydroxide ✓'],
  ...spoonCaps(N, 'nitrogen gas', 'A yellow-green powder grows', 'Magnesium nitride', 'Calcium'),
  [A0, A0 + 3.0, 'Magnesium meets an acid'],
  [A0 + 3.0, AB1, 'It fizzes: hydrogen gas ✓'],
  [AB1, AB1 + 8.5, 'Magnesium + acid → magnesium chloride + hydrogen'],
  [AB1 + 8.5, A2, 'Calcium: the same → calcium chloride + hydrogen'],
  [A2, A2 + 3.0, 'Calcium meets sulphuric acid'],
  [A2 + 3.0, AB2, 'It fizzes too: hydrogen gas ✓'],
  [AB2, AB2 + 8.5, 'Calcium + sulphuric acid → calcium sulphate + hydrogen'],
  [AB2 + 8.5, AEND, 'Magnesium: the same → magnesium sulphate ✓'],
  ...spoonCaps(CL, 'chlorine', 'It glows; a white solid forms', 'Magnesium chloride', 'Calcium'),
  ...spoonCaps(BR, 'bromine', 'It glows; a white solid forms', 'Calcium bromide', 'Magnesium'),
  [END, END + 4.2, 'Hydrogen, oxygen, nitrogen, acids, halogens…'],
  [END + 4.2, END + 8.2, '…same partners, same formulas'],
  [END + 8.2, T.done, 'Twins of group IIA: only the flames differ ✓'],
];

// ---------------------------------------------------------------- camera (the board shots are re-framed in build() with the board's real size)
const CAMS = [], BCAM = {};
const at = (...k) => CAMS.push(...k);
const bshot = (key, t, k) => { (BCAM[key] ||= []).push([CAMS.length, t, k]); CAMS.push(S(t, [0, BY, BZ], 3, 1.5, BDIR)); };
const HW = (t, k = 1, e) => S(t, [0, 0.55, 0], 1.95 * k, 1.0 * k, [0, 0.85, 1], e);
const CR = (t, i, k = 1, e) => S(t, [CX[i], CRU + 0.08, 0], 0.62 * k, 0.52 * k, CDIR, e);
const STN = (t, x, k = 1, e) => S(t, [x, 0.55, 0], 1.6 * k, 1.3 * k, ADIR, e);
const CLOSE = (t, x, k = 1, e) => S(t, [x, 0.5, 0], 0.95 * k, 0.95 * k, ADIR, e);
const boardCams = (key, b0, end) => { bshot(key, b0 + 1.5, 1); bshot(key, end - 0.05, 0.96); };
const spoonCams = (P, key, sx, jx) => { at(STN(P.t0, sx, 1.04), STN(P.lift - 0.2, sx, 1.0), CLOSE(P.in, jx, 1.04), CLOSE(P.done + 0.6, jx, 0.97)); boardCams(key, P.b0, P.end); };
// HOOK: both crucibles, close on each flame, wide for the question
at(HW(0, 1.04), HW(T.mg - 1.4, 1.0), CR(T.mg + 0.4, 0, 1.06), CR(T.ca - 2.2, 0, 1.0), CR(T.ca + 0.2, 1, 1.06), CR(T.ask - 0.6, 1, 1.0), HW(T.ask + 1.8, 1.02), HW(T.card, 1.0), HW(H.t0 - 0.05, 0.97));
spoonCams(H, 'h2', HX - 0.12, HX + 0.25);
// OXYGEN: back at the ash, its board; then the ash into water and litmus
at(S(OB0, [0, CRU + 0.1, 0], 1.9, 0.8, CDIR), S(OB - 2.0, [0, CRU + 0.1, 0], 1.8, 0.76, CDIR));
boardCams('o2', OB, OEND);
at(S(W0, [(BKX + CX[0]) / 2, 0.55, 0], 1.75, 1.15), S(W0 + 3.0, [BKX, 0.5, 0], 1.0, 1.0), S(LIT + 1.2, [BKX - 0.05, 0.48, 0], 0.9, 0.95), S(WB - 2.0, [BKX - 0.05, 0.48, 0], 0.86, 0.9));
boardCams('ow', WB, WEND);
spoonCams(N, 'n2', NX - 0.12, NX + 0.25);
// ACIDS: a beaker each, close on the fizz, then its board
at(S(A0, [AX, 0.3, 0], 1.85, 0.8), S(A0 + 2.4, [AC[0], 0.28, 0], 0.8, 0.62), S(AB1 - 2.0, [AC[0], 0.28, 0], 0.76, 0.6));
boardCams('hcl', AB1, A2);
at(S(A2, [AX, 0.3, 0], 1.85, 0.8), S(A2 + 2.4, [AC[1], 0.28, 0], 0.8, 0.62), S(AB2 - 2.0, [AC[1], 0.28, 0], 0.76, 0.6));
boardCams('so4', AB2, AEND);
spoonCams(CL, 'cl', LX - 0.38, LX - 0.8);
spoonCams(BR, 'br', LX + 0.38, LX + 0.8);
// END: the two crucibles
at(HW(END, 1.06), HW(END + 4.2, 1.0), HW(T.done, 0.96));
CAMS.sort((a, b) => a[0] - b[0]);
for (const k in BCAM) BCAM[k] = BCAM[k].map(([, t, f]) => [CAMS.findIndex((c) => c[0] === t), t, f]);

// ---------------------------------------------------------------- the formulas (words and symbols for Mg, then Ca)
const M1 = (mol, n, react = false) => ({ mol, n, react });
const MG = ['magnesium', 'Mg'], CA = ['calcium', 'Ca'];
const eq = (terms, ops, wf, sf, first = 'Mg') => { const ms = first === 'Mg' ? [MG, CA] : [CA, MG]; return { terms, ops, metals: ms.map((m) => m[1]), words: ms.map(([w]) => wf(w)), syms: ms.map(([, s]) => sf(s)) }; };
const EQ = {
  h2: eq([M1('M', 1, true), M1('H2', 1, true), M1('MH2', 1)], ['+', '→'], (m) => [m, 'hydrogen', `${m}\nhydride`], (s) => [s, 'H₂', `${s}H₂`]),
  o2: eq([M1('M', 2, true), M1('O2', 1, true), M1('MO', 2)], ['+', '→'], (m) => [m, 'oxygen', `${m}\noxide`], (s) => [`2${s}`, 'O₂', `2${s}O`]),
  ow: eq([M1('MO', 1, true), M1('H2O', 1, true), M1('MOH2', 1)], ['+', '→'], (m) => [`${m}\noxide`, 'water', `${m}\nhydroxide`], (s) => [`${s}O`, 'H₂O', `${s}(OH)₂`]),
  n2: eq([M1('M', 3, true), M1('N2', 1, true), M1('M3N2', 1)], ['+', '→'], (m) => [m, 'nitrogen', `${m}\nnitride`], (s) => [`3${s}`, 'N₂', `${s}₃N₂`]),
  hcl: eq([M1('M', 1, true), M1('HCl', 2, true), M1('MCl2', 1), M1('H2', 1)], ['+', '→', '+'], (m) => [m, 'hydrochloric\nacid', `${m}\nchloride`, 'hydrogen'], (s) => [s, '2HCl', `${s}Cl₂`, 'H₂']),
  so4: eq([M1('M', 1, true), M1('H2SO4', 1, true), M1('MSO4', 1), M1('H2', 1)], ['+', '→', '+'], (m) => [m, 'sulphuric\nacid', `${m}\nsulphate`, 'hydrogen'], (s) => [s, 'H₂SO₄', `${s}SO₄`, 'H₂'], 'Ca'),
  cl: eq([M1('M', 1, true), M1('Cl2', 1, true), M1('MCl2', 1)], ['+', '→'], (m) => [m, 'chlorine', `${m}\nchloride`], (s) => [s, 'Cl₂', `${s}Cl₂`]),
  br: eq([M1('M', 1, true), M1('Br2', 1, true), M1('MBr2', 1)], ['+', '→'], (m) => [m, 'bromine', `${m}\nbromide`], (s) => [s, 'Br₂', `${s}Br₂`], 'Ca'),
};

export default {
  capNear: true, oneText: true,
  duration: T.done,
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const beats = [], fires = [];
    const ST = K.studio({ scene, R }, '811');                            // FIRST: models read the look (no dark scenes in this lesson)
    beats.push((t) => ST.update(t));
    let root = scene;
    const add = (o, x = 0, y = 0, z = 0) => { o.position.set(x, y, z); root.add(o); return o; };
    const stage = (show) => { root = new THREE.Group(); scene.add(root); const g = root; beats.push((t) => { g.visible = show(t); }); return g; };
    const lbl = (text, h, color, x, y, z = 0, w = 700) => add(K.label(text, h, color, w), x, y, z);
    const tags = [], tag = (text, h, color, x, y, z = 0, w = 700) => { const l = lbl(text, 0.1, color, x, y, z, w); l.userData.frac = h * 1.8; tags.push(l); return l; };
    const shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
    const fire = (tint, size, opts) => { const f = K.makeFire(tint, size, opts); fires.push(f); return f; };
    const COL = { Mg: [0xb4b8bf, 0.85, 0.28], Ca: [0xe3e0d6, 0.5, 0.35] };
    const metalMat = (s) => new THREE.MeshPhysicalMaterial({ color: COL[s][0], metalness: COL[s][1], roughness: COL[s][2], clearcoat: 0.5, emissive: 0xff6a1a, emissiveIntensity: 0 });
    const metalPiece = (s, mat) => (s === 'Mg' ? K.ribbonCoil(0.028, 3, mat) : K.lump(0.04, mat, 7, 0.7));
    /** tongs bring something down from above to `to` (arrive m0+1.2) and let go at m0+1.4, rise away by m0+2.4 */
    const carry = (tg, t, m0, to) => {
      tg.visible = t > m0 && t < m0 + 2.4; if (!tg.visible) return;
      const top = to.clone().add(V(0, 1.1, 0));
      tg.position.copy(t < m0 + 1.2 ? top.lerp(to, 1 - (1 - span(t, m0, m0 + 1.2)) ** 2) : t < m0 + 1.5 ? to.clone() : to.clone().lerp(top, easeIn(span(t, m0 + 1.5, m0 + 2.4))));
      tg.userData.set(lerp(0.03, 0.08, span(t, m0 + 1.35, m0 + 1.5)));
    };
    /** the formula on a dark slate that rolls down behind the set-up (words → balls → symbols; then only the metal swaps) */
    const board = (key, sx, b0, b1, t1, from, extra = 0) => {
      const q = EQ[key], bd = K.reactionBoard(scene, { x: sx, y: BY, z: BZ, h: 0.26, k: 2.0, terms: q.terms, ops: q.ops, metals: q.metals, words: q.words, syms: q.syms, from, t0: b0 - 0.05, starts: [b0, b1], t1 });
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
    /** a spoon test: the metal heated in a spoon over a burner, lowered into a gas jar; it reacts; then its formula */
    const spoonTest = (P, key, { metal, burnX, jarX, gas, gasOp, fade = 0, gasName, gasCol, flame, flSize = 0.3, crust, prod, prodCol = '#ffffff', burner = true, liquid, bx }) => {
      if (burner) { const brn = add(K.burner(), burnX, 0, 0); brn.userData.flame.scale.setScalar(0.45); fires.push(brn.userData.flame); }
      const jar = add(K.gasJar(gas, 0.17, 0.7), jarX, 0, 0), gm = jar.userData.gas; gm.opacity = gasOp;
      if (liquid) add(K.solid(new THREE.CylinderGeometry(0.135, 0.135, 0.03, 32), new THREE.MeshPhysicalMaterial({ color: liquid, roughness: 0.15, clearcoat: 1, transmission: 0.2 }), { outline: false }), jarX, 0.068, 0);
      const lid = jar.userData.lid, lid0 = lid.position.clone();
      const sp = add(K.spoon(0.6)), mat = metalMat(metal), pc = metalPiece(metal, mat); pc.position.y = -0.045; sp.add(pc);
      const base = new THREE.Color(COL[metal][0]);
      const f = flame ? add(fire(flame, flSize, { core: 0xfff3c4 })) : null, sm = add(K.smoke(6, 0xffffff)); sm.scale.setScalar(0.08);
      const A = V(burnX + 0.02, 1.7, 0), HH = V(burnX, 0.8, 0), UP = V(jarX, 1.05, 0), IN = V(jarX, 0.38, 0);
      const lGas = tag(gasName, 0.05, gasCol, jarX, 0.86, 0.05), lM = tag(`${metal === 'Mg' ? 'magnesium' : 'calcium'}, heated`, 0.05, '#ffffff', 0, 0, 0), lProd = tag(prod, 0.05, prodCol, jarX, 0.86, 0.05);
      const crustC = new THREE.Color(crust);
      beats.push((t) => {
        let p;
        if (t < P.h1) p = A.clone().lerp(HH, ease(span(t, P.h0, P.h1)));
        else if (t < P.lift) p = HH.clone();
        else if (t < P.over) p = K.arc(HH, UP, 0.15, ease(span(t, P.lift, P.over)));
        else p = UP.clone().lerp(IN, ease(span(t, P.over, P.in)));
        sp.position.copy(p); sp.visible = t > P.h0 && t < P.end;
        const lu = ease(span(t, P.lift - 0.4, P.lift)); lid.position.set(lid0.x, lid0.y - (lid0.y - 0.006) * easeIn(span(t, P.lift - 0.1, P.lift + 0.2)), lid0.z - 0.42 * lu);
        const heat = ease(span(t, P.h1 - 0.3, P.lift)), on = back(span(t, P.in, P.in + 0.35)) * (1 - ease(span(t, P.done - 0.6, P.done + 0.3))), cr = ease(span(t, P.in + 0.4, P.done));
        mat.color.copy(base).lerp(crustC, cr); mat.metalness = COL[metal][1] * (1 - cr); mat.roughness = lerp(COL[metal][2], 0.92, cr); mat.clearcoat = 0.5 * (1 - cr);
        mat.emissiveIntensity = (0.55 * heat + 0.6 * on) * (1 - cr);
        pc.scale.set(1 + 0.4 * cr, 1 + 0.5 * cr, 1 + 0.4 * cr);
        if (f) { f.visible = on > 0.01; f.position.copy(p).add(V(0, -0.02, 0)); f.scale.setScalar(Math.max(1e-4, on * (1 + 0.15 * Math.sin(t * 17) + 0.08 * Math.sin(t * 29)))); }
        sm.visible = !!flame && t > P.in && t < P.done + 1; sm.position.copy(p).add(V(0, 0.02, 0)); sm.userData.update(t, on);
        gm.opacity = gasOp * (1 - fade * ease(span(t, P.in, P.done)));
        lM.position.copy(p).add(V(-0.28, 0.12, 0.1)); K.popIn(lM, t, P.h1 - 0.2, P.lift);
        K.popIn(lGas, t, P.t0 + 0.6, P.in); K.popIn(lProd, t, P.done - 0.2, P.b0 - 0.3);
      });
      board(key, bx ?? (burnX + jarX) / 2, P.b0, P.b1, P.end, [IN.clone().add(V(0, 0.1, 0)), V(jarX, 0.6, 0), V(jarX, 0.5, 0)]);
    };

    // ================================================================ HOOK / OXYGEN / END · two crucibles burn; the ash goes into water
    {
      stage((t) => t < H.t0 || (t >= OB0 - 0.05 && t < WEND) || t >= END - 0.05); ST.bake(root, 'hook', -0.8, 3.9, 1.2);
      const set = (x) => { add(K.tripod(0.62, 0.15), x, 0, 0); add(K.crucible(0.13, 0.11), x, CRU, 0); const b = add(K.burner(), x, 0, 0); b.userData.flame.scale.setScalar(0.45); fires.push(b.userData.flame); return b.userData.flame; };
      const bf = CX.map(set);
      const mgM = metalMat('Mg'), caM = metalMat('Ca');
      const coil = add(K.ribbonCoil(0.055, 4, mgM), CX[0], CRU + 0.014, 0);
      const grains = [[-0.03, 0.02, 3], [0.035, -0.015, 5], [0.0, -0.04, 8]].map(([dx, dz, s]) => add(K.lump(0.03, caM, s, 0.7), CX[1] + dx, CRU + 0.04, dz));
      const ashM = [0xf6f5f0, 0xf3f1ea].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.95 }));
      const ash = CX.map((x, i) => add(K.lump(0.07, ashM[i], 11 + i, 0.4, 0.5), x, CRU + 0.035, 0));
      const fl = [add(fire(0xffffff, 0.34, { core: 0xffffff })), add(fire(0xc8402a, 0.3, { core: 0xffb48a }))];
      fl.forEach((f, i) => f.position.set(CX[i], CRU + 0.05, 0.03));   // a little in front of the burner flame (never the same plane)
      const flash = add(new THREE.PointLight(0xffffff, 0, 6, 2), CX[0], CRU + 0.35, 0.2);
      const stars = Array.from({ length: 7 }, () => add(K.sparkle(0xffffff, 0.12)));
      const BURN = [T.mg, T.ca];
      // the water beaker of the oxygen part; a spoon carries the ash in; red litmus turns blue
      const bk = add(new THREE.Group(), BKX, 0, 0); bk.add(K.beaker(0.24, 0.5)); const wl = K.liquid(0.23, 0.34, 0x5aa0d8, 0.38); wl.position.y = 0.055; bk.add(wl);
      beats.push((t) => { bk.visible = t > OB0 && t < WEND; });   // only in the water part (wide screens would show it beside the crucibles)
      const sp = add(K.spoon(0.6)), scoop = K.lump(0.035, ashM[0], 21, 0.5, 0.5); scoop.position.y = -0.04; sp.add(scoop);
      const paper = add(K.paperStrip([[0, 0], [0.2, 0], [0.42, 0]], 0.06, 0xd9606c, 0x4a6fd0, 0.006)), ptg = add(K.tongs(0.6));
      const IN = V(CX[0], CRU + 0.1, 0), UP = V(CX[0], 1.25, 0), OVER = V(BKX + 0.05, 1.05, 0), WET = V(BKX + 0.05, 0.28, 0), PAT = V(BKX + 0.12, 0.12, 0);
      const lMg = tag('magnesium ribbon', 0.05, '#ffffff', CX[0], CRU + 0.28, 0.05), lCa = tag('calcium grains', 0.05, '#ffffff', CX[1], CRU + 0.28, 0.05);
      const lWhite = tag('dazzling white flame', 0.055, '#ffffff', CX[0], CRU + 0.5, 0.05), lRed = tag('brick red flame', 0.055, '#ff9a80', CX[1], CRU + 0.5, 0.05);
      const lMgO = tag('magnesium oxide (magnesia)', 0.05, '#ffffff', CX[0] + 0.27, CRU + 0.32, 0.05), lCaO = tag('calcium oxide', 0.05, '#ffffff', CX[1] + 0.2, CRU + 0.32, 0.05);
      const lWater = tag('water', 0.05, '#bfe0ff', BKX + 0.2, 0.32, 0.3), lDis = tag('it dissolves', 0.05, '#ffffff', BKX - 0.05, 0.72, 0.1);
      const lLit = tag('red litmus paper', 0.05, '#ff9aa4', BKX + 0.05, 0.86, 0), lBlue = tag('turns blue: basic ✓', 0.05, '#9ec0ff', BKX + 0.05, 0.86, 0);
      const lTwin = tag('twins: group IIA ✓', 0.06, '#ffe08a', 0, CRU + 0.62, 0.05);
      const lEndMg = tag('magnesium', 0.05, '#ffffff', CX[0], CRU + 0.36, 0.05), lEndCa = tag('calcium', 0.05, '#ffffff', CX[1], CRU + 0.36, 0.05);
      beats.push((t) => {
        // the burners light, the metals catch fire, white ash is left
        let fl0 = 0;
        bf.forEach((f, i) => { const on = back(span(t, BURN[i] - 1.0, BURN[i] - 0.6)) * (1 - ease(span(t, BURN[i] + 3.6, BURN[i] + 4.0))); f.visible = on > 0.01; f.scale.setScalar(Math.max(1e-4, 0.45 * on)); });
        fl.forEach((f, i) => {
          const b = BURN[i], on = back(span(t, b + 0.4, b + 0.8)) * (1 - ease(span(t, b + 3.0, b + 3.8)));
          f.visible = on > 0.01 && t < H.t0; f.scale.setScalar(Math.max(1e-4, on * (1 + 0.18 * Math.sin(t * 19 + i) + 0.08 * Math.sin(t * 31))));
          if (i === 0) fl0 = on;
          const a = ease(span(t, b + 1.0, b + 3.6)); ash[i].visible = a > 0.01; ash[i].scale.setScalar(Math.max(1e-4, a));
        });
        flash.intensity = 9 * fl0 * (1 + 0.25 * Math.sin(t * 23));
        stars.forEach((s, i) => { const k = ((t - T.mg - 0.5 - i * 0.21) % 0.6 + 0.6) % 0.6; s.visible = fl0 > 0.3 && k < 0.4; s.position.set(CX[0] + 0.11 * Math.cos(i * 2.3), CRU + 0.12 + 0.2 * k, 0.1 * Math.sin(i * 2.3)); s.scale.setScalar(0.14 * Math.sin(Math.PI * k / 0.4) + 1e-4); });
        const mg = ease(span(t, T.mg + 0.6, T.mg + 3.4)); coil.scale.setScalar(Math.max(1e-4, 1 - mg)); coil.visible = mg < 0.99; mgM.emissive.set(0xffffff); mgM.emissiveIntensity = 1.2 * fl0;
        const ca = ease(span(t, T.ca + 0.6, T.ca + 3.2)); grains.forEach((g) => { g.scale.setScalar(Math.max(1e-4, 1 - ca)); g.visible = ca < 0.99; }); caM.emissiveIntensity = 0.8 * Math.sin(Math.PI * span(t, T.ca + 0.3, T.ca + 3.4));
        // the spoon takes some magnesium oxide into the water
        let p = IN.clone().add(V(0, 1.1, 0));
        if (t < W0 + 0.9) p = p.lerp(IN, ease(span(t, W0, W0 + 0.9)));
        else if (t < W0 + 1.2) p = IN.clone();
        else if (t < W0 + 2.5) p = K.arc(IN, OVER, 0.2, ease(span(t, W0 + 1.2, W0 + 2.5)));
        else if (t < W0 + 4.6) p = OVER.clone().lerp(WET, ease(span(t, W0 + 2.5, W0 + 3.2)));
        else p = WET.clone().lerp(V(WET.x, 1.6, 0), easeIn(span(t, W0 + 4.6, W0 + 5.4)));
        sp.position.copy(p); sp.visible = t > W0 && t < W0 + 5.4;
        const dis = ease(span(t, W0 + 3.2, W0 + 4.6)); scoop.visible = t > W0 + 1.0 && dis < 0.99; scoop.scale.setScalar(Math.max(1e-4, 1 - dis)); scoop.position.y = -0.04 - 0.1 * dis;
        const top = PAT.clone().add(V(0, 0.42, 0)), pTop = V(top.x, top.y + 1.0, 0), pp = t < LIT + 1.4 ? pTop.clone().lerp(top, 1 - (1 - span(t, LIT, LIT + 1.4)) ** 2) : top;
        paper.position.copy(pp).add(V(0, -0.42, 0)); paper.visible = t > LIT && t < WEND; ptg.position.copy(pp).add(V(0, -0.02, 0)); ptg.visible = paper.visible; ptg.userData.set(0.012);
        paper.userData.wet(0.36 * ease(span(t, LIT + 1.9, LIT + 4.2)));
        K.popIn(lMg, t, 0.6, T.mg - 0.6); K.popIn(lCa, t, 1.3, T.mg - 0.6);
        K.popIn(lWhite, t, T.mg + 1.0, T.ca - 1.6); K.popIn(lRed, t, T.ca + 1.0, T.ask + 1.2);
        K.popIn(lMgO, t, OB0 + 1.2, OB - 0.3); K.popIn(lCaO, t, OB0 + 2.2, OB - 0.3);
        K.popIn(lWater, t, W0 + 1.8, W0 + 4.4); K.popIn(lDis, t, W0 + 3.4, LIT + 0.2);
        K.popIn(lLit, t, LIT + 0.5, LIT + 3.6); K.popIn(lBlue, t, LIT + 3.9, WB - 1.8);
        K.popIn(lEndMg, t, END + 0.6, END + 8.0); K.popIn(lEndCa, t, END + 1.2, END + 8.0); K.popIn(lTwin, t, END + 8.4);
      });
      board('o2', 0, OB, OB1, OEND, [V(CX[0], CRU + 0.1, 0), V(0, CRU + 0.4, 0), V(CX[1], CRU + 0.1, 0)]);
      board('ow', BKX, WB, WB1, WEND, [WET.clone(), V(BKX + 0.15, 0.3, 0), V(BKX, 0.25, 0)]);
    }

    // ================================================================ i · HYDROGEN
    stage((t) => t >= H.t0 - 0.05 && t < H.end); ST.bake(root, 'h2', HX - 0.12, 2.0, 1.2);
    spoonTest(H, 'h2', { metal: 'Mg', burnX: HX - 0.5, jarX: HX + 0.25, gas: 0xeaf4ff, gasOp: 0.06, gasName: 'hydrogen gas (H₂)', gasCol: '#cfe8ff', crust: 0xf2f1ec, prod: 'magnesium hydride (white)' });

    // ================================================================ iii · NITROGEN
    stage((t) => t >= N.t0 - 0.05 && t < N.end); ST.bake(root, 'n2', NX - 0.12, 2.0, 1.2);
    spoonTest(N, 'n2', { metal: 'Mg', burnX: NX - 0.5, jarX: NX + 0.25, gas: 0xe6eef8, gasOp: 0.06, gasName: 'nitrogen gas (N₂)', gasCol: '#cfe0ff', crust: 0xd6cf6a, prod: 'magnesium nitride (yellow-green)', prodCol: '#e8e28a' });

    // ================================================================ iv · ACIDS: a magnesium ribbon in hydrochloric acid, calcium in sulphuric acid
    {
      stage((t) => t >= A0 - 0.05 && t < AEND); ST.bake(root, 'acid', AX, 2.4, 1.1);
      const ACOL = [0xeef2c8, 0xe2ecf6];
      AC.forEach((x, i) => { add(K.beaker(0.17, 0.4), x, 0, 0); add(K.liquid(0.16, 0.24, ACOL[i], 0.28), x, 0.05, 0); });
      const STARTS = [A0, A2], pcs = ['Mg', 'Ca'].map((s) => { const m = metalMat(s); return { m, o: add(s === 'Mg' ? K.ribbonCoil(0.03, 3, m) : K.lump(0.04, m, 9, 0.7)) }; });
      const tgs = [add(K.tongs(0.6)), add(K.tongs(0.6))];
      const fz = AC.map(() => add(K.bubbles(26, V(), ALEV + 0.01, 0.12, 0.011)));
      const lA = [tag('dilute hydrochloric acid', 0.05, '#f2f6c8', AC[0], 0.52, 0.05), tag('dilute sulphuric acid', 0.05, '#dfeaf8', AC[1], 0.52, 0.05)];
      const lP = [tag('magnesium ribbon', 0.05, '#ffffff', AC[0], 0.52, 0.05), tag('calcium', 0.05, '#ffffff', AC[1], 0.52, 0.05)];
      const lH = [tag('hydrogen bubbles ✓', 0.05, '#ffffff', AC[0], 0.52, 0.05), tag('hydrogen bubbles ✓', 0.05, '#ffffff', AC[1], 0.52, 0.05)];
      beats.push((t) => {
        AC.forEach((x, i) => {
          const s0 = STARTS[i], m0 = s0 + 1.2, D = V(x, 0.62, 0);
          carry(tgs[i], t, m0, D);
          const f = K.drop(t, m0 + 1.4, D.y - 0.04, 0.075, 0.4, 0.01), go = ease(span(t, s0 + 3.2, s0 + 12.0));
          const p = pcs[i].o; p.visible = t > m0; p.position.set(x, t < m0 + 1.2 ? lerp(D.y + 1.1, D.y, 1 - (1 - span(t, m0, m0 + 1.2)) ** 2) - 0.04 : t < m0 + 1.4 ? D.y - 0.04 : f.y, 0);
          p.scale.setScalar(Math.max(1e-4, 1 - 0.6 * go));
          const rate = t > m0 + 1.8 ? (t < s0 + 7.0 ? 1 : 0.35) : 0; fz[i].visible = rate > 0; fz[i].userData.update(t, rate, V(x, 0.08, 0));
          K.popIn(lA[i], t, s0 + 0.4, m0 + 0.6); K.popIn(lP[i], t, m0 + 1.0, s0 + 3.4); K.popIn(lH[i], t, s0 + 3.6, s0 + 6.8);
        });
      });
      board('hcl', AX, AB1, AB1 + 8.5, A2 - 0.05, [V(AC[0], 0.2, 0), V(AC[0], 0.3, 0), V(AC[0], 0.25, 0), V(AC[0], 0.4, 0)], 0.3);
      board('so4', AX, AB2, AB2 + 8.5, AEND, [V(AC[1], 0.2, 0), V(AC[1], 0.3, 0), V(AC[1], 0.25, 0), V(AC[1], 0.4, 0)], 0.3);
    }

    // ================================================================ v · HALOGENS: chlorine (magnesium), bromine (calcium); one burner between the jars
    stage((t) => t >= CL.t0 - 0.05 && t < BR.end); ST.bake(root, 'hal', LX, 2.7, 1.2);
    spoonTest(CL, 'cl', { metal: 'Mg', burnX: LX, jarX: LX - 0.8, gas: 0xc4f02c, gasOp: 0.42, fade: 0.75, gasName: 'chlorine gas (Cl₂)', gasCol: '#d8f08a', flame: 0xffffff, flSize: 0.3, crust: 0xf6f5f0, prod: 'magnesium chloride (white)', bx: LX - 0.4 });
    spoonTest(BR, 'br', { metal: 'Ca', burnX: LX, jarX: LX + 0.8, gas: 0xa8452c, gasOp: 0.36, fade: 0.4, gasName: 'bromine (red-brown)', gasCol: '#ffb08a', flame: 0xd0502a, flSize: 0.22, crust: 0xf1ede6, prod: 'calcium bromide (white)', burner: false, liquid: 0x6a1a10, bx: LX + 0.4 });

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Are magnesium and calcium twins?', intro: INTRO, ticks: TICKS,
      rows: [[0, '1 · The same partners?'], [1, 'hydrogen: hydrides'], [1, 'oxygen: oxides, basic in water'], [1, 'nitrogen: nitrides'], [1, 'acids: hydrogen gas'], [1, 'chlorine, bromine: halides'],
        [0, '2 · The answer'], [1, 'same formulas: one family']],
      short: ['H₂ → hydrides', 'O₂ → oxides', 'N₂ → nitrides', 'acids → H₂', 'Cl₂, Br₂ → halides', 'twins ✓'] }));
    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));
    beats.push(() => { const nar = Math.min(1, (cam.aspect / 1.5) ** 0.7); tags.forEach((l) => { if (l.visible) l.scale.multiplyScalar(cam.position.distanceTo(l.position) * 2 * TAN * l.userData.frac * nar / 0.1); }); });

    return (t, dt) => { for (const b of beats) b(t, dt); };
  },
};
