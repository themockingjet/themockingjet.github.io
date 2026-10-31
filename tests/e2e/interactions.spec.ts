import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('lab scenarios complete, cancel and reset', async ({ page }) => {
  await page.goto('/#lab')
  const lab = page.getByRole('region', { name: 'See an automation pipeline in action.' })
  await lab.getByLabel('Scenario').selectOption('retry')
  await lab.getByRole('button', { name: 'Run simulation' }).click()
  await expect(lab.getByRole('status')).toHaveText('Status: complete', { timeout: 6000 })
  await expect(lab.getByText('Delivery attempt 2 of 2.')).toBeVisible()
  await lab.getByLabel('Scenario').selectOption('duplicate')
  await lab.getByRole('button', { name: 'Run simulation' }).click()
  await expect(lab.getByRole('status')).toHaveText('Status: duplicate', { timeout: 4000 })
  await expect(lab.getByText(/no second action dispatched/)).toBeVisible()
  await lab.getByRole('button', { name: 'Run simulation' }).click()
  await lab.getByRole('button', { name: 'Cancel' }).click()
  await expect(lab.getByRole('status')).toHaveText('Status: cancelled')
  await lab.getByRole('button', { name: 'Reset' }).click()
  await expect(lab.getByRole('status')).toHaveText('Status: ready')
})

test('key destination states have no WCAG A or AA violations', async ({ page }) => {
  await page.goto('/')
  for (const id of ['projects', 'lab', 'about', 'contact']) {
    await page.getByRole('navigation', { name: 'Journey destinations' }).getByRole('link', { name: { projects: 'Projects', lab: 'The lab', about: 'About', contact: 'Contact' }[id] }).click()
    await expect(page.locator('main[data-travelling]')).toHaveCount(0)
    if (id === 'projects') await page.getByRole('button', { name: /expand details for Binance/i }).click()
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(result.violations, `axe at ${id}`).toEqual([])
  }
})

test('light theme maintains WCAG A and AA checks across destinations', async ({ page }) => {
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
  await page.goto('/#lab')
  await page.getByRole('button', { name: 'Switch to light mode' }).click()
  for (const theme of ['Amber', 'Sage', 'Ocean', 'Ember', 'Violet', 'Slate']) {
    await page.getByRole('button', { name: /^Theme:/ }).click()
    await page.getByRole('option', { name: theme }).click()
    const result = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze()
    expect(result.violations, `light ${theme} contrast`).toEqual([])
  }
})
