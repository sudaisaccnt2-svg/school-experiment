// Lesson 407 · Dative (Coordinate) Bond (book pp. 102–104: Example 4.2 + Practice 4.2 (atoms, molecules, ions), 4.3.3
// Coordinate covalent bond or dative bond: donor, acceptor, the arrow, (i) ammonium ion NH₄⁺ Fig. 4.11, (ii) the addition
// compound of NH₃ and BCl₃ Fig. 4.12). v1 as a code lesson (2026-11-04), replacing the old Blender film. SKILL.md.
// THE QUESTION (book p.103: "electrons shared … do not come from both bonding atoms"): "What if one atom gives both
//   electrons?" → card, docked panel, four ticks: a dative bond · NH₄⁺ · NH₃ + BCl₃ · atoms, molecules, ions.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a bottle of ammonia and a bottle of hydrochloric acid, a little apart (names held) · both stoppers
//         are lifted · invisible fumes drift out, where they meet a white smoke forms "white smoke: ammonium chloride ✓"
//         · "What holds it together?" → card → dive INTO the white smoke.
//  NH₄⁺   (dark) ammonia: nitrogen with three hydrogen atoms (three shared pairs) and one pair of its own "a lone pair"
//         (gold) · a hydrogen ion from the acid comes in: a nucleus with an empty ring "H⁺: no electrons" · nitrogen's
//         lone pair moves between them "both electrons from nitrogen: a dative bond ✓" · "donor: nitrogen" /
//         "acceptor: H⁺" · a gold arrow from N to H "the arrow: donor → acceptor" · the atoms become the ball model in
//         brackets with + "[NH₄]⁺ ✓" · ✓ ✓.
//  BCl₃   (dark) a boron trichloride molecule: boron with only 6 outside, an empty place glows "boron: 2 short" ·
//         ammonia comes in, its lone pair moves to boron, a gold arrow N → B "an addition compound ✓" · ✓.
//  EX     Example 4.2: three bins (uncombined atoms · molecules · ions) · five cards drop in: Ne, O₂, NO₂, KCl, Na₂O · ✓.
//  END    the bottles and the white smoke: "One atom gives both: a dative bond ✓".
// Game (🎮 Bond Builder, docs/COVERAGE_U4.md): Practice 4.2 (H₂, He, HCl, HgO), coordinate covalent compounds, the
//   electron-rich / electron-deficient words.
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U4.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, rest, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, AMX = HKX - 0.5, HCX = HKX + 0.5;                         // hook: ammonia · hydrochloric acid
const NHX = 40, BCX = 52, EXX = 64;                                      // (dark) NH₄⁺ · NH₃ + BCl₃ · Example 4.2 bins

