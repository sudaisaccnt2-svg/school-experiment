// Cell Lab (Unit 7): each question is a small 3D cell or experiment. Watch, pick the answer; after the right answer the
// scene shows why. Covers Short Q iii, iv, v, viii, ix, x and Long Q I (electroplating), III (corrosion, electrolytic vs
// voltaic, getting a metal from its compound) and V (NaOH from brine).
import { THREE, emissive, sleep, tween, ease, popIn, ball } from './kit.js';
import { runGame, chooseText, shuffle } from './rounds.js';
import { MOLM, WATER, Molecules } from './gas3d.js';
import { cell, flow, ion, electron, METALS, RUST, CAT, ANI, grow } from './chem7.js';
import { BUILDERS as CELL_PICTURES } from '../lesson/electrochem-kit.js';

const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
const MELT = new THREE.MeshBasicMaterial({ color: 0xff8c33, transparent: true, opacity: 0.3, depthWrite: false });
const BLUE = new THREE.MeshBasicMaterial({ color: 0x1a73ff, transparent: true, opacity: 0.32, depthWrite: false });
const H2 = emissive(0xe6f0ff, 1.2), CL2 = emissive(0xc0ff4d, 1.4);
const ROUNDS = [
  { ask: 'Short Q iii: why is NaOH a strong electrolyte but NH₄OH a weak one?', o: ['NaOH splits fully into ions; NH₄OH only a little',
    'NaOH is heavier', 'NH₄OH has no ions at all'], a: 0, scene: strongWeak },
  { ask: 'Short Q iv: which of these prevents corrosion?', o: ['keeping iron wet', 'painting or galvanizing it', 'adding salt'], a: 1, scene: paint },
  { ask: 'Short Q v (Nelson cell): which gas comes off at the cathode?', o: ['Cl₂', 'O₂', 'H₂'], a: 2, scene: (H) => nelson(H, 0) },
  { ask: 'Nelson cell: which gas comes off at the anode?', o: ['Cl₂', 'H₂', 'N₂'], a: 0, scene: (H) => nelson(H, 1) },
  { ask: 'Long Q V: in brine, which ion takes the electrons at the cathode?', o: ['Na⁺', 'H⁺', 'Cl⁻'], a: 1, scene: (H) => nelson(H, 2) },
  { ask: 'Nelson cell: what drips into the catch basin?', o: ['NaOH', 'NaCl', 'Na metal'], a: 0, scene: (H) => nelson(H, 3) },
  { ask: 'Short Q viii: why is oxygen needed for rusting?', o: ['it melts the iron', 'it takes the electrons at the cathodic site', 'it only adds colour'],
    a: 1, scene: rustDrop },
  { ask: 'Short Q ix (Daniell cell): which plate is the anode?', o: ['zinc', 'copper', 'the salt bridge'], a: 0, scene: (H) => daniell(H, 0) },
  { ask: 'Daniell cell: which way do the electrons go?', o: ['zinc → copper, through the wire', 'copper → zinc, through the wire',
    'through the salt bridge'], a: 0, scene: (H) => daniell(H, 1) },
  { ask: 'Short Q x: what is an electrolytic cell used for?', o: ['lighting a torch', 'electroplating, refining copper, making Na and NaOH',
    'keeping food cold'], a: 1, scene: uses },
  { ask: 'Long Q I: in electroplating, the object to be plated is the:', o: ['anode', 'cathode', 'electrolyte'], a: 1, scene: plating },
  { ask: 'Long Q III (b): which cell needs a battery to work?', o: ['electrolytic cell', 'voltaic cell'], a: 0, scene: twoCells },
  { ask: 'Long Q III (c): how is sodium metal got from its compound?', o: ['heat salt in air', 'electrolysis of molten NaCl (Down cell)',
    'dissolve salt in water'], a: 1, scene: down },
  { ask: 'Long Q III (a): rust is:', o: ['Fe₂O₃·xH₂O (hydrated iron oxide)', 'pure iron', 'iron chloride'], a: 0, scene: rustBar },
];

