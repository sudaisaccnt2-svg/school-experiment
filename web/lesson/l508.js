// Lesson 508 · Boiling & Freezing Points (book pp. 137–139: (d) temperature, iv Boiling point, Fig. 5.12, the
// temperature stays the same while boiling, factors (a) nature of the liquid, Fig. 5.13, (b) external pressure: hills,
// vacuum distillation, pressure cooker; v Freezing point; STS: Torricelli's barometer (1646) 760 mm Hg; Table 5.2).
// v1 as a code lesson (2026-11-04), replacing the old Blender film. SKILL.md §0 + §1 + §4.
// THE QUESTION: "When does a liquid boil?" → card, docked panel, six ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: water on a tripod with a thermometer and a burner (Fig. 5.12), a notebook, a sealed syringe of
//         warm water, a pressure cooker, ice in water with a thermometer, a mercury barometer (named one at a time).
//  HEAT   the burner is lit; the red column climbs 25 → 100 °C; big bubbles start "bubbles at 100 °C" · "What is inside a
//         bubble?" → dive INTO a bubble.
//  BUBBLE (dark) water vapour inside the bubble hits its skin and pushes out; gold arrows press in "the air above pushes
//         back (outside pressure)"; the pushes match, the bubble grows and rises "equal pushes: it boils ✓".
//  STILL  back at the beaker, the flame still burns, "a few minutes later: still 100 °C" "the heat breaks the forces:
//         the temperature stays the same ✓".
//  CURVES the pencil draws Fig. 5.13: each liquid's vapour pressure rising with temperature; where each meets the 760 line
//         it boils: ether 34.6 °C, ethanol 78.3 °C, water 100 °C "polar water boils highest ✓".
//  PRESSURE warm water (60 °C) in a sealed syringe; the plunger is pulled: it boils "less pressure: it boils below 100 °C
//         (hills, vacuum distillation)" · the pressure cooker rattles "more pressure: above 100 °C, the pressure cooker ✓".
//  FREEZE ice floating in water, the thermometer at 0 °C "ice and water together at 0 °C · liquid ↔ solid in
//         equilibrium: freezing point ✓".
//  BAROMETER the tube of mercury, turned over in its dish: the column falls and stops at 760 mm "the air holds it up:
//         Torricelli, 1646 ✓".
//  END    "A liquid boils when its vapour pressure equals the outside pressure ✓".
// Game (🎮 Why? Lab + State Sorter, docs/COVERAGE_U5.md): Table 5.2 (freezing and boiling points), Boyle's J-tube,
//   the manometer, the factors.
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U5.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
import * as U5 from './u5kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, BKX = HKX - 1.15, NBX = HKX - 0.5, SYX = HKX + 0.08, PCX = HKX + 0.48, ICX = HKX + 0.9, BRX = HKX + 1.28;
const BX = 40;

