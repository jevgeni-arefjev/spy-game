import { pickRandom } from './random'
import { TOPICS } from './topics'

/**
 * Every word id across every topic, in topic order. The display string for
 * each lives in the `words` i18n namespace, keyed by id.
 */
export const WORD_IDS: readonly string[] = TOPICS.flatMap((topic) => [...topic.wordIds])

export function isKnownWordId(id: string): boolean {
  return WORD_IDS.includes(id)
}

/**
 * Pick a word from `candidateIds`, avoiding `excludeId` so a group playing
 * again never gets the same word twice in a row. If excluding would leave the
 * pool empty (a single-word topic played back to back), fall back to the full
 * candidate list.
 */
export function pickWordId(
  candidateIds: readonly string[],
  excludeId: string | null,
): string {
  const pool = candidateIds.filter((id) => id !== excludeId)
  const source = pool.length > 0 ? pool : candidateIds
  return pickRandom(source)
}
