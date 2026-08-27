/** Stable-enough unique id for a player row. */
export function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** Pick one item at random. Throws on an empty list — callers must guard. */
export function pickRandom<T>(items: readonly T[]): T {
  if (items.length === 0) {
    throw new Error('pickRandom: empty list')
  }
  return items[Math.floor(Math.random() * items.length)]
}
