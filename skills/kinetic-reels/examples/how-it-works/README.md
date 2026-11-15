# Reference reel 2: how the skill works, in 5 steps

A second reel on a new topic, written with the scene kit only (no custom code), to show the kit isn't tied to the gold reel.
`reel.js`, `script.txt`, `tts.json` and `facts.md` are the whole reel. Everything else comes from `new-reel.mjs`.

Make it yourself (needs your Gemini key in `.env`):
```
node scripts/new-reel.mjs how-it-works
cp examples/how-it-works/{reel.js,script.txt,tts.json,facts.md} reels/how-it-works/
python scripts/voice.py reels/how-it-works
python scripts/tighten.py reels/how-it-works
python scripts/captions.py reels/how-it-works --write
node engine/shot.cjs reels/how-it-works audit
python reels/how-it-works/mix.py
node engine/render.cjs reels/how-it-works
python scripts/finish.py reels/how-it-works
```
(Paths are relative to the skill folder. The repo's test renders this reel with a real voice on every change when the GEMINI_API_KEY secret is set: `docs/reels/how-it-works.mp4`.)
