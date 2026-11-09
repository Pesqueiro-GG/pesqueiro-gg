import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'
import { LOCALE_COOKIE, TIME_ZONE, resolveLocale } from '@/shared/i18n'

// next-intl "without i18n routing": no locale in the URL. The cookie wins, then Accept-Language.
export default getRequestConfig(async () => {
  const [cookieStore, headerList] = await Promise.all([cookies(), headers()])
  const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value, headerList.get('accept-language'))

  return {
    locale,
    timeZone: TIME_ZONE,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
