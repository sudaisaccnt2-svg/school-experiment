// House-style kit: every model, material and effect of every lesson comes from here (one look, made once, reused).
// Style = the style-lab picture the user liked: clear rim-lit glass, tinted see-through liquids, satin metals, matte
// solids with a thin dark outline, soft key + cool rim light, glowing things only where light really is.
// Motion helpers carry the animation principles: ease in/out, gravity + bounce (weight), overshoot pops.
import * as THREE from 'three';
import { rimGlass, studioGlass } from '../house.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
// smooth (indexed) sphere for organic shapes: shared vertices → soft normals, no facets
const smoothIco = (r, d) => { const g = new THREE.IcosahedronGeometry(r, d); g.deleteAttribute('normal'); g.deleteAttribute('uv'); return mergeVertices(g); };
import { makeFire } from '../fx.js';
// the look of a lesson: photo = a baked photo studio (real-reflection glass, stronger label halo so white letters read on a white wall)
export const LOOK = { halo: 1, photo: false };
const PHOTO_ENV = { value: null };
export { makeFire };

// ---------------------------------------------------------------- numbers and motion
export const clamp01 = (x) => Math.min(1, Math.max(0, x));
export const ease = (x) => { x = clamp01(x); return x * x * x * (x * (x * 6 - 15) + 10); };
export const span = (t, a, b) => clamp01((t - a) / (b - a));            // 0 before a … 1 after b
export const easeIn = (x) => clamp01(x) ** 2.2;                          // heavy things start slow
export const back = (x, k = 1.7) => { x = clamp01(x); const y = x - 1; return 1 + (k + 1) * y * y * y + k * y * y; };   // overshoot then settle
export const lerp = (a, b, u) => a + (b - a) * u;
export function hash(x, y = 0, z = 0) { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); }
export function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi;
  const s = (t) => t * t * (3 - 2 * t), u = s(xf), v = s(yf), w = s(zf), c = (a, b, d) => hash(xi + a, yi + b, zi + d);
  return lerp(lerp(lerp(c(0, 0, 0), c(1, 0, 0), u), lerp(c(0, 1, 0), c(1, 1, 0), u), v), lerp(lerp(c(0, 0, 1), c(1, 0, 1), u), lerp(c(0, 1, 1), c(1, 1, 1), u), v), w);
}
export const fbm = (x, y, z) => { let a = 0.5, s = 0; for (let k = 0; k < 4; k++) { s += a * vnoise(x, y, z); x *= 2.1; y *= 2.1; z *= 2.1; a *= 0.5; } return s; };
/** a dropped thing: still until t0, falls with gravity from y0, lands on y1 at t0+fall, bounces twice (weight) */
export function drop(t, t0, y0, y1, fall = 0.45, bounce = 0.12) {
  if (t < t0) return { y: y0, landed: false, k: 0 };
  const u = (t - t0) / fall;
  if (u < 1) return { y: lerp(y0, y1, u * u), landed: false, k: 0 };
  const s = (t - t0 - fall) / 0.42;                                       // two small, quick, damped bounces
  const b = s < 1 ? Math.abs(Math.sin(s * Math.PI * 2)) * bounce * Math.exp(-s * 3.2) : 0;
  return { y: y1 + b, landed: true, k: t - t0 - fall };
}
/** a point along a thrown arc from a to b (parabola peaking `lift` above), u in 0..1 */
export function arc(a, b, lift, u) { return new THREE.Vector3(lerp(a.x, b.x, u), lerp(a.y, b.y, u) + lift * 4 * u * (1 - u), lerp(a.z, b.z, u)); }

// ---------------------------------------------------------------- one family of materials
export const M = {
  glass: () => (LOOK.photo ? studioGlass(PHOTO_ENV) : rimGlass(0xdff0ff, 0.08, 0.9)),
  bubble: () => rimGlass(0xffffff, 0.25, 1.4),
  liquid: (c, o = 0.5) => (LOOK.photo                                // photo studio: clear, glossy liquid that catches the softboxes
    ? new THREE.MeshPhysicalMaterial({ color: new THREE.Color(c).multiplyScalar(0.85), roughness: 0.06, metalness: 0, transparent: true, opacity: Math.min(0.9, o * 1.1), depthWrite: false, envMapIntensity: 0.8, specularIntensity: 1 })
    : new THREE.MeshStandardMaterial({ color: c, roughness: 0.15, transparent: true, opacity: o, depthWrite: false })),
  metal: (c, r = 0.32) => new THREE.MeshStandardMaterial({ color: c, metalness: 0.9, roughness: r }),
  matte: (c, r = 0.75) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: 0 }),
  gloss: (c) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.15 }),
  vcol: (r = 0.95) => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: r }),
  glow: (c, k = 2) => new THREE.MeshStandardMaterial({ color: 0x000000, emissive: c, emissiveIntensity: k }),
};
// thin dark outline of constant screen width (house style for solids)
const INK = new THREE.ShaderMaterial({
  uniforms: { uPx: { value: 1.4 } },
  vertexShader: `uniform float uPx; void main() { vec4 c = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * normal); c.xy += normalize(n.xy + 1e-6) * uPx * 2.0 / vec2(1600.0, 900.0) * c.w; gl_Position = c; }`,
  fragmentShader: 'void main() { gl_FragColor = vec4(0.03, 0.04, 0.06, 1.0); }', side: THREE.BackSide,
});
export function ink(mesh) { const o = new THREE.Mesh(mesh.geometry, INK); o.raycast = () => {}; mesh.add(o); return mesh; }
export function solid(geo, mat, { cast = true, outline = true } = {}) {
  const m = new THREE.Mesh(geo, mat); m.castShadow = cast; m.receiveShadow = true; return outline ? ink(m) : m;
}

// ---------------------------------------------------------------- text in the world (clean bright letters, no shadow)
export function label(text, h = 0.22, color = '#ffffff', weight = 600) {
  const c = document.createElement('canvas'), x = c.getContext('2d'), px = 128;
  x.font = `${weight} ${px}px -apple-system, "Segoe UI", Roboto, sans-serif`;
  const w = Math.ceil(x.measureText(text).width) + 64; c.width = w; c.height = px * 1.5;
  x.font = `${weight} ${px}px -apple-system, "Segoe UI", Roboto, sans-serif`; x.textBaseline = 'middle';
  // a soft dark halo (blurred, not an offset copy) separates the letters from any background
  x.shadowColor = 'rgba(0, 0, 0, 0.9)'; x.shadowBlur = 22; x.fillStyle = 'rgba(0, 0, 0, 0.55)';
  for (let k = 0; k < 2 * LOOK.halo; k++) x.fillText(text, 32, c.height / 2);
  x.shadowBlur = 0; x.fillStyle = color; x.fillText(text, 32, c.height / 2);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false, toneMapped: false }));   // labels never hide behind glass/objects
  s.scale.set(h * c.width / c.height, h, 1); s.userData.h = h; s.userData.text = text; s.renderOrder = 20; return s;
}
/** pop a label (or anything) in with overshoot at t0; out at t1 */
export function popIn(o, t, t0, t1 = 1e9, base = 1) {
  const k = t < t1 ? back(span(t, t0, t0 + 0.4)) : 1 - ease(span(t, t1, t1 + 0.3));
  o.userData.t0 = t0; o.visible = k > 0.001; o.scale.copy(o.userData.s0 ?? (o.userData.s0 = o.scale.clone())).multiplyScalar(Math.max(1e-4, k * base));
}

// ---------------------------------------------------------------- lab glassware
export function beaker(r = 0.62, h = 1.55) {
  const prof = [[0, 0], [r, 0], [r + 0.04, 0.03], [r + 0.04, h], [r + 0.08, h + 0.05], [r + 0.1, h + 0.07], [r + 0.07, h + 0.07], [r + 0.01, h + 0.01], [r + 0.01, 0.05], [0, 0.05]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.Mesh(new THREE.LatheGeometry(prof, 64), M.glass()); g.renderOrder = 5; return g;
}
export function liquid(r, h, color, o = 0.5) {
  const grp = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 64, 1, true), M.liquid(color, o)); body.position.y = h / 2;   // open top: the surface disc is the only top (no two surfaces in one place → no flicker)
  const top = new THREE.Mesh(new THREE.CircleGeometry(r, 64), M.liquid(new THREE.Color(color).lerp(new THREE.Color(0xffffff), LOOK.photo ? 0.15 : 0.35), o + 0.1));
  top.rotation.x = -Math.PI / 2; top.position.y = h; grp.add(body, top); grp.userData.top = top; return grp;
}
export function vial(r = 0.16, h = 0.62) {
  const prof = [[0, 0], [r * 0.85, 0], [r, r * 0.25], [r, h], [r * 1.12, h + 0.02], [r * 1.12, h + 0.06], [r * 0.95, h + 0.06], [r * 0.95, r * 0.3], [0, 0.02]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), M.glass()); g.renderOrder = 5;
  const cap = solid(new THREE.CylinderGeometry(r * 1.2, r * 1.2, 0.09, 32), M.matte(0x2a2f3a, 0.5)); cap.position.y = h + 0.1;
  const grp = new THREE.Group(); grp.add(g, cap); return grp;
}
/** an irregular lump (metal granule, sodium piece, sulphur…): noise-shaped icosphere */
export function lump(size, mat, seed = 1, flat = 0.7, rough = 0.4) {
  const g = smoothIco(size, 5), p = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); v.multiplyScalar(1 - rough / 2 + rough * fbm(v.x * 6 / size * 0.17 + seed, v.y * 6 / size * 0.17, v.z * 6 / size * 0.17)); v.y *= flat; p.setXYZ(i, v.x, v.y, v.z); }
  g.computeVertexNormals(); return solid(g, mat);
}
/** rising bubbles from a point: instanced, born small, grow as they rise, burst at the surface */
export function bubbles(n, from, surfaceY, spread = 0.25, size = 0.02) {
  const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 14, 10), M.bubble(), n); mesh.frustumCulled = false; mesh.renderOrder = 6;
  const B = Array.from({ length: n }, (_, i) => ({ t0: hash(i, 1) * 3, x: (hash(i, 2) - 0.5) * spread, z: (hash(i, 3) - 0.5) * spread * 0.8, r: size * (0.6 + hash(i, 4)), s: 0.7 + hash(i, 5) * 0.6 }));
  const M4 = new THREE.Matrix4(), Qn = new THREE.Quaternion(), V = new THREE.Vector3(), S = new THREE.Vector3();
  mesh.userData.update = (t, rate, src = from) => {             // rate 0..1 = how strong the fizz is
    const h = surfaceY - src.y;
    B.forEach((b, i) => {
      const u = ((t * b.s * 0.45 + b.t0) % 1.4) / 1.4, on = hash(i, 9) < rate;
      V.set(src.x + b.x * (0.4 + u) + Math.sin(t * 6 + i) * 0.01 * u, src.y + u * h, src.z + b.z * (0.4 + u));
      S.setScalar(on && u < 0.985 ? b.r * (0.6 + u * 0.9) : 1e-5); M4.compose(V, Qn, S); mesh.setMatrixAt(i, M4);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
  return mesh;
}
/** splash where something hits water: a spreading ring + droplets on arcs, a function of time since impact */
export function splash(color = 0xffffff, size = 1) {
  const grp = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.06, 8, 48), M.bubble()); ring.rotation.x = Math.PI / 2; grp.add(ring);
  const drops = Array.from({ length: 10 }, (_, i) => { const d = new THREE.Mesh(new THREE.SphereGeometry(0.025 * size, 8, 6), M.bubble()); grp.add(d); return { d, a: i / 10 * Math.PI * 2 + hash(i) * 0.2, v: 0.8 + hash(i, 2) * 0.6 }; });
  grp.userData.update = (k) => {                                   // k = seconds since impact
    grp.visible = k > 0 && k < 0.9;
    ring.scale.setScalar(size * (0.05 + k * 0.5)); ring.material.uniforms.uEdge.value = 1.4 * (1 - k / 0.9);
    for (const { d, a, v } of drops) { const s = k * v; const rr = (0.1 + s * 0.35) * size; d.position.set(Math.cos(a) * rr, Math.max(0, (s * 1.6 - 4.9 * k * k)) * size * 0.6, Math.sin(a) * rr); d.visible = k < 0.55; }   // start on a small ring: never all in one spot
  };
  return grp;
}
export function smoke(n = 10, color = 0x9a9690) {
  const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c), grp = new THREE.Group();
  const S = Array.from({ length: n }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color, transparent: true, depthWrite: false, opacity: 0 })); grp.add(s); return s; });
  grp.userData.update = (t, k = 1) => S.forEach((s, i) => { const u = (t * 0.25 + i / n) % 1; s.position.set(Math.sin(u * 5 + i) * 0.15 * u, u * 2.2, 0); s.scale.setScalar(0.25 + u * 1.1); s.material.opacity = 0.3 * k * Math.sin(Math.PI * u); });
  return grp;
}
/** a 2D four-point twinkle star (for shiny surfaces): set .material.rotation and scale to make it twinkle */
let _star;
export function sparkle(color = 0xffffff, size = 0.12) {
  if (!_star) {
    const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
    const ray = (w, h) => { const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,0.5)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.save(); x.translate(64, 64); x.scale(w, h); x.translate(-64, -64); x.fillStyle = g; x.fillRect(0, 0, 128, 128); x.restore(); };
    x.globalCompositeOperation = 'lighter'; ray(1, 0.06); ray(0.06, 1); ray(0.25, 0.25);
    _star = new THREE.CanvasTexture(c);
  }
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: _star, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
  s.scale.setScalar(size); s.userData.size = size; return s;
}
let _paper;
/** a strip of paper bent along a path (points [y, z] in its own plane, x = across); wet(s) colours it from the bottom up to arc length s */
export function paperStrip(path, w, dry, wetColor, curl = 0.012) {
  if (!_paper) {                                                     // paper fibres: fine light speckle and short streaks
    const c = document.createElement('canvas'); c.width = 64; c.height = 256; const x = c.getContext('2d');
    x.fillStyle = '#f2f2f2'; x.fillRect(0, 0, 64, 256);
    for (let i = 0; i < 900; i++) { const v = 200 + Math.floor(hash(i, 1) * 55); x.fillStyle = `rgb(${v},${v},${v})`; x.fillRect(hash(i, 2) * 64, hash(i, 3) * 256, 1 + hash(i, 4) * 3, 1); }
    _paper = new THREE.CanvasTexture(c); _paper.colorSpace = THREE.SRGBColorSpace;
  }
  const curve = new THREE.CatmullRomCurve3(path.map(([y, z]) => new THREE.Vector3(0, y, z))), N = 80, L = curve.getLength();
  const pos = [], uv = [], col = [], idx = [], arc = [];
  for (let i = 0; i <= N; i++) {
    const p = curve.getPointAt(i / N), tg = curve.getTangentAt(i / N), nrm = new THREE.Vector3(1, 0, 0).cross(tg).normalize();
    for (let j = 0; j <= 4; j++) {                                   // 5 vertices across: the strip curls a little across its width (paper, not a slab)
      const sx = (j / 4 - 0.5) * w, c = curl * (1 - (2 * sx / w) ** 2);
      pos.push(sx, p.y + nrm.y * c, p.z + nrm.z * c); uv.push(j / 4, i / N * 4); col.push(1, 1, 1); arc.push(i / N * L);
    }
    if (i) for (let j = 0; j < 4; j++) { const a = 5 * (i - 1) + j, b = a + 5; idx.push(a, a + 1, b, a + 1, b + 1, b); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: _paper, vertexColors: true, roughness: 0.95, side: THREE.DoubleSide }));
  m.castShadow = true;
  const cd = new THREE.Color(dry), cw = new THREE.Color(wetColor), cc = new THREE.Color(), ca = g.attributes.color;
  m.userData = { length: L, wet: (front) => { for (let i = 0; i < arc.length; i++) { cc.copy(cd).lerp(cw, clamp01((front - arc[i]) / 0.06 + 0.5)); ca.setXYZ(i, cc.r, cc.g, cc.b); } ca.needsUpdate = true; } };
  m.userData.wet(0); return m;
}
export function glowSprite(color, size) {
  const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(0.35, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
  s.scale.setScalar(size); return s;
}

// ---------------------------------------------------------------- electricity
export function wire(points, color = 0xb8442f, r = 0.022) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const m = solid(new THREE.TubeGeometry(curve, Math.max(24, points.length * 16), r, 10), M.matte(color, 0.45), { outline: false });
  m.userData.curve = curve; return m;
}
/** glowing charge pulses travelling along a wire: show(t, from, to) = the front reaches u = to */
export function pulses(curve, n = 8, color = 0xffd27a) {
  const grp = new THREE.Group();
  const P = Array.from({ length: n }, () => { const s = glowSprite(color, 0.14); grp.add(s); return s; });
  grp.userData.update = (t, front = 1, alpha = 1) => P.forEach((s, i) => {
    const u = ((((t * 0.35 + i / n) % 1) + 1) % 1 || 0) * Math.max(0, front); s.position.copy(curve.getPointAt(Math.min(0.999, u))); s.material.opacity = alpha * (u < front - 0.02 ? 0.9 : 0);
  });
  return grp;
}
export function battery() {
  const grp = new THREE.Group();
  const body = solid(new THREE.CylinderGeometry(0.22, 0.22, 0.8, 40), M.gloss(0x24314f)); body.position.y = 0.4;
  const band = solid(new THREE.CylinderGeometry(0.225, 0.225, 0.2, 40), M.metal(0xc89a52, 0.35), { outline: false }); band.position.y = 0.69;   // top 0.79, under the body top 0.8 (never the same plane)
  const nub = solid(new THREE.CylinderGeometry(0.07, 0.07, 0.07, 24), M.metal(0xd8dde4, 0.3)); nub.position.y = 0.835;
  const plus = label('+', 0.22, '#ffd27a'); plus.position.set(0, 1.0, 0.0);
  grp.add(body, band, nub, plus); return grp;
}
export function bulb() {
  const grp = new THREE.Group();
  const base = solid(new THREE.LatheGeometry([[0, 0], [0.13, 0], [0.13, 0.04], [0.15, 0.06], [0.13, 0.08], [0.15, 0.1], [0.13, 0.12], [0.15, 0.14], [0.13, 0.16], [0.13, 0.2], [0, 0.2]].map(([x, y]) => new THREE.Vector2(x, y)), 32), M.metal(0xc9ccd2, 0.3));
  const glass = new THREE.Mesh(new THREE.SphereGeometry(0.3, 48, 32), M.glass()); glass.position.y = 0.46; glass.renderOrder = 5;
  const fil = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[-0.06, 0.22], [-0.06, 0.42], [-0.03, 0.47], [0, 0.42], [0.03, 0.47], [0.06, 0.42], [0.06, 0.22]].map(([x, y]) => new THREE.Vector3(x, y, 0))), 40, 0.008, 6), M.glow(0xffc46b, 0));
  const halo = glowSprite(0xffd690, 1.8); halo.position.y = 0.45; halo.material.opacity = 0;
  const lamp = new THREE.PointLight(0xffd29a, 0, 6, 2); lamp.position.y = 0.46;
  grp.add(base, glass, fil, halo, lamp);
  grp.userData.set = (k) => { fil.material.emissiveIntensity = 6 * k; halo.material.opacity = 0.85 * k; lamp.intensity = 3 * k; };
  return grp;
}

// ---------------------------------------------------------------- atoms and ions (real 3D, nucleus always shown)
export function nucleus(p, n, r = 0.3) {
  // two instanced meshes (protons, neutrons): one draw each, however big the nucleus (frame rate on phones)
  const grp = new THREE.Group(), total = p + n, geo = new THREE.SphereGeometry(1, 20, 14), pos = [[], []];
  for (let i = 0; i < total; i++) {
    const y = 1 - (i + 0.5) / total * 2, rr = Math.sqrt(1 - y * y), a = i * 2.39996;
    const k = Math.cbrt((i + 0.5) / total); if (total > 40 && k < 0.6) continue;   // big nuclei: the hidden core balls would sit on top of each other (flicker)
    pos[(i * 7) % total < p ? 0 : 1].push(new THREE.Vector3(Math.cos(a) * rr, y, Math.sin(a) * rr).multiplyScalar(r * k * 0.95));
  }
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(r * 0.24, r * 0.24, r * 0.24);
  [[0xd2453a, pos[0]], [0x9aa3ad, pos[1]]].forEach(([c, P]) => {
    if (!P.length) return; const m = new THREE.InstancedMesh(geo, M.gloss(c), P.length); m.castShadow = true;
    P.forEach((v, i) => m.setMatrixAt(i, m4.compose(v, q, sc))); grp.add(m);
  });
  return grp;
}
/** shells: thin 3D rings (each a little tilted) with electrons going round; returns { group, electrons[], rings[], update } */
export function atom(shells, p, n, r0 = 0.5, dr = 0.32) {
  const grp = new THREE.Group(); grp.add(nucleus(p, n));
  const eGeo = new THREE.SphereGeometry(0.055, 16, 12), eMat = M.glow(0x59a8ff, 2.2);
  const rings = [], electrons = [];
  shells.forEach((count, s) => {
    const R = r0 + s * dr, tilt = new THREE.Group(); tilt.rotation.set(0.35 + s * 0.12, 0, (s % 2 ? -1 : 1) * 0.25);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(R, 0.006, 6, 128), new THREE.MeshBasicMaterial({ color: 0x6f9fe8, transparent: true, opacity: 0.55, toneMapped: false }));
    ring.rotation.x = Math.PI / 2; tilt.add(ring); grp.add(tilt); rings.push(tilt);
    for (let i = 0; i < count; i++) {
      const e = new THREE.Mesh(eGeo, eMat); e.add(glowSprite(0x59a8ff, 0.32)); tilt.add(e);
      electrons.push({ e, R, a0: i / count * Math.PI * 2, w: 0.9 / (1 + s * 0.5), shell: s });
    }
  });
  const update = (t) => { for (const x of electrons) if (!x.free) { const a = x.a0 + t * x.w; x.e.position.set(Math.cos(a) * x.R, 0, Math.sin(a) * x.R); } };
  return { group: grp, electrons, rings, update };
}
export function ion(r, color, sign) {
  const grp = new THREE.Group(); const s = solid(new THREE.SphereGeometry(r, 48, 32), M.gloss(color)); grp.add(s);
  const l = label(sign, r * 0.7, '#ffffff', 700); l.position.set(r * 0.75, r * 0.75, r * 0.3); grp.add(l); grp.userData.sign = l; return grp;
}

// ---------------------------------------------------------------- periodic table tile (rounded block, symbol on its face)
export function tile(sym, color, w = 0.62, h = 0.52, d = 0.16) {
  const g = new THREE.BoxGeometry(w, h, d, 6, 6, 2), p = g.attributes.position, v = new THREE.Vector3(), rr = 0.05;
  for (let i = 0; i < p.count; i++) {                              // round the edges
    v.fromBufferAttribute(p, i); const c = new THREE.Vector3(Math.sign(v.x) * Math.max(0, Math.abs(v.x) - (w / 2 - rr)), Math.sign(v.y) * Math.max(0, Math.abs(v.y) - (h / 2 - rr)), Math.sign(v.z) * Math.max(0, Math.abs(v.z) - (d / 2 - rr)));
    const core = v.clone().sub(c); if (c.length() > 0) c.setLength(rr * Math.min(1, c.length() / rr * 1.0) || rr); p.setXYZ(i, core.x + c.x, core.y + c.y, core.z + c.z);
  }
  g.computeVertexNormals();
  const grp = new THREE.Group(), body = solid(g, M.gloss(color)); grp.add(body);
  const t = label(sym, h * 0.5, '#ffffff', 700); t.position.z = d / 2 + 0.01; grp.add(t);
  grp.userData.body = body; grp.userData.text = t; return grp;
}

