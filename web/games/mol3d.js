// Unit 4 3D kit: ball-and-stick molecules, book-style dot-and-cross atoms (a ring + its outer electrons) and ions.
// Same colours as the films: atom A's electrons blue, atom B's gold; CPK atom colours.
import { THREE, ball, ring, ringMat, glow, tween, ease, sleep } from './kit.js';
import { EN } from './u3data.js';

export { EN };
export const CPK = { H: 0xeaf0ff, C: 0x3a3e4c, O: 0xf2403a, N: 0x4d73ff, Cl: 0x5ae66a, F: 0xb3ff8c, S: 0xffd84d, B: 0xff99b3,
  Na: 0xb373ff, Ca: 0xd9d9bf, Mg: 0x8cd959, Br: 0xb33326, K: 0xa066ff, P: 0xff9940, Li: 0xcc80ff };
export const CPK_R = { H: 0.3, C: 0.45, O: 0.44, N: 0.45, Cl: 0.6, F: 0.4, S: 0.58, B: 0.48, Na: 0.55, Br: 0.62, P: 0.56 };
const mats = {};
export const cpkMat = (s) => (mats[s] ||= new THREE.MeshPhysicalMaterial({ color: CPK[s] ?? 0xcccccc, roughness: 0.3, clearcoat: 0.8 }));
export const E_BLUE = new THREE.MeshStandardMaterial({ color: 0xbfe3ff, emissive: 0x4aa8ff, emissiveIntensity: 2.0, roughness: 0.3 });
export const E_GOLD = new THREE.MeshStandardMaterial({ color: 0xffe2b0, emissive: 0xffa53a, emissiveIntensity: 1.8, roughness: 0.3 });
const STICK = new THREE.MeshStandardMaterial({ color: 0xd8dde8, metalness: 0.3, roughness: 0.3 });
const CYL = new THREE.CylinderGeometry(1, 1, 1, 14);

// book Fig 4.18 coordinates (≈ Å)
const bent = (x, ang, L) => { const h = (ang / 2) * Math.PI / 180; return [[x, [-L * Math.sin(h), -L * Math.cos(h), 0]], [x, [L * Math.sin(h), -L * Math.cos(h), 0]]]; };
const T4 = [[1, 1, 1], [-1, -1, 1], [1, -1, -1], [-1, 1, -1]].map((v) => v.map((c) => (c / Math.sqrt(3)) * 1.1));
export const SHAPES = {
  CO2: { atoms: [['C', [0, 0, 0]], ['O', [-1.25, 0, 0]], ['O', [1.25, 0, 0]]], bonds: [[0, 1, 2], [0, 2, 2]], lone: [], angle: '180°', name: 'linear' },
  SO2: { atoms: [['S', [0, 0, 0]], ...bent('O', 119.5, 1.45)], bonds: [[0, 1, 2], [0, 2, 2]], lone: [[0, [0, 1, 0]]], angle: '119.5°', name: 'bent' },
  BF3: { atoms: [['B', [0, 0, 0]], ...[90, 210, 330].map((a) => ['F', [1.5 * Math.cos(a * Math.PI / 180), 1.5 * Math.sin(a * Math.PI / 180), 0]])],
    bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1]], lone: [], angle: '120°', name: 'trigonal planar' },
  H2O: { atoms: [['O', [0, 0, 0]], ...bent('H', 104.5, 1.0)], bonds: [[0, 1, 1], [0, 2, 1]], lone: [[0, [-0.6, 1, 0]], [0, [0.6, 1, 0]]], angle: '104.5°', name: 'bent (angular)' },
  CH4: { atoms: [['C', [0, 0, 0]], ...T4.map((v) => ['H', v])], bonds: [1, 2, 3, 4].map((k) => [0, k, 1]), lone: [], angle: '109.5°', name: 'tetrahedral' },
  NH3: { atoms: [['N', [0, 0, 0]], ...[90, 210, 330].map((a) => ['H', [Math.cos(a * Math.PI / 180), -0.38, Math.sin(a * Math.PI / 180)]])],
    bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1]], lone: [[0, [0, 1, 0]]], angle: '107°', name: 'trigonal pyramidal' },
  HCl: { atoms: [['H', [-0.65, 0, 0]], ['Cl', [0.65, 0, 0]]], bonds: [[0, 1, 1]], lone: [] },
  H2: { atoms: [['H', [-0.37, 0, 0]], ['H', [0.37, 0, 0]]], bonds: [[0, 1, 1]], lone: [] },
  Cl2: { atoms: [['Cl', [-1.0, 0, 0]], ['Cl', [1.0, 0, 0]]], bonds: [[0, 1, 1]], lone: [] },
  O2: { atoms: [['O', [-0.6, 0, 0]], ['O', [0.6, 0, 0]]], bonds: [[0, 1, 2]], lone: [] },
  N2: { atoms: [['N', [-0.55, 0, 0]], ['N', [0.55, 0, 0]]], bonds: [[0, 1, 3]], lone: [] },
  HF: { atoms: [['H', [-0.5, 0, 0]], ['F', [0.5, 0, 0]]], bonds: [[0, 1, 1]], lone: [] },
  C2H4: { atoms: [['C', [-0.67, 0, 0]], ['C', [0.67, 0, 0]], ['H', [-1.25, 0.93, 0]], ['H', [-1.25, -0.93, 0]], ['H', [1.25, 0.93, 0]], ['H', [1.25, -0.93, 0]]],
    bonds: [[0, 1, 2], [0, 2, 1], [0, 3, 1], [1, 4, 1], [1, 5, 1]], lone: [] },
};

