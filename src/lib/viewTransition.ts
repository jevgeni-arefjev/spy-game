/**
 * The browser's own cross-fade between two states of the document.
 *
 * `startViewTransition` is what lets one phase be lifted off while the next
 * comes up under it without ever mounting both screens at once: the browser
 * snapshots what is on screen, the update runs, and the two are animated
 * against each other. Where it is missing the phase simply swaps, which is the
 * behaviour the app had before — every piece on the new screen still settles
 * into place on its own.
 *
 * `update` is held open until the caller's promise settles, because a React
 * commit does not happen inside the call that schedules it.
 */
type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void | Promise<void>) => unknown
}

export function startViewTransition(update: () => Promise<void>): boolean {
  const start = (document as ViewTransitionDocument).startViewTransition
  if (typeof start !== 'function') return false

  start.call(document, update)
  return true
}
