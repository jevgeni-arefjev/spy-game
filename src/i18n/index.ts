import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export const FALLBACK_LOCALE = 'en'
export const DEFAULT_NAMESPACE = 'common'

/**
 * Every `locales/<locale>/<namespace>.json` is picked up automatically, so
 * adding a language is a matter of dropping in a folder — the only line here
 * that ever needs touching is `FALLBACK_LOCALE`.
 */
const localeFiles: Record<string, unknown> = import.meta.glob('./locales/*/*.json', {
  eager: true,
  import: 'default',
})

const LOCALE_PATH = /^\.\/locales\/([^/]+)\/([^/]+)\.json$/

function buildResources() {
  const resources: Record<string, Record<string, object>> = {}

  for (const [path, contents] of Object.entries(localeFiles)) {
    const match = LOCALE_PATH.exec(path)
    if (match === null || typeof contents !== 'object' || contents === null) continue

    const [, locale, namespace] = match
    resources[locale] ??= {}
    resources[locale][namespace] = contents
  }

  return resources
}

const resources = buildResources()

export const SUPPORTED_LOCALES = Object.keys(resources).sort()

void i18n.use(initReactI18next).init({
  resources,
  lng: FALLBACK_LOCALE,
  fallbackLng: FALLBACK_LOCALE,
  defaultNS: DEFAULT_NAMESPACE,
  fallbackNS: DEFAULT_NAMESPACE,
  interpolation: {
    // React escapes for us.
    escapeValue: false,
  },
})

export default i18n
