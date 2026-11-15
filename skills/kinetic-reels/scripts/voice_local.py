"""Free voice with NO API key: Piper, a local neural voice (runs offline after a one-time voice download, about 115 MB).
It is plainer than Gemini's Puck, but it works on any machine, so you can test the whole skill before you get a key.
Usage: python voice_local.py <reel folder> [--voice en_US-ryan-high] [--speed 1.08]
voice.py runs this for you when there is no GEMINI_API_KEY. Installs piper-tts with pip the first time if it's missing.
Reads <reel>/tts.json (same file as the Gemini voice; styles and <tags> are skipped), says it sentence by sentence with a
short pause between, writes <reel>/audio/vo_raw.wav. Voices: https://huggingface.co/rhasspy/piper-voices (e.g. en_US-lessac-high, en_GB-alan-medium)."""
import sys, os, re, json, wave, subprocess, tempfile, urllib.request
try: sys.stdout.reconfigure(encoding='utf-8', errors='replace')  # Windows consoles default to cp1252
except Exception: pass
import numpy as np, scipy.io.wavfile as w
a = sys.argv[1:]; reel = os.path.abspath(a[0] if a and not a[0].startswith('--') else '.')
name = a[a.index('--voice') + 1] if '--voice' in a else 'en_US-ryan-high'
speed = float(a[a.index('--speed') + 1]) if '--speed' in a else 1.08
try:
    import piper  # noqa
except ImportError:
    print('INSTALL piper-tts (free local voice, one time)')
    subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', 'piper-tts'], check=False)
try:
    from piper import PiperVoice
except ImportError:
    try: from piper.voice import PiperVoice
    except ImportError: print(f'FIX: {sys.executable} -m pip install piper-tts   (then run this again)'); sys.exit(2)
cache = os.path.join(os.path.expanduser('~'), '.cache', 'kinetic-reels', 'piper'); os.makedirs(cache, exist_ok=True)
lang, rest = name.split('-', 1); speaker, quality = rest.rsplit('-', 1)
base = f'https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/{lang.split("_")[0]}/{lang}/{speaker}/{quality}/{name}'
onnx = os.path.join(cache, name + '.onnx')
for ext in ('.onnx', '.onnx.json'):
    f = os.path.join(cache, name + ext)
    if not os.path.exists(f) or os.path.getsize(f) < 100:
        print('DOWNLOAD', name + ext, '(one time)'); urllib.request.urlretrieve(base + ext + '?download=true', f)
voice = PiperVoice.load(onnx)
def say(text, path):
    err = 'no audio'
    for mode in ('cfg', 'wav', 'old'):
        try:
            with wave.open(path, 'wb') as wf:
                if mode == 'cfg':
                    from piper import SynthesisConfig
                    voice.synthesize_wav(text, wf, syn_config=SynthesisConfig(length_scale=1 / speed))
                elif mode == 'wav': voice.synthesize_wav(text, wf)
                else: voice.synthesize(text, wf, length_scale=1 / speed)
            if os.path.getsize(path) > 1000: return
        except Exception as e: err = e
    raise SystemExit(f'LOCAL VOICE FAILED: {err}')
job = json.load(open(os.path.join(reel, 'tts.json'), encoding='utf-8'))
text = ' '.join(re.sub(r'<[^>]+>', ' ', p['text']) for p in job['parts'])
sents = [s.strip() for s in re.split(r'(?<=[.?!])\s+', re.sub(r'\s+', ' ', text)) if s.strip()]
out = []; sr = None; tmp = os.path.join(tempfile.gettempdir(), '_kr_local.wav')
for s in sents:
    say(s, tmp); r, x = w.read(tmp); sr = sr or r
    if x.ndim > 1: x = x.mean(1).astype(np.int16)
    out += [np.zeros(int(sr * 0.12), np.int16), x, np.zeros(int(sr * 0.42), np.int16)]
os.makedirs(os.path.join(reel, 'audio'), exist_ok=True); dst = os.path.join(reel, 'audio', 'vo_raw.wav')
y = np.concatenate(out); w.write(dst, sr, y)
print(f'VOICE OK local Piper {name}, {len(sents)} sentences, {len(y) / sr:.1f} s -> {dst}')
print('This is the free local voice. For the Gemini Puck voice put GEMINI_API_KEY=... in .env and run voice.py again.')
