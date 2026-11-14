"""Tighten the voiceover: every pause longer than --gap becomes --gap, the last long pause (before the CTA) keeps 0.30 s,
then --tempo speed. Writes audio/vo.wav (48 kHz) and audio/segs.json (speech segments) for captions.py.
Usage: python tighten.py <reel folder> [--gap 0.34] [--tempo 1.0]
Defaults are the gold list-reel settings (normal speed, 0.34 s pauses). 0.18 / 1.06 is too rushed for lists."""
import sys, os, json, subprocess, tempfile, warnings, numpy as np, scipy.io.wavfile as w
warnings.filterwarnings("ignore", category=w.WavFileWarning)
a = sys.argv[1:]; reel = os.path.abspath(a[0] if a and not a[0].startswith('--') else '.')
gap = float(a[a.index('--gap') + 1]) if '--gap' in a else 0.34; tempo = float(a[a.index('--tempo') + 1]) if '--tempo' in a else 1.0
src = os.path.join(reel, 'audio', 'vo_raw.wav'); out = os.path.join(reel, 'audio', 'vo.wav'); segf = os.path.join(reel, 'audio', 'segs.json')
sr, x = w.read(src); x = x.astype(np.float32) / 32768
if x.ndim > 1: x = x.mean(1)
hop = int(sr * 0.01); n = len(x) // hop
db = 20 * np.log10(np.array([np.sqrt(np.mean(x[i * hop:(i + 1) * hop] ** 2) + 1e-12) for i in range(n)])); sil = db < -38
runs = []; i = 0
while i < n:
    if sil[i]:
        j = i
        while j < n and sil[j]: j += 1
        runs.append((i, j)); i = j
    else: i += 1
longs = [r for r in runs if r[1] - r[0] >= 15 and r[0] > 0 and r[1] < n]; last = longs[-1] if longs else None
o = []; segs = []; t = 0.0; pos = 0
for a_, b_ in runs:
    if a_ > pos: s = x[pos * hop:a_ * hop]; segs.append((t, t + len(s) / sr)); o.append(s); t += len(s) / sr
    L = (b_ - a_) * 0.01; cap = 0.0 if a_ == 0 else (0.15 if b_ >= n else (0.30 if (a_, b_) == last else min(L, gap)))
    k = int(cap * sr); s = x[a_ * hop:a_ * hop + k]; o.append(s); t += len(s) / sr; pos = b_
if pos < n: s = x[pos * hop:]; segs.append((t, t + len(s) / sr)); o.append(s)
tmp = os.path.join(tempfile.gettempdir(), '_kr_vo_pre.wav')
w.write(tmp, sr, (np.concatenate(o) * 32767).astype(np.int16))
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', tmp, '-af', f'atempo={tempo}', '-ar', '48000', out], check=True)
segs = [(p / tempo, q / tempo) for p, q in segs if q - p > 0.05]; m = []
for p, q in segs:
    if m and p - m[-1][1] < 0.12: m[-1] = (m[-1][0], q)
    else: m.append((p, q))
json.dump(m, open(segf, 'w')); print(f'VOICE TIGHT {m[-1][1]:.2f} s, {len(m)} speech segments -> {out}')
print(f'Set DUR in reel.js to about {m[-1][1] + 0.5:.1f}')
