// Lesson 612 · Liquids Mixing & Gas Pressure (book pp. 168–170: (ii) ionic compounds in non-polar solvents (CCl₄,
// benzene); (iii) liquid solutes and solvents: immiscible (benzene and water, Fig. 6.8), completely miscible (benzene and
// CCl₄; fats, oils, greases in non-polar liquids), ethanol and water mix freely (–OH hydrogen bonds, Fig. 6.9); (iii)
// effect of pressure (solids and liquids not affected; gases more soluble at higher pressure: the soda bottle); Activity
// 6.2 (salt, vinegar, iodine in water; iodine in methylated spirit); Point to Ponder). v1 as a code lesson (2026-11-04).
// THE QUESTION (book: "Liquid solutes and solvents that are not soluble in each other are immiscible"): "Why do some
//   liquids mix and others stay in layers?" → card, docked panel, six ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: benzene being poured onto water, onto carbon tetrachloride (CCl₄), alcohol onto water; a closed
//         soda bottle; four test tubes in a rack; two 500 cm³ cylinders (alcohol, water) and an empty 1 L cylinder.
//  MIX    benzene on water: two layers "immiscible ✓" · benzene into CCl₄: one liquid "completely miscible ✓ (both
//         non-polar)" · alcohol into water: one liquid "they mix freely" → dive (dark): ethanol and water molecules,
//         dotted hydrogen bonds between –OH and water "–OH bonds to water (hydrogen bonds) ✓".
//  SODA   the cap twists off: bubbles race up "less pressure: the gas is less soluble, CO₂ comes out ✓" · "pressure
//         changes the solubility of gases, not of solids and liquids".
//  ACT    Activity 6.2: salt into water: dissolves ✓ · vinegar into water: mixes ✓ · iodine grains in water: stay ✗ ·
//         iodine in methylated spirit: brown solution ✓ "like dissolves like".
//  PONDER Point to Ponder: 500 cm³ alcohol + 500 cm³ water into the 1 L cylinder: the level stops below the mark "less
//         than 1 litre: the molecules pack closer (hydrogen bonds) ✓".
//  END    "Liquids alike in polarity mix; gases dissolve more under pressure ✓".
// Game (🎮 Solution Lab, docs/COVERAGE_U6.md): Activity 6.2 table, the salt-in-a-full-glass ponder, which liquids mix.
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
const B = [-1.16, -0.82, -0.48], SDX = -0.18, RKX = 0.25, CY = [0.66, 0.84, 1.06];
const DX = 40;
const WATER = 0x2f86e0, BENZ = 0xe8c860, CCL = 0xe8eef6, ALC = 0xeef4fa;

