// Chapter 7: student-first repair of the original book-order storyboards.
// Beat sheet/prerequisite questions: docs/COVERAGE_U7.md, written before this implementation.
// Review evidence and outstanding checks live in that file; this header does not claim a visual pass.
import * as THREE from 'three';
import * as K from './kit.js';
import { BUILDERS } from './electrochem-kit.js';
const V=(...a)=>new THREE.Vector3(...a);
const MICRO=new Set(['reaction','transfer','charge','rule','numbers','sharing','carbonNumbers','waterIons']);
const b=(type,caption,o={},duration=10)=>{
 const limit=type==='charge'?6.2+((o.n??1)-1)*1.2:type==='sharing'?7:type==='waterIons'?7.5:type==='chromium'?9.5:type==='alloy'?7:type==='cell'&&o.stage==='sludge'?6.8:type==='cell'&&o.stage==='setup'?9.2:type==='protect'&&o.kind!=='sacrifice'?7.5:Infinity;
 return {type,caption,...o,duration:Math.min(duration,limit)};
};
const rule=(caption,name,items,result=caption)=>b('rule',caption,{name,items,result},4.05+items.length*.85);
const num=(caption,name,groups,unknown,answer,charge=0)=>b('numbers',caption,{name,groups,unknown,answer,charge},9+Math.abs(answer)*.25);
const tx=(caption,left,right,n,beforeLeft,beforeRight,afterLeft,afterRight,result)=>b('transfer',caption,{left,right,n,beforeLeft,beforeRight,afterLeft,afterRight,result},6+(n-1)*1.2);
const cc=(caption,o)=>b('cell',caption,o,10);
const dc=(caption,stage)=>b('daniell',caption,{stage},stage==='ions'?11:9);
const ind=(caption,kind,stage)=>b('industrial',caption,{kind,stage},kind==='downs'&&stage==='cathode'?11.5:10);
const r=(s,a,z)=>[s,[a[0],a[1],a[2]??0],[z[0],z[1],z[2]??0]];
const co2=()=>[
 r('C',[-1.1,1],[0,1]),r('O',[.65,1],[-.55,1]),r('O',[1.2,1],[.55,1])];
