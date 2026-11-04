// Light Jumps (Bohr, p.45: ΔE = E₂ − E₁ = hν). Tap a shell: the electron jumps. Up = it takes in light; down = it
// gives out light. A bigger jump = more energy = shorter wiggles (higher ν) = bluer light.
// Shell colours follow the electron: every shell shows the colour of the light you would get by jumping to it from
// where the electron is now (faint lilac = ultraviolet, dark red = infrared: both invisible to us).
// No side panel: goals and checklists stand on a board in the 3D scene (kit.board); buttons sit next to what they do.
// Parts: 💡 explore the prism bench (badge) → 🎨 try → 🎮 a 13-round game in 3 stages (learn with colours + hints, then grey shells; nothing new after stage 1;
// twists), one reward at the end → 🏆 quiz.
import { THREE, $, sfx, confetti, progress, starStr, tween, sleep, ease, M, ball, glow, glowTexture, ring, ringMat,
  goalBar } from './kit.js';
import { modal, closeModal } from './atomlab.js';
import { createPrismBench } from './prism.js';

const NMAX = 6;
const R = (n) => 0.8 + 0.6 * (n - 1);
const E = (n) => -13.6 / (n * n);                       // hydrogen energy levels, eV
const lam = (a, b) => 1240 / Math.abs(E(a) - E(b));      // nm
const PARTS = [{ key: '0', icon: '💡', name: 'Explore' }, { key: 'try', icon: '🎨', name: 'Try' },
  { key: 'game', icon: '🎮', name: 'Game' }, { key: 'quiz', icon: '🏆', name: 'Quiz' }];
const drop = (a, b) => (j) => !j.up && j.from === a && j.to === b;
const up = (a, b) => (j) => j.up && j.from === a && j.to === b;
const ALL = [1, 2, 3, 4, 5, 6];
// the game: 13 rounds, 3 stages, no hints (Try teaches every move first). Stage 1 shows the colours; stage 2 greys
// some shells; stage 3 has no colours but nothing new.
// hide = electron shells from which n = 2 does NOT show its colour; path = the jump that answers it
const STAGES = ['Stage 1 · warm-up', 'Stage 2 · some shells grey', 'Stage 3 · no colours: remember them!'];
const ROUNDS = [
  { stage: 0, l: 656, start: 2, hide: [], path: [3, 2], par: 2 },
  { stage: 0, l: 486, start: 2, hide: [], path: [4, 2], par: 2 },
  { stage: 0, l: 434, start: 2, hide: [], path: [5, 2], par: 2 },
  { stage: 0, uv: true, start: 3, hide: [], path: [2, 1], par: 2 },
  { stage: 0, combo: [656, 410], start: 2, hide: [], paths: [[3, 2], [6, 2]], par: 4 },
  { stage: 1, l: 410, start: 1, hide: [3, 5], path: [6, 2], par: 2 },
  { stage: 1, l: 486, start: 2, hide: [3, 5, 6], path: [4, 2], par: 2 },
  { stage: 1, uv: true, start: 5, hide: [3, 4], path: [2, 1], par: 2 },
  { stage: 1, combo: [486, 434], start: 1, hide: [3, 6], paths: [[4, 2], [5, 2]], par: 4 },
  { stage: 2, l: 434, start: 1, hide: ALL, path: [5, 2], par: 2 },
  { stage: 2, l: 656, start: 2, hide: ALL, path: [3, 2], par: 2 },
  { stage: 2, uv: true, start: 6, hide: ALL, path: [2, 1], par: 2 },
  { stage: 2, combo: [656, 410], start: 1, hide: ALL, paths: [[3, 2], [6, 2]], par: 4 },
];
for (const r of ROUNDS) {
  const ck = ([a, b]) => (a < b ? up(a, b) : drop(a, b));
  if (r.paths) r.oks = r.paths.map(ck); else r.ok = r.uv ? (j) => !j.up && j.to === 1 : ck(r.path);
}
const QUIZ = [
  { type: 'do', q: 'Make the electron give out <b style="color:#ff6a55">red</b> light.', ok: (j) => j.from === 3 && j.to === 2,
    why: 'Red light comes from the small drop <b>3 → 2</b>.' },
  { type: 'mcq', q: 'To jump UP to a higher orbit, the electron must…', opts: ['give out light', 'take in light', 'lose its charge'], a: 1,
    why: 'Going up needs energy, so the electron <b>takes in</b> (absorbs) light.' },
  { type: 'do', q: 'Make the electron give out <b style="color:#9a6bff">violet</b> light (410 nm).', ok: (j) => j.from === 6 && j.to === 2,
    why: 'Violet is the biggest drop that still ends on n = 2: <b>6 → 2</b>.' },
  { type: 'mcq', q: 'Which jump gives out MORE energy?', opts: ['3 → 2', '4 → 2'], a: 1,
    why: '<b>4 → 2</b> is the bigger drop: more energy, bluer light.' },
  { type: 'do', q: 'Give out the light with the <b>most energy</b> you can.', ok: (j) => j.from === 6 && j.to === 1,
    why: 'The biggest drop of all is <b>6 → 1</b> (ultraviolet).' },
  { type: 'mcq', q: 'Which light has the shortest wiggles (the highest frequency ν)?', opts: ['red', 'green', 'violet'], a: 2,
    why: 'Bluer light carries more energy: <b>shorter wiggles</b>, higher ν.' },
  { type: 'mcq', q: 'Why does hydrogen give only a few sharp lines, not a full rainbow?',
    opts: ['Its electron can only be on fixed orbits, so only fixed jumps', 'The prism is too small', 'Hydrogen gas is invisible'], a: 0,
    why: 'Fixed orbits → fixed jumps → <b>fixed colours</b>: a line spectrum.' },
];
// hydrogen's 4 visible lines get clearly different colours (true hues, pushed apart so they never blend)
const HCOL = [[656, 0xff2a1e, 'red'], [486, 0x14e6d2, 'blue-green'], [434, 0x2f5bff, 'blue'], [410, 0xc23cff, 'violet']];
function waveColor(l) {
  if (l < 380) return { css: '#8f8aa6', hex: 0x8f8aa6, name: 'ultraviolet (invisible to us)', vis: false };
  if (l > 750) return { css: '#6a4a40', hex: 0x6a4a40, name: 'infrared (invisible to us)', vis: false };
  const h = HCOL.find((c) => Math.abs(c[0] - l) < 2);
  if (h) return { css: '#' + h[1].toString(16).padStart(6, '0'), hex: h[1], name: h[2], vis: true };
  let r = 0, g = 0, b = 0;
  if (l < 440) { r = (440 - l) / 60; b = 1; } else if (l < 490) { g = (l - 440) / 50; b = 1; }
  else if (l < 510) { g = 1; b = (510 - l) / 20; } else if (l < 580) { r = (l - 510) / 70; g = 1; }
  else if (l < 645) { r = 1; g = (645 - l) / 65; } else r = 1;
  const k = l < 420 ? 0.45 + 0.55 * (l - 380) / 40 : 1;
  const c = new THREE.Color(r * k, g * k, b * k);
  const name = l < 425 ? 'violet' : l < 470 ? 'blue' : l < 500 ? 'blue-green' : l < 560 ? 'green' : l < 590 ? 'yellow' : l < 620 ? 'orange' : 'red';
  return { css: '#' + c.getHexString(), hex: c.getHex(), name, vis: true };
}
const GREY = new THREE.Color(0x4d5566);
const lightHex = (l) => waveColor(l).hex;
const isVis = (l) => l >= 380 && l <= 750;

