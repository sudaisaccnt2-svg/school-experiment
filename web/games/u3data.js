// Unit 3 element data for the games (same as scripts/u3/u3lib.py). Book values as printed (Tables 3.1, 3.3, 3.4,
// Fig 3.8); the book's He sits in group VIIIA, so it counts as p-block here.
const NAMES = 'H Hydrogen,He Helium,Li Lithium,Be Beryllium,B Boron,C Carbon,N Nitrogen,O Oxygen,F Fluorine,Ne Neon,Na Sodium,Mg Magnesium,Al Aluminium,Si Silicon,P Phosphorus,S Sulphur,Cl Chlorine,Ar Argon,K Potassium,Ca Calcium,Sc Scandium,Ti Titanium,V Vanadium,Cr Chromium,Mn Manganese,Fe Iron,Co Cobalt,Ni Nickel,Cu Copper,Zn Zinc,Ga Gallium,Ge Germanium,As Arsenic,Se Selenium,Br Bromine,Kr Krypton,Rb Rubidium,Sr Strontium,Y Yttrium,Zr Zirconium,Nb Niobium,Mo Molybdenum,Tc Technetium,Ru Ruthenium,Rh Rhodium,Pd Palladium,Ag Silver,Cd Cadmium,In Indium,Sn Tin,Sb Antimony,Te Tellurium,I Iodine,Xe Xenon,Cs Cesium,Ba Barium,La Lanthanum,Ce Cerium,Pr Praseodymium,Nd Neodymium,Pm Promethium,Sm Samarium,Eu Europium,Gd Gadolinium,Tb Terbium,Dy Dysprosium,Ho Holmium,Er Erbium,Tm Thulium,Yb Ytterbium,Lu Lutetium,Hf Hafnium,Ta Tantalum,W Tungsten,Re Rhenium,Os Osmium,Ir Iridium,Pt Platinum,Au Gold,Hg Mercury,Tl Thallium,Pb Lead,Bi Bismuth,Po Polonium,At Astatine,Rn Radon,Fr Francium,Ra Radium,Ac Actinium,Th Thorium,Pa Protactinium,U Uranium,Np Neptunium,Pu Plutonium,Am Americium,Cm Curium,Bk Berkelium,Cf Californium,Es Einsteinium,Fm Fermium,Md Mendelevium,No Nobelium,Lr Lawrencium,Rf Rutherfordium,Db Dubnium,Sg Seaborgium,Bh Bohrium,Hs Hassium,Mt Meitnerium,Ds Darmstadtium,Rg Roentgenium,Cn Copernicium,Nh Nihonium,Fl Flerovium,Mc Moscovium,Lv Livermorium,Ts Tennessine,Og Oganesson';
export const SYM = [null], NAME = [null];
for (const p of NAMES.split(',')) { const [s, n] = p.split(' '); SYM.push(s); NAME.push(n); }
export const ZOF = Object.fromEntries(SYM.map((s, z) => [s, z]).slice(1));
const tab = (s) => { const t = s.split(' '), o = {}; for (let i = 0; i < t.length; i += 2) o[t[i]] = parseFloat(t[i + 1]); return o; };
export const RADIUS = tab('H .37 He .49 Li 1.23 Be .89 B .80 C .77 N .74 O .74 F .72 Ne .51 Na 1.35 Mg 1.36 Al 1.25 Si 1.17 P 1.10 S 1.04 Cl .99 Ar .88 K 2.03 Ca 1.74 Ga 1.25 Ge 1.22 As 1.21 Se 1.17 Br 1.14 Kr 1.03 Rb 2.16 Sr 1.91 In 1.59 Sn 1.41 Sb 1.41 Te 1.37 I 1.53 Xe 1.24 Cs 2.35 Ba 1.98 Tl 1.55 Pb 1.54 Bi 1.52 Po 1.53 At 1.63 Rn 1.34');
export const IE1 = tab('H 1312 He 2372 Li 520 Be 899 B 801 C 1086 N 1402 O 1314 F 1681 Ne 2081 Na 496 Mg 738 Al 578 Si 786 P 1012 S 1000 Cl 1251 Ar 1521 K 419 Ca 590 Ga 579 Ge 762 As 947 Se 941 Br 1140 Kr 1351 Rb 403 Sr 549 In 558 Sn 709 Sb 834 Te 869 I 1008 Xe 1170 Cs 376 Ba 502 Tl 589 Pb 716 Bi 703 Po 812 At 1002 Rn 1038');
export const EA = tab('H -72.8 He +21 Li -59.6 Be +241 B -26.7 C -122 N 0 O -141 F -328 Ne +29 Na -52.9 Mg +230 Al -42.5 Si -134 P -72.0 S -200 Cl -349 Ar +34 K -48.4 Ca +156 Ga -28.9 Ge -119 As -78.2 Se -195 Br -325 Kr +39 Rb -46.9 Sr +167 In -28.9 Sn -107 Sb -103 Te -190 I -295 Xe +40 Cs -45.5 Ba +52 Tl -19.3 Pb -35.1 Bi -91.3 Po -183 At -270 Rn +41');
export const EN = tab('H 2.1 Li 1.0 Be 1.6 B 2.0 C 2.5 N 3.0 O 3.5 F 4.0 Na 0.9 Mg 1.2 Al 1.5 Si 1.8 P 2.1 S 2.5 Cl 3.0 K 0.8 Ca 1.0 Sc 1.3 Ti 1.5 V 1.6 Cr 1.6 Mn 1.5 Fe 1.8 Co 1.9 Ni 1.9 Cu 1.9 Zn 1.6 Ga 1.6 Ge 1.8 As 2.0 Se 2.4 Br 2.8 Rb 0.8 Sr 1.0 Y 1.2 Zr 1.4 Nb 1.6 Mo 1.8 Tc 1.9 Ru 2.2 Rh 2.2 Pd 2.2 Ag 1.9 Cd 1.7 In 1.7 Sn 1.8 Sb 1.9 Te 2.1 I 2.5 Cs 0.7 Ba 0.9 La 1.0 Hf 1.3 Ta 1.5 W 1.7 Re 1.9 Os 2.2 Ir 2.2 Pt 2.2 Au 2.4 Hg 1.9 Tl 1.8 Pb 1.9 Bi 1.9 Po 2.0 At 2.1');

