// Flicker detector (z-fighting): finds faces of two DIFFERENT meshes lying in the same plane, facing the same way
// (or either double-sided), and overlapping. Run on the live scene at several times (things move):
//   python scripts/zcheck_lesson.py <id> <seconds…>
import * as THREE from 'three';
export function zcheck(scene, { nq = 50, dq = 500 } = {}) {
  const buckets = new Map(), a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), n = new THREE.Vector3();
  const name = (m) => { let s = m.name || m.geometry.type.replace('Geometry', ''), p = m.parent; while (p && p.type !== 'Scene') { s = (p.name || p.type) + '>' + s; p = p.parent; } const w = m.getWorldPosition(new THREE.Vector3()); return `${s} @(${w.x.toFixed(2)},${w.y.toFixed(2)},${w.z.toFixed(2)})`; };
  const vis = (o) => { for (let p = o; p; p = p.parent) if (!p.visible) return false; return true; };
  scene.updateMatrixWorld(true);
  let id = 0;
  scene.traverse((m) => {
    if (!m.isMesh || m.isInstancedMesh || !vis(m)) return;
    const mat = Array.isArray(m.material) ? m.material[0] : m.material;
    if (mat.depthTest === false || mat.side === THREE.BackSide || mat.visible === false || (mat.opacity === 0 && mat.transparent)) return;
    const g = m.geometry, pos = g.attributes.position; if (!pos) return;
    const idx = g.index, tri = idx ? idx.count / 3 : pos.count / 3, mid = ++id, dbl = mat.side === THREE.DoubleSide;
    const s = new THREE.Vector3(); m.matrixWorld.decompose(new THREE.Vector3(), new THREE.Quaternion(), s); if (Math.abs(s.x * s.y * s.z) < 1e-6) return;
    for (let i = 0; i < tri; i++) {
      const i0 = idx ? idx.getX(3 * i) : 3 * i, i1 = idx ? idx.getX(3 * i + 1) : 3 * i + 1, i2 = idx ? idx.getX(3 * i + 2) : 3 * i + 2;
      a.fromBufferAttribute(pos, i0).applyMatrix4(m.matrixWorld); b.fromBufferAttribute(pos, i1).applyMatrix4(m.matrixWorld); c.fromBufferAttribute(pos, i2).applyMatrix4(m.matrixWorld);
      n.subVectors(b, a).cross(c.clone().sub(a)); const area = n.length() / 2; if (area < 1e-7) continue; n.normalize();
      let nn = n.clone(); if (dbl) { const k = Math.abs(nn.x) > 1e-3 ? nn.x : Math.abs(nn.y) > 1e-3 ? nn.y : nn.z; if (k < 0) nn.negate(); }
      const d = nn.dot(a), key = `${Math.round(nn.x * nq)},${Math.round(nn.y * nq)},${Math.round(nn.z * nq)},${Math.round(d * dq)}`;
      const box = new THREE.Box3().setFromPoints([a, b, c]).expandByScalar(1e-3);   // tolerance: 0.7999… and 0.8 are the same plane
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push({ mid, m, box, dbl });
    }
  });
  const hits = new Map();
  for (const [key, list] of buckets) {
    if (list.length < 2) continue;
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      const p = list[i], q = list[j]; if (p.mid === q.mid) continue;
      const pair = p.mid < q.mid ? `${p.mid}|${q.mid}` : `${q.mid}|${p.mid}`; if (hits.has(pair)) continue;
      const I = p.box.clone().intersect(q.box); if (I.isEmpty()) continue;
      const e = I.getSize(new THREE.Vector3()), big = [e.x, e.y, e.z].filter((v) => v > 4e-3).length;
      if (big >= 2) hits.set(pair, `${name(p.m)} == ${name(q.m)}`);
    }
  }
  return [...hits.values()];
}
