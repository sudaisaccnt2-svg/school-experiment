// Lesson 812 · Uses of magnesium and calcium (book p. 235: (c) (i) Uses of Magnesium i–v, (ii) Uses of Calcium i–iv),
// v1 (2026-10-14). Built from SKILL §0 + the approved 809 pattern: familiar things on a baked table as the hook, ONE
// question on a card, each use one clear picture with a visible cause and its result labelled on the thing.
// THE QUESTION: "What jobs do magnesium and calcium do?" → card: Magnesium (5 rows) · Calcium (3 rows).
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//   HOOK    a table: a model aeroplane, a sparkler, sugar cubes, a glass bottle, named one by one; a dish of magnesium and
//           a dish of calcium in front; a gold spark leaps from each metal to two of the things · these metals help make
//           them · "but both are very reactive!" → card · "magnesium first".
//   ALLOY   a beam balance: a magnesium block and an iron block of the same size; the iron side sinks → magnesium is far
//           lighter (low density) · metal balls Al + Cu + Mg + Mn melt into one ingot: duralumin; Al + Mg: magnalium ·
//           a spark carries the alloy to a model aeroplane, a car and a gear: aircraft, cars, moving machine parts (tick 1).
//   FIRE    (dark) a burning splint lights a sparkler: dazzling white sparks (fireworks, flames) · the splint touches a dish
//           of flashlight powder: one blinding white flash (old camera flash) (tick 2).
//   METALS  a crucible of glowing molten metal with red oxygen balls in it; tongs drop magnesium in; the oxygen balls rush
//           to it and float up as white slag: a deoxidant · titanium chloride drips onto molten magnesium: titanium metal;
//           a spoon tips a green uranium compound onto it: uranium metal (tick 3).
//   BRICKS  a white heap of magnesium oxide and a brown heap of clay slide together, mix, and press into a pale brick; it
//           flies into the last gap of a furnace lining; the fire roars, the bricks glow but hold: refractory (tick 4).
//   MgSO₄   a jar of magnesium sulphate; a spark visits a roll of cloth, paper, soap, a medicine bottle (tick 5).
//   CALCIUM a crucible of molten steel with oxygen balls; calcium dropped in takes them out (steel castings); the same in
//           molten copper alloy; "used in steel making" (tick 6) · a gold calcium ball fills two jars: calcium fluoride
//           CaF₂, calcium hydride CaH₂; molten calcium frees uranium from its compound (tick 7) · a beaker of soil water:
//           blue litmus turns red (acidic); a spoon of lime (CaO) goes in; a new blue litmus stays blue: less acidic;
//           lime also softens water, cleans factory smoke, makes paper, sugar, glass (tick 8).
//   END     back on the table: the sparks visit each thing again, ✓ on each.
// Book points (all of (c)): Mg i low density → light, tough alloys duralumin (Al, Cu, Mg, Mn), magnalium (Al, Mg) for
// aircraft, cars, moving parts of machines · ii photographic flashlight powder, flames, fireworks · iii deoxidant in
// metallurgy, extraction of titanium and uranium · iv MgO mixed with clay → refractory bricks for furnace lining · v MgSO₄
// in textile, paper, soap, pharmaceutical industries · Ca i deoxidant in steel castings and copper alloys · ii making
// CaF₂ and CaH₂, extraction of uranium · iii lime (CaO) added to soil as fertilizer to decrease acidity; water softening,
// pollution control, pulp, paper, sugar, glass industries · iv steel making. List of uses to memorize → 🎮 game (COVERAGE_U8).
// §1 CHECK (sheets renders/lesson/d812*.jpg, s812*.jpg, scr812*.jpg): nothing missing ✓ · one question + bridges ✓ ·
// familiar hook (aeroplane, sparkler, sugar, glass) paid off at the end ✓ · every use: before → visible cause (balance,
// melting, splint, tongs, dropper, spoon, spark) → result on the thing ✓ · numbers as things (balance) ✓ · ≤ 3 labels a
// shot ✓ · one place at a time ✓ · camera moves ≥ 2 s ✓ · baked tables, dark for the fireworks ✓ · substances own colours
// (silver Mg, dark iron, glowing orange melt, red oxygen, white slag, brown clay, pale bricks, green uranium compound,
// blue / red litmus) ✓ · every screen ✓ · flicker 0 ✓.
import * as THREE from 'three';
import * as K from './kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

const TAN = Math.tan(16 * Math.PI / 180), ASP = 1.6, ADIR = [0, 0.45, 1], CDIR = [0, 1.2, 1];
let DOCK = 1e9;
/** a shot: the subject (look, w × h) seen along dir; the engine refits it to the real screen (fit = 6th element) */
function S(t, look, w, h, dir = ADIR, e) {
  h *= 1.14; look = [look[0], look[1] + 0.05 * h, look[2]];        // headroom: the caption floats just above the subject (capNear)
  const dk = t >= DOCK, d = V(...dir).normalize(), dist = Math.max(h / 2 / TAN, (dk ? w / (1 - K.DOCK_W) : w) / 2 / (TAN * ASP)) * 1.1;
  const pos = V(...look).addScaledVector(d, dist).toArray(), fit = { look, w, h, dir, dock: dk ? K.DOCK_W : 0 };
  return dk ? [t, ...K.dockShot(pos, look), undefined, e, fit] : [t, pos, look, undefined, e, fit];
}

// ---------------------------------------------------------------- places (stations 10 apart)
const HOOK = [['aeroplane', -0.8, 0.3], ['sparkler (fireworks)', -0.3, 0.5], ['sugar', 0.28, 0.12], ['glass', 0.78, 0.33]];   // name, x, height
const DMG = V(-0.14, 0, 0.32), DCA = V(0.2, 0, 0.32);                     // the dish of magnesium, the dish of calcium
const BAL = 9.45, MIXX = 10.2, USE = [10.85, 11.3, 11.7];
const SPX = 19.85, FDX = 20.35;
const LAD = 29.4, TIX = 30.3, UX = 31.1, CRU = 0.632;
const HEAPX = 39.5, FUR = 40.3;
const JARX = 49.25, ROW = [49.82, 50.3, 50.78, 51.22];
const LS = 59.6, LC = 60.45;
const DISH = 69.35, JARS = [69.85, 70.3], CRX = 71.75;
const BAG = 79.15, BKL = 79.7, ROW2 = [80.4, 80.85, 81.3, 81.7, 82.1];