export function start({ stage, ui, level }) {
  const saved = progress.get('light');
  for (const k of Object.keys(saved)) if (!PARTS.some((p) => p.key === k)) delete saved[k];
  localStorage.setItem('games.light', JSON.stringify(saved));
  let idx = Number.isFinite(level) ? level : Math.max(0, PARTS.findIndex((p) => !(p.key in saved)));
  if (idx < 0) idx = 2;
  idx = Math.min(Math.max(idx, 0), PARTS.length - 1);
  ui.innerHTML = `<div class="qpanel2" id="qp"></div><div class="goalbar" id="goal"></div><div class="rinfo" id="rinfo"></div>
    <div class="spec" id="spec"><span class="uv" id="uv">UV</span><div class="band" id="band"></div><span class="ir" id="ir">IR</span></div>
    <div class="levels" id="levels"></div><div class="toast" id="toast"></div>`;
  const toast = (html, cls = '') => { const t = $('toast'); t.innerHTML = html; t.className = 'toast show ' + cls; clearTimeout(toast.t); toast.t = setTimeout(() => (t.className = 'toast'), 2600); };

  // the goal lives in one slim line at the bottom (the eye stays on the experiment in the middle)
  const gb = goalBar($('goal')), B = { draw: (lines) => { $('goal').classList.toggle('long', lines.some((l) => l.long)); gb.draw(lines); } };
  const place = () => {
    const wide = innerWidth / innerHeight > 1.15;
    stage.root.position.set(0, wide ? 0 : 1.2, 0); stage.pedestal.position.x = 0;
  };
  addEventListener('resize', place); place();

  // ---- the hydrogen atom: nucleus + 6 shells (tap targets are fat invisible tori)
  const g = new THREE.Group(); g.position.set(0, 0.8, 0); g.rotation.x = -0.12; stage.root.add(g);
  const core = new THREE.Group(); core.add(ball(M.proton, 0.34), glow(0xff6a55, 1.3, 0.55)); g.add(core);
  const rings = [], anchors = [], hidden = new Set();
  for (let k = 1; k <= NMAX; k++) {
    const vis = ring(R(k), ringMat(0x7fb0ff, 0.55), 0.03); g.add(vis);
    vis.material.toneMapped = false; vis.material.blending = THREE.NormalBlending;   // pure, strong colours
    const hit = new THREE.Mesh(new THREE.TorusGeometry(R(k), 0.24, 6, 72),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
    hit.userData.n = k; g.add(hit); stage.pickable(hit);
    const a = -0.62, anchor = new THREE.Object3D(); anchor.position.set(R(k) * Math.cos(a), R(k) * Math.sin(a), 0); g.add(anchor);
    stage.tag(`n = ${k}`, anchor, [0.32, -0.1, 0], 'blue');
    anchors.push(anchor);
    rings.push(vis);
  }
  const hintAnchor = new THREE.Object3D(); g.add(hintAnchor);
  const hintTag = stage.tag('tap', hintAnchor, [0, 0, 0], 'tapme');
  let hintN = 0;
  function setHint(m) {
    hintN = m || 0;
    if (m) {
      hintAnchor.position.set(R(m) * Math.cos(2.2), R(m) * Math.sin(2.2), 0);
    }
  }
  // shell colour = the light a jump from the electron's shell to it would make; its own shell is white
  // fixed colours. Visible light only comes from landing on n = 2, so each outer shell shows the colour it gives
  // falling to n = 2 (or catching light 2 → it). n = 2 is the white landing shell; n = 1 is dim (falls there = UV)
  // colours follow the electron and are grouped the way hydrogen's light is. Below the electron: n = 1 violet tint
  // (landing there = UV), n = 2 shows the visible colour of that fall (the only bright one), n = 3+ stay grey
  // (infrared; a red tint looked like 'this shell makes red light'). The electron's own shell is soft white; shells above it are grey
  const OWN = new THREE.Color(0xcfe2ff), UVC = new THREE.Color(0x585070);
  const below = (k) => k < n && !busy;
  const lit2 = () => below(2) && !hidden.has(n);
  const ringCol = (k) => (k === n ? OWN : !below(k) ? GREY : k === 1 ? UVC : k === 2 ? (lit2() ? new THREE.Color(lightHex(lam(n, 2))) : GREY) : GREY);

  // electron with a comet trail. It glows in the colour of the energy it holds (energy rings spin around it)
  const e = new THREE.Group(), eGlow = glow(0x4aa8ff, 0.95, 0.85); e.add(ball(M.electron, 0.15), eGlow); g.add(e);
  const aura = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.012, 6, 48), ringMat(0xffffff, 0)); e.add(aura);
  const aura2 = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.008, 6, 48), ringMat(0xffffff, 0)); e.add(aura2);
  const BLUE = new THREE.Color(0x4aa8ff), chargeCol = new THREE.Color(0xffffff);
  const TR = 22, hist = [];
  const trail = Array.from({ length: TR }, (_, k) => { const s = glow(0x4aa8ff, 0.4 * (1 - k / TR) + 0.05, 0.55 * (1 - k / TR)); g.add(s); return s; });
  // the electron never stops while light travels: it slows down (spd → spdTo) so your eye follows the energy
  let n = 1, rad = R(1), ang = 0.9, busy = false, manual = false, spd = 1, spdTo = 1, charge = 0;
  stage.onFrame((dt, time) => {
    if (!manual) { spd += (spdTo - spd) * Math.min(1, dt * 3); ang += dt * (1.6 / Math.sqrt(rad)) * spd; }
    e.position.set(rad * Math.cos(ang), rad * Math.sin(ang), 0);
    hist.unshift(e.position.clone()); if (hist.length > TR * 2) hist.length = TR * 2;
    trail.forEach((s, k) => s.position.copy(hist[Math.min(hist.length - 1, k * 2)]));
    core.rotation.y += dt * 0.4;
    const showHint = !!hintN && !busy && !done && g.visible;
    hintTag.style.display = showHint ? '' : 'none';
    eGlow.material.color.copy(BLUE).lerp(chargeCol, charge);
    eGlow.scale.setScalar(0.95 + 0.45 * charge + 0.06 * Math.sin(time * 6));
    aura.material.color.copy(chargeCol); aura2.material.color.copy(chargeCol);
    aura.material.opacity = 0.9 * charge; aura2.material.opacity = 0.6 * charge;
    aura.rotation.set(time * 3.1, time * 2.3, 0); aura2.rotation.set(-time * 2.2, time * 3.7, 0);
    aura.scale.setScalar(0.7 + 0.3 * charge + 0.05 * Math.sin(time * 17));
    rings.forEach((r, k) => {
      r.material.color.lerp(ringCol(k + 1), Math.min(1, dt * 4));
      const s = k + 1;
      let want = s === n ? 0.6 : !below(s) || s >= 3 ? 0.3 : s === 2 ? (lit2() ? 0.95 : 0.3) : 0.5;
      // the shell to tap next just breathes (brighter / dimmer in its own colour)
      if (showHint && k + 1 === hintN) want = Math.min(1, want + 0.35) - 0.3 * (0.5 + 0.5 * Math.sin(time * 3.5));
      r.material.opacity += (want - r.material.opacity) * Math.min(1, dt * 6);
    });
  });

  // a light wave: a thin glowing wavy ribbon carrying sparkles of energy. Bluer light (more energy, higher ν) has
  // shorter wiggles; ultraviolet and infrared are drawn fainter because our eyes cannot see them
  const wiggle = (l) => (l < 380 ? 0.065 : l > 750 ? 0.42 : 0.1 + 0.2 * (l - 380) / 370);
  const WAVE_LEN = 1.0, WAVE_SEG = 200, NSP = 40;
  function makeWave(l, col) {
    // the path runs from the FRONT (x = 0) back to the TAIL (x = -len), so a draw range can show just a slice of it
    const grp = new THREE.Group(), len = WAVE_LEN, N = 200, pts = [];
    const yAt = (x, i) => 0.08 * Math.pow(Math.sin(Math.PI * i), 0.6) * Math.sin((2 * Math.PI * x) / wiggle(l));
    for (let i = 0; i <= N; i++) { const x = -len * (i / N); pts.push(new THREE.Vector3(x, yAt(x, i / N), 0)); }
    const curve = new THREE.CatmullRomCurve3(pts), k = col.vis ? 1 : 0.8;
    const mk = (r, o) => new THREE.Mesh(new THREE.TubeGeometry(curve, WAVE_SEG, r, 6), new THREE.MeshBasicMaterial({ color: col.hex,
      transparent: true, opacity: o * k, blending: THREE.AdditiveBlending, depthWrite: false }));
    grp.add(mk(0.014, 1), mk(0.04, 0.22));
    const sp = new Float32Array(NSP * 3), base = [];
    for (let i = 0; i < NSP; i++) { const u = i / (NSP - 1), x = -len * u; base.push([x, yAt(x, u)]); }
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    const sparks = new THREE.Points(sg, new THREE.PointsMaterial({ color: col.hex, map: glowTexture(), size: 0.09, transparent: true,
      opacity: k, blending: THREE.AdditiveBlending, depthWrite: false }));
    grp.add(sparks);
    const head = glow(col.hex, 0.45, 0.95 * k); grp.add(head);
    Object.assign(grp.userData, { head, sparks, base, sp });
    return grp;
  }
  // light travels at a steady speed. It GROWS out of where it starts (front first, tail last) and FLOWS INTO where
  // it ends (front first). `to` may be a function: incoming light steers onto the (slowly) moving electron.
  async function flyWave(from, to, l, col, dur, onArrive, push) {
    const w = makeWave(l, col); stage.scene.add(w);
    const { head, sparks, base, sp } = w.userData, getTo = typeof to === 'function' ? to : () => to;
    let arrived = false;
    const per = 36;                                    // 6 sides × 6 indices per ring segment
    const X = new THREE.Vector3(1, 0, 0);
    const curve = push && new THREE.QuadraticBezierCurve3(from.clone(),
      from.clone().addScaledVector(push, Math.min(2.2, from.distanceTo(getTo()) * 0.45)), getTo().clone());
    const dist0 = curve ? curve.getLength() : from.distanceTo(getTo());
    await tween(dur, (t) => {
      const tgt = getTo(), dist = curve ? dist0 : from.distanceTo(tgt);
      const s = (dist0 + WAVE_LEN) * t;                // how far the front has gone
      if (curve) {
        const u = Math.min(1, s / dist);
        const dir = s < dist ? curve.getTangentAt(u) : curve.getTangentAt(1);
        w.quaternion.setFromUnitVectors(X, dir.normalize());
        if (s < dist) w.position.copy(curve.getPointAt(u)); else w.position.copy(tgt).addScaledVector(dir, s - dist);
      } else {
        const dir = tgt.clone().sub(from).normalize();
        w.quaternion.setFromUnitVectors(X, dir);
        w.position.copy(from).addScaledVector(dir, s);
      }
      // visible slice, as a fraction of the wave from its front: behind the start is not out yet, past the end is taken in
      const u0 = Math.max(0, (s - dist) / WAVE_LEN), u1 = Math.min(1, s / WAVE_LEN);
      const a = Math.floor(u0 * WAVE_SEG), b = Math.floor(u1 * WAVE_SEG);
      w.children.forEach((m) => m.isMesh && m.geometry.setDrawRange(a * per, Math.max(0, b - a) * per));
      base.forEach(([x, y], i) => sp.set([x + (Math.random() - 0.5) * 0.05, y + (Math.random() - 0.5) * 0.09, (Math.random() - 0.5) * 0.06], i * 3));
      sparks.geometry.attributes.position.needsUpdate = true;
      const pa = Math.floor(u0 * (NSP - 1)), pb = Math.ceil(u1 * (NSP - 1));
      sparks.geometry.setDrawRange(pa, Math.max(0, pb - pa));
      head.visible = s < dist;
      head.scale.setScalar(0.45 + 0.08 * Math.sin(t * 60));
      if (!arrived && s >= dist) { arrived = true; onArrive && onArrive(); }
    }, ease.lin);
    stage.scene.remove(w);
    w.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
  }
  // energy sparks swirling INTO the electron (light caught / energy gathering before light leaves) or OUT of it
  function swirl(col, mode, dur) {
    const N = 36, pos = new Float32Array(N * 3);
    const seeds = Array.from({ length: N }, () => ({ a: Math.random() * 6.283, r: 0.3 + Math.random() * 0.4, z: (Math.random() - 0.5) * 0.4, w: 3 + Math.random() * 4 }));
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: col.hex, map: glowTexture(), size: 0.1, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false });
    const pts = new THREE.Points(geo, mat); g.add(pts);
    return tween(dur, (t) => {
      const k = mode === 'in' ? 1 - t : t;
      seeds.forEach((s, i) => {
        const a = s.a + s.w * t, rr = s.r * k;
        pos.set([e.position.x + rr * Math.cos(a), e.position.y + rr * Math.sin(a), e.position.z + s.z * k], i * 3);
      });
      geo.attributes.position.needsUpdate = true;
      mat.opacity = mode === 'in' ? Math.min(1, t * 4) * (1 - t * 0.3) : 1 - t;
    }, ease.inOut).then(() => { g.remove(pts); geo.dispose(); mat.dispose(); });
  }
  function ripple(local, col) {                    // a ring of colour spreading out from the electron as light leaves
    const r = new THREE.Mesh(new THREE.TorusGeometry(1, 0.03, 6, 64), ringMat(col.hex, 0.9));
    r.position.copy(local); g.add(r);
    tween(0.7, (t) => { r.scale.setScalar(0.1 + 0.5 * t); r.material.opacity = 0.9 * (1 - t); }, ease.out)
      .then(() => { g.remove(r); r.geometry.dispose(); r.material.dispose(); });
  }
  function burst(local, col, size = 0.8) {         // a soft flash where light is caught or given out
    const f = glow(col.hex, 0.1, 1); f.position.copy(local); g.add(f);
    tween(0.5, (t) => { f.scale.setScalar(0.1 + size * t); f.material.opacity = 1 - t; }, ease.out).then(() => g.remove(f));
  }
  const eWorld = () => g.localToWorld(e.position.clone());
  function bandPoint(l) {                          // where on the bottom strip this light lands (a world point)
    const el = l < 380 ? $('uv') : l > 750 ? $('ir') : $('band'), r = el.getBoundingClientRect();
    const x = el.id === 'band' ? r.left + r.width * ((l - 380) / 370) : r.left + r.width / 2;
    return stage.fromScreen(x, r.top + r.height / 2, 0);
  }

  // ---- 💡 explore: the prism bench. Five things to discover (on the board); all five earn a badge
  const HLINES = [[3, 656], [4, 486], [5, 434], [6, 410]];
  const bench = createPrismBench(stage, waveColor);
  const DISC = [
    { id: 'miss', gas: false, text: 'Make the light miss the prism', toast: 'No prism, no rainbow: the <b>glass</b> splits the colours!',
      test: (i) => !i.hitPrism },
    { id: 'rainbow', gas: false, text: 'Move something, still catch the whole rainbow', toast: 'Every colour, no gaps: a <b>continuous spectrum</b>.',
      test: (i) => bench.moves > 0 && i.onScreen >= 30 },
    { id: 'bounce', gas: null, text: 'Make the light bounce inside the glass', toast: 'Too steep to get out, so it bounced back inside!',
      test: (i) => i.bounced },
    { id: 'four', gas: true, text: 'Switch to hydrogen: see its 4 lines', toast: 'Only 4 colours with dark gaps: a <b>line spectrum</b>.',
      test: (i) => i.onScreen === 4 },
    { id: 'same', gas: true, text: 'Move the prism: still the same 4 colours?', toast: 'Always the same 4 colours: hydrogen&#39;s fingerprint!',
      test: (i) => i.onScreen === 4 && bench.moves > gasMoves0 },
  ];
  const BADGES = 'games.badges';
  const found = new Set();
  let gasMoves0 = 0, badgeShown = false;
  const drawExplore = () => {
    const next = DISC.find((d) => !found.has(d.id));
    B.draw([
      { text: '💡', bold: true },
      { dots: DISC.map((d) => (found.has(d.id) ? 'ok' : d === next ? 'on' : '')) },
      next ? { text: next.text } : { text: 'All found!', bold: true, color: '#9dffbf' },
    ]);
  };
  bench.onSwitch = (h) => showIntro(h ? 1 : 0);
  bench.onChange = (info) => {
    if (idx !== 0) return;
    liveBand(info);
    const h = bench.gas;
    for (const d of DISC) {
      if (found.has(d.id) || !(d.gas === null || d.gas === h) || !d.test(info)) continue;
      found.add(d.id); sfx.ding();
      toast(`💡 <b>Discovery!</b> ${d.toast}`, 'disc');
      drawExplore();
      if (found.size === DISC.length && !badgeShown) setTimeout(badge, 1600);
    }
  };
  function badge() {
    badgeShown = true;
    try { const b = JSON.parse(localStorage.getItem(BADGES)) || {}; b.lightExplorer = 1; localStorage.setItem(BADGES, JSON.stringify(b)); } catch (e) { /* private mode */ }
    progress.set('light', '0', 0);                     // explored (it has no stars)
    sfx.win(); levelDots();
    modal(`<div class="badge"><svg viewBox="0 0 120 120" width="120" height="120">
        <defs><linearGradient id="bgRb" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#8a5cff"/><stop offset=".3" stop-color="#3fa0ff"/>
        <stop offset=".5" stop-color="#3fe08a"/><stop offset=".7" stop-color="#ffd84a"/><stop offset="1" stop-color="#ff5040"/></linearGradient></defs>
        <circle cx="60" cy="60" r="56" fill="#0d1422" stroke="url(#bgRb)" stroke-width="6"/>
        <line x1="12" y1="64" x2="50" y2="58" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
        <polygon points="72,58 108,40 108,84" fill="url(#bgRb)" opacity=".85"/>
        <polygon points="60,32 80,80 40,80" fill="rgba(170,220,255,.3)" stroke="#e6f4ff" stroke-width="2.5"/>
        </svg></div>
      <div class="kicker">Badge earned</div><h2>Light Explorer</h2>
      <ul class="disc done">${DISC.map((d) => `<li class="got"><i>✓</i><span>${d.toast}</span></li>`).join('')}</ul>
      <div class="row"><button id="mStay">Keep exploring</button><button id="mGo" class="go">Next: the game →</button></div>`);
    $('mStay').onclick = closeModal;
    $('mGo').onclick = () => { closeModal(); load(1); };
  }
  function showIntro(step) {
    const h = step === 1;
    bench.setGas(h);
    if (h) gasMoves0 = bench.moves;
    drawExplore();
    bench.onChange(bench.info);
  }
  function setMode(intro) {
    bench.setActive(intro); g.visible = !intro;
    anchors.forEach((a) => (a.visible = !intro));
  }
  // ---- the strip at the bottom
  const xOf = (l) => ((l - 380) / (750 - 380)) * 100;
  // colour names sit at their real wavelengths
  const SCALE = '<div class="bscale">' + [['violet', 410], ['blue', 465], ['green', 530], ['yellow', 580], ['red', 670]]
    .map(([t, l]) => `<span style="position:absolute;left:${xOf(l)}%;transform:translateX(-50%)">${t}</span>`).join('') + '</div>';
  function clearBand(cap) {
    $('band').innerHTML = SCALE; $('spec').dataset.cap = cap;
    $('uv').className = 'uv'; $('ir').className = 'ir';
  }
  function addLine(from, to, l, pop = false) {
    const col = waveColor(l);
    $('band').insertAdjacentHTML('beforeend', `<i class="${pop ? 'pop' : ''}" style="left:${xOf(l)}%;background:${col.css};box-shadow:0 0 10px ${col.css}"><span>${from}→${to}</span></i>`);
  }
  function liveBand(info) {                        // level 1: exactly the colours that land on the screen, right now
    clearBand('What lands on the screen, laid flat');
    if (info.whiteSpot) { $('band').insertAdjacentHTML('beforeend', '<i class="white"><span>white spot: colours not split</span></i>'); return; }
    if (bench.gas) { info.hits.forEach((l) => addLine((HLINES.find((h) => h[1] === l) || [0])[0], 2, l)); return; }
    // white light: each colour patch reaches halfway to its neighbours, so the rainbow has no gaps
    const ls = info.hits.slice().sort((a, b) => a - b), xs = ls.map(xOf);
    xs.forEach((x, i) => {
      const lo = i ? Math.max((x + xs[i - 1]) / 2, x - 5) : x - 1.5, hi = i < xs.length - 1 ? Math.min((x + xs[i + 1]) / 2, x + 5) : x + 1.5;
      $('band').insertAdjacentHTML('beforeend', `<i class="soft" style="left:${lo}%;width:${hi - lo + 0.2}%;background:${waveColor(ls[i]).css}"></i>`);
    });
  }


  let L, jumps, done, made;
  function levelDots() {
    const s = progress.get('light');
    $('levels').innerHTML = PARTS.map((p, i) => `<button class="lv part${i === idx ? ' on' : ''}${p.key in s ? ' won' : ''}" data-lv="${i}">${p.icon} ${p.name}</button>`).join('');
  }
  $('levels').onclick = (ev) => { const b = ev.target.closest('[data-lv]'); if (b && !busy) load(+b.dataset.lv); };

  const cam0 = stage.camera.position.clone(), tgt0 = stage.controls.target.clone();
  function setShells(hide) { hidden.clear(); hide.forEach((k) => hidden.add(k)); }
  function placeElectron(k) { n = k; rad = R(k); charge = 0; spd = spdTo = 1; manual = false; }
  function load(i) {
    idx = i; L = PARTS[i]; jumps = 0; done = false; made = new Set();
    history.replaceState(null, '', `?game=light&level=${i}`);
    placeElectron(1); setShells([]);
    $('qp').innerHTML = '';
    clearBand(L.key === '0' ? 'What lands on the screen, laid flat' : 'Your spectrum: each jump DOWN adds a line');
    // every part starts from the same view (looking around on the prism table must not tilt the atom)
    const p0 = stage.camera.position.clone(), t0 = stage.controls.target.clone();
    if (p0.distanceTo(cam0) > 0.01) tween(0.6, (k) => { stage.camera.position.lerpVectors(p0, cam0, k); stage.controls.target.lerpVectors(t0, tgt0, k); });
    setMode(L.key === '0');
    $('goal').style.display = L.key === 'game' ? 'none' : ''; $('rinfo').style.display = L.key === 'game' ? '' : 'none';
    $('band').querySelectorAll('.slot').forEach((x) => x.remove()); $('uv').classList.remove('want');
    if (L.key === '0') showIntro(bench.gas ? 1 : 0);
    setHint(0);
    if (L.key === 'try') { tstep = 'colours'; tdone = 0; placeElectron(2); drawTry(true); tryDemo(); }
    if (L.key === 'game') startGame();
    if (L.key === 'quiz') startQuiz();
    levelDots();
  }

  // ---- 🎨 try: tap shells, see the colours, then the game starts
  const visCount = () => [...made].filter((l) => l >= 380 && l <= 750).length;
  // Try teaches every move the game will ask for: make 2 colours (fall) → catch light (jump up) → UV (fall to n = 1)
  let tstep = 'colours', tdone = 0;
  const TRY_TEXT = { colours: 'Fall to n = 2: make its colour', take: 'Catch light: jump UP to n = 5',
    back: 'Now fall back to n = 2: give the light out',
    uv: 'Fall to n = 1: light we cannot see (UV)' };
  const drawTry = (watch) => B.draw([
    { text: watch ? '👀 Watch' : TRY_TEXT[tstep], bold: true, color: '#ffb347' },
    { dots: [0, 1, 2, 3].map((k) => (k < tdone ? 'ok' : k === tdone ? 'on' : '')) },
  ]);
  // the demo: the electron catches light and climbs by itself; then the gold ring shows where to tap
  async function tryDemo() {
    const me = L;
    await sleep(0.9);
    if (L !== me) return;
    await jump(4);
    if (L !== me) return;
    drawTry(); tryHint();
  }
  // next step: from n = 2 climb to a shell whose colour is not made yet; from higher up, fall to n = 2
  function tryHint() {
    if (L.key !== 'try' || done) return setHint(0);
    if (tstep === 'take') return setHint(n === 5 ? 2 : 5);
    if (tstep === 'back') return setHint(2);
    if (tstep === 'uv') return setHint(1);
    if (n !== 2) return setHint(2);
    const k = [4, 3, 5, 6].find((s) => !made.has(Math.round(lam(s, 2))));
    setHint(k || 3);
  }
  function tryStep(j) {
    if (tstep === 'colours' && !j.up && j.to === 2 && isVis(j.lambda)) { tdone = visCount(); if (tdone >= 2) { tdone = 2; tstep = 'take'; sfx.add(); } }
    else if (tstep === 'take' && j.up) tstep = 'back';
    else if (tstep === 'back' && !j.up && j.to === 2) { tdone = 3; tstep = 'uv'; sfx.add(); }
    else if (tstep === 'uv' && !j.up && j.to === 1) {
      tdone = 4; setHint(0); done = true; drawTry();
      return celebrate('You know every move! Now the game…', () => load(2));
    }
    drawTry(); tryHint();
  }

  // one thing at a time: light flies in → its energy swirls into the electron → the electron swoops up using it.
  // Or: the electron swoops down, its spare energy gathers → bursts out as light → the light flies into the strip.
  async function jump(m) {
    if (busy || done || m === n || L.key === '0' || (L.key === 'quiz' && quiz.locked)) return;
    busy = true; jumps++;
    const j = { from: n, to: m, up: m > n, dE: Math.abs(E(m) - E(n)) };
    j.lambda = 1240 / j.dE;
    const col = waveColor(j.lambda);
    const dur = Math.abs(R(m) - R(n)) * 0.14 + 0.45;
    if (j.up) {
      spdTo = 0.18; sfx.pop();
      const at = eWorld(), out = at.clone().sub(g.localToWorld(new THREE.Vector3())).normalize();
      const from = at.clone().addScaledVector(out, 2.6);
      await flyWave(from, eWorld, j.lambda, col, 0.7, () => {
        chargeCol.set(col.hex); burst(e.position, col, 0.6); sfx.add();
        swirl(col, 'in', 0.4); tween(0.3, (k) => (charge = k));
      });
      await sleep(0.15);
      // it swoops forward and out along a curve (like a car taking a ramp), using up the energy it caught
      const r0 = rad, a0 = ang, a1 = a0 + 0.9 + 0.25 * (m - n), sw = dur + 0.15;
      manual = true;
      await tween(sw, (k) => { rad = r0 + (R(m) - r0) * k; ang = a0 + (a1 - a0) * (0.5 * k + 0.5 * k * k * (3 - 2 * k)); charge = 1 - k; }, ease.lin);
      manual = false; spd = 0.6; spdTo = 1; charge = 0;
    } else {
      // find where on the lower shell the electron is heading straight at the strip (its line of travel hits it)
      const bL = g.worldToLocal(bandPoint(j.lambda)), rm = R(m);
      let a1 = ang + 0.8;
      for (let a = ang + 0.8; a < ang + 0.8 + 2 * Math.PI; a += 0.01) {
        const tx = -Math.sin(a), ty = Math.cos(a), dx = bL.x - rm * Math.cos(a), dy = bL.y - rm * Math.sin(a);
        if (tx * dx + ty * dy > 0 && Math.abs(tx * dy - ty * dx) / Math.hypot(dx, dy) < 0.02) { a1 = a; break; }
      }
      const a0 = ang, r0 = rad, sw = 0.45 + 0.16 * (a1 - a0);
      manual = true; chargeCol.set(col.hex);
      // it spirals down at a steady speed (no stopping), glowing more as it sheds height
      await tween(sw, (k) => { rad = r0 + (rm - r0) * ease.inOut(k); ang = a0 + (a1 - a0) * k; charge = k; }, ease.lin);
      charge = 0; burst(e.position, col, 0.5);
      col.vis ? sfx.ding() : sfx.boing();
      manual = false; spd = 0.7; spdTo = 0.5;
      const push = new THREE.Vector3(-Math.sin(ang), Math.cos(ang), 0).transformDirection(g.matrixWorld);
      const start = eWorld().addScaledVector(push, 0.16), toBand = bandPoint(j.lambda);
      const from = n;
      await flyWave(start, toBand, j.lambda, col, 0.6 + 0.08 * start.distanceTo(toBand), () => {
        if (col.vis) { addLine(from, m, j.lambda, true); }
        else $(j.lambda < 380 ? 'uv' : 'ir').className += ' lit';
      });
      spdTo = 1;
      made.add(Math.round(j.lambda));
    }
    n = m; rad = R(m);
    busy = false;
    if (L.key === 'try') tryStep(j);
    if (L.key === 'game') roundJump(j, col);
    if (L.key === 'quiz') quizJump(j);
  }
  stage.onTap = (hit) => { if (hit && hit.obj.userData.n) jump(hit.obj.userData.n); };

  // a quick celebration: sparkles + a sound + a short message, then go on by itself (no pop-up)
  function celebrate(msg, next, delay = 2200) {
    sfx.win(); confetti(stage, g.localToWorld(new THREE.Vector3(0, 2.5, 0)), 50);
    toast(`✓ <b>${msg}</b>`, 'good');
    if (L.key === 'try') progress.set('light', 'try', 0);
    levelDots();
    setTimeout(next, delay);
  }

  // ---- 🎮 the game: 13 rounds, harder and harder; one reward at the very end
  const game = { r: 0, pts: [], combo: 0 };
  function startGame() { Object.assign(game, { r: 0, pts: [], combo: 0 }); startRound(true); }
  const cssOf = (l) => '#' + new THREE.Color(lightHex(l)).getHexString();
  function drawRound() {
    const Rd = ROUNDS[game.r], score = game.pts.reduce((a, b) => a + b, 0);
    $('band').querySelectorAll('.slot').forEach((x) => x.remove()); $('uv').classList.remove('want');
    const slot = (l, mark) => $('band').insertAdjacentHTML('beforeend',
      `<i class="slot" style="left:${xOf(l)}%;--c:${cssOf(l)}">${mark ? `<span>${mark}</span>` : ''}</i>`);
    if (Rd.uv) $('uv').classList.add('want');
    else if (Rd.combo) Rd.combo.forEach((l, i) => i >= game.combo && slot(l, i + 1));
    else slot(Rd.l, '');
    $('rinfo').textContent = `${game.r + 1} / ${ROUNDS.length}   ★ ${score}`;
  }
  function startRound(first) {
    const Rd = ROUNDS[game.r], newStage = first || ROUNDS[game.r - 1].stage !== Rd.stage;
    jumps = 0; game.combo = 0; done = false;
    placeElectron(Rd.start); setShells(Rd.hide);
    clearBand('Your spectrum: each jump DOWN adds a line');
    if (newStage) toast(`<b>${STAGES[Rd.stage]}</b>`, 'disc');
    drawRound();
  }
  function roundJump(j, col) {
    const Rd = ROUNDS[game.r];
    let win = false;
    if (Rd.combo) {
      if (Rd.oks[game.combo](j)) { game.combo++; sfx.add(); if (game.combo === 2) win = true; else drawRound(); }
    } else win = Rd.ok(j);
    if (!win) return;
    done = true;
    const p = jumps <= Rd.par ? 3 : jumps <= Rd.par + 2 ? 2 : 1;
    game.pts.push(p);
    const last = game.r === ROUNDS.length - 1;
    celebrate(`${'★'.repeat(p)}`, () => { if (last) endGame(); else { game.r++; startRound(false); } }, 1900);
  }
  function endGame() {
    const s = game.pts.reduce((a, b) => a + b, 0), N = ROUNDS.length * 3, stars = s >= N - 3 ? 3 : s >= N * 0.7 ? 2 : 1;
    progress.set('light', 'game', stars); levelDots();
    sfx.win(); confetti(stage, g.localToWorld(new THREE.Vector3(0, 2.5, 0)));
    modal(`<div class="stars">${starStr(stars)}</div><h2>Game complete: ${s} / ${N}</h2>
      <p>${stars === 3 ? 'Brilliant! You can tell every jump by its colour, even with the shells grey.' : 'Well done! Play again to make each colour in fewer jumps.'}</p>
      <div class="row"><button id="mReplay">↺ Play again</button><button id="mQuiz" class="go">Take the quiz →</button></div>`);
    $('mReplay').onclick = () => { closeModal(); load(2); };
    $('mQuiz').onclick = () => { closeModal(); load(3); };
  }

  // ---- 🏆 the quiz: the question on the board, answers as buttons under the atom; one score at the end
  const quiz = { k: 0, score: 0, locked: false, results: [] };
  function startQuiz() { Object.assign(quiz, { k: 0, score: 0, locked: false, results: [] }); showQuestion(); }
  function drawQuestion(extra) {
    const Q = QUIZ[quiz.k];
    B.draw([
      { dots: QUIZ.map((q, i) => (i < quiz.results.length ? (quiz.results[i] ? 'ok' : 'no') : i === quiz.k ? 'on' : '')) },
      extra || { text: Q.q.replace(/<[^>]+>/g, ''), bold: true, long: true },
    ]);
  }
  function showQuestion() {
    const Q = QUIZ[quiz.k];
    quiz.locked = Q.type === 'mcq'; quiz.answered = false;
    setShells(ALL);
    drawQuestion();
    $('qp').innerHTML = Q.type === 'mcq' ? Q.opts.map((o, i) => `<button data-o="${i}">${o}</button>`).join('') : '';
    $('qp').onclick = (ev) => {
      const b = ev.target.closest('[data-o]'); if (!b || quiz.answered) return;
      answer(+b.dataset.o === Q.a, b);
    };
  }
  function quizJump(j) {
    const Q = QUIZ[quiz.k];
    if (Q.type !== 'do' || quiz.answered || j.up) return;
    answer(Q.ok(j));
  }
  function answer(right, btn) {
    const Q = QUIZ[quiz.k];
    quiz.answered = true; quiz.locked = true; quiz.results.push(right);
    if (right) quiz.score++;
    if (btn) { btn.classList.add(right ? 'ok' : 'no'); if (!right) $('qp').querySelector(`[data-o="${Q.a}"]`).classList.add('ok'); }
    right ? sfx.ding() : sfx.buzz();
    if (right) confetti(stage, g.localToWorld(new THREE.Vector3(0, 2.5, 0)), 30);
    drawQuestion({ text: (right ? '✓ ' : '✗ ') + Q.why.replace(/<[^>]+>/g, ''), color: right ? '#9dffbf' : '#ffb0a8', long: true });
    const last = quiz.k === QUIZ.length - 1;
    $('qp').insertAdjacentHTML('beforeend', `<button id="qNext" class="go">${last ? 'See my score →' : 'Next →'}</button>`);
    $('qNext').onclick = () => { if (last) finishQuiz(); else { quiz.k++; showQuestion(); } };
  }
  function finishQuiz() {
    done = true; $('qp').innerHTML = '';
    const s = quiz.score, N = QUIZ.length, stars = s === N ? 3 : s >= N - 2 ? 2 : 1;
    progress.set('light', 'quiz', stars);
    sfx.win(); confetti(stage, g.localToWorld(new THREE.Vector3(0, 2.5, 0)));
    modal(`<div class="stars">${starStr(stars)}</div><h2>Quiz: ${s} / ${N}</h2>
      <p>${s === N ? 'Perfect! You really know how electrons make light.' : s >= N - 2 ? 'Great work!' : 'Good try! Play the game again, then retake the quiz.'}</p>
      <div class="row"><button id="mReplay">↺ Retake quiz</button><a class="go" href="games.html">All games</a></div>`);
    $('mReplay').onclick = () => { closeModal(); load(3); };
    levelDots();
  }
  load(idx);
  return { load, jump, bench, get n() { return n; }, get round() { return game.r; } };
}
