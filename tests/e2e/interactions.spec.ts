import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

for (const reading of [false, true]) test(`guided route and briefing work with motion off${reading ? ' in Reading view' : ''}`, async ({ page }) => {
  await page.goto('/#route')
  await page.getByRole('combobox', { name: 'Motion' }).selectOption('off')
  if (reading) await page.getByRole('button', { name: 'Reading view' }).click()
  const preview = page.getByRole('heading', { name: /Your suggested route/ }).locator('..')
  await expect(preview).toContainText('Streaming market events feed backend rules')
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download briefing' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('jet-mission-brief.md')
  const stream = await download.createReadStream()
  let text = ''
  for await (const chunk of stream) text += chunk.toString()
  expect(text).toContain('Why it matches: Streaming market events')
  await page.getByRole('button', { name: 'Start guided route' }).click()
  await expect(page).toHaveURL(/#project-binance-trading-bot$/)
  const guided = page.getByRole('region', { name: 'Guided route' })
  await expect(guided).toBeVisible()
  await guided.getByRole('button', { name: 'Next project' }).click()
  await expect(page).toHaveURL(/#project-discord-marketplace$/)
  await guided.getByRole('button', { name: 'Exit route' }).click()
  await expect(guided).toBeHidden()
})

test('lab scenarios complete, cancel and reset in reading view with motion off', async ({ page }) => {
  await page.goto('/#lab')
  await page.getByRole('combobox', { name: 'Motion' }).selectOption('off')
  await page.getByRole('button', { name: 'Reading view' }).click()
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
  for (const id of ['route', 'projects', 'lab', 'about', 'contact']) {
    await page.getByRole('navigation', { name: 'Journey destinations' }).getByRole('link', { name: { route: 'Your route', projects: 'Projects', lab: 'The lab', about: 'About', contact: 'Contact' }[id] }).click()
    if (id === 'projects') await page.getByRole('button', { name: /expand details for Binance/i }).click()
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(result.violations, `axe at ${id}`).toEqual([])
  }
})

test('light theme maintains WCAG A and AA checks across destinations', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Switch to light mode' }).click()
  for (const label of ['Home', 'Your route', 'Projects', 'The lab', 'About', 'Contact']) {
    await page.getByRole('navigation', { name: 'Journey destinations' }).getByRole('link', { name: label }).click()
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(result.violations, `axe in light mode at ${label}`).toEqual([])
  }
})

test('motion off and system reduced motion suppress decorative transitions', async ({ page }) => {
  await page.goto('/#skills')
  const chip = page.locator('#skills li').first()
  await page.getByRole('combobox', { name: 'Motion' }).selectOption('off')
  await expect(chip).toHaveCSS('transition-duration', '0s')
  await page.getByRole('combobox', { name: 'Motion' }).selectOption('full')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(chip).toHaveCSS('transition-duration', '0s')
})
