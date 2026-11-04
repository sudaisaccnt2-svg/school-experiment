// Molarity Lab (Unit 6): grams on a balance, a litre cube on the right. Pick the answer; after the right one the
// moles roll into the cube (or the water rises for a dilution), then the rule in words, then the working piece by piece.
// Book numbers as printed. Covers Examples 6.1–6.5, Practice 6.1, Skill Development (p.154) and numericals i–v (p.180).
import { THREE, sleep, tween, ease, popIn } from './kit.js';
import { runGame, choose, shuffle, tile } from './rounds.js';
import { MOLM, WATER, STEEL, DARK, edgeBox, Molecules } from './gas3d.js';

const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
// kind: M = find molarity, mol = find moles, g = find grams, dil = dilution. g = grams shown, mol = moles, vol = dm³ in
// the cube (fill), o = options (first = right), rule = the idea in words, work = the working lines
const ROUNDS = [
  { kind: 'mol0', book: 'Example 6.1', ask: '7.50 mol of CaCO₃ in 1.50 dm³. Molarity?', mol: 7.5, vol: 1.5,
    o: ['5.0 M', '11.25 M', '7.50 M', '0.20 M'], rule: 'moles in each litre', work: ['7.50 mol ÷ 1.50 dm³', '= 5.0 M'] },
  { kind: 'M', book: 'Example 6.2', ask: '5.85 g of NaCl in 500 cm³. Molarity?', g: '5.85 g NaCl', mol: 0.1, vol: 0.5,
    o: ['0.2 M', '0.1 M', '0.5 M', '2 M'], rule: 'grams → moles → per litre',
    work: ['5.85 ÷ 58.5 = 0.1 mol', '500 cm³ = 0.5 dm³', '0.1 ÷ 0.5 = 0.2 M'] },
  { kind: 'M', book: 'Example 6.3', ask: '7.50 g of CH₃OH in 50.0 cm³. Molarity?', g: '7.50 g CH₃OH', mol: 0.2344, vol: 0.05,
    o: ['4.69 M', '0.234 M', '0.375 M', '46.9 M'], rule: 'a small volume → a big molarity',
    work: ['7.50 ÷ 32.0 = 0.2344 mol', '50.0 cm³ = 0.0500 dm³', '0.2344 ÷ 0.0500 = 4.69 M'] },
  { kind: 'M', book: 'Practice 6.1', ask: '0.750 g of CaCl₂ in 11.6 cm³. Molarity?', g: '0.750 g CaCl₂', mol: 0.00676, vol: 0.0116,
    o: ['0.582 M', '0.0676 M', '6.47 M', '0.00676 M'], rule: 'Ca 40 + 2 × Cl 35.5 = 111 g per mol',
    work: ['0.750 ÷ 111 = 0.00676 mol', '11.6 cm³ = 0.0116 dm³', '0.00676 ÷ 0.0116 ≈ 0.582 M'] },
  { kind: 'M', book: 'Skill Development', ask: '20 g of NaOH made up to 250 mL. Molarity?', g: '20 g NaOH', mol: 0.5, vol: 0.25,
    o: ['2 M', '0.5 M', '0.08 M', '5 M'], rule: 'NaOH: 40 g per mol', work: ['20 ÷ 40 = 0.5 mol', '250 mL = 0.25 dm³', '0.5 ÷ 0.25 = 2 M'] },
  { kind: 'M', book: 'Skill Development', ask: '5.85 g of NaCl made up to 1000 mL. Molarity?', g: '5.85 g NaCl', mol: 0.1, vol: 1,
    o: ['0.1 M', '1 M', '0.01 M', '5.85 M'], rule: 'one full litre', work: ['5.85 ÷ 58.5 = 0.1 mol', '0.1 mol ÷ 1 dm³ = 0.1 M'] },
  { kind: 'M', book: 'Numerical i', ask: '5.85 g of KI in 0.125 dm³. Molarity?', g: '5.85 g KI', mol: 0.0352, vol: 0.125,
    o: ['0.28 M', '0.035 M', '46.8 M', '0.73 M'], rule: 'KI: 39 + 127 = 166 g per mol',
    work: ['5.85 ÷ 166 = 0.0352 mol', '0.0352 ÷ 0.125 = 0.28 M'] },
  { kind: 'mol', book: 'Numerical ii', ask: 'How many moles of H₂SO₄ in 0.500 dm³ of 0.150 M?', mol: 0.075, vol: 0.5,
    o: ['0.075 mol', '0.30 mol', '3.33 mol', '0.65 mol'], rule: 'moles = molarity × dm³',
    work: ['0.150 × 0.500', '= 0.075 mol'] },
  { kind: 'M', book: 'Numerical iii', ask: '40.0 g NaOH in 6.00 dm³. Molarity?', g: '40.0 g NaOH', mol: 1, vol: 6,
    o: ['0.166 M', '6.0 M', '1.0 M', '0.40 M'], rule: 'molar mass of NaOH = 23 + 16 + 1 = 40',
    work: ['40.0 ÷ 40 = 1.00 mol', '1.00 ÷ 6.00 = 0.166 M'] },
  { kind: 'M', book: 'Numerical iv', ask: '14.0 g NH₄Br in 150 cm³. Molarity?', g: '14.0 g NH₄Br', mol: 0.143, vol: 0.15,
    o: ['0.9533 M', '0.143 M', '9.33 M', '0.0953 M'], rule: 'NH₄Br: 97.9 g per mol',
    work: ['14.0 ÷ 97.9 = 0.143 mol', '150 cm³ = 0.150 dm³', '0.143 ÷ 0.150 = 0.9533 M'] },
  { kind: 'g', book: 'Numerical v', ask: '1.00 dm³ of 3.50 M H₂SO₄. Grams of solute?', mol: 3.5, vol: 1,
    o: ['343 g', '3.50 g', '98 g', '28 g'], rule: 'solute: H₂SO₄ · solvent: water', work: ['3.50 mol × 98 g', '= 343 g'] },
  { kind: 'dil', book: 'Example 6.4', ask: '30 cm³ of 2.5 M made up to 280 cm³. New molarity?', v1: 30, v2: 280,
    o: ['0.267 M', '2.5 M', '23.3 M', '0.75 M'], rule: 'same moles, more water', work: ['2.5 × 30 = M₂ × 280', 'M₂ = 0.267 M'] },
  { kind: 'dil', book: 'Example 6.5', ask: '85 cm³ of 3.5 M → 0.41 M. How much water to add?', v1: 85, v2: 725.6,
    o: ['640.60 cm³', '725.60 cm³', '85 cm³', '29.75 cm³'], rule: 'final volume minus what was there',
    work: ['V₂ = 3.5 × 85 ÷ 0.41 = 725.60 cm³', '725.60 − 85 = 640.60 cm³'] },
].map((R, n) => ({ ...R, order: [0, 1, 2, 3].sort((a, b) => ((a * 7 + n * 5) % 4) - ((b * 7 + n * 5) % 4)) }));

