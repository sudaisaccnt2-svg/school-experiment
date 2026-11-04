// Lesson 401 · Why Atoms Bond (book pp. 92–93: Introduction, 4.1 Why do atoms form chemical bonds?, 4.1.1 the valence
// concept of Lewis and Kossel, (a) octet rule, (b) duplet rule, noble gases, Fig. 4.1). v1 as a code lesson (2026-11-04),
// replacing the old Blender film (ball on a ramp, flat ring atoms, bottom captions). Built from SKILL.md §0 + §1 + §4.
// THE QUESTION (book p.92, heading 4.1): "Why do atoms form chemical bonds?" → card, docked panel, four ticks:
//   lower energy · full outer shell · lose, gain or share · octet · duplet.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a glass of water, a salt shaker, a jar of hydrogen · "all around us, atoms are held together" (book
//         intro: things are found combined; the force that holds them is the bond) · so WHY do they hold on? → card.
//  FLOW   the book's own examples, one bench each (question → before named → visible cause → result ✓ on the thing):
//         water up high, tap shut → the tap turns → water runs down the tube into the low beaker until the top is
//         empty → "water flows down ✓"; hot tea 80 °C → 1, 2, 3 minutes pass, steam rises, the red column falls → "heat
//         flows out ✓"; battery + bulb off → the loose wire is lowered onto the battery → pulses run, bulb lights →
//         "current flows ✓" · everything goes down to lower energy · "Atoms lower their energy too" → dive INTO the jar
//         of hydrogen we saw at the start.
//  H₂     (dark, inside the jar) two loose hydrogen atoms, an energy meter full · they come together, their electrons
//         pair up between them, a burst of light flies out (energy given out), the meter drops · "H₂: less energy,
//         stable ✓", the shared pair is "the chemical bond" · ✓ lower energy. Bridge: "Which atoms never need to bond?"
//  NOBLE  baked table: a helium balloon, a neon sign, a glowing bulb (argon) · named one at a time · "they rarely react"
//         → dive INTO the neon light: a neon atom, its outer electrons counted one by one → 8 · the atom shrinks into
//         its tile and the periodic table builds round it · column VIIIA glows (noble gases) · their four tiles fly down
//         and grow into Fig. 4.1: He 2 · Ne 8 · Ar 8 · Kr 8 · "a full outer shell: very stable" · ✓ full outer shell.
//  HOW    back at the first table: "How do other atoms get there?" · "Lose, gain or share electrons (Lewis and Kossel)"
//         → dive INTO the salt: sodium 2,8,1 gives its one outer electron to chlorine 2,8,7 (gold electron flies across)
//         → Na⁺ has 2,8 "like neon ✓", Cl⁻ has 2,8,8 "like argon ✓" (lose ✓, gain ✓) → back out, dive INTO the water:
//         oxygen has 6 outside; two hydrogen atoms come in from the sides, each shares a pair → "shared pairs" ✓ (share)
//         → the 8 electrons round oxygen are counted → "8 outside: octet ✓"; each hydrogen now has 2 "duplet ✓, like
//         helium" · ✓ lose · gain · share, ✓ octet · duplet.
//  END    the first table again: "Bonds lower energy and fill outer shells ✓".
// Game (🎮 Bond Builder, docs/COVERAGE_U4.md): O₂/O₃ and H₂O/CO₂ examples, the two concepts (valence, orbital),
//   G. N. Lewis, "inert gases", group VIIIA members, octet/duplet sorting.
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U4.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

const TAN = Math.tan(16 * Math.PI / 180), ASP = 1.6, ADIR = [0, 0.5, 1], DDIR = [0, 0.12, 1];
let DOCK = 1e9;
/** a shot: the subject (look, w × h) seen along dir; the engine refits it to the real screen (fit = 6th element) */
function S(t, look, w, h, dir = ADIR, e) {
  h *= 1.14; look = [look[0], look[1] + 0.05 * h, look[2]];
  const dk = t >= DOCK, d = V(...dir).normalize(), dist = Math.max(h / 2 / TAN, (dk ? w / (1 - K.DOCK_W) : w) / 2 / (TAN * ASP)) * 1.1;
  const pos = V(...look).addScaledVector(d, dist).toArray(), fit = { look, w, h, dir, dock: dk ? K.DOCK_W : 0 };
  return dk ? [t, ...K.dockShot(pos, look), undefined, e, fit] : [t, pos, look, undefined, e, fit];
}

// ---------------------------------------------------------------- places (benches 12 apart; dark scenes at height AY)
const AY = 1.9;
const HKX = 0, WGX = HKX - 0.58, SSX = HKX, HJX = HKX + 0.58;          // hook table: water glass · salt shaker · hydrogen jar
const FLX = 12, HTX = 24, ELX = 36, NBX = 48;                           // water flow · hot tea · battery + bulb · noble gases
const H2X = 60, NEX = 72, SAX = 96, WAX = 108;                          // (dark) H₂ · neon + periodic table · salt · water

