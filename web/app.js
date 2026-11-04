// Structure of an Atom: interactive 3D viewer for iPad / desktop, one film per textbook topic.
// films.json lists the films; each film = a JSON (scene.json for film 01, films/<id>.json) + its GLB, all exported
// from Blender by scripts/export_web.py (film 01) and scripts/p2/export_topics.py (02-14). env.hdr is shared.
// One camera mode: the view travels along the film's animated cameras; drag to orbit around the shot's subject,
// pinch / scroll to zoom, ↺ (or double-tap) to return to the exact film framing.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { upgradeFlames } from './fx.js';
import { createARLink } from './ar.js';
import { HOUSE, applyHouseStyle, inkResize } from './house.js';
// lessons rebuilt as code in the house style (web/lesson/): the old film player hands over to the lesson engine
const CODE_LESSONS = new Set([
  '401', '402', '403', '404', '405', '406', '407', '408', '409', '410', '411', '412', '413', '414', '415', '501', '502', '503', '504', '505', '506', '507', '508', '509', '510', '511', '512', '513', '514', '515', '601', '602', '603', '604', '605', '606', '607', '608', '609', '610', '611', '612', '613', '614', '615',
  ...Array.from({length:19},(_,i)=>String(701+i)),
  '801', '802', '803', '804', '805', '806', '807', '808', '809', '810', '811', '812', '813', '814', '815', '816', '817'
]);

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const shownErrors = new Set();
function showError(msg) {
  if (shownErrors.has(msg) || shownErrors.size > 6) return;      // each problem once, never a wall of text
  shownErrors.add(msg);
  const e = $('error'); e.hidden = false; e.textContent += msg + '\n';
}
const describe = (err) => (err && (err.stack || err.message)) ? `${err.message}\n${(err.stack || '').split('\n').slice(0, 4).join('\n')}` : String(err);
window.addEventListener('error', (e) => {
  if (!e.error && !e.filename && /^Script error\.?$/.test(e.message || '')) return;   // Safari UI noise, not our code
  showError(e.error ? describe(e.error) : `${e.message} (${e.filename || '?'}:${e.lineno || '?'})`);
});
window.addEventListener('unhandledrejection', (e) => {
  if (/sw\.js|ServiceWorker|service worker/i.test(String(e.reason?.message || e.reason))) return;   // offline update check
  showError(describe(e.reason));
});

// ---------------------------------------------------------------- renderer (kept light: the iPad must stay cool)
// preserveDrawingBuffer: when nothing changes we stop drawing, so the canvas must keep its last picture
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: 'low-power' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
// The film picture sits ABOVE the play bar (its titles and captions must never hide behind it); AR stays full screen.
// It also starts below the title bar, and the whole 16:9 film frame always fits inside (see fitCamera).
const isAR = () => document.body.classList.contains('ar');
// minimal player (user 2026-10-11): the picture fills the screen; the few icons float over it and hide while playing
const viewTop = () => 0;
const viewH = () => Math.max(200, innerHeight);
renderer.setSize(innerWidth, viewH());
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.AgXToneMapping;
renderer.shadowMap.enabled = false;     // shadows come baked from Cycles (lightmaps); metals use the HDRI
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.shadowMap.autoUpdate = false;   // nothing that casts a shadow moves: compute shadows once
document.body.prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020203);
const viewCam = new THREE.PerspectiveCamera(40, innerWidth / viewH(), 0.05, 600);

// Effects pipeline only for depth of field (the close-up); everything else draws straight to the screen.
const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { samples: 4 }));
composer.setSize(innerWidth, viewH());
const renderPass = new RenderPass(scene, viewCam);
const bokeh = new BokehPass(scene, viewCam, { focus: 10, aperture: 0, maxblur: 0.012 });
composer.addPass(renderPass);
composer.addPass(bokeh);
composer.addPass(new OutputPass());

// ---------------------------------------------------------------- lights (Blender area lights are not in glTF)
const key = new THREE.DirectionalLight(0xffe9d2, 2.4);
key.position.set(-4, 8, 7);
key.target.position.set(-1.5, 0, 0);
key.castShadow = false;
key.shadow.mapSize.set(1024, 1024);
Object.assign(key.shadow.camera, { left: -11, right: 11, top: 8, bottom: -8, near: 0.5, far: 40 });
key.shadow.bias = -0.0004;
key.shadow.normalBias = 0.02;
const rim = new THREE.DirectionalLight(0xa8c4ff, 1.2);
rim.position.set(2, 5, -8);
const fill = new THREE.HemisphereLight(0x9fb4ff, 0x3a2a20, 0.35);
scene.add(key, key.target, rim, fill);

// ---------------------------------------------------------------- state
let meta, root, mixer, filmCams = {}, activeFilmCam = null, films = [], chapters = [], film = null, nextFilm = null;
let frame = 1, playing = false, speed = 1, dirty = true;
const trails = [], billboards = [], leaderLines = [], huds = [];
const HUD_Q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);  // text faces the lens
const hfov = new Map();          // horizontal FOV per film camera (keeps Blender framing on any aspect ratio)
const tmpQ = new THREE.Quaternion(), tmpV = new THREE.Vector3(), tmpM = new THREE.Matrix4();

// ---------------------------------------------------------------- loading
const manager = new THREE.LoadingManager();
manager.onProgress = (url, loaded, total) => { $('loadbar').style.width = (100 * loaded / total) + '%'; };

