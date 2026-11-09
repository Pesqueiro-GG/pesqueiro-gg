import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { buttonClasses } from '@/ui/Button'
import { Placeholder } from '@/ui/Placeholder'

export default async function ProfilePage() {
  const [t, nav] = await Promise.all([getTranslations('placeholders'), getTranslations('nav')])
  return (
    <Placeholder title={t('profile.title')} note={t('profile.note')} icon="user">
      <Link href="/settings" className={buttonClasses({ variant: 'secondary' })}>
        {nav('settings')}
      </Link>
    </Placeholder>
  )
}
