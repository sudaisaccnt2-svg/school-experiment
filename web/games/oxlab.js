// Oxidation Number Lab (Unit 7): a molecule or ion in 3D, a gold badge on every atom but one ("?"). Pick the missing
// oxidation number. After the right answer every + becomes a gold bead and every − a blue bead; they cancel in pairs
// and what is left is the charge of the particle (nothing left = neutral). Covers Short Q ii, vii; Examples 7.1, 7.2;
// Practice 7.1 (and the MCQ ones: CH₃OH, KMnO₄; rule viii MnO₄⁻).
// Easy → hard (SKILL): 📏 Rules (one atom, from the book's rules) · 🔍 Find (the sum must equal the charge; the beads
// play, then a tap goes on).
import { THREE, emissive, sleep, popIn, popOut, ball } from './kit.js';
import { runGame, choose, shuffle } from './rounds.js';
import { atom } from './chem7.js';

const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
const PLUS = emissive(0xffb347, 1.6), MINUS = emissive(0x4aa8ff, 1.8);
// [name, charge, atoms [sym, x, y, value], index of the unknown atom(s), choices, answer index]
const R = (name, charge, atoms, unk, o, a, k = 1) => ({ name, charge, atoms, unk, o, a, k });
const ROUNDS = [
  R('Ag (silver metal, left side of 4Ag + O₂)', 0, [['Ag', 0, 0, 0]], [0], ['0', '+1', '+2', '−1'], 0, 1.5),
  R('Ag₂O (right side of 4Ag + O₂ → 2Ag₂O)', 0, [['Ag', -1.2, -0.3, 1], ['O', 0, 0.35, -2], ['Ag', 1.2, -0.3, 1]], [0, 2], ['0', '+1', '+2', '−2'], 1),
  R('HI', 0, [['H', -0.75, 0, 1], ['I', 0.45, 0, -1]], [1], ['+1', '−1', '0', '−2'], 1, 1.3),
  R('PBr₃', 0, [['P', 0, 0.2, 3], ['Br', -1.3, -0.4, -1], ['Br', 1.3, -0.4, -1], ['Br', 0, 1.5, -1]], [0], ['+1', '+3', '−3', '+5'], 1),
  R('CaCO₃', 0, [['Ca', -2.2, 0, 2], ['C', 0, 0, 4], ['O', 0, 1.05, -2], ['O', -0.9, -0.6, -2], ['O', 0.9, -0.6, -2]], [1], ['+2', '+4', '−4', '+6'], 1),
  R('H₃PO₄', 0, [['P', 0, 0, 5], ['O', 0, 1.05, -2], ['O', -1, 0, -2], ['O', 1, 0, -2], ['O', 0, -1.05, -2],
    ['H', -1.8, 0.3, 1], ['H', 1.8, 0.3, 1], ['H', 0.6, -1.7, 1]], [0], ['+3', '+5', '−3', '+7'], 1, 0.9),
  R('As₂O₃', 0, [['As', -0.8, 0.4, 3], ['As', 0.8, 0.4, 3], ['O', -1.7, -0.5, -2], ['O', 0, -0.5, -2], ['O', 1.7, -0.5, -2]], [0, 1], ['+2', '+3', '+6', '−3'], 1, 0.9),
  R('H₂SO₄', 0, [['S', 0, 0, 6], ['O', -1, 0.75, -2], ['O', 1, 0.75, -2], ['O', -1, -0.75, -2], ['O', 1, -0.75, -2],
    ['H', -2, -1.1, 1], ['H', 2, -1.1, 1]], [0], ['+4', '+6', '−2', '+8'], 1, 0.9),
  R('Example 7.1: PCl₅', 0, [['P', 0, 0, 5], ...[0, 1, 2, 3, 4].map((k) => ['Cl', 1.45 * Math.cos(Math.PI / 2 + 1.2566 * k), 1.3 * Math.sin(Math.PI / 2 + 1.2566 * k), -1])],
    [0], ['+3', '+5', '−5', '0'], 1, 0.8),
  R('Example 7.2: nitrite ion NO₂⁻', -1, [['N', 0, 0.3, 3], ['O', -1, -0.35, -2], ['O', 1, -0.35, -2]], [0], ['+3', '+4', '+5', '−1'], 0, 1.3),
  R('Practice 7.1: CO', 0, [['C', -0.45, 0, 2], ['O', 0.45, 0, -2]], [0], ['+4', '+2', '−2', '0'], 1, 1.3),
  R('Practice 7.1: sulphite ion SO₃²⁻', -2, [['S', 0, 0.2, 4], ['O', 0, 1.35, -2], ['O', -1, -0.5, -2], ['O', 1, -0.5, -2]], [0], ['+6', '+4', '+2', '−2'], 1),
  R('CH₃OH (methanol)', 0, [['C', -0.5, 0, -2], ['O', 0.6, 0, -2], ['H', -0.9, 0.8, 1], ['H', -1.35, -0.2, 1], ['H', -0.6, -0.9, 1], ['H', 1.2, 0.55, 1]],
    [0], ['−2', '+2', '0', '−4'], 0, 1.2),
  R('KMnO₄', 0, [['Mn', 0, 0, 7], ['O', -1, 0.75, -2], ['O', 1, 0.75, -2], ['O', -1, -0.75, -2], ['O', 1, -0.75, -2], ['K', 2.3, 0, 1]],
    [0], ['+7', '+4', '+2', '−1'], 0, 0.9),
  R('Permanganate ion MnO₄⁻', -1, [['Mn', 0, 0, 7], ['O', -1, 0.75, -2], ['O', 1, 0.75, -2], ['O', -1, -0.75, -2], ['O', 1, -0.75, -2]],
    [0], ['+8', '+7', '+6', '−1'], 1, 0.9),
];
const fmt = (v) => (v > 0 ? '+' + v : v < 0 ? '−' + -v : '0');

