// Quiz Quest, Unit 6: the 10 MCQs of p.179. Same screen as the other quizzes (quiz.js runQuiz); each right answer
// plays a small 3D demo: beakers of solute marbles, a litre cube, a light beam, ions pulling apart.
import { THREE, emissive, sleep, tween, ease } from './kit.js';
import { runQuiz, demoBase } from './quiz.js';
import { MOLM, WATER, edgeBox, jar, Molecules, gridSeats } from './gas3d.js';

const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);

const Q = [
  { q: 'Which of the following solution is more dilute?', o: ['1.0M', '0.5M', '0.05M', '0.005M'], a: 3,
    why: 'The fewest moles in each litre: <b>0.005 M</b> is the most dilute.', demo: (s) => diluteDemo(s) },
  { q: 'Milk is an example of:', o: ['Compound', 'Saturated solution', 'Colloids', 'Suspension'], a: 2,
    why: 'Milk particles (1–1000 nm) scatter light but never settle: a <b>colloid</b>.', demo: (s) => milkDemo(s) },
  { q: 'Water droplet in air is an example of solution:', o: ['Gas in gas', 'Gas in liquid', 'Colloids', 'Liquid in Gas'], a: 3,
    why: 'Tiny liquid water drops spread through air: <b>liquid in gas</b>.', demo: (s) => mistDemo(s) },
  { q: 'When there is a low concentration of solute in a solution, it is known as:', o: ['dilute solution', 'saturated solution',
    'concentrated solution', 'super saturated solution'], a: 0,
    why: 'A little solute in a lot of solvent: a <b>dilute solution</b>.', demo: (s) => fewDemo(s) },
  { q: 'What is the molarity of a NaNO₃ solution made by diluting 250.0 cm³ of a 1.60 M solution to a final volume of 400 cm³?',
    o: ['1.20 M', '1.00 M', '0.200 M', '0.160 M'], a: 1,
    why: 'Same moles, more water: 1.60 × 250 = M₂ × 400, so M₂ = <b>1.00 M</b>.', demo: (s) => dilutionDemo(s) },
  { q: 'What is the concentration, in % mass by volume (m/v) of a solution containing 15.0 g KCl in 600.0 cm³ solution?',
    o: ['5.00%', '2.00%', '0.200%', '2.50%'], a: 3,
    why: '15.0 ÷ 600.0 × 100 = <b>2.50 %</b>: 1 cube in every 40.', demo: (s) => percentDemo(s) },
  { q: 'When KCl dissolves in water, the following will be produced:', o: ['K and Cl', 'K⁺ and Cl⁻', 'K and Cl₂', 'K⁺ and Cl₂'], a: 1,
    why: 'Water pulls the ionic crystal apart into <b>K⁺ and Cl⁻</b> ions.', demo: (s) => ionDemo(s) },
  { q: '2 moles of Na₂SO₄ are dissolved in one dm³ of solution. Molarity of solution is:', o: ['1 M', '2 M', '3 M', '0.5 M'], a: 1,
    why: '2 mol in 1 dm³ = <b>2 M</b>.', demo: (s) => cubeDemo(s, 2, 1, '2 mol ÷ 1 dm³ = 2 M') },
  { q: 'Molarity is the number of moles of solute dissolved in:', o: ['1 kg of solvent', '1 kg of solution', '1 dm³ of solvent',
    '1 dm³ of solution'], a: 3,
    why: 'Molarity counts moles in <b>1 dm³ of solution</b> (solute + solvent together).', demo: (s) => cubeDemo(s, 5, 1, '1 dm³ of solution') },
  { q: 'The molarity of a NaOH solution by dissolving 4 g of it in 250 ml water is:', o: ['0.4 M', '0.8 M', '0.2 M', '0.1 M'], a: 0,
    why: '4 g ÷ 40 g = 0.1 mol in 0.25 dm³. A full litre would hold 4 × 0.1: <b>0.4 M</b>.', demo: (s) => quarterDemo(s) },
];

export const start = (o) => runQuiz({ ...o, Q, id: 'quiz6', hub: 'games.html?unit=6' });

