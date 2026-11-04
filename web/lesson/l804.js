// Lesson 804 v2 · Alkali metals react (book pp. 224–225: Table 8.1 + Scientific Information), rebuilt with EVERY
// rule of the skill (v1 rejected: camera, animation, not understood, all materials alike; backups/l804_v1.js).
// STORY SPINE (the book's own argument): "Order of reactivity: lithium < sodium < potassium".
//   Open   three oil jars (amber oil, silver metal): "kept under oil. Which one reacts the most? Three tests."
//          Tongs lift a lithium piece out and up out of the frame → cut on the motion → it comes down into test 1.
//   Test   (air, water, chlorine; each the same shape, so the student learns how to read it):
//          wide: three identical set-ups side by side on a wooden bench → close on each metal in turn (tongs bring
//          it in, it drops, it reacts: the action fills the frame, camera steady with a slow push) → wide again:
//          all three results side by side, the book's word on each ("quickly · very quickly · explodes!") and
//          "<" signs appear between the names: the comparison is SEEN → the equation is built from the labels
//          (lithium first, then "same pattern": only the metal's tokens change).
//          Air: hot steel dish on a tripod over a burner → red / bright yellow / violent lilac flame → white oxide.
//          Water: blue water in beakers → Li floats and fizzes (keeps going), Na melts into a racing ball, K bursts
//          into lilac flame and explodes → hydroxide stays in the water, the bubbles are hydrogen.
//          Chlorine: yellow-green gas jars → bright flame, white smoke settles as a white solid (chloride).
//   Box    potassium on a watch glass in damp air dulls at once → back under kerosene (the book's photo b).
//   End    the opening picture again: lithium < sodium < potassium on the jars. Point: same order in every test.
// Q a student would ask → where the SCREEN answers it: "why tongs/oil?" → the box at the end; "which is most?" →
// the < signs between the names after each test; "what is H₂?" → label on the bubbles; "where is the hydroxide?" →
// label in the water; "what is the white stuff?" → label on the heap / layer.
// Memorize-only (→ game Metal Reactions Lab › Products): the 9 equations, atomic numbers 3, 11, 19.
import * as THREE from 'three';
import * as K from './kit.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const QS = new URLSearchParams(location.search);
const BAKED = QS.get('look') !== 'old', ROT = +(QS.get('rot') || 0), ENV = 0.25;   // ENV = the photo's strength in the bake (scripts/bake_set.py ENV)   // user 2026-10-13: every station Cycles-baked, standing on a studio photo's floor (?look=old = before)
if (BAKED) Object.assign(K.LOOK, { halo: 2, photo: true });             // bright photo studio: real-reflection glass, stronger label halo
const { M, span, ease, easeIn, back, lerp, hash } = K;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

const TAN = Math.tan(16 * Math.PI / 180), ASP = 1.6, DIR = [0, 0.5, 1];   // the camera looks down ~27° onto the bench
function S(t, look, w, h, dir = DIR, e) {
  h *= 1.14; look = [look[0], look[1] + 0.05 * h, look[2]];        // headroom: the caption floats just above the subject (capNear)
  const d = V(...dir).normalize(), dist = Math.max(h / 2 / TAN, w / 2 / (TAN * ASP)) * 1.1;
  return [t, V(...look).addScaledVector(d, dist).toArray(), look, undefined, e, { look, w, h, dir, dock: 0 }];   // fit: the engine refits it to the real screen
}

const SX = { jars: 0, air: 12, water: 24, cl: 36 };                   // stations far apart: a shot never sees another
const VX = (sx, i) => sx + (i - 1) * 1.22, JX = (i) => (i - 1) * 0.55;
const TL = 39.6;                                                      // one test
const T = { air: 6.8 }; T.water = T.air + TL; T.cl = T.water + TL; T.kero = T.cl + TL; T.end = T.kero + 10.6; T.done = T.end + 7.5;
const MT = (t0, i) => t0 + i * 7;                                   // metal i's turn: the tongs come in
const LANDT = (t0, i) => MT(t0, i) + 1.7;                             // let go at +1.4, lands 0.3 s later
const WIDE = (t0) => t0 + 20.3, RANKT = (t0) => t0 + 21.8, LT = (t0) => t0 + 23.4, BS = (t0) => [t0 + 25.8, t0 + 33.4, t0 + 36.0];   // the formula board: build, then sodium, potassium
const BY = 2.5, BZ = -0.1;                                           // the board hangs above the bench (the camera tilts up to it)
const MET = [
  { s: 'Li', n: 'lithium', N: 'Lithium', fl: 0xff3340 },
  { s: 'Na', n: 'sodium', N: 'Sodium', fl: 0xffc21a },
  { s: 'K', n: 'potassium', N: 'Potassium', fl: 0xb56cff },
];
const IGN_AIR = [1.3, 1.0, 0.6], IGN_CL = [0.9, 0.7, 0.4];          // seconds after landing: the more reactive, the sooner