const T0 = performance.now(), marks = [];
const mark = (n) => marks.push(n + ':' + Math.round(performance.now() - T0));
async function load() {
  // the plain address opens the chapters home page; links from it carry ?unit= or ?film=
  if (!location.search) { location.replace('home.html'); return; }
  mark('start');
  const list = await fetch('films.json').then((r) => (r.ok ? r.json() : null)).catch(() => null);
  films = list?.films?.length ? list.films : [{ id: '01', title: "Rutherford's Atomic Model", meta: 'scene.json' }];
  chapters = list?.chapters?.length ? list.chapters : [{ id: 'u2', title: list?.chapter || 'Structure of an Atom' }];
  for (const f of films) f.unit = f.unit || chapters[0].id;
  let saved = null;
  try { saved = localStorage.getItem('film'); } catch { /* private mode */ }
  const wantUnit = params.get('unit') && 'u' + params.get('unit').replace(/^u/, '');
  if (CODE_LESSONS.has(params.get('film'))) { location.replace('lesson/index.html?id=' + params.get('film')); return; }
  film = films.find((f) => f.id === params.get('film')) || (wantUnit && films.find((f) => f.unit === wantUnit))
    || films.find((f) => f.id === saved) || films[0];
  const next = films[films.indexOf(film) + 1];
  nextFilm = next && next.unit === film.unit ? next : null;      // "Next" stays inside the unit
  $('chapter').textContent = (chapters.find((c) => c.id === film.unit) || chapters[0]).title;
  try { localStorage.setItem('film', film.id); } catch { /* private mode */ }
  $('loadtitle').textContent = film.title;
  $('filmname').textContent = film.title;
  document.title = `${film.title} · Asawera`;
  meta = await (await fetch(film.meta)).json();
  // per-camera data is keyed by Blender names; three.js node names are sanitised ("02 Cam" -> "02_Cam")
  for (const k of ['camera_subject', 'camera_shift', 'camera_dof']) {
    if (meta[k]) meta[k] = Object.fromEntries(Object.entries(meta[k]).map(([n, v]) => [THREE.PropertyBinding.sanitizeNodeName(n), v]));
  }
  mark('json');
  if (meta.background_color) scene.background = new THREE.Color().setRGB(...meta.background_color);  // linear, as in Blender
  $('scrub').min = meta.frame_start;
  $('scrub').max = meta.frame_end;

  new RGBELoader(manager).load('env.hdr', (tex) => {
    tex.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = tex;          // lights and reflections only; the camera sees the studio backdrop (as in the film)
    scene.environmentIntensity = 0.55 * Math.sqrt((meta.env_strength ?? 0.45) / 0.45) * (scene.userData.envScale ?? 1);
    scene.environmentRotation.y = -meta.env_rotation - Math.PI / 2;
    dirty = true; renderer.shadowMap.needsUpdate = true;
  });

  const loader = new GLTFLoader(manager);
  // topic films are Draco-compressed (mostly text geometry); the decoder ships with the app, so it works offline
  loader.setDRACOLoader(new DRACOLoader(manager).setDecoderPath('lib/three/examples/jsm/libs/draco/gltf/').setDecoderConfig({ type: 'wasm' }));
  const gltf = await new Promise((res, rej) => loader.load((meta.glb || 'models/rutherford.glb') + (meta.model_version ? '?v=' + meta.model_version : ''), res,
    (e) => { if (e.total) $('loadtext').textContent = `Loading 3D scene… ${Math.round(100 * e.loaded / e.total)}%`; }, rej));
  mark('glb');
  root = gltf.scene;
  // A mesh with several parts loads as a group whose parts are called "<name>_0", "_1" …; an object really named
  // "<name> 1" in Blender has the same name, and its animation then moved the part instead (labels vanished).
  // Rename the parts before the animation binds by name.
  root.traverse((o) => {
    const a = gltf.parser.associations.get(o);
    if (a && a.primitives !== undefined && a.nodes === undefined && o.parent?.isGroup) o.name = o.parent.name + '~part' + a.primitives;
  });
  scene.add(root);
  setupScene(gltf);
  mark('setup');
  buildUI();
  if (params.has('test')) $('loading').style.transition = 'none';
  $('loading').classList.add('done');
  setFrame(Number(params.get('frame')) || 1);
  // user: the 3D scene must not be empty at the start. Begin at the first moment something is in view, and play.
  if (!params.has('frame') && !params.has('test')) { setFrame(firstContentFrame()); setTimeout(() => { if (!playing) togglePlay(); }, 600); }
  if (params.has('orbit')) {   // test: ?orbit=yaw,pitch,dist
    const [y, p, d] = params.get('orbit').split(',').map(Number);
    Object.assign(orbit.target, { yaw: y, pitch: p, dist: d }); Object.assign(orbit.cur, orbit.target);
    if (params.has('pan')) { const [px, py] = params.get('pan').split(',').map(Number); Object.assign(orbit.target, { panX: px, panY: py }); Object.assign(orbit.cur, orbit.target); }
  }
  renderer.shadowMap.needsUpdate = true;
  renderer.setAnimationLoop(tick);
  if (params.has('timing')) requestAnimationFrame(() => requestAnimationFrame(() => { mark('frame'); document.title = 'T ' + marks.join(' '); }));
  if (params.has('test')) setTimeout(() => { document.title = 'READY'; }, 1500);
  if (params.has('dbg')) window._dbg = { THREE, viewCam, filmCams, root, meta, huds, orbit };
  if (params.has('dbg')) setTimeout(() => {
    const gl = renderer.getContext(), px = new Uint8Array(4);
    gl.readPixels(Math.round(gl.drawingBufferWidth * 0.3), Math.round(gl.drawingBufferHeight * 0.47), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    viewCam.getWorldPosition(tmpV);
    const cv = renderer.domElement, ld = $('loading');
    document.title = 'DBG ' + JSON.stringify({ canvas: [cv.width, cv.height, cv.clientWidth, cv.clientHeight],
      loading: [ld.className, getComputedStyle(ld).opacity, getComputedStyle(ld).display], ctxLost: renderer.getContext().isContextLost(),
      frames: renderer.info.render.frame, calls: renderer.info.render.calls,
      px: [...px], cam: activeFilmCam.name, pos: tmpV.toArray().map((v) => +v.toFixed(2)), dof: !!dofFor(activeFilmCam),
      proj: [...viewCam.projectionMatrix.elements].map((v) => +v.toFixed(3)).slice(0, 12) });
  }, 5000);
  if (params.has('perf')) {   // test: frames drawn in 3 s while paused (should be 0)
    setTimeout(() => { const f0 = renderer.info.render.frame;
      setTimeout(() => { document.title = 'DRAWN:' + (renderer.info.render.frame - f0); }, 3000); }, 3000);
  }
}

function setupScene(gltf) {
  for (const cam of gltf.cameras) {
    filmCams[cam.name] = cam;
    const aspect = cam.aspect || 16 / 9;
    hfov.set(cam, 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2) * aspect));
    cam.far = 600;
  }

  // text drop shadows were thick dark copies offset behind each word: from any angle but straight on they read as
  // black blocks (user: "the shadow of the text doesn't look realistic"). Leave them out.
  root.traverse((o) => { if (o.isMesh && /^Label Shadow/.test(o.material?.name || '')) o.visible = false; });
  root.traverse((o) => {
    if (o.isPointLight || o.isSpotLight) { o.intensity *= 0.02; o.castShadow = false; }
    if (o.isMesh && o.material?.userData?.baked) {
      // Cycles-baked surface: show the lightmap as is (lighting, soft shadows, bounce light already in it)
      const m = o.material;
      o.material = new THREE.MeshBasicMaterial({ map: m.map, color: new THREE.Color(2, 2, 2),   // 2x: bake headroom
        side: m.side, transparent: m.transparent, opacity: m.opacity, alphaTest: m.alphaTest });
      o.material.name = m.name;
      m.dispose();
      o.castShadow = o.receiveShadow = false;
      return;
    }
    if (o.isMesh) {
      const m = o.material;
      const glowing = m && m.emissiveIntensity > 0.5 && m.emissive && m.emissive.getHex() !== 0;
      const overlay = o.userData.billboard || o.userData.show_with || /Shadow/.test(o.name) || o.parent?.userData.billboard;
      o.castShadow = !glowing && !overlay;
      o.receiveShadow = !glowing;
    }
    if (o.userData.billboard) billboards.push(o);
    if (o.userData.hud) huds.push(o);
  });
  if (HOUSE.has(film.id) || params.has('house')) applyHouseStyle(root, { key, rim, fill, scene });   // one look (house.js)
  // a caption belongs to its own camera: shown only while that camera is filming
  for (const h of huds) h.userData.cam = filmCams[THREE.PropertyBinding.sanitizeNodeName(h.userData.hud_cam || '')] || h.parent;
  root.traverse((o) => {
    if (o.userData.show_with) {
      const label = root.getObjectByName(THREE.PropertyBinding.sanitizeNodeName(o.userData.show_with));
      if (label) leaderLines.push({ line: o, label });
    }
  });

  // one clip for the whole film, driven by our own clock (so scrubbing is exact)
  const tracks = gltf.animations.flatMap((c) => c.tracks);
  const clip = new THREE.AnimationClip('film', (meta.frame_end + 1) / meta.fps, tracks);
  mixer = new THREE.AnimationMixer(root);
  mixer.clipAction(clip).play();
  boostText(tracks);
  findStills(tracks);
  fires = upgradeFlames(root);                 // every old cone flame → a real fire (fx.js)
  splitCaptions();

  // particle trails: rebuilt from each particle's own motion track (same as the Blender curves)
  const byName = new Map(tracks.map((t) => [t.name, t]));
  const mats = new Map();
  root.traverse((o) => {
    const u = o.userData;
    if (u.trail_f0 === undefined) return;
    const track = byName.get(o.name + '.position');
    if (!track) return;
    const interp = track.createInterpolant();
    const pts = [];
    for (let f = u.trail_f0; f <= u.trail_f1 + 1e-6; f++) pts.push(new THREE.Vector3().fromArray(interp.evaluate(f / meta.fps)));
    if (pts.length < 2) return;
    const key = u.trail_color.map((c) => c.toFixed(2)).join();
    const col = new THREE.Color().fromArray(u.trail_color);
    col.multiplyScalar(1.3 / Math.max(col.r, col.g, col.b, 1e-6));
    if (!mats.has(key)) mats.set(key, new THREE.MeshBasicMaterial({ color: col }));
    const geo = new THREE.TubeGeometry(new FrameCurve(pts), pts.length - 1, Math.max(u.trail_r * 1.5, 0.006), 5, false);
    const mesh = new THREE.Mesh(geo, mats.get(key));
    mesh.frustumCulled = false;
    mesh.visible = false;
    o.parent.add(mesh);
    trails.push({ mesh, f0: u.trail_f0, n: pts.length - 1, lag: u.trail_lag });
  });
  setupOrbitTrails(byName);
}

