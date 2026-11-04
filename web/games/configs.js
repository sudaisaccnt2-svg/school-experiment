// Config Writer (Unit 2, film 07, book pp.51-52, Table 2.4): writing electronic configurations until it is easy.
//   🧱 Build        the element's electrons wait in a pile; tap the sub-shell each one goes to (lowest free first).
//                   The configuration writes itself. Later only the symbol is given; last rounds are timed.
//   ✍️ Write        write it yourself with sub-shell and number buttons; the atom fills as you write.
//   🕵️ Who am I?    a configuration (later shells 2, 8, 5, then only the last part) → tap the element (Table 2.4 tiles).
//   🔍 Mistake      one part of the configuration is wrong (2s³, 3p before 3s, 3d before 4s …): tap it; it fixes itself.
import { THREE, sleep, tween, popIn, ball, emissive, COLORS, M } from './kit.js';
import { runGame, tile, shake, SUP } from './rounds.js';
import { Atom, ELEMENTS } from './atom.js';

const SUBS = ['1s', '2s', '2p', '3s', '3p', '4s'];
const SEATS = { s: 2, p: 6 };
const css = (l) => '#' + COLORS[l].toString(16).padStart(6, '0');
export function cfgOf(Z) {                      // [['1s', 2], …] (book: 4s fills before 3d; Z ≤ 20)
  const out = []; let left = Z;
  for (const s of SUBS) { if (left <= 0) break; const n = Math.min(SEATS[s[1]], left); out.push([s, n]); left -= n; }
  return out;
}
const text = (cfg) => cfg.map(([s, n]) => s + SUP(n)).join(' ');
const shellsOf = (Z) => { const c = [0, 0, 0, 0]; for (const [s, n] of cfgOf(Z)) c[Number(s[0]) - 1] += n; while (!c[c.length - 1]) c.pop(); return c; };
const sym = (Z) => ELEMENTS[Z][0], nameOf = (Z) => ELEMENTS[Z][1];

function atomAt(g, Z, pos = [3.4, 0.6, 0], scale = 0.62) {
  const a = new Atom(g.stage, { tags: false, pos, radii: [1.3, 2.0, 2.7, 3.4] });
  a.group.scale.setScalar(scale); a.setNucleus(Z, Math.round(Z * 1.1));
  g.adopt(a.frame);
  return a;
}

// ---------------------------------------------------------------- 🧱 build
const BUILD = [2, 3, 6, 8, 10, 11, 13, 16, 18, 19];
function build(k, g) {
  const Z = BUILD[k], named = k >= 5, want = cfgOf(Z);
  const G = new THREE.Group(); G.position.set(-0.4, -1.6, 0); g.stage.root.add(G);
  const PER = 0.36, GAP = 0.2, H = (s) => SUBS.indexOf(s) * 0.38;
  const boxes = {}; let x = -4.4;
  for (const s of SUBS) {
    const w = SEATS[s[1]] * PER + 0.14, t = tile(s, { w, h: 0.6, d: 0.7, color: css(s[1]), size: 0.5 });
    t.position.set(x + w / 2, H(s), 0); t.userData.sub = s; G.add(t); g.stage.pickable(t);
    boxes[s] = { t, n: 0, x0: x }; x += w + GAP;
  }
  const pile = [];
  for (let j = 0; j < Z; j++) { const e = ball(M.electron, 0.12); e.position.set(-4.0 + (j % 7) * 0.3, 3.2 + Math.floor(j / 7) * 0.3, 0); G.add(e); pile.push(e); }
  const out = g.stage.tag('', G, [0, 4.6, 0], 'huge gold');
  const head = named ? `${sym(Z)} · ${nameOf(Z)}` : `${sym(Z)}: ${Z} electrons`;
  g.goal(head, k);
  const timed = k >= 8;
  let done = 0, first = true, busy = false;
  if (timed) g.timer(25, () => { if (!busy) { busy = true; out.innerHTML = text(want); g.miss(k, text(want)); } });
  const written = () => text(SUBS.filter((s) => boxes[s].n).map((s) => [s, boxes[s].n]));
  g.setTap(async (hit) => {
    if (busy || !hit || !hit.obj.userData.sub) return;
    const s = hit.obj.userData.sub, b = boxes[s];
    const free = SUBS.find((q) => boxes[q].n < SEATS[q[1]]);
    if (s !== free) { first = false; g.wrong(); shake(b.t); return; }
    const e = pile.pop(), to = new THREE.Vector3(b.x0 + 0.07 + PER * (b.n + 0.5), H(s) + 0.45, 0.2);
    b.n++; done++;
    const a = e.position.clone();
    tween(0.45, (u) => { e.position.lerpVectors(a, to, u); e.position.y += Math.sin(u * Math.PI) * 0.8; });
    if (b.n === SEATS[s[1]]) b.t.tint(css(s[1]), 0.9);
    out.innerHTML = written();
    if (done === Z) { busy = true; await sleep(0.6); g.right(k, first, `${sym(Z)} = ${text(want)}`); }
  });
}

