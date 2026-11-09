'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cx } from './cx'
import { Icon, type IconName } from './Icon'

export type NavDestination = 'feed' | 'album' | 'log' | 'challenges' | 'profile'

export const NAV_ITEMS: ReadonlyArray<{ id: NavDestination; href: string; icon: IconName }> = [
  { id: 'feed', href: '/', icon: 'house' },
  { id: 'album', href: '/album', icon: 'book-open' },
  { id: 'log', href: '/log', icon: 'plus' },
  { id: 'challenges', href: '/challenges', icon: 'trophy' },
  { id: 'profile', href: '/profile', icon: 'user' },
]

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * The five destinations, with Log as the raised bobber button. A bar fixed at the bottom on
 * phones; a side rail from 1024 px.
 */
export function BottomNav() {
  const t = useTranslations('nav')
  const pathname = usePathname()

  return (
    <nav
      aria-label={t('main')}
      className={cx(
        'fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface',
        'px-1 pt-1.5 pb-[calc(6px+env(safe-area-inset-bottom,0px))]',
        'lg:inset-x-auto lg:top-0 lg:left-0 lg:w-24 lg:border-t-0 lg:border-r lg:pt-24 lg:pb-6',
      )}
    >
      <ul className="mx-auto grid max-w-[480px] grid-cols-5 items-end lg:max-w-none lg:grid-cols-1 lg:items-stretch lg:gap-2">
        {NAV_ITEMS.map((item) => {
          const label = t(item.id)
          if (item.id === 'log') {
            return (
              <li key={item.id} className="lg:order-first lg:mb-4">
                <Link
                  href={item.href}
                  className="grid min-h-tap justify-items-center gap-0.5 rounded-sm py-1.5 text-caption font-bold text-ink no-underline"
                >
                  <span className="-mt-[22px] grid size-[52px] place-items-center rounded-full bg-bobber text-on-bobber shadow-float lg:mt-0">
                    <Icon name="plus" size={26} />
                  </span>
                  <span>{label}</span>
                </Link>
              </li>
            )
          }
          const active = isActive(pathname, item.href)
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cx(
                  'grid min-h-tap justify-items-center gap-0.5 rounded-sm py-1.5 text-caption font-bold no-underline',
                  active ? 'text-water' : 'text-ink-muted hover:text-ink',
                )}
              >
                <Icon name={item.icon} size={22} />
                <span>{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
