export type Jitter = 'none' | 'full'

export interface Policy {
  workers: number
  timeoutMs: number
  retry: { maxAttempts: number; baseMs: number; capMs: number; jitter: Jitter }
  breaker: { threshold: number; cooldownMs: number } | null
  idempotency: boolean
  batch: { size: number; waitMs: number } | null
}

export type Arrivals =
  | { kind: 'poisson'; rate: number; from: number; to: number }
  | { kind: 'bursts'; every: number; size: number; spreadMs: number; from: number; to: number }
  | { kind: 'periodic'; every: number; from: number; to: number }

export interface Outage { from: number; to: number; mode: 'reject' | 'hang'; label: string }

export interface Environment {
  durationMs: number
  arrivals: Arrivals[]
  duplicateRate: number
  duplicateDelayMs: [number, number]
  stepMs: number
  latencyMs: number
  latencySpread: number
  errorRate: number
  rateLimit: { perSecond: number; burst: number } | null
  lockout: { attempts: number; windowMs: number; lockMs: number } | null
  outages: Outage[]
}

export interface Bin { ok: number; duplicate: number; failed: number; limited: number }

export interface RunResult {
  events: number
  delivered: number
  deadLettered: number
  duplicateActions: number
  skipped: number
  calls: number
  failedCalls: number
  rateLimited: number
  blocked: number
  p50: number
  p95: number
  recovery: number
  endMs: number
  bins: Bin[]
}

export interface Delivery { id: number; at: number }

export const BIN_MS = 250
const DRAIN_MS = 30_000

export function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function logNormal(random: () => number, median: number, spread: number): number {
  const z = Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random())
  return median * Math.exp(spread * z)
}

/** Traffic uses its own random stream so control and variant see identical deliveries. */
export function generateTraffic(env: Environment, seed: number): Delivery[] {
  const random = rng(seed)
  const deliveries: Delivery[] = []
  let id = 0
  const add = (at: number) => {
    if (at < 0 || at >= env.durationMs) return
    deliveries.push({ id, at })
    if (random() < env.duplicateRate) {
      const [min, max] = env.duplicateDelayMs
      deliveries.push({ id, at: at + min + random() * (max - min) })
    }
    id += 1
  }
  const gap = (rate: number) => -Math.log(1 - random()) * (1000 / rate)
  for (const phase of env.arrivals) {
    if (phase.kind === 'poisson') {
      for (let t = phase.from + gap(phase.rate); t < phase.to; t += gap(phase.rate)) add(t)
    } else if (phase.kind === 'bursts') {
      for (let t = phase.from; t < phase.to; t += phase.every) for (let i = 0; i < phase.size; i += 1) add(t + random() * phase.spreadMs)
    } else {
      for (let t = phase.from; t < phase.to; t += phase.every) add(t)
    }
  }
  return deliveries.sort((a, b) => a.at - b.at)
}

interface Job { id: number; attempt: number; queuedAt: number }
type Outcome = 'ok' | 'failed' | 'limited' | 'blocked'
type SimEvent = { type: 'arrive'; job: Job } | { type: 'dispatch' } | { type: 'done'; jobs: Job[]; outcome: Outcome }
interface Entry { t: number; seq: number; event: SimEvent }

class Timeline {
  private items: Entry[] = []
  private seq = 0
  get size() { return this.items.length }
  push(t: number, event: SimEvent) {
    const items = this.items
    items.push({ t, seq: this.seq++, event })
    for (let i = items.length - 1; i > 0;) {
      const parent = (i - 1) >> 1
      if (this.before(items[parent], items[i])) break
      ;[items[parent], items[i]] = [items[i], items[parent]]
      i = parent
    }
  }
  pop(): Entry {
    const items = this.items
    const top = items[0]
    const last = items.pop()!
    if (items.length) {
      items[0] = last
      for (let i = 0; ;) {
        const left = 2 * i + 1
        let next = i
        if (left < items.length && this.before(items[left], items[next])) next = left
        if (left + 1 < items.length && this.before(items[left + 1], items[next])) next = left + 1
        if (next === i) break
        ;[items[next], items[i]] = [items[i], items[next]]
        i = next
      }
    }
    return top
  }
  private before(a: Entry, b: Entry) { return a.t < b.t || (a.t === b.t && a.seq < b.seq) }
}

function percentile(sorted: number[], p: number): number {
  return sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))] : 0
}

