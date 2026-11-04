// Bond Builder (Unit 4): book-style dot-and-cross atoms. Easy → hard (SKILL):
//   ⚡ Ions    an atom with its outer electrons → which ion does it make? (gives 1, 2, 3 or takes 1, 2, 3; p.97)
//   🧂 Give    tap the metal's outer electron(s): they jump to the non-metal (ionic bond)
//   🤝 Share   tap two lonely electrons on neighbours: they slide into the overlap as a shared pair (single bonds)
//   🔗 Double  two or three shared pairs (O=O, N≡N, O=C=O)
// Lone pairs don't move. When every shell is full, the rings flash green. Beginner rounds (the first level of a part)
// glow the next electron after a while; 3 wrong taps make the next move by itself.
// Covers 4.3.1-4.3.2, Figs 4.2-4.10, Practice 4.1, Test Yourself pp.97 and 105 (Cl₂, HCl, NH₃).
import { THREE, sfx, tween, ease, ball, M, popIn } from './kit.js';
import { runGame, choose, shuffle, shake } from './rounds.js';
import { dotAtom, seat, hand, flash } from './mol3d.js';

const CL_L = [76, 104, 256, 284, 166, 194, 0];            // chlorine with its lonely electron on the right
const H_ = (x, y, ang, gold = true) => ['H', x, y, 1, { r: 0.8, gold, angles: [ang] }];
const halide = (s, x, o = {}) => [s, x, 0, 7, { gold: true, ...o }];
// atoms: [sym, x, y, n, {r, gold, angles}]; moves: give [from, k, to, angle, shift?] or share [a, ka, b, kb]
const GIVE = [
  { f: 'NaCl', ions: ['Na⁺', 'Cl⁻'], atoms: [['Na', -1.9, 0, 1, { angles: [0] }], halide('Cl', 1.9)], moves: [['give', 0, 0, 1, 194, [6, 166]]] },
  { f: 'KCl', ions: ['K⁺', 'Cl⁻'], atoms: [['K', -1.9, 0, 1, { angles: [0] }], halide('Cl', 1.9)], moves: [['give', 0, 0, 1, 194, [6, 166]]] },
  { f: 'LiF', ions: ['Li⁺', 'F⁻'], atoms: [['Li', -1.9, 0, 1, { angles: [0] }], halide('F', 1.9)], moves: [['give', 0, 0, 1, 194, [6, 166]]] },
  { f: 'MgO', ions: ['Mg²⁺', 'O²⁻'], atoms: [['Mg', -1.9, 0, 2, { angles: [14, -14] }], ['O', 1.9, 0, 6, { gold: true, angles: [76, 104, 256, 284, -14, 14] }]],
    moves: [['give', 0, 0, 1, 166], ['give', 0, 1, 1, 194]] },
  { f: 'CaO', ions: ['Ca²⁺', 'O²⁻'], atoms: [['Ca', -1.9, 0, 2, { angles: [14, -14] }], ['O', 1.9, 0, 6, { gold: true, angles: [76, 104, 256, 284, -14, 14] }]],
    moves: [['give', 0, 0, 1, 166], ['give', 0, 1, 1, 194]] },
  { f: 'CaCl₂', ions: ['Cl⁻', 'Ca²⁺', 'Cl⁻'], atoms: [halide('Cl', -3.4, { angles: CL_L, r: 0.9 }), ['Ca', 0, 0, 2, { angles: [0, 180], r: 0.9 }],
    halide('Cl', 3.4, { r: 0.9 })], moves: [['give', 1, 1, 0, -14, [6, 14]], ['give', 1, 0, 2, 194, [6, 166]]] },
];
const SHARE = [
  { f: 'H–H', atoms: [['H', -0.75, 0, 1, { r: 0.8, angles: [0] }], H_(0.75, 0, 180)], moves: [['share', 0, 0, 1, 0]] },
  { f: 'H–Cl', atoms: [['H', -1.45, 0, 1, { r: 0.8, angles: [0] }], halide('Cl', 0.6, { r: 1.2 })], moves: [['share', 0, 0, 1, 6]] },
  { f: 'H–F', atoms: [['H', -1.45, 0, 1, { r: 0.8, angles: [0] }], halide('F', 0.6, { r: 1.2 })], moves: [['share', 0, 0, 1, 6]] },
  { f: 'Cl–Cl', atoms: [['Cl', -0.9, 0, 7, { angles: CL_L, r: 1.1 }], halide('Cl', 0.9, { r: 1.1 })], moves: [['share', 0, 6, 1, 6]] },
  { f: 'H–O–H', atoms: [H_(-2.05, 0, 0), ['O', 0, 0, 6, { r: 1.2, angles: [76, 104, 256, 284, 0, 180] }], H_(2.05, 0, 180)],
    moves: [['share', 0, 0, 1, 5], ['share', 1, 4, 2, 0]] },
  { f: 'NH₃', atoms: [['N', 0, 0.4, 5, { r: 1.2, angles: [76, 104, 180, 270, 0] }], H_(-2.05, 0.4, 0), H_(0, -1.65, 90), H_(2.05, 0.4, 180)],
    moves: [['share', 1, 0, 0, 2], ['share', 2, 0, 0, 3], ['share', 0, 4, 3, 0]] },
  { f: 'CH₄', atoms: [['C', 0, 0.2, 4, { r: 1.2, angles: [90, 0, 270, 180] }], ['H', 0, 2.0, 1, { r: 0.75, gold: true, angles: [270] }],
    ['H', 1.8, 0.2, 1, { r: 0.75, gold: true, angles: [180] }], ['H', 0, -1.6, 1, { r: 0.75, gold: true, angles: [90] }], ['H', -1.8, 0.2, 1, { r: 0.75, gold: true, angles: [0] }]],
    moves: [['share', 1, 0, 0, 0], ['share', 2, 0, 0, 1], ['share', 3, 0, 0, 2], ['share', 4, 0, 0, 3]] },
];
const MULTI = [
  { f: 'O=O', atoms: [['O', -0.9, 0, 6, { r: 1.1, angles: [76, 104, 166, 194, 14, -14] }], ['O', 0.9, 0, 6, { r: 1.1, gold: true, angles: [76, 104, -14, 14, 166, 194] }]],
    moves: [['share', 0, 5, 1, 5], ['share', 0, 4, 1, 4]] },
  { f: 'N≡N', atoms: [['N', -0.82, 0, 5, { r: 1.1, angles: [166, 194, 36, 0, -36] }], ['N', 0.82, 0, 5, { r: 1.1, gold: true, angles: [-14, 14, 144, 180, 216] }]],
    moves: [['share', 0, 4, 1, 4], ['share', 0, 3, 1, 3], ['share', 0, 2, 1, 2]] },
  { f: 'O=C=O', atoms: [['O', -1.8, 0, 6, { r: 1.05, gold: true, angles: [76, 104, 166, 194, 14, -14] }], ['C', 0, 0, 4, { r: 1.05, angles: [14, -14, 166, 194] }],
    ['O', 1.8, 0, 6, { r: 1.05, gold: true, angles: [76, 104, -14, 14, 166, 194] }]],
    moves: [['share', 0, 5, 1, 3], ['share', 0, 4, 1, 2], ['share', 1, 1, 2, 5], ['share', 1, 0, 2, 4]] },
];
const WHY = { give: 'electrons moved over: ionic bond', share: 'shared pairs: covalent bonds', multi: 'more shared pairs: double or triple bond' };

