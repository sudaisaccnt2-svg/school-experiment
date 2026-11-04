// Why? Lab (Unit 5): each short question becomes a small 3D experiment. Watch it, pick the reason; after the right
// answer the experiment shows why. Covers Short Q i–vi and Long Q ii (a, b, c) of p.151.
import { THREE, sleep, tween, popIn } from './kit.js';
import { runGame, chooseText, shuffle } from './rounds.js';
import { MOLM, WATER, STEEL, edgeBox, jar, Molecules, gridSeats, pistonCyl, thermo, flame, arrow3 } from './gas3d.js';

const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
const ROUNDS = [
  { ask: 'Why does cooking take longer up a mountain?', o: ['less air pressure: water boils below 100 °C', 'the fire is weaker up there', 'water is heavier up there'], a: 0, scene: mountain },
  { ask: 'Glass softens slowly; ice melts at 0 °C. Why?', o: ['glass is harder than ice', 'ice is a crystal, glass is amorphous', 'ice holds less heat'], a: 1, scene: glassIce },
  { ask: 'Why does a fan cool a sweaty body?', o: ['the fan blows cold air', 'sweat turns to ice', 'sweat evaporates faster and takes heat away'], a: 2, scene: fanSweat },
  { ask: 'Why are gases less dense than liquids?', o: ['gas particles are far apart', 'gases have no mass', 'gas particles are smaller'], a: 0, scene: density },
  { ask: 'More air pressure on a liquid makes its boiling point:', o: ['lower', 'higher', 'stay the same'], a: 1, scene: pressureBoil },
  { ask: 'Why can a gas be squeezed but a solid cannot?', o: ['gas particles shrink', 'a solid is heavier', 'a gas has big empty spaces'], a: 2, scene: squeeze },
  { ask: 'Which one is boiling?', o: ['left: escaping from the top only', 'right: bubbles all through, at 100 °C'], a: 1, scene: evapBoil },
  { ask: 'Gas escapes through a tiny hole into empty space. This is:', o: ['diffusion', 'effusion'], a: 1, scene: effusion },
  { ask: 'Steam turns into drops on a cold lid. This is:', o: ['condensation', 'evaporation'], a: 0, scene: condense },
];

function helpers(g) {
  const stage = g.stage;
  // shared helpers for the scenes
  const H = {
    G: null,
    on(f) { g.onFrame(f); },
    mol(parent, o) { const m = new Molecules(parent, o); H.on((dt) => m.update(dt)); return m; },
    fire(parent, x, y, s = 1) { const f = flame(s); f.position.set(x, y, 0); parent.add(f); H.on(() => f.userData.tick()); return f; },
    tag: (h, o, off, c = 'big') => stage.tag(h, o, off, c),
    bubbles(parent, x0, x1, y0, y1, n = 6) {
      for (let k = 0; k < n; k++) {
        const b = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), MOLM.white); parent.add(b);
        const x = x0 + (x1 - x0) * Math.random(), d = Math.random();
        H.on(() => { const t = (performance.now() / 1000 * 0.8 + d) % 1; b.position.set(x, y0 + (y1 - y0) * t, 0); });
      }
    },
    beaker(parent, x, y, w = 2.2, hl = 1.4, h = 2.4) {
      const g = edgeBox(w, h, 1.2, { open: true }); g.position.set(x, y + h / 2, 0); parent.add(g);
      const l = new THREE.Mesh(new THREE.BoxGeometry(w, hl, 1.2), WATER); l.position.y = -h / 2 + hl / 2; g.add(l);
      return { g, bottom: -h / 2, top: -h / 2 + hl };
    },
  };
  return H;
}

// Easy → hard (SKILL): the round order is mixed each time; levels = halves. After an answer the experiment shows why,
// then a tap goes on (the student sets the pace).
const ORDER = shuffle(ROUNDS.map((_, j) => j));
function round(k, g) {
  const R = ROUNDS[ORDER[k]], H = helpers(g);
  H.G = new THREE.Group(); g.stage.root.add(H.G); popIn(H.G, 1, 0.4);
  const S = R.scene(H);
  g.goal(R.ask, k);
  chooseText(g, k, R.o, R.a, { why: R.o[R.a], onRight: () => S.why(), onReveal: () => S.why() });
}
const PARTS = [{ key: 'why', icon: '🔬', name: 'Why?', n: ROUNDS.length, run: round }];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'whylab', parts: PARTS, cam: [0, -0.8, 13.5], target: [0, -1.2, 0] });
}


