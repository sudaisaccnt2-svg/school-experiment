// Table Builder (Unit 3, films 301-302 and 305, book pp.66-69, 72): the table learned by playing.
//   🔤 Symbols   name → tap its symbol (traps: Na, K, Fe, Cu, Mg/Mn …); later symbol → name; then timed.
//   📍 Place     tap where the element lives on a blank table, learned a few elements at a time (see below).
//   📏 Periods   a row lights up → how many elements? Shortest, short, long, longest.
//   📜 History   Mendeleev (atomic weight) or Moseley (atomic number)? Ar and K, the periodic law.
//   🧩 Build     shuffled tiles of a period or group → tap them in atomic-number order (numbers fade out later).
//   🔢 Numbers   atomic numbers of the first 20 (both ways).   🕳️ Missing  a '?' in the full table → which element?
//   🔍 Explore   first (beginners): tap round the table, nothing is wrong.   ⚡ Speed   last: 10 s per round, no hints.
// Parts run easy → hard. No countdowns before ⚡ Speed (user: hard rounds need time); beginner Place rounds hint after
// a few seconds (row, then column). Right answers move on quickly.
import { THREE, popIn, tween } from './kit.js';
import { runGame, tile, shake, shuffle } from './rounds.js';
import { table3d } from './table3d.js';
import { SYM, NAME, ZOF, place, periodOf, shells, GROUP, category, block, CAT_COLOR } from './u3data.js';

const ALL = Array.from({ length: 118 }, (_, k) => k + 1);
function answers(g, list, y = -1.8, w = 1.5, size = 0.55) {
  return list.map((v, j) => { const t = tile(String(v), { w, h: 0.85, color: '#5a6a8a', size });
    t.position.set((j - (list.length - 1) / 2) * (w + 0.25), y, 0); t.userData.v = v; g.stage.root.add(t); g.stage.pickable(t); return t; });
}
let FAST = false;                                // the final ⚡ Speed part: every round has exactly 10 s
function play(g, k, { test, done, secs = 0, out }) {
  let first = true, busy = false;
  if (FAST && out) secs = 10;
  if (secs) g.timer(secs, () => { if (!busy) { busy = true; out(); } }, FAST);
  const showRight = () => g.stage.root.children.filter((o) => o.userData.v != null && test(o)).forEach((o) => o.tint && o.tint('#4dff88', 0.9));
  if (out) g.reveal(() => { if (!busy) { busy = true; showRight(); out(); } });   // 3 wrong tries → the answer shows itself
  g.setTap(async (hit) => {
    if (busy || !hit) return;
    const r = test(hit.obj); if (r == null) return;
    if (!r) { first = false; g.wrong(); shake(hit.obj); return; }
    busy = true; done(hit.obj, first);
  });
}
function miniTable(g, opts = {}) {             // a small table at the top that shows where the answer lives
  const T = table3d(g.stage, { size: 0.25, gap: 0.03, numbers: false, pickable: false, ...opts });
  T.group.position.set(0, 2.55, -0.5); T.dim([], 0.25); return T;
}

