// Lesson 607 · Molarity (book pp. 161–162: 6.4.2 molarity = moles of solute per dm³ (litre) of solution, symbol M;
// mole = grams ÷ molar mass; M = grams ÷ (molar mass × dm³); Example 6.1 (7.50 mol CaCO₃ in 1.50 dm³ = 5.0 M); Scientific
// Information 1 dm³ = 1 L = 1000 cm³ = 1000 ml, 1 cm³ = 1 ml; 6.4.3: 1 M glucose = 180 g per dm³; 40 g NaOH in 1.00 dm³ =
// 1 M, 20.0 g = 0.500 M, 80 g = 2 M). v1 as a code lesson (2026-11-04), replacing the old Blender film. SKILL.md.
// THE QUESTION: "How do chemists say exactly how strong a solution is?" → card, docked panel, five ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a 1-litre bottle of water and an empty glass cube 1 dm on each side, a scale, a dish of sodium
//         hydroxide pellets, three 1 dm³ volumetric flasks, a jug, a notebook (named one at a time) · question → card.
//  UNITS  the litre bottle is poured into the cube: it fills it exactly "1 dm³ = 1 litre = 1000 cm³ = 1000 ml ✓".
//  ONE    40.0 g of NaOH on the scale "1 mole of NaOH = 40 g (its molar mass)" · carried into flask 1, water to the mark
//         "1 mol in 1 dm³ of solution: 1 M NaOH ✓".
//  MORE   20.0 g into flask 2, 80.0 g into flask 3, water to each mark "20 g = 0.5 mol: 0.500 M · 80 g = 2 mol: 2 M ✓" →
//         dive (dark): three 1 dm³ cubes, each gold ball = 0.1 mol: 5 · 10 · 20 balls "molarity = moles of solute in each
//         dm³ of solution ✓".
//  EX 6.1 the notebook: M = moles ÷ dm³ → 7.50 mol ÷ 1.50 dm³ → = 5.0 M ✓ · "1 M glucose: 180 g in 1 dm³".
//  END    "Molarity: moles of solute per dm³ of solution ✓".
// Game (🎮 Molarity Lab, docs/COVERAGE_U6.md): molar masses, more problems, the formula both ways.
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
const HKX = 0, LBX = HKX - 1.12, CBX = HKX - 0.84, SCX = HKX - 0.48, PLX = HKX - 0.48, FX = [HKX - 0.1, HKX + 0.22, HKX + 0.54], JGX = HKX + 0.82, NBX = HKX + 0.82;
const DX = 40;

// ---------------------------------------------------------------- time
const T = { card: 10.2 };
const DOCK = T.card + 5.0;
const UN = DOCK + 0.4, ON = UN + 7.4, MO = ON + 11.6, ID = MO + 14.2, B1 = ID + 9.0, EX = B1, END = EX + 11.0;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[UN + 6.0, 0], [ON + 2.8, 1], [ON + 9.6, 2], [ID + 7.4, 3], [EX + 9.0, 4]];
const DARK = [[ID, B1]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);
const NB0 = V(NBX, 0, 0.34);

