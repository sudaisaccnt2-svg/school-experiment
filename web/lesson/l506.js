// Lesson 506 · Liquids & Evaporation (book pp. 133–135: Liquid state, 5.3 Typical properties of liquids (i) volume and
// shape, (ii) evaporation, Fig. 5.10, cooling, factors (a) surface area (b) temperature (c) intermolecular forces).
// v1 as a code lesson (2026-11-04), replacing the old Blender film. SKILL.md §0 + §1 + §4.
// THE QUESTION (book: "the phenomenon in which a liquid is converted into its vapours without external heating is
//   called evaporation"): "Water left in a dish slowly disappears. How?" → card, docked panel, six ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: the same water in a tall glass and in a wide dish "it takes each shape, keeps its volume ✓"
//         (liquid state); more dishes stand ready (one on a hot plate, one of alcohol) · the question → card → dive
//         INTO the wide dish.
//  INSIDE (dark) the water's molecules close together, sliding; now and then one at the surface, moving fastest (gold),
//         breaks free and flies off "the fastest break free at the surface: evaporation ✓" · "no heating needed: at
//         any temperature" · the ones left move slower and turn deeper blue "the rest are slower: it cools ✓".
//  SURFACE glass vs dish, "a few hours later": the dish has lost more "bigger surface: faster ✓".
//  WARM   two dishes, one on a hot plate that is switched on; later the warm one has lost more "warmer: faster ✓".
//  FORCES water vs alcohol; later the alcohol is almost gone "alcohol: weaker forces, faster ✓ · water holds on harder".
//  END    "The fastest molecules escape: liquids evaporate ✓".
// Game (🎮 Matter Practice › Words + Facts; 🎮 Why? Lab + State Sorter, docs/COVERAGE_U5.md): the definitions, the three factors as sorting rounds.
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U5.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
import * as U5 from './u5kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, GLX = HKX - 1.3, D1X = HKX - 0.98, D2X = HKX - 0.3, HPX = HKX + 0.04, W3X = HKX + 0.72, A3X = HKX + 1.05;
const LX = 40;

