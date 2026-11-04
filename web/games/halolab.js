// Halogen Duel (Unit 8, films 816-817): the halogens in 3D jars, in the book's colours (Fig 8.5).
//   🎨 Look      a jar: which halogen is it? (Table 8.9: pale yellow gas, greenish gas, dark red liquid, black solid + purple vapour)
//   ⚔️ Duel      a halogen poured into a salt solution: does it push the other halogen out? (F > Cl > Br > I)
//   💥 Hydrogen  H₂ + F₂ / Cl₂ / Br₂ / I₂: violently · needs sunlight · needs heat · goes both ways
//   📏 Trends    which atom is bigger? which is more electronegative? (Table 8.9)
// Covers Short Q x, Test Yourself (p.245), Long Q V, MCQ i, v.
import { THREE, popIn, tween, sleep } from './kit.js';
import { runGame, choose, chooseText, shuffle } from './rounds.js';
import { atom } from './chem7.js';
import { gasJar, flame } from './chem8.js';
import { jar } from './gas3d.js';

const H = {
  F: { n: 'fluorine', c: 0xf2f0a0, k: 'gas', look: 'pale yellow gas', r: 71, en: 4.0 },
  Cl: { n: 'chlorine', c: 0x9bea5a, k: 'gas', look: 'greenish gas', r: 99, en: 3.0 },
  Br: { n: 'bromine', c: 0x9a2a10, k: 'liquid', look: 'dark red liquid', r: 114, en: 2.8 },
  I: { n: 'iodine', c: 0x8a3ad0, k: 'solid', look: 'black solid, purple vapour', r: 133, en: 2.5 },
};
const RANK = ['F', 'Cl', 'Br', 'I'];
const SOL = { Br: 0xff8a1e, I: 0x7a3a12, Cl: 0xd6f5b0 };      // colour of the freed halogen in water

// ---------------------------------------------------------------- 🎨 look
const LK = [...shuffle(RANK), ...shuffle(RANK), ...shuffle(RANK)];
function look(k, g) {
  const x = LK[k], J = gasJar(g.stage.root, H[x].c, H[x].k, [0, -1.9, 0]); J.scale.setScalar(1.25);
  if (k < 8) {
    g.goal('Which halogen is in the jar?', k);
    choose(g, k, RANK, x, { label: (s) => H[s].n, w: 2.2, size: 0.42, column: [3.6, 1.3], why: `${H[x].n}: ${H[x].look}` });
  } else {
    J.visible = false; g.stage.tag(`<b>${H[x].n}</b>`, g.stage.root, [-1.6, 1.4, 0], 'huge');
    g.goal('What does it look like?', k);
    const show = () => { J.visible = true; popIn(J, 1.25, 0.4); };
    chooseText(g, k, RANK.map((s) => H[s].look), RANK.indexOf(x), { tap: false, why: `${H[x].n}: ${H[x].look}`, onRight: show, onReveal: show });
  }
}