const ammonia=(reverse=false)=>{
 const atoms=[];
 [-.85,.85].forEach((x,i)=>{
   const N=[(i-.5)*.5,1.25,0],NH=[x,1,0];atoms.push(r('N',reverse?NH:N,reverse?N:NH));
   [[-.42,.25],[.42,.25],[0,-.47]].forEach(([dx,dy],j)=>{const h2=[(j-1)*.8+(i-.5)*.25,2.1,0],h=[x+dx,1+dy,0];atoms.push(r('H',reverse?h:h2,reverse?h2:h));});
 });return atoms;
};
const loseH=()=>{
 const atoms=[];
 [-.85,.85].forEach((x,i)=>{atoms.push(r('N',[x,.85],[(i-.5)*.58,.75]));[[-.35,.26],[.35,.26],[0,-.4]].forEach(([dx,dy],j)=>{const k=i*3+j;atoms.push(r('H',[x+dx,.85+dy],[(k%3-1)*1.0-.26,1.8+Math.floor(k/3)*.6]));});});
 for(let k=0;k<6;k++)atoms.push(r('Cl',[(k%3-1)*1.0,2.75+(k<3?-.29:.29)],[(k%3-1)*1.0+.26,1.8+Math.floor(k/3)*.6]));
 return atoms;
};
const defs={
 '701':{question:'What changes during oxidation?',beats:[
  b('series','How can chemicals light a bulb?',{},8),
  b('rust','Rust also comes from a chemical change',{result:'iron changes at its surface'},9),
  b('reaction','Carbon gains oxygen: oxidation',{atoms:co2(),names:[['carbon',[-1.1,.45,0]],['oxygen',[.9,.45,0]]],products:[['carbon dioxide',[0,.4,0]]],eq:'C + O₂ → CO₂'},9.5),
  b('reaction','Ammonia loses hydrogen to chlorine',{atoms:loseH(),names:[['two ammonia molecules',[0,.12,0]]],products:[['nitrogen remains: oxidized',[0,.12,0]]],eq:'2NH₃ + 3Cl₂ → N₂ + 6HCl'},11),
  b('charge','Iron loses one electron: oxidation',{atom:'Fe',before:'iron ion Fe²⁺',after:'iron ion Fe³⁺',n:1,result:'lost one negative electron'},8),
  b('charge','Oxidation means gain oxygen or lose hydrogen/electrons',{atom:'Fe',before:'Fe²⁺',after:'Fe³⁺',n:1,result:'Fe²⁺ → Fe³⁺: electron lost'},7),
 ]},
 '702':{question:'What changes during reduction?',beats:[
  b('reaction','Heat releases oxygen from mercury oxide',{heat:true,atoms:[r('Hg',[-.9,1.2],[-.95,.9]),r('O',[-.38,1.2],[-.25,1.8]),r('Hg',[.5,1.2],[.95,.9]),r('O',[1.02,1.2],[.25,1.8])],names:[['mercury oxide (HgO)',[0,2.35,0]]],products:[['mercury has lost oxygen',[0,.35,0]]],eq:'2HgO → 2Hg + O₂'},10),
  b('reaction','Nitrogen gains hydrogen: reduction',{atoms:ammonia(),names:[['nitrogen + hydrogen',[0,.2,0]]],products:[['two ammonia molecules',[0,.2,0]]],eq:'N₂ + 3H₂ → 2NH₃'},10),
  b('charge','Tin gains two electrons: reduction',{atom:'Sn',before:'tin ion Sn⁴⁺',after:'tin ion Sn²⁺',gain:true,n:2,result:'two negative electrons lower its charge'},9),
  tx('One loses; the other gains','Na','Cl',1,'sodium atom','chlorine atom','Na⁺: oxidized','Cl⁻: reduced','both changes together: redox'),
  b('firefly','Oxygen lets firefly cells produce light',{},10),
  b('charge','Reduction gains electrons, hydrogen, or loses oxygen',{atom:'Sn',before:'Sn⁴⁺',after:'Sn²⁺',gain:true,n:2,result:'gaining electrons is reduction'},7.4),
 ]},
 '703':{question:'What does an oxidation number mean?',beats:[
  tx('First recall a real ion charge','Na','Cl',1,'sodium atom','chlorine atom','Na⁺: charge +1','Cl⁻: charge −1','electron transferred: real ions'),
  b('sharing','Water keeps its electrons shared',{},9),
  rule('Assign shared electrons toward oxygen','oxidation numbers in water',[['H',1],['O',-2],['H',1]],'apparent charge assigned to each atom'),
  b('chromium','Chromium’s number distinguishes its coloured solutions',{},14),
  rule('Numbers help name compounds and balance reactions','apparent charge on an atom',[['Cr',2],['Cr',3],['Cr',6]],'same element, different oxidation states'),
 ]},
 '704':{question:'How do we assign oxidation numbers?',beats:[
  rule('A free element has oxidation number zero','H₂: a free element',[['H',0],['H',0]],'not combined with another element'),
  rule('A simple ion’s number equals its charge','simple ions',[['Na',1],['Ca',2],['Al',3],['Br',-1]]),
  rule('Hydrogen is usually +1','H₂O',[['H',1],['O',-2],['H',1]]),
  rule('In a metal hydride, hydrogen is −1','NaH: sodium hydride',[['Na',1],['H',-1]]),
  rule('Oxygen is usually −2','H₂O',[['H',1],['O',-2],['H',1]]),
  rule('In peroxide, each oxygen is −1','H₂O₂: hydrogen peroxide',[['H',1],['O',-1],['O',-1],['H',1]]),
  rule('With fluorine, oxygen can be positive','OF₂: oxygen difluoride',[['F',-1],['O',2],['F',-1]]),
  rule('Groups I, II, III: +1, +2, +3','in compounds',[['Na',1],['Mg',2],['Al',3]]),
  rule('A binary halogen usually has number −1','NaCl: two elements',[['Na',1],['Cl',-1]]),
  num('A neutral molecule’s numbers add to zero','H₂SO₄',[['H',2,1],['O',4,-2]],'S',6),
  num('An ion’s numbers add to its charge','MnO₄⁻',[['O',4,-2]],'Mn',7,-1),
  b('sharing','Oxygen attracts shared electrons more strongly',{},7),
  b('carbonNumbers','Use known numbers to match the total charge',{},7),
 ]},
 '705':{question:'How do we find the unknown number?',beats:[
  num('Five chlorines each contribute −1','PCl₅',[['Cl',5,-1]],'P',5),
  num('Nitrite must keep one negative charge overall','NO₂⁻',[['O',2,-2]],'N',3,-1),
  num('In carbon monoxide, the total is zero','CO',[['O',1,-2]],'C',2),
  num('Sulphite must keep two negative charges overall','SO₃²⁻',[['O',3,-2]],'S',4,-2),
  rule('Iron commonly has two oxidation states','different iron compounds',[['Fe',2],['Fe',3]]),
  rule('Copper also has different oxidation states','different copper compounds',[['Cu',1],['Cu',2],['Cu',3]]),
  rule('Manganese has six listed oxidation states','different manganese compounds',[['Mn',2],['Mn',3],['Mn',4]],'+5, +6, +7 also occur: practise in game'),
  num('Match the total charge to find the unknown','CO',[['O',1,-2]],'C',2),
 ]},
 '706':{question:'Which reactant changes the other?',beats:[
  tx('The electron taker oxidizes its partner','Na','Cl',1,'sodium gives','chlorine takes','Na⁺: oxidized','Cl⁻: reduced','taker = oxidizing agent'),
  b('reaction','Copper oxide gives oxygen to zinc',{atoms:[r('Zn',[-1.1,1],[-1.1,1]),r('Cu',[.65,1],[1,1]),r('O',[1.2,1],[-.55,1])],names:[['zinc',[-1.1,.4,0]],['copper oxide',[.9,.4,0]]],products:[['zinc oxide',[-.85,.4,0]],['copper',[1,.4,0]]],eq:'Zn + CuO → ZnO + Cu'},10),
  rule('CuO is reduced while it oxidizes zinc','Cu in CuO → Cu metal',[['Cu',2],['Cu',0]],'oxidizing agent: CuO'),
  tx('Tin gives two electrons to chlorine','Sn','Cl',2,'Sn²⁺','Cl₂','Sn⁴⁺: oxidized','2Cl⁻: reduced','Cl₂ is the oxidizing agent'),
  tx('The electron giver reduces its partner','Na','Cl',1,'sodium gives','chlorine takes','Na⁺: oxidized','Cl⁻: reduced','giver = reducing agent'),
  b('reaction','Hydrogen sulphide gives hydrogen to bromine',{atoms:[r('S',[-1,1],[-1,1]),r('H',[-1.4,.65],[.42,.7]),r('H',[-.6,.65],[.42,1.5]),r('Br',[.9,.9],[.9,.7]),r('Br',[.9,1.4],[.9,1.5])],names:[['hydrogen sulphide',[-1,.25,0]],['bromine',[1,2,0]]],products:[['sulphur: −2 → 0',[-1,.25,0]],['hydrogen bromide',[.8,2,0]]],eq:'Br₂ + H₂S → 2HBr + S'},10),
  rule('H₂S is oxidized while it reduces bromine','sulphur in H₂S → sulphur',[['S',-2],['S',0]],'reducing agent: H₂S'),
  tx('The giver reduces; the electron taker oxidizes','Na','Cl',1,'sodium gives','chlorine takes','Na⁺: oxidized','Cl⁻: reduced','giver = reducing agent; taker = oxidizing agent'),
 ]},
 '707':{question:'How do the two redox halves fit together?',beats:[
  b('displacement','Zinc enters blue copper sulphate solution',{},12),
  tx('Zinc loses exactly what copper ions gain','Zn','Cu',2,'zinc atom','copper ion Cu²⁺','Zn²⁺: oxidized','Cu: reduced','two electrons lost = two gained'),
  tx('Two sodium atoms reduce one iodine molecule','Na','I',2,'2Na atoms','I₂ molecule','2Na⁺','2I⁻','oxidation and reduction halves add together'),
  b('colorTest','How can we test an oxidizing agent?',{before:0xb7d7ed,after:0x86421b,name:'potassium iodide (KI)',add:'add oxidizing agent',result:'brown iodine forms'},10),
  b('colorTest','How can we test a reducing agent?',{before:0xe68a25,after:0x3f9d54,name:'acidified potassium dichromate',add:'add reducing agent',result:'orange becomes green'},10),
  b('colorTest','Ozone can remove colour by oxidation',{before:0xb53d95,after:0xc9e1ed,name:'coloured organic material',add:'ozone (O₃)',result:'oxidation removes colour'},9),
  tx('Redox pairs equal electron loss and gain','Zn','Cu',2,'Zn','Cu²⁺','Zn²⁺','Cu','two electrons lost = two gained'),
 ]},
 '708':{question:'Why do some solutions carry electricity?',beats:[
  b('series','A cell exchanges chemical and electrical energy',{},8),
  b('dissolve','Salt’s existing ions become free in water',{},10),
  b('conduct','Sugar stays as molecules: the bulb stays off',{name:'sugar: non-electrolyte',level:0,result:'no ions: no current'},9),
  b('conduct','Weak acid makes only a few ions',{name:'acetic acid: weak electrolyte',level:.25,result:'few ions: dim bulb'},9),
  b('conduct','Salt releases many ions: the bulb shines',{name:'salt: strong electrolyte',level:1,result:'many mobile ions: bright bulb'},9),
  b('comparison','Compare: no ions, few ions, many ions',{},4),
  cc('Electrodes connect the liquid to the wires',{metal:'C',target:'C',bath:'electrolyte',stage:'setup'}),
  b('electrolysis','Positive ions go toward the negative cathode',{stage:'cathode'},10),
  b('electrolysis','Mobile ions carry current toward their opposite electrodes',{stage:'anode'},10),
 ]},
 '709':{question:'How does electricity break down molten salt?',beats:[
  b('dissolve','Melting frees salt’s ions to move',{molten:true},10),
  b('electrolysis','Connect the anode + and the cathode −',{stage:'parts'},8),
  b('electrolysis','Chloride loses electrons at the anode',{stage:'anode'},10),
  b('charge','Each chloride ion gives up one electron',{atom:'Cl',before:'chloride Cl⁻',after:'chlorine atom Cl',n:1,result:'oxidation at the anode'},8),
  b('reaction','Two chlorine atoms join as chlorine gas',{atoms:[r('Cl',[-.9,1.1],[-.28,1.5]),r('Cl',[.9,1.1],[.28,1.5])],names:[['chlorine atoms',[0,.4,0]]],products:[['chlorine gas Cl₂',[0,.5,0]]]},8),
  b('charge','Sodium ions receive electrons at the cathode',{atom:'Na',before:'sodium ion Na⁺',after:'sodium metal Na',gain:true,n:1,result:'reduction at the cathode'},8),
  b('electrolysis','Current produces sodium and chlorine separately',{stage:'cathode'},10),
 ]},
 '710':{question:'How do we obtain pure copper?',beats:[
  cc('Use impure copper + and pure copper −',{metal:'Cu',target:'Cu',bath:'CuSO₄ + H₂SO₄',stage:'setup'}),
  cc('Anode copper loses two electrons and dissolves',{metal:'Cu',target:'Cu',bath:'acidified copper sulphate',ion:'Cu²⁺',stage:'anode',anodeResult:'Cu → Cu²⁺ + 2e⁻'}),
  cc('Copper ions gain electrons at the pure sheet',{metal:'Cu',target:'Cu',ion:'Cu²⁺',stage:'cathode',result:'Cu²⁺ + 2e⁻ → Cu'}),
  cc('Gold and silver settle as anode sludge',{metal:'Cu',target:'Cu',stage:'sludge',sludge:true,bath:'Au + Ag: recover from sludge'}),
  cc('Only copper deposits: up to 99.99% pure',{metal:'Cu',target:'Cu',bath:'Fe and Zn remain dissolved',result:'99.99% pure copper',stage:'all'}),
 ]},
 '711':{question:'How can a reaction produce electricity?',beats:[
  dc('Two half-cells contain zinc and copper','parts'),
  dc('A salt bridge connects their solutions','bridge'),
  dc('Zinc loses electrons: the negative anode','zinc'),
  dc('Electrons travel through the external wire','work'),
  dc('Copper ions gain electrons: the positive cathode','copper'),
  dc('Bridge ions keep each solution electrically neutral','ions'),
  dc('Zinc reacts, copper deposits: electricity flows','work'),
 ]},
 '712':{question:'How does a dry cell power things?',beats:[
  b('series','Join cells + to − to make a battery',{},10),
  b('carBattery','A car battery contains six or more cells',{},9),
  b('dryCell','Open one cell: zinc surrounds a graphite rod',{stage:'parts'},10),
  b('dryCell','Moist paste carries ions; wax seals it',{stage:'parts'},10),
  b('dryCell','Zinc loses electrons into the external circuit',{stage:'work'},10),
  b('dryCell','The cathode mixture receives those electrons',{stage:'work'},10),
  b('dryCell','The chemicals provide a limited energy supply',{stage:'spent'},8),
 ]},
 '713':{question:'How is sodium obtained from molten salt?',beats:[
  b('series','Electrochemistry powers everyday devices',{},8),
  cc('It also plates and purifies metals',{metal:'Cu',target:'Fe',bath:'metal salt solution',stage:'all'}),
  cc('Davy first obtained sodium in 1807',{metal:'C',target:'Fe',particle:'Na',n:1,bath:'fused NaOH (Davy, 1807)',ion:'Na⁺',stage:'cathode',result:'sodium from fused sodium hydroxide'}),
  b('temperature','Why add calcium chloride to sodium chloride?',{},11),
  ind('A graphite anode sits inside a ring cathode','downs','parts'),
  ind('Sodium ions gain electrons at the cathode','downs','cathode'),
  ind('Chloride ions lose electrons at the anode','downs','anode'),
  ind('The screen keeps sodium and chlorine apart','downs','collect'),
  b('protect','Aluminium’s oxide protects the metal beneath',{kind:'oxide',name:'aluminium oxide layer',result:'continuous layer blocks further attack'},9),
  b('rust','Iron’s porous rust leaves more metal exposed',{result:'rust does not seal the surface'},9),
  ind('Electrolysis separates sodium metal from its molten salt','downs','collect'),
 ]},
 '714':{question:'How does brine produce sodium hydroxide?',beats:[
  b('dissolve','Brine is concentrated salt dissolved in water',{},9),
  ind('The Nelson cell separates its two electrodes','nelson','parts'),
  b('waterIons','Water supplies hydrogen and hydroxide ions',{},9),
  ind('Hydrogen, rather than sodium, forms at the cathode','nelson','cathode'),
  b('charge','Hydrogen ions from water receive electrons',{atom:'H',before:'hydrogen ion H⁺',after:'hydrogen atom H',gain:true,n:1,result:'two H atoms join as H₂'},8),
  ind('Chloride ions release chlorine at the anode','nelson','anode'),
  b('nelsonPool','Sodium stays dissolved with hydroxide ions',{},10),
  ind('Separate outlets collect hydrogen, chlorine, and NaOH','nelson','collect'),
 ]},
 '715':{question:'Why does iron rust?',beats:[
  b('rust','Dry air alone does not rust iron',{dry:true,result:'no moisture: no rust'},8),
  b('rust','Water without oxygen does not rust iron',{noAir:true,result:'no oxygen: no rust'},8),
  b('rust','Moisture and oxygen together allow rusting',{result:'both conditions are needed'},9),
  b('rust','At a pit, iron gives up electrons',{micro:true,result:'Fe → Fe²⁺ + 2e⁻'},10),
  b('rust','Oxygen takes electrons at the droplet’s edge',{micro:true,result:'oxygen + water form hydroxide ions'},10),
  rule('Iron ions are further oxidized before rust forms','Fe²⁺ → Fe³⁺',[['Fe',2],['Fe',3]],'Fe³⁺ joins hydroxide: Fe(OH)₃'),
  b('rust','Water and oxygen keep consuming exposed iron',{result:'porous rust: Fe₂O₃·xH₂O'},9),
 ]},
 '716':{question:'How can we prevent corrosion?',beats:[
  b('rust','Exposed iron meets moisture and oxygen',{result:'keep the metal from being oxidized'},9),
  b('protect','First clean the stains from the surface',{kind:'clean',name:'remove surface stains',result:'a clean surface removes corrosion sites'},8),
  b('protect','Paint keeps air and water away',{kind:'paint',name:'painted iron',result:'coating blocks contact'},8),
  b('alloy','Mix iron, chromium and nickel: stainless steel',{},9),
  b('protect','A metal coating shields the iron',{kind:'coat',name:'zinc coating (galvanizing)',result:'zinc covers the iron'},9),
  b('protect','Inhibitors interrupt the surface reaction',{kind:'inhibitor',name:'corrosion inhibitor',result:'surface reaction slowed'},8),
  b('protect','Block attack or supply electrons to protect iron',{kind:'sacrifice',name:'Mg block wired to iron',result:'magnesium dissolves; replace it periodically'},11),
 ]},
 '717':{question:'How does a metal coat another metal?',beats:[
  cc('A thin metal coating protects the object',{metal:'Sn',target:'Fe',ion:'Sn²⁺',bath:'tin salt solution',stage:'all',result:'a thin tin coat protects iron'}),
  b('cleaning','Clean, remove grease, then rinse the object',{},12),
  cc('Coating metal is +; the clean object is −',{metal:'Sn',target:'Fe',bath:'tin salt solution',stage:'setup'}),
  cc('Tin dissolves as ions from the anode',{metal:'Sn',target:'Fe',ion:'Sn²⁺',stage:'anode',anodeResult:'Sn → Sn²⁺ + 2e⁻'}),
  cc('Tin ions receive electrons on the object',{metal:'Sn',target:'Fe',ion:'Sn²⁺',stage:'cathode',result:'Sn²⁺ + 2e⁻ → Sn'}),
  b('rinsing','Lift out the coated object, rinse, and dry',{},10),
  cc('The same process deposits zinc',{metal:'Zn',target:'Fe',ion:'Zn²⁺',bath:'ZnSO₄ + a little H₂SO₄',result:'zinc coat grows',stage:'all'}),
  cc('The book also shows chromium plating',{metal:'Cr',target:'Fe',ion:'Cr³⁺',n:3,bath:'chromic acid + a little H₂SO₄',result:'chromium coat grows',stage:'all'}),
  b('foodCan','A tin layer keeps food away from steel',{},10),
 ]},
};

