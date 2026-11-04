// Lesson 604 · Solid Solutions (book pp. 157–158: 6.3.3 solid solutions (gas in solid: hydrogen in palladium; liquid
// in solid: mercury amalgam used by dentists, Fig. 6.4, 50 % mercury; solid in solid: brass = copper + zinc, bronze =
// copper + tin), Fig. 6.5 brass, sterling silver 92.5 % silver + 7.5 % copper, bronze; STS: solutions in daily life
// (gaseous, liquid, solid: jewellery, steel, airplane Al + Mg, dental fillings)). v1 as a code lesson (2026-11-04).
// THE QUESTION: "A key, a ring, a medal: how can a metal be a solution?" → card, docked panel, five ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a brass key, a sterling-silver ring, a bronze medal, a tooth with a grey filling, a jar of
//         hydrogen with a strip of palladium (a metal), a steel spoon (named one at a time) · question → card → dive
//         INTO the key.
//  BRASS  (dark) copper atoms in rows; zinc atoms fly in and take some places "brass: zinc in copper: solid in solid ✓"
//         · the zinc leaves, tin comes in "bronze (the medal): tin in copper ✓" · a silver lattice of 40, 3 of them
//         copper, counted "sterling silver (the ring): 37 + 3 of 40 = 92.5 % · 7.5 % ✓".
//  TOOTH  back out, to the tooth → dive: silver atoms and mercury atoms (liquid metal) mixed half and half "amalgam:
//         mercury in silver: liquid in solid ✓ (about 50 % mercury)".
//  PD     back out, to the palladium in hydrogen → dive: tiny hydrogen atoms slip into the gaps between the metal atoms
//         "hydrogen in palladium: gas in solid ✓".
//  END    the bench, the steel spoon "jewellery, steel, airplane parts (Al + Mg): solid solutions in daily life ✓" ·
//         "Metals dissolve in metals: alloys are solid solutions ✓".
// Game (🎮 Mixture Sorter › nine types, docs/COVERAGE_U6.md): the 6.3.3 table, the alloys and their metals, STS lists.
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U6.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
import * as U5 from './u5kit.js';
import * as U6 from './u6kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, KYX = HKX - 0.78, RGX = HKX - 0.48, MDX = HKX - 0.2, TTX = HKX + 0.1, PDX = HKX + 0.42, SPX = HKX + 0.78;
const BX = 40, TX = 52, PX = 64;

