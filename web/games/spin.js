// Spin Blocks (Bohr rule 6, p.46: angular momentum mvr = nh/2π). A ball on a string and a gold "amount of spin" bar.
// Hands only, no typing: TAP the ball = heavier (m), DRAG the ball = wider circle (r), STRETCH the gold arrow = faster
// (v). The bar and a live line "m × v × r = …" show the spin.
// 💡 explore (free play) → 🎨 try (teaches every move, with a breathing hint) → 🎮 game (NO hints: reach the line,
// find the missing piece with the bar hidden, park an electron on whole blocks of spin) → 🏆 quiz (tricky questions,
// each answer is then acted out on the ball).
import { THREE, $, sfx, confetti, progress, starStr, tween, M, ball, glow, ring, ringMat, goalBar, shakeEl } from './kit.js';
import { modal, closeModal } from './atomlab.js';

const PARTS = [{ key: '0', icon: '💡', name: 'Explore' }, { key: 'try', icon: '🎨', name: 'Try' },
  { key: 'game', icon: '🎮', name: 'Game' }, { key: 'twin', icon: '👯', name: 'Twin' }, { key: 'quick', icon: '⚡', name: 'Quick' },
  { key: 'climb', icon: '🪜', name: 'Climb' }, { key: 'quiz', icon: '🏆', name: 'Quiz' }];
const PI = (k) => PARTS.findIndex((p) => p.key === k);
const MINI = ['game', 'twin', 'quick', 'climb'];               // no goal line: the task sits on the bar / the twin
const TWINS = [{ m: 2, v: 3, r: 2 }, { m: 3, v: 2, r: 1 }, { m: 1, v: 4, r: 3 }, { m: 3, v: 4, r: 2 }, { m: 2, v: 2, r: 2 }];
const CLIMB = [2, 3, 2, 1, 3];                  // starts parked on K
const MAX = { m: 3, v: 4, r: 3 };
const HPU = 4.4 / 36;               // bar height per unit of spin (free ball: 1 … 36)
const RU = 1.15;                   // world size of one r step (free ball)
const R1 = 0.4, BLK = 1.3;          // Bohr's electron: K radius (L = 4 ×, M = 9 ×); bar height per block
const SHELL = ['K', 'L', 'M'];
const COL = { m: '#ffffff', v: '#ffc061', r: '#7cc8ff' };

const ROUNDS = [
  { stage: 0, kind: 'reach', target: 8, start: { m: 1, v: 1, r: 1 } },
  { stage: 0, kind: 'reach', target: 18, start: { m: 1, v: 1, r: 1 } },
  { stage: 0, kind: 'reach', target: 24, start: { m: 1, v: 1, r: 1 } },
  { stage: 1, kind: 'solve', target: 12, start: { m: 2, v: 1, r: 3 }, free: 'v' },
  { stage: 1, kind: 'solve', target: 24, start: { m: 1, v: 4, r: 2 }, free: 'm' },
  { stage: 1, kind: 'solve', target: 18, start: { m: 3, v: 2, r: 1 }, free: 'r' },
  { stage: 1, kind: 'solve', target: 6, start: { m: 1, v: 3, r: 1 }, free: 'r' },
  { stage: 1, kind: 'solve', target: 8, start: { m: 2, v: 1, r: 1 }, free: 'v' },
  { stage: 2, kind: 'bohr', n: 2 }, { stage: 2, kind: 'bohr', n: 1 }, { stage: 2, kind: 'bohr', n: 3 },
];
const STAGES = ['Stage 1 · reach the line', 'Stage 2 · find the missing piece', "Stage 3 · Bohr's whole blocks"];

const QUIZ = [
  { q: 'Same ball, same circle, but it goes twice as fast. The spin…', opts: ['stays the same', 'doubles', 'halves'], a: 1,
    why: 'v doubles, so m × v × r doubles.', from: { m: 1, v: 2, r: 2 }, to: { m: 1, v: 4, r: 2 } },
  { q: 'm = 2, r = 3 and the spin is 24. What is v?', opts: ['3', '4', '6'], a: 1,
    why: '2 × v × 3 = 24, so 6 × v = 24 and v = 4.', from: { m: 2, v: 1, r: 3 }, to: { m: 2, v: 4, r: 3 } },
  { q: 'Ball A: m 3, v 1, r 2.   Ball B: m 1, v 2, r 3.   Which spins more?', opts: ['A', 'B', 'the same'], a: 2,
    why: 'A: 3 × 1 × 2 = 6.  B: 1 × 2 × 3 = 6.  Exactly the same!', from: { m: 3, v: 1, r: 2 }, to: { m: 1, v: 2, r: 3 } },
  { q: 'Make the circle twice as wide but the ball half as fast. The spin…', opts: ['doubles', 'stays the same', 'halves'], a: 1,
    why: 'r × 2 and v ÷ 2 cancel out: same spin.', from: { m: 1, v: 4, r: 1 }, to: { m: 1, v: 2, r: 2 } },
  { q: 'Swap in a ball 3 times as heavy (same speed, same circle). The spin becomes…', opts: ['× 3', '× 1', '× 9'], a: 0,
    why: 'Only m changed: 3 times the mass, 3 times the spin.', from: { m: 1, v: 2, r: 2 }, to: { m: 3, v: 2, r: 2 } },
  { q: 'Bohr: an electron on shell L has how many blocks of spin?', opts: ['1', '2', '4'], a: 1,
    why: 'K = 1 block, L = 2 blocks, M = 3 blocks: the shell number n.', bohr: 2 },
  { q: 'Can an electron have 2½ blocks of spin?', opts: ['yes, between L and M', 'no, only whole blocks'], a: 1,
    why: 'There is no shell for 2½ blocks, so the electron can never be there.', bohr: 3 },
  { q: 'One block = h/2π. Shell M (n = 3) has mvr = …', opts: ['3 × h/2π', 'h/2π ÷ 3', '9 × h/2π'], a: 0,
    why: 'n blocks of h/2π: that is the book’s mvr = nh/2π.', bohr: 3 },
];

