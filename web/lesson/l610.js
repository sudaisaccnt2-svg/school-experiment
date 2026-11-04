// Lesson 610 · Dilution: M₁V₁ = M₂V₂ (book p. 165: Scientific Information, the dilution equation (M₁, V₁ the stock;
// M₂, V₂ the diluted solution); Example 6.4 (30 cm³ of 2.5 M CaCO₃ diluted to 280 cm³ → 0.267 M, as printed; CaCO₃ hardly
// dissolves in water, docs/NOTES.md); Example 6.5 (85 cm³ of 3.5 M Na₂CO₃ to 0.41 M → V₂ = 725.60 cm³, add 640.60 cm³)).
// v1 as a code lesson (2026-11-04), replacing the old Blender film. SKILL.md §0 + §1 + §4.
// THE QUESTION: "How do we make a weaker solution from a strong one?" → card, docked panel, four ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a bottle of stock solution 2.5 M, a 100 cm³ cylinder, a 500 cm³ cylinder, a jug of water, a
//         notebook (named one at a time) · question → card.
//  MIX    30 cm³ of the stock is measured in the small cylinder "V₁ = 30 cm³ of M₁ = 2.5 M" · poured into the big one,
//         water added up to 280 cm³ "water up to V₂ = 280 cm³" → dive (dark): a small box of 30 cm³ with 15 gold balls,
//         a big box with the same 15 balls spread out "the same solute, more water: M₁ × V₁ = M₂ × V₂ ✓".
//  6.4    the notebook: M₂ = M₁V₁ ÷ V₂ → = 2.5 × 30 ÷ 280 → = 0.267 M ✓.
//  6.5    V₂ = M₁V₁ ÷ M₂ → = 3.5 × 85 ÷ 0.41 → = 725.60 cm³ · water to add = 725.60 − 85 = 640.60 cm³ ✓.
//  END    "Diluting adds solvent; the moles of solute stay the same ✓".
// Game (🎮 Molarity Lab › Dilute, docs/COVERAGE_U6.md): more dilution problems.
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
const HKX = 0, SBX = HKX - 0.62, C1X = HKX - 0.32, C2X = HKX + 0.02, JGX = HKX + 0.32, NBX = HKX + 0.62;
const DX = 40;

