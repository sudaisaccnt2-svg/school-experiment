// LOCKED 2026-10-15: user "the whole video is much better, I can fully understand it, every part is linked". The
// reference lesson for every other one (backups/l817_v4_approved.js). Change only what the user asks.
// Lesson 817 · Halogens React (book pp. 242–245: (b) Chemical Reactivity of Halogens i–vi, Test Yourself, Activity 8.2),
// v4 (2026-10-15). v3 (backups/l817_v3.js): "somewhat makes sense but very hard to understand, lots of random events,
// each event missing something or wrong, pacing wrong". Frame by frame v3 had: bright table ↔ dark ball stage 10 times
// (6 dark interludes of balls from nowhere), gas jars that read as juice, hydrogen never seen, a 0.5 s bang, verdicts
// without verbs, one 30 s still wide shot then 6 s rushed ones. v4 keeps the book's question, its order and the same
// experiments; every experiment now runs question → named before (held) → visible cause → result ✓ ON the thing; the
// only dark scenes are dives INTO the thing just made (≤ 1 trip per act); gas = drifting wisps (kit.gasCloud).
// THE QUESTION (book p.242): "They react with hydrogen, oxygen, metals, non-metals and other compounds."
//   → card "What do halogens react with?": hydrogen · oxygen · metals · non-metals · compounds · each other.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//   HOOK   a red cloth in bleach loses its colour · bleach is made with chlorine, a halogen · they react with almost
//          everything → the card (the plan).
//   HYD    four pairs of jars: clear hydrogen on top, a halogen below, a glass plate between. Each close-up: names held ·
//          tongs pull the plate (the cause) · fluorine: BANG at once (flash, jars jump, smoke) · chlorine: nothing… a beam
//          of sunlight → bang · bromine: nothing… the hot plate → the colour fades · iodine: hot plate → purple fades and
//          comes back (both ways). Fluorine's formula is built from its names. Wide: the four results + an arrow: less and
//          less reactive · liquid gathers in the fluorine jar → dive in: HF molecules hold on to each other. (tick 1)
//   OXY    still inside (dark): oxygen + fluorine atoms build OF₂, then O₂F₂ · the others: Cl₂O₇, Br₃O₄, I₂O₅, one at
//          a time in the same place (count the balls). (tick 2)
//   METAL  tongs lay copper in liquid bromine: it turns black (copper bromide) · potassium + iodine on a spoon into the
//          flame: purple vapour, white potassium iodide is left → dive into the white powder: potassium gives iodine
//          one electron → K⁺ I⁻ pull together: an ionic halide. (tick 3)
//   NONM   phosphorus on a spoon into a jar of chlorine: it catches fire by itself, white fumes → dive into the fumes:
//          phosphorus takes 3 chlorines (PCl₃, tri), then 5 (PCl₅, penta); bromine does the same. (tick 4)
//   COMP   chlorine water dropped into hydrogen sulphide water: yellow sulphur · its formula built from the names: chlorine
//          takes the hydrogen (oxidizes) · a tap lets chlorine gas into lime water: bubbles, white bleaching powder = the
//          bleach of the start. (tick 5)
//   DISP   chlorine water into sodium bromide: orange, bromine pushed out (formula from the names) · bromine water into
//          potassium iodide: brown, iodine pushed out (Test Yourself A) → dive into the orange water: the smaller
//          chlorine pulls the electrons off bromide → Br₂ · the order F > Cl > Br > I > At. (tick 6)
//   END    back at the bleach: Test Yourself B, four clues on a chlorine jar → chlorine.
// Book points in the film: i all four conditions, H₂ + F₂ → 2HF, HF liquid (hydrogen bonding), less reactive down the
// group · ii OF₂, O₂F₂, Cl₂O₇, Br₃O₄, I₂O₅ · iii ionic halides, Cu + Br₂, K + I₂ · iv covalent halides, tri and penta
// halides of P with Cl and Br · v oxidize compounds (H₂S + Cl₂), bleaching powder from lime water, weaker with size ·
// vi displacement, the order, 2NaBr + Cl₂ · Test Yourself A and B. Game only (🎮 Halogen Lab, docs/COVERAGE_U8.md):
// "hydrides are strong reducing agents", "ionic character decreases down the group", "reactivity decreases F → I" for
// non-metals, the other written equations, 2NH₃ + 3Cl₂, Ca(OH)₂ + Cl₂, Activity 8.2. Book notes (NOTES.md): "As" for At.
// §1 CHECK: written only after looking at the sheet, with frame times: see docs/STATUS.md.
import * as THREE from 'three';
import * as K from './kit.js';
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

// ---------------------------------------------------------------- the four halogens (one jar pair each)
const HX4 = [
  { s: 'F', name: 'fluorine', gas: 0xf0dc40, tag: '#f6f0a8', res: 'bangs at once ✓', wide: 'at once' },
  { s: 'Cl', name: 'chlorine', gas: 0x9ee030, tag: '#d8f590', res: 'needs sunlight ✓', wide: 'needs sunlight' },
  { s: 'Br', name: 'bromine', gas: 0xb4461c, tag: '#ffb09a', res: 'needs heat ✓', wide: 'needs heat' },
  { s: 'I', name: 'iodine', gas: 0x9a52e8, tag: '#d8b8ff', res: 'goes both ways ↔', wide: 'both ways ↔' },
];

// ---------------------------------------------------------------- places (stations 10+ apart) · AY = height of dark scenes
const AY = 1.9;
const BKX = 0.15, BTX = -0.42, JEX = 1.0;                               // hook: beaker of bleach · bleach box · (end) chlorine jar
const HX = 14, PX = (k) => HX + (k - 1.5) * 1.8, JR = 0.12, JH = 0.42;   // four jar pairs on the bench
const YB = (k) => (k >= 2 ? 0.106 : 0);                                  // bromine and iodine stand on hot plates
const HFX = 26, OXA = 38;                                                // (dark) HF molecules · the oxides
const MX = 50, MLX = MX - 0.45, MBRN = MX + 0.55;                        // metals bench: bromine glass · burner
const IX = 62, NX = 74, PCX = 86;                                        // (dark) K → I · phosphorus bench · (dark) PCl₃/PCl₅
const CX = 98, C1 = CX - 1.15, C2 = CX + 0.42, CJ = CX + 1.02;            // compounds bench: H₂S water · lime water · chlorine jar
const TX = 110, DMX = 122, ORX = 132;                                    // displacement bench · (dark) Cl₂ vs Br⁻ · the order

// ---------------------------------------------------------------- time (every camera move ≥ 2 s; one place at a time)
const T = { low: 2.4, dip: 4.0, bottle: 8.4, ask: 12.0, card: 15.0 };
DOCK = T.card + 5.0;
const H0 = DOCK + 0.4, PF = H0 + 4.2, PC = PF + 12, PB = PC + 9, PI = PB + 9.5, HW = PI + 9.5, HL = HW + 5.2, HD = HL + 4.0;
const PS = [PF, PC, PB, PI];
const O0 = HD + 6.6, M0 = O0 + 19.6, MK = M0 + 9.2, ID = MK + 10.2, N0 = ID + 7.6, ND = N0 + 10.6, C0 = ND + 10.6;
const CL = C0 + 13.4, D0 = CL + 11.6, DD = D0 + 18.2, DO = DD + 9.2, E0 = DO + 5.8;
T.done = E0 + 14.5;
const INTRO = [T.card, DOCK];
const TICKS = [[O0 - 0.6, 0], [M0 - 0.6, 1], [N0 - 0.6, 2], [C0 - 0.6, 3], [D0 - 0.6, 4], [E0 - 0.6, 5]];
const DARK = [[HD, M0], [ID, N0], [ND, C0], [DD, E0]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);

const captions = [
  [0.3, T.low + 1.6, 'A red cloth and a cup of bleach', [BTX + 0.05, 0.62, 0.05]],
  [T.bottle, T.ask, 'Bleach is made with chlorine', [BTX + 0.05, 0.62, 0.05]],
  [T.ask, T.card, 'Halogens react with almost everything'],
  [H0, H0 + 2.4, 'First: hydrogen + each halogen'],
  [HW, HL, 'Down the group: less and less reactive'],
  [HL, HD, 'Hydrogen fluoride is a liquid'],
  [HD, O0, 'Its molecules hold on to each other'],
  [M0, M0 + 3.4, 'Metals: copper meets liquid bromine'],
  [M0 + 3.4, MK, 'Copper turns black: copper bromide'],
  [MK, MK + 4.2, 'Potassium and iodine, heated together'],
  [MK + 4.2, ID, 'White potassium iodide is left'],
  [ID, ID + 4.2, 'Potassium gives iodine an electron'],
  [ID + 4.2, N0, 'K⁺ and I⁻ hold on: an ionic halide'],
  [N0, N0 + 3.4, 'Non-metals: phosphorus into chlorine'],
  [N0 + 3.4, N0 + 7.6, 'It catches fire by itself'],
  [N0 + 7.6, ND, 'The fumes: phosphorus chlorides'],
  [ND + 7.6, C0, 'Bromine does the same: PBr₃, PBr₅'],
  [C0, C0 + 3.0, 'Compounds: hydrogen sulphide water'],
  [C0 + 3.0, C0 + 8.4, 'Chlorine water: yellow sulphur appears'],
  [C0 + 8.4, CL, 'It oxidizes: takes the hydrogen'],
  [CL, CL + 5.0, 'Chlorine gas into lime water'],
  [CL + 5.0, CL + 8.6, 'It makes bleaching powder'],
  [CL + 8.6, D0, 'The bleach from the start ✓'],
  [D0 + 3.0, D0 + 6.6, 'Orange: bromine is pushed out'],
  [D0 + 6.6, D0 + 10.0, 'Chlorine takes bromine’s place'],
  [D0 + 12.6, D0 + 15.8, 'Brown: iodine is pushed out'],
  [D0 + 15.8, DD, 'Why? Look inside the orange water'],
  [DD, DD + 5.4, 'Chlorine pulls off their electrons'],
  [DD + 5.4, DO, 'Chlorine is smaller: it pulls harder'],
  [DO, E0, 'Each pushes out the ones after it ✓'],
  [E0, E0 + 11.8, 'Test Yourself: which element is it?'],
  [E0 + 11.8, T.done, 'They react with almost everything ✓'],
];