function live(d, parent, opt) { const m = new Molecules(parent, opt); d.frame((dt) => m.update(dt)); return m; }
// a glass beaker standing at (x, y) with water up to hl; returns the jar group
function beaker(d, x, y, r = 1.1, h = 2.6, hl = 2.0) {
  const j = jar(r, h); j.position.set(x, y, 0); d.g.add(j);
  const w = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.96, r * 0.96, hl, 32), WATER); w.position.y = hl / 2; j.add(w);
  return j;
}
const inside = (r, hl) => [V(-r * 0.75, 0.05, -0.3), V(r * 0.75, hl, 0.3)];

function diluteDemo(stage) {
  const d = demoBase(stage), A = beaker(d, -1.6, -1.8), B = beaker(d, 1.6, -1.8);
  live(d, A, { n: 14, lo: inside(1.1, 2)[0], hi: inside(1.1, 2)[1], mat: MOLM.gold, r: 0.13, speed: 0.8 });
  live(d, B, { n: 1, lo: inside(1.1, 2)[0], hi: inside(1.1, 2)[1], mat: MOLM.gold, r: 0.13, speed: 0.8 });
  stage.tag('1.0 M', A, [0, 3.2, 0], 'big'); const t = stage.tag('0.005 M', B, [0, 3.2, 0], 'big');
  return { ...d, async reveal() { t.innerHTML = '<b>0.005 M ✓</b>'; t.className += ' green'; stage.tag('<b>fewest particles</b>', d.g, [0, -2.6, 0], 'big gold'); } };
}
function milkDemo(stage) {
  const d = demoBase(stage), J = beaker(d, 0, -1.8, 1.5, 2.8, 2.3);
  live(d, J, { n: 26, lo: inside(1.5, 2.3)[0], hi: inside(1.5, 2.3)[1], mat: MOLM.white, r: 0.06, speed: 0.4 });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.0, 16), emissive(0xfff2b0, 2.5));
  beam.rotation.z = Math.PI / 2; beam.position.y = 1.2; beam.scale.y = 0.001; J.add(beam);
  return { ...d, async reveal() {
    await tween(0.8, (t) => (beam.scale.y = Math.max(0.001, t)), ease.out);
    stage.tag('<b>colloid: the beam shows (Tyndall)</b>', d.g, [0, 1.6, 0], 'big gold');
  } };
}
function mistDemo(stage) {
  const d = demoBase(stage), box = edgeBox(4.4, 2.8, 1.2); box.position.y = 0.2; d.g.add(box);
  live(d, box, { n: 14, lo: V(-2.2, -1.4, -0.5), hi: V(2.2, 1.4, 0.5), mat: MOLM.air, r: 0.09, speed: 1.8 });
  const drops = live(d, box, { n: 6, lo: V(-2.2, -1.4, -0.5), hi: V(2.2, 1.4, 0.5), mat: MOLM.glassP, r: 0.24, speed: 0.4 });
  drops.g.scale.setScalar(0.001);
  return { ...d, async reveal() {
    await tween(0.8, (t) => drops.g.scale.setScalar(Math.max(0.001, t)));
    stage.tag('<b>liquid drops in a gas</b>', box, [0, 2.0, 0], 'big gold');
  } };
}
function fewDemo(stage) {
  const d = demoBase(stage), J = beaker(d, 0, -1.8, 1.5, 2.8, 2.3), [lo, hi] = inside(1.5, 2.3);
  live(d, J, { n: 14, lo, hi, mat: MOLM.air, r: 0.1, speed: 0.8 });
  live(d, J, { n: 3, lo, hi, mat: MOLM.gold, r: 0.14, speed: 0.8 });
  return { ...d, async reveal() { stage.tag('<b>only a little solute: dilute</b>', J, [0, 3.3, 0], 'big gold'); } };
}
function dilutionDemo(stage) {
  const d = demoBase(stage), box = edgeBox(1.6, 1.6, 1.2, { open: true }); box.position.set(0, -1.2, 0); d.g.add(box);
  const w = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 1.2), WATER); box.add(w);
  const m = live(d, box, { n: 8, lo: V(-0.8, -0.8, -0.5), hi: V(0.8, 0.8, 0.5), mat: MOLM.gold, r: 0.14, speed: 0.8 });
  const vt = stage.tag('<b>250 cm³ · 1.60 M</b>', d.g, [0, 1.0, 0], 'big');
  return { ...d, async reveal() {
    await tween(1.2, (t) => { const s = 1 + 0.6 * t; box.scale.set(s, s, 1); m.r = 0.14 / s; }, ease.inOut);
    vt.innerHTML = '<b>400 cm³ · 1.00 M</b>';
    stage.tag('<b>1.60 × 250 = 1.00 × 400</b>', d.g, [0, -2.9, 0], 'big gold');
  } };
}
function percentDemo(stage) {
  const d = demoBase(stage), g = new THREE.Group(); g.position.y = 0.2; d.g.add(g);
  const blue = new THREE.MeshBasicMaterial({ color: 0x3a6fd0, transparent: true, opacity: 0.55 }), cubes = [];
  for (let k = 0; k < 40; k++) {
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), blue); c.position.set(-2.25 + 0.5 * (k % 10), -0.75 + 0.5 * Math.floor(k / 10), 0);
    g.add(c); cubes.push(c);
  }
  return { ...d, async reveal() {
    cubes[0].material = MOLM.gold;
    await tween(0.6, (t) => cubes[0].scale.setScalar(1 + 0.4 * Math.sin(t * Math.PI)));
    stage.tag('<b>1 in 40 = 2.50 %</b>', g, [0, 1.6, 0], 'big gold');
  } };
}
function ionDemo(stage) {
  const d = demoBase(stage), K = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 16), MOLM.purple), Cl = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 16), MOLM.green);
  K.position.set(-0.46, 0.4, 0); Cl.position.set(0.5, 0.4, 0); d.g.add(K, Cl);
  stage.tag('KCl', d.g, [0, 1.5, 0], 'big');
  return { ...d, async reveal() {
    await tween(1.2, (t) => { K.position.x = -0.46 - 1.6 * t; Cl.position.x = 0.5 + 1.6 * t; }, ease.inOut);
    stage.tag('<b>K⁺</b>', K, [0, 0.9, 0], 'big gold'); stage.tag('<b>Cl⁻</b>', Cl, [0, 1.0, 0], 'big gold');
  } };
}
function cubeDemo(stage, n, frac, text) {
  const d = demoBase(stage), box = edgeBox(2.6, 2.6, 2.6); box.position.y = 0.0; d.g.add(box);
  const w = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.6 * frac, 2.6), WATER); w.position.y = -1.3 + 1.3 * frac; box.add(w);
  const m = live(d, box, { seats: gridSeats(n, 1, 0.9), mat: MOLM.gold, r: n > 2 ? 0.2 : 0.34, amp: 0.01 });
  if (n > 2) { m.free(V(-1.1, -1.1, -1.1), V(1.1, 1.1, 1.1)); m.speed = 0.8; }
  return { ...d, async reveal() { stage.tag(`<b>${text}</b>`, box, [0, 2.0, 0], 'big gold'); } };
}
function quarterDemo(stage) {
  const d = demoBase(stage), box = edgeBox(2.6, 2.6, 2.6); d.g.add(box);
  const w = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.65, 2.6), WATER); w.position.y = -1.3 + 0.325; box.add(w);
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 12), MOLM.gold); b.position.set(0, -0.98, 0.6); box.add(b);
  stage.tag('0.1 mol in 0.25 dm³', box, [0, 2.0, 0], 'big');
  return { ...d, async reveal() {
    for (let k = 1; k < 4; k++) {
      const q = w.clone(); q.position.y = -1.3 + 0.325 + 0.65 * k; box.add(q);
      const c = b.clone(); c.position.y = -0.98 + 0.65 * k; box.add(c); await sleep(0.35);
    }
    stage.tag('<b>× 4 = 0.4 M</b>', box, [0, -2.0, 0], 'big gold');
  } };
}
