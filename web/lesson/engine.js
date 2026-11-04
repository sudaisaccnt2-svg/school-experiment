// Lesson engine (v6, user 2026-10-11): a lesson is CODE, not an exported Blender film, so every model, material,
// light, effect and camera move shares ONE house style (the style-lab look the user liked).
// A lesson module exports { duration, cams: [[t, [pos], [look], fov?], ...], captions: [[t0, t1, text], ...],
// build(K) → update(t, dt) }. Everything is a pure function of the time t, so pause / scrub / skip are exact.
// Player = a video: tap pause/play, double-tap left/right ∓5 s, middle = back to the film view; drag orbits round
// the shot's subject, pinch / wheel zoom. Captions sit in their own band under the picture (never over the 3D).
import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { inkResize } from '../house.js';

const Q = new URLSearchParams(location.search);
const ID = Q.get('id') || '803', FREEZE = Q.has('t') ? +Q.get('t') : null;
const L = (await import(`./l${ID}.js`)).default;

// ---------------------------------------------------------------- renderer + house look (style-lab A)
const R = new THREE.WebGLRenderer({ antialias: true });
R.setPixelRatio(Math.min(devicePixelRatio, 2));
R.toneMapping = THREE.AgXToneMapping; R.toneMappingExposure = 0.85; R.outputColorSpace = THREE.SRGBColorSpace;
R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.prepend(R.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0c0f16);
scene.fog = new THREE.Fog(scene.background, 6, 15);                  // the floor melts into the dark: no horizon
const cam = new THREE.PerspectiveCamera(32, 16 / 9, 0.05, 200);
scene.add(new THREE.HemisphereLight(0x9fb6ff, 0x1a1410, 0.55));
const key = new THREE.DirectionalLight(0xfff0dc, 2.0); key.castShadow = true;
key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 6; key.shadow.bias = -0.0005; key.shadow.normalBias = 0.02;
Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 0.5, far: 30 });
const rim = new THREE.DirectionalLight(0x8fb8ff, 2.2);
scene.add(key, key.target, rim, rim.target);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(400, 80), new THREE.MeshStandardMaterial({ color: 0x151a24, roughness: 0.85 }));
floor.rotation.x = -Math.PI / 2; floor.position.set(60, -0.004, 0);   // just below y = 0: never in the same plane as a vessel's base (flicker)
floor.receiveShadow = true; floor.name = 'floor'; scene.add(floor);
new RGBELoader().load('../env.hdr', (tx) => { tx.mapping = THREE.EquirectangularReflectionMapping; scene.environment = tx; scene.environmentIntensity = 0.7; });

// ---------------------------------------------------------------- the lesson
const update = L.build({ scene, cam, R });
const T = L.duration;

