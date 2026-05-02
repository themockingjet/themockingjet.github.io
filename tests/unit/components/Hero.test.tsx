import { render, screen } from '@testing-library/react'
import Hero from '../../../src/components/Hero/Hero'
import type { HeroData } from '../../../src/lib/parsePortfolio'

const mockData: HeroData = {
  name: 'Test User',
  title: 'Software Engineer',
  tagline: 'Building systems that scale',
  location: 'Earth',
  github: 'https://github.com/testuser',
}

describe('Hero component', () => {
  beforeEach(() => {
    render(<Hero data={mockData} />)
  })

  describe('when rendered with valid data', () => {
    it('should display the user name as the page heading', () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName('Test User')
    })

    it('should display the professional title', () => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    })

    it('should display the tagline', () => {
      expect(screen.getByText('Building systems that scale')).toBeInTheDocument()
    })

    it('should display the location badge', () => {
      expect(screen.getByText('Earth')).toBeInTheDocument()
    })

    it('should render a decorative initial letter', () => {
      expect(screen.getByText('T')).toBeInTheDocument()
    })
  })

  describe('semantic structure', () => {
    it('should use a section element with Introduction label', () => {
      const section = screen.getByLabelText('Introduction')
      expect(section.tagName).toBe('SECTION')
    })
  })

  describe('external links', () => {
    it('should link to the GitHub profile in a new tab', () => {
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', 'https://github.com/testuser')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })
})
