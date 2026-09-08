import { describe, it, expect } from 'vitest'
import { createRoundSetup } from './round'
import { ALL_TOPIC_IDS } from './topics'

// spyCount is a plain runtime argument now, not a build-time constant: whatever
// the Players screen puts in `GameState.spyCount` is what a round draws.
const ALL_TOPICS = [...ALL_TOPIC_IDS]

function roster(n: number) {
  return Array.from({ length: n }, (_, i) => ({ id: `p${i + 1}`, name: `P${i + 1}` }))
}

describe('createRoundSetup with a runtime spyCount', () => {
  it('draws that many distinct spies from the roster', () => {
    const players = roster(5)
    const ids = new Set(players.map((p) => p.id))
    for (const spyCount of [2, 3]) {
      for (let i = 0; i < 300; i++) {
        const { spyIds } = createRoundSetup(players, ALL_TOPICS, null, spyCount)
        expect(spyIds).toHaveLength(spyCount)
        expect(new Set(spyIds).size).toBe(spyCount)
        for (const id of spyIds) expect(ids.has(id)).toBe(true)
      }
    }
  })

  it('can make every player a spy when spyCount equals the roster size', () => {
    const players = roster(4)
    const { spyIds } = createRoundSetup(players, ALL_TOPICS, null, players.length)
    expect(new Set(spyIds)).toEqual(new Set(players.map((p) => p.id)))
  })

  it('can put the spy pair on any two players over many rounds', () => {
    const players = roster(4)
    const seen = new Set<string>()
    for (let i = 0; i < 500 && seen.size < players.length; i++) {
      for (const id of createRoundSetup(players, ALL_TOPICS, null, 2).spyIds) seen.add(id)
    }
    expect(seen.size).toBe(players.length)
  })
})
