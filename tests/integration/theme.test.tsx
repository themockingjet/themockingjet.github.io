import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../src/App'

describe('Theme switching', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.removeAttribute('data-dark')
  })

  describe('given the default state', () => {
    it('should start with the warm theme (no data-theme attribute)', () => {
      render(<App />)
      expect(document.documentElement.getAttribute('data-theme')).toBeNull()
    })
  })

  describe('when the user selects a different theme', () => {
    it('should apply the ocean theme to the document', async () => {
      const user = userEvent.setup()
      render(<App />)
      await user.click(screen.getByRole('button', { name: /theme/i }))
      await user.click(screen.getByRole('option', { name: /ocean/i }))
      expect(document.documentElement.getAttribute('data-theme')).toBe('ocean')
    })

    it('should switch back to warm when selected again', async () => {
      const user = userEvent.setup()
      render(<App />)
      const themeBtn = screen.getByRole('button', { name: /theme/i })
      await user.click(themeBtn)
      await user.click(screen.getByRole('option', { name: /ocean/i }))
      await user.click(themeBtn)
      await user.click(screen.getByRole('option', { name: /warm/i }))
      expect(document.documentElement.getAttribute('data-theme')).toBeNull()
    })

    it('should close the dropdown after selection', async () => {
      const user = userEvent.setup()
      render(<App />)
      await user.click(screen.getByRole('button', { name: /theme/i }))
      expect(screen.getByRole('listbox')).toBeInTheDocument()
      await user.click(screen.getByRole('option', { name: /ember/i }))
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
  })
})

describe('Dark mode toggle', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-dark')
  })

  describe('given the default dark mode', () => {
    it('should start without a data-dark attribute', () => {
      render(<App />)
      expect(document.documentElement.getAttribute('data-dark')).toBeNull()
    })
  })

  describe('when the user toggles to light mode', () => {
    it('should set data-dark="0" on the document', async () => {
      const user = userEvent.setup()
      render(<App />)
      await user.click(screen.getByRole('button', { name: /switch to light/i }))
      expect(document.documentElement.getAttribute('data-dark')).toBe('0')
    })

    it('should toggle back to dark mode on second click', async () => {
      const user = userEvent.setup()
      render(<App />)
      await user.click(screen.getByRole('button', { name: /switch to light/i }))
      await user.click(screen.getByRole('button', { name: /switch to dark/i }))
      expect(document.documentElement.getAttribute('data-dark')).toBeNull()
    })
  })
})
