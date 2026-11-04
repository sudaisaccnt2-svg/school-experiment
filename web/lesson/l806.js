// Lesson 806 · Ionization energy of alkali and alkaline earth metals (book pp. 226–229 top), v1 (2026-10-13).
// Built from SKILL §0 + the approved 805 v3 pattern: a hook from real life on a baked table, ONE question on a card,
// dark atom close-ups, one simple picture per pattern (a bar chart), back to the opening table at the end.
// THE QUESTION: "Why does sodium react faster than magnesium?" → card: Pulling off an electron · Group IIA · The answer.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//   HOOK    two beakers of water. Tongs drop sodium: it melts into a ball and races, fizzing. Tongs drop magnesium: it
//           sinks and hardly reacts · both are metals, so why? → card · "to react, a metal gives away electrons" →
//           push into the racing sodium.
//   COST    (dark) one sodium atom on its own (gaseous atom); its 1 outer electron turns gold, a pink line = the
//           nucleus holding it; the electron is pulled away, a gold bar rises as it goes = the energy spent: 496 kJ/mol
//           → "ionization energy" on the bar, Na → Na⁺ + 1e⁻ ΔE = 496 kJ/mol (tick 1) · is it the same for all?
//   IA      in the same spot, lithium (smallest, 2 shells, line bright) → 520, the highest; then potassium, rubidium,
//           caesium grow one shell each, the line gets fainter, their bars get lower (Table 8.2 = the bars, radius on
//           each atom) · bigger atom, farther electron, held less → the cost falls (tick 2) · and group IIA?
//   IIA     sodium and magnesium side by side: 3s¹ vs 3s² (same sub-shell), 11+ vs 12+ (one more + charge), radius 1.86
//           vs 1.60 (smaller); magnesium's first electron 737.7 (bar beside sodium's 496) (tick 3); Mg⁺ pulls harder:
//           the second 1450.7 (tick 4); still forms Mg²⁺ · Table 8.3 as pairs of bars: beryllium smallest and highest,
//           both costs fall down the group · row by row IA vs IIA: IA always lower (most / second most electropositive).
//   ANSWER  back on the table: sodium (496: easy) races, magnesium (737.7 + 1450.7) hardly reacts → lower ionization
//           energy = reacts faster (tick 5) · IA → IIA: harder, denser (sodium floats, magnesium sinks), higher melting
//           and boiling points; less electropositive, conducts less, weaker reducing agent, smaller atoms.
// Book points (all): definition (minimum energy to remove the valence electron from the outermost shell of a gaseous
// atom → positive ion; ionization potential or energy; measured in J or kJ per mole) · group IA except H = alkali
// metals Li Na K Rb Cs Fr, most electropositive, one outer electron, very easy to remove → most reactive · Na → Na⁺ +
// 1e⁻ ΔE = 496 kJ/mol · Li highest IE (smallest, 2 shells, close) · down the group Z and radius increase, held less
// firmly, IE decreases (Table 8.2: Z, radius, IE) · group IIA second most electropositive, 2 valence electrons → M²⁺ ·
// ns² vs ns¹ · an additional positive charge in the nucleus · IIA higher melting and boiling points, IA softer and
// lighter · second electron in the same sub-level → smaller radius, much higher IE · still form ionic compounds with
// M²⁺ · Mg → Mg⁺ + 1e⁻ 737.7 · second electron needs more energy (increased attraction): Mg⁺ → Mg²⁺ + 1e⁻ 1450.7 ·
// Be behaves differently: top, highest IE, small size · Table 8.3 (Z, radius, 1st and 2nd IE) decreasing down the
// group, one more shell per period · lower IE of IA → ion formation easier → alkali metals more reactive than IIA ·
// p.229 top: IA → IIA (in a period) melting and boiling points, densities and hardness increase; electropositivity,
// conductivity, reducing power and atomic radii decrease. Atomic numbers of the tables → 🎮 game (COVERAGE_U8).
// §1 CHECK (sheets renders/lesson/f806.jpg, e806.jpg, 806_screens.jpg): nothing missing ✓ · one question + bridges ✓ ·
// real-life hook paid off at the end ✓ · things students know (water, sodium, magnesium) ✓ · experiment explains itself
// (named, tongs drop it, result labelled) ✓ · one place at a time ✓ · camera moves ≥ 2 s ✓ · numbers = bars with 100s
// grid ✓ · ≤ 3 labels a shot (end list one label at a time) ✓ · baked bench ✓ · dark atoms ✓ · every screen ✓ (very
// wide: the end bench sits near the right edge) · flicker 0 ✓.
import * as THREE from 'three';
import * as K from './kit.js';
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

