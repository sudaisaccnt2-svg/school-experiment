// Lesson 504 · Boyle's Law (book pp. 126–129: 5.2 Laws related to gases, 5.2.1 Boyle's law (1662), V ∝ 1/P, PV = Kb,
// P₁V₁ = P₂V₂, Fig. 5.4 experimental verification, Fig. 5.5 the curve, Fig. 5.6, Example 5.1, Practice 5.1).
// v1 as a code lesson (2026-11-04), replacing the old Blender film. SKILL.md §0 + §1 + §4.
// THE QUESTION (book: "relationship between the volume and pressure of a gas at constant temperature"): "Press a gas
//   harder: what happens to its volume?" → card, docked panel, five ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: the Fig. 5.4 rig (a gas shut in a glass cylinder under a piston, a pressure gauge, a
//         thermometer) and a notebook with a pencil (named one at a time) · the question → card.
//  PRESS  readings held "P = 1 atm · V = 8 dm³" · the T handle turns, the piston goes down, the needle climbs "P = 2 atm
//         · V = 4 dm³" "pressure ×2 → volume ÷2 ✓" · again "P = 4 atm · V = 2 dm³" "P × V = 8 every time · PV = K
//         (same temperature) ✓" · "Why does it push back harder?" → dive INTO the cylinder.
//  INSIDE (dark) the same molecules under the piston; the piston comes down to half; sparks where they hit the walls
//         come twice as often "half the space: twice the hits on the walls: more pressure ✓".
//  GRAPH  back on the table: the pencil plots the three readings and joins them "V falls as P rises: a curve
//         (Fig. 5.5) ✓".
//  EX 5.1 the rig is set to "P₁ = 800 mm Hg · V₁ = 530 dm³" · "Example 5.1: 400 mm Hg. New volume?" · the handle turns
//         back, the piston rises to twice the height · the pencil writes P₁V₁ = P₂V₂ → V₂ = P₁V₁ / P₂ → = 800 × 530 / 400
//         → = 1060 dm³ · on the rig "V₂ = 1060 dm³ ✓".
//  PR 5.1 "P₂ = 3 atm · V₂ = 70.4 cm³" · the handle lifts to 1.20 atm, the gas grows · V₁ = P₂V₂ / P₁ → = 3 × 70.4 /
//         1.20 → = 176 cm³ ✓ (the old film printed 70.4 → 176 the same way).
//  END    "Press harder, the gas gets smaller: PV stays the same ✓".
// Game (🎮 Matter Practice › Words + Facts; 🎮 Gas Law Lab › Boyle, docs/COVERAGE_U5.md): Fig. 5.6, more numericals, Robert Boyle 1662, the STS balloon box.
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U5.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
import * as U5 from './u5kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, RGX = HKX - 0.32, NBX = HKX + 0.5, PNX = HKX + 0.9;          // the rig · notebook · pencil rest
const CX = 40;                                                              // (dark) inside the cylinder

