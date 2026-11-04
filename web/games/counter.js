// Neutron Counter (long question iii): one atom at a time, no typing and no maths: you watch the numbers happen.
// The jar fills with A marbles (the top number). Tap the jar: Z red protons hop into the dish and Z electrons orbit;
// the grey marbles left in the jar are the neutrons (A - Z), counted live. Then one question per atom: pick one of
// three numbers on screen. Right answer: fireworks, then the next atom by itself.
import { THREE, $, sfx, confetti, progress, tween, sleep, ease, M, nuc } from './kit.js';
import { element } from './atom.js';

const ROWS = [['a', 54, 131], ['b', 27, 59], ['c', 60, 144], ['d', 22, 48], ['e', 72, 178], ['f', 52, 128], ['g', 18, 40]];
const R = 0.17;

function slotsIn(radius, n) {                     // marble slots, layer by layer (hexagonal rings in a circle)
  const out = [], step = 2 * R * 1.02;
  for (let layer = 0; out.length < n; layer++) {
    const y = R + layer * step * 0.86, off = (layer % 2) * step * 0.5;
    for (let x = -radius; x <= radius; x += step) for (let z = -radius; z <= radius; z += step * 0.87) {
      const xx = x + off;
      if (Math.hypot(xx, z) <= radius - R && out.length < n) out.push(new THREE.Vector3(xx, y, z));
    }
  }
  return out;
}

