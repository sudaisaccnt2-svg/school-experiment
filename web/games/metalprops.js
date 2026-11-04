// Metal or Non-metal? (Unit 8, films 801, 813-815, 809, 812, 814): sort what you learned, card by card.
//   ⚖️ Sort     a property card → metal (a copper lump) or non-metal (a sulphur lump)? (Table 8.8)
//   🔪 Soft     sodium or iron? (Table 8.7: knife, float, melting point, bridges, kerosene)
//   💍 Free     found free in nature (noble, does not react) or combined (reactive)? (Long Q III)
//   🛠️ Uses     which element is used for this? (sodium, magnesium, calcium, silver, platinum, gold)
//   🧱 Table    metal or non-metal by its place in the periodic table (p.219 Scientific Tidbit)
// Covers Short Q i, iii, vi, vii, Long Q II a, III, IV, Activity 8.2.
import { THREE, popIn } from './kit.js';
import { runGame, choose, shuffle } from './rounds.js';
import { lump } from './chem8.js';

const SORT = shuffle([
  ['conducts electricity', 'metal'], ['can be beaten into sheets', 'metal'],
  ['can be drawn into wires', 'metal'], ['loses electrons → positive ion', 'metal'], ['basic oxide: red litmus → blue', 'metal'],
  ['does not conduct electricity', 'non-metal'], ['brittle: shatters when hit', 'non-metal'], ['gains electrons → negative ion', 'non-metal'],
  ['acidic oxide: blue litmus → red', 'non-metal'], ['high electronegativity', 'non-metal'], ['can be a gas at room temperature', 'non-metal'],
]);
// p.219 Scientific Tidbit: which places in the periodic table hold metals (book's group numbers)
const TABLE = shuffle([
  ['H', 'hydrogen', 'group 1', 'non-metal', 'group 1: all metals except hydrogen'], ['Na', 'sodium', 'group 1', 'metal', 'group 1: all metals except hydrogen'],
  ['Mg', 'magnesium', 'group 2', 'metal', 'group 2: all metals'], ['B', 'boron', 'group 3', 'non-metal', 'group 3: all metals except boron'],
  ['Al', 'aluminium', 'group 3', 'metal', 'group 3: all metals except boron'], ['C', 'carbon', 'group 4', 'non-metal', 'group 4: only tin and lead are metals'],
  ['Sn', 'tin', 'group 4', 'metal', 'group 4: only tin and lead are metals'], ['Pb', 'lead', 'group 4', 'metal', 'group 4: only tin and lead are metals'],
  ['N', 'nitrogen', 'group 5', 'non-metal', 'group 5: only antimony and bismuth are metals'], ['Sb', 'antimony', 'group 5', 'metal', 'group 5: only antimony and bismuth are metals'],
  ['Bi', 'bismuth', 'group 5', 'metal', 'group 5: only antimony and bismuth are metals'], ['O', 'oxygen', 'group 6', 'non-metal', 'groups 6, 7, 8: all non-metals'],
  ['Cl', 'chlorine', 'group 7', 'non-metal', 'groups 6, 7, 8: all non-metals'], ['Ar', 'argon', 'group 8', 'non-metal', 'groups 6, 7, 8: all non-metals'],
  ['Fe', 'iron', 'd-block', 'metal', 'd-block elements: all metals'], ['Ce', 'cerium', 'lanthanides', 'metal', 'lanthanides: all metals'],
  ['U', 'uranium', 'actinides', 'metal', 'actinides: all metals'],
]);
const SOFT = shuffle([
  ['a knife cuts it', 'sodium'], ['a knife cannot cut it', 'iron'], ['floats on water', 'sodium'], ['sinks in water', 'iron'],
  ['melts at 97.6 °C', 'sodium'], ['melts at 1538 °C', 'iron'], ['builds bridges and buildings', 'iron'], ['kept under kerosene', 'sodium'],
]);
const FREE = shuffle([['gold', 'free'], ['platinum', 'free'], ['silver', 'free'], ['sodium', 'combined'], ['potassium', 'combined'],
  ['calcium', 'combined'], ['magnesium', 'combined'], ['lithium', 'combined']]);
const USES = shuffle([
  ['street lamps glow orange-yellow', 'sodium'], ['cools nuclear reactors', 'sodium'], ['takes sulphur out of petrol', 'sodium'],
  ['light alloys for aircraft', 'magnesium'], ['flashlights and fireworks', 'magnesium'], ['MgO bricks line furnaces', 'magnesium'],
  ['lime makes soil less acidic', 'calcium'], ['cleans oxygen out of steel', 'calcium'], ['best mirrors and conductor', 'silver'],
  ['cleans car exhaust', 'platinum'], ['wires in computers', 'gold'], ['jewellery (with copper added)', 'gold'],
]);
const SYM = { aluminium: 'Al', sodium: 'Na', iron: 'Fe', gold: 'Au', platinum: 'Pt', silver: 'Ag', potassium: 'K', calcium: 'Ca', magnesium: 'Mg', lithium: 'Li' };
const sulphur = new THREE.MeshStandardMaterial({ color: 0xf2d230, roughness: 0.85 });

