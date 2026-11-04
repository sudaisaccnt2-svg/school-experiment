// A 3D periodic table for the Unit 3 games: one canvas-texture tile per element, tappable (tile.userData.z).
// Colours: 'cat' (families), 'block' (s p d f), 'plain' (all grey, for painting) or a function z -> css colour.
import { THREE, tween, ease } from './kit.js';
import { SYM, place, category, block, CAT_COLOR, BLOCK_COLOR } from './u3data.js';

const PLAIN = '#5a6478';
const colorOf = (mode, z) => (typeof mode === 'function' ? mode(z) : mode === 'block' ? BLOCK_COLOR[block(z)]
  : mode === 'plain' ? PLAIN : CAT_COLOR[category(z)]);

export function table3d(stage, { zs = null, size = 0.52, gap = 0.06, color = 'cat', numbers = true, fgap = 0.3,
  parent = stage.root, pickable = true, label = (z) => SYM[z] } = {}) {
  const list = zs || Array.from({ length: 118 }, (_, k) => k + 1);
  const group = new THREE.Group(); parent.add(group);
  const step = size + gap, tiles = {}, cols = {};
  const at = (z) => {
    const [r, c] = place(z);
    return new THREE.Vector3((c - 9.5) * step, (4 - r) * step - (r >= 8 ? fgap : 0), 0);
  };
  function paint(z, css, glowK = 0) {
    const t = tiles[z], x = t.userData.ctx;
    x.clearRect(0, 0, 128, 128);
    x.fillStyle = glowK ? css : '#0d1422'; x.globalAlpha = glowK ? 0.35 : 1;
    x.beginPath(); x.roundRect(5, 5, 118, 118, 16); x.fill(); x.globalAlpha = 1;
    x.lineWidth = 7; x.strokeStyle = css; x.stroke();
    const s = label(z) || '';
    x.fillStyle = '#eef3ff'; x.font = `700 ${s.length > 1 ? 50 : 58}px Inter, "Segoe UI", sans-serif`;
    x.textAlign = 'center'; x.fillText(s, 64, 86);
    if (numbers) { x.fillStyle = css; x.font = '600 22px Inter, "Segoe UI", sans-serif'; x.textAlign = 'left'; x.fillText(String(z), 14, 30); }
    t.material.map.needsUpdate = true; t.userData.css = css;
  }
  for (const z of list) {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map: tex, transparent: true,
      depthWrite: false, toneMapped: false }));
    m.userData = { z, ctx: c.getContext('2d'), home: at(z) };
    m.position.copy(m.userData.home); group.add(m); tiles[z] = m;
    if (pickable) stage.pickable(m);
    paint(z, colorOf(color, z));
  }
  const frameMat = new THREE.MeshBasicMaterial({ color: 0xffb347, transparent: true, opacity: 0.85, depthWrite: false,
    blending: THREE.AdditiveBlending });
  const marks = [];
  return {
    group, tiles, at, step,
    zs: list,
    /** recolour every tile (mode as above) */
    recolor(mode) { for (const z of list) paint(z, colorOf(mode, z)); },
    paint(z, css, fill = false) { paint(z, css, fill ? 1 : 0); },
    /** change the label function (e.g. reveal a hidden symbol) and repaint z (or all) */
    relabel(f, z = null) { label = f; for (const q of z ? [z] : list) paint(q, tiles[q].userData.css, 0); },
    /** fade tiles not in keep (null = all back to full) */
    dim(keep, k = 0.18) {
      const s = keep ? new Set(keep) : null;
      for (const z of list) { const m = tiles[z].material, want = !s || s.has(z) ? 1 : k, a = m.opacity; tween(0.35, (t) => (m.opacity = a + (want - a) * t)); }
    },
    pop(z, k = 1.4) { const m = tiles[z]; if (m) return tween(0.5, (t) => m.scale.setScalar(1 + (k - 1) * Math.sin(t * Math.PI)), ease.lin); },
    shake(z) { const m = tiles[z]; if (!m) return; const x0 = m.userData.home.x; return tween(0.4, (t) => (m.position.x = x0 + 0.08 * Math.sin(t * 30) * (1 - t)), ease.lin); },
    /** a glowing frame around tile z (returned so it can be removed) */
    mark(z, color = 0xffb347) {
      const f = new THREE.Mesh(new THREE.RingGeometry(size * 0.76, size * 0.9, 4, 1, Math.PI / 4), frameMat.clone());
      f.material.color.set(color); f.position.copy(at(z)).setZ(0.01); group.add(f); marks.push(f); return f;
    },
    clearMarks() { marks.splice(0).forEach((f) => group.remove(f)); },
    world(z) { return group.localToWorld(at(z)); },
    dispose() { for (const z of list) stage.unpickable(tiles[z]); parent.remove(group); },
  };
}