// ---------------------------------------------------------------- 🔍 explore (beginners: nothing can be wrong)
// Each round shows one idea on the coloured table; tap around and every tap tells you what that tile is.
const FAMN = { 1: 'alkali metals', 2: 'alkaline earth metals', 17: 'halogens', 18: 'noble gases' };
const KIND = (z) => { const c = category(z); return c === 'metalloid' ? 'metalloid' : ['nonmetal', 'halogen', 'noble'].includes(c) ? 'non-metal' : 'metal'; };
const KCOL = { metal: '#59a8ff', 'non-metal': '#4dff8c', metalloid: '#ff9a40' };
const PCOL = ['', '#ff7359', '#ffad40', '#ffeb59', '#59ff8c', '#59d1db', '#5999ff', '#c880ff'];
const main = (q) => place(q)[0] <= 7;
const EXP = [
  { goal: 'Tap any 3 elements', color: 'cat', key: (z) => z, need: 3, info: (z) => `${SYM[z]} = ${NAME[z]}, number ${z}` },
  { goal: 'Numbers go up one by one: tap 1 to 6', color: 'cat', order: [1, 2, 3, 4, 5, 6], info: (z) => `${z}: ${NAME[z]}` },
  { goal: 'Rows are periods: tap 3 different rows', color: (z) => PCOL[periodOf(z)], key: (z) => periodOf(z), need: 3,
    info: (z) => `Period ${periodOf(z)}`, light: (z, q) => periodOf(q) === periodOf(z) },
  { goal: 'Columns are groups: tap 3 different columns', color: 'cat', key: (z) => (main(z) ? place(z)[1] : null), need: 3,
    info: (z) => { const c = place(z)[1]; return `Group ${GROUP[c]}${FAMN[c] ? ': ' + FAMN[c] : ''}`; },
    light: (z, q) => main(q) && place(q)[1] === place(z)[1] },
  { goal: 'Tap a metal, a non-metal and a metalloid', color: (z) => KCOL[KIND(z)], key: KIND, need: 3,
    info: (z) => `${SYM[z]}: ${KIND(z)}`, light: (z, q) => KIND(q) === KIND(z) },
  { goal: 'Blocks: tap s, p, d and f', color: 'block', key: block, need: 4, info: (z) => `${block(z)}-block`,
    light: (z, q) => block(q) === block(z) },
  { goal: 'Families: tap 3 of them', color: 'cat', key: (z) => (FAMN[place(z)[1]] && main(z) && z !== 1 ? place(z)[1] : null), need: 3,
    info: (z) => FAMN[place(z)[1]], light: (z, q) => main(q) && q !== 1 && place(q)[1] === place(z)[1] },
  { goal: 'The two rows below: tap each', color: 'cat', key: (z) => (place(z)[0] >= 8 ? place(z)[0] : null), need: 2,
    info: (z) => (place(z)[0] === 8 ? 'Lanthanides (after lanthanum, period 6)' : 'Actinides (after actinium, period 7)'),
    light: (z, q) => place(q)[0] === place(z)[0] },
];
function explore(k, g) {
  const E = EXP[k];
  const T = table3d(g.stage, { color: E.color, numbers: true, size: 0.44, gap: 0.05 });
  T.group.position.set(0, 0.55, 0);
  const info = g.stage.tag('', T.group, [0, 2.75, 0], 'huge gold');
  g.goal(E.goal, k);
  const seen = new Set(); let next = 0, busy = false, miss = 0;
  g.setTap((hit) => {
    if (busy || !hit || !hit.obj.userData.z) return;
    const z = hit.obj.userData.z;
    if (E.order) {                                 // 1, 2, 3 … in order (the only round where a tap can be wrong)
      if (z !== E.order[next]) { g.wrong(); T.shake(z); if (++miss < 3) return; }
      const zz = E.order[next]; miss = 0; next++; T.paint(zz, '#4dff88', true);
    } else {
      const key = E.key(z); if (key == null) { T.shake(z); return; }
      seen.add(key);
    }
    info.innerHTML = E.info(z); T.pop(z, 1.5);
    if (E.light) T.dim(ALL.filter((q) => E.light(z, q)), 0.3);
    if (E.order ? next === E.order.length : seen.size >= E.need) { busy = true; g.right(k, true, E.info(z), 1.4); }
  });
}

// ---------------------------------------------------------------- 🔤 symbols
const SYMR = [['H', ['He', 'Ho', 'Hy']], ['He', ['H', 'Hl', 'Hm']], ['Li', ['L', 'Lt', 'Le']], ['C', ['Ca', 'Co', 'Cl']],
  ['N', ['Ni', 'Ne', 'Na']], ['O', ['Os', 'Ox', 'Og']], ['F', ['Fl', 'Fe', 'Fr']], ['Ne', ['N', 'Ni', 'Na']],
  ['Al', ['A', 'Am', 'Au']], ['Si', ['S', 'Sl', 'Sn']],
  ['Na', ['S', 'So', 'N']], ['K', ['P', 'Po', 'Pt']], ['Mg', ['Mn', 'Ma', 'M']], ['S', ['Su', 'Si', 'Sc']],
  ['Fe', ['I', 'Ir', 'F']], ['Cu', ['Co', 'Cp', 'C']], ['Ag', ['Au', 'Sl', 'Si']], ['Au', ['Ag', 'Go', 'Gd']],
  ['Pb', ['Le', 'Ld', 'Pd']], ['Sn', ['Ti', 'Tn', 'S']],
  ['=Cl', ['Calcium', 'Carbon', 'Copper']], ['=Ca', ['Carbon', 'Cobalt', 'Cadmium']],
  ['=Mn', ['Magnesium', 'Mercury', 'Molybdenum']], ['=Ar', ['Arsenic', 'Silver', 'Aluminium']], ['=P', ['Potassium', 'Polonium', 'Lead']],
  ['=Zn', ['Zirconium', 'Sodium', 'Tin']], ['=Br', ['Boron', 'Barium', 'Bismuth']], ['=Hg', ['Hydrogen', 'Helium', 'Holmium']],
  ['=B', ['Barium', 'Beryllium', 'Bromine']], ['=Ba', ['Boron', 'Bromine', 'Beryllium']]];
