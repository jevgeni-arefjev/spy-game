import { describe, it, expect } from 'vitest'
import { WORDS, isKnownWordId, pickWordId } from './words'

describe('WORDS', () => {
  it('has the seed set with unique, non-empty ids', () => {
    expect(WORDS).toHaveLength(5)
    const ids = WORDS.map((w) => w.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[a-z]+$/)
  })
})

describe('isKnownWordId', () => {
  it('is true for every seed id', () => {
    for (const { id } of WORDS) expect(isKnownWordId(id)).toBe(true)
  })

  it('is false for anything not in the list', () => {
    for (const id of ['', 'library', 'BEACH', 'beach ']) {
      expect(isKnownWordId(id)).toBe(false)
    }
  })
})

describe('pickWordId', () => {
  it('returns a known id when nothing is excluded', () => {
    for (let i = 0; i < 200; i++) {
      expect(isKnownWordId(pickWordId(null))).toBe(true)
    }
  })

  it('never repeats the excluded id', () => {
    for (const { id: exclude } of WORDS) {
      for (let i = 0; i < 200; i++) {
        const picked = pickWordId(exclude)
        expect(picked).not.toBe(exclude)
        expect(isKnownWordId(picked)).toBe(true)
      }
    }
  })

  it('still returns a valid id when the exclusion is unknown', () => {
    for (let i = 0; i < 100; i++) {
      expect(isKnownWordId(pickWordId('not-a-word'))).toBe(true)
    }
  })

  it('can reach every other id given one exclusion', () => {
    const exclude = WORDS[0].id
    const seen = new Set<string>()
    for (let i = 0; i < 500 && seen.size < WORDS.length - 1; i++) {
      seen.add(pickWordId(exclude))
    }
    expect(seen.size).toBe(WORDS.length - 1)
  })
})
