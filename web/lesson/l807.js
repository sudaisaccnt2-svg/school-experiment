// Lesson 807 · Sodium (book pp. 229–230: occurrence, Fig. 8.2, (a) position, Table 8.4 physical properties), v1 (2026-10-13).
// Built from SKILL §0 + the approved 805 v3 / 806 pattern: a hook from real life on a baked table, ONE question on a
// card, dark atom close-ups, one test per shot (question → before → visible cause → ✓ result), back to the hook at the end.
// THE QUESTION: "Why do we never see sodium metal?" → card: The metal set free · Look inside · What else is it like?
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//   HOOK    a table: a dish of table salt, a glass of sea water, a lump of rock salt, named; each gets its formula
//           (NaCl · NaCl NaBr NaI · rock salt = deposits) and a gold "Na" · sodium is in all of them, but nobody finds
//           the metal → card "Why do we never see sodium metal?"
//   KNIFE   chemists can set it free: a block of sodium on a tile. "Can a knife cut a metal?" the knife slices it like
//           cheese (soft), the cut face is shiny silvery white, in seconds it goes dull (tick 1) · why so quick? dive in.
//   INSIDE  (dark) one sodium atom: 11 protons (atomic number 11) · 3 shells 2, 8, 1 · 1 outer electron (gold) · the
//           atom shrinks into its tile: period 3 (3 shells, first element), group IA (1 outer electron, third: H Li Na),
//           an alkali metal (tick 2) · back out: a chlorine atom takes the outer electron at once → Na⁺ Cl⁻ hold
//           together = salt → never found free (tick 3).
//   METAL   set free, what else is it like? a piece floats on water: 0.971 g/cm³ (tick 4) · heated in a dish beside a
//           thermometer it melts at 97.6 °C, below boiling water; boils only at 880 °C (tick 5) · a hammer flattens a
//           ball (malleable), clamps pull a rod into a wire (ductile), pulled harder it snaps (low tensile strength)
//           (tick 6) · a strip closes a circuit (bulb lights), a rod on a hot plate melts wax beads one by one: a good
//           conductor of heat and electricity (tick 7).
//   END     back to the salt table: soft, shiny, light metal; its 1 electron leaves so easily it is only found joined.
// Book points (all): never free (very reactive) · sea water NaCl NaBr NaI · deposits as rock salt · Fig. 8.2 sodium cut
// with a knife · alkali metal, symbol Na, atomic number 11, first element of period 3, third member of group IA, three
// shells, one valence electron · Table 8.4: silvery white solid; soft, cut with a knife; density 0.971 g cm⁻³; mp
// 97.6 °C; bp 880 °C; relatively low tensile strength; lighter than water, floats; malleable and ductile; good conductor
// of heat and electricity · freshly cut shiny, rapidly tarnishes. (p.229 top IA → IIA paragraph: in lesson 806.)
// Memorize-only (Table 8.4 numbers) → 🎮 game (COVERAGE_U8).
// §1 CHECK (sheets renders/lesson/d807*.jpg, 807_screens.jpg): nothing missing ✓ · one question + bridges ✓ · real-life
// hook (salt) paid off at the end ✓ · things students know (salt, sea water, knife, hammer, bulb, wax) ✓ · each test:
// question → before → visible cause → ✓ label ✓ · one place at a time ✓ · camera moves ≥ 2 s ✓ · ≤ 3 labels a shot ✓ ·
// baked tables, dark atoms ✓ · every screen (shot_screens) ✓ · flicker 0 ✓.
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

// ---------------------------------------------------------------- places (stations 10 apart: a shot never sees another)
const SH = -1.2, SEA = 0, RS = 1.2;                                    // the hook table: salt dish · sea water · rock salt
const KX = 19.55, TT = 0.032, PCX = KX + 0.6, PCZ = 0.22, WX = 20.75, BR = 0.22, Y0 = 0.055, SURF = Y0 + 0.3;   // knife tile · small piece · water glass
const HX = 30, DISH = 0.752, BEAD = DISH + 0.016;                        // the tripod and dish (dish bottom), the piece in it
const AX = 39.0, AT = 0.36, XL = 40.35, L0 = 0.3;                        // anvil · pulling clamps
const CX = 48.65, RX = 51.6;                                             // circuit · hot-plate rod
const NAX = 60, AY = 1.9, RN = 0.72 * 1.86, RC = 0.95;                   // the sodium atom (radius 1.86 Å), chlorine
const TBX = 69, TP = 0.5, COL = (c) => TBX + (c - 9.5) * TP, TY = (r) => 3.6 - (r - 1) * TP;   // the periodic table (dark)
const FACE = V(KX - 0.136, TT + 0.122, 0.045), FN = [0.07, 0.3, 1];  // the cut face of the left half (after it turns)

// ---------------------------------------------------------------- time (every camera move ≥ 2 s)
const T = {
  nacl: 4.6, sea: 8.6, rock: 12.6, all: 16.6, why: 20.0, card: 23.0, free: 28.0, knife: 31.0, tarn: 38.5, dive: 42.0,
  atom: 44.6, z: 47.0, sh: 50.0, val: 53.5, fly: 56.0, row: 59.0, col: 62.5, alk: 66.0, back: 68.5, cl: 71.0, hop: 73.5,
  ions: 75.5, saltL: 77.5, never: 80.0, float: 83.0, heat: 95.5, bp: 107.0, ham: 110.0, pull: 117.5, snap: 125.0,
  elec: 130.0, ht: 137.0, end: 150.0,
};
T.done = T.end + 13.0; DOCK = T.card + 5.0;
const C0 = T.knife + 2.0;                                                // the knife goes through
const TG = T.float + 3.0, FL = TG + 4.3;                                 // tongs pick up the piece · it lands on the water
const FIRE = T.heat + 3.0, MP = T.heat + 7.5;                            // the burner is lit · the thermometer reads 97.6
const HITS = [T.ham + 2.3, T.ham + 3.3, T.ham + 4.3];                    // the hammer lands
const SNAP = T.snap + 1.2;                                               // the wire breaks
const LIT = T.elec + 3.45;                                               // the strip closes the gap
const HOT = T.ht + 2.5, BEADX = [RX + 0.22, RX + 0.02, RX - 0.18, RX - 0.36], MELTW = BEADX.map((x) => HOT + 0.8 + (RX + 0.4 - x) * 6.0);
const INTRO = [T.card, DOCK];
const TICKS = [[T.dive - 0.6, 0], [T.alk + 1.6, 1], [T.never + 1.6, 2], [FL + 3.6, 3], [T.bp + 1.6, 4], [SNAP + 2.6, 5], [T.end - 1.0, 6]];

