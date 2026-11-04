// A playable atom: packed nucleus (protons + neutrons) and shells K, L, M, N with electrons.
// Shells face the camera (slight tilt). Electrons spread evenly, or sit in 2n² "seats" when seats = true.
import { THREE, M, ball, ring, glow, tween, popIn, popOut, flyTo, ease, ringMat } from './kit.js';

export const SHELLS = ['K', 'L', 'M', 'N'];
export const CAP = (n) => 2 * n * n;                 // seats in shell n
export const BOOK_CAP = [2, 8, 8, 32];               // filling rule used in the book for the first 20 elements
export const ELEMENTS = [null, ['H', 'Hydrogen'], ['He', 'Helium'], ['Li', 'Lithium'], ['Be', 'Beryllium'], ['B', 'Boron'],
  ['C', 'Carbon'], ['N', 'Nitrogen'], ['O', 'Oxygen'], ['F', 'Fluorine'], ['Ne', 'Neon'], ['Na', 'Sodium'],
  ['Mg', 'Magnesium'], ['Al', 'Aluminium'], ['Si', 'Silicon'], ['P', 'Phosphorus'], ['S', 'Sulphur'], ['Cl', 'Chlorine'],
  ['Ar', 'Argon'], ['K', 'Potassium'], ['Ca', 'Calcium']];
Object.assign(ELEMENTS, { 22: ['Ti', 'Titanium'], 27: ['Co', 'Cobalt'], 52: ['Te', 'Tellurium'], 54: ['Xe', 'Xenon'],
  60: ['Nd', 'Neodymium'], 72: ['Hf', 'Hafnium'], 92: ['U', 'Uranium'] });
export const element = (Z) => ELEMENTS[Z] || (Z > 0 ? ['?', 'Element ' + Z] : ['–', 'nothing yet']);

const NR = 0.21;                                     // nucleon radius
const packCache = new Map();
/** Ball-packed positions for n spheres (relaxed once per n, inner positions first). */
export function packNucleons(n, r = NR) {
  if (packCache.has(n)) return packCache.get(n);
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647 - 0.5;
  const P = [];
  for (let i = 0; i < n; i++) P.push(new THREE.Vector3(rnd(), rnd(), rnd()).multiplyScalar(2.5 * r * Math.cbrt(n)));
  const d = 2 * r * 0.97, dv = new THREE.Vector3();
  for (let it = 0; it < 80; it++) {
    for (const p of P) p.multiplyScalar(0.97);
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      dv.subVectors(P[j], P[i]); const L = dv.length() || 1e-4;
      if (L < d) { dv.multiplyScalar(((d - L) / L) * 0.5); P[i].sub(dv); P[j].add(dv); }
    }
  }
  P.sort((a, b) => a.length() - b.length());
  packCache.set(n, P);
  return P;
}
/** Seat order that spreads electrons around the ring as they arrive (0, ½, ¼, ¾ …). */
function spreadOrder(cap) {
  const vdc = (i) => { let x = 0, f = 0.5; while (i) { if (i & 1) x += f; i >>= 1; f /= 2; } return x; };
  return [...Array(cap).keys()].sort((a, b) => vdc(a) - vdc(b)).map((k) => Math.round(vdc(k) * cap) % cap)
    .filter((v, i, a) => a.indexOf(v) === i).concat([...Array(cap).keys()]).filter((v, i, a) => a.indexOf(v) === i);
}

