// Unit 8 3D kit (Chemical Reactivity): glossy metal lumps, a water trough, coloured flames, fizz bubbles, gas jars
// (Fig 8.5 colours), litmus strips. Same look as the films: dark studio, glowing gold for what matters.
import { THREE, ball, glow, emissive, tween, ease, popIn } from './kit.js';
import { WATER, edgeBox, jar } from './gas3d.js';

const metal = (c, rough = 0.25) => new THREE.MeshPhysicalMaterial({ color: c, metalness: 0.95, roughness: rough, clearcoat: 0.4 });
export const LUMP = {
  Li: metal(0xc9ccd4), Na: metal(0xd8dbe2), K: metal(0xc4c9d6), Mg: metal(0xe2e4ea, 0.3), Ca: metal(0xd9d6c8, 0.35),
  Fe: metal(0x6b6e75, 0.5), Cu: metal(0xd9733f, 0.3), Au: metal(0xffc94d, 0.15), Ag: metal(0xe8eaf2, 0.12), Pt: metal(0xd6d9df, 0.2),
};
export const FLAME = { Li: 0xff2a3c, Na: 0xffc21a, K: 0xc77dff, Mg: 0xffffff, Ca: 0xff5a2a };   // book: red, yellow, lilac, dazzling white, brick red
/** A soft-cornered metal lump (a small cut block). */
export function lump(parent, sym, pos = [0, 0, 0], s = 0.7) {
  const g = new THREE.Group();
  const m = new THREE.Mesh(new THREE.BoxGeometry(s, s * 0.7, s * 0.8, 2, 2, 2), LUMP[sym] || metal(0xbbbbbb));
  m.geometry.attributes.position.array.forEach((v, i, a) => { a[i] = v * (1 - 0.08 * Math.random()); });
  m.geometry.computeVertexNormals();
  g.add(m); g.position.set(...pos); parent.add(g); g.userData.m = m; return g;
}
/** Water trough (open glass box with water). */
export function trough(parent, pos = [0, -1.6, 0], w = 4.2, h = 1.4) {
  const g = new THREE.Group(); g.position.set(...pos); parent.add(g);
  const t = edgeBox(w, h, 1.6, { open: true }); t.position.y = h / 2; g.add(t);
  const water = new THREE.Mesh(new THREE.BoxGeometry(w - 0.08, h * 0.75, 1.5), WATER); water.position.y = h * 0.375; g.add(water);
  g.userData.top = h * 0.75; return g;
}
/** A flame of a colour around an object: flickering glow sprites. Returns tick(dt). */
export function flame(parent, color, pos = [0, 0, 0], size = 1.4) {
  const g = new THREE.Group(); g.position.set(...pos); parent.add(g);
  const sp = Array.from({ length: 7 }, (_, k) => { const s = glow(color, size * (0.5 + 0.12 * k), 0.75); g.add(s); return s; });
  const core = glow(0xffffff, size * 0.45, 0.6); g.add(core);
  let t = Math.random() * 10;
  const tick = (dt = 0.016) => { t += dt;
    sp.forEach((s, k) => { s.position.set(Math.sin(t * 5 + k) * 0.08 * size, (k / 7) * size * 0.9 + Math.sin(t * 9 + k * 2) * 0.05, 0);
      s.material.opacity = 0.45 + 0.3 * Math.sin(t * 11 + k); }); };
  popIn(g, 1, 0.5); return { g, tick };
}
/** Fizz: bubbles rising from an object (rate per second, height). Returns tick(dt). */
export function fizz(parent, from, { rate = 12, height = 1.0, r = 0.06 } = {}) {
  const mat = new THREE.MeshStandardMaterial({ color: 0xeaf6ff, transparent: true, opacity: 0.7, roughness: 0.1 });
  const live = []; let acc = 0;
  return (dt = 0.016) => {
    acc += dt * rate;
    while (acc > 1) { acc--; const b = ball(mat, r * (0.6 + Math.random() * 0.8));
      b.position.copy(from.position).add(new THREE.Vector3((Math.random() - 0.5) * 0.6, 0, (Math.random() - 0.5) * 0.3));
      parent.add(b); live.push({ b, y0: b.position.y }); }
    for (let i = live.length - 1; i >= 0; i--) { const q = live[i]; q.b.position.y += dt * 1.6;
      if (q.b.position.y - q.y0 > height) { parent.remove(q.b); live.splice(i, 1); } }
  };
}
/** A gas jar with a coloured gas / liquid / solid inside (Fig 8.5): kind = 'gas' | 'liquid' | 'solid'. */
export function gasJar(parent, color, kind = 'gas', pos = [0, -1.6, 0]) {
  const J = jar(0.85, 2.4); J.position.set(...pos); parent.add(J);
  if (kind === 'gas') { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 2.2, 28),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6, depthWrite: false })); m.position.y = 1.15; J.add(m);
    const gl = glow(color, 2.6, 0.35); gl.position.y = 1.15; J.add(gl); }
  else if (kind === 'liquid') { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 0.6, 28), new THREE.MeshPhysicalMaterial({ color, roughness: 0.15, transmission: 0.2 }));
    m.position.y = 0.35; J.add(m); const v = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 1.5, 28),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.18, depthWrite: false })); v.position.y = 1.4; J.add(v); }
  else { for (let k = 0; k < 9; k++) { const c = new THREE.Mesh(new THREE.OctahedronGeometry(0.16), new THREE.MeshPhysicalMaterial({ color: 0x1b1b24, metalness: 0.6, roughness: 0.2 }));
      c.position.set((k % 3 - 1) * 0.36, 0.18 + Math.floor(k / 3) * 0.05, (Math.floor(k / 3) - 1) * 0.3); J.add(c); }
    const v = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 1.7, 28), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.2, depthWrite: false }));
    v.position.y = 1.3; J.add(v); }
  popIn(J, 1, 0.4); return J;
}
/** A litmus strip: colour 'red' | 'blue'; turn(to) changes it slowly. */
export function litmus(parent, colour, pos = [0, 0, 0]) {
  const C = { red: new THREE.Color(0xe0303c), blue: new THREE.Color(0x2f6bff) };
  const mat = new THREE.MeshStandardMaterial({ color: C[colour].clone(), roughness: 0.8 });
  const m = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.6, 0.04), mat); m.position.set(...pos); parent.add(m);
  m.userData.turn = (to) => { const a = mat.color.clone(); return tween(1.2, (t) => mat.color.copy(a).lerp(C[to], t), ease.inOut); };
  return m;
}
export { emissive };
