import { getLocale, getTranslations } from 'next-intl/server'
import { LanguageSwitch } from './language-switch'

// Settings stub: only the language for now. The theme switch arrives with #6.
export default async function SettingsPage() {
  const [t, locale] = await Promise.all([getTranslations('settings'), getLocale()])
  return (
    <main>
      <h1>{t('title')}</h1>
      <LanguageSwitch current={locale} />
    </main>
  )
}