function symbols(k, g) {
  const [key, wrongs] = SYMR[k], rev = key[0] === '=', s = rev ? key.slice(1) : key, z = ZOF[s];
  const want = rev ? NAME[z] : s;
  const card = tile(rev ? s : NAME[z], { w: rev ? 1.8 : 3.6, h: 1.1, d: 0.3, color: '#3d6ab0', size: rev ? 0.7 : 0.48 });
  card.position.set(0, -0.05, 0); g.stage.root.add(card); popIn(card, 1, 0.4);
  const T = miniTable(g);
  answers(g, shuffle([want, ...wrongs]), -1.8, rev ? 2.6 : 1.4);
  g.goal(rev ? 'Which name?' : 'Which symbol?', k);
  const why = `${NAME[z]} = ${s}`, show = () => { T.dim([z]); T.pop(z, 2.2); };
  play(g, k, { test: (o) => (o.userData.v != null ? o.userData.v === want : null),
    done: (o, first) => { o.tint('#4dff88', 0.9); show(); g.right(k, first, why); },
    out: () => { show(); g.miss(k, why); } });
}

// ---------------------------------------------------------------- 📍 place: a few elements at a time
// User: "reveal only a few, make them practise, then a few more". 13 small levels of 2-6 NEW elements each, in book
// order (row by row, then the long rows). Each level = one 'Meet' round (only the new tiles are shown, with their
// colour; earlier ones faint; tap them to hear their names, then 'Hide and start'), then every new element is asked
// once, then a short look comes back by itself and they are asked again, mixed with 2 from earlier levels (spaced
// review). Unlearned tiles are blank grey: no names, no kind colours, no key. A right tap lights its family.
// Beginners (the first two blocks) get a gentle row → column hint when stuck. The Next-level button lets the student
// move on; until then the level repeats.
const VIEWS = [
  (q) => q <= 18,                                                   // periods 1-3
  (q) => q <= 36,                                                   // + period 4
  (q) => q <= 36 || (place(q)[0] <= 7 && block(q) !== 'd'),         // + main groups of periods 5-7
  (q) => true,                                                      // everything
];
const LEVELS = [
  [0, ['H', 'He', 'Li', 'Be', 'B']], [0, ['C', 'N', 'O', 'F', 'Ne']], [0, ['Na', 'Mg', 'Al', 'Si']], [0, ['P', 'S', 'Cl', 'Ar']],
  [1, ['K', 'Ca', 'Ga', 'Ge']], [1, ['As', 'Se', 'Br', 'Kr']], [1, ['Sc', 'Ti', 'V', 'Cr', 'Mn']], [1, ['Fe', 'Co', 'Ni', 'Cu', 'Zn']],
  [2, ['Rb', 'Sr', 'Cs', 'Ba', 'Fr', 'Ra']], [2, ['In', 'Sn', 'Sb', 'Te', 'I', 'Xe']], [2, ['Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn']],
  [3, ['Ag', 'Au', 'Pt', 'Hg', 'Pd', 'W']], [3, ['La', 'Ce', 'Lu', 'Ac', 'Th', 'U']],
];
const PLAN = [], PLACE_STEPS = [];
LEVELS.forEach(([v, news], li) => {
  if (li) PLACE_STEPS.push(PLAN.length);
  const prior = LEVELS.slice(0, li).flatMap((l) => l[1]);
  PLAN.push({ li, meet: true });
  shuffle(news).forEach((sy) => PLAN.push({ li, z: ZOF[sy] }));
  shuffle(news.concat(shuffle(prior).slice(0, 2))).forEach((sy, j) => PLAN.push({ li, z: ZOF[sy], look: j === 0 }));
});
const AFAM = { 1: 'Alkali metals', 2: 'Alkaline earth metals', 13: 'Boron family', 14: 'Carbon family', 15: 'Nitrogen family',
  16: 'Oxygen family', 17: 'Halogens', 18: 'Noble gases' };
