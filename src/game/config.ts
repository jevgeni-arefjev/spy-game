/**
 * Single place for the game's tunable rules.
 * Nothing else in the app should hardcode these numbers.
 */

/**
 * How many players are spies each round.
 *
 * NOTE: the persisted state models exactly one spy (`GameState.spyId`).
 * Raising this above 1 also means widening that field to `spyIds: string[]`
 * and bumping `STATE_VERSION`. See CLAUDE.md.
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
export const STATE_VERSION = 1

/** Single localStorage key holding the whole session. */
export const STORAGE_KEY = 'spy:session:v1'

/** How long to wait after the last state change before writing to storage. */
export const PERSIST_DEBOUNCE_MS = 200

/** How often the countdown re-reads the clock. */
export const TICK_INTERVAL_MS = 250
