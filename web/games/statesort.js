// State Sorter (Unit 5): a glass jar in 3D. Easy → hard (SKILL):
//   👀 Particles  read the particles (neat and shaking / sliding at the bottom / flying everywhere): which state?
//   🏷️ Names      a named substance: which state at room temperature? (first level: its particles show; then not)
//   💎 Crystal    solids from Activity 5.4: crystalline or amorphous?
// Covers 5.1, 5.3, 5.4, 5.5, Activity 5.4, MCQ ii and vii, Long Q iv, Project Work.
import { THREE, popIn } from './kit.js';
import { runGame, choose, shuffle } from './rounds.js';
import { MOLM, jar, Molecules, gridSeats } from './gas3d.js';

const STATES = ['solid', 'liquid', 'gas'], KINDS = ['crystalline', 'amorphous'];
const WHY = { s: ['neat rows, only shaking', 'close, but sliding past', 'far apart, flying fast'], k: ['a regular pattern', 'jumbled, no pattern'] };
const SEE = shuffle([0, 1, 2, 0, 1, 2, 0, 1, 2]);
const NAMES = shuffle([['mercury', 1], ['oxygen', 2], ['iron nail', 0], ['alcohol', 1], ['neon', 2], ['ice', 0], ['water', 1],
  ['steam', 2], ['sand', 0], ['carbon dioxide', 2]]);
const SOLIDS = shuffle([['table salt', 0], ['glass', 1], ['glucose', 0], ['candle wax', 1], ['baking soda', 0], ['rubber', 1],
  ['pencil lead', 0], ['plastic', 1]]);

function fill(g, J, set, a) {                 // particles in the jar for a state (0 solid, 1 liquid, 2 gas) or a kind
  const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
  let m;
  if (set === 'k' && a === 1) {
    const pts = []; while (pts.length < 16) { const p = V((Math.random() - 0.5) * 1.6, 0.4 + Math.random() * 1.6, 0); if (pts.every((q) => q.distanceTo(p) > 0.36)) pts.push(p); }
    m = new Molecules(J, { seats: pts, mat: MOLM.glassP, r: 0.17, amp: 0.02 });
  } else if (set === 'k' || a === 0) m = new Molecules(J, { seats: gridSeats(4, 4, 0.44, V(0, 1.1)), mat: set === 'k' ? MOLM.gold : MOLM.air, r: 0.17, amp: 0.03 });
  else if (a === 1) m = new Molecules(J, { n: 18, lo: V(-1.0, 0, -0.3), hi: V(1.0, 1.3, 0.3), r: 0.17, speed: 0.8 });
  else m = new Molecules(J, { n: 9, lo: V(-1.1, 0, -0.4), hi: V(1.1, 3.0, 0.4), r: 0.15, speed: 3.2 });
  g.onFrame((dt) => m.update(dt)); popIn(m.g, 1, 0.4);
  return m;
}
function round(g, k, name, set, a, goal, n = 0) {
  const look = name && k < Math.ceil(n / 2);     // first level: the particles show from the start; then from memory
  const J = jar(1.3, 3.1); J.position.set(-1.6, -2.0, 0); g.stage.root.add(J); popIn(J, 1, 0.4);
  if (name) g.stage.tag(`<b>${name}</b>`, J, [0, 3.9, 0], 'huge');
  if (!name || look) fill(g, J, set, a);
  g.goal(goal, k);
  const opts = set === 's' ? STATES : KINDS;
  choose(g, k, opts, opts[a], { w: 2.6, size: 0.45, column: [3.4, 1.0], why: `${name ? name + ': ' : ''}${opts[a]}, ${WHY[set][a]}`,
    onReveal: () => name && !look && fill(g, J, set, a) });
}
const PARTS = [
  { key: 'see', icon: '👀', name: 'Particles', n: SEE.length, run: (k, g) => round(g, k, null, 's', SEE[k], 'Which state is this?') },
  { key: 'name', icon: '🏷️', name: 'Names', n: NAMES.length, run: (k, g) => round(g, k, NAMES[k][0], 's', NAMES[k][1], 'Solid, liquid or gas?', NAMES.length) },
  { key: 'kind', icon: '💎', name: 'Crystal', n: SOLIDS.length, run: (k, g) => round(g, k, SOLIDS[k][0], 'k', SOLIDS[k][1], 'Crystalline or amorphous?', SOLIDS.length) },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'statesort', parts: PARTS, cam: [0, 0.6, 13.5], target: [0, 0.3, 0] });
}