// ---------------------------------------------------------------- no waiting: still stretches play fast
// After a beat's action the films hold the result for a few seconds (only the camera drifts). The user didn't want
// those waits, so while playing, anything still for longer than STILL_HOLD runs at STILL_RATE× (smooth, no jump).
const STILL_HOLD = 1.0, STILL_RATE = 8;
let stillRuns = [];
function findStills(tracks) {
  const n = meta.frame_end + 2, moving = new Uint8Array(n);
  for (const t of tracks) {
    const node = root.getObjectByName(t.name.slice(0, t.name.lastIndexOf('.')));
    if (!node || node.isCamera) continue;                     // the slow camera drift is not "something happening"
    const vs = t.getValueSize(), v = t.values;
    for (let k = 0; k + 1 < t.times.length; k++) {
      let same = true;
      for (let c = 0; c < vs && same; c++) same = Math.abs(v[(k + 1) * vs + c] - v[k * vs + c]) < 1e-4;
      if (same) continue;
      const a = Math.max(0, Math.floor(t.times[k] * meta.fps)), b = Math.min(n - 1, Math.ceil(t.times[k + 1] * meta.fps));
      moving.fill(1, a, b + 1);
    }
  }
  const hold = Math.round(STILL_HOLD * meta.fps);
  stillRuns = [];
  for (let f = meta.frame_start; f <= meta.frame_end; f++) {
    if (moving[f]) continue;
    let g = f;
    while (g + 1 <= meta.frame_end && !moving[g + 1]) g++;
    if (g - f > hold) stillRuns.push([f + hold, g]);
    f = g;
  }
}
const inStill = (f) => stillRuns.some(([a, b]) => f >= a && f < b);

// ---------------------------------------------------------------- orbit trails (topic films)
// Blender gives each orbiting electron a fixed comet arc ("… Trail"), which looks stiff when the electron slows,
// stops or jumps. Here the arc is hidden and a live tail is drawn instead: the electron's real path over the last
// half second, worked out from the animation tracks of the electron and its parents (so scrubbing is exact too).
const orbitTrails = [], TRAIL_F = 16;
function setupOrbitTrails(byName) {
  const statics = [];
  root.traverse((o) => { if (o.isMesh && /_Trail$/.test(o.name) && o.parent && o.parent !== root) statics.push(o); });
  for (const st of statics) {
    const e = st.parent;
    st.visible = false;
    const chain = [];
    for (let nd = e; nd && nd !== root; nd = nd.parent) {
      const track = (p) => { const t = byName.get(`${nd.name}.${p}`); return t ? t.createInterpolant() : null; };
      chain.unshift({ pos: track('position'), quat: track('quaternion'), scl: track('scale'),
        p0: nd.position.clone(), q0: nd.quaternion.clone(), s0: nd.scale.clone() });
    }
    const n = TRAIL_F + 1, geo = new THREE.BufferGeometry(), idx = [];
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 6), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 6), 3));
    for (let i = 0; i < n - 1; i++) idx.push(2 * i, 2 * i + 1, 2 * i + 2, 2 * i + 1, 2 * i + 3, 2 * i + 2);
    geo.setIndex(idx);
    const src = st.material, col = (src.emissive && src.emissive.getHex() ? src.emissive : src.color).clone();
    const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false }));
    mesh.frustumCulled = false;
    root.add(mesh);
    if (e.geometry && !e.geometry.boundingSphere) e.geometry.computeBoundingSphere();
    orbitTrails.push({ chain, mesh, col, r0: e.geometry?.boundingSphere?.radius || 0.1,
      pts: Array.from({ length: n }, () => new THREE.Vector3()), size: new Float32Array(n) });
  }
}
const _tm = new THREE.Matrix4(), _tl = new THREE.Matrix4(), _tp = new THREE.Vector3(), _tq = new THREE.Quaternion(),
  _ts = new THREE.Vector3(), _tc = new THREE.Vector3(), _td = new THREE.Vector3(), _tx = new THREE.Vector3(), _tt = new THREE.Vector3();
function sampleOrbitTrails(f) {
  for (const t of orbitTrails) {
    for (let i = 0; i <= TRAIL_F; i++) {
      const time = Math.max(meta.frame_start, f - i) / meta.fps;
      _tm.identity();
      for (const c of t.chain) {
        if (c.pos) _tp.fromArray(c.pos.evaluate(time)); else _tp.copy(c.p0);
        if (c.quat) _tq.fromArray(c.quat.evaluate(time)); else _tq.copy(c.q0);
        if (c.scl) _ts.fromArray(c.scl.evaluate(time)); else _ts.copy(c.s0);
        _tm.multiply(_tl.compose(_tp, _tq, _ts));
      }
      t.pts[i].setFromMatrixPosition(_tm);
      t.size[i] = t.r0 * _tm.getMaxScaleOnAxis();   // 0 while the electron is popped out: no tail
    }
  }
}
function drawOrbitTrails() {
  if (!orbitTrails.length) return;
  viewCam.getWorldPosition(_tc);
  root.worldToLocal(_tc);
  for (const t of orbitTrails) {
    const P = t.mesh.geometry.attributes.position.array, C = t.mesh.geometry.attributes.color.array;
    let acc = 0;
    for (let i = 0; i <= TRAIL_F; i++) {
      const p = t.pts[i];
      if (i) acc += p.distanceTo(t.pts[i - 1]);
      _tt.subVectors(t.pts[Math.max(0, i - 1)], t.pts[Math.min(TRAIL_F, i + 1)]);   // along the path
      _tx.crossVectors(_tt, _td.subVectors(_tc, p));                                  // sideways, facing the eye
      const k = Math.max(0, Math.min(1 - i / TRAIL_F, 1 - acc / 2.5)), w = t.size[i] * 0.8 * Math.pow(k, 1.2), len = _tx.length();
      if (len < 1e-9 || _tt.lengthSq() < 1e-10) _tx.set(0, 0, 0); else _tx.multiplyScalar(w / len);   // standing still: no tail
      P[6 * i] = p.x + _tx.x; P[6 * i + 1] = p.y + _tx.y; P[6 * i + 2] = p.z + _tx.z;
      P[6 * i + 3] = p.x - _tx.x; P[6 * i + 4] = p.y - _tx.y; P[6 * i + 5] = p.z - _tx.z;
      const a = 0.85 * k * k;
      for (const o of [0, 3]) { C[6 * i + o] = t.col.r * a; C[6 * i + o + 1] = t.col.g * a; C[6 * i + o + 2] = t.col.b * a; }
    }
    t.mesh.geometry.attributes.position.needsUpdate = true;
    t.mesh.geometry.attributes.color.needsUpdate = true;
  }
}

// curve parameterised by frame index (not arc length), so segment k == frame f0 + k
class FrameCurve extends THREE.Curve {
  constructor(pts) { super(); this.pts = pts; }
  getPoint(u, target = new THREE.Vector3()) {
    const n = this.pts.length - 1, x = u * n, i = Math.min(Math.floor(x), n - 1);
    return target.copy(this.pts[i]).lerp(this.pts[i + 1], x - i);
  }
  getPointAt(u, target) { return this.getPoint(u, target); }
}

// ---------------------------------------------------------------- timeline
const actAt = (f) => meta.acts.reduce((a, b) => (f >= b.frame ? b : a), meta.acts[0]);
const cutAt = (f) => meta.cuts.reduce((a, b) => (f >= b.frame ? b : a), meta.cuts[0]);

