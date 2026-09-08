/**
 * Single place for the game's tunable rules.
 * Nothing else in the app should hardcode these numbers.
 */

/**
 * Spy count a fresh session starts at. It is no longer fixed: `spyCount` is a
 * field on `GameState`, set on the Players screen with a stepper and clamped to
 * `1 <= spyCount <= players.length`. The state models the spies as a set
 * (`GameState.spyIds`) and every screen reads it through `includes`, so the
 * count flows through the machine as data.
 *
 * `createRoundSetup` draws exactly `state.spyCount` spies, and `parseStoredState`
 * discards a stored round whose `spyIds.length` no longer equals its `spyCount`.
 */
export const DEFAULT_SPY_COUNT = 1

/** Length of the discussion round, in seconds. */
export const DISCUSSION_SECONDS = 300

/** Fewest players a round can start with. */
export const MIN_PLAYERS = 3

/** Most players a round can hold. */
export const MAX_PLAYERS = 12

/** Longest player name the setup input accepts. */
export const PLAYER_NAME_MAX_LENGTH = 24

/** Shape version of the persisted session. Bump on any breaking state change. */
export const STATE_VERSION = 4

/** Single localStorage key holding the whole session. */
export const STORAGE_KEY = 'spy:session:v4'

/** How long to wait after the last state change before writing to storage. */
export const PERSIST_DEBOUNCE_MS = 200

/** How often the countdown re-reads the clock. */
export const TICK_INTERVAL_MS = 250
