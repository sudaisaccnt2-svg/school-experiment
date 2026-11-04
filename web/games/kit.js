// Shared kit for the games: 3D stage (studio + glowing pedestal), materials, glow sprites, tweens, confetti, sounds,
// tap picking and screen-space tags. Offline: three.js only, no assets except env.hdr (shared with the films).
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
export { THREE };

export const $ = (id) => document.getElementById(id);
export const params = new URLSearchParams(location.search);
export const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

// ---------------------------------------------------------------- tweens (promise based)
let tweens = [];
export const ease = {
  inOut: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  out: (t) => 1 - Math.pow(1 - t, 3),
  back: (t) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2),
  lin: (t) => t,
};
export function tween(dur, fn, e = ease.inOut) {
  return new Promise((res) => tweens.push({ t: 0, dur: Math.max(dur, 1e-3), fn, e, res }));
}
export const sleep = (s) => tween(s, () => {});
function stepTweens(dt) {
  if (!tweens.length) return;
  const live = [];
  for (const tw of tweens) {
    tw.t = Math.min(tw.t + dt, tw.dur);
    tw.fn(tw.e(tw.t / tw.dur));
    if (tw.t >= tw.dur) tw.res(); else live.push(tw);
  }
  tweens = live;
}
/** Move an object to `to` (Vector3) along a little arc. */
export function flyTo(obj, to, dur = 0.45, lift = 0.8) {
  const from = obj.position.clone(), mid = from.clone().lerp(to, 0.5);
  mid.z += lift;
  const id = (obj.userData._fly = (obj.userData._fly || 0) + 1);      // a newer flight cancels this one
  return tween(dur, (t) => {
    if (obj.userData._fly !== id) return;
    const a = from.clone().lerp(mid, t), b = mid.clone().lerp(to, t);
    obj.position.copy(a.lerp(b, t));
  }, ease.out);
}
export function popIn(obj, s = 1, dur = 0.35) { obj.scale.setScalar(0.001); return tween(dur, (t) => obj.scale.setScalar(Math.max(0.001, s * t)), ease.back); }
export function popOut(obj, dur = 0.25) { const s = obj.scale.x; return tween(dur, (t) => obj.scale.setScalar(Math.max(0.001, s * (1 - t))), ease.inOut); }
export function shakeEl(e) { e.classList.remove('shake'); void e.offsetWidth; e.classList.add('shake'); }

// ---------------------------------------------------------------- sounds (synthesised, so they work offline)
let ac = null;
let muted = localStorage.getItem('games.mute') === '1';
function tone(f, dur, type = 'sine', vol = 0.12, when = 0, f2 = 0) {
  if (muted) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const t0 = ac.currentTime + when, o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t0);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(ac.destination); o.start(t0); o.stop(t0 + dur + 0.02);
  } catch (e) { /* no audio: silent */ }
}
export const sfx = {
  pop: () => tone(720, 0.09, 'triangle', 0.1, 0, 980),
  add: () => tone(520, 0.12, 'sine', 0.1, 0, 780),
  remove: () => tone(600, 0.14, 'sine', 0.08, 0, 300),
  ding: () => { tone(880, 0.18, 'sine', 0.1); tone(1320, 0.3, 'sine', 0.08, 0.08); },
  win: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.28, 'triangle', 0.1, i * 0.08)),
  buzz: () => { tone(180, 0.18, 'square', 0.05); tone(140, 0.25, 'square', 0.05, 0.12); },
  boing: () => tone(260, 0.35, 'sine', 0.12, 0, 620),
  /** right answer in a streak: the ding climbs a little with every answer in a row (arcade.js) */
  combo: (n = 0) => { const f = 880 * Math.pow(2, Math.min(n, 12) / 12); tone(f, 0.16, 'sine', 0.1); tone(f * 1.5, 0.26, 'sine', 0.07, 0.07); },
  levelUp: () => [523, 784, 1047, 1568].forEach((f, i) => tone(f, 0.22, 'triangle', 0.09, i * 0.06)),
  get muted() { return muted; },
  toggle() { muted = !muted; localStorage.setItem('games.mute', muted ? '1' : '0'); return muted; },
};

