# Last test run

2026-11-14 13:59 UTC on a clean GitHub `ubuntu-latest` machine, result: **success**

Steps: install the skill from scratch, run the doctor, make a new reel from the template and run the layout judge, render the example reel, run the final check.

```
PASS Node.js 22.23.4
PASS ffmpeg version 8.0.1-3ubuntu2 Copyright 
PASS ffprobe
PASS Python 3.12.16
PASS numpy + scipy
PASS Playwright 1.65.1
PASS Chromium starts
PASS fonts
PASS free CC0 music bed
PASS GEMINI_API_KEY found (environment)
NOTE kinetic.config.json not found here yet: new-reel.mjs makes one the first time.

ALL GOOD. Make your first reel.
MADE kinetic.config.json: put your handle, name and a square photo path (face) in it.
NEW REEL /tmp/proj/reels/smoke-test
next: facts.md, script.txt + tts.json, then: python "/home/runner/work/kinetic-reels/kinetic-reels/skills/kinetic-reels/scripts/voice.py" "/tmp/proj/reels/smoke-test"
LAYOUT PASS
VOICE TIGHT 37.76 s, 37 speech segments -> /home/runner/work/kinetic-reels/kinetic-reels/skills/kinetic-reels/examples/claude-code-shortcuts/audio/vo.wav
Set DUR in reel.js to about 38.3
LAYOUT PASS
MIX OK /home/runner/work/kinetic-reels/kinetic-reels/skills/kinetic-reels/examples/claude-code-shortcuts/audio/mix.wav
RENDER OK /home/runner/work/kinetic-reels/kinetic-reels/skills/kinetic-reels/examples/claude-code-shortcuts/out/silent.mp4 (1176 frames, 57 s)
PASS /home/runner/work/kinetic-reels/kinetic-reels/skills/kinetic-reels/examples/claude-code-shortcuts/out/final.mp4: 1080x1920, 30 fps, 39.2 s, -16.0 LUFS
```
