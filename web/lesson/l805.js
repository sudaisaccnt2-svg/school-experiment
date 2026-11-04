// Lesson 805 · Alkaline earth metals (book pp. 225–226: 8.1.3 + Occurrence), v3 (2026-10-13).
// v1 (backups/l805_v1.js) "not happy": short, no reason, not interesting. v2 (backups/l805_v2.js): "I don't understand
// these things you made (minerals on plinths), the camera follows very fast, not built for any screen; bake the lighting".
// v3: things a student KNOWS open the lesson on a real wooden table (baked photo studio); minerals appear only where they
// really are (crystal pockets in a cut-open slice of the ground); every camera move ≥ 2 s; every shot is fitted to the
// real screen by the engine (S() passes the subject); the atom close-ups keep the dark studio.
// THE QUESTION: "Why are they called 'alkaline earth' metals?" → card: Alkaline · Inside the atom · Earth.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//   HOOK    a table: a bone, a tooth, an egg shell, a leaf, a glass of sea water, named one by one; a periodic-table chart
//           stands behind · "what do they share?" → a metal tile rises out of each (Ca, Ca, Ca, Mg, Mg) and flies into
//           the chart: all into ONE column; Be, Sr, Ba, Ra light up too · group IIA = the alkaline earth metals · "why
//           that name?" → the question card, docks left.
//   ALKALINE  tongs hold calcium over water (named, held), let go: splash, it sinks and fizzes; tongs dip red litmus:
//           blue ✓ · they make alkalies (tick 1) · "why so reactive?" → slow push into the lump.
//   INSIDE  (dark) calcium 2, 8, 8, 2: 2 outer electrons (sub-shell s) turn gold, come off easily (low ionization
//           energy) → Ca²⁺ (electropositive) (tick 2); argon glides in: same 2, 8, 8, a noble gas (tick 3); the six atoms
//           Be … Ra in a 3 × 2 grid: 2 gold outer electrons each, all lose both → M²⁺ (tick 4) · "where are they then?"
//   EARTH   a cut-open slice of the ground on the table: a Ca²⁺ and a sulphate ion fly into a crystal pocket = gypsum
//           (never free, tick 5); then one pocket at a time: Epsom salt MgSO₄, barite BaSO₄, beryl (a little Be); the rock
//           layers light up with Mg²⁺ Ca²⁺ (and Na⁺ K⁺); calcium phosphate + calcium fluoride; deep down a tiny glowing
//           speck: radium, rare, radioactive · back on the first table: sea water (Mg halides), the leaf (chlorophyll),
//           bone/tooth/egg shell (calcium in living things) · up to the chart: the column = the answer (tick 6).
// Book points (all): group IIA = alkaline earth metals · name: produce alkalies + widely distributed in the earth crust ·
// two valence electrons · valence sub-shell s · electropositive · lose 2 → M²⁺ · low ionization energies · six: Be Mg Ca
// Sr Ba Ra · stable like noble gases by losing 2 · often sulphates: gypsum (CaSO₄), epsom (MgSO₄), barite (BaSO₄) · low
// IE → very reactive → not free · Be in beryl, small amounts · Mg, Ca very abundant in the crust, with Na and K in rocks
// as cations · Mg halides in sea water · Mg in chlorophyll · Ca phosphate, Ca fluoride · Ca in living organisms: bones,
// teeth, egg shells · radium rare, radioactive.
import * as THREE from 'three';
import * as K from './kit.js';
import { place } from '../games/u3data.js';
const { M, span, ease, easeIn, back, lerp } = K;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

const TAN = Math.tan(16 * Math.PI / 180), ASP = 1.6, ADIR = [0, 0.45, 1], TDIR = [0, 0.78, 1];
let DOCK = 1e9;
/** a shot: the subject (look, w × h) seen along dir. The engine refits it to the real screen; after the card docks the
 *  subject stays right of it. */
function S(t, look, w, h, dir = ADIR, e) {
  h *= 1.14; look = [look[0], look[1] + 0.05 * h, look[2]];        // headroom: the caption floats just above the subject (capNear)
  const dk = t >= DOCK, d = V(...dir).normalize(), dist = Math.max(h / 2 / TAN, (dk ? w / (1 - K.DOCK_W) : w) / 2 / (TAN * ASP)) * 1.1;
  const pos = V(...look).addScaledVector(d, dist).toArray(), fit = { look, w, h, dir, dock: dk ? K.DOCK_W : 0 };
  return dk ? [t, ...K.dockShot(pos, look), undefined, e, fit] : [t, pos, look, undefined, e, fit];
}