// ---------------------------------------------------------------- readable text: small labels/captions grow
// Many films were made with small text. On load every label and caption is measured (its letter height as a part of
// the picture height); anything smaller than MIN grows (up to MAX times) but never past the picture's edge.
const TEXT_MIN = { hud: 0.05, world: 0.05 }, TEXT_MAX = 3, EDGE = 0.03;
function boostText(tracks) {
  const scaleTrack = new Map(tracks.filter((t) => t.name.endsWith('.scale')).map((t) => [t.name.slice(0, -6), t]));
  const shadowed = (m) => m.isMesh && [].concat(m.material).some((x) => /Label Shadow/.test(x?.name || ''));
  // a text node: a mesh with a drop-shadow material, or a group of such primitives (multi-material glTF mesh)
  const prims = (o) => (o.isMesh ? [o] : o.children.filter((k) => k.isMesh && !k.children.length && k.position.lengthSq() === 0));
  const labelMat = (m) => m.isMesh && [].concat(m.material).some((x) => /^Label /.test(x?.name || ''));
  const isText = (o) => !!o.userData.billboard || prims(o).some(labelMat);
  // box of everything under o, in o's own frame, ignoring every scale (pop-in keys may be 0 right now)
  const box = (o) => {
    const b = new THREE.Box3(), mb = new THREE.Box3(), M = new THREE.Matrix4(), one = new THREE.Vector3(1, 1, 1);
    const walk = (n, parentM) => {
      const L = n === o ? new THREE.Matrix4() : M.clone().compose(n.position, n.quaternion, one).premultiply(parentM);
      if (n.isMesh) { n.geometry.computeBoundingBox(); b.union(mb.copy(n.geometry.boundingBox).applyMatrix4(L)); }
      n.children.forEach((c) => walk(c, L));
    };
    walk(o, new THREE.Matrix4());
    return b;
  };
  // letter height of ONE line: the text's triangles projected on its up axis, merged into covered bands (= lines)
  const letterH = (o) => {
    const sz = box(o).getSize(new THREE.Vector3()), ax = ['x', 'y', 'z'].sort((a, c) => sz[a] - sz[c])[1];
    const main = prims(o).filter((m) => !shadowed(m) || prims(o).every(shadowed)), spans = [];
    for (const m of main) {
      const pos = m.geometry.attributes.position, idx = m.geometry.index, n = idx ? idx.count : pos.count;
      const get = ax === 'x' ? 'getX' : ax === 'y' ? 'getY' : 'getZ';
      for (let k = 0; k < n; k += 3) {
        const a = pos[get](idx ? idx.getX(k) : k), b = pos[get](idx ? idx.getX(k + 1) : k + 1), c = pos[get](idx ? idx.getX(k + 2) : k + 2);
        spans.push([Math.min(a, b, c), Math.max(a, b, c)]);
      }
    }
    if (!spans.length) return sz[ax];
    spans.sort((p, q) => p[0] - q[0]);
    let best = 0, [lo, hi] = spans[0];
    for (const [a, b] of spans) { if (a > hi + 1e-5) { best = Math.max(best, hi - lo); lo = a; } hi = Math.max(hi, b); }
    return Math.max(best, hi - lo);
  };
  // grow the letters themselves (geometry, once): the film's own scale keys stay untouched, nothing compounds
  const done = new Set();
  const apply = (o, f) => {
    if (f <= 1.02) return;
    for (const m of prims(o)) {
      if (done.has(m)) continue;
      done.add(m);
      m.geometry = m.geometry.clone();
      m.geometry.scale(f, f, f);
    }
  };
  const frameH = (cam, d) => 2 * d * Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2);

  // every text becomes an entry: its wished growth f and its box on the picture (in picture heights, around the
  // picture centre, before growing) while it is shown; then growth is limited by the edges and by its neighbours
  const shownSpan = (o) => {
    const t = scaleTrack.get(o.name);
    if (!t) return [-Infinity, Infinity];
    let k = 0;
    while (k < t.times.length && !(t.values[3 * k] > 0.5)) k++;
    if (k === t.times.length) return [Infinity, Infinity];
    let e = k;
    while (e < t.times.length && t.values[3 * e] > 0.5) e++;
    return [t.times[k], e < t.times.length ? t.times[e] : Infinity];
  };
  const E = [], P = new THREE.Vector3(), C = new THREE.Vector3(), D = new THREE.Vector3();
  for (const h of huds) {
    const cam = h.userData.cam;
    if (!cam?.isCamera) continue;
    if (!isText(h)) {                 // a caption group (MCQ card): never grows, but others must not grow into it
      let any = false; h.traverse((c) => { if (c !== h && isText(c)) any = true; });
      const span = shownSpan(h);
      if (any && span[0] !== Infinity) E.push({ o: h, hud: true, cam, lh: Infinity, span, b: box(h), f: 1, fixed: true });
      continue;
    }
    const lh = letterH(h), span = shownSpan(h);
    if (lh > 0 && span[0] !== Infinity) E.push({ o: h, hud: true, cam, lh, span, b: box(h), f: 1 });
  }
  const walk = (n) => { if (n.isCamera || n.userData.hud) return; if (isText(n)) E.push({ o: n, hud: false }); else n.children.forEach(walk); };
  walk(root);
  for (const e of E) if (!e.hud) { e.lh = letterH(e.o); e.span = shownSpan(e.o); e.b = box(e.o); e.f = 1; }

  // where a text sits on the picture right now: box (in picture heights, around the centre, before growing) + wish
  const onScreen = (e, cam) => {
    if (e.hud) {
      if (e.cam !== cam) return null;
      const d = Math.abs(e.o.userData.hud[2]) || 3, fh = frameH(cam, d), fw = fh * (cam.aspect || 16 / 9);
      const sh = meta.camera_shift?.[cam.name] || [0, 0];
      return { ax: (e.o.userData.hud[0] - sh[0] * fw) / fh, ay: (e.o.userData.hud[1] - sh[1] * fw) / fh, x0: e.b.min.x / fh,
        x1: e.b.max.x / fh, y0: -e.b.max.z / fh, y1: -e.b.min.z / fh, wish: e.fixed ? 1 : Math.min(TEXT_MAX, (TEXT_MIN.hud * fh) / e.lh) };
    }
    e.o.getWorldPosition(P); cam.getWorldPosition(C); cam.getWorldDirection(D);
    const d = P.clone().sub(C).dot(D);
    if (d < 0.3) return null;
    const n = P.clone().project(cam);
    if (Math.abs(n.x) > 1.3 || Math.abs(n.y) > 1.3) return null;
    const up = e.o.parent && e.o.parent !== root ? e.o.parent.getWorldScale(new THREE.Vector3()).x : 1;
    const fh = frameH(cam, d), k = up / fh, asp = cam.aspect || 16 / 9;
    return { ax: (n.x * asp) / 2, ay: n.y / 2, x0: e.b.min.x * k, x1: e.b.max.x * k, y0: e.b.min.y * k, y1: e.b.max.y * k,
      wish: Math.min(3, (TEXT_MIN.world * fh) / (e.lh * up)) };
  };
  const rect = (r, f) => [r.ax + f * r.x0, r.ax + f * r.x1, r.ay + f * r.y0, r.ay + f * r.y1];
  const hit = (a, b, g = 0.01) => a[0] < b[1] + g && b[0] < a[1] + g && a[2] < b[3] + g && b[2] < a[3] + g;
  const fit = (c, lo, hi, half) => Math.min(lo < 0 ? (c + half) / -lo : Infinity, hi > 0 ? (half - c) / hi : Infinity);

  // at the moment each text appears: its wish (limited by the edges), and every other text on screen with it
  const pairs = [];
  for (const e of E) {
    const t = Math.max(e.span[0], meta.frame_start / meta.fps) + 0.3;
    mixer.setTime(t); root.updateMatrixWorld(true);
    const cam = e.hud ? e.cam : filmCams[THREE.PropertyBinding.sanitizeNodeName(cutAt(t * meta.fps).camera)] || Object.values(filmCams)[0];
    if (!cam) continue;
    const me = onScreen(e, cam);
    if (!me) continue;
    const hw = (cam.aspect || 16 / 9) / 2 - EDGE, hh = 0.5 - EDGE;
    e.f = e.fixed ? 1 : Math.max(1, Math.min(me.wish, fit(me.ax, me.x0, me.x1, hw), fit(me.ay, me.y0, me.y1, hh)));
    for (const o of E) {
      if (o === e || !(o.span[0] <= t && t < o.span[1])) continue;
      const r = onScreen(o, cam);
      if (r && !hit(rect(me, 1), rect(r, 1), 0)) pairs.push([e, me, o, r]);
    }
  }
  if (params.has('dbg')) window._textE = { E, pairs };
  // neighbours: two texts that did not touch must not touch after growing
  for (let it = 0; it < 40; it++) {
    let moved = false;
    for (const [a, ra, b, rb] of pairs) {
      if (!hit(rect(ra, a.f), rect(rb, b.f))) continue;
      if (a.f > 1) { a.f = Math.max(1, a.f * 0.95); moved = true; }
      if (b.f > 1) { b.f = Math.max(1, b.f * 0.95); moved = true; }
    }
    if (!moved) break;
  }
  // texts made the same size and on screen together stay the same size (a row of labels): the smallest growth wins
  for (const [a, , b] of pairs) if (Math.abs(a.lh - b.lh) < 0.03 * a.lh && a.hud === b.hud) a.f = b.f = Math.min(a.f, b.f);
  for (const e of E) if (!e.fixed) apply(e.o, e.f);
  mixer.setTime(0);
}

