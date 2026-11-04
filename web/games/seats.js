// Shell Seats (Unit 2, films 04-05, book pp.48-50, Tables 2.2 and 2.3): shell letters, seats per shell (2n²),
// sub-shell seats (s 2, p 6, d 10, f 14), what s p d f stand for, and which sub-shells each shell has. Played, not memorized.
//   🔤 Letters    a shell lights up → tap its letter (K L M N O); later a letter → tap the shell.
//   🪑 Seats      how many electrons fit? After the answer the seats fill one by one round the shell.
//   🔵 Sub-shells s p d f seats, names, and Table 2.3.
import { THREE, tween, popIn, ball, emissive, ringMat, ring, M, nuc } from './kit.js';
import { runGame, tile, shake, shuffle } from './rounds.js';

const L5 = ['K', 'L', 'M', 'N', 'O'], CAP = (n) => 2 * n * n, RAD = (n) => 0.55 + 0.5 * n;
const SCOL = [0x4aa8ff, 0x58c8e8, 0x8ee08a, 0xe8d060, 0xffb347];
const css = (c) => '#' + c.toString(16).padStart(6, '0');

function stadium(g, at = [0, 0.8, 0], s = 1) {
  const G = new THREE.Group(); G.position.set(...at); G.scale.setScalar(s); g.stage.root.add(G);
  const core = new THREE.Group(); G.add(core);
  [[0, 0, 0, 1], [0.1, 0.08, 0.05, 0], [-0.1, 0.05, -0.04, 0], [0.02, -0.1, 0.06, 1]].forEach(([x, y, z, p]) => {
    const b = ball(p ? M.proton : M.neutron, 0.11); b.position.set(x, y, z); core.add(b); });
  const rings = [1, 2, 3, 4, 5].map((n) => {
    const r = ring(RAD(n), ringMat(SCOL[n - 1], 0.35), 0.035); r.userData.n = n; G.add(r);
    const hit = new THREE.Mesh(new THREE.TorusGeometry(RAD(n), 0.2, 6, 48), new THREE.MeshBasicMaterial({ visible: false }));
    hit.userData.n = n; G.add(hit); return { r, hit };
  });
  return { G, rings };
}
const light = (st, n) => st.rings.forEach(({ r }, i) => { r.material = ringMat(SCOL[i], i + 1 === n ? 1.0 : 0.25); r.scale.setScalar(1); if (i + 1 === n) r.material = emissive(SCOL[i], 1.8); });
function fillSeats(g, st, n) {                    // 2n² electrons glide onto the shell one after another
  const c = CAP(n), R = RAD(n);
  for (let j = 0; j < c; j++) {
    const e = ball(M.electron, 0.09); st.G.add(e); e.position.set(0, 0, 0); e.scale.setScalar(0.001);
    const a = (j / c) * Math.PI * 2;
    setTimeout(() => { e.scale.setScalar(0.09); tween(0.35, (u) => e.position.set(Math.cos(a) * R * u, Math.sin(a) * R * u, 0.05)); }, j * (1400 / c));
  }
  g.stage.tag(`${L5[n - 1]}: ${c}`, st.G, [3.6, 0.9, 0], 'huge gold');
}
function tiles(g, list, y = -2.0, w = 1.3, color = '#5a6a8a') {
  return list.map((v, j) => { const t = tile(String(v), { w, h: 0.85, color, size: 0.55 });
    t.position.set((j - (list.length - 1) / 2) * (w + 0.25), y, 0); t.userData.v = v; g.stage.root.add(t); g.stage.pickable(t); return t; });
}
function onPick(g, k, test, done, secs, onOut) {
  let first = true, busy = false;
  if (secs) g.timer(secs, () => { if (!busy) { busy = true; onOut(); } });
  g.setTap(async (hit) => {
    if (busy || !hit) return;
    const r = test(hit.obj); if (r == null) return;
    if (!r) { first = false; g.wrong(); shake(hit.obj); return; }
    busy = true; done(hit.obj, first);
  });
}

// ---------------------------------------------------------------- 🔤 letters
const LET = [[1, 'l'], [2, 'l'], [3, 'l'], [5, 'l'], [4, 'l'], ['M', 's'], ['K', 's'], ['O', 's'], ['N', 's'], ['L', 's']];
function letters(k, g) {
  const [x, mode] = LET[k], n = mode === 'l' ? x : L5.indexOf(x) + 1;
  const st = stadium(g, [0, 1.15, 0], 0.72);
  if (mode === 'l') {
    light(st, n); g.stage.tag(`n = ${n}`, st.G, [-3.6, 0.9, 0], 'huge');
    tiles(g, L5, -1.75, 1.1); g.goal('Which letter?', k);
    onPick(g, k, (o) => (o.userData.v ? o.userData.v === L5[n - 1] : null),
      (o, first) => { o.tint('#4dff88', 0.9); g.right(k, first, `Shell ${n} = ${L5[n - 1]}`); }, k >= 3 ? 6 : 0, () => g.miss(k, `Shell ${n} = ${L5[n - 1]}`));
  } else {
    light(st, 0); st.rings.forEach(({ hit }) => g.stage.pickable(hit));
    g.stage.tag(x, st.G, [-3.6, 0.9, 0], 'huge gold'); g.goal('Tap this shell', k);
    onPick(g, k, (o) => (o.userData.n ? o.userData.n === n : null),
      (o, first) => { light(st, n); g.right(k, first, `${x} is shell ${n}`); }, k >= 8 ? 6 : 0, () => { light(st, n); g.miss(k, `${x} is shell ${n}`); });
  }
}

