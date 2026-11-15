# Last test run

2026-11-15 10:53 UTC, commit `1446669`, on clean GitHub machines.

Each machine installs the skill from scratch, runs the doctor, builds a new reel from the template with the scene kit (stand-in voice, captions --write, layout judge, automatic sound, render, final check) and renders the gold example reel.

| machine | result |
|---|---|
| ubuntu-latest | **success** |
| macos-latest | **success** |
| windows-latest | **failure** |
| real Gemini voice (ubuntu) | **skipped: add a GEMINI_API_KEY repository secret to run the real voice test** |

<details><summary>ubuntu-latest log</summary>

```
ffmpeg version 8.0.1-3ubuntu2 Copyright (c) 2000-2025 the FFmpeg developers
PASS Node.js 22.23.4
PASS ffmpeg version 8.0.1-3ubuntu2 Copyright 
PASS ffprobe
PASS Python 3.12.16 (command: python3)
PASS numpy + scipy
PASS Playwright 1.65.1
PASS Chromium starts
PASS fonts
PASS free CC0 music bed
PASS GEMINI_API_KEY found (environment)
NOTE kinetic.config.json not found here yet: new-reel.mjs makes one the first time.

ALL GOOD. Make your first reel.
PYTHON use `python3` for every python command in this skill.
MADE kinetic.config.json: put your handle, name and a square photo path (face) in it.
NEW REEL /home/runner/work/kinetic-reels/kinetic-reels/ci-proj/reels/kit-test
next: facts.md, script.txt + tts.json, then: python "/home/runner/work/kinetic-reels/kinetic-reels/skills/kinetic-reels/scripts/voice.py" "/home/runner/work/kinetic-reels/kinetic-reels/ci-proj/reels/kit-test"
FAKE VOICE 9 groups
VOICE TIGHT 17.32 s, 9 speech segments -> /home/runner/work/kinetic-reels/kinetic-reels/ci-proj/reels/kit-test/audio/vo.wav
Next: captions.py --write (sets dur). Voice + 0.5 s = 17.8
WROTE reel.js: dur 17.8, scn 5 scene starts, caps 9 groups
scene starts: 0, 3.53, 7.74, 11.50, 15.89
group starts: 0:0.00, 1:1.54, 2:3.53, 3:5.97, 4:7.74, 5:9.96, 6:11.50, 7:13.49, 8:15.89
LAYOUT PASS
CUES 54 sounds, 17.8 s
MIX OK /home/runner/work/kinetic-reels/kinetic-reels/ci-proj/reels/kit-test/audio/mix.wav
RENDER OK /home/runner/work/kinetic-reels/kinetic-reels/ci-proj/reels/kit-test/out/silent.mp4 (534 frames, 28 s)
PASS /home/runner/work/kinetic-reels/kinetic-reels/ci-proj/reels/kit-test/out/final.mp4: 1080x1920, 30 fps, 17.8 s, -16.0 LUFS
VOICE TIGHT 37.76 s, 37 speech segments -> /home/runner/work/kinetic-reels/kinetic-reels/skills/kinetic-reels/examples/claude-code-shortcuts/audio/vo.wav
Next: captions.py --write (sets dur). Voice + 0.5 s = 38.3
LAYOUT PASS
MIX OK /home/runner/work/kinetic-reels/kinetic-reels/skills/kinetic-reels/examples/claude-code-shortcuts/audio/mix.wav
RENDER OK /home/runner/work/kinetic-reels/kinetic-reels/skills/kinetic-reels/examples/claude-code-shortcuts/out/silent.mp4 (1176 frames, 61 s)
PASS /home/runner/work/kinetic-reels/kinetic-reels/skills/kinetic-reels/examples/claude-code-shortcuts/out/final.mp4: 1080x1920, 30 fps, 39.2 s, -16.0 LUFS
```
</details>

<details><summary>macos-latest log</summary>

