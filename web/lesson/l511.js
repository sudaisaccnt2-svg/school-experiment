// Lesson 511 · Crystalline & Amorphous Solids (book pp. 143–144: 5.5 Types of solids, 5.5.1 amorphous solids (no
// ordered arrangement, no sharp melting point; glass, wax, butter, plastics, rubber, cotton candy; Fig. 5.15),
// 5.5.2 crystalline solids (regular 3D patterns, faces with definite angles, sharp melting point; NaCl, naphthalene;
// Fig. 5.16), Activity 5.4 group work, STS: salt cures meat and fish). v1 as a code lesson (2026-11-04). SKILL.md.
// THE QUESTION (book: "Solids can be classified into two types, based on the arrangement of particles"): "Salt and wax
//   are both solids. Are they built the same way?" → card, docked panel, six ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a candle, big salt crystals, a hot plate with a tray holding a piece of wax and a mothball
//         (naphthalene), salted fish on a plate (named one at a time) · the question → card → dive INTO a salt crystal.
//  SALT   (dark) Fig. 5.16: Na⁺ and Cl⁻ in a regular 3D pattern; the crystal's flat faces flash "a regular pattern in
//         3D: crystalline ✓ · flat faces at fixed angles".
//  WAX    cut back to the table, then INTO the candle: particles jumbled with no pattern (Fig. 5.15) "no order:
//         amorphous (shapeless) ✓".
//  MELT   the hot plate is switched on, the thermometer climbs: the wax softens and sags little by little "wax: softens
//         over a range ✓"; the mothball stays hard, then melts all at once "naphthalene: a sharp melting point ✓".
//  ACT 5.4 (dark) two bins, crystalline · amorphous; ten things from home drop in one by one (marbles, glass, table salt,
//         baking soda, charcoal, lead pencil, candle wax, plastic, eraser, rubber) ✓.
//  STS    the salted fish "salt keeps bacteria away: meat and fish keep longer ✓".
//  END    "Ordered: crystalline. Jumbled: amorphous ✓".
// Game (🎮 State Sorter, docs/COVERAGE_U5.md): more crystalline / amorphous items, butter, cotton candy, 20 % salt.
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U5.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
import * as U5 from './u5kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, CDX = HKX - 0.88, SCX = HKX - 0.45, HPX = HKX + 0.15, FSX = HKX + 0.8;
const SX = 40, WX = 52, AX = 64;