// ---------------------------------------------------------------- time
const T = { card: 9.4 };
const DOCK = T.card + 5.0;
const S1 = DOCK + 0.6, S2 = S1 + 10.2, ID = S2 + 11.0, B1 = ID + 9.0, EX = B1 + 11.4, PR = EX + 16.4, END = PR + 14.6;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[S1 + 9.0, 0], [S2 + 7.6, 1], [B1 + 10.0, 2], [EX + 15.0, 3], [PR + 13.4, 4]];
const DARK = [[ID, B1]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [6.2, T.card, 'Press a gas harder: what happens to its volume?', [HKX, 0.92, 0.05]],
  [S2 + 8.8, ID - 0.3, 'Why does it push back harder?', [RGX, 0.85, 0.05]],
  [EX + 2.8, EX + 5.2, 'Example 5.1: down to 400 mm Hg. New volume?', [RGX, 0.92, 0.05]],
  [PR + 0.2, PR + 2.6, 'Practice 5.1: 70.4 cm³ at 3 atm. At 1.20 atm?', [RGX, 0.92, 0.05]],
  [END + 0.4, T.done, 'Press harder, the gas gets smaller: PV stays the same ✓', [HKX, 0.92, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX + 0.1, 0.36, 0.05], 2.0 * k, 0.95 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const P_RG = [RGX + 0.14, 0.48, 0.05], P_CY = [RGX, 0.25, 0.0], P_NB = [NBX, 0.02, 0.05], P_BOTH = [(RGX + NBX) / 2 + 0.05, 0.3, 0.05];
const near = (t, p, w = 0.8, h = 0.65, e, dir = ADIR) => S(t, p, w, h, dir, e);
const NBDIR = [0, 1.2, 1];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(S1, P_RG, 1.35, 1.1), near(S2 + 8.6, P_RG, 1.3, 1.05), near(S2 + 10.0, P_CY, 0.3, 0.26), DIVE(ID - 0.05, P_CY),
  DK(ID, CX, 2.2, 2.4, 0.3), DK(ID + 1.6, CX, 2.2, 2.4, 1.04, 'out'), DK(B1 - 0.05, CX, 2.2, 2.4, 0.98),
  S(B1, P_CY, 0.1, 0.08, ADIR, 'out'), near(B1 + 1.4, P_NB, 0.75, 0.55, undefined, NBDIR), near(EX - 0.05, P_NB, 0.72, 0.52, undefined, NBDIR),
  near(EX + 0.4, P_RG, 1.35, 1.1), near(EX + 7.2, P_RG, 1.3, 1.05), near(EX + 7.6, P_NB, 0.62, 0.46, undefined, NBDIR), near(EX + 13.1, P_NB, 0.6, 0.44, undefined, NBDIR),
  near(EX + 13.3, P_RG, 1.35, 1.1), near(PR + 6.6, P_RG, 1.3, 1.05), near(PR + 6.8, P_NB, 0.62, 0.46, undefined, NBDIR), near(PR + 11.2, P_NB, 0.6, 0.44, undefined, NBDIR),
  near(PR + 11.4, P_RG, 1.35, 1.1), near(END - 0.05, P_RG, 1.3, 1.05), HK(END + 0.4, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

// the gas column (rig units: 0.05 … 0.5) and the gauge needle (0 … 1) along the lesson
const H8 = 0.48;
const steps = [[0, H8, 0.2], [S1 + 2.4, H8, 0.2], [S1 + 4.4, H8 / 2, 0.4], [S2, H8 / 2, 0.4], [S2 + 2.0, H8 / 4, 0.8], [EX - 0.4, H8 / 4, 0.8], [EX + 0.2, 0.24, 0.8], [EX + 5.4, 0.24, 0.8], [EX + 7.4, 0.48, 0.4],
  [PR - 0.4, 0.48, 0.4], [PR + 0.2, 0.192, 0.75], [PR + 3.0, 0.192, 0.75], [PR + 5.0, 0.48, 0.3], [T.done, 0.48, 0.3]];
const rigAt = (t) => { let i = 0; while (i < steps.length - 2 && t >= steps[i + 1][0]) i++; const [a, h0, p0] = steps[i], [b, h1, p1] = steps[i + 1], u = ease(span(t, a, b)); return [lerp(h0, h1, u), lerp(p0, p1, u)]; };

// the notebook page: the graph (left half) and the two calculations (right half), written by the pencil in time
const GP = (P, Vv) => [0.08 + P / 4.5 * 0.36, 0.9 - Vv / 9 * 0.78];
const PAGE = (() => {
  const g0 = B1 + 1.6, it = [{ k: 'line', x: 0.08, y: 0.9, x1: 0.47, y1: 0.9, t0: g0, d: 0.5 }, { k: 'line', x: 0.08, y: 0.9, x1: 0.08, y1: 0.1, t0: g0 + 0.7, d: 0.5 },
    { k: 'text', s: 'P', x: 0.47, y: 0.96, t0: g0 + 1.3, size: 44 }, { k: 'text', s: 'V', x: 0.04, y: 0.1, t0: g0 + 1.6, size: 44 }];
  [[1, 8], [2, 4], [4, 2]].forEach(([P, Vv], k) => { const [x, y] = GP(P, Vv); it.push({ k: 'dot', x, y, t0: g0 + 2.2 + 0.6 * k }); });
  const pts = Array.from({ length: 11 }, (_, k) => { const P = 0.95 + k * 0.33; return GP(P, 8 / P); });
  pts.slice(1).forEach(([x1, y1], k) => it.push({ k: 'line', x: pts[k][0], y: pts[k][1], x1, y1, t0: g0 + 4.2 + 0.22 * k, d: 0.22, w: 5 }));
  const L = (s, v, t0) => ({ k: 'text', s, x: 0.75, y: v, t0, d: 0.8, size: 50 });
  it.push(L('P₁V₁ = P₂V₂', 0.12, EX + 7.6), L('V₂ = P₁V₁ / P₂', 0.24, EX + 9.0), L('= 800 × 530 / 400', 0.36, EX + 10.6), L('= 1060 dm³', 0.48, EX + 12.2));
  it.push(L('V₁ = P₂V₂ / P₁', 0.64, PR + 7.0), L('= 3 × 70.4 / 1.20', 0.76, PR + 8.6), L('= 176 cm³', 0.88, PR + 10.2));
  return it;
})();

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '504', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;

    // ================================================================ BENCH · the Fig. 5.4 rig, a notebook and a pencil
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', HKX + 0.15, 2.1, 0.8);
      const rig = add(U5.boyleRig(), RGX, 0, 0), nb = add(K.notebook(0.62, 0.44), NBX, 0, 0.02), pen = add(K.pencil(0.24));
      const write = U5.penWriter(nb, pen, PAGE, V(PNX, 0.01, 0.12), nb.position);
      const G = rig.userData.gauge.clone().add(V(RGX, 0, 0)), Cy = V(RGX - 0.02, 0.62, 0.1), Gl = V(G.x + 0.14, G.y + 0.12, 0.1), Cl = V(RGX - 0.25, 0.62, 0.1);
      const ls = [['a gas shut in a cylinder', '#9fc4ff', RGX - 0.05, 0.75, 0.1], ['a pressure gauge', '#ffffff', G.x + 0.05, G.y + 0.15, 0.1], ['thermometer: same temperature', '#ffb0a0', RGX + 0.02, 0.45, 0.12], ['a notebook and a pencil', '#ffffff', NBX, 0.16, 0.25]]
        .map(([s, c, x, y, z]) => tag(s, 0.045, c, x, y, z));
      const pair = (a, b, g, t0, t1) => ({ l: [grp(tag(a, 0.05, '#ffffff', Gl.x, Gl.y, Gl.z), g), grp(tag(b, 0.05, '#9fc4ff', Cl.x, Cl.y, Cl.z), g)], t0, t1 });
      const R1 = [pair('P = 1 atm', 'V = 8 dm³', 'r1', S1 + 0.2, S1 + 2.3), pair('P = 2 atm', 'V = 4 dm³', 'r2', S1 + 4.6, S1 + 7.0), pair('P = 4 atm', 'V = 2 dm³', 'r3', S2 + 2.2, S2 + 4.6),
        pair('P₁ = 800 mm Hg', 'V₁ = 530 dm³', 'e1', EX + 0.4, EX + 2.6), pair('P₂ = 400 mm Hg', 'V₂ = ?', 'e2', EX + 5.6, EX + 7.4), pair('P₂ = 3 atm', 'V₂ = 70.4 cm³', 'p1', PR + 2.8, PR + 4.8), pair('P₁ = 1.20 atm', 'V₁ = ?', 'p2', PR + 5.0, PR + 6.6)];
      const top = V(RGX + 0.44, 0.8, 0.1), lX2 = tag('pressure ×2 → volume ÷2 ✓', 0.05, '#ffd27a', top.x, top.y, top.z);
      const lPV = [grp(tag('P × V = 8 every time', 0.05, '#ffd27a', top.x - 0.06, top.y + 0.06, top.z), 'pv'), grp(tag('PV = K (same temp.) ✓', 0.05, '#ffd27a', top.x - 0.06, top.y - 0.04, top.z), 'pv')];
      const lG = [grp(tag('V falls as P rises:', 0.05, '#ffd27a', NBX - 0.1, 0.24, -0.1), 'gr'), grp(tag('a curve (Fig. 5.5) ✓', 0.05, '#ffd27a', NBX - 0.1, 0.18, -0.1), 'gr')];
      const lE = tag('V₂ = 1060 dm³ ✓', 0.055, '#ffd27a', top.x, top.y, top.z), lP = tag('V₁ = 176 cm³ ✓', 0.055, '#ffd27a', top.x, top.y, top.z);
      beats.push((t) => {
        const [h, p] = rigAt(t); rig.userData.set(h, p);
        write(t);
        ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 1.45, 1.75 + i * 1.45));
        R1.forEach(({ l, t0, t1 }) => l.forEach((x) => K.popIn(x, t, t0, t1)));
        K.popIn(lX2, t, S1 + 7.2, S2 - 0.1); lPV.forEach((l) => K.popIn(l, t, S2 + 4.8, S2 + 8.6)); lG.forEach((l) => K.popIn(l, t, B1 + 7.6, B1 + 11.2));
        K.popIn(lE, t, EX + 13.4, PR - 0.1); K.popIn(lP, t, PR + 11.6, END);
      });
    }

    // ================================================================ INSIDE (dark) · half the space, twice the hits
    {
      U.stage((t) => t >= ID - 0.05 && t < B1 - 0.05); keyLight(CX);
      const W = 1.4, H = 1.8, D = 1.0, C = V(CX, AY - 0.1, 0); add(U5.glassBox(W, H, D), C.x, C.y, C.z);
      const sw = U5.swarm(18, { r: 0.06, color: 0x9fc4ff, w: W, h: H, d: D, speed: 1.1 }); add(sw.g, C.x, C.y, C.z);
      const piston = K.solid(new THREE.BoxGeometry(W - 0.03, 0.07, D - 0.03), M.matte(0x22252c, 0.6)); add(piston, C.x, 0, C.z);
      const sparks = Array.from({ length: 18 }, () => add(K.glowSprite(0xffd27a, 0.15)));
      const l1 = tag('the same molecules', 0.055, '#9fc4ff', CX, AY - 1.15, 0.1);
      const l2 = [grp(tag('half the space: twice the hits', 0.05, '#ffd27a', CX, AY - 1.05, 0.1), 'hh'), grp(tag('on the walls: more pressure ✓', 0.05, '#ffd27a', CX, AY - 1.25, 0.1), 'hh')];
      beats.push((t) => {
        const lt = t - ID, d = ease(span(t, ID + 2.8, ID + 4.4)), top = lerp(H / 2 - 0.06, -0.06, d), floor = -H / 2, hy = (top - floor) / 2, cy = floor + hy;
        sw.place(lt, (i) => sw.gas(i, lt, V(0, cy, 0), W / 2, hy, D / 2));
        piston.position.y = C.y + top + 0.035 + 0.002;
        sparks.forEach((s, i) => { const p = sw.gas(i, lt, V(0, cy, 0), W / 2, hy, D / 2), m = Math.min(W / 2 - Math.abs(p.x), hy - Math.abs(p.y - cy), D / 2 - Math.abs(p.z)); s.visible = m < 0.09; s.position.copy(p).add(C); });
        K.popIn(l1, t, ID + 0.4, ID + 2.7); l2.forEach((l) => K.popIn(l, t, ID + 4.6, B1));
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Press a gas harder: what happens to its volume?', dockTitle: "Boyle's law", intro: INTRO, ticks: TICKS,
      rows: [[0, 'Robert Boyle, 1662 · the same temperature'], [1, 'pressure ×2 → volume ÷2'], [1, 'P × V stays the same: PV = K'], [1, 'the curve: V falls as P rises'], [1, 'Example 5.1: 530 → 1060 dm³'], [1, 'Practice 5.1: 176 cm³']],
      short: ['P ×2, V ÷2', 'PV = K', 'the curve', 'Example 5.1', 'Practice 5.1'] }));
    return U.finish();
  },
};
