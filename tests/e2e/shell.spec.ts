import { expect, test, type Page } from '@playwright/test'

const TABS = [
  { label: 'Feed', path: '/', heading: 'Feed' },
  { label: 'Álbum', path: '/album', heading: 'Álbum' },
  { label: 'Registrar', path: '/log', heading: 'Registrar peixe' },
  { label: 'Desafios', path: '/challenges', heading: 'Desafios' },
  { label: 'Perfil', path: '/profile', heading: 'Perfil' },
]

test.use({ locale: 'pt-BR' })

async function noSidewaysScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
}

test('the navigation reaches all five tabs', async ({ page }) => {
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Principal' })
  await expect(nav.getByRole('link')).toHaveCount(5)

  for (const tab of TABS) {
    await nav.getByRole('link', { name: tab.label }).click()
    await expect(page).toHaveURL(tab.path)
    await expect(page.getByRole('heading', { level: 1, name: tab.heading })).toBeVisible()
    await noSidewaysScroll(page)
  }
  await expect(nav.getByRole('link', { name: 'Perfil' })).toHaveAttribute('aria-current', 'page')
})

test('on a phone, the bar sits at the bottom with the Log button raised in bobber red', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'mobile', 'phone layout only')
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Principal' })
  const navBox = await nav.boundingBox()
  const viewport = page.viewportSize()
  expect(navBox && viewport && Math.round(navBox.y + navBox.height)).toBe(viewport?.height)

  const logButton = nav.getByRole('link', { name: 'Registrar' }).locator('span').first()
  const [logBox, feedBox] = await Promise.all([
    logButton.boundingBox(),
    nav.getByRole('link', { name: 'Feed' }).boundingBox(),
  ])
  expect(logBox!.y).toBeLessThan(feedBox!.y)
  const [fill, bobber] = await logButton.evaluate((el) => [
    getComputedStyle(el).backgroundColor,
    getComputedStyle(document.documentElement).getPropertyValue('--bobber').trim(),
  ])
  expect(fill).toBe(hexToRgb(bobber))
})

test('on a desktop, the navigation moves to a side rail', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'desktop layout only')
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/')
  const box = await page.getByRole('navigation', { name: 'Principal' }).boundingBox()
  expect(box!.x).toBe(0)
  expect(box!.height).toBe(800)
})

test('the dark theme survives a reload without flashing light', async ({ page }) => {
  await page.goto('/settings')
  await page.getByLabel('Tema').selectOption('dark')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  // The attribute must already be in the server's HTML, before any script runs.
  const response = await page.request.get('/album')
  expect(await response.text()).toMatch(/<html[^>]*data-theme="dark"/)

  for (const path of ['/', '/album', '/log', '/challenges', '/profile', '/settings']) {
    await page.goto(path)
    const bg = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor)
    expect(bg, path).toBe('rgb(12, 26, 29)') // --bg dark, #0c1a1d
  }

  await page.goto('/settings')
  await page.getByLabel('Tema').selectOption('light')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('keyboard focus shows the ring on every nav item', async ({ page }) => {
  await page.goto('/')
  const links = page.getByRole('navigation', { name: 'Principal' }).getByRole('link')
  for (let i = 0; i < 5; i++) {
    const link = links.nth(i)
    await link.focus()
    await page.keyboard.press('Shift+Tab')
    await page.keyboard.press('Tab')
    await expect(link).toBeFocused()
    const shadow = await link.evaluate((el) => getComputedStyle(el).boxShadow)
    expect(shadow).not.toBe('none')
  }
})

function hexToRgb(hex: string) {
  const n = Number.parseInt(hex.replace('#', ''), 16)
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`
}
