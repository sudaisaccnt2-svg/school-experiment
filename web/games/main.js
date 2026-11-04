// Games page: a hub of cards (the player chooses), then one game per page load (?game=<id>&level=<n>).
import { createStage, $, params, sfx, progress } from './kit.js';
import { Atom } from './atom.js';

export const GAMES = [
  { id:'recall7', icon:'🔬', name:'Chapter 7 Practice', module:'./recall7.js', total:208, unit:7,
    text:'Explore first, then practise rules, exceptions, agents, cells, procedures and book details.',
    covers:'Tables 7.1–7.2 · all ten rules · boxes, figures and values · Short i–x · Long I–III, V · project prompt' },
  { id: 'quiz', icon: '❓', name: 'Quiz Quest', module: './quiz.js', total: 10,
    text: 'The 10 multiple-choice questions. You choose; a 3D model shows why.', covers: 'MCQs i – x', unit: 2 },
  { id: 'lab', icon: '⚛️', name: 'Atom Lab', module: './atomlab.js', total: 19,
    text: 'Build atoms, make isotopes, fix broken atoms and find the mystery element.',
    covers: 'Short Q i, iii, iv, viii, ix, xi', unit: 2 },
  { id: 'particles', icon: '🃏', name: 'Particle Cards', module: './particles.js', total: 29,
    text: 'Symbols, charges and masses of the electron, proton and neutron: give each card to its particle.',
    covers: 'Table 2.1 (p. 47)', unit: 2 },
  { id: 'stairs', icon: '🪜', name: 'Energy Stairs', module: './stairs.js', total: 8,
    text: 'Drop electrons on the energy stairs. Lowest step first! Write the configuration.',
    covers: 'Short Q x · Long Q iv', unit: 2 },
  { id: 'seats', icon: '🪑', name: 'Shell Seats', module: './seats.js', total: 31,
    text: 'K L M N O, how many electrons each shell holds, and the s p d f sub-shells: tap and watch them fill.',
    covers: 'Shells 2n² · Table 2.2 · sub-shells s p d f · Table 2.3 (pp. 48–50)', unit: 2 },
  { id: 'aufbau', icon: '🧗', name: 'Aufbau Climb', module: './aufbau.js', total: 31,
    text: 'Which step fills first? Tap the diagonal chart in order, find what comes next, and place the next electron.',
    covers: 'Aufbau principle · 4s before 3d · diagonal rule (p.50)', unit: 2 },
  { id: 'configs', icon: '✍️', name: 'Config Writer', module: './configs.js', total: 38,
    text: 'Send each electron to its sub-shell, write configurations yourself, guess the element and catch the mistakes.',
    covers: 'Electronic configuration · Table 2.4 · Test Yourself (pp. 51–52) · Short Q x', unit: 2 },
  { id: 'isotopes', icon: '👯', name: 'Isotope Twins', module: './isotopes.js', total: 40,
    text: 'Twins or not? Count the neutrons, name the isotopes, find the most common one, and tell H₂O from D₂O.',
    covers: 'Isotopes of H, C, Cl, U · Tables 2.5 – 2.9 · heavy water (pp. 52–56) · Short Q iii', unit: 2 },
  { id: 'isouses', icon: '🩺', name: 'Isotope Jobs', module: './isouses.js', total: 32,
    text: 'Thyroid, smoke detector, old bones, luggage: send each isotope to its job.',
    covers: 'Uses of isotopes · carbon dating (pp. 57–58)', unit: 2 },
  { id: 'count', icon: '🔢', name: 'Neutron Counter', module: './counter.js', total: 7,
    text: 'Big atoms, easy maths: pour out the protons, count what is left.', covers: 'Long Q iii', unit: 2 },
  { id: 'match', icon: '🧩', name: 'Model Match', module: './match.js', total: 12,
    text: 'Rutherford or Bohr? Drop each idea on the right 3D model.', covers: 'Long Q i, ii · Short Q ii, v, vi, vii', unit: 2 },
  { id: 'light', icon: '💡', name: 'Light Jumps', module: './light.js', total: 4,
    text: 'Make the electron jump between orbits. Falling down makes light: bigger drop, bluer light.',
    covers: 'Electron jumps and light (Bohr, p.45)', unit: 2 },
  { id: 'spin', icon: '🌀', name: 'Spin Blocks', module: './spin.js', total: 7,
    text: 'Heavier, faster, wider: make the ball spin more. Solve m × v × r, then park electrons on whole blocks.',
    covers: 'Angular momentum mvr = nh/2π (Bohr, p.46)', unit: 2 },
  { id: 'cloud', icon: '✨', name: 'Electron Trails', module: './cloud.js', total: 12,
    text: 'See how each sub-shell sits inside its own shell, then name its shell and its shape.',
    covers: 'Shells and sub-shells · sub-shell shapes (pp. 49–50, Fig 2.8)', unit: 2 },
  // ---- Unit 3 · Periodic Table
  { id: 'quiz3', icon: '❓', name: 'Quiz Quest', module: './quiz3.js', total: 10, unit: 3,
    text: 'The 10 multiple-choice questions of Unit 3. You choose; a 3D table, bars or an atom shows why.', covers: 'MCQs i – x' },
  { id: 'ptbuild', icon: '🧱', name: 'Table Builder', module: './ptbuild.js', total: 286, unit: 3,
    text: 'Explore the table first, then symbols, numbers, periods, places, building rows, the missing tile and history. Last: 10-second speed rounds.',
    covers: 'Symbols · periods 2, 8, 8, 18, 18, 32 · Moseley and the periodic law (pp. 66–69, 72) · Long Q i' },
  { id: 'families', icon: '👪', name: 'Family Names', module: './families.js', total: 40, unit: 3,
    text: 'Halogens, noble gases, alkali metals: name the families, find them, give the group number, find the regions.',
    covers: 'Groups and families · A and B groups · Test Yourself (pp. 69–72) · Short Q i, vii – x' },
  { id: 'metalsort', icon: '🔩', name: 'Metal or Not', module: './metalsort.js', total: 32, unit: 3,
    text: 'Drop each element in its bin: metal, metalloid or non-metal. Then find them on the table.',
    covers: 'Metals, non-metals, metalloids (p. 67)' },
  { id: 'trends', icon: '↗️', name: 'Trend Arrows', module: './trends.js', total: 17, unit: 3,
    text: 'Across a period or down a group: does it go up, down or stay the same? Then the book values rise as bars.',
    covers: 'Fig 3.9 · radius, ionization energy, electron affinity, electronegativity, shielding (pp. 72–87) · Long Q ii – iv' },
  { id: 'finder', icon: '🔎', name: 'Element Finder', module: './finder.js', total: 14, unit: 3,
    text: 'An atom turns in front of the periodic table. Where does it live? Tap its tile.', covers: 'Short Q iii, vi · Test Yourself' },
  { id: 'duel', icon: '⚖️', name: 'Trend Duel', module: './duel.js', total: 12, unit: 3,
    text: 'Atoms drawn to their real sizes. Which is bigger? Which holds its electrons tighter?',
    covers: 'Short Q ii, iv, v · Long Q ii, iii, iv' },
  { id: 'blocks', icon: '🎨', name: 'Block Painter', module: './blocks.js', total: 5, unit: 3,
    text: 'Paint the grey table: s, p, d and f blocks. Then find the transition elements, a lanthanide and sulphur.',
    covers: 'Short Q vii, viii, ix, x' },
  // ---- Unit 4 · Structure of Molecules
  { id: 'quiz4', icon: '❓', name: 'Quiz Quest', module: './quiz4.js', total: 10, unit: 4,
    text: 'The 10 multiple-choice questions of Unit 4. You choose; atoms, ions or a molecule show why.', covers: 'MCQs i – x' },
  { id: 'bondbuild', icon: '🔗', name: 'Bond Builder', module: './bondbuild.js', total: 44, unit: 4,
    text: 'Which ion does each atom make? Then tap the electrons that move or pair up until every shell is full.',
    covers: 'Short Q i, ii, iii · Test Yourself p.105' },
  { id: 'bondsort', icon: '🧲', name: 'Bond Sorter', module: './bondsort.js', total: 53, unit: 4,
    text: 'Ionic, polar or non-polar? First with the ruler, then with the numbers, then from memory.', covers: 'Short Q iv, vi, viii · Test Yourself p.108' },
  { id: 'shapelab', icon: '🧊', name: 'Shape Lab', module: './shapelab.js', total: 42, unit: 4,
    text: 'Molecules turn in 3D. Name the shape, the bond angle, then say if the molecule is polar.', covers: 'Short Q vii · Fig 4.18' },
  { id: 'why4', icon: '💡', name: 'Bond Reasons', module: './why4.js', total: 160, unit: 4,
    text: 'The Key Points by heart, then the reasons: watch the atoms, pick the why, count the pairs of a Lewis structure.',
    covers: 'Key Points p.117 · Short Q v, ix, x · Long Q i, ii, iii, iv, v' },
  { id: 'quiz5', icon: '❓', name: 'Quiz Quest', module: './quiz5.js', total: 10, unit: 5,
    text: 'The 10 multiple-choice questions of Unit 5. You choose; moving molecules show why.', covers: 'MCQs i – x' },
  { id: 'gaslab', icon: '🎈', name: 'Gas Law Lab', module: './gaslab.js', total: 16, unit: 5,
    text: 'A piston, a dial and a thermometer. First: bigger or smaller? Then the numbers, with the working.',
    covers: 'Numericals i – v · Examples 5.1, 5.2 · Practice 5.1 · Long Q i, v' },
  { id: 'statesort', icon: '🧪', name: 'State Sorter', module: './statesort.js', total: 27, unit: 5,
    text: 'Solid, liquid or gas? Crystal or amorphous? Read the particles in the jar.',
    covers: 'Activity 5.4 · Long Q iv · Project Work' },
  { id: 'whylab', icon: '🔬', name: 'Why? Lab', module: './whylab.js', total: 9, unit: 5,
    text: 'Small 3D experiments. Watch, then pick the reason.', covers: 'Short Q i – vi · Long Q ii' },
  { id: 'quiz6', icon: '❓', name: 'Quiz Quest', module: './quiz6.js', total: 10, unit: 6,
    text: 'The 10 multiple-choice questions of Unit 6. You choose; beakers and marbles show why.', covers: 'MCQs i – x' },
  { id: 'molarlab', icon: '⚖️', name: 'Molarity Lab', module: './molarlab.js', total: 22, unit: 6,
    text: 'Learn the molar masses, then find the molarity: grams on a balance, a litre cube, the moles roll in.',
    covers: 'Numericals i – v · Examples 6.1 – 6.5 · Practice 6.1 · Skill Development' },
  { id: 'mixsort', icon: '🥛', name: 'Mixture Sorter', module: './mixsort.js', total: 28, unit: 6,
    text: 'Solution, colloid or suspension? Pure or mixture? Then see the particles.',
    covers: 'Short Q iii · Long Q i · Project Work' },
  { id: 'sollab', icon: '🔬', name: 'Solution Lab', module: './sollab.js', total: 13, unit: 6,
    text: 'Small 3D experiments. Watch, then pick the answer.',
    covers: 'Short Q i, ii, iv, v · Long Q iii, iv · Activity 6.2 · Point to Ponder' },
  // ---- Unit 7 · Electrochemistry
  { id: 'quiz7', icon: '❓', name: 'Quiz Quest', module: './quiz7.js', total: 10, unit: 7,
    text: 'The 10 multiple-choice questions of Unit 7. You choose; atoms, electrons and cells show why.', covers: 'MCQs i – x' },
  { id: 'oxlab', icon: '🏷️', name: 'Oxidation Number Lab', module: './oxlab.js', total: 27, unit: 7,
    text: 'First the rules (O is −2, H is +1 …), then find the missing number: the badges must add up to the charge.',
    covers: 'Short Q ii, vii · Examples 7.1, 7.2 · Practice 7.1' },
  { id: 'redoxsort', icon: '🕵️', name: 'Redox Detective', module: './redoxsort.js', total: 10, unit: 7,
    text: 'Who gave the electrons? Who took them? Pick, then watch the electrons hop.',
    covers: 'Short Q i, vi · Examples 7.4, 7.5 · Long Q II' },
  { id: 'celllab', icon: '🔋', name: 'Cell Lab', module: './celllab.js', total: 14, unit: 7,
    text: 'Small 3D cells: electrolytes, the Daniell cell, the Nelson cell, plating and rust. Watch, then pick.',
    covers: 'Short Q iii, iv, v, viii, ix, x · Long Q I, III, V' },
  // ---- Unit 8 · Chemical Reactivity
  { id: 'quiz8', icon: '❓', name: 'Quiz Quest', module: './quiz8.js', total: 10, unit: 8,
    text: 'The 10 multiple-choice questions of Unit 8. Halogen jars, flames and metals show why.', covers: 'MCQs i – x' },
  { id: 'reactlab', icon: '🔥', name: 'Metal Reactions Lab', module: './reactlab.js', total: 44, unit: 8,
    text: 'Metals burn, fizz and explode. Read what you see: which metal, which product, which is more reactive?',
    covers: 'Table 8.1 · Short Q ii, iv, v, ix · Long Q I, II b' },
  { id: 'halolab', icon: '⚔️', name: 'Halogen Duel', module: './halolab.js', total: 46, unit: 8,
    text: 'Green gas, red-brown liquid, black solid: which halogen? Which one pushes the other out?',
    covers: 'Short Q viii, x · Test Yourself p.245 · Long Q V' },
  { id: 'metalprops', icon: '⚖️', name: 'Metal or Non-metal?', module: './metalprops.js', total: 40, unit: 8,
    text: 'Sort card by card: metal or non-metal, soft or hard, free or combined, and what each metal is used for.',
    covers: 'Short Q i, iii, vi, vii · Long Q II a, III, IV · Activity 8.2' },
];
export const UNITS = { 2: 'Unit 2 · Structure of an Atom', 3: 'Unit 3 · Periodic Table', 4: 'Unit 4 · Structure of Molecules',
  5: 'Unit 5 · Physical States of Matter', 6: 'Unit 6 · Solutions', 7: 'Unit 7 · Electrochemistry', 8: 'Unit 8 · Chemical Reactivity' };

