import { getTranslations } from 'next-intl/server'
import { Placeholder } from '@/ui/Placeholder'

export default async function LogPage() {
  const t = await getTranslations('placeholders')
  return <Placeholder title={t('log.title')} note={t('log.note')} icon="plus" />
}
