/**
 * Topics are the sets of words a round can draw from. The player picks which
 * ones are in play on the topics screen; at least one is always included.
 *
 * This module is the single source of truth for the topic list, the word list
 * *and* the spy hint for each word — `words.ts` derives its flat pool and its
 * `hintIdForWord` lookup from `TOPICS`. Every topic runs on one binary
 * adjective axis (Travel → fast/slow), so the spy's hint rules out about half
 * the pool without naming the word.
 */

export type TopicWord = {
  /** Key into the `words` i18n namespace. Unique across every topic. */
  id: string
  /** Key into the `hints` namespace. One of the topic's two adjectives. */
  hintId: string
}

export type Topic = {
  /** Key into the `topics` i18n namespace. The display name lives there. */
  id: string
  /** Its words, each tagged with which side of the topic's axis it sits on. */
  words: readonly TopicWord[]
}

export const TOPICS: readonly Topic[] = [
  {
    id: 'locations',
    words: [
      { id: 'beach', hintId: 'quiet' },
      { id: 'hospital', hintId: 'quiet' },
      { id: 'airport', hintId: 'loud' },
      { id: 'restaurant', hintId: 'loud' },
      { id: 'school', hintId: 'loud' },
      { id: 'casino', hintId: 'loud' },
      { id: 'museum', hintId: 'quiet' },
      { id: 'cinema', hintId: 'quiet' },
      { id: 'gym', hintId: 'loud' },
      { id: 'library', hintId: 'quiet' },
      { id: 'hotel', hintId: 'quiet' },
      { id: 'zoo', hintId: 'loud' },
      { id: 'bank', hintId: 'quiet' },
      { id: 'stadium', hintId: 'loud' },
    ],
  },
  {
    id: 'professions',
    words: [
      { id: 'doctor', hintId: 'safe' },
      { id: 'teacher', hintId: 'safe' },
      { id: 'chef', hintId: 'safe' },
      { id: 'pilot', hintId: 'risky' },
      { id: 'firefighter', hintId: 'risky' },
      { id: 'lawyer', hintId: 'safe' },
      { id: 'farmer', hintId: 'risky' },
      { id: 'journalist', hintId: 'risky' },
      { id: 'photographer', hintId: 'safe' },
      { id: 'mechanic', hintId: 'risky' },
      { id: 'nurse', hintId: 'safe' },
      { id: 'soldier', hintId: 'risky' },
      { id: 'barber', hintId: 'safe' },
      { id: 'scientist', hintId: 'safe' },
    ],
  },
  {
    id: 'food',
    words: [
      { id: 'pizza', hintId: 'hot' },
      { id: 'sushi', hintId: 'cold' },
      { id: 'pancakes', hintId: 'hot' },
      { id: 'iceCream', hintId: 'cold' },
      { id: 'coffee', hintId: 'hot' },
      { id: 'burger', hintId: 'hot' },
      { id: 'salad', hintId: 'cold' },
      { id: 'chocolate', hintId: 'cold' },
      { id: 'soup', hintId: 'hot' },
      { id: 'cheese', hintId: 'cold' },
      { id: 'popcorn', hintId: 'hot' },
      { id: 'honey', hintId: 'cold' },
      { id: 'watermelon', hintId: 'cold' },
      { id: 'pasta', hintId: 'hot' },
    ],
  },
  {
    id: 'entertainment',
    words: [
      { id: 'chess', hintId: 'relaxing' },
      { id: 'karaoke', hintId: 'active' },
      { id: 'concert', hintId: 'active' },
      { id: 'circus', hintId: 'active' },
      { id: 'videoGame', hintId: 'relaxing' },
      { id: 'fishing', hintId: 'relaxing' },
      { id: 'camping', hintId: 'active' },
      { id: 'dancing', hintId: 'active' },
      { id: 'magicShow', hintId: 'relaxing' },
      { id: 'boardGame', hintId: 'relaxing' },
      { id: 'rollerCoaster', hintId: 'active' },
      { id: 'football', hintId: 'active' },
      { id: 'poker', hintId: 'relaxing' },
      { id: 'painting', hintId: 'relaxing' },
    ],
  },
  {
    id: 'travel',
    words: [
      { id: 'airplane', hintId: 'fast' },
      { id: 'train', hintId: 'fast' },
      { id: 'cruiseShip', hintId: 'slow' },
      { id: 'subway', hintId: 'fast' },
      { id: 'bicycle', hintId: 'slow' },
      { id: 'taxi', hintId: 'fast' },
      { id: 'hotAirBalloon', hintId: 'slow' },
      { id: 'motorcycle', hintId: 'fast' },
      { id: 'ferry', hintId: 'slow' },
      { id: 'camper', hintId: 'slow' },
      { id: 'helicopter', hintId: 'fast' },
      { id: 'sailboat', hintId: 'slow' },
      { id: 'bus', hintId: 'slow' },
      { id: 'scooter', hintId: 'slow' },
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
    for (const word of topic.words) {
      if (seen.has(word.id)) continue
      seen.add(word.id)
      pool.push(word.id)
    }
  }
  return pool
}
