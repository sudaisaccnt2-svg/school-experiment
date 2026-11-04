// Chapter 5 (Physical States of Matter) shared lesson tools: molecules that shake (solid), slide (liquid) or fly
// (gas), as a PURE function of time so the player can seek anywhere and every frame is right. One instanced mesh per
// swarm (fast on phones). Lessons still use u4kit's lessonKit (stages, labels, shots).
import * as THREE from 'three';
import * as K from './kit.js';
const { M } = K;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

/** fold x back and forth inside [a, b] (a ball bouncing between two walls) */
export const fold = (x, a, b) => { const L = b - a, m = ((x - a) % (2 * L) + 2 * L) % (2 * L); return a + (m < L ? m : 2 * L - m); };
/** a tiny repeatable random number from i and k */
export const rnd = (i, k = 0) => { const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return s - Math.floor(s); };

/** a swarm of n molecule balls in a box (w × h × d, floor at y = -h/2 of its group).
 *  place(t, f) sets each ball from f(i, t) → Vector3 (local). solid / liquid / gas give the three pictures:
 *  solid: a lattice shaking in place · liquid: close together on the floor, sliding · gas: far apart, flying, bouncing. */
export function swarm(n, { r = 0.07, color = 0x59a8ff, w = 2, h = 1.6, d = 1, gap = 0.2, speed = 1.0, glow = 0.6 } = {}) {
  const geo = new THREE.SphereGeometry(r, 18, 12);
  const mat = new THREE.MeshPhysicalMaterial({ color, roughness: 0.25, clearcoat: 1, emissive: color, emissiveIntensity: glow * 0.35 });
  const mesh = new THREE.InstancedMesh(geo, mat, n); mesh.frustumCulled = false;
  const g = new THREE.Group(); g.add(mesh);
  const side = Math.ceil(Math.cbrt(n)), dum = new THREE.Object3D();
  const lat = Array.from({ length: n }, (_, i) => V((i % side) - (side - 1) / 2, Math.floor(i / (side * side)), (Math.floor(i / side) % side) - (side - 1) / 2).multiplyScalar(gap).add(V(0, -h / 2 + r + 0.01, 0)));
  const lq = lat.map((p, i) => p.clone().add(V((rnd(i, 1) - 0.5) * gap * 0.7, (rnd(i, 2) - 0.5) * gap * 0.3, (rnd(i, 3) - 0.5) * gap * 0.7)).setY(Math.max(-h / 2 + r + 0.01, p.y - gap * 0.15)));
  const g0 = lat.map((_, i) => V(rnd(i, 4) * w, rnd(i, 5) * h, rnd(i, 6) * d)), vel = lat.map((_, i) => V(rnd(i, 7) - 0.5, rnd(i, 8) - 0.5, rnd(i, 9) - 0.5).normalize().multiplyScalar(speed * (0.7 + 0.6 * rnd(i, 10))));
  const api = {
    g, mesh, n, r, w, h, d,
    solid: (i, t, k = 1) => lat[i].clone().add(V(Math.sin(t * 23 + i), Math.sin(t * 19 + 2 * i), Math.sin(t * 21 + 3 * i)).multiplyScalar(0.012 * k)),
    liquid: (i, t) => lq[i].clone().add(V(Math.sin(t * 0.9 + i * 1.7) * gap * 0.35, Math.sin(t * 1.3 + i) * gap * 0.06, Math.cos(t * 0.8 + i * 2.3) * gap * 0.35)),
    /** inside a box of half sizes (hx, hy, hz) at c (default: this box) */
    gas: (i, t, c = V(0, 0, 0), hx = w / 2, hy = h / 2, hz = d / 2, sp = 1) => V(
      fold(g0[i].x + vel[i].x * t * sp, -hx + r, hx - r), fold(g0[i].y + vel[i].y * t * sp, -hy + r, hy - r), fold(g0[i].z + vel[i].z * t * sp, -hz + r, hz - r)).add(c),
    /** gas inside a ball of radius R at c (a round flask): the cube folds into the ball */
    ball: (i, t, c, R, sp = 1) => { const p = api.gas(i, t, V(0, 0, 0), R, R, R, sp), m = Math.max(Math.abs(p.x), Math.abs(p.y), Math.abs(p.z)), l = p.length(); return (l > 1e-6 ? p.multiplyScalar(m / l) : p).add(c); },
    place(t, f) { for (let i = 0; i < n; i++) { dum.position.copy(f(i, t)); dum.updateMatrix(); mesh.setMatrixAt(i, dum.matrix); } mesh.instanceMatrix.needsUpdate = true; },
  };
  return api;
}

