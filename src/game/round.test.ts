import { describe, it, expect } from 'vitest'
import { createRoundSetup } from './round'
import { isKnownWordId, WORDS } from './words'
import type { Player } from './types'

function roster(n: number): Player[] {
  return Array.from({ length: n }, (_, i) => ({ id: `p${i + 1}`, name: `P${i + 1}` }))
}

describe('createRoundSetup', () => {
  it('always names a spy from the roster', () => {
    const players = roster(5)
    const ids = new Set(players.map((p) => p.id))
    for (let i = 0; i < 300; i++) {
      const setup = createRoundSetup(players, null)
      expect(ids.has(setup.spyId)).toBe(true)
    }
  })

  it('always picks a known word', () => {
    for (let i = 0; i < 300; i++) {
      expect(isKnownWordId(createRoundSetup(roster(3), null).wordId)).toBe(true)
    }
  })

  it('never repeats the previous word', () => {
    for (const { id: previous } of WORDS) {
      for (let i = 0; i < 100; i++) {
        expect(createRoundSetup(roster(3), previous).wordId).not.toBe(previous)
      }
    }
  })

  it('spreads the spy across the whole roster over many rounds', () => {
    const players = roster(4)
    const seen = new Set<string>()
    for (let i = 0; i < 500 && seen.size < players.length; i++) {
      seen.add(createRoundSetup(players, null).spyId)
    }
    expect(seen.size).toBe(players.length)
  })
})
