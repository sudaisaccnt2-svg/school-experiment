// Lesson 502 · Diffusion & Effusion (book pp. 123–124: iii Diffusion, Fig. 5.1 perfume, Graham 1833, iv Effusion,
// Fig. 5.2 onion's smell through a sealed bag, Fig. 5.3, Activity 5.1 bromine jars, Point to Ponder: the balloon).
// v1 as a code lesson (2026-11-04), replacing the old Blender film. Built from SKILL.md §0 + §1 + §4.
// THE QUESTION (book p.123 "when a gas having characteristic odour is released at one corner of the room, soon its
//   smell will spread in the whole room"): "How does a smell spread across a room?" → card, docked panel, six ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: a perfume bottle, onions in a sealed bag, two jars (brown bromine under a jar of air), a balloon
//         (named one at a time) · the stopper of the perfume lifts · "How does a smell spread across a room?" → card →
//         dive INTO the open bottle.
//  PERFUME (dark) a box of air molecules; the perfume molecules crowded in one corner "perfume, crowded in one corner" ·
//         they spread through the air "from crowded to less crowded: diffusion ✓" · evenly mixed "spread evenly: no more
//         net flow ✓" · the perfume fades; a light gas and a heavy gas start from the same corner; the light one reaches
//         the far wall first (the wall flashes) "the lighter gas spreads faster (Graham, 1833) ✓".
//  BAG    bridge "Sealed tight, yet we smell onions. How?" → dive INTO the bag's skin: a thin wall with a hole the size
//         of a molecule; the onion-smell molecules go through one at a time "one by one, no bumping: effusion ✓".
//  JARS   Activity 5.1: the glass plate between the jars slides out; brown wisps rise into the air jar "the brown spreads
//         up into the air ✓".
//  BALLOON Point to Ponder "Why does a balloon come down in a day or two?" · day 1 → day 2: tiny specks leave its
//         skin, it shrinks and sinks to the table "its gas escapes through the rubber, one by one ✓".
//  END    the open perfume bottle: "Gases spread by themselves, everywhere ✓".
// Game (🎮 Matter Practice › Words + Facts; 🎮 Why? Lab + State Sorter, docs/COVERAGE_U5.md): the definitions word for word, Graham 1833.
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U5.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
import * as U5 from './u5kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, PFX = HKX - 0.98, BGX = HKX - 0.38, JRX = HKX + 0.3, BLX = HKX + 1.22;   // perfume · onion bag · jars · balloon
const PX = 40, EX = 52;                                                            // (dark) perfume in air · the bag's skin

