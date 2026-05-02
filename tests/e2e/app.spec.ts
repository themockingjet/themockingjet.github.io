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
    const dark = await page.locator('html').getAttribute('data-dark')
    expect(dark).toBe('0')
    // Toggle back to dark
    await page.getByRole('button', { name: /switch to dark/i }).click()
    const darkAfter = await page.locator('html').getAttribute('data-dark')
    expect(darkAfter).toBeNull()
  })

  test('project card expands and collapses', async ({ page }) => {
    await page.goto('/')
    await page.locator('section[aria-label="Projects"]').scrollIntoViewIfNeeded()
    // Find first details button
    const detailBtn = page.getByRole('button', { name: /details/i }).first()
    await detailBtn.click()
    // Should show collapse button
    await expect(page.getByRole('button', { name: /collapse/i }).first()).toBeVisible()
    // Collapse
    await page.getByRole('button', { name: /collapse/i }).first().click()
    // Should show details button again
    await expect(detailBtn).toBeVisible()
  })
})
