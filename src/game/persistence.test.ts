import { afterEach, describe, it, expect, vi } from 'vitest'
import { loadState, parseStoredSession, parseStoredState, saveState } from './persistence'
import { initialState } from './reducer'
import {
  DEFAULT_SPY_COUNT,
  DISCUSSION_SECONDS,
  ROUND_TTL_MS,
  SETUP_TTL_MS,
  STATE_VERSION,
  STORAGE_KEY,
} from './config'
import { ALL_TOPIC_IDS } from './topics'
import { WORD_IDS } from './words'
import type { GameState } from './types'

const DISCUSSION_MS = DISCUSSION_SECONDS * 1000
const KNOWN_WORD = WORD_IDS[0]
const ALL_TOPICS = [...ALL_TOPIC_IDS]

function players(n: number) {
  return Array.from({ length: n }, (_, i) => ({ id: `p${i + 1}`, name: `P${i + 1}` }))
}

// Fixtures stay valid for whatever DEFAULT_SPY_COUNT ships: enough players to
// hold the spies plus a civilian, and exactly that many spy ids from the roster.
const ROUND_ROSTER = Math.max(3, DEFAULT_SPY_COUNT + 2)
const SPY_IDS = Array.from({ length: DEFAULT_SPY_COUNT }, (_, i) => `p${i + 1}`)

const validHome: GameState = {
  version: STATE_VERSION,
  phase: 'home',
  players: [],
  topicIds: ALL_TOPICS,
  spyCount: DEFAULT_SPY_COUNT,
  spyIds: [],
  wordId: null,
  revealIndex: 0,
  revealStep: 'handoff',
  timer: { endsAt: null, remainingMs: DISCUSSION_MS, running: false },
}

const validTopics: GameState = {
  ...validHome,
  phase: 'topics',
  topicIds: [ALL_TOPICS[0]],
}

const validPlayers: GameState = {
  ...validHome,
  phase: 'players',
  players: players(2),
}

const validReveal: GameState = {
  ...validPlayers,
  phase: 'reveal',
  players: players(ROUND_ROSTER),
  spyCount: SPY_IDS.length,
  spyIds: SPY_IDS,
  wordId: KNOWN_WORD,
  revealIndex: 1,
  revealStep: 'card',
}

const validDiscussion: GameState = {
  ...validReveal,
  phase: 'discussion',
  revealIndex: 0,
  revealStep: 'handoff',
  timer: { endsAt: 1_000_000, remainingMs: DISCUSSION_MS, running: true },
}

const validEnded: GameState = {
  ...validDiscussion,
  phase: 'ended',
  timer: { endsAt: null, remainingMs: 0, running: false },
}

/** A deep clone through JSON, as the storage layer does it, kept spreadable. */
function wire<T extends object>(value: T): Record<string, unknown> {
  return JSON.parse(JSON.stringify(value)) as Record<string, unknown>
}

describe('parseStoredState — accepts every valid phase', () => {
  it('round-trips each phase unchanged', () => {
    for (const state of [
      validHome,
      validTopics,
      validPlayers,
      validReveal,
      validDiscussion,
      validEnded,
    ]) {
      expect(parseStoredState(wire(state))).toEqual(state)
    }
  })

  it('rebuilds the object rather than returning the input', () => {
    const input = wire(validReveal)
    const parsed = parseStoredState(input)
    expect(parsed).not.toBe(input)
    expect(parsed).toEqual(validReveal)
  })
})

describe('parseStoredState — rejects malformed containers', () => {
  it('rejects non-records', () => {
    for (const bad of [null, undefined, 42, 'x', true, [], [validHome]]) {
      expect(parseStoredState(bad)).toBeNull()
    }
  })

  it('rejects a version mismatch, including the previous shape', () => {
    for (const version of [0, STATE_VERSION - 1, STATE_VERSION + 1, '1', null, undefined]) {
      expect(parseStoredState({ ...wire(validHome), version })).toBeNull()
    }
  })

  it('rejects an unknown phase, including the old "setup"', () => {
    for (const phase of ['lobby', 'setup', '', 42, null]) {
      expect(parseStoredState({ ...wire(validHome), phase })).toBeNull()
    }
  })

  it('rejects an unknown reveal step', () => {
    for (const revealStep of ['flipped', '', 1, null]) {
      expect(parseStoredState({ ...wire(validHome), revealStep })).toBeNull()
    }
  })
})

