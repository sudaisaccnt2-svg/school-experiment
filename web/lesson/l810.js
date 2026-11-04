// Lesson 810 · Magnesium and calcium (book pp. 232–233: Magnesium, (a) its position, Table 8.5; Calcium, Fig. 8.3,
// (a) its position, Table 8.6), v1 (2026-10-14). Built from SKILL §0 + the approved 805 v3 / 806 pattern and 807's
// atom → periodic-table move.
// THE QUESTION: "Which two metals hide in chalk, leaves and sea water?" → card: Magnesium · Calcium · What they are like.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//   HOOK    a table: chalk, a marble slab, a green leaf, a glass of sea water, named one by one; a metal tile rises out of
//           each: Ca from the chalk and the marble, Mg from the leaf and the sea water → two metals hide in them all,
//           never free → card · "magnesium first: where does it hide?".
//   MG WHERE  a slice of the ground with crystal pockets: dolomite (CaCO₃·MgCO₃), kieserite (MgSO₄), epsom salt (MgSO₄·7H₂O) · silicates: talc, asbestos ·
//           sea water: magnesium chlorides and bromides; shaken with soap, hard water gives no lather (magnesium makes
//           permanent hardness), pure water lathers · a green leaf: a chlorophyll molecule rises from it, magnesium at its
//           centre; the camera dives into its magnesium (tick 1).
//   MG PLACE  (dark) the magnesium atom: 12 protons (atomic number 12), shells 2, 8, 2, two outer electrons glow gold →
//           it shrinks into its tile: period 3, second place (after Na); group IIA, second place (after Be) (tick 2).
//   CA WHERE  limestone, marble, chalk: all calcium carbonate (CaCO₃) · gypsum: calcium sulphate (CaSO₄) · pure calcium
//           (Fig. 8.3) in a dish turns dull in the air: too reactive to be found free (tick 3).
//   CA PLACE  (dark) the calcium atom: 20 protons, 2, 8, 8, 2, two outer electrons → period 4, second place (after K);
//           group IIA, third place (after Be, Mg) (tick 4).
//   LIKE    a magnesium ribbon (silvery grey) and calcium (silvery white) on the table; bars rise behind them: density
//           1.74 / 1.55 g/cm³ (a water line at 1.00: both heavier), melting point 651 / 851 °C, boiling point 1106 /
//           1487 °C (Tables 8.5, 8.6); a hammer flattens calcium (malleable); the ribbon is drawn thin (ductile); the
//           ribbon bridges a gap and the bulb lights (good conductors) (tick 5).
//   END     back to the first table: the tiles sink back into the chalk, the marble, the leaf and the sea water.
// Book points (all): Mg = an alkaline earth metal, only combined: dolomite, kieserite, epsom salt, silicates (talc,
// asbestos), sea water (chlorides, bromides), permanent hardness of water, chlorophyll · Z = 12, Mg, period 3 second,
// group IIA second, 3 shells, 2 valence electrons · Table 8.5 · Ca too reactive to be free, abundant combined: CaCO₃ in
// limestone, marble, chalk; CaSO₄ in gypsum · Fig. 8.3 pure calcium, marble · Z = 20, Ca, period 4 second, group IIA
// third, 4 shells, 2 valence electrons · Table 8.6. Table numbers to memorize → 🎮 game (COVERAGE_U8).
// §1 CHECK (sheets renders/lesson/d810*.jpg, s810*.jpg, scr810*.jpg): nothing missing ✓ · one question + bridges ✓ · familiar
// hook (chalk, marble, leaf, sea water) paid off at the end ✓ · unknown minerals shown big, named, next to familiar ones ✓
// minerals sit in crystal pockets of a slice of the ground (805 rule) ✓ · numbers = bars against a water line ✓ · ≤ 3 labels a shot ✓ · one place at a time ✓ · camera moves ≥ 2 s ✓ · baked
// tables, dark atoms ✓ · every screen ✓ · flicker 0 ✓.
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

// ---------------------------------------------------------------- places (stations 10 apart)
const HK = [['chalk', -0.85, 0.07, 'Ca'], ['marble', -0.32, 0.07, 'Ca'], ['green leaf', 0.22, 0.04, 'Mg'], ['sea water', 0.72, 0.22, 'Mg']];   // name, x, top, metal
const GX = 10, GW = 2.0, GH0 = 0.78, GD = 0.6, FACE = GD / 2, SDIR = [0, 0.18, 1];                       // the slice of the ground
const POCK = { dol: [-0.62, 0.5], kie: [-0.25, 0.24], eps: [0.08, 0.52], talc: [0.42, 0.24], asb: [0.7, 0.52] };
const SEAX = 12.55, JAR = [13.05, 13.45], LEAFX = 14.85;
const CAR = [29.4, 29.95, 30.5], GYP = 31.3, PURE = 32.1;
const AY = 1.9, AXM = 20, AXC = 40, RMG = 0.72 * 1.6, RCA = 0.72 * 1.97, TP = 0.5;
const TBM = 26.5, TBC = 46.5, COL = (tb, c) => tb + (c - 9.5) * TP, TY = (r) => 3.6 - (r - 1) * TP;
const LX = 50, SMG = 49.7, SCA = 50.3, BZ = -0.22, CX = 53.0;

