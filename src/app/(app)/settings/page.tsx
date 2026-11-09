import { getLocale, getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { THEME_COOKIE, parseTheme } from '@/ui/theme'
import { LanguageSwitch } from './language-switch'
import { ThemeSwitch } from './theme-switch'

// Settings stub: language and theme for now.
export default async function SettingsPage() {
  const [t, locale, cookieStore] = await Promise.all([getTranslations('settings'), getLocale(), cookies()])
  return (
    <section className="grid gap-6">
      <h1 className="font-display text-display font-extrabold">{t('title')}</h1>
      <div className="grid gap-6 rounded-md bg-surface p-4 shadow-card">
        <LanguageSwitch current={locale} />
        <ThemeSwitch current={parseTheme(cookieStore.get(THEME_COOKIE)?.value)} />
      </div>
    </section>
  )
}
