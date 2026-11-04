// Lesson 501 · States of Matter & Gases (book pp. 122–123: Introduction, Scientific Information (more states),
// Gaseous state, 5.1 Typical properties of gases: i indefinite volume, ii indefinite shape). v1 as a code lesson
// (2026-11-04), replacing the old Blender film. Built from SKILL.md §0 + §1 + §4 (tools: u4kit.js, u5kit.js).
// THE QUESTION (book p.122 "Gaseous state"): "What makes a gas a gas?" → card, docked panel, five ticks.
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//  HOOK   baked table: an ice cube, a glass of water, water boiling into steam, a neon light (named one at a time) ·
//         "All of it is matter: it has mass, takes up space" · "What makes a gas a gas?" → card → dive INTO the ice.
//  INSIDE (dark) a glass box: the molecules of ice in rows, shaking in place "ice: held in place, shaking" · a burner
//         rises under the box, its flame lit (visible cause) · they slip out of their rows and slide on the floor
//         "heated: a liquid, close but sliding" · more heat: they fly apart "more heat: a gas, far apart and fast" ✓ ·
//         two of them glow as they pass "almost no pull between them (very weak forces)" ✓.
//  SPACE  the burner goes; an EMPTY round flask slides in on a tube with a closed tap "an empty round flask" · the tap
//         turns, molecules stream through the tube and fly all over the flask "fills all the space: no fixed volume ✓"
//         · the flask's rim flashes "takes the round shape: no fixed shape ✓".
//  END    back on the table, the neon light glows "glowing gas: plasma, another state ✓" · "A gas fills any space, any
//         shape ✓".
// Game (🎮 Matter Practice › Words + Facts; 🎮 State Sorter + Why? Lab, docs/COVERAGE_U5.md): the other states (liquid crystals, superfluids, supersolids,
//   paramagnetic), matter = mass + space, everyday examples.
// §1 CHECK: written only after looking at the sheets, with frame times: docs/COVERAGE_U5.md.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
import * as U5 from './u5kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const { V, ADIR, DDIR, bump } = U4;

// ---------------------------------------------------------------- places
const AY = 1.9;
const HKX = 0, ICX = HKX - 0.8, WGX = HKX - 0.32, BRX = HKX + 0.2, NEX = HKX + 1.2;     // ice · water · steam · neon light
const SX = 40, BX = SX - 0.9, FX = SX + 1.55;                                            // (dark) the box · the flask

// ---------------------------------------------------------------- time
const T = { card: 10.6 };
const DOCK = T.card + 5.0;
const ID = DOCK + 3.4, HEAT = ID + 3.8, MELT = ID + 4.6, BOIL = ID + 9.6, WEAK = ID + 14.6, FL = ID + 18.0, TAP = ID + 21.8, FILL = ID + 25.2, SHAPE = ID + 28.6, BACK = ID + 32.4;
T.done = BACK + 10.0;
const INTRO = [T.card, DOCK];
const TICKS = [[BOIL + 3.4, 0], [WEAK + 2.6, 1], [FILL + 2.4, 2], [SHAPE + 2.4, 3], [BACK + 3.6, 4]];
const DARK = [[ID, BACK]];
const dark = (t) => DARK.some(([a, b]) => t >= a - 0.05 && t < b - 0.05);
const S = U4.shots(DOCK);

const captions = [
  [5.4, 8.0, 'All of it is matter: it has mass, takes up space', [HKX + 0.2, 0.9, 0.05]],
  [8.1, T.card, 'What makes a gas a gas?', [HKX, 0.9, 0.05]],
  [DOCK + 0.2, ID - 0.3, 'Look inside the ice', [ICX, 0.22, 0.05]],
  [BACK + 6.0, T.done, 'A gas fills any space, any shape ✓', [HKX, 0.9, 0.05]],
];

