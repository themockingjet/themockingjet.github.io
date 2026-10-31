import { useEffect, useReducer, useState } from 'react'
import { initialSimulation, isRunning, pipelineStatuses, simulationReducer, type Scenario } from '../../lib/simulator'
import styles from './AutomationLab.module.css'

export default function AutomationLab() {
  const [scenario, setScenario] = useState<Scenario>('normal')
  const [simulation, dispatch] = useReducer(simulationReducer, initialSimulation)
  const running = isRunning(simulation.phase)
  const steps = [
    ['Receive', 'Accept incoming event'], ['Validate', 'Check schema and event ID'],
    ['Evaluate', 'Apply deterministic rules'], ['Execute', 'Deliver a simulated action'],
  ]
  const statuses = pipelineStatuses(simulation.phase)

  useEffect(() => {
    if (!running) return
    const timer = window.setTimeout(() => dispatch({ type: 'advance' }), simulation.phase === 'backoff' ? 700 : 550)
    return () => window.clearTimeout(timer)
  }, [running, simulation.phase])

  return <section className={styles.lab} aria-labelledby="lab-heading">
    <div>
      <h2 id="lab-heading" className={styles.heading}>See an automation pipeline in action.</h2>
      <div className={styles.columns}>
      <div className={styles.controls}>
        <h3>A little failure.<br/>A better system.</h3>
        <p>Send a synthetic event through the pipeline. Introduce a temporary failure and watch the system recover with a bounded retry.</p>
        <label>Scenario <select value={scenario} disabled={running} onChange={(event) => setScenario(event.target.value as Scenario)}>
          <option value="normal">Normal delivery</option><option value="retry">Temporary dependency failure</option><option value="duplicate">Duplicate event</option>
        </select></label>
        <div className={styles.actions}>
          <button disabled={running} onClick={() => dispatch({ type: 'start', scenario })}>Run simulation</button>
          <button disabled={!running} onClick={() => dispatch({ type: 'cancel' })}>Cancel</button>
          <button disabled={simulation.phase === 'ready'} onClick={() => dispatch({ type: 'reset' })}>Reset</button>
        </div>
        <p className={styles.note}>Synthetic data. Local execution. No API calls or real transactions.</p>
      </div>
      <div className={styles.console}>
        <div className={styles.consoleHeader}><h3>Event flight recorder</h3>
        <p role="status">Status: {simulation.phase.replaceAll('-', ' ')}</p>
        </div>
        <ol className={styles.pipeline} aria-label="Pipeline steps">{steps.map(([title, description], index) => <li key={title}><div><strong>{title}</strong><p>{description}</p></div><span>{statuses[index]}</span></li>)}</ol>
        <div className={styles.traceArea}>
        <h3>Execution trace</h3>
        <ol className={styles.trace} aria-label="Execution trace">{simulation.trace.length ? simulation.trace.map((line, index) => <li key={index}>{line}</li>) : <li>Ready when you are. Choose a scenario, then run the simulation.</li>}</ol>
        </div>
      </div>
      </div>
    </div>
  </section>
}
