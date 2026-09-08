import { MAX_PLAYERS, STATE_VERSION, STORAGE_KEY } from './config'
import { initialState } from './reducer'
import { isKnownTopicId } from './topics'
import { isKnownWordId } from './words'
import * as storage from '../lib/storage'
import type { GameState, Phase, Player, RevealStep, TimerState } from './types'

const PHASES: readonly Phase[] = [
  'home',
  'topics',
  'players',
  'reveal',
  'discussion',
  'ended',
]
const REVEAL_STEPS: readonly RevealStep[] = ['handoff', 'card']

/** Phases where a round is live: spies, word and reveal index must all be real. */
const IN_ROUND_PHASES: readonly Phase[] = ['reveal', 'discussion', 'ended']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parsePlayers(value: unknown): Player[] | null {
  if (!Array.isArray(value) || value.length > MAX_PLAYERS) return null

  const players: Player[] = []
  for (const entry of value) {
    if (!isRecord(entry)) return null
    const { id, name } = entry
    if (typeof id !== 'string' || id.length === 0) return null
    if (typeof name !== 'string' || name.length === 0) return null
    players.push({ id, name })
  }

  const ids = new Set(players.map((player) => player.id))
  return ids.size === players.length ? players : null
}

function parseTopicIds(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length === 0) return null

  const ids: string[] = []
  for (const entry of value) {
    if (typeof entry !== 'string' || !isKnownTopicId(entry)) return null
    ids.push(entry)
  }

  return new Set(ids).size === ids.length ? ids : null
}

function parseSpyIds(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null

  const ids: string[] = []
  for (const entry of value) {
    if (typeof entry !== 'string' || entry.length === 0) return null
    ids.push(entry)
  }

  return new Set(ids).size === ids.length ? ids : null
}

function parseTimer(value: unknown): TimerState | null {
  if (!isRecord(value)) return null
  const { endsAt, remainingMs, running } = value
  if (typeof running !== 'boolean') return null
  if (typeof remainingMs !== 'number' || !Number.isFinite(remainingMs)) return null
  if (endsAt !== null && (typeof endsAt !== 'number' || !Number.isFinite(endsAt))) {
    return null
  }
  if (running && endsAt === null) return null
  return { endsAt, remainingMs, running }
}

/**
 * Turn an unknown stored blob into a `GameState`, or null if anything at all
 * is off. Version mismatches, corrupt shapes and internally inconsistent
 * sessions are all discarded rather than repaired — a stale party game is
 * worth far less than a boot that never crashes.
 */
export function parseStoredState(value: unknown): GameState | null {
  if (!isRecord(value)) return null
  if (value.version !== STATE_VERSION) return null

  const phase = value.phase
  if (typeof phase !== 'string' || !PHASES.includes(phase as Phase)) return null

  const revealStep = value.revealStep
  if (typeof revealStep !== 'string' || !REVEAL_STEPS.includes(revealStep as RevealStep)) {
    return null
  }

  const players = parsePlayers(value.players)
  if (players === null) return null

  const topicIds = parseTopicIds(value.topicIds)
  if (topicIds === null) return null

  const timer = parseTimer(value.timer)
  if (timer === null) return null

  const spyIds = parseSpyIds(value.spyIds)
  if (spyIds === null) return null

  const spyCount = value.spyCount
  if (
    typeof spyCount !== 'number' ||
    !Number.isInteger(spyCount) ||
    spyCount < 1 ||
    spyCount > MAX_PLAYERS
  ) {
    return null
  }

  const { wordId, revealIndex } = value
  if (wordId !== null && typeof wordId !== 'string') return null
  if (typeof revealIndex !== 'number' || !Number.isInteger(revealIndex) || revealIndex < 0) {
    return null
  }

  // Cross-field sanity: an in-progress round must still refer to real things,
  // and a pre-round phase must not carry a leftover spy set.
  if (IN_ROUND_PHASES.includes(phase as Phase)) {
    // A stored round whose spy set no longer matches its spy count is discarded,
    // not resumed — same stance as a version bump for a shape change. Pre-round
    // a stale `spyCount` is instead clamped when the Players screen loads.
    if (spyIds.length !== spyCount) return null
    const roster = new Set(players.map((player) => player.id))
    if (!spyIds.every((id) => roster.has(id))) return null
    if (wordId === null || !isKnownWordId(wordId)) return null
  } else {
    if (spyIds.length !== 0) return null
    // A kept "last word" memo is fine, but it still has to be a real word.
    if (wordId !== null && !isKnownWordId(wordId)) return null
  }
  if (phase === 'reveal' && revealIndex >= players.length) return null

  return {
    version: STATE_VERSION,
    phase: phase as Phase,
    players,
    topicIds,
    spyCount,
    spyIds,
    wordId,
    revealIndex,
    revealStep: revealStep as RevealStep,
    timer,
  }
}

/** Read the persisted session, falling back to a clean slate. */
export function loadState(): GameState {
  return parseStoredState(storage.get(STORAGE_KEY)) ?? initialState
}

export function saveState(state: GameState): void {
  storage.set(STORAGE_KEY, state)
}
