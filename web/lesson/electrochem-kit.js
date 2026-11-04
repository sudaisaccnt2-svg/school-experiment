// Shared electrochemistry models and time-based actions. Used by every Unit 7 lesson.
// Positions use the house kit's metres/y-up convention. No animation depends on playback history.
import * as THREE from 'three';
import * as K from './kit.js';
const { M, ease, span, lerp } = K;
const V = (...a) => new THREE.Vector3(...a);
export const COLORS = { Na:0xbac2ce, Cl:0x75bd4c, 'Na⁺':0xbac2ce, 'Cl⁻':0x75bd4c, 'H⁺':0xd5e6ff, 'CH₃COO⁻':0x8d79bd, C:0x434952, O:0xe55040, H:0xf1f2f4, N:0x507fe1, Fe:0xaab0ba, Sn:0xc6cbd3, Hg:0xc6cedb, Zn:0xbac1cc, Cu:0xc87945, P:0xee964d, S:0xeac65a, Mn:0xa66fc5, F:0xa6dc84, Br:0xad5439, I:0x8056b3, Cr:0x76ad94, Mg:0xb5bdc8, Al:0xcbd0db, Ca:0xc9c9b7, Au:0xe8bd56, Ag:0xd7dde5, Ni:0x9caa9f, OH:0x5baf9d, SO4:0xd6b557 };
export function put(g,o,p=[0,0,0]) { o.position.set(...p); g.add(o); return o; }
export function text(g,s,p,h=.23,c='#ffffff') { return put(g,K.label(s,h,c),p); }
export function box(g,size,p,color=0xaab0ba) { return put(g,K.solid(new THREE.BoxGeometry(...size), M.metal(color,.3)),p); }
export function bead(g,s,p,r=.26) {
  const o=put(g,new THREE.Group(),p);
  // The ball is a ball-and-stick symbol for an atom/ion, not a claim about its surface.
  const m=K.solid(new THREE.SphereGeometry(r,24,16),M.gloss(COLORS[s]??0xbac1cc),{cast:false});o.add(m);
  text(o,s,[0,0,r+.015],r*.8);return o;
}
export function electron(g,p) {
  const o=put(g,new THREE.Group(),p);
  o.add(new THREE.Mesh(new THREE.SphereGeometry(.055,12,8),M.glow(0xffc65d,3)),K.glowSprite(0xffc65d,.28));
  return o;
}
// A lamp holder exposes two terminals. Wires contact these, never the glass envelope.
function lamp(g,x) {
  const group=put(g,new THREE.Group(),[x,0,0]),bulb=put(group,K.bulb(),[0,.14,0]);
  box(group,[.46,.14,.36],[0,.07,0],0x555c66);
  for(const side of [-1,1])put(group,K.solid(new THREE.CylinderGeometry(.035,.035,.09,20),M.metal(0xb7bec8)),[side*.2,.145,0]);
  group.userData.set=k=>bulb.userData.set(k);return group;
}
function pathAt(path,u) { const c=new THREE.CatmullRomCurve3(path.map(p=>V(...p)));return c.getPoint(K.clamp01(u)); }
export function transfer(g,o={}) {
  const left=o.left??'Na', right=o.right??'Cl', n=o.n??1, a=bead(g,left,[-1.15,1.1,0],.42), b=bead(g,right,[1.15,1.1,0],.48);
  const before=[text(g,o.beforeLeft??left,[-1.15,1.94,0]),text(g,o.beforeRight??right,[1.15,1.94,0])];
  const after=[text(g,o.afterLeft??`${left}⁺`,[-1.15,1.94,0],.25,'#ffd18a'),text(g,o.afterRight??`${right}⁻`,[1.15,1.94,0],.25,'#a8d5ff')];
  const twoLeft=/^2Na/.test(o.beforeLeft??''),twoRight=!!o.twoRight||/₂/.test(o.beforeRight??'');
  let a2,b2;if(twoLeft){a.position.y=.78;a2=bead(g,left,[-1.15,1.42,0],.32);a.scale.setScalar(.76);}
  if(twoRight){b.position.y=.8;b.scale.setScalar(.72);b2=bead(g,right,[1.15,1.46,0],.34);}
  const es=Array.from({length:n},(_,i)=>electron(g,[-.84,twoLeft?.78+i*.64:1.17+i*.12,.44]));
  const note=text(g,o.result??'electron transferred', [0,.25,.15],.24,'#ffd18a');
  const units=es.map((e,i)=>{const line=K.wire([[-.84,1.17+i*.12,.44],[0,1.58+i*.12,.44],[.83,1.17+i*.12,.44]],0xffcb65,.008);g.add(line);return line;});
  return t=>{
    es.forEach((e,i)=>{const u=ease(span(t,2.2+i*1.2,4.5+i*1.2));e.position.copy(K.arc(V(-.84,twoLeft?.78+i*.64:1.17+i*.12,.44),V(.83,twoRight?.8+i*.66:1.17+i*.12,.44),.3,u));e.visible=t>=1&&t<4.6+i*1.2;units[i].visible=false;});
    const end=4.8+(n-1)*1.2;before.forEach(l=>l.visible=t<end);after.forEach(l=>l.visible=t>=end);note.visible=t>=end;
    // Single, small result highlight: no second action elsewhere.
    b.scale.setScalar((twoRight?.72:1)*(1+.025*Math.sin(Math.max(0,t-end)*2)));
  };
}

// Atom-conserving rearrangement. Every record has exactly one start and one destination.
export function reaction(g,o) {
  const atoms=o.atoms.map(([s,a,b],i)=>({o:bead(g,s,a,s==='H'?.16:.25),a:V(...a),b:V(...b),i}));
  const names=(o.names??[]).map(([s,p])=>text(g,s,p,.23));
  const products=(o.products??[]).map(([s,p])=>text(g,s,p,.23,'#ffd18a'));
  const wordNames={'C':'carbon','O₂':'oxygen','CO₂':'carbon dioxide','NH₃':'ammonia','Cl₂':'chlorine','N₂':'nitrogen','HCl':'hydrogen chloride','HgO':'mercury oxide','Hg':'mercury','H₂':'hydrogen','Zn':'zinc','CuO':'copper oxide','ZnO':'zinc oxide','Cu':'copper','Br₂':'bromine','H₂S':'hydrogen sulphide','HBr':'hydrogen bromide','S':'sulphur'};
  const terms=o.eq?o.eq.match(/[^+→]+|[+→]/g).map(s=>s.trim()):[];
  const arrowIndex=terms.indexOf('→');
  const tokenStarts=terms.map((_,j)=>j<arrowIndex?1+j*.45:j===arrowIndex?6:6.4+(j-arrowIndex-1)*.5);
  const sources=terms.map((s,j)=>{if(s==='→'||s==='+')return null;
    const formula=s.replace(/^\d+/,''),elements=formula.match(/[A-Z][a-z]?/g)??[];
    const selected=atoms.filter(a=>elements.includes(o.atoms[a.i][0]));const at=V(0,0,0);
    selected.forEach(a=>at.add(j<arrowIndex?a.a:a.b));at.divideScalar(Math.max(1,selected.length));at.y-=.45;
    const lab=text(g,wordNames[formula]??formula,at.toArray(),.22);
    return {lab,tIn:j<arrowIndex?0:tokenStarts[j]-.55,at:()=>at};
  });
  const eq=o.eq?K.equation(g,{slots:terms.map(s=>[s]),y:2.95,z:.15,x0:0,h:.25,starts:[1],tokenStarts,end:99,src:(_,j)=>sources[j]}):null;
  const heat=o.heat?put(g,K.burner(),[0,0,-.2]):null;
  return t=>{
    const u=ease(span(t,2.2,6));
    atoms.forEach(({o,a,b})=>o.position.copy(K.arc(a,b,.18,u)));
    names.forEach(l=>l.visible=!eq&&t<2.2);products.forEach(l=>l.visible=t>=6.1&&!eq);
    if(eq)eq(t);
    if(heat){heat.userData.flame.visible=t>1.4;heat.userData.flame.userData.update?.(t);}
  };
}

