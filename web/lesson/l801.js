// Lesson 801 v2 · Metals (book pp. 218–219: Introduction, 8.1 Metals, Scientific Tidbit). Baked photo studio (kit.studio),
// dark studio inside the atoms. v1 rejected (user 2026-10-13: "I didn't understand the picture at all" → "can't tell
// what's happening"; backups/l801_v1.js): things changed with no visible cause, tests had no question and no "before",
// ~5 s per test. v2 rule for EVERY test: the caption asks the question → the BEFORE is shown and named → a visible
// cause does it (tongs, flame, hammer, clamp, days passing) → the RESULT gets a ✓ label on the thing and is held.
// STORY SPINE (the book's own order and words):
//   Open    three shiny metals in air. Sodium dulls in seconds, then catches fire; an iron nail with water drops rusts
//           (day 1 → 2 → 3); gold and platinum on day 3: still shiny. "Why?" In nature: gold is found pure (a nugget
//           in quartz), sodium only in compounds (rock salt). Bridge: "First: what makes a metal a metal?"
//   Tests   1 electricity: a gap, bulb off → tongs lay a copper strip across → current flows through it, bulb lights.
//           2 heat: wax beads stuck on a copper rod → burner at one end → the heat creeps along, each bead drops as
//           it arrives. 3 hammer: copper ball → flat sheet, not broken (malleable). 4 pull: a copper rod in two
//           clamps is pulled → long thin wire (ductile). Solid bars named · mercury drop splashes, runs: a liquid.
//   Oxide   sodium burns in a jar of oxygen → white oxide → in water it dissolves → tongs dip red litmus: it turns
//           blue (alkaline) → metal oxides and hydroxides are bases (a basic oxide).
//   Atoms   into the sodium in its oil jar → atoms → 2, 8, 1 → the outer electron leaves → 11 + / 10 − = Na⁺, a cation;
//           metals give electrons away (electropositive). The exception: hydrogen, a non-metal, also gives its → H⁺.
//   Tidbit  the periodic table turns blue (metal) / green (non-metal) rule by rule, in the book's order.
//   End     back to the three metals: sodium loses its electron easily, it burns; gold holds on, stays shiny and free.
// Memorize-only (→ game Metal or Non-metal? › In the table): the Tidbit list.
import * as THREE from 'three';
import * as K from './kit.js';
import { place } from '../games/u3data.js';
const { M, span, ease, easeIn, back, lerp, hash } = K;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

const TAN = Math.tan(16 * Math.PI / 180), ASP = 1.6, DIR = [0, 0.5, 1];   // the camera looks down ~27° onto the table
function S(t, look, w, h, dir = DIR, e) {                          // after the checklist docks, keep the subject right of it
  h *= 1.14; look = [look[0], look[1] + 0.05 * h, look[2]];        // headroom: the caption floats just above the subject (capNear)
  const dk = t >= DOCK, d = V(...dir).normalize(), dist = Math.max(h / 2 / TAN, (dk ? w / (1 - K.DOCK_W) : w) / 2 / (TAN * ASP)) * 1.1;
  const pos = V(...look).addScaledVector(d, dist).toArray();
  const fit = { look, w, h, dir, dock: dk ? K.DOCK_W : 0 };             // the engine refits the shot to the real screen
  return dk ? [t, ...K.dockShot(pos, look), undefined, e, fit] : [t, pos, look, undefined, e, fit];
}

const SX = { intro: 0, elec: 12, shape: 24, state: 36, ox: 48 };       // stations far apart: a shot never sees another
const NAX = -1.3, FEX = 0, AUX = 1.3;                                  // the three metals in air
const CX = SX.elec - 1.35, RX = SX.elec + 1.6;                        // circuit centre · heated rod centre
const AX = SX.shape - 1.1, DX = SX.shape + 1.2;                       // anvil · pulling clamps
const IX = (i) => SX.state - 1.15 + i * 0.42, HGX = SX.state + 1.3;    // the bars · mercury
const VXo = SX.ox - 1.6, JX = SX.ox - 0.3, BX = SX.ox + 1.3;        // sodium in oil · oxygen jar · water beaker
const LUMP = V(VXo, 0.1, 0.3);                                         // the dive goes into this piece of sodium
const AT = V(100, 1.8, 0), HX = AT.x + 5.2;                            // inside sodium · hydrogen
const TX = 130, TP = 0.5, COL = (c) => TX + (c - 9.5) * TP;            // periodic table wall
const TY = (r) => (r <= 7 ? 4.6 - (r - 1) * TP : 4.6 - 7 * TP - 0.3 - (r - 8) * TP);

const T = {
  na: 2.4, tarn: 3.8, fire: 6.4, fe: 10.4, au: 17.0, why: 20.6, found: 25.0, bridge: 31.0,
  elec: 37.0, strip: 39.6, heat: 49.6, hot: 51.8, mall: 63.2, duct: 75.4, solid: 87.4, hg: 92.0,
  ox: 102.8, wat: 111.4, lit: 116.6, dive: 127.6, atom: 130.2,
};
Object.assign(T, { rev: T.atom + 2.6, out: T.atom + 5.0, tug: T.atom + 7.2, lose: T.atom + 9.8, epos: T.atom + 13.8, ep2: T.atom + 16.2,
  h: T.atom + 18.8, hfree: T.atom + 22.0, table: T.atom + 28.6, g1: T.atom + 31.6, g2: T.atom + 34.2, g3: T.atom + 36.6, g4: T.atom + 39.2,
  g5: T.atom + 41.8, g68: T.atom + 44.4, d: T.atom + 47.2, f: T.atom + 50.0, sum: T.atom + 52.8, end: T.atom + 55.4 });
T.card = T.end + 8.2; T.done = T.card + 3.5;                        // the full checklist closes the lesson
/** THE POINT of the page (user 2026-10-13: "I don't get the overall meaning"): "What is a metal?" — the book answers
 *  it 3 ways. A checklist card shows the plan after the opening, ticks one row after every test, and closes the lesson. */
const INTRO = [T.bridge + 0.5, T.elec - 0.6], DOCK = T.elec - 0.3;
const TICKS = [[T.heat - 2.4, 0], [T.mall - 2.4, 1], [T.duct - 2.4, 2], [T.solid - 2.4, 3], [T.ox - 2.4, 4], [T.dive - 2.4, 5], [T.table - 2.4, 6]];
const HITS = [T.mall + 2.3, T.mall + 3.3, T.mall + 4.3];               // the hammer lands
const ROD0 = RX + 0.5, HEAT = (t) => Math.max(0, (t - T.hot - 0.5) / 6.2);   // how far the heat has crept from the hot end (rod is 1.0 long)
const BEADX = [RX + 0.23, RX + 0.03, RX - 0.17, RX - 0.37];            // nearest the flame first
const MELT = BEADX.map((x) => T.hot + 0.5 + (ROD0 - x) * 6.2 + 0.2);    // a bead drops just after the heat reaches it

