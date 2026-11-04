// Metal or Not (Unit 3, film 301, book p.67): metals, non-metals and metalloids, learned by sorting.
//   🗑️ Sort       an element card → tap its bin (metal / non-metal / metalloid); then it shows where it lives.
//   🪜 Staircase  on the table: tap a metalloid, a non-metal, a metal (first with the staircase drawn, then without).
//   ⚡ Speed      cards come fast; a few seconds each.
import { THREE, popIn, tween } from './kit.js';
import { runGame, tile, shake, shuffle } from './rounds.js';
import { table3d } from './table3d.js';
import { SYM, NAME, ZOF, category, place } from './u3data.js';

const ALL = Array.from({ length: 118 }, (_, k) => k + 1);
const kind = (z) => { const c = category(z); return c === 'metalloid' ? 'metalloid' : ['nonmetal', 'halogen', 'noble'].includes(c) ? 'non-metal' : 'metal'; };
const KCOL = { metal: '#59a8ff', 'non-metal': '#4dff8c', metalloid: '#ff9a40' };
const KIND3 = ['metal', 'metalloid', 'non-metal'];

function bins(g) {
  return shuffle(KIND3).map((k, j) => {
    const B = new THREE.Group(); B.position.set((j - 1) * 3.6, -1.55, 0); g.stage.root.add(B);
    const box = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.9, 1.2), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(KCOL[k]).multiplyScalar(0.3),
      roughness: 0.4, clearcoat: 1, transparent: true, opacity: 0.85 }));
    B.add(box); const lab = tile(k, { w: 2.8, h: 0.7, d: 0.05, color: KCOL[k], size: 0.5 }); lab.position.z = 0.63; B.add(lab);
    B.userData.v = k; g.stage.pickable(B); return B;
  });
}
function mini(g, z) {
  const T = table3d(g.stage, { size: 0.29, gap: 0.03, numbers: false, pickable: false, color: (q) => KCOL[kind(q)] });
  T.group.position.set(0, 2.2, -0.4); T.dim([z], 0.4); T.pop(z, 2.2); return T;
}

// ---------------------------------------------------------------- 🗑️ sort (and ⚡ speed)
const SORT = ['Na', 'O', 'Si', 'Fe', 'Cl', 'B', 'Cu', 'S', 'Ge', 'Al', 'Ne', 'As'];
const FAST = ['Mg', 'C', 'Te', 'K', 'N', 'Sb', 'Ca', 'Br', 'Si', 'Zn', 'P', 'B'];
function sort(k, g, list, secs) {
  const z = ZOF[list[k]], want = kind(z);
  const card = tile(`${SYM[z]}  ${NAME[z]}`, { w: 4.0, h: 1.0, d: 0.25, color: '#3d6ab0', size: 0.5 });
  card.position.set(0, 0.6, 0.3); g.stage.root.add(card); popIn(card, 1, 0.4);
  const B = bins(g);
  g.goal('Metal, metalloid or non-metal?', k);
  const why = `${NAME[z]}: ${want}`;
  const drop = async (bin) => { const a = card.position.clone(), b = bin.position.clone().add(new THREE.Vector3(0, 0.3, 0.3));
    await tween(0.5, (u) => { card.position.lerpVectors(a, b, u); card.scale.setScalar(1 - 0.5 * u); }); mini(g, z); };
  let first = true, busy = false;
  if (secs) g.timer(secs, () => { if (!busy) { busy = true; drop(B.find((b) => b.userData.v === want)); g.miss(k, why); } });
  g.setTap(async (hit) => {
    if (busy || !hit || !hit.obj.userData.v) return;
    if (hit.obj.userData.v !== want) { first = false; g.wrong(); shake(hit.obj); return; }
    busy = true; await drop(hit.obj); g.right(k, first, why, 2.6);
  });
}

// ---------------------------------------------------------------- 🪜 staircase
const STAIR = [['metalloid', true], ['non-metal', true], ['metal', true], ['metalloid', true], ['non-metal', false],
  ['metalloid', false], ['metal', false], ['metalloid', false]];
function staircase(k, g) {
  const [want, line] = STAIR[k];
  const T = table3d(g.stage, { color: 'plain', numbers: false, size: 0.4, gap: 0.05 });
  T.group.position.set(0, 0.6, 0);
  if (line) ALL.filter((z) => kind(z) === 'metalloid').forEach((z) => T.mark(z));   // the staircase, framed in gold
  g.stage.tag(`Tap a ${want}`, T.group, [0, 2.3, 0], 'huge gold');
  g.goal('Find it', k);
  const ok = (z) => kind(z) === want;
  const why = { metal: 'Metals: the left and the middle (most elements)', 'non-metal': 'Non-metals: top right',
    metalloid: 'Metalloids: on the staircase (B, Si, Ge, As, Sb, Te)' }[want];
  const show = () => { T.recolor((q) => KCOL[kind(q)]); T.dim(ALL.filter(ok)); };
  let first = true, busy = false;
  if (k >= 6) g.timer(8, () => { if (!busy) { busy = true; show(); g.miss(k, why); } });
  g.setTap(async (hit) => {
    if (busy || !hit || !hit.obj.userData.z) return;
    const z = hit.obj.userData.z;
    if (!ok(z)) { first = false; g.wrong(); T.shake(z); return; }
    busy = true; show(); T.pop(z, 1.6); g.right(k, first, why, 2.8);
  });
}

const PARTS = [
  { key: 'sort', icon: '🗑️', name: 'Sort', n: SORT.length, done: 'Most elements are metals; metalloids are half and half.',
    run: (k, g) => sort(k, g, SORT, k >= 8 ? 8 : 0) },
  { key: 'stairs', icon: '🪜', name: 'Staircase', n: STAIR.length, run: staircase, done: 'Metals left, non-metals top right, metalloids on the staircase.' },
  { key: 'speed', icon: '⚡', name: 'Speed', n: FAST.length, done: 'Fast and right!', run: (k, g) => sort(k, g, FAST, k < 6 ? 6 : 4) },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'metalsort', parts: PARTS, cam: [0, 0.4, 13.5], target: [0, 0.3, 0] });
}