// Signed counting chips are oxidation-number bookkeeping. They are never drawn as physical electrons.
export function numbers(g,o) {
  const species=text(g,o.name,[0,2.35,0],.3,'#ffd18a');
  const groups=o.groups??[]; const chips=[];
  groups.forEach(([name,count,value],j)=>{
    const x=(j-(groups.length-1)/2)*1.35;
    for(let k=0;k<count;k++)bead(g,name,[x+(k-(count-1)/2)*.24,1.6,0],.115);
    text(g,`${count} × ${value>0?'+':''}${value}`,[x,2.05,0],.2);
    if(o.name==='H₂S₂O₈'&&value===-1){put(g,K.wire([[x-.12,1.6,-.03],[x+.12,1.6,-.03]],0x657285,.012));text(g,'peroxide pair',[x,1.23,0],.15);}
    for(let i=0;i<count*Math.abs(value);i++) {
      const s=value>=0?1:-1;
      const chip=put(g,K.solid(new THREE.CylinderGeometry(.075,.075,.035,16).rotateX(Math.PI/2),M.matte(s>0?0xe2ab4c:0x538acd),{cast:false}),[x+(i%4-1.5)*.18,.95-Math.floor(i/4)*.18,.2]);
      text(chip,s>0?'+':'−',[0,0,.025],.11);
      chips.push({chip,s,from:chip.position.clone(),j,i});
    }
  });
  const need=Math.abs(o.answer)*(o.unknownCount??1), missing=text(g,'find its number',[0,-.14,0],.21);
  for(let i=0;i<(o.unknownCount??1);i++)bead(g,o.unknown,[(i-((o.unknownCount??1)-1)/2)*.35,.27,0],o.unknownCount?.13:.26);
  const result=text(g,`${o.unknownCount?'each ':''}${o.unknown}: ${o.answer>=0?'+':''}${o.answer}`,[0,-.14,0],.25,'#ffd18a');
  const adds=Array.from({length:need},(_,i)=>{const chip=put(g,K.solid(new THREE.CylinderGeometry(.075,.075,.035,16).rotateX(Math.PI/2),M.matte(o.answer>0?0xe2ab4c:0x538acd),{cast:false}),[0,.27,.2]);text(chip,o.answer>0?'+':'−',[0,0,.025],.11);return chip;});
  const sum=text(g,o.charge===0?'total = 0 (neutral)':`total = ${o.charge} (ion charge)`,[0,2.8,0],.22);
  return t=>{
    const positives=chips.filter(c=>c.s>0), negatives=chips.filter(c=>c.s<0);
    chips.forEach((c,j)=>{const arr=c.s>0?positives:negatives,index=arr.indexOf(c),target=V((index-(arr.length-1)/2)*.19,c.s>0?1.13:.84,.3+j*.025);c.chip.position.lerpVectors(c.from,target,ease(span(t,2,4)));c.chip.position.z=.3+j*.025;c.chip.visible=true;});
    adds.forEach((a,i)=>{a.visible=t>=4.2+i*.25;a.position.copy(K.arc(V(0,.27,.65+i*.025),V((i-(need-1)/2)*.19,o.answer>0?1.13:.84,.65+i*.025),.12,ease(span(t,4.2+i*.25,5.6+i*.25))));});
    const done=6+need*.25;missing.visible=t<done;result.visible=t>=done;
    // Fade matching signed chips in pairs, leaving exactly the ion's net charge.
    if(t>done){const p=[...positives.map(c=>c.chip),...(o.answer>0?adds:[])],n=[...negatives.map(c=>c.chip),...(o.answer<0?adds:[])];for(let i=0;i<Math.min(p.length,n.length);i++){const on=t<done+.35+i*.12;p[i].visible=on;n[i].visible=on;}}
  };
}

export function flask(g,{color=0x2580c7,name='solution'}={}) {
  const glass=put(g,K.beaker(.48,1.2),[0,0,0]);
  const liquid=put(g,K.liquid(.445,.82,color,.6),[0,.065,0]);
  return {glass,liquid};
}
export function colorTest(g,o) {
  const gas=/ozone/i.test(o.add);
  const f=flask(g,{color:o.before}),p=put(g,K.dropper(.42),[0,2.3,0]),drop=put(g,new THREE.Mesh(new THREE.SphereGeometry(.035,12,8),M.liquid(o.after,.9)),[0,1.8,0]);
  const feed=gas?put(g,K.wire([[1.1,1.9,0],[.25,1.9,0],[.25,.2,0]],0xa0adb8,.025)):null;
  const bubbles=gas?put(g,K.bubbles(8,V(.25,.2,0),.7,.1,.026)):null;
  const before=text(g,o.name, [0,1.48,.1],.23),after=text(g,o.result,[0,.42,.52],.23,'#ffd18a');
  const src=text(g,o.add,[0,2.15,0],.22);const c0=new THREE.Color(o.before),c1=new THREE.Color(o.after);
  return t=>{p.position.y=lerp(2.3,1.65,ease(span(t,.5,2.5)));drop.visible=!gas&&t>=3&&t<3.8;drop.position.y=K.drop(t,3,1.65,.88,.7,0).y;
    f.liquid.traverse(m=>{if(m.isMesh)m.material.color.copy(c0).lerp(c1,ease(span(t,3.7,5.7)));});before.visible=t<6;after.visible=t>=5.9;src.visible=t<5;p.visible=!gas&&t<5;
    if(bubbles){bubbles.visible=t>=3&&t<5.8;bubbles.userData.update(Math.max(0,t-3),1);}
  };
}

export function cellModel(g,o={}) {
  const h=1.25,w=2.5,level=.93,left=-.82,right=.82;
  put(g,K.tank(w,.9,h,level),[0,0,0]);
  const a=box(g,[.27,1.45,.14],[left,.89,0],COLORS[o.metal??'Cu']),b=box(g,[.17,1.45,.14],[right,.89,0],COLORS[o.target??'Fe']);
  const baseA=a.scale.clone(),baseB=b.scale.clone();
  // Real terminals, + on left and − on right; no unconnected decorative battery.
  const bat=put(g,K.battery(),[0,1.92,-.4]);bat.rotation.z=Math.PI/2;bat.scale.setScalar(.65);
  const wp=[[left,1.62,0],[left,2.2,-.4],[-.57,1.92,-.4]],wn=[[.02,1.92,-.4],[right,2.2,-.4],[right,1.62,0]];
  const wa=put(g,K.wire(wp,0xb8442f,.018)),wc=put(g,K.wire(wn,0x344258,.018));
  const supply=put(g,K.pulses(wc.userData.curve,3)),remove=put(g,K.pulses(wa.userData.curve,3));
  const refine=(o.metal??'Cu')==='Cu'&&(o.target??'Fe')==='Cu';
  const lbs=[text(g,`${refine?'impure ':''}${o.metal??'Cu'} anode +`,[-.88,1.79,.1],.19),text(g,`${refine?'pure ':''}${o.target??'Fe'} cathode −`,[.88,1.79,.1],.19)];
  const bath=text(g,o.bath??'salt solution',[0,.26,.56],.22);
  return {a,b,bat,wa,wc,supply,remove,lbs,bath,left,right,baseA,baseB};
}
export function cellAction(g,o) {
  const c=cellModel(g,o),n=o.n??2,ionName=o.ion??`${o.metal??'Cu'}²⁺`;
  const p=bead(g,o.particle??o.metal??'Cu',[-.66,.75,.28],.14),ionLabel=text(g,ionName,[0,1.15,.5],.23,'#ffd18a');
  const es=Array.from({length:n},()=>electron(g,[0,0,0]));
  const aName=text(g,o.anodeResult??'loses electrons',[-.82,.45,.6],.2,'#ffd18a'),bName=text(g,o.result??'metal coat grows',[.82,.45,.6],.2,'#ffd18a');
  const sludge=Array.from({length:6},(_,i)=>{const m=bead(g,i%2?'Ag':'Au',[-.82+(i%3-1)*.1,.7+i*.05,.25],.045);m.children[1].visible=false;return m;});
  return t=>{
    const stage=o.stage??'all', on=t>=2.5;
    const part=stage==='anode'?0:stage==='cathode'?1:stage==='sludge'?2:stage==='setup'?-1:3;
    const oxidized=4.9+(n-1)*.65+.1,reduced=7.3+(n-1)*.65+.1;
    p.visible=part!==-1&&part!==2&&(part===1?t<reduced:on);
    const u=ease(span(t,part===0||part===3?oxidized:3,part===0?8.5:part===3?reduced:6.5));p.position.set(lerp(part===1?.25:-.66,part===0?-.28:.67,u),.72,.3);
    ionLabel.visible=(part===0?t>=oxidized:part===3?t>=oxidized&&t<reduced:t<reduced)&&part!==-1&&part!==2;ionLabel.position.x=p.position.x;
    es.forEach((e,i)=>{const ct=part===1?5:2.6;e.visible=t>=ct+i*.65&&part!==-1&&part!==2&&t<ct+2.8+i*.65;const a=part===1?V(.82,1.4+i*.12,.3):V(-.72,.72+i*.12,.3),b=part===1?V(.67,.72+i*.12,.3):V(-.82,1.6+i*.12,.3);e.position.copy(K.arc(a,b,.25,ease(span(t,ct+i*.65,ct+2.3+i*.65))));});
    c.supply.userData.update(Math.max(0,t-2.5),on?1:0,on?1:0);c.remove.userData.update(Math.max(0,t-2.5),on?1:0,on?1:0);
    c.supply.visible=part===1&&t>=5||part===3&&t>=6;c.remove.visible=part===0&&on||part===3&&on&&t<5.8;
    aName.position.x=0;bName.position.x=0;
    aName.visible=t>=8.3&&part===0||part===3&&t>=oxidized&&t<reduced-.6;bName.visible=t>=reduced+.15&&(part===1||part===3);
    c.bath.visible=part===-1||t<2;
    c.a.scale.copy(c.baseA);c.b.scale.copy(c.baseB);if(on&&(part===0||part===3))c.a.scale.x=lerp(1,.65,ease(span(t,oxidized,8.5)));if(part===1||part===3)c.b.scale.x=lerp(1,1.8,ease(span(t,reduced,9.5)));
    sludge.forEach((m,i)=>{m.visible=!!o.sludge&&part===2;m.position.y=K.drop(t,2.3+i*.4,.7+i*.05,.095+Math.floor(i/3)*.1,.8,.01).y;});
    if(part===2){c.supply.visible=c.remove.visible=false;aName.visible=false;bName.visible=false;bathLabel();}
    c.lbs[0].visible=part!==1;c.lbs[1].visible=part!==0;
    if(part===-1){
      c.a.position.y=lerp(1.97,.89,ease(span(t,.7,2.7)));c.b.position.y=lerp(1.97,.89,ease(span(t,3.1,5.1)));
      c.bat.position.y=lerp(2.65,1.92,ease(span(t,5.4,7.4)));c.bat.visible=t>=5.4;
      c.wa.visible=c.wc.visible=t>=7.4;c.lbs[0].visible=t>2.7;c.lbs[1].visible=t>5.1;
    }
    function bathLabel(){c.bath.visible=t<2;}
  };
}

