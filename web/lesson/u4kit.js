// Chapter 4 (Structure of Molecules) shared lesson tools, taken from lesson 401 so every Chapter 4 lesson uses the
// same atoms, electrons, shots and labels (one art style). Lessons stay hand-built (the 817 standard); this file only
// holds the pieces they all need.
import * as THREE from 'three';
import * as K from './kit.js';
const { M, span } = K;
export const V = (x, y, z) => new THREE.Vector3(x, y, z);
export const TAN = Math.tan(16 * Math.PI / 180), ASP = 1.6, ADIR = [0, 0.5, 1], DDIR = [0, 0.12, 1];

/** shot maker: S(t, look, w, h, dir, ease) fits a w × h subject (the engine refits it to the real screen); shots from
 *  `dock` on leave room for the docked question panel */
export function shots(dock) {
  return function S(t, look, w, h, dir = ADIR, e) {
    h *= 1.14; look = [look[0], look[1] + 0.05 * h, look[2]];        // headroom: the caption floats just above the subject (capNear)
    const dk = t >= dock, d = V(...dir).normalize(), dist = Math.max(h / 2 / TAN, (dk ? w / (1 - K.DOCK_W) : w) / 2 / (TAN * ASP)) * 1.1;
    const pos = V(...look).addScaledVector(d, dist).toArray(), fit = { look, w, h, dir, dock: dk ? K.DOCK_W : 0 };
    return dk ? [t, ...K.dockShot(pos, look), undefined, e, fit] : [t, pos, look, undefined, e, fit];
  };
}

/** time that slows to a stop between t0 and t1 (electrons glide to rest instead of stopping dead) */
export const slow = (t, t0, t1) => (t < t0 ? t : t < t1 ? t0 + (t - t0) - (t - t0) ** 2 / (2 * (t1 - t0)) : t0 + (t1 - t0) / 2);
/** like slow, but 0 once at rest: the electrons then sit exactly at their a0 places */
export const rest = (t, t0, t1) => slow(t, t0, t1) - (t0 + (t1 - t0) / 2);
/** a short 0 → 1 → 0 pulse starting at t0 (0.4 s) */
export const bump = (t, t0, d = 0.4) => Math.sin(Math.PI * span(t, t0, t0 + d));

/** everything a lesson's build() needs: stages, labels sized for the screen, electrons and atoms.
 *  Call finish() last: it adds the label sizing (labels keep one size on screen, like 817 tags). */