// ---------------------------------------------------------------- time
const T = { card: 12.2 };
const DOCK = T.card + 5.0;
const H0 = DOCK + 0.4, ID = H0 + 12.4, B1 = ID + 10.4, GR = B1 + 7.6, SP0 = GR + 11.6, PC0 = SP0 + 8.8, FZ = PC0 + 5.0, BR = FZ + 8.8, END = BR + 8.8;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[ID + 9.0, 0], [B1 + 6.0, 1], [GR + 10.2, 2], [PC0 + 3.4, 3], [FZ + 7.4, 4], [BR + 7.4, 5]];
const DARK = [[ID, B1]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [9.6, T.card, 'When does a liquid boil?', [HKX, 0.9, 0.05]],
  [H0 + 10.2, ID - 0.3, 'What is inside a bubble?', [BKX, 0.95, 0.05]],
  [SP0 + 0.3, SP0 + 2.4, 'Warm water, 60 °C: pull the plunger', [SYX, 0.55, 0.05]],
  [FZ + 0.3, FZ + 2.4, 'Now water cooled until ice forms', [ICX, 0.5, 0.05]],
  [BR + 0.1, BR + 2.0, 'A tube of mercury, turned over', [BRX, 1.05, 0.05]],
  [END + 0.4, T.done, 'A liquid boils when its vapour pressure equals the outside pressure ✓', [HKX, 0.92, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX + 0.06, 0.4, 0.05], 2.8 * k, 1.0 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const near = (t, p, w = 0.8, h = 0.65, e, dir = ADIR) => S(t, p, w, h, dir, e);
const P_BK = [BKX + 0.05, 0.55, 0.05], P_BUB = [BKX, 0.66, 0.0], P_NB = [NBX, 0.02, -0.03], NBDIR = [0, 1.2, 1];
const P_SY = [SYX, 0.22, 0.05], P_PC = [PCX + 0.05, 0.2, 0.05], P_IC = [ICX, 0.15, 0.05], P_BR = [BRX, 0.55, 0.05];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(H0 + 1.0, P_BK, 0.85, 1.1), near(H0 + 10.0, P_BK, 0.8, 1.04), near(H0 + 11.4, P_BUB, 0.2, 0.18), DIVE(ID - 0.05, P_BUB),
  DK(ID, BX, 2.6, 2.4, 0.3), DK(ID + 1.8, BX, 2.6, 2.4, 1.04, 'out'), DK(B1 - 0.05, BX, 2.6, 2.4, 0.97),
  S(B1, P_BUB, 0.1, 0.08, ADIR, 'out'), near(B1 + 1.2, P_BK, 0.85, 1.1), near(GR - 0.05, P_BK, 0.82, 1.06),
  near(GR + 0.8, P_NB, 0.66, 0.48, undefined, NBDIR), near(SP0 - 0.05, P_NB, 0.62, 0.46, undefined, NBDIR),
  near(SP0 + 0.6, P_SY, 0.6, 0.6), near(PC0 - 0.05, P_SY, 0.58, 0.58), near(PC0 + 0.6, P_PC, 0.66, 0.55), near(FZ - 0.05, P_PC, 0.64, 0.53),
  near(FZ + 0.6, P_IC, 0.6, 0.5), near(BR - 0.05, P_IC, 0.58, 0.48), near(BR + 0.6, P_BR, 0.5, 0.98, undefined, [0.25, 0.4, 1]), near(END - 0.05, P_BR, 0.48, 0.95, undefined, [0.25, 0.4, 1]), HK(END + 0.4, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

// Fig. 5.13 on the notebook: vapour pressure against temperature, the 760 line, three liquids
const GP = (Tc, P) => [0.1 + Tc / 110 * 0.82, 0.9 - P / 900 * 0.78];
const PAGE = (() => {
  const g0 = GR + 1.0, it = [{ k: 'line', x: 0.1, y: 0.9, x1: 0.94, y1: 0.9, t0: g0, d: 0.5 }, { k: 'line', x: 0.1, y: 0.9, x1: 0.1, y1: 0.1, t0: g0 + 0.6, d: 0.5 },
    { k: 'text', s: '°C', x: 0.95, y: 0.96, t0: g0 + 1.1, size: 40 }, { k: 'text', s: 'torr', x: 0.07, y: 0.07, t0: g0 + 1.3, size: 36 }];
  for (let k = 0; k < 10; k++) { const [x, y] = GP(k * 11, 760), [x1] = GP(k * 11 + 6, 760); it.push({ k: 'line', x, y, x1, y1: y, t0: g0 + 1.6 + 0.06 * k, d: 0.06, w: 4 }); }
  it.push({ k: 'text', s: '760', x: 0.05, y: GP(0, 760)[1], t0: g0 + 2.3, size: 34 });
  [34.6, 78.3, 100].forEach((Tb, j) => {
    const P = (Tc) => 760 * Math.exp(0.04 * (Tc - Tb)), pts = [];
    for (let Tc = Math.max(0, Tb - 70); Tc <= Math.min(108, Tb + 3); Tc += 6) pts.push(GP(Tc, P(Tc)));
    pts.slice(1).forEach(([x1, y1], k) => it.push({ k: 'line', x: pts[k][0], y: pts[k][1], x1, y1, t0: g0 + 2.8 + 1.4 * j + 0.08 * k, d: 0.08, w: 5 }));
    const [x, y] = GP(Tb, 760); it.push({ k: 'dot', x, y, t0: g0 + 3.9 + 1.4 * j });
  });
  return it;
})();

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '508', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;
    const fires = [], shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };

    // ================================================================ BENCH
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', HKX + 0.06, 3.0, 0.85);
      const brn = add(K.burner(), BKX, 0, 0); fires.push(brn.userData.flame); brn.userData.flame.scale.setScalar(0.45);
      add(K.tripod(0.56), BKX, 0, 0); add(K.beaker(0.11, 0.22), BKX, 0.56, 0); const bw = add(K.liquid(0.105, 0.14, 0x3d9ee6, 0.55), BKX, 0.612, 0);
      const boil = add(K.bubbles(16, V(0, 0.02, 0), 0.14, 0.12, 0.013), BKX, 0.612, 0), steam = add(K.smoke(10, 0xffffff), BKX, 0.8, 0); steam.scale.setScalar(0.16);
      const th = add(K.thermometer(0.42, 120), BKX + 0.05, 0.6, 0.02); th.rotation.z = -0.12;
      const nb = add(K.notebook(0.62, 0.44), NBX, 0, -0.03), pen = add(K.pencil(0.24)), write = U5.penWriter(nb, pen, PAGE, V(NBX + 0.36, 0.01, 0.2), nb.position);
      const sy = add(U5.syringe(0.36), SYX, 0, 0), syw = add(K.solid(new THREE.CylinderGeometry(0.037, 0.037, 0.1, 24).translate(0, 0.05, 0), new THREE.MeshPhysicalMaterial({ color: 0x3d9ee6, transparent: true, opacity: 0.5, depthWrite: false }), { outline: false }), SYX, 0.05, 0);
      const syb = add(K.bubbles(10, V(0, 0.01, 0), 0.1, 0.05, 0.007), SYX, 0.05, 0);
      const pc = add(U5.cooker(), PCX, 0, 0);
      add(K.dish(0.13), ICX, 0, 0); const iw = add(U5.dishWater(0.13), ICX, 0, 0);
      const ice = add(K.solid(new THREE.BoxGeometry(0.07, 0.05, 0.07), new THREE.MeshPhysicalMaterial({ color: 0xe8f6ff, roughness: 0.08, transmission: 0.6, thickness: 0.05, transparent: true, opacity: 0.85, clearcoat: 1 })), ICX - 0.03, 0.042, 0); ice.rotation.y = 0.5;
      const th2 = add(K.thermometer(0.32, 100), ICX + 0.06, 0.012, 0.03); th2.rotation.z = -0.4; th2.userData.set(0);
      const baro = add(U5.barometer(0.9, 0.74), BRX, 0, 0);
      const ls = [['water, a thermometer, a burner', '#9fd2ff', BKX, 1.05, 0.08], ['a notebook', '#ffffff', NBX, 0.12, 0.2], ['warm water in a sealed syringe', '#ffffff', SYX, 0.48, 0.1], ['a pressure cooker', '#ffffff', PCX + 0.05, 0.36, 0.1], ['ice in water', '#e8f6ff', ICX, 0.3, 0.1], ['a mercury barometer', '#ffffff', BRX, 1.02, 0.08]]
        .map(([s, c, x, y, z]) => tag(s, 0.045, c, x, y, z));
      const lb = tag('bubbles at 100 °C', 0.05, '#ffd27a', BKX + 0.12, 1.0, 0.08), lT = tag('a few minutes later: still 100 °C', 0.045, '#ffffff', BKX + 0.1, 1.0, 0.08);
      const lC = [grp(tag('the heat breaks the forces:', 0.045, '#ffd27a', BKX + 0.1, 1.04, 0.08), 'cn'), grp(tag('the temperature stays the same ✓', 0.045, '#ffd27a', BKX + 0.1, 0.96, 0.08), 'cn')];
      const lG = [grp(tag('ether 34.6 · ethanol 78.3 · water 100 °C', 0.045, '#ffffff', NBX, 0.24, -0.1), 'g1'), grp(tag('each boils where it meets 760 torr', 0.045, '#ffd27a', NBX, 0.18, -0.1), 'g1')];
      const lG2 = tag('polar water boils highest ✓', 0.05, '#ffd27a', NBX, 0.22, -0.1);
      const lS = [grp(tag('less pressure: it boils below 100 °C', 0.045, '#ffd27a', SYX, 0.52, 0.1), 'sy'), grp(tag('(on hills, in vacuum distillation) ✓', 0.042, '#ffd27a', SYX, 0.45, 0.1), 'sy')];
      const lP = [grp(tag('more pressure: boils above 100 °C', 0.045, '#ffd27a', PCX + 0.05, 0.42, 0.1), 'pc'), grp(tag('the pressure cooker ✓', 0.045, '#ffd27a', PCX + 0.05, 0.35, 0.1), 'pc')];
      const lF = tag('ice and water together at 0 °C', 0.045, '#e8f6ff', ICX, 0.34, 0.1);
      const lF2 = [grp(tag('liquid ↔ solid in equilibrium:', 0.045, '#ffd27a', ICX, 0.36, 0.1), 'fz'), grp(tag('the freezing point ✓', 0.05, '#ffd27a', ICX, 0.29, 0.1), 'fz')];
      const lB = [grp(tag('it falls to 760 mm and stays', 0.045, '#ffffff', BRX - 0.05, 1.02, 0.08), 'b1')], lB2 = [grp(tag('the air holds it up:', 0.045, '#ffd27a', BRX - 0.05, 1.06, 0.08), 'b2'), grp(tag('Torricelli, 1646 ✓', 0.05, '#ffd27a', BRX - 0.05, 0.98, 0.08), 'b2')];
      beats.push((t) => {
        brn.userData.flame.visible = t > H0 + 0.4;
        const c = lerp(25, 100, ease(span(t, H0 + 1.0, H0 + 7.0))); th.userData.set(c);
        const b = span(t, H0 + 6.4, H0 + 7.4); boil.userData.update(t, b); steam.userData.update(t, b * 0.9); bw.userData.top.position.y = 0.14 + 0.004 * Math.sin(t * 9) * b;
        write(t);
        const pull = ease(span(t, SP0 + 2.6, SP0 + 3.6)); sy.userData.set(1 - pull); syb.userData.update(t, span(t, SP0 + 3.4, SP0 + 4.0));
        pc.userData.update(t, span(t, PC0 + 0.2, PC0 + 0.8)); iw.userData.set(0.9); ice.position.y = 0.043 + 0.002 * Math.sin(t * 1.3);
        baro.userData.set(lerp(1.15, 1, ease(span(t, BR + 0.6, BR + 2.0))));
        ls.forEach((l, i) => K.popIn(l, t, 0.5 + i * 1.5, 1.9 + i * 1.5));
        K.popIn(lb, t, H0 + 7.6, H0 + 10.0); K.popIn(lT, t, B1 + 1.0, B1 + 3.4); lC.forEach((l) => K.popIn(l, t, B1 + 3.6, GR - 0.1));
        lG.forEach((l) => K.popIn(l, t, GR + 6.6, GR + 9.0)); K.popIn(lG2, t, GR + 9.2, SP0 - 0.1);
        lS.forEach((l) => K.popIn(l, t, SP0 + 4.4, PC0 - 0.1)); lP.forEach((l) => K.popIn(l, t, PC0 + 0.6, FZ - 0.1));
        K.popIn(lF, t, FZ + 2.6, FZ + 5.0); lF2.forEach((l) => K.popIn(l, t, FZ + 5.2, BR - 0.1)); lB.forEach((l) => K.popIn(l, t, BR + 2.2, BR + 5.0)); lB2.forEach((l) => K.popIn(l, t, BR + 5.2, END));
      });
    }

    // ================================================================ BUBBLE (dark) · vapour pushes out, the air pushes in
    {
      U.stage((t) => t >= ID - 0.05 && t < B1 - 0.05); keyLight(BX);
      const C = V(BX, AY - 0.2, 0), skin = add(U5.glassBall(0.55, 0xbfe4ff), C.x, C.y, C.z);
      const vap = U5.swarm(12, { r: 0.05, color: 0xdff0ff, w: 1, h: 1, d: 1, speed: 1.2 }); add(vap.g, C.x, C.y, C.z);
      const wat = U5.swarm(60, { r: 0.07, color: 0x3d7fd6, w: 2.6, h: 2.2, d: 0.6, glow: 0.2 }), WP = [];
      for (let i = 0; WP.length < 60 && i < 400; i++) { const p = V((U5.rnd(i, 1) - 0.5) * 2.5, (U5.rnd(i, 2) - 0.5) * 2.1, (U5.rnd(i, 3) - 0.5) * 0.5); if (p.length() > 0.72) WP.push(p); }
      add(wat.g, C.x, C.y, C.z);
      const arrows = Array.from({ length: 8 }, (_, i) => { const a = i / 8 * Math.PI * 2, m = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.16, 12), M.glow(0xffc04d, 1.6)); m.rotation.z = a + Math.PI / 2; U.root.add(m); return { m, a }; });
      const sparks = Array.from({ length: 12 }, () => add(K.glowSprite(0xffffff, 0.12)));
      const l1 = tag('inside: water vapour, pushing out', 0.05, '#dff0ff', BX, AY - 1.12, 0.1), l2 = tag('the air above pushes back (outside pressure)', 0.045, '#ffd27a', BX, AY - 1.12, 0.1);
      const l3 = [grp(tag('equal pushes: the bubble', 0.05, '#ffffff', BX, AY - 1.02, 0.1), 'eq'), grp(tag('grows and rises: it boils ✓', 0.05, '#ffffff', BX, AY - 1.22, 0.1), 'eq')];
      beats.push((t) => {
        const lt = t - ID, grow = ease(span(t, ID + 6.4, ID + 8.4)), Rb = 0.55 * (1 + 0.2 * grow), cy = C.y + 0.5 * grow;
        skin.scale.setScalar(Rb / 0.55); skin.position.y = cy; vap.g.position.y = cy;
        vap.place(lt, (i) => vap.ball(i, lt, V(0, 0, 0), Rb - 0.06));
        wat.place(lt, (i) => WP[i].clone().add(V(Math.sin(lt * 2 + i) * 0.02, Math.cos(lt * 1.7 + i) * 0.02, 0)));
        sparks.forEach((s, i) => { const p = vap.ball(i, lt, V(0, 0, 0), Rb - 0.06); s.visible = p.length() > Rb - 0.12; s.position.copy(p.multiplyScalar(Rb / Math.max(1e-3, p.length()))).add(V(C.x, cy, C.z)); });
        arrows.forEach(({ m, a }) => { const r = Rb + 0.2 + 0.04 * Math.sin(t * 4); m.visible = t > ID + 3.4; m.position.set(C.x + Math.cos(a) * r, cy + Math.sin(a) * r, 0.25); });
        K.popIn(l1, t, ID + 0.4, ID + 3.2); K.popIn(l2, t, ID + 3.6, ID + 6.2); l3.forEach((l) => K.popIn(l, t, ID + 6.6, B1));
      });
    }
    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'When does a liquid boil?', dockTitle: 'Boiling point', intro: INTRO, ticks: TICKS,
      rows: [[0, 'water and a burner, a syringe, a cooker, ice'], [1, 'vapour pressure = outside pressure'], [1, 'while it boils, the temperature stays'], [1, 'polar liquids boil higher (Fig. 5.13)'], [1, 'less pressure lower, more pressure higher'], [1, 'freezing point: liquid ↔ solid'], [1, 'Torricelli’s barometer: 760 mm Hg']],
      short: ['VP = outside', 'stays the same', 'polar: higher', 'pressure', 'freezing point', 'barometer'] }));
    return U.finish();
  },
};
