// Isotope Twins (Unit 2, films 08-09, book pp.52-56, Tables 2.5-2.9): isotopes learned by playing, not memorizing.
//   👯 Twins?       two nuclei (later only their symbols): same element, different mass? (trap: ¹⁴C and ¹⁴N)
//   🔢 Neutrons     a symbol A over Z → how many neutrons? The nucleus then builds itself: Z red + (A − Z) grey.
//   🏷️ Name cards   protium / deuterium / tritium, which isotope is most common, and the book's % (a 100-marble tray).
//   💧 Heavy water  a value from Table 2.6 → tap H₂O or D₂O; both bars then grow so you see who is bigger.
import { THREE, sleep, tween, popIn, ball, emissive, M, nuc } from './kit.js';
import { runGame, tile, shake, shuffle } from './rounds.js';
import { packNucleons } from './atom.js';

const SYM = { 1: 'H', 2: 'He', 6: 'C', 7: 'N', 17: 'Cl', 18: 'Ar', 92: 'U' };
const NAME = { 1: 'hydrogen', 2: 'helium', 6: 'carbon', 7: 'nitrogen', 17: 'chlorine', 18: 'argon', 92: 'uranium' };
const HN = { 1: 'protium', 2: 'deuterium', 3: 'tritium' };
const label = (Z, A) => (Z === 1 ? HN[A] : `${NAME[Z]}-${A}`);

/** A ball-packed nucleus: Z red protons spread among the grey neutrons; big ones shrink to fit radius `fit`. */
function nucleus(Z, A, fit = 1.1) {
  const g = new THREE.Group(), P = packNucleons(A), step = A / Z;
  let next = 0, pc = 0;
  P.forEach((p, i) => {
    const isP = pc < Z && i >= Math.floor(next);
    if (isP) { pc++; next += step; }
    const b = ball(isP ? M.proton : M.neutron, 0.21); b.position.copy(p); g.add(b);
  });
  const r = P.reduce((m, p) => Math.max(m, p.length()), 0) + 0.21;
  g.scale.setScalar(Math.min(1, fit / r));
  return g;
}

// ---------------------------------------------------------------- 👯 twins?
const TWINS = [[[1, 1], [1, 2]], [[6, 12], [7, 14]], [[6, 12], [6, 13]], [[1, 3], [2, 3]], [[17, 35], [17, 37]],
  [[6, 14], [7, 14]], [[1, 2], [1, 3]], [[17, 37], [18, 40]], [[92, 235], [92, 238]], [[6, 13], [6, 14]]];
function twins(k, g) {
  const [a, b] = TWINS[k], yes = a[0] === b[0], showBalls = k < 5;
  const L = new THREE.Group(), R = new THREE.Group(); L.position.set(-2.6, 1.5, 0); R.position.set(2.6, 1.5, 0);
  g.stage.root.add(L, R);
  const sides = [[L, a], [R, b]].map(([G, [Z, A]]) => {
    const n = nucleus(Z, A); if (!showBalls) n.visible = false; G.add(n); popIn(n, n.scale.x, 0.5);
    g.stage.tag(nuc(SYM[Z], A, Z), G, [showBalls ? 0 : 0, showBalls ? -1.45 : 0, 0], 'huge');
    return n;
  });
  const btn = [['yes', 'Isotopes ✓', '#3f9a5c'], ['no', 'Not isotopes ✗', '#9a4a3f']].map(([key, t, c], j) => {
    const T = tile(t, { w: 3.2, h: 0.8, color: c, size: 0.42 }); T.position.set(j ? 2.0 : -2.0, -1.6, 0);
    T.userData.key = key; g.stage.root.add(T); g.stage.pickable(T); return T;
  });
  g.goal('Same element, different mass?', k);
  let first = true, busy = false;
  const why = () => (yes ? `Both have ${a[0]} protons: isotopes` : `${a[0]} protons vs ${b[0]}: different elements`);
  const reveal = () => { sides.forEach((n) => { if (!n.visible) { n.visible = true; popIn(n, n.scale.x, 0.5); } });
    g.stage.tag(`${a[0]} p⁺`, L, [0, 1.55, 0], 'big red'); g.stage.tag(`${b[0]} p⁺`, R, [0, 1.55, 0], 'big red'); };
  if (k >= 7) g.timer(8, () => { if (!busy) { busy = true; reveal(); g.miss(k, why()); } });
  g.setTap(async (hit) => {
    if (busy || !hit || !hit.obj.userData.key) return;
    const T = btn.find((t) => t === hit.obj);
    if ((hit.obj.userData.key === 'yes') !== yes) { first = false; g.wrong(); shake(T); return; }
    busy = true; T.tint('#4dff88', 0.9); reveal();
    g.right(k, first, why(), 3.0);
  });
}

