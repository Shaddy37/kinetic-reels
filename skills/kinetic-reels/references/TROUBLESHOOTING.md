# When something breaks

| you see | do this |
|---|---|
| `ffmpeg not found` | Mac `brew install ffmpeg`, Windows `winget install Gyan.FFmpeg`, Linux `sudo apt install ffmpeg`. Open a NEW terminal. |
| `Executable doesn't exist` (Chromium) | `cd` into the skill folder, `npx playwright install chromium`. Or set `CHROME_PATH` to your Chrome. |
| `Playwright is missing` | `node scripts/setup.mjs` |
| `No module named numpy` | `python -m pip install -r requirements.txt` (in the skill folder) |
| voice `HTTP 401/403` | the key is wrong or for another project: make a new one at aistudio.google.com/apikey |
| voice `HTTP 404` | that model name is gone: put the current TTS model first in tts.json `models` |
| voice `HTTP 429` | free limit for now: wait a while, or turn on billing |
| voice skips a line | shorten that part, split it into its own part, run voice.py again |
| `LAYOUT ... OUT` | a picture goes past the safe frame: move its y or make it smaller |
| `LAYOUT ... OVERLAP` | two pictures share space at that second: shift times so one leaves before the other lands |
| `LAYOUT ... CLIP` | text is wider than its card: shorter text or a wider card (max 920 px) |
| captions early or late | change the `@time` anchor of that word in CAPS by 0.05 to 0.2 s |
| emoji look different on Windows | they come from the system emoji font; use SVG props if it matters |
| render is slow | normal: about 1 to 3 minutes for 40 s on a laptop |
