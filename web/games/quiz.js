// Quiz Quest: the 10 MCQs of the exercise. The player chooses; a wrong choice shakes and gives a nudge,
// the right one plays a small 3D demo that shows WHY. Score = answers right on the first try.
import { THREE, $, sfx, confetti, progress, starStr, nuc, shakeEl, tween, sleep, ease, M, ball, ring, glow, emissive,
  ringMat, popIn, flyTo } from './kit.js';
import { Atom, packNucleons } from './atom.js';
import { sideLayout } from './kit.js';
import { modal, closeModal } from './atomlab.js';

const Q = [
  { q: 'The maximum number of electrons in third energy level is:', o: ['10', '18', '32', '64'], a: 1,
    hint: 'Shell 3 has 2 × 3 × 3 seats.', why: 'Shell n holds 2 × n × n electrons. Third shell: 2 × 3 × 3 = <b>18</b> seats.', demo: dShells },
  { q: 'Mass of an atom is mostly due to its', o: ['nucleus', 'neutrons', 'electrons', 'protons'], a: 0,
    hint: 'Where do the heavy particles live?', why: 'Protons and neutrons are heavy and both sit in the <b>nucleus</b>. Electrons are very light.', demo: dMass },
  { q: 'If Rutherford had used neutrons instead of alpha particles in his scattering experiment, the neutrons would',
    o: ['not deflect because they have no charge', 'have deflected more often', 'have been attracted to the nucleus easily', 'have given the same results'], a: 0,
    hint: 'What pushes a particle away from the nucleus? Its charge…', why: 'Neutrons have <b>no charge</b>, so the positive nucleus neither pushes nor pulls them: they fly straight on.', demo: dNeutrons },
  { q: 'Electron in its ground state does not', o: ['spin', 'revolve', 'radiate energy', 'reside in orbit'], a: 2,
    hint: 'In a fixed orbit its energy does not change…', why: 'In a fixed orbit the energy stays the same, so the electron <b>does not radiate energy</b>.', demo: dGround },
  { q: `Which statement about ${nuc('X', 12, 6)} and ${nuc('Y', 14, 6)} is false?`,
    o: ['they are isotopes', 'they are the same elements', 'they have the same number of electrons', 'they have the same number of neutrons'], a: 3,
    hint: 'Neutrons = top number − bottom number.', why: 'Both have 6 protons (isotopes of one element), but X has 12 − 6 = <b>6</b> neutrons and Y has 14 − 6 = <b>8</b>.', demo: dXY },
  { q: 'The neutron particle', o: ['has a mass equal to that of a electron', 'has a mass approximately equal to that of a proton',
    'has charge equal to but opposite to that of an electron', 'has a positive charge'], a: 1,
    hint: 'A neutron has no charge. Compare masses.', why: 'A neutron has no charge, and it weighs <b>almost the same as a proton</b>.', demo: dBalance },
  { q: 'Isotopes of the same element have', o: ['the same number of protons', 'the same number of neutrons',
    'different number of electrons', 'the same mass number'], a: 0,
    hint: 'What makes hydrogen hydrogen?', why: 'Same element = <b>same number of protons</b>. Only the neutrons differ.', demo: dIsotopes },
  { q: 'Which one is the lightest?', o: ['an alpha particle', 'a hydrogen atom', 'an electron', 'a proton'], a: 2,
    hint: 'One of these is 1837 times lighter than a proton.', why: 'An <b>electron</b> is 1837 times lighter than a proton.', demo: dBars },
  { q: 'The nucleus of an atom has all of the following characteristics except that it',
    o: ['is positively charged', 'is very dense', "contains nearly all of the atom's mass", "contains nearly all of the atom's volume"], a: 3,
    hint: 'Is an atom mostly full, or mostly empty?', why: 'The nucleus is tiny. If it were a marble, the atom would be as big as a football stadium: <b>mostly empty space</b>.', demo: dVolume },
  { q: 'L-shell has sub-shell(s)', o: ['s', 's and p', 's, p and d', 's, p, d and f'], a: 1,
    hint: 'L is shell n = 2. Shell n has n sub-shells.', why: 'L is n = 2, so it has 2 sub-shells: <b>2s and 2p</b>.', demo: dSub },
];
const NUM = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];

