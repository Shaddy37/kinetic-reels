"""Tiny .env reader (no extra package). Looks in the current folder, its parents, then the skill folder."""
import os
def load_env():
    seen = set(); d = os.getcwd()
    dirs = []
    while d not in seen:
        seen.add(d); dirs.append(d); nd = os.path.dirname(d)
        if nd == d: break
        d = nd
    dirs.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    for base in dirs:
        f = os.path.join(base, '.env')
        if os.path.isfile(f):
            for line in open(f, encoding='utf-8'):
                line = line.strip()
                if not line or line.startswith('#') or '=' not in line: continue
                k, v = line.split('=', 1); k = k.strip(); v = v.strip().strip('"').strip("'")
                if k and k not in os.environ: os.environ[k] = v
            return f
    return None
