'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { LOCALE_COOKIE, LOCALES, isLocale } from '@/shared/i18n/locale'

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
    <div>
      <label htmlFor="language">{t('label')}</label>
      <p id="language-description">{t('description')}</p>
      <select
        id="language"
        aria-describedby="language-description"
        value={current}
        disabled={pending}
        onChange={(event) => choose(event.target.value)}
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
