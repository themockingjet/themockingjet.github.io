import { useEffect, useRef, useState } from 'react'
import { METRICS, OUTCOME_LABELS, SPECIMENS, TRIALS, formatMetric, runExperiment, type Experiment } from '../../lib/lab/experiments'
import type { RunResult } from '../../lib/lab/engine'
import { Legend, Timeline, Trials } from './LabCharts'
import styles from './AutomationLab.module.css'

const PLAYBACK_MS = 4800
type Phase = 'ready' | 'running' | 'done'

const reducedMotion = () => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const lower = (text: string) => (text[1] === text[1].toLowerCase() ? text[0].toLowerCase() + text.slice(1) : text)

function describe(run: RunResult) {
  const totals = run.bins.reduce((sum, bin) => ({ ok: sum.ok + bin.ok, duplicate: sum.duplicate + bin.duplicate, failed: sum.failed + bin.failed, limited: sum.limited + bin.limited }), { ok: 0, duplicate: 0, failed: 0, limited: 0 })
  return `Calls in trial 1: ${(Object.keys(totals) as (keyof typeof totals)[]).map((kind) => `${totals[kind]} ${lower(OUTCOME_LABELS[kind])}`).join(', ')}.`
}

export default function AutomationLab() {
  const [specimenId, setSpecimenId] = useState(SPECIMENS[0].id)
  const specimen = SPECIMENS.find((item) => item.id === specimenId)!
  const [hypothesisId, setHypothesisId] = useState(specimen.hypotheses[0].id)
  const hypothesis = specimen.hypotheses.find((item) => item.id === hypothesisId) ?? specimen.hypotheses[0]
  const [experiment, setExperiment] = useState<Experiment | null>(null)
  const [phase, setPhase] = useState<Phase>('ready')
  const [clock, setClock] = useState(0)
  const seed = useRef(1)

  const env = experiment?.env ?? { ...specimen.env, ...hypothesis.env }
  const endMs = experiment ? Math.max(experiment.control[0].endMs, experiment.variant[0].endMs) : env.durationMs
  const yMax = experiment ? Math.max(1, ...[experiment.control[0], experiment.variant[0]].flatMap((run) => run.bins.map((bin) => bin.ok + bin.duplicate + bin.failed + bin.limited))) : 1
  const metric = METRICS[hypothesis.metric]

  useEffect(() => {
    if (phase !== 'running') return
    let started = -1
    const tick = (now: number) => {
      if (started < 0) started = now
      const progress = (now - started) / PLAYBACK_MS
      if (progress >= 1) {
        setClock(Number.POSITIVE_INFINITY)
        setPhase('done')
        return
      }
      setClock(progress * endMs)
      frame = requestAnimationFrame(tick)
    }
    let frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [phase, endMs])

  const reset = () => {
    setExperiment(null)
    setPhase('ready')
    setClock(0)
  }

  const pickSpecimen = (id: string) => {
    setSpecimenId(id)
    setHypothesisId(SPECIMENS.find((item) => item.id === id)!.hypotheses[0].id)
    reset()
  }

  const pickHypothesis = (id: string) => {
    setHypothesisId(id)
    reset()
  }

  const finish = () => {
    setClock(Number.POSITIVE_INFINITY)
    setPhase('done')
  }

  const run = () => {
    setExperiment(runExperiment(specimen, hypothesis, seed.current))
    seed.current += 1
    if (reducedMotion()) return finish()
    setClock(0)
    setPhase('running')
  }

  const lane = (name: 'Control' | 'Variant', runs: RunResult[] | undefined) => {
    const condition = name === 'Control' ? hypothesis.control : hypothesis.variant
    const mean = runs && runs.reduce((sum, item) => sum + item[hypothesis.metric], 0) / runs.length
    return <div className={styles.lane} data-lane={name.toLowerCase()}>
      <div className={styles.laneHeader}>
        <h3><span>{name}</span>{condition.label}</h3>
        {phase === 'done' && mean !== undefined && <p className={styles.value}><strong>{formatMetric(hypothesis.metric, mean)}</strong> {lower(metric.label)} on average</p>}
      </div>
      <Timeline bins={runs?.[0].bins ?? []} endMs={endMs} clock={clock} yMax={yMax} outages={env.outages} label={runs ? `${name}, ${condition.label}. ${describe(runs[0])}` : `${name}, ${condition.label}. Not run yet.`}/>
    </div>
  }

  const verdict = experiment?.verdict
  const status = phase === 'ready'
    ? `Ready to run ${TRIALS} trials on the same traffic.`
    : phase === 'running' ? `Running ${TRIALS} trials.` : verdict!.supported ? 'Supported.' : 'Not supported.'

  return <section className={styles.lab} aria-labelledby="lab-heading">
    <h2 id="lab-heading" className={styles.heading}>Change one thing. Measure what happens.</h2>
    <div className={styles.layout}>
      <form className={styles.setup} onSubmit={(event) => { event.preventDefault(); run() }}>
        <fieldset className={styles.projects}>
          <legend className={styles.label}>Project</legend>
          <div className={styles.segments}>
            {SPECIMENS.map((item) => <label key={item.id}><input type="radio" name="lab-project" value={item.id} checked={item.id === specimenId} onChange={() => pickSpecimen(item.id)}/><span>{item.short}</span></label>)}
          </div>
        </fieldset>
        <fieldset>
          <legend className={styles.label}>Hypothesis</legend>
          <div className={styles.hypotheses}>
            {specimen.hypotheses.map((item) => <label key={item.id}><input type="radio" name="lab-hypothesis" value={item.id} checked={item.id === hypothesis.id} onChange={() => pickHypothesis(item.id)}/><span className={styles.station} aria-hidden/><span>{item.statement}</span></label>)}
          </div>
        </fieldset>
        <div>
          <h3 className={styles.label}>Method</h3>
          <p key={hypothesis.id} className={styles.method}>{hypothesis.method}</p>
        </div>
        <div className={styles.actions}>
          {phase === 'running'
            ? <button key="skip" type="button" onClick={finish}>Skip to result</button>
            : <button key="run" type="submit">{phase === 'done' ? 'Run again on new traffic' : 'Run experiment'}</button>}
        </div>
        <p className={styles.note}>Simulated in your browser on seeded traffic. Nothing is sent anywhere.</p>
      </form>

      <div className={styles.bench}>
        {lane('Control', experiment?.control)}
        {lane('Variant', experiment?.variant)}
        <div className={styles.axis} data-outage={env.outages.length > 0 || undefined} aria-hidden>
          {Array.from({ length: Math.floor(endMs / 5000) + 1 }, (_, i) => <span key={i} data-edge={i * 5000 >= endMs * .97 || undefined} style={{ left: `${(i * 5000 / endMs) * 100}%` }}>{i * 5} s</span>)}
          {env.outages.map((outage) => <em key={outage.from} style={{ left: `${(outage.from / endMs) * 100}%` }}>{outage.label}</em>)}
        </div>
        <Legend/>
        <div className={styles.result}>
          <p role="status" className={styles.verdict} data-verdict={phase === 'done' ? (verdict!.supported ? 'supported' : 'rejected') : undefined}>{status}</p>
          {phase === 'done' && verdict && experiment && <div className={styles.findings}>
            <div>
              <p>{verdict.summary}</p>
              {verdict.costs.map((cost) => <p key={cost} className={styles.cost}>Trade-off: {lower(cost)}</p>)}
            </div>
            <Trials control={experiment.control.map((item) => item[hypothesis.metric])} variant={experiment.variant.map((item) => item[hypothesis.metric])} format={(value) => formatMetric(hypothesis.metric, value)} label={metric.label}/>
          </div>}
        </div>
      </div>
    </div>
  </section>
}
