// Solution Lab (Unit 6): each question becomes a small 3D experiment. Watch it, pick the answer; after the right
// answer the experiment shows why. Covers Short Q i, ii, iv, v; Long Q iii, iv; Activity 6.2; Example 6.6 /
// Practice 6.2; Point to Ponder; pressure and temperature (pp.169-171).
import { THREE, emissive, sleep, tween, ease, popIn} from './kit.js';
import { runGame, chooseText, shuffle } from './rounds.js';
import { MOLM, WATER, STEEL, edgeBox, jar, Molecules, gridSeats, flame } from './gas3d.js';

const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
const ROUNDS = [
  { ask: 'Is sea water pure water or a solution? How can you tell?', o: ['boil it dry: salt is left behind', 'look at its colour', 'filter it: salt stays on the paper'], a: 0, scene: seaWater },
  { ask: 'A bottle says "3 percent hydrogen peroxide". It means:', o: ['3 moles in each litre', '3 parts H₂O₂ in every 100 parts of solution', '3 g in 1 dm³ of water'], a: 1, scene: percent3 },
  { ask: 'Why do we stir paints before using them?', o: ['to warm them up', 'to dissolve air in them', 'the pigment particles settle at the bottom'], a: 2, scene: paint },
  { ask: 'Why does a colloid show the Tyndall effect but a solution does not?', o: ['colloid particles are big enough to scatter light', 'colloids are hotter', 'solutions soak up all light'], a: 0, scene: tyndall },
  { ask: 'Which beaker holds the concentrated solution?', o: ['left', 'right'], a: 1, scene: concDil },
  { ask: 'Sugar is added until some stays at the bottom. The solution is:', o: ['unsaturated', 'saturated', 'supersaturated'], a: 1, scene: saturated },
  { ask: 'A hot saturated solution cools slowly, with no crystals. Now it is:', o: ['unsaturated', 'saturated', 'supersaturated'], a: 2, scene: superSat },
  { ask: 'Sugar + water and sand + water. How can you show which is a solution?', o: ['weigh both', 'leave them: sand settles, sugar never does', 'shake both'], a: 1, scene: sandSugar },
  { ask: 'Activity 6.2: iodine dissolves well in:', o: ['water', 'methylated spirit'], a: 1, scene: iodine },
  { ask: 'Methyl alcohol (CH₃OH) dissolves best in:', o: ['a polar solvent (water)', 'a non-polar solvent (benzene)'], a: 0, scene: methanol },
  { ask: 'Half a litre of alcohol + half a litre of water makes:', o: ['exactly 1 litre', 'less than 1 litre', 'more than 1 litre'], a: 1, scene: ponder },
  { ask: 'A soda bottle fizzes when you open it because:', o: ['less pressure: less CO₂ can stay dissolved', 'it gets hotter', 'air gets into it'], a: 0, scene: soda },
  { ask: 'A warm fizzy drink goes flat faster because:', o: ['heat makes more gas', 'gases dissolve less when hot'], a: 1, scene: warmDrink },
];

function helpers(g) {
  const stage = g.stage;
  const H = {
    G: null,
    on(f) { g.onFrame(f); },
    mol(parent, o) { const m = new Molecules(parent, o); H.on((dt) => m.update(dt)); return m; },
    fire(parent, x, y, s = 1) { const f = flame(s); f.position.set(x, y, 0); parent.add(f); H.on(() => f.userData.tick()); return f; },
    tag: (h, o, off, c = 'big') => stage.tag(h, o, off, c),
    // a glass beaker standing on y with liquid up to hl; returns { g, lo, hi }
    beaker(x, y, r = 1.1, h = 2.6, hl = 2.0, mat = WATER) {
      const g = jar(r, h); g.position.set(x, y, 0); H.G.add(g);
      if (hl > 0) { const w = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.96, r * 0.96, hl, 32), mat); w.position.y = hl / 2; g.add(w); }
      return { g, lo: V(-r * 0.75, 0.05, -0.3), hi: V(r * 0.75, hl, 0.3) };
    },
    beam(parent, x0, x1, y, r = 0.1, op = 0.85) {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, x1 - x0, 16), (op > 0.5 ? emissive(0xfff2b0, 2.5) : new THREE.MeshBasicMaterial({ color: 0xfff2b0, transparent: true, opacity: op })));
      m.rotation.z = Math.PI / 2; m.position.set((x0 + x1) / 2, y, 0); parent.add(m); return m;
    },
    grow: (o, d = 0.7) => { o.scale.setScalar(0.001); return tween(d, (t) => o.scale.setScalar(Math.max(0.001, t)), ease.out); },
    settle: async (m, seats, d = 1.2) => {
      m.speed = 0; const from = m.list.map((b) => b.position.clone());
      await tween(d, (t) => m.list.forEach((b, k) => b.position.lerpVectors(from[k], seats[k], t)), ease.inOut);
      m.seats = seats; m.amp = 0.01;
    },
  };
  return H;
}

