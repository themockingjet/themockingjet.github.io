import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MissionPlanner from '../../src/components/MissionPlanner/MissionPlanner'
import type { ProjectData } from '../../src/lib/parsePortfolio'

const projects: ProjectData[] = [
  { id: 'first', title: 'First project', interests: ['automation'], status: '', url: '', stack: [], description: 'First', details: [] },
  { id: 'second', title: 'Second project', interests: ['backend'], status: '', url: '', stack: [], description: 'Second', details: [] },
]

it('updates the preview and lets visitors start and exit a guided route', async () => {
  const user = userEvent.setup()
  render(<MissionPlanner projects={projects} profileUrl="https://example.com" />)
  expect(screen.getByRole('link', { name: 'First project' })).toHaveAttribute('href', '#project-first')
  expect(screen.queryByRole('link', { name: 'Second project' })).not.toBeInTheDocument()
  await user.click(screen.getByRole('checkbox', { name: 'backend' }))
  expect(screen.getByRole('link', { name: 'Second project' })).toHaveAttribute('href', '#project-second')
  await user.click(screen.getByRole('button', { name: 'Start guided route' }))
  expect(window.location.hash).toBe('#project-first')
  await user.click(screen.getByRole('button', { name: 'Next project' }))
  expect(window.location.hash).toBe('#project-second')
  await user.click(screen.getByRole('button', { name: 'Exit route' }))
  expect(screen.queryByRole('region', { name: 'Guided route' })).not.toBeInTheDocument()
})
