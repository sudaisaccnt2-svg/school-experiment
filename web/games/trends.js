// Trend Arrows (Unit 3, films 306-312, book pp.72-87, Fig 3.9): which way does each property go?
//   ➡️ Across   period 2, left → right: does it go up, down or stay the same? Then the book's values rise as bars.
//   ⬇️ Down     a group, top → bottom: the same question; the bars grow sideways.
//   🎯 Corners  on the table (only elements with book values): the biggest atom, the highest IE, the top EN …
import { THREE, tween, emissive } from './kit.js';
import { runGame, tile, shake, arrow3d, shuffle } from './rounds.js';
import { table3d } from './table3d.js';
import { SYM, ZOF, RADIUS, IE1, EA, EN } from './u3data.js';

const P2 = ['Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'], IA = ['Li', 'Na', 'K', 'Rb', 'Cs'], VIIA = ['Cl', 'Br', 'I', 'At'];
const INNER = { Li: 1, Be: 1, B: 1, C: 1, N: 1, O: 1, F: 1, Ne: 1, Na: 2, K: 3, Rb: 4, Cs: 5 };
// property: [name, value(sym), format, across trend, down trend, group used going down]
const PROP = {
  r: ['atomic radius', (s) => RADIUS[s], (v) => v.toFixed(2), 'down', 'up', IA],
  ie: ['ionization energy', (s) => IE1[s], (v) => String(v), 'up', 'down', IA],
  ea: ['electron affinity', (s) => -EA[s], (v) => (v > 0 ? '−' : '+') + Math.abs(v), 'up', 'down', VIIA],
  en: ['electronegativity', (s) => EN[s], (v) => v.toFixed(1), 'up', 'down', IA],
  sh: ['shielding effect', (s) => INNER[s], (v) => `${v} inner`, 'same', 'up', IA],
};
const WORD = { up: 'goes up ↑', down: 'goes down ↓', same: 'stays the same =' };

function row(g, list, dir) {                     // element tiles in a row (across) or a column (down)
  const G = new THREE.Group(); g.stage.root.add(G);
  const pos = list.map((s, i) => (dir === 'across' ? new THREE.Vector3((i - (list.length - 1) / 2) * 1.05, -0.75, 0)
    : new THREE.Vector3(-4.0, 1.5 - i * 0.78, 0)));
  list.forEach((s, i) => { const t = tile(s, { w: 0.85, h: 0.65, color: '#5a6a8a', size: 0.55 }); t.position.copy(pos[i]); G.add(t); });
  const a = pos[0].clone(), b = pos[pos.length - 1].clone();
  if (dir === 'across') { a.y = b.y = -1.25; a.x -= 0.4; b.x += 0.4; } else { a.x = b.x = -4.75; a.y += 0.3; b.y -= 0.3; }
  G.add(arrow3d(a, b, 0xffc061, 0.05));
  return { G, pos };
}
function bars(g, { G, pos }, list, p, dir) {      // the book's values as bars (missing values are skipped)
  const [, val, fmt] = PROP[p], vs = list.map(val), max = Math.max(...vs.filter((v) => v != null && !isNaN(v)).map(Math.abs));
  list.forEach((s, i) => {
    const v = vs[i]; if (v == null || isNaN(v)) return;
    const L = Math.max(0.06, (Math.abs(v) / max) * (dir === 'across' ? 2.4 : 3.3)), neg = v < 0;
    const b = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), emissive(neg ? 0xff5040 : 0x4dff88, 0.5)); G.add(b);
    const base = pos[i].clone();
    if (dir === 'across') { b.scale.set(0.5, 0.001, 0.4); base.y += 0.45; }
    else { b.scale.set(0.001, 0.45, 0.4); base.x += 0.6; }
    tween(0.8, (u) => { const h = Math.max(0.001, L * u);
      if (dir === 'across') { b.scale.y = h; b.position.set(base.x, base.y + h / 2, 0); } else { b.scale.x = h; b.position.set(base.x + h / 2, base.y, 0); } });
    const tagAt = dir === 'across' ? [0, L / 2 + 0.25, 0] : [L / 2 + 0.55, 0, 0];
    setTimeout(() => g.stage.tag(fmt(v), b, tagAt, 'big'), 850);
  });
}
function trendRound(k, g, p, dir) {
  const [name, , , across, down, grp] = PROP[p], list = dir === 'across' ? P2 : grp, want = dir === 'across' ? across : down;
  const R = row(g, list, dir);
  const card = tile(name, { w: 4.6, h: 0.9, color: '#3d6ab0', size: 0.5 });
  card.position.set(dir === 'across' ? 0 : -1.0, dir === 'across' ? 2.75 : 2.55, 0); g.stage.root.add(card);
  const opts = shuffle(['up', 'down', 'same']);
  const T = opts.map((v, j) => { const t = tile(WORD[v], { w: dir === 'across' ? 3.2 : 2.6, h: 0.8, color: '#5a6a8a', size: 0.42 });
    if (dir === 'across') t.position.set((j - 1) * 3.45, -1.95, 0); else t.position.set(3.75, 1.1 - j * 1.05, 0); t.userData.v = v; g.stage.root.add(t); g.stage.pickable(t); return t; });
  g.goal(dir === 'across' ? 'Across a period, it…' : 'Down a group, it…', k);
  const why = `${name}: ${WORD[want]}${p === 'ea' || p === 'ie' ? ' (generally)' : ''}`;
  let first = true, busy = false;
  if (k >= 4) g.timer(8, () => { if (!busy) { busy = true; bars(g, R, list, p, dir); g.miss(k, why, 3.6); } });
  g.setTap(async (hit) => {
    if (busy || !hit || !hit.obj.userData.v) return;
    if (hit.obj.userData.v !== want) { first = false; g.wrong(); shake(hit.obj); return; }
    busy = true; hit.obj.tint('#4dff88', 0.9); bars(g, R, list, p, dir);
    g.right(k, first, why, 3.6);
  });
}

