import '@testing-library/jest-dom/vitest'

// Mock IntersectionObserver for motion/react viewport animations
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
})

// Mock scrollTo for smooth scroll
window.scrollTo = () => {}
Element.prototype.scrollIntoView = () => {}
