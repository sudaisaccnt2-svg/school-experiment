// Family Names (Unit 3, films 303-305, book pp.69-72): group names, group numbers and the regions of the table.
//   👪 Name it     a column lights up → which family? (alkali metals, halogens, noble gases, carbon family …)
//   👆 Find it     a family name → tap one of its elements (trap: hydrogen is NOT an alkali metal).
//   🔢 Group no.   a column lights up → IA … VIIIA; then its outer electrons appear.
//   🧭 Regions     representative, transition, lanthanide, actinide; "the third halogen", "the second noble gas" …
import { THREE } from './kit.js';
import { runGame, tile, shake, shuffle } from './rounds.js';
import { table3d } from './table3d.js';
import { SYM, NAME, ZOF, place, block, ROMAN, A_COLS } from './u3data.js';

const ALL = Array.from({ length: 118 }, (_, k) => k + 1);
const FAM = { 1: 'alkali metals', 2: 'alkaline earth metals', 13: 'boron family', 14: 'carbon family', 15: 'nitrogen family',
  16: 'oxygen family', 17: 'halogens', 18: 'noble gases' };
const GNUM = (c) => ROMAN[A_COLS.indexOf(c) + 1] + 'A';
const colOf = (z) => place(z)[0] <= 7 ? place(z)[1] : 0;
const inCol = (c) => ALL.filter((z) => colOf(z) === c && !(c === 1 && z === 1));

function board(g, y = 1.25) {
  const T = table3d(g.stage, { color: 'cat', numbers: false, size: 0.37, gap: 0.05 });
  T.group.position.set(0, y, 0); return T;
}
function answers(g, list, y = -1.85, w = 2.0, size = 0.42) {
  return list.map((v, j) => { const t = tile(String(v), { w, h: 0.8, color: '#5a6a8a', size });
    t.position.set((j - (list.length - 1) / 2) * (w + 0.2), y, 0); t.userData.v = v; g.stage.root.add(t); g.stage.pickable(t); return t; });
}
function play(g, k, { test, done, secs = 0, out, onWrong }) {
  let first = true, busy = false;
  if (secs) g.timer(secs, () => { if (!busy) { busy = true; out(); } });
  g.setTap(async (hit) => {
    if (busy || !hit) return;
    const r = test(hit.obj); if (r == null) return;
    if (!r) { first = false; g.wrong(); if (onWrong) onWrong(hit.obj); else shake(hit.obj); return; }
    busy = true; done(hit.obj, first);
  });
}

// ---------------------------------------------------------------- 👪 name it
const NAMER = [1, 17, 18, 2, 14, 16, 13, 15, 17, 1];
function nameIt(k, g) {
  const c = NAMER[k], T = board(g); T.dim(inCol(c));
  const others = shuffle(Object.keys(FAM).map(Number).filter((q) => q !== c)).slice(0, k < 4 ? 2 : 3);
  answers(g, shuffle([FAM[c], ...others.map((q) => FAM[q])]), -1.85, k < 4 ? 3.2 : 2.6, 0.4);
  g.goal('Which family?', k);
  const why = `Group ${GNUM(c)}: ${FAM[c]}`;
  play(g, k, { test: (o) => (o.userData.v != null ? o.userData.v === FAM[c] : null),
    done: (o, first) => { o.tint('#4dff88', 0.9); g.right(k, first, why); }, secs: k >= 7 ? 7 : 0, out: () => g.miss(k, why) });
}

// ---------------------------------------------------------------- 👆 find it
const FINDR = [17, 18, 1, 2, 16, 14, 15, 13, 1, 18];
function findIt(k, g) {
  const c = FINDR[k], T = board(g, 0.9);
  g.stage.tag(FAM[c], T.group, [0, 2.2, 0], 'huge gold');
  g.goal('Tap one of this family', k);
  const why = c === 1 ? 'Li, Na, K …: hydrogen is not an alkali metal' : `Group ${GNUM(c)}: ${FAM[c]}`;
  const show = () => T.dim(inCol(c));
  play(g, k, { test: (o) => (o.userData.z ? colOf(o.userData.z) === c && !(c === 1 && o.userData.z === 1) : null),
    done: (o, first) => { show(); g.right(k, first, why); }, onWrong: (o) => T.shake(o.userData.z),
    secs: k >= 6 ? 7 : 0, out: () => { show(); g.miss(k, why); } });
}