export class Atom {
  constructor(stage, { seats = false, tilt = -0.22, pos = [0, 0.3, 0], radii = [1.75, 2.65, 3.55, 4.45], minShells = 0,
    tags = true } = {}) {
    this.stage = stage; this.seatMode = seats; this.minShells = minShells;
    this.group = new THREE.Group(); this.group.position.set(...pos); this.group.rotation.x = tilt;
    stage.root.add(this.group);
    this.nucleus = new THREE.Group(); this.group.add(this.nucleus);
    this.nucleons = [];                                // meshes, userData.type = 'p' | 'n'
    this.halo = glow(0xff7a5a, 1.2, 0.35); this.nucleus.add(this.halo);
    this.shells = radii.map((r, i) => {
      const n = i + 1, g = new THREE.Group(), pivot = new THREE.Group();
      g.add(pivot); this.group.add(g);
      const rm = ring(r, ringMat(0x5c9dff, 0.5), 0.022);
      const hit = new THREE.Mesh(new THREE.TorusGeometry(r, 0.32, 6, 64), M.hit);
      g.add(rm, hit); hit.userData.shell = i; stage.pickable(hit);
      const seats = [];
      if (seats) for (let k = 0; k < CAP(n); k++) {
        const a = (2 * Math.PI * k) / CAP(n), s = ball(M.seat, 0.1);
        s.position.set(r * Math.cos(a), r * Math.sin(a), 0); pivot.add(s); seats.push(s);
      }
      const sh = { n, i, r, g, pivot, ring: rm, hit, seats, order: spreadOrder(CAP(n)), electrons: [], shown: true,
        speed: 0.55 / n };
      if (tags) sh.tag = stage.tag(SHELLS[i], { getWorldPosition: (v) => g.localToWorld(v.set(r * 0.72, r * 0.72, 0)), visible: true, scale: { x: 1 } }, [0, 0, 0], 'shelltag');
      g.scale.setScalar(1);
      return sh;
    });
    this.frame = (dt) => {
      for (const s of this.shells) s.pivot.rotation.z += dt * s.speed;
      this.nucleus.rotation.y += dt * 0.25; this.nucleus.rotation.x += dt * 0.07;
    };
    stage.onFrame(this.frame);
    this.updateShells(true);
  }
  get p() { return this.nucleons.filter((o) => o.userData.type === 'p').length; }
  get n() { return this.nucleons.filter((o) => o.userData.type === 'n').length; }
  get e() { return this.shells.reduce((a, s) => a + s.electrons.length, 0); }
  get config() { const c = this.shells.map((s) => s.electrons.length); while (c.length && !c[c.length - 1]) c.pop(); return c; }
  worldCenter() { return this.group.localToWorld(new THREE.Vector3()); }

  // ---------------------------------------------------------------- nucleus
  setNucleus(p, n) {
    for (const o of this.nucleons) { this.nucleus.remove(o); this.stage.unpickable(o); }
    this.nucleons = [];
    for (let i = 0; i < p + n; i++) this._makeNucleon(this._typeFor(i, p, n));
    this.layout(true);
  }
  _typeFor(i, p, n) {                 // interleave protons and neutrons evenly
    return Math.floor(((i + 1) * p) / (p + n)) > Math.floor((i * p) / (p + n)) ? 'p' : 'n';
  }
  _makeNucleon(type) {
    const o = ball(type === 'p' ? M.proton : M.neutron, NR);
    o.userData.type = type; this.nucleus.add(o); this.nucleons.push(o); this.stage.pickable(o);
    return o;
  }
  addNucleon(type, fromWorld) {
    const o = this._makeNucleon(type);
    if (fromWorld) o.position.copy(this.nucleus.worldToLocal(fromWorld.clone()));
    this.layout(false);
    return o;
  }
  removeNucleon(o) {
    const i = this.nucleons.indexOf(o); if (i < 0) return;
    this.nucleons.splice(i, 1); this.stage.unpickable(o);
    const out = o.position.clone().normalize().multiplyScalar(3).add(new THREE.Vector3(0, 0, 1));
    Promise.all([flyTo(o, out, 0.35, 0.4), popOut(o, 0.35)]).then(() => this.nucleus.remove(o));
    this.layout(false);
  }
  layout(instant) {
    const N = this.nucleons.length, P = packNucleons(N);
    const ps = this.nucleons.filter((o) => o.userData.type === 'p'), ns = this.nucleons.filter((o) => o.userData.type === 'n');
    let ip = 0, iN = 0;
    for (let k = 0; k < N; k++) {
      const o = this._typeFor(k, ps.length, ns.length) === 'p' ? ps[ip++] : ns[iN++];
      if (!o) continue;
      if (instant) o.position.copy(P[k]); else flyTo(o, P[k].clone(), 0.4, 0.15);
    }
    const R = N ? NR * 1.6 * Math.cbrt(N) + 0.5 : 0.01;
    tween(0.3, (t) => this.halo.scale.setScalar(Math.max(0.01, this.halo.scale.x + (R * 2.4 - this.halo.scale.x) * t)));
  }

