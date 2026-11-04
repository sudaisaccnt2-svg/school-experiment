// Lesson 411 · Shapes of Molecules (book pp. 109–110: Shapes of Molecules, Fig. 4.18 CO₂, SO₂, BCl₃, H₂O, CH₄, NH₃).
// v1 as a code lesson (2026-11-04), replacing the old Blender film. Built from SKILL.md §0 + §1 + §4 (tools: u4kit.js).
// Book note (NOTES.md): the text names BF₃ as trigonal planar, Fig. 4.18 shows BCl₃ (both are); NH₃ is 106.7° in Fig. 4.18
//   and 107° in Fig. 4.16: values shown as printed in the figure.
// THE QUESTION (book p.109: "Scientists are able to determine the size and shape of molecule"): "What shapes do
//   molecules have?" → card, docked panel, five ticks: linear · bent · trigonal planar · tetrahedral · trigonal pyramidal.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a drop of water on a watch glass, a magnifying glass · the magnifier is lowered over the drop:
//         only a bigger drop "still no molecules: far too small to see" · "Scientists find their shapes by experiments"
//         → card → dive INTO the drop.
//  SHAPES (dark) each molecule of Fig. 4.18 is built in real 3D (the centre atom first, the others fly in along their
//         bonds), it turns slowly so its shape shows, the bond angle glows as a gold arc with its number, its shape name:
//         CO₂ "linear, 180°" · SO₂ "bent, 119.5°" · BCl₃ "trigonal planar, 120°" · H₂O "bent (angular), 104.5°" · CH₄
//         "tetrahedral, 109.5°" (a 3D pyramid of four, not flat) · NH₃ "trigonal pyramidal, 106.7°" (its lone pair on
//         top) · the six side by side as in Fig. 4.18 · ✓ each.
//  END    the drop: "Each molecule has its own shape ✓".
// Game (🎮 Shape Lab, docs/COVERAGE_U4.md): name the shape, the angle, polar or not (Fig. 4.18, Short Q vii).
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U4.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, rest, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, DRX = HKX - 0.1, MGX = HKX + 0.36;                        // hook: a drop on a watch glass · magnifier
const SHX = 40, GRX = 52;                                                // (dark) one molecule at a time · the six together

// ---------------------------------------------------------------- the six molecules of Fig. 4.18
const D2R = Math.PI / 180, L = 0.5;
const bent = (deg, l = L) => [V(-Math.sin(deg / 2 * D2R) * l, -Math.cos(deg / 2 * D2R) * l, 0), V(Math.sin(deg / 2 * D2R) * l, -Math.cos(deg / 2 * D2R) * l, 0)];
const tetra = [V(1, 1, 1), V(1, -1, -1), V(-1, 1, -1), V(-1, -1, 1)].map((v) => v.normalize().multiplyScalar(L));
const pyrA = Math.acos(Math.sqrt((Math.cos(106.7 * D2R) + 0.5) / 1.5)), pyr = [0, 1, 2].map((k) => V(Math.sin(pyrA) * Math.cos(k * 2.094 + 0.52) * L, -Math.cos(pyrA) * L, Math.sin(pyrA) * Math.sin(k * 2.094 + 0.52) * L));
const MOLS = [
  { f: 'CO₂', c: 'C', o: 'O', dirs: [V(-L, 0, 0), V(L, 0, 0)], order: 2, ang: [0, 1], deg: '180°', name: 'linear', lone: [] },
  { f: 'SO₂', c: 'S', o: 'O', dirs: bent(119.5), order: 2, ang: [0, 1], deg: '119.5°', name: 'bent', lone: [V(0, 0.32, 0)] },
  { f: 'BCl₃', c: 'B', o: 'Cl', dirs: [0, 1, 2].map((k) => V(Math.cos(Math.PI / 2 + k * 2.094) * L, Math.sin(Math.PI / 2 + k * 2.094) * L, 0)), order: 1, ang: [1, 2], deg: '120°', name: 'trigonal planar', lone: [] },
  { f: 'H₂O', c: 'O', o: 'H', dirs: bent(104.5, 0.42), order: 1, ang: [0, 1], deg: '104.5°', name: 'bent (angular)', lone: [V(-0.09, 0.27, 0.1), V(0.09, 0.27, -0.1)] },
  { f: 'CH₄', c: 'C', o: 'H', dirs: tetra, order: 1, ang: [0, 1], deg: '109.5°', name: 'tetrahedral', lone: [] },
  { f: 'NH₃', c: 'N', o: 'H', dirs: pyr, order: 1, ang: [0, 1], deg: '106.7°', name: 'trigonal pyramidal', lone: [V(0, 0.3, 0)] },
];

