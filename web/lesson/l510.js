// Lesson 510 · The Solid State (book pp. 141–142: Solid state, 5.4 Typical properties of solids (i) volume and shape,
// (ii) melting point (definition, constant temperature, depends on the forces, a purity test, solid ⇌ liquid),
// (iii) rigidity, (iv) density; Scientific Information: the 9-row comparison table). v1 as a code lesson (2026-11-04),
// replacing the old Blender film. SKILL.md §0 + §1 + §4.
// THE QUESTION: "Why does a solid keep its shape?" → card, docked panel, five ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a steel block with a heavy weight above it, ice in a beaker with a thermometer over a burner
//         (named one at a time) · the question → card · the weight is lowered onto the steel: nothing changes → dive
//         INTO the steel.
//  INSIDE (dark) the particles in rows, a fixed pattern "packed in a fixed pattern, held tight" · they only shake "they
//         only vibrate: no moving about (no diffusion) ✓" · gold arrows: the weight pushes, not one particle moves
//         "the weight pushes: nothing gives: rigid ✓" · "definite shape and volume" · a box of liquid and a box of gas
//         slide in beside it "no empty spaces: denser than liquids and gases ✓".
//  MELT   back on the table: the burner is lit; the thermometer climbs −5 → 0 °C "0 °C: the ice starts to melt" · the
//         ice shrinks, the water rises, the red column stays "still 0 °C while ice is left ✓" · all melted, it climbs
//         again "melting point: solid ↔ liquid · each pure solid its own: a purity test ✓".
//  END    "Held tight in a fixed pattern: a solid keeps its shape ✓".
// Game (🎮 Matter Practice › Words + Facts; 🎮 State Sorter, docs/COVERAGE_U5.md): the full 9-row comparison table (mass … intermolecular force).
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U5.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
import * as U5 from './u5kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, SBX = HKX - 0.45, BKX = HKX + 0.45;
const SX = 40;

