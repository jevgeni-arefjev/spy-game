/**
 * Keeps the browser's UI chrome in step with the theme by pushing the resolved
 * `--color-bg` into `<meta name="theme-color">`. Reading the custom property
 * rather than hardcoding a value keeps every colour inside `tokens.css`.
 */
export function syncThemeColor(): () => void {
  const apply = () => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-bg')
      .trim()
    if (value === '') return

    let meta = document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (meta === null) {
      meta = document.createElement('meta')
      meta.name = 'theme-color'
      document.head.appendChild(meta)
    }
    meta.content = value
  }

  apply()

  const scheme = window.matchMedia('(prefers-color-scheme: dark)')
  scheme.addEventListener('change', apply)
  return () => scheme.removeEventListener('change', apply)
}
