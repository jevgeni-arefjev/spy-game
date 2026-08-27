import type { STATE_VERSION } from './config'

export type Phase = 'setup' | 'reveal' | 'discussion' | 'ended'

export type RevealStep = 'handoff' | 'card'

export type Player = {
  id: string
  name: string
}

export type TimerState = {
  /** Absolute wall-clock deadline while running; null while paused. */
  endsAt: number | null
  /** Milliseconds left. Authoritative only while paused. */
  remainingMs: number
  running: boolean
}

export type GameState = {
  version: typeof STATE_VERSION
  phase: Phase
  players: Player[]
  /** Ids of the players who are spies this round. Empty until a round starts. */
  spyIds: string[]
  /** Key into the word list, never the translated string. */
  wordId: string | null
  /** Index of the player currently revealing. */
  revealIndex: number
  revealStep: RevealStep
  timer: TimerState
}

/**
 * Everything random about a round, drawn at the dispatch site so the
 * reducer itself stays pure (and safe under StrictMode's double-invoke).
 */
export type RoundSetup = {
  spyIds: string[]
  wordId: string
}

export type Action =
  | { type: 'player/add'; player: Player }
  | { type: 'player/remove'; id: string }
  | { type: 'game/start'; round: RoundSetup }
  | { type: 'reveal/confirmHandoff' }
  | { type: 'reveal/done'; now: number }
  | { type: 'timer/pause'; now: number }
  | { type: 'timer/resume'; now: number }
  | { type: 'round/end' }
  | { type: 'game/playAgain'; round: RoundSetup }
  | { type: 'game/reset' }