// ---------------------------------------------------------------- camera
const HK = (t, k = 1, e) => S(t, [HKX + 0.2, 0.34, 0.05], 2.4 * k, 0.9 * k, ADIR, e);
const DK = (t, x, w, h, k = 1, e, y = AY) => S(t, [x, y, 0], w * k, h * k, DDIR, e);
const DIVE = (t, p) => S(t, p, 0.06, 0.05, ADIR, 'in');
const ICE = [ICX, 0.06, 0.02], NEON = [NEX, 0.3, 0.02];
const CAMS = [
  HK(0, 1.05), HK(T.card - 0.05, 0.98), HK(DOCK, 1.02), S(DOCK + 1.8, ICE, 0.7, 0.55), DIVE(ID - 0.05, ICE),
  DK(ID, BX, 2.6, 2.3, 0.3), DK(ID + 1.8, BX, 2.6, 2.3, 1.04, 'out'), DK(FL - 0.05, BX, 2.6, 2.3, 0.97),
  DK(FL + 0.4, SX + 0.3, 4.6, 2.3, 1.02), DK(BACK - 0.05, SX + 0.3, 4.6, 2.3, 0.97),
  S(BACK, ICE, 0.12, 0.1, ADIR, 'out'), HK(BACK + 1.8, 1.02), S(BACK + 3.4, NEON, 0.6, 0.55), S(BACK + 5.8, NEON, 0.58, 0.53), HK(BACK + 7.6, 1.02), HK(T.done, 0.97),
].sort((a, b) => a[0] - b[0]);