const captions = [
  [8.0, T.card, 'How do chemists say exactly how strong a solution is?', [HKX, 0.62, 0.05]],
  [UN + 0.2, UN + 2.0, 'First the unit of volume', [(LBX + CBX) / 2, 0.45, 0.05]],
  [MO + 0.2, MO + 2.0, 'Now half as much, and twice as much', [FX[1], 0.5, 0.05]],
  [MO + 13.2, ID - 0.2, 'Look inside the three flasks', [FX[1], 0.5, 0.05]],
  [EX + 0.4, EX + 2.4, 'Example 6.1: 7.50 mol CaCO₃ in 1.50 dm³', [NBX, 0.2, 0.2]],
  [END + 0.4, T.done, 'Molarity: moles of solute per dm³ of solution ✓', [HKX, 0.62, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX - 0.12, 0.28, 0.1], 2.5 * k, 0.8 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const near = (t, p, w = 0.8, h = 0.65, e, dir = ADIR) => S(t, p, w, h, dir, e);
const P_UN = [(LBX + CBX) / 2, 0.18, 0.05], P_ON = [(SCX + FX[0]) / 2, 0.22, 0.05], P_MO = [(FX[0] + FX[2]) / 2 - 0.1, 0.22, 0.05], P_IN = [FX[1], 0.12, 0.0], P_NB = [NBX, 0.02, 0.34], NBDIR = [0, 2.2, 1];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(UN, [P_UN[0], 0.3, 0.05], 0.85, 0.8), near(ON - 0.05, [P_UN[0], 0.3, 0.05], 0.82, 0.77), near(ON + 0.4, P_ON, 0.8, 0.62), near(MO - 0.05, P_ON, 0.77, 0.6),
  near(MO + 0.4, P_MO, 1.25, 0.65), near(MO + 12.4, P_MO, 1.2, 0.62), near(MO + 13.4, P_IN, 0.3, 0.26), DIVE(ID - 0.05, P_IN),
  DK(ID, DX, 4.2, 2.0, 0.3), DK(ID + 1.8, DX, 4.2, 2.0, 1.04, 'out'), DK(B1 - 0.05, DX, 4.2, 2.0, 0.97),
  S(B1, P_IN, 0.5, 0.45, ADIR, 'out'), near(EX + 0.8, P_NB, 0.6, 0.45, undefined, NBDIR), near(END - 0.05, P_NB, 0.58, 0.43, undefined, NBDIR), HK(END + 0.4, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

const L = (s, v, t0) => ({ k: 'text', s, x: 0.5, y: v, t0, d: 0.8, size: 54 });
const PAGE = [L('M = moles ÷ dm³ of solution', 0.18, EX + 2.6), L('= 7.50 mol ÷ 1.50 dm³', 0.36, EX + 4.2), L('= 5.0 M', 0.54, EX + 5.8), L('1 M glucose: 180 g in 1 dm³', 0.8, EX + 8.0)];

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '607', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;

    // ================================================================ BENCH
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', HKX - 0.12, 2.7, 1.0);
      const lb = add(new THREE.Group(), LBX, 0, 0); lb.add(K.reagentBottle(0x3d9ee6, 0.26, 0.07, '1 litre'));
      const cube = add(U5.glassBox(0.2, 0.2, 0.2), CBX, 0.101, 0), cw = add(K.solid(new THREE.BoxGeometry(0.19, 1, 0.19).translate(0, 0.5, 0), new THREE.MeshPhysicalMaterial({ color: 0x3d9ee6, transparent: true, opacity: 0.45, depthWrite: false }), { outline: false }), CBX, 0.004, 0); cw.renderOrder = 4;
      const sc = add(U6.digitalScale(), SCX, 0, 0), top = sc.userData.top;
      add(U5.saltCrystals(0, 0.02), PLX - 0.2, 0, 0.18); const pel = add(U6.crystalHeap(0.04, 50, 0xfafaf4), PLX - 0.2, 0.012, 0.18);
      const pile = add(U6.crystalHeap(0.035, 40, 0xfafaf4), SCX, top, 0);
      const fl = FX.map((x) => add(U6.volFlask(0.075), x, 0, 0));
      const jug = add(new THREE.Group(), JGX, 0, 0); jug.add(K.labBeaker(0.05, 0.15)); const jl = K.liquid(0.045, 0.11, 0x3d9ee6, 0.45); jl.position.y = 0.012; jug.add(jl);
      const st = add(U6.stream(0x3d9ee6)), st2 = add(U6.stream(0x3d9ee6));
      const nb = add(K.notebook(0.5, 0.36), NB0.x, 0, NB0.z), pen = add(K.pencil(0.22)), write = U5.penWriter(nb, pen, PAGE, V(NBX + 0.3, 0.01, NB0.z + 0.1), nb.position);
      const lipR = V(0.055, 0.15, 0), mouth = (x) => V(x, 0.33, 0);
      const pours = FX.map((x) => U6.pourer(jug, V(JGX, 0, 0), null, mouth(x), V(-0.055, 0.15, 0), st, { dur: 1.6 }));
      const pB = U6.pourer(lb, V(LBX, 0, 0), null, V(CBX, 0.22, 0), V(0.022, 0.26, 0), st2, { dur: 2.2, tilt: 2.0, side: -1 });
      const ls = [['a 1-litre bottle, a 1 dm glass cube', '#ffffff', (LBX + CBX) / 2, 0.42, 0.08], ['a scale, sodium hydroxide (NaOH)', '#ffffff', SCX - 0.1, 0.26, 0.15], ['three 1 dm³ flasks', '#ffffff', FX[1], 0.44, 0.08], ['water', '#9fd2ff', JGX, 0.26, 0.08], ['a notebook', '#ffffff', NBX, 0.1, 0.5]].map(([s, c, x, y, z]) => tag(s, 0.042, c, x, y, z));
      const say = (a, b, x, y, t0, t1, g) => ({ l: [grp(tag(a, 0.042, '#ffffff', x, y + 0.04, 0.1), g), ...(b ? [grp(tag(b, 0.045, '#ffd27a', x, y - 0.035, 0.1), g)] : [])], t0, t1 });
      const SAY = [
        say('it fills the cube exactly:', '1 dm³ = 1 litre = 1000 cm³ = 1000 ml ✓', (LBX + CBX) / 2, 0.44, UN + 3.8, ON, 'u'),
        say('1 mole of NaOH = 40 g', '(its molar mass)', (SCX + FX[0]) / 2, 0.46, ON + 2.6, ON + 4.6, 'o1'),
        say('1 mol in 1 dm³ of solution:', '1 M NaOH ✓', (SCX + FX[0]) / 2, 0.46, ON + 8.6, MO, 'o2'),
        say('20 g = 0.5 mol: 0.500 M', '80 g = 2 mol: 2 M ✓', (FX[1] + FX[2]) / 2, 0.48, MO + 11.6, MO + 13.2, 'm'),
      ];
      const W = [[ON + 0.6, 40, 0], [MO + 0.6, 20, 1], [MO + 4.8, 80, 2]];
      beats.push((t) => {
        const fb = t > UN + 0.6 ? pB(t, UN + 0.6) : 0; cw.scale.y = Math.max(1e-3, 0.192 * fb); cw.visible = fb > 0.01;
        let rd = 0, pv = 0, carried = false;
        W.forEach(([t0, g, i]) => {
          const fill = ease(span(t, t0, t0 + 1.4)), mv = ease(span(t, t0 + 1.8, t0 + 2.6));
          if (t > t0 && t < t0 + 1.8) { rd = g * fill; pv = fill * (0.5 + g / 160); }
          if (t > t0 + 1.8 && t < t0 + 2.6) { carried = true; pile.position.copy(K.arc(V(SCX, top, 0), V(FX[i], 0.33, 0), 0.15, mv)); pile.userData.set(0.5 + g / 160); }
          const w = t > t0 + 2.8 ? pours[i](t, t0 + 2.8) : 0; fl[i].userData.setLevel(t > t0 + 2.6 ? 0.08 + 0.92 * w : 0);
        });
        if (!carried) { pile.position.set(SCX, top, 0); pile.userData.set(pv); } pile.visible = carried || pv > 0.02;
        sc.userData.set(rd.toFixed(1) + ' g'); pel.userData.set(1 - 0.2 * W.filter(([t0]) => t > t0).length);
        write(t);
        ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 1.5, 1.7 + i * 1.5)); SAY.forEach(({ l, t0, t1 }) => l.forEach((x) => K.popIn(x, t, t0, t1)));
      });
      const lN = tag('NaOH', 0.045, '#ffffff', SCX, 0.2, 0.12); beats.push((t) => K.popIn(lN, t, ON + 0.4, ON + 2.4));
    }

    // ================================================================ INSIDE (dark) · each gold ball = 0.1 mol
    {
      U.stage((t) => t >= ID - 0.05 && t < B1 - 0.05); keyLight(DX);
      const XS = [DX - 1.4, DX, DX + 1.4], N = [5, 10, 20], C = 1.1;
      XS.forEach((x) => add(U5.glassBox(C, C, C), x, AY, 0));
      const sw = N.map((n, i) => { const s = U5.swarm(n, { r: 0.065, color: 0xffc04d, w: C, h: C, d: C, speed: 0.35 }); add(s.g, XS[i], AY, 0); return s; });
      const nm = ['0.500 M', '1 M', '2 M'].map((s, i) => grp(tag(s, 0.06, '#ffffff', XS[i], AY + 0.78, 0.1), 'nm'));
      const cnt = ['5 balls = 0.5 mol', '10 balls = 1 mol', '20 balls = 2 mol'].map((s, i) => grp(tag(s, 0.042, '#ffd27a', XS[i], AY - 0.75, 0.1), 'cn'));
      const l0 = tag('each gold ball stands for 0.1 mol of NaOH', 0.048, '#ffd27a', DX, AY - 0.95, 0.1);
      const l1 = [grp(tag('molarity = moles of solute', 0.05, '#ffffff', DX, AY - 0.9, 0.1), 'mo'), grp(tag('in each dm³ of solution ✓', 0.05, '#ffd27a', DX, AY - 1.1, 0.1), 'mo')];
      beats.push((t) => { const lt = t - ID; sw.forEach((s) => s.place(lt, (i) => s.gas(i, lt))); K.popIn(l0, t, ID + 0.6, ID + 2.8); nm.forEach((l) => K.popIn(l, t, ID + 3.0, B1)); cnt.forEach((l) => K.popIn(l, t, ID + 3.0, ID + 5.6)); l1.forEach((l) => K.popIn(l, t, ID + 5.8, B1)); });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'How do chemists say exactly how strong a solution is?', dockTitle: 'Molarity', intro: INTRO, ticks: TICKS,
      rows: [[0, 'a litre bottle, a dm cube, NaOH, three flasks'], [1, '1 dm³ = 1 L = 1000 cm³ = 1000 ml'], [1, '1 mole of NaOH = 40 g'], [1, '1 mol in 1 dm³: 1 M'], [1, 'molarity = moles per dm³ of solution'], [1, 'Example 6.1: 5.0 M']],
      short: ['1 dm³ = 1 L', '1 mol = 40 g', '1 M', 'moles per dm³', 'Example 6.1'] }));
    return U.finish();
  },
};