// ---------------------------------------------------------------- time
const T = { open: 7.2, card: 10.6 };
const DOCK = T.card + 5.0;
const PD = DOCK + 3.4, SPR = PD + 3.0, EVEN = PD + 9.0, GR = PD + 11.8, B1 = PD + 19.6, BD = B1 + 4.6, PASS = BD + 3.2, B2 = BD + 11.0;
const PLATE = B2 + 3.4, RISE = B2 + 4.4, BAL = B2 + 11.4, SINK = BAL + 3.2, BACK = BAL + 12.0;
T.done = BACK + 5.6;
const INTRO = [T.card, DOCK];
const TICKS = [[PD + 7.4, 0], [EVEN + 1.6, 1], [GR + 6.2, 2], [PASS + 5.4, 3], [RISE + 5.6, 4], [SINK + 6.6, 5]];
const DARK = [[PD, B1], [BD, B2]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [T.open + 0.4, T.card, 'How does a smell spread across a room?', [HKX, 0.9, 0.05]],
  [DOCK + 0.2, PD - 0.3, 'Look into the open bottle', [PFX, 0.42, 0.05]],
  [B1 + 0.4, BD - 0.3, 'Sealed tight, yet we smell onions. How?', [BGX, 0.42, 0.05]],
  [B2 + 0.4, PLATE - 0.1, 'Activity 5.1: bromine under a jar of air', [JRX, 1.05, 0.05]],
  [BAL + 0.3, SINK - 0.1, 'Why does a balloon come down in a day or two?', [BLX, 0.95, 0.05]],
  [BACK + 1.6, T.done, 'Gases spread by themselves, everywhere ✓', [HKX, 0.9, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX + 0.12, 0.4, 0.05], 2.6 * k, 1.05 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const P_PF = [PFX, 0.2, 0.02], P_BG = [BGX, 0.12, 0.08], P_JR = [JRX, 0.52, 0.05], P_BL = [BLX, 0.45, 0.05];
const near = (t, p, w = 0.8, h = 0.65, e) => S(t, p, w, h, ADIR, e);
const CAMS = [
  HK(0, 1.05), HK(T.open - 0.4, 1.0), near(T.open + 0.6, P_PF, 0.9, 0.75), near(T.card - 0.05, P_PF, 0.86, 0.72), HK(DOCK, 1.02), near(DOCK + 1.8, P_PF, 0.6, 0.5), DIVE(PD - 0.05, [PFX, 0.27, 0.0]),
  DK(PD, PX, 3.4, 2.2, 0.3), DK(PD + 1.8, PX, 3.4, 2.2, 1.04, 'out'), DK(B1 - 0.05, PX, 3.4, 2.2, 0.97),
  S(B1, [PFX, 0.27, 0.0], 0.1, 0.08, ADIR, 'out'), near(B1 + 1.4, P_PF), near(B1 + 3.4, P_BG, 0.7, 0.55), DIVE(BD - 0.05, P_BG),
  S(BD, [EX, AY, 0], 0.96, 0.6, [0.7, 0.25, 1]), S(BD + 1.8, [EX, AY, 0], 3.2 * 1.04, 2.0 * 1.04, [0.7, 0.25, 1], 'out'), S(B2 - 0.05, [EX, AY, 0], 3.2 * 0.97, 2.0 * 0.97, [0.7, 0.25, 1]),
  S(B2, P_BG, 0.1, 0.08, ADIR, 'out'), near(B2 + 1.4, P_BG, 1.2, 0.9), near(B2 + 3.0, P_JR, 0.9, 1.25), near(BAL - 0.05, P_JR, 0.86, 1.2),
  near(BAL + 1.6, P_BL, 0.8, 0.95), near(BACK - 0.05, P_BL, 0.76, 0.9), HK(BACK + 1.6, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '502', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;
    const vapour = (n, c) => { const g = K.gasCloud(c, n); return g; };

    // ================================================================ HOOK / BENCH · perfume, onions, bromine jars, a balloon
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', HKX + 0.12, 2.9, 0.85);
      const pf = add(K.reagentBottle(0xf6a8c8, 0.22, 0.06, 'perfume'), PFX, 0, 0), stop = pf.userData.stopper, s0 = stop.position.clone();
      const scent = add(vapour(8, 0xf6c0d8), PFX, 0.24, 0);
      add(U5.onionBag(1), BGX, 0, 0);
      const JH = 0.42, low = add(K.gasJar(0xa8452c, 0.12, JH), JRX, 0, 0), up = add(K.gasJar(0xa8452c, 0.12, JH), JRX, 2 * JH + 0.05, 0); up.rotation.x = Math.PI;
      up.children[1].visible = false; up.userData.lid.visible = false;                      // the upper jar stands on its mouth: no sand, no lid
      low.userData.gas.opacity = 0.1; up.userData.gas.opacity = 0;
      const wLow = vapour(12, 0xb0502c); low.add(wLow); const wUp = vapour(12, 0xb0502c); up.add(wUp);
      const plate = low.userData.lid, p0 = plate.position.clone();
      const bal = add(K.balloon(0x9fc8ff, 0.12), BLX, 0, 0), ball = bal.userData.ball, rib = bal.children[1];
      const specks = Array.from({ length: 10 }, (_, i) => { const s = add(K.glowSprite(0xcfe4ff, 0.05)); return { s, a: i / 10 * 6.28, t0: SINK + 0.4 * i }; });
      const ls = [['perfume', '#f6c0d8', PFX, 0.36, 0.1], ['onions in a sealed bag', '#ffffff', BGX, 0.36, 0.14], ['brown bromine · air', '#e0a080', JRX, 1.02, 0.1], ['a balloon', '#cfe4ff', BLX, 0.9, 0.08]].map(([s, c, x, y, z]) => tag(s, 0.05, c, x, y, z));
      const lPl = tag('the glass plate slides out', 0.05, '#ffffff', JRX, 1.02, 0.1), lBr = [grp(tag('the brown spreads up', 0.05, '#e0a080', JRX, 1.08, 0.1), 'br'), grp(tag('into the air ✓', 0.055, '#e0a080', JRX, 0.96, 0.1), 'br')];
      const lD1 = tag('day 1', 0.055, '#ffffff', BLX + 0.25, 0.7, 0.1), lD2 = tag('day 2', 0.055, '#ffffff', BLX + 0.25, 0.7, 0.1);
      const lBl = [grp(tag('its gas escapes through', 0.048, '#cfe4ff', BLX - 0.05, 0.86, 0.1), 'bl'), grp(tag('the rubber, one by one ✓', 0.048, '#cfe4ff', BLX - 0.05, 0.75, 0.1), 'bl')];
      beats.push((t) => {
        const o = ease(span(t, T.open, T.open + 0.6)); stop.position.set(s0.x + 0.05 * o, s0.y + 0.06 * o - 0.05 * easeIn(span(t, T.open + 0.6, T.open + 1.0)), s0.z); stop.rotation.z = -0.8 * o;
        scent.userData.update(t, 0.0, 0.25, 0.06, 0.6 * span(t, T.open + 0.4, T.open + 1.6));
        const pl = ease(span(t, PLATE, PLATE + 0.8)), dn = easeIn(span(t, PLATE + 0.8, PLATE + 1.3)); plate.position.set(p0.x + 0.34 * pl, lerp(p0.y, 0.007, dn), p0.z);
        wLow.userData.update(t, 0.06, JH - 0.04, 0.1, 0.9); const r = ease(span(t, RISE, RISE + 4.6)); wUp.userData.update(t, 0.06 + (JH - 0.12) * (1 - r), JH - 0.04, 0.1, 0.9 * r); up.userData.gas.opacity = 0.1 * r;
        const sk = ease(span(t, SINK + 0.6, SINK + 5.6)); bal.userData.update(t); ball.position.y = lerp(0.62, 0.2, sk) + 0.012 * Math.sin(t * 1.3) * (1 - sk); ball.scale.setScalar(1 - 0.22 * sk);
        rib.scale.y = Math.max(0.15, (ball.position.y - 0.156 * ball.scale.y) / 0.464);
        specks.forEach(({ s, a, t0 }) => { const u = span(t, t0, t0 + 1.4); s.visible = u > 0 && u < 1; const c = V(BLX, ball.position.y, 0); s.position.copy(c).add(V(Math.cos(a), Math.sin(a) * 0.9, 0.3).multiplyScalar(0.12 + 0.3 * u)); s.material.opacity = 0.8 * (1 - u); });
        ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 1.6, 1.9 + i * 1.6));
        K.popIn(lPl, t, PLATE, RISE + 1.6); lBr.forEach((l) => K.popIn(l, t, RISE + 2.4, BAL - 0.1));
        K.popIn(lD1, t, SINK - 0.2, SINK + 2.4); K.popIn(lD2, t, SINK + 2.6, SINK + 5.6); lBl.forEach((l) => K.popIn(l, t, SINK + 5.8, BACK + 1.4));
      });
    }

    // ================================================================ PERFUME (dark) · diffusion, then Graham: lighter is faster
    {
      U.stage((t) => t >= PD - 0.05 && t < B1 - 0.05); keyLight(PX);
      const W = 3.0, H = 1.6, D = 1.0; add(U5.glassBox(W, H, D), PX, AY, 0);
      const air = U5.swarm(36, { r: 0.05, color: 0x7d8fb0, w: W, h: H, d: D, speed: 0.9, glow: 0.2 }); add(air.g, PX, AY, 0);
      const pf = U5.swarm(14, { r: 0.07, color: 0xd8e05a, w: W, h: H, d: D, speed: 0.9 }); add(pf.g, PX, AY, 0);
      const lt_ = U5.swarm(10, { r: 0.045, color: 0xffffff, w: W, h: H, d: D, speed: 1.6 }); add(lt_.g, PX, AY, 0);
      const hv = U5.swarm(10, { r: 0.1, color: 0xb070e0, w: W, h: H, d: D, speed: 0.55 }); add(hv.g, PX, AY, 0);
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(D, H), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })); wall.rotation.y = Math.PI / 2; add(wall, PX + W / 2 - 0.004, AY, 0);
      const corner = (hx) => V(-W / 2 + hx, -H / 2 + Math.min(hx, H / 2), 0);
      const l1 = tag('perfume, crowded in one corner', 0.05, '#d8e05a', PX, AY - 1.05, 0.1), l2 = tag('from crowded to less crowded: diffusion ✓', 0.048, '#d8e05a', PX, AY - 1.05, 0.1);
      const l3 = tag('spread evenly: no more net flow ✓', 0.05, '#ffffff', PX, AY - 1.05, 0.1);
      const l4 = [grp(tag('a light gas', 0.05, '#ffffff', PX - 0.8, AY - 1.05, 0.1), 'gr'), grp(tag('a heavy gas', 0.05, '#c9a0f0', PX + 0.8, AY - 1.05, 0.1), 'gr')];
      const l5 = [grp(tag('the lighter one spreads faster', 0.05, '#ffd27a', PX, AY - 0.98, 0.1), 'g5'), grp(tag('(Thomas Graham, 1833) ✓', 0.045, '#ffd27a', PX, AY - 1.18, 0.1), 'g5')];
      beats.push((t) => {
        const lt = t - PD;
        air.place(lt, (i) => air.gas(i, lt));
        const hx = lerp(0.25, W / 2, ease(span(t, SPR, EVEN))), hy = Math.min(hx, H / 2), out = ease(span(t, GR - 0.4, GR + 0.4));
        pf.place(lt, (i) => pf.gas(i, lt, corner(hx).setY(-H / 2 + hy), hx, hy, D / 2));
        pf.mesh.visible = out < 1; pf.g.scale.setScalar(Math.max(1e-4, 1 - out));
        const g0 = GR + 0.6, hl = lerp(0.2, W / 2, ease(span(t, g0, g0 + 2.0))), hh = lerp(0.2, W / 2, ease(span(t, g0, g0 + 5.6)));
        lt_.mesh.visible = hv.mesh.visible = t > g0 - 0.3;
        lt_.place(lt, (i) => lt_.gas(i, lt, corner(hl).setY(-H / 2 + Math.min(hl, H / 2)), hl, Math.min(hl, H / 2), D / 2));
        hv.place(lt, (i) => hv.gas(i, lt, corner(hh).setY(-H / 2 + Math.min(hh, H / 2)), hh, Math.min(hh, H / 2), D / 2));
        wall.material.opacity = 0.35 * (bump(t, g0 + 2.0, 0.6) + bump(t, g0 + 5.6, 0.6)); wall.material.color.setHex(t < g0 + 4 ? 0xffffff : 0xc9a0f0);
        K.popIn(l1, t, PD + 0.4, SPR - 0.1); K.popIn(l2, t, SPR + 2.0, EVEN - 0.1); K.popIn(l3, t, EVEN + 0.2, GR - 0.1);
        l4.forEach((l) => K.popIn(l, t, GR + 0.2, g0 + 2.4)); l5.forEach((l) => K.popIn(l, t, g0 + 2.6, B1));
      });
    }

    // ================================================================ BAG (dark) · the bag's skin: one by one through a tiny hole
    {
      U.stage((t) => t >= BD - 0.05 && t < B2 - 0.05); keyLight(EX);
      const W = 2.8, H = 1.5, D = 0.9, sh = new THREE.Shape();
      sh.moveTo(-D / 2, -H / 2); sh.lineTo(D / 2, -H / 2); sh.lineTo(D / 2, H / 2); sh.lineTo(-D / 2, H / 2); sh.lineTo(-D / 2, -H / 2);
      const hole = new THREE.Path(); hole.absarc(0, 0, 0.085, 0, Math.PI * 2, true); sh.holes.push(hole);
      const skin = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.04, bevelEnabled: false, curveSegments: 24 }), new THREE.MeshPhysicalMaterial({ color: 0xdfe8f2, transparent: true, opacity: 0.45, roughness: 0.3, side: THREE.DoubleSide }));
      skin.rotation.y = Math.PI / 2; add(skin, EX - 0.02, AY, 0);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.008, 6, 40), M.glow(0xffd27a, 1.2)); ring.rotation.y = Math.PI / 2; add(ring, EX + 0.025, AY, 0);
      const sm = U5.swarm(16, { r: 0.06, color: 0xd070a0, w: W, h: H, d: D, speed: 0.8 }); add(sm.g, EX, AY, 0);
      const L = V(-W / 4, 0, 0), Rr = V(W / 4, 0, 0), HL = V(-0.12, 0, 0), HR = V(0.12, 0, 0), go = (k) => PASS + 0.8 * k;
      const l1 = [grp(tag('the bag’s thin skin:', 0.05, '#ffffff', EX, AY - 0.95, 0.1), 'sk'), grp(tag('a hole the size of a molecule', 0.05, '#ffd27a', EX, AY - 1.15, 0.1), 'sk')];
      const l2 = [grp(tag('one at a time, no bumping:', 0.05, '#ffd27a', EX, AY - 0.95, 0.1), 'ef'), grp(tag('effusion ✓', 0.06, '#ffd27a', EX, AY - 1.17, 0.1), 'ef')];
      beats.push((t) => {
        const lt = t - BD;
        sm.place(lt, (i) => {
          const left = sm.gas(i, lt, L, W / 4 - 0.06, H / 2, D / 2), right = sm.gas(i, lt + 3, Rr, W / 4 - 0.06, H / 2, D / 2);
          if (i >= 8) return left;                                    // half stay inside for now
          const t0 = go(i), a = span(t, t0 - 0.6, t0), b = span(t, t0, t0 + 0.4), c = span(t, t0 + 0.4, t0 + 1.0);
          if (t < t0 - 0.6) return left; if (a < 1) return left.lerp(HL, ease(a)); if (b < 1) return HL.clone().lerp(HR, b); return HR.clone().lerp(right, ease(c));
        });
        ring.scale.setScalar(1 + 0.25 * Math.max(...[0, 1, 2, 3, 4, 5, 6, 7].map((k) => bump(t, go(k), 0.4))));
        l1.forEach((l) => K.popIn(l, t, BD + 0.4, PASS + 2.6)); l2.forEach((l) => K.popIn(l, t, PASS + 2.8, B2));
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'How does a smell spread across a room?', dockTitle: 'Spreading', intro: INTRO, ticks: TICKS,
      rows: [[0, 'perfume, onions, bromine, a balloon'], [1, 'crowded → less crowded: diffusion'], [1, 'evenly mixed: no more net flow'], [1, 'a lighter gas spreads faster (Graham)'], [1, 'one by one through a tiny hole: effusion'], [1, 'Activity 5.1: bromine spreads into air'], [1, 'why a balloon comes down']],
      short: ['diffusion', 'evenly mixed', 'lighter = faster', 'effusion', 'Activity 5.1', 'the balloon'] }));
    return U.finish();
  },
};
