import { useEffect, useRef } from 'react'
import styles from './WorkflowConstellation.module.css'

type Place = { x: number; y: number; label: string; above?: boolean; failsafe?: boolean }
const stations = {
  webhook: { x: 92, y: 140, label: 'Webhook' },
  schedule: { x: 60, y: 310, label: 'Schedule' },
  stream: { x: 110, y: 480, label: 'Market stream' },
  queue: { x: 236, y: 330, label: 'Queue' },
  validate: { x: 366, y: 250, label: 'Validate' },
  rejected: { x: 316, y: 110, label: 'Rejected', above: true },
  enrich: { x: 500, y: 128, label: 'Enrich' },
  fallback: { x: 606, y: 44, label: 'Cached fallback', above: true, failsafe: true },
  score: { x: 530, y: 272, label: 'Score' },
  route: { x: 470, y: 400, label: 'Route' },
  merge: { x: 660, y: 190, label: 'Merge' },
  notify: { x: 600, y: 500, label: 'Notify' },
  deliver: { x: 720, y: 350, label: 'Deliver' },
  log: { x: 770, y: 470, label: 'Log' },
  deadLetter: { x: 700, y: 600, label: 'Dead letter', failsafe: true },
  replay: { x: 420, y: 620, label: 'Replay', failsafe: true },
} satisfies Record<string, Place>
type Station = keyof typeof stations
type Hop = [from: Station, to: Station, step: number]
type Run = { start: number; hops: Hop[] }
type Tone = 'flow' | 'recovery' | 'muted'

// Seconds. Hops are scheduled in steps of HOP, and each hop takes one step to travel.
const HOP = .6
const CYCLE = 9
const runs: Run[] = [
  { start: 0, hops: [['webhook', 'queue', 0], ['queue', 'validate', 1], ['validate', 'enrich', 2], ['validate', 'score', 2], ['enrich', 'merge', 3], ['score', 'merge', 3], ['merge', 'deliver', 4], ['deliver', 'log', 5]] },
  // Enrich times out, the cached fallback stands in, delivery exhausts its retry and the dead letter is replayed through the queue.
  { start: 1.2, hops: [['stream', 'queue', 0], ['queue', 'validate', 1], ['validate', 'enrich', 2], ['enrich', 'fallback', 3], ['fallback', 'merge', 4], ['merge', 'deliver', 5], ['deliver', 'deliver', 6], ['deliver', 'deadLetter', 7], ['deadLetter', 'replay', 8], ['replay', 'queue', 9], ['queue', 'validate', 10], ['validate', 'route', 11], ['route', 'notify', 12]] },
  { start: 3, hops: [['stream', 'queue', 0], ['queue', 'validate', 1], ['validate', 'route', 2], ['route', 'notify', 3]] },
  { start: 4.5, hops: [['schedule', 'queue', 0], ['queue', 'validate', 1], ['validate', 'score', 2], ['validate', 'route', 2], ['score', 'merge', 3], ['route', 'notify', 3], ['merge', 'deliver', 4], ['deliver', 'log', 5]] },
  { start: 6.6, hops: [['webhook', 'queue', 0], ['queue', 'validate', 1], ['validate', 'rejected', 2]] },
]

const edges: [Station, Station, number][] = [
  ['webhook', 'queue', .14], ['schedule', 'queue', -.06], ['stream', 'queue', -.14],
  ['queue', 'validate', .08], ['validate', 'rejected', -.14],
  ['validate', 'enrich', .12], ['validate', 'score', -.05], ['validate', 'route', -.14],
  ['enrich', 'merge', .1], ['score', 'merge', -.12], ['route', 'notify', .12],
  ['merge', 'deliver', .14], ['deliver', 'log', -.1],
  ['enrich', 'fallback', -.12], ['fallback', 'merge', -.12],
  ['deliver', 'deadLetter', -.1], ['deadLetter', 'replay', -.08], ['replay', 'queue', -.16],
]

const ORBIT = 26
const background = [
  [168, 44], [254, 52], [404, 40], [724, 40], [772, 120], [784, 250], [30, 210], [24, 410],
  [190, 600], [292, 652], [560, 650], [628, 668], [610, 380], [290, 210], [176, 400], [420, 500],
]
const backgroundLinks = [[0, 1], [1, 2], [3, 4], [4, 5], [6, 7], [8, 9], [10, 11]]
const hints: [number, Station][] = [[0, 'webhook'], [3, 'fallback'], [5, 'deliver'], [6, 'schedule'], [7, 'stream'], [8, 'stream'], [11, 'deadLetter'], [13, 'validate'], [12, 'route']]

function curve(from: Station, to: Station, bend = .1) {
  const a = stations[from], b = stations[to]
  if (from === to) return `M${a.x + ORBIT} ${a.y}a${ORBIT} ${ORBIT} 0 1 1 ${-2 * ORBIT} 0a${ORBIT} ${ORBIT} 0 1 1 ${2 * ORBIT} 0`
  const cx = (a.x + b.x) / 2 - (b.y - a.y) * bend
  const cy = (a.y + b.y) / 2 + (b.x - a.x) * bend
  return `M${a.x} ${a.y}Q${cx} ${cy} ${b.x} ${b.y}`
}
const bendOf = (from: Station, to: Station) => edges.find(([a, b]) => a === from && b === to)?.[2]
const isFailsafe = (id: Station) => 'failsafe' in stations[id]
const toneOf = (from: Station, to: Station): Tone =>
  to === 'rejected' ? 'muted' : from === to || isFailsafe(from) || isFailsafe(to) ? 'recovery' : 'flow'

