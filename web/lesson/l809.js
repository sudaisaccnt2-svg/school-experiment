// Lesson 809 · Uses of sodium (book p. 231: (c) Uses of Sodium i–vi), v1 (2026-10-14).
// Built from SKILL §0 + the approved 805 v3 / 806 / 808 pattern: familiar things on a baked table as the hook, ONE question
// on a card, each use one clear picture with a visible cause and its result labelled on the thing.
// THE QUESTION: "How does such a reactive metal help us?" → card: It makes things · Its own powers (5 rows).
// BEAT SHEET (on screen · the student concludes · why the next beat follows)
//   HOOK    a table: a little street lamp (glowing orange), a bar of soap, a box of baking soda, a petrol can, named one by
//           one; a jar of sodium under oil in front; a gold spark leaps from the sodium to each thing · sodium helped make
//           them all · "but it reacts with almost everything!" → card · "first: it makes useful compounds".
//   COMPOUNDS  a sodium lump in a dish, four empty jars: a gold sodium ball flies into each and fills it: washing soda
//           Na₂CO₃ (crystals), baking soda NaHCO₃ (powder), caustic soda NaOH (pellets), sodamide NaNH₂ (tick 1).
//   LAMP    (night, dark studio) a street lamp: it switches on, glows dim red, then bright orange-yellow; a pool of light
//           on the ground · sodium vapour lamps light our streets (tick 2).
//   REACTOR a model reactor: a glass core with glowing hot rods; liquid sodium (silver beads in a glass pipe) starts to
//           flow, picks up heat (glows orange), gives it to a water tank (the water boils: steam), comes back cool · a
//           coolant (tick 3).
//   PETROL  a beaker of dark petroleum with yellow sulphur specks; tongs drop sodium in; the specks gather on it as white
//           sodium sulphide; the oil turns clear · desulphurization (tick 4).
//   METALS  titanium chloride drips onto molten sodium in a crucible: titanium metal; the same with zirconium chloride:
//           zirconium (sodium as a reducing agent, tick 5).
//   ALLOYS  sodium dropped on a pool of mercury sinks in with a flash: sodium amalgam; silver and sodium melted together
//           in a crucible: one shiny bead, an alloy with silver (tick 6).
//   END     back on the table: the spark visits each thing again · dangerous to touch, useful everywhere.
// Book points (all of (c)): i compounds Na₂CO₃, NaHCO₃, NaOH, NaNH₂ · ii sodium vapour lamps, bright orange-yellow light,
// street lighting · iii coolant in nuclear reactors · iv purification of petroleum, removes sulphur = desulphurization ·
// v reducing agent to prepare titanium, zirconium from their chlorides and oxides · vi alloys: sodium amalgam (mercury),
// with silver. List of uses to memorize → 🎮 game (COVERAGE_U8).
// §1 CHECK (sheets renders/lesson/d809*.jpg, 809_screens.jpg): nothing missing ✓ · one question + bridges ✓ · familiar
// hook (lamp, soap, baking soda, petrol) paid off at the end ✓ · every use: before → visible cause (gold ball, switch,
// pump flow, tongs, dropper, flame) → result on the thing ✓ · ≤ 3 labels a shot ✓ · one place at a time ✓ · camera
// moves ≥ 2 s ✓ · baked tables, dark night for the lamp ✓ · substances own colours (silver sodium, white compounds,
// orange light, dark petroleum, yellow sulphur, mirror mercury) ✓ · every screen ✓ · flicker 0 ✓.
import * as THREE from 'three';
import * as K from './kit.js';
const { M, span, ease, easeIn, back, lerp } = K;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

const TAN = Math.tan(16 * Math.PI / 180), ASP = 1.6, ADIR = [0, 0.45, 1], CDIR = [0, 1.2, 1];
let DOCK = 1e9;
/** a shot: the subject (look, w × h) seen along dir; the engine refits it to the real screen (fit = 6th element) */
function S(t, look, w, h, dir = ADIR, e) {
  h *= 1.14; look = [look[0], look[1] + 0.05 * h, look[2]];        // headroom: the caption floats just above the subject (capNear)
  const dk = t >= DOCK, d = V(...dir).normalize(), dist = Math.max(h / 2 / TAN, (dk ? w / (1 - K.DOCK_W) : w) / 2 / (TAN * ASP)) * 1.1;
  const pos = V(...look).addScaledVector(d, dist).toArray(), fit = { look, w, h, dir, dock: dk ? K.DOCK_W : 0 };
  return dk ? [t, ...K.dockShot(pos, look), undefined, e, fit] : [t, pos, look, undefined, e, fit];
}