// ---------------------------------------------------------------- ✍️ write
const WRITE = [1, 4, 5, 7, 9, 12, 14, 17, 19, 20];
function write(k, g) {
  const Z = WRITE[k], want = cfgOf(Z), atom = atomAt(g, Z);
  const out = g.stage.tag('', atom.group, [0, 3.0, 0], 'huge gold');
  g.goal(`${sym(Z)} (${Z}): write it`, k);
  let i = 0, part = null, first = true, busy = false, typed = [];
  const K = new THREE.Group(); K.position.set(-3.2, -0.4, 0); g.stage.root.add(K);     // a 3D keypad: sub-shells, then numbers
  const keys = {};
  SUBS.forEach((s, j) => { const t = tile(s, { w: 1.0, h: 0.75, color: css(s[1]), size: 0.5 });
    t.position.set((j % 3) * 1.12 - 1.12, 1.4 - Math.floor(j / 3) * 0.88, 0); t.userData.key = s; K.add(t); g.stage.pickable(t); keys[s] = t; });
  [1, 2, 3, 4, 5, 6].forEach((n, j) => { const t = tile(SUP(n), { w: 1.0, h: 0.75, color: '#8a7550', size: 0.75 });
    t.position.set((j % 3) * 1.12 - 1.12, -0.6 - Math.floor(j / 3) * 0.88, 0); t.userData.key = 'n' + n; K.add(t); g.stage.pickable(t); keys['n' + n] = t; });
  g.setTap(async (hit) => {
    if (busy || !hit || !hit.obj.userData.key) return;
    const key = hit.obj.userData.key, btn = keys[key];
    const [ws, wn] = want[i];
    popIn(btn, 1, 0.2);
    if (!part) {
      if (key !== ws) { first = false; g.wrong(); shake(btn); return; }
      part = key; out.innerHTML = text(typed) + (typed.length ? ' ' : '') + key;
    } else {
      if (key !== 'n' + wn) { first = false; g.wrong(); shake(btn); return; }
      typed.push([part, wn]); part = null; i++;
      out.innerHTML = text(typed);
      const sh = shellsOf(Z), filled = typed.reduce((a, [, n]) => a + n, 0);   // the atom fills as you write
      let left = filled; atom.setConfig(sh.map((c) => { const t = Math.min(c, left); left -= t; return t; }));
      if (i === want.length) { busy = true; await sleep(0.5); g.right(k, first, `${sym(Z)} = ${text(want)}`); }
    }
  });
  if (k >= 7) g.timer(25, () => { if (!busy) { busy = true; out.innerHTML = text(want); g.miss(k, text(want)); } });
}

// ---------------------------------------------------------------- 🕵️ who am I?
const WHO = [[3, 'cfg'], [8, 'cfg'], [10, 'cfg'], [12, 'cfg'], [15, 'cfg'], [17, 'shells'], [13, 'shells'], [19, 'shells'], [16, 'last'], [20, 'last']];
function who(k, g) {
  const [Z, form] = WHO[k];
  const G = new THREE.Group(); G.position.set(0, 1.0, 0); G.scale.setScalar(0.85); g.stage.root.add(G);
  const tiles = {};
  for (let z = 1; z <= 20; z++) {               // Table 2.4 style: rows of the periodic table (H, He; Li..Ne; Na..Ar; K, Ca)
    const row = z <= 2 ? 0 : z <= 10 ? 1 : z <= 18 ? 2 : 3;
    const col = z === 1 ? 0 : z === 2 ? 7 : row === 3 ? z - 19 : (z - (row === 1 ? 3 : 11));
    const t = tile(sym(z), { w: 0.9, h: 0.9, d: 0.2, color: '#5a6a8a', size: 0.5 });
    t.position.set((col - 3.5) * 1.05, -row * 1.05, 0); t.userData.z = z; G.add(t); g.stage.pickable(t); tiles[z] = t;
  }
  const cfg = cfgOf(Z);
  const clue = form === 'cfg' ? text(cfg) : form === 'shells' ? shellsOf(Z).join(', ') : '… ' + text(cfg.slice(-1));
  g.stage.tag(clue, G, [0, 1.6, 0], 'huge gold');
  g.goal('Who am I?', k);
  let first = true, busy = false;
  if (k >= 7) g.timer(10, () => { if (!busy) { busy = true; tiles[Z].tint('#4dff88', 0.9); g.miss(k, `${sym(Z)}: ${text(cfg)}`); } });
  g.setTap(async (hit) => {
    if (busy || !hit || !hit.obj.userData.z) return;
    const z = hit.obj.userData.z, t = tiles[z];
    if (z !== Z) { first = false; g.wrong(); shake(t); return; }
    busy = true; t.tint('#4dff88', 0.9); popIn(t, 1.15, 0.4);
    g.right(k, first, `${nameOf(Z)}: ${text(cfg)}`);
  });
}

