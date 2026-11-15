# The scene kit (kit.js)

You don't hand-code motion. You describe the reel as data in `reel.js` (`const REEL={...}`) and `kit.js` builds every
scene with the exact motion of the gold reel: keys already falling on frame 0, a locked last item, a header that counts
n/N, cards that rise in sharp and drop out soft, a new picture on every caption group.

Proof: `examples/claude-code-shortcuts/reel.js` is the gold reel written as a kit spec. It renders frame for frame like the
hand-coded original (`reel.hand.js`) except a few transition frames a few hundredths of a second apart. If your reel looks worse
than the example, the spec is thin (too few beats, beats not on the words), not the kit.

## The shape

```js
const REEL={
 dur:18.5, scn:[0,3.6,8.0,12.0,16.0],   // captions.py --write fills dur, scn and caps from the real voice
 windowIcon:'as/claudecode.svg',        // logo in every window bar ('' for none)
 header:{kicker:'ALMOST NOBODY USES THEM', title:'7 Claude Code shortcuts', item:'Shortcut'},
 scenes:[ {kind:'hook',at:'s0',...}, {kind:'item',at:'s1',key:'/init',beats:[{kind:'type',at:'g3',...}, ...]}, ..., {kind:'cta',at:'s4'} ],
 caps:[ ... ],
 sounds:[[12.3,'chime',0.8]],           // optional extra sounds (the kit already gives every beat its sound)
 custom:t=>{}                           // optional: your own drawing code, runs every frame after the kit
};
```

## Times

Every `at` and every option ending in `At` (`pressAt`, `newAt`, `onAt`, `stopAt`, `labelAt`, `chipAt`, `clickAt`, `loopAt`) takes seconds or a reference:
- `'s2'` = scene start 2 (one per `#` row in script.txt, counted from 0),
- `'g5'` = caption group 5 starts (one per `/` row, counted from 0),
- `'g5.1'` = the `@` anchor of row 1 in group 5 (the moment that word is said),
- any of them plus or minus seconds: `'g5.1+0.2'`.

Use references, not numbers. Then a new voice take is one command (`captions.py --write`) and every scene and beat moves with its words.
A beat runs until the next beat starts (or the scene ends). That's the whole timing model.

## Sound

Every scene and beat has its sound built in (the gold reel's sound language: whoosh on frame 0, boom + thud + click on a key slam,
typing under typed text, pops on cards, a riser into STOP, a chime on a payoff). `mix.py` reads them with `shot.cjs <reel> cues`.
`sound:false` on a beat silences it; `REEL.sounds` or `EXTRA` in mix.py adds more.

## Scenes

| kind | what it shows | options |
|---|---|---|
| `hook` | every item's key in a grid on frame 0, the last one locked, then the locked `?` alone (the open loop) | `loopAt` (when the grid clears), `lock:false` (no locked item), `chip`, `chipAt`, `floats` ('+1h' rising 3x), `webs:[t,t]` (two cobwebs drop: "nobody uses these") |
| `item` | slams its key (with a press), then its beats | `key` (on the key cap, keep it 1 to 8 chars), `name` (header), `short` (recap label), `size:'md'` for long keys, `pressAt`, `beats:[...]` |
| `cta` | a bookmark that fills with the gradient on the click + a recap row of every key | `title`, `recap:[labels]`, `clickAt` |
| `end` | your photo (or initials), name and handle | none (uses brand.js) |
| `custom` | nothing: draw it yourself in `REEL.custom(t)` | anything |

The last `item` is the locked one when the hook locks: its key flips from `?` to the real key and the lock flies off.
If an item's first beat starts at the item's own `at`, the key slam is skipped (the gold reel does this for Shift + Tab).

## Beats (what goes inside an item)

| kind | use it for | options |
|---|---|---|
| `type` | a command or prompt typing into a window | `text`, `prompt` ('$', '>', '!'), `title`, `typeFor` s, `enter:true` (return key press), `output`, `dropdown:[3 names]`, `pre:true` (chat lines above), `y` |
| `files` | a file tree, a highlight walks it, a NEW row types in | `rows:[[icon,name],...]`, `newRow`, `newIcon`, `newAt`, `title` |
| `doc` | a REAL screenshot (docshot.mjs) + its source line | `src:'as/x.png'`, `source:'domain/path · what it shows'`, `y`, `sourceY` |
| `quote` | one docs line with the key phrase marked | `text` with `[[phrase]]`, `source`, `icon`, `y` |
| `drop` | a chip falls into a dashed bucket (add to context, queue) | `chip`, `icon`, `into` |
| `combo` | two keys pressed together | `keys:['⇧ shift','tab']`, `pressAt` |
| `toggle` | a mode pill and a switch flipping on | `label`, `onAt` |
| `plan` | numbered lines appearing + a chip under them | `title`, `widths:[px,...]`, `chip`, `chipAt` |
| `stop` | something heads the wrong way, a STOP sign slams in | `stopAt`, `word`, `logo` |
| `squeeze` | a long chat squeezes into a summary while a meter drops | `title`, `summary`, `from`, `to` (0 to 1) |
| `resume` | where you left off: blinking cursor + gradient pill | `title`, `label`, `labelAt`, `bookmark:true` |
| `big` | a big gradient number counting up (REAL numbers only, from facts.md) | `value`, `prefix`, `suffix`, `label`, `countFor` |
| `tile` | a logo tile with a label | `logo` (real SVG), `label`, `x`, `y` |
| `chips` | up to 3 chips popping in a column | `items:[...]` |

## Rules that make it look like the gold reel

1. Two or three beats per item, one per caption group. One beat for a whole 4 s item looks dead.
2. Start each beat on the word it shows (`@` anchors from captions.py). Picture and word land together.
3. Show, don't label: a `type` with the real command beats a `chips` with the command's name.
4. At least one real asset in every reel (`doc` or `quote` from the vendor's page, `tile` with the real logo).
5. Run the judge after every change (`shot.cjs audit`) and LOOK at the stills. The kit keeps things in the safe frame, but long text can still clip: shorten it.
6. Need something the kit doesn't have? Write it in `REEL.custom(t)` with `add()`, `setT()`, `cardV()`, `popV()` (core_a.js) and the motion library `M` (motion.js). Copy patterns from `examples/claude-code-shortcuts/reel.hand.js`.