// ---------------------------------------------------------------- places (stations 10 apart)
const HOOK = [['street lamp', -0.85, 0.62], ['soap', -0.38, 0.14], ['baking soda', 0.34, 0.3], ['petrol', 0.82, 0.4]];   // name, x, height
const NAV = V(-0.04, 0, 0.3);                                               // the sodium jar in front
const CX = 10, JX = [9.25, 9.75, 10.25, 10.75], JZ = -0.12, LUMP = V(10, 0.05, 0.3);
const LAX = 20, LH = 1.0, LARM = 0.32, HEADX = LAX + LARM;
const RX = 30, PX = 40, PS = 0.055 + 0.34, MX = [49.3, 50.7], CRU = 0.632, AX = 59.15, SX = 60.75;

// ---------------------------------------------------------------- time (every camera move ≥ 2 s)
const T = { name: 0.6, spark: 7.0, ask: 11.2, card: 14.0 };
DOCK = T.card + 5.0;
const C0 = DOCK + 2.5, CB = (i) => C0 + 1.4 + i * 3.4 + (i >= 2 ? 2.4 : 0), CEND = CB(3) + 5.0;
const L0 = CEND, LON = L0 + 3.4, LEND = L0 + 15;
const R0 = LEND, FLOW = R0 + 4.0, BOIL = R0 + 7.5, REND = R0 + 18;
const P0 = REND, PDROP = P0 + 3.6, PG = P0 + 6.2, PEND = P0 + 17;
const M0 = PEND, MZ = M0 + 9.6, MEND = MZ + 8.8;
const A0 = MEND, AG = A0 + 8.2, AM = AG + 2.4, AEND = A0 + 18;
const END = AEND; T.done = END + 12;
const INTRO = [T.card, DOCK];
const TICKS = [[CEND - 0.6, 0], [LEND - 0.6, 1], [REND - 0.6, 2], [PEND - 0.6, 3], [MEND - 0.6, 4], [AEND - 0.6, 5]];

const captions = [
  [0.3, T.spark - 0.2, 'Street lights, soap, baking soda, petrol…'],
  [T.spark - 0.2, T.ask, 'Sodium metal helps to make them all'],
  [T.ask, T.card, 'But sodium reacts with almost everything!'],
  [T.card, DOCK, 'How does such a reactive metal help us?'],
  [DOCK, C0 + 1.2, 'First: it makes useful compounds'],
  [C0 + 1.2, CB(1), 'Washing soda (sodium carbonate)'],
  [CB(1), CB(2) - 2.4, 'Baking soda (sodium bicarbonate)'],
  [CB(2) - 2.4, CB(3), 'Caustic soda (sodium hydroxide)'],
  [CB(3), CEND, 'Sodamide: four compounds, all from sodium ✓'],
  [L0, LON, 'Night falls on the street'],
  [LON, LON + 4.2, 'The lamp holds sodium vapour'],
  [LON + 4.2, LEND, 'A bright orange-yellow light ✓'],
  [R0, FLOW, 'A nuclear reactor makes huge heat'],
  [FLOW, BOIL, 'Liquid sodium flows through it'],
  [BOIL, R0 + 12.0, 'It carries the heat away to water'],
  [R0 + 12.0, REND, 'Sodium cools the reactor: a coolant ✓'],
  [P0, PDROP, 'Petroleum has sulphur in it'],
  [PDROP, PG + 2.0, 'Drop in some sodium…'],
  [PG + 2.0, PG + 6.5, '…it grabs the sulphur (sodium sulphide)'],
  [PG + 6.5, PEND, 'Sulphur removed: desulphurization ✓'],
  [M0, M0 + 2.6, 'Sodium frees metals from their chlorides'],
  [M0 + 2.6, MZ, 'Titanium chloride + sodium → titanium'],
  [MZ, MEND, 'Zirconium is made the same way ✓'],
  [A0, A0 + 3.2, 'Mercury: a liquid metal'],
  [A0 + 3.2, AG - 0.4, 'Sodium mixes into it: sodium amalgam'],
  [AG - 0.4, AM + 1.0, 'Silver and sodium, heated together…'],
  [AM + 1.0, AEND, '…melt into one alloy ✓'],
  [END, END + 4.5, 'Light, soap, baking soda, clean petrol…'],
  [END + 4.5, END + 8.5, 'Sodium helped make them all'],
  [END + 8.5, T.done, 'Dangerous to touch, useful everywhere'],
];