function helpers(g) {
  const stage = g.stage;
  const H = {
    G: null, stage,
    on(f) { g.onFrame(f); },
    mol(parent, o) { const m = new Molecules(parent, o); H.on((dt) => m.update(dt)); return m; },
    tag: (h, o, off, c = 'big') => stage.tag(h, o, off, c),
    flow(C, rev = false, n = 5) { const p = rev ? [...C.path].reverse() : C.path; H.on(flow(C.g, p, n)); },
    bubbles(parent, x, y0, y1, mat, n = 5) {
      const bs = Array.from({ length: n }, (_, k) => { const b = ball(mat, 0.09); b.position.set(x + 0.12 * ((k % 3) - 1), y0, 0.5); parent.add(b); b.userData.t = k / n; return b; });
      H.on((dt = 0.016) => bs.forEach((b) => { b.userData.t = (b.userData.t + dt * 0.6) % 1; b.position.y = y0 + (y1 - y0) * b.userData.t; }));
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
const PARTS = [{key:'explore',icon:'🔍',name:'Explore',n:ROUNDS.length,run:(k,g)=>{
  const r=ROUNDS[k],h=helpers(g);h.G=new THREE.Group();g.stage.root.add(h.G);const s=r.scene(h);g.goal(r.o[r.a],k);g.later(.4,()=>s.why());g.setTap(()=>g.right(k,true,r.o[r.a],0,false));
}}, { key: 'q', icon: '🔬', name: 'Questions', n: ROUNDS.length, run: round }];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'celllab', parts: PARTS, cam: [0, -0.3, 14], target: [0, -0.7, 0], excite:true });
}

const box = (H, w, h, d, mat, x, y, z = 0) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); H.G.add(m); return m; };

