// Quiz Quest, Unit 4: the 10 MCQs of pp.118-119. Same screen as the other quizzes (quiz.js runQuiz); each right
// answer plays a small 3D demo with dot-and-cross atoms, ions or a ball-and-stick molecule.
import { THREE, sleep, tween, ease, popIn } from './kit.js';
import { runQuiz, demoBase } from './quiz.js';
import { dotAtom, hand, flash, ionBall, molecule, SHAPES, spinY } from './mol3d.js';

SHAPES.F2O = { atoms: [['O', [0, 0, 0]], ['F', [-1.1, -0.86, 0]], ['F', [1.1, -0.86, 0]]], bonds: [[0, 1, 1], [0, 2, 1]],
  lone: [[0, [-0.6, 1, 0]], [0, [0.6, 1, 0]]] };

const Q = [
  { q: 'An atom with a charge is called:', o: ['an electron', 'a molecule', 'a metal', 'an ion'], a: 3,
    why: 'An atom that has lost or gained electrons carries a charge: it is an <b>ion</b> (Na⁺, Cl⁻).', demo: (s) => loseDemo(s, 'Na', 1, 'Na⁺: an ion') },
  { q: 'An element X is in group VI of the periodic table. The ion will be represented by:', o: ['X⁺', 'X⁻', 'X²⁻', 'X²⁺'], a: 2,
    why: 'Group VI = 6 outer electrons. It gains 2 more to make 8: <b>X²⁻</b> (like O²⁻).', demo: (s) => gainDemo(s) },
  { q: 'Which pair of elements will join to form a compound with one to one ratio:', o: ['Magnesium and Chlorine', 'Sodium and Oxygen',
    'Potassium and Fluorine', 'Lithium and Sulphur'], a: 2,
    why: 'K gives 1 electron and F needs exactly 1: <b>K⁺F⁻</b>, one to one.', demo: (s) => handDemo(s, 'K', 'F', ['K⁺', 'F⁻'], '1 : 1') },
  { q: 'When calcium atom become a Calcium ion (Ca²⁺):', o: ['it loses an electron', 'it loses two electrons', 'it gains electron', 'gains two electrons'], a: 1,
    why: 'Calcium is 2, 8, 8, 2: it <b>loses its 2 outer electrons</b>, so the charge is +2.', demo: (s) => loseDemo(s, 'Ca', 2, 'Ca²⁺') },
  { q: 'Which two elements will form a covalent compound?', o: ['Sodium and Oxygen', 'Copper and Oxygen', 'Carbon and Oxygen', 'Magnesium and Oxygen'], a: 2,
    why: 'Two non-metals share electrons: <b>carbon and oxygen</b> make CO₂ (O=C=O).', demo: (s) => molDemo(s, 'CO2', 'O=C=O') },
  { q: 'In the formation of an ionic bond, the atoms taking part:', o: ['only gain electrons', 'share electrons', 'lose and gain of electrons', 'only lose electrons'], a: 2,
    why: 'The metal <b>loses</b> and the non-metal <b>gains</b>: Na⁺ and Cl⁻.', demo: (s) => handDemo(s, 'Na', 'Cl', ['loses', 'gains']) },
  { q: 'Fluorine has an electronic configuration 2, 7 and Oxygen 2, 6. The formula of fluorine oxide will be:', o: ['FO', 'F₂O', 'FO₂', 'F₂O₂'], a: 1,
    why: 'Oxygen needs 2, each fluorine needs 1: one O bonds to two F, <b>F₂O</b> (F–O–F).', demo: (s) => molDemo(s, 'F2O', 'F–O–F') },
  { q: 'Which of these statements about covalent bonds is incorrect?', o: ['HCl contains one pair of shared electron',
    'CCl₄ contains four pairs of shared electrons', 'H₂O contains three pairs of shared electrons', 'NH₃ contains three pairs of shared electrons'], a: 2,
    why: 'Water has only <b>two</b> shared pairs (two O–H bonds), so (c) is wrong.', demo: (s) => molDemo(s, 'H2O', '2 shared pairs', true) },
  { q: 'Which of the following ions do not have the electronic configuration of an argon atom?', o: ['Ca²⁺', 'S²⁻', 'K⁺', 'O²⁻'], a: 3,
    why: 'Ca²⁺, S²⁻ and K⁺ are 2, 8, 8 like argon. <b>O²⁻</b> is 2, 8, like neon.', demo: (s) => ionsDemo(s) },
  { q: 'Which one of the groups below contains only ionic compounds?', o: ['Calcium Oxide, Hydrogen Chloride, Magnesium Oxide',
    'Calcium Oxide, Magnesium Oxide, Sodium Chloride', 'Carbon Dioxide, Copper Sulphate, Hydrogen Chloride', 'Copper Sulphate, Methane, Sodium Chloride'], a: 1,
    why: 'Each is a metal with a non-metal: <b>CaO, MgO, NaCl</b>. (HCl, CO₂ and CH₄ are covalent.)', demo: (s) => pairsDemo(s) },
];

export const start = (o) => runQuiz({ ...o, Q, id: 'quiz4', hub: 'games.html?unit=4' });