// ---------------------------------------------------------------- captions (plain words, one idea each; the tests ask first)
const captions = [
  [0.3, T.na, 'Three shiny metals, left in the air'],
  [T.na, T.fire, 'Sodium: in seconds the air dulls it…'],
  [T.fire, T.fe, '…then it catches fire!'],
  [T.fe, T.au, 'Iron in moist air: it rusts in a few days'],
  [T.au, T.why, 'Gold and platinum: still shiny'],
  [T.why, T.found, 'All metals, same air. Why so different?'],
  [T.found, T.bridge, 'In nature: gold is pure, sodium only in compounds'],
  [T.bridge, T.elec, 'First: what is a metal? The book gives 3 ways to tell'],
  [T.elec, T.strip + 1.4, 'Test 1: does a metal carry electricity?'],
  [T.strip + 1.4, T.heat - 2.6, 'Copper closes the gap: the bulb lights'],
  [T.heat - 2.6, T.heat, 'A metal carries electricity ✓'],
  [T.heat, T.hot + 1.0, 'Test 2: does a metal carry heat?'],
  [T.hot + 1.0, T.mall - 2.6, 'Heat travels along the copper: the wax melts'],
  [T.mall - 2.6, T.mall, 'A metal carries heat ✓'],
  [T.mall, HITS[0], 'Test 3: hit copper with a hammer'],
  [HITS[0], T.duct - 2.6, 'It goes flat, it doesn’t break'],
  [T.duct - 2.6, T.duct, 'A metal hammers flat: malleable ✓'],
  [T.duct, T.duct + 2.4, 'Test 4: pull a copper rod'],
  [T.duct + 2.4, T.solid - 2.6, 'It stretches into a long thin wire'],
  [T.solid - 2.6, T.solid, 'A metal pulls into wire: ductile ✓'],
  [T.solid, T.hg, 'Test 5: metals are solid at room temperature…'],
  [T.hg, T.ox - 2.6, '…except mercury (Hg): a liquid metal'],
  [T.ox - 2.6, T.ox, 'A metal is solid (except mercury) ✓'],
  [T.ox, T.ox + 4.0, 'Way 2: burn a metal (sodium) in oxygen'],
  [T.ox + 4.0, T.wat, 'It burns brightly: a white oxide forms'],
  [T.wat, T.lit, 'Put the oxide in water: it dissolves'],
  [T.lit, T.lit + 4.6, 'Test the water with red litmus paper'],
  [T.lit + 4.6, T.dive - 2.6, 'It turns blue: the water is now alkaline'],
  [T.dive - 2.6, T.dive, 'A metal’s oxide is a base ✓'],
  [T.dive, T.atom + 1.0, 'Way 3: look inside the metal'],
  [T.atom + 1.0, T.rev, 'Sodium is made of atoms'],
  [T.rev, T.out, 'Sodium: 2, 8, 1 electrons'],
  [T.out, T.tug, 'Only 1 electron on the outside'],
  [T.tug, T.lose + 0.4, 'Sodium loses it easily'],
  [T.lose + 0.4, T.epos, '11 + and 10 −: now it is Na⁺'],
  [T.epos, T.ep2, 'A metal loses electrons and forms a cation'],
  [T.ep2, T.h, 'Metals give electrons away (electropositive)'],
  [T.h, T.hfree, 'The exception: hydrogen, a non-metal…'],
  [T.hfree, T.table - 2.6, '…also gives its electron: H⁺'],
  [T.table - 2.6, T.table, 'A metal loses electrons: a cation ✓'],
  [T.table, T.g1, 'Where are the metals in the periodic table?'],
  [T.g1, T.g2, 'Group 1: all metals, except hydrogen'],
  [T.g2, T.g3, 'Group 2: all metals'],
  [T.g3, T.g4, 'Group 3: all metals, except boron'],
  [T.g4, T.g5, 'Group 4: tin and lead are metals'],
  [T.g5, T.g68, 'Group 5: antimony and bismuth are metals'],
  [T.g68, T.d, 'Groups 6, 7 and 8: all non-metals'],
  [T.d, T.f, 'd-block elements: all metals'],
  [T.f, T.sum, 'Lanthanides and actinides: all metals'],
  [T.sum, T.end, 'Blue: metals. Green: non-metals'],
  [T.end, T.end + 4.0, 'Sodium loses its electron easily, so it burns'],
  [T.end + 4.0, T.card, 'Gold holds on to its electrons: it stays shiny'],
  [T.card, T.done, 'So: a metal is an element that loses electrons'],
];

// ---------------------------------------------------------------- camera: establish → close on the action → widen only for something new
const tableShot = (t, c, r, w, h) => S(t, [COL(c), TY(r), 0], w, h, [0, 0.1, 1]);
const cams = [
  S(0, [0, 0.15, 0.0], 3.7, 1.2), S(T.na - 0.3, [0, 0.15, 0.0], 3.6, 1.15),
  S(T.na + 0.8, [NAX, 0.2, 0.05], 1.15, 0.75), S(T.fe - 0.2, [NAX, 0.2, 0.05], 1.0, 0.68),
  S(T.fe + 0.9, [FEX, 0.14, 0.05], 1.1, 0.68), S(T.au - 0.2, [FEX, 0.14, 0.05], 1.0, 0.62),
  S(T.au + 0.9, [AUX, 0.14, 0.05], 1.1, 0.66), S(T.why - 0.2, [AUX, 0.14, 0.05], 1.02, 0.62),
  S(T.why + 1.2, [0, 0.2, -0.05], 3.75, 1.3), S(T.elec - 0.2, [0, 0.2, -0.05], 3.5, 1.2),
  // test 1 — the circuit (steady, slow push to the gap when the strip goes in)
  S(T.elec, [CX, 0.42, 0.05], 2.5, 1.2), S(T.strip, [CX, 0.4, 0.05], 2.35, 1.12), S(T.heat - 0.2, [CX, 0.4, 0.05], 2.2, 1.06),
  // test 2 — the rod
  S(T.heat + 0.9, [RX - 0.05, 0.5, 0.05], 1.7, 1.15), S(T.mall - 0.02, [RX - 0.05, 0.5, 0.05], 1.55, 1.05),
  // test 3 / 4
  S(T.mall, [AX + 0.15, 0.5, 0.05], 1.5, 1.2), S(T.duct - 0.4, [AX + 0.1, 0.46, 0.05], 1.35, 1.1),
  S(T.duct + 0.6, [DX - 0.4, 0.15, 0.05], 1.2, 0.62), S(T.duct + 2.4, [DX - 0.38, 0.15, 0.05], 1.15, 0.6),
  S(T.duct + 6.4, [DX + 0.15, 0.17, 0.05], 1.95, 0.8), S(T.solid - 0.02, [DX + 0.15, 0.17, 0.05], 1.85, 0.76),
  // solid · mercury
  S(T.solid, [IX(1.5), 0.15, 0.05], 2.0, 0.9), S(T.hg - 0.3, [IX(1.5) + 0.05, 0.15, 0.05], 1.9, 0.86),
  S(T.hg + 0.8, [HGX, 0.3, 0.05], 1.05, 0.8), S(T.ox - 0.02, [HGX, 0.2, 0.05], 0.92, 0.64),
  // test 5 — jar → follow the spoon to the water → close on the litmus
  S(T.ox, [JX, 0.5, 0.05], 1.5, 1.1), S(T.ox + 3.0, [JX, 0.45, 0.05], 1.3, 0.98), S(T.wat - 0.2, [JX, 0.42, 0.05], 1.25, 0.94),
  S(T.wat + 1.4, [(JX + BX) / 2, 0.5, 0.05], 2.5, 1.2), S(T.wat + 3.0, [BX, 0.42, 0.05], 1.3, 1.0), S(T.dive - 0.2, [BX, 0.4, 0.05], 1.22, 0.94),
  // the dive: to the oil jar, then speed up INTO the sodium until metal fills the screen … cut on the motion
  S(T.dive + 1.4, [VXo, 0.32, 0.3], 1.0, 0.85, [0, 0.3, 1]),
  [T.atom - 0.04, [LUMP.x, LUMP.y + 0.02, LUMP.z + 0.135], LUMP.toArray(), undefined, 'in'],
  [T.atom, [AT.x, AT.y + 0.5, 15], AT.toArray()], [T.rev, [AT.x, AT.y + 0.2, 5.6], AT.toArray(), undefined, 'out'],
  S(T.out, [AT.x, AT.y + 0.05, 0], 2.8, 2.6, [0, 0.05, 1]),
  S(T.tug, [AT.x + 0.3, AT.y, 0], 3.5, 2.7, [0, 0.05, 1]), S(T.h - 0.7, [AT.x + 0.2, AT.y - 0.05, 0], 3.7, 2.8, [0, 0.05, 1]),
  S(T.h + 0.9, [HX, AT.y + 0.1, 0], 2.4, 2.0, [0, 0.05, 1]), S(T.table - 0.02, [HX, AT.y + 0.1, 0], 2.3, 1.92, [0, 0.05, 1]),
  // the Tidbit: whole table → left columns → right columns → d-block → f rows → whole table
  tableShot(T.table, 9.5, 4.9, 9.6, 5.2), tableShot(T.g1 - 0.6, 9.5, 4.9, 9.4, 5.1),
  tableShot(T.g1 + 0.4, 3.4, 3.7, 3.9, 4.3), tableShot(T.g3 - 0.6, 3.4, 3.7, 3.8, 4.2),
  tableShot(T.g3 + 0.4, 15.2, 3.6, 4.2, 4.4), tableShot(T.d - 0.6, 15.2, 3.6, 4.1, 4.3),
  tableShot(T.d + 0.4, 7.5, 5.4, 5.8, 2.7), tableShot(T.f - 0.6, 7.5, 5.4, 5.6, 2.6),
  tableShot(T.f + 0.4, 10.5, 8.5, 7.8, 1.9), tableShot(T.sum - 0.6, 10.5, 8.5, 7.6, 1.85),
  tableShot(T.sum + 0.6, 7.2, 4.9, 11.6, 5.8), tableShot(T.end - 0.02, 7.2, 4.9, 11.4, 5.7),
  // END — the opening picture again, then closer to sodium, then to gold
  S(T.end, [0, 0.2, -0.05], 3.35, 1.2), S(T.end + 3.4, [NAX + 0.05, 0.22, -0.1], 1.5, 0.9), S(T.end + 4.6, [AUX, 0.24, -0.1], 1.5, 0.9), S(T.done, [AUX, 0.24, -0.1], 1.4, 0.84),
];

