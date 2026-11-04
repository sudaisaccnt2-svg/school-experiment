// Quiz Quest, Unit 3: the 10 MCQs of p.88. Same screen as the Unit 2 quiz (quiz.js runQuiz); each right answer
// plays a small 3D demo: a mini periodic table, book-value bars or an atom.
import { THREE, sleep, tween, ease } from './kit.js';
import { Atom } from './atom.js';
import { runQuiz, demoBase } from './quiz.js';
import { table3d } from './table3d.js';
import { ZOF, IE1, place, A_COLS, shells } from './u3data.js';

const Q = [
  { q: 'Which of the following elements is in the same family as fluorine?', o: ['silicon', 'antimony', 'iodine', 'arsenic'], a: 2,
    why: 'Fluorine and <b>iodine</b> are both in group VIIA, the halogen family.', demo: (s) => miniDemo(s, 5, [9, 17, 35, 53]) },
  { q: 'Which of the following would have the smallest ionization energy?', o: ['K', 'P', 'S', 'Ca'], a: 0,
    why: '<b>Potassium</b> is the biggest atom here and in group IA: its one outer electron leaves most easily (419 kJ/mol).',
    demo: (s) => barDemo(s, ['K', 'Ca', 'P', 'S'], 'K') },
  { q: 'An element has configuration 2, 8, 1. It belongs to', o: ['group I and III period', 'group III and I period',
    'group I and VII period', 'group VII and III period'], a: 0,
    why: '3 shells → <b>period III</b>. 1 outer electron → <b>group I</b>. (It is sodium.)', demo: (s) => atomDemo(s, 11, 12, 'outer', ['3 shells → period III', '1 outer e⁻ → group I']) },
  { q: 'Which of the following elements would be most similar to carbon?', o: ['nitrogen', 'boron', 'oxygen', 'silicon'], a: 3,
    why: '<b>Silicon</b> is right below carbon in group IVA: both have 4 outer electrons.', demo: (s) => miniDemo(s, 3, [6, 14]) },
  { q: 's-block elements are:', o: ['metals', 'non-metals', 'metalloids', 'transition'], a: 0,
    why: 'Groups IA and IIA (alkali and alkaline earth) are all <b>metals</b>; hydrogen is the one exception.',
    demo: (s) => miniDemo(s, 4, [3, 4, 11, 12, 19, 20], 'block') },
  { q: 'Which of the following would have the largest ionization energy?', o: ['Na', 'Al', 'H', 'He'], a: 3,
    why: '<b>Helium</b> holds its full, tiny shell very tightly: 2372 kJ/mol, the largest of all.',
    demo: (s) => barDemo(s, ['Na', 'Al', 'H', 'He'], 'He') },
  { q: 'Elements in a ______ have similar chemical properties:', o: ['period', 'group', 'both a and b', 'neither a nor b'], a: 1,
    why: 'Elements in a <b>group</b> have the same number of outer electrons, so they behave alike.', demo: (s) => miniDemo(s, 3, [1, 3, 11]) },
  { q: 'An element has 8 electrons in its valence shell. It is a member of:', o: ['alkali family', 'halogen family', 'noble family', 'carbon family'], a: 2,
    why: '8 outer electrons = a full shell: the <b>noble gases</b> (group VIIIA) like neon and argon.',
    demo: (s) => atomDemo(s, 10, 10, 'outer', ['8 outer e⁻: full shell', 'noble gas']) },
  { q: 'The modern periodic table is based on:', o: ['atomic number', 'mass number', 'neutron number', 'isotope number'], a: 0,
    why: 'Modern periodic law: properties depend on the <b>atomic number</b> (the number of protons).', demo: (s) => miniDemo(s, 3, null) },
  { q: 'Shielding effect is due to:', o: ['neutron', 'proton', 'proton and neutron', 'electron'], a: 3,
    why: 'The inner <b>electrons</b> screen the outer electron from the pull of the nucleus.',
    demo: (s) => atomDemo(s, 11, 12, 'inner', ['inner electrons = the shield']) },
];

