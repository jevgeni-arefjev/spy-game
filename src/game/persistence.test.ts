import { afterEach, describe, it, expect, vi } from 'vitest'
import {
  clearState,
  loadState,
  parseStoredState,
  saveState,
} from './persistence'
import { initialState } from './reducer'
import { DISCUSSION_SECONDS, STATE_VERSION, STORAGE_KEY } from './config'
import { WORDS } from './words'
import type { GameState } from './types'

const DISCUSSION_MS = DISCUSSION_SECONDS * 1000
const KNOWN_WORD = WORDS[0].id

function players(n: number) {
  return Array.from({ length: n }, (_, i) => ({ id: `p${i + 1}`, name: `P${i + 1}` }))
}

const validSetup: GameState = {
  version: STATE_VERSION,
  phase: 'setup',
  players: players(2),
  spyId: null,
  wordId: null,
  revealIndex: 0,
  revealStep: 'handoff',
  timer: { endsAt: null, remainingMs: DISCUSSION_MS, running: false },
}

const validReveal: GameState = {
  ...validSetup,
  phase: 'reveal',
  players: players(3),
  spyId: 'p2',
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
    for (const state of [validSetup, validReveal, validDiscussion, validEnded]) {
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
    for (const bad of [null, undefined, 42, 'x', true, [], [validSetup]]) {
      expect(parseStoredState(bad)).toBeNull()
    }
  })

  it('rejects a version mismatch', () => {
    for (const version of [0, STATE_VERSION + 1, '1', null, undefined]) {
      expect(parseStoredState({ ...wire(validSetup), version })).toBeNull()
    }
  })

  it('rejects an unknown phase', () => {
    for (const phase of ['lobby', '', 42, null]) {
      expect(parseStoredState({ ...wire(validSetup), phase })).toBeNull()
    }
  })

  it('rejects an unknown reveal step', () => {
    for (const revealStep of ['flipped', '', 1, null]) {
      expect(parseStoredState({ ...wire(validSetup), revealStep })).toBeNull()
    }
  })
})

describe('parseStoredState — rejects malformed players', () => {
  it('rejects a non-array roster', () => {
    for (const bad of [null, {}, 'p1,p2', 3]) {
      expect(parseStoredState({ ...wire(validSetup), players: bad })).toBeNull()
    }
  })

  it('rejects a roster past MAX_PLAYERS', () => {
    expect(parseStoredState({ ...wire(validSetup), players: players(13) })).toBeNull()
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
    for (const players of cases) {
      expect(parseStoredState({ ...wire(validSetup), players })).toBeNull()
    }
  })

  it('rejects duplicate ids', () => {
    const dupes = [
      { id: 'p1', name: 'A' },
      { id: 'p1', name: 'B' },
    ]
    expect(parseStoredState({ ...wire(validSetup), players: dupes })).toBeNull()
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
      expect(parseStoredState({ ...wire(validSetup), timer })).toBeNull()
    })
  }
})

describe('parseStoredState — rejects malformed scalars', () => {
  it('rejects a non-string, non-null spyId', () => {
    expect(parseStoredState({ ...wire(validSetup), spyId: 3 })).toBeNull()
  })

  it('rejects a non-string, non-null wordId', () => {
    expect(parseStoredState({ ...wire(validSetup), wordId: 3 })).toBeNull()
  })

  it('rejects a revealIndex that is not a non-negative integer', () => {
    for (const revealIndex of [-1, 1.5, '0', Number.NaN, null]) {
      expect(parseStoredState({ ...wire(validSetup), revealIndex })).toBeNull()
    }
  })
})

describe('parseStoredState — cross-field consistency for in-progress rounds', () => {
  it('rejects a missing or unknown spy once past setup', () => {
    expect(parseStoredState({ ...wire(validReveal), spyId: null })).toBeNull()
    expect(parseStoredState({ ...wire(validReveal), spyId: 'ghost' })).toBeNull()
  })

  it('rejects a missing or unknown word once past setup', () => {
    expect(parseStoredState({ ...wire(validReveal), wordId: null })).toBeNull()
    expect(parseStoredState({ ...wire(validReveal), wordId: 'library' })).toBeNull()
  })

  it('rejects a revealIndex past the roster while revealing', () => {
    expect(parseStoredState({ ...wire(validReveal), revealIndex: 3 })).toBeNull()
    expect(parseStoredState({ ...wire(validReveal), revealIndex: 99 })).toBeNull()
  })

  it('tolerates a large revealIndex once past the reveal phase', () => {
    const parsed = parseStoredState({ ...wire(validDiscussion), revealIndex: 50 })
    expect(parsed?.phase).toBe('discussion')
  })

  it('still allows a null spy and word during setup', () => {
    expect(parseStoredState(wire(validSetup))).toEqual(validSetup)
  })
})

describe('loadState / saveState / clearState', () => {
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
    saveState(validDiscussion)
    expect(loadState()).toEqual(validDiscussion)
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

  it('clearState removes the session', () => {
    useFakeStorage()
    saveState(validEnded)
    clearState()
    expect(memory.has(STORAGE_KEY)).toBe(false)
    expect(loadState()).toEqual(initialState)
  })
})
