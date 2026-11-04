// Energy Stairs (Aufbau, p.50): one solid staircase in energy order 1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p. Taller
// step = more energy, wider step = more seats (s 2, p 6, d 10; one cup = one orbital = 2 electrons). Your electrons
// wait in a pile on the pad at the bottom. Tap a step: the next electron hops up the stairs to it. Pick a step that
// is too high and the electron rolls back down to the lowest free seat. The configuration writes itself.
// No side card: "again" and "show me" are small buttons by the pad. Behind the stairs a Bohr atom (K L M N) fills as
// you place electrons, and a small periodic table (Z 1–20) lights each element you finish.
// Covers short question x (Li, C, Mg) and long question iv (H, He, Li, Be).
import { THREE, $, sfx, confetti, progress, starStr, tween, sleep, ease, M, ball, glow, emissive, ring, ringMat,
  COLORS } from './kit.js';
import { modal, closeModal } from './atomlab.js';
import { element } from './atom.js';
import { periodicTable } from './ptable.js';

const SUB = [['1s', 0], ['2s', 1.2], ['2p', 1.8], ['3s', 2.9], ['3p', 3.5], ['4s', 4.5], ['3d', 5.1], ['4p', 5.8]];
const NBOX = { s: 1, p: 3, d: 5 };
const CUP = 0.58, MARGIN = 0.2, DEPTH = 1.8, HS = 0.95, ZC = 0.25;
const LEVELS = [{ Z: 1, book: 'Long Q iv' }, { Z: 2, book: 'Long Q iv' }, { Z: 3, book: 'Long Q iv · Short Q x' },
  { Z: 4, book: 'Long Q iv' }, { Z: 6, book: 'Short Q x' }, { Z: 12, book: 'Short Q x' }, { Z: 18 },
  { Z: 19, note: 'The 19th electron goes into <b>4s</b>, not 3d: the 4s step is lower than 3d.' }];
const SUP = (n) => String(n).split('').map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join('');
export const configText = (fill) => SUB.map(([s]) => [s, fill[s].reduce((a, b) => a + b, 0)]).filter(([, c]) => c)
  .map(([s, c]) => `<span class="sub-${s[1]}">${s}${SUP(c)}</span>`).join(' ');

