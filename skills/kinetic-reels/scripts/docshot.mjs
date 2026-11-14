// A real screenshot of a real page, for a proof card: node docshot.mjs <url> <out.png> [--selector "main h1"] [--width 1200] [--height 900] [--scroll 0]
// With --selector it shoots just that element (with 24 px around it). Keep the page's own look: never edit the text in a screenshot.
import path from 'node:path'; import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module';
const SKILL = path.join(path.dirname(fileURLToPath(import.meta.url)), '..'); const { chromium } = createRequire(path.join(SKILL, 'package.json'))('playwright');
const a = process.argv.slice(2); const [url, out] = a; const opt = (k, d) => (a.includes(k) ? a[a.indexOf(k) + 1] : d);
if (!url || !out) { console.log('usage: node docshot.mjs <url> <out.png> [--selector css] [--width 1200] [--height 900] [--scroll px]'); process.exit(1); }
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const p = await b.newPage({ viewport: { width: +opt('--width', 1200), height: +opt('--height', 900) }, deviceScaleFactor: 2 });
await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => p.goto(url, { waitUntil: 'load' }));
await p.evaluate(y => window.scrollTo(0, y), +opt('--scroll', 0)); await p.waitForTimeout(800);
const sel = opt('--selector', null);
if (sel) { const el = await p.$(sel); if (!el) { console.log('selector not found:', sel); process.exit(1); } const bb = await el.boundingBox(); await p.screenshot({ path: out, clip: { x: Math.max(0, bb.x - 24), y: Math.max(0, bb.y - 24), width: bb.width + 48, height: bb.height + 48 } }); }
else await p.screenshot({ path: out });
console.log('SHOT', out, '| source line for the card:', new URL(url).host + new URL(url).pathname); await b.close();