// 📏 Rules first (easy, from memory): one atom asks for its number by a book rule; the others stay blank.
const RULES = [
  [R('Na (sodium metal)', 0, [['Na', 0, 0, 0]], [0], ['0', '+1', '−1', '+2'], 0, 1.5), 'a free element is 0'],
  [R('Cl₂', 0, [['Cl', -0.6, 0, 0], ['Cl', 0.6, 0, 0]], [0, 1], ['0', '−1', '+1', '−2'], 0, 1.3), 'a free element is 0'],
  [R('O₂', 0, [['O', -0.55, 0, 0], ['O', 0.55, 0, 0]], [0, 1], ['0', '−2', '+2', '−1'], 0, 1.3), 'a free element is 0'],
  [R('H₂O: oxygen', 0, [['H', -0.95, -0.45, 1], ['O', 0, 0.3, -2], ['H', 0.95, -0.45, 1]], [1], ['−2', '+2', '−1', '0'], 0, 1.3), 'oxygen is −2'],
  [R('MgO: oxygen', 0, [['Mg', -0.75, 0, 2], ['O', 0.75, 0, -2]], [1], ['−2', '+2', '−1', '0'], 0, 1.3), 'oxygen is −2'],
  [R('HCl: hydrogen', 0, [['H', -0.75, 0, 1], ['Cl', 0.45, 0, -1]], [0], ['+1', '−1', '0', '+2'], 0, 1.3), 'hydrogen is +1'],
  [R('NH₃: hydrogen', 0, [['N', 0, 0.3, -3], ['H', -1, -0.4, 1], ['H', 1, -0.4, 1], ['H', 0, -0.9, 1]], [1, 2, 3], ['+1', '−1', '0', '+3'], 0, 1.2), 'hydrogen is +1'],
  [R('HF: fluorine', 0, [['H', -0.7, 0, 1], ['F', 0.5, 0, -1]], [1], ['−1', '+1', '0', '−2'], 0, 1.3), 'fluorine is −1'],
  [R('NaCl: sodium', 0, [['Na', -0.75, 0, 1], ['Cl', 0.75, 0, -1]], [0], ['+1', '−1', '0', '+2'], 0, 1.3), 'group 1 metals are +1'],
  [R('KBr: potassium', 0, [['K', -0.75, 0, 1], ['Br', 0.75, 0, -1]], [0], ['+1', '−1', '0', '+2'], 0, 1.3), 'group 1 metals are +1'],
  [R('CaO: calcium', 0, [['Ca', -0.75, 0, 2], ['O', 0.75, 0, -2]], [0], ['+2', '−2', '+1', '0'], 0, 1.3), 'group 2 metals are +2'],
  [R('MgCl₂: magnesium', 0, [['Cl', -1.4, 0, -1], ['Mg', 0, 0, 2], ['Cl', 1.4, 0, -1]], [1], ['+2', '−2', '+1', '0'], 0, 1.2), 'group 2 metals are +2'],
];
const RULE = shuffle(RULES.map((_, j) => j));

