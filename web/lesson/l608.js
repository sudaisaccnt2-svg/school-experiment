// Lesson 608 · Molarity Problems (book p. 163: 6.4.3 problems: Example 6.2 (5.85 g NaCl made up to 500 cm³: molar mass
// 23 + 35.5 = 58.5 g/mol, 0.1 mol, 0.5 dm³, 0.2 M), Example 6.3 (7.50 g CH₃OH in 50.0 cm³: 0.2344 mol, 0.0500 dm³,
// 4.69 M), Practice 6.1 (0.750 g CaCl₂ in 11.6 cm³: no printed answer; 0.583 M, docs/NOTES.md)). v1 as a code lesson
// (2026-11-04), replacing the old Blender film. SKILL.md §0 + §1 + §4 (calculations worked through visibly).
// THE QUESTION (book: "To find the molarity of a solution, you must know the molar mass of the solute"): "How do we work
//   out the molarity of a solution we made?" → card, docked panel, four ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a scale, a dish of salt (NaCl), a 500 cm³ volumetric flask, a jug, a bottle of methanol, a
//         notebook and pencil (named one at a time) · question → card.
//  6.2    "Example 6.2: 5.85 g NaCl made up to 500 cm³" · the dish: "NaCl: 23 + 35.5 = 58.5 g per mole" · the scale
//         weighs 5.85 g "5.85 g ÷ 58.5 g = 0.1 mol (a tenth of a mole)" · into the flask, water to the mark "500 cm³ =
//         0.5 dm³ (half a litre)" → dive: half a 1 dm³ cube with one gold ball (0.1 mol); the other half is added with
//         another ball "a whole dm³ holds 0.2 mol: 0.2 M ✓".
//  6.3    the notebook: moles = 7.50 g ÷ 32.0 g/mol = 0.2344 mol · 50.0 cm³ ÷ 1000 = 0.0500 dm³ · M = 0.2344 ÷ 0.0500 =
//         4.69 M ✓.
//  6.1    Practice 6.1: CaCl₂ = 40 + 2 × 35.5 = 111 g/mol · 0.750 ÷ 111 = 0.00676 mol · 11.6 cm³ = 0.0116 dm³ ·
//         M = 0.00676 ÷ 0.0116 = 0.583 M ✓.
//  END    "Grams ÷ molar mass = moles; moles ÷ dm³ = molarity ✓".
// Game (🎮 Molarity Lab › Molarity: the same steps with other numbers, numericals i–v; docs/COVERAGE_U6.md).
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
const HKX = 0, NAX = HKX - 0.9, SCX = HKX - 0.58, FLX = HKX - 0.22, JGX = HKX + 0.12, MEX = HKX + 0.42, NBX = HKX + 0.72;
const DX = 40;

