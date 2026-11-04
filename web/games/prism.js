// Prism bench (Light Jumps level 1): a lamp, a glass prism and a screen on a table. Drag any of them; turn the lamp
// and the prism with their gold ↻ knobs. Every colour of light is traced live through the glass (Snell's law,
// bending at each face, bouncing back inside when it hits a face too steeply). Violet bends most, red least.
// The glass is made about 4× more "colour-spreading" than real glass so the rainbow fits on a small table.
import { THREE, glow } from './kit.js';

const H = 0.62;                                   // beam height above the table
const S = 2.4;                                    // prism side
const TABLE = { x: 6.4, y: 3.3 };                 // half size
const nGlass = (l) => 1.40 + 30000 / (l * l);     // refractive index for wavelength l (nm), dispersion exaggerated
// white light: colours spaced evenly in how much they bend (even in 1/λ²), so the rainbow has no bunched-up white end
const WHITE = Array.from({ length: 34 }, (_, k) => 1 / Math.sqrt(1 / 385 ** 2 + (k / 33) * (1 / 720 ** 2 - 1 / 385 ** 2)));
const GAS = [656, 486, 434, 410];
const HOME = { lamp: [-4.45, 1.3, -22], prism: [-1.0, 0.0, 180], screen: [3.8, 1.3, 48] };
const MAXQ = 900;

