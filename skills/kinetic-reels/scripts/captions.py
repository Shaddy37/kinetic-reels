"""Time the captions to the real voice, no transcript service needed.
Usage: python captions.py <reel folder> [--write]
  --write (scene-kit reels): puts dur, scn and caps straight into REEL in reel.js. Without it, prints them to paste.
Reads <reel>/script.txt and <reel>/audio/segs.json (from tighten.py). Prints a CAPS array and a SCN list to paste into reel.js.

script.txt, one caption line per row:   size:display text|spoken words
  size  = s (54 px) | m (78 px) | b (100 px) | p (black pill, the punch line)
  /     at the start of a row = this row starts a new caption group (a new sentence)
  #     at the start of a row = this group also starts a new SCENE (a new picture set)
  *word = gradient word (one phrase per group). ~word = serif italic punch word.
Example:
  #/b:*7 Claude Code|Seven Claude Code
  m:shortcuts|shortcuts
  /m:almost *nobody uses.|almost nobody uses.
Sentences are matched to the voice's real pauses (dynamic programming); rows share their sentence's speech by length."""
import sys, os, json, re, functools
try: sys.stdout.reconfigure(encoding='utf-8', errors='replace')  # Windows consoles default to cp1252
except Exception: pass
def weight(s):
    s = re.sub(r'[^A-Za-z0-9 \-]', '', s); return sum(len(w) + 1.5 for w in s.split()) + (2.5 if s else 0)
def parse(src):
    sents = []
    for raw in src.strip().split('\n'):
        line = raw.strip()
        if not line or line.startswith('//'): continue
        scene = line.startswith('#'); line = line.lstrip('#')
        new = line.startswith('/') or not sents or scene; line = line.lstrip('/')
        size, rest = (line.split(':', 1) if re.match(r'^[smbp]:', line) else ('m', line))
        d, sp = rest.split('|') if '|' in rest else (rest, re.sub(r'[*~]', '', rest))
        if new: sents.append({'rows': [], 'scene': scene or not sents})
        sents[-1]['rows'].append(dict(size=size, d=d.strip(), sp=sp.strip(), w=weight(sp)))
    return sents
def align(sents, segs):
    if segs and segs[0][1] - segs[0][0] < 0.3 and len(segs) > len(sents): segs = segs[1:]
    N = len(sents); M = len(segs)
    if M < N: print(f'# WARNING: {M} speech segments but {N} caption groups. Merge groups in script.txt or use a longer --gap.'); 
    W = [sum(r['w'] for r in s['rows']) for s in sents]; vd = [b - a for a, b in segs]; rate = sum(vd) / sum(W)
    gap = [segs[i][0] - segs[i - 1][1] for i in range(1, M)]
    @functools.lru_cache(None)
    def f(k, i):
        if k == N - 1: d = sum(vd[i:]); return ((d - W[k] * rate) ** 2 / (W[k] * rate), ())
        best = (1e9, ())
        for j in range(i + 1, M - (N - k - 2)):
            d = sum(vd[i:j]); c = (d - W[k] * rate) ** 2 / (W[k] * rate) - 1.5 * gap[j - 1]; sub = f(k + 1, j)
            if c + sub[0] < best[0]: best = (c + sub[0], (j,) + sub[1])
        return best
    _, path = f(0, 0); bounds = [0] + list(path) + [M]; groups = []
    for k, s in enumerate(sents):
        ss = segs[bounds[k]:bounds[k + 1]] or [segs[min(bounds[k], M - 1)]]; v = sum(b - a for a, b in ss); tw = sum(r['w'] for r in s['rows'])
        def v2t(x):
            for a, b in ss:
                if x <= b - a + 1e-9: return a + x
                x -= b - a
            return ss[-1][1]
        acc = 0
        for n, r in enumerate(s['rows']):
            r['t'] = ss[0][0] if n == 0 else v2t(acc * v / tw) + 0.02; acc += r['w']
        groups.append({'t0': ss[0][0], 'rows': s['rows'], 'scene': s['scene']})
    for i in range(len(groups) - 1): groups[i]['t1'] = groups[i + 1]['t0']
    groups[-1]['t1'] = segs[-1][1] + 0.4
    return groups