function setFrame(f) {
  frame = THREE.MathUtils.clamp(f, meta.frame_start, meta.frame_end);
  dirty = true;
  mixer.setTime(frame / meta.fps);
  sampleOrbitTrails(frame);
  for (const t of trails) {
    const rel = frame - t.f0;
    const end = THREE.MathUtils.clamp(Math.floor(rel), 0, t.n);
    const start = t.lag > 0 ? THREE.MathUtils.clamp(Math.floor(rel - t.lag), 0, t.n) : 0;
    const per = 5 * 6;  // radial segments * 6 indices
    t.mesh.visible = end > start;
    t.mesh.geometry.setDrawRange(start * per, (end - start) * per);
  }
  for (const { line, label } of leaderLines) line.visible = label.scale.x > 0.2;
  const cam = filmCams[THREE.PropertyBinding.sanitizeNodeName(cutAt(frame).camera)] || Object.values(filmCams)[0];
  // a new shot keeps your turn and zoom (v4 films cut every few seconds: resetting made the view jump back all the
  // time); only the slide (pan) restarts because it pointed at the old shot's subject. ↺ / double-tap = film framing.
  if (activeFilmCam && cam !== activeFilmCam) { orbit.target.panX = orbit.target.panY = orbit.cur.panX = orbit.cur.panY = 0; }
  if (cam !== activeFilmCam) cam.userData.depth = 0;   // find this shot's subject again (scene state has changed)
  activeFilmCam = cam;
  for (const h of huds) h.visible = h.userData.cam === cam;
  syncUI(actAt(frame));
  if (meta && $('arBtn')) updateARLink();
}

// ---------------------------------------------------------------- UI
function buildUI() {
  const acts = $('acts'), marks = $('marks');
  const span = meta.frame_end - meta.frame_start;
  meta.acts.forEach((a, i) => {
    const b = document.createElement('button');
    b.textContent = `${i + 1}. ${a.name}`;
    b.onclick = () => setFrame(a.frame);
    acts.appendChild(b);
    a.button = b;
    const m = document.createElement('i');
    m.style.left = (100 * (a.frame - meta.frame_start) / span) + '%';
    marks.appendChild(m);
  });
  $('playBtn').onclick = togglePlay;
  $('speedBtn').onclick = () => {
    speed = speed === 1 ? 2 : speed === 2 ? 0.5 : 1;
    $('speedBtn').textContent = (speed === 0.5 ? '½' : speed) + '×';
  };
  const scrub = $('scrub');
  let wasPlaying = false;
  scrub.addEventListener('pointerdown', () => { wasPlaying = playing; playing = false; });
  scrub.addEventListener('input', () => setFrame(Number(scrub.value)));
  scrub.addEventListener('change', () => { playing = wasPlaying; syncUI(actAt(frame)); });
  setupARLink();
  $('resetBtn').onclick = resetOrbit;
  buildTopics();
  addEventListener('keydown', (e) => {
    if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
    if (e.code === 'ArrowRight') setFrame(frame + (e.shiftKey ? 30 : 1));
    if (e.code === 'ArrowLeft') setFrame(frame - (e.shiftKey ? 30 : 1));
  });
}

// ---------------------------------------------------------------- topics: one film per textbook topic
const openFilm = (id) => { if (window.offlineGuard && !window.offlineGuard()) return; location.search = '?film=' + encodeURIComponent(id); };
function buildTopics() {
  // one tab per textbook unit; the list shows that unit's films, then its games
  const ol = $('topicList'), tabs = $('unitTabs');
  const fill = (unit) => {
    ol.textContent = '';
    for (const b of tabs.children) b.classList.toggle('on', b.dataset.unit === unit);
    $('chapter').textContent = (chapters.find((c) => c.id === unit) || chapters[0]).title;
    films.filter((f) => f.unit === unit).forEach((f, i) => {
      const li = document.createElement('li'), a = document.createElement('a');
      a.href = '?film=' + encodeURIComponent(f.id);
      a.className = f === film ? 'on' : '';
      a.innerHTML = `<b>${i + 1}</b><span></span><span class="pg"></span>`;
      a.children[1].textContent = f.title;
      a.children[2].textContent = f.pages ? 'p. ' + f.pages : '';
      li.appendChild(a); ol.appendChild(li);
    });
    const gl = document.createElement('li');               // the exercise as games (games.html?unit=N)
    gl.innerHTML = `<a href="games.html?unit=${unit.slice(1)}" class="games"><b>🎮</b><span>Games: practise the exercise</span><span class="pg">play</span></a>`;
    ol.appendChild(gl);
  };
  for (const c of chapters) {
    const b = document.createElement('button');
    b.dataset.unit = c.id; b.textContent = c.title.split('·')[0].trim();
    b.title = c.title; b.onclick = () => fill(c.id);
    tabs.appendChild(b);
  }
  tabs.hidden = chapters.length < 2;
  fill(film.unit);
  $('gamesBtn').href = 'games.html?unit=' + film.unit.slice(1);
  const show = (on) => { $('topics').hidden = !on; if (on) { playing = false; syncUI(actAt(frame)); } };
  $('topicsBtn').onclick = () => show(true);
  $('topicsClose').onclick = () => show(false);
  $('topics').addEventListener('click', (e) => { if (e.target === $('topics')) show(false); });
  buildCard();
}

// ---------------------------------------------------------------- start / end card
// Start: what the lesson is about (chapter, title, pages, its parts). End: watch again, practise, next lesson
// (the next lesson's name is not shown: the user didn't want the film to end on the next topic).
function buildCard() {
  const ch = chapters.find((c) => c.id === film.unit) || chapters[0];
  $('introIcon').textContent = ch.icon || '';
  $('introChapter').textContent = ch.title;
  $('introTitle').textContent = film.title;
  $('introPages').textContent = film.pages ? 'Book pages ' + film.pages : '';
  const names = meta.acts.map((a) => a.name).filter((n, i, all) => n && all.indexOf(n) === i);
  $('introActsHead').hidden = names.length < 2;
  names.slice(0, 10).forEach((n, i) => {
    const li = document.createElement('li');
    li.textContent = n; li.style.animationDelay = (0.25 + 0.12 * i) + 's';
    if (names.length > 1) $('introActs').appendChild(li);
  });
  $('introPlay').onclick = () => { if (!playing) togglePlay(); };
  $('againBtn').onclick = () => { setFrame(meta.frame_start); resetOrbit(true); if (!playing) togglePlay(); };
  // the game that practises THIS lesson (films.json `game`), not the games list
  $('practiseBtn').href = film.game ? 'games.html?game=' + film.game : 'games.html?unit=' + film.unit.slice(1);
  $('gamesBtn').href = $('practiseBtn').href;
  $('nextLessonBtn').hidden = !nextFilm;
  if (nextFilm) $('nextLessonBtn').onclick = () => openFilm(nextFilm.id);
  $('intro').addEventListener('click', (e) => {    // a tap beside the card: start the film / close the end card
    if (e.target !== $('intro') && !e.target.classList.contains('card')) return;
    if (!$('introEnd').hidden) hideCard(); else if (!playing) togglePlay();
  });
}
// The first frame where something of the film is actually on screen (films often open on an empty stage while the
// first object pops in): checked against the first shot's camera, ignoring captions.
function firstContentFrame() {
  const fr = new THREE.Frustum(), m4 = new THREE.Matrix4(), sph = new THREE.Sphere(), _P0 = new THREE.Vector3(), end = Math.min(meta.frame_end, meta.frame_start + 240);
  for (let f = meta.frame_start; f <= end; f += 2) {
    setFrame(f); root.updateMatrixWorld(true);
    const cam = activeFilmCam; fitCamera(cam); cam.updateMatrixWorld(true);
    fr.setFromProjectionMatrix(m4.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse));
    let seen = false;
    root.traverse((o) => {
      if (seen || !o.isMesh || o.userData.hud || o.parent?.userData.hud || !shownInWorld(o)) return;
      if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
      sph.copy(o.geometry.boundingSphere).applyMatrix4(o.matrixWorld);
      // big enough to read (not a tiny object still popping in): at least ~6 % of the view
      if (fr.intersectsSphere(sph) && sph.radius / Math.max(0.1, sph.center.distanceTo(cam.getWorldPosition(_P0))) > 0.06) seen = true;
    });
    if (seen) return f;
  }
  return meta.frame_start;
}
// Opening (user: a start card is distracting): the lesson's title fades in over the scene, then it simply plays.
// A tap skips it.
function titleMoment() {
  showCard('title');
  let done = false;
  const go = () => { if (done) return; done = true; hideCard(); if (!playing) togglePlay(); };
  setTimeout(go, 2300);
  $('intro').addEventListener('pointerdown', go, { once: true });
}
// Controls hide while playing and come back on pause or when the pointer moves (like a video player).
let idleT = 0;
function wake() {
  document.body.classList.remove('idle'); clearTimeout(idleT);
  idleT = setTimeout(() => { if (playing) document.body.classList.add('idle'); }, 2500);
}
for (const ev of ['pointermove', 'pointerdown', 'keydown']) addEventListener(ev, wake, { passive: true });
function showCard(kind) {
  $('intro').classList.toggle('titleOnly', kind === 'title');
  $('introStart').hidden = kind !== 'start';
  $('introEnd').hidden = kind !== 'end';
  $('introActsHead').hidden = kind !== 'start' || !$('introActs').children.length;
  $('introActs').hidden = kind !== 'start';
  $('intro').classList.remove('out');
  $('intro').hidden = false;
}
function hideCard() {
  if ($('intro').hidden) return;
  $('intro').classList.add('out');
  setTimeout(() => { if ($('intro').classList.contains('out')) $('intro').hidden = true; }, 450);
}

