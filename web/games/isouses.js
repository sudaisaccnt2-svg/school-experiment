// Isotope Jobs (Unit 2, film 10, book pp.57-58): the uses of isotopes learned by playing instead of reading a list.
//   🔎 Which isotope?  a little 3D scene of the job (thyroid, smoke detector, blood vessel …) → tap the isotope that does it.
//   🧰 Which job?      an isotope → tap the scene where it works (3 scenes, later 4).
//   ⚡ Speed           both kinds mixed, a few seconds each.
// After a right answer a glowing drop of the isotope flies into the scene and the scene lights up.
import { THREE, tween, popIn, ball, emissive, M } from './kit.js';
import { runGame, tile, shake, shuffle } from './rounds.js';

const mat = (c, r = 0.45, extra = {}) => new THREE.MeshPhysicalMaterial({ color: c, roughness: r, clearcoat: 0.6, ...extra });
const add = (g, geo, m, x = 0, y = 0, z = 0, s = [1, 1, 1], rot = [0, 0, 0]) => {
  const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.scale.set(...s); o.rotation.set(...rot); g.add(o); return o; };
const SPH = new THREE.SphereGeometry(1, 32, 16), BOX = new THREE.BoxGeometry(1, 1, 1), CYL = new THREE.CylinderGeometry(1, 1, 1, 32);

