// Block Painter (Unit 3): the table starts grey. Pick a paint (s, p, d, f) and tap a column (or an f-row): if the
// colour is right the whole column fills. Then four quick taps: a transition element, a representative element,
// a lanthanide and sulphur. Covers short questions vii, viii, ix and x.
import { THREE, $, sfx, confetti, progress, starStr, sleep, goalBar } from './kit.js';
import { modal, closeModal } from './atomlab.js';
import { table3d } from './table3d.js';
import { SYM, ZOF, place, block, BLOCK_COLOR } from './u3data.js';

const ALL = Array.from({ length: 118 }, (_, k) => k + 1);
const unitOf = (z) => { const [r, c] = place(z); return r >= 8 ? 'r' + r : 'c' + c; };   // a column or an f-row
const UNITS = [...new Set(ALL.map(unitOf))];
const TAPS = [
  { ask: 'Tap a transition element', ok: (z) => block(z) === 'd', set: (z) => block(z) === 'd', tag: 'd-block: transition elements' },
  { ask: 'Tap a representative element', ok: (z) => block(z) === 's' || block(z) === 'p', set: (z) => block(z) === 's' || block(z) === 'p',
    tag: 's + p blocks: representative elements' },
  { ask: 'Tap a lanthanide', ok: (z) => place(z)[0] === 8, set: (z) => place(z)[0] === 8, tag: 'lanthanides: after La, period 6' },
  { ask: 'Tap sulphur (S)', ok: (z) => z === 16, set: (z) => z === 16, tag: 'S: p-block, a representative element' },
];

export function start({ stage, ui, level }) {
  ui.innerHTML = `<div class="goalbar" id="goal"></div><div class="paints" id="paints">${'spdf'.split('').map((b) =>
    `<button data-b="${b}" style="--c:${BLOCK_COLOR[b]}">${b}</button>`).join('')}</div>`;
  const B = goalBar($('goal'));
  const wide = innerWidth / innerHeight > 1.15;
  const T = table3d(stage, { zs: ALL, color: 'plain', numbers: false });
  T.group.position.set(0, wide ? 0.4 : 0.8, 0);
  if (!wide) T.group.scale.setScalar(0.68);
  let paint = 's', done = new Set(), phase = 'paint', ti = 0, first = true, busy = false, wrong = 0;
  const results = [], tags = [];
  const pick = (b) => { paint = b; for (const e of $('paints').children) e.classList.toggle('on', e.dataset.b === b); draw(); };
  $('paints').onclick = (ev) => { const b = ev.target.closest('[data-b]'); if (b) pick(b.dataset.b); };

  function draw() {
    if (phase === 'paint') B.draw([{ text: 'Paint the blocks', bold: true }, { swatch: BLOCK_COLOR[paint], text: paint + '-block' },
      { dots: UNITS.map((u) => (done.has(u) ? 'ok' : '')) }]);
    else B.draw([{ text: TAPS[ti].ask, bold: true }, { dots: TAPS.map((_, j) => (j === ti ? 'on' : results[j + 1] === true ? 'ok' : results[j + 1] === false ? 'no' : '')) }]);
  }
  async function tapPaint(z) {
    const u = unitOf(z);
    if (done.has(u)) return;
    const members = ALL.filter((q) => unitOf(q) === u);
    // He follows the book (p-block, group VIIIA), so column 18 is all p; columns 1 and 2 are all s
    if (block(members[members.length - 1]) !== paint) { wrong++; sfx.buzz(); T.shake(z); return; }
    done.add(u); sfx.ding();
    for (const q of members) T.paint(q, BLOCK_COLOR[paint], true);
    for (const q of members) { T.pop(q, 1.25); await sleep(0.03); }
    if (u === 'c2' && done.has('c1') || u === 'c1' && done.has('c2'))
      tags.push(stage.tag('s holds only 2 electrons → 2 groups', T.tiles[1], [0.3, 0.75, 0], 'big gold'));
    draw();
    if (done.size === UNITS.length) {
      results[0] = wrong <= 2; if (results[0]) progress.set('blocks', 0, 3);
      confetti(stage, new THREE.Vector3(0, 0, 0), 120); sfx.win();
      await sleep(1.6); tags.splice(0).forEach((e) => stage.untag(e));
      phase = 'tap'; $('paints').hidden = true; showTap(0);
    }
  }
  function showTap(k) { ti = k; first = true; busy = false; T.dim(null); T.clearMarks(); tags.splice(0).forEach((e) => stage.untag(e)); draw(); }
  async function tapTask(z) {
    if (busy) return;
    const t = TAPS[ti];
    if (!t.ok(z)) { first = false; sfx.buzz(); T.shake(z); return; }
    busy = true; results[ti + 1] = results[ti + 1] ?? first;
    if (first) progress.set('blocks', ti + 1, 3);
    sfx.ding(); T.mark(z, 0x4dff88); T.pop(z, 1.6);
    T.dim(ALL.filter(t.set), 0.2);
    tags.push(stage.tag(t.tag, T.tiles[z], [0, 0.6, 0], 'big gold'));
    confetti(stage, T.world(z), first ? 50 : 20);
    await sleep(2.6);
    if (ti < TAPS.length - 1) showTap(ti + 1); else finish();
  }
  stage.onTap = (hit) => { const z = hit && hit.obj.userData.z; if (!z) return; phase === 'paint' ? tapPaint(z) : tapTask(z); };
  function finish() {
    const score = results.filter(Boolean).length, stars = score >= 5 ? 3 : score >= 3 ? 2 : 1;
    sfx.win();
    modal(`<div class="stars">${starStr(stars)}</div><h2>${score} / 5 right first time</h2>
      <p>s and p blocks = representative elements; d = transition; f = lanthanides and actinides.</p>
      <div class="row"><button id="mAgain">↺ Play again</button><a class="go" href="games.html?unit=3">All games</a></div>`);
    $('mAgain').onclick = () => { location.href = 'games.html?game=blocks'; };
  }
  pick('s');
  if (level) { done = new Set(UNITS); for (const z of ALL) T.paint(z, BLOCK_COLOR[block(z)], true); phase = 'tap'; $('paints').hidden = true; showTap(Math.min(level - 1, 3)); }
  return { tapPaint, tapTask, pick };
}