// ---------------------------------------------------------------- 🔢 neutrons
const NEUT = [[1, 1], [1, 2], [1, 3], [6, 12], [6, 13], [6, 14], [17, 35], [17, 37], [92, 234], [92, 238]];
function neutrons(k, g) {
  const [Z, A] = NEUT[k], N = A - Z;
  const G = new THREE.Group(); G.position.set(0, 1.3, 0); g.stage.root.add(G);
  g.stage.tag(nuc(SYM[Z], A, Z), G, [-2.4, 0, 0], 'huge');
  const pool = [...new Set([N, A, Z, N + 1, Math.max(0, N - 1), N + 2])].filter((v) => v >= 0);
  const opts = shuffle([N, ...shuffle(pool.filter((v) => v !== N)).slice(0, k < 3 ? 2 : 3)]);
  const T = opts.map((v, j) => { const t = tile(String(v), { w: 1.3, h: 0.85, color: '#8a93a6', size: 0.6 });
    t.position.set((j - (opts.length - 1) / 2) * 1.6, -1.6, 0); t.userData.v = v; g.stage.root.add(t); g.stage.pickable(t); return t; });
  g.goal('How many neutrons?', k);
  let first = true, busy = false;
  const build = () => { const n = nucleus(Z, A, 1.3); n.position.set(2.2, 0, 0); G.add(n); popIn(n, n.scale.x, 0.6);
    g.stage.tag(`${Z} p⁺  +  ${N} n`, G, [2.2, -1.75, 0], 'big'); };
  if (k >= 6) g.timer(8, () => { if (!busy) { busy = true; build(); g.miss(k, `${A} − ${Z} = ${N} neutrons`); } });
  g.setTap(async (hit) => {
    if (busy || !hit || hit.obj.userData.v == null) return;
    const t = hit.obj;
    if (t.userData.v !== N) { first = false; g.wrong(); shake(t); return; }
    busy = true; t.tint('#4dff88', 0.9); build();
    g.right(k, first, `${A} − ${Z} = ${N} neutrons`, 3.0);
  });
}

// ---------------------------------------------------------------- 🏷️ name cards + how common (book %)
const ABUND = { 1: [[1, 99.985], [2, 0.015], [3, 0]], 6: [[12, 98.98], [13, 1.109], [14, 0]],
  17: [[35, 75.53], [37, 24.47]], 92: [[234, 0.05], [235, 0.75], [238, 99.245]] };
const PCT = (Z, A) => { if (Z === 1 && A === 3) return 'very rare'; if (Z === 6 && A === 14) return '1 in a trillion';
  return ABUND[Z].find(([a]) => a === A)[1] + ' %'; };
const CARDS = [['name', 1, 1], ['name', 1, 2], ['name', 1, 3], ['most', 6], ['most', 17], ['most', 92],
  ['pct', 17, 37], ['pct', 1, 2], ['pct', 6, 13], ['pct', 92, 235]];
