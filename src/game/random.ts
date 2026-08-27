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

/**
 * Pick `count` distinct items at random, order not significant. Throws if the
 * pool is too small. A partial Fisher–Yates shuffle over a copy, so each subset
 * is equally likely and the input is left untouched.
 */
export function pickSample<T>(items: readonly T[], count: number): T[] {
  if (count < 0 || count > items.length) {
    throw new Error(`pickSample: cannot draw ${count} from ${items.length}`)
  }
  const pool = [...items]
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(Math.random() * (pool.length - i))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count)
}
