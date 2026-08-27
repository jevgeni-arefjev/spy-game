import { MAX_PLAYERS } from './config'
import type { Player } from './types'

/** i18n key suffixes under `setup.errors`. */
export type PlayerNameError = 'empty' | 'duplicate' | 'full'

export type PlayerNameResult =
  | { ok: true; name: string }
  | { ok: false; error: PlayerNameError }

/** Trim, then reject empty names, case-insensitive duplicates and an over-full roster. */
export function validatePlayerName(
  rawName: string,
  players: readonly Player[],
): PlayerNameResult {
  const name = rawName.trim()
  if (name.length === 0) return { ok: false, error: 'empty' }
  if (players.length >= MAX_PLAYERS) return { ok: false, error: 'full' }

  const taken = players.some(
    (player) => player.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
  )
  if (taken) return { ok: false, error: 'duplicate' }

  return { ok: true, name }
}
