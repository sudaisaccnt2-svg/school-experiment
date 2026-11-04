// Electron Trails helpers (used by cloud.js): laps() = the electron's calm motion round the nucleus inside its area
// (book p.49), Trail = a glowing tail of points, Mover = one electron + its tail.
import { THREE, ball, M } from './kit.js';

// ---------------------------------------------------------------- the moving electron and its glowing trail
// Book p.49: the electron revolves round the nucleus in its shell, and moves within its sub-shell's area. So here it
// goes round and round, lap after lap; each lap is a little tilted and a little bigger or smaller than the last, so
// the laps slowly fill the area. s area: the laps go round the nucleus. p / d areas: the laps go round inside one lobe;
// now and then the loop is carried to the next lobe round the side of the nucleus. It never touches the nucleus.
//   centre: { sample } (s: lap size from the area) or { lobes: [unit dirs], c: lobe distance, rho: biggest lap }
//   flat: laps stay almost in the picture plane (the 2D game rounds)
export function laps({ sample = null, lobes = null, c = 0, rho = 0, avoid = 0.3, flat = false, stretch = 0.35, stay = [2, 3] }) {
  const n = flat ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3().randomDirection();
  const u = new THREE.Vector3(1, 0, 0).addScaledVector(n, -n.x).normalize(), v = new THREE.Vector3();
  const C = new THREE.Vector3(), out = new THREE.Vector3(), d = new THREE.Vector3(), tmp = new THREE.Vector3();
  const pickR = () => (lobes ? rho * (0.3 + 0.7 * Math.random()) : Math.max(sample().length(), avoid + 0.08));
  let th = 0, r = pickR(), rT = pickR(), lobe = 0, lapsLeft = stay[0] + Math.random() * stay[1], move = null;
  if (lobes) C.copy(lobes[0]).multiplyScalar(c);
  const tilt = new THREE.Vector3();
  return (adv) => {
    const dth = adv * 0.9;
    th += dth;
    r += (rT - r) * Math.min(1, dth * 0.6);
    if (Math.abs(rT - r) < 0.02 * (rho || 1)) rT = pickR();
    // the lap's plane turns slowly (continuously)
    if (flat) { tilt.set(Math.sin(th * 0.13) * 0.25, Math.cos(th * 0.11) * 0.25, 1); n.copy(tilt).normalize(); }
    else { tmp.randomDirection().multiplyScalar(dth * 0.35); n.add(tmp).normalize(); }
    u.addScaledVector(n, -u.dot(n)).normalize(); v.crossVectors(n, u);
    if (lobes && lobes.length > 1) {
      lapsLeft -= dth / (Math.PI * 2);
      if (lapsLeft <= 0 && !move) {                  // carry the loop to another lobe, round the side of the nucleus
        // next lobe: a neighbour if there is one (clover), else the opposite lobe (dumbbell), passing beside the
        // nucleus as seen from the front (never across its face)
        const near = lobes.map((x, q) => q).filter((q) => q !== lobe && lobes[q].dot(lobes[lobe]) > -0.5);
        const nx = near.length ? near[Math.floor(Math.random() * near.length)] : (lobe + 1) % lobes.length;
        const a = lobes[lobe].clone(), b = lobes[nx].clone();
        let mid = null;
        if (a.dot(b) < -0.5) {
          mid = new THREE.Vector3().crossVectors(a, new THREE.Vector3(0, 0, 1));
          if (mid.lengthSq() < 0.01) mid.set(1, 0, 0);
          mid.normalize();
        }
        move = { a, b, mid, t: 0 }; lobe = nx;
      }
      if (move) {
        move.t = Math.min(1, move.t + dth / (Math.PI * 3));
        const s = move.t * move.t * (3 - 2 * move.t);
        if (move.mid) { if (s < 0.5) d.copy(move.a).lerp(move.mid, s * 2); else d.copy(move.mid).lerp(move.b, s * 2 - 1); }
        else d.copy(move.a).lerp(move.b, s);
        // on the way the loop shrinks and passes close by the side of the nucleus (not out into the empty middle)
        const w = Math.sin(Math.PI * s);
        C.copy(d.normalize()).multiplyScalar(c * (1 - 0.62 * w)); move.k = 1 - 0.85 * w;
        if (move.t >= 1) { move = null; lapsLeft = stay[0] + Math.random() * stay[1]; }
      }
    }
    const rr = r * (move ? move.k ?? 1 : 1);
    out.copy(u).multiplyScalar(Math.cos(th) * rr).addScaledVector(v, Math.sin(th) * rr);
    if (lobes) { d.copy(C).normalize(); out.addScaledVector(d, out.dot(d) * stretch); }   // lobes a bit longer than wide
    out.add(C);
    const l = out.length();
    if (l < avoid) out.multiplyScalar(avoid / Math.max(l, 1e-4));
    return out;
  };
}
// glow that only adds light and leaves the canvas alpha alone (else faded dots punch black specks in the backdrop)
function glowPoints(size) {
  const m = new THREE.PointsMaterial({ size, vertexColors: true, transparent: true, depthWrite: false });
  Object.assign(m, { blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor,
    blendDst: THREE.OneFactor, blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor });
  return m;
}
export class Trail {
  constructor(parent, color, N = 9000, size = 0.06) {
    this.N = N; this.i = 0; this.col = new THREE.Color(color);
    this.pos = new Float32Array(N * 3); this.c = new Float32Array(N * 3);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(this.c, 3));
    this.pts = new THREE.Points(g, glowPoints(size)); this.pts.frustumCulled = false; parent.add(this.pts); this.parent = parent;
  }
  emit(p, k = 1) {
    const i = this.i; this.i = (this.i + 1) % this.N;
    this.pos[i * 3] = p.x; this.pos[i * 3 + 1] = p.y; this.pos[i * 3 + 2] = p.z;
    this.c[i * 3] = this.col.r * k; this.c[i * 3 + 1] = this.col.g * k; this.c[i * 3 + 2] = this.col.b * k;
  }
  fade(dt, life) { if (life === Infinity) return; const k = Math.exp(-dt / life); for (let j = 0; j < this.c.length; j++) this.c[j] *= k; }
  update() { this.pts.geometry.attributes.position.needsUpdate = true; this.pts.geometry.attributes.color.needsUpdate = true; }
  dispose() { this.parent.remove(this.pts); this.pts.geometry.dispose(); }
}
// one electron moving in its area: move(dt, speed) carries it on along its laps and draws its trail
export class Mover {
  constructor(parent, path, color, { size = 0.06, N = 7000, r = 0.09 } = {}) {
    this.w = path; this.trail = new Trail(parent, color, N, size);
    this.e = ball(M.electron, r); parent.add(this.e); this.parent = parent; this.e.position.copy(this.w(0));
  }
  move(dt, speed, life = 2.5, hide = null, each = null) {
    const adv = dt * speed, n = Math.max(2, Math.ceil(adv * 14));
    this.trail.fade(dt, life);
    for (let q = 0; q < n; q++) {
      const p = this.w(adv / n);
      const off = hide && hide(p);
      this.trail.emit(p, off ? 0 : 1);
      if (each) each(p, dt / n);
    }
    this.e.position.copy(this.w(0)); this.e.visible = !(hide && hide(this.e.position));
    this.trail.update();
  }
  dispose() { this.trail.dispose(); this.parent.remove(this.e); }
}
