import { getTranslations } from 'next-intl/server'
import { Placeholder } from '@/ui/Placeholder'

// The feed arrives with S-11; until then, the tab's placeholder.
export default async function FeedPage() {
  const t = await getTranslations('placeholders')
  return <Placeholder title={t('feed.title')} note={t('feed.note')} icon="house" />
}