/** Little scenes built from simple shapes, about 2 units wide. */
const SCENES = {
  thyroid(g) { add(g, CYL, mat(0xd9a07a), 0, 0, -0.3, [0.75, 2.2, 0.75]);
    [-1, 1].forEach((s) => add(g, SPH, mat(0xe0604a), s * 0.42, -0.2, 0.35, [0.38, 0.55, 0.2], [0, 0, s * 0.35]));
    add(g, SPH, mat(0xe0604a), 0, -0.35, 0.4, [0.22, 0.14, 0.14]); },
  brain(g) { [-1, 1].forEach((s) => add(g, SPH, mat(0xf0a0b0, 0.6), s * 0.48, 0, 0, [0.62, 0.72, 0.85]));
    add(g, CYL, mat(0xd08090), 0, -0.8, 0, [0.16, 0.6, 0.16]); },
  cancer(g) { add(g, SPH, mat(0x7f8fa8, 0.5), 0, 0, 0, [1.1, 0.6, 0.5]); add(g, SPH, mat(0x6a2a7a, 0.4), 0.2, 0.15, 0.35, [0.3, 0.3, 0.3]);
    add(g, CYL, emissive(0xffc061, 1.2), 0.2, 0.85, 0.35, [0.05, 0.9, 0.05]); },
  blood(g) { add(g, CYL, mat(0xff6060, 0.2, { transparent: true, opacity: 0.35 }), 0, 0, 0, [0.45, 2.6, 0.45], [0, 0, Math.PI / 2]);
    for (let i = 0; i < 6; i++) add(g, SPH, mat(0xd02020), -1.1 + i * 0.25, (i % 2) * 0.12 - 0.06, 0, [0.12, 0.12, 0.05]);
    add(g, SPH, mat(0x5a3020), 0.6, 0, 0, [0.22, 0.4, 0.4]); },
  tracer(g) { add(g, CYL, mat(0x9aa4b4, 0.3, { metalness: 0.6 }), 0, 0, 0, [0.35, 2.6, 0.35], [0, 0, Math.PI / 2]);
    add(g, CYL, mat(0x9aa4b4, 0.3, { metalness: 0.6 }), 1.1, 0.6, 0, [0.35, 1.2, 0.35]);
    add(g, SPH, mat(0x3a2a20), 0.2, 0, 0, [0.3, 0.38, 0.38]); },
  leaf(g) { add(g, SPH, mat(0x3aa04a, 0.5), 0, 0, 0, [0.9, 0.5, 0.08], [0, 0, 0.4]); add(g, CYL, mat(0x2a7030), -0.95, -0.55, 0, [0.04, 0.7, 0.04], [0, 0, 0.9]);
    add(g, SPH, emissive(0xffd040, 1.2), 1.1, 0.95, -0.3, [0.32, 0.32, 0.32]); },
  bone(g) { add(g, CYL, mat(0xeee0c0, 0.6), 0, 0, 0, [0.16, 1.8, 0.16], [0, 0, 0.5]);
    [-1, 1].forEach((s) => { const x = -s * 0.43, y = s * 0.79; [-1, 1].forEach((d) => add(g, SPH, mat(0xeee0c0, 0.6), x + d * 0.15 * 0.88, y + d * 0.15 * 0.48, 0, [0.21, 0.21, 0.21])); }); },
  rock(g) { add(g, new THREE.DodecahedronGeometry(1), mat(0x7a7470, 0.8), 0, 0, 0, [1.0, 0.75, 0.7]);
    for (let i = 0; i < 6; i++) add(g, SPH, mat(0x50565e, 0.3, { metalness: 0.8 }), Math.cos(i) * 0.55, Math.sin(i * 2) * 0.35, 0.55, [0.1, 0.1, 0.1]); },
  smoke(g) { add(g, CYL, mat(0xf0f0f0, 0.4), 0, 0.8, 0, [0.9, 0.22, 0.9]); add(g, SPH, emissive(0xff3030, 1.5), 0.45, 0.66, 0.5, [0.06, 0.06, 0.06]);
    for (let i = 0; i < 5; i++) add(g, SPH, mat(0x888888, 0.9, { transparent: true, opacity: 0.55 }), -0.4 + i * 0.22, -0.2 - (i % 2) * 0.3, 0, [0.28, 0.28, 0.28]); },
  oil(g) { add(g, BOX, mat(0x7a5a3a, 0.9), 0, -0.4, 0, [2.2, 1.2, 0.8]); add(g, CYL, mat(0x303030, 0.3, { metalness: 0.7 }), 0, 0.2, 0, [0.07, 2.0, 0.07]);
    add(g, SPH, mat(0x101010, 0.15), 0, -0.75, 0.2, [0.5, 0.25, 0.3]); add(g, BOX, mat(0x8090a0, 0.4), 0, 1.15, 0, [0.6, 0.12, 0.3]); },
  soil(g) { add(g, BOX, mat(0x6a4a2a, 0.95), 0, -0.5, 0, [2.2, 0.9, 0.8]); add(g, CYL, mat(0x3aa04a), 0, 0.2, 0, [0.04, 0.6, 0.04]);
    [-1, 1].forEach((s) => add(g, SPH, mat(0x3aa04a), s * 0.2, 0.5, 0, [0.22, 0.08, 0.1], [0, 0, s * 0.4]));
    [-0.6, 0.1, 0.7].forEach((x) => add(g, SPH, mat(0x4aa8ff, 0.1), x, -0.6, 0.42, [0.09, 0.12, 0.09])); },
  luggage(g) { add(g, BOX, mat(0x8a4a2a, 0.5), 0, -0.1, 0, [1.8, 1.2, 0.5]); add(g, new THREE.TorusGeometry(0.25, 0.05, 8, 24, Math.PI), mat(0x222222), 0, 0.5, 0);
    add(g, BOX, mat(0xc0a060, 0.3, { metalness: 0.7 }), 0, -0.1, 0.26, [1.8, 0.08, 0.02]); },
  washer(g) { add(g, BOX, mat(0xf2f2f2, 0.35), 0, 0, 0, [1.6, 1.8, 0.9]); add(g, new THREE.TorusGeometry(0.5, 0.07, 12, 32), mat(0x9aa4b4, 0.3, { metalness: 0.7 }), 0, -0.1, 0.46);
    add(g, CYL, mat(0x6a9ad0, 0.1, { transparent: true, opacity: 0.6 }), 0, -0.1, 0.45, [0.48, 0.02, 0.48], [Math.PI / 2, 0, 0]); },
};
// job → [scene, words under it, isotopes that do it] (book pp.57-58)
const JOBS = {
  thyroid: ['thyroid', 'thyroid · goiter', ['I-131']], brain: ['brain', 'brain pictures', ['I-123']],
  cancer: ['cancer', 'cancer treatment', ['Co-60', 'Radium']], blood: ['blood', 'blood circulation', ['Na-24']],
  tracer: ['tracer', 'find a blockage (tracer)', ['D', 'C-13', 'N-15', 'O-18', 'I-131']],
  photo: ['leaf', 'photosynthesis', ['C-14']], dating: ['bone', 'age of old remains', ['C-14']],
  rock: ['rock', 'age of rocks (turns into lead)', ['Uranium']], smoke: ['smoke', 'smoke detector', ['Am-241']],
  oil: ['oil', 'finding oil wells', ['Am-241']], soil: ['soil', 'soil moisture', ['Cf-252']],
  luggage: ['luggage', 'checking luggage', ['Cf-252']], washer: ['washer', 'cloth washers (dust)', ['Kr-85']],
};
const ISOS = ['I-131', 'I-123', 'Co-60', 'Radium', 'Na-24', 'C-14', 'Uranium', 'Am-241', 'Cf-252', 'Kr-85'];
const jobsOf = (iso) => Object.keys(JOBS).filter((j) => JOBS[j][2].includes(iso));

