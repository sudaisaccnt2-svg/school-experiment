// Mixture Sorter (Unit 6): a glass beaker in 3D with a name over it. Solution, colloid or suspension? Then which
// kind of solution (by states)? Last, pure substance or mixture? After the right answer the particles appear in the
// beaker to show why (tiny and even, medium and lit by a beam, big and settling, one kind or many kinds).
// In the first level of each part the particles show from the start; in the second only the name (from memory).
// Covers Short Q iii, Long Q i (types by state) and the Project Work of p.181.
import { THREE, emissive, sleep, tween, ease, popIn } from './kit.js';
import { runGame, choose, shuffle } from './rounds.js';
import { MOLM, WATER, jar, Molecules, gridSeats } from './gas3d.js';

const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
const SETS = {
  c: ['solution', 'colloid', 'suspension'],
  t: ['solid in solid', 'gas in liquid', 'liquid in liquid'],
  p: ['pure substance', 'mixture'],
};
// [name, answer, set, why]
const ROUNDS = [
  ['milk', 1, 'c', 'particles scatter light but never settle'], ['hot cup of tea', 0, 'c', 'dissolved all through: clear'],
  ['orange juice with pulp', 2, 'c', 'the pulp is big: it settles'], ['mayonnaise', 1, 'c', 'oil drops spread in liquid (emulsion)'],
  ['Listerine mouthwash', 0, 'c', 'clear and uniform'], ['milk of magnesia', 2, 'c', 'it settles: shake before use'],
  ['cheese', 1, 'c', 'liquid spread in a solid (solid emulsion)'], ['mist', 1, 'c', 'liquid drops in air (aerosol)'],
  ['mineral water', 0, 'c', 'salts dissolved: clear'],
  ['brass', 0, 't', 'zinc in copper: solid in solid'], ['soda water', 1, 't', 'CO₂ in water: gas in liquid'],
  ['alcohol in water', 2, 't', 'liquid in liquid'],
  ['sea water', 1, 'p', 'salts in water'], ['cooking oil', 1, 'p', 'many kinds of oil molecules'], ['coal', 1, 'p', 'carbon with other things'],
  ['steel', 1, 'p', 'iron + carbon (an alloy)'], ['chilli sauce', 1, 'p', 'many things mixed'], ['bronze', 1, 'p', 'copper + tin (an alloy)'],
  ['sand', 1, 'p', 'grains of different minerals'], ['gold', 0, 'p', 'only gold atoms'], ['orange squash', 1, 'p', 'sugar, juice, water'],
  ['salt', 0, 'p', 'only NaCl'], ['milk', 1, 'p', 'water, fat, protein …'], ['oxygen gas', 0, 'p', 'only O₂ molecules'],
  ['air', 1, 'p', 'N₂, O₂, CO₂ …'], ['orange juice', 1, 'p', 'water, sugar, pulp …'], ['Coke', 1, 'p', 'water, sugar, CO₂ …'],
  ['soil', 1, 'p', 'sand, clay, water, air …'],
].map(([name, a, set, why]) => ({ name, a, set, why }));

