// Lesson 406 · Single, Double & Triple Bonds (book pp. 99–102: 4.3.2.1 types of covalent bond: (i) single (Cl₂ Fig. 4.6,
// CH₄ Fig. 4.7), (ii) double (O₂ Fig. 4.8, CO₂ Fig. 4.9), (iii) triple (N₂ Fig. 4.10), Scientific Information: the 1.7
// electronegativity rule, Activity 4.1). v1 as a code lesson (2026-11-04), replacing the old Blender film. SKILL.md.
// THE QUESTION (book p.99: "The covalent bond is further divided into three types"): "How many pairs can two atoms
//   share?" → card, docked panel, five ticks: single · double · triple · share or hand over · Activity 4.1.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a gas burner's flame "natural gas: methane", a fizzy drink "carbon dioxide", a jar of air
//         "nitrogen and oxygen" · "How many pairs can atoms share?" → card.
//  SINGLE push to the flame, dive INTO the gas · (dark) carbon 2,4 "4 outside", four hydrogen atoms come in from the four
//         sides, four shared pairs, carbon's 8 counted "8 outside ✓", the atoms become the ball model "CH₄: four single
//         bonds ✓" (Fig. 4.7; Cl₂ Fig. 4.6 was lesson 402/405) · ✓ single.
//  DOUBLE back to the table, dive INTO the fizzy drink's bubbles · (dark) two oxygen atoms 2,6 share TWO pairs "O=O:
//         a double bond ✓" (Fig. 4.8) · carbon between two oxygens: two pairs each side, carbon's 8 counted, "O=C=O: two
//         double bonds ✓" (Fig. 4.9) · ✓ double.
//  TRIPLE back to the table, dive INTO the air · (dark) two nitrogen atoms 2,5 share THREE pairs "N≡N: a triple bond ✓"
//         (Fig. 4.10) · ✓ triple.
//  RULE   (dark) "Share or hand over?" · a ruler of the difference in electronegativity with a gold mark at 1.7 · the
//         pointer goes past 1.7 "more than 1.7: hand over → ionic", back below "less than 1.7: share → covalent" · ✓.
//  ACT    Activity 4.1: two bins, covalent and ionic · six cards drop in one by one: CO₂, NaCl, H₂O, C₆H₆, MgCl₂, HCl · ✓.
//  END    the table: "One, two or three shared pairs ✓".
// Game (🎮 Bond Builder › Double: O=O, N≡N, O=C=O; 🎮 Bond Reasons › Facts: C₂H₄, C₂H₂, N₂; 🎮 Bond Sorter: the 1.7 rule).
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U4.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, rest, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, BRX = HKX - 0.62, BTX = HKX, AJX = HKX + 0.6;             // hook: gas burner · fizzy drink · jar of air
const CHX = 40, OOX = 52, COX = 58.5, NNX = 70, RUX = 82, ACX = 94;     // (dark) CH₄ · O₂ · CO₂ · N₂ · the ruler · the bins

