// Lesson 615 · Suspensions & the Three Mixtures (book pp. 175–176: 6.6.3 suspension (turbidity): a heterogeneous
// mixture; large particles seen with the naked eye; they settle (sedimentation), the clear liquid can be decanted; they
// stay on filter paper; mud, sand, chalk water; Fig. 6.13; medicines (antacid, antibiotic, paracetamol): shake before
// use; Table 6.2 properties; Fig. 6.14 salt water, milk in water, flour in water). v1 as a code lesson (2026-11-04).
// THE QUESTION: "Salt water, milk, flour water: how do we tell a solution, a colloid and a suspension apart?" → six ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: three glasses (salt in water, milk in water, flour in water) with a stirring rod, three funnels
//         over three flasks, a torch, a bottle of antacid (named one at a time) · question → card.
//  STAND  all three stirred; "an hour later": the flour falls to the bottom, the water above clears "flour: it settles
//         (sedimentation) ✓", salt water and milk do not change · the clear top of the flour water is poured off "the
//         clear liquid is decanted" → dive (dark): three boxes: tiny ions (0.01–1 nm), middle-sized particles (1–1000
//         nm) that stay up, big lumps (over 1000 nm) that sink "solution · colloid · suspension: by particle size ✓".
//  FILTER the three are poured through filter papers: salt and milk run through, the paper stays white; flour stays
//         on the paper "only the suspension stays on the paper ✓".
//  LIGHT  the torch beam: salt water nothing, milk a bright path, flour cloudy "solution: no scatter · colloid: Tyndall
//         · suspension: scatters but is not transparent ✓" · "a solution is homogeneous; colloids and suspensions are
//         heterogeneous".
//  MEDS   the antacid bottle: it settles, it is shaken "medicines that are suspensions: shake before use ✓".
//  END    "Size decides: solution, colloid or suspension ✓".
// Game (🎮 Mixture Sorter, docs/COVERAGE_U6.md): Table 6.2 row by row, more everyday mixtures (Short Q iii).
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
const GX = [-0.95, -0.6, -0.25], FX = [0.15, 0.45, 0.75], TRX = -1.35, MDX = 1.28;
const DX = 40;
const COL = [0x6fb0f0, 0xfbfaf6, 0xc8b490], OP = [0.35, 1.0, 0.97];

