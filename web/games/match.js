// Model Match: Rutherford or Bohr? Each idea card goes to one of two 3D models; the right model then acts it out
// (electron spirals into the nucleus, jumps between shells giving out light, snaps back to an allowed orbit …).
// Covers long questions i and ii and short question ii.
import { THREE, $, sfx, confetti, progress, starStr, shakeEl, tween, sleep, ease, M, ball, ring, glow, emissive,
  ringMat, popIn, flyTo } from './kit.js';
import { Atom, packNucleons } from './atom.js';
import { modal, closeModal } from './atomlab.js';

const CARDS = [
  ['R', 'The atom has a tiny, positively charged nucleus in its centre.', 'nucleus'],
  ['B', 'Electrons revolve only in fixed circular orbits called shells.', 'shells'],
  ['R', 'Electrons revolve around the nucleus like planets around the sun.', 'planets'],
  ['B', 'Each shell has a fixed energy: K is the lowest energy level, then L, M …', 'levels'],
  ['R', 'Alpha particles were fired at a very thin gold foil.', 'alpha'],
  ['B', 'An electron takes in energy to jump to a higher shell and gives it out as light when it falls back.', 'jump'],
  ['R', 'Most of the atom is empty space.', 'empty'],
  ['B', 'Only some orbits are allowed: n = 1, 2, 3 … never in between.', 'quant'],
  ['R', 'Defect: a revolving charged electron should give out energy and fall into the nucleus.', 'collapse'],
  ['B', 'While an electron stays in its own shell, its energy does not change.', 'stable'],
  ['R', 'Defect: it used the laws of motion and gravitation, which are meant for neutral bodies, not charged particles.', 'laws'],
  ['B', 'The energy of an electron in the K shell is lower than in the L shell (short Q ii).', 'kl'],
];
const NAME = { R: "Rutherford's model", B: "Bohr's model" };

