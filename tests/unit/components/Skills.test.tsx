import { render, screen } from '@testing-library/react'
import Skills from '../../../src/components/Skills/Skills'
import type { SkillsData } from '../../../src/lib/parsePortfolio'

const mockSkills: SkillsData = {
  stack: ['Python', 'JavaScript', 'TypeScript'],
  others: ['Azure', 'Copilot'],
}

describe('Skills component', () => {
  beforeEach(() => {
    render(<Skills skills={mockSkills} />)
  })

  describe('semantic structure', () => {
    it('should use a section element with Skills label', () => {
      expect(screen.getByLabelText('Skills')).toBeInTheDocument()
    })

    it('should render the heading as h2', () => {
      expect(screen.getByRole('heading', { level: 2, name: 'Skills' })).toBeInTheDocument()
    })

    it('should render group labels as h3 headings', () => {
      expect(screen.getByRole('heading', { level: 3, name: 'Stack' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 3, name: 'Tools & Platforms' })).toBeInTheDocument()
    })

    it('should render skills as list items in two groups', () => {
      expect(screen.getAllByRole('list')).toHaveLength(2)
    })
  })

  describe('content rendering', () => {
    it('should display all stack skills', () => {
      expect(screen.getByText('Python')).toBeInTheDocument()
      expect(screen.getByText('JavaScript')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
    })

    it('should display all tools and platforms', () => {
      expect(screen.getByText('Azure')).toBeInTheDocument()
      expect(screen.getByText('Copilot')).toBeInTheDocument()
    })
  })
})
