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
    const all = TOPICS.flatMap((topic) => topic.words.map((word) => word.id))
    expect(new Set(all).size).toBe(all.length)
  })

  it('accounts for exactly the words in WORD_IDS', () => {
    const all = TOPICS.flatMap((topic) => topic.words.map((word) => word.id))
    expect(new Set(all)).toEqual(new Set(WORD_IDS))
  })

  it('gives every topic a handful of words to draw from', () => {
    for (const topic of TOPICS) {
      expect(topic.words.length).toBeGreaterThanOrEqual(5)
    }
  })

  it('runs every topic on exactly two hint adjectives', () => {
    for (const topic of TOPICS) {
      const hintIds = new Set(topic.words.map((word) => word.hintId))
      expect(hintIds.size).toBe(2)
    }
  })

  it('has hint ids that are camel-or-lowercase', () => {
    const hintIds = TOPICS.flatMap((topic) => topic.words.map((word) => word.hintId))
    for (const id of hintIds) expect(id).toMatch(/^[a-z][a-zA-Z]*$/)
  })
})

describe('isKnownTopicId', () => {
  it('is true for every seed id', () => {
    for (const { id } of TOPICS) expect(isKnownTopicId(id)).toBe(true)
  })

  it('is false for anything else', () => {
    for (const id of ['', 'gadgets', 'LOCATIONS', 'locations ']) {
      expect(isKnownTopicId(id)).toBe(false)
    }
  })
})

describe('wordIdsForTopics', () => {
  it('flattens the selected topics only, in topic order', () => {
    const ids = TOPICS[0].words.map((word) => word.id)
    expect(wordIdsForTopics([TOPICS[0].id])).toEqual(ids)
  })

  it('de-duplicates and ignores unknown topic ids', () => {
    const pool = wordIdsForTopics([TOPICS[0].id, TOPICS[0].id, 'nope'])
    expect(pool).toEqual(TOPICS[0].words.map((word) => word.id))
  })

  it('covers the whole word list when every topic is selected', () => {
    expect(new Set(wordIdsForTopics(ALL_TOPIC_IDS))).toEqual(new Set(WORD_IDS))
  })

  it('returns nothing for an empty selection', () => {
    expect(wordIdsForTopics([])).toEqual([])
  })
})