function togglePlay() {
  if (!playing && frame >= meta.frame_end) setFrame(meta.frame_start);
  playing = !playing;
  wake();
  if (playing) hideCard();
  syncUI(actAt(frame));
}

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
function syncUI(act) {
  $('scrub').value = Math.round(frame);
  $('clock').textContent = `${fmt(frame / meta.fps)} / ${fmt(meta.frame_end / meta.fps)}`;
  $('playBtn').textContent = playing ? '❚❚' : '▶';
  $('actname').textContent = act.name;
  for (const a of meta.acts) a.button?.classList.toggle('on', a === act);
}

function flashButton(id, text) {        // brief feedback on the button itself instead of a popup
  const b = $(id), old = b.textContent;
  b.textContent = text; setTimeout(() => { if (b.textContent === text) b.textContent = old; }, 2500);
}

// ---------------------------------------------------------------- native AR (Apple AR Quick Look)
let arLinkController;
function updateARLink() { arLinkController?.update(); }
function setupARLink() {
  arLinkController = createARLink({ link: $('arBtn'), text: $('arText'), getZone: () => actAt(frame).zone,
    files: meta.zones.map((z, i) => z.ar ?? ['ar/experiment.usdz', 'ar/inside_the_foil.usdz', 'ar/planetary_model.usdz'][i] ?? null),
    showMessage: (message) => flashButton('arText', message) });
}

// ---------------------------------------------------------------- guided camera: film path + your orbit
// The film camera keeps playing its Blender animation untouched; your offset (orbit around the shot's subject,
// zoom and pan) is layered on top; it stays across camera cuts (pan restarts) until ↺ or a double-tap.
const ZERO = { yaw: 0, pitch: 0, dist: 1, panX: 0, panY: 0 };
const orbit = { target: { ...ZERO }, cur: { ...ZERO } };
const LIMITS = { dist: [0.15, 3], pan: 1.2, pitchMax: 1.5 };
const pointers = new Map();
let pinch0 = 0, dist0 = 1, mid0 = null, pan0 = null, at0 = null, lastTap = 0;
const canvas = renderer.domElement;
canvas.style.touchAction = 'none';
canvas.addEventListener('contextmenu', (e) => e.preventDefault());   // right-drag pans
// iPad Safari's own pinch-to-zoom-the-page gesture fights ours: block it
for (const ev of ['gesturestart', 'gesturechange', 'gestureend']) document.addEventListener(ev, (e) => e.preventDefault(), { passive: false });

const midpoint = () => { const [a, b] = [...pointers.values()]; return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, d: Math.hypot(a.x - b.x, a.y - b.y) }; };
canvas.addEventListener('pointerdown', (e) => {
  canvas.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 2) {                      // two fingers: pinch = zoom toward the subject, drag = pan
    const m = midpoint();
    pinch0 = Math.max(m.d, 1); dist0 = orbit.target.dist;
    mid0 = m; pan0 = { x: orbit.target.panX, y: orbit.target.panY }; at0 = cursorOffset(m.x, m.y);
  }
  if (pointers.size === 1) tap0 = { x: e.clientX, y: e.clientY, t: performance.now(), moved: false };
  else tap0 = null;                               // a second finger: a pinch, never a tap
});
const endPointer = (e) => { pointers.delete(e.pointerId); if (pointers.size < 2) mid0 = null; };
canvas.addEventListener('pointerup', (e) => {
  const tap = tap0 && !tap0.moved && pointers.size === 1 && performance.now() - tap0.t < 350 && e.button === 0;
  endPointer(e);
  if (tap) onTap(e.clientX, e.clientY);
});
canvas.addEventListener('pointercancel', endPointer);
canvas.addEventListener('pointermove', (e) => {
  const p = pointers.get(e.pointerId);
  if (!p) return;
  const dx = e.clientX - p.x, dy = e.clientY - p.y;
  p.x = e.clientX; p.y = e.clientY;
  if (tap0 && Math.hypot(e.clientX - tap0.x, e.clientY - tap0.y) > 10) tap0.moved = true;   // a drag, not a tap
  const t = orbit.target;
  if (pointers.size === 1 && !mid0 && (e.buttons & 6 || e.shiftKey)) {   // mouse: right / middle drag or shift-drag = pan
    const lim = panLimit(t.dist);
    t.panX = THREE.MathUtils.clamp(t.panX - dx / innerHeight / t.dist, -lim, lim);
    t.panY = THREE.MathUtils.clamp(t.panY + dy / innerHeight / t.dist, -lim, lim);
  } else if (pointers.size === 1 && !mid0) {      // one finger: orbit (drag right turns the model right)
    t.yaw += dx * 0.005;
    t.pitch = THREE.MathUtils.clamp(t.pitch + dy * 0.004, -LIMITS.pitchMax, LIMITS.pitchMax);
  } else if (pointers.size === 2 && mid0) {
    const m = midpoint();
    const d1 = THREE.MathUtils.clamp(dist0 * pinch0 / Math.max(m.d, 1), ...LIMITS.dist);
    zoomAbout(at0, dist0, d1, { x: pan0.x - (m.x - mid0.x) / innerHeight / d1, y: pan0.y + (m.y - mid0.y) / innerHeight / d1 });
  }
  dirty = true;
});
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const t = orbit.target, d0 = t.dist;
  zoomAbout(cursorOffset(e.clientX, e.clientY), d0, THREE.MathUtils.clamp(d0 * Math.exp(e.deltaY * 0.001), ...LIMITS.dist),
    { x: t.panX, y: t.panY });
  dirty = true;
}, { passive: false });

// ---------------------------------------------------------------- video-style taps (the 3D drag still orbits)
// tap = pause / play · double-tap left third = back 5 s · right third = forward 5 s · middle = back to the film view
const SKIP_S = 5;
let tap0 = null, tapTimer = 0, lastTapAt = 0;
function onTap(x, y) {
  const now = performance.now(), r = canvas.getBoundingClientRect(), side = (x - r.left) / r.width;
  if (now - lastTapAt < 300) {                    // second tap of a double-tap
    clearTimeout(tapTimer); lastTapAt = 0;
    if (side < 1 / 3) { seek(-SKIP_S); tapFx(x, y, '« ' + SKIP_S + ' s'); }
    else if (side > 2 / 3) { seek(SKIP_S); tapFx(x, y, SKIP_S + ' s »'); }
    else { resetOrbit(); tapFx(x, y, '↺'); }
    return;
  }
  lastTapAt = now;
  tapTimer = setTimeout(() => { togglePlay(); tapFx(x, y, playing ? '▶' : '❚❚'); }, 300);
}
function seek(s) {
  if (!$('intro').hidden) hideCard();
  setFrame(frame + s * meta.fps);
}
function tapFx(x, y, text) {
  const fx = $('tapfx');
  fx.textContent = text; fx.style.left = x + 'px'; fx.style.top = y + 'px';
  fx.classList.remove('show'); void fx.offsetWidth; fx.classList.add('show');
}
canvas.addEventListener('dblclick', (e) => e.preventDefault());

// zoom toward a point on screen: the spot under the mouse / between the fingers stays put while the view zooms
// (pan is in units of the camera distance, so a point at screen offset c keeps (pan + c) · dist constant)
function cursorOffset(x, y) {
  const r = canvas.getBoundingClientRect(), e = viewCam.projectionMatrix.elements;
  const nx = ((x - r.left) / r.width) * 2 - 1, ny = 1 - ((y - r.top) / r.height) * 2;
  return { x: (nx + e[8]) / e[0], y: (ny + e[9]) / e[5] };
}
const panLimit = (d) => Math.max(0.3, LIMITS.pan + 0.45 * (1 / d - 1));   // zoomed in, you may slide further (still not off the subject)
function zoomAbout(c, d0, d1, base) {
  const t = orbit.target, lim = panLimit(d1), k = d0 / d1;
  t.dist = d1;
  t.panX = THREE.MathUtils.clamp((base.x + c.x) * k - c.x, -lim, lim);
  t.panY = THREE.MathUtils.clamp((base.y + c.y) * k - c.y, -lim, lim);
}

