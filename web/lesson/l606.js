// Lesson 606 · Percentage Composition (book pp. 159–161: 6.4.1 percentage composition (parts of solute in 100 parts of
// solution), the four ways: i mass by mass (10 g sugar in 90 g solvent → 100 g), ii mass by volume (10 g NaCl made up to
// 100 cm³; the total mass not considered), iii volume by mass (10 cm³ alcohol, water to a total mass of 100 g; the volume
// not considered), iv volume by volume (10 cm³ alcohol made up to 100 cm³); the four formulas). v1 as a code lesson
// (2026-11-04), replacing the old Blender film. SKILL.md §0 + §1 + §4.
// THE QUESTION (book: "10 % solution of sugar by mass means …"): "What does '10 %' on a solution mean?" → five ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a digital scale with an empty beaker, sugar, salt, a bottle of alcohol, a jug of water, a 100 cm³
//         measuring cylinder (named one at a time) · question → card.
//  M/M    sugar onto the beaker on the scale: 10.0 g; water poured in until it reads 100.0 g "10 g sugar + 90 g water =
//         100 g of solution" "10 g in 100 g: 10 % by mass (m/m) ✓" → dive: a 10 × 10 grid, 10 of them gold "10 parts of
//         solute in every 100 parts of solution ✓".
//  M/V    10 g of salt into the cylinder, water poured to the 100 mark "10 g in 100 cm³: 10 % m/v ✓ (the mass of the
//         solution is not counted)".
//  V/M    the cylinder is emptied, 10 cm³ alcohol is measured and poured into a beaker on the scale; water until it reads
//         100.0 g "10 cm³ in 100 g: 10 % v/m ✓ (the volume is not counted)".
//  V/V    10 cm³ alcohol in the cylinder, water to the 100 mark "10 cm³ in 100 cm³: 10 % v/v ✓".
//  END    "A percentage: parts of solute in 100 parts of solution ✓".
// Game (🎮 Molarity Lab + Solution Lab, docs/COVERAGE_U6.md): the four formulas, more numbers.
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
const HKX = 0, SGX = HKX - 1.08, SCX = HKX - 0.76, NAX = HKX - 0.46, CYX = HKX - 0.2, JGX = HKX + 0.08, SC2X = HKX + 0.38, C2X = HKX + 0.68, ALX = HKX + 0.96;
const DX = 40;

