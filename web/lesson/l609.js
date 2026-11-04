// Lesson 609 · Making a Molar Solution (book p. 164 Activity 6.1: the preparation of 0.5000 M CuSO₄·5H₂O in seven steps;
// p. 154 Skill Development (1) a saturated NaCl solution, (2) 2 M NaOH: 20 g made up to 250 mL; 0.1 M NaCl: 5.85 g made up
// to 1000 mL). v1 as a code lesson (2026-11-04), replacing the old Blender film. SKILL.md §0 + §1 + §4.
// THE QUESTION: "How do we make exactly 0.5000 M copper sulphate?" → card, docked panel, seven ticks (the steps).
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a scale with a weighing beaker, a jar of blue copper sulphate crystals, a 1 dm³ volumetric flask
//         with a funnel, a wash bottle (jug) of water, a dropper, a stopper (named one at a time) · question → card.
//  1      "0.5000 mol × 249.6 g/mol = 124.8 g" · blue crystals onto the weighing beaker: the scale climbs to 124.8 g.
//  2      a little water into the beaker: the crystals dissolve, it turns blue · it is poured through the funnel.
//  3      the beaker is rinsed with more water, the rinse poured in too "every bit of solute goes in" · water until the
//         neck.
//  4      the stopper goes on, the flask is shaken.
//  5      the dropper adds water drop by drop until the bottom of the curve meets the 1 dm³ mark.
//  6      stopper on, the flask is turned over and back 10 times (counted).
//  7      "0.5000 mol in 1.000 dm³: 0.5000 M ✓".
//  SKILL  Skill Development: "2 M NaOH: 20 g made up to 250 mL · 0.1 M NaCl: 5.85 g made up to 1000 mL".
//  END    "Weigh, dissolve, rinse, fill to the mark, mix: an exact molar solution ✓".
// Game (🎮 Molarity Lab › Make it, docs/COVERAGE_U6.md): the steps in order, the Skill Development masses.
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U6.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
import * as U5 from './u5kit.js';
import * as U6 from './u6kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, JRX = HKX - 0.75, SCX = HKX - 0.45, FLX = HKX, WBX = HKX + 0.38, DRX = HKX + 0.62;

// ---------------------------------------------------------------- time
const T = { card: 9.6 };
const DOCK = T.card + 5.0;
const ST = [0, 6.4, 13.4, 20.4, 25.6, 31.6, 39.6, 44.4].map((d) => DOCK + 0.4 + d), END = ST[7] + 6.0;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = ST.slice(0, 7).map((s, i) => [ST[i + 1] - 0.4, i]);
const S = U4.shots(DOCK);

