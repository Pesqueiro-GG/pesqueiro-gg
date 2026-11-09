import { expect, test } from '@playwright/test'

test('home page loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('img', { name: 'Pesqueiro.GG' }).first()).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
