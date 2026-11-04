// Reusable effects for every lesson (user 2026-10-11: "fire and other effects are not recognizable").
// Films only mark WHERE an effect goes and its colour; the real effect lives here, made once, shared by all lessons:
//   Fire  a living flame: noise-shaped tongues that rise and lick, a hot white-yellow core fading to the flame's
//         colour at the edges and tips, flickering glow light, and sparks (embers) that drift up and fade.
// Cheap: one quad per flame layer (shader), one Points cloud for embers, one point light. Nothing runs while hidden.
import * as THREE from 'three';

const NOISE = /* glsl */`
  vec2 h2(vec2 p) { p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return -1.0 + 2.0 * fract(sin(p) * 43758.5453); }
  float noise(vec2 p) { vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(h2(i), f), dot(h2(i + vec2(1, 0)), f - vec2(1, 0)), u.x),
               mix(dot(h2(i + vec2(0, 1)), f - vec2(0, 1)), dot(h2(i + vec2(1, 1)), f - vec2(1, 1)), u.x), u.y); }
  float fbm(vec2 p) { float a = 0.5, s = 0.0; for (int k = 0; k < 5; k++) { s += a * noise(p); p *= 2.03; a *= 0.5; } return s; }`;

function flameMaterial(tint, core, seed, sharp) {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uTint: { value: new THREE.Color(tint) }, uCore: { value: new THREE.Color(core) },
      uSeed: { value: seed }, uSharp: { value: sharp }, uAlpha: { value: 1 } },
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: /* glsl */`
      varying vec2 vUv; uniform float uTime, uSeed, uSharp, uAlpha; uniform vec3 uTint, uCore; ${NOISE}
      void main() {
        vec2 uv = vUv; float y = uv.y, t = uTime + uSeed * 17.0;
        // tongues: noise scrolling upward, stronger toward the top (the flame licks and splits as it rises)
        float n = fbm(vec2(uv.x * 3.2 + uSeed, y * 2.6 - t * 2.2));
        float n2 = fbm(vec2(uv.x * 7.0 - uSeed, y * 5.0 - t * 3.7));
        float x = (uv.x - 0.5) * 2.0 + (n * 0.55 + n2 * 0.2) * y * 1.4;
        float w = mix(0.85, 0.0, pow(y, 0.62));                      // teardrop: wide at the base, a point at the top
        float body = 1.0 - smoothstep(w * uSharp, w, abs(x));
        float top = 1.0 - smoothstep(0.45, 1.0, y + n * 0.35);       // ragged, flickering tips
        float base = smoothstep(0.0, 0.07, y);
        float a = clamp(body * top * base, 0.0, 1.0);
        float heat = a * (1.0 - y * 0.85) * (1.0 - abs(x) * 0.7);    // hottest low and in the middle
        vec3 col = mix(uTint * 0.55, uTint, smoothstep(0.0, 0.5, a));
        col = mix(col, uCore, smoothstep(0.35, 0.85, heat));
        gl_FragColor = vec4(col * 1.6, a * uAlpha);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false,
  });
}

/** A fire of colour `tint` (any CSS / hex colour), `size` = flame height in scene units. core = hottest colour. */
export function makeFire(tint, size = 1, { core = 0xfff3c4, embers = true, light = true } = {}) {
  const g = new THREE.Group(); g.name = 'FX Fire';
  const seed = Math.random() * 10;
  const layers = [[1.0, 0.55, 0], [0.72, 0.4, 0.06], [0.5, 0.25, 0.12]].map(([k, sharp, z], i) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.95 * size * k, size * k), flameMaterial(i ? core : tint, core, seed + i * 3.1, sharp));
    m.material.uniforms.uTint.value.set(i === 2 ? core : tint);
    m.position.set(0, (size * k) / 2, z); m.renderOrder = 10 + i; g.add(m); return m;
  });
  let pts = null;
  if (embers) {                                   // sparks drifting up from the flame
    const N = 12, pos = new Float32Array(N * 3), life = new Float32Array(N).map(() => Math.random());
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: new THREE.Color(tint).lerp(new THREE.Color(core), 0.5),
      size: 0.035 * size, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
    pts.userData = { life, drift: Float32Array.from({ length: N }, () => (Math.random() - 0.5)) };
    pts.frustumCulled = false; g.add(pts);
  }
  // a soft warm glow around the flame (it lights the air around it)
  const gc = document.createElement('canvas'); gc.width = gc.height = 64; const gx = gc.getContext('2d');
  const rg = gx.createRadialGradient(32, 32, 0, 32, 32, 32); rg.addColorStop(0, 'rgba(255,255,255,0.55)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
  gx.fillStyle = rg; gx.fillRect(0, 0, 64, 64);
  const glowS = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(gc), color: new THREE.Color(tint).lerp(new THREE.Color(core), 0.3),
    transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  glowS.scale.setScalar(size * 1.6); glowS.position.y = size * 0.35; g.add(glowS);
  let lamp = null;
  if (light) { lamp = new THREE.PointLight(new THREE.Color(tint).lerp(new THREE.Color(core), 0.4), 0, size * 6, 2); lamp.position.y = size * 0.35; g.add(lamp); }
  let t = 0;
  g.userData.fx = {
    update(dt, camPos) {
      t += dt;
      for (const m of layers) m.material.uniforms.uTime.value = t;
      // the flame quads turn round their upright axis to face the viewer (a flame looks the same from all sides)
      if (camPos) { const p = g.worldToLocal(camPos.clone()); const a = Math.atan2(p.x, p.z); for (const m of layers) m.rotation.y = a; }
      if (pts) {
        const { life, drift } = pts.userData, a = pts.geometry.attributes.position.array;
        for (let i = 0; i < life.length; i++) {
          life[i] += dt * 0.7; if (life[i] > 1) life[i] -= 1;
          const u = life[i];
          a[i * 3] = drift[i] * 0.4 * size + Math.sin((u + i) * 9) * 0.05 * size;
          a[i * 3 + 1] = size * (0.25 + 1.3 * u); a[i * 3 + 2] = drift[i] * 0.2 * size;
        }
        pts.geometry.attributes.position.needsUpdate = true;
      }
      glowS.material.opacity = 0.38 + 0.07 * Math.sin(t * 11) + 0.05 * Math.sin(t * 23);
      if (lamp) lamp.intensity = size * (2.2 + 0.6 * Math.sin(t * 13) + 0.4 * Math.sin(t * 29.7));
    },
  };
  return g;
}

/** Old films drew flames as two glowing cones ("… Outer" + "… Core"/"… Inner" under one group). Swap every one of
 *  them for a real fire of the same colour. Returns the fires (each tick: fire.userData.fx.update(dt, camPos)). */
export function upgradeFlames(root) {
  const fires = [];
  const outers = [];
  root.traverse((o) => { if (o.isMesh && /_Outer$/.test(o.name) && o.parent?.children.some((c) => /_(Core|Inner)$/.test(c.name))) outers.push(o); });
  for (const o of outers) {
    const grp = o.parent, inner = grp.children.find((c) => /_(Core|Inner)$/.test(c.name));
    const mat = o.material, tint = (mat.emissive && mat.emissive.getHex() ? mat.emissive : mat.color).clone();
    if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
    const h = (o.geometry.boundingBox.max.y - o.geometry.boundingBox.min.y) * o.scale.y;
    const blueCore = inner && /_Inner$/.test(inner.name);         // a burner: blue inner cone
    const fire = makeFire(tint, h * 1.9, { core: blueCore ? 0xbfd8ff : 0xfff3c4 });
    fire.position.copy(o.position).y -= h / 2;                      // the cone's centre → the flame's base
    grp.add(fire);
    o.visible = false; if (inner) inner.visible = false;
    fires.push(fire);
  }
  return fires;
}