// ---------------------------------------------------------------- places
const LX = 0, WX = 12, GX = 24;                                        // stations: life table · water test · ground slice
const OBJ = [['bone', -1.15, 0.2], ['tooth', -0.55, 0.12], ['egg shell', -0.05, 0.15], ['leaf', 0.55, 0.2], ['sea water', 1.2, 0.08]];
const TOPY = [0.1, 0.24, 0.1, 0.06, 0.42];                              // how tall each thing is (its label goes above)
const TP = 0.16, BZ = -0.5, BY = 1.75, COL = (c) => LX + (c - 9.5) * TP, TY = (r) => BY + 0.48 - (r - 1) * TP;   // the chart behind the table
const CX = COL(2), CMID = (TY(2) + TY(7)) / 2, TZ = BZ + 0.04;
const IIA = { Be: 2, Mg: 3, Ca: 4, Sr: 5, Ba: 6, Ra: 7 };
const SURF = 0.435;
const CA = V(60, 1.8, 0), CAR = 1.35, ARX = 63.6;
const ROW = [['Be', [2, 2], 4, 5], ['Mg', [2, 8, 2], 12, 12], ['Ca', [2, 8, 8, 2], 20, 20], ['Sr', [2, 8, 18, 8, 2], 38, 50], ['Ba', [2, 8, 18, 18, 8, 2], 56, 81], ['Ra', [2, 8, 18, 32, 18, 8, 2], 88, 138]];
const RR = ROW.map(([, sh]) => 0.22 + (sh.length - 1) * 0.11), GX0 = 80;
const RP = (i) => V(GX0 + (i < 3 ? (i - 1) * 2.0 : (i - 4) * 2.4), CA.y + (i < 3 ? 1.25 : -1.15), 0);
const SW = 2.6, SH = 1.1, SD = 0.7, FACE = SD / 2;                      // the ground slice (front face at z = FACE)
const POCK = [['gyp', -0.9, 0.62], ['eps', -0.42, 0.38], ['bar', 0.05, 0.68], ['ber', 0.52, 0.4], ['min', 0.95, 0.64], ['ra', -0.02, 0.17]];
const MET = 0x3a64b8, GREY = 0x4a4f58;

// ---------------------------------------------------------------- time (every camera move ≥ 2 s)
const T = {
  hook: 0, ask: 4.0, rise: 7.5, col: 13.4, card: 18.4, ca: 24.0, drop: 26.6, lit: 29.8, alk: 36.6, push: 39.4,
  atom: 41.8, off: 46.8, ion: 49.3, ar: 53.3, row: 59.6, wave: 66.4, free: 73.0,
  gyp: 80.0, eps: 85.0, bar: 89.6, ber: 94.2, rock: 98.8, min: 103.8, ra: 108.6, sea: 113.4, leaf: 118.0, bone: 122.6, end: 127.6,
};
T.done = T.end + 10.0; DOCK = T.ca - 0.4;
const NAME = (i) => 0.6 + i * 0.6;                                     // each thing on the table is named
const TR = (i) => T.rise + 0.3 + i * 0.9;                              // a tile rises out of thing i
const LEAVE = (j) => T.off + 0.3 + j * 0.5, GONE = LEAVE(1);
const WAVE = (i) => T.wave + 0.3 + i * 0.55;
const INTRO = [T.card, DOCK];
const TICKS = [[T.alk + 0.1, 0], [T.ion + 0.3, 1], [T.ar + 5.1, 2], [T.wave + 4.0, 3], [T.free + 6.3, 4], [T.end + 2.6, 5]];

const captions = [
  [0.3, T.ask, 'A bone, a tooth, an egg shell, a leaf, sea water'],
  [T.ask, T.rise, 'What do they have in common?'],
  [T.rise, T.col, 'Each one holds a metal from ONE family'],
  [T.col, T.card, 'Group IIA: the alkaline earth metals'],
  [T.card, T.ca, 'But why that name? Let us find out'],
  [T.ca, T.drop + 0.3, 'Is it "alkaline"? Calcium goes into water'],
  [T.drop + 0.3, T.lit + 0.6, 'It fizzes: calcium reacts with water'],
  [T.lit + 0.6, T.alk, 'Red litmus turns blue: an alkali'],
  [T.alk, T.push, 'They make alkalies: that is "alkaline" ✓'],
  [T.push, T.atom + 0.8, 'Why so reactive? Look inside calcium'],
  [T.atom + 0.8, T.off, 'Calcium: 2 electrons in its outer shell'],
  [T.off, T.ion, 'Both come off easily: low ionization energy'],
  [T.ion, T.ar, 'Calcium becomes Ca²⁺: an electropositive metal ✓'],
  [T.ar, T.row, 'Left with 2, 8, 8: like argon, a noble gas ✓'],
  [T.row, T.wave, 'All six have 2 outer electrons'],
  [T.wave, T.free, 'All six lose both: M²⁺ ions ✓'],
  [T.free, T.gyp, 'So reactive, they are never found free ✓'],
  [T.gyp, T.eps, 'In the ground: gypsum is calcium sulphate'],
  [T.eps, T.bar, 'Epsom salt is magnesium sulphate'],
  [T.bar, T.ber, 'Barite is barium sulphate'],
  [T.ber, T.rock, 'Beryllium: only a little, in beryl'],
  [T.rock, T.min, 'Rocks hold plenty of magnesium and calcium'],
  [T.min, T.ra, 'Calcium is also found as phosphate and fluoride'],
  [T.ra, T.sea, 'Radium: rare, and radioactive'],
  [T.sea, T.leaf, 'Magnesium halides are in sea water'],
  [T.leaf, T.bone, 'Chlorophyll, the green in leaves, holds magnesium'],
  [T.bone, T.end, 'Living things need calcium: bones, teeth, egg shells'],
  [T.end, T.end + 5.0, 'All through the earth, never free: "earth" ✓'],
  [T.end + 5.0, T.done, 'Alkalies + earth = alkaline earth metals'],
];

