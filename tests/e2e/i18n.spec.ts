import { expect, test } from '@playwright/test'

test.describe('interface language', () => {
  test('a Portuguese browser sees Portuguese', async ({ browser }) => {
    const context = await browser.newContext({
      locale: 'pt-BR',
      extraHTTPHeaders: { 'Accept-Language': 'pt-BR' },
    })
    const page = await context.newPage()
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR')
    await expect(page.getByText('Em construção para o Hack Brasil 2026.')).toBeVisible()
    await context.close()
  })

  test('a French browser sees English', async ({ browser }) => {
    const context = await browser.newContext({
      locale: 'fr-FR',
      extraHTTPHeaders: { 'Accept-Language': 'fr-FR,fr;q=0.9' },
    })
    const page = await context.newPage()
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByText('Under construction for Hack Brasil 2026.')).toBeVisible()
    await context.close()
  })

  test('switching the language in Settings changes every string and survives a reload', async ({
    browser,
  }) => {
    const context = await browser.newContext({ locale: 'pt-BR' })
    const page = await context.newPage()
    await page.goto('/settings')
    await expect(page.getByRole('heading', { name: 'Configurações' })).toBeVisible()

    await page.getByLabel('Idioma').selectOption('en')
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
    await expect(page.getByLabel('Language')).toHaveValue('en')

    await page.reload()
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
    await page.goto('/')
    await expect(page.getByText('Under construction for Hack Brasil 2026.')).toBeVisible()
    await context.close()
  })
})
