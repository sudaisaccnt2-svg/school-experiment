// Lesson 402 · Valence Electrons & Types of Bonds (book p. 94: 4.1.2 the orbital concept, Scientific Information
// "valence electrons / valence shell", 4.2 Chemical bond, 4.3 Types of bonds). v1 as a code lesson (2026-11-04),
// replacing the old Blender film. Built from SKILL.md §0 + §1 + §4; tools shared with 401 in u4kit.js.
// THE QUESTION (book p.92 intro: "In how many ways do they form bonds?") → card, docked panel, five ticks:
//   valence electrons · bonding / non-bonding · sigma and pi · form, change, break · four types.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: salt, a glass of water, a coil of copper wire (+ a bottle of ammonia and a jar of chlorine, named
//         when they are used) · "bonds hold each of them together" → card.
//  VAL    push to the chlorine jar, "Which electrons make the bonds?" → dive INTO it: a chlorine atom 2,8,7 · its outer
//         ring flashes "outer shell: the valence shell" · its 7 outer electrons are counted "7 valence electrons" · a
//         second chlorine atom glides in, one electron from each meets between them (gold) "bonding electrons ✓" · the
//         other six of each pair up and glow "non-bonding electrons (lone pairs)" · ✓ ✓.
//  ORB    (same dark place) "Another picture: orbitals" (4.1.2) · two orbitals, each one electron lapping inside it
//         beside its nucleus · they meet end to end, the overlap glows "end to end: sigma bond ✓" · they turn upright and
//         meet side by side, overlaps above and below glow "side by side: pi bond ✓" · ✓.
//  FORM   (4.2) baked table: a jar of hydrogen upside down on a jar of chlorine, a glass plate between · names held ·
//         tongs pull the plate · "nothing yet…" · the sun lamp is switched on, its beam hits the jars · bang: flash, jolt,
//         the yellow-green is gone · "a new compound forms ✓" → dive INTO the jars: H–H and Cl–Cl, their bonds break,
//         the atoms swap partners, two H–Cl form "old bonds break, new bonds form ✓" (the bond is rearranged).
//  BREAK  "And when a compound breaks down?" · baked table: water in a beaker with two carbon rods, a battery · the loose
//         wire is lowered onto the battery · bubbles rise at both rods "water breaks down ✓" → dive INTO the bubbles:
//         two H₂O, their bonds break, H₂ + H₂ + O₂ leave "its bonds are broken ✓" · ✓ form, change, break.
//  END    the first table: each thing gets its bond type on it, one at a time: salt "ionic", water "covalent",
//         ammonia "dative (co-ordinate)", copper "metallic" · "Four types of bond ✓" · ✓.
// Game (🎮 Bond Sorter, docs/COVERAGE_U4.md): the definitions (valence shell, bonding / non-bonding electrons, chemical
//   bond), sigma vs pi, the four types.
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U4.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, rest, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, SAX = HKX - 0.9, WGX = HKX - 0.38, CUX = HKX + 0.1, AMX = HKX + 0.5, CJX = HKX + 0.92;   // salt · water · copper · ammonia · chlorine jar
const RXX = 12, ELX = 24;                                                // hydrogen + chlorine in sunlight · water + electricity
const CLX = 40, ORX = 52, HCX = 64, WDX = 76;                            // (dark) chlorine atoms · orbitals · H₂ + Cl₂ · water breaks

