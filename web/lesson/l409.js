// Lesson 409 · Polar & Non-polar Bonds (book pp. 106–108: 4.3.4 (i) non-polar covalent bond Fig. 4.14 H₂ Cl₂, (ii) polar
// covalent bond Fig. 4.15 HCl, Scientific Information: the 0.5 rule, Fig. 4.16 H₂O 104.5° and NH₃ 107°, Test Yourself
// table). v1 as a code lesson (2026-11-04), replacing the old Blender film. Built from SKILL.md §0 + §1 + §4.
// THE QUESTION: "Why do some bonds have + and − ends?" → card, docked panel, five ticks: equal pull · HCl δ+ δ− ·
//   the 0.5 rule · H₂O and NH₃ · Test Yourself.
// HOOK (an extra beyond the book, to make polarity visible: a rubbed comb bends a thin stream of water; paid off at
//   the end by the water molecules turning their δ+ ends toward the comb).
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a burette lets a thin stream of water fall into a beaker; a comb and a wool cloth · the comb is
//         rubbed on the cloth, brought near the stream, the stream bends toward it "the stream bends ✓" · "Why does
//         water bend toward it?" → card → dive INTO the stream.
//  INSIDE (dark, one continuous trip) one water molecule · "Which atom pulls the pairs harder?" · pan to H₂: the pair
//         sits in the middle "same atoms pull equally: non-polar ✓ (H₂, Cl₂, Br₂)" · pan to HCl: the pair slides toward
//         chlorine "chlorine pulls harder" · δ+ on H, δ− on Cl "a polar bond ✓" · pan to the ruler of electronegativity
//         difference: "0.5 or less: non-polar", "more than 0.5: polar" (and the 1.7 mark from lesson 406 for ionic) ·
//         back to water: both pairs slide to oxygen, δ− O, δ+ H, 104.5° "water: polar ✓" · ammonia: δ− N, δ+ H, 107°
//         "ammonia: polar too ✓" · Test Yourself: ten cards drop into polar / non-polar bins · the comb's − edge: five
//         water molecules turn their δ+ ends toward it "the comb pulls their charged ends ✓".
//  END    the bent stream on the table: "Polar molecules: + and − ends ✓".
// Game (🎮 Bond Sorter: every pair of the table, H₂, Cl₂, HCl …; 🎮 Bond Reasons › Facts: Br₂).
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U4.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, rest, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, STX = HKX - 0.05, CLX = HKX + 0.5;                        // hook: burette over a beaker · comb and cloth
const WX = 40, H2X = 44, HCX = 48, RUX = 52, NHX = 56, BNX = 61, CBX = 66;   // dark: water · H₂ · HCl · ruler · NH₃ · bins · comb

