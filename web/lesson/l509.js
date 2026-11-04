// Lesson 509 · Liquids: Spreading, Flowing, Density (book pp. 139–140: vi Diffusion in liquids, Fig. 5.14 ink in water,
// slower than in gases, faster when warmer; vii Mobility (fluidity rises with temperature); viii Density, Table 5.3;
// Activity 5.3 liquid bromine). v1 as a code lesson (2026-11-04), replacing the old Blender film. SKILL.md §0 §1 §4.
// THE QUESTION (book: "if you drop little bit of ink into glass of water, the ink will spread slowly"): "Does ink spread
//   in water like perfume in air?" → card, docked panel, six ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a flask of cold water with a dropper of ink, a flask of warm water, cold and warm cooking oil
//         with steel balls above them, a cylinder of water with oil on top, a jar with a little liquid bromine.
//  INK    a drop falls in; a blue cloud spreads, slowly "it spreads, slowly" · "a few minutes later: evenly blue:
//         diffusion ✓" (Fig. 5.14 a, b, c) · "Why so slow?" → dive INTO the ink.
//  INSIDE (dark) two boxes side by side: ink in air (far apart, spreads in a moment) · ink in water (molecules packed,
//         every step a bump) "in water: close together, bumping: slower ✓".
//  WARM   the same drop into the warm flask: the cloud fills it quickly "warm water: faster ✓".
//  FLOW   steel balls are let go into cold and warm oil: the warm one reaches the bottom first "warmer: it flows more
//         easily (mobility) ✓".
//  DENSITY the cylinder: oil floats on water "olive oil 0.918 · water 1.00 g/cm³" "the less dense floats (Table 5.3) ·
//         liquids: fixed volume, much denser than gases ✓".
//  ACT 5.3 the bromine jar: its brown vapour climbs and fills the jar "its brown vapour spreads ✓".
//  END    "Liquids spread too, just more slowly ✓".
// Game (🎮 Matter Practice › Words + Facts; 🎮 State Sorter + Why? Lab, docs/COVERAGE_U5.md): Table 5.3 (seven densities), the kinetic theory sentence.
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U5.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
import * as U5 from './u5kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, F1X = HKX - 1.12, F2X = HKX - 0.7, O1X = HKX - 0.2, O2X = HKX + 0.16, CYX = HKX + 0.62, BJX = HKX + 1.05;
const DX = 40;

