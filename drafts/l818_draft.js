// Lesson 818 · Key Points (book p.245), v1 (2026-10-14). Built from SKILL §0: a familiar hook (table salt and a rock
// with gold in it), ONE question on a card, one picture per key point, back to the hook for the answer.
// THE QUESTION: "Why is gold found pure, but sodium never?" → card: where the metals are · give / take electrons ·
// the families · very reactive = found combined · soft and hard · noble metals.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//   HOOK    a shaker pours salt (sodium joined to chlorine) · a rock shows pure gold · question → card.
//   METALS  (dark) the table: group IA (not H), IIA, IIIA (not B), three of IVA and VA, lanthanides + actinides,
//           the d-block light up one after another: all metals; the rest are non-metals (point 1) → what is the
//           difference inside?
//   INSIDE  (dark) sodium gives its outer electron, chlorine takes it: metals electropositive, non-metals
//           electronegative (points 2, 3) → which ones do it best?
//   FAMILY  (dark) the table: IA alkali metals, IIA alkaline earth metals, VIIA halogens (points 4, 7); electrons leave
//           every IA tile (highly electropositive, point 5), electrons drop into every VIIA tile (highly
//           electronegative, point 8) → what does that mean in real life?
//   COMBINED knife cuts sodium: shiny, then dull at once (very reactive) → so in nature it is found combined, in rock
//           salt, together with chlorine, a halogen (points 6, 9).
//   HARD    the same knife on an iron bar: no cut. Sodium soft, iron hard (point 10).
//   NOBLE   (dark) the table: the 11 noble metals of the book light up; silver, platinum, gold: precious (points
//           11, 12) → silver and platinum bars join the gold on the hook table.
//   END     salt: sodium reacts too easily, always combined · gold hardly reacts, found pure. Question answered.
// Book points (all of p.245 Key Points, 12 bullets): metals list · electropositive · electronegative · IA alkali, IIA
// alkaline earth · alkali highly electropositive · very reactive, combined · VIIA halogens · highly electronegative ·
// very reactive, combined · sodium soft, iron hard · 11 noble metals · silver, platinum, gold precious.
// Memorize-only (→ 🎮 Metal or Non-metal? and the noble metals game): which groups are metals, the 11 noble metals.
// §1 CHECK (sheets renders/lesson/d818*.jpg, s818.jpg, scr818.jpg): nothing missing ✓ · one question + bridges ✓ ·
// familiar hook (salt, gold) paid off at the end ✓ · each test: question → before → visible cause (knife, tongs) →
// result labelled ✓ · one picture per point (one table, two atoms, one bench) ✓ · ≤ 3 labels a shot ✓ · one place
// at a time ✓ · camera moves ≥ 2 s ✓ · baked tables, dark table and atoms ✓ · every screen ✓ · flicker 0 ✓.
import * as THREE from 'three';
import * as K from './kit.js';
import { place, SYM } from '../games/u3data.js';
const { M, span, ease, easeIn, back, lerp, hash } = K;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

const TAN = Math.tan(16 * Math.PI / 180), ASP = 1.6, ADIR = [0, 0.5, 1], DDIR = [0, 0.12, 1];
let DOCK = 1e9;
/** a shot: the subject (look, w × h) seen along dir; the engine refits it to the real screen (fit = 6th element) */
function S(t, look, w, h, dir = ADIR, e) {
  const dk = t >= DOCK, d = V(...dir).normalize(), dist = Math.max(h / 2 / TAN, (dk ? w / (1 - K.DOCK_W) : w) / 2 / (TAN * ASP)) * 1.1;
  const pos = V(...look).addScaledVector(d, dist).toArray(), fit = { look, w, h, dir, dock: dk ? K.DOCK_W : 0 };
  return dk ? [t, ...K.dockShot(pos, look), undefined, e, fit] : [t, pos, look, undefined, e, fit];
}

// ---------------------------------------------------------------- places (stations 10+ apart)
const SHX = -1.0, DSX = -0.65, GRX = 0.35, AGX = 0.7, PTX = 0.98;         // hook: shaker · salt dish · gold rock · (later) silver, platinum bars
const TBX = 14, TP = 0.5, COL = (c) => TBX + (c - 9.5) * TP, TY = (r) => 4.6 - (r - 1) * TP - (r > 7 ? 0.25 : 0), YT = TY(1) + 0.8;   // the periodic table (dark)
const NAX = 26, CLX = 29.6, AY = 1.9;                                     // inside: sodium and chlorine atoms (dark)
const BX = 40, NAB = BX - 0.35, FEB = BX + 0.2, RSX = BX + 0.72;           // bench: sodium block · iron bar · rock salt