export function start({ stage, ui, level }) {
  ui.innerHTML = `<div class="mcard" id="mc"></div><div class="toast" id="toast"></div>`;
  const toast = (html, cls = '') => { const t = $('toast'); t.innerHTML = html; t.className = 'toast show ' + cls; clearTimeout(toast.t); toast.t = setTimeout(() => (t.className = 'toast'), 3200); };
  const wide = innerWidth / innerHeight > 1.15, X = wide ? 3.7 : 2.6;
  stage.root.position.y = 0.6;

  // ---- Rutherford: nucleus + three tilted elliptical orbits
  const RG = new THREE.Group(); RG.position.x = -X; stage.root.add(RG);
  const core = new THREE.Group(); RG.add(core);
  packNucleons(12).forEach((p, k) => { const b = ball(k % 2 ? M.neutron : M.proton, 0.16); b.position.copy(p).multiplyScalar(0.16 / 0.21); core.add(b); });
  const coreGlow = glow(0xff7a5a, 1.6, 0.4); core.add(coreGlow);
  const orbits = [0, 1.05, -1.05].map((rz, k) => {
    const o = new THREE.Group(); o.rotation.set(1.1, 0, rz); RG.add(o);
    const r = ring(2.3, ringMat(0x5c9dff, 0.45), 0.018); r.scale.y = 0.42; o.add(r);
    const e = new THREE.Group(); e.add(ball(M.electron, 0.12), glow(0x4aa8ff, 0.8, 0.8)); o.add(e);
    return { o, e, ph: k * 2.1, sp: 1.1 + k * 0.25 };
  });
  let rSpeed = 1;
  // ---- Bohr: flat shells K, L, M
  const B = new Atom(stage, { pos: [X, 0.3, 0], radii: [1.0, 1.6, 2.2, 2.8], minShells: 3 });
  B.setNucleus(6, 6); B.setConfig([2, 4]);
  const BG = B.group;
  const pick = (o) => { stage.pickable(o); return o; };
  const hitR = pick(new THREE.Mesh(new THREE.SphereGeometry(2.6, 16, 8), M.hit)); hitR.userData.side = 'R'; RG.add(hitR);
  const hitB = pick(new THREE.Mesh(new THREE.SphereGeometry(2.6, 16, 8), M.hit)); hitB.userData.side = 'B'; BG.add(hitB);
  stage.tag("<b>Rutherford</b>", RG, [0, 3.0, 0], 'big gold'); stage.tag('<b>Bohr</b>', BG, [0, 3.0, 0], 'big gold');

  const tmp = [];                                  // demo objects, cleared before the next demo
  const temp = (o, parent) => { parent.add(o); tmp.push([o, parent]); return o; };
  const tempTag = (...a) => { const e = stage.tag(...a); tmp.push([e, null]); return e; };
  const clearTemp = () => { for (const [o, p] of tmp.splice(0)) p ? p.remove(o) : stage.untag(o); };
  let t = 0;
  stage.onFrame((dt) => {
    t += dt * rSpeed;
    for (const k of orbits) { const a = t * k.sp + k.ph; k.e.position.set(2.3 * Math.cos(a), 2.3 * 0.42 * Math.sin(a), 0); }
    core.rotation.y += dt * 0.3;
  });
  const electron = () => { const e = new THREE.Group(); e.add(ball(M.electron, 0.13), glow(0x4aa8ff, 0.9, 0.9)); return e; };
  const photon = (color) => {
    const pts = []; for (let k = 0; k <= 40; k++) pts.push(new THREE.Vector3(k * 0.04, Math.sin(k * 0.8) * 0.12, 0));
    const w = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.03, 6), emissive(color, 2.2));
    w.add(glow(color, 1.2, 0.5)); return w;
  };

  const DEMO = {
    async nucleus() { tempTag('<b>+</b> tiny nucleus', core, [0, -0.8, 0], 'red'); for (let k = 0; k < 2; k++) await tween(0.5, (s) => coreGlow.scale.setScalar(1.6 + 2.5 * Math.sin(s * Math.PI)), ease.lin); },
    async planets() { tempTag('like planets around the sun ☀', RG, [0, -2.9, 0]); await tween(1.6, (s) => (rSpeed = 1 + 3 * Math.sin(s * Math.PI)), ease.lin); rSpeed = 1; },
    async empty() {
      const s = temp(ball(new THREE.MeshPhysicalMaterial({ color: 0x6fa8ff, transparent: true, opacity: 0.1, depthWrite: false }), 2.5), RG);
      tempTag('mostly empty space', RG, [0, -2.9, 0]); await popIn(s, 2.5, 0.6);
    },
    async alpha() {
      tempTag('α particles → gold foil', RG, [0, -2.9, 0]);
      for (let k = 0; k < 6; k++) {
        const a = temp(ball(M.proton, 0.12), RG), y = -1.5 + k * 0.6;
        a.position.set(-5, y, 0);
        const back = k === 3;
        tween(back ? 0.6 : 1.1, (s) => (a.position.x = -5 + (back ? 4.6 : 10) * s), ease.lin).then(() => back && tween(0.6, (s) => { a.position.x = -0.4 - 4 * s; a.position.y = y + 1.5 * s; }));
        await sleep(0.15);
      }
      await sleep(1.2);
    },
    async collapse() {
      const e = temp(electron(), RG); rSpeed = 0.3;
      tempTag('✗ the atom would collapse', RG, [0, -2.9, 0], 'red');
      await tween(1.8, (s) => { const r = 2.3 * (1 - s), a = s * 14; e.position.set(r * Math.cos(a), r * Math.sin(a), 0.2); }, ease.inOut);
      await tween(0.4, (s) => coreGlow.scale.setScalar(1.6 + 5 * Math.sin(s * Math.PI)), ease.lin);
      tempTag('…but real atoms are stable', RG, [0, 2.4, 0]); rSpeed = 1;
    },
    async laws() { tempTag('planets: neutral 🪐', RG, [-1.2, -2.9, 0]); tempTag('electrons: charged ⚡', RG, [1.4, -2.9, 0], 'blue'); await sleep(1); },
    async shells() { for (let i = 0; i < 3; i++) { B.flashRing(i); await sleep(0.35); } },
    async levels() { ['E₁ (lowest)', 'E₂', 'E₃'].forEach((txt, i) => tempTag(`${'KLM'[i]}: ${txt}`, BG, [B.shells[i].r + 0.5, -0.35 * i - 0.2, 0], i ? '' : 'green')); await sleep(1); },
    async jump() {
      const e = temp(electron(), BG); e.position.set(1.0, 0, 0.15);
      const pin = temp(photon(0xffd25a), BG); pin.position.set(3.5, 1.6, 0.2); pin.rotation.z = Math.PI + 0.45;
      await flyTo(pin, new THREE.Vector3(1.2, 0.1, 0.2), 0.7, 0); pin.visible = false;
      tempTag('takes in energy ↑', BG, [0.2, 2.9, 0], 'gold');
      await flyTo(e, new THREE.Vector3(1.6, 0, 0.15), 0.5, 0.3); await sleep(0.5);
      await flyTo(e, new THREE.Vector3(1.0, 0, 0.15), 0.4, 0.1);
      const pout = temp(photon(0x6fd0ff), BG); pout.position.set(1.1, -0.1, 0.2); pout.rotation.z = -0.5;
      tempTag('falls back ↓ gives out light', BG, [0, -3.1, 0], 'blue');
      await flyTo(pout, new THREE.Vector3(4, -1.9, 0.2), 0.8, 0);
    },
    async quant() {
      const e = temp(electron(), BG); e.position.set(1.0, 0, 0.15);
      await flyTo(e, new THREE.Vector3(1.3, 0, 0.15), 0.5, 0.2);
      const x = tempTag('✗ not allowed', e, [0, 0.5, 0], 'red'); sfx.buzz(); await sleep(0.7); stage.untag(x);
      await flyTo(e, new THREE.Vector3(1.6, 0, 0.15), 0.35, 0.1); sfx.ding();
      tempTag('✓ n = 2: a whole step is allowed', BG, [0, -3.1, 0], 'green');
    },
    async stable() { tempTag('energy stays the same ✓', BG, [0, -3.1, 0], 'green'); for (let i = 0; i < 2; i++) await B.flashRing(1); },
    async kl() { tempTag('K: lower energy', BG, [1.3, -0.3, 0], 'green'); tempTag('L: higher energy', BG, [1.9, 0.6, 0], 'gold'); await B.flashRing(0); await B.flashRing(1); },
  };

  let i = Number.isFinite(level) ? Math.min(level, CARDS.length - 1) : 0, first = true, busy = false;
  const results = [];
  function show(k) {
    i = k; first = true; busy = false; clearTemp();
    history.replaceState(null, '', `?game=match&level=${k}`);
    const [, text] = CARDS[k];
    $('mc').innerHTML = `<div class="kicker">Card ${k + 1} / ${CARDS.length} · tap a model or a button</div>
      <p class="mtext">${text}</p>
      <div class="row2 split"><button data-side="R">← Rutherford</button><button data-side="B">Bohr →</button></div>`;
    $('mc').querySelector('.split').onclick = (ev) => { const b = ev.target.closest('[data-side]'); if (b) choose(b.dataset.side); };
    $('mc').classList.remove('fly-R', 'fly-B');
  }
  async function choose(side) {
    if (busy) return;
    const [want, , demo] = CARDS[i];
    if (side !== want) {
      first = false; sfx.buzz(); shakeEl($('mc'));
      toast(`Hmm, this idea belongs to <b>${NAME[want]}</b>. Watch it there!`, 'bad');
      return;
    }
    busy = true; results[i] = results[i] ?? first;
    if (first) progress.set('match', i, 3);
    sfx.ding(); $('mc').classList.add('fly-' + side);
    confetti(stage, (side === 'R' ? RG : BG).localToWorld(new THREE.Vector3(0, 0, 0)), first ? 60 : 25);
    await DEMO[demo]();
    await sleep(1.4);
    if (i < CARDS.length - 1) show(i + 1); else finish();
  }
  stage.onTap = (hit) => { if (hit && hit.obj.userData.side) choose(hit.obj.userData.side); };
  function finish() {
    const score = results.filter(Boolean).length, stars = score >= 11 ? 3 : score >= 8 ? 2 : 1;
    sfx.win(); confetti(stage, new THREE.Vector3(0, 0, 0), 140);
    modal(`<div class="stars">${starStr(stars)}</div><h2>${score} / ${CARDS.length} right first time</h2>
      <p>Rutherford found the nucleus; Bohr fixed the electrons in shells with fixed energies.</p>
      <div class="row"><button id="mAgain">↺ Play again</button><a class="go" href="games.html">All games</a></div>`);
    $('mAgain').onclick = () => { closeModal(); results.length = 0; show(0); };
  }
  show(i);
  return { choose, show };
}
