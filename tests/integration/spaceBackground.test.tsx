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
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ clearRect: vi.fn(), fillRect: vi.fn(), beginPath: vi.fn(), arc: vi.fn(), fill: vi.fn(), setTransform: vi.fn() } as unknown as CanvasRenderingContext2D)
  let hidden = false
  vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden)
  const view = render(<StrictMode><SpaceBackground /></StrictMode>)
  expect(active.size).toBe(1)
  hidden = true
  document.dispatchEvent(new Event('visibilitychange'))
  expect(active.size).toBe(0)
  hidden = false
  document.dispatchEvent(new Event('visibilitychange'))
  expect(active.size).toBe(1)
  view.rerender(<StrictMode><SpaceBackground /></StrictMode>)
  expect(active.size).toBe(1)
  view.unmount()
  expect(active.size).toBe(0)
})
