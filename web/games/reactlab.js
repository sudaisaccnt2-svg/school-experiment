// Metal Reactions Lab (Unit 8, films 804, 806, 808, 811): metals react in 3D; the student reads what happens.
//   🔥 Flames    a metal burns: which metal? (level 1 the flame shows first) · then: which colour will it burn?
//   💧 Water     a lump drops into water: Li floats and fizzes, Na fizzes faster, K explodes · which metal? · order
//   🧪 Products  metal + oxygen / water / chlorine / hydrogen / nitrogen / acid → which product?
//   📶 Order     which is more reactive? which needs more energy to lose an electron? (Tables 8.2, 8.3)
// Covers Table 8.1, Short Q ii, iv, v, ix, Long Q I, II b; MCQ iii, iv.
import { THREE, popIn, tween, sleep } from './kit.js';
import { runGame, choose, chooseText, shuffle } from './rounds.js';
import { atom, hop } from './chem7.js';
import { lump, trough, flame, fizz, litmus, FLAME } from './chem8.js';

const COLOUR = { Li: 'red', Na: 'bright yellow', K: 'lilac', Mg: 'dazzling white', Ca: 'brick red' };
const CSS = { red: '#ff4655', 'bright yellow': '#ffd23a', lilac: '#c98bff', 'dazzling white': '#ffffff', 'brick red': '#ff6a3a' };
const METALS = ['Li', 'Na', 'K', 'Mg', 'Ca'];
const name = { Li: 'lithium', Na: 'sodium', K: 'potassium', Mg: 'magnesium', Ca: 'calcium' };

// ---------------------------------------------------------------- 🔥 flames
const FL = [...shuffle(METALS), ...shuffle(METALS)];
function flames(k, g) {
  const sym = FL[k], look = k < 5, G = new THREE.Group(); G.position.y = 0.4; g.stage.root.add(G);
  const L = lump(G, sym, [0, -0.6, 0], 0.9); popIn(L, 1, 0.4);
  const show = () => { const F = flame(G, FLAME[sym], [0, -0.3, 0], 1.8); g.onFrame(F.tick); };
  if (look) {
    show(); g.goal('Which metal burns like this?', k);
    choose(g, k, shuffle(METALS), sym, { label: (s) => name[s], w: 2.1, size: 0.42, why: `${name[sym]} burns ${COLOUR[sym]}` });
  } else {
    g.stage.tag(`<b>${name[sym]}</b>`, L, [0, 1.0, 0], 'huge');
    g.goal('Which colour will it burn?', k);
    const T = choose(g, k, Object.values(COLOUR), COLOUR[sym], { w: 2.3, size: 0.4, why: `${name[sym]} burns ${COLOUR[sym]}`, onRight: show, onReveal: show });
    T.forEach((t) => t.tint(CSS[t.userData.v], 0.55));
  }
}

// ---------------------------------------------------------------- 💧 water (Table 8.1)
const WATER_DO = { Li: 'floats, reacts quickly', Na: 'floats, reacts very quickly', K: 'reacts violently: explodes' };   // Table 8.1
const WT = [...shuffle(['Li', 'Na', 'K']), ...shuffle(['Li', 'Na', 'K']), 'order', 'order2'];
async function drop(g, G, sym) {
  const T = trough(G, [0, -2.2, 0]), L = lump(G, sym, [0, 1.6, 0], 0.55);
  await tween(0.6, (t) => { L.position.y = 1.6 - t * (1.6 - (-2.2 + T.userData.top + 0.12)); });
  const speed = { Li: 6, Na: 16, K: 30 }[sym];
  g.onFrame(fizz(G, L, { rate: speed, height: 1.2 }));
  if (sym !== 'Li') g.onFrame((dt) => { L.position.x = Math.sin(performance.now() / (sym === 'K' ? 90 : 200)) * 0.8; });
  if (sym === 'K') { await sleep(0.5); const F = flame(G, FLAME.K, [0, -0.5, 0], 1.6); g.onFrame(F.tick); g.onFrame(() => { F.g.position.x = L.position.x; }); }
}
function water(k, g) {
  const G = new THREE.Group(); G.position.y = 0.6; g.stage.root.add(G);
  const kind = WT[k];
  if (kind === 'order' || kind === 'order2') {
    ['Li', 'Na', 'K'].forEach((s, i) => { const L = lump(G, s, [-2.6 + i * 2.6, 0.4, 0], 0.7); g.stage.tag(`<b>${name[s]}</b>`, L, [0, -0.9, 0], 'big'); });
    const ask = kind === 'order' ? 'Which reacts most strongly with water?' : 'Which reacts most gently with water?';
    const want = kind === 'order' ? 'K' : 'Li';
    g.goal(ask, k);
    choose(g, k, ['Li', 'Na', 'K'], want, { label: (s) => name[s], w: 2.3, size: 0.42, why: 'lithium < sodium < potassium: down the group, more reactive' });
    return;
  }
  const look = k < 3;
  if (look) {
    drop(g, G, WT[k]); g.goal('Which metal is it?', k);
    choose(g, k, ['Li', 'Na', 'K'], WT[k], { label: (s) => name[s], w: 2.3, size: 0.42, why: `${name[WT[k]]} ${WATER_DO[WT[k]]}` });
  } else {
    const L = lump(G, WT[k], [0, 1.0, 0], 0.7); g.stage.tag(`<b>${name[WT[k]]}</b>`, L, [0, 0.9, 0], 'huge');
    g.goal('What will it do on water?', k);
    chooseText(g, k, Object.values(WATER_DO), Object.keys(WATER_DO).indexOf(WT[k]), { tap: false,
      why: `${name[WT[k]]} ${WATER_DO[WT[k]]}`, onRight: () => { G.remove(L); drop(g, G, WT[k]); }, onReveal: () => { G.remove(L); drop(g, G, WT[k]); } });
  }
}