export function makeMCQLesson(questions) {
 const proofs=[
  rule('N₂ is a free element: both numbers are zero','nitrogen (N₂)',[['N',0],['N',0]]),
  num('Four hydrogens and one oxygen leave carbon −2','CH₃OH',[['H',4,1],['O',1,-2]],'C',-2),
  b('charge','Losing a negative electron makes a positive ion',{atom:'Na',before:'sodium Na',after:'cation Na⁺',n:1,result:'cation means positively charged'},8),
  tx('The reducing agent gives electrons and is oxidized','Na','Cl',1,'Na','Cl','Na⁺','Cl⁻','giver = reducing agent'),
  num('Potassium is +1; four oxygens contribute −8','KMnO₄',[['K',1,1],['O',4,-2]],'Mn',7),
  b('charge','−3 to zero: three electrons lost',{atom:'P',before:'P: −3',after:'P: 0',n:3,result:'electron loss is oxidation'},11),
  cc('Oxidation releases electrons at the anode',{metal:'Cu',target:'Cu',stage:'anode',anodeResult:'anode: oxidation'}),
  b('numbers','The printed answer overlooks the peroxide exception',{name:'H₂S₂O₈',groups:[['H',2,1],['O',6,-2],['O',2,-1]],unknown:'S',unknownCount:2,answer:6,charge:0},14),
  tx('The reducing agent loses electrons and is oxidized','Zn','Cu',2,'Zn','Cu²⁺','Zn²⁺','Cu','two electrons given away'),
  dc('Electrons follow the wire; ions use the bridge','work'),
 ];
 defs['719']={question:'Can you explain each answer?',beats:proofs.map((p,i)=>{const q=questions[i],cardTime=Math.max(10,Math.ceil((q.q+' '+q.o.join(' ')).split(/\s+/).length/3)+4);return {...p,cardTime,duration:p.duration+cardTime,question:q,type:'mcq',proof:p};})};
 return makeLesson('719');
}

