// Lesson 415 · Exercise MCQs (book pp.118–119, "Choose the correct option" i–x). v1 as a code lesson (2026-11-04),
// replacing the old Blender film. SKILL.md MCQ pattern: the book's question card (all four options) with reading time →
// the right option turns green → the card LEAVES and ONE picture shows WHY, with one result label on the thing.
// Answers (as printed, checked against the science): i d · ii c · iii c · iv b · v c · vi c · vii b · viii c · ix d · x b.
// BEAT SHEET (picture after each card · what the student concludes)
//  i    a sodium atom 11 +, 11 −; its outer electron leaves; + appears "a charged atom = an ion ✓"
//  ii   a group VI atom with 6 outer electrons; 2 electrons arrive into its 2 empty places "gains 2 to make 8: X²⁻ ✓"
//  iii  potassium gives its 1 electron to fluorine, which needs exactly 1 "one for one: K⁺F⁻, 1 : 1 ✓"
//  iv   calcium 2, 8, 8, 2 lets its 2 outer electrons go "loses two electrons: Ca²⁺ ✓"
//  v    carbon and oxygen balls (two non-metals) with the shared pairs glowing "they share: covalent CO₂ ✓"
//  vi   sodium gives chlorine its electron: "loses 1" on sodium, "gains 1" on chlorine "loses AND gains ✓"
//  vii  oxygen (needs 2) shares one pair with each of two fluorines (each needs 1) "F₂O ✓"
//  viii a water molecule, its shared pairs counted 1, 2 "H₂O has 2 shared pairs, not 3: (c) is wrong ✓"
//  ix   O²⁻ (2, 8) beside argon (2, 8, 8) "O²⁻ is like neon, not argon ✓"
//  x    three ion pairs CaO, MgO, NaCl drop in "metal + non-metal each time: all ionic ✓"
// Game: 🎮 Quiz Quest (quiz4.js) asks the same ten with shuffled options.
import * as THREE from 'three';
import * as K from './kit.js';
import * as U4 from './u4kit.js';
const { M, span, ease, easeIn, back } = K;
const { V, DDIR, rest, bump } = U4;

const AY = 1.9, X0 = 40, GAP = 12;
const Q = [
  { q: 'i. An atom with a charge is called:', o: ['an electron', 'a molecule', 'a metal', 'an ion'], a: 3, p: 8.8 },
  { q: 'ii. An element X is in group VI of the periodic table. The ion will be represented by:', o: ['X⁺', 'X⁻', 'X²⁻', 'X²⁺'], a: 2, p: 8.8 },
  { q: 'iii. Which pair of elements will join to form a compound with one to one ratio:', o: ['Magnesium and Chlorine', 'Sodium and Oxygen', 'Potassium and Fluorine', 'Lithium and Sulphur'], a: 2, p: 10.0 },
  { q: 'iv. When calcium atom become a Calcium ion (Ca²⁺):', o: ['it loses an electron', 'it loses two electrons', 'it gains electron', 'gains two electrons'], a: 1, p: 8.8 },
  { q: 'v. Which two elements will form a covalent compound?', o: ['Sodium and Oxygen', 'Copper and Oxygen', 'Carbon and Oxygen', 'Magnesium and Oxygen'], a: 2, p: 8.4 },
  { q: 'vi. In the formation of an ionic bond, the atoms taking part:', o: ['only gain electrons', 'share electrons', 'lose and gain of electrons', 'only lose electrons'], a: 2, p: 10.0 },
  { q: 'vii. Fluorine has an electronic configuration 2, 7 and Oxygen 2, 6. The formula of fluorine oxide will be:', o: ['FO', 'F₂O', 'FO₂', 'F₂O₂'], a: 1, p: 9.4 },
  { q: 'viii. Which of these statements about covalent bonds is incorrect?', o: ['HCl contains one pair of shared electron', 'CCl₄ contains four pairs of shared electrons', 'H₂O contains three pairs of shared electrons', 'NH₃ contains three pairs of shared electrons'], a: 2, p: 9.0 },
  { q: 'ix. Which of the following ions do not have the electronic configuration of an argon atom?', o: ['Ca²⁺', 'S²⁻', 'K⁺', 'O²⁻'], a: 3, p: 8.8 },
  { q: 'x. Which one of the groups below contains only ionic compounds?', o: ['Calcium Oxide, Hydrogen Chloride, Magnesium Oxide', 'Calcium Oxide, Magnesium Oxide, Sodium Chloride', 'Carbon Dioxide, Copper Sulphate, Hydrogen Chloride', 'Copper Sulpahte, Methane, Sodium Chloride'], a: 1, p: 9.4 },
];
// time: card (reading time from its length) → proof
let end = 0;
Q.forEach((q, i) => {
  q.x = X0 + i * GAP; q.t0 = end; q.card = Math.max(9, Math.ceil((q.q + ' ' + q.o.join(' ')).split(/\s+/).length / 3) + 4);
  q.P = q.t0 + q.card; q.t1 = q.P + q.p; end = q.t1;
});
const S = U4.shots(1e9);
const DK = (t, x, w, h, k = 1, e) => S(t, [x, AY, 0], w * k, h * k, DDIR, e);
const FR = [[2.6, 2.3], [2.6, 2.3], [3.9, 2.4], [2.9, 2.5], [3.0, 2.0], [3.9, 2.3], [4.0, 2.3], [3.0, 2.2], [3.9, 2.4], [4.2, 2.2]];
const CAMS = Q.flatMap((q, i) => [DK(q.t0, q.x, ...FR[i], 1.04), DK(q.P, q.x, ...FR[i], 1.03), DK(q.t1 - 0.05, q.x, ...FR[i], 0.96)]);

