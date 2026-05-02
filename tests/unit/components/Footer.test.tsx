import { render, screen } from '@testing-library/react'
import Footer from '../../../src/components/Footer/Footer'

describe('Footer component', () => {
  beforeEach(() => {
    render(<Footer />)
  })

  describe('semantic structure', () => {
    it('should use a footer element', () => {
      expect(screen.getByLabelText('Footer').tagName).toBe('FOOTER')
    })
  })

  describe('content', () => {
    it('should display the current year in copyright notice', () => {
      const year = new Date().getFullYear().toString()
      expect(screen.getByText(new RegExp(year))).toBeInTheDocument()
    })

    it('should display the technology stack', () => {
      expect(screen.getByText('vite · react · typescript')).toBeInTheDocument()
    })
  })
})
