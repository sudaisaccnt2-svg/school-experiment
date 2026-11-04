// Lesson 512 · Allotropy (book p. 145: 5.6 Allotropy, the three reasons (carbon in many forms; O₂ and O₃; sulphur's two
// crystal arrangements), different physical but the same chemical properties, transition temperature, S₈ 95.5 °C,
// grey ⇌ white tin 13.2 °C, KNO₃ 128.5 °C). v1 as a code lesson (2026-11-04), replacing the old Blender film. SKILL.md.
// THE QUESTION (book: "The existence of an element in more than one physical forms is called allotropy"): "All of these
//   are carbon. How can one element look so different?" → card, docked panel, five ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a pencil (graphite), a diamond, charcoal, a sooty plate (named one at a time), a jar of oxygen,
//         yellow sulphur crystals on a hot plate, a tall thermometer · "one element, more than one form: allotropy ✓"
//         · "Now look into a jar of oxygen" → dive INTO the jar.
//  OXYGEN (dark) O₂ molecules drift (2 balls) "oxygen O₂: 2 atoms"; one with 3 balls glows "ozone O₃: 3 atoms" "different
//         numbers of atoms ✓".
//  SULPHUR the hot plate is switched on, the thermometer climbs to 95.5 °C: the chunky rhombic crystals turn into long
//         needles "at 95.5 °C: monoclinic needles ✓ (the same S₈, a new arrangement)".
//  CARBON "Inside a diamond and a pencil" → dive (dark): the diamond net (4 bonds each, tetrahedral) beside graphite's
//         flat hexagon layers; oxygen arrives, CO₂ molecules fly off both "different shapes, both burn to CO₂: the same
//         chemistry ✓".
//  TEMPS  the tall thermometer: three marks light, 13.2 · 95.5 · 128.5 °C with their pairs (grey ↔ white tin, rhombic ↔
//         monoclinic sulphur, rhombohedral ↔ orthorhombic KNO₃) "transition temperature: both forms meet ✓".
//  END    "One element, many forms: allotropy ✓".
// Game (🎮 State Sorter, docs/COVERAGE_U5.md): kajol, soot, the three temperatures, the crystal names.
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U5.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
import * as U5 from './u5kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, PNX = HKX - 1.05, DMX = HKX - 0.75, CHX = HKX - 0.45, STX = HKX - 0.12, OJX = HKX + 0.28, HPX = HKX + 0.7, TTX = HKX + 1.3; 
const OX = 40, CX = 52;