def block_end(src, i):
    """i points at '[': return the index just after its matching ']' (skips strings)."""
    depth = 0; q = None; k = i
    while k < len(src):
        c = src[k]
        if q:
            if c == '\\': k += 2; continue
            if c == q: q = None
        elif c in '\'"`': q = c
        elif c == '[': depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0: return k + 1
        k += 1
    raise SystemExit('captions.py --write: could not find the end of a [ ] block in reel.js')
def write_kit(rj, dur, scn, caps_js):
    src = open(rj, encoding='utf-8').read()
    src, n = re.subn(r'\bdur\s*:\s*[\d.]+', f'dur:{dur:.1f}', src, count=1)
    if not n: raise SystemExit('captions.py --write: no "dur:" in REEL')
    new_scn = 'scn:[' + ','.join(scn) + ']'
    m = re.search(r'\bscn\s*:\s*\[', src)
    if m: src = src[:m.start()] + new_scn + src[block_end(src, m.end() - 1):]
    else:
        m = re.search(r'\bdur\s*:\s*[\d.]+\s*,?', src); src = src[:m.end()] + ' ' + new_scn + ',' + src[m.end():]
    m = re.search(r'\bcaps\s*:\s*\[', src)
    if not m: raise SystemExit('captions.py --write: no "caps:[" in REEL')
    src = src[:m.start()] + 'caps:[\n' + ',\n'.join(caps_js) + ']' + src[block_end(src, m.end() - 1):]
    open(rj, 'w', encoding='utf-8').write(src)
def js(s): return "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"
if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]; reel = os.path.abspath(args[0] if args else '.')
    sents = parse(open(os.path.join(reel, 'script.txt'), encoding='utf-8').read()); segs = json.load(open(os.path.join(reel, 'audio', 'segs.json')))
    g = align(sents, segs); dur = segs[-1][1] + 0.5
    rj = os.path.join(reel, 'reel.js'); kit = os.path.exists(rj) and 'const REEL' in open(rj, encoding='utf-8').read()
    scn = [f'{x["t0"]:.2f}' if i else '0' for i, x in enumerate([x for x in g if x['scene']])]
    rows_js = []
    for x in g:
        rows = []
        for n, r in enumerate(x['rows']):
            text = r['d'] if n == 0 else f"{r['d']}@{r['t']:.2f}"
            rows.append(f"[{js(r['size'])},{js(text)}]")
        rows_js.append(f"[{x['t0']:.2f},{x['t1']:.2f},[{','.join(rows)}]]")
    if kit and '--write' in sys.argv:
        write_kit(rj, dur, scn, rows_js)
        print(f'WROTE reel.js: dur {dur:.1f}, scn {len(scn)} scene starts, caps {len(rows_js)} groups')
        print('scene starts: ' + ', '.join(scn)); print('group starts: ' + ', '.join(f'{i}:{x["t0"]:.2f}' for i, x in enumerate(g)))
    elif kit:
        print('// Scene kit: paste dur, scn and caps into REEL (or run with --write). Scene times can then be s0, s1..., beat times g5 or g5.1.')
        print('// Start every beat on a caption group start (or on a word anchor like word@12.3), so the picture changes when the words do.')
        print('// scene starts: ' + ', '.join(scn))
        print('// group starts: ' + ', '.join(f'{i}:{x["t0"]:.2f}' for i, x in enumerate(g)))
        print(f' dur:{dur:.1f}, scn:[' + ','.join(scn) + '],')
        print(' caps:[')
        print(',\n'.join(rows_js))
        print(' ]')
    else:
        print(f'const DUR={dur:.1f};')
        print('const SCN=[' + ','.join(scn) + '];')
        print('const CAPS=[')
        for r in rows_js: print(r + ',')
        print('];')