function tray(g, Z, at) {                       // 100 marbles, coloured by the book's share of each isotope
  const cols = [0x4aa8ff, 0x4dff88, 0xffb347], G = new THREE.Group(); G.position.set(...at); g.stage.root.add(G);
  const list = ABUND[Z].map(([A, p], i) => [A, Math.round(p), i]).sort((x, y) => y[1] - x[1]);
  const fill = []; list.forEach(([, n, i]) => { for (let q = 0; q < n; q++) fill.push(i); });
  while (fill.length < 100) fill.push(list[0][2]);
  fill.slice(0, 100).reverse().forEach((i, q) => {
    const b = ball(emissive(cols[i], 0.6), 0.11); b.position.set((q % 10) * 0.26 - 1.17, Math.floor(q / 10) * 0.26 - 1.17, 0);
    G.add(b); b.scale.setScalar(0.001); setTimeout(() => popIn(b, 0.11, 0.25), q * 12);
  });
  ABUND[Z].forEach(([A, p], i) => g.stage.tag(`<span style="color:#${cols[i].toString(16).padStart(6, '0')}">●</span> ${label(Z, A)} ${PCT(Z, A)}`,
    G, [2.9, 0.8 - i * 0.7, 0], 'big'));
  return G;
}
function cards(k, g) {
  const [kind, Z, A] = CARDS[k];
  let opts, want, head, why;
  if (kind === 'name') {
    opts = ['protium', 'deuterium', 'tritium']; want = HN[A]; head = 'Which name?'; why = `${HN[A]}: ${A - 1} neutron${A === 2 ? '' : 's'}`;
    const n = nucleus(1, A); n.position.set(1.0, 1.4, 0); g.stage.root.add(n); popIn(n, 2.4, 0.5);
    g.stage.tag(nuc('H', A, 1), g.stage.root, [-1.6, 1.4, 0], 'huge');
  } else if (kind === 'most') {
    opts = ABUND[Z].map(([a]) => label(Z, a)); want = label(Z, ABUND[Z].reduce((m, x) => (x[1] > m[1] ? x : m))[0]);
    head = `Which ${NAME[Z]} is most common?`; why = `${want}: ${PCT(Z, ABUND[Z].reduce((m, x) => (x[1] > m[1] ? x : m))[0])}`;
  } else {
    opts = ABUND[Z].map(([a]) => PCT(Z, a)); want = PCT(Z, A); head = `How common is ${label(Z, A)}?`; why = `${label(Z, A)}: ${want}`;
    g.stage.tag(nuc(SYM[Z], A, Z), g.stage.root, [0, 1.6, 0], 'huge');
  }
  opts = shuffle(opts);
  const T = opts.map((v, j) => { const t = tile(v, { w: 2.5, h: 0.8, color: '#5a6a8a', size: 0.42 });
    t.position.set((j - (opts.length - 1) / 2) * 2.8, -1.6, 0); t.userData.v = v; g.stage.root.add(t); g.stage.pickable(t); return t; });
  g.goal(head, k);
  let first = true, busy = false;
  const show = () => { if (kind !== 'name') { g.stage.clearTags(); tray(g, Z, [-1.6, 1.5, 0]); } };
  if (k >= 7) g.timer(10, () => { if (!busy) { busy = true; show(); g.miss(k, why, 3.6); } });
  g.setTap(async (hit) => {
    if (busy || !hit || hit.obj.userData.v == null) return;
    const t = hit.obj;
    if (t.userData.v !== want) { first = false; g.wrong(); shake(t); return; }
    busy = true; t.tint('#4dff88', 0.9); show();
    g.right(k, first, why, kind === 'name' ? 2.6 : 3.6);
  });
}

// ---------------------------------------------------------------- 💧 heavy water (Table 2.6)
const PROPS = { mass: ['mass (amu)', 18.02, 20.03], dens: ['density at 0 °C', 1.0, 1.105],
  mp: ['melting point (°C)', 0.0, 3.82], bp: ['boiling point (°C)', 100.0, 101.42] };