```
ffmpeg version 9.0.2 Copyright (c) 2000-2026 the FFmpeg developers
PASS Node.js 22.23.4
PASS ffmpeg version 9.0.2 Copyright (c) 2000-
PASS ffprobe
PASS Python 3.12.10 (command: python3)
PASS numpy + scipy
PASS Playwright 1.65.1
PASS Chromium starts
PASS fonts
PASS free CC0 music bed
PASS GEMINI_API_KEY found (environment)
NOTE kinetic.config.json not found here yet: new-reel.mjs makes one the first time.

ALL GOOD. Make your first reel.
PYTHON use `python3` for every python command in this skill.
MADE kinetic.config.json: put your handle, name and a square photo path (face) in it.
NEW REEL /Users/runner/work/kinetic-reels/kinetic-reels/ci-proj/reels/kit-test
next: facts.md, script.txt + tts.json, then: python "/Users/runner/work/kinetic-reels/kinetic-reels/skills/kinetic-reels/scripts/voice.py" "/Users/runner/work/kinetic-reels/kinetic-reels/ci-proj/reels/kit-test"
FAKE VOICE 9 groups
VOICE TIGHT 17.32 s, 9 speech segments -> /Users/runner/work/kinetic-reels/kinetic-reels/ci-proj/reels/kit-test/audio/vo.wav
Next: captions.py --write (sets dur). Voice + 0.5 s = 17.8
WROTE reel.js: dur 17.8, scn 5 scene starts, caps 9 groups
scene starts: 0, 3.53, 7.74, 11.50, 15.89
group starts: 0:0.00, 1:1.54, 2:3.53, 3:5.97, 4:7.74, 5:9.96, 6:11.50, 7:13.49, 8:15.89
LAYOUT PASS
CUES 54 sounds, 17.8 s
MIX OK /Users/runner/work/kinetic-reels/kinetic-reels/ci-proj/reels/kit-test/audio/mix.wav
RENDER OK /Users/runner/work/kinetic-reels/kinetic-reels/ci-proj/reels/kit-test/out/silent.mp4 (534 frames, 43 s)
PASS /Users/runner/work/kinetic-reels/kinetic-reels/ci-proj/reels/kit-test/out/final.mp4: 1080x1920, 30 fps, 17.8 s, -16.0 LUFS
VOICE TIGHT 37.76 s, 37 speech segments -> /Users/runner/work/kinetic-reels/kinetic-reels/skills/kinetic-reels/examples/claude-code-shortcuts/audio/vo.wav
Next: captions.py --write (sets dur). Voice + 0.5 s = 38.3
LAYOUT PASS
MIX OK /Users/runner/work/kinetic-reels/kinetic-reels/skills/kinetic-reels/examples/claude-code-shortcuts/audio/mix.wav
RENDER OK /Users/runner/work/kinetic-reels/kinetic-reels/skills/kinetic-reels/examples/claude-code-shortcuts/out/silent.mp4 (1176 frames, 88 s)
PASS /Users/runner/work/kinetic-reels/kinetic-reels/skills/kinetic-reels/examples/claude-code-shortcuts/out/final.mp4: 1080x1920, 30 fps, 39.2 s, -16.0 LUFS
```
</details>

<details><summary>windows-latest log</summary>

```
ffmpeg version 9.0.2-essentials_build-www.gyan.dev Copyright (c) 2000-2026 the FFmpeg developers
PASS Node.js 22.23.4
PASS ffmpeg version 9.0.2-essentials_build-ww
PASS ffprobe
PASS Python 3.12.10 (command: python)
FIX  numpy/scipy missing: python -m pip install -r "D:\a\kinetic-reels\kinetic-reels\skills\kinetic-reels\requirements.txt"
PASS Playwright 1.65.1
PASS Chromium starts
PASS fonts
PASS free CC0 music bed
PASS GEMINI_API_KEY found (environment)
NOTE kinetic.config.json not found here yet: new-reel.mjs makes one the first time.

1 thing(s) to fix, then run this again.
PYTHON use `python` for every python command in this skill.
```
</details>

<details><summary>real-voice log</summary>

```
```
</details>

