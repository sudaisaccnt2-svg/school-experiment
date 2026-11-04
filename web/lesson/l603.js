// Lesson 603 · Solutions in Gases & Liquids (book p. 156: 6.3 Types of solution, nine types; 6.3.1 gaseous solutions
// (gas in gas: oxygen in nitrogen, air; liquid in gas: water vapour in air, fog, humidity; solid in gas: carbon
// particles in air, smoke); 6.3.2 liquid solutions (gas in liquid: CO₂ in water, Fig. 6.3; liquid in liquid: alcohol in
// water; solid in liquid: salts in water, sea water, sugar in water)). v1 as a code lesson (2026-11-04). SKILL.md.
// THE QUESTION (book: "Solutions exist in gas, liquid and solid states"): "Can a solution be made in air, not only in
//   water?" → card, docked panel, six ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a balloon of air, a candle just blown out (smoke), warm water on a hot plate (mist), a soft drink,
//         a bottle of alcohol, a beaker of sea water (named one at a time) · the question → card → dive INTO the air.
//  AIR    (dark) nitrogen and oxygen molecules drift "air: oxygen in nitrogen: gas in gas ✓" · water droplets drift in
//         "fog, humidity: water in air: liquid in gas ✓" · black carbon specks drift in "smoke: carbon in air: solid in gas
//         ✓" · "In air the solvent is a gas. And in water?"
//  WATER  back out, to the soft drink fizzing (Fig. 6.3) → dive (dark): water molecules; CO₂ molecules among them
//         "CO₂ in water (a soft drink): gas in liquid ✓" · alcohol molecules mix in "alcohol in water: liquid in liquid ✓"
//         · Na⁺ and Cl⁻ spread through "salt in sea water: solid in liquid ✓".
//  END    back on the table, the two groups "solvent: a gas · solvent: a liquid" · "Solutes of every state dissolve in
//         gases and liquids ✓".
// Game (🎮 Mixture Sorter › nine types, docs/COVERAGE_U6.md): the tables of 6.3.1 and 6.3.2 (solute · solvent · example).
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
const HKX = 0, BLX = HKX - 1.15, CDX = HKX - 0.8, FGX = HKX - 0.42, SDX = HKX + 0.15, ALX = HKX + 0.5, SWX = HKX + 0.88;
const AX = 40, WX = 52;