export function start({ stage, ui, level }) {
  const saved = progress.get('spin');
  let idx = Number.isFinite(level) ? level : Math.max(0, PARTS.findIndex((p) => !(p.key in saved)));
  if (idx < 0) idx = 2;
  idx = Math.min(Math.max(idx, 0), PARTS.length - 1);
  ui.innerHTML = `<div class="qpanel2" id="qp"></div><div class="goalbar" id="goal"></div><div class="rinfo" id="rinfo"></div>
    <div class="levels" id="levels"></div><div class="toast" id="toast"></div>`;
  const toast = (html, cls = '') => { const t = $('toast'); t.innerHTML = html; t.className = 'toast show ' + cls; clearTimeout(toast.t); toast.t = setTimeout(() => (t.className = 'toast'), 2600); };
  const B = goalBar($('goal'));
  const place = () => { const wide = innerWidth / innerHeight > 1.15; stage.root.position.set(0, wide ? 0 : 1.2, 0); stage.pedestal.position.x = 0; };
  addEventListener('resize', place); place();

  // ---- the ball on a string (face-on)
  const g = new THREE.Group(); g.position.set(-1.9, 0.35, 0); stage.root.add(g);
  const hub = new THREE.Group(); g.add(hub);
  const hubBall = ball(M.neutron, 0.13); hub.add(hubBall);
  const nucleus = new THREE.Group(); nucleus.add(ball(M.proton, 0.22), glow(0xff6a55, 1.0, 0.5)); hub.add(nucleus);
  const guides = [1, 2, 3].map((r) => { const m = ring(r * RU, ringMat(0x7fb0ff, 0.22), 0.012); g.add(m); return m; });
  const shells = [1, 2, 3].map((n) => { const m = ring(n * n * R1, ringMat(0x7fd0ff, 0.0), 0.03); g.add(m); return m; });
  const STR = new THREE.CylinderGeometry(0.03, 0.03, 1, 8); STR.rotateZ(-Math.PI / 2); STR.translate(0.5, 0, 0);
  const string = new THREE.Mesh(STR, new THREE.MeshStandardMaterial({ color: 0x9fd2ff, emissive: 0x2a6fb0, emissiveIntensity: 0.8 }));
  g.add(string);
  const holder = new THREE.Group(); g.add(holder);
  const steel = new THREE.MeshPhysicalMaterial({ color: 0xdfe6f0, metalness: 0.6, roughness: 0.25, clearcoat: 1 });
  const bodyBall = ball(steel, 0.25); holder.add(bodyBall);
  const eBall = new THREE.Group(); eBall.add(ball(M.electron, 0.17), glow(0x4aa8ff, 0.9, 0.7)); holder.add(eBall);
  const ballHit = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 8), M.hit); holder.add(ballHit);
  // the speed arrow: along the direction of motion, its length = v
  const arrow = new THREE.Group(); holder.add(arrow);
  const SH = new THREE.CylinderGeometry(0.05, 0.05, 1, 10); SH.rotateZ(-Math.PI / 2); SH.translate(0.5, 0, 0);
  const shaft = new THREE.Mesh(SH, M.gold); arrow.add(shaft);
  const CN = new THREE.ConeGeometry(0.14, 0.32, 16); CN.rotateZ(-Math.PI / 2);
  const head = new THREE.Mesh(CN, M.gold); arrow.add(head);
  const tipHit = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 8), M.hit); arrow.add(tipHit);

  // ---- the spin bar (right), a target line, block lines for Bohr's electron
  const bar = new THREE.Group(); bar.position.set(3.9, -2.6, 0); stage.root.add(bar);
  const BOX = new THREE.BoxGeometry(0.9, 1, 0.9); BOX.translate(0, 0.5, 0);
  const fill = new THREE.Mesh(BOX, M.gold); fill.scale.y = 0.001; bar.add(fill);
  const shell3 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 4.8, 1.0).translate(0, 2.4, 0), M.glass); bar.add(shell3);
  const tline = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.06, 0.06), new THREE.MeshBasicMaterial({ color: 0x4dff88, toneMapped: false }));
  bar.add(tline);
  const blines = [1, 2, 3].map((k) => { const l = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.035, 0.035), new THREE.MeshBasicMaterial({ color: 0xffd28a, toneMapped: false })); l.position.y = k * BLK; bar.add(l); return l; });
  const at = (o, x, y) => { const a = new THREE.Object3D(); a.position.set(x, y, 0); o.add(a); return a; };
  const eqTag = stage.tag('', at(bar, 0, 5.35), [0, 0, 0], 'spineq');
  const barTag = stage.tag('amount of spin', at(bar, 0, -0.35), [0, 0, 0], 'gold');
  const tTag = stage.tag('', tline, [1.15, 0, 0], 'big green');
  const bTags = blines.map((l, k) => stage.tag(`${k + 1} block${k ? 's' : ''}`, l, [1.15, 0, 0], 'gold'));
  const checkBtn = stage.tag('✓ check', at(bar, 0, -0.95), [0, 0, 0], 'tbtn go');
  checkBtn.onclick = () => check();
  const mTag = stage.tag('', at(holder, 0, 0.62), [0, 0, 0], 'vtag');
  const vAnchor = at(arrow, 1, 0.42), vTag = stage.tag('', vAnchor, [0, 0, 0], 'vtag');
  const rAnchor = new THREE.Object3D(); g.add(rAnchor);
  const rTag = stage.tag('', rAnchor, [0, 0, 0], 'vtag');
  const hintTag = stage.tag('', at(holder, 0, -0.75), [0, 0, 0], 'tapme');
  const shellTags = shells.map((s, k) => stage.tag(SHELL[k], at(g, (k + 1) * (k + 1) * R1 * 0.72 + 0.1, -(k + 1) * (k + 1) * R1 * 0.72 - 0.1), [0, 0, 0], 'big blue'));

  // ---- the green twin (👯 twin, ⚡ quick): a see-through ball on the same circles, and its own bar
  const ghost = new THREE.Group(); g.add(ghost);
  const gMat = new THREE.MeshStandardMaterial({ color: 0x4dff88, emissive: 0x1d7a40, emissiveIntensity: 0.9, transparent: true,
    opacity: 0.55, depthWrite: false });
  const gString = new THREE.Mesh(STR, gMat); ghost.add(gString);
  const gHolder = new THREE.Group(); ghost.add(gHolder);
  const gBall = ball(gMat, 0.25); gHolder.add(gBall);
  const gArrow = new THREE.Group(); gHolder.add(gArrow);
  const gShaft = new THREE.Mesh(SH, gMat), gHead = new THREE.Mesh(CN, gMat); gArrow.add(gShaft, gHead);
  const gTag = stage.tag('', at(gHolder, 0, 0.62), [0, 0, 0], 'vtag');
  const gbar = new THREE.Group(); gbar.position.set(5.25, -2.6, 0); stage.root.add(gbar);
  const gFill = new THREE.Mesh(BOX, gMat); gFill.scale.y = 0.001; gbar.add(gFill);
  gbar.add(new THREE.Mesh(shell3.geometry, M.glass));
  const gTop = at(gbar, 0, 0.4), gTopTag = stage.tag('', gTop, [0, 0, 0], 'big green');
  const gLbl = stage.tag('twin', at(gbar, 0, -0.35), [0, 0, 0], 'green');
  const gv = { m: 1, v: 1, r: 1 };
  let ghostOn = false, showG = true, gth = 0.6 + Math.PI, grVis = 1, gmVis = 1, glen = 0.6, gBarVis = 0;
  function setGhost(on) {
    ghostOn = on; ghost.visible = gbar.visible = on;
    [gTag, gTopTag, gLbl].forEach((t) => (t.style.display = on ? '' : 'none'));
  }

  // ---- state: values, what may change, how things look
  const val = { m: 1, v: 1, r: 1 };
  let goalHtml = '', bohr = false, rB = R1, locked = new Set(), showBar = true, showEq = true, target = 0, found = new Set();
  let th = 0.6, rVis = 1, lenVis = 0.5, mVis = 1, barVis = 0, frozen = false, hint = null, T = 0;
  const spin = () => (bohr ? Math.sqrt(rB / R1) : val.m * val.v * val.r);
  const vB = () => 1.2 / Math.sqrt(rB);                    // Bohr: farther out = slower (pulled less by the nucleus)

  function setMode(isBohr) {
    bohr = isBohr;
    bodyBall.visible = !bohr; eBall.visible = bohr; hubBall.visible = !bohr; nucleus.visible = bohr;
    guides.forEach((m) => (m.visible = !bohr));
    blines.forEach((l) => (l.visible = bohr)); bTags.forEach((t) => (t.style.display = bohr ? '' : 'none'));
    found.clear();
    shells.forEach((m) => (m.material.opacity = 0)); shellTags.forEach((t) => (t.style.display = 'none'));
    if (bohr) { rB = R1; rVis = R1; }
  }
  function setVals(o, now = false) {
    Object.assign(val, o);
    if (now) { rVis = val.r; mVis = val.m; lenVis = 0.25 + 0.38 * val.v; }
    render();
  }
  function setTarget(t) { target = t; tline.visible = !!t && !bohr; tTag.style.display = t && !bohr ? '' : 'none'; tTag.textContent = t || ''; }

  // live text: the equation (pieces coloured like the things they name)
  function render() {
    const p = (k) => `<b style="color:${COL[k]}">${locked.has(k) && L.key !== 'quiz' ? '🔒' : ''}${val[k]}</b>`;
    if (bohr) eqTag.innerHTML = showEq ? `spin = <b>${spin().toFixed(1)}</b> blocks` : goalHtml;
    else if (!showEq) eqTag.innerHTML = '';
    else if (!showBar) eqTag.innerHTML = `<span class="names">m × v × r</span>${p('m')} × ${p('v')} × ${p('r')} = <b class="tgt">${target}</b> ?`;
    else eqTag.innerHTML = `<span class="names">m × v × r</span>${p('m')} × ${p('v')} × ${p('r')} = <b>${spin()}</b>`;
    mTag.innerHTML = bohr ? '' : `<b style="color:${COL.m}">m ${val.m}</b>`;
    vTag.innerHTML = bohr ? '' : `<b style="color:${COL.v}">v ${val.v}</b>`;
    rTag.innerHTML = bohr ? '' : `<b style="color:${COL.r}">r ${val.r}</b>`;
    checkBtn.style.display = !bohr && !showBar && L && L.key === 'game' ? '' : 'none';
    gTag.innerHTML = `<b style="color:#4dff88">m ${gv.m} · v ${gv.v} · r ${gv.r}</b>`;
    gTopTag.textContent = showG ? String(gv.m * gv.v * gv.r) : '';
    barTag.style.display = showBar ? '' : 'none';
  }

  stage.onFrame((dt) => {
    T += dt;
    const r = bohr ? rB : val.r, v = bohr ? vB() : val.v;
    rVis += (r - rVis) * Math.min(1, dt * (bohr ? 14 : 8));
    mVis += ((bohr ? 1 : val.m) - mVis) * Math.min(1, dt * 8);
    lenVis += (0.25 + 0.38 * v - lenVis) * Math.min(1, dt * 8);
    const rw = rVis * (bohr ? 1 : RU);                         // radius in the scene
    if (!frozen) th += (0.9 * v / Math.max(rw, 0.3)) * dt;
    const c = Math.cos(th), s = Math.sin(th);
    holder.position.set(c * rw, s * rw, 0);
    const br = bohr ? 0.17 : 0.17 + 0.08 * mVis;
    bodyBall.scale.setScalar(br * (hint === 'tap' || hint === 'drag' ? 1 + 0.12 * Math.sin(T * 6) : 1));
    string.rotation.z = th; string.scale.x = Math.max(0.01, rw - br);
    arrow.rotation.z = th + Math.PI / 2;
    shaft.position.x = br; shaft.scale.x = lenVis; head.position.x = br + lenVis + 0.14;
    tipHit.position.x = br + lenVis + 0.2;
    vAnchor.position.x = br + lenVis + 0.2;                                    // the v label rides on the tip
    head.scale.setScalar(hint === 'arrow' ? 1 + 0.25 * Math.sin(T * 6) : 1);
    rAnchor.position.set(c * rw * 0.5 - s * 0.3, s * rw * 0.5 + c * 0.3, 0);
    const want = showBar ? (bohr ? spin() * BLK : spin() * HPU) : 0;
    barVis += (want - barVis) * Math.min(1, dt * 7);
    fill.scale.y = Math.max(0.001, barVis);
    tline.position.y = target * HPU;
    shells.forEach((m, k) => { const w = found.has(k + 1) ? 0.75 : 0; m.material.opacity += (w - m.material.opacity) * Math.min(1, dt * 5); });
    if (ghostOn) {
      const k = Math.min(1, dt * 8);
      grVis += (gv.r - grVis) * k; gmVis += (gv.m - gmVis) * k; glen += (0.25 + 0.38 * gv.v - glen) * k;
      const rw2 = grVis * RU; gth += (0.9 * gv.v / rw2) * dt;
      const c2 = Math.cos(gth), s2 = Math.sin(gth), br2 = 0.17 + 0.08 * gmVis;
      gHolder.position.set(c2 * rw2, s2 * rw2, 0); gBall.scale.setScalar(br2);
      gString.rotation.z = gth; gString.scale.x = Math.max(0.01, rw2 - br2);
      gArrow.rotation.z = gth + Math.PI / 2; gShaft.position.x = br2; gShaft.scale.x = glen; gHead.position.x = br2 + glen + 0.14;
      gBarVis += ((showG ? gv.m * gv.v * gv.r * HPU : 0) - gBarVis) * Math.min(1, dt * 7);
      gFill.scale.y = Math.max(0.001, gBarVis); gTop.position.y = gBarVis + 0.4;
    }
    if (bohr) render();
  });

  // ---- hands: tap the ball (heavier), drag the ball (radius), drag the arrow tip (speed)
  const cvs = stage.renderer.domElement, ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const plane = new THREE.Plane(), hp = new THREE.Vector3();
  let drag = null;
  function setRay(ev) { const r = cvs.getBoundingClientRect(); ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, stage.camera); }
  function planePoint() {
    g.updateMatrixWorld();
    plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), g.getWorldPosition(new THREE.Vector3()));
    return ray.ray.intersectPlane(plane, hp) ? g.worldToLocal(hp.clone()) : null;
  }
  cvs.parentElement.addEventListener('pointerdown', (ev) => {
    if (ev.target !== cvs || busy || (L && (L.key === 'quiz' || L.key === 'quick'))) return;
    setRay(ev);
    const what = ray.intersectObject(tipHit).length && !bohr ? 'v' : ray.intersectObject(ballHit).length ? 'ball' : null;
    if (!what) return;
    drag = { what, id: ev.pointerId, x: ev.clientX, y: ev.clientY, moved: false, r0: rB };
    frozen = true; stage.controls.enabled = false; cvs.style.cursor = 'grabbing';
  }, true);
  addEventListener('pointermove', (ev) => {
    if (!drag || ev.pointerId !== drag.id) return;
    if (Math.hypot(ev.clientX - drag.x, ev.clientY - drag.y) > 8) drag.moved = true;
    if (!drag.moved) return;
    setRay(ev); const p = planePoint(); if (!p) return;
    if (drag.what === 'ball') {
      const d = Math.hypot(p.x, p.y);
      th = Math.atan2(p.y, p.x);
      if (bohr) rB = Math.min(Math.max(d, R1 * 0.6), 9 * R1 + 0.35);
      else change('r', Math.min(Math.max(Math.round(d / RU), 1), MAX.r));
    } else {
      const c = Math.cos(th), s = Math.sin(th), bx = c * rVis * RU, by = s * rVis * RU;
      const along = (p.x - bx) * -s + (p.y - by) * c;           // how far along the direction of motion
      change('v', Math.min(Math.max(Math.round((along - 0.3) / 0.38), 1), MAX.v));
    }
  });
  const end = (ev) => {
    if (!drag || (ev && ev.pointerId !== drag.id)) return;
    const d = drag; drag = null; frozen = false; stage.controls.enabled = true; cvs.style.cursor = '';
    if (d.what === 'ball' && !d.moved && !bohr) change('m', val.m % MAX.m + 1);
    if (d.what === 'ball' && d.moved && bohr) parked(d.r0);
  };
  addEventListener('pointerup', end); addEventListener('pointercancel', end);

  function change(k, x) {
    if (val[k] === x) return;
    if (locked.has(k)) { sfx.buzz(); shakeEl({ m: mTag, v: vTag, r: rTag }[k]); return; }
    val[k] = x; sfx.pop(); render(); changed(k);
  }

  // ---- parts
  let L = PARTS[idx], busy = false, done = false;
  function levelDots() {
    const s = progress.get('spin');
    $('levels').innerHTML = PARTS.map((p, i) => `<button class="lv part${i === idx ? ' on' : ''}${p.key in s ? ' won' : ''}" data-lv="${i}">${p.icon} ${p.name}</button>`).join('');
  }
  $('levels').onclick = (ev) => { const b = ev.target.closest('[data-lv]'); if (b && !busy) load(+b.dataset.lv); };
  function setHint(h, text = '') { hint = h; hintTag.style.display = h ? '' : 'none'; hintTag.textContent = text; }

  function load(i) {
    idx = i; L = PARTS[i]; done = false; busy = false;
    history.replaceState(null, '', `?game=spin&level=${i}`);
    $('qp').innerHTML = ''; locked = new Set(); showBar = true; showEq = true; goalHtml = '';
    clearInterval(quick.timer); clearInterval(climb.timer); setGhost(false); showG = true;
    setMode(false); setTarget(0); setVals({ m: 1, v: 1, r: 1 }, true); setHint(null);
    $('goal').style.display = MINI.includes(L.key) ? 'none' : ''; $('rinfo').style.display = MINI.includes(L.key) ? '' : 'none';
    if (L.key === '0') { ex.clear(); drawExplore(); }
    if (L.key === 'try') { tstep = 0; startTry(); }
    if (L.key === 'game') startGame();
    if (L.key === 'quiz') startQuiz();
    if (L.key === 'twin') startTwin();
    if (L.key === 'quick') startQuick();
    if (L.key === 'climb') startClimb();
    levelDots(); render();
  }
  function changed(k) {
    if (L.key === '0') { ex.add(k); drawExplore(); if (ex.size === 3 && !('0' in progress.get('spin'))) { progress.set('spin', '0', 0); levelDots(); sfx.win(); toast('✓ <b>Heavier, faster, wider: all three make more spin!</b>', 'good'); } }
    if (L.key === 'try') tryCheck();
    if (L.key === 'game') gameCheck();
    if (L.key === 'twin') twinCheck();
  }
  function celebrate(msg, next, delay = 2000) {
    sfx.win(); confetti(stage, bar.localToWorld(new THREE.Vector3(0, 3, 0)), 50);
    toast(`✓ <b>${msg}</b>`, 'good');
    busy = true; setTimeout(() => { busy = false; next(); }, delay);
  }

  // 💡 explore: free play, three things to discover
  const ex = new Set();
  const drawExplore = () => B.draw([
    { text: 'Play with the ball:', bold: true },
    { text: 'tap it', tick: ex.has('m') }, { text: 'drag it', tick: ex.has('r') }, { text: 'stretch the gold arrow', tick: ex.has('v') }]);

  // 🎨 try: one move at a time, then a target, then a missing piece, then Bohr's electron
  let tstep = 0;
  const TRY = [
    { text: 'Tap the ball: make it heavier (m)', hint: 'tap', tag: 'tap', start: { m: 1, v: 1, r: 1 }, ok: () => val.m === 2,
      say: 'Heavier → the bar grows: 2 × as much spin' },
    { text: 'Stretch the gold arrow: faster (v)', hint: 'arrow', start: null, ok: () => val.v === 2,
      say: 'Faster → the bar grows again' },
    { text: 'Drag the ball out to the next ring: wider (r)', hint: 'drag', tag: 'drag out', start: null, ok: () => val.r === 2,
      say: 'Wider → more spin. Spin = m × v × r' },
    { text: 'Make the bar reach the green line (12)', target: 12, start: { m: 1, v: 1, r: 1 }, ok: () => spin() === 12,
      say: 'Many ways make 12: 2 × 2 × 3, 1 × 4 × 3 …' },
    { text: 'm and r are locked 🔒. Change v so that m × v × r = 12', target: 12, lock: ['m', 'r'], start: { m: 2, v: 1, r: 3 },
      ok: () => spin() === 12, say: '2 × v × 3 = 12  →  v = 2' },
    { text: "Now an electron (Bohr). Drag it out until the bar reaches 2 blocks", bohr: true, hint: 'drag', tag: 'drag out',
      ok: () => found.has(2), say: '2 whole blocks = shell L. In between is not allowed!' },
  ];
  function startTry() {
    const S = TRY[tstep];
    locked = new Set(S.lock || []);
    if (S.bohr) setMode(true);
    if (S.start) setVals(S.start);
    setTarget(S.target || 0);
    setHint(S.hint || null, S.tag || '');
    B.draw([{ dots: TRY.map((x, i) => (i < tstep ? 'ok' : i === tstep ? 'on' : '')) }, { text: S.text, bold: true }]);
    render();
  }
  function tryCheck() {
    const S = TRY[tstep];
    if (!S || busy || !S.ok()) return;
    setHint(null);
    if (tstep === TRY.length - 1) { progress.set('spin', 'try', 0); levelDots(); return celebrate(S.say + ' → now the game!', () => load(2), 2600); }
    celebrate(S.say, () => { tstep++; startTry(); }, 2200);
  }

  // Bohr: let go of the electron. Whole blocks → a shell appears; in between → it slides back
  function parked(back = R1) {
    const b = spin(), n = Math.round(b);
    if (n >= 1 && n <= 3 && Math.abs(b - n) < 0.13) {
      rB = n * n * R1; found.add(n); shellTags[n - 1].style.display = ''; sfx.ding();
      if (L.key === 'try') tryCheck();
      if (L.key === 'game') gameCheck(n);
      if (L.key === 'climb') climbCheck(n);
    } else {
      sfx.buzz(); game.miss++; climb.miss++;
      const r0 = rB, r1 = back;                               // not allowed: it slides back where it came from
      const wob = stage.tag('✗', holder, [0, 0.5, 0], 'big red'); setTimeout(() => stage.untag(wob), 900);
      tween(0.5, (k) => { rB = r0 + (r1 - r0) * k; });
    }
  }

  // 🎮 game: 11 rounds, no hints
  const game = { r: 0, pts: [], miss: 0 };
  function startGame() { Object.assign(game, { r: 0, pts: [], miss: 0 }); startRound(true); }
  function startRound(first) {
    const Rd = ROUNDS[game.r], newStage = first || ROUNDS[game.r - 1].stage !== Rd.stage;
    game.miss = 0; done = false; goalHtml = '';
    setMode(Rd.kind === 'bohr');
    locked = new Set(Rd.kind === 'solve' ? ['m', 'v', 'r'].filter((k) => k !== Rd.free) : []);
    showBar = Rd.kind !== 'solve'; showEq = Rd.kind !== 'bohr';
    if (Rd.start) setVals(Rd.start);
    setTarget(Rd.kind === 'bohr' ? 0 : Rd.target);
    eqGoal(Rd);
    if (newStage) toast(`<b>${STAGES[Rd.stage]}</b>`, 'disc');
    $('rinfo').textContent = `${game.r + 1} / ${ROUNDS.length}   ★ ${game.pts.reduce((a, b) => a + b, 0)}`;
    render();
  }
  // the round's task sits on the bar itself: a number (reach / solve) or "n blocks" (Bohr): no extra instructions
  function eqGoal(Rd) {
    if (Rd.kind === 'bohr') { goalHtml = `<b class="tgt">${Rd.n} block${Rd.n > 1 ? 's' : ''}</b>`; blines.forEach((l, k) => (l.material.color.set(k + 1 === Rd.n ? 0x4dff88 : 0xffd28a))); }
  }
  function gameCheck(n) {
    const Rd = ROUNDS[game.r];
    if (!Rd || done || busy) return;
    if (Rd.kind === 'reach' && spin() === Rd.target) win(3);
    if (Rd.kind === 'bohr' && n !== undefined) { if (n === Rd.n) win(game.miss === 0 ? 3 : game.miss === 1 ? 2 : 1); else { game.miss++; sfx.buzz(); } }
    if (Rd.kind === 'bohr') eqGoal(Rd);
  }
  function check() {
    const Rd = ROUNDS[game.r];
    if (!Rd || Rd.kind !== 'solve' || done || busy) return;
    showBar = true; render();                                  // the bar shows what this choice really makes
    if (spin() === Rd.target) return win(game.miss === 0 ? 3 : game.miss === 1 ? 2 : 1);
    game.miss++; sfx.buzz(); shakeEl(eqTag);
    busy = true; setTimeout(() => { busy = false; showBar = false; render(); }, 1500);
  }
  function win(p) {
    done = true; game.pts.push(p);
    const last = game.r === ROUNDS.length - 1;
    celebrate('★'.repeat(p), () => { if (last) endGame(); else { game.r++; startRound(false); } }, 1900);
  }
  function endGame() {
    const s = game.pts.reduce((a, b) => a + b, 0), N = ROUNDS.length * 3, stars = s >= N - 3 ? 3 : s >= N * 0.7 ? 2 : 1;
    progress.set('spin', 'game', stars); levelDots();
    modal(`<div class="stars">${starStr(stars)}</div><h2>Game complete: ${s} / ${N}</h2>
      <p>${stars === 3 ? 'Brilliant! You can make any spin, find any missing piece, and park electrons on whole blocks.' : 'Well done! Play again for more stars.'}</p>
      <div class="row"><button id="mReplay">↺ Play again</button><button id="mQuiz" class="go">Next game: 👯 Twin →</button></div>`);
    $('mReplay').onclick = () => { closeModal(); load(PI('game')); };
    $('mQuiz').onclick = () => { closeModal(); load(PI('twin')); };
  }

  // 🏆 quiz: tricky questions; after each answer the ball (or the electron) acts it out
  const quiz = { k: 0, score: 0, results: [] };
  function startQuiz() { Object.assign(quiz, { k: 0, score: 0, results: [] }); showQuestion(); }
  function drawQuestion(extra) {
    const Q = QUIZ[quiz.k];
    B.draw([{ dots: QUIZ.map((q, i) => (i < quiz.results.length ? (quiz.results[i] ? 'ok' : 'no') : i === quiz.k ? 'on' : '')) },
      extra || { text: Q.q, bold: true, long: true }]);
  }
  function showQuestion() {
    const Q = QUIZ[quiz.k];
    quiz.answered = false; locked = new Set(['m', 'v', 'r']);
    setMode(!!Q.bohr); setTarget(0);
    if (Q.from) setVals(Q.from);
    if (Q.bohr) { rB = R1; showEq = false; } else showEq = true;
    drawQuestion(); render();
    $('qp').innerHTML = Q.opts.map((o, i) => `<button data-o="${i}">${o}</button>`).join('');
    $('qp').onclick = (ev) => { const b = ev.target.closest('[data-o]'); if (b && !quiz.answered) answer(+b.dataset.o === Q.a, b); };
  }
  function answer(right, btn) {
    const Q = QUIZ[quiz.k];
    quiz.answered = true; quiz.results.push(right);
    if (right) quiz.score++;
    btn.classList.add(right ? 'ok' : 'no');
    if (!right) $('qp').querySelector(`[data-o="${Q.a}"]`).classList.add('ok');
    right ? sfx.ding() : sfx.buzz();
    drawQuestion({ text: (right ? '✓ ' : '✗ ') + Q.why, color: right ? '#9dffbf' : '#ffb0a8', long: true });
    // act it out
    if (Q.to) setTimeout(() => { setVals(Q.to); }, 500);
    if (Q.bohr) { showEq = true; [1, 2, 3].filter((n) => n <= Q.bohr).forEach((n, i) => setTimeout(() => { rB = n * n * R1; found.add(n); shellTags[n - 1].style.display = ''; sfx.pop(); }, 500 + 700 * i)); }
    const last = quiz.k === QUIZ.length - 1;
    $('qp').insertAdjacentHTML('beforeend', `<button id="qNext" class="go">${last ? 'See my score →' : 'Next →'}</button>`);
    $('qNext').onclick = () => { if (last) finishQuiz(); else { quiz.k++; showQuestion(); } };
  }
  function finishQuiz() {
    $('qp').innerHTML = '';
    const s = quiz.score, N = QUIZ.length, stars = s === N ? 3 : s >= N - 2 ? 2 : 1;
    progress.set('spin', 'quiz', stars); levelDots();
    sfx.win(); confetti(stage, bar.localToWorld(new THREE.Vector3(0, 3, 0)));
    modal(`<div class="stars">${starStr(stars)}</div><h2>Quiz: ${s} / ${N}</h2>
      <p>${s === N ? 'Perfect! You really know m × v × r and Bohr’s whole blocks.' : s >= N - 2 ? 'Great work!' : 'Good try! Play the game again, then retake the quiz.'}</p>
      <div class="row"><button id="mReplay">↺ Retake quiz</button><a class="go" href="games.html">All games</a></div>`);
    $('mReplay').onclick = () => { closeModal(); load(PI('quiz')); };
  }

  // one ending for the three small games: stars, then on to the next tab
  function endMini(key, title, stars, line) {
    progress.set('spin', key, stars); levelDots();
    sfx.win(); confetti(stage, bar.localToWorld(new THREE.Vector3(0, 3, 0)));
    modal(`<div class="stars">${starStr(stars)}</div><h2>${title}</h2><p>${line}</p>
      <div class="row"><button id="mReplay">↺ Play again</button><button id="mNext" class="go">${PARTS[idx + 1].icon} ${PARTS[idx + 1].name} →</button></div>`);
    $('mReplay').onclick = () => { closeModal(); load(idx); };
    $('mNext').onclick = () => { closeModal(); load(idx + 1); };
  }

  // 👯 twin: the same spin as the green twin, but not a copy (2 × 3 × 2 = 12 = 1 × 4 × 3 …)
  const twin = { k: 0, pts: [], miss: 0 };
  function startTwin() { Object.assign(twin, { k: 0, pts: [] }); twinRound(true); }
  function twinRound(first) {
    const T0 = TWINS[twin.k]; twin.miss = 0; done = false; twin.copy = false;
    setGhost(true); Object.assign(gv, T0); showG = true;
    setVals({ m: 1, v: 1, r: 1 });
    if (first) toast('<b>👯 Same spin as the green twin, but not a copy!</b>', 'disc');
    $('rinfo').textContent = `${twin.k + 1} / ${TWINS.length}   ★ ${twin.pts.reduce((a, b) => a + b, 0)}`;
    render();
  }
  function twinCheck() {
    if (done || busy) return;
    const T0 = TWINS[twin.k], copy = val.m === T0.m && val.v === T0.v && val.r === T0.r;
    if (spin() !== T0.m * T0.v * T0.r) return;
    if (copy) { if (!twin.copy) toast('<b>That is a copy! Find another way to make it.</b>'); twin.copy = true; twin.miss = 1; return; }
    done = true;
    const p = twin.miss ? 2 : 3; twin.pts.push(p);
    const last = twin.k === TWINS.length - 1, sc = twin.pts.reduce((a, b) => a + b, 0);
    celebrate(`${val.m} × ${val.v} × ${val.r} = ${T0.m} × ${T0.v} × ${T0.r}   ${'★'.repeat(p)}`, () => {
      if (last) endMini('twin', `Twins: ${sc} / ${TWINS.length * 3}`, sc >= 14 ? 3 : sc >= 11 ? 2 : 1, 'Different balls, same spin: only m × v × r counts.');
      else { twin.k++; twinRound(false); }
    }, 2200);
  }

  // ⚡ quick: which spins more, silver or green? 45 seconds; the bars only show after you answer
  const quick = { left: 45, score: 0, streak: 0, best: 0, timer: null, open: false };
  const rnd = (n) => 1 + Math.floor(Math.random() * n);
  function startQuick() {
    setGhost(true);
    Object.assign(quick, { left: 45, score: 0, streak: 0, best: 0 });
    toast('<b>⚡ Which spins more? 45 seconds!</b>', 'disc');
    quickQ();
    quick.timer = setInterval(() => { if (!$('rinfo')) return clearInterval(quick.timer); quick.left--; quickInfo(); if (quick.left <= 0) { clearInterval(quick.timer); endQuick(); } }, 1000);
  }
  const quickInfo = () => $('rinfo') && ($('rinfo').textContent = `⏱ ${quick.left}   ✓ ${quick.score}${quick.streak > 1 ? `   🔥 ${quick.streak}` : ''}`);
  function quickQ() {
    let a = { m: rnd(3), v: rnd(4), r: rnd(3) }, b = { m: rnd(3), v: rnd(4), r: rnd(3) };
    if (Math.random() < 0.3) {                       // tricky: a different ball with the same spin
      const t = a.m * a.v * a.r, opts = [];
      for (let m = 1; m <= 3; m++) for (let v = 1; v <= 4; v++) for (let r = 1; r <= 3; r++)
        if (m * v * r === t && !(m === a.m && v === a.v && r === a.r)) opts.push({ m, v, r });
      if (opts.length) b = opts[Math.floor(Math.random() * opts.length)];
    }
    setVals(a); Object.assign(gv, b);
    showBar = false; showG = false; showEq = false; quick.open = true;
    $('qp').innerHTML = '<button data-q="me">silver</button><button data-q="same">same</button><button data-q="ghost">green</button>';
    $('qp').onclick = (ev) => { const bt = ev.target.closest('[data-q]'); if (bt && quick.open) quickAnswer(bt); };
    quickInfo(); render();
  }
  function quickAnswer(bt) {
    quick.open = false;
    const me = spin(), gh = gv.m * gv.v * gv.r, ok = bt.dataset.q === (me > gh ? 'me' : me < gh ? 'ghost' : 'same');
    bt.classList.add(ok ? 'ok' : 'no');
    if (ok) { quick.score++; quick.streak++; quick.best = Math.max(quick.best, quick.streak); sfx.ding(); } else { quick.streak = 0; sfx.buzz(); }
    showBar = showG = showEq = true; render(); quickInfo();      // now both bars show the answer
    setTimeout(() => { if (L.key === 'quick' && quick.left > 0) quickQ(); }, ok ? 900 : 1700);
  }
  function endQuick() {
    quick.open = false; $('qp').innerHTML = '';
    const s2 = quick.score;
    endMini('quick', `Quick: ${s2} right`, s2 >= 12 ? 3 : s2 >= 8 ? 2 : 1, `Best streak: ${quick.best}. Times it out in your head: m × v × r.`);
  }

  // 🪜 climb: park Bohr's electron K → L → M → L → K as fast as you can
  const climb = { k: 0, t0: 0, miss: 0, timer: null };
  function climbGoal() {
    goalHtml = CLIMB.map((n, i) => `<span class="${i < climb.k ? 'ok' : i === climb.k ? 'now' : ''}">${SHELL[n - 1]}</span>`).join(' → ');
  }
  function startClimb() {
    setMode(true); showEq = false;
    Object.assign(climb, { k: 0, miss: 0, t0: performance.now() });
    climbGoal();
    toast('<b>🪜 Hop: L → M → L → K → M. Fast!</b>', 'disc');
    const info = () => $('rinfo') ? ($('rinfo').textContent = `⏱ ${((performance.now() - climb.t0) / 1000).toFixed(1)} s   ✗ ${climb.miss}`) : clearInterval(climb.timer);
    info(); climb.timer = setInterval(info, 100);
  }
  function climbCheck(n) {
    if (done) return;
    if (n !== CLIMB[climb.k]) { climb.miss++; sfx.buzz(); return; }
    climb.k++; climbGoal();
    if (climb.k < CLIMB.length) return;
    done = true; clearInterval(climb.timer);
    const t = (performance.now() - climb.t0) / 1000, stars = climb.miss === 0 && t < 30 ? 3 : climb.miss <= 2 && t < 60 ? 2 : 1;
    setTimeout(() => endMini('climb', `Climb: ${t.toFixed(1)} s`, stars, `Misses: ${climb.miss}. Only whole blocks: 1, 2, 3 … never in between.`), 700);
  }

  load(idx);
  return { load, get val() { return val; }, change, setVals, check, parkAt: (r) => { const b = rB; rB = r; parked(b); }, goRound: (i) => { game.r = i; startRound(true); }, ballPos: () => holder.getWorldPosition(new THREE.Vector3()), tipPos: () => tipHit.getWorldPosition(new THREE.Vector3()), get round() { return game.r; } };
}
