import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('lab experiments run, skip and report a verdict', async ({ page }) => {
  await page.goto('/#lab')
  const lab = page.getByRole('region', { name: 'Change one thing. Measure what happens.' })
  await lab.getByRole('button', { name: 'Run experiment' }).click()
  await expect(lab.getByRole('status')).toHaveText('Supported.', { timeout: 8000 })
  await expect(lab.getByText(/Rate-limited calls fell from/)).toBeVisible()
  await lab.getByRole('radio', { name: 'Discord' }).check()
  await expect(lab.getByRole('status')).toHaveText('Ready to run 20 trials on the same traffic.')
  await lab.getByRole('radio', { name: /Doubling the workers/ }).check()
  await lab.getByRole('button', { name: 'Run experiment' }).click()
  await lab.getByRole('button', { name: 'Skip to result' }).click()
  await expect(lab.getByRole('status')).toHaveText('Not supported.')
  await expect(lab.getByRole('button', { name: 'Run again on new traffic' })).toBeVisible()
})

test('key destination states have no WCAG A or AA violations', async ({ page }) => {
  test.slow() // one full axe scan per destination
  await page.goto('/')
  for (const id of ['projects', 'lab', 'about', 'contact']) {
    await page.getByRole('navigation', { name: 'Journey destinations' }).getByRole('link', { name: { projects: 'Projects', lab: 'The lab', about: 'About', contact: 'Contact' }[id] }).click()
    await expect(page.locator('main[data-travelling]')).toHaveCount(0)
    if (id === 'projects') await page.getByRole('button', { name: /show context and decisions/i }).click()
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(result.violations, `axe at ${id}`).toEqual([])
  }
})

test('light theme maintains WCAG A and AA checks across destinations', async ({ page }) => {
  test.slow() // one full axe scan per destination
  await page.goto('/')
  await page.getByRole('button', { name: 'Switch to light mode' }).click()
  for (const label of ['Home', 'Projects', 'The lab', 'About', 'Contact']) {
    await page.getByRole('navigation', { name: 'Journey destinations' }).getByRole('link', { name: label }).click()
    await expect(page.locator('main[data-travelling]')).toHaveCount(0)
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(result.violations, `axe in light mode at ${label}`).toEqual([])
  }
})

test('accent choices preserve contrast in light mode', async ({ page }) => {
  test.slow() // one full axe scan per destination
  await page.goto('/#lab')
  await page.getByRole('button', { name: 'Switch to light mode' }).click()
  for (const theme of ['Amber', 'Sage', 'Ocean', 'Ember', 'Violet', 'Slate']) {
    await page.getByRole('button', { name: /^Theme:/ }).click()
    await page.getByRole('option', { name: theme }).click()
    const result = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze()
    expect(result.violations, `light ${theme} contrast`).toEqual([])
  }
})