const captions = [
  [0.3, T.nacl, 'Salt from the kitchen, the sea and the ground'],
  [T.nacl, T.sea, 'Table salt is sodium chloride (NaCl)'],
  [T.sea, T.rock, 'Sea water holds NaCl, NaBr and NaI'],
  [T.rock, T.all, 'Rock salt is dug from deposits'],
  [T.all, T.why, 'All of them hold sodium (Na), a metal'],
  [T.why, T.card, 'Yet nobody finds the metal itself. Why?'],
  [T.card, T.free, 'Why do we never see sodium metal?'],
  [T.free, T.knife, 'Chemists can set it free: here it is'],
  [T.knife, C0 + 0.8, 'Can a knife cut this metal?'],
  [C0 + 0.8, C0 + 3.4, 'Yes! Sodium is soft: a knife cuts it'],
  [C0 + 3.4, T.tarn, 'Inside it is shiny, silvery white'],
  [T.tarn, T.dive, 'In seconds, the air dulls it ✓'],
  [T.dive, T.atom + 1.0, 'Why so quick? Look inside'],
  [T.atom + 1.0, T.z, 'One sodium atom'],
  [T.z, T.sh, '11 protons: atomic number 11'],
  [T.sh, T.val, 'Electrons in 3 shells: 2, 8, 1'],
  [T.val, T.fly, 'Only 1 electron in the outer shell'],
  [T.fly, T.row, 'Where does it sit in the periodic table?'],
  [T.row, T.col, '3 shells: period 3, its first element'],
  [T.col, T.alk, '1 outer electron: group IA, third member'],
  [T.alk, T.back, 'Sodium (Na): an alkali metal ✓'],
  [T.back, T.cl, 'That 1 outer electron leaves very easily'],
  [T.cl, T.hop, 'A chlorine atom comes close…'],
  [T.hop, T.ions, '…and takes the electron at once'],
  [T.ions, T.saltL, 'Now Na⁺ and Cl⁻ hold together'],
  [T.saltL, T.never, 'That is salt: sodium chloride'],
  [T.never, T.float, 'So sodium is never found free ✓'],
  [T.float, TG, 'Set free, what else is it like?'],
  [TG, FL, 'Will a piece sink or float on water?'],
  [FL, T.heat, 'It floats: lighter than water ✓'],
  [T.heat, FIRE, 'At what temperature does it melt?'],
  [FIRE, MP, 'Heat it gently, watch the thermometer'],
  [MP, T.bp, 'It melts at 97.6 °C: below boiling water ✓'],
  [T.bp, T.ham, 'It boils only at 880 °C'],
  [T.ham, HITS[0], 'Hit a sodium ball with a hammer'],
  [HITS[0], T.pull, 'It goes flat, not broken: malleable'],
  [T.pull, T.pull + 2.5, 'Now pull a sodium rod'],
  [T.pull + 2.5, T.snap, 'It stretches into a wire: ductile'],
  [T.snap, SNAP + 0.3, 'Pull harder…'],
  [SNAP + 0.3, T.elec, 'It snaps easily: low tensile strength ✓'],
  [T.elec, LIT, 'Does sodium carry electricity?'],
  [LIT, T.ht, 'Yes: the bulb lights'],
  [T.ht, HOT, 'And does it carry heat?'],
  [HOT, MELTW[3] + 0.6, 'Heat flows along it: the wax melts'],
  [MELTW[3] + 0.6, T.end, 'A good conductor of heat and electricity ✓'],
  [T.end, T.end + 4.2, 'Its 1 electron leaves so easily…'],
  [T.end + 4.2, T.end + 8.4, '…everywhere it is Na⁺, joined'],
  [T.end + 8.4, T.done, 'So we never see sodium metal ✓'],
];

// ---------------------------------------------------------------- camera
const SALTW = (t, k = 1, e) => S(t, [0, 0.27, 0.02], 3.3 * k, 1.0 * k, ADIR, e);
const SK = (t, x, k = 1, e) => S(t, [x, 0.22, 0], 0.95 * k, 0.72 * k, ADIR, e);
const KW = (t, k = 1, e) => S(t, [(KX + WX) / 2 - 0.05, 0.3, 0], 2.15 * k, 0.95 * k, ADIR, e);
const KB = (t, k = 1, e) => S(t, [KX + 0.06, 0.3, 0.02], 1.05 * k, 0.86 * k, ADIR, e);
const WB = (t, k = 1, e) => S(t, [WX, 0.42, 0], 0.8 * k, 0.8 * k, ADIR, e);
const HT = (t, k = 1, e) => S(t, [HX - 0.12, 0.66, 0], 1.3 * k, 1.38 * k, ADIR, e);
const HC = (t, k = 1, e) => S(t, [HX + 0.12, 0.97, 0], 1.05 * k, 0.62 * k, ADIR, e);
const AN = (t, k = 1, e) => S(t, [AX + 0.15, 0.5, 0], 1.5 * k, 1.2 * k, ADIR, e);
const VS = (t, k = 1, e) => S(t, [XL + 0.62, 0.17, 0], 1.55 * k, 0.66 * k, ADIR, e);
const EC = (t, k = 1, e) => S(t, [CX, 0.42, 0], 2.5 * k, 1.2 * k, ADIR, e);
const RD = (t, k = 1, e) => S(t, [RX - 0.02, 0.22, 0], 1.45 * k, 0.72 * k, ADIR, e);
const ATOM = (t, x, R, k = 1, e) => { const h = (1.5 * R + 1.5) * k; return S(t, [x, AY, 0], h * 1.2, h, DDIR, e); };
const TAB = (t, k = 1, e) => S(t, [TBX, TY(4), 0], 9.6 * k, 3.9 * k, DDIR, e);
const PAIR = (t, k = 1, e) => S(t, [61.3, AY - 0.1, 0], 5.4 * k, 3.6 * k, DDIR, e);
const cams = [
  // HOOK (baked table): wide, each thing close in turn, wide again for the question
  SALTW(0, 1.06), SALTW(T.nacl - 0.4, 1.0), SK(T.nacl + 1.6, SH, 1.05), SK(T.sea, SH, 0.98), SK(T.sea + 2.0, SEA, 1.05), SK(T.rock, SEA, 0.98),
  SK(T.rock + 2.0, RS, 1.05), SK(T.all, RS, 0.98), SALTW(T.all + 2.2, 1.04), SALTW(T.card, 0.99), SALTW(T.free - 0.05, 0.97),
  // KNIFE (cut): the block and the glass, push to the block, dive into the dull cut face
  KW(T.free, 1.05), KW(T.knife - 0.4, 1.0), KB(C0 - 0.4, 1.05), KB(T.tarn, 0.98), KB(T.dive, 0.94),
  S(T.atom - 0.05, FACE.toArray(), 0.05, 0.035, FN, 'in'),
  // INSIDE (dark): the atom, it flies into the table, back out, chlorine comes
  ATOM(T.atom, NAX, RN, 0.25), ATOM(T.atom + 2.0, NAX, RN, 1.05, 'out'), ATOM(T.fly - 0.05, NAX, RN, 0.98),
  TAB(T.fly + 2.6, 1.04), TAB(T.row - 0.05, 1.0), S(T.row + 2.0, [COL(6), TY(3.3), 0], 6.6, 3.7, DDIR), S(T.col - 0.05, [COL(6), TY(3.3), 0], 6.4, 3.6, DDIR), S(T.col + 2.2, [COL(4.5), TY(3.1), 0], 5.4, 3.4, DDIR), S(T.back - 0.05, [COL(4.5), TY(3.1), 0], 5.2, 3.3, DDIR),
  ATOM(T.back + 2.5, NAX, RN, 1.02), ATOM(T.cl, NAX, RN, 1.0), PAIR(T.cl + 2.2, 1.04), PAIR(T.float - 0.05, 0.96),
  // FLOAT (cut back to the knife table): wide, follow the piece to the glass
  KW(T.float, 1.05), KW(TG + 2.2, 1.0), S(TG + 4.4, [WX, 0.5, 0], 0.9, 0.95), WB(FL + 2.2, 1.0), WB(T.heat - 0.05, 0.95),
  // HEAT: the whole set-up, push to the dish when it melts
  HT(T.heat, 1.04), HT(MP - 2.4, 1.0), HC(MP - 0.2, 1.08), HC(T.ham - 0.05, 0.98),
  // HAMMER, then the clamps
  AN(T.ham, 1.04), AN(T.pull - 0.05, 0.96), VS(T.pull + 2.0, 1.04), VS(T.elec - 0.05, 0.96),
  // CIRCUIT, then the hot-plate rod
  EC(T.elec, 1.04), EC(T.ht - 0.05, 0.96), RD(T.ht + 2.2, 1.04), RD(T.end - 0.05, 0.95),
  // END: the hook table again
  S(T.end, [0, 0.3, 0.02], 3.0, 0.85), S(T.done, [0, 0.29, 0.02], 2.8, 0.8),
];