// ---------------------------------------------------------------- time
const T = { card: 9.6 };
const DOCK = T.card + 5.0;
const A0 = DOCK + 0.4, ID = A0 + 11.0, B1 = ID + 6.0, M0 = B1, V0 = M0 + 11.0, W0 = V0 + 13.4, END = W0 + 10.4;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[A0 + 9.8, 0], [ID + 4.6, 1], [M0 + 9.6, 2], [V0 + 12.0, 3], [W0 + 9.0, 4]];
const DARK = [[ID, B1]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [7.6, T.card, 'What does “10 %” on a solution mean?', [HKX, 0.6, 0.05]],
  [A0 + 0.2, A0 + 2.0, 'i. by mass of both (m/m)', [SCX, 0.4, 0.05]],
  [M0 + 0.4, M0 + 2.2, 'ii. mass of solute, volume of solution (m/v)', [CYX, 0.5, 0.05]],
  [V0 + 0.2, V0 + 2.0, 'iii. volume of solute, mass of solution (v/m)', [SC2X + 0.1, 0.55, 0.05]],
  [W0 + 0.2, W0 + 2.0, 'iv. by volume of both (v/v)', [C2X, 0.5, 0.05]],
  [END + 0.4, T.done, 'A percentage: parts of solute in 100 parts of solution ✓', [HKX, 0.6, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX - 0.06, 0.25, 0.05], 2.4 * k, 0.75 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const near = (t, p, w = 0.8, h = 0.65, e) => S(t, p, w, h, ADIR, e);
const P_SC = [SCX + 0.08, 0.22, 0.05], P_IN = [SCX, 0.11, 0.02], P_CY = [CYX - 0.1, 0.25, 0.05], P_C2 = [C2X - 0.05, 0.25, 0.05], P_S2 = [SC2X + 0.1, 0.22, 0.05];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(A0, P_SC, 0.85, 0.7), near(A0 + 10.0, P_SC, 0.82, 0.68), near(A0 + 10.6, P_IN, 0.24, 0.2), DIVE(ID - 0.05, P_IN),
  DK(ID, DX, 2.6, 2.4, 0.3), DK(ID + 1.6, DX, 2.6, 2.4, 1.04, 'out'), DK(B1 - 0.05, DX, 2.6, 2.4, 0.98),
  S(B1, P_IN, 0.3, 0.26, ADIR, 'out'), near(M0 + 1.2, P_CY, 0.85, 0.75), near(V0 - 0.05, P_CY, 0.82, 0.72), near(V0 + 0.6, P_S2, 0.95, 0.75), near(W0 - 0.05, P_S2, 0.92, 0.72),
  near(W0 + 0.6, P_C2, 0.85, 0.75), near(END - 0.05, P_C2, 0.82, 0.72), HK(END + 0.4, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '606', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;

    // ================================================================ BENCH
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', HKX - 0.03, 2.8, 0.85);
      const sc = add(U6.digitalScale(), SCX, 0, 0), top = sc.userData.top, sc2 = add(U6.digitalScale(), SC2X, 0, 0);
      const beakerOn = (x, c = 0x3d9ee6) => { const b = add(new THREE.Group(), x, top + 0.002, 0); b.add(K.beaker(0.07, 0.17)); const l = K.liquid(0.065, 0.12, c, 0.45); l.position.y = 0.012; b.add(l); l.visible = false; return l; };
      const bl = beakerOn(SCX), bl2 = beakerOn(SC2X, 0xa8d0f8);
      const bs = U6.crystalHeap(0.03, 30); bs.position.set(SCX, top + 0.014, 0); U.root.add(bs); bs.visible = false;
      add(U5.saltCrystals(0, 0.02), SGX, 0, 0); const sug = add(U6.crystalHeap(0.035, 40), SGX, 0.012, 0);
      add(U5.saltCrystals(0, 0.02), NAX, 0, 0); const salt = add(U6.crystalHeap(0.035, 40, 0xfafaf6), NAX, 0.012, 0);
      const jug = add(new THREE.Group(), JGX, 0, 0); jug.add(K.beaker(0.05, 0.15)); const jl = K.liquid(0.045, 0.11, 0x3d9ee6, 0.45); jl.position.y = 0.012; jug.add(jl);
      const cy = add(U6.gradCylinder(100), CYX, 0, 0), cy2 = add(U6.gradCylinder(100), C2X, 0, 0);
      const al = add(new THREE.Group(), ALX, 0, 0); al.add(K.reagentBottle(0xf0f4f8, 0.22, 0.055, 'alcohol'));
      const st1 = add(U6.stream(0x3d9ee6)), st2 = add(U6.stream(0xe8f0ff));
      const carry = add(U6.crystalHeap(0.025, 25)); carry.visible = false;
      const ls = [['a scale and a beaker', '#ffffff', SCX, 0.3, 0.1], ['sugar', '#ffffff', SGX, 0.12, 0.12], ['salt (NaCl)', '#ffffff', NAX, 0.12, 0.12], ['a 100 cm³ measuring cylinder', '#ffffff', CYX, 0.44, 0.08], ['water', '#9fd2ff', JGX, 0.26, 0.1], ['a second scale and beaker', '#ffffff', SC2X, 0.3, 0.1], ['a second cylinder, alcohol', '#ffffff', (C2X + ALX) / 2, 0.44, 0.08]].map(([s, c, x, y, z]) => tag(s, 0.042, c, x, y, z));
      const say = (a, b, x, y, t0, t1, g) => ({ l: [grp(tag(a, 0.042, '#ffffff', x, y + 0.04, 0.1), g), ...(b ? [grp(tag(b, 0.045, '#ffd27a', x, y - 0.035, 0.1), g)] : [])], t0, t1 });
      const SAY = [
        say('10 g sugar + 90 g water = 100 g', null, SCX, 0.42, A0 + 7.2, A0 + 8.8, 'a1'),
        say('10 g in 100 g of solution:', '10 % by mass (m/m) ✓', SCX, 0.42, A0 + 9.0, A0 + 10.6, 'a2'),
        say('10 g in 100 cm³ of solution:', '10 % m/v ✓ (its mass not counted)', CYX, 0.52, M0 + 7.4, V0, 'm'),
        say('10 cm³ in 100 g of solution:', '10 % v/m ✓ (its volume not counted)', SC2X, 0.44, V0 + 10.0, W0, 'v'),
        say('10 cm³ in 100 cm³ of solution:', '10 % v/v ✓', C2X, 0.52, W0 + 6.8, END, 'w'),
      ];
      // pouring left (side 1: the jug stands to the right of its target) or right (side −1)
      const lipL = V(-0.055, 0.15, 0), lipR = V(0.055, 0.15, 0);
      const pJ1 = U6.pourer(jug, V(JGX, 0, 0), V(SCX + 0.15, top + 0.2, 0), V(SCX, top + 0.17, 0), lipL, st1, { dur: 2.0 });
      const pJ2 = U6.pourer(jug, V(JGX, 0, 0), V(CYX + 0.13, 0.4, 0), V(CYX, 0.36, 0), lipL, st1, { dur: 2.0 });
      const pJ3 = U6.pourer(jug, V(JGX, 0, 0), V(SC2X - 0.15, top + 0.2, 0), V(SC2X, top + 0.17, 0), lipR, st1, { dur: 2.0, side: -1 });
      const pJ4 = U6.pourer(jug, V(JGX, 0, 0), V(C2X - 0.13, 0.4, 0), V(C2X, 0.36, 0), lipR, st1, { dur: 2.0, side: -1 });
      const pA = U6.pourer(al, V(ALX, 0, 0), V(C2X + 0.12, 0.4, 0), V(C2X, 0.36, 0), V(-0.022, 0.22, 0), st2, { dur: 1.0, tilt: 2.0 });
      const pC = U6.pourer(cy2, V(C2X, 0, 0), V(SC2X + 0.12, top + 0.22, 0), V(SC2X, top + 0.17, 0), V(-0.03, 0.36, 0), st2, { dur: 1.2, tilt: 2.2 });
      beats.push((t) => {
        // i m/m: sugar is carried onto the beaker (10.0 g), water poured until 100.0 g
        const sa = ease(span(t, A0 + 0.6, A0 + 1.6)); carry.visible = t > A0 + 0.6 && t < A0 + 1.7; carry.position.copy(K.arc(V(SGX, 0.02, 0), V(SCX, top + 0.2, 0), 0.15, sa));
        bs.visible = t > A0 + 1.6; bs.userData.set(1 - ease(span(t, A0 + 5.0, A0 + 7.0)));
        const f1 = t > A0 + 2.2 ? (t < M0 ? pJ1(t, A0 + 2.2) : 1) : 0; bl.visible = f1 > 0.01; bl.scale.y = Math.max(1e-3, f1);
        sc.userData.set(((t > A0 + 1.6 ? 10 : 0) + 90 * f1).toFixed(1) + ' g');
        // ii m/v: 10 g salt into cylinder 1, water to the 100 mark
        const s2 = ease(span(t, M0 + 0.6, M0 + 1.8)); carry.visible ||= t > M0 + 0.6 && t < M0 + 2.4; if (t > M0 + 0.6 && t < M0 + 2.4) { carry.position.copy(K.arc(V(NAX, 0.02, 0), V(CYX, 0.38, 0), 0.15, s2)); carry.position.y -= 0.3 * ease(span(t, M0 + 1.8, M0 + 2.4)); }
        const f2 = t > M0 ? (t < V0 ? pJ2(t, M0 + 3.0) : 1) : 0; cy.userData.set(t > M0 + 2.4 ? 5 + 95 * f2 : 0, 0x3d9ee6);
        // iii v/m: 10 cm³ alcohol measured in cylinder 2, poured into the beaker on scale 2, water until 100.0 g
        const fa = t > V0 ? (t < W0 ? pA(t, V0 + 0.8) : 1) : 0, fc = t > V0 + 3.8 ? (t < W0 ? pC(t, V0 + 3.8) : 1) : 0, fw = t > V0 + 7.0 ? (t < W0 ? pJ3(t, V0 + 7.0) : 1) : 0;
        bl2.visible = fc + fw > 0.01; bl2.scale.y = Math.max(1e-3, 0.1 * fc + 0.9 * fw); sc2.userData.set((8 * fc + 92 * fw).toFixed(1) + ' g');
        // iv v/v: cylinder 2 (now empty) gets 10 cm³ alcohol, then water to the mark
        const ga = t > W0 ? pA(t, W0 + 0.6) : 0, gw = t > W0 + 3.4 ? pJ4(t, W0 + 3.4) : 0;
        cy2.userData.set(t < W0 ? 10 * fa * (1 - fc) : 10 * ga + 90 * gw, gw > 0.05 ? 0xa8d0f8 : 0xe8f0ff);
        sug.userData.set(t > A0 + 0.6 ? 0.6 : 1); salt.userData.set(t > M0 + 0.6 ? 0.6 : 1); jl.scale.y = 1 - 0.15 * ((f1 + f2 + fw + gw));
        ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 1.05, 1.4 + i * 1.05)); SAY.forEach(({ l, t0, t1 }) => l.forEach((x) => K.popIn(x, t, t0, t1)));
      });
    }

    // ================================================================ INSIDE (dark) · 10 parts in every 100
    {
      U.stage((t) => t >= ID - 0.05 && t < B1 - 0.05); keyLight(DX);
      const gold = [3, 17, 22, 38, 45, 51, 64, 76, 83, 99], dots = Array.from({ length: 100 }, (_, i) => { const b = add(K.solid(new THREE.SphereGeometry(0.07, 14, 10), M.gloss(gold.includes(i) ? 0xffc04d : 0x59a8ff)), DX + (i % 10 - 4.5) * 0.19, AY + 0.1 + (Math.floor(i / 10) - 4.5) * 0.17, 0); return b; });
      const l1 = [grp(tag('10 parts of solute in every', 0.05, '#ffffff', DX, AY - 0.97, 0.1), 'p'), grp(tag('100 parts of solution: 10 % ✓', 0.05, '#ffd27a', DX, AY - 1.17, 0.1), 'p')];
      beats.push((t) => { dots.forEach((b, i) => { if (gold.includes(i)) b.scale.setScalar(1 + 0.35 * bump(t, ID + 1.2 + 0.25 * gold.indexOf(i), 0.4)); }); l1.forEach((l) => K.popIn(l, t, ID + 1.4, B1)); });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'What does “10 %” on a solution mean?', dockTitle: 'Percentage', intro: INTRO, ticks: TICKS,
      rows: [[0, 'a scale, sugar, salt, alcohol, water, a cylinder'], [1, 'i. 10 g in 100 g: m/m'], [1, 'parts of solute in 100 parts'], [1, 'ii. 10 g in 100 cm³: m/v'], [1, 'iii. 10 cm³ in 100 g: v/m'], [1, 'iv. 10 cm³ in 100 cm³: v/v']],
      short: ['m/m', 'parts in 100', 'm/v', 'v/m', 'v/v'] }));
    return U.finish();
  },
};
