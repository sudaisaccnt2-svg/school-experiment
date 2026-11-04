// Lesson 515 · Exercise MCQs (book pp. 149–150, "Choose the correct option" i–x). v1 as a code lesson (2026-11-04),
// replacing the old Blender film. SKILL.md MCQ pattern (as 415): the book's card with reading time → the right option
// turns green → the card leaves and ONE moving picture shows why, with one result line on it.
// Answers (as printed, checked): i c · ii a · iii c · iv b · v b · vi c · vii c · viii c · ix c · x a.
// BEAT SHEET (the picture after each card · what the student concludes)
//  i    perfume molecules spread through air "spontaneous mixing: diffusion ✓"
//  ii   a solid's particles only shake in their rows "they do NOT move at great speed: (a) is wrong ✓"
//  iii  a bubble: the vapour's push meets the air's push "it boils at 101.325 kPa (1 atm) ✓"
//  iv   a closed box warmed: more molecules in the vapour "hotter → more vapour pressure ✓"
//  v    a syringe of 50 °C water, the plunger pulled: it boils "less outside pressure: it boils at 50 °C ✓"
//  vi   half the liquid taken away: the same vapour; then warmed: more "only the temperature changes it ✓"
//  vii  glucose's particles in a regular pattern "glucose is crystalline, not amorphous ✓"
//  viii half rows, half sliding at 0 °C "liquid and solid together ✓"
//  ix   ink spreading slowly through packed water molecules "ink spreads by diffusion ✓"
//  x    the piston rises from 1.5 to 3 dm³ "2 × 1.5 = P × 3 → P = 1 atm ✓"
// Game: 🎮 Quiz Quest (quiz5.js) asks the same ten with shuffled options.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
import * as U5 from './u5kit.js';
const { M, span, ease, lerp } = K;
const { V, DDIR } = U4;

const AY = 1.9, X0 = 40, GAP = 12;
const Q = [
  { q: 'i. The spontaneous mixing of particles is called:', o: ['evaporation', 'sublimation', 'diffusion', 'boiling'], a: 2 },
  { q: 'ii. Which statement for the particles of solid is not correct?', o: ['they move at great speed', 'they are arranged in regular pattern', 'there is a very little space between the particles', 'the force of attraction between the particles are strong'], a: 0 },
  { q: 'iii. A liquid boils when its vapour pressure becomes equal to:', o: ['760 cm of Hg', '1 Pascal', '101.325 kilo Pascal', '0.1 atm'], a: 2 },
  { q: 'iv. The vapour pressure of a liquid increases with the:', o: ['increase of pressure', 'increase of temperature', 'increase of intermolecular forces', 'increase of polarity of molecules'], a: 1 },
  { q: 'v. Water normally boils at 100 °C but it is possible to boil at 50 °C. Which variable would you have to change to do this?', o: ['increase external pressure', 'decrease external pressure', 'increase surface area', 'decrease surface area'], a: 1 },
  { q: 'vi. The vapour pressure of a liquid in a closed container depends upon:', o: ['amount of liquid', 'surface area of the liquid', 'temperature', 'both (b) and (c)'], a: 2 },
  { q: 'vii. Which one of the following is not an example of amorphous solid?', o: ['rubber', 'glass', 'glucose', 'plastic'], a: 2 },
  { q: 'viii. At freezing point which one of the following coexists in dynamic equilibrium?', o: ['gas and solid', 'liquid and gas', 'liquid and solid', 'all of these'], a: 2 },
  { q: 'ix. Ink spreads in water because of:', o: ['vapour pressure', 'expansion', 'diffusion', 'compressibility of water'], a: 2 },
  { q: 'x. What will be the pressure of a gas, if the volume of the gas at 2 atmospheres is increased from 1.5 dm³ to 3 dm³?', o: ['1 atmosphere', '1.5 atmosphere', '2 atmosphere', '2.5 atmosphere'], a: 0 },
];
let end = 0;
Q.forEach((q, i) => { q.x = X0 + i * GAP; q.t0 = end; q.card = Math.max(9, Math.ceil((q.q + ' ' + q.o.join(' ')).split(/\s+/).length / 3) + 4); q.P = q.t0 + q.card; q.t1 = q.P + 8.0; end = q.t1; });
const S = U4.shots(1e9);
const DK = (t, x, w, h, k = 1) => S(t, [x, AY, 0], w * k, h * k, DDIR);
const CAMS = Q.flatMap((q) => [DK(q.t0, q.x, 3.0, 2.4, 1.04), DK(q.P, q.x, 3.0, 2.4, 1.03), DK(q.t1 - 0.05, q.x, 3.0, 2.4, 0.96)]);