/** Ball-and-stick molecule into `parent`. Returns { g, atoms: [mesh], lone: [mesh] }. */
export function molecule(parent, key, { scale = 1, pos = [0, 0, 0] } = {}) {
  const S = SHAPES[key], g = new THREE.Group(); g.position.set(...pos); parent.add(g);
  const atoms = S.atoms.map(([s, p]) => { const m = ball(cpkMat(s), (CPK_R[s] ?? 0.5) * scale); m.position.set(...p).multiplyScalar(scale); m.userData.sym = s; g.add(m); return m; });
  for (const [i, j, order] of S.bonds) {
    const a = atoms[i].position, b = atoms[j].position, d = b.clone().sub(a), L = d.length();
    let side = d.clone().cross(new THREE.Vector3(0, 0, 1)); if (side.length() < 1e-4) side = d.clone().cross(new THREE.Vector3(1, 0, 0));
    side.normalize();
    for (let m = 0; m < order; m++) {
      const c = new THREE.Mesh(CYL, STICK); c.scale.set(0.06 * scale, L, 0.06 * scale);
      c.position.copy(a).add(b).multiplyScalar(0.5).addScaledVector(side, (m - (order - 1) / 2) * 0.17 * scale);
      c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()); g.add(c);
    }
  }
  const lone = [];
  for (const [i, dir] of S.lone) {
    const d = new THREE.Vector3(...dir).normalize(), c = atoms[i].position.clone().addScaledVector(d, ((CPK_R[S.atoms[i][0]] ?? 0.5) + 0.32) * scale);
    let side = d.clone().cross(new THREE.Vector3(0, 0, 1)); if (side.length() < 1e-4) side.set(1, 0, 0); side.normalize();
    for (const s of [-1, 1]) { const e = ball(E_GOLD, 0.09 * scale); e.position.copy(c).addScaledVector(side, 0.12 * s * scale); g.add(e); lone.push(e); }
  }
  return { g, atoms, lone };
}

/** Seat angles (degrees) for n outer electrons: one per side first (top, right, bottom, left), then pairs. */
export function lewisAngles(n) {
  const sides = [90, 0, 270, 180], cnt = [0, 0, 0, 0];
  for (let k = 0; k < n; k++) cnt[k % 4]++;
  return sides.flatMap((s, i) => (cnt[i] === 1 ? [s] : cnt[i] === 2 ? [s - 14, s + 14] : []));
}

