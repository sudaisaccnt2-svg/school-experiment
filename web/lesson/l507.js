// Lesson 507 · Vapour Pressure (book pp. 135–136: (iii) Vapour pressure, Fig. 5.11, evaporation ⇌ condensation, the
// equilibrium state, factors: not the amount or surface area; (a) nature (b) intermolecular forces (c) size of the
// molecules (d) temperature; Table 5.1 at 298 K). v1 as a code lesson (2026-11-04), replacing the old Blender film.
// THE QUESTION (book: "When a liquid is placed in a closed container …"): "Close the jar: does the water keep
//   disappearing?" → card, docked panel, five ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: an open jar of water on a hot plate (off), its lid beside it with a pressure gauge; a small jar
//         with a little water; four closed jars of chloroform, carbon tetrachloride, water, glycerol · the lid is put
//         on (the gauge reads 0) · the question → card → dive INTO the closed jar.
//  INSIDE (dark) molecules leave the surface (gold, upward); some of the vapour comes back (blue, downward) · soon as many
//         come back as leave "as many return as leave: equilibrium ✓ · liquid ↔ vapour" · the vapour hits the lid and
//         walls (sparks) "the vapour's push: vapour pressure ✓".
//  BENCH  the gauge has risen and stays · the small jar with a little water reads the same "less water, same reading:
//         amount and surface don't matter ✓".
//  TABLE  the four jars side by side: the needles read 170 · 87 · 18 · 0.00016 mm Hg (Table 5.1, 25 °C) "each liquid its
//         own: weaker forces, smaller molecules → more vapour ✓".
//  WARM   the hot plate under the first jar is switched on: the needle climbs "hotter → more vapour pressure ✓".
//  END    "Escape = return: the vapour's push is vapour pressure ✓".
// Game (🎮 Matter Practice › Words + Facts; 🎮 Why? Lab + State Sorter, docs/COVERAGE_U5.md): water < acetone, alcohol > water, pentane > decane, Table 5.1.
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U5.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
import * as U5 from './u5kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, MJX = HKX - 1.05, SJX = HKX - 0.62, TX = [HKX + 0.12, HKX + 0.45, HKX + 0.78, HKX + 1.11];
const JX = 40;

// ---------------------------------------------------------------- time
const T = { lid: 2.0, card: 9.6 };
const DOCK = T.card + 5.0;
const ID = DOCK + 3.4, EQ = ID + 6.4, PUSH = ID + 10.4, B1 = ID + 14.4, SM = B1 + 3.2, TB = B1 + 8.6, WM = TB + 9.4, END = WM + 8.4;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[EQ + 2.6, 0], [PUSH + 2.6, 1], [SM + 3.6, 2], [TB + 7.4, 3], [WM + 6.4, 4]];
const DARK = [[ID, B1]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);
const VP = { ch: 170 / 200, cc: 87 / 200, w: 18 / 200, gl: 0.002 };

