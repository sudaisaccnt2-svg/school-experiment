// Lesson 613 · Temperature & Solubility (book pp. 171–172: (iv) effect of temperature: gases are usually less soluble
// when hotter (the molecules get more kinetic energy and escape back to the gas), Fig. 6.10 (CH₄, O₂, CO, He); solids:
// harder to predict, Fig. 6.11: (i) solubility rises with temperature (KNO₃, CaCl₂, Pb(NO₃)₂), (ii) falls (Ce₂(SO₄)₃,
// Li₂CO₃, CaO), (iii) hardly changes (NaCl, KBr), (iv) rises to a peak then falls (Na₂SO₄, decahydrate below 32.4 °C,
// anhydrous above; maximum at 32.4 °C)). v1 as a code lesson (2026-11-04), replacing the old Blender film. SKILL.md.
// THE QUESTION: "Does hot water dissolve more?" → card, docked panel, five ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: two glasses of soda water, one on ice, one on a hot plate; three beakers of water with a heap of
//         potassium nitrate, of table salt and of cerium sulphate on a second hot plate (one by one with thermometers);
//         a notebook (named one at a time) · question → card.
//  GAS    the hot plate warms one soda: it fizzes hard and goes flat, the cold one keeps its gas "warmer: less gas stays
//         dissolved ✓" → dive (dark): dissolved CO₂ in water; as it warms the water molecules speed up and CO₂ escape
//         through the surface "more energy: the gas molecules escape ✓".
//  SALTS  the second hot plate under the three beakers: the KNO₃ heap dissolves away "KNO₃: more soluble when hot ✓";
//         the salt heap stays the same "NaCl: hardly changes"; white solid comes out of the cerium sulphate solution
//         "Ce₂(SO₄)₃: less soluble when hot".
//  GRAPH  the pencil draws Fig. 6.11: KNO₃ rising, NaCl flat, Ce₂(SO₄)₃ falling, Na₂SO₄ rising to a peak at 32.4 °C then
//         falling "Na₂SO₄: most soluble at 32.4 °C ✓".
//  END    "Gases: less when hot. Solids: it depends on the solid ✓".
// Game (🎮 Solutions Practice › Tables, Solution Lab: the up / down / flat / peak salts, Fig. 6.10 gases; docs/COVERAGE_U6.md).
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
const G1X = -1.1, G2X = -0.78, HP2 = 0.0, BX = [-0.28, 0.0, 0.28], NBX = 0.68;
const DX = 40;