function balance(G, x, y, text) {
  const b = new THREE.Group(); b.position.set(x, y, 0); G.add(b);
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.4, 1.0), DARK); base.position.y = 0.2; b.add(base);
  const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.06, 32), STEEL); pan.position.y = 0.46; b.add(pan);
  for (let k = 0; k < 6; k++) { const g = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), MOLM.white); g.position.set(-0.3 + 0.3 * (k % 3), 0.6 + 0.2 * Math.floor(k / 3), 0); b.add(g); }
  stage.tag(`<b>${text}</b>`, b, [0, -0.5, 0], 'big gold');
  popIn(b, 1, 0.3);
  return b;
}
const ballR = (mol) => 0.12 + 0.18 * Math.cbrt(Math.min(mol, 4));

function build(R) {
  const G = new THREE.Group(); G.position.set(-1.5, 0.1, 0); stage.root.add(G);
  const S = 2.6, cube = edgeBox(S, S, S); cube.position.set(1.9, -0.2, 0); G.add(cube);
  const fill = (f) => { const m = new THREE.Mesh(new THREE.BoxGeometry(S * 0.98, 1, S * 0.98), WATER); m.scale.y = Math.max(0.03, S * f); m.position.y = -S / 2 + m.scale.y / 2; cube.add(m); return m; };
  popIn(cube, 1, 0.4);
  if (R.kind === 'dil') {
    const vmax = R.v2 * 1.05, st = fill(R.v1 / vmax);
    const mol = new Molecules(cube, { n: 8, lo: V(-1.2, -1.3, -1.2), hi: V(1.2, -1.3 + S * R.v1 / vmax, 1.2), mat: MOLM.gold, r: 0.12, speed: 0.6 });
    on((dt) => mol.update(dt));
    const vt = stage.tag(`<b>${R.v1} cm³</b>`, cube, [-2.3, -1.0, 0], 'big');
    return { async why() {
      const w = fill(R.v1 / vmax), f0 = S * R.v1 / vmax, f1 = S * R.v2 / vmax;
      await tween(1.4, (t) => { const h = f0 + (f1 - f0) * t; w.scale.y = h; w.position.y = -S / 2 + h / 2; mol.hi.y = -S / 2 + h; }, ease.inOut);
      st.visible = false; vt.innerHTML = `<b>${R.v2.toFixed(2).replace(/\.00$/, '')} cm³</b>`;
      await lines(R, G);
    } };
  }
  const vf = Math.min(R.vol, 1);
  const fl = R.kind === 'mol0' ? fill(1) : fill(vf);
  stage.tag(`<b>${R.vol} dm³</b>`, cube, [0, -1.85, 0], 'big');
  if (R.kind === 'mol0') {                      // 15 half-mole marbles spread through 1.5 cubes
    const ghost = edgeBox(S, S / 2, S, { mat: new THREE.MeshBasicMaterial({ color: 0x8cbfff, transparent: true, opacity: 0.4 }) });
    ghost.position.y = S * 0.75; cube.add(ghost);
    const m = new Molecules(cube, { n: 15, lo: V(-1.2, -1.3, -0.6), hi: V(1.2, S, 0.6), mat: MOLM.gold, r: 0.16, speed: 0.5 });
    on((dt) => m.update(dt));
    stage.tag('each marble = 0.5 mol', G, [-3.0, 0.4, 0], 'big');
  }
  if (R.kind === 'M') balance(G, -3.0, -1.7, R.g);
  if (R.kind === 'g') {
    for (let k = 0; k < 4; k++) { const b = new THREE.Mesh(new THREE.SphereGeometry(k < 3 ? 0.3 : 0.21, 20, 12), MOLM.gold); b.position.set(-0.9 + 0.6 * k, -0.9, 0.5); cube.add(b); }
    stage.tag('<b>3.50 mol</b>', cube, [0, 1.85, 0], 'big gold');
  }
  if (R.vol > 1 && R.kind === 'M') stage.tag(`× ${R.vol} cubes`, cube, [0, 1.85, 0], 'big');
  return { async why() {
    if (R.kind === 'M') {
      const b = new THREE.Mesh(new THREE.SphereGeometry(ballR(R.mol), 24, 16), MOLM.gold); b.position.set(-3.0, 0.2, 0.4); G.add(b);
      const mt = stage.tag(`<b>${R.mol} mol</b>`, b, [0, 0.7, 0], 'big gold');
      await sleep(0.7);
      const a = b.position.clone(), z = V(1.9, -0.2 - 1.3 + Math.max(ballR(R.mol), S * vf / 2), 0.6);
      await tween(1.0, (t) => b.position.lerpVectors(a, z, t), ease.inOut);
      mt.remove?.();
    }
    if (R.kind === 'mol') {
      for (let k = 0; k < 3; k++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 12), MOLM.gold); b.position.set(-0.6 + 0.6 * k, -1.0, 0.6); cube.add(b); popIn(b, 1, 0.3); await sleep(0.25); }
    }
    if (R.kind === 'g') balance(G, -3.0, -1.7, '343 g');
    await lines(R, G);
  } };
}
async function lines(R, G) {
  stage.tag(`<b>${R.rule}</b>`, G, [0, 3.55, 0], 'big gold'); await sleep(1.0);
  for (const [n, w] of R.work.entries()) { stage.tag(w, G, [0, 3.0 - 0.5 * n, 0], n === R.work.length - 1 ? 'big green' : 'big'); await sleep(0.9); }
}


