import { describe, it, expect } from 'vitest'
import { canStart, initialState, reducer } from './reducer'
import { DISCUSSION_SECONDS, MIN_PLAYERS, STATE_VERSION } from './config'
import { ALL_TOPIC_IDS } from './topics'
import type { Action, GameState, Player } from './types'

const DISCUSSION_MS = DISCUSSION_SECONDS * 1000
const ALL_TOPICS = [...ALL_TOPIC_IDS]

function roster(n: number): Player[] {
  return Array.from({ length: n }, (_, i) => ({ id: `p${i + 1}`, name: `P${i + 1}` }))
}

const round = { spyIds: ['p1'], wordId: 'beach' }

function home(overrides: Partial<GameState> = {}): GameState {
  return { ...initialState, ...overrides }
}

function topics(overrides: Partial<GameState> = {}): GameState {
  return { ...initialState, phase: 'topics', ...overrides }
}

function players(overrides: Partial<GameState> = {}): GameState {
  return {
    ...initialState,
    phase: 'players',
    players: roster(MIN_PLAYERS),
    ...overrides,
  }
}

function reveal(overrides: Partial<GameState> = {}): GameState {
  return {
    ...initialState,
    phase: 'reveal',
    players: roster(3),
    spyIds: ['p1'],
    wordId: 'beach',
    revealIndex: 0,
    revealStep: 'handoff',
    ...overrides,
  }
}

function discussion(overrides: Partial<GameState> = {}): GameState {
  return {
    ...initialState,
    phase: 'discussion',
    players: roster(3),
    spyIds: ['p1'],
    wordId: 'beach',
    timer: { endsAt: 10_000, remainingMs: DISCUSSION_MS, running: true },
    ...overrides,
  }
}

function ended(overrides: Partial<GameState> = {}): GameState {
  return {
    ...discussion(),
    phase: 'ended',
    timer: { endsAt: null, remainingMs: 0, running: false },
    ...overrides,
  }
}

describe('initialState', () => {
  it('is a clean home state with every topic in play', () => {
    expect(initialState.version).toBe(STATE_VERSION)
    expect(initialState.phase).toBe('home')
    expect(initialState.players).toEqual([])
    expect(initialState.topicIds).toEqual(ALL_TOPICS)
    expect(initialState.spyIds).toEqual([])
    expect(initialState.wordId).toBeNull()
    expect(initialState.revealIndex).toBe(0)
    expect(initialState.revealStep).toBe('handoff')
    expect(initialState.timer).toEqual({
      endsAt: null,
      remainingMs: DISCUSSION_MS,
      running: false,
    })
  })

  it('is not mutated by dispatching against it', () => {
    reducer(initialState, { type: 'game/open' })
    reducer(players(), { type: 'player/add', player: { id: 'x', name: 'X' } })
    expect(initialState.phase).toBe('home')
    expect(initialState.topicIds).toEqual(ALL_TOPICS)
  })
})

describe('canStart', () => {
  it('is false below MIN_PLAYERS and true at or above it', () => {
    expect(canStart(players({ players: roster(MIN_PLAYERS - 1) }))).toBe(false)
    expect(canStart(players({ players: roster(MIN_PLAYERS) }))).toBe(true)
    expect(canStart(players({ players: roster(MIN_PLAYERS + 1) }))).toBe(true)
    expect(canStart(players({ players: [] }))).toBe(false)
  })
})

describe('game/open', () => {
  it('moves from home to topics', () => {
    expect(reducer(home(), { type: 'game/open' }).phase).toBe('topics')
  })

  it('is ignored outside home', () => {
    for (const state of [topics(), players(), reveal(), discussion(), ended()]) {
      expect(reducer(state, { type: 'game/open' })).toBe(state)
    }
  })
})

describe('topics/toggle', () => {
  it('excludes an included topic', () => {
    const before = topics({ topicIds: [...ALL_TOPICS] })
    const after = reducer(before, { type: 'topics/toggle', id: ALL_TOPICS[1] })
    expect(after.topicIds).not.toContain(ALL_TOPICS[1])
    expect(after.topicIds).toHaveLength(ALL_TOPICS.length - 1)
  })

  it('re-includes an excluded topic in canonical order', () => {
    const before = topics({ topicIds: [ALL_TOPICS[2]] })
    const after = reducer(before, { type: 'topics/toggle', id: ALL_TOPICS[0] })
    expect(after.topicIds).toEqual([ALL_TOPICS[0], ALL_TOPICS[2]])
  })

  it('refuses to deselect the last remaining topic', () => {
    const before = topics({ topicIds: [ALL_TOPICS[0]] })
    expect(reducer(before, { type: 'topics/toggle', id: ALL_TOPICS[0] })).toBe(before)
  })

  it('ignores an unknown topic id', () => {
    const before = topics()
    expect(reducer(before, { type: 'topics/toggle', id: 'nope' })).toBe(before)
  })

  it('is ignored outside topics', () => {
    for (const state of [home(), players(), reveal(), discussion(), ended()]) {
      expect(reducer(state, { type: 'topics/toggle', id: ALL_TOPICS[0] })).toBe(state)
    }
  })
})

