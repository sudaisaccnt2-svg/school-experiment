// Lesson 404 · Calcium Chloride & Ions (book pp. 96–97: (ii) Formation of calcium chloride, Fig. 4.3, the divalent
// nature of calcium, the trivalent nature of aluminium (AlCl₃), Test Yourself 1–4). v1 as a code lesson (2026-11-04),
// replacing the old Blender film. Built from SKILL.md §0 + §1 + §4 (tools: u4kit.js).
// THE QUESTION (book p.97: "This explains the divalent nature of calcium"): "Why does calcium take two chlorines?" →
//   card, docked panel, four ticks: gives 2 · Ca²⁺ + 2Cl⁻ · Al gives 3 · ions.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a dish of table salt "sodium chloride NaCl" and a jar of white calcium chloride "CaCl₂" · one
//         chlorine for sodium, two for calcium: why? → card → dive INTO the calcium chloride.
//  CA     (dark) a calcium atom 2,8,8,2 between two chlorine atoms 2,8,7 (names held) · calcium's two outer electrons
//         glow "2 outer electrons" · one flies to the left chlorine, then one to the right (the second is shorter) ·
//         the empty ring goes "Ca²⁺: 20 +, 18 −, like argon ✓" · each chlorine "Cl⁻ ✓" · ✓ gives 2 · the atoms shrink
//         into their ion balls, the two Cl⁻ pull in to Ca²⁺ "one Ca²⁺ and two Cl⁻: CaCl₂ ✓" · "calcium gives two:
//         divalent" · ✓.
//  AL     (dark) "Aluminium has three: AlCl₃" · aluminium 2,8,3 with three chlorine atoms round it · three short hops ·
//         "Al³⁺: gives three, trivalent ✓" · ✓.
//  IONS   (dark) Test Yourself: four atoms in a row, Ca 2,8,8,2 · F 2,7 · Li 2,1 · O 2,6 · one at a time: electrons
//         fly off (lost) or fly in (gained) from outside the frame, the ion's formula on it: Ca²⁺, F⁻, Li⁺, O²⁻ ·
//         metals lose, non-metals gain · then MgO: magnesium gives its two electrons to oxygen "Mg²⁺ O²⁻ ✓" · ✓ ions.
//  END    the first table: "CaCl₂: one Ca²⁺, two Cl⁻ ✓".
// Game (🎮 Bond Builder › Ions, docs/COVERAGE_U4.md): Ca → Ca²⁺ + 2e⁻, Cl + e⁻ → Cl⁻, Ca²⁺ + 2Cl⁻ → CaCl₂, MgCl₂,
//   Test Yourself 1 (in what ways / why atoms form ions), 2 (metal + non-metal), 3, 4 (draw MgO and MgCl₂).
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U4.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, rest, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, NCX = HKX - 0.38, CCX = HKX + 0.38;                       // hook: table salt · calcium chloride
const CAX = 40, ALX = 52, TYX = 64, MGX = 76;                            // (dark) calcium · aluminium · the four ions · MgO

