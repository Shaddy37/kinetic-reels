# Writing the script

## Length and shape
- List reel (5 to 7 items): 38 to 45 s at normal speed with 0.34 s pauses. Explainer: 45 to 60 s.
- Parts in `tts.json`: HOOK (2 lines), BODY (the items or the steps), PAYOFF (the open loop closes), CTA (one line).
- One idea per sentence. Short words. Contractions. Say it like you'd say it to a friend at a desk.

## The hook (the first 3 seconds decide everything)
- Line 1 = the payoff, in under 10 words. "Seven Claude Code shortcuts almost nobody uses."
- Line 2 opens a loop you close at the end. "And number seven saves me hours."
- Frame 0 is already moving and already shows the best real asset (keys falling, a counter running, the real repo card).
- 5-still check before you render: look at 0, 0.5, 1, 2 and 3 s. At every one, a stranger should know what the reel is about.

## Words to avoid (they make it sound machine-written)
"leverage", "utilize", "game-changer", "delve", "let's dive in", "unlock", "in today's fast-paced world", "It's not X, it's Y",
"What do you think?", em dashes. No invented numbers, no "studies show" without the study in facts.md.

## Numbers and names
- Write numbers as words in `tts.json` ("eighty-five thousand"), as digits on screen.
- Hard names get spelled the way they sound in tts.json ("Claude dot M-D", "slash init") and the real way in script.txt.

## script.txt format (for captions.py)
`size:display text|spoken words`, sizes `s` 54 px, `m` 78 px, `b` 100 px, `p` black pill (the punch line, max one per group).
A row starting with `/` starts a new caption group, `#` starts a new scene too. `*word` gradient (one phrase per group), `~word` serif italic.
Keep 1 to 3 rows per group, under about 22 characters per big row.

## The CTA
Written for this reel only: save it ("Save this before your next session"), send it ("Send this to the friend whose bill keeps going up"),
or one real question. Never "follow for more".