// ---------------------------------------------------------------- glow texture + materials
let glowTex = null;
export function glowTexture() {
  if (glowTex) return glowTex;
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.25, 'rgba(255,255,255,0.45)');
  r.addColorStop(0.6, 'rgba(255,255,255,0.08)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 64, 64);
  glowTex = new THREE.CanvasTexture(c); glowTex.colorSpace = THREE.SRGBColorSpace;
  return glowTex;
}
export function glow(color, size = 1, opacity = 0.9) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color, transparent: true, opacity,
    blending: THREE.AdditiveBlending, depthWrite: false }));
  s.scale.setScalar(size);
  return s;
}
export const COLORS = { proton: 0xe8483f, neutron: 0xb8bfca, electron: 0x4aa8ff, gold: 0xffb347, green: 0x4dff88,
  red: 0xff4d4d, s: 0x4f9eff, p: 0x4dff8c, d: 0xff9e40, f: 0xc773ff };
export const M = {
  proton: new THREE.MeshPhysicalMaterial({ color: COLORS.proton, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.12, emissive: 0x2a0402 }),
  neutron: new THREE.MeshPhysicalMaterial({ color: COLORS.neutron, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.12, emissive: 0x08090b }),
  electron: new THREE.MeshStandardMaterial({ color: 0xbfe3ff, emissive: COLORS.electron, emissiveIntensity: 2.0, roughness: 0.3 }),
  ring: new THREE.MeshBasicMaterial({ color: 0x5c9dff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }),
  seat: new THREE.MeshBasicMaterial({ color: 0x9fc6ff, transparent: true, opacity: 0.14, depthWrite: false }),
  hit: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }),
  gold: new THREE.MeshPhysicalMaterial({ color: 0xffc061, metalness: 1, roughness: 0.25, emissive: 0x3a2200 }),
  glass: new THREE.MeshPhysicalMaterial({ color: 0x9cc8ff, roughness: 0.05, transmission: 0, transparent: true, opacity: 0.16, depthWrite: false }),
};
export function emissive(color, k = 1.6) {
  return new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: k, roughness: 0.4 });
}
export function ringMat(color, opacity = 0.6) {
  return new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });
}
const SPH = new THREE.SphereGeometry(1, 32, 16);
export function ball(mat, r) { const m = new THREE.Mesh(SPH, mat); m.scale.setScalar(r); return m; }
export function ring(r, mat = M.ring, tube = 0.02) {
  const m = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 8, Math.max(64, Math.round(r * 60))), mat);
  return m;
}

