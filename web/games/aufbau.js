// Aufbau Climb (Unit 2, film 06, book p.50): the filling order until it is automatic. Easy → harder → tricky.
//   🔼 Lower step?   two sub-shells as steps; tap the one that fills first. First the steps show their real heights,
//                    then they stand level (you must know), then speed. After each answer both rise to their true
//                    energy: you SEE 4s sit below 3d.
//   ↘️ Diagonal      the book's chart as tiles; tap the sub-shells in filling order (arrows, then no arrows, then timed).
//   ➡️ What next?    one tile glows; tap the sub-shell that fills next (traps: after 4s comes 3d, after 6s comes 4f).
//   🎯 Next electron an atom's electrons sit on the energy stairs; where does the next one go? (19th → 4s, 21st → 3d).
//                    Later the steps stand shuffled and level; after the answer they slide into energy order.
import { THREE, sleep, tween, popIn, ball, emissive, COLORS, M } from './kit.js';
import { runGame, tile, arrow3d, shake, shuffle, SUP } from './rounds.js';

export const ORDER = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p'];
const SEATS = { s: 2, p: 6, d: 10, f: 14 };
const css = (l) => '#' + COLORS[l].toString(16).padStart(6, '0');
const rank = (s) => ORDER.indexOf(s);
const ROWS = { 1: 's', 2: 'sp', 3: 'spd', 4: 'spdf', 5: 'spdf', 6: 'spd', 7: 'sp' };

// the chart (book diagonal rule) as tiles; returns { group, tiles: {name: tile}, at(name) }
function chart(g, { arrows = false } = {}) {
  const G = new THREE.Group(); G.position.set(-2.2, 2.9, 0); g.stage.root.add(G);
  const tiles = {}, CX = 1.45, CY = 0.82;
  const at = (nm) => new THREE.Vector3('spdf'.indexOf(nm[1]) * CX, -(Number(nm[0]) - 1) * CY, 0);
  for (const [n, ls] of Object.entries(ROWS)) for (const l of ls) {
    const nm = n + l, t = tile(nm, { w: 1.05, h: 0.6, color: css(l) });
    t.position.copy(at(nm)); t.userData.sub = nm; G.add(t); g.stage.pickable(t); tiles[nm] = t;
  }
  if (arrows) {
    const D = [['1s'], ['2s'], ['2p', '3s'], ['3p', '4s'], ['3d', '4p', '5s'], ['4d', '5p', '6s'], ['4f', '5d', '6p', '7s'], ['5f', '6d', '7p']];
    for (const d of D) {
      const a = at(d[0]), b = at(d[d.length - 1]);
      const u = d.length > 1 ? b.clone().sub(a).normalize() : new THREE.Vector3(-CX, -CY, 0).normalize();
      const ar = arrow3d(a.clone().addScaledVector(u, -0.55).setZ(-0.25), b.clone().addScaledVector(u, 0.8).setZ(-0.25), 0xffc061, 0.035);
      G.add(ar);
    }
  }
  return { G, tiles, at };
}
const runner = (g, G, from, to) => {          // a gold ball glides from one tile to the next
  const b = ball(emissive(0xffc061, 2.2), 0.12); b.position.copy(from).setZ(0.25); G.add(b);
  return tween(0.5, (u) => b.position.lerpVectors(from, to, u).setZ(0.25 + Math.sin(u * Math.PI) * 0.3)).then(() => G.remove(b));
};

// ---------------------------------------------------------------- 🔼 lower step?
const PAIRS = [['2s', '1s', 0], ['2p', '3p', 0], ['3p', '3s', 0], ['4s', '3d', 0], ['3s', '2p', 1], ['3d', '4p', 1],
  ['4d', '5s', 1], ['5p', '4d', 1], ['4f', '6s', 1], ['5d', '4f', 1]];
