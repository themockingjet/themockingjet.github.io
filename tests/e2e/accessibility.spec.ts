import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility: full-page axe audit', () => {
  test('home page has no axe violations', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page }).analyze()

    expect(results.violations).toEqual([])
  })

  test('home page has no color-contrast violations', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze()

    const contrastViolations = results.violations.filter(
      (v) => v.id === 'color-contrast'
    )
    expect(contrastViolations).toEqual([])
  })

  test('all interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast', 'region'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('page uses proper landmark structure', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withRules(['landmark-one-main', 'region'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})
