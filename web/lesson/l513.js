// Lesson 513 · Carbon: Diamond, Graphite, Buckyball (book pp. 146–147: Fig. 5.17 allotropes of carbon; crystalline
// forms (diamond, graphite, buckyballs) and amorphous forms (coke, charcoal, lampblack); (i) diamond: cubic, each atom
// tetrahedrally bonded to four, very hard, high melting point, bad conductor; (ii) graphite: three bonds, hexagonal
// layers held by weak forces that slide, soft, a lubricant, a good conductor (free electrons); (iii) buckyball: 1985,
// 20–100 carbon atoms, a hollow cage shaped like a football, pentagons and hexagons; uses). v1 as a code lesson
// (2026-11-04), replacing the old Blender film. SKILL.md §0 + §1 + §4.
// THE QUESTION: "Diamond and pencil lead are both carbon. Why are they so different?" → card, docked panel, six ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a diamond, a pencil on paper, a bulb tester, a football, charcoal (named one at a time).
//  PENCIL the pencil draws a line "it leaves grey layers on the paper" · dive INTO the lead (dark): flat layers of
//         hexagons, the top layer slides "weak forces between layers: they slide: soft, a lubricant ✓" · blue electrons
//         glide along the layers "one electron each is free".
//  TEST   the lead is laid across the tester's clips: the bulb lights "graphite: it conducts ✓"; then the diamond: it
//         stays off "diamond: no current" · "Why? Look inside the diamond" → dive.
//  DIAMOND (dark) the 3D net; one atom and its four neighbours glow "each atom held by 4 strong bonds: very hard, a high
//         melting point ✓" · "all 4 outer electrons used: none free, no current ✓".
//  BUCKY  the football "a third crystal form, shaped like this" → (dark) C60 turning "buckyball (1985): a hollow cage of
//         carbon" · "pentagons and hexagons, like a football ✓ (20–100 atoms)" · "used in semiconductors, superconductors
//         and lubricants".
//  END    the charcoal "coke, charcoal, lampblack: amorphous carbon ✓" · "Same atoms, different arrangements ✓".
// Game (🎮 State Sorter, docs/COVERAGE_U5.md): Long Q iii (allotropy, the three forms of carbon), the properties.
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U5.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
import * as U5 from './u5kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, DMX = HKX - 0.98, NBX = HKX - 0.5, TSX = HKX + 0.1, FBX = HKX + 0.62, CHX = HKX + 1.0;
const GX = 40, DX = 52, BX = 64;

