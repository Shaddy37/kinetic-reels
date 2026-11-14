// Render a reel to a silent 1080x1920, 30 fps MP4, frame by frame on a fake clock (every frame exact and repeatable).
// node render.cjs <reel folder> [out.mp4]      default out: <reel folder>/out/silent.mp4
const path=require('path'),fs=require('fs');const {spawn}=require('child_process');const {launch,open}=require('./lib.cjs');
(async()=>{const dir=path.resolve(process.argv[2]||'.');const out=path.resolve(process.argv[3]||path.join(dir,'out','silent.mp4'));fs.mkdirSync(path.dirname(out),{recursive:true});
 const b=await launch();const p=await open(b,dir);const DUR=await p.evaluate(()=>DUR);const N=Math.round(DUR*30);const t0=Date.now();
 const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p',out]);
 ff.on('error',e=>{console.error('ffmpeg not found on PATH. Install it, then run doctor.');process.exit(2)});
 for(let i=0;i<N;i++){await p.evaluate(t=>R(t),i/30);const buf=await p.screenshot({type:'jpeg',quality:94});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));
  if(i%150===0)console.log(`frame ${i}/${N}`)}
 ff.stdin.end();await new Promise(r=>ff.on('close',r));console.log(`RENDER OK ${out} (${N} frames, ${((Date.now()-t0)/1000).toFixed(0)} s)`);await b.close()})();