// ---------------------------------------------------------------- earth: rocks, grains, crystals
export function rock(size, c1, c2, seed = 3) {
  const g = smoothIco(1, 5), p = g.attributes.position, v = new THREE.Vector3(), col = [];
  const A = new THREE.Color(c1), B = new THREE.Color(c2);
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = fbm(v.x * 1.6 + seed, v.y * 1.6, v.z * 1.6), facet = Math.round(fbm(v.x * 2.2, v.y * 2.2 + seed, v.z * 2.2) * 5) / 5;
    v.multiplyScalar(0.7 + 0.5 * n + 0.1 * facet + 0.05 * vnoise(v.x * 6, v.y * 6, v.z * 6) + 0.015 * vnoise(v.x * 25, v.y * 25, v.z * 25));   // chunky planes + grain: a mineral, not a pebble v.x *= 1.5; v.y *= 0.62;
    p.setXYZ(i, v.x * size, Math.max(-0.05, v.y) * size, v.z * size);
    const band = 0.5 + 0.5 * Math.sin(v.y * 9 + v.x * 2 + n * 4);      // layers in the rock
    const c = A.clone().lerp(B, band * 0.8 + vnoise(v.x * 20, v.y * 20, v.z * 20) * 0.2); col.push(c.r, c.g, c.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
  return solid(g, M.vcol(0.85));
}

// ---------------------------------------------------------------- fire leftovers: ash heap + burnt sticks (style lab)
export function ashHeap(r = 1) {
  const hg = new THREE.SphereGeometry(1, 96, 48, 0, Math.PI * 2, 0, Math.PI / 2), p = hg.attributes.position, col = [], v = new THREE.Vector3();
  const c1 = new THREE.Color(0x77736c), c2 = new THREE.Color(0x4a4641), c3 = new THREE.Color(0x191715);   // dull warm greys, sooty flecks
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = fbm(v.x * 3 + 4, v.y * 3, v.z * 3), fine = vnoise(v.x * 30, v.y * 30, v.z * 30), k = 0.85 + 0.3 * n + 0.05 * fine;
    p.setXYZ(i, v.x * 1.05 * k * r, (Math.pow(Math.max(0, v.y), 1.6) * 0.38 * k + 0.012 * fine + 0.01 * vnoise(v.x * 60, v.y * 60, v.z * 60)) * r, v.z * 0.95 * k * r);
    const c = c1.clone().lerp(c2, Math.min(1, n * 1.1 + fine * 0.25)); if (fine > 0.86) c.lerp(c3, 0.8); col.push(c.r, c.g, c.b);
  }
  hg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); hg.computeVertexNormals();
  return solid(hg, M.vcol());
}
let _cracks;
function crackTexture() {
  if (_cracks) return _cracks;
  const c = document.createElement('canvas'); c.width = 256; c.height = 256; const x = c.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(0, 0, 256, 256); x.strokeStyle = '#ffffff'; x.lineCap = 'round';
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let k = 0; k < 18; k++) {
    let px = rnd() * 256, py = rnd() * 256; x.lineWidth = 1 + rnd() * 2.5; x.beginPath(); x.moveTo(px, py);
    const across = k % 2; for (let s = 0; s < 6; s++) { px += across ? 40 + rnd() * 10 : rnd() * 10 - 5; py += across ? rnd() * 10 - 5 : 40 + rnd() * 10; x.lineTo(px, py); }
    x.shadowColor = '#fff'; x.shadowBlur = 6; x.stroke();
  }
  _cracks = new THREE.CanvasTexture(c); _cracks.wrapS = _cracks.wrapT = THREE.RepeatWrapping; return _cracks;
}
/** a stick of wood: bark brown when fresh; burn(k) chars it black with glowing cracks (k 0 → 1) */
export function stick(len, r, seed = 1) {
  const g = new THREE.CylinderGeometry(r * 0.8, r, len, 9, 10), q = g.attributes.position, v = new THREE.Vector3();
  for (let j = 0; j < q.count; j++) { v.fromBufferAttribute(q, j); const k = 0.85 + 0.3 * fbm(v.x * 20 + seed, v.y * 8, v.z * 20); q.setXYZ(j, v.x * k, v.y, v.z * k); }
  g.computeVertexNormals();
  const m = new THREE.MeshStandardMaterial({ color: 0x5a3a22, roughness: 0.9, emissive: 0xff4a10, emissiveMap: crackTexture(), emissiveIntensity: 0 });
  const o = solid(g, m), fresh = new THREE.Color(0x5a3a22), burnt = new THREE.Color(0x0d0b0a);
  o.userData.burn = (k, glow) => { m.color.copy(fresh).lerp(burnt, clamp01(k)); m.emissiveIntensity = glow; };
  return o;
}
/** a sealed glass ampoule on a little stand */
export function ampoule() {
  const grp = new THREE.Group();
  const prof = [[0, 0], [0.12, 0], [0.16, 0.04], [0.16, 0.42], [0.06, 0.56], [0.035, 0.62], [0.035, 0.8], [0.012, 0.86], [0, 0.86]].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), M.glass()); g.renderOrder = 5; g.position.y = 0.28;
  const base = solid(new THREE.CylinderGeometry(0.42, 0.46, 0.06, 48), M.metal(0x7d848f, 0.35)); base.position.y = 0.03;
  const cup = solid(new THREE.CylinderGeometry(0.2, 0.18, 0.22, 40), M.metal(0xaab1bb, 0.45)); cup.position.y = 0.17;
  grp.add(base, cup, g); return grp;
}

// ---------------------------------------------------------------- book Fig. 8.1 objects
/** lithium coin cell (CR2032-like), standing up so its face shows */
export function coinCell() {
  const grp = new THREE.Group();
  const can = solid(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 64), M.metal(0xc9ccd2, 0.25)); can.rotation.x = Math.PI / 2;
  const lid = solid(new THREE.CylinderGeometry(0.27, 0.27, 0.07, 64), M.metal(0xb4b9c1, 0.35), { outline: false }); lid.rotation.x = Math.PI / 2;
  const t = label('Li  3V', 0.14, '#3a4050', 700); t.position.z = 0.045;
  grp.add(can, lid, t); grp.rotation.x = -0.25; grp.position.y = 0.3; const g = new THREE.Group(); g.add(grp); return g;
}
/** a block of sodium in two halves: dull grey crust outside, bright metal where it is cut. open(k) parts the halves */
/** a block of sodium as it comes out of the oil: rounded, lumpy, a dull grey crust with whitish patches. Cut by a knife
 *  it shows a flat mirror-bright silver face (shine) that the air dulls. inner = +1 / −1: that x side stays a flat cut. */
function crustBox(w, h, d, inner, mats) {
  const g = new THREE.BoxGeometry(w, h, d, 16, 10, 12), p = g.attributes.position, he = new THREE.Vector3(w / 2, h / 2, d / 2), rr = Math.min(w, h, d) * 0.22;
  const v = new THREE.Vector3(), c = new THREE.Vector3(), dir = new THREE.Vector3(), col = [], base = new THREE.Color(0x8d897f), pale = new THREE.Color(0xc9c1ae), dark = new THREE.Color(0x6c6961);
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const lo = (ax) => -(he[ax] - (inner === -1 && ax === 'x' ? 0 : rr)), hi = (ax) => he[ax] - (inner === 1 && ax === 'x' ? 0 : rr);
    c.set(THREE.MathUtils.clamp(v.x, lo('x'), hi('x')), THREE.MathUtils.clamp(v.y, lo('y'), hi('y')), THREE.MathUtils.clamp(v.z, lo('z'), hi('z')));
    dir.subVectors(v, c); const L = dir.length();
    const wx = (v.x + 7.3) * 9, n = vnoise(wx, v.y * 9 + 3.1, v.z * 9 + 1.7) - 0.5, n2 = vnoise(wx * 2.7, v.y * 25, v.z * 25) - 0.5;
    if (L > 1e-6) { dir.multiplyScalar(1 / L); v.copy(c).addScaledVector(dir, rr * (1 + 0.18 * n + 0.05 * n2)); }
    p.setXYZ(i, v.x, v.y, v.z);
    const k = THREE.MathUtils.clamp(0.5 + 1.6 * n + 0.6 * n2, 0, 1), cc = base.clone().lerp(k > 0.62 ? pale : dark, k > 0.62 ? (k - 0.62) * 2.2 : (0.62 - k) * 0.9);
    col.push(cc.r, cc.g, cc.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
  const m = new THREE.Mesh(g, mats); m.castShadow = m.receiveShadow = true; return ink(m);
}
export function sodiumBlock(w = 0.5, h = 0.24, d = 0.3) {
  const crust = new THREE.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, roughness: 0.9, metalness: 0.05 });
  const shine = new THREE.MeshPhysicalMaterial({ color: 0xf4f6f8, metalness: 0.3, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05 });   // bright polished silver lit by the room's lights
  const half = (inner) => { const mats = [crust, crust, crust, crust, crust, crust]; mats[inner] = shine; return crustBox(w / 2, h, d, inner === 0 ? 1 : -1, mats); };
  const a = half(0), b = half(1); a.position.set(-w / 4, h / 2, 0); b.position.set(w / 4, h / 2, 0);
  const whole = crustBox(w, h, d, 0, crust); whole.position.y = h / 2;
  const grp = new THREE.Group(); grp.add(whole, a, b); a.visible = b.visible = false;
  // one whole block until the knife is through; then two halves (their cut faces never sit together in one plane on screen)
  grp.userData = { a, b, shine, crust, split: (on) => { whole.visible = !on; a.visible = b.visible = on; }, open: (k) => { a.position.x = -w / 4 - 0.04 * k; b.position.x = w / 4 + 0.16 * k; b.rotation.z = -0.12 * k; } };
  return grp;
}
export function knife() {
  const grp = new THREE.Group();
  const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(0.7, 0); s.quadraticCurveTo(0.72, 0.1, 0.62, 0.14); s.lineTo(0, 0.14); s.lineTo(0, 0);
  const blade = solid(new THREE.ExtrudeGeometry(s, { depth: 0.008, bevelEnabled: false }), M.metal(0xdfe3e8, 0.2));
  blade.position.z = -0.004;
  const handle = solid(new THREE.BoxGeometry(0.4, 0.09, 0.05), M.matte(0x2b2420, 0.6)); handle.position.set(-0.2, 0.09, 0);
  grp.add(blade, handle); return grp;                               // blade edge along y = 0, from x = 0 to 0.7
}
/** a banana: tapered curved body, yellow with brown tips */
export function banana(len = 0.9, r = 0.085, bend = 0.25) {
  const N = 40, S = 10, pos = [], col = [], idx = [];
  const yel = new THREE.Color(0xf0cc48), tip = new THREE.Color(0x4a3418), grn = new THREE.Color(0xb8c24a);
  for (let i = 0; i <= N; i++) {
    const u = i / N, x = (u - 0.5) * len, y = -bend * 4 * (u - 0.5) ** 2 + bend, ang = Math.atan(-bend * 8 * (u - 0.5) / len);
    const rr = r * Math.pow(Math.sin(Math.PI * Math.min(0.97, Math.max(0.03, u))), 0.55);
    for (let j = 0; j < S; j++) {
      const a = j / S * Math.PI * 2, k = 1 + 0.06 * Math.cos(a * 5);                 // five soft ridges
      const ny = Math.cos(a) * rr * k, nz = Math.sin(a) * rr * k;
      pos.push(x - Math.sin(ang) * ny, y + Math.cos(ang) * ny, nz);
      const c = (u < 0.05 || u > 0.96) ? tip : u < 0.14 ? grn.clone().lerp(yel, (u - 0.05) / 0.09) : yel; col.push(c.r, c.g, c.b);
    }
  }
  for (let i = 0; i < N; i++) for (let j = 0; j < S; j++) { const a = i * S + j, b = i * S + (j + 1) % S, c = a + S, d = b + S; idx.push(a, b, c, b, d, c); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals();
  return solid(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55 }));
}
/** a sealed glass tube lying down with a metal sample inside (how Rb and Cs are kept) */
export function sealedTube(metalColor, len = 0.8) {
  const grp = new THREE.Group();
  const prof = [[0, 0], [0.05, 0.005], [0.085, 0.04], [0.085, len - 0.06], [0.03, len - 0.01], [0.012, len + 0.06], [0, len + 0.07]].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), M.glass()); g.renderOrder = 5; g.rotation.z = -Math.PI / 2; g.position.set(-len / 2, 0.09, 0);
  const m = lump(0.06, M.metal(metalColor, 0.18), 4, 1, 0.3); m.scale.set(3.2, 0.9, 1); m.position.set(-0.05, 0.065, 0);
  grp.add(g, m); return grp;
}

// ---------------------------------------------------------------- lab set pieces shared by the reaction lessons (804 …)
/** a glass tank of water: the bottom sits between the walls, front/back walls cover the corners (no face shares a
 *  plane with another). userData.top = the water surface height. */
export function tank(W = 2.4, D = 1.0, H = 0.8, level = 0.585, th = 0.025) {
  const grp = new THREE.Group();
  const pane = (w, h, d, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M.glass()); m.position.set(x, y, z); m.renderOrder = 5; grp.add(m); };
  pane(W - th - 0.006, th, D - th - 0.006, 0, th / 2 + 0.002, 0); pane(th, H, D - th - 0.004, -W / 2, H / 2, 0); pane(th, H, D - th - 0.004, W / 2, H / 2, 0);
  pane(W + th, H, th, 0, H / 2, -D / 2); pane(W + th, H, th, 0, H / 2, D / 2);
  const wb = new THREE.Mesh(new THREE.BoxGeometry(W - 0.07, level - 0.045, D - 0.07), M.liquid(0x5aa0d8, 0.38)); wb.position.y = 0.035 + (level - 0.045) / 2;
  const wt = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.07, D - 0.07), M.liquid(0x9fd0f0, 0.45)); wt.rotation.x = -Math.PI / 2; wt.position.y = level;
  grp.add(wb, wt); grp.userData.top = level; return grp;
}
/** a Bunsen burner with its blue flame (open tube: no cap meets the base). userData.flame = the fire (update it). */
export function burner() {
  const grp = new THREE.Group();
  const base = solid(new THREE.CylinderGeometry(0.15, 0.17, 0.04, 40), M.metal(0x3a3f48, 0.4)); base.position.y = 0.02;
  const tube = solid(new THREE.CylinderGeometry(0.042, 0.045, 0.5, 32, 1, true), M.metal(0xb9bec6, 0.3)); tube.material.side = THREE.DoubleSide; tube.position.y = 0.3;
  const collar = solid(new THREE.CylinderGeometry(0.056, 0.056, 0.06, 32, 1, true), M.metal(0x8a7a5a, 0.35)); collar.position.y = 0.14;
  const hose = solid(new THREE.CylinderGeometry(0.018, 0.018, 0.22, 12), M.matte(0xb8442f, 0.5)); hose.rotation.z = Math.PI / 2; hose.position.set(-0.2, 0.06, 0);
  const flame = makeFire(0x3d6bff, 0.32, { core: 0xa8c8ff, embers: false, light: false }); flame.position.y = 0.56;   // starts just above the tube's rim
  grp.add(base, tube, collar, hose, flame); grp.userData.flame = flame; return grp;
}
/** a deflagrating spoon: a small steel cup with a long handle rising from its rim and a hook at the top.
 *  The cup's centre is the group origin; a lump rests at y ≈ -0.03. */
export function spoon(len = 0.5) {
  const grp = new THREE.Group(), steel = M.metal(0xc9ced6, 0.3);
  const cupM = steel.clone(); cupM.side = THREE.DoubleSide;
  const cup = new THREE.Mesh(new THREE.SphereGeometry(0.065, 28, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), cupM); cup.castShadow = true;
  const h = solid(new THREE.CylinderGeometry(0.008, 0.008, len, 8), steel, { outline: false }); h.position.set(0.068, len / 2, 0);
  const hook = solid(new THREE.TorusGeometry(0.026, 0.007, 8, 20, Math.PI), steel, { outline: false }); hook.rotation.y = Math.PI / 2; hook.position.set(0.068, len, 0);   // curls over a rod running along x
  grp.add(cup, h, hook); return grp;
}
/** a gas jar (glass cylinder, sand on the floor) full of a coloured gas, with a glass lid.
 *  userData: gas (its material: colour/opacity can change), lid (mesh), h. */
export function gasJar(color = 0xc8e06a, r = 0.17, h = 0.7) {
  const grp = new THREE.Group();
  const prof = [[0, 0], [r, 0], [r, h], [r + 0.02, h], [r + 0.02, h + 0.012], [r - 0.012, h + 0.012], [r - 0.012, 0.03], [0, 0.03]].map(([x, y]) => new THREE.Vector2(x, y));
  const glass = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), M.glass()); glass.renderOrder = 5;
  const sand = solid(new THREE.CylinderGeometry(r - 0.022, r - 0.022, 0.02, 32), M.matte(0xcbb48a, 0.95), { outline: false }); sand.position.y = 0.042;
  const gasM = new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.32, roughness: 1, depthWrite: false, side: THREE.DoubleSide });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(r - 0.016, r - 0.016, h - 0.1, 32, 1, true), gasM); body.position.y = 0.055 + (h - 0.1) / 2; body.renderOrder = 4;
  const top = new THREE.Mesh(new THREE.CircleGeometry(r - 0.016, 32), gasM); top.rotation.x = -Math.PI / 2; top.position.y = h - 0.045; top.renderOrder = 4;
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(r + 0.035, r + 0.035, 0.012, 40), M.glass()); lid.position.y = h + 0.026; lid.renderOrder = 5;   // a clear gap above the rim (no shared plane)
  grp.add(glass, sand, body, top, lid); grp.userData = { gas: gasM, lid, h }; return grp;
}

/** gas that reads as GAS (817 v3: a tinted cylinder read as juice): soft wisps that drift and curl inside a jar.
 *  Put the group at the jar's floor; update(t, y0, y1, r, k) keeps n wisps between heights y0..y1 inside radius r,
 *  k = how much gas (0 = none). Pair it with a very faint tint on the jar's own gas (opacity ≈ 0.08). */
let _wisp;
export function gasCloud(color, n = 12) {
  if (!_wisp) {
    const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,0.85)'); g.addColorStop(0.45, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 64); _wisp = new THREE.CanvasTexture(c);
  }
  const grp = new THREE.Group(), W = Array.from({ length: n }, (_, i) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: _wisp, color, transparent: true, depthWrite: false, opacity: 0 })); s.renderOrder = 4; grp.add(s);
    return { s, a: hash(i, 1) * 6.28, v: 0.25 + 0.35 * hash(i, 2), y: hash(i, 3), r: 0.35 + 0.6 * hash(i, 4), z: hash(i, 5) };
  });
  grp.userData.update = (t, y0, y1, r, k = 1) => W.forEach(({ s, a, v, y, r: rr, z }, i) => {
    const ang = a + t * v, yy = y0 + (y1 - y0) * ((y + 0.05 * t * v + 0.08 * Math.sin(t * 0.7 + i)) % 1);
    s.position.set(Math.cos(ang) * r * rr * 0.75, yy, Math.sin(ang) * r * rr * 0.75);
    s.scale.setScalar(r * (1.0 + 0.6 * z)); s.material.opacity = 0.62 * k * (0.6 + 0.4 * Math.sin(t * 0.9 + i * 1.7) ** 2); s.visible = k > 0.01;
  });
  return grp;
}

// ---------------------------------------------------------------- equations BUILT from the things on screen
/** slots[j][m] = token j for version m (e.g. the metal); version 0 is built token by token, each later version only
 *  swaps the tokens that change ("same pattern"). src(m, j) → { lab, tIn, at(t) } makes token j of version m fly
 *  out of that label (which pops in at tIn and hides when its token leaves); away = [[t0, t1]] hides the line while
 *  something else is shown close. Returns update(t). */
let EQN = 0;
export function equation(scene, { slots, y, z, x0, h = 0.16, starts, tokenStarts, src, end, away = [] }) {
  const L = slots.map((row) => row.map(() => null)), gid = 'eq' + (++EQN);   // gid: the whole equation counts as ONE text (engine oneText)
  slots.forEach((row, j) => row.forEach((s, m) => {
    L[j][m] = m > 0 && s === row[m - 1] ? L[j][m - 1] : label(s, h, /^[+→<]$/.test(s.trim()) ? '#ffffff' : '#f6d48f', 700);
    L[j][m].userData.group = gid;
    if (!L[j][m].parent) scene.add(L[j][m]);
  }));
  const wOf = slots.map((row, j) => Math.max(...row.map((_, m) => L[j][m].scale.x)) - h / 3 + 0.3 * h);   // text width (the label's padding is h/3) + an even gap
  const total = wOf.reduce((a, b) => a + b, 0); let cx = x0 - total / 2;
  const pos = wOf.map((w) => { const p = new THREE.Vector3(cx + w / 2, y, z); cx += w; return p; });
  const toks = [];                                                   // {lab, m, j, t0, t1}
  slots.forEach((_, j) => toks.push({ lab: L[j][0], m: 0, j, t0: tokenStarts?.[j] ?? starts[0] + j * 0.45 }));
  for (let m = 1; m < starts.length; m++) {
    let k = 0;
    slots.forEach((row, j) => { if (row[m] !== row[m - 1]) { const old = toks.find((o) => o.lab === L[j][m - 1]); old.t1 = starts[m]; toks.push({ lab: L[j][m], m, j, t0: starts[m] + 0.35 + 0.45 * k++ }); } });
  }
  toks.forEach((o) => { o.t1 ??= end; o.src = src(o.m, o.j); });
  return (t) => toks.forEach(({ lab, j, t0, t1, src: sc }) => {
    if (sc) {                                                       // the name leaves its thing and becomes the symbol
      sc.lab.position.copy(sc.at(t)); popIn(sc.lab, t, sc.tIn, t0);
      lab.position.copy(sc.at(t0)).lerp(pos[j], ease(span(t, t0, t0 + 0.6)));
    } else lab.position.copy(pos[j]);
    popIn(lab, t, t0 - 0.01, t1);
    const k = away.reduce((a, [p, q]) => a * (1 - ease(span(t, p, p + 0.3)) * (1 - ease(span(t, q, q + 0.3)))), 1);
    if (k < 1) { lab.scale.multiplyScalar(Math.max(1e-4, k)); lab.visible = lab.visible && k > 0.01; }
  });
}

// ---------------------------------------------------------------- 804 v2 set pieces: tongs, tripod, dish, wooden bench
/** crucible tongs: two steel arms hinged at the top; the group origin is the point between the tips (where the piece
 *  is held). userData.set(gap) opens the tips to half-gap `gap`. */
