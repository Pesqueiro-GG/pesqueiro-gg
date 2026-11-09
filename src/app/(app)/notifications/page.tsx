import { getTranslations } from 'next-intl/server'
import { Placeholder } from '@/ui/Placeholder'

export default async function NotificationsPage() {
  const t = await getTranslations('placeholders')
  return <Placeholder title={t('notifications.title')} note={t('notifications.note')} icon="bell" />
}
