import { pickRandom } from './random'
import { TOPICS } from './topics'

/**
 * Every word id across every topic, in topic order. The display string for
 * each lives in the `words` i18n namespace, keyed by id.
 */
export const WORD_IDS: readonly string[] = TOPICS.flatMap((topic) =>
  topic.words.map((word) => word.id),
)

/** Word id → its hint id, built once from `TOPICS`. */
const HINT_BY_WORD_ID: ReadonlyMap<string, string> = new Map(
  TOPICS.flatMap((topic) => topic.words.map((word) => [word.id, word.hintId] as const)),
)

export function isKnownWordId(id: string): boolean {
  return WORD_IDS.includes(id)
}

/**
 * The adjective shown to the spy for a word — a key into the `hints`
 * namespace. `null` for an unknown id, matching how `pickWordId` shrugs off
 * ids it doesn't recognise; a live round's `wordId` is always known.
 */
export function hintIdForWord(wordId: string): string | null {
  return HINT_BY_WORD_ID.get(wordId) ?? null
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