export function daniell(g,o={}) {
  const lx=-1.05,rx=1.05;
  [lx,rx].forEach((x,i)=>{put(g,K.beaker(.63,1.3),[x,0,0]);put(g,K.liquid(.59,.91,i?0x1764d2:0x9bb9d0,.45),[x,.065,0]);});
  const zn=box(g,[.2,1.5,.13],[lx-.2,.87,0],COLORS.Zn),cu=box(g,[.2,1.5,.13],[rx+.2,.87,0],COLORS.Cu);
  const bridgePoints=[[lx+.25,.65,0],[lx+.25,1.57,0],[rx-.25,1.57,0],[rx-.25,.65,0]];
  const bridge=put(g,K.wire(bridgePoints,0xd8e4ee,.085));bridge.material=M.glass();
  const route=[[lx-.2,1.64,0],[lx-.2,2.32,0],[0,2.45,0],[rx+.2,2.32,0],[rx+.2,1.64,0]];
  const wire=put(g,K.wire(route,0x41516a,.018)),current=put(g,K.pulses(wire.userData.curve,5));
  text(g,'Zn anode −',[lx,1.9,.1],.22);text(g,'Cu cathode +',[rx,1.9,.1],.22);
  const left=text(g,'1 M ZnSO₄',[lx,.28,.7],.2),right=text(g,'1 M CuSO₄',[rx,.28,.7],.2);
  const br=text(g,'salt bridge',[0,1.27,.36],.21),v=text(g,'1.10 V',[0,2.7,0],.24,'#ffd18a');
  const zi=bead(g,'Zn',[-1.2,.67,.3],.13),ci=bead(g,'Cu',[rx-.15,.67,.3],.13);
  const signs=[text(zi,'2+',[0,.24,0],.15),text(ci,'2+',[0,.24,0],.15)];
  const sodium=bead(g,'Na',[lx+.25,1.57,0],.09),sodium2=bead(g,'Na',[lx+.25,1.57,.13],.09),sulphate=bead(g,'SO₄',[rx-.25,1.57,0],.1);
  const naLabel=text(g,'2Na⁺ → copper',[0,.3,.65],.21),sLabel=text(g,'SO₄²⁻ → zinc',[0,.3,.65],.21);
  const meter=box(g,[.5,.27,.18],[0,2.43,0],0x475469);
  return t=>{
    const stage=o.stage??'work',work=!['parts','bridge'].includes(stage),bridgeOn=stage!=='parts';
    bridge.visible=bridgeOn;bridge.position.y=stage==='bridge'?lerp(.65,0,ease(span(t,1.2,3.2))):0;br.visible=stage==='bridge';
    current.visible=work&&t>2;current.userData.update(Math.max(0,t-2),1,current.visible?1:0);v.visible=work&&t>6;
    zi.visible=stage==='zinc'||stage==='work';ci.visible=stage==='copper'||stage==='work';
    zi.position.x=lerp(lx-.1,lx+.2,ease(span(t,2,5)));ci.position.x=lerp(rx-.15,rx+.08,ease(span(t,3,6)));
    signs[0].visible=t>2.2;signs[1].visible=t<6;
    sodium.visible=sodium2.visible=sulphate.visible=stage==='ions';naLabel.visible=stage==='ions'&&t>=5.5;sLabel.visible=stage==='ions'&&t<5.2;
    if(stage==='ions'){sulphate.visible=t<5.2;sulphate.position.copy(pathAt([...bridgePoints].reverse(),span(t,1,4.8)));sodium.visible=t>=5.5;sodium.position.copy(pathAt(bridgePoints,span(t,5.5,9.3)));sodium.position.x+=.25*ease(span(t,9.3,9.8));sodium2.visible=t>=6;sodium2.position.copy(pathAt(bridgePoints,span(t,6,9.8)));}
    left.visible=stage==='parts'&&t<4.3;right.visible=stage==='parts'&&t>=4.5;
    meter.visible=stage==='work'||stage==='copper'||stage==='zinc';
  };
}

export function conduct(g,o) {
  const f=flask(g,{color:0x6fadd4});
  const l=box(g,[.08,1.2,.08],[-.3,.84,0],0x414651),r=box(g,[.08,1.2,.08],[.3,.84,0],0x414651);
  const bat=put(g,K.battery(),[-.95,0,0]),bulb=lamp(g,.95);
  const loop=put(g,K.wire([[-.95,.88,0],[-.95,1.7,-.1],[-.3,1.7,0],[-.3,1.45,0]],0xb8442f,.016));
  put(g,K.wire([[.3,1.45,0],[.3,1.7,0],[1.3,1.7,-.1],[1.3,.15,0],[1.15,.15,0]],0x45516a,.016));
  put(g,K.wire([[.75,.15,0],[.75,.05,-.3],[-.95,.05,-.3],[-.95,.04,0]],0x45516a,.016));
  const pulses=put(g,K.pulses(loop.userData.curve,3));
  const species=o.level<1?['H⁺','CH₃COO⁻']:['Na⁺','Cl⁻'];
  const pieces=Array.from({length:6},(_,i)=>{const p=bead(g,species[i%2],[(i%3-1)*.21,.28+Math.floor(i/3)*.26,.25],.075);return {p,home:p.position.clone()};});
  const mols=Array.from({length:3},(_,i)=>bead(g,'molecule',[(i-1)*.25,.7,.05],.08));mols.forEach(m=>m.children[1].visible=false);
  text(g,o.name,[0,1.98,0],.25,'#ffd18a');
  const result=text(g,o.result,[0,.25,.66],.23,'#ffd18a');
  return t=>{const u=ease(span(t,2.3,5));const lev=o.level??1;bulb.userData.set(t>5?lev:0);pulses.visible=t>5&&lev>0;pulses.userData.update(Math.max(0,t-5),lev,lev);
    pieces.forEach(({p,home},i)=>{p.visible=lev>0&&(lev===1||i<2);p.position.set(home.x+(i%2?1:-1)*.18*u,home.y+.12*Math.sin(t*.8+i)*u,home.z);});
    mols.forEach(m=>m.visible=lev<1);result.visible=t>5.3;
  };
}

