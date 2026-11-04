// Lesson 414 · Key Points: How Atoms Hold Together (book p.117, Key Points of Unit 4). v1 as a code lesson (2026-11-04),
// replacing the old Blender film (12 stations, one per bullet). Built from SKILL.md §0 + §1 + §4 (tools: u4kit.js).
// THE QUESTION (book p.117, first point: "The attractive force which holds the atoms together … is called a chemical
//   bond"): "What holds atoms together?" → card, docked panel, eleven ticks, one per key point, each answered by a
//   picture INSIDE one of five things on the table (the student already met every picture in lessons 401–413).
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: salt, a glass of water, air in a balloon, a bottle of ammonia, copper wire (named one at a time)
//         · "What holds each one together?" → card → "Look inside the salt" → dive INTO the salt.
//  SALT   (dark) sodium 2,8,1 and chlorine 2,8,7 · both outer shells glow "outer shell: valence electrons ✓" · the gold
//         electron flies to chlorine, + and − appear "given away: an ionic (electrovalent) bond ✓" · the two pull
//         together, a glow between "the pull that holds them: a chemical bond ✓" · ✓ ✓ ✓.
//  WATER  bridge "Salt gives electrons away. And water?" → dive · a big water molecule "one O, two H" · a pair of
//         electrons slides into each bond "each pair is shared: a covalent bond ✓" · an arc "104.5°: an angular shape" ·
//         the pairs slide toward O, δ− and δ+ "different atoms: a polar bond ✓" · it shrinks, four more water molecules
//         drift in "molecules pull each other: intermolecular forces" · dotted lines H…O "a hydrogen bond ✓" · ✓ ✓ ✓.
//  AIR    bridge "Water shares. And the air?" → dive into the balloon · water vapour, oxygen, nitrogen drift in one by
//         one "H–O single · O=O double · N≡N triple ✓" · O₂ alone, its 4 electrons exactly in the middle "same atoms
//         share equally: non-polar ✓" · CO₂ drifts in, a straight line through it "CO₂: linear" · ✓ ✓.
//  AMMONIA bridge → dive into the bottle · NH₃ turning "a pyramid: trigonal pyramidal ✓" (all three shapes seen) · its
//         lone pair glows · H⁺ (no electrons) drifts in, the pair moves into the new bond "N gives both: a dative
//         (coordinate) bond ✓" · ✓ ✓.
//  COPPER bridge "Last: the copper wire" → dive · copper atoms let their outer electrons go "+ ions" · "a sea of
//         electrons" · one ion held from all sides "ions held by the sea: a metallic bond ✓" · ✓.
//  END    back on the table: salt "ionic", water "covalent", copper "metallic" · "Every bond is a pull between atoms ✓".
// Game (🎮 Quiz Quest + Bond Sorter, docs/COVERAGE_U4.md): every definition again as match rounds.
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U4.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
const { M, span, ease, easeIn, back, lerp, hash } = K;
const { V, ADIR, DDIR, rest, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, SAX = HKX - 0.84, WAX = HKX - 0.42, BAX = HKX, AMX = HKX + 0.42, CUX = HKX + 0.84;   // salt · water · balloon · ammonia · copper
const SLX = 40, WTX = 52, AIX = 64, NHX = 76, CPX = 88;                                           // (dark) inside each one

// ---------------------------------------------------------------- time
const T = { card: 10.8 };
const DOCK = T.card + 5.0;
const SD = DOCK + 3.4, B1 = SD + 16.4, WD = B1 + 4.6, B2 = WD + 23.0, AD = B2 + 4.6, B3 = AD + 18.6, MD = B3 + 4.6, B4 = MD + 13.4, CD = B4 + 4.6, BACK = CD + 15.0;
T.done = BACK + 9.5;
const INTRO = [T.card, DOCK];
// salt
const VAL = SD + 3.0, HOP = SD + 6.6, HOP1 = HOP + 1.6, PULL = HOP1 + 3.8;
// water
const PAIR = WD + 2.6, ANG = WD + 7.0, POL = WD + 9.8, IMF = WD + 14.2, HB = WD + 19.2;
// air
const SDT = AD + 0.6, NP = AD + 8.6, LIN = AD + 13.8;
// ammonia
const LP = MD + 4.0, HIN = MD + 6.0, DAT = MD + 8.4;
// copper
const FREE = CD + 3.6, SEA = CD + 7.8, MB = CD + 10.6;
const TICKS = [[VAL + 2.4, 0], [HOP1 + 2.6, 1], [PULL + 3.0, 2], [PAIR + 3.2, 3], [POL + 3.2, 4], [HB + 2.2, 5], [SDT + 7.0, 6], [NP + 4.0, 7], [MD + 3.0, 8], [DAT + 3.6, 9], [MB + 3.0, 10]];
const DARK = [[SD, B1], [WD, B2], [AD, B3], [MD, B4], [CD, BACK]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [8.6, T.card, 'What holds each one together?', [HKX, 0.92, 0.05]],
  [DOCK + 0.2, SD - 0.3, 'Look inside the salt', [SAX, 0.24, 0.05]],
  [B1 + 0.4, WD - 0.3, 'Salt gives electrons away. And water?', [WAX, 0.42, 0.05]],
  [B2 + 0.4, AD - 0.3, 'Water shares. And the air?', [BAX, 0.86, 0.05]],
  [B3 + 0.4, MD - 0.3, 'And the ammonia bottle?', [AMX, 0.46, 0.05]],
  [B4 + 0.4, CD - 0.3, 'Last: the copper wire', [CUX, 0.24, 0.05]],
  [BACK + 6.0, T.done, 'Every bond is a pull between atoms ✓', [HKX, 0.92, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX, 0.36, 0.05], 2.0 * k, 0.9 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const P_SALT = [SAX, 0.04, 0.02], P_WATER = [WAX, 0.16, 0.02], P_AIR = [BAX, 0.62, 0.0], P_AM = [AMX, 0.1, 0.02], P_CU = [CUX, 0.025, 0.02];
const near = (t, p, k = 1, e) => S(t, p, 0.9 * k, 0.7 * k, ADIR, e);
/** out of one thing (cut on the motion from its dark inside), across the table to the next, push in, dive */
const hop = (B, from, to, D) => [S(B, from, 0.1, 0.08, ADIR, 'out'), near(B + 1.3, from), near(B + 3.4, to, 0.9), DIVE(D - 0.05, to)];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(DOCK + 1.8, P_SALT, 0.9), DIVE(SD - 0.05, P_SALT),
  DK(SD, SLX, 3.9, 2.2, 0.3), DK(SD + 1.8, SLX, 3.9, 2.2, 1.04, 'out'), DK(B1 - 0.05, SLX, 3.9, 2.2, 0.97),
  ...hop(B1, P_SALT, P_WATER, WD),
  DK(WD, WTX, 3.2, 2.5, 0.3), DK(WD + 1.8, WTX, 3.2, 2.5, 1.04, 'out'), DK(B2 - 0.05, WTX, 3.2, 2.5, 0.97),
  ...hop(B2, P_WATER, P_AIR, AD),
  DK(AD, AIX, 4.0, 2.0, 0.3), DK(AD + 1.8, AIX, 4.0, 2.0, 1.04, 'out'), DK(B3 - 0.05, AIX, 4.0, 2.0, 0.97),
  ...hop(B3, P_AIR, P_AM, MD),
  DK(MD, NHX, 3.0, 2.8, 0.3), DK(MD + 1.8, NHX, 3.0, 2.8, 1.04, 'out'), DK(B4 - 0.05, NHX, 3.0, 2.8, 0.97),
  ...hop(B4, P_AM, P_CU, CD),
  DK(CD, CPX, 3.2, 2.0, 0.3), DK(CD + 1.8, CPX, 3.2, 2.0, 1.04, 'out'), DK(BACK - 0.05, CPX, 3.2, 2.0, 0.97),
  S(BACK, P_CU, 0.1, 0.08, ADIR, 'out'), near(BACK + 1.4, P_CU, 1.4), HK(BACK + 3.8, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '414', { dark, AY }), { beats, ST, add, tag, grp, keyLight, goldE, blueE, fatom, ringFlash } = U;
    const grow = (o, t, t0, t1 = 1e9) => { const u = t < t1 ? back(span(t, t0, t0 + 0.5)) : 1 - ease(span(t, t1, t1 + 0.35)); o.userData.s0 ??= o.scale.clone(); o.visible = u > 0.01; o.scale.copy(o.userData.s0).multiplyScalar(Math.max(1e-4, u)); };   // keeps a label's own size and shape
    const sign = (text, h, color) => { const l = K.label(text, h, color, 800); l.renderOrder = 22; l.userData.mark = true; return l; };   // + − δ: part of the picture
    const dots = (n = 6) => { const g = new THREE.Group(), m = M.glow(0xffc04d, 1.6); for (let i = 0; i < n; i++) g.add(new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6), m)); g.userData.set = (a, b) => g.children.forEach((d, i) => d.position.copy(a).lerp(b, (i + 0.5) / n)); return g; };
    /** a water molecule with O at its origin (angle 104.5°, bond length L): its H places are in userData.H */
    const water = (L = 0.75, rO = 0.26, rH = 0.16) => {
      const hx = Math.sin(52.25 * Math.PI / 180) * L, hy = -Math.cos(52.25 * Math.PI / 180) * L, m = U.ballMol([['O', 0, 0], ['H', -hx, hy], ['H', hx, hy]], [[0, 1], [0, 2]], { r: { O: rO, H: rH } });
      m.userData.H = [V(-hx, hy, 0), V(hx, hy, 0)]; return m;
    };

    // ================================================================ HOOK / END · five things on the table
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', HKX, 2.3, 0.8);
      add(K.saltHeap(0.1, 300), SAX, 0, 0.02);
      add(K.beaker(0.11, 0.28), WAX, 0, 0); const wl = add(K.liquid(0.105, 0.2, 0x3d9ee6, 0.55), WAX, 0.052, 0);
      add(K.balloon(0x9fc8ff, 0.12), BAX, 0, 0);
      add(K.reagentBottle(0xe6eef6, 0.34, 0.085, 'NH₃'), AMX, 0, 0);
      add(K.ribbonCoil(0.07, 7, M.metal(0xc8743a, 0.28)), CUX, 0, 0);
      const ls = [['salt', '#ffffff', SAX, 0.2, 0.14], ['water', '#9fd2ff', WAX, 0.48, 0.12], ['air in a balloon', '#cfe4ff', BAX, 0.9, 0.05], ['ammonia', '#e6eef6', AMX, 0.48, 0.12], ['copper wire', '#ffc9a0', CUX, 0.2, 0.12]]
        .map(([s, c, x, y, z]) => tag(s, 0.05, c, x, y, z));
      const ends = [['ionic', '#ffd27a', SAX, 0.2, 0.14], ['covalent', '#9fc8ff', WAX, 0.48, 0.12], ['metallic', '#ffc9a0', CUX, 0.2, 0.12]].map(([s, c, x, y, z]) => grp(tag(s, 0.055, c, x, y, z), 'end'));
      beats.push((t) => {
        wl.userData.top.position.y = 0.2 + 0.003 * Math.sin(t * 2.1);
        ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 1.6, 1.9 + i * 1.6));
        ends.forEach((l) => K.popIn(l, t, BACK + 3.9, BACK + 5.8));
      });
    }

    // ================================================================ SALT (dark) · valence electrons, given away (ionic), the pull (chemical bond)
    {
      U.stage((t) => t >= SD - 0.05 && t < B1 - 0.05); keyLight(SLX);
      const NAP = V(SLX - 1.05, AY, 0), CLP = V(SLX + 1.05, AY, 0.012);
      const naA = fatom([2, 8, 1], 11, 12, { r0: 0.28, dr: 0.25, nr: 0.12, a0: [Math.PI / 2, Math.PI / 2, 0] });
      const clA = fatom([2, 8, 7], 17, 18, { r0: 0.28, dr: 0.25, nr: 0.14, slots: [2, 8, 8], skip: [undefined, undefined, 4], a0: [Math.PI / 2, Math.PI / 2, 0] });
      add(naA.g, NAP.x, NAP.y, NAP.z); add(clA.g, CLP.x, CLP.y, CLP.z);
      const naOut = naA.es.find((x) => x.s === 2), R2 = naOut.R, clOut = clA.es.filter((x) => x.s === 2);
      const fly = U.hop(naA.pt(R2, 0).add(NAP), clA.pt(R2, Math.PI).add(CLP), 0.35);
      const plus = sign('+', 0.45, '#ffffff'), minus = sign('−', 0.45, '#ffffff'); naA.g.add(plus); clA.g.add(minus); plus.position.set(0, 0.72, 0.1); minus.position.set(0, 0.97, 0.1);
      const glow = add(K.glowSprite(0xffd27a, 0.5), SLX, AY, 0.1);
      const arrows = [-1, 1].map((s) => { const m = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 12), M.glow(0xffc04d, 1.6)); m.rotation.z = s * Math.PI / 2; U.root.add(m); return { m, s }; });
      const lNames = [grp(tag('sodium', 0.055, '#d8c8ff', NAP.x, AY - 1.02, 0.1), 'nm'), grp(tag('chlorine', 0.055, '#d8f590', CLP.x, AY - 1.02, 0.1), 'nm')];
      const lVal = tag('outer shell: valence electrons ✓', 0.055, '#ffd27a', SLX, AY - 1.02, 0.1);
      const lIon = [grp(tag('given away: an ionic bond ✓', 0.055, '#ffffff', SLX, AY - 0.98, 0.1), 'ion'), grp(tag('(an electrovalent bond)', 0.042, '#ffffff', SLX, AY - 1.2, 0.1), 'ion')];
      const lPull = [grp(tag('the pull that holds them:', 0.05, '#ffd27a', SLX, AY - 0.98, 0.1), 'pull'), grp(tag('a chemical bond ✓', 0.055, '#ffd27a', SLX, AY - 1.2, 0.1), 'pull')];
      beats.push((t) => {
        const tm = rest(t, SD + 1.0, SD + 2.0); naA.update(tm); clA.update(tm);
        const v = span(t, VAL, VAL + 0.4) * (1 - span(t, HOP - 0.4, HOP));
        ringFlash(naA.rings[2], v); ringFlash(clA.rings[2], v);
        naOut.e.material = t > VAL ? goldE : blueE; naOut.e.visible = t < HOP; naOut.e.scale.setScalar(1 + 0.5 * bump(t, VAL, 0.6));
        clOut.forEach((x) => { x.e.scale.setScalar(1 + 0.5 * bump(t, VAL, 0.6)); });
        const j = ease(span(t, PULL, PULL + 1.0)) * 0.14;               // the two ions pull a little closer
        naA.g.position.x = NAP.x + j; clA.g.position.x = CLP.x - j;
        const e = fly(t, HOP, HOP1); e.position.x -= j;
        const gone = ease(span(t, HOP1 + 0.2, HOP1 + 1.0)); naA.rings[2].scale.setScalar(Math.max(1e-4, 1 - gone)); naA.rings[2].visible = gone < 1;
        grow(plus, t, HOP1 + 0.3, B1 + 1); grow(minus, t, HOP1 + 0.6, B1 + 1);
        const g = span(t, PULL + 0.4, PULL + 1.0); glow.visible = g > 0.01; glow.material.opacity = 0.75 * g * (0.85 + 0.15 * Math.sin(t * 6));
        arrows.forEach(({ m, s }) => { m.visible = t > PULL + 0.6; m.position.set(SLX + s * (0.42 - 0.04 * Math.sin(t * 4)), AY + 0.0, 0.2); });
        lNames.forEach((l) => K.popIn(l, t, SD + 0.6, VAL - 0.1));
        K.popIn(lVal, t, VAL + 0.2, HOP - 0.1); lIon.forEach((l) => K.popIn(l, t, HOP1 + 0.4, PULL - 0.1)); lPull.forEach((l) => K.popIn(l, t, PULL + 0.6, B1));
      });
    }

    // ================================================================ WATER (dark) · shared pairs, angular, polar, between molecules, H-bond
    {
      U.stage((t) => t >= WD - 0.05 && t < B2 - 0.05); keyLight(WTX);
      const C = V(WTX, AY + 0.3, 0), mol = add(water(), C.x, C.y, C.z), [H1, H2] = mol.userData.H;
      // one shared pair per bond: one electron from O, one from H, side by side across the bond
      const pairs = [H1, H2].map((h) => {
        const mid = h.clone().multiplyScalar(0.5), dir = h.clone().normalize(), perp = V(-dir.y, dir.x, 0).multiplyScalar(0.055);
        const fromO = dir.clone().multiplyScalar(0.3), fromH = h.clone().addScaledVector(dir, 0.18);
        const eO = U.electron(true), eH = U.electron(true); mol.add(eO, eH); [eO, eH].forEach((e) => { e.position.z = 0.2; });
        return { eO, eH, fromO, fromH, mid, perp, dir, len: h.length() };
      });
      const arcM = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.008, 6, 64, 104.5 * Math.PI / 180), M.glow(0xffd27a, 1.4)); arcM.rotation.z = -Math.PI / 2 - 52.25 * Math.PI / 180; arcM.position.z = 0.27; mol.add(arcM);
      const dO = sign('δ−', 0.34, '#ff9a8a'), dH = [sign('δ+', 0.3, '#ffffff'), sign('δ+', 0.3, '#ffffff')]; mol.add(dO, ...dH); dO.position.set(0, 0.42, 0.28); dH.forEach((l, i) => l.position.copy(mol.userData.H[i]).add(V(i ? 0.22 : -0.22, -0.12, 0.2)));
      // four more water molecules drift in from outside the frame: two take an H of ours, two give us an H (H…O)
      const S0 = 0.55, L0 = 0.75 * S0, HBL = 0.34, a1 = Math.atan2(-Math.cos(52.25 * Math.PI / 180), -Math.sin(52.25 * Math.PI / 180));
      const hWorld = (k) => C.clone().addScaledVector(mol.userData.H[k], S0);
      const others = [];
      [0, 1].forEach((k) => {                                          // they take our H on their O, along our O–H line
        const h = hWorld(k), u = h.clone().sub(C).normalize(), o = h.clone().addScaledVector(u, HBL);
        others.push({ at: o, rot: Math.atan2(u.y, u.x) - Math.PI / 2, from: o.clone().addScaledVector(u, 2.4), a: h, b: o });
      });
      [128, 52].forEach((deg) => {                                     // they give us one of their H (pointing at our O)
        const u = V(Math.cos(deg * Math.PI / 180), Math.sin(deg * Math.PI / 180), 0), o = C.clone().addScaledVector(u, L0 + HBL + 0.06), back_ = u.clone().negate();
        const rot = Math.atan2(back_.y, back_.x) - a1, hh = o.clone().addScaledVector(back_, L0);
        others.push({ at: o, rot, from: o.clone().addScaledVector(u, 2.4), a: hh, b: C.clone().addScaledVector(u, 0.16) });
      });
      others.forEach((x, i) => { x.m = add(water(L0, 0.26 * S0, 0.16 * S0)); x.m.rotation.z = x.rot; x.t0 = IMF + 1.0 + i * 0.9; x.d = dots(5); U.root.add(x.d); });
      const lNm = tag('water: one O, two H', 0.055, '#ffffff', WTX, AY - 1.1, 0.1);
      const lCov = tag('each pair is shared: a covalent bond ✓', 0.05, '#ffd27a', WTX, AY - 1.1, 0.1);
      const lAng = tag('104.5°: an angular shape', 0.055, '#ffd27a', WTX, AY - 1.1, 0.1);
      const lPol = tag('different atoms: a polar bond ✓', 0.055, '#ff9a8a', WTX, AY - 1.1, 0.1);
      const lImf = tag('molecules pull each other: intermolecular forces', 0.048, '#9fc8ff', WTX, AY - 1.1, 0.1);
      const lHb = tag('H to O (or N, F): a hydrogen bond ✓', 0.052, '#ffd27a', WTX, AY - 1.1, 0.1);
      beats.push((t) => {
        const sh = ease(span(t, IMF, IMF + 1.2)), s = lerp(1, S0, sh); mol.scale.setScalar(s); mol.rotation.z = 0.05 * Math.sin(t * 0.6) * (1 - sh);
        const u = ease(span(t, PAIR, PAIR + 1.0)), p = ease(span(t, POL, POL + 1.0));
        pairs.forEach(({ eO, eH, fromO, fromH, mid, perp, dir, len }) => {
          const m = mid.clone().addScaledVector(dir, -0.18 * len * p);   // polar: the pair slides toward O
          eO.position.copy(fromO.clone().lerp(m.clone().sub(perp), u)).setZ(0.2); eH.position.copy(fromH.clone().lerp(m.clone().add(perp), u)).setZ(0.2);
          [eO, eH].forEach((e) => { e.visible = t > PAIR - 0.5 && sh < 0.6; e.scale.setScalar(Math.max(1e-4, back(span(t, PAIR - 0.5, PAIR)))); });
        });
        arcM.visible = t > ANG && t < POL; arcM.scale.setScalar(Math.max(1e-4, ease(span(t, ANG, ANG + 0.6))));
        grow(dO, t, POL + 1.0, IMF); dH.forEach((l) => grow(l, t, POL + 1.3, IMF));
        others.forEach((x) => {
          const v = ease(span(t, x.t0, x.t0 + 1.3)); x.m.visible = t > x.t0; x.m.position.copy(x.from).lerp(x.at, v);
          x.d.visible = t > HB; x.d.userData.set(x.a, x.b); x.d.children.forEach((d, i) => { d.scale.setScalar(Math.max(1e-4, span(t, HB + i * 0.1, HB + i * 0.1 + 0.2))); });
        });
        K.popIn(lNm, t, WD + 0.6, PAIR + 1.0); K.popIn(lCov, t, PAIR + 1.2, ANG - 0.1); K.popIn(lAng, t, ANG + 0.4, POL - 0.1);
        K.popIn(lPol, t, POL + 1.4, IMF - 0.1); K.popIn(lImf, t, IMF + 4.6, HB - 0.1); K.popIn(lHb, t, HB + 0.6, B2);
      });
    }

    // ================================================================ AIR (dark) · single, double, triple · non-polar · CO₂ linear
    {
      U.stage((t) => t >= AD - 0.05 && t < B3 - 0.05); keyLight(AIX);
      const Y = AY + 0.15, XS = [AIX - 1.35, AIX, AIX + 1.35];
      const w = water(0.42, 0.2, 0.12), o2 = U.ballMol([['O', -0.3, 0], ['O', 0.3, 0]], [[0, 1, 2]]), n2 = U.ballMol([['N', -0.3, 0], ['N', 0.3, 0]], [[0, 1, 3]]);
      const co2 = U.ballMol([['O', -0.6, 0], ['C', 0, 0], ['O', 0.6, 0]], [[0, 1, 2], [1, 2, 2]]);
      const mols = [w, o2, n2].map((m, i) => { add(m); return { m, at: V(XS[i], Y, 0), from: V(XS[i] + 4.2, Y + 0.3, 0), t0: SDT + i * 2.0 }; });
      add(co2); w.position.y = 0;
      // O₂ alone: its 4 shared electrons sit exactly in the middle (equal sharing)
      const eq = [[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([a, b]) => { const e = U.electron(true); o2.add(e); e.position.set(a * 0.05, b * 0.06, 0.24); return e; });
      const line = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.9, 8, 1, true), M.glow(0xffd27a, 1.3)); line.rotation.z = Math.PI / 2; line.position.z = 0.25; co2.add(line);
      const lS = grp(tag('single', 0.055, '#ffffff', XS[0], Y - 0.62, 0.1), 'sdt'), lD = grp(tag('double', 0.055, '#ff9a8a', XS[1], Y - 0.62, 0.1), 'sdt'), lT = grp(tag('triple', 0.055, '#9fc8ff', XS[2], Y - 0.62, 0.1), 'sdt');
      const lNp = [grp(tag('same atoms share equally:', 0.05, '#ffd27a', AIX, Y - 0.75, 0.1), 'np'), grp(tag('a non-polar bond ✓', 0.055, '#ffd27a', AIX, Y - 0.97, 0.1), 'np')];
      const lLin = tag('CO₂: a straight line (linear)', 0.052, '#ffd27a', AIX, Y - 0.85, 0.1);
      beats.push((t) => {
        mols.forEach(({ m, at, from, t0 }, i) => {
          const v = ease(span(t, t0, t0 + 1.4)), out = ease(span(t, NP + (i === 1 ? 4.6 : 0), NP + (i === 1 ? 5.8 : 1.2)));
          const away = i === 1 ? V(AIX - 4.4, Y + 0.3, 0) : at.clone().add(V(i ? 3.6 : -3.6, 0.2, 0));
          const centre = i === 1 ? at.clone().lerp(V(AIX, Y, 0), 0) : at;
          m.visible = t > t0 && out < 1; m.position.copy(from).lerp(centre, v).lerp(away, out);
          m.rotation.z = 0.06 * Math.sin(t * 0.9 + i) * (1 - v * 0.6);
          if (i === 1) m.scale.setScalar(1 + 0.45 * ease(span(t, NP + 0.4, NP + 1.4)) * (1 - out));
        });
        eq.forEach((e) => { e.visible = t > NP + 1.2; e.scale.setScalar(Math.max(1e-4, back(span(t, NP + 1.2, NP + 1.7)) * (1 + 0.25 * Math.sin(t * 5)))); });
        const c = ease(span(t, LIN, LIN + 1.4)); co2.visible = t > LIN; co2.position.copy(V(AIX + 4.4, Y + 0.3, 0)).lerp(V(AIX, Y, 0), c); co2.scale.setScalar(1.3);
        line.visible = t > LIN + 1.6; line.scale.y = Math.max(1e-4, ease(span(t, LIN + 1.6, LIN + 2.2)));
        [lS, lD, lT].forEach((l, i) => K.popIn(l, t, mols[i].t0 + 1.3, NP - 0.1)); lNp.forEach((l) => K.popIn(l, t, NP + 1.8, LIN - 0.1)); K.popIn(lLin, t, LIN + 2.0, B3);
      });
    }

    // ================================================================ AMMONIA (dark) · a pyramid · its lone pair · H⁺ comes: a dative bond
    {
      U.stage((t) => t >= MD - 0.05 && t < B4 - 0.05); keyLight(NHX);
      const g = add(new THREE.Group(), NHX, AY - 0.1, 0); g.scale.setScalar(1.5);
      const nh3 = U.ballMol([['N', 0, 0.18], ['H', -0.42, -0.22], ['H', 0.42, -0.22], ['H', 0, -0.34, 0.25]], [[0, 1], [0, 2], [0, 3]]); g.add(nh3);
      const pair = [-1, 1].map((s) => { const e = U.electron(true); g.add(e); return { e, s }; });
      const hp = K.solid(new THREE.SphereGeometry(0.12, 28, 18), M.gloss(K.ATOM.H[0])); g.add(hp);
      const hpL = K.label('H⁺', 0.12, '#1b2030', 800); hpL.position.z = 0.125; hpL.renderOrder = 22; hpL.userData.mark = true; hp.add(hpL);
      const HP = V(0, 0.95, 0), HFROM = V(1.9, 1.7, 0), NTOP = V(0, 0.18, 0);
      const stick = K.solid(new THREE.CylinderGeometry(0.03, 0.03, 0.64, 14, 1, true), M.gloss(0xd8dde4), { outline: false }); stick.position.set(0, (0.18 + 0.95) / 2, 0); g.add(stick);
      const lPy = [grp(tag('NH₃: a pyramid', 0.055, '#ffd27a', NHX, AY - 1.12 + 0.11, 0.1), 'py'), grp(tag('(trigonal pyramidal) ✓', 0.048, '#ffd27a', NHX, AY - 1.12 - 0.11, 0.1), 'py')];
      const lLp = tag('a lone pair on nitrogen', 0.055, '#ffd27a', NHX, AY - 1.12, 0.1);
      const lH = tag('H⁺ has no electrons', 0.055, '#ffffff', NHX, AY - 1.12, 0.1);
      const lDat = [grp(tag('N gives both electrons:', 0.05, '#ffd27a', NHX, AY - 1.12 + 0.11, 0.1), 'dt'), grp(tag('a dative (coordinate) bond ✓', 0.05, '#ffd27a', NHX, AY - 1.12 - 0.11, 0.1), 'dt')];
      beats.push((t) => {
        nh3.rotation.y = 0.5 * Math.sin((t - MD) * 0.7) * (1 - ease(span(t, HIN - 0.6, HIN)));   // turning: the student sees the pyramid
        const m = ease(span(t, DAT, DAT + 0.8));
        pair.forEach(({ e, s }) => { e.visible = t > LP - 0.4; e.position.set(s * 0.055, lerp(0.45, 0.58, m), 0.06); e.scale.setScalar(Math.max(1e-4, back(span(t, LP - 0.4, LP))) * (1 + 0.4 * bump(t, LP + 0.2, 0.6))); });
        const v = ease(span(t, HIN, HIN + 1.4)); hp.visible = t > HIN; hp.position.copy(HFROM).lerp(HP, v);
        stick.visible = t > DAT + 0.6; stick.scale.y = Math.max(1e-4, ease(span(t, DAT + 0.6, DAT + 1.2)));
        lPy.forEach((l) => K.popIn(l, t, MD + 0.8, LP - 0.1)); K.popIn(lLp, t, LP + 0.2, HIN + 1.2); K.popIn(lH, t, HIN + 1.4, DAT - 0.1); lDat.forEach((l) => K.popIn(l, t, DAT + 1.2, B4));
      });
    }

    // ================================================================ COPPER (dark) · + ions in a sea of electrons: the metallic bond
    {
      U.stage((t) => t >= CD - 0.05 && t < BACK - 0.05); keyLight(CPX);
      const NX = 5, NY = 3, P = 0.5, ions = [], X0 = CPX - (NX - 1) * P / 2, Y0 = AY - (NY - 1) * P / 2 + 0.12;
      const ionM = new THREE.MeshPhysicalMaterial({ color: 0xc8743a, metalness: 0.55, roughness: 0.28, clearcoat: 0.8 });
      for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
        const c = V(X0 + i * P, Y0 + j * P, 0), b = K.solid(new THREE.SphereGeometry(0.16, 28, 18), ionM); b.position.copy(c); U.root.add(b);
        const plus = sign('+', 0.24, '#ffffff'); plus.position.copy(c).add(V(0, 0, 0.17)); U.root.add(plus);
        const e = U.electron(); U.root.add(e); ions.push({ c, plus, e, k: i + j * NX, row: j, ph: hash(i, j) * 6.28 });
      }
      const mid = ions.find((o) => o.k === 2 + NX), glow = add(K.glowSprite(0xffd27a, 0.7), mid.c.x, mid.c.y, 0.05);
      const pulls = Array.from({ length: 8 }, (_, i) => { const a = i / 8 * Math.PI * 2, m = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.08, 10), M.glow(0xffc04d, 1.6)); U.root.add(m); return { m, a }; });
      const lA = [grp(tag('copper atoms,', 0.055, '#ffc9a0', CPX, AY - 0.95 + 0.11, 0.1), 'cu'), grp(tag('each with an outer electron', 0.05, '#ffc9a0', CPX, AY - 0.95 - 0.11, 0.1), 'cu')];
      const lI = tag('they let it go: + ions', 0.055, '#ffffff', CPX, AY - 0.95, 0.1);
      const lS = tag('the electrons move freely: a sea', 0.052, '#9fc8ff', CPX, AY - 0.95, 0.1);
      const lB = tag('ions held by the sea: a metallic bond ✓', 0.05, '#ffd27a', CPX, AY - 0.95, 0.1);
      beats.push((t) => {
        ions.forEach((o) => {
          const tLeave = FREE + 0.5 * o.row + 0.08 * (o.k % NX), u = ease(span(t, tLeave, tLeave + 1.0));
          const orbit = V(Math.cos(t * 2.2 + o.ph) * 0.22, Math.sin(t * 2.2 + o.ph) * 0.22 * 0.8, Math.sin(t * 2.2 + o.ph) * 0.06);
          const gx = (((o.k * 0.61 + (t - tLeave) * 0.16 * (o.k % 2 ? 1 : -1)) % (NX - 1)) + (NX - 1)) % (NX - 1), gy = Math.min(NY - 2, o.row) + 0.5 + 0.12 * Math.sin(t * 0.8 + o.ph);
          o.e.position.copy(o.c.clone().add(orbit).lerp(V(X0 + (gx + 0.5) * P, Y0 + gy * P, 0.23), u));
          o.plus.userData.s0 ??= o.plus.scale.clone(); o.plus.visible = u > 0.6; o.plus.scale.copy(o.plus.userData.s0).multiplyScalar(Math.max(1e-4, back(span(u, 0.6, 1))));
        });
        const g = span(t, MB + 0.2, MB + 0.8); glow.visible = g > 0.01; glow.material.opacity = 0.7 * g * (0.85 + 0.15 * Math.sin(t * 6));
        pulls.forEach(({ m, a }) => { const r = 0.34 - 0.04 * Math.sin(t * 4); m.visible = t > MB + 0.8; m.position.set(mid.c.x + Math.cos(a) * r, mid.c.y + Math.sin(a) * r, 0.19); m.rotation.z = a + Math.PI / 2; });
        lA.forEach((l) => K.popIn(l, t, CD + 0.6, FREE + 0.6)); K.popIn(lI, t, FREE + 1.6, SEA - 0.1); K.popIn(lS, t, SEA + 0.2, MB - 0.1); K.popIn(lB, t, MB + 0.8, BACK);
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'What holds atoms together?', dockTitle: 'Key points', intro: INTRO, ticks: TICKS,
      rows: [[0, 'salt, water, air, ammonia, copper wire'], [1, 'outer-shell electrons: valence electrons'], [1, 'electrons given away: ionic bond'], [1, 'the pull that holds atoms: chemical bond'],
        [1, 'electron pairs shared: covalent bond'], [1, 'different atoms share: polar bond'], [1, 'between molecules: intermolecular, H-bond'], [1, 'one, two or three pairs: single, double, triple'],
        [1, 'same atoms share: non-polar bond'], [1, 'shapes: angular, linear, pyramidal'], [1, 'one atom gives the pair: dative bond'], [1, 'ions in a sea of electrons: metallic bond']],
      short: ['valence electrons', 'ionic', 'chemical bond', 'covalent', 'polar', 'between molecules', 'single · double · triple', 'non-polar', 'shapes', 'dative', 'metallic'] }));
    return U.finish();
  },
};
