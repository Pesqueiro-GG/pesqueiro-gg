import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { BottomNav } from '@/ui/BottomNav'
import { Icon } from '@/ui/Icon'
import { Logo } from '@/ui/Logo'

/** The app shell: header, one 640 px column, and the bottom bar (a side rail on desktop). */
export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const t = await getTranslations('nav')
  return (
    <div className="min-h-dvh bg-bg text-ink lg:pl-24">
      <header className="sticky top-0 z-10 border-b border-line bg-surface pt-[env(safe-area-inset-top,0px)]">
        <div className="mx-auto flex h-14 max-w-content items-center justify-between px-4">
          <Link href="/" className="rounded-sm no-underline">
            <Logo size={32} />
          </Link>
          <Link
            href="/notifications"
            aria-label={t('notifications')}
            className="grid size-tap place-items-center rounded-full text-ink hover:bg-surface-sunken"
          >
            <Icon name="bell" size={22} />
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-content px-4 pt-6 pb-[calc(96px+env(safe-area-inset-bottom,0px))] lg:pb-12">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
