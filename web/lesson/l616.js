// Lesson 616 · Key Points: Solutions (book pp. 177–178, every Key Point in the printed order). v1 as a code lesson
// (2026-11-04), replacing the old Blender film. SKILL.md: key points reprise the familiar pictures of lessons 601–615
// (the same dissolving swarm, boxes, beam), one line each, no new model.
// THE QUESTION: "What did we learn about solutions?" → card, docked panel, five ticks.
// BEAT SHEET (one station per point, cut from one to the next)
//   1 sugar spreads evenly "a solution: a homogeneous mixture"          2 the same in water "aqueous: dissolved in water"
//   3 gold few, blue many "solute: the smaller part"                    4 "solvent: the larger part"
//   5 a heap stays on the bottom "saturated: no more dissolves"         6 it all dissolves "unsaturated: more can dissolve"
//   7 heated, more dissolves "supersaturated: more than saturated"      8 3 × 3 grid "nine types of solution"
//   9 two boxes few / many "concentration: solute in a given amount"   10 "dilute: a little solute"   11 "concentrated: a lot"
//  12 10 gold of 100 "percentage: parts in 100 of solution"            13 ions ringed by water "water: the universal solvent"
//  14 gold balls in a 1 dm³ cube "molarity: moles per dm³"             15 the heap and 100 g "solubility: grams in 100 g"
//  16 two layers / one liquid "immiscible · completely miscible"       17 a beam through particles "colloids: 1–1000 nm, Tyndall"
//  18 lumps sink "suspension: heterogeneous, big particles · sedimentation"
// Game (🎮 Mixture Sorter + Solution Lab + Molarity Lab, docs/COVERAGE_U6.md): every point as a recall round.
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U6.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
import * as U5 from './u5kit.js';
import * as U6 from './u6kit.js';
const { M, span, ease, lerp } = K;
const { V, DDIR } = U4;

const AY = 1.9, X0 = 40, GAP = 12, DUR = 5.4, T0 = 7.4, N = 18;
const INTRO = [2.0, 7.0];
const at = (i) => T0 + i * DUR, sx = (i) => X0 + i * GAP;
const TICKS = [[at(3) + 4, 0], [at(6) + 4, 1], [at(10) + 4, 2], [at(14) + 4, 3], [at(17) + 4, 4]];
const DONE = at(N) + 4.0;
const S = U4.shots(INTRO[1]);
const DK = (t, x, w, h, k = 1) => S(t, [x, AY, 0], w * k, h * k, DDIR);
const W = [3.0, 3.0, 3.0, 3.0, 2.4, 2.4, 2.4, 3.0, 3.4, 2.4, 2.4, 2.6, 2.6, 2.4, 2.6, 3.2, 3.0, 2.6];
const CAMS = [DK(0, sx(0), 3.0, 2.2, 1.04), DK(T0 - 0.05, sx(0), 3.0, 2.2, 1.0), ...Array.from({ length: N }, (_, i) => [DK(at(i), sx(i), W[i], 2.2, 1.04), DK(at(i) + DUR - 0.05, sx(i), W[i], 2.2, 0.98)]).flat(), DK(DONE, sx(N - 1), W[N - 1], 2.2, 0.97)];

