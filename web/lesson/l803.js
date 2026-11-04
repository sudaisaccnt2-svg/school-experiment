// Lesson 803 · Alkali metals (book pp. 222–223), v10 — story spine on screen, book's own argument, plain words (SKILL §4):
// every shot is framed by size (S(): the subject always fits, also on iPad), nothing appears from nowhere, no empty
// travel frames, no holds without action, each sample shows WHY (sodium dulls in air → kept in oil), the dive into the
// atom is one continuous push (lump fills the screen → cut on the motion → a wall of potassium atoms → one atom opens).
//   Act 1 What makes a metal a metal? (book order) Test 1: metals conduct, non-metals don't, except graphite. Test 2, the
//         sure one: Zn + 2HCl → ZnCl₂ + H₂; zinc gives 2 electrons → Zn²⁺ + 2Cl⁻; with a battery Zn²⁺ go to the − pole:
//         atoms that turn + are metals. Bridge: "metals give electrons away. Who does it best?" → group IA.
//   Act 2 The periodic table → group IA; hydrogen is a gas; the rest = alkali metals Li Na K Rb Cs Fr (Fig. 8.1: Na
//         soft, cut, dulls in air → kept in oil; Rb/Cs sealed in glass; Fr no sample). 'Alkali' = Arabic "the ashes"
//         (Na, K first found in plant ash); or: with water they make strong alkalies.
//   Act 3 Inside potassium: 2,8,8,1, one outer s electron, low ionization energy → K⁺ (19+, 18−), highly
//         electropositive (detach animation LOCKED, praised 2026-10-11); the electron goes to chlorine, group VIIA
//         (KCl) and two to oxygen, group VIA (K₂O): ionic compounds; the salt crystal grows from one K⁺ outward.
//   Act 4 Never free: KCl crystal = a crystal of a potassium salt deposit (Rb, Cs inside); Na + K = 2.4 % of the crust;
//         Li mostly in spodumene LiAl(SiO₃)₂; Fr not in nature, made in labs.   End: the family, one loose electron each.
// Memorize-only (→ game): Fig. 8.1 atomic numbers and masses.
import * as THREE from 'three';
import * as K from './kit.js';
const { M, span, ease, easeIn, back, lerp, hash, clamp01: clamp } = K;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// ---- framing: a shot is "look at this point, fit a w × h subject", seen from direction dir (works for 16:9 and iPad)
const TAN = Math.tan(16 * Math.PI / 180), ASP = 1.6;
function S(t, look, w, h, dir = [0, 0.32, 1], e) {
  h *= 1.14; look = [look[0], look[1] + 0.05 * h, look[2]];        // headroom: the caption floats just above the subject (capNear)
  const d = V(...dir).normalize(), dist = Math.max(h / 2 / TAN, w / 2 / (TAN * ASP)) * 1.1;
  return [t, V(...look).addScaledVector(d, dist).toArray(), look, undefined, e, { look, w, h, dir, dock: 0 }];   // fit: the engine refits it to the real screen
}

const X = { board: -3.4, test: 0, col: 5.0, fam: 11, ash: 16.6, water: 22.2, deposit: 34, crust: 38.8, rock: 44, lab: 50 };
const ROW = (i) => X.fam + (i - 2.5) * 1.0;                          // the family row on the bench
const TZ = -2.6, TP = 0.5;                                           // periodic table wall: depth, tile pitch
const TROW = (period) => 4.6 - (period - 1) * TP;
const AT = V(100, 1.8, 0);                                           // inside potassium: the K atom
const CL = AT.x + 5.8, MID = AT.x + 2.9, OX = V(AT.x + 10, AT.y, 0), CX = V(AT.x + 15.5, AT.y, 0);
const JAR = V(X.water + 1.95, 0, 0.3), LUMP = V(JAR.x, 0.1, JAR.z);  // the potassium jar beside the water tank

const T = {
  metal: 2.5, sulphur: 6.5, graphite: 10.5, test: 14.5, zinc: 16.6, h2: 20, eq: 23.5, split: 30.5, rig: 35.5, current: 38,
  verdict: 42, bridge: 46, table: 48.5, group: 52.5, hydrogen: 55.5,
  ash: 78, water: 88, dive: 97.5, atom: 100.2, rev: 103, outer: 106, tug: 109.5, free: 112.7, give: 117.2, ionsK: 120.6,
  oxy: 126, crystal: 132, deposit: 139.4, crust: 147.4, rock: 153.4, fr: 159.4, end: 166, done: 175,
};
const FAM = [58.5, 61, 67.5, 70, 72.5, 75];
const NAMES = ['lithium (Li)', 'sodium (Na)', 'potassium (K)', 'rubidium (Rb)', 'cesium (Cs)', 'francium (Fr)'];
const SYMS = ['Li', 'Na', 'K', 'Rb', 'Cs', 'Fr'];

