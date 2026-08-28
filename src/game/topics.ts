/**
 * Topics are the sets of words a round can draw from. The player picks which
 * ones are in play on the topics screen; at least one is always included.
 *
 * This module is the single source of truth for both the topic list and the
 * word list — `words.ts` derives its flat pool from `TOPICS`.
 */

export type Topic = {
  /** Key into the `topics` i18n namespace. The display name lives there. */
  id: string
  /** Keys into the `words` i18n namespace. Unique across every topic. */
  wordIds: readonly string[]
}

export const TOPICS: readonly Topic[] = [
  {
    id: 'locations',
    wordIds: [
      'beach',
      'hospital',
      'airport',
      'restaurant',
      'school',
      'casino',
      'museum',
      'cinema',
      'gym',
      'library',
      'hotel',
      'zoo',
      'bank',
      'stadium',
    ],
  },
  {
    id: 'professions',
    wordIds: [
      'doctor',
      'teacher',
      'chef',
      'pilot',
      'firefighter',
      'lawyer',
      'farmer',
      'journalist',
      'photographer',
      'mechanic',
      'nurse',
      'soldier',
      'barber',
      'scientist',
    ],
  },
  {
    id: 'food',
    wordIds: [
      'pizza',
      'sushi',
      'pancakes',
      'iceCream',
      'coffee',
      'burger',
      'salad',
      'chocolate',
      'soup',
      'cheese',
      'popcorn',
      'honey',
      'watermelon',
      'pasta',
    ],
  },
  {
    id: 'entertainment',
    wordIds: [
      'chess',
      'karaoke',
      'concert',
      'circus',
      'videoGame',
      'fishing',
      'camping',
      'dancing',
      'magicShow',
      'boardGame',
      'rollerCoaster',
      'football',
      'poker',
      'painting',
    ],
  },
  {
    id: 'travel',
    wordIds: [
      'airplane',
      'train',
      'cruiseShip',
      'subway',
      'bicycle',
      'taxi',
      'hotAirBalloon',
      'motorcycle',
      'ferry',
      'camper',
      'helicopter',
      'sailboat',
      'bus',
      'scooter',
    ],
  },
]

/** Every topic id, in canonical order. The default selection is all of them. */
export const ALL_TOPIC_IDS: readonly string[] = TOPICS.map((topic) => topic.id)

export function isKnownTopicId(id: string): boolean {
  return TOPICS.some((topic) => topic.id === id)
}

/**
 * Flat, de-duplicated word pool for the given topics, in topic order. Unknown
 * ids are ignored, so a stale selection can never crash a draw.
 */
export function wordIdsForTopics(topicIds: readonly string[]): string[] {
  const selected = new Set(topicIds)
  const pool: string[] = []
  const seen = new Set<string>()
  for (const topic of TOPICS) {
    if (!selected.has(topic.id)) continue
    for (const wordId of topic.wordIds) {
      if (seen.has(wordId)) continue
      seen.add(wordId)
      pool.push(wordId)
    }
  }
  return pool
}
