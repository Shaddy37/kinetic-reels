"""Time the captions to the real voice, no transcript service needed.
Usage: python captions.py <reel folder>
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
def js(s): return "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"
if __name__ == '__main__':
    reel = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else '.')
    sents = parse(open(os.path.join(reel, 'script.txt'), encoding='utf-8').read()); segs = json.load(open(os.path.join(reel, 'audio', 'segs.json')))
    g = align(sents, segs); dur = segs[-1][1] + 0.5
    print(f'const DUR={dur:.1f};')
    print('const SCN=[' + ','.join(f'{x["t0"]:.2f}' if i else '0' for i, x in enumerate([x for x in g if x['scene']])) + '];')
    print('const CAPS=[')
    for x in g:
        rows = []
        for n, r in enumerate(x['rows']):
            text = r['d'] if n == 0 else f"{r['d']}@{r['t']:.2f}"
            rows.append(f"[{js(r['size'])},{js(text)}]")
        print(f"[{x['t0']:.2f},{x['t1']:.2f},[{','.join(rows)}]],")
    print('];')