// ---------------------------------------------------------------- 🧪 products (films 804, 808, 811)
const PR = [
  ['2Na + Cl₂ →', ['2NaCl', 'Na₂Cl', 'NaCl₂', 'Na₂O'], 0, 'white sodium chloride'],
  ['4Li + O₂ →', ['2Li₂O', 'LiO₂', '4LiO', 'Li₂O₂'], 0, 'red flame: white lithium oxide'],
  ['2Li + 2H₂O →', ['2LiOH + H₂', 'Li₂O + H₂', '2LiH + O₂', 'LiOH'], 0, 'floats: lithium hydroxide + hydrogen'],
  ['2K + Cl₂ →', ['2KCl', 'K₂Cl', 'KCl₂', 'K₂O'], 0, 'bright flame: white potassium chloride'],
  ['4K + O₂ →', ['2K₂O', 'KO₂', '4KO', 'K₂O₂'], 0, 'lilac flame: white potassium oxide'],
  ['4Na + O₂ →', ['2Na₂O', 'NaO₂', '4NaO', 'Na₂O₂H'], 0, 'sodium burns: sodium oxide'],
  ['Na₂O + H₂O →', ['2NaOH', 'Na₂H₂', 'NaO + H₂', '2NaH'], 0, 'a base: red litmus turns blue'],
  ['2Na + H₂ →', ['2NaH', 'Na₂H', 'NaH₂', 'NaOH'], 0, 'sodium hydride'],
  ['2Na + 2H₂O →', ['2NaOH + H₂', 'Na₂O + H₂', '2NaH + O₂', 'NaOH'], 0, 'fizz: hydrogen gas'],
  ['2Na + Br₂ →', ['2NaBr', 'Na₂Br', 'NaBr₂', 'Na₂O'], 0, 'white sodium bromide'],
  ['2Na + S →', ['Na₂S', 'NaS', 'NaS₂', '2NaS'], 0, 'ground together: sodium sulphide'],
  ['2Na + MgO →', ['Na₂O + Mg', 'NaMgO', '2NaO + Mg', 'Na₂Mg + O'], 0, 'sodium takes the oxygen: magnesium set free'],
  ['4Na + TiCl₄ →', ['4NaCl + Ti', 'NaTi + Cl₄', '2Na₂Cl + Ti', 'TiNa₄ + Cl₂'], 0, 'sodium takes the chlorine: titanium set free'],
  ['Mg + 2HCl →', ['MgCl₂ + H₂', 'MgCl + H', 'MgH₂ + Cl₂', 'MgO + HCl'], 0, 'acid: hydrogen bubbles'],
  ['3Mg + N₂ →', ['Mg₃N₂', 'MgN', 'Mg₂N₃', 'MgN₂'], 0, 'magnesium nitride'],
  ['Mg + H₂ →', ['MgH₂', 'MgH', 'Mg₂H', 'H₂Mg₂'], 0, 'heated: magnesium hydride'],
  ['2Mg + O₂ →', ['2MgO', 'MgO₂', 'Mg₂O', '2MgO₂'], 0, 'dazzling white flame'],
  ['Ca + Cl₂ →', ['CaCl₂', 'CaCl', 'Ca₂Cl', 'CaCl₃'], 0, 'calcium chloride'],
  ['CaO + H₂O →', ['Ca(OH)₂', 'CaH₂', 'CaO₂H', 'Ca + H₂O₂'], 0, 'a base: slaked lime'],
  ['Mg + Br₂ →', ['MgBr₂', 'MgBr', 'Mg₂Br', 'MgBr₃'], 0, 'magnesium bromide'],
];
const PO = shuffle(PR.map((_, i) => i));
function products(k, g) {
  const [eq, o, a, why] = PR[PO[k]], G = new THREE.Group(); G.position.y = 0.6; g.stage.root.add(G);
  const sym = eq.match(/Mg|Ca|Na|Li|K/)[0], L = lump(G, sym, [-2.4, -0.2, 0], 0.9); popIn(L, 1, 0.4);
  g.stage.tag(`<b>${eq} ?</b>`, G, [0.8, 1.4, 0], 'huge');
  let shown = false;
  const result = () => {
    if (shown) return; shown = true;
    if (/H₂O|HCl/.test(eq) && /H₂/.test(o[a])) g.onFrame(fizz(G, L, { rate: 14 }));
    if (/O₂ →/.test(eq) || /Cl₂/.test(eq)) { const F = flame(G, FLAME[sym], [-2.4, 0, 0], 1.4); g.onFrame(F.tick); }
    if (/OH/.test(o[a])) { const S = litmus(G, 'red', [2.6, -0.3, 0]); S.userData.turn('blue'); }
    g.stage.tag(`<b>${o[a]}</b>`, G, [0.8, 0.4, 0], 'huge gold');
  };
  g.goal('Which product forms?', k);
  choose(g, k, o, o[a], { w: 2.4, size: 0.42, why: `${eq} ${o[a]}: ${why}`, onRight: result, onReveal: result });
}