// ---------------------------------------------------------------- camera
const TABLE = (t, k = 1, e) => S(t, [LX + 0.02, 0.16, 0.14], 2.95 * k, 0.95 * k, TDIR, e);
const CHART = (t, k = 1, e) => S(t, [LX - 0.1, BY - 0.12, BZ], 3.3 * k, 1.75 * k, [0, 0.18, 1], e);
const COLSHOT = (t, k = 1, e) => S(t, [CX + 0.3, CMID + 0.05, TZ], 0.95 * k, 1.25 * k, [0, 0.1, 1], e);
const THING = (t, i, w, h, k = 1) => S(t, [LX + OBJ[i][1], TOPY[i] * 0.5, OBJ[i][2]], w * k, h * k, TDIR);
const BK = (t, k = 1, e) => S(t, [WX + 0.02, 0.5, 0], 1.45 * k, 1.22 * k, ADIR, e);
const atomShot = (t, x, R, k = 1, e) => { const h = (1.5 * R + 1.4) * k; return S(t, [x, CA.y, 0], h * 1.15, h, ADIR, e); };
const SLICE = (t, k = 1) => S(t, [GX, 0.56, FACE * 0.6], 2.95 * k, 1.45 * k, [0, 0.22, 1]);
const POCKET = (t, j, k = 1) => S(t, [GX + POCK[j][1], POCK[j][2] + 0.06, FACE], 1.15 * k, 0.78 * k, [0, 0.18, 1]);
const cams = [
  // HOOK: the table (named things), the tiles lead the eye up to the chart, push in to the column
  TABLE(0, 1.04), TABLE(T.rise + 1.0, 0.97), CHART(T.rise + 4.0), CHART(T.col, 0.97), COLSHOT(T.col + 2.4), COLSHOT(T.ca - 0.45, 0.95),
  // ALKALINE (cut): the beaker; a slow push into the calcium lump on the bottom
  BK(T.ca, 1.05), BK(T.drop, 1.0), BK(T.lit + 1.2, 0.97), BK(T.alk + 0.4, 0.93), S(T.push, [WX + 0.02, 0.48, 0], 1.3, 1.08), S(T.atom - 0.05, [WX, 0.11, 0], 0.07, 0.05, ADIR, 'in'),
  // INSIDE (dark): the calcium atom, argon beside it, the six
  atomShot(T.atom, CA.x, CAR, 0.25), atomShot(T.atom + 2.0, CA.x, CAR, 1.0, 'out'), atomShot(T.off, CA.x, CAR, 0.97), atomShot(T.ar - 0.1, CA.x, CAR, 0.95),
  S(T.ar + 2.2, [(CA.x + ARX) / 2, CA.y, 0], 7.0, 3.5), S(T.row - 0.05, [(CA.x + ARX) / 2, CA.y, 0], 6.8, 3.4),
  S(T.row, [GX0, CA.y + 0.1, 0], 7.0, 4.4), S(T.free - 0.05, [GX0, CA.y + 0.1, 0], 6.8, 4.25),
  // EARTH (cut): the slice wide, then one pocket at a time (each move 2 s)
  SLICE(T.free, 1.04), SLICE(T.free + 2.2, 1.0), POCKET(T.free + 4.4, 0, 1.1), POCKET(T.eps - 0.05, 0, 1.0),
  ...['eps', 'bar', 'ber'].flatMap((k, j) => [POCKET(T[k] + 2.0, j + 1, 1.05), POCKET([T.bar, T.ber, T.rock][j] - 0.05, j + 1, 0.97)]),
  SLICE(T.rock + 2.0, 0.95), SLICE(T.min - 0.05, 0.92), POCKET(T.min + 2.0, 4, 1.05), POCKET(T.ra - 0.05, 4, 0.97), POCKET(T.ra + 2.0, 5, 1.05), POCKET(T.sea - 0.05, 5, 0.95),
  // back on the first table (cut): sea water, the leaf, bone/tooth/egg shell; then up to the chart: the answer
  THING(T.sea, 4, 0.9, 0.62, 1.05), THING(T.leaf - 0.05, 4, 0.9, 0.62, 0.97), THING(T.leaf + 2.0, 3, 0.9, 0.5), THING(T.bone - 0.05, 3, 0.9, 0.5, 0.95),
  S(T.bone + 2.0, [LX - 0.6, 0.1, 0.16], 1.45, 0.62), S(T.end - 0.05, [LX - 0.6, 0.1, 0.16], 1.38, 0.6),
  CHART(T.end + 2.4), CHART(T.end + 5.0, 0.97), S(T.done - 1.0, [CX + 0.6, CMID + 0.12, TZ], 1.5, 1.35, [0, 0.1, 1]), S(T.done, [CX + 0.6, CMID + 0.12, TZ], 1.46, 1.32, [0, 0.1, 1]),
];

