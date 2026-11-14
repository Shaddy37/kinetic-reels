"""The reel's sound: python mix.py   (after tighten.py made audio/vo.wav)
Voice on top, the CC0 bed quiet and ducked, a sound on every picture change. Keep DUR and SCN equal to reel.js."""
import sys, os
sys.path.insert(0, __SKILL_SCRIPTS__)
from sfx import mix_reel
HERE = os.path.dirname(os.path.abspath(__file__))
DUR = 9.0                      # TODO: same as reel.js
SCN = [3.0, 6.0]               # TODO: same as reel.js, without the 0
E = [(0.0, 'whoosh', 0.7), (0.05, 'pop', 0.9)]          # the hook lands on frame 0
E += [(t - 0.05, 'whoosh', 0.7) for t in SCN]           # a whoosh on every scene cut
E += [(3.3, 'typing', 0.8, 4.5)]                         # TODO: typing under typed commands, pop per card, tick per counter step, chime on the big number
mix_reel(os.path.join(HERE, 'audio', 'vo.wav'), os.path.join(HERE, 'audio', 'bed.mp3'), E, DUR, os.path.join(HERE, 'audio', 'mix.wav'))