// ---------------------------------------------------------------- time
const T = { card: 10.0 };
const DOCK = T.card + 5.0;
const ID = DOCK + 3.4, ESC = ID + 3.0, COOL = ID + 10.8, B1 = ID + 15.4, TP = B1 + 8.6, FP = TP + 8.8, END = FP + 8.8;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[DOCK + 0.8, 0], [ESC + 3.6, 1], [COOL + 2.8, 2], [B1 + 7.0, 3], [TP + 7.2, 4], [FP + 7.4, 5]];
const DARK = [[ID, B1]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [6.8, T.card, 'Water left in a dish slowly disappears. How?', [HKX - 0.2, 0.7, 0.05]],
  [DOCK + 1.2, ID - 0.3, 'Look into the water', [D1X, 0.3, 0.05]],
  [B1 + 0.3, B1 + 2.8, 'Which dries faster: the glass or the dish?', [(GLX + D1X) / 2, 0.5, 0.05]],
  [TP + 0.3, TP + 2.4, 'Now warm one of the dishes', [(D2X + HPX) / 2, 0.5, 0.05]],
  [FP + 0.3, FP + 2.6, 'Water or alcohol: which goes first?', [(W3X + A3X) / 2, 0.5, 0.05]],
  [END + 0.4, T.done, 'The fastest molecules escape: liquids evaporate ✓', [HKX - 0.1, 0.7, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX - 0.12, 0.3, 0.05], 2.8 * k, 0.9 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const P_D1 = [D1X, 0.03, 0.02];
const pairShot = (t, a, b, k = 1) => S(t, [(a + b) / 2, 0.15, 0.05], 0.9 * k, 0.55 * k, ADIR);
const CAMS = [
  HK(0, 1.05), S(0.3, [(GLX + D1X) / 2, 0.28, 0.05], 1.1, 0.8), S(6.6, [(GLX + D1X) / 2, 0.28, 0.05], 1.06, 0.77), HK(6.9, 1.02), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), S(DOCK + 1.8, P_D1, 0.5, 0.4), DIVE(ID - 0.05, P_D1),
  DK(ID, LX, 3.4, 2.2, 0.3), DK(ID + 1.8, LX, 3.4, 2.2, 1.04, 'out'), DK(B1 - 0.05, LX, 3.4, 2.2, 0.97),
  S(B1, P_D1, 0.1, 0.08, ADIR, 'out'), pairShot(B1 + 1.2, GLX, D1X), pairShot(TP - 0.05, GLX, D1X, 0.97),
  pairShot(TP + 1.6, D2X, HPX), pairShot(FP - 0.05, D2X, HPX, 0.97), pairShot(FP + 1.6, W3X, A3X), pairShot(END - 0.05, W3X, A3X, 0.97), HK(END + 0.4, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '506', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;

    // ================================================================ BENCH · a glass and dishes of water, a hot plate, a dish of alcohol
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', HKX - 0.12, 3.0, 0.8);
      add(K.labBeaker(0.06, 0.28), GLX, 0, 0); const gl = add(K.liquid(0.055, 0.2, 0x3d9ee6, 0.55), GLX, 0.052, 0);
      const dish = (x, y = 0, c = 0x3d9ee6, op = 0.6) => { add(K.dish(0.13), x, y, 0); return add(U5.dishWater(0.13, c, op), x, y, 0); };
      const d1 = dish(D1X), d2 = dish(D2X), hp = add(K.hotPlate(), HPX, 0, 0), d2w = dish(HPX, 0.105), d3 = dish(W3X), a3 = dish(A3X, 0, 0xe8f0f8, 0.4);
      const vap = (x, y) => { const v = add(K.gasCloud(0xffffff, 8), x, y + 0.02, 0); return v; };
      const V1 = vap(GLX, 0.25), V2 = vap(D1X, 0.02), V3 = vap(D2X, 0.02), V4 = vap(HPX, 0.125), V5 = vap(W3X, 0.02), V6 = vap(A3X, 0.02);
      const heat = add(K.glowSprite(0xff5a2a, 0.28), HPX, 0.11, 0.0);
      const ls = [grp(tag('the same water in a tall glass', 0.045, '#9fd2ff', (GLX + D1X) / 2, 0.64, 0.1), 'h1'), grp(tag('and in a wide dish', 0.045, '#9fd2ff', (GLX + D1X) / 2, 0.56, 0.1), 'h1')];
      const lS = [grp(tag('it takes each shape,', 0.05, '#ffd27a', (GLX + D1X) / 2, 0.64, 0.1), 'h2'), grp(tag('keeps its volume ✓', 0.05, '#ffd27a', (GLX + D1X) / 2, 0.56, 0.1), 'h2')];
      const later = (x, t0, y = 0.36) => ({ l: tag('a few hours later', 0.05, '#ffffff', x, y, 0.1), t0 });
      const L1 = later((GLX + D1X) / 2, B1 + 3.0, 0.47), L2 = later((D2X + HPX) / 2, TP + 3.2), L3 = later((W3X + A3X) / 2, FP + 2.8);
      const r1 = tag('bigger surface: faster ✓', 0.05, '#ffd27a', (GLX + D1X) / 2, 0.47, 0.1), r2 = tag('warmer: faster ✓', 0.055, '#ffd27a', (D2X + HPX) / 2, 0.36, 0.1);
      const r3 = [grp(tag('alcohol: weaker forces, faster ✓', 0.045, '#ffd27a', (W3X + A3X) / 2, 0.4, 0.1), 'r3'), grp(tag('water holds on harder', 0.045, '#9fd2ff', (W3X + A3X) / 2, 0.33, 0.1), 'r3')];
      const n3 = [grp(tag('water', 0.045, '#9fd2ff', W3X, 0.13, 0.15), 'n3'), grp(tag('alcohol', 0.045, '#ffffff', A3X, 0.13, 0.15), 'n3')];
      beats.push((t) => {
        const s1 = ease(span(t, B1 + 3.0, B1 + 5.0)), s2 = ease(span(t, TP + 3.2, TP + 5.2)), s3 = ease(span(t, FP + 2.8, FP + 4.8)), on = ease(span(t, TP + 2.4, TP + 2.8));
        gl.userData.top.position.y = 0.2 - 0.02 * s1; gl.scale.y = 1 - 0.1 * s1; d1.userData.set(1 - 0.85 * s1); d2.userData.set(1 - 0.2 * s2); d2w.userData.set(1 - 0.9 * s2);
        d3.userData.set(1 - 0.15 * s3); a3.userData.set(1 - 0.95 * s3); hp.userData.on(on); heat.visible = on > 0.5; heat.material.opacity = 0.5 * on;
        V1.userData.update(t, 0, 0.12, 0.04, 0.12 * span(t, B1 + 2.8, B1 + 3.2) * (1 - span(t, B1 + 5, B1 + 5.4)));
        V2.userData.update(t, 0, 0.16, 0.1, 0.5 * span(t, B1 + 2.8, B1 + 3.2) * (1 - span(t, B1 + 5, B1 + 5.4)));
        V3.userData.update(t, 0, 0.16, 0.1, 0.25 * span(t, TP + 3.0, TP + 3.4) * (1 - span(t, TP + 5.2, TP + 5.6)));
        V4.userData.update(t, 0, 0.2, 0.1, 0.7 * span(t, TP + 3.0, TP + 3.4) * (1 - span(t, TP + 5.2, TP + 5.6)));
        V5.userData.update(t, 0, 0.16, 0.1, 0.2 * span(t, FP + 2.6, FP + 3.0) * (1 - span(t, FP + 4.8, FP + 5.2)));
        V6.userData.update(t, 0, 0.2, 0.1, 0.75 * span(t, FP + 2.6, FP + 3.0) * (1 - span(t, FP + 4.8, FP + 5.2)));
        ls.forEach((l) => K.popIn(l, t, 0.6, 3.4)); lS.forEach((l) => K.popIn(l, t, 3.6, 6.6));
        [L1, L2, L3].forEach(({ l, t0 }) => K.popIn(l, t, t0, t0 + 2.0));
        K.popIn(r1, t, B1 + 5.2, TP - 0.1); K.popIn(r2, t, TP + 5.4, FP - 0.1); n3.forEach((l) => K.popIn(l, t, FP + 0.2, FP + 2.6)); r3.forEach((l) => K.popIn(l, t, FP + 5.0, END));
      });
    }

    // ================================================================ INSIDE (dark) · the fastest molecules break free at the surface
    {
      U.stage((t) => t >= ID - 0.05 && t < B1 - 0.05); keyLight(LX);
      const W = 3.0, H = 1.8, D = 1.0, LH = 0.8, C = V(LX, AY, 0);
      add(U5.glassBox(W, H, D), C.x, C.y, C.z);
      const surf = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.02, D - 0.02), new THREE.MeshBasicMaterial({ color: 0x5aa8ff, transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide }));
      surf.rotation.x = -Math.PI / 2; add(surf, C.x, C.y - H / 2 + LH + 0.002, C.z);
      const N = 48, sw = U5.swarm(N, { r: 0.06, color: 0x59a8ff, w: W, h: LH, d: D, gap: 0.2 }); add(sw.g, C.x, C.y - H / 2 + LH / 2, C.z);
      const liq = (i, ph) => V(-W / 2 + 0.15 + (i % 16) * (W - 0.3) / 15 + 0.07 * Math.sin(ph * 0.9 + i * 1.7), -LH / 2 + 0.1 + Math.floor(i / 16) * 0.25 + 0.03 * Math.sin(ph * 1.3 + i), (U5.rnd(i, 3) - 0.5) * 0.6 + 0.07 * Math.cos(ph * 0.8 + i * 2.3));
      const esc = [33, 37, 41, 45, 35, 43], gold = U5.swarm(esc.length, { r: 0.062, color: 0xffc04d, w: W, h: H, d: D }); add(gold.g, C.x, C.y, C.z);
      const phase = (t) => { const a = t - ID, r0 = COOL - ID, r1 = COOL + 2.0 - ID; return a < r0 ? a : a < r1 ? a - 0.5 * (a - r0) ** 2 / (2 * (r1 - r0)) * 2 * 0.5 : r0 + (r1 - r0) * 0.75 + 0.5 * (a - r1); };
      const deep = new THREE.Color(0x2f62c8), base = new THREE.Color(0x59a8ff);
      const l1 = [grp(tag('the fastest break free', 0.05, '#ffd27a', LX, AY - 1.0, 0.1), 'ev'), grp(tag('at the surface: evaporation ✓', 0.05, '#ffd27a', LX, AY - 1.2, 0.1), 'ev')];
      const l2 = tag('no heating needed: at any temperature', 0.05, '#ffffff', LX, AY - 1.12, 0.1);
      const l3 = [grp(tag('the fast ones left:', 0.05, '#9fc4ff', LX, AY - 1.0, 0.1), 'cl'), grp(tag('the rest are slower, it cools ✓', 0.05, '#9fc4ff', LX, AY - 1.2, 0.1), 'cl')];
      beats.push((t) => {
        const ph = phase(t);
        sw.place(ph, (i) => (esc.includes(i) ? V(0, -50, 0) : liq(i, ph)));
        gold.place(t, (k) => {
          const i = esc[k], t0 = ESC + 1.2 * k, home = liq(i, t - ID).add(V(0, -H / 2 + LH / 2, 0));
          if (t < t0) return home;
          const u = span(t, t0, t0 + 1.6), top = home.clone().setY(-H / 2 + LH + 0.05), out = home.clone().add(V((k % 2 ? 0.4 : -0.4), 0, 0)).setY(H / 2 + 0.8);
          return u < 0.3 ? home.lerp(top, u / 0.3) : top.lerp(out, (u - 0.3) / 0.7);
        });
        sw.mesh.material.color.copy(base).lerp(deep, ease(span(t, COOL, COOL + 2.0))); sw.mesh.material.emissive.copy(sw.mesh.material.color);
        l1.forEach((l) => K.popIn(l, t, ESC + 0.6, ID + 7.8)); K.popIn(l2, t, ID + 8.0, COOL - 0.1); l3.forEach((l) => K.popIn(l, t, COOL + 0.6, B1));
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Water left in a dish slowly disappears. How?', dockTitle: 'Evaporation', intro: INTRO, ticks: TICKS,
      rows: [[0, 'a glass and dishes of water, alcohol'], [1, 'a liquid: fixed volume, takes the shape'], [1, 'the fastest escape: evaporation'], [1, 'evaporation cools the liquid'], [1, 'bigger surface → faster'], [1, 'warmer → faster'], [1, 'weaker forces → faster (alcohol)']],
      short: ['fixed volume', 'evaporation', 'it cools', 'bigger surface', 'warmer', 'weaker forces'] }));
    return U.finish();
  },
};