export default {
  capNear: true, oneText: true,
  duration: T.done,
  captions,
  cams,

  build({ scene, cam, R }) {
    const beats = [];
    const ST = K.studio({ scene, R }, '805', { dark: (t) => t >= T.atom - 0.01 && t < T.free - 0.05 });   // FIRST: models read the look
    beats.push((t) => ST.update(t));
    const add = (o, x = 0, y = 0, z = 0) => { o.position.set(x, y, z); scene.add(o); return o; };
    const lbl = (text, h, color, x, y, z = 0, w = 700) => add(K.label(text, h, color, w), x, y, z);
    const stage = (show) => { const g = new THREE.Group(); scene.add(g); beats.push((t) => { g.visible = show(t); }); return g; };
    const into = (g, o, x = 0, y = 0, z = 0) => { o.position.set(x, y, z); g.add(o); return o; };
    const gold = M.glow(0xffc04d, 2.8), eGeo = new THREE.SphereGeometry(0.055, 16, 12);
    const flyer = (path, on, s = 1) => {                                // a gold electron with a glowing comet trail
      const e = add(new THREE.Mesh(eGeo, gold)); e.add(K.glowSprite(0xffc04d, 0.32)); e.scale.setScalar(s);
      const trail = Array.from({ length: 9 }, (_, k) => { const g = add(K.glowSprite(0xffc04d, 0.22 * s * (1 - k / 10))); g.material.opacity = 0.55 * (1 - k / 9); return g; });
      beats.push((t) => {
        const o = on(t); e.visible = o; if (o) e.position.copy(path(t));
        trail.forEach((g, k) => { const tk = t - (k + 1) * 0.035; g.visible = o && on(tk); if (g.visible) g.position.copy(path(tk)); });
      });
    };
    const goldify = (x) => { if (x.e.material !== gold) { x.e.material = gold; x.e.children[0].material = x.e.children[0].material.clone(); x.e.children[0].material.color.set(0xffc04d); } };
    const sparkAt = (p, t0, s = 0.25, c = 0xbfe0ff) => { const sp = add(K.sparkle(c, s)); sp.position.copy(p); beats.push((t) => { const f = Math.sin(Math.PI * span(t, t0, t0 + 0.7)); sp.visible = f > 0.01; sp.scale.setScalar(s * f + 1e-4); sp.material.rotation = t; }); };

    // ================================================================ LIFE · the table with things we know, the chart behind
    const gL = stage((t) => t < T.ca - 0.05 || t >= T.sea - 0.05); ST.bake(gL, 'life', LX, 3.6, 1.5);
    const tops = [];
    {
      const b = into(gL, K.bone(0.5), LX + OBJ[0][1], 0, OBJ[0][2]); b.rotation.y = 0.3;
      into(gL, K.tooth(0.09), LX + OBJ[1][1], 0, OBJ[1][2]);
      into(gL, K.eggShell(0.1), LX + OBJ[2][1], 0, OBJ[2][2]);
      const lf = into(gL, K.leaf(0.5), LX + OBJ[3][1], 0, OBJ[3][2]); lf.rotation.y = 0.35;
      const gl = into(gL, new THREE.Group(), LX + OBJ[4][1], 0, OBJ[4][2]); gl.add(K.beaker(0.15, 0.34)); const sw = K.liquid(0.14, 0.26, 0x2f9fb0, 0.5); sw.position.y = 0.052; gl.add(sw);
      const ions = Array.from({ length: 8 }, () => { const s = K.glowSprite(0x8fc0ff, 0.04); gl.add(s); return s; });
      beats.push((t) => ions.forEach((s, k) => { s.visible = t > T.sea + 0.6; s.position.set(0.09 * Math.sin(t * 0.5 + k * 2.1), 0.08 + 0.17 * (0.5 + 0.5 * Math.sin(t * 0.37 + k * 1.3)), 0.09 * Math.cos(t * 0.43 + k * 1.7)); }));
      OBJ.forEach(([name, x, z], i) => {
        tops.push(V(LX + x, TOPY[i], z));
        const l = lbl(name, 0.075, '#ffffff', LX + x, TOPY[i] + 0.1, z + 0.05); beats.push((t) => K.popIn(l, t, NAME(i), T.rise + 0.4 + i * 0.9));
      });
      // the payoff labels (back on this table at the end)
      const lSea = lbl('sea water: magnesium halides', 0.06, '#a8c4ff', LX + 1.2, 0.56, 0.1), lMgIon = lbl('Mg²⁺', 0.05, '#a8c4ff', LX + 1.38, 0.2, 0.2);
      const lLeaf = lbl('chlorophyll: magnesium inside', 0.055, '#ffffff', LX + 0.55, 0.2, 0.2);
      const lCa = lbl('calcium', 0.07, '#a8c4ff', LX - 0.6, 0.38, 0.16), lP = lbl('bone: calcium phosphate', 0.05, '#ffffff', LX - 1.15, 0.2, 0.32);
      beats.push((t) => {
        K.popIn(lSea, t, T.sea + 0.5, T.leaf - 0.4); K.popIn(lMgIon, t, T.sea + 1.4, T.leaf - 0.4);
        K.popIn(lLeaf, t, T.leaf + 2.2, T.bone - 0.4); K.popIn(lCa, t, T.bone + 2.2, T.end); K.popIn(lP, t, T.bone + 3.0, T.end);
      });
      // the chart: a dark board on two posts at the back of the table
      const board = into(gL, K.solid(new THREE.BoxGeometry(3.1, 1.46, 0.04), M.matte(0x1d222c, 0.6)), LX, BY, BZ);
      [-1.3, 1.3].forEach((x) => into(gL, K.solid(new THREE.CylinderGeometry(0.018, 0.022, BY - 0.73, 12), M.metal(0x8d939b, 0.4), { outline: false }), LX + x, (BY - 0.73) / 2, BZ - 0.035));
      board.castShadow = true;
      const rest = []; for (let z = 1; z <= 118; z++) { const [r, c] = place(z); if (r <= 7 && (c !== 2 || r === 1)) rest.push({ r, c }); }
      const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(0.14, 0.14, 0.02), M.gloss(GREY), rest.length); gL.add(inst);
      const m4 = new THREE.Matrix4(); rest.forEach(({ r, c }, i) => { m4.makeTranslation(COL(c), TY(r), BZ + 0.032); inst.setMatrixAt(i, m4); });
    }
    // the hook tiles: Ca, Ca, Ca, Mg, Mg rise out of the things and fly into column IIA; Be, Sr, Ba, Ra light up after
    const SLOTSYM = ['Ca', 'Ca', 'Ca', 'Mg', 'Mg'], firstIn = { Be: T.col + 0.9, Sr: T.col + 1.4, Ba: T.col + 1.9, Ra: T.col + 2.4 };
    SLOTSYM.forEach((s, i) => { firstIn[s] = Math.min(firstIn[s] ?? 1e9, TR(i) + 2.2); });
    const grey = new THREE.Color(GREY), blue = new THREE.Color(MET);
    Object.entries(IIA).forEach(([s, r], i) => {
      const tl = into(gL, K.tile(s, GREY, 0.14, 0.14, 0.03), CX, TY(r), TZ); tl.traverse((o) => { o.castShadow = false; });
      const body = tl.userData.body.material, txt = tl.userData.text, ion = K.label(`${s}²⁺`, 0.065, '#ffd27a', 700); ion.position.z = 0.02; tl.add(ion);
      const sw = WAVE(ROW.findIndex(([x]) => x === s)) + 1.2;
      beats.push((t) => {
        const k = ease(span(t, firstIn[s], firstIn[s] + 0.3)), glow = Math.sin(Math.PI * span(t, firstIn[s], firstIn[s] + 0.6));
        body.color.copy(grey).lerp(blue, k); tl.position.z = TZ + 0.05 * glow;
        tl.scale.setScalar(1 + 0.2 * Math.sin(Math.PI * span(t, T.end + 5.4 + i * 0.25, T.end + 6.0 + i * 0.25)));   // the answer lights the column once more
        K.popIn(txt, t, -1, sw); if (t < sw) txt.visible = true; K.popIn(ion, t, sw + 0.35);
      });
    });
    const lGrp = lbl('group IIA: alkaline earth metals', 0.065, '#ffd27a', CX + 0.62, TY(1) + 0.02, TZ + 0.03);
    beats.push((t) => (t < T.ca ? K.popIn(lGrp, t, T.col + 2.6, T.card - 0.2) : K.popIn(lGrp, t, T.end + 2.6)));
    SLOTSYM.forEach((s, i) => {
      const tl = add(K.tile(s, MET, 0.14, 0.14, 0.03)), up = tops[i].clone().add(V(0, 0.16, 0)), dest = V(CX, TY(IIA[s]), TZ + 0.04);
      sparkAt(tops[i].clone().add(V(0, 0.03, 0)), TR(i) - 0.2);
      beats.push((t) => {
        const r = back(span(t, TR(i), TR(i) + 0.5)), u = span(t, TR(i) + 0.8, TR(i) + 2.3);   // rise and hover, then fly
        tl.visible = t > TR(i) && u < 0.9; tl.scale.setScalar(Math.max(1e-4, r));
        tl.position.copy(u <= 0 ? tops[i].clone().lerp(up, ease(span(t, TR(i), TR(i) + 0.6))) : K.arc(up, dest, 0.25, ease(u)));
      });
    });

    // ================================================================ ALKALINE · calcium in water, red litmus → blue
    {
      const gW = stage((t) => t >= T.ca - 0.05 && t < T.atom); ST.bake(gW, 'water', WX, 2.0, 1.2);
      into(gW, K.beaker(0.26, 0.55), WX, 0, 0); const water = into(gW, K.liquid(0.25, 0.38, 0x5aa0d8, 0.38), WX, 0.055, 0);
      const wm = water.children.map((c) => c.material), w0 = wm.map((m) => [m.color.clone(), m.opacity]), milky = new THREE.Color(0xdfe6ea);
      const ca = into(gW, K.lump(0.06, M.metal(0xd6d9de, 0.3), 5, 0.75)), fz = into(gW, K.bubbles(26, V(), SURF, 0.12, 0.014)), spl = into(gW, K.splash(0xffffff, 0.3), WX, SURF, 0);
      const tg = into(gW, K.tongs(0.6)), paper = into(gW, K.paperStrip([[0, 0], [0.2, 0], [0.42, 0]], 0.06, 0xd9606c, 0x4a6fd0, 0.006));
      const lCa = lbl('calcium', 0.1, '#ffffff', WX - 0.34, 1.0, 0), lW = lbl('water', 0.1, '#bfe0ff', WX - 0.45, 0.3, 0.2);
      const lRed = lbl('red litmus', 0.1, '#ff9aa4', WX - 0.5, 0.8, 0), lBlue = lbl('blue: an alkali ✓', 0.11, '#9ec0ff', WX - 0.52, 0.8, 0);
      const HOLD = V(WX, 0.98, 0), UP = V(WX, 2.3, 0), PTOP = V(WX + 0.12, 0.54, 0), LAND = T.drop + 0.3;
      beats.push((t) => {
        let p; if (t < T.lit) p = HOLD.clone().lerp(UP, easeIn(span(t, T.drop + 0.4, T.drop + 1.6))); else p = UP.clone().setX(PTOP.x).lerp(PTOP, 1 - (1 - span(t, T.lit, T.lit + 1.6)) ** 2);
        tg.position.copy(p); tg.visible = (t < T.drop + 1.6 || t > T.lit) && t < T.push + 0.8;
        tg.userData.set(t < T.lit ? 0.04 + 0.04 * ease(span(t, T.drop - 0.15, T.drop + 0.05)) : 0.012);
        const fall = K.drop(t, T.drop, HOLD.y - 0.05, SURF, 0.3, 0);
        let y = fall.y; if (t > LAND) y = lerp(SURF, 0.1, ease(span(t, LAND, LAND + 1.0)));
        ca.position.set(WX, y, 0); ca.scale.setScalar(1 - 0.3 * span(t, LAND + 1, T.push)); ca.rotation.y = t * 0.4;
        spl.userData.update(t - LAND);
        fz.userData.update(t, span(t, LAND + 0.3, LAND + 1.0), V(WX, y + 0.03, 0));
        const cl = ease(span(t, LAND + 0.8, T.lit + 2));
        wm.forEach((m, i) => { m.color.copy(w0[i][0]).lerp(milky, 0.45 * cl); m.opacity = w0[i][1] + 0.12 * cl; });
        paper.position.copy(p).add(V(0, -0.42, 0)); paper.visible = t > T.lit && tg.visible;
        paper.userData.wet(0.36 * ease(span(t, T.lit + 2.0, T.lit + 4.0)));
        lCa.position.set(WX - 0.32, Math.max(y, 0.25) + 0.12, 0); K.popIn(lCa, t, T.ca + 0.4, T.lit - 0.6); K.popIn(lW, t, T.ca + 0.9, T.lit - 0.6);
        K.popIn(lRed, t, T.lit + 0.9, T.lit + 3.8); K.popIn(lBlue, t, T.lit + 4.2, T.push + 0.4);
      });
    }

    // ================================================================ INSIDE (dark) · calcium → Ca²⁺ (like argon); then all six
    const atomAt = (x, shells, p, n, r0, dr, small = false, y = CA.y) => {
      const A = K.atom(shells, p, n, r0, dr); A.group.position.set(x, y, 0); scene.add(A.group);
      if (small) { A.group.children[0].scale.setScalar(0.45); A.electrons.forEach((e) => { if (e.shell < shells.length - 1) { e.e.scale.setScalar(0.5); e.e.children[0].scale.setScalar(0.4); } }); }
      return A;
    };
    const seatW = (A, outer, x, t) => A.rings[outer].localToWorld(V(Math.cos(x.a0 + t * x.w) * x.R, 0, Math.sin(x.a0 + t * x.w) * x.R));
    {
      const A = atomAt(CA.x, [2, 8, 8, 2], 20, 20, 0.45, 0.3), up = 0.75 * CAR + 0.45, low = -0.9 * CAR - 0.5;
      const ul = (text, h, color, x, y) => lbl(text, h, color, x, CA.y + y, 0);
      const nm = ul('calcium atom (Ca)', 0.3, '#ffffff', CA.x, up), ion = ul('Ca²⁺', 0.42, '#ffffff', CA.x, up);
      const l2 = ul('2 outer electrons (sub-shell s)', 0.26, '#ffd27a', CA.x, low), lIE = ul('easy to remove: low ionization energy', 0.24, '#ffd27a', CA.x, low);
      const eq = ul('Ca → Ca²⁺ + 2e⁻', 0.3, '#ffd27a', CA.x, low);
      const Ar = atomAt(ARX, [2, 8, 8], 18, 22, 0.45, 0.3), nAr = ul('argon (Ar): a noble gas', 0.28, '#ffffff', ARX, 0.75 * 1.05 + 0.45);
      const same = ul('same 2, 8, 8: stable ✓', 0.3, '#9fe0b4', (CA.x + ARX) / 2, -1.55);
      const out = A.electrons.filter((x) => x.shell === 3), goldT = T.atom + 2.4;
      out.forEach((x, j) => {
        const tj = LEAVE(j), dir = V(0.9, 0.55 + 0.25 * j, 0.45 - 0.3 * j).normalize();
        flyer((t) => seatW(A, 3, x, tj).addScaledVector(dir, 3.4 * easeIn(span(t, tj, tj + 1.5))), (t) => t > tj && t < tj + 1.5);
        beats.push((t) => { if (t > goldT) goldify(x); x.e.visible = t <= tj; x.e.scale.setScalar(1 + 0.5 * Math.sin(Math.PI * span(t, goldT, goldT + 1.0))); });
      });
      beats.push((t) => {
        A.group.visible = t > T.atom - 0.1 && t < T.row; A.update(t);
        A.rings[3].children[0].material.opacity = 0.55 * (1 - span(t, GONE, GONE + 0.8));
        const ax = ARX + 3.0 * (1 - ease(span(t, T.ar + 0.2, T.ar + 2.2))); Ar.group.position.x = ax; Ar.group.visible = t > T.ar && t < T.row; Ar.update(t);
        nAr.position.x = ax;
        const fl = Math.sin(Math.PI * span(t, T.ar + 2.6, T.ar + 3.6));
        [0, 1, 2].forEach((k) => { A.rings[k].children[0].material.opacity = Ar.rings[k].children[0].material.opacity = 0.55 + 0.45 * fl; });
        K.popIn(nm, t, T.atom + 1.4, GONE + 0.3); K.popIn(ion, t, GONE + 0.7, T.row - 0.3);
        K.popIn(l2, t, T.atom + 2.8, T.off - 0.1); K.popIn(lIE, t, T.off + 0.3, GONE + 1.4); K.popIn(eq, t, GONE + 1.8, T.ar - 0.1);
        K.popIn(nAr, t, T.ar + 1.6, T.row - 0.3); K.popIn(same, t, T.ar + 3.0, T.row - 0.3);
      });
    }
    ROW.forEach(([s, shells, p, n], i) => {
      const P = RP(i), A = atomAt(P.x, shells, p, n, 0.22, 0.11, true, P.y), o = shells.length - 1, R = RR[i];
      const nm = lbl(s, 0.32, '#ffffff', P.x, P.y + 0.75 * R + 0.3, 0), ion = lbl(`${s}²⁺`, 0.32, '#ffd27a', P.x, P.y + 0.75 * R + 0.3, 0);
      const out = A.electrons.filter((x) => x.shell === o), seen = T.row + 0.7 + i * 0.85;
      out.forEach((x, j) => {
        const tj = WAVE(i) + j * 0.2, dir = V(j ? 0.8 : -0.8, 1.0, 0.4).normalize();
        flyer((t) => seatW(A, o, x, tj).addScaledVector(dir, 1.6 * easeIn(span(t, tj, tj + 1.2))), (t) => t > tj && t < tj + 1.2, 0.8);
        beats.push((t) => { if (t > seen) goldify(x); x.e.visible = t <= tj; x.e.scale.setScalar(1 + 0.6 * Math.sin(Math.PI * span(t, seen, seen + 0.8))); });
      });
      beats.push((t) => {
        A.group.visible = t > T.row - 0.05 && t < T.free; A.update(t);
        A.rings[o].children[0].material.opacity = 0.55 * (1 - span(t, WAVE(i) + 0.4, WAVE(i) + 1.0));
        K.popIn(nm, t, seen - 0.2, WAVE(i) + 0.5); K.popIn(ion, t, WAVE(i) + 0.9, T.free - 0.1);
      });
    });

    // ================================================================ EARTH · a slice of the ground with crystal pockets
    {
      const gG = stage((t) => t >= T.free - 0.05 && t < T.sea); ST.bake(gG, 'ground', GX, 3.4, 1.5);
      const sl = into(gG, K.earthBlock(SW, SH, SD), GX, 0, 0);
      const near = (p) => POCK.some(([, x, y]) => Math.hypot(p.x - x, p.y - y) < 0.2);
      const grains = sl.userData.spots.filter((p) => !near(p)).map((p, k) => { const s = K.glowSprite(k % 5 === 4 ? 0xffd27a : 0x8fc0ff, 0.06); s.position.copy(p); sl.add(s); return { s, t0: T.rock + 2.2 + k * 0.04 }; });
      beats.push((t) => grains.forEach(({ s, t0 }) => K.popIn(s, t, t0, T.sea)));
      const lRock = lbl('Mg²⁺, Ca²⁺ (with Na⁺, K⁺) in the rock', 0.11, '#ffffff', GX, SH + 0.16, FACE);
      beats.push((t) => K.popIn(lRock, t, T.rock + 2.6, T.min - 0.3));
      const holeM = M.matte(0x1c1611, 0.95), lipM = M.matte(0x6e665c, 0.9);   // a hollow in the rock: a dark opening with a rough rim
      const hollow = (x, y, rx, ry) => {
        const m = new THREE.Mesh(new THREE.CircleGeometry(1, 40), holeM); m.scale.set(rx, ry, 1); into(gG, m, GX + x, y, FACE + 0.006);
        const lip = K.solid(new THREE.TorusGeometry(1, 0.09, 10, 40), lipM, { outline: false }); lip.scale.set(rx, ry, 0.25); into(gG, lip, GX + x, y, FACE + 0.004);
      };
      const crystal = (kind, seed, x, y, s, n, r = 0.1) => { const c = K.crystals(kind, seed, { base: false, n, r }); c.rotation.x = Math.PI / 2; c.scale.setScalar(s); return into(gG, c, GX + x, y, FACE + 0.006); };
      const P = Object.fromEntries(POCK.map(([k, x, y]) => [k, [x, y]]));
      hollow(...P.gyp, 0.16, 0.12); const gyp = crystal('gypsum', 2, ...P.gyp, 0.6, 12);
      hollow(...P.eps, 0.14, 0.11); crystal('epsomite', 4, ...P.eps, 0.75, 30);
      hollow(...P.bar, 0.15, 0.12); crystal('barite', 5, ...P.bar, 0.6, 8);
      hollow(...P.ber, 0.13, 0.11); crystal('beryl', 7, ...P.ber, 0.6, 6, 0.08);
      hollow(...P.min, 0.19, 0.12); crystal('apatite', 3, P.min[0] - 0.08, P.min[1], 0.5, 5, 0.07); crystal('fluorite', 9, P.min[0] + 0.09, P.min[1], 0.5, 5, 0.07);
      hollow(...P.ra, 0.06, 0.05);
      const ra = add(K.glowSprite(0x7fc8ff, 0.12)); ra.position.set(GX + P.ra[0], P.ra[1], FACE + 0.02);
      const raSp = Array.from({ length: 8 }, () => add(K.glowSprite(0xbfe4ff, 0.025)));
      beats.push((t) => {
        ra.visible = gG.visible; ra.material.opacity = 0.7 + 0.25 * Math.sin(t * 6);
        raSp.forEach((s, i) => { const u = (t * 0.8 + K.hash(i, 1)) % 1, a = K.hash(i, 2) * 6.283; s.visible = gG.visible && t > T.ra; s.position.set(GX + P.ra[0] + Math.cos(a) * u * 0.18, P.ra[1] + Math.sin(a) * u * 0.18, FACE + 0.03); s.material.opacity = 1 - u; });
      });
      const L = [['gyp', 'gypsum · CaSO₄'], ['eps', 'Epsom salt · MgSO₄'], ['bar', 'barite · BaSO₄'], ['ber', 'beryl: beryllium (a little)'], ['ra', 'radium: rare, radioactive']];
      const T1 = { gyp: T.eps, eps: T.bar, bar: T.ber, ber: T.rock, ra: T.sea };
      L.forEach(([k, text]) => { const l = lbl(text, 0.05, '#ffffff', GX + P[k][0], P[k][1] + 0.17, FACE + 0.05); beats.push((t) => K.popIn(l, t, (k === 'gyp' ? T.gyp + 0.3 : T[k] + 2.2), T1[k] - 0.3)); sparkAt(V(GX + P[k][0], P[k][1], FACE + 0.06), k === 'gyp' ? T.gyp - 0.4 : T[k] + 1.8, 0.2); });
      const lA = lbl('calcium phosphate', 0.045, '#ffffff', GX + P.min[0] - 0.12, P.min[1] + 0.16, FACE + 0.05), lF = lbl('calcium fluoride', 0.045, '#d9b8ff', GX + P.min[0] + 0.12, P.min[1] - 0.16, FACE + 0.05);
      beats.push((t) => { K.popIn(lA, t, T.min + 2.2, T.ra - 0.3); K.popIn(lF, t, T.min + 2.9, T.ra - 0.3); });
      const lGround = lbl('a slice of the ground', 0.08, '#ffffff', GX, SH + 0.12, FACE);
      beats.push((t) => K.popIn(lGround, t, T.free + 0.4, T.free + 4.0));
      // never free: a Ca²⁺ and a sulphate ion fly into the first pocket = what gypsum is made of
      const C0 = V(GX + P.gyp[0], P.gyp[1], FACE + 0.1);
      const caI = add(new THREE.Group()); caI.add(K.solid(new THREE.SphereGeometry(0.035, 32, 20), M.gloss(MET)));
      const so4 = add(new THREE.Group()); so4.add(K.solid(new THREE.SphereGeometry(0.028, 32, 20), M.gloss(0xe8c83a)));
      [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].forEach((d) => { const o = K.solid(new THREE.SphereGeometry(0.021, 24, 16), M.gloss(0xe0483c)); o.position.set(...d).multiplyScalar(0.024); so4.add(o); });
      const lCaI = lbl('Ca²⁺', 0.05, '#a8c4ff', 0, 0, 0), lSO = lbl('sulphate SO₄²⁻', 0.05, '#ffe08a', 0, 0, 0), lPair = lbl('calcium sulphate', 0.055, '#ffffff', C0.x, C0.y + 0.19, C0.z);
      const A0 = C0.clone().add(V(-0.32, 0.12, 0.08)), B0 = C0.clone().add(V(0.32, 0.1, 0.08)), F0 = T.free + 4.6, J = F0 + 1.6, IN = J + 1.2;
      beats.push((t) => {
        const u = ease(span(t, F0, J)), sh = 1 - ease(span(t, IN, IN + 0.6));
        caI.position.copy(K.arc(A0, C0.clone().add(V(-0.045, 0.01, 0.04)), 0.06, u)).lerp(C0, ease(span(t, IN, IN + 0.6)));
        so4.position.copy(K.arc(B0, C0.clone().add(V(0.05, 0.01, 0.04)), 0.06, u)).lerp(C0, ease(span(t, IN, IN + 0.6)));
        so4.rotation.y = t * 0.8; caI.visible = so4.visible = t > F0 - 0.4 && sh > 0.01 && gG.visible;
        caI.scale.setScalar(Math.max(1e-4, sh * back(span(t, F0 - 0.4, F0)))); so4.scale.setScalar(Math.max(1e-4, sh * back(span(t, F0 - 0.4, F0))));
        lCaI.position.copy(caI.position).add(V(-0.04, 0.07, 0)); lSO.position.copy(so4.position).add(V(0.06, 0.07, 0));
        K.popIn(lCaI, t, F0 - 0.2, J - 0.6); K.popIn(lSO, t, F0, J - 0.6); K.popIn(lPair, t, J - 0.1, T.gyp);
        gyp.scale.setScalar(0.6 * (1 + 0.12 * Math.sin(Math.PI * span(t, IN + 0.3, IN + 1.0))));
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Why "alkaline earth" metals?', intro: INTRO, ticks: TICKS,
      rows: [[0, '1 · "Alkaline"'], [1, 'they make alkalies'], [0, '2 · Inside the atom'], [1, '2 outer electrons, lost easily'], [1, 'then like a noble gas: stable'],
        [1, 'all six: M²⁺ ions'], [0, '3 · "Earth"'], [1, 'too reactive to be found free'], [1, 'found all through the earth']],
      short: ['make alkalies', 'lose 2 electrons', 'like a noble gas', 'all six: M²⁺', 'never found free', 'all through the earth'] }));

    return (t, dt) => { for (const b of beats) b(t, dt); };
  },
};
