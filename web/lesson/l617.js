// Lesson 617 · Exercise MCQs (book p. 179, "Choose the correct option" i–x). v1 as a code lesson (2026-11-04), replacing
// the old Blender film. SKILL.md MCQ pattern (as 415, 515): the book's card with reading time → the right option turns
// green → the card leaves and ONE moving picture shows why, with one result line on it.
// Answers (as printed, checked): i d · ii c · iii d · iv a · v b · vi d · vii b · viii b · ix d · x a.
// BEAT SHEET (the picture after each card · what the student concludes)
//  i 1 · 0.5 · 0.05 · 0.005 M as gold balls in four cubes "0.005 M: the fewest: most dilute ✓"
//  ii a beam through milk "milk scatters the light: a colloid ✓"   iii drops drifting in air "water in air: liquid in gas ✓"
//  iv a few gold balls in much water "little solute: dilute ✓"      v M₂ = 1.60 × 250 ÷ 400 = 1.00 M ✓
//  vi 15.0 ÷ 600.0 × 100 = 2.50 % ✓                                 vii KCl falls apart into K⁺ and Cl⁻ ions ✓
//  viii 2 mol in 1 dm³ = 2 M ✓                                       ix "moles per dm³ of SOLUTION ✓"
//  x 4 g ÷ 40 = 0.1 mol; 250 ml = 0.25 dm³; 0.1 ÷ 0.25 = 0.4 M ✓
// Game: 🎮 Quiz Quest (quiz6.js) asks the same ten with shuffled options.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
import * as U5 from './u5kit.js';
import * as U6 from './u6kit.js';
const { M, span, ease, lerp } = K;
const { V, DDIR } = U4;