// ---------------------------------------------------------------- time
const T = { card: 9.4 };
const DOCK = T.card + 5.0;
const E2 = DOCK + 0.4, ID = E2 + 14.6, B1 = ID + 9.0, E3 = B1, P1 = E3 + 9.6, END = P1 + 11.6;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[E2 + 8.4, 0], [ID + 7.6, 1], [E3 + 8.6, 2], [P1 + 10.0, 3]];
const DARK = [[ID, B1]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [7.2, T.card, 'How do we work out the molarity of a solution we made?', [HKX, 0.6, 0.05]],
  [E2 + 0.2, E2 + 2.6, 'Example 6.2: 5.85 g NaCl made up to 500 cm³', [(NAX + FLX) / 2, 0.5, 0.05]],
  [E2 + 13.2, ID - 0.2, 'How much is that in a whole dm³?', [FLX, 0.5, 0.05]],
  [E3 + 0.4, E3 + 2.6, 'Example 6.3: 7.50 g methanol (CH₃OH) in 50.0 cm³', [NBX, 0.25, 0.2]],
  [P1 + 0.2, P1 + 2.2, 'Practice 6.1: 0.750 g CaCl₂ in 11.6 cm³', [NBX, 0.25, 0.2]],
  [END + 0.4, T.done, 'Grams ÷ molar mass = moles; moles ÷ dm³ = molarity ✓', [HKX, 0.6, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX - 0.08, 0.26, 0.1], 2.2 * k, 0.8 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const near = (t, p, w = 0.8, h = 0.65, e, dir = ADIR) => S(t, p, w, h, dir, e);
const P_E2 = [(NAX + FLX) / 2, 0.24, 0.05], P_IN = [FLX, 0.1, 0.0], P_NB = [NBX, 0.02, 0.32], NBDIR = [0, 2.2, 1];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(E2, P_E2, 0.95, 0.65), near(E2 + 9.0, P_E2, 0.93, 0.63), near(E2 + 10.6, [FLX + 0.05, 0.28, 0.05], 0.72, 0.62), near(E2 + 13.0, [FLX + 0.05, 0.28, 0.05], 0.7, 0.6), near(E2 + 14.0, P_IN, 0.3, 0.26), DIVE(ID - 0.05, P_IN),
  DK(ID, DX, 2.8, 2.2, 0.3), DK(ID + 1.8, DX, 2.8, 2.2, 1.04, 'out'), DK(B1 - 0.05, DX, 2.8, 2.2, 0.97),
  S(B1, P_IN, 0.5, 0.45, ADIR, 'out'), near(E3 + 1.0, P_NB, 0.56, 0.42, undefined, NBDIR), near(END - 0.05, P_NB, 0.54, 0.4, undefined, NBDIR), HK(END + 0.4, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

const L = (s, v, t0) => ({ k: 'text', s, x: 0.5, y: v, t0, d: 0.8, size: 48 });
const PAGE = [
  L('moles = 7.50 g ÷ 32.0 g/mol = 0.2344 mol', 0.08, E3 + 2.6), L('50.0 cm³ ÷ 1000 = 0.0500 dm³', 0.19, E3 + 4.2), L('M = 0.2344 ÷ 0.0500 = 4.69 M', 0.3, E3 + 5.8),
  L('CaCl₂ = 40 + 2 × 35.5 = 111 g/mol', 0.5, P1 + 2.4), L('moles = 0.750 ÷ 111 = 0.00676 mol', 0.61, P1 + 4.0), L('11.6 cm³ ÷ 1000 = 0.0116 dm³', 0.72, P1 + 5.6), L('M = 0.00676 ÷ 0.0116 = 0.583 M', 0.83, P1 + 7.2),
];

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '608', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;

    // ================================================================ BENCH
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', HKX - 0.08, 2.4, 1.0);
      add(U5.saltCrystals(0, 0.02), NAX, 0, 0); const salt = add(U6.crystalHeap(0.04, 50, 0xfafaf6), NAX, 0.012, 0);
      const sc = add(U6.digitalScale(), SCX, 0, 0), top = sc.userData.top, pile = add(U6.crystalHeap(0.03, 30, 0xfafaf6), SCX, top, 0); pile.userData.set(0);
      const fl = add(U6.volFlask(0.085), FLX, 0, 0);
      const jug = add(new THREE.Group(), JGX, 0, 0); jug.add(K.labBeaker(0.05, 0.15)); const jl = K.liquid(0.045, 0.11, 0x3d9ee6, 0.45); jl.position.y = 0.012; jug.add(jl);
      const st = add(U6.stream(0x3d9ee6)), pour = U6.pourer(jug, V(JGX, 0, 0), null, V(FLX, 0.35, 0), V(-0.055, 0.15, 0), st, { dur: 1.8 });
      add(K.reagentBottle(0xf0f4f8, 0.22, 0.055, 'CH₃OH'), MEX, 0, 0);
      const nb = add(K.notebook(0.52, 0.38), NBX, 0, 0.32), pen = add(K.pencil(0.22)), write = U5.penWriter(nb, pen, PAGE, V(NBX + 0.32, 0.01, 0.42), nb.position);
      const ls = [['salt (NaCl)', '#ffffff', NAX, 0.13, 0.12], ['a scale', '#ffffff', SCX, 0.13, 0.15], ['a 500 cm³ flask', '#ffffff', FLX, 0.45, 0.08], ['water', '#9fd2ff', JGX, 0.26, 0.08], ['methanol', '#ffffff', MEX, 0.33, 0.08], ['a notebook', '#ffffff', NBX, 0.1, 0.5]].map(([s, c, x, y, z]) => tag(s, 0.042, c, x, y, z));
      const say = (a, b, x, y, t0, t1, g) => ({ l: [grp(tag(a, 0.042, '#ffffff', x, y + 0.04, 0.1), g), ...(b ? [grp(tag(b, 0.045, '#ffd27a', x, y - 0.035, 0.1), g)] : [])], t0, t1 });
      const SAY = [
        say('NaCl: 23 + 35.5', '= 58.5 g per mole', NAX + 0.1, 0.36, E2 + 2.8, E2 + 4.8, 's1'),
        say('5.85 g ÷ 58.5 g = 0.1 mol', '(a tenth of a mole)', (NAX + FLX) / 2, 0.44, E2 + 6.6, E2 + 8.8, 's2'),
        say('500 cm³ = 0.5 dm³', '(half a litre)', FLX - 0.22, 0.4, E2 + 11.4, E2 + 13.0, 's3'),
      ];
      beats.push((t) => {
        const w = ease(span(t, E2 + 4.8, E2 + 6.4)), mv = ease(span(t, E2 + 9.0, E2 + 9.8));
        sc.userData.set((5.85 * w * (1 - (t > E2 + 9.0 ? 1 : 0))).toFixed(2) + ' g'); pile.userData.set(t < E2 + 9.8 ? w : 0);
        pile.position.copy(K.arc(V(SCX, top, 0), V(FLX, 0.35, 0), 0.15, mv)); salt.userData.set(1 - 0.3 * (t > E2 + 4.8));
        const f = t > E2 + 9.6 ? pour(t, E2 + 9.6) : 0; fl.userData.setLevel(t > E2 + 9.8 ? 0.06 + 0.94 * f : 0);
        write(t);
        ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 1.15, 1.5 + i * 1.15)); SAY.forEach(({ l, t0, t1 }) => l.forEach((x) => K.popIn(x, t, t0, t1)));
      });
    }

    // ================================================================ INSIDE (dark) · half a dm³ holds 0.1 mol; a whole dm³ holds 0.2 mol
    {
      U.stage((t) => t >= ID - 0.05 && t < B1 - 0.05); keyLight(DX);
      const C = 1.2, half = (y) => add(U5.glassBox(C, C / 2, C), DX, y, 0);
      const h1 = half(AY - C / 4), h2 = half(AY + C / 4 + 0.004);
      const cube = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(C + 0.02, C + 0.02, C + 0.02)), new THREE.LineBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0 })); add(cube, DX, AY, 0);
      const b1 = add(K.solid(new THREE.SphereGeometry(0.08, 22, 16), M.gloss(0xffc04d)), DX, AY - C / 4, 0), b2 = add(K.solid(new THREE.SphereGeometry(0.08, 22, 16), M.gloss(0xffc04d)), DX, 0, 0);
      const l1 = [grp(tag('our 500 cm³ (half a dm³):', 0.048, '#ffffff', DX, AY - 0.95, 0.1), 'a'), grp(tag('one gold ball = 0.1 mol', 0.05, '#ffd27a', DX, AY - 1.15, 0.1), 'a')];
      const l2 = [grp(tag('a whole dm³ holds 0.2 mol:', 0.048, '#ffffff', DX, AY - 0.95, 0.1), 'b'), grp(tag('0.2 M ✓', 0.06, '#ffd27a', DX, AY - 1.17, 0.1), 'b')];
      beats.push((t) => {
        const a = ease(span(t, ID + 3.6, ID + 5.0)); h2.position.set(DX + 2.2 * (1 - a), AY + C / 4 + 0.004, 0); h2.visible = t > ID + 3.4; b2.visible = h2.visible; b2.position.set(DX + 2.2 * (1 - a) + 0.1 * Math.sin(t), AY + C / 4, 0.1 * Math.cos(t));
        b1.position.set(DX + 0.1 * Math.cos(t * 0.8), AY - C / 4, 0.1 * Math.sin(t * 0.8)); cube.material.opacity = 0.9 * span(t, ID + 5.2, ID + 5.8);
        l1.forEach((l) => K.popIn(l, t, ID + 0.6, ID + 3.6)); l2.forEach((l) => K.popIn(l, t, ID + 5.6, B1));
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'How do we work out the molarity of a solution we made?', dockTitle: 'Problems', intro: INTRO, ticks: TICKS,
      rows: [[0, 'a scale, salt, a 500 cm³ flask, methanol, a notebook'], [1, 'grams ÷ molar mass = moles'], [1, 'moles ÷ dm³ = molarity: 0.2 M'], [1, 'Example 6.3: 4.69 M'], [1, 'Practice 6.1: 0.583 M']],
      short: ['moles', 'Example 6.2', 'Example 6.3', 'Practice 6.1'] }));
    return U.finish();
  },
};
