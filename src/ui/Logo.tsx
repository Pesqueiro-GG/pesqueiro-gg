import { cx } from './cx'

export type LogoProps = {
  variant?: 'full' | 'mark'
  /** The mark's height in px; the wordmark scales with it. Keep it at 24 or more. */
  size?: number
  className?: string
}

/** The bobber mark, drawn with fixed brand tokens so it reads in both themes. */
function Mark({ size }: { size: number }) {
  return (
    <svg
      className="logo-mark block overflow-visible"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse className="fill-none stroke-water" strokeWidth={2.5} cx={32} cy={47} rx={25} ry={6} />
      <g transform="rotate(-12 32 37)">
        <rect className="fill-mark-cream" x={30.5} y={9} width={3} height={16} rx={1.5} />
        <path className="fill-bobber" d="M19 37a13 13 0 0 1 26 0Z" />
        <path className="fill-mark-cream" d="M19 37a13 13 0 0 0 26 0Z" />
        <rect className="fill-mark-band" x={18.2} y={35.9} width={27.6} height={2.4} rx={1.2} />
        <path
          className="fill-none stroke-mark-cream opacity-70"
          strokeWidth={2}
          strokeLinecap="round"
          d="M24.5 32a8.5 8.5 0 0 1 5-5.5"
        />
      </g>
    </svg>
  )
}

/** The Pesqueiro.GG logo: the bobber mark, alone or with the wordmark. */
export function Logo({ variant = 'full', size = 40, className }: LogoProps) {
  if (variant === 'mark') {
    return (
      <span role="img" aria-label="Pesqueiro.GG" className={cx('logo inline-flex items-center', className)}>
        <Mark size={size} />
      </span>
    )
  }
  return (
    <span
      role="img"
      aria-label="Pesqueiro.GG"
      className={cx('logo inline-flex items-center gap-[0.2em] text-ink', className)}
      style={{ fontSize: `${Math.round(size * 0.78)}px` }}
    >
      <Mark size={size} />
      <span aria-hidden="true" className="font-display leading-none font-extrabold tracking-[0.005em]">
        Pesqueiro<span className="text-water">.GG</span>
      </span>
    </span>
  )
}
