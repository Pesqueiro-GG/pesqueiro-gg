import { Atkinson_Hyperlegible, Big_Shoulders } from 'next/font/google'

// Self-hosted at build time by next/font; globals.css maps them to --font-display and --font-body.
// Google Fonts now ships Big Shoulders Display as "Big Shoulders" with an optical-size axis.
export const displayFont = Big_Shoulders({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  display: 'swap',
  variable: '--font-big-shoulders',
  // next/font has no metrics for it yet; the fallback stack in globals.css covers the gap.
  adjustFontFallback: false,
})

export const bodyFont = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-atkinson',
})