export default {
  duration: DONE,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions: [[0.2, 2.0, 'What did we learn about solutions?', [sx(0), AY + 1.0, 0]]],
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '616', { dark: () => true, AY }), { beats, add, tag, grp, keyLight } = U;
    const station = (i, f) => { U.stage((t) => (i === 0 ? t < at(1) - 0.05 : t >= at(i) - 0.05 && t < (i === N - 1 ? 1e9 : at(i + 1) - 0.05))); keyLight(sx(i)); const up = f(sx(i)); beats.push((t) => up(t - at(i), t)); };
    const say = (i, a, b, c = '#ffd27a') => { const g = 's' + i, l = b ? [grp(tag(a, 0.05, c, sx(i), AY - 0.86, 0.1), g), grp(tag(b, 0.05, c, sx(i), AY - 1.04, 0.1), g)] : [tag(a, 0.052, c, sx(i), AY - 0.95, 0.1)]; beats.push((t) => l.forEach((x) => K.popIn(x, t, Math.max(T0, at(i)) + 0.3, at(i) + DUR - 0.1))); };
    const box = (x, y, w, h, d = 0.8) => add(U5.glassBox(w, h, d), x, y, 0);
    const solution = (i, ns = 40, nu = 12, u0 = 0.4, u1 = 3.6) => station(i, (x) => { box(x, AY, 2.4, 1.4); const dz = U6.dissolver({ w: 2.4, h: 1.4, d: 0.8, ns, nu, from: V(0, -0.5, 0) }); add(dz.g, x, AY, 0); return (lt) => dz.place(lt, ease(span(lt, u0, u1))); });
    const heap = (i, k0, k1, warm = false) => station(i, (x) => { box(x, AY, 1.6, 1.4); const dz = U6.dissolver({ w: 1.6, h: 1.4, d: 0.8, ns: 24, nu: 18, from: V(0, -0.55, 0) }); add(dz.g, x, AY, 0); const gl = warm ? add(K.glowSprite(0xff6a2a, 1.4), x, AY - 1.0, 0.2) : null; return (lt) => dz.place(lt, lerp(k0, k1, ease(span(lt, 0.4, 3.4)))); });

    solution(0); say(0, 'a solution: a homogeneous mixture', 'of two or more substances', '#ffffff');
    solution(1); say(1, 'aqueous solution: a substance', 'dissolved in water');
    solution(2, 40, 8, 0, 0.01); say(2, 'solute: the part present', 'in the smaller amount (gold)');
    solution(3, 40, 8, 0, 0.01); say(3, 'solvent: the part present', 'in the larger amount (blue)', '#9fd2ff');
    heap(4, 0.55, 0.55); say(4, 'saturated: cannot dissolve', 'any more at that temperature');
    heap(5, 0, 1); say(5, 'unsaturated: can dissolve', 'more at that temperature');
    heap(6, 0.55, 1, true); say(6, 'supersaturated: more solute', 'than needed to saturate it');
    station(7, (x) => { const S3 = ['gas', 'liquid', 'solid'], C3 = ['#cfd6e0', '#9fc8ff', '#ffd27a'], L = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) L.push(grp(tag(`${S3[c]} in ${S3[r]}`, 0.036, C3[r], x + (c - 1) * 1.05, AY + 0.5 - r * 0.32, 0.1), "g9")); return (lt, t) => L.forEach((l) => K.popIn(l, t, at(7) + 0.1, at(7) + 3.0)); });   // the 3 × 3 grid
    { const l = [grp(tag('three states × three states:', 0.05, '#ffd27a', sx(7), AY - 0.86, 0.1), 's7'), grp(tag('nine types of solution', 0.05, '#ffd27a', sx(7), AY - 1.04, 0.1), 's7')]; beats.push((t) => l.forEach((x) => K.popIn(x, t, at(7) + 3.1, at(8) - 0.1))); }
    station(8, (x) => { box(x - 0.85, AY, 1.4, 1.4); box(x + 0.85, AY, 1.4, 1.4); const a = U5.swarm(4, { r: 0.07, color: 0xffc04d, w: 1.4, h: 1.4, d: 0.8, speed: 0.3 }), b = U5.swarm(16, { r: 0.07, color: 0xffc04d, w: 1.4, h: 1.4, d: 0.8, speed: 0.3 }); add(a.g, x - 0.85, AY, 0); add(b.g, x + 0.85, AY, 0); return (lt) => { a.place(lt, (k) => a.gas(k, lt)); b.place(lt, (k) => b.gas(k, lt)); }; });
    say(8, 'concentration: how much solute', 'in a given amount of solution');
    station(9, (x) => { box(x, AY, 1.6, 1.4); const a = U5.swarm(4, { r: 0.07, color: 0xffc04d, w: 1.6, h: 1.4, d: 0.8, speed: 0.3 }); add(a.g, x, AY, 0); return (lt) => a.place(lt, (k) => a.gas(k, lt)); }); say(9, 'dilute: a small amount of solute');
    station(10, (x) => { box(x, AY, 1.6, 1.4); const a = U5.swarm(20, { r: 0.07, color: 0xffc04d, w: 1.6, h: 1.4, d: 0.8, speed: 0.3 }); add(a.g, x, AY, 0); return (lt) => a.place(lt, (k) => a.gas(k, lt)); }); say(10, 'concentrated: a lot of solute');
    station(11, (x) => { const gold = [3, 17, 22, 38, 45, 51, 64, 76, 83, 99]; const d = Array.from({ length: 100 }, (_, i) => add(K.solid(new THREE.SphereGeometry(0.055, 12, 8), M.gloss(gold.includes(i) ? 0xffc04d : 0x59a8ff)), x + (i % 10 - 4.5) * 0.15, AY + 0.15 + (Math.floor(i / 10) - 4.5) * 0.12, 0)); return (lt) => gold.forEach((g, k) => d[g].scale.setScalar(1 + 0.4 * U4.bump(lt, 0.6 + 0.25 * k, 0.4))); });
    say(11, 'percentage: parts of solute', 'in 100 parts of solution');
    station(12, (x) => { const ion = add(K.solid(new THREE.SphereGeometry(0.12, 22, 16), M.gloss(0x8c6fd8)), x, AY + 0.1, 0); const water = () => U.ballMol([['O', 0, 0], ['H', -0.1, -0.08], ['H', 0.1, -0.08]], [[0, 1], [0, 2]], { r: { O: 0.07, H: 0.045 } }); const ws = Array.from({ length: 6 }, (_, k) => ({ m: add(water()), a: k / 6 * Math.PI * 2 })); return (lt) => ws.forEach(({ m, a }, k) => { const u = ease(span(lt, 0.4 + 0.2 * k, 1.8 + 0.2 * k)), r = lerp(1.2, 0.3, u); m.position.set(x + Math.cos(a + lt * 0.3) * r, AY + 0.1 + Math.sin(a + lt * 0.3) * r, 0); m.rotation.z = a + lt * 0.3 + Math.PI / 2; }); });
    say(12, 'water: the universal solvent,', 'strong pull on solute particles');
    station(13, (x) => { box(x, AY, 1.3, 1.3, 1.3); const a = U5.swarm(10, { r: 0.07, color: 0xffc04d, w: 1.3, h: 1.3, d: 1.3, speed: 0.3 }); add(a.g, x, AY, 0); return (lt) => a.place(lt, (k) => a.gas(k, lt)); });
    say(13, 'molarity: moles of solute', 'per dm³ (litre) of solution');
    heap(14, 0.55, 0.55); say(14, 'solubility: grams of solute in 100 g', 'of solvent to saturate it');
    station(15, (x) => { box(x - 0.85, AY, 1.3, 1.4); box(x + 0.85, AY, 1.3, 1.4); const lo = add(K.solid(new THREE.BoxGeometry(1.25, 0.55, 0.75), new THREE.MeshPhysicalMaterial({ color: 0x2f86e0, transparent: true, opacity: 0.5, depthWrite: false }), { outline: false }), x - 0.85, AY - 0.4, 0), up = add(K.solid(new THREE.BoxGeometry(1.25, 0.4, 0.75), new THREE.MeshPhysicalMaterial({ color: 0xe8c860, transparent: true, opacity: 0.55, depthWrite: false }), { outline: false }), x - 0.85, AY + 0.08, 0), mix = add(K.solid(new THREE.BoxGeometry(1.25, 0.95, 0.75), new THREE.MeshPhysicalMaterial({ color: 0xece4c8, transparent: true, opacity: 0.5, depthWrite: false }), { outline: false }), x + 0.85, AY - 0.2, 0); return (lt) => { up.position.y = AY + 0.08 + 0.01 * Math.sin(lt * 2); }; });
    say(15, 'immiscible: two layers ·', 'completely miscible: one liquid');
    station(16, (x) => { box(x, AY, 2.4, 1.4); const b = U5.swarm(7, { r: 0.11, color: 0xf0ece0, w: 2.4, h: 1.4, d: 0.8, speed: 0.2 }); add(b.g, x, AY, 0); const bm = add(U6.beam()); return (lt) => { b.place(lt, (k) => b.gas(k, lt).setY(Math.sin(lt * 0.4 + k) * 0.15)); bm.userData.set(V(x - 1.4, AY, 0), V(x + 1.4, AY, 0), 0.4 * span(lt, 0.6, 1.0)); }; });
    say(16, 'colloids: 1–1000 nm particles;', 'they scatter light (Tyndall effect)');
    station(17, (x) => { box(x, AY, 1.8, 1.4); const c = U5.swarm(6, { r: 0.14, color: 0xc8b490, w: 1.8, h: 1.4, d: 0.8 }); add(c.g, x, AY, 0); return (lt) => { const f = ease(span(lt, 0.6, 3.0)); c.place(lt, (k) => c.gas(k, lt).lerp(V(-0.45 + 0.18 * k, -0.55, (k % 2 - 0.5) * 0.2), f)); }; });
    say(17, 'suspension: big particles that settle:', 'sedimentation');

    beats.push(K.checklist(scene, cam, { title: 'What did we learn about solutions?', dockTitle: 'Key points', intro: INTRO, ticks: TICKS,
      rows: [[0, 'every Key Point of Chapter 6'], [1, 'solution, aqueous, solute, solvent'], [1, 'saturated, unsaturated, supersaturated'], [1, 'nine types, concentration, dilute, concentrated'], [1, 'percentage, water, molarity, solubility'], [1, 'miscible, colloids, suspensions']],
      short: ['solutions', 'how much', 'concentration', 'units', 'mixtures'] }));
    return U.finish();
  },
};
