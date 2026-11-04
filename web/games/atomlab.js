// Atom Lab: build atoms, make isotopes, fix broken atoms, find the mystery element, fill the 2n² seats.
// Covers short questions i, iii, iv, viii, ix, xi and the idea of long question iii (n = A − Z).
// No side panels: the goal is one short line above the level dots, and the atom's live symbol (A over Z, charge)
// floats next to the atom itself. Hints pop up as short toasts.
import { THREE, $, el, sfx, confetti, progress, starStr, nuc, shakeEl } from './kit.js';
import { Atom, element, SHELLS, CAP } from './atom.js';
import { periodicTable } from './ptable.js';

const bookConfig = (Z) => { const c = []; let left = Z; for (const cap of [2, 8, 8, 32]) { if (left <= 0) break; c.push(Math.min(cap, left)); left -= cap; } return c; };
const T = (p, n, e = p) => ({ p, n, e });
export const LEVELS = [
  { type: 'build', title: 'Build hydrogen-1', target: T(1, 0), start: T(0, 0),
    done: 'Hydrogen is the simplest atom: 1 proton and 1 electron, no neutron.' },
  { type: 'build', title: 'Build helium-4', target: T(2, 2), start: T(0, 0),
    done: 'Helium: 2 protons + 2 neutrons = mass number 4.' },
  { type: 'build', title: 'Build lithium-7', target: T(3, 4), start: T(0, 0),
    done: 'The 3rd electron does not fit in K (only 2 seats), so it starts the L shell: 2, 1.' },
  { type: 'build', title: 'Build carbon-12', target: T(6, 6), start: T(0, 0), done: 'Carbon: shells 2, 4.' },
  { type: 'build', title: 'Build sodium-23', target: T(11, 12), start: T(0, 0), book: 'First 18 elements',
    done: 'Sodium: 11 protons, 23 − 11 = 12 neutrons, 11 electrons in shells 2, 8, 1.' },
  { type: 'build', title: 'Build aluminium-27', target: T(13, 14), start: T(0, 0), book: 'Short Q i',
    done: 'Aluminium: 13 p⁺, 14 n⁰, 13 e⁻.<br>Shells 2, 8, 3 → <b>1s² 2s² 2p⁶ 3s² 3p¹</b>' },
  { type: 'isotope', title: 'Make deuterium', target: T(1, 1), start: T(1, 0), book: 'Short Q xi (b)',
    goal: 'Atomic number 1 with <b>one neutron</b>. Only neutrons may change!',
    done: 'Deuterium ' + nuc('H', 2, 1) + ' (D): same element, a little heavier.' },
  { type: 'isotope', title: 'Make tritium', target: T(1, 2), start: T(1, 1), book: 'Short Q xi (a)',
    goal: 'One proton and <b>two neutrons</b>.', done: 'Tritium ' + nuc('H', 3, 1) + ' (T). Protium is ' + nuc('H', 1, 1) + '.' },
  { type: 'isotope', title: 'Turn carbon-12 into carbon-14', target: T(6, 8), start: T(6, 6), book: 'Short Q viii',
    done: 'Still carbon (6 protons)! Carbon-12, -13 and -14 have 6, 7 and 8 neutrons.' },
  { type: 'isotope', title: 'Turn chlorine-35 into chlorine-37', target: T(17, 20), start: T(17, 18),
    done: 'Chlorine-37: 17 protons, 20 neutrons. Same chemistry, different mass.' },
  { type: 'fix', title: 'Fix it: this sodium is not neutral', target: T(11, 12), start: T(11, 12, 10),
    goal: 'Charge should be 0: the red sign by the symbol must go.', done: '11 protons (+) and 11 electrons (−) cancel: neutral.' },
  { type: 'fix', title: 'Fix it: carbon\'s electrons are in the wrong shells', target: T(6, 6), start: { p: 6, n: 6, cfg: [1, 5] },
    goal: 'Tap an electron to take it out, tap a ring to put one in.', done: 'Inner shells fill first: K takes 2, then L.' },
  { type: 'fix', title: 'Fix it: lithium-7 is too light', target: T(3, 4), start: T(3, 3), done: 'Top number − bottom number: 7 − 3 = 4 neutrons.' },
  { type: 'fix', title: 'Fix it: this should be oxygen-16', target: T(8, 8), start: T(7, 8),
    done: 'The number of protons decides the element: 7 = nitrogen, 8 = oxygen.' },
  { type: 'fix', title: 'Fix it: one magnesium electron is too far out', target: T(12, 12), start: { p: 12, n: 12, cfg: [2, 8, 1, 1] },
    done: 'Magnesium: 2, 8, 2. The M shell has room, so N stays empty.' },
  { type: 'who', title: 'Who am I?  1s² 2s² 2p⁶ 3s¹', cfg: [2, 8, 1], book: 'Short Q iv (a)',
    goal: 'Tap the rings to place the electrons. Count them all: a neutral atom has as many protons.' },
  { type: 'who', title: 'Who am I?  1s² 2s² 2p⁶ 3s² 3p⁵', cfg: [2, 8, 7], book: 'Short Q iv (b)',
    goal: 'Add up the small numbers: 2 + 2 + 6 + 2 + 5 = ?' },
  { type: 'who', title: 'Who am I?  1s² 2s² 2p⁶ 3s² 3p⁶ 4s²', cfg: [2, 8, 8, 2], book: 'Short Q iv (c)',
    goal: 'Place every electron, ring by ring.' },
  { type: 'seats', title: 'How many seats in each shell?', book: 'Short Q ix',
    goal: 'Fill K, L, M and N until each is full. Tip: hold a ring to fill it fast.',
    done: 'K 2 · L 8 · M 18 · N 32. Each shell holds 2 × n × n (two squares of n × n).' },
];
const KIND = { build: 'Build', isotope: 'Isotope', fix: 'Fix it', who: 'Who am I?', seats: 'Shell seats' };

