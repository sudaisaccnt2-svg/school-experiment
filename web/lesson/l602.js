// Lesson 602 · Saturated, Unsaturated, Supersaturated (book pp. 154–155: 6.2 (i) saturated solution, (ii) unsaturated
// solution, (iii) supersaturated solution, the crystal test, Fig. 6.2 a b c; Skill Development (1) a saturated NaCl
// solution). v1 as a code lesson (2026-11-04), replacing the old Blender film. SKILL.md §0 + §1 + §4.
// THE QUESTION (book: "If the addition of sugar is kept on, a stage is reached when the further amount of solute will
//   not dissolve"): "How much sugar can a glass of water take?" → card, docked panel, four ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a beaker of water, a dish of sugar and a spoon, a hot plate, three beakers marked a, b, c with a
//         dish of crystals and tongs (named one at a time) · the question → card.
//  SPOONS spoon 1 goes in, the rod stirs, it all dissolves "it dissolves: still room for more (unsaturated) ✓" · spoons
//         2, 3, 4 (counted on the beaker): the last stays on the bottom "some stays: it can take no more (saturated) ✓" ·
//         dive (dark): the gold sugar spread through the water; the heap below; one leaves the heap as one joins it "the
//         water is full: no more sugar dissolves".
//  HEAT   the beaker goes on the hot plate: the heap on the bottom dissolves "hot, it takes more than saturated:
//         supersaturated ✓".
//  TEST   Fig. 6.2: tongs drop one crystal into each beaker: (a) it dissolves "unsaturated", (b) it stays "saturated",
//         (c) crystals grow on it "supersaturated" ✓.
//  END    "Unsaturated: more fits. Saturated: full. Supersaturated: over-full ✓".
// Game (🎮 Mixture Sorter + Solution Lab, docs/COVERAGE_U6.md): the three definitions, the crystal test.
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
const HKX = 0, BKX = HKX - 0.85, SDX = HKX - 0.5, HPX = HKX - 0.12, TX = [HKX + 0.32, HKX + 0.72, HKX + 1.12], CDX = HKX + 1.45;
const DX = 40;