// ---------------------------------------------------------------- time (every camera move ≥ 2 s; one place at a time)
const T = { card: 11.0 };
DOCK = T.card + 5.0;
const F0 = 16.4, H0 = 29.0, E0 = 38.6, B0 = 45.6, HD = 49.4, N0 = 63.6, ND = 75.2, NR = 87.2, W0 = 100.6, SD = 108.8, WB = 122.8, WD = 125.8;
T.end = 144.0; T.done = 153.0;
const INTRO = [T.card, DOCK];
const TICKS = [[60.6, 0], [99.0, 1], [134.6, 2], [141.6, 3]];
const DARK = [[HD, N0], [ND, W0], [SD, WB], [WD, T.end]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);

// ---------------------------------------------------------------- the periodic table (for the noble gases): Ne sits where the neon atom was
const NEY = 7.4, TP = 0.5, COL = (c) => NEX + (c - 18) * TP, TY = (r) => (r <= 7 ? NEY - (r - 2) * TP : NEY - 5 * TP - 0.3 - (r - 8) * TP);
function place(z) {
  if (z === 1) return [1, 1]; if (z === 2) return [1, 18];
  const P = [[3, 10, 2], [11, 18, 3], [19, 36, 4], [37, 54, 5], [55, 86, 6], [87, 118, 7]];
  for (const [a, b, r] of P) if (z >= a && z <= b) {
    if (r <= 3) { const k = z - a; return [r, k < 2 ? k + 1 : k + 11]; }
    if (r <= 5) return [r, z - a + 1];
    if (z >= a + 2 && z <= a + 16) return [r + 2, z - a + 1];          // La/Ac … the f-block rows below
    return [r, z < a + 2 ? z - a + 1 : z - a - 13];
  }
}
const ROW = [[65.3, 2, 'He', 0.28], [66.34, 10, 'Ne', 0.46], [67.74, 18, 'Ar', 0.64], [69.5, 36, 'Kr', 0.82]];   // Fig. 4.1 row (x, Z, symbol, outer radius)
const ROWY = NEY - 5.3, ROWX = 67.45;

