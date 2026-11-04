// Trend Duel (Unit 3): atoms drawn to the book's radii (Table 3.1). Tap the bigger one, the one with the higher
// ionization energy, the more electronegative one … After the tap, bars with the book values rise and show why.
// Covers MCQ ii, Short Q ii, iv, v and the trends of 3.2 (size, IE, EA, EN).
import { THREE, $, sfx, confetti, progress, starStr, sleep, tween, ease, goalBar, glow, popIn } from './kit.js';
import { modal, closeModal } from './atomlab.js';
import { ZOF, RADIUS, IE1, EA, EN, CAT_COLOR, category } from './u3data.js';

const PROP = {
  r: { ask: { max: 'Which atom is bigger?', min: 'Which atom is smaller?' }, val: (s) => RADIUS[s], unit: ' Å', fmt: (v) => v.toFixed(2) },
  ie: { ask: { max: 'Higher ionization energy?', min: 'Lowest ionization energy?', order: 'Ionization energy: lowest → highest' },
    val: (s) => IE1[s], unit: '', fmt: (v) => String(v) },
  en: { ask: { max: 'More electronegative?', min: 'Least electronegative?' }, val: (s) => EN[s], unit: '', fmt: (v) => v.toFixed(1) },
  ea: { ask: { max: 'Gives out more energy taking an electron?' }, val: (s) => -EA[s], unit: '', fmt: (v) => '−' + v },
};
const ROUNDS = [
  ['r', 'max', 'Li Cs'], ['r', 'max', 'Na Cl'], ['r', 'max', 'K Br'],
  ['ie', 'max', 'Na Mg'], ['ie', 'max', 'Li K'], ['ie', 'min', 'K P S Ca'], ['ie', 'order', 'Na Mg S Ar'],
  ['en', 'max', 'F Cl'], ['en', 'max', 'C O'], ['en', 'max', 'C N O Br S'], ['en', 'min', 'Cs F Na'],
  ['ea', 'max', 'Cl I'],
].map(([p, mode, s]) => ({ p, mode, els: s.split(' ') }));

