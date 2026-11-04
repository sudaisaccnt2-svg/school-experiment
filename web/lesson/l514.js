// Lesson 514 · Key Points: Physical States of Matter (book pp. 148–149, every Key Point in the printed order). v1 as a
// code lesson (2026-11-04), replacing the old Blender film. SKILL.md: key points reprise the familiar action (one
// short picture per point, the same molecules the student met in lessons 501–513), one line each, no new model.
// THE QUESTION: "What did we learn about matter?" → card, docked panel, six ticks (one per part of the chapter).
// BEAT SHEET (one station per point, cut from one to the next; each picture moves while its line is read)
//   1 three boxes: solid shaking, liquid sliding, gas flying "matter: solid · liquid · gas"
//   2 a gas box, its molecules fast "gas: the highest energy state" ✓
//   3 perfume spreading through air "diffusion: mixing from crowded to less crowded"
//   4 one by one through a hole in a wall "effusion: one by one through a tiny hole"
//   5 sparks where molecules hit the walls "pressure: the force on each area (P = F / A)"
//   6 a piston pressed down "compressibility: change in volume per change in pressure"
//   7 gas, liquid and solid cubes "density: mass per unit volume" ✓
//   8 the piston pushed to half "Boyle: more pressure, less volume (same T)"
//   9 a flame under the piston, it rises "Charles: hotter, more volume (same P)"
//  10 a thermometer "absolute temperature: K = °C + 273" ✓
//  11 the fastest leave the surface "evaporation: liquid → gas"
//  12 a closed box, leave = return "vapour pressure: escape = return"
//  13 a bubble, pushes matched "boiling point: vapour pressure = outside pressure" ✓
//  14 half rows, half sliding "freezing / melting point: liquid ↔ solid"
//  15 jumbled beside ordered "amorphous: no order · crystalline: a 3D pattern" ✓
//  16 O₂ and O₃ "allotropy: one element, more forms"
//  17 rhombic → needles at 95.5 °C "transition temperature: one allotrope → another" ✓
// Game (🎮 State Sorter + Why? Lab + Gas Law Lab, docs/COVERAGE_U5.md): every point as a recall round.
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U5.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
import * as U5 from './u5kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, DDIR, bump } = U4;

const AY = 1.9, X0 = 40, GAP = 12, DUR = 5.6, T0 = 7.4, N = 17;
const INTRO = [2.0, 7.0];
const at = (i) => T0 + i * DUR, sx = (i) => X0 + i * GAP;
const TICKS = [[at(1) + 4, 0], [at(6) + 4, 1], [at(9) + 4, 2], [at(12) + 4, 3], [at(14) + 4, 4], [at(16) + 4, 5]];
const DONE = at(N) + 4.0;
const S = U4.shots(INTRO[1]);
const DK = (t, x, w, h, k = 1) => S(t, [x, AY, 0], w * k, h * k, DDIR);
const W = [3.6, 2.4, 3.0, 3.0, 2.4, 2.2, 4.2, 2.2, 2.2, 1.6, 3.0, 2.4, 2.4, 2.4, 3.6, 3.0, 2.2];
const CAMS = [DK(0, sx(0), 3.6, 2.2, 1.04), DK(T0 - 0.05, sx(0), 3.6, 2.2, 1.0), ...Array.from({ length: N }, (_, i) => [DK(at(i), sx(i), W[i], 2.2, 1.04), DK(at(i) + DUR - 0.05, sx(i), W[i], 2.2, 0.98)]).flat(), DK(DONE, sx(N - 1), W[N - 1], 2.2, 0.97)];

