import { describe, it, expect } from 'vitest'
import { WORD_IDS, isKnownWordId, pickWordId } from './words'

describe('WORD_IDS', () => {
  it('is a non-empty list of unique, camel-or-lowercase ids', () => {
    expect(WORD_IDS.length).toBeGreaterThan(0)
    expect(new Set(WORD_IDS).size).toBe(WORD_IDS.length)
    for (const id of WORD_IDS) expect(id).toMatch(/^[a-z][a-zA-Z]*$/)
  })
})

describe('isKnownWordId', () => {
  it('is true for every id', () => {
    for (const id of WORD_IDS) expect(isKnownWordId(id)).toBe(true)
  })

  it('is false for anything not in the list', () => {
    for (const id of ['', 'atlantis', 'BEACH', 'beach ']) {
      expect(isKnownWordId(id)).toBe(false)
    }
  })
})

describe('pickWordId', () => {
  it('returns a known id when nothing is excluded', () => {
    for (let i = 0; i < 200; i++) {
      expect(isKnownWordId(pickWordId(WORD_IDS, null))).toBe(true)
    }
  })

  it('never repeats the excluded id', () => {
    for (const exclude of WORD_IDS) {
      for (let i = 0; i < 20; i++) {
        const picked = pickWordId(WORD_IDS, exclude)
        expect(picked).not.toBe(exclude)
        expect(isKnownWordId(picked)).toBe(true)
      }
    }
  })

  it('only ever returns an id from the candidate list', () => {
    const candidates = ['beach', 'hospital', 'airport']
    for (let i = 0; i < 200; i++) {
      expect(candidates).toContain(pickWordId(candidates, null))
    }
  })

  it('falls back to the candidate list when excluding would empty it', () => {
    expect(pickWordId(['beach'], 'beach')).toBe('beach')
  })

  it('still returns a valid id when the exclusion is not a candidate', () => {
    for (let i = 0; i < 100; i++) {
      expect(isKnownWordId(pickWordId(WORD_IDS, 'not-a-word'))).toBe(true)
    }
  })

  it('can reach every other candidate given one exclusion', () => {
    const candidates = ['beach', 'hospital', 'airport', 'restaurant', 'school']
    const exclude = candidates[0]
    const seen = new Set<string>()
    for (let i = 0; i < 500 && seen.size < candidates.length - 1; i++) {
      seen.add(pickWordId(candidates, exclude))
    }
    expect(seen.size).toBe(candidates.length - 1)
  })
})