export default {
  duration: end,
  capNear: true, oneText: true,
  fog: [18, 40],
  captions: [],
  cams: CAMS,

  build({ scene, cam, R }) {
    const U = U4.lessonKit({ scene, cam, R }, '415', { dark: () => true, AY }), { beats, add, tag, grp, keyLight, goldE, fatom, ringFlash } = U;
    const sign = (text, h, color = '#ffffff') => { const l = K.label(text, h, color, 800); l.renderOrder = 22; l.userData.mark = true; return l; };
    const grow = (o, t, t0, t1 = 1e9) => { const u = t < t1 ? back(span(t, t0, t0 + 0.5)) : 1 - ease(span(t, t1, t1 + 0.35)); o.userData.s0 ??= o.scale.clone(); o.visible = u > 0.01; o.scale.copy(o.userData.s0).multiplyScalar(Math.max(1e-4, u)); };   // keeps a label's own size and shape
    const fly = (a, b) => U.hop(a, b, 0.3);
    const outer = (A) => A.es.filter((x) => x.s === A.rings.length - 1);
    const BOT = AY - 1.08;

    // ---------------------------------------------------------------- the card (DOM, fitted to the screen like 719)
    const card = document.createElement('div'); card.className = 'u7-question'; card.hidden = true; document.body.append(card);
    let shown = -1, fit = '';
    beats.push((t) => {
      const i = Q.findIndex((q) => t < q.t1), k = i < 0 ? Q.length - 1 : i, q = Q[k], up = t >= q.t0 && t < q.P;
      if (k !== shown) {
        shown = k; card.replaceChildren(); const h = document.createElement('h2'); h.textContent = q.q; card.append(h);
        q.o.forEach((s, j) => { const p = document.createElement('p'); p.textContent = 'abcd'[j] + '. ' + s; p.dataset.answer = j === q.a ? 'yes' : 'no'; card.append(p); });
        fit = '';
      }
      card.hidden = !up; card.classList.toggle('answered', t >= q.P - 2.5); cam.userData.cardUp = up;
      const key = `${k}/${innerWidth}/${innerHeight}`;
      if (up && key !== fit) { fit = key; card.style.fontSize = Math.round(Math.min(innerHeight * 0.052, innerWidth * (innerWidth < innerHeight ? 0.075 : 0.042))) + 'px'; let s = parseFloat(card.style.fontSize); while (card.scrollHeight > card.clientHeight + 1 && s > 14) { s--; card.style.fontSize = s + 'px'; } }
    });
    const stage = (i) => { const q = Q[i]; U.stage((t) => t >= q.t0 - 0.05 && t < q.t1 - 0.05); keyLight(q.x); return q; };

    // ---------------------------------------------------------------- i · a charged atom is an ion
    {
      const { x, P } = stage(0), c = V(x, AY + 0.1, 0);
      const na = fatom([2, 8, 1], 11, 12, { r0: 0.28, dr: 0.25, nr: 0.12, a0: [Math.PI / 2, Math.PI / 2, 0] }); add(na.g, c.x, c.y, c.z);
      const e1 = outer(na)[0], f = fly(na.pt(e1.R, 0).add(c), c.clone().add(V(2.4, 0.4, 0))), plus = add(sign('+', 0.45), c.x, c.y + 0.72, 0.1);
      const l1 = tag('a sodium atom: 11 +, 11 −', 0.055, '#ffffff', x, BOT, 0.1), l2 = tag('11 +, 10 −: a charged atom = an ion ✓', 0.05, '#ffd27a', x, BOT, 0.1);
      beats.push((t) => {
        na.update(rest(t, P + 0.6, P + 1.6)); e1.e.visible = t < P + 2.6; e1.e.material = goldE; f(t, P + 2.6, P + 4.0, t < P + 4.0);
        const g = ease(span(t, P + 3.6, P + 4.2)); na.rings[2].visible = g < 1; na.rings[2].scale.setScalar(Math.max(1e-4, 1 - g));
        grow(plus, t, P + 4.2); K.popIn(l1, t, P + 0.4, P + 2.5); K.popIn(l2, t, P + 4.4, end);
      });
    }
    // ---------------------------------------------------------------- ii · group VI gains two: X²⁻
    {
      const { x, P } = stage(1), c = V(x, AY + 0.1, 0);
      const xa = fatom([2, 6], 8, 8, { r0: 0.32, dr: 0.3, nr: 0.13, slots: [2, 8], a0: [Math.PI / 2, Math.PI / 2] }); add(xa.g, c.x, c.y, c.z);
      const R = xa.rings[1].geometry.parameters.radius, holes = [6, 7].map((j) => xa.pt(R, Math.PI / 2 + j / 8 * Math.PI * 2).add(c));
      const fs = holes.map((h, j) => fly(c.clone().add(V(-2.4, 0.5 - j * 0.9, 0)), h)), ch = add(sign('2−', 0.4), c.x + 0.05, c.y + 0.86, 0.1);
      const gaps = holes.map((h) => add(K.glowSprite(0xffd27a, 0.22), h.x, h.y, h.z + 0.02));
      const l1 = tag('group VI: 6 outer electrons, 2 places empty', 0.048, '#ffffff', x, BOT, 0.1), l2 = tag('gains 2 to make 8: X²⁻ ✓', 0.055, '#ffd27a', x, BOT, 0.1);
      beats.push((t) => {
        xa.update(rest(t, P - 1, P)); fs.forEach((f, j) => f(t, P + 2.8 + 0.35 * j, P + 4.2 + 0.35 * j));
        gaps.forEach((g, j) => { const v = span(t, P + 0.8, P + 1.2) * (1 - span(t, P + 4.0 + 0.35 * j, P + 4.3 + 0.35 * j)); g.visible = v > 0.01; g.material.opacity = 0.8 * v * (0.8 + 0.2 * Math.sin(t * 6)); });
        ringFlash(xa.rings[1], bump(t, P + 4.8, 0.6)); grow(ch, t, P + 4.8); K.popIn(l1, t, P + 0.4, P + 2.7); K.popIn(l2, t, P + 5.0, end);
      });
    }
    // ---------------------------------------------------------------- iii / vi · one atom gives, the other takes
    const giveTake = (i, A, B, t1, t2, r1, r2) => {
      const { x, P } = stage(i), ra = 0.26 + 0.22 * (A[0].length - 1), rb = 0.26 + 0.22 * (B[0].length - 1), W = 2 * ra + 0.45 + 2 * rb;
      const AP = V(x - W / 2 + ra, AY + 0.1, 0), BP = V(x - W / 2 + 2 * ra + 0.45 + rb, AY + 0.1, 0.012);
      const a = fatom(...A, { r0: 0.26, dr: 0.22, nr: 0.12, a0: A[0].map(() => Math.PI / 2).with(-1, 0) }), b = fatom(...B, { r0: 0.26, dr: 0.22, nr: 0.13, slots: B[0].map((n, k) => (k === B[0].length - 1 ? 8 : n)), skip: B[0].map((n, k) => (k === B[0].length - 1 ? 4 : undefined)), a0: B[0].map(() => Math.PI / 2).with(-1, 0) });
      add(a.g, AP.x, AP.y, AP.z); add(b.g, BP.x, BP.y, BP.z);
      const ea = outer(a)[0], RA = ea.R, RB = b.rings.at(-1).geometry.parameters.radius, f = fly(a.pt(RA, 0).add(AP), b.pt(RB, Math.PI).add(BP));
      const top = RB + 0.2, p1 = add(sign('+', 0.45), AP.x, AP.y + RA, 0.1), p2 = add(sign('−', 0.45), BP.x, BP.y + top, 0.1);
      const n1 = [grp(tag(t1, 0.05, '#d8c8ff', AP.x, BOT, 0.1), 'n' + i), grp(tag(t2, 0.05, '#d8f590', BP.x, BOT, 0.1), 'n' + i)];
      const n2 = [grp(tag(r1, 0.05, '#ffd27a', AP.x, BOT, 0.1), 'r' + i), grp(tag(r2, 0.05, '#ffd27a', BP.x, BOT, 0.1), 'r' + i)];
      beats.push((t) => {
        const tm = rest(t, P - 1, P); a.update(tm); b.update(tm); ea.e.visible = t < P + 3.0; ea.e.material = goldE; f(t, P + 3.0, P + 4.6);
        const g = ease(span(t, P + 4.6, P + 5.2)); a.rings.at(-1).visible = g < 1; a.rings.at(-1).scale.setScalar(Math.max(1e-4, 1 - g));
        grow(p1, t, P + 5.0); grow(p2, t, P + 5.2); n1.forEach((l) => K.popIn(l, t, P + 0.4, P + 2.9)); n2.forEach((l) => K.popIn(l, t, P + 5.4, P + 6.7));
      });
      return { x, P, AP, BP };
    };
    {
      const g = giveTake(2, [[2, 8, 8, 1], 19, 20], [[2, 7], 9, 10], 'potassium: 1 to give', 'fluorine: needs 1', 'gave 1 ✓', 'took 1 ✓');
      const l = tag('one for one: K⁺F⁻, 1 : 1 ✓', 0.055, '#ffd27a', g.x, BOT, 0.1); beats.push((t) => K.popIn(l, t, g.P + 6.8, end));
    }
    // ---------------------------------------------------------------- iv · calcium loses two: Ca²⁺
    {
      const { x, P } = stage(3), c = V(x, AY + 0.05, 0);
      const ca = fatom([2, 8, 8, 2], 20, 20, { r0: 0.24, dr: 0.21, nr: 0.13, a0: [Math.PI / 2, Math.PI / 2, Math.PI / 2, 0] }); add(ca.g, c.x, c.y, c.z);
      const two = outer(ca), R = two[0].R, fs = two.map((e, j) => fly(ca.pt(R, e.a0).add(c), c.clone().add(V(j ? 2.4 : -2.4, 0.6, 0)))), ch = add(sign('2+', 0.4), c.x, c.y + 0.82, 0.1);
      const l1 = tag('calcium 2, 8, 8, 2', 0.055, '#ffffff', x, BOT, 0.1), l2 = tag('loses two electrons: Ca²⁺ ✓', 0.055, '#ffd27a', x, BOT, 0.1);
      beats.push((t) => {
        ca.update(rest(t, P - 1, P)); two.forEach((e, j) => { e.e.visible = t < P + 2.8; e.e.material = goldE; fs[j](t, P + 2.8 + 0.3 * j, P + 4.2 + 0.3 * j, t < P + 4.6); });
        const g = ease(span(t, P + 4.4, P + 5.0)); ca.rings[3].visible = g < 1; ca.rings[3].scale.setScalar(Math.max(1e-4, 1 - g));
        grow(ch, t, P + 5.0); K.popIn(l1, t, P + 0.4, P + 2.7); K.popIn(l2, t, P + 5.2, end);
      });
    }
    // ---------------------------------------------------------------- v · two non-metals share: CO₂
    {
      const { x, P } = stage(4), m = add(U.ballMol([['O', -0.62, 0], ['C', 0, 0], ['O', 0.62, 0]], [[0, 1, 2], [1, 2, 2]]), x, AY + 0.15, 0); m.scale.setScalar(1.3);
      const es = [-1, 1].flatMap((s) => [[-0.05, 0.035], [0.05, 0.035], [-0.05, -0.035], [0.05, -0.035]].map(([dx, dy]) => { const e = U.electron(true); m.add(e); e.position.set(s * 0.31 + dx, dy, 0.16); return e; }));
      const l1 = tag('carbon and oxygen: two non-metals', 0.05, '#ffffff', x, BOT + 0.2, 0.1), l2 = tag('they share electrons: covalent CO₂ ✓', 0.05, '#ffd27a', x, BOT + 0.2, 0.1);
      beats.push((t) => {
        m.rotation.y = 0.35 * Math.sin((t - P) * 0.6);
        es.forEach((e, j) => { e.visible = t > P + 3.0 + 0.08 * j; e.scale.setScalar(Math.max(1e-4, back(span(t, P + 3.0 + 0.08 * j, P + 3.4 + 0.08 * j)))); });
        K.popIn(l1, t, P + 0.4, P + 2.9); K.popIn(l2, t, P + 4.0, end);
      });
    }
    // ---------------------------------------------------------------- vi · ionic: one loses, one gains
    {
      const g = giveTake(5, [[2, 8, 1], 11, 12], [[2, 8, 7], 17, 18], 'sodium', 'chlorine', 'loses 1 ✓', 'gains 1 ✓');
      const l = tag('lose AND gain: an ionic bond ✓', 0.055, '#ffd27a', g.x, BOT, 0.1); beats.push((t) => K.popIn(l, t, g.P + 6.8, end));
    }
    // ---------------------------------------------------------------- vii · O needs 2, each F needs 1: F₂O
    {
      const { x, P } = stage(6), OP = V(x, AY + 0.1, 0), LP = V(x - 1.1, AY + 0.1, 0.01), RP = V(x + 1.1, AY + 0.1, 0.012);
      const o = fatom([2, 6], 8, 8, { r0: 0.26, dr: 0.26, nr: 0.12, slots: [2, 8], skip: [undefined, 0], a0: [Math.PI / 2, 0] });
      const fl = fatom([2, 7], 9, 10, { r0: 0.26, dr: 0.26, nr: 0.12, slots: [2, 8], skip: [undefined, 0], a0: [Math.PI / 2, 0] }), fr = fatom([2, 7], 9, 10, { r0: 0.26, dr: 0.26, nr: 0.12, slots: [2, 8], skip: [undefined, 4], a0: [Math.PI / 2, 0] });
      add(o.g, OP.x, OP.y, OP.z); add(fl.g, LP.x, LP.y, LP.z); add(fr.g, RP.x, RP.y, RP.z);
      const s1 = U.sharer(fl, LP, o, OP, 1, { lone: false }), s2 = U.sharer(o, OP, fr, RP, 1, { lone: false });
      const n1 = [grp(tag('F: needs 1', 0.05, '#e8dc6a', LP.x, BOT, 0.1), 'f7'), grp(tag('O: needs 2', 0.05, '#ff9a8a', OP.x, BOT, 0.1), 'f7'), grp(tag('F: needs 1', 0.05, '#e8dc6a', RP.x, BOT, 0.1), 'f7')];
      const l2 = tag('one O shares with two F: F₂O ✓', 0.055, '#ffd27a', x, BOT, 0.1);
      beats.push((t) => {
        const tm = rest(t, P - 1, P);
        const u = ease(span(t, P + 3.4, P + 4.6)); s1.set(u, 0); s2.set(u, 0); o.update(tm); fl.update(tm); fr.update(tm);
        [...s1.shared.flat(), ...s2.shared.flat()].forEach((e) => { e.e.material = t > P + 3.4 ? goldE : U.blueE; });
        n1.forEach((l) => K.popIn(l, t, P + 0.4, P + 3.0)); K.popIn(l2, t, P + 5.0, end);
      });
    }
    // ---------------------------------------------------------------- viii · water has two shared pairs, not three
    {
      const { x, P } = stage(7), hx = Math.sin(52.25 * Math.PI / 180) * 0.75, hy = -Math.cos(52.25 * Math.PI / 180) * 0.75;
      const m = add(U.ballMol([['O', 0, 0], ['H', -hx, hy], ['H', hx, hy]], [[0, 1], [0, 2]], { r: { O: 0.26, H: 0.16 } }), x, AY + 0.35, 0);
      const pr = [-1, 1].map((s) => { const mid = V(s * hx / 2, hy / 2, 0), d = V(s * hx, hy, 0).normalize(), pp = V(-d.y, d.x, 0).multiplyScalar(0.05); return [mid.clone().add(pp), mid.clone().sub(pp)].map((q) => { const e = U.electron(true); m.add(e); e.position.copy(q).setZ(0.2); return e; }); });
      const nums = [-1, 1].map((s, j) => { const l = sign(String(j + 1), 0.34, '#ffd27a'); l.position.set(s * (hx / 2 + 0.28), hy / 2 + 0.1, 0.2); m.add(l); return l; });
      const l1 = tag('water: count its shared pairs', 0.055, '#ffffff', x, BOT, 0.1);
      const l2 = [grp(tag('H₂O has 2 shared pairs, not 3', 0.055, '#ffd27a', x, BOT + 0.3, 0.1), 'w8'), grp(tag('so (c) is the wrong statement ✓', 0.05, '#ffd27a', x, BOT + 0.08, 0.1), 'w8')];
      beats.push((t) => {
        pr.forEach((p, j) => p.forEach((e) => { e.scale.setScalar(1 + 0.6 * bump(t, P + 2.6 + 1.2 * j, 0.6)); }));
        nums.forEach((l, j) => grow(l, t, P + 2.6 + 1.2 * j)); K.popIn(l1, t, P + 0.4, P + 4.6); l2.forEach((l) => K.popIn(l, t, P + 4.8, end));
      });
    }
    // ---------------------------------------------------------------- ix · O²⁻ is 2, 8 (like neon); argon is 2, 8, 8
    {
      const { x, P } = stage(8), AP = V(x - 1.05, AY + 0.1, 0), BP = V(x + 1.05, AY + 0.1, 0.012);
      const o = fatom([2, 8], 8, 8, { r0: 0.3, dr: 0.28, nr: 0.12 }), ar = fatom([2, 8, 8], 18, 22, { r0: 0.28, dr: 0.26, nr: 0.14 });
      add(o.g, AP.x, AP.y, AP.z); add(ar.g, BP.x, BP.y, BP.z); const ch = add(sign('2−', 0.36), AP.x, AP.y + 0.8, 0.1);
      const n1 = [grp(tag('O²⁻: 2, 8', 0.055, '#ff9a8a', AP.x, BOT, 0.1), 'n9'), grp(tag('argon: 2, 8, 8', 0.055, '#c9a6ff', BP.x, BOT, 0.1), 'n9')];
      const l2 = [grp(tag('O²⁻ has only two shells: like neon', 0.05, '#ffd27a', x, BOT + 0.16, 0.1), 'r9'), grp(tag('not argon ✓ (Ca²⁺, S²⁻, K⁺ are 2, 8, 8)', 0.042, '#ffd27a', x, BOT - 0.05, 0.1), 'r9')];
      beats.push((t) => {
        o.update(t * 0.6); ar.update(t * 0.6); ringFlash(ar.rings[2], span(t, P + 3.4, P + 3.8) * (1 - span(t, P + 5.4, P + 5.8)));
        n1.forEach((l) => K.popIn(l, t, P + 0.4, P + 4.2)); l2.forEach((l) => K.popIn(l, t, P + 4.4, end));
      });
    }
    // ---------------------------------------------------------------- x · CaO, MgO, NaCl: metal + non-metal each time
    {
      const { x, P } = stage(9), XS = [x - 1.45, x, x + 1.45];
      const ion = (c, r, s) => { const g = new THREE.Group(); g.add(K.solid(new THREE.SphereGeometry(r, 32, 20), M.gloss(c))); const l = sign(s, r * 0.8); l.position.z = r + 0.01; g.add(l); return g; };
      const pairs = [['CaO', 0xe9e2cf, 0.2, '2+', 0xe0483c, 0.24, '2−'], ['MgO', 0xb4b8bf, 0.16, '2+', 0xe0483c, 0.24, '2−'], ['NaCl', 0x8c6fd8, 0.16, '+', 0x6fd07a, 0.28, '−']].map(([nm, c1, r1, s1, c2, r2, s2], i) => {
        const g = add(new THREE.Group(), XS[i], AY + 0.15, 0), a = ion(c1, r1, s1), b = ion(c2, r2, s2); a.position.x = -r1 + 0.01 - 0.005; b.position.x = r2 - 0.01 + 0.005; g.add(a, b);
        return { g, l: grp(tag(nm, 0.055, '#ffffff', XS[i], AY - 0.4, 0.1), 'x10'), t0: P + 0.4 + i * 1.1 };
      });
      const l2 = tag('metal + non-metal each time: all ionic ✓', 0.05, '#ffd27a', x, BOT, 0.1);
      beats.push((t) => {
        pairs.forEach(({ g, l, t0 }) => { const u = span(t, t0, t0 + 0.6); g.visible = t > t0; g.position.y = AY + 0.15 + 1.6 * (1 - easeIn(u)) + 0.03 * Math.sin(Math.PI * span(t, t0 + 0.6, t0 + 0.9)); K.popIn(l, t, t0 + 0.6, P + 4.4); });
        K.popIn(l2, t, P + 4.6, end);
      });
    }
    return U.finish();
  },
};