export const start = (o) => runQuiz({ ...o, Q, id: 'quiz3', hub: 'games.html?unit=3' });

// a small table of the 8 A groups (rows 1..rows); reveal() fades all but `keep` (null: pop 1, 2, 3 … in order)
function miniDemo(stage, rows, keep, color = 'cat') {
  const d = demoBase(stage);
  const zs = Array.from({ length: 86 }, (_, k) => k + 1).filter((z) => place(z)[0] <= rows && A_COLS.includes(place(z)[1]));
  const T = table3d(stage, { zs, parent: d.g, color, pickable: false, size: 0.62, gap: 0.08 });
  for (const z of zs) {
    const [r, c] = place(z), p = new THREE.Vector3((A_COLS.indexOf(c) - 3.5) * 0.7, ((rows + 1) / 2 - r) * 0.7, 0);
    T.tiles[z].position.copy(p); T.tiles[z].userData.home = p;
  }
  d.g.scale.setScalar(1.25);
  return { ...d, async reveal() {
    if (keep) { T.dim(keep, 0.15); await sleep(0.4); for (const z of keep) { T.pop(z, 1.5); await sleep(0.25); } }
    else for (const z of zs.slice().sort((a, b) => a - b)) { T.pop(z, 1.4); await sleep(0.12); }
  } };
}

// ionization-energy bars (book Table 3.3), grown on reveal; the answer is green
function barDemo(stage, syms, win) {
  const d = demoBase(stage), top = Math.max(...syms.map((s) => IE1[s])), bars = [];
  syms.forEach((s, k) => {
    const x = (k - (syms.length - 1) / 2) * 1.3, ok = s === win;
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1, 0.4), new THREE.MeshStandardMaterial({ color: ok ? 0x4dff88 : 0xffb347,
      emissive: ok ? 0x2a9950 : 0x8a5a10, roughness: 0.35 }));
    b.position.set(x, -2, 0); b.scale.y = 0.01; d.g.add(b);
    const lbl = stage.tag(`<b>${s}</b>`, { getWorldPosition: (v) => d.g.localToWorld(v.set(x, -2.4, 0)), visible: true, scale: { x: 1 } }, [0, 0, 0], ok ? 'big green' : 'big');
    bars.push({ b, h: 4 * IE1[s] / top, s, x, ok, lbl });
  });
  return { ...d, async reveal() {
    for (const B of bars) {
      tween(0.8, (t) => { B.b.scale.y = Math.max(0.01, B.h * t); B.b.position.y = -2 + (B.h * t) / 2; }, ease.out);
      stage.tag(String(IE1[B.s]), { getWorldPosition: (v) => d.g.localToWorld(v.set(B.x, -1.7 + B.h, 0)), visible: true, scale: { x: 1 } }, [0, 0, 0], B.ok ? 'big green' : 'big gold');
      await sleep(0.25);
    }
  } };
}

// an atom; reveal() lights the outer (or inner) shells and names what they show
function atomDemo(stage, Z, N, which, texts) {
  const d = demoBase(stage);
  const a = new Atom(stage, { pos: [0, 0.4, 0], radii: [1.0, 1.7, 2.4], tags: false });
  a.setNucleus(Z, N); a.setConfig(shells(Z)); d.atoms.push(a);
  return { ...d, async reveal() {
    const n = a.config.length;
    if (which === 'outer') { for (let s = 0; s < n; s++) { a.flashRing(s, 0x7cc0ff); await sleep(0.3); } await a.flashRing(n - 1, 0x4dff88); }
    else for (let s = 0; s < n - 1; s++) await a.flashRing(s, 0x7cc0ff);
    texts.forEach((t, k) => stage.tag(t, a.group, [0, -3.0 - 0.55 * k, 0], k ? 'big blue' : 'big gold'));
  } };
}