// ---------------------------------------------------------------- time
const T = { open: 3.6, meet: 6.4, card: 12.0 };
const DOCK = T.card + 5.0;
const ND = DOCK + 3.4, BC0 = ND + 24.0, EX0 = BC0 + 13.4, BACK = EX0 + 11.4;
T.done = BACK + 7.0;
const INTRO = [T.card, DOCK];
const TICKS = [[ND + 13.6, 0], [ND + 21.4, 1], [BC0 + 11.0, 2], [EX0 + 9.4, 3]];
const DARK = [[ND, BACK]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [10.0, T.card, 'What holds it together?', [HKX, 0.62, 0.05]],
  [DOCK + 0.2, ND - 0.3, 'Look inside the white smoke', [HKX, 0.56, 0.05]],
  [BC0 - 0.1, BC0 + 2.2, 'Boron trichloride, BCl₃', [BCX, AY + 1.0, 0]],
  [EX0 + 0.1, EX0 + 2.2, 'Example 4.2: atoms, molecules or ions?', [EXX, AY + 1.0, 0]],
  [BACK + 0.6, T.done, 'One atom gives both: a dative bond ✓', [HKX, 0.62, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX, 0.3, 0.05], 1.4 * k, 0.72 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const SMOKE = [HKX, 0.44, 0.02];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), S(DOCK + 1.8, SMOKE, 0.4, 0.36), DIVE(ND - 0.05, SMOKE),
  DK(ND, NHX, 2.9, 2.4, 0.3), DK(ND + 1.8, NHX, 2.9, 2.4, 1.04, 'out'), DK(BC0 - 0.05, NHX, 2.9, 2.4, 0.97),
  DK(BC0, BCX, 3.2, 1.9, 1.03), DK(EX0 - 0.05, BCX, 3.2, 1.9, 0.97),
  DK(EX0, EXX, 4.9, 2.0, 1.03), DK(BACK - 0.05, EXX, 4.9, 2.0, 0.97),
  HK(BACK, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '407', { dark, AY }), { beats, ST, add, tag, grp, keyLight, goldE, blueE, fatom, ringFlash } = U;
    const grow = (o, t, t0, t1 = 1e9) => { const u = t < t1 ? back(span(t, t0, t0 + 0.5)) : 1 - ease(span(t, t1, t1 + 0.35)); o.visible = u > 0.01; o.scale.setScalar(Math.max(1e-4, u)); };
    const shrink = (atoms, t, t0) => { const k = ease(span(t, t0, t0 + 0.8)); atoms.forEach((a) => a.g.scale.setScalar(Math.max(1e-4, 1 - k))); };
    const arrow = (len = 0.3) => { const g = new THREE.Group(), m = M.glow(0xffc04d, 1.8); const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, len, 12).rotateZ(Math.PI / 2), m); sh.position.x = len / 2; const hd = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.09, 16).rotateZ(-Math.PI / 2), m); hd.position.x = len + 0.04; g.add(sh, hd); return g; };

    // ================================================================ HOOK / END · ammonia meets hydrochloric acid: white smoke
    {
      U.stage((t) => t < ND - 0.05 || t >= BACK - 0.05); ST.bake(U.root, 'hook', HKX, 1.8, 0.9);
      const am = add(K.reagentBottle(0xe6eef6, 0.34, 0.085, 'NH₃'), AMX, 0, 0), hc = add(K.reagentBottle(0xeef2e2, 0.34, 0.085, 'HCl'), HCX, 0, 0);
      const st = [am.userData.stopper, hc.userData.stopper], st0 = st.map((s) => s.position.clone());
      const smoke = add(K.smoke(14, 0xf6f6f2), HKX, 0.34, 0.02); smoke.scale.setScalar(0.12);
      const lA = grp(tag('ammonia', 0.05, '#ffffff', AMX, 0.52, 0.1), 'b'), lH = grp(tag('hydrochloric acid', 0.05, '#ffffff', HCX - 0.05, 0.52, 0.1), 'b');
      const lOpen = tag('stoppers off', 0.045, '#ffd27a', HKX, 0.6, 0.1), lW = tag('white smoke: ammonium chloride ✓', 0.05, '#ffffff', HKX, 0.66, 0.12);
      beats.push((t) => {
        st.forEach((s, i) => {                                           // each stopper is lifted out and laid on the table beside its bottle
          const u = ease(span(t, T.open + 0.3 * i, T.open + 0.3 * i + 1.0)), side = i ? 1 : -1, end = V(st0[i].x + side * 0.17, 0.03, st0[i].z + 0.06);
          s.position.copy(K.arc(st0[i], end, 0.12, u)); s.rotation.z = -side * (Math.PI / 2) * ease(span(u, 0.3, 1));
        });
        const k = ease(span(t, T.meet, T.meet + 3.0)); smoke.visible = t > T.meet - 0.1; smoke.userData.update(t - T.meet, k * (0.8 + 0.2 * Math.sin(t)));
        K.popIn(lA, t, 0.5, T.open - 0.2); K.popIn(lH, t, 0.5, T.open - 0.2); K.popIn(lOpen, t, T.open, T.meet + 0.4); K.popIn(lW, t, T.meet + 1.4, 10.0);
      });
    }

    // ================================================================ NH₄⁺ (dark) · nitrogen's lone pair goes to H⁺: a dative bond
    {
      U.stage((t) => t >= ND - 0.05 && t < BC0 - 0.05); keyLight(NHX);
      const NP = V(NHX - 0.15, AY, 0), N = fatom([2, 5], 7, 7, { r0: 0.26, dr: 0.28, nr: 0.12, a0: [Math.PI / 2, Math.PI / 2] }); add(N.g, NP.x, NP.y, NP.z);
      const HA = [Math.PI / 2, Math.PI, 3 * Math.PI / 2], DH = 0.8;
      const Hs = HA.map((a) => { const p = NP.clone().add(V(Math.cos(a) * DH, Math.sin(a) * DH * Math.cos(N.tilt), Math.sin(a) * DH * Math.sin(N.tilt) + 0.015)); const h = fatom([1], 1, 0, { a0: [a + Math.PI], r0: 0.34, nr: 0.3 }); add(h.g, p.x, p.y, p.z); return { h, p, a }; });
      const shs = Hs.map(({ h, p }) => U.sharer(N, NP, h, p, 1, { lone: false }));
      const used = new Set(shs.flatMap((x) => x.shared[0])), lone = N.es.filter((e) => e.s === 1 && !used.has(e));
      const RO = lone[0].R, HPp = NP.clone().add(V(DH, 0, 0.015)), hp = fatom([0], 1, 0, { r0: 0.34, nr: 0.3 }); add(hp.g);
      const hpRing = hp.rings[0];                                        // its empty ring (no electrons)
      const MID = NP.clone().lerp(HPp, 0.5).sub(NP), arr = add(arrow(0.3)); arr.position.set(NHX + 0.02, AY + 0.28, 0.06);
      const mol = add(U.ballMol([['N', 0, 0], ['H', 0, 0.42], ['H', -0.42, 0], ['H', 0, -0.42], ['H', 0.42, 0]], [[0, 1], [0, 2], [0, 3], [0, 4]]), NHX - 0.15, AY, 0);
      const br = add(new THREE.Group(), NHX - 0.15, AY, 0), bm = M.glow(0xffd27a, 1.2);
      [-1, 1].forEach((sd) => { const bar = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.1, 0.02), bm); bar.position.x = sd * 0.68; br.add(bar); [-1, 1].forEach((v) => { const cap = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.02, 0.016), bm); cap.position.set(sd * 0.6325, v * 0.545, 0); br.add(cap); }); });
      const plus = K.label('+', 0.22, '#ffd27a', 800); plus.position.set(0.82, 0.56, 0); br.add(plus);
      const lAm = tag('ammonia: three shared pairs', 0.05, '#ffffff', NHX - 0.15, AY - 1.05, 0.1), lLP = tag('a lone pair', 0.055, '#ffd27a', NHX + 0.25, AY + 0.62, 0.1);
      const lHp = tag('H⁺ from the acid: no electrons', 0.045, '#ff9f8f', NHX + 0.25, AY - 0.66, 0.1);
      const lDat = tag('both from nitrogen: a dative bond ✓', 0.05, '#ffd27a', NHX - 0.1, AY + 1.05, 0.1);
      const lDA = grp(tag('donor: N', 0.05, '#ffffff', NHX - 0.55, AY - 1.05, 0.1), 'da'), lDA2 = grp(tag('acceptor: H⁺', 0.05, '#ff9f8f', NHX + 0.65, AY - 1.05, 0.1), 'da');
      const lArr = tag('the arrow: donor → acceptor', 0.05, '#ffd27a', NHX, AY + 1.05, 0.1), lIon = tag('[NH₄]⁺: the ammonium ion ✓', 0.055, '#ffffff', NHX - 0.15, AY - 1.0, 0.1);
      const SH = ND + 1.6, LP = ND + 4.2, IN0 = ND + 6.6, IN1 = IN0 + 2.0, DAT = IN1 + 0.4, ARR = DAT + 6.4, MB = ARR + 3.0;
      beats.push((t) => {
        N.update(rest(t, ND + 0.4, ND + 1.4)); Hs.forEach(({ h }) => h.update(rest(t, ND + 0.4, ND + 1.4)));
        shs.forEach((x) => x.set(1)); shs.flatMap((x) => [...x.shared[0], ...x.shared[1]]).forEach((e) => { e.u = ease(span(t, ND + 0.2, SH)); });
        hp.g.position.copy(NP).add(V(lerp(2.2, DH, ease(span(t, IN0, IN1))), 0, 0.015));
        const d = ease(span(t, DAT, DAT + 1.2));
        lone.forEach((e, i) => { const home = N.pt(RO, (i ? 0.16 : -0.16)), inLens = MID.clone().add(V(0, (i ? 1 : -1) * 0.05, 0.008)); e.to = home.lerp(inLens, d); e.u = ease(span(t, LP - 0.8, LP)); e.e.material = t > LP ? goldE : blueE; });
        grow(arr, t, ARR, MB);
        shrink([N, ...Hs.map((x) => x.h), hp], t, MB); hpRing.visible = t < MB + 0.8; grow(mol, t, MB + 0.4); grow(br, t, MB + 0.8);
        K.popIn(lAm, t, ND + 0.8, LP - 0.1); K.popIn(lLP, t, LP + 0.2, IN0 - 0.1); K.popIn(lHp, t, IN0 + 0.4, DAT - 0.1); K.popIn(lDat, t, DAT + 1.3, DAT + 4.0);
        K.popIn(lDA, t, DAT + 4.1, ARR - 0.1); K.popIn(lDA2, t, DAT + 4.1, ARR - 0.1); K.popIn(lArr, t, ARR + 0.4, MB - 0.1); K.popIn(lIon, t, MB + 1.2, BC0);
      });
    }

    // ================================================================ BCl₃ (dark) · ammonia gives its lone pair to boron: an addition compound
    {
      U.stage((t) => t >= BC0 - 0.05 && t < EX0 - 0.05); keyLight(BCX);
      const BP = V(BCX - 0.5, AY, 0), bcl = add(U.ballMol([['B', 0, 0], ['Cl', 0, 0.5], ['Cl', -0.5, 0], ['Cl', 0, -0.5]], [[0, 1], [0, 2], [0, 3]]), BP.x, BP.y, BP.z);
      const nh3 = add(U.ballMol([['N', 0, 0], ['H', 0.36, 0.3], ['H', 0.36, -0.3], ['H', 0.46, 0]], [[0, 1], [0, 2], [0, 3]]), 0, 0, 0);
      const gap = add(K.glowSprite(0xffd27a, 0.28)), pair = [U.electron(true), U.electron(true)]; pair.forEach((e) => add(e));
      const arr = add(arrow(0.28)); arr.rotation.z = Math.PI;
      const lB = tag('boron: 6 outside, 2 short', 0.05, '#ffd27a', BCX - 0.5, AY - 0.82, 0.1), lN = tag('ammonia: a lone pair', 0.05, '#ffffff', BCX + 0.45, AY - 0.95, 0.1);
      const lAdd = tag('N → B: an addition compound ✓', 0.055, '#ffd27a', BCX, AY + 0.82, 0.1);
      const IN0 = BC0 + 3.6, IN1 = IN0 + 2.0, GO = IN1 + 0.4;
      beats.push((t) => {
        const x = lerp(BCX + 1.9, BCX + 0.32, ease(span(t, IN0, IN1))); nh3.position.set(x, AY, 0.01);
        const g = span(t, BC0 + 1.4, BC0 + 1.8) * (1 - span(t, GO + 0.8, GO + 1.2)); gap.visible = g > 0.01; gap.material.opacity = 0.8 * g; gap.position.set(BP.x + 0.24, AY, 0.05);
        const mv = ease(span(t, GO, GO + 1.0));
        pair.forEach((e, i) => { e.visible = t > IN0 - 0.6; const from = V(x - 0.22, AY + (i ? 0.05 : -0.05), 0.08), to = V(lerp(x - 0.22, BP.x + 0.3, 0.5), AY + (i ? 0.05 : -0.05), 0.08); e.position.copy(from.lerp(to, mv)); });
        grow(arr, t, GO + 1.2); arr.position.set(x - 0.1, AY + 0.16, 0.06);
        K.popIn(lB, t, BC0 + 2.3, IN0 - 0.1); K.popIn(lN, t, IN0 + 0.4, GO - 0.1); K.popIn(lAdd, t, GO + 1.4, EX0);
      });
    }

    // ================================================================ EX (dark) · Example 4.2: atoms, molecules or ions
    {
      U.stage((t) => t >= EX0 - 0.05 && t < BACK - 0.05); keyLight(EXX);
      const BIN = [EXX - 1.55, EXX, EXX + 1.55], BW = 1.1, BY = AY - 0.6;
      BIN.forEach((x) => { const g = add(new THREE.Group(), x, BY, 0), m = M.matte(0x262b35, 0.7); [[BW - 0.03, 0.04, 0.47, 0, 0, 0], [0.04, 0.4, 0.5, -BW / 2, 0.2, 0], [0.04, 0.4, 0.5, BW / 2, 0.2, 0], [BW - 0.07, 0.37, 0.04, 0, 0.19, -0.225]].forEach(([w, h, d, x0, y0, z0]) => { const b = K.solid(new THREE.BoxGeometry(w, h, d), m); b.position.set(x0, y0, z0); g.add(b); }); });
      const names = ['single atoms', 'molecules', 'ions'].map((s, i) => grp(tag(s, 0.04, ['#ffffff', '#9fc8ff', '#ffd27a'][i], BIN[i], BY - 0.22, 0.3), 'ex'));
      const CARDS = [['Ne', 0], ['O₂', 1], ['NO₂', 1], ['KCl', 2], ['Na₂O', 2]], cnt = [0, 0, 0];
      const tiles = CARDS.map(([s, b], i) => { const k = cnt[b]++, tl = add(K.tile(s, [0x5a6070, 0x3d6fb4, 0xb07a2a][b], 0.46, 0.28, 0.06)); tl.traverse((o) => { if (o.userData.text !== undefined) o.userData.group = 'ex'; }); return { tl, slot: V(BIN[b] + ((k % 2) - (b === 0 ? 0 : 0.5)) * 0.5, BY + 0.19, 0.05), t0: EX0 + 2.6 + i * 1.3 }; });
      beats.push((t) => {
        names.forEach((l) => K.popIn(l, t, EX0 + 0.4, BACK));
        tiles.forEach(({ tl, slot, t0 }) => { const u = span(t, t0, t0 + 0.7), top = V(EXX, AY + 0.95, 0.1); tl.visible = t > t0 - 0.4; tl.position.copy(t < t0 ? top : K.arc(top, slot, 0.2, easeIn(u))); tl.scale.setScalar(Math.max(1e-4, back(span(t, t0 - 0.4, t0)))); tl.position.y += 0.03 * Math.sin(Math.PI * span(t, t0 + 0.7, t0 + 0.95)); });
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'What if one atom gives both electrons?', dockTitle: 'Dative', intro: INTRO, ticks: TICKS,
      rows: [[0, 'ammonia + acid: white ammonium chloride'], [1, 'one atom gives the pair: a dative bond'], [1, 'NH₃ + H⁺ → NH₄⁺'], [1, 'NH₃ + BCl₃: an addition compound'], [1, 'Example 4.2: atoms, molecules, ions']],
      short: ['a dative bond', 'NH₄⁺', 'NH₃ + BCl₃', 'atoms · molecules · ions'] }));
    return U.finish();
  },
};