function scene(job, scale = 1) {
  const g = new THREE.Group(), inner = new THREE.Group(); g.add(inner); SCENES[JOBS[job][0]](inner);
  g.scale.setScalar(scale); g.userData.job = job; return g;
}
function fly(g, from, to) {                       // a glowing drop of the isotope flies into the scene
  const d = ball(emissive(0x4dff88, 2.2), 0.14); g.stage.root.add(d);
  const a = from.clone(), b = to.clone();
  return tween(0.7, (u) => { d.position.lerpVectors(a, b, u); d.position.y += Math.sin(u * Math.PI) * 1.2; })
    .then(() => { d.scale.setScalar(0.001); });
}

// ---------------------------------------------------------------- 🔎 which isotope? (scene → isotope)
function whichIso(k, g, job, nOpts, secs) {
  const S = scene(job, 1.3); S.position.set(0, 1.1, 0); g.stage.root.add(S); popIn(S, 1.3, 0.5);
  g.stage.tag(JOBS[job][1], S, [0, 2.0, 0], 'big gold');
  const ok = JOBS[job][2], right = ok[k % ok.length];
  const wrongs = shuffle(ISOS.filter((i) => !ok.includes(i) && !(job === 'tracer' && ['I-131', 'C-14'].includes(i))));
  const near = { thyroid: 'I-123', brain: 'I-131', smoke: 'Cf-252', soil: 'Am-241', luggage: 'Am-241', oil: 'Cf-252', dating: 'Uranium', rock: 'C-14' }[job];
  const pick = [...new Set([...(k >= 3 && near ? [near] : []), ...wrongs])].slice(0, nOpts - 1);
  const opts = shuffle([right, ...pick]);
  const W = nOpts > 3 ? 1.9 : 2.2;
  const T = opts.map((v, j) => { const t = tile(v, { w: W, h: 0.8, color: '#3f8a6a', size: 0.48 });
    t.position.set((j - (opts.length - 1) / 2) * (W + 0.3), -1.6, 0); t.userData.v = v; g.stage.root.add(t); g.stage.pickable(t); return t; });
  g.goal('Which isotope does this job?', k);
  let first = true, busy = false;
  const why = `${right}: ${JOBS[job][1]}`;
  if (secs) g.timer(secs, () => { if (!busy) { busy = true; g.miss(k, why); } });
  g.setTap(async (hit) => {
    if (busy || !hit || hit.obj.userData.v == null) return;
    const t = hit.obj;
    if (!ok.includes(t.userData.v)) { first = false; g.wrong(); shake(t); return; }
    busy = true; t.tint('#4dff88', 0.9);
    await fly(g, t.position, S.position); popIn(S, 1.45, 0.4);
    g.right(k, first, why);
  });
}
// ---------------------------------------------------------------- 🧰 which job? (isotope → scene)
function whichJob(k, g, iso, nOpts, secs) {
  const mine = jobsOf(iso), right = mine[k % mine.length];
  const others = shuffle(Object.keys(JOBS).filter((j) => !mine.includes(j) && !JOBS[j][2].includes(iso)));
  const opts = shuffle([right, ...others.slice(0, nOpts - 1)]);
  const vial = tile(iso, { w: 2.0, h: 0.85, color: '#3f8a6a', size: 0.5 }); vial.position.set(0, 2.3, 0); g.stage.root.add(vial);
  const gap = nOpts > 3 ? 2.7 : 3.4, sc = nOpts > 3 ? 0.75 : 0.85;
  const Ss = opts.map((job, j) => { const S = scene(job, sc); S.position.set((j - (opts.length - 1) / 2) * gap, 0.0, 0);
    g.stage.root.add(S); g.stage.pickable(S); popIn(S, sc, 0.4); g.stage.tag(JOBS[job][1], S, [0, -1.35, 0], 'big'); return S; });
  g.goal(`Where does ${iso} work?`, k);
  let first = true, busy = false;
  const why = `${iso}: ${JOBS[right][1]}`;
  if (secs) g.timer(secs, () => { if (!busy) { busy = true; g.miss(k, why); } });
  g.setTap(async (hit) => {
    if (busy || !hit || !hit.obj.userData.job) return;
    const S = hit.obj;
    if (!mine.includes(S.userData.job)) { first = false; g.wrong(); shake(S); return; }
    busy = true; await fly(g, vial.position, S.position); popIn(S, sc * 1.2, 0.4);
    g.right(k, first, `${iso}: ${JOBS[S.userData.job][1]}`);
  });
}