// ---------------------------------------------------------------- 🪑 seats (Table 2.2)
const SEATR = [1, 2, 3, 2, 4, 1, 5, 3, 4, 2];
function seats(k, g) {
  const n = SEATR[k], hide = k >= 6, want = CAP(n);
  const st = stadium(g, [0, 1.15, 0], 0.72); light(st, n);
  g.stage.tag(hide ? `n = ${n}` : `${L5[n - 1]}  (n = ${n})`, st.G, [-3.6, 0.9, 0], 'huge');
  const traps = [n * n, 2 * n, want + 2, n === 1 ? 4 : CAP(n - 1)].filter((v) => v !== want);
  const opts = k < 3 ? shuffle([2, 8, 18, 32, 50]) : shuffle([want, ...shuffle([...new Set(traps)]).slice(0, 3)]);
  tiles(g, opts, -1.75, 1.2); g.goal('How many electrons fit?', k);
  const why = `2 × ${n}² = ${want}`;
  onPick(g, k, (o) => (o.userData.v != null ? o.userData.v === want : null),
    (o, first) => { o.tint('#4dff88', 0.9); fillSeats(g, st, n); g.right(k, first, why, 3.0); },
    k >= 6 ? 8 : 0, () => { fillSeats(g, st, n); g.miss(k, why, 3.0); });
}

// ---------------------------------------------------------------- 🔵 sub-shells (seats, names, Table 2.3)
const SUBR = [['cap', 's'], ['cap', 'p'], ['cap', 'd'], ['cap', 'f'], ['name', 's'], ['name', 'p'], ['name', 'd'], ['name', 'f'],
  ['has', 2], ['has', 4], ['sum', 3]];
const SUBCAP = { s: 2, p: 6, d: 10, f: 14 }, SUBNAME = { s: 'sharp', p: 'principal', d: 'diffused', f: 'fundamental' };
const SUBCOL = { s: 0x4aa8ff, p: 0x4dff88, d: 0xffb347, f: 0xd77bff };
function subs(k, g) {
  const [kind, x] = SUBR[k];
  let opts, want, head, why, after = () => {};
  if (kind === 'cap' || kind === 'name') {
    const t = tile(x, { w: 1.6, h: 1.6, d: 0.4, color: css(SUBCOL[x]), size: 0.75 }); t.position.set(0, 1.2, 0); g.stage.root.add(t); popIn(t, 1, 0.4);
    if (kind === 'cap') {
      opts = shuffle([2, 6, 10, 14]); want = SUBCAP[x]; head = 'How many electrons fit?'; why = `${x} holds ${want}`;
      after = () => { for (let j = 0; j < want; j++) { const e = ball(M.electron, 0.11); e.position.set((j - (want - 1) / 2) * 0.3, -0.2, 0.3); g.stage.root.add(e); popIn(e, 0.11, 0.2 + j * 0.04); } };
    } else { opts = shuffle(Object.values(SUBNAME)); want = SUBNAME[x]; head = `What does ${x} stand for?`; why = `${x} = ${want}`; }
  } else if (kind === 'has') {
    const st = stadium(g, [0, 1.15, 0], 0.62); light(st, x);
    g.stage.tag(L5[x - 1], st.G, [-3.4, 0.9, 0], 'huge gold');
    opts = ['s', 's p', 's p d', 's p d f']; want = opts[x - 1]; opts = shuffle(opts); head = `Which sub-shells does ${L5[x - 1]} have?`;
    why = `${L5[x - 1]}: ${want.split(' ').map((l) => x + l).join(' ')}`;
  } else {
    const t = tile('M = 3s + 3p + 3d', { w: 5.4, h: 1.1, color: '#5a6a8a', size: 0.5 }); t.position.set(0, 1.3, 0); g.stage.root.add(t);
    opts = [9, 14, 18, 32]; want = 18; head = 'How many electrons in M?'; why = '2 + 6 + 10 = 18 (= 2 × 3²)';
  }
  tiles(g, opts, -1.75, kind === 'name' ? 2.3 : kind === 'has' ? 1.8 : 1.3, kind === 'name' ? '#5a6a8a' : '#5a6a8a');
  g.goal(head, k);
  onPick(g, k, (o) => (o.userData.v != null ? o.userData.v === want : null),
    (o, first) => { o.tint('#4dff88', 0.9); after(); g.right(k, first, why, 2.8); }, k >= 8 ? 10 : 0, () => { after(); g.miss(k, why); });
}

const PARTS = [
  { key: 'letters', icon: '🔤', name: 'Letters', n: LET.length, run: letters, done: 'n = 1, 2, 3, 4, 5 → K, L, M, N, O.' },
  { key: 'seats', icon: '🪑', name: 'Seats', n: SEATR.length, run: seats, done: 'Shell n holds 2n²: 2, 8, 18, 32, 50.' },
  { key: 'subs', icon: '🔵', name: 'Sub-shells', n: SUBR.length, run: subs, done: 's 2, p 6, d 10, f 14 · sharp, principal, diffused, fundamental.' },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'seats', parts: PARTS, cam: [0, 0.4, 13], target: [0, 0.3, 0] });
}