// ---------------------------------------------------------------- camera
const TW = (t, k = 1, e) => S(t, [-0.02, 0.28, 0.05], 2.3 * k, 0.88 * k, ADIR, e);
const cams = [
  TW(0, 1.04), TW(T.spark - 0.5, 1.0), S(T.ask, [0, 0.2, 0.25], 1.2, 0.6), S(T.card, [0, 0.2, 0.2], 1.25, 0.62), S(DOCK, [-0.05, 0.3, 0.05], 2.3, 1.0), S(C0 - 0.05, [-0.05, 0.3, 0.05], 2.2, 0.96),
  // compounds: the lump + jars 1–2, then 3–4, then all four
  S(C0, [9.62, 0.22, 0.05], 1.5, 0.74), S(CB(1) + 2.6, [9.64, 0.22, 0.05], 1.45, 0.72), S(CB(2) - 0.4, [10.38, 0.22, 0.05], 1.5, 0.74), S(CB(3) + 2.6, [10.38, 0.22, 0.05], 1.45, 0.72),
  S(CEND - 1.6, [CX, 0.22, 0.05], 2.0, 0.8), S(CEND - 0.05, [CX, 0.22, 0.05], 1.95, 0.78),
  // the street lamp at night: whole lamp, push in on the head as it lights, its pool of light
  S(L0, [LAX + 0.12, 0.55, 0], 1.2, 1.25), S(LON + 0.2, [LAX + 0.14, 0.6, 0], 1.12, 1.18), S(LON + 4.0, [HEADX - 0.05, 0.62, 0], 0.9, 1.0), S(LEND - 0.05, [HEADX - 0.05, 0.6, 0], 0.88, 0.98),
  // the reactor
  S(R0, [RX, 0.38, 0], 1.55, 0.95), S(FLOW + 0.5, [RX, 0.38, 0], 1.5, 0.92), S(R0 + 12.0, [RX + 0.2, 0.36, 0], 1.25, 0.8), S(REND - 0.05, [RX + 0.2, 0.36, 0], 1.2, 0.78),
  // the petroleum
  S(P0, [PX, 0.35, 0], 1.0, 0.95), S(PDROP + 2.0, [PX, 0.3, 0], 0.85, 0.82), S(PEND - 0.05, [PX, 0.3, 0], 0.8, 0.78),
  // titanium, then zirconium
  S(M0, [MX[0], 0.6, 0], 0.95, 1.15), S(M0 + 2.4, [MX[0], CRU + 0.1, 0], 0.62, 0.56, CDIR), S(MZ - 0.1, [MX[0], CRU + 0.1, 0], 0.6, 0.54, CDIR), S(MZ + 2.0, [(MX[0] + MX[1]) / 2, CRU + 0.08, 0], 2.1, 0.8, [0, 0.8, 1]), S(MEND - 0.05, [(MX[0] + MX[1]) / 2, CRU + 0.08, 0], 2.0, 0.76, [0, 0.8, 1]),
  // mercury, then silver
  S(A0, [AX, 0.12, 0], 0.7, 0.5), S(A0 + 3.0, [AX, 0.08, 0], 0.55, 0.4), S(AG - 2.2, [AX, 0.08, 0], 0.52, 0.38), S(AG, [SX, CRU + 0.1, 0], 0.62, 0.56, CDIR), S(AEND - 0.05, [SX, CRU + 0.1, 0], 0.56, 0.5, CDIR),
  // END: the table again
  TW(END, 1.04), TW(T.done, 0.98),
];

