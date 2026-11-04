// Lesson 816 · Halogens (book pp. 241–242: 8.2.2 Halogens, Fig. 8.5, (a) Physical Properties + Table 8.9, (b) Chemical
// Reactivity), v1 (2026-10-14). Built from SKILL §0: a familiar hook (table salt), ONE question on a card, every idea on
// one simple picture (a row of five jars, a row of five atoms, one bar chart that changes property).
// THE QUESTION: "Why are halogens called salt-formers?" → card: group VII · states · conductors · 7 outer · X⁻ · never
// free · X₂ · trends.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//   HOOK    a salt shaker pours table salt onto a dish · salt is made from a metal and a poison gas: hot sodium is
//           lowered into a jar of green chlorine, burns with a yellow flame, white salt settles · chlorine "forms
//           salt" → card.
//   TABLE   (dark) the periodic table: group VII lights up F, Cl, Br, I, At: the halogens ("salt-forming"), all
//           non-metals (tick 1).
//   STATES  Fig. 8.5 as five jars: fluorine pale yellow gas, chlorine greenish gas, bromine dark red liquid with its
//           vapour, iodine black solid that gives a purple vapour on a hot plate, astatine a black solid
//           (radioactive) · the only group with gas, liquid and solid (tick 2) · iodine across a bulb gap: the bulb
//           stays off: poor conductors (tick 3).
//   INSIDE  (dark) chlorine 2, 8, 7: one empty place in the outer shell (3s² 3p⁵) · the five atoms in a row: each has
//           7 outer electrons (ns² np⁵), each bigger than the last (71 … 150 pm) (tick 4) · a sodium atom (less
//           electronegative) comes in, its electron fills the place: Cl⁻, a halide ion · the board: halogen molecule
//           + 2 electrons → 2 halide ions, X₂ + 2e⁻ → 2X⁻, then Cl₂ + 2e⁻ → 2Cl⁻ (tick 5).
//   NATURE  (dark) the chloride ions build a salt crystal with sodium ions: in nature only as ions or compounds, never
//           free, because they are so reactive (tick 6).
//   PAIRS   (dark) two chlorine atoms each give one electron to a shared pair: Cl₂, one single covalent bond,
//           diatomic; F₂, Br₂, I₂ beside it · very reactive: they react with hydrogen, oxygen, metals, non-metals (tick 7).
//   TRENDS  (dark) Table 8.9 as five bars that change: melting point, boiling point, density, ionization energy,
//           electron affinity, electronegativity · fluorine the most electronegative element; reactivity falls from
//           fluorine to astatine (tick 8).
//   END     back at the salt: halogens take one electron from metals, so they form salts.
// Book points (all): group VII = halogens, five elements, Greek "salt-forming" · found only as ions or compounds, not
// free, because of high reactivity · non-metals; F, Cl gases, Br liquid, I and At solids · very reactive, reactivity
// decreases F → At; F the most electronegative element; At radioactive, short half-lives · ns² np⁵, gain one electron
// from a less electronegative atom, halide ions, X₂ + 2e⁻ → 2X⁻, Cl₂ + 2e⁻ → 2Cl⁻ · Fig. 8.5 · only group with all three
// states · poor conductors · Table 8.9 (numbers, states, configurations) · strongly electronegative, negative ions with
// electropositive metals · very reactive, diatomic, single covalent bond, react with H, O, metals, non-metals and other
// compounds. Memorize-only (→ 🎮 Halogen Lab › Look): every number of Table 8.9 and the configurations.
// Book note (NOTES.md): Table 8.9 prints density in g/dm³ but the numbers are g/cm³ (F₂ 0.0017 g/cm³ = 1.7 g/dm³).
// §1 CHECK (sheets renders/lesson/d816*.jpg, s816.jpg, scr816.jpg): nothing missing ✓ · one question + bridges ✓ ·
// familiar hook (table salt) paid off at the end ✓ · each experiment: question → before → visible cause (shaker,
// spoon, hot plate, tongs) → result labelled ✓ · numbers as things (atom sizes, bars) ✓ · formula as balls → symbols
// → words ✓ · ≤ 3 labels a shot (rows of five excepted) ✓ · one place at a time ✓ · camera moves ≥ 2 s ✓ · baked
// tables, dark atoms/table/bars ✓ · substances own colours (pale yellow F, green Cl, red-brown Br, violet I, black At) ✓
// · every screen ✓ · flicker 0 ✓.
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

// ---------------------------------------------------------------- the five halogens (Table 8.9, as printed)
const HAL = [
  { s: 'F', name: 'fluorine', z: 9, shells: [2, 7], n: 10, pm: 71, col: 0xe8e07a, mp: -219.6, bp: -188.2, d: 0.0017, ip: 1681, ea: -328.0, en: 4.0 },
  { s: 'Cl', name: 'chlorine', z: 17, shells: [2, 8, 7], n: 18, pm: 99, col: 0x9ad24a, mp: -101.5, bp: -34.04, d: 0.0032, ip: 1251, ea: -349.0, en: 3.0 },
  { s: 'Br', name: 'bromine', z: 35, shells: [2, 8, 18, 7], n: 45, pm: 114, col: 0xa8452c, mp: -7.2, bp: 58.8, d: 3.1028, ip: 1140, ea: -324.6, en: 2.8 },
  { s: 'I', name: 'iodine', z: 53, shells: [2, 8, 18, 18, 7], n: 74, pm: 133, col: 0x6a4a9a, mp: 113.7, bp: 184.3, d: 4.933, ip: 1008, ea: -295.2, en: 2.5 },
  { s: 'At', name: 'astatine', z: 85, shells: [2, 8, 18, 32, 18, 7], n: 125, pm: 150, col: 0x3a3d42, mp: 301.8, bp: 336.8, d: null, ip: 890, ea: -270.1, en: 2.2 },
];
const PROPS = [
  ['melting point (°C)', 'mp', (v) => `${v}`], ['boiling point (°C)', 'bp', (v) => `${v}`], ['density (g/dm³)', 'd', (v) => (v == null ? '—' : `${v}`)],
  ['ionization energy (kJ/mol)', 'ip', (v, h) => (h.s === 'At' ? '890±40' : `${v}`)], ['electron affinity (kJ/mol)', 'ea', (v) => v.toFixed(1)], ['electronegativity', 'en', (v) => v.toFixed(1)],
];

// ---------------------------------------------------------------- places (stations 12+ apart)
const SHX = -1.25, DSX = -0.87, JX = 0.35, BRN = 1.05;                     // hook: shaker · salt dish · chlorine jar · burner
const TBX = 14, TP = 0.5, COL = (c) => TBX + (c - 9.5) * TP, TY = (r) => 4.6 - (r - 1) * TP - (r > 7 ? 0.25 : 0);   // the periodic table (dark)
const SX = 28, JXS = [SX - 1.75, SX - 1.0, SX - 0.25, SX + 0.95, SX + 1.7];     // states: five jars in the table's order
const EX = 40, CX = EX;                                                  // conductor test
const AY = 1.9, IX = 52;                                                 // inside: the atom row (dark)
const RX = HAL.map((h) => h.pm * 0.0052);                                 // outer radius of each atom picture
const ROWX = (() => { const gap = 0.32, w = RX.reduce((a, r) => a + 2 * r, 0) + gap * 4; let x = IX - w / 2; return RX.map((r) => { const c = x + r; x += 2 * r + gap; return c; }); })();
const CLX = ROWX[1], NAX = CLX - 2.4;                                    // the chlorine atom · the sodium that comes in
const QX = 64, LX = 76, DX = 88, BX = 100;                               // board · salt crystal · pairs · bars (dark)

