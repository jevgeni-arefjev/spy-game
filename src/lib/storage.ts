/**
 * The app's only door to persistent storage.
 *
 * Two reasons nothing else touches `localStorage` directly:
 *  - it throws in private mode and on quota-exceeded, and a party game must
 *    never die because of that;
 *  - this app is meant to be wrapped in a native shell (Capacitor) later,
 *    where this implementation gets swapped for a native preferences plugin.
 */

function getBackend(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    return null
  }
}

/** Read and JSON-parse a key. Returns null for missing, unreadable or corrupt values. */
export function get(key: string): unknown {
  const backend = getBackend()
  if (backend === null) return null
  try {
    const raw = backend.getItem(key)
    return raw === null ? null : (JSON.parse(raw) as unknown)
  } catch {
    return null
  }
}

/** JSON-serialise and write a key. Silently no-ops if storage is unavailable or full. */
export function set(key: string, value: unknown): void {
  const backend = getBackend()
  if (backend === null) return
  try {
    backend.setItem(key, JSON.stringify(value))
  } catch {
    /* private mode or quota exceeded — the session just won't survive a reload */
  }
}

/** Remove a key. Silently no-ops if storage is unavailable. */
export function clear(key: string): void {
  const backend = getBackend()
  if (backend === null) return
  try {
    backend.removeItem(key)
  } catch {
    /* nothing sensible to do */
  }
}