export default {
  duration: end,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions: [],
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '515', { dark: () => true, AY }), { beats, add, tag, grp, keyLight } = U;
    // ---------------------------------------------------------------- the card (DOM, fitted to the screen)
    const card = document.createElement('div'); card.className = 'u7-question'; card.hidden = true; document.body.append(card);
    let shown = -1, fit = '';
    beats.push((t) => {
      const i = Q.findIndex((q) => t < q.t1), k = i < 0 ? Q.length - 1 : i, q = Q[k], up = t >= q.t0 && t < q.P;
      if (k !== shown) { shown = k; card.replaceChildren(); const h = document.createElement('h2'); h.textContent = q.q; card.append(h); q.o.forEach((s, j) => { const p = document.createElement('p'); p.textContent = 'abcd'[j] + '. ' + s; p.dataset.answer = j === q.a ? 'yes' : 'no'; card.append(p); }); fit = ''; }
      card.hidden = !up; card.classList.toggle('answered', t >= q.P - 2.5); cam.userData.cardUp = up;
      const key = `${k}/${innerWidth}/${innerHeight}`;
      if (up && key !== fit) { fit = key; card.style.fontSize = Math.round(Math.min(innerHeight * 0.052, innerWidth * (innerWidth < innerHeight ? 0.075 : 0.042))) + 'px'; let s = parseFloat(card.style.fontSize); while (card.scrollHeight > card.clientHeight + 1 && s > 14) { s--; card.style.fontSize = s + 'px'; } }
    });
    const stage = (i, f, a, b) => { const q = Q[i]; U.stage((t) => t >= q.t0 - 0.05 && t < q.t1 - 0.05); keyLight(q.x); const up = f(q.x); const g = 'r' + i, l = b ? [grp(tag(a, 0.05, '#ffd27a', q.x, AY - 0.9, 0.1), g), grp(tag(b, 0.05, '#ffd27a', q.x, AY - 1.08, 0.1), g)] : [tag(a, 0.052, '#ffd27a', q.x, AY - 0.98, 0.1)]; beats.push((t) => { up(t - q.P, t); l.forEach((x) => K.popIn(x, t, q.P + 4.0, q.t1)); }); };
    const box = (x, w, h, d = 0.8, y = AY) => add(U5.glassBox(w, h, d), x, y, 0);

    stage(0, (x) => { box(x, 2.4, 1.5); const a = U5.swarm(22, { r: 0.05, w: 2.4, h: 1.5, d: 0.8, color: 0x7d8fb0, glow: 0.2 }), p = U5.swarm(12, { r: 0.065, w: 2.4, h: 1.5, d: 0.8, color: 0xd8e05a }); add(a.g, x, AY, 0); add(p.g, x, AY, 0); return (lt) => { a.place(lt, (i) => a.gas(i, lt)); const hx = lerp(0.2, 1.2, ease(span(lt, 0.4, 4.0))); p.place(lt, (i) => p.gas(i, lt, V(-1.2 + hx, -0.75 + Math.min(hx, 0.75), 0), hx, Math.min(hx, 0.75), 0.4)); }; }, 'spontaneous mixing: diffusion ✓');
    stage(1, (x) => { box(x, 1.6, 1.4); const s = U5.swarm(27, { r: 0.08, w: 1.6, h: 1.4, d: 0.8, gap: 0.32 }); add(s.g, x, AY, 0); return (lt) => s.place(lt, (i) => s.solid(i, lt, 1.4)); }, 'they only vibrate, not great speed:', '(a) is the wrong statement ✓');
    stage(2, (x) => { add(U5.glassBall(0.6, 0xbfe4ff), x, AY, 0); const v = U5.swarm(10, { r: 0.05, w: 1, h: 1, d: 1, color: 0xdff0ff, speed: 1.2 }); add(v.g, x, AY, 0); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, m = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.15, 10), M.glow(0xffc04d, 1.6)); m.rotation.z = a + Math.PI / 2; m.position.set(x + Math.cos(a) * 0.82, AY + Math.sin(a) * 0.82, 0.2); U.root.add(m); } return (lt) => v.place(lt, (i) => v.ball(i, lt, V(0, 0, 0), 0.54)); }, 'the air pushes 101.325 kPa (1 atm):', 'it boils when the vapour matches ✓');
    const jar = (x, fn) => { box(x, 1.8, 1.8); add(K.solid(new THREE.BoxGeometry(1.86, 0.06, 0.86), M.matte(0x3a3f48, 0.5)), x, AY + 0.935, 0); const L = U5.swarm(30, { r: 0.06, w: 1.8, h: 0.6, d: 0.8 }), v = U5.swarm(14, { r: 0.06, w: 1.8, h: 1.1, d: 0.8, color: 0x9fc4ff }); add(L.g, x, AY - 0.6, 0); add(v.g, x, AY + 0.3, 0); return (lt) => { const [nl, nv] = fn(lt); L.place(lt, (i) => (i < nl ? V(-0.75 + (i % 10) * 0.17, -0.2 + Math.floor(i / 10) * 0.18, (U5.rnd(i, 4) - 0.5) * 0.5).add(V(0.04 * Math.sin(lt + i), 0, 0)) : V(0, -50, 0))); v.place(lt, (i) => (i < nv ? v.gas(i, lt) : V(0, -50, 0))); }; };
    stage(3, (x) => { add(K.glowSprite(0xff6a2a, 1.4), x, AY - 1.05, 0.2); return jar(x, (lt) => [30, Math.round(lerp(5, 14, ease(span(lt, 0.6, 3.0))))]); }, 'hotter → more vapour pressure ✓');
    stage(4, (x) => { const sy = add(U5.syringe(0.9, 0.12), x, AY - 0.85, 0), w = add(K.solid(new THREE.CylinderGeometry(0.1, 0.1, 0.25, 24).translate(0, 0.125, 0), new THREE.MeshPhysicalMaterial({ color: 0x3d9ee6, transparent: true, opacity: 0.5, depthWrite: false }), { outline: false }), x, AY - 0.85 + 0.05, 0), b = add(K.bubbles(14, V(0, 0.02, 0), 0.25, 0.14, 0.018), x, AY - 0.85 + 0.05, 0); return (lt) => { sy.userData.set(1 - ease(span(lt, 0.6, 1.6))); b.userData.update(lt, span(lt, 1.6, 2.2)); }; }, 'less outside pressure:', 'it boils at only 50 °C ✓');
    stage(5, (x) => jar(x, (lt) => [lt < 1.2 ? 30 : 15, lt < 2.6 ? 6 : Math.round(lerp(6, 14, ease(span(lt, 2.6, 3.8))))]), 'less liquid: the same; warmer: more', 'only the temperature changes it ✓');
    stage(6, (x) => { box(x, 1.6, 1.4); const s = U5.swarm(27, { r: 0.08, w: 1.6, h: 1.4, d: 0.8, gap: 0.32, color: 0xf0f0e8 }); add(s.g, x, AY, 0); return (lt) => s.place(lt, (i) => s.solid(i, lt)); }, 'glucose: a regular pattern,', 'crystalline, not amorphous ✓');
    stage(7, (x) => { box(x, 2.0, 1.4); const s = U5.swarm(20, { r: 0.065, w: 2, h: 1.4, d: 0.8 }); add(s.g, x, AY, 0); return (lt) => s.place(lt, (i) => { const k = i >> 1, c = V(-0.8 + (k % 4) * 0.2, -0.55 + Math.floor(k / 4) * 0.2, 0), free = V(0.2 + (k % 4) * 0.17 + 0.08 * Math.sin(lt + i), -0.55 + Math.floor(k / 4) * 0.12, 0.1 * Math.sin(i)); return i % 2 ? free : c.add(V(Math.sin(lt * 20 + i), Math.sin(lt * 17 + i), 0).multiplyScalar(0.012)); }); }, 'at 0 °C: liquid and solid together ✓');
    stage(8, (x) => { box(x, 1.8, 1.5); const WP = Array.from({ length: 48 }, (_, i) => V(-0.75 + (i % 6) * 0.3, -0.6 + Math.floor(i / 6) % 4 * 0.4, -0.25 + Math.floor(i / 24) * 0.5)), w = U5.swarm(48, { r: 0.07, w: 1.8, h: 1.5, d: 0.8, glow: 0.2 }), ink = U5.swarm(8, { r: 0.075, w: 1.8, h: 1.5, d: 0.8, color: 0x2a3fa8 }); add(w.g, x, AY, 0); add(ink.g, x, AY, 0); const dirs = Array.from({ length: 8 }, (_, k) => V(U5.rnd(k, 1) - 0.5, U5.rnd(k, 2) - 0.5, (U5.rnd(k, 3) - 0.5) * 0.4).normalize()); return (lt) => { w.place(lt, (i) => WP[i].clone().add(V(Math.sin(lt * 3 + i) * 0.025, Math.cos(lt * 2.6 + i) * 0.025, 0))); ink.place(lt, (k) => V(0, 0.1, 0).addScaledVector(dirs[k], 0.08 + 0.5 * Math.sqrt(span(lt, 0, 6)))); }; }, 'ink spreads by diffusion ✓');
    stage(9, (x) => { box(x, 1.2, 1.8, 0.8, AY - 0.05); const g = U5.swarm(14, { r: 0.06, w: 1.2, h: 1.8, d: 0.8 }); add(g.g, x, AY - 0.05, 0); const pl = add(K.solid(new THREE.BoxGeometry(1.17, 0.06, 0.77), M.matte(0x22252c, 0.6)), x, 0, 0); return (lt) => { const top = lerp(-0.1, 0.7, ease(span(lt, 0.6, 2.4))), fl = -0.9, hy = (top - fl) / 2; g.place(lt, (j) => g.gas(j, lt, V(0, fl + hy, 0), 0.6, hy, 0.4)); pl.position.y = AY - 0.05 + top + 0.032; }; }, 'twice the volume, half the pressure:', '2 × 1.5 = P × 3 → P = 1 atm ✓');
    return U.finish();
  },
};