// ---------------------------------------------------------------- time
const T = { card: 11.0 };
const DOCK = T.card + 5.0;
const CD = DOCK + 3.8, B1 = CD + 16.6, OD = B1 + 3.2, B2 = OD + 23.4, ND = B2 + 3.2, RU0 = ND + 12.0, AC0 = RU0 + 12.4, BACK = AC0 + 13.6;
T.done = BACK + 6.6;
const INTRO = [T.card, DOCK];
const TICKS = [[CD + 15.0, 0], [OD + 22.0, 1], [ND + 10.4, 2], [RU0 + 10.2, 3], [AC0 + 11.0, 4]];
const DARK = [[CD, B1], [OD, B2], [ND, BACK]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [8.7, T.card, 'How many pairs can atoms share?', [HKX, 0.62, 0.05]],
  [DOCK + 0.2, CD - 0.3, 'Look inside the gas', [BRX, 0.72, 0.05]],
  [B1 + 0.1, OD - 0.3, 'Now the bubbles of the drink', [BTX, 0.6, 0.05]],
  [B2 + 0.1, ND - 0.3, 'And the air', [AJX, 0.66, 0.05]],
  [RU0 + 0.1, RU0 + 2.3, 'Share or hand over?', [RUX, AY + 0.8, 0]],
  [AC0 + 0.1, AC0 + 2.1, 'Activity 4.1: covalent or ionic?', [ACX, AY + 1.0, 0]],
  [BACK + 0.6, T.done, 'One, two or three shared pairs ✓', [HKX, 0.62, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX, 0.3, 0.05], 2.15 * k, 0.85 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const GAS = [BRX, 0.66, 0.02], BUB = [BTX, 0.2, 0.02], AIR = [AJX, 0.26, 0.02];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), S(DOCK + 2.0, GAS, 0.4, 0.4), DIVE(CD - 0.05, GAS),
  DK(CD, CHX, 2.6, 2.4, 0.3), DK(CD + 1.8, CHX, 2.6, 2.4, 1.04, 'out'), DK(B1 - 0.05, CHX, 2.6, 2.4, 0.97),
  HK(B1, 1.0), S(B1 + 1.8, BUB, 0.36, 0.36), DIVE(OD - 0.05, BUB),
  DK(OD, OOX, 3.2, 1.7, 0.3), DK(OD + 1.8, OOX, 3.2, 1.7, 1.04, 'out'), DK(OD + 10.0, OOX, 3.2, 1.7, 0.98),
  DK(OD + 12.0, COX, 3.6, 1.8, 1.03), DK(B2 - 0.05, COX, 3.6, 1.8, 0.97),
  HK(B2, 1.0), S(B2 + 1.8, AIR, 0.36, 0.38), DIVE(ND - 0.05, AIR),
  DK(ND, NNX, 3.2, 1.7, 0.3), DK(ND + 1.8, NNX, 3.2, 1.7, 1.04, 'out'), DK(RU0 - 0.05, NNX, 3.2, 1.7, 0.97),
  DK(RU0, RUX, 3.8, 1.6, 1.03), DK(AC0 - 0.05, RUX, 3.8, 1.6, 0.97),
  DK(AC0, ACX, 3.6, 2.0, 1.03), DK(BACK - 0.05, ACX, 3.6, 2.0, 0.97),
  HK(BACK, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '406', { dark, AY }), { beats, ST, add, tag, grp, keyLight, goldE, blueE, fatom, ringFlash } = U;
    const fires = [], shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
    const grow = (o, t, t0, t1 = 1e9) => { const u = t < t1 ? back(span(t, t0, t0 + 0.5)) : 1 - ease(span(t, t1, t1 + 0.35)); o.visible = u > 0.01; o.scale.setScalar(Math.max(1e-4, u)); };
    const shrink = (atoms, t, t0) => { const k = ease(span(t, t0, t0 + 0.8)); atoms.forEach((a) => a.g.scale.setScalar(Math.max(1e-4, 1 - k))); };
    const glowPairs = (pairs, on) => pairs.forEach((e) => { e.e.material = on ? goldE : blueE; });

    // ================================================================ HOOK / END · gas flame, fizzy drink, a jar of air
    {
      U.stage((t) => t < CD - 0.05 || (t >= B1 - 0.05 && t < OD - 0.05) || (t >= B2 - 0.05 && t < ND - 0.05) || t >= BACK - 0.05);
      ST.bake(U.root, 'hook', HKX, 2.0, 0.9);
      const brn = add(K.burner(), BRX, 0, 0); fires.push(brn.userData.flame); brn.userData.flame.scale.setScalar(0.8);
      const bot = add(K.glassBottle(1.3), BTX, 0, 0), fizz = add(K.bubbles(14, V(0, 0.04, 0), 0.2, 0.04, 0.008), BTX, 0, 0);
      const jar = add(K.gasJar(0xeef4ff, 0.13, 0.46), AJX, 0, 0); jar.userData.gas.opacity = 0.04; const wisp = K.gasCloud(0xf4f8ff, 10); jar.add(wisp);
      const l1 = tag('natural gas: methane', 0.05, '#ffffff', BRX + 0.2, 0.86, 0.08), l2 = tag('fizzy drink: carbon dioxide', 0.05, '#ffffff', BTX, 0.5, 0.12), l3 = tag('air: nitrogen and oxygen', 0.05, '#ffffff', AJX - 0.2, 0.6, 0.08);
      void bot;
      beats.push((t) => {
        fizz.userData.update(t, 0.7); wisp.userData.update(t, 0.08, 0.42, 0.11, 0.5);
        K.popIn(l1, t, 0.4, 3.2); K.popIn(l2, t, 3.3, 6.0); K.popIn(l3, t, 6.1, 8.6);
      });
    }

    // ================================================================ SINGLE (dark) · CH₄: four shared pairs round carbon
    {
      U.stage((t) => t >= CD - 0.05 && t < B1 - 0.05); keyLight(CHX);
      const C = fatom([2, 4], 6, 6, { r0: 0.26, dr: 0.28, nr: 0.12, a0: [Math.PI / 2, Math.PI / 4] }), CP = V(CHX, AY, 0); add(C.g, CP.x, CP.y, CP.z);
      const DIRS = [0, 1, 2, 3].map((k) => Math.PI / 4 + k * Math.PI / 2), DH = 0.82;
      const Hs = DIRS.map((a, k) => { const h = fatom([1], 1, 0, { a0: [a + Math.PI], r0: 0.34, nr: 0.3 }); add(h.g); return { h, a, p: CP.clone().add(V(Math.cos(a) * DH, Math.sin(a) * DH * Math.cos(C.tilt), Math.sin(a) * DH * Math.sin(C.tilt) + 0.015)) }; });
      const sh = Hs.map(({ h, p }) => U.sharer(C, CP, h, p, 1, { lone: false }));
      const mol = add(U.ballMol([['C', 0, 0], ['H', 0.42, 0.42], ['H', -0.42, 0.42], ['H', -0.42, -0.42], ['H', 0.42, -0.42]], [[0, 1], [0, 2], [0, 3], [0, 4]]), CHX, AY, 0);
      const l4 = tag('carbon: 4 outside', 0.055, '#ffffff', CHX, AY + 1.05, 0.1), lP = tag('4 shared pairs', 0.055, '#ffd27a', CHX, AY + 1.05, 0.1);
      const l8 = tag('carbon: 8 outside ✓', 0.06, '#ffd27a', CHX, AY + 1.05, 0.1), lM = tag('CH₄: four single bonds ✓', 0.06, '#ffffff', CHX, AY - 0.95, 0.1);
      const IN0 = CD + 3.4, IN1 = IN0 + 2.2, SH = IN1 - 0.2, CNT = SH + 3.2, MB = CNT + 3.6;
      beats.push((t) => {
        C.update(rest(t, CD + 1.6, CD + 2.6));
        Hs.forEach(({ h, a, p }, k) => { const d = lerp(2.4, DH, ease(span(t, IN0, IN1))); h.g.position.set(CP.x + Math.cos(a) * d, CP.y + Math.sin(a) * d * Math.cos(C.tilt), Math.sin(a) * d * Math.sin(C.tilt) + 0.015); h.update(rest(t, IN1 - 1.0, IN1)); });
        const us = ease(span(t, SH, SH + 1.0)); sh.forEach((x) => x.set(us)); glowPairs(sh.flatMap((x) => [...x.shared[0], ...x.shared[1]]), t > SH + 1.0);
        sh.flatMap((x) => [...x.shared[0], ...x.shared[1]]).forEach((e, i) => e.e.scale.setScalar(1 + 0.7 * bump(t, CNT + 0.22 * i)));
        shrink([C, ...Hs.map((x) => x.h)], t, MB); grow(mol, t, MB + 0.4); mol.rotation.y = 0.3 * Math.sin(t * 0.5) * span(t, MB + 0.6, MB + 1.6);
        K.popIn(l4, t, CD + 0.6, IN0 - 0.1); K.popIn(lP, t, SH + 1.1, CNT - 0.1); K.popIn(l8, t, CNT + 1.9, MB - 0.1); K.popIn(lM, t, MB + 0.6, B1);
      });
    }

    // ================================================================ DOUBLE (dark) · O₂ shares two pairs, CO₂ two double bonds
    {
      U.stage((t) => t >= OD - 0.05 && t < B2 - 0.05); keyLight(OOX); keyLight(COX);
      const mkO = (a0) => fatom([2, 6], 8, 8, { r0: 0.26, dr: 0.28, nr: 0.12, a0: [Math.PI / 2, a0] });
      const A = mkO(0), B = mkO(Math.PI), AP = V(OOX - 0.48, AY, 0), BP = V(OOX + 0.48, AY, 0.015); add(A.g, AP.x, AP.y, AP.z); add(B.g, BP.x, BP.y, BP.z);
      const shO = U.sharer(A, AP, B, BP, 2);
      const o2 = add(U.ballMol([['O', -0.3, 0], ['O', 0.3, 0]], [[0, 1, 2]]), OOX, AY, 0);
      // CO₂: O · C · O
      const C = fatom([2, 4], 6, 6, { r0: 0.26, dr: 0.28, nr: 0.12, a0: [Math.PI / 2, Math.PI / 4] }), CP = V(COX, AY, 0);
      const O1 = mkO(0), O2 = mkO(Math.PI), P1 = V(COX - 0.98, AY, 0.015), P2 = V(COX + 0.98, AY, 0.015);
      add(C.g, CP.x, CP.y, CP.z); add(O1.g, P1.x, P1.y, P1.z); add(O2.g, P2.x, P2.y, P2.z);
      const s1 = U.sharer(O1, P1, C, CP, 2, { lone: true }), s2 = U.sharer(C, CP, O2, P2, 2, { lone: true });
      const co2 = add(U.ballMol([['O', -0.6, 0], ['C', 0, 0], ['O', 0.6, 0]], [[0, 1, 2], [1, 2, 2]]), COX, AY, 0);
      const lO = tag('two oxygen atoms: 2, 6', 0.055, '#ff9f8f', OOX, AY - 0.85, 0.1), lD = tag('O=O: two shared pairs, a double bond ✓', 0.045, '#ffd27a', OOX, AY + 0.85, 0.1);
      const lC = grp(tag('oxygen · carbon · oxygen', 0.05, '#ffffff', COX, AY - 0.9, 0.1), 'oco'), l8 = tag('carbon: 8 outside ✓', 0.055, '#ffd27a', COX, AY + 0.9, 0.1);
      const lCO = tag('O=C=O: two double bonds ✓', 0.06, '#ffffff', COX, AY - 0.9, 0.1);
      const SO = OD + 3.4, MO = SO + 4.4, C0 = OD + 12.2, SC = C0 + 2.4, CNT = SC + 1.8, MC = CNT + 3.2;
      beats.push((t) => {
        A.update(rest(t, OD + 1.4, OD + 2.4)); B.update(rest(t, OD + 1.4, OD + 2.4));
        shO.set(ease(span(t, SO, SO + 1.0))); glowPairs([...shO.shared[0], ...shO.shared[1]], t > SO + 1.0);
        shrink([A, B], t, MO); grow(o2, t, MO + 0.4);
        [C, O1, O2].forEach((a) => a.update(rest(t, OD + 1.4, OD + 2.4)));
        const vis = t > C0 - 0.6; [C, O1, O2].forEach((a) => { a.g.visible = vis; });
        const u = ease(span(t, SC, SC + 1.0)); s1.set(u); s2.set(u); const pr = [...s1.shared[0], ...s1.shared[1], ...s2.shared[0], ...s2.shared[1]]; glowPairs(pr, t > SC + 1.0);
        [...s1.shared[1], ...s2.shared[0]].forEach((e, i) => e.e.scale.setScalar(1 + 0.7 * bump(t, CNT + 0.25 * i)));
        if (vis) { const k = 1 - ease(span(t, C0 - 0.6, C0 + 0.2)); [C, O1, O2].forEach((a) => a.g.scale.setScalar(Math.max(1e-4, 1 - k))); }
        if (t > MC) shrink([C, O1, O2], t, MC); grow(co2, t, MC + 0.4);
        K.popIn(lO, t, OD + 0.6, SO - 0.1); K.popIn(lD, t, SO + 1.1, C0 - 0.4); K.popIn(lC, t, C0 + 0.2, SC - 0.1); K.popIn(l8, t, CNT + 1.1, MC - 0.1); K.popIn(lCO, t, MC + 0.6, B2);
      });
    }

    // ================================================================ TRIPLE (dark) · N₂ shares three pairs
    {
      U.stage((t) => t >= ND - 0.05 && t < RU0 - 0.05); keyLight(NNX);
      const mkN = (a0) => fatom([2, 5], 7, 7, { r0: 0.26, dr: 0.28, nr: 0.12, a0: [Math.PI / 2, a0] });
      const A = mkN(0), B = mkN(Math.PI), AP = V(NNX - 0.48, AY, 0), BP = V(NNX + 0.48, AY, 0.015); add(A.g, AP.x, AP.y, AP.z); add(B.g, BP.x, BP.y, BP.z);
      const shN = U.sharer(A, AP, B, BP, 3, { sep: 0.1 });
      const n2 = add(U.ballMol([['N', -0.3, 0], ['N', 0.3, 0]], [[0, 1, 3]]), NNX, AY, 0);
      const lN = tag('two nitrogen atoms: 2, 5', 0.055, '#a8c4ff', NNX, AY - 0.85, 0.1), lT = tag('N≡N: three shared pairs, a triple bond ✓', 0.045, '#ffd27a', NNX, AY + 0.85, 0.1);
      const SN = ND + 3.4, MN = SN + 4.6;
      beats.push((t) => {
        A.update(rest(t, ND + 1.4, ND + 2.4)); B.update(rest(t, ND + 1.4, ND + 2.4));
        shN.set(ease(span(t, SN, SN + 1.0))); glowPairs([...shN.shared[0], ...shN.shared[1]], t > SN + 1.0);
        shrink([A, B], t, MN); grow(n2, t, MN + 0.4); n2.rotation.x = 0.4 * span(t, MN + 0.6, RU0);
        K.popIn(lN, t, ND + 0.6, SN - 0.1); K.popIn(lT, t, SN + 1.1, RU0);
      });
    }

    // ================================================================ RULE (dark) · the 1.7 rule on a ruler
    {
      U.stage((t) => t >= RU0 - 0.05 && t < AC0 - 0.05); keyLight(RUX);
      const L = 3.2, X0 = RUX - L / 2, xAt = (v) => X0 + (v / 3.2) * L;
      const share = add(K.solid(new THREE.BoxGeometry(xAt(1.7) - X0 - 0.01, 0.1, 0.12), M.gloss(0x4a86d8)), (X0 + xAt(1.7)) / 2 - 0.005, AY, 0);
      const give = add(K.solid(new THREE.BoxGeometry(X0 + L - xAt(1.7) - 0.01, 0.1, 0.12), M.gloss(0xd89a3a)), (xAt(1.7) + X0 + L) / 2 + 0.005, AY, 0);
      const mark = add(K.solid(new THREE.BoxGeometry(0.03, 0.32, 0.14), M.glow(0xffd27a, 1.6), { outline: false }), xAt(1.7), AY, 0);
      const ptr = add(K.solid(new THREE.ConeGeometry(0.07, 0.16, 20).rotateX(Math.PI), M.glow(0xffc04d, 1.4), { outline: false }), xAt(0.6), AY + 0.18, 0);
      const l17 = tag('1.7', 0.06, '#ffd27a', xAt(1.7), AY - 0.32, 0.1), lAx = tag('difference in electronegativity', 0.045, '#ffffff', RUX, AY - 0.52, 0.1);
      const lIon = tag('more than 1.7: hand over → ionic', 0.05, '#ffd27a', RUX + 0.2, AY + 0.5, 0.1), lCov = tag('less than 1.7: share → covalent', 0.05, '#9fc8ff', RUX - 0.2, AY + 0.5, 0.1);
      beats.push((t) => {
        [share, give, mark].forEach((o, i) => grow(o, t, RU0 + 2.2 + 0.25 * i));
        const v = t < RU0 + 6.6 ? lerp(0.6, 2.5, ease(span(t, RU0 + 3.4, RU0 + 4.8))) : lerp(2.5, 0.9, ease(span(t, RU0 + 6.6, RU0 + 8.0)));
        ptr.position.x = xAt(v); ptr.visible = t > RU0 + 3.0; ptr.position.y = AY + 0.18 + 0.02 * Math.sin(t * 3);
        K.popIn(l17, t, RU0 + 2.6, AC0); K.popIn(lAx, t, RU0 + 2.6, AC0); K.popIn(lIon, t, RU0 + 4.9, RU0 + 6.5); K.popIn(lCov, t, RU0 + 8.1, AC0);
        l17.userData.group = lAx.userData.group = 'axis';
      });
    }

    // ================================================================ ACT (dark) · Activity 4.1: six cards drop into two bins
    {
      U.stage((t) => t >= AC0 - 0.05 && t < BACK - 0.05); keyLight(ACX);
      const BIN = [ACX - 0.85, ACX + 0.85], BW = 1.2, BY = AY - 0.6;
      BIN.forEach((x) => { const g = add(new THREE.Group(), x, BY, 0), m = M.matte(0x262b35, 0.7); [[BW - 0.03, 0.04, 0.47, 0, 0, 0], [0.04, 0.4, 0.5, -BW / 2, 0.2, 0], [0.04, 0.4, 0.5, BW / 2, 0.2, 0], [BW - 0.07, 0.37, 0.04, 0, 0.19, -0.225]].forEach(([w, h, d, x0, y0, z0]) => { const b = K.solid(new THREE.BoxGeometry(w, h, d), m); b.position.set(x0, y0, z0); g.add(b); }); });
      const lb = [grp(tag('covalent', 0.055, '#9fc8ff', BIN[0], BY - 0.22, 0.3), 'act'), grp(tag('ionic', 0.055, '#ffd27a', BIN[1], BY - 0.22, 0.3), 'act')];
      // the cards and the bins read as one picture (one text group for the engine's oneText)
      const CARDS = [['CO₂', 0], ['NaCl', 1], ['H₂O', 0], ['C₆H₆', 0], ['MgCl₂', 1], ['HCl', 0]];
      const cnt = [0, 0], tiles = CARDS.map(([s, b], i) => { const k = cnt[b]++, tl = add(K.tile(s, b ? 0xb07a2a : 0x3d6fb4, 0.5, 0.3, 0.06), 0, 0, 0); tl.traverse((o) => { if (o.userData.text !== undefined) o.userData.group = 'act'; }); return { tl, b, slot: V(BIN[b] + ((k % 2) - 0.5) * 0.52, BY + 0.2 + Math.floor(k / 2) * 0.34, 0.05), t0: AC0 + 2.4 + i * 1.3 }; });
      beats.push((t) => {
        lb.forEach((l) => K.popIn(l, t, AC0 + 0.4, BACK));
        tiles.forEach(({ tl, slot, t0 }) => {
          const u = span(t, t0, t0 + 0.7); tl.visible = t > t0 - 0.4; const top = V(ACX, AY + 0.95, 0.1);
          tl.position.copy(t < t0 ? top : K.arc(top, slot, 0.2, easeIn(u))); tl.scale.setScalar(Math.max(1e-4, back(span(t, t0 - 0.4, t0))));
          const land = span(t, t0 + 0.7, t0 + 0.95); tl.position.y += 0.03 * Math.sin(Math.PI * land);
        });
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'How many pairs can two atoms share?', dockTitle: 'Pairs', intro: INTRO, ticks: TICKS,
      rows: [[0, 'methane, carbon dioxide, nitrogen: all covalent'], [1, 'one pair: a single bond (CH₄)'], [1, 'two pairs: a double bond (O₂, CO₂)'], [1, 'three pairs: a triple bond (N₂)'], [1, 'share or hand over: the 1.7 rule'], [1, 'Activity 4.1: covalent or ionic']],
      short: ['single', 'double', 'triple', 'the 1.7 rule', 'Activity 4.1'] }));
    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));
    return U.finish();
  },
};