// ---------------------------------------------------------------- time (every camera move ≥ 2 s)
const T = { name: 0.6, spark: 7.0, ask: 11.2, card: 14.0 };
DOCK = T.card + 5.0;
const A0 = DOCK + 2.5, AD = A0 + 6.5, AM = AD + 5.0, AU = AM + 4.5, AEND = AU + 7.0;
const F0 = AEND, FL = F0 + 8.0, FEND = FL + 6.0;
const D0 = FEND, TI = D0 + 10.5, UU = TI + 8.5, DEND = UU + 8.5;
const B0 = DEND, BEND = B0 + 14;
const S0 = BEND, SEND = S0 + 12.5;
const C0 = SEND, CC = C0 + 9.0, SM = CC + 6.5, CEND = SM + 4.5;
const K0 = CEND, KU = K0 + 8.0, KEND = KU + 8.5;
const L0 = KEND, L1 = L0 + 12.5, LEND = L1 + 12.0;
const END = LEND; T.done = END + 12;
const INTRO = [T.card, DOCK];
const TICKS = [[AEND - 0.6, 0], [FEND - 0.6, 1], [DEND - 0.6, 2], [BEND - 0.6, 3], [SEND - 0.6, 4], [CEND - 0.6, 5], [KEND - 0.6, 6], [LEND - 0.6, 7]];

const captions = [
  [0.3, T.spark - 0.2, 'Aeroplanes, fireworks, sugar, glass…'],
  [T.spark - 0.2, T.ask, 'Magnesium and calcium help make them'],
  [T.ask, T.card, 'But both are very reactive metals!'],
  [T.card, DOCK, 'What jobs do magnesium and calcium do?'],
  [DOCK, A0 + 0.4, 'Magnesium first'],
  [A0 + 0.4, A0 + 3.6, 'Same size: magnesium or iron?'],
  [A0 + 3.6, AD, 'Magnesium is far lighter: low density ✓'],
  [AD, AM, 'With aluminium, copper, manganese: duralumin'],
  [AM, AU, 'With aluminium alone: magnalium'],
  [AU, AEND, 'Light, tough alloys: aircraft, cars, machines ✓'],
  [F0, F0 + 2.6, 'Fireworks and sparklers burn magnesium'],
  [F0 + 2.6, FL, 'Its flame: dazzling white sparks ✓'],
  [FL, FL + 2.8, 'Flashlight powder for old cameras…'],
  [FL + 2.8, FEND, '…one blinding white flash ✓'],
  [D0, D0 + 2.2, 'Molten metal often holds oxygen'],
  [D0 + 2.2, D0 + 6.4, 'Drop in magnesium: it grabs the oxygen'],
  [D0 + 6.4, TI, 'Oxygen removed: a deoxidant ✓'],
  [TI, UU, 'It frees titanium from titanium chloride'],
  [UU, DEND, 'And uranium from its compound ✓'],
  [B0, B0 + 4.2, 'Magnesium oxide (MgO) mixed with clay…'],
  [B0 + 4.2, B0 + 7.6, '…makes bricks to line a furnace'],
  [B0 + 7.6, BEND, 'They stand fierce heat: refractory bricks ✓'],
  [S0, S0 + 2.4, 'Magnesium sulphate (MgSO₄)'],
  [S0 + 2.4, SEND, 'For cloth, paper, soap and medicines ✓'],
  [C0, C0 + 2.2, 'Now calcium: it cleans metals too'],
  [C0 + 2.2, CC, 'It takes the oxygen out of steel'],
  [CC, SM, 'And out of copper alloys ✓'],
  [SM, CEND, 'Calcium is used in steel making ✓'],
  [K0, K0 + 4.4, 'It makes calcium fluoride (CaF₂)…'],
  [K0 + 4.4, KU, '…and calcium hydride (CaH₂)'],
  [KU, KEND, 'It frees uranium too ✓'],
  [L0, L0 + 4.6, 'Acidic soil turns blue litmus red'],
  [L0 + 4.6, L0 + 7.6, 'Add lime (CaO), a calcium compound'],
  [L0 + 7.6, L1, 'Less acidic: blue litmus stays blue ✓'],
  [L1, L1 + 5.5, 'Lime also softens water, cleans smoke…'],
  [L1 + 5.5, LEND, '…and helps make paper, sugar, glass ✓'],
  [END, END + 4.5, 'Aeroplanes, fireworks, sugar, glass…'],
  [END + 4.5, END + 8.5, 'Magnesium and calcium help make them'],
  [END + 8.5, T.done, 'Reactive metals, hard at work ✓'],
];

// ---------------------------------------------------------------- camera
const HW = (t, k = 1, e) => S(t, [-0.02, 0.26, 0.05], 2.15 * k, 0.8 * k, ADIR, e);
const CRUC = (t, x, k = 1, e) => S(t, [x, CRU + 0.1, 0], 0.62 * k, 0.56 * k, CDIR, e);
const TRI = (t, x, k = 1) => S(t, [x, 0.6, 0], 0.95 * k, 1.15 * k);
const cams = [
  HW(0, 1.04), HW(T.spark - 0.5, 1.0), S(T.ask, [0.03, 0.12, 0.3], 1.0, 0.5), S(T.card, [0.03, 0.12, 0.28], 1.05, 0.52), S(DOCK, [-0.02, 0.3, 0.05], 2.2, 0.95), S(A0 - 0.05, [-0.02, 0.3, 0.05], 2.1, 0.9),
  // alloys: the balance, the melting balls, the things made of the alloy
  S(A0, [BAL, 0.3, 0], 0.85, 0.72), S(AD - 2.2, [BAL, 0.28, 0], 0.8, 0.68), S(AD, [MIXX, 0.15, 0.02], 0.72, 0.44), S(AU - 0.4, [MIXX, 0.15, 0.02], 0.68, 0.42),
  S(AU + 2.0, [USE[1], 0.22, 0], 1.45, 0.62), S(AEND - 0.05, [USE[1], 0.22, 0], 1.4, 0.6),
  // fireworks (dark): the sparkler, then the flash powder
  S(F0, [SPX, 0.32, 0], 0.8, 0.8), S(F0 + 3.0, [SPX, 0.42, 0], 0.62, 0.62), S(FL - 2.0, [SPX + 0.1, 0.36, 0], 0.7, 0.62), S(FL, [FDX, 0.18, 0], 0.8, 0.6), S(FEND - 0.05, [FDX, 0.2, 0], 0.75, 0.58),
  // metallurgy: deoxidant, titanium, uranium
  TRI(D0, LAD), CRUC(D0 + 2.0, LAD, 1.04), CRUC(TI - 2.2, LAD, 0.98), TRI(TI, TIX), CRUC(TI + 2.4, TIX, 1.02), CRUC(UU - 0.1, TIX, 0.97), CRUC(UU + 2.0, UX, 1.02), CRUC(DEND - 0.05, UX, 0.96),
  // bricks: the two heaps, the brick flies to the furnace
  S(B0, [HEAPX, 0.1, 0.05], 0.75, 0.5), S(B0 + 4.0, [HEAPX, 0.1, 0.05], 0.7, 0.48), S(B0 + 6.0, [(HEAPX + FUR) / 2, 0.2, 0.05], 1.35, 0.68), S(B0 + 8.2, [FUR, 0.2, 0.12], 0.85, 0.62), S(BEND - 0.05, [FUR, 0.2, 0.12], 0.8, 0.58),
  // magnesium sulphate and its four users
  S(S0, [JARX + 0.25, 0.2, 0], 0.95, 0.6), S(S0 + 2.4, [(JARX + ROW[1]) / 2, 0.2, 0], 1.35, 0.56), S(S0 + 5.6, [(JARX + ROW[1]) / 2, 0.2, 0], 1.3, 0.55),
  S(S0 + 7.6, [(ROW[1] + ROW[3]) / 2, 0.2, 0], 1.3, 0.55), S(SEND - 0.05, [(ROW[1] + ROW[3]) / 2, 0.2, 0], 1.25, 0.53),
  // calcium cleans steel and copper alloys
  TRI(C0, LS), CRUC(C0 + 2.0, LS, 1.04), CRUC(CC - 0.1, LS, 0.98), CRUC(CC + 2.0, LC, 1.04), CRUC(SM - 0.1, LC, 0.98), S(SM + 2.0, [(LS + LC) / 2, 0.55, 0], 1.6, 1.15), S(CEND - 0.05, [(LS + LC) / 2, 0.55, 0], 1.55, 1.1),
  // calcium's compounds, then uranium
  S(K0, [(DISH + JARS[1]) / 2, 0.2, 0.05], 1.3, 0.6), S(KU - 2.2, [(DISH + JARS[1]) / 2, 0.2, 0.05], 1.25, 0.58), TRI(KU, CRX), CRUC(KU + 2.4, CRX, 1.02), CRUC(KEND - 0.05, CRX, 0.96),
  // lime on acidic soil, then lime's other jobs
  S(L0, [BKL - 0.05, 0.45, 0], 1.0, 0.95), S(L0 + 4.4, [(BAG + BKL) / 2, 0.4, 0], 1.35, 0.95), S(L0 + 7.4, [BKL, 0.45, 0], 0.95, 0.95), S(L1 - 0.05, [BKL, 0.45, 0], 0.9, 0.9),
  S(L1 + 2.0, [ROW2[1], 0.3, 0], 1.35, 0.75), S(L1 + 5.6, [ROW2[1], 0.3, 0], 1.3, 0.72), S(L1 + 7.6, [ROW2[3], 0.24, 0], 1.25, 0.6), S(LEND - 0.05, [ROW2[3], 0.24, 0], 1.2, 0.58),
  // END: the table again
  HW(END, 1.04), HW(T.done, 0.98),
];