// ---------------------------------------------------------------- time
const T = { card: 8.8 };
const DOCK = T.card + 5.0;
const A0 = DOCK + 0.4, ID = A0 + 13.0, B1 = ID + 8.6, E4 = B1, E5 = E4 + 7.4, END = E5 + 10.0;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[A0 + 3.6, 0], [ID + 6.6, 1], [E4 + 6.6, 2], [E5 + 8.6, 3]];
const DARK = [[ID, B1]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [6.6, T.card, 'How do we make a weaker solution from a strong one?', [HKX, 0.62, 0.05]],
  [A0 + 11.6, ID - 0.2, 'What happened to the solute?', [C2X, 0.55, 0.05]],
  [E4 + 0.4, E4 + 2.4, 'Example 6.4: 30 cm³ of 2.5 M CaCO₃ to 280 cm³', [NBX, 0.25, 0.2]],
  [E5 + 0.2, E5 + 2.2, 'Example 6.5: 85 cm³ of 3.5 M Na₂CO₃ to 0.41 M', [NBX, 0.25, 0.2]],
  [END + 0.4, T.done, 'Diluting adds solvent; the moles of solute stay the same ✓', [HKX, 0.62, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX, 0.28, 0.1], 1.6 * k, 0.8 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const near = (t, p, w = 0.8, h = 0.65, e, dir = ADIR) => S(t, p, w, h, dir, e);
const P_A = [(SBX + C2X) / 2 + 0.05, 0.42, 0.05], P_IN = [C2X, 0.2, 0.0], P_NB = [NBX, 0.02, 0.32], NBDIR = [0, 2.2, 1];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(A0, P_A, 1.0, 0.98), near(A0 + 11.4, P_A, 0.97, 0.95), near(A0 + 12.4, P_IN, 0.22, 0.2), DIVE(ID - 0.05, P_IN),
  DK(ID, DX, 3.6, 2.2, 0.3), DK(ID + 1.8, DX, 3.6, 2.2, 1.04, 'out'), DK(B1 - 0.05, DX, 3.6, 2.2, 0.97),
  S(B1, P_IN, 0.5, 0.45, ADIR, 'out'), near(E4 + 1.0, P_NB, 0.56, 0.42, undefined, NBDIR), near(END - 0.05, P_NB, 0.54, 0.4, undefined, NBDIR), HK(END + 0.4, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

const L = (s, v, t0) => ({ k: 'text', s, x: 0.5, y: v, t0, d: 0.8, size: 48 });
const PAGE = [
  L('M₁V₁ = M₂V₂', 0.08, E4 + 2.4), L('M₂ = 2.5 × 30 ÷ 280 = 0.267 M', 0.2, E4 + 4.0),
  L('V₂ = M₁V₁ ÷ M₂', 0.42, E5 + 2.4), L('= 3.5 × 85 ÷ 0.41 = 725.60 cm³', 0.54, E5 + 4.0), L('water to add = 725.60 − 85', 0.7, E5 + 5.6), L('= 640.60 cm³', 0.82, E5 + 7.0),
];

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '610', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;

    // ================================================================ BENCH
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', HKX, 1.8, 1.0);
      const sb = add(new THREE.Group(), SBX, 0, 0); sb.add(K.reagentBottle(0xcfe4ff, 0.24, 0.065, '2.5 M stock'));
      const c1 = add(U6.gradCylinder(100), C1X, 0, 0), c2 = add(U6.gradCylinder(500, 0.05, 0.42), C2X, 0, 0);
      const jug = add(new THREE.Group(), JGX, 0, 0); jug.add(K.beaker(0.05, 0.15)); const jl = K.liquid(0.045, 0.11, 0x3d9ee6, 0.45); jl.position.y = 0.012; jug.add(jl);
      const st = add(U6.stream(0xcfe4ff)), st2 = add(U6.stream(0x3d9ee6));
      const nb = add(K.notebook(0.52, 0.38), NBX, 0, 0.32), pen = add(K.pencil(0.22)), write = U5.penWriter(nb, pen, PAGE, V(NBX + 0.32, 0.01, 0.42), nb.position);
      const pS = U6.pourer(sb, V(SBX, 0, 0), null, V(C1X, 0.37, 0), V(0.02, 0.24, 0), st, { dur: 1.2, tilt: 2.0, side: -1 });
      const pC = U6.pourer(c1, V(C1X, 0, 0), null, V(C2X, 0.45, 0), V(0.03, 0.36, 0), st, { dur: 1.0, tilt: 2.2, side: -1 });
      const pW = U6.pourer(jug, V(JGX, 0, 0), null, V(C2X, 0.45, 0), V(-0.055, 0.15, 0), st2, { dur: 2.4 });
      const ls = [['a stock solution, 2.5 M', '#ffffff', SBX, 0.34, 0.08], ['a 100 cm³ cylinder', '#ffffff', C1X, 0.44, 0.08], ['a 500 cm³ cylinder', '#ffffff', C2X, 0.53, 0.08], ['water', '#9fd2ff', JGX, 0.26, 0.08], ['a notebook', '#ffffff', NBX, 0.1, 0.5]].map(([s, c, x, y, z]) => tag(s, 0.04, c, x, y, z));
      const l1 = [grp(tag('V₁ = 30 cm³', 0.045, '#ffffff', C1X - 0.05, 0.5, 0.08), 'v1'), grp(tag('of M₁ = 2.5 M', 0.045, '#ffd27a', C1X - 0.05, 0.43, 0.08), 'v1')];
      const l2 = tag('water up to V₂ = 280 cm³', 0.045, '#9fd2ff', C2X - 0.3, 0.42, 0.1);
      beats.push((t) => {
        const s = t > A0 + 0.6 ? pS(t, A0 + 0.6) : 0, c = t > A0 + 4.4 ? pC(t, A0 + 4.4) : 0, w = t > A0 + 7.6 ? pW(t, A0 + 7.6) : 0;
        c1.userData.set(30 * s * (1 - c), 0x6fa8f0); c2.userData.set(30 * c + 250 * w, w > 0.05 ? 0x9cc8f4 : 0x6fa8f0);
        write(t);
        ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 1.2, 1.5 + i * 1.2)); l1.forEach((l) => K.popIn(l, t, A0 + 2.6, A0 + 4.4)); K.popIn(l2, t, A0 + 9.0, A0 + 11.4);
      });
    }

    // ================================================================ INSIDE (dark) · the same solute in more water
    {
      U.stage((t) => t >= ID - 0.05 && t < B1 - 0.05); keyLight(DX);
      const SX = DX - 1.1, BX = DX + 0.7;
      add(U5.glassBox(0.7, 0.7, 0.6), SX, AY - 0.4, 0); add(U5.glassBox(1.6, 1.6, 0.8), BX, AY + 0.05, 0);
      const a = U5.swarm(15, { r: 0.06, color: 0xffc04d, w: 0.7, h: 0.7, d: 0.6, speed: 0.3 }), b = U5.swarm(15, { r: 0.06, color: 0xffc04d, w: 1.6, h: 1.6, d: 0.8, speed: 0.3 });
      add(a.g, SX, AY - 0.4, 0); add(b.g, BX, AY + 0.05, 0);
      const n = [grp(tag('30 cm³ of 2.5 M', 0.045, '#ffffff', SX, AY + 0.2, 0.1), 'n'), grp(tag('280 cm³ after', 0.045, '#ffffff', BX, AY + 1.0, 0.1), 'n')];
      const l1 = [grp(tag('the same solute, more water:', 0.048, '#ffffff', DX, AY - 0.95, 0.1), 'e'), grp(tag('M₁ × V₁ = M₂ × V₂ ✓', 0.058, '#ffd27a', DX, AY - 1.17, 0.1), 'e')];
      beats.push((t) => { const lt = t - ID; a.place(lt, (i) => a.gas(i, lt)); b.place(lt, (i) => b.gas(i, lt)); b.g.visible = t > ID + 2.4; n.forEach((l) => K.popIn(l, t, ID + 0.6, ID + 4.4)); l1.forEach((l) => K.popIn(l, t, ID + 4.6, B1)); });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'How do we make a weaker solution from a strong one?', dockTitle: 'Dilution', intro: INTRO, ticks: TICKS,
      rows: [[0, 'a 2.5 M stock, two cylinders, water'], [1, 'measure V₁ of the stock (M₁)'], [1, 'the same solute in more water: M₁V₁ = M₂V₂'], [1, 'Example 6.4: 0.267 M'], [1, 'Example 6.5: add 640.60 cm³']],
      short: ['V₁ of M₁', 'M₁V₁ = M₂V₂', 'Example 6.4', 'Example 6.5'] }));
    return U.finish();
  },
};
