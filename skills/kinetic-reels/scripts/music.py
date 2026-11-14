"""Free music for the bed. Only CC0 / public domain, so nobody needs a credit line.
  python music.py search "lofi chill beat"         -> 10 CC0 tracks from Openverse (title, length, id, page)
  python music.py pull <openverse id> <reel folder> -> <reel>/audio/bed.mp3 + <reel>/audio/MUSIC-LICENSE.txt
No search needed for a first reel: new-reel.mjs already copies the bundled CC0 track (assets/music) into every reel."""
import sys, os, json, urllib.request, urllib.parse
UA = {'User-Agent': 'kinetic-reels/1.0 (open source skill)'}
def get(url): return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60))
cmd = sys.argv[1] if len(sys.argv) > 1 else ''
if cmd == 'search':
    q = urllib.parse.quote(' '.join(sys.argv[2:]) or 'lofi chill beat')
    r = get(f'https://api.openverse.org/v1/audio/?q={q}&license=cc0,pdm&page_size=20')
    n = 0
    for t in r.get('results', []):
        d = (t.get('duration') or 0) / 1000
        if d < 25: continue
        print(f"{t['id']}  {d:5.0f}s  {t.get('license','').upper():4}  {t.get('title','')[:50]}  by {t.get('creator','')}  {t.get('foreign_landing_url','')}"); n += 1
        if n >= 10: break
    if not n: print('Nothing long enough. Try other words: "chill electronic", "hip hop calm", "ambient tech".')
elif cmd == 'pull':
    tid, reel = sys.argv[2], os.path.abspath(sys.argv[3]); t = get(f'https://api.openverse.org/v1/audio/{tid}/')
    lic = (t.get('license') or '').lower()
    if lic not in ('cc0', 'pdm'): print('SKIP: license is', lic, '(only cc0 / pdm)'); sys.exit(1)
    os.makedirs(os.path.join(reel, 'audio'), exist_ok=True); out = os.path.join(reel, 'audio', 'bed.mp3')
    open(out, 'wb').write(urllib.request.urlopen(urllib.request.Request(t['url'], headers=UA), timeout=120).read())
    open(os.path.join(reel, 'audio', 'MUSIC-LICENSE.txt'), 'w', encoding='utf-8').write(f"{t.get('title')} by {t.get('creator')} | {lic.upper()} | {t.get('foreign_landing_url')}\n")
    print('BED OK', out, '| check the page once:', t.get('foreign_landing_url'))
else: print(__doc__)
