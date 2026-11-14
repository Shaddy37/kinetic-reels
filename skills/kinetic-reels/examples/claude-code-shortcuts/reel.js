// EXAMPLE (the gold reel): 7 Claude Code shortcuts almost nobody uses. 39.2 s, LAYOUT PASS.
// Facts: code.claude.com/docs/en/interactive-mode (@ file path mention, ! bash mode, Shift+Tab modes, Esc), /slash-commands (/init, /compact), /cli-reference (claude -c), /memory (CLAUDE.md). Read Nov 13, 2026.
// Study this file before you write a new reel: a header that counts n/7, keys on frame 0, a locked #7 (open loop), a new picture every 0.8 to 1.5 s.
const DUR=39.2, STAR_SRC='as/claude.svg';
const SCN=[0,5.5,10.37,15.34,19.6,24.13,27.52,31.51,36.54];
const WH=(t)=>`<div class="ch"><span class="dt"><b style="background:#FF5F57"></b><b style="background:#FEBC2E"></b><b style="background:#28C840"></b></span><img src="as/claudecode.svg">${t}</div>`;
const key=(l,c='')=>add(`<div class="kk ${c}"><span>${l}</span></div>`,'card');
const press=(e,t,tp,d=0.18)=>e.classList.toggle('dn',t>=tp&&t<tp+d);
// list header: SHORTCUT n/7 + name + 7 dots
const NAMES=['/init','@ file','! command','Shift + Tab','Esc','/compact','claude -c'];
const HD=NAMES.map((n,i)=>add(`<div class="lab hd"><span class="n">SHORTCUT ${i+1}/7</span><span class="t">${n}</span><div class="dots">${[0,1,2,3,4,5,6].map(j=>`<i class="${j<=i?'on':''}"></i>`).join('')}</div></div>`,'lab'));
const HD0=add(`<div class="lab hd"><span class="n">ALMOST NOBODY USES THEM</span><span class="t">7 Claude Code shortcuts</span></div>`,'lab');
const HD8=add(`<div class="lab hd"><span class="n">7/7 DONE</span><span class="t">Save this</span><div class="dots">${[0,1,2,3,4,5,6].map(()=>`<i class="on"></i>`).join('')}</div></div>`,'lab');
// S0 hook: 7 keys, #7 locked
const GK=[['/init',230,560],['@',540,560],['!',850,560],['⇧ Tab',230,760],['esc',540,760],['/compact',850,760],['?',540,960]];
const GKE=GK.map(([l])=>key(l,'sm'+(l==='?'?' gr':'')));
const LK0=add(`<div class="lock">🔒</div>`);
const WEB=[add(`<div class="lock">🕸️</div>`),add(`<div class="lock">🕸️</div>`)];
const QK=key('?','gr');const LK1=add(`<div class="lock">🔒</div>`);
const H7=add(`<div class="chip v">#7 saves me hours</div>`,'card');
const PLUS=[0,1,2].map(()=>add(`<div class="pct g">+1h</div>`));
// S1 /init
const K1=key('/init');
const TREE=add(`<div class="card win">${WH('~/my-app')}<div class="fr nr" id="nr"><span class="ic">📝</span><span id="nrt"></span><span class="nw">NEW</span></div>${[['📁','src'],['📁','tests'],['📄','package.json'],['📄','README.md'],['📄','index.ts']].map(([i,n],k)=>`<div class="fr" id="tr${k}"><span class="ic">${i}</span>${n}</div>`).join('')}</div>`,'card');
const DM=add(`<div class="card fg2"><img src="as/doc_memory.png"></div>`,'card');const DMS=add(`<div class="src">code.claude.com/docs/en/memory \u00b7 real page</div>`);
// S2 @
const K2=key('@');
const INP=add(`<div class="card win">${WH('claude \u00b7 ~/my-app')}<div class="ln2"><span class="pm">&gt;</span><span id="at"></span></div>${['src/auth.ts','src/api.ts','src/app.ts'].map((n,k)=>`<div class="fr" id="dd${k}"><span class="ic">📄</span>${n}</div>`).join('')}</div>`,'card');
const CTX=add(`<div class="ctx"><b>context</b></div>`,'prop');const FCH=add(`<div class="fchip"><span>📄</span>auth.ts</div>`);
const DA=add(`<div class="card fg2"><img src="as/doc_at.png"></div>`,'card');const DAS=add(`<div class="src">code.claude.com/docs/en/interactive-mode \u00b7 @ = File path mention</div>`);
// S3 !
const K3=key('!');
const TERM=add(`<div class="card win">${WH('claude \u00b7 ~/my-app')}<div class="bb" style="width:420px;margin-left:auto"></div><div class="gb" style="width:620px"></div><div class="gb" style="width:520px"></div><div class="ln2"><span class="pm">!</span><span id="bg"></span><span class="ret" id="r3">return</span></div><div class="out" id="o3">On branch main<div class="gb" style="width:360px;margin:12px 0 0"></div></div></div>`,'card');
// S4 Shift+Tab
const KS=key('⇧ shift','md'),KT=key('tab','md');const PL=add(`<div class="pct" style="color:#9A9AA5">+</div>`);
const MODE=add(`<div class="mode"><span class="pz"><b></b><b></b></span>plan mode on</div>`,'card');const TOG=add(`<div class="tog"><i></i></div>`,'card');
const PLAN=add(`<div class="card win">${WH('Plan')}${[520,430,580].map((w,k)=>`<div class="pl" id="pl${k}">${k+1}.<div style="width:${w}px"></div></div>`).join('')}</div>`,'card');
const ZF=add(`<div class="chip k">🔒 0 files changed</div>`,'card');
// S5 Esc
const KE=key('esc');
const PD=[...Array(28)].map(()=>add(`<div class="dotp"></div>`));const CD=add(`<div class="disc2" style="width:150px;height:150px"><img src="as/claude.svg" style="width:90px;height:90px"></div>`);
const XX=add(`<div class="xx">\u2715</div>`);
const STOP=add(`<svg class="stop" viewBox="0 0 300 300"><polygon points="88,6 212,6 294,88 294,212 212,294 88,294 6,212 6,88" fill="#DC2626" stroke="#fff" stroke-width="12"/><text x="150" y="182" text-anchor="middle" font-family="IT" font-weight="800" font-size="92" fill="#fff">STOP</text></svg>`,'card');
// S6 /compact
const KC6=key('/compact','md');
const LONG=add(`<div class="card win" style="width:600px;height:640px">${WH('long chat')}<div id="lc"></div></div>`,'card');
const LCB=document.getElementById('lc');const LBARS=[400,320,430,290,380,350,410,300].map((w,k)=>{const d=document.createElement('div');d.className='gb';d.style.width=w+'px';if(k%2)d.style.marginLeft='110px';LCB.appendChild(d);return d});
const SUMD=document.createElement('div');SUMD.className='sum';SUMD.textContent='summary';LCB.prepend(SUMD);
const NB=[360,280,390,260].map((w,k)=>{const d=document.createElement('div');d.className='gb';d.style.width=w+'px';if(k%2)d.style.marginLeft='110px';LCB.appendChild(d);return d});
const MET=add(`<div class="card met"><div id="mf"></div></div>`,'card');const PCT=add(`<div class="pct" id="pc">94%</div>`);
// S7 claude -c
const K7=key('?','gr');const LK7=add(`<div class="lock">🔓</div>`);
const T7=add(`<div class="card win">${WH('~/my-app')}<div class="ln2" style="min-height:150px"><span class="pm">$</span><span id="cc"></span><span class="ret" id="r7">return</span></div></div>`,'card');
const LAST=add(`<div class="card win">${WH('claude \u00b7 last chat')}<div class="bb" style="width:420px;margin-left:auto"></div><div class="gb" style="width:640px"></div><div class="gb" style="width:560px"></div><div class="bb" style="width:380px;margin-left:auto"></div><div class="gb" style="width:600px"></div><div style="display:flex;align-items:center"><span class="cur" id="cu" style="margin:18px 0 18px 34px"></span><span class="here" id="hr">you left off here</span></div></div>`,'card');
const BMK=add(`<div class="lock" style="font-size:150px">🔖</div>`);
// S8 CTA
const BM=add(`<svg class="bm" viewBox="0 0 300 360"><defs><linearGradient id="bg8" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6D28D9"/><stop offset=".55" stop-color="#C026D3"/><stop offset="1" stop-color="#EA580C"/></linearGradient></defs><path id="bmp" d="M40 24 Q40 10 56 10 H244 Q260 10 260 24 V340 L150 256 L40 340 Z" fill="#fff" stroke="#0B0B0F" stroke-width="16" stroke-linejoin="round"/></svg>`,'card');
const CUR=add(`<svg width="54" height="64" viewBox="0 0 42 50"><path d="M4 2 L4 40 L14 30 L21 46 L28 43 L21 28 L36 28 Z" fill="#111" stroke="#fff" stroke-width="3" stroke-linejoin="round"/></svg>`);
const MINI=['/init','@','!','⇧Tab','esc','/compact','-c'].map((l,i)=>key(l,'mini'+(i===6?' gr':'')));MINI[5].style.fontSize='21px';MINI[5].style.padding='0 8px';
const CAPS=[
[0.0,1.8,[['b','*7 Claude Code'],['m','shortcuts@1.0']]],
[1.8,3.27,[['m','almost *nobody'],['m','uses.@2.8']]],
[3.27,5.5,[['s','And number seven'],['p','saves me hours.@4.2']]],
[5.5,7.2,[['s','One.'],['b','*/init@6.06']]],
[7.2,10.37,[['s','Claude reads your repo'],['m','and writes its own@8.19'],['m','*CLAUDE.md file.@9.18']]],
[10.37,11.85,[['s','Two.'],['b','The *@ sign.@10.88']]],
[11.85,13.22,[['m','Type @,'],['s','then a file name,@12.5']]],
[13.22,15.34,[['s','and that file drops'],['m','straight into *context.@14.07']]],
[15.34,16.91,[['s','Three.'],['m','*Exclamation mark.@15.85']]],
[16.91,19.6,[['m','Run any *terminal command'],['s','right inside the chat.@18.22']]],
[19.6,21.15,[['s','Four.'],['b','*Shift + Tab.@20.14']]],
[21.15,22.17,[['m',"That's *plan mode."]]],
[22.17,24.13,[['s','Claude plans first,'],['p','and touches nothing.@22.92']]],
[24.13,25.31,[['s','Five.'],['b','*Escape.@24.65']]],
[25.31,27.52,[['m','It *stops Claude'],['s','the second it goes@25.8'],['s','the wrong way.@26.68']]],
[27.52,29.36,[['s','Six.'],['b','*/compact.@28.12']]],
[29.36,31.51,[['m','It shrinks a *long chat,'],['s','so you keep going.@30.35']]],
[31.51,33.88,[['s','And seven.'],['b','Type *claude -c.@32.19']]],
[33.88,36.54,[['m','It reopens your *last chat,'],['s','exactly where you left it.@35.08']]],
[36.54,38.96,[['b','*Save this'],['s','before your next session.@36.94']]]];
function scenes(t){
  document.getElementById('grid').style.opacity=0.5;
  // headers
  setT(HD0,labV(t,-0.4,5.45,540,290));HD.forEach((e,i)=>setT(e,labV(t,SCN[i+1],SCN[i+2]-0.05,540,290)));setT(HD8,labV(t,36.54,DUR+1,540,290));
  // S0
  GK.forEach(([l,x,y],i)=>{const v=popV(t,-0.3+i*0.1,3.2,x,y);v.y-=0;setT(GKE[i],v)});
  setT(LK0,{...popV(t,0.4,3.2,660,880),r:10*Math.sin(t*12)});
  WEB.forEach((e,i)=>{const a=1.85+i*0.3,tt=t-a;const y=tt<0?-200:(tt<0.3?-200+(i?640:600)*(tt/0.3)**2:(i?440:400)-18*Math.abs(Math.sin((tt-0.3)*8))*Math.exp(-(tt-0.3)*4));setT(e,{x:i?905:175,y:y+(i?0:0),o:hide(t,a,3.25)?0:1,r:8*Math.sin(tt*5)})});
  const q=popV(t,3.27,5.45,540,620);q.s*=1.25;q.r=4*Math.sin(t*16)*Math.exp(-(t-3.27)*1.2);setT(QK,q);setT(LK1,{...popV(t,3.4,5.45,720,470),r:14*Math.sin(t*14)});
  setT(H7,popV(t,4.2,5.45,540,900));PLUS.forEach((e,i)=>{const a=4.48+i*0.22,tt=t-a;setT(e,{x:[820,900,780][i],y:560-tt*220-i*70,o:tt<0?0:clamp(1-tt/0.9)*(t<5.45?1:0)})});
  // S1
  setT(K1,popV(t,5.55,7.15,540,640));press(K1,t,5.95);
  setT(TREE,cardV(t,7.2,9.15,690));const sc=Math.min(4,Math.floor(clamp((t-7.25)/0.85)*5));for(let k=0;k<5;k++)document.getElementById('tr'+k).classList.toggle('on',t<8.2&&k===sc);
  const nr=document.getElementById('nr'),np=eo3(prog(t,8.19,0.3));nr.style.height=(92*np)+'px';nr.style.opacity=np;nr.style.borderBottomWidth=np>0.02?'2px':'0';typ('nrt','CLAUDE.md',t,8.34,0.47);nr.querySelector('.nw').style.opacity=t>=8.86?1:0;
  setT(DM,cardV(t,9.18,10.3,660));setT(DMS,{x:540,y:960,o:eo3(prog(t,9.4,0.3))*(1-eo3(prog(t,10.3,0.2)))});
  // S2
  setT(K2,popV(t,10.4,11.8,540,640));press(K2,t,10.97);
  setT(INP,cardV(t,11.85,13.15,690));typ('at','@src/au',t,11.95,0.6);
  for(let k=0;k<3;k++){const d=document.getElementById('dd'+k);const p=eo3(prog(t,12.32,0.2));d.style.opacity=p;d.classList.toggle('on',k===Math.min(2,Math.floor(clamp((t-12.5)/0.5)*3)))}
  setT(CTX,cardV(t,13.22,14.0,800));{const tt=t-13.37;const land=tt>=0.35;const y=land?720:380+340*(clamp(tt/0.35))**2;setT(FCH,{x:540,y,o:hide(t,13.3,14.0)?0:1,r:land?0:-16+tt*50,s:land?1-0.06*Math.exp(-(tt-0.35)*10):1})}
  setT(DA,cardV(t,14.07,15.3,650));setT(DAS,{x:540,y:800,o:eo3(prog(t,14.3,0.3))*(1-eo3(prog(t,15.3,0.2)))});
  // S3
  setT(K3,popV(t,15.37,16.85,540,640));press(K3,t,15.84);
  setT(TERM,cardV(t,16.91,19.55,690));typ('bg',' git status',t,17.01,0.62);const r3=document.getElementById('r3');r3.style.opacity=t>=17.7?1:0;r3.classList.toggle('dn',t>=17.91&&t<18.08);
  const o3=document.getElementById('o3');o3.style.opacity=eo3(prog(t,18.16,0.25));
  // S4
  const ps=popV(t,19.65,21.1,350,640),pt=popV(t,19.72,21.1,770,640);setT(KS,ps);setT(KT,pt);setT(PL,{x:565,y:640,o:ps.o});press(KS,t,20.02,0.22);press(KT,t,20.02,0.22);
  setT(MODE,popV(t,21.15,22.1,540,590));setT(TOG,popV(t,21.2,22.1,540,790));TOG.classList.toggle('on',t>=21.45);TOG.querySelector('i').style.left=(15+110*eio(prog(t,21.4,0.15)))+'px';
  setT(PLAN,cardV(t,22.17,24.05,640));for(let k=0;k<3;k++)document.getElementById('pl'+k).style.opacity=eo3(prog(t,22.32+k*0.18,0.2));
  setT(ZF,popV(t,22.89,24.05,540,930));
  // S5
  setT(KE,popV(t,24.16,25.25,540,640));press(KE,t,24.47);
  const P=u=>{const A=[150,900],C=[560,960],B=[900,470];return [(1-u)**2*A[0]+2*(1-u)*u*C[0]+u*u*B[0],(1-u)**2*A[1]+2*(1-u)*u*C[1]+u*u*B[1]]};
  const on5=!hide(t,25.31,27.47);const m=0.72*eio(prog(t,25.35,0.88));
  PD.forEach((e,i)=>{const u=i/27;const [x,y]=P(u);setT(e,{x,y,o:on5?(u<=m?1:(u<=1?0.22:0)):0})});
  {const [x,y]=P(m);setT(CD,{x,y,o:on5?1:0,r:t>=26.23?8*Math.sin(t*22)*Math.exp(-(t-26.23)*3):0})}
  setT(XX,{x:930,y:440,o:on5?(t>=26.23?0.3:1):0});
  {const v=popV(t,26.18,27.47,700,640);if(t<26.3)v.s*=1.25;setT(STOP,v)}
  // S6
  setT(KC6,popV(t,27.55,29.3,540,640));press(KC6,t,28.02);
  setT(LONG,cardV(t,29.36,31.45,700,380));const sq=eio(prog(t,29.66,0.4));LBARS.forEach(d=>{d.style.height=(18*(1-sq))+'px';d.style.margin=(14*(1-sq))+'px '+d.style.marginRight;d.style.opacity=1-sq});
  SUMD.style.height=(100*eo3(prog(t,29.9,0.3)))+'px';SUMD.style.opacity=eo3(prog(t,29.9,0.3));SUMD.style.borderWidth=t>=29.9?'2px':'0';
  NB.forEach((d,k)=>{d.style.opacity=eo3(prog(t,30.4+k*0.16,0.2))});
  setT(MET,cardV(t,29.36,31.45,680,860));let v6=0.94-0.73*eio(prog(t,29.66,0.5));if(t>30.35)v6=0.21+0.05*clamp((t-30.35)/0.9);
  const col=v6>0.8?'#DC2626':(v6>0.5?'#EA580C':'#16A34A');const mf=document.getElementById('mf');mf.style.height=(100*v6)+'%';mf.style.background=col;
  const pc=document.getElementById('pc');pc.textContent=Math.round(v6*100)+'%';pc.style.color=col;setT(PCT,{x:860,y:1050,o:cardV(t,29.36,31.45,700).o});
  // S7
  {const v=popV(t,31.53,32.15,540,640);v.s*=1.25;setT(K7,v);const f=clamp((t-31.8)/0.25);K7.querySelector('span').textContent=f<0.5?'?':'-c';K7.querySelector('span').style.transform=`scaleX(${Math.max(0.03,Math.abs(Math.cos(f*Math.PI)))})`;
   const tt=t-31.81;setT(LK7,{x:720+300*Math.max(0,tt),y:470-500*Math.max(0,tt)+1400*Math.max(0,tt)**2,o:hide(t,31.55,32.3)?0:1,r:Math.max(0,tt)*400})}
  setT(T7,cardV(t,32.19,33.85,640));typ('cc',' claude -c',t,32.29,0.44);const r7=document.getElementById('r7');r7.style.opacity=t>=32.6?1:0;r7.classList.toggle('dn',t>=32.94&&t<33.1);
  setT(LAST,cardV(t,33.88,36.5,660));document.getElementById('cu').style.opacity=Math.floor(t*3)%2?0:1;
  {const hr=document.getElementById('hr');const p=prog(t,35.18,0.35);hr.style.opacity=eo3(prog(t,35.18,0.15));hr.style.transform=`scale(${0.6+0.4*spring(p)})`}
  {const tt=t-34.93;setT(BMK,{x:870,y:tt<0?-200:Math.min(420,-200+3200*tt*tt),o:hide(t,34.93,36.5)?0:1,r:6*Math.sin(tt*10)*Math.exp(-Math.max(0,tt)*3)})}
  // S8
  {const v=popV(t,36.56,DUR+1,540,600);if(t>=36.96)v.s*=1+0.1*Math.exp(-(t-36.96)*9)*Math.cos((t-36.96)*28);setT(BM,v);document.getElementById('bmp').setAttribute('fill',t>=36.96?'url(#bg8)':'#fff')}
  {const p=eio(prog(t,36.56,0.4));setT(CUR,{x:900-240*p,y:900-200*p,o:hide(t,36.56,DUR+1)?0:1,s:(t>=36.9&&t<37.0)?0.85:1})}
  MINI.forEach((e,i)=>setT(e,popV(t,37.15+i*0.09,DUR+1,100+i*146.5,930)));
}