// ⚡ ions: [sym, outer electrons, ion]; metals give their outer electrons, non-metals take enough to make 8
const IONS = shuffle([['Na', 1, 'Na⁺'], ['Mg', 2, 'Mg²⁺'], ['Cl', 7, 'Cl⁻'], ['O', 6, 'O²⁻'], ['Li', 1, 'Li⁺'], ['Ca', 2, 'Ca²⁺'],
  ['F', 7, 'F⁻'], ['K', 1, 'K⁺'], ['Al', 3, 'Al³⁺'], ['S', 6, 'S²⁻'], ['N', 5, 'N³⁻'], ['Br', 7, 'Br⁻']]);
const SUPC = ['', '', '²', '³'];
function ions(k, g) {
  const [s, n, ion] = IONS[k], metal = n <= 3, q = metal ? n : 8 - n;
  const G = new THREE.Group(); G.position.y = 1.1; g.stage.root.add(G);
  const A = dotAtom(g.stage, G, s, [0, 0, 0], n, { r: 1.25, gold: !metal }); popIn(G, 1, 0.4);
  const opts = [...new Set([`${s}${SUPC[q]}${metal ? '⁺' : '⁻'}`, `${s}${SUPC[q]}${metal ? '⁻' : '⁺'}`,
    `${s}${SUPC[q === 1 ? 2 : q - 1]}${metal ? '⁺' : '⁻'}`, `${s}${SUPC[q === 3 ? 2 : q + 1]}${metal ? '⁺' : '⁻'}`])];
  g.goal(`${n} outer electron${n > 1 ? 's' : ''}: which ion?`, k);
  const why = metal ? `${s} gives ${n} → ${ion}` : `${s} takes ${q} (8 in all) → ${ion}`;
  choose(g, k, opts, ion, { w: 1.7, size: 0.55, why, onRight: () => A.dots.forEach((e) => tween(0.5, (t) => e.scale.setScalar(1 + 0.6 * Math.sin(t * Math.PI)), ease.lin)) });
}