const FMT = { mass: (v) => v.toFixed(2), dens: (v) => v.toFixed(3), mp: (v) => v.toFixed(2), bp: (v) => v.toFixed(2) };
const WATER = [['mass', 1], ['mass', 0], ['bp', 0], ['bp', 1], ['mp', 1], ['dens', 1], ['dens', 0], ['mp', 0], ['bp', 1], ['mass', 1]];
function molecule(heavy) {
  const g = new THREE.Group(), O = ball(emissive(0xe8483f, 0.35), 0.62); g.add(O);
  [-1, 1].forEach((s) => {
    const h = new THREE.Group(); h.position.set(s * 0.62, -0.5, 0.2); g.add(h);
    if (heavy) { const p = ball(M.proton, 0.17), n = ball(M.neutron, 0.17); p.position.x = -0.13; n.position.x = 0.13; h.add(p, n); }
    else h.add(ball(M.proton, 0.17));
    const shell = ball(new THREE.MeshPhysicalMaterial({ color: 0xbfd8ff, transparent: true, opacity: 0.18, roughness: 0.2 }), heavy ? 0.42 : 0.36);
    h.add(shell);
  });
  return g;
}
function water(k, g) {
  const [prop, who] = WATER[k], [pname, vH, vD] = PROPS[prop], v = who ? vD : vH;
  const mols = [false, true].map((heavy, j) => {
    const m = molecule(heavy); m.position.set(j ? 2.4 : -2.4, 0.4, 0); g.stage.root.add(m); g.stage.pickable(m);
    m.traverse((o) => { o.userData.w = j; }); popIn(m, 1, 0.4);
    g.stage.tag(heavy ? 'D₂O' : 'H₂O', m, [0, -1.25, 0], 'huge');
    return m;
  });
  g.stage.tag(`${pname}: <b>${FMT[prop](v)}</b>`, g.stage.root, [0, 2.4, 0], 'huge gold');
  g.goal('Which water?', k);
  let first = true, busy = false;
  const bars = () => {                                 // both values as bars (difference stretched so it is visible)
    const lo = Math.min(vH, vD) - (vD - vH) * 1.5, H = (x) => 0.4 + ((x - lo) / (vD - lo)) * 1.8;
    [vH, vD].forEach((x, j) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1, 0.45), emissive(j ? 0x4dff88 : 0x4aa8ff, 0.5));
      b.position.set(j ? 3.9 : -0.9, -1.8, 0); b.scale.y = 0.001; g.stage.root.add(b);
      tween(0.8, (u) => { const h = H(x) * u; b.scale.y = Math.max(0.001, h); b.position.y = -1.8 + h / 2; });
      g.stage.tag(FMT[prop](x), b, [0.9, 0, 0], 'big');
    });
  };
  const why = `${who ? 'D₂O' : 'H₂O'}: ${pname} ${FMT[prop](v)}`;
  if (k >= 6) g.timer(7, () => { if (!busy) { busy = true; bars(); g.miss(k, why, 3.4); } });
  g.setTap(async (hit) => {
    if (busy || !hit || hit.obj.userData.w == null) return;
    const j = hit.obj.userData.w;
    if (j !== who) { first = false; g.wrong(); shake(mols[j]); return; }
    busy = true; popIn(mols[j], 1.15, 0.4); bars();
    g.right(k, first, why, 3.4);
  });
}

const PARTS = [
  { key: 'twins', icon: '👯', name: 'Twins?', n: TWINS.length, run: twins, done: 'Isotopes: same protons (same element), different neutrons.' },
  { key: 'count', icon: '🔢', name: 'Neutrons', n: NEUT.length, run: neutrons, done: 'Neutrons = top number − bottom number (A − Z).' },
  { key: 'cards', icon: '🏷️', name: 'Name cards', n: CARDS.length, run: cards, done: 'Protium, deuterium, tritium, and which isotope is most common.' },
  { key: 'water', icon: '💧', name: 'Heavy water', n: WATER.length, run: water, done: 'D₂O is heavier, denser, melts and boils a little higher: same chemistry, different physical properties.' },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'isotopes', parts: PARTS, cam: [0, 0.4, 13], target: [0, 0.2, 0] });
}
