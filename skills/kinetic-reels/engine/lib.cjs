// Shared by render.cjs and shot.cjs: find Playwright (the skill's own node_modules first) and a browser.
const path=require('path');const {pathToFileURL}=require('url');
function playwright(){const here=path.join(__dirname,'..','node_modules','playwright');try{return require(here)}catch(e){}
  try{return require('playwright')}catch(e){console.error('Playwright is missing. Run: node "'+path.join(__dirname,'..','scripts','setup.mjs')+'"');process.exit(2)}}
async function launch(){const {chromium}=playwright();return chromium.launch({executablePath:process.env.CHROME_PATH||undefined,args:['--allow-file-access-from-files']})}
async function open(b,dir){const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('PAGE ERROR:',e.message));
  await p.goto(pathToFileURL(path.join(path.resolve(dir),'reel.html')).href);
  await p.waitForFunction(()=>window.READY===1,null,{timeout:30000});return p}
module.exports={launch,open};
