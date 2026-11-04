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

/** Fig. 5.4: the Boyle's-law rig on a base: a glass cylinder of gas (faint blue column under a dark piston), a screw
 *  rod through a bridge with a T handle on top, a pressure gauge on a pipe at the right, a thermometer at the left.
 *  userData.set(h, p): h = height of the gas column (0.05 … 0.5), p = the gauge needle (0 … 1 of its sweep).
 *  userData.gauge / .cyl = local points for labels. Bottom at y 0. */
export function boyleRig() {
  const g = new THREE.Group(), steel = K.M.metal(0x9aa0a8, 0.3), dark = K.M.matte(0x2a2e36, 0.6), R = 0.085, Y0 = 0.05, HMAX = 0.52;
  const base = K.solid(new THREE.BoxGeometry(0.62, 0.04, 0.24), K.M.matte(0x5a4632, 0.7)); base.position.y = 0.02; g.add(base);
  const foot = K.solid(new THREE.CylinderGeometry(R + 0.025, R + 0.03, 0.012, 40), dark); foot.position.y = 0.046; g.add(foot);
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(R, R, HMAX, 40, 1, true), K.M.glass()); glass.position.y = Y0 + 0.004 + HMAX / 2; glass.renderOrder = 5; g.add(glass);
  for (let k = 1; k <= 8; k++) { const tk = new THREE.Mesh(new THREE.BoxGeometry(k % 2 ? 0.02 : 0.035, 0.003, 0.002), new THREE.MeshBasicMaterial({ color: 0xe8eef6 })); tk.position.set(-R * 0.55, Y0 + 0.01 + (HMAX - 0.04) * k / 8, R + 0.003); g.add(tk); }
  const gasM = new THREE.MeshStandardMaterial({ color: 0x7fb6ff, transparent: true, opacity: 0.22, depthWrite: false });
  const gas = new THREE.Mesh(new THREE.CylinderGeometry(R - 0.006, R - 0.006, 1, 32).translate(0, 0.5, 0), gasM); gas.position.y = Y0 + 0.012; gas.renderOrder = 4; g.add(gas);
  const piston = K.solid(new THREE.CylinderGeometry(R - 0.004, R - 0.004, 0.03, 40), dark); g.add(piston);
  const rod = K.solid(new THREE.CylinderGeometry(0.008, 0.008, 0.46, 12), steel); g.add(rod);
  const posts = [-1, 1].map((s) => { const p = K.solid(new THREE.CylinderGeometry(0.008, 0.008, HMAX + 0.06, 12), steel); p.position.set(s * (R + 0.04), Y0 + (HMAX + 0.06) / 2, -0.02); g.add(p); return p; });
  const bridge = K.solid(new THREE.BoxGeometry(2 * (R + 0.04) + 0.03, 0.02, 0.03), steel); bridge.position.set(0, Y0 + HMAX + 0.06, -0.02); g.add(bridge);
  const T = new THREE.Group(); g.add(T); const bar = K.solid(new THREE.CylinderGeometry(0.009, 0.009, 0.16, 12), K.M.gloss(0xd8a040)); bar.rotation.z = Math.PI / 2; T.add(bar);
  const pipe = K.wire([[R, 0.07, 0], [0.16, 0.07, 0], [0.2, 0.1, 0], [0.2, 0.2, 0]], 0x9aa0a8, 0.008); g.add(pipe);
  const dial = new THREE.Group(); dial.position.set(0.2, 0.28, 0.0); g.add(dial);
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d');
  x.fillStyle = '#f4f2ea'; x.beginPath(); x.arc(128, 128, 124, 0, 6.29); x.fill(); x.strokeStyle = '#1c2230'; x.lineWidth = 10; x.stroke();
  for (let k = 0; k <= 10; k++) { const a = Math.PI * (1.25 - 1.5 * k / 10); x.lineWidth = k % 5 ? 4 : 8; x.beginPath(); x.moveTo(128 + Math.cos(a) * 100, 128 - Math.sin(a) * 100); x.lineTo(128 + Math.cos(a) * (k % 5 ? 84 : 74), 128 - Math.sin(a) * (k % 5 ? 84 : 74)); x.stroke(); }
  x.fillStyle = '#c33'; x.beginPath(); x.arc(128, 128, 10, 0, 6.29); x.fill();
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const rim = K.solid(new THREE.CylinderGeometry(0.075, 0.075, 0.03, 40), steel); rim.rotation.x = Math.PI / 2; dial.add(rim);
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.066, 40), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 })); face.position.z = 0.0165; dial.add(face);
  const needle = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.055, 0.002).translate(0, 0.024, 0), new THREE.MeshBasicMaterial({ color: 0xcc2b2b })); needle.position.z = 0.019; dial.add(needle);
  const th = thermoMini(); th.position.set(-0.22, 0.04, 0.04); g.add(th);
  g.userData.set = (h, p) => {
    gas.scale.y = Math.max(1e-3, h); piston.position.y = Y0 + 0.012 + h + 0.015 + 0.001;
    rod.position.y = piston.position.y + 0.23; T.position.y = piston.position.y + 0.46; T.rotation.y = h * 40;
    needle.rotation.z = Math.PI * (1.25 - 1.5 * p) - Math.PI / 2;   // same sweep as the ticks (225° → −45°)
  };
  g.userData.gauge = V(0.2, 0.28, 0.03); g.userData.cyl = V(0, Y0, R); g.userData.HMAX = HMAX; g.userData.Y0 = Y0;
  g.userData.set(0.4, 0.2); return g;
}
function thermoMini() {
  const g = new THREE.Group(), tube = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.36, 16, 1, true), K.M.glass()); tube.position.y = 0.2; tube.renderOrder = 5; g.add(tube);
  const bulb = K.solid(new THREE.SphereGeometry(0.016, 16, 12), K.M.gloss(0xd23b30), { outline: false }); bulb.position.y = 0.03; g.add(bulb);
  const col = K.solid(new THREE.CylinderGeometry(0.004, 0.004, 0.12, 8), K.M.gloss(0xd23b30), { outline: false }); col.position.y = 0.1; g.add(col);
  const stand = K.solid(new THREE.CylinderGeometry(0.03, 0.035, 0.012, 24), K.M.matte(0x2a2e36, 0.6)); stand.position.y = 0.006; g.add(stand);
  return g;
}

