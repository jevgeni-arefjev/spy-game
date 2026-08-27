/**
 * Single place for the game's tunable rules.
 * Nothing else in the app should hardcode these numbers.
 */

/**
 * How many players are spies each round. This is a real switch: the state
 * models the spies as a set (`GameState.spyIds`) and every screen reads it
 * through `includes`, so changing this number is all it takes.
 *
 * Keep it in `1 <= SPY_COUNT < MIN_PLAYERS` — a round with no civilians has
 * nothing to discuss. `createRoundSetup` draws exactly this many spies and
 * `parseStoredState` discards a stored session whose spy count no longer
 * matches, so flipping this between builds is safe.
 */
export const SPY_COUNT = 1

/** Length of the discussion round, in seconds. */
export const DISCUSSION_SECONDS = 300

/** Fewest players a round can start with. */
export const MIN_PLAYERS = 3

/** Most players a round can hold. */
export const MAX_PLAYERS = 12

/** Longest player name the setup input accepts. */
export const PLAYER_NAME_MAX_LENGTH = 24

/** Shape version of the persisted session. Bump on any breaking state change. */
export const STATE_VERSION = 2

/** Single localStorage key holding the whole session. */
export const STORAGE_KEY = 'spy:session:v2'

/** How long to wait after the last state change before writing to storage. */
export const PERSIST_DEBOUNCE_MS = 200

/** How often the countdown re-reads the clock. */
export const TICK_INTERVAL_MS = 250