function resetOrbit(instant = false) {
  Object.assign(orbit.target, ZERO);
  if (instant) Object.assign(orbit.cur, ZERO);
  dirty = true;
}

const UP = new THREE.Vector3(0, 1, 0), _axis = new THREE.Vector3(), _qy = new THREE.Quaternion(), _qp = new THREE.Quaternion();
const _S = new THREE.Vector3(), _P = new THREE.Vector3(), _Q = new THREE.Quaternion(), _rel = new THREE.Vector3();
const _right = new THREE.Vector3(), _up = new THREE.Vector3();
// camera blocking: never below the bench top (apparatus) / below the display (atom scenes); per zone, in scene
// units relative to the subject (film JSON zones[i].min_height)
const minHeight = (zone) => meta.zones[zone]?.min_height ?? [0.2, -6, -6][zone] ?? -6;
function updateView() {
  let moving = false;
  for (const k of Object.keys(ZERO)) {            // ease your offset (smooth, and the loop idles once settled)
    const d = orbit.target[k] - orbit.cur[k];
    if (Math.abs(d) > 1e-4) { orbit.cur[k] += d * 0.35; moving = true; } else orbit.cur[k] = orbit.target[k];
  }
  const film = activeFilmCam;
  fitCamera(film);
  film.updateMatrixWorld();
  film.getWorldPosition(_P);
  film.getWorldQuaternion(_Q);
  const subj = meta.camera_subject?.[film.name];
  // orbit centre: the film's subject (film 01), else whatever sits in the middle of this shot (topic films store
  // the scene origin for every camera, and their shots sit far from it: orbiting there swung the view away)
  if (subj && subj.some((v) => Math.abs(v) > 1e-6)) _S.copy(root.localToWorld(tmpV.fromArray(subj)));
  else _S.copy(_P).addScaledVector(_fwd.set(0, 0, -1).applyQuaternion(_Q), shotDepth(film));
  _rel.subVectors(_P, _S);
  const r = _rel.length() * orbit.cur.dist;
  // a slide (pan) moves the orbit centre too, so you turn around the part you slid to, not the middle of the shot
  _right.set(1, 0, 0).applyQuaternion(_Q);
  _up.set(0, 1, 0).applyQuaternion(_Q);
  _S.addScaledVector(_right, orbit.cur.panX * r).addScaledVector(_up, orbit.cur.panY * r);

  // elevation after your tilt, clamped so the camera stays above the table / display
  const elev0 = Math.asin(THREE.MathUtils.clamp(_rel.y / _rel.length(), -1, 1));
  const zone = actAt(frame).zone;
  const minElev = Math.asin(THREE.MathUtils.clamp(minHeight(zone) / r, -1, 1));
  const elev = THREE.MathUtils.clamp(elev0 + orbit.cur.pitch, Math.max(minElev, -1.3), 1.35);
  _axis.crossVectors(_rel, UP).normalize();
  _qy.setFromAxisAngle(UP, -orbit.cur.yaw);   // drag right turns the model right
  _qp.setFromAxisAngle(_axis, elev - elev0);
  tmpQ.multiplyQuaternions(_qy, _qp);
  viewCam.position.copy(_rel.applyQuaternion(tmpQ).multiplyScalar(orbit.cur.dist)).add(_S);
  viewCam.quaternion.multiplyQuaternions(tmpQ, _Q);

  const floorY = _S.y + minHeight(zone);
  if (viewCam.position.y < floorY) viewCam.position.y = floorY;

  viewCam.near = film.near; viewCam.far = film.far;
  viewCam.projectionMatrix.copy(film.projectionMatrix);          // same lens, lens shift and eye-trace point
  hudCam.projectionMatrix.copy(film.projectionMatrix);           // captions: the film's own framing
  hudCam.projectionMatrixInverse.copy(film.projectionMatrixInverse);
  const fitT = shotFit(film);                                     // the 3D picture: fitted clear of the caption band
  if (fitT) viewCam.projectionMatrix.premultiply(fitT);
  viewCam.projectionMatrixInverse.copy(viewCam.projectionMatrix).invert();
  viewCam.updateMatrixWorld();
  hudCam.position.copy(viewCam.position); hudCam.quaternion.copy(viewCam.quaternion); hudCam.updateMatrixWorld();

  // on-screen captions of the close-up stay in front of *your* view
  tmpM.copy(film.matrixWorld).invert().multiply(viewCam.matrixWorld);
  tmpM.decompose(tmpV, tmpQ, _P);
  for (const h of huds) {
    if (!h.visible) continue;
    h.position.fromArray(h.userData.hud).applyMatrix4(tmpM);
    h.quaternion.multiplyQuaternions(tmpQ, HUD_Q);
  }
  $('resetBtn').hidden = Object.keys(ZERO).every((k) => Math.abs(orbit.target[k] - ZERO[k]) < 0.01);
  return moving;
}

// how far ahead of a film camera its subject is: the first thing on screen straight ahead (worked out once per shot)
const _fwd = new THREE.Vector3(), _ray = new THREE.Raycaster(), _c = new THREE.Vector3(), _sph = new THREE.Sphere();
function shownInWorld(o) {
  for (let p = o; p; p = p.parent) if (!p.visible || Math.abs(p.scale.x) < 1e-3) return false;
  return true;
}
function shotDepth(cam) {
  // while you aren't turning the view the centre doesn't change the picture, so keep it up to date (things pop in
  // after a cut); once you turn, it stays put so the view can't jump
  const idle = Object.keys(ZERO).every((k) => orbit.target[k] === ZERO[k] && Math.abs(orbit.cur[k] - ZERO[k]) < 1e-3);
  if (cam.userData.depth && !(idle && Math.abs(frame - cam.userData.depthAt) > 15)) return cam.userData.depth;
  cam.userData.depthAt = frame;
  root.updateMatrixWorld();
  _ray.setFromCamera({ x: 0, y: 0 }, cam);
  const hit = _ray.intersectObject(root, true).find((h) => h.object.isMesh && !h.object.userData.hud && shownInWorld(h.object));
  let d = hit?.distance;
  if (!d) {                                       // nothing dead ahead: the middle depth of what is in view
    const depths = [], fwd = _fwd.set(0, 0, -1).applyQuaternion(cam.getWorldQuaternion(tmpQ)), pos = cam.getWorldPosition(_c.clone());
    root.traverse((o) => {
      if (!o.isMesh || !o.geometry || o.userData.hud || !shownInWorld(o)) return;
      if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
      _sph.copy(o.geometry.boundingSphere).applyMatrix4(o.matrixWorld);
      const z = _c.copy(_sph.center).sub(pos).dot(fwd);
      if (z > cam.near * 4) depths.push(z);
    });
    depths.sort((a, b) => a - b);
    d = depths[depths.length >> 1] || 10;
  }
  return (cam.userData.depth = d);
}

