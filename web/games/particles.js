// Particle Cards (Unit 2, film 03, book p.47, Table 2.1): the electron / proton / neutron table, memorized by playing.
//   🏷️ Symbol & charge  a card (e⁻, +1, 0 C, −1.6022 × 10⁻¹⁹ C …) → tap the particle it belongs to; it flies there.
//   ⚖️ Mass             amu and kg cards, plus "which is heaviest / lightest?" on a balance.
//   ⚡ Speed            every card mixed, names hidden (colour only), a few seconds each.
import { THREE, tween, popIn, popOut, ball, emissive, glow, M } from './kit.js';
import { runGame, tile, shake, shuffle } from './rounds.js';

const P3 = ['e', 'p', 'n'], NAMES = { e: 'electron', p: 'proton', n: 'neutron' };
const CHARGE = [['e⁻', 'e'], ['p⁺', 'p'], ['n⁰', 'n'], ['charge −1', 'e'], ['charge +1', 'p'], ['charge 0', 'n'],
  ['−1.6022 × 10⁻¹⁹ C', 'e'], ['+1.6022 × 10⁻¹⁹ C', 'p'], ['0 C', 'n']];
const MASS = [['0.00054859 amu', 'e'], ['1.0072766 amu', 'p'], ['1.0086654 amu', 'n'], ['heaviest', 'n'],
  ['9.11 × 10⁻³¹ kg', 'e'], ['1.6726 × 10⁻²⁷ kg', 'p'], ['1.6749 × 10⁻²⁷ kg', 'n'], ['lightest', 'e']];
const SPEED = [CHARGE[4], MASS[2], CHARGE[0], MASS[4], CHARGE[8], MASS[5], CHARGE[6], MASS[1], CHARGE[2], MASS[6], CHARGE[7], MASS[0]];

function particles(g, names) {
  const out = {};
  shuffle(P3).forEach((q, j) => {
    const G = new THREE.Group(); G.position.set((j - 1) * 3.6, 0.0, 0); g.stage.root.add(G); g.stage.pickable(G);
    const b = q === 'e' ? ball(M.electron, 0.32) : ball(q === 'p' ? M.proton : M.neutron, 0.75); G.add(b);
    if (q === 'e') G.add(glow(0x4aa8ff, 1.6, 0.7));
    const hit = new THREE.Mesh(new THREE.SphereGeometry(1.1, 12, 8), new THREE.MeshBasicMaterial({ visible: false })); G.add(hit);
    G.userData.q = q; popIn(G, 1, 0.4);
    if (names) g.stage.tag(NAMES[q], G, [0, -1.25, 0], 'big');
    out[q] = G;
  });
  return out;
}
function balance(g, L, R, tilt) {                // a see-saw: L and R balls on the ends; tilts toward the heavier side
  const B = new THREE.Group(); B.position.set(0, 0.2, 0.8); g.stage.root.add(B);
  const post = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.6, 3), emissive(0xffc061, 0.5)); post.position.y = -0.3; B.add(post);
  const beam = new THREE.Group(); B.add(beam);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.07, 0.15), emissive(0xffc061, 0.6)); beam.add(bar);
  [[L, -1.6], [R, 1.6]].forEach(([q, x]) => { const s = q === 'e' ? ball(M.electron, 0.14) : ball(q === 'p' ? M.proton : M.neutron, 0.3);
    s.position.set(x, q === 'e' ? 0.18 : 0.34, 0); beam.add(s); g.stage.tag(NAMES[q], s, [0, 0.65, 0], 'big'); });
  popIn(B, 1, 0.3);
  tween(1.2, (u) => { beam.rotation.z = -tilt * u; });
}

function round(k, g, list, names, secs) {
  const [text, q] = list[k];
  const ps = particles(g, names);
  const ask = text === 'heaviest' ? 'Which is heaviest?' : text === 'lightest' ? 'Which is lightest?' : null;
  let card = null;
  if (!ask) { card = tile(text, { w: 4.4, h: 1.0, color: '#8a7550', size: 0.5 }); card.position.set(0, 2.3, 0); g.stage.root.add(card); popIn(card, 1, 0.4); }
  g.goal(ask || 'Whose card is this?', k);
  let first = true, busy = false;
  const why = ask ? (q === 'n' ? 'The neutron is a little heavier than the proton' : 'The electron is far lighter than the proton')
    : `${NAMES[q]}: ${text}`;
  const show = async () => {
    if (card) { const a = card.position.clone(), b = ps[q].position.clone().add(new THREE.Vector3(0, 1.35, 0.3));
      await tween(0.6, (u) => { card.position.lerpVectors(a, b, u); card.scale.setScalar(1 - 0.4 * u); }); }
    else { P3.forEach((x) => popOut(ps[x])); g.stage.clearTags(); }
    if (card) return;
    if (q === 'n') balance(g, 'p', 'n', 0.09);
    else balance(g, 'e', 'p', 0.35);
  };
  if (secs) g.timer(secs, () => { if (!busy) { busy = true; show(); g.miss(k, why); } });
  g.setTap(async (hit) => {
    if (busy || !hit || !hit.obj.userData.q) return;
    const G = hit.obj;
    if (G.userData.q !== q) { first = false; g.wrong(); shake(G); return; }
    busy = true; if (card) popIn(G, 1.15, 0.35); await show();
    g.right(k, first, why, ask ? 3.4 : 2.4);
  });
}

const PARTS = [
  { key: 'charge', icon: '🏷️', name: 'Symbol & charge', n: CHARGE.length, done: 'e⁻ −1, p⁺ +1, n⁰ no charge.',
    run: (k, g) => round(k, g, CHARGE, k < 6, k >= 6 ? 10 : 0) },
  { key: 'mass', icon: '⚖️', name: 'Mass', n: MASS.length, done: 'Proton and neutron about 1 amu (the neutron a bit more); the electron almost nothing.',
    run: (k, g) => round(k, g, MASS, k < 4, k >= 5 ? 10 : 0) },
  { key: 'speed', icon: '⚡', name: 'Speed', n: SPEED.length, done: 'You know Table 2.1 by heart.',
    run: (k, g) => round(k, g, SPEED, false, k < 6 ? 7 : 5) },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'particles', parts: PARTS, cam: [0, 0.4, 12], target: [0, 0.3, 0] });
}