export function tongs(len = 0.7) {
  const grp = new THREE.Group(), steel = M.metal(0xc9ced6, 0.28), piv = [];
  for (const s of [-1, 1]) {
    const p = new THREE.Group(); p.position.y = len; grp.add(p); piv.push([p, s]);
    const c = new THREE.CatmullRomCurve3([[0, 0], [s * 0.035, -len * 0.25], [s * 0.03, -len * 0.75], [s * 0.012, -len]].map(([x, y]) => new THREE.Vector3(x, y, 0)));
    p.add(solid(new THREE.TubeGeometry(c, 30, 0.007, 8), steel, { outline: false }));
    const pad = solid(new THREE.SphereGeometry(0.013, 12, 8), steel, { outline: false }); pad.position.set(s * 0.012, -len, 0); p.add(pad);
  }
  const bow = solid(new THREE.TorusGeometry(0.025, 0.007, 8, 20, Math.PI), steel, { outline: false }); bow.position.y = len + 0.001; grp.add(bow);
  grp.userData.set = (gap) => { const a = Math.asin(clamp01(Math.max(0, gap - 0.012) / len)); piv.forEach(([p, s]) => { p.rotation.z = s * a; }); };
  grp.userData.set(0.06); return grp;
}
/** a steel tripod stand: ring on top at height h (radius r), three splayed legs */
export function tripod(h = 0.62, r = 0.16) {
  const grp = new THREE.Group(), steel = M.metal(0x6f7680, 0.4);
  const ring = solid(new THREE.TorusGeometry(r, 0.012, 10, 48), steel, { outline: false }); ring.rotation.x = Math.PI / 2; ring.position.y = h; grp.add(ring);
  for (let k = 0; k < 3; k++) {
    const a = k / 3 * Math.PI * 2 + 0.5, top = new THREE.Vector3(Math.cos(a) * r, h, Math.sin(a) * r), foot = new THREE.Vector3(Math.cos(a) * r * 1.6, 0.006, Math.sin(a) * r * 1.6);
    const d = top.clone().sub(foot), leg = solid(new THREE.CylinderGeometry(0.01, 0.01, d.length(), 8), steel, { outline: false });
    leg.position.copy(foot).addScaledVector(d, 0.5); leg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); grp.add(leg);
  }
  return grp;
}
/** a shallow steel dish (bottom at y 0, inner floor ≈ 0.012) */
export function dish(r = 0.15) {
  const m = M.metal(0x8d939b, 0.38); m.side = THREE.DoubleSide;
  const prof = [[0, 0], [r * 0.55, 0.004], [r * 0.9, 0.03], [r, 0.055], [r * 0.95, 0.056], [r * 0.86, 0.034], [r * 0.52, 0.014], [0, 0.012]].map(([x, y]) => new THREE.Vector2(x, y));
  return solid(new THREE.LatheGeometry(prof, 48), m);
}
let _wood;
/** a dark warm wooden bench top (its top face at y = -0.002, just under everything that stands on it) */
export function bench(w = 3.6, d = 1.4) {
  if (!_wood) {
    const c = document.createElement('canvas'); c.width = 512; c.height = 128; const x = c.getContext('2d');
    x.fillStyle = '#4a3526'; x.fillRect(0, 0, 512, 128);
    for (let i = 0; i < 140; i++) { const y = hash(i, 1) * 128, v = hash(i, 2); x.strokeStyle = `rgba(${v > 0.5 ? '90,64,44' : '40,28,20'},${0.25 + 0.35 * hash(i, 3)})`; x.lineWidth = 0.5 + hash(i, 4) * 2; x.beginPath(); x.moveTo(0, y); for (let s = 1; s <= 8; s++) x.lineTo(s * 64, y + Math.sin(s + i) * 3 * hash(i, 5)); x.stroke(); }
    _wood = new THREE.CanvasTexture(c); _wood.colorSpace = THREE.SRGBColorSpace; _wood.wrapS = _wood.wrapT = THREE.RepeatWrapping;
  }
  const tex = _wood.clone(); tex.needsUpdate = true; tex.repeat.set(w / 2.2, d / 1.1);
  const m = solid(new THREE.BoxGeometry(w, 0.07, d), new THREE.MeshStandardMaterial({ map: tex, color: 0x9a8070, roughness: 0.62 }), { outline: false });
  m.position.y = -0.037; m.castShadow = false; m.name = 'bench'; return m;
}

// ---------------------------------------------------------------- a formula explained three ways (user: "I don't understand the formulas")
// rows, top to bottom: ATOMS (balls that really swap partners: count them = the big numbers), SYMBOLS, plain WORDS.
// Version 0 builds it (words fly in from the things, molecules pop, the atoms rearrange, symbols appear over them);
// each later version ("same pattern") sends the atoms back, swaps the metal, words and symbols, and replays.
export const ATOM = { Li: [0xc9ced8, 0.075], Na: [0xc9ced8, 0.09], K: [0xc9ced8, 0.105], O: [0xe0483c, 0.08], H: [0xf4f4f4, 0.05], Cl: [0x86d24e, 0.09], Br: [0xa8452c, 0.1], S: [0xe8c94a, 0.1], Mg: [0xb4b8bf, 0.085], Ti: [0x8c939c, 0.1], Ca: [0xe9e2cf, 0.1], N: [0x4a7be0, 0.075], SO4: [0xe8c94a, 0.13], F: [0xe8dc6a, 0.07], I: [0x7a52b0, 0.12], Cu: [0xc8763c, 0.1], P: [0xe07a2a, 0.1] };
export const MOL = {
  M: [['M', 0, 0]], H2O: [['O', 0, 0], ['H', -0.085, -0.06], ['H', 0.085, -0.06]], O2: [['O', -0.075, 0], ['O', 0.075, 0]],
  Cl2: [['Cl', -0.085, 0], ['Cl', 0.085, 0]], H2: [['H', -0.045, 0], ['H', 0.045, 0]], MOH: [['M', -0.16, 0], ['O', 0, 0], ['H', 0.11, 0]],
  M2O: [['M', -0.16, 0], ['O', 0, 0], ['M', 0.16, 0]], MCl: [['M', -0.1, 0], ['Cl', 0.1, 0]],
  MH: [['M', -0.07, 0], ['H', 0.09, 0]], Br2: [['Br', -0.095, 0], ['Br', 0.095, 0]], MBr: [['M', -0.1, 0], ['Br', 0.1, 0]],
  S: [['S', 0, 0]], M2S: [['M', -0.17, 0], ['S', 0, 0], ['M', 0.17, 0]], MgO: [['Mg', -0.09, 0], ['O', 0.08, 0]], Mg: [['Mg', 0, 0]],
  TiCl4: [['Ti', 0, 0], ['Cl', -0.18, 0], ['Cl', 0.18, 0], ['Cl', 0, 0.17], ['Cl', 0, -0.17]], Ti: [['Ti', 0, 0]],
  // 811: magnesium and calcium (M takes two partners)
  MH2: [['H', -0.14, 0], ['M', 0, 0], ['H', 0.14, 0]], MO: [['M', -0.09, 0], ['O', 0.09, 0]], N2: [['N', -0.07, 0], ['N', 0.07, 0]],
  MOH2: [['H', -0.3, 0], ['O', -0.18, 0], ['M', 0, 0], ['O', 0.18, 0], ['H', 0.3, 0]], M3N2: [['M', -0.34, 0], ['N', -0.17, 0], ['M', 0, 0], ['N', 0.17, 0], ['M', 0.34, 0]],
  HCl: [['H', -0.1, 0], ['Cl', 0.04, 0]], MCl2: [['Cl', -0.18, 0], ['M', 0, 0], ['Cl', 0.18, 0]], MBr2: [['Br', -0.19, 0], ['M', 0, 0], ['Br', 0.19, 0]],
  H2SO4: [['H', -0.19, 0], ['SO4', 0, 0], ['H', 0.19, 0]], MSO4: [['M', -0.12, 0], ['SO4', 0.12, 0]],
  // 817: halogens react (M = the halogen, or the metal of the halide)
  M2: [['M', -0.085, 0], ['M', 0.085, 0]], HM: [['H', -0.11, 0], ['M', 0.04, 0]], F2: [['F', -0.07, 0], ['F', 0.07, 0]],
  OF2: [['F', -0.15, 0], ['O', 0, 0], ['F', 0.15, 0]], O2F2: [['F', -0.23, 0], ['O', -0.075, 0], ['O', 0.075, 0], ['F', 0.23, 0]],
  I2: [['I', -0.115, 0], ['I', 0.115, 0]], MI: [['M', -0.11, 0], ['I', 0.12, 0]], P: [['P', 0, 0]],
  PM3: [['P', 0, 0], ['M', -0.2, -0.07], ['M', 0.2, -0.07], ['M', 0, 0.2]],
  PM5: [['P', 0, 0.04], ['M', 0, 0.22], ['M', -0.19, 0.1], ['M', -0.115, -0.12], ['M', 0.115, -0.12], ['M', 0.19, 0.1]],
  H2S: [['H', -0.13, -0.05], ['S', 0, 0], ['H', 0.13, -0.05]], NH3: [['N', 0, 0], ['H', -0.11, -0.06], ['H', 0.11, -0.06], ['H', 0, 0.1]],
  MOCl2: [['Cl', -0.2, 0], ['M', 0, 0], ['O', 0.18, 0], ['Cl', 0, 0.19]],
};
/** terms: [{ mol: 'H2O', n: 2, react: true|false }...]; ops: ['+', '→', '+'] between terms; metals[m] = 'Li'|'Na'|'K';
 *  words[m][j], syms[m][j] (a word may hold '\n' for two lines); from[j] = where word j flies in from (or null).
 *  t0 = start; starts = [t0-ish, swap1, swap2]; t1 = end. Returns update(t). */
export function reactionBoard(scene, { x, y, z, h = 0.17, k: K = 1.7, terms, ops, metals, words, syms, from = [], t0, starts, t1 }) {
  const grp = new THREE.Group(), gid = 'rb' + (++EQN); scene.add(grp);
  const wl = (text, hh, col) => { const ls = text.split('\n').map((s) => label(s, hh, col, 700)); ls.forEach((l) => { l.userData.group = gid; grp.add(l); }); return ls; };   // gid: the whole board is ONE text (engine oneText)
  // molecule layout of each term: a small grid, centred on its column
  const lay = terms.map(({ mol, n }) => {
    const d = MOL[mol].map(([e, dx, dy]) => [e, dx * K, dy * K]), R = 0.105 * K, mw = Math.max(...d.map((a) => a[1])) - Math.min(...d.map((a) => a[1])) + 2 * R, cols = mw > 0.5 ? 1 : Math.min(n, 2), rows = Math.ceil(n / cols);   // wide molecules stack, small ones sit in pairs
    const cells = Array.from({ length: n }, (_, k) => new THREE.Vector3(((k % cols) - (cols - 1) / 2) * (mw + 0.08 * K), (rows - 1 - Math.floor(k / cols) - (Math.min(rows, 2) - 1) / 2) * 0.27 * K, 0));   // tall stacks grow upward, never into the symbols
    return { d, cells, w: cols * (mw + 0.08 * K) };
  });
  const W = words.map((row) => row.map((s) => wl(s, h * 0.8, '#ffffff'))), Sy = syms.map((row) => row.map((s) => wl(s, h, '#f6d48f')));
  const colW = terms.map((_, j) => Math.max(lay[j].w, ...W.map((r) => Math.max(...r[j].map((l) => l.scale.x - h / 3))), ...Sy.map((r) => r[j][0].scale.x - h / 3)) + 0.12);
  const opW = 0.26, total = colW.reduce((a, b) => a + b, 0) + opW * ops.length;
  let cx = x - total / 2; const colX = [], opX = [];
  colW.forEach((w, j) => { colX.push(cx + w / 2); cx += w; if (j < ops.length) { opX.push(cx + opW / 2); cx += opW; } });
  const yM = y + h * 1.2 + 0.2 * K, yW = y - h * 1.25;
  const O = ops.map((s) => { const l = label(s, h, '#ffffff', 700); l.userData.group = gid; l.position.set(opX[ops.indexOf(s)], y, z); grp.add(l); return l; });
  O.forEach((l, k) => l.position.set(opX[k], y, z));
  // atoms: reactant atoms move; product terms only give the places they move to
  const atoms = [], slotsR = [], slotsP = [];
  terms.forEach(({ react }, j) => lay[j].cells.forEach((c, k) => lay[j].d.forEach(([el, dx, dy]) => {
    const p = new THREE.Vector3(colX[j] + c.x + dx, yM + c.y + dy, z);
    (react ? slotsR : slotsP).push({ el, p, j, k });
  })));
  const used = new Set();
  slotsR.forEach((r) => {
    const g = new THREE.Group(); g.position.copy(r.p); grp.add(g);
    const keys = r.el === 'M' ? metals : [r.el];
    const vis = keys.map((e) => { const [c, r0] = ATOM[e], rad = r0 * K, s = solid(new THREE.SphereGeometry(rad, 32, 20), M.gloss(c)), l = label(e === 'SO4' ? 'SO₄' : e, rad * (e === 'SO4' ? 0.8 : 1.15), e === 'H' || e === 'SO4' || e === 'F' || (r.el === 'M' && !['Cl', 'Br', 'I', 'Cu', 'P'].includes(e)) ? '#1b2030' : '#ffffff', 800); l.position.z = rad + 0.005; l.renderOrder = 22; const o = new THREE.Group(); o.add(s, l); g.add(o); return o; });
    const to = slotsP.find((q, i) => !used.has(i) && q.el === r.el && (used.add(i), true));
    atoms.push({ g, vis, from: r.p, to: to?.p ?? r.p, j: r.j, k: r.k, pj: to?.j, pk: to?.k ?? 0 });
  });
  const nR = terms.filter((q) => q.react).length;
  const reactAt = [starts[0] + 4.0, ...starts.slice(1).map((s) => s + 1.3)], backAt = [null, ...starts.slice(1)];
  const symT = (j) => (terms[j].react ? starts[0] + 2.9 + 0.5 * j : starts[0] + 5.7 + 0.5 * (j - nR)), wordT = (j) => starts[0] + 0.15 + 0.3 * j, molT = (j) => starts[0] + 1.9 + 0.4 * j;
  const verAt = (t) => { let m = 0; for (let i = 1; i < starts.length; i++) if (t >= starts[i] + 0.75) m = i; return m; };
  const update = (t) => {
    grp.visible = t >= t0 && t < t1; if (!grp.visible) return;
    const m = verAt(t);
    // words: version 0 flies in from the things; later versions swap only the words that change
    W.forEach((row, mm) => row.forEach((ls, j) => ls.forEach((l, li) => {
      const slot = new THREE.Vector3(colX[j], yW - li * h * 0.9, z);
      const changed = mm > 0 && words[mm][j] !== words[mm - 1][j], firstOf = (() => { let a = mm; while (a > 0 && words[a][j] === words[a - 1][j]) a--; return a; })();
      if (firstOf !== mm) { l.visible = false; return; }
      let last = mm; while (last + 1 < words.length && words[last + 1][j] === words[mm][j]) last++;
      const tin = mm === 0 ? wordT(j) : starts[mm] + 0.85, tout = last + 1 < words.length ? starts[last + 1] + 0.6 : 1e9;
      if (mm === 0 && from[j]) l.position.copy(from[j]).lerp(slot, ease(span(t, tin, tin + 1.0))); else l.position.copy(slot);
      popIn(l, t, tin, tout); void changed;
    })));
    Sy.forEach((row, mm) => row.forEach((ls, j) => ls.forEach((l) => {
      let first = mm; while (first > 0 && syms[first][j] === syms[first - 1][j]) first--; if (first !== mm) { l.visible = false; return; }
      let last = mm; while (last + 1 < syms.length && syms[last + 1][j] === syms[mm][j]) last++;
      l.position.set(colX[j], y, z); popIn(l, t, mm === 0 ? symT(j) : starts[mm] + 0.85, last + 1 < syms.length ? starts[last + 1] + 0.6 : 1e9);
    })));
    O.forEach((l, k) => popIn(l, t, wordT(k + 1) + 0.9));   // after the words have landed
    // atoms
    atoms.forEach((a) => {
      const vin = back(span(t, molT(a.j), molT(a.j) + 0.4));
      let p = a.from.clone();
      for (let i = 0; i < reactAt.length; i++) {
        const tr = reactAt[i] + 0.12 * a.pk;
        if (t >= tr) p = arc(a.from, a.to, 0.22, ease(span(t, tr, tr + 1.1)));
        if (i + 1 < reactAt.length && t >= backAt[i + 1]) p = arc(a.to, a.from, 0.22, ease(span(t, backAt[i + 1], backAt[i + 1] + 0.7)));
      }
      a.g.position.copy(p);
      // a pulse when the symbol of its group appears (count them)
      const js = t > reactAt[0] + 0.6 ? a.pj : a.j, ts = symT(js ?? a.j), pulse = 0.25 * Math.sin(Math.PI * span(t, ts, ts + 0.5));
      const sw = m > 0 && a.vis.length > 1 ? 1 - 0.8 * Math.sin(Math.PI * span(t, starts[m] + 0.6, starts[m] + 1.0)) : 1;   // only the metal atoms change
      a.g.scale.setScalar(Math.max(1e-4, vin * (1 + pulse) * sw));
      a.g.visible = vin > 0.01;
      a.vis.forEach((o, i) => { o.visible = a.vis.length === 1 || i === m; });
    });
  };
  update.width = total; update.top = Math.max(...slotsR.concat(slotsP).map((q) => q.p.y)) + 0.11 * K; update.bottom = yW - h * 0.8 * (Math.max(...W.flat().map((ls) => ls.length)) - 0.4);   // the camera frames it
  return update;
}