// ---------------------------------------------------------------- stage
export function createStage(host) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.toneMappingExposure = 1.15;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 200);
  camera.position.set(0, 1.0, 18);
  const controls = new OrbitControls(camera, renderer.domElement);
  // one finger turns the view, two fingers pinch to zoom and slide to pan (mouse: left turns, right pans, wheel zooms)
  Object.assign(controls, { enableDamping: true, enablePan: true, screenSpacePanning: true, panSpeed: 0.8, minDistance: 4, maxDistance: 32,
    minPolarAngle: 0.6, maxPolarAngle: 2.2, minAzimuthAngle: -1.4, maxAzimuthAngle: 1.4, rotateSpeed: 0.6 });
  controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
  controls.zoomToCursor = true;                // wheel / pinch zooms toward the pointer or the fingers, not the middle
  const PAN = new THREE.Box3(new THREE.Vector3(-5, -4, -4), new THREE.Vector3(5, 5, 4));   // the model can't be slid away
  controls.target.set(0, 0.2, 0);

  const key = new THREE.DirectionalLight(0xffe9d2, 2.4); key.position.set(5, 8, 10); scene.add(key);
  const rim = new THREE.DirectionalLight(0xa8c4ff, 1.4); rim.position.set(-8, 3, -6); scene.add(rim);
  scene.add(new THREE.HemisphereLight(0x9fb4ff, 0x30221a, 0.5));
  new RGBELoader().load('env.hdr', (tex) => {
    tex.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = tex; scene.environmentIntensity = 0.55;
  }, undefined, () => {});

  // pedestal: a dark disc with a glowing rim and a faint light beam (hologram projector)
  const ped = new THREE.Group(); ped.position.y = -5.4; scene.add(ped);
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 5.0, 0.45, 72),
    new THREE.MeshPhysicalMaterial({ color: 0x0d1118, metalness: 0.7, roughness: 0.3, clearcoat: 1 }));
  ped.add(disc);
  const prim = ring(4.6, ringMat(0x4aa8ff, 0.8), 0.035); prim.rotation.x = Math.PI / 2; prim.position.y = 0.23; ped.add(prim);
  const c = document.createElement('canvas'); c.width = 4; c.height = 64;
  const g = c.getContext('2d'), lg = g.createLinearGradient(0, 0, 0, 64);
  lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(1, 'rgba(255,255,255,1)');
  g.fillStyle = lg; g.fillRect(0, 0, 4, 64);
  const beamTex = new THREE.CanvasTexture(c);
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(5.6, 4.5, 10, 64, 1, true),
    new THREE.MeshBasicMaterial({ color: 0x3a7dff, map: beamTex, transparent: true, opacity: 0.07, side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending, depthWrite: false }));
  beam.position.y = 5.2; ped.add(beam);
  // floating dust
  const N = 260, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 40; pos[i * 3 + 1] = (Math.random() - 0.5) * 22; pos[i * 3 + 2] = (Math.random() - 0.5) * 24 - 6; }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: 0x7fa8ff, size: 0.06, transparent: true, opacity: 0.45, depthWrite: false }));
  scene.add(dust);

  const root = new THREE.Group(); scene.add(root);
  const tagLayer = el('div', 'tags'); host.appendChild(tagLayer);
  const tags = [];
  const frameFns = [];
  const pickables = [];
  let onTap = null, onHold = null;

  function resize() {
    const w = host.clientWidth || innerWidth, h = host.clientHeight || innerHeight;
    renderer.setSize(w, h, false); renderer.domElement.style.width = w + 'px'; renderer.domElement.style.height = h + 'px';
    camera.aspect = w / h;
    camera.position.setLength(w / h < 1.2 ? 24 : 18);      // portrait iPad: step back
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize); resize();

  // taps (short, still presses) pick objects; drags orbit the view
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let down = null, holdTimer = null;
  function pick(ev) {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(pickables, true), found = [];
    for (const h of hits) {                 // climb to the registered object
      let o = h.object;
      while (o && !pickables.includes(o)) o = o.parent;
      if (o && o.visible !== false) found.push({ obj: o, point: h.point });
    }
    // small things you aim at (userData.pickFirst, e.g. an electron) win over big invisible tap areas around them
    return found.find((f) => f.obj.userData.pickFirst) || found[0] || null;
  }
  renderer.domElement.addEventListener('pointerdown', (ev) => {
    down = { x: ev.clientX, y: ev.clientY, t: performance.now() };
    clearInterval(holdTimer);
    const hit = onHold && pick(ev);
    if (hit) {
      let n = 0;
      holdTimer = setInterval(() => { if (down && ++n > 3) onHold(hit); }, 110);
    }
  });
  renderer.domElement.addEventListener('pointerup', (ev) => {
    clearInterval(holdTimer);
    if (!down) return;
    const moved = Math.hypot(ev.clientX - down.x, ev.clientY - down.y), dt = performance.now() - down.t;
    down = null;
    if (moved < 10 && dt < 600 && onTap) { const hit = pick(ev); onTap(hit, ev); }
  });
  renderer.domElement.addEventListener('pointercancel', () => { clearInterval(holdTimer); down = null; });
  renderer.domElement.addEventListener('pointermove', (ev) => {
    if (down && Math.hypot(ev.clientX - down.x, ev.clientY - down.y) > 10) clearInterval(holdTimer);
  });

  const v = new THREE.Vector3();
  function placeTags() {
    const w = renderer.domElement.clientWidth, h = renderer.domElement.clientHeight;
    for (const t of tags) {
      t.obj.getWorldPosition(v); v.add(t.off); v.project(camera);
      const vis = v.z < 1 && t.obj.visible !== false && t.obj.scale.x > 0.05;
      t.el.style.opacity = vis ? '' : '0';
      t.el.style.transform = `translate(${(v.x * 0.5 + 0.5) * w}px, ${(-v.y * 0.5 + 0.5) * h}px) translate(-50%, -50%)`;
    }
  }

  const clock = new THREE.Clock();
  let alive = true;
  function loop() {
    if (!alive) return;
    requestAnimationFrame(loop);
    if (document.hidden) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    stepTweens(dt);
    for (const f of frameFns) f(dt, clock.elapsedTime);
    dust.rotation.y += dt * 0.01;
    prim.material.opacity = 0.6 + 0.2 * Math.sin(clock.elapsedTime * 2);
    if (!PAN.containsPoint(controls.target)) { const c = PAN.clampPoint(controls.target, v.clone()); camera.position.add(c.clone().sub(controls.target)); controls.target.copy(c); }
    controls.update();
    renderer.render(scene, camera);
    placeTags();
  }
  loop();

  return {
    THREE, renderer, scene, camera, controls, root, pedestal: ped,
    onFrame: (f) => frameFns.push(f),
    offFrame: (f) => { const i = frameFns.indexOf(f); if (i >= 0) frameFns.splice(i, 1); },
    pickable: (o) => { pickables.push(o); return o; },
    unpickable: (o) => { const i = pickables.indexOf(o); if (i >= 0) pickables.splice(i, 1); },
    set onTap(f) { onTap = f; }, get onTap() { return onTap; }, set onHold(f) { onHold = f; },
    tag(html, obj, off = [0, 0, 0], cls = '') {
      const e = el('div', 'tag ' + cls, html); tagLayer.appendChild(e);
      const t = { el: e, obj, off: new THREE.Vector3(...off) }; tags.push(t); return e;
    },
    untag(e) { const i = tags.findIndex((t) => t.el === e); if (i >= 0) { tags.splice(i, 1); e.remove(); } },
    clearTags() { tags.splice(0).forEach((t) => t.el.remove()); },
    /** World point → CSS pixels (for flying DOM effects). */
    toScreen(p) { const q = p.clone().project(camera); return [(q.x * 0.5 + 0.5) * renderer.domElement.clientWidth, (-q.y * 0.5 + 0.5) * renderer.domElement.clientHeight]; },
    /** CSS pixels → world point on the z = 0 plane (spawn particles where a button was pressed). */
    fromScreen(x, y, z = 0) {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const t = (z - ray.ray.origin.z) / ray.ray.direction.z;
      return ray.ray.origin.clone().addScaledVector(ray.ray.direction, t);
    },
    clearRoot() { pickables.length = 0; root.clear(); },
    stop() { alive = false; },
  };
}