export default {
  capNear: true, oneText: true,
  duration: T.done,
  captions,
  cams,

  build({ scene, cam, R }) {
    const beats = [], fires = [];
    const ST = K.studio({ scene, R }, '801', { dark: (t) => t >= T.atom - 0.01 && t < T.end - 0.05 });   // FIRST: models read the look
    const floor = scene.getObjectByName('floor');
    beats.push((t) => { ST.update(t); if (t >= T.atom - 0.01 && t < T.end - 0.05) { floor.visible = false; scene.fog = null; } });
    let root = scene;                                                  // each station lives in its own group, shown only in its own time
    const add = (o, x = 0, y = 0, z = 0) => { o.position.set(x, y, z); root.add(o); return o; };
    const stage = (show) => { root = new THREE.Group(); scene.add(root); const g = root; beats.push((t) => { g.visible = show(t); }); return g; };
    const lbl = (text, h, color, x, y, z, w = 600) => add(K.label(text, h, color, w), x, y, z);
    // bench labels keep ONE size on screen in wide and close shots (h 0.1 ≈ 4.5 % of the picture height)
    const tags = [], tag = (text, h, color, x, y, z, w = 700) => { const l = lbl(text, 0.1, color, x, y, z, w); l.userData.frac = h * 0.9; tags.push(l); return l; };
    const fire = (tint, size, opts) => { const f = K.makeFire(tint, size, opts); fires.push(f); return f; };
    const shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
    const silver = new THREE.Color(0xe6eaf0), white = new THREE.Color(0xf7f6f1), dullC = new THREE.Color(0xa9a59a);
    // polished metal that mirrors the bright studio (plain metal goes black: scene.environment is dimmed to the bake's ENV)
    const shinyMetal = (c, r = 0.25) => { const m = new THREE.MeshPhysicalMaterial({ color: c, metalness: 1, roughness: r, envMapIntensity: ST.on ? 1.6 : 1 }); if (ST.on) K.photoEnv('bake/studio.hdr').then((tx) => { m.envMap = tx; m.needsUpdate = true; }); return m; };
    const twinkle = (at, k, size = 0.1, on = () => true) => { const s = add(K.sparkle(0xffffff, size)); s.position.copy(at); beats.push((t) => { const a = Math.max(0, Math.sin(t * 1.3 + k * 2.1)) ** 10; s.visible = on(t) && a > 0.02; s.scale.setScalar(size * a + 1e-4); s.material.rotation = t * 0.4; }); return s; };
    /** a thing that moves on the baked table gets its own soft contact shadow */
    const blob = (r, x, z) => add(K.contactShadow(r), x, 0.004, z);
    /** sodium: tarnishes (dull grey), then glows, catches fire, burns to a white crust */
    const burnNa = (piece, mat, t, I, end, tarnish = -1) => {
      const on = back(span(t, I, I + 0.35)) * (1 - ease(span(t, end, end + 0.6)));
      const crust = ease(span(t, I + 0.5, end)), dull = tarnish < 0 ? 0 : ease(span(t, tarnish, tarnish + 1.6));
      mat.color.copy(silver).lerp(dullC, dull).lerp(white, crust); mat.metalness = 0.9 * (1 - Math.max(crust, 0.7 * dull)); mat.roughness = lerp(0.16, 0.95, Math.max(crust, 0.8 * dull));
      mat.emissive.setHex(0xff6a1a); mat.emissiveIntensity = 0.9 * span(t, I - 0.6, I) * (1 - crust);
      const melt = ease(span(t, I - 0.6, I)); piece.scale.set(1 + 0.2 * melt + 0.3 * crust, 1 - 0.2 * melt + 0.15 * crust, 1 + 0.2 * melt + 0.3 * crust);
      return on;
    };
    /** tongs bring something down from above to `at` (arrive m0+1.2) and let go at m0+1.4, rise away by m0+2.4 */
    const carry = (tg, t, m0, at, keep = false) => {
      tg.visible = t > m0 && (keep || t < m0 + 2.4); if (!tg.visible) return;
      const top = at.clone().add(V(0, 1.1, 0));
      const p = t < m0 + 1.2 ? top.lerp(at, 1 - (1 - span(t, m0, m0 + 1.2)) ** 2) : keep || t < m0 + 1.5 ? at.clone() : at.clone().lerp(top, easeIn(span(t, m0 + 1.5, m0 + 2.4)));
      tg.position.copy(p); tg.userData.set(keep ? 0.03 : lerp(0.03, 0.08, span(t, m0 + 1.35, m0 + 1.5)));
    };

    // ================================================================ OPEN · three metals in air (also the end)
    {
      const g = stage((t) => t < T.elec || t >= T.end - 0.05); ST.bake(g, 'intro', 0, 3.8, 1.4);
      add(K.dish(0.17), NAX, 0, 0.05);
      const naM = M.metal(0xe6eaf0, 0.16), na = add(K.lump(0.06, naM, 3, 0.7), NAX, 0.052, 0.05);
      const fl = add(fire(0xffc21a, 0.3, { core: 0xfff3c4 }), NAX, 0.07, 0.05), sm = add(K.smoke(8, 0xf2f2f2), NAX, 0.2, 0.05); sm.scale.setScalar(0.18);
      const nl = add(K.nail(0.5, 0.017), FEX + 0.25, 0, 0.05); nl.rotation.z = Math.PI / 2 - 0.092;
      [0.06, 0.16, 0.27, 0.36, 0.43].forEach((u, i) => { const d = add(new THREE.Mesh(new THREE.SphereGeometry(0.012 + 0.005 * hash(i), 14, 10), M.bubble()), FEX + 0.25 - u * Math.cos(0.092), 0.017 + u * Math.sin(0.092) + 0.013, 0.05 + (hash(i, 3) - 0.5) * 0.012); d.scale.y = 0.7; });
      add(K.ring(0.1, 0.022), AUX - 0.3, 0, 0.08); add(K.ingot(shinyMetal(0xdcdee3), 0.26, 0.08, 0.13), AUX + 0.3, 0, 0.05);
      twinkle(V(AUX - 0.22, 0.05, 0.16), 0, 0.12, (t) => t < T.bridge + 1 || t > T.end); twinkle(V(AUX + 0.35, 0.085, 0.1), 1.3, 0.1, (t) => t < T.bridge + 1 || t > T.end);
      // in nature: rock salt (sodium only in compounds) behind sodium; a gold nugget in quartz behind gold — lowered in
      const saltM = new THREE.MeshPhysicalMaterial({ color: 0xf4f2ee, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.2, transmission: 0.2, thickness: 0.1 });
      const salt = add(new THREE.Group(), NAX, 0, -0.4); [[0, 0.075, 0, 0.15], [0.16, 0.045, 0.06, 0.09], [-0.15, 0.035, 0.07, 0.07]].forEach(([x, y, z, s], i) => { const c = K.solid(new THREE.BoxGeometry(s, s, s), saltM); c.position.set(x, y, z); c.rotation.y = 0.4 + i; salt.add(c); });
      const ore = add(new THREE.Group(), AUX, 0, -0.4); ore.add(K.rock(0.14, 0xe8e4dc, 0xb9b2a4, 5));
      [[0.06, 0.1, 0.09], [-0.05, 0.13, 0.07], [0.02, 0.16, 0.02], [-0.09, 0.07, 0.1]].forEach(([x, y, z], i) => { const n = K.lump(0.022, shinyMetal(0xf0bf4a, 0.3), i + 9, 0.8); n.position.set(x, y, z); ore.add(n); });
      const sS = blob(0.2, NAX, -0.4), sO = blob(0.24, AUX, -0.4);
      const nm = [tag('sodium', 0.1, '#ffffff', NAX, -0.04, 0.42), tag('iron nail', 0.1, '#ffffff', FEX, -0.04, 0.42),
        tag('gold', 0.1, '#ffe08a', AUX - 0.34, -0.04, 0.42), tag('platinum', 0.1, '#ffffff', AUX + 0.36, -0.04, 0.42)];
      const lShiny = tag('fresh and shiny', 0.1, '#ffffff', NAX, 0.3, 0.05), lDull = tag('dull in seconds', 0.1, '#d8d4cc', NAX, 0.3, 0.05);
      const res = [tag('catches fire!', 0.1, '#ffd27a', NAX, 0.42, 0.05), tag('rusts', 0.1, '#f0a070', FEX, 0.24, 0.05), tag('stays shiny', 0.1, '#fff2c0', AUX, 0.27, 0.05)];
      const lMoist = tag('water drops (moist air)', 0.09, '#cfe8ff', FEX, 0.14, 0.05);
      const days = ['day 1', 'day 2', 'day 3'].map((d) => tag(d, 0.12, '#ffffff', FEX, 0.34, 0.05)), dayAu = tag('day 3: still shiny', 0.1, '#fff2c0', AUX, 0.27, 0.05);
      const fd = [tag('only in compounds (salt)', 0.1, '#e6e2da', NAX, 0.42, -0.4), tag('found pure, as gold', 0.1, '#ffe8a0', AUX, 0.48, -0.4)];
      const endL = [tag('gives its electron easily', 0.1, '#ffd27a', NAX, 0.52, -0.1), tag('holds on to its electrons', 0.1, '#fff2c0', AUX, 0.6, -0.1)];
      const DT = [T.fe + 0.6, T.fe + 2.6, T.fe + 4.6];                  // the days pass
      beats.push((t) => {
        nm.forEach((l, i) => (t < T.why ? K.popIn(l, t, 0.5 + i * 0.35, T.na + 0.2) : K.popIn(l, t, T.why + 0.3 + i * 0.25, T.bridge + 0.6)));
        // sodium: fresh → dull in seconds → hot → on fire → white crust
        K.popIn(lShiny, t, T.na + 0.5, T.tarn + 0.4); K.popIn(lDull, t, T.tarn + 1.2, T.fire - 0.3);
        const on = burnNa(na, naM, t, T.fire, T.au - 1.0, T.tarn);
        fl.visible = on > 0.01; fl.scale.setScalar(Math.max(1e-4, on * (1 + 0.05 * Math.sin(t * 9))));
        sm.userData.update(t, on * 0.9); sm.visible = on > 0.01;
        // iron: day 1 → 2 → 3, the rust spreads a step each day
        nl.userData.rust(0.18 * ease(span(t, DT[0] + 0.4, DT[0] + 1.6)) + 0.2 * ease(span(t, DT[1] + 0.4, DT[1] + 1.6)) + 0.24 * ease(span(t, DT[2] + 0.4, DT[2] + 1.6)));
        K.popIn(lMoist, t, T.fe + 0.2, DT[0] + 1.6);
        days.forEach((l, i) => K.popIn(l, t, DT[i], i < 2 ? DT[i + 1] - 0.35 : T.au - 0.2));
        K.popIn(dayAu, t, T.au + 0.9, T.why);
        K.popIn(res[0], t, T.fire + 0.4, T.found); K.popIn(res[1], t, DT[2] + 1.8, T.found); K.popIn(res[2], t, T.why + 0.2, T.found);
        // nature's samples come down behind
        [[salt, sS, T.found + 0.3], [ore, sO, T.found + 2.6]].forEach(([o, sh, t0]) => { const d = K.drop(t, t0, 1.2, 0, 0.5, 0.01); o.position.y = d.y; o.visible = t > t0 && t < T.elec || t > T.end; if (t > T.end) o.position.y = 0; sh.userData.set(o.visible ? o.position.y : 9); });
        K.popIn(fd[0], t, T.found + 1.0, T.bridge + 1.6); K.popIn(fd[1], t, T.found + 3.3, T.bridge + 1.6);
        K.popIn(endL[0], t, T.end + 1.2, T.end + 4.2); K.popIn(endL[1], t, T.end + 4.6, 1e9);
      });
    }

    // ================================================================ test 1 electricity · test 2 heat
    {
      const g = stage((t) => t >= T.elec - 0.05 && t < T.mall); ST.bake(g, 'elec', SX.elec, 5.4, 1.5);
      // a bulb circuit with a GAP between two clips: the bulb stays off until a metal closes the gap
      for (const s of [-1, 1]) { add(K.solid(new THREE.BoxGeometry(0.12, 0.08, 0.12), M.matte(0x22252b, 0.6)), CX + s * 0.25, 0.04, 0); add(K.solid(new THREE.BoxGeometry(0.13, 0.03, 0.13), M.metal(0xb9bec6, 0.3)), CX + s * 0.25, 0.096, 0); }
      add(K.battery(), CX - 0.85, 0, -0.05);
      const inW = add(K.wire([[CX - 0.85, 0.87, -0.05], [CX - 0.8, 0.95, 0.0], [CX - 0.55, 0.42, 0.12], [CX - 0.4, 0.12, 0.06], [CX - 0.31, 0.1, 0]]));
      const outW = add(K.wire([[CX + 0.31, 0.1, 0], [CX + 0.48, 0.07, 0.05], [CX + 0.64, 0.06, 0.03], [CX + 0.72, 0.08, 0]]));
      const backW = add(K.wire([[CX + 0.86, 0.04, -0.09], [CX + 0.5, 0.024, -0.32], [CX - 0.5, 0.024, -0.32], [CX - 0.72, 0.024, -0.14]], 0x2b2f38));
      const lamp = add(K.bulb(), CX + 0.8, 0.0, 0);
      const stripC = new THREE.CatmullRomCurve3([V(CX - 0.3, 0.14, 0), V(CX + 0.3, 0.14, 0)]);
      const pI = add(K.pulses(inW.userData.curve, 5)), pO = add(K.pulses(outW.userData.curve, 3)), pS = add(K.pulses(stripC, 4)), pB = add(K.pulses(backW.userData.curve, 6));
      const cu = add(K.solid(new THREE.BoxGeometry(0.72, 0.022, 0.12), M.metal(0xc8763f, 0.28)), CX, 1.2, 0), sCu = blob(0.4, CX, 0);
      const tg = add(K.tongs(0.7));
      const lGap = tag('a gap', 0.1, '#ffffff', CX, 0.3, 0.1), lOff = tag('bulb off', 0.1, '#cfd6e2', CX + 0.8, 0.9, 0);
      const lCu = tag('copper (a metal)', 0.1, '#ffd9b8', CX, 0.3, 0.1), lLit = tag('bulb lights ✓', 0.1, '#ffe2a0', CX + 0.8, 0.95, 0);
      const lFlow = tag('current flows through the copper', 0.09, '#ffd27a', CX, 0.56, 0);
      const REST = 0.1225;
      beats.push((t) => {
        K.popIn(lGap, t, T.elec + 0.8, T.strip + 1.0); K.popIn(lOff, t, T.elec + 1.4, T.strip + 1.4);
        carry(tg, t, T.strip, V(CX, REST + 0.012, 0));
        cu.position.y = t < T.strip ? 1.3 : t < T.strip + 1.2 ? lerp(REST + 1.1, REST, 1 - (1 - span(t, T.strip, T.strip + 1.2)) ** 2) : K.drop(t, T.strip + 1.4, REST + 0.004, REST, 0.08, 0.004).y;
        cu.visible = t > T.strip; sCu.userData.set(cu.visible ? cu.position.y - REST : 9);
        const lit = ease(span(t, T.strip + 1.45, T.strip + 1.75)); lamp.userData.set(lit);
        [pI, pO, pS, pB].forEach((p) => p.userData.update(t, lit, lit > 0.01 ? 1 : 0));
        K.popIn(lCu, t, T.strip + 1.1, T.heat - 0.4); K.popIn(lLit, t, T.strip + 1.9, T.heat - 0.4); K.popIn(lFlow, t, T.strip + 2.8, T.heat - 0.4);
      });
      // test 2: a copper rod in a stand, wax beads stuck under it, the burner under the far end
      add(K.stand(0.72, 0.32), RX - 0.8, 0, 0);
      const heatTex = (() => { const c = document.createElement('canvas'); c.width = 4; c.height = 256; const x = c.getContext('2d'); const gr = x.createLinearGradient(0, 256, 0, 0); gr.addColorStop(0.44, '#000'); gr.addColorStop(0.56, '#fff'); x.fillStyle = gr; x.fillRect(0, 0, 4, 256); const tx = new THREE.CanvasTexture(c); tx.wrapT = THREE.ClampToEdgeWrapping; return tx; })();
      const rodM = new THREE.MeshStandardMaterial({ color: 0xc8763f, metalness: 0.9, roughness: 0.28, emissive: 0xff4a10, emissiveIntensity: 0, emissiveMap: heatTex });
      add(K.solid(new THREE.CylinderGeometry(0.02, 0.02, 1.0, 24).rotateZ(-Math.PI / 2), rodM), RX, 0.72, 0);
      const brn = add(K.burner(), RX + 0.38, 0, 0); brn.userData.flame.scale.setScalar(0.75); fires.push(brn.userData.flame);
      const wax = BEADX.map((x, i) => add(K.lump(0.028, M.matte(0xf3e9c8, 0.45), i + 5, 1.0, 0.25), x, 0.668, 0));
      const lRod = tag('copper rod', 0.1, '#f2c6a0', RX - 0.1, 0.86, 0), lWax = tag('wax beads stuck on it', 0.1, '#f3e9c8', RX - 0.07, 0.52, 0.2);
      const lHeat = tag('← heat', 0.1, '#ffb27a', 0, 0.86, 0), lYes = tag('copper carries heat ✓', 0.1, '#ffffff', RX, 0.95, 0);
      const lMelt = tag('melts and drops', 0.09, '#f3e9c8', 0, 0.5, 0.2);
      beats.push((t) => {
        K.popIn(lRod, t, T.heat + 0.4, T.hot + 0.5); K.popIn(lWax, t, T.heat + 1.0, T.hot + 1.6);
        const fOn = back(span(t, T.hot, T.hot + 0.4)); brn.userData.flame.scale.setScalar(Math.max(1e-4, 0.75 * fOn)); brn.userData.flame.visible = fOn > 0.01;
        const front = Math.min(1, HEAT(t));
        heatTex.offset.y = (0.06 + 0.94 * front) - 0.5; rodM.emissiveIntensity = 0.9 * span(t, T.hot + 0.3, T.hot + 1.0);
        wax.forEach((w, i) => {
          const m = MELT[i], sag = ease(span(t, m - 0.6, m));
          const d = K.drop(t, m, 0.668 - 0.014 * sag, 0.014, 0.33, 0), splat = ease(span(t, m + 0.33, m + 0.45));
          w.position.y = d.y; w.scale.set(1 + 0.7 * splat, Math.max(0.1, 1 + 0.4 * sag - 0.95 * splat), 1 + 0.7 * splat);
        });
        lHeat.position.x = ROD0 - front - 0.04; K.popIn(lHeat, t, T.hot + 1.0, MELT[3] + 0.4);
        lMelt.position.x = BEADX[0]; K.popIn(lMelt, t, MELT[0] - 0.3, MELT[1] - 0.4);
        K.popIn(lYes, t, MELT[3] + 0.8, T.mall - 0.3);
      });
    }

    // ================================================================ test 3 hammer (malleable) · test 4 pull (ductile)
    {
      const g = stage((t) => t >= T.mall - 0.05 && t < T.solid); ST.bake(g, 'shape', SX.shape, 4.8, 1.4);
      add(K.anvil(0.36), AX, 0, 0); const TOP = 0.36;
      const cuM = M.metal(0xc8763f, 0.3), lump = add(K.lump(0.075, cuM, 4, 0.8, 0.3), AX, TOP + 0.06, 0);
      const hm = add(K.hammer(0.62), 0, 0, 0.0), HL = 0.64;
      const lCu = tag('a copper ball', 0.1, '#f2c6a0', AX - 0.3, TOP + 0.22, 0.1), lMal = tag('a flat sheet: it doesn’t break ✓', 0.1, '#ffffff', AX, TOP + 0.3, 0.05);
      const flatK = (t) => HITS.reduce((a, h) => a + ease(span(t, h, h + 0.08)), 0) / 3;
      beats.push((t) => {
        const f = flatK(t), sy = 1 - 0.72 * f, sxz = 1 + 1.0 * f;
        lump.scale.set(sxz, sy, sxz * 0.9); lump.position.y = TOP + 0.06 * sy;
        // the hammer: comes in raised, three blows (anticipation up, fast down, small rebound), then lifts away
        const UP = Math.PI / 2 - 0.8; let a = UP, k = 0;
        for (const h of HITS) if (t > h - 0.95) k = h;
        if (k) {
          const up = ease(span(t, k - 0.95, k - 0.3)), down = easeIn(span(t, k - 0.3, k)), reb = t > k ? 0.12 * Math.sin(Math.PI * span(t, k, k + 0.25)) : 0;
          const prev = HITS.indexOf(k) ? Math.PI / 2 : UP;
          a = t < k - 0.3 ? lerp(prev, UP, up) : lerp(UP, Math.PI / 2, down) - reb;
          if (k === HITS[2] && t > k + 0.6) a = lerp(Math.PI / 2 - 0.12, Math.PI / 2 - 1.3, ease(span(t, k + 0.6, k + 1.5)));
        }
        const hitTop = TOP + 0.12 * (1 - 0.72 * flatK(Math.max(t, k || 0) + 0.1));
        hm.rotation.z = a; hm.position.set(AX + HL, hitTop + 0.18, 0);
        const enter = 1 - ease(span(t, T.mall + 0.8, T.mall + 1.4)), leave = ease(span(t, HITS[2] + 1.2, HITS[2] + 2.0));
        hm.position.y += 1.2 * enter + 1.5 * leave; hm.visible = t > T.mall + 0.8 && t < HITS[2] + 2.0;
        K.popIn(lCu, t, T.mall + 0.4, HITS[0] - 0.4); K.popIn(lMal, t, HITS[2] + 1.0, T.duct - 0.3);
      });
      // test 4: a short copper rod gripped by two clamps; the right clamp is pulled away: the rod stretches into a thin wire
      const L0 = 0.3, R0 = 0.035, XL = DX - 0.55;
      const vl = add(K.vise(), XL - 0.05, 0, 0), vr = add(K.vise(), XL + L0 + 0.05, 0, 0), sVr = blob(0.16, 0, 0);
      const rodM2 = shinyMetal(0xc8763f, 0.3), wire = add(K.solid(new THREE.CylinderGeometry(R0, R0, 1, 32).rotateZ(Math.PI / 2), rodM2), XL + L0 / 2, 0.12, 0);
      const lRod2 = tag('a short copper rod', 0.1, '#ffd9b8', XL + 0.15, 0.38, 0.05), lPull = tag('pull →', 0.11, '#ffffff', 0, 0.32, 0.05);
      const lDuc = tag('a long thin wire ✓', 0.1, '#ffffff', DX + 0.1, 0.32, 0.05);
      beats.push((t) => {
        const k = ease(span(t, T.duct + 2.4, T.duct + 6.4)), L = lerp(L0, 1.4, k), r = Math.sqrt(L0 / L);   // same copper, longer and thinner
        vr.position.x = XL + L + 0.05; sVr.position.x = vr.position.x; sVr.userData.set(0);
        wire.scale.set(L, r, r); wire.position.x = XL + L / 2;
        K.popIn(lRod2, t, T.duct + 0.5, T.duct + 2.6); lPull.position.x = vr.position.x + 0.05; K.popIn(lPull, t, T.duct + 2.2, T.duct + 5.6);
        K.popIn(lDuc, t, T.duct + 6.6, T.solid - 0.3);
        void vl;
      });
    }

    // ================================================================ solid metals · mercury, a liquid
    {
      const g = stage((t) => t >= T.solid - 0.05 && t < T.ox); ST.bake(g, 'state', SX.state, 3.4, 1.3);
      const bars = [[0x7d838b, 'iron', '#e6ebf2'], [0xc8763f, 'copper', '#f2c6a0'], [0xd5d9de, 'aluminium', '#ffffff'], [0xf0bf4a, 'gold', '#ffe08a']];
      bars.forEach(([c], i) => add(K.ingot(shinyMetal(c), 0.3, 0.09, 0.15), IX(i), 0, 0.05));
      const names = bars.map(([, n, col], i) => tag(n, 0.1, col === '#f2c6a0' ? '#ffd9b8' : col, IX(i), 0.17, 0.05));
      const lSolid = tag('all solid', 0.12, '#ffffff', IX(1.5), 0.36, 0.05);
      const tilt = add(new THREE.Group(), HGX, 0, 0.05); tilt.add(K.watchGlass(0.22));
      const hgM = shinyMetal(0xe3e6ea, 0.05);
      const pool = K.lump(0.07, hgM, 1, 0.42, 0.04); tilt.add(pool);
      const beads = [[0.12, 0.05, 0.022], [-0.1, 0.07, 0.018], [0.03, -0.12, 0.016]].map(([x, z, r], i) => { const b = K.lump(r, hgM, i + 2, 0.7, 0.05); tilt.add(b); b.userData.at = [x, z, r]; return b; });
      const dp = add(K.dropper(0.34), HGX + 0.02, 0.5, 0.05);
      const drop = add(K.solid(new THREE.SphereGeometry(0.026, 24, 16), hgM, { outline: false }), HGX + 0.02, 0.47, 0.05);
      const lHg = tag('mercury (Hg): a metal', 0.1, '#ffffff', HGX - 0.2, 0.62, 0.05), lLiq = tag('a liquid: it splashes and runs', 0.1, '#ffffff', HGX, 0.36, 0.05);
      beats.push((t) => {
        names.forEach((l, i) => K.popIn(l, t, T.solid + 0.4 + i * 0.5, T.hg - 0.2));
        K.popIn(lSolid, t, T.solid + 2.6, T.hg - 0.2);
        const L = T.hg + 2.15, grow = ease(span(t, T.hg + 1.0, T.hg + 1.7));
        const d = K.drop(t, T.hg + 1.85, 0.47 - 0.026 * grow, 0.03, 0.3, 0);
        drop.visible = t > T.hg + 0.95 && !d.landed; drop.scale.setScalar(Math.max(1e-4, grow)); drop.position.y = d.y - (1 - grow) * 0.01;
        const k = Math.max(0, t - L), wob = t > L ? Math.exp(-k * 3.2) * Math.sin(k * 20) : 0;
        pool.visible = t > L; pool.scale.set(1 + 0.25 * wob, Math.max(0.2, 1 - 0.35 * wob), 1 + 0.25 * wob); pool.position.y = 0.006 + 0.0294 * pool.scale.y;
        const tl = 0.12 * Math.sin(Math.PI * 2 * span(t, T.hg + 4.0, T.hg + 6.4)); tilt.rotation.z = tl;   // tip the glass: the liquid runs to the low side and back
        pool.position.x = -0.5 * tl;
        beads.forEach((b, i) => {
          const [x, z, r] = b.userData.at, out = ease(span(t, L, L + 0.35));
          b.visible = t > L; const bw = Math.exp(-k * 4) * Math.sin(k * 26 + i);
          b.position.set(x * out - (0.8 + 0.3 * i) * tl, 0.006 + r * 0.7, z * out); b.scale.set(1 + 0.2 * bw, 1 - 0.25 * bw, 1 + 0.2 * bw);
        });
        dp.position.y = 0.5 + 1.2 * (1 - ease(span(t, T.hg + 0.1, T.hg + 0.9))) + 1.3 * ease(span(t, T.hg + 2.5, T.hg + 3.4)); dp.visible = t > T.hg + 0.1 && t < T.hg + 3.4;
        K.popIn(lHg, t, T.hg + 0.7, T.hg + 2.6); K.popIn(lLiq, t, T.hg + 2.9, T.ox - 0.2);
      });
    }

    // ================================================================ test 5 basic oxide: burn in oxygen → water → red litmus
    {
      const g = stage((t) => t >= T.ox - 0.05 && t < T.atom); ST.bake(g, 'ox', SX.ox, 4.0, 1.4);
      const vl = add(new THREE.Group(), VXo, 0, 0.3); vl.add(K.vial());
      const oil = K.liquid(0.14, 0.4, 0xd9a84a, 0.32); oil.position.y = 0.03; vl.add(oil);
      [[0.0, 0.1, 0], [0.05, 0.16, -0.04]].forEach(([x, y, z], i) => { const m = K.lump(i ? 0.06 : 0.085, M.metal(0xc9ccd1, 0.22), i * 3.1 + 1); m.position.set(x, y, z); vl.add(m); });
      const jar = add(K.gasJar(0xeaf4ff, 0.17, 0.7), JX, 0, 0); const gas = jar.userData.gas; gas.opacity = 0.05;
      add(K.beaker(0.26, 0.55), BX, 0, 0); add(K.liquid(0.25, 0.38, 0x5aa0d8, 0.38), BX, 0.055, 0);
      // red litmus paper: a straight strip, brought in by tongs and dipped into the water
      const paper = add(K.paperStrip([[0, 0], [0.2, 0], [0.42, 0]], 0.06, 0xd9606c, 0x4a6fd0, 0.006)), ptg = add(K.tongs(0.6));
      const sp = add(K.spoon(0.6)), naM = M.metal(0xe6eaf0, 0.16), na = K.lump(0.045, naM, 7, 0.7); na.position.y = -0.03; sp.add(na);
      const fl = add(fire(0xffc21a, 0.34, { core: 0xfff3c4 })), sm = add(K.smoke(6, 0xffffff)); sm.scale.setScalar(0.08);
      const lid = jar.userData.lid, lid0 = lid.position.clone();
      const lNa = tag('sodium', 0.1, '#ffffff', 0, 0, 0), lO2 = tag('oxygen gas (O₂)', 0.1, '#cfe8ff', JX, 0.86, 0.05);
      const lOx = tag('sodium oxide (white)', 0.1, '#ffffff', 0, 0, 0), lWater = tag('water', 0.1, '#bfe0ff', BX - 0.12, 0.3, 0.35);
      const lDis = tag('it dissolves', 0.1, '#ffffff', BX - 0.05, 0.55, 0.1);
      const lRed = tag('red litmus paper', 0.1, '#ff9aa4', BX - 0.3, 0.72, 0), lBlue = tag('turns blue ✓', 0.11, '#9ec0ff', BX - 0.45, 0.72, 0);
      const lBase = tag('alkaline: a base', 0.1, '#ffffff', BX, -0.04, 0.45), lOil = tag('sodium, kept in oil', 0.1, '#ffffff', VXo, 0.85, 0.3);
      const IN = V(JX, 0.36, 0), UP = V(JX, 1.0, 0), OVER = V(BX - 0.08, 1.0, 0), WET = V(BX - 0.08, 0.24, 0);
      const I = T.ox + 2.8, OUT = T.ox + 6.6, W0 = T.wat, P0 = T.lit, PAT = V(BX + 0.1, 0.12, 0);
      beats.push((t) => {
        const lu = ease(span(t, T.ox + 0.9, T.ox + 1.5)); lid.position.set(lid0.x + 0.42 * lu, lid0.y - (lid0.y - 0.006) * easeIn(span(t, T.ox + 1.2, T.ox + 1.5)), lid0.z);
        let p;
        if (t < I) p = V(JX, lerp(1.5, IN.y, ease(span(t, T.ox + 1.4, I))), 0);
        else if (t < W0) p = IN.clone();
        else if (t < W0 + 0.8) p = IN.clone().lerp(UP, ease(span(t, W0, W0 + 0.8)));
        else if (t < W0 + 1.8) p = K.arc(UP, OVER, 0.12, ease(span(t, W0 + 0.8, W0 + 1.8)));
        else if (t < W0 + 4.2) p = OVER.clone().lerp(WET, ease(span(t, W0 + 1.8, W0 + 2.6)));
        else p = WET.clone().lerp(V(WET.x, 1.6, 0), easeIn(span(t, W0 + 4.2, W0 + 5.2)));
        sp.position.copy(p); sp.visible = t > T.ox + 1.3 && t < W0 + 5.2;
        const small = ease(span(t, T.ox + 1.6, T.ox + 2.1)) * (1 - span(t, I - 0.2, I));
        const big = burnNa(na, naM, t, I, OUT);
        const on = Math.max(0.35 * small, big * (1 + 0.15 * Math.sin(t * 17) + 0.08 * Math.sin(t * 29)));
        fl.visible = on > 0.01 && t < OUT + 0.7; fl.position.copy(p).add(V(0, -0.01, 0)); fl.scale.setScalar(Math.max(1e-4, on));
        if (t < I) { naM.emissive.setHex(0xff6a1a); naM.emissiveIntensity = 0.6 * small; }
        gas.color.set(0xeaf4ff).lerp(white, span(t, I, OUT)); gas.opacity = 0.05 + 0.2 * ease(span(t, I + 0.3, OUT)) * (1 - 0.7 * ease(span(t, W0, W0 + 3)));
        sm.visible = t > I && t < OUT + 1; sm.position.copy(p).add(V(0, 0.02, 0)); sm.userData.update(t, big);
        const dis = ease(span(t, W0 + 2.6, W0 + 4.2));
        if (t > W0 + 2.6) { na.position.set(0.04 * dis, -0.03 - 0.12 * dis, 0); na.scale.multiplyScalar(Math.max(1e-4, 1 - dis)); } else na.position.set(0, -0.03, 0);
        na.visible = dis < 0.99;
        // the litmus test: tongs bring the red paper down into the water; the blue soaks up from the bottom
        const top = PAT.clone().add(V(0, 0.42, 0)), pTop = V(top.x, top.y + 1.0, 0);
        const pp = t < P0 + 1.4 ? pTop.clone().lerp(top, 1 - (1 - span(t, P0, P0 + 1.4)) ** 2) : top;
        paper.position.copy(pp).add(V(0, -0.42, 0)); paper.visible = t > P0;
        ptg.position.copy(pp).add(V(0, -0.02, 0)); ptg.visible = t > P0; ptg.userData.set(0.012);
        paper.userData.wet(0.36 * ease(span(t, P0 + 1.9, P0 + 4.2)));
        lNa.position.copy(p).add(V(-0.22, 0.12, 0.1)); K.popIn(lNa, t, T.ox + 1.8, I + 0.6);
        K.popIn(lO2, t, T.ox + 0.4, OUT - 0.3);
        lOx.position.set(JX + 0.05, 0.86, 0.05); K.popIn(lOx, t, OUT + 0.3, W0 + 0.7);
        K.popIn(lWater, t, W0 + 1.6, W0 + 4.4); K.popIn(lDis, t, W0 + 3.0, P0 + 0.2);
        K.popIn(lRed, t, P0 + 0.5, P0 + 3.6); K.popIn(lBlue, t, P0 + 3.9, T.dive - 0.3);
        K.popIn(lBase, t, P0 + 5.0, T.dive - 0.3); K.popIn(lOil, t, T.dive + 0.3, T.atom - 0.8);
      });
    }

    // ================================================================ inside sodium (dark studio): 2, 8, 1 → Na⁺; then hydrogen → H⁺
    {
      root = scene;
      const PIT = 3.3, wall = [];
      for (let i = -4; i <= 4; i++) for (let j = -3; j <= 3; j++) for (let k = 0; k <= 1; k++) if (i || j) wall.push(V(AT.x + i * PIT + (j % 2) * PIT / 2 * k, AT.y + j * PIT, -k * PIT));
      const atomMat = M.gloss(0xb5b2a6);                                 // the warm grey of the sodium seen through its oil
      const wallM = new THREE.InstancedMesh(new THREE.SphereGeometry(1.5, 40, 24), atomMat, wall.length); add(wallM);
      const me = add(new THREE.Mesh(new THREE.SphereGeometry(1.5, 48, 32), atomMat.clone()), AT.x, AT.y, AT.z); me.material.transparent = true; me.material.depthWrite = false;
      const lAtoms = lbl('sodium atoms', 0.42, '#ffffff', AT.x, AT.y + 0.85, 4.5, 700);
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion();
      const A = K.atom([2, 8, 1], 11, 12, 0.45, 0.3); add(A.group, AT.x, AT.y, AT.z);
      const outer = A.electrons.find((e) => e.shell === 2), gold = M.glow(0xffc04d, 2.8);
      outer.e.material = gold; outer.e.children[0].material = outer.e.children[0].material.clone(); outer.e.children[0].material.color.set(0xffc04d);
      const nameNa = lbl('Na', 0.28, '#ffffff', AT.x, AT.y + 1.2, 0, 700), naPlus = lbl('Na⁺', 0.3, '#ffffff', AT.x, AT.y + 1.2, 0, 700);
      const counts = ['2', '8', '1'].map((s) => lbl(s, 0.24, s === '1' ? '#ffd27a' : '#a8ccff', 0, 0, 0, 700));
      const lP = lbl('11 protons (+)', 0.2, '#ffb0a0', AT.x - 1.05, AT.y + 0.95, 0.5), lE = lbl('10 electrons (−)', 0.2, '#a8ccff', AT.x, AT.y - 1.0, 0.6);
      const lCat = lbl('a cation (+ ion)', 0.22, '#f6d48f', AT.x - 0.85, AT.y - 0.5, 0.6, 700), lEp = lbl('gives electrons away: electropositive', 0.2, '#ffd27a', AT.x + 0.4, AT.y - 1.0, 0.6);
      const lFree = lbl('lost electron', 0.2, '#ffd27a', 0, 0, 0);
      const tie = add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(0, 0, 0), V(1, 0, 0)]), new THREE.LineBasicMaterial({ color: 0xffc04d, transparent: true, opacity: 0, toneMapped: false })));
      // hydrogen: one proton, one electron (the exception)
      const H = K.atom([1], 1, 0, 0.55, 0.3); add(H.group, HX, AT.y, 0); H.group.children[0].scale.setScalar(2.2);   // one proton, big enough to see
      const hE = H.electrons[0]; hE.e.material = gold; hE.e.children[0].material = outer.e.children[0].material;
      const nameH = lbl('hydrogen (H): a non-metal', 0.18, '#bff0c8', HX, AT.y + 0.85, 0, 700), hPlus = lbl('H⁺', 0.24, '#ffffff', HX + 0.2, AT.y + 0.35, 0, 700);
      const lHgive = lbl('gives its electron, like a metal', 0.17, '#ffd27a', HX, AT.y - 0.72, 0.4);
      beats.push((t) => {
        const wallOn = t > T.atom - 0.01 && t < T.rev + 1.6, gone = ease(span(t, T.rev - 0.6, T.rev + 1.4));
        wallM.visible = wallOn;
        if (wallOn) { wall.forEach((p, i) => { const d = p.clone().sub(AT), s = Math.max(1e-4, 1 - gone); m4.compose(AT.clone().addScaledVector(d, 1 + 0.6 * gone), q, V(s, s, s)); wallM.setMatrixAt(i, m4); }); wallM.instanceMatrix.needsUpdate = true; }
        const melt = span(t, T.rev - 1.8, T.rev - 0.3);
        me.visible = t > T.atom - 0.01 && melt < 1; me.material.opacity = 1 - melt; me.scale.setScalar(1 + 0.15 * melt);
        K.popIn(lAtoms, t, T.atom + 0.7, T.rev - 1.4);
        const inAtom = t > T.atom - 0.01 && t < T.table;
        A.group.visible = inAtom && t > T.rev - 1.8; A.update(t); A.group.rotation.y = 0.15 * Math.sin(t * 0.2);
        K.popIn(nameNa, t, T.rev + 0.3, T.lose + 0.3);
        A.group.updateMatrixWorld(true);
        counts.forEach((l, s) => { const a = [2.2, 3.5][s], Rr = [0.45, 0.75][s]; if (s < 2) l.position.copy(A.rings[s].localToWorld(V(Math.cos(a) * Rr, 0, Math.sin(a) * Rr))).add(V(-0.1, 0.12, 0.3)); else l.position.copy(outer.e.getWorldPosition(V(0, 0, 0))).add(V(0.02, 0.2, 0.2)); K.popIn(l, t, T.rev + 0.4 + s * 0.6, s === 2 ? T.tug : T.lose); });
        // the outer electron: pulled further out, breaks free and drifts away (the 803 detach the user praised)
        const pull = ease(span(t, T.tug + 0.3, T.lose)), freeK = span(t, T.lose, T.lose + 0.6);
        outer.free = t > T.tug + 0.3;
        if (outer.free) {
          const a = outer.a0 + (T.tug + 0.3) * outer.w + 0.2 * pull, Rr = outer.R * (1 + 0.25 * pull + 0.25 * ease(freeK)) + 2.2 * easeIn(span(t, T.lose + 0.6, T.epos));
          outer.e.position.set(Math.cos(a) * Rr, 0.05 * Math.sin(t * 3), Math.sin(a) * Rr);
        }
        outer.e.scale.setScalar(1 + 0.5 * Math.sin(Math.PI * span(t, T.out, T.out + 0.8)));
        const ew = outer.e.getWorldPosition(V(0, 0, 0)), nw = A.group.getWorldPosition(V(0, 0, 0));
        outer.e.visible = t < T.epos;
        tie.geometry.setFromPoints([nw, ew]); tie.visible = inAtom && t < T.lose + 0.2; tie.material.opacity = 0.8 * span(t, T.tug, T.tug + 0.3) * (1 - span(t, T.lose - 0.15, T.lose));
        A.rings[2].children[0].material.opacity = 0.55 * (1 - span(t, T.lose, T.lose + 0.8));
        lFree.position.copy(ew).add(V(0, 0.28, 0)); K.popIn(lFree, t, T.lose + 0.5, T.epos - 0.6);
        K.popIn(naPlus, t, T.lose + 0.6, T.table); K.popIn(lP, t, T.lose + 0.7, T.ep2 + 0.2); K.popIn(lE, t, T.lose + 1.1, T.ep2 + 0.2);
        K.popIn(lCat, t, T.epos + 0.3, T.h - 0.8); K.popIn(lEp, t, T.ep2 + 0.5, T.h - 0.8);
        // hydrogen gives its single electron: only the proton is left
        H.group.visible = inAtom && t > T.ep2; H.update(t);
        H.group.scale.setScalar(Math.max(1e-4, back(span(t, T.ep2 + 1.4, T.ep2 + 1.9))));
        const hp = ease(span(t, T.hfree - 1.2, T.hfree)), hf = easeIn(span(t, T.hfree, T.hfree + 1.6));
        hE.free = t > T.hfree - 1.2;
        if (hE.free) { const a = hE.a0 + (T.hfree - 1.2) * hE.w + 0.3 * hp, Rr = hE.R * (1 + 0.3 * hp) + 2.4 * hf; hE.e.position.set(Math.cos(a) * Rr, 0, Math.sin(a) * Rr); }
        hE.e.visible = t < T.hfree + 1.6;
        H.rings[0].children[0].material.opacity = 0.55 * (1 - span(t, T.hfree, T.hfree + 0.8));
        K.popIn(nameH, t, T.h + 0.4, T.table); K.popIn(hPlus, t, T.hfree + 0.9, T.table); K.popIn(lHgive, t, T.hfree + 1.5, T.table);
      });
    }

    // ================================================================ Scientific Tidbit: the periodic table, rule by rule
    {
      root = scene;
      const grey = new THREE.Color(0x4a4f58), MET = new THREE.Color(0x3a64b8), NON = new THREE.Color(0x2e8a57);
      const named = { 1: 'H', 5: 'B', 50: 'Sn', 82: 'Pb', 51: 'Sb', 83: 'Bi' };
      const els = [];
      for (let z = 1; z <= 118; z++) {
        const [r, c] = place(z);
        const f = r >= 8, d = !f && c >= 3 && c <= 12;
        let t0, metal;
        if (f) { t0 = T.f; metal = true; }
        else if (d) { t0 = T.d; metal = true; }
        else if (c === 1) { t0 = T.g1; metal = z !== 1; }
        else if (c === 2) { t0 = T.g2; metal = true; }
        else if (c === 13) { t0 = T.g3; metal = z !== 5; }
        else if (c === 14) { t0 = T.g4; metal = z === 50 || z === 82; }
        else if (c === 15) { t0 = T.g5; metal = z === 51 || z === 83; }
        else { t0 = T.g68; metal = false; }
        els.push({ z, r, c, t0: t0 + 0.4 + (f ? (c - 4) * 0.05 + (r - 8) * 0.3 : d ? (c - 3) * 0.06 + (r - 4) * 0.1 : (r - 1) * 0.12 + (c >= 16 ? (c - 16) * 0.35 : 0)), to: metal ? MET : NON });
      }
      const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(0.44, 0.44, 0.08), M.gloss(0xffffff), els.length); add(inst);
      const tiles = {};
      Object.entries(named).forEach(([z, s]) => { const [r, c] = place(+z); tiles[z] = add(K.tile(s, 0x4a4f58, 0.44, 0.44, 0.1), COL(c), TY(r), 0); });
      const cc = new THREE.Color(), m4 = new THREE.Matrix4(), q = new THREE.Quaternion();
      const built = (t, r, c) => back(span(t, T.table + 0.1 + (c - 1) * 0.07 + Math.min(r, 7) * 0.04, T.table + 0.45 + (c - 1) * 0.07 + Math.min(r, 7) * 0.04));
      // the key, and the book's group names over the columns
      // the colour key rides with the camera (left, under the checklist panel), so no shot cuts it at an edge
      if (!cam.parent) scene.add(cam);
      const key = new THREE.Group(); cam.add(key);
      const sq = (c) => new THREE.Mesh(new THREE.PlaneGeometry(0.032, 0.032), new THREE.MeshBasicMaterial({ color: c, toneMapped: false, depthTest: false }));
      const kM = sq(0x3a64b8), kN = sq(0x2e8a57); kM.renderOrder = kN.renderOrder = 30;
      const lM = K.label('metal', 0.034, '#9ec0ff', 700), lN = K.label('non-metal', 0.034, '#8fe0b0', 700);
      kM.position.set(0, 0, 0); kN.position.set(0, -0.05, 0); lM.position.set(0.026 + lM.scale.x / 2, 0, 0); lN.position.set(0.026 + lN.scale.x / 2, -0.05, 0);
      key.add(kM, kN, lM, lN); [lM, lN].forEach((l) => { l.renderOrder = 30; });
      const head = (s, c, top, t0, y = 0) => ({ l: lbl(s, 0.22, '#f6d48f', COL(c), TY(top) + 0.42 + y, 0, 700), t0 });
      const heads = [head('group 1', 1, 1, T.g1, 0.05), head('group 2', 2, 1, T.g2, 0.33), head('group 3', 13, 2, T.g3, 0.3), head('group 4', 14, 2, T.g4, 0),
        head('group 5', 15, 2, T.g5, 0.3), head('groups 6, 7, 8', 17, 1, T.g68, 0.35)];
      const lD = lbl('d-block', 0.3, '#f6d48f', COL(7.5), TY(4) + 0.5, 0, 700), lF = [lbl('lanthanides', 0.24, '#f6d48f', COL(2.2), TY(8), 0, 700), lbl('actinides', 0.24, '#f6d48f', COL(2.2), TY(9), 0, 700)];
      const exc = { 1: lbl('H: non-metal', 0.22, '#8fe0b0', COL(1) + 0.95, TY(1), 0.1, 700), 5: lbl('B: non-metal', 0.22, '#8fe0b0', COL(13) - 0.95, TY(2), 0.1, 700) };
      beats.push((t) => {
        const on = t > T.table - 0.05 && t < T.end - 0.05; inst.visible = on;
        els.forEach((e, i) => {
          const s = Math.max(1e-4, built(t, e.r, e.c)), k = ease(span(t, e.t0, e.t0 + 0.45)), pop = 0.12 * Math.sin(Math.PI * k);
          const hide = named[e.z] ? 1e-4 : s;
          m4.compose(V(COL(e.c), TY(e.r), pop), q, V(hide, hide, hide)); inst.setMatrixAt(i, m4);
          inst.setColorAt(i, cc.copy(grey).lerp(e.to, k));
          if (named[e.z]) { const tl = tiles[e.z]; tl.visible = on; tl.scale.setScalar(s); tl.position.z = pop; tl.userData.body.material.color.copy(grey).lerp(e.to, k); }
        });
        inst.instanceMatrix.needsUpdate = true; inst.instanceColor.needsUpdate = true;
        const asp = cam.aspect, hh = Math.tan(cam.fov * Math.PI / 360);     // the key: 1 unit in front of the camera, top left (title-safe)
        key.position.set(-hh * asp + 0.07 * hh, -hh * 0.5, -1);   // under the docked checklist key.visible = on;
        const kOn = back(span(t, T.g1 - 0.6, T.g1 - 0.1)) * (1 - ease(span(t, T.end - 0.4, T.end - 0.1)));   // in the left margin: never on the tiles
        key.scale.setScalar(Math.max(1e-4, kOn));
        heads.forEach(({ l, t0 }) => K.popIn(l, t, t0 + 0.05, T.end - 0.05));
        K.popIn(lD, t, T.d + 0.05, T.end - 0.05); lF.forEach((l, i) => K.popIn(l, t, T.f + 0.05 + i * 0.3, T.end - 0.05));
        K.popIn(exc[1], t, T.g1 + 1.4, T.g2 - 0.35); K.popIn(exc[5], t, T.g3 + 1.4, T.g4 + 0.2);   // H's label is gone before 'group 2' takes that spot
      });
    }

    // ================================================================ THE CHECKLIST CARD "What is a metal?" (rides with the camera)
    beats.push(K.checklist(scene, cam, { title: 'What is a metal?', intro: INTRO, ticks: TICKS,
      rows: [[0, '1 · What a metal does'], [1, 'carries electricity'], [1, 'carries heat'], [1, 'hammers flat (malleable)'], [1, 'pulls into wire (ductile)'],
        [1, 'is solid (mercury: liquid)'], [0, '2 · Its oxide'], [1, 'is a base (red litmus → blue)'], [0, '3 · Its atoms'], [1, 'lose electrons → a cation (Na⁺)']],
      short: ['carries electricity', 'carries heat', 'hammers flat', 'pulls into wire', 'solid (not Hg)', 'oxide: a base', 'loses electrons'] }));

    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));
    beats.push(() => { const nar = Math.min(1, (cam.aspect / 1.5) ** 0.7); tags.forEach((l) => { if (l.visible) l.scale.multiplyScalar(cam.position.distanceTo(l.position) * 0.5735 * l.userData.frac * nar / 0.1); }); });   // upright phones: labels fit the narrow width
    return (t, dt) => { for (const b of beats) b(t, dt); };
  },
};
