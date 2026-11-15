// TEMPLATE REEL, built with the scene kit. It renders as is (an 18.5 s placeholder) so you can test the pipeline first,
// then replace every TODO. You describe scenes as data, the kit (kit.js) moves them like the gold reel. Every beat kind,
// with all its options: references/KIT.md. The gold reel as a kit spec: examples/claude-code-shortcuts/reel.kit.js
// Facts (line 2 of every reel): TODO every number with its source URL and the date you read it.
// Times follow the voice: 's2' = scene start 2 (one per # row in script.txt), 'g5' = caption group 5 starts, 'g5.1' = the word
// anchor in row 1 of group 5, '+0.2' shifts it. Re-record the voice, run captions.py --write, and every picture moves with the words.
// Pictures live in y 260 to 1100. Captions own y 1150 to 1570. The watermark sits at y 1705.
const REEL={
 dur:18.5, scn:[0,3.6,8.0,12.0,16.0],     // dur, scn and caps: python captions.py <reel> --write puts them here from the real voice
 windowIcon:'as/claudecode.svg',                       // TODO the topic's own logo in every window bar (or '' for none)
 header:{kicker:'TODO KICKER', title:'TODO 3 things', item:'Tip'},   // header: "TIP 2/3" + the item name + dots
 scenes:[
  // HOOK: every item's key is already falling on frame 0, the last one is locked (the open loop you pay off at the end)
  {kind:'hook', at:'s0', loopAt:'g1', chip:'TODO #3 is the one', chipAt:'g1.1'},
  {kind:'item', at:'s1', key:'/one', name:'TODO tip one', beats:[
    {kind:'type', at:'g3', title:'terminal', prompt:'$', text:'TODO real command', enter:true, output:'TODO the real output'},
    {kind:'tile', at:'g3.1', logo:'as/claudecode.svg', label:'TODO a real logo'}]},
  {kind:'item', at:'s2', key:'/two', name:'TODO tip two', beats:[
    {kind:'files', at:'g5', title:'~/my-app', rows:[['📁','src'],['📄','package.json'],['📄','README.md']], newRow:'TODO.md'},
    {kind:'chips', at:'g5.1', items:['TODO what it does','TODO what it saves','TODO what is new']}]},
  {kind:'item', at:'s3', key:'/three', name:'TODO tip three', size:'md', beats:[   // the last item is the locked one: it flips ? to its key
    {kind:'quote', at:'g7', source:'TODO docs.example.com/page', text:'TODO one line copied from the docs, with [[the key phrase]] marked.'},
    {kind:'big', at:'g7.1', value:140730, label:'TODO a real number (stars, users, price)'}]},
  {kind:'cta', at:'s4', title:'Save this'}                // a bookmark that fills on the click + a recap row of every key
 ],
 caps:[
 // [start, end, [[size, text], ...]]  sizes s 54 / m 78 / b 100 / p black pill. *word = gradient (ONE phrase per group). word@12.3 = starts at 12.3 s
 [0.0,1.9,[['s','TODO the hook,'],['b','*payoff first.@0.9']]],
 [1.9,3.6,[['s','TODO and number three'],['p','opens a loop.@2.6']]],
 [3.6,5.0,[['s','One.'],['b','*TODO one.@4.0']]],
 [5.0,8.0,[['m','TODO show it'],['s','while you say it.@6.6']]],
 [8.0,9.3,[['s','Two.'],['b','*TODO two.@8.4']]],
 [9.3,12.0,[['m','TODO one idea'],['s','per caption group.@10.8']]],
 [12.0,13.3,[['s','And three.'],['b','*TODO three.@12.5']]],
 [13.3,16.0,[['m','TODO pay off'],['s','the open loop.@14.6']]],
 [16.0,18.2,[['b','*Save this'],['s','TODO a CTA for THIS reel.@16.5']]]]
};
