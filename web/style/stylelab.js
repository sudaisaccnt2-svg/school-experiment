// Style lab (user 2026-10-11: "models, materials, lighting must be ONE art style"). The same two beats of lesson 803
// in two complete, consistent looks, rendered by the real app renderer (three.js), to choose the house style.
//   ?style=A  Soft studio: smooth clean models, one family of materials (satin metal, clear glass, tinted liquid),
//             soft key + cool rim light, soft contact shadows on a dark floor.
//   ?style=B  Illustrated: cel shading (3 tones), clean dark outlines, flat curated palette; everything drawn alike.
//   ?scene=beaker | ash      &t=<seconds> freezes time (screenshots)
import * as THREE from 'three';
import { makeFire } from '../fx.js';

const P = new URLSearchParams(location.search);
const STYLE = P.get('style') || 'A', SCENE = P.get('scene') || 'beaker', FREEZE = P.has('t') ? +P.get('t') : null;
const R = new THREE.WebGLRenderer({ antialias: true });
// (exposure a touch lower: ash and glass keep their greys under the key light)
 R.setPixelRatio(Math.min(devicePixelRatio, 2));
R.setSize(innerWidth, innerHeight); R.toneMapping = THREE.AgXToneMapping; R.toneMappingExposure = 0.85; R.outputColorSpace = THREE.SRGBColorSpace;
R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap; document.body.appendChild(R.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color(STYLE === 'A' ? 0x0c0f16 : 0x1a2130);
const cam = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, 0.05, 100);
scene.fog = new THREE.Fog(scene.background, 6, 13);       // the floor melts into the dark: no horizon line
const TIME = { t: 0 };