/** Discrete-event simulation of a queue, worker pool and rate-limited dependency. */
export function simulate(env: Environment, policy: Policy, traffic: Delivery[], seed: number): RunResult {
  const random = rng(seed ^ 0x9e3779b9)
  const timeline = new Timeline()
  const queue: Job[] = []
  const firstSeen = new Map<number, number>()
  const done = new Set<number>()
  const inFlight = new Set<number>()
  const latencies: number[] = []
  const bins: Bin[] = []
  const recentCalls: number[] = []
  const stats = { events: 0, delivered: 0, deadLettered: 0, duplicateActions: 0, skipped: 0, calls: 0, failedCalls: 0, rateLimited: 0, blocked: 0 }
  const recoverFrom = env.outages.length ? Math.max(...env.outages.map((outage) => outage.to)) : -1
  let recoveredAt = -1
  let idle = policy.workers
  let tokens = env.rateLimit?.burst ?? 0
  let refilledAt = 0
  let lockedUntil = -1
  let failures = 0
  let openUntil = -1
  let probing = false
  let batchTimerAt = -1
  let lastTime = 0

  const bin = (t: number) => {
    const index = Math.floor(t / BIN_MS)
    while (bins.length <= index) bins.push({ ok: 0, duplicate: 0, failed: 0, limited: 0 })
    return bins[index]
  }

  for (const delivery of traffic) {
    if (!firstSeen.has(delivery.id)) {
      firstSeen.set(delivery.id, delivery.at)
      stats.events += 1
    }
    timeline.push(delivery.at, { type: 'arrive', job: { id: delivery.id, attempt: 0, queuedAt: delivery.at } })
  }

  const backoff = (attempt: number) => {
    const delay = Math.min(policy.retry.capMs, policy.retry.baseMs * 2 ** attempt)
    return policy.retry.jitter === 'full' ? random() * delay : delay
  }

  const retryOrGiveUp = (now: number, job: Job) => {
    if (done.has(job.id) && policy.idempotency) return
    if (job.attempt + 1 < policy.retry.maxAttempts) {
      timeline.push(now + backoff(job.attempt), { type: 'arrive', job: { ...job, attempt: job.attempt + 1 } })
    } else {
      stats.deadLettered += 1
    }
  }

  const call = (now: number, jobs: Job[]) => {
    idle -= 1
    const start = now + logNormal(random, env.stepMs, 0.3)
    if (policy.breaker && (start < openUntil || probing)) {
      stats.blocked += jobs.length
      timeline.push(start, { type: 'done', jobs, outcome: 'blocked' })
      return
    }
    if (policy.breaker && openUntil >= 0) probing = true
    stats.calls += 1
    if (env.lockout && start >= lockedUntil) {
      recentCalls.push(start)
      while (recentCalls[0] <= start - env.lockout.windowMs) recentCalls.shift()
      if (start >= lockedUntil && recentCalls.length > env.lockout.attempts) lockedUntil = start + env.lockout.lockMs
    }
    if (env.rateLimit) {
      tokens = Math.min(env.rateLimit.burst, tokens + ((start - refilledAt) / 1000) * env.rateLimit.perSecond)
      refilledAt = start
    }
    const outage = env.outages.find((o) => start >= o.from && start < o.to)
    let outcome: Outcome = 'ok'
    let latency = logNormal(random, env.latencyMs, env.latencySpread)
    if (start < lockedUntil) {
      outcome = 'failed'
      latency = 40
    } else if (outage) {
      outcome = 'failed'
      latency = outage.mode === 'hang' ? policy.timeoutMs : 30
    } else if (env.rateLimit && tokens < 1) {
      outcome = 'limited'
      latency = 20
    } else {
      if (env.rateLimit) tokens -= 1
      if (latency > policy.timeoutMs) {
        outcome = 'failed'
        latency = policy.timeoutMs
      } else if (random() < env.errorRate) {
        outcome = 'failed'
      }
    }
    timeline.push(start + latency, { type: 'done', jobs, outcome })
  }

  const dispatch = (now: number) => {
    while (idle > 0 && queue.length) {
      if (policy.batch && queue.length < policy.batch.size && now - queue[0].queuedAt < policy.batch.waitMs) {
        const at = queue[0].queuedAt + policy.batch.waitMs
        if (batchTimerAt !== at) {
          batchTimerAt = at
          timeline.push(at, { type: 'dispatch' })
        }
        return
      }
      const jobs: Job[] = []
      for (const job of queue.splice(0, policy.batch?.size ?? 1)) {
        if (policy.idempotency && (done.has(job.id) || inFlight.has(job.id))) {
          stats.skipped += 1
          continue
        }
        inFlight.add(job.id)
        jobs.push(job)
      }
      if (jobs.length) call(now, jobs)
    }
  }

  const finish = (now: number, jobs: Job[], outcome: Outcome) => {
    idle += 1
    for (const job of jobs) inFlight.delete(job.id)
    if (outcome === 'ok') {
      failures = 0
      openUntil = -1
      probing = false
      if (recoverFrom >= 0 && recoveredAt < 0 && now >= recoverFrom) recoveredAt = now
      let repeats = 0
      for (const job of jobs) {
        if (done.has(job.id)) {
          stats.duplicateActions += 1
          repeats += 1
        } else {
          done.add(job.id)
          stats.delivered += 1
          latencies.push(now - firstSeen.get(job.id)!)
        }
      }
      if (repeats === jobs.length) bin(now).duplicate += 1
      else bin(now).ok += 1
      return
    }
    if (outcome === 'limited') {
      stats.rateLimited += 1
      bin(now).limited += 1
    } else if (outcome === 'failed') {
      stats.failedCalls += 1
      bin(now).failed += 1
      if (policy.breaker) {
        failures += 1
        if (probing || failures >= policy.breaker.threshold) openUntil = now + policy.breaker.cooldownMs
        probing = false
      }
    }
    for (const job of jobs) retryOrGiveUp(now, job)
  }

  while (timeline.size) {
    const { t: now, event } = timeline.pop()
    if (now > env.durationMs + DRAIN_MS) break
    lastTime = now
    if (event.type === 'arrive') queue.push({ ...event.job, queuedAt: now })
    else if (event.type === 'done') finish(now, event.jobs, event.outcome)
    dispatch(now)
  }

  latencies.sort((a, b) => a - b)
  return {
    ...stats,
    p50: percentile(latencies, 0.5),
    p95: percentile(latencies, 0.95),
    recovery: recoverFrom < 0 ? 0 : (recoveredAt < 0 ? lastTime : recoveredAt) - recoverFrom,
    endMs: Math.max(env.durationMs, bins.length * BIN_MS),
    bins,
  }
}