/** Dot-and-cross atom: ring + symbol tag + outer electrons (children of g, in the XY plane). */
export function dotAtom(stage, parent, sym, pos, n, { r = 1, gold = false, angles = null } = {}) {
  const g = new THREE.Group(); g.position.set(...pos); parent.add(g);
  const rg = ring(r, ringMat(0x9fc6ff, 0.55), 0.025); g.add(rg);
  const core = new THREE.Object3D(); g.add(core);
  const tag = stage.tag(`<b>${sym}</b>`, core, [0, 0, 0], 'big');
  const dots = (angles ?? lewisAngles(n)).map((a) => {
    const e = ball(gold ? E_GOLD : E_BLUE, 0.12); e.position.set(r * Math.cos(a * Math.PI / 180), r * Math.sin(a * Math.PI / 180), 0.03);
    e.userData.home = e.position.clone(); g.add(e); return e;
  });
  return { g, ring: rg, dots, tag, r, sym };
}

/** Slide a dot (child of atom A.g) to a world point, staying a child of A. */
export function seat(A, e, world, dur = 0.6) {
  const to = A.g.worldToLocal(world.clone()), from = e.position.clone();
  return tween(dur, (t) => e.position.lerpVectors(from, to, t), ease.inOut);
}

/** Move a dot from atom A to atom B's seat at angle `ang` (an ionic handover), re-parenting it to B. */
export async function hand(A, B, e, ang, dur = 0.9) {
  const w0 = e.getWorldPosition(new THREE.Vector3());
  B.g.attach(e);
  const to = new THREE.Vector3(B.r * Math.cos(ang * Math.PI / 180), B.r * Math.sin(ang * Math.PI / 180), 0.03);
  const from = B.g.worldToLocal(w0.clone()), mid = from.clone().add(to).multiplyScalar(0.5).add(new THREE.Vector3(0, 1.2, 0.4));
  await tween(dur, (t) => { const u = 1 - t; e.position.set(u * u * from.x + 2 * u * t * mid.x + t * t * to.x, u * u * from.y + 2 * u * t * mid.y + t * t * to.y, u * u * from.z + 2 * u * t * mid.z + t * t * to.z); }, ease.inOut);
  A.dots.splice(A.dots.indexOf(e), 1); B.dots.push(e);
}

/** A soft ring flash around a group (green = full shell ✓). */
export async function flash(g, r, color = 0x4dff88) {
  const f = ring(r, ringMat(color, 0.9), 0.05); g.add(f);
  await tween(0.6, (t) => { f.scale.setScalar(1 + 0.25 * t); f.material.opacity = 0.9 * (1 - t); }, ease.out);
  g.remove(f);
}

/** An ion: a glowing ball with its charge written on it. */
export function ionBall(stage, parent, txt, pos, plus, r = 0.7) {
  const m = ball(new THREE.MeshStandardMaterial({ color: plus ? 0xb380ff : 0x66f27f, emissive: plus ? 0x5a30a0 : 0x1f7a33, roughness: 0.35 }), r);
  m.position.set(...pos); parent.add(m); m.add(glow(plus ? 0xb380ff : 0x66f27f, 3, 0.35));
  stage.tag(`<b>${txt}</b>`, m, [0, 0, 0], 'big');
  return m;
}

/** Electronegativity-difference ruler: 0 … 3.3, cuts at 0.5 and 1.7. marker(v) slides the ball there. */
export function enRuler(stage, parent, y = -3.2, w = 9) {
  const g = new THREE.Group(); g.position.y = y; parent.add(g);
  const X = (v) => -w / 2 + (v / 3.3) * w;
  const bar = new THREE.Mesh(new THREE.BoxGeometry(w, 0.12, 0.12), new THREE.MeshStandardMaterial({ color: 0x8a93a8, roughness: 0.5 })); g.add(bar);
  for (const v of [0.5, 1.7]) {
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.6, 0.1), new THREE.MeshStandardMaterial({ color: 0xffb347, emissive: 0x8a5a10 }));
    c.position.x = X(v); g.add(c);
    stage.tag(String(v), c, [0, -0.6, 0], 'big gold');
  }
  const mk = ball(new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x777777 }), 0.2); mk.position.x = X(0); g.add(mk);
  return { g, X, async marker(v) { const x0 = mk.position.x; await tween(0.9, (t) => (mk.position.x = x0 + (X(v) - x0) * t), ease.inOut); } };
}

export const spinY = (stage, g, k = 0.4) => { const f = (dt) => (g.rotation.y += k * (dt ?? 0.016)); stage.onFrame(f); return f; };
export { sleep };
