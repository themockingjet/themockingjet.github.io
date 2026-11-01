import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AutomationLab from '../../../src/components/AutomationLab/AutomationLab'

describe('AutomationLab', () => {
  it('switching project offers that project’s hypotheses and resets the bench', async () => {
    const user = userEvent.setup()
    render(<AutomationLab />)
    const hypotheses = () => within(screen.getByRole('group', { name: 'Hypothesis' })).getAllByRole('radio')
    expect(hypotheses()).toHaveLength(2)
    await user.click(screen.getByRole('radio', { name: 'Discord' }))
    expect(hypotheses()).toHaveLength(3)
    expect(hypotheses()[0]).toBeChecked()
    expect(screen.getByRole('status')).toHaveTextContent('Ready to run 20 trials on the same traffic.')
  })

  it('runs an experiment, skips playback and reports the verdict with its trade-off', async () => {
    const user = userEvent.setup()
    render(<AutomationLab />)
    await user.click(screen.getByRole('button', { name: 'Run experiment' }))
    expect(screen.getByRole('status')).toHaveTextContent('Running 20 trials.')
    await user.click(screen.getByRole('button', { name: 'Skip to result' }))
    expect(screen.getByRole('status')).toHaveTextContent('Supported.')
    expect(screen.getByText(/Rate-limited calls fell from/)).toBeInTheDocument()
    expect(screen.getByText(/^Trade-off:/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Run again on new traffic' })).toBeInTheDocument()
  })

  it('reports a hypothesis the data does not support', async () => {
    const user = userEvent.setup()
    render(<AutomationLab />)
    await user.click(screen.getByRole('radio', { name: 'Discord' }))
    await user.click(screen.getByRole('radio', { name: /Doubling the workers/ }))
    await user.click(screen.getByRole('button', { name: 'Run experiment' }))
    await user.click(screen.getByRole('button', { name: 'Skip to result' }))
    expect(screen.getByRole('status')).toHaveTextContent('Not supported.')
  })
})
