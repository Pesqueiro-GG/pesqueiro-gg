'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { LOCALE_COOKIE, LOCALES, isLocale } from '@/shared/i18n/locale'
import { SELECT_CLASSES } from './select'

const ONE_YEAR = 60 * 60 * 24 * 365

/**
 * Sets the NEXT_LOCALE cookie and re-renders the page on the server in the new language. The
 * cookie only holds a language code, so no server write is needed.
 */
export function LanguageSwitch({ current }: { current: string }) {
  const t = useTranslations('settings.language')
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function choose(value: string) {
    if (!isLocale(value)) return
    document.cookie = `${LOCALE_COOKIE}=${value}; path=/; max-age=${ONE_YEAR}; samesite=lax`
    startTransition(() => router.refresh())
  }

  return (
    <div className="grid gap-1">
      <label htmlFor="language" className="text-label font-bold">
        {t('label')}
      </label>
      <p id="language-description" className="text-small text-ink-muted">
        {t('description')}
      </p>
      <select
        id="language"
        aria-describedby="language-description"
        value={current}
        disabled={pending}
        onChange={(event) => choose(event.target.value)}
        className={SELECT_CLASSES}
      >
        {LOCALES.map((locale) => (
          <option key={locale} value={locale} lang={locale}>
            {t(`options.${locale}`)}
          </option>
        ))}
      </select>
    </div>
  )
}