export default {
  duration: DONE,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions: [[0.2, 2.0, 'What did we learn about matter?', [sx(0), AY + 1.0, 0]]],
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '514', { dark: () => true, AY }), { beats, add, tag, grp, keyLight } = U;
    const fires = [], shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
    const station = (i, f) => { U.stage((t) => (i === 0 ? t < at(1) - 0.05 : t >= at(i) - 0.05 && t < (i === N - 1 ? 1e9 : at(i + 1) - 0.05))); keyLight(sx(i)); const up = f(sx(i)); beats.push((t) => up(t - at(i), t)); };
    const say = (i, a, b, c = '#ffd27a') => { const g = 's' + i, l = b ? [grp(tag(a, 0.05, c, sx(i), AY - 0.86, 0.1), g), grp(tag(b, 0.05, c, sx(i), AY - 1.04, 0.1), g)] : [tag(a, 0.052, c, sx(i), AY - 0.95, 0.1)]; beats.push((t) => l.forEach((x) => K.popIn(x, t, Math.max(T0, at(i)) + 0.3, at(i) + DUR - 0.1))); };
    const box = (x, y, w, h, d = 0.8) => add(U5.glassBox(w, h, d), x, y, 0);

    station(0, (x) => { const B = [-1.25, 0, 1.25].map((dx) => box(x + dx, AY, 1.0, 1.2)); const s = U5.swarm(27, { r: 0.06, w: 1, h: 1.2, d: 0.8, gap: 0.2 }), l = U5.swarm(27, { r: 0.06, w: 1, h: 1.2, d: 0.8, gap: 0.2, color: 0x7fb0ff }), g = U5.swarm(10, { r: 0.06, w: 1, h: 1.2, d: 0.8, color: 0xbcd8ff, speed: 1.2 }); add(s.g, x - 1.25, AY, 0); add(l.g, x, AY, 0); add(g.g, x + 1.25, AY, 0); return (lt) => { s.place(lt, (i) => s.solid(i, lt)); l.place(lt, (i) => l.liquid(i, lt)); g.place(lt, (i) => g.gas(i, lt)); }; });
    say(0, 'matter: solid · liquid · gas', null, '#ffffff');
    station(1, (x) => { box(x, AY, 1.8, 1.5); const g = U5.swarm(14, { r: 0.06, w: 1.8, h: 1.5, d: 0.8, speed: 2.4, color: 0xffc04d }); add(g.g, x, AY, 0); return (lt) => g.place(lt, (i) => g.gas(i, lt)); });
    say(1, 'gas: the highest energy state');
    station(2, (x) => { box(x, AY, 2.6, 1.5); const a = U5.swarm(24, { r: 0.05, w: 2.6, h: 1.5, d: 0.8, color: 0x7d8fb0, glow: 0.2 }), p = U5.swarm(12, { r: 0.065, w: 2.6, h: 1.5, d: 0.8, color: 0xd8e05a }); add(a.g, x, AY, 0); add(p.g, x, AY, 0); return (lt) => { a.place(lt, (i) => a.gas(i, lt)); const hx = lerp(0.2, 1.3, ease(span(lt, 0.4, 4.6))); p.place(lt, (i) => p.gas(i, lt, V(-1.3 + hx, -0.75 + Math.min(hx, 0.75), 0), hx, Math.min(hx, 0.75), 0.4)); }; });
    say(2, 'diffusion: mixing, from crowded', 'to less crowded');
    station(3, (x) => { const sh = new THREE.Shape(); sh.moveTo(-0.4, -0.7); sh.lineTo(0.4, -0.7); sh.lineTo(0.4, 0.7); sh.lineTo(-0.4, 0.7); const h = new THREE.Path(); h.absarc(0, 0, 0.08, 0, Math.PI * 2, true); sh.holes.push(h); const wall = add(new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.04, bevelEnabled: false }), new THREE.MeshPhysicalMaterial({ color: 0xdfe8f2, transparent: true, opacity: 0.45, side: THREE.DoubleSide })), x - 0.02, AY, 0); wall.rotation.y = Math.PI / 2; wall.position.z = 0; const m = U5.swarm(12, { r: 0.06, w: 2.6, h: 1.4, d: 0.8, color: 0xd070a0 }); add(m.g, x, AY, 0); return (lt) => m.place(lt, (i) => { const L = m.gas(i, lt, V(-0.65, 0, 0), 0.6, 0.7, 0.4), Rr = m.gas(i, lt + 3, V(0.65, 0, 0), 0.6, 0.7, 0.4); if (i >= 6) return L; const t0 = 0.6 + 0.7 * i, a = span(lt, t0 - 0.5, t0), b = span(lt, t0, t0 + 0.35); return lt < t0 - 0.5 ? L : a < 1 ? L.lerp(V(-0.1, 0, 0), a) : b < 1 ? V(-0.1, 0, 0).lerp(V(0.1, 0, 0), b) : V(0.1, 0, 0).lerp(Rr, span(lt, t0 + 0.35, t0 + 0.9)); }); });
    say(3, 'effusion: one by one', 'through a tiny hole');
    station(4, (x) => { box(x, AY, 1.8, 1.5); const g = U5.swarm(14, { r: 0.06, w: 1.8, h: 1.5, d: 0.8, speed: 1.3 }); add(g.g, x, AY, 0); const sp = Array.from({ length: 14 }, () => add(K.glowSprite(0xffd27a, 0.14))); return (lt) => { g.place(lt, (i) => g.gas(i, lt)); sp.forEach((s, i) => { const p = g.gas(i, lt), m = Math.min(0.9 - Math.abs(p.x), 0.75 - Math.abs(p.y)); s.visible = m < 0.08; s.position.copy(p).add(V(x, AY, 0)); }); }; });
    say(4, 'pressure: force on each area', '(P = F / A)');
    const piston = (i, k) => station(i, (x) => { box(x, AY - 0.1, 1.2, 1.6); const g = U5.swarm(14, { r: 0.06, w: 1.2, h: 1.6, d: 0.8 }); add(g.g, x, AY - 0.1, 0); const pl = add(K.solid(new THREE.BoxGeometry(1.17, 0.06, 0.77), M.matte(0x22252c, 0.6)), x, 0, 0); const fl = k === 'hot' ? add(K.glowSprite(0xff6a2a, 1.4), x, AY - 1.05, 0.2) : null;
      return (lt) => { const u = ease(span(lt, 1.0, 3.0)), top = k === 'hot' ? lerp(-0.1, 0.65, u) : lerp(0.65, -0.1, u), fl0 = -0.8, hy = (top - fl0) / 2; g.place(lt, (j) => g.gas(j, lt, V(0, fl0 + hy, 0), 0.6, hy, 0.4)); pl.position.y = AY - 0.1 + top + 0.032; if (fl) fl.material.opacity = 0.7; }; });
    piston(5, 'press'); say(5, 'compressibility: change in volume', 'per change in pressure');
    station(6, (x) => { const B = [-1.4, 0, 1.4].map((dx) => box(x + dx, AY, 1.0, 1.0)); const g = U5.swarm(8, { r: 0.06, w: 1, h: 1, d: 0.8, color: 0xbcd8ff }), l = U5.swarm(27, { r: 0.06, w: 1, h: 1, d: 0.8, gap: 0.18, color: 0x7fb0ff }), s = U5.swarm(27, { r: 0.06, w: 1, h: 1, d: 0.8, gap: 0.22 }); add(g.g, x - 1.4, AY, 0); add(l.g, x, AY, 0); add(s.g, x + 1.4, AY, 0); return (lt) => { g.place(lt, (i) => g.gas(i, lt)); l.place(lt, (i) => l.liquid(i, lt)); s.place(lt, (i) => s.solid(i, lt)); }; });
    say(6, 'density: mass per unit volume');
    piston(7, 'press'); say(7, "Boyle: more pressure, less volume", '(the same temperature)');
    piston(8, 'hot'); say(8, "Charles: hotter, more volume", '(the same pressure)');
    station(9, (x) => { const th = add(K.thermometer(1.2, 120), x - 0.1, AY - 0.75, 0); th.scale.setScalar(1.2); return (lt) => th.userData.set(lerp(0, 100, ease(span(lt, 0.5, 3.5)))); });
    say(9, 'absolute temperature:', 'K = °C + 273');
    station(10, (x) => { box(x, AY, 2.6, 1.6); const L = U5.swarm(33, { r: 0.06, w: 2.6, h: 0.6, d: 0.8, color: 0x59a8ff }), gd = U5.swarm(5, { r: 0.062, w: 2.6, h: 1.6, d: 0.8, color: 0xffc04d }); add(L.g, x, AY - 0.5, 0); add(gd.g, x, AY, 0); const pos = (i, ph) => V(-1.15 + (i % 11) * 0.23 + 0.05 * Math.sin(ph + i), -0.25 + Math.floor(i / 11) * 0.2, (U5.rnd(i, 3) - 0.5) * 0.5); return (lt) => { L.place(lt, (i) => pos(i, lt)); gd.place(lt, (k) => { const u = span(lt, 0.6 + 0.8 * k, 2.2 + 0.8 * k), s = V(-0.9 + 0.45 * k, -0.2, 0); return s.lerp(V(-0.9 + 0.45 * k + 0.2, 1.2, 0), u); }); }; });
    say(10, 'evaporation: liquid → gas', 'at the surface');
    station(11, (x) => { box(x, AY, 2.0, 1.8); add(K.solid(new THREE.BoxGeometry(2.06, 0.06, 0.86), M.matte(0x3a3f48, 0.5)), x, AY + 0.935, 0); const L = U5.swarm(30, { r: 0.06, w: 2, h: 0.6, d: 0.8 }), v = U5.swarm(10, { r: 0.06, w: 2, h: 1.1, d: 0.8, color: 0x9fc4ff }); add(L.g, x, AY - 0.6, 0); add(v.g, x, AY + 0.3, 0); return (lt) => { L.place(lt, (i) => V(-0.85 + (i % 10) * 0.19, -0.2 + Math.floor(i / 10) * 0.18, (U5.rnd(i, 4) - 0.5) * 0.5).add(V(0.04 * Math.sin(lt + i), 0, 0))); v.place(lt, (i) => v.gas(i, lt)); }; });
    say(11, 'vapour pressure: the vapour’s push', 'when escape = return');
    station(12, (x) => { const b = add(U5.glassBall(0.6, 0xbfe4ff), x, AY, 0), v = U5.swarm(10, { r: 0.05, w: 1, h: 1, d: 1, color: 0xdff0ff, speed: 1.2 }); add(v.g, x, AY, 0); const ar = Array.from({ length: 8 }, (_, i) => { const a = i / 8 * Math.PI * 2, m = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.15, 10), M.glow(0xffc04d, 1.6)); m.rotation.z = a + Math.PI / 2; m.position.set(x + Math.cos(a) * 0.82, AY + Math.sin(a) * 0.82, 0.2); U.root.add(m); return m; }); return (lt) => v.place(lt, (i) => v.ball(i, lt, V(0, 0, 0), 0.54)); });
    say(12, 'boiling point: vapour pressure', '= outside pressure');
    station(13, (x) => { box(x, AY, 2.0, 1.4); const s = U5.swarm(20, { r: 0.065, w: 2, h: 1.4, d: 0.8 }); add(s.g, x, AY, 0); return (lt) => s.place(lt, (i) => { const k = i >> 1, c = V(-0.8 + (k % 4) * 0.2, -0.55 + Math.floor(k / 4) * 0.2, 0), free = V(0.2 + (k % 4) * 0.17 + 0.08 * Math.sin(lt + i), -0.55 + Math.floor(k / 4) * 0.12 + 0.03 * Math.cos(lt * 1.3 + i), 0.1 * Math.sin(i)); return i % 2 ? free : c.add(V(Math.sin(lt * 20 + i), Math.sin(lt * 17 + i), 0).multiplyScalar(0.012)); }); });
    say(13, 'freezing and melting point:', 'liquid ↔ solid in equilibrium');
    station(14, (x) => { box(x - 0.95, AY, 1.4, 1.4); box(x + 0.95, AY, 1.4, 1.4); const j = U5.swarm(20, { r: 0.08, w: 1.4, h: 1.4, d: 0.8, color: 0xd8d0f0 }), c = U5.swarm(27, { r: 0.07, w: 1.4, h: 1.4, d: 0.8, gap: 0.3 }); add(j.g, x - 0.95, AY, 0); add(c.g, x + 0.95, AY - 0.1, 0); const JP = Array.from({ length: 20 }, (_, i) => V((U5.rnd(i, 1) - 0.5) * 1.1, (U5.rnd(i, 2) - 0.5) * 1.1, (U5.rnd(i, 3) - 0.5) * 0.5)); return (lt) => { j.place(lt, (i) => JP[i]); c.place(lt, (i) => c.solid(i, lt)); }; });
    say(14, 'amorphous: no order', 'crystalline: a regular 3D pattern');
    station(15, (x) => { const a = add(U.ballMol([['O', -0.28, 0], ['O', 0.28, 0]], [[0, 1, 2]]), x - 0.7, AY, 0), b = add(U.ballMol([['O', -0.42, -0.14], ['O', 0, 0.12], ['O', 0.42, -0.14]], [[0, 1, 2], [1, 2, 1]]), x + 0.7, AY, 0); return (lt) => { a.rotation.y = 0.4 * Math.sin(lt); b.rotation.y = -0.4 * Math.sin(lt); }; });
    say(15, 'allotropy: one element, more forms', '(O₂ and O₃)');
    station(16, (x) => { const d = add(U5.sulphurDish(), x - 0.2, AY - 0.4, 0); d.scale.setScalar(4); const th = add(K.thermometer(0.6, 120), x + 0.55, AY - 0.7, 0); th.scale.setScalar(1.6); return (lt) => { th.userData.set(lerp(25, 95.5, ease(span(lt, 0.4, 2.6)))); d.userData.set(ease(span(lt, 2.6, 3.6))); }; });
    say(16, 'transition temperature:', 'one allotrope turns into another');
    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));

    beats.push(K.checklist(scene, cam, { title: 'What did we learn about matter?', dockTitle: 'Key points', intro: INTRO, ticks: TICKS,
      rows: [[0, 'every Key Point of Chapter 5'], [1, 'three states; gas has the most energy'], [1, 'gases: diffusion, effusion, pressure, density'], [1, 'gas laws: Boyle, Charles, K = °C + 273'], [1, 'liquids: evaporation, vapour pressure, boiling'], [1, 'solids: melting, amorphous, crystalline'], [1, 'allotropy, transition temperature']],
      short: ['states', 'gases', 'gas laws', 'liquids', 'solids', 'allotropy'] }));
    return U.finish();
  },
};