function lower(k, g) {
  const [a, b, level] = PAIRS[k], timed = k >= 7, H = (s) => 0.5 + rank(s) * 0.27;
  const G = new THREE.Group(); G.position.y = -2.1; g.stage.root.add(G);
  const floor = new THREE.Mesh(new THREE.BoxGeometry(7, 0.12, 2.2), new THREE.MeshPhysicalMaterial({ color: 0x141a26, metalness: 0.6, roughness: 0.35 }));
  G.add(floor);
  const ar = arrow3d(new THREE.Vector3(-3.4, 0, 0), new THREE.Vector3(-3.4, 5.2, 0)); G.add(ar);
  g.stage.tag('<b>energy</b>', G, [-3.4, 5.55, 0], 'big gold');
  const steps = [a, b].map((s, i) => {
    const t = tile(s, { w: 1.9, h: 1, d: 1.6, color: css(s[1]), size: 0.55 });
    const h = level ? 1.6 : H(s);
    t.scale.y = 1; t.position.set(i ? 1.4 : -1.2, h / 2, 0);
    const col = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1, 1.6), t.mat); col.userData.sub = s;
    col.scale.y = h; col.position.set(t.position.x, h / 2, 0); G.add(col);
    t.position.y = h + 0.5; t.userData.sub = s; G.add(t);
    g.stage.pickable(t); g.stage.pickable(col);
    return { s, t, col, h };
  });
  const grow = () => Promise.all(steps.map((st) => {      // both rise to their true energy
    const h0 = st.h, h1 = H(st.s);
    return tween(0.9, (u) => { const h = h0 + (h1 - h0) * u; st.col.scale.y = h; st.col.position.y = h / 2; st.t.position.y = h + 0.5; });
  }));
  const win = rank(a) < rank(b) ? a : b, lose = win === a ? b : a;
  g.goal('Which fills first?', k);
  let first = true, busy = false;
  if (timed) g.timer(6, async () => { if (busy) return; busy = true; await grow(); g.miss(k, `${win} is lower than ${lose}`); });
  g.setTap(async (hit) => {
    if (busy || !hit || !hit.obj.userData.sub) return;
    const s = hit.obj.userData.sub, st = steps.find((x) => x.s === s);
    if (s !== win) { first = false; g.wrong(); shake(st.t); shake(st.col); return; }
    busy = true; st.t.tint(css(s[1]), 0.9);
    await grow();
    g.right(k, first, `${win} is lower than ${lose}: it fills first`);
  });
}

// ---------------------------------------------------------------- ↘️ diagonal chart: tap in filling order
const DIAG_ROUNDS = [{ upto: '4s', arrows: true }, { upto: '5s', arrows: true }, { upto: '5s', arrows: false },
  { upto: '7p', arrows: false }, { upto: '7p', arrows: false, time: 45 }];
function diagonal(k, g) {
  const r = DIAG_ROUNDS[k], { G, tiles, at } = chart(g, { arrows: r.arrows }), last = rank(r.upto);
  let next = 0, first = true, busy = false;
  const show = () => g.goal(next ? ORDER.slice(Math.max(0, next - 5), next).join(' → ') + ' → ?' : 'Tap them in filling order', k);
  show();
  if (r.time) g.timer(r.time, () => { if (!busy) { busy = true; g.miss(k, 'Order: ' + ORDER.join(' ')); } });
  g.setTap(async (hit) => {
    if (busy || !hit || !hit.obj.userData.sub) return;
    const s = hit.obj.userData.sub, t = tiles[s];
    if (s !== ORDER[next]) { if (rank(s) >= next) { first = false; g.wrong(); shake(t); } return; }
    t.tint(css(s[1]), 0.95);
    if (next > 0) runner(g, G, at(ORDER[next - 1]), at(s));
    next++; show();
    if (next > last) { busy = true; await sleep(0.6); g.right(k, first, 'Filling order up to ' + r.upto + ' ✓'); }
  });
}

// ---------------------------------------------------------------- ➡️ what comes next?
const NEXT = ['1s', '2p', '3p', '4s', '3d', '5s', '6s', '4f'];
function whatNext(k, g) {
  const { G, tiles, at } = chart(g), s0 = NEXT[k], ans = ORDER[rank(s0) + 1];
  for (const nm of ORDER.slice(0, rank(s0))) tiles[nm].tint(css(nm[1]), 0.95);   // already full
  const cur = tiles[s0]; cur.tint('#ffc061', 1.0); popIn(cur, 1, 0.4);
  g.goal(`After ${s0}, which fills?`, k);
  let first = true, busy = false;
  if (k >= 5) g.timer(7, () => { if (!busy) { busy = true; runner(g, G, at(s0), at(ans)); g.miss(k, `After ${s0} comes ${ans}`); } });
  g.setTap(async (hit) => {
    if (busy || !hit || !hit.obj.userData.sub) return;
    const s = hit.obj.userData.sub;
    if (s === s0) return;
    if (s !== ans) { first = false; g.wrong(); shake(tiles[s]); return; }
    busy = true; tiles[s].tint(css(s[1]), 0.95);
    await runner(g, G, at(s0), at(s));
    g.right(k, first, `After ${s0} comes ${ans}` + (ans === '3d' ? ' (4s was lower)' : ans === '4f' ? ' (6s was lower)' : ''));
  });
}