export const start = (o) => runQuiz({ ...o, Q });

// shared runner (Unit 3 uses it too): Q = [{ q, o, a, why, demo(stage) -> { reveal(), dispose() }, hint? }]
export function runQuiz({ stage, ui, level, Q, id = 'quiz', hub = 'games.html' }) {
  ui.innerHTML = `<div class="qpanel" id="qp"></div><div class="toast" id="toast"></div>`;
  if (level == null) level = Number(localStorage.getItem('games.resume.' + id)) || 0;   // resume where the student left off
  let i = Math.min(Math.max(level ?? 0, 0), Q.length - 1), first = true, demo = null;
  const results = [];
  const place = () => sideLayout(stage, 3.6);
  addEventListener('resize', place); place();
  const toast = (html) => { const t = $('toast'); t.innerHTML = html; t.className = 'toast show bad'; clearTimeout(toast.t); toast.t = setTimeout(() => (t.className = 'toast'), 2600); };

  function show(k) {
    i = k; first = true;
    history.replaceState(null, '', `?game=${id}&level=${k}`); localStorage.setItem('games.resume.' + id, String(k));
    if (demo) demo.dispose();
    stage.clearTags(); stage.clearRoot();
    demo = Q[k].demo(stage);
    const q = Q[k], score = results.filter(Boolean).length;
    $('qp').innerHTML = `<div class="kicker">Question ${NUM[k]} · ${k + 1} / ${Q.length} · score ${score}</div>
      <h2 class="qtext">${q.q}</h2>
      <div class="opts">${q.o.map((o, j) => `<button class="opt" data-k="${j}"><b>${'abcd'[j]}</b><span>${o}</span></button>`).join('')}</div>
      <p class="why" id="why" hidden></p>
      <button id="nextQ" class="go" hidden>${k === Q.length - 1 ? 'See my score ★' : 'Next question →'}</button>
      <div class="qdots">${Q.map((_, j) => `<i class="${j === k ? 'on' : ''} ${results[j] === true ? 'ok' : results[j] === false ? 'no' : ''}"></i>`).join('')}</div>`;
    $('qp').querySelector('.opts').onclick = (ev) => {
      const b = ev.target.closest('.opt'); if (!b || b.disabled) return;
      choose(+b.dataset.k, b);
    };
    $('nextQ').onclick = () => (k === Q.length - 1 ? finish() : show(k + 1));
  }
  async function choose(j, b) {
    const q = Q[i];
    if (j !== q.a) {
      first = false; b.classList.add('wrong'); b.disabled = true; shakeEl(b); sfx.buzz();   // user: no hint text
      if ([...$('qp').querySelectorAll('.opt')].filter((o) => o.disabled).length >= 3) {   // 3 wrong tries: the answer shows itself
        results[i] = false; const r = $('qp').querySelectorAll('.opt')[q.a]; r.classList.add('right');
        for (const o of $('qp').querySelectorAll('.opt')) o.disabled = true;
        $('why').innerHTML = q.why; $('why').hidden = false; $('nextQ').hidden = false; await demo.reveal();
      }
      return;
    }
    results[i] = results[i] ?? first;
    if (first) progress.set(id, i, 3);
    b.classList.add('right');
    for (const o of $('qp').querySelectorAll('.opt')) o.disabled = true;
    sfx.ding();
    $('why').innerHTML = '✓ ' + q.why; $('why').hidden = false;
    $('nextQ').hidden = false;
    await demo.reveal();
  }
  function finish() {
    const score = results.filter(Boolean).length;           // user: no celebration, just the result
    modal(`<h2>${score} / ${Q.length} right first time</h2>
      <p>${Q.map((_, j) => `${NUM[j]} ${results[j] ? '✓' : '✗'}`).join(' · ')}</p>
      <div class="row"><button id="mAgain">↺ Play again</button><a class="go" href="${hub}">All games</a></div>`);
    $('mAgain').onclick = () => { closeModal(); results.length = 0; show(0); };
  }
  show(i);
  return { show, choose: (j) => choose(j, $('qp').querySelectorAll('.opt')[j]) };
}

