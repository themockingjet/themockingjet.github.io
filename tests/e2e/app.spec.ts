import { test, expect } from '@playwright/test'

test.describe('Critical user flows', () => {
  test('page loads without errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    expect(errors).toEqual([])
  })

  test('all sections are visible on scroll', async ({ page }) => {
    await page.goto('/')
    // Hero visible on load
    await expect(page.locator('section[aria-label="Introduction"]')).toBeVisible()
    // Scroll to About
    await page.locator('section[aria-label="About"]').scrollIntoViewIfNeeded()
    await expect(page.locator('section[aria-label="About"]')).toBeVisible()
    // Scroll to Projects
    await page.locator('section[aria-label="Projects"]').scrollIntoViewIfNeeded()
    await expect(page.locator('section[aria-label="Projects"]')).toBeVisible()
    // Scroll to Skills
    await page.locator('section[aria-label="Skills"]').scrollIntoViewIfNeeded()
    await expect(page.locator('section[aria-label="Skills"]')).toBeVisible()
  })

  test('theme picker changes accent color', async ({ page }) => {
    await page.goto('/')
    // Open theme picker
    await page.getByRole('button', { name: /theme/i }).click()
    // Select Ocean
    await page.getByRole('option', { name: /ocean/i }).click()
    // Verify data-theme attribute
    const theme = await page.locator('html').getAttribute('data-theme')
    expect(theme).toBe('ocean')
  })

  test('dark mode toggle works', async ({ page }) => {
    await page.goto('/')
    // Toggle to light
    await page.getByRole('button', { name: /switch to light/i }).click()
    const dark = await page.locator('html').getAttribute('data-mode')
    expect(dark).toBe('light')
    // Toggle back to dark
    await page.getByRole('button', { name: /switch to dark/i }).click()
    const darkAfter = await page.locator('html').getAttribute('data-mode')
    expect(darkAfter).toBeNull()
  })

  test('project run reveals and hides its context', async ({ page }) => {
    await page.goto('/#projects')
    const projects = page.locator('section[aria-label="Projects"]')
    await projects.getByRole('button', { name: /show context and decisions/i }).click()
    const hide = projects.getByRole('button', { name: /hide context and decisions/i })
    await expect(hide).toBeVisible()
    await hide.click()
    await expect(projects.getByRole('button', { name: /show context and decisions/i })).toBeVisible()
  })

  test('picking a project from the index opens its run', async ({ page }) => {
    await page.goto('/#projects')
    const projects = page.locator('section[aria-label="Projects"]')
    await projects.getByRole('button', { name: 'Discord Axie Infinity Marketplace' }).click()
    await expect(projects.getByRole('article')).toHaveAccessibleName('Discord Axie Infinity Marketplace')
    await expect(projects.getByRole('list', { name: 'How it runs' })).toBeVisible()
  })
})

