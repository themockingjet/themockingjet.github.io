import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import styles from './SpaceBackground.module.css'
import type { JourneyTravel } from '../Journey/Journey'

export default function SpaceBackground() {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const element = canvas.current
    const context = element?.getContext('2d')
    if (!element || !context) return

    let seed = 7381
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
    type Star = { x: number; y: number; size: number; alpha: number; depth: number; phase: number }
    // Larger stars read as nearer, so they travel further during a warp.
    const ignite = (star: Star) => {
      const sizeRoll = random()
      star.y = random()
      star.size = sizeRoll > .985 ? 1.7 + random() * .8 : sizeRoll > .82 ? .9 + random() * .7 : .35 + random() * .65
      star.alpha = .22 + random() * .55
      star.depth = .2 + star.size * .45 + random() * .35
      star.phase = random() * Math.PI * 2
      return star
    }
    const stars = Array.from({ length: 170 }, () => ignite({ x: random(), y: 0, size: 0, alpha: 0, depth: 0, phase: 0 }))
    let frame = 0, last = 0, width = 0, height = 0, elapsed = 0, velocity = 0
    let tween: gsap.core.Tween | undefined

    // Stars that leave one edge re-enter at the other with a fresh height and brightness, so a warp lands in a new field.
    const move = (dx: number) => {
      if (!width) return
      for (const star of stars) {
        star.x += dx * star.depth / width
        if (star.x < 0 || star.x >= 1) { star.x -= Math.floor(star.x); ignite(star) }
      }
    }

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height)
      for (const star of stars) {
        const x = star.x * width
        const y = star.y * height
        const shimmer = .82 + .18 * Math.sin(time * .0012 + star.phase)
        const streak = Math.min(320, Math.abs(velocity) * star.depth)
        context.globalAlpha = star.alpha * shimmer
        if (streak > 1.5) {
          const tail = x - Math.sign(velocity) * streak
          const trail = context.createLinearGradient(tail, y, x, y)
          trail.addColorStop(0, 'rgba(181,215,226,0)')
          trail.addColorStop(1, 'rgba(181,215,226,1)')
          context.fillStyle = trail
          context.fillRect(Math.min(tail, x), y - star.size * .3, streak, Math.max(.55, star.size * .65))
        }
        context.fillStyle = '#d8edf3'
        context.beginPath()
        context.arc(x, y, star.size * .55, 0, Math.PI * 2)
        context.fill()
      }
      context.globalAlpha = 1
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      element.width = Math.round(width * ratio)
      element.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      draw(elapsed)
    }
    const animated = () => !document.hidden
    const tick = (time: number) => {
      if (!animated()) { frame = 0; return }
      if (time - last >= 33) { elapsed = time; if (!tween) move(.24); draw(elapsed); last = time }
      frame = requestAnimationFrame(tick)
    }
    const stop = () => { tween?.kill(); tween = undefined; velocity = 0 }
    const sync = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      if (animated()) frame = requestAnimationFrame(tick)
      else { stop(); draw(elapsed) }
    }
    const onTravel = (event: Event) => {
      if (!animated()) return
      const { hops = 1, duration = .7 } = (event as CustomEvent<Partial<JourneyTravel>>).detail ?? {}
      stop()
      // Moving forward through the journey sweeps the field to the left.
      const distance = -Math.sign(hops) * width * (.9 + .55 * Math.abs(hops))
      const state = { progress: 0 }
      let previous = 0
      tween = gsap.to(state, {
        progress: 1, duration, ease: 'power3.inOut',
        onUpdate: () => {
          const dx = (state.progress - previous) * distance
          previous = state.progress
          velocity = dx
          move(dx)
          draw(elapsed)
        },
        onComplete: () => { tween = undefined; velocity = 0; draw(elapsed) },
      })
    }

    resize()
    sync()
    window.addEventListener('resize', resize)
    window.addEventListener('journey-travel', onTravel)
    document.addEventListener('visibilitychange', sync)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      stop()
      window.removeEventListener('resize', resize)
      window.removeEventListener('journey-travel', onTravel)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])
  return <div className={styles.scenery} aria-hidden="true"><canvas ref={canvas} className={styles.canvas} /></div>
}
