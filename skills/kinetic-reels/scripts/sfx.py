"""Sound for a reel: synthesized foley + the voice + a quiet music bed, mastered to -16 LUFS.
Foley kinds: boom whoosh soft tick pop key click thud coin chime whistle, plus ('riser', gain, seconds) and ('typing', gain, t_end).
Events: (t, kind, gain) or (t, 'riser', gain, seconds) or (t, 'typing', gain, t_end). Use it from the reel's mix.py."""
import os, subprocess, tempfile, numpy as np, scipy.io.wavfile as w, scipy.signal as sg
SR = 48000; rng = np.random.default_rng(1); TMP = tempfile.gettempdir()
def env(n, a, d): t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def boom(g=1.0):
    n = int(SR * 1.2); t = np.arange(n) / SR; f = 55 + 70 * np.exp(-t * 18); ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * env(n, 0.004, 0.35); nz = sg.lfilter(*sg.butter(2, 600 / (SR / 2)), rng.standard_normal(n)) * env(n, 0.002, 0.06) * 0.6
    return (x + nz) * 0.9 * g
def whoosh(g=1.0, d=0.45):
    n = int(SR * d); x = rng.standard_normal(n); t = np.linspace(0, 1, n)
    b, a = sg.butter(2, [400 / (SR / 2), 5000 / (SR / 2)], 'band'); x = sg.lfilter(b, a, x); return x * np.sin(np.pi * t) ** 2 * 0.35 * g
def tick(g=1.0): n = int(SR * 0.05); t = np.arange(n) / SR; return np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 90) * 0.35 * g
def pop(g=1.0): n = int(SR * 0.12); t = np.arange(n) / SR; f = 900 - 500 * t / 0.12; return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 35) * 0.4 * g
def key(g=1.0):
    n = int(SR * 0.03); x = rng.standard_normal(n); b, a = sg.butter(2, [1500 / (SR / 2), 7000 / (SR / 2)], 'band'); return sg.lfilter(b, a, x) * np.exp(-np.arange(n) / SR * 200) * 0.25 * g
def riser(d=1.0, g=1.0):
    n = int(SR * d); t = np.arange(n) / SR; f = 200 + 1400 * (t / d) ** 2; x = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.12
    nz = rng.standard_normal(n); b, a = sg.butter(2, 3000 / (SR / 2), 'high'); nz = sg.lfilter(b, a, nz) * 0.12; return (x + nz) * (t / d) ** 2 * g
def chime(g=1.0):
    n = int(SR * 1.6); t = np.arange(n) / SR; x = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, k in ((1318.5, 3), (1975.5, 4), (2637, 5)))
    x2 = np.zeros(n); off = int(0.12 * SR); x2[off:] = x[:n - off] * 0.8; return (x * 0.5 + x2 * 0.5) * 0.18 * g
def thud(g=1.0): n = int(SR * 0.25); t = np.arange(n) / SR; return np.sin(2 * np.pi * (90 + 60 * np.exp(-t * 30)) * t) * np.exp(-t * 20) * 0.5 * g
def coin(g=1.0): n = int(SR * 0.35); t = np.arange(n) / SR; return (np.sin(2 * np.pi * 2093 * t) * np.exp(-t * 14) + 0.6 * np.sin(2 * np.pi * 3136 * t) * np.exp(-t * 18)) * 0.18 * g
def click(g=1.0):
    n = int(SR * 0.04); t = np.arange(n) / SR; x = rng.standard_normal(n); b, a = sg.butter(2, [2000 / (SR / 2), 9000 / (SR / 2)], 'band')
    return (sg.lfilter(b, a, x) * np.exp(-t * 260) + np.sin(2 * np.pi * 1200 * t) * np.exp(-t * 300)) * 0.5 * g
def whistle(g=1.0): n = int(SR * 0.45); t = np.arange(n) / SR; f = 1800 - 1400 * (t / 0.45); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, t * 30) * np.exp(-t * 2) * 0.16 * g
def soft(g=1.0): return whoosh(0.45 * g, 0.3)
FX = {'coin': coin, 'click': click, 'whistle': whistle, 'soft': soft, 'boom': boom, 'whoosh': whoosh, 'tick': tick, 'pop': pop, 'key': key, 'chime': chime, 'thud': thud}
def build(events, dur):
    out = np.zeros(int(SR * dur) + SR)
    for ev in events:
        t, k = ev[0], ev[1]; g = ev[2] if len(ev) > 2 else 1.0
        if k == 'riser': x = riser(ev[3], g)
        elif k == 'typing':
            for tt in np.arange(t, ev[3], 0.045): s = key(g * rng.uniform(.6, 1)); i = int(tt * SR); out[i:i + len(s)] += s[:len(out) - i]
            continue
        else: x = FX[k](g)
        i = max(0, int(t * SR)); out[i:i + len(x)] += x[:len(out) - i]
    return out[:int(SR * dur)]
def load(path, dur, tempo=1.0, loop=False):
    tmp = os.path.join(TMP, '_kr_load.wav')
    args = ['ffmpeg', '-y', '-loglevel', 'error'] + (['-stream_loop', '-1'] if loop else []) + ['-i', path, '-t', str(dur + 1), '-af', f'atempo={tempo}' if tempo != 1 else 'anull', '-ac', '1', '-ar', str(SR), tmp]
    subprocess.run(args, check=True); sr, x = w.read(tmp); x = x.astype(np.float32) / 32768; n = int(SR * dur)
    if len(x) < n: x = np.pad(x, (0, n - len(x)))
    return x[:n]
def mix_reel(vo, bed, events, dur, out, bed_start=0.0, bed_rms=0.022, duck=0.5, fx_gain=0.6):
    """The gold mix: voice on top, bed at RMS 0.022 ducked 50% under the voice, foley at 0.6, -16 LUFS, true peak -1.5."""
    from scipy.ndimage import maximum_filter1d, uniform_filter1d
    v = load(vo, dur); b = load(bed, dur + bed_start, 1.0, loop=True)[int(bed_start * SR):][:int(SR * dur)]
    if len(b) < int(SR * dur): b = np.pad(b, (0, int(SR * dur) - len(b)))
    b = b / (np.sqrt(np.mean(b ** 2)) + 1e-9) * bed_rms
    e = np.abs(v); win = int(SR * 0.05); e = np.convolve(e, np.ones(win) / win, 'same'); e = np.clip(e / (np.percentile(e, 95) + 1e-9), 0, 1)
    e = uniform_filter1d(maximum_filter1d(e, int(SR * 0.25)), int(SR * 0.15)); b = b * (1 - duck * e)
    n = len(b); f = np.ones(n); fi = int(0.3 * SR); fo = int(1.5 * SR); f[:fi] = np.linspace(0, 1, fi); f[-fo:] = np.linspace(1, 0, fo); b *= f
    m = v + b + build(events, dur) * fx_gain; tmp = os.path.join(TMP, '_kr_mix.wav')
    w.write(tmp, SR, (np.clip(m, -1, 1) * 32767).astype(np.int16))
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', tmp, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '48000', '-ac', '2', out], check=True)
    print('MIX OK', out)
