// Electron Trails (Unit 2, film 05; book p.49-50, Fig 2.8). Kept simple: one idea per screen, smooth shapes like the
// book's Fig 2.8, ONE electron per shape with a short comet tail going round in calm laps (never popping, never
// touching the nucleus). Book: the electron revolves round the nucleus in a fixed shell; "a subshell is the area in
// which electron moves within a shell". Sizes: every sub-shell fits inside its own shell's ring (K < L < M).
//   🔭 Look: K L M rings; switch sub-shells on: each stays inside its own shell, so shells never swap or clash.
//   🏠 Which shell? a shape with its electron; tap the ring it fits (the number in 2p = shell 2 = L).
//   🔷 Which shape? only the electron's tail traces the area; pick ball / dumbbell / clover (later: turned views).
import { THREE, $, params, sfx, confetti, progress, starStr, sleep, goalBar, popIn, tween, M, ball, ring, ringMat, COLORS } from './kit.js';
import { modal, closeModal } from './atomlab.js';
import { Mover, laps } from './cloud3d.js';

const PARTS = [{ key: 'look', icon: '🔭', name: 'Look' }, { key: 'shell', icon: '🏠', name: 'Which shell?' },
  { key: 'shape', icon: '🔷', name: 'Which shape?' }];
const RS = [0.95, 1.85, 2.75];                          // rings K, L, M
const V = (x, y, z) => new THREE.Vector3(x, y, z).normalize();
// lobe directions (each also has its opposite): p = 1 axis, d = 2 diagonals
const AX = { py: [V(0, 1, 0)], px: [V(1, 0, 0)], pz: [V(0, 0, 1)],
  dxy: [V(1, 1, 0), V(-1, 1, 0)], dax: [V(1, 0, 0), V(0, 1, 0)] };
const both = (ds) => ds.flatMap((d) => [d, d.clone().negate()]);
const SUBS = { '1s': [1, 's'], '2s': [2, 's'], '2p': [2, 'p', 'py'], '3s': [3, 's'], '3p': [3, 'p', 'px'], '3d': [3, 'd', 'dxy'] };
const SHELL_ROUNDS = ['2p', '1s', '3d', '2s', '3p'];
const SHAPE_ROUNDS = [{ a: 's' }, { a: 'p', o: 'py' }, { a: 'd', o: 'dxy' }, { a: 'p', o: 'px' }, { a: 'd', o: 'dax' },
  { a: 'p', o: 'pz' }];                                // last: the dumbbell points at you (turn the atom to see it)
const NAME = { s: 'ball', p: 'dumbbell', d: 'clover' };

function nucleus() {
  const g = new THREE.Group();
  [[0.08, 0, 0, 'p'], [-0.08, 0.02, 0.04, 'n'], [0.02, 0.09, -0.04, 'n'], [-0.02, -0.08, 0.03, 'p']]
    .forEach(([x, y, z, t]) => { const b = ball(t === 'p' ? M.proton : M.neutron, 0.09); b.position.set(x, y, z); g.add(b); });
  return g;
}
// the smooth shape (book Fig 2.8 look), sized to fit inside ring R
function shape(a, o, R, color) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.35, roughness: 0.5,
    transparent: true, opacity: 0.3, depthWrite: false });
  if (a === 's') { g.add(ball(mat, R * 0.92)); return g; }
  const [c, h, w] = a === 'p' ? [0.5, 0.46, 0.3] : [0.56, 0.4, 0.21];
  for (const d of both(AX[o])) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), mat);
    m.scale.set(w * R, h * R, w * R); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
    m.position.copy(d).multiplyScalar(c * R); g.add(m);
  }
  return g;
}
// its electron: calm laps inside the shape (s: round the nucleus; p, d: inside a lobe, now and then to the next lobe)
function lapsOf(a, o, R, stay) {
  if (a === 's') return laps({ sample: () => new THREE.Vector3(R * (0.5 + 0.38 * Math.random()), 0, 0), avoid: 0.3 });
  return laps({ lobes: both(AX[o]), c: (a === 'p' ? 0.5 : 0.56) * R, rho: (a === 'p' ? 0.26 : 0.17) * R, avoid: 0.3, stretch: 0.5, stay });
}

