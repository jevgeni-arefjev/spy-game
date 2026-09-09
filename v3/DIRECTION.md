# v3 - Scoreboard

## Thesis

The phone is a piece of hardware: a gym scoreboard bolted to a bedside alarm clock.
Numbers are the drama of this game - how many players, how many spies, how much time is left - so numbers are the only thing that glows, and they are drawn, never typeset.
Every numeral on every screen is seven CSS clip-path segments in a fixed cell, and the segments that are off stay visible as ghosts at about 10% of the lit colour, because a real display never hides its dark cells.
That single rule does the work: the face-down card is simply a board that has not been switched on yet, and the reveal is an ignition rather than a flip.
This is deliberately not the glowing-edge neon dark mode.
It has a bezel, screw heads, printed vinyl labels and plastic keys you can see the bevel on.

## Palette (hex)

Ground, the matte chassis behind everything: `#0b0b0d`.
Bezel face, where labels are printed, as a vertical gradient: `#191919` to `#101012`.
Recessed display panels, the windows the digits live in: `#111114` to `#08080a`, hairline `#2b2b31`.
LED red, every live digit and every lit indicator: `#ff3b2f`.
Ghost segments: `rgba(255,59,47,.10)` - the same red at a tenth, so absence is drawn in the same ink as presence.
Standby digits (home's `05:00`, ended's `00:00`, a board idling rather than counting): the lit red at 44% with no glow.
Scoreboard amber, reserved for exactly one thing - the civilian's word: `#ffb000`.
Printed vinyl off-white: `#d7d7d2`, brightened to `#ece9e4` for names and headings, stepped down to `#a9a9a2` and `#949490` for secondary and tertiary lines.
Key plastic: `#2a2a2e` to `#1b1b1f`, with a `#46464e` top highlight edge and a `#050506` bottom shadow edge.
Primary key plastic is the same mould in red: `#33191a` to `#210f10`, top edge `#5e2c2c`.
Focus ring, selection and caret are all pulled from the world - amber `#ffb000` for the ring, LED red for selection and the text caret.

## Type

Two faces, plus one that is not a face at all.

Doto (500-800) is the stadium message board: the "SPY" wordmark at 112px, screen titles, player names, "Pass the phone to Priya", and both card faces.
It is a dot-matrix design, so it reads as the second display technology in the room next to the segment cells and never competes with them.

Barlow Condensed carries two jobs and the distinction is strict.
At 600 weight, uppercase, tracked 0.16-0.19em it is a printed vinyl label stuck on the bezel: `INCLUDED`, `SPIES`, `PLAYERS`, `TIME LEFT`, `YOUR WORD`, and every key cap.
At 400 weight in sentence case it is ordinary readable prose for the subtitles, the roster hint and the error line, because a first-timer should not have to read a sentence in tracked caps.

The seven-segment cell is the third voice and it is CSS geometry, not a font: seven `<i>` elements per digit, each shaped by a `clip-path` hexagon with the classic 45-degree bevelled ends, sized entirely off a single `--h` custom property so one cell scales from a 15px roster index to the 94px discussion clock.
The colon is its own narrow cell with two square dots; the slash in "3 / 5" and "6 / 12" is its own skewed bar.
Every one of these carries a visually hidden span with the real number, so the accessible name of the clock is the text `03:47`, not a pile of decorative divs.

## Materials

Four surfaces, and nothing is allowed to be a fifth.

The chassis is a vertical gradient with a 3px repeating hairline for a brushed finish, at 1.4% alpha, so it is felt rather than seen.

Recessed panels are the display windows: a deep inset shadow, a hairline edge, and four screw heads drawn as corner radial gradients with a dark slot ring.
They hold the home clock, the handoff message, the reveal card and the discussion clock.

Console keys are dark plastic with a real bevel - an inset top highlight, an inset bottom shade, a solid `0 3px 0` side wall and a blurred shadow under that.
Pressing sinks the key by 3px and collapses the side wall, so the travel is physical rather than a colour change.
Each key carries an LED dot at its left that lights only when the key's state is genuinely on: the primary action, the running Pause key, the Add key once there is a name in the slot.

Topic plates are the same plastic with a bigger LED and the brushed hairline running across them.

Lit segments carry a `drop-shadow` glow scaled to 5.5% of the cell height, so a 94px clock digit gets a 5px halo and a 15px roster index gets under a pixel.
It is emissive light coming off the segment shape itself, not a coloured box-shadow around a rectangle.

## Controls and states

Everything that acts is a real `<button>`; the roster is a `<ul>`; the topic list is a `<ul>` of toggles each carrying `aria-pressed`; the spy stepper is a `role="group"` labelled by the visible `SPIES` plate, with `Fewer spies` and `More spies` on the two keys.
The input has a visually hidden `Player name` label and a themed caret.

Topic toggles flip the LED and step the label from `#949490` to `#ece9e4`; the last included topic is `disabled` so the group can never empty the word pool.
The spy stepper clamps to 1 through the roster length and disables at both bounds.
Add player reports `Type a name first.`, `Someone already has that name.` and `That's the maximum of 12 players.` in a reserved-height red line, so nothing below it moves.
The roster scrolls inside its own region with a themed scrollbar; the hint line and the Start key follow the roster size and Start is a dead, unlit key below three players.
The card is one button: face-down it is named `Priya's card - tap to reveal`, revealed it drops that label and lets its own content speak, and `Got it` is disabled until it has been.
Pause swaps its cap to Resume, swaps `Time left` to `Paused`, and drops its LED; End round freezes the clock and deadens both keys.
Focus is never the browser default - an amber ring at 3px offset, on the keys, the plates, the card, the stepper and the input alike.

## Signature interaction

The unlit board.

The face-down card is seven ghosted seven-segment cells above the player's name: a display that is on but showing nothing, which is exactly what a group holding the phone before a reveal is looking at.
One tap and the board ignites - instantly, no transition, no fade, because segments do not ease - into either the amber word `Hot-air balloon` under a printed `YOUR WORD` plate, or the red spy face with `Hint: Slow` and a single 9px LED blinking at 1Hz in the corner the way an alarm clock signals a set alarm.
The same rule governs the whole app: setting the spy count blinks that digit for one second and stops, the canonical hardware "value accepted".
Both blinks are the only continuous motion in the build and both are switched off under `prefers-reduced-motion`, where the state change still happens - just without the flash.

## Honest risk

Doto is a dot-matrix face and it thins out at small sizes.
Roster names at 19px are legible but noticeably dottier than the rest of the interface, and a long name in a dim room is the first thing that would break.
The mitigation is that the word and the names are large and everything else is Barlow, but a version of this shipped to a real party would want a legibility test on actual phones before trusting Doto below 20px.

The second risk is the digit `1`.
In a genuine seven-segment cell with ghosts drawn, a `1` is two bars floating inside a visible `8`, which is honest hardware and mildly ambiguous at 16px in the roster index and the spy stepper.
Reading it as a `1` takes a beat the first time.
I kept it because softening the ghosts would break the one rule the whole direction rests on, but it is a real cost and not a rendering bug.

Third, this world spends a lot of black.
Home and handoff have wide empty bezel between elements, and that is intentional - a scoreboard is mostly unlit surface - but the line between "hardware calm" and "unfinished screen" is thinner here than in a denser direction, and a reviewer who does not read it as bezel will read it as a layout that ran out of content.