// ---------------------------------------------------------------- 🔍 spot the mistake
const MIST = [[6, ['1s²', '2s³', '2p¹'], 1, '2s²', 's holds only 2'], [3, ['1s¹', '2s²'], 0, '1s²', '1s fills first'],
  [11, ['1s²', '2s²', '2p⁶', '3p¹'], 3, '3s¹', '3s comes before 3p'], [12, ['1s²', '2s²', '2p⁶', '3s³'], 3, '3s²', 's holds only 2'],
  [15, ['1s²', '2s²', '2p⁸', '3s²', '3p¹'], 2, '2p⁶', 'p holds only 6'], [13, ['1s²', '2s²', '2p⁶', '3s²', '3p²'], 4, '3p¹', 'Al has 13 electrons'],
  [19, ['1s²', '2s²', '2p⁶', '3s²', '3p⁶', '3d¹'], 5, '4s¹', '4s is lower than 3d'], [20, ['1s²', '2s²', '2p⁶', '3s²', '3p⁶', '3d²'], 5, '4s²', '4s is lower than 3d']];
function mistake(k, g) {
  const [Z, terms, bad, fix, why] = MIST[k];
  const G = new THREE.Group(); G.position.set(0, 0.2, 0); g.stage.root.add(G);
  const W = 1.25, x0 = -((terms.length - 1) * (W + 0.15)) / 2;
  const ts = terms.map((s, i) => {
    const t = tile(s, { w: W, h: 0.85, d: 0.25, color: css(s[1]), size: 0.55 });
    t.position.set(x0 + i * (W + 0.15), 0, 0); t.userData.i = i + 1; G.add(t); g.stage.pickable(t); return t;
  });
  g.stage.tag(`<b>${sym(Z)}</b> (${Z})`, G, [0, 1.5, 0], 'huge');
  g.goal('Tap the wrong part', k);
  let first = true, busy = false;
  if (k >= 6) g.timer(10, () => { if (!busy) { busy = true; ts[bad].set(fix); ts[bad].tint('#4dff88', 0.9); g.miss(k, `${fix}: ${why}`); } });
  g.setTap(async (hit) => {
    if (busy || !hit || !hit.obj.userData.i) return;
    const i = hit.obj.userData.i - 1;
    if (i !== bad) { first = false; g.wrong(); shake(ts[i]); return; }
    busy = true;
    await tween(0.3, (u) => { ts[i].rotation.x = u * Math.PI / 2; });
    ts[i].set(fix); ts[i].tint('#4dff88', 0.9);
    await tween(0.3, (u) => { ts[i].rotation.x = (1 - u) * Math.PI / 2; });
    g.right(k, first, `${fix}: ${why}`);
  });
}

const PARTS = [
  { key: 'build', icon: '🧱', name: 'Build', n: BUILD.length, run: build, done: 'Lowest free sub-shell first: 1s, 2s, 2p, 3s, 3p, 4s.' },
  { key: 'write', icon: '✍️', name: 'Write', n: WRITE.length, run: write, done: 'You can write the configuration of the first 20 elements.' },
  { key: 'who', icon: '🕵️', name: 'Who am I?', n: WHO.length, run: who, done: 'Count the electrons: that number is the element.' },
  { key: 'fix', icon: '🔍', name: 'Mistake', n: MIST.length, run: mistake, done: 's holds 2, p holds 6, and 4s fills before 3d.' },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'configs', parts: PARTS, cam: [0, 0.6, 14], target: [0, 0.6, 0] });
}