/** a pencil that writes the notebook's items (kit.notebook draw items) in time: picked up before a stroke, gliding
 *  lifted between strokes, laid down at `rest` after a pause. nbPos = the notebook's world position. */
export function penWriter(nb, pen, items, rest, nbPos) {
  const ease = K.ease, span = K.span;
  const at = (u, v) => nb.userData.at(u, v).add(nbPos);
  const tipAt = (t) => {
    for (let i = 0; i < items.length; i++) {
      const it = items[i], end = it.t0 + (it.d || 0.3), nx = items[i + 1];
      if (t >= it.t0 - 0.05 && t <= end) return { p: (nb.userData.pen([it], Math.max(it.t0, t)) ?? nb.userData.at(it.x, it.y)).add(nbPos), up: 0 };
      if (nx && t > end && t < nx.t0 && nx.t0 - end < 1.3) { const a = (nb.userData.pen([it], end - 0.001) ?? nb.userData.at(it.x, it.y)).add(nbPos), b = at(nx.x, nx.y), u = ease(span(t, end, nx.t0)); return { p: a.lerp(b, u), up: Math.sin(Math.PI * u) }; }
    }
    return null;
  };
  return (t) => {
    nb.userData.draw(items, t);
    const tip = tipAt(t), first = items.find((it) => it.t0 > t - 0.8 && it.t0 - t < 0.8);
    let p, lie = 0;
    if (tip) p = tip.p.clone().add(V(0, 0.002 + 0.02 * tip.up, 0));
    else if (first) { const s = ease(span(t, first.t0 - 0.8, first.t0)); p = rest.clone().lerp(at(first.x, first.y), s); lie = 1 - s; }
    else { const prev = [...items].reverse().find((it) => it.t0 + (it.d || 0.3) <= t); const s = prev ? ease(span(t, prev.t0 + (prev.d || 0.3), prev.t0 + (prev.d || 0.3) + 0.8)) : 1; p = (prev ? at(prev.x, prev.y) : rest.clone()).lerp(rest, s); lie = s; }
    pen.position.copy(p); pen.rotation.set(-0.35 * (1 - lie) - (Math.PI / 2 - 0.02) * lie, 0.4 * lie, -0.25 * (1 - lie)); if (lie > 0.5) pen.position.y = rest.y;
  };
}

/** a conical glass flask (bottom at y 0) with a balloon pulled over its neck; userData.set(k): 0 = a limp balloon,
 *  1 = blown up by the warm air. */