// ---------------------------------------------------------------- time (every camera move ≥ 2 s)
const T = { pour: 0.6, salt: 3.8, gold: 6.6, pure: 9.0, ask: 11.8, card: 14.6 };
DOCK = T.card + 5.0;
const M0 = DOCK + 0.4, LT = [2.4, 4.6, 6.8, 9.0, 11.4, 13.8], MEND = M0 + 21;
const G0 = MEND, GEND = G0 + 16;
const F0 = GEND, FEND = F0 + 19.5;
const B0 = FEND, BEND = B0 + 21;
const H0 = BEND, HEND = H0 + 11.5;
const N0 = HEND, NEND = N0 + 13;
const P0 = NEND, PEND = P0 + 9;
const Z0 = PEND; T.done = Z0 + 11;
const INTRO = [T.card, DOCK];
const TICKS = [[MEND - 0.6, 0], [GEND - 0.6, 1], [FEND - 0.6, 2], [BEND - 0.6, 3], [HEND - 0.6, 4], [PEND - 0.6, 5]];
const dark = (t) => [[M0, B0], [N0, P0]].some(([a, b]) => t >= a - 0.05 && t < b - 0.05);

const m = (k) => M0 + k, g = (k) => G0 + k, f = (k) => F0 + k, b = (k) => B0 + k, h = (k) => H0 + k, n = (k) => N0 + k, p = (k) => P0 + k, z = (k) => Z0 + k;
const captions = [
  [0.3, T.salt, 'Table salt, poured from a shaker'],
  [T.salt, T.gold, 'Salt hides a metal: sodium, joined to chlorine'],
  [T.gold, T.pure, 'And this rock has gold in it'],
  [T.pure, T.ask, 'The gold sits there pure, a shiny metal'],
  [T.ask, T.card, 'Why is gold found pure, but sodium never?'],
  [T.card, DOCK, 'Six key points answer it'],
  [M0, m(LT[0]), 'Where are the metals?'],
  [m(LT[0]), m(LT[1]), 'Group IA, except hydrogen'],
  [m(LT[1]), m(LT[2]), 'Group IIA'],
  [m(LT[2]), m(LT[3]), 'Group IIIA, except boron'],
  [m(LT[3]), m(LT[4]), 'Three elements each from IVA and VA'],
  [m(LT[4]), m(LT[5]), 'The lanthanides and actinides'],
  [m(LT[5]), m(16.4), 'All the d-block (transition) elements'],
  [m(16.4), m(18.4), 'All of these are metals ✓'],
  [m(18.4), MEND, 'The rest are non-metals. What\'s the difference?'],
  [G0, g(3.4), 'Inside: sodium (metal), chlorine (non-metal)'],
  [g(3.4), g(6.8), 'The metal gives its outer electron away'],
  [g(6.8), g(8.8), 'The non-metal takes it'],
  [g(8.8), g(11.6), 'Metals are electropositive ✓'],
  [g(11.6), GEND, 'Non-metals are electronegative ✓'],
  [F0, f(4.3), 'Group IA: the alkali metals'],
  [f(4.3), f(8.3), 'Group IIA: the alkaline earth metals'],
  [f(8.3), f(11.8), 'Group VIIA: the halogens'],
  [f(11.8), f(15.3), 'Alkali metals give electrons most easily'],
  [f(15.3), FEND, 'Halogens take electrons most strongly'],
  [B0, b(3.6), 'So are they very reactive? Cut sodium'],
  [b(3.6), b(5.6), 'Shiny inside…'],
  [b(5.6), b(8.6), '…dull in seconds: the air attacks it'],
  [b(8.6), b(10.8), 'Alkali metals are very reactive ✓'],
  [b(10.8), b(14.0), 'So in nature, sodium is never alone'],
  [b(14.0), b(17.4), 'It is found combined, in rock salt'],
  [b(17.4), BEND, 'Halogens too: chlorine is in that salt ✓'],
  [H0, h(3.2), 'The knife cut sodium easily. And iron?'],
  [h(3.2), h(6.8), 'The knife can\'t cut it'],
  [h(6.8), HEND, 'Sodium is soft, iron is hard ✓'],
  [N0, n(7.2), 'The noble metals: they hardly react'],
  [n(7.2), NEND, 'Silver, platinum and gold: precious metals'],
  [P0, PEND, 'Precious metals stay shiny for ever ✓'],
  [Z0, z(3.4), 'Sodium reacts too easily: always combined'],
  [z(3.4), z(7.0), 'Gold hardly reacts: it is found pure'],
  [z(7.0), T.done, 'How reactive it is decides how we find it ✓'],
];