function familyOf(z) {                          // [name, members] as the book groups them
  const [r, c] = place(z);
  if (r >= 8) return [r === 8 ? 'Lanthanides' : 'Actinides', ALL.filter((q) => place(q)[0] === r)];
  if (z === 1) return ['Hydrogen: a family of its own', [1]];
  if (block(z) === 'd') return ['Transition metals', ALL.filter((q) => block(q) === 'd')];
  return [AFAM[c], ALL.filter((q) => q !== 1 && place(q)[0] <= 7 && place(q)[1] === c)];
}
const KINDNAME = { alkali: 'an alkali metal', alkaline: 'an alkaline earth metal', transition: 'a transition metal', metal: 'a metal',
  metalloid: 'a metalloid', nonmetal: 'a non-metal', halogen: 'a halogen', noble: 'a noble gas', lanthanide: 'a lanthanide', actinide: 'an actinide' };
const PLAIN_TILE = '#4a5468';
function placeIt(k, g) { placeRound(PLAN[k], k, g); }
function placeRound(it, k, g) {
  const [v, news] = LEVELS[it.li], view = ALL.filter(VIEWS[v]);
  const fresh = new Set(news.map((sy) => ZOF[sy]));
  const known = new Set(LEVELS.slice(0, it.li).flatMap((l) => l[1]).map((sy) => ZOF[sy]));
  const T = table3d(g.stage, { zs: view, color: 'plain', numbers: false, label: () => '', size: v <= 1 ? 0.5 : 0.42, gap: 0.05 });
  const bb = new THREE.Box3(); view.forEach((q) => bb.expandByPoint(T.at(q)));
  const mid = bb.getCenter(new THREE.Vector3());
  T.group.position.set(-mid.x, 0.45 - mid.y, 0);
  const ask = g.stage.tag('', g.stage.root, [0, 2.6, 0], 'huge gold');
  const lookAt = () => {                          // the new tiles show name + colour; earlier ones faint; the rest blank
    T.relabel((q) => (fresh.has(q) || known.has(q) ? SYM[q] : ''));
    view.forEach((q) => { if (fresh.has(q)) T.paint(q, CAT_COLOR[category(q)], true); else if (known.has(q)) T.paint(q, CAT_COLOR[category(q)]); });
    T.dim([...fresh], 0.5);
  };
  const hide = () => { T.relabel(() => ''); T.recolor('plain'); T.dim(null); };
  if (!FAST) lookToggle(g).hidden = false;
  if (it.meet && !FAST) {                         // a window lists the new ones with names; the table shows where
    lookAt();
    ask.innerHTML = `Level ${it.li + 1} of ${LEVELS.length}`;
    g.goal('New elements', k);
    let pop = g.ui.querySelector('#meetPop');
    if (!pop) { pop = document.createElement('div'); pop.id = 'meetPop'; pop.className = 'roundui'; g.ui.appendChild(pop); }
    pop.innerHTML = '<div class="ncards">' + news.map((sy) => { const q = ZOF[sy];
      return `<div class="ncard" style="border-color:${CAT_COLOR[category(q)]}"><b>${sy}</b><span>${NAME[q]}</span></div>`; }).join('') +
      '</div><button class="ngo">Go ▶</button>';
    pop.hidden = false;
    pop.querySelector('.ngo').onclick = () => { pop.hidden = true; hide(); g.right(k, true, '', 0, true); };
    g.setTap((hit) => {
      const q = hit && hit.obj.userData.z;
      if (q && (fresh.has(q) || known.has(q))) { T.pop(q, 1.5); ask.innerHTML = `${SYM[q]} = ${NAME[q]}: ${KINDNAME[category(q)]}`; }
      else if (q) T.shake(q);
    });
    return;
  }
  const z = it.z, s = SYM[z];
  const [fam, members] = familyOf(z);
  const show = () => {                            // its family lights up; names only on what has been met
    const inView = members.filter((q) => view.includes(q));
    T.relabel((q) => (q === z || (inView.includes(q) && (fresh.has(q) || known.has(q))) ? SYM[q] : ''));
    inView.forEach((q) => T.paint(q, CAT_COLOR[category(q)], true));
    T.paint(z, '#4dff88', true); T.dim(inView.concat([z]), 0.3); T.pop(z, 1.6);
    ask.innerHTML = `${NAME[z]}: ${fam}`;
  };
  let solved = false, started = false;
  const start = () => {
    hide(); started = true; g.clock(); ask.innerHTML = `${NAME[z]} (${s})`; g.goal('Where does it live?', k);
    play(g, k, { test: (o) => (started && o.userData.z ? o.userData.z === z : null),
      done: (o, first) => { solved = true; show(); g.right(k, first, `${NAME[z]}: ${fam}`, 1.4); },
      out: () => { solved = true; show(); g.miss(k, `${NAME[z]}: ${fam}`, 1.4); } });
    if (v <= 1 && !FAST) {                        // beginners: stuck for a while → the row lights, later the column
      const [r, c] = place(z);
      const inRow = (q) => place(q)[0] === r, inCol = (q) => place(q)[1] === c && place(q)[0] <= 7;
      g.later(8, () => { if (!solved) T.dim(view.filter(inRow), 0.35); });
      g.later(15, () => { if (!solved) T.dim(view.filter((q) => inRow(q) || inCol(q)), 0.35); });
    }
  };
  if (it.look && !FAST && lookOn()) {             // second round of asks: one more short look (the student can switch it off)
    lookAt(); ask.innerHTML = 'One more look…'; g.goal('Look again', k);
    g.later(4, start);
  } else start();
}
const lookOn = () => localStorage.getItem('ptbuild.look') !== 'off';
function lookToggle(g) {                          // user: a checkbox to switch off the look in the middle
  let el = g.ui.querySelector('#lookChk');
  if (!el) {
    el = document.createElement('label'); el.id = 'lookChk'; el.className = 'roundui';
    el.innerHTML = '<input type="checkbox"> One more look in the middle';
    g.ui.appendChild(el);
    el.querySelector('input').onchange = (e) => localStorage.setItem('ptbuild.look', e.target.checked ? 'on' : 'off');
  }
  el.querySelector('input').checked = lookOn();
  return el;
}
const placeAt = (sy) => ({ li: LEVELS.findIndex((l) => l[1].includes(sy)), z: ZOF[sy] });

