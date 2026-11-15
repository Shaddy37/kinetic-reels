# Reference reel 3: 3 git commands that undo mistakes (about 20 s, no API key)

The proof that the repo works on its own: no Gemini key, no extra tools. The repo's test builds this reel on a clean machine on every change,
with the free local voice, and saves it as `docs/reels/git-undo-demo.mp4`. `reel.js`, `script.txt`, `tts.json` and `facts.md` are the whole reel.

Make it yourself (paths relative to the skill folder):
```
node scripts/new-reel.mjs git-undo --logo git
cp examples/git-undo/{reel.js,script.txt,tts.json,facts.md} reels/git-undo/
python scripts/voice.py reels/git-undo          # no key: free local voice. With a key: Gemini Puck
python scripts/tighten.py reels/git-undo
python scripts/captions.py reels/git-undo --write
node engine/shot.cjs reels/git-undo audit
python reels/git-undo/mix.py
node engine/render.cjs reels/git-undo
python scripts/finish.py reels/git-undo
```
