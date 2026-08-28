import { describe, it, expect } from 'vitest'
import {
  ALL_TOPIC_IDS,
  TOPICS,
  isKnownTopicId,
  wordIdsForTopics,
} from './topics'
import { WORD_IDS } from './words'

describe('TOPICS', () => {
  it('has unique topic ids, mirrored by ALL_TOPIC_IDS', () => {
    const ids = TOPICS.map((topic) => topic.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect([...ALL_TOPIC_IDS]).toEqual(ids)
    for (const id of ids) expect(id).toMatch(/^[a-z]+$/)
  })

  it('has word ids that are unique across every topic', () => {
    const all = TOPICS.flatMap((topic) => [...topic.wordIds])
    expect(new Set(all).size).toBe(all.length)
  })

  it('accounts for exactly the words in WORD_IDS', () => {
    const all = TOPICS.flatMap((topic) => [...topic.wordIds])
    expect(new Set(all)).toEqual(new Set(WORD_IDS))
  })

  it('gives every topic a handful of words to draw from', () => {
    for (const topic of TOPICS) {
      expect(topic.wordIds.length).toBeGreaterThanOrEqual(5)
    }
  })
})

describe('isKnownTopicId', () => {
  it('is true for every seed id', () => {
    for (const { id } of TOPICS) expect(isKnownTopicId(id)).toBe(true)
  })

  it('is false for anything else', () => {
    for (const id of ['', 'sports', 'LOCATIONS', 'locations ']) {
      expect(isKnownTopicId(id)).toBe(false)
    }
  })
})

describe('wordIdsForTopics', () => {
  it('flattens the selected topics only, in topic order', () => {
    expect(wordIdsForTopics([TOPICS[0].id])).toEqual([...TOPICS[0].wordIds])
  })

  it('de-duplicates and ignores unknown topic ids', () => {
    const pool = wordIdsForTopics([TOPICS[0].id, TOPICS[0].id, 'nope'])
    expect(pool).toEqual([...TOPICS[0].wordIds])
  })

  it('covers the whole word list when every topic is selected', () => {
    expect(new Set(wordIdsForTopics(ALL_TOPIC_IDS))).toEqual(new Set(WORD_IDS))
  })

  it('returns nothing for an empty selection', () => {
    expect(wordIdsForTopics([])).toEqual([])
  })
})