// two bulbs: NaOH bright (all ions), NH₄OH dim (few ions)
function strongWeak(H) {
  const A = cell(H.G, { x: -2.4, y: -2, w: 3.2, h: 2, gap: 0.9, top: 'bulb', level: 1 }), Bc = cell(H.G, { x: 2.4, y: -2, w: 3.2, h: 2, gap: 0.9, top: 'bulb', level: 0.25 });
  A.bulbGlow.visible = Bc.bulbGlow.visible = false;
  const lo = V(-0.6, 0.2, -0.3), hi = V(0.6, 1.5, 0.3);
  H.mol(Bc.g, { n: 6, lo, hi, mat: MOLM.white, r: 0.15, speed: 0.4 });
  H.tag('<b>NaOH</b>', A.g, [0, -0.5, 0]); H.tag('<b>NH₄OH</b>', Bc.g, [0, -0.5, 0]);
  return { async why() {
    H.mol(A.g, { n: 5, lo, hi, mat: CAT, r: 0.14, speed: 0.8 }); H.mol(A.g, { n: 5, lo, hi, mat: ANI, r: 0.14, speed: 0.8 });
    H.mol(Bc.g, { n: 1, lo, hi, mat: CAT, r: 0.14, speed: 0.8 }); H.mol(Bc.g, { n: 1, lo, hi, mat: ANI, r: 0.14, speed: 0.8 });
    A.bulbGlow.visible = Bc.bulbGlow.visible = true;
    H.tag('<b>all ions: bright</b>', A.g, [0, 4.3, 0], 'big gold'); H.tag('<b>few ions: dim</b>', Bc.g, [0, 4.3, 0], 'big gold');
  } };
}
// a bare iron bar rusts; the painted one stays clean
function paint(H) {
  const a = box(H, 2.4, 0.7, 0.7, METALS.Fe, -2, 0), b = box(H, 2.4, 0.7, 0.7, METALS.Fe, 2, 0);
  H.tag('<b>bare</b>', a, [0, 0.9, 0]); H.tag('<b>painted</b>', b, [0, 0.9, 0]);
  return { async why() {
    const coat = box(H, 2.46, 0.76, 0.76, new THREE.MeshStandardMaterial({ color: 0x2a73e6, roughness: 0.35 }), 2, 0); await grow(coat);
    for (let k = 0; k < 8; k++) { const r = ball(RUST, 0.12); r.position.set(-3 + 0.28 * k, (k % 2) * 0.2 - 0.1, 0.38); H.G.add(r); popIn(r, 0.12, 0.2); await sleep(0.08); }
    H.tag('<b>paint keeps water and air out</b>', H.G, [0, -1.6, 0], 'big gold');
  } };
}
// Nelson cell: brine, anode in the middle (Cl₂), cathode walls (H₂), NaOH drips
function nelson(H, step) {
  return reviewedCell(H, 'industrial', {kind:'nelson',stage:'parts'}, ['cathode','anode','cathode','collect'][step]);
}
function oldNelson(H, step) {
  const C = cell(H.G, { y: -2, w: 4, h: 2.4, gap: 1.4, liq: WATER, pa: METALS.C, pc: METALS.Fe });
  H.tag('<b>anode +</b>', C.L, [0, 1.9, 0]); H.tag('<b>cathode −</b>', C.R, [0, 1.9, 0]);
  H.mol(C.g, { n: 3, lo: V(-0.8, 0.2, -0.3), hi: V(0.8, 1.8, 0.3), mat: CAT, r: 0.14, speed: 0.5 });
  H.mol(C.g, { n: 3, lo: V(-0.8, 0.2, -0.3), hi: V(0.8, 1.8, 0.3), mat: ANI, r: 0.14, speed: 0.5 });
  return { async why() {
    H.flow(C);
    if (step === 0 || step === 2) H.bubbles(C.g, 1.4, 0.4, 3.2, H2);
    if (step === 1) H.bubbles(C.g, -1.4, 0.4, 3.2, CL2);
    const txt = ['<b>2H⁺ + 2e⁻ → H₂ at the cathode</b>', '<b>2Cl⁻ → Cl₂ + 2e⁻ at the anode</b>',
      '<b>H⁺ takes electrons more easily than Na⁺</b>', '<b>Na⁺ + OH⁻ → NaOH</b>'][step];
    if (step === 3) { const pool = box(H, 3.6, 0.25, 1.2, new THREE.MeshBasicMaterial({ color: 0xdfe8ff, transparent: true, opacity: 0.5 }), 0, -2.4); await grow(pool); }
    H.tag(txt, C.g, [0, -0.9, 0], 'big gold');
  } };
}
// a drop on iron: electrons run to the edge where O₂ takes them
function rustDrop(H) {
  box(H, 7, 1, 1.4, METALS.Fe, 0, -1.2);
  const drop = ball(WATER, 1); drop.scale.set(2.4, 1, 0.8); drop.position.set(0, -0.7, 0); H.G.add(drop);
  H.tag('<b>water drop</b>', drop, [0, 1.3, 0]);
  return { async why() {
    for (let k = 0; k < 3; k++) {
      const e = electron(H.G, [0, -1.2, 0.75]);
      await tween(0.7, (t) => e.position.set(2.2 * t, -1.2, 0.75));
    }
    for (let k = 0; k < 3; k++) { const o = ion(H.G, false, [2.0 + 0.25 * k, -0.45, 0.5], 0.14); popIn(o, 0.14, 0.2); }
    H.tag('<b>O₂ + H₂O + e⁻ → OH⁻: no oxygen, no rust</b>', H.G, [0, -2.3, 0], 'big gold');
  } };
}
// Daniell cell: zinc left, copper right
function daniell(H, step) {
  return reviewedCell(H, 'daniell', {stage:'parts'}, step===0?'zinc':'work');
}
function oldDaniell(H, step) {
  const C = cell(H.G, { y: -2, w: 4.4, h: 2.4, gap: 1.5, liq: BLUE, pa: METALS.Zn, pc: METALS.Cu, top: 'bulb', level: 0.9 });
  C.bulbGlow.visible = false;
  H.tag('<b>zinc</b>', C.L, [0, -1.6, 0]); H.tag('<b>copper</b>', C.R, [0, -1.6, 0]);
  return { async why() {
    C.bulbGlow.visible = true; H.flow(C);
    for (let k = 0; k < 2; k++) { const z = ion(C.g, true, [-1.2, 0.6 + 0.5 * k, 0.3], 0.14); await tween(0.6, (t) => z.position.x = -1.2 + 0.6 * t); }
    H.tag(step === 0 ? '<b>Zn → Zn²⁺ + 2e⁻: zinc is the anode (−)</b>' : '<b>electrons: zinc → wire → copper</b>', C.g, [0, -0.9, 0], 'big gold');
  } };
}
// what electrolysis makes: a plated object, pure copper, sodium, NaOH
function uses(H) {
  const items = [[METALS.Sn, -3], [METALS.Cu, -1], [emissive(0xe0e0d0, 0.6), 1], [new THREE.MeshBasicMaterial({ color: 0xdfe8ff, transparent: true, opacity: 0.6 }), 3]];
  const ms = items.map(([m, x]) => { const b = box(H, 1.2, 1.2, 1.2, m, x, 0); b.visible = false; return b; });
  H.tag('<b>?</b>', H.G, [0, 0, 0], 'huge');
  return { async why() {
    stageClearQ(H);
    const names = ['plating', 'pure Cu', 'Na', 'NaOH'];
    for (let k = 0; k < 4; k++) { ms[k].visible = true; await grow(ms[k], 0.3); H.tag(`<b>${names[k]}</b>`, ms[k], [0, 1.0, 0], 'big gold'); }
  } };
}
const stageClearQ = (H) => H.stage.clearTags();
// electroplating: object on the − side gets a coat
function plating(H) {
  const C = cell(H.G, { y: -2, w: 4.2, h: 2.4, gap: 1.4, liq: WATER, pa: METALS.Sn, pc: METALS.Fe });
  H.tag('<b>tin</b>', C.L, [0, -1.6, 0]); H.tag('<b>spoon</b>', C.R, [0, -1.6, 0]);
  return { async why() {
    H.flow(C, false, 4);
    for (let k = 0; k < 3; k++) { const s = ion(C.g, true, [-1.1, 0.7 + 0.5 * k, 0.3], 0.14); await tween(0.6, (t) => s.position.x = -1.1 + 2.2 * t); }
    const coat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 2.7, 0.2), METALS.Sn); coat.position.set(1.4, 1.5, 0); C.g.add(coat); await grow(coat);
    H.tag('<b>object = cathode (−): metal ions land on it</b>', C.g, [0, -0.9, 0], 'big gold');
  } };
}
// electrolytic (battery) vs voltaic (bulb)
function twoCells(H) {
  const A = cell(H.G, { x: -2.4, y: -2, w: 3.2, h: 2, gap: 0.9, liq: MELT }), Bc = cell(H.G, { x: 2.4, y: -2, w: 3.2, h: 2, gap: 0.9, top: 'bulb', level: 0.9, pa: METALS.Zn, pc: METALS.Cu, liq: BLUE });
  return { async why() {
    H.flow(A, true, 3); H.flow(Bc, false, 3);
    H.tag('<b>electrolytic: battery pushes</b>', A.g, [0, -0.6, 0], 'big gold'); H.tag('<b>voltaic: makes current</b>', Bc.g, [0, -0.6, 0], 'big gold');
  } };
}
// Down cell: molten salt, Na at the cathode, Cl₂ at the anode
function down(H) {
  return reviewedCell(H, 'industrial', {kind:'downs',stage:'parts'},'cathode');
}
function oldDown(H) {
  const C = cell(H.G, { y: -2, w: 4, h: 2.4, gap: 1.4, liq: MELT, pc: METALS.Fe });
  H.tag('<b>molten NaCl, 600 °C</b>', C.g, [0, -0.6, 0]);
  return { async why() {
    H.flow(C, true, 4); H.bubbles(C.g, -1.4, 0.4, 3.2, CL2);
    for (let k = 0; k < 3; k++) { const n = ball(emissive(0xe0e0d0, 0.8), 0.17); n.position.set(1.05, 0.7 + 0.5 * k, 0.3); C.g.add(n); popIn(n, 0.17, 0.25); await sleep(0.25); }
    H.tag('<b>2Na⁺ + 2e⁻ → 2Na</b>', C.R, [0, 2.2, 0], 'big gold');
  } };
}
function reviewedCell(H,type,options,resultStage) {
  H.G.position.y=-2.4;H.G.scale.setScalar(1.7);let elapsed=0,run=false;
  const update=CELL_PICTURES[type](H.G,options);update(0);
  H.on(dt=>{if(run)elapsed=Math.min(9.8,elapsed+dt);update(elapsed);});
  return {async why(){options.stage=resultStage;run=true;await sleep(8);}};
}
// a nail turns brown and flaky
function rustBar(H) {
  const n = box(H, 3.4, 0.4, 0.4, METALS.Fe, 0, 0);
  H.tag('<b>iron + water + air</b>', n, [0, 1.0, 0]);
  return { async why() {
    const c = box(H, 3.46, 0.46, 0.46, RUST, 0, 0); await grow(c, 1.0);
    H.tag('<b>Fe₂O₃·xH₂O: soft, flaky, full of holes</b>', H.G, [0, -1.4, 0], 'big gold');
  } };
}