export function rust(g,o={}) {
  const nail=put(g,K.nail(1.2,.06),[0,.1,0]);nail.rotation.z=-Math.PI/2;nail.position.x=-.6;
  if(o.noAir){
    nail.position.y=.15;put(g,K.beaker(.7,1.3),[0,0,0]);put(g,K.liquid(.66,.86,0x559cc6,.4),[0,.065,0]);
    put(g,K.liquid(.654,.12,0xc48d42,.6),[0,.925,0]);
    text(g,'oil keeps air out',[0,1.65,0],.23);text(g,'boiled water',[0,.6,.75],.22);
    const result=text(g,'no oxygen: no rust',[0,.15,.8],.22,'#ffd18a'),clock=timeClock(g,[.98,.38,.15]);
    return t=>{clock(t);nail.userData.rust(0);result.visible=t>5;};
  }
  const water=put(g,new THREE.Mesh(new THREE.SphereGeometry(.45,32,20),M.liquid(0x449bd0,.3)),[0,.16,0]);water.scale.set(1.1,.4,.7);
  const air=text(g,o.dry?'dry air':'water + oxygen',[0,.9,0],.18);
  const es=Array.from({length:2},()=>electron(g,[-.2,.15,.2]));
  const fe=bead(g,'Fe',[-.2,.19,.3],.1),oh=bead(g,'OH',[.45,.19,.3],.1);
  const pit=text(g,'iron loses electrons',[0,.65,0],.19),edge=text(g,'oxygen takes electrons',[0,.65,0],.19);
  const result=text(g,o.result??'porous rust exposes more iron',[0,0,.2],.16,'#ffd18a');
  const clock=o.dry?timeClock(g,[.9,.36,.1]):null;
  return t=>{water.visible=!o.dry;const on=!o.dry&&!o.noAir;
    if(clock)clock(t);air.visible=!o.micro;
    nail.userData.rust(on?span(t,4,8):0);es.forEach((e,i)=>{e.visible=on&&!!o.micro&&t>2&&t<6;e.position.set(lerp(-.2,.45,ease(span(t,2+i*.4,5+i*.4))),.15+i*.12,.2);});
    fe.visible=on&&!!o.micro&&t>1.5;oh.visible=on&&!!o.micro&&t>5.5;fe.position.y=lerp(.19,.4,ease(span(t,1.5,4)));
    pit.visible=on&&!!o.micro&&t>1.5&&t<5.2;edge.visible=on&&!!o.micro&&t>5.5;result.visible=t>7;
  };
}

/** A bench clock makes the unchanging control tests readable: time passes, but the clean nail stays clean. */
export function timeClock(g,p) {
 const root=put(g,new THREE.Group(),p),face=put(root,K.solid(new THREE.CylinderGeometry(.14,.14,.05,40).rotateX(Math.PI/2),M.matte(0xe9e5d8)),[0,0,0]);
 for(let i=0;i<12;i++){const a=i*Math.PI/6,tick=put(root,K.solid(new THREE.BoxGeometry(.008,.02,.004),M.matte(0x343b45)),[Math.sin(a)*.108,Math.cos(a)*.108,.031]);tick.rotation.z=-a;}
 const hand=put(root,new THREE.Group(),[0,0,.04]);put(hand,K.solid(new THREE.BoxGeometry(.009,.093,.006),M.matte(0x343b45)),[0,.035,0]);
 box(root,[.025,p[1]-.16,.025],[0,-(p[1]+.12)/2,0],0x7b8593);put(root,K.solid(new THREE.CylinderGeometry(.075,.075,.018,24),M.metal(0x7b8593)),[0,-p[1]+.009,0]);
 return t=>{hand.rotation.z=-t*1.6;};
}

export function protect(g,o={}) {
  const pipe=put(g,K.solid(new THREE.CylinderGeometry(.17,.17,2,32).rotateZ(Math.PI/2),M.metal(0x889099,.4)),[0,.2,0]);
  const coat=put(g,K.solid(new THREE.CylinderGeometry(.177,.177,2.01,32,1,true).rotateZ(Math.PI/2),M.matte(o.kind==='paint'?0x3669b2:0xb7c1ca,.45)),[0,.2,0]);
  const block=box(g,[.32,.28,.32],[-.8,.14,.8],COLORS.Mg);
  const wire=put(g,K.wire([[-.8,.28,.8],[-.8,.7,.8],[0,.7,0],[0,.35,0]],0x4e5e73,.014));
  const flow=put(g,K.pulses(wire.userData.curve,3));
  const label=text(g,o.name,[0,1.18,0],.25,'#ffd18a'),result=text(g,o.result,[0,-.15,.2],.23);
  const tool=put(g,K.paperStrip([[0,0],[.2,.02]],.18,0xc8c0aa,0xc8c0aa),[-.5,.43,0]);
  tool.rotation.x=Math.PI/2;tool.position.y=.372;
  const stains=o.kind==='clean'?[-.6,-.2,.2,.6].map(x=>{const p=put(g,K.solid(new THREE.SphereGeometry(.055,16,8).scale(1,.14,1),M.matte(0x9d4c27)),[x,.373,0]);return {p,x};}):[];
  const brush=o.kind==='paint'?put(g,paintBrush(),[-1,.37,0]):null;
  const bath=o.kind==='coat'?put(g,K.tank(2.4,.75,.5,.35),[0,0,0]):null;
  if(bath){bath.children.slice(-2).forEach(m=>m.material.color.setHex(0xc2c7cd));text(g,'molten zinc',[0,.45,.5],.2);}
  const dropper=o.kind==='inhibitor'?put(g,K.dropper(.32),[0,1.8,0]):null;
  const drop=dropper?put(g,new THREE.Mesh(new THREE.SphereGeometry(.027,12,8),M.liquid(0x77aabb,.7)),[0,.7,0]):null;
  const oxygen=o.kind==='oxide'?[bead(g,'O',[1,.8,0],.065),bead(g,'O',[1.14,.8,0],.065)]:[];
  if(dropper){coat.material.transparent=true;coat.material.opacity=.35;}
  return t=>{const sac=o.kind==='sacrifice',dip=o.kind==='coat';
    const u=ease(span(t,dip?3:o.kind==='oxide'?4:2,dip?5:o.kind==='oxide'?6.5:5));
    coat.visible=!sac&&o.kind!=='clean';coat.scale.x=Math.max(.001,u);coat.position.x=-1.005*(1-u);
    pipe.position.y=dip?lerp(.8,.2,ease(span(t,1,3)))+ .6*ease(span(t,5,7)):.2;coat.position.y=pipe.position.y;
    block.visible=wire.visible=flow.visible=sac;flow.userData.update(Math.max(0,t-2),1,t>2?1:0);
    if(sac)block.scale.setScalar(lerp(1,.65,ease(span(t,2,8))));tool.visible=o.kind==='clean'&&t<6;tool.position.x=lerp(-.8,.8,ease(span(t,1.5,5.5)));
    stains.forEach(({p,x})=>p.visible=tool.position.x<x+.08);
    if(brush){brush.visible=t>=1.7&&t<5.8;brush.position.x=lerp(-1,1,ease(span(t,2,5)));}
    if(dropper){dropper.position.y=lerp(1.8,.73,ease(span(t,.5,2.5)));dropper.visible=t<4;drop.visible=t>3&&t<3.7;drop.position.y=K.drop(t,3,.73,.38,.6,0).y;}
    oxygen.forEach((a,i)=>{a.visible=t<5.2;a.position.x=lerp(1+i*.14,.3+i*.06,ease(span(t,2,5)));a.position.y=lerp(.8,.38,ease(span(t,2,5)));});
    result.visible=t>(o.kind==='oxide'?6.6:6);
  };
}
export function paintBrush() {
 const g=new THREE.Group();box(g,[.12,.08,.04],[0,.04,0],0x333e51);box(g,[.128,.06,.046],[0,.1,0],0xaeb8c7);
 put(g,K.solid(new THREE.CylinderGeometry(.025,.025,.2,20),M.matte(0x98693c)),[0,.225,0]);return g;
}

