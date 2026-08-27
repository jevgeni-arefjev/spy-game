import { pickRandom } from './random'

export type WordEntry = {
  /** Key into the `words` i18n namespace. The display string lives there. */
  id: string
}

export const WORDS: readonly WordEntry[] = [
  { id: 'beach' },
  { id: 'hospital' },
  { id: 'airport' },
  { id: 'restaurant' },
  { id: 'school' },
]

export function isKnownWordId(id: string): boolean {
  return WORDS.some((word) => word.id === id)
}

/**
 * Pick a word, avoiding the previous round's word so a group playing again
 * never gets the same one twice in a row.
 */
export function pickWordId(excludeId: string | null): string {
  const candidates = WORDS.filter((word) => word.id !== excludeId)
  const pool = candidates.length > 0 ? candidates : WORDS
  return pickRandom(pool).id
}
