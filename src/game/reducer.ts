import { DISCUSSION_SECONDS, MIN_PLAYERS, STATE_VERSION } from './config'
import type { Action, GameState, RoundSetup } from './types'

const DISCUSSION_MS = DISCUSSION_SECONDS * 1000

export const initialState: GameState = {
  version: STATE_VERSION,
  phase: 'setup',
  players: [],
  spyId: null,
  wordId: null,
  revealIndex: 0,
  revealStep: 'handoff',
  timer: { endsAt: null, remainingMs: DISCUSSION_MS, running: false },
}

/** Start the reveal run from the top with a fresh spy and word. */
function beginReveal(state: GameState, round: RoundSetup): GameState {
  return {
    ...state,
    phase: 'reveal',
    spyId: round.spyId,
    wordId: round.wordId,
    revealIndex: 0,
    revealStep: 'handoff',
    timer: { endsAt: null, remainingMs: DISCUSSION_MS, running: false },
  }
}

export function canStart(state: GameState): boolean {
  return state.players.length >= MIN_PLAYERS
}

/** Milliseconds left on the clock right now, whether running or paused. */
export function remainingMs(state: GameState, now: number): number {
  const { endsAt, remainingMs: paused, running } = state.timer
  if (!running || endsAt === null) return Math.max(0, paused)
  return Math.max(0, endsAt - now)
}

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'player/add': {
      if (state.phase !== 'setup') return state
      return { ...state, players: [...state.players, action.player] }
    }

    case 'player/remove': {
      if (state.phase !== 'setup') return state
      return {
        ...state,
        players: state.players.filter((player) => player.id !== action.id),
      }
    }

    case 'game/start': {
      if (state.phase !== 'setup' || !canStart(state)) return state
      return beginReveal(state, action.round)
    }

    case 'reveal/confirmHandoff': {
      if (state.phase !== 'reveal' || state.revealStep !== 'handoff') return state
      return { ...state, revealStep: 'card' }
    }

    case 'reveal/done': {
      if (state.phase !== 'reveal' || state.revealStep !== 'card') return state

      const isLastPlayer = state.revealIndex >= state.players.length - 1
      if (!isLastPlayer) {
        return {
          ...state,
          revealIndex: state.revealIndex + 1,
          revealStep: 'handoff',
        }
      }

      return {
        ...state,
        phase: 'discussion',
        timer: {
          endsAt: action.now + DISCUSSION_MS,
          remainingMs: DISCUSSION_MS,
          running: true,
        },
      }
    }

    case 'timer/pause': {
      if (state.phase !== 'discussion' || !state.timer.running) return state
      return {
        ...state,
        timer: {
          endsAt: null,
          remainingMs: remainingMs(state, action.now),
          running: false,
        },
      }
    }

    case 'timer/resume': {
      if (state.phase !== 'discussion' || state.timer.running) return state
      if (state.timer.remainingMs <= 0) return state
      return {
        ...state,
        timer: {
          endsAt: action.now + state.timer.remainingMs,
          remainingMs: state.timer.remainingMs,
          running: true,
        },
      }
    }

    case 'round/end': {
      if (state.phase !== 'discussion') return state
      return {
        ...state,
        phase: 'ended',
        timer: { endsAt: null, remainingMs: 0, running: false },
      }
    }

    case 'game/playAgain': {
      if (state.phase !== 'ended') return state
      return beginReveal(state, action.round)
    }

    case 'game/reset': {
      return { ...initialState }
    }
  }
}
