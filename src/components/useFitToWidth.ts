import { useLayoutEffect, useRef } from 'react'

/**
 * Shrinks one line of display type until it fits the column it is printed in.
 *
 * A wordmark is stamped at one size in the artwork, but the plate is not the
 * same width in every language or on every phone: "Spy" at the full 7rem fits
 * a 320px screen, "Шпион" does not. The size in CSS is therefore a *maximum* -
 * this measures the line at that size and scales it down by the ratio it
 * overflows by, which is exact because text width is linear in font size. A
 * line that already fits is left alone at the stamped size.
 *
 * Measuring means measuring what the player will actually see, so the fit is
 * redone when the box resizes and again once the display face has loaded -
 * before that, the line is laid out in the fallback and comes out the wrong
 * width.
 */
export function useFitToWidth<T extends HTMLElement>(text: string) {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const element = ref.current
    const container = element?.parentElement
    if (element == null || container == null) return

    const fit = () => {
      // Back to the stamped size first: the natural width has to be measured
      // from the maximum, not from whatever the last fit left behind.
      element.style.fontSize = ''
      const available = container.clientWidth
      const natural = element.scrollWidth
      if (available === 0 || natural <= available) return

      const stamped = parseFloat(getComputedStyle(element).fontSize)
      element.style.fontSize = `${(stamped * available) / natural}px`
    }

    fit()

    // Only a change in width can change the fit, and refitting on the height
    // this fit just changed would be a loop.
    let lastWidth = container.clientWidth
    const observer = new ResizeObserver(() => {
      if (container.clientWidth === lastWidth) return
      lastWidth = container.clientWidth
      fit()
    })
    observer.observe(container)
    void document.fonts?.ready.then(fit)

    return () => observer.disconnect()
  }, [text])

  return ref
}
