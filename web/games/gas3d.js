// Unit 5 3D kit: moving molecules (gas / liquid / solid), glass boxes and jars drawn as glowing edges, a piston
// cylinder, a dial gauge, a thermometer and a flame. Same look as the films (glowing blue molecules, gold, dark studio).
import { THREE, tween, ease, emissive, ball } from './kit.js';

export const MOLM = {
  air: emissive(0x3d7dff, 1.3), gold: emissive(0xffa53a, 1.4), red: emissive(0xff4436, 1.2), white: emissive(0xd8e2ff, 1.0),
  purple: emissive(0x9a5cff, 1.4), brown: emissive(0xc0461a, 1.2), glassP: emissive(0x8cd8f0, 1.0), green: emissive(0x4dff70, 1.3),
};
export const GLASS = new THREE.MeshBasicMaterial({ color: 0x8cbfff, transparent: true, opacity: 0.85 });
export const WATER = new THREE.MeshBasicMaterial({ color: 0x2a6ae6, transparent: true, opacity: 0.18, depthWrite: false });
export const STEEL = new THREE.MeshPhysicalMaterial({ color: 0xa0a4ac, metalness: 0.9, roughness: 0.3 });
export const DARK = new THREE.MeshStandardMaterial({ color: 0x10131a, roughness: 0.7 });
export const HOT = emissive(0xff4020, 1.6);

function bar(a, b, r, mat) {
  const d = b.clone().sub(a), m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 8), mat);
  m.position.copy(a).add(b).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return m;
}

// a glass box of 12 glowing edges, centred at the group origin; open = no top
export function edgeBox(w, h, d, { open = false, r = 0.025, mat = GLASS } = {}) {
  const g = new THREE.Group(), V = (x, y, z) => new THREE.Vector3(x * w / 2, y * h / 2, z * d / 2);
  const E = [[[-1, -1, -1], [1, -1, -1]], [[-1, -1, 1], [1, -1, 1]], [[-1, -1, -1], [-1, -1, 1]], [[1, -1, -1], [1, -1, 1]],
    [[-1, -1, -1], [-1, 1, -1]], [[1, -1, -1], [1, 1, -1]], [[-1, -1, 1], [-1, 1, 1]], [[1, -1, 1], [1, 1, 1]]];
  if (!open) E.push([[-1, 1, -1], [1, 1, -1]], [[-1, 1, 1], [1, 1, 1]], [[-1, 1, -1], [-1, 1, 1]], [[1, 1, -1], [1, 1, 1]]);
  for (const [a, b] of E) g.add(bar(V(...a), V(...b), r, mat));
  return g;
}

// a glass jar (cylinder) standing on y = 0: two rings and two side lines
export function jar(rad, h, { r = 0.025, mat = GLASS } = {}) {
  const g = new THREE.Group();
  for (const y of [0, h]) { const t = new THREE.Mesh(new THREE.TorusGeometry(rad, r, 8, 64), mat); t.rotation.x = Math.PI / 2; t.position.y = y; g.add(t); }
  for (const x of [-rad, rad]) g.add(bar(new THREE.Vector3(x, 0, 0), new THREE.Vector3(x, h, 0), r, mat));
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, h, 40, 1, true), new THREE.MeshBasicMaterial({ color: 0x8cbfff, transparent: true, opacity: 0.05, depthWrite: false, side: THREE.DoubleSide }));
  wall.position.y = h / 2; g.add(wall);
  return g;
}

// molecules that fly and bounce inside a box. lo / hi are Vector3s you can change any time (piston, heating);
// speed too. mode 'solid' keeps them shaking around fixed seats.
export class Molecules {
  constructor(parent, { n = 16, lo, hi, r = 0.13, speed = 2.4, mat = MOLM.air, seats = null, amp = 0.04 } = {}) {
    this.g = new THREE.Group(); parent.add(this.g);
    this.lo = lo ? lo.clone() : new THREE.Vector3(-1, -1, -1); this.hi = hi ? hi.clone() : new THREE.Vector3(1, 1, 1); this.r = r; this.speed = speed; this.seats = seats; this.amp = amp;
    this.list = [];
    for (let k = 0; k < (seats ? seats.length : n); k++) {
      const m = ball(mat, r);
      if (seats) m.position.copy(seats[k]);
      else m.position.set(...[0, 1, 2].map((j) => this.lo.getComponent(j) + r + Math.random() * Math.max(0.01, this.hi.getComponent(j) - this.lo.getComponent(j) - 2 * r)));
      m.userData.v = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, (Math.random() - 0.5) * 0.4).normalize();
      this.g.add(m); this.list.push(m);
    }
    this.hits = 0;
  }
  free(lo, hi) { this.seats = null; if (lo) this.lo.copy(lo); if (hi) this.hi.copy(hi); }
  update(dt) {
    dt = Math.min(dt ?? 0.016, 0.05);
    for (const m of this.list) {
      if (this.seats) {
        const s = this.seats[this.list.indexOf(m)], a = this.amp;
        m.position.set(s.x + (Math.random() - 0.5) * a * 2, s.y + (Math.random() - 0.5) * a * 2, s.z + (Math.random() - 0.5) * a);
        continue;
      }
      const v = m.userData.v, p = m.position;
      p.addScaledVector(v, this.speed * dt);
      for (const j of [0, 1, 2]) {
        const a = this.lo.getComponent(j) + this.r, b = this.hi.getComponent(j) - this.r, x = p.getComponent(j);
        if (x < a) { p.setComponent(j, Math.min(a + (a - x), b)); v.setComponent(j, Math.abs(v.getComponent(j))); this.hits++; }
        else if (x > b) { p.setComponent(j, Math.max(b - (x - b), a)); v.setComponent(j, -Math.abs(v.getComponent(j))); this.hits++; }
      }
      if (Math.random() < 0.02) { v.x += (Math.random() - 0.5) * 0.8; v.y += (Math.random() - 0.5) * 0.8; v.normalize(); }
    }
  }
}