describe('topics/confirm', () => {
  it('moves from topics to players', () => {
    expect(reducer(topics(), { type: 'topics/confirm' }).phase).toBe('players')
  })

  it('is ignored outside topics', () => {
    for (const state of [home(), players(), reveal(), discussion(), ended()]) {
      expect(reducer(state, { type: 'topics/confirm' })).toBe(state)
    }
  })
})

describe('topics/back', () => {
  it('moves from topics to home', () => {
    expect(reducer(topics(), { type: 'topics/back' }).phase).toBe('home')
  })

  it('is ignored outside topics', () => {
    for (const state of [home(), players(), reveal(), discussion(), ended()]) {
      expect(reducer(state, { type: 'topics/back' })).toBe(state)
    }
  })
})

describe('players/back', () => {
  it('moves from players to topics', () => {
    expect(reducer(players(), { type: 'players/back' }).phase).toBe('topics')
  })

  it('is ignored outside players', () => {
    for (const state of [home(), topics(), reveal(), discussion(), ended()]) {
      expect(reducer(state, { type: 'players/back' })).toBe(state)
    }
  })
})

describe('player/add', () => {
  it('appends without mutating the previous state', () => {
    const before = players({ players: roster(1) })
    const after = reducer(before, {
      type: 'player/add',
      player: { id: 'p2', name: 'P2' },
    })
    expect(after.players).toHaveLength(2)
    expect(after.players[1]).toEqual({ id: 'p2', name: 'P2' })
    expect(before.players).toHaveLength(1)
    expect(after).not.toBe(before)
    expect(after.players).not.toBe(before.players)
  })

  it('is ignored outside the players phase', () => {
    for (const state of [home(), topics(), reveal(), discussion(), ended()]) {
      const action: Action = {
        type: 'player/add',
        player: { id: 'z', name: 'Z' },
      }
      expect(reducer(state, action)).toBe(state)
    }
  })
})

describe('player/remove', () => {
  it('drops the matching id and leaves others', () => {
    const before = players({ players: roster(3) })
    const after = reducer(before, { type: 'player/remove', id: 'p2' })
    expect(after.players.map((p) => p.id)).toEqual(['p1', 'p3'])
    expect(before.players).toHaveLength(3)
  })

  it('is a no-op for an unknown id but still returns a state', () => {
    const before = players({ players: roster(2) })
    const after = reducer(before, { type: 'player/remove', id: 'nope' })
    expect(after.players).toHaveLength(2)
  })

  it('is ignored outside the players phase', () => {
    for (const state of [home(), topics(), reveal(), discussion(), ended()]) {
      expect(reducer(state, { type: 'player/remove', id: 'p1' })).toBe(state)
    }
  })
})

describe('game/start', () => {
  it('enters reveal from the top with the drawn spies, word and a reset timer', () => {
    const before = players()
    const after = reducer(before, { type: 'game/start', round })
    expect(after.phase).toBe('reveal')
    expect(after.spyIds).toEqual(['p1'])
    expect(after.wordId).toBe('beach')
    expect(after.revealIndex).toBe(0)
    expect(after.revealStep).toBe('handoff')
    expect(after.timer).toEqual({
      endsAt: null,
      remainingMs: DISCUSSION_MS,
      running: false,
    })
    expect(after.players).toBe(before.players)
    expect(after.topicIds).toBe(before.topicIds)
  })

  it('is ignored below MIN_PLAYERS', () => {
    const state = players({ players: roster(MIN_PLAYERS - 1) })
    expect(reducer(state, { type: 'game/start', round })).toBe(state)
  })

  it('is ignored outside the players phase', () => {
    for (const state of [home(), topics(), reveal(), discussion(), ended()]) {
      expect(reducer(state, { type: 'game/start', round })).toBe(state)
    }
  })

  it('passes a multi-spy round straight through, spy-count agnostic', () => {
    const before = players({ players: roster(5) })
    const after = reducer(before, {
      type: 'game/start',
      round: { spyIds: ['p2', 'p4'], wordId: 'school' },
    })
    expect(after.spyIds).toEqual(['p2', 'p4'])
    expect(after.spyIds).not.toBe(before.spyIds)
  })
})

