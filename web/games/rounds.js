// Shared frame for the "learn by playing" games (memorize = game): parts as tabs, short rounds with dots, easy →
// harder → tricky, an optional countdown for speed rounds, stars saved per round, a summary at the end of a part.
// A finished level starts again (practice) and a 'Next level →' button waits; no celebration, no pop-ups.
// A part = { key, icon, name, n (rounds), run(k, g) }; run() builds round k and calls g.right(k, first, why) when the
// player gets it (first = right on the first try). Plus small 3D helpers: text tiles, arrows, shake.
import { THREE, $, params, sfx, progress, sleep, goalBar, popIn, tween, ease } from './kit.js';
import { arcade } from './arcade.js';

const F = 'Inter, "Segoe UI", system-ui, sans-serif';
/** A glossy block with text on its front face. set(text, fg) repaints; tint(css) recolours the block. */
export function tile(text, { w = 1.2, h = 0.7, d = 0.2, color = '#4f9eff', fg = '#eef3ff', size = 0.62, bold = 700 } = {}) {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(color).multiplyScalar(0.45), roughness: 0.3,
    clearcoat: 1, clearcoatRoughness: 0.15, emissive: new THREE.Color(color).multiplyScalar(0.12) });
  const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); g.add(box);
  const PX = 200, c = document.createElement('canvas'); c.width = Math.round(w * PX); c.height = Math.round(h * PX);
  const x = c.getContext('2d'), tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }));
  face.position.z = d / 2 + 0.002; g.add(face);
  function set(t, col = fg) {
    x.clearRect(0, 0, c.width, c.height);
    let fs = c.height * size;
    x.font = `${bold} ${fs}px ${F}`;
    while (x.measureText(t).width > c.width * 0.9 && fs > 10) { fs *= 0.92; x.font = `${bold} ${fs}px ${F}`; }
    x.fillStyle = col; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.shadowColor = 'rgba(0,0,0,0.7)'; x.shadowBlur = 8; x.fillText(t, c.width / 2, c.height / 2 + fs * 0.04);
    tex.needsUpdate = true;
  }
  set(text);
  g.userData.box = box;
  return Object.assign(g, { set, mat, tint(css, k = 0.45) {
    mat.color.set(css).multiplyScalar(k); mat.emissive.set(css).multiplyScalar(k > 0.6 ? 0.35 : 0.12); } });
}
/** A glowing tube arrow from a to b (Vector3), head at b. */
export function arrow3d(a, b, color = 0xffc061, r = 0.04) {
  const g = new THREE.Group(), dir = b.clone().sub(a), L = dir.length();
  const m = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.6, roughness: 0.4 });
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(r, r, Math.max(0.01, L - 0.28), 12), m);
  shaft.position.y = (L - 0.28) / 2; g.add(shaft);
  const head = new THREE.Mesh(new THREE.ConeGeometry(r * 3.2, 0.3, 16), m); head.position.y = L - 0.15; g.add(head);
  g.position.copy(a); g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return g;
}
export async function shake(obj, amp = 0.08) {
  const x0 = obj.position.x;
  await tween(0.4, (u) => { obj.position.x = x0 + Math.sin(u * 30) * amp * (1 - u); });
  obj.position.x = x0;
}
export const shuffle = (a, seed = Math.random) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(seed() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/** Answer tiles (always shuffled, user) under the model: tap the right one. 3 wrong tries reveal it (g.miss).
 *  list = values, want = the right value. More than 4 → two rows. Returns the tiles. */
export function choose(g, k, list, want, { y = -1.95, w = 1.6, h = 0.82, size = 0.5, why = '', label = String, onRight, onReveal, tap = false, column = null } = {}) {
  const L = shuffle(list), rows = L.length > 4 ? 2 : 1, per = Math.ceil(L.length / rows);
  const tiles = L.map((v, j) => {
    const r = Math.floor(j / per), n = Math.min(per, L.length - r * per), c = j - r * per;
    const t = tile(label(v), { w, h, color: '#5a6a8a', size });
    if (column) t.position.set(column[0], column[1] - j * (h + 0.2), 0);      // column = [x, top y]: beside a lab rig
    else t.position.set((c - (n - 1) / 2) * (w + 0.22), y + (rows - 1 - r) * (h + 0.18), 0);
    t.userData.v = v; g.stage.root.add(t); g.stage.pickable(t); return t;
  });
  let first = true, busy = false;
  g.reveal(() => { if (busy) return; busy = true; const t = tiles.find((q) => q.userData.v === want); t.tint('#4dff88', 0.9); g._after = onReveal && onReveal(); g.miss(k, why, 1.6, tap && 'tap'); });
  g.setTap((hit) => {
    if (busy || !hit) return;
    let o = hit.obj; while (o && !tiles.includes(o)) o = o.parent;
    if (!o) return;
    if (o.userData.v !== want) { first = false; g.wrong(); shake(o); return; }
    busy = true; g._last = tap ? null : o; o.tint('#4dff88', 0.9); g._after = onRight && onRight(o); g.right(k, first, why, 0, false, tap && 'tap');
  });
  return tiles;
}
/** Long answers as buttons at the bottom (shuffled). a = index of the right one in `list`. tap = the scene's why()
 *  plays after the answer, then a tap goes on. 3 wrong tries reveal the answer. */
export function chooseText(g, k, list, a, { why = '', tap = true, onRight, onReveal } = {}) {
  const order = shuffle(list.map((_, j) => j));
  let first = true, busy = false;
  g.choices(order.map((j) => [j, list[j]]), (key, btn) => {
    if (busy) return;
    if (+key !== a) { first = false; g.wrong(btn); return; }
    busy = true; btn.classList.add('on'); g.ch.querySelectorAll('button').forEach((b) => (b.disabled = true));
    g._after = onRight && onRight(); g.right(k, first, why, 0, false, tap && 'tap');
  });
  g.reveal(() => {
    if (busy) return; busy = true;
    g.ch.querySelectorAll('button').forEach((b) => { b.disabled = true; if (+b.dataset.k === a) b.classList.add('on'); });
    g._after = onReveal && onReveal(); g.miss(k, why, 1.6, tap && 'tap');
  });
}
export const SUP = (n) => String(n).split('').map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join('');

const GIVE_UP = 3;
export function runGame({ stage, ui, level, id, parts, cam = [0, 0.6, 13], target = [0, 0.3, 0], excite = false }) {
  ui.innerHTML = '<div class="levels" id="levels"></div><div class="gtimer" id="gtimer"></div>' +
    '<div class="goalbar" id="goal"></div><div class="choices" id="ch"></div>';
  const B = goalBar($('goal')), ch = $('ch');
  let part = parts.findIndex((p) => p.key === params.get('part')), token = 0, frames = [], timerStop = null, wrongs = 0;
  // Resume (user): opened without a part in the address → go back to the level the student was on last time.
  const RES_KEY = 'games.resume.' + id;
  if (part < 0 && !params.get('part')) {
    try { const r = JSON.parse(localStorage.getItem(RES_KEY)); const j = parts.findIndex((p) => p.key === r.part);
      if (j >= 0) { part = j; if (!Number.isFinite(level)) level = r.k; } } catch (e) { /* first visit */ }
  }
  if (part < 0) part = 0;
  const res = [];
  const A = excite ? arcade(ui, id) : null;      // score, streaks, auto level-up, timed session (arcade.js)
  const g = {
    stage, B, ch, THREE, ui,
    get token() { return token; },
    /** run f after sec seconds unless the round has changed (hints for beginners) */
    later(sec, f) { const my = token; setTimeout(() => { if (my === token) f(); }, sec * 1000); },
    onFrame(f) { frames.push(f); stage.onFrame(f); },
    adopt(f) { frames.push(f); },                       // a frame fn someone else registered (e.g. Atom)
    setTap(f) { const w = (hit, ev) => { g._last = hit && hit.obj; return f(hit, ev); }; stage.onTap = w; g._tap = w; },
    dots(k) { const [f, t] = levelOf(k);              // only this level's dots (long parts would be a wall of dots)
      return { dots: Array.from({ length: t - f }, (_, j) => f + j).map((q) => (q === k ? 'on' : res[q] === true ? 'ok' : res[q] === false ? 'no' : '')) }; },
    goal(text, k, extra = []) { B.draw([{ text, bold: true }, ...extra, g.dots(k)]); },
    /** Buttons at the bottom: list of [key, label]; onPick(key, button). */
    choices(list, onPick) {
      ch.innerHTML = list.map(([k, l]) => `<button data-k="${k}">${l}</button>`).join('');
      ch.onclick = (ev) => { const b = ev.target.closest('[data-k]'); if (b && !b.disabled) onPick(b.dataset.k, b); };
    },
    /** Countdown (speed rounds): calls onOut() at 0. Returns stop(). */
    timer(sec, onOut, exact = false) {
      if (!exact) sec = Math.max(sec, 20);   // user: short countdowns are unfair while learning; exact = the final speed part
      const el = $('gtimer'), my = token; let t = sec; el.textContent = String(t); el.className = 'gtimer show';
      if (!g._reveal) g._reveal = onOut;
      const id2 = setInterval(() => {
        if (my !== token) { clearInterval(id2); return; }
        t -= 1; el.textContent = String(Math.max(t, 0)); el.classList.toggle('low', t <= 3);
        if (t <= 0) { clearInterval(id2); el.className = 'gtimer'; onOut(); }
      }, 1000);
      timerStop = () => { clearInterval(id2); el.className = 'gtimer'; };
      return timerStop;
    },
    wrong(btn) {
      sfx.buzz(); if (btn) { btn.classList.add('wrong'); btn.disabled = true; }
      wrongs++; st.bad++; A?.wrong();                 // user: after 3 wrong tries the answer shows by itself
      if (wrongs >= GIVE_UP && g._reveal) { const f = g._reveal; g._reveal = null; const my = token; setTimeout(() => { if (my === token) f(); }, 350); }
    },
    /** what to do when the student gives up (3 wrong tries): usually the same as the timer's onOut */
    reveal(f) { g._reveal = f; },
    /** Right answer: mark, show WHY in the goal line, wait, then the next round (or the summary). */
    /** start the answer clock now (rounds that open with a look call this when the question appears) */
    clock() { t0 = performance.now(); },
    /** keep = a build game: let the finished build's flash play (wait s) before the next round */
    async right(k, first, why, wait = 0, noStat = false, keep = false) {
      if (!g._missWait && !noStat) { st.good++; st.ms += performance.now() - t0; st.n++; A?.right(performance.now() - t0, first); }
      wait = g._missWait || (keep ? Math.min(wait, 1.5) : 0);   // user: the next question comes at once (a revealed answer stays a moment)
      if (keep === 'tap') wait = 0;                    // a worked answer (labs): the working plays, then a tap goes on
      if (!wait && g._last) ghost(g._last);            // …while the tapped answer finishes its animation on top
      g._missWait = 0;
      g._reveal = null;
      if (timerStop) timerStop();
      const my = token;
      res[k] = res[k] ?? first; if (first) progress.set(id, parts[part].key + k, 3); tabs();
      if (!A) sfx.ding();                              // user: no celebration, just a soft sound and on (arcade: its own climbing ding)
      if (why) { B.draw([{ text: why, bold: true, color: '#ffc061' }, g.dots(k)]); whyToast(why); }
      await sleep(wait);
      if (my !== token) return;
      if (keep === 'tap') { const a = g._after; g._after = null; await a; if (my !== token) return; await tapToGo(); if (my !== token) return; }
      const [from, to] = levelOf(k);
      if (k + 1 >= to) levelDone(from, to);            // level finished: practise it again; "Next level →" waits
      else load(part, k + 1);
    },
    /** Timed out or gave up: counts as not first; show the answer, then go on. */
    async miss(k, why, wait = 1.6, keep = false) { res[k] = false; tabs(); sfx.buzz(); g._missWait = wait; st.bad++; A?.wrong(); return g.right(k, false, why, wait, false, keep); },
  };
  // The tapped answer lives on for a moment outside the round (so clearing the round doesn't cut its animation):
  // it keeps its running tweens, lifts a little toward the camera and fades out.
  function ghost(o) {
    const scene = stage.root.parent; if (!o.parent || !scene) return;
    stage.unpickable(o); scene.attach(o); g._last = null;
    const mats = []; o.traverse((m) => { if (m.material) { m.material = m.material.clone(); m.material.transparent = true; mats.push([m.material, m.material.opacity]); } });
    const z0 = o.position.z;
    tween(0.7, (u) => { o.position.z = z0 + 0.4 * u; mats.forEach(([m, a]) => { m.opacity = a * (1 - u * u); }); }).then(() => scene.remove(o));
  }
  // the WHY of a right answer stays a moment over the next question (non-blocking), so instant rounds still teach
  const whyEl = document.createElement('div'); whyEl.id = 'whyToast'; ui.appendChild(whyEl);
  function whyToast(t) { whyEl.textContent = t; whyEl.className = 'show'; clearTimeout(whyToast.h); whyToast.h = setTimeout(() => (whyEl.className = ''), 2200); }
  // labs: after the working has played, any tap goes on (the student sets the pace; nothing is timed)
  const goEl = document.createElement('div'); goEl.id = 'goOn'; goEl.textContent = 'Tap anywhere to go on ▸'; goEl.hidden = true; ui.appendChild(goEl);
  function tapToGo() {
    goEl.hidden = false;
    return new Promise((res) => setTimeout(() => addEventListener('pointerdown', () => { goEl.hidden = true; res(); }, { once: true }), 250));
  }
  function tabs() {
    const s = progress.get(id);
    $('levels').innerHTML = parts.map((p, j) => {
      const won = Array.from({ length: p.n }, (_, q) => s[p.key + q]).every(Boolean);
      const label = parts.length > 6 && j !== part ? p.icon : `${p.icon} ${p.name}`;   // many parts: icons only, the open one named
      return `<button class="lv part${j === part ? ' on' : ''}${won ? ' won' : ''}" data-p="${j}" title="${p.name}">${label}</button>`;
    }).join('');
  }
  $('levels').onclick = (ev) => { const b = ev.target.closest('[data-p]'); if (b) load(+b.dataset.p, 0); };
  function clear() {
    token++; goEl.hidden = true; g._after = null; if (timerStop) timerStop(); timerStop = null; wrongs = 0; g._reveal = null; g._last = null;
    ui.querySelectorAll('.roundui').forEach((e) => { e.hidden = true; });   // DOM bits a round shows (popups, toggles)
    stage.clearTags(); stage.clearRoot(); stage.onTap = null; g._tap = null; ch.innerHTML = ''; ch.onclick = null;
    frames.forEach((f) => stage.offFrame(f)); frames = [];
    stage.camera.position.set(...cam); stage.controls.target.set(...target); stage.controls.update();
  }
  function load(j, k = 0) {
    part = j; clear(); tabs(); t0 = performance.now();
    { const key = statKey(k); if (key !== st.key) { st = { key, good: 0, bad: 0, ms: 0, n: 0 }; drawStats(); } }
    if (nextFor && !(nextFor.part === j && k >= nextFor.from && k < nextFor.to)) { nextFor = null; nextBtn.hidden = true; }
    history.replaceState(null, '', `?game=${id}&part=${parts[j].key}&level=${k}`);
    localStorage.setItem(RES_KEY, JSON.stringify({ part: parts[j].key, k: levelStart(k) }));
    drawPicker(k);
    A?.level(statKey(k).replace('games.stats.', ''));
    A?.hideAuto(!stepsOf(parts[j]).length);           // one-level part: nothing to move on to
    if (k === 0) res.length = 0;
    parts[j].run(k, g);
  }
  // Levels inside a part (user): no celebration and no pop-up. When a level is finished it simply starts again (the
  // student practises as long as they like) and a "Next level →" button stays on screen; the student moves on only
  // by tapping it. part.steps = round indices where a harder level begins (default: halves, for parts of 8+ rounds).
  function stepsOf(p) { return p.steps || (p.n >= 8 ? [Math.ceil(p.n / 2)] : []); }
  function levelOf(k) {
    const st = [0, ...stepsOf(parts[part]), parts[part].n];
    let i = 0; while (k >= st[i + 1]) i++;
    return [st[i], st[i + 1]];
  }
  function levelStart(k) { return [0, ...stepsOf(parts[part])].filter((x) => x <= k).pop(); }
  // Level picker (user: "select a level and start working there"): a chip at the top left opens a window with every
  // level of this part; finished ones show their best accuracy.
  const pickBtn = document.createElement('button'); pickBtn.id = 'lvPick'; ui.appendChild(pickBtn);
  const pickWin = document.createElement('div'); pickWin.id = 'lvWin'; pickWin.hidden = true; ui.appendChild(pickWin);
  function drawPicker(k) {
    const starts = [0, ...stepsOf(parts[part])];
    pickBtn.hidden = starts.length < 2; pickWin.hidden = true;
    const cur = starts.indexOf(levelStart(k));
    pickBtn.textContent = `Level ${cur + 1} of ${starts.length} ▾`;
    pickBtn.onclick = () => {
      pickWin.innerHTML = '<div class="lvt">Choose a level</div><div class="lvg">' + starts.map((f, i) => {
        const h = hist(`games.stats.${id}.${parts[part].key}.${f}`), best = h.length ? Math.max(...h.map((x) => x.a)) : null;
        return `<button data-f="${f}" class="${i === cur ? 'on' : ''}${best != null ? ' done' : ''}"><b>${i + 1}</b>` +
          `<span>${best != null ? '✓ ' + Math.round(best * 100) + '%' : '&nbsp;'}</span></button>`;
      }).join('') + '</div><button class="lvx">Close</button>';
      pickWin.hidden = false;
      pickWin.onclick = (ev) => {
        const b = ev.target.closest('[data-f]');
        if (b) { pickWin.hidden = true; load(part, +b.dataset.f); } else if (ev.target.closest('.lvx')) pickWin.hidden = true;
      };
    };
  }
  let nextFor = null;
  const nextBtn = document.createElement('button'); nextBtn.id = 'nextLv'; nextBtn.hidden = true; ui.appendChild(nextBtn);
  nextBtn.onclick = () => {
    const nf = nextFor; nextBtn.hidden = true; nextFor = null;
    if (nf.to < parts[part].n) load(part, nf.to); else load((part + 1) % parts.length, 0);
  };
  function levelDone(from, to) {
    const pass = { a: st.good / Math.max(1, st.good + st.bad), s: st.n ? st.ms / st.n / 1000 : 0 };
    if (st.good + st.bad) {                                  // keep this pass for the little graph
      const h = hist(st.key); h.push(pass);
      localStorage.setItem(st.key, JSON.stringify(h.slice(-12)));
    }
    // arcade (user 2026-10-11): an accurate, quick pass goes straight on to the next level (unless switched off)
    if (A && to < parts[part].n && A.passed(pass.a, pass.s, parts[part].fastS)) {
      st = { key: st.key, good: 0, bad: 0, ms: 0, n: 0 }; load(part, to); return;
    }
    st = { key: st.key, good: 0, bad: 0, ms: 0, n: 0 }; drawStats();   // user: stats change only when a pass ends
    nextFor = { part, from, to };
    nextBtn.textContent = to < parts[part].n ? 'Next level →' : 'Next part →';
    nextBtn.hidden = false;
    for (let q = from; q < to; q++) res[q] = undefined;      // practise again: fresh dots
    const p0 = parts[part];                                  // the game goes straight on (an intro round is not repeated)
    load(part, p0.loopFrom ? p0.loopFrom(from) : from);
  }
  // Typing-test style stats (user: "the student should see their hand get better"): accuracy = right taps / all taps,
  // speed = average seconds to a right answer, and a small line of accuracy for each finished pass of this level.
  // It shows the last finished pass and changes only when a pass ends (user: live numbers distract).
  let st = { key: '', good: 0, bad: 0, ms: 0, n: 0 }, t0 = 0;
  const statsEl = document.createElement('div'); statsEl.id = 'stats'; ui.appendChild(statsEl);
  function statKey(k) { const st0 = [0, ...stepsOf(parts[part])].filter((x) => x <= k).pop(); return `games.stats.${id}.${parts[part].key}.${st0}`; }
  function hist(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch (e) { return []; } }
  function drawStats() {
    const h = hist(st.key), tot = 0, last = h[h.length - 1], prev = h[h.length - 2];
    if (!h.length) { statsEl.hidden = true; return; }
    statsEl.hidden = false;
    const acc = last.a, sec = last.s;
    const pts = h.map((x) => x.a).concat(tot ? [acc] : []);
    const W = 96, H = 30, xs = (i) => (pts.length < 2 ? W / 2 : (i * W) / (pts.length - 1)), ys = (a) => H - 3 - a * (H - 6);
    const line = pts.map((a, i) => `${xs(i).toFixed(1)},${ys(a).toFixed(1)}`).join(' ');
    const up = prev ? (acc > prev.a + 0.001 ? ' up' : acc < prev.a - 0.001 ? ' down' : '') : '';
    statsEl.innerHTML = `<div class="st${up}"><b>${Math.round(acc * 100)}%</b><span>accuracy</span></div>` +
      `<div class="st"><b>${sec ? sec.toFixed(1) + ' s' : '–'}</b><span>per answer</span></div>` +
      `<svg viewBox="-3 0 ${W + 6} ${H}" width="${W + 6}" height="${H}"><polyline points="${line}"/>` +
      (pts.length ? `<circle cx="${xs(pts.length - 1)}" cy="${ys(pts[pts.length - 1])}" r="3"/>` : '') + '</svg>';
  }
  load(part, Number.isFinite(level) ? Math.max(0, Math.min(level, parts[part].n - 1)) : 0);
  return { load, g, tap: (obj) => g._tap && g._tap(obj ? { obj } : null) };
}