// ---------------------------------------------------------------- captions (plain words, one idea each)
const C = [], cap = (a, b, s) => C.push([a, b, s]);
cap(0.3, 3.2, 'Three alkali metals, kept under oil');
cap(3.2, T.air, 'Which one reacts the most? Three tests');
function testCaps(t0, title, lines, ask, count) {
  cap(t0, MT(t0, 0) + 1.7, title);
  lines.forEach(([a, b, c], i) => {
    const L = LANDT(t0, i), nx = i < 2 ? MT(t0, i + 1) : WIDE(t0);
    cap(i ? MT(t0, i) : MT(t0, 0) + 1.7, L + a[0], a[1]); cap(L + a[0], L + b[0], b[1]); cap(L + b[0], nx, c);
  });
  const B = BS(t0);
  cap(WIDE(t0), LT(t0), ask); cap(LT(t0), B[0], 'lithium < sodium < potassium');
  cap(B[0], B[0] + 1.9, 'The equation, in words first'); cap(B[0] + 1.9, B[0] + 2.9, 'Each ball is one atom');
  cap(B[0] + 2.9, B[0] + 4.0, count); cap(B[0] + 4.0, B[0] + 5.7, 'The atoms swap partners');
  cap(B[0] + 5.7, B[1], 'Count them: no atom is lost'); cap(B[1], B[2], 'Same pattern with sodium'); cap(B[2], t0 + TL, 'And with potassium');
}
testCaps(T.air, 'Test 1: heat each one in air', [
  [[IGN_AIR[0], 'Lithium on a hot dish'], [IGN_AIR[0] + 1.8, 'It burns with a red flame'], 'A white solid is left: lithium oxide'],
  [[IGN_AIR[1], 'Now sodium'], [IGN_AIR[1] + 1.8, 'A bright yellow flame'], 'White sodium oxide is left'],
  [[IGN_AIR[2], 'Now potassium'], [IGN_AIR[2] + 2.0, 'It burns violently: a lilac flame'], 'White potassium oxide is left'],
], 'Which one burned the fiercest?', '4Li means 4 lithium atoms');
testCaps(T.water, 'Test 2: put each one on water', [
  [[0.3, 'Lithium on water'], [3.4, 'It floats and fizzes: hydrogen gas'], 'Lithium hydroxide stays in the water'],
  [[0.3, 'Now sodium'], [3.6, 'It melts into a ball and races'], 'Sodium hydroxide stays in the water'],
  [[0.5, 'Now potassium'], [2.6, 'It bursts into a lilac flame…'], '… and explodes!'],
], 'Which one reacted the fastest?', '2Li means 2 lithium atoms');
testCaps(T.cl, 'Test 3: drop each one into chlorine gas', [
  [[IGN_CL[0], 'Lithium into chlorine gas'], [IGN_CL[0] + 1.6, 'It burns with a bright flame'], 'White lithium chloride settles'],
  [[IGN_CL[1], 'Now sodium'], [IGN_CL[1] + 1.6, 'Bright flame, white smoke'], 'White sodium chloride (salt) settles'],
  [[IGN_CL[2], 'Now potassium'], [IGN_CL[2] + 1.8, 'It burns vigorously'], 'White potassium chloride settles'],
], 'Which one burned the hardest?', '2Li means 2 lithium atoms');
cap(T.kero, T.kero + 8.3, 'Potassium reacts even with damp air…');
cap(T.kero + 8.3, T.end, '… so it is kept under kerosene oil');
cap(T.end, T.end + 2.6, 'Every test gave the same order');
cap(T.end + 2.6, T.done, 'Reactivity: lithium < sodium < potassium');

// ---------------------------------------------------------------- camera: few, calm shots; one move each
const BOARDCAM = {};
const CAMS = [
  S(0, [0, 0.42, 0.05], 1.95, 1.2), S(4.0, [0, 0.42, 0.05], 1.7, 1.06),
  S(5.3, [JX(0) + 0.2, 0.5, 0.05], 1.55, 0.97), S(T.air, [JX(0) + 0.2, 0.9, 0.05], 1.55, 0.97, DIR, 'in'),     // follow the piece up …
];
function testCams(t0, sx, look, cw, bw) {                                    // … cut on the motion: the next piece comes down
  const wide = (t, w = 3.25) => S(t, [sx, 0.6, 0.1], w, w * 0.6), close = (t, i, w = cw) => S(t, [VX(sx, i), look, 0.05], w, w * 0.72);
  CAMS.push(wide(t0), close(t0 + 1.9, 0));
  for (let i = 0; i < 3; i++) {
    const m0 = MT(t0, i), end = i < 2 ? MT(t0, i + 1) - 0.4 : WIDE(t0);
    if (i) CAMS.push(close(m0 + 1.1, i));                             // a short glide to the next set-up, led by the tongs
    CAMS.push(close(end, i, cw * 0.88));                                   // slow push-in while it reacts
  }
  const board = (t, w) => S(t, [sx, BY + 0.12, BZ], w, w * 0.6, [0, 0.12, 1]);
  CAMS.push(wide(WIDE(t0) + 1.5), wide(BS(t0)[0], 3.15));
  BOARDCAM[t0] = [CAMS.push(board(BS(t0)[0] + 1.5, bw)) - 1, CAMS.push(board(t0 + TL - 0.001, bw * 0.95)) - 1];   // re-framed in build() with the board's real size   // tilt up, led by the words
}
testCams(T.air, SX.air, 0.7, 1.05, 4.1); testCams(T.water, SX.water, 0.44, 0.98, 4.8); testCams(T.cl, SX.cl, 0.36, 1.05, 4.1);
CAMS.push(S(T.kero, [0.35, 0.42, 0.1], 2.3, 1.42), S(T.kero + 2.0, [0.35, 0.42, 0.1], 2.2, 1.36),
  S(T.kero + 3.4, [1.05, 0.2, 0.3], 0.85, 0.58), S(T.kero + 6.6, [1.05, 0.2, 0.3], 0.78, 0.53),
  S(T.kero + 8.8, [JX(2) + 0.1, 0.4, 0.1], 0.95, 0.66), S(T.end - 0.2, [JX(2) + 0.1, 0.4, 0.1], 0.9, 0.62),
  S(T.end + 1.4, [0.3, 0.5, 0.1], 2.5, 1.55), S(T.done, [0.3, 0.5, 0.1], 2.35, 1.46));