export function gridSeats(nx, ny, gap, c = new THREE.Vector3(), nz = 1) {
  const out = [];
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) for (let k = 0; k < nz; k++)
    out.push(new THREE.Vector3(c.x + (i - (nx - 1) / 2) * gap, c.y + (j - (ny - 1) / 2) * gap, c.z + (k - (nz - 1) / 2) * gap));
  return out;
}

// piston cylinder standing on y = 0. setV(h) moves the piston (height of the gas space)
export function pistonCyl(rad = 1.3, h = 4.0) {
  const g = jar(rad, h), pis = new THREE.Group(); g.add(pis);
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(rad * 0.97, rad * 0.97, 0.18, 40), STEEL); disc.position.y = 0.09; pis.add(disc);
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.4, 12), STEEL); rod.position.y = 0.88; pis.add(rod);
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.12, 24), STEEL); knob.position.y = 1.6; pis.add(knob);
  pis.position.y = h * 0.6;
  return { g, pis, set(y) { pis.position.y = y; }, to(y, dur = 0.6) { const y0 = pis.position.y; return tween(dur, (t) => (pis.position.y = y0 + (y - y0) * t), ease.inOut); } };
}

// round dial facing the camera; set(frac) 0 … 1 turns the needle from lower left to lower right
export function gauge(r = 0.75) {
  const g = new THREE.Group();
  const face = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.08, 40), DARK); face.rotation.x = Math.PI / 2; g.add(face);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(r, 0.035, 8, 48), GLASS); g.add(rim);
  for (let k = 0; k < 9; k++) {
    const a = (210 - 30 * k) * Math.PI / 180;
    g.add(bar(new THREE.Vector3(0.78 * r * Math.cos(a), 0.78 * r * Math.sin(a), 0.05), new THREE.Vector3(0.93 * r * Math.cos(a), 0.93 * r * Math.sin(a), 0.05), 0.012, GLASS));
  }
  const piv = new THREE.Group(); piv.position.z = 0.07; g.add(piv);
  const nd = bar(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.78 * r, 0, 0), 0.025, emissive(0xff4d4d, 1.4)); piv.add(nd);
  g.add(ball(STEEL, 0.07));
  let cur = 0;
  const ang = (f) => (210 - 240 * f) * Math.PI / 180;
  const set = (f) => { cur = f; piv.rotation.z = ang(f); };
  set(0.2);
  return { g, set, to(f, dur = 0.6) { const f0 = cur; return tween(dur, (t) => set(f0 + (f - f0) * t), ease.inOut); } };
}

// thermometer standing on y = 0; set(frac) fills the red column
export function thermo(h = 3.0) {
  const g = new THREE.Group();
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, h, 16), new THREE.MeshBasicMaterial({ color: 0xbfd8ff, transparent: true, opacity: 0.25, depthWrite: false }));
  tube.position.y = h / 2; g.add(tube);
  g.add(ball(HOT, 0.24));
  const col = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1, 12), HOT); g.add(col);
  let cur = 0.2;
  const set = (f) => { cur = f; const L = Math.max(0.01, f * h * 0.95); col.scale.y = L; col.position.y = 0.1 + L / 2; };
  set(0.2);
  return { g, set, h, to(f, dur = 0.6) { const f0 = cur; return tween(dur, (t) => set(f0 + (f - f0) * t), ease.inOut); } };
}

// a flickering burner flame standing on y = 0
export function flame(s = 1) {
  const g = new THREE.Group();
  const o = new THREE.Mesh(new THREE.ConeGeometry(0.28 * s, 0.9 * s, 20), emissive(0xff7a1a, 2.4)); o.position.y = 0.45 * s; g.add(o);
  const i = new THREE.Mesh(new THREE.ConeGeometry(0.15 * s, 0.5 * s, 16), emissive(0x4d8cff, 2.4)); i.position.y = 0.25 * s; i.position.z = 0.05; g.add(i);
  g.userData.tick = () => { g.scale.y = 0.85 + 0.3 * Math.random(); };
  return g;
}

// an arrow along +y from the origin
export function arrow3(len, mat, r = 0.05) {
  const g = new THREE.Group();
  const sh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len - 0.3, 10), mat); sh.position.y = (len - 0.3) / 2; g.add(sh);
  const hd = new THREE.Mesh(new THREE.ConeGeometry(r * 3, 0.3, 16), mat); hd.position.y = len - 0.15; g.add(hd);
  return g;
}