// ---------------------------------------------------------------- time
const T = { card: 7.2 };
const DOCK = T.card + 5.0;
const PRESS = DOCK + 0.6, ID = DOCK + 3.4, VIB = ID + 3.8, PUSH = ID + 7.2, DEN = ID + 14.4, B1 = ID + 19.8, END = B1 + 15.8;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[VIB + 2.2, 0], [PUSH + 5.8, 1], [DEN + 3.6, 2], [B1 + 8.6, 3], [B1 + 14.2, 4]];
const DARK = [[ID, B1]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [4.3, T.card, 'Why does a solid keep its shape?', [HKX, 0.8, 0.05]],
  [DOCK + 1.8, ID - 0.3, 'Look inside the steel', [SBX, 0.42, 0.05]],
  [END + 0.4, T.done, 'Held tight in a fixed pattern: a solid keeps its shape ✓', [HKX, 0.8, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX, 0.48, 0.05], 1.8 * k, 1.15 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const near = (t, p, w = 0.8, h = 0.65, e) => S(t, p, w, h, ADIR, e);
const P_SB = [SBX, 0.12, 0.09], P_BK = [BKX + 0.03, 0.62, 0.05];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(DOCK + 0.4, [SBX, 0.25, 0.05], 0.65, 0.6), near(ID - 1.2, P_SB, 0.32, 0.26), DIVE(ID - 0.05, P_SB),
  DK(ID, SX, 2.4, 2.2, 0.3), DK(ID + 1.8, SX, 2.4, 2.2, 1.04, 'out'), DK(DEN - 0.05, SX, 2.4, 2.2, 0.98), DK(DEN + 0.6, SX + 1.75, 5.3, 2.2, 1.02), DK(B1 - 0.05, SX + 1.75, 5.3, 2.2, 0.97),
  S(B1, P_SB, 0.1, 0.08, ADIR, 'out'), near(B1 + 1.6, P_BK, 0.75, 1.05), near(END - 0.05, P_BK, 0.72, 1.0), HK(END + 0.4, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '510', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;
    const fires = [], shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };

    // ================================================================ BENCH · a steel block and a weight · ice over a burner
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', HKX, 1.8, 0.8);
      const block = add(K.solid(new THREE.BoxGeometry(0.2, 0.16, 0.2), M.metal(0xa8aeb6, 0.32)), SBX, 0.08, 0);
      const wt = add(U5.weight(0.08, 0.09), SBX + 0.26, 0, 0.04);
      const brn = add(K.burner(), BKX, 0, 0); fires.push(brn.userData.flame); brn.userData.flame.scale.setScalar(0.45);
      add(K.tripod(0.56), BKX, 0, 0); add(K.labBeaker(0.11, 0.22), BKX, 0.56, 0); const bw = add(K.liquid(0.105, 0.04, 0x3d9ee6, 0.55), BKX, 0.612, 0);
      const iceM = new THREE.MeshPhysicalMaterial({ color: 0xe8f6ff, roughness: 0.08, transmission: 0.6, thickness: 0.05, transparent: true, opacity: 0.88, clearcoat: 1 });
      const ice = [[-0.04, -0.03, 0.3], [0.04, 0.0, -0.4], [-0.01, 0.045, 0.9]].map(([x, z, r]) => { const c = add(K.solid(new THREE.BoxGeometry(0.06, 0.05, 0.06), iceM), BKX + x, 0.652 + 0.006 * [-0.04, 0.04, -0.01].indexOf(x), z); c.rotation.y = r; return c; });
      const th = add(K.thermometer(0.42, 100), BKX + 0.06, 0.6, 0.03); th.rotation.z = -0.12;
      const ls = [['a steel block, a heavy weight', '#ffffff', SBX, 0.66, 0.1], ['ice, a thermometer, a burner', '#e8f6ff', BKX, 1.05, 0.08]].map(([s, c, x, y, z]) => tag(s, 0.045, c, x, y, z));
      const lN = tag('nothing changes', 0.05, '#ffffff', SBX, 0.42, 0.1);
      const top = V(BKX + 0.05, 1.02, 0.08), r1 = tag('0 °C: the ice starts to melt', 0.045, '#e8f6ff', top.x, top.y, top.z), r2 = tag('still 0 °C while ice is left ✓', 0.05, '#ffd27a', top.x, top.y, top.z);
      const r3 = [grp(tag('melting point: solid ↔ liquid', 0.045, '#ffd27a', top.x, top.y + 0.04, top.z), 'mp'), grp(tag('each pure solid its own: a purity test ✓', 0.042, '#ffd27a', top.x, top.y - 0.04, top.z), 'mp')];
      beats.push((t) => {
        { const a = ease(span(t, PRESS - 0.4, PRESS + 0.5)), d = easeIn(span(t, PRESS + 0.5, PRESS + 0.9)); wt.position.copy(K.arc(V(SBX + 0.26, 0, 0.04), V(SBX, 0.36, 0), 0.1, a)); if (a >= 1) wt.position.y = lerp(0.36, 0.161, d); }   // lifted over the block, let go: it lands dead block.position.y = 0.08 - 0.003 * bump(t, PRESS + 0.8, 0.3) * 0;   // it lands and stops dead: the steel does not give
        brn.userData.flame.visible = t > B1 + 0.8;
        const c = t < B1 + 3.4 ? lerp(-5, 0, ease(span(t, B1 + 1.2, B1 + 3.4))) : t < B1 + 11.4 ? 0 : lerp(0, 8, ease(span(t, B1 + 11.4, B1 + 13.0))); th.userData.set(Math.max(0, c) + 0.001);
        const m = ease(span(t, B1 + 3.4, B1 + 11.4)); ice.forEach((q, i) => { const s = Math.max(1e-3, 1 - m * (1 + 0.15 * i)); q.scale.setScalar(Math.max(1e-3, s)); q.visible = s > 0.02; q.position.y = 0.612 + 0.04 + 0.006 * i + 0.05 * m - 0.02 * (1 - s); });
        bw.scale.y = 1 + 1.4 * m; bw.userData.top.position.y = 0.04;
        ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 1.9, 2.2 + i * 1.9)); K.popIn(lN, t, PRESS + 1.0, ID - 1.4);
        K.popIn(r1, t, B1 + 3.6, B1 + 6.2); K.popIn(r2, t, B1 + 6.4, B1 + 11.4); r3.forEach((l) => K.popIn(l, t, B1 + 11.8, END));
      });
    }

    // ================================================================ INSIDE (dark) · a fixed pattern that only vibrates; rigid; densest
    {
      U.stage((t) => t >= ID - 0.05 && t < B1 - 0.05); keyLight(SX); keyLight(SX + 2.8);
      const NX = 6, NY = 5, NZ = 3, P = 0.28, N = NX * NY * NZ;
      const lat = Array.from({ length: N }, (_, i) => V((i % NX - (NX - 1) / 2) * P, (Math.floor(i / NX) % NY - (NY - 1) / 2) * P, (Math.floor(i / (NX * NY)) - (NZ - 1) / 2) * P));
      const sol = U5.swarm(N, { r: 0.1, color: 0xa8b4c8, w: 2, h: 2, d: 2, glow: 0.15 }); add(sol.g, SX, AY, 0);
      const plate = add(K.solid(new THREE.BoxGeometry(1.9, 0.12, 1.0), M.metal(0x8d939b, 0.35)), SX, AY + (NY - 1) / 2 * P + 0.1 + 0.06 + 0.002, 0);
      const arrows = [-0.6, 0, 0.6].map((x) => { const m = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.18, 12), M.glow(0xffc04d, 1.6)); m.rotation.z = Math.PI; m.position.set(SX + x, AY + 1.0, 0.3); U.root.add(m); return m; });
      const W = 1.3, H = 1.4, D = 0.8, LQ = V(SX + 1.9, AY, 0), GS = V(SX + 3.5, AY, 0);
      const boxL = add(U5.glassBox(W, H, D), 0, AY, 0), boxG = add(U5.glassBox(W, H, D), 0, AY, 0);
      const lq = U5.swarm(30, { r: 0.08, color: 0x7fb0ff, w: W, h: H, d: D, gap: 0.2 }), gs = U5.swarm(10, { r: 0.08, color: 0xbcd8ff, w: W, h: H, d: D, speed: 1.0 }); boxL.add(lq.g); boxG.add(gs.g);
      const l1 = tag('packed in a fixed pattern, held tight', 0.05, '#ffffff', SX, AY - 1.1, 0.1), l2 = [grp(tag('they only vibrate:', 0.05, '#ffd27a', SX, AY - 1.0, 0.1), 'v'), grp(tag('no moving about (no diffusion) ✓', 0.048, '#ffd27a', SX, AY - 1.2, 0.1), 'v')];
      const l3 = tag('the weight pushes: nothing gives: rigid ✓', 0.048, '#ffd27a', SX, AY - 1.1, 0.1), l4 = tag('definite shape and volume ✓', 0.055, '#ffffff', SX, AY - 1.1, 0.1);
      const l5 = [grp(tag('no empty spaces:', 0.05, '#ffd27a', SX + 1.75, AY - 1.0, 0.1), 'd'), grp(tag('denser than liquids and gases ✓', 0.05, '#ffd27a', SX + 1.75, AY - 1.2, 0.1), 'd')];
      const nm = [['solid', SX], ['liquid', LQ.x], ['gas', GS.x]].map(([s, x]) => grp(tag(s, 0.05, '#ffffff', x, AY + 1.0, 0.1), 'nm'));
      beats.push((t) => {
        const lt = t - ID, k = t < VIB ? 0.4 : 1.2;
        sol.place(lt, (i) => lat[i].clone().add(V(Math.sin(lt * 21 + i), Math.sin(lt * 17 + 2 * i), Math.sin(lt * 19 + 3 * i)).multiplyScalar(0.012 * k)));
        arrows.forEach((a, j) => { a.visible = t > PUSH && t < DEN; a.position.y = AY + 1.05 + 0.05 * Math.sin(t * 5 + j); });
        const v = ease(span(t, DEN, DEN + 1.2)); boxL.position.x = lerp(LQ.x + 4, LQ.x, v); boxG.position.x = lerp(GS.x + 5, GS.x, ease(span(t, DEN + 0.3, DEN + 1.5))); boxL.visible = boxG.visible = t > DEN - 0.1;
        lq.place(lt, (i) => lq.liquid(i, lt)); gs.place(lt, (i) => gs.gas(i, lt));
        K.popIn(l1, t, ID + 0.6, VIB - 0.1); l2.forEach((l) => K.popIn(l, t, VIB + 0.2, PUSH - 0.1)); K.popIn(l3, t, PUSH + 1.0, PUSH + 4.2); K.popIn(l4, t, PUSH + 4.4, DEN - 0.1);
        nm.forEach((l) => K.popIn(l, t, DEN + 1.6, DEN + 3.4)); l5.forEach((l) => K.popIn(l, t, DEN + 3.6, B1));
      });
    }
    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Why does a solid keep its shape?', dockTitle: 'A solid', intro: INTRO, ticks: TICKS,
      rows: [[0, 'a steel block, a weight, ice and a burner'], [1, 'a fixed pattern: they only vibrate'], [1, 'rigid: definite shape and volume'], [1, 'no empty spaces: the densest'], [1, 'melting: the temperature stays'], [1, 'melting point: a purity test']],
      short: ['fixed pattern', 'rigid', 'densest', 'melting: 0 °C stays', 'melting point'] }));
    return U.finish();
  },
};