// ---------------------------------------------------------------- ⚔️ duel: displacement
const DU = shuffle([['Cl', 'Br'], ['Br', 'I'], ['Cl', 'I'], ['I', 'Br'], ['Br', 'Cl'], ['F', 'Cl'], ['I', 'Cl'], ['Cl', 'Br'], ['Br', 'I']]);
const SALT = { Cl: 'NaCl', Br: 'NaBr', I: 'KI' };
function beaker(parent, x) {
  const J = jar(0.95, 2.2); J.position.set(x, -2.2, 0); parent.add(J);
  const mat = new THREE.MeshPhysicalMaterial({ color: 0xcfe6ff, transparent: true, opacity: 0.35, roughness: 0.1 });
  const liq = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.88, 1.2, 28), mat); liq.position.y = 0.65; J.add(liq);
  J.userData.mat = mat; popIn(J, 1, 0.4); return J;
}
function duel(k, g) {
  const [a, b] = DU[k], wins = RANK.indexOf(a) < RANK.indexOf(b), G = new THREE.Group(); g.stage.root.add(G);
  const src = gasJar(G, H[a].c, H[a].k, [-2.6, -2.2, 0]);
  g.stage.tag(`<b>${a}₂</b>`, src, [0, -0.5, 0], 'big');
  const B = beaker(G, 1.5); g.stage.tag(`<b>${SALT[b]}</b>`, B, [0, -0.5, 0], 'big');
  g.stage.tag(`<b>${a}₂ + ${SALT[b]}</b>`, G, [-0.6, 2.9, 0], 'huge');
  let done = false;
  const pour = async () => {
    if (done) return; done = true;
    await tween(0.6, (t) => { src.position.set(-2.6 + t * 2.0, -2.2 + t * 2.4, 0); src.rotation.z = -t * 1.0; });
    if (wins) { const from = B.userData.mat.color.clone(), to = new THREE.Color(SOL[b]);
      await tween(1.0, (t) => { B.userData.mat.color.copy(from).lerp(to, t); B.userData.mat.opacity = 0.35 + 0.4 * t; });
      g.stage.tag(`<b>${b}₂ pushed out</b>`, B, [0, 2.8, 0], 'big gold');
    } else g.stage.tag('<b>no change</b>', B, [0, 2.8, 0], 'big');
  };
  g.goal(`Does ${H[a].n} push ${H[b].n} out?`, k);
  if (k < 3) g.later(0.5, pour);                     // level 1: watch it happen, then answer
  choose(g, k, ['yes', 'no'], wins ? 'yes' : 'no', { w: 2.2, size: 0.5, column: [4.2, 0.6],
    why: wins ? `${a} is above ${b} (F > Cl > Br > I): ${b}₂ comes out` : `${a} is below ${b}: nothing happens`, onRight: pour, onReveal: pour });
}

// ---------------------------------------------------------------- 💥 hydrogen
const HY = { F: 'reacts violently', Cl: 'needs sunlight', Br: 'needs heat', I: 'goes both ways' };
const HO = [...shuffle(RANK), ...shuffle(RANK)];
function hydrogen(k, g) {
  const x = HO[k], G = new THREE.Group(); G.position.y = 0.4; g.stage.root.add(G);
  const h = atom(g.stage, G, 'H', [-1.6, 0, 0], 1.6), y = atom(g.stage, G, x === 'I' ? 'I' : x, [1.6, 0, 0], 1.3);
  g.stage.tag(`<b>H₂ + ${x}₂ → 2H${x}</b>`, G, [0, 1.9, 0], 'huge');
  const show = async () => {
    if (x === 'F') { const F = flame(G, 0xffe08a, [0, -0.4, 0], 2.2); g.onFrame(F.tick); }
    else if (x === 'Cl') { const S = flame(G, 0xfff2b0, [0, 2.8, 0], 1.2); g.onFrame(S.tick); g.stage.tag('<b>☀ sunlight</b>', G, [0, 3.6, 0], 'big gold'); }
    else if (x === 'Br') { const F = flame(G, 0x6aa8ff, [0, -1.6, 0], 1.0); g.onFrame(F.tick); g.stage.tag('<b>heat</b>', G, [0, -2.4, 0], 'big gold'); }
    else g.stage.tag('<b>⇄ both ways</b>', G, [0, -1.6, 0], 'big gold');
    await tween(0.8, (t) => { h.position.x = -1.6 + t * 0.7; y.position.x = 1.6 - t * 0.7; });
  };
  g.goal(k < 4 ? `How does hydrogen react with ${H[x].n}?` : `${H[x].n} + hydrogen: how?`, k);
  if (k < 4) g.later(0.4, show);
  chooseText(g, k, RANK.map((s) => HY[s]), RANK.indexOf(x), { tap: false, why: `H₂ + ${x}₂: ${HY[x]}`, onRight: show, onReveal: show });
}

// ---------------------------------------------------------------- 📏 trends (Table 8.9)
const TR = shuffle([['F', 'Br', 'r'], ['I', 'Cl', 'r'], ['Br', 'F', 'r'], ['F', 'I', 'en'], ['Cl', 'Br', 'en'], ['I', 'F', 'en'], ['Cl', 'I', 'r'], ['Br', 'I', 'en']]);
function trends(k, g) {
  const [a, b, q] = TR[k], G = new THREE.Group(); G.position.y = 0.4; g.stage.root.add(G);
  [a, b].forEach((s, i) => { const m = atom(g.stage, G, s, [-1.9 + i * 3.8, 0, 0], H[s].r / 75); popIn(m, m.scale.x, 0.4); });
  const big = q === 'r' ? (H[a].r > H[b].r ? a : b) : (H[a].en > H[b].en ? a : b);
  g.goal(q === 'r' ? 'Which atom is bigger?' : 'Which is more electronegative?', k);
  choose(g, k, [a, b], big, { label: (s) => H[s].n, w: 2.4, size: 0.44,
    why: q === 'r' ? `${H[big].n}: ${H[big].r} pm (atoms grow down the group)` : `${H[big].n}: ${H[big].en} (it falls down the group)` });
}