const pulses = runs.flatMap((run, r) => run.hops.map(([from, to, step], h) => ({
  key: `${r}-${h}`, from, to, at: run.start + step * HOP, tone: toneOf(from, to),
})))
const arrivals = [
  ...runs.map(run => ({ station: run.hops[0][0], at: run.start, tone: 'flow' as Tone })),
  ...pulses.map(({ to, at, tone }) => ({ station: to, at: at + HOP, tone })),
]

export default function WorkflowConstellation({ className }: { className?: string }) {
  const root = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = root.current
    if (!svg || typeof window.matchMedia !== 'function') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animations: Animation[] = []
    let visible = true
    const span = HOP / CYCLE
    const start = () => {
      animations.forEach(animation => animation.cancel())
      animations = []
      if (reduced.matches) return
      svg.querySelectorAll<SVGElement>('[data-at]').forEach(element => {
        if (typeof element.animate !== 'function') return
        const keyframes: Keyframe[] = element.dataset.kind === 'pulse'
          ? [{ offset: 0, strokeDashoffset: '0.14', opacity: 1, easing: 'cubic-bezier(.45, 0, .25, 1)' }, { offset: span, strokeDashoffset: '-1', opacity: 1 }, { offset: span + .001, opacity: 0 }, { offset: 1, opacity: 0 }]
          : [{ offset: 0, opacity: .85, transform: 'scale(1)', easing: 'ease-out' }, { offset: span * 1.6, opacity: 0, transform: 'scale(3.2)' }, { offset: 1, opacity: 0, transform: 'scale(3.2)' }]
        const animation = element.animate(keyframes, { duration: CYCLE * 1000, delay: Number(element.dataset.at) * 1000, iterations: Infinity })
        if (!visible) animation.pause()
        animations.push(animation)
      })
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      animations.forEach(animation => visible ? animation.play() : animation.pause())
    })
    start()
    observer.observe(svg)
    reduced.addEventListener('change', start)
    return () => {
      animations.forEach(animation => animation.cancel())
      observer.disconnect()
      reduced.removeEventListener('change', start)
    }
  }, [])

  return <svg ref={root} className={`${styles.constellation} ${className ?? ''}`} viewBox="0 0 800 680" aria-hidden="true">
    <defs>
      <radialGradient id="constellation-halo"><stop stopColor="#5f8fa3" stopOpacity=".14" /><stop offset="1" stopColor="#5f8fa3" stopOpacity="0" /></radialGradient>
      <filter id="pulse-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
    </defs>
    <circle className={styles.halo} cx="420" cy="340" r="340" fill="url(#constellation-halo)" />

    <g className={styles.faint}>
      {backgroundLinks.map(([a, b]) => <line key={`${a}-${b}`} x1={background[a][0]} y1={background[a][1]} x2={background[b][0]} y2={background[b][1]} />)}
      {hints.map(([a, station]) => <line key={`${a}-${station}`} x1={background[a][0]} y1={background[a][1]} x2={stations[station].x} y2={stations[station].y} />)}
    </g>
    {background.map(([x, y], index) => <circle key={index} className={styles.star} cx={x} cy={y} r={index % 3 === 0 ? 2 : 1.3} />)}

    <g className={styles.edges}>
      {edges.map(([from, to, bend]) => {
        const tone = toneOf(from, to)
        return <path key={`${from}-${to}`} className={tone === 'muted' ? styles.rejectEdge : tone === 'recovery' ? styles.recoveryEdge : undefined} d={curve(from, to, bend)} />
      })}
      <path className={styles.orbit} d={curve('deliver', 'deliver')} />
    </g>
    <text className={styles.note} x={stations.deliver.x} y={stations.deliver.y - ORBIT - 10} textAnchor="middle">Retry</text>

    <g filter="url(#pulse-glow)">
      {pulses.map(({ key, from, to, at, tone }) => <path
        key={key}
        className={styles[`${tone}Pulse`]}
        d={curve(from, to, bendOf(from, to))}
        pathLength={1}
        data-kind="pulse"
        data-at={at}
      />)}
    </g>

    {(Object.keys(stations) as Station[]).map(id => {
      const { x, y, label, ...place }: Place = stations[id]
      const className = id === 'rejected' ? styles.rejected : place.failsafe ? styles.failsafe : styles.station
      return <g key={id} className={className}>
        <circle className={styles.ring} cx={x} cy={y} r="10" />
        {place.failsafe && <circle className={styles.guard} cx={x} cy={y} r="15" />}
        <circle className={styles.core} cx={x} cy={y} r="3.6" />
        <text className={styles.label} x={x} y={place.above ? y - 22 : y + 32} textAnchor="middle">{label}</text>
      </g>
    })}
    {arrivals.map(({ station, at, tone }, index) => <circle
      key={index}
      className={styles[`${tone}Glow`]}
      cx={stations[station].x}
      cy={stations[station].y}
      r="6"
      data-kind="glow"
      data-at={at}
    />)}
  </svg>
}
