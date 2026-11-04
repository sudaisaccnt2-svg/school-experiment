// Lesson 503 · Gas Pressure, Squeezing & Density (book pp. 125–126 top: v Pressure P = F/A, the pascal, 1 atm = 760
// mm Hg = 760 torr = 101.325 kPa = 1.01325 × 10⁵ Pa, vi Compressibility, vii Mobility, viii Density = m / V, the oxygen
// densities). v1 as a code lesson (2026-11-04), replacing the old Blender film. SKILL.md §0 + §1 + §4.
// THE QUESTION: "What does a gas do in its container?" → card, docked panel, five ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a blown-up balloon, a sealed syringe with a steel weight beside it, a gas tap piped to a burner
//         (named one at a time) · "What does a gas do in its container?" → card → dive INTO the balloon.
//  PUSH   (dark) the balloon's skin, air molecules flying inside; every molecule that reaches the skin makes a spark
//         "each hit pushes the skin out: pressure ✓" · a small square of skin lights, hits drum on it "force on each
//         area: P = F / A" · "SI unit: N m⁻² = pascal (Pa), bigger: kPa" · "1 atm = 760 mm Hg = 760 torr = 101.325 kPa" ✓.
//  SQUEEZE bridge "Can we squeeze a gas?" · the weight is lifted onto the syringe's plunger; the camera follows it INTO
//         the barrel (dark): "lots of empty space between them" · the weight presses the piston down "pushed: closer,
//         less volume ✓ (compressible)" · "change in volume per change in pressure".
//  DENSITY the weight lifts off, the piston rises: the gas fills one cube again; a cube of liquid oxygen and a cube of
//         solid oxygen slide in beside it "oxygen: gas · liquid · solid" · "0.00142 · 1.149 · 1.42 g/cm³" (book values)
//         "density = mass ÷ volume: a gas is very light ✓".
//  FLOW   back on the table: the tap turns, a glow runs along the pipe, the burner lights "it flows along pipes:
//         mobility ✓ (weak forces, empty spaces)".
//  END    the balloon: "A gas pushes, squeezes, flows and is light ✓".
// Game (🎮 Gas Law Lab › Units + Why? Lab, docs/COVERAGE_U5.md): the units and conversions, the definitions.
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U5.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
import * as U5 from './u5kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, BLX = HKX - 0.95, SYX = HKX - 0.35, WTX = SYX + 0.16, TPX = HKX + 0.15, BRX = HKX + 0.85;   // balloon · syringe · weight · tap · burner
const PX = 40, SX = 52;                                                                       // (dark) inside the balloon · inside the syringe

