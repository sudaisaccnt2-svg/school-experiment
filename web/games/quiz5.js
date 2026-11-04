// Quiz Quest, Unit 5: the 10 MCQs of pp.149-150. Same screen as the other quizzes (quiz.js runQuiz); each right
// answer plays a small 3D demo with moving molecules, a jar, a piston or a dial.
import { THREE, sleep, tween, ease } from './kit.js';
import { runQuiz, demoBase } from './quiz.js';
import { MOLM, WATER, edgeBox, jar, Molecules, gridSeats, pistonCyl, gauge, thermo, flame, arrow3 } from './gas3d.js';

const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);

const Q = [
  { q: 'The spontaneous mixing of particles is called:', o: ['evaporation', 'sublimation', 'diffusion', 'boiling'], a: 2,
    why: 'Particles mix by themselves, from crowded to less crowded: <b>diffusion</b>.', demo: (s) => mixDemo(s, 'diffusion') },
  { q: 'Which statement for the particles of solid is not correct?', o: ['they move at great speed', 'they are arranged in regular pattern',
    'there is a very little space between the particles', 'the force of attraction between the particles are strong'], a: 0,
    why: 'Solid particles only <b>vibrate in place</b>. They do not move at great speed.', demo: (s) => solidDemo(s) },
  { q: 'A liquid boils when its vapour pressure becomes equal to:', o: ['760cm of Hg', '1 Pascal', '101.325 kilo Pascal', '0.1 atm'], a: 2,
    why: 'It boils when vapour pressure = air pressure, 1 atm = <b>101.325 kPa</b> (760 mm of Hg, not cm).', demo: (s) => boilDemo(s) },
  { q: 'The vapour pressure of a liquid increases with the:', o: ['increase of pressure', 'increase of temperature',
    'increase of intermolecular forces', 'increase of polarity of molecules'], a: 1,
    why: 'Hotter molecules move faster and more escape: <b>higher temperature, higher vapour pressure</b>.', demo: (s) => heatDemo(s) },
  { q: 'Water normally boils at 100°C but it is possible to boil at 50°C. Which variable would you have to change to do this?',
    o: ['increase external pressure', 'decrease external pressure', 'increase surface area', 'decrease surface area'], a: 1,
    why: 'Less air pressing on the surface → it boils at a <b>lower temperature</b> (like on a hill).', demo: (s) => lowPDemo(s) },
  { q: 'The vapour pressure of a liquid in a closed container depends upon:', o: ['amount of liquid', 'surface area of the liquid',
    'temperature', 'both (b) and (c)'], a: 2,
    why: 'A little or a lot of liquid gives the same dial: it depends only on <b>temperature</b>.', demo: (s) => amountDemo(s) },
  { q: 'Which one of the following is not an example of amorphous solid?', o: ['rubber', 'glass', 'glucose', 'plastic'], a: 2,
    why: '<b>Glucose</b> forms crystals with a regular pattern. Rubber, glass and plastic are jumbled (amorphous).', demo: (s) => crystalDemo(s) },
  { q: 'At freezing point which one of the following coexists in dynamic equilibrium?', o: ['gas and solid', 'liquid and gas',
    'liquid and solid', 'all of these'], a: 2,
    why: 'At 0 °C ice and water stay together: <b>liquid and solid</b>.', demo: (s) => iceDemo(s) },
  { q: 'Ink spreads in water because of:', o: ['vapour pressure', 'expansion', 'diffusion', 'compressibility of water'], a: 2,
    why: 'Ink particles move from crowded to less crowded through the water: <b>diffusion</b>.', demo: (s) => mixDemo(s, 'ink') },
  { q: 'What will be the pressure of a gas, if the volume of the gas at 2 atmospheres is increased from 1.5 dm³ to 3 dm³?',
    o: ['1 atmosphere', '1.5 atmosphere', '2 atmosphere', '2.5 atmosphere'], a: 0,
    why: 'Boyle: 2 × 1.5 = P₂ × 3, so P₂ = <b>1 atm</b>. Double the volume, half the pressure.', demo: (s) => boyleDemo(s) },
];