// ---------------------------------------------------------------- captions never cover the 3D picture
// User: "2D text overlaps the 3D scene, or the scene is cut at the edges". Captions (HUD text) are drawn in a second
// pass with the film's own framing; the 3D picture of each shot is measured over the whole shot and, only if it would
// run into the caption band or past the frame edges, scaled down / moved so it fits the clear area above the band.
const hudCam = new THREE.PerspectiveCamera(); hudCam.layers.set(1);
const isHud = (o) => { for (let p = o; p && p !== root; p = p.parent) if (p.userData.hud) return true; return false; };
function splitCaptions() {
  for (const h of huds) h.traverse((m) => m.layers.set(1));
  scene.traverse((o) => { if (o.isLight) o.layers.enable(1); });   // captions keep their lighting in their own pass
}
function drawCaptions() {
  if (!huds.some((h) => h.visible)) return;
  const bg = scene.background; scene.background = null;
  renderer.autoClear = false; renderer.clearDepth(); renderer.render(scene, hudCam); renderer.autoClear = true;
  scene.background = bg;
}
const FIT_EDGE = 0.92, BAND = -0.40;                 // frame NDC: keep inside ±0.92; captions live below y = -0.40
const shotFits = new Map();
function shotFit(cam) {
  if (shotFits.has(cam)) return shotFits.get(cam);
  shotFits.set(cam, null);                       // (re-entrancy guard while measuring)
  // the raw film frame (16:9, the film's lens shift) for measuring
  const fc = new THREE.PerspectiveCamera(THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(hfov.get(cam) / 2) * 9 / 16)), 16 / 9, cam.near, cam.far);
  fc.updateProjectionMatrix();
  const sh = meta.camera_shift?.[cam.name]; if (sh) { fc.projectionMatrix.elements[8] = 2 * sh[0]; fc.projectionMatrix.elements[9] = 2 * sh[1] * 16 / 9; }
  const cuts = meta.cuts.map((c, i) => [c, meta.cuts[i + 1]?.frame ?? meta.frame_end + 1]).filter(([c]) => filmCams[THREE.PropertyBinding.sanitizeNodeName(c.camera)] === cam);
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, captions = false;
  const v = new THREE.Vector3(), bb = new THREE.Box3(), keep = frame;
  for (const [c, end] of cuts) for (let k = 0; k <= 10; k++) {
    const f = c.frame + Math.round((end - 1 - c.frame) * k / 10);
    mixer.setTime(f / meta.fps); root.updateMatrixWorld(true); cam.updateMatrixWorld(true);
    fc.matrixWorld.copy(cam.matrixWorld); fc.matrixWorldInverse.copy(cam.matrixWorld).invert();
    if (huds.some((h) => h.userData.cam === cam && h.scale.x > 0.05)) captions = true;
    root.traverse((o) => {
      if (!o.isMesh || isHud(o) || !shownInWorld(o)) return;
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
      bb.copy(o.geometry.boundingBox);
      for (let q = 0; q < 8; q++) {
        v.set(q & 1 ? bb.max.x : bb.min.x, q & 2 ? bb.max.y : bb.min.y, q & 4 ? bb.max.z : bb.min.z).applyMatrix4(o.matrixWorld);
        v.applyMatrix4(fc.matrixWorldInverse); if (v.z > -fc.near) return;          // behind the lens: not on screen
        v.applyMatrix4(fc.projectionMatrix);
        if (Math.abs(v.x) > 3 || Math.abs(v.y) > 3) return;                           // far off-frame (other stations)
        x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x); y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y);
      }
    });
  }
  mixer.setTime(keep / meta.fps); root.updateMatrixWorld(true);
  if (!(x1 > x0)) return null;
  const lo = captions ? BAND : -FIT_EDGE;
  if (x0 >= -FIT_EDGE && x1 <= FIT_EDGE && y0 >= lo && y1 <= FIT_EDGE) return null;         // already clean: leave it alone
  const s = Math.max(0.55, Math.min(1, (2 * FIT_EDGE) / (x1 - x0), (FIT_EDGE - lo) / (y1 - y0)));
  const fitAxis = (a, b, l, h) => { let t = 0; if (s * a + t < l) t = l - s * a; if (s * b + t > h) t = h - s * b;
    if (s * a + t < l) t = (l + h) / 2 - s * (a + b) / 2; return t; };
  const tx = fitAxis(x0, x1, -FIT_EDGE, FIT_EDGE), ty = fitAxis(y0, y1, lo, FIT_EDGE);
  // frame NDC -> screen NDC (the frame sits in the safe area): x_s = x_f·fw/W, y_s = y_f·fh/H − cy
  const W = innerWidth, H = viewH(), fw = Math.min(W - 2 * SAFE.side, (H - SAFE.top - SAFE.bottom) * 16 / 9), fh = fw * 9 / 16;
  const cy = isAR() ? 0 : (SAFE.bottom - SAFE.top) / H;
  const bx = tx * fw / W, by = (s - 1) * cy + ty * fh / H;
  const T = new THREE.Matrix4().set(s, 0, 0, bx, 0, s, 0, by, 0, 0, 1, 0, 0, 0, 0, 1);   // clip' = T · clip
  shotFits.set(cam, T);
  return T;
}
addEventListener('resize', () => { shotFits.clear(); inkResize(innerWidth, viewH(), renderer.getPixelRatio()); });
inkResize(innerWidth, viewH(), renderer.getPixelRatio());

// The film's whole 16:9 frame always fits inside a SAFE area of the screen, clear of the floating buttons at the top
// and the play bar at the bottom (user: captions must never be covered, nothing cut at the edges), on any screen.
const SAFE = { top: 64, bottom: 92, side: 12 };
function fitCamera(cam) {
  const W = innerWidth, H = viewH(), ar = isAR();
  const sw = W - (ar ? 0 : 2 * SAFE.side), sh = H - (ar ? 0 : SAFE.top + SAFE.bottom);
  const fw = Math.min(sw, sh * 16 / 9), fh = fw * 9 / 16;            // the film frame in screen pixels
  const key = W + 'x' + H + (ar ? 'ar' : '');
  if (cam.userData.fitKey === key) return;                           // once per camera and screen shape
  cam.userData.fitKey = key;
  const tw = Math.tan(hfov.get(cam) / 2);                            // film: half-width tangent
  cam.aspect = W / H;
  cam.fov = THREE.MathUtils.radToDeg(2 * Math.atan(tw * (9 / 16) * (H / fh)));
  cam.updateProjectionMatrix();
  // centre the frame in the safe area (top and bottom margins differ) + Blender lens shift (in film widths)
  const s0 = meta.camera_shift?.[cam.name] || [0, 0];
  const cy = ar ? 0 : (SAFE.bottom - SAFE.top) / H;                  // NDC offset of the safe area's centre
  cam.projectionMatrix.elements[8] = (2 * s0[0] * fw) / W;
  cam.projectionMatrix.elements[9] = (2 * s0[1] * fw) / H - cy;
  cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
}

// ---------------------------------------------------------------- depth of field (only where it really shows)
function dofFor(film) {
  const d = meta.camera_dof?.[film.name];
  if (!d) return null;
  viewCam.getWorldPosition(tmpV);
  const S = d.focus ? tmpV.distanceTo(root.localToWorld(new THREE.Vector3().fromArray(d.focus))) : d.focus_distance;
  const f = d.lens / 1000, sensor = d.sensor / 1000;
  // circle of confusion per unit depth, as a fraction of frame width: f^2 / (N (S - f)) / S / sensor
  const aperture = (f * f) / (d.fstop * Math.max(S - f, 1e-3)) / S / sensor;
  if (aperture * S < 0.004) return null;       // blur too small to see: skip the extra pass (keeps the iPad cool)
  return { S, aperture };
}

// ---------------------------------------------------------------- frame loop: 30 fps, idle when nothing changes
let fires = [];
let lastDraw = -1, lastRefresh = -1;
const FRAME_MS = 1000 / 30;
function fitView() {
  renderer.domElement.style.marginTop = viewTop() + 'px';
  if (renderer.domElement.height === Math.round(viewH() * renderer.getPixelRatio()) && renderer.domElement.clientWidth === innerWidth) return;
  renderer.setSize(innerWidth, viewH());
  composer.setSize(innerWidth, viewH());
  dirty = true;
}
addEventListener('resize', fitView);
new ResizeObserver(fitView).observe(document.getElementById('controls'));   // the play bar can grow (act buttons wrap)
new MutationObserver(fitView).observe(document.body, { attributes: true, attributeFilter: ['class'] });   // AR on/off
function tick(time) {
  if (lastDraw >= 0 && time - lastDraw < FRAME_MS - 2) return;
  const dt = lastDraw < 0 ? 0 : Math.min((time - lastDraw) / 1000, 0.1);
  lastDraw = time;
  try {
    if (playing) {
      setFrame(frame + dt * meta.fps * speed * (inStill(frame) ? STILL_RATE : 1));
      if (frame >= meta.frame_end) { playing = false; syncUI(actAt(frame)); showCard('end'); }
    }
    // fires flicker even while paused (only the ones on screen do any work)
    for (const f of fires) if (shownInWorld(f)) { f.userData.fx.update(dt || 1 / 30, viewCam.position); dirty = true; }
    // paused and still: keep the last picture (GPU idle); refresh it once a second so it can never go blank
    if (!dirty && !playing && time - lastRefresh < 1000) return;
    lastRefresh = time;
    const easing = updateView();
    dirty = easing;
    viewCam.getWorldQuaternion(tmpQ);
    for (const b of billboards) b.quaternion.copy(tmpQ);
    drawOrbitTrails();
    const dof = dofFor(activeFilmCam);
    if (dof) {
      bokeh.uniforms.focus.value = dof.S;
      bokeh.uniforms.aperture.value = dof.aperture;
      bokeh.uniforms.nearClip.value = viewCam.near;
      bokeh.uniforms.farClip.value = viewCam.far;
      composer.render();
    } else {
      renderer.render(scene, viewCam);
    }
    drawCaptions();
  } catch (err) {
    showError('Frame error: ' + describe(err));
  }
}

load().catch((e) => showError('Failed to load: ' + describe(e)));
