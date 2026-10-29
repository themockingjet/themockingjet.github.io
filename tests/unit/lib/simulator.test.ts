import { initialSimulation, isRunning, pipelineStatuses, simulationReducer, type Scenario } from '../../../src/lib/simulator'

function finish(scenario: Scenario) {
  let state = simulationReducer(initialSimulation, { type: 'start', scenario })
  for (let i = 0; i < 10 && isRunning(state.phase); i++) state = simulationReducer(state, { type: 'advance' })
  return state
}

describe('synthetic pipeline', () => {
  it('delivers normally with one attempt', () => {
    const state = finish('normal')
    expect(state.phase).toBe('complete')
    expect(state.trace.filter((line) => line.includes('Delivery attempt'))).toHaveLength(1)
  })
  it('retries a temporary failure once', () => {
    const state = finish('retry')
    expect(state.phase).toBe('complete')
    expect(state.trace.filter((line) => line.includes('Delivery attempt'))).toHaveLength(2)
  })
  it('ignores duplicates before dispatch', () => {
    const state = finish('duplicate')
    expect(state.phase).toBe('duplicate')
    expect(state.trace.join(' ')).not.toContain('Delivery attempt')
    expect(pipelineStatuses(state.phase)).toEqual(['Received', 'Duplicate', 'Skipped', 'Skipped'])
  })
  it('does not advance after cancellation or reset', () => {
    const started = simulationReducer(initialSimulation, { type: 'start', scenario: 'retry' })
    const cancelled = simulationReducer(started, { type: 'cancel' })
    expect(simulationReducer(cancelled, { type: 'advance' })).toEqual(cancelled)
    const reset = simulationReducer(started, { type: 'reset' })
    expect(simulationReducer(reset, { type: 'advance' })).toEqual(initialSimulation)
  })
})