// ---------------------------------------------------------------- time (every camera move ≥ 2 s)
const T = { pour: 0.6, jar: 4.4, sp: 6.0, hot: 7.4, lid: 8.0, inj: 8.6, burn: 10.0, out: 14.2, salt: 14.6, ask: 17.4, card: 20.0 };
DOCK = T.card + 5.0;
const TB0 = DOCK + 0.4, TEND = TB0 + 13;
const S0 = TEND, SEND = S0 + 28;
const C0 = SEND, CEND = C0 + 9;
const I0 = CEND, ROW = I0 + 8.4, BACK = I0 + 20.2, IEND = I0 + 30;
const Q0 = IEND, QEND = Q0 + 15;
const L0 = QEND, LEND = L0 + 11;
const D0 = LEND, DEND = D0 + 16;
const B0 = DEND, BP = (k) => B0 + 1.2 + k * 4.4, BEND = B0 + 1.2 + 6 * 4.4 + 5.0;
const Z0 = BEND; T.done = Z0 + 10;
const INTRO = [T.card, DOCK];
const TICKS = [[TEND - 0.6, 0], [S0 + 27.4, 1], [CEND - 0.6, 2], [I0 + 19.6, 3], [QEND - 0.6, 4], [LEND - 0.6, 5], [DEND - 0.6, 6], [BEND - 0.6, 7]];
const dark = (t) => [[TB0, TEND], [I0, BEND]].some(([a, b]) => t >= a - 0.05 && t < b - 0.05);

const captions = [
  [0.3, T.jar, 'Table salt: on every dinner table'],
  [T.jar, T.sp + 1.0, 'It is made from a green poison gas…'],
  [T.sp + 1.0, T.burn, '…and a soft metal: sodium'],
  [T.burn, T.salt, 'Sodium burns in chlorine'],
  [T.salt, T.ask, 'White salt forms: sodium chloride'],
  [T.ask, T.card, 'Chlorine forms salt: a halogen'],
  [T.card, DOCK, 'Why are halogens called salt-formers?'],
  [TB0, TB0 + 4.8, 'Where is chlorine in the table?'],
  [TB0 + 4.8, TB0 + 8.6, 'Group VII: five halogens'],
  [TB0 + 8.6, TEND, 'Halogen means "salt-forming" ✓'],
  [S0, S0 + 4.4, 'Fluorine: a pale yellow gas'],
  [S0 + 4.4, S0 + 8.0, 'Chlorine: a greenish gas'],
  [S0 + 8.0, S0 + 11.6, 'Bromine: a dark red liquid'],
  [S0 + 11.6, S0 + 18.4, 'Iodine: a black solid, purple vapour when heated'],
  [S0 + 18.4, S0 + 21.6, 'Astatine: a black solid, radioactive'],
  [S0 + 21.6, SEND, 'The only group with gas, liquid and solid ✓'],
  [C0, C0 + 3.0, 'Do they carry electricity?'],
  [C0 + 3.0, CEND, 'Iodine: the bulb stays off. Poor conductors ✓'],
  [I0, I0 + 4.4, 'Inside a chlorine atom: 2, 8, 7'],
  [I0 + 4.4, ROW, 'One place is empty: 1 electron short of 8'],
  [ROW, I0 + 15.4, 'Every halogen: 7 outer electrons (ns² np⁵)'],
  [I0 + 15.4, BACK, 'Down the group, each atom is bigger ✓'],
  [BACK, I0 + 25.6, 'A sodium atom gives chlorine its electron'],
  [I0 + 25.6, IEND, 'Chlorine becomes a halide ion: Cl⁻'],
  [Q0, Q0 + 6.6, 'A halogen molecule takes 2 electrons'],
  [Q0 + 6.6, Q0 + 10.6, 'In symbols: X₂ + 2e⁻ → 2X⁻'],
  [Q0 + 10.6, QEND, 'For chlorine: Cl₂ + 2e⁻ → 2Cl⁻ ✓'],
  [L0, L0 + 6.0, 'Chloride ions and sodium ions: a salt crystal'],
  [L0 + 6.0, LEND, 'So halogens are never found free ✓'],
  [D0, D0 + 6.4, 'Two chlorine atoms share one pair'],
  [D0 + 6.4, D0 + 11.0, 'Cl₂: two atoms, one single bond'],
  [D0 + 11.0, DEND, 'Very reactive: they react with many things ✓'],
  [B0, BP(1), 'Melting points rise down the group'],
  [BP(1), BP(2), 'Boiling points rise too'],
  [BP(2), BP(3), 'Gases are light, solids heavy: density'],
  [BP(3), BP(4), 'Electrons are held less tightly down the group'],
  [BP(4), BP(5), 'Energy given out on gaining an electron'],
  [BP(5), BP(6), 'Fluorine: the most electronegative element'],
  [BP(6), BEND, 'Reactivity falls from fluorine to astatine ✓'],
  [Z0, Z0 + 4.0, 'A halogen takes one electron from a metal…'],
  [Z0 + 4.0, T.done, '…and forms a salt: a salt-former ✓'],
];

