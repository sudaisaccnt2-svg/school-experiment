// Lesson 412 · Forces Between Molecules (book pp. 110–113: 4.4 Intermolecular forces (25 times weaker, 464 vs 19 kJ/mol,
// gases < liquids < solids, melting and boiling points, Van der Waals), 4.4.1 dipole–dipole interaction (Fig. 4.19 HCl,
// 3.3 kJ/mol, −85 °C), 4.4.2 hydrogen bonding (Fig. 4.20), Example 4.4, Practice 4.4, STS epoxy, (I) applications).
// v1 as a code lesson (2026-11-04), replacing the old Blender film. Built from SKILL.md §0 + §1 + §4 (tools: u4kit.js).
// THE QUESTION (book p.110: "The forces of attraction between the molecules of a compound"): "What holds molecules to
//   each other?" → card, docked panel, five ticks: much weaker · gas, liquid, solid · dipole–dipole · hydrogen bonds ·
//   Example 4.4.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: an ice cube on a dish, a glass of water, a beaker of water boiling on a burner (steam) · "Same
//         water: what holds its molecules together?" → card → dive INTO the glass of water.
//  WEAK   (dark) water molecules side by side · inside one: the O–H bond "464 kJ/mol to break" (a tall gold bar);
//         between two: "19 kJ/mol" (a small bar) · the small bar is copied until the stack matches: "25 times weaker ✓".
//  STATES (dark) three boxes of the same molecules: gas (far apart, fast), liquid (close, sliding), solid (packed,
//         shaking in place) "weak · stronger · much stronger" · "boiling and melting points depend on them" · ✓.
//  DIPOLE (dark) HCl molecules with δ+ δ− ends line up head to tail, dashed pulls between + and − ends (Fig. 4.19)
//         "dipole–dipole: only 3.3 kJ/mol" · "so HCl boils at −85 °C" (a thermometer far below zero) · ✓.
//  HBOND  (dark) water molecules: an H of one near the lone pair of an O of the next, a dotted gold line "a hydrogen
//         bond ✓" (Fig. 4.20) · "H joined to F, O or N" · Example 4.4: five cards into yes / no: HF yes; C₂H₄, HBr, NH₄⁺,
//         H₂ no · ✓.
//  END    the table: "glue, paint, DNA: held by these forces" · "Forces between molecules ✓".
// Game (🎮 Bond Reasons › Facts + Words: Van der Waals, the dipole examples CO, NO, H₂S, H₂O, NH₃, HCl, Practice 4.4
//   H₂O, CH₃OH, NH₃, H-bond needs F, O or N, water's high boiling point).
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U4.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
const { M, span, ease, easeIn, back, lerp, hash } = K;
const { V, ADIR, DDIR, rest, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, ICX = HKX - 0.62, WGX = HKX, BRX = HKX + 0.6;            // hook: ice · glass of water · boiling beaker
const WKX = 40, STX = 52, DPX = 64, HBX = 76, EXX = 88;                 // (dark) weak · states · dipole · H-bond · Example 4.4

// ---------------------------------------------------------------- time
const T = { card: 9.6 };
const DOCK = T.card + 5.0;
const WD = DOCK + 3.4, ST0 = WD + 15.0, DP0 = ST0 + 11.6, HB0 = DP0 + 13.6, EX0 = HB0 + 9.4, BACK = EX0 + 10.4;
T.done = BACK + 9.0;
const INTRO = [T.card, DOCK];
const TICKS = [[WD + 13.4, 0], [ST0 + 9.4, 1], [DP0 + 10.0, 2], [HB0 + 7.6, 3], [EX0 + 9.2, 4]];
const DARK = [[WD, BACK]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [6.4, T.card, 'Same water: what holds its molecules together?', [HKX, 0.62, 0.05]],
  [DOCK + 0.2, WD - 0.3, 'Look inside the water', [WGX, 0.32, 0.05]],
  [ST0 + 0.1, ST0 + 2.2, 'In gas, liquid and solid', [STX, AY + 1.2, 0]],
  [DP0 + 0.1, DP0 + 2.2, 'Polar molecules: + end to − end', [DPX, AY + 1.1, 0]],
  [EX0 + 0.1, EX0 + 2.2, 'Example 4.4: which form hydrogen bonds?', [EXX, AY + 1.0, 0]],
  [BACK + 0.6, BACK + 4.2, 'Glue, paint, DNA: held by these forces', [HKX, 0.62, 0.05]],
  [BACK + 4.2, T.done, 'Forces between molecules ✓', [HKX, 0.62, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX, 0.42, 0.05], 1.85 * k, 1.0 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const WATER = [WGX, 0.2, 0.02];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), S(DOCK + 1.8, WATER, 0.36, 0.36), DIVE(WD - 0.05, WATER),
  DK(WD, WKX, 3.4, 2.2, 0.3), DK(WD + 1.8, WKX, 3.4, 2.2, 1.04, 'out'), DK(ST0 - 0.05, WKX, 3.4, 2.2, 0.97),
  DK(ST0, STX, 5.3, 2.0, 1.03), DK(DP0 - 0.05, STX, 5.3, 2.0, 0.97),
  DK(DP0, DPX, 3.8, 2.2, 1.03), DK(HB0 - 0.05, DPX, 3.8, 2.2, 0.97),
  DK(HB0, HBX, 3.0, 2.4, 1.03), DK(EX0 - 0.05, HBX, 3.0, 2.4, 0.97),
  DK(EX0, EXX, 3.4, 2.0, 1.03), DK(BACK - 0.05, EXX, 3.4, 2.0, 0.97),
  HK(BACK, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '412', { dark, AY }), { beats, ST, add, tag, grp, keyLight, goldE } = U;
    const fires = [], shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
    const grow = (o, t, t0, t1 = 1e9) => { const u = t < t1 ? back(span(t, t0, t0 + 0.5)) : 1 - ease(span(t, t1, t1 + 0.35)); o.visible = u > 0.01; o.scale.setScalar(Math.max(1e-4, u)); };
    const water = (s = 1) => U.ballMol([['O', 0, 0], ['H', -0.2, -0.16], ['H', 0.2, -0.16]], [[0, 1], [0, 2]], { r: { O: 0.16 * s, H: 0.1 * s } });
    const hcl = () => U.ballMol([['H', -0.2, 0], ['Cl', 0.12, 0]], [[0, 1]], { r: { H: 0.1, Cl: 0.2 } });
    const dots = (n = 6) => { const g = new THREE.Group(), m = M.glow(0xffc04d, 1.6); for (let i = 0; i < n; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), m); g.add(d); } g.userData.set = (a, b) => g.children.forEach((d, i) => d.position.copy(a).lerp(b, (i + 0.5) / n)); return g; };
    const bar = (h, c = 0xffb43a) => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1, 0.16), M.glow(c, 1.2)); m.position.y = 0.5; g.add(m); g.scale.y = h; return g; };

    // ================================================================ HOOK / END · ice, water, steam
    {
      U.stage((t) => t < WD - 0.05 || t >= BACK - 0.05); ST.bake(U.root, 'hook', HKX, 2.0, 0.9);
      add(K.dish(0.13), ICX, 0, 0);
      const ice = add(K.solid(new THREE.BoxGeometry(0.09, 0.08, 0.09), new THREE.MeshPhysicalMaterial({ color: 0xe8f6ff, roughness: 0.08, transmission: 0.6, thickness: 0.05, transparent: true, opacity: 0.85, clearcoat: 1 })), ICX, 0.06, 0); ice.rotation.y = 0.5;
      add(K.beaker(0.13, 0.3), WGX, 0, 0); const wl = add(K.liquid(0.125, 0.22, 0x3d9ee6, 0.55), WGX, 0.052, 0);
      const brn = add(K.burner(), BRX, 0, 0); fires.push(brn.userData.flame); brn.userData.flame.scale.setScalar(0.45);
      add(K.tripod(0.56), BRX, 0, 0);
      add(K.beaker(0.11, 0.2), BRX, 0.56, 0); const bw = add(K.liquid(0.105, 0.12, 0x3d9ee6, 0.55), BRX, 0.612, 0);
      const boil = add(K.bubbles(16, V(0, 0.02, 0), 0.12, 0.12, 0.012), BRX, 0.612, 0), steam = add(K.smoke(10, 0xffffff), BRX, 0.78, 0); steam.scale.setScalar(0.18);
      const lI = tag('ice', 0.05, '#e8f6ff', ICX, 0.22, 0.1), lW = tag('water', 0.05, '#9fd2ff', WGX, 0.42, 0.1), lS = tag('steam', 0.05, '#ffffff', BRX, 1.1, 0.1);
      beats.push((t) => {
        wl.userData.top.position.y = 0.22 + 0.003 * Math.sin(t * 2.1); bw.userData.top.position.y = 0.12 + 0.004 * Math.sin(t * 9);
        boil.userData.update(t, 0.9); steam.userData.update(t, 0.8);
        K.popIn(lI, t, 0.3, 2.6); K.popIn(lW, t, 2.7, 4.4); K.popIn(lS, t, 4.5, 6.3);
      });
    }

    // ================================================================ WEAK (dark) · 464 inside a molecule, 19 between: 25 times weaker
    {
      U.stage((t) => t >= WD - 0.05 && t < ST0 - 0.05); keyLight(WKX);
      const ws = [-0.55, 0.55].map((dx) => add(water(1.6), WKX - 0.75 + dx, AY + 0.25, 0));
      const inside = add(K.glowSprite(0xffd27a, 0.3), WKX - 1.3 - 0.1, AY + 0.25 - 0.13, 0.15), between = dots(6); U.root.add(between);
      const big = add(bar(1.1), WKX + 0.6, AY - 0.75, 0), small = add(bar(1.1 / 24.4, 0x9fc8ff), WKX + 1.05, AY - 0.75, 0);
      const copies = Array.from({ length: 24 }, (_, k) => add(bar(1.1 / 24.4, 0x9fc8ff), WKX + 1.05, AY - 0.75 + (k + 1) * 1.1 / 24.4, 0));
      const l464 = tag('inside: 464 kJ/mol to break', 0.05, '#ffd27a', WKX + 0.3, AY + 0.62, 0.1), l19 = tag('between: only 19 kJ/mol', 0.05, '#9fc8ff', WKX + 0.3, AY + 0.62, 0.1);
      const l25 = tag('25 times weaker ✓', 0.065, '#ffffff', WKX + 0.3, AY + 0.62, 0.1);
      const B0 = WD + 3.0, B1 = B0 + 3.2, C0 = B1 + 3.4;
      beats.push((t) => {
        ws.forEach((w, i) => { w.rotation.z = 0.08 * Math.sin(t + i); });
        const gi = span(t, B0, B0 + 0.4) * (1 - span(t, B1 - 0.2, B1)); inside.visible = gi > 0.01; inside.material.opacity = 0.9 * gi;
        between.visible = t > B1; between.userData.set(V(WKX - 1.3 + 0.2 * 1.6, AY + 0.25 - 0.16 * 1.6, 0.05), V(WKX - 0.2, AY + 0.25, 0.05));
        big.visible = t > B0; big.scale.y = Math.max(1e-4, 1.1 * ease(span(t, B0, B0 + 1.0)));
        small.visible = t > B1; small.scale.y = Math.max(1e-4, (1.1 / 24.4) * ease(span(t, B1, B1 + 0.5)));
        copies.forEach((c, k) => { const u = span(t, C0 + k * 0.1, C0 + k * 0.1 + 0.3); c.visible = u > 0; c.scale.y = Math.max(1e-4, (1.1 / 24.4) * u); });
        K.popIn(l464, t, B0 + 0.4, B1 - 0.1); K.popIn(l19, t, B1 + 0.4, C0 - 0.1); K.popIn(l25, t, C0 + 2.8, ST0 - 0.3);
      });
    }

    // ================================================================ STATES (dark) · the same molecules as gas, liquid, solid
    {
      U.stage((t) => t >= ST0 - 0.05 && t < DP0 - 0.05); keyLight(STX);
      const BX = [STX - 1.75, STX, STX + 1.75], BW = 1.15;
      BX.forEach((x) => { const e = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(BW, BW, 0.4)), new THREE.LineBasicMaterial({ color: 0x8fa3c0, transparent: true, opacity: 0.7 })); e.position.set(x, AY - 0.05, 0); U.root.add(e); });
      const mk = (n) => Array.from({ length: n }, () => add(water(0.75)));
      const gas = mk(5), liq = mk(12), sol = mk(16);
      const lN = [['gas', 'weak', BX[0]], ['liquid', 'stronger', BX[1]], ['solid', 'strongest', BX[2]]].flatMap(([s, q, x]) => [grp(tag(s, 0.045, '#ffffff', x, AY - 0.8, 0.1), 'st'), grp(tag(q, 0.04, '#ffd27a', x, AY - 1.08, 0.1), 'st')]);
      const lMP = tag('melting and boiling points depend on them', 0.045, '#ffd27a', STX, AY + 0.78, 0.1);
      beats.push((t) => {
        const k = t - ST0, H = BW / 2 - 0.12;
        gas.forEach((m, i) => { const ax = hash(i, 1) * 6.28, s = 0.9 + hash(i, 2); m.position.set(BX[0] + H * Math.sin(k * s + ax), AY - 0.05 + H * Math.sin(k * s * 1.3 + ax * 2), 0.05 * Math.sin(k + i)); m.rotation.z = k * s; });
        liq.forEach((m, i) => { const c = i % 4, r = Math.floor(i / 4); m.position.set(BX[1] - 0.36 + c * 0.24 + 0.05 * Math.sin(k * 1.4 + i), AY - 0.45 + r * 0.22 + 0.03 * Math.sin(k * 1.7 + i * 2), 0.02 * Math.sin(k + i)); m.rotation.z = 0.6 * Math.sin(k * 0.8 + i); });
        sol.forEach((m, i) => { const c = i % 4, r = Math.floor(i / 4); m.position.set(BX[2] - 0.36 + c * 0.24 + 0.008 * Math.sin(k * 9 + i), AY - 0.42 + r * 0.24 + 0.008 * Math.cos(k * 11 + i), 0); m.rotation.z = 0.1 * Math.sin(k * 7 + i); });
        lN.forEach((l) => K.popIn(l, t, ST0 + 2.4, ST0 + 6.4)); K.popIn(lMP, t, ST0 + 6.5, DP0 - 0.3);
      });
    }

    // ================================================================ DIPOLE (dark) · HCl molecules head to tail, Fig. 4.19
    {
      U.stage((t) => t >= DP0 - 0.05 && t < HB0 - 0.05); keyLight(DPX);
      const POS = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) POS.push(V(DPX - 0.95 + c * 0.95, AY + 0.6 - r * 0.6, 0));
      const ms = POS.map((p, i) => { const m = add(hcl(), p.x, p.y, 0); m.userData.r0 = (hash(i, 3) - 0.5) * 3; return m; });
      const pulls = POS.flatMap((p, i) => (i % 3 < 2 ? [dots(4)] : [])); pulls.forEach((d) => U.root.add(d));
      const signs = POS.flatMap((p) => [grp(tag('δ+', 0.035, '#ffb08a', p.x - 0.22, p.y + 0.2, 0.15), 'dp'), grp(tag('δ−', 0.035, '#9fc8ff', p.x + 0.14, p.y + 0.26, 0.15), 'dp')]);
      const lD = tag('dipole–dipole: only 3.3 kJ/mol', 0.05, '#ffd27a', DPX, AY - 1.0, 0.1), lB = tag('so HCl boils at −85 °C', 0.055, '#9fc8ff', DPX, AY - 1.0, 0.1);
      const L0 = DP0 + 1.6, L1 = L0 + 1.8;
      beats.push((t) => {
        const u = ease(span(t, L0, L1));
        ms.forEach((m, i) => { m.rotation.z = lerp(m.userData.r0, 0, u) + 0.04 * Math.sin(t * 2 + i); });
        let k = 0; POS.forEach((p, i) => { if (i % 3 < 2) { const d = pulls[k++]; d.visible = u > 0.95; d.userData.set(V(p.x + 0.32, p.y, 0.05), V(p.x + 0.95 - 0.3, p.y, 0.05)); } });
        signs.forEach((l) => K.popIn(l, t, L1 + 0.2, L1 + 3.6)); K.popIn(lD, t, L1 + 3.7, L1 + 6.6); K.popIn(lB, t, L1 + 6.7, HB0 - 0.3);
      });
    }

    // ================================================================ HBOND (dark) · Fig. 4.20 water: H of one to the O lone pair of the next
    {
      U.stage((t) => t >= HB0 - 0.05 && t < EX0 - 0.05); keyLight(HBX);
      const P = [V(HBX - 0.8, AY + 0.5, 0), V(HBX + 0.1, AY + 0.02, 0.05), V(HBX + 0.85, AY + 0.55, -0.05), V(HBX - 0.55, AY - 0.65, 0.05)], R0 = [-0.6, 0.2, 2.6, 0.9];
      const ms = P.map((p, i) => { const m = add(water(1.5), p.x, p.y, p.z); m.rotation.z = R0[i]; return m; });
      const hb = [dots(5), dots(5), dots(5)]; hb.forEach((d) => U.root.add(d));
      const lH = tag('a hydrogen bond ✓', 0.06, '#ffd27a', HBX, AY + 1.05, 0.1), lF = tag('H joined to F, O or N', 0.05, '#ffffff', HBX, AY - 1.12, 0.1);
      beats.push((t) => {
        ms.forEach((m, i) => { m.rotation.z = R0[i] + 0.05 * Math.sin(t * 1.5 + i); });
        const on = span(t, HB0 + 1.6, HB0 + 2.2); hb.forEach((d, k) => { d.visible = on > 0.01; d.children.forEach((c) => { c.scale.setScalar(Math.max(1e-4, on)); }); });
        hb[0].userData.set(V(HBX - 0.55, AY + 0.3, 0.02), V(HBX - 0.05, AY + 0.12, 0.05)); hb[1].userData.set(V(HBX + 0.4, AY + 0.0, 0.05), V(HBX + 0.75, AY + 0.35, -0.02)); hb[2].userData.set(V(HBX - 0.1, AY - 0.2, 0.05), V(HBX - 0.45, AY - 0.45, 0.05));
        K.popIn(lH, t, HB0 + 2.4, HB0 + 5.4); K.popIn(lF, t, HB0 + 5.5, EX0 - 0.3);
      });
    }

    // ================================================================ EX (dark) · Example 4.4: which form hydrogen bonds?
    {
      U.stage((t) => t >= EX0 - 0.05 && t < BACK - 0.05); keyLight(EXX);
      const BIN = [EXX - 0.85, EXX + 0.85], BW = 1.3, BY = AY - 0.6;
      BIN.forEach((x) => { const g = add(new THREE.Group(), x, BY, 0), m = M.matte(0x262b35, 0.7); [[BW - 0.03, 0.04, 0.47, 0, 0, 0], [0.04, 0.4, 0.5, -BW / 2, 0.2, 0], [0.04, 0.4, 0.5, BW / 2, 0.2, 0], [BW - 0.07, 0.37, 0.04, 0, 0.19, -0.225]].forEach(([w, h, d, x0, y0, z0]) => { const b = K.solid(new THREE.BoxGeometry(w, h, d), m); b.position.set(x0, y0, z0); g.add(b); }); });
      const bn = [grp(tag('hydrogen bonds', 0.045, '#ffd27a', BIN[0], BY - 0.22, 0.3), 'ex'), grp(tag('no', 0.05, '#c9d0db', BIN[1], BY - 0.22, 0.3), 'ex')];
      const CARDS = [['HF', 0], ['C₂H₄', 1], ['HBr', 1], ['NH₄⁺', 1], ['H₂', 1]], cnt = [0, 0];
      const tiles = CARDS.map(([s, b], i) => { const k = cnt[b]++, tl = add(K.tile(s, b ? 0x5a6070 : 0xb07a2a, 0.46, 0.28, 0.06)); tl.traverse((o) => { if (o.userData.text !== undefined) o.userData.group = 'ex'; }); return { tl, slot: V(BIN[b] + (b ? ((k % 2) - 0.5) * 0.52 : 0), BY + 0.19 + (b ? Math.floor(k / 2) * 0.32 : 0), 0.05), t0: EX0 + 2.4 + i * 1.3 }; });
      beats.push((t) => {
        bn.forEach((l) => K.popIn(l, t, EX0 + 0.4, BACK));
        tiles.forEach(({ tl, slot, t0 }) => { const u = span(t, t0, t0 + 0.6), top = V(EXX, AY + 0.95, 0.1); tl.visible = t > t0 - 0.4; tl.position.copy(t < t0 ? top : K.arc(top, slot, 0.2, easeIn(u))); tl.scale.setScalar(Math.max(1e-4, back(span(t, t0 - 0.4, t0)))); });
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'What holds molecules to each other?', dockTitle: 'Between', intro: INTRO, ticks: TICKS,
      rows: [[0, 'ice, water and steam: the same molecules'], [1, 'forces between molecules: 25 times weaker'], [1, 'weak in gas, stronger in liquid and solid'], [1, 'polar molecules: dipole–dipole'], [1, 'H on F, O or N: hydrogen bonds'], [1, 'Example 4.4: which form them?']],
      short: ['25× weaker', 'gas · liquid · solid', 'dipole–dipole', 'hydrogen bonds', 'Example 4.4'] }));
    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));
    return U.finish();
  },
};
