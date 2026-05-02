import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../src/App'

describe('Keyboard navigation', () => {
  describe('given the app is rendered', () => {
    it('should make all nav buttons reachable via tab (no negative tabindex)', () => {
      render(<App />)
      const interactiveElements = screen.getAllByRole('button')
      for (const el of interactiveElements) {
        expect(el).not.toHaveAttribute('tabindex', '-1')
      }
    })

    it('should close the theme dropdown when Escape is pressed', async () => {
      const user = userEvent.setup()
      render(<App />)
      const themeBtn = screen.getByRole('button', { name: /theme/i })
      await user.click(themeBtn)
      expect(screen.getByRole('listbox')).toBeInTheDocument()
      await user.keyboard('{Escape}')
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('should expand project details when Enter is pressed on the button', async () => {
      const user = userEvent.setup()
      render(<App />)
      const detailBtns = await screen.findAllByRole('button', { name: /details/i }, { timeout: 3000 })
      detailBtns[0].focus()
      await user.keyboard('{Enter}')
      expect(screen.getByRole('button', { name: /collapse/i })).toBeInTheDocument()
    })

    it('should set rel="noopener" on all external links', () => {
      render(<App />)
      const links = screen.getAllByRole('link')
      for (const link of links) {
        if (link.getAttribute('target') === '_blank') {
          expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
        }
      }
    })
  })
})
