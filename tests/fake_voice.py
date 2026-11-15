"""CI only: a stand-in voice (tones + pauses, one burst per caption group) so the whole pipeline can run on a machine with no API key.
Usage: python tests/fake_voice.py <reel folder> [number of groups]"""
import sys, os, numpy as np, scipy.io.wavfile as w
reel = sys.argv[1]; n = int(sys.argv[2]) if len(sys.argv) > 2 else 9
SR = 24000; rng = np.random.default_rng(0); x = [np.zeros(int(0.3 * SR))]
for k in range(n):
    d = 1.2 + 0.9 * ((k * 7) % 5) / 4; t = np.arange(int(d * SR)) / SR
    x.append(0.3 * np.sin(2 * np.pi * 180 * t) * (0.6 + 0.4 * np.sin(2 * np.pi * 4 * t)) + 0.05 * rng.standard_normal(len(t))); x.append(np.zeros(int(0.6 * SR)))
os.makedirs(os.path.join(reel, 'audio'), exist_ok=True)
w.write(os.path.join(reel, 'audio', 'vo_raw.wav'), SR, (np.concatenate(x) * 32767).astype(np.int16)); print('FAKE VOICE', n, 'groups')