export function flaskBalloon(color = 0xd8364a, s = 1) {
  const g = new THREE.Group(), r = 0.09, h = 0.2, n = 0.022;
  const prof = [[0, 0], [r, 0], [r + 0.004, 0.008], [n + 0.004, h * 0.78], [n + 0.004, h], [n - 0.002, h], [n - 0.002, h * 0.78 + 0.004], [r - 0.004, 0.012], [0, 0.006]].map(([x, y]) => new THREE.Vector2(x, y));
  const glass = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), K.M.glass()); glass.renderOrder = 5; g.add(glass);
  const bal = new THREE.Group(); bal.position.y = h - 0.03; g.add(bal);
  const bp = (k) => { const p = []; for (let i = 0; i <= 24; i++) { const u = i / 24; const w = Math.max(0, (u - 0.15) / 0.85), R = k * 0.105 * Math.sqrt(Math.max(0, Math.sin(Math.PI * w))) + 0.026 * (1 - u) ** 3; p.push(new THREE.Vector2(Math.max(0.002, u < 0.15 ? n + 0.006 : Math.max(n * (1 - w), R) + 0.02 * (1 - k) * Math.sin(u * 9)), u * (0.05 + 0.2 * k))); } return p; };
  const mat = new THREE.MeshPhysicalMaterial({ color, roughness: 0.25, clearcoat: 1, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(new THREE.LatheGeometry(bp(0), 36), mat); mesh.castShadow = true; bal.add(mesh);
  let last = -1;
  g.userData.set = (k) => { const q = Math.round(k * 40) / 40; if (q === last) return; last = q; mesh.geometry.dispose(); mesh.geometry = new THREE.LatheGeometry(bp(Math.max(0.02, q)), 36); mesh.rotation.z = 0.25 * (1 - q); };
  g.userData.set(0); g.scale.setScalar(s); return g;
}

/** Fig. 5.7: the Charles's-law rig on a tripod: a glass cylinder with a metal base (heat goes in from below), a free
 *  piston with a weight on top (the pressure stays the same), a thermometer clipped beside it. Bottom of the tripod at
 *  y 0; userData.set(h, T°C) = gas column height (0.05 … 0.42) and the thermometer reading; .floor = the cylinder floor y. */
export function charlesRig() {
  const g = new THREE.Group(), R = 0.08, F = 0.36, HMAX = 0.46;
  g.add(K.tripod(F - 0.012));
  const base = K.solid(new THREE.CylinderGeometry(R + 0.012, R + 0.012, 0.016, 40), K.M.metal(0x8a6a48, 0.35)); base.position.y = F - 0.004; g.add(base);
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(R, R, HMAX, 40, 1, true), K.M.glass()); glass.position.y = F + 0.006 + HMAX / 2; glass.renderOrder = 5; g.add(glass);
  for (let k = 1; k <= 7; k++) { const tk = new THREE.Mesh(new THREE.BoxGeometry(k % 2 ? 0.02 : 0.034, 0.003, 0.002), new THREE.MeshBasicMaterial({ color: 0xe8eef6 })); tk.position.set(-R * 0.5, F + 0.01 + (HMAX - 0.04) * k / 8, R + 0.003); g.add(tk); }
  const gasM = new THREE.MeshStandardMaterial({ color: 0x7fb6ff, transparent: true, opacity: 0.22, depthWrite: false });
  const gas = new THREE.Mesh(new THREE.CylinderGeometry(R - 0.006, R - 0.006, 1, 32).translate(0, 0.5, 0), gasM); gas.position.y = F + 0.012; gas.renderOrder = 4; g.add(gas);
  const piston = K.solid(new THREE.CylinderGeometry(R - 0.004, R - 0.004, 0.026, 40), K.M.matte(0x2a2e36, 0.6)); g.add(piston);
  const wt = weight(0.045, 0.045); g.add(wt);
  const th = K.thermometer(0.5, 200); th.position.set(R + 0.07, F - 0.1, 0.02); g.add(th);
  g.userData.set = (h, c) => { gas.scale.y = Math.max(1e-3, h); piston.position.y = F + 0.012 + h + 0.013 + 0.001; wt.position.y = piston.position.y + 0.013 + 0.001; th.userData.set(c); };
  g.userData.floor = F + 0.012; g.userData.th = th; g.userData.set(0.15, 27); return g;
}