// ---------------------------------------------------------------- camera: eased moves between keys
const ease = (x) => x * x * x * (x * (x * 6 - 15) + 10);           // smootherstep: every move eases in and out
const V3 = (a) => new THREE.Vector3(...a);
const DIST = L.dist ?? 1.04;                                        // a little air round every shot (title-safe)
// a key's 5th item sets how the move INTO it runs: 'in' = speeds up and arrives moving (push through a cut), 'out' =
// leaves moving and settles (continues a push after a cut), 'lin' = constant speed; default eases both ends
const EASE = { in: (x) => x * x, out: (x) => 1 - (1 - x) * (1 - x), lin: (x) => x };
const keys = L.cams.map(([t, p, l, f, e, fit]) => ({ t, p: V3(l).lerp(V3(p), DIST), l: V3(l), f: f ?? 32, e: EASE[e] ?? ease, fit }));
// user 2026-10-13: "this should work on any screens". A key made by a lesson's S() carries its subject (look, w × h, view
// direction, docked panel): on every resize the camera distance is worked out again for the REAL picture shape, so the
// subject fills phones (portrait and landscape), tablets, laptops and wide monitors alike.
const TANH = Math.tan(16 * Math.PI / 180);
function refit(asp) {
  for (const k of keys) {
    const f = k.fit; if (!f) continue;
    // upright screens (phones): the docked card sits across the TOP (0.26 of the height = kit DOCK_TOP), the subject below it,
    // and a wide subject may overhang the sides a little (else it shrinks to a strip)
    const tall = asp < 1, top = tall && f.dock ? 0.26 : 0, side = tall ? 0 : f.dock;
    const d = V3(f.dir).normalize(), w = (side ? f.w / (1 - side) : f.w) * (tall ? 0.85 : 1), dist = Math.max(f.h / (1 - top) / 2 / TANH, w / 2 / (TANH * asp)) * 1.1;
    const look = V3(f.look), pos = look.clone().addScaledVector(d, dist);
    k.x = Math.max(0, dist - Math.max(f.h / 2 / TANH, (f.dock ? f.w / (1 - f.dock) : f.w) / 2 / (TANH * 16 / 9)) * 1.1);   // how much farther than on a 16:9 screen
    const fw = look.clone().sub(pos).normalize(), right = fw.clone().cross(new THREE.Vector3(0, 1, 0)).normalize(), up = right.clone().cross(fw);
    if (side) {                                                         // keep the subject right of the docked card
      const sh = side * 0.5 * 2 * dist * TANH * asp * 0.9;
      pos.addScaledVector(right, -sh); look.addScaledVector(right, -sh);
    }
    if (top) { const sh = top * 0.5 * 2 * dist * TANH; pos.addScaledVector(up, sh); look.addScaledVector(up, sh); }   // … or below the card
    k.l.copy(look); k.p.copy(look).lerp(pos, DIST);
  }
}
// a lesson that frames with S() may still have a few hand-placed keys (a dive into a lump, an atom): those get a fit
// worked out from their own camera (subject = the 16:9 picture they were planned for), so every key follows the screen
const FITTED = keys.some((k) => k.fit); window._fitted = FITTED;
if (FITTED) L.cams.forEach(([, p, l], i) => {
  if (keys[i].fit) return;
  const off = V3(p).sub(V3(l)), h = 2 * off.length() * TANH / 1.1;
  keys[i].fit = { look: l, w: h * 16 / 9, h, dir: off.toArray(), dock: 0 };
});
const shot = { p: new THREE.Vector3(), l: new THREE.Vector3(), f: 32, x: 0, sl: new THREE.Vector3(), sh: 1, dk: 0 };
function filmCam(t) {
  let i = 0; while (i + 1 < keys.length && keys[i + 1].t <= t) i++;
  const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
  const u = b.t > a.t ? b.e(THREE.MathUtils.clamp((t - a.t) / (b.t - a.t), 0, 1)) : 0;
  shot.p.lerpVectors(a.p, b.p, u); shot.l.lerpVectors(a.l, b.l, u); shot.f = a.f + (b.f - a.f) * u; shot.x = (a.x ?? 0) + ((b.x ?? 0) - (a.x ?? 0)) * u;
  if (a.fit && b.fit) { shot.sl.lerpVectors(V3(a.fit.look), V3(b.fit.look), u); shot.sh = a.fit.h + (b.fit.h - a.fit.h) * u; shot.dk = (a.fit.dock || 0) + ((b.fit.dock || 0) - (a.fit.dock || 0)) * u; }
  else { shot.sl.copy(shot.l); shot.sh = 2 * shot.p.distanceTo(shot.l) * TANH / 1.1; shot.dk = 0; }
}
// the viewer's own orbit on top of the film camera (springs back gently while playing, after a pause in touching)
const orbit = { yaw: 0, pitch: 0, zoom: 1, touched: -1e9 };
const FOG0 = L.fog ?? [scene.fog.near, scene.fog.far];   // a lesson with wide dark shots (charts) may push the fog back: fog: [near, far]
function placeCamera(t, now) {
  filmCam(t);
  if (scene.fog) { scene.fog.near = FOG0[0] + shot.x; scene.fog.far = FOG0[1] + shot.x; }   // a camera pulled back for a narrow screen pushes the fog back too
  if (playing && now - orbit.touched > 2500) { const k = 0.04; orbit.yaw *= 1 - k; orbit.pitch *= 1 - k; orbit.zoom += (1 - orbit.zoom) * k; }
  const off = shot.p.clone().sub(shot.l);
  const sph = new THREE.Spherical().setFromVector3(off);
  sph.theta += orbit.yaw; sph.phi = THREE.MathUtils.clamp(sph.phi - orbit.pitch, 0.15, Math.PI / 2 - 0.02); sph.radius *= orbit.zoom;
  cam.position.copy(shot.l).add(off.setFromSpherical(sph)); cam.position.y = Math.max(0.08, cam.position.y);
  cam.lookAt(shot.l); cam.fov = shot.f; cam.updateProjectionMatrix();
  // light and soft shadows follow the shot
  key.position.copy(shot.l).add(new THREE.Vector3(-3, 6, 4)); key.target.position.copy(shot.l);
  rim.position.copy(shot.l).add(new THREE.Vector3(3, 3, -5)); rim.target.position.copy(shot.l);
}

