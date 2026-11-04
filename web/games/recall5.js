// Matter Practice (Unit 5): what the lessons hand over to the game (SKILL: memorize = game).
// Easy → hard: 🔍 Explore (every item shown with its answer) · 📖 Words (Key Points pp.148–149: definition → name) ·
// 📋 Facts (dates, units, Tables 5.1, 5.2, 5.3, transition temperatures, the carbon forms …) · 💡 Why? (Long Q iii
// allotropy and the three crystalline forms of carbon, Long Q iv amorphous vs crystalline) · ⚡ Speed (10 s each,
// once everything is known). The particles of a jar show the state the item is about. Arcade layer on (excite).
import { THREE, popIn } from './kit.js';
import { runGame, chooseText, shuffle } from './rounds.js';
import { Molecules, jar, gridSeats, MOLM } from './gas3d.js';
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// ---------------------------------------------------------------- a jar of particles for the picture
function pic(g, kind) {
  const J = jar(1.2, 2.8); J.position.set(0, -1.1, 0); g.stage.root.add(J); popIn(J, 1, 0.4);
  let m;
  if (kind === 'solid' || kind === 'crystal') m = new Molecules(J, { seats: gridSeats(4, 4, 0.42, V(0, 1.0)), mat: kind === 'crystal' ? MOLM.gold : MOLM.air, r: 0.16, amp: 0.03 });
  else if (kind === 'amorphous') { const pts = Array.from({ length: 14 }, (_, i) => V(Math.sin(i * 2.3) * 0.75, 0.4 + ((i * 0.37) % 1) * 1.6, Math.cos(i * 1.7) * 0.2)); m = new Molecules(J, { seats: pts, mat: MOLM.glassP ?? MOLM.air, r: 0.17, amp: 0.02 }); }
  else if (kind === 'liquid') m = new Molecules(J, { n: 18, lo: V(-0.9, 0, -0.3), hi: V(0.9, 1.2, 0.3), r: 0.16, speed: 0.8 });
  else m = new Molecules(J, { n: 9, lo: V(-1.0, 0, -0.4), hi: V(1.0, 2.7, 0.4), r: 0.15, speed: kind === 'hot' ? 4.5 : 3.0 });
  g.onFrame((dt) => m.update(dt));
}
// ---------------------------------------------------------------- the items: [question, right, wrong, wrong, picture]
const WORDS = [
  ['the highest energy state of matter', 'gas', 'gas'], ['spontaneous mixing by random motion, crowded → less crowded', 'diffusion', 'gas'],
  ['escape one by one through a hole of molecular size', 'effusion', 'gas'], ['force per unit area', 'pressure', 'gas'],
  ['change in volume per unit change in pressure', 'compressibility', 'gas'], ['mass per unit volume', 'density', 'liquid'],
  ['V falls as P rises, at the same temperature', "Boyle's law", 'gas'], ['V ∝ absolute temperature, at the same pressure', "Charles's law", 'hot'],
  ['temperature on the Kelvin scale', 'absolute temperature', 'hot'], ['spontaneous change of a liquid into a gas', 'evaporation', 'liquid'],
  ['pressure of the vapour when evaporation = condensation', 'vapour pressure', 'liquid'], ['vapour pressure = outside pressure', 'boiling point', 'hot'],
  ['liquid and solid in equilibrium (cooling)', 'freezing point', 'solid'], ['a solid starts melting, in equilibrium with its liquid', 'melting point', 'solid'],
  ['no ordered arrangement of particles', 'amorphous solid', 'amorphous'], ['particles in regular 3D patterns', 'crystalline solid', 'crystal'],
  ['an element in more than one form', 'allotropy', 'crystal'], ['one allotrope changes into another', 'transition temperature', 'crystal'],
];
const TERMS = WORDS.map((w) => w[1]);
const FACTS = [
  ['Other states of matter:', 'plasma, liquid crystals, superfluids', 'steam, ice, water', 'salt, sugar, sand', 'gas'],
  ['Graham (1833) found that …', 'a lighter gas diffuses faster', 'a heavier gas diffuses faster', 'all gases diffuse equally', 'gas'],
  ['You smell onions in a sealed bag because of …', 'effusion', 'evaporation', 'boiling', 'gas'],
  ['A balloon comes down after a day or two because …', 'its gas escapes through the rubber', 'the air gets heavier', 'the rubber gets heavier', 'gas'],
  ['1 atmosphere =', '760 mm Hg = 760 torr = 101.325 kPa', '76 mm Hg = 7.6 torr', '1 Pa = 1 mm Hg', 'gas'],
  ['The SI unit of pressure:', 'N m⁻² (pascal, Pa)', 'kg m⁻³', 'joule (J)', 'gas'],
  ['Density of oxygen gas (0 °C, 1 atm):', '0.00142 g/cm³', '1.149 g/cm³', '1.42 g/cm³', 'gas'],
  ['Density of solid oxygen (−252 °C):', '1.42 g/cm³', '0.00142 g/cm³', '1.149 g/cm³', 'solid'],
  ['Robert Boyle described his law in …', '1662', '1787', '1833', 'gas'],
  ['Jacques Charles gave his law in …', '1787', '1662', '1646', 'hot'],
  ['Torricelli invented the barometer in …', '1646', '1787', '1985', 'liquid'],
  ['Kelvin from Celsius:', 'K = °C + 273', 'K = °C − 273', 'K = °C × 273', 'hot'],
  ['Highest vapour pressure in Table 5.1 (25 °C):', 'chloroform, 170 mm Hg', 'water, 18 mm Hg', 'glycerol, 0.00016 mm Hg', 'liquid'],
  ['Vapour pressure of water at 25 °C (Table 5.1):', '18 mm Hg', '170 mm Hg', '87 mm Hg', 'liquid'],
  ['Vapour pressure of CCl₄ at 25 °C (Table 5.1):', '87 mm Hg', '18 mm Hg', '170 mm Hg', 'liquid'],
  ['Which evaporates faster?', 'alcohol (weaker forces than water)', 'water (stronger forces)', 'both the same', 'liquid'],
  ['Which has more vapour pressure?', 'pentane (smaller molecules)', 'decane (bigger molecules)', 'both the same', 'liquid'],
  ['Which has more vapour pressure?', 'acetone (non-polar)', 'water (polar)', 'both the same', 'liquid'],
  ['Boiling points in Fig. 5.13:', 'ether 34.6 · ethanol 78.3 · water 100 °C', 'all 100 °C', 'water 34.6 · ether 100 °C', 'hot'],
  ['Table 5.2: benzene freezes and boils at …', '5.5 °C and 80.2 °C', '16.6 °C and 118.1 °C', '43.0 °C and 181.0 °C', 'liquid'],
  ['Table 5.2: acetic acid freezes and boils at …', '16.6 °C and 118.1 °C', '5.5 °C and 80.2 °C', '−63.5 °C and 61.2 °C', 'liquid'],
  ['Table 5.2: phenol freezes and boils at …', '43.0 °C and 181.0 °C', '−114.7 °C and 78.4 °C', '0 °C and 100 °C', 'liquid'],
  ['Table 5.2: chloroform freezes and boils at …', '−63.5 °C and 61.2 °C', '16.6 °C and 118.1 °C', '5.5 °C and 80.2 °C', 'liquid'],
  ['Table 5.2: ethanol freezes and boils at …', '−114.7 °C and 78.4 °C', '−63.5 °C and 61.2 °C', '0 °C and 100 °C', 'liquid'],
  ['Table 5.3: density of water (4 °C)', '1.00 g/cm³', '0.918 g/cm³', '0.792 g/cm³', 'liquid'],
  ['Table 5.3: density of olive oil (15 °C)', '0.918 g/cm³', '1.00 g/cm³', '0.969 g/cm³', 'liquid'],
  ['Table 5.3: density of castor oil (15 °C)', '0.969 g/cm³', '0.792 g/cm³', '0.810 g/cm³', 'liquid'],
  ['Table 5.3: density of linseed oil (15 °C)', '0.942 g/cm³', '0.791 g/cm³', '1.00 g/cm³', 'liquid'],
  ['Table 5.3: density of acetone (20 °C)', '0.792 g/cm³', '0.969 g/cm³', '0.942 g/cm³', 'liquid'],
  ['Table 5.3: density of ethyl alcohol (20 °C)', '0.791 g/cm³', '0.918 g/cm³', '1.00 g/cm³', 'liquid'],
  ['Table 5.3: density of methyl alcohol (20 °C)', '0.810 g/cm³', '0.969 g/cm³', '0.942 g/cm³', 'liquid'],
  ['A pressure cooker cooks faster because …', 'more pressure raises the boiling point', 'it has no air inside', 'it lowers the boiling point', 'hot'],
  ['On a hill, water boils …', 'below 100 °C (less air pressure)', 'above 100 °C', 'at exactly 100 °C', 'hot'],
  ['Transition temperature of sulphur (rhombic ↔ monoclinic):', '95.5 °C', '13.2 °C', '128.5 °C', 'crystal'],
  ['Transition temperature of tin (grey ↔ white):', '13.2 °C', '95.5 °C', '128.5 °C', 'crystal'],
  ['Transition temperature of KNO₃:', '128.5 °C', '95.5 °C', '13.2 °C', 'crystal'],
  ['Allotropes of oxygen:', 'O₂ and O₃', 'O and O₂', 'H₂O and O₂', 'gas'],
  ['Buckyballs were discovered in …', '1985', '1662', '1833', 'crystal'],
  ['A buckyball has …', '20–100 carbon atoms in a hollow cage', 'one carbon atom', 'layers of hexagons', 'crystal'],
  ['Graphite is used as …', 'a lubricant (and it conducts)', 'a gem (it is hard)', 'an insulator', 'crystal'],
  ['Diamond does not conduct because …', 'all 4 outer electrons are in bonds', 'it has free electrons', 'it is a liquid', 'crystal'],
  ['Amorphous forms of carbon:', 'coke, charcoal, lampblack', 'diamond, graphite, buckyball', 'sulphur, tin, KNO₃', 'amorphous'],
  ['Salt preserves meat and fish because …', 'bacteria cannot grow, water leaves the cells', 'it makes them freeze', 'it adds oxygen', 'crystal'],
  ['Examples of amorphous solids:', 'glass, wax, butter, plastic, rubber', 'salt, sugar, diamond', 'iron, copper, gold', 'amorphous'],
  ['Examples of crystalline solids:', 'sodium chloride, naphthalene', 'glass, wax', 'rubber, plastic', 'crystal'],
];
const WHY = [
  { q: 'Long Q iii: what is allotropy? Give the three crystalline forms of carbon.', pic: 'crystal', o: ['One element in more forms: diamond (4 bonds, hard), graphite (layers, soft, conducts), buckyball (hollow cage)', 'One element in more forms: coke (hard), charcoal (soft), lampblack (cage)', 'Different elements in one form: carbon, oxygen and sulphur'], a: 0 },
  { q: 'Long Q iii: why is diamond hard but graphite soft?', pic: 'crystal', o: ['Diamond: every atom held by 4 strong bonds; graphite: layers held by weak forces slide', 'Diamond has free electrons; graphite has none', 'Diamond is a liquid crystal; graphite is a gas'], a: 0 },
  { q: 'Long Q iii: why does graphite conduct but diamond does not?', pic: 'crystal', o: ['Graphite uses 3 bonds, one electron each is free; diamond uses all 4 in bonds', 'Diamond uses 3 bonds and keeps one electron free', 'Both conduct equally well'], a: 0 },
  { q: 'Long Q iv: what is the difference between amorphous and crystalline solids?', pic: 'amorphous', o: ['Amorphous: no order, softens over a range; crystalline: a regular 3D pattern, a sharp melting point', 'Amorphous: a regular pattern; crystalline: no order', 'Both soften over a range of temperature'], a: 0 },
];