// ---------------------------------------------------------------- 📶 order (reactivity and ionization energy)
const OR = [
  { ask: 'Which is more reactive?', a: ['K', 'Li'], why: 'K: its outer electron is far out, easy to give' },
  { ask: 'Which is more reactive?', a: ['Na', 'Mg'], why: 'group IA gives 1 electron more easily than IIA gives 2' },
  { ask: 'Which needs more energy to lose an electron?', a: ['Li', 'Cs'], why: 'Li 520 kJ/mol, Cs 376: small atom holds tighter' },
  { ask: 'Which needs more energy to lose an electron?', a: ['Mg', 'Na'], why: 'Mg 738 vs Na 496: IIA is higher than IA' },
  { ask: 'Which is more reactive?', a: ['Ca', 'Mg'], why: 'down group IIA: bigger atom, more reactive' },
  { ask: 'Which needs more energy to lose an electron?', a: ['Be', 'Ba'], why: 'Be 899 vs Ba 503: down the group it falls' },
  { ask: 'Which is more reactive?', a: ['Cs', 'Na'], why: 'down group IA: lower ionization energy, more reactive' },
  { ask: 'Which costs more for magnesium?', a: ['2nd electron', '1st electron'], why: '2nd: 1450.7 vs 1st: 737.7 kJ/mol' },
];
const SIZE = { Li: 0.75, Na: 1.0, K: 1.3, Rb: 1.4, Cs: 1.55, Be: 0.7, Mg: 0.9, Ca: 1.15, Ba: 1.4, '1st electron': 1, '2nd electron': 1 };
const OO = shuffle(OR.map((_, i) => i));
function order(k, g) {
  const r = OR[OO[k]], G = new THREE.Group(); G.position.y = 0.5; g.stage.root.add(G);
  if (!r.a[0].includes('electron')) {
    const two = shuffle(r.a); two.forEach((s, i) => { const m = atom(g.stage, G, s, [-1.8 + i * 3.6, 0.2, 0], SIZE[s]); popIn(m, m.scale.x, 0.4); });
  } else { const mg = atom(g.stage, G, 'Mg', [0, 0.2, 0], 1.3); popIn(mg, mg.scale.x, 0.4); }
  g.goal(r.ask, k);
  choose(g, k, r.a, r.a[0], { label: String, w: 2.6, size: 0.45, why: r.why });
}

const PARTS = [
  { key: 'flame', icon: '🔥', name: 'Flames', n: FL.length, steps: [5], run: flames },
  { key: 'water', icon: '💧', name: 'Water', n: WT.length, steps: [3, 6], run: water },
  { key: 'make', icon: '🧪', name: 'Products', n: PR.length, steps: [8], run: products },
  { key: 'order', icon: '📶', name: 'Order', n: OR.length, run: order },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'reactlab', parts: PARTS, cam: [0, 0.4, 13.5], target: [0, 0.2, 0], excite: true });
}
