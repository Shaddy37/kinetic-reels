// kinetic-reels SCENE KIT. Load after core_a.js and BEFORE core_b.js (it defines DUR, SCN, CAPS and scenes()).
// You describe the reel in REEL = {...} (reel.js) and the kit builds every scene with the motion of the gold reel:
// keys already falling on frame 0, a locked last item (open loop), a header that counts n/N, a new picture every 1 to 2 s,
// real screenshots with source lines, a save CTA with a recap row. Full reference: references/KIT.md
(function(){
const R0=(typeof REEL!=='undefined')?REEL:window.REEL;if(!R0)throw new Error('kit.js: define const REEL={...} in reel.js before kit.js');
// Times can be numbers (seconds) or references that follow the voice when you re-record it (captions.py --write updates scn + caps):
// 's2' = scene start 2, 'g5' = caption group 5 starts, 'g5.1' = the @ anchor in row 1 of group 5, any of them + or - an offset: 'g5.1+0.2'
const SCNS=R0.scn||null, CPS=R0.caps||[];
function T(v,where){if(typeof v!=='string')return v;const m=v.trim().match(/^(s|g)(\d+)(?:\.(\d+))?\s*([+-]\s*[\d.]+)?$/);
  if(!m)throw new Error('kit.js: bad time "'+v+'" in '+where+' (use a number, s2, g5, g5.1 or g5.1+0.3)');let t;
  if(m[1]==='s'){if(!SCNS)throw new Error('kit.js: "'+v+'" needs REEL.scn (captions.py --write adds it)');t=SCNS[+m[2]]}
  else{const g=CPS[+m[2]];if(!g)throw new Error('kit.js: "'+v+'" in '+where+': there is no caption group '+m[2]+' (0 to '+(CPS.length-1)+')');
    if(m[3]==null)t=g[0];else{const row=g[2][+m[3]];const an=row&&String(row[1]).match(/@([\d.]+)/);t=an?+an[1]:g[0]}}
  if(t==null||isNaN(t))throw new Error('kit.js: "'+v+'" in '+where+' points at nothing');return t+(m[4]?parseFloat(m[4].replace(/\s/g,'')):0)}
function fixTimes(o,where){for(const k in o){if(k==='at'||/At$/.test(k))o[k]=T(o[k],where+'.'+k);else if(k==='webs')o[k]=o[k].map((x,i)=>T(x,where+'.webs['+i+']'))}}
R0.scenes.forEach((s,i)=>{fixTimes(s,'scene '+i);(s.beats||[]).forEach((b,j)=>fixTimes(b,'scene '+i+' beat '+j))});
const D=R0.dur, S=R0.scenes, starts=S.map(s=>s.at), N=S.length;
window.DUR=D; window.SCN=starts; window.CAPS=R0.caps;
const endOf=i=>i<N-1?starts[i+1]:D+1;
const WH=(t,ic=R0.windowIcon)=>`<div class="ch"><span class="dt"><b style="background:#FF5F57"></b><b style="background:#FEBC2E"></b><b style="background:#28C840"></b></span>${ic?`<img src="${ic}">`:''}${t}</div>`;
const key=(l,c='')=>add(`<div class="kk ${c}"><span>${l}</span></div>`,'card');
const press=(e,t,tp,d=0.18)=>e.classList.toggle('dn',t>=tp&&t<tp+d);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const CUES=[];const cue=(t,k,g=1,e)=>{if(t>=0&&t<D)CUES.push(e!=null?[+t.toFixed(3),k,g,+e.toFixed(3)]:[+t.toFixed(3),k,g])};
let uid=0;const nid=p=>p+(uid++);
const items=S.filter(s=>s.kind==='item'); const total=items.length;
const H=R0.header||{};const DR=[];
// header: kicker + title + dots, one per scene
S.forEach((s,i)=>{let html;
  if(s.kind==='hook')html=`<div class="lab hd"><span class="n">${esc(H.kicker||'')}</span><span class="t">${esc(H.title||'')}</span></div>`;
  else if(s.kind==='item'){const k=items.indexOf(s);html=`<div class="lab hd"><span class="n">${esc((H.item||'TIP').toUpperCase())} ${k+1}/${total}</span><span class="t">${esc(s.name||s.key)}</span><div class="dots">${items.map((_,j)=>`<i class="${j<=k?'on':''}"></i>`).join('')}</div></div>`}
  else html=`<div class="lab hd"><span class="n">${total}/${total} DONE</span><span class="t">${esc(s.title||'Save this')}</span><div class="dots">${items.map(()=>`<i class="on"></i>`).join('')}</div></div>`;
  const e=add(html,'lab');DR.push(t=>setT(e,labV(t,i?s.at:-0.4,endOf(i)-0.05,540,290)))});
// beats: each beat runs from its at to the next beat's at (or the scene end)
function beatSpan(s,j){const b=s.beats[j];const nx=j<s.beats.length-1?s.beats[j+1].at:endOf(S.indexOf(s));return [b.at,nx-0.05]}
const B={
 // a window with file rows; a highlight walks the rows, then a NEW row types in
 files(b,a,z){const id=nid('f');const rows=(b.rows||[]).map(([i,n],k)=>`<div class="fr" id="${id}r${k}"><span class="ic">${i}</span>${esc(n)}</div>`).join('');
   const e=add(`<div class="card win">${WH(esc(b.title||'~/my-app'),b.icon)}${b.newRow?`<div class="fr nr" id="${id}n"><span class="ic">${b.newIcon||'📝'}</span><span id="${id}nt"></span><span class="nw">NEW</span></div>`:''}${rows}</div>`,'card');
   const nAt=b.newAt??(a+1.0),n=(b.rows||[]).length;
   return t=>{setT(e,cardV(t,a,z,690));const sc=Math.min(n-1,Math.floor(clamp((t-a-0.05)/0.85)*n));for(let k=0;k<n;k++)document.getElementById(id+'r'+k).classList.toggle('on',t<nAt&&k===sc);
     if(b.newRow){const nr=document.getElementById(id+'n'),np=eo3(prog(t,nAt,0.3));nr.style.height=(92*np)+'px';nr.style.opacity=np;nr.style.borderBottomWidth=np>0.02?'2px':'0';typ(id+'nt',b.newRow,t,nAt+0.15,0.47);nr.querySelector('.nw').style.opacity=t>=nAt+0.67?1:0}}},
 // a real screenshot in a card + its source line. b.src = as/<file>.png, b.source = 'domain/path · what it shows'
 doc(b,a,z){const e=add(`<div class="card fg2"><img src="${b.src}"></div>`,'card');const s=add(`<div class="src">${esc(b.source||'')}</div>`);const y=b.y||660,sy=b.sourceY||(y+300);
   return t=>{setT(e,cardV(t,a,z,y));setT(s,{x:540,y:sy,o:eo3(prog(t,a+0.22,0.3))*(1-eo3(prog(t,z,0.2)))})}},
 // a window where a command or prompt types in; optional dropdown rows, a return key press and an output line
 type(b,a,z){const id=nid('t');const dd=(b.dropdown||[]).map((n,k)=>`<div class="fr" id="${id}d${k}"><span class="ic">📄</span>${esc(n)}</div>`).join('');
   const pre=b.pre?`<div class="bb" style="width:420px;margin-left:auto"></div><div class="gb" style="width:620px"></div><div class="gb" style="width:520px"></div>`:'';
   const e=add(`<div class="card win">${WH(esc(b.title||'terminal'),b.icon)}${pre}<div class="ln2" style="${b.dropdown?'':'min-height:150px'}"><span class="pm">${esc(b.prompt||'$')}</span><span id="${id}x"></span>${b.enter?`<span class="ret" id="${id}r">return</span>`:''}</div>${dd}${b.output?`<div class="out" id="${id}o">${esc(b.output)}</div>`:''}</div>`,'card');
   const tl=b.typeFor||Math.min(1.2,0.06*b.text.length+0.2),ent=a+0.1+tl+0.3;
   return t=>{setT(e,cardV(t,a,z,b.y||690));typ(id+'x',' '+b.text,t,a+0.1,tl);
     if(b.enter){const r=document.getElementById(id+'r');r.style.opacity=t>=a+0.1+tl?1:0;r.classList.toggle('dn',t>=ent&&t<ent+0.17)}
     (b.dropdown||[]).forEach((_,k)=>{const d=document.getElementById(id+'d'+k);d.style.opacity=eo3(prog(t,a+0.47,0.2));d.classList.toggle('on',k===Math.min(b.dropdown.length-1,Math.floor(clamp((t-a-0.65)/0.5)*b.dropdown.length)))});
     if(b.output)document.getElementById(id+'o').style.opacity=eo3(prog(t,ent+0.25,0.25))}},
 // a chip falls into a dashed bucket (adding a file to context, a task to a queue...)
 drop(b,a,z){const c=add(`<div class="ctx"><b>${esc(b.into||'context')}</b></div>`,'prop');const f=add(`<div class="fchip"><span>${b.icon||'📄'}</span>${esc(b.chip)}</div>`);
   return t=>{setT(c,cardV(t,a,z,800));const tt=t-a-0.15;const land=tt>=0.35;const y=land?720:380+340*(clamp(tt/0.35))**2;setT(f,{x:540,y,o:hide(t,a+0.08,z)?0:1,r:land?0:-16+tt*50,s:land?1-0.06*Math.exp(-(tt-0.35)*10):1})}},
 // two keys pressed together (Shift + Tab, Cmd + K)
 combo(b,a,z){const k1=key(b.keys[0],'md'),k2=key(b.keys[1],'md');const pl=add(`<div class="pct" style="color:#9A9AA5">+</div>`);const pt=b.pressAt??(a+0.37);
   return t=>{const p1=popV(t,a+0.05,z,350,640),p2=popV(t,a+0.12,z,770,640);setT(k1,p1);setT(k2,p2);setT(pl,{x:565,y:640,o:p1.o});press(k1,t,pt,0.22);press(k2,t,pt,0.22)}},
 // a mode pill + a toggle that switches on
 toggle(b,a,z){const m=add(`<div class="mode"><span class="pz"><b></b><b></b></span>${esc(b.label)}</div>`,'card');const g=add(`<div class="tog"><i></i></div>`,'card');const on=b.onAt??(a+0.3);
   return t=>{setT(m,popV(t,a,z,540,590));setT(g,popV(t,a+0.05,z,540,790));g.classList.toggle('on',t>=on);g.querySelector('i').style.left=(15+110*eio(prog(t,on-0.05,0.15)))+'px'}},
 // a window with numbered lines appearing (a plan, steps, a list) + an optional chip under it
 plan(b,a,z){const id=nid('p');const ws=b.widths||[520,430,580];const e=add(`<div class="card win">${WH(esc(b.title||'Plan'),b.icon)}${ws.map((w,k)=>`<div class="pl" id="${id}${k}">${k+1}.<div style="width:${w}px"></div></div>`).join('')}</div>`,'card');
   const c=b.chip?add(`<div class="chip k">${esc(b.chip)}</div>`,'card'):null;
   return t=>{setT(e,cardV(t,a,z,640));ws.forEach((_,k)=>document.getElementById(id+k).style.opacity=eo3(prog(t,a+0.15+k*0.18,0.2)));if(c)setT(c,popV(t,b.chipAt??(a+0.72),z,540,930))}},
 // something heads the wrong way along a path, then a STOP sign slams in
 stop(b,a,z){const P=u=>{const A=[150,900],C=[560,960],E=[900,470];return [(1-u)**2*A[0]+2*(1-u)*u*C[0]+u*u*E[0],(1-u)**2*A[1]+2*(1-u)*u*C[1]+u*u*E[1]]};
   const pd=[...Array(28)].map(()=>add(`<div class="dotp"></div>`));const cd=add(`<div class="disc2" style="width:150px;height:150px"><img src="${b.logo||STAR_SRC}" style="width:90px;height:90px"></div>`);const xx=add(`<div class="xx">\u2715</div>`);
   const st=add(`<svg class="stop" viewBox="0 0 300 300"><polygon points="88,6 212,6 294,88 294,212 212,294 88,294 6,212 6,88" fill="#DC2626" stroke="#fff" stroke-width="12"/><text x="150" y="182" text-anchor="middle" font-family="IT" font-weight="800" font-size="92" fill="#fff">${esc(b.word||'STOP')}</text></svg>`,'card');const sa=b.stopAt??(a+0.87);
   return t=>{const on=!hide(t,a,z);const m=0.72*eio(prog(t,a+0.04,sa-a));pd.forEach((e,i)=>{const u=i/27;const [x,y]=P(u);setT(e,{x,y,o:on?(u<=m?1:0.22):0})});
     const [x,y]=P(m);setT(cd,{x,y,o:on?1:0,r:t>=sa?8*Math.sin(t*22)*Math.exp(-(t-sa)*3):0});setT(xx,{x:930,y:440,o:on?(t>=sa?0.3:1):0});const v=popV(t,sa-0.05,z,700,640);if(t<sa+0.07)v.s*=1.25;setT(st,v)}},
 // a long chat squeezes into a summary while a meter drops (context, tokens, battery, cost)
 squeeze(b,a,z){const id=nid('q');const L=add(`<div class="card win" style="width:600px;height:640px">${WH(esc(b.title||'long chat'))}<div id="${id}"></div></div>`,'card');
   const box=document.getElementById(id);const bars=[400,320,430,290,380,350,410,300].map((w,k)=>{const d=document.createElement('div');d.className='gb';d.style.width=w+'px';if(k%2)d.style.marginLeft='110px';box.appendChild(d);return d});
   const sm=document.createElement('div');sm.className='sum';sm.textContent=b.summary||'summary';box.prepend(sm);
   const nb=[360,280,390,260].map((w,k)=>{const d=document.createElement('div');d.className='gb';d.style.width=w+'px';if(k%2)d.style.marginLeft='110px';box.appendChild(d);return d});
   const mid=nid('m');const M=add(`<div class="card met"><div id="${mid}"></div></div>`,'card');const pid=nid('pc');const P=add(`<div class="pct" id="${pid}">94%</div>`);
   const from=b.from??0.94,to=b.to??0.21;
   return t=>{setT(L,cardV(t,a,z,700,380));const sq=eio(prog(t,a+0.3,0.4));bars.forEach(d=>{d.style.height=(18*(1-sq))+'px';d.style.margin=(14*(1-sq))+'px '+d.style.marginRight;d.style.opacity=1-sq});
     sm.style.height=(100*eo3(prog(t,a+0.54,0.3)))+'px';sm.style.opacity=eo3(prog(t,a+0.54,0.3));sm.style.borderWidth=t>=a+0.54?'2px':'0';nb.forEach((d,k)=>{d.style.opacity=eo3(prog(t,a+1.04+k*0.16,0.2))});
     setT(M,cardV(t,a,z,680,860));let v=from-(from-to)*eio(prog(t,a+0.3,0.5));if(t>a+0.99)v=to+0.05*clamp((t-a-0.99)/0.9);const col=v>0.8?'#DC2626':(v>0.5?'#EA580C':'#16A34A');
     const mf=document.getElementById(mid);mf.style.height=(100*v)+'%';mf.style.background=col;const pc=document.getElementById(pid);pc.textContent=Math.round(v*100)+'%';pc.style.color=col;setT(P,{x:860,y:1050,o:cardV(t,a,z,700).o})}},
 // a window showing where you left off: a blinking cursor + a gradient pill
 resume(b,a,z){const id=nid('u');const e=add(`<div class="card win">${WH(esc(b.title||'last chat'),b.icon)}<div class="bb" style="width:420px;margin-left:auto"></div><div class="gb" style="width:640px"></div><div class="gb" style="width:560px"></div><div class="bb" style="width:380px;margin-left:auto"></div><div class="gb" style="width:600px"></div><div style="display:flex;align-items:center"><span class="cur" id="${id}c" style="margin:18px 0 18px 34px"></span><span class="here" id="${id}h">${esc(b.label||'you left off here')}</span></div></div>`,'card');
   const ha=b.labelAt??(a+1.3);const bm=b.bookmark?add(`<div class="lock" style="font-size:150px">🔖</div>`):null;
   return t=>{setT(e,cardV(t,a,z,660));document.getElementById(id+'c').style.opacity=Math.floor(t*3)%2?0:1;const h=document.getElementById(id+'h');h.style.opacity=eo3(prog(t,ha,0.15));h.style.transform=`scale(${0.6+0.4*spring(prog(t,ha,0.35))})`;
     if(bm){const tt=t-ha+0.25;setT(bm,{x:870,y:tt<0?-200:Math.min(420,-200+3200*tt*tt),o:hide(t,ha-0.25,z)?0:1,r:6*Math.sin(tt*10)*Math.exp(-Math.max(0,tt)*3)})}}},
 // a big gradient number that counts up, with a label (real numbers only)
 big(b,a,z){const id=nid('h');const e=add(`<div class="card hero" style="height:260px"><b id="${id}">0</b><span>${esc(b.label||'')}</span></div>`,'card');const d=b.countFor||1.2;
   return t=>{setT(e,cardV(t,a,z,b.y||660));const v=b.value*eo3(prog(t,a+0.15,d));document.getElementById(id).textContent=(b.prefix||'')+fmt(v)+(b.suffix||'')}},
 // a logo tile with a label (a tool, a company, a model)
 tile(b,a,z){const e=add(`<div class="card hl"><img src="${b.logo}"><b>${esc(b.label||'')}</b></div>`,'card');return t=>setT(e,popV(t,a,z,b.x||540,b.y||640))},
 // up to 3 chips popping in a column (what works, what is new, prices)
 chips(b,a,z){const es=b.items.map((c,k)=>add(`<div class="chip ${['v','k',''][k%3]}">${esc(c)}</div>`,'card'));return t=>es.forEach((e,k)=>setT(e,popV(t,a+k*0.22,z,540,560+k*130)))},
 // a docs quote with one highlighted phrase: b.text has [[the phrase]]
 quote(b,a,z){const e=add(`<div class="card dq"><div class="h">${b.icon?`<img src="${b.icon}">`:''}${esc(b.source||'')}</div><p>${esc(b.text).replace(/\[\[(.+?)\]\]/,'<mark>$1</mark>')}</p></div>`,'card');return t=>setT(e,cardV(t,a,z,b.y||660))},
};
// the sound of every beat (mix.py reads these through shot.cjs cues, so every picture change has a sound without hand timing)
const SND={
 files:(b,a)=>{cue(a,'soft');for(let k=0;k<(b.rows||[]).length;k++)cue(a+0.05+k*0.85/(b.rows.length),'tick',0.5);if(b.newRow){const n=b.newAt??(a+1.0);cue(n+0.15,'typing',0.8,n+0.62);cue(n+0.67,'pop',0.9)}},
 doc:(b,a)=>cue(a,'whoosh',0.7),
 type:(b,a)=>{const tl=b.typeFor||Math.min(1.2,0.06*b.text.length+0.2);cue(a,'soft');cue(a+0.1,'typing',0.85,a+0.1+tl);if(b.dropdown)cue(a+0.47,'pop',0.6);if(b.enter)cue(a+0.4+tl,'click',1.3);if(b.output)cue(a+0.65+tl,'pop',0.6)},
 drop:(b,a)=>{cue(a+0.15,'whistle',0.8);cue(a+0.5,'thud',1.0)},
 combo:(b,a)=>{cue(a+0.05,'thud',0.8);const p=b.pressAt??(a+0.37);cue(p,'click',1.3);cue(p+0.02,'click',1.0)},
 toggle:(b,a)=>{cue(a,'pop',0.6);cue(b.onAt??(a+0.3),'click',1.2)},
 plan:(b,a)=>{(b.widths||[1,2,3]).forEach((_,k)=>cue(a+0.15+k*0.18,'pop',0.5));if(b.chip)cue(b.chipAt??(a+0.72),'thud',0.8)},
 stop:(b,a)=>{const sa=b.stopAt??(a+0.87);cue(a,'riser',0.5,sa-a);cue(sa,'boom',0.7);cue(sa+0.05,'thud',1.0)},
 squeeze:(b,a)=>{cue(a,'soft');cue(a+0.3,'whoosh',0.9);for(let k=0;k<4;k++)cue(a+1.04+k*0.16,'pop',0.4)},
 resume:(b,a)=>{cue(a,'soft');const h=b.labelAt??(a+1.3);cue(h,'chime',0.5);if(b.bookmark)cue(h-0.25,'whistle',0.8)},
 big:(b,a)=>{cue(a,'soft');const d=b.countFor||1.2;for(let k=0;k<10;k++)cue(a+0.15+k*d/10,'tick',0.45);cue(a+0.15+d,'chime',0.8)},
 tile:(b,a)=>cue(a,'pop',0.9),
 chips:(b,a)=>b.items.forEach((_,k)=>cue(a+k*0.22,'pop',0.7)),
 quote:(b,a)=>cue(a,'whoosh',0.7),
};
S.forEach((s,i)=>{if(i>0)cue(s.at-0.05,'soft',1.0)});
const DRAW=[];
S.forEach((s,i)=>{const sEnd=endOf(i)-0.05;
 if(s.kind==='hook'){ // the hook grid: every item's key already landing on frame 0, the last one locked
   const labels=items.map(it=>it.key);const n=labels.length;const cols=n<=4?2:3;const xs=cols===2?[350,730]:[230,540,850];
   const pos=labels.map((_,k)=>{const r=Math.floor(k/cols),c=k%cols;const inRow=Math.min(cols,n-r*cols);const off=(cols-inRow)*(cols===2?190:155);return [xs[c]+off,560+r*200]});
   const lockLast=s.lock!==false;const loopAt=s.loopAt??(sEnd-2.2);
   const ke=labels.map((l,k)=>key(lockLast&&k===n-1?'?':l,'sm'+(lockLast&&k===n-1?' gr':'')));
   const lk=lockLast?add(`<div class="lock">🔒</div>`):null;
   const webs=(s.webs||[]).map(()=>add(`<div class="lock">🕸️</div>`));
   const QK=lockLast?key('?','gr'):null;const LK1=lockLast?add(`<div class="lock">🔒</div>`):null;
   const ch=s.chip?add(`<div class="chip v">${esc(s.chip)}</div>`,'card'):null;const chAt=s.chipAt??(loopAt+0.9);
   const fl=s.floats?[0,1,2].map(()=>add(`<div class="pct g">${esc(s.floats)}</div>`)):[];
   cue(0,'whoosh',0.7);pos.forEach((_,k)=>cue(Math.max(0,-0.12+k*0.1),'thud',0.55));(s.webs||[]).forEach((w,k)=>cue(w,'whistle',k?0.5:0.6));
   if(lockLast)cue(loopAt,'pop',1.0);if(ch){cue(chAt,'pop',0.8);if(s.floats)[0,1,2].forEach(k=>cue(chAt+0.28+k*0.22,'coin',0.6))}
   DRAW.push(t=>{const gOut=lockLast?loopAt-0.07:sEnd;pos.forEach(([x,y],k)=>setT(ke[k],popV(t,-0.3+k*0.1,gOut,x,y)));
     if(lk){const [x,y]=pos[n-1];setT(lk,{...popV(t,0.4,gOut,x+120,y-80),r:10*Math.sin(t*12)})}
     webs.forEach((e,k)=>{const wa=s.webs[k],tt=t-wa;const y=tt<0?-200:(tt<0.3?-200+(k?640:600)*(tt/0.3)**2:(k?440:400)-18*Math.abs(Math.sin((tt-0.3)*8))*Math.exp(-(tt-0.3)*4));setT(e,{x:k?905:175,y,o:hide(t,wa,gOut)?0:1,r:8*Math.sin(tt*5)})});
     if(QK){const q=popV(t,loopAt,sEnd,540,620);q.s*=1.25;q.r=4*Math.sin(t*16)*Math.exp(-(t-loopAt)*1.2);setT(QK,q);setT(LK1,{...popV(t,loopAt+0.13,sEnd,720,470),r:14*Math.sin(t*14)})}
     if(ch)setT(ch,popV(t,chAt,sEnd,540,900));fl.forEach((e,k)=>{const fa=chAt+0.28+k*0.22,tt=t-fa;setT(e,{x:[820,900,780][k],y:560-tt*220-k*70,o:tt<0?0:clamp(1-tt/0.9)*(t<sEnd?1:0)})})});
 } else if(s.kind==='item'){ // slam the key, then the beats that SHOW what it does
   const hk=S.find(x=>x.kind==='hook');const last=items.indexOf(s)===total-1&&!!hk&&hk.lock!==false;const first=(s.beats&&s.beats[0])?s.beats[0].at:sEnd;const noKey=first<=s.at+0.05;
   if(!noKey){const k=key(last?'?':s.key,(s.size||(s.key.length>5?'md':''))+(last?' gr':''));const pa=s.pressAt??(s.at+0.45);
   const lk=last?add(`<div class="lock">🔓</div>`):null;
   cue(s.at,'boom',0.45);cue(s.at+0.12,'thud',0.9);cue(pa,'click',1.3);if(last){cue(pa,'coin',0.7);cue(pa+0.6,'chime',1.0)}
   DRAW.push(t=>{const v=popV(t,s.at+0.03,first-0.05,540,640);if(last){v.s*=1.25;const f=clamp((t-pa+0.15)/0.25);const sp=k.querySelector('span');sp.textContent=f<0.5?'?':s.key;sp.style.transform=`scaleX(${Math.max(0.03,Math.abs(Math.cos(f*Math.PI)))})`;
       const tt=t-pa+0.14;setT(lk,{x:720+300*Math.max(0,tt),y:470-500*Math.max(0,tt)+1400*Math.max(0,tt)**2,o:hide(t,s.at+0.05,s.at+0.8)?0:1,r:Math.max(0,tt)*400})}
     else press(k,t,pa);setT(k,v)})}
   (s.beats||[]).forEach((b,j)=>{const [a,z]=beatSpan(s,j);const f=B[b.kind];if(!f)throw new Error('kit.js: unknown beat kind "'+b.kind+'". Kinds: '+Object.keys(B).join(', '));DRAW.push(f(b,a,z));if(b.sound!==false)SND[b.kind](b,a)});
 } else if(s.kind==='cta'){ // save CTA: a bookmark that fills with the gradient on the click + a recap row of every key
   const bm=add(`<svg class="bm" viewBox="0 0 300 360"><defs><linearGradient id="kbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6D28D9"/><stop offset=".55" stop-color="#C026D3"/><stop offset="1" stop-color="#EA580C"/></linearGradient></defs><path id="kbmp" d="M40 24 Q40 10 56 10 H244 Q260 10 260 24 V340 L150 256 L40 340 Z" fill="#fff" stroke="#0B0B0F" stroke-width="16" stroke-linejoin="round"/></svg>`,'card');
   const cur=add(`<svg width="54" height="64" viewBox="0 0 42 50"><path d="M4 2 L4 40 L14 30 L21 46 L28 43 L21 28 L36 28 Z" fill="#111" stroke="#fff" stroke-width="3" stroke-linejoin="round"/></svg>`);
   const labs=s.recap||items.map(x=>x.short||x.key);const W=Math.min(146.5,880/Math.max(1,labs.length-1));const mini=labs.map((l,k)=>key(l,'mini'+(k===labs.length-1?' gr':'')));
   mini.forEach(e=>{if(e.textContent.length>5){e.style.fontSize='21px';e.style.padding='0 8px'}});const ck=s.clickAt??(s.at+0.42);cue(s.at,'whoosh',0.7);cue(ck,'click',1.3);cue(ck+0.02,'coin',0.7);labs.forEach((_,k)=>cue(s.at+0.61+k*0.09,'pop',0.35));
   DRAW.push(t=>{const v=popV(t,s.at+0.02,D+1,540,600);if(t>=ck)v.s*=1+0.1*Math.exp(-(t-ck)*9)*Math.cos((t-ck)*28);setT(bm,v);document.getElementById('kbmp').setAttribute('fill',t>=ck?'url(#kbg)':'#fff');
     const p=eio(prog(t,s.at+0.02,0.4));setT(cur,{x:900-240*p,y:900-200*p,o:hide(t,s.at+0.02,D+1)?0:1,s:(t>=ck-0.06&&t<ck+0.04)?0.85:1});
     mini.forEach((e,k)=>setT(e,popV(t,s.at+0.61+k*0.09,D+1,540-(labs.length-1)*W/2+k*W,930)))});
 } else if(s.kind==='end'){ // end card: your photo (or initials), name, handle
   const ini=(BRAND.name||'?').split(' ').map(w=>w[0]||'').join('').slice(0,2).toUpperCase();
   const e=add(`<div class="endrow"><div class="fc">${BRAND.face?`<img src="${BRAND.face}">`:`<div class="ini">${ini}</div>`}</div><div><b>${esc(BRAND.name)}</b><span>${esc(BRAND.handle)}</span></div></div>`,'lab');
   cue(s.at+0.1,'chime',0.6);DRAW.push(t=>setT(e,{x:540,y:700+(1-eo5(prog(t,s.at,0.45)))*30,o:eo3(prog(t,s.at,0.3))}));
 } else if(s.kind==='custom'){ /* your own scene: write it in REEL.custom(t) */ }
});
(R0.sounds||[]).forEach(e=>CUES.push(e));CUES.sort((x,y)=>x[0]-y[0]);window.KIT_CUES={dur:D,scn:starts,events:CUES};
window.scenes=t=>{document.getElementById('grid').style.opacity=0.5;DR.forEach(f=>f(t));DRAW.forEach(f=>f(t));if(R0.custom)R0.custom(t)};
})();
