export type Scenario = 'normal' | 'retry' | 'duplicate'
export type Phase = 'ready' | 'receive' | 'validate' | 'evaluate' | 'attempt-one' | 'backoff' | 'attempt-two' | 'complete' | 'duplicate' | 'cancelled'
export interface Simulation { scenario: Scenario; phase: Phase; trace: string[] }
export type SimulationAction = { type: 'start'; scenario: Scenario } | { type: 'advance' } | { type: 'cancel' } | { type: 'reset' }

export const initialSimulation: Simulation = { scenario: 'normal', phase: 'ready', trace: [] }

export function simulationReducer(state: Simulation, action: SimulationAction): Simulation {
  if (action.type === 'reset') return initialSimulation
  if (action.type === 'cancel') return { ...state, phase: 'cancelled', trace: [...state.trace, 'Simulation cancelled.'] }
  if (action.type === 'start') return { scenario: action.scenario, phase: 'receive', trace: ['Received synthetic event evt-042.'] }
  const next = (phase: Phase, message: string): Simulation => ({ ...state, phase, trace: [...state.trace, message] })
  switch (state.phase) {
    case 'receive': return next('validate', 'Schema valid. Checking event ID.')
    case 'validate': return state.scenario === 'duplicate'
      ? next('duplicate', 'Event already handled; no second action dispatched.')
      : next('evaluate', 'Event is new. Evaluating the rule.')
    case 'evaluate': return next('attempt-one', 'Rule matched. Delivery attempt 1 of 2.')
    case 'attempt-one': return state.scenario === 'retry'
      ? next('backoff', 'Simulated dependency failure. One retry remains.')
      : next('complete', 'Action recorded in the synthetic demo queue.')
    case 'backoff': return next('attempt-two', 'Delivery attempt 2 of 2.')
    case 'attempt-two': return next('complete', 'Recovered. Action recorded in the synthetic demo queue.')
    default: return state
  }
}

export function isRunning(phase: Phase): boolean {
  return ['receive', 'validate', 'evaluate', 'attempt-one', 'backoff', 'attempt-two'].includes(phase)
}

export function pipelineStatuses(phase: Phase): string[] {
  switch (phase) {
    case 'ready': return ['Waiting', 'Waiting', 'Waiting', 'Waiting']
    case 'receive': return ['Receiving', 'Waiting', 'Waiting', 'Waiting']
    case 'validate': return ['Received', 'Checking', 'Waiting', 'Waiting']
    case 'evaluate': return ['Received', 'Valid', 'Evaluating', 'Waiting']
    case 'attempt-one': return ['Received', 'Valid', 'Matched', 'Attempt 1']
    case 'backoff': return ['Received', 'Valid', 'Matched', 'Retrying']
    case 'attempt-two': return ['Received', 'Valid', 'Matched', 'Attempt 2']
    case 'complete': return ['Received', 'Valid', 'Matched', 'Delivered']
    case 'duplicate': return ['Received', 'Duplicate', 'Skipped', 'Skipped']
    case 'cancelled': return ['Stopped', 'Stopped', 'Stopped', 'Stopped']
  }
}