// ---------------------------------------------------------------- time (every camera move ≥ 2 s)
const T = { name: 0.5, rise: 6.4, card: 13.5 };
DOCK = T.card + 5.0;
const G0 = DOCK + 2.5, GB = G0 + 9, GS = GB + 6.5, GH = GS + 2.6, GL = GS + 8.5, GEND = GL + 6;
const IN = (a0) => ({ a0, z: a0 + 1.6, sh: a0 + 3.2, val: a0 + 5.2, fly: a0 + 7.2, row: a0 + 10.8, col: a0 + 13.6, end: a0 + 17 });
const PM = IN(GEND);
const C0 = PM.end, CG = C0 + 7.5, CP = CG + 4.5, CEND = CP + 8;
const PC = IN(CEND);
const L0 = PC.end, LD = L0 + 5.0, LM = LD + 6.5, LB = LM + 6.0, LH = LB + 6.0, HITS = [LH + 2.2, LH + 3.0, LH + 3.8], LE = LH + 7.0, LIT = LE + 3.6, LEND = LE + 9;
const END = LEND; T.done = END + 11;
const INTRO = [T.card, DOCK];
const TICKS = [[GEND - 0.6, 0], [PM.end - 0.6, 1], [CEND - 0.6, 2], [PC.end - 0.6, 3], [LEND - 0.6, 4]];

const inCaps = (P, el, Z, sh, per, pp, gp) => [
  [P.a0, P.z, `Inside a ${el} atom`], [P.z, P.sh, `${Z} protons: atomic number ${Z}`], [P.sh, P.val, `${sh.split(',').length === 3 ? 'Three' : 'Four'} shells: ${sh}`],
  [P.val, P.fly, 'Two outer (valence) electrons'], [P.fly, P.row, 'Its place in the periodic table'], [P.row, P.col, `Period ${per}: ${pp} place`], [P.col, P.end, `Group IIA: ${gp} place ✓`]];
const captions = [
  [0.3, T.rise - 0.2, 'Chalk, marble, a green leaf, sea water…'],
  [T.rise - 0.2, T.rise + 4.2, 'Two metals hide in all of them'],
  [T.rise + 4.2, T.card, 'Never free: always joined to other things'],
  [T.card, DOCK, 'Which two metals hide in chalk, leaves and sea water?'],
  [DOCK, G0 + 0.4, 'Magnesium first: where does it hide?'],
  [G0 + 0.4, GB, 'In rocks: dolomite, kieserite, epsom salt'],
  [GB, GS, 'In silicates too: talc and asbestos'],
  [GS, GH, 'Sea water holds magnesium salts'],
  [GH, GH + 3.0, 'Shake each with soap…'],
  [GH + 3.0, GL, 'Magnesium makes water hard: no lather'],
  [GL, GEND, 'Every green leaf needs magnesium ✓'],
  ...inCaps(PM, 'magnesium', 12, '2, 8, 2', 3, 'second', 'second'),
  [C0, C0 + 4.4, 'Calcium hides in limestone, marble, chalk'],
  [C0 + 4.4, CG, 'All are calcium carbonate (CaCO₃)'],
  [CG, CP, 'Gypsum: calcium sulphate (CaSO₄)'],
  [CP, CP + 4.0, 'Pure calcium: a silvery white metal'],
  [CP + 4.0, CEND, 'Too reactive: never found free ✓'],
  ...inCaps(PC, 'calcium', 20, '2, 8, 8, 2', 4, 'second', 'third'),
  [L0, LD, 'Magnesium: silvery grey · calcium: silvery white'],
  [LD, LM, 'Density: both heavier than water'],
  [LM, LB, 'They melt at 651 °C and 851 °C'],
  [LB, LH, 'They boil at 1106 °C and 1487 °C'],
  [LH, LE, 'Hammered flat: malleable · drawn thin: ductile'],
  [LE, LEND, 'Good conductors of heat and electricity ✓'],
  [END, END + 4.0, 'Chalk, marble, leaves, sea water…'],
  [END + 4.0, END + 7.5, '…hold magnesium and calcium'],
  [END + 7.5, T.done, 'Never free, but all around us'],
];

