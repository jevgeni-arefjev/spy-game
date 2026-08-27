import { describe, it, expect, vi } from 'vitest'

// Prove SPY_COUNT is a real switch: with the config mocked to 2, an untouched
// createRoundSetup must produce two spies and nothing else has to change.
vi.mock('./config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./config')>()
  return { ...actual, SPY_COUNT: 2 }
})

const { createRoundSetup } = await import('./round')
const { SPY_COUNT } = await import('./config')

function roster(n: number) {
  return Array.from({ length: n }, (_, i) => ({ id: `p${i + 1}`, name: `P${i + 1}` }))
}

describe('createRoundSetup with SPY_COUNT = 2', () => {
  it('sees the mocked value', () => {
    expect(SPY_COUNT).toBe(2)
  })

  it('draws two distinct spies from the roster', () => {
    const players = roster(5)
    const ids = new Set(players.map((p) => p.id))
    for (let i = 0; i < 300; i++) {
      const { spyIds } = createRoundSetup(players, null)
      expect(spyIds).toHaveLength(2)
      expect(new Set(spyIds).size).toBe(2)
      for (const id of spyIds) expect(ids.has(id)).toBe(true)
    }
  })

  it('can put the spy pair on any two players over many rounds', () => {
    const players = roster(4)
    const seen = new Set<string>()
    for (let i = 0; i < 500 && seen.size < players.length; i++) {
      for (const id of createRoundSetup(players, null).spyIds) seen.add(id)
    }
    expect(seen.size).toBe(players.length)
  })
})
