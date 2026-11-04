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

/** a digital kitchen/lab scale (bottom at y 0, pan top at y ≈ 0.05): userData.set(text) shows the reading */
export function digitalScale() {
  const g = new THREE.Group(), body = K.solid(new THREE.BoxGeometry(0.22, 0.035, 0.2), K.M.gloss(0xe9e7e2)); body.position.y = 0.0175; g.add(body);
  const pan = K.solid(new THREE.CylinderGeometry(0.085, 0.085, 0.01, 40), K.M.metal(0xc8ccd2, 0.25)); pan.position.y = 0.035 + 0.004 + 0.005; g.add(pan);
  const c = document.createElement('canvas'); c.width = 256; c.height = 96; const x = c.getContext('2d'), tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.11, 0.04), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); scr.position.set(0, 0.0175, 0.1 + 0.002); g.add(scr);
  let last = null; g.userData.set = (s) => { if (s === last) return; last = s; x.fillStyle = '#1b2a1f'; x.fillRect(0, 0, 256, 96); x.fillStyle = '#9dff9d'; x.font = '700 52px monospace'; x.textAlign = 'right'; x.textBaseline = 'middle'; x.fillText(s, 240, 50); tex.needsUpdate = true; };
  g.userData.set('0.0 g'); g.userData.top = 0.049; return g;
}
/** a thin falling stream of liquid from a to b (world points); set(a, b, k) k = 0 hides it */
export function stream(color = 0x3d9ee6) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.004, 1, 10, 1, true), new THREE.MeshPhysicalMaterial({ color, transparent: true, opacity: 0.6, roughness: 0.05, depthWrite: false }));
  m.renderOrder = 4; m.visible = false; m.userData.set = (a, b, k) => { m.visible = k > 0.01; if (!m.visible) return; const d = b.clone().sub(a); m.position.copy(a).lerp(b, 0.5); m.scale.set(k, d.length(), k); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); };
  return m;
}
/** a volumetric flask (bottom at y 0) with a white mark ring on the neck; liquid set by setLevel(y) (top height) */
export function volFlask(r = 0.075, color = 0x3d9ee6) {
  const g = new THREE.Group(), n = 0.016, nb = r * 1.7, top = nb + 0.17;
  const prof = [[0, 0], [r * 0.7, 0], [r, r * 0.6], [r, r * 1.1], [n + 0.003, nb], [n + 0.003, top], [n - 0.002, top], [n - 0.002, nb + 0.003], [r - 0.004, r * 1.1], [r - 0.004, r * 0.6], [r * 0.7 - 0.003, 0.006], [0, 0.006]].map(([x, y]) => new THREE.Vector2(x, y));
  const glass = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), K.M.glass()); glass.renderOrder = 5; g.add(glass);
  const mark = new THREE.Mesh(new THREE.TorusGeometry(n + 0.0045, 0.0012, 4, 30), new THREE.MeshBasicMaterial({ color: 0xffffff })); mark.rotation.x = Math.PI / 2; mark.position.y = nb + 0.1; g.add(mark);
  const lm = new THREE.MeshPhysicalMaterial({ color, transparent: true, opacity: 0.5, roughness: 0.05, depthWrite: false });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(r - 0.007, 32, 20), lm); bulb.scale.y = 0.95; bulb.position.y = r * 0.82; bulb.renderOrder = 4; g.add(bulb);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(n - 0.004, n - 0.004, 1, 16).translate(0, 0.5, 0), lm); neck.position.y = nb - 0.01; neck.renderOrder = 4; g.add(neck);
  g.userData.setLevel = (k) => { bulb.visible = k > 0.01; bulb.scale.set(1, 0.95 * Math.min(1, k * 1.6), 1); bulb.position.y = r * 0.82 - (r * 0.82) * (1 - Math.min(1, k * 1.6)) * 0.9; neck.visible = k > 0.62; neck.scale.y = Math.max(1e-3, (k - 0.62) / 0.38 * 0.11); };
  g.userData.mat = lm; g.userData.mark = nb + 0.1; g.userData.setLevel(0); return g;
}

/** a graduated measuring cylinder (bottom at y 0) of `cap` cm³: a foot, a tall glass tube with marks every cap/10 and
 *  number labels at 50 and cap; userData.set(v, color) fills it to v cm³; userData.y(v) = height of a reading */
export function gradCylinder(cap = 100, r = 0.035, h = 0.34) {
  const g = new THREE.Group(), y0 = 0.02, k = (h - 0.04) / cap;
  const foot = K.solid(new THREE.CylinderGeometry(0.055, 0.06, 0.016, 6), K.M.glass()); foot.position.y = 0.008; foot.renderOrder = 5; g.add(foot);
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 32, 1, true), K.M.glass()); tube.position.y = 0.016 + h / 2; tube.renderOrder = 5; g.add(tube);
  for (let v = cap / 10; v <= cap; v += cap / 10) { const tk = new THREE.Mesh(new THREE.BoxGeometry(v % (cap / 2) ? 0.012 : 0.022, 0.0025, 0.002), new THREE.MeshBasicMaterial({ color: 0xffffff })); tk.position.set(-r * 0.4, y0 + v * k, r + 0.003); g.add(tk); }
  const lm = new THREE.MeshPhysicalMaterial({ color: 0x3d9ee6, transparent: true, opacity: 0.5, roughness: 0.05, depthWrite: false });
  const liq = new THREE.Mesh(new THREE.CylinderGeometry(r - 0.004, r - 0.004, 1, 24).translate(0, 0.5, 0), lm); liq.position.y = y0; liq.renderOrder = 4; g.add(liq);
  g.userData.set = (v, c) => { liq.visible = v > 0.2; liq.scale.y = Math.max(1e-3, v * k); if (c !== undefined) lm.color.set(c); };
  g.userData.y = (v) => y0 + v * k; g.userData.top = 0.016 + h; g.userData.set(0); return g;
}
/** pour: a vessel group lifts from `home`, tilts over `to` (world), a stream runs, then it goes back.
 *  over `to` (where the vessel's base goes), the stream falls from its lip (local) into `mouth` (world).
 *  Returns update(t, t0) → the pouring fraction 0..1 (for the levels) */
export function pourer(vessel, home, to, mouth, lip, s, { dur = 1.6, tilt = 1.6, side = 1 } = {}) {
  // where the vessel's base must be so that its tilted lip sits just above the mouth
  const a = side * tilt, rl = V(lip.x * Math.cos(a) - lip.y * Math.sin(a), lip.x * Math.sin(a) + lip.y * Math.cos(a), lip.z);
  to = mouth.clone().sub(rl).add(V(0, 0.13, 0));
  return (t, t0) => {
    const up = K.ease(K.span(t, t0, t0 + 0.7)), tl = K.ease(K.span(t, t0 + 0.7, t0 + 1.2)) * (1 - K.ease(K.span(t, t0 + 1.2 + dur, t0 + 1.7 + dur))), dn = K.ease(K.span(t, t0 + 1.7 + dur, t0 + 2.4 + dur));
    vessel.position.copy(K.arc(home, to, 0.08, up - dn)); vessel.rotation.z = side * tilt * tl;
    const a = vessel.localToWorld(lip.clone()); s.userData.set(a, mouth, tl > 0.6 ? 1 : 0);
    return K.span(t, t0 + 1.2, t0 + 1.2 + dur);
  };
}
