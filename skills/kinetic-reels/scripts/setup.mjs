// One-time setup: node setup.mjs   (run it from anywhere)
// 1) installs Playwright into the skill folder, 2) downloads Chromium for it, 3) installs numpy + scipy, 4) runs the doctor.
import { spawnSync } from 'node:child_process'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const SKILL = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const win = process.platform === 'win32'; const run = (c, a, o = {}) => { console.log('> ' + [c, ...a].join(' ')); return spawnSync(c, a, { stdio: 'inherit', cwd: SKILL, shell: win, ...o }).status === 0; };
if (!run('npm', ['install', '--no-audit', '--no-fund'])) { console.log('FIX: npm install failed. Is Node.js 18 or newer installed? https://nodejs.org'); process.exit(1); }
if (!run('npx', ['playwright', 'install', 'chromium'])) console.log('FIX: Chromium download failed. Run it again, or set CHROME_PATH to your Chrome.');
const py = ['python3', 'python', 'py'].find(p => spawnSync(p, ['--version'], { shell: win }).status === 0);
if (!py) console.log('FIX: Python 3 not found. Install it from https://www.python.org/downloads/ (tick "Add to PATH" on Windows).');
else if (!run(py, ['-m', 'pip', 'install', '-r', 'requirements.txt'])) run(py, ['-m', 'pip', 'install', '--user', '-r', 'requirements.txt']);
run('node', [path.join('scripts', 'doctor.mjs')]);