export default {
  capNear: true, oneText: true,
  duration: T.done,
  captions: [
    // the story spine (said on screen at every act boundary): metals give electrons away → who does it best? → why → so never free
    [0.3, T.metal + 0.6, 'What makes a metal a metal?'],
    [T.metal + 0.6, T.sulphur, 'Test 1: metals carry electricity'],
    [T.sulphur + 0.6, T.graphite, 'Non-metals don’t…'],
    [T.graphite + 0.6, T.test, '…except graphite (carbon)'],
    [T.test, T.h2, 'Test 2, the sure one: put it in acid'],
    [T.h2, T.eq, 'Zinc dissolves; hydrogen gas bubbles off'],
    [T.eq, T.eq + 4.6, 'Written as an equation:'],
    [T.eq + 4.6, T.split, 'Zn + 2HCl → ZnCl₂ + H₂'],
    [T.split, T.split + 3.3, 'Zinc gives 2 electrons to the chlorines'],
    [T.split + 3.3, T.rig, 'Now zinc is + (Zn²⁺), chlorine is − (Cl⁻)'],
    [T.rig, T.current, 'Add a battery: a + pole and a − pole'],
    [T.current, T.verdict, 'The + zinc goes to the − pole'],
    [T.verdict, T.bridge, 'Atoms that turn + are metals: zinc is a metal'],
    [T.bridge, T.table + 0.6, 'So metals give electrons away. Who does it best?'],
    [T.table + 0.6, T.group, 'Every element: the periodic table'],
    [T.group, T.hydrogen, 'The first column: group IA'],
    [T.hydrogen, FAM[0] + 0.9, 'Hydrogen is a gas. The rest: the alkali metals'],
    [FAM[0] + 0.9, FAM[1] + 0.9, 'Lithium (Li): kept in oil'],
    [FAM[1] + 0.9, FAM[1] + 3.6, 'Sodium (Na): so soft a knife cuts it'],
    [FAM[1] + 3.6, FAM[2] + 0.9, 'Air dulls it in seconds: so it’s kept in oil'],
    [FAM[2] + 0.9, FAM[3] + 0.9, 'Potassium (K): kept in oil too'],
    [FAM[3] + 0.9, FAM[4] + 0.9, 'Rubidium (Rb): sealed in glass'],
    [FAM[4] + 0.9, FAM[5] + 0.9, 'Cesium (Cs): sealed in glass'],
    [FAM[5] + 0.9, T.ash, 'Francium (Fr): no sample, made in labs'],
    [T.ash + 0.3, T.ash + 4.5, 'Why “alkali”? Arabic for “the ashes”'],
    [T.ash + 4.5, T.water, 'Sodium and potassium were first found in plant ash'],
    [T.water + 0.3, T.water + 4.5, 'And in water they fizz…'],
    [T.water + 4.5, T.dive, '…and make a strong alkali: litmus turns blue'],
    [T.dive, T.atom + 1.0, 'Why do they react so fast? Look inside potassium'],
    [T.atom + 1.0, T.rev, 'The metal is made of atoms'],
    [T.rev, T.outer, 'Potassium: 2, 8, 8, 1 electrons'],
    [T.outer, T.tug, 'Only 1 electron on the outside (an s electron)'],
    [T.tug, T.free + 0.4, 'It is easy to pull off (low ionization energy)'],
    [T.free + 0.4, T.free + 3.2, '19 + and 18 −: now it is K⁺'],
    [T.free + 3.2, T.give, 'It gives electrons away easily (electropositive)'],
    [T.give, T.ionsK, 'Chlorine takes the electron'],
    [T.ionsK, T.oxy, '+ and − stick together: KCl, a salt'],
    [T.oxy, T.crystal, 'Oxygen takes 2 electrons, one from each K: K₂O'],
    [T.crystal, T.deposit, 'Many K⁺ and Cl⁻ stack up: a salt crystal'],
    [T.deposit, T.deposit + 4.5, 'That’s why they are never found free: only in salts'],
    [T.deposit + 4.5, T.crust, 'Rubidium and cesium hide in potassium salt rocks'],
    [T.crust + 0.3, T.rock, 'Sodium and potassium: 2.4 % of the earth’s crust'],
    [T.rock + 0.3, T.fr, 'Lithium: in rocks, mostly spodumene'],
    [T.fr + 0.3, T.end, 'Francium: not found in nature, made in labs'],
    [T.end + 0.5, T.end + 4.5, 'Alkali metals give away their 1 electron most easily'],
    [T.end + 4.5, T.done, 'So: very reactive, never found free'],
  ],
  cams: [
    // ACT 1 — test 1 on the board → over to the beaker → follow the zinc in → close on ONE ZnCl₂ for the electrons → widen for the battery → push to the − pole
    S(0, [X.board, 0.38, 0], 3.6, 1.4), S(T.test - 0.3, [X.board + 0.1, 0.38, 0], 3.4, 1.35),
    S(T.test + 1.2, [X.test - 1.1, 0.8, 0], 4.8, 2.5), S(T.zinc, [X.test - 0.35, 0.95, 0], 3.2, 2.6), S(T.zinc + 2.0, [X.test, 0.95, 0], 2.6, 2.6),
    S(T.split - 0.1, [X.test, 0.95, 0], 2.5, 2.55),
    S(T.split + 1.0, [X.test + 0.22, 0.48, 0.15], 0.8, 0.58, [0, 0.2, 1]), S(T.rig - 0.5, [X.test + 0.22, 0.48, 0.15], 0.76, 0.55, [0, 0.2, 1]),
    S(T.rig + 1.4, [X.test + 0.65, 1.0, 0], 3.9, 2.5), S(T.verdict - 0.2, [X.test + 0.62, 0.98, 0], 3.7, 2.45),
    S(T.verdict + 1.5, [X.test + 0.5, 0.82, 0], 3.0, 2.0), S(T.table - 0.02, [X.test + 0.5, 0.84, 0], 2.8, 1.9),   // cut on the question
    // the table builds above the board; ONE push onto group IA
    S(T.table, [X.col + 4.3, 3.1, TZ], 10.0, 3.9, [0, 0.12, 1]), S(T.table + 2.2, [X.col + 4.25, 3.1, TZ], 9.8, 3.8, [0, 0.12, 1]), S(T.group, [X.col + 4.1, 3.1, TZ], 9.6, 3.7, [0, 0.12, 1]),
    S(T.group + 2.0, [X.col + 0.3, 3.1, TZ], 2.6, 4.0, [0, 0.1, 1]), S(T.hydrogen + 1.0, [X.col - 0.45, 3.2, TZ], 3.6, 4.0, [0, 0.1, 1]),
    // each tile drops to the bench and becomes its real sample (the camera follows it down)
    S(FAM[0] + 0.15, [X.col + 0.3, 3.4, TZ + 0.4], 3.4, 3.0, [0, 0.1, 1]), S(FAM[0] + 0.75, [X.col + 1.8, 1.7, -1.0], 3.6, 3.0, [0, 0.25, 1]),
    S(FAM[0] + 1.4, [ROW(0) + 0.4, 0.42, 0.3], 2.7, 1.3, [0, 0.35, 1]),
    S(FAM[1] + 1.0, [ROW(1), 0.42, 0.3], 2.7, 1.3, [0, 0.35, 1]), S(FAM[1] + 2.8, [ROW(1), 0.25, 0.3], 1.5, 0.85, [0, 0.4, 1]),
    S(FAM[2] - 0.3, [ROW(1) + 0.05, 0.25, 0.3], 1.45, 0.82, [0, 0.4, 1]),
    ...[2, 3, 4, 5].map((i) => S(FAM[i] + 1.1, [ROW(i), 0.42, 0.3], 2.7, 1.3, [0, 0.35, 1])),
    S(T.ash - 0.5, [ROW(5) - 0.1, 0.42, 0.3], 2.6, 1.25, [0, 0.35, 1]),
    // ashes, water
    S(T.ash + 1.4, [X.ash, 0.35, 0], 3.2, 1.5), S(T.water - 0.5, [X.ash, 0.32, 0], 2.9, 1.4),
    S(T.water + 1.3, [X.water + 0.4, 0.5, 0], 3.6, 1.5), S(T.water + 5.0, [X.water + 0.45, 0.5, 0], 3.5, 1.48),
    S(T.water + 6.2, [X.water + 0.85, 0.6, 0.45], 1.3, 0.95, [0, 0.25, 1]), S(T.dive - 0.4, [X.water + 0.9, 0.6, 0.45], 1.25, 0.92, [0, 0.25, 1]),   // close on the paper turning blue
    // ACT 3 — the dive: to the jar, then speed up INTO the lump until metal fills the screen …
    S(T.dive + 1.5, [JAR.x, 0.32, JAR.z], 1.2, 0.95, [0, 0.3, 1]),
    [T.atom - 0.04, [LUMP.x, LUMP.y + 0.02, LUMP.z + 0.135], LUMP.toArray(), undefined, 'in'],
    // … cut on the motion: a wall of potassium atoms (same grey), the push goes on and settles on one atom
    [T.atom, [AT.x, AT.y + 0.5, 15], AT.toArray()], [T.rev, [AT.x, AT.y + 0.2, 5.6], AT.toArray(), undefined, 'out'],
    S(T.outer, [AT.x, AT.y, 0], 3.4, 3.2, [0, 0.05, 1]),
    S(T.tug, [AT.x + 0.5, AT.y, 0], 4.4, 3.3, [0, 0.05, 1]), S(T.give, [AT.x + 0.55, AT.y, 0], 4.5, 3.4, [0, 0.05, 1]),
    S(T.give + 2.2, [MID, AT.y, 0], 8.8, 3.4, [0, 0.06, 1]), S(T.ionsK + 1.9, [MID, AT.y, 0], 8.4, 3.2, [0, 0.06, 1]),
    S(T.ionsK + 3.2, [MID, AT.y, 0], 4.2, 2.6, [0, 0.08, 1]), S(T.oxy - 0.3, [MID + 0.2, AT.y, 0], 4.0, 2.5, [0, 0.08, 1]),
    S(T.oxy + 1.3, [OX.x, AT.y, 0], 5.6, 2.8, [0, 0.08, 1]), S(T.crystal - 0.7, [OX.x + 0.1, AT.y, 0], 5.3, 2.7, [0, 0.08, 1]),
    S(T.crystal + 0.9, [CX.x, AT.y + 0.1, 0], 3.2, 3.3, [0, 0.12, 1]),
    [T.deposit - 0.02, CX.clone().add(V(0, 0.6, 5.0)).toArray(), CX.toArray()],
    // ACT 4 — the crystal IS one cube of the salt deposit (same size and place on screen): slow pull back
    [T.deposit, [X.deposit + 0.1, 0.1 + 0.0686, 0.95 + 0.571], [X.deposit + 0.1, 0.1, 0.95]],
    S(T.deposit + 4.0, [X.deposit, 0.42, 0.1], 2.8, 1.75), S(T.crust - 0.6, [X.deposit + 0.1, 0.42, 0.1], 2.7, 1.7),
    S(T.crust + 1.2, [X.crust, 0.1, 0.15], 3.2, 2.0, [0, 0.7, 1]), S(T.rock - 0.5, [X.crust, 0.1, 0.15], 3.0, 1.95, [0, 0.7, 1]),
    S(T.rock + 1.2, [X.rock, 0.72, 0], 2.6, 2.1), S(T.fr - 0.5, [X.rock, 0.72, 0], 2.5, 2.05),
    S(T.fr + 1.2, [X.lab, 0.5, 0], 3.4, 1.6),
    // END — the whole family
    S(T.end - 0.02, [X.lab + 0.15, 0.5, 0], 3.1, 1.48), S(T.end, [X.fam, 0.62, 0.3], 5.7, 1.5, [0, 0.25, 1]), S(T.end + 1.2, [X.fam, 0.62, 0.3], 5.9, 1.55, [0, 0.25, 1]), S(T.done, [X.fam, 0.62, 0.3], 6.1, 1.6, [0, 0.25, 1]),
  ],

  build({ scene, cam }) {
    const add = (o, x = 0, y = 0, z = 0) => { o.position.set(x, y, z); scene.add(o); return o; };
    const lbl = (text, h, color, x, y, z, w) => add(K.label(text, h, color, w), x, y, z);
    const beats = [];
    const fogAt = (t) => {                                              // wide shots see further than the studio fog
      if (t > T.table - 0.5 && t < FAM[0] + 0.8) { const k = span(t, T.table - 0.5, T.table + 1) * (1 - span(t, FAM[0], FAM[0] + 0.8)); return [6 + 8 * k, 15 + 16 * k]; }
      if (t > T.atom - 0.01 && t < T.deposit) return [30, 80];
      return [6, 15];
    };
    const floor = scene.getObjectByName('floor');
    beats.push((t) => { const [n, f] = fogAt(t); scene.fog.near = n; scene.fog.far = f; if (floor) floor.visible = !(t > T.atom - 0.01 && t < T.deposit); });

    // ================================================================ ACT 1 · what makes a metal a metal? (the book's two tests, in its order)
    {
      // ---- test 1 (conductance): copper (metal) lights the bulb, sulphur (non-metal) doesn't, graphite does
      const gx = X.board;
      add(K.solid(new THREE.BoxGeometry(2.6, 0.06, 0.9), M.matte(0x6b4a2e, 0.8)), gx + 0.3, 0.03, 0);
      const clip = (cx) => add(K.solid(new THREE.BoxGeometry(0.16, 0.1, 0.14), M.metal(0xb9bec6, 0.3)), cx, 0.11, 0);
      clip(gx - 0.32); clip(gx + 0.32);
      add(K.battery(), gx - 1.35, 0, -0.1);
      const inW = add(K.wire([[gx - 1.35, 0.88, -0.1], [gx - 1.2, 0.95, -0.05], [gx - 0.75, 0.35, 0.1], [gx - 0.55, 0.12, 0.05], [gx - 0.4, 0.12, 0]], 0xb8442f));
      const bulbW = add(K.wire([[gx + 0.4, 0.12, 0], [gx + 0.8, 0.12, 0.05], [gx + 1.05, 0.1, 0]], 0xb8442f));
      add(K.wire([[gx + 1.15, 0.06, -0.15], [gx + 0.6, 0.07, -0.38], [gx - 0.9, 0.07, -0.38], [gx - 1.25, 0.04, -0.18]], 0x2b2f38));
      const lamp = add(K.bulb(), gx + 1.1, 0.06, 0);
      const pI = add(K.pulses(inW.userData.curve, 5)), pB = add(K.pulses(bulbW.userData.curve, 4));
      const cu = add(K.solid(new THREE.BoxGeometry(0.9, 0.03, 0.14), M.metal(0xc8763f, 0.3)), gx, 2, 0);
      const sul = add(K.solid(new THREE.CylinderGeometry(0.075, 0.075, 0.9, 12), M.matte(0xe8c53a, 0.85)), gx, 2, 0); sul.rotation.z = Math.PI / 2;
      const gr = add(K.solid(new THREE.CylinderGeometry(0.06, 0.06, 0.9, 8), M.metal(0x3a3d44, 0.35)), gx, 2, 0); gr.rotation.z = Math.PI / 2;
      const samples = [[cu, T.metal, T.sulphur, 0.175, true], [sul, T.sulphur, T.graphite, 0.235, false], [gr, T.graphite, T.test + 2, 0.22, true]];
      const lBat = lbl('battery', 0.15, '#cfd6e2', gx - 1.35, 1.2, -0.1), lBulb = lbl('bulb', 0.15, '#cfd6e2', gx + 1.1, 0.95, 0);
      const sLbl = [lbl('copper (metal)', 0.16, '#f2c6a0', gx, 0.55, 0.25), lbl('sulphur (non-metal)', 0.16, '#f3e3a0', gx, 0.55, 0.25), lbl('graphite (non-metal)', 0.16, '#d8dde6', gx, 0.55, 0.25)];
      const rLbl = [lbl('light ✓', 0.17, '#ffe2a0', gx + 1.1, 1.05, 0), lbl('no light ✗', 0.17, '#c9d1dc', gx + 1.1, 1.05, 0), lbl('light ✓', 0.17, '#ffe2a0', gx + 1.1, 1.05, 0)];
      beats.push((t) => {
        K.popIn(lBat, t, 0.6, T.metal + 0.4); K.popIn(lBulb, t, 0.9, T.metal + 0.4);
        let lit = 0;
        samples.forEach(([o, t0, t1, rest, conducts], i) => {
          let y = K.drop(t, t0, 1.6, rest, 0.42, 0.04).y;                         // lands ON both clips
          if (t > t1 - 0.7) y = rest + 1.8 * easeIn(span(t, t1 - 0.7, t1 - 0.1));   // lifted off before the next one
          o.position.y = y; o.visible = t > t0 - 0.05 && t < t1;
          K.popIn(sLbl[i], t, t0 + 0.5, Math.min(t1 - 0.7, T.test + 0.4)); K.popIn(rLbl[i], t, t0 + 0.75, Math.min(t1 - 0.7, T.test + 0.4));
          if (conducts && t > t0 + 0.45 && t < t1 - 0.6) lit = ease(span(t, t0 + 0.45, t0 + 0.7));
        });
        lamp.userData.set(lit);
        pI.userData.update(t, lit, lit > 0.01 ? 1 : 0); pB.userData.update(t, lit, lit > 0.01 ? 1 : 0);
      });
    }
    {
      // ---- test 2 (the electrolysis test): dissolve zinc in acid, then run a current through the solution
      const x = X.test;
      add(K.beaker(), x, 0, 0);
      add(K.liquid(0.6, 0.95, 0xcfe3f0, 0.38), x, 0.055, 0);
      const dish = add(new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.22, 0.01], [0.28, 0.05], [0.26, 0.05], [0.2, 0.025], [0, 0.015]].map(([a, b]) => new THREE.Vector2(a, b)), 40), M.glass()), x - 1.3, 0.002, 0.35);
      dish.renderOrder = 5;
      const zHome = V(x - 1.3, 0.1, 0.35), zBed = V(x, 0.13, 0);
      const zn = add(K.lump(0.13, M.metal(0xa9b3bf, 0.25), 2), zHome.x, zHome.y, zHome.z);
      const sp = add(K.splash(0xffffff, 0.8), x, 1.0, 0);
      const fizz = add(K.bubbles(30, V(x, 0.15, 0), 0.98, 0.2, 0.018));
      const lZn = lbl('zinc (Zn)', 0.16, '#e6ebf2', 0, 0, 0), lAcid = lbl('acid (HCl)', 0.16, '#d8ecff', x - 0.3, 0.78, 0.75);
      const lH2 = lbl('hydrogen gas (H₂)', 0.15, '#ffffff', x + 0.15, 1.2, 0.3);
      // only three ZnCl₂ (one Zn held by two Cl): each forms ON the zinc and drifts off it
      const UH = [V(x + 0.22, 0.5, 0.15), V(x - 0.36, 0.88, -0.2), V(x - 0.4, 0.28, -0.15)];   // unit 0 alone in the close-up
      const units = UH.map((home, i) => {
        const g = new THREE.Group(), z = K.solid(new THREE.SphereGeometry(0.045, 20, 14), M.gloss(0xf09a4a));
        const c1 = K.solid(new THREE.SphereGeometry(0.06, 20, 14), M.gloss(0x4fc46a)), c2 = K.solid(new THREE.SphereGeometry(0.06, 20, 14), M.gloss(0x4fc46a)); g.add(z, c1, c2); add(g);
        const sz = K.label('2+', 0.05, '#ffffff', 700); sz.position.set(0.045, 0.05, 0.03); z.add(sz);
        const s1 = K.label('−', 0.06, '#ffffff', 700), s2 = K.label('−', 0.06, '#ffffff', 700); s1.position.set(0.05, 0.06, 0.03); s2.position.set(0.05, 0.06, 0.03); c1.add(s1); c2.add(s2);
        return { g, z, c1, c2, sz, s1, s2, home, t0: T.h2 + 0.4 + i * 0.6 };
      });
      // unit 0: zinc hands one gold electron to each chlorine (that is WHY it becomes +)
      const golds = [0, 1].map(() => { const e = new THREE.Group(); e.add(new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 8), M.glow(0xffc04d, 3)), K.glowSprite(0xffc04d, 0.11)); units[0].g.add(e); return e; });
      const lUnit = lbl('ZnCl₂', 0.15, '#d8ecff', 0, 0, 0), lZn2 = lbl('Zn²⁺', 0.07, '#ffd0a0', 0, 0, 0, 700), lCl = lbl('Cl⁻', 0.07, '#bff0c8', 0, 0, 0, 700);
      const lGave = lbl('gave 2 electrons', 0.05, '#ffd27a', 0, 0, 0);
      // the equation is BUILT one piece at a time: each name leaves its thing and becomes a symbol in the line
      const EQY = 2.05, EQZ = 0.5;
      const tok = [['Zn', -1.12, lZn], ['+', -0.8], ['2HCl', -0.4, lAcid], ['→', 0.08], ['ZnCl₂', 0.55, lUnit], ['+', 0.98], ['H₂', 1.3, lH2]]
        .map(([s, dx, src], i) => ({ l: lbl(s, 0.2, s.length > 1 || s === 'Zn' ? '#f6d48f' : '#ffffff', 0, 0, 0, 700), to: V(x + 0.07 + dx, EQY, EQZ), src, t0: T.eq + i * 0.75, from: V() }));
      // the battery rig is lowered in when it is needed
      const rig = add(new THREE.Group());
      const rodAt = (dx) => { const r = K.solid(new THREE.CylinderGeometry(0.045, 0.045, 1.45, 8), M.matte(0x30333a, 0.55)); r.position.set(x + dx, 1.0, -0.12); rig.add(r); };
      rodAt(-0.34); rodAt(0.34);
      const bat = K.battery(); bat.position.set(x + 1.85, 0, -0.1); rig.add(bat);
      const wA = K.wire([[x - 0.34, 1.72, -0.12], [x - 0.3, 1.92, -0.12], [x + 0.6, 1.98, -0.12], [x + 1.65, 1.5, -0.1], [x + 1.85, 0.88, -0.1]], 0xb8442f);
      const wC = K.wire([[x + 0.34, 1.72, -0.12], [x + 0.45, 1.95, -0.1], [x + 0.95, 1.2, 0.1], [x + 1.4, 0.12, 0.1], [x + 1.75, 0.05, -0.02]], 0x2b2f38);
      const pA = K.pulses(wA.userData.curve, 6), pC = K.pulses(wC.userData.curve, 6); rig.add(wA, wC, pA, pC);
      const lAn = K.label('+ pole', 0.15, '#ff9a80', 700), lCath = K.label('− pole', 0.15, '#8ec5ff', 700);
      lAn.position.set(x - 0.62, 2.18, 0.05); lCath.position.set(x + 0.62, 2.18, 0.05); rig.add(lAn, lCath);
      const lPole = lbl('+ ions at the − pole', 0.14, '#ffe2a0', x + 1.05, 0.4, 0.8), verdict = lbl('metal ✓', 0.26, '#f6d48f', x + 1.0, 1.3, 0.75, 700);
      beats.push((t) => {
        // the zinc: dips (anticipation), arcs over, drops (gravity), splashes, sinks slowly (drag), then slowly dissolves
        let p;
        if (t < T.zinc) p = zHome.clone();
        else if (t < T.zinc + 0.2) p = zHome.clone().add(V(0, -0.02 * Math.sin(Math.PI * span(t, T.zinc, T.zinc + 0.2)), 0));
        else if (t < T.zinc + 1.0) p = K.arc(zHome, V(x, 1.4, 0), 0.5, ease(span(t, T.zinc + 0.2, T.zinc + 1.0)));
        else { const f = K.drop(t, T.zinc + 1.0, 1.4, 1.0, 0.28, 0); p = V(x, f.landed ? lerp(1.0, zBed.y, ease(span(f.k, 0, 0.75))) : f.y, 0); }
        zn.position.copy(p); zn.rotation.z = 0.8 * span(t, T.zinc + 0.2, T.zinc + 2);
        sp.userData.update(t - T.zinc - 1.28);
        zn.scale.setScalar(1 - 0.4 * span(t, T.h2 + 0.4, T.split));
        fizz.userData.update(t, ease(span(t, T.zinc + 2, T.zinc + 2.8)) * (1 - 0.8 * span(t, T.split - 1, T.split)), zn.position);
        lZn.position.copy(zn.position).add(V(0.38, 0.12, 0.7));
        K.popIn(lZn, t, T.test + 1.0, tok[0].t0); K.popIn(lAcid, t, T.test + 1.6, tok[2].t0); K.popIn(lH2, t, T.h2, tok[6].t0);
        const sep0 = (i) => ease(span(t, T.split + 2.5 + i * 0.2, T.split + 3.3 + i * 0.2));
        units.forEach((u, i) => {
          const born = ease(span(t, u.t0, u.t0 + 1.0));
          u.g.visible = t > u.t0; u.g.scale.setScalar(Math.max(1e-4, lerp(0.3, 1, born)));
          u.g.position.lerpVectors(zBed, u.home, born);
          const sep = sep0(i);
          u.c1.position.set(-0.1 - 0.13 * sep, 0.05 * sep, 0); u.c2.position.set(0.1 + 0.13 * sep, -0.05 * sep, 0); u.z.position.set(0, 0, 0);
          // current on: the − pole pulls the + zinc ions, the + pole the − chloride ions
          const w = ease(span(t, T.current + 0.4 + i * 0.4, T.current + 2.6 + i * 0.4));
          u.z.position.set(lerp(0, x + 0.27 - u.home.x, w), lerp(0, 0.36 + i * 0.13 - u.home.y, w), lerp(0, -0.12 - u.home.z, w));
          u.c1.position.lerp(V(x - 0.27 - u.home.x, 0.33 + 2 * i * 0.11 - u.home.y, -0.12 - u.home.z), w);
          u.c2.position.lerp(V(x - 0.27 - u.home.x, 0.33 + (2 * i + 1) * 0.11 - u.home.y, -0.12 - u.home.z), w);
          [u.sz, u.s1, u.s2].forEach((s) => K.popIn(s, t, T.rig));          // small signs only once the close-up names are gone
          u.z.material.emissive.set(0xff9a40); u.z.material.emissiveIntensity = t > T.verdict ? 0.6 + 0.5 * Math.sin(t * 6) : 0;
        });
        const u0 = units[0];
        golds.forEach((e, k) => {                                         // two gold electrons: zinc → each chlorine
          const c = k ? u0.c2 : u0.c1, m = ease(span(t, T.split + 1.2 + k * 0.35, T.split + 2.0 + k * 0.35)), a = t * 5 + k * Math.PI;
          e.visible = t > T.split + 0.2;                                   // first seen circling the zinc, then each hops to a chlorine and stays
          const ring = V(Math.cos(a) * 0.075, 0.03, Math.sin(a) * 0.075);
          e.position.copy(u0.z.position).add(ring).lerp(c.position.clone().add(ring), m);
        });
        lUnit.position.copy(u0.g.position).add(V(0, 0.16, 0.12)); K.popIn(lUnit, t, T.h2 + 1.6, tok[4].t0);
        lZn2.position.copy(u0.z.getWorldPosition(V())).add(V(0, -0.11, 0.06)); K.popIn(lZn2, t, T.split + 3.4, T.rig);
        lGave.position.copy(lZn2.position).add(V(0, -0.07, 0)); K.popIn(lGave, t, T.split + 3.9, T.rig);
        lCl.position.copy(u0.c2.getWorldPosition(V())).add(V(0.03, -0.12, 0.06)); K.popIn(lCl, t, T.split + 3.6, T.rig);
        tok.forEach(({ l, to, src, t0, from }) => {
          if (src) {
            if (t < t0) from.copy(src.position);                          // the name leaves its thing …
            l.position.copy(from).lerp(to, ease(span(t, t0, t0 + 0.6)));
            K.popIn(l, t, t0 - 0.01, T.split - 0.3);
          } else { l.position.copy(to); K.popIn(l, t, t0, T.split - 0.3); }
        });
        rig.visible = t >= T.rig; rig.position.y = K.drop(t, T.rig, 2.4, 0, 0.6, 0.04).y;
        K.popIn(lAn, t, T.rig + 0.8, T.bridge); K.popIn(lCath, t, T.rig + 1.0, T.bridge);
        const on = span(t, T.current, T.current + 0.2);
        pA.userData.update(t, ease(span(t, T.current, T.current + 0.8)), on); pC.userData.update(t, ease(span(t, T.current, T.current + 0.8)), on);
        K.popIn(lPole, t, T.verdict + 0.2, T.bridge + 0.5); K.popIn(verdict, t, T.verdict + 1.4, T.bridge + 0.5);
      });
    }

    // ================================================================ ACT 2 · the periodic table → group IA → the family
    {
      const slots = [];
      for (let p = 1; p <= 7; p++) for (let g = 2; g <= 18; g++) {
        if (p === 1 && g !== 18) continue; if ((p === 2 || p === 3) && g > 2 && g < 13) continue;
        slots.push([p, g]);
      }
      const other = new THREE.InstancedMesh(new THREE.BoxGeometry(0.44, 0.44, 0.08), M.gloss(0xffffff), slots.length); add(other);
      const cc = new THREE.Color(), m4 = new THREE.Matrix4(), q = new THREE.Quaternion();
      slots.forEach(([p, g], i) => other.setColorAt(i, cc.set(g <= 2 ? 0x31528f : g >= 13 ? (g === 18 ? 0x6a4f8f : 0x2f7a5a) : 0x4a5568)));
      const syms = ['H', ...SYMS], tiles = {};
      syms.forEach((s, i) => { tiles[s] = add(K.tile(s, i ? 0x3a64b8 : 0x2e8a57, 0.44, 0.44, 0.1), X.col, TROW(i + 1), TZ); });
      const built = (t, p, g) => back(span(t, T.table - 0.1 + (g - 1) * 0.09 + p * 0.03, T.table + 0.25 + (g - 1) * 0.09 + p * 0.03));   // the table builds in a wave
      const lTable = lbl('the periodic table', 0.5, '#f6d48f', X.col + 4.25, TROW(1) + 0.15, TZ), head = lbl('group IA', 0.3, '#f6d48f', X.col + 0.95, TROW(4), TZ, 700);
      const lH = lbl('hydrogen: a gas', 0.3, '#cfe8d6', X.col - 0.85, TROW(1) - 0.42, TZ);
      const grey = new THREE.Color(0x4a4f58), green = new THREE.Color(0x2e8a57);
      // the real samples (Fig. 8.1)
      const vialObj = (metal, i) => { const g = new THREE.Group(); g.add(K.vial()); const oil = K.liquid(0.14, 0.4, 0xd9a84a, 0.32); oil.position.y = 0.03; g.add(oil); const m = K.lump(0.085, M.metal(metal, 0.22), i * 3.1); m.position.y = 0.1; g.add(m); return g; };
      const objs = [vialObj(0xc9ccd1, 0), K.sodiumBlock(), vialObj(0xcfd4dc, 2), K.sealedTube(0xc9c4bd), K.sealedTube(0xe6c97a), frTrap(1)];
      objs.forEach((o, i) => add(o, ROW(i), 0, 0.3));
      const na = objs[1]; na.rotation.y = -0.5;
      const { shine, crust } = na.userData, fresh = new THREE.Color(0xf4f6f8), dull = crust.color.clone();
      const stars = [[0.1, 0.06, 0.08, 0.13], [0.6, -0.04, -0.06, 0.09], [1.1, 0.02, 0.1, 0.07], [1.5, -0.07, -0.1, 0.11]]   // [phase, y, z, size] on the cut face
        .map(([ph, y, z, sz]) => { const s = K.sparkle(0xffffff, sz * 1.5); s.userData.at = V(0.128, y, z); s.userData.ph = ph; na.userData.a.add(s); return s; });
      const kn = K.knife(); kn.rotation.y = Math.PI / 2; kn.position.set(0, 1.6, 0.35); na.add(kn);
      const nameY = [0.98, 0.5, 0.98, 0.42, 0.42, 0.75];
      const names = NAMES.map((s, i) => lbl(s, 0.16, '#ffffff', ROW(i), nameY[i], 0.3, 700));
      const notes = ['kept in oil', '', 'kept in oil', 'sealed in glass', 'sealed in glass', 'made in labs'].map((s, i) => s && lbl(s, 0.13, '#cfd6e2', ROW(i), nameY[i] - 0.19, 0.3));
      const lSoft = lbl('soft: a knife cuts it', 0.12, '#f3e7c0', ROW(1) + 0.1, 0.7, 0.3), lShiny = lbl('shiny inside', 0.12, '#ffffff', ROW(1) - 0.45, 0.08, 0.65), lDull = lbl('air dulls it', 0.12, '#d8d4cc', ROW(1) + 0.5, 0.1, 0.65);
      beats.push((t) => {
        slots.forEach(([p, g], i) => {
          const k = ease(span(t, T.group + 0.2 + g * 0.06, T.group + 0.9 + g * 0.06)), s = Math.max(1e-4, built(t, p, g) * (1 - k));
          m4.compose(V(X.col + (g - 1) * TP, TROW(p), TZ - k * 1.2), q, V(s, s, s)); other.setMatrixAt(i, m4);
        });
        other.instanceMatrix.needsUpdate = true; other.visible = t > T.table - 0.5 && t < T.group + 2.5;
        K.popIn(lTable, t, T.table + 1.4, T.group + 0.3); K.popIn(head, t, T.group + 0.8, FAM[0] + 0.3);
        syms.forEach((s, i) => { const b = tiles[s].userData.body.material; b.emissive.set(s === 'H' ? 0x2e8a57 : 0x3a64b8); b.emissiveIntensity = 0.7 * span(t, T.group - 0.5, T.group) * (1 - span(t, T.group + 1.5, T.group + 2.2)); });
        const h = tiles.H;
        h.position.x = X.col - 0.75 * back(span(t, T.hydrogen, T.hydrogen + 0.8), 0.8);
        h.userData.body.material.color.copy(green).lerp(grey, ease(span(t, T.hydrogen + 0.1, T.hydrogen + 0.9)));
        h.visible = t > T.table - 0.5 && t < FAM[0] + 0.6; h.scale.setScalar(Math.max(1e-4, built(t, 1, 1) * (1 - ease(span(t, FAM[0], FAM[0] + 0.5)))));
        K.popIn(lH, t, T.hydrogen + 0.6, FAM[0]);
        // each tile flies down to the bench and turns into its real sample
        objs.forEach((o, i) => {
          const t0 = FAM[i], tile = tiles[SYMS[i]], u = span(t, t0, t0 + 1.1);
          const from = V(X.col, TROW(i + 2), TZ + 0.1), to = V(ROW(i), 0, 0.3), pos = K.arc(from, to, 0.6, easeIn(u));
          tile.visible = t > T.table - 0.5 && t < t0 + 0.5; tile.position.copy(t < t0 ? from.clone().setZ(TZ) : pos);
          tile.scale.setScalar(Math.max(1e-4, built(t, i + 2, 1) * (1 - ease(span(t, t0 + 0.1, t0 + 0.5)))));
          o.visible = t > t0 + 0.1 || t > T.end - 0.1;
          if (t < t0 + 1.1) { o.position.copy(pos); o.scale.setScalar(Math.max(1e-4, lerp(0.2, 1, ease(span(u, 0.1, 0.6))))); }
          else { const k = t - t0 - 1.1; o.position.copy(to); o.position.y = 0.05 * Math.abs(Math.sin(k * 9)) * Math.exp(-k * 7); o.scale.setScalar(1); }
          K.popIn(names[i], t, t0 + 1.15, i === 5 ? T.ash : FAM[i + 1] + 0.6);
          if (notes[i]) K.popIn(notes[i], t, t0 + 1.6, i === 5 ? T.ash : FAM[i + 1] + 0.6);
        });
        // sodium: the knife comes down (lifts first), slices, the halves part, the cut face turns to us and shines … then dulls in air
        const c0 = FAM[1] + 1.6, up = Math.sin(Math.PI * span(t, c0, c0 + 0.3)) * 0.12, cut = easeIn(span(t, c0 + 0.3, c0 + 0.75));
        kn.visible = t > c0 - 0.6 && t < c0 + 2.6;
        kn.position.y = lerp(1.6, 0.62, ease(span(t, c0 - 0.6, c0))) + up - 0.6 * cut + 0.5 * ease(span(t, c0 + 1.4, c0 + 2.0)) + 1.0 * easeIn(span(t, c0 + 2.0, c0 + 2.6));
        na.userData.split(t > c0 + 0.74); na.userData.open(ease(span(t, c0 + 0.75, c0 + 1.2))); na.userData.a.rotation.y = -1.0 * ease(span(t, c0 + 0.9, c0 + 1.8));
        const tar = ease(span(t, FAM[1] + 3.8, FAM[1] + 5.8));
        shine.color.copy(fresh).lerp(dull, tar); shine.metalness = 0.3 * (1 - tar); shine.roughness = lerp(0.2, 0.95, tar); shine.clearcoat = 1 - tar;
        stars.forEach((st) => {                                            // each twinkles in turn: grows, turns a little, shrinks
          const k = ((t - c0 - 1.4 - st.userData.ph) % 1.8 + 1.8) % 1.8, on = t > c0 + 1.4 + st.userData.ph && tar < 0.5;
          const tw = Math.sin(Math.PI * clamp(k / 0.7)) * (1 - tar * 2);
          st.visible = on && k < 0.7; st.position.copy(st.userData.at); st.scale.setScalar(Math.max(1e-4, st.userData.size * tw)); st.material.rotation = 0.6 * k;
        });
        K.popIn(lSoft, t, c0 - 0.3, c0 + 1.3); K.popIn(lShiny, t, c0 + 1.5, FAM[1] + 4.2); K.popIn(lDull, t, FAM[1] + 4.6, FAM[2] + 0.4);
        objs[5].userData.update(t);
      });
    }

    // ---- 'alkali' = the ashes: twigs lying in a dish burn to ash where they lie; Na and K compounds glint in it
    {
      const x = X.ash;
      add(K.solid(new THREE.LatheGeometry([[0, 0], [1.25, 0], [1.42, 0.16], [1.36, 0.2], [1.12, 0.07], [0, 0.07]].map(([a, b]) => new THREE.Vector2(a, b)), 64), M.matte(0x55504a, 0.9)), x, 0, 0);
      const heap = add(K.ashHeap(0.8), x, 0.075, 0);                     // dish floor is at 0.07
      const ashGrey = new THREE.Color(0x77736c);
      const sticks = [[0.95, 0.06, -0.1, 0.05, 0.4], [0.85, 0.055, 0.15, -0.05, -0.9], [0.8, 0.05, 0.05, 0.18, 1.9], [0.7, 0.045, -0.25, -0.2, 2.6], [0.75, 0.05, 0.25, 0.15, -2.3]]
        .map(([len, r, dx, dz, ry], i) => { const s = add(K.stick(len, r, i * 2), x + dx, 0, dz); s.rotation.order = 'YXZ'; s.rotation.set(Math.PI / 2, ry, 0); s.userData.base = 0.07 + r + i * 0.03; return s; });
      const fire = add(K.makeFire(0xff7a22, 1.0), x + 0.02, 0.12, 0.05);
      const sm = add(K.smoke(10), x + 0.05, 0.8, 0.08);
      const glints = Array.from({ length: 8 }, (_, i) => { const a = i * 2.4, r = 0.2 + 0.45 * hash(i, 4); return add(K.glowSprite(0xfff0c0, 0.14), x + Math.cos(a) * r, 0.1 + 0.2 * (1 - r / 0.8), Math.sin(a) * r * 0.8 + 0.1); });
      const lTw = lbl('plant twigs', 0.17, '#e8d2b0', x + 0.8, 0.42, 0.55), lAsh = lbl('ash', 0.2, '#d8d4cc', x - 0.7, 0.45, 0.55, 700);
      const lNaK = lbl('Na and K compounds', 0.17, '#fff0c0', x + 0.1, 0.62, 0.45);
      const a0 = T.ash;
      beats.push((t, dt) => {
        const burn = span(t, a0 - 1.5, a0 + 3.2), toAsh = ease(span(t, a0 + 3, a0 + 6.5)), hs = ease(span(t, a0 + 3, a0 + 6.8));
        heap.scale.set(1, Math.max(1e-4, hs), 1); heap.visible = hs > 0.04;     // not a flat disc lying on the dish floor
        sticks.forEach((s, i) => {
          s.userData.burn(burn, (0.4 + 1.2 * burn) * (1 - toAsh) * (0.75 + 0.25 * Math.sin(t * 1.7 + i * 2.1)));
          s.material.color.lerp(ashGrey, toAsh * 0.85);
          s.position.y = s.userData.base + 0.28 * hs * (1 - Math.min(1, Math.hypot(s.position.x - x, s.position.z) / 0.9)); s.scale.setScalar(Math.max(1e-4, 1 - 0.85 * toAsh));
        });
        fire.scale.setScalar(Math.max(1e-4, lerp(1, 0.12, toAsh) * (1 - span(t, a0 + 6.6, a0 + 7.2)))); fire.position.y = 0.12 + 0.25 * hs; fire.userData.fx.update(dt, cam.position);
        sm.userData.update(t, 0.4 + 0.6 * span(t, a0 + 2, a0 + 5));
        glints.forEach((g, i) => { const ti = a0 + 7.2 + i * 0.12; g.visible = t > ti && t < T.water; g.material.opacity = Math.min(1, (t - ti) * 4) * (0.65 + 0.35 * Math.sin(t * 6 + i)); });
        K.popIn(lTw, t, a0 - 0.6, a0 + 3); K.popIn(lAsh, t, a0 + 5.6, T.water); K.popIn(lNaK, t, a0 + 7.8, T.water);
      });
    }

    // ---- with water they make strong alkalies (sodium); then the potassium jar beside the tank
    {
      const x = X.water, W = 2.4, D = 1.0, H = 0.8, th = 0.025;
      const pane = (w, h, d, px, py, pz) => { const m = add(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M.glass()), x + px, py, pz); m.renderOrder = 5; };
      pane(W - th - 0.006, th, D - th - 0.006, 0, th / 2 + 0.002, 0); pane(th, H, D - th - 0.004, -W / 2, H / 2, 0); pane(th, H, D - th - 0.004, W / 2, H / 2, 0);
      pane(W + th, H, th, 0, H / 2, -D / 2); pane(W + th, H, th, 0, H / 2, D / 2);
      const water = new THREE.Group(); const wb = new THREE.Mesh(new THREE.BoxGeometry(W - 0.07, 0.54, D - 0.07), M.liquid(0x5aa0d8, 0.38)); wb.position.y = 0.305;
      const wt = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.07, D - 0.07), M.liquid(0x9fd0f0, 0.45)); wt.rotation.x = -Math.PI / 2; wt.position.y = 0.585; water.add(wb, wt); add(water, x, 0, 0);
      // hung over the FRONT rim: its dry flap faces us (a thin bent sheet with paper grain), the long end hangs in the water
      const paper = add(K.paperStrip([[0.14, 0.43], [0.5, 0.435], [0.79, 0.445], [0.845, 0.47], [0.86, 0.5], [0.845, 0.53], [0.79, 0.555], [0.66, 0.565]], 0.1, 0xe07882, 0x4a6fd0), x + 0.85, 0, 0);
      paper.rotation.y = 0.12;
      const lWater = lbl('water', 0.19, '#cfe6ff', x - 0.6, 0.3, 0.6), lRed = lbl('red litmus paper', 0.085, '#f4b9be', x + 0.85, 0.98, 0.55), lBlue = lbl('turns blue: an alkali!', 0.085, '#b9d0ff', x + 0.85, 0.98, 0.55);
      const naL = add(K.lump(0.1, M.metal(0xdfe3e8, 0.22), 7, 0.75), x - 1.6, 1.8, 0.2);
      const lNa = lbl('sodium', 0.18, '#ffffff', 0, 0, 0);
      const sp = add(K.splash(0xffffff, 0.6), x - 0.5, 0.585, 0.1);
      const ripples = Array.from({ length: 5 }, () => { const r = add(new THREE.Mesh(new THREE.TorusGeometry(1, 0.03, 6, 40), M.bubble())); r.rotation.x = Math.PI / 2; return r; });
      const spark = add(K.glowSprite(0xfff4d0, 0.3));
      const kj = add(new THREE.Group(), JAR.x, JAR.y, JAR.z); kj.add(K.vial()); { const oil = K.liquid(0.14, 0.4, 0xd9a84a, 0.32); oil.position.y = 0.03; kj.add(oil); const m = K.lump(0.085, M.metal(0xcfd4dc, 0.22), 6); m.position.y = 0.1; kj.add(m); }
      const lKj = lbl('potassium (K)', 0.1, '#ffffff', JAR.x + 0.42, 0.62, JAR.z, 700);
      const w0 = T.water + 1.4;
      const path = [[-0.5, 0.1], [-0.15, -0.2], [-0.3, 0.22], [0.15, 0.05], [0.35, -0.18], [0.62, -0.12], [0.72, -0.15]].map(([a, b]) => V(x + a, 0.61, b));
      const curve = new THREE.CatmullRomCurve3(path), start = V(x - 1.6, 1.8, 0.2);
      const naAt = (tt) => tt < w0 ? start : tt < w0 + 0.55 ? K.arc(start, path[0], 0.35, (tt - w0) / 0.55) : curve.getPointAt(Math.min(1, ease(span(tt, w0 + 0.6, w0 + 3.9))));
      beats.push((t) => {
        naL.visible = t > w0 - 0.6 && t < T.dive; naL.position.copy(naAt(t)); naL.rotation.y = t * 4 * span(t, w0 + 0.6, w0 + 3.9);
        const life = 1 - 0.75 * span(t, w0 + 0.6, w0 + 3.9); naL.scale.setScalar(Math.max(1e-4, t > w0 + 3.9 ? life * (1 - span(t, w0 + 3.9, w0 + 4.3)) : life));
        lNa.position.copy(naL.position).add(V(0, 0.2, 0.1)); K.popIn(lNa, t, w0 - 0.5, w0 + 3.6);
        sp.userData.update(t - w0 - 0.55);
        ripples.forEach((r, k) => {                                       // small, faint, short-lived rings where it darts
          const age = ((t - w0 - 0.6) % 0.16 + 0.16) % 0.16 + k * 0.16, born = t - age, ok = born > w0 + 0.6 && born < w0 + 4;
          r.visible = ok; if (!ok) return; r.position.copy(naAt(born)); r.position.y = 0.6 + k * 0.003; r.scale.setScalar(0.02 + age * 0.15); r.material.uniforms.uEdge.value = 0.7 * (1 - age / 0.8);
        });
        spark.visible = t > w0 + 0.6 && t < w0 + 4.1; spark.position.copy(naL.position).y += 0.05; spark.material.opacity = 0.5 + 0.4 * Math.sin(t * 47);
        paper.userData.wet(0.56 * ease(span(t, w0 + 5.0, w0 + 7.2)));        // the blue soaks up from the water, a little above the water line
        K.popIn(lWater, t, T.water + 0.4, w0); K.popIn(lRed, t, T.water + 0.9, w0 + 6.0); K.popIn(lBlue, t, w0 + 6.4, T.dive + 0.8);
        K.popIn(lKj, t, T.dive - 0.2, T.dive + 1.6);
      });
    }

    // ================================================================ ACT 3 · inside potassium
    {
      // the wall of potassium atoms we arrive in (grey, like the lump we pushed into); one of them is our atom
      const PIT = 3.3, wall = [];
      for (let i = -4; i <= 4; i++) for (let j = -3; j <= 3; j++) for (let k = 0; k <= 1; k++) if (i || j) wall.push(V(AT.x + i * PIT + (j % 2) * PIT / 2 * k, AT.y + j * PIT, -k * PIT));
      const atomMat = M.gloss(0xa9a796);                                 // the same warm grey as the lump seen through its oil
      const wallM = new THREE.InstancedMesh(new THREE.SphereGeometry(1.5, 40, 24), atomMat, wall.length); add(wallM);
      const me = add(new THREE.Mesh(new THREE.SphereGeometry(1.5, 48, 32), atomMat.clone()), AT.x, AT.y, AT.z); me.material.transparent = true; me.material.depthWrite = false;
      const lAtoms = lbl('potassium atoms', 0.42, '#ffffff', AT.x, AT.y + 0.85, 4.5, 700);
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion();
      const A = K.atom([2, 8, 8, 1], 19, 20, 0.45, 0.3); add(A.group, AT.x, AT.y, AT.z);
      const outer = A.electrons.find((e) => e.shell === 3), gold = M.glow(0xffc04d, 2.8);
      outer.e.material = gold; outer.e.children[0].material = outer.e.children[0].material.clone(); outer.e.children[0].material.color.set(0xffc04d);
      const nameK = lbl('K', 0.32, '#ffffff', AT.x, AT.y + 1.62, 0, 700), kplus = lbl('K⁺', 0.34, '#ffffff', AT.x, AT.y + 1.62, 0, 700);
      const sub = lbl('4s¹', 0.2, '#ffd27a', 0, 0, 0);
      const lP = lbl('19 protons (+)', 0.24, '#ffb0a0', AT.x - 1.0, AT.y + 1.25, 0.5), lE = lbl('18 electrons (−)', 0.24, '#a8ccff', AT.x, AT.y - 1.35, 0.6);
      const park = V(AT.x + 1.95, AT.y + 0.55, 0.5);
      const lFree = lbl('free electron', 0.22, '#ffd27a', park.x, park.y + 0.3, park.z);
      const tie = add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(0, 0, 0), V(1, 0, 0)]), new THREE.LineBasicMaterial({ color: 0xffc04d, transparent: true, opacity: 0, toneMapped: false })));
      const C = K.atom([2, 8, 7], 17, 18, 0.45, 0.3); add(C.group, CL, AT.y, 0);
      C.electrons.filter((e) => e.shell === 2).forEach((e, k) => { e.a0 = k / 8 * Math.PI * 2; });
      const cR = C.electrons.find((e) => e.shell === 2), cTilt = C.rings[2];
      const nameCl = lbl('Cl', 0.32, '#ffffff', CL, AT.y + 1.55, 0, 700), clMinus = lbl('Cl⁻', 0.34, '#ffffff', CL, AT.y + 1.55, 0, 700);
      const flyer = add(new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), gold)); flyer.add(K.glowSprite(0xffc04d, 0.4));
      const trail = Array.from({ length: 10 }, () => add(K.glowSprite(0xffc04d, 0.16)));
      const kIon = add(K.ion(0.5, 0xe58a3a, '+'), AT.x, AT.y, 0), clIon = add(K.ion(0.8, 0x4fc46a, '−'), CL, AT.y, 0);
      const kcl = lbl('KCl', 0.36, '#f6d48f', MID, AT.y + 1.3, 0, 700);
      // K₂O: two neutral K and a neutral O; each K's electron flies over, THEN its + appears; O gets 2− when both arrived
      const oIon = add(K.ion(0.62, 0xd9534a, '2−'), OX.x, OX.y, 0);
      const k2 = [add(K.ion(0.5, 0xe58a3a, '+'), OX.x - 1.7, OX.y + 0.3, 0), add(K.ion(0.5, 0xe58a3a, '+'), OX.x + 1.7, OX.y + 0.3, 0)];
      const e2 = k2.map(() => { const e = add(new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 10), gold)); e.add(K.glowSprite(0xffc04d, 0.35)); return e; });
      const k2o = lbl('K₂O', 0.36, '#f6d48f', OX.x, OX.y + 1.3, 0, 700), lO = lbl('oxygen (group VIA)', 0.22, '#ffd0c8', OX.x, OX.y - 0.95, 0.3);
      const lClG = lbl('chlorine (group VIIA)', 0.22, '#bff0c8', CL, AT.y - 1.45, 0.5);
      const lK2 = k2.map((k) => lbl('K', 0.22, '#ffffff', k.position.x, OX.y - 0.55, 0.3, 700));
      let hist = [], lastT = -1;
      beats.push((t) => {
        // arriving: the wall is visible from the cut; our atom's grey sphere melts away to show its shells, the others drift off
        const wallOn = t > T.atom - 0.01 && t < T.rev + 1.6, gone = ease(span(t, T.rev - 0.6, T.rev + 1.4));
        wallM.visible = wallOn;
        if (wallOn) { wall.forEach((p, i) => { const d = p.clone().sub(AT); const s = Math.max(1e-4, 1 - gone); m4.compose(AT.clone().addScaledVector(d, 1 + 0.6 * gone), q, V(s, s, s)); wallM.setMatrixAt(i, m4); }); wallM.instanceMatrix.needsUpdate = true; }
        const melt = span(t, T.rev - 1.8, T.rev - 0.3);
        me.visible = t > T.atom - 0.01 && melt < 1; me.material.opacity = 1 - melt; me.scale.setScalar(1 + 0.15 * melt);
        K.popIn(lAtoms, t, T.atom + 0.7, T.rev - 1.4);
        const inAtom = t > T.atom - 0.01 && t < T.ionsK + 1.4;
        A.group.visible = inAtom && t > T.rev - 1.8; C.group.visible = inAtom && t > T.free; A.update(t); C.update(t);
        A.group.rotation.y = C.group.rotation.y = 0.15 * Math.sin(t * 0.2);
        K.popIn(nameK, t, T.rev + 0.3, T.free + 0.3); K.popIn(nameCl, t, T.give + 0.8, T.give + 2.1);
        // the outer electron: pulled further out, breaks free and drifts away on its own (LOCKED: the v8 detach the user praised)
        const pull = ease(span(t, T.tug + 0.3, T.free)), freeK = span(t, T.free, T.free + 0.6);
        outer.free = t > T.tug + 0.3;
        if (outer.free) { const a = outer.a0 + (T.tug + 0.3) * outer.w + 0.2 * pull, R = outer.R * (1 + 0.25 * pull + 0.25 * ease(freeK)); outer.e.position.set(Math.cos(a) * R, 0.05 * Math.sin(t * 3), Math.sin(a) * R); }
        outer.e.scale.setScalar(1 + 0.5 * Math.sin(Math.PI * span(t, T.outer, T.outer + 0.8)));
        A.group.updateMatrixWorld(true);
        const orbitW = outer.e.getWorldPosition(V(0, 0, 0)), nw = A.group.getWorldPosition(V(0, 0, 0));
        const ew = orbitW;
        outer.e.visible = t < T.give + 0.2;
        sub.position.copy(orbitW).add(V(0.14, 0.22, 0)); K.popIn(sub, t, T.outer + 0.6, T.tug);
        tie.geometry.setFromPoints([nw, orbitW]); tie.visible = inAtom; tie.material.opacity = 0.8 * span(t, T.tug, T.tug + 0.3) * (1 - span(t, T.free - 0.15, T.free));
        A.rings[3].children[0].material.opacity = 0.55 * (1 - span(t, T.free, T.free + 0.8));
        K.popIn(kplus, t, T.free + 0.6, T.ionsK + 0.2); K.popIn(lP, t, T.free + 0.7, T.give); K.popIn(lE, t, T.free + 1.1, T.give);
        lFree.position.copy(ew).add(V(0, 0.3, 0)); K.popIn(lFree, t, T.free + 1.0, T.give + 0.2);
        // it flies to chlorine (the camera follows it), and joins the outer shell
        C.group.updateMatrixWorld(true);
        const fu = ease(span(t, T.give + 0.2, T.give + 2.2)), sa = 7 / 8 * Math.PI * 2 + t * cR.w;
        const slot = cTilt.localToWorld(V(Math.cos(sa) * cR.R, 0, Math.sin(sa) * cR.R));
        flyer.visible = t > T.give + 0.2 && t < T.ionsK + 0.4; flyer.position.copy(K.arc(ew, slot, 0.7, fu));
        if (t < lastT || Math.abs(t - lastT) > 0.2) hist = []; lastT = t;
        hist.unshift(flyer.position.clone()); hist.length = Math.min(hist.length, 30);
        trail.forEach((s, i) => { s.position.copy(hist[Math.min(hist.length - 1, i * 2)]); s.visible = flyer.visible && fu > 0.02 && fu < 0.99; s.material.opacity = 0.6 * (1 - i / trail.length); });
        K.popIn(lClG, t, T.give + 0.9, T.ionsK + 0.2);
        K.popIn(clMinus, t, T.give + 2.45, T.ionsK + 0.2);   // only after 'Cl' has fully gone (swaps never overlap)
        // atoms → ions: each atom shrinks INTO its ion ball (same place), then the opposite charges pull together
        const io = ease(span(t, T.ionsK, T.ionsK + 1.2));
        A.group.scale.setScalar(Math.max(1e-4, 1 - 0.75 * io)); C.group.scale.setScalar(Math.max(1e-4, 1 - 0.6 * io));
        kIon.visible = clIon.visible = t > T.ionsK && t < T.crystal - 0.2;
        const ib = Math.max(1e-4, ease(span(t, T.ionsK + 0.3, T.ionsK + 1.3))) * (1 - ease(span(t, T.oxy - 0.6, T.oxy - 0.2)));
        kIon.scale.setScalar(Math.max(1e-4, ib)); clIon.scale.setScalar(Math.max(1e-4, ib));
        const pull2 = easeIn(span(t, T.ionsK + 1.5, T.ionsK + 2.5)), gap = 1.3;
        const jolt = t > T.ionsK + 2.5 ? 0.05 * Math.exp(-(t - T.ionsK - 2.5) * 6) * Math.sin((t - T.ionsK - 2.5) * 18) : 0;
        kIon.position.x = lerp(AT.x, MID - gap / 2, pull2) - jolt; clIon.position.x = lerp(CL, MID + gap / 2, pull2) + jolt;
        A.group.position.x = kIon.position.x; C.group.position.x = clIon.position.x;
        K.popIn(kcl, t, T.ionsK + 2.7, T.oxy - 0.3);
        // K₂O
        const o0 = T.oxy + 1.2;
        [oIon, ...k2].forEach((o) => { o.visible = t > T.oxy && t < T.crystal + 0.4; o.scale.setScalar(Math.max(1e-4, back(span(t, T.oxy + 0.1, T.oxy + 0.6)) * (1 - ease(span(t, T.crystal - 0.3, T.crystal + 0.3))))); });
        e2.forEach((e, i) => {
          const home = k2[i].position.clone().add(V(Math.cos(t * 2 + i * 3) * 0.62, 0.1, Math.sin(t * 2 + i * 3) * 0.62));
          const u = ease(span(t, o0 + i * 0.7, o0 + 1.3 + i * 0.7)); e.visible = t > T.oxy + 0.4 && u < 0.98 && t < T.crystal;
          e.position.copy(K.arc(home, OX, 0.6, u));
          k2[i].userData.sign.visible = u > 0.97;                           // + only once its electron has gone
        });
        oIon.userData.sign.visible = t > o0 + 2.0;
        const snap = easeIn(span(t, o0 + 2.4, o0 + 3.2));
        k2[0].position.x = lerp(OX.x - 1.7, OX.x - 1.02, snap); k2[1].position.x = lerp(OX.x + 1.7, OX.x + 1.02, snap);
        k2[0].position.y = k2[1].position.y = lerp(OX.y + 0.3, OX.y + 0.15, snap);
        lK2.forEach((l, i) => { l.position.x = k2[i].position.x; K.popIn(l, t, T.oxy + 0.5, o0 + 2.4); });
        K.popIn(k2o, t, o0 + 3.3, T.crystal - 0.2); K.popIn(lO, t, T.oxy + 0.5, o0 + 2.4);
      });
    }

    // ================================================================ ACT 4 · never free
    {
      // the crystal GROWS from one K⁺ outward: each new ion comes in to its neighbour of opposite charge, in straight rows
      // (seen face-on, so the + − + − pattern reads); when it is complete it turns to show it is a cube …
      const lat = [], TILT = new THREE.Euler(0.3, 0.55, 0), qT = new THREE.Quaternion().setFromEuler(TILT), qNow = new THREE.Quaternion();
      for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) {
        const isK = ((i + j + k) % 2 + 2) % 2 === 0, s = add(K.solid(new THREE.SphereGeometry(isK ? 0.17 : 0.27, 24, 16), M.gloss(isK ? 0xe58a3a : 0x4fc46a), { outline: false }));
        const home = V(i * 0.55, j * 0.55, k * 0.55);
        lat.push({ s, home, from: home.clone().multiplyScalar(2.6).add(V(0, 0, 0.6)), d: Math.abs(i) + Math.abs(j) + Math.abs(k) + 0.01 * ((k + 1) * 9 + (j + 1) * 3 + i + 1) });
      }
      lat.sort((a, b) => a.d - b.d).forEach((o, r) => { o.t0 = T.crystal + 0.3 + r * 0.12; });
      const saltMat = () => new THREE.MeshPhysicalMaterial({ color: 0xf4f2ee, emissive: 0x2a2a2a, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.1 });
      const cubeMat = saltMat(); cubeMat.transparent = true; cubeMat.depthWrite = false;
      const cube = add(new THREE.Mesh(new THREE.BoxGeometry(1.75, 1.75, 1.75), cubeMat), CX.x, CX.y, 0); cube.renderOrder = 6;
      const lCr = lbl('KCl crystal (salt)', 0.3, '#f6d48f', CX.x, CX.y + 1.4, 0, 700);
      // … one crystal of a potassium salt deposit (cube 0 is that same crystal); a few Rb / Cs grains among them
      const m4 = new THREE.Matrix4(), c = new THREE.Color();
      const nc = 110, cubes = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), saltMat(), nc); cubes.castShadow = cubes.receiveShadow = true;
      const pink = [], P0 = V(X.deposit + 0.1, 0.1, 0.95);
      for (let i = 0; i < nc; i++) {
        const a = hash(i, 1) * Math.PI * 2, rr = 0.25 + Math.sqrt(hash(i, 2)) * 0.75, h = 0.42 * (1 - rr * rr), s = 0.07 + hash(i, 3) * 0.1;
        const p = i === 0 ? P0 : V(X.deposit + Math.cos(a) * rr, s / 2 + hash(i, 4) * h, Math.sin(a) * rr * 0.75);
        m4.compose(p, new THREE.Quaternion().setFromEuler(i === 0 ? TILT : new THREE.Euler(0, hash(i, 5) * 3, hash(i, 6) * 0.4)), V(1, 1, 1).multiplyScalar(i === 0 ? 0.2 : s));
        cubes.setMatrixAt(i, m4); const special = i % 19 === 7; cubes.setColorAt(i, c.set(special ? 0xb070e0 : 0xffffff)); if (special) pink.push(p);
      }
      add(cubes);
      const lDep = lbl('KCl', 0.04, '#f6d48f', P0.x + 0.17, P0.y + 0.05, P0.z + 0.05, 700);
      const pg = pink.map((p) => { const s = add(K.glowSprite(0xe0a8ff, 0.35)); s.position.copy(p).y += 0.06; return s; });
      const lRbCs = lbl('Rb, Cs', 0.2, '#e8c8ff', pink[1].x + 0.35, pink[1].y + 0.22, pink[1].z + 0.2), lDeposit = lbl('potassium salt deposit', 0.17, '#e6e2da', X.deposit, 1.02, 0.0);
      // the crust: a scoop of it in a glass box — 1000 grains, 24 of them Na / K
      const n = 1000, grains = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.03, 0), M.matte(0xffffff, 0.9), n);
      grains.castShadow = grains.receiveShadow = true; const special = [];
      for (let i = 0; i < n; i++) {
        const gx = (i % 40) / 39 - 0.5, gz = Math.floor(i / 40) / 24 - 0.5;
        m4.compose(V(X.crust + gx * 2.5 + (hash(i) - 0.5) * 0.04, 0.05 + hash(i, 7) * 0.02, gz * 1.4 + (hash(i, 2) - 0.5) * 0.04), new THREE.Quaternion().setFromEuler(new THREE.Euler(hash(i, 3) * 6, hash(i, 4) * 6, 0)), V(1, 1, 1).multiplyScalar(0.8 + hash(i, 5) * 0.6));
        grains.setMatrixAt(i, m4); grains.setColorAt(i, c.setHSL(0.07 + hash(i, 6) * 0.04, 0.25, 0.22 + hash(i, 8) * 0.18));
        if (hash(i, 9) < 0.03 && special.length < 24) special.push(i);
      }
      add(grains);
      { const BW = 2.75, BD = 1.65, BH = 0.22, th = 0.02, pane = (w, h, d, px, py, pz) => { const m = add(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M.glass()), X.crust + px, py, pz); m.renderOrder = 5; };
        pane(BW - th - 0.006, th, BD - th - 0.006, 0, th / 2 + 0.002, 0); pane(th, BH, BD - th - 0.004, -BW / 2, BH / 2, 0); pane(th, BH, BD - th - 0.004, BW / 2, BH / 2, 0);
        pane(BW + th, BH, th, 0, BH / 2, -BD / 2); pane(BW + th, BH, th, 0, BH / 2, BD / 2); }
      const spots = special.map((i) => { grains.getMatrixAt(i, m4); const s = add(K.glowSprite(0xffcf6a, 0.14)); s.position.setFromMatrixPosition(m4).y += 0.03; return s; });
      const lCrust = lbl('a scoop of the earth’s crust: 1000 grains', 0.15, '#e0d2c0', X.crust, 0.02, 1.25), pct = lbl('24 of them: Na and K', 0.2, '#ffd27a', X.crust, 0.42, -0.95, 700);
      // lithium: spodumene crystals (long pale-pink prisms on rock), with lithium inside
      const rk = add(K.rock(0.55, 0x8a8078, 0x5d555e, 3), X.rock, 0.12, 0); rk.scale.set(1.3, 0.45, 0.9);
      const spoM = new THREE.MeshPhysicalMaterial({ color: 0xe9bfd6, roughness: 0.2, clearcoat: 1, transparent: true, opacity: 0.9 });
      const prisms = [[0, 0.95, 0, 0, 0.12], [0.32, 0.7, 0.1, -0.35, 0.1], [-0.35, 0.75, -0.05, 0.4, 0.1], [0.15, 0.55, 0.3, -0.15, 0.08], [-0.15, 0.6, -0.3, 0.2, 0.085], [0.55, 0.45, -0.15, -0.6, 0.075]].map(([dx, len, dz, tilt, r], i) => {
        const g = new THREE.CylinderGeometry(r, r * 1.1, len, 6, 1, true); g.translate(0, len / 2, 0);   // open: the tip's base is the only cap (no two caps in one plane)
        const tip = new THREE.ConeGeometry(r, r * 1.6, 6); tip.translate(0, len + r * 0.8, 0);
        const grp = new THREE.Group(); grp.add(K.solid(g, spoM), K.solid(tip, spoM)); grp.rotation.z = tilt; grp.rotation.x = (hash(i, 2) - 0.5) * 0.5;
        add(grp, X.rock + dx, 0.2, dz); return grp;
      });
      const liDots = Array.from({ length: 7 }, (_, i) => { const p = prisms[i % prisms.length]; const s = K.glowSprite(0xfff4fb, 0.12); s.position.set(0, 0.15 + 0.12 * (i % 3), 0); p.add(s); return s; });
      const lSpo = lbl('spodumene (a mineral)', 0.19, '#ffffff', X.rock, 1.45, 0, 700), fSpo = lbl('LiAl(SiO₃)₂', 0.2, '#f6d48f', X.rock, 1.2, 0), lLi = lbl('lithium inside', 0.15, '#fff0f8', X.rock + 0.95, 0.75, 0.3);
      // francium: made in a lab — a particle beam hits a gold target; francium atoms come out and are caught in a glass trap
      const lab = X.lab;
      const pipe = add(K.solid(new THREE.CylinderGeometry(0.09, 0.09, 1.9, 24), M.metal(0x8c939e, 0.35)), lab - 1.2, 0.45, 0); pipe.rotation.z = Math.PI / 2;
      const stand1 = add(K.solid(new THREE.BoxGeometry(0.12, 0.36, 0.2), M.matte(0x3a3f4a)), lab - 1.6, 0.18, 0), stand2 = add(K.solid(new THREE.BoxGeometry(0.12, 0.36, 0.2), M.matte(0x3a3f4a)), lab - 0.8, 0.18, 0);
      const target = add(K.solid(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 32), M.metal(0xd8b04a, 0.25)), lab - 0.15, 0.45, 0); target.rotation.z = Math.PI / 2;
      add(K.solid(new THREE.BoxGeometry(0.08, 0.3, 0.12), M.matte(0x3a3f4a)), lab - 0.15, 0.15, 0);
      const beam = Array.from({ length: 6 }, () => add(K.glowSprite(0x8fd0ff, 0.16)));
      const trap = add(frTrap(1.7), lab + 0.9, 0, 0);
      const flyFr = Array.from({ length: 3 }, () => add(K.glowSprite(0xffa040, 0.14)));
      const lBeam = lbl('particle beam', 0.16, '#cfe6ff', lab - 1.2, 0.8, 0.2), lGold = lbl('gold target', 0.16, '#f3dca0', lab - 0.15, 0.85, 0.2);
      const fr = lbl('francium atoms', 0.2, '#ffd8a8', lab + 0.9, 1.05, 0.2, 700), lRad = lbl('radioactive: gone in minutes', 0.14, '#e6e2da', lab + 0.9, 0.85, 0.2);
      beats.push((t) => {
        qNow.identity().slerp(qT, ease(span(t, T.crystal + 4.4, T.crystal + 5.8)));
        lat.forEach(({ s, home, from, t0 }) => {
          const u = ease(span(t, t0, t0 + 0.5));
          s.visible = t > t0 && t < T.deposit - 0.4; s.position.lerpVectors(from, home, u).applyQuaternion(qNow).add(CX);
          s.scale.setScalar(Math.max(1e-4, lerp(0.4, 1, u)));
        });
        cube.visible = t > T.crystal + 3.9 && t < T.deposit; cube.scale.setScalar(Math.max(1e-4, ease(span(t, T.crystal + 3.9, T.crystal + 4.5)))); cube.quaternion.copy(qNow);
        cubeMat.opacity = lerp(0.45, 0.97, ease(span(t, T.deposit - 1.6, T.deposit - 0.5)));
        K.popIn(lCr, t, T.crystal + 4.6, T.deposit);
        K.popIn(lDep, t, T.deposit + 0.2, T.deposit + 3.2);
        pg.forEach((s, i) => { const ti = T.deposit + 4.0 + i * 0.25; s.visible = t > ti; s.material.opacity = Math.min(1, (t - ti) * 5) * (0.7 + 0.3 * Math.sin(t * 6 + i)); });
        K.popIn(lDeposit, t, T.deposit + 2.6); K.popIn(lRbCs, t, T.deposit + 4.8);
        spots.forEach((s, i) => { const ti = T.crust + 2.4 + i * 0.06; s.visible = t > ti; s.material.opacity = Math.min(1, (t - ti) * 5) * (0.75 + 0.25 * Math.sin(t * 5 + i)); });
        K.popIn(lCrust, t, T.crust + 1.0); K.popIn(pct, t, T.crust + 3.4);
        prisms.forEach((p, i) => { const s = Math.max(1e-4, back(span(t, T.rock + 0.2 + i * 0.15, T.rock + 0.7 + i * 0.15))); p.scale.set(1, s, 1); p.visible = t > T.rock + 0.2; });
        liDots.forEach((g, i) => { const ti = T.rock + 2.6 + i * 0.12; g.visible = t > ti; g.material.opacity = Math.min(1, (t - ti) * 4) * (0.6 + 0.4 * Math.sin(t * 6 + i)); });
        K.popIn(lSpo, t, T.rock + 1.0); K.popIn(fSpo, t, T.rock + 2.0); K.popIn(lLi, t, T.rock + 3.0);
        // the lab: pulses run down the beam, hit the gold, francium atoms fly into the trap
        beam.forEach((s, i) => { const u = ((t * 1.4 + i / beam.length) % 1); s.visible = t > T.fr + 0.6; s.position.set(lab - 2.1 + 1.9 * u, 0.45, 0); s.material.opacity = 0.9 * Math.sin(Math.PI * u); });
        flyFr.forEach((s, i) => { const t0 = T.fr + 1.6 + i * 1.1, u = ease(span(t, t0, t0 + 0.9)); s.visible = t > t0 && u < 1; s.position.copy(K.arc(V(lab - 0.1, 0.45, 0), V(lab + 0.9, 0.51, 0), 0.25, u)); });
        trap.userData.update(t, [0, 1, 2].filter((i) => t > T.fr + 2.5 + i * 1.1).length);
        K.popIn(lBeam, t, T.fr + 0.8, T.end - 0.3); K.popIn(lGold, t, T.fr + 1.2, T.end - 0.3); K.popIn(fr, t, T.fr + 2.6, T.end - 0.3); K.popIn(lRad, t, T.fr + 3.6, T.end - 0.3);
      });
    }

    // ================================================================ END · the family; each gives up its one loose electron
    {
      const syms = SYMS.map((s, i) => lbl(s, 0.4, '#ffffff', ROW(i), 1.22, 0.3, 700));
      const tags = ['in oil', 'soft · in oil', 'in oil', 'in glass', 'in glass', 'lab-made'].map((s, i) => lbl(s, 0.17, '#cfd6e2', ROW(i), 0.95, 0.3));
      const es = SYMS.map(() => { const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 10), M.glow(0xffc04d, 2.8)), K.glowSprite(0xffc04d, 0.32)); return add(g); });
      beats.push((t) => {
        syms.forEach((l, i) => K.popIn(l, t, T.end + 0.8 + i * 0.25));
        tags.forEach((l, i) => K.popIn(l, t, T.end + 1.3 + i * 0.25));
        es.forEach((e, i) => {
          const t0 = T.end + 3.2 + i * 0.45, u = back(span(t, t0, t0 + 0.6), 1.2); e.visible = t > t0;
          const a = t * 2.2 + i;
          e.position.set(ROW(i) + 0.32 * Math.cos(a) * u, lerp(0.35, 1.48, u) + 0.04 * Math.sin(t * 3 + i), 0.3 + 0.12 * Math.sin(a) * u);
        });
      });
    }

    return (t, dt) => { for (const b of beats) b(t, dt); };

    // a small glass trap on a stand with francium atoms glowing in it (row sample and lab)
    function frTrap(s) {
      const g = new THREE.Group();
      const base = K.solid(new THREE.CylinderGeometry(0.16 * s, 0.18 * s, 0.04 * s, 32), M.metal(0x7d848f, 0.35)); base.position.y = 0.02 * s;
      const post = K.solid(new THREE.CylinderGeometry(0.02 * s, 0.02 * s, 0.14 * s, 8), M.metal(0x9aa1ab, 0.3)); post.position.y = 0.1 * s;
      const sph = new THREE.Mesh(new THREE.SphereGeometry(0.15 * s, 32, 20), M.glass()); sph.position.y = 0.3 * s; sph.renderOrder = 5;
      const specks = Array.from({ length: 3 }, () => K.glowSprite(0xffa040, 0.09 * s));
      g.add(base, post, sph, ...specks);
      g.userData.update = (t, shown = 3) => specks.forEach((p, i) => { p.visible = i < shown; const a = t * (1.3 + i * 0.4) + i * 2.1; p.position.set(Math.cos(a) * 0.07 * s, 0.3 * s + Math.sin(a * 1.3) * 0.05 * s, Math.sin(a) * 0.07 * s); p.material.opacity = 0.7 + 0.3 * Math.sin(t * 9 + i); });
      return g;
    }
  },
};
