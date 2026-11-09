import { getTranslations } from 'next-intl/server'
import { Placeholder } from '@/ui/Placeholder'

export default async function ChallengesPage() {
  const t = await getTranslations('placeholders')
  return <Placeholder title={t('challenges.title')} note={t('challenges.note')} icon="trophy" />
}
