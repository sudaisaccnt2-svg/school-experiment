// Lesson 413 · Properties of Ionic, Covalent & Metallic (book pp. 113–116: 4.5 Nature of bonding and properties, 4.5.1
// ionic compounds + Scientific Information (MgO 2800 °C, furnaces), 4.5.2 covalent compounds, 4.5.3 metals, Fig. 4.21,
// Activity 4.4). v1 as a code lesson (2026-11-04), replacing the old Blender film. Built from SKILL.md §0 + §1 + §4.
// THE QUESTION (book p.114: "The nature of bonding and properties of different compounds"): "Why do salt, sugar and
//   copper behave so differently?" → card, docked panel, five ticks: melting · conducting · dissolving · metals ·
//   Activity 4.4.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: salt (ionic), sugar (covalent), copper (metallic), named with their bond · "Why so different?" →
//         card.
//  MELT   comparison bench: a spoon of salt and a spoon of sugar side by side over one flame · sugar melts and browns
//         "sugar melts: low melting point ✓", salt stays white "salt does not: high melting point ✓" · MgO block "the
//         bigger the charges, the higher: MgO 2800 °C, furnace linings" · ✓ melting.
//  CONDUCT two beakers, salt water and sugar water · the same battery + bulb circuit is lowered into each · salt water:
//         bulb lights "ions carry the current ✓"; sugar water: bulb stays off "no ions: a non-electrolyte ✓" → dive INTO
//         the salt water: Na⁺ moves to the − rod, Cl⁻ to the + rod · ✓ conducting.
//  DISSOLVE back on the bench: sugar into water: it dissolves "polar in polar ✓" · oil into water: a separate layer;
//         oil into benzene: it mixes "non-polar in non-polar ✓" · ✓ dissolving.
//  METALS  copper: a hammer flattens a lump into a sheet "malleable"; clamps draw a rod into a wire "ductile" (Fig. 4.21
//         wires); light glints "lustrous"; a tap makes rings of sound "sonorous"; the bulb test "conducts"; a drop of
//         mercury "the only liquid metal" · ✓ metals.
//  ACT    Activity 4.4: each property card meets its name and one use (wires · car bodies · mirrors · bells · cables ·
//         weights · cooking pots), one at a time · ✓.
//  END    the three things: "Their bonds decide their properties ✓".
// Game (🎮 Bond Reasons › Facts + Why?: the property lists 4.5.1 / 4.5.2, Activity 4.4 rows, Long Q iv).
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U4.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
const { M, span, ease, easeIn, back, lerp, hash } = K;
const { V, ADIR, DDIR, rest, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, SAX = HKX - 0.5, SUX = HKX, CUX = HKX + 0.5;               // hook: salt · sugar · copper
const MLX = 12, CDX = 24, DSX = 36, MTX = 48, INX = 60, ACX = 72;         // melt · conduct · dissolve · metals · (dark) ions · Activity 4.4

// ---------------------------------------------------------------- time
const T = { card: 9.0 };
const DOCK = T.card + 5.0;
const ML0 = DOCK + 0.2, CD0 = ML0 + 15.4, IND = CD0 + 15.4, DS0 = IND + 9.0, MT0 = DS0 + 14.0, AC0 = MT0 + 26.0, BACK = AC0 + 16.6;
T.done = BACK + 6.0;
const INTRO = [T.card, DOCK];
const TICKS = [[ML0 + 13.6, 0], [IND + 7.6, 1], [DS0 + 12.6, 2], [MT0 + 24.4, 3], [AC0 + 15.4, 4]];
const DARK = [[IND, DS0], [AC0, BACK]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [5.6, T.card, 'Why do they behave so differently?', [HKX, 0.36, 0.05]],
  [ML0 + 0.2, ML0 + 2.6, 'Test 1: heat them', [MLX, 0.62, 0.05]],
  [CD0 + 0.1, CD0 + 2.4, 'Test 2: dissolve, then pass a current', [CDX, 0.66, 0.05]],
  [IND - 1.6, IND - 0.2, 'Why? Look inside', [CDX - 0.35, 0.46, 0.05]],
  [DS0 + 0.1, DS0 + 2.4, 'Test 3: what dissolves where?', [DSX, 0.6, 0.05]],
  [MT0 + 0.1, MT0 + 2.4, 'Test 4: the metal', [MTX, 0.6, 0.05]],
  [AC0 + 0.1, AC0 + 2.4, 'Activity 4.4: property, name, use', [ACX, AY + 1.2, 0]],
  [BACK + 0.6, T.done, 'Their bonds decide their properties ✓', [HKX, 0.36, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX, 0.12, 0.05], 1.4 * k, 0.5 * k, ADIR, e);
const BN = (t, x, w, h, y, k = 1, e) => S(t, [x, y, 0.05], w * k, h * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const SALTW = [CDX - 0.35, 0.18, 0.02];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), HK(ML0 - 0.05, 1.0),
  BN(ML0, MLX, 0.95, 0.9, 0.42, 1.05), BN(ML0 + 2.6, MLX, 0.56, 0.36, 0.68, 1.0), BN(ML0 + 9.6, MLX, 0.52, 0.34, 0.68, 1.0), BN(ML0 + 11.0, MLX + 0.25, 1.05, 0.62, 0.3, 1.0), BN(CD0 - 0.05, MLX + 0.25, 1.0, 0.6, 0.3, 0.98),
  BN(CD0, CDX, 1.45, 0.9, 0.3, 1.05), BN(IND - 2.0, CDX, 1.45, 0.9, 0.3, 0.98), S(IND - 1.0, SALTW, 0.3, 0.3), DIVE(IND - 0.05, SALTW),
  DK(IND, INX, 2.8, 1.8, 0.3), DK(IND + 1.8, INX, 2.8, 1.8, 1.04, 'out'), DK(DS0 - 0.05, INX, 2.8, 1.8, 0.97),
  BN(DS0, DSX, 1.5, 0.75, 0.24, 1.05), BN(MT0 - 0.05, DSX, 1.5, 0.75, 0.24, 0.97),
  BN(MT0, MTX, 1.5, 0.6, 0.2, 1.05), BN(MT0 + 2.0, MTX - 0.45, 0.6, 0.36, 0.3, 1.0), BN(MT0 + 7.4, MTX - 0.45, 0.56, 0.34, 0.3, 1.0),
  BN(MT0 + 7.6, MTX + 0.1, 0.62, 0.34, 0.15, 1.0), BN(MT0 + 12.0, MTX + 0.1, 0.58, 0.32, 0.15, 1.0), BN(MT0 + 12.2, MTX - 0.45, 0.5, 0.32, 0.3, 1.0), BN(MT0 + 16.2, MTX - 0.45, 0.48, 0.3, 0.3, 1.0),
  BN(MT0 + 16.4, MTX + 0.1, 0.62, 0.36, 0.16, 1.0), BN(MT0 + 20.6, MTX + 0.1, 0.6, 0.34, 0.16, 1.0), BN(MT0 + 20.8, MTX + 0.55, 0.5, 0.3, 0.06, 1.0), BN(AC0 - 0.05, MTX + 0.55, 0.48, 0.28, 0.06, 1.0),
  DK(AC0, ACX, 5.8, 2.7, 1.02, undefined, AY - 0.15), DK(BACK - 0.05, ACX, 5.8, 2.7, 0.98, undefined, AY - 0.15),
  HK(BACK, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '413', { dark, AY }), { beats, ST, add, tag, grp, keyLight, goldE } = U;
    const fires = [], fire = (tint, size, opts) => { const f = K.makeFire(tint, size, opts); fires.push(f); return f; }, shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
    const copperM = M.metal(0xc8743a, 0.25);
    const sugarCubes = (n = 3) => { const g = new THREE.Group(), m = new THREE.MeshStandardMaterial({ color: 0xf8f6f0, roughness: 0.85 }); for (let i = 0; i < n; i++) { const c = K.solid(new THREE.BoxGeometry(0.04, 0.04, 0.04), m); c.position.set((i - (n - 1) / 2) * 0.046, 0.02, (i % 2) * 0.01); c.rotation.y = i * 0.4; g.add(c); } return g; };
    const circuit = (x, y) => {                                         // battery + bulb on a little stand, two rods that dip into a beaker
      const g = add(new THREE.Group(), x, y, 0); const bat = K.battery(); bat.scale.setScalar(0.42); bat.position.set(-0.2, 0, 0); const blb = K.bulb(); blb.scale.setScalar(0.32); blb.position.set(0.2, 0, 0); blb.userData.set(0);
      const rods = [-0.04, 0.04].map((dx) => { const r = K.solid(new THREE.CylinderGeometry(0.008, 0.008, 0.32, 12), M.matte(0x22252b, 0.55)); r.position.set(dx, -0.2, 0); g.add(r); return r; });
      g.add(bat, blb, K.wire([[-0.2, 0.24, 0], [-0.12, 0.3, 0], [-0.04, 0.06, 0], [-0.04, -0.04, 0]], 0x2c2f36, 0.006), K.wire([[0.2, 0.02, 0], [0.12, 0.06, 0], [0.04, 0.04, 0], [0.04, -0.04, 0]], 0xb8442f, 0.006));
      const base = K.solid(new THREE.BoxGeometry(0.56, 0.02, 0.1), M.matte(0x3a3f48, 0.6)); base.position.y = -0.01; g.add(base);
      g.userData.bulb = blb; return g;
    };

    // ================================================================ HOOK / END · salt, sugar, copper
    {
      U.stage((t) => t < ML0 - 0.05 || t >= BACK - 0.05); ST.bake(U.root, 'hook', HKX, 1.6, 0.8);
      add(K.saltHeap(0.1, 300), SAX, 0, 0.02); add(sugarCubes(4), SUX, 0, 0); add(K.ribbonCoil(0.07, 7, copperM), CUX, 0, 0);
      const ls = [['salt: ionic', SAX, '#ffffff'], ['sugar: covalent', SUX, '#9fc8ff'], ['copper: metallic', CUX, '#ffc9a0']].map(([s, x, c]) => tag(s, 0.05, c, x, 0.2, 0.12));
      beats.push((t) => { ls.forEach((l, i) => K.popIn(l, t, 0.4 + 1.7 * i, 2.0 + 1.7 * i)); });
    }

    // ================================================================ MELT · salt and sugar over one flame
    {
      U.stage((t) => t >= ML0 - 0.05 && t < CD0 - 0.05); ST.bake(U.root, 'melt', MLX, 1.5, 0.8);
      const brn = add(K.burner(), MLX, 0, 0); brn.userData.flame.scale.setScalar(0.7); fires.push(brn.userData.flame);
      const spoons = [-1, 1].map((sd) => { const sp = add(K.spoon(0.4)); sp.position.set(MLX + sd * 0.075, 0.7, 0); sp.rotation.y = sd > 0 ? 0 : Math.PI; return sp; });   // both cups in the flame, handles outward
      const salt = add(K.saltHeap(0.03, 50), MLX - 0.075, 0.655, 0), sug = add(sugarCubes(1), MLX + 0.075, 0.655, 0), melt = add(K.solid(new THREE.SphereGeometry(0.035, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: 0xd8a040, roughness: 0.15, clearcoat: 1 }), { outline: false }), MLX + 0.075, 0.655, 0); melt.scale.y = 0.4;
      const mgo = add(K.solid(new THREE.BoxGeometry(0.18, 0.1, 0.12), M.matte(0xeceae4, 0.9)), MLX + 0.5, 0.05, 0.05);
      const lS = grp(tag('salt', 0.045, '#ffffff', MLX - 0.17, 0.78, 0.08), 'su'), lU = grp(tag('sugar', 0.045, '#9fc8ff', MLX + 0.17, 0.78, 0.08), 'su');
      const lM = tag('sugar melts: low melting point ✓', 0.045, '#ffd27a', MLX, 0.9, 0.08), lN = tag('salt does not: high melting point ✓', 0.045, '#ffffff', MLX, 0.9, 0.08);
      const lMg = tag('bigger charges, higher still: MgO 2800 °C', 0.042, '#ffd27a', MLX + 0.25, 0.3, 0.12), lF = tag('MgO lines furnaces', 0.045, '#ffffff', MLX + 0.38, 0.24, 0.12);
      const H0 = ML0 + 3.0, MLT = H0 + 1.4;
      beats.push((t) => {
        const k = ease(span(t, MLT, MLT + 2.4)); sug.visible = k < 0.98; sug.scale.set(1, Math.max(1e-4, 1 - k), 1); melt.visible = k > 0.02; melt.scale.set(Math.max(1e-4, 0.6 + 0.6 * k), Math.max(1e-4, 0.4 * k), Math.max(1e-4, 0.6 + 0.6 * k));
        melt.material.color.setHex(0xd8a040).lerp(new THREE.Color(0x7a3a12), span(t, MLT + 2.0, MLT + 4.0));
        mgo.visible = t > MLT + 6.2; mgo.scale.setScalar(Math.max(1e-4, back(span(t, MLT + 6.2, MLT + 6.7))));
        K.popIn(lS, t, ML0 + 2.7, H0 + 0.8); K.popIn(lU, t, ML0 + 2.7, H0 + 0.8); K.popIn(lM, t, MLT + 1.6, MLT + 3.8); K.popIn(lN, t, MLT + 3.9, MLT + 6.1); K.popIn(lMg, t, MLT + 6.8, MLT + 9.6); K.popIn(lF, t, MLT + 9.7, CD0);
        void spoons; void salt;
      });
    }

    // ================================================================ CONDUCT · salt water lights the bulb, sugar water does not
    {
      U.stage((t) => t >= CD0 - 0.05 && t < IND - 0.05); ST.bake(U.root, 'cond', CDX, 1.6, 0.85);
      const BX = [CDX - 0.35, CDX + 0.35];
      BX.forEach((x) => { add(K.beaker(0.13, 0.26), x, 0, 0); add(K.liquid(0.125, 0.18, 0x3d9ee6, 0.55), x, 0.052, 0); });
      const rigs = BX.map((x) => circuit(x, 0.7));
      const lW = grp(tag('salt water', 0.045, '#ffffff', BX[0], 0.33, 0.12), 'w'), lG = grp(tag('sugar water', 0.045, '#9fc8ff', BX[1], 0.33, 0.12), 'w');
      const lOn = tag('bulb lights: ions carry the current ✓', 0.04, '#ffd27a', CDX, 0.98, 0.05), lOff = tag('stays off: no ions, a non-electrolyte ✓', 0.04, '#ffffff', CDX, 0.98, 0.05);
      const D0 = CD0 + 3.0, D1 = D0 + 4.4;
      beats.push((t) => {
        rigs.forEach((g, i) => { const d = ease(span(t, i ? D1 : D0, (i ? D1 : D0) + 1.0)); g.position.y = lerp(0.72, 0.4, d); g.userData.bulb.userData.set(i ? 0 : ease(span(t, D0 + 1.1, D0 + 1.5))); });
        K.popIn(lW, t, CD0 + 2.5, D0 + 0.4); K.popIn(lG, t, CD0 + 2.5, D0 + 0.4); K.popIn(lOn, t, D0 + 1.6, D1 - 0.1); K.popIn(lOff, t, D1 + 1.2, IND - 1.7);
      });
    }

    // ================================================================ INSIDE (dark) · in salt water the ions move to the rods
    {
      U.stage((t) => t >= IND - 0.05 && t < DS0 - 0.05); keyLight(INX);
      const rods = [-1, 1].map((sd) => add(K.solid(new THREE.BoxGeometry(0.08, 1.3, 0.08), M.matte(0x2a2d33, 0.6)), INX + sd * 1.05, AY, 0));
      const signs = [grp(tag('−', 0.08, '#9fc8ff', INX - 1.05, AY + 0.78, 0.1), 'rod'), grp(tag('+', 0.08, '#ffb08a', INX + 1.05, AY + 0.78, 0.1), 'rod')];
      const ions = Array.from({ length: 10 }, (_, i) => { const na = i % 2 === 0, b = add(K.solid(new THREE.SphereGeometry(na ? 0.08 : 0.12, 24, 16), M.gloss(na ? 0x8c6fd8 : 0x6fd07a))); const l = K.label(na ? '+' : '−', 0.1, '#ffffff', 800); l.position.z = 0.13; l.renderOrder = 22; l.userData.mark = true; b.add(l); return { b, na, x0: INX + (hash(i, 1) - 0.5) * 1.4, y0: AY + ((i % 5) - 2) * 0.2 + (hash(i, 2) - 0.5) * 0.06 }; });
      const lN = tag('Na⁺ to the − rod, Cl⁻ to the + rod', 0.05, '#ffffff', INX, AY - 0.86, 0.1);
      beats.push((t) => {
        const u = ease(span(t, IND + 1.6, IND + 5.6));
        ions.forEach(({ b, na, x0, y0 }, i) => { const to = INX + (na ? -0.88 + 0.13 * (i % 3) : 0.84 - 0.13 * (i % 3)); b.position.set(lerp(x0, to, u) + 0.02 * Math.sin(t * 3 + i), y0 + 0.02 * Math.cos(t * 2.4 + i), 0.05); });
        signs.forEach((l) => K.popIn(l, t, IND + 0.8, DS0)); K.popIn(lN, t, IND + 3.0, DS0);
        void rods;
      });
    }

    // ================================================================ DISSOLVE · sugar in water; oil in water and in benzene
    {
      U.stage((t) => t >= DS0 - 0.05 && t < MT0 - 0.05); ST.bake(U.root, 'diss', DSX, 1.7, 0.8);
      const BX = [DSX - 0.55, DSX, DSX + 0.55];
      BX.forEach((x) => add(K.beaker(0.12, 0.24), x, 0, 0));
      const liq = [add(K.liquid(0.115, 0.16, 0x3d9ee6, 0.55), BX[0], 0.052, 0), add(K.liquid(0.115, 0.16, 0x3d9ee6, 0.55), BX[1], 0.052, 0), add(K.liquid(0.115, 0.16, 0xe9eef2, 0.35), BX[2], 0.052, 0)];
      const cube = add(sugarCubes(1)); const oilL = add(K.liquid(0.112, 0.04, 0xe0a83a, 0.8), BX[1], 0.216, 0), oilB = add(K.liquid(0.112, 0.001, 0xe0a83a, 0.45), BX[2], 0.052, 0);
      const drops = [1, 2].map((k) => add(K.solid(new THREE.SphereGeometry(0.02, 14, 10), M.liquid(0xe0a83a, 0.85), { outline: false })));
      const lb = [grp(tag('water', 0.04, '#9fd2ff', BX[0], 0.33, 0.12), 'b'), grp(tag('water', 0.04, '#9fd2ff', BX[1], 0.33, 0.12), 'b'), grp(tag('benzene', 0.04, '#ffffff', BX[2], 0.33, 0.12), 'b')];
      const lS = tag('sugar dissolves: polar in polar ✓', 0.045, '#ffd27a', DSX, 0.44, 0.1), lO = tag('oil stays on top', 0.045, '#ffffff', BX[1], 0.42, 0.1), lB = tag('oil mixes: non-polar in non-polar ✓', 0.045, '#ffd27a', DSX, 0.44, 0.1);
      const C0 = DS0 + 2.6, O0 = C0 + 3.4, B0 = O0 + 3.4;
      beats.push((t) => {
        const fall = easeIn(span(t, C0, C0 + 0.6)), gone = ease(span(t, C0 + 0.8, C0 + 2.4)); cube.position.set(BX[0], lerp(0.5, 0.06, fall), 0); cube.visible = t > C0 - 0.2 && gone < 1; cube.scale.setScalar(Math.max(1e-4, 1 - gone));
        [O0, B0].forEach((t0, k) => { const d = drops[k], u = easeIn(span(t, t0, t0 + 0.6)); d.visible = t > t0 - 0.2 && u < 1; d.position.set(BX[k + 1], lerp(0.5, 0.22, u), 0); });
        oilL.visible = t > O0 + 0.6; oilL.scale.y = Math.max(1e-4, ease(span(t, O0 + 0.6, O0 + 1.4)));
        oilB.visible = t > B0 + 0.6; liq[2].userData.mat?.color?.setHex?.(0xe9eef2);
        oilB.scale.y = Math.max(1e-4, 150 * ease(span(t, B0 + 0.6, B0 + 2.0)));   // the mixed oil stays just under the surface (no shared plane)
        lb.forEach((l) => K.popIn(l, t, DS0 + 2.5, C0 + 0.4)); K.popIn(lS, t, C0 + 2.0, O0 + 0.2); K.popIn(lO, t, O0 + 1.2, B0 + 0.2); K.popIn(lB, t, B0 + 2.0, MT0);
      });
    }

    // ================================================================ METALS · malleable, ductile, lustrous, sonorous, conducts, mercury
    {
      U.stage((t) => t >= MT0 - 0.05 && t < AC0 - 0.05); ST.bake(U.root, 'metal', MTX, 1.8, 0.85);
      const anvil = add(K.anvil(), MTX - 0.45, 0, 0); anvil.scale.setScalar(0.7);
      const AT = MTX - 0.45, TOP = 0.7 * 0.36;
      const lump = add(K.solid(new THREE.SphereGeometry(0.035, 24, 16), copperM), AT, TOP + 0.03, 0), ham = add(K.hammer(0.36));
      const wire = add(K.solid(new THREE.CylinderGeometry(0.01, 0.01, 1, 16).rotateZ(Math.PI / 2), copperM), MTX + 0.1, 0.12, 0);
      const clamps = [-1, 1].map((sd) => add(K.solid(new THREE.BoxGeometry(0.06, 0.05, 0.06), M.metal(0x6a7078, 0.4)), MTX + 0.1 + sd * 0.1, 0.12, 0));
      const twinkle = add(K.sparkle(0xfff2c0, 0.16), AT + 0.02, TOP + 0.02, 0.06);
      const rings = Array.from({ length: 3 }, () => { const r = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.004, 6, 48), new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0 })); add(r, MTX + 0.1, 0.12, 0.02); return r; });
      const hg = add(K.solid(new THREE.SphereGeometry(0.035, 24, 16), new THREE.MeshPhysicalMaterial({ color: 0xd8dde4, metalness: 1, roughness: 0.06 })), MTX + 0.55, 0.022, 0); hg.scale.y = 0.6; add(K.dish(0.08), MTX + 0.55, 0, 0);
      const L = [['malleable: beaten into a sheet ✓', AT, TOP + 0.16], ['ductile: drawn into a wire ✓', MTX + 0.1, 0.24], ['lustrous: a shiny surface ✓', AT, TOP + 0.16], ['sonorous: it rings when struck ✓', MTX + 0.1, 0.27], ['mercury: the only liquid metal', MTX + 0.55, 0.12]].map(([s, x, y]) => tag(s, 0.05, '#ffd27a', x, y, 0.08));
      const HM = MT0 + 3.0, DR = HM + 4.6, LU = DR + 4.6, SO = LU + 4.0, HG = SO + 4.6;
      beats.push((t) => {
        // the hammer swings (anticipation, hit, bounce) three times; the lump spreads into a sheet
        const hits = [0, 1, 2].map((k) => HM + k * 0.8); let lift = 0.3; hits.forEach((h) => { const u = span(t, h - 0.5, h + 0.3); if (u > 0 && u < 1) lift = u < 0.62 ? 0.3 + 0.08 * Math.sin(Math.PI * u / 0.62) - 0.3 * easeIn(span(u, 0.45, 0.62)) : lerp(0.0, 0.3, ease(span(u, 0.62, 1))); });
        ham.visible = t > HM - 1.0 && t < HM + 2.6; ham.position.set(AT - 0.38, TOP + 0.09, 0.02); ham.rotation.z = -Math.PI / 2 + 1.4 * lift;   // grip on the left; the face comes down onto the lump
        const fl = hits.filter((h) => t > h).length / 3; lump.scale.set(1 + 1.6 * fl, Math.max(0.15, 1 - 0.85 * fl), 1 + 1.6 * fl); lump.position.y = TOP + 0.03 * Math.max(0.15, 1 - 0.85 * fl);
        // the clamps pull apart: the rod gets long and thin
        const pull = ease(span(t, DR, DR + 2.0)); clamps.forEach((c, i) => { c.position.x = MTX + 0.1 + (i ? 1 : -1) * (0.08 + 0.16 * pull); }); wire.scale.set(0.16 + 0.3 * pull, 1 - 0.5 * pull, 1 - 0.5 * pull);
        twinkle.visible = t > LU && t < LU + 3.0; twinkle.scale.setScalar(0.16 * (0.6 + 0.4 * Math.sin(t * 9))); twinkle.material.rotation = t;
        rings.forEach((r, i) => { const u = ((t - SO - i * 0.4) % 1.2) / 1.2; r.visible = t > SO && t < SO + 3.4 && u > 0; r.scale.setScalar(1 + 3 * u); r.material.opacity = 0.8 * (1 - u); });
        hg.scale.set(1 + 0.05 * Math.sin(t * 4), 0.6 - 0.03 * Math.sin(t * 4), 1 + 0.05 * Math.sin(t * 4));
        [HM + 2.0, DR + 2.2, LU + 0.4, SO + 0.6, HG].forEach((a, i) => K.popIn(L[i], t, a, i < 4 ? [DR + 0.4, LU, SO, HG][i] - 0.1 : AC0));
      });
    }

    // ================================================================ ACT (dark) · Activity 4.4: property → name → use
    {
      U.stage((t) => t >= AC0 - 0.05 && t < BACK - 0.05); keyLight(ACX, AY + 0.1);
      const ROWS = [['drawn into wires', 'ductile', 'electric wires'], ['bent into shape', 'malleable', 'car bodies, foil'], ['reflect light', 'lustrous', 'mirrors, jewellery'], ['ring when struck', 'sonorous', 'bells'], ['let electricity pass', 'conductor', 'cables'], ['heavy for their volume', 'dense', 'weights'], ['transfer heat well', 'heat conductor', 'cooking pots']];
      const XS = [ACX - 1.85, ACX, ACX + 1.85], cols = ['#ffffff', '#ffd27a', '#9fc8ff'];
      const head = ['property', 'name', 'use'].map((s, i) => grp(tag(s, 0.04, '#8fa3c0', XS[i], AY + 0.95, 0.1), 'acth'));
      const cells = ROWS.map((r, j) => r.map((s, i) => tag(s, 0.044, cols[i], XS[i], AY + 0.62 - j * 0.3, 0.1)));
      beats.push((t) => {
        head.forEach((l) => K.popIn(l, t, AC0 + 2.4, BACK));
        cells.forEach((r, j) => r.forEach((l, i) => { l.userData.group = 'act'; K.popIn(l, t, AC0 + 3.0 + j * 1.7 + i * 0.5, BACK); }));
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Why do salt, sugar and copper behave so differently?', dockTitle: 'Properties', intro: INTRO, ticks: TICKS,
      rows: [[0, 'salt: ionic · sugar: covalent · copper: metallic'], [1, 'heat: salt melts far higher'], [1, 'current: salt water conducts, sugar water not'], [1, 'dissolving: polar in polar, non-polar in non-polar'], [1, 'metals: sheet, wire, shine, ring, conduct'], [1, 'Activity 4.4: property, name, use']],
      short: ['melting', 'conducting', 'dissolving', 'metals', 'Activity 4.4'] }));
    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));
    return U.finish();
  },
};