// ---------------------------------------------------------------- time
const T = { card: 10.0 };
const DOCK = T.card + 5.0;
const BD = DOCK + 3.4, BR2 = BD + 5.2, SS = BD + 9.8, B1 = BD + 15.4, TD = B1 + 3.6, B2 = TD + 7.2, PD = B2 + 3.6, B3 = PD + 7.6, END = B3 + 7.0;
T.done = END + 5.0;
const INTRO = [T.card, DOCK];
const TICKS = [[BD + 4.4, 0], [BR2 + 3.6, 1], [SS + 4.6, 2], [TD + 5.4, 3], [PD + 5.6, 4]];
const DARK = [[BD, B1], [TD, B2], [PD, B3]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [8.4, T.card, 'A key, a ring, a medal: how can a metal be a solution?', [HKX, 0.5, 0.05]],
  [DOCK + 0.2, BD - 0.3, 'Look inside the brass key', [KYX, 0.24, 0.05]],
  [B1 + 0.3, TD - 0.3, 'And the dentist’s filling?', [TTX, 0.3, 0.05]],
  [B2 + 0.3, PD - 0.3, 'Hydrogen gas around palladium metal', [PDX, 0.5, 0.05]],
  [END + 0.4, T.done, 'Metals dissolve in metals: alloys are solid solutions ✓', [HKX, 0.5, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX, 0.2, 0.05], 1.75 * k, 0.6 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const near = (t, p, w = 0.5, h = 0.4, e) => S(t, p, w, h, ADIR, e);
const P_KY = [KYX + 0.06, 0.006, 0.0], P_TT = [TTX, 0.07, 0.02], P_PD = [PDX, 0.15, 0.02];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), near(DOCK + 1.8, P_KY, 0.32, 0.26), DIVE(BD - 0.05, P_KY),
  DK(BD, BX, 3.0, 2.0, 0.3), DK(BD + 1.8, BX, 3.0, 2.0, 1.04, 'out'), DK(B1 - 0.05, BX, 3.0, 2.0, 0.97),
  S(B1, P_KY, 0.3, 0.25, ADIR, 'out'), near(B1 + 1.4, P_TT, 0.45, 0.38), DIVE(TD - 0.05, P_TT),
  DK(TD, TX, 3.0, 2.0, 0.3), DK(TD + 1.8, TX, 3.0, 2.0, 1.04, 'out'), DK(B2 - 0.05, TX, 3.0, 2.0, 0.97),
  S(B2, P_TT, 0.3, 0.25, ADIR, 'out'), near(B2 + 1.4, P_PD, 0.5, 0.5), DIVE(PD - 0.05, P_PD),
  DK(PD, PX, 3.0, 2.0, 0.3), DK(PD + 1.8, PX, 3.0, 2.0, 1.04, 'out'), DK(B3 - 0.05, PX, 3.0, 2.0, 0.97),
  S(B3, P_PD, 0.3, 0.25, ADIR, 'out'), HK(B3 + 1.6, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '604', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;
    const ball = (c, r, metal = true) => K.solid(new THREE.SphereGeometry(r, 22, 16), metal ? new THREE.MeshPhysicalMaterial({ color: c, metalness: 0.55, roughness: 0.28, clearcoat: 0.8 }) : M.gloss(c));
    /** a lattice of nx × ny atoms centred at (x, AY); returns its slot positions and the host balls */
    const lattice = (x, nx, ny, c, r = 0.13, P = 0.3) => { const slots = [], balls = []; for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const p = V(x + (i - (nx - 1) / 2) * P, AY + (j - (ny - 1) / 2) * P + 0.1, 0); slots.push(p); const b = add(ball(c, r)); b.position.copy(p); balls.push(b); } return { slots, balls }; };
    /** guest atoms that fly into chosen slots at t0 (the host there steps aside) and leave again at tOut */
    const guests = (L, ids, c, r) => ids.map((id) => ({ b: add(ball(c, r)), id }));
    const fly = (L, G, t, t0, tOut = 1e9) => { let on = new Set(); G.forEach(({ b, id }, k) => { const a = ease(span(t, t0 + 0.3 * k, t0 + 1.2 + 0.3 * k)), o = ease(span(t, tOut + 0.2 * k, tOut + 1.0 + 0.2 * k)), far = V(L.slots[id].x + 2.6, L.slots[id].y + 0.9, 0.2); b.visible = a > 0 && o < 1; b.position.copy(far).lerp(L.slots[id], a).lerp(far, o); if (a > 0.5 && o < 0.5) on.add(id); }); return on; };

    // ================================================================ BENCH
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', HKX, 2.0, 0.7);
      add(U6.brassKey(1.4), KYX, 0, 0); add(K.ring(0.04, 0.01, 0xdfe3e8), RGX, 0, 0);
      const md = add(K.solid(new THREE.CylinderGeometry(0.06, 0.06, 0.01, 40), M.metal(0xb0703a, 0.35)), MDX, 0.005, 0);
      add(K.lump(0.06, M.gloss(0xf2efe6), 4, 0.9, 0.25), TTX, 0.05, 0); add(K.lump(0.022, M.metal(0xa8aeb6, 0.3), 2, 0.5, 0.3), TTX, 0.098, 0.01);
      const jar = add(K.gasJar(0xeef4fa, 0.08, 0.3), PDX, 0, 0); jar.userData.gas.opacity = 0.05; add(K.solid(new THREE.BoxGeometry(0.04, 0.16, 0.004), M.metal(0xb8bcc2, 0.3)), PDX, 0.05 + 0.08, 0);
      const sp = add(K.spoon(0.22), SPX, 0.012, 0); sp.rotation.z = Math.PI / 2;
      const ls = [['a brass key', '#ffd890', KYX, 0.12, 0.1], ['a sterling-silver ring', '#ffffff', RGX, 0.16, 0.12], ['a bronze medal', '#ffc9a0', MDX, 0.12, 0.12], ['a tooth with a filling', '#ffffff', TTX, 0.22, 0.1], ['palladium in hydrogen', '#ffffff', PDX, 0.42, 0.08], ['a steel spoon', '#ffffff', SPX, 0.14, 0.12]].map(([s, c, x, y, z]) => tag(s, 0.042, c, x, y, z));
      const lE = [grp(tag('jewellery, steel, airplane parts (Al + Mg):', 0.042, '#ffd27a', HKX, 0.47, 0.08), 'dl'), grp(tag('solid solutions in daily life ✓', 0.046, '#ffd27a', HKX, 0.33, 0.08), 'dl')];
      beats.push((t) => { ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 1.3, 1.6 + i * 1.3)); lE.forEach((l) => K.popIn(l, t, B3 + 1.8, END + 0.2)); });
    }

    // ================================================================ BRASS · BRONZE · STERLING SILVER (dark)
    {
      U.stage((t) => t >= BD - 0.05 && t < B1 - 0.05); keyLight(BX);
      const Cu = lattice(BX, 8, 5, 0xc8743a);
      const AG = lattice(BX, 8, 5, 0xdfe3e8); AG.balls.forEach((b) => (b.visible = false));
      const cuIn = [3, 9, 14, 20, 27, 33], ZN = guests(Cu, cuIn, 0x8f9bb0, 0.13), SN = guests(Cu, cuIn, 0xe4e6e2, 0.15);
      const l1 = [grp(tag('brass: zinc in copper', 0.05, '#ffffff', BX, AY - 0.97, 0.1), 'b1'), grp(tag('solid in solid ✓', 0.055, '#ffd27a', BX, AY - 1.17, 0.1), 'b1')];
      const l2 = tag('bronze (the medal): tin in copper ✓', 0.05, '#ffc9a0', BX, AY - 1.05, 0.1);
      const l3 = [grp(tag('sterling silver (the ring): 37 silver + 3 copper', 0.044, '#ffffff', BX, AY - 0.97, 0.1), 'ss'), grp(tag('of 40 = 92.5 % · 7.5 % ✓', 0.05, '#ffd27a', BX, AY - 1.17, 0.1), 'ss')];
      const lZ = tag('zinc atoms come in', 0.05, '#9fb8d8', BX, AY + 0.95, 0.1);
      const cuDots = [5, 18, 30].map((id) => { const b = add(ball(0xc8743a, 0.13)); b.position.copy(AG.slots[id]); return b; });
      beats.push((t) => {
        const sil = t > SS;
        const occ = sil ? new Set() : new Set([...fly(Cu, ZN, t, BD + 0.8, BR2), ...fly(Cu, SN, t, BR2 + 1.0)]);
        if (sil) [...ZN, ...SN].forEach(({ b }) => (b.visible = false));
        Cu.balls.forEach((b, i) => (b.visible = !sil && !occ.has(i))); AG.balls.forEach((b, i) => (b.visible = sil && ![5, 18, 30].includes(i)));
        cuDots.forEach((b, k) => { b.visible = sil; b.scale.setScalar(1 + 0.3 * bump(t, SS + 1.4 + 0.5 * k, 0.5)); });
        K.popIn(lZ, t, BD + 0.6, BD + 2.4); l1.forEach((l) => K.popIn(l, t, BD + 2.6, BR2 - 0.1)); K.popIn(l2, t, BR2 + 2.2, SS - 0.1); l3.forEach((l) => K.popIn(l, t, SS + 0.4, B1));
      });
    }

    // ================================================================ AMALGAM (dark) · mercury in silver
    {
      U.stage((t) => t >= TD - 0.05 && t < B2 - 0.05); keyLight(TX);
      const L = lattice(TX, 8, 5, 0xf4f2ea);
      const hg = Array.from({ length: 40 }, (_, i) => i).filter((i) => (i * 7) % 2 === 0 ? (i % 3 !== 1) : (i % 4 === 0)).slice(0, 20);
      const l1 = tag('mercury (a liquid metal) comes in', 0.048, '#d8e0ea', TX, AY + 0.95, 0.1);
      const l2 = [grp(tag('amalgam: mercury in silver', 0.05, '#ffffff', TX, AY - 0.97, 0.1), 'am'), grp(tag('liquid in solid ✓ (about 50 % mercury)', 0.048, '#ffd27a', TX, AY - 1.17, 0.1), 'am')];
      const hgM = new THREE.MeshPhysicalMaterial({ color: 0x7f97b8, metalness: 0.5, roughness: 0.06, clearcoat: 1 });   // liquid silver, not a black mirror
      const drops = hg.map((id, k) => { const b = add(K.solid(new THREE.SphereGeometry(0.13, 22, 16), hgM)); return { b, id, k }; });
      beats.push((t) => {
        drops.forEach(({ b, id, k }) => { const a = ease(span(t, TD + 0.8 + 0.12 * k, TD + 1.8 + 0.12 * k)), far = V(L.slots[id].x + 2.6, L.slots[id].y + 0.9, 0.2); b.visible = a > 0; b.position.copy(far).lerp(L.slots[id], a); b.scale.set(1.05, 0.95 + 0.05 * Math.sin(t * 3 + k), 1.05); L.balls[id].visible = a < 0.5; });
        K.popIn(l1, t, TD + 0.6, TD + 3.4); l2.forEach((l) => K.popIn(l, t, TD + 3.6, B2));
      });
    }

    // ================================================================ PALLADIUM (dark) · hydrogen in the gaps
    {
      U.stage((t) => t >= PD - 0.05 && t < B3 - 0.05); keyLight(PX);
      const L = lattice(PX, 8, 5, 0xb8bcc2, 0.13, 0.32);
      const gaps = []; for (let j = 0; j < 4; j++) for (let i = 0; i < 7; i++) if ((i + j) % 2 === 0) gaps.push(V(PX + (i - 3) * 0.32, AY + (j - 1.5) * 0.32 + 0.1, 0.02));
      const hs = gaps.map((p, k) => ({ b: add(ball(0xf4f4f4, 0.05, false)), p, k }));
      const l1 = tag('palladium metal atoms', 0.05, '#ffffff', PX, AY + 0.95, 0.1);
      const l2 = [grp(tag('hydrogen slips into the gaps', 0.05, '#ffffff', PX, AY - 0.97, 0.1), 'pd'), grp(tag('gas in solid ✓', 0.055, '#ffd27a', PX, AY - 1.17, 0.1), 'pd')];
      beats.push((t) => {
        hs.forEach(({ b, p, k }) => { const a = ease(span(t, PD + 1.6 + 0.12 * k, PD + 2.8 + 0.12 * k)), far = V(p.x + (k % 2 ? 2.4 : -2.4), p.y + 0.9, 0.3); b.visible = a > 0; b.position.copy(far).lerp(p, a); });
        K.popIn(l1, t, PD + 0.4, PD + 2.8); l2.forEach((l) => K.popIn(l, t, PD + 3.0, B3));
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'A key, a ring, a medal: how can a metal be a solution?', dockTitle: 'Solid solutions', intro: INTRO, ticks: TICKS,
      rows: [[0, 'a key, a ring, a medal, a filling, palladium'], [1, 'brass: zinc in copper (solid in solid)'], [1, 'bronze: tin in copper'], [1, 'sterling silver: 92.5 % silver, 7.5 % copper'], [1, 'amalgam: mercury in silver (liquid in solid)'], [1, 'hydrogen in palladium (gas in solid)']],
      short: ['brass', 'bronze', 'sterling silver', 'amalgam', 'H in palladium'] }));
    return U.finish();
  },
};