// ---------------------------------------------------------------- 📏 periods
const LEN = { 1: 2, 2: 8, 3: 8, 4: 18, 5: 18, 6: 32 };
const PER = [['n', 1], ['n', 2], ['n', 4], ['n', 6], ['n', 3], ['n', 5], ['n', 2], ['n', 4], ['t', 'shortest', [1]], ['t', 'with 32 elements', [6]],
  ['t', 'short (8 elements)', [2, 3]], ['t', 'long (18 elements)', [4, 5]]];
function periods(k, g) {
  const [kind, a, rows] = PER[k];
  const T = table3d(g.stage, { color: 'cat', numbers: false, size: 0.37, gap: 0.05 });
  T.group.position.set(0.3, 1.4, 0);
  const inRow = (q, p) => periodOf(q) === p;
  if (kind === 'n') {
    const p = a; T.dim(ALL.filter((q) => inRow(q, p)));
    g.stage.tag(`${p}`, T.group, [-4.25, (4 - p) * 0.42, 0], 'huge gold');
    answers(g, shuffle([2, 8, 18, 32]), -1.95, 1.2);
    g.goal('How many elements in this period?', k);
    const why = `Period ${p}: ${LEN[p]} elements`;
    play(g, k, { test: (o) => (o.userData.v != null ? o.userData.v === LEN[p] : null),
      done: (o, first) => { o.tint('#4dff88', 0.9); g.right(k, first, why); }, out: () => g.miss(k, why) });
  } else {
    g.goal(`Tap a period that is ${a}`, k);
    const why = rows.length > 1 ? `Periods ${rows.join(' and ')}` : `Period ${rows[0]}`;
    const show = () => T.dim(ALL.filter((q) => rows.includes(periodOf(q))));
    play(g, k, { test: (o) => (o.userData.z ? rows.includes(periodOf(o.userData.z)) && place(o.userData.z)[0] <= 7 : null),
      done: (o, first) => { show(); g.right(k, first, why); }, out: () => { show(); g.miss(k, why); } });
  }
}