export function createPrismBench(stage, waveColor) {
  const D = (a) => (a * Math.PI) / 180;
  const bench = new THREE.Group();
  bench.rotation.x = -1.18;                        // the table tips away from us: we look at it from above
  bench.position.set(-0.2, -1.2, 0);
  bench.scale.setScalar(0.86);
  stage.root.add(bench);

  // ---- table
  const top = new THREE.Mesh(new THREE.BoxGeometry(TABLE.x * 2 + 0.6, TABLE.y * 2 + 0.6, 0.25),
    new THREE.MeshPhysicalMaterial({ color: 0x141a24, roughness: 0.55, metalness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.4 }));
  top.position.z = -0.125; bench.add(top);
  const grid = new THREE.GridHelper(TABLE.x * 2, 26, 0x2b3a52, 0x1c2636);
  grid.rotation.x = Math.PI / 2; grid.position.z = 0.003; grid.scale.z = TABLE.y / TABLE.x;
  grid.material.transparent = true; grid.material.opacity = 0.55; bench.add(grid);

  // ---- lamp: a dark housing with a bright lens, on a little stand
  const metal = new THREE.MeshPhysicalMaterial({ color: 0x2a3140, metalness: 0.85, roughness: 0.35, clearcoat: 0.5 });
  const lamp = new THREE.Group(); bench.add(lamp);
  const house = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 1.0, 32), metal);
  house.rotation.z = Math.PI / 2; house.position.set(-0.25, 0, H); lamp.add(house);
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, H, 12), metal);
  stand.rotation.x = Math.PI / 2; stand.position.set(-0.25, 0, H / 2); lamp.add(stand);
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.08, 32), metal);
  foot.rotation.x = Math.PI / 2; foot.position.set(-0.25, 0, 0.04); lamp.add(foot);
  const lensMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.04, 32), lensMat);
  lens.rotation.z = Math.PI / 2; lens.position.set(0.27, 0, H); lamp.add(lens);
  const lampGlow = glow(0xffffff, 1.6, 0.9); lampGlow.position.set(0.32, 0, H); lamp.add(lampGlow);
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.2, 16),      // hydrogen tube (gas mode)
    new THREE.MeshBasicMaterial({ color: 0xff7ccf }));
  tube.rotation.x = Math.PI / 2; tube.position.set(-0.25, 0, H + 0.95); lamp.add(tube);
  const tubeGlow = glow(0xff5fc0, 1.8, 0.8); tubeGlow.position.copy(tube.position); lamp.add(tubeGlow);

  // ---- prism: a real glass block (bevelled triangle, transmission + reflections), apex toward us
  const R = S / Math.sqrt(3);
  const corners = [0, 1, 2].map((k) => new THREE.Vector2(R * Math.cos(D(90 + 120 * k)), R * Math.sin(D(90 + 120 * k))));
  const shape = new THREE.Shape(corners);
  const pgeo = new THREE.ExtrudeGeometry(shape, { depth: 1.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05,
    bevelSegments: 3, curveSegments: 1 });
  pgeo.computeVertexNormals();
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.04, transmission: 1,
    thickness: 1.6, ior: 1.5, dispersion: 3, attenuationColor: new THREE.Color(0x8fd2ff), attenuationDistance: 1.6,
    specularIntensity: 1, specularColor: new THREE.Color(0xffffff), clearcoat: 1, clearcoatRoughness: 0.02,
    envMapIntensity: 3.5, iridescence: 0.25, sheen: 0.4, sheenColor: new THREE.Color(0x9fd8ff),
    transparent: true, depthWrite: false });
  const prism = new THREE.Group(); bench.add(prism);
  const block = new THREE.Mesh(pgeo, glass); block.renderOrder = 1; prism.add(block);
  const body = new THREE.Mesh(pgeo, new THREE.MeshPhysicalMaterial({ color: 0x6fb8ff, transparent: true, opacity: 0.1,
    roughness: 0.05, clearcoat: 1, envMapIntensity: 2, depthWrite: false, side: THREE.BackSide }));
  body.renderOrder = 0; prism.add(body);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(pgeo, 30),
    new THREE.LineBasicMaterial({ color: 0xe6f4ff, transparent: true, opacity: 0.8 }));
  prism.add(edges);
  const shine = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({ color: 0x9fd0ff,
    transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false }));
  shine.position.z = 1.36; prism.add(shine);

  // ---- screen: a dark card on a frame; the colours land on it as upright stripes
  const SW = 3.4;
  const screen = new THREE.Group(); bench.add(screen);
  const card = new THREE.Mesh(new THREE.BoxGeometry(0.08, SW, 1.7), new THREE.MeshStandardMaterial({ color: 0x0c1018, roughness: 0.9 }));
  card.position.z = 0.95; screen.add(card);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.12, SW + 0.16, 0.1), metal);
  frame.position.z = 0.05; screen.add(frame);
  const frameTop = frame.clone(); frameTop.position.z = 1.83; screen.add(frameTop);

  // ---- gold turning knobs
  const goldM = new THREE.MeshPhysicalMaterial({ color: 0xffc061, metalness: 1, roughness: 0.25, emissive: 0x6a4000 });
  const knob = (parent, x) => {
    const k = new THREE.Group(); k.position.set(x, 0, H); parent.add(k);
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 12), goldM); k.add(b);
    k.add(glow(0xffb347, 0.9, 0.5));
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, Math.abs(x), 8), goldM);
    arm.rotation.z = Math.PI / 2; arm.position.x = -x / 2; k.add(arm);
    return k;
  };
  const lampKnob = knob(lamp, -1.35);
  const prismKnob = new THREE.Group(); prism.add(prismKnob);           // sits off the back corner of the prism
  const pk = knob(prismKnob, 0); pk.position.set(0, R + 0.75, H);
  const pkArm = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.75, 8), goldM);
  pkArm.position.set(0, R + 0.38, H); prismKnob.add(pkArm);

  // ---- light: one buffer of flat glowing ribbons (rays) + upright stripes (spots on the screen)
  const pos = new Float32Array(MAXQ * 12), col = new Float32Array(MAXQ * 12), idx = new Uint32Array(MAXQ * 6);
  for (let q = 0; q < MAXQ; q++) idx.set([q * 4, q * 4 + 1, q * 4 + 2, q * 4, q * 4 + 2, q * 4 + 3], q * 6);
  const lg = new THREE.BufferGeometry();
  lg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); lg.setAttribute('color', new THREE.BufferAttribute(col, 3));
  lg.setIndex(new THREE.BufferAttribute(idx, 1));
  const light = new THREE.Mesh(lg, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  light.frustumCulled = false; light.renderOrder = 2; bench.add(light);
  let nq = 0;
  function quad(a, b, c, d, rgb, k) {
    if (nq >= MAXQ) return;
    [a, b, c, d].forEach((p, i) => { pos.set([p.x, p.y, p.z], nq * 12 + i * 3); col.set([rgb.r * k, rgb.g * k, rgb.b * k], nq * 12 + i * 3); });
    nq++;
  }
  const V = (x, y, z = H) => new THREE.Vector3(x, y, z);
  function ribbon(p, q, rgb, k, w) {          // flat on the beam plane, plus a thin upright fin so it reads from any angle
    const dx = q.x - p.x, dy = q.y - p.y, L = Math.hypot(dx, dy) || 1, nx = (-dy / L) * w / 2, ny = (dx / L) * w / 2;
    quad(V(p.x + nx, p.y + ny), V(q.x + nx, q.y + ny), V(q.x - nx, q.y - ny), V(p.x - nx, p.y - ny), rgb, k);
    quad(V(p.x, p.y, H - w / 2), V(q.x, q.y, H - w / 2), V(q.x, q.y, H + w / 2), V(p.x, p.y, H + w / 2), rgb, k * 0.8);
  }
  function stripe(p, tang, rgb, k, w) {        // upright colour stripe on the screen card
    const tx = tang.x * w / 2, ty = tang.y * w / 2;
    quad(V(p.x - tx, p.y - ty, 0.35), V(p.x + tx, p.y + ty, 0.35), V(p.x + tx, p.y + ty, 1.55), V(p.x - tx, p.y - ty, 1.55), rgb, k);
  }

  // ---- 2D optics on the table plane
  const st = { lamp: {}, prism: {}, screen: {} };
  function setPose(name, x, y, a) {
    const o = st[name]; o.x = Math.max(-TABLE.x, Math.min(TABLE.x, x)); o.y = Math.max(-TABLE.y, Math.min(TABLE.y, y)); o.a = a;
    const g = { lamp, prism, screen }[name];
    g.position.set(o.x, o.y, 0); g.rotation.z = D(a);
    dirty = true;
  }
  const rot = (p, a) => ({ x: p.x * Math.cos(a) - p.y * Math.sin(a), y: p.x * Math.sin(a) + p.y * Math.cos(a) });
  function hitSeg(o, d, a, b) {
    const ex = b.x - a.x, ey = b.y - a.y, den = d.x * -ey - d.y * -ex;
    if (Math.abs(den) < 1e-9) return null;
    const wx = a.x - o.x, wy = a.y - o.y, t = (wx * -ey - wy * -ex) / den, u = (d.x * wy - d.y * wx) / den;
    return t > 1e-5 && u >= 0 && u <= 1 ? { t, u } : null;
  }
  function trace(o, d, n, out, lim = 8) {
    const P = st.prism, a = D(P.a);
    const vs = corners.map((c) => { const r = rot(c, a); return { x: r.x + P.x, y: r.y + P.y }; });
    const S0 = st.screen, sa = D(S0.a), tang = { x: -Math.sin(sa), y: Math.cos(sa) };
    const s1 = { x: S0.x - tang.x * SW / 2, y: S0.y - tang.y * SW / 2 }, s2 = { x: S0.x + tang.x * SW / 2, y: S0.y + tang.y * SW / 2 };
    let inside = false, bounced = false;
    for (let k = 0; k < lim; k++) {
      let best = null;
      for (let i = 0; i < 3; i++) { const h = hitSeg(o, d, vs[i], vs[(i + 1) % 3]); if (h && (!best || h.t < best.t)) best = { ...h, i }; }
      const sh = inside ? null : hitSeg(o, d, s1, s2);
      if (sh && (!best || sh.t < best.t)) {
        out.push({ x: o.x + d.x * (sh.t - 0.07), y: o.y + d.y * (sh.t - 0.07), inside, screen: true, tang });
        return { bounced };
      }
      if (!best) {                                   // off the edge of the table
        let t = 30;
        if (d.x) t = Math.min(t, ((d.x > 0 ? TABLE.x + 0.3 : -TABLE.x - 0.3) - o.x) / d.x);
        if (d.y) t = Math.min(t, ((d.y > 0 ? TABLE.y + 0.3 : -TABLE.y - 0.3) - o.y) / d.y);
        out.push({ x: o.x + d.x * Math.max(t, 0), y: o.y + d.y * Math.max(t, 0), inside });
        return { bounced };
      }
      const p = { x: o.x + d.x * best.t, y: o.y + d.y * best.t };
      out.push({ ...p, inside, face: best.i, dirIn: { ...d } });
      const A = vs[best.i], B = vs[(best.i + 1) % 3], L = Math.hypot(B.x - A.x, B.y - A.y);
      let nx = (B.y - A.y) / L, ny = -(B.x - A.x) / L;
      if (nx * d.x + ny * d.y > 0) { nx = -nx; ny = -ny; }
      const ci = -(nx * d.x + ny * d.y), eta = inside ? n : 1 / n, kk = 1 - eta * eta * (1 - ci * ci);
      if (kk < 0) { d = { x: d.x + 2 * ci * nx, y: d.y + 2 * ci * ny }; bounced = true; }
      else { const f = eta * ci - Math.sqrt(kk); d = { x: eta * d.x + f * nx, y: eta * d.y + f * ny }; inside = !inside; }
      const dl = Math.hypot(d.x, d.y); d = { x: d.x / dl, y: d.y / dl };
      o = { x: p.x + d.x * 1e-4, y: p.y + d.y * 1e-4 };
    }
    return { bounced };
  }

  let gas = false, dirty = true;
  const info = { bounced: false, onScreen: 0, hitPrism: false, hits: [], whiteSpot: false };
  const WHITE_RGB = new THREE.Color(1, 1, 1), GAS_RGB = new THREE.Color(1, 0.55, 0.85);
  function rebuild() {
    nq = 0;
    const L = st.lamp, la = D(L.a), d = { x: Math.cos(la), y: Math.sin(la) };
    const o = { x: L.x + d.x * 0.3, y: L.y + d.y * 0.3 };
    const list = gas ? GAS : WHITE, beamRGB = gas ? GAS_RGB : WHITE_RGB;
    info.bounced = false; info.onScreen = 0; info.hitPrism = false; info.hits = []; info.whiteSpot = false;
    let first = null;
    list.forEach((l, j) => {
      const pts = [o], r = trace(o, d, nGlass(l), pts);
      info.bounced = info.bounced || r.bounced;
      const c = new THREE.Color(waveColor(l).hex), kRay = gas ? 1.0 : 0.22, kIn = gas ? 0.5 : 0.07;
      if (j === 0) first = pts;
      for (let i = 1; i < pts.length; i++) {
        const p = pts[i - 1], q = pts[i];
        if (i === 1) continue;                            // the shared white beam is drawn once below
        ribbon(p, q, c, q.inside ? kIn : kRay, q.inside ? 0.05 : (gas ? 0.06 : 0.035));
      }
      const end = pts[pts.length - 1];
      if (pts.length > 2) info.hitPrism = true;
      if (end.screen) { info.onScreen++; info.hits.push(l); stripe(end, end.tang, c, gas ? 1.6 : 0.85, gas ? 0.09 : 0.045); }
    });
    // the beam from the lamp to the first face (or to wherever it goes when it misses the prism)
    const b1 = first[1];
    ribbon(first[0], b1, beamRGB, gas ? 0.55 : 0.9, 0.12);
    ribbon(first[0], b1, beamRGB, 0.12, 0.34);
    if (b1.screen && !info.hitPrism) { stripe(b1, b1.tang, beamRGB, 1.0, 0.2); info.whiteSpot = !gas; info.hits = gas ? GAS.slice() : []; }
    // a faint white reflection off the first face (real glass reflects a little)
    if (info.hitPrism && b1.dirIn) {
      const P = st.prism, a = D(P.a);
      const vs = corners.map((cc) => { const r = rot(cc, a); return { x: r.x + P.x, y: r.y + P.y }; });
      const A = vs[b1.face], B = vs[(b1.face + 1) % 3], Lf = Math.hypot(B.x - A.x, B.y - A.y);
      let nx = (B.y - A.y) / Lf, ny = -(B.x - A.x) / Lf; const dd = b1.dirIn;
      if (nx * dd.x + ny * dd.y > 0) { nx = -nx; ny = -ny; }
      const ci = -(nx * dd.x + ny * dd.y), rd = { x: dd.x + 2 * ci * nx, y: dd.y + 2 * ci * ny };
      const rp = [{ x: b1.x + rd.x * 1e-3, y: b1.y + rd.y * 1e-3 }];
      trace(rp[0], rd, 1.5, rp, 1);
      const rEnd = rp[rp.length - 1];
      if (!rEnd.inside) ribbon(b1, rEnd, beamRGB, 0.06, 0.04);
    }
    for (let q = nq; q < MAXQ; q++) pos.fill(0, q * 12, q * 12 + 12);
    lg.attributes.position.needsUpdate = true; lg.attributes.color.needsUpdate = true;
    lg.setDrawRange(0, nq * 6);
    dirty = false;
    api.onChange && api.onChange(info);
  }

  // ---- dragging: a drag that starts on the lamp, prism, screen or a knob moves it; anywhere else turns the view
  const handles = [
    { obj: lampKnob, kind: 'turn', name: 'lamp' }, { obj: prismKnob, kind: 'turn', name: 'prism' },
    { obj: lamp, kind: 'move', name: 'lamp' }, { obj: prism, kind: 'move', name: 'prism' }, { obj: screen, kind: 'move', name: 'screen' },
  ];
  const ray = new THREE.Raycaster(); ray.params.Line.threshold = 0.05;
  const ndc = new THREE.Vector2(), plane = new THREE.Plane(), hitP = new THREE.Vector3();
  let drag = null, active = false;
  const cvs = stage.renderer.domElement;
  function setRay(ev) {
    const r = cvs.getBoundingClientRect();
    ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, stage.camera);
  }
  function tablePoint() {                       // pointer → table coordinates at beam height
    bench.updateMatrixWorld();
    const n = new THREE.Vector3(0, 0, 1).transformDirection(bench.matrixWorld);
    plane.setFromNormalAndCoplanarPoint(n, bench.localToWorld(new THREE.Vector3(0, 0, H)));
    if (!ray.ray.intersectPlane(plane, hitP)) return null;
    return bench.worldToLocal(hitP.clone());
  }
  // capture on the parent runs before the view controls see the press, so they can be paused for this drag
  cvs.parentElement.addEventListener('pointerdown', (ev) => {
    if (!active || ev.target !== cvs) return;
    setRay(ev);
    let h = null;
    for (const c of handles) { if (c.obj.visible && ray.intersectObject(c.obj, true).length) { h = c; break; } }
    const p = tablePoint();
    if (!h || !p) return;
    const o = st[h.name];
    drag = { ...h, id: ev.pointerId, dx: o.x - p.x, dy: o.y - p.y, a0: o.a,
      ang0: Math.atan2(p.y - o.y, p.x - o.x) };
    stage.controls.enabled = false;
    cvs.style.cursor = 'grabbing';
  }, true);
  addEventListener('pointermove', (ev) => {
    if (!drag || ev.pointerId !== drag.id) return;
    setRay(ev);
    const p = tablePoint(); if (!p) return;
    const o = st[drag.name];
    if (drag.kind === 'move') setPose(drag.name, p.x + drag.dx, p.y + drag.dy, o.a);
    else setPose(drag.name, o.x, o.y, drag.a0 + (Math.atan2(p.y - o.y, p.x - o.x) - drag.ang0) * 180 / Math.PI);
    api.moved = true; api.moves++;
  });
  const end = () => { if (drag) stage.controls.enabled = true; drag = null; cvs.style.cursor = ''; };
  addEventListener('pointerup', end); addEventListener('pointercancel', end);

  let tPulse = 0;
  stage.onFrame((dt) => {
    if (!bench.visible) return;
    if (dirty) rebuild();
    tPulse += dt;
    const s = 1 + 0.12 * Math.sin(tPulse * 4);
    if (!api.moved) { lampKnob.scale.setScalar(s); pk.scale.setScalar(s); }
    else { lampKnob.scale.setScalar(1); pk.scale.setScalar(1); }
  });

  // tags follow the objects
  const tagAt = (parent, x, y, z) => { const o = new THREE.Object3D(); o.position.set(x, y, z); parent.add(o); return o; };
  const tags = {
    lamp: stage.tag('', tagAt(lamp, -0.25, 0, -0.45), [0, 0, 0], 'tbtn switch'),       // white ⇄ hydrogen, on the lamp itself
    reset: stage.tag('↺ reset', tagAt(bench, TABLE.x - 0.6, -TABLE.y - 0.1, 0), [0, 0, 0], 'tbtn'),
    prism: stage.tag('glass prism', tagAt(prism, 0, 0, 2.0), [0, 0, 0], 'blue'),
    screen: stage.tag('screen', tagAt(screen, 0, 0, 2.25), [0, 0, 0], 'blue'),
    lturn: stage.tag('↻', tagAt(lampKnob, 0, 0, 0.45), [0, 0, 0], 'knob'),
    pturn: stage.tag('↻', tagAt(pk, 0, 0, 0.45), [0, 0, 0], 'knob'),
  };

  const api = {
    group: bench, info, moved: false, moves: 0, onChange: null,
    get gas() { return gas; },
    setGas(h) {
      gas = h; dirty = true;
      lensMat.color.set(h ? 0xff8fd0 : 0xffffff); lampGlow.material.color.set(h ? 0xff6fc0 : 0xffffff);
      tube.visible = tubeGlow.visible = h;
      tags.lamp.innerHTML = `<span class="${h ? '' : 'on'}">white lamp</span><span class="${h ? 'on h' : ''}">hydrogen gas</span>`;
    },
    pose: (name, x, y, a) => setPose(name, x, y, a),
    reset() { Object.entries(HOME).forEach(([k, v]) => setPose(k, ...v)); },
    setActive(on) {
      active = on; bench.visible = on;
      stage.pedestal.visible = !on;
      Object.values(tags).forEach((t) => (t.style.display = on ? '' : 'none'));
      if (on) dirty = true;
    },
  };
  tags.lamp.onclick = () => api.onSwitch && api.onSwitch(!gas);
  tags.reset.onclick = () => api.reset();
  api.reset(); api.setGas(false);
  return api;
}
