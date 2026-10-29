import { test, expect } from '@playwright/test'

for (const width of [320, 375, 640, 768, 1440, 1920]) {
  const zoomNote = width === 640 ? ' (200% equivalent on a 1280px desktop)' : ''
  test(`journey controls remain reachable at ${width}px${zoomNote}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Journey destinations' })
    await expect(nav).toBeVisible()
    const destinations = [['Home', 'hero'], ['Your route', 'route'], ['Projects', 'projects'], ['The lab', 'lab'], ['About', 'about'], ['Contact', 'contact']] as const
    for (const [label, id] of destinations) {
      const link = nav.getByRole('link', { name: label })
      await expect(link).toBeVisible()
      const box = await link.boundingBox()
      expect(box && box.x >= 0 && box.x + box.width <= width).toBeTruthy()
      await link.click()
      const panel = page.locator(`[data-destination="${id}"]`)
      const panelWidths = await panel.evaluate((element) => ({ client: element.clientWidth, scroll: element.scrollWidth }))
      expect(panelWidths.scroll, `${label} has horizontal overflow at ${width}px`).toBeLessThanOrEqual(panelWidths.client + 1)
    }
    await expect(page.getByRole('link', { name: 'Visit GitHub profile' })).toBeInViewport()
  })
}
