// Lesson 601 · Solutions, Solute & Solvent (book pp. 153–154 top: Introduction (homogeneous, composition can change,
// solutions in all three states: alloy, sea water, air), 6.1 (i) solution, binary solution, Test Yourself (pure liquid
// or solution?), (ii) aqueous solution, water the universal solvent, (iii) solute and solvent, soft drinks; Fig. 6.1).
// v1 as a code lesson (2026-11-04), replacing the old Blender film. SKILL.md §0 + §1 + §4 (tools u5kit, u6kit).
// THE QUESTION: "Where does sugar go when it disappears in water?" → card, docked panel, six ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a beaker of water and a dish of sugar with a spoon; a beaker of water and salt; a soft drink;
//         two dishes on a tripod over a burner; a brass key, a beaker of sea water, a balloon of air · the spoon tips
//         the sugar in, a glass rod stirs, the heap shrinks to nothing "the sugar disappears… where?" → card → dive.
//  INSIDE (dark) Fig. 6.1: water (blue) and sugar (gold) packed in a crystal; the sugar leaves the crystal and spreads
//         evenly "sugar + water: a solution, the same all through (homogeneous) ✓" · "water, more of it: the solvent ·
//         sugar, less of it: the solute ✓" · "two parts: a binary solution".
//  WATER  the salt beaker: the salt dissolves too "made in water: an aqueous solution · water dissolves so much: the
//         universal solvent ✓".
//  DRINK  the soft drink fizzes "water: the solvent · sugar, CO₂, flavours: the solutes ✓".
//  TEST   Test Yourself: two dishes, pure water and salt water, are heated dry: one leaves nothing, the other a white
//         crust "a solution leaves its solute behind ✓".
//  STATES the key, the sea water, the balloon "solutions in all three states: alloy (solid), sea water (liquid), air
//         (gas) ✓".
//  END    "The sugar is still there, spread evenly through the water ✓".
// Game (🎮 Mixture Sorter + Solution Lab, docs/COVERAGE_U6.md): the definitions word for word.
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
const HKX = 0, SBX = HKX - 1.05, SDX = HKX - 0.75, SLX = HKX - 0.35, DKX = HKX + 0.02, TPX = HKX + 0.45, KYX = HKX + 0.88, SWX = HKX + 1.08, BLX = HKX + 1.32;
const DX = 40;

