// Lesson 802 · Metallic character (book pp. 220–221), v3 (user 2026-10-13 on v2: "extremely bad, too much going on, too
// complicated; the pacing was not great"). v3 = SKILL §1 v4 applied strictly: ONE idea per beat, only that beat's
// objects on screen, ONE action, ONE result label (+ its equation), shot lengths that vary (3–6 s), no checklist (this
// page is not a set of experiments), no bench of samples, no colour key. Dark studio throughout (atoms + one table).
// BEAT SHEET (on screen · the student concludes)
//   Lose   ONE atom at a time, big: sodium's 1 outer electron turns gold and flies off (trail) → Na⁺; calcium loses 2 →
//          Ca²⁺; aluminium 3 → Al³⁺; then the three ions together · metals LOSE electrons → + ions (cations).
//   Gain   fluorine: a gold electron flies in → F⁻; chlorine → Cl⁻; oxygen takes 2 → O²⁻; the three together ·
//          non-metals GAIN electrons → − ions (anions).
//   Ease   three tiles Na · Si · Cl, a gold bar rises on each = energy to pull off an electron: low → metal (tile turns
//          blue), middle → metalloid (orange), high → non-metal (green) · the easier it loses, the more metallic.
//   Table  the three tiles fly into their places and the periodic table builds round them; a gold arrow runs along
//          period 3, then period 2, colouring each tile → less metallic →; then down group IV and group V → more
//          metallic ↓; end: the alkali metals (group IA) light up = the most metallic.
// Book points: electropositive / metallic character = tendency to lose electrons and form cations (Na, Ca, Al with
// equations); non-metals gain → anions (F, Cl, O with equations); low IE metal, high IE non-metal, border line
// metalloid; alkali metals most electropositive; (i) across a period (periods 2 and 3) decreases; (ii) down a group
// (IV: C · Si Ge · Sn Pb; V: N P · As Sb · Bi) increases. Scientific Information (crust %) → 🎮 Metal or Non-metal?
// Book note: p.221 calls Sb a metalloid, p.219 a metal (docs/NOTES.md). v2 kept in backups/l802_v2.js.
// §1 CHECK (sheets renders/lesson/d802_*.jpg, iPad size): faithful ✓ (every point above) · one idea per beat ✓ · only
// that beat's objects in frame ✓ (atoms 5 apart) · ONE result label (+ its equation) ✓ · captions ≤ 9 words ✓ ·
// question first ✓ · less is more ✓ (≤ 3 labels a shot) · lead the eye ✓ (electrons fly out / in from off-frame, the
// camera glides to the next atom, the bar tiles fly into the table) · pacing ✓ (7 / 5.4 / 5.8 / 4.4 / 4.4 / 4.2 / 4.8 /
// 4.4 / 10.6 / 3 / 6.2 / 4.8 / 5.6 / 4.6 / 8.4 s, no still > 2 s) · animation ✓ (ease-in leave, arcs in, overshoot pops)
// · big text ✓ · clean frame ✓ (table close-ups crop the big table, nothing else cut) · flicker 0 ✓.
import * as THREE from 'three';
import * as K from './kit.js';
import { place } from '../games/u3data.js';
const { M, span, ease, easeIn, back, lerp } = K;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

const TAN = Math.tan(16 * Math.PI / 180), ASP = 1.6;
function S(t, look, w, h, dir = [0, 0.06, 1], e) {
  h *= 1.14; look = [look[0], look[1] + 0.05 * h, look[2]];        // headroom: the caption floats just above the subject (capNear)
  const d = V(...dir).normalize(), dist = Math.max(h / 2 / TAN, w / 2 / (TAN * ASP)) * 1.1;
  return [t, V(...look).addScaledVector(d, dist).toArray(), look, undefined, e, { look, w, h, dir, dock: 0 }];   // fit: the engine refits it to the real screen
}

