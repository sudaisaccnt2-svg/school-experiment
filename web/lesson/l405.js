// Lesson 405 · Covalent Bond: Sharing (book pp. 98–99: 4.3.2 Covalent bond, Fig. 4.4 H₂, Lewis's shared pair as a dash,
// localized electrons, Fig. 4.5 HCl, Society Technology and Science: glue, Example 4.1 HCl, Practice 4.1 H₂O, 4.3.2.1 (i)
// single covalent bond). v1 as a code lesson (2026-11-04), replacing the old Blender film. SKILL.md §0 + §1 + §4.
// THE QUESTION (book p.98: "How are the two hydrogen atoms bonded?") → card, docked panel, four ticks:
//   no hand-over · a shared pair · HCl and H₂O · single bond.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table (the book's glue box): a broken plate in two halves, a tube of glue · the tube is squeezed, a bead
//         of glue runs along the break, the halves are pushed together and hold "glue holds the two pieces ✓" ·
//         "What holds two hydrogen atoms together?" → card → a jar of hydrogen on the same table → dive INTO it.
//  H₂     (dark) two identical hydrogen atoms (names held) · one electron starts across, stops half way and goes back
//         "both pull the same: no hand-over" · both electrons move to the middle, a gold pair "they share a pair: a
//         covalent bond ✓" · the pair glows into a dash "the shared pair = a dash: H–H" · "the pair stays between
//         them: localized electrons" · "Non-metals share electrons" · ✓ ✓.
//  HCl    (dark) Example 4.1: hydrogen and chlorine 2,8,7 · they share one pair "bond pair ✓" · chlorine's other six
//         pair up "3 lone pairs ✓" · the atoms shrink into the ball model of Fig. 4.5 (H–Cl) · Practice 4.1: H₂O, the
//         same: "2 bond pairs, 2 lone pairs ✓" · ✓.
//  SINGLE three ball models in a row, H–H, Cl–Cl, F–F, each with one line "one shared pair: a single bond ✓" · ✓.
//  END    the glued plate again: "Atoms share a pair: the covalent bond ✓".
// Game (🎮 Bond Builder › Share: H₂, HCl, H₂O dot-and-cross; 🎮 Bond Reasons › Words: covalent bond).
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U4.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, rest, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, PLX = HKX - 0.2, TBX = HKX + 0.36, HJX = HKX + 1.05;      // hook: plate · glue tube · hydrogen jar
const H2X = 40, HCX = 52, WAX = 64, SGX = 76;                           // (dark) H₂ · HCl · H₂O · single bonds

