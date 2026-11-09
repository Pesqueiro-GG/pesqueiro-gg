import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

// Placeholder until the app shell (#6) and the first screens arrive.
export default async function HomePage() {
  const t = await getTranslations('home')
  return (
    <main>
      <h1>{t('title')}</h1>
      <p>{t('underConstruction')}</p>
      <p>
        <Link href="/settings">{t('openSettings')}</Link>
      </p>
    </main>
  )
}