const showError = (m) => { const e = $('error'); e.hidden = false; e.textContent += m + '\n'; };
addEventListener('error', (e) => e.error && showError(e.error.message));
addEventListener('unhandledrejection', (e) => showError(String(e.reason?.message || e.reason)));

const stage = createStage($('stage'));
window._g = { stage };
$('muteBtn').textContent = sfx.muted ? '🔇' : '🔊';
$('muteBtn').onclick = () => { $('muteBtn').textContent = sfx.toggle() ? '🔇' : '🔊'; };

const id = params.get('game');
const game = GAMES.find((g) => g.id === id);
const unit = game ? game.unit : Number(params.get('unit')) || 2;
$('backBtn').href = 'games.html?unit=' + unit;
$('filmsBtn').href = 'index.html?unit=' + unit;
if (!game) {
  // hub: a slowly turning carbon atom behind the cards
  $('backBtn').hidden = true; $('hub').hidden = false;
  const a = new Atom(stage, { tags: false, pos: [0, 0.3, -4] });
  a.setNucleus(6, 6); a.setConfig([2, 4]);
  stage.onFrame((dt) => { a.group.rotation.y += dt * 0.15; });
  $('hubSub').textContent = UNITS[unit] + ': the exercise as games. Choose one!';
  $('unitTabs').innerHTML = Object.entries(UNITS).map(([u, t]) =>
    `<a href="games.html?unit=${u}" class="${+u === unit ? 'on' : ''}">${t.split(' · ')[0]}</a>`).join('');
  $('cards').innerHTML = GAMES.filter((g) => g.unit === unit).map((g) => {
    const p = progress.get(g.id), won = Object.keys(p).length;
    return `<a class="gcard" href="games.html?game=${g.id}"><span class="icon">${g.icon}</span>
      <b>${g.name}</b><span>${g.text}</span><span class="covers">${g.covers}</span>
      <span class="prog">${won ? `★ ${won} / ${g.total}` : 'new'}</span></a>`;
  }).join('');
  document.title = 'READY';
} else {
  $('gtitle').textContent = game.icon + ' ' + game.name;
  document.body.classList.add('g-' + game.id);
  const level = params.has('level') ? Number(params.get('level')) : undefined;
  import(game.module).then((m) => {
    window._g.game = m.start({ stage, ui: $('ui'), level });
    document.title = 'READY';
  });
}
