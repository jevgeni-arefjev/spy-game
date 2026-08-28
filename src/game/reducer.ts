import { DISCUSSION_SECONDS, MIN_PLAYERS, STATE_VERSION } from './config'
import { msLeft } from './timer'
import { ALL_TOPIC_IDS, isKnownTopicId } from './topics'
import type { Action, GameState, Phase, RoundSetup } from './types'

const DISCUSSION_MS = DISCUSSION_SECONDS * 1000

/** A fresh, stopped discussion timer — the state every non-round phase holds. */
function resetTimer() {
  return { endsAt: null, remainingMs: DISCUSSION_MS, running: false }
}

export const initialState: GameState = {
  version: STATE_VERSION,
  phase: 'home',
  players: [],
  topicIds: [...ALL_TOPIC_IDS],
  spyIds: [],
  wordId: null,
  revealIndex: 0,
  revealStep: 'handoff',
  timer: resetTimer(),
}

/** Start the reveal run from the top with a fresh spy and word. */
function beginReveal(state: GameState, round: RoundSetup): GameState {
  return {
    ...state,
    phase: 'reveal',
    spyIds: round.spyIds,
    wordId: round.wordId,
    revealIndex: 0,
    revealStep: 'handoff',
    timer: resetTimer(),
  }
}

/**
 * Drop everything round-specific, keeping the roster and topic choice so the
 * next game can reuse (and edit) them. The last `wordId` is kept on purpose,
 * purely so the next draw can avoid repeating it.
 */
function clearRound(state: GameState, phase: Phase): GameState {
  return {
    ...state,
    phase,
    spyIds: [],
    revealIndex: 0,
    revealStep: 'handoff',
    timer: resetTimer(),
  }
}

export function canStart(state: GameState): boolean {
  return state.players.length >= MIN_PLAYERS
}

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'game/open': {
      if (state.phase !== 'home') return state
      return { ...state, phase: 'topics' }
    }

    case 'topics/toggle': {
      if (state.phase !== 'topics' || !isKnownTopicId(action.id)) return state

      if (state.topicIds.includes(action.id)) {
        // At least one topic must stay in play.
        if (state.topicIds.length === 1) return state
        return {
          ...state,
          topicIds: state.topicIds.filter((id) => id !== action.id),
        }
      }

      // Re-add in canonical order so the selection reads the same everywhere.
      return {
        ...state,
        topicIds: ALL_TOPIC_IDS.filter(
          (id) => state.topicIds.includes(id) || id === action.id,
        ),
      }
    }

    case 'topics/confirm': {
      if (state.phase !== 'topics') return state
      return { ...state, phase: 'players' }
    }

    case 'topics/back': {
      if (state.phase !== 'topics') return state
      return { ...state, phase: 'home' }
    }

    case 'players/back': {
      if (state.phase !== 'players') return state
      return { ...state, phase: 'topics' }
    }

    case 'player/add': {
      if (state.phase !== 'players') return state
      return { ...state, players: [...state.players, action.player] }
    }

    case 'player/remove': {
      if (state.phase !== 'players') return state
      return {
        ...state,
        players: state.players.filter((player) => player.id !== action.id),
      }
    }

    case 'game/start': {
      if (state.phase !== 'players' || !canStart(state)) return state
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
          remainingMs: msLeft(state.timer, action.now),
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
      return clearRound(state, 'topics')
    }

    case 'game/exit': {
      if (state.phase !== 'ended') return state
      return clearRound(state, 'home')
    }
  }
}