// air arrows pushing down on a pot; n arrows, length L
function airArrows(H, parent, xs, y, L) {
  return xs.map((x) => { const a = arrow3(L, MOLM.white, 0.045); a.rotation.z = Math.PI; a.position.set(x, y + L, 0); parent.add(a); return a; });
}

// i. a pot by the sea and a pot on a mountain
function mountain(H) {
  const G = H.G; G.position.y = 0.5;
  const hill = new THREE.Mesh(new THREE.ConeGeometry(2.4, 3.2, 5), new THREE.MeshStandardMaterial({ color: 0x3a4a3a, roughness: 0.9 }));
  hill.position.set(2.2, -1.8, -0.8); G.add(hill);
  const pots = [[-2.4, -2.6], [2.2, 0.2]].map(([x, y]) => {
    const p = H.beaker(G, x, y, 1.6, 0.9, 1.2); H.fire(G, x, y - 0.75, 0.7); return p;
  });
  const a1 = airArrows(H, G, [-2.9, -2.4, -1.9], -1.3, 1.6), a2 = airArrows(H, G, [2.2], 1.5, 0.9);
  const t1 = thermo(1.8), t2 = thermo(1.8); t1.g.position.set(-0.9, -2.6, 0); t2.g.position.set(3.6, 0.2, 0); G.add(t1.g, t2.g);
  t1.set(0.3); t2.set(0.3);
  H.tag('sea level', pots[0].g, [0, 2.8, 0]); H.tag('mountain', pots[1].g, [0, 1.9, 0]);
  return { async why() {
    await Promise.all([t1.to(0.9, 1.2), t2.to(0.7, 1.2)]);
    H.bubbles(pots[0].g, -0.6, 0.6, -0.55, -0.15, 4); H.bubbles(pots[1].g, -0.6, 0.6, -0.55, -0.15, 4);
    H.tag('<b>100 °C</b>', t1.g, [0, 2.2, 0], 'big red'); H.tag('<b>below 100 °C</b>', t2.g, [0, 2.0, 0], 'big gold');
    await sleep(0.8);
    H.tag('<b>less air pushing → boils cooler → cooks slower</b>', G, [0, 3.4, 0], 'big gold');
  } };
}
// ii. ice (crystal) and glass (amorphous) on a hot plate
function glassIce(H) {
  const G = H.G, ice = new THREE.Group(), gl = new THREE.Group();
  ice.position.set(-2.2, -0.4, 0); gl.position.set(2.2, -0.4, 0); G.add(ice, gl);
  const mi = H.mol(ice, { seats: gridSeats(4, 4, 0.42), mat: MOLM.white, r: 0.16, amp: 0.02 });
  const pts = []; while (pts.length < 16) { const p = V((Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5); if (pts.every((q) => q.distanceTo(p) > 0.34)) pts.push(p); }
  H.mol(gl, { seats: pts, mat: MOLM.glassP, r: 0.16, amp: 0.02 });
  const plate = new THREE.Mesh(new THREE.BoxGeometry(8, 0.15, 1.6), STEEL); plate.position.y = -1.5; G.add(plate);
  H.fire(G, -2.2, -2.5, 0.8); H.fire(G, 2.2, -2.5, 0.8);
  H.tag('ice', ice, [0, 1.4, 0]); H.tag('glass', gl, [0, 1.4, 0]);
  return { async why() {
    H.tag('<b>pattern: all break at 0 °C</b>', ice, [0, 2.1, 0], 'big gold');
    mi.free(V(-1.4, -1.0, -0.3), V(1.4, -0.4, 0.3)); mi.speed = 0.8;
    await tween(1.6, (t) => gl.scale.set(1 + 0.25 * t, 1 - 0.3 * t, 1));
    H.tag('<b>no pattern: softens slowly</b>', gl, [0, 2.1, 0], 'big');
  } };
}
// iii. sweat on skin, a fan blows
function fanSweat(H) {
  const G = H.G, skin = new THREE.Mesh(new THREE.BoxGeometry(5, 0.6, 1.4), new THREE.MeshStandardMaterial({ color: 0xc08a6a, roughness: 0.7 }));
  skin.position.y = -1.8; G.add(skin);
  const sweat = H.mol(G, { n: 14, lo: V(-2.4, -1.5, -0.4), hi: V(2.4, -1.0, 0.4), r: 0.13, speed: 0.6 });
  const fan = new THREE.Group(); fan.position.set(-3.6, 0.8, 0); G.add(fan);
  for (let k = 0; k < 3; k++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.2, 0.05), STEEL); b.position.y = 0.6; const p = new THREE.Group(); p.rotation.z = k * 2.09; p.add(b); fan.add(p); }
  H.on((dt) => (fan.rotation.z -= dt * 12));
  const T = thermo(2.2); T.g.position.set(3.4, -1.5, 0); G.add(T.g); T.set(0.65);
  return { async why() {
    for (const [k, m] of sweat.list.slice(0, 8).entries()) {
      const p0 = m.position.clone(); sweat.list.splice(sweat.list.indexOf(m), 1);
      tween(1.2, (t) => m.position.set(p0.x + 3 * t, p0.y + 3 * t, p0.z)).then(() => (m.visible = false)); await sleep(0.12 * (k ? 1 : 0) + 0.1);
    }
    await T.to(0.35, 1.0);
    H.tag('<b>fast particles leave, taking heat → skin cools</b>', G, [0, 3.0, 0], 'big gold');
  } };
}
// iv. same box: gas vs liquid
function density(H) {
  const G = H.G, a = edgeBox(2.6, 2.6, 1.2), b = edgeBox(2.6, 2.6, 1.2);
  a.position.set(-2.0, 0, 0); b.position.set(2.0, 0, 0); G.add(a, b);
  H.mol(a, { n: 5, lo: V(-1.3, -1.3, -0.5), hi: V(1.3, 1.3, 0.5), r: 0.15, speed: 2.8 });
  H.mol(b, { n: 30, lo: V(-1.3, -1.3, -0.5), hi: V(1.3, 1.3, 0.5), r: 0.15, speed: 0.6 });
  H.tag('gas', a, [0, 1.8, 0]); H.tag('liquid', b, [0, 1.8, 0]);
  return { async why() {
    H.tag('<b>5 particles</b>', a, [0, -1.8, 0], 'big gold'); await sleep(0.5);
    H.tag('<b>30 particles</b>', b, [0, -1.8, 0], 'big gold'); await sleep(0.7);
    H.tag('<b>same space, less mass → lower density</b>', G, [0, 3.0, 0], 'big gold');
  } };
}
// v. push harder on the pot (pressure cooker)
function pressureBoil(H) {
  const G = H.G, p = H.beaker(G, -0.6, -2.4, 2.4, 1.3, 2.0); H.fire(G, -0.6, -3.2, 0.9);
  H.mol(p.g, { n: 12, lo: V(-1.1, -0.95, -0.4), hi: V(1.1, 0.25, 0.4), r: 0.12, speed: 1.2 });
  const arr = airArrows(H, G, [-1.4, -0.6, 0.2], -0.2, 1.2);
  const T = thermo(2.6); T.g.position.set(1.9, -2.4, 0); G.add(T.g); T.set(0.6);
  H.tag('<b>100 °C</b>', T.g, [0, 3.0, 0], 'big');
  return { async why() {
    await tween(1.0, (t) => arr.forEach((a) => a.scale.set(1 + 0.6 * t, 1 + 0.6 * t, 1)));
    await T.to(0.8, 1.0);
    H.tag('<b>more push → must get hotter to boil (pressure cooker)</b>', G, [0, 2.9, 0], 'big gold');
  } };
}
// vi. squeeze a gas and a solid
function squeeze(H) {
  const G = H.G, A = pistonCyl(1.0, 3.2), Bc = pistonCyl(1.0, 3.2);
  A.g.position.set(-2.0, -2.4, 0); Bc.g.position.set(2.0, -2.4, 0); G.add(A.g, Bc.g); A.set(2.4); Bc.set(2.4);
  const gas = H.mol(A.g, { n: 8, lo: V(-0.7, 0, -0.3), hi: V(0.7, 2.4, 0.3), r: 0.13, speed: 2.4 });
  H.on(() => (gas.hi.y = A.pis.position.y));
  const sol = new THREE.Group(); Bc.g.add(sol);
  H.mol(sol, { seats: gridSeats(4, 6, 0.38, V(0, 1.2)), mat: MOLM.air, r: 0.17, amp: 0.02 });
  H.tag('gas', A.g, [0, -0.5, 0]); H.tag('solid', Bc.g, [0, -0.5, 0]);
  return { async why() {
    await Promise.all([A.to(1.0, 1.2), tween(1.2, (t) => Bc.set(2.4 - 0.05 * Math.sin(t * Math.PI * 6)))]);
    H.tag('<b>empty space → squeezes</b>', A.g, [0, 4.6, 0], 'big gold');
    H.tag('<b>no space → won\'t move</b>', Bc.g, [0, 4.6, 0], 'big');
  } };
}
// long ii a. evaporation (surface, any temperature) vs boiling (bubbles, 100 °C)
function evapBoil(H) {
  const G = H.G, L = H.beaker(G, -2.6, -2.0), R = H.beaker(G, 2.6, -2.0); H.fire(G, 2.6, -2.9, 0.8);
  const lm = H.mol(L.g, { n: 10, lo: V(-1.0, -1.15, -0.4), hi: V(1.0, 0.25, 0.4), r: 0.12, speed: 0.8 });
  H.mol(R.g, { n: 10, lo: V(-1.0, -1.15, -0.4), hi: V(1.0, 0.25, 0.4), r: 0.12, speed: 1.6 });
  H.bubbles(R.g, -0.8, 0.8, -1.1, 0.2, 7);
  const esc = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), MOLM.gold); L.g.add(esc);
  H.on(() => { const t = (performance.now() / 1000 * 0.5) % 1; esc.position.set(0.3, 0.25 + 1.8 * t, 0); });
  return { async why() {
    H.tag('<b>evaporation: top only</b>', L.g, [0, 2.3, 0], 'big');
    await sleep(0.6);
    H.tag('<b>boiling: all through, at 100 °C</b>', R.g, [0, 2.3, 0], 'big gold');
    void lm;
  } };
}
// long ii b. effusion: through a pinhole into empty space (diffusion = spreading into another gas)
function effusion(H) {
  const G = H.G, a = edgeBox(2.6, 2.6, 1.2), b = edgeBox(2.6, 2.6, 1.2, { mat: new THREE.MeshBasicMaterial({ color: 0x556070 }) });
  a.position.set(-1.4, 0, 0); b.position.set(1.4, 0, 0); G.add(a, b);
  const wall = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.6, 1.2), new THREE.MeshBasicMaterial({ color: 0x8cbfff, transparent: true, opacity: 0.35 }));
  a.add(wall); wall.position.x = 1.3;
  const gas = H.mol(a, { n: 14, lo: V(-1.3, -1.3, -0.5), hi: V(1.3, 1.3, 0.5), r: 0.13, speed: 2.4 });
  let out = 0;
  H.on(() => {
    for (const m of gas.list) if (out < 8 && Math.abs(m.position.y) < 0.25 && m.position.x > 1.0 && m.userData.v.x > 0) {
      gas.list.splice(gas.list.indexOf(m), 1); out++;
      const p = m.position.clone(); a.remove(m); b.add(m); m.position.set(p.x - 2.8, p.y, p.z);
      const o = new Molecules(b, { n: 0, lo: V(-1.3, -1.3, -0.5), hi: V(1.3, 1.3, 0.5), r: 0.13, speed: 2.4 });
      o.list.push(m); H.on((dt) => o.update(dt)); break;
    }
  });
  H.tag('tiny hole', wall, [0, 0, 0], 'small');
  H.tag('empty', b, [0, 1.8, 0]);
  return { async why() {
    H.tag('<b>effusion: one at a time through a tiny hole</b>', G, [0, 2.4, 0], 'big gold');
    await sleep(0.6);
    H.tag('diffusion = spreading through another gas', G, [0, -2.2, 0], 'big');
  } };
}
// long ii c. condensation: vapour hits a cold lid and forms drops (the reverse of evaporation)
function condense(H) {
  const G = H.G, p = H.beaker(G, 0, -2.4, 3.0, 1.0, 3.0); H.fire(G, 0, -3.3, 0.9);
  const lid = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 1.4), new THREE.MeshStandardMaterial({ color: 0x9cc8ff, roughness: 0.2, metalness: 0.3 }));
  lid.position.y = 1.55; p.g.add(lid);
  const vap = H.mol(p.g, { n: 10, lo: V(-1.4, -0.5, -0.4), hi: V(1.4, 1.45, 0.4), r: 0.12, speed: 2.2 });
  H.tag('cold lid', lid, [2.4, 0, 0]);
  return { async why() {
    for (const [k, m] of vap.list.splice(0, 6).entries()) {
      const p0 = m.position.clone(), to = V(-1.2 + 0.48 * k, 1.38, 0);
      tween(0.6, (t) => m.position.lerpVectors(p0, to, t)).then(() => { m.material = WATER.clone(); m.material.opacity = 0.9; m.scale.multiplyScalar(1.4); });
      await sleep(0.15);
    }
    await sleep(0.6);
    H.tag('<b>gas → liquid: condensation (opposite of evaporation)</b>', G, [0, 3.0, 0], 'big gold');
  } };
}