  // ---------------------------------------------------------------- electrons
  _electron() {
    const g = new THREE.Group();
    g.add(ball(M.electron, 0.13), glow(0x4aa8ff, 0.85, 0.8));
    this.stage.pickable(g); g.userData.electron = true; g.userData.pickFirst = true;
    return g;
  }
  /** Shell index the book's simple rule would use next (K 2, L 8, M 8, then N). */
  nextShell() {
    for (let i = 0; i < 4; i++) if (this.shells[i].electrons.length < BOOK_CAP[i]) return i;
    return -1;
  }
  isFull(i) { return this.shells[i].electrons.length >= CAP(i + 1); }
  addElectron(i = this.nextShell(), fromWorld = null) {
    if (i < 0 || this.isFull(i)) { this.flashRing(Math.max(i, 0), 0xff4d4d); return null; }
    const sh = this.shells[i], e = this._electron();
    sh.pivot.add(e); sh.electrons.push(e); e.userData.shell = i;
    if (this.seatMode) {
      const used = new Set(sh.electrons.map((x) => x.userData.seat));
      e.userData.seat = sh.order.find((k) => !used.has(k));
    }
    e.position.copy(fromWorld ? sh.pivot.worldToLocal(fromWorld.clone()) : new THREE.Vector3(0, 0, 0));
    this.updateShells(false);
    this.spread(i, e);
    return e;
  }
  removeElectron(e) {
    const sh = this.shells[e.userData.shell]; if (!sh) return;
    sh.electrons.splice(sh.electrons.indexOf(e), 1); this.stage.unpickable(e);
    const out = e.position.clone().multiplyScalar(1.6);
    Promise.all([flyTo(e, out, 0.3, 0.3), popOut(e, 0.3)]).then(() => sh.pivot.remove(e));
    this.spread(sh.i); this.updateShells(false);
  }
  clearElectrons() {
    for (const sh of this.shells) { for (const e of sh.electrons) { sh.pivot.remove(e); this.stage.unpickable(e); } sh.electrons = []; }
    this.updateShells(true);
  }
  setConfig(cfg) { this.clearElectrons(); cfg.forEach((c, i) => { for (let k = 0; k < c; k++) this.addElectron(i); }); }
  spread(i, fresh = null) {
    const sh = this.shells[i], n = sh.electrons.length;
    sh.electrons.forEach((e, k) => {
      const a = this.seatMode ? (2 * Math.PI * e.userData.seat) / CAP(sh.n) : (2 * Math.PI * k) / n + i * 0.4;
      const to = new THREE.Vector3(sh.r * Math.cos(a), sh.r * Math.sin(a), 0);
      flyTo(e, to, e === fresh ? 0.5 : 0.35, e === fresh ? 0.6 : 0.05);
    });
  }
  updateShells(instant) {
    const used = this.config.length;
    this.shells.forEach((sh, i) => {
      const show = i < Math.max(used, this.minShells);
      if (show === sh.shown) return;
      sh.shown = show; sh.hit.visible = show;
      if (sh.tag) sh.tag.hidden = !show;
      if (instant) { sh.g.visible = show; sh.g.scale.setScalar(1); return; }
      if (show) { sh.g.visible = true; popIn(sh.g, 1, 0.4); } else popOut(sh.g, 0.3).then(() => { if (!sh.shown) sh.g.visible = false; });
    });
  }
  flashRing(i, color = 0x4dff88) {
    const m = this.shells[i].ring.material, c0 = new THREE.Color(0x5c9dff), c1 = new THREE.Color(color);
    return tween(0.7, (t) => { const k = Math.sin(t * Math.PI); m.color.copy(c0).lerp(c1, k); m.opacity = 0.5 + 0.5 * k; }, ease.lin);
  }
  dispose() { this.stage.offFrame(this.frame); this.stage.root.remove(this.group); this.shells.forEach((s) => s.tag && this.stage.untag(s.tag)); }
}