// ---------------------------------------------------------------- confetti
export function confetti(stage, at = new THREE.Vector3(0, 0, 0), n = 90, span = 2.2) {
  const cols = [0xffb347, 0x4dff88, 0x4aa8ff, 0xff6b6b, 0xc773ff, 0xffffff].map((c) => new THREE.Color(c));
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), vel = [];
  for (let i = 0; i < n; i++) {
    pos.set([at.x, at.y, at.z], i * 3);
    const c = cols[i % cols.length]; col.set([c.r, c.g, c.b], i * 3);
    const d = new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.9 + 0.2, Math.random() - 0.5).normalize();
    vel.push(d.multiplyScalar(5 + Math.random() * 7));
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const m = new THREE.PointsMaterial({ size: 0.22, vertexColors: true, transparent: true, depthWrite: false });
  const pts = new THREE.Points(g, m); stage.scene.add(pts);
  let life = 0;
  const f = (dt) => {
    life += dt;
    for (let i = 0; i < n; i++) {
      vel[i].y -= 9 * dt; vel[i].multiplyScalar(0.985);
      pos[i * 3] += vel[i].x * dt; pos[i * 3 + 1] += vel[i].y * dt; pos[i * 3 + 2] += vel[i].z * dt;
    }
    g.attributes.position.needsUpdate = true;
    m.opacity = Math.max(0, 1 - life / span);
    if (life > span) { stage.offFrame(f); stage.scene.remove(pts); g.dispose(); m.dispose(); }
  };
  stage.onFrame(f);
}