/** a glass box drawn by its edges (+ a faint body): w × h × d, centred on its group */
export function glassBox(w, h, d, color = 0x9fc4ff) {
  const g = new THREE.Group();
  const e = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.75 }));
  const body = new THREE.Mesh(new THREE.BoxGeometry(w - 0.004, h - 0.004, d - 0.004), new THREE.MeshPhysicalMaterial({ color, transparent: true, opacity: 0.06, roughness: 0.1, depthWrite: false, side: THREE.BackSide }));
  g.add(e, body); g.userData.edges = e; return g;
}
/** a round glass flask (ball of radius R) drawn as a faint sphere with a bright rim ring */
export function glassBall(R, color = 0x9fc4ff) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(R, 40, 24), new THREE.MeshPhysicalMaterial({ color, transparent: true, opacity: 0.08, roughness: 0.1, depthWrite: false, side: THREE.BackSide }));
  const rim = new THREE.Mesh(new THREE.TorusGeometry(R, 0.008, 6, 96), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.75, toneMapped: false }));
  g.add(body, rim); g.userData.rim = rim; return g;
}
export { V };

/** a sealed plastic bag with three onions inside (bottom at y 0): onions = purple-red bulbs with a pointed top and
 *  thin stripes; the bag = a clear, slightly crinkled skin round them, twisted at the neck and tied. */
export function onionBag(s = 1) {
  const g = new THREE.Group();
  const prof = []; for (let i = 0; i <= 20; i++) { const u = i / 20, a = u * Math.PI; prof.push(new THREE.Vector2(Math.max(0.002, Math.sin(a) * (1 - 0.55 * u * u) * 0.05), -Math.cos(a) * 0.045 + 0.045 + (u > 0.8 ? (u - 0.8) * 0.12 : 0))); }
  const onM = new THREE.MeshPhysicalMaterial({ color: 0x9a3352, roughness: 0.35, clearcoat: 0.6, sheen: 0.5, sheenColor: new THREE.Color(0xffc0d0) });
  [[-0.045, 0, 0.02, 0.2], [0.05, 0, -0.01, -0.3], [0.0, 0.07, 0.0, 0.6]].forEach(([x, y, z, r]) => { const o = K.solid(new THREE.LatheGeometry(prof, 24), onM); o.position.set(x, y + 0.002, z); o.rotation.z = r * 0.3; o.rotation.y = r; g.add(o); });
  const bp = []; for (let i = 0; i <= 26; i++) { const u = i / 26; const r = u < 0.75 ? Math.sin(Math.min(1, u / 0.75) * Math.PI * 0.5 + 0.0001) * 0.11 * (1 - 0.25 * Math.max(0, (u - 0.45) / 0.3) ** 2) : 0.11 * 0.75 * (1 - (u - 0.75) / 0.25) * 0.4 + 0.008; bp.push(new THREE.Vector2(Math.max(0.004, r * (1 + 0.04 * Math.sin(i * 2.3))), u * 0.26)); }
  const bag = new THREE.Mesh(new THREE.LatheGeometry(bp, 40), new THREE.MeshPhysicalMaterial({ color: 0xeef4fa, transparent: true, opacity: 0.22, roughness: 0.15, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false }));
  bag.renderOrder = 6; g.add(bag);
  const tie = K.solid(new THREE.TorusGeometry(0.014, 0.004, 8, 20), K.M.matte(0xd8b040)); tie.rotation.x = Math.PI / 2; tie.position.y = 0.205; g.add(tie);
  g.scale.setScalar(s); return g;
}