// ---------------------------------------------------------------- time
const T = { card: 11.0 };
const DOCK = T.card + 5.0;
const SD = DOCK + 0.4, ID = SD + 12.6, B1 = ID + 9.6, FI = B1, LI = FI + 11.6, MD = LI + 11.0, END = MD + 6.6;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[SD + 8.0, 0], [ID + 8.0, 1], [FI + 10.0, 2], [LI + 7.6, 3], [LI + 10.4, 4], [MD + 5.0, 5]];
const DARK = [[ID, B1]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [8.6, T.card, 'Salt water, milk, flour water: how do we tell them apart?', [0, 0.6, 0.05]],
  [SD + 0.2, SD + 1.8, 'Stir all three, then wait', [GX[1], 0.42, 0.05]],
  [SD + 11.4, ID - 0.2, 'Why does only the flour sink?', [GX[2], 0.38, 0.05]],
  [FI + 0.3, FI + 2.0, 'Pour each through filter paper', [FX[1], 0.6, 0.05]],
  [LI + 0.2, LI + 2.0, 'Shine the torch through all three', [GX[1], 0.42, 0.05]],
  [END + 0.4, T.done, 'Size decides: solution, colloid or suspension ✓', [0, 0.6, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [-0.12, 0.26, 0.05], 2.8 * k, 0.8 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const near = (t, p, w = 0.8, h = 0.65, e) => S(t, p, w, h, ADIR, e);
const P_G = [GX[1], 0.2, 0.05], P_IN = [GX[2], 0.06, 0.0], P_F = [(GX[2] + FX[2]) / 2, 0.3, 0.05], P_L = [(TRX + GX[2]) / 2 + 0.1, 0.18, 0.05], P_M = [MDX, 0.16, 0.05];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(SD, P_G, 1.0, 0.55), near(SD + 11.2, P_G, 0.97, 0.53), near(SD + 12.0, P_IN, 0.22, 0.2), DIVE(ID - 0.05, P_IN),
  DK(ID, DX, 4.8, 2.0, 0.3), DK(ID + 1.8, DX, 4.8, 2.0, 1.04, 'out'), DK(B1 - 0.05, DX, 4.8, 2.0, 0.97),
  S(B1, P_IN, 0.5, 0.45, ADIR, 'out'), near(FI + 1.0, P_F, 1.35, 0.75), near(LI - 0.05, P_F, 1.3, 0.72), near(LI + 0.4, P_L, 1.3, 0.55), near(MD - 0.05, P_L, 1.26, 0.53),
  near(MD + 0.4, P_M, 0.45, 0.45), near(END - 0.05, P_M, 0.43, 0.43), HK(END + 0.4, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '615', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;

    // ================================================================ BENCH
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', -0.12, 3.2, 0.8);
      const cloudy = (l, c, o) => l.children.forEach((m) => { m.material = new THREE.MeshStandardMaterial({ color: c, roughness: 0.6, emissive: c, emissiveIntensity: 0.25, transparent: o < 0.99, opacity: o }); });   // milk and flour water are cloudy, not see-through
      const gl = GX.map((x, i) => { const g = add(new THREE.Group(), x, 0, 0); g.add(K.labBeaker(0.07, 0.17)); const l = K.liquid(0.065, 0.12, COL[i], OP[i]); l.position.y = 0.012; g.add(l); if (i) cloudy(l, COL[i], OP[i]); return { g, l }; });
      const sed = add(K.liquid(0.065, 0.022, 0xe8e0d0, 0.98), GX[2], 0.013, 0); sed.visible = false;
      const fl = FX.map((x) => add(U5.conicalFlask(0.08, 0.22, 0.02, 0x6fb0f0), x, 0, 0)), fu = FX.map((x) => add(U6.filterFunnel(0.07), x, 0.2, 0));
      const filt = FX.map((x, i) => { const c = add(K.liquid(0.062, 0.05, i === 2 ? 0x9cc8f4 : COL[i], i === 2 ? 0.4 : OP[i]), x, 0.014, 0); if (i === 1) cloudy(c, COL[1], OP[1]); c.visible = false; return c; });
      const blk = add(K.solid(new THREE.BoxGeometry(0.2, 0.05, 0.08), M.matte(0x5a4632, 0.7)), TRX, 0.025, 0), tr = add(U6.torch(), TRX, 0.051, 0);
      const bms = [0, 1, 2, 3, 4, 5].map(() => add(U6.beam()));
      const md = add(new THREE.Group(), MDX, 0, 0); md.add(K.reagentBottle(0xf4f0e8, 0.18, 0.045, 'antacid: shake well')); const mdl = md.children[0];
      const st = add(U6.stream(0xd8d0c0)), pours = GX.map((x, i) => U6.pourer(gl[i].g, V(x, 0, 0), null, V(FX[i], 0.2 + 0.15, 0), V(0.075, 0.17, 0), st, { dur: 1.3, side: -1 }));
      const ls = [['salt water · milk in water · flour in water', '#ffffff', GX[1], 0.34, 0.1], ['three funnels with filter paper', '#ffffff', FX[1], 0.46, 0.05], ['a torch', '#ffffff', TRX, 0.14, 0.1], ['an antacid medicine', '#ffffff', MDX, 0.3, 0.08]].map(([s, c, x, y, z]) => tag(s, 0.042, c, x, y, z));
      const say = (a, b, x, y, t0, t1, g) => ({ l: [grp(tag(a, 0.042, '#ffffff', x, y + 0.035, 0.1), g), ...(b ? [grp(tag(b, 0.045, '#ffd27a', x, y - 0.03, 0.1), g)] : [])], t0, t1 });
      const lH = tag('an hour later', 0.05, '#ffffff', GX[1], 0.32, 0.1);
      const SAY = [
        say('flour: it settles', '(sedimentation) ✓', GX[1] + 0.12, 0.36, SD + 6.4, SD + 8.4, 'sd'), say('salt water and milk: no change', null, GX[1], 0.36, SD + 8.6, SD + 9.6, 'nc'),
        say('the clear top is poured off:', 'decanted', GX[1] + 0.12, 0.36, SD + 9.8, SD + 11.2, 'dc'),
        say('salt, milk: run through, paper white', 'flour stays on it: a suspension ✓', P_F[0], 0.56, FI + 7.2, LI, 'fi'),
        say('solution: no scatter · colloid: Tyndall', 'suspension: scatters, not transparent ✓', P_L[0], 0.34, LI + 4.6, LI + 7.8, 'li'),
        say('a solution: homogeneous', 'colloids, suspensions: heterogeneous', P_L[0], 0.34, LI + 8.0, MD, 'he'),
        say('medicines that are suspensions:', 'shake before use ✓', MDX, 0.34, MD + 3.2, END, 'md'),
      ];
      const rod = add(U6.stirRod(0.3), GX[0] - 0.14, 0, 0.06); rod.rotation.z = 0.3;
      const tint = (g, c, o) => g.children.forEach((m, j) => { m.material.color.copy(c); if (j) m.material.color.lerp(new THREE.Color(0xffffff), 0.2); m.material.opacity = o + (j ? 0.1 : 0); });
      beats.push((t) => {
        // stirring the three, one after another
        const k = Math.floor((t - SD - 1.0) / 1.2); if (t > SD + 1.0 && t < SD + 4.6 && k >= 0 && k < 3) { rod.position.set(GX[k] + 0.03 * Math.cos(t * 7), 0.03, 0.03 * Math.sin(t * 7)); rod.rotation.z = 0.15; } else { rod.position.set(GX[0] - 0.14, 0, 0.06); rod.rotation.z = 0.3; }
        // the flour settles: a white layer grows at the bottom, the water above clears; then the clear top is decanted
        const se = ease(span(t, SD + 5.0, SD + 6.6)); sed.visible = se > 0.01 && t < FI + 1.0; sed.scale.y = Math.max(1e-3, se); tint(gl[2].l, new THREE.Color(COL[2]).lerp(new THREE.Color(0xb8d4f0), se), lerp(0.75, 0.3, se));
        if (t < FI) gl[2].l.scale.y = 1 - 0.4 * ease(span(t, SD + 10.0, SD + 11.0));
        // filtering: each glass is poured into its funnel
        GX.forEach((x, i) => { const t0 = FI + 1.4 + 1.9 * i, f = t > t0 ? pours[i](t, t0) : 0; if (t > t0 && t < LI) { gl[i].l.scale.y = Math.max(1e-3, (i === 2 ? 0.6 : 1) * (1 - f)); } filt[i].visible = f > 0.05 && t < LI; filt[i].scale.y = Math.max(1e-3, f); if (i === 2) fu[2].userData.stain(0xe8e0d0, f * (t < LI ? 1 : 0)); });
        if (t >= LI) { gl.forEach((g, i) => { g.l.scale.y = 1; }); tint(gl[2].l, new THREE.Color(COL[2]), OP[2]); }
        // the torch
        const on = span(t, LI + 2.0, LI + 2.4) * (t < MD ? 1 : 0); tr.userData.set(on);
        const by = 0.074, p = (x) => [V(x - 0.075, by, 0), V(x + 0.075, by, 0)], L0 = V(TRX + 0.12, by, 0), [a0, a1] = p(GX[0]), [b0, b1] = p(GX[1]), [c0, c1] = p(GX[2]);
        bms[0].userData.set(L0, a0, 0.12 * on); bms[1].userData.set(a0, a1, 0.12 * on); bms[2].userData.set(a1, b0, 0.12 * on); bms[3].userData.set(b0, b1, 0.85 * on); bms[4].userData.set(b1, c0, 0.08 * on); bms[5].userData.set(c0, c1, 0.4 * on);
        // the medicine: shaken
        const sh = t > MD + 1.0 && t < MD + 3.0 ? Math.sin((t - MD) * 22) * 0.18 : 0; md.rotation.z = sh; md.position.y = t > MD + 0.6 && t < MD + 3.4 ? 0.08 : 0;
        ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 1.8, 2.0 + i * 1.8)); K.popIn(lH, t, SD + 4.8, SD + 6.2); SAY.forEach(({ l, t0, t1 }) => l.forEach((x) => K.popIn(x, t, t0, t1)));
      });
    }

    // ================================================================ INSIDE (dark) · three sizes
    {
      U.stage((t) => t >= ID - 0.05 && t < B1 - 0.05); keyLight(DX);
      const XS = [DX - 1.6, DX, DX + 1.6], W = 1.1, H = 1.2, D = 0.7;
      XS.forEach((x) => add(U5.glassBox(W, H, D), x, AY, 0));
      const a = U5.swarm(16, { r: 0.022, color: 0x8c6fd8, w: W, h: H, d: D, speed: 0.6 }), b = U5.swarm(8, { r: 0.07, color: 0xf4f2ec, w: W, h: H, d: D, speed: 0.15 }), c = U5.swarm(5, { r: 0.15, color: 0xd8d0c0, w: W, h: H, d: D }); add(a.g, XS[0], AY, 0); add(b.g, XS[1], AY, 0); add(c.g, XS[2], AY, 0);
      const nm = [['salt: < 1 nm', XS[0], 0.78], ['milk: 1–1000 nm', XS[1], -0.74], ['flour: > 1000 nm', XS[2], 0.78]].map(([s, x, y]) => grp(tag(s, 0.042, '#ffffff', x, AY + y, 0.1), 'nm'));
      const l1 = [grp(tag('solution · colloid · suspension:', 0.048, '#ffd27a', DX, AY - 0.92, 0.1), 'sz'), grp(tag('told apart by particle size ✓', 0.05, '#ffd27a', DX, AY - 1.12, 0.1), 'sz')];
      beats.push((t) => { const lt = t - ID; a.place(lt, (i) => a.gas(i, lt)); b.place(lt, (i) => b.gas(i, lt)); const fall = ease(span(t, ID + 2.0, ID + 4.6)); c.place(lt, (i) => c.gas(i, lt).lerp(V(-0.35 + 0.17 * i, -H / 2 + 0.16, (i % 2 - 0.5) * 0.2), fall)); nm.forEach((l) => K.popIn(l, t, ID + 0.6, ID + 4.8)); l1.forEach((l) => K.popIn(l, t, ID + 5.0, B1)); });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Salt water, milk, flour water: how do we tell them apart?', dockTitle: 'Three mixtures', intro: INTRO, ticks: TICKS,
      rows: [[0, 'salt water, milk, flour water, filters, a torch'], [1, 'flour settles: sedimentation, decanting'], [1, 'by particle size: < 1 · 1–1000 · > 1000 nm'], [1, 'only a suspension stays on filter paper'], [1, 'the torch: none · Tyndall · cloudy'], [1, 'homogeneous or heterogeneous'], [1, 'suspension medicines: shake before use']],
      short: ['settles', 'particle size', 'filter', 'the torch', 'homogeneous?', 'shake medicines'] }));
    return U.finish();
  },
};