// ---------------------------------------------------------------- layout: picture above, caption band below
const ui = document.getElementById('ui'), cap = document.getElementById('cap');
// capNear (user 2026-10-15: "the focus is always in the 3D scene so no one reads the bottom text"): no band; each caption
// floats just above the thing it talks about (its 4th item: [x, y, z] or (t) → [x, y, z]; default = top of the shot's subject)
const NEAR = !!L.capNear; if (NEAR) document.body.classList.add('capnear');
let bandPx = 0;
function fit() {
  // the picture ends where the caption band starts: text can never sit over the 3D
  const W = innerWidth, H = innerHeight; bandPx = NEAR ? 0 : Math.max(L.captionBandMin??0, Math.round(Math.min(H * 0.18, 140)));
  const h = H - bandPx; R.setSize(W, h); inkResize(W, h, R.getPixelRatio());
  cam.aspect = W / h; cam.zoom = FITTED ? 1 : Math.min(1, (W / h) / (16 / 9));   // fitted lessons refit every shot; others: widen so the whole 16:9 picture fits
  if (FITTED) refit(W / h);
  cap.style.height = NEAR ? '' : bandPx + 'px';
}
addEventListener('resize', fit); fit();

// ---------------------------------------------------------------- captions
let capText = '';
// soft fades (e.g. diving into a metal → inside its atom): [t0, t1, css colour], opacity rises then falls
const fadeEl = document.getElementById('fade');
function fades(t) {
  let k = 0, col = '#0c0f16';
  for (const [a, b, c] of L.fades || []) if (t > a && t < b) { k = Math.sin(Math.PI * (t - a) / (b - a)); col = c; }
  fadeEl.style.opacity = k; fadeEl.style.background = col;
}
let capAt = null; const capP = new THREE.Vector3();
function placeCap(t) {
  if (!NEAR || !capText) return;
  const a = typeof capAt === 'function' ? capAt(t) : capAt;
  if (a) capP.set(a[0] ?? a.x, a[1] ?? a.y, a[2] ?? a.z); else capP.copy(shot.sl).addScaledVector(new THREE.Vector3(0, 1, 0).applyQuaternion(cam.quaternion), shot.sh * 0.41);   // just above the subject, in SCREEN terms
  const W = innerWidth, H = innerHeight - bandPx, m = Math.max(10, 0.03 * Math.min(W, H));
  const tall = W < H, x0 = tall ? m : shot.dk * W + m, y0 = (tall && shot.dk ? 0.26 * H : 0) + m + (L.capTop ?? (H < 500 ? 4 : 52));
  const mw = Math.round(Math.min(900, 0.84 * W, W - x0 - m)) + 'px'; if (cap.style.maxWidth !== mw) cap.style.maxWidth = mw;   // wraps instead of running under the panel or off the edge
  const v = capP.project(cam), w = cap.offsetWidth, h = cap.offsetHeight;
  const x = THREE.MathUtils.clamp((v.x + 1) / 2 * W, x0 + w / 2, Math.max(x0 + w / 2, W - m - w / 2));
  let y = THREE.MathUtils.clamp((1 - v.y) / 2 * H, y0 + h, H - m - 56);
  // never on top of a 3D label or a letter on an atom: lift the line above whatever text it would cover
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(cam.quaternion), rs = [];
  scene.traverseVisible((o) => {
    if (!o.isSprite || o.userData.text === undefined) return;
    const op0 = o.material.userData.op0 ?? o.material.opacity; if (o.material.opacity < 0.3 * op0) return;
    const c = o.getWorldPosition(new THREE.Vector3()), sy = o.getWorldScale(new THREE.Vector3()).y, q = c.clone().project(cam);
    if (q.z > 1 || Math.abs(q.x) > 1.2 || Math.abs(q.y) > 1.2) return;
    const hh = Math.abs(c.addScaledVector(up, sy / 2).project(cam).y - q.y) / 2 * H * 0.8, hw = hh * o.scale.x / Math.max(1e-6, o.scale.y);
    const sx = (q.x + 1) / 2 * W, sy2 = (1 - q.y) / 2 * H; rs.push([sx - hw, sy2 - hh, sx + hw, sy2 + hh]);
  });
  for (let k = 0; k < 4; k++) {
    const hit = rs.find(([a, b, c2, d]) => a < x + w / 2 && c2 > x - w / 2 && b < y && d > y - h);
    if (!hit) break; y = Math.max(y0 + h, hit[1] - 4); if (y === y0 + h) break;
  }
  const covers = () => rs.some(([a, b, c2, d]) => a < x + w / 2 && c2 > x - w / 2 && b < y && d > y - h);
  if (covers()) {                                                      // no room above: under the subject instead
    const lo = shot.sl.clone().addScaledVector(up, -shot.sh * 0.5).project(cam);
    const yb = THREE.MathUtils.clamp((1 - lo.y) / 2 * H + h + 6, y0 + h, H - m - 56), keep = y; y = yb; if (covers()) y = keep;
  }
  cap.style.left = x.toFixed(1) + 'px'; cap.style.top = y.toFixed(1) + 'px';
}
function captions(t) {
  const c = L.captions.find(([a, b]) => t >= a && t < b), s = c ? c[2] : '';
  capAt = c ? c[3] ?? null : null;
  if (s === capText) return; capText = s;
  cap.classList.remove('on'); clearTimeout(cap._t);
  cap._t = setTimeout(() => { cap.firstElementChild.textContent = s; if (s) cap.classList.add('on'); placeCap(t); }, s && cap.firstElementChild.textContent ? 180 : 0);
}

