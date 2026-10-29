import { StrictMode } from 'react'
import { render } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import SpaceBackground from '../../src/components/SpaceBackground/SpaceBackground'

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals() })

it('keeps one frame loop in StrictMode, pauses when hidden and cleans up', () => {
  const active = new Set<number>()
  let next = 0
  vi.stubGlobal('requestAnimationFrame', vi.fn(() => { active.add(++next); return next }))
  vi.stubGlobal('cancelAnimationFrame', vi.fn((id: number) => { active.delete(id) }))
  const media = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }
  vi.stubGlobal('matchMedia', vi.fn(() => media))
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ clearRect: vi.fn(), fillRect: vi.fn(), setTransform: vi.fn() } as unknown as CanvasRenderingContext2D)
  let hidden = false
  vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden)
  const view = render(<StrictMode><SpaceBackground motion="full" /></StrictMode>)
  expect(active.size).toBe(1)
  hidden = true
  document.dispatchEvent(new Event('visibilitychange'))
  expect(active.size).toBe(0)
  hidden = false
  document.dispatchEvent(new Event('visibilitychange'))
  expect(active.size).toBe(1)
  view.rerender(<StrictMode><SpaceBackground motion="off" /></StrictMode>)
  expect(active.size).toBe(0)
  view.unmount()
  expect(active.size).toBe(0)
  expect(media.removeEventListener).toHaveBeenCalledTimes(media.addEventListener.mock.calls.length)
})

it('does not schedule ambient frames when the system requests reduced motion', () => {
  const request = vi.fn(() => 1)
  vi.stubGlobal('requestAnimationFrame', request)
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ clearRect: vi.fn(), fillRect: vi.fn(), setTransform: vi.fn() } as unknown as CanvasRenderingContext2D)
  const view = render(<SpaceBackground motion="full" />)
  expect(request).not.toHaveBeenCalled()
  view.unmount()
})