describe('reveal/confirmHandoff', () => {
  it('moves from handoff to card', () => {
    const after = reducer(reveal({ revealStep: 'handoff' }), {
      type: 'reveal/confirmHandoff',
    })
    expect(after.revealStep).toBe('card')
    expect(after.revealIndex).toBe(0)
  })

  it('is ignored when already on the card step', () => {
    const state = reveal({ revealStep: 'card' })
    expect(reducer(state, { type: 'reveal/confirmHandoff' })).toBe(state)
  })

  it('is ignored outside the reveal phase', () => {
    for (const state of [players(), discussion(), ended()]) {
      expect(reducer(state, { type: 'reveal/confirmHandoff' })).toBe(state)
    }
  })
})

describe('reveal/done', () => {
  it('advances to the next player back on the handoff step', () => {
    const after = reducer(reveal({ revealIndex: 0, revealStep: 'card' }), {
      type: 'reveal/done',
      now: 1_000,
    })
    expect(after.phase).toBe('reveal')
    expect(after.revealIndex).toBe(1)
    expect(after.revealStep).toBe('handoff')
  })

  it('starts a running deadline timer after the last player', () => {
    const state = reveal({ players: roster(3), revealIndex: 2, revealStep: 'card' })
    const after = reducer(state, { type: 'reveal/done', now: 5_000 })
    expect(after.phase).toBe('discussion')
    expect(after.timer).toEqual({
      endsAt: 5_000 + DISCUSSION_MS,
      remainingMs: DISCUSSION_MS,
      running: true,
    })
  })

  it('treats revealIndex past the end as the last player', () => {
    const state = reveal({ players: roster(3), revealIndex: 9, revealStep: 'card' })
    const after = reducer(state, { type: 'reveal/done', now: 0 })
    expect(after.phase).toBe('discussion')
  })

  it('is ignored on the handoff step', () => {
    const state = reveal({ revealStep: 'handoff' })
    expect(reducer(state, { type: 'reveal/done', now: 0 })).toBe(state)
  })

  it('is ignored outside the reveal phase', () => {
    for (const state of [players(), discussion(), ended()]) {
      expect(reducer(state, { type: 'reveal/done', now: 0 })).toBe(state)
    }
  })
})

describe('timer/pause', () => {
  it('freezes remaining time from the deadline and clears endsAt', () => {
    const state = discussion({
      timer: { endsAt: 100_000, remainingMs: DISCUSSION_MS, running: true },
    })
    const after = reducer(state, { type: 'timer/pause', now: 40_000 })
    expect(after.timer.running).toBe(false)
    expect(after.timer.endsAt).toBeNull()
    expect(after.timer.remainingMs).toBe(60_000)
  })

  it('clamps remaining time at zero when the deadline has passed', () => {
    const state = discussion({
      timer: { endsAt: 100_000, remainingMs: DISCUSSION_MS, running: true },
    })
    const after = reducer(state, { type: 'timer/pause', now: 250_000 })
    expect(after.timer.remainingMs).toBe(0)
  })

  it('is ignored when already paused or outside discussion', () => {
    const paused = discussion({
      timer: { endsAt: null, remainingMs: 1_000, running: false },
    })
    expect(reducer(paused, { type: 'timer/pause', now: 0 })).toBe(paused)
    for (const state of [players(), reveal(), ended()]) {
      expect(reducer(state, { type: 'timer/pause', now: 0 })).toBe(state)
    }
  })
})

describe('timer/resume', () => {
  it('sets a fresh deadline from the paused remainder', () => {
    const state = discussion({
      timer: { endsAt: null, remainingMs: 90_000, running: false },
    })
    const after = reducer(state, { type: 'timer/resume', now: 10_000 })
    expect(after.timer).toEqual({
      endsAt: 100_000,
      remainingMs: 90_000,
      running: true,
    })
  })

  it('is ignored when the remainder is already spent', () => {
    const state = discussion({
      timer: { endsAt: null, remainingMs: 0, running: false },
    })
    expect(reducer(state, { type: 'timer/resume', now: 0 })).toBe(state)
  })

  it('is ignored when already running or outside discussion', () => {
    const running = discussion()
    expect(reducer(running, { type: 'timer/resume', now: 0 })).toBe(running)
    for (const state of [players(), reveal(), ended()]) {
      expect(reducer(state, { type: 'timer/resume', now: 0 })).toBe(state)
    }
  })
})

describe('round/end', () => {
  it('ends the round and zeroes the timer', () => {
    const after = reducer(discussion(), { type: 'round/end' })
    expect(after.phase).toBe('ended')
    expect(after.timer).toEqual({ endsAt: null, remainingMs: 0, running: false })
  })

  it('works from a paused discussion too', () => {
    const paused = discussion({
      timer: { endsAt: null, remainingMs: 5_000, running: false },
    })
    expect(reducer(paused, { type: 'round/end' }).phase).toBe('ended')
  })

  it('is ignored outside discussion', () => {
    for (const state of [players(), reveal(), ended()]) {
      expect(reducer(state, { type: 'round/end' })).toBe(state)
    }
  })
})