function beaker(g, R) {
  const J = jar(1.3, 3.0); J.position.set(-1.7, -2.0, 0); g.stage.root.add(J); popIn(J, 1, 0.4);
  const live = (o) => { const m = new Molecules(J, o); g.onFrame((dt) => m.update(dt)); popIn(m.g, 1, 0.4); return m; };
  const water = (h = 2.2) => { const w = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, h, 32), WATER); w.position.y = h / 2; J.add(w); return w; };
  const lo = V(-0.95, 0.05, -0.3), hi = (h) => V(0.95, h, 0.3);

  // the particles that explain the answer
  async function fill(R) {
    if (R.set === 'c') {
      water();
      if (R.a === 0) live({ n: 30, lo, hi: hi(2.2), mat: MOLM.gold, r: 0.05, speed: 0.6 });
      if (R.a === 1) {
        live({ n: 18, lo, hi: hi(2.2), mat: MOLM.white, r: 0.1, speed: 0.4 });
        const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.5, 16), emissive(0xfff2b0, 2.5));
        beam.rotation.z = Math.PI / 2; beam.position.y = 1.2; beam.scale.y = 0.001; J.add(beam);
        await tween(0.7, (t) => (beam.scale.y = Math.max(0.001, t)), ease.out);
      }
      if (R.a === 2) {
        const m = live({ n: 9, lo, hi: hi(2.2), mat: MOLM.brown, r: 0.24, speed: 0.6 });
        await sleep(0.6); m.speed = 0;
        const from = m.list.map((b) => b.position.clone()), to = gridSeats(5, 2, 0.45, V(0, 0.3)).slice(0, 9);
        await tween(1.2, (t) => m.list.forEach((b, k) => b.position.lerpVectors(from[k], to[k], t)), ease.inOut);
        m.seats = to; m.amp = 0.01;
      }
    } else if (R.set === 't') {
      if (R.a === 0) live({ seats: gridSeats(5, 4, 0.42, V(0, 1.0)), mat: MOLM.brown, r: 0.18, amp: 0.02 }).list.forEach((b, k) => k % 4 === 1 && (b.material = MOLM.white));
      if (R.a === 1) { water(); live({ n: 14, lo, hi: hi(2.2), mat: MOLM.air, r: 0.11, speed: 0.8 }); live({ n: 6, lo, hi: hi(2.2), mat: MOLM.white, r: 0.13, speed: 2.4 }); }
      if (R.a === 2) { water(); live({ n: 14, lo, hi: hi(2.2), mat: MOLM.air, r: 0.11, speed: 0.8 }); live({ n: 10, lo, hi: hi(2.2), mat: MOLM.purple, r: 0.13, speed: 0.8 }); }
    } else {
      if (R.a === 0) live({ seats: gridSeats(4, 4, 0.44, V(0, 1.1)), mat: MOLM.gold, r: 0.17, amp: 0.02 });
      else { live({ n: 10, lo, hi: hi(2.4), mat: MOLM.air, r: 0.15, speed: 0.8 }); live({ n: 7, lo, hi: hi(2.4), mat: MOLM.gold, r: 0.15, speed: 0.8 }); live({ n: 5, lo, hi: hi(2.4), mat: MOLM.green, r: 0.15, speed: 0.8 }); }
    }
  }
  return { J, fill: () => fill(R) };
}

// Easy → hard (SKILL): in the first level of each part the particles are already in the beaker (look, then name it);
// in the second level only the name is given (from memory). Options are shuffled.
const GOAL = { c: 'Solution, colloid or suspension?', t: 'What kind of solution?', p: 'Pure substance or mixture?' };
const BY = (set) => shuffle(ROUNDS.filter((R) => R.set === set));
const KIND = BY('c'), STAT = BY('t'), PURE = BY('p');
function round(k, g, list) {
  const R = list[k], B = beaker(g, R), half = Math.ceil(list.length / 2);
  g.stage.tag(`<b>${R.name}</b>`, B.J, [0, 3.8, 0], 'huge');
  if (list.length < 4 || k < half) B.fill();
  g.goal(GOAL[R.set], k);
  choose(g, k, SETS[R.set], SETS[R.set][R.a], { w: 3.0, size: 0.4, column: [3.3, 1.2], why: `${R.name}: ${R.why}`,
    onReveal: () => k >= half && B.fill() });
}
// 🔍 Explore first (SKILL): every item with its particles and its answer; a tap goes on, nothing is wrong.
function explore(k, g) {
  const R = ROUNDS[k], B = beaker(g, R); B.fill();
  g.stage.tag(`<b>${R.name}</b>`, B.J, [0, 3.8, 0], 'huge');
  g.stage.tag(`<b>${SETS[R.set][R.a]}</b>`, g.stage.root, [3.3, 1.2, 0], 'huge gold');
  g.goal(R.why, k); g.setTap(() => g.right(k, true, `${R.name}: ${SETS[R.set][R.a]}`, 0, false));
}
const PARTS = [
  { key: 'explore', icon: '🔍', name: 'Explore', n: ROUNDS.length, run: explore },
  { key: 'kind', icon: '🥛', name: 'Kind', n: KIND.length, run: (k, g) => round(k, g, KIND) },
  { key: 'states', icon: '🧪', name: 'States', n: STAT.length, steps: [], run: (k, g) => round(k, g, STAT) },
  { key: 'pure', icon: '⚗️', name: 'Pure?', n: PURE.length, run: (k, g) => round(k, g, PURE) },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'mixsort', parts: PARTS, cam: [0, 0.6, 13.5], target: [0, 0.3, 0], excite: true });
}
