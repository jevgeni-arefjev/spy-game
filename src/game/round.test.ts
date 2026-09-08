import { describe, it, expect } from 'vitest'
import { createRoundSetup } from './round'
import { ALL_TOPIC_IDS, wordIdsForTopics } from './topics'
import { isKnownWordId, WORD_IDS } from './words'
import type { Player } from './types'

const ALL_TOPICS = [...ALL_TOPIC_IDS]

function roster(n: number): Player[] {
  return Array.from({ length: n }, (_, i) => ({ id: `p${i + 1}`, name: `P${i + 1}` }))
}

describe('createRoundSetup', () => {
  it('draws exactly spyCount distinct spies, all from the roster', () => {
    const players = roster(6)
    const ids = new Set(players.map((p) => p.id))
    for (const spyCount of [1, 2, 3]) {
      for (let i = 0; i < 200; i++) {
        const { spyIds } = createRoundSetup(players, ALL_TOPICS, null, spyCount)
        expect(spyIds).toHaveLength(spyCount)
        expect(new Set(spyIds).size).toBe(spyCount)
        for (const id of spyIds) expect(ids.has(id)).toBe(true)
      }
    }
  })

  it('always picks a known word', () => {
    for (let i = 0; i < 300; i++) {
      expect(isKnownWordId(createRoundSetup(roster(3), ALL_TOPICS, null, 1).wordId)).toBe(true)
    }
  })

  it('never repeats the previous word', () => {
    for (const previous of WORD_IDS) {
      for (let i = 0; i < 40; i++) {
        expect(createRoundSetup(roster(3), ALL_TOPICS, previous, 1).wordId).not.toBe(previous)
      }
    }
  })

  it('only ever draws a word from the selected topics', () => {
    const selected = ['food']
    const pool = new Set(wordIdsForTopics(selected))
    for (let i = 0; i < 300; i++) {
      expect(pool.has(createRoundSetup(roster(3), selected, null, 1).wordId)).toBe(true)
    }
  })

  it('spreads the spy across the whole roster over many rounds', () => {
    const players = roster(4)
    const seen = new Set<string>()
    for (let i = 0; i < 500 && seen.size < players.length; i++) {
      for (const id of createRoundSetup(players, ALL_TOPICS, null, 1).spyIds) seen.add(id)
    }
    expect(seen.size).toBe(players.length)
  })
})
