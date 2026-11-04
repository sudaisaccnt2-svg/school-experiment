// Element Finder (Unit 3): an atom turns beside a 3D periodic table; tap the tile where it lives. Shells = the row
// (period), outer electrons = the column (group); after a right tap the row and column light up and are named.
// Round 2 is short question vi: "Period 2, group VII" → tap the element.
import { THREE, $, sfx, confetti, progress, starStr, sleep, goalBar } from './kit.js';
import { Atom } from './atom.js';
import { modal, closeModal } from './atomlab.js';
import { table3d } from './table3d.js';
import { SYM, NAME, ZOF, place, GROUP, shells } from './u3data.js';

const NEUT = [0, 0, 2, 4, 5, 6, 6, 7, 8, 10, 10, 12, 12, 14, 14, 16, 16, 18, 22, 20, 20];
const ATOMS = ['Li', 'Na', 'Cl', 'O', 'K', 'Mg', 'Ne', 'Al', 'Ca', 'F'].map((s) => ZOF[s]);
const SPOTS = [[2, 'VII', 'F'], [4, 'III', 'Ga'], [5, 'VI', 'Te'], [1, 'VIII', 'He']];   // short Q vi
const ROUNDS = [...ATOMS.map((z) => ({ z, atom: true })), ...SPOTS.map(([p, g, s]) => ({ z: ZOF[s], p, g }))];

export function start({ stage, ui, level }) {
  ui.innerHTML = `<div class="goalbar" id="goal"></div>`;
  const B = goalBar($('goal'));
  const wide = innerWidth / innerHeight > 1.15;
  const zs = Array.from({ length: 86 }, (_, k) => k + 1).filter((z) => place(z)[0] <= 7);
  const T = table3d(stage, { zs });
  T.group.position.set(wide ? 2.3 : 0, wide ? -0.6 : -2.6, 0);
  T.group.scale.setScalar(wide ? 0.88 : 0.68);
  let atom = null, i = Math.min(Math.max(level ?? 0, 0), ROUNDS.length - 1), first = true, busy = false;
  const results = [], tags = [];
  const clear = () => { tags.splice(0).forEach((e) => stage.untag(e)); T.clearMarks(); T.dim(null); };

  function show(k) {
    i = k; first = true; busy = false; clear();
    history.replaceState(null, '', `?game=finder&level=${k}`);
    const R = ROUNDS[k];
    if (atom) { atom.dispose(); atom = null; }
    if (R.atom) {
      atom = new Atom(stage, { pos: wide ? [-5.9, 0.6, 0] : [0, 2.6, 0], radii: [0.75, 1.2, 1.65, 2.1], tags: false });
      atom.group.scale.setScalar(wide ? 0.85 : 0.8);
      atom.setNucleus(R.z, NEUT[R.z]); atom.setConfig(shells(R.z));
    }
    B.draw([{ text: R.atom ? 'Where does this atom live?' : `Period ${R.p} · Group ${R.g}`, bold: true },
      { dots: ROUNDS.map((_, j) => (j === k ? 'on' : results[j] === true ? 'ok' : results[j] === false ? 'no' : '')), breaks: [ATOMS.length] }]);
  }
  async function tap(z) {
    if (busy) return;
    const R = ROUNDS[i];
    if (z !== R.z) { first = false; sfx.buzz(); T.shake(z); return; }
    busy = true; results[i] = results[i] ?? first;
    if (first) progress.set('finder', i, 3);
    sfx.ding();
    const [r, c] = place(z);
    T.mark(z, 0x4dff88); T.pop(z, 1.6);
    T.dim(zs.filter((q) => place(q)[0] === r || place(q)[1] === c), 0.25);
    confetti(stage, T.world(z), first ? 60 : 25);
    tags.push(stage.tag(`<b>${SYM[z]}</b> ${NAME[z]}`, T.tiles[z], [0, 0.55, 0], 'big gold'));
    tags.push(stage.tag(`period ${r}`, T.tiles[zs.find((q) => place(q)[0] === r && place(q)[1] === 1)], [-0.75, 0, 0], 'big blue'));
    tags.push(stage.tag(`group ${GROUP[c]}`, T.tiles[zs.find((q) => place(q)[1] === c)], [0, 0.6, 0], 'big green'));
    if (atom) {                                      // the atom shows why: count the shells, then the outer electrons
      for (let s = 0; s < atom.shells.length && atom.shells[s].electrons.length; s++) { atom.flashRing(s, 0x7cc0ff); await sleep(0.25); }
      const last = atom.config.length - 1; await atom.flashRing(last, 0x4dff88);
      tags.push(stage.tag(`${atom.config.length} shells · ${atom.config[last]} outer e⁻`, atom.group, [0, -2.6, 0], 'big'));
    }
    await sleep(2.6);
    if (i < ROUNDS.length - 1) show(i + 1); else finish();
  }
  stage.onTap = (hit) => { const z = hit && hit.obj.userData.z; if (z) tap(z); };
  function finish() {
    const score = results.filter(Boolean).length, stars = score >= 13 ? 3 : score >= 9 ? 2 : 1;
    if (atom) { atom.dispose(); atom = null; }
    sfx.win(); confetti(stage, new THREE.Vector3(0, 0, 0), 140);
    modal(`<div class="stars">${starStr(stars)}</div><h2>${score} / ${ROUNDS.length} right first time</h2>
      <p>Shells tell the period (row); outer electrons tell the group (column).</p>
      <div class="row"><button id="mAgain">↺ Play again</button><a class="go" href="games.html?unit=3">All games</a></div>`);
    $('mAgain').onclick = () => { closeModal(); results.length = 0; show(0); };
  }
  show(i);
  return { tap, show };
}
