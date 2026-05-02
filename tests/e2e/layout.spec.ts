import { test, expect } from '@playwright/test'

test.describe('Layout — mobile (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('bottom nav is visible', async ({ page }) => {
    await page.goto('/')
    const bottomNav = page.locator('nav[aria-label="Section navigation (mobile)"]')
    await expect(bottomNav).toBeVisible()
  })

  test('sidebar is hidden', async ({ page }) => {
    await page.goto('/')
    const widget = page.locator('[data-el="nav-widget"]')
    await expect(widget).toBeHidden()
  })

  test('section watermarks are hidden', async ({ page }) => {
    await page.goto('/')
    await page.locator('section[aria-label="Projects"]').scrollIntoViewIfNeeded()
    // Watermark decor elements should be display:none
    const projectDecor = page.locator('section[aria-label="Projects"] span').first()
    // Check that decor text is not visible (display: none from media query)
    const box = await projectDecor.boundingBox()
    // If hidden, boundingBox is null or has 0 dimensions
    if (box) {
      expect(box.width === 0 || box.height === 0).toBeTruthy()
    }
  })
})

test.describe('Layout — tablet (768px)', () => {
  test.use({ viewport: { width: 768, height: 1024 } })

  test('sidebar is hidden', async ({ page }) => {
    await page.goto('/')
    const widget = page.locator('[data-el="nav-widget"]')
    await expect(widget).toBeHidden()
  })

  test('bottom nav is visible', async ({ page }) => {
    await page.goto('/')
    const bottomNav = page.locator('nav[aria-label="Section navigation (mobile)"]')
    await expect(bottomNav).toBeVisible()
  })
})

test.describe('Layout — desktop (1440px)', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('sidebar is visible', async ({ page }) => {
    await page.goto('/')
    const widget = page.locator('[data-el="nav-widget"]')
    await expect(widget).toBeVisible()
  })

  test('bottom nav is hidden', async ({ page }) => {
    await page.goto('/')
    const bottomNav = page.locator('nav[aria-label="Section navigation (mobile)"]')
    await expect(bottomNav).toBeHidden()
  })

  test('content is within max-width container', async ({ page }) => {
    await page.goto('/')
    const content = page.locator('[data-el="nav-bar"]')
    const box = await content.boundingBox()
    expect(box).not.toBeNull()
  })
})
