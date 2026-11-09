import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { THEME_COOKIE, parseTheme, themeAttribute } from '@/ui/theme'
import { bodyFont, displayFont } from './fonts'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('common')
  return { title: t('appName'), description: t('tagline') }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [locale, cookieStore] = await Promise.all([getLocale(), cookies()])
  // Set on the server, so a dark theme never flashes light first.
  const theme = themeAttribute(parseTheme(cookieStore.get(THEME_COOKIE)?.value))
  return (
    <html lang={locale} data-theme={theme} className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
