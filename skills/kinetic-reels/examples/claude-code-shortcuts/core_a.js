// kinetic-reels engine, part A: math helpers, keyframes and the three entrance motions.
// Load order in reel.html: brand.js, core_a.js, motion.js, reel.js, core_b.js, stars.js
// Everything is a pure function of time t (seconds), so any frame renders the same way every time.
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const prog=(t,t0,d)=>d>0?clamp((t-t0)/d):(t>=t0?1:0);
const eo3=p=>1-Math.pow(1-p,3), eo5=p=>1-Math.pow(1-p,5);
const eio=p=>p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;
const spring=p=>p<=0?0:p>=1?1:1-Math.exp(-6.5*p)*Math.cos(9.5*p);
const lerp=(a,b,p)=>a+(b-a)*p;
const $=(h)=>{const d=document.createElement('div');d.innerHTML=h.trim();return d.firstChild};
const L=document.getElementById('L');
// add(html, kind): put a picture on the stage. kind 'card' | 'lab' | 'prop' makes the layout judge check it.
function add(h,chk){const e=$(h);e.classList.add('abs');if(chk)e.dataset.chk=chk;L.appendChild(e);return e}
// K(t, [[time,{x,y,s,o,b,r}], ...]): keyframes with ease in-out (position, scale, opacity, blur, rotation)
function K(t,keys,ease=eio){if(t<=keys[0][0])return Object.assign({},keys[0][1]);
  for(let i=0;i<keys.length-1;i++){const [t0,a]=keys[i],[t1,b]=keys[i+1];if(t<t1){const p=ease((t-t0)/(t1-t0));const o={};for(const k in a)o[k]=lerp(a[k],b[k]??a[k],p);return o}}
  return Object.assign({},keys[keys.length-1][1])}
// setT(el, {x,y,s,o,b,r}): x,y = the element's CENTRE in page pixels (1080 x 1920)
function setT(e,v){const s=v.s??1;e.style.transform=`translate(${v.x}px,${v.y}px) translate(-50%,-50%) scale(${s}) rotate(${v.r??0}deg)`;
  e.style.opacity=clamp(v.o??1);const b=v.b??0;e.style.filter=b>0.05?`blur(${b}px)`:'';e.style.visibility=(v.o??1)<0.005?'hidden':'visible'}
function op(id,v){const e=document.getElementById(id);e.style.opacity=clamp(v);return e}
// cardV: a card rises in (80 px, blur to sharp) at a and drops out at b
function cardV(t,a,b,y,x=540){const pi=eo5(prog(t,a,0.45)),po=eo3(prog(t,b,0.28));return {x,y:y+(1-pi)*80-po*40,s:0.96+0.04*pi,o:pi*(1-po),b:(1-pi)*6+po*6}}
// popV: a tile pops in with a soft spring at a, fades at b
function popV(t,a,b,x,y){const pi=prog(t,a,0.5),po=eo3(prog(t,b,0.25));return {x,y:y+(1-eo5(pi))*40,s:0.7+0.3*spring(pi),o:eo3(prog(t,a,0.2))*(1-po),b:po*5}}
// labV: a label fades up at a, out at b
function labV(t,a,b,x,y){const pi=eo5(prog(t,a,0.4)),po=eo3(prog(t,b,0.25));return {x,y:y+(1-pi)*30,o:pi*(1-po),b:(1-pi)*5}}
const fmt=n=>Math.round(n).toLocaleString('en-US');
// typ(id, text, t, start, seconds): types text into an element, letter by letter
const typ=(id,s,t,a,d)=>{document.getElementById(id).textContent=s.slice(0,Math.round(s.length*clamp((t-a)/d)))};
const hide=(t,a,b)=>t<a||t>=b;
