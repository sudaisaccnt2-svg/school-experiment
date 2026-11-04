// Bond Sorter (Unit 4): a compound appears in 3D; tap ionic, polar covalent or non-polar covalent.
// Easy → hard (SKILL): 📏 Ruler: the electronegativity-difference ruler shows where the bond sits (learn the 0.5 and
// 1.7 cuts) · 🧮 Numbers: only the two electronegativities (book values) · 🧠 Memory: only the compound.
// The why (b − a = d) shows after each answer. Covers 4.3.4, Scientific Information pp.102 and 107, Short Q viii
// (CaCl₂, H₂O, CO₂, C₂H₄), Test Yourself p.108.
import { THREE, popIn } from './kit.js';
import { runGame, choose, shuffle } from './rounds.js';
import { molecule, ionBall, enRuler, EN } from './mol3d.js';

const KINDS = ['ionic', 'polar covalent', 'non-polar covalent'];
// [label, model, the two elements of the bond]; model: a SHAPES key or ions [[text, plus], …]
const DATA = [
  ['NaCl', [['Na⁺', 1], ['Cl⁻', 0]], 'Na Cl'], ['H₂', 'H2', 'H H'], ['HCl', 'HCl', 'H Cl'], ['CaCl₂', [['Cl⁻', 0], ['Ca²⁺', 1], ['Cl⁻', 0]], 'Ca Cl'],
  ['H₂O', 'H2O', 'H O'], ['Cl₂', 'Cl2', 'Cl Cl'], ['CO₂', 'CO2', 'C O'], ['MgO', [['Mg²⁺', 1], ['O²⁻', 0]], 'Mg O'],
  ['C₂H₄', 'C2H4', 'C H'], ['NH₃', 'NH3', 'H N'], ['O₂', 'O2', 'O O'], ['CH₄', 'CH4', 'C H'],
  ['KCl', [['K⁺', 1], ['Cl⁻', 0]], 'K Cl'], ['HF', 'HF', 'H F'], ['N₂', 'N2', 'N N'], ['LiF', [['Li⁺', 1], ['F⁻', 0]], 'Li F'],
].map(([f, model, pair]) => {
  const [a, b] = pair.split(' '), d = Math.round(Math.abs(EN[b] - EN[a]) * 10) / 10;
  return { f, model, a, b, d, kind: d > 1.7 ? 0 : d > 0.5 ? 1 : 2 };
});
const RULER = shuffle(DATA).slice(0, 9), NUMS = shuffle(DATA).slice(0, 12), MEM = shuffle(DATA);

function round(g, k, R, mode) {
  const G = new THREE.Group(); G.position.y = 1.35; g.stage.root.add(G);
  if (typeof R.model === 'string') {
    const m = molecule(G, R.model, { scale: 1.3 }); let tt = 0; m.g.rotation.x = 0.2;
    g.onFrame((dt) => { tt += dt ?? 0.016; m.g.rotation.y = 0.55 * Math.sin(tt * 0.7); }); popIn(m.g, 1, 0.4);
  } else {
    const n = R.model.length;
    R.model.forEach(([t, p], j) => popIn(ionBall(g.stage, G, t, [(j - (n - 1) / 2) * 2.1, 0, 0], !!p, p ? 0.5 : 0.68), 1, 0.4));
  }
  g.stage.tag(`<b>${R.f}</b>`, G, [0, 1.55, 0], 'huge');
  const [hi, lo] = EN[R.b] >= EN[R.a] ? [R.b, R.a] : [R.a, R.b];
  const why = `${hi} ${EN[hi].toFixed(1)} − ${lo} ${EN[lo].toFixed(1)} = ${R.d.toFixed(1)}: ${KINDS[R.kind]}`;
  let ru = null;
  if (mode !== 'mem') {
    ru = enRuler(g.stage, g.stage.root, -0.55, 8);
    g.stage.tag(`<b>${R.a} ${EN[R.a].toFixed(1)}   ·   ${R.b} ${EN[R.b].toFixed(1)}</b>`, ru.g, [0, 0.62, 0], 'big gold');
    if (mode === 'ruler') { ru.marker(R.d); g.stage.tag(`<b>${R.d.toFixed(1)}</b>`, ru.g, [ru.X(R.d), -0.62, 0], 'big'); }
  }
  g.goal('Which kind of bond?', k);
  choose(g, k, KINDS, KINDS[R.kind], { w: 3.0, size: 0.4, y: -2.05, why, onReveal: () => ru && mode !== 'ruler' && ru.marker(R.d) });
}

const PARTS = [
  { key: 'ruler', icon: '📏', name: 'Ruler', n: RULER.length, run: (k, g) => round(g, k, RULER[k], 'ruler') },
  { key: 'nums', icon: '🧮', name: 'Numbers', n: NUMS.length, run: (k, g) => round(g, k, NUMS[k], 'nums') },
  { key: 'mem', icon: '🧠', name: 'Memory', n: MEM.length, run: (k, g) => round(g, k, MEM[k], 'mem') },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'bondsort', parts: PARTS, cam: [0, 0.4, 13.5], target: [0, 0.2, 0] });
}
