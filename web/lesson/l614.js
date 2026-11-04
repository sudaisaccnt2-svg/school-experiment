// Lesson 614 · Colloids & the Tyndall Effect (book pp. 173–174: 6.6 comparison; 6.6.1 solution (a true solution: the
// particles cannot be seen, pass through filter paper, do not settle); 6.6.2 colloids (particles between those of
// solutions and suspensions, 1–1000 nm; they pass the filter paper, do not settle: starch in water), Scientific
// Information: the Tyndall effect, Fig. 6.12 fog, milk, paints; Table 6.1 classes of colloids; Example 6.6; Practice 6.2).
// v1 as a code lesson (2026-11-04), replacing the old Blender film. SKILL.md §0 + §1 + §4.
// THE QUESTION (book: "Many colloids appear homogeneous because the individual particles cannot be seen"): "Salt water
//   and starch water both look clear. How can we tell them apart?" → card, docked panel, five ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a beaker of salt water and a beaker of starch water side by side, a torch; a glass of milk and a
//         pot of paint (named one at a time) · question → card.
//  TYNDALL the torch is switched on: its beam crosses both beakers: in salt water the beam cannot be seen, in starch
//         water a bright path shows "salt water: no beam: a true solution" · "starch water: the beam shows: a colloid
//         (the Tyndall effect) ✓" → dive INTO the starch water.
//  INSIDE (dark) a size ruler 1 … 1000 nm; tiny Na⁺ Cl⁻ (below 1 nm) next to big starch particles (1–1000 nm); the
//         beam: light bounces off the starch particles "colloid particles: 1–1000 nm, big enough to scatter light ✓".
//  STAND  back: "an hour later": neither settles "colloids pass through filter paper and do not settle ✓" ·
//         milk and paint "milk, paints, fog: colloids in daily life (Fig. 6.12) ✓".
//  EX 6.6 (dark) two bins, liquid ammonia NH₃ (polar) · benzene C₆H₆ (non-polar); cards drop in: H₂O → NH₃, C₆H₁₂ →
//         benzene, AgCl → NH₃, CH₃OH (Practice 6.2) → polar ✓.
//  END    "A beam of light tells a colloid from a solution ✓".
// Game (🎮 Mixture Sorter, docs/COVERAGE_U6.md): Table 6.1 (sol, gel, emulsion, foam, aerosols, solid emulsion) to learn.
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
const TRX = -0.95, SWX = -0.55, STX = -0.2, MKX = 0.35, PTX = 0.7;
const DX = 40, EX = 52;

