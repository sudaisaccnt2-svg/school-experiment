// Lesson 403 · Ionic Bond: Sodium Chloride (book pp. 95–96: 4.3.1 Ionic bond, (i) Formation of sodium chloride, Fig. 4.2).
// v1 as a code lesson (2026-11-04), replacing the old Blender film. Built from SKILL.md §0 + §1 + §4 (tools: u4kit.js).
// THE QUESTION (book (i) "Formation of Sodium Chloride (NaCl)"): "How do sodium and chlorine make salt?" → card, docked
//   panel, four ticks: Na loses: Na⁺ · Cl gains: Cl⁻ · they attract · a crystal.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a dish of table salt; a spoon of sodium ("a soft metal") is warmed in a burner flame; a jar of
//         chlorine ("a green gas, a non-metal") · the lid slides off, the spoon goes in: a bright yellow flame, white
//         smoke, white salt settles on the floor of the jar "salt forms ✓" → card → "How? Look inside the white smoke"
//         → dive INTO the jar.
//  GIVE   (dark) a sodium atom 2,8,1 and a chlorine atom 2,8,7 (names held) · sodium's one outer electron glows "easy to
//         pull off (low ionization energy)" · chlorine's empty place glows "pulls electrons hard (high
//         electronegativity)" · the gold electron flies across · sodium's empty outer ring goes: "Na⁺: 11 +, 10 −, a
//         cation ✓" (like neon) · "Cl⁻: 17 +, 18 −, an anion ✓" (like argon) · ✓ ✓.
//  BOND   each atom shrinks into its ion ball (Na⁺ small purple, Cl⁻ big green, as in Fig. 4.2) · + and − pull them
//         together "opposite charges attract: an ionic bond ✓" · "Also called an electrovalent bond" · "Always a metal
//         with a non-metal" · ✓ they attract.
//  CRYSTAL more ion pairs fall into place, layer by layer, into the lattice of Fig. 4.2 "a crystal lattice ✓" · ✓.
//  END    the crystal is pulled back out into the white salt in the jar, then the table: "Sodium chloride: table salt ✓".
// Game (🎮 Bond Builder › Ions, docs/COVERAGE_U4.md): Na → Na⁺ + e⁻, Cl + e⁻ → Cl⁻, Na⁺ + Cl⁻ → NaCl, metals lose →
//   cations, non-metals gain → anions.
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U4.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, rest, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, DSX = HKX - 0.72, JX = HKX + 0.12, BRN = HKX + 0.78;      // hook: salt dish · chlorine jar · burner
const GVX = 40, CRX = 52;                                                // (dark) sodium gives · the crystal