// ---------------------------------------------------------------- time
const T = { card: 9.0 };
const DOCK = T.card + 5.0;
const CD = DOCK + 3.6, AL0 = CD + 27.0, TY0 = AL0 + 14.0, MG0 = TY0 + 22.4, BACK = MG0 + 12.6;
T.done = BACK + 7.0;
const INTRO = [T.card, DOCK];
const TICKS = [[CD + 12.6, 0], [CD + 21.6, 1], [AL0 + 11.2, 2], [MG0 + 8.8, 3]];
const DARK = [[CD, BACK]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [5.0, 9.0, 'Why two chlorines for calcium?', [HKX, 0.5, 0.05]],
  [DOCK + 0.2, CD - 0.3, 'Look inside the calcium chloride', [CCX, 0.42, 0.05]],
  [AL0 - 0.3, AL0 + 2.6, 'Aluminium has three outer electrons', [ALX + 0.9, AY - 1.6, 0]],
  [TY0 - 0.2, TY0 + 2.6, 'Metals lose electrons, non-metals gain them', [TYX, AY + 0.95, 0]],
  [MG0 - 0.2, MG0 + 2.2, 'Magnesium oxide: the same way', [MGX, AY + 1.0, 0]],
  [BACK + 1.0, T.done, 'CaCl₂: one Ca²⁺, two Cl⁻ ✓', [CCX, 0.44, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX, 0.18, 0.05], 1.4 * k, 0.6 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const JAR = [CCX, 0.2, 0.02];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), S(DOCK + 1.8, JAR, 0.4, 0.38), DIVE(CD - 0.05, JAR),
  DK(CD, CAX, 5.1, 2.3, 0.3), DK(CD + 1.8, CAX, 5.1, 2.3, 1.04, 'out'), DK(CD + 16.2, CAX, 5.0, 2.3, 1.0), DK(CD + 19.2, CAX, 1.9, 1.15, 1.02), DK(AL0 - 0.05, CAX, 1.9, 1.15, 0.97),
  DK(AL0, ALX + 0.25, 4.5, 4.0, 1.03, undefined, AY - 0.15), DK(TY0 - 0.05, ALX + 0.25, 4.5, 4.0, 0.97, undefined, AY - 0.15),
  DK(TY0, TYX, 6.1, 2.2, 1.03, undefined, AY + 0.05), DK(MG0 - 0.05, TYX, 6.1, 2.2, 0.97, undefined, AY + 0.05),
  DK(MG0, MGX, 3.6, 2.0, 1.03), DK(BACK - 0.05, MGX, 3.6, 2.0, 0.97),
  HK(BACK, 1.0), HK(T.done, 0.96),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '404', { dark, AY }), { beats, ST, add, tag, grp, keyLight, goldE, blueE, fatom, ringFlash } = U;
    const ionBall = (c, r, sign) => { const g = new THREE.Group(); g.add(K.solid(new THREE.SphereGeometry(r, 40, 28), M.gloss(c))); const l = K.label(sign, r * 0.5, '#ffffff', 800); l.position.set(0, 0, r + 0.01); l.renderOrder = 22; g.add(l); return g; };
    const pop = (o, t, t0, t1 = 1e9) => { const u = t < t1 ? back(span(t, t0, t0 + 0.45)) : 1 - ease(span(t, t1, t1 + 0.35)); o.visible = u > 0.01; o.scale.setScalar(Math.max(1e-4, u)); };

    // ================================================================ HOOK / END · table salt and calcium chloride
    {
      U.stage((t) => t < CD - 0.05 || t >= BACK - 0.05); ST.bake(U.root, 'hook', HKX, 1.5, 0.8);
      add(K.saltHeap(0.11, 320), NCX, 0, 0.03);
      const jar = add(K.compoundJar('pellets', 0xf4f3ee, 0.09, 0.22), CCX, 0, 0); jar.userData.fill?.(0.7);
      const lN = tag('table salt: NaCl', 0.05, '#ffffff', NCX, 0.22, 0.2), lC = tag('calcium chloride: CaCl₂', 0.05, '#ffffff', CCX, 0.36, 0.1);
      beats.push((t) => { K.popIn(lN, t, 0.5, 4.8); K.popIn(lC, t, 2.6, 4.9); });
    }

    // ================================================================ CA (dark) · calcium gives one electron to each chlorine
    {
      U.stage((t) => t >= CD - 0.05 && t < AL0 - 0.05); keyLight(CAX);
      const ca = fatom([2, 8, 8, 2], 20, 20, { r0: 0.24, dr: 0.2, nr: 0.13, a0: [Math.PI / 2, Math.PI / 2, Math.PI / 2, 0] });
      const mk = (skip) => fatom([2, 8, 7], 17, 18, { r0: 0.24, dr: 0.22, nr: 0.12, slots: [2, 8, 8], skip: [undefined, undefined, skip], a0: [Math.PI / 2, Math.PI / 2, 0] });
      const cL = mk(0), cR = mk(4), CP = V(CAX, AY, 0), LP = V(CAX - 1.85, AY, 0.012), RP = V(CAX + 1.85, AY, 0.012);
      add(ca.g, CP.x, CP.y, CP.z); add(cL.g, LP.x, LP.y, LP.z); add(cR.g, RP.x, RP.y, RP.z);
      const out = ca.es.filter((x) => x.s === 3), RC = out[0].R, RCl = cL.es.at(-1).R;
      const hopL = U.hop(ca.pt(RC, Math.PI).add(CP), cL.pt(RCl, 0).add(LP), 0.32), hopR = U.hop(ca.pt(RC, 0).add(CP), cR.pt(RCl, Math.PI).add(RP), 0.32);
      const lNames = [grp(tag('calcium 2, 8, 8, 2', 0.05, '#ffffff', CAX, AY - 1.05, 0.1), 'n1'), grp(tag('chlorine 2, 8, 7', 0.045, '#d8f590', LP.x, AY - 0.9, 0.1), 'n2'), grp(tag('chlorine 2, 8, 7', 0.045, '#d8f590', RP.x, AY - 0.9, 0.1), 'n2')];
      const l2 = tag('2 outer electrons', 0.055, '#ffd27a', CAX, AY + 1.0, 0.1), lCa = tag('Ca²⁺: 20 +, 18 −, like argon ✓', 0.05, '#ffffff', CAX, AY - 1.0, 0.1);
      const lCl = grp(tag('Cl⁻ ✓', 0.055, '#d8f590', LP.x, AY - 0.9, 0.1), 'cl'), lCl2 = grp(tag('Cl⁻ ✓', 0.055, '#d8f590', RP.x, AY - 0.9, 0.1), 'cl');
      const lF = tag('one Ca²⁺ and two Cl⁻: CaCl₂ ✓', 0.055, '#ffd27a', CAX, AY + 0.42, 0.1), lDi = tag('calcium gives two: divalent', 0.05, '#ffffff', CAX, AY - 0.42, 0.1);
      const caI = add(ionBall(0xd6d0c4, 0.2, 'Ca²⁺')), clI = [add(ionBall(0x6fd07a, 0.24, 'Cl⁻')), add(ionBall(0x6fd07a, 0.24, 'Cl⁻'))];
      const STOP = CD + 2.6, GLOW = CD + 5.0, H1 = CD + 7.0, H2 = H1 + 2.2, ION = CD + 16.4, PULL = ION + 1.2;
      beats.push((t) => {
        const tm = rest(t, STOP - 1.0, STOP); ca.update(tm); cL.update(tm); cR.update(tm);
        out.forEach((x, i) => { x.e.material = t > GLOW ? goldE : blueE; x.e.scale.setScalar(1 + 0.6 * bump(t, GLOW + 0.3 * i, 0.5)); x.e.visible = t < (x.a0 === 0 ? H2 : H1); });
        hopL(t, H1, H1 + 1.5, t < ION); hopR(t, H2, H2 + 1.2, t < ION);
        const gone = ease(span(t, H2 + 1.3, H2 + 2.0)); ca.rings[3].scale.setScalar(Math.max(1e-4, 1 - gone)); ca.rings[3].visible = gone < 1;
        ringFlash(ca.rings[2], bump(t, H2 + 2.1, 0.6));
        const sh = ease(span(t, ION - 0.6, ION + 0.3)); [ca, cL, cR].forEach((a) => a.g.scale.setScalar(Math.max(1e-4, 1 - sh)));
        const born = back(span(t, ION - 0.4, ION + 0.3)), j = ease(span(t, PULL, PULL + 1.6));
        caI.position.copy(CP); caI.scale.setScalar(Math.max(1e-4, born)); caI.visible = born > 0.01;
        clI.forEach((b, k) => { const from = k ? RP : LP, to = CP.clone().add(V(k ? 0.44 : -0.44, 0, 0.01)); b.position.copy(from).lerp(to, j); b.scale.setScalar(Math.max(1e-4, born)); b.visible = born > 0.01; });
        K.popIn(lNames[0], t, CD + 0.6, CD + 2.6); K.popIn(lNames[1], t, CD + 2.7, GLOW - 0.1); K.popIn(lNames[2], t, CD + 2.7, GLOW - 0.1); K.popIn(l2, t, GLOW + 0.2, H1 - 0.1);
        K.popIn(lCa, t, H2 + 2.1, H2 + 5.0); K.popIn(lCl, t, H2 + 5.1, ION - 0.7); K.popIn(lCl2, t, H2 + 5.1, ION - 0.7);
        K.popIn(lF, t, PULL + 1.8, PULL + 4.8); K.popIn(lDi, t, PULL + 4.9, AL0 - 1.4);
      });
    }

    // ================================================================ AL (dark) · aluminium gives three: AlCl₃
    {
      U.stage((t) => t >= AL0 - 0.05 && t < TY0 - 0.05); keyLight(ALX);
      const al = fatom([2, 8, 3], 13, 14, { r0: 0.24, dr: 0.22, nr: 0.12, a0: [Math.PI / 2, Math.PI / 2, 0] });
      const DIR = [0, 2 * Math.PI / 3, 4 * Math.PI / 3], AP = V(ALX, AY, 0);
      add(al.g, AP.x, AP.y, AP.z);
      const RA = al.es.find((x) => x.s === 2).R;
      const cls = DIR.map((a, k) => { const c = fatom([2, 8, 7], 17, 18, { r0: 0.2, dr: 0.18, nr: 0.1, slots: [2, 8, 8], skip: [undefined, undefined, 4], a0: [Math.PI / 2, Math.PI / 2, a] }); const p = AP.clone().add(V(Math.cos(a) * 1.55, Math.sin(a) * 1.55 * Math.cos(c.tilt), Math.sin(a) * 1.55 * Math.sin(c.tilt) + 0.012 * (k + 1))); add(c.g, p.x, p.y, p.z); return { c, p, a }; });
      const hops = cls.map(({ c, p, a }) => U.hop(al.pt(RA, a).add(AP), c.pt(c.es.at(-1).R, a + Math.PI).add(p), 0.25));
      const lAl = tag('aluminium 2, 8, 3', 0.042, '#ffffff', ALX + 1.15, AY - 1.6, 0.1), lRes = tag('Al³⁺: trivalent → AlCl₃ ✓', 0.045, '#ffd27a', ALX + 1.15, AY - 1.6, 0.1);
      const H0 = AL0 + 3.6;
      beats.push((t) => {
        const tm = rest(t, AL0 + 1.6, AL0 + 2.6); al.update(tm); cls.forEach(({ c }) => c.update(tm));
        const outs = al.es.filter((x) => x.s === 2);
        outs.forEach((x, i) => { x.e.material = goldE; x.e.visible = t < H0 + i * 1.6; });
        hops.forEach((h, i) => h(t, H0 + i * 1.6, H0 + i * 1.6 + 1.1));
        const gone = ease(span(t, H0 + 4.6, H0 + 5.2)); al.rings[2].scale.setScalar(Math.max(1e-4, 1 - gone)); al.rings[2].visible = gone < 1;
        ringFlash(al.rings[1], bump(t, H0 + 5.3, 0.6));
        K.popIn(lAl, t, AL0 + 2.6, H0 + 4.4); K.popIn(lRes, t, H0 + 5.4, TY0 - 0.3);
      });
    }

    // ================================================================ IONS (dark) · Test Yourself: Ca²⁺ · F⁻ · Li⁺ · O²⁻
    {
      U.stage((t) => t >= TY0 - 0.05 && t < MG0 - 0.05); keyLight(TYX);
      const SPEC = [['Ca', [2, 8, 8, 2], 20, -2, 'Ca²⁺'], ['F', [2, 7], 9, 1, 'F⁻'], ['Li', [2, 1], 3, -1, 'Li⁺'], ['O', [2, 6], 8, 2, 'O²⁻']];
      const XS = [-2.25, -0.75, 0.75, 2.25].map((d) => TYX + d);
      const atoms = SPEC.map(([s, sh, z, d], k) => {
        const n = sh.length - 1, slots = [], skip = [];
        if (d > 0) { slots[n] = 8; skip[n] = undefined; }
        const a = fatom(sh, z, z + (z > 10 ? 2 : 0), { r0: 0.22, dr: 0.18, nr: 0.09 + 0.01 * sh.length, slots, a0: sh.map(() => Math.PI / 2) });
        add(a.g, XS[k], AY, 0.01 * k); return a;
      });
      // electrons that leave (fly up and away) or arrive (fly down into the outer ring)
      const movers = SPEC.map(([, sh, , d], k) => Array.from({ length: Math.abs(d) }, (_, i) => { const e = add(U.electron(true)); return { e, i }; }));
      const names = SPEC.map(([s, sh], k) => grp(tag(`${s} ${sh.join(', ')}`, 0.042, '#ffffff', XS[k], AY - 1.0, 0.1), 'row'));
      const res = SPEC.map(([, , , , r], k) => tag(r, 0.075, '#ffd27a', XS[k], AY + 0.95, 0.1));
      const C0 = TY0 + 3.2, STEP = 4.6;
      beats.push((t) => {
        atoms.forEach((a, k) => {
          const [, sh, , d] = SPEC[k], t0 = C0 + k * STEP, n = sh.length - 1, outs = a.es.filter((x) => x.s === n), R = a.rings[n].geometry.parameters.radius;
          a.update(rest(t, TY0 + 1.0, TY0 + 2.0));
          movers[k].forEach(({ e, i }) => {
            const u = ease(span(t, t0 + i * 0.7, t0 + i * 0.7 + 1.1));
            if (d < 0) { const src = outs[outs.length - 1 - i]; src.e.visible = t < t0 + i * 0.7; const from = a.g.position.clone().add(src.e.position); e.position.copy(K.arc(from, from.clone().add(V(0.3, 1.4, 0)), 0.1, u)); e.visible = u > 0 && u < 0.98; }
            else { const to = a.g.position.clone().add(a.pt(R, Math.PI / 2 + (outs.length + i) / 8 * Math.PI * 2)); e.position.copy(K.arc(to.clone().add(V(-0.3, 1.4, 0)), to, 0.1, u)); e.visible = u > 0; }
          });
          if (d < 0) { const gone = ease(span(t, t0 + Math.abs(d) * 0.7 + 0.6, t0 + Math.abs(d) * 0.7 + 1.2)); a.rings[n].scale.setScalar(Math.max(1e-4, 1 - gone)); a.rings[n].visible = gone < 1; }
          K.popIn(names[k], t, TY0 + 0.6, 1e9); K.popIn(res[k], t, t0 + 2.2, 1e9);
          res[k].userData.group = 'res';
        });
      });
    }

    // ================================================================ MG (dark) · MgO: magnesium gives two electrons to oxygen
    {
      U.stage((t) => t >= MG0 - 0.05 && t < BACK - 0.05); keyLight(MGX);
      const mg = fatom([2, 8, 2], 12, 12, { r0: 0.24, dr: 0.22, nr: 0.12, a0: [Math.PI / 2, Math.PI / 2, 0] });
      const ox = fatom([2, 6], 8, 8, { r0: 0.26, dr: 0.26, nr: 0.12, slots: [2, 8], a0: [Math.PI / 2, Math.PI / 2 + Math.PI / 4] });
      const MP = V(MGX - 0.95, AY, 0), OP = V(MGX + 0.95, AY, 0.012); add(mg.g, MP.x, MP.y, MP.z); add(ox.g, OP.x, OP.y, OP.z);
      const mo = mg.es.filter((x) => x.s === 2), RM = mo[0].R, RO = ox.es.at(-1).R;
      const hops = [0, 1].map((i) => U.hop(mg.pt(RM, i ? Math.PI : 0).add(MP), ox.pt(RO, Math.PI + (i ? 0.38 : -0.38)).add(OP), 0.35 + 0.15 * i));
      const lM = grp(tag('magnesium 2, 8, 2', 0.05, '#ffffff', MP.x, AY - 0.95, 0.1), 'mo'), lO = grp(tag('oxygen 2, 6', 0.05, '#ff9f8f', OP.x, AY - 0.95, 0.1), 'mo');
      const lR = tag('Mg²⁺ and O²⁻: MgO ✓', 0.06, '#ffd27a', MGX, AY + 0.95, 0.1);
      const H0 = MG0 + 4.6;
      beats.push((t) => {
        const tm = rest(t, MG0 + 1.0, MG0 + 2.0); mg.update(tm); ox.update(tm);
        mo.forEach((x, i) => { x.e.material = goldE; x.e.visible = t < H0 + i * 1.8; });
        hops.forEach((h, i) => h(t, H0 + i * 1.8, H0 + i * 1.8 + 1.3));
        const gone = ease(span(t, H0 + 3.4, H0 + 4.0)); mg.rings[2].scale.setScalar(Math.max(1e-4, 1 - gone)); mg.rings[2].visible = gone < 1;
        ringFlash(mg.rings[1], bump(t, H0 + 4.1, 0.6)); ringFlash(ox.rings[1], bump(t, H0 + 4.4, 0.6));
        K.popIn(lM, t, MG0 + 2.2, H0 - 0.1); K.popIn(lO, t, MG0 + 2.2, H0 - 0.1); K.popIn(lR, t, H0 + 4.6, BACK);
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Why does calcium take two chlorines?', dockTitle: 'CaCl₂', intro: INTRO, ticks: TICKS,
      rows: [[0, 'NaCl has one chlorine, CaCl₂ has two'], [1, 'calcium gives away two electrons'], [1, 'Ca²⁺ and two Cl⁻: CaCl₂'], [1, 'aluminium gives three: AlCl₃'], [1, 'metals lose, non-metals gain: ions']],
      short: ['gives 2', 'Ca²⁺ + 2Cl⁻', 'Al gives 3', 'ions'] }));
    void pop;
    return U.finish();
  },
};
