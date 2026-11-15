"""The reel's sound: python mix.py   (after tighten.py made audio/vo.wav)
Voice on top, the CC0 bed quiet and ducked, and a sound on every picture change. With the scene kit you write no timings here:
shot.cjs reads every beat of reel.js and writes audio/cues.json (the gold reel's sound language), this file mixes it.
Want an extra sound? Add it to EXTRA as (t, kind, gain). Kinds: boom whoosh soft tick pop key click thud coin chime whistle,
(t, 'riser', gain, seconds), (t, 'typing', gain, t_end). Or put REEL.sounds=[[t,kind,gain],...] in reel.js."""
import sys, os, json, subprocess, shutil
SCRIPTS = __SKILL_SCRIPTS__
sys.path.insert(0, SCRIPTS)
from sfx import mix_reel
HERE = os.path.dirname(os.path.abspath(__file__))
EXTRA = []
cues = os.path.join(HERE, 'audio', 'cues.json')
node = shutil.which('node') or 'node'
r = subprocess.run([node, os.path.join(SCRIPTS, '..', 'engine', 'shot.cjs'), HERE, 'cues'])
if r.returncode != 0 or not os.path.exists(cues): raise SystemExit('mix.py: could not read the cues from reel.js (run the layout judge first: shot.cjs audit)')
c = json.load(open(cues, encoding='utf-8'))
E = [tuple(e) for e in c['events']] + EXTRA
mix_reel(os.path.join(HERE, 'audio', 'vo.wav'), os.path.join(HERE, 'audio', 'bed.mp3'), E, c['dur'], os.path.join(HERE, 'audio', 'mix.wav'))