// ---------------------------------------------------------------- 🔢 group number (+ outer electrons)
const GRR = [1, 2, 17, 18, 13, 16, 14, 15, 2, 17];
function groupNo(k, g) {
  const c = GRR[k], T = board(g); T.dim(inCol(c).concat(c === 1 ? [1] : []));
  const want = GNUM(c), opts = k < 3 ? A_COLS.map(GNUM) : shuffle(A_COLS.map(GNUM)).filter((v) => v !== want).slice(0, 3).concat(want);
  answers(g, shuffle(opts), -1.85, k < 3 ? 1.05 : 1.6, 0.5);
  g.goal('Which group number?', k);
  const outer = A_COLS.indexOf(c) + 1;
  const why = `${want}: ${outer} outer electron${outer > 1 ? 's' : ''}`;
  play(g, k, { test: (o) => (o.userData.v != null ? o.userData.v === want : null),
    done: (o, first) => { o.tint('#4dff88', 0.9); g.right(k, first, why); }, secs: k >= 6 ? 7 : 0, out: () => g.miss(k, why) });
}

// ---------------------------------------------------------------- 🧭 regions and "the n-th …" (Test Yourself)
const REG = [
  ['a transition element', (z) => block(z) === 'd', 'd-block: groups IIIB … IIB'],
  ['a representative element', (z) => block(z) === 's' || block(z) === 'p', 's and p blocks: the A groups'],
  ['a lanthanide', (z) => place(z)[0] === 8, 'the row after lanthanum'],
  ['an actinide', (z) => place(z)[0] === 9, 'the row after actinium'],
  ['the third halogen', (z) => z === ZOF.Br, 'F, Cl, Br: bromine'],
  ['the first alkaline earth metal', (z) => z === ZOF.Be, 'beryllium'],
  ['the second noble gas', (z) => z === ZOF.Ne, 'He, Ne: neon'],
  ['the last lanthanide', (z) => z === ZOF.Lu, 'lutetium (Lu)'],
  ['the second actinide', (z) => z === ZOF.Pa, 'Th, Pa: protactinium'],
  ['the 5th element of the 1st transition series', (z) => z === ZOF.Mn, 'Sc Ti V Cr Mn: manganese'],
];
function regions(k, g) {
  const [what, ok, why] = REG[k], T = board(g, 0.9);
  g.stage.tag(`Tap ${what}`, T.group, [0, 2.2, 0], 'huge gold');
  g.goal('Find it', k);
  const show = () => { const keep = ALL.filter(ok); T.dim(keep); keep.forEach((z) => T.pop(z, 1.3)); };
  play(g, k, { test: (o) => (o.userData.z ? ok(o.userData.z) : null),
    done: (o, first) => { show(); g.right(k, first, why, 2.8); }, onWrong: (o) => T.shake(o.userData.z),
    secs: k >= 8 ? 12 : 0, out: () => { show(); g.miss(k, why); } });
}

const PARTS = [
  { key: 'name', icon: '👪', name: 'Name it', n: NAMER.length, run: nameIt, done: 'IA alkali · IIA alkaline earth · VIIA halogens · VIIIA noble gases.' },
  { key: 'find', icon: '👆', name: 'Find it', n: FINDR.length, run: findIt, done: 'You can find every family on the table.' },
  { key: 'group', icon: '🔢', name: 'Group no.', n: GRR.length, run: groupNo, done: 'Group number = outer electrons (IA = 1 … VIIIA = 8).' },
  { key: 'regions', icon: '🧭', name: 'Regions', n: REG.length, run: regions, done: 'Representative, transition, lanthanides, actinides.' },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'families', parts: PARTS, cam: [0, 0.4, 13.5], target: [0, 0.3, 0] });
}