// ---------------------------------------------------------------- one text at a time (user 2026-10-15: "which text should I
// look at, the top or the bottom? I can't look at everything at once"). L.oneText: the caption and the 3D labels take
// turns: each text keeps the screen for its reading time, then the next newer one replaces it. Letters on atoms and
// single signs (+ − >) are part of the picture; labels sharing userData.group (an equation) count as one text.
const MARK = /^([A-Z][a-z]?[⁺⁻²³]*|[+−>])$/;
const past = new Map();
function oneText(t) {
  if (!L.oneText) return;
  const groups = new Map();
  scene.traverseVisible((o) => {
    if (!o.isSprite || o.userData.text === undefined || o.userData.mark || (!o.userData.group && MARK.test(o.userData.text))) return;
    if (/^(eq|rb)\d/.test(o.userData.group ?? '')) return;           // equations and word boards are part of the picture: the caption explains them, sitting above
    const s0 = o.userData.s0 ? o.userData.s0.y : o.userData.h; if (o.scale.y < 0.05 * s0) return;
    if (o.userData.t0 === undefined || t < o.userData.t0) { if (o.userData._seen === undefined || o.userData._seen > t) o.userData._seen = t; }
    const pv = o.getWorldPosition(new THREE.Vector3()).project(cam);   // off screen: it takes no turn (its turn starts when it comes into view)
    if (pv.z > 1 || Math.abs(pv.x) > 1 || Math.abs(pv.y) > 1) { o.userData._scr = undefined; return; }
    if (o.userData._scr === undefined || o.userData._scr > t) o.userData._scr = t;
    const on = Math.max(o.userData.t0 !== undefined && t >= o.userData.t0 ? o.userData.t0 : o.userData._seen, o.userData._scr - 0.5), key = o.userData.group ?? o.uuid;
    const g = groups.get(key) ?? { on, len: 0, list: [] }; g.on = Math.min(g.on, on); g.len += o.userData.text.length; g.list.push(o); groups.set(key, g);
  });
  scene.traverse((o) => { if (o.isSprite && !o.visible) { o.userData._seen = undefined; o.userData._scr = undefined; } });
  for (const [k, h] of past) if (h.on > t) past.delete(k);           // seeking back forgets what had not been shown yet
  const live = new Set(groups.keys());
  for (const [k, g] of groups) past.set(k, { on: g.on, len: g.len, now: /^(eq|rb)\d/.test(k) });
  const c = capText && L.captions.find(([a, b]) => t >= a && t < b);
  // every text seen so far keeps its place in the queue, so a text that was replaced never comes back
  const q = [...past].map(([k, h]) => ({ ...h, ...(groups.get(k) ?? {}), live: live.has(k), read: 0.9 + 0.045 * h.len }));
  if (c) q.push({ on: c[0], read: 1.3 + 0.05 * capText.length, cap: true, live: true });
  q.sort((a, b) => a.on - b.on);
  let win = null;
  // an equation / word board (kit groups eq…, rb…) is built from the things on screen: it takes over at once
  for (let i = 0; i < q.length; i++) { q[i].start = q[i].now ? q[i].on : Math.max(q[i].on, i ? Math.min(q[i - 1].start + q[i - 1].read, q[i - 1].live ? 1e9 : q[i].on) : -1e9); if (q[i].start <= t) win = q[i]; }
  if (win && !win.live) win = null;
  for (const g of q) {
    const k = g === win ? Math.min(1, (t - g.start) / 0.25 + (g.start === g.on ? 1 : 0)) : 0;   // a text that waited for its turn fades in
    if (g.cap) { cap.classList.toggle('hush', g !== win || !!cam.userData.cardUp); continue; }
    for (const o of g.list ?? []) { const m = o.material; if (m.userData.op0 === undefined) m.userData.op0 = m.opacity; m.opacity = m.userData.op0 * Math.max(0, k); }
  }
  if (!c) cap.classList.remove('hush');
}

