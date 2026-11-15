// REFERENCE REEL 2: how the skill works, in 5 steps. Built with the scene kit only (no custom code).
// Facts: facts.md (all from this repo). Voice: tts.json (Gemini TTS, Puck). Timings: captions.py --write after the voice.
const REEL={
 dur:30.0, scn:[0,4.6,9.0,13.6,18.4,22.9,28.4],
 windowIcon:'as/claudecode.svg',
 header:{kicker:'ONE TOPIC IN, A REEL OUT', title:'5 steps, zero editing', item:'Step'},
 scenes:[
  {kind:'hook', at:'s0', loopAt:'g2', chip:'#5 feels like cheating', chipAt:'g2.1'},
  {kind:'item', at:'s1', key:'npx', name:'Add the skill', beats:[
    {kind:'type', at:'g4', title:'terminal', prompt:'$', text:'npx skills add Shaddy37/kinetic-reels', typeFor:1.1, enter:true},
    {kind:'chips', at:'g4.1', items:['Claude Code','Codex','OpenCode']}]},
  {kind:'item', at:'s2', key:'doctor', name:'Run the doctor', size:'md', beats:[
    {kind:'type', at:'g6', title:'terminal', prompt:'$', text:'node scripts/doctor.mjs', typeFor:0.8, enter:true, output:'ALL GOOD. Make your first reel.'},
    {kind:'chips', at:'g6.1', items:['PASS Node.js','PASS ffmpeg','PASS Chromium starts']}]},
  {kind:'item', at:'s3', key:'.env', name:'Paste a free key', beats:[
    {kind:'files', at:'g8', title:'~/my-reels', rows:[['📁','reels'],['📄','kinetic.config.json'],['📄','.gitignore']], newRow:'.env', newIcon:'🔑'},
    {kind:'big', at:'g8.1', value:1, prefix:'~', suffix:' cent', label:'per 45 s voiceover, past the free tier', countFor:0.5}]},
  {kind:'item', at:'s4', key:'prompt', name:'Type one sentence', size:'md', beats:[
    {kind:'type', at:'g10', title:'claude \u00b7 ~/my-reels', prompt:'>', text:'Make a 40 s reel about Cursor', typeFor:1.0},
    {kind:'plan', at:'g10.1', title:'Plan', widths:[560,470,600,420], chip:'you approve, then it builds'}]},
  {kind:'item', at:'s5', key:'judge', name:'It judges itself', beats:[
    {kind:'type', at:'g12', title:'terminal', prompt:'$', text:'node shot.cjs audit', typeFor:0.7, enter:true, output:'LAYOUT PASS'},
    {kind:'chips', at:'g12.1', items:['nothing off screen','nothing overlapping','no text cut off']}]},
  {kind:'cta', at:'s6', title:'Save this', recap:['npx','doctor','.env','prompt','judge']}
 ],
 caps:[]
};