export function start({ stage, ui, level }) {
  ui.innerHTML = `<div class="labgoal" id="goal"></div><div class="levels" id="levels"></div><div class="toast" id="toast"></div>`;
  const place = () => { const wide = innerWidth / innerHeight > 1.15; stage.root.position.set(0, wide ? 0 : 1.2, 0); stage.pedestal.position.x = 0; };
  addEventListener('resize', place); place();
  const toast = (html, cls = '') => { const t = $('toast'); t.innerHTML = html; t.className = 'toast show ' + cls; clearTimeout(toast.t); toast.t = setTimeout(() => (t.className = 'toast'), 2800); };
  const saved = progress.get('count');
  let sel = Number.isFinite(level) ? level : Math.max(0, ROWS.findIndex((r, i) => !saved[i]));
  sel = Math.min(Math.max(sel, 0), ROWS.length - 1);

  // ---- 3D: jar, dish, marbles (instanced), electrons (instanced)
  const g = new THREE.Group(); g.position.y = -2.3; stage.root.add(g);
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xa8c8ff, transparent: true, opacity: 0.13, roughness: 0.05, side: THREE.DoubleSide, depthWrite: false });
  const jarPos = new THREE.Vector3(-1.6, 0, 0), dishPos = new THREE.Vector3(2.5, 0, 0);
  const jar = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.6, 4.4, 48, 1, true), glass); jar.position.copy(jarPos).setY(2.2); g.add(jar);
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.25, 3.4, 48, 1, true), glass); dish.position.copy(dishPos).setY(1.7); g.add(dish);
  for (const [p, r] of [[jarPos, 1.6], [dishPos, 1.25]]) {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(r + 0.1, r + 0.1, 0.12, 48), new THREE.MeshPhysicalMaterial({ color: 0x1a2232, metalness: 0.6, roughness: 0.3 }));
    base.position.copy(p).setY(-0.06); g.add(base);
  }
  const jarHit = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 4.8, 16), M.hit); jarHit.position.copy(jarPos).setY(2.3);
  jarHit.userData.jar = true; g.add(jarHit); stage.pickable(jarHit);
  const MAX = 180, geo = new THREE.SphereGeometry(R, 16, 10);
  const marbles = new THREE.InstancedMesh(geo, new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.3, clearcoat: 1 }), MAX);
  marbles.instanceMatrix.setUsage(THREE.DynamicDrawUsage); marbles.frustumCulled = false; g.add(marbles);
  const ecount = 80, eg = new THREE.InstancedMesh(new THREE.SphereGeometry(0.07, 10, 6), M.electron, ecount); eg.frustumCulled = false; g.add(eg);
  const grey = new THREE.Color(0xb8bfca), red = new THREE.Color(0xe8483f), tmp = new THREE.Object3D();
  const jarSlots = slotsIn(1.5, MAX), dishSlots = slotsIn(1.15, MAX);
  let anim = [], T = 0, eShow = 0, live = false;
  const at = (fn) => ({ getWorldPosition: (v) => g.localToWorld(fn(v)), visible: true, scale: { x: 1 } });
  // numbers only, each one right on its own group: grey jar, red dish, blue electrons (no maths needed: you watch them)
  const tagJ = stage.tag('', at((v) => v.copy(jarPos).setY(4.9)), [0, 0, 0], 'big cnt grey');
  const tagD = stage.tag('', at((v) => v.copy(dishPos).setY(3.9)), [0, 0, 0], 'big cnt red');
  const tagE = stage.tag('', at((v) => v.set(0.45, 3.4, 0)), [0, 0, 0], 'big cnt blue');
  const tapJar = stage.tag('tap', at((v) => v.copy(jarPos).setY(3.2)), [0, 0, 0], 'tapme'); tapJar.style.display = 'none';
  const bubbles = [-1.6, 0.45, 2.5].map((x) => { const b = stage.tag('', at((v) => v.set(x, 6.0, 0)), [0, 0, 0], 'tbtn bubble'); b.style.display = 'none'; return b; });

  stage.onFrame((dt, t) => {
    T += dt;
    let inJar = 0, inDish = 0;
    for (let i = 0; i < MAX; i++) {
      const a = anim[i];
      if (!a) { tmp.scale.setScalar(0); tmp.position.set(0, -50, 0); tmp.updateMatrix(); marbles.setMatrixAt(i, tmp.matrix); continue; }
      const k = Math.min(1, Math.max(0, (T - a.start) / a.dur));
      tmp.scale.setScalar(a.phase === 1 && T < a.start ? 0 : 1);
      tmp.position.lerpVectors(a.from, a.to, ease.out(k)); tmp.position.y += Math.sin(k * Math.PI) * a.lift;
      tmp.updateMatrix(); marbles.setMatrixAt(i, tmp.matrix);
      if (a.phase === 1 ? k >= 1 : a.phase === 3 || T < a.start) inJar++; else if (k >= 1) inDish++;
    }
    marbles.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < ecount; i++) {
      const on = i < eShow, ang = t * 0.6 + (2 * Math.PI * i) / Math.max(eShow, 1);
      tmp.position.set(0.45 + 4.3 * Math.cos(ang), 2.4 + 0.5 * Math.sin(ang * 2), 1.6 * Math.sin(ang));
      tmp.scale.setScalar(on ? 1 : 0); tmp.updateMatrix(); eg.setMatrixAt(i, tmp.matrix);
    }
    eg.instanceMatrix.needsUpdate = true;
    if (live) { tagJ.textContent = inJar || ''; tagD.textContent = inDish || ''; tagE.textContent = eShow || ''; }
  });

  // one question per atom; every answer is a number you can see (top number of the symbol, or a group you watched)
  const ASK = ['neutrons', 'protons', 'neutrons', 'electrons', 'neutrons', 'mass number', 'neutrons'];
  const right = (q, Z, mass) => (q === 'neutrons' ? mass - Z : q === 'mass number' ? mass : Z);
  let step = '', token = 0, wrong = 0;
  const goal = (txt) => { const [, Z, M_] = ROWS[sel]; $('goal').innerHTML = `${nuc(element(Z)[0], M_, Z)} &nbsp; <b>${txt}</b>`; };
  function levelDots() {
    const s = progress.get('count');
    $('levels').innerHTML = ROWS.map(([lt, Z], i) => `<button class="lv${i === sel ? ' on' : ''}${s[i] ? ' won' : ''}" data-lv="${i}">${element(Z)[0]}</button>`).join('');
  }
  $('levels').onclick = (ev) => { const b = ev.target.closest('[data-lv]'); if (b) load(+b.dataset.lv); };

  // 1. the jar fills with A marbles (the top number)
  async function load(i) {
    sel = i; const my = ++token, [, Z, mass] = ROWS[i];
    history.replaceState(null, '', `?game=count&level=${i}`);
    step = 'fill'; wrong = 0; anim = []; T = 0; eShow = 0; live = true;
    tapJar.style.display = 'none'; bubbles.forEach((b) => (b.style.display = 'none'));
    for (let k = 0; k < MAX; k++) marbles.setColorAt(k, grey);
    marbles.instanceColor.needsUpdate = true;
    levelDots(); goal('top number = everything in the nucleus');
    for (let k = 0; k < mass; k++) {
      anim[k] = { from: jarPos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.6, 6.2, 0)), to: jarSlots[k].clone().add(jarPos), start: k * (2.0 / mass), dur: 0.55, lift: 0, phase: 1 };
    }
    sfx.pop(); await sleep(2.7); if (my !== token) return;
    step = 'tap'; tapJar.style.display = ''; goal('tap the jar');
  }
  // 2. tap the jar: Z red protons hop into the dish (the jar counts down by itself), Z electrons start to orbit
  async function pour() {
    if (step !== 'tap') return;
    step = 'pour'; tapJar.style.display = 'none';
    const my = token, [, Z, mass] = ROWS[sel];
    const prot = []; for (let k = 0; k < mass; k++) if (Math.floor(((k + 1) * Z) / mass) > Math.floor((k * Z) / mass)) prot.push(k);
    prot.forEach((k) => marbles.setColorAt(k, red)); marbles.instanceColor.needsUpdate = true;
    goal('bottom number = <span class="cr">red protons</span> · same number of <span class="cb">blue electrons</span>');
    sfx.ding(); await sleep(0.8); if (my !== token) return;
    const t0 = T;
    prot.forEach((k, j) => { const a = anim[k]; anim[k] = { from: a.to.clone(), to: dishSlots[j].clone().add(dishPos), start: t0 + j * (1.6 / Z), dur: 0.6, lift: 1.4, phase: 2 }; });
    for (let k = 1; k <= Math.min(Z, ecount); k++) { eShow = k; await sleep(1.6 / Z); if (my !== token) return; }
    await sleep(0.8); if (my !== token) return;
    const keep = []; for (let k = 0; k < mass; k++) if (!prot.includes(k)) keep.push(k);
    const t1 = T;                               // the neutrons settle down in the jar
    keep.forEach((k, j) => { const a = anim[k]; anim[k] = { from: a.to.clone(), to: jarSlots[j].clone().add(jarPos), start: t1, dur: 0.5, lift: 0, phase: 3 }; });
    goal('<span class="cg">grey ones left</span> = neutrons');
    await sleep(2.4); if (my !== token) return;
    // 3. the question: pick one of the three numbers on screen
    const q = ASK[sel % ASK.length], opts = [mass - Z, mass, Z].sort(() => Math.random() - 0.5);
    bubbles.forEach((b, k) => { b.textContent = String(opts[k]); b.dataset.v = opts[k]; b.classList.remove('no'); b.style.display = ''; });
    step = 'ask'; goal(q === 'mass number' ? 'what is the mass number?' : `how many ${q}?`);
  }
  bubbles.forEach((b) => (b.onclick = () => answer(+b.dataset.v, b)));
  async function answer(v, b) {
    if (step !== 'ask') return;
    const [, Z, mass] = ROWS[sel], q = ASK[sel % ASK.length];
    if (v !== right(q, Z, mass)) { wrong++; sfx.buzz(); b.classList.add('no'); return; }
    step = 'done'; bubbles.forEach((x) => (x.style.display = 'none'));
    goal(`${Z} p⁺ · ${Z} e⁻ · ${mass - Z} n⁰`);
    progress.set('count', sel, wrong === 0 ? 3 : wrong === 1 ? 2 : 1); levelDots();
    sfx.win(); confetti(stage, g.localToWorld(new THREE.Vector3(0.4, 4, 0)));
    const my = token; await sleep(3.2); if (my !== token) return;
    const next = ROWS.findIndex((r, k) => k > sel && !progress.get('count')[k]);
    if (next >= 0) load(next); else if (sel < ROWS.length - 1) load(sel + 1);
  }
  stage.onTap = (hit) => { if (hit && hit.obj.userData.jar) pour(); };
  load(sel);
  return { load, pour, answer: (v) => answer(v, bubbles[0]) };
}