export function start({ stage, ui, level }) {
  const saved = progress.get('lab');
  let idx = Number.isFinite(level) ? level : Math.max(0, LEVELS.findIndex((l, i) => !saved[i]));
  idx = Math.min(Math.max(idx, 0), LEVELS.length - 1);
  ui.innerHTML = `
    <div class="labgoal" id="goal"></div>
    <div class="tray" id="tray">
      <button data-add="p"><i class="dot p"></i>+ proton</button>
      <button data-add="n"><i class="dot n"></i>+ neutron</button>
      <button data-add="e"><i class="dot e"></i>+ electron</button>
      <button id="resetBtn" title="Start this level again">↺</button>
      <button id="checkBtn" class="go">Check ✓</button>
    </div>
    <div class="levels" id="levels"></div>
    <div class="toast" id="toast"></div>`;
  let atom = null, L = null, wrong = 0, solved = false, fullShown = new Set();
  // the atom's live symbol, just outside its outer ring (upper left)
  const symAt = { visible: true, scale: { x: 1 }, getWorldPosition: (v) => {
    if (!atom) return v.set(0, 0, 0);
    const shown = atom.shells.filter((s) => s.shown && s.g.scale.x > 0.5), r = shown.length ? shown[shown.length - 1].r : 1;
    return atom.group.localToWorld(v.set(-r * 0.8, r * 0.8, 0));
  } };
  const symTag = stage.tag('', symAt, [0, 0, 0], 'livesym');
  // the periodic table (upper right): the gold frame walks one tile per proton; finished elements stay lit
  const pt = periodicTable(stage, { size: 0.66, gap: 0.07 });
  const placePT = () => { const wide = innerWidth / innerHeight > 1.15; pt.group.position.set(wide ? 6.2 : 0, wide ? 3.2 : 6.6, -3); };
  addEventListener('resize', placePT); placePT();

  const toast = (html, cls = '') => {
    const t = $('toast'); t.innerHTML = html; t.className = 'toast show ' + cls;
    clearTimeout(toast.t); toast.t = setTimeout(() => (t.className = 'toast'), 2600);
  };
  function levelDots() {
    const s = progress.get('lab');
    $('levels').innerHTML = LEVELS.map((l, i) => `<button class="lv ${l.type}${i === idx ? ' on' : ''}${s[i] ? ' won' : ''}" data-lv="${i}" title="${l.title}">${i + 1}</button>`).join('');
  }
  $('levels').onclick = (ev) => { const b = ev.target.closest('[data-lv]'); if (b) load(+b.dataset.lv); };

  function load(i) {
    idx = i; L = LEVELS[i]; wrong = 0; solved = false; fullShown = new Set();
    history.replaceState(null, '', `?game=lab&level=${i}`);
    if (atom) atom.dispose();
    const seats = L.type === 'seats';
    atom = new Atom(stage, { seats, minShells: seats || L.type === 'who' ? 4 : (L.start?.cfg?.length || 0) });
    stage.atom = atom;
    if (L.type === 'who') { atom.setNucleus(0, 0); }
    else if (!seats) {
      atom.setNucleus(L.start.p, L.start.n);
      atom.setConfig(L.start.cfg || bookConfig(L.start.e ?? L.start.p));
    }
    const tgt = L.target;
    // one short line: the task and (if there is one) the target symbol
    $('goal').innerHTML = `<b>${L.title}</b>${tgt ? ` &nbsp;→&nbsp; ${nuc(element(tgt.p)[0], tgt.p + tgt.n, tgt.p)}` : ''}`;
    if (L.goal) setTimeout(() => toast(L.goal), 500);
    const show = { p: ['build', 'fix'].includes(L.type), n: ['build', 'fix', 'isotope'].includes(L.type), e: ['build', 'fix', 'seats'].includes(L.type) };
    for (const b of $('tray').querySelectorAll('[data-add]')) b.hidden = !show[b.dataset.add];
    $('checkBtn').hidden = L.type === 'seats';
    levelDots(); refresh(true);
  }

  function refresh(quiet) {
    const p = atom.p, n = atom.n, e = atom.e, cfg = atom.config;
    const [sym, name] = element(p);
    const who = L.type === 'who' && !solved;
    const charge = p - e;
    // the live symbol: mass number over atomic number, and the charge if it is not neutral
    const chg = charge === 0 ? '' : `<sup class="chg">${Math.abs(charge) > 1 ? Math.abs(charge) : ''}${charge > 0 ? '+' : '−'}</sup>`;
    pt.setNow(L.type === 'seats' || who ? 0 : p);
    symTag.innerHTML = L.type === 'seats' ? '' : who ? '<b class="q">?</b>' : p ? `${nuc(sym, p + n, p)}${chg}<small>${name}</small>` : '';
    if (!quiet && L.type === 'seats') seatsCheck();
  }

  let lastName = '';
  function afterChange() {
    if (L.type === 'who') {                       // neutral atom: protons follow electrons
      while (atom.p < atom.e) atom.addNucleon('p');
      while (atom.p > atom.e) atom.removeNucleon(atom.nucleons.filter((o) => o.userData.type === 'p').pop());
    }
    const nm = element(atom.p)[1];
    if (atom.p && nm !== lastName && L.type !== 'who' && L.type !== 'seats' && lastName) toast(`Now it is <b>${nm}</b>!`);
    lastName = nm;
    refresh(false);
  }

  function add(kind, from) {
    if (solved && L.type !== 'seats') return;
    if (kind === 'e') {
      let i = atom.nextShell();
      if (L.type === 'seats') i = atom.shells.findIndex((s, k) => !atom.isFull(k));
      if (atom.addElectron(i, from)) sfx.add(); else { sfx.buzz(); toast('No free seat there.', 'bad'); }
    } else { atom.addNucleon(kind, from); sfx.pop(); }
    afterChange();
  }
  // tray buttons: tap = one, hold = many
  for (const b of $('tray').querySelectorAll('[data-add]')) {
    let rep = null, t0 = null;
    const stop = () => { clearTimeout(t0); clearInterval(rep); };
    b.onpointerdown = (ev) => {
      ev.preventDefault();
      const r = b.getBoundingClientRect(), from = stage.fromScreen(r.left + r.width / 2, r.top, 0);
      add(b.dataset.add, from);
      t0 = setTimeout(() => (rep = setInterval(() => add(b.dataset.add, from), 120)), 380);
    };
    b.onpointerup = b.onpointerleave = b.onpointercancel = stop;
  }

  function ringAdd(i, point) {
    if (solved && L.type !== 'seats') return;
    if (L.type === 'isotope') { toast('In this level only neutrons change.', 'bad'); return; }
    if (atom.isFull(i)) { sfx.buzz(); atom.flashRing(i, 0xff4d4d); toast(`${SHELLS[i]} is full: it has only ${CAP(i + 1)} seats.`, 'bad'); return; }
    if (atom.addElectron(i, point)) sfx.add();
    afterChange();
  }
  stage.onTap = (hit) => {
    if (!hit) return;
    const o = hit.obj;
    if (o.userData.shell != null && !o.userData.electron) return ringAdd(o.userData.shell, hit.point);
    if (solved && L.type !== 'seats') return;
    if (o.userData.electron) {
      if (L.type === 'isotope') { toast('In this level only neutrons change.', 'bad'); return; }
      atom.removeElectron(o); sfx.remove(); return afterChange();
    }
    if (o.userData.type) {
      if (L.type === 'who') return toast('Protons follow the electrons here: change the electrons.', '');
      if (L.type === 'isotope' && o.userData.type === 'p') {
        sfx.buzz(); return toast('Careful! A different number of protons = a different element.<br>Isotopes differ only in <b>neutrons</b>.', 'bad');
      }
      atom.removeNucleon(o); sfx.remove(); afterChange();
    }
  };
  stage.onFrame(() => {});
  stage.onHold = (hit) => { if (hit.obj.userData.shell != null && !hit.obj.userData.electron) ringAdd(hit.obj.userData.shell, hit.point); };

  function mistakes() {
    const p = atom.p, n = atom.n, e = atom.e, cfg = atom.config.join(',');
    if (L.type === 'who') {
      if (cfg !== L.cfg.join(',')) return `Not yet: the shells should hold ${L.cfg.join(', ')} (K, L, M, N). You have ${atom.config.join(', ') || 'none'}.`;
      return null;
    }
    const t = L.target, nm = element(t.p)[1];
    if (p !== t.p) return `${nm} has <b>${t.p} protons</b> (atomic number Z = ${t.p}). You have ${p}.`;
    if (n !== t.n) return `Mass number ${t.p + t.n} = protons + neutrons, so neutrons = ${t.p + t.n} − ${t.p} = <b>${t.n}</b>. You have ${n}.`;
    if (e !== t.e) return `A neutral atom has as many electrons as protons: <b>${t.e}</b>. You have ${e}.`;
    const want = bookConfig(t.e).join(',');
    if (cfg !== want) return `Right number of electrons, wrong shells! Fill from the inside: K holds 2, then L 8 … → <b>${want.replace(/,/g, ', ')}</b>.`;
    return null;
  }
  $('resetBtn').onclick = () => load(idx);
  $('checkBtn').onclick = () => {
    if (solved) return;
    const m = mistakes();
    if (m) { wrong++; sfx.buzz(); shakeEl($('checkBtn')); toast(m, 'bad'); atom.flashRing(0, 0xff4d4d); return; }
    win();
  };

  function seatsCheck() {
    atom.shells.forEach((s, i) => {
      if (atom.isFull(i) && !fullShown.has(i)) {
        fullShown.add(i); atom.flashRing(i); sfx.ding();
        const n = i + 1;
        toast(`<b>${SHELLS[i]}</b> full: 2 × ${n} × ${n} = <b>${CAP(n)}</b>`, 'good');
      }
    });
    if (fullShown.size === 4 && !solved) setTimeout(win, 600);
  }

  function win() {
    solved = true;
    if (L.type !== 'seats') pt.light(atom.p);
    const stars = wrong === 0 ? 3 : wrong <= 2 ? 2 : 1;
    progress.set('lab', idx, stars);
    sfx.win(); confetti(stage, atom.worldCenter());
    refresh(true);
    // no pop-up: the fireworks are the reward, then the next level starts by itself (stars still saved)
    if (idx < LEVELS.length - 1) { const me = idx; setTimeout(() => { if (idx === me) load(idx + 1); }, 2600); }
    levelDots();
  }
  load(idx);
  return { get levels() { return LEVELS.length; }, load, add, get atom() { return atom; } };
}

export function modal(html) { const m = $('modal'); m.innerHTML = `<div class="box">${html}</div>`; m.hidden = false; }
export function closeModal() { $('modal').hidden = true; }
