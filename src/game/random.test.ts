import { describe, it, expect } from 'vitest'
import { createId, pickRandom } from './random'

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