// ---------------------------------------------------------------- time
const T = { card: 9.0 };
const DOCK = T.card + 5.0;
const SD = DOCK + 3.4, B1 = SD + 9.0, WD = B1 + 3.6, B2 = WD + 6.6, MT = B2, AC = MT + 15.0, B3 = AC + 14.4, END = B3 + 6.0;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[SD + 6.6, 0], [WD + 4.6, 1], [MT + 8.4, 2], [MT + 13.2, 3], [AC + 13.2, 4], [B3 + 4.6, 5]];
const DARK = [[SD, B1], [WD, B2], [AC, B3]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [6.4, T.card, 'Salt and wax are both solids. Built the same way?', [HKX, 0.6, 0.05]],
  [DOCK + 0.2, SD - 0.3, 'Look inside a salt crystal', [SCX, 0.25, 0.05]],
  [B1 + 0.3, WD - 0.3, 'Now inside the candle', [CDX, 0.4, 0.05]],
  [MT + 0.3, MT + 2.4, 'Warm the wax and a mothball together', [HPX, 0.42, 0.05]],
  [END + 0.4, T.done, 'Ordered: crystalline. Jumbled: amorphous ✓', [HKX, 0.6, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX - 0.02, 0.2, 0.05], 2.2 * k, 0.75 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const near = (t, p, w = 0.8, h = 0.65, e) => S(t, p, w, h, ADIR, e);
const P_SC = [SCX, 0.04, 0.0], P_CD = [CDX, 0.12, 0.02], P_HP = [HPX, 0.2, 0.05], P_FS = [FSX, 0.08, 0.05];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(DOCK + 1.8, P_SC, 0.4, 0.32), DIVE(SD - 0.05, P_SC),
  DK(SD, SX, 2.4, 2.4, 0.3), DK(SD + 1.8, SX, 2.4, 2.4, 1.04, 'out'), DK(B1 - 0.05, SX, 2.4, 2.4, 0.97),
  S(B1, P_SC, 0.1, 0.08, ADIR, 'out'), near(B1 + 1.2, [(SCX + CDX) / 2, 0.12, 0.05], 0.8, 0.5), near(B1 + 2.6, P_CD, 0.3, 0.3), DIVE(WD - 0.05, P_CD),
  DK(WD, WX, 2.4, 2.4, 0.3), DK(WD + 1.8, WX, 2.4, 2.4, 1.04, 'out'), DK(B2 - 0.05, WX, 2.4, 2.4, 0.97),
  S(B2, P_CD, 0.1, 0.08, ADIR, 'out'), near(MT + 1.4, P_HP, 0.62, 0.55), near(AC - 0.05, P_HP, 0.6, 0.53),
  DK(AC, AX, 3.8, 2.4, 1.02), DK(B3 - 0.05, AX, 3.8, 2.4, 0.97),
  near(B3, P_FS, 0.55, 0.45), near(END - 0.05, P_FS, 0.53, 0.43), HK(END + 0.4, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '511', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;

    // ================================================================ BENCH
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', HKX - 0.02, 2.4, 0.8);
      add(U5.candle(), CDX, 0, 0); add(U5.saltCrystals(), SCX, 0, 0);
      const hp = add(K.hotPlate(), HPX, 0, 0), tray = add(K.solid(new THREE.BoxGeometry(0.2, 0.006, 0.12), M.metal(0x9aa0a8, 0.3)), HPX, 0.105 + 0.003 + 0.002, -0.01);
      const wax = add(K.solid(new THREE.CylinderGeometry(0.022, 0.022, 0.05, 24), new THREE.MeshPhysicalMaterial({ color: 0xf4efe2, roughness: 0.5, sheen: 0.4 })), HPX - 0.05, 0.115 + 0.025, -0.01);
      const mb = add(K.solid(new THREE.SphereGeometry(0.022, 24, 16), new THREE.MeshPhysicalMaterial({ color: 0xfafaf8, roughness: 0.6 })), HPX + 0.05, 0.115 + 0.022, -0.01);
      const th = add(K.thermometer(0.3, 100), HPX + 0.1, 0.105, 0.04); th.rotation.z = -0.2; th.userData.set(25);
      add(U5.saltedFish(), FSX, 0, 0);
      const ls = [['a candle', '#ffffff', CDX, 0.3, 0.08], ['salt crystals', '#ffffff', SCX, 0.16, 0.1], ['wax and a mothball (naphthalene)', '#ffffff', HPX, 0.34, 0.1], ['salted fish', '#ffffff', FSX, 0.2, 0.1]].map(([s, c, x, y, z]) => tag(s, 0.045, c, x, y, z));
      const lW = tag('wax: softens over a range ✓', 0.045, '#ffd27a', HPX - 0.02, 0.36, 0.1);
      const lN = [grp(tag('naphthalene stays hard, then melts', 0.042, '#ffd27a', HPX, 0.38, 0.1), 'nap'), grp(tag('all at once: a sharp melting point ✓', 0.042, '#ffd27a', HPX, 0.32, 0.1), 'nap')];
      const lF = [grp(tag('salt keeps bacteria away:', 0.045, '#ffd27a', FSX, 0.24, 0.1), 'fs'), grp(tag('meat and fish keep longer ✓', 0.045, '#ffd27a', FSX, 0.18, 0.1), 'fs')];
      beats.push((t) => {
        const on = ease(span(t, MT + 2.4, MT + 2.8)); hp.userData.on(on); th.userData.set(lerp(25, 90, ease(span(t, MT + 2.8, MT + 12.0))));
        const w = ease(span(t, MT + 3.6, MT + 11.0)); wax.scale.set(1 + 0.9 * w, Math.max(0.15, 1 - 0.85 * w), 1 + 0.9 * w); wax.position.y = 0.115 + 0.025 * wax.scale.y;
        const n = ease(span(t, MT + 10.0, MT + 10.6)); mb.scale.set(1 + 1.0 * n, Math.max(0.12, 1 - 0.88 * n), 1 + 1.0 * n); mb.position.y = 0.115 + 0.022 * mb.scale.y; mb.material.roughness = lerp(0.6, 0.05, n);
        ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 1.5, 1.8 + i * 1.5)); K.popIn(lW, t, MT + 6.4, MT + 9.8); lN.forEach((l) => K.popIn(l, t, MT + 10.8, AC - 0.1)); lF.forEach((l) => K.popIn(l, t, B3 + 0.8, END));
      });
    }

    // ================================================================ SALT (dark) · Fig. 5.16: a regular 3D pattern
    {
      U.stage((t) => t >= SD - 0.05 && t < B1 - 0.05); keyLight(SX);
      const A = 0.42, NAC = 0x8c6fd8, CLC = 0x6fd07a, g = add(new THREE.Group(), SX, AY, 0);
      for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) for (let z = 0; z < 3; z++) { const na = (x + y + z) % 2 === 1, b = K.solid(new THREE.SphereGeometry(na ? 0.12 : 0.18, 28, 18), M.gloss(na ? NAC : CLC)); b.position.set((x - 1) * A, (y - 1) * A, (z - 1) * A); g.add(b); }
      const faces = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2 * A + 0.5, 2 * A + 0.5, 2 * A + 0.5)), new THREE.LineBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0 })); g.add(faces);
      const l1 = [grp(tag('Na⁺ and Cl⁻ in a regular pattern in 3D:', 0.045, '#ffffff', SX, AY - 1.05, 0.1), 'c'), grp(tag('crystalline ✓', 0.055, '#ffd27a', SX, AY - 1.25, 0.1), 'c')];
      const l2 = tag('flat faces at fixed angles', 0.05, '#ffd27a', SX, AY - 1.15, 0.1);
      beats.push((t) => { g.rotation.y = 0.5 + 0.25 * Math.sin((t - SD) * 0.5); g.rotation.x = 0.25; faces.material.opacity = 0.9 * span(t, SD + 5.2, SD + 5.8); l1.forEach((l) => K.popIn(l, t, SD + 0.6, SD + 5.0)); K.popIn(l2, t, SD + 5.2, B1); });
    }

    // ================================================================ WAX (dark) · Fig. 5.15: jumbled, no order
    {
      U.stage((t) => t >= WD - 0.05 && t < B2 - 0.05); keyLight(WX);
      const sw = U5.swarm(40, { r: 0.13, color: 0xd8d0f0, w: 2, h: 2, d: 1, glow: 0.2 }), P = [];
      for (let i = 0; P.length < 40 && i < 600; i++) { const p = V((U5.rnd(i, 1) - 0.5) * 1.6, (U5.rnd(i, 2) - 0.5) * 1.6, (U5.rnd(i, 3) - 0.5) * 0.6); if (P.every((q) => q.distanceTo(p) > 0.24)) P.push(p); }
      add(sw.g, WX, AY, 0);
      const l1 = [grp(tag('no order, jumbled:', 0.05, '#ffffff', WX, AY - 1.05, 0.1), 'a'), grp(tag('amorphous (shapeless) ✓', 0.055, '#ffd27a', WX, AY - 1.25, 0.1), 'a')];
      beats.push((t) => { const lt = t - WD; sw.place(lt, (i) => (P[i] ?? V(0, -50, 0)).clone().add(V(Math.sin(lt * 9 + i), Math.cos(lt * 8 + i), 0).multiplyScalar(0.01))); l1.forEach((l) => K.popIn(l, t, WD + 0.8, B2)); });
    }

    // ================================================================ ACTIVITY 5.4 (dark) · sort ten things from home
    {
      U.stage((t) => t >= AC - 0.05 && t < B3 - 0.05); keyLight(AX);
      const run = U5.sortBins(U, ['crystalline', 'amorphous'], [['table salt', 0], ['glass', 1], ['marbles', 1], ['baking soda', 0], ['candle wax', 1], ['lead pencil', 0], ['plastic', 1], ['charcoal', 1], ['eraser', 1], ['rubber', 1]], { x: AX, y: AY - 0.75, t0: AC, dt: 1.1 });
      const cap = tag('Activity 5.4: sort these solids', 0.05, '#ffffff', AX, AY + 1.05, 0.1);
      beats.push((t) => { run(t, B3); K.popIn(cap, t, AC + 0.2, AC + 1.6); });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Salt and wax are both solids. Built the same way?', dockTitle: 'Two kinds', intro: INTRO, ticks: TICKS,
      rows: [[0, 'a candle, salt crystals, a mothball, salted fish'], [1, 'a regular 3D pattern: crystalline'], [1, 'jumbled, no order: amorphous'], [1, 'amorphous: softens over a range'], [1, 'crystalline: a sharp melting point'], [1, 'Activity 5.4: sort the solids'], [1, 'salt keeps meat and fish safe']],
      short: ['crystalline', 'amorphous', 'softens slowly', 'sharp m.p.', 'Activity 5.4', 'salted fish'] }));
    return U.finish();
  },
};