// ---------------------------------------------------------------- time
const T = { card: 10.0 };
const DOCK = T.card + 5.0;
const G0 = DOCK + 0.4, ID = G0 + 9.0, B1 = ID + 9.0, S0 = B1, GR = S0 + 14.0, END = GR + 15.6;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[G0 + 7.6, 0], [ID + 7.2, 1], [S0 + 8.6, 2], [S0 + 12.6, 3], [GR + 13.4, 4]];
const DARK = [[ID, B1]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [8.0, T.card, 'Does hot water dissolve more?', [0, 0.6, 0.05]],
  [G0 + 0.2, G0 + 2.0, 'Two glasses of soda: cold and warm', [(G1X + G2X) / 2, 0.45, 0.05]],
  [G0 + 8.0, ID - 0.2, 'Where does the gas go?', [G2X, 0.4, 0.05]],
  [S0 + 0.3, S0 + 2.2, 'Now three solids, heated together', [HP2, 0.48, 0.05]],
  [GR + 0.3, GR + 2.2, 'Fig. 6.11: solubility against temperature', [NBX, 0.25, 0.2]],
  [END + 0.4, T.done, 'Gases: less when hot. Solids: it depends on the solid ✓', [0, 0.6, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [-0.15, 0.25, 0.1], 2.3 * k, 0.8 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const near = (t, p, w = 0.8, h = 0.65, e, dir = ADIR) => S(t, p, w, h, dir, e);
const P_G = [(G1X + G2X) / 2, 0.25, 0.05], P_IN = [G2X, 0.24, 0.0], P_S = [HP2, 0.25, 0.05], P_NB = [NBX, 0.02, 0.3], NBDIR = [0, 2.2, 1];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(G0, P_G, 0.75, 0.6), near(G0 + 7.8, P_G, 0.72, 0.58), near(G0 + 8.6, P_IN, 0.22, 0.2), DIVE(ID - 0.05, P_IN),
  DK(ID, DX, 3.0, 2.2, 0.3), DK(ID + 1.8, DX, 3.0, 2.2, 1.04, 'out'), DK(B1 - 0.05, DX, 3.0, 2.2, 0.97),
  S(B1, P_IN, 0.5, 0.45, ADIR, 'out'), near(S0 + 1.2, P_S, 0.85, 0.62), near(GR - 0.05, P_S, 0.82, 0.6),
  near(GR + 0.6, P_NB, 0.62, 0.46, undefined, NBDIR), near(END - 0.05, P_NB, 0.6, 0.44, undefined, NBDIR), HK(END + 0.4, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

// Fig. 6.11 on the notebook: four salts, solubility (g / 100 g water) against temperature 0 … 100 °C
const GP = (c, s) => [0.1 + c / 100 * 0.6, 0.9 - s / 100 * 0.78];
const curve = (f, t0, step = 10, w = 5) => { const it = [], pts = []; for (let c = 0; c <= 100; c += step) pts.push(GP(c, f(c))); pts.slice(1).forEach(([x1, y1], k) => it.push({ k: 'line', x: pts[k][0], y: pts[k][1], x1, y1, t0: t0 + 0.12 * k, d: 0.12, w })); return it; };
const PAGE = [
  { k: 'line', x: 0.1, y: 0.9, x1: 0.72, y1: 0.9, t0: GR + 2.4, d: 0.4 }, { k: 'line', x: 0.1, y: 0.9, x1: 0.1, y1: 0.1, t0: GR + 2.9, d: 0.4 },
  { k: 'text', s: '°C', x: 0.75, y: 0.94, t0: GR + 3.3, size: 38 }, { k: 'text', s: 'g/100 g', x: 0.12, y: 0.06, t0: GR + 3.4, size: 34 },
  ...curve((c) => 13 + 0.0235 * c * c, GR + 3.8, 5), { k: 'text', s: 'KNO₃', x: 0.62, y: 0.12, t0: GR + 6.2, size: 38 },
  ...curve((c) => 35.7 + 0.04 * c, GR + 6.4), { k: 'text', s: 'NaCl', x: 0.8, y: 0.54, t0: GR + 7.8, size: 38 },
  ...curve((c) => 10 * Math.exp(-c / 30), GR + 8.0), { k: 'text', s: 'Ce₂(SO₄)₃', x: 0.82, y: 0.86, t0: GR + 9.4, size: 34 },
  ...curve((c) => (c < 32.4 ? 5 + 1.0 * c * c / 32.4 : 37.4 - 0.18 * (c - 32.4)), GR + 9.6, 4), { k: 'dot', ...{ x: GP(32.4, 37.4)[0], y: GP(32.4, 37.4)[1] }, t0: GR + 11.0 }, { k: 'text', s: 'Na₂SO₄ 32.4 °C', x: GP(32.4, 45)[0] + 0.02, y: GP(32.4, 45)[1], t0: GR + 11.2, size: 32 },
];

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '613', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;

    // ================================================================ BENCH
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', -0.15, 2.7, 1.0);
      const iceM = new THREE.MeshPhysicalMaterial({ color: 0xe8f6ff, roughness: 0.08, transmission: 0.6, thickness: 0.05, transparent: true, opacity: 0.85, clearcoat: 1 });
      [[-0.07, 0.04, 0.3], [0.05, 0.05, -0.4], [0.0, -0.06, 0.9]].forEach(([x, z, r], i) => { const c = add(K.solid(new THREE.BoxGeometry(0.05, 0.04, 0.05), iceM), G1X + x, 0.02 + 0.002 * i, z); c.rotation.y = r; });
      const g1 = add(K.labBeaker(0.06, 0.18), G1X, 0.047, 0); add(K.liquid(0.055, 0.12, 0xc8a060, 0.55), G1X, 0.059, 0); const f1 = add(K.bubbles(10, V(0, 0.02, 0), 0.12, 0.08, 0.006), G1X, 0.059, 0);
      const hp1 = add(K.hotPlate(), G2X, 0, 0); add(K.labBeaker(0.06, 0.18), G2X, 0.105, -0.01); add(K.liquid(0.055, 0.12, 0xc8a060, 0.55), G2X, 0.117, -0.01); const f2 = add(K.bubbles(26, V(0, 0.02, 0), 0.12, 0.08, 0.007), G2X, 0.117, -0.01);
      const hp2 = add(K.hotPlate(0.8, 0.3), HP2, 0, 0), th = add(K.thermometer(0.32, 100), HP2 + 0.38, 0.105, 0.04); th.rotation.z = -0.2; th.userData.set(20);
      const heaps = [[0xfafaf4], [0xfafaf6], [0xf4f2ea]].map(([c], i) => { add(K.labBeaker(0.06, 0.16), BX[i], 0.105, -0.01); add(K.liquid(0.055, 0.1, 0x3d9ee6, 0.45), BX[i], 0.117, -0.01); const h = add(U6.crystalHeap(0.04, 45, c), BX[i], 0.119, -0.01); h.userData.set(i === 2 ? 0 : 0.8); return h; });
      const nb = add(K.notebook(0.52, 0.38), NBX, 0, 0.3), pen = add(K.pencil(0.22)), write = U5.penWriter(nb, pen, PAGE, V(NBX + 0.32, 0.01, 0.4), nb.position);
      const ls = [['soda water on ice · on a hot plate', '#ffffff', (G1X + G2X) / 2, 0.38, 0.08], ['KNO₃ · NaCl · Ce₂(SO₄)₃ in water, a hot plate', '#ffffff', HP2, 0.38, 0.08], ['a notebook', '#ffffff', NBX, 0.1, 0.5]].map(([s, c, x, y, z]) => tag(s, 0.04, c, x, y, z));
      const say = (a, b, x, y, t0, t1, g, z = 0.1) => ({ l: [grp(tag(a, 0.042, '#ffffff', x, y + 0.035, z), g), ...(b ? [grp(tag(b, 0.045, '#ffd27a', x, y - 0.03, z), g)] : [])], t0, t1 });
      const SAY = [
        say('cold: keeps its fizz · warm: goes flat', 'warmer: less gas stays dissolved ✓', (G1X + G2X) / 2, 0.4, G0 + 5.4, G0 + 7.8, 'g'),
        say('KNO₃: more soluble when hot ✓', null, HP2, 0.42, S0 + 6.6, S0 + 8.4, 's1'), say('NaCl: hardly changes', null, HP2, 0.42, S0 + 8.6, S0 + 10.4, 's2'), say('Ce₂(SO₄)₃: less soluble when hot', null, HP2, 0.42, S0 + 10.6, GR, 's3'),
        say('Na₂SO₄: most soluble at 32.4 °C ✓', null, NBX, 0.04, GR + 12.0, END, 'n', 0.54),
      ];
      beats.push((t) => {
        const w = ease(span(t, G0 + 1.4, G0 + 2.0)); hp1.userData.on(w); f1.userData.update(t, 0.25); f2.userData.update(t, t < G0 + 2.4 ? 0.25 : 1.0 - 0.85 * ease(span(t, G0 + 4.6, G0 + 7.0)));
        const on = ease(span(t, S0 + 2.4, S0 + 2.8)); hp2.userData.on(on); th.userData.set(lerp(20, 80, ease(span(t, S0 + 2.8, S0 + 9.0))));
        heaps[0].userData.set(0.8 * (1 - ease(span(t, S0 + 3.6, S0 + 6.4)))); heaps[2].userData.set(0.7 * ease(span(t, S0 + 6.0, S0 + 10.0)));
        write(t);
        ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 2.4, 2.5 + i * 2.4)); SAY.forEach(({ l, t0, t1 }) => l.forEach((x) => K.popIn(x, t, t0, t1)));
      });
    }

    // ================================================================ INSIDE (dark) · warmer: the gas molecules escape
    {
      U.stage((t) => t >= ID - 0.05 && t < B1 - 0.05); keyLight(DX);
      const W = 2.4, H = 1.4, D = 0.8; add(U5.glassBox(W, H, D), DX, AY - 0.2, 0);
      const surf = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.02, D - 0.02), new THREE.MeshBasicMaterial({ color: 0x5aa8ff, transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide })); surf.rotation.x = -Math.PI / 2; add(surf, DX, AY - 0.2 + H / 2 - 0.25, 0);
      const wat = U5.swarm(36, { r: 0.06, color: 0x59a8ff, w: W, h: H, d: D, glow: 0.2 }), WP = Array.from({ length: 36 }, (_, i) => V(-W / 2 + 0.15 + (i % 9) * (W - 0.3) / 8, -H / 2 + 0.12 + Math.floor(i / 9) * 0.22, (U5.rnd(i, 4) - 0.5) * 0.5)); add(wat.g, DX, AY - 0.2, 0);
      const co2 = Array.from({ length: 6 }, (_, k) => ({ m: add(U.ballMol([['O', -0.13, 0], ['C', 0, 0], ['O', 0.13, 0]], [[0, 1, 2], [1, 2, 2]], { r: { O: 0.06, C: 0.06 } })), p: V(DX - 0.9 + 0.36 * k, AY - 0.55 + 0.18 * (k % 3), 0.15), t0: ID + 3.6 + 0.6 * k }));
      const glow = add(K.glowSprite(0xff6a2a, 1.6), DX, AY - 1.05, 0.2);
      const l1 = tag('CO₂ dissolved between the water molecules', 0.046, '#ffffff', DX, AY - 1.1, 0.1);
      const l2 = [grp(tag('warmer: more energy, faster —', 0.046, '#ffd27a', DX, AY - 1.02, 0.1), 'e'), grp(tag('the gas molecules escape ✓', 0.05, '#ffd27a', DX, AY - 1.2, 0.1), 'e')];
      beats.push((t) => {
        const lt = t - ID, k = 1 + 2 * span(t, ID + 2.4, ID + 4.0);
        wat.place(lt, (i) => WP[i].clone().add(V(Math.sin(lt * 3 * k + i), Math.cos(lt * 2.6 * k + i), 0).multiplyScalar(0.03 * k)));
        co2.forEach(({ m, p, t0 }) => { const u = ease(span(t, t0, t0 + 1.6)); m.position.copy(p).lerp(p.clone().setY(AY + 0.9), u); m.rotation.z = lt * 2; });
        glow.material.opacity = 0.7 * span(t, ID + 2.0, ID + 3.0);
        K.popIn(l1, t, ID + 0.6, ID + 3.4); l2.forEach((l) => K.popIn(l, t, ID + 4.6, B1));
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Does hot water dissolve more?', dockTitle: 'Temperature', intro: INTRO, ticks: TICKS,
      rows: [[0, 'soda water, KNO₃, NaCl, Ce₂(SO₄)₃, hot plates'], [1, 'warmer soda: less gas dissolves'], [1, 'more energy: gas molecules escape'], [1, 'KNO₃ (CaCl₂, Pb(NO₃)₂): more when hot'], [1, 'NaCl, KBr: flat · Ce₂(SO₄)₃ (Li₂CO₃, CaO): less'], [1, 'Na₂SO₄: a peak at 32.4 °C']],
      short: ['gas: less', 'gas escapes', 'more when hot', 'flat · less', 'Na₂SO₄ peak'] }));
    return U.finish();
  },
};