// ---------------------------------------------------------------- 🎯 corners (Table 3.1, 3.3, Fig 3.8 values)
const HAS = Array.from({ length: 118 }, (_, k) => k + 1).filter((z) => RADIUS[SYM[z]] != null);
const CORN = [['the biggest atom', 'Cs', 'Cs 2.35 Å: bottom left'], ['the biggest atom of period 2', 'Li', 'Li 1.23 Å: the left end'],
  ['the highest ionization energy', 'He', 'He 2372: top right'], ['the lowest ionization energy', 'Cs', 'Cs 376: bottom left'],
  ['the most electronegative', 'F', 'F 4.0: top right'], ['the least electronegative', 'Cs', 'Cs 0.7: bottom left'],
  ['the most negative electron affinity', 'Cl', 'Cl −349: even more than F (−328)']];
function corners(k, g) {
  const [what, s, why] = CORN[k], z = ZOF[s];
  const T = table3d(g.stage, { zs: HAS, color: 'cat', numbers: false, size: 0.5, gap: 0.06 });
  T.group.position.set(0, 0.9, 0);
  g.stage.tag(`Tap ${what}`, T.group, [0, 2.3, 0], 'huge gold');
  g.goal('Which one?', k);
  let first = true, busy = false;
  const show = () => { T.dim([z]); T.pop(z, 1.8); };
  if (k >= 4) g.timer(8, () => { if (!busy) { busy = true; show(); g.miss(k, why); } });
  g.setTap(async (hit) => {
    if (busy || !hit || !hit.obj.userData.z) return;
    const q = hit.obj.userData.z;
    if (q !== z) { first = false; g.wrong(); T.shake(q); return; }
    busy = true; show(); g.right(k, first, why, 2.8);
  });
}

const ACR = ['r', 'ie', 'en', 'sh', 'ea'], DWN = ['r', 'ie', 'sh', 'en', 'ea'];
const PARTS = [
  { key: 'across', icon: '➡️', name: 'Across', n: ACR.length, run: (k, g) => trendRound(k, g, ACR[k], 'across'),
    done: 'Across: smaller atoms; IE, EA and EN go up; shielding stays the same.' },
  { key: 'down', icon: '⬇️', name: 'Down', n: DWN.length, run: (k, g) => trendRound(k, g, DWN[k], 'down'),
    done: 'Down: bigger atoms and more shielding; IE, EA and EN go down.' },
  { key: 'corners', icon: '🎯', name: 'Corners', n: CORN.length, run: corners, done: 'Bottom left: big, loses electrons. Top right: small, pulls hardest.' },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'trends', parts: PARTS, cam: [0, 0.4, 13.5], target: [0, 0.3, 0] });
}
