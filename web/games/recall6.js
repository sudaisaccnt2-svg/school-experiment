// Solutions Practice (Unit 6): what the lessons hand over to the game (SKILL: memorize = game).
// Easy → hard: 🔍 Explore (every item shown with its answer) · 📖 Words (Key Points pp.177–178: definition → name) ·
// 📋 Tables (Table 6.1 classes of colloids, Table 6.2 properties, the nine types of 6.3, the alloys, Activity 6.2,
// Fig. 6.10 / 6.11 salts and gases, the units) · 💡 Why? (Short Q i, ii, iv, v · Long Q i–v) · ⚡ Speed (10 s each,
// once everything is known). The particles in a beaker show what the item is about. Arcade layer on (excite).
import { THREE, popIn } from './kit.js';
import { runGame, chooseText, shuffle } from './rounds.js';
import { Molecules, jar, gridSeats, MOLM, WATER } from './gas3d.js';
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// ---------------------------------------------------------------- a beaker of particles for the picture
// sol: tiny gold, even · col: middle white, never settle · sus: big brown on the bottom · gas: drifting · solid: rows
// hot: fast · two: two liquids in two layers
function pic(g, kind) {
  const J = jar(1.2, 2.8); J.position.set(0, -1.1, 0); g.stage.root.add(J); popIn(J, 1, 0.4);
  const lo = V(-0.9, 0.05, -0.3), hi = (h) => V(0.9, h, 0.3), L = [];
  const water = (h = 2.0, y = h / 2, mat = WATER) => { const w = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, h, 32), mat); w.position.y = y; J.add(w); };
  if (kind === 'sol') { water(); L.push(new Molecules(J, { n: 28, lo, hi: hi(2.0), mat: MOLM.gold, r: 0.05, speed: 0.6 })); }
  else if (kind === 'col') { water(); L.push(new Molecules(J, { n: 16, lo, hi: hi(2.0), mat: MOLM.white, r: 0.1, speed: 0.4 })); }
  else if (kind === 'sus') { water(); L.push(new Molecules(J, { seats: gridSeats(5, 2, 0.4, V(0, 0.28)), mat: MOLM.brown, r: 0.2, amp: 0.01 })); }
  else if (kind === 'solid') L.push(new Molecules(J, { seats: gridSeats(4, 4, 0.42, V(0, 1.0)), mat: MOLM.gold, r: 0.16, amp: 0.03 }));
  else if (kind === 'two') { water(0.9, 0.45); L.push(new Molecules(J, { n: 8, lo: V(-0.9, 1.0, -0.3), hi: V(0.9, 1.8, 0.3), mat: MOLM.gold, r: 0.12, speed: 0.4 }), new Molecules(J, { n: 8, lo, hi: hi(0.85), mat: MOLM.air, r: 0.12, speed: 0.4 })); }
  else L.push(new Molecules(J, { n: 10, lo: V(-1.0, 0, -0.4), hi: V(1.0, 2.7, 0.4), mat: MOLM.air, r: 0.15, speed: kind === 'hot' ? 4.5 : 2.2 }));
  g.onFrame((dt) => L.forEach((m) => m.update(dt)));
}
// ---------------------------------------------------------------- Key Points (pp.177–178): [definition, name, picture]
const WORDS = [
  ['a homogeneous mixture of two or more than two substances', 'solution', 'sol'],
  ['a solution formed by dissolving a substance in water', 'aqueous solution', 'sol'],
  ['the part of a solution present in the smaller amount', 'solute', 'sol'],
  ['the part of a solution present in the larger amount', 'solvent', 'sol'],
  ['cannot dissolve more solute at a particular temperature', 'saturated solution', 'sus'],
  ['can dissolve more solute at a particular temperature', 'unsaturated solution', 'sol'],
  ['holds more solute than it needs to be saturated', 'supersaturated solution', 'hot'],
  ['the amount of solute in a given amount of solvent or solution', 'concentration', 'sol'],
  ['a small amount of solute dissolved in the solvent', 'dilute solution', 'sol'],
  ['a large amount of solute dissolved in the solvent', 'concentrated solution', 'sol'],
  ['parts of solute in 100 parts of solution', 'percentage', 'sol'],
  ['moles of solute in 1 dm³ of solution', 'molarity', 'sol'],
  ['grams of solute in 100 g of solvent, to make a saturated solution', 'solubility', 'sus'],
  ['a solution whose concentration is known', 'standard solution', 'sol'],
  ['liquids that do not dissolve in each other', 'immiscible', 'two'],
  ['liquids that mix in any amount', 'completely miscible', 'sol'],
  ['particles 1–1000 nm that do not settle', 'colloid', 'col'],
  ['light scattered by colloid particles', 'Tyndall effect', 'col'],
  ['a heterogeneous mixture of big undissolved particles', 'suspension', 'sus'],
  ['particles settling at the bottom', 'sedimentation', 'sus'],
];
const TERMS = WORDS.map((w) => w[1]);
// ---------------------------------------------------------------- tables and facts: [question, right, wrong, wrong, picture]
const FACTS = [
  // the nine types (6.3.1–6.3.3)
  ['Air (oxygen in nitrogen) is …', 'gas in gas', 'liquid in gas', 'solid in gas', 'gas'],
  ['Fog, humidity (water vapour in air) is …', 'liquid in gas', 'gas in gas', 'liquid in liquid', 'gas'],
  ['Smoke (carbon particles in air) is …', 'solid in gas', 'gas in solid', 'solid in liquid', 'gas'],
  ['Soda water (CO₂ in water) is …', 'gas in liquid', 'liquid in gas', 'gas in solid', 'sol'],
  ['Alcohol in water is …', 'liquid in liquid', 'liquid in solid', 'solid in liquid', 'sol'],
  ['Sugar or salt in water is …', 'solid in liquid', 'liquid in solid', 'solid in solid', 'sol'],
  ['Hydrogen in palladium is …', 'gas in solid', 'solid in gas', 'gas in liquid', 'solid'],
  ['Amalgam (mercury in silver, dental fillings) is …', 'liquid in solid', 'solid in liquid', 'solid in solid', 'solid'],
  ['Brass and bronze are …', 'solid in solid', 'liquid in solid', 'solid in liquid', 'solid'],
  ['How many types of solution are there (by state)?', '9', '3', '6', 'sol'],
  // alloys
  ['Brass =', 'copper + zinc', 'copper + tin', 'silver + copper', 'solid'],
  ['Bronze =', 'copper + tin', 'copper + zinc', 'iron + carbon', 'solid'],
  ['Sterling silver =', '92.5 % silver + 7.5 % copper', '50 % silver + 50 % mercury', '75 % silver + 25 % zinc', 'solid'],
  ['Dental amalgam holds about …', '50 % mercury', '7.5 % mercury', '92.5 % mercury', 'solid'],
  ['Airplane parts are a solid solution of …', 'aluminium + magnesium', 'copper + tin', 'iron + carbon', 'solid'],
  // Table 6.1 classes of colloids
  ['Table 6.1: a sol is …', 'solid dispersed in liquid (paints, mud)', 'liquid dispersed in solid (gelatin)', 'gas dispersed in liquid (shaving cream)', 'col'],
  ['Table 6.1: a gel is …', 'liquid dispersed in solid (gelatin)', 'solid dispersed in liquid (paints)', 'liquid dispersed in gas (fog)', 'col'],
  ['Table 6.1: a liquid emulsion is …', 'liquid dispersed in a liquid (milk, mayonnaise)', 'gas dispersed in liquid (whipped cream)', 'solid dispersed in gas (smoke)', 'col'],
  ['Table 6.1: a foam is …', 'gas dispersed in liquid (shaving cream, whipped cream)', 'liquid dispersed in gas (mist)', 'liquid dispersed in solid (cheese)', 'col'],
  ['Table 6.1: a solid aerosol is …', 'solid dispersed in gas (smoke, auto exhaust)', 'liquid dispersed in gas (fog)', 'solid dispersed in liquid (mud)', 'gas'],
  ['Table 6.1: a liquid aerosol is …', 'liquid dispersed in gas (fog, mist, clouds, aerosol spray)', 'solid dispersed in gas (smoke)', 'gas dispersed in liquid (foam)', 'gas'],
  ['Table 6.1: a solid emulsion is …', 'liquid dispersed in solid (cheese, butter)', 'solid dispersed in liquid (paints)', 'liquid dispersed in a liquid (milk)', 'col'],
  // Table 6.2 properties
  ['Table 6.2: which one is homogeneous?', 'solution', 'colloid', 'suspension', 'sol'],
  ['Table 6.2: particle size of a solution:', '0.01–1 nm (atoms, ions, molecules)', '1–1000 nm', 'over 1000 nm', 'sol'],
  ['Table 6.2: particle size of a colloid:', '1–1000 nm (aggregates or large molecules)', '0.01–1 nm', 'over 1000 nm', 'col'],
  ['Table 6.2: particle size of a suspension:', 'over 1000 nm (large particles)', '1–1000 nm', '0.01–1 nm', 'sus'],
  ['Table 6.2: which settles down on standing?', 'suspension', 'colloid', 'solution', 'sus'],
  ['Table 6.2: which can be separated by filtration?', 'suspension', 'colloid', 'solution', 'sus'],
  ['Table 6.2: which scatters light (Tyndall effect)?', 'colloid', 'solution', 'none of them', 'col'],
  ['Table 6.2: whose particles are seen with the naked eye?', 'suspension', 'colloid', 'solution', 'sus'],
  ['Fig. 6.14: salt water · milk in water · flour in water are …', 'solution · colloid · suspension', 'colloid · solution · suspension', 'suspension · colloid · solution', 'col'],
  ['Medicines you must shake before use (antacid, antibiotic, paracetamol) are …', 'suspensions', 'solutions', 'colloids', 'sus'],
  // units
  ['1 dm³ =', '1 L = 1000 cm³ = 1000 ml', '100 cm³ = 100 ml', '1 cm³ = 1000 ml', 'sol'],
  ['Moles =', 'grams ÷ molar mass', 'molar mass ÷ grams', 'grams × molar mass', 'sol'],
  ['Molarity =', 'moles of solute ÷ dm³ of solution', 'grams ÷ cm³ of solvent', 'moles ÷ kg of solvent', 'sol'],
  ['Dilution:', 'M₁V₁ = M₂V₂', 'M₁M₂ = V₁V₂', 'M₁ ÷ V₁ = M₂ × V₂', 'sol'],
  ['% m/m (10 g sugar in 90 g water) =', '10 %', '11 %', '90 %', 'sol'],
  ['1 M glucose has in 1 dm³ …', '180 g', '40 g', '58.5 g', 'sol'],
  ['40 g NaOH in 1 dm³ of solution =', '1 M', '0.5 M', '2 M', 'sol'],
  ['Activity 6.1: 0.5000 M CuSO₄·5H₂O needs in 1 dm³ …', '124.8 g', '249.6 g', '62.4 g', 'sol'],
  ['Activity 6.1: after the crystals dissolve in a little water, you …', 'pour it into the flask and rinse the beaker in too', 'fill the flask to the top at once', 'heat it dry', 'sol'],
  ['Activity 6.1: the last water goes in …', 'drop by drop until the curve meets the mark', 'fast, until it overflows', 'before the solid is weighed', 'sol'],
  ['Activity 6.1: at the end the flask is …', 'stoppered and turned over and back to mix', 'left open to stand', 'heated to boil', 'sol'],
  // solubility (6.5)
  ['Which is more soluble in water?', 'NaNO₃', 'AgCl', 'both the same', 'sol'],
  ['Common salt (NaCl) dissolves in …', 'water, not in benzene', 'benzene, not in water', 'both', 'sol'],
  ['Grease and paints dissolve in …', 'petrol, ether, CCl₄', 'water', 'vinegar', 'two'],
  ['Benzene and water are …', 'immiscible (two layers)', 'completely miscible', 'one solution', 'two'],
  ['Benzene and CCl₄ are …', 'completely miscible', 'immiscible', 'a suspension', 'sol'],
  ['Ethanol mixes with water because of …', 'hydrogen bonds (–OH)', 'its colour', 'its weight', 'sol'],
  ['Pressure changes the solubility of …', 'gases only', 'solids only', 'liquids only', 'gas'],
  ['Activity 6.2: iodine dissolves in …', 'methylated spirit, not in water', 'water, not in spirit', 'neither', 'sol'],
  ['Activity 6.2: salt and vinegar in water …', 'both dissolve', 'both stay apart', 'salt stays, vinegar mixes', 'sol'],
  ['Point to Ponder: 500 cm³ alcohol + 500 cm³ water make …', 'less than 1 litre', 'exactly 1 litre', 'more than 1 litre', 'sol'],
  ['Fig. 6.10: CH₄, O₂, CO, He in hot water are …', 'less soluble', 'more soluble', 'the same', 'hot'],
  ['Fig. 6.11: solubility rises with temperature for …', 'KNO₃, CaCl₂, Pb(NO₃)₂', 'Ce₂(SO₄)₃, Li₂CO₃, CaO', 'NaCl, KBr', 'hot'],
  ['Fig. 6.11: solubility falls with temperature for …', 'Ce₂(SO₄)₃, Li₂CO₃, CaO', 'KNO₃, CaCl₂', 'NaCl, KBr', 'hot'],
  ['Fig. 6.11: solubility hardly changes for …', 'NaCl, KBr', 'KNO₃, CaCl₂', 'Ce₂(SO₄)₃, CaO', 'hot'],
  ['Fig. 6.11: Na₂SO₄ is most soluble at …', '32.4 °C', '100 °C', '0 °C', 'hot'],
];
// ---------------------------------------------------------------- Short and Long Questions (p.180–181)
const WHY = [
  { q: 'Short Q i: is sea water a solution? How do you prove it is not pure water?', pic: 'sol', o: ['Yes: heat it dry: salt is left behind; pure water leaves nothing', 'No: it is pure water, nothing is left', 'Yes: it scatters a beam of light'], a: 0 },
  { q: 'Short Q ii: a label says "3 percent hydrogen peroxide". It means …', pic: 'sol', o: ['3 parts of H₂O₂ in every 100 parts of solution', '3 moles in each litre', '3 g in 1 dm³ of water'], a: 0 },
  { q: 'Short Q iv: why do we stir paints thoroughly before using them?', pic: 'sus', o: ['Their big particles settle; stirring spreads them again', 'Stirring makes them dissolve completely', 'Stirring dries the paint'], a: 0 },
  { q: 'Short Q v: why do colloids show the Tyndall effect, but solutions and suspensions do not?', pic: 'col', o: ['Colloid particles are big enough to scatter light and stay spread; solution particles are too small; suspensions are not transparent', 'Colloids glow by themselves', 'Solutions have bigger particles than colloids'], a: 0 },
  { q: 'Long Q i: define a solution. How many types by the states of matter?', pic: 'sol', o: ['A homogeneous mixture of two or more substances: 9 types (solute and solvent each gas, liquid or solid)', 'A heterogeneous mixture: 3 types', 'A pure substance: 9 types'], a: 0 },
  { q: 'Long Q ii: which factors change the solubility of a substance?', pic: 'hot', o: ['The nature of the solute and the solvent, pressure, temperature', 'Only the colour of the solute', 'Only the size of the beaker'], a: 0 },
  { q: 'Long Q iii (a): concentrated vs dilute?', pic: 'sol', o: ['Concentrated: a large amount of solute; dilute: a small amount (8 g vs 5 g sugar in 100 cm³)', 'Concentrated: more water; dilute: less water and more solute', 'Both hold the same solute'], a: 0 },
  { q: 'Long Q iii (b): unsaturated, saturated, supersaturated?', pic: 'sus', o: ['A crystal dropped in dissolves · stays · makes more crystals grow', 'A crystal dropped in grows · dissolves · stays', 'All three dissolve the crystal'], a: 0 },
  { q: 'Long Q iv: prove sugar water is a solution and sand water is not.', pic: 'sus', o: ['Sugar water stays clear and passes the filter paper; sand settles and stays on the paper', 'Sand water stays clear; sugar settles', 'Both settle after an hour'], a: 0 },
  { q: 'Long Q v: percentage composition vs molarity?', pic: 'sol', o: ['Percentage: parts of solute in 100 parts of solution (m/m, m/v, v/m, v/v); molarity: moles per dm³ of solution', 'Percentage: moles per dm³; molarity: grams in 100 g', 'They are the same unit'], a: 0 },
];

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
const WY = shuffle(WHY.map((_, i) => i)), W1 = shuffle(WORDS), F1 = shuffle(FACTS), SP = shuffle([...WORDS.map((w) => ['w', w]), ...FACTS.slice(0, 15).map((f) => ['f', f])]).slice(0, 20);
export const PARTS = [
  { key: 'explore', icon: '🔍', name: 'Explore', n: WORDS.length + FACTS.length + WHY.length, run: explore },
  { key: 'words', icon: '📖', name: 'Words', n: W1.length, steps: [10], run: (k, g) => word(k, g, W1) },
  { key: 'facts', icon: '📋', name: 'Tables', n: F1.length, steps: [10, 20, 30, 40, 50], run: (k, g) => fact(k, g, F1) },
  { key: 'why', icon: '💡', name: 'Why?', n: WHY.length, run: (k, g) => why(k, g, WY[k]) },
  { key: 'speed', icon: '⚡', name: 'Speed', n: SP.length, run: (k, g) => (SP[k][0] === 'w' ? word(k, g, null, true, SP[k][1]) : fact(k, g, null, true, SP[k][1])) },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'recall6', parts: PARTS, cam: [0, 0.4, 13.5], target: [0, 0.2, 0], excite: true });
}
