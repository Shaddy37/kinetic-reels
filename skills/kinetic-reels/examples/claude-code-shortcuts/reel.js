// EXAMPLE (the gold reel): 7 Claude Code shortcuts almost nobody uses. 39.2 s, LAYOUT PASS. Built with the scene kit: every scene is data.
// Facts: code.claude.com/docs/en/interactive-mode (@ file path mention, ! bash mode, Shift+Tab modes, Esc), /slash-commands (/init, /compact), /cli-reference (claude -c), /memory (CLAUDE.md). Read Nov 13, 2026.
// Study this before you write a new reel: keys on frame 0, a locked #7 (open loop), a header that counts n/7, a new picture every 0.8 to 1.5 s,
// each beat starting on the caption word it shows. Beat kinds and options: references/KIT.md. The same reel hand-coded: reel.hand.js
const REEL={
 dur:39.2, windowIcon:'as/claudecode.svg',
 header:{kicker:'ALMOST NOBODY USES THEM', title:'7 Claude Code shortcuts', item:'Shortcut'},
 scenes:[
  {kind:'hook', at:0, webs:[1.85,2.15], loopAt:3.27, chip:'#7 saves me hours', chipAt:4.2, floats:'+1h'},
  {kind:'item', at:5.5, key:'/init', beats:[
    {kind:'files', at:7.2, title:'~/my-app', rows:[['📁','src'],['📁','tests'],['📄','package.json'],['📄','README.md'],['📄','index.ts']], newRow:'CLAUDE.md', newAt:8.19},
    {kind:'doc', at:9.18, src:'as/doc_memory.png', source:'code.claude.com/docs/en/memory \u00b7 real page', y:660, sourceY:960}]},
  {kind:'item', at:10.37, key:'@', name:'@ file', pressAt:10.97, beats:[
    {kind:'type', at:11.85, title:'claude \u00b7 ~/my-app', prompt:'>', text:'@src/au', typeFor:0.6, dropdown:['src/auth.ts','src/api.ts','src/app.ts']},
    {kind:'drop', at:13.22, chip:'auth.ts', into:'context'},
    {kind:'doc', at:14.07, src:'as/doc_at.png', source:'code.claude.com/docs/en/interactive-mode \u00b7 @ = File path mention', y:650, sourceY:800}]},
  {kind:'item', at:15.34, key:'!', name:'! command', pressAt:15.84, beats:[
    {kind:'type', at:16.91, title:'claude \u00b7 ~/my-app', prompt:'!', text:'git status', typeFor:0.62, enter:true, pre:true, output:'On branch main'}]},
  {kind:'item', at:19.6, key:'\u21e7 Tab', name:'Shift + Tab', short:'\u21e7Tab', beats:[
    {kind:'combo', at:19.6, keys:['\u21e7 shift','tab'], pressAt:20.02},
    {kind:'toggle', at:21.15, label:'plan mode on', onAt:21.45},
    {kind:'plan', at:22.17, title:'Plan', chip:'🔒 0 files changed', chipAt:22.89}]},
  {kind:'item', at:24.13, key:'esc', name:'Esc', pressAt:24.47, beats:[
    {kind:'stop', at:25.31, stopAt:26.23}]},
  {kind:'item', at:27.52, key:'/compact', size:'md', pressAt:28.02, beats:[
    {kind:'squeeze', at:29.36, title:'long chat', summary:'summary'}]},
  {kind:'item', at:31.51, key:'-c', name:'claude -c', pressAt:31.95, beats:[
    {kind:'type', at:32.19, title:'~/my-app', prompt:'$', text:'claude -c', typeFor:0.44, enter:true, y:640},
    {kind:'resume', at:33.88, title:'claude \u00b7 last chat', labelAt:35.18, bookmark:true}]},
  {kind:'cta', at:36.54, title:'Save this', recap:['/init','@','!','\u21e7Tab','esc','/compact','-c']}
 ],
 caps:[
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
[36.54,38.96,[['b','*Save this'],['s','before your next session.@36.94']]]]
};
