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

/** a plastic syringe standing upright on its sealed tip (bottom of the cap at y 0), length L: a clear barrel with
 *  printed rings, a dark rubber piston on a white rod with a thumb plate. userData.set(u): 0 = drawn out, 1 = pushed in
 *  (the piston slides down to `stop` of the way); userData.top = local y of the thumb plate (for a weight to sit on). */
export function syringe(L = 0.36, r = 0.045, stop = 0.55) {
  const g = new THREE.Group(), y0 = 0.045, bar = L * 0.8;
  const cap = K.solid(new THREE.CylinderGeometry(0.012, 0.016, 0.03, 16), K.M.matte(0xd84a3a, 0.5)); cap.position.y = 0.015; g.add(cap);
  const nose = K.solid(new THREE.CylinderGeometry(0.01, 0.014, 0.022, 16, 1, true), K.M.gloss(0xeef4fa)); nose.position.y = 0.035; g.add(nose);
  const prof = [[0.012, y0 - 0.006], [r, y0], [r, y0 + bar], [r + 0.03, y0 + bar], [r + 0.03, y0 + bar + 0.008], [r - 0.004, y0 + bar + 0.008], [r - 0.004, y0 + 0.004], [0.012, y0 + 0.001]].map(([x, y]) => new THREE.Vector2(x, y));
  const barrel = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), new THREE.MeshPhysicalMaterial({ color: 0xf4f8fc, transparent: true, opacity: 0.3, roughness: 0.15, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false }));
  barrel.renderOrder = 6; g.add(barrel);
  for (let k = 1; k < 8; k++) { const m = new THREE.Mesh(new THREE.TorusGeometry(r + 0.0015, 0.0012, 4, 40), new THREE.MeshBasicMaterial({ color: 0x2a3040 })); m.rotation.x = Math.PI / 2; m.position.y = y0 + bar * k / 8; g.add(m); }
  const pl = new THREE.Group(); g.add(pl);
  const piston = K.solid(new THREE.CylinderGeometry(r - 0.006, r - 0.006, 0.022, 32), K.M.matte(0x22252c, 0.6)); pl.add(piston);
  const rod = K.solid(new THREE.BoxGeometry(0.012, L * 0.85, 0.012), K.M.gloss(0xf2f2f0)); rod.position.y = 0.011 + L * 0.425; pl.add(rod);
  const thumb = K.solid(new THREE.CylinderGeometry(r * 1.1, r * 1.1, 0.008, 32), K.M.gloss(0xf2f2f0)); thumb.position.y = 0.011 + L * 0.85 + 0.004; pl.add(thumb);
  const yOut = y0 + bar - 0.04, yIn = y0 + 0.015 + (bar - 0.055) * (1 - stop);
  g.userData.set = (u) => { pl.position.y = yOut + (yIn - yOut) * u; g.userData.top = pl.position.y + 0.011 + L * 0.85 + 0.008; g.userData.piston = pl.position.y; };
  g.userData.set(0); g.userData.inner = [y0 + 0.004, r - 0.006]; return g;
}
/** a steel weight with a knob (bottom at y 0) */
export function weight(r = 0.05, h = 0.06) {
  const g = new THREE.Group(), m = K.M.metal(0x8d939b, 0.35);
  const b = K.solid(new THREE.CylinderGeometry(r, r, h, 32), m); b.position.y = h / 2; g.add(b);
  const n = K.solid(new THREE.CylinderGeometry(r * 0.3, r * 0.35, h * 0.5, 20), m); n.position.y = h + h * 0.25 - 0.001; g.add(n);
  return g;
}
/** a gas tap on a small wall post, with a rubber pipe that runs along the table to `to` (x, z), ending in a hose
 *  barb for a burner. userData.set(u) turns the handle (0 closed, 1 open); userData.path = the pipe's points. */
export function gasTap(to = [0.6, 0]) {
  const g = new THREE.Group(), m = K.M.metal(0xb9bec6, 0.3);
  const post = K.solid(new THREE.BoxGeometry(0.06, 0.22, 0.06), K.M.matte(0x4a4f58, 0.6)); post.position.y = 0.11; g.add(post);
  const valve = K.solid(new THREE.CylinderGeometry(0.018, 0.018, 0.08, 16), m); valve.rotation.z = Math.PI / 2; valve.position.set(0.06, 0.16, 0); g.add(valve);
  const h = new THREE.Group(); h.position.set(0.06, 0.185, 0); g.add(h);
  const handle = K.solid(new THREE.BoxGeometry(0.012, 0.012, 0.09), K.M.gloss(0xd84a3a)); handle.position.z = 0.03; h.add(handle);
  const path = [[0.1, 0.16, 0], [0.16, 0.1, 0.02], [0.24, 0.012, 0.04], [to[0] * 0.5 + 0.1, 0.012, to[1] + 0.06], [to[0] - 0.24, 0.012, to[1] + 0.02], [to[0] - 0.2, 0.06, to[1]]];
  const pipe = K.wire(path, 0xb8442f, 0.014); g.add(pipe);
  g.userData.set = (u) => { h.rotation.y = -Math.PI / 2 * u; }; g.userData.curve = pipe.userData.curve;
  return g;
}
