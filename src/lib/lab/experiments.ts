import { generateTraffic, simulate, type Bin, type Environment, type Policy, type RunResult } from './engine'

export const OUTCOMES = ['ok', 'duplicate', 'failed', 'limited'] as const satisfies readonly (keyof Bin)[]

export const OUTCOME_LABELS: Record<keyof Bin, string> = {
  ok: 'Delivered',
  duplicate: 'Repeated action',
  failed: 'Failed',
  limited: 'Rate limited',
}

export type MetricKey = 'rateLimited' | 'failedCalls' | 'calls' | 'duplicateActions' | 'p50' | 'p95' | 'recovery' | 'deadLettered'

export const METRICS: Record<MetricKey, { label: string; unit: 'count' | 'ms' }> = {
  rateLimited: { label: 'Rate-limited calls', unit: 'count' },
  failedCalls: { label: 'Failed calls', unit: 'count' },
  calls: { label: 'API calls', unit: 'count' },
  duplicateActions: { label: 'Duplicate actions', unit: 'count' },
  p50: { label: 'Median delay', unit: 'ms' },
  p95: { label: '95th percentile delay', unit: 'ms' },
  recovery: { label: 'Time to recover', unit: 'ms' },
  deadLettered: { label: 'Events given up', unit: 'count' },
}

export interface Condition { label: string; policy: Partial<Policy> }

export interface Hypothesis {
  id: string
  statement: string
  method: string
  env?: Partial<Environment>
  control: Condition
  variant: Condition
  metric: MetricKey
  watch: MetricKey[]
}

export interface Specimen {
  id: string
  name: string
  short: string
  env: Environment
  policy: Policy
  hypotheses: Hypothesis[]
}

const retry = { maxAttempts: 6, baseMs: 250, capMs: 4000, jitter: 'none' as const }
const exchangeRetry = { maxAttempts: 8, baseMs: 250, capMs: 8000, jitter: 'none' as const }

export const SPECIMENS: Specimen[] = [
  {
    id: 'binance',
    name: 'Binance trading bot',
    short: 'Binance',
    env: {
      durationMs: 20_000,
      arrivals: [{ kind: 'bursts', every: 1000, size: 16, spreadMs: 60, from: 0, to: 20_000 }],
      duplicateRate: 0,
      duplicateDelayMs: [0, 0],
      stepMs: 12,
      latencyMs: 90,
      latencySpread: 0.35,
      errorRate: 0.005,
      rateLimit: { perSecond: 30, burst: 30 },
      lockout: null,
      outages: [{ from: 6000, to: 10_000, mode: 'reject', label: 'Exchange maintenance' }],
    },
    policy: { workers: 8, timeoutMs: 2000, retry: exchangeRetry, breaker: null, idempotency: true, batch: null },
    hypotheses: [
      {
        id: 'jitter',
        statement: 'Randomising retry delays prevents a retry storm after maintenance.',
        method: 'Sixteen symbols signal at every candle close and the exchange rejects orders for four seconds. Only the retry timing changes.',
        control: { label: 'Fixed exponential backoff', policy: {} },
        variant: { label: 'Backoff with full jitter', policy: { retry: { ...exchangeRetry, jitter: 'full' } } },
        metric: 'rateLimited',
        watch: ['p95', 'deadLettered'],
      },
      {
        id: 'breaker',
        statement: 'A circuit breaker stops the bot hammering a down exchange.',
        method: 'The same four-second maintenance window. Only the circuit breaker is switched on: it opens after five failures and probes once a second.',
        control: { label: 'No circuit breaker', policy: {} },
        variant: { label: 'Circuit breaker', policy: { breaker: { threshold: 5, cooldownMs: 1000 } } },
        metric: 'failedCalls',
        watch: ['p95', 'deadLettered'],
      },
    ],
  },
  {
    id: 'discord',
    name: 'Discord marketplace bot',
    short: 'Discord',
    env: {
      durationMs: 20_000,
      arrivals: [{ kind: 'poisson', rate: 14, from: 0, to: 20_000 }],
      duplicateRate: 0.07,
      duplicateDelayMs: [150, 1500],
      stepMs: 15,
      latencyMs: 160,
      latencySpread: 0.5,
      errorRate: 0.02,
      rateLimit: { perSecond: 30, burst: 30 },
      lockout: null,
      outages: [],
    },
    policy: { workers: 6, timeoutMs: 2500, retry, breaker: null, idempotency: false, batch: null },
    hypotheses: [
      {
        id: 'idempotency',
        statement: 'Idempotency keys stop a trade being settled twice.',
        method: 'Discord redelivers about one interaction in fourteen. Only the idempotency check changes.',
        control: { label: 'No idempotency key', policy: {} },
        variant: { label: 'Idempotency key per trade', policy: { idempotency: true } },
        metric: 'duplicateActions',
        watch: ['p95', 'calls'],
      },
      {
        id: 'batching',
        statement: 'Batching listing lookups halves the calls to the marketplace.',
        method: 'The same listing traffic. Only batching changes: up to ten listings per call, waiting at most 250 milliseconds.',
        control: { label: 'One listing per call', policy: { idempotency: true } },
        variant: { label: 'Batches of up to ten', policy: { idempotency: true, batch: { size: 10, waitMs: 250 } } },
        metric: 'calls',
        watch: ['p50', 'p95'],
      },
      {
        id: 'workers',
        statement: 'Doubling the workers clears a traffic spike faster.',
        method: 'A drop pushes listings to 60 a second for four seconds while the marketplace allows 30 calls a second. Only the worker count changes.',
        env: { arrivals: [{ kind: 'poisson', rate: 14, from: 0, to: 20_000 }, { kind: 'poisson', rate: 46, from: 5000, to: 9000 }] },
        control: { label: 'Six workers', policy: { idempotency: true } },
        variant: { label: 'Twelve workers', policy: { idempotency: true, workers: 12 } },
        metric: 'p95',
        watch: ['rateLimited', 'calls'],
      },
    ],
  },
  {
    id: 'secondlife',
    name: 'SecondLife AFK bot',
    short: 'SecondLife',
    env: {
      durationMs: 30_000,
      arrivals: [{ kind: 'periodic', every: 2000, from: 0, to: 30_000 }],
      duplicateRate: 0,
      duplicateDelayMs: [0, 0],
      stepMs: 20,
      latencyMs: 140,
      latencySpread: 0.4,
      errorRate: 0.01,
      rateLimit: null,
      lockout: { attempts: 20, windowMs: 10_000, lockMs: 20_000 },
      outages: [{ from: 6000, to: 11_000, mode: 'reject', label: 'Region restart' }],
    },
    policy: { workers: 1, timeoutMs: 3000, retry: { maxAttempts: 40, baseMs: 150, capMs: 150, jitter: 'none' }, breaker: null, idempotency: true, batch: null },
    hypotheses: [
      {
        id: 'reconnect',
        statement: 'Backing off reconnects avoids a login lockout.',
        method: 'The region restarts for five seconds, and the login server locks out clients that try more than twenty times in ten seconds. Only the reconnect timing changes.',
        control: { label: 'Reconnect every 150 ms', policy: {} },
        variant: { label: 'Exponential backoff with jitter', policy: { retry: { maxAttempts: 12, baseMs: 400, capMs: 4000, jitter: 'full' } } },
        metric: 'recovery',
        watch: ['deadLettered', 'failedCalls'],
      },
      {
        id: 'timeout',
        statement: 'A longer timeout rides out region lag instead of failing.',
        method: 'The region is laggy: most inputs land in a fraction of a second, but some take several. No restart. Only the timeout changes.',
        env: { arrivals: [{ kind: 'periodic', every: 1000, from: 0, to: 30_000 }], latencyMs: 450, latencySpread: 0.85, outages: [], lockout: null },
        control: { label: 'One second timeout', policy: { timeoutMs: 1000, retry: { ...retry, jitter: 'full' } } },
        variant: { label: 'Four second timeout', policy: { timeoutMs: 4000, retry: { ...retry, jitter: 'full' } } },
        metric: 'failedCalls',
        watch: ['p95', 'p50'],
      },
    ],
  },
]

