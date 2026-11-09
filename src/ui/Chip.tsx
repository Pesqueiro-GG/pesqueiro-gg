import type { HTMLAttributes, MouseEventHandler } from 'react'
import { cx } from './cx'
import { Icon, type IconName } from './Icon'

export type ChipTone = 'neutral' | 'water' | 'bobber' | 'reed' | 'gold'

export type ChipProps = Omit<HTMLAttributes<HTMLElement>, 'onClick'> & {
  tone?: ChipTone
  icon?: IconName
  /** Makes the chip a toggle button; the selected chip inverts to ink. */
  selected?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const TONES: Record<ChipTone, string> = {
  neutral: 'bg-surface-sunken text-ink',
  water: 'bg-water-soft text-water',
  bobber: 'bg-bobber-soft text-bobber-text',
  reed: 'bg-reed-soft text-reed',
  gold: 'bg-gold-soft text-gold-text',
}

const BASE =
  'inline-flex items-center gap-1.5 min-h-8 px-3 rounded-full border-[1.5px] border-transparent font-body text-label leading-[1.2] font-bold whitespace-nowrap'

/** A small pill for filters, tip categories and short facts. */
export function Chip({ tone = 'neutral', icon, selected, onClick, className, children, ...rest }: ChipProps) {
  const content = (
    <>
      {icon ? <Icon name={icon} size={16} /> : null}
      {children}
    </>
  )
  const clickable = onClick !== undefined || selected !== undefined
  const classes = cx(BASE, selected ? 'bg-ink text-surface' : TONES[tone], className)

  if (!clickable) {
    return (
      <span className={classes} {...rest}>
        {content}
      </span>
    )
  }
  return (
    <button
      type="button"
      aria-pressed={Boolean(selected)}
      onClick={onClick}
      className={cx(
        classes,
        'min-h-tap cursor-pointer focus-visible:shadow-focus focus-visible:outline-none',
      )}
      {...rest}
    >
      {content}
    </button>
  )
}