const captions = [
  [6.6, T.card, 'Close the jar: does the water keep disappearing?', [MJX + 0.3, 0.72, 0.05]],
  [DOCK + 0.4, ID - 0.3, 'Look inside the closed jar', [MJX, 0.62, 0.05]],
  [TB + 0.3, TB + 2.6, 'Four liquids, four closed jars, 25 °C', [(TX[0] + TX[3]) / 2, 0.72, 0.05]],
  [WM + 0.3, WM + 2.6, 'Now warm the first jar', [MJX, 0.75, 0.05]],
  [END + 0.4, T.done, 'Escape = return: the vapour’s push is vapour pressure ✓', [HKX, 0.85, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX + 0.03, 0.32, 0.05], 2.7 * k, 0.9 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const P_MJ = [MJX, 0.32, 0.03], P_IN = [MJX, 0.24, 0.0], P_TB = [(TX[0] + TX[3]) / 2, 0.3, 0.05];
const near = (t, p, w = 0.8, h = 0.65, e) => S(t, p, w, h, ADIR, e);
const CAMS = [
  HK(0, 1.05), near(0.6, [(MJX + SJX) / 2, 0.3, 0.05], 0.8, 0.7), near(6.4, [(MJX + SJX) / 2, 0.3, 0.05], 0.77, 0.67), HK(6.6, 1.02), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02),
  near(DOCK + 1.8, P_MJ, 0.4, 0.4), DIVE(ID - 0.05, P_IN),
  DK(ID, JX, 2.4, 2.4, 0.3), DK(ID + 1.8, JX, 2.4, 2.4, 1.04, 'out'), DK(B1 - 0.05, JX, 2.4, 2.4, 0.97),
  S(B1, P_IN, 0.1, 0.08, ADIR, 'out'), near(B1 + 1.2, [(MJX + SJX) / 2, 0.32, 0.05], 0.85, 0.72), near(TB - 0.05, [(MJX + SJX) / 2, 0.32, 0.05], 0.82, 0.7),
  near(TB + 1.6, P_TB, 1.5, 0.8), near(WM - 0.05, P_TB, 1.45, 0.77), near(WM + 1.6, [MJX + 0.05, 0.44, 0.05], 0.7, 0.85), near(END - 0.05, [MJX + 0.05, 0.44, 0.05], 0.68, 0.82), HK(END + 0.4, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '507', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;

    // ================================================================ BENCH · closed jars with gauges, a hot plate
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', HKX + 0.03, 3.0, 0.8);
      const hp = add(K.hotPlate(), MJX, 0, 0), mj = add(U5.vpJar(0x3d9ee6, 0.085, 0.3, 0.45), MJX, 0.105, -0.01), sj = add(U5.vpJar(0x3d9ee6, 0.085, 0.3, 0.1), SJX, 0, 0);
      const heat = add(K.glowSprite(0xff5a2a, 0.26), MJX, 0.11, 0.0);
      const LIQ = [[0xe8f0d8, 0.45], [0xf2f2f8, 0.45], [0x3d9ee6, 0.45], [0xf0e6b8, 0.45]].map(([c, l], i) => add(U5.vpJar(c, 0.075, 0.27, l), TX[i], 0, 0));
      const lidHome = V(MJX - 0.06, 0.105 + 0.3 + 0.016, 0), lid0 = V(MJX + 0.22, 0.006, 0.12), lid = mj.userData.lid;
      const ls = [['a jar of water, its lid with a gauge', '#9fd2ff', MJX + 0.1, 0.72, 0.08]].map(([s, c, x, y, z]) => tag(s, 0.045, c, x, y, z));
      const lSm = [grp(tag('less water, same reading:', 0.045, '#ffd27a', (MJX + SJX) / 2, 0.74, 0.08), 'sm'), grp(tag('amount and surface don’t matter ✓', 0.045, '#ffd27a', (MJX + SJX) / 2, 0.67, 0.08), 'sm')];
      const NM = ['chloroform', 'CCl₄', 'water', 'glycerol'], RD = ['170 mm Hg', '87', '18', '0.00016'];
      const lN = NM.map((s, i) => grp(tag(s, 0.042, '#ffffff', TX[i], 0.08, 0.15), 'nm')), lR = RD.map((s, i) => grp(tag(s, 0.045, '#ffd27a', TX[i] - (i === 0 ? 0.04 : 0), 0.62, 0.08), 'rd'));
      const lT = [grp(tag('each liquid its own (Table 5.1)', 0.045, '#ffd27a', (TX[0] + TX[3]) / 2, 0.74, 0.08), 'tb'), grp(tag('weaker forces, smaller molecules: more ✓', 0.042, '#ffd27a', (TX[0] + TX[3]) / 2, 0.67, 0.08), 'tb')];
      const lW = tag('hotter → more vapour pressure ✓', 0.05, '#ffd27a', MJX + 0.1, 0.78, 0.08);
      beats.push((t) => {
        const on = ease(span(t, T.lid, T.lid + 1.2)); lid.position.copy(K.arc(lid0.clone().sub(V(MJX, 0.105, -0.01)), V(0, 0.316, 0), 0.25, on)); lid.rotation.y = 0;
        const rise = ease(span(t, ID, B1)), warm = ease(span(t, WM + 2.4, WM + 6.0)), onHp = ease(span(t, WM + 2.0, WM + 2.4));
        mj.userData.gauge.userData.set(VP.w * rise + 0.25 * warm); sj.userData.gauge.userData.set(VP.w * ease(span(t, SM, SM + 1.4)));
        [VP.ch, VP.cc, VP.w, VP.gl].forEach((p, i) => LIQ[i].userData.gauge.userData.set(p * ease(span(t, TB + 2.6 + 0.4 * i, TB + 4.0 + 0.4 * i))));
        hp.userData.on(onHp); heat.visible = onHp > 0.5; heat.material.opacity = 0.5 * onHp;
        mj.userData.cloud.update(t, 0.4 * span(t, T.lid, T.lid + 3) + 0.4 * warm); sj.userData.cloud.update(t, 0.3); LIQ.forEach((j, i) => j.userData.cloud.update(t, [0.7, 0.5, 0.25, 0.02][i]));
        ls.forEach((l) => K.popIn(l, t, 0.6, 3.6)); lSm.forEach((l) => K.popIn(l, t, SM + 1.6, TB - 0.1));
        lN.forEach((l) => K.popIn(l, t, TB + 0.2, TB + 2.6)); lR.forEach((l) => K.popIn(l, t, TB + 4.2, TB + 6.6)); lT.forEach((l) => K.popIn(l, t, TB + 6.8, WM - 0.1)); K.popIn(lW, t, WM + 4.4, END);
      });
    }

    // ================================================================ INSIDE (dark) · leave = return: equilibrium, the vapour pushes
    {
      U.stage((t) => t >= ID - 0.05 && t < B1 - 0.05); keyLight(JX);
      const W = 2.0, H = 2.0, D = 1.0, LH = 0.6, C = V(JX, AY, 0); add(U5.glassBox(W, H, D), C.x, C.y, C.z);
      const lidM = K.solid(new THREE.BoxGeometry(W + 0.06, 0.06, D + 0.06), M.matte(0x3a3f48, 0.5)); add(lidM, C.x, C.y + H / 2 + 0.035, C.z);
      const surf = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.02, D - 0.02), new THREE.MeshBasicMaterial({ color: 0x5aa8ff, transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide }));
      surf.rotation.x = -Math.PI / 2; add(surf, C.x, C.y - H / 2 + LH + 0.002, C.z);
      const liq = (i, ph) => V(-W / 2 + 0.14 + (i % 11) * (W - 0.28) / 10 + 0.06 * Math.sin(ph * 0.9 + i * 1.7), -H / 2 + 0.1 + Math.floor(i / 11) * 0.22 + 0.03 * Math.sin(ph * 1.3 + i), (U5.rnd(i, 3) - 0.5) * 0.6);
      const lw = U5.swarm(33, { r: 0.06, color: 0x59a8ff, w: W, h: H, d: D }); add(lw.g, C.x, C.y, C.z);
      const vap = U5.swarm(14, { r: 0.06, color: 0x9fc4ff, w: W, h: H - LH, d: D, speed: 0.9 }); add(vap.g, C.x, C.y, C.z);
      const up = U5.swarm(6, { r: 0.062, color: 0xffc04d, w: W, h: H, d: D }), dn = U5.swarm(6, { r: 0.062, color: 0x7fd0ff, w: W, h: H, d: D }); add(up.g, C.x, C.y, C.z); add(dn.g, C.x, C.y, C.z);
      const sparks = Array.from({ length: 14 }, () => add(K.glowSprite(0xffd27a, 0.14)));
      const VC = V(0, (-H / 2 + LH + H / 2) / 2, 0), vh = (H - LH) / 2;
      const cyc = 2.4, l1 = tag('molecules leave the surface…', 0.05, '#ffd27a', JX, AY - 1.15, 0.1), l2 = tag('…and some come back', 0.05, '#7fd0ff', JX, AY - 1.15, 0.1);
      const l3 = [grp(tag('as many return as leave: equilibrium ✓', 0.048, '#ffffff', JX, AY - 1.05, 0.1), 'eq'), grp(tag('liquid ↔ vapour', 0.05, '#ffd27a', JX, AY - 1.25, 0.1), 'eq')];
      const l4 = tag('the vapour’s push: vapour pressure ✓', 0.05, '#ffd27a', JX, AY - 1.15, 0.1);
      beats.push((t) => {
        const lt = t - ID, fill = span(t, ID, EQ);
        lw.place(lt, (i) => liq(i, lt));
        vap.place(lt, (i) => (i < 4 + 10 * fill ? vap.gas(i, lt, VC, W / 2, vh, D / 2) : V(0, -50, 0)));
        // leaving (gold, up) and coming back (blue, down), each on its own loop; returning starts once vapour has built up
        up.place(lt, (k) => { const ph = ((lt - 0.4 * k) % cyc + cyc) % cyc / cyc, x = -0.8 + 0.32 * k, s = V(x, -H / 2 + LH - 0.05, (k % 3 - 1) * 0.2); return ph < 0.6 ? s.clone().lerp(s.clone().setY(-H / 2 + LH + 0.6), ph / 0.6) : V(0, -50, 0); });
        dn.place(lt, (k) => { const on = t > ID + 2.4 + 0.5 * k; const ph = ((lt - 0.4 * k - 1.2) % cyc + cyc) % cyc / cyc, x = -0.65 + 0.32 * k, s = V(x, -H / 2 + LH + 0.6, (k % 3 - 1) * 0.2); return on && ph < 0.6 ? s.clone().lerp(s.clone().setY(-H / 2 + LH - 0.05), ph / 0.6) : V(0, -50, 0); });
        sparks.forEach((s, i) => { const p = vap.gas(i, lt, VC, W / 2, vh, D / 2), m = Math.min(W / 2 - Math.abs(p.x), (vh - Math.abs(p.y - VC.y)) + (p.y < VC.y ? 9 : 0), D / 2 - Math.abs(p.z)); s.visible = t > PUSH && i < 4 + 10 * fill && m < 0.08; s.position.copy(p).add(C); });
        K.popIn(l1, t, ID + 0.6, ID + 3.0); K.popIn(l2, t, ID + 3.2, EQ - 0.1); l3.forEach((l) => K.popIn(l, t, EQ + 0.2, PUSH - 0.1)); K.popIn(l4, t, PUSH + 0.4, B1);
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Close the jar: does the water keep disappearing?', dockTitle: 'Vapour pressure', intro: INTRO, ticks: TICKS,
      rows: [[0, 'closed jars with gauges, a hot plate'], [1, 'as many return as leave: equilibrium'], [1, 'the vapour’s push: vapour pressure'], [1, 'amount and surface don’t matter'], [1, 'each liquid its own (Table 5.1)'], [1, 'hotter → more vapour pressure']],
      short: ['equilibrium', 'vapour pressure', 'not the amount', 'Table 5.1', 'hotter → more'] }));
    return U.finish();
  },
};