const AY = 1.8, LX = (i) => 100 + i * 5, GX = (i) => 125 + i * 5;      // the atoms: lose row · gain row (5 apart)
const TIGHT = 3.3, ADIR = [0, 0.45, 1];                                // summary spacing · camera a little above (rings read as rings)
const BX = (i) => 140 + (i - 1) * 0.85, BY = 1.0, BZ = 2.2;              // the three tiles with their bars (in front of the table)
const TX = 140, TP = 0.5, COL = (c) => TX + (c - 9.5) * TP;            // the periodic table
const TY = (r) => (r <= 7 ? 4.6 - (r - 1) * TP : 4.6 - 7 * TP - 0.3 - (r - 8) * TP);
const MET = 0x3a64b8, MLD = 0xd0703a, NON = 0x2e8a57, GREY = 0x4a4f58;   // the book's colours

const T = {
  na: 0, ca: 7.0, al: 12.4, mSum: 18.2, f: 22.6, cl: 27.0, o: 31.2, nSum: 36.0,
  ie: 40.4, tab: 51.0, p3: 54.0, p2: 60.2, g4: 65.0, g5: 70.6, end: 75.2, card: 79.6,
};
T.done = T.card + 4.0;
const LEAVE = (t0, i, j) => t0 + (i ? 1.6 : 2.6) + j * 0.5;              // a lost electron leaves (sodium's beat is longer)
const ARRIVE = (t0, j) => t0 + 1.0 + j * 0.6;                           // a gained electron starts flying in
const BAR = [T.ie + 1.0, T.ie + 3.0, T.ie + 5.0];                        // each bar starts to rise
const RUN = { p3: [T.p3 + 0.4, 5.0], p2: [T.p2 + 0.4, 3.8], g4: [T.g4 + 0.6, 3.6], g5: [T.g5 + 0.4, 3.2] };   // arrow runs [start, length]

const captions = [
  [0.3, 2.6, 'What makes an element metallic? Watch sodium'],
  [2.6, T.ca, 'It loses its 1 outer electron: Na⁺'],
  [T.ca, T.al, 'Calcium loses 2: Ca²⁺'],
  [T.al, T.mSum, 'Aluminium loses 3: Al³⁺'],
  [T.mSum, T.f, 'Metals lose electrons: + ions (cations)'],
  [T.f, T.cl, 'Fluorine gains 1 electron: F⁻'],
  [T.cl, T.o, 'Chlorine gains 1: Cl⁻'],
  [T.o, T.nSum, 'Oxygen gains 2: O²⁻'],
  [T.nSum, T.ie, 'Non-metals gain electrons: − ions (anions)'],
  [T.ie, BAR[1], 'How hard is it to pull an electron off?'],
  [BAR[1], BAR[2] + 2.2, 'Easy: metal. Harder: metalloid. Hard: non-metal'],
  [BAR[2] + 2.2, T.tab, 'The easier it loses electrons, the more metallic'],
  [T.tab, T.p3, 'Now find them in the periodic table'],
  [T.p3, T.p2, 'Across period 3: less and less metallic'],
  [T.p2, T.g4, 'Period 2: the same'],
  [T.g4, T.g5, 'Down group IV: more and more metallic'],
  [T.g5, T.end, 'Group V: the same'],
  [T.end, T.card, 'Alkali metals lose electrons most easily'],
  [T.card, T.done, 'Metallic character: how easily electrons are lost'],
];

