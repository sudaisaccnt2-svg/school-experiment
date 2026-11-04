// Lesson 611 · Solubility: Like Dissolves Like (book pp. 166–167: 6.5 solubility (grams of solute in 100 g of solvent
// to make a saturated solution, the formula); NaNO₃ is more soluble than AgCl; the factors (nature of the solvent, of the
// solute, pressure, temperature); (i) nature of the solvent: NaCl dissolves in water, not in benzene; (ii) nature of the
// solute: NaCl vs sugar (as printed, docs/NOTES.md); "like dissolves like" i–iii (ionic and polar in water; non-polar not
// in water; grease, paints in petrol, ether, CCl₄); LiCl in water but not in gasoline, gasoline mixes with benzene;
// (I) dissolving ionic compounds in a polar solvent, Fig. 6.7 hydrated ions). v1 as a code lesson (2026-11-04). SKILL.md.
// THE QUESTION (book: "Why are there such differences in solubility?"): "Why does salt dissolve in water but not in
//   benzene?" → card, docked panel, five ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table, three stations of two beakers each: water and water with sodium nitrate and silver chloride;
//         water and benzene with lithium chloride; benzene and water with a bottle of gasoline (named one at a time)
//         · "Solubility: the grams that dissolve in 100 g of solvent (saturated)" (the formula) → card.
//  A      the same water, two solutes: NaNO₃ disappears, AgCl stays as white powder "NaNO₃ is more soluble than AgCl:
//         the nature of the solute ✓".
//  B      the same solute, two solvents: LiCl disappears in water, stays in benzene "ionic: soluble in polar water, not
//         in non-polar benzene: the nature of the solvent ✓" → dive INTO the water (Fig. 6.7).
//  INSIDE (dark) a LiCl crystal (Li⁺ small, Cl⁻ big); water molecules come; the O end (δ−) turns to Li⁺, the H end (δ+)
//         to Cl⁻; one Li⁺ and one Cl⁻ are pulled out, each ringed by water "hydrated ions: water pulls the ions apart ✓".
//  C      gasoline poured into benzene: it mixes; into water: it floats in a layer "non-polar mixes with non-polar, not
//         with polar water ✓" · "grease and paints dissolve in petrol, ether, CCl₄".
//  END    "Like dissolves like: polar with polar, non-polar with non-polar ✓".
// Game (🎮 Solutions Practice › Tables, Solution Lab: which dissolves in which; the factors (Long Q ii); docs/COVERAGE_U6.md).
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
const SX = [-0.8, 0, 0.8], D = 0.16;                                 // three stations; beakers at ±D
const DX = 40;
const WATER = 0x2f86e0, BENZ = 0xf0e8c8, GAS = 0xd89a30;

