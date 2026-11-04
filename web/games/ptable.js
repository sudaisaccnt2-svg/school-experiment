// A small periodic table (Z 1–20) that stands in the scene, shared by Energy Stairs and Atom Lab. Kids learn it
// without being asked to: every element they finish lights up and stays lit (saved on the device), and a gold frame
// marks the current element (in Atom Lab it walks one tile per proton you add).
import { THREE, COLORS } from './kit.js';
import { element } from './atom.js';

const KEY = 'games.ptBuilt';
const pos = (z) => (z <= 2 ? [0, z === 1 ? 0 : 7] : z <= 10 ? [1, z - 3] : z <= 18 ? [2, z - 11] : [3, z - 19]);
const blockOf = (z) => (z === 2 || pos(z)[1] < 2 ? 's' : 'p');

export function periodicTable(stage, { size = 0.42, gap = 0.05 } = {}) {
  let built;
  try {
    built = new Set([...(JSON.parse(localStorage.getItem(KEY)) || []), ...(JSON.parse(localStorage.getItem('games.stairsBuilt')) || [])]);
  } catch (er) { built = new Set(); }
  const group = new THREE.Group(); stage.root.add(group);
  const tiles = {}, at = (z) => { const [r, c] = pos(z); return new THREE.Vector3((c - 3.5) * (size + gap), (1.5 - r) * (size + gap), 0); };
  for (let z = 1; z <= 20; z++) {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const x = c.getContext('2d'), col = '#' + new THREE.Color(COLORS[blockOf(z)]).getHexString();
    x.fillStyle = '#0d1422'; x.beginPath(); x.roundRect(4, 4, 120, 120, 16); x.fill();
    x.lineWidth = 6; x.strokeStyle = col; x.stroke();
    x.fillStyle = '#e8eefc'; x.font = '700 56px Inter, "Segoe UI", sans-serif'; x.textAlign = 'center'; x.fillText(element(z)[0], 64, 88);
    x.fillStyle = col; x.font = '600 22px Inter, "Segoe UI", sans-serif'; x.textAlign = 'left'; x.fillText(String(z), 14, 32);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map: tex, transparent: true,
      opacity: 0.25, depthWrite: false, toneMapped: false }));
    m.position.copy(at(z)); group.add(m); tiles[z] = m;
  }
  const frame = new THREE.Mesh(new THREE.PlaneGeometry(size + 0.08, size + 0.08), new THREE.MeshBasicMaterial({ color: 0xffb347,
    transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  frame.position.z = -0.01; group.add(frame);
  let now = 0, t = 0;
  stage.onFrame((dt) => {
    t += dt;
    for (const z in tiles) {
      const m = tiles[z].material, want = built.has(+z) ? 1 : +z === now ? 0.75 : 0.25;
      m.opacity += (want - m.opacity) * Math.min(1, dt * 5);
    }
    if (now) frame.position.lerp(at(now).setZ(-0.01), Math.min(1, dt * 8));   // the frame slides tile to tile
    frame.material.opacity = now ? 0.3 + 0.25 * Math.sin(t * 3.5) : 0;
  });
  return {
    group,
    setNow(z) { if (z && !now) frame.position.copy(at(z)).setZ(-0.01); now = z >= 1 && z <= 20 ? z : 0; },
    light(z) {
      if (!tiles[z]) return;
      if (!built.has(z)) { built.add(z); try { localStorage.setItem(KEY, JSON.stringify([...built])); } catch (er) { /* private mode */ } }
      const m = tiles[z], t0 = performance.now();
      const pop = () => { const k = Math.min(1, (performance.now() - t0) / 600); m.scale.setScalar(1 + 0.4 * Math.sin(k * Math.PI)); if (k < 1) requestAnimationFrame(pop); };
      pop();
    },
  };
}
