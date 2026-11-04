// Lesson 605 · Concentration: Dilute & Concentrated (book pp. 158–159: 6.4 concentration (the proportion of a solute,
// a ratio of solute to solvent or solution), (i) dilute, (ii) concentrated, Fig. 6.6 dilution (add solvent: fewer solute
// particles per unit volume), Scientific Information: a standard solution, 5 g vs 8 g sugar in 100 cm³; two units).
// v1 as a code lesson (2026-11-04), replacing the old Blender film. SKILL.md §0 + §1 + §4.
// THE QUESTION (book: "The larger the amount of solute present in a solution, the higher would be the concentration"):
//   "How strong is a solution?" → card, docked panel, four ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a flask of deep-blue copper sulphate solution and a beaker of water; a digital scale with sugar;
//         two beakers of 100 cm³ water; a bottle labelled 0.1 M (named one at a time) · question → card.
//  ADD    the beaker is poured into the flask (Fig. 6.6 "add solvent"): the blue gets paler · dive INTO it (dark): two
//         boxes, before and after, the same 12 solute particles: "before: many in each part: concentrated ✓" · "after:
//         the same solute in more water: fewer in each part: dilute ✓".
//  SUGAR  back on the table: the scale weighs 5.0 g → into beaker A, then 8.0 g → into B "5 g in 100 cm³ · 8 g in 100
//         cm³" "the 5 g one is dilute compared with the 8 g one ✓".
//  STD    the 0.1 M bottle "its concentration is known: a standard solution ✓".
//  END    "Concentration: how much solute in a given amount of solution ✓".
// Game (🎮 Molarity Lab + Solution Lab, docs/COVERAGE_U6.md): the definitions, the two units (percentage, molarity).
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
const HKX = 0, FLX = HKX - 0.85, WBX = HKX - 0.55, SCX = HKX - 0.12, BAX = HKX + 0.22, BBX = HKX + 0.6, STX = HKX + 0.98;
const DX = 40;