export default {
  capNear: true, oneText: true,
  duration: T.done,
  fog: [18, 40],                                                        // the wide table shot stays clear
  captions,
  cams,

  build({ scene, cam, R }) {
    const beats = [], fires = [];
    const dark = (t) => t >= T.atom - 0.01 && t < T.float - 0.05;
    const ST = K.studio({ scene, R }, '807', { dark });                 // FIRST: models read the look
    beats.push((t) => ST.update(t));
    let root = scene;                                                  // each station lives in its own group, shown only in its own time
    const add = (o, x = 0, y = 0, z = 0) => { o.position.set(x, y, z); root.add(o); return o; };
    const stage = (show) => { root = new THREE.Group(); scene.add(root); const g = root; beats.push((t) => { g.visible = show(t); }); return g; };
    const lbl = (text, h, color, x, y, z = 0, w = 700) => add(K.label(text, h, color, w), x, y, z);
    // bench labels keep ONE size on screen in wide and close shots (h = share of the picture height)
    const tags = [], tag = (text, h, color, x, y, z = 0, w = 700) => { const l = lbl(text, 0.1, color, x, y, z, w); l.userData.frac = h * 1.8; tags.push(l); return l; };
    const shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
    const blob = (r, x, z) => add(K.contactShadow(r), x, 0.004, z);
    const shinyMetal = (c, r = 0.25) => { const m = new THREE.MeshPhysicalMaterial({ color: c, metalness: 1, roughness: r, envMapIntensity: ST.on ? 1.6 : 1 }); if (ST.on) K.photoEnv('bake/studio.hdr').then((tx) => { m.envMap = tx; m.needsUpdate = true; }); return m; };
    const naMat = () => new THREE.MeshPhysicalMaterial({ color: 0xc9c6bd, metalness: 0.35, roughness: 0.55, clearcoat: 0.3 });   // sodium as it lies in air: dull, tarnished silver
    const gold = M.glow(0xffc04d, 2.8), eGeo = new THREE.SphereGeometry(0.055, 16, 12);

    // ================================================================ HOOK · salt we know (also the end)
    {
      stage((t) => t < T.free || t >= T.end - 0.05); ST.bake(root, 'salt', 0, 3.6, 1.2);
      add(K.saltHeap(0.14), SH, 0, 0.02);
      add(K.beaker(BR - 0.02, 0.42), SEA, 0, 0); add(K.liquid(BR - 0.03, 0.28, 0x4f97c9, 0.4), SEA, Y0, 0);
      add(K.rockSalt(0.17), RS, 0, 0);
      const names = [tag('table salt', 0.045, '#ffffff', SH, 0.3, 0.1), tag('sea water', 0.045, '#cfe8ff', SEA, 0.62, 0.1), tag('rock salt', 0.045, '#ffffff', RS, 0.4, 0.1)];
      const fx = [tag('NaCl', 0.06, '#ffe08a', SH, 0.3, 0.1), tag('NaCl · NaBr · NaI', 0.05, '#ffe08a', SEA, 0.62, 0.1), tag('from deposits in the ground', 0.045, '#ffffff', RS, 0.4, 0.1)];
      const na = [tag('Na', 0.06, '#ffd27a', SH, 0.3, 0.1), tag('Na', 0.06, '#ffd27a', SEA, 0.62, 0.1), tag('Na', 0.06, '#ffd27a', RS, 0.4, 0.1)];
      const ends = [tag('Na⁺', 0.06, '#ffd27a', SH, 0.3, 0.1), tag('Na⁺', 0.06, '#ffd27a', SEA, 0.62, 0.1), tag('Na⁺', 0.06, '#ffd27a', RS, 0.4, 0.1)];   // the Na of the opening, now as it really is: Na⁺
      const sw = [T.nacl, T.sea, T.rock];
      beats.push((t) => {
        names.forEach((l, i) => K.popIn(l, t, 0.6 + i * 1.2, sw[i] + 0.4));
        fx.forEach((l, i) => K.popIn(l, t, sw[i] + 0.8, T.all - 0.2));
        na.forEach((l, i) => K.popIn(l, t, T.all + 1.4 + i * 0.5, T.card - 0.2));
        ends.forEach((l, i) => K.popIn(l, t, T.end + 4.4 + i * 0.6, 1e9));
      });
    }

    // ================================================================ KNIFE · the metal set free (cut, shiny, dull) · FLOAT
    {
      stage((t) => (t >= T.free - 0.05 && t < T.atom) || (t >= T.float - 0.05 && t < T.heat)); ST.bake(root, 'knife', (KX + WX) / 2, 2.6, 1.2);
      add(K.solid(new THREE.BoxGeometry(1.0, 0.03, 0.62), M.gloss(0xf2f0ea)), KX + 0.18, 0.015, 0.06);   // a white tile
      const na = add(K.sodiumBlock(0.5, 0.24, 0.3), KX, TT + 0.002, 0); na.rotation.y = -0.5;
      const { shine } = na.userData, fresh = new THREE.Color(0xf4f6f8), dull = new THREE.Color(0x6f6b64);
      if (ST.on) K.photoEnv('bake/studio.hdr').then((tx) => { shine.envMap = tx; shine.envMapIntensity = 1.7; shine.needsUpdate = true; });   // the fresh cut mirrors the bright studio
      const stars = [[0.1, 0.06, 0.08, 0.13], [0.6, -0.04, -0.06, 0.09], [1.1, 0.02, 0.1, 0.07], [1.5, -0.07, -0.1, 0.11]]
        .map(([ph, y, z, sz]) => { const s = K.sparkle(0xffffff, sz * 1.5); s.userData.at = V(0.128, y, z); s.userData.ph = ph; s.userData.size = sz * 1.5; na.userData.a.add(s); return s; });
      const kn = K.knife(); kn.rotation.y = Math.PI / 2; kn.position.set(0, 1.6, 0.35); na.add(kn);
      const lNa = tag('sodium metal', 0.05, '#ffffff', KX, 0.47, 0.1), lSoft = tag('soft: a knife cuts it', 0.05, '#f3e7c0', KX + 0.1, 0.62, 0.1);
      const lShiny = tag('shiny, silvery white', 0.05, '#ffffff', KX - 0.1, 0.48, 0.1), lDull = tag('dull in seconds', 0.05, '#d8d4cc', KX - 0.1, 0.48, 0.1);
      beats.push((t) => {
        // the knife comes down (lifts first), slices, the halves part, the cut face turns to us and shines … then dulls in air
        const up = Math.sin(Math.PI * span(t, C0, C0 + 0.3)) * 0.12, cut = easeIn(span(t, C0 + 0.3, C0 + 0.75));
        kn.visible = t > C0 - 1.4 && t < C0 + 2.6;
        kn.position.y = lerp(1.6, 0.62, ease(span(t, C0 - 1.4, C0))) + up - 0.6 * cut + 0.5 * ease(span(t, C0 + 1.4, C0 + 2.0)) + 1.0 * easeIn(span(t, C0 + 2.0, C0 + 2.6));
        na.userData.split(t > C0 + 0.74); na.userData.open(ease(span(t, C0 + 0.75, C0 + 1.2))); na.userData.a.rotation.y = -1.0 * ease(span(t, C0 + 0.9, C0 + 1.8));
        const tar = ease(span(t, T.tarn, T.tarn + 2.0));
        shine.color.copy(fresh).lerp(dull, tar); shine.metalness = lerp(ST.on ? 0.6 : 0.3, 0.1, tar); shine.roughness = lerp(0.16, 0.95, tar); shine.clearcoat = 1 - tar;
        stars.forEach((st) => {
          const k = ((t - C0 - 1.4 - st.userData.ph) % 1.8 + 1.8) % 1.8, on = t > C0 + 1.4 + st.userData.ph && tar < 0.5;
          const tw = Math.sin(Math.PI * K.clamp01(k / 0.7)) * (1 - tar * 2);
          st.visible = on && k < 0.7; st.position.copy(st.userData.at); st.scale.setScalar(Math.max(1e-4, st.userData.size * tw)); st.material.rotation = 0.6 * k;
        });
        K.popIn(lNa, t, T.free + 0.6, T.knife + 0.6); K.popIn(lSoft, t, C0 + 0.5, C0 + 3.0);
        K.popIn(lShiny, t, C0 + 3.4, T.tarn + 0.6); K.popIn(lDull, t, T.tarn + 1.4, T.atom);
      });
      // FLOAT: a small piece lies on the tile; tongs lift it, carry it over the glass and let go: it floats
      add(K.beaker(BR, 0.46), WX, 0, 0); add(K.liquid(BR - 0.01, 0.3, 0x5aa0d8, 0.38), WX, Y0, 0);
      const pc = add(K.lump(0.05, naMat(), 5, 0.75, 0.3), PCX, TT + 0.035, PCZ), sPc = blob(0.07, PCX, PCZ);
      const tg = add(K.tongs(0.6)), fz = add(K.bubbles(14, V(), SURF + 0.04, 0.08, 0.008)), sp = add(K.splash(0xffffff, 0.2), WX, SURF, 0);
      const P0 = V(PCX, TT + 0.035, PCZ), P1 = V(WX, 0.82, 0);
      const lPc = tag('a small piece', 0.05, '#ffffff', PCX + 0.05, 0.08, PCZ + 0.2), lW = tag('water', 0.045, '#bfe0ff', WX + 0.32, 0.3, 0.2);
      const lFl = tag('floats ✓', 0.055, '#ffffff', WX, 0.62, 0.1), lDn = tag('0.971 g/cm³ · water 1 g/cm³', 0.045, '#ffe08a', WX, 0.62, 0.1);
      const at = (t) => {                                                 // where the tongs (and the piece in them) are
        if (t < TG + 1.2) return P0.clone().setY(P0.y + 1.1 * (1 - ease(span(t, TG, TG + 1.2))));
        if (t < TG + 2.2) return P0.clone().setY(P0.y + 0.45 * ease(span(t, TG + 1.4, TG + 2.2)));
        return K.arc(P0.clone().setY(P0.y + 0.45), P1, 0.15, ease(span(t, TG + 2.2, TG + 3.8)));
      };
      beats.push((t) => {
        const held = t > TG + 1.3 && t < TG + 4.0, p = at(t);
        tg.visible = t > TG && t < TG + 5.2; tg.position.copy(t < TG + 4.0 ? p.clone().setY(p.y + 0.01) : P1.clone().setY(P1.y + 0.01 + 1.2 * easeIn(span(t, TG + 4.1, TG + 5.2))));
        tg.userData.set(held ? 0.042 : 0.075);
        const f = K.drop(t, TG + 4.0, P1.y, SURF + 0.008, 0.3, 0.01);
        if (t < TG + 1.3) pc.position.copy(P0); else if (held) pc.position.copy(p);
        else { const u = Math.max(0, t - FL); pc.position.set(WX + (u > 0 ? 0.07 * Math.sin(1.6 * u) * ease(span(u, 0.3, 1.2)) : 0), f.y + (u > 0 ? 0.004 * Math.sin(t * 5) : 0), u > 0 ? 0.05 * Math.sin(2.1 * u + 0.4) * ease(span(u, 0.3, 1.2)) : 0); }
        pc.rotation.y = t > FL ? (t - FL) * 1.2 : 0;
        sPc.userData.set(t < TG + 1.3 ? 0 : 9);
        sp.userData.update(t - FL); fz.visible = t > FL + 0.2; fz.userData.update(t, 0.5, pc.position.clone().add(V(0, -0.02, 0)));
        K.popIn(lPc, t, T.float + 0.8, TG + 1.0); K.popIn(lW, t, TG + 2.2, FL); K.popIn(lFl, t, FL + 0.6, FL + 3.0); K.popIn(lDn, t, FL + 3.4, T.heat);
      });
    }

    // ================================================================ INSIDE · the sodium atom, its place, chlorine takes its electron (dark)
    {
      stage(dark);
      const atomAt = (x, shells, p, n, Rr) => { const r0 = 0.45, A = K.atom(shells, p, n, r0, (Rr - r0) / (shells.length - 1)); A.group.position.set(x, AY, 0); root.add(A.group); return A; };
      const NA = atomAt(NAX, [2, 8, 1], 11, 12, RN), CL = atomAt(66.8, [2, 8, 7], 17, 18, RC);
      const x = NA.electrons.find((e) => e.shell === 2), nuc = NA.group.children[0];
      const goldify = () => { if (x.e.material !== gold) { x.e.material = gold; x.e.children[0].material = x.e.children[0].material.clone(); x.e.children[0].material.color.set(0xffc04d); } };
      const flyK = (t) => ease(span(t, T.fly, T.fly + 2.6)) * (1 - ease(span(t, T.back, T.back + 2.5)));
      const TILE = V(COL(1), TY(3), 0.12);
      const naPos = (t) => K.arc(V(NAX, AY, 0), TILE, 0.7, flyK(t)).add(V(0.22 * ease(span(t, T.ions, T.ions + 1.2)), 0, 0));
      const clPos = (t) => V(lerp(66.8, 62.75, ease(span(t, T.cl, T.cl + 2.0))) - 0.22 * ease(span(t, T.ions, T.ions + 1.2)), AY, 0);
      beats.push((t) => {
        const k = flyK(t); if (t > T.val) goldify();
        NA.group.visible = k < 0.97; NA.group.position.copy(naPos(t)); NA.group.scale.setScalar(Math.max(1e-4, lerp(1, 0.07, k) * back(span(t, T.atom - 0.1, T.atom + 0.2))));
        NA.update(t); nuc.scale.setScalar(1 + 0.35 * Math.sin(Math.PI * span(t, T.z, T.z + 0.8)));
        NA.rings.forEach((r, s) => r.scale.setScalar(1 + 0.12 * Math.sin(Math.PI * span(t, T.sh + 0.3 + s * 0.6, T.sh + 0.9 + s * 0.6))));
        x.e.visible = t <= T.hop + 0.02; x.e.scale.setScalar(1 + 0.6 * Math.sin(Math.PI * span(t, T.val, T.val + 0.9)));
        NA.rings[2].children[0].material.opacity = 0.55 * (1 - span(t, T.hop + 1.4, T.hop + 2.2));
        CL.group.visible = t > T.cl; CL.group.position.copy(clPos(t)); CL.update(t);
      });
      // the electron hops to chlorine and stays on its outer shell
      const a0 = 0.5 / 7 * Math.PI * 2, wC = 0.9 / 2, clSeat = (t) => CL.rings[2].localToWorld(V(Math.cos(a0 + t * wC) * RC, 0, Math.sin(a0 + t * wC) * RC));
      const naSeat = (t) => NA.rings[2].localToWorld(V(Math.cos(x.a0 + t * x.w) * x.R, 0, Math.sin(x.a0 + t * x.w) * x.R));
      const e = add(new THREE.Mesh(eGeo, gold)); e.add(K.glowSprite(0xffc04d, 0.32));
      const trail = Array.from({ length: 9 }, (_, k) => { const g = add(K.glowSprite(0xffc04d, 0.22 * (1 - k / 10))); g.material.opacity = 0.55 * (1 - k / 9); return g; });
      let from = null;
      const path = (t) => (t < T.hop + 1.4 ? K.arc(from, clSeat(T.hop + 1.4), 0.5, ease(span(t, T.hop, T.hop + 1.4))) : clSeat(t));
      beats.push((t) => {
        if (t <= T.hop || !from) from = naSeat(Math.min(t, T.hop));
        const on = (u) => u > T.hop && u < T.float; e.visible = on(t); if (e.visible) e.position.copy(path(t));
        trail.forEach((g, k) => { const tk = t - (k + 1) * 0.035; g.visible = on(tk) && tk < T.hop + 1.6; if (g.visible) g.position.copy(path(tk)); });
      });
      // labels (fixed size: the dark shots are all about this wide)
      const up = AY + 0.75 * RN + 0.45, low = AY - 0.9 * RN - 0.35;
      const nm = lbl('sodium atom (Na)', 0.28, '#ffffff', NAX, up), zl = lbl('11 protons: atomic number 11', 0.24, '#ff9f96', NAX, low);
      const nums = [0, 1, 2].map((s) => lbl(String(s + 1), 0.26, '#9fc4ff', NAX + 0.45 + s * (RN - 0.45) / 2 + 0.1, AY + 0.12));
      const cfg = lbl('2, 8, 1', 0.3, '#ffffff', NAX, up), val = lbl('1 outer (valence) electron', 0.24, '#ffd27a', NAX, low);
      const lCl = lbl('chlorine atom', 0.26, '#cfeec0', 62.75, AY + 0.75 * RC + 0.5), took = lbl('takes it', 0.22, '#ffd27a', 62.75, AY - 0.75 * RC - 0.45);
      const nap = lbl('Na⁺', 0.4, '#ffffff', NAX + 0.22, up), clm = lbl('Cl⁻', 0.4, '#ffffff', 62.53, AY + 0.75 * RC + 0.5);
      const salt = lbl('sodium chloride: salt', 0.3, '#ffe08a', 61.3, low - 0.05);
      beats.push((t) => {
        K.popIn(nm, t, T.atom + 0.9, T.z + 2.6); K.popIn(zl, t, T.z + 0.3, T.sh + 0.2);
        nums.forEach((l, s) => K.popIn(l, t, T.sh + 0.3 + s * 0.6, T.val + 0.2)); K.popIn(cfg, t, T.sh + 2.2, T.fly);
        K.popIn(val, t, T.val + 0.5, T.fly);
        K.popIn(lCl, t, T.cl + 1.6, T.ions - 0.4); K.popIn(took, t, T.hop + 1.4, T.ions - 0.4);
        K.popIn(nap, t, T.ions + 0.2, 1e9); K.popIn(clm, t, T.ions + 0.6, 1e9);
        nap.position.x = NAX + 0.22 * ease(span(t, T.ions, T.ions + 1.2)); clm.position.x = clPos(t).x;
        K.popIn(salt, t, T.saltL + 0.2, 1e9);
      });
      // the periodic table (dark board); the atom shrinks into the sodium tile
      const tab = new THREE.Group(); root.add(tab); beats.push((t) => { tab.visible = t > T.fly - 0.2 && t < T.back + 2.7; });
      const GREY = 0x4a4f58, own = { 1: 'H', 3: 'Li', 11: 'Na' }, rest = [];
      for (let z = 1; z <= 118; z++) { const [r, c] = place(z); if (r <= 7 && !own[z]) rest.push({ r, c }); }
      const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(0.44, 0.44, 0.06), M.gloss(GREY), rest.length); tab.add(inst);
      const m4 = new THREE.Matrix4(); rest.forEach(({ r, c }, i) => { m4.makeTranslation(COL(c), TY(r), 0); inst.setMatrixAt(i, m4); });
      const tiles = Object.entries(own).map(([z, s]) => { const [r, c] = place(+z); const tl = K.tile(s, s === 'Na' ? 0x3a64b8 : GREY, 0.44, 0.44, 0.08); tl.position.set(COL(c), TY(r), 0.01); tab.add(tl); return [s, tl]; });
      const naTile = tiles.find(([s]) => s === 'Na')[1], naBody = naTile.userData.body.material;
      const hl = (w, h, ax, ay) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.02).translate(ax * w / 2, ay * h / 2, 0), new THREE.MeshBasicMaterial({ color: 0xf0b030, transparent: true, opacity: 0.22, depthWrite: false, toneMapped: false })); tab.add(m); return m; };
      const rowH = hl(18 * TP + 0.08, 0.5, 1, 0), colH = hl(0.5, 7 * TP + 0.08, 0, -1);
      rowH.position.set(COL(1) - TP / 2 - 0.04, TY(3), -0.06); colH.position.set(COL(1), TY(1) + TP / 2 + 0.04, -0.06);
      const lRow = lbl('period 3: sodium comes first', 0.4, '#ffe08a', COL(7.5), TY(3)), lCol = lbl('group IA: H, Li, Na: third', 0.3, '#ffe08a', COL(5.6), TY(1.5));
      const lAlk = lbl('an alkali metal', 0.32, '#ffffff', COL(5.0), TY(3));
      const lTab = lbl('the periodic table', 0.44, '#f6d48f', TBX, TY(1) + 0.65);
      beats.push((t) => {
        const land = span(t, T.fly + 2.4, T.fly + 2.9) * (1 - span(t, T.back - 0.1, T.back + 0.3));
        naBody.emissive.set(0xf0b030); naBody.emissiveIntensity = 0.55 * land; naTile.position.z = 0.01 + 0.06 * Math.sin(Math.PI * span(t, T.fly + 2.4, T.fly + 3.0));
        rowH.visible = t > T.row; rowH.scale.x = Math.max(1e-4, ease(span(t, T.row, T.row + 1.2)) * (1 - ease(span(t, T.col - 0.4, T.col))));
        colH.visible = t > T.col; colH.scale.y = Math.max(1e-4, ease(span(t, T.col, T.col + 1.2)) * (1 - ease(span(t, T.back - 0.4, T.back))));
        K.popIn(lTab, t, T.fly + 1.4, T.row + 0.4);
        K.popIn(lRow, t, T.row + 1.0, T.col - 0.3); K.popIn(lCol, t, T.col + 1.0, T.back - 0.3); K.popIn(lAlk, t, T.alk + 0.2, T.back - 0.3);
      });
    }

    // ================================================================ HEAT · it melts at 97.6 °C (thermometer beside it)
    {
      stage((t) => t >= T.heat - 0.05 && t < T.ham); ST.bake(root, 'heat', HX, 2.0, 1.2);
      add(K.tripod(0.74, 0.16), HX, 0, 0); add(K.dish(0.15), HX, DISH, 0);
      const brn = add(K.burner(), HX, 0, 0), fl = brn.userData.flame; fires.push(fl);
      add(K.stand(1.1, 0.57), HX - 0.62, 0, -0.02);
      const th = add(K.thermometer(0.45, 120), HX - 0.05, BEAD + 0.02, -0.02);
      const pm = new THREE.MeshPhysicalMaterial({ color: 0xc9c6bd, metalness: 0.35, roughness: 0.55, clearcoat: 0.3 });
      const pc = add(K.lump(0.06, pm, 8, 0.75, 0.3), HX + 0.05, BEAD + 0.035, 0.01);
      const dullC = new THREE.Color(0xc9c6bd), brightC = new THREE.Color(0xeef0f2);
      const temp = (t) => lerp(25, 97.6, ease(span(t, FIRE + 0.6, MP))) + 4 * ease(span(t, MP + 0.8, T.bp));
      const lPc = tag('sodium', 0.05, '#ffffff', HX + 0.18, BEAD + 0.16, 0.1), lT = tag('25 °C', 0.05, '#ffffff', HX - 0.2, BEAD + th.userData.y(25) + 0.02, 0.05);
      const lMp = tag('melts at 97.6 °C ✓', 0.055, '#ffffff', HX + 0.33, BEAD + 0.18, 0.1), lBw = tag('below boiling water (100 °C)', 0.045, '#bfe0ff', HX + 0.33, BEAD + 0.29, 0.1);
      const lBp = tag('boils only at 880 °C', 0.055, '#ffd27a', HX + 0.33, BEAD + 0.18, 0.1), lRead = tag('97.6 °C', 0.05, '#ff9f96', HX + 0.16, BEAD + th.userData.y(97.6) + 0.02, 0.05);
      beats.push((t) => {
        const on = back(span(t, FIRE, FIRE + 0.4)); fl.visible = on > 0.01; fl.scale.setScalar(Math.max(1e-4, 0.5 * on));
        th.userData.set(temp(t));
        const m = ease(span(t, MP - 0.3, MP + 1.0));                        // the solid piece slumps into a shiny liquid bead
        pc.scale.set(1 + 0.45 * m, 1 - 0.5 * m, 1 + 0.45 * m); pc.position.y = BEAD + 0.035 - 0.02 * m;
        pm.color.copy(dullC).lerp(brightC, m); pm.metalness = lerp(0.35, 0.85, m); pm.roughness = lerp(0.55, 0.12, m); pm.clearcoat = lerp(0.3, 1, m);
        K.popIn(lPc, t, T.heat + 0.6, FIRE + 1.0); K.popIn(lT, t, T.heat + 1.4, FIRE + 1.6);
        K.popIn(lRead, t, MP - 0.1, T.ham); K.popIn(lMp, t, MP + 0.6, T.bp - 0.2); K.popIn(lBw, t, MP + 2.0, T.bp - 0.2); K.popIn(lBp, t, T.bp + 0.2, T.ham);
      });
    }

    // ================================================================ HAMMER (malleable) · PULL (ductile, then it snaps: weak)
    {
      stage((t) => t >= T.ham - 0.05 && t < T.elec); ST.bake(root, 'shape', 39.7, 3.6, 1.3);
      add(K.anvil(AT), AX, 0, 0);
      const ball = add(K.lump(0.075, naMat(), 4, 0.85, 0.3), AX, AT + 0.06, 0);
      const hm = add(K.hammer(0.62)), HL = 0.64;
      const lBall = tag('a sodium ball', 0.05, '#ffffff', AX - 0.3, AT + 0.22, 0.1), lMal = tag('flat, not broken: malleable ✓', 0.05, '#ffffff', AX, AT + 0.3, 0.05);
      const flatK = (t) => HITS.reduce((a, h) => a + ease(span(t, h, h + 0.08)), 0) / 3;
      beats.push((t) => {
        const f = flatK(t), sy = 1 - 0.72 * f, sxz = 1 + 1.0 * f;
        ball.scale.set(sxz, sy, sxz * 0.9); ball.position.y = AT + 0.06 * sy;
        const UP = Math.PI / 2 - 0.8; let a = UP, k = 0;                   // three blows: up slowly, down fast, small rebound
        for (const h of HITS) if (t > h - 0.95) k = h;
        if (k) {
          const u = ease(span(t, k - 0.95, k - 0.3)), down = easeIn(span(t, k - 0.3, k)), reb = t > k ? 0.12 * Math.sin(Math.PI * span(t, k, k + 0.25)) : 0;
          const prev = HITS.indexOf(k) ? Math.PI / 2 : UP;
          a = t < k - 0.3 ? lerp(prev, UP, u) : lerp(UP, Math.PI / 2, down) - reb;
          if (k === HITS[2] && t > k + 0.6) a = lerp(Math.PI / 2 - 0.12, Math.PI / 2 - 1.3, ease(span(t, k + 0.6, k + 1.5)));
        }
        const hitTop = AT + 0.12 * (1 - 0.72 * flatK(Math.max(t, k || 0) + 0.1));
        hm.rotation.z = a; hm.position.set(AX + HL, hitTop + 0.18, 0);
        const enter = 1 - ease(span(t, T.ham + 0.8, T.ham + 1.4)), leave = ease(span(t, HITS[2] + 1.2, HITS[2] + 2.0));
        hm.position.y += 1.2 * enter + 1.5 * leave; hm.visible = t > T.ham + 0.8 && t < HITS[2] + 2.0;
        K.popIn(lBall, t, T.ham + 0.4, HITS[0] - 0.4); K.popIn(lMal, t, HITS[2] + 1.0, T.pull - 0.3);
      });
      // a short sodium rod in two clamps; the right clamp is pulled: a long thin wire … pulled harder, it snaps
      const R0 = 0.035, vr = add(K.vise(), 0, 0, 0); add(K.vise(), XL - 0.05, 0, 0);
      const sVr = blob(0.16, 0, 0), wm = naMat();
      const geo = new THREE.CylinderGeometry(R0, R0, 1, 32).rotateZ(Math.PI / 2);
      const wire = add(K.solid(geo, wm), XL + L0 / 2, 0.12, 0);
      const tip = new THREE.CylinderGeometry(R0, R0 * 0.25, 1, 24).rotateZ(Math.PI / 2);   // a broken half: thin at its broken end
      const hL = add(K.solid(tip, wm)), hR = add(K.solid(tip.clone().rotateZ(Math.PI), wm));
      const lRod = tag('a sodium rod', 0.05, '#ffffff', XL + 0.15, 0.36, 0.05), lPull = tag('pull →', 0.055, '#ffffff', 0, 0.3, 0.05);
      const lDuc = tag('a long thin wire: ductile ✓', 0.05, '#ffffff', XL + 0.6, 0.34, 0.05), lSnap = tag('snaps easily: low tensile strength ✓', 0.05, '#ffd27a', XL + 0.62, 0.34, 0.05);
      const L1 = 1.0, L2 = 1.12;
      beats.push((t) => {
        const k = ease(span(t, T.pull + 2.4, T.pull + 6.0)), k2 = easeIn(span(t, T.snap + 0.2, SNAP)), L = lerp(lerp(L0, L1, k), L2, k2), r = Math.sqrt(L0 / L);
        const broke = t > SNAP, jerk = broke ? 0.14 * ease(span(t, SNAP, SNAP + 0.35)) : 0;
        vr.position.x = XL + L + 0.05 + jerk; sVr.position.x = vr.position.x; sVr.userData.set(0);
        wire.visible = !broke; wire.scale.set(L, r, r); wire.position.x = XL + L / 2;
        hL.visible = hR.visible = broke;
        if (broke) {
          const h = L / 2, rec = Math.sin(Math.PI * span(t, SNAP, SNAP + 0.3)) * 0.02;
          hL.scale.set(h, r, r); hL.position.set(XL + h / 2 - rec, 0.12, 0); hR.scale.set(h, r, r); hR.position.set(XL + h + h / 2 + jerk + rec, 0.12, 0);
          hR.rotation.z = -0.05 * ease(span(t, SNAP, SNAP + 0.4));
        }
        K.popIn(lRod, t, T.pull + 0.5, T.pull + 2.6); lPull.position.x = vr.position.x + 0.05; K.popIn(lPull, t, T.pull + 2.2, T.pull + 5.6);
        K.popIn(lDuc, t, T.pull + 6.2, T.snap); K.popIn(lSnap, t, SNAP + 0.6, T.elec);
      });
    }

    // ================================================================ CIRCUIT (electricity) · HOT-PLATE ROD (heat)
    {
      stage((t) => t >= T.elec - 0.05 && t < T.end); ST.bake(root, 'elec', 50, 5.4, 1.5);
      for (const s of [-1, 1]) { add(K.solid(new THREE.BoxGeometry(0.12, 0.08, 0.12), M.matte(0x22252b, 0.6)), CX + s * 0.25, 0.04, 0); add(K.solid(new THREE.BoxGeometry(0.13, 0.03, 0.13), M.metal(0xb9bec6, 0.3)), CX + s * 0.25, 0.096, 0); }
      add(K.battery(), CX - 0.85, 0, -0.05);
      const inW = add(K.wire([[CX - 0.85, 0.87, -0.05], [CX - 0.8, 0.95, 0.0], [CX - 0.55, 0.42, 0.12], [CX - 0.4, 0.12, 0.06], [CX - 0.31, 0.1, 0]]));
      const outW = add(K.wire([[CX + 0.31, 0.1, 0], [CX + 0.48, 0.07, 0.05], [CX + 0.64, 0.06, 0.03], [CX + 0.72, 0.08, 0]]));
      const backW = add(K.wire([[CX + 0.86, 0.04, -0.09], [CX + 0.5, 0.024, -0.32], [CX - 0.5, 0.024, -0.32], [CX - 0.72, 0.024, -0.14]], 0x2b2f38));
      const lamp = add(K.bulb(), CX + 0.8, 0.0, 0);
      const stripC = new THREE.CatmullRomCurve3([V(CX - 0.3, 0.14, 0), V(CX + 0.3, 0.14, 0)]);
      const pI = add(K.pulses(inW.userData.curve, 5)), pO = add(K.pulses(outW.userData.curve, 3)), pS = add(K.pulses(stripC, 4)), pB = add(K.pulses(backW.userData.curve, 6));
      const strip = add(K.solid(new THREE.BoxGeometry(0.72, 0.024, 0.12), naMat()), CX, 1.2, 0), sSt = blob(0.4, CX, 0);
      const tg = add(K.tongs(0.7)), REST = 0.1235, m0 = T.elec + 2.0;
      const lGap = tag('a gap', 0.05, '#ffffff', CX, 0.3, 0.1), lOff = tag('bulb off', 0.05, '#cfd6e2', CX + 0.8, 0.9, 0);
      const lSt = tag('a sodium strip', 0.05, '#ffffff', CX, 0.4, 0.1), lLit = tag('bulb lights ✓', 0.05, '#ffe2a0', CX + 0.8, 0.95, 0);
      beats.push((t) => {
        K.popIn(lGap, t, T.elec + 0.6, m0 + 1.0); K.popIn(lOff, t, T.elec + 1.2, LIT);
        tg.visible = t > m0 && t < m0 + 2.4;
        if (tg.visible) {
          const at = V(CX, REST + 0.012, 0), top = at.clone().add(V(0, 1.1, 0));
          tg.position.copy(t < m0 + 1.2 ? top.lerp(at, 1 - (1 - span(t, m0, m0 + 1.2)) ** 2) : t < m0 + 1.5 ? at : at.clone().lerp(top, easeIn(span(t, m0 + 1.5, m0 + 2.4))));
          tg.userData.set(lerp(0.03, 0.08, span(t, m0 + 1.35, m0 + 1.5)));
        }
        strip.position.y = t < m0 ? 1.3 : t < m0 + 1.2 ? lerp(REST + 1.1, REST, 1 - (1 - span(t, m0, m0 + 1.2)) ** 2) : K.drop(t, m0 + 1.4, REST + 0.004, REST, 0.08, 0.004).y;
        strip.visible = t > m0; sSt.userData.set(strip.visible ? strip.position.y - REST : 9);
        const lit = ease(span(t, LIT, LIT + 0.3)); lamp.userData.set(lit);
        [pI, pO, pS, pB].forEach((p) => p.userData.update(t, lit, lit > 0.01 ? 1 : 0));
        K.popIn(lSt, t, m0 + 1.1, T.ht - 0.3); K.popIn(lLit, t, LIT + 0.5, T.ht - 0.3);
      });
      // heat: a sodium rod lies with its right end on a hot plate; wax beads sit along it and melt as the heat arrives
      const hp = add(K.hotPlate(), RX + 0.42, 0, 0);
      add(K.solid(new THREE.BoxGeometry(0.08, 0.103, 0.1), M.matte(0x5a5550, 0.7)), RX - 0.42, 0.0515, 0);
      add(K.solid(new THREE.CylinderGeometry(0.022, 0.022, 1.0, 24).rotateZ(Math.PI / 2), naMat()), RX, 0.103 + 0.022, -0.01);
      const wax = BEADX.map((bx, i) => { const m = M.matte(0xf3e9c8, 0.5); return [add(K.lump(0.026, m, i + 5, 1.0, 0.25), bx, 0.147 + 0.018, -0.01), m]; });
      const lRod = tag('a sodium rod', 0.05, '#ffffff', RX - 0.1, 0.36, 0.05), lWax = tag('wax beads on it', 0.05, '#f3e9c8', RX - 0.1, 0.36, 0.05);
      const lHp = tag('hot plate on', 0.05, '#ffb27a', RX + 0.42, 0.3, 0.2), lHeat = tag('← heat', 0.055, '#ffb27a', 0, 0.3, 0.05), lYes = tag('carries heat ✓', 0.055, '#ffffff', RX - 0.1, 0.36, 0.05);
      const wet = new THREE.Color(0xd8c48e), dry = new THREE.Color(0xf3e9c8);
      beats.push((t) => {
        hp.userData.on(ease(span(t, HOT - 0.5, HOT)));
        wax.forEach(([w, m], i) => {
          const u = ease(span(t, MELTW[i] - 0.3, MELTW[i] + 0.5));             // the bead slumps into a glossy puddle that runs over the rod
          w.scale.set(1 + 0.7 * u, Math.max(0.15, 1 - 0.75 * u), 1 + 0.5 * u); w.position.y = 0.147 + 0.018 * (1 - 0.8 * u);
          m.color.copy(dry).lerp(wet, u); m.roughness = lerp(0.5, 0.12, u);
        });
        const front = Math.min(1, Math.max(0, (t - HOT - 0.5) / 6.0));
        lHeat.position.x = RX + 0.4 - front - 0.06; K.popIn(lHeat, t, HOT + 1.8, MELTW[3] + 0.3);
        K.popIn(lRod, t, T.ht + 0.4, T.ht + 1.6); K.popIn(lWax, t, T.ht + 1.8, HOT + 0.6); K.popIn(lHp, t, HOT - 0.4, HOT + 1.6);
        K.popIn(lYes, t, MELTW[3] + 0.8, T.end);
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Why do we never see sodium metal?', intro: INTRO, ticks: TICKS,
      rows: [[0, '1 · The metal, set free'], [1, 'soft, silvery, dull in seconds'], [0, '2 · Look inside'], [1, 'period 3, group IA'], [1, 'gives its 1 electron away easily'],
        [0, '3 · What else is it like?'], [1, 'lighter than water: floats'], [1, 'melts at only 97.6 °C'], [1, 'bends, stretches, snaps'], [1, 'carries heat and electricity']],
      short: ['soft, silvery, dulls', 'period 3, group IA', 'gives 1 e⁻ easily', 'floats', 'melts at 97.6 °C', 'bends, snaps', 'conducts'] }));
    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));
    // bench labels: one size on screen (after every popIn)
    beats.push(() => { const nar = Math.min(1, (cam.aspect / 1.5) ** 0.7); tags.forEach((l) => { if (l.visible) l.scale.multiplyScalar(cam.position.distanceTo(l.position) * 2 * TAN * l.userData.frac * nar / 0.1); }); });   // upright phones: smaller, so labels fit the narrow width

    return (t, dt) => { for (const b of beats) b(t, dt); };
  },
};