const RL = [1.05, 1.35, 1.05], RG = [0.75, 1.05, 0.75];                // outer shell radius of each atom
const atomShot = (t, x, R, k = 1) => { const h = (1.5 * R + 1.4) * k; return S(t, [x, AY, 0], h * 1.15, h, ADIR); };
const trio = (t, x, k = 1) => S(t, [x, AY + 0.3, 0], 9.0 * k, 3.9 * k, ADIR);
const cams = [
  // lose: one atom each, the camera glides along as the next one is needed; then the three ions
  atomShot(0, LX(0), RL[0], 1.06), atomShot(T.ca - 0.8, LX(0), RL[0], 0.96), atomShot(T.ca + 0.4, LX(1), RL[1]), atomShot(T.al - 0.6, LX(1), RL[1], 0.96),
  atomShot(T.al + 0.4, LX(2), RL[2]), atomShot(T.mSum - 0.2, LX(2), RL[2], 0.96), trio(T.mSum + 1.4, LX(1)), trio(T.f - 0.05, LX(1), 0.96),
  // gain (a cut: new atoms)
  atomShot(T.f, GX(0), RG[0], 1.06), atomShot(T.cl - 0.8, GX(0), RG[0], 0.96), atomShot(T.cl + 0.4, GX(1), RG[1]), atomShot(T.o - 0.6, GX(1), RG[1], 0.96),
  atomShot(T.o + 0.4, GX(2), RG[2]), atomShot(T.nSum - 0.2, GX(2), RG[2], 0.96), trio(T.nSum + 1.4, GX(1)), trio(T.ie - 0.05, GX(1), 0.96),
  // the bars (a cut), slow push in on the low sodium bar at the end
  S(T.ie, [BX(1), 1.85, BZ], 3.6, 3.3), S(BAR[2] + 2.2, [BX(1), 1.8, BZ], 3.3, 3.0), S(T.tab - 0.3, [BX(0) + 0.45, 1.85, BZ], 3.2, 3.0),
  // pull back: the table builds round the flying tiles
  S(T.tab + 2.4, [TX, 2.45, 0], 9.8, 5.2), S(T.p3 - 0.1, [TX, 2.45, 0], 9.7, 5.15),
  // the two periods (period 2 above, the label in the gap between), then the two groups, then the whole table
  S(RUN.p3[0], [COL(3.6), 3.75, 0], 4.6, 2.2), S(RUN.p3[0] + RUN.p3[1], [COL(15.4), 3.75, 0], 4.6, 2.2), S(T.p2 - 0.2, [TX, 3.85, 0], 9.6, 2.3), S(T.g4 - 0.2, [TX, 3.85, 0], 9.4, 2.25),
  S(T.g4 + 0.8, [COL(14.5), (TY(1) + TY(6)) / 2 + 0.1, 0], 2.6, 3.8), S(T.end - 0.2, [COL(14.5), (TY(1) + TY(6)) / 2 + 0.1, 0], 2.5, 3.7),
  S(T.end + 0.8, [TX, 2.45, 0], 9.8, 5.2), S(T.done, [COL(7.5), 2.6, 0], 8.4, 4.8),   // slow push toward group IA
];

