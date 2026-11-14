# Real assets

People trust a reel that shows the real thing. Every reel shows 3 or more real assets, each with a small `.src` line.

- **Docs and product pages:** `node docshot.mjs <url> as/doc_x.png --selector "article h1"` (or `--scroll 600` and no selector). Crop to the part that proves the point.
- **Logos:** the vendor's own SVG (press kit, GitHub org, the site's favicon SVG). `assets/logos` has Claude, Claude Code, Codex, OpenCode, Gemini, OpenAI.
- **People:** only their own verified photo (e.g. their GitHub avatar from the API). Never a generated face.
- **Numbers:** read the same day (GitHub stars from the API, prices from the pricing page). Put the date in facts.md.
- **Never** fake a post, a tweet, a chat, a dashboard or an output. Drawn UI (like the file tree in the example) is fine when it is clearly a generic illustration, not a claim.