// ---------------------------------------------------------------- time
const T = { card: 7.0 };
const DOCK = T.card + 5.0;
const SP = (k) => DOCK + 0.6 + k * 3.2, ID = SP(4) + 4.0, B1 = ID + 8.0, HT = B1, TS = HT + 9.0, END = TS + 15.0;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[SP(0) + 3.0, 0], [SP(3) + 3.6, 1], [HT + 7.0, 2], [TS + 13.4, 3]];
const DARK = [[ID, B1]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [4.4, T.card, 'How much sugar can a glass of water take?', [HKX + 0.2, 0.6, 0.05]],
  [SP(4) + 0.4, ID - 0.3, 'Why does the last spoon stay?', [BKX, 0.42, 0.05]],
  [TS + 0.2, TS + 2.4, 'Fig. 6.2: drop one crystal into each', [TX[1], 0.48, 0.05]],
  [END + 0.4, T.done, 'Unsaturated: more fits. Saturated: full. Supersaturated: over-full ✓', [HKX + 0.2, 0.6, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX + 0.3, 0.25, 0.05], 2.7 * k, 0.75 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const near = (t, p, w = 0.8, h = 0.65, e) => S(t, p, w, h, ADIR, e);
const P_BK = [(BKX + SDX) / 2 - 0.05, 0.2, 0.05], P_IN = [BKX, 0.04, 0.02], P_HP = [HPX, 0.25, 0.05], P_TS = [TX[1] + 0.22, 0.2, 0.05];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(SP(0) - 0.2, P_BK, 0.72, 0.6), near(SP(4), P_BK, 0.7, 0.58), near(SP(4) + 2.6, P_IN, 0.3, 0.26), DIVE(ID - 0.05, P_IN),
  DK(ID, DX, 3.0, 2.0, 0.3), DK(ID + 1.8, DX, 3.0, 2.0, 1.04, 'out'), DK(B1 - 0.05, DX, 3.0, 2.0, 0.97),
  S(B1, P_IN, 0.1, 0.08, ADIR, 'out'), near(HT + 1.2, [(BKX + HPX) / 2, 0.25, 0.05], 0.95, 0.62), near(HT + 2.6, [HPX, 0.25, 0.05], 0.62, 0.55), near(TS - 0.05, [HPX, 0.25, 0.05], 0.6, 0.53),
  near(TS + 1.2, P_TS, 1.4, 0.6), near(END - 0.05, P_TS, 1.35, 0.58), HK(END + 0.4, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '602', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;

    // ================================================================ BENCH
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', HKX + 0.3, 3.0, 0.8);
      const bk = add(new THREE.Group(), BKX, 0, 0); bk.add(K.beaker(0.1, 0.22)); const lq = K.liquid(0.095, 0.15, 0x3d9ee6, 0.5); lq.position.y = 0.012; bk.add(lq);
      const heap = U6.crystalHeap(0.045, 50); heap.position.y = 0.014; bk.add(heap);
      add(U5.saltCrystals(0, 0.02), SDX, 0, 0); const sug = add(U6.crystalHeap(0.045, 60), SDX, 0.012, 0), sp = add(K.spoon(0.22), SDX + 0.06, 0.03, 0.04); sp.rotation.z = Math.PI / 2 - 0.3;
      const rod = add(U6.stirRod(0.3), BKX + 0.18, 0, 0.06); rod.rotation.z = 0.3;
      const hp = add(K.hotPlate(), HPX, 0, 0), glow = add(K.glowSprite(0xff5a2a, 0.26), HPX, 0.11, 0);
      const beak = TX.map((x, i) => { add(K.beaker(0.08, 0.18), x, 0, 0); add(K.liquid(0.075, 0.12, 0x3d9ee6, 0.5), x, 0.012, 0); return x; });
      const crys = TX.map((x) => add(K.solid(new THREE.BoxGeometry(0.018, 0.018, 0.018), new THREE.MeshPhysicalMaterial({ color: 0xf6f6f2, roughness: 0.15, transmission: 0.3, thickness: 0.02 })), x, 0.4, 0));
      const needles = Array.from({ length: 9 }, (_, i) => { const n = add(K.solid(new THREE.BoxGeometry(0.006, 0.006, 0.05), new THREE.MeshPhysicalMaterial({ color: 0xf6f6f2, roughness: 0.2 })), TX[2], 0.022, 0); n.rotation.set(0.6 * Math.sin(i), i * 0.7, 0.5 * Math.cos(i)); return n; });
      add(U5.saltCrystals(5, 0.016), CDX, 0, 0); const tg = add(K.tongs(0.3), CDX, 0.012, 0.02);
      const ls = [['water, sugar and a spoon', '#ffffff', P_BK[0], 0.36, 0.1], ['a hot plate', '#ffffff', HPX, 0.24, 0.12], ['three beakers a, b, c, a crystal and tongs', '#ffffff', TX[1] + 0.2, 0.32, 0.08]].map(([s, c, x, y, z]) => tag(s, 0.042, c, x, y, z));
      const count = [1, 2, 3, 4].map((n) => tag(`spoon ${n}`, 0.045, '#ffffff', BKX, 0.32, 0.1));
      const lU = [grp(tag('it dissolves: still room for more', 0.042, '#ffd27a', BKX + 0.12, 0.4, 0.1), 'u'), grp(tag('(unsaturated) ✓', 0.045, '#ffd27a', BKX + 0.12, 0.34, 0.1), 'u')];
      const lS = [grp(tag('some stays: it can take no more', 0.042, '#ffd27a', BKX + 0.12, 0.4, 0.1), 's'), grp(tag('(saturated) ✓', 0.045, '#ffd27a', BKX + 0.12, 0.34, 0.1), 's')];
      const lH = [grp(tag('hot, it takes more than saturated:', 0.042, '#ffd27a', HPX, 0.48, 0.1), 'h'), grp(tag('supersaturated ✓', 0.048, '#ffd27a', HPX, 0.41, 0.1), 'h')];
      const lT = [['a: it dissolves', TX[0]], ['b: it stays', TX[1]], ['c: crystals grow', TX[2]]].map(([s, x]) => grp(tag(s, 0.036, '#ffffff', x, 0.13, 0.12), 'tst'));
      const lT2 = tag('unsaturated · saturated · supersaturated ✓', 0.042, '#ffd27a', TX[1], 0.42, 0.1);
      const TA = (i) => TS + 2.6 + 3.4 * i;
      beats.push((t) => {
        // four spoonfuls: scoop, tip over the beaker, back; stir; the heap in the beaker grows; the first three dissolve
        let sx = V(SDX + 0.06, 0.03, 0.04), rz = Math.PI / 2 - 0.3, inB = 0;
        for (let k = 0; k < 4; k++) { const a = ease(span(t, SP(k), SP(k) + 0.8)), b = ease(span(t, SP(k) + 0.8, SP(k) + 1.2)), r = ease(span(t, SP(k) + 1.3, SP(k) + 2.0)); if (t > SP(k) && t < SP(k) + 2.0) { sx = K.arc(V(SDX + 0.06, 0.03, 0.04), V(BKX + 0.03, 0.32, 0), 0.15, a - r); rz = lerp(Math.PI / 2 - 0.3, Math.PI / 2 + 0.9, b - r); } }
        sp.position.copy(sx); sp.rotation.z = rz;
        const added = [0, 1, 2, 3].filter((k) => t > SP(k) + 1.0).length; sug.userData.set(1 - 0.2 * added);
        const dis = (k) => (k < 3 ? ease(span(t, SP(k) + 1.6, SP(k) + 3.0)) : 0), left = added - [0, 1, 2].reduce((s, k) => s + (t > SP(k) + 1.0 ? dis(k) : 0), 0);
        const melt = ease(span(t, HT + 2.6, HT + 6.0));
        heap.visible = left > 0.02 && melt < 1; heap.userData.set(Math.min(1, Math.max(0, left) * 0.5) * (1 - melt));
        const stir = [0, 1, 2, 3].some((k) => t > SP(k) + 1.4 && t < SP(k) + 2.9); rod.position.copy(stir ? V(BKX + 0.03 * Math.cos(t * 6), 0.03, 0.03 * Math.sin(t * 6)) : V(BKX + 0.18, 0, 0.06)); rod.rotation.z = stir ? 0.15 : 0.3;
        // onto the hot plate
        const mv = ease(span(t, HT + 0.6, HT + 1.8)); bk.position.copy(K.arc(V(BKX, 0, 0), V(HPX, 0.105, -0.01), 0.15, mv)); hp.userData.on(ease(span(t, HT + 1.9, HT + 2.3))); glow.visible = t > HT + 2.2; glow.material.opacity = 0.45;
        if (t > HT + 1.8) rod.position.set(BKX + 0.18, 0, 0.06);
        // Fig. 6.2: one crystal into each beaker
        crys.forEach((c, i) => { const a = ease(span(t, TA(i), TA(i) + 1.0)), d = easeIn(span(t, TA(i) + 1.0, TA(i) + 1.5)); c.visible = t > TA(i) - 0.2 && !(i === 0 && t > TA(i) + 3.0); c.position.set(lerp(CDX, TX[i], a), lerp(0.4, 0.022, d) + 0.25 * Math.sin(Math.PI * a) * (1 - d), 0); c.scale.setScalar(i === 0 ? Math.max(1e-3, 1 - ease(span(t, TA(i) + 1.6, TA(i) + 3.0))) : 1); });
        tg.position.set(t > TS + 2.4 && t < TA(2) + 1.2 ? crys[Math.min(2, Math.max(0, Math.floor((t - TS - 2.6) / 3.4)))].position.x : CDX, t > TS + 2.4 && t < TA(2) + 1.2 ? 0.42 : 0.012, 0.02);
        needles.forEach((n, i) => { const g = ease(span(t, TA(2) + 1.8 + 0.1 * i, TA(2) + 3.0 + 0.1 * i)); n.visible = g > 0.01; n.scale.set(1, 1, Math.max(1e-3, g)); });
        ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 1.4, 1.8 + i * 1.4));
        count.forEach((l, k) => K.popIn(l, t, SP(k) + 0.1, SP(k) + 1.5)); lU.forEach((l) => K.popIn(l, t, SP(0) + 1.7, SP(1))); lS.forEach((l) => K.popIn(l, t, SP(3) + 2.4, SP(4) + 0.3));
        lH.forEach((l) => K.popIn(l, t, HT + 6.2, TS - 0.1)); lT.forEach((l, i) => K.popIn(l, t, TA(i) + 2.4, TA(2) + 5.2)); K.popIn(lT2, t, TA(2) + 5.4, END);
      });
    }

    // ================================================================ INSIDE (dark) · a saturated solution: full
    {
      U.stage((t) => t >= ID - 0.05 && t < B1 - 0.05); keyLight(DX);
      add(U5.glassBox(2.6, 1.6, 0.8), DX, AY, 0);
      const dz = U6.dissolver({ w: 2.6, h: 1.6, d: 0.8, ns: 40, nu: 18, from: V(0, -0.62, 0) }); add(dz.g, DX, AY, 0);
      const heapP = U5.swarm(14, { r: 0.07, color: 0xffc04d, w: 2.6, h: 1.6, d: 0.8 }); add(heapP.g, DX, AY, 0);
      const HP = Array.from({ length: 14 }, (_, i) => V((i % 5 - 2) * 0.15, -0.72 + Math.floor(i / 5) * 0.13, ((i * 7) % 3 - 1) * 0.12));
      const l1 = tag('sugar spread all through the water', 0.048, '#ffd27a', DX, AY - 1.05, 0.1);
      const l2 = [grp(tag('the water is full:', 0.05, '#ffffff', DX, AY - 0.97, 0.1), 'f'), grp(tag('the rest stays on the bottom', 0.048, '#ffffff', DX, AY - 1.15, 0.1), 'f')];
      beats.push((t) => { dz.place(t - ID, 1); heapP.place(t - ID, (i) => HP[i].clone().add(V(Math.sin((t - ID) * 18 + i), 0, 0).multiplyScalar(0.01))); K.popIn(l1, t, ID + 0.6, ID + 3.6); l2.forEach((l) => K.popIn(l, t, ID + 3.8, B1)); });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'How much sugar can a glass of water take?', dockTitle: 'How much?', intro: INTRO, ticks: TICKS,
      rows: [[0, 'water, sugar, a hot plate, three beakers'], [1, 'it dissolves, more fits: unsaturated'], [1, 'some stays: saturated'], [1, 'heated, it takes more: supersaturated'], [1, 'Fig. 6.2: the crystal test']],
      short: ['unsaturated', 'saturated', 'supersaturated', 'crystal test'] }));
    return U.finish();
  },
};