// ---------------------------------------------------------------- demo helpers
export function demoBase(stage) {
  const g = new THREE.Group(); stage.root.add(g);
  const atoms = [], frames = [];
  return {
    g, atoms,
    frame(f) { frames.push(f); stage.onFrame(f); },
    dispose() { atoms.forEach((a) => a.dispose()); frames.forEach((f) => stage.offFrame(f)); stage.root.remove(g); },
  };
}
function cluster(p, n, r = 0.21) {
  const g = new THREE.Group(), P = packNucleons(p + n, r);
  for (let k = 0; k < p + n; k++) {
    const isP = Math.floor(((k + 1) * p) / (p + n)) > Math.floor((k * p) / (p + n));
    const b = ball(isP ? M.proton : M.neutron, r); b.position.copy(P[k]).multiplyScalar(r / 0.21); b.userData.type = isP ? 'p' : 'n';
    g.add(b);
  }
  return g;
}
function electronBall(r = 0.14) { const g = new THREE.Group(); g.add(ball(M.electron, r), glow(0x4aa8ff, r * 6.5, 0.8)); return g; }
const pulse = (o, k = 1.4) => { const s = o.scale.x; return tween(0.5, (t) => o.scale.setScalar(s * (1 + (k - 1) * Math.sin(t * Math.PI))), ease.lin); };

