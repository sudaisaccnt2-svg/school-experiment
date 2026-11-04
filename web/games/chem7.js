// Unit 7 3D kit (Electrochemistry): CPK atoms with their symbol, glowing blue electrons that hop from atom to atom,
// orange cations / green anions, and a simple cell (glass tank, two plates, a wire over the top, a bulb or a battery).
import { THREE, ball, glow, emissive, tween, ease, flyTo, popIn } from './kit.js';
import { CPK, CPK_R, cpkMat } from './mol3d.js';
import { WATER, STEEL, DARK, edgeBox } from './gas3d.js';

Object.assign(CPK, { Fe: 0xcc7350, Zn: 0x9ea8b8, Cu: 0xeb804d, Sn: 0xbfc7d1, Mn: 0xbf80d9, Ag: 0xd9dbe6, Ca: 0xd9d9bf,
  Hg: 0xccd1e0, I: 0x9940bf, As: 0x99d980, Al: 0xbfb3cc, Pb: 0x6b6f80 });
for (const s of ['Fe', 'Zn', 'Cu', 'Sn', 'Mn', 'Ag', 'Ca', 'Hg', 'I', 'As', 'Al', 'K', 'Mg', 'Pb']) CPK_R[s] ??= 0.58;

export const CAT = emissive(0xff8c26, 1.6);
export const ANI = emissive(0x4dff73, 1.3);
export const E_MAT = new THREE.MeshStandardMaterial({ color: 0xbfe3ff, emissive: 0x4aa8ff, emissiveIntensity: 2.2, roughness: 0.3 });
export const METALS = {
  Zn: new THREE.MeshPhysicalMaterial({ color: 0x9ea8b8, metalness: 0.9, roughness: 0.35 }),
  Cu: new THREE.MeshPhysicalMaterial({ color: 0xd9733f, metalness: 0.9, roughness: 0.3 }),
  C: new THREE.MeshStandardMaterial({ color: 0x1a1b20, roughness: 0.6 }),
  Fe: new THREE.MeshPhysicalMaterial({ color: 0x6b6e75, metalness: 0.8, roughness: 0.5 }),
  Sn: new THREE.MeshPhysicalMaterial({ color: 0xd1d6db, metalness: 0.95, roughness: 0.2 }),
};
export const RUST = new THREE.MeshStandardMaterial({ color: 0x8a3a12, roughness: 0.95 });
const WIRE = new THREE.MeshBasicMaterial({ color: 0xeef2ff });

