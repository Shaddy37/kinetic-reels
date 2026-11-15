// Checks everything the skill needs and says exactly what to fix: node doctor.mjs
import { spawnSync } from 'node:child_process'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module';
const SKILL = path.join(path.dirname(fileURLToPath(import.meta.url)), '..'); const win = process.platform === 'win32';
// On Windows we go through the shell (so npm/py/.cmd files resolve), and the shell splits on spaces: quote those args.
const q = a => win ? a.map(x => /[\s,]/.test(x) ? '"' + x + '"' : x) : a;
const ok = (c, a) => { const r = spawnSync(c, q(a), { encoding: 'utf8', shell: win }); return r.status === 0 ? ((r.stdout || r.stderr || '').split('\n')[0].trim() || 'ok') : null; };
let bad = 0; const pass = m => console.log('PASS ' + m); const fix = m => { bad++; console.log('FIX  ' + m); };
const nv = +process.versions.node.split('.')[0]; nv >= 18 ? pass('Node.js ' + process.versions.node) : fix('Node.js 18+ needed (you have ' + process.versions.node + '): https://nodejs.org');
const ff = ok('ffmpeg', ['-version']); ff ? pass(ff.slice(0, 40)) : fix('ffmpeg missing. Mac: brew install ffmpeg | Windows: winget install Gyan.FFmpeg | Linux: sudo apt install ffmpeg. Then open a new terminal.');
ok('ffprobe', ['-version']) ? pass('ffprobe') : fix('ffprobe missing (it comes with ffmpeg)');
// Windows often has several Pythons (Store alias, py launcher, python.org). Use the first one that already has numpy + scipy.
const pys = (win ? ['python', 'py', 'python3'] : ['python3', 'python']).filter(p => { const v = ok(p, ['--version']); return v && /Python 3\./.test(v); });
const py = pys.find(p => ok(p, ['-c', 'import numpy, scipy'])) || pys[0];
if (!py) fix('Python 3 missing: https://www.python.org/downloads/ (on Windows tick "Add python.exe to PATH")');
else { pass(ok(py, ['--version']) + ' (command: ' + py + ')'); ok(py, ['-c', 'import numpy, scipy']) ? pass('numpy + scipy') : fix(`numpy/scipy missing: ${py} -m pip install -r "${path.join(SKILL, 'requirements.txt')}"`); }
let pw = null; try { pw = createRequire(path.join(SKILL, 'package.json'))('playwright'); pass('Playwright ' + createRequire(path.join(SKILL, 'package.json'))('playwright/package.json').version); } catch { fix(`Playwright missing: node "${path.join(SKILL, 'scripts', 'setup.mjs')}"`); }
if (pw) { try { const b = await pw.chromium.launch({ executablePath: process.env.CHROME_PATH || undefined }); await b.close(); pass('Chromium starts'); } catch (e) { fix('Chromium will not start: npx playwright install chromium (inside ' + SKILL + '), or set CHROME_PATH. ' + String(e.message).split('\n')[0]); } }
const fonts = ['Inter.ttf', 'InterTight.ttf', 'JetBrainsMono.ttf', 'DMSerifDisplay-Italic.ttf'].filter(f => !fs.existsSync(path.join(SKILL, 'assets', 'fonts', f)));
fonts.length ? fix('fonts missing in assets/fonts: ' + fonts.join(', ') + ' (re-install the skill)') : pass('fonts');
fs.existsSync(path.join(SKILL, 'assets', 'music', 'chill-beat-cc0.mp3')) ? pass('free CC0 music bed') : fix('assets/music/chill-beat-cc0.mp3 missing (re-install the skill)');
let key = process.env.GEMINI_API_KEY; let where = 'environment';
if (!key) { let d = process.cwd(); for (let i = 0; i < 8 && !key; i++) { const f = path.join(d, '.env'); if (fs.existsSync(f)) { const m = fs.readFileSync(f, 'utf8').match(/^\s*GEMINI_API_KEY\s*=\s*["']?([^"'\r\n]+)/m); if (m) { key = m[1]; where = f; } } const nd = path.dirname(d); if (nd === d) break; d = nd; } }
key ? pass('GEMINI_API_KEY found (' + where + ')') : console.log('NOTE no GEMINI_API_KEY: voice.py will use the free local voice (Piper). For the Gemini Puck voice get a free key at https://aistudio.google.com/apikey and add GEMINI_API_KEY=... to a .env file here.');
const cfg = path.join(process.cwd(), 'kinetic.config.json'); fs.existsSync(cfg) ? pass('kinetic.config.json (your handle + photo)') : console.log('NOTE kinetic.config.json not found here yet: new-reel.mjs makes one the first time.');
console.log(bad ? `\n${bad} thing(s) to fix, then run this again.` : '\nALL GOOD. Make your first reel.');
process.exitCode = bad ? 1 : 0;
if (py) console.log('PYTHON use `' + py + '` for every python command in this skill.');
