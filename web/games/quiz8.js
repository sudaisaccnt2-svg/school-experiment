// Quiz Quest, Unit 8: the 10 MCQs of p.246-247 (quiz.js runQuiz). Each right answer plays a small 3D "why":
// metal lumps that give electrons away, halogen jars in their real colours, flames, litmus turning blue.
import { THREE, sleep } from './kit.js';
import { runQuiz, demoBase } from './quiz.js';
import { atom, hop } from './chem7.js';
import { lump, gasJar, flame, litmus, FLAME } from './chem8.js';

const far = (d, x) => { const o = new THREE.Object3D(); o.position.set(x, 0, 0); d.g.add(o); return o; };
// the four halogen jars of Fig 8.5 / Table 8.9 (F pale yellow gas, Cl greenish gas, Br dark red liquid, I black solid / purple vapour)
function jars(s, d) {
  return [['F₂', 0xf2f0a0, 'gas'], ['Cl₂', 0x9bea5a, 'gas'], ['Br₂', 0x9a2a10, 'liquid'], ['I₂', 0x8a3ad0, 'solid']].map(([n, c, k], i) => {
    const J = gasJar(d.g, c, k, [-3 + i * 2, -1.4, 0]); J.scale.setScalar(0.8); s.tag(`<b>${n}</b>`, J, [0, -0.45, 0], 'big'); return J;
  });
}
const Q = [
  { q: 'Bromine is a non-metal in:', o: ['Solid state', 'Liquid state', 'Gaseous state', 'Plasma state'], a: 1,
    why: 'Bromine is the only non-metal that is a <b>liquid</b>: a dark red liquid (Table 8.9).',
    demo: (s) => { const d = demoBase(s), J = jars(s, d);
      return { ...d, async reveal() { J[2].scale.setScalar(1.05); s.tag('<b>liquid</b>', J[2], [0, 3.0, 0], 'big gold'); } }; } },
  { q: 'Halogens react with metals to form:', o: ['Halides', 'Oxides', 'Halogen sulphides', 'Hydrogenated compounds'], a: 0,
    why: 'Metal + halogen → a <b>halide</b> salt: 2K + I₂ → 2KI, Cu + Br₂ → CuBr₂.',
    demo: (s) => { const d = demoBase(s), k = atom(s, d.g, 'K', [-1.8, 0, 0], 1.3), i = atom(s, d.g, 'I', [1.8, 0, 0], 1.3);
      return { ...d, async reveal() { await hop(d.g, k, i, 1); s.tag('<b>KI: a halide</b>', d.g, [0, -1.6, 0], 'big gold'); } }; } },
  { q: 'Alkali metals are:', o: ['Oxidising agents', 'Dehydrating agents', 'Reducing agents', 'All the above'], a: 2,
    why: 'They give their one outer electron away easily: <b>reducing agents</b> (Na frees Ti from TiCl₄).',
    demo: (s) => { const d = demoBase(s), na = atom(s, d.g, 'Na', [-1.2, 0, 0], 1.5);
      return { ...d, async reveal() { await hop(d.g, na, far(d, 2.4), 1); s.tag('<b>gives e⁻: reducing agent</b>', na, [0, -1.4, 0], 'big gold'); } }; } },
  { q: 'Among the alkali metals, the metal with the highest ionization potential is:', o: ['Na', 'Li', 'Rb', 'Cs'], a: 1,
    why: '<b>Li</b> is the smallest: its electron sits closest to the nucleus, so pulling it off costs most (520 kJ/mol).',
    demo: (s) => { const d = demoBase(s);
      const A = [['Li', 0.7], ['Na', 1.0], ['K', 1.3], ['Rb', 1.45], ['Cs', 1.6]].map(([e, k], i) => atom(s, d.g, e, [-3.4 + i * 1.7, 0, 0], k));
      return { ...d, async reveal() { s.tag('<b>smallest: hardest to ionize</b>', A[0], [0, -1.2, 0], 'big gold'); } }; } },
  { q: 'The halogen present in the solid form is:', o: ['Chlorine', 'Fluorine', 'Iodine', 'Bromine'], a: 2,
    why: '<b>Iodine</b> is a black solid; warm it and a purple vapour rises.',
    demo: (s) => { const d = demoBase(s), J = jars(s, d);
      return { ...d, async reveal() { J[3].scale.setScalar(1.05); s.tag('<b>solid</b>', J[3], [0, 3.0, 0], 'big gold'); } }; } },
  { q: 'Tendency of a metal to lose electron is called:', o: ['Electronegativity', 'Electropositivity', 'Electroplating', 'Electrolysis'], a: 1,
    why: 'Losing electrons to become positive = <b>electropositivity</b> (metallic character).',
    demo: (s) => { const d = demoBase(s), ca = atom(s, d.g, 'Ca', [-1.2, 0, 0], 1.5);
      return { ...d, async reveal() { await hop(d.g, ca, far(d, 2.4), 2); s.tag('<b>Ca²⁺: electropositive</b>', ca, [0, -1.4, 0], 'big gold'); } }; } },
  { q: 'The word Alkali means:', o: ['Base', 'Basic salt', 'Acid', 'Ashes'], a: 3,
    why: '"Alkali" is the Arabic word for <b>ashes</b>: plant ashes gave the first sodium and potassium compounds.',
    demo: (s) => { const d = demoBase(s), F = flame(d.g, 0xff7a2a, [0, -1.2, 0], 1.6); d.frame(F.tick);
      return { ...d, async reveal() { s.tag('<b>al-qali = ashes</b>', d.g, [0, 1.3, 0], 'big gold'); } }; } },
  { q: 'The oxide of calcium CaO is:', o: ['Acidic', 'Basic', 'Amphoteric', 'Neutral'], a: 1,
    why: 'CaO + water → Ca(OH)₂: red litmus turns <b>blue</b>. Metal oxides are <b>basic</b>.',
    demo: (s) => { const d = demoBase(s), L = litmus(d.g, 'red', [0, 0, 0]); L.scale.setScalar(1.4);
      return { ...d, async reveal() { await L.userData.turn('blue'); s.tag('<b>red → blue: basic</b>', L, [0, -1.6, 0], 'big gold'); } }; } },
  { q: 'Which one of the following is not an alkali metal:', o: ['Francium', 'Cesium', 'Rubidium', 'Radium'], a: 3,
    why: '<b>Radium</b> is in group IIA (alkaline earth). Fr, Cs and Rb are group IA.',
    demo: (s) => { const d = demoBase(s);
      const A = [['Rb', -3], ['Cs', -1], ['Fr', 1], ['Ra', 3]].map(([e, x]) => atom(s, d.g, e, [x, 0, 0], 1.2));
      return { ...d, async reveal() { s.tag('<b>IIA</b>', A[3], [0, -1.2, 0], 'big gold'); s.tag('<b>IA</b>', d.g, [-1, -1.2, 0], 'big'); } }; } },
  { q: 'Group IIA elements are named as Alkaline Earth Metals because:', o: ['Their oxides are basic',
    'Their oxide and hydroxides are water soluble', 'They are found in earth', 'All of these'], a: 3,
    why: 'All three: basic (alkaline) oxides and hydroxides, and found in the earth\'s crust: <b>alkaline earth</b>.',
    demo: (s) => { const d = demoBase(s), mg = lump(d.g, 'Mg', [-1.6, 0, 0], 0.9), L = litmus(d.g, 'red', [1.6, 0, 0]);
      const F = flame(d.g, FLAME.Mg, [-1.6, 0.2, 0], 1.3); F.g.visible = false; d.frame(F.tick);
      return { ...d, async reveal() { F.g.visible = true; await sleep(0.4); await L.userData.turn('blue'); s.tag('<b>basic + in the earth</b>', d.g, [0, -1.6, 0], 'big gold'); } }; } },
];

export const start = (o) => runQuiz({ ...o, Q, id: 'quiz8', hub: 'games.html?unit=8' });
