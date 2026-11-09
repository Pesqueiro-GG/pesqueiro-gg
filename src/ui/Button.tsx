import type { ButtonHTMLAttributes } from 'react'
import { cx } from './cx'
import { Icon, type IconName } from './Icon'

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'danger'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  icon?: IconName
  size?: 'md' | 'sm'
  full?: boolean
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-transparent font-body text-[15px] leading-[1.2] font-bold whitespace-nowrap no-underline cursor-pointer transition-[background-color,transform] duration-150 ease-out motion-reduce:transition-none active:enabled:translate-y-px disabled:cursor-default disabled:opacity-50 focus-visible:shadow-focus focus-visible:outline-none'

export const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-bobber text-on-bobber hover:enabled:bg-bobber-hover',
  secondary: 'bg-surface text-ink border-line-strong hover:enabled:bg-surface-sunken',
  text: 'bg-transparent text-water px-3 hover:enabled:bg-water-soft',
  danger: 'bg-surface text-bobber-text border-bobber-text hover:enabled:bg-bobber-soft',
}

const SIZES = {
  md: 'min-h-tap px-5',
  sm: 'min-h-9 px-4 text-label',
}

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  full = false,
  className,
}: Pick<ButtonProps, 'variant' | 'size' | 'full' | 'className'> = {}): string {
  // The text variant keeps its narrower padding at every size.
  const sizeClasses = variant === 'text' ? SIZES[size].replace(/px-\d/, '') : SIZES[size]
  return cx(BASE, sizeClasses, BUTTON_VARIANTS[variant], full && 'w-full', className)
}

/** Pill button. One primary per view; everything else secondary or text. */
export function Button({
  variant = 'primary',
  icon,
  size = 'md',
  full = false,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses({ variant, size, full, className })} {...rest}>
      {icon ? <Icon name={icon} size={size === 'sm' ? 16 : 18} /> : null}
      {children}
    </button>
  )
}