export const TRIALS = 20

export interface Verdict {
  supported: boolean
  controlMean: number
  variantMean: number
  wins: number
  summary: string
  costs: string[]
}

export interface Experiment {
  env: Environment
  control: RunResult[]
  variant: RunResult[]
  verdict: Verdict
}

export function formatMetric(key: MetricKey, value: number): string {
  if (METRICS[key].unit === 'count') return value >= 10 || Number.isInteger(value) ? String(Math.round(value)) : value.toFixed(1)
  return value < 1000 ? `${Math.round(value)} ms` : `${(value / 1000).toFixed(1)} s`
}

const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / (values.length || 1)

function meaningful(key: MetricKey, from: number, to: number) {
  const gap = Math.abs(to - from)
  return gap >= (METRICS[key].unit === 'ms' ? 50 : 1) && gap >= 0.1 * Math.max(Math.abs(from), 1)
}

export function judge(hypothesis: Hypothesis, control: RunResult[], variant: RunResult[]): Verdict {
  const { metric } = hypothesis
  const label = METRICS[metric].label
  const controlMean = mean(control.map((run) => run[metric]))
  const variantMean = mean(variant.map((run) => run[metric]))
  const wins = control.filter((run, i) => variant[i][metric] < run[metric]).length
  const losses = control.filter((run, i) => variant[i][metric] > run[metric]).length
  const trials = control.length
  const from = formatMetric(metric, controlMean)
  const to = formatMetric(metric, variantMean)
  const improved = variantMean < controlMean && meaningful(metric, controlMean, variantMean)
  const supported = improved && wins >= 0.8 * trials
  let summary: string
  if (supported) summary = `${label} fell from ${from} to ${to} on average, lower in ${wins} of ${trials} trials.`
  else if (variantMean > controlMean && meaningful(metric, controlMean, variantMean)) summary = `${label} rose from ${from} to ${to} on average, higher in ${losses} of ${trials} trials.`
  else if (improved) summary = `${label} fell from ${from} to ${to} on average, but only in ${wins} of ${trials} trials.`
  else summary = `${label} barely moved, from ${from} to ${to} on average.`
  const costs = hypothesis.watch.flatMap((key) => {
    const before = mean(control.map((run) => run[key]))
    const after = mean(variant.map((run) => run[key]))
    return after > before && meaningful(key, before, after) ? [`${METRICS[key].label} rose from ${formatMetric(key, before)} to ${formatMetric(key, after)}.`] : []
  })
  return { supported, controlMean, variantMean, wins, summary, costs }
}

export function runExperiment(specimen: Specimen, hypothesis: Hypothesis, seed: number, trials = TRIALS): Experiment {
  const env = { ...specimen.env, ...hypothesis.env }
  const control: RunResult[] = []
  const variant: RunResult[] = []
  for (let trial = 0; trial < trials; trial += 1) {
    const trialSeed = seed + trial * 7919
    const traffic = generateTraffic(env, trialSeed)
    control.push(simulate(env, { ...specimen.policy, ...hypothesis.control.policy }, traffic, trialSeed))
    variant.push(simulate(env, { ...specimen.policy, ...hypothesis.variant.policy }, traffic, trialSeed))
  }
  return { env, control, variant, verdict: judge(hypothesis, control, variant) }
}