// ---------------------------------------------------------------- camera
const HW = (t, k = 1, e) => S(t, [0.0, 0.3, 0.05], 2.45 * k, 0.85 * k, ADIR, e);
const HS = (t, k = 1, e) => S(t, [(SHX + DSX) / 2 + 0.02, 0.24, 0.05], 0.95 * k, 0.65 * k, ADIR, e);
const HG = (t, k = 1, e) => S(t, [GRX, 0.2, 0.05], 0.8 * k, 0.55 * k, ADIR, e);
const HN = (t, k = 1, e) => S(t, [(GRX + PTX) / 2, 0.18, 0.05], 1.15 * k, 0.6 * k, ADIR, e);
const TAB = (t, k = 1, e) => S(t, [TBX, 2.85, 0], 9.4 * k, 6.2 * k, DDIR, e);
const DK = (t, x, w, hh, k = 1, e) => S(t, [x, AY, 0], w * k, hh * k, DDIR, e);
const BN = (t, k = 1, e) => S(t, [NAB + 0.02, 0.16, 0.05], 0.75 * k, 0.5 * k, ADIR, e);
const BS = (t, k = 1, e) => S(t, [(NAB + RSX) / 2, 0.18, 0.05], 1.55 * k, 0.6 * k, ADIR, e);
const BH = (t, k = 1, e) => S(t, [(NAB + FEB) / 2 + 0.02, 0.16, 0.05], 1.05 * k, 0.55 * k, ADIR, e);
const cams = [
  // HOOK: close on the salt, over to the gold, wide for the question
  HS(0, 1.04), HS(T.salt + 0.8, 0.98), HG(T.gold + 0.4, 1.02), HG(T.pure + 1.0, 0.96), HW(T.ask + 1.0, 1.02), HW(T.card, 1.0), HW(DOCK, 1.02), HW(M0 - 0.05, 0.99),
  // METALS (dark): the whole table, a slow push
  TAB(M0, 1.04), TAB(MEND - 0.05, 0.98),
  // INSIDE (dark): both atoms, push a little as the electron moves
  DK(G0, (NAX + CLX) / 2, 5.8, 3.3, 1.04), DK(GEND - 0.05, (NAX + CLX) / 2, 5.8, 3.3, 0.98),
  // FAMILY (dark): the table again
  TAB(F0, 1.04), TAB(FEND - 0.05, 0.98),
  // COMBINED: close on the sodium, out to sodium + rock salt · HARD: sodium + iron
  BN(B0, 1.04), BN(b(9.4), 0.97), BS(b(11.6), 1.02), BS(BEND - 0.05, 0.97), BH(H0 + 2.0, 1.02), BH(HEND - 0.05, 0.96),
  // NOBLE (dark): the table · the precious bars on the hook table
  TAB(N0, 1.04), TAB(NEND - 0.05, 0.98), HN(P0, 1.04), HN(PEND - 0.05, 0.97),
  // END: wide on the hook table
  HW(Z0 + 2.0, 1.03), HW(T.done, 0.98),
];

