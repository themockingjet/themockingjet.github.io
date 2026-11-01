import { generateTraffic, simulate } from '../../../src/lib/lab/engine'
import { SPECIMENS, formatMetric, judge, runExperiment } from '../../../src/lib/lab/experiments'

const specimen = (id: string) => SPECIMENS.find((item) => item.id === id)!
const hypothesis = (specimenId: string, id: string) => specimen(specimenId).hypotheses.find((item) => item.id === id)!

describe('lab engine', () => {
  it('is deterministic for a seed', () => {
    const { env, policy } = specimen('binance')
    const traffic = generateTraffic(env, 42)
    expect(generateTraffic(env, 42)).toEqual(traffic)
    expect(simulate(env, policy, traffic, 42)).toEqual(simulate(env, policy, traffic, 42))
    expect(generateTraffic(env, 43)).not.toEqual(traffic)
  })

  it('delivers every job when nothing goes wrong', () => {
    const { env, policy } = specimen('discord')
    const calm = { ...env, duplicateRate: 0, errorRate: 0, outages: [], rateLimit: null }
    const traffic = generateTraffic(calm, 7)
    const run = simulate(calm, policy, traffic, 7)
    expect(run.delivered).toBe(traffic.length)
    expect(run.deadLettered + run.duplicateActions + run.failedCalls + run.rateLimited).toBe(0)
  })

  it('never repeats an action once idempotency keys are on', () => {
    const { env, policy } = specimen('discord')
    const traffic = generateTraffic(env, 3)
    expect(simulate(env, { ...policy, idempotency: false }, traffic, 3).duplicateActions).toBeGreaterThan(0)
    expect(simulate(env, { ...policy, idempotency: true }, traffic, 3).duplicateActions).toBe(0)
  })

  it('batching makes fewer calls for the same jobs', () => {
    const { env, policy } = specimen('discord')
    const traffic = generateTraffic(env, 5)
    const single = simulate(env, policy, traffic, 5)
    const batched = simulate(env, { ...policy, batch: { size: 10, waitMs: 250 } }, traffic, 5)
    expect(batched.calls).toBeLessThan(single.calls / 2)
  })
})

describe('lab experiments', () => {
  const expected = SPECIMENS.flatMap((item) => item.hypotheses.map((h) => [item.id, h.id, !(item.id === 'discord' && h.id === 'workers')] as const))

  it.each(expected)('%s %s reaches the expected verdict on several traffic seeds', (specimenId, hypothesisId, supported) => {
    for (const seed of [1, 2, 3]) {
      expect(runExperiment(specimen(specimenId), hypothesis(specimenId, hypothesisId), seed).verdict.supported).toBe(supported)
    }
  })

  it('runs control and variant on the same traffic', () => {
    const experiment = runExperiment(specimen('discord'), hypothesis('discord', 'idempotency'), 9, 3)
    experiment.control.forEach((run, i) => expect(run.events).toBe(experiment.variant[i].events))
    expect(new Set(experiment.control.map((run) => run.events)).size).toBeGreaterThan(1)
  })

  it('reports trade-offs on watched metrics', () => {
    const { verdict } = runExperiment(specimen('discord'), hypothesis('discord', 'batching'), 1)
    expect(verdict.supported).toBe(true)
    expect(verdict.costs.join(' ')).toMatch(/median delay rose/i)
  })

  it('does not support a change that only helps sometimes', () => {
    const h = hypothesis('binance', 'jitter')
    const run = (value: number) => ({ rateLimited: value }) as Parameters<typeof judge>[1][number]
    const verdict = judge(h, [run(10), run(10), run(10), run(10), run(10)], [run(2), run(2), run(2), run(12), run(12)])
    expect(verdict.supported).toBe(false)
    expect(verdict.summary).toMatch(/but only in 3 of 5 trials/)
  })

  it('formats counts and durations', () => {
    expect(formatMetric('calls', 285)).toBe('285')
    expect(formatMetric('rateLimited', 8.42)).toBe('8.4')
    expect(formatMetric('p50', 344.4)).toBe('344 ms')
    expect(formatMetric('p95', 5612)).toBe('5.6 s')
  })
})