// ---------------------------------------------------------------- one look: lights + materials per style
const look = STYLE === 'A' ? styleA() : styleB();
function styleA() {
  scene.add(new THREE.HemisphereLight(0x9fb6ff, 0x1a1410, 0.55));
  const key = new THREE.DirectionalLight(0xfff0dc, 2.0); key.position.set(-3, 6, 4); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 6; key.shadow.camera.left = key.shadow.camera.bottom = -4;
  key.shadow.camera.right = key.shadow.camera.top = 4; key.shadow.bias = -0.0005; scene.add(key);
  const rim = new THREE.DirectionalLight(0x8fb8ff, 2.2); rim.position.set(3, 3, -5); scene.add(rim);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ color: 0x1a1f2b, roughness: 0.8 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  new THREE.TextureLoader();
  return {
    glass: () => rimGlass(0xdff0ff, 0.10, 0.9),
    liquid: (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.2, transparent: true, opacity: 0.55, depthWrite: false }),
    bubble: () => rimGlass(0xffffff, 0.25, 1.4),
    metal: (c) => new THREE.MeshStandardMaterial({ color: c, metalness: 0.9, roughness: 0.32 }),
    matte: (c, r = 0.75) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: 0 }),
    vcol: (r = 0.95) => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: r }),
    glow: (c, k = 2) => new THREE.MeshStandardMaterial({ color: 0x000000, emissive: c, emissiveIntensity: k }),
    outline: () => null,
  };
}
function styleB() {
  const ramp = new THREE.DataTexture(new Uint8Array([70, 70, 70, 255, 160, 160, 160, 255, 255, 255, 255, 255]), 3, 1, THREE.RGBAFormat);
  ramp.minFilter = ramp.magFilter = THREE.NearestFilter; ramp.needsUpdate = true;
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(-3, 6, 4); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = key.shadow.camera.bottom = -4; key.shadow.camera.right = key.shadow.camera.top = 4; scene.add(key);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshToonMaterial({ color: 0x2a3448, gradientMap: ramp }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const toon = (c, extra = {}) => new THREE.MeshToonMaterial({ color: c, gradientMap: ramp, ...extra });
  return {
    glass: () => rimGlass(0xcfeaff, 0.08, 1.2),
    liquid: (c) => toon(c, { transparent: true, opacity: 0.7, depthWrite: false }),
    bubble: () => toon(0xf4fbff),
    metal: (c) => toon(c),
    matte: (c) => toon(c),
    vcol: () => new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: ramp }),
    glow: (c, k = 2) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k * 0.8) }),
    outline: (w = 0.02) => new THREE.MeshBasicMaterial({ color: 0x0b0e14, side: THREE.BackSide }),
    outlineW: 0.018,
  };
}
// one glass family for everything glassy (beakers, jars, bubbles): mostly clear, with bright edges where the
// surface turns away (fresnel). Cheap on phones: no transmission pass.
function rimGlass(color, body = 0.1, edge = 1) {
  return new THREE.ShaderMaterial({
    uniforms: { uC: { value: new THREE.Color(color) }, uBody: { value: body }, uEdge: { value: edge } },
    vertexShader: `varying vec3 vN; varying vec3 vV;
      void main() { vec4 p = vec4(position, 1.0); vec3 n = normal;
      #ifdef USE_INSTANCING
        p = instanceMatrix * p; n = mat3(instanceMatrix) * n;
      #endif
        vec4 mv = modelViewMatrix * p; vN = normalize(normalMatrix * n); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: 'uniform vec3 uC; uniform float uBody, uEdge; varying vec3 vN; varying vec3 vV; void main() { float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 3.0); float spec = pow(max(dot(reflect(-normalize(vV), normalize(vN)), normalize(vec3(-0.4, 0.8, 0.5))), 0.0), 40.0); gl_FragColor = vec4(uC * (0.6 + uEdge * f) + vec3(spec), clamp(uBody + f * uEdge * 0.8 + spec, 0.0, 1.0)); }',
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
  });
}
// inked outline (style B): a slightly fattened copy drawn inside out, behind the object
function ink(mesh, w) {
  const m = look.outline(); if (!m) return mesh;
  const o = new THREE.Mesh(mesh.geometry, m); o.scale.setScalar(1 + (w ?? look.outlineW) / Math.max(0.05, mesh.geometry.boundingSphere?.radius || (mesh.geometry.computeBoundingSphere(), mesh.geometry.boundingSphere.radius)));
  mesh.add(o); return mesh;
}
const add = (m, cast = true) => { m.castShadow = cast; m.receiveShadow = true; scene.add(m); return m; };

// ---------------------------------------------------------------- small noise for organic shapes
function hash(x, y, z) { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); }
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi;
  const s = (t) => t * t * (3 - 2 * t), u = s(xf), v = s(yf), w = s(zf);
  const L = (a, b, t) => a + (b - a) * t;
  const c = (dx, dy, dz) => hash(xi + dx, yi + dy, zi + dz);
  return L(L(L(c(0, 0, 0), c(1, 0, 0), u), L(c(0, 1, 0), c(1, 1, 0), u), v), L(L(c(0, 0, 1), c(1, 0, 1), u), L(c(0, 1, 1), c(1, 1, 1), u), v), w);
}
const fbm = (x, y, z) => { let a = 0.5, s = 0; for (let k = 0; k < 4; k++) { s += a * vnoise(x, y, z); x *= 2.1; y *= 2.1; z *= 2.1; a *= 0.5; } return s; };

// ---------------------------------------------------------------- scene 1: zinc dissolves in acid (bubbles)
function beakerScene() {
  cam.position.set(0, 1.45, 4.6); cam.lookAt(0, 0.75, 0);
  // beaker: one clean lathe (thick lip, rounded base), no printed labels
  const prof = [[0, 0], [0.62, 0], [0.66, 0.03], [0.66, 1.55], [0.7, 1.6], [0.72, 1.62], [0.69, 1.62], [0.63, 1.56], [0.63, 0.05], [0, 0.05]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  const glass = add(new THREE.Mesh(new THREE.LatheGeometry(prof, 64), look.glass()), false);

  const liq = add(new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.95, 64), look.liquid(0xb9e6d5)), false);
  liq.position.y = 0.05 + 0.475;
  const surf = add(new THREE.Mesh(new THREE.CircleGeometry(0.62, 64), look.liquid(0xd6f4ea)), false);
  surf.rotation.x = -Math.PI / 2; surf.position.y = 1.0;
  // zinc granule: a rounded irregular chunk, satin metal
  const zg = new THREE.IcosahedronGeometry(0.17, 3); const p = zg.attributes.position;
  for (let i = 0; i < p.count; i++) { const v = new THREE.Vector3().fromBufferAttribute(p, i); v.multiplyScalar(0.8 + 0.4 * fbm(v.x * 6, v.y * 6, v.z * 6)); v.y *= 0.7; p.setXYZ(i, v.x, v.y, v.z); }
  zg.computeVertexNormals();
  const zn = add(ink(new THREE.Mesh(zg, look.metal(0xa9b3bf)), 0.01)); zn.position.set(0.08, 0.17, 0);
  // bubbles: born on the zinc, grow as they rise, wobble, burst at the surface
  const N = 34, bub = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 16, 10), look.bubble(), N);
  bub.frustumCulled = false; scene.add(bub);
  const B = Array.from({ length: N }, (_, i) => ({ t0: Math.random() * 3, x: (Math.random() - 0.5) * 0.25, z: (Math.random() - 0.5) * 0.2, r: 0.012 + Math.random() * 0.02, s: 0.7 + Math.random() * 0.6 }));
  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), V = new THREE.Vector3(), S = new THREE.Vector3();
  // tiny surface pops (a ring that spreads where a bubble bursts)
  const pops = Array.from({ length: 8 }, () => { const r = add(new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 32), look.bubble()), false); r.rotation.x = -Math.PI / 2; r.visible = false; return r; });
  return (t) => {
    B.forEach((b, i) => {
      const u = ((t * b.s * 0.45 + b.t0) % 1.6) / 1.6;                 // 0 at the zinc → 1 at the surface
      const y = 0.22 + u * 0.78, r = b.r * (0.6 + u * 0.9);
      V.set(0.08 + b.x * (0.4 + u) + Math.sin(t * 6 + i) * 0.01 * u, y, b.z * (0.4 + u)); S.setScalar(u > 0.985 ? 0.0001 : r);
      M4.compose(V, Q, S); bub.setMatrixAt(i, M4);
    });
    bub.instanceMatrix.needsUpdate = true;
    pops.forEach((r, k) => { const u = (t * 1.3 + k / pops.length) % 1; r.visible = u < 0.35; r.position.set(0.08 + Math.sin(k * 7) * 0.12, 1.005, Math.cos(k * 5) * 0.1); r.scale.setScalar(0.01 + u * 0.12); });
    zn.scale.setScalar(1 - 0.12 * Math.min(1, t / 6));                    // the zinc slowly dissolves
  };
}

// ---------------------------------------------------------------- scene 2: plant ashes (recognizable ash)
function ashScene() {
  cam.position.set(0, 1.5, 4.2); cam.lookAt(0, 0.35, 0);
  const dish = add(new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [1.25, 0], [1.42, 0.16], [1.36, 0.2], [1.12, 0.07], [0, 0.07]].map(([x, y]) => new THREE.Vector2(x, y)), 64), look.matte(0x55504a, 0.9)));
  ink(dish, 0.012);
  // ash heap: a soft powdery mound, speckled grey-white, with a few dark charcoal flecks
  const hg = new THREE.SphereGeometry(1, 96, 48, 0, Math.PI * 2, 0, Math.PI / 2); const p = hg.attributes.position, col = [];
  const c1 = new THREE.Color(0x77736c), c2 = new THREE.Color(0x4a4641), c3 = new THREE.Color(0x191715);   // dull warm greys, sooty flecks
  for (let i = 0; i < p.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(p, i);
    const n = fbm(v.x * 3 + 4, v.y * 3, v.z * 3), fine = vnoise(v.x * 30, v.y * 30, v.z * 30);
    const k = 0.85 + 0.3 * n + 0.05 * fine; v.x *= 1.05 * k; v.z *= 0.95 * k; v.y = Math.pow(Math.max(0, v.y), 1.6) * 0.38 * k + 0.012 * fine;
    p.setXYZ(i, v.x, v.y + 0.07 + 0.01 * vnoise(v.x * 60, v.y * 60, v.z * 60), v.z);   // fine powder grain
    const c = c1.clone().lerp(c2, Math.min(1, n * 1.1 + fine * 0.25)); if (fine > 0.86) c.lerp(c3, 0.8); col.push(c.r, c.g, c.b);
  }
  hg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); hg.computeVertexNormals();
  add(ink(new THREE.Mesh(hg, look.vcol()), 0.012));
  // burnt sticks lying in the ash: black, cracked into blocks, orange glowing in the cracks (the fire's leftovers)
  const cracks = crackTexture();
  const stick = (len, r, x, y, z, ry, rz, glowK) => {
    const g = new THREE.CylinderGeometry(r * 0.8, r, len, 9, 10); const q = g.attributes.position;
    for (let j = 0; j < q.count; j++) { const v = new THREE.Vector3().fromBufferAttribute(q, j); const k = 0.85 + 0.3 * fbm(v.x * 20, v.y * 8, v.z * 20); q.setXYZ(j, v.x * k, v.y, v.z * k); }
    g.computeVertexNormals();
    const m = new THREE.MeshStandardMaterial({ color: 0x0d0b0a, roughness: 0.95, emissive: 0xff4a10, emissiveMap: cracks, emissiveIntensity: glowK });
    const hh = 0.07 + 0.38 * Math.pow(Math.max(0, 1 - (x * x + z * z) / 1.1), 1.6);   // lying ON the ash
    const o = add(ink(new THREE.Mesh(g, m), 0.006)); o.position.set(x, hh + r * 0.35, z); o.rotation.set(Math.PI / 2, ry, rz); o.userData.glowK = glowK; return o;
  };
  const sticks = [stick(0.9, 0.07, -0.25, 0.3, 0.05, 0.4, 0.25, 1.6), stick(0.7, 0.06, 0.35, 0.27, -0.1, -0.9, -0.2, 1.2),
    stick(0.6, 0.05, 0.05, 0.36, 0.3, 1.9, 0.1, 0.0), stick(0.45, 0.045, -0.55, 0.16, -0.35, 2.6, 0.3, 0.6)];
  // glowing embers deep in the ash, breathing
  const em = Array.from({ length: 7 }, (_, i) => { const m = add(new THREE.Mesh(new THREE.SphereGeometry(0.012 + 0.01 * hash(i, 2, 3), 6, 4), look.glow(0xff6a1f, 2.5)), false);
    const a = i * 2.4, r = 0.25 + 0.4 * hash(i, 1, 1); m.position.set(Math.cos(a) * r, 0.18 + 0.3 * (1 - r), Math.sin(a) * r * 0.8); return m; });
  // the last small flame and a wisp of smoke
  const fire = makeFire(0xff7a22, 0.55, { light: STYLE === 'A' }); fire.position.set(0.12, 0.42, 0.15); scene.add(fire);
  const smoke = Array.from({ length: 10 }, (_, i) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: puff(), color: 0x9a9690, transparent: true, depthWrite: false, opacity: 0 })); scene.add(s); return s; });
  return (t) => {
    em.forEach((m, i) => { m.material.emissiveIntensity = 1.6 + 1.2 * Math.sin(t * 2.2 + i * 1.7); });
    sticks.forEach((o, i) => { o.material.emissiveIntensity = o.userData.glowK * (0.75 + 0.25 * Math.sin(t * 1.7 + i * 2.1)); });   // embers breathe
    fire.userData.fx.update(1 / 60, cam.position);
    smoke.forEach((s, i) => { const u = ((t * 0.25 + i / smoke.length) % 1); s.position.set(0.12 + Math.sin(u * 5 + i) * 0.15 * u, 0.8 + u * 2.2, 0.15); s.scale.setScalar(0.25 + u * 1.1); s.material.opacity = 0.32 * Math.sin(Math.PI * u); });
  };
}
// glowing cracks on charcoal: orange veins on black (only the veins glow)
function crackTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256; const x = c.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(0, 0, 256, 256); x.strokeStyle = '#ffffff'; x.lineCap = 'round';
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let k = 0; k < 18; k++) {              // crack lines across and along the stick (wood breaks into blocks)
    let px = rnd() * 256, py = rnd() * 256; x.lineWidth = 1 + rnd() * 2.5; x.beginPath(); x.moveTo(px, py);
    const across = k % 2; for (let s = 0; s < 6; s++) { px += across ? 40 + rnd() * 10 : rnd() * 10 - 5; py += across ? rnd() * 10 - 5 : 40 + rnd() * 10; x.lineTo(px, py); }
    x.shadowColor = '#fff'; x.shadowBlur = 6; x.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
function puff() {
  const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c);
}

// ---------------------------------------------------------------- run
new (await import('three/addons/loaders/RGBELoader.js')).RGBELoader().load('../env.hdr', (tx) => {
  tx.mapping = THREE.EquirectangularReflectionMapping; scene.environment = tx; scene.environmentIntensity = STYLE === 'A' ? 0.7 : 0.2;
});
const step = SCENE === 'ash' ? ashScene() : beakerScene();
const clock = new THREE.Clock();
R.setAnimationLoop(() => { TIME.t = FREEZE ?? clock.getElapsedTime(); step(TIME.t); R.render(scene, cam); });
addEventListener('resize', () => { R.setSize(innerWidth, innerHeight); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); });
setTimeout(() => { document.title = 'READY'; }, 2500);