// ---------------------------------------------------------------- camera
const HW = (t, k = 1, e) => S(t, [-0.1, 0.4, 0], 2.8 * k, 1.05 * k, ADIR, e);
const SH = (t, k = 1, e) => S(t, [(SHX + DSX) / 2, 0.24, 0.05], 0.95 * k, 0.62 * k, ADIR, e);
const JR = (t, k = 1, e) => S(t, [(JX + BRN) / 2, 0.5, 0], 1.45 * k, 1.15 * k, ADIR, e);
const TAB = (t, k = 1, e) => S(t, [TBX, 2.5, 0], 9.4 * k, 5.0 * k, DDIR, e);
const ST3 = (t, k = 1, e) => S(t, [JXS[1], 0.42, 0], 2.55 * k, 1.05 * k, ADIR, e);
const ST2 = (t, k = 1, e) => S(t, [(JXS[3] + JXS[4]) / 2, 0.42, 0], 1.35 * k, 1.05 * k, ADIR, e);
const STW = (t, k = 1, e) => S(t, [SX, 0.4, 0], 3.85 * k, 1.05 * k, ADIR, e);
const CON = (t, k = 1, e) => S(t, [CX, 0.42, 0.05], 2.4 * k, 1.2 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e) => S(t, [x, AY, 0], w * k, h * k, DDIR, e);
const cams = [
  // HOOK: the shaker close, over to the jar and burner, wide for the question
  SH(0, 1.04), SH(T.jar - 0.6, 0.98), HW(T.jar + 1.4, 1.0), JR(T.sp + 2.0, 1.04), JR(T.salt + 1.4, 0.97), HW(T.ask + 0.6, 1.02), HW(T.card, 1.0), HW(DOCK, 1.02), HW(TB0 - 0.05, 0.99),
  // TABLE (dark)
  TAB(TB0, 1.04), TAB(TEND - 0.05, 0.98),
  // STATES: the first three jars, the last two, all five
  ST3(S0, 1.04), ST3(S0 + 10.6, 0.98), ST2(S0 + 12.6, 1.04), ST2(S0 + 20.4, 0.98), STW(S0 + 22.6, 1.02), STW(SEND - 0.05, 0.99),
  // CONDUCTOR
  CON(C0, 1.04), CON(CEND - 0.05, 0.97),
  // INSIDE (dark): chlorine close, widen to the row, back to chlorine as sodium comes in
  DK(I0, CLX, 2.0, 2.1, 1.06), DK(ROW - 0.05, CLX, 2.0, 2.1, 0.97), S(ROW + 2.0, [IX, AY + 0.15, 0], 7.6, 3.4, DDIR), S(BACK - 0.05, [IX, AY + 0.15, 0], 7.4, 3.3, DDIR),
  DK(BACK + 2.0, (NAX + CLX) / 2, 4.2, 2.4, 1.02), DK(IEND - 0.05, (NAX + CLX) / 2, 4.2, 2.4, 0.97),
  // BOARD, CRYSTAL, PAIRS, BARS (dark)
  S(Q0, [QX - 0.3, AY - 0.3, 0], 6.6, 2.8, DDIR), S(QEND - 0.05, [QX - 0.3, AY - 0.3, 0], 6.4, 2.7, DDIR),
  DK(L0, LX, 3.6, 3.5, 1.04), DK(LEND - 0.05, LX, 3.6, 3.5, 0.96),
  DK(D0, DX, 4.0, 2.8, 1.04), DK(D0 + 9.6, DX, 4.0, 2.8, 0.98), DK(D0 + 11.6, DX + 1.75, 7.4, 3.0, 1.02), DK(DEND - 0.05, DX + 1.75, 7.4, 3.0, 0.99),
  S(B0, [BX, AY + 0.2, 0], 5.0, 5.3, DDIR), S(BEND - 0.05, [BX, AY + 0.2, 0], 4.9, 5.2, DDIR),
  // END: the salt again
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
    const ST = K.studio({ scene, R }, '816', { dark });                 // FIRST: models read the look
    beats.push((t) => ST.update(t));
    let root = scene;
    const add = (o, x = 0, y = 0, z = 0) => { o.position.set(x, y, z); root.add(o); return o; };
    const stage = (show) => { root = new THREE.Group(); scene.add(root); const g = root; beats.push((t) => { g.visible = show(t); }); return g; };
    const lbl = (text, h, color, x, y, z = 0, w = 700) => add(K.label(text, h, color, w), x, y, z);
    const tags = [], tag = (text, h, color, x, y, z = 0, w = 700) => { const l = lbl(text, 0.1, color, x, y, z, w); l.userData.frac = h * 1.8; tags.push(l); return l; };
    const shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
    const fire = (tint, size, opts) => { const f = K.makeFire(tint, size, opts); fires.push(f); return f; };
    const goldE = M.glow(0xffc04d, 2.6);
    const electron = (r = 0.055) => { const e = add(new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), goldE)); e.add(K.glowSprite(0xffc04d, r * 7)); return e; };
    const goldOuter = (A) => { const last = A.rings.length - 1; A.electrons.filter((x) => x.shell === last).forEach((x) => { x.e.material = goldE; x.e.children[0].material = x.e.children[0].material.clone(); x.e.children[0].material.color.set(0xffc04d); }); };
    /** an atom picture whose OUTER shell has radius r (real shells, scaled down as a whole) */
    const atomR = (h, r) => { const A = K.atom(h.shells, h.z, h.n, 0.45, 0.3), outer = 0.45 + 0.3 * (h.shells.length - 1); A.group.scale.setScalar(r / outer); goldOuter(A); return A; };
    const carry = (tg, t, m0, to, gap = 0.03) => {
      const on = t > m0 && t < m0 + 2.4; if (!on) return false;
      const top = to.clone().add(V(0, 1.1, 0));
      tg.position.copy(t < m0 + 1.2 ? top.lerp(to, 1 - (1 - span(t, m0, m0 + 1.2)) ** 2) : t < m0 + 1.5 ? to.clone() : to.clone().lerp(top, easeIn(span(t, m0 + 1.5, m0 + 2.4))));
      tg.userData.set(lerp(gap, gap + 0.05, span(t, m0 + 1.35, m0 + 1.5))); return true;
    };
    const flakes = (mat, n, w, seed = 0) => { const g = new THREE.Group(); for (let i = 0; i < n; i++) { const r = 0.016 + 0.01 * hash(i, 1 + seed); const c = K.solid(new THREE.BoxGeometry(r * 1.7, r * 0.5, r), mat); c.position.set((i / Math.max(1, n - 1) - 0.5) * w + (hash(i, 2 + seed) - 0.5) * 0.02, r * 0.25 + 0.003 * (i % 3), (hash(i, 3 + seed) - 0.5) * 0.05); c.rotation.set(0.12 * (i % 3), i * 1.3, 0.1 * ((i + 1) % 3)); g.add(c); } return g; };
    const iodM = () => new THREE.MeshPhysicalMaterial({ color: 0x2e2638, metalness: 0.6, roughness: 0.28, clearcoat: 0.7 });

    // ================================================================ HOOK / END · table salt; sodium burns in chlorine → salt
    {
      stage((t) => t < TB0 - 0.05 || t >= Z0 - 0.05); ST.bake(root, 'hook', -0.1, 2.95, 1.1);
      const sh = add(new THREE.Group(), SHX, 0, 0.05), shaker = K.saltShaker(0.24, 0.055); sh.add(shaker);
      const heap = add(K.saltHeap(0.1, 300), DSX, 0, 0.05), grains = Array.from({ length: 14 }, (_, i) => { const g = add(K.solid(new THREE.BoxGeometry(0.009, 0.009, 0.009), M.gloss(0xf6f5f1), { outline: false })); g.userData.k = hash(i, 4); g.rotation.set(hash(i, 5) * 3, hash(i, 6) * 3, hash(i, 9) * 3); return g; });
      const heapIn = heap.children.find((c) => c.isInstancedMesh);
      const jar = add(K.gasJar(0xa8e020, 0.17, 0.7), JX, 0, 0), gas = jar.userData.gas, lid = jar.userData.lid, lid0 = lid.position.clone(); gas.opacity = 0.5;
      const deposit = add(K.solid(new THREE.CylinderGeometry(0.15, 0.15, 1, 32).translate(0, 0.5, 0), new THREE.MeshPhysicalMaterial({ color: 0xf6f5f1, roughness: 0.5 }), { outline: false }), JX, 0.056, 0);
      const brn = add(K.burner(), BRN, 0, 0); fires.push(brn.userData.flame); brn.userData.flame.scale.setScalar(0.75);
      const sp = add(K.spoon(0.6)), naM = new THREE.MeshStandardMaterial({ color: 0xd8dce2, metalness: 0.7, roughness: 0.3, emissive: 0xff8a20, emissiveIntensity: 0 });
      const na = K.lump(0.035, naM, 7, 0.7, 0.3); na.position.y = -0.03; sp.add(na);
      const fl = add(fire(0xffc21a, 0.34, { core: 0xfff3c4 })), fume = add(K.smoke(8, 0xffffff), JX, 0.1, 0); fume.scale.setScalar(0.12);
      const white = new THREE.Color(0xf4f4ee), green = new THREE.Color(0xa8e020);
      const IN = V(JX, 0.4, 0), FL = V(BRN, 0.74, 0), UP = V(BRN, 1.15, 0), OVER = V(JX, 1.15, 0);
      const lSalt = tag('table salt', 0.05, '#ffffff', DSX, 0.2, 0.25), lCl = tag('chlorine: a poison gas', 0.05, '#d8f590', JX, 0.88, 0.05);
      const lNa = tag('sodium', 0.05, '#ffffff', 0, 0, 0), lMade = tag('salt forms ✓', 0.055, '#ffffff', JX, 0.88, 0.05);
      const lSF = tag('chlorine: a salt-former', 0.05, '#d8f590', JX, 0.88, 0.05);
      const lGain = tag('takes 1 electron', 0.05, '#d8f590', JX, 0.88, 0.05), lForm = tag('forms salts ✓', 0.055, '#ffffff', JX - 0.18, 0.2, 0.3);
      beats.push((t) => {
        // the shaker tilts over the dish, salt grains fall, the heap grows
        const pw = (p0) => ease(span(t, p0, p0 + 0.6)) * (1 - ease(span(t, p0 + 2.6, p0 + 3.2))), tilt = pw(T.pour) + pw(Z0 + 4.0);
        const pouring = (t > T.pour + 0.6 && t < T.pour + 2.6) || (t > Z0 + 4.6 && t < Z0 + 6.6), shk = pouring ? 0.012 * Math.sin(t * 28) : 0;
        sh.rotation.z = -2.0 * tilt; sh.position.set(SHX + 0.16 * tilt + shk, 0.3 * tilt, 0.05);
        shaker.userData.fill(span(t, T.pour + 0.6, T.pour + 2.6));
        sh.updateMatrixWorld(true); const top = sh.localToWorld(shaker.userData.top.clone());
        grains.forEach((g, i) => { const u = (((t - T.pour) * 1.6 + g.userData.k) % 1 + 1) % 1, on = pouring; g.visible = on; g.position.set(lerp(top.x + (hash(i, 8) - 0.5) * 0.03, DSX + (g.userData.k - 0.5) * 0.05, u), lerp(top.y, 0.05, u * u) + 0.002 * i, 0.05 + (hash(i, 7) - 0.5) * 0.04 + 0.0013 * i); });
        const hk = t < 0 ? 0 : 0.25 + 0.75 * ease(span(t, T.pour + 0.6, T.pour + 2.6)); heapIn.scale.set(1, Math.max(0.05, hk), 1);
        // the spoon: sodium warmed in the flame, into the jar: a yellow flame, white smoke, salt settles
        let p;
        if (t < T.hot) p = V(BRN, lerp(1.9, FL.y, ease(span(t, T.sp, T.hot))), 0);
        else if (t < T.inj) p = FL.clone().lerp(UP, ease(span(t, T.inj - 0.6, T.inj)));
        else if (t < T.inj + 0.8) p = K.arc(UP, OVER, 0.1, ease(span(t, T.inj, T.inj + 0.8)));
        else if (t < T.out) p = OVER.clone().lerp(IN, ease(span(t, T.inj + 0.8, T.burn)));
        else p = IN.clone().lerp(V(JX, 2.0, 0), easeIn(span(t, T.out, T.out + 1.4)));
        sp.position.copy(p); sp.visible = t > T.sp && t < T.out + 1.4;
        const glow = ease(span(t, T.hot, T.hot + 0.8)), burnt = ease(span(t, T.burn, T.out));
        naM.emissiveIntensity = 0.8 * glow * (1 - burnt); naM.color.set(0xd8dce2).lerp(white, burnt); na.scale.setScalar(Math.max(0.2, 1 - 0.6 * burnt));
        const fk = ease(span(t, T.burn - 0.2, T.burn + 0.3)) * (1 - ease(span(t, T.out - 0.6, T.out))) * (1 + 0.12 * Math.sin(t * 17));
        fl.visible = fk > 0.01; fl.position.copy(p).add(V(0, -0.01, 0)); fl.scale.setScalar(Math.max(1e-4, fk));
        const off = ease(span(t, T.lid, T.lid + 0.6)) * (1 - ease(span(t, T.out + 1.2, T.out + 1.8)));
        lid.position.set(lid0.x - 0.42 * off, lid0.y - (lid0.y - 0.006) * easeIn(span(off, 0.6, 1)), lid0.z);
        const smoke = ease(span(t, T.burn, T.out)), settle = ease(span(t, T.salt, T.salt + 2.2));
        gas.color.copy(green).lerp(white, smoke); gas.opacity = 0.5 - 0.1 * smoke - 0.32 * settle;
        fume.visible = t > T.burn && t < T.salt + 2.4; fume.userData.update(t - T.burn, smoke * (1 - settle));
        deposit.scale.y = Math.max(1e-4, 0.022 * settle); deposit.visible = settle > 0.01;
        lNa.position.copy(p).add(V(0.24, 0.1, 0.1)); K.popIn(lNa, t, T.sp + 1.2, T.inj);
        K.popIn(lSalt, t, T.pour + 1.6, T.jar + 0.6); K.popIn(lCl, t, T.jar + 0.8, T.burn); K.popIn(lMade, t, T.salt + 1.2, T.ask);
        K.popIn(lSF, t, T.ask + 0.2, T.card - 0.2);
        K.popIn(lGain, t, Z0 + 0.8, 1e9); K.popIn(lForm, t, Z0 + 5.0, 1e9);
      });
    }

    // ================================================================ TABLE (dark) · group VII: the halogens
    {
      stage((t) => t >= TB0 - 0.05 && t < TEND);
      const key = new THREE.DirectionalLight(0xfff2e0, 2.2); key.position.set(TBX - 3, TY(4) + 4, 6); key.target.position.set(TBX, TY(4), 0); root.add(key, key.target);
      const own = HAL.map((h) => h.z), rest = [];
      for (let z = 1; z <= 118; z++) if (!own.includes(z)) { const [r, c] = place(z); rest.push({ r, c }); }
      const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(0.44, 0.44, 0.06), M.gloss(0x4a4f58), rest.length); root.add(inst);
      const m4 = new THREE.Matrix4(); rest.forEach(({ r, c }, i) => { m4.makeTranslation(COL(c), TY(r), 0); inst.setMatrixAt(i, m4); });
      const GREY = new THREE.Color(0x4a4f58);
      const tiles = HAL.map((h, i) => { const [r, c] = place(h.z); const tl = K.tile(SYM[h.z], 0xffffff, 0.44, 0.44, 0.08); tl.position.set(COL(c), TY(r), 0.01); root.add(tl); return { tl, col: new THREE.Color(h.col), t0: TB0 + 2.0 + i * 0.6 }; });
      const lG = lbl('group VII: the halogens', 0.6, '#d8f590', COL(9.5), TY(1.6)), lW = lbl('halogen = "salt-forming"', 0.6, '#ffe08a', COL(9.5), TY(1.6));
      beats.push((t) => {
        if (!shown(inst)) return;
        tiles.forEach(({ tl, col, t0 }) => { const m = tl.userData.body.material, k = ease(span(t, t0, t0 + 0.4)); m.color.copy(GREY).lerp(col, k); const f = Math.sin(Math.PI * span(t, t0, t0 + 0.8)); tl.position.z = 0.01 + 0.08 * f; m.emissive.set(0xf0b030); m.emissiveIntensity = 0.5 * f; });
        K.popIn(lG, t, TB0 + 5.0, TB0 + 8.4); K.popIn(lW, t, TB0 + 8.8, 1e9);
      });
    }

    // ================================================================ STATES · Fig. 8.5 as five jars (F, Cl, Br, I, At)
    {
      stage((t) => t >= S0 - 0.05 && t < SEND); ST.bake(root, 'states', SX, 4.1, 1.1);
      const s = (k) => S0 + k;
      const mk = (x, color, op, y = 0) => { const j = add(K.gasJar(color, 0.15, 0.55), x, y, 0); j.userData.gas.opacity = op; return j; };
      const jF = mk(JXS[0], 0xf2e45a, 0.46), jC = mk(JXS[1], 0xa8e020, 0.5), jB = mk(JXS[2], 0xb0502a, 0.42);
      add(K.liquid(0.13, 0.1, 0x5a0e06, 0.9), JXS[2], 0.056, 0);
      const plate = add(K.hotPlate(0.34, 0.3), JXS[3], 0, 0), jI = mk(JXS[3], 0x8a4ad8, 0.02, 0.106);
      const iod = flakes(iodM(), 9, 0.16, 2); iod.position.set(JXS[3], 0.106 + 0.054, 0); root.add(iod);
      const vI = add(K.smoke(8, 0x9a5ae8), JXS[3], 0.2, 0); vI.scale.setScalar(0.12);
      const vB = add(K.smoke(6, 0xc06a3a), JXS[2], 0.18, 0); vB.scale.setScalar(0.1);
      const at = add(K.vial(0.06, 0.18), JXS[4], 0, 0), atS = flakes(iodM(), 3, 0.04, 5); atS.position.set(JXS[4], 0.024, 0); root.add(atS);
      const wF = add(K.smoke(8, 0xf0e88a), JXS[0], 0.57, 0), wC = add(K.smoke(8, 0xb4ec30), JXS[1], 0.57, 0); wF.scale.setScalar(0.16); wC.scale.setScalar(0.16);
      const lids = [jF, jC].map((j) => ({ lid: j.userData.lid, l0: j.userData.lid.position.clone() }));
      const L = [
        tag('fluorine: gas', 0.05, '#f6f0a8', JXS[0], 0.78, 0.05), tag('chlorine: gas', 0.05, '#d8f590', JXS[1], 0.78, 0.05),
        tag('bromine: liquid', 0.05, '#ffb09a', JXS[2], 0.78, 0.05), tag('iodine: solid', 0.05, '#d8c8ff', JXS[3], 0.84, 0.05),
        tag('purple vapour', 0.05, '#d8c8ff', JXS[3], 0.84, 0.05), tag('astatine: solid', 0.05, '#e6e8ec', JXS[4], 0.42, 0.05),
        tag('radioactive', 0.05, '#ffd27a', JXS[4], 0.42, 0.05),
      ];
      const lAll = [tag('gas', 0.055, '#d8f590', (JXS[0] + JXS[1]) / 2, 0.8, 0.05), tag('liquid', 0.055, '#ffb09a', JXS[2], 0.8, 0.05), tag('solid', 0.055, '#d8c8ff', (JXS[3] + JXS[4]) / 2, 0.86, 0.05)];
      const twk = add(K.sparkle(0xfff2c0, 0.08));
      beats.push((t) => {
        // fluorine, then chlorine: the lid is lifted a little, wisps curl out, the lid goes back
        [[s(0.8), wF], [s(4.8), wC]].forEach(([t0, w], i) => {
          const up = ease(span(t, t0, t0 + 0.5)) * (1 - ease(span(t, t0 + 2.6, t0 + 3.1))), { lid, l0 } = lids[i];
          lid.position.set(l0.x + 0.06 * up, l0.y + 0.1 * up, l0.z); lid.rotation.z = -0.3 * up;
          w.visible = t > t0 + 0.3 && t < t0 + 4.6; w.userData.update(t - t0, up * 1.3 + 0.4 * span(t, t0 + 0.3, t0 + 0.8) * (1 - span(t, t0 + 3.1, t0 + 4.6)));
        });
        // bromine: its red-brown vapour swirls above the liquid
        vB.visible = t > s(8.0); vB.userData.update(t - s(8.0), 0.9 * span(t, s(8.0), s(8.8)));
        // iodine: the hot plate is switched on, purple vapour rises and fills the jar
        const heat = ease(span(t, s(13.4), s(14.0))); plate.userData.on(heat);
        const pv = ease(span(t, s(14.4), s(17.4))); jI.userData.gas.opacity = 0.02 + 0.4 * pv;
        vI.visible = t > s(14.2); vI.userData.update(t - s(14.2), pv);
        // astatine: a faint twinkle marks the tiny sample
        const k = ((t - s(18.6)) % 1.6 + 1.6) % 1.6; twk.visible = t > s(18.6) && k < 0.8; twk.position.set(JXS[4] + 0.01, 0.05, 0.06); twk.scale.setScalar(Math.max(1e-4, 0.08 * Math.sin(Math.PI * k / 0.8)));
        const W = [[s(0.4), s(4.4)], [s(4.6), s(8.0)], [s(8.4), s(11.6)], [s(12.8), s(14.6)], [s(15.0), s(18.4)], [s(18.6), s(20.2)], [s(20.4), s(22.0)]];
        L.forEach((l, i) => K.popIn(l, t, ...W[i]));
        lAll.forEach((l, i) => K.popIn(l, t, s(23.0) + i * 0.4, 1e9));
      });
    }

    // ================================================================ CONDUCTOR · iodine across the gap: the bulb stays off
    {
      stage((t) => t >= C0 - 0.05 && t < CEND); ST.bake(root, 'cond', CX, 2.8, 1.2);
      for (const s of [-1, 1]) { add(K.solid(new THREE.BoxGeometry(0.12, 0.08, 0.12), M.matte(0x22252b, 0.6)), CX + s * 0.25, 0.04, 0); add(K.solid(new THREE.BoxGeometry(0.13, 0.03, 0.13), M.metal(0xb9bec6, 0.3)), CX + s * 0.25, 0.096, 0); }
      add(K.battery(), CX - 0.85, 0, -0.05);
      add(K.wire([[CX - 0.85, 0.87, -0.05], [CX - 0.8, 0.95, 0.0], [CX - 0.55, 0.42, 0.12], [CX - 0.4, 0.12, 0.06], [CX - 0.31, 0.1, 0]]));
      add(K.wire([[CX + 0.31, 0.1, 0], [CX + 0.48, 0.07, 0.05], [CX + 0.64, 0.06, 0.03], [CX + 0.72, 0.08, 0]]));
      add(K.wire([[CX + 0.86, 0.04, -0.09], [CX + 0.5, 0.024, -0.32], [CX - 0.5, 0.024, -0.32], [CX - 0.72, 0.024, -0.14]], 0x2b2f38));
      add(K.bulb(), CX + 0.8, 0.0, 0);
      const bridge = add(new THREE.Group()), bar = K.solid(new THREE.BoxGeometry(0.66, 0.016, 0.07), iodM()); bar.position.y = 0.008; bridge.add(bar);
      const fl = flakes(iodM(), 8, 0.56, 9); fl.position.y = 0.016; bridge.add(fl);
      const tg = add(K.tongs(0.7));
      const lGap = tag('a gap: bulb off', 0.05, '#ffffff', CX, 0.0, 0.42), lI = tag('iodine crystals', 0.05, '#d8c8ff', CX, 0.0, 0.42), lOff = tag('bulb stays off ✓', 0.055, '#ffffff', CX + 0.62, 0.78, 0.1);
      const REST = V(CX, 0.114, 0);
      beats.push((t) => {
        const c = carry(tg, t, C0 + 1.4, REST.clone().add(V(0, 0.03, 0)), 0.045); tg.visible = c;
        bridge.visible = t > C0 + 1.4; bridge.position.copy(t < C0 + 2.6 ? tg.position.clone().add(V(0, -0.03, 0)) : REST);
        K.popIn(lGap, t, C0 + 0.3, C0 + 2.4); K.popIn(lI, t, C0 + 2.8, CEND); K.popIn(lOff, t, C0 + 3.8, CEND);
      });
    }

    // ================================================================ INSIDE (dark) · 7 outer electrons; five atoms; sodium's electron → Cl⁻
    {
      stage((t) => t >= I0 - 0.05 && t < IEND);
      const key = new THREE.DirectionalLight(0xfff2e0, 2.0); key.position.set(IX, 6, 7); key.target.position.set(IX, AY, 0); root.add(key, key.target);
      const A = HAL.map((h, i) => { const a = atomR(h, RX[i]); add(a.group, ROWX[i], AY, 0); return a; });
      const cl = A[1], ring = cl.rings[2], outer = cl.electrons.filter((e) => e.shell === 2);
      outer.forEach((e, k) => { e.a0 = k / 8 * Math.PI * 2; });
      const w = outer[0].w, R2 = outer[0].R;
      const ghost = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.012, 8, 24), new THREE.MeshBasicMaterial({ color: 0xffc04d, transparent: true, opacity: 0.8, toneMapped: false })); ring.add(ghost);
      const NA = K.atom([2, 8, 1], 11, 12, 0.45, 0.3); NA.group.scale.setScalar(RX[1] * 1.3 / 1.05); add(NA.group, NAX, AY, 0);
      const x1 = NA.electrons.find((e) => e.shell === 2); x1.e.material = goldE;
      const fly = electron(0.05);
      const i = (k) => I0 + k;
      const lCl = lbl('chlorine: 2, 8, 7', 0.24, '#ffffff', CLX, AY + 0.82), lCfg = lbl('3s² 3p⁵', 0.24, '#ffe08a', CLX, AY - 0.8);
      const lGap = lbl('1 empty place: needs 1 electron', 0.2, '#ffe08a', CLX, AY - 0.8);
      const syms = HAL.map((h, k) => lbl(h.s, 0.42, '#ffffff', ROWX[k], AY + RX[k] + 0.3, 0, 700)), pms = HAL.map((h, k) => lbl(`${h.pm} pm`, 0.32, '#bfe2ff', ROWX[k], AY - RX[k] - 0.3));
      const lSeven = lbl('7 outer electrons each: ns² np⁵', 0.4, '#ffe08a', IX - 0.6, AY + 1.5), lBig = lbl('bigger down the group →', 0.4, '#bfe2ff', IX - 0.6, AY + 1.5);
      const lNa = lbl('sodium', 0.3, '#ffffff', NAX, AY + 0.95), lClM = lbl('Cl⁻: a halide ion', 0.3, '#d8f590', CLX, AY + 0.95, 0, 700);
      const lClN = lbl('chlorine', 0.3, '#ffffff', CLX, AY + 0.95), lNaP = lbl('Na⁺', 0.34, '#ffd9b8', NAX, AY + 0.95, 0, 700);
      beats.push((t) => {
        if (!shown(cl.group)) return;
        A.forEach((a, k) => {
          a.update(t);
          const on = k === 1 ? 1 : back(span(t, ROW + 0.6 + Math.abs(k - 1) * 0.4, ROW + 1.0 + Math.abs(k - 1) * 0.4)) * (1 - ease(span(t, BACK - 0.6, BACK)));
          a.group.visible = on > 0.01; if (k !== 1) a.group.scale.setScalar(Math.max(1e-4, on * RX[k] / (0.45 + 0.3 * (HAL[k].shells.length - 1))));
        });
        const sa = 7 / 8 * Math.PI * 2 + t * w;
        ghost.position.set(Math.cos(sa) * R2, 0, Math.sin(sa) * R2); ghost.rotation.x = Math.PI / 2;
        ghost.visible = t > i(4.0) && t < i(26.0); ghost.scale.setScalar(1 + 0.25 * Math.sin(t * 5));
        // sodium drifts in from the left; its gold outer electron flies over into chlorine's empty place
        const nIn = ease(span(t, BACK + 0.6, BACK + 2.6)); NA.group.visible = t > BACK + 0.4; NA.group.position.x = lerp(NAX - 2.2, NAX, nIn); NA.update(t);
        const t1 = i(23.6), t2 = i(25.6); x1.free = t > t1; x1.e.visible = t < t1; if (x1.free) x1.e.position.set(Math.cos(x1.a0 + t1 * x1.w) * x1.R, 0, Math.sin(x1.a0 + t1 * x1.w) * x1.R);
        NA.group.updateMatrixWorld(true); cl.group.updateMatrixWorld(true);
        const a1 = x1.a0 + t1 * x1.w, from = NA.rings[2].localToWorld(V(Math.cos(a1) * x1.R, 0, Math.sin(a1) * x1.R)), slot = ring.localToWorld(V(Math.cos(sa) * R2, 0, Math.sin(sa) * R2));
        fly.visible = t > t1; fly.position.copy(t < t2 ? K.arc(from, slot, 0.7, ease(span(t, t1, t2))) : slot);
        ring.children[0].material.opacity = 0.55 + 0.4 * Math.sin(Math.PI * span(t, t2, t2 + 0.8));
        K.popIn(lCl, t, i(0.5), ROW); K.popIn(lCfg, t, i(1.6), i(4.2)); K.popIn(lGap, t, i(4.6), ROW);
        syms.forEach((l, k) => K.popIn(l, t, ROW + 1.0 + Math.abs(k - 1) * 0.4, BACK - 0.4)); pms.forEach((l, k) => K.popIn(l, t, i(15.6) + k * 0.25, BACK - 0.4));
        K.popIn(lSeven, t, i(12.0), i(15.2)); K.popIn(lBig, t, i(15.6), BACK - 0.4);
        K.popIn(lNa, t, BACK + 2.4, t2); K.popIn(lNaP, t, t2 + 0.35, IEND); K.popIn(lClN, t, BACK + 2.6, t2 - 0.2); K.popIn(lClM, t, t2 + 0.3, IEND);
      });
    }

    // ================================================================ THE BOARD (dark) · X₂ + 2e⁻ → 2X⁻, then Cl₂ + 2e⁻ → 2Cl⁻
    {
      stage((t) => t >= Q0 - 0.05 && t < QEND);
      const key = new THREE.DirectionalLight(0xfff2e0, 2.0); key.position.set(QX - 2, 5, 6); key.target.position.set(QX, AY, 0); root.add(key, key.target);
      const q = (k) => Q0 + k, BY = AY + 0.4, clM = M.gloss(0x9ad24a);
      const mol = (x) => { const g = add(new THREE.Group(), x, BY, 0); [-0.33, 0.33].forEach((dx) => { const b = K.solid(new THREE.SphereGeometry(0.37, 32, 20), clM); b.position.x = dx; g.add(b); }); return g; };
      mol(QX - 2.75); const m1 = mol(QX - 2.75);
      const es = [0, 1].map(() => electron(0.075)), eTr = [0, 1].map(() => electron(0.075));
      const ions = [0, 1].map(() => add(K.ion(0.48, 0x7fc44a, '−')));
      const arrow = add(new THREE.Group(), QX - 0.05, BY, 0), aM = M.glow(0xf6d48f, 1.2);
      arrow.add(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.55, 12).rotateZ(Math.PI / 2).translate(0.275, 0, 0), aM), new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 16).rotateZ(-Math.PI / 2).translate(0.62, 0, 0), aM));
      const WY = AY - 1.12, SY = AY - 0.45;
      const words = [['halogen molecule', -2.75, 0.6], ['+', -1.68, 3.2], ['2 electrons', -0.8, 3.0], ['2 halide ions', 1.75, 6.0]].map(([s, x, k]) => ({ l: lbl(s, 0.32, '#ffffff', QX + x, WY), k }));
      const symX = [['X₂', -2.75, 7.0], ['+', -1.85, 7.4], ['2e⁻', -0.83, 7.8], ['→', 0.25, 8.2], ['2X⁻', 1.75, 8.6]].map(([s, x, k]) => ({ l: lbl(s, 0.44, '#f6d48f', QX + x, SY, 0, 700), k }));
      const symC = [lbl('Cl₂', 0.44, '#f6d48f', QX - 2.75, SY, 0, 700), lbl('2Cl⁻', 0.44, '#f6d48f', QX + 1.75, SY, 0, 700)];
      const EP = [V(QX - 1.0, BY, 0), V(QX - 0.66, BY, 0)];
      beats.push((t) => {
        es.forEach((e, k) => { const u = ease(span(t, q(1.4 + 0.3 * k), q(2.6 + 0.3 * k))); e.visible = u > 0.01; e.position.copy(K.arc(V(QX - 1.2, BY + 3.2, 0), EP[k], 0.3, u)).add(V(0, 0.03 * Math.sin(t * 3 + k), 0)); });
        const go = ease(span(t, q(3.8), q(5.0))), sp = ease(span(t, q(5.0), q(5.8)));
        m1.visible = t > q(3.8) && sp < 0.6; m1.position.x = lerp(QX - 2.75, QX + 1.75, go);
        eTr.forEach((e, k) => { e.visible = m1.visible; e.position.copy(EP[k]).lerp(V(QX + 1.75 + (k ? 0.33 : -0.33), BY + 0.4, 0), go); });
        ions.forEach((o, k) => { o.visible = sp > 0.3; o.position.set(QX + 1.75 + (k ? 1 : -1) * lerp(0.33, 0.56, sp), BY, 0); o.scale.setScalar(Math.max(1e-4, back(span(t, q(5.1), q(5.7))))); });
        arrow.visible = t > q(3.6); arrow.scale.setScalar(Math.max(1e-4, back(span(t, q(3.6), q(4.0)))));
        words.forEach(({ l, k }) => K.popIn(l, t, q(k), 1e9));
        symX.forEach(({ l, k }, j) => K.popIn(l, t, q(k), j === 0 || j === 4 ? q(10.6) : 1e9));
        symC.forEach((l, j) => K.popIn(l, t, q(11.0 + 0.4 * j), 1e9));
      });
    }

    // ================================================================ NATURE (dark) · chloride + sodium ions build a salt crystal: never free
    {
      stage((t) => t >= L0 - 0.05 && t < LEND);
      const key = new THREE.DirectionalLight(0xfff2e0, 2.0); key.position.set(LX - 2, 5, 6); key.target.position.set(LX, AY, 0); root.add(key, key.target);
      const l = (k) => L0 + k, P = 0.5, TILT = new THREE.Euler(0.35, 0.6, 0);
      const box = add(new THREE.Group(), LX, AY, 0); box.rotation.copy(TILT);
      const ions = [];
      for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) for (let i = -1; i <= 1; i++) {
        const isNa = ((i + j + k) % 2 + 2) % 2 === 0, s = K.solid(new THREE.SphereGeometry(isNa ? 0.15 : 0.24, 24, 16), M.gloss(isNa ? 0xe58a3a : 0x7fc44a), { outline: false });
        box.add(s); ions.push({ s, home: V(i * P, j * P, k * P), t0: l(0.1) + (j + 1) * 1.4 + ((k + 1) * 3 + i + 1) * 0.1 });
      }
      const lI = lbl('Cl⁻ and Na⁺: salt', 0.36, '#d8f590', LX, AY + 1.35), lN = lbl('never free: too reactive', 0.36, '#ffe08a', LX, AY - 1.35);
      beats.push((t) => {
        box.rotation.y = TILT.y + 0.15 * Math.sin(t * 0.3);
        ions.forEach(({ s, home, t0 }) => { const u = span(t, t0, t0 + 0.5); s.visible = u > 0; s.position.copy(home); s.position.y += 1.4 * (1 - ease(u)); });
        K.popIn(lI, t, l(4.4), 1e9); K.popIn(lN, t, l(6.2), 1e9);
      });
    }

    // ================================================================ PAIRS (dark) · Cl₂: one shared pair; F₂, Br₂, I₂ · very reactive
    {
      stage((t) => t >= D0 - 0.05 && t < DEND);
      const key = new THREE.DirectionalLight(0xfff2e0, 2.0); key.position.set(DX, 5, 6); key.target.position.set(DX + 1.5, AY, 0); root.add(key, key.target);
      const d = (k) => D0 + k;
      const a1 = atomR(HAL[1], 0.62), a2 = atomR(HAL[1], 0.62); add(a1.group, DX - 1.2, AY, 0); add(a2.group, DX + 1.2, AY, 0);
      const pair = [electron(0.06), electron(0.06)];
      const pmol = (h, x, r) => { const g = add(new THREE.Group(), x, AY, 0); [-0.8, 0.8].forEach((s) => { const b = K.solid(new THREE.SphereGeometry(r, 32, 20), M.gloss(h.col)); b.position.x = s * r; g.add(b); }); g.visible = false; return g; };
      const others = [[HAL[0], DX + 2.2, 0.22], [HAL[2], DX + 3.3, 0.3], [HAL[3], DX + 4.5, 0.36]].map(([h, x, r]) => ({ g: pmol(h, x, r), l: lbl(`${h.s}₂`, 0.44, '#ffffff', x, AY - 0.75, 0, 700) }));
      const lPair = lbl('shared pair = single bond', 0.28, '#ffe08a', DX, AY + 1.05), lCl2 = lbl('Cl₂: diatomic', 0.42, '#d8f590', DX, AY - 0.75, 0, 700);
      const lReact = lbl('all very reactive', 0.46, '#ffe08a', DX + 1.75, AY + 1.25);
      beats.push((t) => {
        if (!shown(a1.group)) return;
        a1.update(t); a2.update(t);
        const j = ease(span(t, d(0.6), d(2.6))); a1.group.position.x = lerp(DX - 1.2, DX - 0.52, j); a2.group.position.x = lerp(DX + 1.2, DX + 0.52, j);
        // one outer electron from each atom moves into the middle: the shared pair
        const pj = ease(span(t, d(2.8), d(4.2)));
        [a1, a2].forEach((a, k) => { const x = a.electrons.filter((e) => e.shell === 2)[0]; x.e.visible = pj < 0.02; });
        pair.forEach((e, k) => { e.visible = pj >= 0.02; const from = V(k ? DX + 0.2 : DX - 0.2, AY + 0.45, 0.2); e.position.copy(from.lerp(V(DX, AY + (k ? -0.07 : 0.07), 0.3), pj)); e.scale.setScalar(1 + 0.4 * Math.sin(Math.PI * span(t, d(4.2), d(5.0)))); });
        others.forEach(({ g, l }, k) => { const u = back(span(t, d(11.8) + k * 0.5, d(12.3) + k * 0.5)); g.visible = u > 0.01; g.scale.setScalar(Math.max(1e-4, u)); K.popIn(l, t, d(12.0) + k * 0.5, 1e9); });
        K.popIn(lPair, t, d(4.6), d(11.0)); K.popIn(lCl2, t, d(6.8), 1e9); K.popIn(lReact, t, d(13.6), 1e9);
      });
    }

    // ================================================================ TRENDS (dark) · Table 8.9 as five bars that change property
    {
      stage((t) => t >= B0 - 0.05 && t < BEND);
      const key = new THREE.DirectionalLight(0xfff2e0, 2.0); key.position.set(BX - 2, 5, 6); key.target.position.set(BX, AY, 0); root.add(key, key.target);
      const XS = HAL.map((_, k) => BX + (k - 2) * 0.9), MAXH = 1.5;
      add(K.solid(new THREE.BoxGeometry(4.6, 0.02, 0.4), M.matte(0x5a606a, 0.6)), BX, AY - 0.012, 0);
      const bars = HAL.map((h, k) => add(K.solid(new THREE.BoxGeometry(0.5, 1, 0.3).translate(0, 0.5, 0), M.gloss(h.col)), XS[k], AY + 0.004, 0));
      const syms = HAL.map((h, k) => lbl(h.s, 0.44, '#ffffff', XS[k], AY - 1.98, 0, 700));
      const H = PROPS.map(([, key]) => { const vals = HAL.map((h) => h[key] ?? 0), m = Math.max(...vals.map(Math.abs)); return vals.map((v) => (v / m) * MAXH); });
      const titles = PROPS.map(([s]) => lbl(s, 0.44, '#ffe08a', BX, AY + 2.45));
      const vals = PROPS.map(([, key, f], p) => HAL.map((h, k) => { const hh = H[p][k]; return lbl(f(h[key], h), 0.3, '#ffffff', XS[k], AY + (hh >= 0 ? hh + 0.2 : hh - 0.2)); }));
      const lF = lbl('fluorine: most electronegative', 0.34, '#ffffff', BX - 0.3, AY + 2.05), lR = lbl('reactivity falls: F → At', 0.44, '#ffe08a', BX, AY + 2.45);
      const arrow = add(new THREE.Group(), XS[0], AY + 2.05, 0.3), aM = M.glow(0xffc04d, 1.4);
      arrow.add(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1, 12).rotateZ(Math.PI / 2).translate(0.5, 0, 0), aM)); const head = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.24, 16).rotateZ(-Math.PI / 2), aM); arrow.add(head);
      const hOf = (p, k) => H[p][k];
      beats.push((t) => {
        let p = 0; for (let k = 0; k < 6; k++) if (t >= BP(k)) p = k;
        const u = ease(span(t, BP(p), BP(p) + 0.8)), grow = ease(span(t, B0 + 0.3, BP(0) + 0.8));
        bars.forEach((b, k) => { const from = p ? hOf(p - 1, k) : 0, h = lerp(from, hOf(p, k), p ? u : grow); b.scale.y = Math.abs(h) < 1e-3 ? 1e-4 : Math.abs(h); b.position.y = AY + (h < 0 ? h : 0.004); b.visible = Math.abs(h) > 1e-3; });
        syms.forEach((l) => K.popIn(l, t, B0 + 0.2, 1e9));
        titles.forEach((l, k) => K.popIn(l, t, BP(k) - 0.05, k < 5 ? BP(k + 1) - 0.3 : BP(6) - 0.3));
        vals.forEach((row, k) => row.forEach((l) => K.popIn(l, t, BP(k) + 0.9, k < 5 ? BP(k + 1) - 0.3 : BEND)));
        K.popIn(lF, t, BP(5) + 1.4, BP(6) - 0.3); K.popIn(lR, t, BP(6), BEND);
        const g = ease(span(t, BP(6) + 0.4, BP(6) + 2.4)), L = Math.max(1e-4, (XS[4] - XS[0]) * g);
        arrow.visible = g > 0.01; arrow.children[0].scale.x = L; head.position.x = L + 0.1;
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Why are halogens called salt-formers?', intro: INTRO, ticks: TICKS,
      rows: [[0, 'sodium + chlorine → salt'], [1, 'five halogens: group VII'], [1, 'gas, liquid and solid'], [1, 'poor conductors'], [1, '7 outer electrons: ns² np⁵'],
        [1, 'gain one: halide ions X⁻'], [1, 'never free in nature'], [1, 'pairs: X₂, one bond'], [1, 'trends down the group']],
      short: ['group VII', 'states', 'conductors', '7 outer', 'X⁻ ions', 'never free', 'X₂', 'trends'] }));
    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));
    beats.push(() => { const nar = Math.min(1, (cam.aspect / 1.5) ** 0.7); tags.forEach((l) => { if (l.visible) l.scale.multiplyScalar(cam.position.distanceTo(l.position) * 2 * TAN * l.userData.frac * nar / 0.1); }); });

    return (t, dt) => { for (const b of beats) b(t, dt); };
  },
};