// ---------------------------------------------------------------- places
const NX = -0.85, GX = 0.85, BR = 0.23, Y0 = 0.055, SURF = Y0 + 0.32;    // the bench: sodium beaker · magnesium beaker
const AX = 60, AY = 1.9;                                                 // the atom spot (sodium, then group IA one by one)
const KV = 0.0016, KIA = 0.0034, KQ = 0.0028, BASE = 0.5;   // bar height per kJ/mol (IA chart and row-by-row chart taller) · bars stand on y = BASE                                           // bar height per kJ/mol · bars stand on y = BASE
const IAX = (i) => 62.5 + i * 0.6;                                       // group IA bars (Li Na K Rb Cs)
const NAX = 80, MGX = 83.4, CMX = (i) => 85.6 + i * 0.6;                 // sodium | magnesium, their bars
const PX = (i) => 100 + (i - 2) * 1.05;                                  // Table 8.3 pairs (Be … Ba)
const QX = (i) => 120 + (i - 2) * 1.05;                                  // row by row: IA | IIA
const RAD = (r) => 0.72 * r;                                             // book radius (Å) → outer ring radius
const IA = [['Li', 'lithium', [2, 1], 3, 4, 1.55, 520], ['Na', 'sodium', [2, 8, 1], 11, 12, 1.86, 496], ['K', 'potassium', [2, 8, 8, 1], 19, 20, 2.27, 419],
  ['Rb', 'rubidium', [2, 8, 18, 8, 1], 37, 48, 2.48, 403], ['Cs', 'caesium', [2, 8, 18, 18, 8, 1], 55, 78, 2.65, 376]];
const IIA = [['Be', 1.12, 899, 1757.1], ['Mg', 1.60, 738, 1450.7], ['Ca', 1.97, 590, 1145], ['Sr', 2.15, 549, 1064.2], ['Ba', 2.24, 503, 965.1]];
const GOLD = 0xf0b030, ORANGE = 0xe0783a, RED = 0xc4483a;

// ---------------------------------------------------------------- time (every camera move ≥ 2 s)
const T = {
  hook: 0, naIn: 0.6, naD: 3.2, mg: 8.6, mgIn: 9.0, mgD: 11.4, ask: 15.0, card: 18.0, push: 23.6,
  atom: 26.6, gold: 28.0, hold: 28.6, pull: 31.0, def: 35.5, unit: 38.5, ia: 41.0, iaW: 59.0,
  cmp: 63.5, plus: 68.0, small: 70.0, mg1: 72.0, mg2: 77.0, still: 83.0, iia: 86.0, both: 100.5, end: 109.0, prop: 115.0, down: 121.0, fin: 127.0,
};
T.done = T.fin + 6.0; DOCK = T.card + 5.0;
const NA_L = T.naD + 0.3, MG_L = T.mgD + 0.3;                            // sodium lands on the water · magnesium hits the water
const ELEM = { Li: [T.ia + 0.6, T.ia + 2.2, 2.0, T.ia + 5.6], K: [T.ia + 6.0, T.ia + 7.2, 1.6, T.ia + 10.0], Rb: [T.ia + 10.4, T.ia + 11.4, 1.4, T.ia + 13.8], Cs: [T.ia + 14.2, T.ia + 15.2, 1.4, T.iaW + 0.2] };   // [in, pull, pull length, out]
const PAIR = (i) => (i ? T.iia + 5.0 + (i - 1) * 1.6 : T.iia + 0.6);    // a Table 8.3 pair starts to rise
const ROWB = (i) => T.both + 0.4 + i * 0.8;                             // a row-by-row pair starts to rise
const INTRO = [T.card, DOCK];
const TICKS = [[T.def + 0.5, 0], [T.iaW + 2.0, 1], [T.mg1 + 3.6, 2], [T.mg2 + 4.6, 3], [T.end + 3.0, 4]];

const captions = [
  [0.3, T.naD + 0.3, 'Sodium goes into water…'],
  [T.naD + 0.3, T.mg, 'It melts into a ball and races, fizzing'],
  [T.mg, MG_L, 'Now magnesium, also a metal'],
  [MG_L, T.ask, 'It sinks and hardly reacts'],
  [T.ask, T.card, 'Both are metals. Why such a difference?'],
  [T.card, T.push, 'Why does sodium react faster?'],
  [T.push, T.atom, 'To react, a metal gives away electrons'],
  [T.atom, T.hold, 'One sodium atom on its own, as in a gas'],
  [T.hold, T.pull, 'Its nucleus holds the 1 outer electron'],
  [T.pull, T.def, 'Pulling it off costs energy: 496'],
  [T.def, T.unit, 'That energy is the ionization energy ✓'],
  [T.unit, T.ia, 'Measured in kilojoules per mole (kJ/mol)'],
  [T.ia, ELEM.Li[1] + 1.0, 'Group IA, top to bottom: lithium first'],
  [ELEM.Li[1] + 1.0, ELEM.K[0], 'Smallest, 2 shells, held tightest: 520'],
  [ELEM.K[0], ELEM.Rb[0], 'Potassium: one more shell, easier: 419'],
  [ELEM.Rb[0], ELEM.Cs[0], 'Rubidium: bigger still: 403'],
  [ELEM.Cs[0], T.iaW, 'Caesium: the biggest, the easiest: 376'],
  [T.iaW, T.cmp, 'Bigger atom, farther electron: the cost falls ✓'],
  [T.cmp, T.cmp + 2.6, 'Group IIA: magnesium has 2 outer electrons'],
  [T.cmp + 2.6, T.plus, 'Both in the same s sub-shell'],
  [T.plus, T.small, 'One more + in the nucleus: it pulls harder'],
  [T.small, T.mg1, 'So magnesium is the smaller atom'],
  [T.mg1, T.mg2, 'Its first electron costs 737.7 (sodium: 496) ✓'],
  [T.mg2, T.mg2 + 4.0, 'Now Mg⁺ pulls harder: more + than −'],
  [T.mg2 + 4.0, T.still, 'The second costs even more: 1450.7 ✓'],
  [T.still, T.iia, 'Even so, they still form M²⁺ ions'],
  [T.iia, PAIR(1) - 0.4, 'Group IIA, top to bottom: beryllium first'],
  [PAIR(1) - 0.4, PAIR(3), 'Beryllium: smallest atom, highest costs'],
  [PAIR(3), T.both, 'One more shell each time: both costs fall'],
  [T.both, T.both + 5.0, 'Row by row: group IA always costs less'],
  [T.both + 5.0, T.end, 'IA: most electropositive. IIA: second most'],
  [T.end, T.end + 2.6, 'Sodium: 496. Magnesium: 737.7, then 1450.7'],
  [T.end + 2.6, T.prop, 'Lower ionization energy: reacts faster ✓'],
  [T.prop, T.prop + 3.4, 'From IA to IIA: heavier and harder'],
  [T.prop + 3.4, T.down, 'and higher melting and boiling points'],
  [T.down, T.fin, 'but less electropositive, conductive and reducing'],
  [T.fin, T.done, 'Sodium reacts faster: its electron costs less'],
];

