import { cx } from './cx'

export type AvatarProps = {
  /** The person's display name; also the tooltip and the source of the initials. */
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZES = {
  sm: 'size-8 text-[13px]',
  md: 'size-10 text-[15px]',
  lg: 'size-16 text-[22px]',
}

/** Initials from the first two words of a display name. */
export function initials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase() || '?'
  )
}

/** A person's photo, or their initials on water-soft when there is no photo. */
export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  return (
    <span
      title={name}
      className={cx(
        'inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-water-soft font-bold text-water',
        SIZES[size],
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- photos come from our own storage, already resized
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        <span aria-hidden="true">{initials(name)}</span>
      )}
    </span>
  )
}