// ---------------------------------------------------------------- camera
const POOL = V(PX(0), 0.075, 0.02), SPOON = V(MBRN, 0.72, 0), FUME = V(NX, 0.42, 0), TUBE1 = V(TX - 0.21, 0.26, 0);
const HK = (t, k = 1, e) => S(t, [(BTX + BKX) / 2 + 0.05, 0.36, 0.05], 1.3 * k, 0.95 * k, ADIR, e);
const HKW = (t, k = 1, e) => S(t, [(BTX + JEX) / 2 + 0.12, 0.38, 0.05], 2.35 * k, 1.0 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e) => S(t, [x, AY, 0], w * k, h * k, DDIR, e);
const PAIR = (t, k, kk = 1, e) => S(t, [PX(k), YB(k) + (k ? 0.48 : 0.56), 0.05], 1.0 * kk, (k ? 1.15 : 1.4) * kk, ADIR, e);
const HWIDE = (t, kk = 1) => S(t, [HX, 0.62, 0.05], 6.2 * kk, 1.8 * kk);
const DIVE = (t, p) => S(t, p.toArray(), 0.06, 0.05, ADIR, 'in');
const ML = (t, k = 1) => S(t, [MLX, 0.12, 0.05], 0.85 * k, 0.7 * k), MR = (t, k = 1) => S(t, [MBRN, 0.58, 0], 0.85 * k, 1.2 * k);
const NJ = (t, k = 1) => S(t, [NX, 0.55, 0.05], 1.1 * k, 1.3 * k);
const CA = (t, k = 1) => S(t, [C1, 0.45, 0.05], 0.95 * k, 1.15 * k), CB = (t, k = 1) => S(t, [(C2 + CJ) / 2, 0.45, 0.05], 1.3 * k, 1.1 * k);
const PT = (t, k = 1) => S(t, [TX, 0.5, 0.05], 1.4 * k, 1.2 * k);
const CAMS = [
  HK(0, 1.04), HK(T.bottle - 0.05, 0.97), HK(T.card, 1.0), HK(DOCK, 1.02), HK(H0 - 0.05, 0.99),
  // HYD: wide (the four pairs), a close-up per pair (cut, eye-trace: same place on screen), wide for the results
  HWIDE(H0, 1.06), HWIDE(PF - 0.05, 1.0),
  ...PS.flatMap((p, k) => [PAIR(p, k, 1.04), PAIR((PS[k + 1] ?? HW) - 0.05, k, 0.97)]),
  HWIDE(HW, 1.03), HWIDE(HL, 0.99),
  S(HL + 2.4, POOL.toArray(), 0.62, 0.48), S(HD - 0.9, POOL.toArray(), 0.55, 0.42), DIVE(HD - 0.05, POOL),
  // (dark) HF molecules, then the oxides
  DK(HD, HFX, 3.2, 1.9, 0.3), DK(HD + 1.8, HFX, 3.2, 1.9, 1.04, 'out'), DK(O0 - 0.05, HFX, 3.2, 1.9, 0.98),
  DK(O0, OXA, 2.6, 1.9, 1.03), DK(M0 - 0.05, OXA, 2.6, 1.9, 0.96),
  // METALS bench, dive into the white powder, K → I
  ML(M0, 1.04), ML(MK - 0.05, 0.96), MR(MK, 1.04), MR(MK + 1.6, 1.0), S(MK + 3.8, [MBRN, 0.84, 0], 0.62, 0.56), S(MK + 8.0, [MBRN, 0.82, 0], 0.54, 0.5),
  S(MK + 9.4, SPOON.toArray(), 0.3, 0.24), DIVE(ID - 0.05, SPOON),
  DK(ID, IX, 3.4, 2.1, 0.3), DK(ID + 1.8, IX, 3.4, 2.1, 1.04, 'out'), DK(N0 - 0.05, IX, 3.4, 2.1, 0.97),
  // NON-METALS bench, dive into the white fumes, PCl₃ / PCl₅
  NJ(N0, 1.05), NJ(N0 + 8.4, 0.96), S(N0 + 9.8, FUME.toArray(), 0.3, 0.26), DIVE(ND - 0.05, FUME),
  DK(ND, PCX, 2.6, 2.0, 0.3), DK(ND + 1.8, PCX, 2.6, 2.0, 1.04, 'out'), DK(C0 - 0.05, PCX, 2.6, 2.0, 0.97),
  // COMPOUNDS bench: H₂S beaker (its formula above it), then lime water
  CA(C0, 1.04), CA(CL - 0.05, 0.97), CB(CL, 1.04), CB(D0 - 0.05, 0.97),
  // DISPLACEMENT bench, dive into the orange tube, Cl₂ vs Br⁻, the order
  PT(D0, 1.04), PT(D0 + 15.8, 0.96), S(D0 + 17.4, TUBE1.toArray(), 0.3, 0.32), DIVE(DD - 0.05, TUBE1),
  DK(DD, DMX, 3.4, 2.4, 0.3), DK(DD + 1.8, DMX, 3.4, 2.4, 1.04, 'out'), DK(DO - 0.05, DMX, 3.4, 2.4, 0.97),
  DK(DO, ORX, 5.2, 2.2, 1.03), DK(E0 - 0.05, ORX, 5.2, 2.2, 0.98),
  // END
  HKW(E0, 1.03), HKW(T.done, 0.98),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const beats = [], fires = [];
    const ST = K.studio({ scene, R }, '817', { dark });                 // FIRST: models read the look
    beats.push((t) => ST.update(t));
    let root = scene;
    const add = (o, x = 0, y = 0, z = 0) => { o.position.set(x, y, z); root.add(o); return o; };
    const stage = (show) => { root = new THREE.Group(); scene.add(root); const g = root; beats.push((t) => { g.visible = show(t); }); return g; };
    const lbl = (text, h, color, x, y, z = 0, w = 700) => add(K.label(text, h, color, w), x, y, z);
    const tags = [], tag = (text, h, color, x, y, z = 0, w = 700) => { const l = lbl(text, 0.1, color, x, y, z, w); l.userData.frac = h * 1.8; tags.push(l); return l; };
    const grp = (l, g) => { l.userData.group = g; return l; };   // labels read together count as ONE text (engine oneText)
    const shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
    const fire = (tint, size, opts) => { const f = K.makeFire(tint, size, opts); fires.push(f); return f; };
    const goldE = M.glow(0xffc04d, 2.6);
    const electron = (r = 0.055, col = 0xffc04d) => { const e = add(new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), col === 0xffc04d ? goldE : M.glow(col, 2.2))); e.add(K.glowSprite(col, r * 7)); return e; };
    const ball = (r, col) => K.solid(new THREE.SphereGeometry(r, 32, 20), M.gloss(col));
    /** a ball with its element letter on the front: one per element given, only one shown at a time */
    const atomBall = (els, r) => {
      const g = new THREE.Group(), vis = els.map((el) => {
        const o = new THREE.Group(); o.add(ball(r, K.ATOM[el][0]));
        const l = K.label(el, r * 1.15, el === 'H' || el === 'F' ? '#1b2030' : '#ffffff', 800); l.position.z = r + 0.005; l.renderOrder = 22; o.add(l); g.add(o); return o;
      });
      g.userData.show = (i) => vis.forEach((o, k) => { o.visible = k === i; }); g.userData.show(0); return g;
    };
    const keyLight = (x) => { const k = new THREE.DirectionalLight(0xfff2e0, 2.0); k.position.set(x - 2, AY + 4, 6); k.target.position.set(x, AY, 0); root.add(k, k.target); };
    const pop = (o, t, t0, t1 = 1e9, s = 1) => { const u = t < t1 ? back(span(t, t0, t0 + 0.45)) : 1 - ease(span(t, t1, t1 + 0.3)); o.visible = u > 0.01; o.scale.setScalar(Math.max(1e-4, u * s)); return u; };
    const carry = (tg, t, m0, to, gap = 0.03) => {
      const on = t > m0 && t < m0 + 2.4; if (!on) return false;
      const top = to.clone().add(V(0, 1.1, 0));
      tg.position.copy(t < m0 + 1.2 ? top.lerp(to, 1 - (1 - span(t, m0, m0 + 1.2)) ** 2) : t < m0 + 1.5 ? to.clone() : to.clone().lerp(top, easeIn(span(t, m0 + 1.5, m0 + 2.4))));
      tg.userData.set(lerp(gap, gap + 0.05, span(t, m0 + 1.35, m0 + 1.5))); return true;
    };
    /** a dropper that comes down over x, lets drops fall at times ds, and goes up again at t1 */
    const dropperRig = (x, top, surf, t0, ds, t1, color) => {
      const dp = add(K.dropper(0.3)), drops = ds.map(() => add(K.solid(new THREE.SphereGeometry(0.012, 12, 8), M.liquid(color, 0.85), { outline: false })));
      beats.push((t) => {
        const down = ease(span(t, t0, t0 + 1.0)) * (1 - ease(span(t, t1, t1 + 1.0)));
        dp.visible = t > t0 - 0.05 && t < t1 + 1.0; dp.position.set(x, lerp(top + 0.9, top + 0.04, down), 0);
        const sq = ds.reduce((a, d) => a + Math.sin(Math.PI * span(t, d - 0.25, d + 0.05)), 0); dp.children[1].scale.set(1 + 0.1 * sq, 1.35 * (1 - 0.18 * sq), 1 + 0.1 * sq);
        drops.forEach((d, i) => { const u = span(t, ds[i], ds[i] + 0.32); d.visible = u > 0 && u < 1; d.position.set(x, lerp(top + 0.035, surf, u * u), 0); });
      });
      return dp;
    };
    /** balls that fly from where they are (from) to where they join (to) along an arc, starting at t0 + i·gap */
    const join = (balls, from, to, t, t0, dur = 1.0, gap = 0.12, lift = 0.25) => balls.forEach((b, i) => b.position.copy(K.arc(from[i], to[i], lift, ease(span(t, t0 + i * gap, t0 + i * gap + dur)))));
    /** a glowing electron that hops from a to b along an arc (with a short trail) during [t0, t1] */
    const hop = (a, b, lift = 0.4) => {
      const e = electron(0.05), trail = Array.from({ length: 7 }, () => add(K.glowSprite(0xffc04d, 0.13)));
      return (t, t0, t1, show = true) => {
        const u = ease(span(t, t0, t1)); e.visible = show && t > t0 - 0.6 && t < t1 + 0.2; e.position.copy(K.arc(a, b, lift, u));
        trail.forEach((s, k) => { const w = Math.max(0, u - 0.035 * (k + 1)); s.position.copy(K.arc(a, b, lift, w)); s.visible = show && u > 0.02 && u < 0.98; s.material.opacity = 0.55 * (1 - k / 7); });
      };
    };

    // ================================================================ HOOK / END · a red cloth in bleach; (end) the chlorine riddle
    {
      stage((t) => t < H0 - 0.05 || t >= E0 - 0.05); ST.bake(root, 'hook', 0.25, 2.5, 1.1);
      add(K.beaker(0.16, 0.34), BKX, 0, 0);
      const bl = add(K.liquid(0.155, 0.22, 0xf2eeb8, 0.4), BKX, 0.052, 0);
      add(K.printBox(0.15, 0.3, 0.1, '#eef2f6', ['BLEACH'], '#2563c9'), BTX, 0, 0);
      const tg = add(K.tongs(0.45)), strip = K.paperStrip([[0, 0], [0.15, 0], [0.32, 0]], 0.07, 0xc8282a, 0xf1ece2, 0.008); tg.add(strip); strip.position.y = -0.33; tg.userData.set(0.045);
      const TOP0 = V(BKX, 0.76, 0), TOP1 = V(BKX, 0.46, 0);
      const lCloth = tag('red cloth', 0.05, '#ffb0a8', BKX + 0.28, 0.62, 0.1), lBl = tag('bleach', 0.05, '#ffffff', BTX, 0.42, 0.08);
      const lGone = tag('colour gone ✓', 0.055, '#ffffff', BKX + 0.05, 0.06, 0.3), lMade = tag('made with chlorine', 0.05, '#d8f590', BTX, 0.42, 0.08);
      // END: a jar of chlorine (wisps of greenish gas) slides in; four clues, then its name
      const jar = add(K.gasJar(0x9ee030, 0.15, 0.55), JEX, 0, 0), lid = jar.userData.lid, lid0 = lid.position.clone(); jar.userData.gas.opacity = 0.1;
      const wisp = K.gasCloud(0x9ee030, 12); jar.add(wisp);
      const flow = K.smoke(14, 0xb4ec30); root.add(flow);
      const clues = ['period 3', 'pushes iodine out', 'heavier than air', 'kills germs in pools'].map((s) => tag(s, 0.05, '#d8f590', JEX - 0.12, 0.78, 0.05));
      const lName = tag('chlorine ✓', 0.065, '#ffffff', JEX - 0.05, 0.78, 0.05);
      beats.push((t) => {
        tg.position.copy(TOP0).lerp(TOP1, ease(span(t, T.low, T.dip))); tg.visible = t < H0 || t > E0;
        strip.userData.wet(lerp(0, 0.3, ease(span(t, T.dip + 0.2, T.dip + 4.4))));
        bl.userData.top.position.y = 0.22 + 0.004 * Math.sin(t * 2.2);
        K.popIn(lCloth, t, 0.6, T.dip + 0.4); K.popIn(lGone, t, T.dip + 3.6, T.bottle + 0.2); K.popIn(lBl, t, T.bottle + 0.4, T.bottle + 2.0); lMade.visible = false;
        const e = (k) => E0 + k, slide = ease(span(t, e(0.3), e(2.2)));
        jar.visible = t > E0 - 0.05; jar.position.x = lerp(JEX + 1.6, JEX, slide);
        const open = ease(span(t, e(6.9), e(7.4))) * (1 - ease(span(t, e(9.4), e(9.9))));
        lid.position.set(lid0.x + 0.07 * open, lid0.y + 0.05 * open, lid0.z); lid.rotation.z = -0.35 * open;
        wisp.userData.update(t, 0.07, 0.5, 0.13, 1 - 0.4 * ease(span(t, e(7.2), e(9.6))));
        flow.visible = t > e(7.2) && t < e(10.2); flow.position.set(jar.position.x, 0, 0);
        flow.children.forEach((s, i) => {                         // heavy gas: it spills over the rim and flows DOWN the outside, spreading on the table
          const u = ((t - e(7.2)) * 0.45 + i / 14) % 1, side = i % 2 ? 1 : -1, r0 = 0.16 + 0.05 * u;
          s.position.set(side * (r0 + 0.12 * u * u), Math.max(0.03, 0.58 - 0.62 * u), 0.04 * Math.sin(i));
          s.scale.setScalar(0.08 + 0.12 * u); s.material.opacity = 0.45 * Math.sin(Math.PI * u) * (1 - span(t, e(9.4), e(10.2)));
        });
        const CLU = [[e(2.4), e(4.4)], [e(4.6), e(6.6)], [e(6.8), e(9.4)], [e(9.6), e(11.6)]];
        clues.forEach((l, i) => K.popIn(l, t, ...CLU[i])); K.popIn(lName, t, e(11.9), 1e9);
      });
    }

    // ================================================================ HYD bench · four pairs: hydrogen on top, a halogen below
    {
      stage((t) => t >= H0 - 0.05 && t < HD - 0.05);
      const pairs = HX4.map((h, k) => {
        const x = PX(k), b = YB(k), plate = k >= 2 ? add(K.hotPlate(0.34, 0.3), x, 0, 0) : null;
        const lo = add(K.gasJar(h.gas, JR, JH), x, b, 0); lo.userData.gas.opacity = 0;
        const hi = add(K.gasJar(0xffffff, JR, JH), x, b + 2 * JH + 0.05, 0); hi.rotation.x = Math.PI; hi.children.slice(1).forEach((o) => { o.visible = false; });
        const wisp = K.gasCloud(h.gas, 14); lo.add(wisp); if (k === 0) lo.children[1].visible = false;
        const pool = k === 2 ? add(K.liquid(0.094, 0.03, 0x5a1006, 0.92), x, b + 0.054, 0) : k === 0 ? add(K.liquid(0.1, 0.03, 0x9fd8f2, 0.62), x, b + 0.034, 0) : null;
        const crys = k === 3 ? [0, 1, 2, 3, 4].map((i) => add(K.solid(new THREE.BoxGeometry(0.03, 0.012, 0.022), new THREE.MeshPhysicalMaterial({ color: 0x2a2236, metalness: 0.6, roughness: 0.3, clearcoat: 0.7 })), x + (i - 2) * 0.036, b + 0.06 + 0.005 * (i % 3), 0.03 * Math.sin(i * 2.1))) : [];
        crys.forEach((c, i) => { c.rotation.y = i * 1.3; });
        const glow = plate ? add(K.glowSprite(0xff5a20, 0.75), x, 0.11, 0.16) : null; if (glow) glow.material.opacity = 0;
        const ring = plate ? add(new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.007, 10, 48).rotateX(Math.PI / 2), M.glow(0xff4a18, 0)), x, 0.088, -0.01) : null;
        return { h, k, x, b, lo, hi, wisp, cover: lo.userData.lid, cover0: lo.userData.lid.position.clone(), plate, glow, ring, pool };
      });
      ST.bake(root, 'hyd', HX, 6.8, 1.1);
      // labels: close-ups (names on the jars, the result on the join) · wide (names above, results on the join)
      const lHyd = pairs.map(({ x, b }, k) => grp(tag('hydrogen', 0.05, '#ffffff', x, b + 1.5 * JH + 0.05, 0.16), 'pair' + k));
      const lHal = pairs.map(({ h, x, b }, k) => grp(tag(h.name, 0.05, h.tag, x, b + 0.5 * JH, 0.16), 'pair' + k));
      const lNot = pairs.map(({ x, b }) => tag('nothing yet…', 0.045, '#c9d0db', x, b + JH + 0.03, 0.2));
      const lRes = pairs.map(({ h, x, b }) => tag(h.res, 0.05, '#ffffff', x, b + JH + 0.03, 0.2));
      const wName = pairs.map(({ h, x, b }) => grp(tag(h.name, 0.036, h.tag, x, b + 2 * JH + 0.16, 0.05), 'row'));
      const wRes = pairs.map(({ h, x, b }) => grp(tag(h.wide, 0.034, '#ffffff', x, b + JH + 0.03, 0.2), 'row'));
      const lHF = tag('liquid HF ✓', 0.055, '#ffffff', PX(0), 0.22, 0.18);
      const lProd = tag('hydrogen fluoride', 0.05, '#ffffff', PX(0), JH + 0.03, 0.2);
      // fluorine's formula, built from the names on its jars
      beats.push(K.equation(root, { slots: [['H₂'], ['+'], ['F₂'], ['→'], ['2HF']], y: 2 * JH + 0.24, z: 0.05, x0: PX(0), h: 0.13, starts: [PF + 7.6], end: PC - 0.05,
        src: (m, j) => (j === 0 ? { lab: lHyd[0], tIn: PF + 0.3, at: () => lHyd[0].position } : j === 2 ? { lab: lHal[0], tIn: PF + 0.6, at: () => lHal[0].position } : j === 4 ? { lab: lProd, tIn: PF + 6.8, at: () => lProd.position } : null) }));
      // the causes: tongs pull each plate · a flash for each bang · a beam of sunlight · the hot plates
      const tg = add(K.tongs(0.4)); tg.rotation.x = Math.PI / 2;
      const flash = add(K.glowSprite(0xffffff, 1.0)), stars = add(K.sparkle(0xfff2c0, 0.6)), puff = add(K.smoke(10, 0xf4f4f0)); puff.scale.setScalar(0.1);
      const beamM = new THREE.MeshBasicMaterial({ color: 0xffe6a8, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
      const beam = add(new THREE.Mesh(new THREE.ConeGeometry(0.2, 2.2, 32, 1, true).translate(0, -1.1, 0), beamM)); beam.renderOrder = 7;
      const SUN = V(PX(1) - 0.9, 2.1, 0.25), sunAt = V(PX(1), JH + 0.1, 0.02);
      beam.position.copy(SUN); beam.quaternion.setFromUnitVectors(V(0, -1, 0), sunAt.clone().sub(SUN).normalize()); beam.scale.set(1, sunAt.distanceTo(SUN) / 2.2, 1);
      const lHeat = [2, 3].map((k) => tag('hot plate on', 0.045, '#ffb070', PX(k), 0.2, 0.32));
      const lSun = tag('sunlight', 0.045, '#ffe08a', PX(1) - 0.34, JH + 0.4, 0.15);
      const arrow = add(new THREE.Group(), PX(0) - 0.15, 1.33, 0.05), aM = M.glow(0xffc04d, 1.4);
      arrow.add(new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1, 12).rotateZ(Math.PI / 2).translate(0.5, 0, 0), aM)); const head = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.09, 16).rotateZ(-Math.PI / 2), aM); arrow.add(head);
      const lLess = tag('less and less reactive', 0.04, '#ffe08a', HX, 1.45, 0.05);
      const mist = new THREE.Color(0xf2f2ee);
      const BANG = [PF + 3.9, PC + 6.4];                                // fluorine at once; chlorine when the sun shines
      const bang = (t, b) => (t > b && t < b + 1.6 ? Math.exp(-(t - b) * 2.6) * (t - b < 0.08 ? (t - b) / 0.08 : 1) : 0);
      beats.push((t) => {
        // the tongs: in from the front, grip the glass plate, pull it out towards us, lift away
        let kNow = -1; PS.forEach((p, i) => { if (t >= p - 0.05) kNow = i; }); const P0 = PS[Math.max(0, kNow)], J = pairs[Math.max(0, kNow)];
        const c0 = P0 + 2.0, grip = V(J.x, J.b + JH + 0.026, JR + 0.04);
        const inU = ease(span(t, c0, c0 + 0.7)), pull = ease(span(t, c0 + 0.9, c0 + 1.5)), away = easeIn(span(t, c0 + 1.6, c0 + 2.3));
        tg.visible = kNow >= 0 && t > c0 && t < c0 + 2.3;
        tg.position.copy(grip).add(V(0, 0, 0.6 * (1 - inU) + 0.32 * pull)).add(V(0, 1.2 * away, 0.15 * away)); tg.userData.set(inU < 1 ? 0.05 : 0.016);
        pairs.forEach((p, k) => {
          const pc = PS[k] + 2.0, pu = ease(span(t, pc + 0.9, pc + 1.5)), aw = easeIn(span(t, pc + 1.6, pc + 2.3));
          p.cover.position.set(p.cover0.x, p.cover0.y - 1.2 * aw * 0 + 0, p.cover0.z + 0.32 * pu + 0.15 * aw); p.cover.position.y = p.cover0.y + 1.2 * aw; p.cover.visible = aw < 0.99;
          const drop = ease(span(t, pc + 1.5, pc + 1.7)), mix = ease(span(t, pc + 1.6, pc + 3.0));
          // what happens to the colour: gone at once (F), gone in the sun (Cl), fades on the hot plate (Br), fades and comes back (I)
          const s = PS[k];
          const u = t - s - 6.8, gone = k === 0 ? ease(span(t, BANG[0], BANG[0] + 0.4)) : k === 1 ? ease(span(t, BANG[1], BANG[1] + 0.5)) : k === 2 ? ease(span(t, s + 5.8, s + 8.4))
            : 0.85 * ease(span(u, 0, 1.1)) - 0.45 * Math.sin(Math.PI * span(u, 1.1, 3.3)) - 0.25 * Math.sin(Math.PI * span(u, 3.3, 5.0));   // iodine: fades, comes back, fades…
          const heat = p.plate ? ease(span(t, s + 5.0, s + 5.6)) : 0;
          const iodV = k === 3 ? ease(span(t, s + 5.6, s + 6.6)) : 1;              // iodine is a solid: purple vapour rises only when heated
          p.wisp.userData.update(t, 0.07, lerp(JH - 0.04, 2 * JH - 0.02, mix), JR - 0.02, iodV * (1 - (k === 3 ? Math.min(0.85, Math.max(0, gone)) : gone)));
          p.hi.position.y = p.b + 2 * JH + 0.05 - 0.022 * drop; p.lo.userData.gas.opacity = 0.12 * iodV * (1 - Math.min(1, Math.max(0, gone)));
          if (p.plate) { p.plate.userData.on(heat); p.glow.material.opacity = 0.9 * heat * (0.85 + 0.15 * Math.sin(t * 5 + k)); p.glow.visible = heat > 0.01; p.ring.material.emissiveIntensity = 3 * heat; }
          if (k === 2) { p.pool.scale.y = Math.max(1e-4, 1 - 0.9 * Math.max(0, gone)); }
          if (k === 0) { const hfU = ease(span(t, BANG[0] + 1.2, HD - 1.0)); p.pool.scale.y = Math.max(1e-4, hfU); p.pool.visible = hfU > 0.01; }
          const bk = k < 2 ? bang(t, BANG[k]) : 0, jolt = bk * 0.012 * Math.sin(t * 80);
          p.lo.position.x = p.x + jolt; p.hi.position.x = p.x - jolt; p.hi.position.y += 0.07 * Math.sin(Math.PI * span(t, BANG[k] ?? -9, (BANG[k] ?? -9) + 0.5)) * (k < 2 ? 1 : 0);
          // labels: names held, the plate is pulled, "nothing yet…" (not fluorine), the result
          const nx = k ? s + 3.8 : 1e9, res = [BANG[0] + 1.0, BANG[1] + 0.9, s + 8.0, s + 8.2][k], end = (PS[k + 1] ?? HW) - 0.05;
          if (k) { K.popIn(lHyd[k], t, s + 0.3, end); K.popIn(lHal[k], t, s + 0.6, end); }
          K.popIn(lNot[k], t, nx, k === 1 ? BANG[1] - 0.6 : s + 5.0); if (k >= 2) K.popIn(lHeat[k - 2], t, s + 5.3, s + 7.9); K.popIn(lRes[k], t, res, k === 0 ? PF + 6.4 : end);
          if (t < PF) K.popIn(wName[k], t, H0 + 0.8 + 0.3 * k, PF - 0.3); else K.popIn(wName[k], t, HW + 0.3 + 0.25 * k, HL + 0.6); K.popIn(wRes[k], t, HW + 1.2 + 0.25 * k, HL + 0.6);
        });
        K.popIn(lProd, t, PF + 6.8, PF + 9.4);
        // the bangs: a flash, stars and a puff of smoke from the join
        const fk = Math.max(bang(t, BANG[0]), 0.8 * bang(t, BANG[1])), fx = t < PC ? PX(0) : PX(1), fb = t < PC ? 0 : 1;
        flash.visible = stars.visible = fk > 0.01; flash.position.set(fx, YB(fb) + JH + 0.03, 0.15); flash.scale.setScalar(Math.max(1e-4, 1.1 * fk));
        stars.position.copy(flash.position); stars.scale.setScalar(Math.max(1e-4, 0.7 * fk)); stars.material.rotation = t * 3;
        const pb = t < PC ? BANG[0] : BANG[1], pu2 = t - pb; puff.visible = pu2 > 0 && pu2 < 2.4; puff.position.set(fx, JH + 0.03, 0.05); puff.userData.update(pu2 * 1.4, Math.max(0, 1 - pu2 / 2.4) * 1.3);
        // the sunlight: a warm beam slides onto the chlorine jar, then fades
        const sb = ease(span(t, PC + 4.6, PC + 5.6)) * (1 - ease(span(t, PC + 8.0, PB - 0.1)));
        beamM.opacity = 0.2 * sb; beam.visible = sb > 0.01; K.popIn(lSun, t, PC + 5.0, PB - 0.3);
        // wide: the arrow grows across the four results
        const g = ease(span(t, HW + 2.4, HW + 4.0)) * (1 - ease(span(t, HL + 0.3, HL + 0.8))), L = Math.max(1e-4, (PX(3) - PX(0) + 0.3) * g);
        arrow.visible = g > 0.01; arrow.children[0].scale.x = L; head.position.x = L + 0.03; lLess.visible = false;
        K.popIn(lHF, t, HL + 2.0, HD - 0.4);
      });
    }

    // ================================================================ (dark) inside the liquid: HF molecules hold on to each other
    {
      stage((t) => t >= HD - 0.05 && t < O0); keyLight(HFX);
      const mol = (x, y, a) => { const g = add(new THREE.Group(), x, y, 0), h = atomBall(['H'], 0.12), f = atomBall(['F'], 0.19); h.position.x = -0.17; f.position.x = 0.1; g.add(h, f); g.rotation.z = a; return g; };
      const hf = Array.from({ length: 6 }, (_, i) => mol(HFX + (i - 2.5) * 0.46, AY + (i % 2 ? 0.16 : -0.16), (i % 2 ? -1 : 1) * 0.35));
      const dots = []; for (let i = 0; i < 5; i++) for (let d = 0; d < 3; d++) { const s = electron(0.024); s.children[0].scale.setScalar(0.11); dots.push({ s, i, d }); }
      const lB = lbl('hydrogen bonds', 0.2, '#ffd27a', HFX, AY + 0.62), lHold = lbl('they hold on: a liquid ✓', 0.22, '#ffffff', HFX, AY - 0.62);
      beats.push((t) => {
        if (!shown(lB.parent)) return;
        const h = (k) => HD + k;
        hf.forEach((g, i) => { g.position.y = AY + (i % 2 ? 0.16 : -0.16) + 0.012 * Math.sin(t * 2 + i); g.rotation.z = (i % 2 ? -1 : 1) * 0.35 + 0.04 * Math.sin(t * 1.3 + i); });
        const glow = ease(span(t, h(1.8), h(2.6)));
        dots.forEach(({ s, i, d }) => {
          const a = hf[i], b = hf[i + 1], ah = a.localToWorld(V(-0.17, 0, 0)), bf = b.localToWorld(V(0.1, 0, 0)), ah2 = b.localToWorld(V(-0.17, 0, 0)), af = a.localToWorld(V(0.1, 0, 0));
          const from = i % 2 ? ah2 : ah, to = i % 2 ? af : bf; void from;
          s.position.copy(i % 2 ? af.lerp(ah2, (d + 1) / 4) : ah.lerp(bf, (d + 1) / 4)).add(V(0, 0, 0.05)); void to;
          s.visible = glow > 0.01; s.scale.setScalar(Math.max(1e-4, glow * (0.85 + 0.15 * Math.sin(t * 4 + i))));
        });
        K.popIn(lB, t, h(2.2), O0); K.popIn(lHold, t, h(3.4), O0);
      });
    }

    // ================================================================ (dark) the oxides, one at a time in the same place
    {
      stage((t) => t >= O0 - 0.05 && t < M0); keyLight(OXA);
      const o = (k) => O0 + k, CY = AY + 0.02;
      // [halogen, ball r, how many, how many O, formula, name, arrive time, leave time, layout(i, kind) → position]
      const MOLS = [
        ['F', 0.16, 2, 1, 'OF₂', 'fluorine monoxide', o(0), o(3.9), (i, x) => (x ? [0, 0.12] : [i ? 0.36 : -0.36, -0.12])],
        ['F', 0.16, 2, 2, 'O₂F₂', 'fluorine dioxide', o(3.5), o(7.9), (i, x) => (x ? [i ? 0.17 : -0.17, 0.05] : [i ? 0.52 : -0.52, -0.06])],
        ['Cl', 0.2, 2, 7, 'Cl₂O₇', 'dichlorine heptoxide', o(7.5), o(11.9), null],
        ['Br', 0.2, 3, 4, 'Br₃O₄', 'tribromine tetraoxide', o(11.5), o(15.7), null],
        ['I', 0.23, 2, 5, 'I₂O₅', 'iodine pentoxide', o(15.3), M0 + 1, null],
      ].map(([el, r, nx, no, f, nm, t0, t1, lay]) => {
        const core = [], ox = [], to = [], from = [];
        for (let i = 0; i < nx; i++) {
          const b = add(atomBall([el], r)); core.push(b);
          to.push(lay ? V(OXA + lay(i, 0)[0], CY + lay(i, 0)[1], 0) : V(OXA + (i - (nx - 1) / 2) * r * 1.75, CY, 0));
          from.push(t0 <= O0 + 0.01 ? to[i].clone() : V(OXA + 1.7 + 0.25 * i, CY + 0.2 * (i - 0.5), 0));
        }
        const oT = [], oF = [];
        for (let i = 0; i < no; i++) {
          const b = add(atomBall(['O'], 0.14)); ox.push(b);
          if (lay) oT.push(V(OXA + lay(i, 1)[0], CY + lay(i, 1)[1], 0));
          else { const a = i / no * Math.PI * 2 + 0.35; oT.push(V(OXA + Math.cos(a) * (r * nx * 0.88 + 0.2), CY + Math.sin(a) * (r + 0.22), 0.1 * Math.sin(a * 2))); }
          oF.push(V(OXA + 1.8 + 0.2 * Math.cos(i), CY + 0.25 * Math.sin(i * 1.7), 0));
        }
        return { core, ox, to, from, oT, oF, t0, t1, nx, f: grp(lbl(f, 0.34, '#f6d48f', OXA, CY + 0.78, 0, 700), 'ox' + f), n: grp(lbl(nm, 0.21, '#ffffff', OXA, CY - 0.66), 'ox' + f) };
      });
      beats.push((t) => {
        if (!shown(MOLS[0].f.parent)) return;
        MOLS.forEach(({ core, ox, to, from, oT, oF, t0, t1, f, n }) => {
          const on = t > t0 - 0.05 && t < t1 + 0.05, out = ease(span(t, t1 - 0.45, t1));      // leave: rise and shrink, before the next one arrives
          join(core, from, to, t, t0, 0.9, 0.12, 0.2); join(ox, oF, oT, t, t0 + 0.8, 0.7, 0.12, 0.15);
          [...core, ...ox].forEach((b, i) => { b.visible = on && (i < core.length || t > t0 + 0.8 + 0.12 * (i - core.length) - 0.05); b.position.y += 0.5 * out; b.scale.setScalar(Math.max(1e-4, 1 - out)); });
          const ready = t0 + 1.7;
          K.popIn(f, t, ready, t1 - 0.45); K.popIn(n, t, ready + 0.25, t1 - 0.45);
        });
      });
    }

    // ================================================================ METALS bench · copper in liquid bromine; potassium + iodine in the flame
    {
      stage((t) => t >= M0 - 0.05 && t < ID - 0.05);
      const m = (k) => M0 + k, q = (k) => MK + k;
      add(K.watchGlass(0.27), MLX, 0, 0); const pool = add(K.liquid(0.2, 0.014, 0x5c0f06, 0.94), MLX, 0.012, 0);
      const vap = K.gasCloud(0xb04a20, 10); add(vap, MLX, 0.03, 0);
      const cuM = new THREE.MeshPhysicalMaterial({ color: 0xd8864a, metalness: 0.9, roughness: 0.25, clearcoat: 0.4 });
      const foil = add(new THREE.Group()), fb = K.solid(new THREE.BoxGeometry(0.22, 0.007, 0.11), cuM); foil.add(fb);
      const tg = add(K.tongs(0.6)), REST = V(MLX, 0.03, 0);
      const brn = add(K.burner(), MBRN, 0, 0); fires.push(brn.userData.flame); brn.userData.flame.scale.setScalar(0.75);
      ST.bake(root, 'metal', MX + 0.05, 2.0, 1.1);
      const sp = add(K.spoon(0.6)), kM = new THREE.MeshPhysicalMaterial({ color: 0xd8dce2, metalness: 0.7, roughness: 0.3, clearcoat: 0.5 });
      const kl = K.lump(0.042, kM, 4, 0.7, 0.3); kl.position.set(-0.016, -0.034, 0); sp.add(kl);
      const iod = [0, 1, 2, 3].map((i) => { const c = K.solid(new THREE.BoxGeometry(0.028, 0.01, 0.02), new THREE.MeshPhysicalMaterial({ color: 0x2e2638, metalness: 0.6, roughness: 0.28, clearcoat: 0.7 })); c.position.set(0.02 + 0.006 * (i % 2), -0.026 + 0.005 * i, (i - 1.5) * 0.018); c.rotation.y = i * 1.1; sp.add(c); return c; });
      const purple = add(K.smoke(10, 0x9a5ae8)); purple.scale.setScalar(0.16);
      const white = new THREE.Color(0xf4f2ec), HOLD = V(MBRN, 0.98, 0), FL = V(MBRN, 0.72, 0);
      const lBr = tag('liquid bromine', 0.05, '#ffb09a', MLX - 0.08, 0.27, 0.1), lCu = tag('copper', 0.05, '#ffd2a8', MLX, 0.3, 0.05), lCuB = tag('copper bromide forms ✓', 0.052, '#ffffff', MLX, 0.27, 0.1);
      const lK = tag('potassium', 0.048, '#ffffff', MBRN - 0.27, 0.98, 0.05), lI = tag('iodine', 0.048, '#d8b8ff', MBRN + 0.25, 0.98, 0.05), lKI = tag('potassium iodide forms ✓', 0.05, '#ffffff', MBRN + 0.05, 0.86, 0.12);
      beats.push((t) => {
        // copper: tongs lay it in the bromine; it turns black
        const c = carry(tg, t, m(1.3), REST.clone().add(V(0, 0.01, 0)), 0.06); tg.visible = c;
        foil.visible = t > m(1.3); foil.position.copy(t < m(2.6) ? tg.position.clone().add(V(0, -0.012, 0)) : REST);
        const dk = ease(span(t, m(3.0), m(6.0))); cuM.color.set(0xd8864a).lerp(new THREE.Color(0x221a17), dk); cuM.metalness = 0.9 - 0.8 * dk; cuM.roughness = 0.25 + 0.6 * dk; cuM.clearcoat = 0.4 * (1 - dk);
        pool.userData.top.material.opacity = 0.95 - 0.15 * dk; vap.userData.update(t, 0.0, 0.14, 0.16, 0.55);
        lCu.position.copy(foil.position).add(V(0, 0.2, 0.05));
        K.popIn(lBr, t, m(0.3), m(1.9)); K.popIn(lCu, t, m(2.2), m(4.6)); K.popIn(lCuB, t, m(5.4), MK);
        // potassium + iodine: the spoon comes down, waits (names), goes into the flame: purple vapour, white potassium iodide
        const dn = ease(span(t, q(0.2), q(1.6))), into = ease(span(t, q(3.0), q(3.8)));
        sp.visible = t > q(0.1); sp.position.copy(V(MBRN, 1.9, 0).lerp(HOLD, dn)).lerp(FL, into);
        const hot = ease(span(t, q(4.0), q(4.6))), wk = ease(span(t, q(5.0), q(7.0)));
        kM.emissive.set(0xff9a40); kM.emissiveIntensity = 0.8 * hot * (1 - wk); kM.color.set(0xd8dce2).lerp(white, wk); kM.metalness = 0.7 * (1 - wk); kM.roughness = 0.3 + 0.55 * wk; kM.clearcoat = 0.5 * (1 - wk);
        iod.forEach((ic) => { ic.scale.setScalar(Math.max(1e-4, 1 - wk)); ic.visible = wk < 0.99; });
        kl.scale.setScalar(1 + 0.45 * wk);
        purple.visible = t > q(4.1) && t < q(8.2); purple.position.copy(sp.position).add(V(0, 0.03, 0)); purple.userData.update(t - q(4.1), hot * (1 - ease(span(t, q(7.0), q(8.2)))) * 1.6);
        K.popIn(lK, t, q(1.4), q(3.0)); K.popIn(lI, t, q(1.7), q(3.0)); K.popIn(lKI, t, q(7.3), q(9.4));
      });
    }

    // ================================================================ (dark) inside the white powder: potassium gives iodine one electron → K⁺ I⁻
    {
      stage((t) => t >= ID - 0.05 && t < N0); keyLight(IX);
      const i = (k) => ID + k, KX = IX - 0.8, IIX = IX + 0.8, KR = 0.5, IR = 0.68;
      const kB = add(atomBall(['K'], 0.3), KX, AY, 0), iB = add(atomBall(['I'], 0.42), IIX, AY, 0);
      const ringM = (c) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.5, toneMapped: false });
      const kRing = add(new THREE.Mesh(new THREE.TorusGeometry(KR, 0.006, 6, 96), ringM(0xffc04d)), KX, AY, 0), iRing = add(new THREE.Mesh(new THREE.TorusGeometry(IR, 0.006, 6, 96), ringM(0x6f9fe8)), IIX, AY, 0);
      const outer = electron(0.05), iE = Array.from({ length: 7 }, () => electron(0.045, 0x59a8ff));
      const hole = add(new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.006, 8, 32), ringM(0xffffff)));   // the one empty place
      const trail = Array.from({ length: 8 }, () => add(K.glowSprite(0xffc04d, 0.14)));
      const kP = add(K.ion(0.24, 0xc9ced8, '+'), KX, AY, 0), iM = add(K.ion(0.5, 0x7a52b0, '−'), IIX, AY, 0);
      const lK = lbl('K', 0.3, '#ffffff', KX, AY + 0.75, 0, 700), lI = lbl('I', 0.3, '#ffffff', IIX, AY + 0.9, 0, 700);
      const lKp = lbl('K⁺', 0.32, '#ffffff', KX, AY + 0.6, 0, 700), lIm = lbl('I⁻', 0.32, '#ffffff', IIX, AY + 0.75, 0, 700), lIon = lbl('ionic halide ✓', 0.26, '#ffe08a', IX, AY - 0.85);
      beats.push((t) => {
        if (!shown(lK.parent)) return;
        const fly = ease(span(t, i(1.6), i(3.2))), ions = ease(span(t, i(3.8), i(4.8))), pull = easeIn(span(t, i(5.2), i(6.1)));
        const jolt = t > i(6.1) ? 0.04 * Math.exp(-(t - i(6.1)) * 6) * Math.sin((t - i(6.1)) * 18) : 0, gap = (1 - pull) * 0.6 + jolt;
        const kx = KX + 0.8 * (1 - gap / 0.6) * 0.42, ix = IIX - 0.8 * (1 - gap / 0.6) * 0.48;
        const spin = t * 0.5, slot = (k) => V(IIX + IR * Math.cos(spin + k / 8 * Math.PI * 2), AY + IR * Math.sin(spin + k / 8 * Math.PI * 2), 0.02);
        iE.forEach((e, k) => { e.position.copy(slot(k)); e.visible = ions < 0.99; });
        hole.position.copy(slot(7)); hole.visible = fly < 0.98; hole.scale.setScalar(1 + 0.2 * Math.sin(t * 6));
        const ka = t * 1.1, kp = V(KX + KR * Math.cos(ka), AY + KR * Math.sin(ka), 0.02);
        outer.position.copy(fly < 1 ? K.arc(kp, slot(7), 0.5, fly) : slot(7)); outer.visible = ions < 0.99;
        trail.forEach((s, k) => { const u = Math.max(0, fly - k * 0.03); s.position.copy(K.arc(kp, slot(7), 0.5, u)); s.visible = fly > 0.02 && fly < 0.98; s.material.opacity = 0.6 * (1 - k / trail.length); });
        kRing.material.opacity = 0.5 * (1 - fly); iRing.material.opacity = 0.5 * (1 - ions);
        kB.visible = ions < 0.5; iB.visible = ions < 0.5; kB.scale.setScalar(Math.max(1e-4, 1 - 0.3 * ions)); iB.scale.setScalar(Math.max(1e-4, 1 + 0.2 * ions));
        kP.visible = iM.visible = ions >= 0.5; kP.position.set(kx, AY, 0); iM.position.set(ix, AY, 0);
        kP.userData.sign.visible = iM.userData.sign.visible = ions > 0.6;
        K.popIn(lK, t, i(0.5), i(3.5)); K.popIn(lI, t, i(0.7), i(3.5)); lKp.position.x = kx; lIm.position.x = ix;
        K.popIn(lKp, t, i(3.9), N0); K.popIn(lIm, t, i(4.1), N0); K.popIn(lIon, t, i(6.4), N0);
      });
    }

    // ================================================================ NON-METALS bench · phosphorus catches fire by itself in chlorine
    {
      stage((t) => t >= N0 - 0.05 && t < ND - 0.05);
      const jar = add(K.gasJar(0x9ee030, 0.17, 0.7), NX, 0, 0), gas = jar.userData.gas, lid = jar.userData.lid, lid0 = lid.position.clone(); gas.opacity = 0.08;
      const wG = K.gasCloud(0x9ee030, 14), wW = K.gasCloud(0xf6f6f2, 16); jar.add(wG, wW);
      ST.bake(root, 'nonm', NX, 1.4, 1.0);
      const sp = add(K.spoon(0.6)), pM = new THREE.MeshStandardMaterial({ color: 0xf0e6b0, roughness: 0.55, emissive: 0xffd080, emissiveIntensity: 0 });
      const ph = K.lump(0.038, pM, 12, 0.6, 0.4); ph.position.y = -0.03; sp.add(ph);
      const fl = add(fire(0xffc21a, 0.3, { core: 0xfff3c4 }));
      const white = new THREE.Color(0xf4f4ee), green = new THREE.Color(0x9ee030);
      const OVER = V(NX, 1.12, 0), IN = V(NX, 0.4, 0);
      const n = (k) => N0 + k;
      const lCl = tag('chlorine', 0.05, '#d8f590', NX, 0.36, 0.2), lP = tag('phosphorus', 0.05, '#fff4c8', 0, 0, 0);
      const lFire = tag('catches fire by itself ✓', 0.052, '#ffffff', NX, 0.92, 0.05), lFume = tag('white fumes ✓', 0.055, '#ffffff', NX, 0.8, 0.12);
      beats.push((t) => {
        const p = t < n(2.4) ? V(NX, 1.9, 0).lerp(OVER, ease(span(t, n(0.3), n(1.6)))) : OVER.clone().lerp(IN, ease(span(t, n(2.4), n(3.3))));
        sp.position.copy(p); sp.visible = t > n(0.3);
        const off = ease(span(t, n(1.8), n(2.4)));
        lid.position.set(lid0.x - 0.42 * off, lid0.y - (lid0.y - 0.006) * easeIn(span(off, 0.6, 1)), lid0.z);
        const burn = ease(span(t, n(3.5), n(3.9))) * (1 - ease(span(t, n(7.6), n(8.4))));
        const fk = burn * (1 + 0.12 * Math.sin(t * 17)); fl.visible = fk > 0.01; fl.position.copy(p).add(V(0, -0.01, 0)); fl.scale.setScalar(Math.max(1e-4, fk));
        pM.emissiveIntensity = 0.7 * burn; ph.scale.setScalar(Math.max(0.25, 1 - 0.6 * ease(span(t, n(3.6), n(8.0)))));
        const sm = ease(span(t, n(3.8), n(7.6)));
        gas.color.copy(green).lerp(white, sm); gas.opacity = 0.08 + 0.22 * sm;
        wG.userData.update(t, 0.07, 0.66, 0.15, 1 - sm); wW.userData.update(t * 1.3, 0.07, 0.66, 0.15, 1.3 * sm);
        lP.position.copy(p).add(V(0.26, 0.08, 0.1)); K.popIn(lP, t, n(0.9), n(3.0));
        K.popIn(lCl, t, n(0.4), n(3.4)); K.popIn(lFire, t, n(4.2), n(7.4)); K.popIn(lFume, t, n(7.8), ND);
      });
    }

    // ================================================================ (dark) inside the fumes: PCl₃ and PCl₅ (count the chlorines); bromine does the same
    {
      stage((t) => t >= ND - 0.05 && t < C0); keyLight(PCX);
      const q = (k) => ND + k, Kk = 1.9;
      const pB = add(atomBall(['P'], 0.2), PCX, AY, 0);
      const cl = Array.from({ length: 5 }, () => add(atomBall(['Cl', 'Br'], 0.17)));
      const P3 = [[-0.2, -0.07], [0.2, -0.07], [0, 0.2]].map(([x, y]) => V(PCX + x * Kk, AY + y * Kk, 0.02));
      const P5 = [[0, 0.22], [-0.19, 0.1], [-0.115, -0.12], [0.115, -0.12], [0.19, 0.1]].map(([x, y]) => V(PCX + x * Kk, AY + (y - 0.04) * Kk, 0.02));
      const FROM = cl.map((_, k) => V(PCX + 2.2, AY + 0.5 - 0.25 * k, 0));
      const l3 = lbl('PCl₃: 3 chlorines (tri)', 0.24, '#f6d48f', PCX, AY - 0.82), l5 = lbl('PCl₅: 5 chlorines (penta)', 0.24, '#f6d48f', PCX, AY - 0.82), lBr = lbl('bromine: PBr₃ and PBr₅ ✓', 0.24, '#ffb09a', PCX, AY - 0.82);
      beats.push((t) => {
        if (!shown(pB.parent)) return;
        cl.forEach((b, k) => {
          const in3 = k < 3, t0 = in3 ? q(1.0 + 0.7 * k) : q(4.6 + 0.7 * (k - 3)), u = ease(span(t, t0, t0 + 1.0));
          const rest = in3 ? P3[k].clone().lerp(P5[[1, 4, 0][k]], ease(span(t, q(4.4), q(5.4)))) : P5[[2, 3][k - 3]];
          b.position.copy(K.arc(FROM[k], rest, 0.2, u)); b.visible = t > t0 - 0.05;
          const s0 = q(8.0 + 0.22 * k), sw = Math.sin(Math.PI * span(t, s0, s0 + 0.5));   // one by one: out, swap to bromine, back in
          b.scale.setScalar(Math.max(1e-4, 1 - sw)); b.userData.show(t > s0 + 0.25 ? 1 : 0);
        });
        K.popIn(l3, t, q(3.2), q(4.3)); K.popIn(l5, t, q(6.2), q(7.7)); K.popIn(lBr, t, q(9.2), C0);
      });
    }

    // ================================================================ COMPOUNDS bench · H₂S water + chlorine water → sulphur; chlorine gas into lime water
    {
      stage((t) => t >= C0 - 0.05 && t < D0 - 0.05); ST.bake(root, 'comp', CX - 0.06, 3.0, 1.1);
      const c = (k) => C0 + k, l = (k) => CL + k;
      add(K.beaker(0.15, 0.3), C1, 0, 0); const w1 = add(K.liquid(0.145, 0.2, 0xdff0ec, 0.32), C1, 0.052, 0);
      const SY = 0.252;
      const specks = Array.from({ length: 70 }, (_, i) => { const s = add(K.solid(new THREE.SphereGeometry(0.0035 + 0.003 * hash(i, 1), 6, 4), M.matte(0xf2d43a, 0.6), { outline: false })); s.userData = { a: i * 2.39996, r: 0.12 * Math.sqrt((i + 0.5) / 70), y: hash(i, 4), d: 0.5 + hash(i, 5) * 0.8 }; return s; });
      const layer = add(K.solid(new THREE.CylinderGeometry(0.13, 0.13, 1, 32).translate(0, 0.5, 0), M.matte(0xf0d040, 0.7), { outline: false }), C1, 0.056, 0);
      dropperRig(C1, 0.35, SY, c(1.4), [c(2.6), c(3.0), c(3.4)], c(11.6), 0xc8f0a0);
      // lime water · a jar of chlorine with a glass tube and a tap over the beaker
      add(K.beaker(0.15, 0.3), C2, 0, 0); const w2 = add(K.liquid(0.145, 0.2, 0xeef4f2, 0.38), C2, 0.052, 0);
      const powder = add(K.solid(new THREE.CylinderGeometry(0.13, 0.135, 1, 32).translate(0, 0.5, 0), new THREE.MeshPhysicalMaterial({ color: 0xf6f5f1, roughness: 0.8 }), { outline: false }), C2, 0.056, 0);
      const jar = add(K.gasJar(0x9ee030, 0.13, 0.5), CJ, 0, 0); jar.userData.gas.opacity = 0.08; jar.userData.lid.visible = false;
      const wJ = K.gasCloud(0x9ee030, 12); jar.add(wJ);
      const stop = add(K.solid(new THREE.CylinderGeometry(0.1, 0.09, 0.05, 32), M.matte(0x2c2f36, 0.6)), CJ, 0.535, 0);
      const path = new THREE.CatmullRomCurve3([V(CJ, 0.56, 0), V(CJ, 0.78, 0), V(CJ - 0.06, 0.84, 0), V(C2 + 0.06, 0.84, 0), V(C2, 0.78, 0), V(C2, 0.1, 0)]);
      const tube = add(new THREE.Mesh(new THREE.TubeGeometry(path, 80, 0.013, 12), M.glass())); tube.position.set(0, 0, 0); tube.renderOrder = 5;
      const TAP = path.getPoint(0.5), tap = add(new THREE.Group(), TAP.x, TAP.y, TAP.z);
      tap.add(K.solid(new THREE.CylinderGeometry(0.022, 0.022, 0.05, 16).rotateX(Math.PI / 2), M.metal(0x9aa0a8, 0.35)));
      const handle = K.solid(new THREE.BoxGeometry(0.012, 0.075, 0.012).translate(0, 0.035, 0), M.gloss(0xc0302a)); handle.position.z = 0.03; tap.add(handle);
      const flowW = Array.from({ length: 8 }, () => add(K.glowSprite(0xb4ec30, 0.07)));
      const bub = K.bubbles(26, V(C2, 0.1, 0), SY, 0.08, 0.012); root.add(bub);
      const lH = tag('hydrogen sulphide water', 0.045, '#ffffff', C1, 0.36, 0.24), lCw = tag('chlorine water', 0.045, '#d8f590', C1 + 0.24, 0.62, 0.02), lS = tag('sulphur forms ✓', 0.05, '#fff0a0', C1, 0.08, 0.24);
      const lL = tag('lime water', 0.045, '#ffffff', C2, 0.1, 0.24), lC = tag('chlorine', 0.045, '#d8f590', CJ, 0.25, 0.2), lTap = tag('tap open', 0.04, '#ffffff', TAP.x, TAP.y - 0.13, 0.05), lB = tag('bleaching powder forms ✓', 0.05, '#ffffff', C2 + 0.1, 0.1, 0.24);
      // its formula, built from the names on the things
      beats.push(K.equation(root, { slots: [['H₂S'], ['+'], ['Cl₂'], ['→'], ['2HCl'], ['+'], ['S']], y: 0.92, z: 0.05, x0: C1, h: 0.11, starts: [c(8.6)], end: CL - 0.05,
        src: (m, j) => (j === 0 ? { lab: lH, tIn: c(0.3), at: () => lH.position } : j === 2 ? { lab: lCw, tIn: c(1.8), at: () => lCw.position } : j === 6 ? { lab: lS, tIn: c(6.4), at: () => lS.position } : null) }));
      const milk = new THREE.Color(0xf4e48a), clear = new THREE.Color(0xdff0ec);
      beats.push((t) => {
        // sulphur: a fine yellow cloud grows where the drops land and settles to the floor
        const cl = ease(span(t, c(2.8), c(5.6))), st = ease(span(t, c(5.6), c(8.2)));
        specks.forEach((s, i) => { const u = s.userData; s.visible = t > c(2.7) + 0.02 * i && t < CL; const k = 0.3 + 0.7 * cl; const yy = lerp(SY - 0.02 - 0.15 * u.y * cl, 0.064 + 0.01 * u.y, Math.min(1, st * u.d)); s.position.set(C1 + Math.cos(u.a + t * 0.2) * (0.015 + u.r) * k, yy, Math.sin(u.a + t * 0.2) * (0.015 + u.r) * k); });
        w1.children.forEach((o) => o.material.color.copy(clear).lerp(milk, 0.7 * cl * (1 - 0.4 * st))); layer.scale.y = Math.max(1e-4, 0.01 * st); layer.visible = st > 0.01;
        // lime water: the tap turns, green gas runs along the tube, bubbles, white powder settles
        const op = ease(span(t, l(2.0), l(2.6))); handle.rotation.z = -Math.PI / 2 * op;
        const run = t > l(2.6) && t < l(8.4); flowW.forEach((s, i) => { const u = (((t - l(2.6)) * 0.55 + i / 8) % 1 + 1) % 1; s.position.copy(path.getPoint(u)); s.visible = run; s.material.opacity = 0.7 * Math.sin(Math.PI * u) * (1 - span(t, l(7.6), l(8.4))); });
        bub.visible = t > l(3.4) && t < l(9.0); bub.userData.update(t, ease(span(t, l(3.4), l(4.0))) * (1 - ease(span(t, l(8.0), l(9.0)))));
        wJ.userData.update(t, 0.07, 0.48, 0.11, 1 - 0.7 * ease(span(t, l(3.0), l(8.0))));
        const pw = ease(span(t, l(4.6), l(8.0))); powder.scale.y = Math.max(1e-4, 0.03 * pw); powder.visible = pw > 0.01; w2.children[0].material.color.set(0xeef4f2).lerp(new THREE.Color(0xf8f8f6), 0.6 * pw);
        K.popIn(lL, t, l(0.3), l(7.6)); K.popIn(lC, t, l(0.7), l(3.4)); K.popIn(lTap, t, l(2.2), l(4.6)); K.popIn(lB, t, l(8.0), D0);
      });
    }

    // ================================================================ DISPLACEMENT bench · two tubes: bromine pushed out, iodine pushed out
    {
      stage((t) => t >= D0 - 0.05 && t < DD - 0.05); ST.bake(root, 'disp', TX, 1.6, 1.0);
      const d = (k) => D0 + k, rack = add(K.tubeRack(2, 0.42, 0.058), TX, 0, 0);
      const tubes = [0, 1].map((i) => { const tb = add(K.testTube(0.058, 0.5), TX + rack.userData.x(i), 0.03, 0); const lq = tb.userData.fill(0xe6f2f2, 0.34, 0.3); return { tb, lq }; });
      const SURF = 0.03 + 0.34;
      dropperRig(TX - 0.21, 0.56, SURF, d(1.2), [d(2.4), d(2.8), d(3.2)], d(5.8), 0xc8f0a0);
      dropperRig(TX + 0.21, 0.56, SURF, d(10.4), [d(11.6), d(12.0), d(12.4)], d(13.6), 0xe08a3a);
      const orange = new THREE.Color(0xe07a20), brown = new THREE.Color(0x6a3010), clear = new THREE.Color(0xe6f2f2);
      const lNaBr = tag('sodium bromide', 0.045, '#ffffff', TX - 0.21, 0.08, 0.25), lCw = tag('chlorine water', 0.045, '#d8f590', TX - 0.54, 0.8, 0), lBrOut = tag('bromine pushed out ✓', 0.05, '#ffc890', TX - 0.21, 0.66, 0.05);
      const lKI = tag('potassium iodide', 0.045, '#ffffff', TX + 0.21, 0.08, 0.25), lBw = tag('bromine water', 0.045, '#ffc890', TX + 0.46, 0.8, 0), lIOut = tag('iodine pushed out ✓', 0.05, '#e0c0a0', TX + 0.21, 0.66, 0.05);
      beats.push(K.equation(root, { slots: [['2NaBr'], ['+'], ['Cl₂'], ['→'], ['2NaCl'], ['+'], ['Br₂']], y: 1.04, z: 0.05, x0: TX, h: 0.11, starts: [d(6.8)], end: d(10.0),
        src: (m, j) => (j === 0 ? { lab: lNaBr, tIn: d(0.3), at: () => lNaBr.position } : j === 2 ? { lab: lCw, tIn: d(1.6), at: () => lCw.position } : j === 6 ? { lab: lBrOut, tIn: d(5.2), at: () => lBrOut.position } : null) }));
      beats.push((t) => {
        const a = ease(span(t, d(2.7), d(5.0))), b = ease(span(t, d(11.9), d(14.2)));
        tubes[0].lq.userData.mat.color.copy(clear).lerp(orange, a); tubes[0].lq.userData.mat.opacity = 0.3 + 0.55 * a;
        tubes[1].lq.userData.mat.color.copy(clear).lerp(brown, b); tubes[1].lq.userData.mat.opacity = 0.3 + 0.6 * b;
        K.popIn(lKI, t, d(10.0), d(14.0)); K.popIn(lBw, t, d(10.8), d(14.4)); K.popIn(lIOut, t, d(14.4), d(16.8));
      });
    }

    // ================================================================ (dark) inside the orange water: Cl₂ pulls the electrons off two Br⁻ · the order
    {
      stage((t) => t >= DD - 0.05 && t < E0); keyLight(DMX); keyLight(ORX);
      const d = (k) => DD + k;
      const clA = [ball(0.15, 0x86d24e), ball(0.15, 0x86d24e)], clI = [K.ion(0.19, 0x86d24e, '−'), K.ion(0.19, 0x86d24e, '−')];
      clA.forEach((b, i) => add(b, DMX + (i ? 0.14 : -0.14), AY + 0.55, 0)); clI.forEach((o) => { add(o); o.visible = false; });
      const br = [K.ion(0.26, 0xa8452c, '−'), K.ion(0.26, 0xa8452c, '−')]; br.forEach((o, i) => add(o, DMX + (i ? 0.9 : -0.9), AY - 0.35, 0));
      const hops = [0, 1].map((i) => { const s = i ? 1 : -1; return hop(V(DMX + s * 0.9 + s * 0.17, AY - 0.12, 0.25), V(DMX + s * 0.14 + s * 0.1, AY + 0.62, 0.2), 0.3); });
      const lC = lbl('chlorine Cl₂', 0.28, '#d8f590', DMX, AY + 0.95, 0, 700), lB = lbl('bromide Br⁻', 0.28, '#ffb09a', DMX, AY - 0.95);
      const lPull = lbl('smaller: it pulls harder', 0.28, '#ffe08a', DMX, AY + 0.95), lBr2 = lbl('Br₂ pushed out ✓', 0.3, '#ffb09a', DMX, AY - 0.95);
      beats.push((t) => {
        if (!shown(lC.parent)) return;
        hops.forEach((h, i) => h(t, d(2.4 + 0.35 * i), d(3.8 + 0.35 * i)));
        const swap = t > d(4.3), apart = ease(span(t, d(4.3), d(5.3))), jn = ease(span(t, d(5.6), d(7.0)));
        clA.forEach((b) => { b.visible = !swap; });
        clI.forEach((o, i) => { o.visible = swap; o.position.set(DMX + (i ? 1 : -1) * lerp(0.14, 0.75, apart), AY + 0.55, 0); });
        br.forEach((o, i) => { o.userData.sign.visible = t < d(2.4 + 0.35 * i) + 1.2; o.position.set(DMX + (i ? 1 : -1) * lerp(0.9, 0.24, jn), AY - 0.35, 0); });
        K.popIn(lC, t, d(0.6), d(5.0)); K.popIn(lB, t, d(1.0), d(6.6)); lPull.visible = false; K.popIn(lBr2, t, d(7.0), DO);
      });
      // the order: five tiles, each pushes out the ones after it
      const tl = ['F', 'Cl', 'Br', 'I', 'At'].map((s, k) => { const o = K.tile(s, [0xe8dc6a, 0x86d24e, 0xa8452c, 0x7a52b0, 0x3a3d42][k], 0.62, 0.62, 0.12); add(o, ORX + (k - 2) * 0.95, AY, 0); o.visible = false; return o; });
      const gts = [0, 1, 2, 3].map((k) => lbl('>', 0.46, '#ffe08a', ORX + (k - 1.5) * 0.95, AY, 0.1, 700));
      const lO = lbl('each pushes out the ones after it', 0.34, '#ffe08a', ORX, AY + 0.72);
      beats.push((t) => {
        tl.forEach((o, k) => { const u = back(span(t, DO + 0.2 + k * 0.4, DO + 0.6 + k * 0.4)); o.visible = u > 0.01; o.scale.setScalar(Math.max(1e-4, u)); });
        gts.forEach((l, k) => K.popIn(l, t, DO + 0.5 + k * 0.4, 1e9)); lO.visible = false;
        tl.forEach((o, k) => { const hop = Math.sin(Math.PI * span(t, DO + 2.9 + 0.55 * k, DO + 3.4 + 0.55 * k)), hit = k ? Math.sin(Math.PI * span(t, DO + 3.15 + 0.55 * (k - 1), DO + 3.55 + 0.55 * (k - 1))) : 0; o.position.y = AY + 0.13 * hop; o.position.x = ORX + (k - 2) * 0.95 + 0.07 * hit; });
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'What do halogens react with?', dockTitle: 'Reacts with', intro: INTRO, ticks: TICKS,
      rows: [[0, 'bleach: chlorine takes the colour'], [1, 'hydrogen'], [1, 'oxygen'], [1, 'metals'], [1, 'non-metals'], [1, 'other compounds'], [1, 'each other: the stronger wins']],
      short: ['hydrogen', 'oxygen', 'metals', 'non-metals', 'compounds', 'each other'] }));
    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));
    beats.push(() => { const nar = Math.min(1, (cam.aspect / 1.5) ** 0.7); tags.forEach((l) => { if (l.visible) l.scale.multiplyScalar(cam.position.distanceTo(l.position) * 2 * TAN * l.userData.frac * nar / 0.1); }); });

    return (t, dt) => { for (const b of beats) b(t, dt); };
  },
};