export default {
  capNear: true, oneText: true,
  duration: T.done,
  captions: C,
  cams: CAMS,

  build({ scene, cam, R }) {
    let root = scene;                                                  // each set-up lives in its own group, shown only in its own time
    const add = (o, x = 0, y = 0, z = 0) => { o.position.set(x, y, z); root.add(o); return o; };
    const stage = (show) => { root = new THREE.Group(); scene.add(root); const g = root; beats.push((t) => { g.visible = show(t); }); return g; };
    // the baked look: each station's table (light + shadow baked in Cycles) stands on the floor of one studio photo
    const bake = (g, name, x) => { if (!BAKED) return; g.add(K.bakedSet(`bake/804_${name}.glb`)); const d = K.photoDome('bake/studio.hdr', { dim: ENV }); d.position.set(x, 0, 0.1); d.rotation.y = ROT; g.add(d); };
    const shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
    const lbl = (text, h, color = '#ffffff', w = 600) => add(K.label(text, h, color, w));
    const beats = [], fires = [];
    if (BAKED) {
      // colour: AgX washed the photo studio out ("doesn't look good on the eyes") → filmic contrast and richer colour
      const TM = { aces: THREE.ACESFilmicToneMapping, neutral: THREE.NeutralToneMapping, agx: THREE.AgXToneMapping };
      R.toneMapping = TM[QS.get('tm') || 'aces']; R.toneMappingExposure = +(QS.get('ex') || 0.9);
      let env = null; K.photoEnv('bake/studio.hdr').then((tx) => { env = tx; });
      const floor = scene.getObjectByName('floor');
      // the models get the SAME light as the bake (scripts/bake_set.py KEY): warm softbox left & a little behind, cool rim behind-right,
      // the studio photo only as soft fill at the bake's ENV strength (user: "it looks flat" → light side + shade side)
      scene.traverse((o) => {
        if (o.isHemisphereLight) o.intensity = 0.08;
        if (o.isDirectionalLight && o.castShadow) { o.color.set(0xffeedb); o.intensity = 2.4; o.position.set(-2.8, 3.0, -0.5); }   // = bake Key
        else if (o.isDirectionalLight) { o.color.set(0xb8d6ff); o.intensity = 1.6; o.position.set(3.5, 3.2, -4.5); }              // = bake Rim
      });
      beats.push(() => { floor.visible = false; scene.fog = null; if (env) { scene.environment = env; scene.environmentRotation.y = ROT; scene.environmentIntensity = ENV; } });
    }
    const fire = (tint, size, opts) => { const f = K.makeFire(tint, size, opts); fires.push(f); return f; };
    const shiny = () => M.metal(0xe6eaf0, 0.16);
    const silver = new THREE.Color(0xe6eaf0), white = new THREE.Color(0xf7f6f1);
    /** a 2D twinkle on fresh metal (style, not a light) */
    const twinkle = (piece, k) => { const s = add(K.sparkle(0xffffff, 0.1)); beats.push((t) => { const on = piece.visible && piece.userData.fresh !== false; const a = Math.max(0, Math.sin(t * 1.3 + k * 2.1)) ** 10; s.visible = on && a > 0.02; s.position.copy(piece.position).add(V(0.025, 0.035, 0.04)); s.scale.setScalar(0.12 * a + 1e-4); s.material.rotation = t * 0.4; }); };
    /** tongs bring something down from above to `at` (arrive m0+1.2), let go at m0+1.4, rise away by m0+2.6 */
    const carry = (tg, t, m0, at) => {
      tg.visible = t > m0 && t < m0 + 2.6; if (!tg.visible) return;
      const top = at.clone().add(V(0, 1.2, 0));
      const p = t < m0 + 1.2 ? top.lerp(at, 1 - (1 - span(t, m0, m0 + 1.2)) ** 2) : t < m0 + 1.7 ? at.clone() : at.clone().lerp(top, easeIn(span(t, m0 + 1.7, m0 + 2.6)));
      tg.position.copy(p); tg.userData.set(lerp(0.062, 0.11, span(t, m0 + 1.4, m0 + 1.55)));
    };
    /** where a carried piece is: with the tongs, then it falls (gravity, small bounce) onto restY */
    const held = (t, m0, at, restY, bounce = 0.03) => {
      if (t < m0) return null;
      const top = at.clone().add(V(0, 1.2, 0));
      if (t < m0 + 1.4) return top.lerp(at, 1 - (1 - span(t, m0, m0 + 1.2)) ** 2);
      return V(at.x, K.drop(t, m0 + 1.4, at.y, restY, 0.3, bounce).y, at.z);
    };

    // ================================================================ the three oil jars (open, kerosene box, end)
    const gJ = stage((t) => t < T.air + 0.6 || t >= T.kero - 0.05);
    if (BAKED) bake(gJ, 'jars', 0.3); else add(K.bench(2.9, 1.5), 0.3, 0, 0.1);
    const jars = MET.map((m, i) => {
      const g = add(new THREE.Group(), JX(i), 0, 0); g.add(K.vial(0.16, 0.62));
      const oil = K.liquid(0.14, 0.44, 0xe0952a, 0.62); oil.position.y = 0.03; g.add(oil);
      const lumps = [0, 1].map((k) => { const l = K.lump(0.06, shiny(), i * 3 + k + 1, 0.7); l.position.set(k ? 0.045 : -0.04, k ? 0.075 : 0.14, k ? 0.02 : -0.03); g.add(l); return l; });
      const tag = lbl(m.n, 0.1, '#ffffff', 700); tag.position.set(JX(i), 0.06, 0.38);
      return { g, cap: g.children[0].children[1], oil, lumps, tag };
    });
    const lessThan = [0, 1].map((k) => { const l = lbl('<', 0.13, '#f6d48f', 700); l.position.set((JX(k) + JX(k + 1)) / 2, 0.06, 0.38); return l; });
    const title = lbl('order of reactivity', 0.12, '#f6d48f', 700); title.position.set(0.25, 1.02, 0.1);
    const capAt = (j, u) => { j.cap.position.set(0.12 * u, lerp(0.72, 0.047, u) + 0.35 * Math.sin(Math.PI * u), -0.36 * u); j.cap.rotation.x = 0; };
    const tgJ = add(K.tongs(0.75));
    const kPiece = add(K.lump(0.06, shiny(), 21, 0.7)); twinkle(kPiece, 9);
    const glassP = V(1.05, 0, 0.3);
    const watch = add(new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.2, 0.012], [0.26, 0.045], [0.245, 0.047], [0.19, 0.022], [0, 0.012]].map(([a, b]) => new THREE.Vector2(a, b)), 40), M.glass()), glassP.x, 0.002, glassP.z);
    watch.renderOrder = 5; beats.push((t) => { watch.visible = t > T.kero - 0.01; });
    const lK = lbl('potassium', 0.065, '#ffffff', 700), lDamp = lbl('damp air', 0.07, '#bfe0ff', 700), lKero = lbl('kerosene oil', 0.07, '#ffd48a', 700);
    const drops = Array.from({ length: 14 }, (_, k) => ({ d: add(new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 8), M.bubble())), t0: T.kero + 4.0 + k * 0.17, from: V(glassP.x + 0.55 + 0.2 * hash(k, 1), 0.25 + 0.25 * hash(k, 2), glassP.z - 0.1 + 0.3 * hash(k, 3)) }));
    const dull = new THREE.Color(0xa8a49a), KREST = V(glassP.x, 0.052, glassP.z);
    jars.forEach((j, i) => j.lumps.forEach((l, k) => { l.userData.fresh = true; twinkle(l, i * 2 + k); }));
    beats.push((t) => {
      // open: the lithium jar's cap comes off, tongs lift a piece out and up out of the frame
      const j0 = jars[0], j2 = jars[2], top0 = V(JX(0), 0.14, 0);
      capAt(j0, ease(span(t, 3.6, 4.2)) * (1 - ease(span(t, T.kero - 2, T.kero - 1.5))));
      capAt(j2, ease(span(t, T.kero + 0.2, T.kero + 0.8)) * (1 - ease(span(t, T.kero + 9.4, T.kero + 10.0))));
      const l0 = j0.lumps[0];
      if (t < 4.3) { tgJ.visible = false; l0.position.set(-0.04, 0.14, -0.03); l0.visible = true; }
      else if (t < T.air + 0.5) {
        tgJ.visible = true; const down = V(JX(0) - 0.04, 0.14, -0.03), up = down.clone().setY(2.4);
        const p = t < 5.2 ? up.clone().lerp(down, 1 - (1 - span(t, 4.3, 5.2)) ** 2) : t < 5.5 ? down : down.clone().lerp(up, easeIn(span(t, 5.5, T.air + 0.4)));
        tgJ.position.copy(p); tgJ.userData.set(t < 5.3 ? 0.11 : 0.062);
        l0.visible = true; l0.position.copy(t < 5.5 ? V(-0.04, 0.14, -0.03) : p.clone().sub(V(JX(0), 0, 0)));
      } else { l0.visible = t > T.kero - 1; l0.position.set(-0.04, 0.14, -0.03); tgJ.visible = false; }
      // the box: potassium out onto a watch glass, it dulls in damp air, back under kerosene
      const k0 = T.kero, inJar = V(JX(2) + 0.04, 0.075, 0.02), mouth = V(JX(2), 0.95, 0), over = KREST.clone().setY(0.42);
      let kp = null, tp = null, gap = 0.062;
      if (t >= k0 + 0.6 && t < k0 + 4.6) {
        if (t < k0 + 1.4) { tp = mouth.clone().lerp(inJar, ease(span(t, k0 + 0.6, k0 + 1.4))); gap = 0.11; }
        else if (t < k0 + 2.2) { tp = inJar.clone().lerp(mouth, ease(span(t, k0 + 1.5, k0 + 2.2))); kp = tp; }
        else if (t < k0 + 3.2) { tp = K.arc(mouth, over, 0.15, ease(span(t, k0 + 2.2, k0 + 3.2))); kp = tp; }
        else { tp = over.clone().lerp(mouth.clone().setX(over.x).setY(1.6), easeIn(span(t, k0 + 3.5, k0 + 4.6))); gap = lerp(0.062, 0.11, span(t, k0 + 3.3, k0 + 3.45)); kp = t < k0 + 3.3 ? over : V(KREST.x, K.drop(t, k0 + 3.3, over.y, KREST.y, 0.28, 0.02).y, KREST.z); }
      } else if (t >= k0 + 4.6 && t < k0 + 6.6) kp = KREST;
      else if (t >= k0 + 6.6 && t < k0 + 9.6) {
        const g0 = KREST.clone().add(V(0, 0, 0)), hi = KREST.clone().setY(1.6);
        if (t < k0 + 7.4) { tp = hi.clone().lerp(g0, 1 - (1 - span(t, k0 + 6.6, k0 + 7.4)) ** 2); gap = 0.11; kp = KREST; }
        else if (t < k0 + 8.5) { tp = K.arc(g0, mouth, 0.2, ease(span(t, k0 + 7.5, k0 + 8.5))); kp = tp; }
        else { tp = mouth.clone().lerp(inJar, ease(span(t, k0 + 8.5, k0 + 9.2))); kp = tp; if (t > k0 + 9.25) { gap = 0.11; tp = inJar.clone().lerp(mouth.clone().setY(1.7), easeIn(span(t, k0 + 9.25, k0 + 9.9))); } }
      } else if (t >= k0 + 9.6) kp = inJar;
      jars[2].lumps[1].visible = t < k0 + 1.5;
      kPiece.visible = !!kp; if (kp) kPiece.position.copy(kp);
      tgJ.visible = tgJ.visible || !!tp; if (tp) { tgJ.position.copy(tp); tgJ.userData.set(gap); }
      const tar = ease(span(t, k0 + 4.6, k0 + 6.4)), km = kPiece.material;
      km.color.copy(silver).lerp(dull, tar); km.metalness = 0.9 * (1 - tar); km.roughness = lerp(0.16, 0.9, tar); kPiece.userData.fresh = tar < 0.2;
      drops.forEach(({ d, t0, from }, k) => { const u = span(t, t0, t0 + 1.0); d.visible = t > t0 && u < 1; d.position.copy(from).lerp(KREST.clone().add(V(0, 0.03, 0)), ease(u)); d.position.y += 0.02 * Math.sin(u * 8 + k); });
      lK.position.copy(kPiece.position).add(V(-0.2, 0.1, 0.05)); K.popIn(lK, t, k0 + 1.9, k0 + 7.0);
      lDamp.position.set(glassP.x + 0.2, 0.36, glassP.z + 0.05); K.popIn(lDamp, t, k0 + 3.9, k0 + 7.0);
      lKero.position.set(JX(2) + 0.33, 0.33, 0.12); K.popIn(lKero, t, k0 + 9.2, T.end + 1.2);
      // labels on the jars: at the start, then the order with < signs at the end
      jars.forEach((j, i) => K.popIn(j.tag, t, 0.5 + i * 0.35, 3.4));
      jars.forEach((j, i) => { if (t > T.air) K.popIn(j.tag, t, T.end + 0.6 + i * 0.5); });
      lessThan.forEach((l, k) => K.popIn(l, t, T.end + 2.6 + k * 0.5));
      K.popIn(title, t, T.end + 3.8);
    });

    // ================================================================ one test = three set-ups side by side
    function station(t0, sx, o) {
      if (!BAKED) add(K.bench(3.9, 1.5), sx, 0, 0.1);
      const tags = MET.map((m, i) => lbl(m.n, 0.13, '#ffffff', 700));
      tags.forEach((l, i) => l.position.set(VX(sx, i), 0.06, 0.5));
      const lt = [0, 1].map((k) => { const l = lbl('<', 0.16, '#f6d48f', 700); l.position.set((VX(sx, k) + VX(sx, k + 1)) / 2, 0.06, 0.5); return l; });
      const words = o.words.map((w, i) => { const l = lbl(w, 0.13, o.wordCol[i], 700); l.position.set(VX(sx, i), o.wordY, 0.05); return l; });
      const tg = add(K.tongs(0.75));
      const B = BS(t0);
      beats.push((t) => {
        tags.forEach((l, i) => K.popIn(l, t, WIDE(t0) + 0.6 + i * 0.25, t0 + TL));
        lt.forEach((l, k) => K.popIn(l, t, LT(t0) + k * 0.5, t0 + TL));
        words.forEach((l, i) => K.popIn(l, t, RANKT(t0) + i * 0.5, B[0] - 0.4));
        let active = 0; for (let i = 0; i < 3; i++) if (t > MT(t0, i)) active = i;
        carry(tg, t, MT(t0, active), V(VX(sx, active), o.holdY, o.z ?? 0));
      });
      // the formula: words fly up from the things, atoms rearrange, symbols appear over them (kit.reactionBoard)
      const bd = K.reactionBoard(scene, { x: sx, y: BY, z: BZ, h: 0.26, k: 2.0, terms: o.terms, ops: o.ops, metals: MET.map((m) => m.s),
        words: MET.map(o.bw), syms: MET.map(o.bs), from: o.from, t0: B[0] - 0.05, starts: B, t1: t0 + TL + 0.05 });
      beats.push(bd);
      const bw = bd.width + 0.15, bh = bd.top - bd.bottom + 0.25, cy = (bd.top + bd.bottom) / 2;
      BOARDCAM[t0].forEach((k, n) => { CAMS[k] = S(CAMS[k][0], [sx, cy, BZ], bw * (n ? 0.96 : 1), bh * (n ? 0.96 : 1), [0, 0.12, 1]); });
      if (BAKED) {                                                   // bright studio: the formula is written on a dark slate screen that rolls down
        const sw = bw + 0.45, shh = bh + 0.35, top = cy + shh / 2, slate = new THREE.Group(); add(slate, sx, top, BZ - 0.14);
        const cloth = new THREE.Mesh(new THREE.PlaneGeometry(sw, shh).translate(0, -shh / 2, 0), M.matte(0x1c2626, 0.92)); slate.add(cloth);
        const roller = K.solid(new THREE.CylinderGeometry(0.045, 0.045, sw + 0.12, 24).rotateZ(Math.PI / 2), M.metal(0x9aa0a8, 0.4)); roller.position.set(0, 0.03, -0.02); slate.add(roller);
        const bar = K.solid(new THREE.BoxGeometry(sw + 0.04, 0.04, 0.04), M.matte(0x3a3f48, 0.6)); slate.add(bar);
        for (const k of [-1, 1]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 12, 6), M.matte(0x2a2e34, 0.8)); c.position.set(k * (sw / 2 - 0.1), 6.05, -0.02); slate.add(c); }   // hangs from the ceiling
        beats.push((t) => { const k = ease(span(t, B[0] - 1.6, B[0] - 0.1)); cloth.visible = k > 0.002; cloth.scale.y = Math.max(1e-3, k); bar.position.y = -shh * k; });
      }
    }

    // ================================================================ TEST 1 · air (oxygen)
    {
      const t0 = T.air, sx = SX.air; bake(stage((t) => t >= t0 - 0.05 && t < t0 + TL + 0.05), 'air', sx); const H = 0.62, DY = H + 0.014, REST = DY + 0.012 + 0.04;
      const parts = MET.map((m, i) => {
        const x = VX(sx, i), m0 = MT(t0, i), L = LANDT(t0, i), I = L + IGN_AIR[i];
        add(K.tripod(H), x, 0, 0); add(K.dish(0.15), x, DY, 0);
        const brn = add(K.burner(), x, 0, 0); brn.userData.flame.scale.setScalar(0.45); fires.push(brn.userData.flame);
        const mat = shiny(), piece = add(K.lump(0.06, mat, i * 2 + 1, 0.7)); piece.userData.fresh = true; twinkle(piece, i);
        const f = add(fire(m.fl, [0.24, 0.32, 0.4][i]), x, REST - 0.02, 0.06);
        const sm = add(K.smoke(8, 0xf2f2f2), x, REST + 0.1, 0); sm.scale.setScalar(0.22);
        const name = lbl(`${m.n} (${m.s})`, 0.07, '#ffffff', 700);
        const prod = lbl(`${m.n} oxide`, 0.07, '#ffffff', 700); prod.position.set(x + 0.36, REST - 0.06, 0.05);
        return { m, i, x, m0, L, I, mat, piece, f, sm, name, prod };
      });
      const lAir = lbl('air (oxygen, O₂)', 0.07, '#bfe0ff', 700);
      lAir.position.set(parts[0].x + 0.36, REST + 0.3, 0);
      beats.push((t) => {
        parts.forEach((p) => {
          const { i, x, m0, L, I, mat, piece, f, sm } = p;
          const pos = held(t, m0, V(x, REST + 0.36, 0), REST, 0.02); piece.visible = !!pos; if (pos) piece.position.copy(pos);
          const end = I + [2.2, 2.2, 2.4][i];
          const on = back(span(t, I, I + 0.35)) * (1 - ease(span(t, end, end + 0.5)));
          f.visible = on > 0.01; f.scale.setScalar(Math.max(1e-4, on * (i === 2 ? 1 + 0.2 * Math.sin(t * 23) + 0.1 * Math.sin(t * 37) : 1 + 0.04 * Math.sin(t * 9))));
          const crust = ease(span(t, I + 0.5, end));
          mat.color.copy(silver).lerp(white, crust); mat.metalness = 0.9 * (1 - crust); mat.roughness = lerp(0.16, 0.95, crust); piece.userData.fresh = t < L + 0.3;
          mat.emissive.setHex(0xff6a1a); mat.emissiveIntensity = 0.9 * span(t, L + 0.2, I) * (1 - crust);   // the metal glows red-hot, then catches fire
          const melt = ease(span(t, L + 0.3, I));
          piece.scale.set(1 + 0.25 * melt + 0.35 * crust, 1 - 0.25 * melt + 0.2 * crust, 1 + 0.25 * melt + 0.35 * crust);
          if (i === 2 && on > 0.3) piece.position.x += 0.006 * Math.sin(t * 41);   // it spits and jumps
          sm.userData.update(t, on * 0.9); sm.visible = on > 0.01;
          p.name.position.set(x - 0.38, REST + 0.06, 0.05); K.popIn(p.name, t, m0 + 1.0, i < 2 ? MT(t0, i + 1) : WIDE(t0));
          K.popIn(p.prod, t, end - 0.4, i < 2 ? MT(t0, i + 1) : WIDE(t0));
        });
        K.popIn(lAir, t, parts[0].I - 0.9, parts[0].I + 2.2);
      });
      station(t0, sx, {
        holdY: REST + 0.36, wordY: 1.08, eqY: 1.36,
        words: ['burns', 'burns brightly', 'burns violently!'], wordCol: ['#ff8a8a', '#ffd84a', '#d7a8ff'],
        terms: [{ mol: 'M', n: 4, react: true }, { mol: 'O2', n: 1, react: true }, { mol: 'M2O', n: 2 }], ops: ['+', '→'],
        bw: (m) => [m.n, 'oxygen', `${m.n}
oxide`], bs: (m) => [`4${m.s}`, 'O₂', `2${m.s}₂O`],
        from: [V(VX(sx, 0), 0.06, 0.5), V(VX(sx, 0), 0.98, 0), V(VX(sx, 0), REST + 0.14, 0.05)],
      });
    }

    // ================================================================ TEST 2 · water
    {
      const t0 = T.water, sx = SX.water, inW = (t) => t >= t0 - 0.05 && t < t0 + TL + 0.05; const gW = stage(inW);
      bake(gW, 'water', sx);
      const R = 0.27, LV = 0.3, Y0 = 0.058, TOP = Y0 + LV, FLOAT = TOP + 0.006;
      const ripG = new THREE.TorusGeometry(1, 0.025, 6, 40);
      const parts = MET.map((m, i) => {
        const x = VX(sx, i), m0 = MT(t0, i), L = LANDT(t0, i);
        const bk = add(K.beaker(R, 0.52), x, 0, 0);
        const w = K.liquid(R, LV, 0x1f6fd8, 0.62); w.position.set(x, Y0, 0); scene.add(w);
        const line = add(new THREE.Mesh(new THREE.TorusGeometry(R + 0.003, 0.0035, 6, 64), new THREE.MeshBasicMaterial({ color: 0xd8f0ff, transparent: true, opacity: 0.85, toneMapped: false })), x, TOP, 0); line.rotation.x = Math.PI / 2;
        const mat = shiny(), piece = add(K.lump(0.072, mat, i * 5 + 2, 0.72)); piece.userData.fresh = true; twinkle(piece, i + 3);
        const sp = add(K.splash(0xffffff, 0.3), x, TOP, 0);
        const fz = add(K.bubbles(26, V(), TOP + 0.06, 0.15, 0.015));
        const rip = [0, 1, 2].map(() => { const r = add(new THREE.Mesh(ripG, new THREE.MeshBasicMaterial({ color: 0xdff2ff, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }))); r.rotation.x = Math.PI / 2; return r; });
        const name = lbl(`${m.n} (${m.s})`, 0.07, '#ffffff', 700);
        const prod = lbl(`${m.n} hydroxide (${m.s}OH)`, 0.065, '#ffffff', 700); prod.position.set(x, Y0 + 0.19, R + 0.05);
        return { m, i, x, m0, L, bk, w, mat, piece, sp, fz, rip, name, prod, gone: L + [1e9, 3.6, 2.6][i] };
      });
      const lWater = lbl('water (H₂O)', 0.07, '#bfe0ff', 700); lWater.position.set(parts[0].x, Y0 + 0.19, R + 0.05);
      const lH2 = lbl('hydrogen (H₂)', 0.07, '#ffffff', 700);
      // where each piece swims: lithium drifts slowly, sodium races, potassium races faster (inside the beaker)
      const swim = (p, t) => {
        const u = Math.max(0, t - p.L), b = 0.003 * Math.sin(t * 6);
        if (p.i === 0) return V(p.x + 0.05 * Math.sin(0.5 * u), FLOAT + b, 0.04 * (Math.cos(0.5 * u) - 1));
        const k = p.i === 1 ? 1 : 1.5, ramp = ease(span(u, 0.2, 0.8));
        return V(p.x + 0.15 * Math.sin(2.2 * u * k) * ramp, FLOAT + b, 0.12 * Math.sin(3.3 * u * k + 0.5) * ramp);
      };
      const kp = parts[2], kFire = add(fire(0xb56cff, 0.22, { light: false })), flash = add(K.glowSprite(0xe2c4ff, 1));
      const sparks = Array.from({ length: 22 }, (_, k) => ({ s: add(K.glowSprite(0xffd890, 0.08)), d: V(Math.cos(k * 0.6) * (0.4 + 0.4 * hash(k, 2)), 1.0 + 0.8 * hash(k, 3), Math.sin(k * 0.6) * (0.4 + 0.4 * hash(k, 4))) }));
      const bigSplash = add(K.splash(0xffffff, 0.35)), puff = add(K.smoke(6, 0xe8e4f0)); puff.scale.setScalar(0.16);
      beats.push((t) => {
        parts.forEach((p) => {
          const { i, x, m0, L, mat, piece, gone } = p;
          const pos = t < L ? held(t, m0, V(x, FLOAT + 0.36, 0), FLOAT, 0) : swim(p, Math.min(t, gone));
          piece.visible = !!pos && t < gone + 0.05; if (pos) piece.position.copy(pos);
          piece.userData.fresh = t < L;
          const shrink = i === 0 ? 1 - 0.45 * ease(span(t, L + 0.5, WIDE(t0) + 12)) : i === 1 ? 1 - 0.85 * ease(span(t, L + 0.6, gone)) : 1 - 0.25 * span(t, L, gone);
          const ball = i === 1 ? ease(span(t, L + 0.3, L + 0.9)) : 0;                       // sodium melts into a silver ball
          piece.scale.set(shrink * (1 - 0.12 * ball), shrink * (1 + 0.35 * ball), shrink * (1 - 0.12 * ball));
          mat.roughness = lerp(0.16, 0.08, ball);
          p.sp.userData.update(t - L);
          const rate = t > L && t < gone ? [0.4, 1, 1][i] * (i === 0 ? 1 - 0.5 * span(t, WIDE(t0), t0 + TL) : 1) : 0;
          p.fz.visible = rate > 0; if (pos) p.fz.userData.update(t, rate, pos.clone().add(V(0, -0.025, 0)));
          p.rip.forEach((r, k) => {                                                     // faint small rings where it moves
            const per = i ? 0.5 : 1.2, age = ((t - L) % per + per) % per + k * per, born = t - age, ok = born > L && born < gone;
            r.visible = ok && age < per * 2; if (!r.visible) return;
            r.position.copy(swim(p, born)).setY(TOP + 0.004 + k * 0.007); const off = Math.hypot(r.position.x - x, r.position.z), s = Math.min(0.04 + age * 0.1 / per, R - 0.03 - off); r.visible = s > 0.02; r.scale.set(s, s, s * 0.3);   // ripples stay inside the water
            r.material.opacity = 0.45 * (1 - age / (per * 2));
          });
          const shake = i === 2 ? span(t, gone, gone + 0.05) * (1 - span(t, gone + 0.05, gone + 0.6)) : 0;
          p.bk.position.x = x + 0.012 * Math.sin(t * 60) * shake; p.w.position.x = p.bk.position.x;
          p.name.position.set(x - 0.2, 0.66, -0.15); K.popIn(p.name, t, m0 + 1.0, i < 2 ? MT(t0, i + 1) : WIDE(t0));
          K.popIn(p.prod, t, L + [3.4, 3.6, 3.4][i], i < 2 ? MT(t0, i + 1) : WIDE(t0));
        });
        const p0 = parts[0];
        K.popIn(lWater, t, p0.m0 + 0.8, p0.L + 1.2);
        lH2.position.set(p0.x + 0.24, 0.66, -0.15); K.popIn(lH2, t, p0.L + 1.2, p0.L + 3.2);
        // potassium: lilac flame on the racing lump, then it explodes
        const kt = kp.L, kg = kp.gone, kpos = swim(kp, Math.min(t, kg));
        const kf = back(span(t, kt + 0.5, kt + 0.8)) * (1 - span(t, kg, kg + 0.1));
        kFire.visible = kf > 0.01; kFire.scale.setScalar(Math.max(1e-4, kf * (1 + 0.15 * Math.sin(t * 29)))); kFire.position.copy(kpos);
        const fl = span(t, kg, kg + 0.08) * (1 - ease(span(t, kg + 0.12, kg + 0.8)));
        flash.visible = fl > 0.01; flash.position.copy(kpos).y += 0.06; flash.scale.setScalar(0.4 + 2.0 * ease(span(t, kg, kg + 0.25))); flash.material.opacity = fl;
        bigSplash.position.copy(kpos).setY(TOP); bigSplash.userData.update(t - kg);
        sparks.forEach(({ s, d }) => { const u = t - kg; s.visible = u > 0 && u < 0.8; if (!s.visible) return; s.position.copy(kpos).add(V(d.x * u * 0.7, d.y * u - 2.6 * u * u, d.z * u * 0.7)); s.material.opacity = 1 - u / 0.8; });
        const pu = span(t, kg, kg + 3); puff.visible = pu > 0 && pu < 1; puff.position.copy(kpos); puff.userData.update(t, 0.6 * (1 - pu));
      });
      station(t0, sx, {
        holdY: FLOAT + 0.36, wordY: 0.8, eqY: 1.2,
        words: ['reacts quickly', 'reacts very quickly', 'explodes!'], wordCol: ['#ffffff', '#ffffff', '#d7a8ff'],
        terms: [{ mol: 'M', n: 2, react: true }, { mol: 'H2O', n: 2, react: true }, { mol: 'MOH', n: 2 }, { mol: 'H2', n: 1 }], ops: ['+', '→', '+'],
        bw: (m) => [m.n, 'water', `${m.n}
hydroxide`, 'hydrogen'], bs: (m) => [`2${m.s}`, '2H₂O', `2${m.s}OH`, 'H₂'],
        from: [V(VX(sx, 0), 0.06, 0.5), V(VX(sx, 0), Y0 + 0.19, R + 0.05), V(VX(sx, 0), Y0 + 0.1, R + 0.05), V(VX(sx, 0) + 0.1, TOP + 0.14, 0)],
      });
    }

    // ================================================================ TEST 3 · chlorine gas
    {
      const t0 = T.cl, sx = SX.cl; bake(stage((t) => t >= t0 - 0.05 && t < t0 + TL + 0.05), 'cl', sx); const JH = 0.62, REST = 0.052 + 0.035;
      const green = new THREE.Color(0xc4f02c), smokeW = new THREE.Color(0xf6f6f2);
      const parts = MET.map((m, i) => {
        const x = VX(sx, i), m0 = MT(t0, i), L = LANDT(t0, i), I = L + IGN_CL[i];
        const jar = add(K.gasJar(0xc4f02c, 0.2, JH), x, 0, 0);
        const mat = shiny(), piece = add(K.lump(0.05, mat, i * 7 + 3, 0.7)); piece.userData.fresh = true; twinkle(piece, i + 6);
        const f = add(fire(m.fl, [0.24, 0.28, 0.36][i], { core: 0xffffff }), x, REST - 0.02, 0);
        const layG = new THREE.CylinderGeometry(0.17, 0.17, 1, 32); layG.translate(0, 0.5, 0);
        const layer = add(K.solid(layG, M.matte(0xfafaf6, 0.9), { outline: false }), x, 0.054, 0);
        const name = lbl(`${m.n} (${m.s})`, 0.07, '#ffffff', 700); name.position.set(x - 0.4, 0.55, 0.05);
        const prod = lbl(`${m.n} chloride`, 0.07, '#ffffff', 700); prod.position.set(x, 0.17, 0.32);
        return { m, i, x, m0, L, I, jar, mat, piece, f, layer, name, prod };
      });
      const lCl = lbl('chlorine gas (Cl₂)', 0.07, '#d9f07a', 700); lCl.position.set(parts[0].x + 0.42, 0.42, 0.05);
      beats.push((t) => {
        parts.forEach((p) => {
          const { i, x, m0, L, I, jar, mat, piece, f, layer } = p;
          const pos = held(t, m0, V(x, JH + 0.26, 0), REST, 0.015); piece.visible = !!pos; if (pos) piece.position.copy(pos);
          jar.userData.lid.position.x = 0.3 * ease(span(t, m0 + 0.4, m0 + 0.9)) * (1 - ease(span(t, L + 0.1, L + 0.5)));
          const end = I + [2.0, 2.0, 2.2][i];
          const on = back(span(t, I, I + 0.3)) * (1 - ease(span(t, end, end + 0.5)));
          f.visible = on > 0.01; f.scale.setScalar(Math.max(1e-4, on * (i === 2 ? 1 + 0.22 * Math.sin(t * 27) : 1 + 0.05 * Math.sin(t * 11))));
          jar.rotation.z = i === 2 ? 0.012 * Math.sin(t * 31) * on : 0;
          const fill = ease(span(t, I + 0.2, I + 1.4)), settle = ease(span(t, end - 0.6, end + 1.4));
          jar.userData.gas.color.copy(green).lerp(smokeW, fill); jar.userData.gas.opacity = lerp(lerp(0.45, 0.6, fill), 0.08, settle);
          layer.visible = settle > 0.02; layer.scale.y = Math.max(1e-4, 0.008 + 0.018 * settle);
          const crust = ease(span(t, I + 0.3, end));
          mat.color.copy(silver).lerp(white, crust); mat.metalness = 0.9 * (1 - crust); mat.roughness = lerp(0.16, 0.95, crust);
          mat.emissive.setHex(0xff7a2a); mat.emissiveIntensity = 0.7 * on; piece.userData.fresh = t < L;
          piece.scale.setScalar(Math.max(1e-4, 1 - 0.6 * crust));
          K.popIn(p.name, t, m0 + 1.0, i < 2 ? MT(t0, i + 1) : WIDE(t0));
          K.popIn(p.prod, t, end - 0.4, i < 2 ? MT(t0, i + 1) : WIDE(t0));
        });
        K.popIn(lCl, t, parts[0].m0 + 0.3, parts[0].I + 0.4);
      });
      station(t0, sx, {
        holdY: JH + 0.26, wordY: 0.9, eqY: 1.25,
        words: ['burns brightly', 'burns brightly', 'burns vigorously!'], wordCol: ['#ffffff', '#ffffff', '#d7a8ff'],
        terms: [{ mol: 'M', n: 2, react: true }, { mol: 'Cl2', n: 1, react: true }, { mol: 'MCl', n: 2 }], ops: ['+', '→'],
        bw: (m) => [m.n, 'chlorine', `${m.n}
chloride`], bs: (m) => [`2${m.s}`, 'Cl₂', `2${m.s}Cl`],
        from: [V(VX(sx, 0), 0.06, 0.5), V(VX(sx, 0), 0.42, 0.05), V(VX(sx, 0), 0.17, 0.32)],
      });
    }

    beats.push((t, dt) => fires.forEach((f) => { if (shown(f)) f.userData.fx.update(dt, cam.position); }));
    return (t, dt) => { for (const b of beats) b(t, dt); };
  },
};
