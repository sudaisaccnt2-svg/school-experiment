// Lesson 408 · Lewis Structures (book p. 105: Lewis structure, Fig. 4.13 water, Example 4.3 H₂S, Practice 4.3 NH₃, Test
// Yourself 1–3). v1 as a code lesson (2026-11-04), replacing the old Blender film. Built from SKILL.md §0 + §1 + §4.
// THE QUESTION (book p.105: "unshared electrons are shown as dots or cross and shared pair … as lines"): "How do we draw a
//   molecule on paper?" → card, docked panel, five ticks: lines and dots · water · H₂S · NH₃ · 2 or 4 electrons.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a glass of water, an open notebook, a pencil (names held) · "Can we draw a molecule on paper?" →
//         card → dive INTO the water.
//  FLAT   (dark) a water molecule as dot and cross (two shared pairs gold, two lone pairs) · each shared pair shrinks into
//         a gold line between the atoms "a shared pair = a line" · the rings go, the nuclei become letters O, H, H ·
//         the lone pairs stay "lone pairs = dots" · "the Lewis structure of water ✓" · ✓ lines and dots.
//  PAPER  back on the table, close on the notebook: the pencil draws exactly that picture, stroke by stroke: H — O — H,
//         the two pairs of dots · ✓ water · Example 4.3: "sulphur has 6 outside, like oxygen" → the pencil draws H—S—H
//         with two lone pairs ✓ · Practice 4.3: "nitrogen: 3 shared pairs + 1 lone pair" → the pencil draws NH₃ ✓.
//  COUNT  Test Yourself 2: the pencil draws H–H "1 line = 2 electrons" and O=O "2 lines = 4 electrons" ✓.
//  END    the page: "Lines for shared pairs, dots for lone pairs ✓".
// Game (🎮 Bond Builder, docs/COVERAGE_U4.md): Test Yourself 1 (non-metals form covalent bonds; how), 3 (dot and cross
//   for Cl₂, HCl, NH₃).
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U4.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, rest, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, WGX = HKX - 0.62, NBX = HKX + 0.12, PNX = HKX + 0.6;      // hook: water glass · notebook · pencil rest
const FLX = 40;                                                          // (dark) water flattens into its Lewis structure