// ---------------------------------------------------------------- 📜 history
const HIST = [['Ordered the elements by atomic WEIGHT', 'Mendeleev'], ['Ordered the elements by atomic NUMBER', 'Moseley'],
  ['An English physicist', 'Moseley'], ['Properties depend on the atomic number', 'Modern periodic law'],
  ['Ar or K: which comes first?', 'Ar'], ['Each next element has one more…', 'proton'],
  ['How many elements are in the table?', '118'], ['The rows of the table are called…', 'periods'],
  ['The columns of the table are called…', 'groups'], ['Elements in one group behave…', 'alike']];
const HOPTS = [['Mendeleev', 'Moseley'], ['Mendeleev', 'Moseley'], ['Mendeleev', 'Moseley'], ['Modern periodic law', 'Atomic weight law'],
  ['Ar', 'K'], ['proton', 'neutron', 'electron shell'], ['118', '92', '103'], ['periods', 'groups', 'blocks'],
  ['groups', 'periods', 'shells'], ['alike', 'differently', 'randomly']];
function history(k, g) {
  const [q, want] = HIST[k];
  const card = tile(q, { w: 8.4, h: 1.1, color: '#8a7550', size: 0.4 }); card.position.set(0, 1.9, 0); g.stage.root.add(card); popIn(card, 1, 0.4);
  let after = () => {};
  if (want === 'Ar') {                            // the two tiles: by weight K would come first, by number Ar does
    [['Ar', 18, 39.9], ['K', 19, 39.1]].forEach(([s, z, w], j) => {
      const t = tile(`${s}  ${z}`, { w: 2.2, h: 1.2, color: j ? '#ff6b52' : '#bd80ff', size: 0.5 }); t.position.set(j ? 1.5 : -1.5, 0.35, 0); g.stage.root.add(t);
      g.stage.tag(`weight ${w}`, t, [0, -0.95, 0], 'big');
    });
    after = () => g.stage.tag('18 before 19 ✓', g.stage.root, [0, -0.75, 0], 'big gold');
  }
  answers(g, shuffle(HOPTS[k]), -1.75, want.length > 9 || HOPTS[k].some((v) => v.length > 9) ? 3.6 : 2.4, 0.45);
  g.goal(want === 'Ar' ? 'Modern table: which comes first?' : 'Who or what?', k);
  const why = { Mendeleev: 'Mendeleev: by atomic weight', Moseley: 'Moseley: by atomic number (protons)',
    'Modern periodic law': 'Modern periodic law: atomic number', Ar: 'Ar 18 comes before K 19 (atomic number)', proton: 'One more proton each time',
    118: '118 elements', periods: 'Rows = periods (7)', groups: 'Columns = groups', alike: 'One group = one family: alike' }[want];
  play(g, k, { test: (o) => (o.userData.v != null ? o.userData.v === want : null),
    done: (o, first) => { o.tint('#4dff88', 0.9); after(); g.right(k, first, why, 2.8); },
    out: () => { after(); g.miss(k, why); } });
}

// ---------------------------------------------------------------- 🧩 build a row or a column in order (Moseley)
const BUILD = [['Period 1', [1, 2], true], ['Period 2', [3, 4, 5, 6, 7, 8, 9, 10], true], ['Group IA', [3, 11, 19, 37, 55], true, 'v'],
  ['Period 3', [11, 12, 13, 14, 15, 16, 17, 18], false], ['Group VIIA', [9, 17, 35, 53], false, 'v'],
  ['Group VIIIA', [2, 10, 18, 36, 54, 86], false, 'v'], ['Group IIA', [4, 12, 20, 38, 56], false, 'v'],
  ['Period 4, start', [19, 20, 21, 22, 23, 24, 25, 26], false], ['Period 4, end', [29, 30, 31, 32, 33, 34, 35, 36], false]];
