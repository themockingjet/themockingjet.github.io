import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Projects from '../../../src/components/Projects/Projects'
import type { ProjectData } from '../../../src/lib/parsePortfolio'

const mockProjects: ProjectData[] = [
  {
    id: 'alpha-project',
    interests: ['web'],
    matchReason: 'A web interface.',
    title: 'Alpha Project',
    status: 'active',
    url: 'https://example.com',
    stack: ['React', 'TypeScript'],
    flow: ['Fetch', 'Transform', 'Publish'],
    description: 'A tool that does things.',
    details: [
      { heading: 'Context', body: 'Needed a solution.' },
      { heading: 'Impact', body: 'Saved an hour a day.' },
    ],
  },
  {
    id: 'beta-project',
    interests: ['automation'],
    matchReason: 'An automated process.',
    title: 'Beta Project',
    status: 'beta',
    url: '#',
    stack: ['Python'],
    flow: [],
    description: 'Another project.',
    details: [],
  },
  {
    id: 'gamma-project',
    interests: ['automation'],
    matchReason: 'An old script.',
    title: 'Gamma Project',
    status: 'deprecated',
    url: '#',
    stack: ['AutoHotkey'],
    flow: [],
    description: 'A retired script.',
    details: [],
  },
]

const pick = (name: string) => screen.getByRole('button', { name })
const run = () => screen.getByRole('article')

describe('Projects component', () => {
  afterEach(() => { window.location.hash = '' })

  describe('when rendered with project data', () => {
    beforeEach(() => {
      render(<Projects projects={mockProjects} />)
    })

    it('should list every project in the index', () => {
      expect(pick('Alpha Project')).toBeInTheDocument()
      expect(pick('Beta Project')).toBeInTheDocument()
      expect(pick('Gamma Project')).toBeInTheDocument()
    })

    it('should group retired projects under their own heading', () => {
      expect(screen.getByRole('heading', { level: 3, name: 'Retired' })).toBeInTheDocument()
    })

    it('should open the first project by default', () => {
      expect(run()).toHaveAccessibleName('Alpha Project')
      expect(pick('Alpha Project')).toHaveAttribute('aria-expanded', 'true')
      expect(within(run()).getByText('A tool that does things.')).toBeInTheDocument()
      expect(within(run()).getByText('Running')).toBeInTheDocument()
    })

    it('should draw the flow as an ordered list of steps', () => {
      const flow = screen.getByRole('list', { name: 'How it runs' })
      expect(within(flow).getAllByRole('listitem').map((item) => item.textContent)).toEqual(['Fetch', 'Transform', 'Publish'])
    })

    it('should show impact and stack beside the flow', () => {
      expect(within(run()).getByText('Saved an hour a day.')).toBeVisible()
      expect(within(run()).getByText('React, TypeScript')).toBeInTheDocument()
    })

    it('should link to the source when a url is set', () => {
      expect(within(run()).getByRole('link', { name: 'View source on GitHub' })).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('semantic structure', () => {
    it('should use a section element with Projects label', () => {
      render(<Projects projects={mockProjects} />)
      expect(screen.getByLabelText('Projects').tagName).toBe('SECTION')
    })

    it('should render the heading as h2', () => {
      render(<Projects projects={mockProjects} />)
      expect(screen.getByRole('heading', { level: 2, name: 'Projects' })).toBeInTheDocument()
    })
  })

  describe('selection', () => {
    it('should switch the open run when another project is picked', async () => {
      const user = userEvent.setup()
      render(<Projects projects={mockProjects} />)
      await user.click(pick('Beta Project'))
      expect(run()).toHaveAccessibleName('Beta Project')
      expect(pick('Alpha Project')).toHaveAttribute('aria-expanded', 'false')
      expect(within(run()).getByText('In beta')).toBeInTheDocument()
      expect(within(run()).queryByRole('link')).not.toBeInTheDocument()
    })

    it('should open the project named in the url hash', () => {
      window.location.hash = '#project-gamma-project'
      render(<Projects projects={mockProjects} />)
      expect(run()).toHaveAccessibleName('Gamma Project')
      expect(within(run()).getByText('Retired')).toBeInTheDocument()
    })
  })

  describe('context and decisions', () => {
    it('should reveal and hide the remaining details', async () => {
      const user = userEvent.setup()
      render(<Projects projects={mockProjects} />)
      const disclosure = screen.getByText('Needed a solution.').closest('[aria-hidden]')
      expect(disclosure).toHaveAttribute('aria-hidden', 'true')
      expect(disclosure).toHaveAttribute('inert')
      await user.click(screen.getByRole('button', { name: /show context and decisions/i }))
      expect(disclosure).toHaveAttribute('aria-hidden', 'false')
      expect(disclosure).not.toHaveAttribute('inert')
      await user.click(screen.getByRole('button', { name: /hide context and decisions/i }))
      expect(disclosure).toHaveAttribute('aria-hidden', 'true')
      expect(disclosure).toHaveAttribute('inert')
    })
  })
})