// ---------------------------------------------------------------- time
const T = { card: 9.4 };
const DOCK = T.card + 5.0;
const WD = DOCK + 3.4, PB = WD + 18.6, P0 = PB + 1.6;
const H2S = P0 + 7.4, NH3 = H2S + 10.0, CNT = NH3 + 10.6, END = CNT + 9.8;
T.done = END + 6.4;
const INTRO = [T.card, DOCK];
const TICKS = [[WD + 12.4, 0], [P0 + 5.4, 1], [H2S + 8.4, 2], [NH3 + 9.0, 3], [CNT + 8.6, 4]];
const DARK = [[WD, PB]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

// the page: what the pencil draws (page units: 0..1 across, 0..1 down), when
const L = (x, y, x1, y1, t0, d = 0.5) => ({ k: 'line', x, y, x1, y1, t0, d });
const X = (s, x, y, t0, size) => ({ k: 'text', s, x, y, t0, d: 0.35, size });
const D = (x, y, t0) => ({ k: 'dot', x, y, t0, d: 0.15 });
const pairs = (x, y, dx, dy, t0) => [D(x - dx, y - dy, t0), D(x + dx, y + dy, t0 + 0.15)];
const PAGE = [
  // water (Fig. 4.13, the bent drawing): O on top, the two H below left and right, both lone pairs above O
  X('O', 0.27, 0.3, P0), L(0.25, 0.35, 0.19, 0.44, P0 + 0.4), X('H', 0.17, 0.49, P0 + 0.95), L(0.29, 0.35, 0.35, 0.44, P0 + 1.35), X('H', 0.37, 0.49, P0 + 1.9),
  D(0.235, 0.215, P0 + 2.3), D(0.255, 0.205, P0 + 2.45), D(0.285, 0.205, P0 + 2.6), D(0.305, 0.215, P0 + 2.75),
  // H₂S (Example 4.3)
  X('H', 0.55, 0.36, H2S + 3.6), L(0.58, 0.36, 0.65, 0.36, H2S + 3.95), X('S', 0.69, 0.36, H2S + 4.5), L(0.73, 0.36, 0.8, 0.36, H2S + 4.9), X('H', 0.83, 0.36, H2S + 5.45),
  { ...D(0.675, 0.27, H2S + 5.9) }, { ...D(0.705, 0.27, H2S + 6.05) }, { ...D(0.675, 0.45, H2S + 6.25) }, { ...D(0.705, 0.45, H2S + 6.4) },
  // NH₃ (Practice 4.3): H — N — H, one H below, one lone pair on top
  X('H', 0.13, 0.66, NH3 + 3.8), L(0.16, 0.66, 0.23, 0.66, NH3 + 4.15), X('N', 0.27, 0.66, NH3 + 4.7), L(0.31, 0.66, 0.38, 0.66, NH3 + 5.1), X('H', 0.41, 0.66, NH3 + 5.65),
  L(0.27, 0.71, 0.27, 0.8, NH3 + 6.1), X('H', 0.27, 0.86, NH3 + 6.65), { ...D(0.255, 0.575, NH3 + 7.1) }, { ...D(0.285, 0.575, NH3 + 7.25) },
  // Test Yourself 2: one line = 2 electrons, two lines = 4 electrons
  X('H', 0.56, 0.62, CNT + 2.4), L(0.59, 0.62, 0.66, 0.62, CNT + 2.75), X('H', 0.69, 0.62, CNT + 3.3), X('2 electrons', 0.88, 0.62, CNT + 3.7, 50),
  X('O', 0.56, 0.8, CNT + 5.2), L(0.59, 0.785, 0.66, 0.785, CNT + 5.55, 0.4), L(0.59, 0.815, 0.66, 0.815, CNT + 6.0, 0.4), X('O', 0.69, 0.8, CNT + 6.5), X('4 electrons', 0.88, 0.8, CNT + 6.9, 50),
].sort((a, b) => a.t0 - b.t0);

const captions = [
  [5.0, T.card, 'Can we draw a molecule on paper?', [HKX, 0.36, 0.05]],
  [DOCK + 0.2, WD - 0.3, 'Look inside the water', [WGX, 0.46, 0.05]],
  [PB - 3.2, PB, 'Now draw it on paper', [FLX, AY + 1.0, 0]],
  [H2S - 0.1, H2S + 2.0, 'Example 4.3: hydrogen sulphide, H₂S', [NBX + 0.08, 0.26, -0.26]],
  [NH3 - 0.1, NH3 + 2.0, 'Practice 4.3: ammonia, NH₃', [NBX - 0.08, 0.26, -0.26]],
  [CNT - 0.1, CNT + 2.2, 'How many electrons in one line?', [NBX + 0.08, 0.26, -0.26]],
  [END, T.done, 'Lines for shared pairs, dots for lone pairs ✓', [NBX, 0.26, -0.26]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX, 0.16, 0.05], 1.75 * k, 0.6 * k, ADIR, e);
const NB = (t, k = 1, e) => S(t, [NBX, 0.02, 0.0], 0.68 * k, 0.5 * k, [0, 1.6, 1], e);          // looking down onto the page
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const WATER = [WGX, 0.2, 0.02];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), S(DOCK + 1.8, WATER, 0.36, 0.38), DIVE(WD - 0.05, WATER),
  DK(WD, FLX, 2.6, 2.3, 0.3, undefined, AY - 0.2), DK(WD + 1.8, FLX, 2.6, 2.3, 1.04, 'out', AY - 0.2), DK(PB - 0.05, FLX, 2.6, 2.3, 0.97, undefined, AY - 0.2),
  HK(PB, 1.0), NB(P0 - 0.2, 1.04), NB(END - 0.1, 0.98), NB(T.done, 1.02),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '408', { dark, AY }), { beats, ST, add, tag, grp, keyLight, goldE, blueE, fatom, ringFlash } = U;

    // ================================================================ HOOK / PAPER · a glass of water, a notebook, a pencil
    {
      U.stage((t) => t < WD - 0.05 || t >= PB - 0.05); ST.bake(U.root, 'hook', HKX, 2.0, 0.9);
      add(K.beaker(0.13, 0.3), WGX, 0, 0); const wl = add(K.liquid(0.125, 0.22, 0x3d9ee6, 0.55), WGX, 0.052, 0);
      const nb = add(K.notebook(0.62, 0.44), NBX, 0, 0), pen = add(K.pencil(0.24));
      const lW = tag('water', 0.05, '#9fd2ff', WGX, 0.42, 0.08), lN = grp(tag('a notebook and a pencil', 0.05, '#ffffff', NBX + 0.12, 0.2, 0.25), 'nb');
      const res = [['water: Lewis structure ✓', 0.27, 0.36, P0 + 3.2, H2S - 0.2], ['H₂S ✓', 0.69, 0.36, H2S + 6.7, NH3 - 0.2], ['NH₃ ✓', 0.27, 0.66, NH3 + 7.5, CNT - 0.2]].map(([s, u, v, a, b]) => ({ l: tag(s, 0.05, '#ffd27a', 0, 0, 0), u, v, a, b }));
      const top = nb.userData.at(0.56, 0.1).add(V(NBX, 0.05, 0)), lS = tag('sulphur: 6 outside, like oxygen', 0.045, '#ffffff', top.x, top.y, top.z), lNi = tag('nitrogen: 3 pairs + 1 lone pair', 0.045, '#ffffff', top.x, top.y, top.z);
      const REST = V(PNX, 0.01, 0.12), ITEMS = PAGE;
      // where the pencil tip is at time t: drawing, gliding (lifted) to the next stroke, or lying on the table
      const tipAt = (t) => {
        for (let i = 0; i < ITEMS.length; i++) {
          const it = ITEMS[i], end = it.t0 + it.d, nx = ITEMS[i + 1];
          if (t >= it.t0 - 0.05 && t <= end) return { p: nb.userData.pen([it], Math.max(it.t0, t)) ?? nb.userData.at(it.x, it.y), up: 0 };
          if (nx && t > end && t < nx.t0 && nx.t0 - end < 1.3) { const a = nb.userData.pen([it], end - 0.001) ?? nb.userData.at(it.x, it.y), b = nb.userData.at(nx.x, nx.y), u = ease(span(t, end, nx.t0)); return { p: a.lerp(b, u), up: Math.sin(Math.PI * u) }; }
        }
        return null;
      };
      beats.push((t) => {
        wl.userData.top.position.y = 0.22 + 0.003 * Math.sin(t * 2.1);
        nb.userData.draw(PAGE, t);
        // the pencil: picked up before a stroke, laid down again after a pause
        const tip = tipAt(t), first = ITEMS.find((it) => it.t0 > t - 0.8 && it.t0 - t < 0.8);
        let p, lie = 0;
        if (tip) p = tip.p.clone().add(nb.position).add(V(0, 0.002 + 0.02 * tip.up, 0));
        else if (first) { const s = ease(span(t, first.t0 - 0.8, first.t0)); p = REST.clone().lerp(nb.userData.at(first.x, first.y).add(nb.position), s); lie = 1 - s; }
        else { const prev = [...ITEMS].reverse().find((it) => it.t0 + it.d <= t); const s = prev ? ease(span(t, prev.t0 + prev.d, prev.t0 + prev.d + 0.8)) : 1; p = (prev ? nb.userData.at(prev.x, prev.y).add(nb.position) : REST.clone()).lerp(REST, s); lie = s; }
        pen.position.copy(p); pen.rotation.set(-0.35 * (1 - lie) - (Math.PI / 2 - 0.02) * lie, 0.4 * lie, -0.25 * (1 - lie)); if (lie > 0.5) pen.position.y = 0.01;
        res.forEach(({ l, a, b }) => { l.position.copy(nb.userData.at(0.56, 0.1)).add(nb.position).add(V(0, 0.05, 0)); K.popIn(l, t, a, b); });
        K.popIn(lW, t, 0.4, 2.4); K.popIn(lN, t, 2.5, 4.8); K.popIn(lS, t, H2S + 2.0, H2S + 5.6); K.popIn(lNi, t, NH3 + 2.0, NH3 + 6.0);
      });
    }

    // ================================================================ FLAT (dark) · water's dot and cross becomes its Lewis structure
    {
      U.stage((t) => t >= WD - 0.05 && t < PB - 0.05); keyLight(FLX, AY - 0.2);
      const OY = AY + 0.05, ANG = [-37.75, -142.25].map((d) => d * Math.PI / 180), DH = 0.74;
      const ox = fatom([2, 6], 8, 8, { r0: 0.28, dr: 0.28, nr: 0.13, a0: [Math.PI / 2, Math.PI / 2] }); add(ox.g, FLX, OY, 0);
      const hs = ANG.map((a) => { const at = V(Math.cos(a) * DH, Math.sin(a) * DH * Math.cos(ox.tilt), Math.sin(a) * DH * Math.sin(ox.tilt) + 0.015); const h = fatom([1], 1, 0, { a0: [a + Math.PI], nr: 0.3 }); add(h.g, FLX + at.x, OY + at.y, at.z); return { h, a, at }; });
      const RO = 0.56, PAIR = 0.47, OT = [ANG[0] + 0.12, ANG[1] - 0.12, 1.0, 1.3, 1.84, 2.14], oOut = ox.es.filter((x) => x.s === 1);
      // the starting picture: both pairs already shared (gold), the lone pairs on top
      oOut.forEach((x, i) => { x.to = ox.pt(RO, OT[i]); x.u = 1; });
      hs.forEach(({ h, a, at }, k) => {
        const mid = V(Math.cos(a) * PAIR, Math.sin(a) * PAIR * Math.cos(ox.tilt), Math.sin(a) * PAIR * Math.sin(ox.tilt)), side = V(-Math.sin(a), Math.cos(a), 0).multiplyScalar(0.06);
        oOut[k].to = mid.clone().add(side); h.es[0].to = mid.clone().sub(side).sub(at).add(V(0, 0, -0.015)); h.es[0].u = 1; h.es[0].e.material = oOut[k].e.material = goldE;
      });
      const lines = hs.map(({ a }) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, DH - 0.36, 12), M.glow(0xffc04d, 1.6)); m.position.set(FLX + Math.cos(a) * DH / 2, OY + Math.sin(a) * DH / 2 * Math.cos(ox.tilt), 0.02); m.rotation.z = a - Math.PI / 2; U.root.add(m); return m; });
      const letters = [['O', FLX, OY], ...hs.map(({ at }) => ['H', FLX + at.x, OY + at.y])].map(([s, x, y]) => { const l = K.label(s, 0.2, '#ffffff', 800); l.position.set(x, y, 0.05); l.renderOrder = 22; U.root.add(l); return l; });
      const lDC = tag('water as dot and cross', 0.055, '#ffffff', FLX, OY - 1.05, 0.1), lLine = tag('a shared pair = a line', 0.06, '#ffd27a', FLX, OY - 1.05, 0.1);
      const lDots = tag('lone pairs = dots', 0.06, '#ffffff', FLX, OY + 0.95, 0.1), lLew = tag('the Lewis structure of water ✓', 0.06, '#ffd27a', FLX, OY - 1.05, 0.1);
      const LN = WD + 3.0, FL = LN + 4.2;
      beats.push((t) => {
        ox.update(0); hs.forEach(({ h }) => h.update(0));
        const ln = ease(span(t, LN, LN + 1.2)), fl = ease(span(t, FL, FL + 1.2));
        hs.forEach(({ h }, k) => { [oOut[k], h.es[0]].forEach((x) => { x.e.scale.setScalar(Math.max(1e-4, 1 - ln)); x.e.visible = ln < 0.99; }); });
        lines.forEach((m) => { m.visible = ln > 0.01; m.scale.set(1, Math.max(1e-4, ln), 1); });
        [ox, ...hs.map((x) => x.h)].forEach((a) => { a.rings.forEach((r) => { r.scale.setScalar(Math.max(1e-4, 1 - fl)); r.visible = fl < 0.99; }); a.g.children[0].scale.setScalar(Math.max(1e-4, 1 - fl)); });
        oOut.slice(2).forEach((x) => x.e.scale.setScalar(1 + 0.5 * bump(t, FL + 2.0, 0.6)));
        ox.es.filter((x) => x.s === 0).forEach((x) => { x.e.scale.setScalar(Math.max(1e-4, 1 - fl)); x.e.visible = fl < 0.99; });   // inner electrons are not drawn
        letters.forEach((l, i) => { const u = back(span(t, FL + 0.6 + 0.2 * i, FL + 1.0 + 0.2 * i)); l.visible = u > 0.01; l.userData.s0 ??= l.scale.clone(); l.scale.copy(l.userData.s0).multiplyScalar(Math.max(1e-4, u)); l.userData.mark = true; });
        K.popIn(lDC, t, WD + 0.6, LN - 0.1); K.popIn(lLine, t, LN + 1.3, FL - 0.1); K.popIn(lDots, t, FL + 1.8, FL + 4.6); K.popIn(lLew, t, FL + 4.7, PB - 3.4);
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'How do we draw a molecule on paper?', dockTitle: 'Lewis', intro: INTRO, ticks: TICKS,
      rows: [[0, 'the Lewis structure'], [1, 'shared pair = line, lone pair = dots'], [1, 'water (Fig. 4.13)'], [1, 'H₂S (Example 4.3)'], [1, 'NH₃ (Practice 4.3)'], [1, 'one line: 2 electrons, two lines: 4']],
      short: ['lines and dots', 'water', 'H₂S', 'NH₃', '2 or 4 electrons'] }));
    return U.finish();
  },
};