function buildRow(k, g) {
  const [name, zs, nums, dir] = BUILD[k], vert = dir === 'v';
  g.stage.tag(name, g.stage.root, vert ? [-3.4, 2.65, 0] : [0, 2.5, 0], 'huge gold');
  const slot = (i) => (vert ? new THREE.Vector3(-3.4, 1.85 - i * 0.72, 0) : new THREE.Vector3((i - (zs.length - 1) / 2) * 1.05, 1.35, 0));
  zs.forEach((z, i) => { const s = tile('', { w: 0.95, h: 0.7, d: 0.05, color: '#2a3346' }); s.position.copy(slot(i)); g.stage.root.add(s); });
  const loose = shuffle(zs).map((z, i) => {
    const t = tile(nums ? `${z} ${SYM[z]}` : SYM[z], { w: 0.95, h: 0.7, color: '#3d6ab0', size: nums ? 0.42 : 0.55 });
    const cols = vert ? 3 : Math.ceil(zs.length / 2);
    t.position.copy(vert ? new THREE.Vector3(0.2 + (i % cols) * 1.2, 1.2 - Math.floor(i / cols) * 1.0, 0)
      : new THREE.Vector3((i % cols - (cols - 1) / 2) * 1.25, -0.25 - Math.floor(i / cols) * 0.95, 0));
    t.userData.z = z; g.stage.root.add(t); g.stage.pickable(t); return t;
  });
  g.goal('Put them in order: atomic number', k);
  let next = 0, first = true, busy = false, miss = 0;
  g.setTap(async (hit) => {
    if (busy || !hit || !hit.obj.userData.z) return;
    let t = hit.obj;
    if (t.userData.z !== zs[next]) {
      first = false; g.wrong(); shake(t);
      if (++miss < 3) return;
      t = loose.find((q) => q.userData.z === zs[next]);     // 3 wrong tries: the right tile goes by itself
    }
    miss = 0;
    g.stage.unpickable(t); const a = t.position.clone(), b = slot(next).setZ(0.05); next++;
    tween(0.35, (u) => t.position.lerpVectors(a, b, u));
    if (!nums) t.set(`${t.userData.z} ${SYM[t.userData.z]}`);
    if (next === zs.length) { busy = true; g.right(k, first, `${name}: ${zs.map((z) => SYM[z]).join(' ')}`); }
  });
}

// ---------------------------------------------------------------- 🔢 atomic numbers (first 20)
const NUMS = [['z', 1], ['z', 2], ['z', 6], ['z', 8], ['s', 3], ['z', 11], ['s', 2], ['s', 10], ['z', 7], ['s', 4],
  ['z', 17], ['s', 13], ['z', 20], ['s', 16], ['z', 15], ['s', 19], ['z', 12], ['s', 9], ['z', 14], ['s', 18]];
function numbers(k, g) {
  const [kind, z] = NUMS[k];
  const near = shuffle([z - 2, z - 1, z + 1, z + 2, z + 8, z - 8].filter((q) => q >= 1 && q <= 20 && q !== z)).slice(0, 3);
  const card = tile(kind === 'z' ? `${SYM[z]}  ${NAME[z]}` : `Number ${z}`, { w: 4.4, h: 1.1, d: 0.3, color: '#3d6ab0', size: 0.48 });
  card.position.set(0, -0.05, 0); g.stage.root.add(card); popIn(card, 1, 0.3);
  const T = miniTable(g, { zs: Array.from({ length: 20 }, (_, q) => q + 1), size: 0.32, numbers: true });
  const opts = shuffle([z, ...near]);
  answers(g, kind === 'z' ? opts : opts.map((q) => SYM[q]), -1.8, 1.4);
  g.goal(kind === 'z' ? 'Which atomic number?' : 'Which element?', k);
  const want = kind === 'z' ? z : SYM[z], why = `${NAME[z]} (${SYM[z]}) = ${z}`;
  play(g, k, { test: (o) => (o.userData.v != null ? o.userData.v === want : null),
    done: (o, first) => { o.tint('#4dff88', 0.9); T.dim([z]); T.pop(z, 2.0); g.right(k, first, why); },
    out: () => { T.dim([z]); T.pop(z, 2.0); g.miss(k, why); } });
}