// Key points reprise the familiar action, in printed order. They never introduce a new unexplained model.
defs['718']={question:'How does this chapter fit together?',beats:[
 b('series','Chemical and electrical energy can be interchanged',{},7),
 b('charge','Oxidation: electrons leave',{atom:'Fe',before:'Fe²⁺',after:'Fe³⁺',n:1,result:'gain O / lose H / lose electrons'},7.5),
 b('charge','Reduction: electrons arrive',{atom:'Sn',before:'Sn⁴⁺',after:'Sn²⁺',gain:true,n:2,result:'lose O / gain H / gain electrons'},9),
 rule('Oxidation state is an assigned apparent charge','apparent numbers',[['O',-2],['H',1]]),
 tx('The oxidizing agent receives electrons','Na','Cl',1,'Na','Cl','Na⁺','Cl⁻','the oxidizing agent is itself reduced'),
 tx('The reducing agent gives electrons','Na','Cl',1,'Na','Cl','Na⁺','Cl⁻','the reducing agent is itself oxidized'),
 tx('Both changes together make a redox reaction','Zn','Cu',2,'Zn','Cu²⁺','Zn²⁺','Cu','equal electron loss and gain'),
 b('series','A cell converts chemical and electrical energy',{},7),
 b('conduct','An electrolyte supplies mobile ions',{name:'salt solution',level:1,result:'mobile ions carry current'},8),
 b('conduct','A non-electrolyte does not supply ions',{name:'sugar solution',level:0,result:'bulb stays off'},8),
 ind('Electrolysis uses electricity to decompose an electrolyte','downs','collect'),
 cc('Anode: oxidation; cathode: reduction',{metal:'Cu',target:'Cu',bath:'electrodes connect liquid and wires',stage:'all'}),
 dc('A spontaneous cell reaction produces electricity','work'),
 ind('The Down cell makes sodium from molten NaCl','downs','collect'),
 ind('The Nelson cell makes NaOH from brine','nelson','collect'),
 cc('Electroplating deposits a metal on another',{metal:'Sn',target:'Fe',bath:'matching metal salt',stage:'all'}),
 b('rust','Corrosion gradually eats away exposed metal',{result:'prevent its contact or supply electrons'},8),
 dc('Electron transfer links reactions, cells and corrosion','work'),
]};