describe('parseStoredState — rejects malformed players', () => {
  it('rejects a non-array roster', () => {
    for (const bad of [null, {}, 'p1,p2', 3]) {
      expect(parseStoredState({ ...wire(validPlayers), players: bad })).toBeNull()
    }
  })

  it('rejects a roster past MAX_PLAYERS', () => {
    expect(parseStoredState({ ...wire(validPlayers), players: players(13) })).toBeNull()
  })

  it('rejects malformed entries', () => {
    const cases = [
      ['not a record', 'p1'],
      [{ id: 'p1' }],
      [{ name: 'P1' }],
      [{ id: '', name: 'P1' }],
      [{ id: 'p1', name: '' }],
      [{ id: 1, name: 'P1' }],
      [{ id: 'p1', name: 2 }],
    ]
    for (const roster of cases) {
      expect(parseStoredState({ ...wire(validPlayers), players: roster })).toBeNull()
    }
  })

  it('rejects duplicate ids', () => {
    const dupes = [
      { id: 'p1', name: 'A' },
      { id: 'p1', name: 'B' },
    ]
    expect(parseStoredState({ ...wire(validPlayers), players: dupes })).toBeNull()
  })
})

describe('parseStoredState — rejects a malformed topic set', () => {
  it('rejects a non-array or empty topicIds', () => {
    for (const bad of [null, undefined, 'locations', 3, {}, []]) {
      expect(parseStoredState({ ...wire(validHome), topicIds: bad })).toBeNull()
    }
  })

  it('rejects unknown or non-string topic ids', () => {
    for (const bad of [['locations', 'nope'], ['locations', 2], ['']]) {
      expect(parseStoredState({ ...wire(validHome), topicIds: bad })).toBeNull()
    }
  })

  it('rejects duplicate topic ids', () => {
    expect(
      parseStoredState({ ...wire(validHome), topicIds: [ALL_TOPICS[0], ALL_TOPICS[0]] }),
    ).toBeNull()
  })
})

describe('parseStoredState — rejects a malformed timer', () => {
  const cases: Record<string, unknown> = {
    'non-record': 'later',
    'non-boolean running': { endsAt: null, remainingMs: 0, running: 'yes' },
    'non-number remainingMs': { endsAt: null, remainingMs: '0', running: false },
    'NaN remainingMs': { endsAt: null, remainingMs: Number.NaN, running: false },
    'Infinity remainingMs': {
      endsAt: null,
      remainingMs: Number.POSITIVE_INFINITY,
      running: false,
    },
    'non-finite endsAt': {
      endsAt: Number.NaN,
      remainingMs: 0,
      running: false,
    },
    'string endsAt': { endsAt: '1000', remainingMs: 0, running: false },
    'running with null endsAt': { endsAt: null, remainingMs: 10, running: true },
  }

  for (const [label, timer] of Object.entries(cases)) {
    it(`rejects a timer with ${label}`, () => {
      expect(parseStoredState({ ...wire(validHome), timer })).toBeNull()
    })
  }
})

describe('parseStoredState — rejects a malformed spy set', () => {
  it('rejects a non-array spyIds', () => {
    for (const bad of [null, undefined, 'p1', 3, { 0: 'p1' }]) {
      expect(parseStoredState({ ...wire(validReveal), spyIds: bad })).toBeNull()
    }
  })

  it('rejects entries that are not non-empty strings', () => {
    for (const bad of [['p1', 2], [''], [null], [{ id: 'p1' }]]) {
      expect(parseStoredState({ ...wire(validReveal), spyIds: bad })).toBeNull()
    }
  })

  it('rejects duplicate spy ids', () => {
    expect(
      parseStoredState({ ...wire(validReveal), spyIds: [SPY_IDS[0], SPY_IDS[0]] }),
    ).toBeNull()
  })
})

describe('parseStoredState — rejects malformed scalars', () => {
  it('rejects a non-string, non-null wordId', () => {
    expect(parseStoredState({ ...wire(validHome), wordId: 3 })).toBeNull()
  })

  it('rejects a revealIndex that is not a non-negative integer', () => {
    for (const revealIndex of [-1, 1.5, '0', Number.NaN, null]) {
      expect(parseStoredState({ ...wire(validHome), revealIndex })).toBeNull()
    }
  })

  it('rejects a spyCount that is not an integer of at least 1', () => {
    for (const spyCount of [0, -1, 1.5, '1', Number.NaN, null, undefined, 13]) {
      expect(parseStoredState({ ...wire(validHome), spyCount })).toBeNull()
    }
  })
})