export function dryCell(g,o={}) {
  const shell=put(g,K.solid(new THREE.CylinderGeometry(.48,.48,1.65,48,1,true,0,Math.PI*1.3),M.metal(COLORS.Zn,.35)),[0,.9,0]);
  shell.material.side=THREE.DoubleSide;
  const paste=put(g,K.solid(new THREE.CylinderGeometry(.43,.43,1.45,48,1,false,0,Math.PI*1.3),M.matte(0x967e40,.9)),[0,.85,0]);
  paste.material.side=THREE.DoubleSide;
  const rod=put(g,K.solid(new THREE.CylinderGeometry(.07,.07,1.95,24),M.matte(0x272d36)),[0,1.03,0]);
  const seal=put(g,K.solid(new THREE.CylinderGeometry(.46,.46,.08,32,1,true),M.matte(0x773e2d)),[0,1.7,0]);
  const labels=[text(g,'zinc case −',[-.85,.7,.4],.22),text(g,'graphite rod +',[.85,1.9,.1],.22),text(g,'moist paste',[.85,.55,.2],.22)];
  const bulb=lamp(g,1.3);
  const path=[[-.46,.3,0],[-.85,1.8,0],[1.65,2.4,0],[1.65,.15,0],[1.5,.15,0]];
  const w=put(g,K.wire(path,0x485b78,.017)),w2=put(g,K.wire([[1.1,.15,0],[1.1,.05,-.3],[1.9,.1,-.3],[1.9,2.2,-.3],[0,2.2,0],[0,2.0,0]],0xb8442f,.017)),p=put(g,K.pulses(w.userData.curve,4));
  const v=text(g,'1.25 V (book)',[.3,2.55,0],.25,'#ffd18a');
  const spent=text(g,'reactants run down: bulb dims',[0,.25,.6],.23,'#ffd18a');
  return t=>{const work=o.stage==='work'||o.stage==='spent',power=o.stage==='spent'?1-ease(span(t,3,6.5)):1;bulb.visible=w.visible=w2.visible=p.visible=work;bulb.userData.set(t>2?power:0);p.userData.update(Math.max(0,t-2),power,t>2?power:0);v.visible=work&&t>6&&o.stage!=='spent';spent.visible=o.stage==='spent'&&t>6.5;
    paste.visible=t>2||work;paste.position.x=work?0:lerp(.7,0,ease(span(t,2,4)));seal.visible=t>5||work;labels.forEach((l,i)=>l.visible=t>i*1.5);
  };
}

export function industrial(g,o) {
  const nelson=o.kind==='nelson',h=1.65;
  const tank=put(g,K.tank(2.5,1.05,h,1.2),[0,0,0]);
  // Cutaway of the cylindrical/U-shaped equipment: the open front lets the student inspect it.
  const an=box(g,[.22,1.55,.18],[0,.9,0],0x252d38);
  const ring=put(g,K.solid(new THREE.CylinderGeometry(.84,.84,1.1,40,1,true,0,Math.PI*1.6),M.metal(0x74808d,.5)),[0,.7,0]);ring.material.side=THREE.DoubleSide;
  const diaphragm=put(g,K.solid(new THREE.CylinderGeometry(.61,.61,1.25,32,1,true,0,Math.PI*1.6),M.matte(0xb6aba0)),[0,.75,0]);diaphragm.material.side=THREE.DoubleSide;
  const dome=put(g,K.solid(new THREE.ConeGeometry(.6,.4,32,1,true),M.metal(0x9da8b8,.4)),[0,1.5,0]);
  if(nelson){
    ring.visible=diaphragm.visible=dome.visible=false;
    for(const z of [-.3,.3]){
      put(g,K.wire([[-.86,1.45,z],[-.86,.58,z],[-.65,.35,z],[0,.3,z],[.65,.35,z],[.86,.58,z],[.86,1.45,z]],0x88929e,.065));
      put(g,K.wire([[-.72,1.42,z],[-.72,.61,z],[-.5,.47,z],[0,.43,z],[.5,.47,z],[.72,.61,z],[.72,1.42,z]],0xbdb4a5,.03));
    }
    // Fine steel mesh at the sides, open cutaway at the front; separator follows the U inside it.
    for(let i=0;i<8;i++)for(const x of [-.86,.86])put(g,K.wire([[x,.54+i*.115,-.3],[x,.54+i*.115,.3]],0x88929e,.013));
    put(g,K.liquid(.6,.12,0x85b5d5,.45),[0,.07,0]);
    put(g,K.wire([[1.4,.25,-.2],[1.05,.25,-.2],[.8,.25,-.2]],0x88929e,.04));
  } else {
    const shell=put(g,K.solid(new THREE.CylinderGeometry(1.35,1.35,1.62,48,1,true,Math.PI*.15,Math.PI*1.2),M.metal(0x68717e,.5)),[0,.82,0]);shell.material.side=THREE.DoubleSide;
    const lining=put(g,K.solid(new THREE.CylinderGeometry(1.26,1.26,1.55,48,1,true,Math.PI*.15,Math.PI*1.2),M.matte(0xa87050,.9)),[0,.82,0]);lining.material.side=THREE.DoubleSide;
  }
  const pCl=put(g,K.wire([[0,1.7,0],[0,2.3,0],[.9,2.3,0]],0x818c9b,.07));
  const pOther=put(g,K.wire([[-.8,1.2,0],[-1.25,1.2,0],[-1.25,.65,.2]],0x818c9b,.055));
  const names=[text(g,'graphite anode +',[0,2.7,0],.23),text(g,nelson?'steel cathode −':'ring cathode −',[-1,1.9,.2],.21),text(g,nelson?'brine (salt + water)':'molten NaCl + CaCl₂',[0,.3,.67],.23)];
  const gas=put(g,K.bubbles(12,V(0,.65,0),2.3,.16,.032));
  const other=put(g,K.bubbles(10,V(-.8,.65,0),1.5,.16,.03));
  const product=put(g,K.liquid(nelson?.6:.2,.14,nelson?0x8dbed9:0xc5cad0,.8),[nelson?0:-1.25,nelson?.075:.13,.2]);
  const out=text(g,nelson?'H₂ leaves cathode':'Na floats to outlet',[-1,.52,.6],.2,'#ffd18a');
  const cl=text(g,'Cl₂ leaves anode',[.7,2.48,0],.21,'#d2e87d');
  const naoh=text(g,'NaOH collects below the U',[0,.13,.7],.21,'#c5e9ff');
  const detail=text(g,nelson?'porous lining separates products':'steel tank, firebrick lining',[0,1.95,.3],.21);
  const ion=bead(g,nelson?'H':'Na',[-.3,.9,.4],.13),ionL=text(g,nelson?'H⁺ from water':'Na⁺ from salt',[-.2,1.25,.6],.2);
  const clIon=bead(g,'Cl',[.4,.75,.4],.13),clIon2=bead(g,'Cl',[.4,1.08,.4],.13),clL=text(g,'2Cl⁻',[.4,1.48,.6],.2);
  const hIon=nelson?bead(g,'H',[-.3,1.21,.4],.13):null;
  const battery=put(g,K.battery(),[1.65,0,-.1]);
  const incomingElectron=electron(g,[-.84,1.25,.4]);
  const incomingElectron2=nelson?electron(g,[-.84,1.55,.4]):null;
  const outgoingElectrons=[0,1].map(()=>electron(g,[0,0,0]));
  put(g,K.wire([[1.65,.88,-.1],[1.65,2.0,-.3],[0,2.0,-.3],[0,1.7,0]],0xb8442f,.015));
  put(g,K.wire([[1.65,.03,-.1],[1.9,.03,-.3],[1.9,1.2,-.3],[.84,1.2,0]],0x394b66,.015));
  return t=>{
    const s=o.stage??'parts',ca=s==='cathode',ch=s==='anode',end=s==='collect';
    ion.visible=ca&&t<(nelson?7.2:9.8);ionL.visible=ca&&t<6;ion.position.set(lerp(-.3,-.8,ease(span(t,2,5))),.9,.4);
    if(hIon){hIon.visible=ca&&t<7.2;hIon.position.set(lerp(-.3,-.8,ease(span(t,2.5,5.5))),lerp(1.21,1.17,ease(span(t,6,6.8))),.4);}
    if(ca&&!nelson&&t>5.5){ion.position.y=lerp(.9,1.2,ease(span(t,5.5,7)));ion.position.x=lerp(-.8,-1.25,ease(span(t,7,8.8)));if(t>8.8)ion.position.y=K.drop(t,8.8,1.2,.27,.7,0).y;}
    incomingElectron.visible=ca&&t>=4&&t<5.5;incomingElectron.position.copy(K.arc(V(-.84,1.25,.4),V(-.8,.9,.4),.1,ease(span(t,4,5.5))));
    if(incomingElectron2){incomingElectron2.visible=ca&&t>=4.5&&t<6;incomingElectron2.position.copy(K.arc(V(-.84,1.55,.4),V(-.8,1.21,.4),.1,ease(span(t,4.5,6))));}
    clIon.visible=clIon2.visible=ch&&t<7.2;clL.visible=ch&&t<5.5;
    [clIon,clIon2].forEach((p,i)=>p.position.set(lerp(.4,0,ease(span(t,2+i*.5,5+i*.5))),.75+i*.33,.4));
    outgoingElectrons.forEach((e,i)=>{e.visible=ch&&t>=4+i*.5&&t<6+i*.5;e.position.copy(K.arc(V(0,.75+i*.33,.4),V(0,1.65+i*.12,.4),.13,ease(span(t,4+i*.5,6+i*.5))));});
    gas.visible=(ch&&t>7.2)||(end&&t>5);gas.userData.update(Math.max(0,t-(ch?7.2:5)),1);other.visible=nelson&&((ca&&t>7.2)||(end&&t>5));other.userData.update(Math.max(0,t-(ca?7.2:5)),1);
    product.visible=(ca||end)&&t>(nelson||end?5.5:9.5);out.visible=(ca||end)&&t>5.5;cl.visible=(ch||end)&&t>5.5;naoh.visible=nelson&&end&&t>6.5;
    diaphragm.visible=!nelson;names.forEach((l,i)=>l.visible=s==='parts'&&t>i*1.4&&(i!==2||t<5)&&(i!==1||t<6)||(i===2&&t<2));detail.visible=s==='parts'&&t>6;
  };
}