// ---------------------------------------------------------------- progress (stars per level, saved on the iPad)
export const progress = {
  get(game) { try { return JSON.parse(localStorage.getItem('games.' + game)) || {}; } catch (e) { return {}; } },
  set(game, key, stars) {
    const p = progress.get(game); p[key] = Math.max(p[key] || 0, stars);
    localStorage.setItem('games.' + game, JSON.stringify(p));
  },
};
export const starStr = (n, of = 3) => '★'.repeat(n) + '☆'.repeat(Math.max(0, of - n));

/** Stacked nuclide symbol in HTML: mass number over atomic number, left of the element symbol. */
export const nuc = (sym, A, Z) => `<span class="nuc"><span class="az"><sup>${A}</sup><sub>${Z}</sub></span>${sym}</span>`;

/** Panel on the left (landscape): shift the model and its pedestal right; portrait: model up. */
export function sideLayout(stage, dx = 3.4) {
  const wide = innerWidth / innerHeight > 1.15;
  stage.root.position.set(wide ? dx : 0, wide ? 0 : 1.5, 0);
  stage.pedestal.position.x = stage.root.position.x;
}

// ---------------------------------------------------------------- goal board in the 3D scene
/** A glowing sign standing in the scene's background (a canvas texture on a plane). draw(lines) with lines like
 *  { text, size, color, bold, tick: true|false, swatch: css, dots: ['ok'|'no'|'on'|''], gap } (sizes in px at 1080p). */