// ---------------------------------------------------------------- time
const T = { lens: 2.6, card: 11.0 };
const DOCK = T.card + 5.0;
const SD = DOCK + 3.4, STEP = [9.6, 7.8, 7.8, 7.8, 8.4, 8.4], M0 = STEP.reduce((a, s, i) => (a.push(a[i] + s), a), [SD + 0.4]);
const GR0 = M0[6], BACK = GR0 + 9.0;
T.done = BACK + 6.0;
const INTRO = [T.card, DOCK];
const TICKS = [[M0[0] + 7.4, 0], [M0[1] + 5.6, 1], [M0[2] + 5.6, 2], [M0[4] + 6.2, 3], [M0[5] + 6.2, 4]];
const DARK = [[SD, BACK]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [7.8, T.card, 'Scientists find their shapes by experiments', [HKX, 0.36, 0.05]],
  [DOCK + 0.2, SD - 0.3, 'Look inside the drop', [DRX, 0.26, 0.05]],
  [GR0 + 0.2, GR0 + 2.6, 'All six, as in the book', [GRX, AY + 1.95, 0]],
  [BACK + 0.6, T.done, 'Each molecule has its own shape ✓', [HKX, 0.36, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX + 0.08, 0.1, 0.05], 0.9 * k, 0.42 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const DROP = [DRX, 0.035, 0.02];
const CAMS = [
  HK(0, 1.05), S(T.lens + 1.4, [DRX + 0.05, 0.08, 0.05], 0.5, 0.3), S(7.6, [DRX + 0.05, 0.08, 0.05], 0.48, 0.28), HK(T.card - 0.05, 1.0), HK(DOCK, 1.02),
  S(DOCK + 1.8, DROP, 0.22, 0.14), DIVE(SD - 0.05, DROP),
  DK(SD, SHX, 2.2, 1.9, 0.3, undefined, AY + 0.05), DK(SD + 1.8, SHX, 2.2, 1.9, 1.04, 'out', AY + 0.05), DK(GR0 - 0.05, SHX, 2.2, 1.9, 0.98, undefined, AY + 0.05),
  DK(GR0, GRX, 5.0, 4.2, 1.03, undefined, AY - 0.12), DK(BACK - 0.05, GRX, 5.0, 4.2, 0.97, undefined, AY - 0.12),
  HK(BACK, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '411', { dark, AY }), { beats, ST, add, tag, grp, keyLight, goldE } = U;
    const RAD = { H: 0.11, C: 0.19, N: 0.19, O: 0.18, S: 0.23, B: 0.19, Cl: 0.24 };
    const stickM = M.gloss(0xd8dde4);
    /** a molecule that can be assembled: the centre atom, outer atoms (fly in along their bond), sticks, lone pairs, the angle arc */
    const build = (m) => {
      const g = new THREE.Group(), ball = (el) => { const b = new THREE.Group(), r = RAD[el]; b.add(K.solid(new THREE.SphereGeometry(r, 32, 20), M.gloss(K.ATOM[el][0]))); const l = K.label(el, r * 1.05, el === 'H' ? '#1b2030' : '#ffffff', 800); l.position.z = r + 0.004; l.renderOrder = 22; l.userData.mark = true; b.add(l); return b; };
      const c = ball(m.c); g.add(c);
      const outs = m.dirs.map((d) => { const b = ball(m.o); b.userData.d = d; b.position.copy(d); g.add(b); return b; });
      const sticks = m.dirs.flatMap((d) => Array.from({ length: m.order }, (_, k) => {
        const len = d.length() - RAD[m.c] * 0.6 - RAD[m.o] * 0.6, side = V(-d.y, d.x, 0).normalize().multiplyScalar(((k - (m.order - 1) / 2)) * 0.06);
        const s = K.solid(new THREE.CylinderGeometry(m.order > 1 ? 0.022 : 0.03, m.order > 1 ? 0.022 : 0.03, len, 14, 1, true), stickM, { outline: false });
        s.position.copy(d.clone().multiplyScalar(0.5 + (RAD[m.c] - RAD[m.o]) * 0.3 / d.length())).add(side); s.quaternion.setFromUnitVectors(V(0, 1, 0), d.clone().normalize()); s.userData.d = d; g.add(s); return s;
      }));
      const lone = m.lone.flatMap((p) => [-1, 1].map((sd) => { const e = U.electron(true); e.scale.setScalar(0.8); e.position.copy(p).add(V(sd * 0.05, 0, 0)); g.add(e); return e; }));
      const [a, b] = m.ang.map((i) => m.dirs[i].clone().normalize()), pts = []; for (let i = 0; i <= 20; i++) pts.push(a.clone().lerp(b, i / 20).normalize().multiplyScalar(0.28));
      const arc = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.01, 8), M.glow(0xffc04d, 1.6)); g.add(arc);
      return { g, c, outs, sticks, lone, arc };
    };

    // ================================================================ HOOK / END · a drop of water and a magnifying glass
    {
      U.stage((t) => t < SD - 0.05 || t >= BACK - 0.05); ST.bake(U.root, 'hook', HKX + 0.08, 1.2, 0.7);
      add(K.watchGlass(0.13), DRX, 0, 0);
      const drop = add(K.solid(new THREE.SphereGeometry(0.03, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), M.liquid(0x7cc8ff, 0.75), { outline: false }), DRX, 0.008, 0); drop.scale.y = 0.55;
      const mg = add(K.magnifier(0.07));
      const lD = tag('a drop of water', 0.05, '#9fd2ff', DRX, 0.12, 0.12), lM = tag('a magnifying glass', 0.05, '#ffffff', MGX, 0.12, 0.12);
      const lNo = tag('bigger, but still no molecules', 0.05, '#ffffff', DRX + 0.05, 0.19, 0.05), lTiny = tag('far too small to see', 0.05, '#ffd27a', DRX + 0.05, 0.19, 0.05);
      const REST = V(MGX, 0.012, 0.06), OVER = V(DRX, 0.13, 0.0);
      beats.push((t) => {
        const u = ease(span(t, T.lens, T.lens + 1.4)) * (1 - ease(span(t, 9.6, 10.6)));
        mg.position.copy(REST).lerp(OVER, u); mg.rotation.set(0, 0, 0); mg.rotation.y = 0.3 * (1 - u);
        if (t > BACK) { mg.position.copy(REST); }
        K.popIn(lD, t, 0.4, 1.4); K.popIn(lM, t, 1.5, T.lens + 0.4); K.popIn(lNo, t, T.lens + 1.6, T.lens + 3.8); K.popIn(lTiny, t, T.lens + 3.9, 7.7);
      });
    }

    // ================================================================ SHAPES (dark) · each molecule of Fig. 4.18 built and turned, then all six
    {
      U.stage((t) => t >= SD - 0.05 && t < BACK - 0.05); keyLight(SHX, AY + 0.05); keyLight(GRX, AY + 0.1);
      const solo = MOLS.map((m) => { const b = build(m); add(b.g, SHX, AY + 0.05, 0); return b; });
      const GRID = MOLS.map((m, i) => V(GRX + ((i % 2) - 0.5) * 2.5, AY + 1.4 - Math.floor(i / 2) * 1.4, 0));
      const all = MOLS.map((m, i) => { const b = build(m); b.g.scale.setScalar(1.0); add(b.g, GRID[i].x, GRID[i].y, 0); return b; });
      const names = MOLS.map((m) => tag(`${m.f}: ${m.name}`, 0.06, '#ffffff', SHX, AY - 0.82, 0.1)), degs = MOLS.map((m) => tag(m.deg, 0.07, '#ffd27a', SHX + 0.62, AY + 0.45, 0.1));
      const gNames = MOLS.map((m, i) => grp(tag(m.name.replace(' (angular)', ''), 0.036, '#ffffff', GRID[i].x, GRID[i].y - 0.56, 0.1), 'grid'));
      beats.push((t) => {
        solo.forEach((b, i) => {
          const t0 = M0[i], t1 = M0[i + 1] ?? GR0; b.g.visible = t >= t0 - 0.05 && t < t1 - 0.05;
          K.popIn(names[i], t, t0 + 2.2, t1 - 2.7); K.popIn(degs[i], t, t1 - 2.4, t1 - 0.1);   // every label is set every frame (hidden outside its time)
          if (!b.g.visible) return;
          const cg = back(span(t, t0, t0 + 0.5)); b.c.scale.setScalar(Math.max(1e-4, cg));
          b.outs.forEach((o, k) => { const u = ease(span(t, t0 + 0.4 + 0.25 * k, t0 + 1.2 + 0.25 * k)); o.position.copy(o.userData.d).multiplyScalar(1 + 2.5 * (1 - u)); o.visible = u > 0.01; });
          b.sticks.forEach((s) => { const u = ease(span(t, t0 + 1.4, t0 + 2.0)); s.scale.set(1, Math.max(1e-4, u), 1); s.visible = u > 0.01; });
          b.lone.forEach((e) => { e.visible = t > t0 + 2.0; });
          // turn slowly to show the 3D shape, then face the camera for the angle
          const spin = (t - t0 - 2.0) * 0.6, face = ease(span(t, t1 - 3.4, t1 - 2.4));
          b.g.rotation.set(0.25 * (1 - face), t < t0 + 2.0 ? 0 : spin * (1 - face) + Math.round(spin / (2 * Math.PI)) * 2 * Math.PI * face, 0);
          const ag = span(t, t1 - 2.6, t1 - 2.2); b.arc.visible = ag > 0.01; b.arc.scale.setScalar(Math.max(1e-4, ag));
        });
        all.forEach((b, i) => { const u = back(span(t, GR0 + 0.2 + 0.18 * i, GR0 + 0.7 + 0.18 * i)); b.g.visible = u > 0.01; b.g.scale.setScalar(Math.max(1e-4, 1.0 * u)); b.g.rotation.y = 0.35 * Math.sin(t * 0.5 + i); b.arc.visible = true; b.lone.forEach((e) => { e.visible = true; }); });
        gNames.forEach((l) => K.popIn(l, t, GR0 + 2.7, BACK));
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'What shapes do molecules have?', dockTitle: 'Shapes', intro: INTRO, ticks: TICKS,
      rows: [[0, 'too small to see: found by experiments'], [1, 'linear: CO₂'], [1, 'bent: SO₂, H₂O'], [1, 'trigonal planar: BCl₃'], [1, 'tetrahedral: CH₄'], [1, 'trigonal pyramidal: NH₃']],
      short: ['linear', 'bent', 'trigonal planar', 'tetrahedral', 'pyramidal'] }));
    return U.finish();
  },
};