describe('parseStoredState — cross-field consistency', () => {
  it('rejects an empty or roster-foreign spy set once a round is live', () => {
    const foreign = SPY_IDS.map((id) => `${id}-gone`)
    expect(parseStoredState({ ...wire(validReveal), spyIds: [] })).toBeNull()
    expect(parseStoredState({ ...wire(validReveal), spyIds: foreign })).toBeNull()
  })

  it('rejects a live round whose spy set size no longer matches spyCount', () => {
    const extra = Array.from(
      { length: validReveal.spyCount + 1 },
      (_, i) => `p${i + 1}`,
    )
    expect(parseStoredState({ ...wire(validReveal), spyIds: extra })).toBeNull()
    expect(parseStoredState({ ...wire(validReveal), spyCount: validReveal.spyCount + 1 })).toBeNull()
  })

  it('clamps nothing here: a pre-round session keeps a spyCount above the roster', () => {
    // The Players screen pulls it back into range on load; persistence lets it through.
    const parsed = parseStoredState({ ...wire(validPlayers), spyCount: 5 })
    expect(parsed?.spyCount).toBe(5)
  })

  it('rejects a missing or unknown word once a round is live', () => {
    expect(parseStoredState({ ...wire(validReveal), wordId: null })).toBeNull()
    expect(parseStoredState({ ...wire(validReveal), wordId: 'atlantis' })).toBeNull()
  })

  it('rejects a leftover spy set on a pre-round screen', () => {
    expect(parseStoredState({ ...wire(validTopics), spyIds: ['p1'] })).toBeNull()
  })

  it('tolerates a kept last word on a pre-round screen but not an unknown one', () => {
    const kept = parseStoredState({ ...wire(validTopics), wordId: KNOWN_WORD })
    expect(kept?.wordId).toBe(KNOWN_WORD)
    expect(parseStoredState({ ...wire(validTopics), wordId: 'atlantis' })).toBeNull()
  })

  it('rejects a revealIndex past the roster while revealing', () => {
    expect(
      parseStoredState({ ...wire(validReveal), revealIndex: ROUND_ROSTER }),
    ).toBeNull()
    expect(
      parseStoredState({ ...wire(validReveal), revealIndex: ROUND_ROSTER + 50 }),
    ).toBeNull()
  })

  it('tolerates a large revealIndex once past the reveal phase', () => {
    const parsed = parseStoredState({ ...wire(validDiscussion), revealIndex: 50 })
    expect(parsed?.phase).toBe('discussion')
  })

  it('still allows an empty spy set and null word on the home screen', () => {
    expect(parseStoredState(wire(validHome))).toEqual(validHome)
  })

  it('discards a v2 session with no topic set', () => {
    const v2 = wire(validReveal)
    delete v2.topicIds
    v2.version = 2
    expect(parseStoredState(v2)).toBeNull()
  })

  it('discards a v1 session that still carries the old scalar spyId', () => {
    const v1 = { ...wire(validReveal), version: 1, spyIds: undefined, spyId: 'p2' }
    expect(parseStoredState(v1)).toBeNull()
  })
})

const SAVED_AT = 1_700_000_000_000

/** The envelope as it sits in storage: a state plus when it was written. */
function session(state: GameState, savedAt = SAVED_AT): Record<string, unknown> {
  return { savedAt, state: wire(state) }
}

/** What survives once only the setup lifetime is left. */
function setupOf(state: GameState): GameState {
  return {
    ...initialState,
    players: state.players,
    topicIds: state.topicIds,
    spyCount: state.spyCount,
  }
}

