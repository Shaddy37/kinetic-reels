// Start a new reel: node new-reel.mjs <slug> [--logo claude] [--dir reels]
// Makes <dir>/<slug>/ (default ./reels/<slug>) with the template, a snapshot of the engine (old reels never break),
// fonts, logos, the free CC0 music bed, and brand.js from ./kinetic.config.json (made here the first time; edit it once).
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const SKILL = path.join(path.dirname(fileURLToPath(import.meta.url)), '..'); const a = process.argv.slice(2);
const slug = a.find(x => !x.startsWith('--') && a[a.indexOf(x) - 1] !== '--logo' && a[a.indexOf(x) - 1] !== '--dir');
const opt = k => (a.includes(k) ? a[a.indexOf(k) + 1] : null);
if (!slug || !/^[a-z0-9][a-z0-9-_]*$/.test(slug)) { console.log('usage: node new-reel.mjs <slug>   (lowercase, dashes, e.g. cursor-rules)'); process.exit(1); }
const cfgF = path.join(process.cwd(), 'kinetic.config.json');
if (!fs.existsSync(cfgF)) { fs.writeFileSync(cfgF, JSON.stringify({ handle: '@yourhandle', name: 'Your Name', face: '', corner_logo: 'claude' }, null, 2) + '\n'); console.log('MADE kinetic.config.json: put your handle, name and a square photo path (face) in it.'); }
const cfg = JSON.parse(fs.readFileSync(cfgF, 'utf8'));
const dst = path.join(process.cwd(), opt('--dir') || 'reels', slug);
if (fs.existsSync(dst)) { console.log('exists already:', dst); process.exit(1); }
fs.mkdirSync(path.join(dst, 'as', 'fonts'), { recursive: true }); fs.mkdirSync(path.join(dst, 'audio'), { recursive: true }); fs.mkdirSync(path.join(dst, 'out'), { recursive: true });
const cp = (f, t) => fs.copyFileSync(f, t);
for (const f of fs.readdirSync(path.join(SKILL, 'template'))) cp(path.join(SKILL, 'template', f), path.join(dst, f));
fs.writeFileSync(path.join(dst, 'mix.py'), fs.readFileSync(path.join(dst, 'mix.py'), 'utf8').replace('__SKILL_SCRIPTS__', JSON.stringify(path.join(SKILL, 'scripts'))));
for (const f of ['core_a.js', 'core_b.js', 'motion.js', 'stars.js']) cp(path.join(SKILL, 'engine', f), path.join(dst, f));
for (const f of fs.readdirSync(path.join(SKILL, 'assets', 'fonts'))) cp(path.join(SKILL, 'assets', 'fonts', f), path.join(dst, 'as', 'fonts', f));
for (const f of fs.readdirSync(path.join(SKILL, 'assets', 'logos'))) cp(path.join(SKILL, 'assets', 'logos', f), path.join(dst, 'as', f));
cp(path.join(SKILL, 'assets', 'music', 'chill-beat-cc0.mp3'), path.join(dst, 'audio', 'bed.mp3'));
fs.writeFileSync(path.join(dst, 'audio', 'MUSIC-LICENSE.txt'), 'Chill Beat by Seth_Makes_Sounds | CC0 (no credit needed) | https://freesound.org/people/Seth_Makes_Sounds/sounds/678003\n');
let face = '';
if (cfg.face) { const fp = path.resolve(path.dirname(cfgF), cfg.face); if (fs.existsSync(fp)) { cp(fp, path.join(dst, 'as', 'face' + path.extname(fp))); face = 'as/face' + path.extname(fp); } else console.log('NOTE face photo not found:', fp); }
const logo = opt('--logo') || cfg.corner_logo || 'claude';
fs.writeFileSync(path.join(dst, 'brand.js'), `// From kinetic.config.json. handle = the watermark, name + face = the end card.\nconst BRAND=${JSON.stringify({ handle: cfg.handle, name: cfg.name, face })};\nconst STAR_SRC='as/${logo}.svg';\ndocument.getElementById('wm').textContent=BRAND.handle;\n`);
console.log('NEW REEL', dst);
console.log('next: facts.md, script.txt + tts.json, then: python "' + path.join(SKILL, 'scripts', 'voice.py') + '" "' + dst + '"');
