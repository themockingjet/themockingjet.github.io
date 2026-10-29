import { test, expect } from '@playwright/test'

for (const width of [320, 375, 640, 768, 1440, 1920]) {
  const zoomNote = width === 640 ? ' (200% equivalent on a 1280px desktop)' : ''
  test(`journey controls remain reachable at ${width}px${zoomNote}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Journey destinations' })
    await expect(nav).toBeVisible()
    for (const label of ['Home', 'Your route', 'Projects', 'The lab', 'About', 'Contact']) {
      const link = nav.getByRole('link', { name: label })
      await expect(link).toBeVisible()
      const box = await link.boundingBox()
      expect(box && box.x >= 0 && box.x + box.width <= width).toBeTruthy()
    }
    await nav.getByRole('link', { name: 'Contact' }).click()
    await expect(page.getByRole('link', { name: 'Visit GitHub profile' })).toBeInViewport()
  })
}