export function start({ stage, ui, level }) {
  ui.innerHTML = `<div class="goalbar" id="goal"></div>`;
  const B = goalBar($('goal'));
  const wide = innerWidth / innerHeight > 1.15;
  let i = Math.min(Math.max(level ?? 0, 0), ROUNDS.length - 1), first = true, busy = false, got = [];
  const results = [];
  let G = null, balls = [], tags = [];

  function show(k) {
    i = k; first = true; busy = false; got = [];
    history.replaceState(null, '', `?game=duel&level=${k}`);
    tags.splice(0).forEach((e) => stage.untag(e));
    balls.forEach((b) => stage.unpickable(b)); balls = [];
    if (G) stage.root.remove(G);
    G = new THREE.Group(); stage.root.add(G);
    const R = ROUNDS[k], rr = R.els.map((s) => RADIUS[s] * 0.95);
    const gap = 0.7, total = rr.reduce((a, r) => a + 2 * r, 0) + gap * (rr.length - 1);
    const sc = Math.min(1, (wide ? 15 : 9) / total);
    G.scale.setScalar(sc); G.position.y = 1.5;
    let x = -total / 2;
    R.els.forEach((s, j) => {
      const r = rr[j], col = new THREE.Color(CAT_COLOR[category(ZOF[s])]);
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 24), new THREE.MeshStandardMaterial({ color: col, emissive: col,
        emissiveIntensity: 0.35, transparent: true, opacity: 0.42, roughness: 0.4, depthWrite: false }));
      m.position.x = x + r; x += 2 * r + gap;
      m.add(glow(0xff7a5a, 0.35, 0.9));                    // the nucleus: a tiny glow in the middle
      m.userData = { s, j };
      G.add(m); stage.pickable(m); balls.push(m); popIn(m, 1, 0.4);
      tags.push(stage.tag(`<b>${s}</b>`, m, [0, 0, 0], 'huge'));
    });
    B.draw([{ text: PROP[R.p].ask[R.mode], bold: true },
      { dots: ROUNDS.map((_, j) => (j === k ? 'on' : results[j] === true ? 'ok' : results[j] === false ? 'no' : '')) }]);
  }

  function answerOrder(R) {
    const v = R.els.map((s) => PROP[R.p].val(s));
    const idx = R.els.map((_, j) => j);
    if (R.mode === 'order') return idx.sort((a, b) => v[a] - v[b]);
    const best = R.mode === 'max' ? Math.max(...v) : Math.min(...v);
    return [v.indexOf(best)];
  }
  async function reveal(R) {                        // bars with the book values, under each atom
    const P = PROP[R.p], v = R.els.map((s) => P.val(s)), top = Math.max(...v), win = answerOrder(R);
    balls.forEach((b, j) => {
      const h = 2.2 * v[j] / top, ok = R.mode === 'order' || win.includes(j);
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1, 0.3), new THREE.MeshStandardMaterial({ color: ok ? 0x4dff88 : 0xffb347,
        emissive: ok ? 0x2a9950 : 0x8a5a10, roughness: 0.35 }));
      const base = -(Math.max(...balls.map((q) => q.geometry.parameters.radius)) + 0.5) - 2.4;
      bar.position.set(b.position.x, base, 0); bar.scale.y = 0.01; G.add(bar);
      tween(0.8, (t) => { bar.scale.y = Math.max(0.01, h * t); bar.position.y = base + (h * t) / 2; }, ease.out);
      tags.push(stage.tag(P.fmt(v[j]) + P.unit, b, [0, -(b.geometry.parameters.radius + 0.45), 0], ok ? 'big green' : 'big gold'));
    });
    await sleep(0.9);
  }
  async function tap(j) {
    if (busy) return;
    const R = ROUNDS[i], want = answerOrder(R);
    if (R.mode === 'order') {
      if (got.includes(j)) return;
      if (want[got.length] !== j) { first = false; sfx.buzz(); wobble(balls[j]); return; }
      got.push(j); sfx.ding();
      tags.push(stage.tag(String(got.length), balls[j], [0, balls[j].geometry.parameters.radius + 0.35, 0], 'big gold'));
      if (got.length < R.els.length) return;
    } else if (!want.includes(j)) { first = false; sfx.buzz(); wobble(balls[j]); return; }
    busy = true; results[i] = results[i] ?? first;
    if (first) progress.set('duel', i, 3);
    sfx.ding();
    confetti(stage, balls[want[want.length - 1]].getWorldPosition(new THREE.Vector3()), first ? 60 : 25);
    await reveal(R);
    await sleep(2.4);
    if (i < ROUNDS.length - 1) show(i + 1); else finish();
  }
  const wobble = (m) => { const x0 = m.position.x; tween(0.4, (t) => (m.position.x = x0 + 0.12 * Math.sin(t * 30) * (1 - t)), ease.lin); };
  stage.onTap = (hit) => { const u = hit && hit.obj.userData; if (u && u.s) tap(u.j); };
  function finish() {
    const score = results.filter(Boolean).length, stars = score >= 11 ? 3 : score >= 8 ? 2 : 1;
    sfx.win(); confetti(stage, new THREE.Vector3(0, 0, 0), 140);
    modal(`<div class="stars">${starStr(stars)}</div><h2>${score} / ${ROUNDS.length} right first time</h2>
      <p>Across a period: smaller atoms, higher IE, EA and EN. Down a group: bigger atoms, lower IE, EA and EN.</p>
      <div class="row"><button id="mAgain">↺ Play again</button><a class="go" href="games.html?unit=3">All games</a></div>`);
    $('mAgain').onclick = () => { closeModal(); results.length = 0; show(0); };
  }
  show(i);
  return { tap, show };
}