// ---------------------------------------------------------------- playback
let t = FREEZE ?? 0, playing = FREEZE === null, last = performance.now(), speed = 1;
const playBtn = document.getElementById('play'), scrub = document.getElementById('scrub'), clock = document.getElementById('clock');
const endBar = document.getElementById('end');
scrub.max = T;
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
function setPlaying(p) { playing = p; document.body.classList.toggle('paused', !p); if (p && t >= T - 0.05) seek(0); wake(); }
function seek(s) { t = THREE.MathUtils.clamp(s, 0, T); endBar.hidden = t < T - 0.05; }
playBtn.onclick = (e) => { e.stopPropagation(); setPlaying(!playing); };
scrub.oninput = () => { seek(+scrub.value); };
const speedBtn = document.getElementById('speed');                    // same steps as the film player: 1× → 2× → ½× → 1×
speedBtn.onclick = (e) => { e.stopPropagation(); speed = speed === 1 ? 2 : speed === 2 ? 0.5 : 1; speedBtn.textContent = (speed === 0.5 ? '½' : speed) + '×'; wake(); };
document.getElementById('again').onclick = () => { seek(0); setPlaying(true); };
let idleT; function wake() { document.body.classList.remove('idle'); clearTimeout(idleT); if (playing) idleT = setTimeout(() => document.body.classList.add('idle'), 2500); }
addEventListener('pointermove', wake);

// next lesson / practise game from the lesson list
fetch('../films.json').then((r) => r.json()).then((j) => {
  const i = j.films.findIndex((f) => f.id === ID), f = j.films[i], n = j.films[i + 1];
  document.title = f ? f.title : 'Lesson';
  document.getElementById('practise').href = '../games.html?game=' + (f?.game || '');
  document.getElementById('next').href = n ? '../index.html?film=' + n.id : '../home.html';
  document.getElementById('games').href = '../games.html?' + (f?.game ? 'game=' + f.game : 'unit=' + (f?.unit || 'u8').slice(1));
  // ☰ the lessons of this chapter (as in the film player), then its games
  const unit = f?.unit, ch = (j.chapters || []).find((c) => c.id === unit), ol = document.getElementById('topicList');
  document.getElementById('chapter').textContent = ch ? ch.title : '';
  j.films.filter((x) => x.unit === unit).forEach((x, k) => {
    const li = document.createElement('li'), a = document.createElement('a');
    a.href = '../index.html?film=' + encodeURIComponent(x.id); a.className = x.id === ID ? 'on' : '';
    a.innerHTML = `<b>${k + 1}</b><span></span><span class="pg"></span>`; a.children[1].textContent = x.title; a.children[2].textContent = x.pages ? 'p. ' + x.pages : '';
    li.appendChild(a); ol.appendChild(li);
  });
  const gl = document.createElement('li'); gl.innerHTML = `<a href="../games.html?unit=${(unit || 'u8').slice(1)}" class="games"><b>🎮</b><span>Games: practise the exercise</span><span class="pg">play</span></a>`; ol.appendChild(gl);
}).catch(() => {});
const topics = document.getElementById('topics');
const showTopics = (on) => { topics.hidden = !on; if (on) setPlaying(false); };
document.getElementById('menu').onclick = (e) => { e.stopPropagation(); showTopics(true); };
document.getElementById('topicsClose').onclick = () => showTopics(false);
topics.addEventListener('click', (e) => { if (e.target === topics) showTopics(false); });

