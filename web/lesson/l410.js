// Lesson 410 · Metallic Bond: Sea of Electrons (book pp. 108–109: 4.3.5 Metallic bond, the electron sea / electron gas
// theory, Fig. 4.17, Activity 4.3). v1 as a code lesson (2026-11-04), replacing the old Blender film. SKILL.md.
// THE QUESTION (book p.108: "In metals, we deal with different kind of bond called metallic bond"): "What holds the
//   atoms of a metal together?" → card, docked panel, four ticks: atoms, not molecules · + ions · a sea · metallic bond
//   · Activity 4.3.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a gold ring, a coil of copper wire, a sheet of aluminium foil (named one at a time) · "What holds
//         a metal together?" → card → dive INTO the gold ring.
//  INSIDE (dark) a block of gold atoms, each with its outer electron "pure gold: only gold atoms (not molecules)" ·
//         "not ionic, not covalent" · each atom lets its outer electron go (one row after another), a + appears on each
//         "they become + ions" · the electrons drift freely among the ions "delocalized: they belong to no one atom" ·
//         "a sea of electrons" · one ion in the middle glows, pulled from all sides "+ ions held by the sea: the
//         metallic bond ✓" (Fig. 4.17) · ✓ ✓ ✓ ✓.
//  ACT    back to the table: Activity 4.3: three bins (ionic · covalent · metallic) and ten things from home as cards:
//         salt, sugar, water, copper wire, spoon, baking soda, foil, plastic bottle, chalk, cooking oil · ✓.
//  END    the ring: "Metal ions in a sea of electrons ✓".
// Game (🎮 Bond Sorter, docs/COVERAGE_U4.md): Al, Ag, Cu, Pt examples, electron gas theory, more home substances.
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U4.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
const { M, span, ease, easeIn, back, lerp, hash } = K;
const { V, ADIR, DDIR, rest, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, RGX = HKX - 0.5, CUX = HKX, FOX = HKX + 0.5;              // hook: gold ring · copper wire · aluminium foil
const MTX = 40, ACX = 52;                                                // (dark) inside the gold · Activity 4.3 bins

// ---------------------------------------------------------------- time
const T = { card: 8.6 };
const DOCK = T.card + 5.0;
const GD = DOCK + 3.4, FREE = GD + 6.4, SEA = FREE + 6.0, BOND = SEA + 5.6, AC0 = BOND + 8.4, BACK = AC0 + 16.0;
T.done = BACK + 6.0;
const INTRO = [T.card, DOCK];
const TICKS = [[GD + 4.6, 0], [FREE + 5.2, 1], [SEA + 4.4, 2], [BOND + 5.4, 3], [AC0 + 14.6, 4]];
const DARK = [[GD, AC0]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [5.6, T.card, 'What holds a metal together?', [HKX, 0.36, 0.05]],
  [DOCK + 0.2, GD - 0.3, 'Look inside the gold', [RGX, 0.24, 0.05]],
  [GD + 4.6, FREE - 0.2, 'Not ionic, not covalent', [MTX, AY + 1.05, 0]],
  [AC0 + 0.2, AC0 + 2.6, 'Activity 4.3: things at home', [ACX, AY + 1.05, 0]],
  [BACK + 0.6, T.done, 'Metal ions in a sea of electrons ✓', [HKX, 0.36, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX, 0.08, 0.05], 1.3 * k, 0.4 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const RING = [RGX, 0.03, 0.02];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), S(DOCK + 1.8, RING, 0.3, 0.24), DIVE(GD - 0.05, RING),
  DK(GD, MTX, 3.4, 2.2, 0.3), DK(GD + 1.8, MTX, 3.4, 2.2, 1.04, 'out'), DK(BOND - 0.05, MTX, 3.4, 2.2, 0.98), DK(AC0 - 0.05, MTX, 3.2, 2.1, 0.98),
  DK(AC0, ACX, 5.4, 2.3, 1.03), DK(BACK - 0.05, ACX, 5.4, 2.3, 0.97),
  HK(BACK, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '410', { dark, AY }), { beats, ST, add, tag, grp, keyLight, goldE, blueE } = U;

    // ================================================================ HOOK / END · a gold ring, copper wire, aluminium foil
    {
      U.stage((t) => t < GD - 0.05 || t >= BACK - 0.05); ST.bake(U.root, 'hook', HKX, 1.7, 0.8);
      add(K.ring(0.07, 0.018), RGX, 0.018, 0);
      add(K.ribbonCoil(0.07, 7, M.metal(0xc8743a, 0.28)), CUX, 0, 0);
      const fg = new THREE.PlaneGeometry(0.26, 0.2, 24, 18), p = fg.attributes.position;
      for (let i = 0; i < p.count; i++) p.setZ(i, 0.006 * Math.sin(p.getX(i) * 70 + p.getY(i) * 40) + 0.004 * Math.cos(p.getY(i) * 90));
      fg.computeVertexNormals(); const foil = add(new THREE.Mesh(fg, new THREE.MeshStandardMaterial({ color: 0xd8dde4, metalness: 0.95, roughness: 0.28, side: THREE.DoubleSide })), FOX, 0.012, 0); foil.rotation.x = -Math.PI / 2; foil.castShadow = true;
      const l1 = tag('a gold ring', 0.05, '#ffd27a', RGX, 0.16, 0.12), l2 = tag('copper wire', 0.05, '#ffc9a0', CUX, 0.2, 0.12), l3 = tag('aluminium foil', 0.05, '#ffffff', FOX, 0.14, 0.15);
      beats.push((t) => { K.popIn(l1, t, 0.4, 2.2); K.popIn(l2, t, 2.3, 3.9); K.popIn(l3, t, 4.0, 5.5); });
    }

    // ================================================================ INSIDE (dark) · gold atoms → + ions in a sea of electrons
    {
      U.stage((t) => t >= GD - 0.05 && t < AC0 - 0.05); keyLight(MTX);
      const NX = 6, NY = 4, P = 0.46, ions = [], X0 = MTX - (NX - 1) * P / 2, Y0 = AY - (NY - 1) * P / 2;
      const ionM = new THREE.MeshPhysicalMaterial({ color: 0xe8c15a, metalness: 0.55, roughness: 0.25, clearcoat: 0.8 });
      for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
        const c = V(X0 + i * P, Y0 + j * P, 0), b = K.solid(new THREE.SphereGeometry(0.15, 28, 18), ionM); b.position.copy(c); U.root.add(b);
        const plus = K.label('+', 0.14, '#ffffff', 800); plus.position.copy(c).add(V(0, 0, 0.16)); plus.renderOrder = 22; plus.userData.mark = true; U.root.add(plus);
        const e = U.electron(); U.root.add(e); ions.push({ c, b, plus, e, k: i + j * NX, row: j, ph: hash(i, j) * 6.28 });
      }
      const lG = tag('pure gold: only gold atoms', 0.055, '#ffd27a', MTX, AY + 1.05, 0.1), lI = tag('each lets its outer electron go: + ions', 0.05, '#ffffff', MTX, AY - 1.05, 0.1);
      const lD = tag('they move freely: delocalized', 0.055, '#9fc8ff', MTX, AY + 1.05, 0.1), lS = tag('a sea of electrons ✓', 0.06, '#9fc8ff', MTX, AY - 1.05, 0.1);
      const lB = tag('held by the sea: the metallic bond ✓', 0.05, '#ffd27a', MTX, AY - 1.05, 0.1);
      const mid = ions.find((o) => o.k === 2 + NX), glow = add(K.glowSprite(0xffd27a, 0.7), mid.c.x, mid.c.y, 0.05);
      const pulls = Array.from({ length: 8 }, (_, i) => { const a = i / 8 * Math.PI * 2, m = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.08, 10), M.glow(0xffc04d, 1.6)); U.root.add(m); return { m, a }; });
      beats.push((t) => {
        ions.forEach((o) => {
          const tLeave = FREE + 0.6 * o.row + 0.08 * (o.k % NX), u = ease(span(t, tLeave, tLeave + 1.0));
          const orbit = V(Math.cos(t * 2.2 + o.ph) * 0.21, Math.sin(t * 2.2 + o.ph) * 0.21 * 0.8, Math.sin(t * 2.2 + o.ph) * 0.06);
          // free: a slow drift along the gaps between the rows, just in front of the ions (never through a ball)
          const gx = (((o.k * 0.61 + (t - tLeave) * 0.16 * (o.k % 2 ? 1 : -1)) % (NX - 1)) + (NX - 1)) % (NX - 1), gy = Math.min(NY - 2, o.row) + 0.5 + 0.12 * Math.sin(t * 0.8 + o.ph);
          const free = V(X0 + (gx + 0.5) * P, Y0 + gy * P, 0.22);
          o.e.position.copy(o.c.clone().add(orbit).lerp(free, u));
          o.plus.userData.s0 ??= o.plus.scale.clone(); o.plus.visible = u > 0.6; o.plus.scale.copy(o.plus.userData.s0).multiplyScalar(Math.max(1e-4, back(span(u, 0.6, 1))));
        });
        const g = span(t, BOND + 0.4, BOND + 1.0); glow.visible = g > 0.01; glow.material.opacity = 0.7 * g * (0.85 + 0.15 * Math.sin(t * 6));
        pulls.forEach(({ m, a }) => { const r = 0.32 - 0.04 * Math.sin(t * 4); m.visible = t > BOND + 1.0; m.position.set(mid.c.x + Math.cos(a) * r, mid.c.y + Math.sin(a) * r, 0.18); m.rotation.z = a + Math.PI / 2; });
        K.popIn(lG, t, GD + 0.6, GD + 4.4); K.popIn(lI, t, FREE + 1.6, SEA + 0.8); K.popIn(lD, t, SEA + 0.9, SEA + 3.0); K.popIn(lS, t, SEA + 2.9, BOND - 0.1); K.popIn(lB, t, BOND + 1.6, AC0);
      });
    }

    // ================================================================ ACT (dark) · Activity 4.3: ten things from home in three bins
    {
      U.stage((t) => t >= AC0 - 0.05 && t < BACK - 0.05); keyLight(ACX);
      const BIN = [ACX - 1.75, ACX, ACX + 1.75], BW = 1.6, BY = AY - 0.75;
      BIN.forEach((x) => { const g = add(new THREE.Group(), x, BY, 0), m = M.matte(0x262b35, 0.7); [[BW - 0.03, 0.04, 0.47, 0, 0, 0], [0.04, 0.4, 0.5, -BW / 2, 0.2, 0], [0.04, 0.4, 0.5, BW / 2, 0.2, 0], [BW - 0.07, 0.37, 0.04, 0, 0.19, -0.225]].forEach(([w, h, d, x0, y0, z0]) => { const b = K.solid(new THREE.BoxGeometry(w, h, d), m); b.position.set(x0, y0, z0); g.add(b); }); });
      const names = ['ionic', 'covalent', 'metallic'].map((s, i) => grp(tag(s, 0.05, ['#ffd27a', '#9fc8ff', '#e0e4ea'][i], BIN[i], BY - 0.22, 0.3), 'act'));
      const CARDS = [['salt', 0], ['sugar', 1], ['water', 1], ['copper wire', 2], ['spoon', 2], ['baking soda', 0], ['foil', 2], ['plastic bottle', 1], ['chalk', 0], ['cooking oil', 1]], cnt = [0, 0, 0];
      const tiles = CARDS.map(([s, b], i) => { const k = cnt[b]++, tl = add(K.tile(s, [0xb07a2a, 0x3d6fb4, 0x6a7280][b], 0.74, 0.27, 0.05)); tl.traverse((o) => { if (o.userData.text !== undefined) o.userData.group = 'act'; }); return { tl, slot: V(BIN[b] + ((k % 2) - 0.5) * 0.78, BY + 0.18 + Math.floor(k / 2) * 0.3, 0.05), t0: AC0 + 2.8 + i * 1.15 }; });
      beats.push((t) => {
        names.forEach((l) => K.popIn(l, t, AC0 + 0.6, BACK));
        tiles.forEach(({ tl, slot, t0 }) => { const u = span(t, t0, t0 + 0.6), top = V(ACX, AY + 1.0, 0.1); tl.visible = t > t0 - 0.4; tl.position.copy(t < t0 ? top : K.arc(top, slot, 0.2, easeIn(u))); tl.scale.setScalar(Math.max(1e-4, back(span(t, t0 - 0.4, t0)))); });
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'What holds the atoms of a metal together?', dockTitle: 'Metals', intro: INTRO, ticks: TICKS,
      rows: [[0, 'a gold ring, copper wire, aluminium foil'], [1, 'metals are atoms, not molecules'], [1, 'atoms let outer electrons go: + ions'], [1, 'the electrons move freely: a sea'], [1, '+ ions held by the sea: metallic bond'], [1, 'Activity 4.3: ionic, covalent or metallic']],
      short: ['atoms', '+ ions', 'a sea', 'metallic bond', 'Activity 4.3'] }));
    return U.finish();
  },
};