// p.220 Scientific Information: how much of the earth each metal makes up (as printed)
const CRUST = shuffle([['aluminium', 'about 8 %'], ['iron', 'about 5 %'], ['calcium', 'about 4 %'], ['potassium', 'less than 4 %'], ['sodium', 'less than 4 %'], ['magnesium', 'less than 4 %']]);
function crust(k, g) {
  const [m, a] = CRUST[k], G = new THREE.Group(); g.stage.root.add(G);
  const L = lump(G, SYM[m], [0, 0.2, 0], 1.3); popIn(L, 1, 0.4);
  g.stage.tag(`<b>${m}</b>`, L, [0, 1.3, 0], 'huge');
  g.goal('How much of the earth is this metal?', k);
  choose(g, k, ['about 8 %', 'about 5 %', 'about 4 %', 'less than 4 %'], a, { w: 2.6, size: 0.44,
    why: 'Earth: about 8 % aluminium, 5 % iron, 4 % calcium; less than 4 % potassium, sodium, magnesium' });
}
function card(g, text) { g.stage.tag(`<b>${text}</b>`, g.stage.root, [0, 1.6, 0], 'huge'); }
function sort(k, g) {
  const [text, a] = SORT[k], G = new THREE.Group(); g.stage.root.add(G);
  const cu = lump(G, 'Cu', [-3.4, -0.3, 0], 1.1), s = new THREE.Mesh(new THREE.DodecahedronGeometry(0.6), sulphur);
  s.position.set(3.4, -0.3, 0); G.add(s); popIn(cu, 1, 0.4); popIn(s, 1, 0.4);
  card(g, text); g.goal('Metal or non-metal?', k);
  choose(g, k, ['metal', 'non-metal'], a, { w: 2.6, size: 0.48, why: `${text}: ${a}` });
}
function table(k, g) {
  const [sym, name, grp, a, why] = TABLE[k], G = new THREE.Group(); g.stage.root.add(G);
  const cu = lump(G, 'Cu', [-3.4, -0.3, 0], 1.1), s = new THREE.Mesh(new THREE.DodecahedronGeometry(0.6), sulphur);
  s.position.set(3.4, -0.3, 0); G.add(s); popIn(cu, 1, 0.4); popIn(s, 1, 0.4);
  card(g, `${sym} · ${name} · ${grp}`); g.goal('In the periodic table: metal or non-metal?', k);
  choose(g, k, ['metal', 'non-metal'], a, { w: 2.6, size: 0.48, why });
}
function soft(k, g) {
  const [text, a] = SOFT[k], G = new THREE.Group(); g.stage.root.add(G);
  ['sodium', 'iron'].forEach((m, i) => { const L = lump(G, SYM[m], [i ? 3.4 : -3.4, -0.3, 0], 1.0); popIn(L, 1, 0.4); });
  card(g, text); g.goal('Soft sodium or hard iron?', k);
  choose(g, k, ['sodium', 'iron'], a, { w: 2.4, size: 0.48, why: `${a}: ${text}` });
}
function free(k, g) {
  const [m, a] = FREE[k], G = new THREE.Group(); g.stage.root.add(G);
  const L = lump(G, SYM[m], [0, 0.2, 0], 1.3); popIn(L, 1, 0.4);
  g.stage.tag(`<b>${m}</b>`, L, [0, 1.3, 0], 'huge');
  g.goal('Found free in nature, or combined?', k);
  choose(g, k, ['free', 'combined'], a, { w: 2.6, size: 0.48,
    why: a === 'free' ? `${m}: noble, hardly reacts, so it is found free` : `${m}: reactive, so it is found combined in compounds` });
}
function uses(k, g) {
  const [text, a] = USES[k];
  card(g, text); g.goal('Which element is used?', k);
  const opts = shuffle([a, ...shuffle(['sodium', 'magnesium', 'calcium', 'silver', 'platinum', 'gold'].filter((x) => x !== a)).slice(0, 3)]);
  const T = choose(g, k, opts, a, { w: 2.3, size: 0.44, why: `${a}: ${text}` });
  T.forEach((t) => { const L = lump(t, SYM[t.userData.v], [0, 0.85, 0], 0.45); L.rotation.y = 0.5; });
}

const PARTS = [
  { key: 'sort', icon: '⚖️', name: 'Sort', n: SORT.length, steps: [6], run: sort },
  { key: 'table', icon: '🧱', name: 'In the table', n: TABLE.length, steps: [8], run: table },
  { key: 'crust', icon: '🌍', name: 'In the earth', n: CRUST.length, run: crust },
  { key: 'soft', icon: '🔪', name: 'Soft or hard', n: SOFT.length, run: soft },
  { key: 'free', icon: '💍', name: 'Free?', n: FREE.length, run: free },
  { key: 'uses', icon: '🛠️', name: 'Uses', n: USES.length, steps: [6], run: uses },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'metalprops', parts: PARTS, cam: [0, 0.4, 13.5], target: [0, 0.2, 0], excite: true });
}
