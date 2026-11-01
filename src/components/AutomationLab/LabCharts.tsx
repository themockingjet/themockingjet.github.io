import { useId } from 'react'
import type { Bin, Outage } from '../../lib/lab/engine'
import { BIN_MS } from '../../lib/lab/engine'
import { OUTCOMES, OUTCOME_LABELS } from '../../lib/lab/experiments'
import styles from './AutomationLab.module.css'

const WIDTH = 1000
const HEIGHT = 100

interface TimelineProps {
  bins: Bin[]
  endMs: number
  clock: number
  yMax: number
  outages: Outage[]
  label: string
}

/** Calls per quarter second, stacked by outcome. Both lanes share one y scale so heights compare honestly. */
export function Timeline({ bins, endMs, clock, yMax, outages, label }: TimelineProps) {
  const hatch = useId()
  const barWidth = (BIN_MS / endMs) * WIDTH
  const visible = Math.floor(clock / BIN_MS)
  return <svg className={styles.timeline} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" role="img" aria-label={label}>
    <defs>
      <pattern id={hatch} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="6" height="6" className={styles.hatchBack}/>
        <line x1="0" y1="0" x2="0" y2="6" className={styles.hatchLine} strokeWidth="5"/>
      </pattern>
    </defs>
    {outages.map((outage) => <rect key={outage.from} className={styles.outage} x={(outage.from / endMs) * WIDTH} width={((outage.to - outage.from) / endMs) * WIDTH} y="0" height={HEIGHT}/>)}
    <line className={styles.baseline} x1="0" x2={WIDTH} y1={HEIGHT - .5} y2={HEIGHT - .5}/>
    {bins.slice(0, visible).map((bin, index) => {
      let top = HEIGHT
      return OUTCOMES.map((kind) => {
        if (!bin[kind]) return null
        const height = (bin[kind] / yMax) * (HEIGHT - 4)
        top -= height
        return <rect key={`${index}-${kind}`} className={styles[kind]} fill={kind === 'failed' ? `url(#${hatch})` : undefined} x={index * barWidth + .6} width={Math.max(barWidth - 1.2, .8)} y={top} height={height}/>
      })
    })}
    {clock > 0 && clock < endMs && <line className={styles.playhead} x1={(clock / endMs) * WIDTH} x2={(clock / endMs) * WIDTH} y1="0" y2={HEIGHT}/>}
  </svg>
}

export function Legend() {
  return <ul className={styles.legend} aria-label="Timeline key">
    {OUTCOMES.map((kind) => <li key={kind}><span className={`${styles.swatch} ${styles[`swatch-${kind}`]}`} aria-hidden/>{OUTCOME_LABELS[kind]}</li>)}
    <li><span className={`${styles.swatch} ${styles['swatch-outage']}`} aria-hidden/>Outage</li>
  </ul>
}

interface TrialsProps {
  control: number[]
  variant: number[]
  format: (value: number) => string
  label: string
}

/** One dot per trial, so the spread behind each average stays visible. */
export function Trials({ control, variant, format, label }: TrialsProps) {
  const max = Math.max(...control, ...variant) || 1
  const row = (values: number[], name: string, className: string) => <div className={styles.trialRow}>
    <span>{name}</span>
    <span className={styles.track} aria-hidden>
      {values.map((value, index) => <i key={index} className={className} style={{ left: `${(value / max) * 100}%` }}/>)}
    </span>
  </div>
  return <figure className={styles.trials}>
    <figcaption>{label} in each trial, from 0 to {format(max)}</figcaption>
    {row(control, 'Control', styles.dotControl)}
    {row(variant, 'Variant', styles.dotVariant)}
    <p className={styles.hidden}>Control ranged from {format(Math.min(...control))} to {format(Math.max(...control))}. Variant ranged from {format(Math.min(...variant))} to {format(Math.max(...variant))}.</p>
  </figure>
}
