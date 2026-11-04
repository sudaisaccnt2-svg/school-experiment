// House style (user 2026-10-11: "the style must be similar for everything"; liked the style-lab beaker + ash picture).
// One look for every lesson, applied in the player so Blender files and library models all end up alike:
//   glass  → one clear rim-lit glass (bright edges, almost clear body), the style-lab beaker
//   liquid → tinted see-through liquid of the same family
//   solids → their own colour, soft studio light + a thin dark outline (reads on small phone screens)
//   glowing things (labels, electrons, fire) stay as they are.
// Turned on per lesson while the pilot is judged (HOUSE below); later for all.
import * as THREE from 'three';

export const HOUSE = new Set(['803']);

const GLASS = /glass|vial oil|bulb glass/i;           // glass vessels, bulbs, electron shells
const LIQUID = /water body|sol\b|sol u|liquid|acid/i;
const DROPS = /droplet|ripple|bubble/i;

export function rimGlass(color, body = 0.1, edge = 1, shine = 1) {
  return new THREE.ShaderMaterial({
    uniforms: { uC: { value: new THREE.Color(color) }, uBody: { value: body }, uEdge: { value: edge }, uS: { value: shine } },
    vertexShader: `varying vec3 vN; varying vec3 vV;
      void main() { vec4 p = vec4(position, 1.0); vec3 n = normal;
      #ifdef USE_INSTANCING
        p = instanceMatrix * p; n = mat3(instanceMatrix) * n;
      #endif
        vec4 mv = modelViewMatrix * p; vN = normalize(normalMatrix * n); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uC; uniform float uBody, uEdge, uS; varying vec3 vN; varying vec3 vV;
      void main() { vec3 n = normalize(vN), v = normalize(vV); float f = pow(1.0 - abs(dot(n, v)), 3.0);
        float spec = pow(max(dot(reflect(-v, n), normalize(vec3(-0.4, 0.8, 0.5))), 0.0), 40.0) * uS;
        gl_FragColor = vec4(uC * (0.6 + uEdge * f) + vec3(spec), clamp(uBody + f * uEdge * 0.8 + spec, 0.0, 1.0)); }`,
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
  });
}