export function getDefinition(id){return defs[id];}
export function makeLesson(id) {
 const def=defs[id];if(!def)throw new Error('No reviewed lesson '+id);
 let end=0;const beats=def.beats.map((d,i)=>{const start=end;end+=d.duration;return {...d,start,end,index:i,station:'s'+i};});
 const S=(t,w,h,y=1.2)=>{const look=[0,y,0],dir=[0,.32,1],d=V(...dir).normalize(),dist=Math.max(h/2/Math.tan(16*Math.PI/180),w/2/(Math.tan(16*Math.PI/180)*1.6))*1.1;return[t,V(...look).addScaledVector(d,dist).toArray(),look,undefined,undefined,{look,w,h,dir,dock:0}];};
 const frames={rust:[3.1,2.4,.7],protect:[3.5,3,1],charge:[3.5,3.3,1.2],rule:[4.2,3.8,1.4],numbers:[4.5,4.2,1.5],reaction:[4.2,4.5,1.7],colorTest:[3.6,4,1.5],industrial:[4.4,4.2,1.6],daniell:[4.5,4.2,1.5],dryCell:[4.5,3.9,1.5],displacement:[3.2,3.5,1.3],foodCan:[3.3,3.2,1.3],alloy:[3.3,4,1.5]};
 const heights={rust:1.3,protect:1.85,charge:2.65,rule:3.1,numbers:3.5,reaction:3.65,colorTest:3.25,industrial:3.35,daniell:3.3,dryCell:3.2,displacement:2.7,foodCan:2.5,alloy:3.05,firefly:3.2,temperature:3.45};
 const anchor=d=>[0,d.noAir?2.1:heights[d.type]??2.85,.2];
 const captions=beats.flatMap((d,i)=>d.type==='mcq'?[[d.start+d.cardTime,d.end,d.caption,anchor(d.proof)]]:i===0?[[0,2.2,def.question,anchor(d)],[2.2,d.end,d.caption,anchor(d)]]:[[d.start,d.end,d.caption,anchor(d)]]);
 return {duration:end,capNear:true,capTop:52,fog:[15,45],captions,cams:beats.flatMap(d=>{const p=d.proof??d;const [w,h,y]=p.noAir?[3.1,3.2,1.1]:frames[p.type]??[4.3,3.9,1.4];return [S(d.start,w,h,y),S(d.end-.02,w*.97,h*.97,y)];}),
  build({scene,cam,R}){
   document.body.classList.add('unit7');
   const studio=K.studio({scene,R},'u7',{dark:t=>{const d=beats.find(d=>t>=d.start&&t<d.end)??beats.at(-1);return MICRO.has((d.proof??d).type);}});
   const card=document.createElement('div');card.className='u7-question';card.hidden=true;document.body.append(card);
   const builders=beats.map(d=>{const g=new THREE.Group();scene.add(g);const p=d.proof??d;if(!MICRO.has(p.type))studio.bake(g,p.type==='cell'?`cell${p.metal??'Cu'}${p.target??'Fe'}`:p.type==='industrial'?`industrial${p.kind}`:p.type==='protect'?`protect${p.kind}`:p.noAir?'rustNoAir':p.type,0,4.5,1.8,0);
    const f=BUILDERS[p.type];if(!f)throw new Error('Missing scene '+p.type);const update=f(g,p);return {g,update,d};});
   let current=-1,cardFit='';
   return t=>{const index=t<0?0:Math.min(beats.length-1,beats.findIndex(d=>t<d.end)<0?beats.length-1:beats.findIndex(d=>t<d.end));
    if(index!==current){builders.forEach((x,i)=>x.g.visible=i===index);current=index;const q=beats[index].question;
     if(q){card.replaceChildren();const h=document.createElement('h2');h.textContent=q.q;card.append(h);q.o.forEach((s,i)=>{const p=document.createElement('p');p.textContent=String.fromCharCode(65+i)+'. '+s;p.dataset.answer=i===q.a?'yes':'no';card.append(p);});}
    }
    const local=Math.max(0,t-beats[index].start),mcq=beats[index].type==='mcq',cardTime=beats[index].cardTime??0;card.hidden=!mcq||local>=cardTime;card.classList.toggle('answered',local>=cardTime-2.5);
    const fitKey=`${index}/${innerWidth}/${innerHeight}`;
    if(!card.hidden&&fitKey!==cardFit){cardFit=fitKey;card.style.fontSize='';let size=parseFloat(getComputedStyle(card).fontSize);while(card.scrollHeight>card.clientHeight+1&&size>16){size--;card.style.fontSize=size+'px';}}
    builders[index].g.visible=!mcq||local>=cardTime;builders[index].update(Math.max(0,local-cardTime));studio.update(Math.max(0,t));
   };
  }
 };
}
