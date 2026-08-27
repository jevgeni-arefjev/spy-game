import { describe, it, expect } from 'vitest'
import { createId, pickRandom, pickSample } from './random'

describe('createId', () => {
  it('returns a non-empty string', () => {
    const id = createId()
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
  })

  it('does not collide across many calls', () => {
    const ids = new Set(Array.from({ length: 2_000 }, () => createId()))
    expect(ids.size).toBe(2_000)
  })
})

describe('pickRandom', () => {
  it('throws on an empty list', () => {
    expect(() => pickRandom([])).toThrow(/empty/)
  })

  it('always returns a member of the list', () => {
    const items = ['a', 'b', 'c', 'd']
    for (let i = 0; i < 500; i++) {
      expect(items).toContain(pickRandom(items))
    }
  })

  it('always returns the sole element of a one-item list', () => {
    for (let i = 0; i < 50; i++) {
      expect(pickRandom(['only'])).toBe('only')
    }
  })

  it('can reach every element over enough draws', () => {
    const items = [0, 1, 2, 3, 4]
    const seen = new Set<number>()
    for (let i = 0; i < 1_000 && seen.size < items.length; i++) {
      seen.add(pickRandom(items))
    }
    expect(seen.size).toBe(items.length)
  })

  it('does not mutate the source list', () => {
    const items = ['x', 'y', 'z']
    const copy = [...items]
    for (let i = 0; i < 100; i++) pickRandom(items)
    expect(items).toEqual(copy)
  })
})

describe('pickSample', () => {
  const pool = ['a', 'b', 'c', 'd', 'e']

  it('returns exactly count distinct members of the pool', () => {
    for (let i = 0; i < 500; i++) {
      const drawn = pickSample(pool, 3)
      expect(drawn).toHaveLength(3)
      expect(new Set(drawn).size).toBe(3)
      for (const item of drawn) expect(pool).toContain(item)
    }
  })

  it('handles the degenerate ends: zero and the whole pool', () => {
    expect(pickSample(pool, 0)).toEqual([])
    const all = pickSample(pool, pool.length)
    expect([...all].sort()).toEqual([...pool].sort())
  })

  it('throws when asked for more than the pool holds, or a negative count', () => {
    expect(() => pickSample(pool, pool.length + 1)).toThrow()
    expect(() => pickSample(pool, -1)).toThrow()
    expect(() => pickSample([], 1)).toThrow()
  })

  it('does not mutate the source list', () => {
    const copy = [...pool]
    for (let i = 0; i < 200; i++) pickSample(pool, 2)
    expect(pool).toEqual(copy)
  })

  it('can reach every member as part of a sample over enough draws', () => {
    const seen = new Set<string>()
    for (let i = 0; i < 1_000 && seen.size < pool.length; i++) {
      for (const item of pickSample(pool, 2)) seen.add(item)
    }
    expect(seen.size).toBe(pool.length)
  })

  it('spreads pairs around rather than always drawing the same two', () => {
    const pairs = new Set<string>()
    for (let i = 0; i < 1_000; i++) {
      pairs.add([...pickSample(pool, 2)].sort().join('-'))
    }
    // 5 choose 2 is 10; over 1000 draws we expect to see most of them.
    expect(pairs.size).toBeGreaterThan(5)
  })
})
