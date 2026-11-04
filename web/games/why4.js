// Bond Reasons (Unit 4): the exercise questions that need a REASON, and the Key Points (p.117) to know by heart.
// Easy → hard (SKILL): 🔍 Explore (every item shown with its answer, nothing can be wrong) · 📖 Words (Key Points:
// definition → name) · 💡 Why? (Short Q v, ix, x · Long Q i, ii, iv, v: the 3D picture first, then the reason; after the
// answer the picture shows WHY) · 📋 Facts (everything lessons 401–413 leave to the game) · 🖊️ Lewis (Long Q iii: count the shared pairs, then the lone pairs, on the turning
// molecule) · ⚡ Speed (Words again, 10 s each, once everything is known). Arcade layer on (excite).
import { THREE, popIn, tween, ease, ball, M } from './kit.js';
import { runGame, choose, chooseText, shuffle } from './rounds.js';
import { molecule, SHAPES, ionBall, dotAtom, enRuler } from './mol3d.js';

SHAPES.CO ??= { atoms: [['C', [-0.6, 0, 0]], ['O', [0.6, 0, 0]]], bonds: [[0, 1, 3]], lone: [[0, [-1, 0, 0]], [1, [1, 0, 0]]] };
SHAPES.CCl4 ??= { atoms: [['C', [0, 0, 0]], ...[[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map((v) => ['Cl', v.map((c) => c * 0.95)])], bonds: [1, 2, 3, 4].map((k) => [0, k, 1]), lone: [] };

// ---------------------------------------------------------------- pictures (each returns { why() } for after the answer)
function ionGrid(g, G, { cols = 4, rows = 3, gap = 1.25, y = 0 } = {}) {
  const list = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const plus = (i + j) % 2 === 0, p = [(i - (cols - 1) / 2) * gap, y + (j - (rows - 1) / 2) * gap, 0];
    list.push({ m: ionBall(g.stage, G, plus ? '+' : '−', p, plus, plus ? 0.38 : 0.5), home: new THREE.Vector3(...p), plus, ph: Math.random() * 6.28 });
  }
  return list;
}
const PIC = {
  // Short Q v: locked in the solid; free to move when melted or dissolved
  molten(g, G) {
    const ions = ionGrid(g, G); let free = 0, tt = 0;
    g.onFrame((dt) => { tt += dt ?? 0.016; ions.forEach((o) => { o.m.position.copy(o.home).add(new THREE.Vector3(Math.sin(tt * 6 + o.ph) * 0.04, 0, 0))
      .add(new THREE.Vector3(Math.sin(tt * 0.9 + o.ph) * 1.4, Math.cos(tt * 0.7 + o.ph * 1.3) * 0.9, 0).multiplyScalar(free)); }); });
    g.stage.tag('<b>solid: ions held in place</b>', G, [0, 2.3, 0], 'big');
    return { why() { tween(1.2, (t) => (free = t), ease.inOut); g.stage.tag('<b>melted: ions move ✓</b>', G, [0, -2.4, 0], 'big green'); } };
  },
  // Short Q ix: charged ions vs neutral molecules
  conduct(g, G) {
    const L = new THREE.Group(); L.position.x = -2.6; G.add(L); const R = new THREE.Group(); R.position.x = 2.6; G.add(R);
    ionBall(g.stage, L, 'Na⁺', [-0.75, 0, 0], true, 0.45); ionBall(g.stage, L, 'Cl⁻', [0.75, 0, 0], false, 0.6);
    const m = molecule(R, 'H2O', { scale: 1.1 }); popIn(m.g, 1, 0.4);
    g.stage.tag('<b>ionic: charged</b>', L, [0, 1.5, 0], 'big'); g.stage.tag('<b>covalent: no charge</b>', R, [0, 1.5, 0], 'big');
    return { why() { g.stage.tag('<b>ions carry the current ✓</b>', L, [0, -1.5, 0], 'big green'); tween(1.4, (t) => { L.children[0].position.x = -0.75 - 1.2 * t; L.children[1].position.x = 0.75 + 1.2 * t; }, ease.inOut); } };
  },
  // Short Q x: N gives BOTH electrons of the pair to H⁺
  dative(g, G) {
    const m = molecule(G, 'NH3', { scale: 1.15 }), N = m.atoms[0];
    const e = [-1, 1].map((s) => { const b = ball(M.gold ?? new THREE.MeshStandardMaterial({ color: 0xffe2b0, emissive: 0xffa53a, emissiveIntensity: 1.8 }), 0.1); b.position.set(s * 0.13, 0.85, 0); m.g.add(b); return b; });
    const h = ionBall(g.stage, m.g, 'H⁺', [2.6, 2.4, 0], true, 0.32);
    g.stage.tag('<b>both electrons from N</b>', m.g, [0, -1.6, 0], 'big gold');
    return { why() { tween(1.2, (t) => h.position.set(2.6 * (1 - t), 2.4 - 0.6 * t, 0), ease.inOut).then(() => g.stage.tag('<b>pair nearer to N: polar ✓</b>', m.g, [0, -2.3, 0], 'big green')); } };
  },
  // Long Q i: neon has 8 outer electrons (stable); sodium has 1
  octet(g, G) {
    const L = new THREE.Group(); L.position.x = -2.3; G.add(L); const R = new THREE.Group(); R.position.x = 2.3; G.add(R);
    dotAtom(g.stage, L, 'Ne', [0, 0, 0], 8, { r: 1.25 }); const na = dotAtom(g.stage, R, 'Na', [0, 0, 0], 1, { r: 1.25, angles: [0] });
    g.stage.tag('<b>neon: 8, stable</b>', L, [0, -2.0, 0], 'big'); g.stage.tag('<b>sodium: 1</b>', R, [0, -2.0, 0], 'big');
    return { why() { const d = na.dots[0]; tween(1.0, (t) => d.position.x += 0.08, ease.inOut).then(() => { d.visible = false; g.stage.tag('<b>loses 1 → 8 like neon ✓</b>', R, [0, 2.0, 0], 'big green'); }); } };
  },
  // Long Q ii (a): transfer vs sharing
  transfer(g, G) {
    const L = new THREE.Group(); L.position.x = -2.6; G.add(L); const R = new THREE.Group(); R.position.x = 2.6; G.add(R);
    ionBall(g.stage, L, 'Na⁺', [-0.7, 0, 0], true, 0.45); ionBall(g.stage, L, 'Cl⁻', [0.75, 0, 0], false, 0.6);
    popIn(molecule(R, 'Cl2', { scale: 0.9 }).g, 1, 0.4);
    g.stage.tag('<b>NaCl</b>', L, [0, 1.4, 0], 'huge'); g.stage.tag('<b>Cl₂</b>', R, [0, 1.4, 0], 'huge');
    return { why() { g.stage.tag('<b>transferred</b>', L, [0, -1.4, 0], 'big green'); g.stage.tag('<b>shared</b>', R, [0, -1.4, 0], 'big green'); } };
  },
  // Long Q ii (b): the electronegativity-difference ruler
  ruler(g, G) {
    const ru = enRuler(g.stage, G, 0, 8.5); g.stage.tag('<b>difference in electronegativity</b>', ru.g, [0, 1.1, 0], 'big gold');
    return { why() { ru.marker(2.1).then(() => g.stage.tag('<b>NaCl 2.1: ionic ✓</b>', ru.g, [ru.X(2.1), 0.65, 0], 'big green')); } };
  },
  // Long Q iv: a push brings like charges face to face in a crystal
  slide(g, G) {
    const ions = ionGrid(g, G, { cols: 5, rows: 2, gap: 1.2 }), top = ions.filter((o) => o.home.y > 0);
    g.stage.tag('<b>an ionic crystal: + next to −</b>', G, [0, 1.9, 0], 'big');
    return { why() { tween(1.0, (t) => top.forEach((o) => (o.m.position.x = o.home.x + 1.2 * t)), ease.inOut)
      .then(() => { g.stage.tag('<b>+ meets +: they repel, it breaks ✓</b>', G, [0, -1.9, 0], 'big green'); return tween(0.8, (t) => top.forEach((o) => (o.m.position.y = o.home.y + 1.0 * t)), ease.out); }); } };
  },
  // Long Q v: unequal sharing in HCl (δ+ δ−), equal in H₂
  polar(g, G) {
    const L = new THREE.Group(); L.position.x = -2.3; G.add(L); const R = new THREE.Group(); R.position.x = 2.3; G.add(R);
    popIn(molecule(L, 'H2', { scale: 1.2 }).g, 1, 0.4); popIn(molecule(R, 'HCl', { scale: 1.0 }).g, 1, 0.4);
    g.stage.tag('<b>H₂</b>', L, [0, 1.3, 0], 'huge'); g.stage.tag('<b>HCl</b>', R, [0, 1.3, 0], 'huge');
    return { why() { g.stage.tag('<b>equal: non-polar</b>', L, [0, -1.3, 0], 'big green'); g.stage.tag('<b>δ+ H · Cl δ−: polar</b>', R, [0, -1.3, 0], 'big green'); } };
  },
};

// ---------------------------------------------------------------- the questions
const WHY = [
  { c: 'Short Q v', q: 'Why are ionic compounds electrolytes when molten or dissolved, but not as a solid?', pic: 'molten',
    o: ['In the solid the ions are held in place; melted or dissolved they move and carry current', 'In the solid there are no ions; melting makes new ions out of the shared electron pairs', 'Melting turns the ions into neutral molecules, and only neutral molecules can carry current'], a: 0 },
  { c: 'Short Q ix', q: 'Why do ionic compounds conduct better than covalent compounds?', pic: 'conduct',
    o: ['They are made of charged ions that carry the current; covalent molecules have no charge', 'They are made of neutral molecules; covalent compounds are made of charged ions', 'They share their electrons, and shared electrons always flow through a wire'], a: 0 },
  { c: 'Short Q x', q: 'Why is a dative bond always polar?', pic: 'dative',
    o: ['One atom gives both electrons of the pair, so the pair is not shared equally', 'Each atom gives one electron, so the pair sits exactly in the middle', 'It always forms between two atoms of the same element'], a: 0 },
  { c: 'Long Q i', q: 'What is the octet rule?', pic: 'octet',
    o: ['Atoms lose, gain or share electrons to get 8 outer electrons like a noble gas: stable', 'Atoms keep exactly 8 electrons in every one of their shells: stable', 'Only atoms of the noble gases are able to form chemical bonds'], a: 0 },
  { c: 'Long Q ii (a)', q: 'What is the main difference between ionic and covalent bonding?', pic: 'transfer',
    o: ['Ionic: electrons are transferred (NaCl); covalent: electrons are shared (Cl₂)', 'Ionic: electrons are shared (Cl₂); covalent: electrons are transferred (NaCl)', 'Ionic bonds form between two non-metals; covalent between metal and non-metal'], a: 0 },
  { c: 'Long Q ii (b)', q: 'How does electronegativity tell ionic from covalent bonding?', pic: 'ruler',
    o: ['Difference more than 1.7: ionic; 0.5 to 1.7: polar covalent; less than 0.5: non-polar', 'Difference less than 0.5: ionic; 0.5 to 1.7: polar covalent; more than 1.7: non-polar', 'The atom with the bigger electronegativity always makes the bond covalent'], a: 0 },
  { c: 'Long Q iv', q: 'Why are metals malleable and ductile, but ionic crystals are not?', pic: 'slide',
    o: ['In a crystal a push brings like charges together, they repel and it breaks; metal ions just slide in their sea', 'In a crystal there are no charges to hold it, so it falls apart; metals have charges', 'Metals have no electrons between their atoms, so their atoms can move freely'], a: 0 },
  { c: 'Long Q v (a)', q: 'What does “polar” mean in chemical bonding?', pic: 'polar',
    o: ['The shared pair is pulled nearer one atom: it gets δ−, the other δ+', 'The bond has no shared electrons at all, so there is no charge', 'The two atoms are the same and share the pair equally'], a: 0 },
  { c: 'Long Q v (b)', q: 'Polar covalent or non-polar covalent: what is the difference?', pic: 'polar',
    o: ['Polar: different atoms, unequal sharing (HCl); non-polar: similar atoms, equal sharing (H₂)', 'Polar: similar atoms, equal sharing (H₂); non-polar: different atoms, unequal sharing (HCl)', 'Polar bonds transfer electrons; non-polar bonds share them'], a: 0 },
];
// Key Points p.117: definition → name (and a small picture of it)
const WORDS = [
  ['the attractive force that holds atoms together', 'chemical bond', 'NaCl'], ['the electrons in the outer (valence) shell', 'valence electrons', 'Na'],
  ['complete transfer of electrons from one atom to another', 'ionic bond', 'NaCl'], ['mutual sharing of electrons', 'covalent bond', 'Cl2'],
  ['one atom donates the shared pair', 'dative bond', 'NH3'], ['sharing between different atoms', 'polar covalent', 'HCl'],
  ['sharing between similar atoms', 'non-polar covalent', 'H2'], ['metal ions in a sea of electrons', 'metallic bond', 'metal'],
  ['forces between the molecules of a compound', 'intermolecular forces', 'H2O'], ['H of one molecule pulled to F, O or N of another', 'hydrogen bond', 'H2O'],
];
const TERMS = WORDS.map((w) => w[1]);
// Long Q iii: [key, formula, shared pairs, the atom asked about, its lone pairs]
const LEWIS = [['HCl', 'HCl', 1, 'Cl', 3], ['NH3', 'NH₃', 3, 'N', 1], ['CCl4', 'CCl₄', 4, 'C', 0], ['BF3', 'BF₃', 3, 'B', 0], ['SO2', 'SO₂', 4, 'S', 1], ['CO', 'CO', 3, 'C', 1]];

// Facts the lessons leave to the game (lesson headers 401–413): [question, right, wrong, wrong, picture]
const FACTS = [
  ['Who gave the idea of the octet (1916)?', 'G. N. Lewis and W. Kossel', 'Linus Pauling', 'John Dalton', 'Na'],
  ['The noble gases are also called …', 'inert gases', 'alkali metals', 'halogens', 'Ne'],
  ['The noble gases are in group …', 'VIIIA', 'IA', 'VIIA', 'Ne'],
  ['Two ideas explain chemical bonding:', 'the valence concept and the orbital concept', 'the gas laws and the mole', 'melting and boiling', 'H2'],
  ['O₂ and O₃ are molecules of …', 'one element', 'a compound', 'two metals', 'O2'],
  ['H₂O and CO₂ are molecules of …', 'compounds', 'one element', 'noble gases', 'H2O'],
  ['Stable with only 2 outer electrons (duplet):', 'helium', 'neon', 'sodium', 'H2'],
  ['Outer-shell electrons that take part in a bond are …', 'bonding electrons', 'non-bonding electrons', 'inner electrons', 'HCl'],
  ['Outer pairs that do not take part in a bond are …', 'lone (non-bonding) pairs', 'shared pairs', 'bonding pairs', 'NH3'],
  ['Orbitals that overlap head-on make a …', 'sigma (σ) bond', 'pi (π) bond', 'ionic bond', 'H2'],
  ['Orbitals that overlap side by side make a …', 'pi (π) bond', 'sigma (σ) bond', 'metallic bond', 'O2'],
  ['The four types of chemical bond:', 'ionic, covalent, dative, metallic', 'solid, liquid, gas, plasma', 'sigma, pi, delta, gamma', 'NaCl'],
  ['A metal atom loses electrons and becomes …', 'a cation (+)', 'an anion (−)', 'a molecule', 'NaCl'],
  ['A non-metal atom gains electrons and becomes …', 'an anion (−)', 'a cation (+)', 'a metal', 'NaCl'],
  ['Atoms form ions to get …', 'the electron arrangement of a noble gas', 'more protons', 'a bigger nucleus', 'Ne'],
  ['An ionic bond forms between …', 'a metal and a non-metal', 'two non-metals', 'two noble gases', 'NaCl'],
  ['C₂H₄ (ethene) has a …', 'double bond (C=C)', 'triple bond (C≡C)', 'ionic bond', 'C2H4'],
  ['C₂H₂ (ethyne) has a …', 'triple bond (C≡C)', 'double bond (C=C)', 'single bond only', 'N2'],
  ['N₂ has a …', 'triple bond', 'double bond', 'single bond', 'N2'],
  ['A dative bond is also called a …', 'coordinate covalent bond', 'metallic bond', 'hydrogen bond', 'NH3'],
  ['In a dative bond, the atom that gives the pair is …', 'electron-rich (the donor)', 'electron-deficient (the acceptor)', 'a noble gas', 'NH3'],
  ['In a dative bond, the atom that takes the pair is …', 'electron-deficient (the acceptor)', 'electron-rich (the donor)', 'always a metal', 'NH3'],
  ['The bond in Br₂ is …', 'non-polar covalent', 'polar covalent', 'ionic', 'Cl2'],
  ['Metals held by metallic bonds:', 'aluminium, silver, copper, platinum', 'oxygen, nitrogen, chlorine', 'salt, sugar, water', 'metal'],
  ['The electron sea model is also called …', 'the electron gas theory', 'the octet rule', 'the duplet rule', 'metal'],
  ['A hydrogen bond needs H joined to …', 'F, O or N', 'Na, K or Li', 'He, Ne or Ar', 'H2O'],
  ['Which has dipole–dipole forces between its molecules?', 'HCl', 'H₂', 'Cl₂', 'HCl'],
  ['Weak forces between molecules are also called …', 'Van der Waals forces', 'ionic bonds', 'metallic bonds', 'HCl'],
  ['Polar molecules (dipole–dipole forces):', 'CO, NO, H₂S, H₂O, NH₃, HCl', 'H₂, Cl₂, O₂, N₂', 'NaCl, KCl, MgO', 'HCl'],
  ['Which molecules form hydrogen bonds (Practice 4.4)?', 'H₂O, CH₃OH, NH₃', 'CH₄, H₂, Cl₂', 'CO₂, O₂, N₂', 'H2O'],
  ['He on its own is …', 'an atom', 'a molecule', 'an ion', 'Ne'],
  ['H₂ is …', 'a molecule of an element', 'a molecule of a compound', 'an ion', 'H2'],
  ['HCl and HgO are …', 'compounds', 'elements', 'noble gases', 'HCl'],
  ['Hydrogen bonds give water a …', 'high boiling point', 'low boiling point', 'metallic shine', 'H2O'],
  ['Ionic compounds have …', 'high melting points', 'low melting points', 'no melting point', 'NaCl'],
  ['Ionic crystals, when hammered, are …', 'brittle: they break', 'malleable: they flatten', 'ductile: they stretch', 'NaCl'],
  ['Most covalent compounds …', 'have low melting points', 'conduct electricity as solids', 'are hard crystals of ions', 'CH4'],
  ['Covalent compounds are …', 'poor conductors of electricity', 'good conductors', 'always metals', 'CH4'],
  ['Metals can be drawn into wires: they are …', 'ductile', 'brittle', 'sonorous', 'metal'],
  ['Metals can be bent and beaten into shape: they are …', 'malleable', 'brittle', 'volatile', 'metal'],
  ['Metals reflect light: they are …', 'lustrous (shiny)', 'dull', 'brittle', 'metal'],
  ['Metals ring when struck: they are …', 'sonorous', 'ductile', 'volatile', 'metal'],
  ['Metals let electricity pass: they are …', 'good conductors', 'insulators', 'brittle', 'metal'],
  ['Metals are heavy for their volume: they have …', 'a high density', 'a low density', 'no mass', 'metal'],
  ['Metals pass heat well: one use is …', 'cooking pots', 'glass windows', 'plastic toys', 'metal'],
];
function wordPic(g, G, kind) {
  if (kind === 'NaCl') { ionBall(g.stage, G, 'Na⁺', [-0.7, 0, 0], true, 0.45); ionBall(g.stage, G, 'Cl⁻', [0.75, 0, 0], false, 0.6); return; }
  if (kind === 'Na') { dotAtom(g.stage, G, 'Na', [0, 0, 0], 1, { r: 1.1, gold: true, angles: [0] }); return; }
  if (kind === 'Ne') { dotAtom(g.stage, G, 'Ne', [0, 0, 0], 8, { r: 1.1 }); return; }
  if (kind === 'metal') { for (let i = 0; i < 4; i++) ionBall(g.stage, G, '+', [(i - 1.5) * 1.0, 0, 0], true, 0.36); return; }
  const m = molecule(G, kind, { scale: 1.1 }); popIn(m.g, 1, 0.4); g.onFrame((dt) => (m.g.rotation.y += 0.4 * (dt ?? 0.016)));
}
function holder(g, y = 1.3) { const G = new THREE.Group(); G.position.y = y; g.stage.root.add(G); return G; }

function why(k, g, i = k, explore = false) {           // k = the round, i = which question
  const r = WHY[i], G = holder(g, 1.0), p = PIC[r.pic](g, G);
  g.goal(`${r.c}: ${r.q}`, k);
  if (explore) { g.later(0.8, () => p.why()); g.setTap(() => g.right(k, true, r.o[r.a], 0, false)); return; }
  chooseText(g, k, r.o, r.a, { why: r.o[r.a], onRight: () => p.why(), onReveal: () => p.why() });
}
function words(k, g, list, timed = false) {
  const [d, term, pic] = list[k], G = holder(g, 1.2); wordPic(g, G, pic);
  g.goal(d, k);
  const opts = [term, ...shuffle(TERMS.filter((t) => t !== term)).slice(0, 3)];
  chooseText(g, k, opts, 0, { why: `${term}: ${d}`, tap: false });
  if (timed) g.timer(10, () => g._reveal && g._reveal(), true);
}
function lewis(k, g) {
  const [key, f, pairs, at, lone] = LEWIS[k % LEWIS.length], askLone = k >= LEWIS.length, G = holder(g, 1.25);
  const m = molecule(G, key, { scale: 1.2 }); popIn(m.g, 1, 0.4); m.g.rotation.x = 0.25; g.onFrame((dt) => (m.g.rotation.y += 0.35 * (dt ?? 0.016)));
  m.lone.forEach((e) => (e.visible = false));                         // the lone pairs show only after the answer
  g.stage.tag(`<b>${f}</b>`, G, [0, 1.75, 0], 'huge');
  if (!askLone) {
    g.goal(`${f}: how many shared pairs?`, k);
    choose(g, k, [1, 2, 3, 4], pairs, { w: 1.3, size: 0.55, why: `${f}: ${pairs} shared pair${pairs > 1 ? 's' : ''} (count the sticks)` });
  } else {
    g.goal(`${f}: lone pairs on ${at}?`, k);
    const show = () => m.lone.forEach((e) => (e.visible = true));
    choose(g, k, [0, 1, 2, 3], lone, { w: 1.3, size: 0.55, why: `${at} in ${f}: ${lone} lone pair${lone === 1 ? '' : 's'}`, onRight: show, onReveal: show });
  }
}
function fact(k, g, list, timed = false) {
  const [q, right, w1, w2, pic] = list[k], G = holder(g, 1.2); wordPic(g, G, pic);
  g.goal(q, k); chooseText(g, k, [right, w1, w2], 0, { why: right, tap: false });
  if (timed) g.timer(10, () => g._reveal && g._reveal(), true);
}
function explore(k, g) {
  if (k < WORDS.length) {
    const [d, term, pic] = WORDS[k], G = holder(g, 1.0); wordPic(g, G, pic);
    g.stage.tag(`<b>${term}</b>`, G, [0, -2.0, 0], 'huge gold'); g.goal(d, k); g.setTap(() => g.right(k, true, `${term}: ${d}`, 0, false)); return;
  }
  if (k < WORDS.length + WHY.length) { why(k, g, k - WORDS.length, true); return; }
  const [q, right, , , pic] = FACTS[k - WORDS.length - WHY.length], G = holder(g, 1.0); wordPic(g, G, pic);
  g.stage.tag(`<b>${right}</b>`, G, [0, -2.0, 0], 'big gold'); g.goal(q, k); g.setTap(() => g.right(k, true, right, 0, false));
}
const SP = [...Array(10)].concat(shuffle(FACTS).slice(0, 10)), W1 = shuffle(WORDS), W2 = shuffle(WORDS), F1 = shuffle(FACTS), WY = shuffle(WHY.map((_, i) => i));
const PARTS = [
  { key: 'explore', icon: '🔍', name: 'Explore', n: WORDS.length + WHY.length + FACTS.length, run: explore },
  { key: 'words', icon: '📖', name: 'Words', n: W1.length, steps: [5], run: (k, g) => words(k, g, W1) },
  { key: 'facts', icon: '📋', name: 'Facts', n: FACTS.length, steps: [10, 20, 30], run: (k, g) => fact(k, g, F1) },
  { key: 'why', icon: '💡', name: 'Why?', n: WHY.length, run: (k, g) => why(k, g, WY[k]) },
  { key: 'lewis', icon: '🖊️', name: 'Lewis', n: LEWIS.length * 2, steps: [LEWIS.length], run: lewis },
  { key: 'speed', icon: '⚡', name: 'Speed', n: W2.length + 10, run: (k, g) => (k < W2.length ? words(k, g, W2, true) : fact(k, g, SP, true)) },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'why4', parts: PARTS, cam: [0, 0.4, 13.5], target: [0, 0.2, 0], excite: true });
}