// ---------------------------------------------------------------- time
const T = { card: 11.0 };
const DOCK = T.card + 5.0;
const V0 = 15.4, VD = 19.8, O0 = 39.8, R0 = 62.4, RD = 76.4, B0 = 89.6, BD = 102.4, E0 = 113.6;
T.done = E0 + 15.0;
const INTRO = [T.card, DOCK];
const TICKS = [[VD + 10.8, 0], [VD + 16.4, 1], [O0 + 17.6, 2], [BD + 7.4, 3], [E0 + 10.2, 4]];
const DARK = [[VD, R0], [RD, B0], [BD, E0]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [5.6, 9.6, 'Bonds hold each of them together', [HKX - 0.3, 0.66, 0.05]],
  [V0 + 0.2, V0 + 2.6, 'Which electrons make the bonds?', [CJX - 0.1, 0.66, 0.05]],
  [V0 + 2.6, VD - 0.3, 'Look inside the chlorine gas', [CJX, 0.62, 0.05]],
  [O0 - 2.6, O0 + 0.4, 'Another picture: orbitals', [ORX, AY + 1.0, 0]],
  [O0 + 19.2, R0 - 0.2, 'Bonds also form, change and break', [ORX, AY + 1.0, 0]],
  [B0 - 3.0, B0 - 0.2, 'And when a compound breaks down?', [HCX, AY + 1.05, 0]],
  [E0 + 10.4, T.done, 'Four types: ionic, covalent, dative, metallic ✓', [HKX, 0.66, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX + 0.01, 0.26, 0.05], 2.35 * k, 0.8 * k, ADIR, e);
const BN = (t, x, w, h, y, k = 1, e) => S(t, [x, y, 0.05], w * k, h * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const JAR = [CJX, 0.3, 0.02], RJ = [RXX, 0.5, 0.02], BUB = [ELX - 0.05, 0.2, 0.02];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), S(V0 + 2.2, JAR, 0.5, 0.7), S(VD - 1.2, JAR, 0.38, 0.56), DIVE(VD - 0.05, JAR),
  DK(VD, CLX, 3.0, 2.0, 0.3), DK(VD + 1.8, CLX, 3.0, 2.0, 1.04, 'out'), DK(VD + 8.0, CLX + 0.6, 3.4, 2.0, 1.0), DK(O0 - 0.05, CLX + 0.6, 3.4, 2.0, 0.96),
  DK(O0, ORX, 4.2, 1.9, 1.04), DK(R0 - 0.05, ORX, 4.2, 1.9, 0.96),
  BN(R0, RXX, 1.5, 1.15, 0.52, 1.05), BN(RD - 2.4, RXX, 1.5, 1.15, 0.52, 0.97), S(RD - 1.2, RJ, 0.3, 0.32), DIVE(RD - 0.05, RJ),
  DK(RD, HCX, 3.4, 2.0, 0.3), DK(RD + 1.8, HCX, 3.4, 2.0, 1.04, 'out'), DK(B0 - 0.05, HCX, 3.4, 2.0, 0.96),
  BN(B0, ELX, 1.3, 0.85, 0.3, 1.05), BN(B0 + 4.0, ELX, 1.3, 0.85, 0.3, 1.0), BN(B0 + 7.4, ELX - 0.05, 0.72, 0.56, 0.24), BN(BD - 1.4, ELX - 0.05, 0.62, 0.5, 0.22), DIVE(BD - 0.05, BUB),
  DK(BD, WDX, 3.6, 2.0, 0.3), DK(BD + 1.8, WDX, 3.6, 2.0, 1.04, 'out'), DK(E0 - 0.05, WDX, 3.6, 2.0, 0.96),
  HK(E0, 1.04), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '402', { dark, AY }), { beats, ST, add, tag, grp, keyLight, goldE, blueE, fatom, ringFlash } = U;
    const ball = (r, col) => K.solid(new THREE.SphereGeometry(r, 32, 20), M.gloss(col));
    /** a ball with its element letter on the front */
    const atomBall = (el, r) => { const g = new THREE.Group(); g.add(ball(r, K.ATOM[el][0])); const l = K.label(el, r * 1.15, el === 'H' ? '#1b2030' : '#ffffff', 800); l.position.z = r + 0.005; l.renderOrder = 22; g.add(l); return g; };
    /** a bond stick between two balls (a grey rod), set(a, b, k): k = how much of it is there */
    const stick = () => { const m = K.solid(new THREE.CylinderGeometry(0.035, 0.035, 1, 16), M.gloss(0xd8dde4), { outline: false }); U.root.add(m); m.userData.set = (a, b, k) => { m.visible = k > 0.02; m.position.copy(a).lerp(b, 0.5); m.scale.set(Math.max(1e-4, k), a.distanceTo(b), Math.max(1e-4, k)); m.quaternion.setFromUnitVectors(V(0, 1, 0), b.clone().sub(a).normalize()); }; return m; };

    // ================================================================ HOOK / END · salt, water, copper (+ ammonia, chlorine)
    {
      U.stage((t) => t < VD - 0.05 || t >= E0 - 0.05); ST.bake(U.root, 'hook', HKX + 0.04, 2.6, 1.0);
      const salt = add(K.rockSalt(0.22), SAX, 0, 0);
      add(K.beaker(0.14, 0.32), WGX, 0, 0); const wl = add(K.liquid(0.135, 0.23, 0x3d9ee6, 0.55), WGX, 0.052, 0);
      const cu = add(K.ribbonCoil(0.1, 8, M.metal(0xc8743a, 0.28)), CUX, 0, 0);
      const am = add(K.glassBottle(1.35), AMX, 0, 0);
      const jar = add(K.gasJar(0x9ee030, 0.14, 0.5), CJX, 0, 0); jar.userData.gas.opacity = 0.1; const wisp = K.gasCloud(0x9ee030, 10); jar.add(wisp);
      const lS = tag('salt', 0.05, '#ffffff', SAX, 0.38, 0.08), lW = tag('water', 0.05, '#9fd2ff', WGX, 0.46, 0.08), lC = tag('copper wire', 0.05, '#ffc9a0', CUX, 0.34, 0.08);
      const lJ = tag('chlorine gas', 0.05, '#d8f590', CJX, 0.64, 0.08);
      const types = [['ionic bond', SAX, 0.38], ['covalent bond', WGX, 0.46], ['ammonia: dative bond', AMX - 0.02, 0.56], ['metallic bond', CUX, 0.34]].map(([s, x, y]) => tag(s, 0.05, '#ffd27a', x, y, 0.1));
      beats.push((t) => {
        wl.userData.top.position.y = 0.23 + 0.003 * Math.sin(t * 2.1); wisp.userData.update(t, 0.08, 0.42, 0.1, 1);
        salt.rotation.y = 0.2; cu.rotation.y = 0.5;
        K.popIn(lS, t, 0.5, V0); K.popIn(lW, t, 2.1, V0); K.popIn(lC, t, 3.7, V0); lJ.visible = false;
        types.forEach((l, i) => K.popIn(l, t, E0 + 0.6 + 2.4 * i, E0 + 2.9 + 2.4 * i));
      });
    }

    // ================================================================ VAL (dark) · chlorine's valence electrons: bonding and non-bonding
    {
      U.stage((t) => t >= VD - 0.05 && t < O0 - 0.05); keyLight(CLX + 0.6);
      const A = fatom([2, 8, 7], 17, 18, { r0: 0.26, dr: 0.24, nr: 0.13, slots: [2, 8, 8], skip: [undefined, undefined, 4], a0: [Math.PI / 2, Math.PI / 2, 0] });
      const B = fatom([2, 8, 7], 17, 18, { r0: 0.26, dr: 0.24, nr: 0.13, slots: [2, 8, 8], skip: [undefined, undefined, 0], a0: [Math.PI / 2, Math.PI / 2, 0] });
      add(A.g, CLX, AY, 0); add(B.g, CLX + 3.2, AY, 0.015);
      const aOut = A.es.filter((x) => x.s === 2), bOut = B.es.filter((x) => x.s === 2), RO = 0.74, D = 1.2;   // atoms 1.2 apart: their outer rings overlap
      const lVs = tag('outer shell: the valence shell', 0.055, '#ffd27a', CLX, AY + 1.0, 0.1), l7 = tag('7 valence electrons', 0.06, '#ffffff', CLX, AY + 1.0, 0.1);
      const lBond = tag('bonding electrons ✓', 0.06, '#ffd27a', CLX + D / 2, AY - 1.0, 0.1), lNon = tag('non-bonding electrons (lone pairs) ✓', 0.055, '#ffffff', CLX + D / 2, AY + 1.02, 0.1);
      const F1 = VD + 1.4, C0 = VD + 3.8, IN0 = VD + 7.8, IN1 = IN0 + 2.4, PR = IN1 - 0.4, LP = VD + 13.6;
      // pairs: in the molecule each atom keeps 3 lone pairs (top, bottom, outside) and gives 1 electron to the bond
      const lone = (side) => [[1.3, 1.62], [-1.3, -1.62], [side > 0 ? 0.2 : Math.PI - 0.2, side > 0 ? -0.2 : Math.PI + 0.2]].flat();
      beats.push((t) => {
        const tm = rest(t, VD + 2.6, VD + 3.6); A.update(tm); B.update(rest(t, IN1 - 1.0, IN1));
        const x = lerp(CLX + 3.2, CLX + D, ease(span(t, IN0, IN1))); B.g.position.x = x;
        ringFlash(A.rings[2], bump(t, F1, 0.9));
        aOut.forEach((e, i) => e.e.scale.setScalar(1 + 0.8 * bump(t, C0 + 0.25 * i)));
        const pr = ease(span(t, PR, PR + 1.0)), lp = ease(span(t, LP - 0.8, LP + 0.2)), mid = V(D / 2, 0, 0.008);
        const LA = lone(-1), LB = lone(1);
        aOut.forEach((e, i) => { if (i === 0) { e.to = mid.clone().add(V(0, 0.05, 0)); e.u = pr; } else { e.to = A.pt(RO, LA[i - 1]); e.u = lp; } e.e.material = i === 0 && t > PR + 1.0 ? goldE : blueE; });
        bOut.forEach((e, i) => { const last = i === bOut.length - 1;   // skip 0 → its gap faces A; its electron at slot 4 (angle π) gives the bond
          if (e.a0 === Math.PI) { e.to = mid.clone().sub(V(D, 0.05, 0.015)); e.u = pr; e.e.material = t > PR + 1.0 ? goldE : blueE; }
          else { const k = bOut.filter((z) => z.a0 !== Math.PI).indexOf(e); e.to = B.pt(RO, LB[k]); e.u = lp; } void last; });
        K.popIn(lVs, t, F1 + 0.2, C0 - 0.1); K.popIn(l7, t, C0 + 1.9, IN0 + 0.6); K.popIn(lBond, t, PR + 1.1, LP - 0.4); K.popIn(lNon, t, LP + 0.4, O0 - 2.8);
      });
    }

    // ================================================================ ORB (dark) · two orbitals overlap: end to end (sigma), side by side (pi)
    {
      U.stage((t) => t >= O0 - 0.05 && t < R0 - 0.05); keyLight(ORX);
      const lobeM = new THREE.MeshPhysicalMaterial({ color: 0x6fb4ff, transparent: true, opacity: 0.28, roughness: 0.3, depthWrite: false, side: THREE.DoubleSide });
      const orbital = () => {
        const g = new THREE.Group(), nuc = K.nucleus(3, 3, 0.16); g.add(nuc);
        const L = 0.42, W = 0.24, lobes = [-1, 1].map((s) => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), lobeM); m.scale.set(L, W, W); m.position.x = s * (L + 0.02); m.renderOrder = 3; g.add(m); return m; });
        const e = U.electron(); g.add(e);
        g.userData.update = (t) => { const a = t * 2.2; e.position.set(0.8 * Math.sin(a), 0.11 * Math.sin(2 * a) + 0.06 * Math.cos(a), 0.09 * Math.cos(2 * a)); };   // laps inside both lobes, beside the nucleus
        g.userData.lobes = lobes; return g;
      };
      const A = add(orbital(), ORX - 1.1, AY, 0), B = add(orbital(), ORX + 1.1, AY, 0.012);
      const glowA = add(K.glowSprite(0xffc04d, 0.5), ORX, AY, 0.1), glowB = [add(K.glowSprite(0xffc04d, 0.42), ORX, AY + 0.4, 0.1), add(K.glowSprite(0xffc04d, 0.42), ORX, AY - 0.4, 0.1)];
      const lOne = tag('each orbital: one electron', 0.055, '#9fc8ff', ORX, AY + 0.62, 0.1);
      const lSig = tag('end to end: sigma bond ✓', 0.065, '#ffd27a', ORX, AY + 0.62, 0.1), lPi = tag('side by side: pi bond ✓', 0.065, '#ffd27a', ORX, AY + 1.0, 0.1);
      const S0 = O0 + 3.2, S1 = S0 + 2.4, AP = O0 + 9.2, UP = AP + 1.6, P0 = UP + 1.6, P1 = P0 + 2.4;
      beats.push((t) => {
        A.userData.update(t); B.userData.update(t + 1.3);
        const sx = lerp(1.1, 0.74, ease(span(t, S0, S1))), apart = ease(span(t, AP, AP + 1.4)), side = ease(span(t, P0, P1));
        const half = t < AP ? sx : t < P0 ? lerp(0.74, 0.9, apart) : lerp(0.9, 0.17, side);
        A.position.x = ORX - half; B.position.x = ORX + half;
        const turn = ease(span(t, UP, UP + 1.4)) * Math.PI / 2; A.rotation.z = turn; B.rotation.z = turn;
        const gs = span(t, S1 - 0.1, S1 + 0.5) * (1 - span(t, AP, AP + 0.6)); glowA.material.opacity = 0.9 * gs * (0.85 + 0.15 * Math.sin(t * 6)); glowA.visible = gs > 0.01;
        const gp = span(t, P1 - 0.1, P1 + 0.5); glowB.forEach((g) => { g.material.opacity = 0.85 * gp * (0.85 + 0.15 * Math.sin(t * 6)); g.visible = gp > 0.01; });
        K.popIn(lOne, t, O0 + 0.8, S0 - 0.1); K.popIn(lSig, t, S1 + 0.4, AP + 0.2); K.popIn(lPi, t, P1 + 0.5, O0 + 19.0);
      });
    }

    // ================================================================ FORM · hydrogen on chlorine, the plate pulled, sunlight: bang
    {
      U.stage((t) => t >= R0 - 0.05 && t < RD - 0.05); ST.bake(U.root, 'react', RXX, 1.7, 0.9);
      const JR = 0.12, JH = 0.42;
      const lo = add(K.gasJar(0x9ee030, JR, JH), RXX, 0, 0); lo.userData.gas.opacity = 0; const wisp = K.gasCloud(0x9ee030, 14); lo.add(wisp);
      const hi = add(K.gasJar(0xffffff, JR, JH), RXX, 2 * JH + 0.05, 0); hi.rotation.x = Math.PI; hi.children.slice(1).forEach((o) => { o.visible = false; });
      const cover = lo.userData.lid, c0 = cover.position.clone();
      
      const beamM = new THREE.MeshBasicMaterial({ color: 0xffe6a8, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
      const beam = add(new THREE.Mesh(new THREE.ConeGeometry(0.2, 2.2, 32, 1, true).translate(0, -1.1, 0), beamM)); beam.renderOrder = 7;
      const SUN = V(RXX - 0.7, 1.5, 0.1), AT = V(RXX, JH + 0.06, 0.02); beam.position.copy(SUN); beam.quaternion.setFromUnitVectors(V(0, -1, 0), AT.clone().sub(SUN).normalize()); beam.scale.set(1, AT.distanceTo(SUN) / 2.2, 1);
      const tg = add(K.tongs(0.4)); tg.rotation.x = Math.PI / 2;
      const flash = add(K.glowSprite(0xffffff, 1.0), RXX, JH, 0.2), puff = add(K.smoke(10, 0xf4f4f0), RXX, JH, 0.05); puff.scale.setScalar(0.1);
      const lH = grp(tag('hydrogen', 0.05, '#ffffff', RXX, 1.5 * JH + 0.05, 0.16), 'jars'), lC = grp(tag('chlorine', 0.05, '#d8f590', RXX, 0.5 * JH, 0.16), 'jars');
      const lNot = tag('nothing yet…', 0.045, '#c9d0db', RXX + 0.05, JH + 0.03, 0.2), lSun = tag('sunlight', 0.045, '#ffe08a', RXX - 0.36, 1.02, 0.15);
      const lRes = tag('a new compound forms ✓', 0.055, '#ffffff', RXX, JH + 0.03, 0.2);
      const PULL = R0 + 2.8, SON = R0 + 6.4, BANG = SON + 1.2;
      beats.push((t) => {
        const inU = ease(span(t, PULL, PULL + 0.7)), pull = ease(span(t, PULL + 0.9, PULL + 1.5)), away = easeIn(span(t, PULL + 1.6, PULL + 2.3));
        const grip = V(RXX, JH + 0.026, JR + 0.04); tg.visible = t > PULL && t < PULL + 2.3;
        tg.position.copy(grip).add(V(0, 0, 0.6 * (1 - inU) + 0.32 * pull)).add(V(0, 1.2 * away, 0.15 * away)); tg.userData.set(inU < 1 ? 0.05 : 0.016);
        cover.position.set(c0.x, c0.y + 1.2 * away, c0.z + 0.32 * pull + 0.15 * away); cover.visible = away < 0.99;
        const drop = ease(span(t, PULL + 1.5, PULL + 1.7)), mix = ease(span(t, PULL + 1.6, PULL + 3.0)), gone = ease(span(t, BANG, BANG + 0.5));
        hi.position.y = 2 * JH + 0.05 - 0.022 * drop + 0.07 * Math.sin(Math.PI * span(t, BANG, BANG + 0.5));
        wisp.userData.update(t, 0.07, lerp(JH - 0.04, 2 * JH - 0.02, mix), JR - 0.02, 1 - gone); lo.userData.gas.opacity = 0.12 * (1 - gone);
        const on = ease(span(t, SON, SON + 0.4)); beamM.opacity = 0.32 * on * (1 - 0.6 * span(t, BANG + 1.0, BANG + 2.0));
        const b = t > BANG && t < BANG + 1.6 ? Math.exp(-(t - BANG) * 2.6) : 0; flash.visible = b > 0.01; flash.material.opacity = b; flash.scale.setScalar(0.6 + 1.4 * (1 - b));
        const jolt = b * 0.012 * Math.sin(t * 80); lo.position.x = RXX + jolt; hi.position.x = RXX - jolt;
        puff.visible = t > BANG && t < BANG + 3; puff.userData.update(t - BANG, (1 - span(t, BANG + 1.5, BANG + 3)) * 0.9);
        K.popIn(lH, t, R0 + 0.6, PULL - 0.1); K.popIn(lC, t, R0 + 0.6, PULL - 0.1); K.popIn(lNot, t, PULL + 2.4, SON - 0.1); K.popIn(lSun, t, SON + 0.1, BANG - 0.1); K.popIn(lRes, t, BANG + 1.0, RD);
      });
    }

    // ================================================================ HCl (dark) · H–H and Cl–Cl break, the atoms swap, two H–Cl form
    {
      U.stage((t) => t >= RD - 0.05 && t < B0 - 0.05); keyLight(HCX);
      const at = (el, r) => add(atomBall(el, r));
      const h1 = at('H', 0.16), h2 = at('H', 0.16), c1 = at('Cl', 0.3), c2 = at('Cl', 0.3), s1 = stick(), s2 = stick(), n1 = stick(), n2 = stick();
      const lB = tag('their bonds break', 0.055, '#ffffff', HCX, AY + 0.95, 0.1), lN = tag('new bonds form: 2 HCl ✓', 0.065, '#ffd27a', HCX, AY - 0.95, 0.1);
      const lStart = grp(tag('hydrogen H₂', 0.05, '#ffffff', HCX - 0.9, AY + 0.82, 0.1), 'st'), lStart2 = grp(tag('chlorine Cl₂', 0.05, '#d8f590', HCX - 0.2, AY - 0.92, 0.1), 'st');
      const BR = RD + 3.6, SW0 = BR + 1.0, SW1 = SW0 + 2.2;
      // start: H–H on top left, Cl–Cl below; end: H–Cl on the left and H–Cl on the right
      const START = { h1: V(HCX - 0.75, AY + 0.42, 0), h2: V(HCX - 0.25, AY + 0.42, 0), c1: V(HCX - 0.95, AY - 0.42, 0), c2: V(HCX - 0.15, AY - 0.42, 0) };
      const END = { h1: V(HCX - 0.95, AY + 0.12, 0), c1: V(HCX - 0.5, AY + 0.12, 0), h2: V(HCX + 0.55, AY + 0.12, 0), c2: V(HCX + 1.0, AY + 0.12, 0) };
      beats.push((t) => {
        const u = ease(span(t, SW0, SW1)), lift = 0.35;
        h1.position.copy(K.arc(START.h1, END.h1, lift, u)); h2.position.copy(K.arc(START.h2, END.h2, lift, u)); c1.position.copy(K.arc(START.c1, END.c1, -lift, u)); c2.position.copy(K.arc(START.c2, END.c2, -lift, u));
        const br = 1 - ease(span(t, BR, BR + 0.6)), nb = ease(span(t, SW1 - 0.2, SW1 + 0.4));
        s1.userData.set(h1.position, h2.position, br); s2.userData.set(c1.position, c2.position, br); n1.userData.set(h1.position, c1.position, nb); n2.userData.set(h2.position, c2.position, nb);
        [h1, h2, c1, c2].forEach((b) => { b.position.y += 0.02 * Math.sin(t * 1.7 + b.position.x * 3) * (1 - u) * (1 - span(t, BR - 0.5, BR)); });
        K.popIn(lStart, t, RD + 0.6, BR - 0.2); K.popIn(lStart2, t, RD + 0.6, BR - 0.2); K.popIn(lB, t, BR, SW1 - 0.2); K.popIn(lN, t, SW1 + 0.4, B0 - 3.2);
      });
    }

    // ================================================================ BREAK · water + electricity: bubbles at both rods
    {
      U.stage((t) => t >= B0 - 0.05 && t < BD - 0.05); ST.bake(U.root, 'water', ELX, 1.5, 0.85);
      const BKX = ELX - 0.05, BTX = ELX + 0.48, RL = [-0.06, 0.06];
      add(K.beaker(0.15, 0.3), BKX, 0, 0); const wl = add(K.liquid(0.145, 0.22, 0x3d9ee6, 0.55), BKX, 0.052, 0);
      const rods = RL.map((dx) => add(K.solid(new THREE.CylinderGeometry(0.012, 0.012, 0.36, 16), M.matte(0x22252b, 0.55)), BKX + dx, 0.24, 0));
      const bat = add(K.battery(), BTX, 0, 0); bat.scale.setScalar(0.42);
      const TOPY = 0.42 * 0.835 + 0.018;
      add(K.wire([[BKX + RL[0], 0.42, 0], [BKX + RL[0] - 0.02, 0.5, 0], [BKX + 0.2, 0.52, -0.04], [BTX, 0.06, -0.12], [BTX, 0.02, -0.06]], 0x2c2f36, 0.007));
      const hang = add(new THREE.Group(), BTX, TOPY, 0);
      const wT = K.wire([[0, 0, 0], [-0.02, 0.07, 0], [-0.16, 0.18, 0], [BKX + RL[1] - BTX + 0.02, 0.2, 0], [BKX + RL[1] - BTX, 0.42 - TOPY + 0.0, 0]], 0xb8442f, 0.007); hang.add(wT);
      const bub = RL.map((dx) => add(K.bubbles(18, V(0, 0.08, 0), 0.27, 0.03, 0.016), BKX + dx, 0, 0));
      const lWa = grp(tag('water', 0.045, '#9fd2ff', BKX, 0.44, 0.1), 'w'), lBa = grp(tag('battery', 0.045, '#ffffff', BTX, 0.52, 0.08), 'w');
      const lWi = tag('wire touches', 0.045, '#ffd27a', BTX, 0.5, 0.1), lRes = tag('water breaks down ✓', 0.05, '#ffffff', BKX - 0.05, 0.47, 0.12);
      const DOWN = B0 + 3.0, ON = DOWN + 0.8;
      beats.push((t) => {
        wl.userData.top.position.y = 0.22 + 0.003 * Math.sin(t * 2.3);
        const d = 1 - ease(span(t, DOWN, DOWN + 0.8)); hang.position.y = TOPY + 0.08 * d; hang.rotation.z = -0.1 * d;
        const r = ease(span(t, ON, ON + 1.0)); bub.forEach((b, i) => { b.visible = r > 0.01; b.userData.update(t + i, r); });
        rods.forEach((o) => { o.visible = true; });
        K.popIn(lWa, t, B0 + 0.4, DOWN - 0.1); K.popIn(lBa, t, B0 + 0.4, DOWN - 0.1); K.popIn(lWi, t, DOWN - 0.05, ON + 0.9); K.popIn(lRes, t, ON + 2.4, BD);
      });
    }

    // ================================================================ WATER BREAKS (dark) · two H₂O → two H₂ and one O₂
    {
      U.stage((t) => t >= BD - 0.05 && t < E0 - 0.05); keyLight(WDX);
      const mk = (el, r) => add(atomBall(el, r));
      const O1 = mk('O', 0.24), O2 = mk('O', 0.24), H = [mk('H', 0.15), mk('H', 0.15), mk('H', 0.15), mk('H', 0.15)];
      const st = Array.from({ length: 4 }, () => stick()), nw = Array.from({ length: 3 }, () => stick());
      const A0 = (k) => V(WDX - 0.8 + 1.6 * k, AY + 0.15, 0);
      const HP = (k, s) => A0(k).clone().add(V(s * 0.3, -0.26, 0));
      const END = { o1: V(WDX - 0.24, AY - 0.45, 0), o2: V(WDX + 0.24, AY - 0.45, 0), h: [V(WDX - 1.25, AY + 0.55, 0), V(WDX - 0.85, AY + 0.55, 0), V(WDX + 0.85, AY + 0.55, 0), V(WDX + 1.25, AY + 0.55, 0)] };
      const lW = tag('two water molecules', 0.055, '#9fd2ff', WDX, AY + 0.82, 0.1), lB = tag('its bonds are broken ✓', 0.065, '#ffd27a', WDX, AY + 1.0, 0.1);
      const lP = grp(tag('hydrogen H₂', 0.05, '#ffffff', WDX - 1.05, AY + 0.85, 0.1), 'pr'), lO = grp(tag('oxygen O₂', 0.05, '#ff9f8f', WDX, AY - 0.9, 0.1), 'pr');
      const BR = BD + 3.2, MV0 = BR + 0.5, MV1 = MV0 + 2.2;
      beats.push((t) => {
        const u = ease(span(t, MV0, MV1));
        O1.position.copy(K.arc(A0(0), END.o1, -0.2, u)); O2.position.copy(K.arc(A0(1), END.o2, -0.2, u));
        H.forEach((h, i) => h.position.copy(K.arc(HP(i >> 1, i % 2 ? 1 : -1), END.h[i], 0.3, u)));
        const br = 1 - ease(span(t, BR, BR + 0.6)), nb = ease(span(t, MV1 - 0.2, MV1 + 0.4));
        st[0].userData.set(O1.position, H[0].position, br); st[1].userData.set(O1.position, H[1].position, br); st[2].userData.set(O2.position, H[2].position, br); st[3].userData.set(O2.position, H[3].position, br);
        nw[0].userData.set(H[0].position, H[1].position, nb); nw[1].userData.set(H[2].position, H[3].position, nb); nw[2].userData.set(O1.position, O2.position, nb);
        K.popIn(lW, t, BD + 0.6, BR - 0.1); K.popIn(lB, t, MV0 + 0.9, MV1 + 0.9); K.popIn(lP, t, MV1 + 1.0, E0); K.popIn(lO, t, MV1 + 1.0, E0);
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'In how many ways do atoms bond?', dockTitle: 'Bonds', intro: INTRO, ticks: TICKS,
      rows: [[0, 'salt, water, copper: all held by bonds'], [1, 'valence electrons do it'], [1, 'bonding and non-bonding electrons'], [1, 'orbitals overlap: sigma and pi'], [1, 'bonds form, change and break'], [1, 'four types of bond']],
      short: ['valence electrons', 'bonding · non-bonding', 'sigma · pi', 'form · change · break', 'four types'] }));
    return U.finish();
  },
};