// ---------------------------------------------------------------- time
const T = { card: 9.4 };
const DOCK = T.card + 5.0;
const TY = DOCK + 0.4, ID = TY + 10.4, B1 = ID + 9.6, SA = B1, ED = SA + 10.6, B2 = ED + 11.4, END = B2 + 5.4;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[TY + 6.6, 0], [TY + 9.4, 1], [ID + 8.0, 2], [SA + 6.2, 3], [ED + 10.4, 4]];
const DARK = [[ID, B1], [ED, B2]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [7.0, T.card, 'Salt water and starch water both look clear. How can we tell them apart?', [-0.2, 0.6, 0.05]],
  [TY + 0.2, TY + 2.0, 'Shine a torch through both', [(SWX + STX) / 2, 0.42, 0.05]],
  [TY + 9.6, ID - 0.2, 'Why does starch show the beam?', [STX, 0.38, 0.05]],
  [ED + 0.2, ED + 2.2, 'Example 6.6: liquid ammonia or benzene?', [EX, AY + 1.05, 0]],
  [END + 0.4, T.done, 'A beam of light tells a colloid from a solution ✓', [-0.2, 0.6, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [-0.12, 0.22, 0.05], 2.1 * k, 0.7 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const near = (t, p, w = 0.8, h = 0.65, e) => S(t, p, w, h, ADIR, e);
const P_TY = [(TRX + STX) / 2 + 0.1, 0.18, 0.05], P_IN = [STX, 0.09, 0.0], P_MP = [(MKX + PTX) / 2, 0.14, 0.05];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(TY, P_TY, 1.1, 0.5), near(TY + 9.4, P_TY, 1.06, 0.48), near(TY + 10.0, P_IN, 0.22, 0.2), DIVE(ID - 0.05, P_IN),
  DK(ID, DX, 3.2, 2.2, 0.3), DK(ID + 1.8, DX, 3.2, 2.2, 1.04, 'out'), DK(B1 - 0.05, DX, 3.2, 2.2, 0.97),
  S(B1, P_IN, 0.5, 0.45, ADIR, 'out'), near(SA + 1.0, P_TY, 1.1, 0.5), near(SA + 5.0, P_TY, 1.06, 0.48), near(SA + 6.4, P_MP, 0.7, 0.45), near(ED - 0.05, P_MP, 0.68, 0.43),
  DK(ED, EX, 3.8, 2.4, 1.02), DK(B2 - 0.05, EX, 3.8, 2.4, 0.97), HK(B2, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '614', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;

    // ================================================================ BENCH
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', -0.12, 2.3, 0.75);
      const blk = add(K.solid(new THREE.BoxGeometry(0.2, 0.05, 0.08), M.matte(0x5a4632, 0.7)), TRX, 0.025, 0), tr = add(U6.torch(), TRX, 0.051, 0);
      add(K.labBeaker(0.07, 0.16), SWX, 0, 0); add(K.liquid(0.065, 0.11, 0x6fb0f0, 0.32), SWX, 0.012, 0);
      add(K.labBeaker(0.07, 0.16), STX, 0, 0); add(K.liquid(0.065, 0.11, 0xdfe8f0, 0.42), STX, 0.012, 0);
      const by = 0.074, b0 = add(U6.beam()), b1 = add(U6.beam()), b2 = add(U6.beam()), b3 = add(U6.beam());
      add(K.labBeaker(0.05, 0.14), MKX, 0, 0); add(K.liquid(0.045, 0.1, 0xfaf8f2, 0.95), MKX, 0.012, 0);
      const pot = add(new THREE.Group(), PTX, 0, 0); pot.add(K.solid(new THREE.CylinderGeometry(0.07, 0.07, 0.1, 32, 1, true), M.metal(0xb9bec6, 0.3))); pot.children[0].position.y = 0.05; const paint = K.solid(new THREE.CylinderGeometry(0.066, 0.066, 0.004, 32), M.gloss(0x3a7ad8)); paint.position.y = 0.09; pot.add(paint);
      const ls = [['a torch', '#ffffff', TRX, 0.1, 0.1], ['salt water', '#9fd2ff', SWX, 0.3, 0.1], ['starch water', '#ffffff', STX, 0.3, 0.1], ['milk', '#ffffff', MKX, 0.24, 0.1], ['paint', '#9fc4ff', PTX, 0.2, 0.12]].map(([s, c, x, y, z]) => tag(s, 0.045, c, x, y, z));
      const say = (a, b, x, y, t0, t1, g) => ({ l: [grp(tag(a, 0.042, '#ffffff', x, y + 0.035, 0.1), g), ...(b ? [grp(tag(b, 0.045, '#ffd27a', x, y - 0.03, 0.1), g)] : [])], t0, t1 });
      const SAY = [
        say('salt water: no beam', 'a true solution', SWX, 0.32, TY + 4.0, TY + 6.6, 'y1'), say('starch water: the beam shows', 'a colloid (the Tyndall effect) ✓', STX - 0.1, 0.32, TY + 6.8, TY + 9.4, 'y2'),
        say('an hour later: neither settles,', 'colloids pass filter paper too ✓', (SWX + STX) / 2, 0.32, SA + 2.4, SA + 6.0, 's1'),
        say('milk, paints, fog: colloids', 'in daily life (Fig. 6.12) ✓', P_MP[0], 0.28, SA + 6.8, ED, 's2'),
      ];
      const lH = tag('an hour later', 0.05, '#ffffff', (SWX + STX) / 2, 0.3, 0.1);
      beats.push((t) => {
        const on = span(t, TY + 2.0, TY + 2.4) * (t < SA + 6.0 ? 1 : 0); tr.userData.set(on);
        const L = V(TRX + 0.12, by, 0), aIn = V(SWX - 0.07, by, 0), aOut = V(SWX + 0.07, by, 0), bIn = V(STX - 0.07, by, 0), bOut = V(STX + 0.07, by, 0);
        b0.userData.set(L, aIn, 0.12 * on); b1.userData.set(aIn, aOut, 0.12 * on); b2.userData.set(aOut, bIn, 0.12 * on); b3.userData.set(bIn, bOut, 0.85 * on * (0.9 + 0.1 * Math.sin(t * 7)));
        ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 1.3, 1.6 + i * 1.3)); SAY.forEach(({ l, t0, t1 }) => l.forEach((x) => K.popIn(x, t, t0, t1))); K.popIn(lH, t, SA + 0.6, SA + 2.2);
      });
    }

    // ================================================================ INSIDE (dark) · 1–1000 nm: big enough to scatter light
    {
      U.stage((t) => t >= ID - 0.05 && t < B1 - 0.05); keyLight(DX);
      add(U5.glassBox(2.6, 1.4, 0.8), DX, AY + 0.1, 0);
      const tiny = U5.swarm(16, { r: 0.025, color: 0x8c6fd8, w: 2.6, h: 1.4, d: 0.8, speed: 0.6 }); add(tiny.g, DX, AY + 0.1, 0);
      const big = U5.swarm(7, { r: 0.12, color: 0xf0ece0, w: 2.6, h: 1.4, d: 0.8, speed: 0.2, glow: 0.1 }); add(big.g, DX, AY + 0.1, 0);
      const bm = add(U6.beam()); const sp = Array.from({ length: 7 }, () => add(K.glowSprite(0xfff0c0, 0.4)));
      const ruler = add(new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.02, 0.02), M.matte(0x8a93a8, 0.5)), DX, AY - 0.75, 0);
      const rl = [['1 nm', -1.0], ['1000 nm', 1.0]].map(([s, dx]) => grp(tag(s, 0.042, '#ffffff', DX + dx, AY - 0.66, 0.1), 'rl'));
      const l1 = [grp(tag('salt ions: smaller than 1 nm', 0.046, '#c9b0ff', DX, AY - 0.95, 0.1), 'a'), grp(tag('starch particles: 1–1000 nm', 0.046, '#ffffff', DX, AY - 1.13, 0.1), 'a')];
      const l2 = [grp(tag('big enough to scatter the light:', 0.046, '#ffd27a', DX, AY - 0.95, 0.1), 'b'), grp(tag('a colloid ✓', 0.055, '#ffd27a', DX, AY - 1.15, 0.1), 'b')];
      beats.push((t) => {
        const lt = t - ID; tiny.place(lt, (i) => tiny.gas(i, lt)); big.place(lt, (i) => big.gas(i, lt).setY(Math.sin(lt * 0.4 + i) * 0.15));
        const on = span(t, ID + 4.2, ID + 4.8); bm.userData.set(V(DX - 1.5, AY + 0.1, 0), V(DX + 1.5, AY + 0.1, 0), 0.35 * on);
        sp.forEach((s, i) => { const p = big.gas(i, lt).setY(Math.sin(lt * 0.4 + i) * 0.15).add(V(DX, AY + 0.1, 0)); s.position.copy(p); s.visible = on > 0.1; s.material.opacity = 0.7 * on * Math.max(0, 1 - Math.abs(p.y - AY - 0.1) / 0.25); });
        rl.forEach((l) => K.popIn(l, t, ID + 0.4, B1)); l1.forEach((l) => K.popIn(l, t, ID + 0.8, ID + 4.6)); l2.forEach((l) => K.popIn(l, t, ID + 5.0, B1));
      });
    }

    // ================================================================ EXAMPLE 6.6 + PRACTICE 6.2 (dark)
    {
      U.stage((t) => t >= ED - 0.05 && t < B2 - 0.05); keyLight(EX);
      const run = U5.sortBins(U, ['NH₃ (polar)', 'benzene (non-polar)'], [['H₂O', 0], ['C₆H₁₂', 1], ['AgCl', 0], ['CH₃OH', 0]], { x: EX, y: AY - 0.75, t0: ED + 1.4, dt: 1.6, lh: 0.04 });
      const l1 = tag('like dissolves like ✓', 0.055, '#ffd27a', EX, AY + 1.0, 0.1), l2 = tag('Practice 6.2: CH₃OH → a polar solvent', 0.046, '#ffffff', EX, AY + 1.0, 0.1);
      beats.push((t) => { run(t, B2); K.popIn(l2, t, ED + 7.6, ED + 9.6); K.popIn(l1, t, ED + 9.8, B2); });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Salt water and starch water look clear. How to tell them apart?', dockTitle: 'Colloids', intro: INTRO, ticks: TICKS,
      rows: [[0, 'salt water, starch water, a torch, milk, paint'], [1, 'a true solution: no beam'], [1, 'a colloid: the beam shows (Tyndall)'], [1, 'colloid particles: 1–1000 nm'], [1, 'they pass the filter, do not settle'], [1, 'Example 6.6, Practice 6.2']],
      short: ['solution', 'Tyndall', '1–1000 nm', 'no settling', 'Example 6.6'] }));
    return U.finish();
  },
};