function build(k, g, R, kind, explore = false) {
  const G = new THREE.Group(); G.position.y = 1.2; g.stage.root.add(G);
  G.scale.setScalar(Math.min(1.25, (innerWidth / innerHeight > 1.15 ? 9.5 : 6.5) / (Math.max(...R.atoms.map((a) => Math.abs(a[1]))) * 2 + 2.4)));
  const A = R.atoms.map(([s, x, y, n, o]) => dotAtom(g.stage, G, s, [x, y, 0], n, o));
  if (kind !== 'give') {                   // sharing atoms start apart and slide together on their first share
    const cnt = A.map((_, k2) => R.moves.filter((m) => m[1] === k2 || m[3] === k2).length);
    const ci = A.length > 2 ? cnt.indexOf(Math.max(...cnt)) : -1;
    const c = ci >= 0 ? A[ci].g.position.clone() : A.reduce((v, a) => v.add(a.g.position), new THREE.Vector3()).multiplyScalar(1 / A.length);
    A.forEach((a, k2) => { a.home = a.g.position.clone(); if (k2 !== ci) a.g.position.addScaledVector(a.home.clone().sub(c).normalize(), ci >= 0 ? 1.0 : 0.7); });
  }
  A.forEach((a, ai) => a.dots.forEach((e, k2) => { const h = ball(M.hit, 3); e.add(h); e.userData = { ai, k: k2 }; g.stage.pickable(e); }));
  const rows = {};
  const pending = R.moves.map((m) => {
    if (m[0] === 'give') return { m, dots: [A[m[1]].dots[m[2]]] };
    const key = m[1] + '-' + m[3]; rows[key] = (rows[key] || 0) + 1;
    return { m, dots: [A[m[1]].dots[m[2]], A[m[3]].dots[m[4]]], row: rows[key] - 1, key };
  });
  pending.forEach((p) => { if (p.key) p.of = rows[p.key]; });
  g.goal(kind === 'give' ? `${R.f}: give the electrons` : `${R.f}: share pairs`, k);
  let first = true, busy = false, miss = 0, glowing = null;
  const beginner = k < 2 && !explore;
  const hintNext = () => { if (busy || !pending.length) return; glowing = pending[0].dots; glowing.forEach((d) => pulse(d)); };
  if (beginner) g.later(9, hintNext);
  if (explore) { g.goal(R.f, k); g.later(1.2, () => go(pending[0])); }   // 🔍 Explore: every move plays by itself, nothing can be wrong

  async function doMove(p) {
    const [type] = p.m;
    if (type === 'give') {
      const [, from, , to, ang, shift] = p.m;
      if (shift) { const e = A[to].dots[shift[0]], a = shift[1] * Math.PI / 180; seat(A[to], e, A[to].g.localToWorld(new THREE.Vector3(A[to].r * Math.cos(a), A[to].r * Math.sin(a), 0.03)), 0.4); }
      sfx.pop(); await hand(A[from], A[to], p.dots[0], ang);
    } else {
      const [, a, , b] = p.m;
      await Promise.all([a, b].map((k2) => { const gg = A[k2].g, h = A[k2].home, p0 = gg.position.clone();
        return h && p0.distanceTo(h) > 1e-3 ? tween(0.5, (t) => gg.position.lerpVectors(p0, h, t), ease.inOut) : null; }));
      const pa = A[a].g.getWorldPosition(new THREE.Vector3()), pb = A[b].g.getWorldPosition(new THREE.Vector3());
      const d = pb.clone().sub(pa).normalize(), perp = new THREE.Vector3(-d.y, d.x, 0), mid = pa.clone().add(pb).multiplyScalar(0.5);
      const row = mid.clone().addScaledVector(perp, (p.row - (p.of - 1) / 2) * 0.34 * G.scale.x);
      sfx.pop();
      await Promise.all([seat(A[a], p.dots[0], row.clone().addScaledVector(d, -0.13 * G.scale.x)), seat(A[b], p.dots[1], row.clone().addScaledVector(d, 0.13 * G.scale.x))]);
    }
  }
  async function go(p) {
    busy = true; pending.splice(pending.indexOf(p), 1); p.dots.forEach((d) => g.stage.unpickable(d));
    const my = g.token;
    await doMove(p);
    if (my !== g.token) return;
    busy = false; miss = 0;
    if (pending.length) { if (beginner) g.later(9, hintNext); if (explore) g.later(0.5, () => go(pending[0])); return; }
    busy = true;
    if (kind === 'give') {                 // the emptied metal ring shrinks; ion names appear
      A.forEach((a, j) => { if (!a.dots.length) tween(0.4, (t) => a.ring.scale.setScalar(1 - 0.35 * t), ease.out);
        g.stage.tag(`<b>${R.ions[j]}</b>`, a.g, [0, -a.r - 0.5, 0], R.ions[j].includes('⁺') ? 'big blue' : 'big green'); });
    }
    A.forEach((a) => flash(a.g, a.r));
    g.right(k, first, `${R.f}: ${WHY[kind]}`, 1.1, false, true);
  }
  g.setTap((hit) => {
    const e = hit && hit.obj;
    if (explore) return;
    if (busy || !e || e.userData.ai === undefined) return;
    const p = pending.find((q) => q.dots.includes(e));
    if (p) { go(p); return; }
    first = false; g.wrong(); shake(e, 0.06);
    if (++miss >= 3) go(pending[0]);                 // 3 wrong taps: the next move happens by itself
  });
}
function pulse(m) { tween(1.2, (t) => m.scale.setScalar(1 + 0.7 * Math.sin(t * Math.PI * 2) ** 2), ease.lin); }

const EXPLORE = [...GIVE.map((R) => [R, 'give']), ...SHARE.map((R) => [R, 'share']), ...MULTI.map((R) => [R, 'multi'])];
const PARTS = [
  { key: 'explore', icon: '🔍', name: 'Explore', n: EXPLORE.length, run: (k, g) => build(k, g, ...EXPLORE[k], true) },
  { key: 'ions', icon: '⚡', name: 'Ions', n: IONS.length, run: ions },
  { key: 'give', icon: '🧂', name: 'Give', n: GIVE.length, steps: [3], run: (k, g) => build(k, g, GIVE[k], 'give') },
  { key: 'share', icon: '🤝', name: 'Share', n: SHARE.length, steps: [4], run: (k, g) => build(k, g, SHARE[k], 'share') },
  { key: 'multi', icon: '🔗', name: 'Double', n: MULTI.length, steps: [], run: (k, g) => build(k, g, MULTI[k], 'multi') },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'bondbuild', parts: PARTS, cam: [0, 0.4, 13.5], target: [0, 0.3, 0], excite: true });
}