// ---------------------------------------------------------------- 🧪 reactions (p.243-245, Test Yourself, Short Q viii)
const RX = [
  ['H₂S + Cl₂ →', ['2HCl + S', 'H₂ + SCl₂', 'HCl + H₂S', 'S + Cl₂'], 'chlorine pulls hydrogen from H₂S: yellow sulphur'],
  ['2NH₃ + 3Cl₂ →', ['6HCl + N₂', '2NCl₃ + 3H₂', 'N₂ + Cl₂', '6NH₄Cl'], 'chlorine oxidizes ammonia'],
  ['Ca(OH)₂ + Cl₂ →', ['CaOCl₂ + H₂O', 'CaCl₂ + H₂', 'CaO + HCl', 'Ca + Cl₂O'], 'lime water + chlorine: bleaching powder'],
  ['2P + 3Cl₂ →', ['2PCl₃', 'P₂Cl₃', '2PCl₅', 'PCl'], 'phosphorus trichloride'],
  ['2P + 5Cl₂ →', ['2PCl₅', '2PCl₃', 'P₂Cl₅', 'PCl₁₀'], 'more chlorine: phosphorus pentachloride'],
  ['2NaBr + Cl₂ →', ['2NaCl + Br₂', 'NaCl + NaBr', '2NaBrCl', 'no reaction'], 'chlorine pushes bromine out'],
  ['Br₂ + 2KI →', ['2KBr + I₂', 'KBr + KI', 'K₂Br + I₂', 'no reaction'], 'Test Yourself: bromine pushes iodine out'],
  ['Cl₂ + 2NaOH →', ['NaCl + NaOCl + H₂O', 'NaCl + H₂O', '2NaClO', 'NaH + HCl'], 'cold, dilute NaOH: salt + sodium hypochlorite (bleach)'],
  ['Period 3 · pushes iodine out of NaI · greenish gas, denser than air · kills germs in pools', ['chlorine', 'fluorine', 'bromine', 'iodine'], 'Test Yourself B: chlorine'],
];
const RO = shuffle(RX.map((_, i) => i));
function reactions(k, g) {
  const [eq, o, why] = RX[RO[k]], riddle = !eq.includes('→');
  g.stage.tag(`<b>${eq}${riddle ? '' : ' ?'}</b>`, g.stage.root, [0, 1.2, 0], riddle ? 'big' : 'huge');
  if (riddle) { const J = gasJar(g.stage.root, H.Cl.c, 'gas', [0, -2.4, 0]); J.visible = false; g._show = () => { J.visible = true; popIn(J, 1, 0.4); }; }
  g.goal(riddle ? 'Which element is it?' : 'What forms?', k);
  const show = () => { if (riddle) g._show(); else g.stage.tag(`<b>${o[0]}</b>`, g.stage.root, [0, 0, 0], 'huge gold'); };
  chooseText(g, k, o, 0, { tap: false, why: `${riddle ? '' : eq + ' ' + o[0] + ': '}${why}`, onRight: show, onReveal: show });
}

const PARTS = [
  { key: 'look', icon: '🎨', name: 'Look', n: LK.length, steps: [4, 8], run: look },
  { key: 'duel', icon: '⚔️', name: 'Duel', n: DU.length, steps: [3], run: duel },
  { key: 'h2', icon: '💥', name: 'Hydrogen', n: HO.length, steps: [4], run: hydrogen },
  { key: 'trend', icon: '📏', name: 'Trends', n: TR.length, run: trends },
  { key: 'rx', icon: '🧪', name: 'Reactions', n: RX.length, run: reactions },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'halolab', parts: PARTS, cam: [0, 0.4, 13.5], target: [0, 0.2, 0], excite: true });
}
