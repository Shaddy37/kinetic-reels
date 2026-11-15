# Example: 7 Claude Code shortcuts almost nobody uses (39.2 s)

The gold reel, written with the scene kit (`reel.js` is pure data, `kit.js` moves it). Your agent reads it before it writes a new one.
`reel.hand.js` is the same reel hand-coded, for when you need a custom scene. Both give the same video (a few transition frames differ by hundredths of a second).
- Voice: `audio/vo_raw.wav` (Gemini TTS, voice Puck, the parts in tts.json), tightened with `tighten.py` (0.34 s pauses, normal speed).
- Captions: hand-tuned caps in reel.js. `captions.py` on script.txt gets within a few hundredths of a second for most groups.
- Real assets: `as/doc_memory.png` (code.claude.com/docs/en/memory) and `as/doc_at.png` (code.claude.com/docs/en/interactive-mode), read Nov 13, 2026.
- Sound: mix.py (foley list + the CC0 bed from assets/music).

Render it:
```
python ../../scripts/tighten.py .
python mix.py
node ../../engine/render.cjs .
python ../../scripts/finish.py .
```
Expected: `PASS ... 1080x1920, 30 fps, 39.2 s, -16.0 LUFS`.