// ---------------------------------------------------------------- time
const T = { sp: 2.2, hot: 6.4, lid: 7.6, inj: 8.4, burn: 10.0, out: 14.2, salt: 14.6, card: 17.6 };
const DOCK = T.card + 5.0;
const ASK = DOCK + 0.2, GD = ASK + 4.4, BD0 = GD + 19.8, CR0 = BD0 + 14.0, BACK = CR0 + 12.0;
T.done = BACK + 10.0;
const INTRO = [T.card, DOCK];
const TICKS = [[GD + 13.4, 0], [GD + 16.6, 1], [BD0 + 6.8, 2], [CR0 + 9.0, 3]];
const DARK = [[GD, BACK]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [7.4, 9.6, 'What happens when they meet?', [JX, 0.86, 0.05]],
  [ASK, GD - 0.3, 'How? Look inside the white smoke', [JX, 0.82, 0.05]],
  [BD0 + 7.0, BD0 + 9.8, 'Also called an electrovalent bond', [CRX - 6, AY + 0.8, 0]],
  [BD0 + 9.8, CR0 - 0.2, 'Always a metal with a non-metal', [CRX - 6, AY + 0.8, 0]],
  [BACK + 3.4, T.done, 'Sodium chloride: table salt ✓', [HKX - 0.2, 0.62, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX + 0.06, 0.4, 0.05], 1.95 * k, 1.0 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const SMOKE = [JX, 0.36, 0.02], SALT = [JX, 0.08, 0.02];
const BX = CRX - 6;                                                     // where the ion pair is made (the crystal is built round it)
const CAMS = [
  HK(0, 1.04), HK(T.inj, 1.0), S(T.burn + 0.4, [JX, 0.46, 0.05], 0.9, 0.8), S(T.card - 0.05, [JX, 0.46, 0.05], 0.86, 0.76),
  S(DOCK, [JX, 0.46, 0.05], 0.9, 0.8), S(ASK + 2.0, SMOKE, 0.5, 0.46), S(GD - 1.2, SMOKE, 0.36, 0.34), DIVE(GD - 0.05, SMOKE),
  DK(GD, GVX, 3.9, 2.1, 0.3), DK(GD + 1.8, GVX, 3.9, 2.1, 1.04, 'out'), DK(BD0 - 0.05, GVX, 3.9, 2.1, 0.97),
  DK(BD0, BX, 2.2, 1.3, 1.04, undefined, AY - 0.3), DK(CR0 - 0.05, BX, 2.2, 1.3, 0.98, undefined, AY - 0.3),
  DK(CR0 + 0.6, BX, 2.4, 1.9, 1.02, undefined, AY - 0.1), DK(BACK - 2.2, BX, 2.2, 1.9, 0.96, undefined, AY - 0.1), DK(BACK - 0.05, BX, 0.7, 0.6, 1.0, 'in'),
  S(BACK, SALT, 0.3, 0.2, ADIR, 'out'), S(BACK + 2.6, [JX, 0.3, 0.05], 0.9, 0.7), HK(BACK + 5.0, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '403', { dark, AY }), { beats, ST, add, tag, grp, keyLight, goldE, blueE, fatom, ringFlash } = U;
    const fires = [], fire = (tint, size, opts) => { const f = K.makeFire(tint, size, opts); fires.push(f); return f; };
    const shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
    const NAC = 0x8c6fd8, CLC = 0x6fd07a, RNA = 0.14, RCL = 0.24;     // Fig. 4.2: Na⁺ purple and small, Cl⁻ green and big

    // ================================================================ HOOK / END · sodium burns in chlorine: salt
    {
      U.stage((t) => t < GD - 0.05 || t >= BACK - 0.05); ST.bake(U.root, 'hook', HKX + 0.04, 2.3, 1.0);
      add(K.saltHeap(0.13, 360), DSX + 0.06, 0, 0.05);
      const jar = add(K.gasJar(0xa8e020, 0.16, 0.62), JX, 0, 0), gas = jar.userData.gas, lid = jar.userData.lid, lid0 = lid.position.clone(); gas.opacity = 0.42;
      const wisp = K.gasCloud(0xa8e020, 12); jar.add(wisp);
      const deposit = add(K.solid(new THREE.CylinderGeometry(0.14, 0.14, 1, 32).translate(0, 0.5, 0), new THREE.MeshPhysicalMaterial({ color: 0xf6f5f1, roughness: 0.5 }), { outline: false }), JX, 0.056, 0);
      const brn = add(K.burner(), BRN, 0, 0); fires.push(brn.userData.flame); brn.userData.flame.scale.setScalar(0.75);
      const sp = add(K.spoon(0.6)), naM = new THREE.MeshStandardMaterial({ color: 0xd8dce2, metalness: 0.7, roughness: 0.3, emissive: 0xff8a20, emissiveIntensity: 0 });
      const na = K.lump(0.035, naM, 7, 0.7, 0.3); na.position.y = -0.03; sp.add(na);
      const fl = add(fire(0xffc21a, 0.34, { core: 0xfff3c4 })), fume = add(K.smoke(8, 0xffffff), JX, 0.1, 0); fume.scale.setScalar(0.12);
      const white = new THREE.Color(0xf4f4ee), green = new THREE.Color(0xa8e020);
      const IN = V(JX, 0.36, 0), FL = V(BRN, 0.74, 0), UP = V(BRN, 1.05, 0), OVER = V(JX, 1.05, 0);
      const lSalt = tag('table salt', 0.05, '#ffffff', DSX + 0.06, 0.22, 0.25), lNa = tag('sodium: a soft metal', 0.05, '#ffffff', 0, 0, 0);
      const lCl = tag('chlorine: a non-metal gas', 0.05, '#d8f590', JX, 0.8, 0.05), lMade = tag('white salt forms ✓', 0.055, '#ffffff', JX - 0.1, 0.74, 0.05);
      beats.push((t) => {
        let p;
        if (t < T.hot) p = V(BRN, lerp(1.6, FL.y, ease(span(t, T.sp, T.sp + 1.6))), 0);
        else if (t < T.inj) p = FL.clone().lerp(UP, ease(span(t, T.inj - 0.6, T.inj)));
        else if (t < T.inj + 0.8) p = K.arc(UP, OVER, 0.1, ease(span(t, T.inj, T.inj + 0.8)));
        else if (t < T.out) p = OVER.clone().lerp(IN, ease(span(t, T.inj + 0.8, T.burn)));
        else p = IN.clone().lerp(V(JX, 2.0, 0), easeIn(span(t, T.out, T.out + 1.4)));
        sp.position.copy(p); sp.visible = t > T.sp && t < T.out + 1.4;
        const glow = ease(span(t, T.sp + 2.0, T.hot)), burnt = ease(span(t, T.burn, T.out));
        naM.emissiveIntensity = 0.8 * glow * (1 - burnt); naM.color.set(0xd8dce2).lerp(white, burnt); na.scale.setScalar(Math.max(0.2, 1 - 0.6 * burnt));
        const fk = ease(span(t, T.burn - 0.2, T.burn + 0.3)) * (1 - ease(span(t, T.out - 0.6, T.out))) * (1 + 0.12 * Math.sin(t * 17));
        fl.visible = fk > 0.01; fl.position.copy(p).add(V(0, -0.01, 0)); fl.scale.setScalar(Math.max(1e-4, fk));
        const off = ease(span(t, T.lid, T.lid + 0.6)) * (1 - ease(span(t, T.out + 1.2, T.out + 1.8)));
        lid.position.set(lid0.x - 0.4 * off, lid0.y - (lid0.y - 0.006) * easeIn(span(off, 0.6, 1)), lid0.z);
        const smoke = ease(span(t, T.burn, T.out)), settle = ease(span(t, T.salt, T.salt + 2.2));
        gas.color.copy(green).lerp(white, smoke); gas.opacity = 0.42 - 0.08 * smoke - 0.28 * settle;
        wisp.userData.update(t, 0.08, 0.56, 0.14, (1 - smoke) * 0.9);
        fume.visible = t > T.burn && t < GD; fume.userData.update(t - T.burn, smoke * (1 - 0.6 * settle));
        deposit.scale.y = Math.max(1e-4, 0.022 * settle); deposit.visible = settle > 0.01;
        lNa.position.copy(p).add(V(-0.3, 0.1, 0.1));
        K.popIn(lSalt, t, 0.4, 3.4); K.popIn(lNa, t, 3.5, 5.3); K.popIn(lCl, t, 5.4, 7.3); K.popIn(lMade, t, T.salt + 0.6, T.card);
      });
    }

    // ================================================================ GIVE (dark) · sodium gives chlorine its outer electron
    const NAP = V(GVX - 1.05, AY, 0), CLP = V(GVX + 1.05, AY, 0.012);
    {
      U.stage((t) => t >= GD - 0.05 && t < BD0 + 0.6); keyLight(GVX);
      const naA = fatom([2, 8, 1], 11, 12, { r0: 0.28, dr: 0.25, nr: 0.12, a0: [Math.PI / 2, Math.PI / 2, 0] });
      const clA = fatom([2, 8, 7], 17, 18, { r0: 0.28, dr: 0.25, nr: 0.14, slots: [2, 8, 8], skip: [undefined, undefined, 4], a0: [Math.PI / 2, Math.PI / 2, 0] });
      add(naA.g, NAP.x, NAP.y, NAP.z); add(clA.g, CLP.x, CLP.y, CLP.z);
      const naOut = naA.es.find((x) => x.s === 2), R2 = naOut.R;
      const gap = add(K.glowSprite(0xffd27a, 0.3)); gap.position.copy(clA.pt(R2, Math.PI)).add(CLP);
      const hop = U.hop(naA.pt(R2, 0).add(NAP), clA.pt(R2, Math.PI).add(CLP), 0.35);
      const lNa = grp(tag('sodium 2, 8, 1', 0.055, '#d8c8ff', NAP.x, AY - 1.02, 0.1), 'pair'), lCl = grp(tag('chlorine 2, 8, 7', 0.055, '#d8f590', CLP.x, AY - 1.02, 0.1), 'pair');
      const lEasy = grp(tag('easy to lose', 0.055, '#ffd27a', NAP.x + 0.1, AY + 1.08, 0.1), 'ea'), lEasy2 = grp(tag('(low ionization energy)', 0.04, '#ffd27a', NAP.x + 0.1, AY + 0.86, 0.1), 'ea');
      const lHard = grp(tag('pulls hard', 0.055, '#d8f590', CLP.x - 0.1, AY + 1.08, 0.1), 'ha'), lHard2 = grp(tag('(high electronegativity)', 0.04, '#d8f590', CLP.x - 0.15, AY + 0.86, 0.1), 'ha');
      const lCat = tag('Na⁺: 11 +, 10 −, a cation ✓', 0.05, '#ffffff', NAP.x + 0.2, AY - 1.02, 0.1), lAn = tag('Cl⁻: 17 +, 18 −, an anion ✓', 0.05, '#d8f590', CLP.x - 0.45, AY - 1.02, 0.1);
      const STOP = GD + 2.6, EASY = GD + 4.6, HARD = GD + 7.8, HOP = GD + 10.8, HOP1 = HOP + 1.6;
      beats.push((t) => {
        const tm = rest(t, STOP - 1.0, STOP); naA.update(tm); clA.update(tm);
        naOut.e.material = t > EASY ? goldE : blueE; naOut.e.visible = t < HOP; naOut.e.scale.setScalar(1 + 0.6 * bump(t, EASY, 0.6));
        const g = span(t, HARD, HARD + 0.4) * (1 - span(t, HOP1 - 0.2, HOP1)); gap.visible = g > 0.01; gap.material.opacity = 0.8 * g * (0.8 + 0.2 * Math.sin(t * 6));
        hop(t, HOP, HOP1, t < BD0);
        const gone = ease(span(t, HOP1 + 0.2, HOP1 + 1.0)); naA.rings[2].scale.setScalar(Math.max(1e-4, 1 - gone)); naA.rings[2].visible = gone < 1;
        ringFlash(naA.rings[1], bump(t, HOP1 + 1.1, 0.6)); ringFlash(clA.rings[2], bump(t, HOP1 + 4.3, 0.6));
        // into the ion balls: each atom shrinks into its ion (born from it), the pair moves to the crystal place
        const sh = ease(span(t, BD0 - 0.6, BD0 + 0.4)); naA.g.scale.setScalar(Math.max(1e-4, 1 - sh)); clA.g.scale.setScalar(Math.max(1e-4, 1 - sh));
        K.popIn(lNa, t, GD + 0.6, EASY - 0.1); K.popIn(lCl, t, GD + 0.6, EASY - 0.1); K.popIn(lEasy, t, EASY + 0.2, HARD - 0.1); K.popIn(lEasy2, t, EASY + 0.2, HARD - 0.1); K.popIn(lHard, t, HARD + 0.2, HOP - 0.1); K.popIn(lHard2, t, HARD + 0.2, HOP - 0.1);
        K.popIn(lCat, t, HOP1 + 1.1, HOP1 + 4.2); K.popIn(lAn, t, HOP1 + 4.3, BD0 - 0.7);
      });
    }

    // ================================================================ BOND + CRYSTAL (dark) · the ions attract, more pairs build the lattice
    {
      U.stage((t) => t >= BD0 - 0.65 && t < BACK - 0.05); keyLight(GVX); keyLight(BX);
      const ionBall = (c, r, sign) => { const g = new THREE.Group(); g.add(K.solid(new THREE.SphereGeometry(r, 40, 28), M.gloss(c))); const l = K.label(sign, r * 0.75, '#ffffff', 800); l.position.set(0, 0, r + 0.01); l.renderOrder = 22; g.add(l); return g; };
      const naI = add(ionBall(NAC, RNA, '+')), clI = add(ionBall(CLC, RCL, '−'));
      // the lattice (Fig. 4.2): 3 × 3 × 3 ions, alternating; the first pair is ours, the others fall into place layer by layer
      const A = 0.4, cells = [];
      for (let y = 0; y < 3; y++) for (let z = 0; z < 3; z++) for (let x = 0; x < 3; x++) cells.push({ x, y, z, na: (x + y + z) % 2 === 1 });
      const at = (c) => V(BX + (c.x - 1) * A, AY - 0.45 + c.y * A, (c.z - 1) * A);
      const ours = [cells.findIndex((c) => c.x === 1 && c.y === 0 && c.z === 2), cells.findIndex((c) => c.x === 2 && c.y === 0 && c.z === 2)];
      const balls = cells.map((c, i) => (ours.includes(i) ? null : add(K.solid(new THREE.SphereGeometry(c.na ? RNA : RCL, 28, 18), M.gloss(c.na ? NAC : CLC)))));
      const order = cells.map((c, i) => i).filter((i) => !ours.includes(i)).sort((a, b) => cells[a].y - cells[b].y || cells[b].z - cells[a].z || cells[a].x - cells[b].x);
      const rods = []; for (const a of cells) for (const b of cells) if (b.x - a.x + b.y - a.y + b.z - a.z === 1 && Math.abs(b.x - a.x) + Math.abs(b.y - a.y) + Math.abs(b.z - a.z) === 1) rods.push([a, b]);
      const rodM = new THREE.MeshStandardMaterial({ color: 0xc8ccd6, roughness: 0.5, transparent: true, opacity: 0.55 });
      const rodMesh = rods.map(([a, b]) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, A - 0.06, 8, 1, true), rodM); m.position.copy(at(a)).lerp(at(b), 0.5); m.quaternion.setFromUnitVectors(V(0, 1, 0), at(b).clone().sub(at(a)).normalize()); U.root.add(m); return m; });
      const pull = add(K.glowSprite(0xffd27a, 0.32));
      const lAtt = tag('opposite charges attract: an ionic bond ✓', 0.05, '#ffd27a', BX, AY + 0.2, 0.1), lLat = tag('a crystal lattice of Na⁺ and Cl⁻ ✓', 0.055, '#ffffff', BX, AY + 0.95, 0.1);
      const P0na = V(BX - 0.7, AY - 0.45, 0.4), P0cl = V(BX + 0.7, AY - 0.45, 0.4), A0 = BD0 + 1.4, A1 = A0 + 2.2;
      beats.push((t) => {
        // the two ion balls are born where the atoms shrank, move to the crystal place, then pull together
        const born = back(span(t, BD0 - 0.5, BD0 + 0.2)), mv = ease(span(t, BD0, BD0 + 1.2)), j = ease(span(t, A0, A1));
        naI.scale.setScalar(Math.max(1e-4, born)); clI.scale.setScalar(Math.max(1e-4, born));
        const naAt = NAP.clone().lerp(P0na, mv).lerp(at(cells[ours[0]]), j), clAt = CLP.clone().lerp(P0cl, mv).lerp(at(cells[ours[1]]), j);
        naI.position.copy(naAt); clI.position.copy(clAt);
        pull.position.copy(naAt).lerp(clAt, 0.5); const pg = span(t, A1 - 0.5, A1) * (1 - span(t, A1 + 2.0, A1 + 2.6)); pull.visible = pg > 0.01; pull.material.opacity = 0.8 * pg;
        order.forEach((i, k) => { const b = balls[i], t0 = CR0 + 0.6 + k * 0.22, u = span(t, t0, t0 + 0.5); b.visible = u > 0; b.position.copy(at(cells[i])).add(V(0, 0.9 * (1 - easeIn(u)), 0)); });
        const rk = span(t, CR0 + 6.6, CR0 + 7.4); rodM.opacity = 0.55 * rk; rodMesh.forEach((m) => { m.visible = rk > 0.01; });
        K.popIn(lAtt, t, A1 + 0.3, BD0 + 6.9); K.popIn(lLat, t, CR0 + 7.6, BACK - 1.0);
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'How do sodium and chlorine make salt?', dockTitle: 'Salt', intro: INTRO, ticks: TICKS,
      rows: [[0, 'sodium + chlorine → table salt'], [1, 'sodium loses one electron: Na⁺'], [1, 'chlorine gains it: Cl⁻'], [1, '+ and − attract: the ionic bond'], [1, 'many ions: a crystal']],
      short: ['Na loses: Na⁺', 'Cl gains: Cl⁻', 'they attract', 'a crystal'] }));
    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));
    return U.finish();
  },
};