// ---------------------------------------------------------------- time
const T = { card: 9.2 };
const DOCK = T.card + 5.0;
const B0 = DOCK + 0.4, OD = B0 + 6.0, B1 = OD + 9.4, S0 = B1, CD = S0 + 13.4, B2 = CD + 12.0, TT = B2, END = TT + 10.0;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[B0 + 2.4, 0], [OD + 8.0, 1], [S0 + 10.0, 2], [CD + 10.4, 3], [TT + 8.6, 4]];
const DARK = [[OD, B1], [CD, B2]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [6.4, T.card, 'All of these are carbon. How can they look so different?', [HKX - 0.5, 0.45, 0.05]],
  [B0 + 3.4, OD - 0.3, 'Now look into a jar of oxygen', [OJX, 0.62, 0.05]],
  [S0 + 0.3, S0 + 2.4, 'Heat yellow sulphur crystals', [HPX, 0.42, 0.05]],
  [S0 + 11.4, CD - 0.3, 'Inside a diamond and a pencil', [DMX, 0.3, 0.05]],
  [END + 0.4, T.done, 'One element, many forms: allotropy ✓', [HKX, 0.6, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX + 0.03, 0.3, 0.05], 2.6 * k, 0.85 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const near = (t, p, w = 0.8, h = 0.65, e) => S(t, p, w, h, ADIR, e);
const P_C4 = [(PNX + STX) / 2, 0.1, 0.05], P_OJ = [OJX, 0.3, 0.0], P_HP = [HPX, 0.2, 0.05], P_DM = [DMX, 0.08, 0.0], P_TT = [TTX + 0.3, 0.38, 0.05];
const CAMS = [
  HK(0, 1.05), near(0.3, P_C4, 1.25, 0.5), near(6.2, P_C4, 1.2, 0.48), HK(6.4, 1.02), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(B0 + 0.4, P_C4, 1.25, 0.5), near(B0 + 3.2, P_C4, 1.2, 0.48),
  near(B0 + 4.8, P_OJ, 0.4, 0.4), DIVE(OD - 0.05, P_OJ),
  DK(OD, OX, 3.0, 2.2, 0.3), DK(OD + 1.8, OX, 3.0, 2.2, 1.04, 'out'), DK(B1 - 0.05, OX, 3.0, 2.2, 0.97),
  S(B1, [OJX, 0.46, 0.0], 0.12, 0.1, ADIR, 'out'), near(S0 + 1.4, P_HP, 0.6, 0.55), near(S0 + 11.2, P_HP, 0.58, 0.53), near(S0 + 12.4, P_DM, 0.25, 0.2), DIVE(CD - 0.05, P_DM),
  DK(CD, CX, 3.6, 2.4, 0.3), DK(CD + 1.8, CX, 3.6, 2.4, 1.04, 'out'), DK(B2 - 0.05, CX, 3.6, 2.4, 0.97),
  S(B2, P_DM, 0.1, 0.08, ADIR, 'out'), near(TT + 1.4, P_TT, 1.2, 0.85), near(END - 0.05, P_TT, 1.16, 0.82), HK(END + 0.4, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '512', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;
    const net = (pts, bondLen, r = 0.09, color = 0x3a3e4c) => {          // carbon atoms + sticks between neighbours (no letters: one element)
      const g = new THREE.Group(), am = M.gloss(color), sm = M.gloss(0xb8bec8);
      pts.forEach((p) => { const b = K.solid(new THREE.SphereGeometry(r, 20, 14), am); b.position.copy(p); g.add(b); });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const d = pts[i].distanceTo(pts[j]); if (Math.abs(d - bondLen) < 0.02) { const a = pts[i], b = pts[j], dir = b.clone().sub(a), m = K.solid(new THREE.CylinderGeometry(0.022, 0.022, d - 2 * r * 0.7, 10, 1, true), sm, { outline: false }); m.position.copy(a).lerp(b, 0.5); m.quaternion.setFromUnitVectors(V(0, 1, 0), dir.normalize()); g.add(m); } }
      return g;
    };

    // ================================================================ BENCH
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', HKX + 0.1, 2.9, 0.8);
      const pen = add(K.pencil(0.22), PNX, 0.008, 0.02); pen.rotation.set(-Math.PI / 2 + 0.02, 0.5, 0);
      add(U5.diamondGem(0.04), DMX, 0, 0);
      const chM = M.matte(0x1c1c1e, 0.95); [[0, 0, 1], [0.04, 0.02, 2], [-0.035, 0.03, 3]].forEach(([x, z, sd]) => add(K.lump(0.035, chM, sd, 0.6, 0.5), CHX + x, 0.018, z));
      add(K.solid(new THREE.CylinderGeometry(0.1, 0.095, 0.012, 40), M.gloss(0xf2f0ea)), STX, 0.006, 0); const smudge = add(new THREE.Mesh(new THREE.CircleGeometry(0.06, 32), new THREE.MeshStandardMaterial({ color: 0x15151a, roughness: 1, transparent: true, opacity: 0.85 })), STX, 0.0145, 0); smudge.rotation.x = -Math.PI / 2;
      const oj = add(K.gasJar(0xdfeaf2, 0.1, 0.36), OJX, 0, 0); oj.userData.gas.opacity = 0.06;
      const hp = add(K.hotPlate(), HPX, 0, 0), sd = add(U5.sulphurDish(), HPX, 0.105, -0.01), th = add(K.thermometer(0.3, 120), HPX + 0.1, 0.105, 0.04); th.rotation.z = -0.2; th.userData.set(25);
      const big = add(K.thermometer(0.66, 140), TTX, 0, 0); big.userData.set(20);
      const marks = [13.2, 95.5, 128.5].map((c) => { const m = add(K.glowSprite(0xffd27a, 0.09), TTX + 0.035, big.userData.y(c), 0.02); return { m, c }; });
      const ls = [['pencil (graphite)', '#ffffff', PNX, 0.13, 0.1], ['diamond', '#ffffff', DMX, 0.25, 0.1], ['charcoal', '#ffffff', CHX, 0.13, 0.1], ['soot', '#ffffff', STX, 0.25, 0.1]].map(([s, c, x, y, z]) => grp(tag(s, 0.045, c, x, y, z), 'c4'));
      const lA = [grp(tag('one element, more than one form:', 0.045, '#ffd27a', (PNX + STX) / 2, 0.3, 0.1), 'al'), grp(tag('allotropy ✓', 0.055, '#ffd27a', (PNX + STX) / 2, 0.23, 0.1), 'al')];
      const lO = tag('a jar of oxygen', 0.045, '#ffffff', OJX, 0.52, 0.08);
      const lR = tag('chunky rhombic crystals', 0.045, '#f2d23a', HPX, 0.36, 0.1), lM = [grp(tag('at 95.5 °C: long monoclinic needles ✓', 0.042, '#ffd27a', HPX, 0.4, 0.1), 'mn'), grp(tag('(the same S₈, a new arrangement)', 0.04, '#ffd27a', HPX, 0.34, 0.1), 'mn')];
      const TL = [['grey ↔ white tin', 13.2], ['rhombic ↔ monoclinic S', 95.5], ['two forms of KNO₃', 128.5]].map(([s, c]) => grp(tag(`${s}: ${c} °C`, 0.04, '#ffffff', TTX + 0.36, big.userData.y(c), 0.1), 'tt'));
      const lT = [grp(tag('transition temperature:', 0.045, '#ffd27a', TTX + 0.4, 0.5, 0.1), 'tr'), grp(tag('both forms meet ✓', 0.05, '#ffd27a', TTX + 0.4, 0.43, 0.1), 'tr')];
      beats.push((t) => {
        const on = ease(span(t, S0 + 2.4, S0 + 2.8)); hp.userData.on(on); th.userData.set(lerp(25, 95.5, ease(span(t, S0 + 2.8, S0 + 6.0)))); sd.userData.set(ease(span(t, S0 + 6.0, S0 + 7.6)));
        big.userData.set(lerp(20, 135, ease(span(t, TT + 1.0, TT + 5.0)))); marks.forEach(({ m, c }, i) => { m.visible = t > TT + 1.0 + (c - 20) / 115 * 4.0; m.material.opacity = 0.9; });
        ls.forEach((l, i) => K.popIn(l, t, 0.6 + i * 1.3, 6.2)); lA.forEach((l) => K.popIn(l, t, B0 + 0.2, B0 + 3.2)); K.popIn(lO, t, B0 + 3.4, OD - 0.3);
        K.popIn(lR, t, S0 + 2.6, S0 + 5.8); lM.forEach((l) => K.popIn(l, t, S0 + 7.8, S0 + 11.2));
        TL.forEach((l) => K.popIn(l, t, TT + 2.0, TT + 6.2)); lT.forEach((l) => K.popIn(l, t, TT + 6.4, END));
      });
    }

    // ================================================================ OXYGEN (dark) · O₂ and O₃
    {
      U.stage((t) => t >= OD - 0.05 && t < B1 - 0.05); keyLight(OX);
      const o2 = () => U.ballMol([['O', -0.28, 0], ['O', 0.28, 0]], [[0, 1, 2]]), o3 = () => U.ballMol([['O', -0.42, -0.14], ['O', 0, 0.12], ['O', 0.42, -0.14]], [[0, 1, 2], [1, 2, 1]]);
      const mols = [[-1.0, 0.5], [0.9, 0.6], [-0.3, -0.5], [1.1, -0.4]].map(([x, y]) => ({ m: add(o2(), OX + x, AY + y, 0), x, y })), oz = add(o3(), OX, AY + 0.05, 0.1);
      const glow = add(K.glowSprite(0x7fd0ff, 1.2), OX, AY + 0.05, 0);
      const l1 = tag('oxygen O₂: 2 atoms', 0.055, '#ffffff', OX - 0.6, AY - 1.0, 0.1), l2 = tag('ozone O₃: 3 atoms', 0.055, '#7fd0ff', OX + 0.4, AY - 1.0, 0.1), l3 = tag('different numbers of atoms ✓', 0.055, '#ffd27a', OX, AY - 1.0, 0.1);
      beats.push((t) => {
        mols.forEach(({ m, x, y }, i) => { m.position.set(OX + x + 0.12 * Math.sin(t * 0.5 + i), AY + y + 0.08 * Math.cos(t * 0.6 + i), 0); m.rotation.z = 0.4 * Math.sin(t * 0.4 + i); });
        oz.rotation.z = 0.2 * Math.sin(t * 0.5); const g = span(t, OD + 3.6, OD + 4.2); glow.visible = g > 0; glow.material.opacity = 0.5 * g;
        K.popIn(l1, t, OD + 0.6, OD + 3.4); K.popIn(l2, t, OD + 3.6, OD + 6.4); K.popIn(l3, t, OD + 6.6, B1);
      });
    }

    // ================================================================ CARBON (dark) · diamond net, graphite layers, both burn to CO₂
    {
      U.stage((t) => t >= CD - 0.05 && t < B2 - 0.05); keyLight(CX - 1); keyLight(CX + 1);
      const a = 1.1, F = [[0, 0, 0], [0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0]], DP = [];
      for (const ox of [0, 1]) for (const oy of [0, 1]) for (const oz of [0, 1]) F.forEach(([x, y, z]) => { [[0, 0, 0], [0.25, 0.25, 0.25]].forEach(([dx, dy, dz]) => { const p = [x + dx + ox, y + dy + oy, z + dz + oz]; if (p.every((c) => c <= 1.26)) DP.push(V(p[0] - 0.6, p[1] - 0.6, p[2] - 0.6).multiplyScalar(a)); }); });
      const dia = net(DP.filter((p) => p.length() < 0.95), Math.sqrt(3) / 4 * a, 0.08); add(dia, CX - 1.0, AY + 0.15, 0);
      const GP = [], bl = 0.32;
      // a honeycomb patch: hexagon centres on a grid, 6 corners each (shared corners merged)
      for (const L of [0, 1]) { const y = L * 0.55; for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) { const cx = i * bl * Math.sqrt(3) + (j % 2 ? bl * Math.sqrt(3) / 2 : 0) + (L ? bl * Math.sqrt(3) / 2 : 0), cz = j * bl * 1.5; for (let k = 0; k < 6; k++) { const an = Math.PI / 6 + k * Math.PI / 3, p = V(cx + Math.cos(an) * bl, y, cz + Math.sin(an) * bl); if (!GP.some((q) => q.distanceTo(p) < 0.03)) GP.push(p); } } }
      const gra = net(GP, bl, 0.06); gra.rotation.x = 0.5; add(gra, CX + 1.0, AY - 0.1, 0);
      const co2 = Array.from({ length: 6 }, (_, i) => ({ m: add(U.ballMol([['O', -0.6, 0], ['C', 0, 0], ['O', 0.6, 0]], [[0, 1, 2], [1, 2, 2]])), x0: i < 3 ? CX - 1.0 : CX + 1.0, k: i % 3 }));
      const l1 = [grp(tag('diamond: 4 bonds each,', 0.048, '#ffffff', CX - 1.0, AY - 1.0, 0.1), 'd'), grp(tag('tetrahedral, very hard', 0.048, '#ffffff', CX - 1.0, AY - 1.2, 0.1), 'd')];
      const l2 = [grp(tag('graphite: flat layers', 0.048, '#ffffff', CX + 1.0, AY - 1.0, 0.1), 'g'), grp(tag('of hexagons', 0.048, '#ffffff', CX + 1.0, AY - 1.2, 0.1), 'g')];
      const l3 = [grp(tag('different shapes, both burn to CO₂:', 0.048, '#ffd27a', CX, AY - 1.0, 0.1), 's'), grp(tag('the same chemistry ✓', 0.055, '#ffd27a', CX, AY - 1.22, 0.1), 's')];
      beats.push((t) => {
        dia.rotation.y = 0.4 + 0.3 * Math.sin((t - CD) * 0.4); gra.rotation.y = 0.3 * Math.sin((t - CD) * 0.35);
        co2.forEach(({ m, x0, k }) => { const u = span(t, CD + 7.2 + 0.4 * k, CD + 9.6 + 0.4 * k); m.visible = u > 0; m.position.set(x0 + (k - 1) * 0.55, AY + 0.3 + 0.18 * k + 1.0 * ease(u), 0.4 + 0.12 * k); m.scale.setScalar(Math.max(1e-4, 0.6 * back(span(u, 0, 0.3)))); });
        l1.forEach((l) => K.popIn(l, t, CD + 0.6, CD + 3.6)); l2.forEach((l) => K.popIn(l, t, CD + 3.8, CD + 6.8)); l3.forEach((l) => K.popIn(l, t, CD + 7.4, B2));
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'All of these are carbon. How?', dockTitle: 'Allotropy', intro: INTRO, ticks: TICKS,
      rows: [[0, 'a pencil, a diamond, charcoal, soot'], [1, 'one element, more forms: allotropy'], [1, 'different numbers of atoms: O₂, O₃'], [1, 'different arrangement: sulphur'], [1, 'different look, the same chemistry'], [1, 'transition temperature: forms swap']],
      short: ['allotropy', 'O₂ and O₃', 'sulphur', 'same chemistry', 'transition temp.'] }));
    return U.finish();
  },
};