export default {
  capNear: true, oneText: true,
  duration: T.done,
  captions,
  cams,

  build({ scene, cam, R }) {
    const beats = [], fires = [];
    const ST = K.studio({ scene, R }, '812', { dark: (t) => t >= F0 - 0.05 && t < FEND - 0.05 });   // FIRST: models read the look
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
    const piece = (s, mat = metalMat(s)) => (s === 'Mg' ? K.ribbonCoil(0.03, 3, mat) : K.lump(0.035, mat, 7, 0.7));
    /** tongs bring something down from above to `to` (arrive m0+1.2), let go at m0+1.4, rise away by m0+2.4 */
    const carry = (tg, t, m0, to) => {
      tg.visible = t > m0 && t < m0 + 2.4; if (!tg.visible) return;
      const top = to.clone().add(V(0, 1.1, 0));
      tg.position.copy(t < m0 + 1.2 ? top.lerp(to, 1 - (1 - span(t, m0, m0 + 1.2)) ** 2) : t < m0 + 1.5 ? to.clone() : to.clone().lerp(top, easeIn(span(t, m0 + 1.5, m0 + 2.4))));
      tg.userData.set(lerp(0.03, 0.08, span(t, m0 + 1.35, m0 + 1.5)));
    };
    const held = (t, m0, to) => (t < m0 + 1.2 ? to.clone().add(V(0, 1.1 * (1 - span(t, m0, m0 + 1.2)) ** 2, 0)) : to.clone());
    /** a gold spark that leaps along an arc a → b between t0 and t1 (a glowing trail behind it) */
    const spark = () => { const g = add(new THREE.Group()), s = K.sparkle(0xffd27a, 0.16), b = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 12), M.glow(0xffc54a, 2.5)); g.add(s, b);
      const trail = Array.from({ length: 6 }, (_, i) => add(K.sparkle(0xffc54a, 0.1 - i * 0.012))); return { g, trail }; };
    const fly = (sp, t, t0, t1, a, b, lift = 0.35) => {
      const on = t > t0 && t < t1; sp.g.visible = on; sp.trail.forEach((p, i) => { const u = span(t - (i + 1) * 0.05, t0, t1); p.visible = on && u > 0 && u < 1; p.position.copy(K.arc(a, b, lift, ease(u))); });
      if (on) sp.g.position.copy(K.arc(a, b, lift, ease(span(t, t0, t1))));
    };
    /** a crucible on a tripod over a burner; returns the burner flame */
    const rig = (x, r = 0.13, h = 0.11) => { add(K.tripod(0.62, 0.15), x, 0, 0); add(K.crucible(r, h), x, CRU, 0); const b = add(K.burner(), x, 0, 0); b.userData.flame.scale.setScalar(0.45); fires.push(b.userData.flame); return b.userData.flame; };
    /** a melt cleaned by a metal: red oxygen balls in a glowing molten pool rush to the dropped metal and float up as white slag */
    const deox = (x, t0, metal, meltCol, names, end = t0 + 9.6) => {
      rig(x, 0.15, 0.13);
      const pm = new THREE.MeshStandardMaterial({ color: 0x3a2010, emissive: meltCol, emissiveIntensity: 1.4, roughness: 0.4 });
      const pool = add(K.solid(new THREE.CylinderGeometry(0.1, 0.092, 0.03, 32), pm, { outline: false }), x, CRU + 0.045, 0);
      const om = M.gloss(0xe0483c), oxy = Array.from({ length: 9 }, (_, i) => ({ o: add(new THREE.Mesh(new THREE.SphereGeometry(0.011, 12, 8), om)), a: K.hash(i, 1) * 6.283, r: 0.03 + 0.055 * K.hash(i, 2) }));
      const slag = add(K.lump(0.045, M.matte(0xf2f0ea, 0.9), 31 + Math.round(x), 0.35, 0.5), x + 0.02, CRU + 0.064, 0.01);
      const tg = add(K.tongs(0.6)), mp = add(piece(metal)), DROP = V(x - 0.01, CRU + 0.13, 0.01);
      const lMelt = tag(names[0], 0.05, '#ffb27a', x, CRU + 0.32, 0.05), lM = tag(metal === 'Mg' ? 'magnesium' : 'calcium', 0.05, '#ffffff', x + 0.26, CRU + 0.24, 0.05);
      const lOk = tag(names[1], 0.055, '#ffffff', x, CRU + 0.32, 0.05);
      beats.push((t) => {
        const m0 = t0 + 1.4; carry(tg, t, m0, DROP);
        const f = K.drop(t, m0 + 1.4, DROP.y, CRU + 0.06, 0.3, 0.01), go = ease(span(t, m0 + 2.0, m0 + 5.0));
        mp.position.copy(t < m0 + 1.4 ? held(t, m0, DROP) : V(DROP.x, f.y, DROP.z)); mp.visible = t > m0 && go < 0.99; mp.scale.setScalar(Math.max(1e-4, 1 - 0.7 * go));
        oxy.forEach((q, i) => {
          const u = ease(span(t, m0 + 1.9 + i * 0.12, m0 + 3.6 + i * 0.12)), w = 0.008 * Math.sin(t * 3 + i);
          const home = V(x + Math.cos(q.a + t * 0.4) * q.r + w, CRU + 0.06, Math.sin(q.a + t * 0.4) * q.r), to = V(x + 0.02 + 0.02 * Math.cos(i * 2.4), CRU + 0.075, 0.01 + 0.02 * Math.sin(i * 2.4));
          q.o.position.copy(home.lerp(to, u)); q.o.visible = t > t0 - 0.1 && u < 0.9;
        });
        const sl = ease(span(t, m0 + 2.6, m0 + 5.0)); slag.visible = sl > 0.01; slag.scale.setScalar(Math.max(1e-4, sl));
        pm.emissiveIntensity = 1.4 + 0.5 * sl;
        K.popIn(lMelt, t, t0 + 0.5, m0 + 1.0); K.popIn(lM, t, m0 + 1.2, m0 + 3.6); K.popIn(lOk, t, m0 + 4.6, end);
      });
    };
    /** a crucible of molten metal (Mg or Ca); a compound is dropped/tipped on it; a new metal grows, white salt round it */
    const free = (x, t0, metal, how, cmpName, cmpCol, outName, outCol) => {
      rig(x);
      const pool = add(K.solid(new THREE.CylinderGeometry(0.078, 0.072, 0.02, 32), new THREE.MeshPhysicalMaterial({ color: COL[metal][0], metalness: 0.8, roughness: 0.12, emissive: 0xff6a1a, emissiveIntensity: 0.25 }), { outline: false }), x, CRU + 0.024, 0);
      const spg = add(K.lump(0.055, M.matte(outCol, 0.85), 13 + Math.round(x), 0.7, 0.8), x, CRU + 0.04, 0), salt = add(K.lump(0.08, M.matte(0xf4f3ee, 0.9), 14 + Math.round(x), 0.35, 0.5), x, CRU + 0.025, 0);
      const fumes = add(K.smoke(6, 0xffffff), x, CRU + 0.1, 0); fumes.scale.setScalar(0.08);
      let tool, bits;
      if (how === 'drops') { tool = add(K.dropper(0.34)); bits = Array.from({ length: 4 }, () => add(new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 8), M.bubble()))); }
      else { tool = add(K.spoon(0.6)); const heap = K.lump(0.03, M.matte(cmpCol, 0.9), 41, 0.5, 0.5); heap.position.y = -0.04; tool.add(heap); tool.userData.heap = heap; bits = Array.from({ length: 8 }, () => add(new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 6), M.matte(cmpCol, 0.9)))); }
      const lP = tag(`molten ${metal === 'Mg' ? 'magnesium' : 'calcium'}`, 0.05, '#ffffff', x, CRU + 0.3, 0.05), lD = tag(cmpName, 0.05, '#cfe8ff', x + 0.05, CRU + 0.34, 0.05), lOut = tag(outName, 0.055, '#ffffff', x, CRU + 0.3, 0.05);
      beats.push((t) => {
        const dIn = ease(span(t, t0 + 0.6, t0 + 1.6)) * (1 - easeIn(span(t, t0 + 4.4, t0 + 5.4)));
        if (how === 'drops') {
          tool.position.set(x + 0.02, CRU + 0.2 + 1.0 * (1 - dIn), 0); tool.visible = dIn > 0.01;
          bits.forEach((d, i) => { const s0 = t0 + 1.9 + i * 0.55, u = span(t, s0, s0 + 0.35); d.visible = u > 0 && u < 1; d.position.set(x + 0.02, lerp(CRU + 0.2, CRU + 0.04, u * u), 0); });
        } else {
          const tip = ease(span(t, t0 + 1.8, t0 + 2.6)); tool.position.set(x - 0.03, CRU + 0.22 + 1.0 * (1 - dIn), 0); tool.rotation.z = -1.1 * tip; tool.visible = dIn > 0.01;
          tool.userData.heap.visible = tip < 0.6;
          bits.forEach((d, i) => { const s0 = t0 + 2.2 + i * 0.12, u = span(t, s0, s0 + 0.4); d.visible = u > 0 && u < 1; d.position.set(x - 0.02 + 0.03 * Math.sin(i * 2.1), lerp(CRU + 0.18, CRU + 0.04, u * u), 0.02 * Math.cos(i * 1.7)); });
        }
        const grow = ease(span(t, t0 + 2.3, t0 + 5.6));
        spg.scale.setScalar(Math.max(1e-4, grow)); spg.visible = grow > 0.01; salt.scale.setScalar(Math.max(1e-4, grow)); salt.visible = grow > 0.01;
        pool.scale.set(1 - 0.4 * grow, 1, 1 - 0.4 * grow);
        fumes.visible = t > t0 + 2.0 && t < t0 + 7; fumes.userData.update(t, 0.8 * (1 - span(t, t0 + 5.5, t0 + 7)));
        K.popIn(lP, t, t0 - 0.2, t0 + 1.4); K.popIn(lD, t, t0 + 1.6, t0 + 5.2); K.popIn(lOut, t, t0 + 5.6, t0 + 8.4);
      });
    };

    // ================================================================ HOOK / END · the table of familiar things
    {
      stage((t) => t < A0 - 0.05 || t >= END - 0.05); ST.bake(root, 'hook', 0, 2.6, 1.2);
      add(K.toyPlane(0.9), HOOK[0][1], 0, -0.02).rotation.y = 0.35;
      const pot = add(K.solid(new THREE.CylinderGeometry(0.05, 0.04, 0.08, 24).translate(0, 0.04, 0), M.matte(0x9a5a3a, 0.8)), HOOK[1][1], 0, 0);
      add(K.solid(new THREE.CylinderGeometry(0.044, 0.044, 0.01, 24), M.matte(0xcbb48a, 0.95), { outline: false }), HOOK[1][1], 0.072, 0);
      add(K.sparkler(0.42), HOOK[1][1], 0.06, 0); void pot;
      add(K.sugarCubes(), HOOK[2][1], 0, 0);
      add(K.glassBottle(1.05), HOOK[3][1], 0, -0.02);
      add(K.dish(0.1), DMG.x, 0, DMG.z); add(K.ribbonCoil(0.04, 3), DMG.x, 0.012, DMG.z);
      add(K.dish(0.1), DCA.x, 0, DCA.z); [[-0.025, 0.01], [0.025, -0.01], [0, 0.03]].forEach(([dx, dz], i) => add(K.lump(0.026, metalMat('Ca'), 3 + i, 0.7), DCA.x + dx, 0.03, DCA.z + dz));
      const names = HOOK.map(([n, x, h]) => tag(n, 0.05, '#ffffff', x, h + 0.13, 0.05));
      const lMg = tag('magnesium', 0.05, '#ffffff', DMG.x - 0.12, 0.17, DMG.z), lCa = tag('calcium', 0.05, '#ffffff', DCA.x + 0.1, 0.17, DCA.z);
      const sps = HOOK.map(() => spark());
      const ticks = HOOK.map(([, x, h]) => tag('✓', 0.06, '#7be08a', x, h + 0.13, 0.05));
      beats.push((t) => {
        names.forEach((l, i) => K.popIn(l, t, T.name + i * 1.5, t < END ? T.name + i * 1.5 + 2.6 : 0));
        K.popIn(lMg, t, T.spark - 0.6, T.card); K.popIn(lCa, t, T.spark + 1.3, T.card);
        const base = t < END ? T.spark : END + 0.4;
        HOOK.forEach(([, x, h], i) => { const t0 = base + i * 0.95, src = i < 2 ? DMG : DCA; fly(sps[i], t, t0, t0 + 0.85, src.clone().setY(0.08), V(x, h * 0.6, 0)); });
        ticks.forEach((l, i) => K.popIn(l, t, END + 0.4 + i * 0.95 + 0.85, 1e9));
      });
    }

    // ================================================================ Mg i · LIGHT ALLOYS
    {
      stage((t) => t >= A0 - 0.05 && t < AEND); ST.bake(root, 'alloy', 10.55, 2.9, 1.2);
      const bal = add(K.balance(0.6, 0.42), BAL, 0, 0), [pl, pr] = bal.userData.pans;
      const blk = (mat) => K.solid(new THREE.BoxGeometry(0.08, 0.08, 0.08).translate(0, 0.04, 0), mat);
      const bMg = blk(new THREE.MeshPhysicalMaterial({ color: 0xc9cdd3, metalness: 0.85, roughness: 0.25, clearcoat: 0.5 })), bFe = blk(M.metal(0x4a4e55, 0.45));
      pl.add(bMg); pr.add(bFe);
      const lMg = tag('magnesium', 0.05, '#ffffff', BAL - 0.3, 0.42, 0.05), lFe = tag('iron', 0.05, '#ffffff', BAL + 0.3, 0.42, 0.05), lLight = tag('far lighter ✓', 0.055, '#ffffff', BAL - 0.3, 0.42, 0.05);
      // the alloy: metal balls melt together into one ingot
      const ball = (sym, col) => { const g = add(new THREE.Group()); g.add(K.solid(new THREE.SphereGeometry(0.06, 28, 18), new THREE.MeshPhysicalMaterial({ color: col, metalness: 0.8, roughness: 0.25 })));
        const l = K.label(sym, 0.065, '#1b2030', 800); l.position.z = 0.062; l.renderOrder = 22; g.add(l); return g; };
      const SET = [[['Al', 0xc9ced6], ['Cu', 0xc8743a], ['Mg', 0xb4b8bf], ['Mn', 0x8c8f99]], [['Al', 0xc9ced6], ['Mg', 0xb4b8bf]]];
      const T0 = [AD + 0.3, AM + 0.3];
      const alloyMat = new THREE.MeshPhysicalMaterial({ color: 0xd2d6dc, metalness: 0.9, roughness: 0.2, clearcoat: 0.6 });
      const groups = SET.map((set, k) => set.map(([s, c], i) => ({ b: ball(s, c), x: MIXX + (i - (set.length - 1) / 2) * 0.16, k })));
      const ingots = [0, 1].map(() => add(K.ingot(alloyMat, 0.3, 0.08, 0.13, 0.8)));
      const lDur = tag('duralumin: Al, Cu, Mg, Mn', 0.05, '#ffffff', MIXX, 0.25, 0.05), lMag = tag('magnalium: Al, Mg', 0.05, '#ffffff', MIXX, 0.25, 0.05);
      add(K.toyPlane(0.85), USE[0], 0, -0.02).rotation.y = 0.35; add(K.toyCar(), USE[1], 0, 0).rotation.y = -0.3; add(K.gear(0.1), USE[2], 0, 0);
      const lU = [tag('aircraft', 0.05, '#ffffff', USE[0], 0.42, 0.05), tag('cars', 0.05, '#ffffff', USE[1], 0.32, 0.05), tag('machine parts', 0.05, '#ffffff', USE[2] + 0.05, 0.2, 0.05)];
      const sps = USE.map(() => spark());
      beats.push((t) => {
        // the blocks come down into the pans, then the beam tips: iron is far heavier
        [[bMg, A0 + 0.6], [bFe, A0 + 1.4]].forEach(([b, t0]) => { const f = K.drop(t, t0, 0.6, 0.013, 0.4, 0.01); b.position.y = f.y; b.visible = t > t0 - 0.05; });
        bal.userData.tilt(0.24 * ease(span(t, A0 + 2.2, A0 + 3.6)) + 0.03 * Math.sin(Math.PI * span(t, A0 + 3.6, A0 + 4.4)));
        K.popIn(lMg, t, A0 + 0.9, A0 + 4.0); K.popIn(lFe, t, A0 + 1.7, AD - 0.4); K.popIn(lLight, t, A0 + 4.3, AD - 0.4);
        // the balls drop in, roll together and melt into an ingot
        groups.forEach((set, k) => set.forEach(({ b, x }, i) => {
          const t0 = T0[k], fall = K.drop(t, t0 + i * 0.25, 0.5, 0.06, 0.35, 0.02), meet = ease(span(t, t0 + 1.8, t0 + 3.0));
          b.position.set(lerp(x, MIXX, meet), fall.y, 0.02); b.visible = t > t0 + i * 0.25 && meet < 0.98 && t < (k ? AU : AM); b.scale.setScalar(Math.max(1e-4, 1 - 0.6 * meet));
        }));
        ingots.forEach((g, k) => {
          const t0 = T0[k], grow = ease(span(t, t0 + 2.6, t0 + 3.4));
          const away = ease(span(t, (k ? AU : AM) - 0.2, (k ? AU : AM) + 0.6));
          g.position.set(MIXX + 0.4 * away * (k ? 1 : -1), 0.002, 0.02 - 0.25 * away); g.scale.setScalar(Math.max(1e-4, grow * (1 - 0.3 * away))); g.visible = grow > 0.01 && !(k === 0 && t > AU + 1.0);
        });
        K.popIn(lDur, t, AD + 3.6, AM - 0.2); K.popIn(lMag, t, AM + 3.4, AU - 0.2);
        // a spark carries the alloy to each thing made of it
        USE.forEach((x, i) => { const t0 = AU + 1.8 + i * 1.5; fly(sps[i], t, t0, t0 + 1.0, V(MIXX + 0.4, 0.08, -0.23), V(x, 0.15, 0)); K.popIn(lU[i], t, t0 + 0.9, AEND); });
      });
    }

    // ================================================================ Mg ii · FIREWORKS AND FLASH (dark)
    {
      stage((t) => t >= F0 - 0.05 && t < FEND);
      add(K.solid(new THREE.CylinderGeometry(0.05, 0.04, 0.08, 24).translate(0, 0.04, 0), M.matte(0x9a5a3a, 0.8)), SPX, 0, 0);
      add(K.solid(new THREE.CylinderGeometry(0.044, 0.044, 0.01, 24), M.matte(0xcbb48a, 0.95), { outline: false }), SPX, 0.072, 0);
      const sk = add(K.sparkler(0.45), SPX, 0.06, 0);
      add(K.dish(0.11), FDX, 0, 0); const powder = add(K.lump(0.06, M.matte(0x8a8e94, 0.95), 17, 0.35, 0.5), FDX, 0.012, 0);
      const splint = add(new THREE.Group()), wood = K.solid(new THREE.CylinderGeometry(0.004, 0.004, 0.5, 6).translate(0, 0.25, 0), M.matte(0xc9a56a, 0.8)); splint.add(wood);   // its burning tip is the group's origin
      const sf = fire(0xffa21a, 0.08, { core: 0xfff0c0, embers: false }); splint.add(sf); splint.rotation.z = -0.7;
      const sparkF = add(fire(0xffffff, 0.09, { core: 0xffffff, embers: false }));
      const stars = Array.from({ length: 14 }, (_, i) => ({ s: add(K.sparkle(0xffffff, 0.1)), a: K.hash(i, 3) * 6.283, b: K.hash(i, 4) - 0.2 }));
      const flash = add(new THREE.PointLight(0xffffff, 0, 5, 2), FDX, 0.25, 0.25), glow = add(K.glowSprite(0xffffff, 1.2), FDX, 0.12, 0.02);
      const sm = add(K.smoke(8, 0xd8d8d8), FDX, 0.05, 0); sm.scale.setScalar(0.12);
      const lS = tag('sparkler', 0.05, '#ffffff', SPX + 0.18, 0.2, 0.05), lW = tag('dazzling white sparks ✓', 0.055, '#ffffff', SPX, 0.66, 0.05);
      const lP = tag('flashlight powder', 0.05, '#ffffff', FDX, 0.16, 0.05), lF = tag('a blinding white flash ✓', 0.055, '#ffffff', FDX, 0.4, 0.05);
      beats.push((t) => {
        // the burning splint: it comes to the sparkler's tip, then to the powder
        const tipW = sk.userData.tip().add(sk.position);
        const a1 = ease(span(t, F0 + 0.8, F0 + 2.0)), b1 = easeIn(span(t, F0 + 2.6, F0 + 3.4)), a2 = ease(span(t, FL - 1.2, FL)), b2 = easeIn(span(t, FL + 0.4, FL + 1.2));
        const P1 = V(SPX + 0.36, 0.55 + 0.6, 0.05), Q1 = V(SPX + 0.02, sk.position.y + 0.45 + 0.01, 0.02), Q2 = V(FDX + 0.02, 0.07, 0.02);
        let p = P1.clone().lerp(Q1, a1).lerp(P1, b1); if (t > FL - 1.3) p = P1.clone().setX(FDX + 0.3).lerp(Q2, a2).lerp(V(FDX + 0.3, 1.2, 0.05), b2);
        splint.position.copy(p); splint.visible = (t > F0 + 0.8 && t < F0 + 3.4) || (t > FL - 1.2 && t < FL + 1.2);
        sf.position.set(0.0, 0.0, 0); sf.scale.setScalar(1 + 0.15 * Math.sin(t * 17));
        // the sparkler burns down, throwing white sparks
        const burn = span(t, F0 + 2.0, FL - 0.4); sk.userData.burn(burn);
        const on = t > F0 + 2.0 && t < FL - 0.4;
        sparkF.visible = on; sparkF.position.copy(tipW); sparkF.scale.setScalar(1 + 0.25 * Math.sin(t * 23));
        stars.forEach((q, i) => { const k = ((t * 1.6 + i * 0.37) % 1); q.s.visible = on && k < 0.8; const r = 0.05 + 0.18 * k; q.s.position.copy(tipW).add(V(Math.cos(q.a + i) * r, q.b * r * 1.2 - 0.12 * k * k, Math.sin(q.a) * r * 0.6)); q.s.scale.setScalar(0.1 * (1 - k) + 1e-4); q.s.material.rotation = t * 3 + i; });
        // the flash powder: one blinding flash, then smoke
        const fl = Math.max(0, 1 - Math.abs(t - FL - 0.25) / 0.5) ** 1.5; flash.intensity = 40 * fl; glow.visible = fl > 0.01; glow.scale.setScalar(1.6 * fl + 1e-4);
        powder.visible = t < FL + 0.2; sm.visible = t > FL + 0.1 && t < FEND; sm.userData.update(t, 0.8 * (1 - span(t, FL + 3.0, FEND)));
        K.popIn(lS, t, F0 + 0.4, F0 + 2.6); K.popIn(lW, t, F0 + 3.0, FL - 1.4); K.popIn(lP, t, FL - 1.4, FL + 0.2); K.popIn(lF, t, FL + 0.8, FEND);
      });
    }

    // ================================================================ Mg iii · DEOXIDANT, TITANIUM, URANIUM
    stage((t) => t >= D0 - 0.05 && t < DEND); ST.bake(root, 'metal', 30.25, 2.6, 1.2);
    deox(LAD, D0, 'Mg', 0xff7a1a, ['molten metal with oxygen in it', 'oxygen removed: a deoxidant ✓']);
    free(TIX, TI + 0.8, 'Mg', 'drops', 'titanium chloride (TiCl₄)', 0xffffff, 'titanium metal ✓', 0x7d8288);
    free(UX, UU + 0.8, 'Mg', 'spoon', 'a uranium compound', 0x7fbf4a, 'uranium metal ✓', 0x55595f);

    // ================================================================ Mg iv · FURNACE BRICKS
    {
      stage((t) => t >= B0 - 0.05 && t < BEND); ST.bake(root, 'brick', 39.95, 1.9, 1.2);
      add(K.solid(new THREE.BoxGeometry(0.42, 0.02, 0.26).translate(0, 0.01, 0), M.matte(0x8a6a4a, 0.8)), HEAPX, 0, 0.02);
      const mgoM = new THREE.MeshStandardMaterial({ color: 0xf4f3ee, roughness: 0.95 }), clayM = new THREE.MeshStandardMaterial({ color: 0x9a5a34, roughness: 0.9 });
      const hM = add(K.lump(0.07, mgoM, 3, 0.45, 0.5), HEAPX - 0.1, 0.02, 0.02), hC = add(K.lump(0.07, clayM, 4, 0.45, 0.5), HEAPX + 0.1, 0.02, 0.02);
      const fu = add(K.furnace(0.3, 0.42), FUR, 0, -0.05), gap = fu.userData.gap, [bw, bh, bd] = fu.userData.brickSize;
      const brick = add(K.solid(new THREE.BoxGeometry(bw, bh, bd), new THREE.MeshStandardMaterial({ color: 0xe8dfca, roughness: 0.9, emissive: 0xff4a10, emissiveIntensity: 0 })));
      const ff = add(fire(0xff8a1a, 0.22, { core: 0xfff0c0 }), FUR, 0.03, -0.1);
      const cream = new THREE.Color(0xe8dfca), white = new THREE.Color(0xf4f3ee), brown = new THREE.Color(0x9a5a34);
      const lMgO = tag('magnesium oxide (MgO)', 0.05, '#ffffff', HEAPX - 0.14, 0.25, 0.05), lClay = tag('clay', 0.05, '#ffd0a8', HEAPX + 0.13, 0.16, 0.05);
      const lBrick = tag('a fire brick', 0.05, '#ffffff', HEAPX, 0.2, 0.05), lFur = tag('furnace lining', 0.05, '#ffffff', FUR, 0.44, 0.1), lOk = tag('it stands the heat ✓', 0.055, '#ffffff', FUR, 0.44, 0.1);
      const GAPW = gap.pos.clone().add(fu.position);
      beats.push((t) => {
        const mix = ease(span(t, B0 + 2.0, B0 + 3.6)), press = ease(span(t, B0 + 3.8, B0 + 5.0));
        hM.position.x = HEAPX - 0.1 + 0.09 * mix; hC.position.x = HEAPX + 0.1 - 0.09 * mix;
        mgoM.color.copy(white).lerp(cream, mix); clayM.color.copy(brown).lerp(cream, mix);
        [hM, hC].forEach((h) => { h.scale.setScalar(Math.max(1e-4, 1 - press)); h.visible = press < 0.99; });
        const fly = ease(span(t, B0 + 5.6, B0 + 7.2)), H0 = V(HEAPX, 0.02 + bh / 2, 0.02);
        brick.position.copy(K.arc(H0, GAPW, 0.4, fly)); brick.rotation.set(0, 0, gap.rotZ * fly); brick.scale.setScalar(Math.max(1e-4, back(span(t, B0 + 3.9, B0 + 5.0))));
        brick.visible = t > B0 + 3.9;
        const roar = back(span(t, B0 + 7.6, B0 + 8.2)); ff.visible = roar > 0.01; ff.scale.setScalar(Math.max(1e-4, roar * (1 + 0.2 * Math.sin(t * 13))));
        const heat = ease(span(t, B0 + 8.2, B0 + 11)); fu.userData.bricks.emissiveIntensity = 0.35 * heat; brick.material.emissiveIntensity = 0.35 * heat;
        K.popIn(lMgO, t, B0 + 0.5, B0 + 3.4); K.popIn(lClay, t, B0 + 1.1, B0 + 3.4); K.popIn(lBrick, t, B0 + 4.6, B0 + 6.0);
        K.popIn(lFur, t, B0 + 6.2, B0 + 8.8); K.popIn(lOk, t, B0 + 9.2, BEND);
      });
    }

    // ================================================================ Mg v · MAGNESIUM SULPHATE: cloth, paper, soap, medicines
    {
      stage((t) => t >= S0 - 0.05 && t < SEND); ST.bake(root, 'sulf', 50.2, 2.7, 1.2);
      add(K.compoundJar('crystals', 0xf6f7f8), JARX, 0, 0);
      add(K.clothRoll(), ROW[0], 0, 0).rotation.y = 0.2; add(K.paperStack(), ROW[1], 0, 0).rotation.y = -0.2; add(K.soapBar(0xf2d6e4), ROW[2], 0, 0).rotation.y = 0.3; add(K.medicineBottle(), ROW[3], 0, 0);
      const lJ = tag('magnesium sulphate (MgSO₄)', 0.05, '#ffffff', JARX + 0.15, 0.4, 0.05);
      const NAMES = [['cloth', 0.22], ['paper', 0.16], ['soap', 0.18], ['medicines', 0.32]], lR = NAMES.map(([n, h], i) => tag(n, 0.05, '#ffffff', ROW[i], h, 0.05));
      const sps = ROW.map(() => spark());
      beats.push((t) => {
        K.popIn(lJ, t, S0 + 0.5, S0 + 4.0);
        ROW.forEach((x, i) => { const t0 = S0 + [2.6, 4.4, 7.8, 9.6][i]; fly(sps[i], t, t0, t0 + 1.0, V(JARX, 0.25, 0), V(x, 0.12, 0)); K.popIn(lR[i], t, t0 + 0.9, i < 1 ? t0 + 4.6 : SEND); });
      });
    }

    // ================================================================ Ca i, iv · STEEL CASTINGS, COPPER ALLOYS, STEEL MAKING
    {
      stage((t) => t >= C0 - 0.05 && t < CEND); ST.bake(root, 'cast', 60.02, 1.9, 1.2);
      deox(LS, C0 + 0.3, 'Ca', 0xff8a2a, ['molten steel with oxygen in it', 'clean steel ✓'], CC - 0.3);
      deox(LC, CC + 0.2, 'Ca', 0xff5a2a, ['molten copper alloy', 'clean copper alloy ✓'], SM + 1.2);
      const lSteel = tag('steel making ✓', 0.06, '#ffe08a', (LS + LC) / 2, 1.05, 0.05);
      beats.push((t) => K.popIn(lSteel, t, SM + 1.6, CEND));
    }

    // ================================================================ Ca ii · CaF₂, CaH₂, URANIUM
    {
      stage((t) => t >= K0 - 0.05 && t < KEND); ST.bake(root, 'cacmp', 70.5, 3.2, 1.2);
      add(K.dish(0.12), DISH, 0, 0.05); [[-0.03, 0.02], [0.03, -0.01], [0, -0.03]].forEach(([dx, dz], i) => add(K.lump(0.028, metalMat('Ca'), 5 + i, 0.7), DISH + dx, 0.03, 0.05 + dz));
      const kinds = [['crystals', 0xf2f0fa, 'calcium fluoride (CaF₂)'], ['powder', 0xb8b6b0, 'calcium hydride (CaH₂)']];
      const jars = kinds.map(([k, c], i) => { const j = add(K.compoundJar(k, c), JARS[i], 0, -0.05); j.userData.fill(0); return j; });
      const labs = kinds.map(([, , n], i) => tag(n, 0.05, '#ffffff', JARS[i] + (i ? 0.1 : -0.05), 0.42, 0));
      const lCa = tag('calcium', 0.05, '#ffffff', DISH, 0.17, 0.1), sps = JARS.map(() => spark());
      beats.push((t) => {
        K.popIn(lCa, t, K0 + 0.3, K0 + 2.0);
        jars.forEach((j, i) => { const b = K0 + 1.4 + i * 3.0, out = ease(span(t, KU + 0.2 + i * 0.15, KU + 0.8 + i * 0.15)); j.scale.setScalar(Math.max(1e-4, 1 - out)); j.visible = out < 0.99; fly(sps[i], t, b, b + 1.1, V(DISH, 0.1, 0.05), V(JARS[i], 0.12, -0.05), 0.45); j.userData.fill(ease(span(t, b + 1.0, b + 1.9))); K.popIn(labs[i], t, b + 1.6, i ? KU - 0.3 : K0 + 4.6); });
      });
      free(CRX, KU + 0.8, 'Ca', 'spoon', 'a uranium compound', 0x7fbf4a, 'uranium metal ✓', 0x55595f);
    }

    // ================================================================ Ca iii · LIME: soil, water, smoke, paper, sugar, glass
    {
      stage((t) => t >= L0 - 0.05 && t < LEND); ST.bake(root, 'lime', 80.6, 3.6, 1.2);
      add(K.printBox(0.18, 0.26, 0.09, '#d9d3c2', ['LIME', 'CaO'], '#3a4048'), BAG, 0, 0).rotation.y = 0.25;
      add(K.beaker(0.2, 0.42), BKL, 0, 0); const sw = add(K.liquid(0.19, 0.26, 0x9a8a5a, 0.5), BKL, 0.05, 0);
      add(K.lump(0.15, M.matte(0x5a4030, 0.95), 9, 0.25, 0.5), BKL, 0.012, 0);
      const wCol = new THREE.Color(0x9a8a5a), wClear = new THREE.Color(0xb8b090);
      const sp = add(K.spoon(0.6)), lime = K.lump(0.03, M.matte(0xf6f5ef, 0.9), 51, 0.5, 0.5); lime.position.y = -0.04; sp.add(lime);
      const strips = [0, 1].map((i) => ({ p: add(K.paperStrip([[0, 0], [0.18, 0], [0.38, 0]], 0.055, 0x4a6fd0, i ? 0x4a6fd0 : 0xd9606c, 0.006)), tg: add(K.tongs(0.6)), x: BKL + (i ? 0.08 : -0.06), t0: i ? L0 + 7.4 : L0 + 0.8 }));
      const lSoil = tag('soil in water', 0.05, '#e8d8b0', BKL + 0.22, 0.2, 0.25), lRed = tag('turns red: acidic', 0.05, '#ff9aa4', BKL, 0.78, 0);
      const lLime = tag('lime (CaO)', 0.05, '#ffffff', BAG, 0.4, 0.05), lBlue = tag('stays blue: less acidic ✓', 0.055, '#9ec0ff', BKL, 0.78, 0);
      add(K.vial(0.07, 0.2), ROW2[0], 0, 0); add(K.liquid(0.062, 0.13, 0x5aa0d8, 0.4), ROW2[0], 0.02, 0);
      const fac = add(K.factory(), ROW2[1], 0, -0.05), smk = add(K.smoke(8, 0x6a6a6a), ROW2[1] + fac.userData.top.x, fac.userData.top.y, -0.05); smk.scale.setScalar(0.15);
      add(K.paperStack(), ROW2[2], 0, 0).rotation.y = 0.2; add(K.sugarCubes(), ROW2[3], 0, 0); add(K.glassBottle(), ROW2[4], 0, 0);
      const NAMES = [['softer water', 0.3], ['cleaner smoke', 0.72], ['paper', 0.16], ['sugar', 0.15], ['glass', 0.4]], lR = NAMES.map(([n, h], i) => tag(n, 0.05, '#ffffff', ROW2[i], h, 0.05));
      const sps = ROW2.map(() => spark());
      beats.push((t) => {
        strips.forEach(({ p, tg, x, t0 }, i) => {
          const top = V(x, 0.62, 0), pTop = top.clone().setY(1.6), out = i ? 1e9 : L0 + 4.4;
          const pp = t < t0 + 1.4 ? pTop.clone().lerp(top, 1 - (1 - span(t, t0, t0 + 1.4)) ** 2) : top.clone().lerp(pTop, easeIn(span(t, out, out + 0.8)));
          p.position.copy(pp).add(V(0, -0.42, 0)); tg.position.copy(pp).add(V(0, -0.02, 0)); tg.userData.set(0.012);
          p.visible = tg.visible = t > t0 && t < out + 0.8; p.userData.wet(0.3 * ease(span(t, t0 + 1.8, t0 + 3.6)));
        });
        let q = V(BAG, 1.3, 0);
        if (t < L0 + 5.4) q = q.lerp(V(BAG, 0.36, 0), ease(span(t, L0 + 4.4, L0 + 5.4)));
        else if (t < L0 + 6.4) q = K.arc(V(BAG, 0.36, 0), V(BKL - 0.03, 0.42, 0), 0.2, ease(span(t, L0 + 5.4, L0 + 6.4)));
        else q = V(BKL - 0.03, 0.42, 0).lerp(V(BKL - 0.03, 1.4, 0), easeIn(span(t, L0 + 7.0, L0 + 7.8)));
        const tipL = ease(span(t, L0 + 6.4, L0 + 6.9)); sp.position.copy(q); sp.rotation.z = -1.0 * tipL; sp.visible = t > L0 + 4.4 && t < L0 + 7.8; lime.visible = tipL < 0.5 && t > L0 + 5.2;
        sw.children[0].material.color.copy(wCol).lerp(wClear, ease(span(t, L0 + 6.6, L0 + 8.0)));
        K.popIn(lSoil, t, L0 + 0.3, L0 + 2.0); K.popIn(lRed, t, L0 + 3.0, L0 + 4.6); K.popIn(lLime, t, L0 + 4.6, L0 + 6.6); K.popIn(lBlue, t, L0 + 9.6, L1 - 0.2);
        // lime's other jobs; the factory smoke thins when lime cleans it
        smk.visible = true; smk.userData.update(t, 1 - 0.75 * ease(span(t, L1 + 3.0, L1 + 4.5)));
        ROW2.forEach((x, i) => { const t0 = L1 + [1.6, 3.2, 4.8, 7.8, 9.4][i]; fly(sps[i], t, t0, t0 + 0.9, V(BAG, 0.3, 0), V(x, 0.14, 0), 0.5); K.popIn(lR[i], t, t0 + 0.8, i < 2 ? t0 + 4.2 : LEND); });
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'What jobs do magnesium and calcium do?', intro: INTRO, ticks: TICKS,
      rows: [[0, '1 · Magnesium'], [1, 'light, tough alloys: aircraft, cars'], [1, 'flash powder, flames, fireworks'], [1, 'takes out oxygen; frees titanium, uranium'], [1, 'MgO bricks for furnaces'], [1, 'MgSO₄: cloth, paper, soap, medicines'],
        [0, '2 · Calcium'], [1, 'cleans steel and copper alloys'], [1, 'makes CaF₂, CaH₂; frees uranium'], [1, 'lime: soil, water, paper, sugar, glass']],
      short: ['alloys', 'fireworks', 'frees metals', 'furnace bricks', 'MgSO₄', 'steel', 'CaF₂, CaH₂, U', 'lime'] }));
    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));
    beats.push(() => { const nar = Math.min(1, (cam.aspect / 1.5) ** 0.7); tags.forEach((l) => { if (l.visible) l.scale.multiplyScalar(cam.position.distanceTo(l.position) * 2 * TAN * l.userData.frac * nar / 0.1); }); });

    return (t, dt) => { for (const b of beats) b(t, dt); };
  },
};