export function lessonKit({ scene, cam, R }, id, { dark = () => false, AY = 1.9 } = {}) {
  const beats = [], ST = K.studio({ scene, R }, id, { dark });       // FIRST: models read the look
  beats.push((t) => ST.update(t));
  const kit = { beats, ST, root: scene };
  const add = kit.add = (o, x = 0, y = 0, z = 0) => { o.position.set(x, y, z); kit.root.add(o); return o; };
  kit.stage = (show) => { const g = new THREE.Group(); kit.root = g; scene.add(g); beats.push((t) => { g.visible = show(t); }); return g; };
  const tags = [];
  const WP = new THREE.Vector3();
  /** a label that keeps one size on screen: sized when it is drawn (the camera is already in its place for this frame) */
  kit.tag = (text, h, color, x, y, z = 0, w = 700) => {
    const l = add(K.label(text, 0.1, color, w), x, y, z), u = l.userData; u.frac = h * 1.8; tags.push(l); l.frustumCulled = false;
    l.onBeforeRender = (r, sc, c) => {
      if (u._post && l.scale.equals(u._post)) l.scale.copy(u._pre);   // nothing reset the size since the last draw: never compound
      u._pre = (u._pre ?? new THREE.Vector3()).copy(l.scale);
      const nar = Math.min(1, (c.aspect / 1.5) ** 0.7); l.scale.multiplyScalar(c.position.distanceTo(l.getWorldPosition(WP)) * 2 * TAN * u.frac * nar / 0.1);
      u._post = (u._post ?? new THREE.Vector3()).copy(l.scale); l.updateMatrixWorld();
    };
    return l;
  };
  kit.grp = (l, g) => { l.userData.group = g; return l; };   // labels read together count as ONE text (engine oneText)
  kit.keyLight = (x, y = AY) => { const k = new THREE.DirectionalLight(0xfff2e0, 2.0); k.position.set(x - 2, y + 4, 6); k.target.position.set(x, y, 0); kit.root.add(k, k.target); };
  const goldE = kit.goldE = M.glow(0xffc04d, 2.6), blueE = kit.blueE = M.glow(0x59a8ff, 2.2), eGeo = new THREE.SphereGeometry(0.045, 16, 12);
  kit.electron = (gold = false) => { const e = new THREE.Mesh(eGeo, gold ? goldE : blueE); e.add(K.glowSprite(gold ? 0xffc04d : 0x59a8ff, 0.26)); return e; };
  /** an atom facing the camera: nucleus + one thin 3D ring per shell (slightly tilted) + electrons on the rings.
   *  slots[s] = places on shell s (default = its count), skip[s] = an empty place. Each electron: { e, s, R, a0 } and
   *  an optional target (to: local point, u: 0..1) that pulls it off its ring. update(time): time from rest() */
  kit.fatom = (shells, p, n, { r0 = 0.34, dr = 0.24, nr = 0.12, tilt = 0.22, slots = [], skip = [], a0 = [] } = {}) => {
    const g = new THREE.Group(); g.add(K.nucleus(p, n, nr)); const rings = [], es = [];
    shells.forEach((c, s) => {
      const Rr = r0 + s * dr, ring = new THREE.Mesh(new THREE.TorusGeometry(Rr, 0.006, 6, 128), new THREE.MeshBasicMaterial({ color: 0x6f9fe8, transparent: true, opacity: 0.6, toneMapped: false }));
      ring.rotation.x = tilt; g.add(ring); rings.push(ring);
      const ns = slots[s] ?? c; let placed = 0;
      for (let i = 0; placed < c; i++) { if (i === skip[s]) continue; const e = kit.electron(); g.add(e); es.push({ e, s, R: Rr, a0: (a0[s] ?? Math.PI / 2) + (i / ns) * Math.PI * 2, u: 0, to: null }); placed++; }
    });
    const pt = (Rr, a) => V(Math.cos(a) * Rr, Math.sin(a) * Rr * Math.cos(tilt), Math.sin(a) * Rr * Math.sin(tilt));
    const update = (time) => es.forEach((x) => {
      const w = 0.55 / (1 + x.s * 0.6), on = pt(x.R, x.a0 + time * w);
      x.e.position.copy(x.to && x.u > 0 ? on.lerp(x.to, x.u) : on);
    });
    return { g, rings, es, update, pt, tilt };
  };
  kit.ringFlash = (ring, k) => { ring.material.opacity = 0.6 + 0.4 * k; ring.material.color.setHex(k > 0.05 ? 0xffd27a : 0x6f9fe8); ring.scale.setScalar(1 + 0.04 * k); };
  /** a gold electron that hops a → b along an arc with a short trail; returns (t, t0, t1, show) */
  kit.hop = (a, b, lift = 0.35) => {
    const e = add(kit.electron(true)), trail = Array.from({ length: 7 }, () => add(K.glowSprite(0xffc04d, 0.12)));
    return (t, t0, t1, show = true) => {
      const u = K.ease(span(t, t0, t1)); e.visible = show && t >= t0; e.position.copy(K.arc(a, b, lift, u));
      trail.forEach((s, k) => { const w = Math.max(0, u - 0.035 * (k + 1)); s.position.copy(K.arc(a, b, lift, w)); s.visible = show && u > 0.02 && u < 0.98; s.material.opacity = 0.55 * (1 - k / 7); });
      return e;
    };
  };
  /** n shared pairs between atoms A (centre Ap) and B (centre Bp), both from fatom(): set(us, ul) moves n outer electrons
   *  of each into the overlap (us 0..1: one from A beside one from B, pairs stacked across the bond) and spreads the
   *  others round the far side as lone pairs (ul 0..1). Returns { set, shared: [A's, B's] } */
  kit.sharer = (A, Ap, B, Bp, n, { sep = 0.11, gap = 0.05, lone = true } = {}) => {
    const outer = (X) => X.es.filter((e) => e.s === X.rings.length - 1);
    const ang = Math.atan2(Bp.y - Ap.y, Bp.x - Ap.x), d = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
    const pick = (X, dir) => [...outer(X)].sort((p, q) => d(p.a0, dir) - d(q.a0, dir));
    const oA = pick(A, ang), oB = pick(B, ang + Math.PI), sA = oA.slice(0, n), sB = oB.slice(0, n);
    const along = Bp.clone().sub(Ap).normalize(), perp = V(-along.y, along.x, 0), mid = Ap.clone().lerp(Bp, 0.5);
    const lensA = sA.map((_, i) => mid.clone().addScaledVector(perp, (i - (n - 1) / 2) * sep).addScaledVector(along, -gap / 2).sub(Ap));
    const lensB = sB.map((_, i) => mid.clone().addScaledVector(perp, (i - (n - 1) / 2) * sep).addScaledVector(along, gap / 2).sub(Bp));
    const lonePlaces = (X, rest, dir) => {                              // pairs spread evenly round the far side
      const k = rest.length, R = rest[0]?.R ?? 0, np = Math.ceil(k / 2), step = (2 * Math.PI - 1.8) / Math.max(np, 1);
      return rest.map((_, i) => { const j = Math.floor(i / 2), c = dir + Math.PI + (j - (np - 1) / 2) * step, solo = k % 2 && j === np - 1; return X.pt(R, c + (solo ? 0 : i % 2 ? 0.16 : -0.16)); });
    };
    const rA = oA.slice(n), rB = oB.slice(n), LA = lonePlaces(A, rA, ang), LB = lonePlaces(B, rB, ang + Math.PI);
    const set = (us, ul = us) => {
      sA.forEach((e, i) => { e.to = lensA[i]; e.u = us; }); sB.forEach((e, i) => { e.to = lensB[i]; e.u = us; });
      if (lone) { rA.forEach((e, i) => { e.to = LA[i]; e.u = ul; }); rB.forEach((e, i) => { e.to = LB[i]; e.u = ul; }); }
    };
    return { set, shared: [sA, sB], lone: [rA, rB] };
  };
  /** a ball-and-stick molecule: atoms [[element, x, y, z]], bonds [[i, j, order]] (order 2/3 = parallel sticks) */
  kit.ballMol = (atoms, bonds, { r = { H: 0.12, C: 0.2, N: 0.2, O: 0.2, Cl: 0.25, F: 0.18, S: 0.24, B: 0.2 } } = {}) => {
    const g = new THREE.Group(), stickM = M.gloss(0xd8dde4), P = atoms.map(([, x, y, z]) => V(x, y, z ?? 0));
    atoms.forEach(([el], i) => {
      const rr = r[el] ?? 0.2, b = new THREE.Group(); b.add(K.solid(new THREE.SphereGeometry(rr, 32, 20), M.gloss(K.ATOM[el][0])));
      const l = K.label(el, rr * 1.1, el === 'H' ? '#1b2030' : '#ffffff', 800); l.position.z = rr + 0.005; l.renderOrder = 22; b.add(l); b.position.copy(P[i]); g.add(b);
    });
    bonds.forEach(([i, j, o = 1]) => {
      const a = P[i], b = P[j], along = b.clone().sub(a), len = along.length(), side = V(-along.y, along.x, 0).normalize();
      for (let k = 0; k < o; k++) {
        const off = (k - (o - 1) / 2) * 0.065, m = K.solid(new THREE.CylinderGeometry(o > 1 ? 0.022 : 0.03, o > 1 ? 0.022 : 0.03, len, 14), stickM, { outline: false });
        m.position.copy(a).lerp(b, 0.5).addScaledVector(side, off); m.quaternion.setFromUnitVectors(V(0, 1, 0), along.clone().normalize()); g.add(m);
      }
    });
    return g;
  };
  kit.finish = () => {
    return (t, dt) => { for (const b of beats) b(t, dt); };
  };
  return kit;
}