const ISO_R = ['thyroid', 'smoke', 'blood', 'photo', 'luggage', 'cancer', 'brain', 'washer', 'oil', 'rock'];
const JOB_R = ['I-123', 'Kr-85', 'Cf-252', 'Na-24', 'Co-60', 'I-131', 'Am-241', 'C-14', 'Radium', 'Uranium'];
const SPEED = [['j', 'tracer'], ['i', 'Am-241'], ['j', 'dating'], ['i', 'I-131'], ['j', 'soil'], ['i', 'Kr-85'],
  ['j', 'brain'], ['i', 'Cf-252'], ['j', 'cancer'], ['i', 'Na-24'], ['j', 'washer'], ['i', 'Uranium']];
const PARTS = [
  { key: 'iso', icon: '🔎', name: 'Which isotope?', n: ISO_R.length, done: 'Every job has its own isotope.',
    run: (k, g) => whichIso(k, g, ISO_R[k], k < 4 ? 3 : 4, k >= 7 ? 10 : 0) },
  { key: 'job', icon: '🧰', name: 'Which job?', n: JOB_R.length, done: 'You know where each isotope works.',
    run: (k, g) => whichJob(k, g, JOB_R[k], k < 5 ? 3 : 4, k >= 7 ? 10 : 0) },
  { key: 'speed', icon: '⚡', name: 'Speed', n: SPEED.length, done: 'Isotopes at work: medicine, tracers, dating, industry.',
    run: (k, g) => (SPEED[k][0] === 'j' ? whichIso(k, g, SPEED[k][1], 4, 7) : whichJob(k, g, SPEED[k][1], 3, 7)) },
];
export function start({ stage, ui, level }) {
  return runGame({ stage, ui, level, id: 'isouses', parts: PARTS, cam: [0, 0.4, 13], target: [0, 0.2, 0] });
}