const captions = [
  [5.6, 10.8, 'Atoms are held together in all of them', [HKX, 0.7, 0.05]],
  [F0 + 0.4, F0 + 3.0, 'Which way does water go?', [FLX - 0.1, 0.92, 0.05]],
  [H0 + 0.2, H0 + 2.0, 'Which way does heat go?', [HTX, 0.84, 0.05]],
  [E0 + 0.1, E0 + 1.7, 'And electricity?', [ELX, 0.66, 0.05]],
  [B0 + 0.3, HD - 0.3, 'Atoms also go to lower energy', [HJX, 0.78, 0.05]],
  [N0 + 7.2, N0 + 9.6, 'Noble gases: they rarely react', [NBX, 0.92, 0.05]],
  [N0 + 9.6, ND - 0.1, 'Why? Look inside the neon light', [NBX + 0.05, 0.92, 0.05]],
  [NR + 10.4, W0 - 0.2, 'A full outer shell: very stable', [ROWX, ROWY + 1.55, 0]],
  [W0 + 0.3, W0 + 3.0, 'How do other atoms get there?', [HKX, 0.7, 0.05]],
  [W0 + 3.0, SD - 0.3, 'They lose, gain or share electrons', [HKX, 0.7, 0.05]],
  [WB + 0.2, WD - 0.3, 'Now the water: sharing', [WGX, 0.66, 0.05]],
  [T.end + 0.6, T.done, 'Bonds lower energy and fill outer shells ✓', [HKX, 0.74, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX, 0.3, 0.05], 1.95 * k, 0.82 * k, ADIR, e);
const BN = (t, x, w, h, y, k = 1, e) => S(t, [x, y, 0.05], w * k, h * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const JAR = [HJX, 0.3, 0.02], SALT = [SSX, 0.17, 0.02], WATER = [WGX, 0.2, 0.02], NEON = [NBX + 0.06, 0.34, 0.02];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), HK(F0 - 0.05, 0.99),
  // the three flows: one bench each, a cut on the move, a slow push toward the result
  BN(F0, FLX, 1.45, 0.9, 0.36, 1.06), BN(H0 - 0.05, FLX, 1.45, 0.9, 0.34, 0.95),
  BN(H0, HTX, 1.05, 0.95, 0.36, 1.05), BN(E0 - 0.05, HTX, 1.05, 0.95, 0.34, 0.95),
  BN(E0, ELX, 1.15, 0.78, 0.3, 1.05), BN(B0 - 0.05, ELX, 1.15, 0.78, 0.28, 0.96),
  // back to the jar of hydrogen and into it
  HK(B0, 1.0), S(B0 + 2.2, JAR, 0.4, 0.58), S(HD - 1.2, JAR, 0.36, 0.46), DIVE(HD - 0.05, JAR),
  DK(HD, H2X + 0.4, 3.9, 2.0, 0.3), DK(HD + 1.8, H2X + 0.4, 3.9, 2.0, 1.04, 'out'), DK(N0 - 0.05, H2X + 0.4, 3.9, 2.0, 0.96),
  // the noble gases table, into the neon light
  BN(N0, NBX, 1.75, 0.95, 0.36, 1.05), BN(N0 + 9.4, NBX, 1.75, 0.95, 0.36, 0.98), S(N0 + 11.6, NEON, 0.5, 0.42), DIVE(ND - 0.05, NEON),
  DK(ND, NEX, 1.9, 1.6, 0.3, undefined, NEY), DK(ND + 1.8, NEX, 1.9, 1.6, 1.04, 'out', NEY), DK(ND + 5.4, NEX, 1.9, 1.6, 0.97, undefined, NEY),
  DK(ND + 7.8, COL(9.5), 9.8, 5.0, 1.02, undefined, TY(4.3)), DK(NR - 0.05, COL(9.5), 9.8, 5.0, 0.98, undefined, TY(4.3)),
  DK(NR + 2.2, ROWX, 5.4, 2.3, 1.03, undefined, ROWY - 0.15), DK(W0 - 0.05, ROWX, 5.4, 2.3, 0.97, undefined, ROWY - 0.15),
  // how: back at the first table, into the salt; out, into the water
  HK(W0, 1.04), HK(W0 + 3.0, 1.0), S(W0 + 5.4, SALT, 0.34, 0.36), DIVE(SD - 0.05, SALT),
  DK(SD, SAX, 3.9, 2.1, 0.3), DK(SD + 1.8, SAX, 3.9, 2.1, 1.04, 'out'), DK(WB - 0.05, SAX, 3.9, 2.1, 0.97),
  HK(WB, 1.02), S(WB + 2.0, WATER, 0.38, 0.4), DIVE(WD - 0.05, WATER),
  DK(WD, WAX, 2.6, 2.2, 0.3, undefined, AY - 0.2), DK(WD + 1.8, WAX, 2.6, 2.2, 1.04, 'out', AY - 0.2), DK(T.end - 0.05, WAX, 2.6, 2.2, 0.96, undefined, AY - 0.2),
  // END: the first table, a slow push in
  HK(T.end, 1.06), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '401', { dark, AY }), { beats, ST, add, tag, grp, keyLight, electron, goldE, blueE, fatom, ringFlash } = U;
    const stage = U.stage;
    const bump = U4.bump, rest = U4.rest;

    // ================================================================ HOOK / HOW / END · water, salt, hydrogen
    {
      stage((t) => t < F0 - 0.05 || (t >= B0 - 0.05 && t < HD - 0.05) || (t >= W0 - 0.05 && t < SD - 0.05) || (t >= WB - 0.05 && t < WD - 0.05) || t >= T.end - 0.05);
      ST.bake(U.root, 'hook', HKX, 2.2, 1.0);
      add(K.beaker(0.13, 0.3), WGX, 0, 0); const wl = add(K.liquid(0.125, 0.22, 0x3d9ee6, 0.55), WGX, 0.052, 0);
      const sh = add(K.saltShaker(0.26, 0.06), SSX, 0, 0); sh.userData.fill(0);
      const jar = add(K.gasJar(0xeef4ff, 0.14, 0.5), HJX, 0, 0); jar.userData.gas.opacity = 0.05;
      const wisp = K.gasCloud(0xf4f8ff, 10); jar.add(wisp);
      const lW = tag('water', 0.05, '#9fd2ff', WGX, 0.42, 0.08), lS = tag('salt', 0.05, '#ffffff', SSX, 0.4, 0.08), lH = tag('hydrogen', 0.05, '#ffffff', HJX, 0.66, 0.08);
      beats.push((t) => {
        wl.userData.top.position.y = 0.22 + 0.003 * Math.sin(t * 2.1);
        wisp.userData.update(t, 0.08, 0.44, 0.12, 0.55);
        K.popIn(lW, t, 0.6, F0); K.popIn(lS, t, 2.2, F0); K.popIn(lH, t, 3.8, F0);
      });
    }

    // ================================================================ FLOW · water runs down from the high beaker
    {
      stage((t) => t >= F0 - 0.05 && t < H0 - 0.05); ST.bake(U.root, 'flow', FLX, 1.8, 0.9);
      const UX = FLX - 0.42, LX = FLX + 0.42, BLK = 0.34;
      add(K.solid(new THREE.BoxGeometry(0.34, BLK, 0.3), M.matte(0x8c8a86, 0.85)), UX, BLK / 2, 0);
      add(K.beaker(0.14, 0.3), UX, BLK + 0.002, 0); const up = add(K.liquid(0.135, 1, 0x3d9ee6, 0.55), UX, BLK + 0.052, 0);
      add(K.beaker(0.14, 0.3), LX, 0, 0); const lo = add(K.liquid(0.135, 1, 0x3d9ee6, 0.55), LX, 0.052, 0);
      const path = [[UX + 0.18, BLK + 0.09], [UX + 0.3, BLK + 0.08], [FLX + 0.05, 0.4], [LX - 0.1, 0.39], [LX - 0.02, 0.37], [LX, 0.34]].map(([x, y]) => V(x, y, 0));
      const curve = new THREE.CatmullRomCurve3(path), glassT = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.016, 10), M.glass()); glassT.renderOrder = 5; U.root.add(glassT);
      const inT = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.009, 8), M.liquid(0x3d9ee6, 0.8)); inT.renderOrder = 4; U.root.add(inT);
      const tapX = UX + 0.34, tap = add(new THREE.Group(), tapX, BLK + 0.08, 0);
      tap.add(K.solid(new THREE.CylinderGeometry(0.026, 0.026, 0.05, 20).rotateX(Math.PI / 2), M.metal(0xb9bec6, 0.3)));
      const handle = K.solid(new THREE.BoxGeometry(0.11, 0.022, 0.022), M.gloss(0xc0392b)); handle.position.z = 0.04; tap.add(handle);
      const stream = add(K.solid(new THREE.CylinderGeometry(0.011, 0.009, 1, 12).translate(0, -0.5, 0), M.liquid(0x5bb0f0, 0.9), { outline: false }), LX, 0.34, 0);
      const spl = add(K.splash(0xffffff, 0.5), LX, 0.1, 0);
      const lHigh = grp(tag('up high', 0.05, '#ffffff', UX, 0.74, 0.08), 'lv'), lLow = grp(tag('down low', 0.05, '#ffffff', LX, 0.44, 0.08), 'lv');
      const lTap = tag('tap opens', 0.045, '#ffd27a', tapX, 0.53, 0.1), lRes = tag('water flows down ✓', 0.055, '#ffffff', FLX + 0.1, 0.66, 0.12);
      const tOpen = F0 + 4.4, tFlow = tOpen + 0.7, tEnd = H0 - 2.2;
      beats.push((t) => {
        handle.rotation.z = -Math.PI / 2 * ease(span(t, tOpen, tOpen + 0.6));
        const run = span(t, tFlow, tFlow + 0.9); inT.geometry.setDrawRange(0, Math.floor(64 * run) * 8 * 6);
        const k = ease(span(t, tFlow + 0.9, tEnd)), uh = lerp(0.24, 0.035, k), lh = lerp(0.035, 0.22, k);
        up.scale.y = uh; lo.scale.y = lh; up.userData.top.position.y = 1 + 0.004 * Math.sin(t * 3) / uh;
        const fall = t > tFlow + 0.85 && t < tEnd + 0.15; stream.visible = fall; stream.scale.y = Math.max(1e-4, (0.34 - 0.052 - lh) * Math.min(1, span(t, tFlow + 0.85, tFlow + 1.05) * 1.0001));
        spl.visible = t > tFlow + 1.0 && t < tFlow + 2.0; spl.position.y = 0.052 + lh; spl.userData.update(t - tFlow - 1.0);
        K.popIn(lHigh, t, F0 + 2.0, tOpen - 0.3); K.popIn(lLow, t, F0 + 2.0, tOpen - 0.3); K.popIn(lTap, t, tOpen - 0.2, tFlow + 1.6); K.popIn(lRes, t, tEnd - 1.6, H0);
      });
    }

    // ================================================================ HEAT · a hot cup of tea cools down
    {
      stage((t) => t >= H0 - 0.05 && t < E0 - 0.05); ST.bake(U.root, 'heat', HTX, 1.4, 0.9);
      const CX = HTX - 0.08;
      add(K.beaker(0.13, 0.24), CX, 0, 0); add(K.liquid(0.125, 0.18, 0x9a4e1a, 0.78), CX, 0.052, 0);
      const th = add(K.thermometer(0.46, 100), CX + 0.05, 0.07, 0.02); th.rotation.z = -0.12;
      const steam = add(K.smoke(10, 0xffffff), CX - 0.02, 0.26, 0); steam.scale.setScalar(0.16);
      const lHot = tag('hot tea: 80 °C', 0.05, '#ffb08a', CX - 0.05, 0.62, 0.1);
      const mins = ['1 minute', '2 minutes', '3 minutes'].map((s) => tag(s, 0.045, '#ffd27a', HTX + 0.36, 0.36, 0.1));
      const lRes = tag('heat flows out ✓', 0.055, '#ffffff', CX, 0.62, 0.12);
      const M0 = H0 + 3.9;
      beats.push((t) => {
        const k = ease(span(t, M0, M0 + 3.9)); th.userData.set(lerp(80, 35, k));
        steam.userData.update(t, 1 - 0.75 * k);
        K.popIn(lHot, t, H0 + 2.0, M0 - 0.1); mins.forEach((l, i) => K.popIn(l, t, M0 + i * 1.3, M0 + i * 1.3 + 1.25)); K.popIn(lRes, t, M0 + 4.0, E0);
      });
    }

    // ================================================================ ELECTRICITY · the loose wire is lowered onto the battery
    {
      stage((t) => t >= E0 - 0.05 && t < B0 - 0.05); ST.bake(U.root, 'elec', ELX, 1.5, 0.8);
      const BX = ELX - 0.3, LBX = ELX + 0.34;
      const bat = add(K.battery(), BX, 0, 0); bat.scale.setScalar(0.42); bat.children.forEach((c) => { if (c.isSprite || c.userData.text) c.visible = false; });
      const blb = add(K.bulb(), LBX, 0, 0); blb.scale.setScalar(0.5); blb.userData.set(0);
      const wB = add(K.wire([[BX + 0.06, 0.012, 0.04], [ELX, 0.012, 0.1], [LBX - 0.06, 0.012, 0.04], [LBX - 0.02, 0.05, 0]], 0x2c2f36, 0.008));
      const TOPY = 0.42 * 0.835 + 0.018, hang = add(new THREE.Group(), BX, TOPY, 0);
      const wT = K.wire([[0, 0, 0], [0.02, 0.07, 0], [0.18, 0.16, 0], [0.5, 0.13, 0], [LBX - BX + 0.03, 0.06, 0]], 0xb8442f, 0.008); hang.add(wT);
      const pr = add(K.pulses(wT.userData.curve, 8, 0xffd27a), BX, TOPY, 0);
      const lOff = grp(tag('battery', 0.045, '#ffffff', BX, 0.52, 0.08), 'el'), lB = grp(tag('bulb off', 0.045, '#ffffff', LBX, 0.52, 0.08), 'el');
      const lW = tag('wire touches', 0.045, '#ffd27a', BX + 0.02, 0.5, 0.1), lRes = tag('current flows ✓', 0.055, '#ffffff', ELX + 0.05, 0.62, 0.12);
      const tDown = E0 + 3.4, tOn = tDown + 0.9;
      beats.push((t) => {
        const d = 1 - ease(span(t, tDown, tDown + 0.8)); hang.position.y = TOPY + 0.09 * d; hang.rotation.z = 0.12 * d;
        pr.position.copy(hang.position); pr.rotation.copy(hang.rotation); pr.userData.update(t, span(t, tOn, tOn + 0.8), t > tOn ? 1 : 0);
        blb.userData.set(ease(span(t, tOn + 0.6, tOn + 1.0)));
        K.popIn(lOff, t, E0 + 1.7, tDown - 0.1); K.popIn(lB, t, E0 + 1.7, tDown - 0.1); K.popIn(lW, t, tDown - 0.05, tOn + 0.6); K.popIn(lRes, t, tOn + 0.7, B0);
      });
    }

    // ================================================================ H₂ (dark, inside the jar) · two atoms join, light flies out, the meter drops
    {
      stage((t) => t >= HD - 0.05 && t < N0 - 0.05); keyLight(H2X);
      const A = fatom([1], 1, 0, { a0: [0], r0: 0.46, nr: 0.34 }), B = fatom([1], 1, 0, { a0: [Math.PI], r0: 0.46, nr: 0.34 }); U.root.add(A.g, B.g);
      const bar = add(K.energyBar(1.3, 0.08), H2X + 2.0, AY - 0.7, 0);
      const flash = add(K.glowSprite(0xffd27a, 1.2), H2X, AY, 0.1), sparks = Array.from({ length: 10 }, (_, i) => ({ s: add(K.glowSprite(0xffc04d, 0.22), H2X, AY, 0.05), a: i / 10 * Math.PI * 2 + 0.3 }));
      const lTwo = tag('two hydrogen atoms', 0.06, '#ffffff', H2X, AY + 0.62, 0.1), lE = tag('energy', 0.055, '#ffd27a', H2X + 2.0, AY + 0.8, 0.1);
      const lOut = tag('energy given out', 0.055, '#ffd27a', H2X + 1.3, AY + 0.82, 0.1), lRes = tag('H₂: less energy, stable ✓', 0.06, '#ffffff', H2X + 0.35, AY + 0.66, 0.1);
      const lBond = tag('the bond: a shared pair', 0.055, '#ffd27a', H2X, AY - 0.5, 0.1);
      const J0 = HD + 4.8, J1 = J0 + 2.6, FL = J1 - 0.2;
      beats.push((t) => {
        const j = ease(span(t, J0, J1)), half = lerp(1.25, 0.36, j);
        A.g.position.set(H2X - half, AY, 0); B.g.position.set(H2X + half, AY, 0.015);   // never the same plane (flicker)
        const tm = rest(t, J0, J1); A.update(tm); B.update(tm);
        const m = ease(span(t, J1 - 0.9, J1 + 0.2));
        A.es[0].to = V(half, 0.05, 0.03); A.es[0].u = m; B.es[0].to = V(-half, -0.05, 0.03); B.es[0].u = m;
        const f = span(t, FL, FL + 1.3); flash.visible = f > 0 && f < 1; flash.scale.setScalar(0.4 + 2.2 * f); flash.material.opacity = 0.9 * (1 - f);
        sparks.forEach(({ s, a }) => { const u = span(t, FL + 0.1, FL + 1.7); s.visible = u > 0 && u < 1; s.position.set(H2X + Math.cos(a) * 1.5 * ease(u), AY + Math.sin(a) * 1.1 * ease(u), 0.05); s.material.opacity = 0.9 * (1 - u); });
        bar.userData.set(lerp(0.92, 0.38, ease(span(t, FL + 0.2, FL + 1.8))));
        const pairGlow = span(t, FL + 6.0, FL + 6.4); A.es[0].e.material = B.es[0].e.material = pairGlow > 0 ? goldE : blueE;
        K.popIn(lTwo, t, HD + 0.6, HD + 2.8); K.popIn(lE, t, HD + 2.8, J0 - 0.1); K.popIn(lOut, t, FL + 0.3, FL + 2.4); K.popIn(lRes, t, FL + 2.5, FL + 5.8); K.popIn(lBond, t, FL + 6.0, N0);
      });
    }

    // ================================================================ NOBLE table · helium balloon, neon sign, argon bulb
    {
      stage((t) => t >= N0 - 0.05 && t < ND - 0.05); ST.bake(U.root, 'noble', NBX, 2.0, 0.9);
      const bal = add(K.balloon(0xc9a6ff, 0.12), NBX - 0.6, 0, 0);
      const pts = []; for (let i = 0; i <= 24; i++) { const u = i / 24; pts.push([NBX + 0.06 - 0.26 + 0.52 * u, 0.24 + 0.1 * Math.sin(u * Math.PI * 3)]); }
      const sign = add(K.neonSign(pts.map(([x, y]) => [x - NBX - 0.06, y]), 0xff5a2a), NBX + 0.06, 0, 0); sign.userData.set(1);
      const lamp = add(K.bulb(), NBX + 0.62, 0, 0); lamp.scale.setScalar(0.42);
      const lHe = tag('helium', 0.05, '#e0ccff', NBX - 0.6, 0.86, 0.08), lNe = tag('neon', 0.05, '#ffb8a0', NBX + 0.06, 0.5, 0.08), lAr = tag('argon', 0.05, '#ffffff', NBX + 0.62, 0.5, 0.08);
      beats.push((t) => {
        bal.userData.update(t); lamp.userData.set(0.55 + 0.05 * Math.sin(t * 7)); sign.userData.set(0.9 + 0.1 * Math.sin(t * 11) * Math.sin(t * 3.1));
        K.popIn(lHe, t, N0 + 0.6, ND); K.popIn(lNe, t, N0 + 2.8, ND); K.popIn(lAr, t, N0 + 5.0, ND);
      });
    }

    // ================================================================ NEON (dark) · count 8, the atom becomes its tile, the table, Fig. 4.1
    {
      stage((t) => t >= ND - 0.05 && t < W0 - 0.05); keyLight(NEX, NEY); keyLight(ROWX, ROWY);
      const ne = fatom([2, 8], 10, 10, { r0: 0.3, dr: 0.28, nr: 0.13 }); add(ne.g, NEX, NEY, 0);
      const outer = ne.es.filter((x) => x.s === 1), lNe = tag('neon atom', 0.06, '#ffb8a0', NEX, NEY + 0.82, 0.1), l8 = tag('8 outside', 0.07, '#ffd27a', NEX, NEY + 0.82, 0.1);
      const C0 = ND + 2.2, SHR = ND + 5.4;
      // the table builds round the neon tile; group VIIIA in noble purple with symbols
      const NOB = { 2: 'He', 10: 'Ne', 18: 'Ar', 36: 'Kr', 54: 'Xe', 86: 'Rn' }, others = [], nob = {};
      for (let z = 1; z <= 118; z++) { const [r, c] = place(z); if (NOB[z]) nob[z] = { r, c }; else others.push({ r, c }); }
      const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(0.44, 0.44, 0.08), M.gloss(0x5c6472), others.length); add(inst);
      const built = (t, r, c) => back(span(t, SHR + 0.8 + Math.abs(c - 18) * 0.05 + Math.abs(Math.min(r, 7) - 2) * 0.04, SHR + 1.15 + Math.abs(c - 18) * 0.05 + Math.abs(Math.min(r, 7) - 2) * 0.04));
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion();
      const tiles = Object.entries(nob).map(([z, { r, c }]) => ({ z: +z, tl: add(K.tile(NOB[z], 0x7a52c8, 0.44, 0.44, 0.1), COL(c), TY(r), 0), slot: V(COL(c), TY(r), 0), r }));
      const lGrp = tag('noble gases: group VIIIA', 0.045, '#e0ccff', COL(10), TY(1), 0.1);
      // Fig. 4.1: their four tiles fly down and grow into atoms
      const row = ROW.map(([x, z, s, ro]) => { const sh = { 2: [2], 10: [2, 8], 18: [2, 8, 8], 36: [2, 8, 18, 8] }[z]; const a = fatom(sh, z, Math.round(z * 1.2), { r0: 0.28, dr: 0.18, nr: 0.09 + 0.012 * sh.length }); add(a.g, x, ROWY, 0); return { a, x, z, s, ro, sh }; });
      const rowTags = row.map(({ x, s, sh, ro }) => grp(tag(`${s} ${sh.at(-1)}`, 0.05, s === 'He' ? '#ffd27a' : '#ffffff', x, ROWY - ro - 0.2, 0.1), 'fig41'));
      const FLY = [NR + 2.0, NR + 3.6, NR + 4.8, NR + 6.0];
      beats.push((t) => {
        const tm = rest(t, C0 - 0.8, C0); ne.update(tm);
        outer.forEach((x, i) => { x.e.scale.setScalar(1 + 0.7 * bump(t, C0 + 0.25 * i)); });
        ringFlash(ne.rings[1], bump(t, C0 + 2.1) * 1.0);
        const sh = ease(span(t, SHR, SHR + 1.2)); ne.g.scale.setScalar(Math.max(1e-4, lerp(1, 0.38, sh))); ne.g.visible = t < SHR + 1.2;
        K.popIn(lNe, t, ND + 0.4, C0 - 0.1); K.popIn(l8, t, C0 + 2.1, SHR + 1.0);
        const away = 1 - ease(span(t, NR + 0.2, NR + 1.4)); inst.visible = t > SHR + 0.7 && away > 0.01;
        if (inst.visible) { others.forEach(({ r, c }, i) => { const s = Math.max(1e-4, built(t, r, c) * away); m4.compose(V(COL(c), TY(r), 0), q, V(s, s, s)); inst.setMatrixAt(i, m4); }); inst.instanceMatrix.needsUpdate = true; }
        tiles.forEach(({ z, tl, slot, r }) => {
          const k = ROW.findIndex((w) => w[1] === z), glow = span(t, SHR + 3.2 + r * 0.15, SHR + 3.5 + r * 0.15);
          tl.userData.body.material.emissive.setHex(0x7a52c8); tl.userData.body.material.emissiveIntensity = 0.5 * glow;
          const grow = z === 10 ? back(span(t, SHR + 1.0, SHR + 1.3)) : built(t, r, 18);
          tl.visible = t > (z === 10 ? SHR + 1.0 : SHR + 0.7) && (k >= 0 || away > 0.01); tl.scale.setScalar(Math.max(1e-4, grow * (k >= 0 ? 1 : away)));   // the four row tiles stay to fly
          if (k >= 0) {                                                  // He, Ne, Ar, Kr fly down to the row and become atoms
            const u = ease(span(t, FLY[k] - 1.2, FLY[k])), to = V(row[k].x, ROWY, 0); tl.position.copy(K.arc(slot, to, 0.4, u));
            if (u > 0.85) tl.scale.setScalar(Math.max(1e-4, 1 - span(u, 0.85, 1)));
          }
        });
        row.forEach(({ a }, k) => { const g = back(span(t, FLY[k] - 0.1, FLY[k] + 0.4)); a.g.visible = g > 0.01; a.g.scale.setScalar(Math.max(1e-4, g)); a.update(rest(t, FLY[k] + 2.0, NR + 9.0)); ringFlash(a.rings.at(-1), bump(t, NR + 7.8 + 0.25 * k)); });
        K.popIn(lGrp, t, SHR + 3.4, NR - 0.3); rowTags.forEach((l) => K.popIn(l, t, NR + 7.6, W0));
      });
    }

    // ================================================================ SALT (dark) · sodium gives its outer electron to chlorine
    {
      stage((t) => t >= SD - 0.05 && t < WB - 0.05); keyLight(SAX);
      const na = fatom([2, 8, 1], 11, 12, { r0: 0.28, dr: 0.25, nr: 0.12, a0: [Math.PI / 2, Math.PI / 2, 0] });
      const cl = fatom([2, 8, 7], 17, 18, { r0: 0.28, dr: 0.25, nr: 0.14, slots: [2, 8, 8], skip: [undefined, undefined, 4], a0: [Math.PI / 2, Math.PI / 2, 0] });
      add(na.g, SAX - 1.05, AY, 0); add(cl.g, SAX + 1.05, AY, 0);
      const naOut = na.es.find((x) => x.s === 2), gold = add(electron(true)), trail = Array.from({ length: 7 }, () => add(K.glowSprite(0xffc04d, 0.12)));
      const lNa = grp(tag('sodium 2, 8, 1', 0.055, '#ffffff', SAX - 1.05, AY - 1.02, 0.1), 'salt'), lCl = grp(tag('chlorine 2, 8, 7', 0.055, '#d8f590', SAX + 1.05, AY - 1.02, 0.1), 'salt');
      const lNap = tag('Na⁺ 2, 8: like neon ✓', 0.05, '#ffffff', SAX - 1.0, AY - 1.02, 0.1), lClm = tag('Cl⁻ 2, 8, 8: like argon ✓', 0.05, '#d8f590', SAX + 0.7, AY - 1.02, 0.1);
      const STOP = SD + 3.0, HOP = SD + 5.4, HOP1 = HOP + 1.6;
      beats.push((t) => {
        const tm = rest(t, STOP - 1.0, STOP); na.update(tm); cl.update(tm);
        naOut.e.material = goldE; naOut.e.visible = t < HOP;
        const from = na.pt(naOut.R, 0).add(na.g.position), to = cl.pt(naOut.R, Math.PI).add(cl.g.position);
        const u = ease(span(t, HOP, HOP1)); gold.visible = t >= HOP && t < WB; gold.position.copy(K.arc(from, to, 0.35, u));
        trail.forEach((s, k) => { const w = Math.max(0, u - 0.035 * (k + 1)); s.position.copy(K.arc(from, to, 0.35, w)); s.visible = u > 0.02 && u < 0.98; s.material.opacity = 0.55 * (1 - k / 7); });
        const gone = ease(span(t, HOP1 + 0.2, HOP1 + 1.0)); na.rings[2].scale.setScalar(Math.max(1e-4, 1 - gone)); na.rings[2].visible = gone < 1;
        ringFlash(na.rings[1], bump(t, HOP1 + 1.1)); ringFlash(cl.rings[2], bump(t, HOP1 + 4.0));
        K.popIn(lNa, t, SD + 0.6, HOP - 0.2); K.popIn(lCl, t, SD + 0.6, HOP - 0.2); K.popIn(lNap, t, HOP1 + 1.1, HOP1 + 3.9); K.popIn(lClm, t, HOP1 + 4.0, WB);
      });
    }

    // ================================================================ WATER (dark) · oxygen shares a pair with each hydrogen: 8 and 2
    {
      stage((t) => t >= WD - 0.05 && t < T.end - 0.05); keyLight(WAX, AY - 0.2);
      const OY = AY + 0.05, ANG = [-37.75, -142.25].map((d) => d * Math.PI / 180), DH = 0.74;
      const ox = fatom([2, 6], 8, 8, { r0: 0.28, dr: 0.28, nr: 0.13, a0: [Math.PI / 2, Math.PI / 2] }); add(ox.g, WAX, OY, 0);
      const hs = ANG.map((a) => { const h = fatom([1], 1, 0, { a0: [a + Math.PI], nr: 0.34 }); add(h.g); return { h, a }; });
      const RO = 0.56, PAIR = 0.47;
      // where oxygen's six outer electrons go: one toward each hydrogen, two lone pairs on top
      const OT = [ANG[0] + 0.12, ANG[1] - 0.12, 1.0, 1.3, 1.84, 2.14];
      const oOut = ox.es.filter((x) => x.s === 1);
      const lO = tag('oxygen: 6 outside', 0.06, '#ff9f8f', WAX, OY + 0.86, 0.1), lH = tag('hydrogen', 0.055, '#ffffff', WAX + 1.15, OY - 0.95, 0.1);
      const lPair = tag('shared pairs ✓', 0.06, '#ffd27a', WAX, OY - 0.98, 0.1), lOct = tag('8 outside: octet ✓', 0.065, '#ffd27a', WAX, OY + 0.86, 0.1);
      const lDup = tag('2 each: duplet, like helium ✓', 0.06, '#ffffff', WAX, OY - 1.0, 0.1);
      const S0 = WD + 2.6, IN0 = WD + 3.2, IN1 = IN0 + 2.4, PR = IN1 - 0.2, CNT = WD + 9.2;
      beats.push((t) => {
        ox.update(rest(t, S0 - 0.8, S0));
        const g = ease(span(t, S0, S0 + 1.2)), pr = ease(span(t, PR, PR + 1.0)), glow = t > PR + 1.0;
        oOut.forEach((x, i) => { x.to = ox.pt(RO, OT[i]); x.u = g; });
        hs.forEach(({ h, a }, k) => {
          const d = lerp(3.0, DH, ease(span(t, IN0, IN1))), at = V(Math.cos(a) * d, Math.sin(a) * d * Math.cos(ox.tilt), Math.sin(a) * d * Math.sin(ox.tilt));
          h.g.position.copy(at).add(ox.g.position); h.g.position.z += 0.015; h.update(rest(t, IN1 - 1.0, IN1));
          const mid = V(Math.cos(a) * PAIR, Math.sin(a) * PAIR * Math.cos(ox.tilt), Math.sin(a) * PAIR * Math.sin(ox.tilt)), side = V(-Math.sin(a), Math.cos(a), 0).multiplyScalar(0.06);
          oOut[k].to = ox.pt(RO, OT[k]).lerp(mid.clone().add(side), pr);                  // oxygen's electron moves into the overlap
          h.es[0].to = mid.clone().sub(side).sub(at).add(V(0, 0, -0.015)); h.es[0].u = pr;                       // hydrogen's electron joins it there
          h.es[0].e.material = oOut[k].e.material = glow ? goldE : blueE;
          ringFlash(h.rings[0], bump(t, CNT + 4.4));
        });
        // count the eight round oxygen: its six, then the two from hydrogen
        const eight = [...oOut, ...hs.map(({ h }) => h.es[0])];
        eight.forEach((x, i) => x.e.scale.setScalar(1 + 0.8 * bump(t, CNT + 0.3 * i)));
        ringFlash(ox.rings[1], bump(t, CNT + 2.5));
        K.popIn(lO, t, WD + 0.6, IN0 - 0.1); K.popIn(lH, t, IN0 + 0.4, PR); K.popIn(lPair, t, PR + 1.1, CNT - 0.1); K.popIn(lOct, t, CNT + 2.5, T.end); K.popIn(lDup, t, CNT + 4.4, T.end);
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'Why do atoms form chemical bonds?', dockTitle: 'Why bond?', intro: INTRO, ticks: TICKS,
      rows: [[0, 'water, salt, hydrogen: atoms held together'], [1, 'to lower their energy'], [1, 'to get a full outer shell'], [1, 'by losing, gaining or sharing electrons'], [1, '8 outside: octet · 2: duplet']],
      short: ['lower energy', 'full outer shell', 'lose · gain · share', 'octet · duplet'] }));
    return U.finish();
  },
};