// Easy → hard (SKILL): the round order is mixed each time; levels = halves; answers shuffled. After an answer the
// experiment shows why, then a tap goes on (the student sets the pace). 3 wrong tries show the answer.
const ORDER = shuffle(ROUNDS.map((_, j) => j));
function round(k, g) {
  const R = ROUNDS[ORDER[k]], H = helpers(g);
  H.G = new THREE.Group(); g.stage.root.add(H.G); popIn(H.G, 1, 0.4);
  const S = R.scene(H);
  g.goal(R.ask, k);
  chooseText(g, k, R.o, R.a, { why: R.o[R.a], onRight: () => S.why(), onReveal: () => S.why() });
}
// 🔍 Explore first (SKILL): each experiment plays with its answer on it; a tap goes on, nothing is wrong.
function explore(k, g) {
  const R = ROUNDS[k], H = helpers(g);
  H.G = new THREE.Group(); g.stage.root.add(H.G); popIn(H.G, 1, 0.4);
  const S = R.scene(H); S.why();
  g.goal(R.ask, k); g.stage.tag(`<b>${R.o[R.a]}</b>`, g.stage.root, [0, 2.7, 0], 'big gold');
  g.setTap(() => g.right(k, true, R.o[R.a], 0, false));
}
const PARTS = [{ key: 'explore', icon: '🔍', name: 'Explore', n: ROUNDS.length, run: explore }, { key: 'q', icon: '🔬', name: 'Questions', n: ROUNDS.length, run: round }];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'sollab', parts: PARTS, cam: [0, -0.3, 14], target: [0, -0.7, 0], excite: true });
}

