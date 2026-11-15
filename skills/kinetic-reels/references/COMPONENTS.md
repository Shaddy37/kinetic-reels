# What you can put on screen

Start with the scene kit (`references/KIT.md`): most reels need nothing on this page. Use these pieces inside `REEL.custom(t)` when you need a picture no beat covers.

Helpers (core_a.js): `add(html, 'card'|'lab'|'prop')` puts a picture on stage (the kind makes the judge check it), `setT(el,{x,y,s,o,b,r})`
(x,y = centre), `cardV(t,in,out,y)` rise in, `popV(t,in,out,x,y)` spring pop, `labV(t,in,out,x,y)` label fade, `K(t,keys)` keyframes,
`typ(id,text,t,start,seconds)` typing, `prog`, `eo3`, `eo5`, `eio`, `spring`, `fmt(n)` (1,234), `hide(t,a,b)`.

## Classes in reel.html (copy usage from examples/claude-code-shortcuts/reel.js)
| class | what |
|---|---|
| `.card` | white card with soft shadow (judge checks it for clipped text) |
| `.lab.hd` + `.n` `.t` `.dots` | the list header: kicker, title, step dots (`i.on`) |
| `.kk` (`.sm` `.md` `.mini` `.gr`, `.dn` pressed) | big keycaps that press down |
| `.win` + `.ch` + `.fr` / `.ln2` / `.out` | an app or terminal window: title bar, file rows, a typed line, output |
| `.fg2 img` | a real screenshot inside a card (keep its aspect ratio) |
| `.src` | the small source line under an asset |
| `.chip` (`.v` `.k` `.r`) | pills: gradient, black, red |
| `.hl` | logo tile with a label |
| `.dq` | docs quote with a highlighted phrase (`mark`) |
| `.pp`, `.bars` + `.brw`, `.hero` | paper card, bar chart rows, big gradient number |
| `.mode`, `.tog` | a mode pill, a toggle switch (`.on`) |
| `.met` + `.pct` | a vertical meter with a percentage |
| `.ckr` | checklist row that turns green (`.on`) |
| `.endrow` | the end card: your photo (or initials), name, handle |
| `.lock` | a big emoji prop (reels may use emoji; keep it to props) |

## Motion library (motion.js, `M.`)
cursor + click (`M.cursor`, `M.cursorTo`), browser with scroll and zoom (`M.browser`, `M.scrollZoom`), self-drawing chart (`M.chart`, `M.drawChart`),
code diff (`M.diff`, `M.diffReveal`), chat stack (`M.chat`, `M.chatReveal`), split-flap number (`M.flap`, `M.flapTo`), drop and stack (`M.dropAt`),
race bars (`M.race`, `M.raceRun`), swarm (`M.swarm`, `M.swarmStep`), marker sweep (`M.mark`, `M.sweep`), pings (`M.pings`, `M.pingRun`),
meter (`M.meter`, `M.meterTo`), steps rail (`M.steps`, `M.stepsRun`). Read the comment above each in motion.js for the arguments.
Never use the ids `st`, `grid`, `wm`, `L` or `cap`: the page owns them.

## Layout rules the judge enforces
Inside x 28 to 1052 and y 90 to 1640. No two checked pictures overlap by more than 6 px (captions with captions are fine).
No `.card` with text wider or taller than itself. Cards max 920 px wide; images inside padded cards use `width:100%`.