export default {
  duration: T.done,
  fog: [18, 40],
  captions,
  cams,

  build({ scene, cam, R }) {
    const beats = [];
    const ST = K.studio({ scene, R }, '818', { dark });                 // FIRST: models read the look
    beats.push((t) => ST.update(t));
    let root = scene;
    const add = (o, x = 0, y = 0, zz = 0) => { o.position.set(x, y, zz); root.add(o); return o; };
    const stage = (show) => { root = new THREE.Group(); scene.add(root); const gr = root; beats.push((t) => { gr.visible = show(t); }); return gr; };
    const lbl = (text, hh, color, x, y, zz = 0, w = 700) => add(K.label(text, hh, color, w), x, y, zz);
    const tags = [], tag = (text, hh, color, x, y, zz = 0, w = 700) => { const l = lbl(text, 0.1, color, x, y, zz, w); l.userData.frac = hh * 1.8; tags.push(l); return l; };
    const shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
    const goldE = M.glow(0xffc04d, 2.6);
    const electron = (r = 0.055) => { const e = add(new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), goldE)); e.add(K.glowSprite(0xffc04d, r * 7)); return e; };
    /** tongs carry a thing down from above onto `rest` (t0 … t0+1.2), let go and rise away (… t0+2.2); true while seen */
    const carry = (o, tg, t, t0, rest, gap) => {
      o.visible = t > t0; if (!o.visible) return false;
      const top = rest.clone().add(V(0, 1.0, 0)), on = t < t0 + 2.2;
      const pd = t < t0 + 1.2 ? top.clone().lerp(rest, 1 - (1 - span(t, t0, t0 + 1.2)) ** 2) : rest.clone();
      o.position.copy(pd);
      if (on) { tg.position.copy(t < t0 + 1.35 ? pd : rest.clone().lerp(top, easeIn(span(t, t0 + 1.4, t0 + 2.2)))).add(V(0, 0.03, 0)); tg.userData.set(t < t0 + 1.3 ? gap : gap + 0.05); }
      return on;
    };
    const twinkle = (s, t, t0, ph, size) => { const k = ((t - t0 - ph) % 1.8 + 1.8) % 1.8, tw = Math.sin(Math.PI * Math.min(1, k / 0.7)); s.visible = t > t0 + ph && k < 0.7; s.scale.setScalar(Math.max(1e-4, size * tw)); s.material.rotation = 0.6 * k; };

    // ================================================================ HOOK / NOBLE BARS / END · salt from a shaker, gold in a rock
    {
      stage((t) => t < M0 - 0.05 || (t >= P0 - 0.05)); ST.bake(root, 'hook', 0.0, 2.6, 1.1);
      const sh = add(new THREE.Group(), SHX, 0, 0.05), shaker = K.saltShaker(0.24, 0.055); sh.add(shaker);
      const heap = add(K.saltHeap(0.1, 300), DSX, 0, 0.05), heapIn = heap.children.find((c) => c.isInstancedMesh);
      const grains = Array.from({ length: 14 }, (_, i) => { const gr = add(K.solid(new THREE.BoxGeometry(0.009, 0.009, 0.009), M.gloss(0xf6f5f1), { outline: false })); gr.userData.k = hash(i, 4); gr.rotation.set(hash(i, 5) * 3, hash(i, 6) * 3, hash(i, 9) * 3); return gr; });
      add(K.goldRock(0.12, 4), GRX, 0, 0.05);
      const stars = [[0.0, V(GRX + 0.05, 0.12, 0.12), 0.1], [0.7, V(GRX - 0.06, 0.13, 0.1), 0.08], [1.2, V(GRX + 0.02, 0.15, 0.04), 0.07]].map(([ph, at, size]) => { const s = add(K.sparkle(0xfff2c0, size)); s.position.copy(at); s.userData.ph = ph; s.userData.size = size; return s; });
      const ag = add(K.ingot(K.nobleMat(K.NOBLE.silver, 0.18), 0.17, 0.06, 0.09)), pt = add(K.ingot(K.nobleMat(K.NOBLE.plat, 0.22), 0.17, 0.06, 0.09));
      const tg = add(K.tongs(0.55)); tg.rotation.y = Math.PI / 2;
      const barStars = [[0.3, ag, 0.08], [1.0, pt, 0.07]].map(([ph, o, size]) => { const s = add(K.sparkle(0xffffff, size)); s.userData = { ph, o, size }; return s; });
      const lSalt = tag('table salt', 0.05, '#ffffff', DSX, 0.24, 0.12), lNaCl = tag('sodium + chlorine', 0.05, '#ffe7c8', DSX, 0.24, 0.12);
      const lGold = tag('gold', 0.055, '#ffd77a', GRX, 0.32, 0.1), lPure = tag('pure gold ✓', 0.055, '#ffd77a', GRX, 0.32, 0.1);
      const lAg = tag('silver', 0.05, '#ffffff', AGX, 0.2, 0.12), lPt = tag('platinum', 0.05, '#e6ebf2', PTX + 0.02, 0.2, 0.12), lPrec = tag('precious ✓', 0.055, '#ffd77a', (GRX + PTX) / 2, 0.42, 0.1);
      const lAlw = tag('always combined', 0.05, '#ffe7c8', DSX, 0.26, 0.12), lFound = tag('found pure', 0.05, '#ffd77a', (GRX + PTX) / 2, 0.36, 0.1);
      beats.push((t) => {
        // the shaker tilts over the dish, salt grains fall, the heap grows (again at the end)
        const pw = (p0) => ease(span(t, p0, p0 + 0.6)) * (1 - ease(span(t, p0 + 2.6, p0 + 3.2))), tilt = pw(T.pour) + pw(z(6.4));
        const pouring = (t > T.pour + 0.6 && t < T.pour + 2.6) || (t > z(7.0) && t < z(9.0)), shk = pouring ? 0.012 * Math.sin(t * 28) : 0;
        sh.rotation.z = -2.0 * tilt; sh.position.set(SHX + 0.16 * tilt + shk, 0.3 * tilt, 0.05);
        shaker.userData.fill(span(t, T.pour + 0.6, T.pour + 2.6) + 0.5 * span(t, z(7.0), z(9.0)));
        sh.updateMatrixWorld(true); const top = sh.localToWorld(shaker.userData.top.clone());
        grains.forEach((gr, i) => { const u = (((t - T.pour) * 1.6 + gr.userData.k) % 1 + 1) % 1; gr.visible = pouring; gr.position.set(lerp(top.x + (hash(i, 8) - 0.5) * 0.03, DSX + (gr.userData.k - 0.5) * 0.05, u), lerp(top.y, 0.05, u * u) + 0.002 * i, 0.05 + (hash(i, 7) - 0.5) * 0.04 + 0.0013 * i); });
        const hk = t < 0 ? 0 : 0.25 + 0.75 * ease(span(t, T.pour + 0.6, T.pour + 2.6)); heapIn.scale.set(1, Math.max(0.05, hk), 1);
        stars.forEach((s) => twinkle(s, t, T.gold + 0.6, s.userData.ph, s.userData.size));
        // silver and platinum bars are carried in beside the gold
        const c1 = carry(ag, tg, t, p(0.6), V(AGX, 0, 0.05), 0.065), c2 = carry(pt, tg, t, p(2.6), V(PTX, 0, 0.05), 0.065);
        if (t < P0) { ag.visible = pt.visible = false; }
        tg.visible = c1 || c2;
        barStars.forEach((s) => { s.position.copy(s.userData.o.position).add(V(0.03, 0.07, 0.05)); twinkle(s, t, p(5.0), s.userData.ph, s.userData.size); if (t < p(5.0)) s.visible = false; });
        K.popIn(lSalt, t, T.pour + 0.3, T.salt); K.popIn(lNaCl, t, T.salt + 0.2, T.gold - 0.2);
        K.popIn(lGold, t, T.gold + 0.6, T.pure); K.popIn(lPure, t, T.pure + 0.3, T.card - 0.2);
        K.popIn(lAg, t, p(1.9), p(6.2)); K.popIn(lPt, t, p(3.9), p(6.2)); K.popIn(lPrec, t, p(6.5), PEND);
        K.popIn(lAlw, t, z(0.8), 1e9); K.popIn(lFound, t, z(3.6), 1e9);
      });
    }

    // ================================================================ TABLE (dark, three times) · the metals · the families · the noble metals
    {
      stage((t) => (t >= M0 - 0.05 && t < MEND) || (t >= F0 - 0.05 && t < FEND) || (t >= N0 - 0.05 && t < NEND));
      const key = new THREE.DirectionalLight(0xfff2e0, 2.2); key.position.set(TBX - 3, TY(4) + 4, 6); key.target.position.set(TBX, TY(4), 0); root.add(key, key.target);
      const GROUPS = [[3, 11, 19, 37, 55, 87], [4, 12, 20, 38, 56, 88], [13, 31, 49, 81, 113], [50, 82, 114, 51, 83, 115], [], []];
      for (let zz = 57; zz <= 71; zz++) GROUPS[4].push(zz); for (let zz = 89; zz <= 103; zz++) GROUPS[4].push(zz);
      const NM = [1, 5, 6, 14, 7, 15, 8, 16, 34, 52, 84, 116, 9, 17, 35, 53, 85, 117, 2, 10, 18, 36, 54, 86, 118];
      const IA = GROUPS[0], IIA = GROUPS[1], VIIA = [9, 17, 35, 53, 85];
      const NOB = [44, 45, 46, 47, 76, 77, 78, 79, 80, 75, 29], PREC = [47, 78, 79];   // Ru Rh Pd Ag Os Ir Pt Au Hg Re Cu (book order)
      const grpOf = {};
      for (let zz = 1; zz <= 118; zz++) {
        const [r, c] = place(zz);
        GROUPS.forEach((gs, i) => { if (gs.includes(zz)) grpOf[zz] = i; });
        if (grpOf[zz] === undefined && r >= 4 && r <= 7 && c >= 3 && c <= 12) grpOf[zz] = 5;
      }
      const tiles = [];
      for (let zz = 1; zz <= 118; zz++) { const [r, c] = place(zz); const tl = K.tile(SYM[zz], 0xffffff, 0.44, 0.44, 0.08); tl.position.set(COL(c), TY(r), 0.01); root.add(tl); tiles.push({ zz, tl, x: COL(c), y: TY(r) }); }
      const GREY = new THREE.Color(0x4a4f58), MET = new THREE.Color(0x7f93b4), GREEN = new THREE.Color(0x3fae6a), GOLDC = new THREE.Color(0xe0a63a), ORA = new THREE.Color(0xd9773a), HAL = new THREE.Color(0xa8d84a);
      const col = new THREE.Color();
      const colorOf = (zz, t) => {
        col.copy(GREY);
        const gi = grpOf[zz];
        if (t < MEND) {                                                     // window 1: the metals, group by group; then the non-metals
          if (gi !== undefined) col.lerp(MET, ease(span(t, m(LT[gi]), m(LT[gi] + 0.5))));
          if (NM.includes(zz)) col.lerp(GREEN, ease(span(t, m(18.6), m(19.2))));
        } else if (t < FEND) {                                              // window 2: start as window 1 ended, then the families
          if (gi !== undefined) col.copy(MET); if (NM.includes(zz)) col.copy(GREEN);
          if (IA.includes(zz)) col.lerp(GOLDC, ease(span(t, f(0.6), f(1.2))));
          if (IIA.includes(zz)) col.lerp(ORA, ease(span(t, f(4.6), f(5.2))));
          if (VIIA.includes(zz)) col.lerp(HAL, ease(span(t, f(8.6), f(9.2))));
        } else {                                                            // window 3: the noble metals, one by one
          const i = NOB.indexOf(zz); if (i >= 0) col.lerp(GOLDC, ease(span(t, n(1.0 + 0.45 * i), n(1.4 + 0.45 * i))));
        }
        return col;
      };
      const flash = (zz, t) => {
        const gi = grpOf[zz]; let s = 0;
        if (t < MEND) { if (gi !== undefined) s = Math.sin(Math.PI * span(t, m(LT[gi]), m(LT[gi] + 1.0))); s = Math.max(s, gi !== undefined ? Math.sin(Math.PI * span(t, m(16.4), m(17.4))) : 0); }
        else if (t < FEND) {
          if (IA.includes(zz)) s = Math.max(Math.sin(Math.PI * span(t, f(0.6), f(1.6))), Math.sin(Math.PI * span(t, f(12.0 + 0.4 * IA.indexOf(zz)), f(12.6 + 0.4 * IA.indexOf(zz)))));
          if (IIA.includes(zz)) s = Math.sin(Math.PI * span(t, f(4.6), f(5.6)));
          if (VIIA.includes(zz)) s = Math.max(Math.sin(Math.PI * span(t, f(8.6), f(9.6))), Math.sin(Math.PI * span(t, f(16.4 + 0.45 * VIIA.indexOf(zz)), f(17.0 + 0.45 * VIIA.indexOf(zz)))));
        } else {
          const i = NOB.indexOf(zz); if (i >= 0) s = Math.sin(Math.PI * span(t, n(1.0 + 0.45 * i), n(1.8 + 0.45 * i)));
          if (PREC.includes(zz)) s = Math.max(s, 0.8 * Math.sin(Math.PI * span(t, n(7.4), n(8.6))));
        }
        return s;
      };
      const L = (s, c = '#ffffff', hh = 0.62) => lbl(s, hh, c, COL(9.5), YT);
      const lWhere = L('where are the metals?', '#ffffff');
      const lG = ['group IA (not hydrogen)', 'group IIA', 'group IIIA (not boron)', 'three of IVA, three of VA', 'lanthanides, actinides', 'd-block: transition elements'].map((s) => L(s, '#c8d8f0'));
      const lAll = L('all metals ✓', '#c8d8f0', 0.7), lRest = L('the rest: non-metals', '#9ff0b8');
      const lIA = L('IA: alkali metals', '#ffd77a', 0.7), lIIA = L('IIA: alkaline earth metals', '#ffb48a', 0.7), lVII = L('VIIA: halogens', '#d8f590', 0.7);
      const lHiP = L('highly electropositive', '#ffd77a', 0.7), lHiN = L('highly electronegative', '#d8f590', 0.7);
      const lNob = L('the noble metals', '#ffd77a', 0.7), lPrec = L('precious: silver, platinum, gold', '#ffd77a', 0.62);
      // electrons: leave every alkali metal tile (up and away), drop into every halogen tile
      const outs = IA.map((zz, i) => ({ e: electron(0.07), t0: f(12.0 + 0.4 * i), tl: tiles[zz - 1] })), ins = VIIA.map((zz, i) => ({ e: electron(0.07), t0: f(15.8 + 0.45 * i), tl: tiles[zz - 1] }));
      beats.push((t) => {
        if (!shown(key)) return;
        tiles.forEach(({ zz, tl }) => { const mt = tl.userData.body.material; mt.color.copy(colorOf(zz, t)); const fl = flash(zz, t); tl.position.z = 0.01 + 0.1 * fl; mt.emissive.set(0xf0b030); mt.emissiveIntensity = 0.5 * fl; });
        outs.forEach(({ e, t0, tl }) => { const u = span(t, t0, t0 + 1.4); e.visible = t > t0 && t < t0 + 1.4 && t < FEND; e.position.set(tl.x + 0.5 * easeIn(u), tl.y + 0.2 + 1.1 * ease(u), 0.3); e.scale.setScalar(Math.max(1e-4, 1 - u * u)); });
        ins.forEach(({ e, t0, tl }) => { const u = span(t, t0, t0 + 1.0); e.visible = t > t0 - 0.3 && t < t0 + 1.0 && t < FEND; e.position.set(tl.x - 0.5 * (1 - u), tl.y + 1.2 * (1 - easeIn(u)) + 0.05, 0.3); e.scale.setScalar(Math.max(1e-4, back(span(t, t0 - 0.3, t0)) * (1 - 0.6 * span(t, t0 + 0.7, t0 + 1.0)))); });
        K.popIn(lWhere, t, m(0.4), m(LT[0])); lG.forEach((l, i) => K.popIn(l, t, m(LT[i] + 0.2), i < 5 ? m(LT[i + 1]) : m(16.2)));
        K.popIn(lAll, t, m(16.5), m(18.4)); K.popIn(lRest, t, m(18.7), MEND);
        K.popIn(lIA, t, f(1.0), f(4.4)); K.popIn(lIIA, t, f(4.9), f(8.4)); K.popIn(lVII, t, f(8.9), f(11.8));
        K.popIn(lHiP, t, f(12.2), f(15.4)); K.popIn(lHiN, t, f(15.7), FEND);
        K.popIn(lNob, t, n(0.6), n(7.2)); K.popIn(lPrec, t, n(7.5), NEND);
      });
    }

    // ================================================================ INSIDE (dark) · sodium gives, chlorine takes
    {
      stage((t) => t >= G0 - 0.05 && t < GEND);
      const key = new THREE.DirectionalLight(0xfff2e0, 2.0); key.position.set(NAX, 5, 6); key.target.position.set(CLX, AY, 0); root.add(key, key.target);
      const NA = K.atom([2, 8, 1], 11, 12, 0.45, 0.3), CL = K.atom([2, 8, 7], 17, 18, 0.45, 0.3);
      add(NA.group, NAX, AY, 0); add(CL.group, CLX, AY, 0);
      const x1 = NA.electrons.find((e) => e.shell === 2); x1.e.material = goldE; x1.e.children[0].material = x1.e.children[0].material.clone(); x1.e.children[0].material.color.set(0xffc04d);
      CL.electrons.filter((e) => e.shell === 2).forEach((e, k) => { e.a0 = k / 8 * Math.PI * 2; });
      const cR = CL.electrons.find((e) => e.shell === 2), cTilt = CL.rings[2];
      const fly = electron(0.055), tr = Array.from({ length: 10 }, () => add(K.glowSprite(0xffc04d, 0.16)));
      const lNa = lbl('sodium (metal)', 0.4, '#ffffff', NAX, AY + 1.5), lCl = lbl('chlorine (non-metal)', 0.4, '#ffffff', CLX, AY + 1.5);
      const lNaP = lbl('Na⁺', 0.45, '#ffd9b8', NAX, AY + 1.5, 0, 700), lClM = lbl('Cl⁻', 0.45, '#bff0c8', CLX, AY + 1.5, 0, 700);
      const lPos = lbl('gives: electropositive', 0.36, '#ffd9b8', NAX, AY - 1.45), lNeg = lbl('takes: electronegative', 0.36, '#bff0c8', CLX, AY - 1.45);
      let hist = [], lastT = -1;
      beats.push((t) => {
        if (!shown(NA.group)) return;
        NA.update(t); CL.update(t);
        const t0 = g(3.6), t1 = g(4.8), t2 = g(6.8);
        x1.free = t > t0;
        NA.group.updateMatrixWorld(true); CL.group.updateMatrixWorld(true);
        const ring = NA.rings[2], a = x1.a0 + t0 * x1.w, home = ring.localToWorld(V(Math.cos(a) * x1.R, 0, Math.sin(a) * x1.R)), out = NA.group.localToWorld(V(x1.R + 0.35, 0.2, 0.2));
        const pulled = home.clone().lerp(out, ease(span(t, t0, t1)));
        if (x1.free) x1.e.position.copy(ring.worldToLocal(pulled.clone()));
        x1.e.visible = t < t1;
        NA.rings[2].children[0].material.opacity = 0.55 * (1 - span(t, t1, t1 + 0.8));
        const sa = 7 / 8 * Math.PI * 2 + t * cR.w, slot = cTilt.localToWorld(V(Math.cos(sa) * cR.R, 0, Math.sin(sa) * cR.R));
        fly.visible = t > t1; fly.position.copy(t < t2 ? K.arc(pulled, slot, 0.8, ease(span(t, t1, t2))) : slot);
        if (t < lastT || Math.abs(t - lastT) > 0.2) hist = []; lastT = t;
        hist.unshift(fly.position.clone()); hist.length = Math.min(hist.length, 30);
        tr.forEach((s, k) => { s.position.copy(hist[Math.min(hist.length - 1, k * 2)]); s.visible = t > t1 && t < t2; s.material.opacity = 0.6 * (1 - k / tr.length); });
        cTilt.children[0].material.opacity = 0.55 + 0.4 * Math.sin(Math.PI * span(t, t2, t2 + 0.8));   // the full shell flashes
        K.popIn(lNa, t, g(0.4), g(5.2)); K.popIn(lCl, t, g(1.0), g(6.9));
        K.popIn(lNaP, t, g(5.6), 1e9); K.popIn(lClM, t, g(7.3), 1e9);
        K.popIn(lPos, t, g(9.0), 1e9); K.popIn(lNeg, t, g(11.8), 1e9);
      });
    }

    // ================================================================ BENCH · sodium cut and dulled → rock salt · the knife on iron
    {
      stage((t) => t >= B0 - 0.05 && t < HEND); ST.bake(root, 'bench', BX + 0.15, 1.9, 1.0);
      const na = add(K.sodiumBlock(0.3, 0.14, 0.18), NAB, 0, 0.05); na.rotation.y = -0.35;
      const { shine, crust } = na.userData, fresh = new THREE.Color(0xf4f6f8), dull = crust.color.clone();
      const nStars = [[0.1, -0.02, 0.03, 0.08], [0.7, 0.03, -0.03, 0.06]].map(([ph, y, zz, sz]) => { const s = K.sparkle(0xffffff, sz); s.userData = { at: V(0.078, 0.07 + y, zz), ph, size: sz }; na.userData.a.add(s); return s; });
      const kn = add(K.knife()); kn.rotation.y = Math.PI / 2; kn.scale.setScalar(0.55);
      const fe = add(K.ingot(M.metal(0x7b8088, 0.42), 0.24, 0.07, 0.12)), rs = add(K.rockSalt(0.12));
      const tg = add(K.tongs(0.55)); tg.rotation.y = Math.PI / 2;
      const spark = add(K.sparkle(0xfff4d0, 0.12)), lines = [0, 1, 2].map(() => add(K.sparkle(0xffe2a0, 0.06)));
      const lNa = tag('sodium', 0.05, '#ffffff', NAB, 0.3, 0.1), lShiny = tag('shiny inside', 0.05, '#ffffff', NAB - 0.05, 0.3, 0.1), lDull = tag('air dulls it at once', 0.05, '#e0dcd4', NAB, 0.3, 0.1);
      const lReact = tag('very reactive ✓', 0.055, '#ffd9b8', NAB, 0.3, 0.1);
      const lRs = tag('rock salt', 0.05, '#ffffff', RSX, 0.3, 0.1), lComb = tag('sodium + chlorine', 0.05, '#ffe7c8', RSX, 0.3, 0.1), lBoth = tag('both found combined ✓', 0.055, '#ffe7c8', RSX - 0.05, 0.3, 0.1);
      const lFe = tag('iron', 0.05, '#ffffff', FEB, 0.26, 0.1), lNo = tag('no cut ✗', 0.055, '#ffffff', FEB, 0.26, 0.1);
      const lSoft = tag('sodium: soft', 0.05, '#ffe7c8', NAB - 0.04, 0.3, 0.1), lHard = tag('iron: hard', 0.05, '#dfe5ee', FEB + 0.02, 0.26, 0.1);
      beats.push((t) => {
        // the knife: comes down over the sodium (lifts first), slices, the halves part, the cut face turns and shines … then dulls
        const c0 = b(2.2), up = Math.sin(Math.PI * span(t, c0, c0 + 0.3)) * 0.06, cut = easeIn(span(t, c0 + 0.3, c0 + 0.75));
        const k0 = h(2.4), press = Math.sin(Math.PI * span(t, k0 + 0.6, k0 + 1.4)), slip = ease(span(t, k0 + 0.9, k0 + 1.3));
        if (t < H0) {
          kn.visible = t > c0 - 0.8 && t < c0 + 2.6;
          kn.position.set(NAB, lerp(0.9, 0.17, ease(span(t, c0 - 0.8, c0))) + up - 0.165 * cut + 0.3 * ease(span(t, c0 + 1.4, c0 + 2.0)) + 1.0 * easeIn(span(t, c0 + 2.0, c0 + 2.6)), 0.24);
        } else {                                                            // on the iron: down, presses, slips off the top, lifts away
          kn.visible = t > k0 - 0.8 && t < k0 + 3.2;
          kn.position.set(FEB + 0.03 * Math.sin(t * 40) * press, lerp(0.9, 0.075, ease(span(t, k0 - 0.8, k0 + 0.1))) + 0.004 * press + 0.06 * slip + 1.0 * easeIn(span(t, k0 + 2.4, k0 + 3.2)), 0.24 + 0.05 * slip);
        }
        na.userData.split(t > c0 + 0.74); na.userData.open(ease(span(t, c0 + 0.75, c0 + 1.2))); na.userData.a.rotation.y = -1.0 * ease(span(t, c0 + 0.9, c0 + 1.8));
        const tar = ease(span(t, b(5.6), b(7.8)));
        shine.color.copy(fresh).lerp(dull, tar); shine.metalness = 0.3 * (1 - tar); shine.roughness = lerp(0.2, 0.95, tar); shine.clearcoat = 1 - tar;
        nStars.forEach((s) => { s.position.copy(s.userData.at); twinkle(s, t, c0 + 1.4, s.userData.ph, s.userData.size); if (tar > 0.4) s.visible = false; });
        // the rock salt, then the iron bar, carried in by the tongs
        const r1 = carry(rs, tg, t, b(10.8), V(RSX, 0, 0.05), 0.07), r2 = carry(fe, tg, t, h(0.3), V(FEB, 0, 0.05), 0.065);
        tg.visible = r1 || r2;
        // sparks where steel meets steel
        spark.visible = press > 0.2; spark.position.set(FEB, 0.08, 0.12); spark.scale.setScalar(0.12 * press);
        lines.forEach((s, i) => { const u = ((t - k0) * 2.2 + i / 3) % 1; s.visible = press > 0.2; s.position.set(FEB + (i - 1) * 0.06 * u, 0.08 + 0.08 * u, 0.12 + 0.03 * u); s.scale.setScalar(0.06 * (1 - u)); });
        K.popIn(lNa, t, b(0.4), c0 - 0.2); K.popIn(lShiny, t, c0 + 1.5, b(5.4)); K.popIn(lDull, t, b(5.8), b(8.4)); K.popIn(lReact, t, b(8.7), b(10.6));
        K.popIn(lRs, t, b(12.2), b(14.0)); K.popIn(lComb, t, b(14.3), b(17.2)); K.popIn(lBoth, t, b(17.5), BEND);
        K.popIn(lFe, t, h(1.6), k0 + 1.4); K.popIn(lNo, t, k0 + 1.6, h(6.6)); K.popIn(lSoft, t, h(7.0), HEND); K.popIn(lHard, t, h(7.6), HEND);
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Why is gold found pure, but sodium never?', intro: INTRO, ticks: TICKS,
      rows: [[0, 'table salt · gold'], [1, 'where the metals are'], [1, 'metals give e⁻, non-metals take e⁻'], [1, 'IA alkali, IIA alkaline earth, VIIA halogens'],
        [1, 'very reactive: found combined'], [1, 'sodium soft, iron hard'], [1, 'noble metals: precious']],
      short: ['metals', 'give, take', 'families', 'combined', 'soft, hard', 'noble'] }));
    beats.push(() => { const nar = Math.min(1, (cam.aspect / 1.5) ** 0.7); tags.forEach((l) => { if (l.visible) l.scale.multiplyScalar(cam.position.distanceTo(l.position) * 2 * TAN * l.userData.frac * nar / 0.1); }); });

    return (t, dt) => { for (const bt of beats) bt(t, dt); };
  },
};