export const start = (o) => runQuiz({ ...o, Q, id: 'quiz5', hub: 'games.html?unit=5' });

// molecules that move every frame
function live(d, parent, opt) { const m = new Molecules(parent, opt); d.frame((dt) => m.update(dt)); return m; }

// a box split in two; the wall lifts and the colours mix (or ink spreads through water)
function mixDemo(stage, kind) {
  const d = demoBase(stage), W = 5, H = 3;
  const box = edgeBox(W, H, 1.2); box.position.y = 0.4; d.g.add(box);
  const wall = new THREE.Mesh(new THREE.BoxGeometry(0.06, H, 1.2), new THREE.MeshBasicMaterial({ color: 0x8cbfff, transparent: true, opacity: 0.35 }));
  box.add(wall);
  const lo = V(-W / 2, -H / 2, -0.5), hi = V(W / 2, H / 2, 0.5);
  let A, B;
  if (kind === 'ink') {
    const w = new THREE.Mesh(new THREE.BoxGeometry(W, H, 1.2), WATER); box.add(w);
    A = live(d, box, { n: 12, lo, hi: V(-W / 2 + 0.8, H / 2, 0.5), mat: MOLM.purple, speed: 0.5 });
    wall.visible = false;
  } else {
    A = live(d, box, { n: 12, lo, hi: V(0, H / 2, 0.5), mat: MOLM.air, speed: 2 });
    B = live(d, box, { n: 12, lo: V(0, -H / 2, -0.5), hi, mat: MOLM.gold, speed: 2 });
  }
  return { ...d, async reveal() {
    if (wall.visible) await tween(0.6, (t) => (wall.position.y = H * 1.1 * t), ease.inOut);
    wall.visible = false;
    A.free(lo, hi); B?.free(lo, hi);
    await sleep(1.2);
    stage.tag(`<b>${kind === 'ink' ? 'ink spreads' : 'they mix'}: diffusion</b>`, box, [0, -2.3, 0], 'huge gold');
  } };
}
// a solid: neat rows, each particle only shakes
function solidDemo(stage) {
  const d = demoBase(stage), g = new THREE.Group(); g.position.y = 0.4; d.g.add(g);
  const m = live(d, g, { seats: gridSeats(6, 4, 0.55), mat: MOLM.air, r: 0.24, amp: 0.03 });
  return { ...d, async reveal() {
    await tween(1.2, (t) => (m.amp = 0.03 + 0.05 * Math.sin(t * Math.PI)), ease.lin);
    stage.tag('<b>vibrate in place ✓</b>', g, [0, 1.8, 0], 'big green');
    stage.tag('<b>great speed ✗</b>', g, [0, -1.9, 0], 'big red');
  } };
}
// liquid + gauge: the dial climbs to the air-pressure mark, bubbles rise
function boilDemo(stage) {
  const d = demoBase(stage), j = jar(1.3, 3.0); j.position.set(-1.4, -1.6, 0); d.g.add(j);
  const liq = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 1.6, 32), WATER); liq.position.y = 0.8; j.add(liq);
  live(d, j, { n: 16, lo: V(-0.8, 0.05, -0.3), hi: V(0.8, 1.55, 0.3), r: 0.12, speed: 1 });
  const fl = flame(1.1); fl.position.set(-1.4, -2.6, 0); d.g.add(fl); d.frame(() => fl.userData.tick());
  const G = gauge(0.85); G.g.position.set(1.9, 0.4, 0); d.g.add(G.g); G.set(0.15);
  const bubbles = [];
  return { ...d, async reveal() {
    await G.to(0.75, 1.2);
    for (let k = 0; k < 6; k++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), MOLM.white); b.position.set(-0.6 + 0.25 * k, 0.1, 0); j.add(b); bubbles.push(b);
      tween(1.0, (t) => (b.position.y = 0.1 + 1.6 * t), ease.lin).then(() => (b.visible = false)); await sleep(0.15);
    }
    stage.tag('<b>= 101.325 kPa</b>', G.g, [0, -1.5, 0], 'big gold');
  } };
}
// closed jar: heat it, more molecules fly above, the dial climbs
function heatDemo(stage) {
  const d = demoBase(stage), j = jar(1.3, 3.0); j.position.set(-1.2, -1.6, 0); d.g.add(j);
  const liq = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 1.2, 32), WATER); liq.position.y = 0.6; j.add(liq);
  const vap = live(d, j, { n: 4, lo: V(-1.0, 1.25, -0.4), hi: V(1.0, 2.95, 0.4), r: 0.12, speed: 1.2 });
  const G = gauge(0.85); G.g.position.set(2.0, 0.4, 0); d.g.add(G.g); G.set(0.2);
  const T = thermo(2.4); T.g.position.set(0.6, 0.1, 0.3); j.add(T.g); T.set(0.2);
  return { ...d, async reveal() {
    const fl = flame(1.1); fl.position.set(-1.2, -2.6, 0); d.g.add(fl); d.frame(() => fl.userData.tick());
    vap.speed = 2.6;
    const extra = live(d, j, { n: 10, lo: V(-1.0, 1.25, -0.4), hi: V(1.0, 2.95, 0.4), r: 0.12, speed: 2.6, mat: MOLM.gold });
    extra.g.scale.setScalar(0.001);
    await Promise.all([T.to(0.8, 1.2), G.to(0.75, 1.2), tween(1.2, (t) => extra.g.scale.setScalar(Math.max(0.001, t)))]);
    stage.tag('<b>hotter → higher vapour pressure</b>', d.g, [0, 2.6, 0], 'big gold');
  } };
}
// air arrows press on water; take some away and it boils at a lower temperature
function lowPDemo(stage) {
  const d = demoBase(stage), j = jar(1.4, 2.4); j.position.set(0, -1.8, 0); d.g.add(j);
  const liq = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 1.6, 32), WATER); liq.position.y = 0.8; j.add(liq);
  live(d, j, { n: 16, lo: V(-0.9, 0.05, -0.3), hi: V(0.9, 1.55, 0.3), r: 0.12, speed: 1 });
  const arrows = [-0.9, 0, 0.9].map((x) => { const a = arrow3(1.6, MOLM.white); a.rotation.z = Math.PI; a.position.set(x, 1.8 + 1.6, 0); j.add(a); return a; });
  const T = thermo(2.2); T.g.position.set(2.4, -1.8, 0); d.g.add(T.g); T.set(0.9);
  return { ...d, async reveal() {
    await tween(0.9, (t) => arrows.forEach((a, k) => { a.scale.setScalar(1 - 0.5 * t); a.visible = k !== 1 || t < 0.5; }));
    await T.to(0.45, 0.9);
    for (let k = 0; k < 6; k++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), MOLM.white); b.position.set(-0.6 + 0.25 * k, 0.1, 0); j.add(b);
      tween(1.0, (t) => (b.position.y = 0.1 + 1.6 * t), ease.lin).then(() => (b.visible = false)); await sleep(0.15);
    }
    stage.tag('<b>less pressure → boils at 50 °C</b>', d.g, [0, -2.8, 0], 'big gold');
  } };
}
// a little or a lot of liquid: same dial
function amountDemo(stage) {
  const d = demoBase(stage), G = [];
  [[-1.8, 0.5], [1.8, 1.6]].forEach(([x, h]) => {
    const j = jar(1.0, 3.0); j.position.set(x, -2.0, 0); d.g.add(j);
    const liq = new THREE.Mesh(new THREE.CylinderGeometry(0.96, 0.96, h, 32), WATER); liq.position.y = h / 2; j.add(liq);
    live(d, j, { n: 6, lo: V(-0.7, h + 0.05, -0.3), hi: V(0.7, 2.95, 0.3), r: 0.11, speed: 1.6 });
    const g = gauge(0.6); g.g.position.set(0, 3.9, 0); j.add(g.g); g.set(0.1); G.push(g);
  });
  return { ...d, async reveal() {
    await Promise.all(G.map((g) => g.to(0.55, 1.0)));
    stage.tag('<b>same temperature = same pressure</b>', d.g, [0, -2.8, 0], 'big gold');
  } };
}
// glucose: neat crystal rows; glass: jumbled
function crystalDemo(stage) {
  const d = demoBase(stage), a = new THREE.Group(), b = new THREE.Group();
  a.position.set(-2.2, 0.4, 0); b.position.set(2.2, 0.4, 0); d.g.add(a, b);
  live(d, a, { seats: gridSeats(4, 4, 0.5), mat: MOLM.gold, r: 0.2, amp: 0.02 });
  const jumble = []; while (jumble.length < 16) { const p = V((Math.random() - 0.5) * 1.8, (Math.random() - 0.5) * 1.8, 0); if (jumble.every((q) => q.distanceTo(p) > 0.38)) jumble.push(p); }
  live(d, b, { seats: jumble, mat: MOLM.glassP, r: 0.2, amp: 0.02 });
  return { ...d, async reveal() {
    stage.tag('<b>glucose: crystal</b>', a, [0, -1.6, 0], 'big gold');
    await sleep(0.4);
    stage.tag('glass: amorphous', b, [0, -1.6, 0], 'big');
  } };
}
// ice cubes floating in water: both stay
function iceDemo(stage) {
  const d = demoBase(stage), box = edgeBox(4.4, 2.6, 1.6, { open: true }); box.position.y = -0.6; d.g.add(box);
  const w = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.9, 1.6), WATER); w.position.y = -0.35; box.add(w);
  live(d, box, { n: 14, lo: V(-2.2, -1.3, -0.7), hi: V(2.2, 0.6, 0.7), r: 0.11, speed: 1.2 });
  const cubes = [-1.2, 0.3, 1.5].map((x, k) => {
    const c = new THREE.Group(); c.position.set(x, 0.5, 0); box.add(c);
    live(d, c, { seats: gridSeats(3, 3, 0.26), mat: MOLM.white, r: 0.1, amp: 0.015 });
    c.rotation.z = 0.2 * (k - 1); return c;
  });
  const T = thermo(2.4); T.g.position.set(2.9, -1.9, 0); d.g.add(T.g); T.set(0.3);
  return { ...d, async reveal() {
    await tween(1.2, (t) => cubes.forEach((c, k) => (c.position.y = 0.5 + 0.08 * Math.sin(6 * t + k))));
    stage.tag('<b>0 °C: liquid + solid</b>', d.g, [0, 1.6, 0], 'huge gold');
  } };
}
// Boyle: lift the piston from 1.5 to 3, the dial falls from 2 to 1
function boyleDemo(stage) {
  const d = demoBase(stage), P = pistonCyl(1.2, 4.2); P.g.position.set(-1.3, -2.2, 0); d.g.add(P.g); P.set(1.5);
  const m = live(d, P.g, { n: 14, lo: V(-0.9, 0, -0.35), hi: V(0.9, 1.5, 0.35), r: 0.12, speed: 2.6 });
  const G = gauge(0.85); G.g.position.set(2.0, 0.4, 0); d.g.add(G.g); G.set(0.66);
  const vt = stage.tag('<b>1.5 dm³</b>', P.g, [2.0, 0.6, 0], 'big'), pt = stage.tag('<b>2 atm</b>', G.g, [0, -1.3, 0], 'big');
  return { ...d, async reveal() {
    await Promise.all([tween(1.2, (t) => { const y = 1.5 + 1.5 * t; P.set(y); m.hi.y = y; }), G.to(0.33, 1.2)]);
    vt.innerHTML = '<b>3 dm³</b>'; pt.innerHTML = '<b>1 atm</b>';
    stage.tag('<b>2 × 1.5 = 1 × 3</b>', d.g, [0, 2.9, 0], 'huge gold');
  } };
}