export function series(g,o={}) {
  const cells=[-1.1,0,1.1].map(x=>put(g,K.battery(),[x,0,0]));
  cells.forEach((c,i)=>{c.rotation.z=-Math.PI/2;c.position.y=.16;c.position.x=-1.6+i*1.05;});
  const bulb=lamp(g,1.75);
  const w=put(g,K.wire([[-1.6,.16,0],[-1.9,1.4,0],[2.1,1.4,0],[2.1,.15,0],[1.95,.15,0]],0x485a70,.02));
  put(g,K.wire([[1.55,.15,0],[1.55,.05,-.3],[1.37,.05,-.3],[1.37,.16,0]],0xb8442f,.02));
  const links=[[-.73,-.55],[.32,.5]].map(([a,b])=>put(g,K.wire([[a,.16,0],[b,.16,0]],0x9cabbc,.018)));
  const p=put(g,K.pulses(w.userData.curve,5));
  const result=text(g,'+ connects to −: cells in series',[0,1.8,0],.24,'#ffd18a');
  return t=>{cells.forEach((c,i)=>c.position.y=.16+lerp(i?1.7:0,0,ease(span(t,i*1.5,i*1.5+1.3))));links.forEach(l=>l.visible=t>4.4);bulb.userData.set(t>5?1:0);p.visible=t>5;p.userData.update(Math.max(0,t-5),1,t>5?1:0);result.visible=t>4.5;};
}