// ⚖️ Molar mass first (memory: the book's molar masses), then 🧮 the problems in book order (the marbles and the
// working play after the answer, then a tap goes on).
const MASS = shuffle([['NaCl', 58.5], ['NaOH', 40], ['H₂SO₄', 98], ['CaCl₂', 111], ['KI', 166], ['CH₃OH', 32], ['CaCO₃', 100],
  ['H₂O', 18], ['CO₂', 44]]);
const ALLM = MASS.map((m) => m[1]);
function mass(k, g) {
  stage = g.stage; on = (f) => g.onFrame(f);
  const [f, M] = MASS[k];
  const card = tile(f, { w: 3.2, h: 1.3, d: 0.3, color: '#3d6ab0', size: 0.6 }); card.position.set(0, 1.0, 0); g.stage.root.add(card); popIn(card, 1, 0.4);
  g.goal('Its molar mass (g per mol)?', k);
  const opts = [M, ...shuffle(ALLM.filter((v) => v !== M)).slice(0, 3)].map(String);
  choose(g, k, opts, String(M), { w: 1.6, size: 0.55, label: (v) => `${v} g`, why: `${f} = ${M} g per mol` });
}
function problem(k, g) {
  stage = g.stage; on = (f) => g.onFrame(f);
  const R = ROUNDS[k], rig = build(R);
  g.goal(R.ask, k);
  choose(g, k, R.o, R.o[0], { w: 2.5, size: 0.42, column: [4.7, 1.8], why: `${R.book}: ${R.o[0]}`, tap: true,
    onRight: () => rig.why(), onReveal: () => rig.why() });
}
// 🔍 Explore first (SKILL): every molar mass, then every problem worked through; a tap goes on, nothing is wrong.
function explore(k, g) {
  stage = g.stage; on = (f) => g.onFrame(f);
  if (k < MASS.length) {
    const [f, M] = MASS[k];
    const card = tile(f, { w: 3.2, h: 1.3, d: 0.3, color: '#3d6ab0', size: 0.6 }); card.position.set(0, 1.0, 0); g.stage.root.add(card); popIn(card, 1, 0.4);
    g.stage.tag(`<b>${M} g per mol</b>`, card, [0, -1.3, 0], 'huge gold'); g.goal('Its molar mass', k);
    g.setTap(() => g.right(k, true, `${f} = ${M} g per mol`, 0, false)); return;
  }
  const R = ROUNDS[k - MASS.length], rig = build(R); rig.why(); g.goal(R.ask, k);
  g.setTap(() => g.right(k, true, `${R.book}: ${R.o[0]}`, 0, false));
}
let stage = null, on = null;
const PARTS = [
  { key: 'explore', icon: '🔍', name: 'Explore', n: MASS.length + ROUNDS.length, run: explore },
  { key: 'mass', icon: '⚖️', name: 'Molar mass', n: MASS.length, run: mass },
  { key: 'mol', icon: '🧮', name: 'Molarity', n: ROUNDS.length, run: problem },
];
export function start({ stage: st, ui, level }) {
  return runGame({ stage: st, ui, level, id: 'molarlab', parts: PARTS, cam: [0, 0.6, 14.5], target: [0, 0.4, 0], excite: true });
}