function holder(g, y = 1.0) { const G = new THREE.Group(); G.position.y = y; g.stage.root.add(G); return G; }
function word(k, g, list, timed = false, item = list[k]) {
  const [d, term, kind] = item; pic(g, kind); g.goal(d, k);
  chooseText(g, k, [term, ...shuffle(TERMS.filter((t) => t !== term)).slice(0, 3)], 0, { why: `${term}: ${d}`, tap: false });
  if (timed) g.timer(10, () => g._reveal && g._reveal(), true);
}
function fact(k, g, list, timed = false, item = list[k]) {
  const [q, right, w1, w2, kind] = item; pic(g, kind); g.goal(q, k);
  chooseText(g, k, [right, w1, w2], 0, { why: right, tap: false });
  if (timed) g.timer(10, () => g._reveal && g._reveal(), true);
}
function why(k, g, i = k) { const r = WHY[i]; pic(g, r.pic); g.goal(r.q, k); chooseText(g, k, r.o, r.a, { why: r.o[r.a], tap: false }); }
function explore(k, g) {
  const tap = (msg) => g.setTap(() => g.right(k, true, msg, 0, false));
  if (k < WORDS.length) { const [d, term, kind] = WORDS[k]; pic(g, kind); g.stage.tag(`<b>${term}</b>`, g.stage.root, [3.4, 1.0, 0], 'huge gold'); g.goal(d, k); tap(`${term}: ${d}`); return; }
  k -= WORDS.length;
  if (k < FACTS.length) { const [q, right, , , kind] = FACTS[k]; pic(g, kind); g.stage.tag(`<b>${right}</b>`, g.stage.root, [0, 2.4, 0], 'big gold'); g.goal(q, k + WORDS.length); tap(right); return; }
  const r = WHY[k - FACTS.length]; pic(g, r.pic); g.stage.tag(`<b>${r.o[r.a]}</b>`, g.stage.root, [0, 2.4, 0], 'big gold'); g.goal(r.q, k + WORDS.length + FACTS.length); tap(r.o[r.a]);
}
const WY = shuffle(WHY.map((_, i) => i)), W1 = shuffle(WORDS), F1 = shuffle(FACTS), SP = shuffle([...WORDS.map((w) => ['w', w]), ...FACTS.slice(0, 12).map((f) => ['f', f])]).slice(0, 20);
const PARTS = [
  { key: 'explore', icon: '🔍', name: 'Explore', n: WORDS.length + FACTS.length + WHY.length, run: explore },
  { key: 'words', icon: '📖', name: 'Words', n: W1.length, steps: [9], run: (k, g) => word(k, g, W1) },
  { key: 'facts', icon: '📋', name: 'Facts', n: F1.length, steps: [10, 20, 30, 40], run: (k, g) => fact(k, g, F1) },
  { key: 'why', icon: '💡', name: 'Why?', n: WHY.length, run: (k, g) => why(k, g, WY[k]) },
  { key: 'speed', icon: '⚡', name: 'Speed', n: SP.length, run: (k, g) => (SP[k][0] === 'w' ? word(k, g, null, true, SP[k][1]) : fact(k, g, null, true, SP[k][1])) },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'recall5', parts: PARTS, cam: [0, 0.4, 13.5], target: [0, 0.2, 0], excite: true });
}