// ---------------------------------------------------------------- time
const T = { card: 8.4 };
const DOCK = T.card + 5.0;
const P0 = DOCK + 0.4, ID = P0 + 6.0, B1 = ID + 10.0, W0 = B1, SD = W0 + 15.6, END = SD + 5.4;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[ID + 4.8, 0], [ID + 9.0, 1], [W0 + 14.0, 2], [SD + 4.4, 3]];
const DARK = [[ID, B1]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [7.0, T.card, 'How strong is a solution?', [HKX, 0.6, 0.05]],
  [P0 + 0.2, P0 + 2.4, 'Fig. 6.6: add more solvent (water)', [(FLX + WBX) / 2, 0.5, 0.05]],
  [P0 + 4.2, ID - 0.3, 'Look inside: before and after', [FLX, 0.42, 0.05]],
  [W0 + 0.4, W0 + 2.6, 'Now sugar, weighed into 100 cm³ of water', [(SCX + BBX) / 2, 0.5, 0.05]],
  [END + 0.4, T.done, 'Concentration: how much solute in a given amount of solution ✓', [HKX, 0.6, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX + 0.03, 0.25, 0.05], 2.3 * k, 0.75 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const near = (t, p, w = 0.8, h = 0.65, e) => S(t, p, w, h, ADIR, e);
const P_FL = [(FLX + WBX) / 2, 0.22, 0.05], P_IN = [FLX, 0.08, 0.02], P_SG = [(SCX + BBX) / 2, 0.15, 0.05], P_ST = [STX, 0.15, 0.05];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(P0, P_FL, 0.7, 0.6), near(P0 + 4.0, P_FL, 0.68, 0.58), near(P0 + 5.0, P_IN, 0.3, 0.26), DIVE(ID - 0.05, P_IN),
  DK(ID, DX, 4.0, 2.0, 0.3), DK(ID + 1.8, DX, 4.0, 2.0, 1.04, 'out'), DK(B1 - 0.05, DX, 4.0, 2.0, 0.97),
  S(B1, P_IN, 0.3, 0.26, ADIR, 'out'), near(W0 + 1.4, P_SG, 1.1, 0.6), near(SD - 0.05, P_SG, 1.06, 0.58), near(SD + 0.8, P_ST, 0.45, 0.45), near(END - 0.05, P_ST, 0.43, 0.43), HK(END + 0.4, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '605', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;

    // ================================================================ BENCH
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', HKX + 0.03, 2.6, 0.8);
      const fl = add(U5.conicalFlask(0.1, 0.26, 0.4, 0x1438b0), FLX, 0, 0), fw = fl.children[1], flM = fw.material, deep = new THREE.Color(0x1438b0), pale = new THREE.Color(0x2f6ae0); flM.opacity = 0.8;
      const wb = add(new THREE.Group(), WBX, 0, 0); wb.add(K.labBeaker(0.07, 0.18)); const wl = K.liquid(0.065, 0.12, 0x3d9ee6, 0.45); wl.position.y = 0.012; wb.add(wl);
      const st = add(U6.stream(0x7fb6ff));
      const sc = add(U6.digitalScale(), SCX, 0, 0); const sug = add(U6.crystalHeap(0.035, 40), SCX - 0.12, 0, 0.1);
      const pile = add(U6.crystalHeap(0.03, 30), SCX, sc.userData.top, 0);
      const bks = [BAX, BBX].map((x) => { add(K.labBeaker(0.08, 0.2), x, 0, 0); add(K.liquid(0.075, 0.13, 0x3d9ee6, 0.4), x, 0.012, 0); const h = add(U6.crystalHeap(0.035, 30), x, 0.014, 0); h.userData.set(0); return h; });
      add(K.reagentBottle(0xe6eef6, 0.24, 0.06, '0.1 M NaCl'), STX, 0, 0);
      const ls = [['a blue solution (copper sulphate)', '#9fc4ff', FLX, 0.42, 0.08], ['water', '#9fd2ff', WBX, 0.3, 0.1], ['a scale and sugar', '#ffffff', SCX, 0.2, 0.12], ['two beakers: 100 cm³ water each', '#ffffff', (BAX + BBX) / 2, 0.34, 0.1], ['a bottle marked 0.1 M', '#ffffff', STX, 0.4, 0.08]].map(([s, c, x, y, z]) => tag(s, 0.042, c, x, y, z));
      const lPale = tag('more water: the blue gets paler', 0.045, '#9fc4ff', FLX, 0.42, 0.08);
      const rd = [grp(tag('A: 5 g sugar', 0.04, '#ffffff', BAX, 0.3, 0.12), 'ab'), grp(tag('B: 8 g sugar', 0.04, '#ffffff', BBX, 0.3, 0.12), 'ab')];
      const lD = [grp(tag('A is dilute compared with B', 0.045, '#ffd27a', BAX + 0.05, 0.44, 0.1), 'cmp'), grp(tag('(less solute, the same water) ✓', 0.042, '#ffd27a', BAX + 0.05, 0.37, 0.1), 'cmp')];
      const lS = [grp(tag('its concentration is known:', 0.042, '#ffd27a', STX, 0.42, 0.08), 'std'), grp(tag('a standard solution ✓', 0.048, '#ffd27a', STX, 0.35, 0.08), 'std')];
      const weigh = (t0, g, x) => ({ t0, g, x });
      const W = [weigh(W0 + 2.8, 5.0, BAX), weigh(W0 + 7.8, 8.0, BBX)];
      beats.push((t) => {
        // the pour: lift, tilt over the flask, stream, back
        const up = ease(span(t, P0 + 0.6, P0 + 1.4)), tilt = ease(span(t, P0 + 1.4, P0 + 2.0)) * (1 - ease(span(t, P0 + 3.2, P0 + 3.8))), dn = ease(span(t, P0 + 3.8, P0 + 4.6));
        wb.position.copy(K.arc(V(WBX, 0, 0), V(FLX + 0.17, 0.32, 0), 0.08, up - dn)); wb.rotation.z = 1.6 * tilt;
        const lip = wb.localToWorld(V(-0.075, 0.18, 0)); st.userData.set(lip, V(FLX, 0.21, 0), tilt > 0.6 ? 1 : 0); wl.scale.y = 1 - 0.6 * ease(span(t, P0 + 2.0, P0 + 3.2));
        flM.color.copy(deep).lerp(pale, ease(span(t, P0 + 2.0, P0 + 3.6))); flM.opacity = lerp(0.8, 0.68, ease(span(t, P0 + 2.0, P0 + 3.6))); fw.scale.y = 1 + 0.35 * ease(span(t, P0 + 2.0, P0 + 3.2)); fw.position.y = 0.014 + (fw.geometry.parameters.height / 2) * fw.scale.y;
        // the sugar: a pile grows on the scale (reading climbs), then it is tipped into its beaker and dissolves
        let rdg = 0, pl = 0;
        W.forEach(({ t0, g, x }, i) => {
          const fill = ease(span(t, t0, t0 + 2.0)), tip = ease(span(t, t0 + 2.6, t0 + 3.2));
          if (t > t0 && t < t0 + 3.2) { rdg = g * fill * (1 - tip); pl = fill * (1 - tip); }
          bks[i].userData.set(t > t0 + 3.2 ? 1 - ease(span(t, t0 + 3.4, t0 + 4.8)) * 0.85 : 0);
        });
        sc.userData.set(rdg.toFixed(1) + ' g'); pile.userData.set(Math.max(pl, 0.0)); pile.visible = pl > 0.02;
        W.forEach(({ t0, x }) => { const mv = ease(span(t, t0 + 2.6, t0 + 3.2)); if (t > t0 + 2.6 && t < t0 + 3.2) { pile.visible = true; pile.userData.set(1); pile.position.copy(K.arc(V(SCX, 0.049, 0), V(x, 0.2, 0), 0.15, mv)); } });   // the weighed sugar is carried over and tipped in
        if (!W.some(({ t0 }) => t > t0 + 2.6 && t < t0 + 3.2)) pile.position.set(SCX, 0.049, 0); sug.userData.set(1 - 0.3 * (t > W[0].t0) - 0.4 * (t > W[1].t0));
        ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 1.3, 1.6 + i * 1.3)); K.popIn(lPale, t, P0 + 2.6, P0 + 4.0);
        rd.forEach((l) => K.popIn(l, t, W[1].t0 + 5.0, W[1].t0 + 7.0)); lD.forEach((l) => K.popIn(l, t, W[1].t0 + 7.2, SD - 0.1)); lS.forEach((l) => K.popIn(l, t, SD + 1.2, END));
      });
    }

    // ================================================================ INSIDE (dark) · Fig. 6.6: the same solute, more water
    {
      U.stage((t) => t >= ID - 0.05 && t < B1 - 0.05); keyLight(DX);
      const LX = DX - 1.0, RX = DX + 1.0, W = 1.5, H = 1.4, D = 0.7;
      add(U5.glassBox(W, H * 0.6, D), LX, AY - H * 0.2, 0); const boxR = add(U5.glassBox(W, H, D), RX, AY, 0);
      const a = U5.swarm(12, { r: 0.075, color: 0x2f5fe0, w: W, h: H * 0.6, d: D, speed: 0.4 }), b = U5.swarm(12, { r: 0.075, color: 0x2f5fe0, w: W, h: H, d: D, speed: 0.4 }); add(a.g, LX, AY - H * 0.2, 0); add(b.g, RX, AY, 0);
      const l1 = [grp(tag('before: many in each part', 0.046, '#ffffff', LX, AY - 1.0, 0.1), 'c'), grp(tag('concentrated ✓', 0.05, '#ffd27a', LX, AY - 1.2, 0.1), 'c')];
      const l2 = [grp(tag('after: the same 12, more water', 0.046, '#ffffff', DX + 0.6, AY - 1.0, 0.1), 'd'), grp(tag('fewer in each part: dilute ✓', 0.05, '#ffd27a', DX + 0.6, AY - 1.2, 0.1), 'd')];
      beats.push((t) => { const lt = t - ID; a.place(lt, (i) => a.gas(i, lt)); b.place(lt, (i) => b.gas(i, lt)); b.g.visible = boxR.visible = t > ID + 4.4; boxR.scale.setScalar(Math.max(1e-3, back(span(t, ID + 4.4, ID + 4.9)))); l1.forEach((l) => K.popIn(l, t, ID + 0.8, ID + 4.6)); l2.forEach((l) => K.popIn(l, t, ID + 5.0, B1)); });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'How strong is a solution?', dockTitle: 'Concentration', intro: INTRO, ticks: TICKS,
      rows: [[0, 'a blue solution, water, sugar, a 0.1 M bottle'], [1, 'much solute in each part: concentrated'], [1, 'add solvent: fewer in each part: dilute'], [1, '5 g is dilute compared with 8 g'], [1, 'a known concentration: standard solution']],
      short: ['concentrated', 'dilute', '5 g vs 8 g', 'standard'] }));
    return U.finish();
  },
};
