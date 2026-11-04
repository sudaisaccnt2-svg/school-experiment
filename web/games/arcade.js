// Arcade layer for rounds.js games (user 2026-10-11: "the game must be exciting and fun"). Nothing here blocks play:
//  • score: 10 per right answer × streak multiplier (×2 after 3 in a row … ×5), +5 for a fast answer (⚡ ≤ 2.5 s);
//    a floating "+20" rises, the 🔥 streak grows, the ding climbs in pitch with the streak; a miss breaks the streak
//  • auto level-up: a finished level pass that is accurate (≥ 90 %) and quick (≤ part.fastS, default 4 s per answer)
//    jumps straight to the next level with a LEVEL UP banner; a checkbox per level turns it off (stay and practise)
//  • a timed session (⏱ 3 / 5 / 10 min, or off): it starts with the first answer, the last 10 s tick, and it ends on a
//    results card (score, right answers, accuracy, speed, best streak, levels cleared, personal best)
import { sfx } from './kit.js';

const LENGTHS = [300, 180, 600, 0];                // ⏱ chip cycles through these (0 = no time limit)
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
};

export function arcade(ui, id) {
  const el = document.createElement('div'); el.id = 'arcade';
  el.innerHTML = '<div class="ar-score"><b>0</b><span>score</span></div><div class="ar-fire"></div>' +
    '<button class="ar-clock" title="Session length: tap to change"></button>';
  ui.appendChild(el);
  const auto = document.createElement('label'); auto.id = 'arAuto';
  auto.innerHTML = '<input type="checkbox"> <span>⚡ Auto level-up</span>'; ui.appendChild(auto);
  const banner = document.createElement('div'); banner.id = 'arBanner'; ui.appendChild(banner);
  const card = document.createElement('div'); card.id = 'arCard'; card.hidden = true; ui.appendChild(card);
  const scoreEl = el.querySelector('.ar-score b'), fireEl = el.querySelector('.ar-fire'), clockEl = el.querySelector('.ar-clock');

  // ?sess=<seconds>: a short session for tests
  let len = Number(new URLSearchParams(location.search).get('sess')) || store.get('games.session.len', 300), left = len, timer = 0, levelKey = '';
  let s = fresh();
  function fresh() { return { score: 0, streak: 0, best: 0, right: 0, tries: 0, ms: 0, levels: 0 }; }
  const fmt = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
  function drawClock() {
    clockEl.textContent = len ? '⏱ ' + fmt(left) : '⏱ off';
    clockEl.classList.toggle('low', !!len && timer && left <= 10);
  }
  function drawScore() {
    scoreEl.textContent = s.score;
    const mult = multOf(s.streak);
    fireEl.innerHTML = s.streak >= 2 ? `🔥 ${s.streak}${mult > 1 ? ` <i>×${mult}</i>` : ''}` : '';
    fireEl.classList.toggle('hot', mult >= 3);
  }
  const multOf = (streak) => 1 + Math.min(4, Math.floor(streak / 3));
  function start() {
    if (timer || !len || !card.hidden) return;
    left = len; drawClock();
    timer = setInterval(() => {
      if (document.hidden) return;                 // the app is in the background: the clock waits
      left--; drawClock();
      if (left <= 10 && left > 0) sfx.pop();
      if (left <= 0) end();
    }, 1000);
  }
  function stop() { clearInterval(timer); timer = 0; }
  function reset() { stop(); s = fresh(); left = len; card.hidden = true; drawScore(); drawClock(); }
  clockEl.onclick = () => {                        // change the session length (starts a new session)
    len = LENGTHS[(LENGTHS.indexOf(len) + 1) % LENGTHS.length]; store.set('games.session.len', len); reset();
  };
  function float(text, cls = '') {
    const f = document.createElement('div'); f.className = 'ar-float ' + cls; f.textContent = text;
    ui.appendChild(f); setTimeout(() => f.remove(), 1100);
  }
  function show(text) { banner.textContent = text; banner.className = ''; void banner.offsetWidth; banner.className = 'show'; }

  function end() {
    stop();
    const key = 'games.best.' + id + '.' + len, best = store.get(key, 0), isNew = s.score > best;
    if (isNew) store.set(key, s.score);
    const acc = s.tries ? Math.round((100 * s.right) / s.tries) : 0, sec = s.right ? (s.ms / s.right / 1000).toFixed(1) : '–';
    card.innerHTML = `<div class="t">${isNew ? '🏆 New best!' : "⏱ Time's up!"}</div>` +
      `<div class="big">${s.score}</div><div class="sub">points${!isNew && best ? ` · best ${best}` : ''}</div>` +
      `<div class="grid"><div><b>${s.right}</b><span>right</span></div><div><b>${acc}%</b><span>accuracy</span></div>` +
      `<div><b>${sec} s</b><span>per answer</span></div><div><b>🔥 ${s.best}</b><span>best streak</span></div>` +
      `<div><b>${s.levels}</b><span>levels cleared</span></div></div>` +
      '<div class="row"><button class="again">▶ Play again</button><button class="keep">Keep practising</button></div>';
    card.hidden = false;
    (isNew ? sfx.win : sfx.ding)();
    card.querySelector('.again').onclick = reset;
    card.querySelector('.keep').onclick = () => { len = 0; store.set('games.session.len', 0); reset(); };
  }

  drawScore(); drawClock();
  return {
    /** a right answer: ms = time it took, first = no wrong tap before it */
    right(ms, first) {
      start();
      s.tries++; s.right++; s.ms += ms;
      if (first) s.streak++; else s.streak = 0;
      s.best = Math.max(s.best, s.streak);
      const fast = first && ms <= 2500, pts = 10 * multOf(s.streak) + (fast ? 5 : 0);
      s.score += pts;
      float('+' + pts + (fast ? ' ⚡' : ''), fast ? 'fast' : '');
      if (s.streak && s.streak % 5 === 0) show(`🔥 ${s.streak} in a row!`);
      sfx.combo(s.streak);
      drawScore();
    },
    /** a wrong tap / a timed-out or revealed round: the streak breaks */
    wrong() { start(); s.tries++; if (s.streak >= 3) float('streak lost', 'lost'); s.streak = 0; drawScore(); },
    /** the level this round belongs to (for the per-level auto checkbox) */
    level(key) {
      levelKey = 'games.auto.' + key;
      const box = auto.querySelector('input');
      box.checked = store.get(levelKey, true);
      box.onchange = () => store.set(levelKey, box.checked);
    },
    /** a level pass ended: true = move on by itself (accurate and quick, and the student allows it) */
    passed(acc, secPer, fastS = 4) {
      s.levels++;
      const go = auto.querySelector('input').checked && acc >= 0.9 && secPer > 0 && secPer <= fastS;
      if (go) { show('⚡ LEVEL UP!'); sfx.levelUp(); s.score += 50; float('+50 level bonus', 'fast'); drawScore(); }
      return go;
    },
    hideAuto(h) { auto.hidden = h; },
  };
}