// ---------------------------------------------------------------- time
const T = { card: 9.6 };
const DOCK = T.card + 5.0;
const MX = DOCK + 0.4, ID = MX + 13.2, B1 = ID + 8.0, SO = B1, AC = SO + 8.0, PO = AC + 13.6, END = PO + 10.4;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[MX + 3.6, 0], [MX + 7.6, 1], [ID + 6.4, 2], [SO + 5.0, 3], [AC + 12.0, 4], [PO + 9.0, 5]];
const DARK = [[ID, B1]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [7.2, T.card, 'Why do some liquids mix and others stay in layers?', [0, 0.6, 0.05]],
  [MX + 11.6, ID - 0.2, 'Why do alcohol and water mix so well?', [B[2], 0.38, 0.05]],
  [SO + 0.2, SO + 1.8, 'Open a bottle of soda water', [SDX, 0.45, 0.05]],
  [AC + 0.2, AC + 2.0, 'Activity 6.2: four solutes, two solvents', [RKX, 0.45, 0.05]],
  [PO + 0.2, PO + 2.2, 'Point to Ponder: 500 cm³ alcohol + 500 cm³ water', [CY[1], 0.6, 0.05]],
  [END + 0.4, T.done, 'Liquids alike in polarity mix; gases dissolve more under pressure ✓', [0, 0.6, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [0, 0.28, 0.0], 2.4 * k, 0.8 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const near = (t, p, w = 0.8, h = 0.65, e) => S(t, p, w, h, ADIR, e);
const P_MX = [B[1], 0.24, 0.0], P_IN = [B[2], 0.08, 0.0], P_SO = [SDX, 0.2, 0.0], P_AC = [RKX, 0.24, 0.0], P_PO = [CY[1], 0.32, 0.0];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(MX, P_MX, 0.85, 0.65), near(MX + 11.4, P_MX, 0.82, 0.62), near(MX + 12.4, P_IN, 0.24, 0.2), DIVE(ID - 0.05, P_IN),
  DK(ID, DX, 3.0, 2.0, 0.3), DK(ID + 1.8, DX, 3.0, 2.0, 1.04, 'out'), DK(B1 - 0.05, DX, 3.0, 2.0, 0.97),
  S(B1, P_IN, 0.5, 0.45, ADIR, 'out'), near(SO + 0.8, P_SO, 0.5, 0.5), near(AC - 0.05, P_SO, 0.48, 0.48), near(AC + 0.4, P_AC, 0.8, 0.55), near(PO - 0.05, P_AC, 0.77, 0.53),
  near(PO + 0.4, P_PO, 0.85, 0.85), near(END - 0.05, P_PO, 0.82, 0.82), HK(END + 0.4, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '612', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;

    // ================================================================ BENCH
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', -0.02, 2.8, 0.85);
      // MIX: three beakers with a small bottle of the liquid that is poured in
      const base = [WATER, CCL, WATER], top = [BENZ, BENZ, ALC], miscible = [false, true, true], names = [['benzene', 'water'], ['benzene', 'CCl₄'], ['alcohol', 'water']];
      const bk = B.map((x, i) => { add(K.labBeaker(0.06, 0.18), x, 0, 0); const l = add(K.liquid(0.055, 0.07, base[i], base[i] === WATER ? 0.58 : 0.4), x, 0.012, 0); const up = add(K.liquid(0.055, 0.05, top[i], 0.62), x, 0.012 + 0.07 + 0.004, 0); up.visible = false; return { l, up }; });
      const bt = B.map((x, i) => { const g = add(new THREE.Group(), x + 0.1, 0, -0.16); g.add(K.reagentBottle(top[i], 0.16, 0.04, names[i][0])); return g; });
      const stm = add(U6.stream(BENZ)), pours = B.map((x, i) => U6.pourer(bt[i], V(x + 0.1, 0, -0.16), null, V(x, 0.33, 0), V(-0.016, 0.16, 0), stm, { dur: 1.0, tilt: 2.0 }));
      // SODA
      const sb = add(K.glassBottle(1.3), SDX, 0, 0), cap = add(K.solid(new THREE.CylinderGeometry(0.024, 0.024, 0.018, 20), M.metal(0xc84a3a, 0.4)), SDX, 0.405 + 0.01, 0), fz = add(K.bubbles(30, V(0, 0.04, 0), 0.38, 0.05, 0.009), SDX, 0, 0);
      // ACTIVITY 6.2: a rack of four tubes
      const rk = add(K.tubeRack(4, 0.13, 0.022), RKX, 0, 0), tubes = [0, 1, 2, 3].map((i) => { const tb = add(K.testTube(0.022, 0.2), RKX + rk.userData.x(i), 0.03, 0); return tb; });
      const fills = tubes.map((tb, i) => tb.userData.fill(i === 3 ? 0xeef0f4 : WATER, 0.16, i === 3 ? 0.35 : 0.6));
      const grains = [0, 1, 2, 3].map((i) => { const h = add(U6.crystalHeap(0.011, 12, i === 0 ? 0xfafaf4 : 0x2a1a30), RKX + rk.userData.x(i), 0.036, 0); h.userData.set(0); return h; });
      // PONDER: two 500 cm³ cylinders and a 1 L cylinder
      const c1 = add(U6.gradCylinder(500, 0.04, 0.32), CY[0], 0, 0), c2 = add(U6.gradCylinder(500, 0.04, 0.32), CY[1], 0, 0), cL = add(U6.gradCylinder(1000, 0.05, 0.46), CY[2], 0, 0);
      c1.userData.set(500, ALC); c2.userData.set(500, WATER);
      const stP = add(U6.stream(WATER)), pA = U6.pourer(c1, V(CY[0], 0, 0), null, V(CY[2], 0.5, 0), V(0.03, 0.34, 0), stP, { dur: 1.4, tilt: 2.2, side: -1 }), pW = U6.pourer(c2, V(CY[1], 0, 0), null, V(CY[2], 0.5, 0), V(0.03, 0.34, 0), stP, { dur: 1.4, tilt: 2.2, side: -1 });
      const mk = add(new THREE.Mesh(new THREE.TorusGeometry(0.053, 0.002, 4, 30), new THREE.MeshBasicMaterial({ color: 0xffd27a })), CY[2], cL.userData.y(1000), 0); mk.rotation.x = Math.PI / 2;
      const ls = [['benzene onto water, onto CCl₄; alcohol onto water', '#ffffff', B[1], 0.34, 0.1], ['soda water, closed', '#9fe0b0', SDX, 0.5, 0.08], ['four test tubes', '#ffffff', RKX, 0.3, 0.08], ['alcohol · water · a 1 L cylinder', '#ffffff', CY[1], 0.56, 0.06]].map(([s, c, x, y, z]) => tag(s, 0.04, c, x, y, z));
      const say = (a, b, x, y, t0, t1, g) => ({ l: [grp(tag(a, 0.04, '#ffffff', x, y + 0.035, 0.1), g), ...(b ? [grp(tag(b, 0.044, '#ffd27a', x, y - 0.03, 0.1), g)] : [])], t0, t1 });
      const SAY = [
        say('two layers:', 'immiscible ✓', B[0], 0.3, MX + 2.6, MX + 4.2, 'm1'), say('one liquid:', 'completely miscible ✓ (non-polar)', B[1], 0.3, MX + 6.6, MX + 8.4, 'm2'), say('alcohol and water', 'mix freely ✓', B[2], 0.3, MX + 10.0, MX + 11.4, 'm3'),
        say('less pressure: the gas is less soluble,', 'CO₂ comes out ✓', SDX + 0.05, 0.3, SO + 3.4, SO + 5.6, 's1'), say('pressure changes how much gas dissolves,', 'not solids or liquids', SDX + 0.05, 0.3, SO + 5.8, AC, 's2'),
        say('salt ✓ · vinegar ✓ · iodine in water ✗', 'iodine in spirit ✓ (brown)', RKX, 0.36, AC + 9.0, AC + 11.4, 'a1'), say('polar with polar, non-polar with non-polar:', 'like dissolves like ✓', RKX, 0.36, AC + 11.6, PO, 'a2'),
        say('less than 1 litre: the molecules', 'pack closer (hydrogen bonds) ✓', CY[1] - 0.05, 0.6, PO + 7.4, END, 'p1'),
      ];
      const tl = ['salt', 'vinegar', 'iodine', 'iodine'].map((s, i) => grp(tag(s, 0.034, '#ffffff', RKX + rk.userData.x(i), 0.28, 0.1), 'tl')), sl = [['in water', -0.15], ['in spirit', 0.15]].map(([s, dx]) => grp(tag(s, 0.034, '#9fd2ff', RKX + dx, 0.07, 0.15), 'tl'));
      beats.push((t) => {
        bt.forEach((g) => g.traverse((o) => { if (o.isMesh && o.geometry?.type === 'CylinderGeometry' && o.renderOrder === 4) o.visible = Math.abs(g.rotation.z) < 0.4; }));   // the liquid inside runs out while it is tipped
        B.forEach((x, i) => { const f = t > MX + 4 * i ? pours[i](t, MX + 4 * i) : 0; const { l, up } = bk[i]; if (miscible[i]) { l.scale.y = 1 + 0.7 * f; up.visible = false; } else { up.visible = f > 0.02; up.scale.y = Math.max(1e-3, f); } });
        const off = ease(span(t, SO + 1.0, SO + 1.8)); cap.position.set(SDX + 0.06 * off, 0.415 + 0.1 * off - 0.4 * easeIn(span(t, SO + 1.8, SO + 2.3)), 0.04 * off); cap.rotation.z = 2 * off; fz.userData.update(t, span(t, SO + 1.6, SO + 2.0) * (1 - 0.6 * span(t, SO + 6, AC)));
        grains.forEach((g, i) => { const t0 = AC + 2.4 + 1.4 * i; g.userData.set(t > t0 ? (i === 2 ? 1 : 1 - ease(span(t, t0 + 0.4, t0 + 1.6))) : 0); g.position.y = 0.036 + 0.2 * (1 - easeIn(span(t, t0 - 0.4, t0))); });
        fills[1].userData.mat.color?.set(t > AC + 3.8 ? 0x6fa8e8 : WATER); fills[3].userData.mat.color?.set(new THREE.Color(0xeef0f4).lerp(new THREE.Color(0x7a2e0a), ease(span(t, AC + 7.0, AC + 8.4))));
        fills[3].userData.mat.opacity = lerp(0.35, 0.95, ease(span(t, AC + 7.0, AC + 8.4)));
        const fa = t > PO + 2.2 ? (t < PO + 5.0 ? pA(t, PO + 2.2) : 1) : 0, fw = t > PO + 5.0 ? pW(t, PO + 5.0) : 0;
        c1.userData.set(500 * (1 - fa), ALC); c2.userData.set(500 * (1 - fw), WATER); cL.userData.set(500 * fa + 465 * fw, fw > 0.05 ? 0x6fa8e8 : ALC);
        ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 1.7, 1.9 + i * 1.7)); SAY.forEach(({ l, t0, t1 }) => l.forEach((x) => K.popIn(x, t, t0, t1)));
        tl.forEach((l) => K.popIn(l, t, AC + 2.2, AC + 8.8)); sl.forEach((l) => K.popIn(l, t, AC + 2.2, AC + 8.8));
      });
    }

    // ================================================================ INSIDE (dark) · Fig. 6.9: ethanol and water hydrogen-bonded
    {
      U.stage((t) => t >= ID - 0.05 && t < B1 - 0.05); keyLight(DX);
      const water = () => U.ballMol([['O', 0, 0], ['H', -0.12, -0.09], ['H', 0.12, -0.09]], [[0, 1], [0, 2]], { r: { O: 0.08, H: 0.05 } });
      const eth = () => U.ballMol([['C', -0.28, 0], ['C', -0.08, 0.08], ['O', 0.12, 0], ['H', 0.24, 0.06]], [[0, 1], [1, 2], [2, 3]], { r: { C: 0.085, O: 0.08, H: 0.05 } });
      const E = [[-0.8, 0.35], [0.55, -0.3], [-0.1, -0.5]].map(([x, y]) => ({ m: add(eth(), DX + x, AY + y, 0), x, y }));
      const W = [[-0.35, 0.45], [0.95, -0.2], [0.35, -0.55], [-0.95, -0.25], [0.2, 0.4], [1.0, 0.45], [-0.5, -0.05], [0.6, 0.1]].map(([x, y]) => ({ m: add(water(), DX + x, AY + y, 0), x, y }));
      const dots = (a, b) => { const g = new THREE.Group(), m = M.glow(0xffc04d, 1.6); for (let i = 0; i < 5; i++) g.add(new THREE.Mesh(new THREE.SphereGeometry(0.013, 8, 6), m)); g.userData.set = (p, q) => g.children.forEach((d, i) => d.position.copy(p).lerp(q, (i + 0.5) / 5)); U.root.add(g); return g; };
      const hb = E.map((e, i) => ({ d: dots(), e, w: W[i] }));
      const l1 = tag('ethanol C₂H₅OH and water', 0.05, '#ffffff', DX, AY - 1.0, 0.1);
      const l2 = [grp(tag('the –OH of ethanol bonds to water', 0.046, '#ffd27a', DX, AY - 0.95, 0.1), 'hb'), grp(tag('(hydrogen bonds) ✓', 0.05, '#ffd27a', DX, AY - 1.15, 0.1), 'hb')];
      beats.push((t) => {
        const lt = t - ID; E.forEach((e, i) => { e.m.rotation.z = 0.2 * Math.sin(lt * 0.7 + i); }); W.forEach((w, i) => { w.m.position.set(DX + w.x + 0.03 * Math.sin(lt + i), AY + w.y + 0.03 * Math.cos(lt * 1.2 + i), 0); });
        hb.forEach(({ d, e, w }) => { d.visible = t > ID + 3.4; const h = e.m.localToWorld(V(0.24, 0.06, 0)), o = w.m.position.clone(); d.userData.set(h, o); });
        K.popIn(l1, t, ID + 0.6, ID + 3.2); l2.forEach((l) => K.popIn(l, t, ID + 3.6, B1));
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Why do some liquids mix and others stay in layers?', dockTitle: 'Mixing', intro: INTRO, ticks: TICKS,
      rows: [[0, 'benzene, water, CCl₄, alcohol, soda, iodine'], [1, 'benzene and water: immiscible'], [1, 'benzene and CCl₄: miscible'], [1, 'alcohol and water: hydrogen bonds'], [1, 'less pressure: less gas dissolves'], [1, 'Activity 6.2: like dissolves like'], [1, 'Point to Ponder: less than 1 litre']],
      short: ['immiscible', 'miscible', 'H-bonds', 'pressure', 'Activity 6.2', 'Point to Ponder'] }));
    return U.finish();
  },
};
