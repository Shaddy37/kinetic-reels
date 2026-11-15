# Tests

`.github/workflows/test.yml` runs on every change to the skill:

- **clean-machine** (Ubuntu, macOS, Windows): installs the skill from scratch, runs the doctor, builds a new reel from the template with a stand-in voice (`fake_voice.py`), and renders the gold example.
- **demo-no-key** (Ubuntu): makes reference reel 3 (`examples/git-undo`, about 20 s) from this repo alone with **no API key**, using the free local voice. Saved as `docs/reels/git-undo-demo.mp4`.
- **real-voice** (Ubuntu, only with a `GEMINI_API_KEY` repo secret): records the Gemini Puck voice and renders reference reel 2 (`examples/how-it-works`).

Results: `docs/TESTED.md`.