// ---------------------------------------------------------------- time
const T = { card: 10.4 };
const DOCK = T.card + 5.0;
const G0 = DOCK + 0.4, GD = G0 + 3.4, B1 = GD + 13.6, S0 = B1, SD = S0 + 4.0, B2 = SD + 12.6, END = B2 + 6.6;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[GD + 4.0, 0], [GD + 8.0, 1], [GD + 12.0, 2], [SD + 4.0, 3], [SD + 8.0, 4], [SD + 12.0, 5]];
const DARK = [[GD, B1], [SD, B2]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [8.6, T.card, 'Can a solution be made in air, not only in water?', [HKX - 0.1, 0.7, 0.05]],
  [G0 + 0.3, GD - 0.3, 'Look into the air', [BLX, 0.9, 0.05]],
  [GD + 12.2, B1, 'In air the solvent is a gas. And in water?', [AX, AY + 1.0, 0]],
  [S0 + 0.8, SD - 0.3, 'Fig. 6.3: carbon dioxide in water', [SDX, 0.48, 0.05]],
  [END + 0.4, T.done, 'Solutes of every state dissolve in gases and liquids ✓', [HKX - 0.1, 0.7, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX - 0.13, 0.32, 0.05], 2.7 * k, 0.9 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const near = (t, p, w = 0.8, h = 0.65, e) => S(t, p, w, h, ADIR, e);
const P_BL = [BLX, 0.62, 0.0], P_SD = [SDX, 0.18, 0.02], P_G = [(BLX + FGX) / 2, 0.35, 0.05];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(G0, P_G, 1.0, 0.85), near(G0 + 2.2, P_BL, 0.35, 0.3), DIVE(GD - 0.05, P_BL),
  DK(GD, AX, 3.0, 2.0, 0.3), DK(GD + 1.8, AX, 3.0, 2.0, 1.04, 'out'), DK(B1 - 0.05, AX, 3.0, 2.0, 0.97),
  S(B1, P_BL, 0.32, 0.28, ADIR, 'out'), near(S0 + 1.0, P_SD, 0.5, 0.5), near(S0 + 3.0, P_SD, 0.3, 0.28), DIVE(SD - 0.05, P_SD),
  DK(SD, WX, 3.0, 2.0, 0.3), DK(SD + 1.8, WX, 3.0, 2.0, 1.04, 'out'), DK(B2 - 0.05, WX, 3.0, 2.0, 0.97),
  S(B2, P_SD, 0.3, 0.28, ADIR, 'out'), HK(B2 + 1.6, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '603', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;

    // ================================================================ BENCH
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', HKX - 0.13, 2.9, 0.8);
      const bal = add(K.balloon(0xcfe4ff, 0.12), BLX, 0, 0);
      add(U5.candle(), CDX, 0, 0); const smk = add(K.smoke(8, 0x8a8a8a), CDX, 0.2, 0); smk.scale.setScalar(0.1);
      add(K.hotPlate(), FGX, 0, 0); add(K.labBeaker(0.08, 0.16), FGX, 0.105, -0.01); add(K.liquid(0.075, 0.08, 0x3d9ee6, 0.5), FGX, 0.117, -0.01); const mist = add(K.smoke(10, 0xffffff), FGX, 0.3, -0.01); mist.scale.setScalar(0.12);
      add(K.glassBottle(1.2), SDX, 0, 0); const fizz = add(K.bubbles(16, V(0, 0.04, 0), 0.2, 0.04, 0.008), SDX, 0, 0);
      add(K.reagentBottle(0xf0f4f8, 0.24, 0.06, 'alcohol'), ALX, 0, 0);
      add(K.labBeaker(0.08, 0.18), SWX, 0, 0); add(K.liquid(0.075, 0.12, 0x2f9c8c, 0.55), SWX, 0.012, 0);
      const ls = [['a balloon of air', '#cfe4ff', BLX, 0.86, 0.05], ['a candle just blown out', '#ffffff', CDX, 0.32, 0.1], ['warm water: mist', '#ffffff', FGX, 0.42, 0.08], ['a soft drink', '#9fe0b0', SDX, 0.42, 0.1], ['alcohol', '#ffffff', ALX, 0.34, 0.1], ['sea water', '#8fe0d0', SWX, 0.3, 0.1]].map(([s, c, x, y, z]) => tag(s, 0.045, c, x, y, z));
      const lG = [grp(tag('solvent: a gas', 0.05, '#cfe4ff', (BLX + FGX) / 2, 0.66, 0.08), 'end'), grp(tag('solvent: a liquid', 0.05, '#9fd2ff', (SDX + SWX) / 2, 0.62, 0.08), 'end')];
      beats.push((t) => {
        bal.userData.update(t); smk.userData.update(t, 0.6); mist.userData.update(t, 0.6); fizz.userData.update(t, 0.6);
        ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 1.35, 1.6 + i * 1.35)); lG.forEach((l) => K.popIn(l, t, B2 + 1.8, END + 0.2));
      });
    }

    // ================================================================ AIR (dark) · gas in gas, liquid in gas, solid in gas
    {
      U.stage((t) => t >= GD - 0.05 && t < B1 - 0.05); keyLight(AX);
      const W = 2.6, H = 1.6, D = 0.8; add(U5.glassBox(W, H, D), AX, AY, 0);
      const path = U5.swarm(20, { w: W - 0.35, h: H - 0.35, d: D - 0.3, speed: 0.7 }); path.mesh.visible = false;
      const two = (el, c) => U.ballMol([[el, -0.1, 0], [el, 0.1, 0]], [[0, 1, 2]], { r: { [el]: 0.085 } });
      const mols = [...Array.from({ length: 10 }, () => two('N')), ...Array.from({ length: 3 }, () => two('O'))].map((m) => add(m, 0, 0, 0));
      const drop = (c, r, n) => { const g = new THREE.Group(), m = M.gloss(c); for (let i = 0; i < n; i++) { const b = K.solid(new THREE.SphereGeometry(r, 14, 10), m, { outline: false }); b.position.set(Math.cos(i * 2.1) * r * 1.3, Math.sin(i * 1.7) * r * 1.1, Math.sin(i * 2.9) * r); g.add(b); } return add(g); };
      const fog = [0, 1, 2].map(() => drop(0x6fb6ff, 0.045, 6)), soot = [0, 1, 2].map(() => drop(0x1c1c20, 0.04, 5));
      const l1 = [grp(tag('air: oxygen in nitrogen', 0.05, '#ffffff', AX, AY - 0.97, 0.1), 'a1'), grp(tag('gas in gas ✓', 0.055, '#ffd27a', AX, AY - 1.17, 0.1), 'a1')];
      const l2 = [grp(tag('fog, humidity: water in air', 0.05, '#9fd2ff', AX, AY - 0.97, 0.1), 'a2'), grp(tag('liquid in gas ✓', 0.055, '#ffd27a', AX, AY - 1.17, 0.1), 'a2')];
      const l3 = [grp(tag('smoke: carbon in air', 0.05, '#ffffff', AX, AY - 0.97, 0.1), 'a3'), grp(tag('solid in gas ✓', 0.055, '#ffd27a', AX, AY - 1.17, 0.1), 'a3')];
      const lN = [grp(tag('N₂ (blue)', 0.045, '#9fb8ff', AX - 0.7, AY + 0.95, 0.1), 'nm'), grp(tag('O₂ (red)', 0.045, '#ff9a8a', AX + 0.7, AY + 0.95, 0.1), 'nm')];
      beats.push((t) => {
        const lt = t - GD; mols.forEach((m, i) => { m.position.copy(path.gas(i, lt)).add(V(AX, AY, 0)); m.rotation.z = lt * 0.6 + i; m.rotation.y = lt * 0.4 + i; });
        const enter = (arr, t0, k0) => arr.forEach((g, j) => { const u = ease(span(t, t0 + 0.4 * j, t0 + 1.6 + 0.4 * j)), p = path.gas(k0 + j, lt).add(V(AX, AY, 0)); g.visible = t > t0 + 0.4 * j; g.position.copy(V(AX + 2.6, AY + 0.4, 0)).lerp(p, u); g.rotation.y = lt; });
        enter(fog, GD + 4.4, 13); enter(soot, GD + 8.4, 16);
        lN.forEach((l) => K.popIn(l, t, GD + 0.2, GD + 1.9)); l1.forEach((l) => K.popIn(l, t, GD + 2.0, GD + 4.3)); l2.forEach((l) => K.popIn(l, t, GD + 6.0, GD + 8.3)); l3.forEach((l) => K.popIn(l, t, GD + 10.0, GD + 12.1));
      });
    }

    // ================================================================ WATER (dark) · gas in liquid, liquid in liquid, solid in liquid
    {
      U.stage((t) => t >= SD - 0.05 && t < B2 - 0.05); keyLight(WX);
      const W = 2.6, H = 1.6, D = 0.8; add(U5.glassBox(W, H, D), WX, AY, 0);
      const wat = U5.swarm(40, { r: 0.065, color: 0x59a8ff, w: W, h: H, d: D, glow: 0.2 }); add(wat.g, WX, AY, 0);
      const WP = Array.from({ length: 40 }, (_, i) => V(-W / 2 + 0.15 + (i % 8) * (W - 0.3) / 7, -H / 2 + 0.15 + Math.floor(i / 8) % 5 * (H - 0.3) / 4, (U5.rnd(i, 4) - 0.5) * 0.5));
      const co2 = Array.from({ length: 4 }, () => add(U.ballMol([['O', -0.15, 0], ['C', 0, 0], ['O', 0.15, 0]], [[0, 1, 2], [1, 2, 2]], { r: { O: 0.07, C: 0.07 } })));
      const alc = Array.from({ length: 4 }, () => add(U.ballMol([['C', -0.12, 0], ['C', 0.04, 0.07], ['O', 0.2, -0.02]], [[0, 1], [1, 2]], { r: { C: 0.075, O: 0.07 } })));
      const ion = (c, r, s) => { const g = new THREE.Group(); g.add(K.solid(new THREE.SphereGeometry(r, 20, 14), M.gloss(c))); const l = K.label(s, r * 0.9, '#ffffff', 800); l.position.z = r + 0.01; l.renderOrder = 22; l.userData.mark = true; g.add(l); return add(g); };
      const ions = [0, 1, 2, 3].flatMap(() => [ion(0x8c6fd8, 0.06, '+'), ion(0x6fd07a, 0.09, '−')]);
      const path = U5.swarm(16, { w: W - 0.3, h: H - 0.3, d: D - 0.2, speed: 0.4 }); path.mesh.visible = false;
      const l1 = [grp(tag('CO₂ in water (a soft drink)', 0.05, '#ffffff', WX, AY - 0.97, 0.1), 'w1'), grp(tag('gas in liquid ✓', 0.055, '#ffd27a', WX, AY - 1.17, 0.1), 'w1')];
      const l2 = [grp(tag('alcohol in water', 0.05, '#ffffff', WX, AY - 0.97, 0.1), 'w2'), grp(tag('liquid in liquid ✓', 0.055, '#ffd27a', WX, AY - 1.17, 0.1), 'w2')];
      const l3 = [grp(tag('salt in sea water (or sugar in water)', 0.046, '#ffffff', WX, AY - 0.97, 0.1), 'w3'), grp(tag('solid in liquid ✓', 0.055, '#ffd27a', WX, AY - 1.17, 0.1), 'w3')];
      beats.push((t) => {
        const lt = t - SD; wat.place(lt, (i) => WP[i].clone().add(V(Math.sin(lt * 0.9 + i * 1.7) * 0.05, Math.sin(lt * 1.3 + i) * 0.04, 0)));
        const enter = (arr, t0, k0) => arr.forEach((g, j) => { const u = ease(span(t, t0 + 0.35 * j, t0 + 1.6 + 0.35 * j)), p = path.gas(k0 + j, lt).add(V(WX, AY, 0.25)); g.visible = t > t0 + 0.35 * j; g.position.copy(V(WX + 2.6, AY + 0.5, 0.25)).lerp(p, u); if (!g.children[1]?.isSprite) g.rotation.y = lt * 0.5 + j; });
        enter(co2, SD + 0.6, 0); enter(alc, SD + 4.6, 4); enter(ions, SD + 8.4, 8);
        l1.forEach((l) => K.popIn(l, t, SD + 2.4, SD + 4.4)); l2.forEach((l) => K.popIn(l, t, SD + 6.4, SD + 8.4)); l3.forEach((l) => K.popIn(l, t, SD + 10.6, B2));
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Can a solution be made in air, not only in water?', dockTitle: 'Six types', intro: INTRO, ticks: TICKS,
      rows: [[0, 'air, smoke, mist, a soft drink, alcohol, sea water'], [1, 'gas in gas: air'], [1, 'liquid in gas: fog, humidity'], [1, 'solid in gas: smoke'], [1, 'gas in liquid: CO₂ in water'], [1, 'liquid in liquid: alcohol in water'], [1, 'solid in liquid: sea water, sugar water']],
      short: ['gas in gas', 'liquid in gas', 'solid in gas', 'gas in liquid', 'liquid in liquid', 'solid in liquid'] }));
    return U.finish();
  },
};
