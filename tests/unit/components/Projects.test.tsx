import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Projects from '../../../src/components/Projects/Projects'
import type { ProjectData } from '../../../src/lib/parsePortfolio'

const mockProjects: ProjectData[] = [
  {
    title: 'Alpha Project',
    status: 'active',
    url: 'https://example.com',
    stack: ['React', 'TypeScript'],
    description: 'A tool that does things.',
    details: [
      { heading: 'Context', body: 'Needed a solution.' },
      { heading: 'What It Does', body: 'Solves the problem.' },
    ],
  },
  {
    title: 'Beta Project',
    status: 'beta',
    url: '#',
    stack: ['Python'],
    description: 'Another project.',
    details: [],
  },
]

describe('Projects component', () => {
  describe('when rendered with project data', () => {
    beforeEach(() => {
      render(<Projects projects={mockProjects} />)
    })

    it('should display all project titles', () => {
      expect(screen.getByText('Alpha Project')).toBeInTheDocument()
      expect(screen.getByText('Beta Project')).toBeInTheDocument()
    })

    it('should display project descriptions', () => {
      expect(screen.getByText('A tool that does things.')).toBeInTheDocument()
    })

    it('should display technology stack tags', () => {
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
    })

    it('should show a details button for projects with details', () => {
      const detailBtns = screen.getAllByRole('button', { name: /expand|details/i })
      expect(detailBtns.length).toBeGreaterThan(0)
    })
  })

  describe('semantic structure', () => {
    it('should use a section element with Projects label', () => {
      render(<Projects projects={mockProjects} />)
      expect(screen.getByLabelText('Projects')).toBeInTheDocument()
    })

    it('should render the heading as h2', () => {
      render(<Projects projects={mockProjects} />)
      expect(screen.getByRole('heading', { level: 2, name: 'Projects' })).toBeInTheDocument()
    })
  })

  describe('expand/collapse behavior', () => {
    it('should reveal detail content when the user clicks expand', async () => {
      const user = userEvent.setup()
      render(<Projects projects={mockProjects} />)
      const detailBtn = screen.getAllByRole('button', { name: /details/i })[0]
      await user.click(detailBtn)
      expect(screen.getByText('Context')).toBeInTheDocument()
      expect(screen.getByText('Needed a solution.')).toBeInTheDocument()
    })

    it('should collapse details when the user clicks collapse', async () => {
      const user = userEvent.setup()
      render(<Projects projects={mockProjects} />)
      const detailBtn = screen.getAllByRole('button', { name: /details/i })[0]
      await user.click(detailBtn)
      const lessBtn = screen.getByRole('button', { name: /collapse/i })
      await user.click(lessBtn)
      expect(screen.getByRole('button', { name: /expand|details/i })).toBeInTheDocument()
    })
  })
})