const AY = 1.9, X0 = 40, GAP = 12;
const Q = [
  { q: 'i. Which of the following solution is more dilute?', o: ['1.0 M', '0.5 M', '0.05 M', '0.005 M'], a: 3 },
  { q: 'ii. Milk is an example of:', o: ['Compound', 'Saturated solution', 'Colloids', 'Suspension'], a: 2 },
  { q: 'iii. Water droplet in air is an example of solution:', o: ['Gas in gas', 'Gas in liquid', 'Colloids', 'Liquid in Gas'], a: 3 },
  { q: 'iv. When there is a low concentration of solute in a solution, it is known as:', o: ['dilute solution', 'saturated solution', 'concentrated solution', 'super saturated solution'], a: 0 },
  { q: 'v. What is the molarity of a NaNO₃ solution made by diluting 250.0 cm³ of a 1.60 M solution to a final volume of 400 cm³?', o: ['1.20 M', '1.00 M', '0.200 M', '0.160 M'], a: 1 },
  { q: 'vi. What is the concentration, in % mass by volume (m/v) of a solution containing 15.0 g KCl in 600.0 cm³ solution?', o: ['5.00%', '2.00%', '0.200%', '2.50%'], a: 3 },
  { q: 'vii. When KCl dissolves in water, the following will be produced:', o: ['K and Cl', 'K⁺ and Cl⁻', 'K and Cl₂', 'K⁺ and Cl₂'], a: 1 },
  { q: 'viii. 2 moles of Na₂SO₄ are dissolved in one dm³ of solution. Molarity of solution is:', o: ['1 M', '2 M', '3 M', '0.5 M'], a: 1 },
  { q: 'ix. Molarity is the number of moles of solute dissolved in:', o: ['1 kg of solvent', '1 kg of solution', '1 dm³ of solvent', '1 dm³ of solution'], a: 3 },
  { q: 'x. The molarity of a NaOH solution by dissolving 4 g of it in 250 ml water is:', o: ['0.4 M', '0.8 M', '0.2 M', '0.1 M'], a: 0 },
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
    const U = U4.lessonKit({ scene, cam, R }, '617', { dark: () => true, AY }), { beats, add, tag, grp, keyLight } = U;
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
    const stage = (i, f, a, b) => { const q = Q[i]; U.stage((t) => t >= q.t0 - 0.05 && t < q.t1 - 0.05); keyLight(q.x); const up = f(q.x); const g = 'r' + i, l = b ? [grp(tag(a, 0.05, '#ffd27a', q.x, AY - 0.9, 0.1), g), grp(tag(b, 0.05, '#ffd27a', q.x, AY - 1.08, 0.1), g)] : [grp(tag(a, 0.052, '#ffd27a', q.x, AY - 0.98, 0.1), g)]; beats.push((t) => { up(t - q.P, t); l.forEach((x) => K.popIn(x, t, q.P + 4.0, q.t1)); }); };
    const box = (x, w, h, d = 0.8, y = AY) => add(U5.glassBox(w, h, d), x, y, 0);

    const cube = (x, n, w = 0.62) => { box(x, w, w, w, AY); const s = U5.swarm(Math.max(1, n), { r: 0.045, color: 0xffc04d, w, h: w, d: w, speed: 0.3 }); add(s.g, x, AY, 0); if (!n) s.g.visible = false; return s; };
    const swarms = (list) => (lt) => list.forEach((s) => s.place(lt, (i) => s.gas(i, lt)));
    stage(0, (x) => { const N = [20, 10, 3, 1], L = N.map((n, k) => cube(x + (k - 1.5) * 0.78, n)); ['1.0', '0.5', '0.05', '0.005 M'].forEach((s, k) => { const l = grp(tag(s, 0.042, '#ffffff', x + (k - 1.5) * 0.78, AY + 0.48, 0.1), 'c0'); beats.push((t) => K.popIn(l, t, Q[0].P + 0.4, Q[0].P + 3.8)); }); return swarms(L); }, 'the fewest particles:', '0.005 M is the most dilute ✓');
    stage(1, (x) => { box(x, 2.2, 1.2); const b = U5.swarm(7, { r: 0.1, color: 0xfaf8f2, w: 2.2, h: 1.2, d: 0.8, speed: 0.2 }); add(b.g, x, AY, 0); const bm = add(U6.beam()); return (lt) => { b.place(lt, (k) => b.gas(k, lt).setY(((k * 0.37) % 1 - 0.5) * 0.8 + Math.sin(lt * 0.4 + k) * 0.06)); bm.userData.set(V(x - 1.3, AY, 0), V(x + 1.3, AY, 0), 0.4 * span(lt, 0.6, 1.0)); }; }, 'milk scatters the light:', 'a colloid ✓');
    stage(2, (x) => { box(x, 2.2, 1.4); const a = U5.swarm(16, { r: 0.04, color: 0x8fa3c0, w: 2.2, h: 1.4, d: 0.8, speed: 0.8, glow: 0.2 }), d = U5.swarm(5, { r: 0.07, color: 0x3d9ee6, w: 2.2, h: 1.4, d: 0.8, speed: 0.3 }); add(a.g, x, AY, 0); add(d.g, x, AY, 0); return swarms([a, d]); }, 'water droplets in air:', 'liquid in gas ✓');
    stage(3, (x) => { box(x, 1.8, 1.4); const w = U5.swarm(40, { r: 0.05, color: 0x59a8ff, w: 1.8, h: 1.4, d: 0.8, speed: 0.4, glow: 0.2 }), g = U5.swarm(3, { r: 0.065, color: 0xffc04d, w: 1.8, h: 1.4, d: 0.8, speed: 0.3 }); add(w.g, x, AY, 0); add(g.g, x, AY, 0); return swarms([w, g]); }, 'little solute in much solvent:', 'a dilute solution ✓');
    const sums = (i, lines) => stage(i, (x) => { const L = lines.slice(0, -1).map((s, k) => grp(tag(s, 0.055, '#ffffff', x, AY - 0.2 - k * 0.3, 0.1), 'r' + i)); beats.push((t) => L.forEach((l, k) => K.popIn(l, t, Q[i].P + 0.4 + k * 1.2, Q[i].t1))); return () => {}; }, lines.at(-1) + ' ✓');
    sums(4, ['M₁V₁ = M₂V₂', 'M₂ = 1.60 × 250.0 ÷ 400', '= 1.00 M']);
    sums(5, ['% m/v = grams ÷ cm³ × 100', '= 15.0 ÷ 600.0 × 100', '= 2.50 %']);
    stage(6, (x) => { const ion = (c, r, sg) => { const g = new THREE.Group(); g.add(K.solid(new THREE.SphereGeometry(r, 20, 14), M.gloss(c))); const l = K.label(sg, r * 0.9, '#ffffff', 800); l.position.z = r + 0.01; l.renderOrder = 22; l.userData.mark = true; g.add(l); return add(g); }; const P = [], A = 0.26; for (let k = 0; k < 8; k++) { const kk = k % 2 === 0; P.push({ m: ion(kk ? 0x8c6fd8 : 0x6fd07a, kk ? 0.09 : 0.12, kk ? '+' : '−'), p: V(x + ((k % 4) - 1.5) * A, AY + 0.15 + (Math.floor(k / 4) - 0.5) * A, 0), d: V(((k * 37) % 9 - 4) * 0.2, ((k * 53) % 7 - 3) * 0.15, 0) }); } return (lt) => { const u = ease(span(lt, 0.6, 2.6)); P.forEach(({ m, p, d }) => m.position.copy(p).addScaledVector(d, u)); }; }, 'KCl in water:', 'K⁺ and Cl⁻ ions ✓');
    stage(7, (x) => swarms([cube(x, 20, 1.2)]), '2 mol in 1 dm³ of solution:', '2 M ✓');
    stage(8, (x) => { const c = cube(x, 10, 1.2); const l = grp(tag('1 dm³ of SOLUTION (solute + solvent)', 0.045, '#9fd2ff', x, AY + 0.82, 0.1), 'ix'); beats.push((t) => K.popIn(l, t, Q[8].P + 0.4, Q[8].P + 3.8)); return swarms([c]); }, 'molarity: moles in 1 dm³', 'of solution ✓');
    sums(9, ['4 g ÷ 40 g/mol = 0.1 mol', '250 ml = 0.25 dm³', '0.1 ÷ 0.25 = 0.4 M']);
    return U.finish();
  },
};