// ---------------------------------------------------------------- time
const T = { card: 10.8 };
const DOCK = T.card + 5.0;
const I0 = DOCK + 0.4, ID = I0 + 14.0, B1 = ID + 10.0, W0 = B1, MO = W0 + 10.4, DE = MO + 10.8, AC = DE + 7.8, END = AC + 10.4;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[I0 + 11.0, 0], [ID + 8.0, 1], [W0 + 9.0, 2], [MO + 9.2, 3], [DE + 6.4, 4], [AC + 9.0, 5]];
const DARK = [[ID, B1]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [8.0, T.card, 'Does ink spread in water like perfume in air?', [HKX, 0.8, 0.05]],
  [I0 + 12.2, ID - 0.3, 'Why so slow?', [F1X, 0.5, 0.05]],
  [W0 + 0.3, W0 + 2.2, 'Now a drop in warm water', [F2X, 0.5, 0.05]],
  [MO + 0.3, MO + 2.4, 'Steel balls into cold and warm oil', [(O1X + O2X) / 2, 0.62, 0.05]],
  [AC + 0.3, AC + 2.2, 'Activity 5.3: a little liquid bromine', [BJX, 0.62, 0.05]],
  [END + 0.4, T.done, 'Liquids spread too, just more slowly ✓', [HKX, 0.8, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX - 0.03, 0.3, 0.05], 2.7 * k, 0.9 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const near = (t, p, w = 0.8, h = 0.65, e) => S(t, p, w, h, ADIR, e);
const P_F1 = [F1X, 0.2, 0.05], P_F2 = [F2X, 0.2, 0.05], P_O = [(O1X + O2X) / 2, 0.28, 0.05], P_CY = [CYX, 0.22, 0.05], P_BJ = [BJX, 0.25, 0.05];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(I0 + 0.4, P_F1, 0.55, 0.55), near(I0 + 12.0, P_F1, 0.53, 0.53), near(I0 + 13.2, [F1X, 0.1, 0.0], 0.2, 0.18), DIVE(ID - 0.05, [F1X, 0.1, 0.0]),
  DK(ID, DX, 4.2, 2.2, 0.3), DK(ID + 1.8, DX, 4.2, 2.2, 1.04, 'out'), DK(B1 - 0.05, DX, 4.2, 2.2, 0.97),
  S(B1, [F1X, 0.1, 0.0], 0.1, 0.08, ADIR, 'out'), near(W0 + 1.6, P_F2, 0.55, 0.55), near(MO - 0.05, P_F2, 0.53, 0.53),
  near(MO + 1.4, P_O, 0.75, 0.72), near(DE - 0.05, P_O, 0.72, 0.7), near(DE + 1.2, P_CY, 0.5, 0.55), near(AC - 0.05, P_CY, 0.48, 0.53),
  near(AC + 1.2, P_BJ, 0.55, 0.6), near(END - 0.05, P_BJ, 0.53, 0.58), HK(END + 0.4, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '509', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;

    // ================================================================ BENCH
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', HKX - 0.03, 2.9, 0.8);
      const fl1 = add(U5.conicalFlask(), F1X, 0, 0), fl2 = add(U5.conicalFlask(), F2X, 0, 0), top = fl1.userData.top;
      const d1 = add(U5.dropper(), F1X, 0.34, 0), d2 = add(U5.dropper(), F2X + 0.2, 0.0, 0.05); d2.rotation.z = Math.PI / 2 - 0.2; d2.position.y = 0.02;
      const steam = add(K.smoke(6, 0xffffff), F2X, 0.28, 0); steam.scale.setScalar(0.08);
      const ink = (x) => { const c = add(K.gasCloud(0x1f3fa8, 14), x, 0.014, 0); return c; }, c1 = ink(F1X), c2 = ink(F2X);
      const drop = add(K.solid(new THREE.SphereGeometry(0.008, 12, 8), M.gloss(0x1f3fa8), { outline: false }));
      const oilM = new THREE.MeshPhysicalMaterial({ color: 0xd8a640, transparent: true, opacity: 0.55, roughness: 0.05, clearcoat: 1, depthWrite: false });
      const oil = (x) => { add(K.labBeaker(0.06, 0.34), x, 0, 0); const o = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.28, 32), oilM); o.position.set(x, 0.012 + 0.14, 0); o.renderOrder = 4; U.root.add(o); return add(K.solid(new THREE.SphereGeometry(0.014, 16, 12), M.metal(0xc8ccd2, 0.25)), x, 0.38, 0); };
      const b1 = oil(O1X), b2 = oil(O2X), st2 = add(K.smoke(6, 0xffffff), O2X, 0.36, 0); st2.scale.setScalar(0.07);
      add(K.labBeaker(0.06, 0.32), CYX, 0, 0); const wtr = add(K.liquid(0.055, 0.16, 0x3d9ee6, 0.55), CYX, 0.012, 0);
      const olv = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.07, 32), oilM); olv.position.set(CYX, 0.012 + 0.16 + 0.003 + 0.035, 0); olv.renderOrder = 4; U.root.add(olv);
      const bj = add(K.gasJar(0xa8452c, 0.1, 0.34), BJX, 0, 0); bj.userData.gas.opacity = 0; bj.children[1].visible = false;
      const brl = add(K.solid(new THREE.CylinderGeometry(0.07, 0.07, 0.012, 24), new THREE.MeshPhysicalMaterial({ color: 0x7a1e10, roughness: 0.1, clearcoat: 1 }), { outline: false }), BJX, 0.036, 0);
      const brv = K.gasCloud(0xb0502c, 14); bj.add(brv);
      const ls = [['cold water, a drop of ink', '#9fd2ff', F1X + 0.05, 0.5, 0.08], ['warm water', '#ffb0a0', F2X, 0.42, 0.08], ['cold and warm cooking oil', '#ffd890', (O1X + O2X) / 2, 0.56, 0.08], ['oil on water', '#ffffff', CYX, 0.44, 0.08], ['a little liquid bromine', '#e0a080', BJX, 0.5, 0.08]]
        .map(([s, c, x, y, z]) => tag(s, 0.045, c, x, y, z));
      const lS = tag('it spreads, slowly', 0.05, '#9fd2ff', F1X, 0.44, 0.08), lE = [grp(tag('a few minutes later: evenly blue', 0.045, '#ffffff', F1X, 0.48, 0.08), 'ev'), grp(tag('diffusion ✓', 0.055, '#ffd27a', F1X, 0.41, 0.08), 'ev')];
      const lW = tag('warm water: faster ✓', 0.055, '#ffd27a', F2X, 0.44, 0.08);
      const lM = [grp(tag('warmer: it flows more easily', 0.045, '#ffd27a', (O1X + O2X) / 2, 0.6, 0.08), 'mb'), grp(tag('(mobility) ✓', 0.05, '#ffd27a', (O1X + O2X) / 2, 0.53, 0.08), 'mb')];
      const lD1 = [grp(tag('olive oil 0.918', 0.045, '#ffd890', CYX, 0.46, 0.08), 'd1'), grp(tag('water 1.00 g/cm³', 0.045, '#9fd2ff', CYX, 0.4, 0.08), 'd1')];
      const lD2 = [grp(tag('the less dense floats (Table 5.3)', 0.045, '#ffd27a', CYX, 0.46, 0.08), 'd2'), grp(tag('liquids: fixed volume, denser than gases ✓', 0.042, '#ffd27a', CYX, 0.4, 0.08), 'd2')];
      const lB = tag('its brown vapour spreads ✓', 0.05, '#e0a080', BJX, 0.5, 0.08);
      beats.push((t) => {
        // the cold drop: from the dropper's tip to the water, then the blue cloud grows, slowly
        const D0 = I0 + 1.0, D1 = D0 + 0.6, W1 = W0 + 2.4, W2 = W1 + 0.6;
        let dp = null; if (t > D0 && t < D1) dp = V(F1X, lerp(0.34, top, easeIn(span(t, D0, D1))), 0); if (t > W1 && t < W2) dp = V(F2X, lerp(0.34, top, easeIn(span(t, W1, W2))), 0);
        drop.visible = !!dp; if (dp) drop.position.copy(dp);
        const pick = ease(span(t, W0 + 0.4, W0 + 1.8)); d2.position.copy(K.arc(V(F2X + 0.2, 0.02, 0.05), V(F2X, 0.34, 0), 0.12, pick)); d2.rotation.z = lerp(Math.PI / 2 - 0.2, 0, pick);   // picked up and held over the warm flask
        d1.position.y = 0.34 + 0.3 * ease(span(t, I0 + 2.0, I0 + 3.0)); d1.visible = t < I0 + 3.0;   // lifted away after the drop
        const s1 = span(t, D1, D1 + 10), s2 = span(t, W2, W2 + 3.2);
        c1.userData.update(t, lerp(top - 0.03, 0.02, s1), top - 0.01, lerp(0.015, 0.075, Math.sqrt(s1)), t > D1 ? 0.9 : 0);
        c2.userData.update(t, lerp(top - 0.03, 0.02, s2), top - 0.01, lerp(0.015, 0.075, Math.sqrt(s2)), t > W2 ? 0.9 : 0);
        steam.userData.update(t, 0.4); st2.userData.update(t, 0.35);
        const fall = (t0, v) => Math.max(0.02 + 0.014, 0.38 - v * Math.max(0, t - t0)); b1.position.y = fall(MO + 2.6, 0.04); b2.position.y = fall(MO + 2.6, 0.16);
        brv.userData.update(t, 0.05, lerp(0.08, 0.32, ease(span(t, AC + 2.4, AC + 8))), 0.08, 0.3 + 0.6 * span(t, AC + 2.4, AC + 4)); bj.userData.gas.opacity = 0.12 * span(t, AC + 3, AC + 8);
        ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 1.5, 1.8 + i * 1.5));
        K.popIn(lS, t, I0 + 3.0, I0 + 8.8); lE.forEach((l) => K.popIn(l, t, I0 + 9.0, I0 + 12.0)); K.popIn(lW, t, W0 + 7.2, MO - 0.1);
        lM.forEach((l) => K.popIn(l, t, MO + 6.0, DE - 0.1)); lD1.forEach((l) => K.popIn(l, t, DE + 0.4, DE + 3.6)); lD2.forEach((l) => K.popIn(l, t, DE + 3.8, AC - 0.1)); K.popIn(lB, t, AC + 7.0, END);
      });
    }

    // ================================================================ INSIDE (dark) · ink in air vs ink in water
    {
      U.stage((t) => t >= ID - 0.05 && t < B1 - 0.05); keyLight(DX);
      const W = 1.7, H = 1.6, D = 0.9, LX = DX - 1.0, RX = DX + 1.0;
      add(U5.glassBox(W, H, D), LX, AY, 0); add(U5.glassBox(W, H, D), RX, AY, 0);
      const air = U5.swarm(16, { r: 0.05, color: 0x7d8fb0, w: W, h: H, d: D, speed: 1.0, glow: 0.2 }); add(air.g, LX, AY, 0);
      const inkA = U5.swarm(10, { r: 0.065, color: 0x3b5fd8, w: W, h: H, d: D, speed: 1.0 }); add(inkA.g, LX, AY, 0);
      const wat = U5.swarm(60, { r: 0.07, color: 0x59a8ff, w: W, h: H, d: D, glow: 0.2 }); add(wat.g, RX, AY, 0);
      const inkW = U5.swarm(10, { r: 0.072, color: 0x2a3fa8, w: W, h: H, d: D }); add(inkW.g, RX, AY, 0);
      const WP = Array.from({ length: 60 }, (_, i) => V(-W / 2 + 0.12 + (i % 6) * (W - 0.24) / 5, -H / 2 + 0.12 + Math.floor(i / 6) % 5 * (H - 0.24) / 4, -0.25 + Math.floor(i / 30) * 0.5));
      const dirs = Array.from({ length: 10 }, (_, k) => V(U5.rnd(k, 1) - 0.5, U5.rnd(k, 2) - 0.5, (U5.rnd(k, 3) - 0.5) * 0.4).normalize());
      const l1 = [grp(tag('in air', 0.055, '#ffffff', LX, AY - 1.02, 0.1), 'a'), grp(tag('in water', 0.055, '#9fd2ff', RX, AY - 1.02, 0.1), 'a')];
      const l2 = [grp(tag('in water every step is a bump:', 0.048, '#ffd27a', DX, AY - 1.02, 0.1), 'b'), grp(tag('it spreads more slowly ✓', 0.05, '#ffd27a', DX, AY - 1.22, 0.1), 'b')];
      beats.push((t) => {
        const lt = t - ID, hx = lerp(0.15, W / 2, ease(span(t, ID + 0.8, ID + 2.6))), hy = Math.min(hx, H / 2);
        air.place(lt, (i) => air.gas(i, lt));
        inkA.place(lt, (i) => inkA.gas(i, lt, V(0, 0.4 - 0.4 * hy / (H / 2), 0), hx, hy, D / 2));
        wat.place(lt, (i) => WP[i].clone().add(V(Math.sin(lt * 3 + i) * 0.025, Math.cos(lt * 2.6 + i) * 0.025, 0)));
        const r = 0.08 + 0.5 * Math.sqrt(span(t, ID + 0.8, B1 + 6));
        inkW.place(lt, (k) => V(0, 0.4, 0).addScaledVector(dirs[k], r).add(V(Math.sin(lt * 7 + k) * 0.03, Math.cos(lt * 6 + k) * 0.03, 0)));
        l1.forEach((l) => K.popIn(l, t, ID + 0.6, ID + 4.6)); l2.forEach((l) => K.popIn(l, t, ID + 4.8, B1));
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Does ink spread in water like perfume in air?', dockTitle: 'Liquids', intro: INTRO, ticks: TICKS,
      rows: [[0, 'ink, water, oil, liquid bromine'], [1, 'ink spreads by itself: diffusion'], [1, 'slower than in air: close molecules'], [1, 'warmer water: faster'], [1, 'warmer: flows more easily (mobility)'], [1, 'denser than gases, fixed volume'], [1, 'Activity 5.3: bromine spreads']],
      short: ['diffusion', 'slower than air', 'warmer: faster', 'mobility', 'density', 'Activity 5.3'] }));
    return U.finish();
  },
};