const NUM = ['1. weigh it', '2. dissolve, pour through the funnel', '3. rinse, pour in, water to the neck', '4. stopper, shake', '5. drop by drop to the mark', '6. turn it over 10 times', '7. done'];
const captions = [[7.2, T.card, 'How do we make exactly 0.5000 M copper sulphate?', [HKX, 0.62, 0.05]], [END + 0.4, T.done, 'Weigh, dissolve, rinse, fill to the mark, mix ✓', [HKX, 0.62, 0.05]]];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX - 0.05, 0.28, 0.05], 1.7 * k, 0.8 * k, ADIR, e);
const near = (t, p, w = 0.8, h = 0.65, e) => S(t, p, w, h, ADIR, e);
const P_W = [(JRX + SCX) / 2, 0.18, 0.05], P_F = [(SCX + FLX) / 2 + 0.05, 0.3, 0.05], P_FL = [FLX, 0.3, 0.05], P_NK = [FLX, 0.32, 0.05];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(ST[0], P_W, 0.6, 0.45), near(ST[1] - 0.05, P_W, 0.58, 0.44),
  near(ST[1], P_F, 0.75, 0.7), near(ST[3] - 0.05, P_F, 0.72, 0.68), near(ST[3], P_FL, 0.55, 0.7), near(ST[4] - 0.05, P_FL, 0.53, 0.68),
  near(ST[4], P_NK, 0.4, 0.36), near(ST[5] - 0.05, P_NK, 0.39, 0.35), near(ST[5], [FLX, 0.38, 0.05], 0.7, 0.85), near(ST[7] - 0.05, [FLX, 0.38, 0.05], 0.68, 0.82), HK(ST[7], 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '609', { dark: () => false, AY }), { beats, ST: STD, add, tag, grp, keyLight } = U;
    const BLUE = 0x1f5fd8;

    {
      STD.bake(U.root, 'hook', HKX - 0.05, 1.9, 0.8);
      const jar = add(new THREE.Group(), JRX, 0, 0); jar.add(K.reagentBottle(0, 0.2, 0.065, 'CuSO₄·5H₂O')); const cs = U6.crystalHeap(0.05, 50, 0x2f6ff0); cs.position.y = 0.015; jar.add(cs);
      const sc = add(U6.digitalScale(), SCX, 0, 0), top = sc.userData.top;
      const wb = add(new THREE.Group(), SCX, top + 0.002, 0); wb.add(K.beaker(0.055, 0.13)); const wl = K.liquid(0.05, 0.08, BLUE, 0.6); wl.position.y = 0.012; wb.add(wl); wl.visible = false;
      const wc = U6.crystalHeap(0.04, 40, 0x2f6ff0); wc.position.y = 0.014; wb.add(wc); wc.userData.set(0);
      const fl = add(U6.volFlask(0.095, BLUE), FLX, 0, 0);
      const fprof = [[0.015, 0], [0.015, 0.06], [0.07, 0.14], [0.076, 0.15], [0.07, 0.15], [0.009, 0.062], [0.009, 0]].map(([x, y]) => new THREE.Vector2(x, y));
      const fn = add(new THREE.Mesh(new THREE.LatheGeometry(fprof, 32), K.M.glass()), FLX, 0.33, 0); fn.renderOrder = 5;
      const jug = add(new THREE.Group(), WBX, 0, 0); jug.add(K.beaker(0.05, 0.15)); const jl = K.liquid(0.045, 0.11, 0x3d9ee6, 0.45); jl.position.y = 0.012; jug.add(jl);
      const dr = add(U5.dropper(0.14), DRX, 0.01, 0.06); dr.rotation.z = Math.PI / 2;
      const stp = add(K.solid(new THREE.CylinderGeometry(0.02, 0.016, 0.03, 20), K.M.glass()), DRX - 0.12, 0.015, 0.1);
      const drop = add(K.solid(new THREE.SphereGeometry(0.006, 10, 8), M.gloss(0x3d9ee6), { outline: false }));
      const st = add(U6.stream(0x3d9ee6)), stB = add(U6.stream(BLUE));
      const neck = V(FLX, 0.33 + 0.15, 0);
      const pW1 = U6.pourer(jug, V(WBX, 0, 0), null, V(SCX, top + 0.14, 0), V(-0.055, 0.15, 0), st, { dur: 1.0 });
      const pB1 = U6.pourer(wb, V(SCX, top + 0.002, 0), null, neck, V(0.055, 0.13, 0), stB, { dur: 1.4, side: -1 });
      const pW2 = U6.pourer(jug, V(WBX, 0, 0), null, V(SCX, top + 0.14, 0), V(-0.055, 0.15, 0), st, { dur: 0.7 });
      const pB2 = U6.pourer(wb, V(SCX, top + 0.002, 0), null, neck, V(0.055, 0.13, 0), stB, { dur: 0.8, side: -1 });
      const pW3 = U6.pourer(jug, V(WBX, 0, 0), null, neck, V(-0.055, 0.15, 0), st, { dur: 1.6 });
      const ls = [['copper sulphate crystals', '#9fc4ff', JRX, 0.28, 0.08], ['a scale, a weighing beaker', '#ffffff', SCX, 0.24, 0.12], ['a 1 dm³ flask and a funnel', '#ffffff', FLX, 0.56, 0.05], ['water', '#9fd2ff', WBX, 0.24, 0.08], ['a dropper, a stopper', '#ffffff', DRX - 0.06, 0.12, 0.15]].map(([s, c, x, y, z]) => tag(s, 0.04, c, x, y, z));
      const steps = NUM.map((s) => tag(s, 0.045, '#ffffff', 0, 0, 0)); const SP = [[...P_W], [...P_F], [...P_F], [...P_FL], [...P_NK], [...P_FL], [...P_FL]];
      const lM = [grp(tag('0.5000 mol × 249.6 g/mol', 0.042, '#ffd27a', P_W[0], 0.36, 0.08), 'm'), grp(tag('= 124.8 g', 0.048, '#ffd27a', P_W[0], 0.3, 0.08), 'm')];
      const lR = tag('every bit of solute goes in', 0.042, '#ffd27a', P_F[0], 0.62, 0.05), lMark = tag('the curve’s bottom on the mark', 0.036, '#ffd27a', FLX + 0.2, 0.26, 0.05);
      const lD = [grp(tag('0.5000 mol in 1.000 dm³:', 0.045, '#ffffff', FLX, 0.68, 0.05), 'd'), grp(tag('0.5000 M ✓', 0.055, '#ffd27a', FLX, 0.6, 0.05), 'd')];
      const lS = [grp(tag('Skill Development: 2 M NaOH: 20 g made up to 250 mL', 0.04, '#ffffff', HKX, 0.7, 0.05), 'sk'), grp(tag('0.1 M NaCl: 5.85 g made up to 1000 mL', 0.042, '#ffffff', HKX, 0.63, 0.05), 'sk')];
      const cnt = Array.from({ length: 10 }, (_, k) => tag(String(k + 1), 0.05, '#ffd27a', FLX + 0.2, 0.5, 0.05));
      beats.push((t) => {
        // 1 weigh: crystals scooped from the jar onto the weighing beaker; the reading climbs to 124.8 g
        const w = ease(span(t, ST[0] + 2.4, ST[0] + 5.4)); wc.userData.set(t < ST[1] + 2.6 ? w : 0); cs.userData.set(1 - 0.5 * w);
        let liq = 0;
        // 2 a little water dissolves it; poured through the funnel
        const a = t > ST[1] ? pW1(t, ST[1]) : 0; if (t > ST[1]) { wl.visible = a > 0.02 && t < ST[3]; liq = a; wc.userData.set(w * (1 - ease(span(t, ST[1] + 2.2, ST[1] + 3.6)))); }
        const b = t > ST[1] + 3.0 ? pB1(t, ST[1] + 3.0) : 0; if (b > 0) wl.scale.y = Math.max(1e-3, 1 - b);
        // 3 rinse: more water in the beaker, poured in; water to the neck
        const c = t > ST[2] ? pW2(t, ST[2]) : 0, d = t > ST[2] + 2.4 ? pB2(t, ST[2] + 2.4) : 0; if (t > ST[2] && t < ST[2] + 4.6) { wl.visible = true; wl.scale.y = Math.max(1e-3, 0.5 * c * (1 - d)); }
        const e = t > ST[2] + 4.0 ? pW3(t, ST[2] + 4.0) : 0;
        sc.userData.set((124.8 * w + (t > ST[1] + 1 ? 0 : 0)).toFixed(1) + ' g'); if (t > ST[1] + 3.0) sc.userData.set('0.0 g');
        // the flask's level: the first pour, the rinse, water to the neck, drop by drop to the mark
        const dd = ease(span(t, ST[4] + 1.0, ST[4] + 4.4));
        fl.userData.setLevel(0.25 * b + 0.05 * d + 0.62 * e + 0.08 * dd);
        // the funnel leaves after step 3; the stopper goes on for 4, off for 5, on for 6
        fn.visible = t < ST[3]; const on4 = ease(span(t, ST[3] + 0.2, ST[3] + 1.0)) * (1 - ease(span(t, ST[4] - 0.6, ST[4]))), on6 = ease(span(t, ST[5] + 0.2, ST[5] + 1.0));
        const sk = Math.max(on4, on6); stp.position.copy(V(DRX - 0.12, 0.015, 0.1)).lerp(V(FLX, 0.3315 + 0.012, 0), sk);
        // 4 shake, 6 turn over 10 times
        const shake = t > ST[3] + 1.2 && t < ST[4] - 0.8 ? 0.25 * Math.sin((t - ST[3]) * 14) : 0, inv = t > ST[5] + 1.2 && t < ST[6] - 0.6 ? Math.PI * (0.5 - 0.5 * Math.cos((t - ST[5] - 1.2) * Math.PI * 10 / (ST[6] - ST[5] - 1.8))) : 0;
        const lift = ease(span(t, ST[5] + 0.9, ST[5] + 1.3)) * (1 - ease(span(t, ST[6] - 0.6, ST[6] - 0.2))), ang = shake + inv, cy = 0.16, Cw = V(FLX, cy + 0.22 * lift + (shake ? 0.04 : 0), 0);   // held up and turned about its middle
        fl.rotation.z = ang; fl.position.set(Cw.x + cy * Math.sin(ang), Cw.y - cy * Math.cos(ang), 0);
        fl.updateMatrixWorld(); if (sk > 0.98) { stp.position.copy(fl.localToWorld(V(0, 0.3315 + 0.012, 0))); stp.rotation.z = fl.rotation.z; } else stp.rotation.z = 0;
        // 5 the dropper
        const dp = ease(span(t, ST[4] + 0.2, ST[4] + 0.9)) * (1 - ease(span(t, ST[4] + 4.8, ST[4] + 5.6))); dr.position.copy(V(DRX, 0.01, 0.06).lerp(V(FLX + 0.005, 0.37, 0), dp)); dr.rotation.z = lerp(Math.PI / 2, 0, dp);
        const ph = ((t - ST[4]) * 1.6) % 1; drop.visible = t > ST[4] + 1.0 && t < ST[4] + 4.4; drop.position.set(FLX + 0.005, lerp(0.365, 0.27, ph), 0);
        ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 1.3, 1.6 + i * 1.3));
        steps.forEach((l, i) => { l.position.set(SP[i][0], [0.36, 0.62, 0.62, 0.68, 0.48, 0.78, 0.78][i], 0.05); K.popIn(l, t, ST[i] + 0.1, i === 6 ? ST[i] + 1.4 : i === 0 ? ST[0] + 2.2 : ST[i] + 2.0); });
        lM.forEach((l) => K.popIn(l, t, ST[0] + 2.4, ST[1] - 0.1)); K.popIn(lR, t, ST[2] + 2.2, ST[2] + 4.0); K.popIn(lMark, t, ST[4] + 2.2, ST[5] - 0.1);
        cnt.forEach((l, k) => { const tk = ST[5] + 1.2 + (k + 0.5) * (ST[6] - ST[5] - 1.8) / 10; K.popIn(l, t, tk, tk + 0.5); });
        lD.forEach((l) => K.popIn(l, t, ST[6] + 1.6, ST[7])); lS.forEach((l) => K.popIn(l, t, ST[7] + 0.4, END));
      });
    }

    beats.push(K.checklist(scene, cam, { title: 'How do we make exactly 0.5000 M copper sulphate?', dockTitle: 'Activity 6.1', intro: INTRO, ticks: TICKS,
      rows: [[0, 'copper sulphate, a scale, a 1 dm³ flask, water'], [1, '1. weigh 124.8 g'], [1, '2. dissolve, pour in'], [1, '3. rinse, water to the neck'], [1, '4. stopper, shake'], [1, '5. drop by drop to the mark'], [1, '6. turn it over 10 times'], [1, '7. 0.5000 M']],
      short: ['weigh', 'dissolve', 'rinse', 'shake', 'to the mark', 'mix 10 ×', '0.5000 M'] }));
    return U.finish();
  },
};
