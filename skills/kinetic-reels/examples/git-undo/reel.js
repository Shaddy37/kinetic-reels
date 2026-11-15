// DEMO REEL: 3 git commands that undo mistakes (about 20 s). Scene kit only, no custom code.
// Facts: facts.md (git's own docs). Voice: tts.json (Gemini Puck with a key, the free local voice without one). Timings: captions.py --write.
const REEL={
 dur:20.0, scn:[0,4.6,8.8,13.0,17.4],
 windowIcon:'as/git.svg',
 header:{kicker:'FOR THE BAD DAYS', title:'3 git undo commands', item:'Command'},
 scenes:[
  {kind:'hook', at:'s0', loopAt:'g2', chip:'#3 feels like magic', chipAt:'g2.1'},
  {kind:'item', at:'s1', key:'restore', name:'git restore', size:'md', beats:[
    {kind:'type', at:'g3.1', title:'terminal \u00b7 my-app', prompt:'$', text:'git restore app.js', typeFor:0.8, enter:true},
    {kind:'quote', at:'g4', text:'Restore specified paths in the [[working tree]] with some contents from a restore source.', source:'git-scm.com/docs/git-restore', icon:'as/git.svg'}]},
  {kind:'item', at:'s2', key:'amend', name:'git commit --amend', size:'md', beats:[
    {kind:'type', at:'g5.1', title:'terminal \u00b7 my-app', prompt:'$', text:'git commit --amend', typeFor:0.8, enter:true},
    {kind:'quote', at:'g6', text:'Replace the [[tip of the current branch]] by creating a new commit.', source:'git-scm.com/docs/git-commit', icon:'as/git.svg'}]},
  {kind:'item', at:'s3', key:'reflog', name:'git reflog', size:'md', beats:[
    {kind:'type', at:'g7.1', title:'terminal \u00b7 my-app', prompt:'$', text:'git reflog', typeFor:0.5, enter:true},
    {kind:'quote', at:'g8', text:'Reflogs record when the [[tips of branches]] and other references were updated in the local repository.', source:'git-scm.com/docs/git-reflog', icon:'as/git.svg'}]},
  {kind:'cta', at:'s4', title:'Save this', recap:['restore','amend','reflog']}
 ],
 caps:[]
};