export function start({ stage, ui, level }) {
  const saved = progress.get('stairs');
  let idx = Number.isFinite(level) ? level : Math.max(0, LEVELS.findIndex((l, i) => !saved[i]));
  idx = Math.min(Math.max(idx, 0), LEVELS.length - 1);
  ui.innerHTML = `<div class="cfgbar" id="cfg"></div>
    <div class="levels" id="levels"></div><div class="toast" id="toast"></div>`;
  const toast = (html, cls = '') => { const t = $('toast'); t.innerHTML = html; t.className = 'toast show ' + cls; clearTimeout(toast.t); toast.t = setTimeout(() => (t.className = 'toast'), 3200); };

  // ---- the staircase: solid steps, left to right in energy order, seen a little from the side
  const g = new THREE.Group(); g.rotation.set(0.24, -0.12, 0); g.scale.setScalar(0.58);
  stage.root.add(g);
  const widths = SUB.map(([s]) => NBOX[s[1]] * CUP + 2 * MARGIN), total = widths.reduce((a, b) => a + b, 0);
  const stepMat = new THREE.MeshPhysicalMaterial({ color: 0x1a2130, metalness: 0.75, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.2 });
  const floor = new THREE.Mesh(new THREE.BoxGeometry(total + 3.2, 0.2, DEPTH + 0.8), stepMat);
  floor.position.set(-1.1, -0.1, 0); g.add(floor);
  // each step's front is tinted by its kind (s blue, p green, d orange) so the kinds are easy to tell apart
  const faceMat = {};
  for (const l of 'spd') faceMat[l] = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(COLORS[l]).multiplyScalar(0.15),
    emissive: new THREE.Color(COLORS[l]).multiplyScalar(0.06), metalness: 0.5, roughness: 0.35, clearcoat: 1 });
  const steps = {};                                   // '2p' -> { top, xc, w, cups: [{x, e: []}], tile, label }
  let x = -total / 2;
  SUB.forEach(([name, en], si) => {
    const k = NBOX[name[1]], col = COLORS[name[1]], w = widths[si], top = 0.4 + en * HS, xc = x + w / 2;
    const block = new THREE.Mesh(new THREE.BoxGeometry(w - 0.02, top, DEPTH), [stepMat, stepMat, stepMat, stepMat, faceMat[name[1]], stepMat]);
    block.position.set(xc, top / 2, 0); g.add(block);
    const lip = new THREE.Mesh(new THREE.BoxGeometry(w - 0.02, 0.05, 0.05), emissive(col, 1.6));
    lip.position.set(xc, top, DEPTH / 2); g.add(lip);
    const tile = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.1, DEPTH - 0.1), new THREE.MeshBasicMaterial({ color: col,
      transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false }));
    tile.rotation.x = -Math.PI / 2; tile.position.set(xc, top + 0.006, 0); g.add(tile);
    const cups = [];
    for (let j = 0; j < k; j++) {                     // one cup = one orbital: a glowing ring with two seats
      const cx = x + MARGIN + CUP * (j + 0.5);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.022, 8, 40), ringMat(col, 0.75));
      rim.rotation.x = Math.PI / 2; rim.position.set(cx, top + 0.03, ZC); g.add(rim);
      const base = new THREE.Mesh(new THREE.CircleGeometry(0.23, 32), new THREE.MeshBasicMaterial({ color: 0x05070c }));
      base.rotation.x = -Math.PI / 2; base.position.set(cx, top + 0.012, ZC); g.add(base);
      cups.push({ x: cx, e: [], rim });
    }
    const hit = new THREE.Mesh(new THREE.BoxGeometry(w, top + 1.4, DEPTH + 0.4), M.hit);
    hit.position.set(xc, (top + 1.4) / 2, 0); hit.userData.step = name; g.add(hit); stage.pickable(hit);
    const anchor = new THREE.Object3D(); anchor.position.set(xc, top - 0.42, DEPTH / 2 + 0.05); g.add(anchor);
    const label = stage.tag('', anchor, [0, 0, 0], 'steptag sub-' + name[1]);
    steps[name] = { top, xc, w, cups, tile, label, k, si };
    x += w;
  });
  // energy: a tall gold arrow behind the stairs
  const ax = total / 2 + 0.9;
  const ea = new THREE.Group(); ea.position.set(ax, 0, -DEPTH / 2); g.add(ea);
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 6.6, 12), emissive(0xffb347, 0.9)); shaft.position.y = 3.3; ea.add(shaft);
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.55, 20), emissive(0xffb347, 0.9)); head.position.y = 6.6; ea.add(head);
  const eaTag = new THREE.Object3D(); eaTag.position.set(0, 7.3, 0); ea.add(eaTag);
  stage.tag('more energy', eaTag, [0, 0, 0], 'gold');
  // the electron pad: your electrons wait here in a little pile
  const PAD = new THREE.Vector3(-total / 2 - 1.3, 0, 0.3);
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 0.12, 48), stepMat); pad.position.copy(PAD).setY(0.06); g.add(pad);
  const padRing = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.03, 8, 64), ringMat(0x4aa8ff, 0.8));
  padRing.rotation.x = Math.PI / 2; padRing.position.copy(PAD).setY(0.13); g.add(padRing);
  const padTagA = new THREE.Object3D(); padTagA.position.copy(PAD).add(new THREE.Vector3(0, -0.55, 1.0)); g.add(padTagA);
  const padTag = stage.tag('', padTagA, [0, 0, 0], 'steptag');
  // "again" and "show me" sit by the pad (no side card)
  const btnA = new THREE.Object3D(); btnA.position.copy(PAD).add(new THREE.Vector3(-0.9, -1.35, 1.0)); g.add(btnA);
  const btnB = new THREE.Object3D(); btnB.position.copy(PAD).add(new THREE.Vector3(1.1, -1.35, 1.0)); g.add(btnB);
  const bReset = stage.tag('↺ again', btnA, [0, 0, 0], 'tbtn');
  const bShow = stage.tag('▶ show me', btnB, [0, 0, 0], 'tbtn');

  // ---- behind the stairs: a Bohr atom whose K L M N shells fill as you place electrons
  const atom = new THREE.Group(); stage.root.add(atom);
  atom.add(ball(M.proton, 0.2), glow(0xff6a55, 0.9, 0.5));
  const shells = [0.5, 0.85, 1.2, 1.55].map((r, i) => {
    const rg = ring(r, ringMat(0x7fb0ff, 0.28), 0.012); atom.add(rg);
    const spin = new THREE.Group(); atom.add(spin);
    const a = new THREE.Object3D(); a.position.set(r * Math.cos(-0.55), r * Math.sin(-0.55), 0); atom.add(a);
    stage.tag('KLMN'[i], a, [0.12, -0.04, 0], 'blue');
    return { r, ring: rg, spin, es: [] };
  });
  function atomAdd(n) {
    const s = shells[n - 1], e = new THREE.Group();
    e.add(ball(M.electron, 0.065), glow(0x4aa8ff, 0.32, 0.7)); s.spin.add(e); s.es.push(e);
    s.es.forEach((q, i) => { q.userData.to = (i / s.es.length) * Math.PI * 2; if (q.userData.a === undefined) q.userData.a = q.userData.to; });
    e.scale.setScalar(0.01); tween(0.4, (t) => e.scale.setScalar(Math.max(0.01, t)), ease.back);
    tween(0.6, (t) => (s.ring.material.opacity = 0.28 + 0.5 * (1 - t)));
  }
  function atomReset() { shells.forEach((s) => { s.es.forEach((e) => s.spin.remove(e)); s.es = []; }); }

  // ---- a small periodic table (Z 1–20): every element you finish lights up and stays lit; the current one pulses
  const pt = periodicTable(stage), ptab = pt.group;

  const place = () => {
    const wide = innerWidth / innerHeight > 1.15;
    stage.root.position.set(0, wide ? 0 : 1.2, 0); stage.pedestal.position.x = 0;
    g.position.set(wide ? 0.7 : 0.2, -2.9, 0);
    if (wide) { atom.position.set(-3.9, 1.7, -1.2); ptab.position.set(0.2, 2.6, -2); }
    else { atom.position.set(-1.6, 2.9, -1.2); ptab.position.set(1.7, 3.1, -2); }
  };
  addEventListener('resize', place); place();

  const R_E = 0.13;
  const seat = (name, j, s) => new THREE.Vector3(steps[name].cups[j].x + (s ? 0.11 : -0.11), steps[name].top + R_E + 0.02, ZC);
  const stand = (name) => new THREE.Vector3(steps[name].xc, steps[name].top + R_E + 0.02, ZC + 0.45);
  function pileSpot(i) {                                // a neat little heap on the pad
    const ring3 = [1, 6, 12], r = [0, 0.3, 0.58];
    let layer = 0, k = i;
    while (layer < 2 && k >= ring3[layer]) { k -= ring3[layer]; layer++; }
    if (layer >= 2 && k >= ring3[2]) { const top = k - ring3[2]; return PAD.clone().add(new THREE.Vector3(0.28 * Math.cos(top), 0.12 + R_E + 0.24, 0.28 * Math.sin(top))); }
    const a = (k / ring3[layer]) * Math.PI * 2 + layer;
    return PAD.clone().add(new THREE.Vector3(r[layer] * Math.cos(a), 0.12 + R_E, r[layer] * Math.sin(a)));
  }

  let L, fill, placed, mistakes, done, watched, pile = [], onSteps = [];
  let tPulse = 0, warnStep = null;
  stage.onFrame((dt) => {
    tPulse += dt;
    if (pile.length) pile[pile.length - 1].position.y = pileSpot(pile.length - 1).y + 0.06 + 0.06 * Math.sin(tPulse * 5);
    for (const s of Object.values(steps)) {
      const want = warnStep === s ? 0.22 + 0.15 * Math.sin(tPulse * 6) : 0.07;
      s.tile.material.opacity += (want - s.tile.material.opacity) * Math.min(1, dt * 8);
    }
    shells.forEach((s, i) => {
      s.spin.rotation.z += dt * (0.6 / (i + 1));
      s.es.forEach((e) => { e.userData.a += (e.userData.to - e.userData.a) * Math.min(1, dt * 4); e.position.set(s.r * Math.cos(e.userData.a), s.r * Math.sin(e.userData.a), 0); });
    });
  });

  function levelDots() {
    const s = progress.get('stairs');
    $('levels').innerHTML = LEVELS.map((l, i) => `<button class="lv${i === idx ? ' on' : ''}${s[i] ? ' won' : ''}" data-lv="${i}">${element(l.Z)[0]}</button>`).join('');
  }
  $('levels').onclick = (ev) => { const b = ev.target.closest('[data-lv]'); if (b) load(+b.dataset.lv); };

  function load(i) {
    idx = i; L = LEVELS[i]; placed = 0; mistakes = 0; done = false; flying = 0; round++; watched = false; warnStep = null;
    history.replaceState(null, '', `?game=stairs&level=${i}`);
    [...pile, ...onSteps].forEach((e) => g.remove(e)); pile = []; onSteps = [];
    fill = Object.fromEntries(SUB.map(([s]) => [s, Array(NBOX[s[1]]).fill(0)]));
    for (const s in steps) steps[s].cups.forEach((c) => (c.e = []));
    atomReset(); pt.setNow(L.Z);
    for (let k = 0; k < L.Z; k++) {
      const e = new THREE.Group(); e.add(ball(M.electron, R_E), glow(0x4aa8ff, 0.7, 0.75));
      e.position.copy(pileSpot(L.Z - 1 - k)); g.add(e); pile.push(e);
    }
    update(); levelDots();
  }
  bReset.onclick = () => load(idx);
  bShow.onclick = () => showMe();
  function update() {
    const [sym] = element(L.Z);
    for (const [name] of SUB) {
      const s = steps[name], n = fill[name].reduce((a, b) => a + b, 0);
      s.label.innerHTML = `<b>${name}</b> <small>${n}/${2 * s.k}</small>`;
      s.label.classList.toggle('full', n === 2 * s.k);
    }
    padTag.innerHTML = pile.length ? `${pile.length} electron${pile.length > 1 ? 's' : ''} to place` : 'all placed!';
    $('cfg').innerHTML = `<b>${sym}:</b> ${configText(fill) || '<span class="dim">tap the lowest step</span>'}`;
  }
  const subTotal = (s) => fill[s].reduce((a, b) => a + b, 0);
  const lowestOpen = () => SUB.findIndex(([s]) => subTotal(s) < 2 * NBOX[s[1]]);
  function bestCup(name) { const f = fill[name], mn = Math.min(...f); return f.indexOf(mn); }   // one per cup first

  // hop along step tops: pad → 1s → 2s → … (or back down)
  async function hop(e, a, b, lift = 0.55, dur = 0.2) {
    await tween(dur, (t) => {
      e.position.lerpVectors(a, b, t); e.position.y += lift * 4 * t * (1 - t);
    }, ease.lin);
  }
  async function path(e, pts, dur = 0.2) { for (let i = 1; i < pts.length; i++) { await hop(e, pts[i - 1], pts[i], 0.5, dur); if (i < pts.length - 1) sfx.pop(); } }
  function pulseCup(c, col) {
    const r = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.03, 8, 40), ringMat(col, 0.9));
    r.rotation.x = Math.PI / 2; r.position.copy(c.rim.position); g.add(r);
    tween(0.6, (t) => { r.scale.setScalar(1 + 1.4 * t); r.material.opacity = 0.9 * (1 - t); }, ease.out).then(() => g.remove(r));
  }

  // every tap sends an electron straight away (no waiting): its seat is booked at the tap, so quick taps never collide
  let flying = 0, round = 0;
  async function send(name) {
    if (done || !pile.length) return;
    const st = steps[name];
    if (subTotal(name) >= 2 * st.k) { sfx.buzz(); toast(`The <b>${name}</b> step is full: ${2 * st.k} seats, all taken.`, 'bad'); return; }
    warnStep = null;
    const my = round, e = pile.pop(); onSteps.push(e); placed++;
    const want = lowestOpen(), right = SUB[want][0], si = st.si;
    const target = SUB[Math.min(si, want)][0], j = bestCup(target), s2 = fill[target][j];
    fill[target][j]++;                                // book the seat now
    flying++; update();
    const up = [e.position.clone()];
    for (let k = 0; k <= si; k++) up.push(stand(SUB[k][0]));
    await path(e, up);
    if (my !== round) return;
    if (si > want) {                                  // too high: it can't stay; it rolls back down to the lowest free seat
      mistakes++;
      const glowS = e.children[1]; glowS.material = glowS.material.clone(); glowS.material.color.set(0xff5040);
      sfx.boing();
      toast(`Too high! <b>${right}</b> below still has a free seat, so the electron rolls back down.`, 'bad');
      await sleep(0.45);
      glowS.material.color.set(0x4aa8ff);
      const down = [e.position.clone()];
      for (let k = si - 1; k >= Math.min(si, want); k--) down.push(stand(SUB[k][0]));
      await path(e, down, 0.16);
      if (my !== round) return;
      warnStep = steps[right];
    }
    await hop(e, e.position.clone(), seat(target, j, s2), 0.3, 0.22);
    if (my !== round) return;
    steps[target].cups[j].e.push(e);
    pulseCup(steps[target].cups[j], COLORS[target[1]]); sfx.add();
    atomAdd(+target[0]);
    flying--; update();
    if (!pile.length && !flying && !done) { done = true; pt.light(L.Z); setTimeout(win, 900); }
  }
  async function showMe() {
    if (done || flying) return;
    watched = true;
    const my = round;
    while (pile.length && !done && my === round) { send(SUB[lowestOpen()][0]); await sleep(0.3); }
  }
  stage.onTap = (hit) => { if (hit && hit.obj.userData.step) send(hit.obj.userData.step); };

  function win() {
    const stars = watched ? 1 : mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    progress.set('stairs', idx, stars);
    sfx.win(); confetti(stage, g.localToWorld(new THREE.Vector3(0, 4, 0)));
    const [sym, name] = element(L.Z), last = idx === LEVELS.length - 1;
    modal(`<div class="stars">${starStr(stars)}</div><h2>${name}</h2><p class="cfgbig"><b>${sym}:</b> ${configText(fill)}</p>
      ${L.note ? `<p>${L.note}</p>` : ''}<p class="dim">The small numbers add up to ${L.Z}: one for each electron.${watched ? ' Try it yourself for 3 stars!' : ''}</p>
      <div class="row"><button id="mReplay">↺ Again</button>${last ? '<a class="go" href="games.html">All games</a>' : '<button id="mNext" class="go">Next element →</button>'}</div>`);
    $('mReplay').onclick = () => { closeModal(); load(idx); };
    if (!last) $('mNext').onclick = () => { closeModal(); load(idx + 1); };
    levelDots();
  }
  load(idx);
  return { load, send, showMe, drop: (name) => send(name), get fill() { return fill; } };
}
