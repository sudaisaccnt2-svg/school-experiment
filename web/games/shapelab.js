// Shape Lab (Unit 4, Fig 4.18): a molecule turns in 3D. Easy → hard (SKILL):
//   🔷 Shapes  name the shape (first level: its bond angle is written under it; then without)
//   📐 Angles  which bond angle? (180°, 120°, 119.5°, 109.5°, 107°, 104.5°)
//   ⚖️ Polar   is the whole molecule polar? First level: an arrow shows each bond's pull (do they cancel?); then
//              without arrows. CO₂ has polar bonds but the pulls cancel: non-polar (Short Q vii).
import { THREE, popIn } from './kit.js';
import { runGame, choose, shuffle, arrow3d } from './rounds.js';
import { molecule, SHAPES, EN } from './mol3d.js';

const KEYS = ['CO2', 'H2O', 'BF3', 'CH4', 'NH3', 'SO2'];
const F = { CO2: 'CO₂', H2O: 'H₂O', BF3: 'BF₃', CH4: 'CH₄', NH3: 'NH₃', SO2: 'SO₂' };
const NAME = { CO2: 'linear', H2O: 'bent', BF3: 'trigonal planar', CH4: 'tetrahedral', NH3: 'trigonal pyramidal', SO2: 'bent' };
const POLAR = { CO2: false, H2O: true, BF3: false, CH4: false, NH3: true, SO2: true };
const SHAPE_NAMES = ['linear', 'bent', 'trigonal planar', 'tetrahedral', 'trigonal pyramidal'];
const ANGLES = KEYS.map((k) => SHAPES[k].angle);
const twice = () => shuffle(KEYS).concat(shuffle(KEYS));
const SH = twice(), AN = twice(), PO = twice();

function model(g, key) {
  const G = new THREE.Group(); G.position.y = 1.25; g.stage.root.add(G);
  const mol = molecule(G, key, { scale: 1.3 }); popIn(mol.g, 1, 0.45);
  mol.g.rotation.x = key === 'CH4' ? 0.3 : 0.15;
  g.onFrame((dt) => (mol.g.rotation.y += 0.35 * (dt ?? 0.016)));
  g.stage.tag(`<b>${F[key]}</b>`, G, [0, 1.5, 0], 'huge');
  return { G, mol };
}
function pulls(mol, key) {                  // an arrow along each bond toward the atom that pulls harder (δ−)
  const S = SHAPES[key];
  for (const [ci, oi] of S.bonds) {
    const A = mol.atoms[ci], O = mol.atoms[oi], toO = EN[O.userData.sym] > EN[A.userData.sym];
    const from = (toO ? A : O).position, to = (toO ? O : A).position, d = to.clone().sub(from).normalize();
    const mid = from.clone().add(to).multiplyScalar(0.5), off = new THREE.Vector3(0, 0, 1.0);
    mol.g.add(arrow3d(mid.clone().addScaledVector(d, -0.55).add(off), mid.clone().addScaledVector(d, 0.65).add(off), 0xffb347, 0.06));
  }
}
function shapes(k, g) {
  const key = SH[k], { G } = model(g, key);
  if (k < 6) g.stage.tag(`<b>${SHAPES[key].angle}</b>`, G, [2.4, 0, 0], 'huge gold');
  g.goal('What shape?', k);
  choose(g, k, SHAPE_NAMES, NAME[key], { w: 2.9, h: 0.7, size: 0.4, y: -2.1, why: `${F[key]}: ${NAME[key]}, ${SHAPES[key].angle}` });
}
function angles(k, g) {
  const key = AN[k]; model(g, key);
  const want = SHAPES[key].angle, opts = [want, ...shuffle(ANGLES.filter((a) => a !== want)).slice(0, 3)];
  g.goal('Which bond angle?', k);
  choose(g, k, opts, want, { w: 1.6, size: 0.5, why: `${F[key]}: ${want} (${NAME[key]})` });
}
function polar(k, g) {
  const key = PO[k], { mol } = model(g, key);
  if (k < 6) pulls(mol, key);
  const want = POLAR[key] ? 'polar' : 'non-polar';
  g.goal('Is the whole molecule polar?', k);
  choose(g, k, ['polar', 'non-polar'], want, { w: 2.4, size: 0.45,
    why: POLAR[key] ? `${F[key]}: the pulls add up one way → polar` : `${F[key]}: the pulls cancel → non-polar`,
    onReveal: () => k >= 6 && pulls(mol, key) });
}
function explore(k, g) {                   // 🔍 Explore: every molecule with its shape, angle and polarity; nothing to get wrong
  const key = KEYS[k], { G, mol } = model(g, key); pulls(mol, key);
  g.stage.tag(`<b>${NAME[key]} · ${SHAPES[key].angle}</b>`, G, [0, -2.0, 0], 'big gold');
  g.goal(`${F[key]}: ${POLAR[key] ? 'polar' : 'non-polar'}`, k); g.setTap(() => g.right(k, true, `${F[key]}: ${NAME[key]}, ${SHAPES[key].angle}`, 0, false));
}
const PARTS = [
  { key: 'explore', icon: '🔍', name: 'Explore', n: KEYS.length, run: explore },
  { key: 'shape', icon: '🔷', name: 'Shapes', n: SH.length, steps: [6], run: shapes },
  { key: 'angle', icon: '📐', name: 'Angles', n: AN.length, steps: [6], run: angles },
  { key: 'polar', icon: '⚖️', name: 'Polar', n: PO.length, steps: [6], run: polar },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'shapelab', parts: PARTS, cam: [0, 0.4, 13.5], target: [0, 0.2, 0], excite: true });
}