export function charge(g,o) {
  const at=bead(g,o.atom,[0,1.1,0],.5),before=text(g,o.before,[0,2.05,0],.3),after=text(g,o.after,[0,2.05,0],.3,'#ffd18a');
  const es=Array.from({length:o.n},(_,i)=>electron(g,[o.gain?-1.4:.4,1.2+i*.15,.5]));
  const count=text(g,`${o.n} electron${o.n===1?'':'s'}`,[o.gain?-1.15:1.15,.55,0],.23);
  const result=text(g,o.result,[0,.13,0],.25,'#ffd18a');
  return t=>{const done=4.8+(o.n-1)*1.2;before.visible=t<done;after.visible=result.visible=t>=done;count.visible=t>1&&t<done;
    es.forEach((e,i)=>{const a=V(o.gain?-1.25:.4,1.2+i*.15,.5),b=V(o.gain?-.3:1.25,1.2+i*.15,.5);e.visible=t>=1&&(!o.gain||t<4.8+i*1.2);e.position.copy(K.arc(a,b,.2,ease(span(t,2+i*1.2,4.8+i*1.2))));});
  };
}
export function rule(g,o) {
  const items=o.items??[[o.atom??'Na',o.value??0]];
  const labels=[];const pos=items.map((_,i)=>[(i-(items.length-1)/2)*.72,1.15,0]);
  if(o.name==='H₂O'&&items.length===3){pos[0]=[-.55,.85,0];pos[1]=[0,1.2,0];pos[2]=[.55,.85,0];}
  items.forEach(([s,v],i)=>{const [x,y,z]=pos[i];bead(g,s,[x,y,z],s==='H'?.2:.28);labels.push(text(g,`${v>0?'+':''}${v}`,[x,y+.65,z],.25,'#ffd18a'));});
  if(pos.length>1&&/^(H₂|H₂O|OF₂|NaH|NaCl|nitrogen|water)/.test(o.name)){const link=K.wire(pos,0x667486,.024);link.position.z=-.05;g.add(link);}
  const name=text(g,o.name,[0,2.4,0],.26),r=text(g,o.result,[0,.35,0],.23,'#ffd18a');
  return t=>{labels.forEach((l,i)=>K.popIn(l,t,1.2+i*.85));r.visible=t>=2.2+items.length*.85;};
}
export function sharing(g,o={}) {
  bead(g,'O',[0,1.25,0],.38);bead(g,'H',[-.7,.8,0],.22);bead(g,'H',[.7,.8,0],.22);
  const e=[electron(g,[-.35,1,.3]),electron(g,[.35,1,.3])];
  text(g,'water: shared electrons',[0,2.35,0],.25);
  const n=text(g,'assigned numbers, not separated ions',[0,.2,0],.22,'#ffd18a');
  const badges=[text(g,'−2',[0,1.9,0],.22,'#ffd18a'),text(g,'+1',[-.85,.45,0],.22),text(g,'+1',[.85,.45,0],.22)];
  return t=>{e.forEach((v,i)=>{const s=i?1:-1;v.position.set(s*lerp(.35,.18,ease(span(t,2,4))),lerp(1,1.15,ease(span(t,2,4))),.3);});badges.forEach(l=>l.visible=t>=4.4);n.visible=t>=5;};
}
export function dissolve(g,o={}) {
  put(g,K.tank(2.3,1,1.35,.98),[0,0,0]);
  const particles=Array.from({length:8},(_,i)=>{
    const s=i%2?'Cl':'Na',a=V((i%4-1.5)*.16,.38+Math.floor(i/4)*.17,.12),dest=V((i%4-1.5)*.4,.3+Math.floor(i/4)*.4,.12);
    const ball=bead(g,s,a.toArray(),.075),charge=text(ball,i%2?'−':'+',[0,.14,0],.09);return {ball,a,dest};
  });
  const name=text(g,o.molten?'solid salt → molten salt':'salt crystal in water',[0,1.75,0],.25);
  const names=text(g,'Na⁺ and Cl⁻: magnified ions',[0,.16,.65],.23,'#ffd18a');
  const heat=o.molten?put(g,K.burner(),[0,-.85,0]):null;
  return t=>{particles.forEach(({ball,a,dest},i)=>{ball.position.lerpVectors(a,dest,ease(span(t,2,6)));if(t>6)ball.position.y+=.035*Math.sin((t-6)*1.5+i);});names.visible=t>=5.7;
   if(heat){heat.userData.flame.userData.update?.(t);heat.userData.flame.visible=t>1;}
  };
}
export function displacement(g,o={}) {
  const f=flask(g,{color:0x2674ce}),strip=box(g,[.18,1.1,.12],[-.12,1.8,0],COLORS.Zn);
  const zn=text(g,'zinc strip',[-.55,1.6,.3],.22),sol=text(g,'copper sulphate solution',[0,.25,.65],.21);
  const coat=box(g,[.19,.7,.135],[-.12,.6,0],COLORS.Cu);
  const ion=bead(g,'Cu',[.28,.48,.2],.09),sign=text(ion,'2+',[0,.15,0],.1);
  const zi=bead(g,'Zn',[-.12,.5,.2],.09),zs=text(zi,'2+',[0,.15,0],.1);
  const es=[electron(g,[-.12,.6,.3]),electron(g,[-.12,.5,.3])];
  return t=>{strip.position.y=lerp(1.8,.9,ease(span(t,.6,2.6)));coat.visible=t>6;coat.scale.x=Math.max(.001,ease(span(t,6,9)));
   ion.visible=t<7;ion.position.x=lerp(.28,-.12,ease(span(t,3,6.5)));sign.visible=t<6.5;
   zi.visible=t>6.5;zi.position.x=lerp(-.12,.26,ease(span(t,6.5,9)));es.forEach((e,i)=>{e.visible=t>3.5&&t<6.3;e.position.x=lerp(-.12,.17,ease(span(t,3.5+i*.4,5.5+i*.4)));});
  };
}
export function chromium(g,o={}) {
 const colors=[0x2578cf,0x3b9b5d,0xe58a28],vals=['+2','+3','+6'];
 const flasks=colors.map((color,i)=>{const gr=put(g,new THREE.Group(),[(i-1)*1.3,0,0]);flask(gr,{color});const l=text(gr,`chromium ${vals[i]}`,[0,1.6,.1],.2);return {gr,l};});
 return t=>flasks.forEach(({l},i)=>{l.visible=t>=i*3+1.5;});
}
export function firefly(g,o={}) {
 const body=put(g,K.solid(new THREE.SphereGeometry(.23,24,16).scale(1.9,1,.85),M.matte(0x34342c)),[0,1,0]);
 put(g,K.solid(new THREE.SphereGeometry(.16,20,12),M.matte(0x262925)),[-.48,1.03,0]);
 const tail=put(g,K.solid(new THREE.SphereGeometry(.2,24,16),M.matte(0x8f9b49)),[.32,1,0]);
 const light=put(g,K.glowSprite(0xcfff74,1.1),[.32,1,.1]);
 [-1,1].forEach(s=>{const w=put(g,K.solid(new THREE.SphereGeometry(.2,24,12).scale(1.3,.08,.8),M.glass(),{cast:false}),[0,1.16,s*.18]);w.rotation.x=s*.25;});
 const oxy=[bead(g,'O',[1.3,1.5,0],.12),bead(g,'O',[1.55,1.5,0],.12)];text(g,'oxygen (O₂)',[1.2,2.05,0],.22);
 text(g,'firefly',[0,.35,0],.25);const name=text(g,'luciferin in its light-producing cells',[0,2.5,0],.21),result=text(g,'oxidation produces light',[0,.1,0],.22,'#ffd18a');
 return t=>{oxy.forEach((o,i)=>{o.position.x=lerp(1.3+i*.25,.4+i*.04,ease(span(t,2,5)));o.visible=t<5.2;});light.visible=t>=5;light.material.opacity=.7+.1*Math.sin(t*3);tail.material.color.setHex(t>5?0xb8d752:0x8f9b49);result.visible=t>5.5;};
}
export function carBattery(g,o={}) {
 const shell=put(g,K.solid(new THREE.BoxGeometry(2.5,.9,1),M.matte(0x303743)),[0,.45,0]);
 const cells=Array.from({length:6},(_,i)=>box(g,[.3,.65,.6],[(i-2.5)*.36,.7,0],0x657281));
 const names=cells.map((m,i)=>text(g,String(i+1),[(i-2.5)*.36,1.3,0],.19));
 text(g,'six cells in series',[0,1.9,0],.26,'#ffd18a');
 return t=>{shell.position.y=lerp(.45,-.3,ease(span(t,1,3)));cells.forEach((m,i)=>{m.position.y=lerp(.7,1,ease(span(t,3+i*.5,4+i*.5)));});names.forEach((l,i)=>l.visible=t>3.5+i*.5);};
}
export function temperature(g,o={}) {
 const a=put(g,K.saltHeap(.22,150),[-.8,0,0]),b=put(g,K.saltHeap(.22,150),[.8,0,0]);
 const ba=box(g,[.26,1.8,.16],[-.8,1.3,0],0x4f829d),bb=box(g,[.26,1.8,.16],[.8,1.3,0],0xd7a349);
 text(g,'NaCl',[-.8,.35,.3],.24);text(g,'NaCl + CaCl₂',[.8,.35,.3],.24);
 const l1=text(g,'801 °C',[-.8,2.45,0],.24),l2=text(g,'600 °C',[.8,2.45,0],.24,'#ffd18a');
 // The 1:3 recipe is practised in the recall game; this shot compares melting temperatures.
 return t=>{const u=ease(span(t,2,6));ba.scale.y=Math.max(.01,u);ba.position.y=.4+.9*u;bb.scale.y=Math.max(.01,u*600/801);bb.position.y=.4+.9*u*600/801;l1.visible=l2.visible=t>6;};
}
export function nelsonPool(g,o={}) {
 put(g,K.tank(2.2,.9,1.2,.8),[0,0,0]);
 const na=bead(g,'Na',[-.6,.55,.2],.16),oh=bead(g,'OH',[.6,.55,.2],.16);
 text(na,'+',[0,.3,0],.18);text(oh,'−',[0,.3,0],.18);
 text(g,'Na⁺ stays in solution',[0,1.9,0],.25);const result=text(g,'NaOH solution (caustic soda)',[0,.15,.65],.24,'#ffd18a');
 return t=>{const u=ease(span(t,2,6));na.position.x=lerp(-.6,-.3,u);oh.position.x=lerp(.6,.3,u);result.visible=t>5.5;};
}
export function alloy(g,o={}) {
 const atoms=[];for(let i=0;i<12;i++){const s=i%5===0?'Cr':i%7===0?'Ni':'Fe',a=bead(g,s,[(i%4-1.5)*.4,.5+Math.floor(i/4)*.35,0],.15);atoms.push(a);}
 const name=text(g,'Fe + Cr + Ni',[0,2.3,0],.27),result=text(g,'stainless steel resists corrosion',[0,.12,0],.24,'#ffd18a');
 return t=>{atoms.forEach((a,i)=>{const y=.5+Math.floor(i/4)*.35,u=ease(span(t,1,5));a.position.y=y+(i%5===0?1.6*(1-u):0);a.position.z=i%5===0?1.6*(1-u):0;});result.visible=t>5.5;};
}
export function cleaning(g,o={}) {
 const plate=box(g,[.45,.9,.1],[0,.55,0],COLORS.Fe),pad=put(g,K.paperStrip([[0,0],[.22,0]],.22,0xa39a7c,0xa39a7c),[0,.6,.08]);
 const water=put(g,K.bubbles(12,V(0,.3,.1),1.3,.3,.025));
 const names=['sand removes surface dirt','alkali removes grease','acid removes rust','rinse thoroughly with water'];const labels=names.map(s=>text(g,s,[0,1.85,0],.25));
 return t=>{const j=Math.min(3,Math.floor(t/3));labels.forEach((l,i)=>l.visible=i===j);pad.visible=j<3;pad.position.x=.16*Math.sin(t*3);pad.position.y=.4+.15*Math.cos(t*2);water.visible=j===3;water.userData.update(Math.max(0,t-9),1);};
}
export function rinsing(g,o={}) {
 put(g,K.beaker(.6,1.2),[0,0,0]);put(g,K.liquid(.56,.8,0x77aed3,.35),[0,.065,0]);
 const p=box(g,[.4,.65,.1],[0,.52,.05],COLORS.Sn),tongs=put(g,K.tongs(.55),[0,1.4,0]);
 const a=text(g,'tin-coated object',[0,2.25,0],.25),r=text(g,'rinse, then dry',[0,.2,.7],.23,'#ffd18a');
 return t=>{const y=lerp(.52,1.65,ease(span(t,1,4)));p.position.y=y;tongs.position.y=y+.6;r.visible=t>5;};
}
export function foodCan(g,o={}) {
 const c=put(g,K.solid(new THREE.CylinderGeometry(.48,.48,.85,40,1,true),M.metal(COLORS.Sn,.23)),[0,.45,0]);c.material.side=THREE.DoubleSide;
 const food=put(g,K.solid(new THREE.SphereGeometry(.25,24,16),M.matte(0xd95735)),[0,1.5,0]);
 text(g,'steel can, tin coating',[0,1.9,0],.25);const r=text(g,'coating keeps food acids from the steel',[0,.16,.6],.22,'#ffd18a');
 return t=>{food.position.y=K.drop(t,1.7,1.5,.33,.7,.025).y;r.visible=t>4;};
}
export function waterIons(g,o={}) {
 const ox=bead(g,'O',[.1,1.1,0],.3),h1=bead(g,'H',[-.5,.8,0],.18),h2=bead(g,'H',[.6,.8,0],.18);
 text(g,'water (H₂O)',[0,2.2,0],.26);const pos=text(g,'H⁺',[-1,1.55,0],.25,'#ffd18a'),neg=text(g,'OH⁻',[.55,1.65,0],.25,'#a8d5ff');
 const note=text(g,'a small amount ionizes',[0,.25,0],.23);
 return t=>{h1.position.x=lerp(-.5,-1,ease(span(t,2,6)));pos.visible=neg.visible=t>6;note.visible=t>5;};
}
export function carbonNumbers(g,o={}) {
 const a=new THREE.Group(),b=new THREE.Group();put(g,a,[-.95,0,0]);put(g,b,[.85,0,0]);
 bead(a,'C',[-.25,1.15,0],.25);bead(a,'O',[.3,1.15,0],.25);bead(b,'C',[0,1.15,0],.25);bead(b,'O',[-.55,1.15,0],.25);bead(b,'O',[.55,1.15,0],.25);
 text(a,'CO',[0,2.1,0],.25);text(b,'CO₂',[0,2.1,0],.25);const l=text(a,'C +2',[-.25,1.75,0],.22,'#ffd18a'),r=text(b,'C +4',[0,1.75,0],.22,'#ffd18a');
 text(a,'O −2',[.3,.65,0],.21);text(b,'each O −2',[0,.65,0],.21);
 return t=>{l.visible=t>2;r.visible=t>4;};
}
export function electrolysis(g,o={}) {
 const c=cellModel(g,{metal:'C',target:'C',bath:'molten sodium chloride (NaCl)'});
 const particles=['Cl','Cl','Na','Na'].map((s,i)=>{const p=bead(g,s,[(i%2?1:-1)*.27,.48+Math.floor(i/2)*.3,.3],.12);const sign=text(p,s==='Cl'?'−':'+',[0,.2,0],.15);return {p,sign,s};});
 const es=Array.from({length:2},()=>electron(g,[0,0,0]));
 const result=text(g,o.stage==='anode'?'chlorine gas Cl₂':'sodium metal Na',[0,.25,.62],.24,'#ffd18a');
 const bath=c.bath;
 return t=>{
  const an=o.stage==='anode',ca=o.stage==='cathode',all=o.stage==='collect';c.lbs[0].visible=!ca;c.lbs[1].visible=!an;
  bath.visible=t<2;result.visible=(an||ca)&&t>7;
  particles.forEach(({p,sign,s},i)=>{const active=an?s==='Cl':ca?s==='Na':false,u=ease(span(t,2.3+(i%2)*.6,5.3+(i%2)*.6));
   p.position.set(lerp((i%2?1:-1)*.27,an?-.65:.65,active?u:0),.48+Math.floor(i/2)*.3+(i%2)*.3,.3);
   p.visible=active||t<2.2||o.stage==='parts';sign.visible=t<7.2+(i%2)*.6;
   if(active&&t>7){p.position.y=lerp(p.position.y,an?1.25+(i%2)*.26:.67+(i%2)*.26,ease(span(t,7,8.5)));}
  });
  es.forEach((e,i)=>{e.visible=(an||ca)&&t>5+i*.6&&t<7.2+i*.6;e.position.copy(K.arc(an?V(-.65,.48+i*.3,.4):V(.82,1.4+i*.12,.4),an?V(-.82,1.5+i*.12,.4):V(.65,.78+i*.3,.4),.12,ease(span(t,5+i*.6,7.2+i*.6))));});
  c.supply.visible=ca&&t>5;c.remove.visible=an&&t>5;c.supply.userData.update(Math.max(0,t-5),1,1);c.remove.userData.update(Math.max(0,t-5),1,1);
 };
}
export function photography(g,o={}) {
 const film=put(g,K.filmStrip(3,.18),[0,.7,0]);film.scale.setScalar(2.5);film.rotation.x=.45;
 const tray=put(g,K.tank(1.8,.9,.3,.18),[0,0,0]);
 const light=put(g,K.sunLamp(.17),[-.9,1.2,0]);
 const labels=['light exposes silver salts','developer forms silver image','stop bath stops development','fixer removes unused silver salts','wash removes remaining fixer'].map(s=>text(g,s,[0,1.95,0],.23,'#ffd18a'));
 return t=>{const step=Math.min(4,Math.floor(t/2));labels.forEach((l,i)=>l.visible=i===step);for(let i=0;i<3;i++)film.userData.expose(i,span(t,2,4));film.position.y=lerp(.7,.22,ease(span(t,2,4)));light.visible=t<2;};
}
export function agent(g,o={}) {
 const colors={'KMnO₄':0x863482,'K₂Cr₂O₇':0xe59032,'Br₂':0x9f4325,'Cl₂':0xa7c747,'O₂':0x95bdd4};
 const jar=put(g,K.compoundJar('powder',colors[o.name]??0xe3e6e7,.23,.65),[0,.03,0]);
 text(g,o.name,[0,1.4,0],.28);const result=text(g,`${o.kind} electrons`,[0,.15,.4],.26,'#ffd18a');
 const e=electron(g,[o.kind==='takes'?-1:0,.9,.3]);
 return t=>{const u=ease(span(t,2,5));e.position.x=lerp(o.kind==='takes'?-1:0,o.kind==='takes'?0:1,u);e.visible=t>1&&t<5.3;result.visible=t>5.3;};
}
export function silver(g,o={}) {
 const spoon=put(g,K.tableSpoon(.9,0xd8dee6),[0,.15,0]);spoon.rotation.y=.5;
 const sw=put(g,K.sparkle(0xffffff,.2),[.2,.22,.1]);
 const label=text(g,'silver',[0,1.35,0],.28),result=text(g,'sterling: 92.5% Ag + 7.5% Cu',[0,.05,.4],.24,'#ffd18a');
 return t=>{sw.material.opacity=.4+.4*Math.sin(t*2);result.visible=t>3.5;};
}
export function comparison(g,o={}) {
 const names=['sugar: off','weak acid: dim','salt: bright'];
 const tests=[0,.25,1].map((level,i)=>{const root=put(g,new THREE.Group(),[(i-1)*1.4,0,0]);root.scale.setScalar(.43);const update=conduct(root,{name:names[i],level,result:''});text(g,names[i],[(i-1)*1.4,1.12,0],.21);return {root,update};});
 return t=>tests.forEach(({root,update},i)=>{update(t>i*.75?6:0);root.traverse(m=>{if(m.isSprite&&m.userData.h)m.visible=false;});});
}
export const BUILDERS={transfer,reaction,numbers,colorTest,cell:cellAction,daniell,conduct,rust,protect,dryCell,industrial,series,charge,rule,sharing,dissolve,displacement,chromium,firefly,carBattery,temperature,nelsonPool,alloy,cleaning,rinsing,foodCan,waterIons,carbonNumbers,electrolysis,photography,agent,silver,comparison};