// ---------------------------------------------------------------- time
const T = { card: 10.6 };
const DOCK = T.card + 5.0;
const P0 = DOCK + 0.4, GD = P0 + 8.0, B1 = GD + 11.4, DD = B1 + 13.4, B2 = DD + 9.4, BD = B2 + 3.4, B3 = BD + 10.8, END = B3 + 5.0;
T.done = END + 4.6;
const INTRO = [T.card, DOCK];
const TICKS = [[GD + 6.0, 0], [B1 + 5.6, 1], [DD + 3.8, 2], [DD + 8.0, 3], [BD + 6.0, 4], [B3 + 3.4, 5]];
const DARK = [[GD, B1], [DD, B2], [BD, B3]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [7.6, T.card, 'Diamond and pencil lead are both carbon. Why so different?', [HKX, 0.5, 0.05]],
  [P0 + 5.4, GD - 0.3, 'Look inside the pencil lead', [NBX, 0.2, 0.05]],
  [B1 + 0.3, B1 + 2.4, 'Test both in the bulb tester', [TSX, 0.36, 0.05]],
  [B1 + 11.2, DD - 0.3, 'Why? Look inside the diamond', [TSX, 0.36, 0.05]],
  [B2 + 0.3, BD - 0.3, 'A third crystal form, shaped like this', [FBX, 0.36, 0.05]],
  [END + 0.4, T.done, 'Same atoms, different arrangements ✓', [HKX, 0.5, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX + 0.01, 0.15, 0.05], 2.4 * k, 0.65 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const near = (t, p, w = 0.8, h = 0.65, e, dir = ADIR) => S(t, p, w, h, dir, e);
const P_NB = [NBX, 0.02, 0.03], P_TS = [TSX, 0.1, 0.05], P_FB = [FBX, 0.09, 0.05], P_CH = [CHX, 0.05, 0.05], P_GAP = [TSX, 0.05, 0.05];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(P0 + 0.4, P_NB, 0.62, 0.45, undefined, [0, 1.1, 1]), near(P0 + 6.6, [NBX + 0.05, 0.01, 0.06], 0.25, 0.2, undefined, [0, 1.1, 1]), DIVE(GD - 0.05, [NBX + 0.05, 0.01, 0.06]),
  DK(GD, GX, 3.2, 2.2, 0.3), DK(GD + 1.8, GX, 3.2, 2.2, 1.04, 'out'), DK(B1 - 0.05, GX, 3.2, 2.2, 0.97),
  S(B1, P_NB, 0.12, 0.1, ADIR, 'out'), near(B1 + 1.4, P_TS, 0.62, 0.45), near(B1 + 11.0, P_TS, 0.6, 0.44), near(B1 + 12.4, P_GAP, 0.18, 0.15), DIVE(DD - 0.05, P_GAP),
  DK(DD, DX, 2.6, 2.4, 0.3), DK(DD + 1.8, DX, 2.6, 2.4, 1.04, 'out'), DK(B2 - 0.05, DX, 2.6, 2.4, 0.97),
  S(B2, P_GAP, 0.12, 0.1, ADIR, 'out'), near(B2 + 1.4, P_FB, 0.45, 0.4), DIVE(BD - 0.05, P_FB),
  DK(BD, BX, 2.6, 2.6, 0.3), DK(BD + 1.8, BX, 2.6, 2.6, 1.04, 'out'), DK(B3 - 0.05, BX, 2.6, 2.6, 0.97),
  S(B3, P_FB, 0.12, 0.1, ADIR, 'out'), near(B3 + 1.2, P_CH, 0.5, 0.4), near(END - 0.05, P_CH, 0.48, 0.38), HK(END + 0.4, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

const LINE = [{ k: 'line', x: 0.25, y: 0.55, x1: 0.8, y1: 0.45, t0: P0 + 0.8, d: 1.8, w: 9 }];

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '513', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;

    // ================================================================ BENCH
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', HKX + 0.01, 2.6, 0.75);
      const dm = add(U5.diamondGem(0.04), DMX, 0, 0), gem = dm.userData.gem;
      const nb = add(K.notebook(0.4, 0.3), NBX, 0, 0.02), pen = add(K.pencil(0.22)), write = U5.penWriter(nb, pen, LINE, V(NBX + 0.27, 0.01, 0.13), nb.position);
      const ts = add(U5.tester(), TSX, 0, 0), gap = ts.userData.gap.clone().add(V(TSX, 0, 0));
      const lead = add(K.solid(new THREE.CylinderGeometry(0.008, 0.008, 0.16, 12), M.matte(0x3a3d44, 0.4)), 0, 0, 0); lead.rotation.z = Math.PI / 2;
      add(U5.football(0.08), FBX, 0, 0);
      const chM = M.matte(0x1c1c1e, 0.95); [[0, 0, 1], [0.04, 0.02, 2], [-0.035, 0.03, 3]].forEach(([x, z, sd]) => add(K.lump(0.035, chM, sd, 0.6, 0.5), CHX + x, 0.018, z));
      const ls = [['a diamond', '#ffffff', DMX, 0.2, 0.1], ['a pencil on paper', '#ffffff', NBX, 0.12, 0.2], ['a bulb tester', '#ffffff', TSX, 0.26, 0.1], ['a football', '#ffffff', FBX, 0.24, 0.1], ['charcoal', '#ffffff', CHX, 0.13, 0.1]].map(([s, c, x, y, z]) => tag(s, 0.045, c, x, y, z));
      const lP = tag('it leaves grey layers on the paper', 0.045, '#ffffff', NBX, 0.12, 0.1);
      const lG = tag('graphite: the bulb lights, it conducts ✓', 0.042, '#ffd27a', TSX, 0.28, 0.1), lD = tag('diamond: it stays off, no current', 0.042, '#ffffff', TSX, 0.28, 0.1);
      const lA = [grp(tag('coke, charcoal, lampblack:', 0.045, '#ffffff', CHX, 0.2, 0.1), 'am'), grp(tag('amorphous carbon ✓', 0.05, '#ffd27a', CHX, 0.13, 0.1), 'am')];
      const LR = V(NBX + 0.15, 0.006, 0.1), GEM0 = gem.position.clone();
      beats.push((t) => {
        write(t);
        // the lead: lying by the notebook → laid across the clips → lifted away; then the diamond is carried over
        const a1 = ease(span(t, B1 + 2.4, B1 + 3.4)), a2 = ease(span(t, B1 + 6.6, B1 + 7.2));
        lead.position.copy(K.arc(LR, gap.clone().add(V(0, 0.008, 0)), 0.12, a1).add(V(0, 0.3 * a2, -0.2 * a2))); lead.visible = a2 < 1;
        const g1 = ease(span(t, B1 + 7.4, B1 + 8.2)), back_ = ease(span(t, B2 - 0.4, B2)), dmw = V(DMX, GEM0.y, 0);
        if (t < B2 - 0.4) gem.position.copy(K.arc(GEM0, gap.clone().sub(V(DMX, 0, 0)).add(V(0, 0.04, 0)), 0.15, g1)); else gem.position.copy(GEM0);
        ts.userData.set(t > B1 + 3.5 && t < B1 + 6.7 ? ease(span(t, B1 + 3.5, B1 + 3.9)) : 0);
        ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 1.4, 1.7 + i * 1.4)); K.popIn(lP, t, P0 + 2.8, P0 + 5.2);
        K.popIn(lG, t, B1 + 4.0, B1 + 6.5); K.popIn(lD, t, B1 + 8.6, B1 + 11.0); lA.forEach((l) => K.popIn(l, t, B3 + 1.4, END));
      });
    }

    // ================================================================ GRAPHITE (dark) · layers that slide, electrons that move
    {
      U.stage((t) => t >= GD - 0.05 && t < B1 - 0.05); keyLight(GX);
      const bl = 0.25, layer = (y, sh) => { const P = []; for (let i = -2; i <= 2; i++) for (let j = -1; j <= 1; j++) { const cx = i * bl * Math.sqrt(3) + (j % 2 ? bl * Math.sqrt(3) / 2 : 0) + sh, cz = j * bl * 1.5; for (let k = 0; k < 6; k++) { const an = Math.PI / 6 + k * Math.PI / 3, p = V(cx + Math.cos(an) * bl, y, cz + Math.sin(an) * bl); if (!P.some((q) => q.distanceTo(p) < 0.03)) P.push(p); } } return U5.carbonNet(P, bl, 0.06); };
      const L = [0, 1, 2].map((k) => add(layer(0, k % 2 ? bl * Math.sqrt(3) / 2 : 0), GX, AY - 0.5 + k * 0.5, 0));
      L.forEach((l) => { l.rotation.x = 0.45; });
      const es = Array.from({ length: 8 }, (_, i) => add(U.electron()));
      const l1 = tag('flat layers of hexagons, 3 bonds each', 0.048, '#ffffff', GX, AY - 1.05, 0.1);
      const l2 = [grp(tag('weak forces between layers: they slide', 0.046, '#ffd27a', GX, AY - 0.95, 0.1), 'sl'), grp(tag('soft, a lubricant ✓', 0.05, '#ffd27a', GX, AY - 1.15, 0.1), 'sl')];
      const l3 = tag('one electron each is free to move', 0.05, '#9fc8ff', GX, AY - 1.05, 0.1);
      beats.push((t) => {
        L[2].position.x = GX + 0.5 * ease(span(t, GD + 3.2, GD + 5.0)) - 0.25 * ease(span(t, GD + 5.2, GD + 6.6));
        es.forEach((e, i) => { const k = i % 3, x = ((t * 0.6 + i * 0.37) % 2.4) - 1.2; e.visible = t > GD + 7.2; e.position.set(GX + x, AY - 0.5 + k * 0.5 + 0.08, 0.05 + 0.1 * Math.sin(i)); });
        K.popIn(l1, t, GD + 0.6, GD + 3.0); l2.forEach((l) => K.popIn(l, t, GD + 3.2, GD + 7.0)); K.popIn(l3, t, GD + 7.6, B1);
      });
    }

    // ================================================================ DIAMOND (dark) · four strong bonds each, no free electrons
    {
      U.stage((t) => t >= DD - 0.05 && t < B2 - 0.05); keyLight(DX);
      const a = 1.15, F = [[0, 0, 0], [0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0]], DP = [];
      for (const ox of [0, 1]) for (const oy of [0, 1]) for (const oz of [0, 1]) F.forEach(([x, y, z]) => [[0, 0, 0], [0.25, 0.25, 0.25]].forEach(([dx, dy, dz]) => { const p = [x + dx + ox, y + dy + oy, z + dz + oz]; if (p.every((c) => c <= 1.26)) DP.push(V(p[0] - 0.62, p[1] - 0.62, p[2] - 0.62).multiplyScalar(a)); }));
      const pts = DP.filter((p) => p.length() < 1.0), dia = U5.carbonNet(pts, Math.sqrt(3) / 4 * a, 0.075); add(dia, DX, AY, 0);
      const c0 = pts.reduce((b, p) => (p.length() < b.length() ? p : b)), nbrs = pts.filter((p) => Math.abs(p.distanceTo(c0) - Math.sqrt(3) / 4 * a) < 0.03);
      const glows = [c0, ...nbrs].map((p, i) => { const s = K.glowSprite(i ? 0xffd27a : 0xffffff, i ? 0.32 : 0.45); dia.add(s); s.position.copy(p); return s; });
      const l1 = [grp(tag('each atom held by 4 strong bonds:', 0.046, '#ffd27a', DX, AY - 0.95, 0.1), 'd1'), grp(tag('very hard, a high melting point ✓', 0.046, '#ffd27a', DX, AY - 1.13, 0.1), 'd1')];
      const l2 = [grp(tag('all 4 outer electrons are used:', 0.046, '#ffffff', DX, AY - 0.95, 0.1), 'd2'), grp(tag('none free, no current ✓', 0.05, '#ffffff', DX, AY - 1.13, 0.1), 'd2')];
      beats.push((t) => { dia.rotation.y = 0.5 + 0.3 * Math.sin((t - DD) * 0.4); dia.rotation.x = 0.2; glows.forEach((g) => { g.visible = t > DD + 0.8; g.material.opacity = 0.8 * span(t, DD + 0.8, DD + 1.3); }); l1.forEach((l) => K.popIn(l, t, DD + 0.8, DD + 4.8)); l2.forEach((l) => K.popIn(l, t, DD + 5.0, B2)); });
    }

    // ================================================================ BUCKYBALL (dark) · C60, a hollow cage like a football
    {
      U.stage((t) => t >= BD - 0.05 && t < B3 - 0.05); keyLight(BX);
      const bb = U5.carbonNet(U5.c60Points(0.115), 0.23, 0.065); add(bb, BX, AY + 0.05, 0);
      const l1 = tag('buckyball (1985): a hollow cage of carbon', 0.046, '#ffffff', BX, AY - 1.15, 0.1);
      const l2 = [grp(tag('pentagons and hexagons, like a football ✓', 0.044, '#ffd27a', BX, AY - 1.05, 0.1), 'b2'), grp(tag('(20–100 carbon atoms)', 0.042, '#ffd27a', BX, AY - 1.25, 0.1), 'b2')];
      const l3 = [grp(tag('used in semiconductors,', 0.046, '#9fc8ff', BX, AY - 1.05, 0.1), 'b3'), grp(tag('superconductors and lubricants', 0.046, '#9fc8ff', BX, AY - 1.25, 0.1), 'b3')];
      beats.push((t) => { bb.rotation.y = (t - BD) * 0.35; bb.rotation.x = 0.3; K.popIn(l1, t, BD + 0.6, BD + 3.6); l2.forEach((l) => K.popIn(l, t, BD + 3.8, BD + 7.0)); l3.forEach((l) => K.popIn(l, t, BD + 7.2, B3)); });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Diamond and pencil lead are both carbon. Why so different?', dockTitle: 'Carbon', intro: INTRO, ticks: TICKS,
      rows: [[0, 'a diamond, a pencil, a tester, a football'], [1, 'graphite: layers slide: soft'], [1, 'graphite: free electrons: conducts'], [1, 'diamond: 4 bonds: very hard'], [1, 'diamond: no free electrons'], [1, 'buckyball (1985): a hollow cage'], [1, 'amorphous: coke, charcoal, lampblack']],
      short: ['graphite soft', 'graphite conducts', 'diamond hard', 'diamond: no current', 'buckyball', 'amorphous'] }));
    return U.finish();
  },
};
