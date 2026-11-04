// Lesson 505 · Charles's Law (book pp. 129–133: 5.2.2 Charles's law (1787), V ∝ T, V/T = Kc, V₁/T₁ = V₂/T₂, Fig. 5.7
// experimental verification, Scientific Information K = °C + 273, Fig. 5.8 the straight line, Fig. 5.9, Example 5.2,
// Activity 5.2 balloon on a flask). v1 as a code lesson (2026-11-04), replacing the old Blender film. SKILL.md §0 §1 §4.
// THE QUESTION (book: "relationship between volume and temperature of a gas at constant pressure"): "Heat a gas: what
//   happens to its volume?" → card, docked panel, six ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: the Fig. 5.7 rig (gas under a free piston with a weight, a thermometer, a burner below), a
//         notebook and pencil, a flask with a limp balloon on a hot plate (named one at a time) · the question → card.
//  HEAT   "T = 27 °C = 300 K · V = 3 dm³" · "K = °C + 273 (absolute temperature)" ✓ · the burner is lit, the red column
//         climbs, the piston rises "T = 127 °C = 400 K · V = 4 dm³" "hotter → more volume ✓" · more heat "T = 177 °C =
//         450 K · V = 4.5 dm³" "V ÷ T = 0.01 every time · V / T = K (same pressure) ✓" · "Why does heat push the piston
//         up?" → dive INTO the cylinder.
//  INSIDE (dark) the flame glows under the floor, the molecules speed up; they hit harder, the piston (and its weight)
//         rises "heated: they move faster · harder hits push the piston up ✓".
//  GRAPH  the pencil plots the three readings: a straight line through 0 K "a straight line: V grows with T (Fig. 5.8) ✓".
//  EX 5.2 "Example 5.2: 3 dm³ heated from 300 K to 400 K" · V₁/T₁ = V₂/T₂ → V₂ = V₁ × T₂ / T₁ → = 3 × 400 / 300 →
//         = 4 dm³ "V₂ = 4 dm³ ✓, as the rig showed".
//  ACT 5.2 the hot plate is switched on, its plate glows, the balloon on the flask blows up "hot air expands into the
//         balloon ✓".
//  END    "Hotter gas, bigger volume: V / T stays the same ✓".
// Game (🎮 Matter Practice › Words + Facts; 🎮 Gas Law Lab › Charles, docs/COVERAGE_U5.md): Fig. 5.9, °C ↔ K practice, more numericals, Jacques Charles 1787.
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U5.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
import * as U5 from './u5kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, RGX = HKX - 0.55, NBX = HKX + 0.22, PNX = HKX + 0.6, HPX = HKX + 0.92;   // rig · notebook · pencil rest · hot plate + flask
const CX = 40;