/** A CPK atom with its symbol tag. k scales the radius. */
export function atom(stage, parent, sym, pos, k = 1, tag = true) {
  const r = (CPK_R[sym] ?? 0.5) * k, m = ball(cpkMat(sym), r);
  m.position.set(...pos); parent.add(m); m.userData.r = r;
  if (tag) m.userData.tag = stage.tag(`<b>${sym}</b>`, m, [0, 0, 0], r > 0.5 ? 'big' : '');
  return m;
}
/** A glowing electron ball. */
export function electron(parent, pos, r = 0.12) {
  const g = new THREE.Group(); g.add(ball(E_MAT, r), glow(0x4aa8ff, r * 6, 0.8)); g.position.set(...pos); parent.add(g); return g;
}
/** n electrons hop from atom a to atom b (arc). Returns when they land. */
export async function hop(parent, a, b, n = 1, dur = 0.8) {
  const out = [];
  for (let k = 0; k < n; k++) {
    const p = a.position.clone().add(new THREE.Vector3(0.35, 0.3 - 0.25 * k, 0.6));
    const e = electron(parent, p.toArray()); popIn(e, 1, 0.2); out.push(e);
    const to = b.position.clone().add(new THREE.Vector3(-0.35, 0.3 - 0.25 * k, 0.6));
    flyTo(e, to, dur, 1.0);
    await new Promise((r) => setTimeout(r, 250));
  }
  await new Promise((r) => setTimeout(r, dur * 1000));
  return out;
}
/** A coloured ion ball. */
export function ion(parent, plus, pos, r = 0.2) {
  const m = ball(plus ? CAT : ANI, r); m.position.set(...pos); parent.add(m); return m;
}
/** Thin straight wire from a to b. */
export function wire(parent, pts, r = 0.025) {
  const g = new THREE.Group();
  for (let k = 0; k < pts.length - 1; k++) {
    const a = new THREE.Vector3(...pts[k]), b = new THREE.Vector3(...pts[k + 1]), d = b.clone().sub(a);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 8), WIRE);
    m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); g.add(m);
  }
  parent.add(g); return g;
}
/** Electrons running along a polyline again and again; call the returned tick(dt) each frame. */
export function flow(parent, pts, n = 5, speed = 1.3) {
  const P = pts.map((p) => new THREE.Vector3(...p)), seg = P.slice(1).map((p, k) => p.distanceTo(P[k])), L = seg.reduce((a, b) => a + b, 0);
  const es = Array.from({ length: n }, () => electron(parent, pts[0], 0.09)); let s = 0;
  const at = (d) => { for (let k = 0; k < seg.length; k++) { if (d <= seg[k]) return P[k].clone().lerp(P[k + 1], d / seg[k]); d -= seg[k]; } return P.at(-1).clone(); };
  return (dt = 0.016) => { s = (s + speed * dt) % L; es.forEach((e, k) => e.position.copy(at((s + (k * L) / n) % L))); };
}
/** A cell: tank (w × h) standing at y, plates at ±gap, a wire over the top to a battery or a bulb.
 * Returns { g, L, R, path (anode → cathode wire points), bulbGlow }. */
export function cell(parent, { x = 0, y = -1.8, w = 4, h = 2.4, liq = WATER, pa = METALS.C, pc = METALS.C, gap = 1.3, top = 'battery', level = 1 } = {}) {
  const g = new THREE.Group(); g.position.set(x, y, 0); parent.add(g);
  const t = edgeBox(w, h, 1.4, { open: true }); t.position.y = h / 2; g.add(t);
  if (liq) { const l = new THREE.Mesh(new THREE.BoxGeometry(w - 0.08, h * 0.8, 1.3), liq); l.position.y = h * 0.4; g.add(l); }
  const plate = (mx, mat) => { const p = new THREE.Mesh(new THREE.BoxGeometry(0.45, h + 0.2, 0.12), mat); p.position.set(mx, (h + 0.2) / 2 + 0.15, 0); g.add(p); return p; };
  const L = plate(-gap, pa), R = plate(gap, pc), zt = h + 1.3;
  let bulbGlow = null;
  if (top === 'battery') {
    const b = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 0.5), DARK); b.position.set(0, zt, 0); g.add(b);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.25, 0.25), STEEL); cap.position.set(-0.66, zt, 0); g.add(cap);
  } else {
    const glass = ball(new THREE.MeshBasicMaterial({ color: 0xcfe0ff, transparent: true, opacity: 0.25 }), 0.45); glass.position.set(0, zt + 0.3, 0); g.add(glass);
    bulbGlow = ball(emissive(0xffd970, 6), 0.12 + 0.3 * level); bulbGlow.position.copy(glass.position); bulbGlow.visible = level > 0; g.add(bulbGlow);
  }
  const yTop = h + 0.35, ex = top === 'battery' ? 0.66 : 0.3;
  const path = [[-gap, yTop, 0], [-gap, zt, 0], [-ex, zt, 0], [ex, zt, 0], [gap, zt, 0], [gap, yTop, 0]];
  wire(g, path.slice(0, 3)); wire(g, path.slice(3));
  return { g, L, R, path, bulbGlow, h };
}
export const grow = (o, d = 0.6) => { o.scale.setScalar(0.001); return tween(d, (t) => o.scale.setScalar(Math.max(0.001, t)), ease.out); };