// sea water boils dry: the water flies off, salt stays
function seaWater(H) {
  const b = H.beaker(0, -1.6, 1.4, 2.4, 1.8), w = b.g.children.at(-1);
  const water = H.mol(b.g, { n: 14, lo: b.lo, hi: b.hi, mat: MOLM.air, r: 0.11, speed: 0.8 });
  const salt = H.mol(b.g, { n: 8, lo: b.lo, hi: b.hi, mat: MOLM.white, r: 0.09, speed: 0.8 });
  return { async why() {
    H.fire(H.G, 0, -2.6, 1.0);
    water.hi.y = 6; water.lo.y = 2.6; water.speed = 2.4;
    await tween(2.0, (t) => { w.scale.y = Math.max(0.02, 1 - t); w.position.y = 0.9 * w.scale.y; salt.hi.y = Math.max(0.2, 1.8 * (1 - t)); });
    await H.settle(salt, gridSeats(4, 2, 0.24, V(0, 0.15)));
    H.tag('<b>salt is left: it was a solution</b>', b.g, [0, 3.0, 0], 'big gold');
  } };
}
// 100 little cubes of solution, 3 are H₂O₂
function percent3(H) {
  const g = new THREE.Group(); g.position.y = -0.4; H.G.add(g);
  const blue = new THREE.MeshBasicMaterial({ color: 0x3a6fd0, transparent: true, opacity: 0.5 }), cubes = [];
  for (let k = 0; k < 100; k++) {
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), blue); c.position.set(-1.62 + 0.36 * (k % 10), -1.62 + 0.36 * Math.floor(k / 10), 0); g.add(c); cubes.push(c);
  }
  return { async why() {
    for (const k of [0, 1, 2]) { cubes[k].material = MOLM.gold; await tween(0.3, (t) => cubes[k].scale.setScalar(1 + 0.5 * Math.sin(t * Math.PI))); }
    H.tag('<b>3 in every 100 = 3 %</b>', g, [0, 2.2, 0], 'big gold');
  } };
}
// pigment sits at the bottom of the tin; a stirrer spreads it again
function paint(H) {
  const b = H.beaker(0, -1.6, 1.3, 2.4, 2.0, new THREE.MeshBasicMaterial({ color: 0xc8c8d0, transparent: true, opacity: 0.18, depthWrite: false }));
  const p = H.mol(b.g, { seats: gridSeats(6, 2, 0.32, V(0, 0.2)), mat: MOLM.red, r: 0.14, amp: 0.01 });
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.8, 12), STEEL); stick.position.set(0.3, 1.6, 0); stick.rotation.z = 0.25; b.g.add(stick); stick.visible = false;
  return { async why() {
    stick.visible = true;
    await tween(1.2, (t) => (stick.position.x = 0.3 * Math.cos(t * 12)), ease.lin);
    p.free(b.lo, b.hi); p.speed = 0.7;
    H.tag('<b>paint is a suspension: it settles</b>', b.g, [0, -0.6, 0], 'big gold');
  } };
}
// a torch shines through a solution and a colloid
function tyndall(H) {
  const s = H.beaker(-1.3, -1.6, 1.1, 2.6, 2.1), c = H.beaker(2.1, -1.6, 1.1, 2.6, 2.1, new THREE.MeshBasicMaterial({ color: 0xd8d8e0, transparent: true, opacity: 0.2, depthWrite: false }));
  H.mol(s.g, { n: 20, lo: s.lo, hi: s.hi, mat: MOLM.gold, r: 0.04, speed: 0.6 });
  H.mol(c.g, { n: 16, lo: c.lo, hi: c.hi, mat: MOLM.white, r: 0.1, speed: 0.4 });
  const torch = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 0.4), STEEL); torch.position.set(-3.6, -0.4, 0); H.G.add(torch);
  H.beam(H.G, -3.15, 3.2, -0.4, 0.04, 0.2);
  H.tag('solution', s.g, [0, 3.0, 0]); H.tag('colloid', c.g, [0, 3.0, 0]);
  return { async why() {
    const b = H.beam(c.g, -1.05, 1.05, 1.2, 0.13); await H.grow(b);
    H.tag('<b>big particles scatter the light</b>', H.G, [0, -2.4, 0], 'big gold');
  } };
}
function concDil(H) {
  const a = H.beaker(-1.7, -1.6), b = H.beaker(1.7, -1.6);
  H.mol(a.g, { n: 3, lo: a.lo, hi: a.hi, mat: MOLM.gold, r: 0.13, speed: 0.8 });
  H.mol(b.g, { n: 18, lo: b.lo, hi: b.hi, mat: MOLM.gold, r: 0.13, speed: 0.8 });
  return { async why() {
    H.tag('dilute: a little solute', a.g, [0, 3.0, 0], 'big'); await sleep(0.4);
    H.tag('<b>concentrated: a lot</b>', b.g, [0, 3.0, 0], 'big gold');
  } };
}
function saturated(H) {
  const b = H.beaker(0, -1.6, 1.4, 2.6, 2.1);
  H.mol(b.g, { n: 14, lo: b.lo, hi: b.hi, mat: MOLM.gold, r: 0.12, speed: 0.8 });
  H.mol(b.g, { seats: gridSeats(5, 2, 0.28, V(0, 0.15)), mat: MOLM.gold, r: 0.13, amp: 0.01 });
  return { async why() { H.tag('<b>no more can dissolve: saturated</b>', b.g, [0, 3.1, 0], 'big gold'); } };
}
// supersaturated: a seed crystal makes the extra solute come out at once
function superSat(H) {
  const b = H.beaker(0, -1.6, 1.4, 2.6, 2.1);
  const m = H.mol(b.g, { n: 22, lo: b.lo, hi: b.hi, mat: MOLM.gold, r: 0.12, speed: 0.8 });
  return { async why() {
    const seed = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.22), MOLM.gold); b.g.add(seed);
    await tween(0.8, (t) => seed.position.set(0, 3.2 - 3.0 * t, 0), ease.in);
    const seats = gridSeats(4, 3, 0.26, V(0, 0.45), 1).concat(gridSeats(5, 2, 0.26, V(0, 1.2))).slice(0, 12);
    const out = { list: m.list.slice(0, 12), speed: 0, seats: null };
    const from = out.list.map((x) => x.position.clone());
    m.list.splice(0, 12); await tween(1.2, (t) => out.list.forEach((x, k) => x.position.lerpVectors(from[k], seats[k], t)), ease.inOut);
    H.tag('<b>extra solute: supersaturated</b>', b.g, [0, 3.1, 0], 'big gold');
  } };
}
function sandSugar(H) {
  const a = H.beaker(-1.7, -1.6), b = H.beaker(1.7, -1.6);
  H.mol(a.g, { n: 16, lo: a.lo, hi: a.hi, mat: MOLM.white, r: 0.05, speed: 0.6 });
  const sand = H.mol(b.g, { n: 9, lo: b.lo, hi: b.hi, mat: MOLM.brown, r: 0.2, speed: 0.6 });
  H.tag('sugar + water', a.g, [0, 3.0, 0]); H.tag('sand + water', b.g, [0, 3.0, 0]);
  return { async why() {
    await H.settle(sand, gridSeats(5, 2, 0.4, V(0, 0.25)).slice(0, 9));
    H.tag('<b>never settles: a solution</b>', a.g, [0, -0.6, 0], 'big gold'); H.tag('settles: not a solution', b.g, [0, -0.6, 0], 'big');
  } };
}
// iodine grains sit in water but spread in spirit
function iodine(H) {
  const a = H.beaker(-1.7, -1.6), b = H.beaker(1.7, -1.6, 1.1, 2.6, 2.0, new THREE.MeshBasicMaterial({ color: 0xc89cff, transparent: true, opacity: 0.16, depthWrite: false }));
  H.mol(a.g, { seats: gridSeats(2, 2, 0.24, V(0, 0.15)), mat: MOLM.purple, r: 0.11, amp: 0.01 });
  const io = H.mol(b.g, { seats: gridSeats(2, 2, 0.24, V(0, 0.15)), mat: MOLM.purple, r: 0.11, amp: 0.01 });
  H.tag('water (polar)', a.g, [0, 3.0, 0]); H.tag('spirit', b.g, [0, 3.0, 0]);
  return { async why() {
    io.free(b.lo, b.hi); io.speed = 0.8;
    await sleep(0.8);
    H.tag('<b>non-polar iodine likes the spirit</b>', H.G, [0, -2.3, 0], 'big gold');
  } };
}
function methanol(H) {
  const a = H.beaker(-1.7, -1.6), b = H.beaker(1.7, -1.6, 1.1, 2.6, 2.0, new THREE.MeshBasicMaterial({ color: 0xf2d860, transparent: true, opacity: 0.18, depthWrite: false }));
  H.tag('water', a.g, [0, 3.0, 0]); H.tag('benzene', b.g, [0, 3.0, 0]);
  return { async why() {
    H.mol(a.g, { n: 10, lo: a.lo, hi: a.hi, mat: MOLM.purple, r: 0.13, speed: 0.8 });
    H.tag('<b>–OH is polar: like dissolves like</b>', H.G, [0, -2.3, 0], 'big gold');
  } };
}
// big balls + small balls: the small ones fill the gaps
function ponder(H) {
  const box = edgeBox(2.0, 3.6, 1.0, { open: true }); box.position.set(0, 0, 0); H.G.add(box);
  const big = gridSeats(3, 3, 0.62, V(0, -1.15)), small = [];
  for (let x = 0; x < 6; x++) for (let y = 0; y < 5; y++) small.push(V(-0.75 + 0.3 * x, 0.35 + 0.3 * y, 0));
  H.mol(box, { seats: big, mat: MOLM.air, r: 0.3, amp: 0.005 });
  const s = H.mol(box, { seats: small, mat: MOLM.purple, r: 0.12, amp: 0.005 });
  const line = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.04, 0.04), MOLM.red); line.position.y = 1.8; box.add(line);
  H.tag('1 litre?', line, [1.9, 0, 0]);
  return { async why() {
    const gaps = []; for (let k = 0; k < small.length; k++) gaps.push(V(-0.75 + 0.3 * (k % 6), -1.6 + 0.24 * Math.floor(k / 6) + (k % 2) * 0.1, -0.35));
    const from = s.list.map((b) => b.position.clone()); s.seats = null; s.speed = 0;
    await tween(1.4, (t) => s.list.forEach((b, k) => b.position.lerpVectors(from[k], gaps[k], t)), ease.inOut);
    s.seats = gaps;
    H.tag('<b>small molecules slip into the gaps: less!</b>', box, [0, -2.4, 0], 'big gold');
  } };
}
function soda(H) {
  const bot = new THREE.Group(); bot.position.y = -2.0; H.G.add(bot);
  const glass = new THREE.MeshBasicMaterial({ color: 0x66cc88, transparent: true, opacity: 0.2, depthWrite: false });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 2.6, 32), glass); body.position.y = 1.3; bot.add(body);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 1.0, 0.8, 32), glass); neck.position.y = 3.0; bot.add(neck);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.25, 24), MOLM.red); cap.position.y = 3.5; bot.add(cap);
  const co2 = H.mol(bot, { n: 14, lo: V(-0.7, 0.1, -0.3), hi: V(0.7, 2.5, 0.3), mat: MOLM.white, r: 0.1, speed: 0.6 });
  return { async why() {
    await tween(0.6, (t) => cap.position.set(1.4 * t, 3.5 + 1.0 * t, 0), ease.out); cap.visible = false;
    co2.hi.y = 6; co2.speed = 2.6;
    H.tag('<b>pressure drops → CO₂ escapes</b>', bot, [0, -0.6, 0], 'big gold');
  } };
}
function warmDrink(H) {
  const b = H.beaker(0, -1.6, 1.4, 2.4, 1.9);
  const gas = H.mol(b.g, { n: 12, lo: b.lo, hi: b.hi, mat: MOLM.white, r: 0.11, speed: 0.6 });
  return { async why() {
    H.fire(H.G, 0, -2.6, 1.0);
    gas.hi.y = 6; gas.speed = 2.4;
    await sleep(1.0);
    H.tag('<b>hotter → less gas stays dissolved</b>', b.g, [0, 3.0, 0], 'big gold');
  } };
}