// ---------------------------------------------------------------- a Cycles-baked set standing on a studio photo's own floor
// (user 2026-10-13: realistic baked light; "not a floating ball, a transition"). scripts/export_casters.py + bake_set.py
// write bake/<lesson>_<station>.glb: the table with its light baked in + "Shadow" (its baked shadow on the floor).
// The photo (HDRI) becomes a dome whose lower half is flattened into a real floor at y = ground, seen from height hc.
const _hdr = {};
export function photoDome(url, { ground = -3.1, hc = 5.2, radius = 60, dim = 1 } = {}) {   // dim = the bake's ENV strength (same light everywhere)
  const dome = new THREE.Group();
  (_hdr[url] ||= new Promise((ok) => new RGBELoader().load(url, (tx) => { tx.mapping = THREE.EquirectangularReflectionMapping; ok(tx); }))).then((tx) => {
    const geo = new THREE.SphereGeometry(radius, 128, 64); geo.scale(1, 1, -1);
    const pa = geo.getAttribute('position'), v = new THREE.Vector3(), y1 = -hc * 1.5;
    for (let i = 0; i < pa.count; i++) {
      v.fromBufferAttribute(pa, i);
      if (v.y < 0) { v.multiplyScalar(v.y < y1 ? -hc / v.y : 1 - (v.y * v.y) / (3 * y1 * y1)); pa.setXYZ(i, v.x, v.y, v.z); }
    }
    const tex = tx.clone(); tex.mapping = THREE.UVMapping; tex.needsUpdate = true;
    const mat = new THREE.MeshBasicMaterial({ map: tex, color: new THREE.Color(dim, dim, dim), depthWrite: false, fog: false });
    mat.onBeforeCompile = (sh) => {                                   // a soft pool of light on the wall behind the set, darker up and to the sides
      sh.vertexShader = sh.vertexShader.replace('#include <common>', `#include <common>
varying vec3 vDir;`).replace('#include <begin_vertex>', `#include <begin_vertex>
vDir = normalize(position);`);
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
varying vec3 vDir;`).replace('#include <map_fragment>', `#include <map_fragment>
float pool = exp(-dot(vDir - vec3(0.0, -0.05, -1.0), vDir - vec3(0.0, -0.05, -1.0)) / 0.32);
diffuseColor.rgb *= (0.16 + 0.95 * pool) * vec3(1.0, 0.95, 0.88);`);   // figure / ground: the wall stays darker than the set, warm pool behind it
    };
    const m = new THREE.Mesh(geo, mat); m.renderOrder = -2; m.position.y = ground + hc; dome.add(m);
  });
  return dome;
}
export const photoEnv = (url) => (_hdr[url] ||= new Promise((ok) => new RGBELoader().load(url, (tx) => { tx.mapping = THREE.EquirectangularReflectionMapping; ok(tx); }))).then((tx) => (PHOTO_ENV.value = tx));
const BAKED_SETS = new Map();
export function bakedSet(glb) {
  const g = new THREE.Group();
  if (!BAKED_SETS.has(glb)) BAKED_SETS.set(glb, new Promise((resolve, reject) => new GLTFLoader().load(glb, (gl) => {
    gl.scene.traverse((o) => {
      if (!o.isMesh) return; const tex = o.material.emissiveMap || o.material.map, sh = /^Shadow/.test(o.name);
      o.material = sh ? new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, fog: false })   // black, alpha = shadow
        : new THREE.MeshBasicMaterial({ map: tex, color: new THREE.Color(2, 2, 2), fog: false });                     // baked light stored × 0.5
      if (sh) { o.renderOrder = -1; o.position.y += 0.01; }                                                   // just above the photo floor (never coplanar)
    });
    resolve(gl.scene);
  }, undefined, reject)));
  BAKED_SETS.get(glb).then((set) => g.add(set.clone(true))).catch((err) => console.error('Baked set could not load', glb, err));
  return g;
}
/** the whole baked photo-studio look for one lesson (user 2026-10-13: "easy on the eyes"). Call FIRST in build() (models
 *  read LOOK when they are made). ?look=old = the dark studio with plain benches (also what export_casters.py sees).
 *  bake(group, station, x, w, d) = that station's baked table on the photo floor (or a plain bench when old);
 *  dark(t) → true for atom / micro scenes: the dark studio comes back there (glow needs dark). Returns { on, bake, update }. */
export function studio({ scene, R }, lesson, { env = 0.25, dark = () => false } = {}) {
  const QS = new URLSearchParams(location.search), on = QS.get('look') !== 'old', rot = +(QS.get('rot') || 0);
  const floor = scene.getObjectByName('floor'), fog = scene.fog, bg = scene.background;
  const L = {}; scene.traverse((o) => { if (o.isHemisphereLight) L.hemi = o; else if (o.isDirectionalLight) L[o.castShadow ? 'key' : 'rim'] = o; });
  const old = { tm: R.toneMapping, ex: R.toneMappingExposure, hemi: L.hemi.intensity, key: [L.key.intensity, L.key.color.clone()], rim: [L.rim.intensity, L.rim.color.clone()] };
  const TM = { aces: THREE.ACESFilmicToneMapping, neutral: THREE.NeutralToneMapping, agx: THREE.AgXToneMapping };
  const tm = TM[QS.get('tm') || 'aces'], ex = +(QS.get('ex') || 0.9), HDR = 'bake/studio.hdr';
  let photo = null, darkEnv = null, was;
  if (on) { Object.assign(LOOK, { halo: 2, photo: true }); photoEnv(HDR).then((tx) => { photo = tx; }); }
  const bake = (g, name, x, w = 3.6, d = 1.5, z = 0.1) => {
    if (!on) { const b = bench(w, d); b.position.x = x; b.position.z = z; g.add(b); return; }
    g.add(bakedSet(`bake/${lesson}_${name}.glb`)); const dm = photoDome(HDR, { dim: env }); dm.position.set(x, 0, z); dm.rotation.y = rot; g.add(dm);
  };
  const update = (t) => {
    if (!on) return;
    if (scene.environment && scene.environment !== photo) darkEnv = scene.environment;   // the engine's own studio light (loads late)
    const dk = !!dark(t);
    if (dk !== was) {                                                // switch the light rig only when the look changes
      was = dk;
      R.toneMapping = dk ? old.tm : tm; R.toneMappingExposure = dk ? old.ex : ex;
      L.hemi.intensity = dk ? old.hemi : 0.08;
      L.key.intensity = dk ? old.key[0] : 2.4; L.key.color.copy(dk ? old.key[1] : new THREE.Color(0xffeedb));   // = bake Key: warm softbox
      L.rim.intensity = dk ? old.rim[0] : 1.6; L.rim.color.copy(dk ? old.rim[1] : new THREE.Color(0xb8d6ff));   // = bake Rim: cool, behind
    }
    floor.visible = dk; scene.fog = dk ? fog : null; scene.background = bg;
    if (dk) { if (darkEnv) { scene.environment = darkEnv; scene.environmentIntensity = 0.7; } scene.environmentRotation.y = 0; }
    else if (photo) { scene.environment = photo; scene.environmentRotation.y = rot; scene.environmentIntensity = env; }
  };
  return { on, bake, update };
}

// ---------------------------------------------------------------- 801 set pieces: what makes a metal a metal
/** a metal bar (ingot): a trapezoid block, wider at the bottom (bottom at y 0) */
export function ingot(mat, w = 0.3, h = 0.09, d = 0.14, taper = 0.75) {
  const g = new THREE.BoxGeometry(w, h, d, 1, 1, 1), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) if (p.getY(i) > 0) { p.setX(i, p.getX(i) * taper); p.setZ(i, p.getZ(i) * (0.5 + taper / 2)); }
  g.translate(0, h / 2, 0); g.computeVertexNormals(); return solid(g, mat);
}
/** a gold ring lying flat (bottom at y 0) */
export function ring(r = 0.1, th = 0.022, color = 0xf0bf4a) {
  const m = solid(new THREE.TorusGeometry(r, th, 24, 72), new THREE.MeshPhysicalMaterial({ color, metalness: 1, roughness: 0.14, clearcoat: 0.6 }));
  m.rotation.x = Math.PI / 2; const g = new THREE.Group(); m.position.y = th; g.add(m); return g;
}
/** an iron nail along +y (point at y 0, head on top). userData.rust(k): rust patches spread over it, k = 0..1 */
export function nail(len = 0.5, r = 0.017) {
  const prof = [[0, 0], [r * 0.35, r * 1.2], [r, r * 3.5], [r, len - 0.014], [r * 2.7, len - 0.01], [r * 2.7, len], [0, len]].map(([x, y]) => new THREE.Vector2(x, y));
  const geo = new THREE.LatheGeometry(prof, 28), grp = new THREE.Group();
  grp.add(solid(geo, M.metal(0x8f949b, 0.42)));
  // the rust: a thin shell just outside the iron; its triangles sorted by a noise value, so drawing more of them grows patches
  const sh = geo.toNonIndexed(), p = sh.attributes.position, n = sh.attributes.normal, tri = [];
  for (let i = 0; i < p.count; i += 3) {
    const c = new THREE.Vector3(); for (let k = 0; k < 3; k++) c.add(new THREE.Vector3().fromBufferAttribute(p, i + k)); c.multiplyScalar(1 / 3);
    tri.push([fbm(c.x * 40 + 3, c.y * 22, c.z * 40), i]);
  }
  tri.sort((a, b) => a[0] - b[0]);
  const pos = [], nor = [], col = [];
  tri.forEach(([v, i]) => { for (let k = 0; k < 3; k++) {
    const q = new THREE.Vector3().fromBufferAttribute(p, i + k), m = new THREE.Vector3().fromBufferAttribute(n, i + k);
    q.addScaledVector(m, 0.003); pos.push(q.x, q.y, q.z); nor.push(m.x, m.y, m.z);
    const c = new THREE.Color(0x8a3a14).lerp(new THREE.Color(0xc0642a), hash(i, k)); col.push(c.r, c.g, c.b);
  } });
  const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); rg.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); rg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  const rust = new THREE.Mesh(rg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 })); rust.castShadow = true; grp.add(rust);
  grp.userData.rust = (k) => { const c = Math.floor(tri.length * clamp01(k)) * 3; rust.visible = c > 0; rg.setDrawRange(0, c); };
  grp.userData.rust(0); return grp;
}
/** a hammer: the grip end at the origin, the handle along +y, the head across x at the top (swing it with rotation.z) */
export function hammer(len = 0.62) {
  const grp = new THREE.Group();
  const h = solid(new THREE.CylinderGeometry(0.022, 0.028, len, 20), M.matte(0x9a6a3c, 0.6)); h.position.y = len / 2;
  const head = solid(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 28).rotateZ(Math.PI / 2), M.metal(0x5d636b, 0.35)); head.position.y = len + 0.02;
  const face = solid(new THREE.CylinderGeometry(0.056, 0.05, 0.03, 28).rotateZ(Math.PI / 2), M.metal(0xb4b9c0, 0.25), { outline: false }); face.position.set(0.164, len + 0.02, 0);
  grp.add(h, head, face); grp.userData.len = len; return grp;
}
/** a blacksmith's anvil (top face at y = top) */
export function anvil(top = 0.36) {
  const grp = new THREE.Group(), iron = M.metal(0x3c4148, 0.45);
  const foot = solid(new THREE.BoxGeometry(0.46, 0.08, 0.3), iron); foot.position.y = 0.04;
  const waist = solid(new THREE.CylinderGeometry(0.1, 0.16, top - 0.15, 4, 1).rotateY(Math.PI / 4).scale(1.4, 1, 0.9), iron); waist.position.y = 0.08 + (top - 0.15) / 2;
  const face = solid(new THREE.BoxGeometry(0.5, 0.07, 0.22), M.metal(0x6a7078, 0.3)); face.position.y = top - 0.035;
  const horn = solid(new THREE.ConeGeometry(0.075, 0.28, 24).rotateZ(Math.PI / 2), iron); horn.position.set(-0.385, top - 0.05, 0); horn.scale.set(1, 0.7, 1);
  grp.add(foot, waist, face, horn); grp.userData.top = top; return grp;
}
/** a laboratory stand: heavy base, upright rod at x 0, a clamp arm along +x at height h (its jaws at x = reach) */
export function stand(h = 0.7, reach = 0.32) {
  const grp = new THREE.Group(), steel = M.metal(0x9aa0a8, 0.32);
  const base = solid(new THREE.BoxGeometry(0.5, 0.04, 0.3), M.metal(0x2c3038, 0.5)); base.position.set(0.1, 0.02, 0);
  const rod = solid(new THREE.CylinderGeometry(0.014, 0.014, h + 0.3, 16), steel, { outline: false }); rod.position.y = 0.04 + (h + 0.3) / 2;
  const boss = solid(new THREE.BoxGeometry(0.06, 0.06, 0.06), M.metal(0x4a4f58, 0.4)); boss.position.y = h;
  const arm = solid(new THREE.CylinderGeometry(0.009, 0.009, reach, 12).rotateZ(Math.PI / 2), steel, { outline: false }); arm.position.set(reach / 2, h, 0);
  const jaw = solid(new THREE.BoxGeometry(0.05, 0.07, 0.07), M.matte(0x7a3a2a, 0.6)); jaw.position.set(reach, h, 0);
  grp.add(base, rod, boss, arm, jaw); return grp;
}
/** a steel draw plate (stands upright, facing x) with a row of holes, big to small */
export function drawPlate() {
  const s = new THREE.Shape(); s.moveTo(-0.16, 0); s.lineTo(0.16, 0); s.lineTo(0.16, 0.34); s.lineTo(-0.16, 0.34); s.lineTo(-0.16, 0);
  [0.03, 0.022, 0.015, 0.009].forEach((r, i) => { const hl = new THREE.Path(); hl.absarc(-0.09 + i * 0.06, 0.22, r, 0, Math.PI * 2, true); s.holes.push(hl); });
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.04, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2, curveSegments: 24 });
  g.translate(0, 0.006, -0.02); g.rotateY(Math.PI / 2);
  return solid(g, M.metal(0x6f757d, 0.35));
}
/** a glass watch glass / petri dish (bottom at y 0) */
export function watchGlass(r = 0.22) {
  const prof = [[0, 0], [r * 0.7, 0.004], [r, 0.03], [r, 0.05], [r - 0.006, 0.05], [r - 0.006, 0.032], [r * 0.7, 0.01], [0, 0.006]].map(([x, y]) => new THREE.Vector2(x, y));
  const m = new THREE.Mesh(new THREE.LatheGeometry(prof, 56), M.glass()); m.renderOrder = 5; return m;
}
/** a glass dropper (pipette): the tip at the origin, the glass up +y, a red rubber bulb on top */
export function dropper(len = 0.34) {
  const prof = [[0.004, 0], [0.007, 0], [0.02, len * 0.3], [0.02, len], [0.016, len], [0.016, len * 0.3], [0.004, 0.004]].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.Mesh(new THREE.LatheGeometry(prof, 32), M.glass()); g.renderOrder = 5;
  const bulb = solid(new THREE.SphereGeometry(0.036, 24, 16).scale(1, 1.35, 1), M.gloss(0xb23a30)); bulb.position.y = len + 0.04;
  const neck = solid(new THREE.CylinderGeometry(0.023, 0.023, 0.03, 24, 1, true), M.gloss(0xb23a30)); neck.material.side = THREE.DoubleSide; neck.position.y = len - 0.005;
  const grp = new THREE.Group(); grp.add(g, bulb, neck); return grp;
}
let _blob;
/** a soft round contact shadow for things that MOVE on a baked table (the bake only has the still things' shadows).
 *  Put it on the table under the object; set .userData.set(height) each frame (fades as the thing rises). */
export function contactShadow(r = 0.12) {
  if (!_blob) {
    const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(0,0,0,0.75)'); g.addColorStop(0.5, 'rgba(0,0,0,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 64); _blob = new THREE.CanvasTexture(c);
  }
  const m = new THREE.Mesh(new THREE.PlaneGeometry(2 * r, 2 * r).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: _blob, transparent: true, depthWrite: false, fog: false }));
  m.renderOrder = 1; m.position.y = 0.004;
  m.userData.set = (h) => { const k = clamp01(1 - h / 0.5); m.material.opacity = k; m.visible = k > 0.02; m.scale.setScalar(1 + (1 - k) * 0.6); };
  return m;
}
/** a small bench vise / clamp: steel jaws on a heavy foot (jaw centre at y = 0.12, the jaw face toward +x) */
export function vise() {
  const grp = new THREE.Group(), steel = M.metal(0x5d636b, 0.38);
  const foot = solid(new THREE.BoxGeometry(0.2, 0.04, 0.18), M.metal(0x2c3038, 0.5)); foot.position.y = 0.02;
  const body = solid(new THREE.BoxGeometry(0.1, 0.12, 0.14), steel); body.position.y = 0.1;
  const screw = solid(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 12), M.metal(0xb4b9c0, 0.25), { outline: false }); screw.position.y = 0.2;
  const knob = solid(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 20), M.matte(0x8a2a22, 0.5)); knob.position.y = 0.26;
  grp.add(foot, body, screw, knob); return grp;
}

// ---------------------------------------------------------------- the lesson's ONE big question as a checklist (HUD)
/** user 2026-10-13: "I don't get the overall meaning" (801) → then "not a popup after each experiment: it comes at the
 *  beginning, moves to the side, stays there for the rest of the lesson and the ticks add up; only where a lesson needs it".
 *  intro = [show, dock]: the full card (all rows, empty boxes) in the middle, then it glides into a slim panel at the left
 *  edge (short words) that stays; ticks = [[t, row]…] tick the panel's rows one by one. Shots after `dock` must leave the
 *  left edge free: frame them with dockShot() below. Returns update(t) → push it into the lesson's beats. */
export const DOCK_W = 0.25;                                            // share of the picture width the panel may cover
export const DOCK_TOP = 0.26;                                          // upright screens: share of the height the panel (at the top) may cover
export function checklist(scene, cam, { title, rows, short, intro, ticks, dockTitle = title }) {   // dockTitle: a short title keeps the side panel big (817)
  if (!cam.parent) scene.add(cam);
  const FONT = '-apple-system, "Segoe UI", Roboto, sans-serif', mat = (o) => new THREE.MeshBasicMaterial({ transparent: true, depthTest: false, depthWrite: false, toneMapped: false, fog: false, ...o });
  const tickTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); x.fillStyle = '#7be08a'; x.font = `700 120px ${FONT}`; x.textBaseline = 'middle'; x.textAlign = 'center'; x.fillText('✓', 64, 70); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const panel = (CW, CH, paint) => {                                   // a card = canvas texture on a plane (height 1), redrawn on demand
    const c = document.createElement('canvas'); c.width = CW; c.height = CH; const x = c.getContext('2d');
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const g = new THREE.Group(), face = new THREE.Mesh(new THREE.PlaneGeometry(CW / CH, 1), mat({ map: tex })); face.renderOrder = 41; g.add(face);
    const tick = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat({ map: tickTex })); tick.renderOrder = 42; g.add(tick);
    const box = (y, r, w) => { x.beginPath(); x.roundRect(6, 6, CW - 12, CH - 12, r); x.fillStyle = 'rgba(12, 16, 24, 0.94)'; x.fill(); x.strokeStyle = 'rgba(240, 195, 90, 0.75)'; x.lineWidth = w; x.stroke(); };
    return { g, face, tick, x, CW, CH, draw: (...a) => { x.clearRect(0, 0, CW, CH); box(0, 36, 4); paint(x, ...a); tex.needsUpdate = true; } };
  };
  // the big card (plan): every row, empty boxes
  const ROWY = []; let y = 192; rows.forEach(([k], i) => { y += k ? 70 : (i ? 90 : 0); ROWY.push(y); });
  const mm = document.createElement('canvas').getContext('2d'); mm.font = `500 52px ${FONT}`;
  const BW = Math.max(1000, ...rows.map(([k, txt]) => mm.measureText(txt).width + (k ? 236 : 128)), (mm.font = `700 84px ${FONT}`, mm.measureText(title).width + 128));   // as wide as the longest row or the title
  const big = panel(Math.ceil(BW), y + 70, (x) => {
    x.textBaseline = 'middle'; x.fillStyle = '#f0c35a'; x.font = `700 84px ${FONT}`; x.fillText(title, 64, 100);
    rows.forEach(([k, txt], i) => {
      if (!k) { x.fillStyle = '#9fc4ff'; x.font = `700 50px ${FONT}`; x.fillText(txt, 64, ROWY[i]); return; }
      x.strokeStyle = '#5d6676'; x.lineWidth = 4; x.beginPath(); x.roundRect(96, ROWY[i] - 25, 50, 50, 8); x.stroke();
      x.fillStyle = '#c9d0db'; x.font = `500 52px ${FONT}`; x.fillText(txt, 172, ROWY[i]);
    });
  });
  big.draw(); big.tick.visible = false;
  // the slim panel (short words) that stays at the left edge
  const m = document.createElement('canvas').getContext('2d'); m.font = `600 46px ${FONT}`;
  const DW = Math.ceil(Math.max(...short.map((s) => m.measureText(s).width + 120), (m.font = `700 54px ${FONT}`, m.measureText(dockTitle).width + 70)));
  const DY = (r) => 132 + r * 74, dock = panel(DW, DY(short.length) + 4, (x, n) => {
    x.textBaseline = 'middle'; x.fillStyle = '#f0c35a'; x.font = `700 54px ${FONT}`; x.fillText(dockTitle, 36, 66);
    short.forEach((txt, r) => {
      const done = r < n; x.strokeStyle = done ? '#7be08a' : '#5d6676'; x.lineWidth = 4; x.beginPath(); x.roundRect(36, DY(r) - 22, 44, 44, 8); x.stroke();
      if (done) { x.fillStyle = '#7be08a'; x.font = `700 50px ${FONT}`; x.fillText('✓', 39, DY(r) + 2); }
      x.fillStyle = done ? '#ffffff' : '#7a8394'; x.font = `${done ? 600 : 500} 46px ${FONT}`; x.fillText(txt, 98, DY(r));
    });
  });
  const hud = new THREE.Group(); cam.add(hud); hud.add(big.g, dock.g);
  const veil = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat({ color: 0x000000, opacity: 0.5 })); veil.renderOrder = 40; veil.position.z = -1.02; hud.add(veil);
  let drawn = -1;
  return (t) => {
    const [a, b] = intro, hh = Math.tan(cam.fov * Math.PI / 360), asp = cam.aspect;
    hud.visible = t >= a - 0.05;
    if (!hud.visible) { cam.userData.cardUp = false; return; }
    // the plan in the middle, then a glide to the left edge
    const pop = back(span(t, a, a + 0.45)), go = ease(span(t, b - 0.2, b + 0.7));
    const HB = Math.min(2 * hh * 0.8 * (big.CH / 1090), 2 * hh * asp * 0.86 * big.CH / big.CW); let HD = Math.min(2 * hh * 0.66, (DW / dock.CH) > 0 ? 2 * hh * asp * DOCK_W * 0.86 * dock.CH / DW : 1);
    let dockX = -hh * asp + 0.05 * hh + 0.5 * HD * DW / dock.CH, dockY = hh * 0.1;
    if (asp < 1) {                                                     // upright screens: the panel sits at the top, under the icons
      HD = Math.min(2 * hh * (DOCK_TOP - 0.08), 2 * hh * asp * 0.7 * dock.CH / DW);
      dockX = -hh * asp + 0.05 * hh * asp + 0.5 * HD * DW / dock.CH; dockY = hh * (1 - 0.08 * 2) - 0.5 * HD;
    }
    veil.scale.set(2 * hh * asp * 1.07, 2 * hh * 1.07, 1); veil.material.opacity = 0.55 * Math.min(1, pop) * (1 - go);
    const HE = HD * DW / dock.CH * big.CH / big.CW;                     // the big card ends exactly as wide as the panel, then swaps
    big.g.visible = go < 1; cam.userData.cardUp = big.g.visible && pop > 0.3 && go < 0.5;   // the big card is a text too: the floating caption waits (engine oneText)
    big.g.position.set(lerp(0, dockX, go), lerp(hh * 0.08, dockY + 0.5 * (HE - HD) * 0, go), -1); big.g.scale.setScalar(Math.max(1e-4, lerp(HB, HE, go) * pop));
    big.face.material.opacity = 1 - span(go, 0.8, 1);
    dock.g.visible = go > 0.8; dock.g.position.set(dockX, dockY, -1); dock.g.scale.setScalar(HD); dock.face.material.opacity = span(go, 0.8, 1);
    let n = 0, now = -1; for (const [tk, r] of ticks) if (t >= tk) { n = Math.max(n, r + 1); now = r; }
    if (n !== drawn) { drawn = n; dock.draw(n); }
    const last = ticks.find(([tk, r]) => r === now), u = last ? span(t, last[0], last[0] + 0.5) : 1;
    dock.tick.visible = now >= 0 && u < 1;                             // the newest ✓ lands with a little overshoot
    if (dock.tick.visible) { const s = 64 / dock.CH * (1 + 0.8 * (1 - back(u))); dock.tick.scale.set(s, s, 1); dock.tick.position.set(58 / dock.CH - 0.5 * DW / dock.CH, 0.5 - (DY(now) + 2) / dock.CH, 0.001); }
  };
}
/** frame a shot so the subject sits right of the docked checklist (S()-style: returns the shifted camera + look) */
export function dockShot(pos, look, asp = 1.6) {
  const p = new THREE.Vector3(...pos), l = new THREE.Vector3(...look), f = l.clone().sub(p), dist = f.length();
  const right = f.clone().normalize().cross(new THREE.Vector3(0, 1, 0)).normalize(), sh = DOCK_W * 0.5 * 2 * dist * Math.tan(16 * Math.PI / 180) * asp * 0.9;
  return [p.addScaledVector(right, -sh).toArray(), l.addScaledVector(right, -sh).toArray()];
}

// ---------------------------------------------------------------- 805 specimens: minerals and living things on a museum plinth
/** a dark round museum plinth (top face at y = h): specimens stand on it */
export function plinth(r = 0.3, h = 0.35) {
  const prof = [[0, 0], [r * 1.12, 0], [r * 1.12, 0.03], [r, 0.05], [r, h - 0.02], [r - 0.02, h], [0, h]].map(([x, y]) => new THREE.Vector2(x, y));
  return solid(new THREE.LatheGeometry(prof, 64), M.matte(0x262b35, 0.55));
}
/** a crystal: a prism of `sides` sides (radius r, height h) with a point (tip = 0: flat top), long axis +y, base at y 0 */
function prism(r, h, sides = 6, tip = 0, flat = 1) {
  const g = new THREE.CylinderGeometry(r, r, h, sides, 1).translate(0, h / 2, 0), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { p.setZ(i, p.getZ(i) * flat); if (tip && p.getY(i) > h - 1e-4) { p.setX(i, p.getX(i) * 0.15); p.setZ(i, p.getZ(i) * 0.15); p.setY(i, h + tip); } }
  const n = g.toNonIndexed(); n.computeVertexNormals(); return n;          // flat faces: crystal facets catch the light one by one
}
const crystalMat = (c, o = 0.85, r = 0.1) => new THREE.MeshPhysicalMaterial({ color: c, roughness: r, clearcoat: 1, clearcoatRoughness: 0.08, transparent: o < 1, opacity: o });
/** a spray of crystals growing out of a small grey matrix rock; kind: gypsum (clear blades) · barite (cream plates) · beryl (green hexagons).
 *  base: false = no rock: a druse (many crystals fanning out of a hollow, spread over radius r) for crystal pockets in the ground */
export function crystals(kind, seed = 1, { base = true, n, r = 0.09 } = {}) {
  const grp = new THREE.Group();
  if (base) { const b = rock(0.11, 0x7a746c, 0x4a4743, seed); b.scale.set(1.25, 0.8, 1); grp.add(b); }
  const C = {
    gypsum: { n: 7, mat: crystalMat(0xffffff, 0.93, 0.06), make: (k) => prism(0.04, 0.2 + 0.12 * hash(k, 1), 4, 0.04, 0.35), spread: 0.55 },
    barite: { n: 6, mat: crystalMat(0xe8cf9e, 0.94, 0.18), make: (k) => new THREE.BoxGeometry(0.17 + 0.05 * hash(k, 2), 0.13 + 0.04 * hash(k, 3), 0.022).translate(0, 0.07, 0), spread: 0.9 },
    beryl: { n: 4, mat: crystalMat(0x46b884, 0.85, 0.08), make: (k) => prism(k ? 0.03 + 0.012 * hash(k, 4) : 0.06, k ? 0.13 + 0.06 * hash(k, 5) : 0.3, 6), spread: 0.4 },
    fluorite: { n: 5, mat: crystalMat(0x8a5ad0, 0.9, 0.08), make: (k) => { const e = k ? 0.07 + 0.03 * hash(k, 6) : 0.13; return new THREE.BoxGeometry(e, e, e).translate(0, e * 0.35, 0); }, spread: 0.7 },
    epsomite: { n: 16, mat: crystalMat(0xfafafa, 1, 0.3), make: (k) => prism(0.012, 0.09 + 0.08 * hash(k, 8), 4, 0.012), spread: 1.0 },
    apatite: { n: 4, mat: crystalMat(0x7cc4b0, 0.9, 0.12), make: (k) => prism(k ? 0.025 : 0.045, k ? 0.12 : 0.22, 6, k ? 0 : 0.03), spread: 0.6 },
    dolomite: { n: 7, mat: crystalMat(0xe6c6c0, 0.95, 0.2), make: (k) => { const e = 0.05 + 0.025 * hash(k, 13); return new THREE.BoxGeometry(e, e, e).applyMatrix4(new THREE.Matrix4().makeShear(0.35, 0, 0.3, 0, 0, 0)).translate(0, e / 2, 0); }, spread: 0.7 },
    kieserite: { n: 9, mat: crystalMat(0xf8f7f0, 0.95, 0.35), make: (k) => new THREE.BoxGeometry(0.045 + 0.02 * hash(k, 14), 0.035, 0.04).translate(0, 0.0175, 0), spread: 0.8 },
    talc: { n: 10, mat: crystalMat(0xd6e6cf, 0.9, 0.55), make: (k) => new THREE.BoxGeometry(0.09, 0.008, 0.07 + 0.02 * hash(k, 15)).translate(0, 0.004, 0), spread: 1.1 },
    asbestos: { n: 46, mat: crystalMat(0xe9ede6, 0.95, 0.45), make: (k) => prism(0.0035, 0.1 + 0.05 * hash(k, 16), 4), spread: 0.25 },
  }[kind];
  for (let k = 0; k < (n ?? C.n); k++) {
    const m = solid(C.make(k), C.mat), a = k * 2.4 + hash(k, seed) * 0.6, d = base ? 0 : r * Math.sqrt(hash(k, seed + 9)), lean = k ? C.spread * (0.4 + 0.6 * hash(k, 7)) * (base ? 1 : 0.4 + 0.9 * d / r) : 0.08;
    if (base) m.position.set(k ? Math.cos(a) * 0.04 : 0, 0.035, k ? Math.sin(a) * 0.035 : 0); else { m.position.set(Math.cos(a) * d, 0, Math.sin(a) * d); m.castShadow = false; }
    m.rotation.set(Math.sin(a) * lean, a, -Math.cos(a) * lean); grp.add(m);
  }
  return grp;
}
/** Epsom salt: a little heap of white needle crystals in a shallow dish */
export function epsom(n = 110) {
  const grp = new THREE.Group(); grp.add(dish(0.17));
  const mesh = new THREE.InstancedMesh(prism(0.007, 0.07, 4, 0.007), crystalMat(0xfbfbfb, 1, 0.22), n); mesh.castShadow = true;
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (let i = 0; i < n; i++) {
    const r = 0.11 * Math.sqrt(hash(i, 1)), a = hash(i, 2) * 6.283, y = 0.018 + 0.05 * (1 - (r / 0.11) ** 2) * hash(i, 3);
    e.set((hash(i, 4) - 0.5) * 3, hash(i, 5) * 6, Math.PI / 2 + (hash(i, 6) - 0.5) * 1.2); q.setFromEuler(e);
    m4.compose(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r), q, new THREE.Vector3(1, 1, 1)); mesh.setMatrixAt(i, m4);
  }
  grp.add(mesh); return grp;
}
let _leafTex;
/** a green leaf lying on its back, gently curled (tip toward +x), with a short stem; lies at y 0 */
export function leaf(len = 0.6) {
  if (!_leafTex) {
    const c = document.createElement('canvas'); c.width = 256; c.height = 512; const x = c.getContext('2d');
    x.beginPath(); x.moveTo(128, 500); x.bezierCurveTo(10, 380, 10, 120, 128, 8); x.bezierCurveTo(246, 120, 246, 380, 128, 500); x.closePath();
    const g = x.createLinearGradient(0, 0, 256, 0); g.addColorStop(0, '#2f7a2c'); g.addColorStop(0.5, '#4fa83c'); g.addColorStop(1, '#2c7029'); x.fillStyle = g; x.fill();
    x.save(); x.clip(); x.strokeStyle = 'rgba(200,240,150,0.55)'; x.lineWidth = 5; x.beginPath(); x.moveTo(128, 500); x.lineTo(128, 10); x.stroke();
    x.lineWidth = 2.5; for (let k = 1; k < 9; k++) { const y = 470 - k * 50; for (const s of [-1, 1]) { x.beginPath(); x.moveTo(128, y); x.quadraticCurveTo(128 + s * 50, y - 30, 128 + s * 110, y - 75); x.stroke(); } }
    x.restore(); _leafTex = new THREE.CanvasTexture(c); _leafTex.colorSpace = THREE.SRGBColorSpace;
  }
  const g = new THREE.PlaneGeometry(len * 0.5, len, 10, 24), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, 2.2 * x * x / len + 0.08 * len * Math.sin(Math.PI * (y / len + 0.5))); }
  g.rotateX(-Math.PI / 2).rotateY(-Math.PI / 2); g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: _leafTex, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.55 })); m.position.y = 0.006;
  const stem = solid(new THREE.CylinderGeometry(0.008, 0.01, 0.16, 8).rotateZ(Math.PI / 2), M.matte(0x3d7a2a, 0.6), { outline: false }); stem.position.set(-len / 2 - 0.06, 0.012, 0);
  const grp = new THREE.Group(); grp.add(m, stem); return grp;
}
/** a long bone (femur-like) lying along x, resting on y 0 */
export function bone(len = 0.62) {
  const grp = new THREE.Group(), mat = M.matte(0xe8dfca, 0.6), r = 0.04;
  const prof = Array.from({ length: 13 }, (_, i) => { const u = i / 12; return new THREE.Vector2(r * (0.85 + 0.45 * (2 * u - 1) ** 4), (u - 0.5) * len * 0.8); });
  grp.add(solid(new THREE.LatheGeometry(prof, 32).rotateZ(Math.PI / 2), mat));
  for (const s of [-1, 1]) for (const k of [-1, 1]) { const bg = smoothIco(r * 1.35, 3); bg.computeVertexNormals(); const b = solid(bg, mat); b.position.set(s * len * 0.42, 0, k * r * 0.95); grp.add(b); }
  grp.position.y = r * 1.35; const g = new THREE.Group(); g.add(grp); return g;
}
/** a molar tooth standing on its two roots (bottom at y 0) */
export function tooth(s = 0.12) {
  const grp = new THREE.Group(), enamel = new THREE.MeshPhysicalMaterial({ color: 0xf7f3ea, roughness: 0.3, clearcoat: 0.8 });
  const g = smoothIco(1, 4), p = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i); const bx = (a) => Math.sign(a) * Math.abs(a) ** 0.55, rxz = Math.min(1, Math.hypot(v.x, v.z));
    const top = Math.max(0, v.y), cusp = top > 0.5 ? 0.16 * rxz * Math.cos(2 * Math.atan2(v.z, v.x) - Math.PI / 2) ** 2 - 0.1 * (1 - rxz) : 0;
    p.setXYZ(i, bx(v.x) * 0.95, v.y > 0 ? 0.62 * bx(v.y) + cusp : 0.45 * v.y, bx(v.z) * 0.85);
  }
  g.computeVertexNormals(); const crown = solid(g, enamel); crown.scale.setScalar(s); crown.position.y = s * 1.5; grp.add(crown);
  for (const k of [-1, 1]) { const root = solid(new THREE.CylinderGeometry(s * 0.32, s * 0.12, s * 1.3, 16).translate(0, s * 0.65, 0), M.matte(0xe9dfc8, 0.5)); root.position.set(k * s * 0.42, 0.004, 0); root.rotation.z = -k * 0.12; grp.add(root); }
  return grp;
}
/** half an egg shell, open at the top with a jagged broken rim (bottom at y 0) */
export function eggShell(r = 0.12) {
  const H = r * 1.3 * 0.62, pts = [], N = 14;
  for (let i = 0; i <= N; i++) { const a = i / N * Math.PI / 2; pts.push(new THREE.Vector2(Math.sin(a) * r, (1 - Math.cos(a)) * H)); }
  for (let i = N; i >= 0; i--) { const a = i / N * Math.PI / 2; pts.push(new THREE.Vector2(Math.max(0.0005, Math.sin(a) * (r - 0.006)), 0.006 + (1 - Math.cos(a)) * (H - 0.006))); }
  const g = new THREE.LatheGeometry(pts, 64), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) if (p.getY(i) > H - 0.009) { const a = Math.atan2(p.getZ(i), p.getX(i)); p.setY(i, p.getY(i) - 0.02 * Math.abs(Math.sin(a * 7)) * (0.5 + hash(Math.round(a * 30)))); }
  g.computeVertexNormals();
  const m = solid(g, new THREE.MeshStandardMaterial({ color: 0xf1e2c8, roughness: 0.7, side: THREE.DoubleSide })); m.position.y = 0.002; return m;
}
/** radium: a sealed glass vial of salt that glows by itself (blue), tiny sparks shooting out; userData.update(t) */
export function radiumVial() {
  const grp = new THREE.Group(); grp.add(vial(0.07, 0.22));
  const salt = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.058, 0.05, 24), M.glow(0x7fc8ff, 2.4)); salt.position.y = 0.045; grp.add(salt);
  const halo = glowSprite(0x7fc8ff, 0.5); halo.material.depthTest = false; halo.position.y = 0.08; grp.add(halo);
  const sp = Array.from({ length: 10 }, () => { const s = glowSprite(0xbfe4ff, 0.05); grp.add(s); return s; });
  grp.userData.update = (t) => {
    halo.material.opacity = 0.75 + 0.2 * Math.sin(t * 5);
    sp.forEach((s, i) => { const u = (t * 0.9 + hash(i, 1)) % 1, a = hash(i, 2) * 6.283, e = 0.3 + hash(i, 3) * 0.9, d = 0.03 + u * 0.45;
      s.position.set(Math.cos(a) * Math.cos(e) * d, 0.06 + Math.sin(e) * d, Math.sin(a) * Math.cos(e) * d); s.material.opacity = 1 - u; });
  };
  return grp;
}

let _earthGrain;
/** a block cut out of the ground (earth's crust): grass on top, brown soil, then layers of rock; base at y 0, w × h × d.
 *  userData.spots = points on its cut faces in the rock layers (for glowing grains) */
export function earthBlock(w = 0.9, h = 0.55, d = 0.6) {
  const g = new THREE.BoxGeometry(w, h, d, 36, 24, 24).translate(0, h / 2, 0), p = g.attributes.position, col = [], c = new THREE.Color();
  const L = [[0.0, 0x4f8a34], [0.035, 0x5a3e2a], [0.13, 0x8a6a48], [0.24, 0x8c847a], [0.37, 0x6b665f], [1, 0x57534d]];   // depth from the top → colour
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i), top = y > h - 1e-4;
    const bump = 0.018 * fbm(x * 6 + 3, 0, z * 6);
    if (top) p.setY(i, y + bump);
    else { const s = 0.006 * (vnoise(x * 30, y * 30, z * 30) - 0.5); if (Math.abs(x) > w / 2 - 1e-4) p.setX(i, x + s); if (Math.abs(z) > d / 2 - 1e-4) p.setZ(i, z + s); }
    const dep = h + bump - p.getY(i) + 0.03 * (fbm(x * 5, y * 3, z * 5) - 0.5);
    let k = 0; while (k < L.length - 1 && dep > L[k + 1][0]) k++;
    c.setHex(L[k][1]).multiplyScalar(0.85 + 0.3 * vnoise(x * 40, y * 40, z * 40)); col.push(c.r, c.g, c.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
  const m = solid(g, M.vcol(0.9)), spots = [];
  for (let i = 0; i < 40; i++) {
    const y = 0.05 + (h - 0.2) * hash(i, 1), front = hash(i, 2) < 0.62;
    spots.push(front ? new THREE.Vector3((hash(i, 3) - 0.5) * (w - 0.06), y, d / 2 + 0.008) : new THREE.Vector3(w / 2 + 0.008, y, (hash(i, 3) - 0.5) * (d - 0.06)));
  }
  m.userData.spots = spots; return m;
}

// ---------------------------------------------------------------- 807 sodium: salt we know, a thermometer
/** a heap of table salt in a small dish: hundreds of tiny white cubes (one instanced draw); bottom at y 0 */
export function saltHeap(r = 0.13, n = 420) {
  const grp = new THREE.Group(); grp.add(dish(r + 0.03));
  const m = new THREE.InstancedMesh(new THREE.BoxGeometry(0.011, 0.011, 0.011), new THREE.MeshPhysicalMaterial({ color: 0xf6f5f1, roughness: 0.35, clearcoat: 0.6 }), n); m.castShadow = true;
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (let i = 0; i < n; i++) {
    const d = r * Math.sqrt(hash(i, 1)), a = hash(i, 2) * 6.283, top = 0.075 * (1 - (d / r) ** 1.6);
    e.set(hash(i, 3) * 3, hash(i, 4) * 3, hash(i, 5) * 3); q.setFromEuler(e);
    m4.compose(new THREE.Vector3(Math.cos(a) * d, 0.016 + top * hash(i, 6) ** 0.5, Math.sin(a) * d), q, new THREE.Vector3(1, 1, 1)); m.setMatrixAt(i, m4);
  }
  grp.add(m); return grp;
}
/** a lump of rock salt: a few clear, slightly pink cubic crystals grown together; bottom at y 0 */
/** rock salt as it is dug up: a pinkish, glassy chunk of salt crystal (like a salt lamp) with a few small cubes on it */
export function rockSalt(s = 0.16) {
  const grp = new THREE.Group(), mat = new THREE.MeshPhysicalMaterial({ color: 0xf0c9bd, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2, transmission: 0.35, thickness: 0.15, flatShading: true });
  const lumpG = (r, seed) => {
    const g = new THREE.IcosahedronGeometry(r, 1), p = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const k = 1 + 0.28 * (vnoise(v.x * 9 + seed, v.y * 9, v.z * 9) - 0.5); v.multiplyScalar(k); v.y = Math.max(v.y, -r * 0.55); p.setXYZ(i, v.x, v.y, v.z); }
    g.computeVertexNormals(); return g;
  };
  const big = solid(lumpG(s * 0.75, 1), mat); big.scale.set(1.25, 0.85, 1); big.position.y = s * 0.47; grp.add(big);
  const small = solid(lumpG(s * 0.38, 5), mat); small.position.set(s * 0.95, s * 0.2, s * 0.35); grp.add(small);
  [[0.25, 1.05, 0.2, 0.22], [-0.45, 0.85, 0.35, 0.18], [0.55, 0.7, -0.3, 0.16]].forEach(([x, y, z, k], i) => {
    const c = solid(new THREE.BoxGeometry(s * k, s * k, s * k), mat); c.position.set(x * s, y * s, z * s); c.rotation.set(0.4 + i, 0.7 * i, 0.3); grp.add(c);
  });
  return grp;
}
/** a glass thermometer standing up (bulb at y 0, scale 0 … top °C along len). userData.set(°C) moves the red column;
 *  userData.y(°C) = the height of a reading (for labels) */
export function thermometer(len = 0.6, top = 120) {
  const grp = new THREE.Group(), y0 = 0.05, k = (len - 0.08) / top;
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, len, 20, 1, true), M.glass()); tube.position.y = len / 2 + 0.02; tube.renderOrder = 5;
  const bulb = solid(new THREE.SphereGeometry(0.02, 20, 14), M.gloss(0xd23b30), { outline: false });
  const col = solid(new THREE.CylinderGeometry(0.006, 0.006, 1, 10).translate(0, 0.5, 0), M.gloss(0xd23b30), { outline: false }); col.position.y = 0.015;
  for (let c = 0; c <= top; c += 10) { const tk = new THREE.Mesh(new THREE.BoxGeometry(c % 50 ? 0.012 : 0.022, 0.0025, 0.002), new THREE.MeshBasicMaterial({ color: 0x2b2f38 })); tk.position.set(0.016, y0 + c * k, 0.008); grp.add(tk); }
  grp.add(tube, bulb, col);
  grp.userData = { set: (c) => { col.scale.y = Math.max(1e-4, y0 - 0.015 + Math.max(0, c) * k); }, y: (c) => y0 + c * k };
  grp.userData.set(25); return grp;
}
/** a small electric hot plate (top of the plate at y = 0.105): white body, dark round plate, a knob and a red pilot
 *  light. userData.on(k) turns the knob and lights the pilot (a real lamp, so it may glow) */
export function hotPlate(w = 0.34, d = 0.3) {
  const grp = new THREE.Group();
  const body = solid(new THREE.BoxGeometry(w, 0.08, d), M.gloss(0xe9e7e2)); body.position.y = 0.04;
  const plate = solid(new THREE.CylinderGeometry(0.11, 0.115, 0.02, 48), M.metal(0x2a2d33, 0.55)); plate.position.set(0, 0.093, -0.01);
  const knob = solid(new THREE.CylinderGeometry(0.022, 0.024, 0.026, 20).rotateX(Math.PI / 2), M.matte(0x22252b, 0.5)); knob.position.set(w * 0.28, 0.04, d / 2 + 0.013);
  const tick = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.016, 0.003), new THREE.MeshBasicMaterial({ color: 0xffffff })); tick.position.set(0, 0.008, 0.0145); knob.add(tick);
  const pilot = new THREE.Mesh(new THREE.SphereGeometry(0.009, 12, 8), M.glow(0xff3a20, 0)); pilot.position.set(-w * 0.3, 0.045, d / 2 + 0.004);
  grp.add(body, plate, knob, pilot);
  grp.userData.on = (k) => { knob.rotation.z = -1.6 * k; pilot.material.emissiveIntensity = 3 * k; };
  return grp;
}

// ---------------------------------------------------------------- 808 sodium reacts: grinding and strong heating
/** a white porcelain mortar (bottom at y 0, inner floor at y 0.03, rim 0.15) */
export function mortar(r = 0.2) {
  const prof = [[0, 0], [r * 0.75, 0], [r * 0.95, 0.05], [r * 1.08, 0.14], [r * 1.12, 0.15], [r * 1.04, 0.152], [r * 0.92, 0.07], [r * 0.6, 0.036], [0, 0.03]].map(([x, y]) => new THREE.Vector2(x, y));
  return solid(new THREE.LatheGeometry(prof, 56), M.gloss(0xf1efea));
}
/** a porcelain pestle: the round head at the origin, the handle up +y */
export function pestle(len = 0.32) {
  const grp = new THREE.Group(), m = M.gloss(0xf1efea);
  const head = solid(new THREE.SphereGeometry(0.042, 24, 16), m); head.scale.y = 0.8;
  const h = solid(new THREE.CylinderGeometry(0.018, 0.03, len, 20), m); h.position.y = len / 2 + 0.02;
  grp.add(head, h); return grp;
}
/** a steel crucible (open top; bottom at y 0, inner floor at 0.012) */
export function crucible(r = 0.12, h = 0.16) {
  const mm = M.metal(0x7c838c, 0.4); mm.side = THREE.DoubleSide;
  const prof = [[0, 0], [r * 0.75, 0], [r, h], [r * 0.93, h], [r * 0.68, 0.012], [0, 0.012]].map(([x, y]) => new THREE.Vector2(x, y));
  return solid(new THREE.LatheGeometry(prof, 48), mm);
}

// ---------------------------------------------------------------- 809 set pieces: what sodium is used for
/** a printed carton (w × h × d, bottom at y 0): coloured card with big words on the front (+z) and back */
export function printBox(w, h, d, color, lines, ink = '#ffffff') {
  const c = document.createElement('canvas'); c.width = 256; c.height = Math.round(256 * h / w); const x = c.getContext('2d');
  x.fillStyle = color; x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = 'rgba(255,255,255,0.85)'; x.fillRect(0, c.height * 0.62, c.width, c.height * 0.06);
  x.fillStyle = ink; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '800 44px -apple-system, "Segoe UI", Roboto, sans-serif';
  lines.forEach((s, i) => x.fillText(s, c.width / 2, c.height * (0.25 + 0.17 * i)));
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const side = new THREE.MeshStandardMaterial({ color, roughness: 0.55 }), face = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 });
  return solid(new THREE.BoxGeometry(w, h, d).translate(0, h / 2, 0), [side, side, side, side, face, face]);
}
/** a bar of soap (rounded, glossy, bottom at y 0) */
export function soapBar(color = 0xbfe3c8, w = 0.26, d = 0.16, h = 0.08) {
  const s = new THREE.Shape(), r = 0.05, a = w / 2 - r, b = d / 2 - r;
  s.moveTo(-a, -d / 2); s.lineTo(a, -d / 2); s.quadraticCurveTo(w / 2, -d / 2, w / 2, -b); s.lineTo(w / 2, b); s.quadraticCurveTo(w / 2, d / 2, a, d / 2);
  s.lineTo(-a, d / 2); s.quadraticCurveTo(-w / 2, d / 2, -w / 2, b); s.lineTo(-w / 2, -b); s.quadraticCurveTo(-w / 2, -d / 2, -a, -d / 2);
  const g = new THREE.ExtrudeGeometry(s, { depth: h - 0.04, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 6, curveSegments: 16 });
  g.rotateX(-Math.PI / 2); g.translate(0, 0.02, 0); g.computeVertexNormals();
  return solid(g, new THREE.MeshPhysicalMaterial({ color, roughness: 0.3, clearcoat: 0.5 }));
}
/** a red petrol can (jerry can) with a handle and spout, bottom at y 0 */
export function jerryCan(s = 1) {
  const grp = new THREE.Group(), red = new THREE.MeshPhysicalMaterial({ color: 0xc8261e, roughness: 0.35, clearcoat: 0.7 });
  const body = solid(new THREE.BoxGeometry(0.2 * s, 0.3 * s, 0.11 * s).translate(0, 0.15 * s, 0), red);
  const ribs = [-1, 1].map((k) => { const r = solid(new THREE.BoxGeometry(0.15 * s, 0.2 * s, 0.006 * s), red); r.position.set(0, 0.15 * s, k * 0.058 * s); return r; });
  const h = solid(new THREE.TorusGeometry(0.045 * s, 0.012 * s, 10, 24, Math.PI), M.matte(0x8a1712, 0.5)); h.position.set(-0.035 * s, 0.302 * s, 0);
  const sp = solid(new THREE.CylinderGeometry(0.018 * s, 0.022 * s, 0.07 * s, 16), M.metal(0x9aa0a8, 0.35)); sp.position.set(0.07 * s, 0.33 * s, 0); sp.rotation.z = -0.5;
  grp.add(body, ...ribs, h, sp); return grp;
}
/** a street lamp (bottom at y 0): pole, arm, lamp head with a sodium tube under it. userData.on(k): 0 off → 1 full
 *  (the tube glows dim red first, then bright orange-yellow; a real light shines down). userData.head = tube position */
export function streetLamp(h = 1.0, arm = 0.32) {
  const grp = new THREE.Group(), steel = M.metal(0x59606a, 0.45);
  const pole = solid(new THREE.CylinderGeometry(0.018, 0.028, h - 0.02, 20).translate(0, h / 2 + 0.01, 0), steel);   // starts inside the base (no shared bottom)
  const base = solid(new THREE.CylinderGeometry(0.05, 0.06, 0.05, 24).translate(0, 0.025, 0), steel);
  const a = solid(new THREE.CylinderGeometry(0.012, 0.012, arm, 12).rotateZ(Math.PI / 2), steel); a.position.set(arm / 2, h - 0.02, 0);
  const head = solid(new THREE.CylinderGeometry(0.06, 0.1, 0.07, 32).translate(0, -0.035, 0), M.matte(0x3a3f46, 0.5)); head.position.set(arm, h + 0.01, 0);
  const tm = new THREE.MeshStandardMaterial({ color: 0x302a26, emissive: 0xff5a20, emissiveIntensity: 0, roughness: 0.3 });
  const tube = new THREE.Mesh(new THREE.CapsuleGeometry(0.016, 0.1, 6, 16).rotateZ(Math.PI / 2), tm); tube.position.set(arm, h - 0.075, 0);
  const cover = new THREE.Mesh(new THREE.SphereGeometry(0.085, 32, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), M.glass()); cover.scale.y = 0.45; cover.position.set(arm, h - 0.066, 0); cover.renderOrder = 5;
  const glow = glowSprite(0xffa040, 0.5); glow.position.copy(tube.position); glow.renderOrder = 6;
  const L = new THREE.SpotLight(0xffa64a, 0, 3.5, 0.9, 0.6, 1.2); L.position.copy(tube.position); L.target.position.set(arm, 0, 0); grp.add(L, L.target);
  const red = new THREE.Color(0xff3a1a), orange = new THREE.Color(0xffa23a);
  grp.add(base, pole, a, head, tube, cover, glow);
  grp.userData.head = tube.position.clone();
  grp.userData.on = (k) => {
    const warm = Math.min(1, k * 2.5), full = Math.max(0, (k - 0.3) / 0.7);
    tm.emissive.copy(red).lerp(orange, full); tm.emissiveIntensity = 0.6 * warm + 2.2 * full;
    glow.material.color.copy(red).lerp(orange, full); glow.material.opacity = 0.25 * warm + 0.75 * full; glow.scale.setScalar((0.25 + 0.45 * full) * h); glow.visible = k > 0.01;
    L.intensity = 40 * full * h * h;
  };
  grp.userData.on(0); return grp;
}
/** a glass jar of a white compound (bottom at y 0). kind: 'powder' | 'pellets' | 'crystals'. userData.fill(k) 0..1 */
export function compoundJar(kind = 'powder', color = 0xf4f3ee, r = 0.1, h = 0.26) {
  const grp = new THREE.Group(), jar = vial(r, h); grp.add(jar);
  const m = new THREE.MeshPhysicalMaterial({ color, roughness: kind === 'crystals' ? 0.15 : 0.85, clearcoat: kind === 'powder' ? 0 : 0.6 });
  const fill = new THREE.Group(); fill.position.y = 0.022; grp.add(fill);
  if (kind === 'powder') { const p = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.9, r * 0.9, h * 0.55, 32).translate(0, h * 0.275, 0), m); fill.add(p); }
  else {
    const n = kind === 'pellets' ? 160 : 90, g = kind === 'pellets' ? new THREE.SphereGeometry(0.012, 10, 8).scale(1, 0.55, 1) : new THREE.BoxGeometry(0.02, 0.016, 0.018);
    const im = new THREE.InstancedMesh(g, m, n), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    for (let i = 0; i < n; i++) {
      const d = r * 0.8 * Math.sqrt(hash(i, 7)), a = hash(i, 8) * 6.283; e.set(hash(i, 9) * 3, hash(i, 10) * 3, hash(i, 11) * 3); q.setFromEuler(e);
      m4.compose(new THREE.Vector3(Math.cos(a) * d, 0.01 + h * 0.5 * hash(i, 12), Math.sin(a) * d), q, new THREE.Vector3(1, 1, 1)); im.setMatrixAt(i, m4);
    }
    fill.add(im);
  }
  grp.userData.fill = (k) => { fill.scale.set(1, Math.max(1e-3, k), 1); fill.visible = k > 0.01; };
  return grp;
}
/** a nuclear reactor cooling loop (bottom at y 0, about 1.3 wide): a glass core vessel with glowing fuel rods, a glass
 *  pipe that carries liquid sodium up out of the core, across, down a coil in a water tank, and back.
 *  userData.update(t, k): the sodium beads flow (k = speed 0..1); hot beads glow orange, cooled ones are silver.
 *  userData.tank / userData.core = centres; userData.water = the water mesh (its top at y 0.315). */
export function coolantLoop() {
  const grp = new THREE.Group(), cx = -0.45, tx = 0.42;
  const vessel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.5, 40, 1, true).translate(0, 0.27, 0), M.glass()); vessel.position.x = cx; vessel.renderOrder = 5;
  const lid = solid(new THREE.CylinderGeometry(0.215, 0.215, 0.03, 40), M.metal(0x6a717a, 0.4)); lid.position.set(cx, 0.535, 0);
  const foot = solid(new THREE.CylinderGeometry(0.215, 0.23, 0.02, 40).translate(0, 0.0, 0), M.metal(0x6a717a, 0.4)); foot.position.set(cx, 0.01, 0);
  const rodM = new THREE.MeshStandardMaterial({ color: 0x3a2a20, emissive: 0xff4a12, emissiveIntensity: 1.6, roughness: 0.5 });
  const rods = [[0.1, 0], [-0.1, 0], [0.05, 0.09], [-0.05, 0.09], [0.05, -0.09], [-0.05, -0.09]].map(([x, z]) => { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.4, 16), rodM); r.position.set(cx + x, 0.27, z); return r; });
  const tank = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.4, 0.32).translate(0, 0.2, 0), M.glass()); tank.position.x = tx; tank.renderOrder = 5;
  const water = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.3).translate(0, 0.165, 0), M.liquid(0x5aa0d8, 0.35)); water.position.x = tx;
  const pts = [[cx, 0.07, 0], [cx, 0.46, 0], [cx + 0.02, 0.62, 0], [cx + 0.25, 0.68, 0], [tx - 0.05, 0.66, 0], [tx, 0.5, 0.0]];
  for (let i = 0; i <= 16; i++) { const a = i / 16 * Math.PI * 4, y = 0.4 - 0.3 * i / 16; pts.push([tx + 0.12 * Math.sin(a), y, 0.1 * Math.cos(a)]); }
  pts.push([tx - 0.02, 0.07, 0.02], [tx - 0.25, 0.05, 0.02], [cx + 0.25, 0.05, 0.0], [cx + 0.05, 0.06, 0]);
  const curve = new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)), true, 'catmullrom', 0.3);
  const pipe = new THREE.Mesh(new THREE.TubeGeometry(curve, 400, 0.024, 12, true), M.glass()); pipe.renderOrder = 6;
  const n = 90, beads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.016, 10, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.5, roughness: 0.3 }), n);
  const glowB = new THREE.InstancedMesh(new THREE.SphereGeometry(0.0165, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, toneMapped: false }), n);
  const cold = new THREE.Color(0xc8ccd2), hot = new THREE.Color(0xff8a2a), off = new THREE.Color(0x000000), m4 = new THREE.Matrix4(), c = new THREE.Color();
  const uCoreTop = 0.16, uCoilEnd = 0.8;                             // where the beads leave the core (hot) and leave the coil (cold)
  grp.add(foot, vessel, lid, ...rods, tank, water, pipe, beads, glowB);
  grp.userData.curve = curve; grp.userData.core = new THREE.Vector3(cx, 0.27, 0); grp.userData.tank = new THREE.Vector3(tx, 0.2, 0); grp.userData.water = water;
  let s = 0, last = 0;
  grp.userData.update = (t, k = 1) => {
    s += Math.max(0, Math.min(0.1, t - last)) * 0.05 * k; last = t;
    for (let i = 0; i < n; i++) {
      const u = (i / n + s) % 1, p = curve.getPointAt(u), heat = u < uCoreTop ? u / uCoreTop : u < 0.36 ? 1 : u < uCoilEnd ? 1 - (u - 0.36) / (uCoilEnd - 0.36) : 0;
      m4.makeTranslation(p.x, p.y, p.z); beads.setMatrixAt(i, m4);
      m4.makeScale(heat > 0.05 ? 1 : 1e-3, heat > 0.05 ? 1 : 1e-3, heat > 0.05 ? 1 : 1e-3).setPosition(p.x, p.y, p.z); glowB.setMatrixAt(i, m4);
      beads.setColorAt(i, c.copy(cold)); glowB.setColorAt(i, c.copy(off).lerp(hot, heat));
    }
    beads.instanceMatrix.needsUpdate = glowB.instanceMatrix.needsUpdate = true; beads.instanceColor.needsUpdate = glowB.instanceColor.needsUpdate = true;
  };
  grp.userData.update(0, 0); return grp;
}

// ---------------------------------------------------------------- 810 set pieces: where magnesium and calcium hide
/** three sticks of blackboard chalk lying on the table (bottom at y 0) */
export function chalkSticks(len = 0.3, r = 0.024) {
  const grp = new THREE.Group(), m = M.matte(0xf6f4ee, 0.95);
  [[0, 0, 0.1], [0.03, 0.06, -0.25], [-0.02, -0.06, 0.4]].forEach(([dx, dz, a], i) => {
    const s = solid(new THREE.CylinderGeometry(r, r * 1.03, len * (1 - 0.15 * i), 20).rotateZ(Math.PI / 2), m);
    s.position.set(dx, r + (i === 2 ? 2 * r * 0.85 : 0), dz); s.rotation.y = a; grp.add(s);
  });
  return grp;
}
let _marble;
/** a polished marble slab with grey veins (bottom at y 0) */
export function marbleSlab(w = 0.34, h = 0.06, d = 0.24) {
  if (!_marble) {
    const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d');
    x.fillStyle = '#efece6'; x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 14; i++) { x.strokeStyle = `rgba(${90 + 40 * hash(i, 1)},${90 + 40 * hash(i, 1)},${100 + 40 * hash(i, 1)},${0.25 + 0.4 * hash(i, 2)})`; x.lineWidth = 0.6 + 2.5 * hash(i, 3); x.beginPath();
      let px = hash(i, 4) * 256, py = 0; x.moveTo(px, py); for (let k = 0; k < 12; k++) { px += (hash(i, k + 5) - 0.4) * 50; py += 22; x.lineTo(px, py); } x.stroke(); }
    _marble = new THREE.CanvasTexture(c); _marble.colorSpace = THREE.SRGBColorSpace;
  }
  return solid(new THREE.BoxGeometry(w, h, d).translate(0, h / 2, 0), new THREE.MeshPhysicalMaterial({ map: _marble, roughness: 0.25, clearcoat: 0.8 }));
}
/** a grey rock with white silky fibres along it (asbestos), bottom at y 0 */
export function fibreRock(s = 0.12) {
  const grp = new THREE.Group(), b = rock(s, 0x8d918c, 0x5f635f, 11); b.scale.set(1.3, 0.6, 0.9); b.position.y = s * 0.45; grp.add(b);
  const n = 70, im = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.0025, 0.0025, 1, 5).rotateZ(Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xeef0ea, roughness: 0.4 }), n);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (let i = 0; i < n; i++) { e.set(0, (hash(i, 2) - 0.5) * 0.3, (hash(i, 3) - 0.5) * 0.2); q.setFromEuler(e); const l = s * (1.2 + 0.8 * hash(i, 4));
    m4.compose(new THREE.Vector3((hash(i, 5) - 0.5) * s * 0.3, s * (0.7 + 0.25 * hash(i, 6)), (hash(i, 7) - 0.5) * s * 0.9), q, new THREE.Vector3(l, 1, 1)); im.setMatrixAt(i, m4); }
  grp.add(im); return grp;
}
/** a chlorophyll molecule, simplified: four green rings round one silver magnesium atom, a tail (it faces +z) */
export function chlorophyll(r = 0.09) {
  const grp = new THREE.Group(), g = M.gloss(0x3cae4a), mg = new THREE.MeshPhysicalMaterial({ color: 0xc8ccd2, metalness: 0.7, roughness: 0.2, clearcoat: 1 });
  grp.add(solid(new THREE.SphereGeometry(r * 0.32, 24, 16), mg));
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2 + Math.PI / 4, ring = solid(new THREE.TorusGeometry(r * 0.28, r * 0.07, 10, 5), g);
    ring.position.set(Math.cos(a) * r, Math.sin(a) * r, 0); ring.rotation.z = a; grp.add(ring);
    const link = solid(new THREE.CylinderGeometry(r * 0.045, r * 0.045, r * 0.75, 8), g); link.position.set(Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5, 0); link.rotation.z = a + Math.PI / 2; grp.add(link);
  }
  const tail = solid(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[r, -r, 0], [r * 1.6, -r * 1.8, 0.02], [r * 1.1, -r * 2.6, 0], [r * 1.9, -r * 3.4, 0.02]].map((p) => new THREE.Vector3(...p))), 30, r * 0.05, 6), M.matte(0x8fbf5a, 0.5));
  grp.add(tail); return grp;
}
/** a coil of magnesium ribbon (bottom at y 0) */
export function ribbonCoil(r = 0.06, turns = 5, mat) {
  const pts = []; for (let i = 0; i <= turns * 24; i++) { const a = i / 24 * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * r, 0.012 + i / (turns * 24) * 0.045, Math.sin(a) * r)); }
  const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), turns * 48, 0.006, 4); g.scale(1, 1.6, 1);
  return solid(g, mat || new THREE.MeshPhysicalMaterial({ color: 0xb4b8bf, metalness: 0.85, roughness: 0.3 }));
}

/** a rough cut block of stone (limestone…), bottom at y 0 */
export function stoneBlock(w = 0.26, h = 0.15, d = 0.18, c1 = 0xd8cfbc, c2 = 0xb3a891, seed = 3) {
  const g = new THREE.BoxGeometry(w, h, d, 12, 8, 8), p = g.attributes.position, v = new THREE.Vector3(), col = [], A = new THREE.Color(c1), B = new THREE.Color(c2), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i); const n = fbm(v.x * 18 + seed, v.y * 18, v.z * 18);
    v.addScaledVector(v.clone().normalize(), (n - 0.5) * 0.018); p.setXYZ(i, v.x, v.y + h / 2, v.z);
    c.copy(A).lerp(B, Math.min(1, Math.max(0, n * 1.6 - 0.3))); col.push(c.r, c.g, c.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
  return solid(g, M.vcol(0.92));
}

// ---------------------------------------------------------------- 812 set pieces: what magnesium and calcium are used for
/** a beam balance (bottom at y 0). userData.tilt(a): the beam tips (a > 0: the right pan goes down);
 *  userData.pans = [left, right]: groups that hang level under the beam ends (things sit at pan-local y 0.013) */
export function balance(span = 0.6, h = 0.42) {
  const grp = new THREE.Group(), steel = M.metal(0x8d939b, 0.35), brass = new THREE.MeshPhysicalMaterial({ color: 0xc9a14a, metalness: 1, roughness: 0.25 });
  grp.add(solid(new THREE.BoxGeometry(span * 0.6, 0.03, 0.16).translate(0, 0.015, 0), M.matte(0x3a2a20, 0.6)));
  grp.add(solid(new THREE.CylinderGeometry(0.012, 0.016, h - 0.02, 16).translate(0, h / 2 + 0.01, 0), steel));   // starts inside the base
  const beam = new THREE.Group(); beam.position.y = h; grp.add(beam);
  beam.add(solid(new THREE.BoxGeometry(span + 0.04, 0.016, 0.016), steel));
  beam.add(solid(new THREE.ConeGeometry(0.008, 0.11, 8).translate(0, 0.063, 0), brass));   // the pointer
  const L = h - 0.13, pans = [-1, 1].map(() => {
    const p = new THREE.Group(); grp.add(p);
    p.add(solid(new THREE.CylinderGeometry(0.003, 0.003, L - 0.004, 6).translate(0, (L - 0.004) / 2 + 0.008, 0), steel, { outline: false }));   // from inside the pan to inside the beam
    p.add(solid(new THREE.CylinderGeometry(0.09, 0.07, 0.012, 32).translate(0, 0.006, 0), brass)); return p;
  });
  grp.userData.pans = pans;
  grp.userData.tilt = (a) => { beam.rotation.z = -a; pans.forEach((p, i) => { const s = i ? 1 : -1; p.position.set(s * span / 2 * Math.cos(a), h - s * span / 2 * Math.sin(a) - L, 0); }); };
  grp.userData.tilt(0); return grp;
}
/** a model aeroplane on a little stand (bottom at y 0, nose toward −x), polished metal skin */
export function toyPlane(s = 1) {
  const grp = new THREE.Group(), skin = new THREE.MeshPhysicalMaterial({ color: 0xd6dbe2, metalness: 0.85, roughness: 0.22, clearcoat: 0.6 }), dark = M.matte(0x26303c, 0.35);
  const air = new THREE.Group(); air.position.y = 0.2 * s; grp.add(air);
  const prof = [[0, 0], [0.022, 0.008], [0.038, 0.035], [0.045, 0.09], [0.045, 0.31], [0.03, 0.41], [0.012, 0.455], [0, 0.46]].map(([r, y]) => new THREE.Vector2(r * s, y * s));
  air.add(solid(new THREE.LatheGeometry(prof, 32).rotateZ(-Math.PI / 2).translate(-0.23 * s, 0, 0), skin));
  const flat = (pts, depth) => new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x * s, y * s))), { depth: depth * s, bevelEnabled: false });
  const wing = flat([[-0.07, 0], [0.03, 0.28], [0.08, 0.28], [0.05, 0], [0.08, -0.28], [0.03, -0.28]], 0.008).rotateX(-Math.PI / 2).translate(-0.02 * s, -0.012 * s, 0);
  air.add(solid(wing, skin));
  const tail = flat([[-0.07, 0], [0.03, 0.28], [0.08, 0.28], [0.05, 0], [0.08, -0.28], [0.03, -0.28]], 0.008).rotateX(-Math.PI / 2).scale(0.38, 1, 0.38).translate(0.19 * s, 0.006 * s, 0);
  air.add(solid(tail, skin));
  air.add(solid(flat([[0.13, 0.02], [0.2, 0.13], [0.235, 0.13], [0.225, 0.02]], 0.006).translate(0, 0, -0.003 * s), skin));
  const cab = solid(new THREE.SphereGeometry(0.03 * s, 20, 12), dark); cab.scale.set(1.6, 0.7, 0.9); cab.position.set(-0.17 * s, 0.026 * s, 0); air.add(cab);
  grp.add(solid(new THREE.CylinderGeometry(0.006 * s, 0.006 * s, 0.18 * s, 10).translate(0, 0.1 * s, 0), M.metal(0x6a7078, 0.4)));
  grp.add(solid(new THREE.CylinderGeometry(0.06 * s, 0.07 * s, 0.015 * s, 28).translate(0, 0.0075 * s, 0), M.matte(0x2b2f36, 0.5)));
  return grp;
}
/** a little toy car (bottom at y 0, along x): shiny body, dark windows, four wheels */
export function toyCar(color = 0xc8302a, s = 1) {
  const grp = new THREE.Group(), paint = new THREE.MeshPhysicalMaterial({ color, roughness: 0.3, clearcoat: 1, metalness: 0.3 });
  const ext = (pts, depth) => new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x * s, y * s))), { depth: depth * s, bevelEnabled: true, bevelThickness: 0.008 * s, bevelSize: 0.008 * s, bevelSegments: 4 }).translate(0, 0, -depth * s / 2);
  grp.add(solid(ext([[-0.17, 0.045], [0.17, 0.045], [0.175, 0.095], [0.12, 0.112], [-0.16, 0.112], [-0.175, 0.09]], 0.13), paint));
  grp.add(solid(ext([[0.08, 0.1], [0.035, 0.165], [-0.08, 0.165], [-0.125, 0.1]], 0.11), M.gloss(0x1e2630)));   // the cabin starts inside the body
  [[-0.105, 1], [0.105, 1], [-0.105, -1], [0.105, -1]].forEach(([x, z]) => {
    const w = solid(new THREE.CylinderGeometry(0.042 * s, 0.042 * s, 0.03 * s, 24).rotateX(Math.PI / 2), M.matte(0x1a1a1c, 0.6)); w.position.set(x * s, 0.042 * s, z * 0.078 * s); grp.add(w);
    const hub = solid(new THREE.CylinderGeometry(0.02 * s, 0.02 * s, 0.044 * s, 16).rotateX(Math.PI / 2), M.metal(0xc8ccd2, 0.25), { outline: false }); hub.position.copy(w.position); grp.add(hub);
  });
  return grp;
}
/** a steel gear wheel lying flat (bottom at y 0) */
export function gear(r = 0.11, teeth = 14, th = 0.03) {
  const s = new THREE.Shape(), n = teeth * 4;
  for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2, rr = (i % 4 === 1 || i % 4 === 2) ? r : r * 0.83; i ? s.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : s.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  const hole = new THREE.Path(); hole.absarc(0, 0, r * 0.28, 0, Math.PI * 2, true); s.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(s, { depth: th - 0.006, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 2, curveSegments: 24 }).rotateX(-Math.PI / 2).translate(0, 0.003, 0);
  return solid(g, M.metal(0x9aa1aa, 0.3));
}
/** a sparkler standing up (bottom at y 0): a bare wire with a grey coating on its upper part.
 *  userData.burn(k): the coating burns down from the top (0..1); userData.tip(): the burning point (local) */
export function sparkler(len = 0.45) {
  const grp = new THREE.Group(), y0 = len * 0.3, cl = len - y0;
  grp.add(solid(new THREE.CylinderGeometry(0.0028, 0.0028, len - 0.004, 6).translate(0, (len - 0.004) / 2, 0), M.metal(0x8a9098, 0.4), { outline: false }));
  const coat = solid(new THREE.CylinderGeometry(0.009, 0.009, cl, 10).translate(0, cl / 2, 0), M.matte(0x5c5a56, 0.95)); coat.position.y = y0; grp.add(coat);
  let k0 = 0;
  grp.userData.burn = (k) => { k0 = k; coat.scale.y = Math.max(1e-3, 1 - k); coat.visible = k < 0.999; };
  grp.userData.tip = () => new THREE.Vector3(0, y0 + cl * (1 - k0), 0);
  return grp;
}
/** a furnace: a steel vault on its side, open at the front (+z), lined with pale fire bricks; one brick of the lining
 *  is missing (userData.gap = { pos, rotZ } local). userData.bricks = the brick material (heat it: emissive) */
export function furnace(R = 0.3, Lz = 0.42) {
  const grp = new THREE.Group(), shell = M.metal(0x474c54, 0.55); shell.side = THREE.DoubleSide;
  const bm = new THREE.MeshStandardMaterial({ color: 0xe8dfca, roughness: 0.9, emissive: 0xff4a10, emissiveIntensity: 0 });
  grp.add(solid(new THREE.CylinderGeometry(R, R, Lz, 48, 1, true, -Math.PI / 2, Math.PI).rotateX(-Math.PI / 2), shell));
  const back = solid(new THREE.CircleGeometry(R - 0.004, 48, 0, Math.PI), shell); back.position.z = -Lz / 2 + 0.012; grp.add(back);
  grp.add(solid(new THREE.BoxGeometry(2 * R - 0.012, 0.02, Lz - 0.004).translate(0, 0.01, 0), M.matte(0x3a3d42, 0.8)));
  const rc = R - 0.045, nz = 5, na = 11, bw = Math.PI * rc / na - 0.008, bd = Lz / nz - 0.01;
  const im = new THREE.InstancedMesh(new THREE.BoxGeometry(bw, 0.035, bd), bm, nz * na), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  let k = 0, gap = null;
  for (let iz = 0; iz < nz; iz++) for (let ia = 0; ia < na; ia++) {
    const phi = (ia + 0.5) / na * Math.PI, z = -Lz / 2 + (iz + 0.5) * Lz / nz, pos = new THREE.Vector3(rc * Math.cos(phi), 0.02 + rc * Math.sin(phi), z), rz = phi - Math.PI / 2;
    e.set(0, 0, rz); q.setFromEuler(e);
    if (iz === nz - 1 && ia === 3) { gap = { pos, rotZ: rz }; m4.compose(pos, q, new THREE.Vector3(1e-4, 1e-4, 1e-4)); } else m4.compose(pos, q, new THREE.Vector3(1, 1, 1));
    im.setMatrixAt(k++, m4);
  }
  im.castShadow = true; grp.add(im);
  grp.userData = { gap, bricks: bm, brickSize: [bw, 0.035, bd] };
  return grp;
}
/** a roll of striped cloth lying along x with a loose end hanging to the table (bottom at y 0) */
export function clothRoll(c1 = '#2f6fc4', c2 = '#f2efe6', r = 0.055, w = 0.26) {
  const c = document.createElement('canvas'); c.width = 64; c.height = 64; const x = c.getContext('2d');
  x.fillStyle = c1; x.fillRect(0, 0, 64, 64); x.fillStyle = c2; for (let i = 0; i < 4; i++) x.fillRect(i * 16, 0, 5, 64);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(4, 2);
  const m = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }), grp = new THREE.Group();
  const roll = solid(new THREE.CylinderGeometry(r, r, w, 32).rotateZ(Math.PI / 2), m); roll.position.y = r; grp.add(roll);
  const flap = solid(new THREE.BoxGeometry(w - 0.01, r + 0.01, 0.004).translate(0, -(r + 0.01) / 2, 0), m); flap.position.set(0, r + 0.004, r - 0.01); flap.rotation.x = -0.35; grp.add(flap);
  return grp;
}
/** a stack of white paper sheets (bottom at y 0) */
export function paperStack(n = 8, w = 0.2, d = 0.27) {
  const grp = new THREE.Group(), m = M.matte(0xf6f6f2, 0.8);
  for (let i = 0; i < n; i++) { const p = solid(new THREE.BoxGeometry(w, 0.005, d), m, { outline: i === n - 1 }); p.position.y = 0.0035 + i * 0.0065; p.rotation.y = (hash(i, 3) - 0.5) * 0.08; grp.add(p); }
  return grp;
}
/** a brown medicine bottle with a white cap and a paper label (bottom at y 0) */
export function medicineBottle(s = 1) {
  const grp = new THREE.Group();
  const prof = [[0, 0.002], [0.048, 0.002], [0.054, 0.012], [0.054, 0.12], [0.03, 0.148], [0.021, 0.156], [0.021, 0.178], [0, 0.178]].map(([r, y]) => new THREE.Vector2(r * s, y * s));
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x7a3e10, roughness: 0.12, clearcoat: 1, transparent: true, opacity: 0.82 });
  grp.add(solid(new THREE.LatheGeometry(prof, 32), glass));
  const cap = solid(new THREE.CylinderGeometry(0.026 * s, 0.026 * s, 0.04 * s, 24).translate(0, 0.186 * s, 0), M.matte(0xf4f4f0, 0.5)); grp.add(cap);
  const c = document.createElement('canvas'); c.width = 256; c.height = 64; const x = c.getContext('2d');
  x.fillStyle = '#f7f5ee'; x.fillRect(0, 0, 256, 64); x.fillStyle = '#d23a32'; x.fillRect(110, 14, 36, 36); x.fillStyle = '#f7f5ee'; x.fillRect(122, 18, 12, 28); x.fillRect(114, 26, 28, 12);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  grp.add(new THREE.Mesh(new THREE.CylinderGeometry(0.0575 * s, 0.0575 * s, 0.06 * s, 32, 1, true).translate(0, 0.07 * s, 0), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 })));
  return grp;
}
/** a little factory: a brick building with a tall chimney (bottom at y 0). userData.top = the chimney mouth */
export function factory(s = 1) {
  const grp = new THREE.Group(), brick = M.matte(0x9a4a34, 0.85), white = M.matte(0xf0ede6, 0.6);
  grp.add(solid(new THREE.BoxGeometry(0.3 * s, 0.16 * s, 0.18 * s).translate(-0.04 * s, 0.08 * s, 0), brick));
  grp.add(solid(new THREE.CylinderGeometry(0.028 * s, 0.04 * s, 0.5 * s, 24).translate(0.07 * s, 0.25 * s + 0.12 * s, 0), brick));
  [0.42, 0.5].forEach((y) => { const b = solid(new THREE.TorusGeometry(0.031 * s, 0.006 * s, 8, 24).rotateX(Math.PI / 2), white, { outline: false }); b.position.set(0.07 * s, y * s, 0); grp.add(b); });
  grp.userData.top = new THREE.Vector3(0.07 * s, 0.62 * s, 0); return grp;
}
/** a little stack of sugar cubes (bottom at y 0) */
export function sugarCubes(e = 0.045) {
  const grp = new THREE.Group(), m = new THREE.MeshStandardMaterial({ color: 0xfbfaf6, roughness: 0.7 });
  [[-0.036, 0, 0.012, 0.1], [0.036, 0, 0, -0.2], [0, 0, -0.062, 0.3], [-0.036, 1, 0.012, 0.6]].forEach(([x, row, z, a]) => {   // footprints apart: no shared floor plane
    const c = solid(new THREE.BoxGeometry(e, e, e, 3, 3, 3), m); c.position.set(x, e / 2 + row * (e + 0.002), z); c.rotation.y = a; grp.add(c);
  });
  return grp;
}
/** a green glass bottle (bottom at y 0) */
export function glassBottle(s = 1) {
  const prof = [[0, 0.003], [0.044, 0.003], [0.05, 0.014], [0.05, 0.16], [0.04, 0.2], [0.018, 0.24], [0.016, 0.3], [0.02, 0.304], [0.02, 0.312], [0.013, 0.312], [0.013, 0.24]].map(([r, y]) => new THREE.Vector2(r * s, y * s));
  const m = new THREE.MeshPhysicalMaterial({ color: 0x3f8f5c, roughness: 0.06, clearcoat: 1, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false });
  const b = solid(new THREE.LatheGeometry(prof, 36), m); b.renderOrder = 5; return b;
}

// ---------------------------------------------------------------- 813 set pieces: soft and hard metals
/** a small iron truss bridge on two stone piers (bottom at y 0, along x). userData.road = height of the road deck */
export function trussBridge(len = 0.9) {
  const grp = new THREE.Group(), iron = M.metal(0x56616c, 0.45), PH = 0.2;
  [-1, 1].forEach((s, i) => { const p = stoneBlock(0.14, PH, 0.24, 0xc9bfa9, 0xa39782, 5 + i); p.position.x = s * (len / 2 - 0.07); grp.add(p); });
  const deck = solid(new THREE.BoxGeometry(len, 0.024, 0.17), M.matte(0x3a3d42, 0.8)); deck.position.y = PH + 0.008; grp.add(deck);   // sinks 4 mm into the piers
  const top = PH + 0.02, H = 0.13, n = 6, up = new THREE.Vector3(0, 1, 0);
  const bar = (a, b, r) => { const d = b.clone().sub(a), m = solid(new THREE.CylinderGeometry(r, r, d.length(), 8), iron, { outline: false }); m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(up, d.normalize()); grp.add(m); };
  const P = (k, hi, z) => new THREE.Vector3(-len / 2 + 0.03 + k * (len - 0.06) / n, top + (hi ? H : 0), z);
  for (const z of [-0.08, 0.08]) {
    bar(P(0, 0, z), P(n, 0, z), 0.008); bar(P(1, 1, z), P(n - 1, 1, z), 0.008);           // bottom and top chords
    bar(P(0, 0, z), P(1, 1, z), 0.007); bar(P(n, 0, z), P(n - 1, 1, z), 0.007);           // the sloping ends
    for (let k = 1; k < n; k++) bar(P(k, 0, z), P(k, 1, z), 0.005);                       // uprights
    for (let k = 1; k < n - 1; k++) bar(P(k, k % 2, z), P(k + 1, (k + 1) % 2, z), 0.005);  // zig-zag diagonals
  }
  for (let k = 1; k < n; k++) bar(P(k, 1, -0.08), P(k, 1, 0.08), 0.004);                  // cross ties on top
  grp.userData.road = top; return grp;
}
/** the steel skeleton of a building going up (bottom at y 0): columns, floor beams, a concrete foot */
export function steelFrame(w = 0.3, h = 0.62, d = 0.24, floors = 4) {
  const grp = new THREE.Group(), steel = M.metal(0x6a737d, 0.4), c = 0.018;
  const foot = solid(new THREE.BoxGeometry(w + 0.07, 0.02, d + 0.07), M.matte(0xb9b4aa, 0.9)); foot.position.y = 0.01; grp.add(foot);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const m = solid(new THREE.BoxGeometry(c, h - 0.012, c), steel); m.position.set(sx * w / 2, 0.012 + (h - 0.012) / 2, sz * d / 2); grp.add(m); }   // columns start inside the foot
  for (let f = 1; f <= floors; f++) {
    const y = f * h / floors - 0.014;
    for (const sz of [-1, 1]) { const m = solid(new THREE.BoxGeometry(w - c + 0.004, 0.014, 0.012), steel); m.position.set(0, y, sz * d / 2); grp.add(m); }
    for (const sx of [-1, 1]) { const m = solid(new THREE.BoxGeometry(0.012, 0.011, d - c + 0.004), steel); m.position.set(sx * w / 2, y - 0.0035, 0); grp.add(m); }
  }
  return grp;
}
/** a brass weight that hangs from its hook (the hook's top is the origin; the weight hangs below). userData.bottom */
export function hangWeight(r = 0.045, h = 0.08) {
  const grp = new THREE.Group(), steel = M.metal(0x8d939b, 0.3);
  const body = solid(new THREE.CylinderGeometry(r, r, h, 32), new THREE.MeshPhysicalMaterial({ color: 0xc9a14a, metalness: 1, roughness: 0.3 })); body.position.y = -0.06 - h / 2;
  const rod = solid(new THREE.CylinderGeometry(0.004, 0.004, 0.056, 8), steel, { outline: false }); rod.position.y = -0.036;
  const hook = solid(new THREE.TorusGeometry(0.012, 0.003, 8, 20, Math.PI * 1.4), steel, { outline: false }); hook.position.y = -0.008; hook.rotation.z = -0.2;
  grp.add(body, rod, hook); grp.userData.bottom = -0.06 - h; return grp;
}
/** a little crystal of metal atoms (balls) held by glowing links (the metallic bond). userData.balls (each has .home
 *  and .ijk); after moving balls call userData.update(): the links follow, a link stretched past 1.6 × breaks */
export function metalLattice(nx, ny, nz, r, gap, ballMat, linkR, linkMat) {
  const grp = new THREE.Group(), balls = [], links = [], geo = new THREE.SphereGeometry(r, 28, 18), lg = new THREE.CylinderGeometry(linkR, linkR, 1, 10, 1, true);
  const idx = (i, j, k) => (k * ny + j) * nx + i;
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const b = solid(geo, ballMat); b.userData.home = new THREE.Vector3((i - (nx - 1) / 2) * gap, (j - (ny - 1) / 2) * gap, -k * gap); b.userData.ijk = [i, j, k];
    b.position.copy(b.userData.home); grp.add(b); balls.push(b);
  }
  const join = (a, b) => { const m = new THREE.Mesh(lg, linkMat); grp.add(m); links.push({ m, a: balls[a], b: balls[b] }); };
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    if (i + 1 < nx) join(idx(i, j, k), idx(i + 1, j, k)); if (j + 1 < ny) join(idx(i, j, k), idx(i, j + 1, k)); if (k + 1 < nz) join(idx(i, j, k), idx(i, j, k + 1));
  }
  const up = new THREE.Vector3(0, 1, 0), d = new THREE.Vector3();
  const update = () => links.forEach((l) => {
    d.subVectors(l.b.position, l.a.position); const L = d.length(), s = Math.min(l.a.scale.x, l.b.scale.x);
    l.m.visible = L < gap * 1.6 && l.a.visible && l.b.visible && s > 0.5;
    l.m.position.copy(l.a.position).add(l.b.position).multiplyScalar(0.5); l.m.scale.set(1, Math.max(1e-4, L - 1.8 * r), 1); l.m.quaternion.setFromUnitVectors(up, d.normalize());
  });
  update(); grp.userData = { balls, links, update }; return grp;
}

// ---------------------------------------------------------------- 814 set pieces: noble metals
export const NOBLE = { gold: 0xf2c14e, silver: 0xe4e7ec, plat: 0xd2d5d9, copper: 0xc8743a, cuni: 0xc9ccd0 };
/** a polished noble-metal material (gold, silver, platinum …) */
export function nobleMat(c, r = 0.16) { return new THREE.MeshPhysicalMaterial({ color: c, metalness: 1, roughness: r, clearcoat: 0.5, clearcoatRoughness: 0.1 }); }
/** a coin lying flat (bottom at y 0): a raised rim round a sunken face with a ring stamped on it */
export function coin(r = 0.06, color = NOBLE.gold, th = 0.009) {
  const mat = nobleMat(color, 0.24), prof = [[0, 0], [r, 0], [r, th], [r * 0.86, th], [r * 0.83, th * 0.7], [0, th * 0.7]].map(([x, y]) => new THREE.Vector2(x, y));
  const grp = new THREE.Group(); grp.add(solid(new THREE.LatheGeometry(prof, 48), mat));
  const st = solid(new THREE.TorusGeometry(r * 0.48, th * 0.16, 8, 40), mat, { outline: false }); st.rotation.x = Math.PI / 2; st.position.y = th * 0.7; grp.add(st);
  grp.userData.mat = mat; return grp;
}
/** a paper banknote lying flat (bottom at y 0) */
export function banknote(w = 0.32, d = 0.15) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 240; const x = c.getContext('2d');
  x.fillStyle = '#8fbf8a'; x.fillRect(0, 0, 512, 240); x.strokeStyle = '#3f6e45'; x.lineWidth = 10; x.strokeRect(14, 14, 484, 212);
  x.fillStyle = '#3f6e45'; x.font = '700 92px sans-serif'; x.textBaseline = 'middle'; x.fillText('100', 40, 120);
  x.beginPath(); x.arc(370, 120, 70, 0, Math.PI * 2); x.fillStyle = '#a9d0a3'; x.fill(); x.stroke();
  const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace;
  const top = new THREE.MeshStandardMaterial({ map: tx, roughness: 0.85 }), edge = M.matte(0x8fbf8a, 0.85);
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.003, d).translate(0, 0.0015, 0), [edge, edge, top, edge, edge, edge]); m.castShadow = m.receiveShadow = true; return m;
}
/** a computer circuit board (bottom at y 0): green board, a black chip, gold contact fingers along the front edge.
 *  userData.fingers = their world-local x positions (for a signal travelling along them) */
export function circuitBoard(w = 0.42, d = 0.26) {
  const grp = new THREE.Group(), th = 0.012;
  grp.add(solid(new THREE.BoxGeometry(w, th, d).translate(0, th / 2, 0), new THREE.MeshPhysicalMaterial({ color: 0x1f6b3a, roughness: 0.35, clearcoat: 0.8 })));
  const chip = solid(new THREE.BoxGeometry(0.12, 0.016, 0.1).translate(0, 0.008, 0), M.matte(0x16181c, 0.5)); chip.position.set(-0.04, th - 0.002, -0.02); grp.add(chip);
  const gm = nobleMat(NOBLE.gold, 0.2), xs = [];
  for (let i = 0; i < 9; i++) { const x = -w / 2 + 0.05 + i * (w - 0.1) / 8, f = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.003, 0.05).translate(0, 0.0015, 0), gm); f.position.set(x, th - 0.001, d / 2 - 0.032); grp.add(f); xs.push(x); }
  const tm = M.matte(0xc9a14a, 0.5);                                                   // gold tracks from the chip to the fingers
  xs.forEach((x, i) => { const L = d / 2 - 0.057 - 0.03, tr = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.002, L).translate(0, 0.001, 0), tm); tr.position.set(x, th - 0.0005, 0.03 + L / 2 - 0.0); grp.add(tr); });
  grp.userData.fingers = xs; grp.userData.top = th; return grp;
}
/** a car's catalytic converter (along x, bottom at y 0): a steel can between two pipes; the platinum honeycomb shows
 *  through a window cut in its side. userData.inX, outX (pipe ends), y (pipe height) */
export function converter(len = 0.5) {
  const grp = new THREE.Group(), steel = M.metal(0xb4b9c0, 0.35), y = 0.11;
  const can = solid(new THREE.CylinderGeometry(0.09, 0.09, len * 0.55, 32, 1, true).rotateZ(Math.PI / 2), steel); can.material.side = THREE.DoubleSide; can.position.y = y; grp.add(can);
  for (const s of [-1, 1]) {
    const cone = solid(new THREE.CylinderGeometry(0.035, 0.09, 0.07, 32, 1, true).rotateZ(s * Math.PI / 2), steel); cone.material.side = THREE.DoubleSide; cone.position.set(s * (len * 0.275 + 0.035), y, 0); grp.add(cone);
    const pipe = solid(new THREE.CylinderGeometry(0.03, 0.03, len * 0.2, 20, 1, true).rotateZ(Math.PI / 2), steel); pipe.material.side = THREE.DoubleSide; pipe.position.set(s * (len * 0.275 + 0.07 + len * 0.1 - 0.004), y, 0); grp.add(pipe);
  }
  const hc = new THREE.Mesh(new THREE.CylinderGeometry(0.084, 0.084, len * 0.5, 6, 1).rotateZ(Math.PI / 2), nobleMat(NOBLE.plat, 0.35)); hc.position.y = y; grp.add(hc);   // the honeycomb core
  for (const s of [-1, 1]) { const foot = solid(new THREE.BoxGeometry(0.03, y - 0.03, 0.06).translate(0, (y - 0.03) / 2, 0), M.matte(0x2b2f38, 0.6)); foot.position.x = s * len * 0.2; grp.add(foot); }
  grp.userData = { inX: -(len * 0.275 + 0.07 + len * 0.2 - 0.004), outX: len * 0.275 + 0.07 + len * 0.2 - 0.004, y }; return grp;
}
/** a ring with a gem held by four prongs (bottom at y 0) */
export function gemRing(r = 0.06, metal = NOBLE.plat, gem = 0x4a8cff) {
  const grp = new THREE.Group(), mat = nobleMat(metal, 0.14), th = r * 0.18;
  const band = solid(new THREE.TorusGeometry(r, th, 20, 64), mat); band.position.y = r + th; grp.add(band);   // standing up
  const g = new THREE.Mesh(new THREE.OctahedronGeometry(r * 0.45, 0).scale(1, 0.75, 1), new THREE.MeshPhysicalMaterial({ color: gem, roughness: 0.02, transmission: 0.6, thickness: 0.05, ior: 2.4, clearcoat: 1, flatShading: true }));
  g.position.y = 2 * r + th + r * 0.42; g.castShadow = true; grp.add(g);
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4, p = solid(new THREE.CylinderGeometry(th * 0.25, th * 0.3, r * 0.5, 8), mat, { outline: false }); p.position.set(Math.cos(a) * r * 0.3, 2 * r + th + r * 0.25, Math.sin(a) * r * 0.3); p.rotation.set(Math.sin(a) * 0.35, 0, -Math.cos(a) * 0.35); grp.add(p); }
  return grp;
}
/** a chain necklace lying on the table in a loop (bottom at y 0): small gold links, one draw */
export function necklace(r = 0.12, color = NOBLE.gold, n = 64) {
  const mesh = new THREE.InstancedMesh(new THREE.TorusGeometry(0.009, 0.0025, 6, 12), nobleMat(color, 0.18), n), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2, rr = r * (1 + 0.12 * Math.sin(a * 2 + 1)) * (a > 4.5 && a < 5.2 ? 1.2 : 1);
    e.set(i % 2 ? Math.PI / 2 : 0, -a, 0); q.setFromEuler(e); m4.compose(new THREE.Vector3(Math.cos(a) * rr, 0.009, Math.sin(a) * rr * 0.8), q, new THREE.Vector3(1, 1, 1)); mesh.setMatrixAt(i, m4);
  }
  mesh.castShadow = true; return mesh;
}
/** a curly twist of native silver wire (as it grows in rock), centred at the origin */
export function nativeWire(s = 0.1, seed = 3) {
  const pts = []; let p = new THREE.Vector3(), d = new THREE.Vector3(1, 0.3, 0.2).normalize();
  for (let i = 0; i < 40; i++) { pts.push(p.clone()); d.add(new THREE.Vector3(hash(i, seed) - 0.5, hash(i, seed + 1) - 0.5, hash(i, seed + 2) - 0.5).multiplyScalar(0.7)).normalize(); p = p.clone().addScaledVector(d, s * 0.08); }
  const c = new THREE.CatmullRomCurve3(pts), g = new THREE.TubeGeometry(c, 120, s * 0.035, 8), ctr = new THREE.Vector3(); new THREE.Box3().setFromPoints(pts).getCenter(ctr); g.translate(-ctr.x, -ctr.y, -ctr.z);
  return solid(g, nobleMat(NOBLE.silver, 0.3), { outline: false });
}
/** a strip of camera film (lying flat, along x): cream frames coated with silver salts; userData.expose(i, k) darkens frame i */
export function filmStrip(n = 4, fw = 0.08) {
  const grp = new THREE.Group(), w = n * fw + 0.02, d = 0.07;
  grp.add(solid(new THREE.BoxGeometry(w, 0.003, d).translate(0, 0.0015, 0), M.matte(0x3a2a1c, 0.5)));
  const holeM = M.matte(0x0f0c09, 0.9);
  for (let i = 0; i < n * 3; i++) for (const z of [-1, 1]) { const h = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.0012, 0.008), holeM); h.position.set(-w / 2 + 0.015 + i * (w - 0.03) / (n * 3 - 1), 0.0055, z * (d / 2 - 0.009)); grp.add(h); }
  const frames = Array.from({ length: n }, (_, i) => { const m = new THREE.MeshStandardMaterial({ color: 0xece2c6, roughness: 0.6 }), f = new THREE.Mesh(new THREE.BoxGeometry(fw - 0.012, 0.0012, d - 0.03 - (i % 2) * 0.006), m); f.position.set(-w / 2 + 0.01 + fw / 2 + i * fw, 0.0085 + (i % 2) * 0.003, 0); grp.add(f); return m; });
  const pale = new THREE.Color(0xece2c6), dark = new THREE.Color(0x2a2620);
  grp.userData.expose = (i, k) => frames[i].color.copy(pale).lerp(dark, clamp01(k)); grp.userData.frameX = (i) => -w / 2 + 0.01 + fw / 2 + i * fw;
  return grp;
}
/** a rough lump of rock with gold showing in it (bottom near y 0) */
export function goldRock(s = 0.12, seed = 4) {
  const grp = new THREE.Group(), r = rock(s, 0xe9e4da, 0xbfb6a6, seed); r.scale.set(1.4, 0.8, 1); grp.add(r);
  const gm = nobleMat(NOBLE.gold, 0.3);
  [[0.35, 0.45, 0.6, 0.35], [-0.4, 0.5, 0.5, 0.28], [0.05, 0.62, 0.3, 0.3], [0.6, 0.3, -0.2, 0.22]].forEach(([x, y, z, k], i) => { const n = lump(s * k, gm, seed + i * 3, 0.6, 0.5); n.position.set(x * s * 1.2, y * s * 0.8, z * s); grp.add(n); });
  return grp;
}

/** a scalpel lying flat (bottom at y 0, along x): a flat steel handle and a curved blade at +x */
export function scalpel(len = 0.24) {
  const grp = new THREE.Group(), steel = nobleMat(0xd4d8de, 0.22), hl = len * 0.68;
  grp.add(solid(new THREE.BoxGeometry(hl, 0.008, 0.022).translate(-len / 2 + hl / 2, 0.004, 0), steel));
  const s = new THREE.Shape(); s.moveTo(0, -0.009); s.lineTo(len - hl - 0.01, -0.009); s.quadraticCurveTo(len - hl + 0.012, 0.0, len - hl - 0.004, 0.012); s.quadraticCurveTo(0.03, 0.016, 0, 0.009); s.closePath();
  const b = solid(new THREE.ExtrudeGeometry(s, { depth: 0.002, bevelEnabled: false }).rotateX(-Math.PI / 2).translate(-len / 2 + hl, 0.003, 0), steel, { outline: false }); grp.add(b);
  return grp;
}
/** a laser pen along x (bottom at y 0); userData.beam(k, L): a red beam grows from its tip to length L */
export function laserPen(len = 0.2) {
  const grp = new THREE.Group(), r = 0.013;
  const body = solid(new THREE.CylinderGeometry(r, r, len * 0.8, 24).rotateZ(Math.PI / 2), M.gloss(0x22262e)); body.position.set(-len * 0.1, r, 0); grp.add(body);
  const tip = solid(new THREE.CylinderGeometry(r * 0.7, r, len * 0.2, 24).rotateZ(Math.PI / 2), nobleMat(0xd2d5d9, 0.25)); tip.position.set(len * 0.4 - 0.002, r, 0); grp.add(tip);
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 1, 8).rotateZ(Math.PI / 2).translate(0.5, 0, 0), M.glow(0xff2a2a, 4)); beam.position.set(len / 2, r, 0); grp.add(beam);
  const dot = glowSprite(0xff4a3a, 0.08); grp.add(dot);
  grp.userData.beam = (k, L = 0.4) => { beam.visible = dot.visible = k > 0.01; beam.scale.x = Math.max(1e-4, L * k); dot.position.set(len / 2 + L * k, r, 0); };
  grp.userData.beam(0); return grp;
}
/** a round mirror on a little stand, facing +z (bottom at y 0); userData.c = its centre */
export function mirrorStand(r = 0.12) {
  const grp = new THREE.Group(), y = r + 0.05;
  const glassM = new THREE.MeshPhysicalMaterial({ color: 0xf4f6f8, metalness: 1, roughness: 0.03 });
  const face = new THREE.Mesh(new THREE.CircleGeometry(r, 64), glassM); face.position.set(0, y, 0.006); grp.add(face);
  const back = solid(new THREE.CylinderGeometry(r + 0.012, r + 0.012, 0.01, 64).rotateX(Math.PI / 2), M.gloss(0x2a2d33)); back.position.y = y; grp.add(back);
  const leg = solid(new THREE.BoxGeometry(0.02, y - r + 0.01, 0.02).translate(0, (y - r + 0.01) / 2, 0), M.gloss(0x2a2d33)); leg.position.set(0, 0.012, -0.01); grp.add(leg);
  grp.add(solid(new THREE.CylinderGeometry(0.07, 0.075, 0.012, 32).translate(0, 0.006, 0), M.gloss(0x2a2d33)));
  grp.userData.c = new THREE.Vector3(0, y, 0.006); grp.userData.mat = glassM; return grp;
}
/** a gold crown (cap) for kit.tooth(s): slides down over the tooth's crown (bottom at y 0 = tooth y s*1.33) */
export function toothCrown(s = 0.12, color = NOBLE.gold) {
  const o = [[s * 1.0, 0], [s * 1.04, s * 0.2], [s * 1.0, s * 0.55], [s * 0.8, s * 0.82], [s * 0.38, s * 0.98], [0, s * 0.95]];
  const m = solid(new THREE.LatheGeometry(o.map(([x, y]) => new THREE.Vector2(x, y)), 48).scale(1, 1, 0.9), nobleMat(color, 0.18)); m.material.side = THREE.DoubleSide; return m;
}
/** an open steel mould (bottom at y 0) for a metal bar; userData.floor = its inside floor height */
export function ingotMould(w = 0.24, d = 0.12, h = 0.05, th = 0.014) {
  const grp = new THREE.Group(), steel = M.metal(0x4a4f58, 0.5);
  grp.add(solid(new THREE.BoxGeometry(w, th, d).translate(0, th / 2, 0), steel));
  for (const s of [-1, 1]) {
    const a = solid(new THREE.BoxGeometry(th, h - th - 0.002, d - 0.004).translate(0, th + (h - th) / 2, 0), steel); a.position.x = s * (w / 2 - th / 2); grp.add(a);
    const b = solid(new THREE.BoxGeometry(w - 2 * th - 0.004, h - th - 0.003, th).translate(0, th + (h - th) / 2, 0), steel); b.position.z = s * (d / 2 - th / 2); grp.add(b);
  }
  grp.userData.floor = th; grp.userData.inner = [w - 2 * th, d - 2 * th]; return grp;
}
/** a table spoon lying on its back (bottom near y 0, along x): an oval bowl at +x and a flat handle */
export function tableSpoon(len = 0.26, color = 0xe6e2da) {
  const grp = new THREE.Group(), mat = nobleMat(color, 0.18); mat.side = THREE.DoubleSide;
  const bowl = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat); bowl.scale.set(len * 0.2, len * 0.07, len * 0.13); bowl.position.set(len * 0.3, len * 0.07, 0); bowl.castShadow = true; grp.add(bowl);
  const h = solid(new THREE.BoxGeometry(len * 0.62, 0.006, len * 0.06).translate(-len * 0.2, 0.003 + len * 0.04, 0), mat); h.rotation.z = 0.08; grp.add(h);
  return grp;
}

// ---------------------------------------------------------------- 816 set pieces: halogens
/** a glass salt shaker (bottom at y 0) with white salt inside and a steel cap with holes; userData.top = the cap's
 *  centre (where the grains come out), userData.fill(k) lowers the salt as it is poured out */
export function saltShaker(h = 0.24, r = 0.055) {
  const grp = new THREE.Group();
  const prof = [[0, 0], [r * 0.95, 0], [r, 0.02], [r, h * 0.78], [r * 0.9, h * 0.82], [r * 0.9, h * 0.8], [r * 0.95 - 0.004, h * 0.77], [r - 0.006, 0.024], [0, 0.012]].map(([x, y]) => new THREE.Vector2(x, y));
  const glass = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), M.glass()); glass.renderOrder = 5; grp.add(glass);
  const salt = solid(new THREE.CylinderGeometry(r - 0.012, r - 0.012, 1, 32).translate(0, 0.5, 0), new THREE.MeshPhysicalMaterial({ color: 0xf6f5f1, roughness: 0.6 }), { outline: false });
  salt.position.y = 0.016; grp.add(salt);
  const cap = solid(new THREE.LatheGeometry([[0, h], [r * 0.62, h], [r * 0.92, h * 0.97], [r * 1.03, h * 0.9], [r * 1.03, h * 0.81], [0, h * 0.81]].map(([x, y]) => new THREE.Vector2(x, y)), 40), M.metal(0xc9ced6, 0.25));
  grp.add(cap);
  for (let i = 0; i < 7; i++) { const a = i / 6 * Math.PI * 2, d = i ? r * 0.38 : 0; const hole = new THREE.Mesh(new THREE.CircleGeometry(0.0045, 12), new THREE.MeshBasicMaterial({ color: 0x15171b })); hole.rotation.x = -Math.PI / 2; hole.position.set(Math.cos(a) * d, h + 0.002, Math.sin(a) * d); grp.add(hole); }
  grp.userData.top = new THREE.Vector3(0, h, 0);
  grp.userData.fill = (k) => { salt.scale.y = Math.max(1e-4, (h * 0.55) * (1 - 0.35 * k)); };
  grp.userData.fill(0); return grp;
}

// ---------------------------------------------------------------- 817 set pieces: halogens react
/** a glass test tube (round bottom at y 0, open top at h). userData.fill(color, level) puts a liquid in it (returns it) */
export function testTube(r = 0.045, h = 0.42) {
  const prof = [[0, 0]]; for (let i = 1; i <= 8; i++) { const a = (i / 8) * Math.PI / 2; prof.push([r * Math.sin(a), r - r * Math.cos(a)]); }
  prof.push([r, h], [r + 0.008, h + 0.004], [r + 0.008, h + 0.012], [r - 0.004, h + 0.012], [r - 0.004, r]);
  for (let i = 8; i >= 0; i--) { const a = (i / 8) * Math.PI / 2; prof.push([(r - 0.004) * Math.sin(a), 0.004 + (r - 0.004) - (r - 0.004) * Math.cos(a)]); }
  const g = new THREE.Mesh(new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(x, y)), 40), M.glass()); g.renderOrder = 5;
  const grp = new THREE.Group(); grp.add(g);
  grp.userData.fill = (color, level, o = 0.6) => {                  // a round-bottomed column of liquid, inset from the glass
    const ri = r - 0.009, lp = [[0, 0.009]]; for (let i = 1; i <= 8; i++) { const a = (i / 8) * Math.PI / 2; lp.push([ri * Math.sin(a), 0.009 + ri - ri * Math.cos(a)]); }
    lp.push([ri, level]);
    const mat = M.liquid(color, o), body = new THREE.Mesh(new THREE.LatheGeometry(lp.map(([x, y]) => new THREE.Vector2(x, y)), 32), mat); body.renderOrder = 4;
    const top = new THREE.Mesh(new THREE.CircleGeometry(ri, 32), mat); top.rotation.x = -Math.PI / 2; top.position.y = level; top.renderOrder = 4;
    const liq = new THREE.Group(); liq.add(body, top); liq.userData.mat = mat; grp.add(liq); return liq;
  };
  return grp;
}
/** a wooden test-tube rack for n tubes `gap` apart (tubes stand with their bottom at y 0.03, through holes at y 0.2) */
export function tubeRack(n = 2, gap = 0.2, r = 0.045) {
  const grp = new THREE.Group(), wood = M.matte(0xa7774a, 0.7), w = n * gap + 0.08;
  const base = solid(new THREE.BoxGeometry(w, 0.025, 0.16), wood); base.position.y = 0.0125;
  const shelf = new THREE.Shape(); shelf.moveTo(-w / 2, -0.08); shelf.lineTo(w / 2, -0.08); shelf.lineTo(w / 2, 0.08); shelf.lineTo(-w / 2, 0.08); shelf.closePath();
  for (let i = 0; i < n; i++) { const h = new THREE.Path(); h.absarc((i - (n - 1) / 2) * gap, 0, r + 0.012, 0, Math.PI * 2, true); shelf.holes.push(h); }
  const top = solid(new THREE.ExtrudeGeometry(shelf, { depth: 0.02, bevelEnabled: false }).rotateX(Math.PI / 2), wood); top.position.y = 0.21;
  for (const s of [-1, 1]) { const leg = solid(new THREE.BoxGeometry(0.02, 0.18, 0.15), wood); leg.position.set(s * (w / 2 - 0.012), 0.115, 0); grp.add(leg); }
  grp.add(base, top); grp.userData.x = (i) => (i - (n - 1) / 2) * gap; return grp;
}
/** a small sun (the cause "sunlight"): a warm glowing ball with soft rays; userData.set(k) brightens it 0..1 */
export function sunLamp(r = 0.12) {
  const grp = new THREE.Group(), ball = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), M.glow(0xffc23a, 0));
  const halo = glowSprite(0xffb020, r * 7); grp.add(ball, halo);
  const rays = Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2, m = new THREE.Mesh(new THREE.ConeGeometry(r * 0.16, r * 0.9, 8), M.glow(0xffd060, 0)); m.position.set(Math.cos(a) * r * 1.7, Math.sin(a) * r * 1.7, 0); m.rotation.z = a - Math.PI / 2; grp.add(m); return m; });
  grp.userData.set = (k) => { ball.material.emissiveIntensity = 3 * k; rays.forEach((m) => { m.material.emissiveIntensity = 2.5 * k; m.scale.setScalar(Math.max(1e-4, k)); }); halo.material.opacity = k; halo.visible = k > 0.01; };
  grp.userData.set(0); return grp;
}

// ---------------------------------------------------------------- 401 set pieces: why atoms bond (Chapter 4)
/** a party balloon on a ribbon tied to a small weight (the weight stands at y 0); the balloon floats at about y 0.62 */
export function balloon(color = 0xd8a4ff, r = 0.13) {
  const grp = new THREE.Group(), prof = [];
  for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI, s = Math.sin(a); prof.push(new THREE.Vector2(r * s * (1 - 0.22 * (1 - i / 24) ** 2), -r * Math.cos(a) * 1.18)); }   // narrower toward the knot
  const body = solid(new THREE.LatheGeometry(prof, 48), new THREE.MeshPhysicalMaterial({ color, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.1, sheen: 0.4 }));
  const knot = solid(new THREE.ConeGeometry(r * 0.12, r * 0.16, 16), M.gloss(color)); knot.position.y = -r * 1.24;
  const ball = new THREE.Group(); ball.add(body, knot); ball.position.y = 0.62; grp.add(ball);
  const top = new THREE.Vector3(0, 0.62 - r * 1.3, 0), ribbon = wire([[0, 0.05, 0], [0.02, 0.2, 0.01], [-0.015, 0.36, 0], [0, top.y, 0]], 0xf2f2f2, 0.003);
  const weight = solid(new THREE.CylinderGeometry(0.035, 0.045, 0.05, 24), M.metal(0xc8ccd2, 0.3)); weight.position.y = 0.025;
  grp.add(ribbon, weight); grp.userData.ball = ball;
  grp.userData.update = (t) => { ball.position.y = 0.62 + 0.012 * Math.sin(t * 1.3); ball.rotation.z = 0.05 * Math.sin(t * 0.9); };
  return grp;
}
/** a neon sign: a bent glass tube (path = [[x, y]…] in metres, standing on a small dark base) that really glows;
 *  userData.set(k) switches it on (0..1) */
export function neonSign(path, color = 0xff5a2a) {
  const grp = new THREE.Group(), curve = new THREE.CatmullRomCurve3(path.map(([x, y]) => new THREE.Vector3(x, y, 0)), false, 'centripetal', 0.2);
  const glowM = M.glow(color, 0), core = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.008, 8), glowM);
  const sleeve = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.016, 10), M.glass()); sleeve.renderOrder = 5;
  const xs = path.map(([x]) => x), base = solid(new THREE.BoxGeometry(Math.max(...xs) - Math.min(...xs) + 0.12, 0.03, 0.1), M.matte(0x1c1f26, 0.6));
  base.position.set((Math.max(...xs) + Math.min(...xs)) / 2, 0.015, 0);
  const halos = path.filter((_, i) => i % 2 === 0).map(([x, y]) => { const s = glowSprite(color, 0.22); s.position.set(x, y, 0.01); s.material.opacity = 0; grp.add(s); return s; });
  const lamp = new THREE.PointLight(color, 0, 2.5, 2); lamp.position.set(base.position.x, 0.25, 0.15);
  for (const [x, y] of [path[0], path.at(-1)]) { const post = solid(new THREE.CylinderGeometry(0.006, 0.006, y - 0.03, 8), M.metal(0x9aa0a8, 0.3), { outline: false }); post.position.set(x, 0.03 + (y - 0.03) / 2, -0.02); grp.add(post); }   // it stands on two thin posts
  grp.add(core, sleeve, base, lamp);
  grp.userData.set = (k) => { glowM.emissiveIntensity = 4 * k; halos.forEach((s) => { s.material.opacity = 0.35 * k; }); lamp.intensity = 1.2 * k; };
  grp.userData.set(0); return grp;
}
/** an energy meter: a glass tube on a base with a glowing gold column; userData.set(k) = how full (0..1), height h */
export function energyBar(h = 1.2, r = 0.07) {
  const grp = new THREE.Group();
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 32, 1, true), M.glass()); tube.position.y = h / 2; tube.renderOrder = 5;
  const col = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.78, r * 0.78, 1, 24), M.glow(0xffb43a, 1.6)); col.position.y = 0.5;
  const colG = new THREE.Group(); colG.add(col); colG.position.y = 0.004; grp.add(tube, colG);
  const base = solid(new THREE.CylinderGeometry(r * 1.6, r * 1.8, 0.05, 32), M.matte(0x2a2f38, 0.5)); base.position.y = -0.025; grp.add(base);
  grp.userData.set = (k) => { colG.scale.y = Math.max(1e-4, k * (h - 0.01)); };
  grp.userData.set(1); grp.userData.top = (k) => k * h; return grp;
}

// ---------------------------------------------------------------- 405 set pieces: glue (Society, Technology and Science box)
/** a white ceramic plate broken into two halves (each half is a group; bottom at y 0); userData.halves = [left, right] */
export function brokenPlate(r = 0.2, h = 0.022) {
  const grp = new THREE.Group(), mat = new THREE.MeshPhysicalMaterial({ color: 0xf4f1ea, roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.2 });
  const rimM = new THREE.MeshPhysicalMaterial({ color: 0x3a6fb4, roughness: 0.35, clearcoat: 0.6 });
  const crack = [[0, 1], [0.05, 0.62], [-0.04, 0.3], [0.03, 0], [-0.05, -0.35], [0.02, -0.7], [0, -1]];   // the jagged break (fractions of r)
  const halves = [-1, 1].map((side) => {
    const sh = new THREE.Shape(); sh.moveTo(crack[0][0] * r, crack[0][1] * r);
    crack.slice(1).forEach(([x, y]) => sh.lineTo(x * r, y * r));
    sh.absarc(0, 0, r, -Math.PI / 2, Math.PI / 2, side < 0);        // the round side of this half
    const geo = new THREE.ExtrudeGeometry(sh, { depth: h, bevelEnabled: true, bevelSize: 0.003, bevelThickness: 0.003, bevelSegments: 2, curveSegments: 32 }).rotateX(-Math.PI / 2);
    const g = new THREE.Group(), body = solid(geo, mat); body.position.y = 0.003; g.add(body);
    const rim = solid(new THREE.TorusGeometry(r * 0.84, 0.004, 6, 40, Math.PI), rimM, { outline: false }); rim.rotation.set(-Math.PI / 2, 0, side < 0 ? Math.PI / 2 : -Math.PI / 2); rim.position.y = h + 0.008;
    g.add(rim); grp.add(g); return g;
  });
  grp.userData.halves = halves; return grp;
}
/** a tube of glue lying on its side with a white cap (centre at the origin, nozzle along +x); userData.squeeze(k) */
export function glueTube(len = 0.2) {
  const grp = new THREE.Group(), body = solid(new THREE.CylinderGeometry(0.026, 0.03, len, 24).rotateZ(-Math.PI / 2), M.gloss(0xe8b43a));
  const band = solid(new THREE.CylinderGeometry(0.031, 0.031, len * 0.3, 24, 1, true).rotateZ(-Math.PI / 2), M.gloss(0xc0392b), { outline: false });
  const nozzle = solid(new THREE.ConeGeometry(0.012, 0.05, 16).rotateZ(-Math.PI / 2), M.matte(0xf2f2f2, 0.5)); nozzle.position.x = len / 2 + 0.025;
  const end = solid(new THREE.BoxGeometry(0.008, 0.05, 0.04), M.metal(0xb9bec6, 0.35)); end.position.x = -len / 2 - 0.004;
  grp.add(body, band, nozzle, end);
  grp.userData.squeeze = (k) => { body.scale.set(1, 1 - 0.18 * k, 1 - 0.18 * k); band.scale.set(1, 1 - 0.18 * k, 1 - 0.18 * k); };
  grp.userData.tip = new THREE.Vector3(len / 2 + 0.05, 0, 0); return grp;
}
// Chapter 4 atoms that the kit did not have yet (carbon dark grey, boron salmon, aluminium light grey)
Object.assign(ATOM, { C: [0x4a4f58, 0.077], B: [0xe6b09c, 0.085], Al: [0xc5cbd3, 0.12] });

// ---------------------------------------------------------------- 407 set pieces: reagent bottles
/** a clear glass reagent bottle (bottom at y 0) with a liquid inside, a white paper label and a glass stopper;
 *  userData.stopper (lift it to open), userData.mouth (local point of the opening) */
export function reagentBottle(liquid = 0xdfeaf2, h = 0.26, r = 0.07, text = '') {
  const grp = new THREE.Group(), n = 0.022;
  const prof = [[0, 0], [r, 0], [r + 0.004, 0.01], [r + 0.004, h * 0.7], [r * 0.55, h * 0.86], [n + 0.004, h * 0.9], [n + 0.004, h], [n - 0.002, h], [n - 0.002, h * 0.9 + 0.004], [r * 0.55 - 0.006, h * 0.86], [r - 0.004, h * 0.7], [r - 0.004, 0.012], [0, 0.012]];
  const glass = new THREE.Mesh(new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(x, y)), 48), M.glass()); glass.renderOrder = 5;
  const liq = liquid ? (() => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r - 0.01, r - 0.01, h * 0.5, 40), M.liquid(liquid, 0.55)); m.position.y = 0.016 + h * 0.25; m.renderOrder = 4; return m; })() : null;
  const stopper = new THREE.Group(), plug = new THREE.Mesh(new THREE.CylinderGeometry(n - 0.005, n - 0.008, 0.03, 24), M.glass()); plug.position.y = -0.005;
  const knob = new THREE.Mesh(new THREE.SphereGeometry(n + 0.012, 24, 16), M.glass()); knob.scale.y = 0.6; knob.position.y = 0.022; plug.renderOrder = knob.renderOrder = 5;
  stopper.add(plug, knob); stopper.position.y = h; grp.add(glass, stopper); if (liq) grp.add(liq);
  if (text) { const lab = printBox(r * 1.3, h * 0.28, 0.004, '#f4f1e8', [text], '#2b2f38'); lab.position.set(0, h * 0.32, r + 0.006); grp.add(lab); }
  grp.userData.stopper = stopper; grp.userData.mouth = new THREE.Vector3(0, h + 0.01, 0); return grp;
}

// ---------------------------------------------------------------- 408 set pieces: a notebook that is drawn on, a pencil
/** an open ruled notebook lying on the table (top face at y ≈ 0.012). userData.draw(items, t) redraws its page:
 *  items = [{ k: 'text'|'line'|'dot'|'cross', x, y, (x1, y1), s, t0, d }] in page units (0..1 across, 0..1 down);
 *  each appears from t0 over d seconds (lines grow, text and marks pop). userData.at(u, v) = the local 3D point of a
 *  page spot; userData.pen(items, t) = where the pencil tip is (or null when it rests) */
export function notebook(w = 0.62, d = 0.44) {
  const grp = new THREE.Group(), C = document.createElement('canvas'); C.width = 1024; C.height = Math.round(1024 * d / w);
  const x = C.getContext('2d'), tex = new THREE.CanvasTexture(C); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const cover = solid(new THREE.BoxGeometry(w + 0.03, 0.006, d + 0.03), M.matte(0x2f4f7a, 0.6)); cover.position.y = 0.003;
  const pages = solid(new THREE.BoxGeometry(w, 0.006, d), M.matte(0xf2efe6, 0.9), { outline: false }); pages.position.y = 0.009;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92 })); face.rotation.x = -Math.PI / 2; face.position.y = 0.0145;
  grp.add(cover, pages, face);
  const base = () => { x.fillStyle = '#f7f4ec'; x.fillRect(0, 0, C.width, C.height); x.strokeStyle = 'rgba(80,120,200,0.28)'; x.lineWidth = 2; for (let y = 60; y < C.height; y += 46) { x.beginPath(); x.moveTo(0, y); x.lineTo(C.width, y); x.stroke(); } x.strokeStyle = 'rgba(210,80,80,0.35)'; x.beginPath(); x.moveTo(90, 0); x.lineTo(90, C.height); x.stroke(); };
  let last = '';
  grp.userData.draw = (items, t) => {
    const key = items.map((it) => Math.round(Math.min(1, Math.max(0, (t - it.t0) / (it.d || 0.3))) * 20)).join(',');
    if (key === last) return; last = key; base();
    x.strokeStyle = x.fillStyle = '#26303f'; x.lineCap = 'round'; x.textAlign = 'center'; x.textBaseline = 'middle';
    for (const it of items) {
      const u = Math.min(1, Math.max(0, (t - it.t0) / (it.d || 0.3))); if (u <= 0) continue;
      const X = it.x * C.width, Y = it.y * C.height;
      if (it.k === 'text') { x.globalAlpha = u; x.font = `600 ${it.size || 64}px "Segoe Print", "Comic Sans MS", cursive`; x.fillText(it.s, X, Y); x.globalAlpha = 1; }
      else if (it.k === 'line') { x.lineWidth = it.w || 7; x.beginPath(); x.moveTo(X, Y); x.lineTo(X + (it.x1 * C.width - X) * u, Y + (it.y1 * C.height - Y) * u); x.stroke(); }
      else if (it.k === 'dot') { x.globalAlpha = u; x.beginPath(); x.arc(X, Y, 8, 0, Math.PI * 2); x.fill(); x.globalAlpha = 1; }
      else if (it.k === 'cross') { x.globalAlpha = u; x.lineWidth = 5; x.beginPath(); x.moveTo(X - 9, Y - 9); x.lineTo(X + 9, Y + 9); x.moveTo(X + 9, Y - 9); x.lineTo(X - 9, Y + 9); x.stroke(); x.globalAlpha = 1; }
    }
    tex.needsUpdate = true;
  };
  grp.userData.at = (u, v) => new THREE.Vector3((u - 0.5) * w, 0.015, (v - 0.5) * d);
  grp.userData.pen = (items, t) => {
    const it = items.find((q) => t >= q.t0 - 0.25 && t < q.t0 + (q.d || 0.3)); if (!it) return null;
    const u = Math.min(1, Math.max(0, (t - it.t0) / (it.d || 0.3)));
    return it.k === 'line' ? grp.userData.at(it.x + (it.x1 - it.x) * u, it.y + (it.y1 - it.y) * u) : grp.userData.at(it.x + 0.01 * Math.sin(u * 12), it.y + 0.01 * Math.cos(u * 12));
  };
  base(); tex.needsUpdate = true; return grp;
}
/** a yellow hexagonal pencil, tip at the origin pointing down (−y) along its length when upright */
export function pencil(len = 0.24) {
  const grp = new THREE.Group(), body = solid(new THREE.CylinderGeometry(0.009, 0.009, len, 6), M.gloss(0xe8b43a)); body.position.y = len / 2 + 0.024;
  const wood = solid(new THREE.ConeGeometry(0.009, 0.022, 6).rotateX(Math.PI), M.matte(0xe6c79a, 0.8), { outline: false }); wood.position.y = 0.013;
  const lead = solid(new THREE.ConeGeometry(0.0032, 0.007, 8).rotateX(Math.PI), M.matte(0x2a2d33, 0.5), { outline: false }); lead.position.y = 0.0035;
  const band = solid(new THREE.CylinderGeometry(0.0118, 0.0118, 0.014, 12, 1, true), M.metal(0xc0c4ca, 0.3), { outline: false }); band.position.y = len + 0.02;
  const eraser = solid(new THREE.CylinderGeometry(0.0088, 0.0088, 0.012, 12), M.matte(0xe08a9a, 0.7)); eraser.position.y = len + 0.033;
  grp.add(body, wood, lead, band, eraser); return grp;
}
