// Chapter 6 (Solutions) shared lesson tools: a solute crystal that dissolves into a solvent (molecule picture, a pure
// function of time like u5kit), a sugar heap in a beaker that shrinks as it dissolves, a brass key, a stirring rod.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U5 from './u5kit.js';
const V = (x, y, z) => new THREE.Vector3(x, y, z);
export { V };

/** a dissolving picture in a box w × h × d (centre at 0): `ns` solvent balls (blue, sliding) and `nu` solute balls
 *  (gold) that start packed in a crystal at `from` and spread through the liquid as u goes 0 → 1.
 *  place(t, u) moves them all. Returns { g, place, solvent, solute } (both are u5kit swarms). */
export function dissolver({ w = 2.4, h = 1.4, d = 0.8, ns = 40, nu = 12, rs = 0.065, ru = 0.07, from = V(0, -0.45, 0), cs = 0x59a8ff, cu = 0xffc04d } = {}) {
  const g = new THREE.Group(), sv = U5.swarm(ns, { r: rs, color: cs, w, h, d, glow: 0.25 }), su = U5.swarm(nu, { r: ru, color: cu, w, h, d });
  g.add(sv.g, su.g);
  const cols = Math.ceil(Math.sqrt(ns * w / h)), rows = Math.ceil(ns / cols);
  const SP = Array.from({ length: ns }, (_, i) => V(-w / 2 + 0.12 + (i % cols) * (w - 0.24) / Math.max(1, cols - 1), -h / 2 + 0.12 + Math.floor(i / cols) * (h - 0.24) / Math.max(1, rows - 1), (U5.rnd(i, 7) - 0.5) * (d - 0.2)));
  const side = Math.ceil(Math.cbrt(nu)), CR = Array.from({ length: nu }, (_, i) => V((i % side) - (side - 1) / 2, Math.floor(i / (side * side)), (Math.floor(i / side) % side) - (side - 1) / 2).multiplyScalar(ru * 2.05).add(from));
  const END = Array.from({ length: nu }, (_, i) => V((U5.rnd(i, 1) - 0.5) * (w - 0.3), (U5.rnd(i, 2) - 0.5) * (h - 0.3), (U5.rnd(i, 3) - 0.5) * (d - 0.25)));
  const place = (t, u) => {
    sv.place(t, (i) => SP[i].clone().add(V(Math.sin(t * 0.9 + i * 1.7) * 0.05, Math.sin(t * 1.3 + i) * 0.04, Math.cos(t * 0.8 + i * 2.3) * 0.04)));
    su.place(t, (i) => { const k = K.ease(K.span(u, (i / nu) * 0.5, (i / nu) * 0.5 + 0.5)); return CR[i].clone().lerp(END[i], k).add(V(Math.sin(t * 1.1 + i) * 0.04 * k, Math.cos(t * 0.9 + i) * 0.04 * k, 0)); });
  };
  return { g, place, solvent: sv, solute: su };
}
/** a heap of white crystals (sugar or salt) that can sit in a beaker and shrink as it dissolves: set(k) 1 = all, 0 = gone */
export function crystalHeap(r = 0.05, n = 60, color = 0xf6f5f1) {
  const g = new THREE.Group(), m = new THREE.InstancedMesh(new THREE.BoxGeometry(0.01, 0.01, 0.01), new THREE.MeshPhysicalMaterial({ color, roughness: 0.35, clearcoat: 0.6 }), n), dm = new THREE.Object3D();
  const P = Array.from({ length: n }, (_, i) => { const a = i * 2.4, rr = r * Math.sqrt(U5.rnd(i, 1)), y = 0.005 + (r - rr) * 0.5 * U5.rnd(i, 2); return V(Math.cos(a) * rr, y, Math.sin(a) * rr); });
  g.add(m); m.frustumCulled = false;
  g.userData.set = (k) => { const c = Math.round(n * k); for (let i = 0; i < n; i++) { dm.position.copy(P[i]); dm.rotation.set(i, i * 2, 0); dm.scale.setScalar(i < c ? 1 : 1e-3); dm.updateMatrix(); m.setMatrixAt(i, dm.matrix); } m.instanceMatrix.needsUpdate = true; };
  g.userData.set(1); return g;
}
/** a brass key (an alloy: a solid solution), lying flat, bottom at y 0 */
export function brassKey(s = 1) {
  const sh = new THREE.Shape(); sh.absarc(0, 0, 0.03, 0, Math.PI * 2, false); const hole = new THREE.Path(); hole.absarc(0, 0, 0.012, 0, Math.PI * 2, true); sh.holes.push(hole);
  const bow = K.solid(new THREE.ExtrudeGeometry(sh, { depth: 0.006, bevelEnabled: false }), K.M.metal(0xd8b04a, 0.3)); bow.rotation.x = -Math.PI / 2;
  const shaft = K.solid(new THREE.BoxGeometry(0.09, 0.006, 0.012), K.M.metal(0xd8b04a, 0.3)); shaft.position.set(0.075, 0.003, 0);
  const teeth = [0.09, 0.105].map((x) => { const b = K.solid(new THREE.BoxGeometry(0.008, 0.006, 0.014), K.M.metal(0xd8b04a, 0.3)); b.position.set(x, 0.003 - 0.0001 * x, 0.012); return b; });
  const g = new THREE.Group(); g.add(bow, shaft, ...teeth); g.scale.setScalar(s); return g;
}
/** a glass stirring rod (bottom at y 0) */
export function stirRod(len = 0.3) { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, len, 12), K.M.glass()); m.position.y = len / 2; m.renderOrder = 5; const g = new THREE.Group(); g.add(m); return g; }