describe('parseStoredSession — the round lifetime', () => {
  it('resumes a round saved moments ago', () => {
    expect(parseStoredSession(session(validReveal), SAVED_AT + 1000)).toEqual(validReveal)
  })

  it('resumes a round right up to the last millisecond of its lifetime', () => {
    expect(parseStoredSession(session(validReveal), SAVED_AT + ROUND_TTL_MS)).toEqual(
      validReveal,
    )
  })

  it('drops the round but keeps the setup once the round lifetime passes', () => {
    for (const state of [validReveal, validDiscussion, validEnded]) {
      const parsed = parseStoredSession(session(state), SAVED_AT + ROUND_TTL_MS + 1)
      expect(parsed).toEqual(setupOf(state))
      // No role, no word and no timer may survive the phone being put down.
      expect(parsed?.phase).toBe('home')
      expect(parsed?.spyIds).toEqual([])
      expect(parsed?.wordId).toBeNull()
    }
  })

  it('keeps the roster, topics and spy count that an expired round was using', () => {
    const parsed = parseStoredSession(session(validReveal), SAVED_AT + ROUND_TTL_MS + 1)
    expect(parsed?.players).toEqual(validReveal.players)
    expect(parsed?.topicIds).toEqual(validReveal.topicIds)
    expect(parsed?.spyCount).toBe(validReveal.spyCount)
  })
})

describe('parseStoredSession — the setup lifetime', () => {
  it('keeps the setup right up to the last millisecond of its lifetime', () => {
    expect(parseStoredSession(session(validPlayers), SAVED_AT + SETUP_TTL_MS)).toEqual(
      setupOf(validPlayers),
    )
  })

  it('discards everything once the setup lifetime passes', () => {
    for (const state of [validPlayers, validTopics, validReveal]) {
      expect(parseStoredSession(session(state), SAVED_AT + SETUP_TTL_MS + 1)).toBeNull()
    }
  })
})

describe('parseStoredSession — rejects malformed envelopes', () => {
  it('rejects a missing or non-numeric savedAt', () => {
    for (const savedAt of [undefined, null, 'now', NaN, Infinity]) {
      expect(
        parseStoredSession({ savedAt, state: wire(validReveal) }, SAVED_AT),
      ).toBeNull()
    }
  })

  it('rejects a savedAt in the future, because the clock moved', () => {
    expect(parseStoredSession(session(validReveal), SAVED_AT - 1)).toBeNull()
  })

  it('rejects a bare state that is not wrapped in an envelope', () => {
    expect(parseStoredSession(wire(validReveal), SAVED_AT)).toBeNull()
  })

  it('rejects an envelope whose state is malformed', () => {
    expect(parseStoredSession({ savedAt: SAVED_AT, state: { version: 999 } }, SAVED_AT))
      .toBeNull()
  })
})

describe('loadState / saveState', () => {
  const memory = new Map<string, string>()

  afterEach(() => {
    memory.clear()
    vi.unstubAllGlobals()
  })

  function useFakeStorage() {
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => (memory.has(k) ? memory.get(k) : null),
      setItem: (k: string, v: string) => void memory.set(k, v),
      removeItem: (k: string) => void memory.delete(k),
    })
  }

  it('loads a previously saved session', () => {
    useFakeStorage()
    saveState(validDiscussion, SAVED_AT)
    expect(loadState(SAVED_AT + 1000)).toEqual(validDiscussion)
  })

  it('loads a session saved and read with the real clock', () => {
    useFakeStorage()
    saveState(validDiscussion)
    expect(loadState()).toEqual(validDiscussion)
  })

  it('boots home with the setup intact half an hour later', () => {
    useFakeStorage()
    saveState(validReveal, SAVED_AT)
    expect(loadState(SAVED_AT + ROUND_TTL_MS + 1)).toEqual(setupOf(validReveal))
  })

  it('boots clean three days later', () => {
    useFakeStorage()
    saveState(validReveal, SAVED_AT)
    expect(loadState(SAVED_AT + SETUP_TTL_MS + 1)).toEqual(initialState)
  })

  it('restarts the setup lifetime on every save', () => {
    useFakeStorage()
    saveState(validPlayers, SAVED_AT)
    // Three days minus an hour later the group plays again, which rewrites the
    // stored timestamp; another three days are then counted from there.
    const secondSave = SAVED_AT + SETUP_TTL_MS - 60 * 60 * 1000
    saveState(validPlayers, secondSave)
    expect(loadState(SAVED_AT + SETUP_TTL_MS + 1000)).toEqual(setupOf(validPlayers))
    expect(loadState(secondSave + SETUP_TTL_MS + 1)).toEqual(initialState)
  })

  it('falls back to initialState when storage is empty', () => {
    useFakeStorage()
    expect(loadState()).toEqual(initialState)
  })

  it('falls back to initialState when the stored blob is corrupt', () => {
    useFakeStorage()
    memory.set(STORAGE_KEY, JSON.stringify({ version: 999 }))
    expect(loadState()).toEqual(initialState)
  })
})