// ---------------------------------------------------------------- camera
const HW = (t, k = 1, e) => S(t, [-0.08, 0.14, 0.05], 2.05 * k, 0.6 * k, ADIR, e);
const ATOM = (t, x, R, k = 1, e) => { const h = (1.5 * R + 1.5) * k; return S(t, [x, AY, 0], h * 1.2, h, DDIR, e); };
const TAB = (t, tb, k = 1, e) => S(t, [tb, TY(4), 0], 8.6 * k, 3.6 * k, DDIR, e);
const LEFT = (t, tb, k = 1) => S(t, [COL(tb, 4.0), TY(2.8), 0], 4.6 * k, 3.0 * k, DDIR);
const inCams = (P, x, R, tb) => [ATOM(P.a0, x, R, 0.25), ATOM(P.a0 + 2.0, x, R, 1.05, 'out'), ATOM(P.fly - 0.05, x, R, 0.98), TAB(P.fly + 2.6, tb, 1.04), TAB(P.row - 0.4, tb, 1.0), LEFT(P.row + 1.8, tb, 1.04), LEFT(P.end - 0.05, tb, 0.97)];
const cams = [
  HW(0, 1.04), HW(T.rise - 0.4, 1.0), S(T.rise + 1.8, [-0.08, 0.36, 0.05], 2.0, 0.9), S(T.card, [-0.08, 0.36, 0.05], 1.95, 0.88), S(DOCK, [-0.08, 0.3, 0.05], 2.1, 0.85), S(G0 - 0.05, [-0.08, 0.3, 0.05], 2.05, 0.83),
  // magnesium's places: rocks, silicates, sea water + soap test, the leaf
  S(G0, [GX, 0.5, FACE], 2.3, 0.86, SDIR), S(G0 + 3.0, [GX, 0.5, FACE], 2.22, 0.83, SDIR), S(GS - 0.05, [GX, 0.5, FACE], 2.1, 0.78, SDIR),
  S(GS + 2.0, [(SEAX + JAR[1]) / 2, 0.2, 0.02], 1.6, 0.66), S(GL - 2.0, [(SEAX + JAR[1]) / 2, 0.2, 0.02], 1.55, 0.64), S(GL, [LEAFX, 0.2, 0.02], 0.9, 0.65), S(GEND - 2.4, [LEAFX, 0.24, 0.04], 0.85, 0.62),
  S(GEND - 0.8, [LEAFX, 0.32, 0.06], 0.32, 0.28, [0, 0.12, 1]), S(GEND - 0.05, [LEAFX, 0.32, 0.06], 0.04, 0.03, [0, 0.12, 1], 'in'),
  ...inCams(PM, AXM, RMG, TBM),
  // calcium's places
  S(C0, [CAR[1], 0.16, 0.02], 1.6, 0.65), S(CG - 2.0, [CAR[1], 0.16, 0.02], 1.55, 0.62), S(CG, [GYP, 0.2, 0.02], 0.85, 0.6), S(CP - 2.0, [GYP, 0.2, 0.02], 0.8, 0.58), S(CP, [PURE, 0.16, 0.05], 0.8, 0.55), S(CEND - 2.0, [PURE, 0.12, 0.05], 0.66, 0.46), S(CEND - 0.05, [PURE - 0.05, 0.045, 0.02], 0.04, 0.03, [0, 0.6, 1], 'in'),
  ...inCams(PC, AXC, RCA, TBC),
  // what they are like: the two samples + bars, the hammer, the circuit
  S(L0, [LX, 0.22, 0], 1.85, 0.72), S(LD - 0.6, [LX, 0.22, 0], 1.8, 0.7), S(LD + 1.4, [LX, 0.45, -0.1], 1.45, 1.15), S(LH - 0.2, [LX, 0.5, -0.1], 1.45, 1.2),
  S(LH + 1.8, [SCA, 0.3, 0], 0.95, 0.75), S(LE - 0.05, [LX, 0.22, 0], 1.8, 0.7), S(LE + 2.0, [CX, 0.4, 0], 2.3, 1.1), S(LEND - 0.05, [CX, 0.4, 0], 2.2, 1.05),
  HW(END, 1.04), HW(T.done, 0.98),
];

