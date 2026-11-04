// Gas Law Lab (Unit 5): a piston cylinder with a pressure dial (and a thermometer for Charles's law). One thing
// changes (the dial or the thermometer); pick where the other ends up. After the right answer the piston or needle
// moves, then the rule in words, then the working piece by piece. Book numbers as printed.
// Easy → hard (SKILL): 🔍 Which way? (bigger, smaller or the same) · 🧮 Numbers (the value, then the working; a tap
// goes on when the student has read it).
// Covers Example 5.1, Practice 5.1, Example 5.2 and numericals i–v (p.150).
import { THREE, sleep, popIn } from './kit.js';
import { runGame, choose, shuffle } from './rounds.js';
import { MOLM, Molecules, pistonCyl, gauge, thermo, flame } from './gas3d.js';

// law, start {P V T}, the change {P | T}, the answer, the four options (first = right), units, the working lines
const ROUNDS = [
  { law: 'B', s: { P: 800, V: 530 }, c: { P: 400 }, ans: 1060, o: [1060, 265, 530, 2120], pu: 'mm Hg', vu: 'dm³',
    rule: 'pressure ÷ 2 → volume × 2', work: ['800 × 530 = 400 × V₂', 'V₂ = 1060 dm³'], book: 'Example 5.1' },
  { law: 'B', s: { P: 3, V: 70.4 }, c: { P: 1.2 }, ans: 176, o: [176, 28.2, 70.4, 211], pu: 'atm', vu: 'cm³',
    rule: 'less pressure → more volume', work: ['3 × 70.4 = 1.20 × V₂', 'V₂ = 176 cm³'], book: 'Practice 5.1' },
  { law: 'B', s: { P: 828, V: 7.55 }, c: { V: 14.3 }, ans: 437.16, o: ['437.160', '1568', '828', '214'], pu: 'torr', vu: 'dm³',
    rule: 'more volume → less pressure', work: ['828 × 7.55 = P₂ × 14.3', 'P₂ = 437.160 torr'], book: 'Numerical i' },
  { law: 'B', s: { P: 1.5, V: 0.8 }, c: { P: 2.1 }, ans: 0.571, o: ['0.571', '1.12', '0.80', '2.52'], pu: 'atm', vu: 'dm³',
    rule: 'more pressure → less volume', work: ['1.5 × 0.80 = 2.1 × V₂', 'V₂ = 0.571 dm³'], book: 'Numerical iv' },
  { law: 'C', s: { V: 3, T: 300 }, c: { T: 400 }, ans: 4, o: [4, 2.25, 3, 7], vu: 'dm³',
    rule: 'hotter → bigger', work: ['3 ÷ 300 = V₂ ÷ 400', 'V₂ = 4 dm³'], book: 'Example 5.2' },
  { law: 'C', s: { V: 5.41, T: 353 }, c: { T: 302 }, ans: 4.62, o: ['4.62', '6.32', '5.41', '3.02'], vu: 'dm³',
    rule: 'colder → smaller', work: ['5.41 ÷ 353 = V₂ ÷ 302', 'V₂ = 4.62 dm³'], book: 'Numerical ii' },
  { law: 'C', s: { V: 731, T: 259 }, c: { T: 273 }, ans: 770.513, o: ['770.513', '693.5', '731', '259'], vu: 'cm³',
    rule: 'warmer → bigger', work: ['−14 °C = 259 K,  0 °C = 273 K', '731 ÷ 259 = V ÷ 273', 'V = 770.513 cm³'], book: 'Numerical iii',
    note: 'Warm it back to 0 °C: how big was it?' },
  { law: 'C', s: { V: 5.13, T: 171 }, c: { T: 319 }, ans: 9.57, o: ['9.57', '2.75', '5.13', '3.19'], vu: 'dm³',
    rule: 'hotter → bigger', work: ['5.13 ÷ 171 = V₂ ÷ 319', 'V₂ = 9.57 dm³'], book: 'Numerical v' },
].map((R) => {
  const e = { ...R.s };
  if (R.law === 'B') { if (R.c.P) { e.P = R.c.P; e.V = R.ans; R.find = 'V'; } else { e.V = R.c.V; e.P = R.ans; R.find = 'P'; } }
  else { e.T = R.c.T; e.V = R.ans; R.find = 'V'; }
  R.e = e;
  R.order = [0, 1, 2, 3].sort((a, b) => ((a * 7 + R.s.V * 13) % 5) - ((b * 7 + R.s.V * 13) % 5));
  return R;
});

