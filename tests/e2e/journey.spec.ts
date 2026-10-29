import { test, expect } from '@playwright/test'

test('bundled fonts load without a network dependency', async ({ page }) => {
  await page.goto('/')
  const loaded = await page.evaluate(async () => {
    await document.fonts.ready
    const faces = Array.from(document.fonts)
    return ['Source Sans 3', 'Space Grotesk'].every((family) => faces.some((face) => face.family === family && face.status === 'loaded'))
  })
  expect(loaded).toBe(true)
})

test('destination links and history preserve the current place', async ({ page }) => {
  await page.goto('/#route')
  const nav = page.getByRole('navigation', { name: 'Journey destinations' })
  await expect(nav.getByRole('link', { name: 'Your route' })).toHaveAttribute('aria-current', 'location')
  await nav.getByRole('link', { name: 'The lab' }).click()
  await expect(page).toHaveURL(/#lab$/)
  await expect(nav.getByRole('link', { name: 'The lab' })).toHaveAttribute('aria-current', 'location')
  await page.goBack()
  await expect(nav.getByRole('link', { name: 'Your route' })).toHaveAttribute('aria-current', 'location')
})

test('direct project fragments reach the projects destination', async ({ page }) => {
  await page.goto('/#project-portfolio')
  await expect(page.getByRole('navigation', { name: 'Journey destinations' }).getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'location')
  await expect(page.locator('#project-portfolio')).toBeInViewport()
})

test('keyboard navigation preserves form arrow keys', async ({ page }) => {
  await page.goto('/')
  await page.locator('#hero').focus()
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/#route$/)
  const length = page.getByLabel('Visit length')
  await length.focus()
  await page.keyboard.press('ArrowDown')
  await expect(page).toHaveURL(/#route$/)
  await page.locator('#route').focus()
  await page.keyboard.press('End')
  await expect(page).toHaveURL(/#contact$/)
  await page.keyboard.press('Home')
  await expect(page).toHaveURL(/#hero$/)
})

test('wheel scrolls overflowing content before advancing', async ({ page }) => {
  await page.goto('/#projects')
  const panel = page.locator('#projects')
  await panel.hover()
  const canScroll = await panel.evaluate((element) => element.scrollHeight > element.clientHeight)
  expect(canScroll).toBe(true)
  await page.mouse.wheel(0, 500)
  await expect.poll(() => panel.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
  await expect(page).toHaveURL(/#projects$/)
  await panel.evaluate((element) => { element.scrollTop = element.scrollHeight })
  await page.mouse.wheel(0, 500)
  await expect(page).toHaveURL(/#lab$/)
})

test('horizontal trackpad input changes destination without intercepting zoom gestures', async ({ page }) => {
  await page.goto('/#route')
  const panel = page.locator('#route')
  const zoomPrevented = await panel.evaluate((element) => !element.dispatchEvent(new WheelEvent('wheel', { bubbles: true, cancelable: true, ctrlKey: true, deltaY: 100 })))
  expect(zoomPrevented).toBe(false)
  await panel.hover()
  await page.mouse.wheel(300, 0)
  await expect(page).toHaveURL(/#projects$/)
})

test('focused project disclosure is not hidden behind fixed navigation', async ({ page }) => {
  await page.goto('/#projects')
  const button = page.getByRole('button', { name: /expand details for Binance/i })
  await button.focus()
  await expect(button).toBeFocused()
  const buttonBox = await button.boundingBox()
  const navBox = await page.getByRole('navigation', { name: 'Journey destinations' }).boundingBox()
  expect(buttonBox && navBox && buttonBox.y + buttonBox.height <= navBox.y).toBeTruthy()
})

test('sideways touch gesture advances the journey', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Touch input is tested in the mobile project')
  await page.goto('/')
  const session = await page.context().newCDPSession(page)
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 320, y: 400 }] })
  for (const x of [280, 230, 180, 130, 80]) await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: 400 }] })
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await expect(page.getByRole('navigation', { name: 'Journey destinations' }).getByRole('link', { name: 'Your route' })).toHaveAttribute('aria-current', 'location')
})
