// Quiz Quest, Unit 7: the 10 MCQs of pp.215-216. Same screen as the other quizzes (quiz.js runQuiz); each right answer
// plays a small 3D demo: atoms with gold oxidation-number badges, electrons hopping, a cell with electrons in the wire.
import { THREE, sleep, tween } from './kit.js';
import { runQuiz, demoBase } from './quiz.js';
import { atom, hop, ion, cell, flow, METALS } from './chem7.js';

// atoms with badges; '?' badges turn into the answer on reveal
function mol(stage, d, items, k = 1) {
  return items.map(([sym, [x, y], b]) => {
    const m = atom(stage, d.g, sym, [x, y, 0], k);
    if (b) m.userData.badge = stage.tag(`<b>${b}</b>`, m, [0, m.userData.r + 0.4, 0], b === '?' ? 'big' : 'big gold');
    return m;
  });
}
const setBadge = (m, txt) => { m.userData.badge.innerHTML = `<b>${txt}</b>`; m.userData.badge.className += ' gold green'; };

export const Q = [
  { q: 'The oxidation number of nitrogen N₂ is:', o: ['+1', '0', '+3', '−3'], a: 1,
    why: 'N₂ is a free element. Every free element has oxidation number <b>0</b>.',
    demo: (s) => { const d = demoBase(s), A = mol(s, d, [['N', [-0.45, 0], '?'], ['N', [0.45, 0], '?']], 1.4);
      return { ...d, async reveal() { A.forEach((m) => setBadge(m, '0')); s.tag('<b>free element</b>', d.g, [0, -1.4, 0], 'big gold'); } }; } },
  { q: 'What is the oxidation number of C in CH₃OH?', o: ['−2', '0', '−1', '+1'], a: 0,
    why: '4 H = +4 and O = −2. The molecule adds up to 0: C + 4 − 2 = 0, so C = <b>−2</b>.',
    demo: (s) => { const d = demoBase(s), A = mol(s, d, [['C', [-0.5, 0], '?'], ['O', [0.6, 0], '−2'], ['H', [-0.9, 0.8], '+1'],
      ['H', [-1.35, -0.2], '+1'], ['H', [-0.6, -0.9], '+1'], ['H', [1.2, 0.55], '+1']], 1.2);
      return { ...d, async reveal() { setBadge(A[0], '−2'); s.tag('<b>+4 − 2 + C = 0</b>', d.g, [0, -1.8, 0], 'big gold'); } }; } },
  { q: 'A cation is', o: ['neutral.', 'negatively charged.', 'without charge.', 'positively charged.'], a: 3,
    why: 'A cation has lost electrons, so it is <b>positively charged</b> (Na⁺, Cu²⁺).',
    demo: (s) => { const d = demoBase(s), na = atom(s, d.g, 'Na', [-0.8, 0, 0], 1.4), far = new THREE.Object3D(); far.position.set(2.4, 0, 0); d.g.add(far);
      return { ...d, async reveal() { await hop(d.g, na, far, 1); const c = ion(d.g, true, [-0.8, 0, 0.1], 0.8); c.scale.setScalar(0.81);
        s.tag('<b>Na⁺: a cation</b>', c, [0, 1.3, 0], 'big gold'); } }; } },
  { q: 'Electrons are lost by the', o: ['reducing agent as it undergoes oxidation.', 'reducing agent as it undergoes reduction.',
    'oxidizing agent as it undergoes oxidation.', 'oxidizing agent as it undergoes reduction.'], a: 0,
    why: 'The <b>reducing agent</b> gives its electrons away, so it is <b>oxidized</b> itself.',
    demo: (s) => { const d = demoBase(s), na = atom(s, d.g, 'Na', [-1.8, 0, 0], 1.2), cl = atom(s, d.g, 'Cl', [1.8, 0, 0], 1.2);
      return { ...d, async reveal() { await hop(d.g, na, cl, 1); s.tag('<b>reducing agent: oxidized</b>', na, [0, 1.1, 0], 'big gold'); } }; } },
  { q: 'What is the oxidation number assigned to manganese in KMnO₄?', o: ['+7', '+3', '+2', '+4'], a: 0,
    why: 'K = +1 and 4 O = −8. The sum is 0: 1 + Mn − 8 = 0, so Mn = <b>+7</b>.',
    demo: (s) => { const d = demoBase(s), A = mol(s, d, [['Mn', [0, 0], '?'], ['O', [-1, 0.75], '−2'], ['O', [1, 0.75], '−2'],
      ['O', [-1, -0.75], '−2'], ['O', [1, -0.75], '−2'], ['K', [2.3, 0], '+1']], 0.9);
      return { ...d, async reveal() { setBadge(A[0], '+7'); s.tag('<b>1 + 7 − 8 = 0</b>', d.g, [0, -1.9, 0], 'big gold'); } }; } },
  { q: 'In a particular redox reaction, the oxidation number of phosphorus changed from −3 to 0. From this information, it may be concluded that phosphorus:',
    o: ['Lost 3 electrons and was reduced.', 'Lost 3 electrons and was oxidized.', 'Gained 3 electrons and was reduced.', 'Gained 3 electrons and was oxidized.'], a: 1,
    why: '−3 → 0 goes up: 3 electrons are <b>lost</b>. Losing electrons = <b>oxidation</b>.',
    demo: (s) => { const d = demoBase(s), A = mol(s, d, [['P', [-0.8, 0], '−3']], 1.4), far = new THREE.Object3D(); far.position.set(2.6, 0, 0); d.g.add(far);
      return { ...d, async reveal() { await hop(d.g, A[0], far, 3, 0.7); setBadge(A[0], '0'); s.tag('<b>lost 3 e⁻: oxidized</b>', d.g, [0, -1.6, 0], 'big gold'); } }; } },
  { q: 'Which statement is true for an electrochemical cell?', o: ['Oxidation occurs at the anode only.', 'Reduction occurs at the anode only.',
    'Oxidation occurs at both the anode and cathode.', 'Reduction occurs at both the anode and cathode.'], a: 0,
    why: 'Anode: <b>oxidation</b>. Cathode: reduction. In every cell.',
    demo: (s) => { const d = demoBase(s), C = cell(d.g, {}), an = ion(C.g, false, [0.4, 1.0, 0.3], 0.22);
      s.tag('<b>anode</b>', C.L, [0, 1.7, 0], 'big'); s.tag('<b>cathode</b>', C.R, [0, 1.7, 0], 'big');
      return { ...d, async reveal() { await tween(1.0, (t) => an.position.set(0.4 - 1.65 * t, 1.0, 0.3)); const tk = flow(C.g, C.path, 5); d.frame(tk);
        s.tag('<b>Cl⁻ gives e⁻: oxidation</b>', C.g, [0, -0.6, 0], 'big gold'); } }; } },
  { q: 'In which of the following does sulphur have an oxidation number of +7?', o: ['HSO₃⁻', 'SO₃', 'H₂SO₄', 'H₂S₂O₈'], a: 3,
    why: 'The book\'s answer is <b>H₂S₂O₈</b> (HSO₃⁻ is +4, SO₃ and H₂SO₄ are +6). Really it is +6 too, with an O–O link.',
    hint: 'Work out S in the first three: +4, +6, +6.',
    demo: (s) => { const d = demoBase(s), A = mol(s, d, [['S', [-0.6, 0], '?'], ['S', [0.6, 0], '?']], 1.3);
      return { ...d, async reveal() { A.forEach((m) => setBadge(m, '+6')); s.tag('<b>Book choice: H₂S₂O₈. Its O–O pair makes S +6.</b>', d.g, [0, -1.5, 0], 'big gold'); } }; } },
  { q: 'What happens to the reducing agent in an oxidation-reduction reaction?', o: ['It is oxidized as it gains electrons.',
    'It is oxidized as it loses electrons', 'It is reduced as it gains electrons.', 'It is reduced as it loses electrons.'], a: 1,
    why: 'The reducing agent gives its electrons away: it <b>loses</b> them and is <b>oxidized</b>.',
    demo: (s) => { const d = demoBase(s), zn = atom(s, d.g, 'Zn', [-1.8, 0, 0], 1.2), cu = atom(s, d.g, 'Cu', [1.8, 0, 0], 1.2);
      s.tag('<b>Cu²⁺</b>', cu, [0, 1.1, 0], 'big');
      return { ...d, async reveal() { await hop(d.g, zn, cu, 2); s.tag('<b>Zn: loses e⁻, oxidized</b>', zn, [0, 1.1, 0], 'big gold'); } }; } },
  { q: 'In an electrochemical cell, electrons travel in which direction?', o: ['From the anode to the cathode through the external circuit.',
    'From the anode to the cathode through the salt bridge.', 'From the cathode to the anode through the external circuit.',
    'From the cathode to the anode through the salt bridge.'], a: 0,
    why: 'Electrons run in the <b>wire</b>, from <b>anode to cathode</b>. Only ions move in the salt bridge.',
    demo: (s) => { const d = demoBase(s), C = cell(d.g, { top: 'bulb', level: 0.9, pa: METALS.Zn, pc: METALS.Cu });
      C.bulbGlow.visible = false; s.tag('<b>Zn anode</b>', C.L, [0, -1.9, 0], 'big'); s.tag('<b>Cu cathode</b>', C.R, [0, -1.9, 0], 'big');
      return { ...d, async reveal() { C.bulbGlow.visible = true; const tk = flow(C.g, C.path, 6); d.frame(tk); await sleep(0.3);
        s.tag('<b>anode → wire → cathode</b>', C.g, [0, C.h + 2.3, 0], 'big gold'); } }; } },
];

export const start = (o) => runQuiz({ ...o, Q, id: 'quiz7', hub: 'games.html?unit=7' });