// ---------------------------------------------------------------- time
const T = { card: 13.6 };
const DOCK = T.card + 5.0;
const A0 = DOCK + 0.4, B0 = A0 + 9.4, ID = B0 + 10.0, B1 = ID + 12.0, C0 = B1, END = C0 + 12.6;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[9.6, 0], [A0 + 8.0, 1], [B0 + 7.6, 2], [ID + 10.4, 3], [C0 + 9.0, 4]];
const DARK = [[ID, B1]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [11.4, T.card, 'Why does salt dissolve in water but not in benzene?', [0, 0.6, 0.05]],
  [A0 + 0.2, A0 + 2.2, 'The same water, two solutes', [SX[0], 0.45, 0.05]],
  [B0 + 0.2, B0 + 2.2, 'The same solute, two solvents', [SX[1], 0.45, 0.05]],
  [B0 + 8.4, ID - 0.2, 'How does water pull the crystal apart?', [SX[1] - D, 0.42, 0.05]],
  [C0 + 0.4, C0 + 2.4, 'Gasoline into benzene, and into water', [SX[2], 0.5, 0.05]],
  [END + 0.4, T.done, 'Like dissolves like: polar with polar, non-polar with non-polar ✓', [0, 0.6, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [0, 0.25, 0.0], 2.2 * k, 0.75 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const near = (t, p, w = 0.8, h = 0.65, e) => S(t, p, w, h, ADIR, e);
const st = (i) => [SX[i], 0.2, 0.0], P_IN = [SX[1] - D, 0.08, 0.0];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(A0, st(0), 0.6, 0.5), near(B0 - 0.05, st(0), 0.58, 0.48), near(B0, st(1), 0.6, 0.5), near(B0 + 8.2, st(1), 0.58, 0.48), near(B0 + 9.2, P_IN, 0.24, 0.2), DIVE(ID - 0.05, P_IN),
  DK(ID, DX, 3.2, 2.2, 0.3), DK(ID + 1.8, DX, 3.2, 2.2, 1.04, 'out'), DK(B1 - 0.05, DX, 3.2, 2.2, 0.97),
  S(B1, P_IN, 0.5, 0.45, ADIR, 'out'), near(C0 + 1.4, [SX[2], 0.26, 0.0], 0.7, 0.62), near(END - 0.05, [SX[2], 0.26, 0.0], 0.67, 0.6), HK(END + 0.4, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '611', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;

    // ================================================================ BENCH
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', 0, 2.4, 0.8);
      const beaker = (x, c, op = 0.58) => { add(K.labBeaker(0.06, 0.16), x, 0, 0); const l = add(K.liquid(0.055, 0.1, c, op), x, 0.012, 0); return l; };
      const heapIn = (x, c = 0xfafaf4) => { const h = add(U6.crystalHeap(0.04, 45, c), x, 0.014, 0); h.userData.set(0); return h; };
      const dish = (x, c) => { add(U5.saltCrystals(0, 0.02), x, 0, -0.2); return add(U6.crystalHeap(0.035, 40, c), x, 0.012, -0.2); };
      // A: water + NaNO₃ / water + AgCl
      beaker(SX[0] - D, WATER); beaker(SX[0] + D, WATER); const hA1 = heapIn(SX[0] - D), hA2 = heapIn(SX[0] + D, 0xf2f2ee); const dA1 = dish(SX[0] - 0.12), dA2 = dish(SX[0] + 0.12, 0xf2f2ee);
      // B: water + LiCl / benzene + LiCl
      beaker(SX[1] - D, WATER); beaker(SX[1] + D, BENZ, 0.45); const hB1 = heapIn(SX[1] - D), hB2 = heapIn(SX[1] + D); const dB = dish(SX[1], 0xfafaf4);
      // C: benzene / water, a bottle of gasoline
      const lC1 = beaker(SX[2] - D, BENZ, 0.45), lC2 = beaker(SX[2] + D, WATER); const gb = add(new THREE.Group(), SX[2], 0, -0.2); gb.add(K.reagentBottle(GAS, 0.2, 0.05, 'gasoline'));
      const layer = add(K.liquid(0.055, 0.025, GAS, 0.6), SX[2] + D, 0.112 + 0.003, 0); layer.visible = false;
      const st1 = add(U6.stream(GAS)), p1 = U6.pourer(gb, V(SX[2], 0, -0.2), null, V(SX[2] - D, 0.17, 0), V(-0.02, 0.2, 0), st1, { dur: 1.0, tilt: 2.0 }), p2 = U6.pourer(gb, V(SX[2], 0, -0.2), null, V(SX[2] + D, 0.17, 0), V(0.02, 0.2, 0), st1, { dur: 1.0, tilt: 2.0, side: -1 });
      const carry = add(U6.crystalHeap(0.022, 20)); carry.visible = false;
      const ls = [['water: NaNO₃ · AgCl', '#ffffff', SX[0], 0.3, 0.12], ['water · benzene: LiCl', '#ffffff', SX[1], 0.3, 0.12], ['benzene · water: gasoline', '#ffffff', SX[2], 0.3, 0.12]].map(([s, c, x, y, z]) => tag(s, 0.045, c, x, y, z));
      const lDef = [grp(tag('solubility = mass of solute ÷ mass of solvent × 100', 0.042, '#ffd27a', 0, 0.52, 0.05), 'df'), grp(tag('(the grams that saturate 100 g of solvent)', 0.04, '#ffd27a', 0, 0.42, 0.05), 'df')];
      const lF = tag('it depends on: solvent · solute · pressure · temperature', 0.04, '#ffffff', 0, 0.44, 0.05);
      const tA = [grp(tag('NaNO₃: dissolves', 0.04, '#ffffff', SX[0] - D, 0.26, 0.1), 'ta'), grp(tag('AgCl: stays', 0.04, '#ffffff', SX[0] + D, 0.26, 0.1), 'ta')];
      const rA = [grp(tag('NaNO₃ is more soluble than AgCl:', 0.04, '#ffd27a', SX[0], 0.4, 0.1), 'ra'), grp(tag('the nature of the solute ✓', 0.044, '#ffd27a', SX[0], 0.33, 0.1), 'ra')];
      const tB = [grp(tag('in water: dissolves', 0.04, '#ffffff', SX[1] - D, 0.26, 0.1), 'tb'), grp(tag('in benzene: stays', 0.04, '#ffffff', SX[1] + D, 0.26, 0.1), 'tb')];
      const rB = [grp(tag('ionic: soluble in polar water, not in benzene', 0.038, '#ffd27a', SX[1], 0.4, 0.1), 'rb'), grp(tag('the nature of the solvent ✓', 0.044, '#ffd27a', SX[1], 0.33, 0.1), 'rb')];
      const tC = [grp(tag('mixes', 0.042, '#ffffff', SX[2] - D, 0.26, 0.1), 'tc'), grp(tag('floats in a layer', 0.04, '#ffffff', SX[2] + D, 0.26, 0.1), 'tc')];
      const rC = [grp(tag('non-polar mixes with non-polar,', 0.04, '#ffd27a', SX[2], 0.42, 0.1), 'rc'), grp(tag('not with polar water ✓', 0.044, '#ffd27a', SX[2], 0.35, 0.1), 'rc')];
      const lG = tag('grease and paints dissolve in petrol, ether, CCl₄', 0.036, '#ffffff', SX[2], 0.4, 0.1);
      const add2 = (t, t0, from, to, h, dissolve, d) => { const a = ease(span(t, t0, t0 + 0.9)); if (t > t0 && t < t0 + 0.9) { carry.visible = true; carry.position.copy(K.arc(from, to, 0.12, a)); } h.userData.set(t > t0 + 0.9 ? (dissolve ? 1 - ease(span(t, t0 + 1.4, t0 + 3.6)) : 1) : 0); d.userData.set(t > t0 ? 0.7 : 1); };
      beats.push((t) => {
        carry.visible = false;
        add2(t, A0 + 1.6, V(SX[0] - 0.12, 0.02, -0.2), V(SX[0] - D, 0.2, 0), hA1, true, dA1); add2(t, A0 + 2.6, V(SX[0] + 0.12, 0.02, -0.2), V(SX[0] + D, 0.2, 0), hA2, false, dA2);
        add2(t, B0 + 1.6, V(SX[1], 0.02, -0.2), V(SX[1] - D, 0.2, 0), hB1, true, dB); add2(t, B0 + 2.6, V(SX[1], 0.02, -0.2), V(SX[1] + D, 0.2, 0), hB2, false, dB);
        const f1 = t > C0 + 1.0 ? (t < C0 + 4.4 ? p1(t, C0 + 1.0) : 1) : 0, f2 = t > C0 + 4.4 ? p2(t, C0 + 4.4) : 0;
        lC1.traverse((o) => { if (o.material?.color) o.material.color.set(BENZ).lerp(new THREE.Color(GAS), 0.45 * f1); });
        layer.visible = f2 > 0.05; layer.scale.y = Math.max(1e-3, f2);
        ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 1.6, 1.8 + i * 1.6)); lDef.forEach((l) => K.popIn(l, t, 5.4, 8.0)); K.popIn(lF, t, 8.2, 11.2);
        tA.forEach((l) => K.popIn(l, t, A0 + 5.0, A0 + 6.8)); rA.forEach((l) => K.popIn(l, t, A0 + 7.0, B0 - 0.1));
        tB.forEach((l) => K.popIn(l, t, B0 + 5.0, B0 + 6.6)); rB.forEach((l) => K.popIn(l, t, B0 + 6.8, B0 + 8.3));
        tC.forEach((l) => K.popIn(l, t, C0 + 6.6, C0 + 8.4)); rC.forEach((l) => K.popIn(l, t, C0 + 8.6, C0 + 10.6)); K.popIn(lG, t, C0 + 10.8, END);
      });
    }

    // ================================================================ INSIDE (dark) · Fig. 6.7: water pulls Li⁺ and Cl⁻ out of the crystal
    {
      U.stage((t) => t >= ID - 0.05 && t < B1 - 0.05); keyLight(DX);
      const ion = (c, r, s) => { const g = new THREE.Group(); g.add(K.solid(new THREE.SphereGeometry(r, 22, 16), M.gloss(c))); const l = K.label(s, r * 0.9, '#ffffff', 800); l.position.z = r + 0.01; l.renderOrder = 22; l.userData.mark = true; g.add(l); return add(g); };
      const A = 0.3, cx = DX - 0.9, cells = [];
      for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) for (let z = 0; z < 2; z++) cells.push({ li: (x + y + z) % 2 === 1, p: V(cx + (x - 1) * A, AY + (y - 1) * A, (z - 0.5) * A) });
      const ions = cells.map((c) => ({ ...c, m: ion(c.li ? 0x8c6fd8 : 0x6fd07a, c.li ? 0.08 : 0.13, c.li ? '+' : '−') }));
      const outLi = ions.find((o) => o.li && o.p.x > cx + 0.1 && o.p.z > 0), outCl = ions.find((o) => !o.li && o.p.x > cx + 0.1 && o.p.y < AY - 0.1);
      const dLi = V(DX + 0.5, AY + 0.45, 0.2), dCl = V(DX + 0.9, AY - 0.5, 0.2);
      const water = () => U.ballMol([['O', 0, 0], ['H', -0.1, -0.08], ['H', 0.1, -0.08]], [[0, 1], [0, 2]], { r: { O: 0.07, H: 0.045 } });
      const rings = [[outLi, dLi, true], [outCl, dCl, false]].map(([o, dst, li]) => ({ o, dst, li, ws: Array.from({ length: 6 }, (_, k) => ({ m: add(water()), a: k / 6 * Math.PI * 2, from: V(DX + 1.6 + 0.3 * Math.cos(k) + (li ? 0 : 0.35), AY + (k - 2.5) * 0.25 + (li ? 0.12 : -0.12), li ? 0.3 : 0.5) })) }));
      const l1 = tag('a LiCl crystal: Li⁺ (small), Cl⁻ (big)', 0.05, '#ffffff', DX, AY - 1.05, 0.1);
      const l2 = [grp(tag('water’s O end (δ−) turns to Li⁺,', 0.045, '#ffffff', DX, AY - 0.97, 0.1), 'or'), grp(tag('its H end (δ+) to Cl⁻', 0.045, '#ffffff', DX, AY - 1.15, 0.1), 'or')];
      const l3 = [grp(tag('water pulls the ions apart:', 0.048, '#ffd27a', DX, AY - 0.97, 0.1), 'hy'), grp(tag('hydrated ions ✓', 0.055, '#ffd27a', DX, AY - 1.17, 0.1), 'hy')];
      beats.push((t) => {
        const pull = ease(span(t, ID + 6.4, ID + 8.6));
        rings.forEach(({ o, dst, li, ws }) => {
          const c = o.p.clone().lerp(dst, pull); o.m.position.copy(c);
          ws.forEach(({ m, a, from }, k) => { const u = ease(span(t, ID + 2.8 + 0.2 * k, ID + 4.6 + 0.2 * k)), r = li ? 0.24 : 0.3, at = c.clone().add(V(Math.cos(a) * r, Math.sin(a) * r, 0.05)); m.position.copy(from).lerp(at, u); m.rotation.z = lerp(0, li ? a + Math.PI / 2 : a - Math.PI / 2, u); m.visible = t > ID + 2.6; });
        });
        ions.forEach((o) => { if (o !== outLi && o !== outCl) o.m.position.copy(o.p); });
        K.popIn(l1, t, ID + 0.6, ID + 2.8); l2.forEach((l) => K.popIn(l, t, ID + 3.0, ID + 6.4)); l3.forEach((l) => K.popIn(l, t, ID + 8.8, B1));
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Why does salt dissolve in water but not in benzene?', dockTitle: 'Solubility', intro: INTRO, ticks: TICKS,
      rows: [[0, 'water, benzene, NaNO₃, AgCl, LiCl, gasoline'], [1, 'solubility: grams in 100 g of solvent'], [1, 'NaNO₃ more soluble than AgCl (solute)'], [1, 'LiCl in water, not in benzene (solvent)'], [1, 'Fig. 6.7: water pulls ions apart'], [1, 'gasoline mixes with benzene, not water']],
      short: ['solubility', 'the solute', 'the solvent', 'hydrated ions', 'like dissolves like'] }));
    return U.finish();
  },
};