export default {
  capNear: true, oneText: true,
  duration: T.done,
  captions,
  cams,

  build({ scene, cam, R }) {
    const beats = [], fires = [];
    const ST = K.studio({ scene, R }, '809', { dark: (t) => t >= L0 - 0.05 && t < LEND - 0.05 });   // FIRST: models read the look
    beats.push((t) => ST.update(t));
    let root = scene;
    const add = (o, x = 0, y = 0, z = 0) => { o.position.set(x, y, z); root.add(o); return o; };
    const stage = (show) => { root = new THREE.Group(); scene.add(root); const g = root; beats.push((t) => { g.visible = show(t); }); return g; };
    const lbl = (text, h, color, x, y, z = 0, w = 700) => add(K.label(text, h, color, w), x, y, z);
    const tags = [], tag = (text, h, color, x, y, z = 0, w = 700) => { const l = lbl(text, 0.1, color, x, y, z, w); l.userData.frac = h * 1.8; tags.push(l); return l; };
    const shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
    const fire = (tint, size, opts) => { const f = K.makeFire(tint, size, opts); fires.push(f); return f; };
    const naMat = () => new THREE.MeshPhysicalMaterial({ color: 0xe6eaf0, metalness: 0.6, roughness: 0.25, clearcoat: 0.6, emissive: 0xff6a1a, emissiveIntensity: 0 });
    /** tongs bring something down from above to `to` (arrive m0+1.2), let go at m0+1.4, rise away by m0+2.4 */
    const carry = (tg, t, m0, to) => {
      tg.visible = t > m0 && t < m0 + 2.4; if (!tg.visible) return;
      const top = to.clone().add(V(0, 1.1, 0));
      tg.position.copy(t < m0 + 1.2 ? top.lerp(to, 1 - (1 - span(t, m0, m0 + 1.2)) ** 2) : t < m0 + 1.5 ? to.clone() : to.clone().lerp(top, easeIn(span(t, m0 + 1.5, m0 + 2.4))));
      tg.userData.set(lerp(0.03, 0.08, span(t, m0 + 1.35, m0 + 1.5)));
    };
    const held = (t, m0, to) => (t < m0 + 1.2 ? to.clone().add(V(0, 1.1 * (1 - (1 - (1 - span(t, m0, m0 + 1.2)) ** 2) ** 1), 0)) : to.clone());
    /** a gold spark that leaps along an arc a → b between t0 and t1 (a glowing trail behind it) */
    const sparks = [];
    const spark = () => { const g = add(new THREE.Group()), s = K.sparkle(0xffd27a, 0.16), b = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 12), M.glow(0xffc54a, 2.5)); g.add(s, b);
      const trail = Array.from({ length: 6 }, (_, i) => { const p = K.sparkle(0xffc54a, 0.1 - i * 0.012); add(p); return p; }); sparks.push({ g, trail }); return { g, trail }; };
    const fly = (sp, t, t0, t1, a, b, lift = 0.35) => {
      const on = t > t0 && t < t1; sp.g.visible = on; sp.trail.forEach((p, i) => { const u = span(t - (i + 1) * 0.05, t0, t1); p.visible = on && u > 0 && u < 1; p.position.copy(K.arc(a, b, lift, ease(u))); });
      if (on) sp.g.position.copy(K.arc(a, b, lift, ease(span(t, t0, t1))));
    };

    // ================================================================ HOOK / END · the table of familiar things
    {
      stage((t) => t < C0 - 0.05 || t >= END - 0.05); ST.bake(root, 'hook', -0.05, 2.9, 1.2);
      const lamp = add(K.streetLamp(0.55, 0.2), HOOK[0][1] - 0.1, 0, -0.05);
      add(K.soapBar(), HOOK[1][1], 0, 0.02).rotation.y = 0.3;
      add(K.printBox(0.17, 0.26, 0.08, '#e8742a', ['BAKING', 'SODA']), HOOK[2][1], 0, 0).rotation.y = -0.15;
      add(K.jerryCan(1.2), HOOK[3][1], 0, -0.02).rotation.y = -0.35;
      const vl = add(new THREE.Group(), NAV.x, 0, NAV.z); vl.add(K.vial(0.09, 0.22));
      const oil = K.liquid(0.08, 0.15, 0xd99a2a, 0.55); oil.position.y = 0.025; vl.add(oil);
      const kept = K.lump(0.035, new THREE.MeshPhysicalMaterial({ color: 0xc9c6bd, metalness: 0.35, roughness: 0.5 }), 3, 0.7); kept.position.y = 0.045; vl.add(kept);
      const names = HOOK.map(([n, x, h], i) => tag(n, 0.05, '#ffffff', i ? x : x + 0.2, i ? h + 0.14 : 0.3, 0.05));
      const lNa = tag('sodium (under oil)', 0.05, '#ffd58a', NAV.x, 0.42, NAV.z);
      const sp = spark(), from = V(NAV.x, 0.2, NAV.z);
      const bump = HOOK.map(([, x]) => root.children.find((o) => Math.abs(o.position.x - x) < 0.12 && !o.isSprite) || lamp);
      beats.push((t) => {
        lamp.userData.on(1);
        names.forEach((l, i) => K.popIn(l, t, T.name + i * 1.5, T.name + i * 1.5 + 2.6));
        K.popIn(lNa, t, T.spark - 0.6, T.card);
        // the spark visits each thing (and again at the end)
        const base = t < END ? T.spark : END + 0.4, k = Math.floor((t - base) / 0.95);
        if (t > base && k < 4) { const [, x, h] = HOOK[k]; fly(sp, t, base + k * 0.95, base + k * 0.95 + 0.85, k ? V(HOOK[k - 1][1], HOOK[k - 1][2] * 0.6, 0) : from, V(x, h * 0.6, 0)); }
        else fly(sp, t, -1, -1, from, from);
        bump.forEach((o, i) => { const u = t - base - i * 0.95 - 0.85; o.scale.setScalar(1 + (u > 0 && u < 0.4 ? 0.08 * Math.sin(Math.PI * u / 0.4) : 0)); });
        if (t > END) { HOOK.forEach(([n], i) => K.popIn(names[i], t, 1e9)); }
      });
      const ticks = HOOK.map(([, x, h]) => tag('✓', 0.06, '#7be08a', x, h + 0.14, 0.05));
      beats.push((t) => ticks.forEach((l, i) => K.popIn(l, t, END + 0.4 + i * 0.95 + 0.85, 1e9)));
    }

    // ================================================================ i · COMPOUNDS: a gold sodium ball fills each jar
    {
      stage((t) => t >= C0 - 0.05 && t < CEND); ST.bake(root, 'comp', CX, 2.2, 1.2);
      add(K.dish(0.14), LUMP.x, 0, LUMP.z); add(K.lump(0.07, naMat(), 5, 0.65), LUMP.x, 0.045, LUMP.z);
      const kinds = [['crystals', 0xf2f4f6, 'washing soda (Na₂CO₃)'], ['powder', 0xf7f6f2, 'baking soda (NaHCO₃)'], ['pellets', 0xf4f3ee, 'caustic soda (NaOH)'], ['powder', 0xd9d6cc, 'sodamide (NaNH₂)']];
      const jars = kinds.map(([k, c], i) => { const j = add(K.compoundJar(k, c), JX[i], 0, JZ); j.children[0].children[1].visible = false; j.userData.fill(0); return j; });
      const labs = kinds.map(([, , n], i) => tag(n, 0.05, '#ffffff', JX[i], 0.45, JZ + 0.05));
      const lNa = tag('sodium', 0.05, '#ffffff', LUMP.x, 0.2, LUMP.z + 0.05);
      const sps = JX.map(() => spark());
      beats.push((t) => {
        K.popIn(lNa, t, C0 + 0.3, CB(0) + 0.6);
        jars.forEach((j, i) => {
          const b = CB(i); fly(sps[i], t, b, b + 1.1, LUMP.clone().add(V(0, 0.08, 0)), V(JX[i], 0.12, JZ), 0.45);
          j.userData.fill(ease(span(t, b + 1.0, b + 1.9)));
          K.popIn(labs[i], t, b + 1.6, i % 2 ? CB(i) + 4.2 : CB(i + 1) + 0.6);
        });
      });
    }

    // ================================================================ ii · STREET LAMP (night)
    {
      stage((t) => t >= L0 - 0.05 && t < LEND);
      add(K.solid(new THREE.BoxGeometry(1.6, 0.03, 0.7).translate(0, 0.015, 0), M.matte(0x3a3d42, 0.9)), LAX + 0.15, 0, 0);    // a strip of pavement
      add(K.solid(new THREE.BoxGeometry(1.6, 0.05, 0.08).translate(0, 0.025, 0), M.matte(0x8a8d92, 0.8)), LAX + 0.15, 0, 0.39);   // its kerb
      const lamp = add(K.streetLamp(LH, LARM), LAX, 0.03, 0);
      const lL = tag('street lamp', 0.05, '#ffffff', LAX - 0.32, 0.7, 0), lV = tag('sodium vapour inside', 0.05, '#ffd58a', HEADX, LH + 0.13, 0);
      const lO = tag('bright orange-yellow light', 0.05, '#ffc46a', HEADX, 0.4, 0.25);
      beats.push((t) => {
        lamp.userData.on(ease(span(t, LON, LON + 3.6)));
        K.popIn(lL, t, L0 + 0.8, LON + 0.6); K.popIn(lV, t, LON + 1.0, LON + 4.2); K.popIn(lO, t, LON + 4.6, LEND);
      });
    }

    // ================================================================ iii · REACTOR COOLANT
    {
      stage((t) => t >= R0 - 0.05 && t < REND); ST.bake(root, 'react', RX, 2.0, 1.2);
      const loop = add(K.coolantLoop(), RX, 0, 0), core = loop.userData.core.clone().add(V(RX, 0, 0)), tk = loop.userData.tank.clone().add(V(RX, 0, 0));
      const bub = add(K.bubbles(30, V(tk.x, 0.05, 0), 0.315, 0.14, 0.012)), stm = add(K.smoke(8, 0xffffff), tk.x, 0.36, 0); stm.scale.setScalar(0.12);
      const lC = tag('reactor core: very hot', 0.05, '#ff9f7a', core.x, 0.78, 0.1), lS = tag('liquid sodium', 0.05, '#ffffff', RX - 0.12, 0.84, 0.05);
      const lW = tag('water boils: steam', 0.05, '#bfe0ff', tk.x - 0.12, 0.74, 0.1);
      beats.push((t) => {
        loop.userData.update(t, ease(span(t, FLOW, FLOW + 1.5)));
        const boil = ease(span(t, BOIL, BOIL + 1.5)); bub.visible = boil > 0.01; bub.userData.update(t, boil);
        stm.visible = boil > 0.01; stm.userData.update(t, boil);
        K.popIn(lC, t, R0 + 0.8, FLOW); K.popIn(lS, t, FLOW + 0.6, BOIL); K.popIn(lW, t, BOIL + 1.0, REND);
      });
    }

    // ================================================================ iv · PETROLEUM: sodium grabs the sulphur
    {
      stage((t) => t >= P0 - 0.05 && t < PEND); ST.bake(root, 'pet', PX, 1.6, 1.0);
      add(K.beaker(0.24, 0.5), PX, 0, 0); const oil = add(K.liquid(0.23, 0.34, 0x5a3610, 0.62), PX, 0.055, 0);
      const dirty = new THREE.Color(0x4a2c0c), clean = new THREE.Color(0xd99a2a);
      const mat = naMat(), na = add(K.lump(0.045, mat, 8, 0.7)), tg = add(K.tongs(0.6)), BOT = V(PX + 0.02, 0.085, 0.02);
      const n = 46, specks = new THREE.InstancedMesh(new THREE.SphereGeometry(0.013, 10, 8), new THREE.MeshStandardMaterial({ color: 0xffd83a, roughness: 0.5, emissive: 0x806000 }), n); root.add(specks);
      const home = Array.from({ length: n }, (_, i) => { const r = 0.19 * Math.sqrt(K.hash(i, 1)), a = K.hash(i, 2) * 6.283; return V(PX + Math.cos(a) * r, 0.08 + 0.3 * K.hash(i, 3), Math.sin(a) * r); });
      const m4 = new THREE.Matrix4(), p = V(0, 0, 0);
      const lP = tag('petroleum', 0.05, '#ffd58a', PX - 0.05, 0.62, 0.1), lSu = tag('sulphur specks', 0.05, '#ffe38a', PX + 0.05, 0.62, 0.1);
      const lN = tag('sodium', 0.05, '#ffffff', PX + 0.3, 0.6, 0), lS = tag('sodium sulphide (white)', 0.05, '#ffffff', PX, 0.62, 0.1);
      const lOk = tag('sulphur removed ✓', 0.055, '#ffffff', PX, 0.62, 0.1);
      beats.push((t) => {
        const m0 = PDROP; carry(tg, t, m0, BOT.clone().setY(PS + 0.12));
        const f = K.drop(t, m0 + 1.4, PS + 0.12, BOT.y, 0.9, 0.0);
        na.position.copy(t < m0 + 1.4 ? held(t, m0, BOT.clone().setY(PS + 0.12)) : V(BOT.x, f.y, BOT.z)); na.visible = t > m0;
        const g = span(t, PG, PG + 4.0);
        for (let i = 0; i < n; i++) {
          const u = ease(Math.min(1, Math.max(0, g * 1.4 - (i / n) * 0.4))), w = Math.sin(t * 0.8 + i) * 0.006;
          p.copy(home[i]).lerp(BOT, u).add(V(w, w * 0.5, 0)); const s = u > 0.97 ? 1e-3 : 1;
          m4.makeScale(s, s, s).setPosition(p); specks.setMatrixAt(i, m4);
        }
        specks.instanceMatrix.needsUpdate = true;
        const cr = ease(span(t, PG + 1.0, PG + 4.5)); mat.color.set(0xe6eaf0).lerp(new THREE.Color(0xf6f4ec), cr); mat.metalness = 0.6 * (1 - cr); mat.roughness = lerp(0.25, 0.9, cr);
        na.scale.setScalar(1 + 0.35 * cr);
        const oc = dirty.clone().lerp(clean, ease(span(t, PG + 3.0, PG + 6.0))); oil.children[0].material.color.copy(oc); oil.children[1].material.color.copy(oc).lerp(new THREE.Color(0xffffff), 0.15);
        K.popIn(lP, t, P0 + 0.5, P0 + 2.2); K.popIn(lSu, t, P0 + 2.4, PDROP + 0.6); K.popIn(lN, t, PDROP + 0.4, PDROP + 2.4);
        K.popIn(lS, t, PG + 2.4, PG + 6.2); K.popIn(lOk, t, PG + 6.6, PEND);
      });
    }

    // ================================================================ v · METALS: titanium, zirconium (sodium frees them from their chlorides)
    {
      stage((t) => t >= M0 - 0.05 && t < MEND); ST.bake(root, 'met', (MX[0] + MX[1]) / 2, 2.6, 1.2);
      const run = (x, t0, chl, metal, col) => {
        add(K.tripod(0.62, 0.15), x, 0, 0); add(K.crucible(0.13, 0.11), x, CRU, 0);
        const b = add(K.burner(), x, 0, 0); b.userData.flame.scale.setScalar(0.45); fires.push(b.userData.flame);
        const pool = add(K.solid(new THREE.CylinderGeometry(0.078, 0.072, 0.02, 32), new THREE.MeshPhysicalMaterial({ color: 0xe8ecf0, metalness: 0.8, roughness: 0.12, emissive: 0xff6a1a, emissiveIntensity: 0.25 }), { outline: false }), x, CRU + 0.024, 0);
        const spg = add(K.lump(0.055, M.matte(col, 0.85), 13 + x, 0.7, 0.8), x, CRU + 0.04, 0), salt = add(K.lump(0.08, M.matte(0xf4f3ee, 0.9), 14 + x, 0.35, 0.5), x, CRU + 0.025, 0);
        const dr = add(K.dropper(0.34)), drops = Array.from({ length: 4 }, () => add(new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 8), M.bubble())));
        const fumes = add(K.smoke(6, 0xffffff), x, CRU + 0.1, 0); fumes.scale.setScalar(0.08);
        const lD = tag(chl, 0.05, '#cfe8ff', x + 0.05, CRU + 0.34, 0.05), lM = tag(metal + ' metal ✓', 0.055, '#ffffff', x, CRU + 0.3, 0.05), lP = tag('molten sodium', 0.05, '#ffffff', x, CRU + 0.3, 0.05);
        beats.push((t) => {
          const dIn = ease(span(t, t0 + 0.6, t0 + 1.6)) * (1 - easeIn(span(t, t0 + 4.4, t0 + 5.4)));
          dr.position.set(x + 0.02, CRU + 0.2 + 1.0 * (1 - dIn), 0); dr.visible = dIn > 0.01;
          drops.forEach((d, i) => { const s0 = t0 + 1.9 + i * 0.55, u = span(t, s0, s0 + 0.35); d.visible = u > 0 && u < 1; d.position.set(x + 0.02, lerp(CRU + 0.2, CRU + 0.04, u * u), 0); });
          const grow = ease(span(t, t0 + 2.3, t0 + 5.6));
          spg.scale.setScalar(Math.max(1e-4, grow)); spg.visible = grow > 0.01; salt.scale.setScalar(Math.max(1e-4, grow)); salt.visible = grow > 0.01;
          pool.scale.set(1 - 0.4 * grow, 1, 1 - 0.4 * grow);
          fumes.visible = t > t0 + 2.0 && t < t0 + 7; fumes.userData.update(t, 0.8 * (1 - span(t, t0 + 5.5, t0 + 7)));
          K.popIn(lP, t, t0 - 0.2, t0 + 1.4); K.popIn(lD, t, t0 + 1.6, t0 + 5.2); K.popIn(lM, t, t0 + 5.6, t0 + 9.0);
        });
      };
      run(MX[0], M0 + 0.8, 'titanium chloride (TiCl₄)', 'titanium', 0x7d8288);
      run(MX[1], MZ + 1.6, 'zirconium chloride (ZrCl₄)', 'zirconium', 0x8a8f96);
    }

    // ================================================================ vi · ALLOYS: sodium amalgam, sodium + silver
    {
      stage((t) => t >= A0 - 0.05 && t < AEND); ST.bake(root, 'all', (AX + SX) / 2, 2.4, 1.2);
      add(K.dish(0.17), AX, 0, 0);
      const hg = add(K.lump(0.13, new THREE.MeshPhysicalMaterial({ color: 0xb8bec6, metalness: 1, roughness: 0.04, clearcoat: 1 }), 21, 0.18, 0.12), AX, 0.016, 0);
      K.photoEnv('bake/studio.hdr').then((tx) => { hg.material.envMap = tx; hg.material.envMapIntensity = 1.4; hg.material.needsUpdate = true; });
      const mat = naMat(), na = add(K.lump(0.04, mat, 9, 0.7)), tg = add(K.tongs(0.6)), ON = V(AX + 0.02, 0.05, 0.01);
      const fl = add(K.sparkle(0xfff0c0, 0.25), AX, 0.06, 0.02), sm = add(K.smoke(5, 0xffffff), AX, 0.06, 0); sm.scale.setScalar(0.06);
      const lHg = tag('mercury (a liquid metal)', 0.05, '#ffffff', AX, 0.24, 0.05), lAm = tag('sodium amalgam ✓', 0.055, '#ffffff', AX, 0.24, 0.05);
      // silver + sodium melted together in a crucible
      add(K.tripod(0.62, 0.15), SX, 0, 0); add(K.crucible(0.13, 0.11), SX, CRU, 0);
      const b = add(K.burner(), SX, 0, 0), bf = b.userData.flame; fires.push(bf);
      const silver = new THREE.MeshPhysicalMaterial({ color: 0xe9ecef, metalness: 1, roughness: 0.12, emissive: 0xff6a1a, emissiveIntensity: 0 });
      K.photoEnv('bake/studio.hdr').then((tx) => { silver.envMap = tx; silver.needsUpdate = true; });
      const ag = add(K.ingot(silver, 0.09, 0.03, 0.05, 0.8), SX - 0.035, CRU + 0.012, -0.01), naS = add(K.lump(0.026, naMat(), 30, 0.75), SX + 0.045, CRU + 0.035, 0.02);
      const bead = add(K.solid(new THREE.SphereGeometry(0.045, 32, 20).scale(1, 0.55, 1), silver, { outline: false }), SX, CRU + 0.035, 0);
      const lAg = tag('silver', 0.05, '#ffffff', SX - 0.08, CRU + 0.26, 0.05), lNa = tag('sodium', 0.05, '#ffffff', SX + 0.1, CRU + 0.2, 0.05);
      const lAl = tag('an alloy with silver ✓', 0.055, '#ffffff', SX, CRU + 0.3, 0.05);
      beats.push((t) => {
        const m0 = A0 + 2.0; carry(tg, t, m0, ON.clone().setY(0.1));
        const sink = ease(span(t, m0 + 1.6, m0 + 3.0));
        na.position.copy(t < m0 + 1.4 ? held(t, m0, ON.clone().setY(0.1)) : V(ON.x, lerp(0.1, ON.y, ease(span(t, m0 + 1.4, m0 + 1.7))) - 0.03 * sink, ON.z));
        na.visible = t > m0 && sink < 0.99; na.scale.setScalar(Math.max(1e-4, 1 - sink));
        const fo = Math.sin(Math.PI * span(t, m0 + 1.7, m0 + 2.5)); fl.visible = fo > 0.01; fl.scale.setScalar(0.25 * fo + 1e-4); fl.material.rotation = t * 2;
        sm.visible = t > m0 + 1.7 && t < m0 + 4.5; sm.userData.update(t, 0.6 * (1 - span(t, m0 + 3.5, m0 + 4.5)));
        K.popIn(lHg, t, A0 + 0.5, m0 + 1.4); K.popIn(lAm, t, m0 + 2.8, AG - 2.4);
        // silver
        const on = back(span(t, AM - 1.0, AM - 0.6)); bf.visible = on > 0.01; bf.scale.setScalar(Math.max(1e-4, 0.45 * on));
        const melt = ease(span(t, AM, AM + 2.6)), glow = ease(span(t, AM - 0.4, AM + 1.0)) * (1 - ease(span(t, AM + 2.6, AM + 4.6)));
        silver.emissiveIntensity = 0.35 * glow;
        ag.scale.setScalar(Math.max(1e-4, 1 - melt)); ag.visible = melt < 0.99; naS.scale.setScalar(Math.max(1e-4, 1 - melt)); naS.visible = melt < 0.99;
        bead.scale.setScalar(Math.max(1e-4, melt)); bead.visible = melt > 0.01;
        K.popIn(lAg, t, AG + 0.4, AM); K.popIn(lNa, t, AG + 1.0, AM + 0.2); K.popIn(lAl, t, AM + 2.4, AEND);
      });
    }

    // ================================================================ THE QUESTION CARD (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'How does such a reactive metal help us?', intro: INTRO, ticks: TICKS,
      rows: [[0, '1 · It makes things'], [1, 'washing soda, baking soda, caustic soda…'], [0, '2 · Its own powers'], [1, 'light: street lamps'], [1, 'carries heat: nuclear reactors'],
        [1, 'grabs sulphur: cleans petroleum'], [1, 'frees metals: titanium, zirconium'], [1, 'mixes with metals: alloys']],
      short: ['compounds', 'street lamps', 'reactor coolant', 'cleans petroleum', 'frees metals', 'alloys'] }));
    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));
    beats.push(() => { const nar = Math.min(1, (cam.aspect / 1.5) ** 0.7); tags.forEach((l) => { if (l.visible) l.scale.multiplyScalar(cam.position.distanceTo(l.position) * 2 * TAN * l.userData.frac * nar / 0.1); }); });

    return (t, dt) => { for (const b of beats) b(t, dt); };
  },
};