export function board(stage, { w = 5.4, h = 3.4 } = {}) {
  const PX = 170, c = document.createElement('canvas'); c.width = Math.round(w * PX); c.height = Math.round(h * PX);
  const ctx = c.getContext('2d'), tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const geo = new THREE.PlaneGeometry(w, h); geo.translate(0, -h / 2, 0);   // position = top edge
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true,
    depthWrite: false, toneMapped: false }));
  mesh.renderOrder = -1; stage.root.add(mesh);
  const W = c.width, H = c.height, F = 'Inter, "Segoe UI", system-ui, sans-serif';
  function wrap(text, maxW) {
    const words = text.split(' '), out = []; let line = '';
    for (const wd of words) { const tst = line ? line + ' ' + wd : wd; if (ctx.measureText(tst).width > maxW && line) { out.push(line); line = wd; } else line = tst; }
    if (line) out.push(line); return out;
  }
  function draw(lines) {
    const used = Math.min(H, layout(lines, false) + 34);          // measure first, then paint just that tall
    ctx.clearRect(0, 0, W, H);
    const r = 36, Hc = used;
    ctx.beginPath(); ctx.roundRect(6, 6, W - 12, Hc - 12, r);
    const gr = ctx.createLinearGradient(0, 0, 0, Hc); gr.addColorStop(0, 'rgba(16,24,42,0.78)'); gr.addColorStop(1, 'rgba(8,12,22,0.62)');
    ctx.fillStyle = gr; ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(255,190,90,0.55)'; ctx.shadowColor = 'rgba(255,170,60,0.7)'; ctx.shadowBlur = 18; ctx.stroke();
    ctx.shadowBlur = 0;
    layout(lines, true);
    tex.repeat.set(1, used / H); tex.offset.set(0, 1 - used / H);
    mesh.scale.y = used / H;
    tex.needsUpdate = true;
  }
  function layout(lines, paint) {
    let y = 40;
    const X = 48, maxW = W - 2 * X;
    for (const L of lines) {
      const s = (L.size || 34) * 2.3;
      y += L.gap || 0;
      if (L.dots) {
        const d = s * 0.55; let x = X;
        L.dots.forEach((k, i) => {
          if (L.breaks && L.breaks.includes(i)) x += d * 0.8;
          if (paint) { ctx.beginPath(); ctx.roundRect(x, y + 6, d, d, 6);
          ctx.fillStyle = k === 'ok' ? '#4dff88' : k === 'no' ? '#ff5a4e' : k === 'p3' ? '#ffb347' : k === 'p2' ? '#c9a35a' : k === 'p1' ? '#8a7550' : 'rgba(255,255,255,0.08)';
          ctx.fill(); if (k === 'on') { ctx.strokeStyle = '#ffb347'; ctx.lineWidth = 4; ctx.stroke(); } }
          x += d + 10;
        });
        y += d + 26; continue;
      }
      ctx.font = `${L.bold ? 700 : 500} ${s}px ${F}`;
      let x = X;
      if (L.tick !== undefined) {
        const rr = s * 0.36;
        if (paint) {
        ctx.beginPath(); ctx.arc(x + rr, y + s * 0.62, rr, 0, Math.PI * 2);
        ctx.fillStyle = L.tick ? '#4dff88' : 'rgba(255,255,255,0.08)'; ctx.fill();
        if (L.tick) { ctx.fillStyle = '#052010'; ctx.font = `800 ${s * 0.55}px ${F}`; ctx.fillText('✓', x + rr * 0.45, y + s * 0.82); ctx.font = `${L.bold ? 700 : 500} ${s}px ${F}`; }
        }
        x += rr * 2 + 18;
      }
      if (L.swatch) {
        if (paint) { ctx.fillStyle = L.swatch; ctx.shadowColor = L.swatch; ctx.shadowBlur = 24;
        ctx.beginPath(); ctx.roundRect(x, y + s * 0.12, s * 1.6, s * 0.9, 10); ctx.fill(); ctx.shadowBlur = 0; }
        x += s * 1.6 + 20;
      }
      ctx.fillStyle = L.color || (L.tick === false ? 'rgba(220,230,255,0.55)' : '#e8eefc');
      for (const ln of wrap(L.text || '', maxW - (x - X))) { if (paint) ctx.fillText(ln, x, y + s * 0.85); y += s * 1.2; }
      y += 10;
    }
    return y;
  }
  return { mesh, draw, set visible(v) { mesh.visible = v; } };
}

// ---------------------------------------------------------------- goal bar (one slim line at the bottom)
// The goal sits low and small, out of the way of the experiment. Same line format as board():
// {text, bold, color, swatch: css, tick: true/false, dots: ['ok'|'no'|'on'|'p1'..'p3'|''], breaks}
export function goalBar(el) {
  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  function draw(lines) {
    el.innerHTML = lines.map((L) => {
      if (L.dots) return `<span class="gb-dots">${L.dots.map((k, i) => `${L.breaks && L.breaks.includes(i) ? '<b></b>' : ''}<i class="${k}"></i>`).join('')}</span>`;
      const tick = L.tick === undefined ? '' : `<i class="gb-tick${L.tick ? ' ok' : ''}">${L.tick ? '✓' : ''}</i>`;
      const sw = L.swatch ? `<i class="gb-sw" style="background:${L.swatch};box-shadow:0 0 12px ${L.swatch}"></i>` : '';
      return `<span class="gb-item${L.bold ? ' b' : ''}"${L.color ? ` style="color:${L.color}"` : ''}>${tick}${sw}${esc(L.text || '')}</span>`;
    }).join('');
    el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
  }
  return { draw, set visible(v) { el.style.display = v ? '' : 'none'; } };
}