export default {
  capNear: true, oneText: true,
  duration: T.done,
  fog: [18, 40],                                                        // the wide table shot stays clear
  captions,
  cams,

  build({ scene, cam, R }) {
    const beats = [];
    const dark = (t) => (t >= PM.a0 - 0.01 && t < PM.end - 0.05) || (t >= PC.a0 - 0.01 && t < PC.end - 0.05);
    const ST = K.studio({ scene, R }, '810', { dark });                 // FIRST: models read the look
    beats.push((t) => ST.update(t));
    let root = scene;
    const add = (o, x = 0, y = 0, z = 0) => { o.position.set(x, y, z); root.add(o); return o; };
    const stage = (show) => { root = new THREE.Group(); scene.add(root); const g = root; beats.push((t) => { g.visible = show(t); }); return g; };
    const lbl = (text, h, color, x, y, z = 0, w = 700) => add(K.label(text, h, color, w), x, y, z);
    const tags = [], tag = (text, h, color, x, y, z = 0, w = 700) => { const l = lbl(text, 0.1, color, x, y, z, w); l.userData.frac = h * 1.8; tags.push(l); return l; };
    const shiny = (c, r = 0.28) => { const m = new THREE.MeshPhysicalMaterial({ color: c, metalness: 0.85, roughness: r, clearcoat: 0.4 }); if (ST.on) K.photoEnv('bake/studio.hdr').then((tx) => { m.envMap = tx; m.needsUpdate = true; }); return m; };
    const gold = M.glow(0xffc04d, 2.8), MET = 0x3a64b8, GREY = 0x5a616c;
    const sea = () => { const g = new THREE.Group(); g.add(K.beaker(0.085, 0.2)); const w = K.liquid(0.077, 0.14, 0x3f8fc4, 0.45); w.position.y = 0.025; g.add(w); return g; };

    // ================================================================ HOOK / END · the table we know
    {
      stage((t) => t < G0 - 0.05 || t >= END - 0.05); ST.bake(root, 'hook', -0.08, 2.3, 1.0);
      add(K.chalkSticks(), HK[0][1], 0, 0.02);
      add(K.marbleSlab(), HK[1][1], 0, 0).rotation.y = 0.2;
      add(K.leaf(0.42), HK[2][1], 0.004, 0.02).rotation.y = 0.5;
      add(sea(), HK[3][1], 0, 0);
      const names = HK.map(([n, x, h]) => tag(n, 0.05, '#ffffff', x, h + 0.14, 0.05));
      const tiles = HK.map(([, x, h, s]) => { const tl = add(K.tile(s, MET, 0.2, 0.17, 0.05), x, h, 0); tl.visible = false; return tl; });
      const SPOT = { Ca: V(-0.3, 0.55, 0.05), Mg: V(0.24, 0.55, 0.05) };
      const lMg = tag('magnesium', 0.05, '#ffffff', 0.24, 0.4, 0.05), lCa = tag('calcium', 0.05, '#ffffff', -0.3, 0.4, 0.05);
      beats.push((t) => {
        names.forEach((l, i) => K.popIn(l, t, T.name + i * 1.4, T.name + i * 1.4 + 2.5));
        const endT = t > END - 0.1;
        tiles.forEach((tl, i) => {
          const [, x, h, s] = HK[i], t0 = T.rise + i * 0.35, home = V(x, h + 0.25, 0.05), spot = SPOT[s];
          let p, k;
          if (!endT) {
            const up = ease(span(t, t0, t0 + 1.0)), go = ease(span(t, T.rise + 2.4, T.rise + 4.0));
            p = V(x, lerp(h, h + 0.25, up), 0.05).lerp(spot, go); k = up * (1 - (i % 2 ? 0 : 0) );
            tl.visible = t > t0 && t < G0; if (i === 1 || i === 3) { k *= 1 - span(t, T.rise + 3.2, T.rise + 4.0); p.z -= 0.06 * go; }   // the second tile of each metal merges into the first
          } else {
            const e0 = END + 0.6 + i * 0.6, down = ease(span(t, e0, e0 + 1.4));
            p = spot.clone().lerp(V(x, h, 0.02), down); if (i === 1 || i === 3) p.z -= 0.06 * (1 - down); k = (i === 1 || i === 3) ? span(t, e0 - 0.3, e0) * (1 - span(t, e0 + 1.2, e0 + 1.4)) : 1 - span(t, e0 + 1.2, e0 + 1.4);
            tl.visible = t > END - 0.1;
          }
          tl.position.copy(p); tl.scale.setScalar(Math.max(1e-4, k));
        });
        K.popIn(lCa, t, T.rise + 4.2, T.card); K.popIn(lMg, t, T.rise + 4.6, T.card);
      });
    }

    // ================================================================ MAGNESIUM: where it hides
    {
      stage((t) => t >= G0 - 0.05 && t < GEND); ST.bake(root, 'mgw', 12.4, 6.6, 1.1);
      add(K.earthBlock(GW, GH0, GD), GX, 0, 0);
      const holeM = M.matte(0x1c1611, 0.95), lipM = M.matte(0x6e665c, 0.9);   // a hollow in the rock: a dark opening with a rough rim
      const hollow = ([x, y], rx, ry) => {
        const m = add(new THREE.Mesh(new THREE.CircleGeometry(1, 40), holeM), GX + x, y, FACE + 0.006); m.scale.set(rx, ry, 1);
        const lip = add(K.solid(new THREE.TorusGeometry(1, 0.09, 10, 40), lipM, { outline: false }), GX + x, y, FACE + 0.004); lip.scale.set(rx, ry, 0.25);
      };
      const crystal = (kind, seed, [x, y], sc, n, r = 0.1) => { const c = K.crystals(kind, seed, { base: false, n, r }); c.rotation.x = Math.PI / 2; c.scale.setScalar(sc); return add(c, GX + x, y, FACE + 0.006); };
      hollow(POCK.dol, 0.17, 0.12); crystal('dolomite', 3, POCK.dol, 1.0, 9);
      hollow(POCK.kie, 0.17, 0.11); crystal('kieserite', 5, POCK.kie, 1.0, 12);
      hollow(POCK.eps, 0.17, 0.12); crystal('epsomite', 4, POCK.eps, 0.65, 30);
      hollow(POCK.talc, 0.16, 0.11); crystal('talc', 6, POCK.talc, 0.95, 12);
      hollow(POCK.asb, 0.16, 0.11); crystal('asbestos', 8, POCK.asb, 0.85, 60, 0.045);
      add(sea(), SEAX, 0, 0);
      const jars = JAR.map((x) => { const g = add(new THREE.Group(), x, 0, 0); g.add(K.vial(0.085, 0.26)); const w = K.liquid(0.075, 0.16, 0x9ec8e8, 0.35); w.position.y = 0.022; g.add(w); return g; });
      const foam = add(K.lump(0.072, M.matte(0xffffff, 0.6), 3, 0.5, 0.35), JAR[1], 0.2, 0), scum = Array.from({ length: 6 }, (_, i) => add(K.lump(0.012, M.matte(0xbab4a6, 0.8), i + 2, 0.4, 0.5), JAR[0] + 0.05 * Math.cos(i * 2.1), 0.185, 0.04 * Math.sin(i * 2.1)));
      const flakes = Array.from({ length: 6 }, (_, i) => add(K.lump(0.01, M.matte(0xf4efe0, 0.7), i + 9, 0.4, 0.3)));
      add(K.leaf(0.5), LEAFX - 0.04, 0.004, 0.02).rotation.y = 0.4;
      const chl = add(K.chlorophyll(0.07), LEAFX, 0.05, 0.06);
      const PL = (k, dy = 0.19) => [GX + POCK[k][0], POCK[k][1] + dy, FACE + 0.05];
      const L = [
        tag('a slice of the ground', 0.05, '#ffffff', GX, GH0 + 0.1, FACE),
        tag('dolomite (CaCO₃·MgCO₃)', 0.05, '#ffffff', GX + POCK.dol[0] + 0.14, POCK.dol[1] + 0.19, FACE + 0.05), tag('kieserite (MgSO₄)', 0.05, '#ffffff', ...PL('kie', -0.18)), tag('epsom salt (MgSO₄·7H₂O)', 0.05, '#ffffff', ...PL('eps')),
        tag('talc', 0.05, '#ffffff', ...PL('talc', -0.18)), tag('asbestos', 0.05, '#ffffff', ...PL('asb')),
        tag('sea water: MgCl₂, MgBr₂', 0.05, '#bfe0ff', SEAX + 0.05, 0.36, 0.05),
        tag('hard water', 0.05, '#ffffff', JAR[0] - 0.05, 0.42, 0.05), tag('pure water', 0.05, '#ffffff', JAR[1] + 0.05, 0.42, 0.05),
        tag('no lather: hard water', 0.05, '#ffd0b0', JAR[0] - 0.18, 0.42, 0.05), tag('lather ✓', 0.05, '#ffffff', JAR[1] + 0.1, 0.42, 0.05),
        tag('green leaf', 0.05, '#cfeec0', LEAFX + 0.2, 0.12, 0.2), tag('chlorophyll: magnesium at its centre', 0.05, '#ffffff', LEAFX, 0.5, 0.05),
      ];
      beats.push((t) => {
        // the soap flakes fall in, the jars are shaken (rocked by hand), then foam on pure water, grey scum on hard water
        flakes.forEach((f, i) => { const j = i % 2, t0 = GH + 0.2 + 0.15 * i, u = span(t, t0, t0 + 0.5); f.visible = u > 0 && u < 1; f.position.set(JAR[j] + 0.02 * Math.sin(i), lerp(0.42, 0.19, u * u), 0.01 * i); });
        jars.forEach((g, j) => { g.visible = t < GL + 0.1; const s = span(t, GH + 1.2, GH + 2.8); g.rotation.z = 0.25 * Math.sin(s * Math.PI * 6 + j) * Math.sin(Math.PI * s); });
        const fo = ease(span(t, GH + 2.8, GH + 3.6)); foam.visible = fo > 0.01 && t < GL + 0.1; foam.scale.set(fo, fo, fo);
        scum.forEach((s, i) => { const u = ease(span(t, GH + 3.0 + 0.1 * i, GH + 3.5 + 0.1 * i)); s.visible = u > 0.01 && t < GL + 0.1; s.scale.setScalar(Math.max(1e-4, u)); });
        // chlorophyll rises out of the leaf and turns to face us
        const up = ease(span(t, GL + 1.4, GL + 3.0)); chl.visible = t > GL + 1.3; chl.position.y = lerp(0.03, 0.32, up); chl.scale.setScalar(Math.max(1e-4, lerp(0.3, 1, up))); chl.rotation.set(-Math.PI / 2 * (1 - up), 0.4 * Math.sin(t * 0.8) * up, 0);
        const W = [[G0 + 0.4, G0 + 2.6], [G0 + 3.2, G0 + 6.2], [G0 + 4.6, G0 + 7.6], [G0 + 6.4, GB - 0.3], [GB + 2.0, GS - 0.3], [GB + 3.0, GS - 0.3], [GS + 1.2, GH - 0.2], [GH, GH + 2.8], [GH + 0.2, GH + 2.8], [GH + 3.2, GL - 0.3], [GH + 3.6, GL - 0.3], [GL + 0.4, GL + 2.6], [GL + 3.0, GEND]];
        L.forEach((l, i) => K.popIn(l, t, W[i][0], W[i][1]));
      });
    }

    // ================================================================ INSIDE (dark): the atom, then its place in the periodic table
    const inside = (P, ax, shells, Z, Rr, tb, own, me, rowR, lRowT, lColT) => {
      stage((t) => t >= P.a0 - 0.05 && t < P.end);
      const r0 = 0.45, A = K.atom(shells, Z, Z + (Z === 12 ? 0 : 0), r0, (Rr - r0) / (shells.length - 1)); A.group.position.set(ax, AY, 0); root.add(A.group);
      const outer = A.electrons.filter((e) => e.shell === shells.length - 1);
      const [mr, mc] = place(me), TILE = V(COL(tb, mc), TY(mr), 0.12), nuc = A.group.children[0];
      beats.push((t) => {
        if (t > P.val) outer.forEach((x) => { if (x.e.material !== gold) { x.e.material = gold; x.e.children[0].material = x.e.children[0].material.clone(); x.e.children[0].material.color.set(0xffc04d); } });
        const k = ease(span(t, P.fly, P.fly + 2.6));
        A.group.visible = k < 0.97; A.group.position.copy(K.arc(V(ax, AY, 0), TILE, 0.7, k)); A.group.scale.setScalar(Math.max(1e-4, lerp(1, 0.07, k) * back(span(t, P.a0 - 0.1, P.a0 + 0.2))));
        A.update(t); nuc.scale.setScalar(1 + 0.35 * Math.sin(Math.PI * span(t, P.z, P.z + 0.8)));
        A.rings.forEach((r, s) => r.scale.setScalar(1 + 0.12 * Math.sin(Math.PI * span(t, P.sh + 0.2 + s * 0.45, P.sh + 0.7 + s * 0.45))));
        outer.forEach((x) => x.e.scale.setScalar(1 + 0.6 * Math.sin(Math.PI * span(t, P.val, P.val + 0.9))));
      });
      const up = AY + 0.75 * Rr + 0.45, low = AY - 0.9 * Rr - 0.35;
      const nm = lbl(`${Z === 12 ? 'magnesium' : 'calcium'} atom (${Z === 12 ? 'Mg' : 'Ca'})`, 0.28, '#ffffff', ax, up), zl = lbl(`${Z} protons: atomic number ${Z}`, 0.24, '#ff9f96', ax, low);
      const cfg = lbl(shells.join(', '), 0.3, '#ffffff', ax, up), val = lbl('2 outer (valence) electrons', 0.24, '#ffd27a', ax, low);
      beats.push((t) => { K.popIn(nm, t, P.a0 + 0.6, P.sh); K.popIn(zl, t, P.z + 0.3, P.sh); K.popIn(cfg, t, P.sh + 1.2, P.fly); K.popIn(val, t, P.val + 0.5, P.fly); });
      // the periodic table: grey tiles, the ones that matter named, the element's own tile blue
      const tab = new THREE.Group(); root.add(tab); beats.push((t) => { tab.visible = t > P.fly - 0.2; });
      const key = new THREE.DirectionalLight(0xfff2e0, 2.2); key.position.set(tb - 3, TY(4) + 4, 6); key.target.position.set(tb, TY(4), 0); tab.add(key, key.target);   // the table gets its own soft key light
      const rest = []; for (let z = 1; z <= 118; z++) { const [r, c] = place(z); if (r <= 7 && !own[z]) rest.push({ r, c }); }
      const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(0.44, 0.44, 0.06), M.gloss(GREY), rest.length); tab.add(inst);
      const m4 = new THREE.Matrix4(); rest.forEach(({ r, c }, i) => { m4.makeTranslation(COL(tb, c), TY(r), 0); inst.setMatrixAt(i, m4); });
      let mine = null;
      Object.entries(own).forEach(([z, s]) => { const [r, c] = place(+z); const tl = K.tile(s, +z === me ? MET : GREY, 0.44, 0.44, 0.08); tl.position.set(COL(tb, c), TY(r), 0.01); tab.add(tl); if (+z === me) mine = tl; });
      const body = mine.userData.body.material;
      const hl = (w, h, ax2, ay2) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.02).translate(ax2 * w / 2, ay2 * h / 2, 0), new THREE.MeshBasicMaterial({ color: 0xf0b030, transparent: true, opacity: 0.22, depthWrite: false, toneMapped: false })); tab.add(m); return m; };
      const rowH = hl(18 * TP + 0.08, 0.5, 1, 0), colH = hl(0.5, 7 * TP + 0.08, 0, -1);
      rowH.position.set(COL(tb, 1) - TP / 2 - 0.04, TY(mr), -0.06); colH.position.set(COL(tb, 2), TY(1) + TP / 2 + 0.04, -0.06);
      const lTab = lbl('the periodic table', 0.44, '#f6d48f', tb, TY(1) + 0.65), lRow = lbl(lRowT, 0.32, '#ffe08a', COL(tb, 6.2), TY(mr)), lCol = lbl(lColT, 0.3, '#ffe08a', COL(tb, 5.4), TY(1.6));
      beats.push((t) => {
        const land = span(t, P.fly + 2.4, P.fly + 2.9); body.emissive.set(0xf0b030); body.emissiveIntensity = 0.55 * Math.sin(Math.PI * land); mine.position.z = 0.01 + 0.06 * Math.sin(Math.PI * span(t, P.fly + 2.4, P.fly + 3.0));
        rowH.visible = t > P.row; rowH.scale.x = Math.max(1e-4, ease(span(t, P.row, P.row + 1.2)) * (1 - ease(span(t, P.col - 0.4, P.col))));
        colH.visible = t > P.col; colH.scale.y = Math.max(1e-4, ease(span(t, P.col, P.col + 1.2)));
        K.popIn(lTab, t, P.fly + 1.4, P.row + 0.2); K.popIn(lRow, t, P.row + 1.0, P.col - 0.3); K.popIn(lCol, t, P.col + 1.0, P.end);
      });
    };
    const OWN = { 1: 'H', 3: 'Li', 4: 'Be', 11: 'Na', 12: 'Mg', 19: 'K', 20: 'Ca' };
    inside(PM, AXM, [2, 8, 2], 12, RMG, TBM, OWN, 12, 3, 'period 3: Na, then Mg (second)', 'group IIA: Be, then Mg (second)');

    // ================================================================ CALCIUM: where it hides
    {
      stage((t) => t >= C0 - 0.05 && t < CEND); ST.bake(root, 'caw', 30.75, 3.6, 1.1);
      add(K.stoneBlock(), CAR[0], 0, 0).rotation.y = 0.3;
      add(K.marbleSlab(0.3, 0.06, 0.22), CAR[1], 0, 0).rotation.y = -0.2;
      add(K.chalkSticks(0.26), CAR[2], 0, 0.02);
      add(K.crystals('gypsum', 2), GYP, 0, 0);
      add(K.dish(0.15), PURE, 0, 0);
      const caM = shiny(0xeef0f2, 0.22), pieces = [[-0.05, 0.02, 0.6], [0.04, -0.03, 2.1], [0.0, 0.05, 1.2], [0.06, 0.04, 2.8]].map(([dx, dz, r], i) => { const p = add(K.lump(0.034, caM, 40 + i, 0.4, 0.6), PURE + dx, 0.026, dz); p.rotation.y = r; return p; });
      const dullC = new THREE.Color(0xd8d6cf), brightC = new THREE.Color(0xeef0f2);
      const L = [
        tag('limestone', 0.05, '#ffffff', CAR[0], 0.3, 0.05), tag('marble', 0.05, '#ffffff', CAR[1], 0.24, 0.05), tag('chalk', 0.05, '#ffffff', CAR[2], 0.22, 0.05),
        tag('CaCO₃', 0.055, '#f6d48f', CAR[0], 0.3, 0.05), tag('CaCO₃', 0.055, '#f6d48f', CAR[1], 0.24, 0.05), tag('CaCO₃', 0.055, '#f6d48f', CAR[2], 0.22, 0.05),
        tag('gypsum (CaSO₄)', 0.05, '#ffffff', GYP, 0.42, 0.05),
        tag('pure calcium', 0.05, '#ffffff', PURE, 0.24, 0.05), tag('dull in air: never found free', 0.05, '#ffd0b0', PURE, 0.24, 0.05),
      ];
      beats.push((t) => {
        const d = ease(span(t, CP + 3.2, CP + 5.6)); caM.color.copy(brightC).lerp(dullC, d); caM.metalness = 0.85 * (1 - 0.8 * d); caM.roughness = lerp(0.22, 0.85, d);
        const W = [[C0 + 0.6, C0 + 4.2], [C0 + 1.8, C0 + 4.2], [C0 + 3.0, C0 + 4.2], [C0 + 4.6, CG - 0.3], [C0 + 4.9, CG - 0.3], [C0 + 5.2, CG - 0.3], [CG + 1.6, CP - 0.3], [CP + 0.4, CP + 3.4], [CP + 4.2, CEND]];
        L.forEach((l, i) => K.popIn(l, t, W[i][0], W[i][1]));
        pieces.forEach((p, i) => { p.scale.setScalar(1 + 0.04 * Math.sin(Math.PI * span(t, CP + 3.4 + i * 0.2, CP + 4.0 + i * 0.2))); });
      });
    }
    inside(PC, AXC, [2, 8, 8, 2], 20, RCA, TBC, OWN, 20, 4, 'period 4: K, then Ca (second)', 'group IIA: Be, Mg, then Ca (third)');

    // ================================================================ WHAT THEY ARE LIKE (Tables 8.5, 8.6)
    {
      stage((t) => t >= L0 - 0.05 && t < LEND); ST.bake(root, 'like', 51.4, 4.7, 1.3);
      for (const x of [SMG, SCA]) add(K.solid(new THREE.BoxGeometry(0.34, 0.02, 0.26).translate(0, 0.01, 0), M.gloss(0xf2f0ea)), x, 0, 0.05);
      const mgM = shiny(0xaeb3ba, 0.32), caM = shiny(0xeceef0, 0.22);
      add(K.ribbonCoil(0.065, 5, mgM), SMG, 0.02, 0.05);
      [[0.07, -0.04], [-0.06, 0.05], [0.08, 0.07]].forEach(([dx, dz], i) => add(K.lump(0.025, caM, 50 + i, 0.6, 0.5), SCA + dx, 0.035, 0.05 + dz));
      const ball = add(K.lump(0.045, caM, 57, 0.85, 0.3), SCA - 0.03, 0.065, 0.02);
      // bars behind the samples: density, then melting point, then boiling point
      const bars = [[SMG, 0x8fa6c8, [1.74, 651, 1106]], [SCA, 0xe8d6a8, [1.55, 851, 1487]]].map(([x, c, v]) => ({ b: add(K.solid(new THREE.BoxGeometry(0.2, 1, 0.08).translate(0, 0.5, 0), M.gloss(c), { outline: false }), x, 0.02, BZ), v }));
      const KS = [0.3, 0.00062, 0.00062], STEP = [LD, LM, LB], UNIT = [' g/cm³', ' °C', ' °C'];
      const hOf = (i, t) => { let h = 0; for (let p = 0; p < 3; p++) h = lerp(h, bars[i].v[p] * KS[p], ease(span(t, STEP[p] + 0.3, STEP[p] + 1.5))); return h * (1 - ease(span(t, LH - 0.6, LH + 0.4))); };
      const vals = bars.map(({ v }, i) => v.map((n, p) => tag(String(n) + UNIT[p], 0.05, '#ffe2a0', i ? SCA : SMG, 0, BZ + 0.05)));
      const water = add(K.solid(new THREE.BoxGeometry(0.95, 0.012, 0.012), M.glow(0x5ab0ff, 1.4), { outline: false }), LX, 0.02 + 0.3, BZ + 0.06);
      const lW = tag('water: 1.00', 0.045, '#9fd0ff', LX - 0.62, 0.32, BZ + 0.06);
      const lMg = tag('magnesium: silvery grey', 0.05, '#ffffff', SMG - 0.04, 0.34, 0.1), lCa = tag('calcium: silvery white', 0.05, '#ffffff', SCA + 0.04, 0.21, 0.1);
      const hm = add(K.hammer(0.5)), HL = 0.52, lMal = tag('flat, not broken: malleable ✓', 0.05, '#ffffff', SCA - 0.02, 0.44, 0.05), lDuc = tag('drawn thin: ductile ✓', 0.05, '#ffffff', SMG - 0.1, 0.27, 0.1);
      const flatK = (t) => HITS.reduce((a, h) => a + ease(span(t, h, h + 0.08)), 0) / 3;
      beats.push((t) => {
        bars.forEach(({ b }, i) => { const h = hOf(i, t); b.visible = h > 0.002; b.scale.y = Math.max(1e-4, h); vals[i].forEach((l, p) => { l.position.y = 0.02 + h + 0.08; K.popIn(l, t, STEP[p] + 1.5, (STEP[p + 1] ?? LH - 0.6) - 0.35); }); });
        const wl = ease(span(t, LD + 1.6, LD + 2.2)) * (1 - ease(span(t, LM - 0.4, LM))); water.visible = wl > 0.01; water.scale.x = Math.max(1e-4, wl); K.popIn(lW, t, LD + 2.0, LM - 0.4);
        K.popIn(lMg, t, L0 + 0.6, LD - 0.4); K.popIn(lCa, t, L0 + 2.0, LD - 0.4);
        // three blows: the calcium ball goes flat
        const f = flatK(t), sy = 1 - 0.7 * f, sxz = 1 + 0.9 * f; ball.scale.set(sxz, sy, sxz * 0.9); ball.position.y = 0.02 + 0.045 * sy;
        const UP = Math.PI / 2 - 0.8; let a = UP, k = 0;
        for (const h of HITS) if (t > h - 0.75) k = h;
        if (k) { const u = ease(span(t, k - 0.75, k - 0.25)), down = easeIn(span(t, k - 0.25, k)), reb = t > k ? 0.12 * Math.sin(Math.PI * span(t, k, k + 0.2)) : 0, prev = HITS.indexOf(k) ? Math.PI / 2 : UP; a = t < k - 0.25 ? lerp(prev, UP, u) : lerp(UP, Math.PI / 2, down) - reb; }
        const hitTop = 0.02 + 0.09 * (1 - 0.7 * flatK(Math.max(t, k || 0) + 0.1));
        hm.rotation.z = a; hm.position.set(SCA - 0.03 + HL, hitTop + 0.14, 0.02);
        const enter = 1 - ease(span(t, LH + 0.6, LH + 1.3)), leave = ease(span(t, HITS[2] + 0.8, HITS[2] + 1.6));
        hm.position.y += 1.2 * enter + 1.5 * leave; hm.visible = t > LH + 0.6 && t < HITS[2] + 1.6;
        K.popIn(lMal, t, HITS[2] + 0.4, LE - 0.3); K.popIn(lDuc, t, HITS[2] + 1.6, LE - 0.3);
      });
      // a magnesium strip bridges the gap: the bulb lights
      for (const s of [-1, 1]) { add(K.solid(new THREE.BoxGeometry(0.12, 0.08, 0.12), M.matte(0x22252b, 0.6)), CX + s * 0.25, 0.04, 0); add(K.solid(new THREE.BoxGeometry(0.13, 0.03, 0.13), M.metal(0xb9bec6, 0.3)), CX + s * 0.25, 0.096, 0); }
      add(K.battery(), CX - 0.85, 0, -0.05);
      const inW = add(K.wire([[CX - 0.85, 0.87, -0.05], [CX - 0.8, 0.95, 0.0], [CX - 0.55, 0.42, 0.12], [CX - 0.4, 0.12, 0.06], [CX - 0.31, 0.1, 0]]));
      const outW = add(K.wire([[CX + 0.31, 0.1, 0], [CX + 0.48, 0.07, 0.05], [CX + 0.64, 0.06, 0.03], [CX + 0.72, 0.08, 0]]));
      const backW = add(K.wire([[CX + 0.86, 0.04, -0.09], [CX + 0.5, 0.024, -0.32], [CX - 0.5, 0.024, -0.32], [CX - 0.72, 0.024, -0.14]], 0x2b2f38));
      const lamp = add(K.bulb(), CX + 0.8, 0.0, 0);
      const stripC = new THREE.CatmullRomCurve3([V(CX - 0.3, 0.12, 0), V(CX + 0.3, 0.12, 0)]);
      const pI = add(K.pulses(inW.userData.curve, 5)), pO = add(K.pulses(outW.userData.curve, 3)), pS = add(K.pulses(stripC, 4)), pB = add(K.pulses(backW.userData.curve, 6));
      const strip = add(K.solid(new THREE.BoxGeometry(0.72, 0.008, 0.05), shiny(0xb4b8bf, 0.3)), CX, 1.2, 0);
      const tg = add(K.tongs(0.7)), REST = 0.1155, m0 = LE + 1.0;
      const lGap = tag('a gap: bulb off', 0.05, '#cfd6e2', CX, 0.3, 0.1), lSt = tag('magnesium ribbon', 0.05, '#ffffff', CX, 0.3, 0.1), lLit = tag('bulb lights: conductor ✓', 0.05, '#ffe2a0', CX + 0.45, 0.8, 0);
      beats.push((t) => {
        tg.visible = t > m0 && t < m0 + 2.4;
        if (tg.visible) { const at = V(CX, REST + 0.006, 0), top = at.clone().add(V(0, 1.1, 0)); tg.position.copy(t < m0 + 1.2 ? top.lerp(at, 1 - (1 - span(t, m0, m0 + 1.2)) ** 2) : t < m0 + 1.5 ? at : at.clone().lerp(top, easeIn(span(t, m0 + 1.5, m0 + 2.4)))); tg.userData.set(lerp(0.02, 0.07, span(t, m0 + 1.35, m0 + 1.5))); }
        strip.position.y = t < m0 ? 1.3 : t < m0 + 1.2 ? lerp(REST + 1.1, REST, 1 - (1 - span(t, m0, m0 + 1.2)) ** 2) : REST; strip.visible = t > m0;
        const lit = ease(span(t, LIT, LIT + 0.3)); lamp.userData.set(lit);
        [pI, pO, pS, pB].forEach((p) => p.userData.update(t, lit, lit > 0.01 ? 1 : 0));
        K.popIn(lGap, t, LE + 0.4, m0 + 0.9); K.popIn(lSt, t, m0 + 1.3, LIT + 0.2); K.popIn(lLit, t, LIT + 0.5, LEND);
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Which two metals hide in chalk, leaves and sea water?', intro: INTRO, ticks: TICKS,
      rows: [[0, '1 · Magnesium'], [1, 'where it hides'], [1, 'its place: period 3, group IIA'], [0, '2 · Calcium'], [1, 'where it hides'], [1, 'its place: period 4, group IIA'], [0, '3 · What they are like'], [1, 'Tables 8.5 and 8.6']],
      short: ['Mg: where it hides', 'Mg: period 3', 'Ca: where it hides', 'Ca: period 4', 'Tables 8.5, 8.6'] }));
    beats.push(() => { const nar = Math.min(1, (cam.aspect / 1.5) ** 0.7); tags.forEach((l) => { if (l.visible) l.scale.multiplyScalar(cam.position.distanceTo(l.position) * 2 * TAN * l.userData.frac * nar / 0.1); }); });

    return (t, dt) => { for (const b of beats) b(t, dt); };
  },
};
