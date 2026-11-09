'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { THEME_COOKIE, THEMES, type Theme, parseTheme, themeAttribute } from '@/ui/theme'
import { SELECT_CLASSES } from './select'

const ONE_YEAR = 60 * 60 * 24 * 365

/**
 * Saves the theme in a cookie (the root layout reads it on the server, so the next load paints
 * in the right theme) and applies it to the open page right away.
 */
export function ThemeSwitch({ current }: { current: Theme }) {
  const t = useTranslations('settings.theme')
  const [theme, setTheme] = useState(current)

  function choose(value: string) {
    const next = parseTheme(value)
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=${ONE_YEAR}; samesite=lax`
    const attribute = themeAttribute(next)
    if (attribute) document.documentElement.dataset.theme = attribute
    else delete document.documentElement.dataset.theme
    setTheme(next)
  }

  return (
    <div className="grid gap-1">
      <label htmlFor="theme" className="text-label font-bold">
        {t('label')}
      </label>
      <select
        id="theme"
        value={theme}
        onChange={(event) => choose(event.target.value)}
        className={SELECT_CLASSES}
      >
        {THEMES.map((option) => (
          <option key={option} value={option}>
            {t(`options.${option}`)}
          </option>
        ))}
      </select>
    </div>
  )
}