function particle(g, r, blankOthers) {
  const G = new THREE.Group(); G.position.y = 1.15; G.scale.setScalar(0.85); g.stage.root.add(G); popIn(G, 0.85, 0.4);
  const A = r.atoms.map(([sym, x, y, v], j) => {
    const m = atom(g.stage, G, sym, [x, y, 0], r.k), u = r.unk.includes(j);
    m.userData.badge = g.stage.tag(`<b>${u ? '?' : blankOthers ? '' : fmt(v)}</b>`, m, [0, m.userData.r + 0.38, 0], u ? 'big' : 'big gold');
    return m;
  });
  g.stage.tag(`<b>${r.name}</b>`, G, [0, 2.35, 0], 'huge');
  if (r.charge) g.stage.tag(`<b>charge ${fmt(r.charge)}</b>`, G, [3.2, 0, 0], 'big');
  const fillIn = () => r.unk.forEach((u) => { const e = A[u].userData.badge; e.innerHTML = `<b>${r.o[r.a]}</b>`; e.className += ' gold green'; });
  // + beads and − beads cancel in pairs; the leftover is the charge
  async function beads() {
    fillIn();
    let pos = 0, neg = 0;
    r.atoms.forEach(([, , , v]) => (v > 0 ? (pos += v) : (neg -= v)));
    const row = (n, y, mat) => Array.from({ length: n }, (_, j) => { const b = ball(mat, 0.13); b.position.set(-((n - 1) * 0.3) / 2 + 0.3 * j, y, 0.4); G.add(b); popIn(b, 0.13, 0.2); return b; });
    const P = row(pos, -2.15, PLUS), N = row(neg, -2.55, MINUS);
    await sleep(0.6);
    const m = Math.min(pos, neg);
    for (let j = 0; j < m; j++) { popOut(P[pos - 1 - j], 0.12); popOut(N[neg - 1 - j], 0.12); await sleep(0.07); }
    await sleep(0.3);
    const left = pos - neg;
    g.B.draw([{ text: `${pos ? '+' + pos : '0'} and −${neg}: ${left === 0 ? 'they cancel, total 0' : 'total ' + fmt(left) + ' = the charge'}`, bold: true, color: '#ffc061' }]);
  }
  return { fillIn, beads };
}
function rules(k, g) {
  const [r, rule] = RULES[RULE[k]], P = particle(g, r, true);
  g.goal('Its oxidation number?', k);
  choose(g, k, r.o, r.o[r.a], { w: 1.5, size: 0.55, why: `${r.name}: ${r.o[r.a]} (${rule})`, onRight: P.fillIn, onReveal: P.fillIn });
}
function find(k, g) {
  const r = ROUNDS[k], P = particle(g, r, false);
  g.goal('Find the missing oxidation number', k);
  choose(g, k, r.o, r.o[r.a], { w: 1.5, size: 0.55, why: `${r.name}: ${r.o[r.a]}`, tap: true, onRight: P.beads, onReveal: P.beads });
}
const PARTS = [
  { key:'explore', icon:'🔍', name:'Explore', n:ROUNDS.length, run:(k,g)=>{
    const r=ROUNDS[k],p=particle(g,r,false);p.fillIn();g.goal(r.name+': '+r.o[r.a],k);
    g.setTap(()=>{g._after=p.beads();g.right(k,true,r.o[r.a],0,false,'tap');});
  } },
  { key: 'rules', icon: '📏', name: 'Rules', n: RULE.length, run: rules },
  { key: 'find', icon: '🔍', name: 'Find', n: ROUNDS.length, run: find },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'oxlab', parts: PARTS, cam: [0, 0.4, 13.5], target: [0, 0.2, 0], excite:true });
}