export default {
  capNear: true, oneText: true,
  duration: T.done,
  captions,
  cams,

  build({ scene, cam }) {
    const beats = [];
    const floor = scene.getObjectByName('floor');
    beats.push(() => { floor.visible = false; scene.fog = null; });      // atoms and the table float in the dark studio
    const add = (o, x = 0, y = 0, z = 0) => { o.position.set(x, y, z); scene.add(o); return o; };
    const lbl = (text, h, color, x, y, z = 0, w = 700) => add(K.label(text, h, color, w), x, y, z);
    const gold = M.glow(0xffc04d, 2.8), eGeo = new THREE.SphereGeometry(0.055, 16, 12);
    /** a gold electron with a glowing comet trail; place(t) = its path in world space, shown while on(t) */
    const flyer = (path, on) => {
      const e = add(new THREE.Mesh(eGeo, gold)); e.add(K.glowSprite(0xffc04d, 0.32));
      const trail = Array.from({ length: 9 }, (_, k) => { const s = add(K.glowSprite(0xffc04d, 0.22 * (1 - k / 10))); s.material.opacity = 0.55 * (1 - k / 9); return s; });
      beats.push((t) => {
        const o = on(t); e.visible = o; if (o) e.position.copy(path(t));
        trail.forEach((s, k) => { const tk = t - (k + 1) * 0.035; s.visible = o && on(tk); if (s.visible) s.position.copy(path(tk)); });
      });
      return e;
    };
    /** one atom alone in its place: its name above, later swapped for its ion; returns the pieces */
    const makeAtom = (i, X0, shells, p, n, name, ionT, eqT, t0, t1, tg) => {
      const unit = add(new THREE.Group(), X0(i), AY, 0), A = K.atom(shells, p, n, 0.45, 0.3); unit.add(A.group);   // the 803 atom size (praised)
      const outer = shells.length - 1, R = 0.45 + outer * 0.3, up = 0.75 * R + 0.45;   // seen from a little above, a shell looks ~0.75 R tall
      const ul = (text, h, color, y) => { const l = K.label(text, h, color, 700); l.position.set(0, y, 0); unit.add(l); return l; };
      const nm = ul(name, 0.3, '#ffffff', up), ion = ul(ionT, 0.42, '#ffffff', up), eq = ul(eqT, 0.3, '#ffd27a', -0.9 * R - 0.5);
      const tight = X0(1) + (i - 1) * TIGHT;
      beats.push((t) => { unit.visible = t >= t0 - 0.05 && t < t1; unit.position.x = lerp(X0(i), tight, ease(span(t, tg, tg + 1.4))); unit.updateMatrixWorld(true); A.update(t); });
      return { A, outer, R, unit, nm, ion, eq };
    };
    const seatW = (a, x, t) => { const ring = a.A.rings[a.outer]; return ring.localToWorld(V(Math.cos(x.a0 + t * x.w) * x.R, 0, Math.sin(x.a0 + t * x.w) * x.R)); };

    // ================================================================ LOSE · one metal atom at a time
    const LOSE = [[[2, 8, 1], 11, 12, 'sodium (Na)', 'Na⁺', 'Na → Na⁺ + e⁻', T.na, 1], [[2, 8, 8, 2], 20, 20, 'calcium (Ca)', 'Ca²⁺', 'Ca → Ca²⁺ + 2e⁻', T.ca, 2],
      [[2, 8, 3], 13, 14, 'aluminium (Al)', 'Al³⁺', 'Al → Al³⁺ + 3e⁻', T.al, 3]];
    LOSE.forEach(([shells, p, n, name, ionT, eqT, t0, k], i) => {
      const a = makeAtom(i, LX, shells, p, n, name, ionT, eqT, t0 - (i ? 1.2 : 0), T.f, T.mSum + 0.3);
      const out = a.A.electrons.filter((x) => x.shell === a.outer), goldT = i ? t0 + 0.5 : t0 + 1.2;
      out.forEach((x, j) => {
        const tj = LEAVE(t0, i, j), dir = V(0.9, 0.55 + 0.25 * j, 0.45 - 0.3 * j).normalize();
        flyer((t) => seatW(a, x, tj).addScaledVector(dir, 3.2 * easeIn(span(t, tj, tj + 1.5))), (t) => t > tj && t < tj + 1.5);
        beats.push((t) => { if (t > goldT && x.e.material !== gold) { x.e.material = gold; x.e.children[0].material = x.e.children[0].material.clone(); x.e.children[0].material.color.set(0xffc04d); } x.e.visible = t <= tj; x.e.scale.setScalar(1 + 0.5 * Math.sin(Math.PI * span(t, goldT, goldT + 1.0))); });
      });
      const gone = LEAVE(t0, i, k - 1);
      beats.push((t) => {
        a.A.rings[a.outer].children[0].material.opacity = 0.55 * (1 - span(t, gone, gone + 0.8));   // the empty outer shell fades: the ion is smaller
        K.popIn(a.nm, t, t0 + 0.2, gone + 0.3); K.popIn(a.ion, t, gone + 0.8, T.f - 0.3); K.popIn(a.eq, t, gone + 1.4, T.mSum + 0.2);
      });
    });
    const lCat = lbl('metals lose electrons → + ions', 0.5, '#a8c4ff', LX(1), AY + 2.25);
    beats.push((t) => K.popIn(lCat, t, T.mSum + 1.8, T.f - 0.3));

    // ================================================================ GAIN · one non-metal atom at a time
    const GAIN = [[[2, 7], 9, 10, 'fluorine (F)', 'F⁻', 'F + e⁻ → F⁻', T.f, 1], [[2, 8, 7], 17, 18, 'chlorine (Cl)', 'Cl⁻', 'Cl + e⁻ → Cl⁻', T.cl, 1],
      [[2, 6], 8, 8, 'oxygen (O)', 'O²⁻', 'O + 2e⁻ → O²⁻', T.o, 2]];
    GAIN.forEach(([shells, p, n, name, ionT, eqT, t0, k], i) => {
      const a = makeAtom(i, GX, shells, p, n, name, ionT, eqT, t0 - (i ? 1.2 : 0), T.ie, T.nSum + 0.3);
      const ring = a.A.rings[a.outer], cnt = a.A.electrons.filter((x) => x.shell === a.outer).length + k;
      const tIn = t0 - (i ? 0.6 : 0);                                  // first electron flies in as the camera settles
      for (let j = 0; j < k; j++) {
        const x = { a0: (cnt - k + j) / cnt * Math.PI * 2 + 0.3, w: 0.9 / (1 + a.outer * 0.5), R: a.R };
        const tj = ARRIVE(tIn, j), from = V(GX(i) - 2.4 + j * 0.3, AY + 2.0, 0.8);
        const seated = new THREE.Mesh(eGeo, gold); seated.add(K.glowSprite(0xffc04d, 0.32)); ring.add(seated);
        flyer((t) => K.arc(from, seatW(a, x, t), 0.4, ease(span(t, tj, tj + 1.3))), (t) => t > tj && t < tj + 1.3);
        beats.push((t) => { seated.visible = t >= tj + 1.3; const an = x.a0 + t * x.w; seated.position.set(Math.cos(an) * x.R, 0, Math.sin(an) * x.R); });
      }
      const done = ARRIVE(tIn, k - 1) + 1.3;
      beats.push((t) => {
        const ringM = ring.children[0].material; ringM.opacity = 0.55 + 0.45 * Math.sin(Math.PI * span(t, done, done + 0.6));   // the outer shell flashes: full
        K.popIn(a.nm, t, t0 + 0.2, done - 0.1); K.popIn(a.ion, t, done + 0.3, T.ie - 0.3); K.popIn(a.eq, t, done + 0.9, T.nSum + 0.2);
      });
    });
    const lAn = lbl('non-metals gain electrons → − ions', 0.5, '#9fe0b4', GX(1), AY + 2.25);
    beats.push((t) => K.popIn(lAn, t, T.nSum + 1.8, T.ie - 0.3));

    // ================================================================ EASE · three tiles, a bar on each = energy to pull off an electron
    const grey = new THREE.Color(GREY), CAT = { m: new THREE.Color(MET), d: new THREE.Color(MLD), n: new THREE.Color(NON) };
    const bars = [['Na', 'm', 0.64, 'metal', '#a8c4ff'], ['Si', 'd', 1.0, 'metalloid', '#ffb88a'], ['Cl', 'n', 1.6, 'non-metal', '#9fe0b4']];   // book IE ≈ 496 : 786 : 1251
    const barM = M.gloss(0xf0bf4a), lHead = lbl('energy to pull off an electron', 0.26, '#ffd27a', BX(1), 3.25, BZ);
    const easy = lbl('easiest = most metallic', 0.2, '#a8c4ff', BX(0) - 0.4, BY + 0.25 + 0.64 + 0.25, BZ + 0.2);
    const flyTiles = {};
    bars.forEach(([s, c, H, word, col], i) => {
      const tl = K.tile(s, GREY, 0.44, 0.44, 0.1); add(tl, BX(i), BY, BZ); flyTiles[s] = { tl, c, t0: BAR[i] + 1.6 };
      const bar = add(K.solid(new THREE.BoxGeometry(0.26, 1, 0.1).translate(0, 0.5, 0), barM), BX(i), BY + 0.25, BZ);
      const v = lbl(word, 0.22, col, BX(i), BY - 0.42, BZ + 0.1);
      beats.push((t) => {
        const on = t > T.ie - 0.05 && t < T.tab + 0.6; bar.visible = on && t > BAR[i];
        bar.scale.set(1, Math.max(1e-4, H * ease(span(t, BAR[i], BAR[i] + 1.4)) * (1 - ease(span(t, T.tab, T.tab + 0.5)))), 1);
        K.popIn(v, t, BAR[i] + 1.6, T.tab);
      });
    });
    beats.push((t) => { K.popIn(lHead, t, T.ie + 0.4, T.tab); K.popIn(easy, t, BAR[2] + 2.6, T.tab); });

    // ================================================================ TABLE · builds round the three tiles; arrows across periods, down groups
    {
      const inv = (y) => { let a = 0, b = 1; for (let k = 0; k < 30; k++) { const m = (a + b) / 2; if (ease(m) < y) a = m; else b = m; } return a; };   // when the eased arrow reaches y
      const cat = { 3: 'm', 4: 'm', 5: 'd', 6: 'n', 7: 'n', 8: 'n', 9: 'n', 10: 'n', 11: 'm', 12: 'm', 13: 'm', 14: 'd', 15: 'n', 16: 'n', 17: 'n', 18: 'n', 32: 'd', 50: 'm', 82: 'm', 33: 'd', 51: 'd', 83: 'm' };
      const SYM = { 3: 'Li', 4: 'Be', 5: 'B', 6: 'C', 7: 'N', 8: 'O', 9: 'F', 10: 'Ne', 11: 'Na', 12: 'Mg', 13: 'Al', 14: 'Si', 15: 'P', 16: 'S', 17: 'Cl', 18: 'Ar', 32: 'Ge', 50: 'Sn', 82: 'Pb', 33: 'As', 51: 'Sb', 83: 'Bi' };
      // when the arrow reaches a tile: along a period (by column) or down a group (by row); the first pass colours it
      const hit = (r, c) => { const ts = []; const go = (k, [a, L], pos, n) => ts.push(a + L * (k === 'p3' ? inv((pos - 0.6) / 17.65) : k === 'p2' ? (pos - 0.6) / 17.65 : (pos - 1.75) / 4.85));
        if (r === 3) go('p3', RUN.p3, c, 18); if (r === 2) go('p2', RUN.p2, c, 18);
        if (c === 14 && r >= 2) go('g4', RUN.g4, r, 5); if (c === 15 && r >= 2) go('g5', RUN.g5, r, 5); return Math.min(...ts); };
      const named = {}, rest = [];
      for (let z = 1; z <= 118; z++) { const [r, c] = place(z); if (SYM[z]) named[z] = { r, c }; else rest.push({ z, r, c }); }
      const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(0.44, 0.44, 0.08), M.gloss(0xffffff), rest.length); add(inst);
      const built = (t, r, c) => back(span(t, T.tab + 0.3 + (c - 1) * 0.06 + Math.min(r, 7) * 0.03, T.tab + 0.65 + (c - 1) * 0.06 + Math.min(r, 7) * 0.03));
      const alk = (z) => [3, 11, 19, 37, 55, 87].includes(z), ALK = T.end + 0.8, AK = (z) => ALK + [3, 11, 19, 37, 55, 87].indexOf(z) * 0.35;   // the glow runs down group IA
      Object.entries(named).forEach(([z, { r, c }]) => {
        const s = SYM[z], fly = flyTiles[s], tl = fly ? fly.tl : add(K.tile(s, GREY, 0.44, 0.44, 0.1), COL(c), TY(r), 0);
        const t0 = fly ? fly.t0 : hit(r, c), slot = V(COL(c), TY(r), 0), body = tl.userData.body.material;
        beats.push((t) => {
          const k = ease(span(t, t0, t0 + 0.35)), pop = 0.15 * Math.sin(Math.PI * k);
          body.color.copy(grey).lerp(CAT[cat[z]], k);
          body.emissive.set(MET); body.emissiveIntensity = alk(+z) ? 0.5 * span(t, AK(+z), AK(+z) + 0.4) : 0;
          if (fly) {                                                       // the bar tile flies into its slot as the table builds
            const u = ease(span(t, T.tab + 0.2, T.tab + 2.2));
            tl.visible = t > T.ie - 0.05; tl.position.copy(K.arc(V(BX(bars.findIndex((b) => b[0] === s)), BY, BZ), slot, 0.6, u)); tl.position.z += pop;
            tl.scale.setScalar(Math.max(1e-4, t < T.ie + 0.4 ? back(span(t, T.ie - 0.05, T.ie + 0.35)) : 1));
          } else { tl.visible = t > T.tab; tl.scale.setScalar(Math.max(1e-4, built(t, r, c))); tl.position.z = pop; }
        });
      });
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), cc = new THREE.Color();
      beats.push((t) => {
        inst.visible = t > T.tab;
        if (!inst.visible) return;
        rest.forEach(({ z, r, c }, i) => { const s = Math.max(1e-4, built(t, r, c)); m4.compose(V(COL(c), TY(r), 0), q, V(s, s, s)); inst.setMatrixAt(i, m4); inst.setColorAt(i, cc.copy(grey).lerp(CAT.m, alk(z) ? span(t, AK(z), AK(z) + 0.4) : 0)); });
        inst.instanceMatrix.needsUpdate = true; inst.instanceColor.needsUpdate = true;
      });
      // the gold arrow: runs along a row (head first) or down a column
      const gm = M.glow(0xffc04d, 1.8), arrow = new THREE.Group();
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 12).rotateZ(Math.PI / 2), gm); shaft.position.x = -0.45;
      const head = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 16).rotateZ(-Math.PI / 2), gm); head.position.x = 0.08; arrow.add(shaft, head); add(arrow);
      const lLess = lbl('less metallic →', 0.36, '#ffd27a', COL(7.5), 3.63, 0.1), lMore = lbl('more metallic ↓', 0.34, '#ffd27a', COL(14), TY(1), 0.1);
      const lAlk = lbl('group IA: most metallic', 0.42, '#a8c4ff', COL(6.6), TY(1), 0.1);
      beats.push((t) => {
        let on = false;
        for (const [k, [a, L]] of Object.entries(RUN)) {
          if (t < a - 0.3 || t > a + L + 0.4) continue; on = true;
          const u = k === 'p3' ? ease(span(t, a, a + L)) : span(t, a, a + L), grow = back(span(t, a - 0.3, a)) * (1 - ease(span(t, a + L, a + L + 0.4)));
          if (k[0] === 'p') { const r = k === 'p3' ? 3 : 2; arrow.rotation.z = 0; arrow.position.set(lerp(COL(0.6), COL(18.25), u), TY(r) - 0.16, 0.3); shaft.scale.x = 1; shaft.position.x = -0.45; }
          else { const c = k === 'g4' ? 14 : 15; arrow.rotation.z = -Math.PI / 2; arrow.position.set(COL(c) + 0.17, lerp(TY(1.75), TY(6.6), u), 0.3); shaft.scale.x = 0.6; shaft.position.x = -0.27; }
          arrow.scale.setScalar(Math.max(1e-4, grow));
        }
        arrow.visible = on;
        K.popIn(lLess, t, RUN.p3[0] + RUN.p3[1] + 0.2, T.g4 - 0.3); K.popIn(lMore, t, RUN.g4[0] + RUN.g4[1] + 0.2, T.end + 0.2);
        K.popIn(lAlk, t, ALK + 0.4);
      });
    }

    return (t, dt) => { for (const b of beats) b(t, dt); };
  },
};