// ---------------------------------------------------------------- 🎯 where does the next electron go?
const STAIR = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p'];
const ZS = [3, 5, 11, 13, 19, 21, 20, 31];
function nextElectron(k, g) {
  const Z = ZS[k], hidden = k >= 5;
  const fill = {}; let left = Z - 1;
  for (const s of STAIR) { const n = Math.min(SEATS[s[1]], left); fill[s] = n; left -= n; }
  const ans = STAIR.find((s) => fill[s] < SEATS[s[1]]);
  const G = new THREE.Group(); G.position.set(0, -1.7, 0); G.rotation.x = 0.25; G.scale.setScalar(0.62); g.stage.root.add(G);
  const PER = 0.27, GAP = 0.16, H = (s) => 0.35 + rank(s) * 0.42;
  const widths = STAIR.map((s) => SEATS[s[1]] * PER + 0.12), total = widths.reduce((a, b) => a + b, 0) + GAP * 7;
  const order = hidden ? shuffle(STAIR) : STAIR;
  const xs = {}; let x = -total / 2;
  order.forEach((s) => { const w = SEATS[s[1]] * PER + 0.12; xs[s] = x + w / 2; x += w + GAP; });
  const trueX = {}; x = -total / 2;
  STAIR.forEach((s) => { const w = SEATS[s[1]] * PER + 0.12; trueX[s] = x + w / 2; x += w + GAP; });
  const steps = {};
  for (const s of STAIR) {
    const w = SEATS[s[1]] * PER + 0.12, h = hidden ? 1.2 : H(s);
    const grp = new THREE.Group(); grp.position.x = xs[s]; G.add(grp);
    const col = new THREE.Mesh(new THREE.BoxGeometry(w, 1, 1.2), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(css(s[1])).multiplyScalar(0.35), roughness: 0.3, clearcoat: 1 }));
    col.scale.y = h; col.position.y = h / 2; col.userData.sub = s; grp.add(col); g.stage.pickable(col);
    const es = new THREE.Group(); es.position.y = h; grp.add(es);
    for (let j = 0; j < fill[s]; j++) { const e = ball(M.electron, 0.09); e.position.set(-w / 2 + 0.06 + PER * (j + 0.5), 0.1, 0); es.add(e); }
    const tg = g.stage.tag(`<b>${s}</b>`, col, [0, 0, 0.7], 'big');
    steps[s] = { grp, col, es, w, h };
  }
  const gold = ball(emissive(0xffc061, 2.2), 0.13); gold.position.set(0, 5.6, 0); G.add(gold);
  const sym = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga'][Z];
  g.goal(`${sym}: where does electron ${Z} go?`, k);
  const seatOf = (s) => new THREE.Vector3(steps[s].grp.position.x - steps[s].w / 2 + 0.06 + PER * (fill[s] + 0.5), steps[s].h + 0.1, 0);
  const fly = (to, dur = 0.6) => { const a = gold.position.clone(); return tween(dur, (u) => { gold.position.lerpVectors(a, to, u); gold.position.y += Math.sin(u * Math.PI) * 0.8; }); };
  let first = true, busy = false;
  g.setTap(async (hit) => {
    if (busy || !hit || !hit.obj.userData.sub) return;
    const s = hit.obj.userData.sub, st = steps[s];
    busy = true;
    if (s !== ans) {                       // it goes there, then rolls back up: that step is not the lowest free one
      first = false; g.wrong();
      await fly(new THREE.Vector3(st.grp.position.x, st.h + 0.4, 0), 0.5); shake(st.col);
      await sleep(0.3); await fly(new THREE.Vector3(0, 5.6, 0), 0.5); busy = false; return;
    }
    await fly(seatOf(s));
    if (hidden) {                          // the steps slide into energy order and rise to their true heights
      await Promise.all(STAIR.map((q) => { const p = steps[q], x0 = p.grp.position.x, h0 = p.h, h1 = H(q);
        const gx0 = q === s ? gold.position.x - x0 : 0;
        return tween(1.0, (u) => { p.grp.position.x = x0 + (trueX[q] - x0) * u; const h = h0 + (h1 - h0) * u;
          p.col.scale.y = h; p.col.position.y = h / 2; p.es.position.y = h;
          if (q === s) { gold.position.x = p.grp.position.x + gx0; gold.position.y = h + 0.1; } }); }));
    }
    g.right(k, first, ans === '4s' ? `${ans}: it is lower than 3d` : `${ans} is the lowest free step`);
  });
}

const PARTS = [
  { key: 'low', icon: '🔼', name: 'Lower step?', n: PAIRS.length, run: lower, done: 'Lower steps fill first. 4s sits below 3d, 5s below 4d, 6s below 4f.' },
  { key: 'diag', icon: '↘️', name: 'Diagonal', n: DIAG_ROUNDS.length, run: diagonal, done: 'You can follow the diagonal rule without the arrows.' },
  { key: 'next', icon: '➡️', name: 'What next?', n: NEXT.length, run: whatNext, done: 'After 4s comes 3d; after 6s comes 4f.' },
  { key: 'elec', icon: '🎯', name: 'Next electron', n: ZS.length, run: nextElectron, done: 'Each electron takes the lowest free step: the 19th goes to 4s, the 21st to 3d.' },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'aufbau', parts: PARTS, cam: [0, 0.6, 14], target: [0, 0.4, 0] });
}