// the rig: piston cylinder, dial (Boyle) or thermometer (Charles), tags for the numbers
function build(g, R) {
const stage = g.stage;
  const G = new THREE.Group(); G.position.set(-1.9, 0.2, 0); stage.root.add(G);
  const Vmax = Math.max(R.s.V, R.e.V) * 1.12, vy = (v) => 0.5 + 2.4 * v / Vmax;
  const P = pistonCyl(1.15, 3.6); P.g.position.set(-0.7, -2.7, 0); G.add(P.g); P.set(vy(R.s.V));
  const m = new Molecules(P.g, { n: 16, lo: new THREE.Vector3(-0.85, 0, -0.3), hi: new THREE.Vector3(0.85, vy(R.s.V), 0.3), r: 0.12, speed: 2.2 });
  const tick = (dt) => { m.hi.y = P.pis.position.y; m.update(dt); }; g.onFrame(tick);
  const vt = stage.tag(`<b>${R.s.V} ${R.vu}</b>`, P.pis, [R.law === 'B' ? -1.95 : 1.95, -0.6, 0], 'big');
  let D = null, Th = null, pt = null, tt = null, fl = null;
  if (R.law === 'B') {
    const Pmax = Math.max(R.s.P, R.e.P) * 1.15;
    D = gauge(0.85); D.g.position.set(2.6, 0.2, 0); G.add(D.g); D.set(R.s.P / Pmax); D.f = (p) => p / Pmax;
    pt = stage.tag(`<b>${R.s.P} ${R.pu}</b>`, D.g, [0, -1.35, 0], 'big');
  } else {
    const Tmax = Math.max(R.s.T, R.e.T) * 1.1;
    Th = thermo(3.4); Th.g.position.set(-3.6, -2.6, 0); G.add(Th.g); Th.set(R.s.T / Tmax); Th.f = (t) => t / Tmax;
    tt = stage.tag(`<b>${R.s.T} K</b>`, Th.g, [0, 4.0, 0], 'big');
    m.speed = 2.2 * Math.sqrt(R.s.T / 300);
  }
  popIn(G, 1, 0.4);
  return {
    async change() {                       // the given change happens; the unknown shows "?"
      if (R.find === 'V') vt.innerHTML = '<b>?</b>'; else pt.innerHTML = '<b>?</b>';
      if (R.law === 'B' && R.c.P) { await D.to(D.f(R.c.P), 1.0); pt.innerHTML = `<b>${R.c.P} ${R.pu}</b>`; }
      if (R.law === 'B' && R.c.V) { await P.to(vy(R.c.V), 1.0); vt.innerHTML = `<b>${R.c.V} ${R.vu}</b>`; }
      if (R.law === 'C') {
        if (R.c.T > R.s.T) { fl = flame(0.6); fl.position.set(-0.7, -3.45, 0); G.add(fl); g.onFrame(() => fl.userData.tick()); }
        await Th.to(Th.f(R.c.T), 1.0); tt.innerHTML = `<b>${R.c.T} K</b>`;
        m.speed = 2.2 * Math.sqrt(R.c.T / 300);
      }
    },
    async why(ruleOnly = false) {          // picture, then words, then the working piece by piece
      if (R.find === 'V') { await P.to(vy(R.e.V), 1.2); vt.innerHTML = `<b>${R.o[0]} ${R.vu}</b>`; }
      else { await D.to(D.f(R.e.P), 1.2); pt.innerHTML = `<b>${R.o[0]} ${R.pu}</b>`; }
      stage.tag(`<b>${R.rule}</b>`, G, [0, 3.65, 0], 'big gold'); if (ruleOnly) return; await sleep(1.1);
      for (const [n, w] of R.work.entries()) { stage.tag(w, G, [0, 3.1 - 0.5 * n, 0], n === R.work.length - 1 ? 'big green' : 'big'); await sleep(0.9); }
    },
  };
}


const WAY = shuffle(ROUNDS.map((_, j) => j)), NUM = shuffle(ROUNDS.map((_, j) => j));
function way(k, g) {
  const R = ROUNDS[WAY[k]], rig = build(g, R), up = R.find === 'V' ? R.e.V > R.s.V : R.e.P > R.s.P;
  const what = R.find === 'V' ? 'The volume' : 'The pressure';
  g.goal(`${what} will be…`, k);
  g.later(0.7, () => rig.change());
  choose(g, k, ['bigger', 'smaller', 'the same'], up ? 'bigger' : 'smaller', { w: 2.4, size: 0.45, column: [4.6, 1.6], why: R.rule, tap: true,
    onRight: () => rig.why(true), onReveal: () => rig.why(true) });
}
function nums(k, g) {
  const R = ROUNDS[NUM[k]], rig = build(g, R), unit = R.find === 'V' ? R.vu : R.pu;
  g.goal(R.note ?? (R.find === 'V' ? 'Where does the piston go?' : 'Where does the needle go?'), k);
  g.later(0.7, () => rig.change());
  choose(g, k, R.o.map(String), String(R.o[0]), { w: 2.6, size: 0.42, column: [4.6, 2.0], label: (v) => `${v} ${unit}`, why: `${R.book}: ${R.work[R.work.length - 1]}`, tap: true,
    onRight: () => rig.why(), onReveal: () => rig.why() });
}
const PARTS = [
  { key: 'way', icon: '🔍', name: 'Which way?', n: WAY.length, run: way },
  { key: 'num', icon: '🧮', name: 'Numbers', n: NUM.length, run: nums },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'gaslab', parts: PARTS, cam: [0, 0.6, 14.5], target: [0, 0.5, 0] });
}