// glass in a bright photo studio (user 2026-10-13: "the lighting doesn't look good on models"): it reflects the real
// studio photo (softboxes become highlights, Fresnel: strong at the rim, faint face-on) and shows the thin darker edge
// real glass has against a white wall. env = { value: equirect HDR texture } (shared, filled when the photo loads).
export function studioGlass(env, tint = 0xdff0ff, key = new THREE.Vector3(-2.8, 3.0, -0.5), rim = new THREE.Vector3(3.5, 3.2, -4.5)) {
  // lab glass in the baked photo studio, v2 (user 2026-10-13: "doesn't look good on the eyes", v1 = smoky grey bands):
  // almost invisible body, a THIN crisp dark line only at the very silhouette with a faint bright line inside it,
  // the studio reflected at the rim (Fresnel) and two sharp softbox highlights (key + rim), like real lab glassware
  return new THREE.ShaderMaterial({
    uniforms: { uEnv: env, uT: { value: new THREE.Color(tint) }, uK: { value: key.clone().normalize() }, uR: { value: rim.clone().normalize() } },
    vertexShader: `varying vec3 vN; varying vec3 vP;
      void main() { vec4 w = modelMatrix * vec4(position, 1.0); vP = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `uniform sampler2D uEnv; uniform vec3 uT, uK, uR; varying vec3 vN; varying vec3 vP;
      vec3 envAt(vec3 d) { vec2 uv = vec2(atan(d.z, d.x) / 6.2831853 + 0.5, asin(clamp(d.y, -1.0, 1.0)) / 3.1415927 + 0.5); return texture2D(uEnv, uv).rgb; }
      void main() {
        vec3 v = normalize(cameraPosition - vP), n = normalize(vN); if (dot(n, v) < 0.0) n = -n;
        float g = 1.0 - clamp(dot(n, v), 0.0, 1.0), F = 0.04 + 0.96 * pow(g, 5.0);
        vec3 r = reflect(-v, n);
        vec3 refl = min(envAt(r), vec3(8.0)) * uT;
        float hk = dot(r, uK), hr = dot(r, uR);
        float spec = pow(max(hk, 0.0), 260.0) * 7.0 + pow(max(hk, 0.0), 40.0) * 0.25 + pow(max(hr, 0.0), 200.0) * 4.0;
        float dark = smoothstep(0.80, 0.985, g);                             // thin silhouette line (refraction goes dark)
        float lite = smoothstep(0.62, 0.78, g) * (1.0 - smoothstep(0.78, 0.86, g));   // a faint bright line just inside it
        float a = clamp(dark * 0.7 + lite * 0.12 + F * 0.55 + spec * 0.6 + 0.01, 0.0, 1.0);
        vec3 col = (vec3(0.015, 0.02, 0.03) * dark * 0.7 + vec3(0.9, 0.95, 1.0) * lite * 0.12 + refl * F * 0.55 + vec3(spec) * 0.6 + uT * 0.01) / max(a, 1e-3);
        gl_FragColor = vec4(col, a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
  });
}

// thin outline of constant screen width: the back faces pushed outwards in screen space
const INK = new THREE.ShaderMaterial({
  uniforms: { uPx: { value: 1.6 }, uRes: { value: new THREE.Vector2(1920, 1080) } },
  vertexShader: `uniform float uPx; uniform vec2 uRes;
    void main() { vec4 c = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vec3 n = normalize(normalMatrix * normal); vec2 d = normalize(n.xy + 1e-6);
      c.xy += d * uPx * 2.0 / uRes * c.w; gl_Position = c; }`,
  fragmentShader: 'void main() { gl_FragColor = vec4(0.035, 0.045, 0.07, 1.0); }',
  side: THREE.BackSide,
});
export const inkResize = (w, h, dpr) => INK.uniforms.uRes.value.set(w * dpr, h * dpr);

const emissiveColour = (m) => (m.emissive && m.emissive.getHex() ? m.emissive : m.color).clone();
const glowing = (m) => m.emissive && m.emissive.getHex() !== 0 && (m.color?.getHex?.() ?? 0) < 0x101010;

export function applyHouseStyle(root, { key, rim, fill, scene }) {
  // light: warm soft key from the upper left, cool rim from behind, gentle sky/ground fill (style-lab A)
  key.color.set(0xfff0dc); key.intensity = 2.0;
  rim.color.set(0x8fb8ff); rim.intensity = 2.2;
  fill.color.set(0x9fb6ff); fill.groundColor.set(0x1a1410); fill.intensity = 0.55;
  scene.background = new THREE.Color(0x0c0f16);
  scene.userData.envScale = 0.6; scene.environmentIntensity *= 0.6;   // softer studio reflections (env may load later)

  const cache = new Map(), inked = [];
  const swap = (m) => {
    if (!m || cache.has(m)) return cache.get(m) ?? m;
    let out = m;
    const name = m.name || '';
    if (/^Label|Electron|Orbit|Halo|Flame|Glow|Glass Edge/.test(name)) out = m;           // drawn light: unchanged
    else if (DROPS.test(name)) out = rimGlass(0xffffff, 0.22, 1.3);
    else if (GLASS.test(name) && !/^Shell/.test(name)) out = rimGlass(0xdff0ff, 0.08, 0.9);
    else if (/^Shell/.test(name)) out = rimGlass(0x9fc4ff, 0.03, 0.6, 0);                    // electron shells: faint
    else if (LIQUID.test(name)) out = new THREE.MeshStandardMaterial({ color: emissiveColour(m).multiplyScalar(1.6),
      roughness: 0.2, transparent: true, opacity: 0.5, depthWrite: false });
    out.name = name; out.userData.house = out === m ? 'keep' : 'swapped';
    cache.set(m, out); return out;
  };
  root.traverse((o) => {
    if (!o.isMesh || o.userData.hud || o.userData.billboard || o.parent?.userData.billboard) return;
    o.material = Array.isArray(o.material) ? o.material.map(swap) : swap(o.material);
    const m = [].concat(o.material)[0];
    const solid = m && !m.transparent && !m.isShaderMaterial && !glowing(m) && !/^Label/.test(m.name || '');
    if (solid && o.geometry?.attributes.normal) inked.push(o);
  });
  for (const o of inked) {
    const ink = new THREE.Mesh(o.geometry, INK);
    ink.name = o.name + ' Ink'; ink.renderOrder = -1; ink.raycast = () => {};
    ink.layers.mask = o.layers.mask; o.add(ink);
  }
}
