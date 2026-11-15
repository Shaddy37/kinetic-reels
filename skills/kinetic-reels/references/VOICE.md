# The voice (Gemini TTS)

## Key
Free key: https://aistudio.google.com/apikey (sign in with Google, "Create API key"). Put it in `.env` in the project folder:
```
GEMINI_API_KEY=your-key-here
```
Google sets free limits per project and changes them from time to time. One reel is one request, so a small daily limit still covers several reels.
If you see HTTP 429, you hit the limit for now: wait, or turn on billing in AI Studio (a 45 s voiceover costs about a cent at current prices).

## tts.json
```json
{"voice": "Puck", "models": ["gemini-3.8-flash-tts", "gemini-3.8-flash-lite-tts"],
 "parts": [{"style": "how it sounds", "text": "exactly what is said"}]}
```
- `text` is read word for word. Directions go in `style`, never in the text.
- Use the same voice on every reel so people recognise you. Puck is a bright, quick male voice; other voices: Kore, Charon, Fenrir, Aoede, Zephyr and more (see Google's voice list).
- Styles that work (copy them): HOOK "Young builder making a fast tech reel, straight into a phone mic. Leaning in close, punchy, a little smug like he's about to share a secret." BODY "Brisk list with a vocal smile, quick and bouncy, no dead air." CTA "Warm, direct sign-off with a grin, a touch slower." End each with "Neutral international English."

## Tags (angle brackets, inside text, max one every 2 or 3 lines)
- Pauses: `<short pause>` (after the hook line, before the CTA), `<long pause>` (max once).
- Breath and reactions: `<breath>` (before line 1), `<gasp>` (before a surprising number), `<chuckle>` (after an ironic line), `<sigh>` or `<tsk>` (after a pain point), `<exhales>` (before the fix).
- Skip in reels: `<sob>` `<cry>` `<yawn>` `<sneeze>` `<cough>`.

## After the take
`tighten.py` cuts every pause to 0.34 s (keeps 0.30 s before the CTA) at normal speed. For a rushed meme feel: `--gap 0.18 --tempo 1.06`.
Always check the take: TTS sometimes skips a line or says a name wrong. Fix the text, make it again.
No key at all? Two ways:
- `voice.py` runs `voice_local.py` by itself: a free local voice (Piper, offline after a one-time download of about 115 MB). Same tts.json, the styles and tags are skipped, one sentence at a time with a short pause between. Pick another voice with `--voice en_US-lessac-high` (list: huggingface.co/rhasspy/piper-voices). Force it even with a key: `voice.py <reel> --local`.
- AI Studio > Generate speech makes the Puck voice by hand: download the WAV as `reels/<slug>/audio/vo_raw.wav`.