// an atom whose outer electrons fly away
function loseDemo(stage, sym, n, txt) {
  const d = demoBase(stage), A = dotAtom(stage, d.g, sym, [0, 0.4, 0], n, { r: 1.4, angles: n === 1 ? [0] : [0, 180] });
  return { ...d, async reveal() {
    await Promise.all(A.dots.map((e, k) => { const p0 = e.position.clone(); return tween(0.9, (t) => { e.position.copy(p0).multiplyScalar(1 + 2.2 * t); e.scale.setScalar(0.12 * (1 - t) + 0.001); }, ease.inOut); }));
    await tween(0.4, (t) => A.ring.scale.setScalar(1 - 0.3 * t));
    stage.tag(`<b>${txt}</b>`, A.g, [0, -2.2, 0], 'huge gold');
  } };
}
// group VI: two electrons come in
function gainDemo(stage) {
  const d = demoBase(stage), A = dotAtom(stage, d.g, 'X', [0, 0.4, 0], 6, { r: 1.4, angles: [76, 104, -14, 14, 166, 256] });
  return { ...d, async reveal() {
    for (const a of [194, 284]) {
      const e = new THREE.Mesh(A.dots[0].geometry, A.dots[0].material.clone()); e.material.emissive.set(0xffa53a); e.scale.setScalar(0.12);
      const to = new THREE.Vector3(1.4 * Math.cos(a * Math.PI / 180), 1.4 * Math.sin(a * Math.PI / 180), 0.03);
      A.g.add(e); await tween(0.7, (t) => e.position.copy(to).multiplyScalar(1 + 2 * (1 - t)), ease.out);
    }
    await flash(A.g, 1.4);
    stage.tag('<b>6 + 2 = 8 → X²⁻</b>', A.g, [0, -2.3, 0], 'big green');
  } };
}
// metal hands its outer electron to a non-metal
function handDemo(stage, m, x, [tA, tB], extra) {
  const d = demoBase(stage), A = dotAtom(stage, d.g, m, [-1.7, 0.4, 0], 1, { r: 1.0, angles: [0] }),
    B = dotAtom(stage, d.g, x, [1.7, 0.4, 0], 7, { r: 1.0, gold: true });
  return { ...d, async reveal() {
    await hand(A, B, A.dots[0], 180);
    await tween(0.3, (t) => A.ring.scale.setScalar(1 - 0.25 * t));
    flash(B.g, 1.0);
    stage.tag(`<b>${tA}</b>`, A.g, [0, -1.6, 0], 'big blue'); stage.tag(`<b>${tB}</b>`, B.g, [0, -1.6, 0], 'big green');
    if (extra) stage.tag(`<b>${extra}</b>`, d.g, [0, 2.2, 0], 'huge gold');
  } };
}
// a spinning ball-and-stick molecule; flashBonds pulses the bonds one by one
function molDemo(stage, key, txt, flashBonds = false) {
  const d = demoBase(stage), M = molecule(d.g, key, { scale: 1.4, pos: [0, 0.6, 0] });
  d.frame(spinY(stage, M.g, 0.35)); popIn(M.g, 1, 0.5);
  return { ...d, async reveal() {
    if (flashBonds) for (const c of M.g.children.filter((o) => o.geometry && o.geometry.type === 'CylinderGeometry')) {
      await tween(0.45, (t) => { c.scale.x = c.scale.z = 0.084 * (1 + 1.5 * Math.sin(t * Math.PI)); }, ease.lin);
    }
    stage.tag(`<b>${txt}</b>`, d.g, [0, -2.0, 0], 'huge gold');
  } };
}
// four ions; three are 2, 8, 8 and O2- is 2, 8
function ionsDemo(stage) {
  const d = demoBase(stage), I = [['Ca²⁺', true, '2, 8, 8 ✓'], ['S²⁻', false, '2, 8, 8 ✓'], ['K⁺', true, '2, 8, 8 ✓'], ['O²⁻', false, '2, 8 ✗']];
  const balls = I.map(([t, p], k) => ionBall(stage, d.g, t, [(k % 2 ? 1.6 : -1.6), k < 2 ? 1.6 : -1.0, 0], p, 0.65));
  return { ...d, async reveal() {
    for (let k = 0; k < 4; k++) { stage.tag(`<b>${I[k][2]}</b>`, balls[k], [0, -1.05, 0], k === 3 ? 'big red' : 'big green'); await sleep(0.3); }
  } };
}
// three + / − pairs
function pairsDemo(stage) {
  const d = demoBase(stage), P = [['Ca²⁺', 'O²⁻'], ['Mg²⁺', 'O²⁻'], ['Na⁺', 'Cl⁻']], gs = [];
  P.forEach(([a, b], k) => {
    const g = new THREE.Group(); g.position.y = 2 - 2 * k; d.g.add(g); gs.push(g);
    ionBall(stage, g, a, [-0.75, 0, 0], true, 0.55); ionBall(stage, g, b, [0.75, 0, 0], false, 0.7);
  });
  return { ...d, async reveal() {
    for (const g of gs) { stage.tag('<b>✓ metal + non-metal</b>', g, [2.6, 0, 0], 'big green'); await sleep(0.3); }
  } };
}