// ---------------------------------------------------------------- 🕳️ the missing tile
const MISS = ['N', 'Mg', 'Ar', 'Ca', 'Si', 'P', 'Br', 'Fe', 'Cu', 'Kr', 'Zn', 'Sr', 'I', 'Sn', 'Ba', 'Pb'];
function missing(k, g) {
  const s = MISS[k], z = ZOF[s], [r, c] = place(z);
  const T = table3d(g.stage, { zs: ALL.filter((q) => place(q)[0] <= 7), color: 'cat', numbers: false, pickable: false, size: 0.42, gap: 0.05,
    label: (q) => (q === z ? '?' : SYM[q]) });
  T.group.position.set(0.3, 0.8, 0); T.mark(z);
  const nb = ALL.filter((q) => { const [rr, cc] = place(q); return q !== z && rr <= 7 && Math.abs(rr - r) + Math.abs(cc - c) <= 2; });
  const opts = shuffle([s, ...shuffle(nb).slice(0, 3).map((q) => SYM[q])]);
  answers(g, opts, -1.8, 1.4);
  g.goal('Which element is missing?', k);
  const why = `${NAME[z]}: period ${periodOf(z)}, group ${GROUP[c]}`;
  play(g, k, { test: (o) => (o.userData.v != null ? o.userData.v === s : null),
    done: (o, first) => { o.tint('#4dff88', 0.9); T.relabel((q) => SYM[q], z); T.clearMarks(); T.pop(z, 1.8); g.right(k, first, why); },
    out: () => { T.relabel((q) => SYM[q], z); T.clearMarks(); g.miss(k, why); } });
}

// ---------------------------------------------------------------- ⚡ speed (the last part: 10 s each, no hints)
const SPEED = [[symbols, 3], [numbers, 2], [placeRound, placeAt('Mg')], [missing, 1], [symbols, 8], [numbers, 8], [periods, 5],
  [placeRound, placeAt('Br')], [missing, 6], [symbols, 11], [numbers, 10], [missing, 9]];
function speed(k, g) {
  const [fn, j] = SPEED[k], gp = Object.create(g);
  gp.goal = (t, _k, e) => g.goal(t, k, e); gp.right = (_k, ...a) => g.right(k, ...a); gp.miss = (_k, ...a) => g.miss(k, ...a);
  FAST = true;
  try { if (fn === placeRound) fn(j, k, gp); else fn(j, gp); } finally { FAST = false; }
}

const PARTS = [                                 // easy → hard; the 10-second rounds come last (user)
  { key: 'explore', icon: '🔍', name: 'Explore', n: EXP.length, steps: [], run: explore, done: 'Periods, groups, numbers, metals, blocks, families: you have seen it all.' },
  { key: 'sym', icon: '🔤', name: 'Symbols', n: SYMR.length, steps: [10, 20], run: symbols, done: 'Na, K, Fe, Cu: the tricky symbols are yours.' },
  { key: 'numbers', icon: '🔢', name: 'Numbers', n: NUMS.length, run: numbers, done: 'Atomic numbers 1 to 20.' },
  { key: 'periods', icon: '📏', name: 'Periods', n: PER.length, run: periods, done: '2, 8, 8, 18, 18, 32: periods 1 to 6.' },
  { key: 'place', icon: '📍', name: 'Place', n: PLAN.length, steps: PLACE_STEPS, loopFrom: (f) => f + 1, run: placeIt, done: 'The whole table, a few elements at a time.' },
  { key: 'build', icon: '🧩', name: 'Build', n: BUILD.length, steps: [3, 6], run: buildRow, done: 'Rows and columns in atomic-number order.' },
  { key: 'missing', icon: '🕳️', name: 'Missing', n: MISS.length, run: missing, done: 'You know every neighbour on the table.' },
  { key: 'history', icon: '📜', name: 'History', n: HIST.length, run: history, done: 'Moseley: atomic number. That is the modern periodic law.' },
  { key: 'speed', icon: '⚡', name: 'Speed', n: SPEED.length, run: speed, done: '10 seconds each: you know the periodic table!' },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'ptbuild', parts: PARTS, cam: [0, 0.4, 13.5], target: [0, 0.3, 0], excite: true });
}