// ---------------------------------------------------------------- time
const T = { sq: 2.8, run: 3.6, push: 6.4, card: 11.4 };
const DOCK = T.card + 5.0;
const JD = DOCK + 4.2, HC0 = JD + 25.6, WA0 = HC0 + 15.0, SG0 = WA0 + 10.6, BACK = SG0 + 10.4;
T.done = BACK + 7.0;
const INTRO = [T.card, DOCK];
const TICKS = [[JD + 6.6, 0], [JD + 11.0, 1], [WA0 + 8.4, 2], [SG0 + 7.0, 3]];
const DARK = [[JD, BACK]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [9.0, T.card, 'What holds two hydrogen atoms together?', [HKX + 0.1, 0.42, 0.05]],
  [DOCK + 0.2, JD - 0.3, 'Look inside the hydrogen', [HJX, 0.66, 0.05]],
  [JD + 20.6, HC0 - 0.2, 'Non-metals share electrons', [H2X, AY + 0.85, 0]],
  [HC0 - 0.1, HC0 + 2.0, 'Example: hydrogen chloride', [HCX, AY + 1.0, 0]],
  [WA0 - 0.1, WA0 + 2.0, 'Practice: water', [WAX, AY + 1.0, 0]],
  [BACK + 0.6, T.done, 'Atoms share a pair: the covalent bond ✓', [HKX, 0.42, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX + 0.38, 0.18, 0.05], 1.95 * k, 0.62 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const JAR = [HJX, 0.26, 0.02];
const CAMS = [
  S(0, [(PLX + TBX) / 2 + 0.02, 0.1, 0.05], 1.05, 0.46), S(T.push + 2.6, [(PLX + TBX) / 2, 0.1, 0.05], 0.95, 0.42), HK(T.card - 0.6, 1.0), HK(DOCK, 1.02),
  S(DOCK + 2.2, JAR, 0.44, 0.56), S(JD - 1.0, JAR, 0.36, 0.46), DIVE(JD - 0.05, JAR),
  DK(JD, H2X, 2.8, 1.6, 0.3), DK(JD + 1.8, H2X, 2.8, 1.6, 1.04, 'out'), DK(HC0 - 0.05, H2X, 2.8, 1.6, 0.97),
  DK(HC0, HCX, 3.2, 2.1, 1.03), DK(HC0 + 9.0, HCX, 3.2, 2.1, 1.0), DK(HC0 + 11.6, HCX - 0.2, 1.7, 1.1, 1.0), DK(WA0 - 0.05, HCX - 0.2, 1.6, 1.05, 1.0),
  DK(WA0, WAX, 2.8, 2.3, 1.03, undefined, AY - 0.2), DK(SG0 - 0.05, WAX, 2.8, 2.3, 0.97, undefined, AY - 0.2),
  DK(SG0, SGX, 4.4, 1.6, 1.03), DK(BACK - 0.05, SGX, 4.4, 1.6, 0.97),
  S(BACK, [PLX + 0.1, 0.08, 0.05], 0.85, 0.45), HK(T.done, 0.98),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '405', { dark, AY }), { beats, ST, add, tag, grp, keyLight, goldE, blueE, fatom, ringFlash } = U;
    const ball = (el, r) => { const g = new THREE.Group(); g.add(K.solid(new THREE.SphereGeometry(r, 32, 20), M.gloss(K.ATOM[el][0]))); const l = K.label(el, r * 1.1, el === 'H' ? '#1b2030' : '#ffffff', 800); l.position.z = r + 0.005; l.renderOrder = 22; g.add(l); return g; };
    const stickM = M.gloss(0xd8dde4);
    const stick = (a, b) => { const m = K.solid(new THREE.CylinderGeometry(0.03, 0.03, 1, 16), stickM, { outline: false }); m.position.copy(a).lerp(b, 0.5); m.scale.y = a.distanceTo(b); m.quaternion.setFromUnitVectors(V(0, 1, 0), b.clone().sub(a).normalize()); return m; };

    // ================================================================ HOOK / END · glue holds a broken plate (the book's STS box)
    {
      U.stage((t) => t < JD - 0.05 || t >= BACK - 0.05); ST.bake(U.root, 'hook', HKX + 0.38, 2.3, 0.9);
      const pl = add(K.brokenPlate(0.18, 0.02), PLX, 0, 0), [hl, hr] = pl.userData.halves;
      const tube = add(K.glueTube(0.2), 0, 0, 0);
      const glueM = new THREE.MeshPhysicalMaterial({ color: 0xfff6dc, roughness: 0.15, transparent: true, opacity: 0.8, clearcoat: 1 });
      const bead = add(K.solid(new THREE.CylinderGeometry(0.006, 0.006, 1, 10), glueM, { outline: false }), PLX + 0.0, 0.026, 0); bead.rotation.x = Math.PI / 2;
      const jar = add(K.gasJar(0xeef4ff, 0.12, 0.46), HJX, 0, 0); jar.userData.gas.opacity = 0.05; const wisp = K.gasCloud(0xf4f8ff, 10); jar.add(wisp);
      const lPl = grp(tag('a broken plate', 0.05, '#ffffff', PLX, 0.14, 0.2), 'pg'), lGl = grp(tag('glue', 0.05, '#ffd27a', TBX, 0.14, 0.12), 'pg');
      const lHold = tag('glue holds the two pieces ✓', 0.05, '#ffffff', PLX + 0.22, 0.18, 0.2), lH = tag('hydrogen', 0.05, '#ffffff', HJX, 0.6, 0.08);
      const REST = V(TBX, 0.035, 0.12), AT = V(PLX, 0.035, 0.0);
      beats.push((t) => {
        // the tube is picked up, squeezed along the break (a glue bead grows), put back; the halves are pushed together
        const up = ease(span(t, T.sq - 1.0, T.sq - 0.2)) * (1 - ease(span(t, T.run + 2.0, T.run + 2.8)));
        const run = ease(span(t, T.run, T.run + 2.0));
        // the tube lies nozzle-left; it is lifted, tilted nozzle-down onto the crack and drawn along it
        const th = Math.PI + 1.0 * up, tip = V(Math.cos(th) * 0.15, Math.sin(th) * 0.15, 0), at = AT.clone().add(V(0, 0, lerp(-0.15, 0.15, run))).sub(tip);
        tube.position.copy(REST).lerp(at, up); tube.rotation.set(0, 0, th);
        tube.userData.squeeze(span(t, T.run, T.run + 2.0) * up);
        bead.scale.set(1, Math.max(1e-4, 0.3 * run), 1); bead.position.set(PLX + 0.0, 0.026, -0.15 + 0.15 * run); bead.visible = run > 0.01;
        // a hair of glue stays between the halves, and their tops never share one plane (flicker)
        const gap = 0.0015 + 0.05 * (1 - ease(span(t, T.push, T.push + 0.8))); hl.position.x = -gap; hr.position.x = gap; hr.position.y = -0.002;
        if (t > BACK) { hl.position.x = -0.0015; hr.position.x = 0.0015; }
        wisp.userData.update(t, 0.08, 0.42, 0.1, 0.5);
        K.popIn(lPl, t, 0.4, T.sq - 0.2); K.popIn(lGl, t, 0.4, T.sq - 0.2); K.popIn(lHold, t, T.push + 0.9, 9.0); K.popIn(lH, t, DOCK + 0.4, JD);
      });
    }

    // ================================================================ H₂ (dark) · no hand-over: they share a pair, the pair is a dash
    {
      U.stage((t) => t >= JD - 0.05 && t < HC0 - 0.05); keyLight(H2X);
      const A = fatom([1], 1, 0, { a0: [0], r0: 0.42, nr: 0.34 }), B = fatom([1], 1, 0, { a0: [Math.PI], r0: 0.42, nr: 0.34 });
      const D = 0.62; add(A.g, H2X - D, AY, 0); add(B.g, H2X + D, AY, 0.015);
      const ea = A.es[0], eb = B.es[0]; eb.e.material = goldE;               // dot and cross: one electron gold, one blue
      const dash = add(K.solid(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 16).rotateZ(Math.PI / 2), M.glow(0xffc04d, 1.6), { outline: false }), H2X, AY, 0.05);
      const lTwo = tag('two identical hydrogen atoms', 0.055, '#ffffff', H2X, AY - 0.75, 0.1), lNo = tag('both pull the same: no hand-over', 0.055, '#ffd27a', H2X, AY + 0.72, 0.1);
      const lSh = tag('a shared pair: a covalent bond ✓', 0.05, '#ffd27a', H2X, AY + 0.72, 0.1), lDash = tag('the shared pair = a dash: H–H', 0.055, '#ffffff', H2X, AY - 0.75, 0.1);
      const lLoc = tag('it stays between them: localized electrons', 0.05, '#ffffff', H2X, AY - 0.75, 0.1);
      const TRY = JD + 3.6, SH = JD + 8.0, DS = JD + 13.4;
      beats.push((t) => {
        A.update(rest(t, JD + 1.6, JD + 2.6)); B.update(rest(t, JD + 1.6, JD + 2.6));
        // the try: B's electron starts across, stops half way, goes back
        const tr = Math.sin(Math.PI * span(t, TRY, TRY + 2.4)); eb.to = V(-D + 0.2, 0, -0.015); eb.u = 0.5 * tr * (t < SH ? 1 : 0);
        const sh = ease(span(t, SH, SH + 1.2)); if (t >= SH) { ea.to = V(D, 0.055, 0); ea.u = sh; eb.to = V(-D, -0.055, -0.015); eb.u = sh; }
        const ds = ease(span(t, DS, DS + 0.9)); dash.visible = ds > 0.01; dash.scale.set(Math.max(1e-4, ds), 1, Math.max(1e-4, ds));
        [ea, eb].forEach((x) => { x.e.visible = ds < 0.9; x.e.scale.setScalar(Math.max(1e-4, 1 - ds)); });
        K.popIn(lTwo, t, JD + 0.6, TRY - 0.2); K.popIn(lNo, t, TRY + 0.3, SH - 0.1); K.popIn(lSh, t, SH + 1.3, DS - 0.2); K.popIn(lDash, t, DS + 1.0, DS + 3.6); K.popIn(lLoc, t, DS + 3.7, JD + 20.4);
      });
    }

    // ================================================================ HCl (dark) · Example 4.1: one bond pair, three lone pairs → Fig. 4.5
    {
      U.stage((t) => t >= HC0 - 0.05 && t < WA0 - 0.05); keyLight(HCX);
      const h = fatom([1], 1, 0, { a0: [0], r0: 0.36, nr: 0.3 }), cl = fatom([2, 8, 7], 17, 18, { r0: 0.24, dr: 0.22, nr: 0.13, slots: [2, 8, 8], skip: [undefined, undefined, 4], a0: [Math.PI / 2, Math.PI / 2, 0] });
      const HP = V(HCX - 0.82, AY, 0.015), CP = V(HCX + 0.1, AY, 0); add(h.g, HP.x, HP.y, HP.z); add(cl.g, CP.x, CP.y, CP.z);
      const RO = cl.es.at(-1).R, MID = V(HCX - 0.44, AY, 0.008), outs = cl.es.filter((x) => x.s === 2);
      const LONE = [1.4, 1.75, -1.4, -1.75, 0.18, -0.18];                       // three lone pairs: top, bottom, outside
      const bH = add(ball('H', 0.13)), bC = add(ball('Cl', 0.26)), sk = stick(V(HCX - 0.5, AY, 0), V(HCX + 0.1, AY, 0)); U.root.add(sk);
      const lBP = tag('bond pair ✓', 0.055, '#ffd27a', HCX - 0.44, AY - 0.85, 0.1), lLP = tag('3 lone pairs ✓', 0.055, '#ffffff', HCX + 0.1, AY + 0.95, 0.1);
      const lFig = tag('H–Cl: one covalent bond', 0.06, '#ffffff', HCX - 0.2, AY - 0.42, 0.1);
      const SH = HC0 + 2.6, LP = SH + 3.0, BALL = LP + 3.6;
      beats.push((t) => {
        const tm = rest(t, HC0 + 1.0, HC0 + 2.0); h.update(tm); cl.update(tm);
        const s = ease(span(t, SH, SH + 1.0)), l = ease(span(t, LP, LP + 1.0));
        h.es[0].to = MID.clone().add(V(0, 0.05, 0)).sub(HP); h.es[0].u = s;
        outs.forEach((x, i) => { if (i === 0) { x.to = MID.clone().add(V(0, -0.05, 0)).sub(CP); x.u = s; x.e.material = t > SH + 1 ? goldE : blueE; } else { x.to = cl.pt(RO, LONE[i - 1]); x.u = l; } });
        h.es[0].e.material = t > SH + 1 ? goldE : blueE;
        const sh = ease(span(t, BALL, BALL + 1.0)); [h, cl].forEach((a) => a.g.scale.setScalar(Math.max(1e-4, 1 - sh)));
        const bb = back(span(t, BALL + 0.4, BALL + 1.0)); bH.position.set(HCX - 0.5, AY, 0); bC.position.set(HCX + 0.1, AY, 0);
        [bH, bC, sk].forEach((o) => { o.visible = bb > 0.01; }); bH.scale.setScalar(Math.max(1e-4, bb)); bC.scale.setScalar(Math.max(1e-4, bb)); sk.scale.set(Math.max(1e-4, bb), 0.6, Math.max(1e-4, bb));
        K.popIn(lBP, t, SH + 1.1, LP - 0.1); K.popIn(lLP, t, LP + 1.1, BALL - 0.1); K.popIn(lFig, t, BALL + 1.2, WA0 - 0.3);
      });
    }

    // ================================================================ H₂O (dark) · Practice 4.1: two bond pairs, two lone pairs
    {
      U.stage((t) => t >= WA0 - 0.05 && t < SG0 - 0.05); keyLight(WAX, AY - 0.2);
      const OY = AY + 0.05, ANG = [-37.75, -142.25].map((d) => d * Math.PI / 180), DH = 0.74;
      const ox = fatom([2, 6], 8, 8, { r0: 0.28, dr: 0.28, nr: 0.13, a0: [Math.PI / 2, Math.PI / 2] }); add(ox.g, WAX, OY, 0);
      const hs = ANG.map((a) => { const hh = fatom([1], 1, 0, { a0: [a + Math.PI], nr: 0.3 }); add(hh.g); return { hh, a }; });
      const RO = 0.56, PAIR = 0.47, OT = [ANG[0] + 0.12, ANG[1] - 0.12, 1.0, 1.3, 1.84, 2.14], oOut = ox.es.filter((x) => x.s === 1);
      const lRes = grp(tag('2 bond pairs', 0.055, '#ffd27a', WAX, OY - 1.0, 0.1), 'w'), lRes2 = grp(tag('2 lone pairs', 0.055, '#ffffff', WAX, OY + 0.92, 0.1), 'w');
      const S0 = WA0 + 1.6, IN0 = WA0 + 2.0, IN1 = IN0 + 2.0, PR = IN1 - 0.2;
      beats.push((t) => {
        ox.update(rest(t, S0 - 0.8, S0));
        const g = ease(span(t, S0, S0 + 1.2)), pr = ease(span(t, PR, PR + 1.0)), glow = t > PR + 1.0;
        oOut.forEach((x, i) => { x.to = ox.pt(RO, OT[i]); x.u = g; });
        hs.forEach(({ hh, a }, k) => {
          const d = lerp(2.6, DH, ease(span(t, IN0, IN1))), at = V(Math.cos(a) * d, Math.sin(a) * d * Math.cos(ox.tilt), Math.sin(a) * d * Math.sin(ox.tilt));
          hh.g.position.copy(at).add(ox.g.position); hh.g.position.z += 0.015; hh.update(rest(t, IN1 - 1.0, IN1));
          const mid = V(Math.cos(a) * PAIR, Math.sin(a) * PAIR * Math.cos(ox.tilt), Math.sin(a) * PAIR * Math.sin(ox.tilt)), side = V(-Math.sin(a), Math.cos(a), 0).multiplyScalar(0.06);
          oOut[k].to = ox.pt(RO, OT[k]).lerp(mid.clone().add(side), pr);
          hh.es[0].to = mid.clone().sub(side).sub(at).add(V(0, 0, -0.015)); hh.es[0].u = pr;
          hh.es[0].e.material = oOut[k].e.material = glow ? goldE : blueE;
        });
        oOut.slice(2).forEach((x, i) => x.e.scale.setScalar(1 + 0.6 * bump(t, PR + 3.4 + 0.25 * i, 0.5)));
        K.popIn(lRes, t, PR + 1.4, SG0 - 0.2); K.popIn(lRes2, t, PR + 1.4, SG0 - 0.2);
      });
    }

    // ================================================================ SINGLE (dark) · H–H, Cl–Cl, F–F: one line each
    {
      U.stage((t) => t >= SG0 - 0.05 && t < BACK - 0.05); keyLight(SGX);
      const MOL = [['H', 0.13, 0.42], ['Cl', 0.26, 0.6], ['F', 0.2, 0.5]], XS = [-1.45, 0, 1.45].map((d) => SGX + d);
      const mols = MOL.map(([el, r, L], k) => {
        const g = add(new THREE.Group(), XS[k], AY, 0), a = ball(el, r), b = ball(el, r); a.position.x = -L / 2; b.position.x = L / 2;
        g.add(a, b, stick(V(-L / 2, 0, 0), V(L / 2, 0, 0))); return g;
      });
      const names = MOL.map(([el], k) => grp(tag(`${el}–${el}`, 0.06, '#ffffff', XS[k], AY - 0.55, 0.1), 'sg'));
      const lRes = tag('one shared pair: a single bond ✓', 0.06, '#ffd27a', SGX, AY + 0.62, 0.1);
      beats.push((t) => {
        mols.forEach((g, k) => { const u = back(span(t, SG0 + 0.4 + 0.6 * k, SG0 + 0.9 + 0.6 * k)); g.visible = u > 0.01; g.scale.setScalar(Math.max(1e-4, u)); g.rotation.y = 0.25 * Math.sin(t * 0.6 + k); });
        names.forEach((l) => K.popIn(l, t, SG0 + 2.4, SG0 + 6.0)); K.popIn(lRes, t, SG0 + 6.1, BACK);
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'How are two hydrogen atoms bonded?', dockTitle: 'H–H', intro: INTRO, ticks: TICKS,
      rows: [[0, 'glue holds two pieces: what holds two atoms?'], [1, 'identical atoms: no hand-over'], [1, 'they share a pair: a covalent bond'], [1, 'HCl and H₂O: bond pairs, lone pairs'], [1, 'one shared pair: a single bond']],
      short: ['no hand-over', 'a shared pair', 'HCl · H₂O', 'single bond'] }));
    return U.finish();
  },
};
