# Sound

Scene-kit reels: `mix.py` gets these sounds automatically from every beat (`shot.cjs <reel> cues` writes `audio/cues.json`). The table below is what the kit plays, so you know what to add in `EXTRA` or `REEL.sounds` for a custom scene. Turn a beat's sound off with `sound:false`.

`mix.py` calls `mix_reel(vo, bed, events, DUR, out)`: the voice on top, the bed at RMS 0.022 ducked 50% under the voice, foley at 0.6, mastered to -16 LUFS (the norm for reels).

Events: `(t, kind, gain)`, `(t, 'riser', gain, seconds)`, `(t, 'typing', gain, t_end)`.
| moment | sound |
|---|---|
| frame 0 | `whoosh` 0.7 + a `thud` per tile landing |
| every scene cut | `soft` or `whoosh` 0.7 at the cut |
| a key slam | `boom` 0.45, `thud` 0.9 at +0.12 s, `click` 1.3 when it presses |
| typed command | `typing` from start to end, `click` on return |
| card or chip pops | `pop` 0.6 to 0.9 |
| counter steps | `tick` 0.45 every step |
| big number, unlock, payoff | `chime` 0.5 to 1.0, `coin` 0.6 |
| tension before a reveal | `riser` 0.5 over 0.4 to 1 s |

## Music
Every new reel already has a free CC0 bed (`audio/bed.mp3`, "Chill Beat" by Seth_Makes_Sounds on Freesound, no credit needed).
Another one: `python music.py search "chill electronic"`, then `python music.py pull <id> reels/<slug>`. Only CC0 or public domain, so no credit line
and no claim on any platform. Keep `audio/MUSIC-LICENSE.txt` with the reel. Don't use the in-app music of one platform on another.