// ---------------------------------------------------------------- camera
const BENCH = (t, k = 1, e) => S(t, [0, 0.45, 0.02], 2.65 * k, 1.1 * k, ADIR, e);
const BK = (t, x, k = 1, e) => S(t, [x, 0.5, 0], 1.0 * k, 1.12 * k, ADIR, e);
const ATOM = (t, x, R, k = 1, e) => { const h = (1.5 * R + 1.5) * k; return S(t, [x, AY, 0], h * 1.2, h, DDIR, e); };
const IASHOT = (t, k = 1, e) => S(t, [(AX - 1.9 + IAX(4) + 0.4) / 2, 1.95, 0], (IAX(4) + 0.4 - AX + 1.9) * k, 3.7 * k, DDIR, e);
const CMPS = (t, k = 1) => S(t, [(NAX - 1.5 + CMX(2) + 0.4) / 2, 1.85, 0], (CMX(2) + 0.4 - NAX + 1.5) * k, 3.7 * k, DDIR);
const PAIRS = (t, x, k = 1) => S(t, [x, 1.95, 0], 5.6 * k, 3.9 * k, DDIR);
const NAP = (t) => {                                                    // where the sodium ball swims (the end replays it)
  const u = Math.max(0, (t < T.end ? t : t - T.end + 2.5) - NA_L), ramp = ease(span(u, 0.3, 1.0));
  return V(NX + 0.12 * Math.sin(2.2 * u) * ramp, SURF + 0.006 + 0.003 * Math.sin(t * 6), 0.1 * Math.sin(3.3 * u + 0.5) * ramp);
};
const cams = [
  // HOOK (baked bench): wide, sodium close, magnesium close, wide; push into the racing sodium
  BENCH(0, 1.06), BK(T.naIn + 1.2, NX, 1.05), BK(T.mg, NX, 0.98), BK(T.mg + 2.0, GX, 1.02), BK(T.ask, GX, 0.97), BENCH(T.ask + 2.0, 1.0), BENCH(T.push, 0.96),
  BK(T.push + 1.0, NX, 0.95), S(T.atom - 0.05, NAP(T.atom).toArray(), 0.06, 0.05, ADIR, 'in'),
  // COST (dark): the sodium atom, wider to show its bar
  ATOM(T.atom, AX, RAD(1.86), 0.25), ATOM(T.atom + 2.0, AX, RAD(1.86), 1.05, 'out'), ATOM(T.pull - 0.1, AX, RAD(1.86), 1.0),
  IASHOT(T.pull + 1.9, 1.02), IASHOT(T.ia - 0.05, 1.0),
  // IA: the whole row of bars beside the atom spot; then push to the bars
  IASHOT(T.iaW - 0.05, 0.97), S(T.iaW + 2.0, [IAX(2), 1.75, 0], 3.8, 3.0, DDIR), S(T.cmp - 0.05, [IAX(2), 1.75, 0], 3.65, 2.9, DDIR),
  // IIA: sodium | magnesium and their bars; Table 8.3 pairs; row by row
  CMPS(T.cmp, 1.03), CMPS(T.still - 0.05, 0.97), CMPS(T.still + 1.4, 0.95), CMPS(T.iia - 0.05, 0.94),
  PAIRS(T.iia, PX(2), 1.04), PAIRS(T.both - 0.05, PX(2), 0.98), PAIRS(T.both, QX(2), 1.04), PAIRS(T.end - 0.05, QX(2), 0.98),
  // ANSWER (baked bench): both beakers; magnesium side for the IA → IIA list; wide end
  BENCH(T.end, 1.05), BENCH(T.prop - 0.05, 0.99), BENCH(T.fin - 0.05, 0.93),
  BENCH(T.fin + 2.2, 1.04), BENCH(T.done, 1.0),
];

