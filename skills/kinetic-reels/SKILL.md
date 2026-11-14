---
name: kinetic-reels
description: Make a finished vertical reel (1080x1920 MP4, 38 to 60 s) for Instagram, TikTok, YouTube Shorts or LinkedIn from one topic. Kinetic word-by-word captions synced to an AI voiceover (Gemini TTS), real screenshots and logos as moving cards, sound effects and a free CC0 music bed. Use when the user asks for a reel, short, TikTok, faceless video, explainer video or "make a video about X".
---

# Kinetic reels

You make a reel the way a motion designer would, but in code: one HTML page draws any moment `t` of the video, a headless browser
renders it frame by frame at 30 fps, ffmpeg adds the voice and the music. Same input, same video, every time.

`SKILL` below means the folder this file is in. Run every command from the user's project folder (where `reels/` and `.env` live).
Use `python3` on Mac/Linux and `python` on Windows.

## Before the first reel (once)

1. `node "SKILL/scripts/doctor.mjs"`. If it prints FIX lines, run `node "SKILL/scripts/setup.mjs"`, then do what the remaining FIX lines say. Don't go on until it prints ALL GOOD.
2. The user needs a Gemini API key in `.env` (`GEMINI_API_KEY=...`, free from https://aistudio.google.com/apikey). Never print the key, never commit `.env`.
3. `kinetic.config.json` holds their handle (the watermark), name and a square photo for the end card. `new-reel.mjs` creates it the first time; ask the user for the three values and fill it in.

## Make a reel (every step, in order)

1. **Topic and facts.** Agree on ONE topic. Research it from first-party sources (docs, the repo, the vendor's own page) and write every claim into `facts.md` with the URL and the date you read it. No fact, no claim.
2. **Plan the beats** (show the user before you build). 38 to 45 s for a list of 5 to 7, up to 60 s for an explainer. Per scene: seconds, what is said, the picture, the exact asset file and where it comes from. If an asset can't be found (a logo, a photo, a screenshot), STOP and ask the user for it. Never draw a fake logo, invent a UI or generate a person.
3. **Start the folder:** `node "SKILL/scripts/new-reel.mjs" <slug> [--logo claude]`. The corner logo is the topic's own logo (files in `as/`; add the real SVG if it is missing).
4. **Script.** Write `tts.json` (what the voice says, split into hook / body / payoff / CTA parts, each with its own style) and `script.txt` (the captions, same words, same order). Rules: `references/SCRIPT.md`. Tags and styles: `references/VOICE.md`.
5. **Voice:** `python "SKILL/scripts/voice.py" reels/<slug>` then `python "SKILL/scripts/tighten.py" reels/<slug>` (pauses to 0.34 s, normal speed). Listen to the take, or check it with any transcriber: if a line is missing or a name is wrong, fix the text and run voice.py again.
6. **Captions + timing:** `python "SKILL/scripts/captions.py" reels/<slug>` prints `DUR`, `SCN` and `CAPS`. Paste them into `reel.js`. Hand-tune an anchor (`word@12.3`) if a word lands early or late.
7. **Real assets:** screenshots with `node "SKILL/scripts/docshot.mjs" <url> reels/<slug>/as/<name>.png [--selector "css"]`, logos as SVG from the vendor or `SKILL/assets/logos`. Every asset gets a small source line on screen. Details: `references/ASSETS.md`.
8. **Build `reel.js`.** Read `examples/claude-code-shortcuts/reel.js` first: it is the gold reel and shows every pattern. Pieces you can use: `references/COMPONENTS.md`. Pictures live in y 260 to 1100, captions own y 1150 to 1570.
9. **Judge:** `node "SKILL/engine/shot.cjs" reels/<slug> audit` must print `LAYOUT PASS`. Then `node "SKILL/engine/shot.cjs" reels/<slug> prev 0 <one time inside every scene>` and LOOK at every still (open the JPGs). Fix and repeat. Check the 5 hook stills at 0, 0.5, 1, 2, 3 s against `references/SCRIPT.md` (hook rules).
10. **Sound:** edit `mix.py` (DUR, SCN, one sound per picture change; `references/SOUND.md`), run `python reels/<slug>/mix.py`. A different bed: `python "SKILL/scripts/music.py" search "lofi chill"` then `pull <id> reels/<slug>` (CC0 only).
11. **Render:** `node "SKILL/engine/render.cjs" reels/<slug>` then `python "SKILL/scripts/finish.py" reels/<slug>` (must print PASS) and `node "SKILL/engine/shot.cjs" reels/<slug> cover 0.6`.
12. **Hand over** `reels/<slug>/out/final.mp4` and `out/cover.jpg`, plus a caption with the topic keywords in line 1, 3 to 5 hashtags, and the sources from facts.md.

## Rules that keep people watching (from real results, not theory)

- The payoff goes in line 1. "7 Claude Code shortcuts almost nobody uses" beats "Today I want to show you something".
- Motion on frame 0. Start entrances at negative times (`popV(t,-0.3,...)`) so the first frame is already moving. Never a blank or static first frame.
- One look from the first frame to the last. Never open dark and flip to light: it reads as a new video and people swipe.
- For lists: a header that counts (`SHORTCUT 3/7` + dots), and an open loop in line 2 ("and number seven saves me hours") paid off at the end.
- A new picture every 0.8 to 1.5 s. Show the effect, don't describe it.
- The voice sits on top. Music is quiet (the defaults in `sfx.mix_reel` are tested).
- The CTA is written for this reel only (save it, send it to the person it fits, or a real question). Never "follow for more".

## When something breaks

`references/TROUBLESHOOTING.md`. The common ones: no ffmpeg on PATH, Chromium not installed, `429` from the voice API (free limit for now, wait or turn on billing), a CLIP from the judge (text wider than its card: shorten it or widen the card up to 920 px).
