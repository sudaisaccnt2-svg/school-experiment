// Unit 7: explore every recall item before testing; six short book-order practice parts.
import { THREE, sleep } from './kit.js';
import { runGame, chooseText, shuffle } from './rounds.js';
import { BUILDERS } from '../lesson/electrochem-kit.js';
import { getDefinition } from '../lesson/u7.js';
import { RECALL7, PROJECT7 } from './recall7-data.js';
const sections=[['rules','Rules','📏'],['agents','Agents','⚛️'],['cells','Cells','🔋'],['industry','Industry','🏭'],['surfaces','Surfaces','🛡️'],['exercise','Exercise','✍️']];
function picture(g,r,k) {
 let d=getDefinition(r.ref[0]).beats[r.ref[1]];
 if(/photograph|colour-film/i.test(r.q))d={type:'photography',duration:10};
 if(/^Table 7.1:/.test(r.q))d={type:'agent',name:r.q.split(': ')[1].split(' is an example')[0],kind:r.a.includes('oxidizing')?'takes':'gives',duration:9};
 if(/Pure silver|Silver tarnishes|Sterling silver/.test(r.q))d={type:'silver',duration:9};
 if(r.section==='exercise'){
  const formulas={'HI':{groups:[['I',1,-1]],unknown:'H',answer:1},'PBr₃':{groups:[['Br',3,-1]],unknown:'P',answer:3},'CaCO₃':{groups:[['Ca',1,2],['O',3,-2]],unknown:'C',answer:4},'H₃PO₄':{groups:[['H',3,1],['O',4,-2]],unknown:'P',answer:5},'As₂O₃':{groups:[['O',3,-2]],unknown:'As',unknownCount:2,answer:3},'H₂SO₄':{groups:[['H',2,1],['O',4,-2]],unknown:'S',answer:6}};
  for(const [name,o] of Object.entries(formulas))if(r.q.includes(name))d={type:'numbers',name,charge:0,...o,duration:11};
  if(r.q.includes('Ca + Br₂'))d={type:'transfer',left:'Ca',right:'Br',n:2,beforeLeft:'Ca',beforeRight:'Br₂',afterLeft:'Ca²⁺: oxidized',afterRight:'2Br⁻: reduced',result:'bromine takes the two electrons',duration:10};
  if(r.q.includes('Zn + HCl'))d={type:'transfer',left:'Zn',right:'H',n:2,twoRight:true,beforeLeft:'Zn',beforeRight:'2H⁺ from acid',afterLeft:'Zn²⁺',afterRight:'H₂: hydrogen reduced',result:'hydrogen takes the electrons',duration:10};
 }
 const G=new THREE.Group();g.stage.root.add(G);
 // Keep the model in the space between the phone controls and answer buttons.
 const fit=()=>{const phone=innerWidth<600;if(!phone){G.position.y=-1.6;G.scale.setScalar(1.6);return;}
   const choices=g.ch.getBoundingClientRect(),goal=document.getElementById('goal').getBoundingClientRect(),bottom=Math.min(choices.height?choices.top:goal.top,goal.top)-12,top=195;
   const scale=Math.min(.75,Math.max(.25,(bottom-top)/310*.75));
   const dist=g.stage.camera.position.distanceTo(g.stage.controls.target),height=2*dist*Math.tan(g.stage.camera.fov*Math.PI/360),centre=(top+bottom)/2;
   G.scale.setScalar(scale);G.position.y=.3+(innerHeight/2-centre)*height/innerHeight-1.2*scale;
 };
 fit();g.onFrame(fit);
 const update=BUILDERS[d.type](G,d);let t=0,playing=false;
 update(0);g.onFrame(dt=>{if(playing)t=Math.min(d.duration-.2,t+dt);update(t);});
 return {async show(answer=true){playing=true;if(answer)g.goal(r.a,k);await sleep(Math.min(8,d.duration));}};
}
function explore(k,g){const r=RECALL7[k],p=picture(g,r,k);g.B.draw([{text:r.q,bold:true},{text:r.a,color:'#ffc061'},g.dots(k)]);p.show(false);g.setTap(()=>g.right(k,true,r.a,0,true));}
function round(list,k,g){const r=list[k],p=picture(g,r,k);g.goal(r.q,k);chooseText(g,k,[r.a,...r.wrong],0,{why:r.a,onRight:p.show,onReveal:p.show});}
const chunks=n=>Array.from({length:Math.floor((n-1)/10)},(_,i)=>(i+1)*10);
export function start({stage,ui,level}) {
 const observer=new ResizeObserver(entries=>ui.style.setProperty('--u7-goal-height',entries[0].contentRect.height+'px'));
 const parts=[{key:'explore',icon:'🔍',name:'Explore',n:RECALL7.length,steps:chunks(RECALL7.length),run:explore},...sections.map(([key,name,icon])=>{const list=shuffle(RECALL7.filter(r=>r.section===key));return {key,icon,name,n:list.length,steps:chunks(list.length),run:(k,g)=>round(list,k,g)};}),
 {key:'project',icon:'📝',name:'Project',n:1,run:(k,g)=>{const p=picture(g,{ref:['712',1],a:'Your investigation: compare battery types'},k);p.show();g.goal(PROJECT7,k);g.setTap(()=>g.right(k,true,'Write your report and include your sources.',0,true));}}];
 const game=runGame({stage,ui,level,id:'recall7',parts,cam:[0,1.1,14],target:[0,.3,0],excite:true});observer.observe(document.getElementById('goal'));return game;
}