function dShells(stage) {
  const d = demoBase(stage), a = new Atom(stage, { seats: true, minShells: 3 }); d.atoms.push(a);
  a.setNucleus(9, 9); a.setConfig([2, 8]);
  d.reveal = async () => {
    for (let k = 0; k < 18; k++) { a.addElectron(2); sfx.pop(); await sleep(0.07); }
    a.flashRing(2); stage.tag('<b>M</b>: 2 × 3 × 3 = <b>18</b> seats', a.shells[2].g, [0, -4.1, 0], 'big');
  };
  return d;
}
function seesaw(d, left, right) {
  const base = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.5, 3), emissive(0x2a3550, 0.4)); base.position.y = -2.9; d.g.add(base);
  const beam = new THREE.Group(); beam.position.y = -2.1; d.g.add(beam);
  beam.add(new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.16, 0.6), new THREE.MeshPhysicalMaterial({ color: 0x8892a6, metalness: 0.8, roughness: 0.3 })));
  left.position.set(-3.2, 0.75, 0); right.position.set(3.2, 0.75, 0); beam.add(left, right);
  return beam;
}
function dMass(stage) {
  const d = demoBase(stage), nucl = cluster(6, 6, 0.3), cloud = new THREE.Group();
  for (let k = 0; k < 6; k++) { const e = electronBall(0.1); e.position.set(Math.cos(k) * 0.7, Math.sin(k * 1.7) * 0.5 + 0.2, Math.sin(k) * 0.4); cloud.add(e); }
  const beam = seesaw(d, nucl, cloud);
  stage.tag('nucleus', nucl, [0, 1.3, 0]); stage.tag('electrons', cloud, [0, 1.3, 0]);
  d.reveal = async () => {
    await tween(0.9, (t) => (beam.rotation.z = 0.3 * t), ease.back);
    stage.tag('<b>almost all the mass</b>', nucl, [0, -1.4, 0], 'gold');
  };
  return d;
}
function dNeutrons(stage) {
  const d = demoBase(stage);
  const nuclei = [-2, 0, 2].map((y) => { const b = ball(M.gold, 0.42); b.position.y = y; b.add(glow(0xffb347, 5, 0.5)); d.g.add(b); return b; });
  stage.tag('gold nuclei (+)', nuclei[0], [0, -0.9, 0], 'gold');
  d.reveal = async () => {
    stage.tag('neutrons: no charge → straight on', nuclei[2], [0, 1.2, 0]);
    for (let w = 0; w < 3; w++) {
      for (let k = 0; k < 7; k++) {
        const n = ball(M.neutron, 0.17), y = -2.9 + k * 0.95 + (w % 2) * 0.3;
        n.position.set(-7, y, 0); d.g.add(n);
        tween(1.4, (t) => (n.position.x = -7 + 14 * t), ease.lin).then(() => d.g.remove(n));
        await sleep(0.08);
      }
      await sleep(0.35);
    }
    const al = cluster(2, 2, 0.16); al.position.set(-7, 0.05, 0); d.g.add(al);            // contrast: alpha (+) bounces back
    stage.tag('α (+) is pushed back', al, [0, 0.6, 0], 'red');
    await tween(0.9, (t) => (al.position.x = -7 + 6.3 * t), ease.out);
    await tween(0.9, (t) => { al.position.x = -0.7 - 6.3 * t; al.position.y = 0.05 + 1.5 * t; }, ease.out);
  };
  return d;
}
function dGround(stage) {
  const d = demoBase(stage), a = new Atom(stage, { tags: false, pos: [-1, 0.3, 0] }); d.atoms.push(a);
  a.setNucleus(1, 0); a.setConfig([1]);
  const bar = new THREE.Group(); bar.position.set(3.6, -1.6, 0); d.g.add(bar);
  bar.add(new THREE.Mesh(new THREE.BoxGeometry(0.7, 3.4, 0.2), new THREE.MeshBasicMaterial({ color: 0x223050, transparent: true, opacity: 0.6 })));
  const fill = new THREE.Mesh(new THREE.BoxGeometry(0.56, 2.2, 0.24), emissive(0x4aa8ff, 1.2)); fill.position.y = -0.5; bar.add(fill);
  stage.tag('energy', bar, [0, 2.1, 0]);
  const pts = []; for (let k = 0; k <= 60; k++) pts.push(new THREE.Vector3(k * 0.06, Math.sin(k * 0.6) * 0.18, 0));
  const wave = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.035, 6), emissive(0xff4d4d, 1.5));
  wave.position.set(0.8, 1.8, 0.3); wave.rotation.z = 0.5; wave.scale.setScalar(0.001); d.g.add(wave);
  d.reveal = async () => {
    stage.tag('stays the same ✓', bar, [0, -2.1, 0], 'green');
    await popIn(wave, 1);
    stage.tag('✗ no light given out', wave, [1.6, 1.2, 0], 'red');
    for (let k = 0; k < 3; k++) await pulse(fill, 1.06);
  };
  return d;
}
function dXY(stage) {
  const d = demoBase(stage), X = cluster(6, 6, 0.27), Y = cluster(6, 8, 0.27);
  X.position.x = -2.4; Y.position.x = 2.4; d.g.add(X, Y);
  stage.tag(nuc('X', 12, 6), X, [0, -1.5, 0], 'big'); stage.tag(nuc('Y', 14, 6), Y, [0, -1.5, 0], 'big');
  d.frame((dt) => { X.rotation.y += dt * 0.4; Y.rotation.y -= dt * 0.4; });
  d.reveal = async () => {
    stage.tag('6 p⁺ · <b>6 n⁰</b>', X, [0, 1.4, 0]); stage.tag('6 p⁺ · <b>8 n⁰</b>', Y, [0, 1.4, 0], 'gold');
    stage.tag('≠', d.g, [0, 0, 0], 'huge red');
    for (const c of [X, Y]) c.children.filter((b) => b.userData.type === 'n').forEach((b) => pulse(b, 1.35));
  };
  return d;
}
function dBalance(stage) {
  const d = demoBase(stage), p = ball(M.proton, 0.6), n = ball(M.neutron, 0.6);
  const beam = seesaw(d, p, n); beam.rotation.z = -0.25;
  stage.tag('proton (+)', p, [0, 1.0, 0]); stage.tag('neutron (no charge)', n, [0, 1.0, 0]);
  d.reveal = async () => {
    for (const a of [0.12, -0.06, 0.02, 0]) { const a0 = beam.rotation.z; await tween(0.35, (t) => (beam.rotation.z = a0 + (a - a0) * t)); }
    stage.tag('<b>≈ same mass</b>', beam, [0, 2.6, 0], 'gold');
  };
  return d;
}
function dIsotopes(stage) {
  const d = demoBase(stage), cl = [];
  [0, 1, 2].forEach((k) => {
    const g = new THREE.Group(); g.position.x = (k - 1) * 3.3; d.g.add(g);
    const c = cluster(1, k, 0.3); g.add(c); cl.push(c);
    const r = ring(1.25); g.add(r);
    const piv = new THREE.Group(); g.add(piv); const e = electronBall(0.12); e.position.x = 1.25; piv.add(e);
    d.frame((dt) => (piv.rotation.z += dt * (1 + k * 0.2)));
    stage.tag(nuc('H', 1 + k, 1), g, [0, -1.9, 0], 'big');
  });
  d.reveal = async () => {
    cl.forEach((c) => c.children.filter((b) => b.userData.type === 'p').forEach((b) => { b.add(glow(0xff5a4a, 3, 0.9)); pulse(b, 1.4); }));
    cl.forEach((c) => stage.tag('1 p⁺ ✓', c, [0, 1.8, 0], 'green'));
  };
  return d;
}
function dBars(stage) {
  const d = demoBase(stage), items = [['α particle', 3.6, '4'], ['H atom', 0.9, '1'], ['proton', 0.9, '1'], ['electron', 0.02, '1/1837']];
  const bars = items.map(([nm, h, v], k) => {
    const g = new THREE.Group(); g.position.set((k - 1.5) * 1.9, -2.6, 0); d.g.add(g);
    const b = new THREE.Mesh(new THREE.BoxGeometry(1.0, h, 0.6), emissive(k === 3 ? 0x4dff88 : 0x4aa8ff, 0.9)); b.position.y = h / 2; g.add(b);
    g.scale.y = 0.001; stage.tag(nm, g, [0, -0.45, 0]);
    return { g, h, v };
  });
  stage.tag('mass (proton = 1)', d.g, [0, 2.4, 0]);
  d.reveal = async () => {
    for (const b of bars) { await tween(0.45, (t) => (b.g.scale.y = Math.max(0.001, t)), ease.back); stage.tag(b.v, b.g, [0, b.h + 0.4, 0], 'gold'); sfx.pop(); }
    stage.tag('<b>lightest!</b>', bars[3].g, [0, 1.0, 0], 'green');
  };
  return d;
}
function dVolume(stage) {
  const d = demoBase(stage);
  const sph = ball(new THREE.MeshPhysicalMaterial({ color: 0x6fa8ff, transparent: true, opacity: 0.12, roughness: 0.1, depthWrite: false }), 3.2);
  d.g.add(sph); d.g.add(ring(3.2, ringMat(0x6fa8ff, 0.4)));
  const core = ball(M.proton, 0.07); core.add(glow(0xff6a5a, 8, 0.8)); d.g.add(core);
  for (let k = 0; k < 5; k++) { const e = electronBall(0.1); const a = k * 1.3; e.position.set(3.0 * Math.cos(a), 3.0 * Math.sin(a), 0.4); d.g.add(e); }
  d.frame((dt) => (d.g.rotation.z += dt * 0.15));
  d.reveal = async () => {
    stage.tag('nucleus: tiny, but almost all the mass', core, [0, -0.6, 0], 'red');
    stage.tag('atom: <b>mostly empty space</b>', sph, [0, 3.7, 0], 'big');
    await tween(1.2, (t) => sph.scale.setScalar(3.2 * (1 + 0.25 * Math.sin(t * Math.PI))), ease.lin);
  };
  return d;
}
function dSub(stage) {
  const d = demoBase(stage), core = cluster(3, 4, 0.2); d.g.add(core);
  const K = ring(1.3, ringMat(0x4f9eff, 0.8), 0.03), L = ring(2.6, ringMat(0x9fc6ff, 0.6), 0.04); d.g.add(K, L);
  stage.tag('K (n = 1)', K, [1.3, 0.5, 0]); const tL = stage.tag('L (n = 2)', L, [2.0, 2.0, 0]);
  d.reveal = async () => {
    await tween(0.4, (t) => L.scale.setScalar(Math.max(0.001, 1 - t)));
    L.visible = false; stage.untag(tL);
    for (const [r, c, nm] of [[2.3, 0x4f9eff, '2s'], [3.1, 0x4dff8c, '2p']]) {
      const rr = ring(r, ringMat(c, 0.9), 0.035); d.g.add(rr); await popIn(rr, 1, 0.45); sfx.pop();
      stage.tag(`<b>${nm}</b>`, rr, [r * 0.75, -r * 0.75, 0], nm === '2s' ? 'blue' : 'green');
    }
  };
  return d;
}