// ---------------------------------------------------------------- time
const T = { rub: 3.0, near: 5.4, bend: 6.6, card: 12.6 };
const DOCK = T.card + 5.0;
const DV = DOCK + 3.6, H20 = DV + 7.6, HC0 = H20 + 8.6, RU0 = HC0 + 12.0, W0 = RU0 + 10.0, NH0 = W0 + 10.0, BN0 = NH0 + 8.0, CB0 = BN0 + 14.6, BACK = CB0 + 8.6;
T.done = BACK + 6.6;
const INTRO = [T.card, DOCK];
const TICKS = [[H20 + 6.0, 0], [HC0 + 9.2, 1], [RU0 + 7.6, 2], [NH0 + 5.6, 3], [BN0 + 13.2, 4]];
const DARK = [[DV, BACK]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [10.0, T.card, 'Why does water bend toward it?', [STX, 0.9, 0.05]],
  [DOCK + 0.2, DV - 0.3, 'Look inside the water', [STX, 0.56, 0.05]],
  [DV + 2.8, H20 - 0.2, 'Which atom pulls the pairs harder?', [WX, AY + 1.0, 0]],
  [RU0 + 0.1, RU0 + 2.2, 'How much harder?', [RUX, AY + 0.8, 0]],
  [BN0 + 0.1, BN0 + 2.2, 'Test Yourself: polar or non-polar?', [BNX, AY + 1.0, 0]],
  [BACK + 0.6, T.done, 'Polar molecules: + and − ends ✓', [STX, 0.9, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX + 0.15, 0.55, 0.05], 1.5 * k, 1.22 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const STREAM = [STX + 0.02, 0.34, 0.02];
const CAMS = [
  HK(0, 1.04), S(T.rub - 0.2, [CLX - 0.1, 0.12, 0.05], 0.7, 0.4), S(T.near + 0.2, [STX + 0.08, 0.4, 0.05], 0.62, 0.66), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02),
  S(DOCK + 1.8, STREAM, 0.3, 0.32), DIVE(DV - 0.05, STREAM),
  DK(DV, WX, 2.4, 2.0, 0.3), DK(DV + 1.8, WX, 2.4, 2.0, 1.04, 'out'), DK(H20 - 0.05, WX, 2.4, 2.0, 0.98),
  DK(H20, H2X, 2.4, 1.6, 1.0), DK(HC0 - 0.05, H2X, 2.4, 1.6, 0.97), DK(HC0, HCX, 2.6, 1.7, 1.0), DK(RU0 - 0.05, HCX, 2.6, 1.7, 0.97),
  DK(RU0, RUX, 3.6, 1.6, 1.0), DK(W0 - 0.05, RUX, 3.6, 1.6, 0.97), DK(W0, WX, 2.4, 2.0, 1.0), DK(NH0 - 0.05, WX, 2.4, 2.0, 0.97),
  DK(NH0, NHX, 2.4, 2.0, 1.0), DK(BN0 - 0.05, NHX, 2.4, 2.0, 0.97), DK(BN0, BNX, 3.6, 2.2, 1.0), DK(CB0 - 0.05, BNX, 3.6, 2.2, 0.97),
  DK(CB0, CBX, 2.6, 2.2, 1.0), DK(BACK - 0.05, CBX, 2.6, 2.2, 0.96),
  S(BACK, [STX + 0.08, 0.4, 0.05], 0.66, 0.7), HK(T.done, 1.0),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '409', { dark, AY }), { beats, ST, add, tag, grp, keyLight, goldE, blueE, fatom, ringFlash } = U;
    const grow = (o, t, t0, t1 = 1e9) => { const u = t < t1 ? back(span(t, t0, t0 + 0.5)) : 1 - ease(span(t, t1, t1 + 0.35)); o.visible = u > 0.01; o.scale.setScalar(Math.max(1e-4, u)); };
    const delta = (s, x, y, g, col = s.includes('+') ? '#ffb08a' : '#9fc8ff') => grp(tag(s, 0.05, col, x, y, 0.15), g);

    // ================================================================ HOOK / END · a rubbed comb bends a stream of water
    {
      const HOOK = U.stage((t) => t < DV - 0.05 || t >= BACK - 0.05); ST.bake(HOOK, 'hook', HKX + 0.1, 1.6, 0.9);
      const stand = add(K.stand(0.62, 0.26), STX - 0.22, 0, -0.05); void stand;
      const bur = add(K.burette(0.42), STX, 0.62, 0);
      add(K.beaker(0.12, 0.2), STX, 0, 0); const bl = add(K.liquid(0.115, 0.08, 0x3d9ee6, 0.55), STX, 0.052, 0);
      const cloth = add(K.woolCloth(0.16, 0.12), CLX, 0, 0.08), comb = add(K.comb(0.16));
      const streamM = new THREE.MeshPhysicalMaterial({ color: 0x7cc8ff, roughness: 0.05, transparent: true, opacity: 0.9, clearcoat: 1, emissive: 0x1a4a7a, emissiveIntensity: 0.25 }); let streamMesh = null, lastBend = -1;
      const setStream = (b) => {
        const k = Math.round(b * 50) / 50; if (k === lastBend) return; lastBend = k;
        if (streamMesh) { HOOK.remove(streamMesh); streamMesh.geometry.dispose(); }
        const pts = []; for (let i = 0; i <= 16; i++) { const u = i / 16, y = lerp(0.62, 0.14, u); pts.push(V(STX + k * 0.09 * u * u, y, 0)); }
        streamMesh = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, 0.0075, 10), streamM); streamMesh.renderOrder = 4; HOOK.add(streamMesh);
      };
      const lS = tag('a thin stream of water', 0.05, '#9fd2ff', STX + 0.2, 0.5, 0.1), lR = tag('a comb rubbed on wool', 0.05, '#ffffff', CLX, 0.2, 0.12);
      const lB = tag('the stream bends ✓', 0.055, '#ffffff', STX + 0.05, 0.72, 0.1);
      const REST = V(CLX + 0.02, 0.058, 0.1), NEAR = V(STX + 0.15, 0.32, 0.03);
      beats.push((t) => {
        bl.userData.top.position.y = 0.08 + 0.002 * Math.sin(t * 9);
        const rub = t > T.rub && t < T.near ? Math.sin((t - T.rub) * 9) : 0, up = ease(span(t, T.near, T.near + 1.1));
        const pc = REST.clone().add(V(0.05 * rub, 0.01 * Math.abs(rub), 0)).lerp(NEAR, up); comb.position.copy(pc); comb.rotation.set(0, 0, Math.PI / 2 * up);
        setStream(t >= BACK - 0.05 ? 1 : ease(span(t, T.bend, T.bend + 1.0)));
        K.popIn(lS, t, 0.4, T.rub - 0.2); K.popIn(lR, t, T.rub, T.near + 0.2); K.popIn(lB, t, T.bend + 1.2, 10.0);
        void cloth; void bur;
      });
    }

    // ================================================================ INSIDE (dark) · equal pull, unequal pull, the rule, water, ammonia
    {
      U.stage((t) => t >= DV - 0.05 && t < BACK - 0.05); [WX, H2X, HCX, RUX, NHX, BNX, CBX].forEach((x) => keyLight(x));
      // water (dot and cross), seen first, explained after the rule
      const OY = AY + 0.05, ANG = [-37.75, -142.25].map((d) => d * Math.PI / 180), DH = 0.74;
      const ox = fatom([2, 6], 8, 8, { r0: 0.28, dr: 0.28, nr: 0.13, a0: [Math.PI / 2, Math.PI / 2] }); add(ox.g, WX, OY, 0);
      const hs = ANG.map((a) => { const at = V(Math.cos(a) * DH, Math.sin(a) * DH * Math.cos(ox.tilt), Math.sin(a) * DH * Math.sin(ox.tilt) + 0.015); const h = fatom([1], 1, 0, { a0: [a + Math.PI], nr: 0.3 }); add(h.g, WX + at.x, OY + at.y, at.z); return { h, a, at }; });
      const RO = 0.56, OT = [ANG[0] + 0.12, ANG[1] - 0.12, 1.0, 1.3, 1.84, 2.14], oOut = ox.es.filter((x) => x.s === 1);
      oOut.forEach((x, i) => { x.to = ox.pt(RO, OT[i]); x.u = 1; });
      const wPair = (k, f) => { const a = ANG[k], P = lerp(0.47, 0.3, f), mid = V(Math.cos(a) * P, Math.sin(a) * P * Math.cos(ox.tilt), Math.sin(a) * P * Math.sin(ox.tilt)), side = V(-Math.sin(a), Math.cos(a), 0).multiplyScalar(0.06); oOut[k].to = mid.clone().add(side); hs[k].h.es[0].to = mid.clone().sub(side).sub(hs[k].at).add(V(0, 0, -0.015)); hs[k].h.es[0].u = 1; };
      [0, 1].forEach((k) => { oOut[k].e.material = hs[k].h.es[0].e.material = goldE; });
      const wD = [delta('δ−', WX, OY + 0.95, 'wd'), delta('δ+', WX - 0.75, OY - 0.85, 'wd'), delta('δ+', WX + 0.75, OY - 0.85, 'wd'), grp(tag('104.5°', 0.05, '#ffd27a', WX, OY - 0.62, 0.15), 'wd')];
      const lW1 = tag('one water molecule', 0.055, '#9fd2ff', WX, OY - 1.0, 0.1), lW2 = tag('water: polar, δ− O, δ+ H ✓', 0.055, '#ffffff', WX, OY + 0.95, 0.1);
      // H₂: the pair in the middle
      const A = fatom([1], 1, 0, { a0: [0], r0: 0.4, nr: 0.32 }), B = fatom([1], 1, 0, { a0: [Math.PI], r0: 0.4, nr: 0.32 }); add(A.g, H2X - 0.5, AY, 0); add(B.g, H2X + 0.5, AY, 0.015);
      [A, B].forEach((x, i) => { x.es[0].to = V(i ? -0.5 : 0.5, i ? -0.05 : 0.05, i ? -0.015 : 0); x.es[0].u = 1; x.es[0].e.material = goldE; });
      const lEq = tag('same atoms pull equally', 0.055, '#ffffff', H2X, AY + 0.72, 0.1), lNP = tag('non-polar bond ✓ (H₂, Cl₂, Br₂)', 0.055, '#ffd27a', H2X, AY - 0.75, 0.1);
      // HCl: the pair slides toward chlorine
      const h = fatom([1], 1, 0, { a0: [0], r0: 0.36, nr: 0.3 }), cl = fatom([2, 8, 7], 17, 18, { r0: 0.24, dr: 0.22, nr: 0.13, slots: [2, 8, 8], skip: [undefined, undefined, 4], a0: [Math.PI / 2, Math.PI / 2, 0] });
      const HP = V(HCX - 0.82, AY, 0.015), CP = V(HCX + 0.1, AY, 0); add(h.g, HP.x, HP.y, HP.z); add(cl.g, CP.x, CP.y, CP.z);
      const sh = U.sharer(h, HP, cl, CP, 1, { lone: true });
      const lPull = tag('chlorine pulls harder', 0.055, '#d8f590', HCX, AY + 0.95, 0.1), lPol = tag('a polar bond ✓', 0.06, '#ffd27a', HCX, AY - 0.95, 0.1);
      const hD = [delta('δ+', HP.x, AY + 0.55, 'hd'), delta('δ−', CP.x + 0.15, AY + 0.82, 'hd')];
      // the ruler: 0 … 0.5 non-polar · 0.5 … 1.7 polar · more than 1.7 ionic
      const L = 3.1, X0 = RUX - L / 2, xAt = (v) => X0 + (v / 3.2) * L;
      const seg = (a, b, c) => add(K.solid(new THREE.BoxGeometry(xAt(b) - xAt(a) - 0.012, 0.1, 0.12), M.gloss(c)), (xAt(a) + xAt(b)) / 2, AY, 0);
      const parts = [seg(0, 0.5, 0x7c8494), seg(0.5, 1.7, 0x4a86d8), seg(1.7, 3.2, 0xd89a3a)];
      const marks = [0.5, 1.7].map((v) => add(K.solid(new THREE.BoxGeometry(0.026, 0.3, 0.14), M.glow(0xffd27a, 1.5), { outline: false }), xAt(v), AY, 0));
      const lR = [grp(tag('0.5', 0.05, '#ffd27a', xAt(0.5), AY - 0.3, 0.1), 'ax'), grp(tag('1.7', 0.05, '#ffd27a', xAt(1.7), AY - 0.3, 0.1), 'ax'), grp(tag('difference in electronegativity', 0.04, '#ffffff', RUX, AY - 0.5, 0.1), 'ax')];
      const lNon = tag('0.5 or less: non-polar', 0.05, '#c9d0db', RUX - 0.4, AY + 0.45, 0.1), lPo = tag('more than 0.5: polar', 0.05, '#9fc8ff', RUX, AY + 0.45, 0.1);
      const lIo = tag('more than 1.7: ionic', 0.05, '#ffd27a', RUX + 0.3, AY + 0.45, 0.1);
      // ammonia: ball model, δ− N, δ+ H, 107°
      const nh3 = add(U.ballMol([['N', 0, 0.18], ['H', -0.42, -0.22], ['H', 0.42, -0.22], ['H', 0, -0.34, 0.25]], [[0, 1], [0, 2], [0, 3]]), NHX, AY, 0);
      const lp = [U.electron(true), U.electron(true)]; lp.forEach((e, i) => { e.position.set(NHX + (i ? 0.05 : -0.05), AY + 0.48, 0); U.root.add(e); });
      const nD = [delta('δ−', NHX + 0.3, AY + 0.55, 'nd'), delta('δ+', NHX - 0.55, AY - 0.45, 'nd'), delta('δ+', NHX + 0.55, AY - 0.45, 'nd'), grp(tag('107°', 0.05, '#ffd27a', NHX, AY - 0.08, 0.2), 'nd')];
      const lN = tag('ammonia: polar too ✓', 0.055, '#ffffff', NHX, AY - 0.95, 0.1);
      // Test Yourself: ten cards into two bins
      const BIN = [BNX - 0.9, BNX + 0.9], BW = 1.35, BY = AY - 0.7;
      BIN.forEach((x) => { const g = add(new THREE.Group(), x, BY, 0), m = M.matte(0x262b35, 0.7); [[BW - 0.03, 0.04, 0.47, 0, 0, 0], [0.04, 0.4, 0.5, -BW / 2, 0.2, 0], [0.04, 0.4, 0.5, BW / 2, 0.2, 0], [BW - 0.07, 0.37, 0.04, 0, 0.19, -0.225]].forEach(([w, hh, d, x0, y0, z0]) => { const b = K.solid(new THREE.BoxGeometry(w, hh, d), m); b.position.set(x0, y0, z0); g.add(b); }); });
      const bn = [grp(tag('polar', 0.055, '#9fc8ff', BIN[0], BY - 0.22, 0.3), 'ty'), grp(tag('non-polar', 0.055, '#c9d0db', BIN[1], BY - 0.22, 0.3), 'ty')];
      const CARDS = [['NH₃', 0], ['H₂O', 0], ['HCl', 0], ['N₂', 1], ['O₂', 1], ['CH₄', 1], ['H₂', 1], ['PH₃', 1], ['SO₂', 0], ['Cl₂', 1]], cnt = [0, 0];
      const tiles = CARDS.map(([s, b], i) => { const k = cnt[b]++, tl = add(K.tile(s, b ? 0x5a6070 : 0x3d6fb4, 0.38, 0.24, 0.05)); tl.traverse((o) => { if (o.userData.text !== undefined) o.userData.group = 'ty'; }); return { tl, slot: V(BIN[b] + ((k % 3) - 1) * 0.4, BY + 0.17 + Math.floor(k / 3) * 0.27, 0.05), t0: BN0 + 2.4 + i * 1.05 }; });
      // the comb's charged edge and five water molecules that turn their δ+ ends toward it
      const edge = add(K.comb(0.9), CBX - 1.0, AY, 0); edge.rotation.z = -Math.PI / 2; edge.scale.setScalar(1.4);
      const minus = [0, 1, 2].map((i) => grp(tag('−', 0.07, '#9fc8ff', CBX - 0.82, AY + 0.5 - 0.5 * i, 0.15), 'cb'));
      const ws = [0, 1, 2, 3, 4].map((i) => { const m = add(U.ballMol([['O', 0, 0], ['H', -0.2, -0.16], ['H', 0.2, -0.16]], [[0, 1], [0, 2]], { r: { O: 0.14, H: 0.09 } }), CBX + 0.15 + 0.5 * (i % 2), AY + 0.8 - 0.4 * i, 0.05 * i); m.userData.r0 = 0.6 + i * 0.9; return m; });
      const lC = tag('the comb pulls their δ+ ends ✓', 0.05, '#ffd27a', CBX - 0.15, AY + 1.1, 0.1);
      beats.push((t) => {
        ox.update(0); hs.forEach((x) => x.h.update(0)); A.update(0); B.update(0); h.update(0); cl.update(0);
        const wf = ease(span(t, W0 + 0.6, W0 + 1.8)); wPair(0, wf); wPair(1, wf);
        wD.forEach((l) => K.popIn(l, t, W0 + 2.2, W0 + 6.4)); K.popIn(lW1, t, DV + 0.6, DV + 2.7); K.popIn(lW2, t, W0 + 6.5, NH0 - 0.4);
        A.es[0].e.position.x += 0.0; K.popIn(lEq, t, H20 + 0.6, H20 + 3.4); K.popIn(lNP, t, H20 + 3.5, HC0 - 0.4);
        const sl = ease(span(t, HC0 + 2.0, HC0 + 3.4)); sh.set(1, 1); sh.shared.flat().forEach((e) => { e.e.material = goldE; e.to = e.to.clone().add(V(0.28 * sl, 0, 0)); });
        K.popIn(lPull, t, HC0 + 3.6, HC0 + 6.2); hD.forEach((l) => K.popIn(l, t, HC0 + 6.3, HC0 + 8.9)); K.popIn(lPol, t, HC0 + 9.0, RU0 - 0.3);
        parts.forEach((p, i) => grow(p, t, RU0 + 0.1 + 0.3 * i)); marks.forEach((m, i) => grow(m, t, RU0 + 1.0 + 0.25 * i));
        lR.forEach((l) => K.popIn(l, t, RU0 + 2.4, RU0 + 3.8)); K.popIn(lNon, t, RU0 + 3.9, RU0 + 5.7); K.popIn(lPo, t, RU0 + 5.8, RU0 + 7.8); K.popIn(lIo, t, RU0 + 7.9, W0 - 0.4);
        grow(nh3, t, NH0 + 0.4); lp.forEach((e) => { e.visible = t > NH0 + 0.8; }); nD.forEach((l) => K.popIn(l, t, NH0 + 1.4, NH0 + 4.4)); K.popIn(lN, t, NH0 + 4.5, BN0 - 0.4);
        bn.forEach((l) => K.popIn(l, t, BN0 + 0.4, CB0));
        tiles.forEach(({ tl, slot, t0 }) => { const u = span(t, t0, t0 + 0.6), top = V(BNX, AY + 1.0, 0.1); tl.visible = t > t0 - 0.4; tl.position.copy(t < t0 ? top : K.arc(top, slot, 0.2, easeIn(u))); tl.scale.setScalar(Math.max(1e-4, back(span(t, t0 - 0.4, t0)))); });
        minus.forEach((l) => K.popIn(l, t, CB0 + 0.6, BACK));
        ws.forEach((m) => { const turn = ease(span(t, CB0 + 1.4, CB0 + 3.2)); m.rotation.z = lerp(m.userData.r0, -Math.PI / 2, turn) + 0.06 * Math.sin(t * 2 + m.userData.r0); });
        K.popIn(lC, t, CB0 + 3.6, BACK);
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Why do some bonds have + and − ends?', dockTitle: 'Polar?', intro: INTRO, ticks: TICKS,
      rows: [[0, 'a rubbed comb bends a stream of water'], [1, 'same atoms pull equally: non-polar'], [1, 'chlorine pulls harder: δ+ H, δ− Cl'], [1, 'more than 0.5 difference: polar'], [1, 'water and ammonia: polar'], [1, 'Test Yourself: polar or non-polar']],
      short: ['equal pull', 'HCl: δ+ δ−', 'the 0.5 rule', 'H₂O · NH₃', 'Test Yourself'] }));
    return U.finish();
  },
};
