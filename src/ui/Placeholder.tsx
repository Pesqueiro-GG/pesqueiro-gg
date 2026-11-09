import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

/** A screen that isn't built yet: its title and a short note, in the empty-state style. */
export function Placeholder({
  title,
  note,
  icon,
  children,
}: {
  title: string
  note: string
  icon: IconName
  children?: ReactNode
}) {
  return (
    <section className="grid gap-6">
      <h1 className="font-display text-display font-extrabold">{title}</h1>
      <div className="grid justify-items-center gap-3 rounded-lg bg-sea-shallow px-4 py-12 text-center">
        <span className="text-sea-deep">
          <Icon name={icon} size={40} />
        </span>
        <p className="max-w-[32ch] text-ink">{note}</p>
        {children}
      </div>
    </section>
  )
}