// ---------------------------------------------------------------- time
const T = { card: 9.2 };
const DOCK = T.card + 5.0;
const BD = DOCK + 3.4, HIT = BD + 3.0, AREA = BD + 7.0, UNIT = BD + 10.4, ATM = BD + 14.0, B1 = BD + 18.6;
const LIFT = B1 + 1.6, SD = B1 + 3.4, PRESS = SD + 0.6, DEN = SD + 9.2, B2 = DEN + 12.6, TAP = B2 + 1.6, LIT = B2 + 4.0, BACK = B2 + 8.6;
T.done = BACK + 5.4;
const INTRO = [T.card, DOCK];
const TICKS = [[HIT + 2.4, 0], [ATM + 2.4, 1], [SD + 4.6, 2], [DEN + 10.4, 3], [LIT + 3.0, 4]];
const DARK = [[BD, B1], [SD, B2]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [6.6, T.card, 'What does a gas do in its container?', [HKX, 0.9, 0.05]],
  [DOCK + 0.2, BD - 0.3, 'Look inside the balloon', [BLX, 0.86, 0.05]],
  [B1 + 0.3, SD - 0.2, 'Can we squeeze a gas?', [SYX, 0.6, 0.05]],
  [B2 + 0.3, TAP + 1.4, 'Open the gas tap', [TPX, 0.4, 0.05]],
  [BACK + 0.8, T.done, 'A gas pushes, squeezes, flows and is light ✓', [HKX, 0.9, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX, 0.38, 0.05], 2.2 * k, 1.0 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const P_BL = [BLX, 0.62, 0.0], P_SY = [SYX, 0.2, 0.0], P_TAP = [(TPX + BRX) / 2, 0.25, 0.05];
const near = (t, p, w = 0.8, h = 0.65, e) => S(t, p, w, h, ADIR, e);
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(DOCK + 1.8, P_BL, 0.6, 0.55), DIVE(BD - 0.05, P_BL),
  DK(BD, PX, 2.8, 2.3, 0.3), DK(BD + 1.8, PX, 2.8, 2.3, 1.04, 'out'), DK(B1 - 0.05, PX, 2.8, 2.3, 0.97),
  S(B1, P_BL, 0.1, 0.08, ADIR, 'out'), near(B1 + 1.2, [SYX + 0.05, 0.3, 0.05], 0.75, 0.7), near(LIFT + 1.2, P_SY, 0.4, 0.35), DIVE(SD - 0.05, P_SY),
  DK(SD, SX, 2.2, 2.2, 0.3), DK(SD + 1.4, SX, 2.2, 2.2, 1.04, 'out'), DK(DEN - 0.05, SX, 2.2, 2.2, 0.98),
  DK(DEN + 0.6, SX + 0.3, 4.5, 2.2, 1.02), DK(B2 - 0.05, SX + 0.3, 4.5, 2.2, 0.97),
  S(B2, P_SY, 0.1, 0.08, ADIR, 'out'), near(B2 + 1.3, P_TAP, 1.3, 0.8), near(BACK - 0.05, P_TAP, 1.25, 0.76), HK(BACK + 0.8, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '503', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;
    const fires = [], shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };

    // ================================================================ HOOK / BENCH · balloon, sealed syringe + weight, gas tap → burner
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', HKX, 2.5, 0.85);
      const bal = add(K.balloon(0xff8a80, 0.13), BLX, 0, 0);
      const sy = add(U5.syringe(0.36), SYX, 0, 0), wt = add(U5.weight(0.045, 0.05), WTX, 0, 0.04);
      const tap = add(U5.gasTap([BRX - TPX, 0]), TPX, 0, -0.06), brn = add(K.burner(), BRX, 0, -0.06); fires.push(brn.userData.flame); brn.userData.flame.scale.setScalar(0.6);
      const runner = add(K.glowSprite(0xffd27a, 0.08));
      const ls = [['a blown-up balloon', '#ffb0a8', BLX, 0.9, 0.08], ['a sealed syringe', '#ffffff', SYX, 0.5, 0.1], ['a gas tap and a burner', '#ffffff', (TPX + BRX) / 2, 0.42, 0.1]].map(([s, c, x, y, z]) => tag(s, 0.05, c, x, y, z));
      const lMob = [grp(tag('it flows along pipes: mobility ✓', 0.05, '#ffd27a', (TPX + BRX) / 2, 0.52, 0.1), 'mb'), grp(tag('(weak forces, empty spaces)', 0.042, '#ffd27a', (TPX + BRX) / 2, 0.44, 0.1), 'mb')];
      const W0 = V(WTX, 0, 0.04), W1 = V(SYX, 0.6, 0);
      beats.push((t) => {
        bal.userData.update(t);
        const after = t > DEN, u = t < SD || after ? 0 : ease(span(t, PRESS - 0.3, PRESS + 1.8)); sy.userData.set(u);   // weight off (DEN): the plunger springs back
        const top = V(SYX, sy.userData.top, 0), a = ease(span(t, LIFT, LIFT + 1.2));
        wt.position.copy(t < LIFT + 1.2 ? K.arc(W0, W1, 0.25, a) : W1.clone().lerp(top, easeIn(span(t, LIFT + 1.2, SD + 0.2))));
        if (t > SD) wt.position.copy(after ? W0 : top);
        tap.userData.set(ease(span(t, TAP, TAP + 0.4)));
        const c = tap.userData.curve, ru = span(t, TAP + 0.4, LIT); runner.visible = ru > 0 && ru < 1; if (runner.visible) runner.position.copy(c.getPoint(ru)).add(V(TPX, 0.02, -0.06));
        brn.userData.flame.visible = t > LIT;
        ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 2.0, 2.2 + i * 2.0)); lMob.forEach((l) => K.popIn(l, t, LIT + 0.6, BACK));
      });
    }

    // ================================================================ PUSH (dark) · inside the balloon: hits on the skin = pressure
    {
      U.stage((t) => t >= BD - 0.05 && t < B1 - 0.05); keyLight(PX);
      const RB = 0.95, C = V(PX, AY, 0), skin = add(U5.glassBall(RB, 0xff8a80), C.x, C.y, C.z);
      const sw = U5.swarm(26, { r: 0.055, color: 0x9fc4ff, w: 2, h: 2, d: 2, speed: 1.3 }); add(sw.g, C.x, C.y, C.z);
      const sparks = Array.from({ length: 26 }, () => add(K.glowSprite(0xffd27a, 0.16)));
      const PA = V(Math.cos(0.55), 0.15, Math.sin(0.55)).normalize().multiplyScalar(RB), sq = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([x, y]) => V(x * 0.18, y * 0.18, 0))), new THREE.LineBasicMaterial({ color: 0xffd27a }));
      sq.position.copy(PA).add(C); sq.lookAt(C.clone().add(PA.clone().multiplyScalar(2))); U.root.add(sq);
      const lIn = tag('air molecules inside the balloon', 0.05, '#9fc4ff', PX, AY - 1.05, 0.1), lHit = tag('each hit pushes the skin out: pressure ✓', 0.05, '#ffd27a', PX, AY - 1.05, 0.1);
      const lA = tag('force on each area: P = F / A', 0.055, '#ffd27a', PX, AY - 1.05, 0.1);
      const lU = [grp(tag('SI unit: N m⁻² = pascal (Pa)', 0.05, '#ffffff', PX, AY - 0.92, 0.1), 'un'), grp(tag('a bigger unit: kilopascal (kPa)', 0.045, '#ffffff', PX, AY - 1.1, 0.1), 'un')];
      const lT = [grp(tag('1 atm = 760 mm Hg = 760 torr', 0.05, '#ffffff', PX, AY - 0.92, 0.1), 'at'), grp(tag('= 101.325 kPa = 1.01325 × 10⁵ Pa ✓', 0.045, '#ffffff', PX, AY - 1.1, 0.1), 'at')];
      beats.push((t) => {
        const lt = t - BD; sw.place(lt, (i) => sw.ball(i, lt, V(0, 0, 0), RB - 0.08));
        sparks.forEach((s, i) => { const p = sw.ball(i, lt, V(0, 0, 0), RB - 0.08), near = p.length() > RB - 0.16; s.visible = t > HIT && near; s.position.copy(p.multiplyScalar(RB / Math.max(1e-3, p.length()))).add(C); });
        const sqk = span(t, AREA, AREA + 0.5); sq.visible = sqk > 0; sq.scale.setScalar(Math.max(1e-4, back(sqk)));
        K.popIn(lIn, t, BD + 0.5, HIT - 0.1); K.popIn(lHit, t, HIT + 0.4, AREA - 0.1); K.popIn(lA, t, AREA + 0.6, UNIT - 0.1);
        lU.forEach((l) => K.popIn(l, t, UNIT + 0.2, ATM - 0.1)); lT.forEach((l) => K.popIn(l, t, ATM + 0.2, B1));
      });
    }

    // ================================================================ SQUEEZE + DENSITY (dark) · inside the syringe, then three cubes of oxygen
    {
      U.stage((t) => t >= SD - 0.05 && t < B2 - 0.05); keyLight(SX);
      const W = 1.0, C = V(SX, AY - 0.1, 0), cyl = add(new THREE.Group(), C.x, C.y, C.z);
      cyl.add(U5.glassBox(W, 1.5, W)); const gas = U5.swarm(14, { r: 0.06, color: 0x9fc4ff, w: W, h: 1, d: W, speed: 1.0 }); cyl.add(gas.g);
      const piston = K.solid(new THREE.BoxGeometry(W - 0.03, 0.06, W - 0.03), M.matte(0x22252c, 0.6)); cyl.add(piston);
      const wt = K.solid(new THREE.CylinderGeometry(0.28, 0.28, 0.2, 32), M.metal(0x8d939b, 0.35)); cyl.add(wt);
      const lq = U5.swarm(30, { r: 0.06, color: 0x7fb0ff, w: W, h: W, d: W, gap: 0.16 }), sd = U5.swarm(27, { r: 0.06, color: 0xbcd8ff, w: W, h: W, d: W, gap: 0.2 });
      const cubes = [lq, sd].map((s) => { const g = add(new THREE.Group()); g.add(U5.glassBox(W, W, W)); g.add(s.g); return g; });
      const lE = tag('lots of empty space between them', 0.05, '#9fc4ff', SX, AY - 1.05, 0.1), lC = tag('pushed: closer, less volume ✓', 0.055, '#ffd27a', SX, AY - 1.05, 0.1);
      const lD = [grp(tag('compressibility: the change in volume', 0.045, '#ffffff', SX, AY - 0.92, 0.1), 'cp'), grp(tag('per unit change in pressure', 0.045, '#ffffff', SX, AY - 1.1, 0.1), 'cp')];
      const XS = [SX - 1.3, SX + 0.3, SX + 1.9], nm = ['O₂ gas', 'O₂ liquid', 'O₂ solid'], vs = ['0.00142', '1.149', '1.42 g/cm³'];
      const lN = nm.map((s, i) => grp(tag(s, 0.05, '#ffffff', XS[i], AY - 0.82, 0.1), 'nm')), lV = vs.map((s, i) => grp(tag(s, 0.05, '#ffd27a', XS[i], AY - 0.82, 0.1), 'vs'));
      const lR = [grp(tag('density = mass ÷ volume:', 0.05, '#ffd27a', SX + 0.3, AY - 0.86, 0.1), 'dn'), grp(tag('a gas is very light ✓', 0.055, '#ffd27a', SX + 0.3, AY - 1.12, 0.1), 'dn')];
      beats.push((t) => {
        const lt = t - SD, down = ease(span(t, PRESS + 0.2, PRESS + 1.8)) * (1 - ease(span(t, DEN, DEN + 1.0))), top = lerp(0.5, 0.0, down);
        const H0 = -0.5, hy = (top - H0) / 2, cy = H0 + hy;
        gas.place(lt, (i) => gas.gas(i, lt, V(0, cy, 0), W / 2, hy, W / 2));
        piston.position.y = top + 0.03 + 0.001;
        const land = easeIn(span(t, SD, PRESS)), lift = ease(span(t, DEN, DEN + 0.8));
        wt.position.y = lerp(1.6, top + 0.06 + 0.1 + 0.002, land) + 2.0 * lift; wt.visible = lift < 1;
        const mv = ease(span(t, DEN + 0.6, DEN + 1.8)); cyl.position.x = lerp(C.x, XS[0], mv);
        cubes.forEach((g, i) => { const v = ease(span(t, DEN + 1.0 + 0.4 * i, DEN + 2.4 + 0.4 * i)); g.visible = t > DEN + 0.9; g.position.set(lerp(XS[i + 1] + 3.5, XS[i + 1], v), AY - 0.1, 0); });
        lq.place(lt, (i) => lq.liquid(i, lt).add(V(0, 0.0, 0))); sd.place(lt, (i) => sd.solid(i, lt));
        K.popIn(lE, t, SD + 0.2, PRESS + 1.6); K.popIn(lC, t, PRESS + 2.0, SD + 5.4); lD.forEach((l) => K.popIn(l, t, SD + 5.6, DEN - 0.1));
        lN.forEach((l) => K.popIn(l, t, DEN + 2.8, DEN + 5.2)); lV.forEach((l) => K.popIn(l, t, DEN + 5.4, DEN + 8.6)); lR.forEach((l) => K.popIn(l, t, DEN + 8.8, B2));
      });
    }
    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'What does a gas do in its container?', dockTitle: 'A gas', intro: INTRO, ticks: TICKS,
      rows: [[0, 'a balloon, a sealed syringe, a gas tap'], [1, 'hits the walls: pressure P = F / A'], [1, 'units: Pa, kPa, 1 atm = 760 mm Hg'], [1, 'can be squeezed: compressible'], [1, 'very light: low density'], [1, 'flows along pipes: mobility']],
      short: ['pressure', 'units', 'compressible', 'low density', 'mobility'] }));
    return U.finish();
  },
};
