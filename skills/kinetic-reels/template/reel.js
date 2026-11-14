// TEMPLATE REEL. It renders as is (a 9 s placeholder), so you can test the whole pipeline first.
// Then replace every TODO. The full gold reel to copy scenes from: examples/claude-code-shortcuts/reel.js
// Facts (line 2 of every reel): TODO every number with its source URL and the date you read it.
const DUR=9.0;                    // TODO: from captions.py (voice length + 0.5 s)
const SCN=[0,3.0,6.0];            // TODO: from captions.py (scene starts = rows starting with # in script.txt)
// Pictures live in y 260 to 1100. Captions own y 1150 to 1570. The watermark sits at y 1705. x,y in setT are CENTRES.
const HD0=add(`<div class="lab hd"><span class="n">TODO KICKER</span><span class="t">TODO header</span></div>`,'lab');
const HOOK=add(`<div class="card hl"><img src="${STAR_SRC}"><b>TODO real asset</b></div>`,'card');
const SRC1=add(`<div class="src">TODO source \u00b7 read TODO date</div>`);
const WIN=add(`<div class="card win"><div class="ch"><span class="dt"><b style="background:#FF5F57"></b><b style="background:#FEBC2E"></b><b style="background:#28C840"></b></span>terminal</div><div class="ln2"><span class="pm">$</span><span id="cmd"></span></div></div>`,'card');
const ini=(BRAND.name||'?').split(' ').map(w=>w[0]||'').join('').slice(0,2).toUpperCase();
const END=add(`<div class="endrow"><div class="fc">${BRAND.face?`<img src="${BRAND.face}">`:`<div class="ini">${ini}</div>`}</div><div><b>${BRAND.name}</b><span>${BRAND.handle}</span></div></div>`,'lab');
const CAPS=[
// [start, end, [[size, text], ...]]  sizes s 54 / m 78 / b 100 / p black pill. *word = gradient (ONE phrase per group). word@12.3 = starts at 12.3 s
[0.0,3.0,[['s','TODO the hook,'],['b','*payoff first.@1.2']]],
[3.0,6.0,[['m','TODO one idea'],['s','per caption group.@4.4']]],
[6.0,8.6,[['s','TODO a CTA written'],['p','for THIS reel.@7.2']]]];
function scenes(t){
  setT(HD0,labV(t,-0.4,5.95,540,290));
  setT(HOOK,popV(t,-0.3,2.9,540,640));setT(SRC1,{x:540,y:900,o:eo3(prog(t,0.3,0.4))*(1-eo3(prog(t,2.9,0.25)))});
  setT(WIN,cardV(t,3.0,5.9,660));typ('cmd',' npx skills add you/repo',t,3.3,1.2);
  setT(END,{x:540,y:700+(1-eo5(prog(t,6.0,0.45)))*30,o:eo3(prog(t,6.0,0.3))});
}