export default {
  capNear: true, oneText: true,
  duration: T.done,
  fog: [14, 34],                                                        // wide chart shots stay clear
  captions,
  cams,

  build({ scene, cam, R }) {
    const beats = [];
    const ST = K.studio({ scene, R }, '806', { dark: (t) => t >= T.atom - 0.01 && t < T.end - 0.05 });   // FIRST: models read the look
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
    const seatW = (A, s, x, t) => A.rings[s].localToWorld(V(Math.cos(x.a0 + t * x.w) * x.R, 0, Math.sin(x.a0 + t * x.w) * x.R));
    const atomAt = (x, shells, p, n, R, y = AY) => {
      const r0 = 0.45, A = K.atom(shells, p, n, r0, shells.length > 1 ? (R - r0) / (shells.length - 1) : 0); A.group.position.set(x, y, 0); scene.add(A.group);
      A.electrons.forEach((e) => { if (e.shell < shells.length - 1 && shells.length > 3) { e.e.scale.setScalar(0.7); e.e.children[0].scale.setScalar(0.6); } });
      return A;
    };
    // the hold: a soft pink line from the nucleus to the outer electron (bright = held tightly, faint = held loosely)
    const holdM = new THREE.MeshBasicMaterial({ color: 0xff8f86, transparent: true, depthWrite: false, toneMapped: false });
    const hold = () => { const m = add(new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 1, 8, 1, true).translate(0, 0.5, 0), holdM.clone())); m.renderOrder = 5; return m; };
    const setHold = (m, a, b, op) => {
      m.visible = op > 0.01; if (!m.visible) return;
      const d = b.clone().sub(a); m.position.copy(a); m.scale.set(1, d.length(), 1); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); m.material.opacity = op;
    };
    /** pull off electron x of atom A (shell s): it moves out slowly from t0 (the bar rises), lets go at t0 + dur and flies */
    const pullOff = (A, s, x, t0, dur, dir, grip, tGold, tHold) => {
      const at = (t) => seatW(A, s, x, Math.min(t, t0)).addScaledVector(dir, 0.45 * ease(span(t, t0, t0 + dur)) + 3.4 * easeIn(span(t, t0 + dur, t0 + dur + 1.3)));
      flyer(at, (t) => t > t0 && t < t0 + dur + 1.3);
      const h = hold();
      beats.push((t) => {
        if (t > tGold) goldify(x); x.e.visible = t <= t0 && A.group.visible;
        x.e.scale.setScalar(1 + 0.5 * Math.sin(Math.PI * span(t, tGold, tGold + 0.9)));
        const on = A.group.visible && t > tHold && t < t0 + dur, end = t <= t0 ? x.e.getWorldPosition(V()) : at(t);
        setHold(h, A.group.getWorldPosition(V()), end, on ? grip * ease(span(t, tHold, tHold + 0.6)) * (1 - 0.6 * span(t, t0, t0 + dur)) : 0);
      });
    };
    /** a gold bar (energy) at x that rises to value v between t0 and t1; label with its number on top, name below */
    const bar = (x, v, color, t0, t1, on, name, nameH = 0.24, w = 0.34, kv = KV) => {
      const b = add(K.solid(new THREE.BoxGeometry(w, 1, 0.14).translate(0, 0.5, 0), M.gloss(color), { outline: false }), x, BASE, 0);
      const val = lbl(String(v), 0.2, '#ffe2a0', x, 0, 0.1), nm = name ? lbl(name, nameH, '#ffffff', x, BASE - 0.17, 0.1) : null;
      beats.push((t) => {
        const o = on(t), h = v * kv * ease(span(t, t0, t1)); b.visible = o && t > t0; b.scale.y = Math.max(1e-4, h);
        val.position.y = BASE + h + 0.13; val.visible = o && t > t1; if (val.visible) K.popIn(val, t, t1, 1e9);
        if (nm) { nm.visible = o && t > t0 - 0.4; if (nm.visible) K.popIn(nm, t, t0 - 0.4, 1e9); }
      });
      return b;
    };
    /** faint grid lines every 100 kJ/mol behind a chart (countable), 500 / 1000 / 1500 named on the left */
    const grid = (x0, x1, top, on, kv = KV) => {
      const lm = new THREE.MeshBasicMaterial({ color: 0x6d7a92, transparent: true, opacity: 0.35, toneMapped: false }), parts = [];
      for (let v = 100; v <= top; v += 100) {
        const m = add(new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, v % 500 ? 0.006 : 0.012, 0.004), lm), (x0 + x1) / 2, BASE + v * kv, -0.12); parts.push(m);
        if (v % 500 === 0) parts.push(lbl(String(v), 0.16, '#93a3bd', x0 - 0.22, BASE + v * kv, -0.1));
      }
      const floor = add(new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 0.02, 0.3), new THREE.MeshBasicMaterial({ color: 0x8794ab, toneMapped: false })), (x0 + x1) / 2, BASE - 0.01, 0); parts.push(floor);
      const unit = lbl('kJ/mol', 0.16, '#93a3bd', x0 - 0.22, BASE + top * kv + 0.2, -0.1); parts.push(unit);
      beats.push((t) => { const o = on(t); parts.forEach((p) => { p.visible = o; }); });
    };

    // ================================================================ BENCH · sodium races, magnesium sinks (baked)
    const inBench = (t) => t < T.atom || t >= T.end - 0.05;
    {
      const gB = stage(inBench); ST.bake(gB, 'bench', 0, 3.1, 1.2);
      const waters = [NX, GX].map((x) => { into(gB, K.beaker(BR, 0.48), x, 0, 0); return into(gB, K.liquid(BR - 0.01, 0.32, 0x5aa0d8, 0.38), x, Y0, 0); });
      // sodium: held by tongs, dropped, melts into a silver ball that races and fizzes on the surface (replays at the end)
      const na = into(gB, K.lump(0.05, M.metal(0xdfe2e6, 0.22), 2, 0.72)), naFz = into(gB, K.bubbles(24, V(), SURF + 0.05, 0.1, 0.012)), naSp = into(gB, K.splash(0xffffff, 0.26), NX, SURF, 0);
      const naHiss = Array.from({ length: 3 }, () => { const r = into(gB, new THREE.Mesh(new THREE.TorusGeometry(1, 0.03, 6, 40), M.bubble())); r.rotation.x = Math.PI / 2; return r; });
      const tgN = into(gB, K.tongs(0.6)), HN = V(NX, 0.78, 0);
      // magnesium: dropped, sinks to the bottom, a few slow tiny bubbles
      const mg = into(gB, K.lump(0.05, M.metal(0xb4b8bf, 0.42), 7, 0.6)), mgFz = into(gB, K.bubbles(10, V(), SURF, 0.06, 0.007)), mgSp = into(gB, K.splash(0xffffff, 0.26), GX, SURF, 0);
      const tgM = into(gB, K.tongs(0.6)), HM = V(GX, 0.78, 0);
      const lNa = lbl('sodium', 0.085, '#ffffff', NX - 0.24, 0.74, 0), lMg = lbl('magnesium', 0.085, '#ffffff', GX + 0.3, 0.74, 0), lW = lbl('water', 0.08, '#bfe0ff', NX + 0.38, 0.3, 0.25);
      const lFast = lbl('reacts fast', 0.09, '#ffe08a', NX, 0.66, 0.1), lSlow = lbl('hardly reacts', 0.09, '#ffe08a', GX, 0.66, 0.1);
      const tongsAt = (tg, H, tIn, tD, t) => {                              // tongs come down from above, hold, let go, go up
        const p = H.clone().setY(H.y + 1.6 * (1 - ease(span(t, tIn, tIn + 1.2))) + 1.6 * easeIn(span(t, tD + 0.3, tD + 1.4)));
        tg.position.copy(p); tg.visible = t > tIn && t < tD + 1.4; tg.userData.set(0.035 + 0.04 * ease(span(t, tD - 0.15, tD + 0.05))); return p;
      };
      beats.push((t) => {
        const pN = tongsAt(tgN, HN, T.naIn, T.naD, t), pM = tongsAt(tgM, HM, T.mgIn, T.mgD, t);
        // sodium
        const re = t >= T.end - 0.05, fall = K.drop(t, T.naD, HN.y - 0.04, SURF + 0.01, 0.3, 0.02);
        const nPos = re || t > NA_L ? NAP(t) : (t < T.naD ? pN.clone().add(V(0, -0.04, 0)) : V(NX, fall.y, 0));
        na.position.copy(nPos); na.visible = t > T.naIn;
        const ball = re ? 1 : ease(span(t, NA_L + 0.2, NA_L + 0.9)), shrink = re ? 0.75 : 1 - 0.25 * span(t, NA_L, T.atom);
        na.scale.set(shrink * (1 - 0.15 * ball), shrink * (1 + 0.4 * ball), shrink * (1 - 0.15 * ball)); na.rotation.y = t * 2;
        naSp.userData.update(t - NA_L);
        const fizz = re || t > NA_L + 0.2 ? 1 : 0; naFz.visible = fizz > 0; naFz.userData.update(t, fizz, nPos.clone().add(V(0, -0.03, 0)));
        naHiss.forEach((r, k) => { const per = 0.5, age = ((t * 1.0 + k * per / 3) % per), born = t - age; r.visible = (re || born > NA_L); if (!r.visible) return; r.position.copy(NAP(born)).setY(SURF + 0.003 + k * 0.004); const s = 0.03 + age * 0.12; r.scale.set(s, s, s * 0.3); r.material.opacity = 0.5 * (1 - age / per); });
        // magnesium
        const mf = K.drop(t, T.mgD, HM.y - 0.04, SURF, 0.3, 0), sink = ease(span(t, MG_L, MG_L + 1.6));
        const mPos = t < T.mgD ? pM.clone().add(V(0, -0.04, 0)) : t < MG_L ? V(GX, mf.y, 0) : V(GX + 0.03 * sink, lerp(SURF, Y0 + 0.035, sink), 0.02 * sink);
        mg.position.copy(mPos); mg.visible = t > T.mgIn; mg.rotation.set(0.4 * sink, 0.6, 0.2 * sink);
        mgSp.userData.update(t - MG_L);
        mgFz.visible = t > MG_L + 1.8 || re; mgFz.userData.update(t * 0.4, 0.5, mPos.clone().add(V(0, 0.02, 0)));
        // labels
        K.popIn(lNa, t, T.naIn + 1.2, T.naD - 0.2); K.popIn(lW, t, T.naIn + 1.8, T.naD - 0.2);
        K.popIn(lFast, t, NA_L + 1.8, T.mg + 0.6); K.popIn(lMg, t, T.mgIn + 1.2, T.mgD - 0.2); K.popIn(lSlow, t, MG_L + 1.8, T.push);
      });
      // ANSWER labels on the bench (one at a time where the eye is)
      const lE1 = lbl('496: easy to lose', 0.11, '#ffe08a', NX, 0.74, 0.1), lE2 = lbl('737.7 + 1450.7: hard', 0.11, '#ffb88a', GX, 0.74, 0.1);
      const lFl = lbl('floats: lighter, softer', 0.1, '#ffffff', NX, 0.74, 0.1), lSk = lbl('sinks: denser, harder', 0.1, '#ffffff', GX, 0.74, 0.1);
      const lMp = lbl('melts and boils higher', 0.1, '#ffffff', GX, 0.74, 0.1);
      const DOWN = ['less electropositive ↓', 'conducts less ↓', 'weaker reducing agent ↓', 'smaller atoms ↓'].map((s) => lbl(s, 0.1, '#a8c4ff', GX, 0.74, 0.1));
      const lIIA = lbl('magnesium (IIA)', 0.1, '#ffb88a', GX, 0.88, 0.1), lIA = lbl('sodium (IA)', 0.1, '#ffe08a', NX, 0.88, 0.1);
      beats.push((t) => {
        K.popIn(lE1, t, T.end + 0.6, T.prop - 0.2); K.popIn(lE2, t, T.end + 1.6, T.prop - 0.2);
        K.popIn(lIA, t, T.prop + 0.3, T.fin - 0.2); K.popIn(lIIA, t, T.prop + 0.5, T.fin - 0.2);
        K.popIn(lFl, t, T.prop + 0.8, T.prop + 3.2); K.popIn(lSk, t, T.prop + 1.6, T.prop + 3.2); K.popIn(lMp, t, T.prop + 3.6, T.down - 0.2);
        DOWN.forEach((l, k) => K.popIn(l, t, T.down + 0.2 + k * 1.45, k < 3 ? T.down + 1.35 + k * 1.45 : T.fin - 0.2));
      });
    }

    // ================================================================ COST · one sodium atom, its outer electron pulled off
    {
      const [, , sh, p, n, r, v] = IA[1], R = RAD(r), A = atomAt(AX, sh, p, n, R), on = (t) => t > T.atom - 0.1 && t < T.ia + 0.3;
      const x = A.electrons.find((e) => e.shell === 2);
      pullOff(A, 2, x, T.pull, 3.0, V(1, 0.35, 0.25).normalize(), 0.95, T.gold, T.hold);
      beats.push((t) => { A.group.visible = on(t); A.group.scale.setScalar(Math.max(1e-4, 1 - ease(span(t, T.ia, T.ia + 0.3)))); A.update(t); A.rings[2].children[0].material.opacity = 0.55 * (1 - span(t, T.pull + 3, T.pull + 3.8)); });
      const up = AY + 0.75 * R + 0.45, low = AY - 0.9 * R - 0.45;
      const nm = lbl('sodium atom (Na)', 0.26, '#ffffff', AX, up), ion = lbl('Na⁺', 0.36, '#ffffff', AX, up), rd = lbl('radius 1.86 Å', 0.2, '#93a3bd', AX, low + 0.12);
      const l1 = lbl('1 outer electron', 0.22, '#ffd27a', AX, low), eq = lbl('Na → Na⁺ + 1e⁻    ΔE = 496 kJ/mol', 0.22, '#ffd27a', AX + 0.6, low);
      const held = lbl('held by the nucleus', 0.2, '#ff9f96', AX + 0.9, AY + 0.95);
      bar(IAX(1), v, GOLD, T.pull, T.pull + 3.0, (t) => t > T.pull - 0.1 && t < T.cmp, 'Na', 0.24, 0.34, KIA);
      grid(IAX(0) - 0.35, IAX(4) + 0.35, 600, (t) => t > T.pull - 0.4 && t < T.cmp, KIA);
      const ie = lbl('ionization energy', 0.26, '#ffe08a', IAX(2), BASE + 600 * KIA + 0.45, 0.1);
      beats.push((t) => {
        K.popIn(nm, t, T.atom + 1.2, T.pull + 3.2); K.popIn(ion, t, T.pull + 3.6, T.ia); K.popIn(rd, t, T.atom + 1.8, T.gold + 0.2);
        K.popIn(l1, t, T.gold + 0.4, T.pull + 3.4); K.popIn(held, t, T.hold + 0.6, T.pull + 1.0); K.popIn(eq, t, T.def + 1.2, T.ia);
        K.popIn(ie, t, T.def + 0.2, T.ia + 1.2);
      });
    }
    // ================================================================ IA · Li, K, Rb, Cs in the same spot, their bars beside
    IA.forEach(([s, name, sh, p, n, r, v], i) => {
      if (s === 'Na') return;
      const [tIn, tPull, dur, tOut] = ELEM[s], R = RAD(r), A = atomAt(AX, sh, p, n, R), o = sh.length - 1;
      const x = A.electrons.find((e) => e.shell === o), grip = [1, 0, 0.6, 0.48, 0.38][i];
      pullOff(A, o, x, tPull, dur, V(1, 0.35, 0.25).normalize(), grip, tIn + 0.5, tIn + 0.7);
      beats.push((t) => {
        const k = back(span(t, tIn, tIn + 0.5)) * (1 - ease(span(t, tOut, tOut + 0.35)));
        A.group.visible = k > 0.001; A.group.scale.setScalar(Math.max(1e-4, k)); A.update(t);
        A.rings[o].children[0].material.opacity = 0.55 * (1 - span(t, tPull + dur, tPull + dur + 0.6));
      });
      const nm = lbl(name, 0.3, '#ffffff', AX, AY + 0.75 * R + 0.45), rd = lbl(`radius ${r.toFixed(2)} Å`, 0.24, '#b4c0d4', AX, AY - 0.9 * R - 0.35);
      beats.push((t) => { K.popIn(nm, t, tIn + 0.3, tOut - 0.1); K.popIn(rd, t, tIn + 0.6, tOut - 0.1); });
      bar(IAX(i), v, GOLD, tPull, tPull + dur, (t) => t > tPull - 0.1 && t < T.cmp, s, 0.24, 0.34, KIA);
      if (s === 'Li') { const sm = lbl('smallest: held tightest', 0.24, '#ff9f96', AX, AY - 0.9 * R - 0.7); beats.push((t) => K.popIn(sm, t, tIn + 1.2, tOut - 0.1)); }
    });
    {
      const fall = lbl('bigger atom → easier to pull off', 0.22, '#ffe08a', IAX(2), BASE + 600 * KIA + 0.45, 0.1);
      beats.push((t) => K.popIn(fall, t, T.iaW + 1.6, T.cmp - 0.2));
    }

    // ================================================================ IIA · sodium | magnesium, then Mg's two electrons
    {
      const on = (t) => t > T.cmp - 0.1 && t < T.iia;
      const Na = atomAt(NAX, [2, 8, 1], 11, 12, RAD(1.86)), Mg = atomAt(MGX, [2, 8, 2], 12, 12, RAD(1.60));
      const pop = (t, t0) => back(span(t, t0, t0 + 0.5));
      beats.push((t) => {
        Na.group.visible = Mg.group.visible = on(t); Na.group.scale.setScalar(Math.max(1e-4, pop(t, T.cmp - 0.1))); Mg.group.scale.setScalar(Math.max(1e-4, pop(t, T.cmp + 0.4)));
        Na.update(t); Mg.update(t);
      });
      const [m1, m2] = Mg.electrons.filter((e) => e.shell === 2), nOut = Na.electrons.find((e) => e.shell === 2);
      beats.push((t) => { if (t > T.cmp + 1.2) { goldify(nOut); goldify(m1); goldify(m2); } });
      pullOff(Mg, 2, m1, T.mg1 + 0.4, 2.6, V(1, 0.45, 0.2).normalize(), 0.95, T.cmp + 1.2, T.plus + 1.0);
      pullOff(Mg, 2, m2, T.mg2 + 1.0, 3.0, V(0.8, 0.7, 0.3).normalize(), 1.0, T.cmp + 1.2, T.mg1 + 3.2);
      beats.push((t) => { Mg.rings[2].children[0].material.opacity = 0.55 * (1 - span(t, T.mg2 + 4.0, T.mg2 + 4.8)); });
      const RN = RAD(1.86), RM = RAD(1.60), up = AY + 0.75 * RN + 0.45, low = AY - 0.9 * RN - 0.4;
      const L = (s, h, c, x, y) => lbl(s, h, c, x, y);
      const nNa = L('sodium · 3s¹', 0.3, '#ffffff', NAX, up), nMg = L('magnesium · 3s²', 0.3, '#ffffff', MGX, up);
      const zNa = L('11+', 0.32, '#ff9f96', NAX, AY + 0.62), zMg = L('12+', 0.32, '#ff9f96', MGX, AY + 0.62);
      const rNa = L('radius 1.86 Å', 0.26, '#b4c0d4', NAX, low), rMg = L('radius 1.60 Å: smaller', 0.26, '#b4c0d4', MGX, low);
      const iMg1 = L('Mg⁺', 0.4, '#ffffff', MGX, up), iMg2 = L('Mg²⁺', 0.4, '#ffffff', MGX, up);
      const e1 = L('Mg → Mg⁺ + 1e⁻    ΔE = 737.7 kJ/mol', 0.26, '#ffd27a', MGX + 0.6, low - 0.4), e2 = L('Mg⁺ → Mg²⁺ + 1e⁻    ΔE = 1450.7 kJ/mol', 0.26, '#ffd27a', MGX + 0.6, low - 0.4);
      const pls = L('more + than −: pulls harder', 0.26, '#ff9f96', MGX, AY - 0.9 * RM - 0.1);
      beats.push((t) => {
        K.popIn(nNa, t, T.cmp + 0.6, T.iia - 0.2); K.popIn(nMg, t, T.cmp + 1.4, T.mg1 + 3.0);
        K.popIn(zNa, t, T.plus + 0.2, T.mg1 - 0.2); K.popIn(zMg, t, T.plus + 0.7, T.mg1 - 0.2);
        K.popIn(rNa, t, T.small + 0.2, T.mg1 + 0.2); K.popIn(rMg, t, T.small + 0.8, T.mg1 + 0.2);
        K.popIn(iMg1, t, T.mg1 + 3.4, T.mg2 + 4.0); K.popIn(iMg2, t, T.mg2 + 4.4, T.iia - 0.2);
        K.popIn(e1, t, T.mg1 + 3.2, T.mg2 + 3.6); K.popIn(e2, t, T.mg2 + 4.2, T.iia - 0.2); K.popIn(pls, t, T.mg2 + 0.2, T.mg2 + 3.8);
      });
      const bon = (t) => on(t) && t > T.mg1 - 1.0;
      grid(CMX(0) - 0.35, CMX(2) + 0.35, 1500, bon);
      bar(CMX(0), 496, GOLD, T.mg1 - 0.6, T.mg1 + 0.2, bon, 'Na');
      bar(CMX(1), 737.7, ORANGE, T.mg1 + 0.4, T.mg1 + 3.0, bon, 'Mg');
      bar(CMX(2), 1450.7, RED, T.mg2 + 1.0, T.mg2 + 4.0, bon, 'Mg⁺');
    }
    // ================================================================ Table 8.3 · pairs of bars (1st, 2nd) Be … Ba
    {
      const on = (t) => t > T.iia - 0.1 && t < T.both;
      grid(PX(0) - 0.5, PX(4) + 0.5, 1700, on);
      IIA.forEach(([s, r, v1, v2], i) => {
        const t0 = PAIR(i), d = i ? 0.7 : 1.2;
        bar(PX(i) - 0.17, v1, ORANGE, t0, t0 + d, on, null, 0, 0.3); bar(PX(i) + 0.17, v2, RED, t0 + d, t0 + 2 * d, on, null, 0, 0.3);
        const nm = lbl(s, 0.26, '#ffffff', PX(i), BASE - 0.2, 0.1), rd = lbl(`${r.toFixed(2)} Å`, 0.19, '#b4c0d4', PX(i), BASE - 0.44, 0.1);
        beats.push((t) => { K.popIn(nm, t, t0 - 0.4, T.both); K.popIn(rd, t, t0 - 0.2, T.both); });
      });
      const k1 = lbl('1st', 0.2, '#ffb88a', PX(0) - 0.17, BASE + 899 * KV + 0.36, 0.1), k2 = lbl('2nd', 0.2, '#ff9f96', PX(0) + 0.17, BASE + 1757.1 * KV + 0.32, 0.1);
      const be = lbl('beryllium: smallest atom, highest costs', 0.24, '#ffe08a', PX(2) + 0.3, BASE + 1757.1 * KV + 0.1, 0.1);
      const dn = lbl('one more shell each row → costs fall', 0.24, '#ffe08a', PX(3), BASE + 1500 * KV + 0.25, 0.1);
      beats.push((t) => { K.popIn(k1, t, PAIR(0) + 1.3, T.both); K.popIn(k2, t, PAIR(0) + 2.5, T.both); K.popIn(be, t, PAIR(1) - 1.2, PAIR(3) - 0.2); K.popIn(dn, t, PAIR(4) + 1.6, T.both); });
    }
    // ================================================================ row by row · IA beside IIA (same period)
    {
      const on = (t) => t > T.both - 0.1 && t < T.end;
      grid(QX(0) - 0.5, QX(4) + 0.5, 900, on, KQ);
      IA.forEach(([s, , , , , , v], i) => {
        const [s2, , v2] = IIA[i], t0 = ROWB(i);
        bar(QX(i) - 0.17, v, GOLD, t0, t0 + 0.5, on, null, 0, 0.3, KQ); bar(QX(i) + 0.17, v2, ORANGE, t0 + 0.4, t0 + 0.9, on, null, 0, 0.3, KQ);
        const a = lbl(s, 0.24, '#ffe08a', QX(i) - 0.19, BASE - 0.2, 0.1), b = lbl(s2, 0.24, '#ffb88a', QX(i) + 0.19, BASE - 0.2, 0.1);
        beats.push((t) => { K.popIn(a, t, t0 - 0.3, T.end); K.popIn(b, t, t0 + 0.1, T.end); });
      });
      const gA = lbl('group IA: lower = loses electrons more easily', 0.24, '#ffe08a', QX(2), BASE + 900 * KQ + 0.45, 0.1);
      const gB = lbl('IA most electropositive · IIA second most', 0.24, '#ffffff', QX(2), BASE + 900 * KQ + 0.45, 0.1);
      beats.push((t) => { K.popIn(gA, t, ROWB(4) + 1.2, T.both + 5.0); K.popIn(gB, t, T.both + 5.4, T.end); });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Why does sodium react faster?', intro: INTRO, ticks: TICKS,
      rows: [[0, '1 · Pulling off an electron'], [1, 'the cost: ionization energy'], [1, 'bigger atom: costs less'], [0, '2 · Group IIA: 2 outer electrons'],
        [1, 'more + charge: costs more'], [1, 'the 2nd costs even more'], [0, '3 · The answer'], [1, 'lower cost: reacts faster']],
      short: ['ionization energy', 'bigger: costs less', 'IIA costs more', '2nd costs more', 'lower cost: faster'] }));

    return (t, dt) => { for (const b of beats) b(t, dt); };
  },
};