export const periodOf = (z) => (z <= 2 ? 1 : z <= 10 ? 2 : z <= 18 ? 3 : z <= 36 ? 4 : z <= 54 ? 5 : z <= 86 ? 6 : 7);
/** [row, col] in the book layout; rows 8 / 9 = the lanthanide / actinide rows (cols 4-17). */
export function place(z) {
  const p = periodOf(z);
  if (p === 1) return [1, z === 1 ? 1 : 18];
  if (p <= 3) { const k = z - (p === 2 ? 3 : 11); return [p, k < 2 ? k + 1 : k + 11]; }
  if (p <= 5) return [p, z - (p === 4 ? 19 : 37) + 1];
  if (p === 6) return z <= 57 ? [6, z - 54] : z <= 71 ? [8, z - 54] : [6, z - 68];
  return z <= 89 ? [7, z - 86] : z <= 103 ? [9, z - 86] : [7, z - 100];
}
export const GROUP = { 1: 'IA', 2: 'IIA', 3: 'IIIB', 4: 'IVB', 5: 'VB', 6: 'VIB', 7: 'VIIB', 8: 'VIIIB', 9: 'VIIIB', 10: 'VIIIB',
  11: 'IB', 12: 'IIB', 13: 'IIIA', 14: 'IVA', 15: 'VA', 16: 'VIA', 17: 'VIIA', 18: 'VIIIA' };
export const A_COLS = [1, 2, 13, 14, 15, 16, 17, 18];
export const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
const METALLOID = new Set([5, 14, 32, 33, 51, 52]), NONMETAL = new Set([1, 6, 7, 8, 15, 16, 34]),
  HALOGEN = new Set([9, 17, 35, 53, 85, 117]);
export function category(z) {
  const [r, c] = place(z);
  if (r === 8) return 'lanthanide'; if (r === 9) return 'actinide'; if (c === 18) return 'noble';
  if (HALOGEN.has(z)) return 'halogen'; if (NONMETAL.has(z)) return 'nonmetal'; if (METALLOID.has(z)) return 'metalloid';
  if (c === 1) return 'alkali'; if (c === 2) return 'alkaline'; if (c >= 3 && c <= 12) return 'transition';
  return 'metal';
}
export function block(z) {
  const [r, c] = place(z);
  if (z === 2) return 'p';
  if (r >= 8) return 'f';
  return c <= 2 ? 's' : c <= 12 ? 'd' : 'p';
}
export const CAT_COLOR = { alkali: '#ff6b52', alkaline: '#ffad40', transition: '#5294ff', metal: '#59d1db', metalloid: '#9ee659',
  nonmetal: '#4dff8c', halogen: '#ffeb59', noble: '#bd80ff', lanthanide: '#ff73c7', actinide: '#f25273' };
export const BLOCK_COLOR = { s: '#ff7359', p: '#59ff8c', d: '#5999ff', f: '#ff80d9' };
/** electrons per shell (K, L, M ...) by the filling order: fine for the elements the games use (Z ≤ 56). */
export function shells(z) {
  const order = [[1, 2], [2, 2], [2, 6], [3, 2], [3, 6], [4, 2], [3, 10], [4, 6], [5, 2], [4, 10], [5, 6], [6, 2]];
  const out = []; let left = z;
  for (const [n, cap] of order) { const k = Math.min(cap, left); out[n - 1] = (out[n - 1] || 0) + k; left -= k; if (!left) break; }
  return Array.from(out, (v) => v || 0);
}