describe('game/playAgain', () => {
  it('returns to topics, keeping the roster and topics, clearing the round', () => {
    const state = ended({
      revealIndex: 2,
      revealStep: 'card',
      spyIds: ['p2'],
      topicIds: ['food'],
    })
    const after = reducer(state, { type: 'game/playAgain' })
    expect(after.phase).toBe('topics')
    expect(after.players).toBe(state.players)
    expect(after.topicIds).toEqual(['food'])
    expect(after.spyIds).toEqual([])
    expect(after.revealIndex).toBe(0)
    expect(after.revealStep).toBe('handoff')
    expect(after.timer).toEqual({
      endsAt: null,
      remainingMs: DISCUSSION_MS,
      running: false,
    })
  })

  it('keeps the last word so the next draw can avoid it', () => {
    const after = reducer(ended({ wordId: 'school' }), { type: 'game/playAgain' })
    expect(after.wordId).toBe('school')
  })

  it('is ignored outside the ended phase', () => {
    for (const state of [home(), topics(), players(), reveal(), discussion()]) {
      expect(reducer(state, { type: 'game/playAgain' })).toBe(state)
    }
  })
})

describe('game/exit', () => {
  it('returns to home, keeping the roster and topics, clearing the round', () => {
    const state = ended({ spyIds: ['p1'], topicIds: ['travel'] })
    const after = reducer(state, { type: 'game/exit' })
    expect(after.phase).toBe('home')
    expect(after.players).toBe(state.players)
    expect(after.topicIds).toEqual(['travel'])
    expect(after.spyIds).toEqual([])
  })

  it('is ignored outside the ended phase', () => {
    for (const state of [home(), topics(), players(), reveal(), discussion()]) {
      expect(reducer(state, { type: 'game/exit' })).toBe(state)
    }
  })
})

describe('unrelated fields survive a transition', () => {
  it('keeps spies, word and roster identity when advancing a reveal', () => {
    const before = reveal({
      players: roster(3),
      spyIds: ['p2'],
      wordId: 'hospital',
      revealIndex: 0,
      revealStep: 'card',
    })
    const after = reducer(before, { type: 'reveal/done', now: 0 })
    expect(after.spyIds).toBe(before.spyIds)
    expect(after.wordId).toBe('hospital')
    expect(after.players).toBe(before.players)
    expect(after.version).toBe(before.version)
  })

  it('keeps spies and word when pausing and resuming', () => {
    const before = discussion({ spyIds: ['p3'], wordId: 'airport' })
    const paused = reducer(before, { type: 'timer/pause', now: 1_000 })
    const resumed = reducer(paused, { type: 'timer/resume', now: 2_000 })
    expect(paused.spyIds).toBe(before.spyIds)
    expect(resumed.wordId).toBe('airport')
    expect(resumed.players).toBe(before.players)
  })

  it('keeps spies and word when the round ends', () => {
    const before = discussion({ spyIds: ['p1'], wordId: 'school' })
    const after = reducer(before, { type: 'round/end' })
    expect(after.spyIds).toBe(before.spyIds)
    expect(after.wordId).toBe('school')
  })
})

describe('a full game played through the reducer', () => {
  it('walks home → topics → players → reveal → discussion → ended → topics', () => {
    let state = initialState

    state = reducer(state, { type: 'game/open' })
    expect(state.phase).toBe('topics')

    state = reducer(state, { type: 'topics/toggle', id: ALL_TOPICS[0] })
    expect(state.topicIds).not.toContain(ALL_TOPICS[0])

    state = reducer(state, { type: 'topics/confirm' })
    expect(state.phase).toBe('players')

    for (const player of roster(3)) {
      state = reducer(state, { type: 'player/add', player })
    }
    expect(canStart(state)).toBe(true)

    state = reducer(state, { type: 'game/start', round })
    expect(state.phase).toBe('reveal')

    for (let i = 0; i < 3; i++) {
      expect(state.revealIndex).toBe(i)
      expect(state.revealStep).toBe('handoff')
      state = reducer(state, { type: 'reveal/confirmHandoff' })
      expect(state.revealStep).toBe('card')
      state = reducer(state, { type: 'reveal/done', now: 1_000 })
    }

    expect(state.phase).toBe('discussion')
    expect(state.timer.running).toBe(true)

    state = reducer(state, { type: 'timer/pause', now: 1_000 })
    state = reducer(state, { type: 'timer/resume', now: 2_000 })

    state = reducer(state, { type: 'round/end' })
    expect(state.phase).toBe('ended')

    state = reducer(state, { type: 'game/playAgain' })
    expect(state.phase).toBe('topics')
    expect(state.players).toHaveLength(3)
    expect(state.topicIds).not.toContain(ALL_TOPICS[0])
    expect(state.spyIds).toEqual([])
  })
})