export default {
  duration: T.done,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions,
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '501', { dark, AY }), { beats, ST, add, tag, grp, keyLight } = U;
    const fires = [], shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };

    // ================================================================ HOOK / END · ice, water, steam, a neon light
    {
      U.stage((t) => !dark(t)); ST.bake(U.root, 'hook', HKX + 0.2, 2.6, 0.85);
      add(K.dish(0.12), ICX, 0, 0);
      const ice = add(K.solid(new THREE.BoxGeometry(0.09, 0.08, 0.09), new THREE.MeshPhysicalMaterial({ color: 0xe8f6ff, roughness: 0.08, transmission: 0.6, thickness: 0.05, transparent: true, opacity: 0.85, clearcoat: 1 })), ICX, 0.055, 0); ice.rotation.y = 0.5;
      add(K.beaker(0.11, 0.26), WGX, 0, 0); const wl = add(K.liquid(0.105, 0.18, 0x3d9ee6, 0.55), WGX, 0.052, 0);
      const brn = add(K.burner(), BRX, 0, 0); fires.push(brn.userData.flame); brn.userData.flame.scale.setScalar(0.45);
      add(K.tripod(0.56), BRX, 0, 0); add(K.beaker(0.1, 0.18), BRX, 0.56, 0); const bw = add(K.liquid(0.095, 0.1, 0x3d9ee6, 0.55), BRX, 0.612, 0);
      const boil = add(K.bubbles(14, V(0, 0.02, 0), 0.1, 0.1, 0.011), BRX, 0.612, 0), steam = add(K.smoke(10, 0xffffff), BRX, 0.76, 0); steam.scale.setScalar(0.16);
      const pts = []; for (let i = 0; i <= 24; i++) { const u = i / 24; pts.push([-0.2 + 0.4 * u, 0.22 + 0.08 * Math.sin(u * Math.PI * 3)]); }
      const sign = add(K.neonSign(pts, 0xff5a2a), NEX, 0, 0);
      const ls = [['ice: a solid', '#e8f6ff', ICX, 0.2, 0.12], ['water: a liquid', '#9fd2ff', WGX, 0.42, 0.12], ['steam: a gas', '#ffffff', BRX, 1.05, 0.08], ['a neon light', '#ffb8a0', NEX, 0.5, 0.08]].map(([s, c, x, y, z]) => tag(s, 0.05, c, x, y, z));
      const lP = grp(tag('glowing gas: plasma,', 0.05, '#ffb8a0', NEX - 0.05, 0.57, 0.08), 'pl'), lP2 = grp(tag('another state ✓', 0.055, '#ffb8a0', NEX - 0.05, 0.51, 0.08), 'pl');
      beats.push((t) => {
        wl.userData.top.position.y = 0.18 + 0.003 * Math.sin(t * 2.1); bw.userData.top.position.y = 0.1 + 0.004 * Math.sin(t * 9);
        boil.userData.update(t, 0.9); steam.userData.update(t, 0.8);
        sign.userData.set(0.75 + 0.25 * Math.sin(t * 3) * span(t, BACK + 3.0, BACK + 3.4) + 0.25 * span(t, BACK + 3.0, BACK + 3.4));
        ls.forEach((l, i) => K.popIn(l, t, 0.4 + i * 1.25, 1.55 + i * 1.25));
        K.popIn(lP, t, BACK + 3.6, BACK + 5.8); K.popIn(lP2, t, BACK + 3.6, BACK + 5.8);
      });
    }

    // ================================================================ INSIDE (dark) · ice → water → steam, then a gas fills an empty flask
    {
      U.stage((t) => t >= ID - 0.05 && t < BACK - 0.05); keyLight(SX);
      const W = 2.0, H = 1.6, D = 1.0, box = add(U5.glassBox(W, H, D), BX, AY, 0);
      const sw = U5.swarm(27, { r: 0.075, color: 0x59a8ff, w: W, h: H, d: D, gap: 0.3, speed: 1.1 }); add(sw.g, BX, AY, 0);
      const brn = add(K.burner(), BX, AY - H / 2 - 0.78, 0); fires.push(brn.userData.flame); brn.userData.flame.scale.setScalar(0.7);
      // the empty flask on its tube, with a tap
      const fl = add(new THREE.Group(), FX, AY, 0), RF = 0.72, ball = U5.glassBall(RF); fl.add(ball);
      const tL = (FX - RF) - (BX + W / 2), tube = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, tL + 0.04, 24, 1, true), new THREE.MeshPhysicalMaterial({ color: 0x9fc4ff, transparent: true, opacity: 0.25, roughness: 0.1, side: THREE.DoubleSide, depthWrite: false }));
      tube.rotation.z = Math.PI / 2; tube.position.x = -RF - tL / 2; fl.add(tube);
      const tap = new THREE.Group(); tap.position.set(-RF - tL / 2, 0, 0); fl.add(tap);
      const knob = K.solid(new THREE.CylinderGeometry(0.03, 0.03, 0.22, 12), M.gloss(0xd8a040)); knob.position.y = 0.16; tap.add(knob);
      const hub = K.solid(new THREE.SphereGeometry(0.085, 20, 14), M.gloss(0xd8a040)); tap.add(hub);
      const movers = [], stay = []; for (let i = 0; i < 27; i++) (i % 2 ? movers : stay).push(i);
      const T0 = (k) => TAP + 0.4 + k * 0.16, ENTRY = V(BX + W / 2 - 0.1, AY, 0), EXIT = V(FX - RF + 0.1, AY, 0), FC = V(FX, AY, 0);
      const pair = [0, 1].map(() => add(K.glowSprite(0xffd27a, 0.32)));
      const l1 = tag('ice: held in place, shaking', 0.055, '#e8f6ff', BX, AY - 1.05, 0.1), l2 = tag('heated: a liquid, close but sliding', 0.05, '#9fd2ff', BX, AY - 1.05, 0.1);
      const l3 = tag('more heat: a gas, far apart and fast ✓', 0.05, '#ffffff', BX, AY - 1.05, 0.1);
      const l4 = [grp(tag('almost no pull between them', 0.05, '#ffd27a', BX, AY - 0.98, 0.1), 'wk'), grp(tag('(very weak forces) ✓', 0.045, '#ffd27a', BX, AY - 1.18, 0.1), 'wk')];
      const l5 = tag('an empty round flask', 0.055, '#ffffff', FX, AY - 1.05, 0.1), l6 = tag('fills all the space: no fixed volume ✓', 0.05, '#ffd27a', SX + 0.3, AY - 1.05, 0.1);
      const l7 = tag('takes the round shape: no fixed shape ✓', 0.05, '#ffd27a', SX + 0.3, AY - 1.05, 0.1);
      const bx = BX, C0 = V(0, 0, 0);
      beats.push((t) => {
        const a = ease(span(t, MELT, MELT + 2.0)), b = easeIn(span(t, BOIL, BOIL + 1.4)), lt = t - ID;
        sw.place(lt, (i) => {
          const s = sw.solid(i, lt, 1 + 2 * span(t, HEAT, MELT)), q = sw.liquid(i, lt), gpos = sw.gas(i, lt);
          let p = s.lerp(q, a).lerp(gpos, b);
          const k = movers.indexOf(i);
          if (k >= 0 && t > T0(k)) {                                    // through the open tap into the flask
            const u = span(t, T0(k), T0(k) + 0.9), ent = ENTRY.clone().sub(V(bx, AY, 0)), ex = EXIT.clone().sub(V(bx, AY, 0)), inF = sw.ball(i, lt, FC.clone().sub(V(bx, AY, 0)), RF - 0.08);
            p = u < 0.3 ? p.lerp(ent, u / 0.3) : u < 0.7 ? ent.lerp(ex, (u - 0.3) / 0.4) : ex.lerp(inF, (u - 0.7) / 0.3);
          }
          return p;
        });
        const up = ease(span(t, HEAT - 0.8, HEAT)) * (1 - ease(span(t, FL - 0.4, FL + 0.4)));
        brn.position.y = AY - H / 2 - 0.78 - 1.6 * (1 - up); brn.visible = up > 0.01; brn.userData.flame.visible = t > HEAT - 0.1 && t < FL;
        const fin = ease(span(t, FL, FL + 1.4)); fl.position.x = FX + 3.2 * (1 - fin); fl.visible = t > FL - 0.05;
        tap.rotation.x = Math.PI / 2 * ease(span(t, TAP, TAP + 0.5));
        const fr = bump(t, SHAPE + 0.2, 0.8); ball.userData.rim.material.color.setHex(fr > 0.05 ? 0xffd27a : 0x9fc4ff); ball.userData.rim.scale.setScalar(1 + 0.03 * fr);
        pair.forEach((g, j) => { const p = sw.gas(j * 2, lt).add(V(bx, AY, 0)); g.position.copy(p); g.visible = t > WEAK && t < WEAK + 3.4; g.material.opacity = 0.8; });
        K.popIn(l1, t, ID + 0.6, HEAT); K.popIn(l2, t, MELT + 2.2, BOIL - 0.1); K.popIn(l3, t, BOIL + 1.6, WEAK - 0.1); l4.forEach((l) => K.popIn(l, t, WEAK + 0.4, FL - 0.2));
        K.popIn(l5, t, FL + 1.6, TAP - 0.1); K.popIn(l6, t, FILL, SHAPE - 0.1); K.popIn(l7, t, SHAPE + 0.4, BACK);
      });
    }
    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'What makes a gas a gas?', dockTitle: 'A gas', intro: INTRO, ticks: TICKS,
      rows: [[0, 'ice, water, steam, a neon light'], [1, 'heat turns solid → liquid → gas'], [1, 'far apart, fast, almost no pull'], [1, 'no fixed volume: it fills the space'], [1, 'no fixed shape: it takes the container’s'], [1, 'more states: plasma …']],
      short: ['heat: solid → gas', 'far apart, fast', 'no fixed volume', 'no fixed shape', 'more states'] }));
    return U.finish();
  },
};
