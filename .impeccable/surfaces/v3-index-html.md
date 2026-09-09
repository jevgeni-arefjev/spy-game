---
version: 1
slug: "v3-index-html"
primary_target: "v3/index.html"
related_targets: []
---

# v3 — Scoreboard

Scope: the whole Spy flow as a static mockup, `v3/index.html`, seven frames per `.impeccable/surfaces/mockup-harness.md`.
Mode: Operate.
Audience, job, constraints: see PRODUCT.md; nothing pinned by the user beyond "game night vibe, go wide".
Kind: dealt challenger, fused (catalog id `signals-instruments-seven-segment-alarm-clock`); verdict competitive on identification, wins on product clarity for the clock and counts.

## Direction contract

THESIS: The phone is the gym scoreboard and the bedside clock: one segment alphabet where unlit segments are designed too.
Numbers are the drama of this game (players, spies, the clock) and here they are the only thing that glows.
It refues the glowing-edge "neon dark mode": this is hardware, with a bezel, vinyl plates and ghost cells.

OWN-WORLD: Matte near-black `#0b0b0d` ground with a slightly lighter bezel `#17171a`; LED red `#ff3b2f` for every live digit; scoreboard amber `#ffb000` for the civilian's word; the spy face lit in red with one blinking segment; ghost cells at 9% of the lit colour so absence is drawn.
Digits are true seven-segment masks built in CSS (seven clip-path segments per cell, fixed slots, colon as its own cell), never a font.
Words and names in Doto (dot-matrix, 500–800) like a stadium message board; printed vinyl labels (TIME LEFT, PLAYERS, SPIES, TOPICS) in Barlow Condensed 600 caps, off-white `#d7d7d2`.
Controls are console keys: dark plastic keys `#232326` with a printed label and a small LED dot that lights when the key's state is on; the primary key is red-lit.
Topics are plates with an LED indicator each; included is lit.
The face-down card is an unlit board: every cell ghosted; tap ignites the segments instantly, no slide, no fade.
Setting the spy count makes that digit blink for a second, the canonical "set" state.

STORY: The group reads the phone the way they read a scoreboard from across a room: big, lit, unmistakable.

FIRST VIEWPORT: Home is the board switched on: black bezel, "SPY" in Doto at roughly 120 px in red across the upper third, the tagline in Barlow Condensed caps 18 px below, a ghosted four-cell clock reading 05:00 mid-screen, and one red-lit "PLAY SPY" key at the bottom, full width, 60 px tall.

FORM: The seven-segment display family; dealt challenger; seed key a9839155.
Honest risk: dot-matrix names and long words at small sizes; keep the word huge and the rest sparse.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
