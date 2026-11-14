// kinetic-reels engine, part B: corner logos, word-timed kinetic captions, the layout judge and boot.
// Needs DUR, SCN, STAR_SRC, CAPS and scenes(t) from reel.js.
const S1=add(`<img class="star" src="${STAR_SRC}">`),S2=add(`<img class="star" src="${STAR_SRC}">`);
const SPS=[[[40,180,1],[1070,1830,.85]],[[1050,170,.95],[20,1840,.85]],[[30,170,1],[1060,1840,.8]],[[1060,160,.9],[20,1830,.85]],[[30,160,.95],[1070,1840,.8]],[[1050,170,1],[20,1840,.85]],[[40,180,.9],[1060,1830,.8]],[[50,190,1.1],[1040,1810,1]]];
const SP=SCN.map((_,i)=>i===SCN.length-1?SPS[7]:SPS[i%7]);
function sceneOf(t){let s=0;for(let i=0;i<SCN.length;i++)if(t>=SCN[i])s=i;return s}
function drawStars(t){const s=sceneOf(t);[S1,S2].forEach((e,k)=>{let [x,y,sc]=SP[s][k];let m=1;
  if(s>0){const p=prog(t,SCN[s]-0.05,0.5);const [px,py,ps]=SP[s-1][k];if(p<0.4){x=px;y=py;sc=ps;m=1-eo3(p/0.4)}else m=eo3((p-0.4)/0.6)}
  if(s===0)m=eo3(prog(t,0,0.6));setT(e,{x,y,s:sc*(0.12+0.88*m)*(1+0.02*Math.sin(t*1.3+k)),o:m,r:t*8*(k?-1:1)+k*20,b:0.6})})}
// CAPS = [[start, end, [[size, text], ...]], ...]  sizes: s 54 px, m 78 px, b 100 px, p = black pill (punch line)
// *word = gradient (ONE phrase per group). ~word = serif italic punch word. word@12.3 = this word starts at 12.3 s
const CAPEL=document.getElementById('cap');const G=[];
CAPS.forEach(([t0,t1,lines])=>{const grp=document.createElement('div');grp.className='grp';CAPEL.appendChild(grp);const words=[];
  lines.forEach(([cls,txt])=>{const ln=document.createElement('div');ln.className='ln '+(cls==='p'?'b':cls);grp.appendChild(ln);let host=ln;
    if(cls==='p'){host=document.createElement('span');host.className='pillw';ln.appendChild(host)}
    const toks=txt.split(' ');toks.forEach((tk,i)=>{let g=tk.startsWith('*');if(g)tk=tk.slice(1);let pw=tk.startsWith('~');if(pw)tk=tk.slice(1);let at=null;const m=tk.match(/^(.*)@([\d.]+)$/);if(m){tk=m[1];at=+m[2]}
      const sp=document.createElement('span');sp.className='w'+(g?' g':'')+(pw?' pw':'');sp.textContent=tk+(i<toks.length-1?' ':'');if(cls==='p')sp.style.color='#FFFFFF';host.appendChild(sp);words.push({el:sp,txt:tk,at,g:g||pw,pill:cls==='p'})});
    ln.dataset.chk='cap'});
  const n=words.length,wts=words.map(w=>w.txt.replace(/[^\w']/g,'').length+1.6);const an=[[0,t0]];words.forEach((w,i)=>{if(w.at!=null&&i>0)an.push([i,w.at])});an.push([n,t1]);
  for(let a=0;a<an.length-1;a++){const [i0,ta]=an[a],[i1,tb]=an[a+1];let tot=0;for(let i=i0;i<i1;i++)tot+=wts[i];let c=0;for(let i=i0;i<i1;i++){words[i].t=ta+(tb-ta)*c/tot;c+=wts[i]}}
  G.push({grp,words,t0,t1,lines:[...grp.children]})});
G.forEach((g,i)=>{g.gs=g.t0-0.1;g.ge=(i<G.length-1)?G[i+1].t0-0.14:DUR+1});
function fitLines(){G.forEach(g=>g.lines.forEach(ln=>{const w=ln.scrollWidth;if(w>990){const cs=parseFloat(getComputedStyle(ln).fontSize);ln.style.fontSize=(cs*990/w)+'px'}}))}
function drawCaps(t){G.forEach(g=>{const vis=t>=g.gs-0.05&&t<g.ge+0.12;g.grp.style.display=vis?'flex':'none';if(!vis)return;
  const out=eo3(prog(t,g.ge,0.11));g.grp.style.opacity=1-out;g.grp.style.transform=`translateY(${-out*16}px)`;
  g.words.forEach(w=>{const p=prog(t,w.t-0.07,0.24),q=prog(t,w.t+0.02,0.26);const e=w.el;e.style.opacity=w.g?(eo3(p)*(0.4+0.6*q)):eo3(p);e.style.transform=`translateY(${(1-eo3(p))*26}px)`;
    const bl=(1-p)*9;e.style.filter=bl>0.05?`blur(${bl}px)`:'';if(!w.g&&!w.pill){const c=Math.round(lerp(196,11,eo3(q)));e.style.color=`rgb(${c},${c},${Math.min(255,c+6)})`}});
  g.grp.querySelectorAll('.pillw').forEach(pw=>{const w0=g.words.find(w=>w.pill);const p=prog(t,w0.t-0.12,0.42);pw.style.transform=`scale(${0.7+0.3*spring(p)})`;pw.style.opacity=eo3(prog(t,w0.t-0.12,0.2))})})}
// The layout judge: every 0.2 s, nothing outside the safe frame, no overlaps between checked pictures, no clipped text in cards.
function audit(step=0.2){const issues=[];const vis=e=>{let p=e,a=1;while(p&&p!==document.body){const cs=getComputedStyle(p);if(cs.display==='none'||cs.visibility==='hidden')return 0;a*=+cs.opacity;p=p.parentElement}return a};
  for(let t=0;t<DUR;t+=step){R(t);const rs=[...document.querySelectorAll('[data-chk]')].filter(e=>vis(e)>0.6).map(e=>({e,k:e.dataset.chk,r:e.getBoundingClientRect()}));
    rs.forEach(a=>{const r=a.r;if(r.left<28||r.right>1052||r.top<90||r.bottom>1640)issues.push(`${t.toFixed(1)} OUT ${a.k} ${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.right)},${Math.round(r.bottom)} ${a.e.textContent.trim().slice(0,30)}`)});
    for(let i=0;i<rs.length;i++)for(let j=i+1;j<rs.length;j++){const a=rs[i],b=rs[j];if(a.k==='cap'&&b.k==='cap')continue;
      const ix=Math.min(a.r.right,b.r.right)-Math.max(a.r.left,b.r.left),iy=Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.top,b.r.top);
      if(ix>6&&iy>6)issues.push(`${t.toFixed(1)} OVERLAP ${a.k}[${a.e.textContent.trim().slice(0,18)}] x ${b.k}[${b.e.textContent.trim().slice(0,18)}] ${Math.round(ix)}x${Math.round(iy)}`)}
    document.querySelectorAll('.card').forEach(e=>{if(vis(e)>0.6&&(e.scrollWidth>e.clientWidth+2||e.scrollHeight>e.clientHeight+2))issues.push(`${t.toFixed(1)} CLIP ${e.className} ${e.textContent.trim().slice(0,30)}`)});}
  return [...new Set(issues)]}
function boot(){window.R=t=>{drawStars(t);scenes(t);drawCaps(t)};window.audit=audit;window.DUR=DUR;document.fonts.ready.then(()=>{fitLines();R(0);window.READY=1})}
boot();
