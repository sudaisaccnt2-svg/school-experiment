// Redox Detective (Unit 7): a reaction in 3D. Who is oxidized, who is reduced, which is the oxidizing or reducing
// agent? Pick; then the electrons hop from the giver to the taker and both get their label.
// Covers Short Q i (a, b), vi; Examples 7.4, 7.5; Br₂ + H₂S (p.189); Zn + Cu²⁺ and Na + I₂ (p.190); Long Q II.
import { THREE, sleep, popIn } from './kit.js';
import { runGame, chooseText, shuffle } from './rounds.js';
import { atom, hop } from './chem7.js';

// eq: equation; ask; o: choices; a; give: giver atoms [sym, x, y]; take: taker atoms; extra: spectators; n: e⁻ per taker
const ROUNDS = [
  { eq: 'Ca + Br₂ → CaBr₂', ask: 'Which element is reduced?', o: ['Ca', 'Br'], a: 1,
    give: [['Ca', -2, 0]], take: [['Br', 1.6, 0.6], ['Br', 1.6, -0.6]], n: 1 },
  { eq: '2HCl + Zn → ZnCl₂ + H₂', ask: 'Which element is reduced?', o: ['H', 'Zn', 'Cl'], a: 0,
    give: [['Zn', -2.2, 0]], take: [['H', 1.4, 0.7], ['H', 1.4, -0.7]], extra: [['Cl', 2.4, 0.7], ['Cl', 2.4, -0.7]], n: 1 },
  { eq: 'Zn + CuO → ZnO + Cu', ask: 'Which is the oxidizing agent?', o: ['Zn', 'CuO', 'ZnO', 'Cu'], a: 1,
    give: [['Zn', -2, 0]], take: [['Cu', 1.4, 0]], extra: [['O', 2.45, 0]], n: 2 },
  { eq: 'Sn²⁺ + Cl₂ → Sn⁴⁺ + 2Cl⁻', ask: 'Which is the oxidizing agent?', o: ['Sn²⁺', 'Cl₂'], a: 1,
    give: [['Sn', -2, 0]], take: [['Cl', 1.4, 0], ['Cl', 2.5, 0]], n: 1 },
  { eq: 'Br₂ + H₂S → 2HBr + S', ask: 'Which is the reducing agent?', o: ['Br₂', 'H₂S'], a: 1,
    give: [['S', -2, 0]], take: [['Br', 1.6, 0.65], ['Br', 1.6, -0.65]], extra: [['H', -2.75, 0.45], ['H', -2.75, -0.45]], n: 1 },
  { eq: 'Zn + Cu²⁺ → Zn²⁺ + Cu', ask: 'Which is oxidized?', o: ['Zn', 'Cu²⁺'], a: 0,
    give: [['Zn', -2, 0]], take: [['Cu', 2, 0]], n: 2 },
  { eq: '2Na + I₂ → 2Na⁺ + 2I⁻', ask: 'Which half reaction is the reduction?', o: ['2Na → 2Na⁺ + 2e⁻', 'I₂ + 2e⁻ → 2I⁻'], a: 1,
    give: [['Na', -2, 0.7], ['Na', -2, -0.7]], take: [['I', 1.6, 0.7], ['I', 1.6, -0.7]], n: 1, pair: true },
  { eq: 'Rusting: iron + oxygen + water', ask: 'A redox reaction from daily life. Which is oxidized?', o: ['iron', 'oxygen', 'water'], a: 0,
    give: [['Fe', -2, 0]], take: [['O', 1.4, 0], ['O', 2.3, 0]], n: 1 },
  { eq: 'Na → Na⁺ + e⁻', ask: 'Losing electrons is called:', o: ['oxidation', 'reduction'], a: 0,
    give: [['Na', -2, 0]], take: [], n: 1 },
  { eq: 'Cl + e⁻ → Cl⁻', ask: 'Gaining electrons is called:', o: ['oxidation', 'reduction'], a: 1,
    give: [], take: [['Cl', 2, 0]], n: 1 },
];

// Easy → hard (SKILL): the two word rounds (lose = oxidation, gain = reduction) come first. Level 1: the electrons hop
// first, then the question (watch, then answer). Level 2: the question first; the hop shows after, then a tap goes on.
const ORDER = [8, 9, ...shuffle([0, 1, 2, 3, 4, 5, 6, 7])], HALF = 5;
function scene(g, r) {
  const G = new THREE.Group(); G.position.y = 0.5; g.stage.root.add(G); popIn(G, 1, 0.4);
  const GV = r.give.map(([s, x, y]) => atom(g.stage, G, s, [x, y, 0], 1.2));
  const TK = r.take.map(([s, x, y]) => atom(g.stage, G, s, [x, y, 0], 1.2));
  (r.extra || []).forEach(([s, x, y]) => atom(g.stage, G, s, [x, y, 0], 1.2));
  g.stage.tag(`<b>${r.eq}</b>`, G, [0, 1.75, 0], 'huge');
  let done = false;
  async function why() {
    if (done) return; done = true;
    const away = new THREE.Object3D(); away.position.set(3.2, 0, 0); G.add(away);
    const from = new THREE.Object3D(); from.position.set(-3.2, 0, 0); G.add(from);
    if (GV.length && TK.length) { for (let k = 0; k < TK.length; k++) await hop(G, GV[r.pair ? k : 0], TK[k], r.n); }
    else if (GV.length) await hop(G, GV[0], away, r.n);
    else await hop(G, from, TK[0], r.n);
    if (GV.length) g.stage.tag('<b>loses e⁻: oxidized</b>', GV[0], [0, -1.2, 0], 'big blue');
    if (TK.length) g.stage.tag('<b>gains e⁻: reduced</b>', TK[0], [0, -1.2 - (TK.length > 1 ? 0.7 : 0), 0], 'big gold');
    if (GV.length && TK.length) g.stage.tag('<b>giver = reducing agent · taker = oxidizing agent</b>', G, [0, -2.1, 0], 'big gold');
  }
  return { why };
}
function round(k, g) {
  const r = ROUNDS[ORDER[k]], S = scene(g, r), watch = k < HALF;
  g.goal(r.ask, k);
  if (watch) g.later(0.6, () => S.why());
  chooseText(g, k, r.o, r.a, { why: `${r.eq}: ${r.o[r.a]}`, tap: !watch, onRight: () => S.why(), onReveal: () => S.why() });
}
const PARTS = [{key:'explore',icon:'🔍',name:'Explore',n:ROUNDS.length,run:(k,g)=>{const r=ROUNDS[k],s=scene(g,r);g.goal(r.eq,k);g.later(.4,()=>s.why());g.setTap(()=>g.right(k,true,r.o[r.a],0,false));}},
  { key: 'redox', icon: '🕵️', name: 'Redox', n: ORDER.length, steps: [HALF], run: round }];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'redoxsort', parts: PARTS, cam: [0, -0.4, 13.5], target: [0, -0.8, 0], excite:true });
}