export function start({ stage, ui, level }) {
  ui.innerHTML = '<div class="levels" id="levels"></div><div class="goalbar" id="goal"></div><div class="choices" id="ch"></div>';
  const B = goalBar($('goal'));
  let part = PARTS.findIndex((p) => p.key === params.get('part')), frameFn = null, tapFn = null, G = null;
  if (part < 0) part = 0;
  const setTap = (f) => { tapFn = f; stage.onTap = f; };
  const onFrame = (f) => { if (frameFn) stage.offFrame(frameFn); frameFn = f; stage.onFrame(f); };
  const res = [];
  function clear() {
    stage.clearTags(); stage.clearRoot(); setTap(null); $('ch').innerHTML = ''; $('ch').onclick = null;
    if (frameFn) { stage.offFrame(frameFn); frameFn = null; }
  }
  function scene(withRings = true) {
    stage.camera.position.set(0, 0.5, 12); stage.controls.target.set(0, 0.4, 0); stage.controls.update();
    G = new THREE.Group(); G.position.y = 0.4; stage.root.add(G); G.add(nucleus());
    if (!withRings) return [];
    return RS.map((R, k) => {
      const t = ring(R, ringMat(0x8fb8ff, 0.5), 0.02); G.add(t);
      stage.tag(`<b>${'KLM'[k]}</b>`, G, [R * 0.72 + 0.15, R * 0.72 + 0.15, 0], 'big');
      return t;
    });
  }
  // one electron with a short comet tail
  const electron = (a, o, R, color, tail = 0.35, stay) => {
    const m = new Mover(G, lapsOf(a, o, R, stay), new THREE.Color(color).multiplyScalar(1.4), { N: 1500, size: 0.08, r: 0.1 });
    return { m, step: (dt, speed = 2.6) => m.move(dt, speed, tail) };
  };
  const rdots = (n, k) => ({ dots: Array.from({ length: n }, (_, q) => (q === k ? 'on' : res[q] === true ? 'ok' : res[q] === false ? 'no' : '')) });
  function tabs() {
    const s = progress.get('cloud');
    const won = { look: s.look, shell: s.h4, shape: s.p5 };
    $('levels').innerHTML = PARTS.map((p, j) => `<button class="lv part${j === part ? ' on' : ''}${won[p.key] ? ' won' : ''}" data-p="${j}">${p.icon} ${p.name}</button>`).join('');
  }
  $('levels').onclick = (ev) => { const b = ev.target.closest('[data-p]'); if (b) load(+b.dataset.p); };
  function load(j, k = 0) {
    part = j; tabs(); clear();
    const key = PARTS[j].key;
    history.replaceState(null, '', `?game=cloud&part=${key}&level=${k}`);
    if (k === 0) res.length = 0;
    if (key === 'look') look(); else if (key === 'shell') whichShell(k); else whichShape(k);
  }
  function end(j, n, text) {
    const score = res.filter(Boolean).length;
    sfx.win(); confetti(stage, new THREE.Vector3(0, 0, 0), 120);
    modal(`<div class="stars">${starStr(score >= n ? 3 : score >= n - 2 ? 2 : 1)}</div><h2>${score} / ${n} right first time</h2>
      <p>${text}</p><div class="row"><button id="mAgain">↺ Play again</button><button id="mNext">Next part →</button></div>`);
    $('mAgain').onclick = () => { closeModal(); load(j, 0); };
    $('mNext').onclick = () => { closeModal(); load((j + 1) % PARTS.length, 0); };
  }

  // ---------------------------------------------------------------- 🔭 look: sub-shells stay inside their shells
  function look() {
    scene();
    const on = new Map(), seen = new Set();
    let won = false;
    const draw = () => B.draw([{ text: 'Switch on a sub-shell of each shell:', bold: true },
      ...['K', 'L', 'M'].map((s, k) => ({ text: s, tick: seen.has(k + 1) }))]);
    $('ch').innerHTML = Object.keys(SUBS).map((k) => `<button data-s="${k}">${k}</button>`).join('');
    $('ch').onclick = (ev) => {
      const b = ev.target.closest('[data-s]'); if (!b) return;
      const k = b.dataset.s, [n, a, o] = SUBS[k], R = RS[n - 1];
      if (on.has(k)) { const x = on.get(k); G.remove(x.g); x.e.m.dispose(); stage.untag(x.t); on.delete(k); b.className = ''; sfx.pop(); return; }
      const g = shape(a, o, R, COLORS[a]); G.add(g); popIn(g, 1, 0.4);
      const e = electron(a, o, R, COLORS[a]);
      const t = stage.tag(`<b>${k}</b>`, G, a === 's' ? [-R * 0.7 - 0.2, -R * 0.7 - 0.2, 0] : AX[o][0].clone().multiplyScalar(R + 0.3).toArray(), 'big');
      on.set(k, { g, e, t }); b.className = 'on'; sfx.pop();
      seen.add(n); draw();
      if (seen.size === 3 && !won) {
        won = true; progress.set('cloud', 'look', 3); tabs(); sfx.win();
        B.draw([{ text: 'Each sub-shell stays inside its own shell', bold: true, color: '#ffc061' }]);
      }
    };
    onFrame((dt) => { for (const x of on.values()) x.e.step(dt); });
    draw();
  }

  // ---------------------------------------------------------------- 🏠 which shell does this sub-shell belong to?
  function whichShell(k) {
    const tori = scene(), sub = SHELL_ROUNDS[k], [n, a, o] = SUBS[sub], R = RS[n - 1];
    tori.forEach((t, q) => { const h = new THREE.Mesh(new THREE.TorusGeometry(RS[q], 0.28, 6, 64), M.hit); h.userData.shell = q + 1; G.add(h); stage.pickable(h); });
    const g = shape(a, o, R, COLORS[a]); G.add(g); popIn(g, 1, 0.4);
    const e = electron(a, o, R, COLORS[a]);
    onFrame((dt) => e.step(dt));
    let first = true, busy = false;
    B.draw([{ text: 'Which shell is this sub-shell in?', bold: true }, rdots(SHELL_ROUNDS.length, k)]);
    setTap(async (h) => {
      if (busy || !h || !h.obj || !h.obj.userData.shell) return;
      const q = h.obj.userData.shell, t = tori[q - 1];
      if (q !== n) { first = false; sfx.buzz(); await tween(0.35, (u) => t.scale.setScalar(1 + Math.sin(u * 25) * 0.03 * (1 - u))); t.scale.setScalar(1); return; }
      busy = true; res[k] = res[k] ?? first; if (first) progress.set('cloud', 'h' + k, 3); tabs();
      t.material = ringMat(0xffc061, 0.95); sfx.ding(); confetti(stage, new THREE.Vector3(0, 1, 0), first ? 50 : 20);
      // why: its name says its shell (the number) and its shape (the letter)
      B.draw([{ text: `${sub} = the ${a} sub-shell of shell ${'KLM'[n - 1]}`, bold: true, color: '#ffc061' }, rdots(SHELL_ROUNDS.length, k)]);
      await sleep(2.8);
      if (k < SHELL_ROUNDS.length - 1) load(part, k + 1);
      else end(part, SHELL_ROUNDS.length, 'The number tells the shell (1 = K, 2 = L, 3 = M). Each sub-shell fits inside its own shell.');
    });
  }

  // ---------------------------------------------------------------- 🔷 which shape does the electron's tail trace?
  function whichShape(k) {
    scene(false);
    const r = SHAPE_ROUNDS[k], R = RS[1];
    G.add(ring(R, ringMat(0x8fb8ff, 0.3), 0.016));
    if (r.o === 'pz') G.rotation.x = 0.4;             // nearly end-on, tilted a little: turn the atom to see it
    const e = electron(r.a, r.o, R, COLORS.s, 6, [0.8, 0.6]);   // same colour for all: the answer is in the path, not the colour
    onFrame((dt) => e.step(dt, 8));
    B.draw([{ text: 'What shape is the electron tracing?', bold: true }, rdots(SHAPE_ROUNDS.length, k)]);
    $('ch').innerHTML = ['s', 'p', 'd'].map((s) => `<button data-a="${s}">${s} · ${NAME[s]}</button>`).join('');
    let first = true, busy = false;
    $('ch').onclick = async (ev) => {
      const b = ev.target.closest('[data-a]'); if (!b || busy || b.disabled) return;
      if (b.dataset.a !== r.a) { first = false; sfx.buzz(); b.disabled = true; b.className = 'wrong'; return; }
      busy = true; res[k] = res[k] ?? first; if (first) progress.set('cloud', 'p' + k, 3); tabs();
      b.className = 'on'; sfx.ding(); confetti(stage, new THREE.Vector3(0, 1, 0), first ? 50 : 20);
      // why: the smooth shape appears round the path; an end-on dumbbell turns to show its side
      const g = shape(r.a, r.o, R, COLORS[r.a]); G.add(g); popIn(g, 1, 0.5);
      if (r.o === 'pz') await tween(1.2, (t) => { G.rotation.x = 0.4 + (Math.PI / 2 - 0.4) * t; });
      await sleep(2.6);
      if (k < SHAPE_ROUNDS.length - 1) load(part, k + 1);
      else end(part, SHAPE_ROUNDS.length, 'Moving in its area, the electron traces the sub-shell: s a ball, p a dumbbell, d a clover.');
    };
  }

  const find = (q) => { let f = null; stage.root.traverse((o) => { if (!f && Object.keys(q).every((k) => o.userData[k] === q[k])) f = o; }); return f; };
  const api = { load, tap: (q) => tapFn && tapFn({ obj: find(q) }) };
  load(part, Number.isFinite(level) ? Math.max(0, level) : 0);
  return api;
}