// ---------------------------------------------------------------- time
const T = { card: 9.4 };
const DOCK = T.card + 5.0;
const S1 = DOCK + 0.6, LIT = S1 + 6.4, S2 = S1 + 16.6, ID = S2 + 11.6, B1 = ID + 9.4, EX = B1 + 11.0, ACT = EX + 11.8, END = ACT + 12.8;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[S1 + 5.4, 0], [S1 + 15.4, 1], [S2 + 8.4, 2], [B1 + 9.6, 3], [EX + 10.4, 4], [ACT + 11.2, 5]];
const DARK = [[ID, B1]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [6.4, T.card, 'Heat a gas: what happens to its volume?', [HKX, 0.92, 0.05]],
  [S2 + 9.6, ID - 0.3, 'Why does heat push the piston up?', [RGX, 0.95, 0.05]],
  [EX + 0.2, EX + 2.6, 'Example 5.2: 3 dm³ heated from 300 K to 400 K', [NBX, 0.2, -0.1]],
  [ACT + 0.2, ACT + 2.4, 'Activity 5.2: switch on the hot plate', [HPX, 0.62, 0.05]],
  [END + 0.4, T.done, 'Hotter gas, bigger volume: V / T stays the same ✓', [HKX, 0.92, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX + 0.15, 0.36, 0.05], 2.1 * k, 0.95 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const P_RG = [RGX + 0.1, 0.5, 0.05], P_CY = [RGX, 0.48, 0.0], P_NB = [NBX, 0.02, 0.05], P_HP = [HPX, 0.3, 0.05];
const near = (t, p, w = 0.8, h = 0.65, e, dir = ADIR) => S(t, p, w, h, dir, e);
const NBDIR = [0, 1.2, 1];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(S1, P_RG, 1.1, 1.0), near(S2 + 9.4, P_RG, 1.05, 0.96), near(S2 + 10.8, P_CY, 0.3, 0.26), DIVE(ID - 0.05, P_CY),
  DK(ID, CX, 2.2, 2.4, 0.3), DK(ID + 1.6, CX, 2.2, 2.4, 1.04, 'out'), DK(B1 - 0.05, CX, 2.2, 2.4, 0.98),
  S(B1, P_CY, 0.1, 0.08, ADIR, 'out'), near(B1 + 1.4, P_NB, 0.66, 0.48, undefined, NBDIR), near(ACT - 0.05, P_NB, 0.62, 0.46, undefined, NBDIR),
  near(ACT + 0.4, P_HP, 0.8, 0.75), near(END - 0.05, P_HP, 0.76, 0.72), HK(END + 0.4, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

// the gas column (0.05 per dm³) and the thermometer (°C) along the lesson
const steps = [[0, 3, 27], [LIT + 0.4, 3, 27], [S1 + 10.8, 4, 127], [S2, 4, 127], [S2 + 3.0, 4.5, 177], [T.done, 4.5, 177]];
const rigAt = (t) => { let i = 0; while (i < steps.length - 2 && t >= steps[i + 1][0]) i++; const [a, v0, c0] = steps[i], [b, v1, c1] = steps[i + 1], u = ease(span(t, a, b)); return [0.05 * lerp(v0, v1, u), lerp(c0, c1, u)]; };

// the notebook: V against T (left half) and Example 5.2 (right half)
const GP = (Tk, Vv) => [0.08 + Tk / 500 * 0.38, 0.9 - Vv / 5.5 * 0.78];
const PAGE = (() => {
  const g0 = B1 + 1.6, it = [{ k: 'line', x: 0.08, y: 0.9, x1: 0.47, y1: 0.9, t0: g0, d: 0.5 }, { k: 'line', x: 0.08, y: 0.9, x1: 0.08, y1: 0.1, t0: g0 + 0.7, d: 0.5 },
    { k: 'text', s: 'T (K)', x: 0.44, y: 0.96, t0: g0 + 1.3, size: 40 }, { k: 'text', s: 'V', x: 0.04, y: 0.1, t0: g0 + 1.6, size: 44 }];
  [[300, 3], [400, 4], [450, 4.5]].forEach(([Tk, Vv], k) => { const [x, y] = GP(Tk, Vv); it.push({ k: 'dot', x, y, t0: g0 + 2.2 + 0.6 * k }); });
  const [x0, y0] = GP(0, 0), [x1, y1] = GP(500, 5); it.push({ k: 'line', x: x0, y: y0, x1, y1, t0: g0 + 4.4, d: 1.4, w: 5 });
  const L = (s, v, t0) => ({ k: 'text', s, x: 0.75, y: v, t0, d: 0.8, size: 50 });
  it.push(L('V₁ / T₁ = V₂ / T₂', 0.2, EX + 2.8), L('V₂ = V₁ × T₂ / T₁', 0.36, EX + 4.2), L('= 3 × 400 / 300', 0.52, EX + 5.8), L('= 4 dm³', 0.68, EX + 7.4));
  return it;
})();

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '505', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;
    const fires = [], shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };

    // ================================================================ BENCH · the Fig. 5.7 rig, notebook, flask + balloon on a hot plate
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', HKX + 0.15, 2.3, 0.8);
      const rig = add(U5.charlesRig(), RGX, 0, 0), brn = add(K.burner(), RGX, 0, 0); brn.scale.setScalar(0.6); fires.push(brn.userData.flame); brn.userData.flame.scale.setScalar(0.6);
      const nb = add(K.notebook(0.62, 0.44), NBX, 0, 0.02), pen = add(K.pencil(0.24)), write = U5.penWriter(nb, pen, PAGE, V(PNX, 0.01, 0.16), nb.position);
      const hp = add(K.hotPlate(), HPX, 0, 0), fb = add(U5.flaskBalloon(), HPX, 0.105, -0.01), heat = add(K.glowSprite(0xff5a2a, 0.3), HPX, 0.11, 0.0);
      const Tl = V(RGX + 0.3, 0.72, 0.1), Vl = V(RGX - 0.22, 0.62, 0.1), top = V(RGX + 0.12, 1.02, 0.1);
      const ls = [['a gas under a free piston', '#9fc4ff', RGX - 0.05, 0.98, 0.1], ['a notebook and a pencil', '#ffffff', NBX, 0.16, 0.25], ['a balloon on a flask, a hot plate', '#ffb0b8', HPX - 0.05, 0.62, 0.1]].map(([s, c, x, y, z]) => tag(s, 0.045, c, x, y, z));
      const pair = (a, b, g, t0, t1) => ({ l: [grp(tag(a, 0.048, '#ffb0a0', Tl.x, Tl.y, Tl.z), g), grp(tag(b, 0.05, '#9fc4ff', Vl.x, Vl.y, Vl.z), g)], t0, t1 });
      const RD = [pair('T = 27 °C = 300 K', 'V = 3 dm³', 'r1', S1 + 0.2, S1 + 3.0), pair('T = 127 °C = 400 K', 'V = 4 dm³', 'r2', S1 + 11.0, S1 + 13.6), pair('T = 177 °C = 450 K', 'V = 4.5 dm³', 'r3', S2 + 3.2, S2 + 5.6)];
      const lK = [grp(tag('K = °C + 273', 0.055, '#ffd27a', top.x, top.y + 0.05, top.z), 'k'), grp(tag('(absolute temperature)', 0.045, '#ffd27a', top.x, top.y - 0.04, top.z), 'k')];
      const lH = tag('hotter → more volume ✓', 0.05, '#ffd27a', top.x, top.y, top.z);
      const lVT = [grp(tag('V ÷ T = 0.01 every time', 0.05, '#ffd27a', top.x, top.y + 0.05, top.z), 'vt'), grp(tag('V / T = K (same pressure) ✓', 0.05, '#ffd27a', top.x, top.y - 0.04, top.z), 'vt')];
      const lG = [grp(tag('a straight line:', 0.05, '#ffd27a', NBX - 0.12, 0.24, -0.1), 'gr'), grp(tag('V grows with T (Fig. 5.8) ✓', 0.05, '#ffd27a', NBX - 0.12, 0.18, -0.1), 'gr')];
      const lE = [grp(tag('V₂ = 4 dm³ ✓', 0.055, '#ffd27a', NBX + 0.15, 0.24, -0.1), 'ex'), grp(tag('as the rig showed', 0.045, '#ffd27a', NBX + 0.15, 0.18, -0.1), 'ex')];
      const lA = [grp(tag('hot air expands', 0.05, '#ffd27a', HPX - 0.05, 0.66, 0.1), 'ac'), grp(tag('into the balloon ✓', 0.05, '#ffd27a', HPX - 0.05, 0.58, 0.1), 'ac')];
      beats.push((t) => {
        const [h, c] = rigAt(t); rig.userData.set(h, c); brn.userData.flame.visible = t > LIT;
        write(t);
        const on = ease(span(t, ACT + 2.4, ACT + 2.8)), warm = span(t, ACT + 2.8, ACT + 4.4); hp.userData.on(on); heat.visible = warm > 0; heat.material.opacity = 0.6 * warm * (0.85 + 0.15 * Math.sin(t * 4));
        fb.userData.set(ease(span(t, ACT + 3.6, ACT + 9.0)));
        ls.forEach((l, i) => K.popIn(l, t, 0.6 + i * 2.0, 2.4 + i * 2.0));
        RD.forEach(({ l, t0, t1 }) => l.forEach((x) => K.popIn(x, t, t0, t1)));
        lK.forEach((l) => K.popIn(l, t, S1 + 3.2, LIT - 0.1)); K.popIn(lH, t, S1 + 13.8, S2 - 0.1); lVT.forEach((l) => K.popIn(l, t, S2 + 5.8, S2 + 9.4));
        lG.forEach((l) => K.popIn(l, t, B1 + 7.4, EX - 0.1)); lE.forEach((l) => K.popIn(l, t, EX + 8.6, ACT - 0.1)); lA.forEach((l) => K.popIn(l, t, ACT + 9.2, END));
      });
    }

    // ================================================================ INSIDE (dark) · heated molecules move faster and lift the piston
    {
      U.stage((t) => t >= ID - 0.05 && t < B1 - 0.05); keyLight(CX);
      const W = 1.4, H = 1.8, D = 1.0, C = V(CX, AY - 0.1, 0); add(U5.glassBox(W, H, D), C.x, C.y, C.z);
      const floor = K.solid(new THREE.BoxGeometry(W + 0.04, 0.05, D + 0.04), M.metal(0x8a6a48, 0.35)); add(floor, C.x, C.y - H / 2 - 0.03, C.z);
      const glow = add(K.glowSprite(0xff6a2a, 1.6), C.x, C.y - H / 2 - 0.25, 0.2);
      const sw = U5.swarm(18, { r: 0.06, color: 0x9fc4ff, w: W, h: H, d: D, speed: 0.8 }); add(sw.g, C.x, C.y, C.z);
      const piston = K.solid(new THREE.BoxGeometry(W - 0.03, 0.07, D - 0.03), M.matte(0x22252c, 0.6)); add(piston, C.x, 0, C.z);
      const wt = K.solid(new THREE.CylinderGeometry(0.3, 0.3, 0.16, 32), M.metal(0x8d939b, 0.35)); add(wt, C.x, 0, C.z);
      const H0 = ID + 1.2, H1 = ID + 4.4;                              // the speed doubles between H0 and H1: phase = ∫ speed dt
      const phase = (t) => { const a = t - ID, r0 = H0 - ID, r1 = H1 - ID; return a < r0 ? a : a < r1 ? a + (a - r0) ** 2 / (2 * (r1 - r0)) : a + (r1 - r0) / 2 + (a - r1); };
      const l1 = tag('heated: they move faster', 0.055, '#ffb0a0', CX, AY - 1.15, 0.1);
      const l2 = [grp(tag('harder hits push the piston', 0.05, '#ffd27a', CX, AY - 1.05, 0.1), 'hp'), grp(tag('and its weight up ✓', 0.05, '#ffd27a', CX, AY - 1.25, 0.1), 'hp')];
      beats.push((t) => {
        const ph = phase(t), u = ease(span(t, H0 + 0.6, H1 + 1.2)), top = lerp(-0.25, 0.6, u), fl = -H / 2, hy = (top - fl) / 2;
        sw.place(ph, (i) => sw.gas(i, ph, V(0, fl + hy, 0), W / 2, hy, D / 2));
        piston.position.y = C.y + top + 0.035 + 0.002; wt.position.y = piston.position.y + 0.035 + 0.08 + 0.002;
        glow.material.opacity = 0.7 * span(t, ID, ID + 1.0) * (0.85 + 0.15 * Math.sin(t * 5));
        K.popIn(l1, t, ID + 0.6, H1); l2.forEach((l) => K.popIn(l, t, H1 + 0.6, B1));
      });
    }
    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Heat a gas: what happens to its volume?', dockTitle: "Charles's law", intro: INTRO, ticks: TICKS,
      rows: [[0, 'Jacques Charles, 1787 · the same pressure'], [1, 'absolute temperature: K = °C + 273'], [1, 'hotter → more volume'], [1, 'V / T stays the same: V / T = K'], [1, 'the graph: a straight line'], [1, 'Example 5.2: 3 → 4 dm³'], [1, 'Activity 5.2: the balloon grows']],
      short: ['K = °C + 273', 'hotter → bigger', 'V / T = K', 'straight line', 'Example 5.2', 'Activity 5.2'] }));
    return U.finish();
  },
};