// ---------------------------------------------------------------- touch: tap / double-tap / drag orbit / pinch
const ptrs = new Map(); let down = null, lastTap = 0, tapTimer = null, pinch0 = 0;
const fx = document.getElementById('tapfx');
R.domElement.addEventListener('pointerdown', (e) => {
  R.domElement.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  down = { x: e.clientX, y: e.clientY, at: performance.now(), moved: false };
  if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch0 = Math.hypot(a.x - b.x, a.y - b.y); }
});
R.domElement.addEventListener('pointermove', (e) => {
  const p = ptrs.get(e.pointerId); if (!p) return;
  const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
  if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8) down.moved = true;
  orbit.touched = performance.now();
  if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); orbit.zoom = THREE.MathUtils.clamp(orbit.zoom * pinch0 / Math.max(1, d), 0.35, 2.5); pinch0 = d; return; }
  if (down?.moved) { orbit.yaw -= dx * 0.006; orbit.pitch += dy * 0.004; orbit.pitch = THREE.MathUtils.clamp(orbit.pitch, -1.2, 1.2); }
});
const up = (e) => {
  ptrs.delete(e.pointerId);
  if (!down || down.moved || ptrs.size) { if (!ptrs.size) down = null; return; }
  const now = performance.now(), x = e.clientX / innerWidth;
  if (now - lastTap < 300) {                                          // double tap
    clearTimeout(tapTimer); lastTap = 0;
    if (x < 0.33) { seek(t - 5); ripple(e, '−5'); } else if (x > 0.67) { seek(t + 5); ripple(e, '+5'); }
    else { orbit.yaw = orbit.pitch = 0; orbit.zoom = 1; }
  } else { lastTap = now; tapTimer = setTimeout(() => setPlaying(!playing), 300); }
  down = null;
};
R.domElement.addEventListener('pointerup', up); R.domElement.addEventListener('pointercancel', up);
R.domElement.addEventListener('wheel', (e) => { e.preventDefault(); orbit.touched = performance.now(); orbit.zoom = THREE.MathUtils.clamp(orbit.zoom * Math.exp(e.deltaY * 0.001), 0.35, 2.5); }, { passive: false });
function ripple(e, s) { fx.textContent = s; fx.style.left = e.clientX + 'px'; fx.style.top = e.clientY + 'px'; fx.classList.remove('go'); void fx.offsetWidth; fx.classList.add('go'); }
addEventListener('keydown', (e) => { if (e.code === 'Escape') showTopics(false); if (e.code === 'Space') setPlaying(!playing); if (e.code === 'ArrowRight') seek(t + 5); if (e.code === 'ArrowLeft') seek(t - 5); });

// ---------------------------------------------------------------- loop
let frames = 0;
R.setAnimationLoop((now) => {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (playing) { t += dt * speed; if (t >= T) { t = T; setPlaying(false); endBar.hidden = false; } }
  update(t, dt);                                                       // effects (fire) keep living while paused
  placeCamera(t, now); captions(t); placeCap(t); oneText(t); fades(t);
  scrub.value = t; clock.textContent = `${fmt(t)} / ${fmt(T)}`;
  R.render(scene, cam);
  if (++frames === 30) window._ready = true;
});
setPlaying(playing);
window._lesson = { seek, get t() { return t; }, setPlaying, scene, cam, duration: T };
