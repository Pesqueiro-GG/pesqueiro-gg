import { getTranslations } from 'next-intl/server'
import { Placeholder } from '@/ui/Placeholder'

export default async function AlbumPage() {
  const t = await getTranslations('placeholders')
  return <Placeholder title={t('album.title')} note={t('album.note')} icon="book-open" />
}
