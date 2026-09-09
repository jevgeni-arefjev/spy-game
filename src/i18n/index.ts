import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as storage from '../lib/storage'

export const FALLBACK_LOCALE = 'en'
export const DEFAULT_NAMESPACE = 'common'

/** The chosen language outlives the session, like the roster and the topics. */
export const LOCALE_STORAGE_KEY = 'spy:locale:v1'

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

/** A stored locale is only honoured while a folder for it still ships. */
function storedLocale(): string | null {
  const value = storage.get(LOCALE_STORAGE_KEY)
  return typeof value === 'string' && SUPPORTED_LOCALES.includes(value) ? value : null
}

/** The document's own language, kept in step so screen readers and hyphenation follow. */
function syncDocumentLanguage(locale: string): void {
  document.documentElement.lang = locale
}

/**
 * Switch the app's language and remember it. The only way the locale ever
 * changes - nothing else writes `LOCALE_STORAGE_KEY`.
 */
export function setLocale(locale: string): void {
  if (!SUPPORTED_LOCALES.includes(locale)) return
  storage.set(LOCALE_STORAGE_KEY, locale)
  syncDocumentLanguage(locale)
  void i18n.changeLanguage(locale)
}

/** The locale one press of the language piece moves to, wrapping at the end. */
export function nextLocale(locale: string): string {
  const index = SUPPORTED_LOCALES.indexOf(locale)
  return SUPPORTED_LOCALES[(index + 1) % SUPPORTED_LOCALES.length]
}

/** The language's name in itself ("English", "Русский"), for the switch's label. */
export function localeName(locale: string): string {
  return i18n.getFixedT(locale, DEFAULT_NAMESPACE)('language.name')
}

const initialLocale = storedLocale() ?? FALLBACK_LOCALE

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLocale,
  fallbackLng: FALLBACK_LOCALE,
  defaultNS: DEFAULT_NAMESPACE,
  fallbackNS: DEFAULT_NAMESPACE,
  interpolation: {
    // React escapes for us.
    escapeValue: false,
  },
})

syncDocumentLanguage(initialLocale)

export default i18n