// ---------------------------------------------------------------- time
const T = { tip: 2.2, card: 12.2 };
const DOCK = T.card + 5.0;
const ID = DOCK + 3.4, B1 = ID + 13.0, SL = B1, DR = SL + 8.4, TS = DR + 7.0, ST = TS + 12.0, END = ST + 7.4;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[ID + 6.0, 0], [ID + 9.2, 1], [SL + 7.2, 2], [DR + 5.4, 3], [TS + 10.4, 4], [ST + 5.8, 5]];
const DARK = [[ID, B1]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [9.2, T.card, 'Where does sugar go when it disappears in water?', [SBX + 0.1, 0.5, 0.05]],
  [DOCK + 0.2, ID - 0.3, 'Look into the sweet water', [SBX, 0.42, 0.05]],
  [TS + 0.3, TS + 2.6, 'Test Yourself: pure water or a solution?', [TPX, 0.72, 0.05]],
  [END + 0.4, T.done, 'The sugar is still there, spread evenly ✓', [HKX, 0.6, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX + 0.12, 0.3, 0.05], 2.8 * k, 0.85 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const near = (t, p, w = 0.8, h = 0.65, e) => S(t, p, w, h, ADIR, e);
const P_SB = [(SBX + SDX) / 2, 0.2, 0.05], P_IN = [SBX, 0.1, 0.02], P_SL = [SLX, 0.18, 0.05], P_DK = [DKX, 0.18, 0.05], P_TP = [TPX, 0.4, 0.05], P_ST = [(KYX + BLX) / 2, 0.3, 0.05];
const CAMS = [
  HK(0, 1.05), near(0.4, P_SB, 0.7, 0.6), near(9.0, P_SB, 0.68, 0.58), HK(9.2, 1.02), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(DOCK + 1.8, P_IN, 0.4, 0.34), DIVE(ID - 0.05, P_IN),
  DK(ID, DX, 3.0, 2.0, 0.3), DK(ID + 1.8, DX, 3.0, 2.0, 1.04, 'out'), DK(B1 - 0.05, DX, 3.0, 2.0, 0.97),
  S(B1, P_IN, 0.1, 0.08, ADIR, 'out'), near(SL + 1.4, P_SL, 0.55, 0.5), near(DR - 0.05, P_SL, 0.53, 0.48), near(DR + 1.4, P_DK, 0.5, 0.55), near(TS - 0.05, P_DK, 0.48, 0.53),
  near(TS + 1.4, P_TP, 0.7, 0.75), near(ST - 0.05, P_TP, 0.68, 0.72), near(ST + 1.4, P_ST, 0.85, 0.62), near(END - 0.05, P_ST, 0.82, 0.6), HK(END + 0.4, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '601', { dark, AY }), { beats, ST: STD, add, tag, grp, keyLight } = U;
    const fires = [], shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };

    // ================================================================ BENCH
    {
      U.stage((t) => !dark(t)); STD.bake(U.root, 'hook', HKX + 0.12, 3.0, 0.8);
      add(K.beaker(0.1, 0.22), SBX, 0, 0); add(K.liquid(0.095, 0.15, 0x3d9ee6, 0.5), SBX, 0.012, 0); const heap = add(U6.crystalHeap(0.04, 50), SBX, 0.014, 0); heap.visible = false;
      add(U5.saltCrystals(0, 0.02), SDX, 0, 0); const sug = add(U6.crystalHeap(0.04, 50), SDX, 0.012, 0), sp = add(K.spoon(0.22), SDX + 0.06, 0.03, 0.04); sp.rotation.z = Math.PI / 2 - 0.3; const rod = add(U6.stirRod(0.3), SBX + 0.2, 0, 0.05); rod.rotation.z = 0.3;
      add(K.beaker(0.08, 0.2), SLX, 0, 0); add(K.liquid(0.075, 0.13, 0x3d9ee6, 0.5), SLX, 0.012, 0); const salt = add(U6.crystalHeap(0.035, 40), SLX, 0.014, 0);
      const bot = add(K.glassBottle(1.2), DKX, 0, 0), fizz = add(K.bubbles(14, V(0, 0.04, 0), 0.2, 0.04, 0.008), DKX, 0, 0);
      const brn = add(K.burner(), TPX, 0, 0); fires.push(brn.userData.flame); brn.userData.flame.scale.setScalar(0.45); add(K.tripod(0.56), TPX, 0, 0);
      const gz = add(K.solid(new THREE.BoxGeometry(0.34, 0.006, 0.2), M.metal(0x8d939b, 0.4)), TPX, 0.565, 0);
      const dA = add(K.dish(0.07), TPX - 0.08, 0.568, 0), dB = add(K.dish(0.07), TPX + 0.08, 0.568, 0), wA = add(U5.dishWater(0.07), TPX - 0.08, 0.568, 0), wB = add(U5.dishWater(0.07, 0x6fb0e6), TPX + 0.08, 0.568, 0);
      const crust = add(U6.crystalHeap(0.035, 40), TPX + 0.08, 0.582, 0); crust.userData.set(0);
      add(U6.brassKey(1.2), KYX, 0, 0); add(K.beaker(0.07, 0.18), SWX, 0, 0); add(K.liquid(0.065, 0.12, 0x2f9c8c, 0.55), SWX, 0.012, 0); add(K.balloon(0xcfe4ff, 0.08), BLX, 0, 0);
      const ls = [['water and sugar', '#ffffff', P_SB[0], 0.36, 0.1], ['salt and water', '#ffffff', SLX, 0.34, 0.1], ['a soft drink', '#9fe0b0', DKX, 0.46, 0.1], ['two dishes over a burner', '#ffffff', TPX, 0.82, 0.08], ['a brass key, sea water, air', '#ffffff', (KYX + BLX) / 2, 0.66, 0.08]].map(([s, c, x, y, z]) => tag(s, 0.042, c, x, y, z));
      const lW = tag('the sugar disappears… where?', 0.045, '#ffd27a', SBX, 0.4, 0.1);
      const lA = [grp(tag('made in water: an aqueous solution', 0.04, '#ffd27a', SLX, 0.4, 0.1), 'aq'), grp(tag('water dissolves so much: the universal solvent ✓', 0.038, '#ffd27a', SLX, 0.34, 0.1), 'aq')];
      const lD = [grp(tag('water: the solvent', 0.042, '#9fd2ff', DKX, 0.5, 0.1), 'dr'), grp(tag('sugar, CO₂, flavours: the solutes ✓', 0.04, '#ffd27a', DKX, 0.44, 0.1), 'dr')];
      const lP = [grp(tag('pure water', 0.042, '#ffffff', TPX - 0.2, 0.66, 0.1), 'pw'), grp(tag('salt water', 0.042, '#ffffff', TPX + 0.2, 0.74, 0.1), 'pw')];
      const lR = [grp(tag('nothing left', 0.042, '#ffffff', TPX - 0.2, 0.66, 0.1), 'pr'), grp(tag('a white crust ✓', 0.045, '#ffd27a', TPX + 0.2, 0.74, 0.1), 'pr')];
      const lR2 = tag('a solution leaves its solute behind ✓', 0.042, '#ffd27a', TPX, 0.82, 0.08);
      const lS = [grp(tag('solutions in all three states:', 0.042, '#ffd27a', (KYX + BLX) / 2, 0.68, 0.08), 'st'), grp(tag('alloy (solid) · sea water (liquid) · air (gas) ✓', 0.038, '#ffd27a', (KYX + BLX) / 2, 0.61, 0.08), 'st')];
      beats.push((t) => {
        // the spoon scoops, tips the sugar into the beaker; the rod stirs; the heap shrinks
        const a = ease(span(t, T.tip, T.tip + 1.0)), b = ease(span(t, T.tip + 1.0, T.tip + 1.6));
        const rb = ease(span(t, T.tip + 1.8, T.tip + 2.8)); sp.position.copy(K.arc(V(SDX + 0.06, 0.03, 0.04), V(SBX + 0.03, 0.32, 0), 0.15, a - rb)); sp.rotation.z = lerp(Math.PI / 2 - 0.3, Math.PI / 2 + 0.9, b - rb);   // scoop, tip, put back
        sug.userData.set(1 - 0.6 * a); heap.visible = t > T.tip + 1.4; heap.userData.set(1 - ease(span(t, T.tip + 2.4, T.tip + 5.0)));
        rod.position.copy(t < T.tip + 1.8 ? V(SBX + 0.2, 0, 0.05) : V(SBX + 0.03 * Math.cos(t * 6), 0.03, 0.03 * Math.sin(t * 6))); rod.rotation.z = t < T.tip + 1.8 ? 0.3 : 0.15;
        if (t > T.tip + 5.4) { rod.position.set(SBX + 0.2, 0, 0.05); rod.rotation.z = 0.3; }
        salt.userData.set(1 - ease(span(t, SL + 2.4, SL + 5.0))); fizz.userData.update(t, 0.6);
        brn.userData.flame.visible = t > TS + 2.8; const dry = ease(span(t, TS + 3.4, TS + 8.0)); wA.userData.set(1 - dry); wB.userData.set(1 - dry); crust.userData.set(dry * 0.9);
        const LT = [[0.4, 2.1], [SL + 0.3, SL + 2.2], [DR + 0.2, DR + 1.6], [TS + 0.3, TS + 0.3], [ST + 0.2, ST + 1.6]]; ls.forEach((l, i) => K.popIn(l, t, LT[i][0], LT[i][1]));   // each thing is named when its beat starts
        K.popIn(lW, t, T.tip + 5.2, 9.0);
        lA.forEach((l) => K.popIn(l, t, SL + 5.2, DR - 0.1)); lD.forEach((l) => K.popIn(l, t, DR + 1.8, TS - 0.1));
        lP.forEach((l) => K.popIn(l, t, TS + 2.8, TS + 5.4)); lR.forEach((l) => K.popIn(l, t, TS + 8.2, TS + 10.2)); K.popIn(lR2, t, TS + 10.4, ST - 0.1); lS.forEach((l) => K.popIn(l, t, ST + 1.8, END));
      });
    }

    // ================================================================ INSIDE (dark) · Fig. 6.1: solvent + solute = solution
    {
      U.stage((t) => t >= ID - 0.05 && t < B1 - 0.05); keyLight(DX);
      add(U5.glassBox(2.6, 1.6, 0.8), DX, AY, 0);
      const dz = U6.dissolver({ w: 2.6, h: 1.6, d: 0.8, ns: 44, nu: 12, from: V(0, -0.55, 0) }); add(dz.g, DX, AY, 0);
      const l1 = tag('water (blue) and a sugar crystal (gold)', 0.046, '#ffffff', DX, AY - 1.05, 0.1);
      const l2 = [grp(tag('sugar + water: a solution,', 0.05, '#ffd27a', DX, AY - 0.97, 0.1), 'h'), grp(tag('the same all through (homogeneous) ✓', 0.046, '#ffd27a', DX, AY - 1.15, 0.1), 'h')];
      const l3 = [grp(tag('water, more of it: the solvent', 0.046, '#9fd2ff', DX, AY - 0.97, 0.1), 's'), grp(tag('sugar, less of it: the solute ✓', 0.046, '#ffd27a', DX, AY - 1.15, 0.1), 's')];
      const l4 = tag('two parts: a binary solution', 0.05, '#ffffff', DX, AY - 1.05, 0.1);
      beats.push((t) => { dz.place(t - ID, ease(span(t, ID + 2.4, ID + 5.6))); K.popIn(l1, t, ID + 0.4, ID + 2.6); l2.forEach((l) => K.popIn(l, t, ID + 3.8, ID + 7.2)); l3.forEach((l) => K.popIn(l, t, ID + 7.4, ID + 10.4)); K.popIn(l4, t, ID + 10.6, B1); });
    }
    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Where does sugar go when it disappears in water?', dockTitle: 'A solution', intro: INTRO, ticks: TICKS,
      rows: [[0, 'sugar, salt, a soft drink, two dishes, a key'], [1, 'evenly mixed: a solution (homogeneous)'], [1, 'solvent: the larger part; solute: the smaller'], [1, 'in water: aqueous; water the universal solvent'], [1, 'a soft drink: one solvent, many solutes'], [1, 'boil it dry: a solution leaves a residue'], [1, 'solutions in all three states']],
      short: ['a solution', 'solvent, solute', 'aqueous', 'soft drink', 'boil it dry', 'three states'] }));
    return U.finish();
  },
};
