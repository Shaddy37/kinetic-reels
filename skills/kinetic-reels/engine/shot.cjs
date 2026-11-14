// The layout judge and stills.
// node shot.cjs <reel folder> audit                 -> prints LAYOUT PASS or every problem with its time
// node shot.cjs <reel folder> prev 0 2.9 7.9 21     -> stills into <reel folder>/prev/f_<t>.jpg (look at one moment in every scene)
// node shot.cjs <reel folder> cover 0.6             -> <reel folder>/out/cover.jpg
const path=require('path'),fs=require('fs');const {launch,open}=require('./lib.cjs');
(async()=>{const dir=path.resolve(process.argv[2]||'.');const mode=process.argv[3]||'audit';const b=await launch();const p=await open(b,dir);
 if(mode==='audit'){const r=await p.evaluate(()=>audit(0.2));console.log(r.length?r.join('\n'):'LAYOUT PASS');process.exitCode=r.length?1:0}
 else if(mode==='cover'){fs.mkdirSync(path.join(dir,'out'),{recursive:true});const t=+(process.argv[4]||0.6);await p.evaluate(t=>R(t),t);const f=path.join(dir,'out','cover.jpg');await p.screenshot({path:f,type:'jpeg',quality:92});console.log('COVER',f)}
 else{fs.mkdirSync(path.join(dir,'prev'),{recursive:true});for(const t of process.argv.slice(4)){await p.evaluate(t=>R(+t),t);const f=path.join(dir,'prev',`f_${t}.jpg`);await p.screenshot({path:f,type:'jpeg',quality:88});console.log('STILL',f)}}
 await b.close()})();
